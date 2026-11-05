"""网关内置的手机 ROS2 桥；只实现当前 App 使用的 rosbridge JSON 操作。

订阅 /rosout (rcl_interfaces/msg/Log) 并推送给手机；发布手机 GPS、航向、
IMU、磁场及导航状态话题。所有 ROS 实体操作均由网关的执行器线程处理。
"""

import asyncio
import concurrent.futures
import json
import math
import queue
import threading
import time
from typing import Any, Dict, Optional, Set

import websockets
from websockets.exceptions import ConnectionClosed
from rcl_interfaces.msg import Log
from rclpy.node import Node
from rclpy.qos import QoSProfile
from sensor_msgs.msg import Imu, MagneticField, NavSatFix
from std_msgs.msg import Float64, String


PUBLISH_TYPES = {
    "/phone/gps": ("sensor_msgs/msg/NavSatFix", NavSatFix),
    "/phone/gps_data": ("std_msgs/msg/String", String),
    "/phone/heading": ("std_msgs/msg/Float64", Float64),
    "/phone/imu": ("sensor_msgs/msg/Imu", Imu),
    "/phone/magnetic_field": ("sensor_msgs/msg/MagneticField", MagneticField),
    "/phone/navigation/route": ("std_msgs/msg/String", String),
    "/phone/navigation/status": ("std_msgs/msg/String", String),
}
ROSOUT_TOPIC = "/rosout"
ROSOUT_TYPE = "rcl_interfaces/msg/Log"
MAX_MESSAGE_BYTES = 128 * 1024


def _decode(raw: Any) -> Dict[str, Any]:
    """拒绝二进制和非标准 JSON 常量，避免向 ROS 消息写入 NaN。"""
    if not isinstance(raw, str):
        raise ValueError("只接受 JSON 文本")

    def reject_constant(value: str) -> None:
        raise ValueError("非有限数值：%s" % value)

    value = json.loads(raw, parse_constant=reject_constant)
    if not isinstance(value, dict):
        raise ValueError("消息必须为对象")
    return value


def _fill_message(target: Any, fields: Dict[str, Any]) -> None:
    """只赋值 ROS 消息已有字段；嵌套字段沿用生成类的类型校验。"""
    if not isinstance(fields, dict):
        raise ValueError("ROS 消息内容必须为对象")
    field_types = target.get_fields_and_field_types()
    for name, value in fields.items():
        if not isinstance(name, str) or name not in field_types:
            raise ValueError("未知 ROS 消息字段：%s" % name)
        current = getattr(target, name)
        if isinstance(value, dict):
            if not hasattr(current, "get_fields_and_field_types"):
                raise ValueError("字段 %s 不接受对象" % name)
            _fill_message(current, value)
        else:
            if isinstance(value, float) and not math.isfinite(value):
                raise ValueError("字段 %s 必须是有限数值" % name)
            field_type = field_types[name]
            # JSON 的 0 会解码成 int；ROS2 生成类的 double 字段要求 float。
            if field_type.startswith(("double", "float")):
                if isinstance(value, list):
                    value = [float(item) for item in value]
                elif isinstance(value, (int, float)) and not isinstance(value, bool):
                    value = float(value)
            setattr(target, name, value)


def _offer_latest(target: asyncio.Queue, item: Dict[str, Any]) -> None:
    """日志消费者慢时丢旧日志，不让 ROS 回调等待手机网络。"""
    if target.full():
        target.get_nowait()
    target.put_nowait(item)


