"""每条 WebSocket 的计时与帧回执缓存；所有时间来自网关单调时钟。"""
import math
import time
from typing import Any, Dict, Optional


class StreamTiming:
    def __init__(self) -> None:
        self.pending: Dict[int, Dict[str, Any]] = {}

    def sent(self, sequence: int, now: float) -> None:
        self.pending[sequence] = {"at": now, "stages": set()}
        self.pending = {key: value for key, value in self.pending.items() if now - value["at"] < 30000}
        while len(self.pending) > 128:
            self.pending.pop(next(iter(self.pending)))

    def receive(self, data: Any, now: Optional[float] = None) -> Optional[Dict[str, Any]]:
        now = time.monotonic() * 1000 if now is None else now
        if not isinstance(data, dict):
            return None
        if data.get("type") == "clock_ping":
            client = data.get("client_ms")
            if not isinstance(client, (int, float)) or isinstance(client, bool) or not math.isfinite(client):
                return None
            return {"type": "clock_pong", "client_ms": client, "server_receive_ms": now,
                    "server_send_ms": now}
        if data.get("type") == "frame_ack":
            sequence, stage = data.get("frame_id"), data.get("stage")
            if not isinstance(sequence, int) or isinstance(sequence, bool) or stage not in ("received", "loaded"):
                return None
            entry = self.pending.get(sequence)
            if entry is None or stage in entry["stages"] or not 0 <= now - entry["at"] < 30000:
                return None
            entry["stages"].add(stage)
            return {"type": "latency_result", "frame_id": sequence,
                    "latency_ms": {"frame_%s_ack_ms" % stage: now - entry["at"]}}
        return None
