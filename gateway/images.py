"""图像订阅与转换：每个话题独立缓存，ROS 实体操作交给执行器线程。"""
import concurrent.futures
from dataclasses import dataclass
import importlib.util
import queue
import threading
import time
from typing import Any, Dict, Optional, Tuple

from rclpy.node import Node
from rclpy.qos import HistoryPolicy, QoSProfile, ReliabilityPolicy
from sensor_msgs.msg import CompressedImage, Image

COMPRESSED = "sensor_msgs/msg/CompressedImage"
RAW = "sensor_msgs/msg/Image"
RAW_AVAILABLE = importlib.util.find_spec("cv_bridge") is not None and importlib.util.find_spec("cv2") is not None


@dataclass(frozen=True)
class FrameSnapshot:
    sequence: int
    jpeg: bytes
    fps: float
    ready_ms: float
    latency_ms: Dict[str, float]


class ImageChannel:
    """订阅 Image 或 CompressedImage，仅缓存最新 JPEG；不发布 ROS 话题。"""

    def __init__(self, node: Node, topic: str, message_type: str) -> None:
        self.node = node
        self.lock = threading.Lock()
        self.frame: Optional[FrameSnapshot] = None
        self.sequence = 0
        self.last_time: Optional[float] = None
        self.fps = 0.0
        self.error = ""
        self.users = 1
        self.bridge: Any = None
        if message_type == RAW:
            from cv_bridge import CvBridge
            self.bridge = CvBridge()
        qos = QoSProfile(reliability=ReliabilityPolicy.BEST_EFFORT,
                         history=HistoryPolicy.KEEP_LAST, depth=1)
        self.subscription = node.create_subscription(
            Image if message_type == RAW else CompressedImage, topic, self.on_image, qos)

    def on_image(self, message: Any) -> None:
        """原始图像转 BGR8 后编码 JPEG；压缩 JPEG 直接透传，PNG 解码后转 JPEG。"""
        start = time.monotonic() * 1000
        metrics: Dict[str, float] = {}
        try:
            if self.bridge is not None:
                import cv2
                bgr = self.bridge.imgmsg_to_cv2(message, desired_encoding="bgr8")
                converted = time.monotonic() * 1000
                metrics["image_convert_ms"] = converted - start
                ok, encoded = cv2.imencode(".jpg", bgr, [cv2.IMWRITE_JPEG_QUALITY, 80])
                if not ok:
                    raise ValueError("JPEG 编码失败")
                jpeg = encoded.tobytes()
                metrics["jpeg_encode_ms"] = time.monotonic() * 1000 - converted
            else:
                jpeg = bytes(message.data)
                if not jpeg:
                    return
                if not jpeg.startswith(b"\xff\xd8"):
                    import cv2
                    import numpy as np
                    bgr = cv2.imdecode(np.frombuffer(jpeg, dtype=np.uint8), cv2.IMREAD_COLOR)
                    if bgr is None:
                        raise ValueError("不支持的压缩图像内容（需要 JPEG 或 PNG）")
                    converted = time.monotonic() * 1000
                    metrics["image_convert_ms"] = converted - start
                    ok, encoded = cv2.imencode(".jpg", bgr)
                    if not ok:
                        raise ValueError("JPEG 编码失败")
                    jpeg = encoded.tobytes()
                    metrics["jpeg_encode_ms"] = time.monotonic() * 1000 - converted
            now = time.monotonic() * 1000
            with self.lock:
                if self.last_time is not None and now > self.last_time:
                    value = 1000 / (now - self.last_time)
                    self.fps = value if self.fps == 0 else self.fps * .85 + value * .15
                self.last_time = now
                self.sequence += 1
                self.error = ""
                self.frame = FrameSnapshot(self.sequence, jpeg, self.fps, now, metrics)
        except Exception as error:
            with self.lock:
                self.error = "图像转换失败：%s" % error

    def snapshot(self) -> Tuple[Optional[FrameSnapshot], str]:
        with self.lock:
            return self.frame, self.error


class ImageBridgeNode(Node):
    """通过任务队列在 ROS 线程中创建/销毁订阅，支持多个客户端各选各的话题。"""

    def __init__(self) -> None:
        super().__init__("mobile_gateway")
        self.channels: Dict[Tuple[str, str], ImageChannel] = {}
        self.jobs: queue.Queue = queue.Queue()
        self.control_lock = threading.Lock()
        self.closed = False
        self.create_timer(0.02, self._drain)

    def submit(self, action: str, topic: str = "", message_type: str = "") -> concurrent.futures.Future:
        future: concurrent.futures.Future = concurrent.futures.Future()
        with self.control_lock:
            if self.closed:
                if action == "release":
                    future.set_result(None)
                else:
                    future.set_exception(RuntimeError("图像网关正在退出"))
            else:
                self.jobs.put((future, action, topic, message_type))
        return future

    def _drain(self) -> None:
        while not self.jobs.empty():
            future, action, topic, message_type = self.jobs.get_nowait()
            if not future.set_running_or_notify_cancel():
                continue
            try:
                key = (topic, message_type)
                if action == "close":
                    # 先标记关闭，再销毁订阅；迟到的 WebSocket 释放请求直接完成。
                    with self.control_lock:
                        self.closed = True
                    for channel in self.channels.values():
                        self.destroy_subscription(channel.subscription)
                    self.channels.clear()
                    result: Any = None
                elif action == "list":
                    result = sorted([
                        {"name": name, "message_type": kind,
                         "publishers": self.count_publishers(name),
                         "supported": kind == COMPRESSED or RAW_AVAILABLE}
                        for name, kinds in self.get_topic_names_and_types()
                        for kind in kinds if kind in (COMPRESSED, RAW)]
                        , key=lambda item: (item["name"], item["message_type"]))
                elif action == "acquire":
                    if message_type not in (COMPRESSED, RAW):
                        raise ValueError("只支持 sensor_msgs/msg/Image 或 CompressedImage")
                    if message_type == RAW and not RAW_AVAILABLE:
                        raise ValueError("原始图像订阅需要 Jetson 安装 cv_bridge 和 OpenCV")
                    # 未发布的话题也可提前订阅；名称是否合法由 rclpy 校验。
                    if key not in self.channels:
                        self.channels[key] = ImageChannel(self, topic, message_type)
                    else:
                        self.channels[key].users += 1
                    result = self.channels[key]
                elif action == "release":
                    channel = self.channels.get(key)
                    if channel is not None:
                        channel.users -= 1
                        if channel.users == 0:
                            self.destroy_subscription(channel.subscription)
                            del self.channels[key]
                    result = None
                else:
                    raise ValueError("未知订阅操作")
                future.set_result(result)
            except Exception as error:
                future.set_exception(error)
