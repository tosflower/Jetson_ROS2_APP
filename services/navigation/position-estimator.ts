import { distanceMetres, projectOnRoute, usableFix,
  type Coordinate, type NavigationProgress, type NavigationRoute, type PositionSample } from './route-geometry';

export type EstimatedPosition = PositionSample & { estimatedAt: number };

/** 只补齐短时间 GPS 间隔；保留真实 GPS 时间戳，避免推算让定位永不过期。 */
export class PositionEstimator {
  private fix: PositionSample | null = null;
  private position: Coordinate | null = null;
  private time = 0;

  update(fix: PositionSample | null, heading: number | null, headingTimestamp: number | null, now: number): EstimatedPosition | null {
    if (!fix) {
      this.fix = null;
      this.position = null;
      return null;
    }
    if (!this.fix || fix.timestamp !== this.fix.timestamp
      || fix.position[0] !== this.fix.position[0] || fix.position[1] !== this.fix.position[1]) {
      this.position = [...fix.position];
      this.time = now;
    }
    this.fix = fix;
    const seconds = Math.max(0, (now - this.time) / 1000);
    this.time = now;
    const canMove = usableFix(fix, now) && fix.speedMps !== null && Number.isFinite(fix.speedMps)
      && fix.speedMps >= 0.3 && heading !== null && Number.isFinite(heading)
      && headingTimestamp !== null && Number.isFinite(headingTimestamp)
      && now - headingTimestamp >= -2000 && now - headingTimestamp <= 10000;
    // 后台恢复或时钟跳变时不补算缺失时段。
    if (canMove && seconds > 0 && seconds <= 1 && this.position) {
      const radians = Math.PI / 180;
      const angle = heading * radians;
      const arc = fix.speedMps! * seconds / 6371008.8;
      const latitude = this.position[1] * radians;
      const nextLatitude = Math.asin(Math.max(-1, Math.min(1,
        Math.sin(latitude) * Math.cos(arc) + Math.cos(latitude) * Math.sin(arc) * Math.cos(angle))));
      const longitude = this.position[0] + Math.atan2(Math.sin(angle) * Math.sin(arc) * Math.cos(latitude),
        Math.cos(arc) - Math.sin(latitude) * Math.sin(nextLatitude)) / radians;
      this.position = [((longitude + 540) % 360) - 180, nextLatitude / radians];
    }
    return { ...fix, position: this.position ?? fix.position, estimatedAt: now };
  }
}

/** 推算只调整路线进度；实际 GPS 里程基线不被推算或校正位移污染。 */
export function estimatedProgress(route: NavigationRoute | null, progress: NavigationProgress | null,
  fix: PositionSample | null, estimate: EstimatedPosition | null, now: number): NavigationProgress | null {
  if (!route || !progress || !fix || !estimate || estimate.timestamp !== fix.timestamp || !usableFix(fix, now)) return progress;
  const movement = distanceMetres(fix.position, estimate.position);
  if (movement < 0.01 || progress.offRouteM > Math.max(25, fix.accuracyM ?? 0)) return progress;
  const projection = projectOnRoute(route, estimate.position, Math.max(0, progress.alongM - 30), progress.alongM + movement + 50);
  const alongM = projection.offRouteM <= Math.max(25, fix.accuracyM ?? 0) ? projection.alongM : progress.alongM;
  return { ...progress, alongM, offRouteM: projection.offRouteM,
    remainingM: Math.max(0, route.distanceM * (1 - alongM / route.geometryLengthM)) };
}
