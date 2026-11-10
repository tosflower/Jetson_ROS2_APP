#!/usr/bin/env python3
"""ROS2 全局路线/GPS 仿真与可视化，兼容 Foxy 及以上版本。

订阅：/phone/navigation/route (String JSON)、真实 GPS (String JSON 或 NavSatFix)、
/zed2i/odom (nav_msgs/msg/Odometry，live 模式)。三种源数据独立，不融合或相互纠偏。
仿真：发布 /route_sim/gps (NavSatFix/WGS84)，显示位置只由 GPS 订阅回调更新。
演示：额外发布隔离命名的 /route_sim/route (String)，无需手机或网关。
ROS 回调和 Matplotlib 界面在同一线程轮询，不在 ROS 回调中操作其他线程的 GUI。
"""

import argparse
from collections import deque
from datetime import datetime
import json
import math
from pathlib import Path
import random
import sys
import textwrap
import time
from typing import Any, Callable, Deque, Dict, List, Optional, Sequence, Tuple

import rclpy
from rclpy.node import Node
from rclpy.qos import QoSProfile, ReliabilityPolicy
from sensor_msgs.msg import NavSatFix
from nav_msgs.msg import Odometry
from std_msgs.msg import Float64, String

from route_geometry import (Coordinate, LocalFrame, Route, coordinate, demo_route_payload, distance_m,
                            finite_number, gcj02_to_wgs84, parse_route, wgs84_to_gcj02)
from odometry_comparison import OdometryComparison, odom_sample


