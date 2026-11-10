#!/usr/bin/env python3
"""直接调用 ZED SDK 发布独立视觉惯性里程计，兼容 ROS2 Foxy 及以上。

发布 /zed2i/odom (nav_msgs/msg/Odometry)：米制、x 前/y 左/z 上的相机位姿。
发布 /zed2i/tracking_status (std_msgs/msg/String JSON)：追踪状态、置信度和会话坐标系。
不订阅 GPS、路线或手机航向，不进行全局融合，不广播未经标定的 TF。
"""

import argparse
import json
import math
import sys
import time
from typing import Any, List, Optional, Sequence, Tuple
import uuid

import rclpy
from rclpy.node import Node
from rclpy.qos import QoSProfile
from nav_msgs.msg import Odometry
from std_msgs.msg import String


def pose_message(pose: Any, frame_id: str, child_frame_id: str) -> Odometry:
    """使用 SDK 图像采样时间，不用发布时刻替代；SDK 协方差顺序与 ROS 一致。"""
    ns = int(pose.timestamp.get_nanoseconds())
    position = [float(v) for v in pose.get_translation().get()]
    orientation = [float(v) for v in pose.get_orientation().get()]
    covariance = [float(v) for v in pose.pose_covariance]
    if ns <= 0 or not all(math.isfinite(v) for v in position + orientation + covariance):
        raise ValueError("SDK 返回无效位姿或采样时间")
    norm = math.sqrt(sum(v * v for v in orientation))
    if (len(position) != 3 or len(orientation) != 4 or abs(norm - 1) > 0.01 or len(covariance) != 36
            or any(covariance[i] < 0 for i in (0, 7, 14, 21, 28, 35))):
        raise ValueError("SDK 返回无效四元数或协方差")
    message = Odometry()
    message.header.stamp.sec, message.header.stamp.nanosec = divmod(ns, 1000000000)
    message.header.frame_id, message.child_frame_id = frame_id, child_frame_id
    p, q = message.pose.pose.position, message.pose.pose.orientation
    p.x, p.y, p.z = position
    q.x, q.y, q.z, q.w = (v / norm for v in orientation)
    message.pose.covariance = covariance
    # 仅提供真实位姿；未测量 twist，用大方差明确表示不可用，不能当作静止速度。
    for index in (0, 7, 14, 21, 28, 35):
        message.twist.covariance[index] = 1e6
    return message


