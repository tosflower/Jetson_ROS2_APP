export type PhoneSensorStream = 'gps' | 'heading' | 'imu' | 'magnetic';

export type SensorTerminalEntry = {
  id: number;
  publishedAt: number;
  data: string;
};

/** 每个传感器终端只保留最近记录，避免高频 IMU 无限占用内存。 */
export function appendBoundedHistory(
  history: SensorTerminalEntry[],
  entry: SensorTerminalEntry,
  limit = 200,
): SensorTerminalEntry[] {
  if (!Number.isInteger(limit) || limit <= 0) return [];
  return [...history, entry].slice(-limit);
}