class RouteSimulationNode(Node):
    """所有坐标显示前统一为 GCJ-02；仿真 GPS 保持标准 WGS84 消息语义。"""

    def __init__(self, options: argparse.Namespace) -> None:
        super().__init__("route_gps_simulator")
        self.options = options
        self.route: Optional[Route] = None
        self.route_version = 0
        self.route_packets = 0
        self.route_records: List[Dict[str, Any]] = []
        self.gps_packets = 0
        self.last_gps: Optional[Coordinate] = None
        self.last_gcj: Optional[Coordinate] = None
        self.gps_timestamp = 0.0
        self.gps_accuracy: Optional[float] = None
        self.heading_degrees: Optional[float] = None
        self.heading_received_at: Optional[float] = None
        self.heading_packets = 0
        self.gps_records: List[Dict[str, Any]] = []
        self.heading_records: List[Dict[str, Any]] = []
        self.odometry = OdometryComparison(options.odom_break_gap_s)
        self.odom_packets = 0
        self.odom_received_packets = 0
        self._last_odom_received_ns = 0
        self._route_started_ns = 0
        self.odom_notice = "等待 GPS 和全局路径，暂不记录里程计"
        self._live_frame: Optional[LocalFrame] = (LocalFrame(tuple(options.odom_origin))
                                                if options.odom_origin else None)
        # 每条规划对应一轮记录；换路前保存，换路后清空上一轮轨迹。
        self.trail: Deque[Coordinate] = deque()
        self.before_route_reset: Optional[Callable[[], None]] = None
        self.along_m = 0.0
        self.paused = False
        self.notice = "等待路线消息；请在手机重新规划一次"
        self._random = random.Random(options.seed)
        self._last_tick = time.monotonic()
        self._last_demo_publish = -math.inf
        self._demo_payload: Optional[Dict[str, Any]] = None
        if options.mode == "demo":
            self._demo_payload = (json.loads(Path(options.route_file).read_text(encoding="utf-8"))
                                  if options.route_file else demo_route_payload())
            if parse_route(self._demo_payload) is None:
                raise ValueError("演示文件不能是空路线")
        self.create_subscription(String, options.route_topic, self.on_route, QoSProfile(depth=10))
        # BEST_EFFORT 订阅兼容常见传感器发布者，也能接收网关的 RELIABLE 发布。
        gps_qos = QoSProfile(depth=10, reliability=ReliabilityPolicy.BEST_EFFORT)
        gps_type = NavSatFix if options.gps_type == "navsatfix" else String
        self.create_subscription(gps_type, options.gps_topic, self.on_gps, gps_qos)
        if options.mode == "live":
            self.create_subscription(Float64, options.heading_topic, self.on_heading, gps_qos)
            self.create_subscription(Odometry, options.odom_topic, self.on_odometry, gps_qos)
        self.gps_publisher = (self.create_publisher(NavSatFix, options.gps_topic, 10)
                              if options.mode != "live" else None)
        self.demo_publisher = (self.create_publisher(String, options.route_topic, 10)
                               if self._demo_payload is not None else None)
        self.create_timer(1.0 / options.rate_hz, self.tick)
        self.get_logger().info("模式=%s；路线=%s；GPS=%s (%s)" % (
            options.mode, options.route_topic, options.gps_topic, options.gps_type))

    def on_route(self, message: String) -> None:
        """换路或清除时先保存旧轮记录，再清空轨迹与里程计局部原点。"""
        try:
            route = parse_route(message.data)
        except (ValueError, TypeError, KeyError) as error:
            self.notice = "路线被拒绝：%s" % error
            self.get_logger().warning(self.notice)
            return
        self.route_packets += 1
        if route == self.route:
            return
        # 绘图与 ROS 回调位于同一线程；在替换路线和清空轨迹之前保存旧记录。
        if self.before_route_reset is not None:
            self.before_route_reset()
        # 规划消息通常没有统一采样时钟，单独记录接收时刻与完整原始 JSON。
        self.route_records.append({"received_at_ms": time.time() * 1000, "data": json.loads(message.data)})
        self.route = route
        self.route_version += 1
        self.along_m = 0.0
        self._last_tick = time.monotonic()
        self.trail.clear()
        self.gps_records.clear()
        self.heading_records.clear()
        self.odometry = OdometryComparison(self.options.odom_break_gap_s)
        self.odom_packets = 0
        self._route_started_ns = time.time_ns() if route else 0
        self.odom_notice = "等待 GPS 和本轮 ZED 采样" if route else "路线已清除，里程计停止记录"
        if self.options.mode != "live":
            self.last_gps = self.last_gcj = None
            self.gps_timestamp = 0.0
        self.notice = ("已接收全部路径与航点" if route else "手机已清除路线")
        if route:
            self.get_logger().info("收到路线 %s：%d 个路径点，%d 个航点，%.1f 米" % (
                route.route_id, len(route.path), len(route.waypoints), route.length_m))

    def on_gps(self, message: Any) -> None:
        """显示、轨迹均由真实收到的定位包更新，不直接读取理想仿真位置。"""
        try:
            if isinstance(message, NavSatFix):
                if message.status.status < 0:
                    raise ValueError("GPS 尚未定位")
                point = coordinate([message.longitude, message.latitude])
                stamp = message.header.stamp.sec + message.header.stamp.nanosec / 1e9
                covariance = message.position_covariance
                accuracy = (math.sqrt(max(covariance[0], covariance[4]))
                            if message.position_covariance_type > 0
                            and all(math.isfinite(covariance[i]) and covariance[i] >= 0 for i in (0, 4))
                            else None)
            else:
                payload = json.loads(message.data)
                if not isinstance(payload, dict):
                    raise ValueError("GPS JSON 必须为对象")
                # 官方转换话题必须携带坐标系；避免把原始 GPS 静默当成高德坐标。
                system = self.options.gps_coordinates
                declared_system = payload.get("coordinate_system")
                if ((system == "GCJ-02" and declared_system != system)
                        or (declared_system is not None and declared_system != system)):
                    raise ValueError("GPS coordinate_system 与输入坐标系不一致")
                point = coordinate([payload.get("longitude"), payload.get("latitude")])
                stamp = finite_number(payload.get("timestamp_ms"), "timestamp_ms") / 1000
                raw_accuracy = payload.get("accuracy_m")
                accuracy = None if raw_accuracy is None else finite_number(raw_accuracy, "accuracy_m")
                if accuracy is not None and accuracy < 0:
                    raise ValueError("GPS 精度不能为负数")
            if not math.isfinite(stamp) or stamp <= 0 or stamp > time.time() + 2:
                raise ValueError("GPS 时间戳无效或晚于当前时间，请检查设备时钟")
            self.gps_packets += 1
            if stamp <= self.gps_timestamp:
                return
            system = self.options.gps_coordinates if self.options.mode == "live" else "WGS84"
            gcj = wgs84_to_gcj02(point) if system == "WGS84" else point
            self.last_gps, self.last_gcj = point, gcj
            self.gps_timestamp, self.gps_accuracy = stamp, accuracy
            if self._live_frame is None:
                self._live_frame = LocalFrame(gcj)
            raw_altitude = message.altitude if isinstance(message, NavSatFix) else payload.get("altitude")
            altitude = (float(raw_altitude) if isinstance(raw_altitude, (int, float))
                        and not isinstance(raw_altitude, bool) and math.isfinite(raw_altitude) else None)
            self.gps_records.append({"timestamp_ms": stamp * 1000, "received_at_ms": time.time() * 1000,
                                     "longitude": point[0], "latitude": point[1],
                                     "gcj02_longitude": gcj[0], "gcj02_latitude": gcj[1],
                                     "accuracy_m": accuracy, "heading_degrees": self.heading_degrees,
                                     "coordinate_system": system,
                                     "altitude": altitude})
            if not self.trail or distance_m(self.trail[-1], gcj) >= 0.05:
                self.trail.append(gcj)
            self.try_align_odometry()
        except (ValueError, TypeError, KeyError, OverflowError) as error:
            self.notice = "GPS 被拒绝：%s" % error
            self.get_logger().warning(self.notice)

    @property
    def frame(self) -> Optional[LocalFrame]:
        return self.route.frame if self.route else self._live_frame

    def on_odometry(self, message: Odometry) -> None:
        """GPS+路线就绪后才记录；每轮首个有效位姿建立零点，不重置相机驱动。"""
        try:
            sample = odom_sample(message)
            if sample.timestamp_ns / 1e9 > time.time() + 2:
                raise ValueError("里程计时间晚于当前时间，请同步设备时钟")
            if sample.timestamp_ns <= self._last_odom_received_ns:
                return
            self._last_odom_received_ns = sample.timestamp_ns
            self.odom_received_packets += 1
            if self.route is None:
                self.odom_notice = "等待全局路径，里程计暂不记录"
                return
            if sample.timestamp_ns < self._route_started_ns:
                self.odom_notice = "等待重新规划后的新 ZED 采样"
                return
            if self.odometry.alignment is None:
                if self.last_gcj is None or not -2 <= time.time() - self.gps_timestamp <= 10:
                    self.odom_notice = "等待有效 GPS，里程计暂不记录"
                    return
                limit = self.options.odom_anchor_max_accuracy_m
                if limit is not None and (self.gps_accuracy is None or self.gps_accuracy > limit):
                    self.odom_notice = "等待 GPS 满足指定精度阈值"
                    return
            if not self.odometry.add(sample):
                return
            self.odom_packets += 1
            self.try_align_odometry()
            if self.odometry.alignment is not None:
                if self.odometry.points[-1] is None:
                    self.odom_notice = "ZED 坐标系已变化；请重新规划以开始新一轮记录"
                elif self.odometry.alignment['direction_aligned']:
                    self.odom_notice = "固定变换叠图，未融合 GPS/路线"
                else:
                    self.odom_notice = "仅初始起点对齐，原始 x/y 不旋转"
        except (ValueError, TypeError, OverflowError) as error:
            self.odom_notice = "里程计被拒绝：%s" % error
            self.get_logger().warning(self.odom_notice)

    def try_align_odometry(self) -> None:
        """默认仅以初始 GPS 平移绘图起点，不估计朝向，不修改原始记录。"""
        if self.odometry.alignment is not None or not self.odometry.samples or self.route is None:
            return
        if self.options.odom_anchor == "manual":
            if self.options.odom_origin is None:
                self.odom_notice = "手工叠图需设置 --odom-origin 经度 纬度"
                return
            self.odometry.align(self.odometry.samples[0], tuple(self.options.odom_origin),
                                self.options.odom_heading_deg, "manual")
        else:
            if self.last_gcj is None or not -2 <= time.time() - self.gps_timestamp <= 10:
                self.odom_notice = "等待初始 GPS 对齐起点"
                return
            accuracy_limit = self.options.odom_anchor_max_accuracy_m
            if accuracy_limit is not None and (self.gps_accuracy is None or self.gps_accuracy > accuracy_limit):
                self.odom_notice = "等待 GPS 满足指定精度阈值"
                return
            # 就绪后的首帧作为本轮零点；GPS 只初始化一次，不持续修改里程计。
            source = "initial_gps_translation" if self.options.odom_heading_deg is None else "initial_gps_only"
            self.odometry.align(self.odometry.samples[0], self.last_gcj,
                                self.options.odom_heading_deg, source, self.gps_timestamp * 1000)
        self.odom_notice = ("仅初始起点对齐，原始 x/y 不旋转" if self.options.odom_heading_deg is None
                            else "固定变换叠图，未融合 GPS/路线")

    def on_heading(self, message: Float64) -> None:
        try:
            angle = finite_number(message.data, "heading")
            if not 0 <= angle < 360:
                raise ValueError("heading 必须在 [0, 360) 度内")
            self.heading_degrees = angle
            self.heading_received_at = time.time()
            self.heading_packets += 1
            # Float64 不带传感器时间戳，明确保存接收时间，不能伪装成采样时间。
            self.heading_records.append({"degrees": angle, "received_at_ms": self.heading_received_at * 1000})
        except (ValueError, TypeError) as error:
            self.notice = "航向被拒绝：%s" % error
            self.get_logger().warning(self.notice)

    def record_payload(self) -> Dict[str, Any]:
        route = self.route
        return {
            "version": 2, "mode": self.options.mode, "saved_at_ms": time.time() * 1000,
            "ros_domain_id": self.context.get_domain_id(),
            "topics": {"gps": self.options.gps_topic, "heading": self.options.heading_topic,
                       "route": self.options.route_topic, "odometry": self.options.odom_topic},
            "gps_coordinate_system": self.options.gps_coordinates if self.options.mode == "live" else "WGS84",
            "heading_convention": "degrees clockwise from north; true or magnetic north follows phone source",
            "route": {"route_id": route.route_id, "coordinate_system": "GCJ-02",
                      "path": list(route.path), "waypoints": [
                          {"index": point.index, "longitude": point.position[0], "latitude": point.position[1]}
                          for point in route.waypoints]} if route else None,
            "gps": self.gps_records, "heading": self.heading_records,
            "route_updates": self.route_records,
            "recording_round": {"route_started_ns": self._route_started_ns,
                                "odom_received_packets": self.odom_received_packets,
                                "odom_recorded_packets": self.odom_packets},
            "odometry": self.odometry.records(), "odometry_alignment": self.odometry.alignment,
            "gps_odom_pairs": self.odometry.matched_gps(self.gps_records, self.options.odom_sync_tolerance_s),
            "comparison": {"synchronization": "nearest source timestamps; no hardware synchronization",
                           "tolerance_s": self.options.odom_sync_tolerance_s,
                           "direction_aligned": bool(self.odometry.alignment and self.odometry.alignment['direction_aligned']),
                           "gps_fusion": False, "route_matching": False},
            "last_heading_degrees": self.heading_degrees,
            "last_heading_received_at_ms": self.heading_received_at * 1000 if self.heading_received_at else None,
        }

    def tick(self) -> None:
        now = time.monotonic()
        dt = max(0.0, min(0.5, now - self._last_tick))
        self._last_tick = now
        # 重试到本节点真正收到演示路线，避免 DDS 初始发现期间丢失首包。
        if self.demo_publisher is not None and self.route_packets == 0 and now - self._last_demo_publish >= 1:
            self.demo_publisher.publish(String(data=json.dumps(self._demo_payload, ensure_ascii=False)))
            self._last_demo_publish = now
        if self.gps_publisher is None or self.route is None:
            return
        if not self.paused:
            self.along_m = min(self.route.length_m, self.along_m + self.options.speed_mps * dt)
        ideal_gcj = self.route.point_at(self.along_m)
        # 噪声作用于收到的 GPS，理想沿线距离独立推进，便于观察定位漂移。
        x, y = self.route.frame.to_xy(ideal_gcj)
        noise = self.options.noise_m
        noisy_gcj = self.route.frame.from_xy((x + self._random.gauss(0, noise),
                                             y + self._random.gauss(0, noise)))
        longitude, latitude = gcj02_to_wgs84(noisy_gcj)
        message = NavSatFix()
        message.header.stamp = self.get_clock().now().to_msg()
        message.header.frame_id = "route_sim_gps_link"
        message.status.status = 0
        message.status.service = 1
        message.longitude, message.latitude = longitude, latitude
        message.altitude = 0.0  # 仿真场景为平面，不表示手机的实测海拔。
        message.position_covariance = [noise * noise, 0.0, 0.0, 0.0, noise * noise, 0.0, 0.0, 0.0, 0.0]
        message.position_covariance_type = 1  # COVARIANCE_TYPE_APPROXIMATED
        self.gps_publisher.publish(message)

    def restart(self) -> None:
        if self.before_route_reset is not None:
            self.before_route_reset()
        self.along_m = 0.0
        self.trail.clear()
        self.gps_records.clear()
        self.heading_records.clear()
        self.odometry = OdometryComparison(self.options.odom_break_gap_s)
        self.odom_packets = 0
        self._route_started_ns = time.time_ns() if self.route else 0
        self.odom_notice = "已重置本轮里程计，等待 GPS 和新 ZED 采样"
        self.last_gps = self.last_gcj = None
        self.gps_timestamp = 0.0
        self._last_tick = time.monotonic()


