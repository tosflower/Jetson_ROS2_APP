"""真实 ROS 消息封装回归：只替换相机和节点调度边界，不启动实体相机。"""

import importlib.util
import math
from pathlib import Path
import types
import unittest
from unittest.mock import Mock, patch

from nav_msgs.msg import Odometry


class OfflineNode:
    def __init__(self, name: str) -> None:
        self.publishers = []

    def create_publisher(self, kind: object, topic: str, qos: object) -> Mock:
        publisher = Mock(topic=topic)
        self.publishers.append(publisher)
        return publisher

    def create_timer(self, interval: float, callback: object) -> None:
        self.capture_callback = callback

    def get_logger(self) -> Mock:
        return Mock()

    def destroy_node(self) -> None:
        pass


class ZedOdometryTests(unittest.TestCase):
    def setUp(self) -> None:
        spec = importlib.util.spec_from_file_location("zed_odometry_test", Path(__file__).with_name("zed2i_odometry.py"))
        self.runtime = importlib.util.module_from_spec(spec)
        with patch("rclpy.node.Node", OfflineNode):
            spec.loader.exec_module(self.runtime)
        self.ns = 1700000000123456789
        self.pose = types.SimpleNamespace(
            timestamp=types.SimpleNamespace(get_nanoseconds=lambda: self.ns),
            get_translation=lambda: types.SimpleNamespace(get=lambda: [1.0, 2.0, 3.0]),
            get_orientation=lambda: types.SimpleNamespace(get=lambda: [0.0, 0.0, 0.0, 1.0]),
            pose_covariance=[0.0] * 36, pose_confidence=90)
        self.camera = Mock()
        self.camera.open.return_value = self.camera.enable_positional_tracking.return_value = "SUCCESS"
        self.camera.grab.return_value = "SUCCESS"
        self.camera.get_position.return_value = "OK"
        self.sdk = types.SimpleNamespace(
            Camera=lambda: self.camera, InitParameters=types.SimpleNamespace,
            PositionalTrackingParameters=types.SimpleNamespace,
            Pose=lambda: self.pose, RuntimeParameters=types.SimpleNamespace,
            RESOLUTION=types.SimpleNamespace(HD720="HD720"), UNIT=types.SimpleNamespace(METER="METER"),
            COORDINATE_SYSTEM=types.SimpleNamespace(RIGHT_HANDED_Z_UP_X_FWD="ROS"),
            DEPTH_MODE=types.SimpleNamespace(PERFORMANCE="PERFORMANCE"),
            ERROR_CODE=types.SimpleNamespace(SUCCESS="SUCCESS"),
            POSITIONAL_TRACKING_STATE=types.SimpleNamespace(OK="OK"),
            REFERENCE_FRAME=types.SimpleNamespace(WORLD="WORLD"))

    def test_sdk_pose_preserves_original_timestamp_and_units(self) -> None:
        message = self.runtime.pose_message(self.pose, "zed_odom", "zed_camera")
        self.assertIsInstance(message, Odometry)
        self.assertEqual(message.header.stamp.sec, 1700000000)
        self.assertEqual(message.header.stamp.nanosec, 123456789)
        self.assertEqual(message.pose.pose.position.x, 1)
        self.assertEqual(message.pose.pose.position.y, 2)
        self.assertEqual(message.pose.pose.position.z, 3)
        self.assertEqual(message.pose.pose.orientation.w, 1)
        self.assertEqual(message.twist.covariance[0], 1e6)

    def test_driver_disables_loop_closure_and_never_publishes_lost_tracking(self) -> None:
        options, _ = self.runtime.parse_options([])
        node = self.runtime.ZedOdometryNode(options, self.sdk)
        self.addCleanup(node.close_camera)
        init = self.camera.open.call_args.args[0]
        self.assertEqual(init.coordinate_units, "METER")
        self.assertEqual(init.coordinate_system, "ROS")
        tracking = self.camera.enable_positional_tracking.call_args.args[0]
        self.assertFalse(tracking.enable_area_memory)
        self.assertTrue(tracking.enable_imu_fusion)
        self.assertEqual([p.topic for p in node.publishers], ['/zed2i/odom', '/zed2i/tracking_status'])
        node.capture()
        self.assertEqual(node.publisher.publish.call_count, 1)
        node.capture()
        self.assertEqual(node.publisher.publish.call_count, 1, "重复时间戳不能伪装为新采样")
        self.ns += 33333333
        self.camera.get_position.return_value = "SEARCHING"
        node.capture()
        self.camera.grab.return_value = "ERROR"
        node.capture()
        self.assertEqual(node.publisher.publish.call_count, 1)
        node.close_camera()
        self.camera.disable_positional_tracking.assert_called_once()
        self.camera.close.assert_called_once()

    def test_invalid_sdk_pose_is_rejected(self) -> None:
        self.ns = 0
        with self.assertRaises(ValueError):
            self.runtime.pose_message(self.pose, "odom", "camera")
        self.ns = 1
        self.pose.pose_covariance[0] = math.nan
        with self.assertRaises(ValueError):
            self.runtime.pose_message(self.pose, "odom", "camera")

    def test_failed_open_closes_camera(self) -> None:
        self.camera.open.return_value = "CAMERA_NOT_DETECTED"
        with self.assertRaises(RuntimeError):
            self.runtime.ZedOdometryNode(self.runtime.parse_options([])[0], self.sdk)
        self.camera.close.assert_called_once()
        self.camera.enable_positional_tracking.assert_not_called()


if __name__ == "__main__":
    unittest.main()
