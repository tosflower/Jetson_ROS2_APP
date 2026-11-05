"""共享最新帧通道的逐客户端证据账本；仅在 asyncio 事件循环中访问。

帧号只表示网关成功生成的帧，不据此推断 ROS 发布端或 DDS 丢包。
超时分类表达观测缺口，迟到回执可以修正结果，不等同于确定的网络故障。
"""
from collections import Counter, OrderedDict
from dataclasses import dataclass
import math
from typing import Any, Dict, Optional
import uuid


@dataclass
class FrameEvidence:
    selected_ms: float
    previous_selected: Optional[int] = None
    written_ms: Optional[float] = None
    received_ms: Optional[float] = None
    loaded_ms: Optional[float] = None
    replacement: Optional[int] = None


class StreamEvidence:
    def __init__(self, epoch: str, capacity: int = 128, deadline_ms: float = 3000) -> None:
        if capacity < 1 or not math.isfinite(deadline_ms) or deadline_ms <= 0:
            raise ValueError("证据容量和观察时限必须为正")
        self.epoch = epoch
        self.session = uuid.uuid4().hex
        self.capacity = capacity
        self.deadline_ms = deadline_ms
        self.frames: OrderedDict[int, FrameEvidence] = OrderedDict()
        self.last_selected: Optional[int] = None
        self.gateway_skipped = 0
        self.last_skip: Optional[Dict[str, int]] = None
        self.evicted_unresolved = 0
        self.rejected_acks = 0

    def identity(self) -> Dict[str, str]:
        return {"subscription_epoch": self.epoch, "stream_session": self.session}

    def select(self, sequence: int, now: float) -> None:
        """仅在真实选帧处调用；首次加入以当前帧为基线，不计入加入前历史。"""
        if self.last_selected is not None:
            if sequence <= self.last_selected:
                raise ValueError("同一订阅世代内的选帧必须严格递增")
            skipped = sequence - self.last_selected - 1
            if skipped:
                self.gateway_skipped += skipped
                self.last_skip = {"first": self.last_selected + 1, "last": sequence - 1}
        self.frames[sequence] = FrameEvidence(now, previous_selected=self.last_selected)
        self.last_selected = sequence
        while len(self.frames) > self.capacity:
            _, removed = self.frames.popitem(last=False)
            # 证据被淘汰不代表帧丢失；单独统计尚未得到终结证据的记录。
            if removed.loaded_ms is None and removed.replacement is None:
                self.evicted_unresolved += 1

    def written(self, sequence: int, now: float) -> None:
        """send_bytes 返回仅证明本地写入完成，不证明手机已接收。"""
        entry = self.frames.get(sequence)
        if entry is not None:
            entry.written_ms = now

    def receive(self, data: Any, now: float) -> bool:
        if not isinstance(data, dict) or data.get("type") != "frame_ack":
            return False
        sequence = data.get("frame_id")
        if (data.get("subscription_epoch") != self.epoch
                or data.get("stream_session") != self.session
                or type(sequence) is not int or sequence not in self.frames):
            self.rejected_acks += 1
            return False
        entry = self.frames[sequence]
        stage = data.get("stage")
        if stage == "received":
            if entry.received_ms is None:
                entry.received_ms = now
        elif stage == "loaded":
            if entry.loaded_ms is None:
                entry.loaded_ms = now
        elif stage == "superseded":
            replacement = data.get("replacement_frame_id")
            target = self.frames.get(replacement) if type(replacement) is int else None
            # 只接受明确发生在待解码槽位的替换，且替代帧已有本会话接收证据。
            if (data.get("reason") != "pending_decode_replaced" or target is None
                    or replacement <= sequence or target.received_ms is None
                    or entry.received_ms is None):
                self.rejected_acks += 1
                return False
            entry.replacement = replacement
        else:
            self.rejected_acks += 1
            return False
        return True

    def _state(self, entry: FrameEvidence, now: float) -> str:
        if entry.loaded_ms is not None and entry.replacement is not None:
            return "evidence_conflict"
        if entry.loaded_ms is not None:
            return "loaded"
        if entry.replacement is not None:
            return "intentional_client_skip"
        # 回执可能比本地 send_bytes 协程恢复更早到达，优先采用下游正证据。
        if entry.received_ms is not None:
            return ("load_evidence_missing" if now - entry.received_ms >= self.deadline_ms
                    else "load_pending")
        if entry.written_ms is not None:
            return ("receive_evidence_missing" if now - entry.written_ms >= self.deadline_ms
                    else "receive_pending")
        return "write_timeout" if now - entry.selected_ms >= self.deadline_ms else "write_pending"

    def snapshot(self, now: float) -> Dict[str, Any]:
        rows = [{"frame_id": seq, "state": self._state(entry, now),
                 "previous_selected_frame_id": entry.previous_selected,
                 "selection_policy": "latest_frame_at_send_tick",
                 "selected_ms": entry.selected_ms, "written_ms": entry.written_ms,
                 "received_ms": entry.received_ms, "loaded_ms": entry.loaded_ms,
                 "replacement_frame_id": entry.replacement}
                for seq, entry in self.frames.items()]
        return {**self.identity(), "deadline_ms": self.deadline_ms,
                "gateway_skipped_total": self.gateway_skipped, "last_gateway_skip": self.last_skip,
                "evicted_unresolved_total": self.evicted_unresolved,
                "rejected_acks_total": self.rejected_acks,
                "window_counts": dict(Counter(row["state"] for row in rows)), "frames": rows}
