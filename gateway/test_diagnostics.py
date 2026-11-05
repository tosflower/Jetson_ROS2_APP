"""按可控单调时间验证诊断证据，不依赖手机时钟或 ROS 硬件。"""
import unittest
from diagnostics import StreamEvidence


class EvidenceTests(unittest.TestCase):
    def ack(self, stream: StreamEvidence, sequence: int, stage: str, **extra: object) -> dict:
        return {"type": "frame_ack", **stream.identity(), "frame_id": sequence,
                "stage": stage, **extra}

    def test_selection_gap_starts_at_join_and_is_client_specific(self) -> None:
        slow, fast = StreamEvidence("epoch"), StreamEvidence("epoch")
        slow.select(10, 0)
        slow.select(14, 10)
        for seq in range(10, 15):
            fast.select(seq, seq)
        self.assertEqual(slow.snapshot(20)["gateway_skipped_total"], 3)
        self.assertEqual(fast.snapshot(20)["gateway_skipped_total"], 0)
        self.assertNotEqual(slow.session, fast.session)

    def test_timeouts_are_corrected_by_late_positive_evidence(self) -> None:
        stream = StreamEvidence("epoch", deadline_ms=10)
        stream.select(1, 0)
        state = lambda now: stream.snapshot(now)["frames"][0]["state"]
        self.assertEqual(state(10), "write_timeout")
        stream.written(1, 11)
        self.assertEqual(state(21), "receive_evidence_missing")
        stream.receive(self.ack(stream, 1, "received"), 22)
        self.assertEqual(state(32), "load_evidence_missing")
        stream.receive(self.ack(stream, 1, "loaded"), 33)
        self.assertEqual(state(40), "loaded")

    def test_identity_and_malformed_ack_cannot_change_evidence(self) -> None:
        stream = StreamEvidence("epoch")
        stream.select(1, 0)
        for extra in ({"subscription_epoch": "old"}, {"stream_session": "other"},
                      {"frame_id": True}, {"frame_id": []}, {"frame_id": 999}):
            ack = self.ack(stream, 1, "loaded")
            ack.update(extra)
            self.assertFalse(stream.receive(ack, 1))
        self.assertEqual(stream.snapshot(1)["window_counts"], {"write_pending": 1})

    def test_client_replacement_requires_both_receive_events(self) -> None:
        stream = StreamEvidence("epoch")
        stream.select(1, 0)
        stream.select(2, 1)
        ack = self.ack(stream, 1, "superseded", reason="pending_decode_replaced",
                       replacement_frame_id=2)
        self.assertFalse(stream.receive(ack, 2))
        for seq in (1, 2):
            stream.receive(self.ack(stream, seq, "received"), 3)
        self.assertTrue(stream.receive(ack, 4))
        self.assertEqual(stream.snapshot(5)["frames"][0]["state"], "intentional_client_skip")
        stream.receive(self.ack(stream, 1, "loaded"), 6)
        self.assertEqual(stream.snapshot(7)["frames"][0]["state"], "evidence_conflict")

    def test_eviction_is_bounded_and_not_counted_as_loss(self) -> None:
        stream = StreamEvidence("epoch", capacity=2)
        for seq in range(1, 5):
            stream.select(seq, seq)
        snapshot = stream.snapshot(10)
        self.assertEqual(len(snapshot["frames"]), 2)
        self.assertEqual(snapshot["evicted_unresolved_total"], 2)
        self.assertEqual(snapshot["gateway_skipped_total"], 0)


if __name__ == "__main__":
    unittest.main()
