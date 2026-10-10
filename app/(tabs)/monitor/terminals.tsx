import { ScrollView, Text, View } from 'react-native';
import TerminalWindow from '@/TerminalWindow';
import { MonitoredRun, ROSOUT_TERMINAL_ID, useMonitor } from '@/providers/monitor-provider';
import { Screen, StatusBanner } from '@/ui/primitives';
import { useThemeColors } from '@/ui/tokens';

function terminalLabel(run: MonitoredRun): string {
  if (run.kind === 'build') return `build · ${run.target?.split('/').pop() ?? 'ROS包'}`;
  const parts = run.command.split(' ');
  return parts[parts.length - 1]?.split('/').pop() || 'terminal';
}

export default function TerminalsScreen(): React.JSX.Element {
  const colors = useThemeColors();
  const monitor = useMonitor();
  const history = monitor.snapshot?.history ?? [];
  const terminalRuns = monitor.terminalIds.map((id) => history.find((run) => run.id === id)).filter((run): run is MonitoredRun => !!run);
  const selectedRun = history.find((run) => run.id === monitor.selectedRunId);
  const activeIds = new Set(monitor.snapshot?.active_runs.map((run) => run.id) ?? []);
  const showingRosout = monitor.selectedRunId === ROSOUT_TERMINAL_ID || !monitor.selectedRunId;
  return (
    <Screen>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
        <Text onPress={() => monitor.selectTerminal(ROSOUT_TERMINAL_ID)} style={{ color: colors.label, backgroundColor: showingRosout ? colors.elevated : colors.surface, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 14 }}>ROS 日志 · {monitor.rosConnected ? '在线' : '离线'}</Text>
        {terminalRuns.map((run) => {
          const selected = monitor.selectedRunId === run.id;
          return <View key={run.id} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: selected ? colors.elevated : colors.surface, borderRadius: 10, borderCurve: 'continuous', borderWidth: 1, borderColor: selected ? colors.primary : colors.separator }}>
            <Text onPress={() => monitor.selectTerminal(run.id)} numberOfLines={1} style={{ color: colors.label, fontSize: 13, paddingHorizontal: 12, paddingVertical: 14, maxWidth: 180 }}>{activeIds.has(run.id) ? '● ' : ''}{terminalLabel(run)}</Text>
            <Text accessibilityLabel="关闭终端标签" onPress={() => monitor.closeTerminal(run.id)} style={{ color: colors.secondaryLabel, fontSize: 21, paddingHorizontal: 12, paddingVertical: 9 }}>×</Text>
          </View>;
        })}
      </ScrollView>

      <TerminalWindow key={monitor.selectedRunId ?? 'none'} run={showingRosout ? undefined : selectedRun}
        logs={showingRosout ? monitor.rosoutLogs : monitor.selectedRunId ? monitor.terminalLogs[monitor.selectedRunId] ?? '' : ''}
        message={showingRosout ? monitor.rosConnected ? '正在接收 Jetson ROS 日志' : '等待 rosbridge 连接' : monitor.message}
        sourceLabel={showingRosout ? 'Jetson ROS 日志' : undefined} />
      {showingRosout ? <Text selectable style={{ color: colors.secondaryLabel, fontSize: 12 }}>显示 ROS2 节点发布到 /rosout 的日志；普通 shell 输出需要由启动方式提供日志文件或会话。</Text> : null}
      <StatusBanner message={monitor.message} tone={monitor.online ? 'neutral' : 'warning'} />
    </Screen>
  );
}
