"""移动端命令白名单、持久化记录与进程管理；不依赖 ROS，便于独立测试。"""

import asyncio
import json
import os
from pathlib import Path
import shlex
import signal
import time
from typing import Any, Dict, List, Optional
import uuid
import xml.etree.ElementTree as ElementTree

import yaml


MAX_CONCURRENT_RUNS = 8
MAX_EDIT_FILE_BYTES = 512 * 1024


class CommandManager:
    """校验后的命令作为临时白名单，成功运行后可保存为持久预设。"""

    def __init__(self, store_path: Path) -> None:
        self.store_path = store_path
        self.history: List[Dict[str, Any]] = []
        self.presets: List[Dict[str, Any]] = []
        # 新安装提供两个示例；用户可以重命名、删除或继续增加启动配置。
        self.defaults: List[Dict[str, Any]] = [
            {"id": "car_system", "name": "小车系统", "file": "run_launch.py",
             "cwd": "", "command": "ros2 launch wheel_perception run_launch.py", "setup": "", "configured": False},
            {"id": "bluetooth_system", "name": "蓝牙节点", "file": "sub.py",
             "cwd": "/home/lee/wheel/wheel_cuda/src/wheel_perception/scripts",
             "command": "python3 /home/lee/wheel/wheel_cuda/src/wheel_perception/scripts/sub.py",
             "setup": "", "configured": False},
        ]
        self.approved: Dict[str, Dict[str, Any]] = {}
        self.active: Dict[str, Dict[str, Any]] = {}
        self.processes: Dict[str, asyncio.subprocess.Process] = {}
        self.logs: Dict[str, List[str]] = {}
        self.lock = asyncio.Lock()
        self.watchers: Dict[str, asyncio.Task] = {}
        if store_path.exists():
            data = json.loads(store_path.read_text(encoding="utf-8"))
            self.history = data.get("history", [])[:100]
            self.presets = data.get("presets", [])
            # defaults 字段沿用旧协议名称，但现在保存的是可增删的启动配置列表。
            if isinstance(data.get("defaults"), list):
                self.defaults = data["defaults"]
            # 只迁移旧内置名称；用户自定义过的名称保持不变。
            migrated = False
            for option in self.defaults:
                if option.get("id") == "bluetooth_system" and option.get("name") == "蓝牙系统":
                    option["name"] = "蓝牙节点"
                    migrated = True
            # 网关异常退出留下的记录不能误报为仍在运行。
            for record in self.history:
                if record["state"] in ("starting", "running", "stopping"):
                    record.update(state="interrupted", message="上次网关退出，任务状态未知")
            if migrated:
                self._save()

    def _save(self) -> None:
        self.store_path.parent.mkdir(parents=True, exist_ok=True)
        temporary = self.store_path.with_suffix(".tmp")
        temporary.write_text(json.dumps({"history": self.history, "presets": self.presets, "defaults": self.defaults},
                                        ensure_ascii=False, indent=2), encoding="utf-8")
        temporary.replace(self.store_path)

    def _log(self, run_id: str, message: str) -> None:
        """按终端保存网关诊断行，并保持每个终端的内存有界。"""
        lines = self.logs.setdefault(run_id, [])
        lines.append("[gateway] %s\n" % message)
        self.logs[run_id] = lines[-80:]

    @staticmethod
    def directory(value: str) -> Dict[str, Any]:
        path = Path(value).expanduser()
        if not path.is_absolute():
            raise ValueError("请输入 Jetson 上的绝对目录路径")
        path = path.resolve(strict=True)
        if not path.is_dir():
            raise ValueError("该路径不是文件夹")
        if not os.access(str(path), os.R_OK | os.X_OK):
            raise ValueError("网关没有读取该文件夹的权限")
        entries = sorted(path.iterdir(), key=lambda item: (not item.is_dir(), item.name))
        return {"cwd": str(path), "parent": str(path.parent), "entries": [
            {"name": item.name, "path": str(item), "directory": item.is_dir(),
             "editable": item.is_file() and item.suffix.lower() in (".yaml", ".yml")}
            for item in entries[:100]
        ], "truncated": len(entries) > 100}

    @staticmethod
    def yaml_file(value: str) -> Dict[str, Any]:
        """读取一个 YAML 文件，并定位其 ROS 包与 colcon 工作区。"""
        path = Path(value).expanduser().resolve(strict=True)
        if not path.is_file() or path.suffix.lower() not in (".yaml", ".yml"):
            raise ValueError("只允许编辑存在的 .yaml 或 .yml 文件")
        if path.stat().st_size > MAX_EDIT_FILE_BYTES:
            raise ValueError("YAML 文件不能超过 512 KiB")
        content = path.read_text(encoding="utf-8")
        package_root: Optional[Path] = None
        package_name = ""
        for parent in (path.parent, *path.parents):
            manifest = parent / "package.xml"
            if manifest.is_file():
                package_root = parent
                try:
                    name = ElementTree.parse(manifest).getroot().findtext("name")
                except ElementTree.ParseError as error:
                    raise ValueError("package.xml 格式错误：%s" % error) from error
                package_name = (name or "").strip()
                break
        workspace = ""
        if package_root is not None:
            src_parent = next((parent for parent in package_root.parents if parent.name == "src"), None)
            if src_parent is not None:
                workspace = str(src_parent.parent)
        stat = path.stat()
        # 纳秒时间戳超过 JavaScript 安全整数范围，使用字符串避免手机往返时精度丢失。
        return {"path": str(path), "content": content, "mtime_ns": str(stat.st_mtime_ns),
                "package": package_name, "package_path": str(package_root or ""),
                "workspace": workspace}

    @staticmethod
    def save_yaml(value: str, content: str, expected_mtime_ns: str) -> Dict[str, Any]:
        """校验 YAML 后原子保存；mtime 不一致时拒绝覆盖外部修改。"""
        info = CommandManager.yaml_file(value)
        encoded = content.encode("utf-8")
        if len(encoded) > MAX_EDIT_FILE_BYTES:
            raise ValueError("YAML 文件不能超过 512 KiB")
        if info["mtime_ns"] != str(expected_mtime_ns):
            raise ValueError("文件已被其他程序修改，请重新打开后再保存")
        try:
            list(yaml.safe_load_all(content))
        except yaml.YAMLError as error:
            raise ValueError("YAML 格式错误：%s" % error) from error
        path = Path(info["path"])
        temporary = path.with_name(".%s.mobile.tmp" % path.name)
        temporary.write_bytes(encoded)
        os.chmod(temporary, path.stat().st_mode)
        temporary.replace(path)
        return CommandManager.yaml_file(str(path))

    async def validate(self, cwd: str, command: str, setup: str = "") -> Dict[str, Any]:
        directory = self.directory(cwd)["cwd"]
        argv = shlex.split(command)
        if not argv or any(token in (";", "&&", "||", "|", ">", "<", "&") for token in argv):
            raise ValueError("仅支持单条 ros2 launch、ros2 run 或 python3 命令；工作目录和环境脚本请单独填写")
        target = ""
        if argv[0] == "python3" and len(argv) >= 2 and not argv[1].startswith("-"):
            script = Path(directory, argv[1]).resolve(strict=True)
            if not script.is_file() or script.suffix != ".py":
                raise ValueError("python3 后必须是存在的 .py 文件")
            argv[1] = str(script)
            target = str(script)
        elif len(argv) >= 3 and argv[:2] == ["ros2", "launch"]:
            local = Path(directory, argv[2])
            if local.is_file():
                argv[2] = str(local.resolve())
                target = argv[2]
            elif len(argv) < 4 or argv[2].startswith("-") or argv[3].startswith("-"):
                raise ValueError("格式：ros2 launch 包名 launch文件，或 ros2 launch 本地文件路径")
        elif len(argv) >= 4 and argv[:2] == ["ros2", "run"]:
            if argv[2].startswith("-") or argv[3].startswith("-"):
                raise ValueError("格式：ros2 run 包名 可执行文件")
        else:
            raise ValueError("支持 ros2 launch、ros2 run、python3 文件.py；不支持 Shell 脚本或命令串")
        setup_path = ""
        if setup.strip():
            source_input = Path(setup.strip()).expanduser()
            source = (Path(directory) / source_input).resolve(strict=True)
            if not source.is_file():
                raise ValueError("环境脚本不是文件")
            setup_path = str(source)
        spec = {"cwd": directory, "command": shlex.join(argv), "setup": setup_path, "argv": argv}
        if argv[0] == "ros2" and not target:
            # 在与执行相同的环境中解析包，避免仅凭工作目录猜测 ROS 安装位置。
            probe = await asyncio.create_subprocess_exec(
                *self._execution(spec, ["ros2", "pkg", "prefix", argv[2]]),
                cwd=directory, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE,
                start_new_session=True)
            try:
                stdout, stderr = await asyncio.wait_for(probe.communicate(), 10)
            except asyncio.TimeoutError:
                await self._terminate(probe)
                raise ValueError("ROS 包查询超时，请检查环境脚本")
            if probe.returncode != 0:
                raise ValueError("无法找到 ROS 包：" + stderr.decode(errors="replace")[-1000:])
            prefix = Path(stdout.decode().strip().splitlines()[-1])
            if argv[1] == "run":
                executable = prefix / "lib" / argv[2] / argv[3]
                if not executable.is_file() or not os.access(str(executable), os.X_OK):
                    raise ValueError("包内不存在可执行节点：" + str(executable))
                target = str(executable)
            else:
                share = prefix / "share" / argv[2]
                matches = [path for path in share.rglob(argv[3]) if path.is_file()]
                if len(matches) != 1:
                    raise ValueError("包内 launch 文件不存在或不唯一，请改用绝对文件路径")
                target = str(matches[0])
        spec["target"] = target
        spec["id"] = uuid.uuid4().hex
        # 限制临时白名单大小；每次启动仍重新校验文件和环境。
        if len(self.approved) >= 200:
            self.approved.pop(next(iter(self.approved)))
        self.approved[spec["id"]] = spec
        return spec

    @staticmethod
    def _execution(spec: Dict[str, Any], argv: Optional[List[str]] = None) -> List[str]:
        command = argv if argv is not None else spec["argv"]
        if spec["setup"]:
            # 用户输入不拼入 Shell 程序；source 路径与命令均作为位置参数传入。
            return ["bash", "-c", 'source "$1" >&2 || exit $?; shift; exec "$@"',
                    "gateway", spec["setup"], *command]
        return command

    async def start(self, approved_id: str) -> Dict[str, Any]:
        spec = self.approved.get(approved_id)
        if spec is None:
            raise ValueError("白名单校验已失效，请重新校验命令")
        checked = await self.validate(spec["cwd"], spec["command"], spec["setup"])
        return await self._start_checked(checked, "command")

    async def start_build(self, yaml_path: str, setup: str = "") -> Dict[str, Any]:
        """为 YAML 所属 ROS 包启动独立 colcon 构建终端。"""
        info = self.yaml_file(yaml_path)
        if not info["package"] or not info["workspace"]:
            raise ValueError("无法从 YAML 路径定位 package.xml 和 colcon 工作区")
        directory = self.directory(info["workspace"])["cwd"]
        setup_path = ""
        if setup.strip():
            source_input = Path(setup.strip()).expanduser()
            source = (Path(directory) / source_input).resolve(strict=True)
            if not source.is_file():
                raise ValueError("环境脚本不是文件")
            setup_path = str(source)
        argv = ["colcon", "build", "--packages-select", info["package"]]
        checked = {"cwd": directory, "command": shlex.join(argv), "setup": setup_path,
                   "argv": argv, "target": info["package_path"]}
        return await self._start_checked(checked, "build")

    async def _start_checked(self, checked: Dict[str, Any], kind: str) -> Dict[str, Any]:
        """启动已由网关构造或重新校验的命令，并分配独立终端。"""
        async with self.lock:
            if len(self.active) >= MAX_CONCURRENT_RUNS:
                raise ValueError("同时运行的终端已达到上限 8 个")
            record = {key: checked[key] for key in ("cwd", "command", "setup", "target")}
            record.update(id=uuid.uuid4().hex, started_at=time.time(), state="starting",
                          successful=False, message="正在启动", returncode=None, kind=kind)
            self.history.insert(0, record)
            self.history = self.history[:100]
            retained_ids = {item["id"] for item in self.history}
            self.logs = {key: value for key, value in self.logs.items() if key in retained_ids}
            self._save()
            try:
                process_environment = os.environ.copy()
                # 管道不是 TTY；强制 Python 及时刷新，并关闭 ROS ANSI 颜色方便手机终端阅读。
                process_environment.setdefault("PYTHONUNBUFFERED", "1")
                process_environment.setdefault("RCUTILS_COLORIZED_OUTPUT", "0")
                process = await asyncio.create_subprocess_exec(
                    *self._execution(checked), cwd=checked["cwd"],
                    stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.STDOUT,
                    start_new_session=True, env=process_environment)
            except OSError as error:
                record.update(state="failed", message=str(error))
                self._save()
                raise ValueError("启动失败：" + str(error)) from error
            run_id = record["id"]
            self.processes[run_id] = process
            self.active[run_id] = record
            self.logs[run_id] = []
            self._log(run_id, "cwd: %s" % checked["cwd"])
            if checked["setup"]:
                self._log(run_id, "source: %s" % checked["setup"])
            self._log(run_id, "exec: %s" % checked["command"])
            self._log(run_id, "pid: %d，进程组已创建" % process.pid)
            self.watchers[run_id] = asyncio.create_task(self._watch(process, record))
        # “成功启动”指存活一秒，或正常退出；不表示节点业务功能已经验证。
        await asyncio.sleep(1)
        async with self.lock:
            if self.active.get(record["id"]) is record and record["state"] == "starting" and process.returncode is None:
                record.update(state="running", successful=True, message="进程已启动，业务状态请查看日志")
                self._save()
        return record.copy()

    async def _watch(self, process: asyncio.subprocess.Process, record: Dict[str, Any]) -> None:
        async def drain() -> None:
            if process.stdout is not None:
                # 按块读取，避免超长无换行日志触发 readline 限制。
                while True:
                    chunk = await process.stdout.read(2048)
                    if not chunk:
                        break
                    run_id = record["id"]
                    lines = self.logs.setdefault(run_id, [])
                    lines.append(chunk.decode("utf-8", errors="replace"))
                    self.logs[run_id] = lines[-80:]

        reader = asyncio.create_task(drain())
        # returncode 可先于管道关闭出现；子进程继承 stdout 时不能只等待 EOF。
        while process.returncode is None:
            await asyncio.sleep(0.1)
        code = process.returncode
        async with self.lock:
            if record["state"] in ("stopping", "stopped"):
                await reader
                return
            # 父进程退出后同样回收进程组中的残留节点。
            await self._terminate(process)
            await reader
            record.update(state="completed" if code == 0 else "failed", returncode=code,
                          successful=record["successful"] or code == 0,
                          message="进程已退出（代码 %d）" % code)
            run_id = record["id"]
            self._log(run_id, "进程退出，代码 %d" % code)
            self.active.pop(run_id, None)
            self.processes.pop(run_id, None)
            self._save()

    @staticmethod
    async def _terminate(process: asyncio.subprocess.Process) -> None:
        # 即使父进程先退出，也对整个组升级信号，避免遗留 ROS 子节点。
        for sig, delay in ((signal.SIGINT, 3), (signal.SIGTERM, 1), (signal.SIGKILL, 0)):
            try:
                os.killpg(process.pid, sig)
            except ProcessLookupError:
                break
            if delay:
                for _ in range(delay * 10):
                    await asyncio.sleep(0.1)
                    try:
                        os.killpg(process.pid, 0)
                    except ProcessLookupError:
                        break
                else:
                    continue
                break
        await process.wait()

    async def stop(self, run_id: str) -> Dict[str, Any]:
        async with self.lock:
            record = self.active.get(run_id)
            process = self.processes.get(run_id)
            if record is None or process is None:
                raise ValueError("该终端没有运行中的任务，请刷新状态")
            record.update(state="stopping", message="正在停止进程组")
            self._log(run_id, "正在停止 pid %d 的进程组" % process.pid)
        await self._terminate(process)
        async with self.lock:
            record.update(state="stopped", message="已停止", returncode=process.returncode)
            self._log(run_id, "停止完成，退出代码 %s" % process.returncode)
            self.active.pop(run_id, None)
            self.processes.pop(run_id, None)
            self._save()
            return record.copy()

    def preset(self, run_id: str, name: str) -> Dict[str, Any]:
        record = next((item for item in self.history if item["id"] == run_id), None)
        if record is None or not record["successful"]:
            raise ValueError("仅成功启动或正常完成的历史记录可加入预设")
        if not name.strip() or len(name.strip()) > 80:
            raise ValueError("预设名称长度应为 1–80 个字符")
        preset = {key: record[key] for key in ("cwd", "command", "setup")}
        preset.update(id=uuid.uuid4().hex, name=name.strip())
        self.presets.append(preset)
        self._save()
        return preset

    def delete_preset(self, preset_id: str) -> None:
        self.presets = [item for item in self.presets if item["id"] != preset_id]
        self._save()

    async def clear_history(self) -> Dict[str, Any]:
        """清除已结束记录，但保留运行中任务，确保 App 仍能停止对应进程。"""
        async with self.lock:
            active_ids = set(self.active)
            previous_count = len(self.history)
            self.history = [item for item in self.history if item["id"] in active_ids]
            retained_ids = [item["id"] for item in self.history]
            self.logs = {key: value for key, value in self.logs.items() if key in active_ids}
            self._save()
            return {"deleted": previous_count - len(self.history),
                    "retained_ids": retained_ids, "snapshot": self.snapshot()}

    @staticmethod
    def _configuration_name(value: str) -> str:
        name = value.strip()
        if not name or len(name) > 80:
            raise ValueError("启动配置名称长度应为 1–80 个字符")
        return name

    def create_default(self, name: str) -> Dict[str, Any]:
        """创建空白启动配置；命令通过既有校验流程确认后才可一键运行。"""
        option = {"id": "launch_" + uuid.uuid4().hex, "name": self._configuration_name(name),
                  "file": "尚未配置", "cwd": "", "command": "", "setup": "", "configured": False}
        self.defaults.append(option)
        self._save()
        return option.copy()

    def delete_default(self, default_id: str) -> None:
        if not any(item["id"] == default_id for item in self.defaults):
            raise ValueError("启动配置不存在")
        self.defaults = [item for item in self.defaults if item["id"] != default_id]
        self._save()

    async def configure_default(self, default_id: str, name: str, cwd: str,
                                command: str, setup: str) -> Dict[str, Any]:
        target = next((item for item in self.defaults if item["id"] == default_id), None)
        if target is None:
            raise ValueError("启动配置不存在")
        checked = await self.validate(cwd, command, setup)
        argv = checked["argv"]
        if argv[0] == "python3":
            display_file = Path(argv[1]).name
        elif argv[:2] == ["ros2", "launch"]:
            display_file = Path(argv[2] if len(argv) == 3 else argv[3]).name
        else:
            display_file = argv[3]
        target.update({key: checked[key] for key in ("cwd", "command", "setup")})
        target.update(name=self._configuration_name(name), file=display_file)
        target["configured"] = True
        self._save()
        return target.copy()

    def snapshot(self) -> Dict[str, Any]:
        active_runs = sorted(self.active.values(), key=lambda item: item["started_at"])
        return {"active": active_runs[0] if active_runs else None, "active_runs": active_runs,
                "history": self.history, "presets": self.presets, "defaults": self.defaults}

    def terminal_log(self, run_id: str) -> Dict[str, str]:
        if not any(item["id"] == run_id for item in self.history):
            raise ValueError("终端记录不存在")
        return {"id": run_id, "logs": "".join(self.logs.get(run_id, []))[-12000:]}

    async def shutdown(self) -> None:
        for run_id in list(self.active):
            await self.stop(run_id)
        if self.watchers:
            await asyncio.gather(*self.watchers.values(), return_exceptions=True)
