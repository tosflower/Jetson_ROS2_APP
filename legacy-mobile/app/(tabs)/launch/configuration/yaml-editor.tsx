import { useEffect } from 'react';
import { useNavigation } from 'expo-router';
import { Alert, Text, useWindowDimensions, View } from 'react-native';
import { useCommands } from '@/providers/command-provider';
import { ActionButton, EmptyState, Field, Screen, Section, StatusBanner } from '@/ui/primitives';
import { spacing, useThemeColors } from '@/ui/tokens';

export default function YamlEditorScreen(): React.JSX.Element {
  const colors = useThemeColors();
  const commands = useCommands();
  const navigation = useNavigation();
  const { height } = useWindowDimensions();
  useEffect(() => navigation.addListener('beforeRemove', (event) => {
    if (!commands.yamlDirty) return;
    event.preventDefault();
    Alert.alert('参数尚未保存', '离开前是否保存 YAML 修改？', [
      { text: '取消', style: 'cancel' },
      { text: '不保存', style: 'destructive', onPress: () => {
        commands.discardYaml();
        navigation.dispatch(event.data.action);
      } },
      { text: '保存', onPress: () => void commands.saveCurrentYaml().then(() => {
        commands.discardYaml();
        navigation.dispatch(event.data.action);
      }).catch(() => undefined) },
    ]);
  }), [commands, navigation]);
  if (!commands.yamlFile) return <Screen><EmptyState title="尚未打开参数文件" detail="请返回文件列表选择 YAML 文件。" /></Screen>;
  return (
    <Screen>
      <Section title="文件信息">
        <Text selectable style={{ color: colors.label, fontSize: 14, lineHeight: 21, padding: spacing.lg }}>{commands.yamlFile.path}{'\n'}<Text style={{ color: colors.secondaryLabel }}>ROS 包：{commands.yamlFile.package || '未识别'} · 工作区：{commands.yamlFile.workspace || '未识别'}</Text></Text>
      </Section>
      <Field
        value={commands.yamlDraft}
        editable={!commands.busy}
        onChangeText={commands.setYamlDraft}
        autoCapitalize="none"
        multiline
        scrollEnabled
        textAlignVertical="top"
        style={{ height: Math.max(320, height * 0.55), fontFamily: 'monospace', fontSize: 13 }}
      />
      <StatusBanner message={commands.yamlDirty ? '有未保存修改' : '已与磁盘内容同步'} tone={commands.yamlDirty ? 'warning' : 'success'} />
      <View style={{ gap: spacing.md }}>
        <ActionButton label="仅保存 YAML" disabled={!commands.yamlDirty || !commands.online} onPress={() => void commands.saveCurrentYaml().catch(() => undefined)} />
        <Field value={commands.buildSetup} editable={!commands.busy} onChangeText={commands.setBuildSetup} autoCapitalize="none" placeholder="构建环境脚本（可选）" />
        <ActionButton label="保存并编译所属 ROS 包" secondary disabled={!commands.yamlFile.package || !commands.yamlFile.workspace || !commands.online} onPress={() => void commands.buildCurrentYaml().catch(() => undefined)} />
        <ActionButton label="关闭编辑器" secondary onPress={commands.closeYaml} />
      </View>
    </Screen>
  );
}
