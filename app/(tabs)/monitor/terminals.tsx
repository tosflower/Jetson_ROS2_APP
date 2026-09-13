import { ScrollView, Text, View } from 'react-native';
import TerminalWindow from '@/TerminalWindow';
import { Run, useCommands } from '@/providers/command-provider';
import { ActionButton, Field, Screen, Section, StatusBanner } from '@/ui/primitives';
import { spacing, useThemeColors } from '@/ui/tokens';

function terminalLabel(run: Run): string {
  if (run.kind === 'build') return `build · ${run.target?.split('/').pop() ?? 'ROS包'}`;
  const parts = run.command.split(' ');
  return parts[parts.length - 1]?.split('/').pop() || 'terminal';
}

export default function TerminalsScreen(): React.JSX.Element {
  const colors = useThemeColors();
  const commands = useCommands();
  const history = commands.snapshot?.history ?? [];
  const terminalRuns = commands.terminalIds.map((id) => history.find((run) => run.id === id)).filter((run): run is Run => !!run);
  const selectedRun = history.find((run) => run.id === commands.selectedRunId);
  const activeIds = new Set(commands.snapshot?.active_runs.map((run) => run.id) ?? []);
  return (
    <Screen>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
        {terminalRuns.map((run) => {
          const selected = commands.selectedRunId === run.id;
          return <View key={run.id} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: selected ? colors.elevated : colors.surface, borderRadius: 10, borderCurve: 'continuous', borderWidth: 1, borderColor: selected ? colors.primary : colors.separator }}>
            <Text onPress={() => commands.selectTerminal(run.id)} numberOfLines={1} style={{ color: colors.label, fontSize: 13, paddingHorizontal: 12, paddingVertical: 14, maxWidth: 180 }}>{activeIds.has(run.id) ? '● ' : ''}{terminalLabel(run)}</Text>
            <Text accessibilityLabel="关闭终端标签" onPress={() => commands.closeTerminal(run.id)} style={{ color: colors.secondaryLabel, fontSize: 21, paddingHorizontal: 12, paddingVertical: 9 }}>×</Text>
          </View>;
        })}
        <Text onPress={() => commands.selectTerminal(undefined)} style={{ color: colors.label, backgroundColor: commands.selectedRunId ? colors.surface : colors.elevated, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 14 }}>＋ 新终端</Text>
      </ScrollView>

      <TerminalWindow key={commands.selectedRunId ?? 'new'} run={selectedRun} logs={commands.selectedRunId ? commands.terminalLogs[commands.selectedRunId] ?? '' : ''} message={commands.message} />
      {selectedRun && activeIds.has(selectedRun.id) ? <ActionButton destructive label="停止当前标签进程组" disabled={!commands.online} onPress={() => void commands.stopRun(selectedRun.id).catch(() => undefined)} /> : null}

      <Section title="在新终端运行命令" footer="最多同时运行 8 个受控进程；关闭标签不会停止程序。">
        <View style={{ padding: spacing.lg, gap: spacing.md }}>
          <Field value={commands.cwd} editable={!commands.busy} onChangeText={commands.editCwd} autoCapitalize="none" placeholder="工作目录，例如 /home/jetson/ros2_ws" />
          <Field value={commands.setup} editable={!commands.busy} onChangeText={commands.editSetup} autoCapitalize="none" placeholder="可选：install/setup.bash" />
          <Field value={commands.command} editable={!commands.busy} onChangeText={commands.editCommand} autoCapitalize="none" multiline textAlignVertical="top" style={{ minHeight: 84 }} placeholder="ros2 launch 包名 文件.launch.py" />
          <ActionButton label="在新标签执行命令" disabled={!commands.online || !commands.cwd.trim() || !commands.command.trim()} onPress={() => void commands.runFromTerminal().catch(() => undefined)} />
        </View>
      </Section>
      <StatusBanner message={commands.busy ? `处理中… ${commands.message}` : commands.message} />
    </Screen>
  );
}
