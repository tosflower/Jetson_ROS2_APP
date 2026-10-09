export const PHONE_GPS_TOPIC = '/phone/gps';
export const PHONE_GPS_TYPE = 'sensor_msgs/msg/NavSatFix';
export const PHONE_IMU_TOPIC = '/phone/imu';
export const PHONE_IMU_TYPE = 'sensor_msgs/msg/Imu';
export const PHONE_MAGNETIC_FIELD_TOPIC = '/phone/magnetic_field';
export const PHONE_MAGNETIC_FIELD_TYPE = 'sensor_msgs/msg/MagneticField';
export const PHONE_HEADING_TOPIC = '/phone/heading';
export const PHONE_HEADING_TYPE = 'std_msgs/msg/Float64';

export type RosbridgeSubscribeOptions = {
  throttleRate?: number;
  queueLength?: number;
};

export type RosbridgePublishEvent = {
  op: 'publish';
  topic: string;
  msg: Record<string, unknown>;
};

export type RosbridgeServiceResponseEvent = {
  op: 'service_response';
  id: string;
  service?: string;
  result: boolean;
  values: unknown;
};

export type RosbridgeIncomingEvent = RosbridgePublishEvent | RosbridgeServiceResponseEvent;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** 将用户输入规范为 rosbridge WebSocket 地址，并补上默认 9090 端口。 */
export function normalizeRosbridgeUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) throw new Error('请输入 rosbridge 地址');

  const candidate = /^[a-z][a-z\d+.-]*:\/\//i.test(trimmed) ? trimmed : `ws://${trimmed}`;
  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    throw new Error('请输入有效的 rosbridge 地址');
  }
  if (!['ws:', 'wss:'].includes(url.protocol) || !url.hostname || url.username || url.password) {
    throw new Error('rosbridge 地址必须是 ws:// 或 wss://，且不能包含账号信息');
  }
  if (!url.port) url.port = '9090';
  return url.toString().replace(/\/$/, '');
}

/** Phone Gateway 与 rosbridge 保持并行，仅复用主机地址并切换到 9090 端口。 */
export function rosbridgeUrlFromGateway(gatewayAddress: string): string {
  const trimmed = gatewayAddress.trim();
  const candidate = /^[a-z][a-z\d+.-]*:\/\//i.test(trimmed) ? trimmed : `http://${trimmed}`;
  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    throw new Error('网关地址无效，无法推导 rosbridge 地址');
  }
  if (!url.hostname) throw new Error('网关地址无效，无法推导 rosbridge 地址');
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
  url.port = '9090';
  url.pathname = '/';
  url.search = '';
  url.hash = '';
  return normalizeRosbridgeUrl(url.toString());
}

/** rosbridge 输入不可信；只把字段完整的 publish 消息交给订阅者。 */
export function parseRosbridgeMessage(raw: unknown): RosbridgeIncomingEvent | undefined {
  if (typeof raw !== 'string') return undefined;
  try {
    const value: unknown = JSON.parse(raw);
    if (!isRecord(value)) return undefined;
    if (value.op === 'publish' && typeof value.topic === 'string' && isRecord(value.msg)) {
      return { op: 'publish', topic: value.topic, msg: value.msg };
    }
    if (value.op === 'service_response' && typeof value.id === 'string') {
      if (value.result !== undefined && typeof value.result !== 'boolean') return undefined;
      if (value.service !== undefined && typeof value.service !== 'string') return undefined;
      return {
        op: 'service_response',
        id: value.id,
        service: typeof value.service === 'string' ? value.service : undefined,
        result: value.result !== false,
        values: value.values,
      };
    }
    return undefined;
  } catch {
    return undefined;
  }
}

/** 保留 Topic 解析入口，便于单独验证 publish 协议消息。 */
export function parseRosbridgePublish(raw: unknown): RosbridgePublishEvent | undefined {
  const message = parseRosbridgeMessage(raw);
  return message?.op === 'publish' ? message : undefined;
}
