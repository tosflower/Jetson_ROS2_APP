/** 手机连接页的固定网关入口；未显式指定地址时默认选择开发板 1。 */
export const JETSON_GATEWAY_OPTIONS = [
  { label: 'Jetson 开发板 1', ip: '10.42.0.1', address: '10.42.0.1:8080' },
  { label: 'Jetson 开发板 2', ip: '192.168.50.1', address: '192.168.50.1:8080' },
] as const;

export const DEFAULT_GATEWAY_ADDRESS = JETSON_GATEWAY_OPTIONS[0].address;

/** 允许直接输入 IP；已明确填写端口或 HTTPS 的地址保持原意。 */
export function normalizeGatewayHttpBase(value: string): string {
  const trimmed = value.trim().replace(/\/$/, '');
  const candidate = trimmed.startsWith('http://') || trimmed.startsWith('https://') ? trimmed : `http://${trimmed}`;
  try {
    const url = new URL(candidate);
    const authority = candidate.replace(/^https?:\/\//, '').split('/')[0];
    if (url.protocol === 'http:' && !/:\d+$/.test(authority)) url.port = '8080';
    return url.toString().replace(/\/$/, '');
  } catch {
    return candidate;
  }
}
