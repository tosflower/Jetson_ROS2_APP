"""无 DDS 的记录回归：执行真实消息回调和 Matplotlib，仅替换 ROS 节点边界。"""
import importlib.util
import json
from pathlib import Path
import tempfile
import time
import types
import unittest
from unittest.mock import patch

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from std_msgs.msg import String, Float64
from nav_msgs.msg import Odometry
from sensor_msgs.msg import NavSatFix
from route_geometry import demo_route_payload


class OfflineNode:
    def __init__(self, name):
        self.subscriptions = {}
        self.context = types.SimpleNamespace(get_domain_id=lambda: 97)

    def create_subscription(self, kind, topic, callback, qos):
        self.subscriptions[topic] = callback

    def create_timer(self, interval, callback):
        pass

    def get_logger(self):
        return types.SimpleNamespace(info=lambda *args: None, warning=lambda *args: None, error=lambda *args: None)


def runtime():
    spec = importlib.util.spec_from_file_location("route_simulator_offline_test", Path(__file__).with_name("route_simulator.py"))
    module = importlib.util.module_from_spec(spec)
    with patch("rclpy.node.Node", OfflineNode):
        spec.loader.exec_module(module)
    return module


class LiveRecordTests(unittest.TestCase):
    def setUp(self):
        self.runtime = runtime()
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        options, _ = self.runtime.parse_options(["--mode", "live", "--record-dir", self.directory.name])
        self.node = self.runtime.RouteSimulationNode(options)
        self.plot = self.runtime.RoutePlot(self.node)
        self.addCleanup(plt.close, self.plot.figure)

    def gps(self):
        self.node.on_gps(String(data=json.dumps({"longitude": 113.38, "latitude": 23.05,
            "coordinate_system": "GCJ-02",
            "accuracy_m": 5.0, "altitude": None, "timestamp_ms": int(time.time() * 1000)})))

    def test_heading_route_and_gps_are_saved_together(self):
        self.node.on_route(String(data=json.dumps(demo_route_payload())))
        self.assertIn("/phone/heading", self.node.subscriptions)
        self.node.subscriptions["/phone/heading"](Float64(data=90.0))
        self.gps()
        self.plot.update()
        self.assertTrue(self.plot.heading_arrow.get_visible())
        start, end = self.plot.heading_arrow._posA_posB
        self.assertGreater(end[0], start[0])
        self.assertAlmostEqual(end[1], start[1])
        self.plot.save_record()
        image, = Path(self.directory.name).glob("*.png")
        data = json.loads(image.with_suffix(".json").read_text())
        self.assertEqual(len(data["route"]["path"]), len(self.node.route.path))
        self.assertEqual(data["gps"][0]["longitude"], 113.38)
        self.assertEqual(data["heading"][-1]["degrees"], 90)
        self.plot.save_record()
        self.assertEqual(len(list(Path(self.directory.name).glob("*.json"))), 1)

    def test_gps_without_route_is_visible_and_saved(self):
        self.gps()
        self.plot.update()
        self.assertEqual(len(self.plot.gps_marker.get_xdata()), 1)
        self.plot.save_record()
        record, = Path(self.directory.name).glob("*.json")
        data = json.loads(record.read_text())
        self.assertIsNone(data["route"])
        self.assertEqual(len(data["gps"]), 1)

    def test_invalid_heading_does_not_replace_last_measurement(self):
        self.node.subscriptions["/phone/heading"](Float64(data=359.0))
        self.node.subscriptions["/phone/heading"](Float64(data=float("nan")))
        self.assertEqual(self.node.heading_degrees, 359)


def odometry_message(ns: int, x: float, y: float, frame: str = "zed_test") -> Odometry:
    message = Odometry()
    message.header.stamp.sec, message.header.stamp.nanosec = divmod(ns, 1000000000)
    message.header.frame_id, message.child_frame_id = frame, "zed_camera"
    message.pose.pose.position.x, message.pose.pose.position.y = float(x), float(y)
    message.pose.pose.orientation.w = 1.0
    return message


