#!/usr/bin/env python3
"""Jetson ROS2 移动端网关。

订阅话题：由 ROS_IMAGE_TOPIC 指定，默认 /camera/image_raw/compressed
话题类型：sensor_msgs/msg/CompressedImage
回调逻辑：仅保留最新 JPEG 帧，由 WebSocket 以二进制帧发送给 App。
"""

import asyncio
import contextlib
import json
import os
import threading
import time
from pathlib import Path
from auth import AuthError, AuthManager
from commands import CommandManager
from discovery import GatewayAdvertiser
from images import ImageBridgeNode, COMPRESSED
from streaming import StreamTiming
from typing import Dict, List, Optional, Set, Tuple

import rclpy
import uvicorn
from fastapi import Depends, FastAPI, Header, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from rclpy.executors import ExternalShutdownException, SingleThreadedExecutor


GATEWAY_HOST = os.environ.get("GATEWAY_HOST", "0.0.0.0")
GATEWAY_PORT = int(os.environ.get("GATEWAY_PORT", "8080"))
IMAGE_TOPIC = os.environ.get("ROS_IMAGE_TOPIC", "/camera/image_raw/compressed")
MAX_STREAM_FPS = max(1.0, float(os.environ.get("MAX_STREAM_FPS", "20")))

# 保留旧版 App 的固定入口；新版自定义白名单由 CommandManager 校验管理。
LAUNCH_ALLOWLIST: Dict[str, Tuple[str, ...]] = {
    "perception": ("ros2", "launch", "wheel_perception", "run_launch.py"),
}


class LaunchRequest(BaseModel):
    """启停请求；launch_id 必须命中服务端白名单。"""

    launch_id: str

    class Config:
        extra = "forbid"


class LaunchResponse(BaseModel):
    """App 可直接解析的 launch 状态。"""

    state: str
    message: str


class ConnectionHub:
    """维护移动端 WebSocket 连接并广播状态。"""

    def __init__(self) -> None:
        self._clients: Set[WebSocket] = set()
        self._lock = asyncio.Lock()

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        async with self._lock:
            self._clients.add(websocket)

    async def disconnect(self, websocket: WebSocket) -> None:
        async with self._lock:
            self._clients.discard(websocket)

    async def broadcast(self, payload: Dict[str, object]) -> None:
        """单个断开的客户端不影响其他连接。"""
        message = json.dumps(payload, ensure_ascii=False)
        async with self._lock:
            clients = list(self._clients)
        disconnected: List[WebSocket] = []
        for client in clients:
            try:
                await client.send_text(message)
            except Exception:
                disconnected.append(client)
        if disconnected:
            async with self._lock:
                for client in disconnected:
                    self._clients.discard(client)


class LaunchManager:
    """旧版固定 launch 接口适配器，与自定义命令共用一个进程管理器。"""

    def __init__(self, manager: CommandManager) -> None:
        self.manager = manager
        self.run_id: Optional[str] = None

    async def start(self, launch_id: str) -> LaunchResponse:
        if launch_id not in LAUNCH_ALLOWLIST:
            raise ValueError("未知 launch_id")
        spec = await self.manager.validate(os.getcwd(), " ".join(LAUNCH_ALLOWLIST[launch_id]))
        record = await self.manager.start(spec["id"])
        self.run_id = record["id"]
        return LaunchResponse(state=record["state"], message=record["message"])

    async def stop(self, launch_id: str) -> LaunchResponse:
        if launch_id not in LAUNCH_ALLOWLIST:
            raise ValueError("未知 launch_id")
        if self.run_id is None:
            raise ValueError("旧版接口没有启动中的任务")
        record = await self.manager.stop(self.run_id)
        return LaunchResponse(state=record["state"], message=record["message"])


class GatewayRuntime:
    """ROS 执行器、WebSocket 和 launch 的生命周期容器。"""

    def __init__(self) -> None:
        self.auth = AuthManager()
        self.hub = ConnectionHub()
        self.commands = CommandManager(Path(os.environ.get(
            "COMMAND_STORE_PATH", str(Path(__file__).resolve().parent / "command_store.json"))))
        self.launches = LaunchManager(self.commands)
        rclpy.init(args=None)
        self.node = ImageBridgeNode()
        self.executor = SingleThreadedExecutor()
        self.executor.add_node(self.node)
        self.ros_thread = threading.Thread(target=self._spin_ros, name="ros2-executor", daemon=True)
        self.ros_thread.start()

    def _spin_ros(self) -> None:
        """rclpy 的信号处理器可能先关闭 context；正常退出时不打印线程异常。"""
        try:
            self.executor.spin()
        except ExternalShutdownException:
            pass

    async def close(self) -> None:
        await self.commands.shutdown()
        if rclpy.ok():
            # ROS context 仍有效时，让执行器线程安全销毁动态订阅。
            with contextlib.suppress(asyncio.TimeoutError):
                await asyncio.wait_for(
                    asyncio.wrap_future(self.node.submit("close")), timeout=2.0)
        self.executor.shutdown()
        self.node.destroy_node()
        if rclpy.ok():
            rclpy.shutdown()
        self.ros_thread.join(timeout=2.0)


