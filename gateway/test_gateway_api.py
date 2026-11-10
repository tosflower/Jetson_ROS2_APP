"""FastAPI 路由函数测试，使用模拟 ROS 执行器，不替代硬件/DDS 验证。"""
import asyncio
import concurrent.futures
import importlib
import json
import os
from pathlib import Path
import sys
import tempfile
import threading
import types
import unittest
from unittest.mock import AsyncMock, patch


class FakeNode:
    def __init__(self, name: str) -> None:
        self.context = types.SimpleNamespace(get_domain_id=lambda: 97)
        self.timers: list = []
        self.subscriptions: list = []
        # 与真实 rclpy.Node 保持一致，捕获子类覆盖父类发布者列表的问题。
        self._publishers: list = []

    @property
    def publishers(self) -> list:
        return self._publishers

    def create_timer(self, interval: float, callback: object) -> None:
        self.timers.append(callback)

    def create_subscription(self, kind: object, topic: str, callback: object, qos: object) -> object:
        if not topic.startswith('/') or ' ' in topic:
            raise ValueError('invalid topic')
        subscription = types.SimpleNamespace(topic=topic, callback=callback, qos=qos)
        self.subscriptions.append(subscription)
        return subscription

    def destroy_subscription(self, subscription: object) -> None:
        self.subscriptions.remove(subscription)

    def create_publisher(self, kind: object, topic: str, qos: object) -> object:
        publisher = types.SimpleNamespace(topic=topic, messages=[])
        publisher.publish = publisher.messages.append
        self._publishers.append(publisher)
        return publisher

    def get_topic_names_and_types(self) -> list:
        return [('/camera/a', ['sensor_msgs/msg/CompressedImage']),
                ('/camera/raw', ['sensor_msgs/msg/Image']), ('/cmd_vel', ['geometry_msgs/msg/Twist'])]

    def count_publishers(self, topic: str) -> int:
        return 1 if topic == '/camera/a' else 0

    def destroy_node(self) -> None:
        pass


class FakeExecutor:
    def __init__(self) -> None:
        self.nodes: list = []
        self.stopped = threading.Event()

    def add_node(self, node: object) -> None:
        self.nodes.append(node)

    def spin(self) -> None:
        while not self.stopped.wait(.005):
            for node in self.nodes:
                for callback in node.timers:
                    callback()

    def shutdown(self) -> None:
        self.stopped.set()


class FakeRosStruct:
    """只模拟当前手机消息用到的 ROS 字段树。"""

    def __init__(self, **fields: object) -> None:
        self.__dict__.update(fields)

    def get_fields_and_field_types(self) -> dict:
        return {name: '' for name in self.__dict__}


class FakeNavSatFix(FakeRosStruct):
    def __init__(self) -> None:
        super().__init__(header=FakeRosStruct(stamp=FakeRosStruct(sec=0, nanosec=0), frame_id=''),
                         status=FakeRosStruct(status=0, service=0),
                         latitude=0.0, longitude=0.0, altitude=0.0,
                         position_covariance=[0.0] * 9, position_covariance_type=0)

    def get_fields_and_field_types(self) -> dict:
        fields = super().get_fields_and_field_types()
        for name in ('latitude', 'longitude', 'altitude'):
            fields[name] = 'double'
        fields['position_covariance'] = 'double[9]'
        return fields


class FakeString(FakeRosStruct):
    def __init__(self) -> None:
        super().__init__(data='')


class FakeFloat64(FakeRosStruct):
    def __init__(self) -> None:
        super().__init__(data=0.0)

    def get_fields_and_field_types(self) -> dict:
        return {'data': 'double'}


