import { Alert, Text, View } from 'react-native';
import { runStates, useCommands } from '@/providers/command-provider';
import { ActionButton, EmptyState, Row, Screen, Section, StatusBanner } from '@/ui/primitives';
import { spacing, useThemeColors } from '@/ui/tokens';

export default function HistoryScreen(): React.JSX.Element {
  const colors = useThemeColors();
  const commands = useCommands();
  const recent = commands.snapshot?.history.slice(0, 3) ?? [];
  const presets = commands.snapshot?.presets.slice(0, 3) ?? [];
  return (
    <Screen>
      <Section title="最近运行">
        {recent.map((run) => <View key={run.id} style={{ padding: spacing.lg, gap: 5, borderBottomWidth: 1, borderBottomColor: colors.separator }}>
          <Text selectable style={{ color: colors.label, fontSize: 16, fontWeight: '600' }}>{runStates[run.state] ?? run.state}</Text>
          <Text selectable numberOfLines={1} style={{ color: colors.secondaryLabel, fontSize: 13 }}>{run.command}</Text>
          <Text selectable style={{ color: colors.tertiaryLabel, fontSize: 12 }}>{new Date(run.started_at * 1000).toLocaleString()}</Text>
        </View>)}
        {!recent.length ? <EmptyState title="暂无运行记录" detail="完成一次启动后，记录会出现在这里。" /> : null}
        <Row label="查看全部" value={`${commands.snapshot?.history.length ?? 0} 条`} href="/history/runs" last />
      </Section>
      <Section title="启动预设">
        {presets.map((preset) => <Row key={preset.id} label={preset.name} detail={preset.command} onPress={() => void commands.start(preset).catch(() => undefined)} />)}
        <Row label="管理预设" value={`${commands.snapshot?.presets.length ?? 0} 个`} href="/history/presets" last />
      </Section>
      <Section title="历史管理">
        <View style={{ padding: spacing.lg }}>
          <ActionButton
            label="清除历史记录"
            destructive
            disabled={!commands.snapshot?.history.some((run) => !['starting', 'running', 'stopping'].includes(run.state)) || commands.busy || !commands.online}
            onPress={() => Alert.alert('清除历史记录？', '已结束任务的记录和终端输出将被删除，正在运行的任务会保留。', [
              { text: '取消', style: 'cancel' },
              { text: '清除', style: 'destructive', onPress: () => void commands.clearHistory().catch(() => undefined) },
            ])}
          />
        </View>
      </Section>
      <StatusBanner message={commands.message} tone={commands.online ? 'neutral' : 'warning'} />
    </Screen>
  );
}
