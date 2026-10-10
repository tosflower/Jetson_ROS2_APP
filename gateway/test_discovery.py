"""自动发现公告的网卡地址和生命周期检查。"""

import socket
import sys
import types
import unittest
from unittest.mock import patch

from discovery import GatewayAdvertiser, SERVICE_TYPE


class FakeServiceInfo:
    def __init__(self, service_type: str, name: str, **kwargs: object) -> None:
        self.service_type = service_type
        self.name = name
        self.options = kwargs


class FakeZeroconf:
    instances = []

    def __init__(self, ip_version: object) -> None:
        self.registered = []
        self.unregistered = []
        self.closed = False
        self.instances.append(self)

    def register_service(self, info: FakeServiceInfo, allow_name_change: bool) -> None:
        self.registered.append(info)

    def unregister_service(self, info: FakeServiceInfo) -> None:
        self.unregistered.append(info)

    def close(self) -> None:
        self.closed = True


class GatewayDiscoveryTests(unittest.TestCase):
    def test_address_change_updates_service_and_close_releases_resources(self) -> None:
        fake_module = types.SimpleNamespace(
            IPVersion=types.SimpleNamespace(V4Only=object()),
            ServiceInfo=FakeServiceInfo,
            Zeroconf=FakeZeroconf,
        )
        with patch.dict(sys.modules, {"zeroconf": fake_module}), patch(
            "discovery.local_ipv4_addresses", side_effect=[
                ["10.42.0.1"], ["192.168.1.120"],
            ],
        ):
            advertiser = GatewayAdvertiser(8080)
            advertiser.refresh()
            zeroconf = FakeZeroconf.instances[-1]
            self.assertEqual(zeroconf.registered[0].service_type, SERVICE_TYPE)
            self.assertEqual(zeroconf.registered[0].options["addresses"], [socket.inet_aton("10.42.0.1")])
            advertiser.refresh()
            self.assertEqual(len(zeroconf.unregistered), 1)
            self.assertTrue(zeroconf.closed)
            zeroconf = FakeZeroconf.instances[-1]
            self.assertEqual(zeroconf.registered[0].options["addresses"], [socket.inet_aton("192.168.1.120")])
            advertiser.close()
            self.assertTrue(zeroconf.closed)


if __name__ == "__main__":
    unittest.main()
