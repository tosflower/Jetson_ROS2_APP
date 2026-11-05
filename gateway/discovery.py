"""将 Jetson 网关通过 mDNS 发布到同一 Wi-Fi 中，供 Android APP 自动发现。"""

import asyncio
import fcntl
import inspect
import logging
import socket
import struct
from typing import List, Optional, Tuple


SERVICE_TYPE = "_jetson-gateway._tcp.local."
LOGGER = logging.getLogger(__name__)


def local_ipv4_addresses() -> List[str]:
    """读取当前网卡 IPv4，忽略回环地址；兼容 Ubuntu 20.04 的 Python 3.8。"""
    addresses: List[str] = []
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as probe:
            interfaces = sorted(socket.if_nameindex(), key=lambda item: (not item[1].startswith("wl"), item[1]))
            for _, name in interfaces:
                if name.startswith(("docker", "veth", "virbr", "br-", "tun", "tailscale")):
                    continue
                try:
                    request = struct.pack("256s", name[:15].encode("utf-8"))
                    result = fcntl.ioctl(probe.fileno(), 0x8915, request)
                    address = socket.inet_ntoa(result[20:24])
                except OSError:
                    continue
                if not address.startswith("127.") and address not in addresses:
                    addresses.append(address)
    except OSError as error:
        LOGGER.warning("无法读取网卡地址，跳过 mDNS 公告：%s", error)
    return addresses


class GatewayAdvertiser:
    """注册服务并在网络地址变化时更新公告，不影响网关本身启动。"""

    def __init__(self, port: int) -> None:
        self.port = port
        self._zeroconf = None
        self._info = None
        self._addresses: Tuple[str, ...] = ()

    async def refresh(self) -> None:
        """网络切换后更新服务记录，手机无需记住上次 DHCP 地址。"""
        addresses = tuple(local_ipv4_addresses())
        if addresses == self._addresses:
            return
        try:
            from zeroconf import IPVersion, ServiceInfo
            from zeroconf.asyncio import AsyncZeroconf
            await self.close()
            if addresses:
                # 只在公告的实际网卡上打开套接字，不加入 Docker/回环等无关接口。
                self._zeroconf = AsyncZeroconf(interfaces=list(addresses), ip_version=IPVersion.V4Only)
                info = ServiceInfo(
                    SERVICE_TYPE,
                    "Jetson ROS2 Gateway." + SERVICE_TYPE,
                    addresses=[socket.inet_aton(address) for address in addresses],
                    port=self.port,
                    properties={"app": "jetson-ros2-mobile-test"},
                    server="jetson-ros2-gateway.local.",
                )
                announcement = await self._zeroconf.async_register_service(info, allow_name_change=True)
                if inspect.isawaitable(announcement):
                    await announcement
                self._info = info
            self._addresses = addresses
        except asyncio.CancelledError:
            await self.close()
            raise
        except Exception as error:
            LOGGER.warning("网关 mDNS 公告失败，仍可手动输入 IP：%s: %s", type(error).__name__, error)
            try:
                await self.close()
            except Exception:
                LOGGER.exception("关闭失败的 mDNS 公告时出错")
            self._addresses = ()

    async def close(self) -> None:
        """停止服务公告并释放 mDNS 套接字。"""
        zeroconf = self._zeroconf
        self._zeroconf = None
        self._info = None
        self._addresses = ()
        if zeroconf is not None:
            await zeroconf.async_close()
