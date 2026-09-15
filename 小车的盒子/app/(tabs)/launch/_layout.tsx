import { Stack } from 'expo-router';
export default function LaunchLayout(): React.JSX.Element {
  return <Stack screenOptions={{ animation: 'slide_from_right' }}><Stack.Screen name="index" options={{ title: '启动', headerLargeTitle: true }} /><Stack.Screen name="configuration/index" options={{ title: '配置' }} /><Stack.Screen name="configuration/command" options={{ title: '路径与命令' }} /><Stack.Screen name="configuration/directory" options={{ title: '选择工作目录' }} /><Stack.Screen name="configuration/files" options={{ title: 'YAML 参数' }} /><Stack.Screen name="configuration/yaml-editor" options={{ title: '编辑 YAML' }} /></Stack>;
}