class RoutePlot:
    """等比例米制视图：完整路线、全部航点、定位点、误差圆和实际收到的轨迹。"""

    def __init__(self, node: RouteSimulationNode) -> None:
        import matplotlib.pyplot as plt
        from matplotlib import font_manager
        from matplotlib.patches import Circle
        from matplotlib.patches import FancyArrowPatch
        from matplotlib.widgets import Button

        self.node = node
        self._circle_type = Circle
        self._arrow_type = FancyArrowPatch
        installed = {font.name for font in font_manager.fontManager.ttflist}
        # Linux 的 Noto TTC 常被 Matplotlib 登记成 JP 家族，仍包含中文字符。
        font = next((name for name in ("Noto Sans CJK SC", "Noto Sans CJK JP", "Noto Serif CJK SC",
                                      "Noto Serif CJK JP", "WenQuanYi Micro Hei", "Microsoft YaHei", "SimHei")
                     if name in installed), "DejaVu Sans")
        plt.rcParams.update({"font.sans-serif": [font], "axes.unicode_minus": False})
        self.figure = plt.figure(figsize=(12, 8), facecolor="#0c1623")
        self.figure.canvas.manager.set_window_title("高德路线 / 手机 GPS / ZED 里程计")
        self.axes = self.figure.add_axes([0.08, 0.18, 0.63, 0.71])
        self.figure.text(0.08, 0.95, "全局路径、GPS 与独立里程计", fontsize=21, color="white", weight="bold")
        self.info = self.figure.text(0.75, 0.88, "", va="top", color="#c5d6e8", fontsize=9, linespacing=1.5)
        self.figure.text(0.08, 0.91, "蓝线：高德全局路径 · 青线：手机 GPS · 红线：本轮 ZED 里程计",
                         color="#a7bfd9", fontsize=9)
        self.buttons: List[Any] = []
        for x, label, callback in ((0.08, "暂停 / 继续", self.toggle_pause),
                                    (0.29, "回到起点", self.restart),
                                    (0.50, "全览路径", self.fit)):
            button = Button(self.figure.add_axes([x, 0.055, 0.18, 0.055]), label,
                            color="#c9dff4", hovercolor="#8ab9e5")
            button.on_clicked(callback)
            self.buttons.append(button)
        if node.options.mode == "live":
            for button in self.buttons[:2]:
                button.set_active(False)
                button.label.set_alpha(0.4)
        self.version = -1
        self.trail_line: Any = None
        self.gps_marker: Any = None
        self.accuracy_circle: Any = None
        self.heading_arrow: Any = None
        self._saved_record: Optional[Tuple[int, float, int, int, int]] = None
        self.update()
        node.before_route_reset = self.save_record
        self.figure.canvas.mpl_connect("close_event", self.on_close)

    def on_close(self, event: Any) -> None:
        self.save_record()

    def save_record(self) -> None:
        """保存当前完整规划与已收到的 GPS 轨迹；关闭事件和退出清理不重复保存。"""
        node = self.node
        record = (node.route_version, node.gps_timestamp, len(node.trail), node.heading_packets, node.odom_packets)
        if (node.route is None and not node.gps_records and not node.odometry.samples) or record == self._saved_record:
            return
        limits = self.axes.get_xlim(), self.axes.get_ylim()
        try:
            # 同一轮 ROS 轮询可能先收到 GPS 再收到新路线，先更新图元以免漏掉末尾轨迹。
            self.update()
            self.fit()
            directory = Path(node.options.record_dir).expanduser()
            directory.mkdir(parents=True, exist_ok=True)
            destination = directory / (datetime.now().strftime("%Y%m%d_%H%M%S_%f") + ".png")
            # 排他创建避免覆盖已有记录；微秒时间戳兼容连续快速重新规划。
            with destination.open("xb") as output:
                self.figure.savefig(output, format="png", dpi=150,
                                    facecolor=self.figure.get_facecolor())
            with destination.with_suffix(".json").open("x", encoding="utf-8") as output:
                json.dump(node.record_payload(), output, ensure_ascii=False, allow_nan=False, indent=2)
            self._saved_record = record
            print("已保存路线 / GPS / ZED 里程计记录：%s 和同名 JSON" % destination)
        except (OSError, ValueError, RuntimeError) as error:
            # 目录不可写等问题应明确提示，同时保持实时定位和后续退出清理可用。
            node.get_logger().error("路径与 GPS 轨迹保存失败：%s" % error)
        finally:
            self.axes.set_xlim(*limits[0])
            self.axes.set_ylim(*limits[1])

    def toggle_pause(self, event: Any = None) -> None:
        self.node.paused = not self.node.paused

    def restart(self, event: Any = None) -> None:
        self.node.restart()

    def fit(self, event: Any = None) -> None:
        frame = self.node.frame
        if frame is None:
            self.axes.set_xlim(-50, 50)
            self.axes.set_ylim(-50, 50)
            return
        points = [frame.to_xy(point) for point in self.node.route.path] if self.node.route else []
        points.extend(frame.to_xy(point) for point in self.node.trail)
        points.extend(frame.to_xy(point) for point in self.node.odometry.points if point is not None)
        if self.node.last_gcj:
            points.append(frame.to_xy(self.node.last_gcj))
        if not points:
            points.append((0, 0))
        xs, ys = zip(*points)
        padding = max(20.0, max(max(xs) - min(xs), max(ys) - min(ys)) * 0.12)
        self.axes.set_xlim(min(xs) - padding, max(xs) + padding)
        self.axes.set_ylim(min(ys) - padding, max(ys) + padding)

    def rebuild_route(self) -> None:
        self.version = self.node.route_version
        self.axes.clear()
        self.axes.set_facecolor("#122236")
        self.axes.set_aspect("equal", adjustable="box")
        self.axes.set_xlabel("东向 / 米", color="#bacde3")
        self.axes.set_ylabel("北向 / 米", color="#bacde3")
        self.axes.tick_params(colors="#8fa9c6")
        self.axes.grid(color="#2d4662", alpha=0.6)
        for spine in self.axes.spines.values():
            spine.set_edgecolor("#37526d")
        route = self.node.route
        if route:
            xs, ys = zip(*(route.frame.to_xy(point) for point in route.path))
            self.axes.plot(xs, ys, color="#5aa7ff", linewidth=2.5, zorder=2)
            if route.waypoints:
                wx, wy = zip(*(route.frame.to_xy(point.position) for point in route.waypoints))
                self.axes.scatter(wx, wy, s=22, color="#ffd16a", zorder=3)
                # 点全部显示；大量航点时抽稀编号文字，避免标签互相盖住。
                stride = max(1, math.ceil(len(route.waypoints) / 45))
                for point in route.waypoints[::stride]:
                    self.axes.annotate(str(point.index), route.frame.to_xy(point.position),
                                       xytext=(5, 5), textcoords="offset points", color="#ffe0a0", fontsize=8)
            self.axes.scatter([xs[0]], [ys[0]], s=75, marker="s", color="#5ed39a", zorder=4)
            self.axes.scatter([xs[-1]], [ys[-1]], s=100, marker="*", color="#ff8f88", zorder=4)
        self.trail_line, = self.axes.plot([], [], color="#51ddd3", linewidth=1.4, alpha=0.85, zorder=5)
        self.odom_line, = self.axes.plot([], [], '.-', color="#ff4040", linewidth=1.8, markersize=4, zorder=8)
        self.gps_marker, = self.axes.plot([], [], "o", color="#51ddd3", markersize=10,
                                         markeredgecolor="white", zorder=7)
        self.accuracy_circle = self._circle_type((0, 0), 0, color="#51ddd3", alpha=0.12, zorder=1)
        self.axes.add_patch(self.accuracy_circle)
        self.heading_arrow = self._arrow_type((0, 0), (0, 1), arrowstyle="-|>",
                                              mutation_scale=22, linewidth=2, color="#ffd16a", zorder=8)
        self.heading_arrow.set_visible(False)
        self.axes.add_patch(self.heading_arrow)
        self.fit()

    def update(self) -> None:
        if self.version != self.node.route_version:
            self.rebuild_route()
        node, route = self.node, self.node.route
        odom_points = node.odometry.plot_points(node.frame) if node.frame else []
        self.odom_line.set_data(*zip(*odom_points)) if odom_points else self.odom_line.set_data([], [])
        age = time.time() - node.gps_timestamp if node.gps_timestamp else None
        if node.frame and node.last_gcj:
            x, y = node.frame.to_xy(node.last_gcj)
            self.gps_marker.set_data([x], [y])
            self.gps_marker.set_color("#51ddd3" if age is not None and age <= 10 else "#8995a3")
            self.accuracy_circle.center = x, y
            self.accuracy_circle.set_radius(node.gps_accuracy or 0)
            trail = [node.frame.to_xy(point) for point in node.trail]
            self.trail_line.set_data(*zip(*trail)) if trail else self.trail_line.set_data([], [])
            self.heading_arrow.set_visible(node.heading_degrees is not None)
            if node.heading_degrees is not None:
                angle = math.radians(node.heading_degrees)
                span = self.axes.get_xlim()[1] - self.axes.get_xlim()[0]
                length = max(3.0, min(30.0, span * .05))
                self.heading_arrow.set_positions((x, y), (x + length * math.sin(angle), y + length * math.cos(angle)))
        else:
            self.gps_marker.set_data([], [])
            self.trail_line.set_data([], [])
            self.accuracy_circle.set_radius(0)
            self.heading_arrow.set_visible(False)
        mode = {"demo": "演示路线 + 模拟 GPS", "simulate": "手机路线 + 模拟 GPS", "live": "手机路线 + 真实 GPS"}[node.options.mode]
        lines = [mode, "", "路线：%s" % (route.route_id[:28] if route else "等待接收"),
                 "路径点：%d  |  航点：%d" % (len(route.path), len(route.waypoints)) if route else "",
                 "路线长度：%.1f 米" % route.length_m if route else "", "",
                 "收到路线包：%d" % node.route_packets, "收到 GPS 包：%d" % node.gps_packets]
        if node.options.mode == "live":
            lines.extend(["收到航向包：%d" % node.heading_packets,
                          "朝向：%s" % ("%.1f°" % node.heading_degrees if node.heading_degrees is not None else "等待接收"),
                          "ROS 域：%d" % node.context.get_domain_id()])
            lines.extend(["ZED 收到 / 本轮记录：%d / %d" % (node.odom_received_packets, node.odom_packets),
                          textwrap.fill("ZED：%s" % node.odom_notice, width=20)])
        if node.last_gps:
            lines.extend(["经度：%.7f" % node.last_gps[0], "纬度：%.7f" % node.last_gps[1],
                          "GPS 包龄：%.1f 秒%s" % (age, "（已过期）" if age > 10 else ""),
                          "水平精度：%s" % ("±%.1f 米" % node.gps_accuracy if node.gps_accuracy is not None else "未知")])
        if node.options.mode != "live":
            lines.extend(["", "速度：%.1f 米/秒" % node.options.speed_mps,
                          "沿线进度：%.1f 米" % node.along_m,
                          "状态：%s" % ("暂停" if node.paused else "到达终点" if route and node.along_m >= route.length_m else "运行")])
        lines.extend(["", node.notice])
        self.info.set_text("\n".join(lines))
        self.figure.canvas.draw_idle()


