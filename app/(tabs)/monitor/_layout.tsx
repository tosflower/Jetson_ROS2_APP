import { Stack } from 'expo-router';
export default function MonitorLayout(): React.JSX.Element {
  return <Stack screenOptions={{ animation: 'slide_from_right' }}><Stack.Screen name="index" options={{ title: '监控', headerLargeTitle: true }} /><Stack.Screen name="terminals" options={{ title: '多终端' }} /><Stack.Screen name="images" options={{ title: '图像可视化' }} /></Stack>;
}
