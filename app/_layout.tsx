import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect } from 'react';
import { Appearance, StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CommandProvider } from '@/providers/command-provider';
import { GatewayProvider } from '@/providers/gateway-provider';
import { useThemeColors } from '@/ui/tokens';

export default function RootLayout(): React.JSX.Element {
  const colorScheme = useColorScheme();
  const colors = useThemeColors();
  useEffect(() => {
    void SecureStore.getItemAsync('appearance-mode').then((mode) => {
      if (mode === 'dark' || mode === 'light') Appearance.setColorScheme(mode);
    });
  }, []);
  const light = colorScheme === 'light';
  const theme = { ...DarkTheme, dark: !light, colors: { ...DarkTheme.colors, background: colors.background, card: colors.grouped, text: colors.label, primary: colors.primary, border: colors.separator } };
  // iOS 由 React Native StatusBar 管理；避免 Expo Go 的 Info.plist 与原生 Stack 状态栏配置冲突。
  const nativeStatusBar = process.env.EXPO_OS === 'android'
    ? { statusBarStyle: light ? 'dark' as const : 'light' as const }
    : {};
  return (
    <SafeAreaProvider>
      <ThemeProvider value={theme}>
        <GatewayProvider>
          <CommandProvider>
            <StatusBar barStyle={light ? 'dark-content' : 'light-content'} />
            <Stack screenOptions={{ contentStyle: { backgroundColor: colors.background }, animation: 'slide_from_right', ...nativeStatusBar }}>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="connection" options={{ title: '连接 Jetson', headerLargeTitle: true }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="image-viewer" options={{ presentation: 'fullScreenModal', animation: 'fade', gestureEnabled: false, contentStyle: { backgroundColor: '#000000' } }} />
              <Stack.Screen name="+not-found" options={{ title: '页面不存在' }} />
            </Stack>
          </CommandProvider>
        </GatewayProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
