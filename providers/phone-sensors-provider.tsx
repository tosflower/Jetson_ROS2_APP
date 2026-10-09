import * as Location from 'expo-location';
import {
  Accelerometer,
  Gyroscope,
  Magnetometer,
  type AccelerometerMeasurement,
  type GyroscopeMeasurement,
  type MagnetometerMeasurement,
} from 'expo-sensors';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { useRosbridge } from './rosbridge-provider';
import {
  PHONE_GPS_TOPIC,
  PHONE_GPS_TYPE,
  PHONE_HEADING_TOPIC,
  PHONE_HEADING_TYPE,
  PHONE_IMU_TOPIC,
  PHONE_IMU_TYPE,
  PHONE_MAGNETIC_FIELD_TOPIC,
  PHONE_MAGNETIC_FIELD_TYPE,
} from '@/services/rosbridge/protocol';
import {
  buildHeadingMessage,
  buildImuMessage,
  buildMagneticFieldMessage,
  buildNavSatFixMessage,
} from '@/services/phone-sensors/messages';

type StreamState = 'idle' | 'starting' | 'active' | 'paused' | 'error';

export type PhoneGpsSnapshot = {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  speedMps: number | null;
  timestamp: number;
};

export type PhoneHeadingSnapshot = {
  headingDegrees: number;
  accuracy: number;
  source: 'true' | 'magnetic';
  timestamp: number;
};

type PhoneSensorsContextValue = {
  gpsEnabled: boolean;
  headingEnabled: boolean;
  imuEnabled: boolean;
  gpsState: StreamState;
  headingState: StreamState;
  imuState: StreamState;
  gpsStatus: string;
  headingStatus: string;
  imuStatus: string;
  latestGps: PhoneGpsSnapshot | null;
  latestHeading: PhoneHeadingSnapshot | null;
  startGps: () => void;
  stopGps: () => void;
  startHeading: () => void;
  stopHeading: () => void;
  startImu: () => void;
  stopImu: () => void;
  startAll: () => void;
  stopAll: () => void;
};

type RemovableSubscription = { remove: () => void };
type TimedSample<T> = { value: T; receivedAt: number };
type TimedHeadingSample = {
  headingDegrees: number;
  accuracy: number;
  source: 'true' | 'magnetic';
  receivedAt: number;
};

const GPS_PUBLISH_INTERVAL_MS = 500;
const HEADING_PUBLISH_INTERVAL_MS = 200;
const IMU_SAMPLE_INTERVAL_MS = 20;
const IMU_PUBLISH_INTERVAL_MS = 40;
const MAGNETIC_SAMPLE_INTERVAL_MS = 50;
const MAGNETIC_PUBLISH_INTERVAL_MS = 100;

const PhoneSensorsContext = React.createContext<PhoneSensorsContextValue | null>(null);

