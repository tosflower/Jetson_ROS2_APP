import * as Network from 'expo-network';
import { Platform } from 'react-native';
import { discoverJetsonAsync, getWifiGatewayAddressAsync } from '@/modules/jetson-discovery';

const GATEWAY_PORT = 8080;
const PROBE_TIMEOUT_MS = 1400;

function isPrivateIpv4(address: string): boolean {
  const parts = address.split('.').map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return false;
  return parts[0] === 10
    || (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31)
    || (parts[0] === 192 && parts[1] === 168);
}

/** 热点常用 .1 地址只作候选，必须经过 /health 验证后才展示。 */
export function hotspotGatewayCandidate(phoneIp: string): string | null {
  if (!isPrivateIpv4(phoneIp)) return null;
  const parts = phoneIp.split('.');
  if (parts[3] === '1') return null;
  return `${parts.slice(0, 3).join('.')}.1:${GATEWAY_PORT}`;
}

function normalizeCandidate(candidate: string): string | null {
  try {
    const url = new URL(candidate.includes('://') ? candidate : `http://${candidate}`);
    if (url.protocol !== 'http:' || !url.hostname || url.username || url.password) return null;
    return `${url.hostname}:${url.port || GATEWAY_PORT}`;
  } catch {
    return null;
  }
}

/** 匿名健康检查确认服务类型；不会向未知设备发送 Ubuntu 密码。 */
export async function probeGateway(candidate: string): Promise<string | null> {
  const address = normalizeCandidate(candidate);
  if (!address) return null;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);
  try {
    const response = await fetch(`http://${address}/health`, { signal: controller.signal });
    if (!response.ok) return null;
    const body: unknown = await response.json();
    if (typeof body !== 'object' || body === null) return null;
    const result = body as { status?: unknown; capabilities?: unknown };
    return result.status === 'ok'
      && Array.isArray(result.capabilities)
      && result.capabilities.includes('password_auth')
      && result.capabilities.includes('system_power')
      ? address : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/** 热点通过 DHCP 网关发现；同路由器通过网关发布的 mDNS 服务发现。 */
export async function discoverGateway(previousAddress?: string): Promise<string | null> {
  if (Platform.OS === 'web') return previousAddress ? probeGateway(previousAddress) : null;
  const network = await Network.getNetworkStateAsync();
  // 热点没有互联网时 Android 可能把蜂窝网络标为 active，仍继续读取 Wi-Fi 网关。
  if (network.type === Network.NetworkStateType.NONE) return null;

  // mDNS 与热点候选同时开始，避免共享路由器场景等待无效网关探测后才扫描。
  const servicePromise = discoverJetsonAsync().catch(() => null);
  const [gatewayIp, phoneIp] = await Promise.all([
    getWifiGatewayAddressAsync().catch(() => null),
    Network.getIpAddressAsync().catch(() => ''),
  ]);
  const candidates = [
    gatewayIp ? `${gatewayIp}:${GATEWAY_PORT}` : null,
    hotspotGatewayCandidate(phoneIp),
    previousAddress ?? null,
  ];
  for (const candidate of candidates) {
    if (!candidate) continue;
    const found = await probeGateway(candidate);
    if (found) return found;
  }
  const service = await servicePromise;
  return service ? probeGateway(`${service.address}:${service.port}`) : null;
}
