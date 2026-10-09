"""FastAPI 路由函数测试，使用模拟 ROS 执行器，不替代硬件/DDS 验证。"""
import asyncio
import concurrent.futures
import importlib
import os
from pathlib import Path
import sys
import tempfile
import threading
import types
import unittest
from unittest.mock import patch


class FakeNode:
    def __init__(self, name: str) -> None:
        self.timers: list = []
        self.subscriptions: list = []

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


def ros_modules() -> dict:
    result = {name: types.ModuleType(name) for name in
              ('rclpy', 'rclpy.node', 'rclpy.executors', 'rclpy.qos', 'sensor_msgs', 'sensor_msgs.msg')}
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
        self.loop = asyncio.new_event_loop()
        self.loop.run_until_complete(self.gateway.startup())
        self.runtime = self.gateway.app.state.runtime
        self.token = self.runtime.auth.login('test-password')['token']

    def tearDown(self) -> None:
        self.loop.run_until_complete(self.runtime.close())
        self.loop.close()
        self.password_verification.stop()
        self.env.stop()
        self.temp.cleanup()

    def test_health_exposes_auth_and_power_capabilities(self) -> None:
        health = self.loop.run_until_complete(self.gateway.health())
        self.assertIn('image_topics', health['capabilities'])
        self.assertIn('password_auth', health['capabilities'])
        self.assertIn('system_power', health['capabilities'])
        self.assertIn('dynamic_defaults', health['capabilities'])
        self.assertIn('history_clear', health['capabilities'])

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