app = FastAPI(title="Jetson ROS2 Mobile Gateway", version="0.1.0")


@app.on_event("startup")
async def startup() -> None:
    """在 uvicorn 事件循环启动后初始化 ROS2。"""
    app.state.runtime = GatewayRuntime()
    app.state.discovery = GatewayAdvertiser(GATEWAY_PORT)
    app.state.discovery.refresh()
    app.state.discovery_task = asyncio.create_task(refresh_discovery())


async def refresh_discovery() -> None:
    """热点或路由器地址改变时刷新 mDNS 记录。"""
    while True:
        await asyncio.sleep(15)
        app.state.discovery.refresh()


@app.on_event("shutdown")
async def shutdown() -> None:
    """停止 ROS2 执行器与可能正在运行的 launch。"""
    app.state.discovery_task.cancel()
    with contextlib.suppress(asyncio.CancelledError):
        await app.state.discovery_task
    app.state.discovery.close()
    await app.state.runtime.close()


@app.get("/health")
async def health() -> Dict[str, object]:
    """便于 Jetson 本机或手机检查网关是否存活。"""
    runtime: GatewayRuntime = app.state.runtime
    return {
        "status": "ok",
        "image_topic": IMAGE_TOPIC,
        "capabilities": ["commands", "defaults", "dynamic_defaults", "history_clear",
                         "image_topics", "latency",
                         "multi_terminal", "yaml_editor", "build",
                         "password_auth", "system_power"],
    }


class LoginRequest(BaseModel):
    password: str


class PowerRequest(LoginRequest):
    action: str


def require_auth(authorization: Optional[str] = Header(default=None)) -> str:
    """校验 App 登录后获得的内存令牌，不接受 URL 中的 HTTP API token。"""
    bearer_prefix = "Bearer "
    if not authorization or not authorization.startswith(bearer_prefix):
        raise HTTPException(status_code=401, detail="请先使用 Ubuntu 密码连接开发板")
    # str.removeprefix() 需要 Python 3.9；ROS2 Foxy 的 Python 3.8 使用切片兼容。
    token = authorization[len(bearer_prefix):].strip()
    if not app.state.runtime.auth.authorize(token):
        raise HTTPException(status_code=401, detail="登录已失效，请重新输入 Ubuntu 密码")
    return token


@app.post("/api/auth/login")
async def login(request: LoginRequest) -> Dict[str, object]:
    try:
        return app.state.runtime.auth.login(request.password)
    except AuthError as error:
        raise HTTPException(status_code=401, detail=str(error)) from error


@app.post("/api/auth/logout")
async def logout(token: str = Depends(require_auth)) -> Dict[str, bool]:
    app.state.runtime.auth.logout(token)
    return {"ok": True}


@app.post("/api/system/power")
async def system_power(request: PowerRequest, _: str = Depends(require_auth)) -> Dict[str, str]:
    try:
        app.state.runtime.auth.request_power(request.password, request.action)
        return {"status": "accepted", "action": request.action}
    except AuthError as error:
        raise HTTPException(status_code=403, detail=str(error)) from error


@app.post("/api/launch/start", response_model=LaunchResponse)
async def start_launch(request: LaunchRequest, _: str = Depends(require_auth)) -> LaunchResponse:
    runtime: GatewayRuntime = app.state.runtime
    try:
        return await runtime.launches.start(request.launch_id)
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
    except RuntimeError as error:
        raise HTTPException(status_code=409, detail=str(error)) from error


@app.post("/api/launch/stop", response_model=LaunchResponse)
async def stop_launch(request: LaunchRequest, _: str = Depends(require_auth)) -> LaunchResponse:
    runtime: GatewayRuntime = app.state.runtime
    try:
        return await runtime.launches.stop(request.launch_id)
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
    except RuntimeError as error:
        raise HTTPException(status_code=409, detail=str(error)) from error


class DirectoryRequest(BaseModel):
    cwd: str


class CommandRequest(DirectoryRequest):
    command: str
    setup: str = ""


class CreateDefaultRequest(BaseModel):
    name: str = "新启动配置"


class DefaultRequest(CommandRequest):
    name: str


