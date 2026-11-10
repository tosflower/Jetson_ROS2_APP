"""隔离 ROS 域中的真实 WebSocket → 手机桥 → DDS → live 记录回归。"""
import asyncio
import json
import os
from pathlib import Path
import sys
import tempfile
import threading
import time
import types
import unittest
from unittest.mock import patch


@unittest.skipUnless(os.environ.get('RUN_ROS_INTEGRATION') == '1', '需要隔离域的真实 ROS2 网络')
class GatewayPipelineTests(unittest.IsolatedAsyncioTestCase):
    async def test_authenticated_phone_packets_reach_live_record(self):
        import rclpy
        from rclpy.executors import SingleThreadedExecutor
        import websockets
        import matplotlib
        matplotlib.use('Agg')
        import matplotlib.pyplot as plt
        sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'gateway'))
        from phone_bridge import PhoneBridgeNode, PhoneBridgeServer, PUBLISH_TYPES
        from route_simulator import RouteSimulationNode, RoutePlot, parse_options
        from route_geometry import demo_route_payload

        rclpy.init()
        bridge_node = PhoneBridgeNode(asyncio.get_running_loop())
        server = PhoneBridgeServer(bridge_node, types.SimpleNamespace(authorize=lambda token: token == 'test-token'), '127.0.0.1', 0)
        executor = SingleThreadedExecutor()
        executor.add_node(bridge_node)
        plot = consumer = None
        worker = threading.Thread(target=executor.spin, daemon=True)
        worker.start()
        try:
            await server.start()
            port = server._server.sockets[0].getsockname()[1]
            with tempfile.TemporaryDirectory() as directory:
                options, _ = parse_options(['--mode', 'live', '--record-dir', directory])
                consumer = RouteSimulationNode(options)
                executor.add_node(consumer)
                async with websockets.connect('ws://127.0.0.1:%d' % port) as socket:
                    await socket.send(json.dumps({'op': 'auth', 'token': 'test-token'}))
                    self.assertTrue(json.loads(await socket.recv())['result'])
                    for topic, (kind, _) in PUBLISH_TYPES.items():
                        await socket.send(json.dumps({'op': 'advertise', 'topic': topic, 'type': kind}))
                    await asyncio.sleep(.25)
                    self.assertEqual(set(server.status()['advertised_topics']), set(PUBLISH_TYPES))
                    self.assertEqual(server.status()['published'], {})
                    route = demo_route_payload()
                    longitude, latitude = route['path'][0]
                    gps = {'longitude': longitude, 'latitude': latitude, 'altitude': None,
                           'coordinate_system': 'GCJ-02', 'conversion_provider': 'AMap.convertFrom',
                           'accuracy_m': 4.0, 'timestamp_ms': int(time.time() * 1000)}
                    packets = [('/phone/navigation/route', {'data': json.dumps(route)}),
                               ('/phone/heading', {'data': 90.0}),
                               ('/phone/gps_gcj02', {'data': json.dumps(gps)})]
                    deadline = time.monotonic() + 4
                    # 真实 WebSocket → 网关 → DDS 回调中严禁再次调用离线近似转换。
                    with patch('route_simulator.wgs84_to_gcj02', side_effect=AssertionError('发生重复转换')):
                        while time.monotonic() < deadline:
                            for topic, fields in packets:
                                await socket.send(json.dumps({'op': 'publish', 'topic': topic, 'msg': fields}))
                            await asyncio.sleep(.1)
                            if consumer.route and consumer.last_gps and consumer.heading_degrees == 90:
                                break
                    self.assertIsNotNone(consumer.route)
                    self.assertIsNotNone(consumer.last_gps)
                    self.assertEqual(consumer.heading_degrees, 90)
                    self.assertEqual(consumer.last_gps, (longitude, latitude))
                    self.assertEqual(consumer.last_gcj, (longitude, latitude))
                    self.assertEqual(server.status()['authenticated_clients'], 1)
                executor.remove_node(consumer)
                plot = RoutePlot(consumer)
                plot.save_record()
                image, = Path(directory).glob('*.png')
                data = json.loads(image.with_suffix('.json').read_text())
                self.assertEqual(data['mode'], 'live')
                self.assertEqual(len(data['route']['path']), len(route['path']))
                self.assertTrue(data['gps'])
                self.assertTrue(data['heading'])
                self.assertEqual(data['gps_coordinate_system'], 'GCJ-02')
                self.assertEqual(data['topics']['gps'], '/phone/gps_gcj02')
        finally:
            await server.close()
            executor.shutdown()
            worker.join(timeout=2)
            if plot is not None:
                plt.close(plot.figure)
            if consumer is not None:
                consumer.destroy_node()
            bridge_node.destroy_node()
            rclpy.shutdown()
