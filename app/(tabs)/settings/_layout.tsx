import { Stack } from 'expo-router';
export default function SettingsLayout(): React.JSX.Element {
  return <Stack screenOptions={{ animation: 'slide_from_right' }}><Stack.Screen name="index" options={{ title: '设置', headerLargeTitle: true }} /><Stack.Screen name="connection" options={{ title: '网关连接' }} /><Stack.Screen name="amap" options={{ title: '高德地图配置' }} /><Stack.Screen name="about" options={{ title: '关于' }} /></Stack>;
}