export function PhoneSensorsProvider({ children }: React.PropsWithChildren): React.JSX.Element {
  const {
    connectionState,
    advertiseTopic,
    unadvertiseTopic,
    publishTopic,
  } = useRosbridge();
  const [gpsEnabled, setGpsEnabled] = useState(false);
  const [headingEnabled, setHeadingEnabled] = useState(false);
  const [imuEnabled, setImuEnabled] = useState(false);
  const [gpsState, setGpsState] = useState<StreamState>('idle');
  const [headingState, setHeadingState] = useState<StreamState>('idle');
  const [imuState, setImuState] = useState<StreamState>('idle');
  const [gpsStatus, setGpsStatus] = useState('GPS 尚未启动');
  const [headingStatus, setHeadingStatus] = useState('航向尚未启动');
  const [imuStatus, setImuStatus] = useState('IMU 与磁力计尚未启动');
  const [latestGps, setLatestGps] = useState<PhoneGpsSnapshot | null>(null);
  const [latestHeading, setLatestHeading] = useState<PhoneHeadingSnapshot | null>(null);

  const connectionStateRef = useRef(connectionState);
  const foregroundRef = useRef(AppState.currentState === 'active');
  const gpsDesiredRef = useRef(false);
  const headingDesiredRef = useRef(false);
  const imuDesiredRef = useRef(false);
  const gpsGenerationRef = useRef(0);
  const headingGenerationRef = useRef(0);
  const imuGenerationRef = useRef(0);
  const gpsStartingRef = useRef(false);
  const headingStartingRef = useRef(false);
  const imuStartingRef = useRef(false);
  const locationPermissionPromiseRef = useRef<Promise<void> | null>(null);
  const gpsSubscriptionRef = useRef<Location.LocationSubscription | null>(null);
  const headingSubscriptionRef = useRef<Location.LocationSubscription | null>(null);
  const accelerometerSubscriptionRef = useRef<RemovableSubscription | null>(null);
  const gyroscopeSubscriptionRef = useRef<RemovableSubscription | null>(null);
  const magnetometerSubscriptionRef = useRef<RemovableSubscription | null>(null);
  const gpsTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const headingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const imuTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const magneticTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const latestLocationRef = useRef<Location.LocationObject | null>(null);
  const lastGpsDisplayedAtRef = useRef(0);
  const latestHeadingRef = useRef<TimedHeadingSample | null>(null);
  const lastHeadingDisplayedAtRef = useRef(0);
  const latestAccelerationRef = useRef<TimedSample<AccelerometerMeasurement> | null>(null);
  const latestGyroscopeRef = useRef<TimedSample<GyroscopeMeasurement> | null>(null);
  const latestMagneticRef = useRef<TimedSample<MagnetometerMeasurement> | null>(null);

  connectionStateRef.current = connectionState;

  const pauseGpsRuntime = useCallback((status?: string): void => {
    gpsGenerationRef.current += 1;
    gpsStartingRef.current = false;
    gpsSubscriptionRef.current?.remove();
    gpsSubscriptionRef.current = null;
    if (gpsTimerRef.current) clearInterval(gpsTimerRef.current);
    gpsTimerRef.current = null;
    latestLocationRef.current = null;
    lastGpsDisplayedAtRef.current = 0;
    if (gpsDesiredRef.current) {
      setGpsState('paused');
      setGpsStatus(status ?? '等待 App 回到前台并恢复 rosbridge 连接');
    }
  }, []);

  const pauseHeadingRuntime = useCallback((status?: string): void => {
    headingGenerationRef.current += 1;
    headingStartingRef.current = false;
    headingSubscriptionRef.current?.remove();
    headingSubscriptionRef.current = null;
    if (headingTimerRef.current) clearInterval(headingTimerRef.current);
    headingTimerRef.current = null;
    latestHeadingRef.current = null;
    lastHeadingDisplayedAtRef.current = 0;
    if (headingDesiredRef.current) {
      setHeadingState('paused');
      setHeadingStatus(status ?? '等待 App 回到前台并恢复 rosbridge 连接');
    }
  }, []);

  const pauseImuRuntime = useCallback((status?: string): void => {
    imuGenerationRef.current += 1;
    imuStartingRef.current = false;
    accelerometerSubscriptionRef.current?.remove();
    gyroscopeSubscriptionRef.current?.remove();
    magnetometerSubscriptionRef.current?.remove();
    accelerometerSubscriptionRef.current = null;
    gyroscopeSubscriptionRef.current = null;
    magnetometerSubscriptionRef.current = null;
    if (imuTimerRef.current) clearInterval(imuTimerRef.current);
    if (magneticTimerRef.current) clearInterval(magneticTimerRef.current);
    imuTimerRef.current = null;
    magneticTimerRef.current = null;
    latestAccelerationRef.current = null;
    latestGyroscopeRef.current = null;
    latestMagneticRef.current = null;
    if (imuDesiredRef.current) {
      setImuState('paused');
      setImuStatus(status ?? '等待 App 回到前台并恢复 rosbridge 连接');
    }
  }, []);

  const ensureForegroundLocationPermission = useCallback(async (): Promise<void> => {
    if (locationPermissionPromiseRef.current) return locationPermissionPromiseRef.current;
    const permissionPromise = (async (): Promise<void> => {
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) throw new Error('手机定位服务未开启');
      const currentPermission = await Location.getForegroundPermissionsAsync();
      if (currentPermission.granted) return;
      const requestedPermission = await Location.requestForegroundPermissionsAsync();
      if (!requestedPermission.granted) throw new Error('前台定位权限被拒绝');
    })();
    locationPermissionPromiseRef.current = permissionPromise;
    try {
      await permissionPromise;
    } finally {
      if (locationPermissionPromiseRef.current === permissionPromise) {
        locationPermissionPromiseRef.current = null;
      }
    }
  }, []);

  const activateGps = useCallback(async (): Promise<void> => {
    if (
      gpsStartingRef.current
      || gpsSubscriptionRef.current
      || !gpsDesiredRef.current
      || !foregroundRef.current
    ) return;

    gpsStartingRef.current = true;
    const generation = ++gpsGenerationRef.current;
    setGpsState('starting');
    setGpsStatus('正在请求定位权限并启动 GPS');
    try {
      await ensureForegroundLocationPermission();
      if (
        generation !== gpsGenerationRef.current
        || !gpsDesiredRef.current
        || !foregroundRef.current
      ) return;

      const subscription = await Location.watchPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 250,
        distanceInterval: 0,
      }, (location) => {
        // 采样回调只更新最新值，发布由独立 2 Hz 定时器负责。
        latestLocationRef.current = location;
      });
      if (
        generation !== gpsGenerationRef.current
        || !gpsDesiredRef.current
        || !foregroundRef.current
      ) {
        subscription.remove();
        return;
      }
      gpsSubscriptionRef.current = subscription;
      gpsTimerRef.current = setInterval(() => {
        const location = latestLocationRef.current;
        if (!location) return;
        if (location.timestamp !== lastGpsDisplayedAtRef.current) {
          lastGpsDisplayedAtRef.current = location.timestamp;
          setLatestGps({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy,
            speedMps: typeof location.coords.speed === 'number' && Number.isFinite(location.coords.speed) && location.coords.speed >= 0
              ? location.coords.speed : null,
            timestamp: location.timestamp,
          });
        }
        if (connectionStateRef.current !== 'connected') {
          setGpsStatus('GPS 正在采集；等待 rosbridge 连接后发布');
          return;
        }
        const message = buildNavSatFixMessage(location);
        if (!message) {
          setGpsStatus('已获得定位，但海拔不可用；为避免伪造 0 m 暂停发布');
          return;
        }
        try {
          publishTopic(PHONE_GPS_TOPIC, message);
          setGpsStatus(`正在以最高 ${1000 / GPS_PUBLISH_INTERVAL_MS} Hz 发布 ${PHONE_GPS_TOPIC}`);
        } catch {
          // 断线时继续采集供地图显示，rosbridge 重连后再恢复发布。
        }
      }, GPS_PUBLISH_INTERVAL_MS);
      setGpsState('active');
      setGpsStatus(connectionStateRef.current === 'connected'
        ? `正在以最高 ${1000 / GPS_PUBLISH_INTERVAL_MS} Hz 发布 ${PHONE_GPS_TOPIC}`
        : 'GPS 正在采集；等待 rosbridge 连接后发布');
    } catch (error) {
      if (generation !== gpsGenerationRef.current) return;
      gpsDesiredRef.current = false;
      setGpsEnabled(false);
      unadvertiseTopic(PHONE_GPS_TOPIC);
      setGpsState('error');
      setGpsStatus(error instanceof Error ? error.message : 'GPS 启动失败');
    } finally {
      if (generation === gpsGenerationRef.current) gpsStartingRef.current = false;
    }
  }, [ensureForegroundLocationPermission, publishTopic, unadvertiseTopic]);

  const activateHeading = useCallback(async (): Promise<void> => {
    if (
      headingStartingRef.current
      || headingSubscriptionRef.current
      || !headingDesiredRef.current
      || !foregroundRef.current
    ) return;

    headingStartingRef.current = true;
    const generation = ++headingGenerationRef.current;
    setHeadingState('starting');
    setHeadingStatus('正在请求定位权限并启动手机指南针');
    try {
      await ensureForegroundLocationPermission();
      if (
        generation !== headingGenerationRef.current
        || !headingDesiredRef.current
        || !foregroundRef.current
      ) return;

      const subscription = await Location.watchHeadingAsync((sample) => {
        const hasTrueHeading = Number.isFinite(sample.trueHeading) && sample.trueHeading >= 0;
        const rawHeading = hasTrueHeading ? sample.trueHeading : sample.magHeading;
        const message = buildHeadingMessage(rawHeading);
        if (!message) return;
        latestHeadingRef.current = {
          headingDegrees: message.data,
          accuracy: sample.accuracy,
          source: hasTrueHeading ? 'true' : 'magnetic',
          receivedAt: Date.now(),
        };
      }, (message) => {
        if (generation === headingGenerationRef.current) {
          setHeadingStatus(`指南针读取失败：${message}`);
        }
      });
      if (
        generation !== headingGenerationRef.current
        || !headingDesiredRef.current
        || !foregroundRef.current
      ) {
        subscription.remove();
        return;
      }
      headingSubscriptionRef.current = subscription;
      headingTimerRef.current = setInterval(() => {
        const sample = latestHeadingRef.current;
        if (
          !sample
          || sample.receivedAt === lastHeadingDisplayedAtRef.current
        ) return;
        lastHeadingDisplayedAtRef.current = sample.receivedAt;
        setLatestHeading({
          headingDegrees: sample.headingDegrees,
          accuracy: sample.accuracy,
          source: sample.source,
          timestamp: sample.receivedAt,
        });
        if (connectionStateRef.current !== 'connected') {
          setHeadingStatus('航向正在采集；等待 rosbridge 连接后发布');
          return;
        }
        try {
          publishTopic(PHONE_HEADING_TOPIC, { data: sample.headingDegrees });
          setHeadingStatus(sample.accuracy > 0
            ? `正在以最高 ${1000 / HEADING_PUBLISH_INTERVAL_MS} Hz 发布 ${PHONE_HEADING_TOPIC}`
            : '指南针精度未知，数据仅供测试；请远离磁场干扰并校准手机指南针');
        } catch {
          // 断线时继续采集供地图显示，rosbridge 重连后再恢复发布。
        }
      }, HEADING_PUBLISH_INTERVAL_MS);
      setHeadingState('active');
      setHeadingStatus(connectionStateRef.current === 'connected'
        ? `正在等待指南针更新，发布上限 ${1000 / HEADING_PUBLISH_INTERVAL_MS} Hz`
        : '正在等待指南针更新；rosbridge 连接后自动发布');
    } catch (error) {
      if (generation !== headingGenerationRef.current) return;
      headingDesiredRef.current = false;
      setHeadingEnabled(false);
      unadvertiseTopic(PHONE_HEADING_TOPIC);
      setHeadingState('error');
      setHeadingStatus(error instanceof Error ? error.message : '航向启动失败');
    } finally {
      if (generation === headingGenerationRef.current) headingStartingRef.current = false;
    }
  }, [ensureForegroundLocationPermission, publishTopic, unadvertiseTopic]);

  const activateImu = useCallback(async (): Promise<void> => {
    if (
      imuStartingRef.current
      || accelerometerSubscriptionRef.current
      || !imuDesiredRef.current
      || !foregroundRef.current
    ) return;

    imuStartingRef.current = true;
    const generation = ++imuGenerationRef.current;
    setImuState('starting');
    setImuStatus('正在检查加速度计、陀螺仪和磁力计');
    try {
      const [accelerometerPermission, gyroscopePermission, magneticPermission] = await Promise.all([
        Accelerometer.requestPermissionsAsync(),
        Gyroscope.requestPermissionsAsync(),
        Magnetometer.requestPermissionsAsync(),
      ]);
      if (!accelerometerPermission.granted || !gyroscopePermission.granted) {
        throw new Error('运动传感器权限被拒绝');
      }
      const [accelerometerAvailable, gyroscopeAvailable, magneticAvailable] = await Promise.all([
        Accelerometer.isAvailableAsync(),
        Gyroscope.isAvailableAsync(),
        Magnetometer.isAvailableAsync(),
      ]);
      if (!accelerometerAvailable || !gyroscopeAvailable) {
        throw new Error('设备缺少加速度计或陀螺仪');
      }
      if (
        generation !== imuGenerationRef.current
        || !imuDesiredRef.current
        || !foregroundRef.current
      ) return;

      Accelerometer.setUpdateInterval(IMU_SAMPLE_INTERVAL_MS);
      Gyroscope.setUpdateInterval(IMU_SAMPLE_INTERVAL_MS);
      accelerometerSubscriptionRef.current = Accelerometer.addListener((sample) => {
        latestAccelerationRef.current = { value: sample, receivedAt: Date.now() };
      });
      gyroscopeSubscriptionRef.current = Gyroscope.addListener((sample) => {
        latestGyroscopeRef.current = { value: sample, receivedAt: Date.now() };
      });
      imuTimerRef.current = setInterval(() => {
        const acceleration = latestAccelerationRef.current;
        const angularVelocity = latestGyroscopeRef.current;
        if (!acceleration || !angularVelocity || connectionStateRef.current !== 'connected') return;
        try {
          const sampleTimestamp = Math.max(acceleration.receivedAt, angularVelocity.receivedAt);
          const message = buildImuMessage(
            acceleration.value,
            angularVelocity.value,
            sampleTimestamp,
          );
          publishTopic(PHONE_IMU_TOPIC, message);
        } catch {
          // 连接变化由统一生命周期处理。
        }
      }, IMU_PUBLISH_INTERVAL_MS);

      if (magneticPermission.granted && magneticAvailable) {
        // 磁力计曾不可用时会 unadvertise；恢复时再次加入同一客户端的广告集。
        advertiseTopic(PHONE_MAGNETIC_FIELD_TOPIC, PHONE_MAGNETIC_FIELD_TYPE);
        Magnetometer.setUpdateInterval(MAGNETIC_SAMPLE_INTERVAL_MS);
        magnetometerSubscriptionRef.current = Magnetometer.addListener((sample) => {
          latestMagneticRef.current = { value: sample, receivedAt: Date.now() };
        });
        magneticTimerRef.current = setInterval(() => {
          const magnetic = latestMagneticRef.current;
          if (!magnetic || connectionStateRef.current !== 'connected') return;
          try {
            const message = buildMagneticFieldMessage(magnetic.value, magnetic.receivedAt);
            publishTopic(PHONE_MAGNETIC_FIELD_TOPIC, message);
          } catch {
            // 连接变化由统一生命周期处理。
          }
        }, MAGNETIC_PUBLISH_INTERVAL_MS);
      } else {
        unadvertiseTopic(PHONE_MAGNETIC_FIELD_TOPIC);
      }

      setImuState('active');
      setImuStatus(magneticPermission.granted && magneticAvailable
        ? `IMU ${1000 / IMU_PUBLISH_INTERVAL_MS} Hz，磁力计 ${1000 / MAGNETIC_PUBLISH_INTERVAL_MS} Hz`
        : `IMU ${1000 / IMU_PUBLISH_INTERVAL_MS} Hz；本机磁力计不可用`);
    } catch (error) {
      if (generation !== imuGenerationRef.current) return;
      pauseImuRuntime();
      imuDesiredRef.current = false;
      setImuEnabled(false);
      unadvertiseTopic(PHONE_IMU_TOPIC);
      unadvertiseTopic(PHONE_MAGNETIC_FIELD_TOPIC);
      setImuState('error');
      setImuStatus(error instanceof Error ? error.message : 'IMU 启动失败');
    } finally {
      if (generation === imuGenerationRef.current) imuStartingRef.current = false;
    }
  }, [advertiseTopic, pauseImuRuntime, publishTopic, unadvertiseTopic]);

  const startGps = useCallback((): void => {
    if (gpsDesiredRef.current) return;
    gpsDesiredRef.current = true;
    setGpsEnabled(true);
    advertiseTopic(PHONE_GPS_TOPIC, PHONE_GPS_TYPE);
    void activateGps();
  }, [activateGps, advertiseTopic]);

  const stopGps = useCallback((): void => {
    gpsDesiredRef.current = false;
    setGpsEnabled(false);
    pauseGpsRuntime();
    unadvertiseTopic(PHONE_GPS_TOPIC);
    setGpsState('idle');
    setGpsStatus('GPS 已停止');
  }, [pauseGpsRuntime, unadvertiseTopic]);

  const startHeading = useCallback((): void => {
    if (headingDesiredRef.current) return;
    headingDesiredRef.current = true;
    setHeadingEnabled(true);
    advertiseTopic(PHONE_HEADING_TOPIC, PHONE_HEADING_TYPE);
    void activateHeading();
  }, [activateHeading, advertiseTopic]);

  const stopHeading = useCallback((): void => {
    headingDesiredRef.current = false;
    setHeadingEnabled(false);
    pauseHeadingRuntime();
    unadvertiseTopic(PHONE_HEADING_TOPIC);
    setHeadingState('idle');
    setHeadingStatus('航向已停止');
  }, [pauseHeadingRuntime, unadvertiseTopic]);

  const startImu = useCallback((): void => {
    if (imuDesiredRef.current) return;
    imuDesiredRef.current = true;
    setImuEnabled(true);
    advertiseTopic(PHONE_IMU_TOPIC, PHONE_IMU_TYPE);
    advertiseTopic(PHONE_MAGNETIC_FIELD_TOPIC, PHONE_MAGNETIC_FIELD_TYPE);
    void activateImu();
  }, [activateImu, advertiseTopic]);

  const stopImu = useCallback((): void => {
    imuDesiredRef.current = false;
    setImuEnabled(false);
    pauseImuRuntime();
    unadvertiseTopic(PHONE_IMU_TOPIC);
    unadvertiseTopic(PHONE_MAGNETIC_FIELD_TOPIC);
    setImuState('idle');
    setImuStatus('IMU 与磁力计已停止');
  }, [pauseImuRuntime, unadvertiseTopic]);

  const startAll = useCallback((): void => {
    startGps();
    startHeading();
    startImu();
  }, [startGps, startHeading, startImu]);

  const stopAll = useCallback((): void => {
    stopGps();
    stopHeading();
    stopImu();
  }, [stopGps, stopHeading, stopImu]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      foregroundRef.current = state === 'active';
      if (!foregroundRef.current) {
        pauseGpsRuntime('App 已进入后台，GPS 发布已暂停');
        pauseHeadingRuntime('App 已进入后台，航向发布已暂停');
        pauseImuRuntime('App 已进入后台，IMU 发布已暂停');
        return;
      }
      void activateGps();
      void activateHeading();
      void activateImu();
    });
    return () => subscription.remove();
  }, [activateGps, activateHeading, activateImu, pauseGpsRuntime, pauseHeadingRuntime, pauseImuRuntime]);

  useEffect(() => {
    if (foregroundRef.current) {
      void activateGps();
      void activateHeading();
      void activateImu();
    }
    if (connectionState === 'connected') {
      // 重连后让当前航向在下一次节流周期立即发布，而不创建新的传感器监听器。
      lastHeadingDisplayedAtRef.current = 0;
    }
  }, [activateGps, activateHeading, activateImu, connectionState]);

  useEffect(() => () => {
    gpsDesiredRef.current = false;
    headingDesiredRef.current = false;
    imuDesiredRef.current = false;
    pauseGpsRuntime();
    pauseHeadingRuntime();
    pauseImuRuntime();
    unadvertiseTopic(PHONE_GPS_TOPIC);
    unadvertiseTopic(PHONE_HEADING_TOPIC);
    unadvertiseTopic(PHONE_IMU_TOPIC);
    unadvertiseTopic(PHONE_MAGNETIC_FIELD_TOPIC);
  }, [pauseGpsRuntime, pauseHeadingRuntime, pauseImuRuntime, unadvertiseTopic]);

  const value: PhoneSensorsContextValue = {
    gpsEnabled,
    headingEnabled,
    imuEnabled,
    gpsState,
    headingState,
    imuState,
    gpsStatus,
    headingStatus,
    imuStatus,
    latestGps,
    latestHeading,
    startGps,
    stopGps,
    startHeading,
    stopHeading,
    startImu,
    stopImu,
    startAll,
    stopAll,
  };
  return <PhoneSensorsContext value={value}>{children}</PhoneSensorsContext>;
}

export function usePhoneSensors(): PhoneSensorsContextValue {
  const value = React.use(PhoneSensorsContext);
  if (!value) throw new Error('usePhoneSensors 必须在 PhoneSensorsProvider 内使用');
  return value;
}
