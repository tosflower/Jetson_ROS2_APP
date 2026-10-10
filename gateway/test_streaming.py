"""帧回执协议的边界与容量测试，无需 ROS。"""
import unittest
from streaming import StreamTiming


class TimingTests(unittest.TestCase):
    def test_clock_and_invalid_messages(self) -> None:
        timing = StreamTiming()
        pong = timing.receive({"type": "clock_ping", "client_ms": 12}, 100)
        self.assertEqual(pong['server_receive_ms'], 100)
        for data in ([], None, {"type": "clock_ping", "client_ms": float('nan')},
                     {"type": "frame_ack", "frame_id": [], "stage": "loaded"}):
            self.assertIsNone(timing.receive(data, 200))

    def test_ack_deduplication_expiry_and_bound(self) -> None:
        timing = StreamTiming()
        timing.sent(1, 100)
        ack = {"type": "frame_ack", "frame_id": 1, "stage": "received"}
        self.assertEqual(timing.receive(ack, 120)['latency_ms']['frame_received_ack_ms'], 20)
        self.assertIsNone(timing.receive(ack, 121))
        ack['stage'] = 'loaded'
        self.assertIsNone(timing.receive(ack, 30100))
        for i in range(200):
            timing.sent(i, 40000 + i)
        self.assertEqual(len(timing.pending), 128)
        self.assertNotIn(1, timing.pending)