class CommandIdRequest(BaseModel):
    id: str


class PresetRequest(CommandIdRequest):
    name: str


class FileRequest(BaseModel):
    path: str


class SaveYamlRequest(FileRequest):
    content: str
    expected_mtime_ns: str


class BuildRequest(FileRequest):
    setup: str = ""


def command_error(error: Exception) -> HTTPException:
    """将路径、环境、存储和校验错误作为可读信息返回移动端。"""
    return HTTPException(status_code=400, detail=str(error))


@app.get("/api/commands")
async def command_state(_: str = Depends(require_auth)) -> Dict[str, object]:
    return app.state.runtime.commands.snapshot()


@app.get("/api/commands/logs/{run_id}")
async def command_logs(run_id: str, _: str = Depends(require_auth)) -> Dict[str, str]:
    try:
        return app.state.runtime.commands.terminal_log(run_id)
    except ValueError as error:
        raise command_error(error) from error


@app.delete("/api/commands/history")
async def clear_command_history(_: str = Depends(require_auth)) -> Dict[str, object]:
    """清理已结束的命令历史；运行中记录由命令管理器负责保留。"""
    try:
        return await app.state.runtime.commands.clear_history()
    except OSError as error:
        raise command_error(error) from error


@app.post("/api/commands/directory")
async def command_directory(request: DirectoryRequest, _: str = Depends(require_auth)) -> Dict[str, object]:
    try:
        return CommandManager.directory(request.cwd)
    except (ValueError, OSError) as error:
        raise command_error(error) from error


@app.post("/api/commands/files/read")
async def read_yaml_file(request: FileRequest, _: str = Depends(require_auth)) -> Dict[str, object]:
    try:
        return CommandManager.yaml_file(request.path)
    except (ValueError, OSError) as error:
        raise command_error(error) from error


@app.post("/api/commands/files/save")
async def save_yaml_file(request: SaveYamlRequest, _: str = Depends(require_auth)) -> Dict[str, object]:
    try:
        return CommandManager.save_yaml(
            request.path, request.content, request.expected_mtime_ns)
    except (ValueError, OSError) as error:
        raise command_error(error) from error


@app.post("/api/commands/build")
async def build_yaml_package(request: BuildRequest, _: str = Depends(require_auth)) -> Dict[str, object]:
    try:
        return await app.state.runtime.commands.start_build(request.path, request.setup)
    except (ValueError, OSError) as error:
        raise command_error(error) from error


@app.post("/api/commands/validate")
async def validate_command(request: CommandRequest, _: str = Depends(require_auth)) -> Dict[str, object]:
    try:
        return await app.state.runtime.commands.validate(request.cwd, request.command, request.setup)
    except (ValueError, OSError) as error:
        raise command_error(error) from error


@app.post("/api/commands/start")
async def start_command(request: CommandIdRequest, _: str = Depends(require_auth)) -> Dict[str, object]:
    try:
        return await app.state.runtime.commands.start(request.id)
    except (ValueError, OSError) as error:
        raise command_error(error) from error


@app.post("/api/commands/stop")
async def stop_command(request: CommandIdRequest, _: str = Depends(require_auth)) -> Dict[str, object]:
    try:
        return await app.state.runtime.commands.stop(request.id)
    except (ValueError, OSError) as error:
        raise command_error(error) from error


@app.post("/api/commands/presets")
async def save_preset(request: PresetRequest, _: str = Depends(require_auth)) -> Dict[str, object]:
    try:
        return app.state.runtime.commands.preset(request.id, request.name)
    except (ValueError, OSError) as error:
        raise command_error(error) from error


@app.delete("/api/commands/presets/{preset_id}")
async def delete_preset(preset_id: str, _: str = Depends(require_auth)) -> Dict[str, bool]:
    try:
        app.state.runtime.commands.delete_preset(preset_id)
        return {"ok": True}
    except OSError as error:
        raise command_error(error) from error


@app.get("/api/images/topics")
async def image_topics(_: str = Depends(require_auth)) -> Dict[str, object]:
    topics = await asyncio.wrap_future(app.state.runtime.node.submit("list"))
    return {"topics": topics, "default_topic": IMAGE_TOPIC}


@app.post("/api/commands/defaults")
async def create_default(request: CreateDefaultRequest,
                         _: str = Depends(require_auth)) -> Dict[str, object]:
    try:
        return app.state.runtime.commands.create_default(request.name)
    except (ValueError, OSError) as error:
        raise command_error(error) from error


