import { Alert, Text, View } from 'react-native';
import { runStates, useCommands } from '@/providers/command-provider';
import { ActionButton, EmptyState, Field, Screen, Section, StatusBanner } from '@/ui/primitives';
import { spacing, useThemeColors } from '@/ui/tokens';

export default function RunsScreen(): React.JSX.Element {
  const colors = useThemeColors();
  const commands = useCommands();
  const history = commands.snapshot?.history ?? [];
  return (
    <Screen>
      <Field value={commands.presetName} onChangeText={commands.setPresetName} maxLength={80} placeholder="添加预设时使用的名称" />
      <Text selectable style={{ color: colors.secondaryLabel, fontSize: 13, lineHeight: 19 }}>成功启动表示存活超过 1 秒或正常退出，不代表节点业务功能已经验证。</Text>
      {history.map((run) => <Section key={run.id} title={`${runStates[run.state] ?? run.state} · ${new Date(run.started_at * 1000).toLocaleString()}`}>
        <View style={{ padding: spacing.lg, gap: spacing.md }}>
          <Text selectable style={{ color: colors.secondaryLabel, fontSize: 13, lineHeight: 19 }}>{run.cwd}{'\n'}{run.command}{'\n'}{run.message}</Text>
          <ActionButton label="载入此命令" secondary onPress={() => commands.loadSpec(run)} />
          {run.successful ? <ActionButton label="添加到预设" disabled={!commands.presetName.trim() || !commands.online} onPress={() => void commands.addPreset(run.id).catch(() => undefined)} /> : null}
        </View>
      </Section>)}
      {!history.length ? <EmptyState title="暂无运行记录" detail="从启动页执行程序后再回来查看。" /> : null}
      <ActionButton
        label="清除历史记录"
        destructive
        disabled={!history.some((run) => !['starting', 'running', 'stopping'].includes(run.state)) || commands.busy || !commands.online}
        onPress={() => Alert.alert('清除历史记录？', '已结束任务的记录和终端输出将被删除，正在运行的任务会保留。', [
          { text: '取消', style: 'cancel' },
          { text: '清除', style: 'destructive', onPress: () => void commands.clearHistory().catch(() => undefined) },
        ])}
      />
      <StatusBanner message={commands.message} />
    </Screen>
  );
}
