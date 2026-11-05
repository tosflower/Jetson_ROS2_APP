"""路线解析、局部坐标和 GPS 仿真几何；不依赖 ROS 或图形环境。"""

import bisect
import json
import math
from dataclasses import dataclass
from typing import Any, Dict, Optional, Tuple

Coordinate = Tuple[float, float]
EARTH_RADIUS_M = 6371008.8


def finite_number(value: Any, name: str) -> float:
    """拒绝 bool、空值和非有限数，防止坏消息污染绘图范围。"""
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value):
        raise ValueError("%s 必须为有限数值" % name)
    return float(value)


def coordinate(value: Any) -> Coordinate:
    if not isinstance(value, (list, tuple)) or len(value) != 2:
        raise ValueError("坐标必须为 [经度, 纬度]")
    longitude = finite_number(value[0], "经度")
    latitude = finite_number(value[1], "纬度")
    if abs(longitude) > 180 or abs(latitude) > 90:
        raise ValueError("经纬度超出有效范围")
    return longitude, latitude


def distance_m(a: Coordinate, b: Coordinate) -> float:
    lat1, lat2 = math.radians(a[1]), math.radians(b[1])
    h = math.sin((lat2 - lat1) / 2) ** 2
    h += math.cos(lat1) * math.cos(lat2) * math.sin(math.radians(b[0] - a[0]) / 2) ** 2
    return 2 * EARTH_RADIUS_M * math.asin(min(1.0, math.sqrt(h)))


@dataclass(frozen=True)
class LocalFrame:
    """以路线起点为原点的局部二维近似：东为 x，北为 y，单位米。"""

    origin: Coordinate

    def to_xy(self, point: Coordinate) -> Coordinate:
        scale = math.cos(math.radians(self.origin[1]))
        return (EARTH_RADIUS_M * math.radians(point[0] - self.origin[0]) * scale,
                EARTH_RADIUS_M * math.radians(point[1] - self.origin[1]))

    def from_xy(self, point: Coordinate) -> Coordinate:
        scale = math.cos(math.radians(self.origin[1]))
        if abs(scale) < 1e-6:
            raise ValueError("局部绘图不支持极点附近的路线")
        return (self.origin[0] + math.degrees(point[0] / (EARTH_RADIUS_M * scale)),
                self.origin[1] + math.degrees(point[1] / EARTH_RADIUS_M))


@dataclass(frozen=True)
class Waypoint:
    index: int
    position: Coordinate


@dataclass(frozen=True)
class Route:
    route_id: str
    path: Tuple[Coordinate, ...]
    waypoints: Tuple[Waypoint, ...]
    cumulative_m: Tuple[float, ...]

    @property
    def length_m(self) -> float:
        return self.cumulative_m[-1]

    @property
    def frame(self) -> LocalFrame:
        return LocalFrame(self.path[0])

    def point_at(self, along_m: float) -> Coordinate:
        """沿完整道路折线插值，跨越转弯时不会直接切到下一稀疏航点。"""
        along = min(self.length_m, max(0.0, along_m))
        if along >= self.length_m:
            return self.path[-1]
        index = max(0, bisect.bisect_right(self.cumulative_m, along) - 1)
        start, end = self.path[index], self.path[index + 1]
        fraction = (along - self.cumulative_m[index]) / (
            self.cumulative_m[index + 1] - self.cumulative_m[index])
        return (start[0] + (end[0] - start[0]) * fraction,
                start[1] + (end[1] - start[1]) * fraction)


