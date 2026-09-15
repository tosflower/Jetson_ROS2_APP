import { fallbackDefaults, useCommands } from '@/providers/command-provider';
import { ActionButton, EmptyState, Row, Screen, Section, StatusBanner } from '@/ui/primitives';
import { spacing } from '@/ui/tokens';
import { View } from 'react-native';

export default function ConfigurationScreen(): React.JSX.Element {
  const commands = useCommands();
  const defaults = commands.snapshot?.defaults ?? fallbackDefaults;
  return (
    <Screen>
      <Section title="启动配置" footer="技术路径和完整命令只在详情页显示。">
        {defaults.map((option, index) => (
          <Row key={option.id} label={option.name} value={option.configured ? '已配置' : '未配置'} detail={option.file}
            onPress={() => commands.loadSpec(option, option)} last={index === defaults.length - 1} />
        ))}
        {!defaults.length ? <EmptyState title="暂无启动配置" detail="添加配置后，可自定义名称、工作目录与启动命令。" /> : null}
        <View style={{ padding: spacing.lg }}>
          <ActionButton label="添加启动配置" disabled={commands.busy || !commands.online} onPress={() => void commands.createDefault().catch(() => undefined)} />
        </View>
      </Section>
      <Section title="高级配置">
        <Row label="临时运行命令" detail="不保存到启动首页，直接运行 ROS2 或 Python 文件" onPress={() => commands.loadSpec({ cwd: '', command: '', setup: '' })} />
        <Row label="YAML 参数" detail="查找、编辑、保存并编译参数文件" onPress={commands.openBrowseRoot} last />
      </Section>
      <StatusBanner message={commands.busy ? `处理中… ${commands.message}` : commands.message} tone={commands.online ? 'neutral' : 'warning'} />
    </Screen>
  );
}
