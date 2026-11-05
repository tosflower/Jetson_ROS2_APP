import { Stack } from 'expo-router';

export default function TestLayout(): React.JSX.Element {
  return (
    <Stack screenOptions={{ animation: 'slide_from_right' }}>
      <Stack.Screen name="index" options={{ title: '地图', headerLargeTitle: false }} />
    </Stack>
  );
}
