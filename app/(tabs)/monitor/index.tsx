import { Text, View } from 'react-native';
import { runStates, useCommands } from '@/providers/command-provider';
import { useGateway } from '@/providers/gateway-provider';
import { EmptyState, Row, Screen, Section, StatusBanner } from '@/ui/primitives';
import { spacing, useThemeColors } from '@/ui/tokens';

export default function MonitorScreen(): React.JSX.Element {
  const colors = useThemeColors();
  const gateway = useGateway();
  const commands = useCommands();
  const active = commands.snapshot?.active_runs ?? [];
  return (
    <Screen>
      <View style={{ gap: spacing.sm }}>
        <StatusBanner message={gateway.gatewayState === '已连接' ? '系统在线' : gateway.lastMessage} tone={gateway.gatewayState === '已连接' ? 'success' : 'danger'} />
        <Text selectable style={{ color: colors.label, fontSize: 28, fontWeight: '700', fontVariant: ['tabular-nums'] }}>{active.length} / 8</Text>
        <Text selectable style={{ color: colors.secondaryLabel, fontSize: 14 }}>运行中的受控程序</Text>
      </View>
      <Section title="监控工具">
        <Row label="多终端" value={`${commands.terminalIds.length} 个标签`} href="/monitor/terminals" />
        <Row label="图像可视化" value={gateway.selectedTopic?.name ?? '未选择'} href="/monitor/images" last />
      </Section>
      <Section title="正在运行">
        {active.map((run, index) => <Row key={run.id} label={run.kind === 'build' ? `编译 · ${run.target?.split('/').pop() ?? 'ROS 包'}` : run.command.split(' ').pop() ?? run.command} value={runStates[run.state] ?? run.state} detail={run.command} onPress={() => commands.selectTerminal(run.id)} href="/monitor/terminals" last={index === active.length - 1} />)}
        {!active.length ? <EmptyState title="暂无运行程序" detail="从启动页运行程序后，会在这里显示状态。" /> : null}
      </Section>
      <StatusBanner message={commands.message} tone={commands.online ? 'neutral' : 'warning'} />
    </Screen>
  );
}
