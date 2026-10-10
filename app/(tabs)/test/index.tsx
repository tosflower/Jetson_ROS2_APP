import { router, useIsFocused } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Text, useColorScheme, View } from 'react-native';
import AmapLocationMap from '@/ui/amap-location-map';
import { usePhoneSensors } from '@/providers/phone-sensors-provider';
import { useRosbridge } from '@/providers/rosbridge-provider';
import { loadAmapCredentials, type AmapCredentials } from '@/services/amap-credentials';
import { NavigationPublisher, type NavigationEvent, type PublishReceipt } from '@/services/navigation/navigation-publisher';
import { ActionButton, StatusBanner } from '@/ui/primitives';
import { spacing, useThemeColors } from '@/ui/tokens';

export default function MapScreen(): React.JSX.Element {
  const focused = useIsFocused();
  const colors = useThemeColors();
  const [credentials, setCredentials] = useState<AmapCredentials>();
  const [webError, setWebError] = useState('');
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
      if (active) setWebError('读取高德地图配置失败');
    });
    return () => { active = false; };
  }, [focused]);
  useEffect(() => {
    // 进入地图页时连接 rosbridge，连接恢复后会补发当前路线和导航状态。
    connect();
    startAll();
  }, [connect, startAll]);

  const configurationMissing = !!credentials && (!credentials.apiKey || !credentials.securityJsCode);
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {!credentials || configurationMissing || webError ? <View style={{ flex: 1, padding: spacing.lg, gap: spacing.md, justifyContent: 'center' }}>
        <Text selectable style={{ color: colors.label, fontSize: 22, fontWeight: '700' }}>地图与导航</Text>
        <StatusBanner message={webError || (configurationMissing
          ? '缺少高德 Web JS API Key 或安全密钥，底图暂时无法加载。'
          : '正在读取高德地图配置…')} tone={webError || configurationMissing ? 'warning' : 'neutral'} />
        <ActionButton label="配置高德地图" onPress={() => router.push('/settings/amap')} />
      </View> : <View style={{ flex: 1 }}>
      <AmapLocationMap
        apiKey={credentials.apiKey}
        securityJsCode={credentials.securityJsCode}
        latitude={latestGps?.latitude ?? null}
        longitude={latestGps?.longitude ?? null}
        accuracy={latestGps?.accuracy ?? null}
        gpsTimestamp={latestGps?.timestamp ?? null}
        speedMps={latestGps?.speedMps ?? null}
        rosConnected={connectionState === 'connected'}
        onNavigationEvent={onNavigationEvent}
        headingDegrees={latestHeading?.headingDegrees ?? null}
        headingAccuracy={latestHeading?.accuracy ?? null}
        headingTimestamp={latestHeading?.timestamp ?? null}
        headingSource={latestHeading?.source ?? null}
        locationStatus={gpsStatus}
        dark={dark}
        dom={{
          useExpoDOMWebView: false,
          contentInsetAdjustmentBehavior: 'never',
          scrollEnabled: false,
          style: { flex: 1 },
          onError: () => setWebError('地图页面加载失败，请检查网络或重新打开地图'),
          onHttpError: (event) => setWebError(`地图页面请求失败（${event.nativeEvent.statusCode}）`),
        }}
      />
      </View>}
      <View style={{ paddingHorizontal: spacing.md, paddingVertical: spacing.sm, backgroundColor: colors.grouped }}>
        <Text selectable style={{ color: colors.secondaryLabel, fontSize: 12 }}>{gpsStatus} · {connectionState === 'connected' ? 'Jetson ROS 已连接' : 'Jetson ROS 未连接'}</Text>
      </View>
    </View>
  );
}
