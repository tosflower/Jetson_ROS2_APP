import { Alert, Text, View } from 'react-native';
import { useCommands } from '@/providers/command-provider';
import { ActionButton, EmptyState, Screen, Section, StatusBanner } from '@/ui/primitives';
import { spacing, useThemeColors } from '@/ui/tokens';

export default function PresetsScreen(): React.JSX.Element {
  const colors = useThemeColors();
  const commands = useCommands();
  const presets = commands.snapshot?.presets ?? [];
  return (
    <Screen>
      {presets.map((preset) => <Section key={preset.id} title={preset.name}>
        <View style={{ padding: spacing.lg, gap: spacing.md }}>
          <Text selectable style={{ color: colors.secondaryLabel, fontSize: 13, lineHeight: 19 }}>{preset.cwd}{'\n'}{preset.command}</Text>
          <ActionButton label="开始运行" disabled={!commands.online} onPress={() => void commands.start(preset).catch(() => undefined)} />
          <ActionButton label="编辑此命令" secondary onPress={() => commands.loadSpec(preset)} />
          <ActionButton label="删除预设" destructive disabled={!commands.online} onPress={() => Alert.alert('删除预设', `确定删除“${preset.name}”吗？`, [
            { text: '取消', style: 'cancel' },
            { text: '删除', style: 'destructive', onPress: () => void commands.deletePreset(preset.id).catch(() => undefined) },
          ])} />
        </View>
      </Section>)}
      {!presets.length ? <EmptyState title="暂无启动预设" detail="可在最近运行中将成功启动的命令保存为预设。" /> : null}
      <StatusBanner message={commands.message} />
    </Screen>
  );
}