def ros_modules() -> dict:
    result = {name: types.ModuleType(name) for name in
              ('rclpy', 'rclpy.node', 'rclpy.executors', 'rclpy.qos', 'sensor_msgs', 'sensor_msgs.msg',
               'std_msgs', 'std_msgs.msg', 'rcl_interfaces', 'rcl_interfaces.msg')}
    result['rclpy'].init = lambda **kwargs: None
    result['rclpy'].shutdown = lambda: None
    result['rclpy'].ok = lambda: True
    result['rclpy.node'].Node = FakeNode
    result['rclpy.executors'].SingleThreadedExecutor = FakeExecutor
    result['rclpy.executors'].ExternalShutdownException = type('ExternalShutdownException', (Exception,), {})
    result['rclpy.qos'].HistoryPolicy = types.SimpleNamespace(KEEP_LAST=1)
    result['rclpy.qos'].ReliabilityPolicy = types.SimpleNamespace(BEST_EFFORT=1)
    result['rclpy.qos'].QoSProfile = lambda **kwargs: types.SimpleNamespace(**kwargs)
    result['sensor_msgs.msg'].Image = type('Image', (), {})
    result['sensor_msgs.msg'].CompressedImage = type('CompressedImage', (), {})
    result['sensor_msgs.msg'].NavSatFix = FakeNavSatFix
    result['sensor_msgs.msg'].Imu = type('Imu', (), {})
    result['sensor_msgs.msg'].MagneticField = type('MagneticField', (), {})
    result['std_msgs.msg'].String = FakeString
    result['std_msgs.msg'].Float64 = FakeFloat64
    result['rcl_interfaces.msg'].Log = type('Log', (), {})
    return result


