import { Text } from 'react-native';
import { useCommands } from '@/providers/command-provider';
import { ActionButton, EmptyState, Row, Screen, Section, StatusBanner } from '@/ui/primitives';
import { spacing, useThemeColors } from '@/ui/tokens';

/** 浏览 Jetson 文件系统并选择当前文件夹作为命令工作目录。 */
export default function WorkingDirectoryScreen(): React.JSX.Element {
  const colors = useThemeColors();
  const commands = useCommands();
  const directory = commands.fileDirectory;
  const folders = directory?.entries.filter((entry) => entry.directory) ?? [];
  return (
    <Screen>
      <Text selectable style={{ color: colors.secondaryLabel, fontSize: 14, lineHeight: 20 }}>
        轻点文件夹继续查找，确认后会自动填入完整工作目录。
      </Text>
      {directory ? <Section title="工作目录">
        <Text selectable style={{ color: colors.secondaryLabel, fontSize: 12, padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.separator }}>
          {directory.cwd}
        </Text>
        {directory.parent !== directory.cwd
          ? <Row label="上一级" detail={directory.parent} onPress={() => void commands.openDirectory(directory.parent).catch(() => undefined)} />
          : null}
        {folders.map((entry, index) => (
          <Row key={entry.path} label={entry.name} value="文件夹" onPress={() => void commands.openDirectory(entry.path).catch(() => undefined)} last={index === folders.length - 1} />
        ))}
        {!folders.length ? <EmptyState title="没有子文件夹" detail="可以选择当前文件夹，或返回上一级继续查找。" /> : null}
      </Section> : null}
      <ActionButton label="使用当前文件夹" disabled={!directory || commands.busy} onPress={commands.chooseWorkingDirectory} />
      <StatusBanner message={commands.message} tone={commands.online ? 'neutral' : 'warning'} />
    </Screen>
  );
}