class ZedOdometryNode(Node):
    def __init__(self, options: argparse.Namespace, sdk: Any = None) -> None:
        super().__init__("zed2i_odometry")
        self.camera: Any = None
        self._tracking = False
        try:
            if sdk is None:
                import pyzed.sl as sdk
            self.sdk = sdk
            self.camera = sdk.Camera()
            init = sdk.InitParameters()
            init.camera_resolution, init.camera_fps = sdk.RESOLUTION.HD720, options.fps
            init.coordinate_units = sdk.UNIT.METER
            init.coordinate_system = sdk.COORDINATE_SYSTEM.RIGHT_HANDED_Z_UP_X_FWD
            init.depth_mode = sdk.DEPTH_MODE.PERFORMANCE
            if options.serial_number:
                init.set_from_serial_number(options.serial_number)
            result = self.camera.open(init)
            if result != sdk.ERROR_CODE.SUCCESS:
                raise RuntimeError("ZED 相机打开失败：%s" % result)
            tracking = sdk.PositionalTrackingParameters()
            # 关闭回环/区域重定位，保留独立里程计漂移供对比，不引入地图修正。
            tracking.enable_area_memory = False
            tracking.enable_pose_smoothing = False
            tracking.set_floor_as_origin = False
            tracking.set_gravity_as_origin = True
            tracking.enable_imu_fusion = True
            result = self.camera.enable_positional_tracking(tracking)
            if result != sdk.ERROR_CODE.SUCCESS:
                raise RuntimeError("ZED 位姿追踪启动失败：%s" % result)
            self._tracking = True
            self.pose, self.runtime = sdk.Pose(), sdk.RuntimeParameters()
            # 重启产生新坐标系，消费者可识别原点重置，避免静默拼接两次会话。
            self.frame_id = "zed2i_odom_" + uuid.uuid4().hex[:8]
            self.child_frame_id = "zed2i_camera_link"
            self.publisher = self.create_publisher(Odometry, options.odom_topic, QoSProfile(depth=10))
            self.status_publisher = self.create_publisher(String, options.status_topic, QoSProfile(depth=10))
            self.last_status: Optional[str] = None
            self.last_status_at = 0.0
            self.last_stamp_ns = 0
            self.create_timer(1.0 / options.fps, self.capture)
            self.get_logger().info("ZED 里程计：%s；坐标系=%s；单位米；未使用 GPS/路线" % (
                options.odom_topic, self.frame_id))
        except Exception:
            self.close_camera()
            self.destroy_node()
            raise

    def capture(self) -> None:
        """只在 grab 成功且追踪 OK 时发布；失锁期间不伪造位姿。"""
        result = self.camera.grab(self.runtime)
        if result != self.sdk.ERROR_CODE.SUCCESS:
            self.publish_status("grab_failed: %s" % result)
            return
        state = self.camera.get_position(self.pose, self.sdk.REFERENCE_FRAME.WORLD)
        self.publish_status(str(state))
        if state != self.sdk.POSITIONAL_TRACKING_STATE.OK:
            return
        try:
            message = pose_message(self.pose, self.frame_id, self.child_frame_id)
            ns = message.header.stamp.sec * 1000000000 + message.header.stamp.nanosec
            if ns <= self.last_stamp_ns:
                return
            self.publisher.publish(message)
            self.last_stamp_ns = ns
        except (ValueError, TypeError, OverflowError) as error:
            self.publish_status("invalid_pose: %s" % error)

    def publish_status(self, state: str) -> None:
        now = time.monotonic()
        if state == self.last_status and now - self.last_status_at < 1:
            return
        self.last_status, self.last_status_at = state, now
        self.status_publisher.publish(String(data=json.dumps({
            "state": state, "timestamp_ms": time.time() * 1000,
            "pose_timestamp_ns": int(self.pose.timestamp.get_nanoseconds()),
            "pose_confidence": int(self.pose.pose_confidence), "frame_id": self.frame_id,
            "coordinate_system": "x_forward_y_left_z_up", "gps_fusion": False,
        })))

    def close_camera(self) -> None:
        if self.camera is not None:
            try:
                if self._tracking:
                    self.camera.disable_positional_tracking()
            finally:
                self.camera.close()
                self.camera = None


def parse_options(argv: Optional[Sequence[str]] = None) -> Tuple[argparse.Namespace, List[str]]:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--odom-topic", default="/zed2i/odom")
    parser.add_argument("--status-topic", default="/zed2i/tracking_status")
    parser.add_argument("--fps", type=int, choices=(15, 30, 60), default=30)
    parser.add_argument("--serial-number", type=int, default=0)
    options, ros_args = parser.parse_known_args(argv)
    if ros_args and ros_args[0] != "--ros-args":
        parser.error("无法识别参数：%s" % " ".join(ros_args))
    if options.serial_number < 0:
        parser.error("serial-number 不能为负数")
    return options, ros_args


def main(argv: Optional[Sequence[str]] = None) -> int:
    options, ros_args = parse_options(argv)
    rclpy.init(args=ros_args)
    node: Optional[ZedOdometryNode] = None
    try:
        node = ZedOdometryNode(options)
        rclpy.spin(node)
        return 0
    except KeyboardInterrupt:
        return 0
    except (ImportError, RuntimeError) as error:
        print("ZED 启动失败：%s；请检查匹配的 ZED SDK、pyzed、CUDA 与 USB 连接" % error, file=sys.stderr)
        return 1
    finally:
        if node is not None:
            node.close_camera()
            node.destroy_node()
        if rclpy.ok():
            rclpy.shutdown()


if __name__ == "__main__":
    sys.exit(main())
