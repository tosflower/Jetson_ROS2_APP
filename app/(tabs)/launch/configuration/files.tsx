import { Text, View } from 'react-native';
import { useCommands } from '@/providers/command-provider';
import { ActionButton, EmptyState, Field, Row, Screen, Section, StatusBanner } from '@/ui/primitives';
import { spacing, useThemeColors } from '@/ui/tokens';

export default function FileBrowserScreen(): React.JSX.Element {
  const colors = useThemeColors();
  const commands = useCommands();
  const entries = commands.fileDirectory?.entries.filter((entry) => entry.directory || entry.editable) ?? [];
  return (
    <Screen>
      <Text selectable style={{ color: colors.secondaryLabel, fontSize: 14, lineHeight: 20 }}>从 Jetson 的绝对目录开始，仅开放 YAML 文件编辑。</Text>
      <View style={{ gap: spacing.md }}>
        <Field value={commands.browsePath} editable={!commands.busy} onChangeText={commands.setBrowsePath} autoCapitalize="none" placeholder="/home/jetson/wheel_ws/src" />
        <ActionButton label="打开目录" disabled={!commands.browsePath.trim() || !commands.online} onPress={() => void commands.openDirectory().catch(() => undefined)} />
      </View>
      {commands.fileDirectory ? <Section title="文件">
        <Text selectable style={{ color: colors.secondaryLabel, fontSize: 12, padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.separator }}>{commands.fileDirectory.cwd}</Text>
        {commands.fileDirectory.parent !== commands.fileDirectory.cwd ? <Row label="上一级" detail={commands.fileDirectory.parent} onPress={() => void commands.openDirectory(commands.fileDirectory?.parent).catch(() => undefined)} /> : null}
        {entries.map((entry, index) => <Row key={entry.path} label={entry.name} value={entry.directory ? '文件夹' : 'YAML'} onPress={() => void commands.openEntry(entry).catch(() => undefined)} last={index === entries.length - 1} />)}
        {!entries.length ? <EmptyState title="没有 YAML 文件" detail="当前目录没有子目录或可编辑的 YAML 文件。" /> : null}
      </Section> : null}
      <StatusBanner message={commands.message} tone={commands.online ? 'neutral' : 'warning'} />
    </Screen>
  );
}