def parse_route(value: Any) -> Optional[Route]:
    """接收 App 路线 JSON 或 String.data 包装；空路线代表用户清除。"""
    if isinstance(value, str):
        value = json.loads(value)
    if isinstance(value, dict) and isinstance(value.get("data"), str):
        value = json.loads(value["data"])
    if not isinstance(value, dict):
        raise ValueError("路线消息必须为 JSON 对象")
    if value.get("coordinate_system") != "GCJ-02":
        raise ValueError("路线必须显式标注 coordinate_system=GCJ-02")
    if value.get("coordinate_order", "longitude_latitude") != "longitude_latitude":
        raise ValueError("路线坐标顺序必须为 longitude_latitude")
    raw_path, raw_waypoints = value.get("path", []), value.get("waypoints", [])
    if not isinstance(raw_path, list) or not isinstance(raw_waypoints, list):
        raise ValueError("path 和 waypoints 必须为数组")
    if len(raw_path) > 50000 or len(raw_waypoints) > 50000:
        raise ValueError("路线最多支持 50000 个点")
    if not raw_path and not raw_waypoints:
        if value.get("route_id") is not None:
            raise ValueError("非空路线编号缺少路径点")
        return None
    route_id = value.get("route_id")
    if not isinstance(route_id, str) or not route_id:
        raise ValueError("route_id 必须为非空字符串")
    waypoints = []
    for index, item in enumerate(raw_waypoints):
        if not isinstance(item, dict):
            raise ValueError("航点必须为对象")
        number = item.get("index", index)
        if isinstance(number, bool) or not isinstance(number, int) or number < 0:
            raise ValueError("航点 index 必须为非负整数")
        if waypoints and number <= waypoints[-1].index:
            raise ValueError("航点必须按 index 严格递增排列")
        waypoints.append(Waypoint(number, coordinate([item.get("longitude"), item.get("latitude")])))
    # 有完整 path 时始终保留其道路形状；只有输入仅有航点时才按航点顺序连接。
    source = [coordinate(point) for point in raw_path] if raw_path else [w.position for w in waypoints]
    path = []
    cumulative = [0.0]
    for point in source:
        if path:
            length = distance_m(path[-1], point)
            if length < 1e-6:
                continue
            cumulative.append(cumulative[-1] + length)
        path.append(point)
    if len(path) < 2 or cumulative[-1] < 0.01:
        raise ValueError("路线至少需要两个不重合的点")
    return Route(route_id, tuple(path), tuple(waypoints), tuple(cumulative))


def wgs84_to_gcj02(point: Coordinate) -> Coordinate:
    """离线近似转换，仅用于可视化；不是高德官方服务或测量级转换。"""
    longitude, latitude = point
    if not (72.004 <= longitude <= 137.8347 and 0.8293 <= latitude <= 55.8271):
        return point
    x, y = longitude - 105.0, latitude - 35.0
    dlat = -100 + 2 * x + 3 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * math.sqrt(abs(x))
    dlon = 300 + x + 2 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * math.sqrt(abs(x))
    ripple = (20 * math.sin(6 * x * math.pi) + 20 * math.sin(2 * x * math.pi)) * 2 / 3
    dlat += ripple + (20 * math.sin(y * math.pi) + 40 * math.sin(y * math.pi / 3)) * 2 / 3
    dlat += (160 * math.sin(y * math.pi / 12) + 320 * math.sin(y * math.pi / 30)) * 2 / 3
    dlon += ripple + (20 * math.sin(x * math.pi) + 40 * math.sin(x * math.pi / 3)) * 2 / 3
    dlon += (150 * math.sin(x * math.pi / 12) + 300 * math.sin(x * math.pi / 30)) * 2 / 3
    radians = math.radians(latitude)
    magic = 1 - 0.006693421622965943 * math.sin(radians) ** 2
    root = math.sqrt(magic)
    dlat = dlat * 180 / ((6378245.0 * (1 - 0.006693421622965943)) / (magic * root) * math.pi)
    dlon = dlon * 180 / (6378245.0 / root * math.cos(radians) * math.pi)
    return longitude + dlon, latitude + dlat


def gcj02_to_wgs84(point: Coordinate) -> Coordinate:
    """迭代反解上述近似转换，让仿真 NavSatFix 保持 WGS84 语义。"""
    guess = point
    for _ in range(8):
        converted = wgs84_to_gcj02(guess)
        error = converted[0] - point[0], converted[1] - point[1]
        guess = guess[0] - error[0], guess[1] - error[1]
        if max(abs(error[0]), abs(error[1])) < 1e-10:
            break
    return guess


def demo_route_payload() -> Dict[str, Any]:
    """人工构造的校园形状演示路线，不作为真实高德道路查询结果。"""
    frame = LocalFrame((113.388, 23.055))
    offsets = [(0, 0), (0, 70), (0, 140), (80, 140), (160, 140),
               (160, 220), (250, 220), (250, 110), (330, 110), (330, 20)]
    points = [frame.from_xy(point) for point in offsets]
    return {"version": 1, "route_id": "synthetic-campus-demo", "coordinate_system": "GCJ-02",
            "coordinate_order": "longitude_latitude", "path": points,
            "waypoints": [{"index": i, "longitude": point[0], "latitude": point[1]}
                          for i, point in enumerate(points)]}
