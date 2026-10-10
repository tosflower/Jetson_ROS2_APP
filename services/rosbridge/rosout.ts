export const ROSOUT_TOPIC = '/rosout';
export const ROSOUT_TYPE = 'rcl_interfaces/msg/Log';

const LEVEL_LABELS: Record<number, string> = {
  10: 'DEBUG', 20: 'INFO', 30: 'WARN', 40: 'ERROR', 50: 'FATAL',
};

/** 将 ROS2 /rosout 日志规范成可阅读的一行，不信任外部消息字段。 */
export function formatRosoutMessage(value: Record<string, unknown>): string | null {
  if (typeof value.msg !== 'string' || typeof value.name !== 'string') return null;
  const level = typeof value.level === 'number' ? LEVEL_LABELS[value.level] ?? String(value.level) : 'LOG';
  const stamp = value.stamp;
  const time = typeof stamp === 'object' && stamp !== null
    && 'sec' in stamp && typeof stamp.sec === 'number'
    && 'nanosec' in stamp && typeof stamp.nanosec === 'number'
    ? new Date(stamp.sec * 1000 + stamp.nanosec / 1_000_000).toLocaleTimeString()
    : new Date().toLocaleTimeString();
  const message = value.msg.replace(/\r?\n/g, '\n  ');
  return `[${time}] [${level}] [${value.name}] ${message}\n`;
}
