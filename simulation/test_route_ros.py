"""可选真实 DDS 回归：RUN_ROS_INTEGRATION=1 时启用，不使用模拟 rclpy。"""

import json
import os
from pathlib import Path
import tempfile
import time
import unittest
from typing import Any, Callable
from unittest.mock import patch

from route_geometry import demo_route_payload, distance_m, gcj02_to_wgs84


@unittest.skipUnless(os.environ.get("RUN_ROS_INTEGRATION") == "1", "设置 RUN_ROS_INTEGRATION=1 启用真实 ROS2")
class RouteRosTests(unittest.TestCase):
    def setUp(self) -> None:
        import rclpy
        from rclpy.node import Node
        from sensor_msgs.msg import NavSatFix
        from std_msgs.msg import String
        from route_simulator import RouteSimulationNode, parse_options

        self.ros = rclpy
        self.String, self.NavSatFix = String, NavSatFix
        self.node_type, self.options = RouteSimulationNode, parse_options
        self.ros.init()
        self.source = Node("route_sim_test_source")
        self.node: Any = None
        self.route_publisher = self.source.create_publisher(String, "/route_sim/test/route", 10)

    def tearDown(self) -> None:
        if self.node is not None:
            self.node.destroy_node()
        self.source.destroy_node()
        self.ros.shutdown()

    def start_node(self, mode: str, *extra: str) -> None:
        options, _ = self.options(["--mode", mode, "--route-topic", "/route_sim/test/route",
                                   "--gps-topic", "/route_sim/test/gps", "--speed-mps", "40",
                                   "--rate-hz", "20", *extra])
        self.node = self.node_type(options)

    def wait_for(self, predicate: Callable[[], bool], publish: Any = None) -> None:
        deadline = time.monotonic() + 4
        while time.monotonic() < deadline:
            if publish is not None:
                publish()
            self.ros.spin_once(self.source, timeout_sec=0)
            self.ros.spin_once(self.node, timeout_sec=0.01)
            if predicate():
                return
        self.fail("等待真实 ROS 消息超时")

    def send_route(self, payload: Any) -> Callable[[], None]:
        return lambda: self.route_publisher.publish(self.String(data=json.dumps(payload)))

    def test_phone_route_generates_gps_packets_without_shortcut(self) -> None:
        self.start_node("simulate")
        payload = demo_route_payload()
        self.wait_for(lambda: self.node.route is not None, self.send_route(payload))
        self.wait_for(lambda: self.node.gps_packets >= 4)
        self.assertEqual(len(self.node.route.path), 10)
        self.assertEqual(len(self.node.route.waypoints), 10)
        self.assertGreater(self.node.along_m, 0)
        self.assertIsNotNone(self.node.last_gps)
        self.assertLess(distance_m(self.node.last_gcj, self.node.route.path[0]), 50)
        self.assertGreater(distance_m(self.node.last_gps, self.node.last_gcj), 100)
        # 暂停运动但继续发布定位；同一路线重发不能把当前位置跳回起点。
        self.node.paused = True
        along = self.node.along_m
        packets = self.node.route_packets
        self.wait_for(lambda: self.node.route_packets > packets, self.send_route(payload))
        self.assertEqual(self.node.along_m, along)
        self.wait_for(lambda: self.node.route is None, self.send_route({
            "route_id": None, "coordinate_system": "GCJ-02", "path": [], "waypoints": []}))
        self.assertIsNone(self.node.last_gcj)
        self.assertFalse(self.node.trail)

    def test_live_json_gps_without_altitude_and_out_of_order_packets(self) -> None:
        self.start_node("live")
        self.assertIsNone(self.node.gps_publisher)
        payload = demo_route_payload()
        self.wait_for(lambda: self.node.route is not None, self.send_route(payload))
        gps_publisher = self.source.create_publisher(self.String, "/route_sim/test/gps", 10)
        expected = self.node.route.frame.from_xy((40, 60))
        gps = gcj02_to_wgs84(expected)
        stamp = int(time.time() * 1000)
        packet = {"longitude": gps[0], "latitude": gps[1], "altitude": None,
                  "accuracy_m": 3.0, "timestamp_ms": stamp}
        self.wait_for(lambda: self.node.last_gps is not None,
                      lambda: gps_publisher.publish(self.String(data=json.dumps(packet))))
        self.assertLess(distance_m(self.node.last_gcj, expected), 0.01)
        self.assertEqual(self.node.gps_accuracy, 3.0)
        packets = self.node.gps_packets
        packet.update(longitude=gps[0] + 0.01, timestamp_ms=stamp - 1000)
        self.wait_for(lambda: self.node.gps_packets > packets,
                      lambda: gps_publisher.publish(self.String(data=json.dumps(packet))))
        self.assertEqual(self.node.last_gps, gps)

    def test_live_receives_heading_and_records_route_gps_and_heading(self) -> None:
        from std_msgs.msg import Float64
        import matplotlib
        matplotlib.use("Agg")
        import matplotlib.pyplot as plt
        from route_simulator import RoutePlot

        with tempfile.TemporaryDirectory() as directory:
            self.start_node("live", "--record-dir", directory)
            plot = RoutePlot(self.node)
            self.addCleanup(plt.close, plot.figure)
            self.wait_for(lambda: self.node.route is not None, self.send_route(demo_route_payload()))
            heading = self.source.create_publisher(Float64, "/phone/heading", 10)
            self.wait_for(lambda: getattr(self.node, "heading_degrees", None) == 90,
                          lambda: heading.publish(Float64(data=90.0)))
            gps = self.source.create_publisher(self.String, "/route_sim/test/gps", 10)
            longitude, latitude = gcj02_to_wgs84(self.node.route.path[0])
            packet = {"longitude": longitude, "latitude": latitude, "altitude": None,
                      "accuracy_m": 5.0, "timestamp_ms": int(time.time() * 1000)}
            self.wait_for(lambda: self.node.last_gps is not None,
                          lambda: gps.publish(self.String(data=json.dumps(packet))))
            plot.update()
            self.assertTrue(plot.heading_arrow.get_visible())
            start, end = plot.heading_arrow._posA_posB
            self.assertGreater(end[0], start[0])
            self.assertAlmostEqual(end[1], start[1])
            plot.save_record()
            image, = Path(directory).glob("*.png")
            record = json.loads(image.with_suffix(".json").read_text())
            self.assertEqual(len(record["route"]["path"]), len(self.node.route.path))
            self.assertEqual(record["gps"][0]["longitude"], longitude)
            self.assertEqual(record["heading"][-1]["degrees"], 90)

    def test_live_shows_and_saves_gps_before_a_route_arrives(self) -> None:
        import matplotlib
        matplotlib.use("Agg")
        import matplotlib.pyplot as plt
        from route_simulator import RoutePlot

        with tempfile.TemporaryDirectory() as directory:
            self.start_node("live", "--record-dir", directory)
            plot = RoutePlot(self.node)
            self.addCleanup(plt.close, plot.figure)
            gps = self.source.create_publisher(self.String, "/route_sim/test/gps", 10)
            packet = {"longitude": 113.38, "latitude": 23.05, "accuracy_m": 10.0,
                      "timestamp_ms": int(time.time() * 1000)}
            self.wait_for(lambda: self.node.last_gps is not None,
                          lambda: gps.publish(self.String(data=json.dumps(packet))))
            plot.update()
            self.assertEqual(len(plot.gps_marker.get_xdata()), 1, "收到 GPS 后不能因缺少路线而隐藏位置")
            plot.save_record()
            image, = Path(directory).glob("*.png")
            record = json.loads(image.with_suffix(".json").read_text())
            self.assertIsNone(record["route"])
            self.assertEqual(len(record["gps"]), 1)

    def test_live_navsatfix_best_effort_and_missing_fix(self) -> None:
        from rclpy.qos import QoSProfile, ReliabilityPolicy
        self.start_node("live", "--gps-type", "navsatfix")
        self.wait_for(lambda: self.node.route is not None, self.send_route(demo_route_payload()))
        gps_publisher = self.source.create_publisher(self.NavSatFix, "/route_sim/test/gps",
                                                     QoSProfile(depth=10, reliability=ReliabilityPolicy.BEST_EFFORT))
        message = self.NavSatFix()
        message.longitude, message.latitude = gcj02_to_wgs84(self.node.route.path[0])
        message.header.stamp = self.source.get_clock().now().to_msg()
        message.status.status = 0
        message.position_covariance_type = 1
        message.position_covariance = [9.0, 0.0, 0.0, 0.0, 16.0, 0.0, 0.0, 0.0, 0.0]
        self.wait_for(lambda: self.node.last_gps is not None, lambda: gps_publisher.publish(message))
        self.assertEqual(self.node.gps_accuracy, 4.0)
        previous = self.node.last_gps
        message.status.status = -1
        self.wait_for(lambda: "GPS 尚未定位" in self.node.notice, lambda: gps_publisher.publish(message))
        self.assertEqual(self.node.last_gps, previous)

    def test_record_keeps_full_old_route_and_trail_before_replanning(self) -> None:
        import matplotlib
        matplotlib.use("Agg")
        import matplotlib.pyplot as plt
        from route_simulator import RoutePlot

        with tempfile.TemporaryDirectory() as directory:
            self.start_node("live", "--gps-coordinates", "GCJ-02", "--record-dir", directory)
            plot = RoutePlot(self.node)
            self.addCleanup(plt.close, plot.figure)
            plot.save_record()
            self.assertFalse(list(Path(directory).glob("*.png")))
            payload = demo_route_payload()
            self.node.on_route(self.String(data=json.dumps(payload)))
            first_route = self.node.route
            stamp = int(time.time() * 1000) - 10000
            # 超过旧的 5000 点上限，并在中段偏离路线，检查记录开头及偏离部分均不丢失。
            for index in range(5002):
                xy = (-1000, 2000) if index == 2500 else (index * 0.2, 0)
                longitude, latitude = first_route.frame.from_xy(xy)
                self.node.on_gps(self.String(data=json.dumps({
                    "longitude": longitude, "latitude": latitude, "timestamp_ms": stamp + index})))
            self.assertEqual(len(self.node.trail), 5002)
            original_trail = tuple(self.node.trail)
            plot.axes.set_xlim(-1, 1)
            plot.axes.set_ylim(-1, 1)
            savefig = plot.figure.savefig
            saved_routes = []

            def inspect_record(*args: Any, **kwargs: Any) -> None:
                saved_routes.append(self.node.route.route_id)
                self.assertEqual(self.node.route, first_route)
                self.assertEqual(tuple(self.node.trail), original_trail)
                self.assertEqual(len(plot.trail_line.get_xdata()), 5002)
                self.assertEqual(len(plot.axes.lines[0].get_xdata()), len(first_route.path))
                # 验证实际导出时的视野包含所有轨迹点，而非只包含终点或当前缩放区域。
                xmin, xmax = plot.axes.get_xlim()
                ymin, ymax = plot.axes.get_ylim()
                for point in original_trail:
                    x, y = first_route.frame.to_xy(point)
                    self.assertTrue(xmin <= x <= xmax and ymin <= y <= ymax)
                savefig(*args, **kwargs)

            # 同一路线重发不分段；新 route_id 即使几何相同，也代表新的一次规划。
            self.node.on_route(self.String(data=json.dumps(payload)))
            self.assertFalse(list(Path(directory).glob("*.png")))
            payload["route_id"] = "second-planning"
            with patch.object(plot.figure, "savefig", side_effect=inspect_record):
                self.node.on_route(self.String(data=json.dumps(payload)))
            self.assertEqual(saved_routes, [first_route.route_id])
            self.assertFalse(self.node.trail)
            first_image, = Path(directory).glob("*.png")
            self.assertRegex(first_image.name, r"^\d{8}_\d{6}_\d{6}\.png$")
            self.assertEqual(first_image.read_bytes()[:8], b"\x89PNG\r\n\x1a\n")
            # 关闭事件与退出清理都保存当前记录，但只生成一张新的图片。
            plot.figure.canvas.callbacks.process("close_event", None)
            plot.save_record()
            self.assertEqual(len(list(Path(directory).glob("*.png"))), 2)

    def test_clear_and_restart_save_before_discarding_gps(self) -> None:
        import matplotlib
        matplotlib.use("Agg")
        import matplotlib.pyplot as plt
        from route_simulator import RoutePlot

        with tempfile.TemporaryDirectory() as directory:
            self.start_node("simulate", "--record-dir", directory)
            plot = RoutePlot(self.node)
            self.addCleanup(plt.close, plot.figure)
            self.node.on_route(self.String(data=json.dumps(demo_route_payload())))
            message = self.NavSatFix()
            message.longitude, message.latitude = gcj02_to_wgs84(self.node.route.path[0])
            message.header.stamp = self.source.get_clock().now().to_msg()
            self.node.on_gps(message)
            self.node.restart()
            self.assertFalse(self.node.trail)
            self.assertEqual(len(list(Path(directory).glob("*.png"))), 1)
            message.header.stamp = self.source.get_clock().now().to_msg()
            self.node.on_gps(message)
            self.node.on_route(self.String(data=json.dumps({
                "route_id": None, "coordinate_system": "GCJ-02", "path": [], "waypoints": []})))
            plot.save_record()
            self.assertIsNone(self.node.route)
            self.assertEqual(len(list(Path(directory).glob("*.png"))), 2)


if __name__ == "__main__":
    unittest.main()
