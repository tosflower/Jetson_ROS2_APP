export type Coordinate = [number, number];
export type Waypoint = { index: number; position: Coordinate; distanceAlongM: number };
export type NavigationRoute = {
  id: string;
  coordinateSystem: 'GCJ-02';
  createdAt: number;
  distanceM: number;
  geometryLengthM: number;
  durationS: number;
  path: Coordinate[];
  waypoints: Waypoint[];
};
export type PositionSample = {
  position: Coordinate;
  timestamp: number;
  accuracyM: number | null;
  speedMps: number | null;
};
export type NavigationProgress = {
  travelledM: number;
  remainingM: number;
  alongM: number;
  offRouteM: number;
  previous: PositionSample | null;
};

const EARTH_RADIUS_M = 6371008.8;
const RAD = Math.PI / 180;
export const MAX_FIX_AGE_MS = 10000;
export const MAX_FIX_ACCURACY_M = 50;

export function validCoordinate(value: Coordinate): boolean {
  return Array.isArray(value) && value.length === 2
    && value.every(Number.isFinite) && Math.abs(value[0]) <= 180 && Math.abs(value[1]) <= 90;
}

export function distanceMetres(a: Coordinate, b: Coordinate): number {
  const lat = (b[1] - a[1]) * RAD;
  const lng = (b[0] - a[0]) * RAD;
  const h = Math.sin(lat / 2) ** 2 + Math.cos(a[1] * RAD) * Math.cos(b[1] * RAD) * Math.sin(lng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

function turnDegrees(a: Coordinate, b: Coordinate, c: Coordinate): number {
  const scale = Math.cos(b[1] * RAD);
  const incoming = Math.atan2(b[1] - a[1], (b[0] - a[0]) * scale);
  const outgoing = Math.atan2(c[1] - b[1], (c[0] - b[0]) * scale);
  const angle = Math.abs((outgoing - incoming) / RAD) % 360;
  return Math.min(angle, 360 - angle);
}

/** 等距采样位于原始折线上，并保留明显转弯；不会把经纬度伪装成 Nav2 map 米制坐标。 */
export function buildNavigationRoute(
  coordinates: Coordinate[], distanceM: number, durationS: number, id: string, createdAt: number,
): NavigationRoute {
  if (coordinates.length < 2 || coordinates.length > 50000 || coordinates.some((point) => !validCoordinate(point))
    || !Number.isFinite(distanceM) || distanceM < 0 || !Number.isFinite(durationS) || durationS < 0) {
    throw new Error('路线数据无效，无法生成航点');
  }
  const path = coordinates.filter((point, index) => index === 0 || distanceMetres(coordinates[index - 1], point) > 0.05)
    .map((point): Coordinate => [...point]);
  if (path.length < 2) throw new Error('路线过短，无法生成航点');
  const lengths = path.slice(1).map((point, index) => distanceMetres(path[index], point));
  const geometryLengthM = lengths.reduce((total, length) => total + length, 0);
  if (geometryLengthM < 1) throw new Error('路线过短，无法生成航点');
  const spacing = Math.max(20, geometryLengthM / 100);
  const waypoints: Waypoint[] = [{ index: 0, position: [...path[0]], distanceAlongM: 0 }];
  const add = (position: Coordinate, along: number): void => {
    const previous = waypoints[waypoints.length - 1];
    if (along - previous.distanceAlongM < 0.1) return;
    waypoints.push({ index: waypoints.length, position, distanceAlongM: along });
  };
  let travelled = 0;
  let nextSample = spacing;
  for (let segment = 0; segment < lengths.length; segment += 1) {
    const length = lengths[segment];
    const start = path[segment];
    const end = path[segment + 1];
    while (nextSample < travelled + length) {
      const t = (nextSample - travelled) / length;
      add([start[0] + (end[0] - start[0]) * t, start[1] + (end[1] - start[1]) * t], nextSample);
      nextSample += spacing;
    }
    travelled += length;
    if (segment === lengths.length - 1 || turnDegrees(start, end, path[segment + 2]) >= 30) add([...end], travelled);
    if (waypoints.length > 500) throw new Error('路线转弯过多，请缩短路线后重新规划');
  }
  const last = waypoints[waypoints.length - 1];
  last.position = [...path[path.length - 1]];
  last.distanceAlongM = geometryLengthM;
  return { id, coordinateSystem: 'GCJ-02', createdAt, distanceM, geometryLengthM, durationS, path, waypoints };
}

/** 点到路线的投影；可限制沿线窗口，避免交叉路口把进度跳到远处的后续路段。 */
export function projectOnRoute(
  route: NavigationRoute, position: Coordinate, minimumAlong = 0, maximumAlong = Infinity,
): { alongM: number; offRouteM: number } {
  let offset = 0;
  let best = { alongM: minimumAlong, offRouteM: Infinity };
  const metresPerDegree = EARTH_RADIUS_M * RAD;
  const longitudeScale = metresPerDegree * Math.cos(position[1] * RAD);
  for (let index = 1; index < route.path.length; index += 1) {
    const a = route.path[index - 1];
    const b = route.path[index];
    const length = distanceMetres(a, b);
    if (offset + length >= minimumAlong && offset <= maximumAlong && length > 0) {
      const ax = (a[0] - position[0]) * longitudeScale;
      const ay = (a[1] - position[1]) * metresPerDegree;
      const dx = (b[0] - a[0]) * longitudeScale;
      const dy = (b[1] - a[1]) * metresPerDegree;
      const lower = Math.max(0, (minimumAlong - offset) / length);
      const upper = Math.min(1, (maximumAlong - offset) / length);
      const t = Math.max(lower, Math.min(upper, -(ax * dx + ay * dy) / (dx * dx + dy * dy)));
      const offRouteM = Math.hypot(ax + t * dx, ay + t * dy);
      if (offRouteM < best.offRouteM) best = { alongM: offset + t * length, offRouteM };
    }
    offset += length;
  }
  return best;
}

export function usableFix(sample: PositionSample, now: number): boolean {
  return validCoordinate(sample.position) && Number.isFinite(sample.timestamp)
    && now - sample.timestamp >= -2000 && now - sample.timestamp <= MAX_FIX_AGE_MS
    && sample.accuracyM !== null && Number.isFinite(sample.accuracyM)
    && sample.accuracyM >= 0 && sample.accuracyM <= MAX_FIX_ACCURACY_M;
}

export function startProgress(route: NavigationRoute, sample: PositionSample, now: number): NavigationProgress {
  if (!usableFix(sample, now)) throw new Error('请等待新鲜且精度较好的定位后开始导航');
  if (distanceMetres(sample.position, route.path[0]) > Math.max(50, (sample.accuracyM ?? 0) * 2)) {
    throw new Error('当前位置已离开路线起点，请先重新规划');
  }
  const projection = projectOnRoute(route, sample.position, 0, 100);
  return {
    travelledM: 0, remainingM: route.distanceM * (1 - projection.alongM / route.geometryLengthM),
    alongM: projection.alongM, offRouteM: projection.offRouteM, previous: sample,
  };
}

export function updateProgress(
  route: NavigationRoute, previous: NavigationProgress, sample: PositionSample, now: number,
): NavigationProgress {
  if (!usableFix(sample, now) || (previous.previous && sample.timestamp <= previous.previous.timestamp)) return previous;
  const last = previous.previous;
  if (!last) return { ...previous, previous: sample };
  const seconds = (sample.timestamp - last.timestamp) / 1000;
  const movement = distanceMetres(last.position, sample.position);
  // 中断期间不把两个端点连成实际行驶轨迹，也不把定位跳变累计成距离。
  if (seconds > 15 || movement > 35 * seconds + (sample.accuracyM ?? 0)) return { ...previous, previous: sample };
  const stationary = sample.speedMps !== null && sample.speedMps >= 0 && sample.speedMps < 0.3;
  if (stationary) return { ...previous, previous: sample };
  const jitter = Math.max(2, Math.min(8, ((last.accuracyM ?? 0) + (sample.accuracyM ?? 0)) / 2));
  if (movement < jitter) return previous;
  const projection = projectOnRoute(route, sample.position,
    Math.max(0, previous.alongM - 30), previous.alongM + movement + 50);
  const onRoute = projection.offRouteM <= Math.max(25, sample.accuracyM ?? 0);
  const alongM = onRoute ? projection.alongM : previous.alongM;
  return {
    travelledM: previous.travelledM + movement,
    remainingM: Math.max(0, route.distanceM * (1 - alongM / route.geometryLengthM)),
    alongM, offRouteM: projection.offRouteM, previous: sample,
  };
}


/** 当前地图坐标指向航点的初始方位角：北为 0°，顺时针递增；重合位置无确定方向。 */
export function bearingDegrees(from: Coordinate, to: Coordinate): number | null {
  if (!validCoordinate(from) || !validCoordinate(to) || distanceMetres(from, to) < 1) return null;
  const delta = (to[0] - from[0]) * RAD;
  const lat1 = from[1] * RAD;
  const lat2 = to[1] * RAD;
  const y = Math.sin(delta) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(delta);
  return (Math.atan2(y, x) / RAD + 360) % 360;
}
