"""独立里程计记录与固定二维叠图变换，不进行 GPS 融合或路线匹配。"""

import bisect
import math
import time
from dataclasses import dataclass
from typing import Any, Dict, List, Optional, Sequence, Tuple

from route_geometry import Coordinate, LocalFrame, distance_m, finite_number


@dataclass(frozen=True)
class OdomSample:
    timestamp_ns: int
    frame_id: str
    child_frame_id: str
    position: Tuple[float, float, float]
    orientation: Tuple[float, float, float, float]
    covariance: Tuple[float, ...]
    received_at_ms: float = 0.0

    @property
    def yaw(self) -> float:
        x, y, z, w = self.orientation
        return math.atan2(2 * (w * z + x * y), 1 - 2 * (y * y + z * z))

    def record(self) -> Dict[str, Any]:
        return {"timestamp_ns": self.timestamp_ns, "timestamp_ms": self.timestamp_ns / 1e6,
                "received_at_ms": self.received_at_ms,
                "frame_id": self.frame_id, "child_frame_id": self.child_frame_id,
                "position_m": list(self.position), "orientation_xyzw": list(self.orientation),
                "pose_covariance": list(self.covariance)}


def odom_sample(message: Any) -> OdomSample:
    """校验真实 Odometry 字段；零四元数、非有限数及缺失坐标系不进入轨迹。"""
    stamp = message.header.stamp
    if stamp.sec < 0 or not 0 <= stamp.nanosec < 1000000000:
        raise ValueError("里程计时间戳无效")
    timestamp_ns = stamp.sec * 1000000000 + stamp.nanosec
    if timestamp_ns <= 0 or not message.header.frame_id or not message.child_frame_id:
        raise ValueError("里程计缺少采样时间或坐标系")
    p, q = message.pose.pose.position, message.pose.pose.orientation
    position = tuple(finite_number(v, "position") for v in (p.x, p.y, p.z))
    orientation = tuple(finite_number(v, "orientation") for v in (q.x, q.y, q.z, q.w))
    norm = math.sqrt(sum(v * v for v in orientation))
    if abs(norm - 1) > 0.01:
        raise ValueError("里程计四元数必须归一化")
    covariance = tuple(finite_number(v, "covariance") for v in message.pose.covariance)
    if len(covariance) != 36 or any(covariance[i] < 0 for i in (0, 7, 14, 21, 28, 35)):
        raise ValueError("里程计协方差无效")
    return OdomSample(timestamp_ns, message.header.frame_id, message.child_frame_id,
                      position, tuple(v / norm for v in orientation), covariance, time.time() * 1000)


