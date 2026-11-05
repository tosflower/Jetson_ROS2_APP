"""路线、坐标系与沿线运动回归测试，不需要 ROS 或显示器。"""

import copy
import json
import unittest

from route_geometry import (LocalFrame, demo_route_payload, distance_m, gcj02_to_wgs84,
                            parse_route, wgs84_to_gcj02)


class RouteGeometryTests(unittest.TestCase):
    def setUp(self) -> None:
        self.payload = demo_route_payload()
        self.route = parse_route(self.payload)

    def test_complete_path_takes_priority_over_sparse_waypoints(self) -> None:
        payload = copy.deepcopy(self.payload)
        payload["waypoints"] = [payload["waypoints"][0], payload["waypoints"][-1]]
        route = parse_route(json.dumps(payload))
        self.assertEqual(len(route.path), 10)
        self.assertEqual(len(route.waypoints), 2)
        # 累计到道路第二个顶点时必须落在拐点，不能沿起终点的直线切角。
        self.assertLess(distance_m(route.point_at(route.cumulative_m[2]), route.path[2]), 1e-5)
        self.assertGreater(route.length_m, distance_m(route.path[0], route.path[-1]) * 1.5)

    def test_message_wrapper_waypoints_only_and_clear(self) -> None:
        wrapped = {"data": json.dumps(self.payload)}
        self.assertEqual(parse_route(wrapped), self.route)
        payload = copy.deepcopy(self.payload)
        del payload["path"]
        self.assertEqual(parse_route(payload).path, self.route.path)
        self.assertIsNone(parse_route({"route_id": None, "coordinate_system": "GCJ-02",
                                       "path": [], "waypoints": []}))

    def test_progress_clamps_at_end_and_handles_duplicate_points(self) -> None:
        payload = copy.deepcopy(self.payload)
        payload["path"].insert(1, payload["path"][0])
        route = parse_route(payload)
        self.assertEqual(route.path, self.route.path)
        self.assertEqual(route.point_at(-10), route.path[0])
        self.assertEqual(route.point_at(route.length_m + 100), route.path[-1])
        self.assertLess(distance_m(route.point_at(route.cumulative_m[1] / 2), (
            route.path[0][0], (route.path[0][1] + route.path[1][1]) / 2)), 1e-5)

    def test_invalid_coordinate_system_and_incomplete_path_rejected(self) -> None:
        changes = [{"coordinate_system": "WGS84"}, {"coordinate_order": "latitude_longitude"},
                   {"path": [[113, 23], [float("nan"), 23]]},
                   {"path": [[113, 23], [True, 23]]}, {"path": "broken"},
                   {"path": [[113, 23], [113, 23]]}, {"route_id": None},
                   {"waypoints": [{"index": 2, "longitude": 113, "latitude": 23},
                                  {"index": 1, "longitude": 113, "latitude": 24}]}]
        for fields in changes:
            with self.subTest(fields=fields), self.assertRaises(ValueError):
                parse_route(dict(self.payload, **fields))

    def test_local_frame_preserves_east_north_axes_and_distance(self) -> None:
        frame = LocalFrame((113.388, 23.055))
        point = frame.from_xy((100, 200))
        self.assertGreater(point[0], frame.origin[0])
        self.assertGreater(point[1], frame.origin[1])
        actual = frame.to_xy(point)
        self.assertAlmostEqual(actual[0], 100, places=6)
        self.assertAlmostEqual(actual[1], 200, places=6)

    def test_gps_round_trip_and_reference_outside_china(self) -> None:
        for gps in ((113.38, 23.05), (116.4, 39.9), (121.47, 31.23)):
            gcj = wgs84_to_gcj02(gps)
            self.assertGreater(distance_m(gps, gcj), 100)
            self.assertLess(distance_m(gcj02_to_wgs84(gcj), gps), 0.01)
        # 这个断言仅验证近似算法的已知计算结果，不代表高德官方转换精度。
        beijing = wgs84_to_gcj02((116.4, 39.9))
        self.assertAlmostEqual(beijing[0], 116.4062428, places=6)
        self.assertAlmostEqual(beijing[1], 39.9014035, places=6)
        self.assertEqual(wgs84_to_gcj02((-122.4, 37.8)), (-122.4, 37.8))


if __name__ == "__main__":
    unittest.main()
