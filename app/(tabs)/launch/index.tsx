import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { fallbackDefaults, useCommands } from '@/providers/command-provider';
import { useGateway } from '@/providers/gateway-provider';
import { ActionButton, EmptyState, Row, Screen, Section, StatusBanner } from '@/ui/primitives';
import { spacing, useThemeColors } from '@/ui/tokens';

export default function LaunchScreen(): React.JSX.Element {
  const colors = useThemeColors();
  const gateway = useGateway();
  const commands = useCommands();
  const defaults = commands.snapshot?.defaults ?? fallbackDefaults;
  const activeCount = commands.snapshot?.active_runs.length ?? 0;
  const connected = gateway.gatewayState === '已连接';

  return (
    <Screen>
      <View style={{ gap: spacing.sm }}>
        <StatusBanner message={connected ? `系统就绪 · ${gateway.connectedBase}` : gateway.lastMessage} tone={connected ? 'success' : 'danger'} />
        <Text selectable style={{ color: colors.secondaryLabel, fontSize: 15 }}>{activeCount ? `${activeCount} 个程序正在运行` : '当前没有运行中的程序'}</Text>
      </View>

      <View style={{ gap: spacing.md }}>
        {defaults.map((option) => (
          <View key={option.id} style={{ backgroundColor: colors.surface, borderRadius: 16, borderCurve: 'continuous', padding: spacing.lg, gap: spacing.md }}>
            <View style={{ gap: 4 }}>
              <Text selectable style={{ color: colors.label, fontSize: 20, fontWeight: '700' }}>{option.name}</Text>
              <Text selectable numberOfLines={1} style={{ color: colors.secondaryLabel, fontSize: 14 }}>{option.file}</Text>
            </View>
            <ActionButton
              label={option.configured ? '开始运行' : '配置后运行'}
              disabled={!commands.online}
              onPress={() => option.configured
                ? void commands.start(option).catch(() => undefined)
                : commands.loadSpec(option, option)}
            />
          </View>
        ))}
        {!defaults.length ? <EmptyState title="暂无启动配置" detail="进入“配置”添加需要的一键启动项。" /> : null}
      </View>

      <Section title="更多">
        <Row label="配置" detail="启动文件、路径、命令与 YAML" href="/launch/configuration" />
        <Row label="监控" value={`${activeCount} / 8`} href="/monitor" />
        <Row label="运行历史" value={`${commands.snapshot?.history.length ?? 0} 条`} href="/history" last />
      </Section>
      {!connected ? <ActionButton label="返回连接页" secondary onPress={() => router.push('/connection')} /> : null}
    </Screen>
  );
}