class OdometryComparison:
    """每轮采样独立保存，GPS 不持续纠偏；换路时由调用方新建一轮。"""

    def __init__(self, break_gap_s: float = 1.0) -> None:
        self.samples: List[OdomSample] = []
        self.points: List[Optional[Coordinate]] = []
        self.alignment: Optional[Dict[str, Any]] = None
        self._anchor: Optional[OdomSample] = None
        self._frame: Optional[LocalFrame] = None
        self._rotation = 0.0
        self._latest_ns: Dict[Tuple[str, str], int] = {}
        self.break_gap_s = break_gap_s

    def add(self, sample: OdomSample) -> bool:
        key = sample.frame_id, sample.child_frame_id
        if sample.timestamp_ns <= self._latest_ns.get(key, 0):
            return False
        self._latest_ns[key] = sample.timestamp_ns
        self.samples.append(sample)
        self.points.append(self.project(sample))
        return True

    def project(self, sample: OdomSample) -> Optional[Coordinate]:
        anchor = self._anchor
        if anchor is None or self._frame is None:
            return None
        if (sample.frame_id, sample.child_frame_id) != (anchor.frame_id, anchor.child_frame_id):
            return None
        dx, dy = sample.position[0] - anchor.position[0], sample.position[1] - anchor.position[1]
        c, s = math.cos(self._rotation), math.sin(self._rotation)
        return self._frame.from_xy((c * dx - s * dy, s * dx + c * dy))

    def align(self, anchor: OdomSample, origin: Coordinate, heading_deg: Optional[float],
              source: str, gps_timestamp_ms: Optional[float] = None) -> None:
        if self.alignment is not None:
            return
        self._anchor, self._frame = anchor, LocalFrame(origin)
        # 默认只平移，不读取或推算朝向。只有用户显式提供朝向时才旋转绘图副本。
        self._rotation = 0.0 if heading_deg is None else math.radians(90 - heading_deg) - anchor.yaw
        self.alignment = {"source": source, "origin_gcj02": list(origin),
                          "camera_heading_deg": heading_deg, "rotation_rad": self._rotation,
                          "odom_anchor": anchor.record(), "gps_timestamp_ms": gps_timestamp_ms,
                          "direction_aligned": heading_deg is not None,
                          "gps_fusion": False, "route_matching": False}
        self.points = [self.project(sample) for sample in self.samples]

    def align_nearest_gps(self, origin: Coordinate, timestamp_ms: float,
                          heading_deg: Optional[float], tolerance_s: float) -> bool:
        if self.alignment is not None or not self.samples:
            return False
        anchor = min(self.samples, key=lambda item: abs(item.timestamp_ns / 1e6 - timestamp_ms))
        if abs(anchor.timestamp_ns / 1e6 - timestamp_ms) > tolerance_s * 1000:
            return False
        source = "initial_gps_translation" if heading_deg is None else "initial_gps_only"
        self.align(anchor, origin, heading_deg, source, timestamp_ms)
        return True

    def clear_records(self) -> None:
        """仅清空采样并保留本轮变换；完整换路重置应新建本类。"""
        self.samples.clear()
        self.points.clear()

    def plot_points(self, frame: LocalFrame) -> List[Coordinate]:
        result: List[Coordinate] = []
        previous: Optional[OdomSample] = None
        for sample, point in zip(self.samples, self.points):
            if point is None:
                result.append((math.nan, math.nan))
                previous = None
                continue
            if previous is not None and (sample.timestamp_ns - previous.timestamp_ns) / 1e9 > self.break_gap_s:
                result.append((math.nan, math.nan))
            result.append(frame.to_xy(point))
            previous = sample
        return result

    def records(self) -> List[Dict[str, Any]]:
        result: List[Dict[str, Any]] = []
        for sample, point in zip(self.samples, self.points):
            same_frame = self._anchor is not None and (
                sample.frame_id, sample.child_frame_id) == (self._anchor.frame_id, self._anchor.child_frame_id)
            relative = ([sample.position[i] - self._anchor.position[i] for i in range(3)]
                        if same_frame else None)
            result.append({**sample.record(), "relative_position_m": relative,
                           "aligned_gcj02": list(point) if point else None})
        return result

    def matched_gps(self, gps_records: Sequence[Dict[str, Any]], tolerance_s: float) -> List[Dict[str, Any]]:
        """仅导出最近时间配对和差值，不改变任何源数据，也不宣称硬件同步。"""
        pairs = sorted((sample.timestamp_ns, point) for sample, point in zip(self.samples, self.points)
                       if point is not None)
        stamps = [item[0] for item in pairs]
        result: List[Dict[str, Any]] = []
        for gps in gps_records:
            stamp = gps["timestamp_ms"] * 1e6
            index = bisect.bisect_left(stamps, stamp)
            candidates = [i for i in (index - 1, index) if 0 <= i < len(pairs)]
            if not candidates:
                continue
            nearest = min(candidates, key=lambda i: abs(stamps[i] - stamp))
            ns, point = pairs[nearest]
            delta_ms = (ns - stamp) / 1e6
            if abs(delta_ms) > tolerance_s * 1000:
                continue
            gps_point = (gps["gcj02_longitude"], gps["gcj02_latitude"])
            result.append({"gps_timestamp_ms": gps["timestamp_ms"], "odom_timestamp_ns": ns,
                           "delta_ms": delta_ms, "gps_gcj02": list(gps_point),
                           "odom_aligned_gcj02": list(point), "separation_m": distance_m(gps_point, point)})
        return result
