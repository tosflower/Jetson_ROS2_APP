import { useCallback, useEffect, useMemo } from 'react';
import { useColorScheme, View } from 'react-native';
import AmapLocationMap from '@/ui/amap-location-map';
import { usePhoneSensors } from '@/providers/phone-sensors-provider';
import { useRosbridge } from '@/providers/rosbridge-provider';
import { NavigationPublisher, type NavigationEvent, type PublishReceipt } from '@/services/navigation/navigation-publisher';

declare const process: {
  env: {
    EXPO_PUBLIC_AMAP_WEB_KEY?: string;
    EXPO_PUBLIC_AMAP_SECURITY_JS_CODE?: string;
  };
};

export default function MapScreen(): React.JSX.Element {
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
    startAll();
  }, [startAll]);

  return (
    <View style={{ flex: 1 }}>
      <AmapLocationMap
        apiKey={process.env.EXPO_PUBLIC_AMAP_WEB_KEY?.trim() ?? ''}
        securityJsCode={process.env.EXPO_PUBLIC_AMAP_SECURITY_JS_CODE?.trim() ?? ''}
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
        }}
      />
    </View>
  );
}