class PhoneBridgeNode(Node):
    """与图像节点共用一个 ROS2 executor；仅提供白名单中的手机话题。"""

    def __init__(self, loop: asyncio.AbstractEventLoop) -> None:
        super().__init__("phone_bridge")
        self._loop = loop
        self._jobs: queue.Queue = queue.Queue(maxsize=256)
        # rclpy.Node 用 _publishers 列表管理 ROS 实体，手机缓存必须使用独立字段。
        self._phone_publishers: Dict[str, Any] = {}
        self._listeners: Set[asyncio.Queue] = set()
        self._listeners_lock = threading.Lock()
        self._status_lock = threading.Lock()
        self._published: Dict[str, int] = {}
        self._last_published_at: Optional[float] = None
        self._last_publish_error: Optional[str] = None
        self.create_timer(0.01, self._drain)
        # /rosout 默认使用可靠 QoS；只把所需字段交给手机日志视图。
        self.create_subscription(Log, ROSOUT_TOPIC, self._on_log, QoSProfile(depth=100))

    def publish_from_phone(self, topic: str, fields: Dict[str, Any]) -> concurrent.futures.Future:
        return self._submit(topic, fields)

    def advertise_from_phone(self, topic: str) -> concurrent.futures.Future:
        """认证连接声明话题后立即创建 ROS 发布者，不伪造首个采样。"""
        return self._submit(topic, None)

    def _submit(self, topic: str, fields: Optional[Dict[str, Any]]) -> concurrent.futures.Future:
        future: concurrent.futures.Future = concurrent.futures.Future()
        try:
            self._jobs.put_nowait((future, topic, fields))
        except queue.Full:
            future.set_exception(RuntimeError("手机 ROS2 发布队列已满"))
        return future

    def _drain(self) -> None:
        # 限制单次处理量，给图像订阅和 /rosout 回调留出执行机会。
        for _ in range(64):
            try:
                future, topic, fields = self._jobs.get_nowait()
            except queue.Empty:
                return
            if not future.set_running_or_notify_cancel():
                continue
            try:
                _, message_type = PUBLISH_TYPES[topic]
                if fields is None:
                    if topic not in self._phone_publishers:
                        self._phone_publishers[topic] = self.create_publisher(message_type, topic, QoSProfile(depth=10))
                    future.set_result(None)
                    continue
                message = message_type()
                _fill_message(message, fields)
                publisher = self._phone_publishers.get(topic)
                if publisher is None:
                    publisher = self.create_publisher(message_type, topic, QoSProfile(depth=10))
                    self._phone_publishers[topic] = publisher
                publisher.publish(message)
                with self._status_lock:
                    self._published[topic] = self._published.get(topic, 0) + 1
                    self._last_published_at = time.time()
                    self._last_publish_error = None
                future.set_result(None)
            except Exception as error:
                with self._status_lock:
                    self._last_publish_error = str(error)
                future.set_exception(error)

    def publication_status(self) -> Dict[str, Any]:
        with self._status_lock:
            return {"advertised_topics": list(self._phone_publishers),
                    "published": dict(self._published), "last_published_at": self._last_published_at,
                    "last_publish_error": self._last_publish_error}

    def add_log_listener(self, listener: asyncio.Queue) -> None:
        with self._listeners_lock:
            self._listeners.add(listener)

    def remove_log_listener(self, listener: asyncio.Queue) -> None:
        with self._listeners_lock:
            self._listeners.discard(listener)

    def _on_log(self, message: Log) -> None:
        item = {"op": "publish", "topic": ROSOUT_TOPIC, "msg": {
            "stamp": {"sec": message.stamp.sec, "nanosec": message.stamp.nanosec},
            "level": message.level, "name": message.name, "msg": message.msg,
        }}
        with self._listeners_lock:
            listeners = tuple(self._listeners)
        for listener in listeners:
            self._loop.call_soon_threadsafe(_offer_latest, listener, item)


