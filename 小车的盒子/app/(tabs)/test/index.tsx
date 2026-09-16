import { useEffect } from 'react';
import { useColorScheme, View } from 'react-native';
import AmapLocationMap from '@/ui/amap-location-map';
import { usePhoneSensors } from '@/providers/phone-sensors-provider';
import { useRosbridge } from '@/providers/rosbridge-provider';

declare const process: {
  env: {
    EXPO_PUBLIC_AMAP_WEB_KEY?: string;
    EXPO_PUBLIC_AMAP_SECURITY_JS_CODE?: string;
  };
};

export default function MapScreen(): React.JSX.Element {
  const { connect } = useRosbridge();
  const {
    gpsStatus,
    latestGps,
    latestHeading,
    startAll,
  } = usePhoneSensors();
  const dark = useColorScheme() !== 'light';
  useEffect(() => {
    // 地图页首次进入即启动全部传感器；方法均幂等，不会产生重复监听器。
    startAll();
    connect();
  }, [connect, startAll]);

  return (
    <View style={{ flex: 1 }}>
      <AmapLocationMap
        apiKey={process.env.EXPO_PUBLIC_AMAP_WEB_KEY?.trim() ?? ''}
        securityJsCode={process.env.EXPO_PUBLIC_AMAP_SECURITY_JS_CODE?.trim() ?? ''}
        latitude={latestGps?.latitude ?? null}
        longitude={latestGps?.longitude ?? null}
        accuracy={latestGps?.accuracy ?? null}
        headingDegrees={latestHeading?.headingDegrees ?? null}
        headingAccuracy={latestHeading?.accuracy ?? null}
        locationStatus={gpsStatus}
        dark={dark}
        dom={{
          contentInsetAdjustmentBehavior: 'never',
          scrollEnabled: false,
          style: { flex: 1 },
        }}
      />
    </View>
  );
}