def parse_options(argv: Optional[Sequence[str]] = None) -> Tuple[argparse.Namespace, List[str]]:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--mode", choices=("demo", "simulate", "live"), default="demo")
    parser.add_argument("--route-topic", help="默认：demo 用 /route_sim/route，其余用 /phone/navigation/route")
    parser.add_argument("--gps-topic", help="默认：仿真用 /route_sim/gps，live 用 /phone/gps_gcj02")
    parser.add_argument("--gps-type", choices=("json", "navsatfix"))
    parser.add_argument("--heading-topic", default="/phone/heading", help="live 模式朝向角 Float64 话题")
    parser.add_argument("--odom-topic", default="/zed2i/odom", help="独立 nav_msgs/Odometry，live 模式订阅")
    parser.add_argument("--odom-anchor", choices=("manual", "gps"),
                        help="默认 gps：只将起点平移到初始 GPS；指定 odom-origin 时默认 manual")
    parser.add_argument("--odom-origin", nargs=2, type=float, metavar=("LONGITUDE", "LATITUDE"),
                        help="首个接收的 ZED 位姿所对应的 GCJ-02 经度、纬度")
    parser.add_argument("--odom-heading-deg", type=float,
                        help="可选：显式旋转叠图时的相机初始朝向；默认不旋转，记录点无需此参数")
    parser.add_argument("--odom-sync-tolerance-s", type=float, default=0.5, help="GPS/里程计最近采样配对容差")
    parser.add_argument("--odom-anchor-max-accuracy-m", type=float, help="可选 GPS 起点精度阈值；默认不限制")
    parser.add_argument("--odom-break-gap-s", type=float, default=1.0, help="里程计超过此采样间隔时红线断开")
    parser.add_argument("--gps-coordinates", choices=("WGS84", "GCJ-02"), help="live 默认 GCJ-02；原始 GPS 可显式选择 WGS84")
    parser.add_argument("--route-file", help="demo 模式加载保存的 App 路线 JSON")
    parser.add_argument("--speed-mps", type=float, default=3.0)
    parser.add_argument("--rate-hz", type=float, default=10.0)
    parser.add_argument("--noise-m", type=float, default=0.0, help="模拟 GPS 每轴高斯噪声标准差（米）")
    parser.add_argument("--seed", type=int, default=7)
    parser.add_argument("--headless", action="store_true", help="不打开窗口，结束后可输出 PNG")
    parser.add_argument("--duration", type=float, default=8.0, help="headless 运行秒数")
    parser.add_argument("--output", help="结束时保存可视化 PNG")
    parser.add_argument("--record-dir", default="~/data/gps", help="自动记录目录，默认：~/data/gps")
    options, ros_args = parser.parse_known_args(argv)
    # 保留 ROS2 重映射参数，其余拼写错误直接报出，避免静默使用错误话题。
    if ros_args and ros_args[0] != "--ros-args":
        parser.error("无法识别参数：%s" % " ".join(ros_args))
    for name in ("speed_mps", "rate_hz", "noise_m", "duration"):
        value = getattr(options, name)
        if not math.isfinite(value) or value < 0 or (name in ("rate_hz", "duration") and value == 0):
            parser.error("%s 必须为有效正数（速度和噪声可为 0）" % name)
    if options.rate_hz > 100:
        parser.error("rate-hz 不能超过 100")
    for name in ("odom_sync_tolerance_s", "odom_anchor_max_accuracy_m", "odom_break_gap_s"):
        value = getattr(options, name)
        if value is not None and (not math.isfinite(value) or value <= 0):
            parser.error("%s 必须为有效正数" % name)
    if options.odom_heading_deg is not None:
        if not math.isfinite(options.odom_heading_deg):
            parser.error("odom-heading-deg 必须为有限数值")
        options.odom_heading_deg %= 360
    options.odom_anchor = options.odom_anchor or ('manual' if options.odom_origin is not None else 'gps')
    if options.odom_origin is not None:
        try:
            LocalFrame(coordinate(options.odom_origin)).from_xy((0, 0))
        except ValueError as error:
            parser.error(str(error))
        if options.odom_anchor != "manual":
            parser.error("odom-origin 仅用于 manual 对齐")
    if options.route_file and options.mode != "demo":
        parser.error("route-file 仅用于 demo 模式")
    options.route_topic = options.route_topic or ("/route_sim/route" if options.mode == "demo" else "/phone/navigation/route")
    options.gps_topic = options.gps_topic or ("/phone/gps_gcj02" if options.mode == "live" else "/route_sim/gps")
    options.gps_type = options.gps_type or ("json" if options.mode == "live" else "navsatfix")
    # 保留原始 GPS 调试入口；默认手机链路直接绘制 GCJ-02，跳过离线近似转换。
    options.gps_coordinates = options.gps_coordinates or (
        "WGS84" if options.mode != "live" or options.gps_type == "navsatfix"
        or options.gps_topic in ("/phone/gps", "/phone/gps_data") else "GCJ-02")
    if options.gps_topic == "/phone/gps_gcj02" and (options.gps_type != "json" or options.gps_coordinates != "GCJ-02"):
        parser.error("/phone/gps_gcj02 固定使用 GCJ-02 JSON")
    if options.mode != "live" and (options.gps_type != "navsatfix" or options.gps_coordinates != "WGS84"):
        parser.error("仿真 GPS 固定使用 WGS84 NavSatFix")
    if options.mode != "live" and options.gps_topic.startswith("/phone/"):
        parser.error("仿真 GPS 请使用独立话题，不能覆盖 /phone/ 实测数据")
    return options, ros_args


