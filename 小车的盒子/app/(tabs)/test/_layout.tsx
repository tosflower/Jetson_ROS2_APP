import { Stack } from 'expo-router';

export default function TestLayout(): React.JSX.Element {
  return (
    <Stack screenOptions={{ animation: 'slide_from_right' }}>
      <Stack.Screen name="index" options={{ title: '测试', headerLargeTitle: true }} />
      <Stack.Screen name="output" options={{ title: '传感器终端' }} />
    </Stack>
  );
}
