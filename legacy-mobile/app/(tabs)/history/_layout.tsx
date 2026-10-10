import { Stack } from 'expo-router';
export default function HistoryLayout(): React.JSX.Element {
  return <Stack screenOptions={{ animation: 'slide_from_right' }}><Stack.Screen name="index" options={{ title: '历史', headerLargeTitle: true }} /><Stack.Screen name="runs" options={{ title: '最近运行' }} /><Stack.Screen name="presets" options={{ title: '启动预设' }} /></Stack>;
}
