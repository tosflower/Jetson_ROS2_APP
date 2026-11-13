import * as LegacyLocation from 'expo-location';
import type { Position } from 'expo-location/next';
import { Platform } from 'react-native';
import { locationProbe } from '@/modules/location-probe';
import type { LocationMode } from './location-mode';
import type { NativeLocationTiming } from './gps-update-metrics';

const INITIAL_POSITION_MAX_AGE_MS = 15000;
let sessionCounter = 0;
export type DeviceLocationObject = LegacyLocation.LocationObject & {
  provider?: string | null;
  nativeTiming?: NativeLocationTiming;
};

export function supportsDirectLocation(): boolean {
  return Platform.OS === 'android' && typeof locationProbe?.watchPositionAsync === 'function';
}

/** 显式选择来源：原生会话和 JS 回调都隔离，快速切换后不接受旧来源的迟到位置。 */
async function watchDirectPosition(
  mode: 'gnss' | 'network',
  onLocation: (location: DeviceLocationObject) => void,
  onError: (message: string) => void,
): Promise<{ remove: () => void }> {
  const native = locationProbe;
  if (!supportsDirectLocation() || !native) {
    throw new Error('指定定位来源需要新版 Android 安装包；当前环境请使用默认自动模式');
  }
  const sessionId = `${Date.now()}-${++sessionCounter}`;
  let disposed = false;
  let latestTimestamp = -Infinity;
  const positionSubscription = native.addListener('onPosition', (position) => {
    if (disposed || position.sessionId !== sessionId) return;
    const { latitude, longitude } = position.coords;
    if (!Number.isFinite(position.timestamp) || position.timestamp <= latestTimestamp
      || !Number.isFinite(latitude) || Math.abs(latitude) > 90
      || !Number.isFinite(longitude) || Math.abs(longitude) > 180) return;
    latestTimestamp = position.timestamp;
    onLocation(position);
  });
  const errorSubscription = native.addListener('onPositionError', (event) => {
    if (!disposed && event.sessionId === sessionId) onError(event.message);
  });
  const remove = (): void => {
    if (disposed) return;
    disposed = true;
    positionSubscription.remove();
    errorSubscription.remove();
    void native.stopPositionWatchAsync(sessionId).catch(() => {});
  };
  try {
    await native.watchPositionAsync(sessionId, mode === 'gnss' ? 'gps' : 'network');
  } catch (error) {
    remove();
    throw error;
  }
  return { remove };
}

function locationObject(position: Position): LegacyLocation.LocationObject {
  return {
    timestamp: position.timestamp,
    mocked: position.mocked,
    coords: {
      latitude: position.coordinates.latitude,
      longitude: position.coordinates.longitude,
      accuracy: position.horizontalAccuracy,
      altitude: position.altitude,
      altitudeAccuracy: position.verticalAccuracy,
      speed: position.speed,
      heading: position.heading,
    },
  };
}

/** Android 使用 SDK 的 GMS → 系统 LocationManager 回退，iOS 保留原定位接口。 */
export async function watchDevicePosition(
  onLocation: (location: DeviceLocationObject) => void,
  onError: (message: string) => void,
  mode: LocationMode = 'auto',
): Promise<{ remove: () => void }> {
  if (mode !== 'auto') return watchDirectPosition(mode, onLocation, onError);
  if (Platform.OS !== 'android') {
    return LegacyLocation.watchPositionAsync({
      accuracy: LegacyLocation.Accuracy.High,
      timeInterval: 250,
      distanceInterval: 0,
    }, onLocation, onError);
  }

  const { Location, LocationProfile } = await import('expo-location/next');
  let disposed = false;
  let latestTimestamp = -Infinity;
  const accept = (position: Position): void => {
    const { latitude, longitude } = position.coordinates;
    if (disposed || !Number.isFinite(position.timestamp) || position.timestamp <= latestTimestamp
      || !Number.isFinite(latitude) || Math.abs(latitude) > 90
      || !Number.isFinite(longitude) || Math.abs(longitude) > 180) return;
    latestTimestamp = position.timestamp;
    onLocation(locationObject(position));
  };
  const watcher = Location.watchPosition({
    profile: LocationProfile.OTHER_NAVIGATION,
    onPosition: accept,
    onError: (error) => { if (!disposed) onError(error.message); },
  });

  // 网络位置可先供地图显示，高精度监听同时运行；保留真实精度和采样时间。
  // getPosition 超时后可能返回很旧的缓存，不能把它当作当前定位。
  void Location.getPosition({ profile: LocationProfile.LOW_POWER, maxCachedAge: 15, timeout: 8 })
    .then((position) => {
      if (!position) return;
      const age = Date.now() - position.timestamp;
      if (age >= -2000 && age <= INITIAL_POSITION_MAX_AGE_MS) accept(position);
    })
    .catch((error: unknown) => {
      if (!disposed && latestTimestamp === -Infinity) {
        onError(error instanceof Error ? error.message : '暂时无法取得初始位置');
      }
    });

  return {
    remove: () => {
      if (disposed) return;
      disposed = true;
      watcher.dispose();
    },
  };
}
