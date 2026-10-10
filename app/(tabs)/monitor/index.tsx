import { Text, View } from 'react-native';
import { useMonitor } from '@/providers/monitor-provider';
import { useGateway } from '@/providers/gateway-provider';
import { EmptyState, Row, Screen, Section, StatusBanner } from '@/ui/primitives';
import { spacing, useThemeColors } from '@/ui/tokens';

export default function MonitorScreen(): React.JSX.Element {
  const colors = useThemeColors();
  const gateway = useGateway();
  const monitor = useMonitor();
  const active = monitor.snapshot?.active_runs ?? [];
  return (
    <Screen>
      <View style={{ gap: spacing.sm }}>
        <StatusBanner message={gateway.gatewayState === '已连接' ? '系统在线' : gateway.lastMessage} tone={gateway.gatewayState === '已连接' ? 'success' : 'danger'} />
        <Text selectable style={{ color: colors.label, fontSize: 28, fontWeight: '700', fontVariant: ['tabular-nums'] }}>{active.length}</Text>
        <Text selectable style={{ color: colors.secondaryLabel, fontSize: 14 }}>网关管理的运行任务</Text>
      </View>
      <Section title="监控工具">
        <Row label="终端与 ROS 日志" value={monitor.rosConnected ? 'ROS 订阅中' : `${monitor.terminalIds.length} 个网关标签`} href="/monitor/terminals" />
        <Row label="图像可视化" value={gateway.selectedTopic?.name ?? '未选择'} href="/monitor/images" last />
      </Section>
      <Section title="正在运行">
        {active.map((run, index) => <Row key={run.id} label={run.kind === 'build' ? `编译 · ${run.target?.split('/').pop() ?? 'ROS 包'}` : run.command.split(' ').pop() ?? run.command} value={run.state} detail={run.command} onPress={() => monitor.selectTerminal(run.id)} href="/monitor/terminals" last={index === active.length - 1} />)}
        {!active.length ? <EmptyState title="暂无网关任务" detail="Jetson 手动启动的 ROS2 节点日志请在“终端与 ROS 日志”中查看。" /> : null}
      </Section>
      <StatusBanner message={monitor.message} tone={monitor.online ? 'neutral' : 'warning'} />
    </Screen>
  );
}