class PhoneBridgeServer:
    """9090 WebSocket 入口；首条消息用网关登录令牌认证。"""

    def __init__(self, node: PhoneBridgeNode, auth: Any, host: str, port: int) -> None:
        self.node = node
        self.auth = auth
        self.host = host
        self.port = port
        self._server: Optional[Any] = None
        self._authenticated_clients = 0
        self._last_receive_error: Optional[str] = None

    def status(self) -> Dict[str, Any]:
        return {"listening": self._server is not None, "port": self.port,
                "ros_domain_id": self.node.context.get_domain_id(),
                "authenticated_clients": self._authenticated_clients,
                "last_receive_error": self._last_receive_error, **self.node.publication_status()}

    async def start(self) -> None:
        self._server = await websockets.serve(
            self._handle, self.host, self.port,
            max_size=MAX_MESSAGE_BYTES, ping_interval=20, ping_timeout=20,
        )

    async def close(self) -> None:
        if self._server is not None:
            self._server.close()
            await self._server.wait_closed()
            self._server = None

    async def _handle(self, socket: Any) -> None:
        if socket.path != "/":
            await socket.close(code=1008, reason="未知手机桥路径")
            return
        try:
            first = _decode(await asyncio.wait_for(socket.recv(), timeout=5))
        except (asyncio.TimeoutError, ValueError, ConnectionClosed):
            await socket.close(code=1008, reason="手机桥认证失败")
            return
        token = first.get("token") if first.get("op") == "auth" else None
        if not isinstance(token, str) or not self.auth.authorize(token):
            await socket.close(code=1008, reason="请先登录网关")
            return
        await socket.send(json.dumps({"op": "auth_response", "result": True}))
        advertised: Dict[str, str] = {}
        log_ids: Set[str] = set()
        log_queue: asyncio.Queue = asyncio.Queue(maxsize=10)
        forward_task: Optional[asyncio.Task] = None

        async def forward_logs() -> None:
            while True:
                item = await log_queue.get()
                if not self.auth.authorize(token):
                    await socket.close(code=1008, reason="登录会话已失效")
                    return
                await socket.send(json.dumps(item, ensure_ascii=False))

        self._authenticated_clients += 1
        try:
            async for raw in socket:
                if not self.auth.authorize(token):
                    await socket.close(code=1008, reason="登录会话已失效")
                    break
                try:
                    data = _decode(raw)
                    op = data.get("op")
                    topic = data.get("topic")
                    if op == "advertise":
                        definition = PUBLISH_TYPES.get(topic)
                        if definition is None or data.get("type") != definition[0]:
                            raise ValueError("不支持的话题或消息类型")
                        await asyncio.wrap_future(self.node.advertise_from_phone(topic))
                        advertised[topic] = definition[0]
                    elif op == "unadvertise":
                        advertised.pop(topic, None)
                    elif op == "publish":
                        if topic not in advertised or not isinstance(data.get("msg"), dict):
                            raise ValueError("话题未 advertise 或消息格式错误")
                        await asyncio.wrap_future(self.node.publish_from_phone(topic, data["msg"]))
                    elif op == "subscribe":
                        if topic != ROSOUT_TOPIC or data.get("type") != ROSOUT_TYPE or not isinstance(data.get("id"), str):
                            raise ValueError("仅支持订阅 /rosout 日志")
                        log_ids.add(data["id"])
                        if forward_task is None:
                            self.node.add_log_listener(log_queue)
                            forward_task = asyncio.create_task(forward_logs())
                    elif op == "unsubscribe":
                        log_ids.discard(data.get("id"))
                        if not log_ids and forward_task is not None:
                            self.node.remove_log_listener(log_queue)
                            forward_task.cancel()
                            await asyncio.gather(forward_task, return_exceptions=True)
                            forward_task = None
                    elif op == "call_service":
                        # 当前 App 没有实际调用服务；明确返回失败，避免客户端只等超时。
                        await socket.send(json.dumps({"op": "service_response", "id": data.get("id"),
                                                      "service": data.get("service"), "result": False, "values": {}}))
                    else:
                        raise ValueError("不支持的手机桥操作")
                except (ValueError, TypeError, KeyError, RuntimeError, AttributeError, AssertionError) as error:
                    self._last_receive_error = str(error)
                    await socket.send(json.dumps({"op": "status", "level": "error", "msg": str(error)}, ensure_ascii=False))
        except ConnectionClosed:
            pass
        finally:
            self._authenticated_clients -= 1
            self.node.remove_log_listener(log_queue)
            if forward_task is not None:
                forward_task.cancel()
                await asyncio.gather(forward_task, return_exceptions=True)
