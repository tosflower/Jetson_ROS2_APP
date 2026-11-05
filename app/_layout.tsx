import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useKeepAwake } from 'expo-keep-awake';
import { useEffect } from 'react';
import { Appearance, StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MonitorProvider } from '@/providers/monitor-provider';
import { GatewayProvider, useGateway } from '@/providers/gateway-provider';
import { PhoneSensorsProvider, usePhoneSensors } from '@/providers/phone-sensors-provider';
import { RosbridgeProvider, useRosbridge } from '@/providers/rosbridge-provider';
import { useThemeColors } from '@/ui/tokens';

function TelemetryKeepAwake(): null {
  // Expo Go 使用前台定位；采集期间防止自动锁屏，不宣称支持手动锁屏后台定位。
  useKeepAwake('phone-telemetry', { suppressDeactivateWarnings: true });
  return null;
}

function PhoneTelemetryStartup(): React.JSX.Element | null {
  const { sessionReady } = useGateway();
  const { connect, disconnect } = useRosbridge();
  const { startAll, gpsEnabled } = usePhoneSensors();
  useEffect(() => {
    // 切换网关时先断开旧开发板的 ROS 连接，避免手机数据继续发往旧地址。
    if (!sessionReady) { disconnect(); return; }
    // 网关连接后即开始向 Jetson 发布手机传感器数据，地图页也可离线单独启动。
    connect();
    startAll();
  }, [connect, disconnect, sessionReady, startAll]);
  return sessionReady || gpsEnabled ? <TelemetryKeepAwake /> : null;
}

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
          <RosbridgeProvider>
            <PhoneSensorsProvider>
              <PhoneTelemetryStartup />
              <MonitorProvider>
                <StatusBar barStyle={light ? 'dark-content' : 'light-content'} />
                <Stack screenOptions={{ contentStyle: { backgroundColor: colors.background }, animation: 'slide_from_right', ...nativeStatusBar }}>
                  <Stack.Screen name="index" options={{ headerShown: false }} />
                  <Stack.Screen name="connection" options={{ title: '连接 Jetson', headerLargeTitle: true }} />
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="image-viewer" options={{ presentation: 'fullScreenModal', animation: 'fade', gestureEnabled: false, contentStyle: { backgroundColor: '#000000' } }} />
                  <Stack.Screen name="+not-found" options={{ title: '页面不存在' }} />
                </Stack>
              </MonitorProvider>
            </PhoneSensorsProvider>
          </RosbridgeProvider>
        </GatewayProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