def main(argv: Optional[Sequence[str]] = None) -> int:
    options, ros_args = parse_options(argv)
    if options.headless:
        import matplotlib
        matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    rclpy.init(args=ros_args)
    node: Optional[RouteSimulationNode] = None
    plot: Optional[RoutePlot] = None
    try:
        node = RouteSimulationNode(options)
        plot = RoutePlot(node)
        if options.headless:
            deadline = time.monotonic() + options.duration
            while rclpy.ok() and time.monotonic() < deadline:
                rclpy.spin_once(node, timeout_sec=0.02)
            plot.update()
            if node.route is None or node.gps_packets == 0:
                node.get_logger().error("未收到有效路线或 GPS；请检查发布者、话题与 ROS_DOMAIN_ID")
                return 1
        else:
            def refresh() -> None:
                if not rclpy.ok():
                    plt.close(plot.figure)
                    return
                for _ in range(32):
                    rclpy.spin_once(node, timeout_sec=0)
                plot.update()

            timer = plot.figure.canvas.new_timer(interval=100)
            timer.add_callback(refresh)
            timer.start()
            plt.show()
            timer.stop()
        if options.output:
            destination = Path(options.output).expanduser()
            destination.parent.mkdir(parents=True, exist_ok=True)
            plot.figure.savefig(str(destination), dpi=150, facecolor=plot.figure.get_facecolor())
            print("已保存可视化：%s" % destination)
        print("路线包=%d，GPS包=%d，航向包=%d，GPS轨迹点=%d" % (
            node.route_packets, node.gps_packets, node.heading_packets, len(node.trail)))
        return 0
    except KeyboardInterrupt:
        return 0
    finally:
        if plot is not None:
            # 也覆盖 Ctrl+C、无窗口模式和正常异常退出；强制杀进程无法执行此清理。
            plot.save_record()
            plot.node.before_route_reset = None
            plt.close(plot.figure)
        if node is not None:
            node.destroy_node()
        if rclpy.ok():
            rclpy.shutdown()


if __name__ == "__main__":
    sys.exit(main())
