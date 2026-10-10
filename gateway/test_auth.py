"""认证与电源控制单元测试；所有 sudo 调用均被模拟，不会操作真实系统。"""

import subprocess
import unittest
from unittest.mock import patch

from auth import AuthError, AuthManager


class AuthManagerTests(unittest.TestCase):
    def setUp(self) -> None:
        self.auth = AuthManager(session_ttl_seconds=60)

    @patch("auth.subprocess.run")
    def test_password_creates_memory_only_session(self, run: object) -> None:
        run.return_value = subprocess.CompletedProcess([], 0, "", "")
        session = self.auth.login("correct-password")
        self.assertTrue(self.auth.authorize(session["token"]))
        self.assertNotIn("password", session)

    @patch("auth.subprocess.run")
    def test_wrong_password_is_rejected(self, run: object) -> None:
        run.return_value = subprocess.CompletedProcess([], 1, "", "sudo: incorrect password")
        with self.assertRaises(AuthError):
            self.auth.login("wrong-password")

    @patch("auth.subprocess.run")
    def test_power_uses_fixed_systemctl_action(self, run: object) -> None:
        run.return_value = subprocess.CompletedProcess([], 0, "", "")
        self.auth.request_power("correct-password", "reboot")
        command = run.call_args.args[0]
        self.assertEqual(command[-2:], ["systemctl", "reboot"])
        self.assertNotIn("correct-password", command)
        self.assertIn("correct-password\n", run.call_args.kwargs["input"])

    def test_unknown_power_action_is_rejected(self) -> None:
        with self.assertRaises(AuthError):
            self.auth.request_power("password", "format-disk")


if __name__ == "__main__":
    unittest.main()