class ThreeTrackTests(unittest.TestCase):
    """按规划分轮采集：GPS+路线就绪后启动，换路/清除后重置。"""

    def setUp(self) -> None:
        self.runtime = runtime()
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        options, _ = self.runtime.parse_options(['--mode', 'live', '--record-dir', self.directory.name])
        self.node = self.runtime.RouteSimulationNode(options)
        self.plot = self.runtime.RoutePlot(self.node)
        self.addCleanup(plt.close, self.plot.figure)

    def route(self, route_id: str = 'first-planning') -> dict:
        payload = demo_route_payload()
        payload['route_id'] = route_id
        self.node.on_route(String(data=json.dumps(payload)))
        return payload

    def gps(self, longitude: float = 113.38, latitude: float = 23.05) -> None:
        self.node.on_gps(String(data=json.dumps({
            'longitude': longitude, 'latitude': latitude, 'coordinate_system': 'GCJ-02',
            'timestamp_ms': time.time_ns() / 1e6, 'accuracy_m': 5.0})))

    def emit(self, x: float, y: float = 0.0, frame: str = 'zed_test') -> Odometry:
        message = odometry_message(time.time_ns(), x, y, frame)
        self.node.on_odometry(message)
        return message

    def ready(self) -> None:
        self.route()
        self.gps()

    def test_no_recording_until_both_gps_and_route_are_ready(self) -> None:
        self.emit(0)
        self.gps()
        self.emit(10)
        self.assertEqual(self.node.odom_received_packets, 2)
        self.assertEqual(self.node.odometry.samples, [])
        self.assertEqual(self.node.odom_packets, 0)
        self.route()
        self.emit(20)
        self.emit(23, 4)
        self.assertEqual(self.node.odom_packets, 2)
        self.assertEqual(self.node.odometry.records()[0]['relative_position_m'], [0, 0, 0])
        self.assertEqual(self.node.odometry.records()[1]['relative_position_m'], [3, 4, 0])
        self.assertEqual(self.node.odometry.points[0], (113.38, 23.05))
        self.assertEqual(self.node.odometry.alignment['rotation_rad'], 0)
        self.plot.update()
        self.assertEqual(len(self.plot.odom_line.get_xdata()), 2)
        self.assertIs(self.plot.odom_line.axes, self.plot.axes)
        self.assertIs(self.plot.trail_line.axes, self.plot.axes)
        self.assertIs(self.plot.axes.lines[0].axes, self.plot.axes)
        self.assertEqual(len(self.plot.figure.axes), 4, '只保留主图与三个按钮，不另设轨迹小图')

    def test_route_before_gps_also_waits_without_recording(self) -> None:
        self.route()
        self.emit(100)
        self.assertEqual(self.node.odometry.samples, [])
        self.assertIn('GPS', self.node.odom_notice)
        self.gps()
        self.emit(200)
        self.assertEqual(self.node.odom_packets, 1)
        self.assertEqual(self.node.odometry.records()[0]['relative_position_m'], [0, 0, 0])

    def test_replanning_saves_old_round_and_resets_origin_and_lines(self) -> None:
        self.ready()
        self.emit(100)
        self.emit(110, 5)
        self.gps(113.3801, 23.0501)
        old_records = self.node.odometry.records()
        old_message_ns = self.node.odometry.samples[-1].timestamp_ns
        self.plot.update()
        old_route_line = self.plot.axes.lines[0]
        self.route('second-planning')
        self.assertEqual(self.node.odom_packets, 0)
        self.assertEqual(self.node.odometry.samples, [])
        self.assertIsNone(self.node.odometry.alignment)
        self.assertFalse(self.node.trail)
        self.plot.update()
        self.assertEqual(len(self.plot.odom_line.get_xdata()), 0)
        self.assertNotIn(old_route_line, self.plot.axes.lines)
        saved = [json.loads(p.read_text()) for p in Path(self.directory.name).glob('*.json')]
        previous = next(record for record in saved if record['route']['route_id'] == 'first-planning')
        self.assertEqual(previous['odometry'], old_records)
        # 新一轮不能混入上一条规划之后才送达的旧采样。
        self.node.on_odometry(odometry_message(old_message_ns + 1, 111, 5))
        self.assertEqual(self.node.odometry.samples, [])
        self.emit(250, 40)
        self.emit(252, 43)
        records = self.node.odometry.records()
        self.assertEqual(records[0]['position_m'], [250, 40, 0])
        self.assertEqual(records[0]['relative_position_m'], [0, 0, 0])
        self.assertEqual(records[1]['relative_position_m'], [2, 3, 0])
        self.assertEqual(self.node.odometry.points[0], self.node.last_gcj)

    def test_clear_route_removes_all_old_lines_and_stops_odom_recording(self) -> None:
        self.ready()
        self.emit(0)
        self.emit(10)
        self.plot.update()
        old_route_line = self.plot.axes.lines[0]
        self.node.on_route(String(data=json.dumps({
            'route_id': None, 'coordinate_system': 'GCJ-02', 'path': [], 'waypoints': []})))
        self.plot.update()
        self.assertIsNone(self.node.route)
        self.assertNotIn(old_route_line, self.plot.axes.lines)
        self.assertEqual(len(self.plot.odom_line.get_xdata()), 0)
        self.assertEqual(len(self.plot.trail_line.get_xdata()), 0)
        self.emit(20)
        self.assertEqual(self.node.odometry.samples, [])
        self.assertEqual(self.node.odom_packets, 0)
        self.assertTrue(list(Path(self.directory.name).glob('*.json')), '清除前应保存上一轮')

    def test_duplicate_or_invalid_route_does_not_reset_recording(self) -> None:
        self.ready()
        self.emit(0)
        self.emit(10)
        old = self.node.odometry.records()
        self.route()
        self.assertEqual(self.node.odometry.records(), old)
        self.node.on_route(String(data='{"coordinate_system":"WGS84"}'))
        self.assertEqual(self.node.odometry.records(), old)
        self.assertEqual(self.node.route.route_id, 'first-planning')

    def test_active_round_remains_independent_of_gps_and_phone_heading(self) -> None:
        self.ready()
        self.emit(0)
        self.emit(20)
        records = self.node.odometry.records()
        alignment = dict(self.node.odometry.alignment)
        route = self.node.route
        self.gps(113.40, 23.07)
        self.node.on_heading(Float64(data=270.0))
        self.assertEqual(self.node.odometry.records(), records)
        self.assertEqual(self.node.odometry.alignment, alignment)
        self.assertEqual(self.node.route, route)

    def test_invalid_duplicate_and_restarted_odom_keep_source_data_separate(self) -> None:
        self.ready()
        message = odometry_message(time.time_ns(), 0, 0)
        message.pose.pose.orientation.w = 0.0
        self.node.on_odometry(message)
        self.assertEqual(self.node.odom_packets, 0)
        message.pose.pose.orientation.w = 1.0
        self.node.on_odometry(message)
        self.node.on_odometry(message)
        self.assertEqual(self.node.odom_packets, 1)
        self.emit(0, frame='restarted_zed')
        self.assertIsNone(self.node.odometry.points[-1])
        self.assertIn('重新规划', self.node.odom_notice)

    def test_unknown_navsatfix_altitude_does_not_break_json_recording(self) -> None:
        self.node.options.gps_coordinates = 'WGS84'
        message = NavSatFix()
        message.header.stamp.sec, message.header.stamp.nanosec = divmod(time.time_ns(), 1000000000)
        message.longitude, message.latitude, message.altitude = 113.38, 23.05, float('nan')
        self.node.on_gps(message)
        payload = self.node.record_payload()
        self.assertIsNone(payload['gps'][0]['altitude'])
        json.dumps(payload, allow_nan=False)


if __name__ == "__main__":
    unittest.main()
