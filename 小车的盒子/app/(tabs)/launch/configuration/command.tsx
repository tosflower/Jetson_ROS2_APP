import { Alert, Text, View } from 'react-native';
import { useCommands } from '@/providers/command-provider';
import { ActionButton, Field, Screen, Section, StatusBanner } from '@/ui/primitives';
import { spacing, useThemeColors } from '@/ui/tokens';

export default function CommandConfigurationScreen(): React.JSX.Element {
  const colors = useThemeColors();
  const commands = useCommands();
  return (
    <Screen>
      <View style={{ gap: 4 }}>
        <Text selectable style={{ color: colors.label, fontSize: 20, fontWeight: '700' }}>{commands.editingDefault ? '编辑启动配置' : '自定义启动文件'}</Text>
        <Text selectable style={{ color: colors.secondaryLabel, fontSize: 14 }}>工作目录和文件均位于 Jetson。</Text>
      </View>
      {commands.editingDefault ? <Section title="配置名称">
        <View style={{ padding: spacing.lg }}>
          <Field value={commands.configurationName} editable={!commands.busy} onChangeText={commands.setConfigurationName} maxLength={80} placeholder="例如：小车系统" />
        </View>
      </Section> : null}
      <Section title="工作目录">
        <View style={{ padding: spacing.lg, gap: spacing.md }}>
          <Field value={commands.cwd} editable={!commands.busy} onChangeText={commands.editCwd} autoCapitalize="none" placeholder="/home/用户名/工作区" />
          <ActionButton label="浏览 Jetson 文件夹" disabled={!commands.online} onPress={() => void commands.openWorkingDirectoryBrowser().catch(() => undefined)} />
          <ActionButton label="检查并确认目录" secondary disabled={!commands.cwd.trim() || !commands.online} onPress={() => void commands.confirmDirectory().catch(() => undefined)} />
          {commands.directory ? <Text selectable style={{ color: colors.secondaryLabel, fontSize: 13, lineHeight: 19 }}>{commands.directory.entries.map((item) => `${item.directory ? '[目录]' : '[文件]'} ${item.name}`).join('\n') || '空目录'}{commands.directory.truncated ? '\n仅显示前 100 项' : ''}</Text> : null}
        </View>
      </Section>
      <Section title="命令">
        <View style={{ padding: spacing.lg, gap: spacing.md }}>
          <Field value={commands.command} editable={!commands.busy} onChangeText={commands.editCommand} autoCapitalize="none" multiline textAlignVertical="top" style={{ minHeight: 88 }} placeholder="ros2 launch 包名 文件.launch.py" />
          <Text selectable style={{ color: colors.secondaryLabel, fontSize: 13, lineHeight: 18 }}>支持 ros2 launch、ros2 run、python3 文件.py 及参数；不接受 cd、source、管道、重定向或 &&。</Text>
          <Field value={commands.setup} editable={!commands.busy} onChangeText={commands.editSetup} autoCapitalize="none" placeholder="环境脚本（可选，如 install/setup.bash）" />
          <ActionButton label="校验命令" secondary disabled={!commands.directory || !commands.command.trim() || !commands.online} onPress={() => void commands.validateCommand().catch(() => undefined)} />
        </View>
      </Section>
      {commands.checked ? <Section title="校验结果"><Text selectable style={{ color: colors.secondaryLabel, fontSize: 13, lineHeight: 20, padding: spacing.lg }}>执行目录：{commands.checked.cwd}{'\n'}文件：{commands.checked.target}{'\n'}命令：{commands.checked.command}</Text></Section> : null}
      <View style={{ gap: spacing.md }}>
        <ActionButton label="启动已校验命令" disabled={!commands.checked || !commands.online} onPress={() => void commands.startChecked().catch(() => undefined)} />
        {commands.editingDefault ? <ActionButton label="保存启动配置" secondary disabled={!commands.checked || !commands.configurationName.trim() || !commands.online} onPress={() => void commands.saveDefault().catch(() => undefined)} /> : null}
        {commands.editingDefault ? <ActionButton label="删除启动配置" destructive disabled={commands.busy || !commands.online} onPress={() => Alert.alert(
          '删除启动配置？',
          `“${commands.configurationName || commands.editingDefault?.name}”将从启动页移除，已经运行的程序不会停止。`,
          [
            { text: '取消', style: 'cancel' },
            { text: '删除', style: 'destructive', onPress: () => void commands.deleteDefault(commands.editingDefault!.id).catch(() => undefined) },
          ],
        )} /> : null}
      </View>
      <StatusBanner message={commands.busy ? `处理中… ${commands.message}` : commands.message} tone={commands.checked ? 'success' : 'neutral'} />
    </Screen>
  );
}
