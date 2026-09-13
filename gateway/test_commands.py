"""无需 ROS/硬件的命令生命周期回归测试。"""
import asyncio
from pathlib import Path
import tempfile
import unittest

from commands import CommandManager


class CommandTests(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self) -> None:
        self.temporary = tempfile.TemporaryDirectory()
        self.root = Path(self.temporary.name)
        self.manager = CommandManager(self.root / 'records.json')

    async def asyncTearDown(self) -> None:
        await self.manager.shutdown()
        self.temporary.cleanup()

    async def script(self, code: str, filename: str = 'node.py') -> dict:
        path = self.root / filename
        path.write_text(code)
        return await self.manager.validate(str(self.root), 'python3 ' + repr(filename))

    async def settle(self) -> None:
        if self.manager.watchers:
            await asyncio.wait_for(
                asyncio.gather(*self.manager.watchers.values()), 8)

    async def test_directory_and_rejected_commands(self) -> None:
        with self.assertRaises(ValueError):
            self.manager.directory('relative')
        for command in ('bash evil.sh', 'python3 -c "print(1)"', 'ros2 run a b && reboot'):
            with self.assertRaises(ValueError):
                await self.manager.validate(str(self.root), command)
        with self.assertRaises(FileNotFoundError):
            await self.manager.validate(str(self.root), 'python3 missing.py')

    async def test_success_history_presets_and_restore(self) -> None:
        checked = await self.script('print("完成")', '带 空格.py')
        record = await self.manager.start(checked['id'])
        await self.settle()
        self.assertEqual(record['state'], 'completed')
        self.assertTrue(record['successful'])
        logs = self.manager.terminal_log(record['id'])['logs']
        self.assertIn('完成', logs)
        self.assertIn('[gateway] pid:', logs)
        self.assertIn('[gateway] 进程退出，代码 0', logs)
        preset = self.manager.preset(record['id'], '测试预设')
        restored = CommandManager(self.manager.store_path)
        self.assertEqual(restored.presets[0]['cwd'], str(self.root))
        self.assertEqual(restored.history[0]['state'], 'completed')
        restored.delete_preset(preset['id'])
        self.assertEqual(CommandManager(self.manager.store_path).presets, [])

    async def test_failure_cannot_be_saved(self) -> None:
        checked = await self.script('raise RuntimeError("失败")')
        record = await self.manager.start(checked['id'])
        await self.settle()
        self.assertEqual(record['state'], 'failed')
        with self.assertRaises(ValueError):
            self.manager.preset(record['id'], '不能保存')

    async def test_clear_history_keeps_active_runs(self) -> None:
        completed_checked = await self.script('print("done")')
        completed = await self.manager.start(completed_checked['id'])
        await self.settle()
        active_checked = await self.script(
            'import time\nwhile True: time.sleep(0.1)', 'active.py')
        active = await self.manager.start(active_checked['id'])

        result = await self.manager.clear_history()

        self.assertEqual(result['deleted'], 1)
        self.assertEqual(result['retained_ids'], [active['id']])
        self.assertEqual([item['id'] for item in self.manager.history], [active['id']])
        with self.assertRaises(ValueError):
            self.manager.terminal_log(completed['id'])
        self.assertIn(active['id'], self.manager.active)

    async def test_start_configurations_support_crud_and_restore(self) -> None:
        created = self.manager.create_default('  巡检系统  ')
        self.assertEqual(created['name'], '巡检系统')
        self.assertFalse(created['configured'])
        (self.root / 'inspect.py').write_text('print("inspect")')

        configured = await self.manager.configure_default(
            created['id'], '自动巡检', str(self.root), 'python3 inspect.py', '')

        self.assertEqual(configured['name'], '自动巡检')
        self.assertEqual(configured['file'], 'inspect.py')
        self.assertTrue(configured['configured'])
        restored = CommandManager(self.manager.store_path)
        self.assertEqual(len(restored.defaults), 3)
        self.assertEqual(restored.defaults[-1]['name'], '自动巡检')
        restored.delete_default(created['id'])
        self.assertEqual(len(CommandManager(self.manager.store_path).defaults), 2)
        with self.assertRaises(ValueError):
            restored.delete_default(created['id'])
        with self.assertRaises(ValueError):
            self.manager.create_default('   ')

    async def test_old_bluetooth_default_name_is_migrated(self) -> None:
        bluetooth = next(item for item in self.manager.defaults
                         if item['id'] == 'bluetooth_system')
        bluetooth['name'] = '蓝牙系统'
        self.manager._save()

        restored = CommandManager(self.manager.store_path)

        restored_bluetooth = next(item for item in restored.defaults
                                  if item['id'] == 'bluetooth_system')
        self.assertEqual(restored_bluetooth['name'], '蓝牙节点')
        self.assertEqual(CommandManager(self.manager.store_path).defaults[1]['name'], '蓝牙节点')

    async def test_revalidate_deleted_file(self) -> None:
        checked = await self.script('print(1)')
        (self.root / 'node.py').unlink()
        with self.assertRaises(FileNotFoundError):
            await self.manager.start(checked['id'])
        self.assertFalse(self.manager.processes)

    async def test_multiple_tasks_and_independent_stop(self) -> None:
        first_checked = await self.script(
            'import time\nwhile True: time.sleep(0.1)', 'first.py')
        second_checked = await self.script(
            'import time\nwhile True: time.sleep(0.1)', 'second.py')
        first = await self.manager.start(first_checked['id'])
        second = await self.manager.start(second_checked['id'])
        self.assertEqual(len(self.manager.snapshot()['active_runs']), 2)
        with self.assertRaises(ValueError):
            await self.manager.stop('wrong-id')
        stopped = await self.manager.stop(first['id'])
        self.assertIn(second['id'], self.manager.active)
        await self.manager.stop(second['id'])
        await self.settle()
        self.assertEqual(stopped['state'], 'stopped')
        self.assertFalse(self.manager.active)

    async def test_setup_and_working_directory(self) -> None:
        (self.root / 'env.bash').write_text('export CUSTOM_TEST_VALUE=confirmed\n')
        await self.script('import os\nassert os.environ["CUSTOM_TEST_VALUE"] == "confirmed"\nassert os.path.isfile("env.bash")')
        checked = await self.manager.validate(str(self.root), 'python3 node.py', 'env.bash')
        record = await self.manager.start(checked['id'])
        await self.settle()
        self.assertEqual(record['state'], 'completed')

    async def test_large_output_does_not_block(self) -> None:
        checked = await self.script('print("a" * 200000)')
        record = await self.manager.start(checked['id'])
        await self.settle()
        self.assertEqual(record['state'], 'completed')
        self.assertLessEqual(len(self.manager.terminal_log(record['id'])['logs']), 12000)

    async def test_parent_exit_cleans_child_holding_stdout(self) -> None:
        checked = await self.script('import subprocess\nsubprocess.Popen(["sleep", "60"])')
        await self.manager.start(checked['id'])
        await self.settle()
        self.assertFalse(self.manager.active)
        self.assertEqual(self.manager.history[0]['state'], 'completed')

    async def test_stop_escalates_for_ignored_interrupt(self) -> None:
        checked = await self.script('import signal, time\nsignal.signal(signal.SIGINT, signal.SIG_IGN)\nwhile True: time.sleep(0.1)')
        record = await self.manager.start(checked['id'])
        stopped = await asyncio.wait_for(self.manager.stop(record['id']), 7)
        await self.settle()
        self.assertEqual(stopped['state'], 'stopped')
        self.assertEqual(stopped['returncode'], -15)

    async def test_arguments_are_not_shell_programs(self) -> None:
        await self.script('import sys\nassert sys.argv[1] == "$(touch unexpected)"')
        checked = await self.manager.validate(str(self.root), "python3 node.py '$(touch unexpected)'")
        record = await self.manager.start(checked['id'])
        await self.settle()
        self.assertEqual(record['state'], 'completed')
        self.assertFalse((self.root / 'unexpected').exists())

    async def test_restart_marks_old_active_record_unknown(self) -> None:
        checked = await self.script('import time\ntime.sleep(60)')
        await self.manager.start(checked['id'])
        restored = CommandManager(self.manager.store_path)
        self.assertEqual(restored.history[0]['state'], 'interrupted')
        self.assertFalse(restored.active)

    async def test_ros_package_resolution(self) -> None:
        binary = self.root / 'ros2'
        binary.write_text('#!/bin/sh\nprintf "%s\\n" "$FAKE_PREFIX"\n')
        binary.chmod(0o755)
        setup = self.root / 'env.bash'
        setup.write_text('export PATH="' + str(self.root) + ':$PATH"\nexport FAKE_PREFIX="' + str(self.root) + '"\n')
        launch = self.root / 'share' / 'demo' / 'launch' / 'demo.launch.py'
        launch.parent.mkdir(parents=True)
        launch.write_text('# launch fixture')
        checked = await self.manager.validate(str(self.root), 'ros2 launch demo demo.launch.py', str(setup))
        self.assertEqual(checked['target'], str(launch))
        with self.assertRaises(ValueError):
            await self.manager.validate(str(self.root), 'ros2 run demo missing.py', str(setup))

    async def test_yaml_edit_and_package_build_terminal(self) -> None:
        workspace = self.root / 'demo_ws'
        package = workspace / 'src' / 'demo_pkg'
        config = package / 'config' / 'params.yaml'
        config.parent.mkdir(parents=True)
        (package / 'package.xml').write_text(
            '<package><name>demo_pkg</name></package>')
        config.write_text('speed: 1.0\n')
        info = self.manager.yaml_file(str(config))
        self.assertEqual(info['package'], 'demo_pkg')
        self.assertEqual(info['workspace'], str(workspace))
        self.assertIsInstance(info['mtime_ns'], str)
        saved = self.manager.save_yaml(
            str(config), 'speed: 2.0\n', info['mtime_ns'])
        self.assertEqual(saved['content'], 'speed: 2.0\n')
        with self.assertRaises(ValueError):
            self.manager.save_yaml(str(config), 'speed: [\n', saved['mtime_ns'])

        binary = self.root / 'colcon'
        binary.write_text('#!/bin/sh\nprintf "build:%s\\n" "$*"\n')
        binary.chmod(0o755)
        setup = workspace / 'build_env.bash'
        setup.write_text('export PATH="' + str(self.root) + ':$PATH"\n')
        build = await self.manager.start_build(str(config), 'build_env.bash')
        await self.settle()
        self.assertEqual(build['kind'], 'build')
        self.assertIn('--packages-select demo_pkg', build['command'])
        self.assertIn('build:', self.manager.terminal_log(build['id'])['logs'])


if __name__ == '__main__':
    unittest.main()
