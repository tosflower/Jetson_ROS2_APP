"""Ubuntu 密码认证与固定电源动作。

密码仅通过子进程标准输入交给 sudo，不写磁盘、不放入命令行，也不保存在会话中。
"""

import secrets
import shutil
import subprocess
import threading
import time
from typing import Dict


class AuthError(ValueError):
    """认证失败或请求了不允许的系统动作。"""


class AuthManager:
    """维护仅存在于网关内存中的短期 Bearer 会话。"""

    def __init__(self, session_ttl_seconds: int = 8 * 60 * 60) -> None:
        self.session_ttl_seconds = session_ttl_seconds
        self._sessions: Dict[str, float] = {}
        self._lock = threading.Lock()

    @staticmethod
    def _sudo_path() -> str:
        path = shutil.which("sudo")
        if not path:
            raise AuthError("开发板没有安装 sudo，无法验证 Ubuntu 密码")
        return path

    def _verify_password(self, password: str) -> None:
        if not password:
            raise AuthError("请输入开发板 Ubuntu 用户密码")
        try:
            # -k 强制本次重新验证，-S 从标准输入读取，密码不会出现在进程参数中。
            result = subprocess.run(
                [self._sudo_path(), "-S", "-k", "-p", "", "-v"],
                input=f"{password}\n",
                text=True,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.PIPE,
                timeout=10,
                check=False,
            )
        except subprocess.TimeoutExpired as error:
            raise AuthError("密码验证超时") from error
        if result.returncode != 0:
            raise AuthError("Ubuntu 密码错误，或当前用户没有 sudo 权限")
        # 登录只验证身份；不把 sudo 凭据缓存留给网关后续的其他操作。
        subprocess.run(
            [self._sudo_path(), "-k"],
            stdin=subprocess.DEVNULL,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            timeout=5,
            check=False,
        )

    def login(self, password: str) -> Dict[str, object]:
        self._verify_password(password)
        token = secrets.token_urlsafe(32)
        expires_at = time.time() + self.session_ttl_seconds
        with self._lock:
            self._purge_locked()
            self._sessions[token] = expires_at
        return {"token": token, "expires_at": expires_at}

    def authorize(self, token: str) -> bool:
        if not token:
            return False
        with self._lock:
            self._purge_locked()
            expires_at = self._sessions.get(token)
            return expires_at is not None and expires_at > time.time()

    def logout(self, token: str) -> None:
        with self._lock:
            self._sessions.pop(token, None)

    def request_power(self, password: str, action: str) -> None:
        commands = {
            "reboot": "reboot",
            "poweroff": "poweroff",
        }
        system_action = commands.get(action)
        if system_action is None:
            raise AuthError("不支持的电源操作")
        if not password:
            raise AuthError("请输入开发板 Ubuntu 用户密码")
        try:
            # 本次调用同时验证密码并执行固定 systemctl 子命令，不使用 sudo 凭据缓存。
            result = subprocess.run(
                [self._sudo_path(), "-S", "-k", "-p", "", "systemctl", system_action],
                input=f"{password}\n",
                text=True,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.PIPE,
                timeout=15,
                check=False,
            )
        except subprocess.TimeoutExpired as error:
            # shutdown/reboot 导致系统中断时命令可能无法及时返回，视为已被接受。
            return
        if result.returncode != 0:
            raise AuthError("密码错误，或当前 Ubuntu 用户没有执行系统电源操作的权限")

    def _purge_locked(self) -> None:
        now = time.time()
        self._sessions = {
            token: expires_at for token, expires_at in self._sessions.items()
            if expires_at > now
        }
