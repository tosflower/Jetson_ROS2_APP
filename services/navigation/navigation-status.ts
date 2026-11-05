import type { NavigationProgress, NavigationRoute, PositionSample } from './route-geometry';
import { MAX_FIX_AGE_MS, usableFix, bearingDegrees } from './route-geometry';
import type { NavigationStatus } from './navigation-publisher';

export function makeNavigationStatus(
  route: NavigationRoute | null, state: NavigationStatus['state'], progress: NavigationProgress | null,
  sample: PositionSample | null, now: number,
): NavigationStatus {
  let fixState: NavigationStatus['fixState'] = 'fresh';
  if (!sample) fixState = 'unavailable';
  else if (!Number.isFinite(sample.timestamp) || now - sample.timestamp > MAX_FIX_AGE_MS || now - sample.timestamp < -2000) fixState = 'stale';
  else if (!usableFix(sample, now)) fixState = 'poor_accuracy';
  else if (progress && progress.offRouteM > Math.max(25, sample.accuracyM ?? 0)) fixState = 'off_route';
  const fresh = fixState === 'fresh' || fixState === 'off_route';
  const next = fresh && route ? route.waypoints.find(point => point.distanceAlongM > (progress?.alongM ?? 0) + 1) : undefined;
  const speed = sample?.speedMps;
  return {
    routeId: route?.id ?? null, state, timestamp: now,
    travelledM: progress?.travelledM ?? 0,
    remainingM: fresh ? (progress?.remainingM ?? route?.distanceM ?? null) : null,
    speedMps: (fresh || fixState === 'off_route') && typeof speed === 'number' && Number.isFinite(speed) && speed >= 0 ? speed : null,
    nextWaypoint: next?.index ?? null,
    nextWaypointBearingDegrees: next && sample ? bearingDegrees(sample.position, next.position) : null,
    fixState,
  };
}


export function navigationFixMessage(state: NavigationStatus['fixState'], sample: PositionSample | null, now: number): string {
  if (state === 'fresh') return '';
  if (state === 'off_route') return '已偏离路线，继续导航；剩余距离按原路线估算。';
  if (state === 'unavailable') return '正在等待手机定位和坐标转换…';
  if (state === 'poor_accuracy') return sample?.accuracyM !== null && sample?.accuracyM !== undefined && Number.isFinite(sample.accuracyM)
    ? `定位精度不足（±${Math.round(sample.accuracyM)} 米），请到开阔处并开启精确定位。`
    : '手机尚未提供定位精度，请等待有效 GPS 数据。';
  if (sample && sample.timestamp > now + 2000) return '定位时间异常，请检查手机系统时间。';
  const age = sample && Number.isFinite(sample.timestamp) ? Math.max(0, Math.floor((now - sample.timestamp) / 1000)) : null;
  return age === null ? '定位时间无效，正在等待新的 GPS 数据。'
    : `GPS 已 ${age} 秒未更新，请保持应用在前台并检查手机定位。`;
}