class GatewayApiTests(unittest.TestCase):
    """直接调用路由和认证依赖，避免不同 Starlette/httpx 版本的测试客户端挂起。"""

    @classmethod
    def setUpClass(cls) -> None:
        from unittest.mock import patch as patcher
        cls.modules = patcher.dict(sys.modules, ros_modules())
        cls.modules.start()
        cls.gateway = importlib.import_module('gateway')

    @classmethod
    def tearDownClass(cls) -> None:
        cls.modules.stop()

    def setUp(self) -> None:
        self.temp = tempfile.TemporaryDirectory()
        self.env = patch.dict(os.environ, {'COMMAND_STORE_PATH': str(Path(self.temp.name) / 'state.json')})
        self.env.start()
        self.password_verification = patch.object(self.gateway.AuthManager, '_verify_password', return_value=None)
        self.password_verification.start()
        # 路由测试不绑定 9090；手机桥套接字在独立用例中检查。
        self.phone_start = patch.object(self.gateway.PhoneBridgeServer, 'start', new_callable=AsyncMock)
        self.phone_start.start()
        # API 用例只检查网关逻辑，避免 mDNS 在测试环境中查询网卡并阻塞退出。
        self.discovery_refresh = patch.object(self.gateway.GatewayAdvertiser, 'refresh', new_callable=AsyncMock)
        self.discovery_close = patch.object(self.gateway.GatewayAdvertiser, 'close', new_callable=AsyncMock)
        self.discovery_refresh.start()
        self.discovery_close.start()
        self.loop = asyncio.new_event_loop()
        self.loop.run_until_complete(self.gateway.startup())
        self.runtime = self.gateway.app.state.runtime
        self.token = self.runtime.auth.login('test-password')['token']

    def tearDown(self) -> None:
        self.loop.run_until_complete(self.gateway.shutdown())
        self.loop.close()
        self.password_verification.stop()
        self.phone_start.stop()
        self.discovery_refresh.stop()
        self.discovery_close.stop()
        self.env.stop()
        self.temp.cleanup()

    def test_health_exposes_auth_and_power_capabilities(self) -> None:
        health = self.loop.run_until_complete(self.gateway.health())
        self.assertIn('image_topics', health['capabilities'])
        self.assertIn('password_auth', health['capabilities'])
        self.assertIn('system_power', health['capabilities'])
        self.assertIn('dynamic_defaults', health['capabilities'])
        self.assertIn('history_clear', health['capabilities'])
        self.assertIn('phone_bridge', health['capabilities'])

    def test_phone_bridge_authenticates_and_publishes_gps(self) -> None:
        """检查手机 JSON、令牌、GPS 白名单和 /rosout 回传。"""
        class Socket:
            path = '/'

            def __init__(self) -> None:
                self.incoming = asyncio.Queue()
                self.outgoing = asyncio.Queue()
                self.close_code = None

            async def recv(self) -> str:
                return json.dumps(await self.incoming.get())

            def __aiter__(self) -> object:
                return self

            async def __anext__(self) -> str:
                value = await self.incoming.get()
                if value is None:
                    raise StopAsyncIteration
                return json.dumps(value)

            async def send(self, value: str) -> None:
                await self.outgoing.put(json.loads(value))

            async def close(self, code: int, reason: str) -> None:
                self.close_code = code

        async def scenario() -> None:
            bridge = self.runtime.phone_server
            rejected = Socket()
            await rejected.incoming.put({'op': 'auth', 'token': 'invalid'})
            await bridge._handle(rejected)
            self.assertEqual(rejected.close_code, 1008)

            socket = Socket()
            await socket.incoming.put({'op': 'auth', 'token': self.token})
            completed: concurrent.futures.Future = concurrent.futures.Future()
            completed.set_result(None)
            with patch.object(self.runtime.phone_node, 'publish_from_phone', return_value=completed) as publish:
                task = asyncio.create_task(bridge._handle(socket))
                try:
                    self.assertEqual((await asyncio.wait_for(socket.outgoing.get(), 1))['op'], 'auth_response')
                    await socket.incoming.put({'op': 'advertise', 'topic': '/phone/gps',
                                               'type': 'sensor_msgs/msg/NavSatFix'})
                    await asyncio.sleep(.03)
                    self.assertIn('/phone/gps', [p.topic for p in self.runtime.phone_node.publishers],
                                  '手机已 advertise，ROS 仍看不到发布者')
                    await socket.incoming.put({'op': 'publish', 'topic': '/phone/gps',
                                               'msg': {'latitude': 23.1, 'longitude': 113.3}})
                    await socket.incoming.put({'op': 'advertise', 'topic': '/cmd_vel',
                                               'type': 'geometry_msgs/msg/Twist'})
                    error = await asyncio.wait_for(socket.outgoing.get(), 1)
                    self.assertEqual(error['op'], 'status')
                    self.assertIn('不支持', error['msg'])
                    publish.assert_called_once_with('/phone/gps', {'latitude': 23.1, 'longitude': 113.3})
                    await socket.incoming.put({'op': 'subscribe', 'id': 'sub:rosout',
                                               'topic': '/rosout', 'type': 'rcl_interfaces/msg/Log'})
                    await asyncio.sleep(.02)
                    self.runtime.phone_node._on_log(types.SimpleNamespace(
                        stamp=types.SimpleNamespace(sec=123, nanosec=456),
                        level=20, name='camera', msg='ready'))
                    log = await asyncio.wait_for(socket.outgoing.get(), 1)
                    self.assertEqual(log['topic'], '/rosout')
                    self.assertEqual(log['msg']['msg'], 'ready')
                    await socket.incoming.put({'op': 'unsubscribe', 'id': 'sub:rosout', 'topic': '/rosout'})
                finally:
                    await socket.incoming.put(None)
                    await asyncio.wait_for(task, 1)
                self.assertFalse(self.runtime.phone_node._listeners)

        self.loop.run_until_complete(scenario())

    def test_phone_bridge_converts_gps_on_ros_executor(self) -> None:
        """用模拟 ROS 消息检查嵌套字段与浮点协方差转换。"""
        fields = {'header': {'stamp': {'sec': 123, 'nanosec': 456}, 'frame_id': 'phone_gps_link'},
                  'status': {'status': 0, 'service': 0},
                  'latitude': 23.1, 'longitude': 113.3, 'altitude': 10,
                  'position_covariance': [0] * 9, 'position_covariance_type': 0}
        future = self.runtime.phone_node.publish_from_phone('/phone/gps', fields)
        self.runtime.phone_node._drain()
        future.result(timeout=1)
        publishers = self.runtime.phone_node.publishers
        self.assertEqual([publisher.topic for publisher in publishers], ['/phone/gps'])
        self.assertEqual(publishers[0].messages[0].header.stamp.sec, 123)
        self.assertEqual(publishers[0].messages[0].latitude, 23.1)
        self.assertIsInstance(publishers[0].messages[0].position_covariance[0], float)
        # 后续采样应复用同一发布者，同时保留父类的实体列表供 ROS 正常清理。
        next_future = self.runtime.phone_node.publish_from_phone('/phone/gps', fields)
        self.runtime.phone_node._drain()
        next_future.result(timeout=1)
        self.assertEqual(len(publishers), 1)
        self.assertEqual(len(publishers[0].messages), 2)

    def test_phone_bridge_advertises_all_supported_topics_without_fake_samples(self) -> None:
        from phone_bridge import PUBLISH_TYPES
        for topic in PUBLISH_TYPES:
            future = self.runtime.phone_node.advertise_from_phone(topic)
            self.runtime.phone_node._drain()
            future.result(timeout=1)
        status = self.runtime.phone_server.status()
        self.assertEqual(set(status['advertised_topics']), set(PUBLISH_TYPES))
        self.assertEqual(status['published'], {})
        self.assertEqual(status['ros_domain_id'], 97)
        self.assertEqual(status['authenticated_clients'], 0)
        self.assertTrue(all(not publisher.messages for publisher in self.runtime.phone_node.publishers))

    def test_phone_bridge_forwards_gcj02_json_without_coordinate_changes(self) -> None:
        """官方转换结果按 String 原样发布，海拔为空也不阻塞。"""
        payload = {'longitude': 113.38, 'latitude': 23.05, 'altitude': None,
                   'coordinate_system': 'GCJ-02', 'timestamp_ms': 1234567890000}
        fields = {'data': json.dumps(payload)}
        future = self.runtime.phone_node.publish_from_phone('/phone/gps_gcj02', fields)
        self.runtime.phone_node._drain()
        future.result(timeout=1)
        publisher, = self.runtime.phone_node.publishers
        self.assertEqual(publisher.topic, '/phone/gps_gcj02')
        self.assertEqual(publisher.messages[0].data, fields['data'])

    def test_private_api_requires_bearer_and_power_rechecks_password(self) -> None:
        from fastapi import HTTPException
        with self.assertRaises(HTTPException) as error:
            self.gateway.require_auth(None)
        self.assertEqual(error.exception.status_code, 401)
        self.assertEqual(self.gateway.require_auth(f'Bearer {self.token}'), self.token)
        with patch.object(self.runtime.auth, 'request_power') as power:
            response = self.loop.run_until_complete(self.gateway.system_power(
                self.gateway.PowerRequest(action='reboot', password='fresh-password'), self.token))
        self.assertEqual(response, {'status': 'accepted', 'action': 'reboot'})
        power.assert_called_once_with('fresh-password', 'reboot')

    def test_topics_route_returns_only_visualization_topics(self) -> None:
        # 此用例只校验 HTTP 路由的数据映射；ROS 线程队列由独立图像桥测试覆盖。
        future: concurrent.futures.Future = concurrent.futures.Future()
        future.set_result([
            {'name': '/camera/a', 'message_type': 'sensor_msgs/msg/CompressedImage', 'publishers': 1},
            {'name': '/camera/raw', 'message_type': 'sensor_msgs/msg/Image', 'publishers': 0},
        ])
        with patch.object(self.runtime.node, 'submit', return_value=future):
            result = self.loop.run_until_complete(self.gateway.image_topics(self.token))
        self.assertEqual(len(result['topics']), 2)
        self.assertEqual(result['topics'][0]['name'], '/camera/a')
        self.assertEqual(result['topics'][0]['publishers'], 1)

    def test_stream_evidence_uses_real_send_ack_and_disconnect_paths(self) -> None:
        gateway, token, runtime = self.gateway, self.token, self.runtime

        class Socket:
            """内存 WebSocket 对端，保留真实 mobile_stream 的协程及 ROS 队列。"""
            query_params = {"topic": "/camera/a"}

            def __init__(self) -> None:
                self.messages = asyncio.Queue()
                self.ready = asyncio.Event()
                self.sent = asyncio.Queue()
                self.meta = {}
                self.statuses = []

            async def accept(self) -> None:
                pass

            async def receive_json(self) -> dict:
                return {"type": "auth", "token": token}

            async def receive_text(self) -> str:
                value = await self.messages.get()
                if value is None:
                    raise gateway.WebSocketDisconnect()
                return json.dumps(value)

            async def send_json(self, value: dict) -> None:
                self.statuses.append(value)
                if value.get("connection_ready"):
                    self.ready.set()
                if value["type"] == "frame":
                    self.meta = value

            async def send_bytes(self, value: bytes) -> None:
                self.sent.put_nowait(dict(self.meta))

        async def scenario() -> None:
            sockets = [Socket(), Socket()]
            tasks = [asyncio.create_task(gateway.mobile_stream(socket)) for socket in sockets]
            try:
                for socket in sockets:
                    try:
                        await asyncio.wait_for(socket.ready.wait(), 2)
                    except asyncio.TimeoutError:
                        self.fail("图像连接未就绪：%r" % socket.statuses)
                channel = runtime.node.channels[("/camera/a", gateway.COMPRESSED)]
                self.assertEqual(channel.users, 2)
                channel.on_image(types.SimpleNamespace(data=b"\xff\xd8test"))
                metas = [await asyncio.wait_for(socket.sent.get(), 2) for socket in sockets]
                self.assertEqual(metas[0]["subscription_epoch"], metas[1]["subscription_epoch"])
                self.assertNotEqual(metas[0]["stream_session"], metas[1]["stream_session"])
                # 一个客户端加载完成，另一个没有回执；两份账本必须保持隔离。
                ack = {**metas[0], "type": "frame_ack", "stage": "loaded"}
                await sockets[0].messages.put(ack)
                await asyncio.sleep(0)
                result = await gateway.image_diagnostics(token)
                streams = {row["stream_session"]: row for row in result["streams"]}
                self.assertEqual(streams[metas[0]["stream_session"]]["frames"][0]["state"], "loaded")
                self.assertEqual(streams[metas[1]["stream_session"]]["frames"][0]["state"], "receive_pending")
                for socket in sockets:
                    await socket.messages.put(None)
                await asyncio.wait_for(asyncio.gather(*tasks), 2)
                self.assertFalse(runtime.image_diagnostics)
                self.assertFalse(runtime.node.channels)
            finally:
                for task in tasks:
                    task.cancel()
                await asyncio.gather(*tasks, return_exceptions=True)

        self.loop.run_until_complete(scenario())

    def test_raw_image_bridge_is_loaded_before_executor_thread(self) -> None:
        # Foxy 的 Boost.Python 扩展首次从 executor 线程导入会初始化失败。
        self.assertIn('cv_bridge.boost.cv_bridge_boost', sys.modules)

    def test_command_snapshot_is_available_after_auth_dependency(self) -> None:
        result = self.loop.run_until_complete(self.gateway.command_state(self.token))
        self.assertEqual([item['id'] for item in result['defaults']], ['car_system', 'bluetooth_system'])
        self.assertEqual([item['name'] for item in result['defaults']], ['小车系统', '蓝牙节点'])

    def test_clear_history_route_removes_fourteen_finished_records(self) -> None:
        # 复现 App 显示 14 条记录的场景，并验证删除响应本身携带最新快照。
        self.runtime.commands.history = [
            {'id': f'finished-{index}', 'state': 'completed'} for index in range(14)
        ]
        result = self.loop.run_until_complete(
            self.gateway.clear_command_history(self.token))
        self.assertEqual(result['deleted'], 14)
        self.assertEqual(result['retained_ids'], [])
        self.assertEqual(result['snapshot']['history'], [])
        self.assertEqual(self.runtime.commands.snapshot()['history'], [])

    def test_start_configuration_routes_support_add_and_delete(self) -> None:
        created = self.loop.run_until_complete(self.gateway.create_default(
            self.gateway.CreateDefaultRequest(name='激光雷达系统'), self.token))
        self.assertEqual(created['name'], '激光雷达系统')
        self.assertEqual(len(self.runtime.commands.defaults), 3)
        result = self.loop.run_until_complete(
            self.gateway.delete_default(created['id'], self.token))
        self.assertEqual(result, {'ok': True})
        self.assertEqual(len(self.runtime.commands.defaults), 2)


if __name__ == '__main__':
    unittest.main()
