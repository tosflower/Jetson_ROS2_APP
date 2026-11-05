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


if __name__ == "__main__":
    unittest.main()
