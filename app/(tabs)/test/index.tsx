import { router, useIsFocused } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Text, useColorScheme, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AmapLocationMap from '@/ui/amap-location-map';
import { usePhoneSensors } from '@/providers/phone-sensors-provider';
import { useRosbridge } from '@/providers/rosbridge-provider';
import { loadAmapCredentials, type AmapCredentials } from '@/services/amap-credentials';
import { NavigationPublisher, type NavigationEvent, type PublishReceipt } from '@/services/navigation/navigation-publisher';
import { ActionButton, StatusBanner } from '@/ui/primitives';
import { AMAP_WEBVIEW_DIAGNOSTICS } from '@/ui/amap-webview-diagnostics';
import { spacing, useThemeColors } from '@/ui/tokens';

export default function MapScreen(): React.JSX.Element {
  const focused = useIsFocused();
  const colors = useThemeColors();
  const [credentials, setCredentials] = useState<AmapCredentials>();
  const [webError, setWebError] = useState('');
  const [webReady, setWebReady] = useState(false);
  const [webAttempt, setWebAttempt] = useState(0);
  const showWebError = useCallback((message: string): void => {
    setWebReady(false);
    setWebError(message);
  }, []);
  const onPageReady = useCallback(async (): Promise<void> => { setWebReady(true); }, []);
  const retryMap = (): void => {
    setWebReady(false);
    setWebError('');
    setWebAttempt((attempt) => attempt + 1);
  };
  const { connect, connectionState, advertiseTopic, unadvertiseTopic, publishTopic } = useRosbridge();
  const navigationPublisher = useMemo(() => new NavigationPublisher({ advertiseTopic, unadvertiseTopic, publishTopic }),
    [advertiseTopic, unadvertiseTopic, publishTopic]);
  useEffect(() => { navigationPublisher.setConnected(connectionState === 'connected'); }, [connectionState, navigationPublisher]);
  useEffect(() => () => navigationPublisher.dispose(), [navigationPublisher]);
  const onNavigationEvent = useCallback(async (event: NavigationEvent): Promise<PublishReceipt> => (
    navigationPublisher.handle(event)
  ), [navigationPublisher]);
  const {
    gpsStatus,
    latestGps,
    latestHeading,
    publishGcj02Location,
    startAll,
  } = usePhoneSensors();
  const dark = useColorScheme() !== 'light';
  useEffect(() => {
    if (!focused) return;
    let active = true;
    void loadAmapCredentials().then((loaded) => {
      if (active) {
        setCredentials(loaded);
        setWebError('');
      }
    }).catch(() => {
      if (active) showWebError('读取高德地图配置失败');
    });
    return () => { active = false; };
  }, [focused, showWebError]);
  useEffect(() => {
    // 进入地图页时连接 rosbridge，连接恢复后会补发当前路线和导航状态。
    connect();
    startAll();
  }, [connect, startAll]);

  const configurationMissing = !!credentials && (!credentials.apiKey || !credentials.securityJsCode);
  useEffect(() => {
    if (!credentials || configurationMissing || webError || webReady) return;
    const timer = setTimeout(() => {
      showWebError('地图页面启动超时（20 秒），网页尚未完成显示。请点击重新加载；若仍失败，请反馈此提示。');
    }, 20000);
    return () => clearTimeout(timer);
  }, [credentials, configurationMissing, webError, webReady, webAttempt, showWebError]);
  return (
    // 在页面内测量原生栏的安全区，使用 Expo Go 已支持的稳定组件承载 WebView。
    <SafeAreaProvider style={{ flex: 1, backgroundColor: colors.background }}>
    <SafeAreaView edges={['top', 'bottom', 'left', 'right']} style={{ flex: 1 }}>
      {!credentials || configurationMissing || webError ? <View style={{ flex: 1, padding: spacing.lg, gap: spacing.md, justifyContent: 'center' }}>
        <Text selectable style={{ color: colors.label, fontSize: 22, fontWeight: '700' }}>地图与导航</Text>
        <StatusBanner message={webError || (configurationMissing
          ? '缺少高德 Web JS API Key 或安全密钥，底图暂时无法加载。'
          : '正在读取高德地图配置…')} tone={webError || configurationMissing ? 'warning' : 'neutral'} />
        {webError && credentials && !configurationMissing ? <ActionButton label="重新加载地图" onPress={retryMap} /> : null}
        <ActionButton label="配置高德地图" onPress={() => router.push('/settings/amap')} />
      </View> : <View style={{ flex: 1 }}>
      <AmapLocationMap
        key={webAttempt}
        apiKey={credentials.apiKey}
        securityJsCode={credentials.securityJsCode}
        latitude={latestGps?.latitude ?? null}
        longitude={latestGps?.longitude ?? null}
        accuracy={latestGps?.accuracy ?? null}
        gpsTimestamp={latestGps?.timestamp ?? null}
        gpsTiming={latestGps?.timing ?? null}
        speedMps={latestGps?.speedMps ?? null}
        rosConnected={connectionState === 'connected'}
        onNavigationEvent={onNavigationEvent}
        onGcj02Location={publishGcj02Location}
        onPageReady={onPageReady}
        headingDegrees={latestHeading?.headingDegrees ?? null}
        headingAccuracy={latestHeading?.accuracy ?? null}
        headingTimestamp={latestHeading?.timestamp ?? null}
        headingSource={latestHeading?.source ?? null}
        locationStatus={gpsStatus}
        dark={dark}
        dom={{
          useExpoDOMWebView: false,
          contentInsetAdjustmentBehavior: 'never',
          automaticallyAdjustContentInsets: false,
          scrollEnabled: false,
          style: { flex: 1 },
          injectedJavaScriptBeforeContentLoaded: AMAP_WEBVIEW_DIAGNOSTICS,
          injectedJavaScript: AMAP_WEBVIEW_DIAGNOSTICS,
          onMessage: (event) => {
            try {
              const message: unknown = JSON.parse(event.nativeEvent.data);
              if (message && typeof message === 'object' && 'type' in message && message.type === 'amap-page-error'
                && 'data' in message && typeof message.data === 'string') {
                showWebError(`地图页面运行错误：${message.data}`);
              }
            } catch { /* 忽略不属于地图诊断的消息。 */ }
          },
          onError: (event) => showWebError(`地图页面加载失败（${event.nativeEvent.code}）：${event.nativeEvent.description}`),
          onHttpError: (event) => showWebError(`地图页面请求失败（${event.nativeEvent.statusCode}）`),
        }}
      />
      {!webReady ? <View pointerEvents="none" style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <Text style={{ color: colors.label }}>正在启动地图页面…</Text>
      </View> : null}
      </View>}
    </SafeAreaView>
    </SafeAreaProvider>
  );
}
