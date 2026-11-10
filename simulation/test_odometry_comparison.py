"""固定变换、时间配对和轨迹分段的确定性回归，不依赖相机或 DDS。"""

import math
import unittest

from odometry_comparison import OdomSample, OdometryComparison
from route_geometry import LocalFrame


def sample(ns: int, x: float, y: float, yaw: float = 0.0, frame: str = "zed_session_a") -> OdomSample:
    return OdomSample(ns, frame, "zed_camera", (x, y, 0.0),
                      (0.0, 0.0, math.sin(yaw / 2), math.cos(yaw / 2)), (0.0,) * 36)


class OdometryComparisonTests(unittest.TestCase):
    def test_initial_gps_without_heading_only_translates(self) -> None:
        trace = OdometryComparison()
        trace.add(sample(1000000000, 0, 0, math.pi / 2))
        self.assertTrue(trace.align_nearest_gps((113.38, 23.05), 1000, None, 0.1))
        trace.add(sample(1100000000, 10, 4, math.pi / 2))
        east, north = LocalFrame((113.38, 23.05)).to_xy(trace.points[-1])
        self.assertAlmostEqual(east, 10, places=6)
        self.assertAlmostEqual(north, 4, places=6)
        self.assertEqual(trace.alignment['rotation_rad'], 0)
        self.assertFalse(trace.alignment['direction_aligned'])

    def test_manual_transform_uses_anchor_yaw_and_heading(self) -> None:
        trace = OdometryComparison()
        first = sample(1000000000, 2, 3, math.pi / 2)
        trace.add(first)
        trace.add(sample(1100000000, 2, 13, math.pi / 2))
        origin = (113.38, 23.05)
        trace.align(first, origin, 90, "manual")
        east, north = LocalFrame(origin).to_xy(trace.points[-1])
        self.assertAlmostEqual(east, 10, places=6)
        self.assertAlmostEqual(north, 0, places=6)
        self.assertEqual(trace.samples[0], first)
        locked = dict(trace.alignment)
        trace.align(first, (114, 24), 0, "another_origin")
        self.assertEqual(trace.alignment, locked, "不能用后续 GPS/路线重新锁定红线")

    def test_north_heading_and_duplicate_out_of_order(self) -> None:
        trace = OdometryComparison()
        first = sample(1000000000, 0, 0)
        trace.add(first)
        trace.align(first, (113.38, 23.05), 0, "manual")
        self.assertFalse(trace.add(first))
        self.assertFalse(trace.add(sample(900000000, 5, 0)))
        trace.add(sample(1100000000, 10, 0))
        east, north = LocalFrame((113.38, 23.05)).to_xy(trace.points[-1])
        self.assertAlmostEqual(east, 0, places=6)
        self.assertAlmostEqual(north, 10, places=6)

    def test_restart_frame_and_tracking_gap_are_not_joined(self) -> None:
        trace = OdometryComparison(break_gap_s=1)
        first = sample(1000000000, 0, 0)
        trace.add(first)
        trace.align(first, (113.38, 23.05), 90, "manual")
        trace.add(sample(3000000000, 10, 0))
        trace.add(sample(3100000000, 0, 0, frame="zed_session_b"))
        self.assertIsNone(trace.points[-1])
        points = trace.plot_points(LocalFrame((113.38, 23.05)))
        self.assertTrue(math.isnan(points[1][0]), "失锁间隔不能画成连续运动")
        self.assertTrue(math.isnan(points[-1][0]), "重启后新原点不能沿用旧变换")
        self.assertEqual(trace.records()[-1]["frame_id"], "zed_session_b")

    def test_initial_gps_requires_timestamp_match_and_stays_fixed(self) -> None:
        trace = OdometryComparison()
        trace.add(sample(1000000000, 0, 0))
        self.assertFalse(trace.align_nearest_gps((113.38, 23.05), 2000, 90, 0.1))
        self.assertTrue(trace.align_nearest_gps((113.38, 23.05), 1050, 90, 0.1))
        old = trace.alignment
        self.assertFalse(trace.align_nearest_gps((114, 24), 1050, 0, 0.1))
        self.assertEqual(trace.alignment, old)
        trace.clear_records()
        self.assertEqual(trace.alignment, old)

    def test_export_nearest_pairs_does_not_change_sources(self) -> None:
        trace = OdometryComparison()
        first = sample(1000000000, 0, 0)
        trace.add(first)
        trace.align(first, (113.38, 23.05), 90, "manual")
        gps = [{"timestamp_ms": 1050, "gcj02_longitude": 113.38, "gcj02_latitude": 23.05},
               {"timestamp_ms": 3000, "gcj02_longitude": 113.38, "gcj02_latitude": 23.05}]
        records = trace.records()
        pairs = trace.matched_gps(gps, 0.1)
        self.assertEqual(len(pairs), 1)
        self.assertEqual(pairs[0]["delta_ms"], -50)
        self.assertEqual(pairs[0]["separation_m"], 0)
        self.assertEqual(trace.records(), records)
        self.assertEqual(len(gps), 2)


if __name__ == "__main__":
    unittest.main()