@app.post("/api/commands/defaults/{default_id}")
async def configure_default(default_id: str, request: DefaultRequest,
                            _: str = Depends(require_auth)) -> Dict[str, object]:
    try:
        return await app.state.runtime.commands.configure_default(
            default_id, request.name, request.cwd, request.command, request.setup)
    except (ValueError, OSError) as error:
        raise command_error(error) from error


@app.delete("/api/commands/defaults/{default_id}")
async def delete_default(default_id: str,
                         _: str = Depends(require_auth)) -> Dict[str, bool]:
    try:
        app.state.runtime.commands.delete_default(default_id)
        return {"ok": True}
    except (ValueError, OSError) as error:
        raise command_error(error) from error


@app.websocket("/ws/mobile")
async def mobile_stream(websocket: WebSocket) -> None:
    """按客户端选择订阅图像；先发送元数据再发送 JPEG，并处理时钟与帧回执。"""
    runtime: GatewayRuntime = app.state.runtime
    await websocket.accept()
    try:
        # WebSocket 首帧认证避免把 Bearer token 放入 URL、代理或访问日志。
        auth_message = await asyncio.wait_for(websocket.receive_json(), timeout=5.0)
    except (asyncio.TimeoutError, WebSocketDisconnect):
        await websocket.close(code=1008, reason="WebSocket 认证超时")
        return
    token = auth_message.get("token", "") if isinstance(auth_message, dict) and auth_message.get("type") == "auth" else ""
    if not runtime.auth.authorize(token):
        await websocket.close(code=1008, reason="请先使用 Ubuntu 密码登录")
        return
    send_lock = asyncio.Lock()
    topic = websocket.query_params.get("topic", IMAGE_TOPIC)
    kind = websocket.query_params.get("message_type", COMPRESSED)
    channel = None
    acquisition = None
    workers = []
    timing = StreamTiming()

    async def receive() -> None:
        while True:
            text = await websocket.receive_text()
            received = time.monotonic() * 1000
            try:
                reply = timing.receive(json.loads(text), received)
            except (ValueError, TypeError):
                continue
            if reply is not None:
                async with send_lock:
                    if reply["type"] == "clock_pong":
                        reply["server_send_ms"] = time.monotonic() * 1000
                    await websocket.send_json(reply)

    async def send_frames() -> None:
        sequence = -1
        last_error = ""
        while True:
            if channel is not None:
                frame, error = channel.snapshot()
                if error and error != last_error:
                    async with send_lock:
                        await websocket.send_json({"type": "status", "message": error})
                last_error = error
                if frame is not None and frame.sequence != sequence:
                    async with send_lock:
                        sent = time.monotonic() * 1000
                        timing.sent(frame.sequence, sent)
                        metrics = dict(frame.latency_ms)
                        metrics["broadcast_wait_ms"] = sent - frame.ready_ms
                        await websocket.send_json({"type": "frame", "frame_id": frame.sequence,
                                                   "send_mono_ms": sent, "latency_ms": metrics,
                                                   "fps": round(frame.fps, 1), "topic": topic})
                        await websocket.send_bytes(frame.jpeg)
                        await websocket.send_json({"type": "latency_result", "frame_id": frame.sequence,
                                                   "latency_ms": {"socket_write_ms": time.monotonic() * 1000 - sent}})
                    sequence = frame.sequence
            await asyncio.sleep(1 / MAX_STREAM_FPS)

    try:
        if websocket.query_params.get("stream") != "0":
            acquisition = asyncio.wrap_future(runtime.node.submit("acquire", topic, kind))
            channel = await asyncio.shield(acquisition)
        await websocket.send_json({"type": "status", "connection_ready": True,
                                   "message": "连接成功", "topic": topic if channel else None})
        workers = [asyncio.create_task(receive()), asyncio.create_task(send_frames())]
        done, _ = await asyncio.wait(workers, return_when=asyncio.FIRST_COMPLETED)
        for task in done:
            task.result()
    except (WebSocketDisconnect, RuntimeError):
        pass
    except Exception as error:
        with contextlib.suppress(Exception):
            await websocket.send_json({"type": "status", "message": str(error)})
            await websocket.close(code=1008)
    finally:
        for task in workers:
            task.cancel()
        await asyncio.gather(*workers, return_exceptions=True)
        if channel is None and acquisition is not None:
            # 连接在订阅创建过程中断开时，也必须回收已创建的 ROS 实体。
            with contextlib.suppress(Exception):
                channel = await acquisition
        if channel is not None:
            await asyncio.wrap_future(runtime.node.submit("release", topic, kind))


def main() -> None:
    """以单 worker 运行；多 worker 会重复创建 ROS 节点和 launch。"""
    uvicorn.run(app, host=GATEWAY_HOST, port=GATEWAY_PORT, workers=1)


if __name__ == "__main__":
    main()
