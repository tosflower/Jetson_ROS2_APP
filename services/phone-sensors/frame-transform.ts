export type Vector3 = {
  x: number;
  y: number;
  z: number;
};

const STANDARD_GRAVITY = 9.80665;
const MICROTESLA_TO_TESLA = 1e-6;

/** Expo 加速度计的单位是 g，ROS Imu 要求 m/s²。 */
export function accelerationGToRos(value: Vector3): Vector3 {
  return {
    x: value.x * STANDARD_GRAVITY,
    y: value.y * STANDARD_GRAVITY,
    z: value.z * STANDARD_GRAVITY,
  };
}

/** Expo 磁力计的单位是 μT，ROS MagneticField 要求 T。 */
export function magneticMicroteslaToRos(value: Vector3): Vector3 {
  return {
    x: value.x * MICROTESLA_TO_TESLA,
    y: value.y * MICROTESLA_TO_TESLA,
    z: value.z * MICROTESLA_TO_TESLA,
  };
}

/**
 * 当前保留 Expo 设备坐标轴，并明确将 frame 命名为 phone_imu_link。
 * 手机在车上的安装方向完成标定后，只需在此处加入固定旋转，不会影响采集和网络层。
 */
export function deviceVectorToPhoneImuFrame(value: Vector3): Vector3 {
  return { x: value.x, y: value.y, z: value.z };
}
