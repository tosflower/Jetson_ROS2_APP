import {
  accelerationGToRos,
  deviceVectorToPhoneImuFrame,
  magneticMicroteslaToRos,
  type Vector3,
} from './frame-transform';

export type RosTime = { sec: number; nanosec: number };
export type RosHeader = { stamp: RosTime; frame_id: string };
export type RosFloat64Message = { data: number };

// 手机顶部默认与车头同向；若实际固定安装存在偏角，只需修改这一处。
export const PHONE_HEADING_MOUNT_OFFSET_DEGREES = 0;

export type PhoneLocationSample = {
  timestamp: number;
  coords: {
    latitude: number;
    longitude: number;
    altitude: number | null;
    accuracy: number | null;
    altitudeAccuracy: number | null;
  };
};

const UNKNOWN_COVARIANCE = [-1, 0, 0, 0, 0, 0, 0, 0, 0] as const;

/** Unix 毫秒转 ROS 2 sec/nanosec，并确保 nanosec 始终在合法范围内。 */
export function rosTimeFromUnixMilliseconds(timestampMs: number): RosTime {
  const safeTimestamp = Number.isFinite(timestampMs) && timestampMs >= 0 ? timestampMs : Date.now();
  const sec = Math.floor(safeTimestamp / 1000);
  const nanosec = Math.floor((safeTimestamp - sec * 1000) * 1_000_000);
  return { sec, nanosec: Math.min(999_999_999, Math.max(0, nanosec)) };
}

export function buildNavSatFixMessage(sample: PhoneLocationSample): Record<string, unknown> | null {
  const { coords } = sample;
  // JSON WebSocket 无法可靠表示 NaN；海拔缺失时不发布，避免用 0 伪造测量。
  if (![coords.latitude, coords.longitude, coords.altitude].every((value) => (
    typeof value === 'number' && Number.isFinite(value)
  ))) return null;

  const horizontalAccuracy = typeof coords.accuracy === 'number' && coords.accuracy >= 0
    ? coords.accuracy
    : undefined;
  const verticalAccuracy = typeof coords.altitudeAccuracy === 'number' && coords.altitudeAccuracy >= 0
    ? coords.altitudeAccuracy
    : undefined;
  const positionCovariance = new Array<number>(9).fill(0);
  if (horizontalAccuracy !== undefined) {
    positionCovariance[0] = horizontalAccuracy ** 2;
    positionCovariance[4] = horizontalAccuracy ** 2;
  }
  if (verticalAccuracy !== undefined) positionCovariance[8] = verticalAccuracy ** 2;
  const covarianceType = horizontalAccuracy === undefined
    ? 0 // COVARIANCE_TYPE_UNKNOWN
    : verticalAccuracy === undefined
      ? 1 // COVARIANCE_TYPE_APPROXIMATED
      : 2; // COVARIANCE_TYPE_DIAGONAL_KNOWN

  return {
    header: { stamp: rosTimeFromUnixMilliseconds(sample.timestamp), frame_id: 'phone_gps_link' },
    // Expo 不暴露具体星座来源，service 保留 0，不伪装为纯 GPS 定位。
    status: { status: 0, service: 0 }, // STATUS_FIX
    latitude: coords.latitude,
    longitude: coords.longitude,
    altitude: coords.altitude,
    position_covariance: positionCovariance,
    position_covariance_type: covarianceType,
  };
}

/** 经纬度始终独立发送；海拔缺失时以 null 表示，避免伪造高度。 */
export function buildGpsDataMessage(sample: PhoneLocationSample): { data: string } {
  const { latitude, longitude, altitude, accuracy } = sample.coords;
  if (![latitude, longitude].every((value) => Number.isFinite(value))) {
    throw new Error('GPS 经纬度无效');
  }
  return { data: JSON.stringify({
    latitude,
    longitude,
    altitude: typeof altitude === 'number' && Number.isFinite(altitude) ? altitude : null,
    accuracy_m: typeof accuracy === 'number' && Number.isFinite(accuracy) ? accuracy : null,
    timestamp_ms: sample.timestamp,
  }) };
}

/** 将手机指南针角度修正为车头角度，并规范到 [0, 360) 度。 */
export function buildHeadingMessage(
  headingDegrees: number,
  mountOffsetDegrees = PHONE_HEADING_MOUNT_OFFSET_DEGREES,
): RosFloat64Message | null {
  if (!Number.isFinite(headingDegrees) || !Number.isFinite(mountOffsetDegrees)) return null;
  const normalized = ((headingDegrees + mountOffsetDegrees) % 360 + 360) % 360;
  return { data: normalized };
}

export function buildImuMessage(
  accelerationInG: Vector3,
  angularVelocityRadPerSecond: Vector3,
  timestampMs: number,
): Record<string, unknown> {
  const acceleration = deviceVectorToPhoneImuFrame(accelerationGToRos(accelerationInG));
  const angularVelocity = deviceVectorToPhoneImuFrame(angularVelocityRadPerSecond);
  return {
    header: { stamp: rosTimeFromUnixMilliseconds(timestampMs), frame_id: 'phone_imu_link' },
    // 尚未接入可验证的姿态源，按 sensor_msgs/Imu 约定用 covariance[0] = -1 标记未知。
    orientation: { x: 0, y: 0, z: 0, w: 0 },
    orientation_covariance: [...UNKNOWN_COVARIANCE],
    angular_velocity: angularVelocity,
    angular_velocity_covariance: [...UNKNOWN_COVARIANCE],
    linear_acceleration: acceleration,
    linear_acceleration_covariance: [...UNKNOWN_COVARIANCE],
  };
}

export function buildMagneticFieldMessage(
  magneticFieldMicrotesla: Vector3,
  timestampMs: number,
): Record<string, unknown> {
  const magneticField = deviceVectorToPhoneImuFrame(magneticMicroteslaToRos(magneticFieldMicrotesla));
  return {
    header: { stamp: rosTimeFromUnixMilliseconds(timestampMs), frame_id: 'phone_imu_link' },
    magnetic_field: magneticField,
    magnetic_field_covariance: [...UNKNOWN_COVARIANCE],
  };
}
