import type { NavigationRoute } from './route-geometry';

export const NAVIGATION_ROUTE_TOPIC = '/phone/navigation/route';
export const NAVIGATION_STATUS_TOPIC = '/phone/navigation/status';
export const NAVIGATION_MESSAGE_TYPE = 'std_msgs/msg/String';

export type NavigationStatus = {
  routeId: string | null;
  state: 'preview' | 'tracking' | 'stopped' | 'cleared';
  timestamp: number;
  travelledM: number;
  remainingM: number | null;
  speedMps: number | null;
  nextWaypoint: number | null;
  nextWaypointBearingDegrees: number | null;
  fixState: 'fresh' | 'stale' | 'poor_accuracy' | 'unavailable' | 'off_route';
};

export type NavigationEvent =
  | { kind: 'route'; route: NavigationRoute; status: NavigationStatus }
  | { kind: 'start'; route: NavigationRoute; status: NavigationStatus }
  | { kind: 'update' | 'stop' | 'clear'; status: NavigationStatus };

export type PublishReceipt = { delivered: boolean; message: string };

type Transport = {
  advertiseTopic: (topic: string, type: string) => void;
  unadvertiseTopic: (topic: string) => void;
  publishTopic: (topic: string, message: { data: string }) => void;
};

export function routePayload(route: NavigationRoute | null): object {
  return {
    version: 1,
    mode: 'phone_tracking',
    route_id: route?.id ?? null,
    coordinate_system: 'GCJ-02',
    coordinate_order: 'longitude_latitude',
    created_at_ms: route?.createdAt ?? null,
    distance_m: route?.distanceM ?? null,
    geometry_length_m: route?.geometryLengthM ?? null,
    duration_s: route?.durationS ?? null,
    // 保留原始道路折线，后续适配器不能只用稀疏航点连接出穿越道路的捷径。
    path: route?.path ?? [],
    waypoints: route?.waypoints.map((point) => ({
      index: point.index,
      longitude: point.position[0],
      latitude: point.position[1],
      distance_along_m: point.distanceAlongM,
    })) ?? [],
    requires_nav2_coordinate_transform: true,
  };
}

export function statusPayload(status: NavigationStatus): object {
  return {
    version: 1,
    mode: 'phone_tracking',
    nav2_goal_sent: false,
    route_id: status.routeId,
    state: status.state,
    timestamp_ms: status.timestamp,
    travelled_m: status.travelledM,
    remaining_m: status.remainingM,
    speed_mps: status.speedMps,
    next_waypoint_index: status.nextWaypoint,
    next_waypoint_bearing_degrees: status.nextWaypointBearingDegrees,
    fix_state: status.fixState,
  };
}

/** 仅发布路线和手机定位状态；不发送 Nav2 Action 或速度指令，也不缓存运动命令。 */
export class NavigationPublisher {
  private connected = false;
  private route: NavigationRoute | null = null;
  private status: NavigationStatus | null = null;
  private lastUpdateAt = -Infinity;

  constructor(private readonly transport: Transport) {}

  setConnected(connected: boolean): PublishReceipt {
    this.connected = connected;
    if (!connected) return { delivered: false, message: '' };
    return this.emit(true);
  }

  handle(event: NavigationEvent): PublishReceipt {
    if (event.kind === 'route' || event.kind === 'start') this.route = event.route;
    if (event.kind === 'clear') this.route = null;
    this.status = event.status;
    const includeRoute = event.kind === 'route' || event.kind === 'start' || event.kind === 'clear';
    if (!this.connected) return { delivered: false, message: '' };
    if (event.kind === 'update' && event.status.timestamp - this.lastUpdateAt < 1000) {
      return { delivered: true, message: '' };
    }
    this.lastUpdateAt = event.status.timestamp;
    return this.emit(includeRoute);
  }

  dispose(): void {
    if (this.status?.state === 'tracking') {
      this.status = { ...this.status, state: 'stopped', timestamp: Date.now() };
      if (this.connected) this.emit(false);
    }
    this.connected = false;
    this.transport.unadvertiseTopic(NAVIGATION_ROUTE_TOPIC);
    this.transport.unadvertiseTopic(NAVIGATION_STATUS_TOPIC);
  }

  private emit(includeRoute: boolean): PublishReceipt {
    try {
      this.transport.advertiseTopic(NAVIGATION_ROUTE_TOPIC, NAVIGATION_MESSAGE_TYPE);
      this.transport.advertiseTopic(NAVIGATION_STATUS_TOPIC, NAVIGATION_MESSAGE_TYPE);
      if (includeRoute && this.status) {
        this.transport.publishTopic(NAVIGATION_ROUTE_TOPIC, { data: JSON.stringify(routePayload(this.route)) });
      }
      if (this.status) {
        this.transport.publishTopic(NAVIGATION_STATUS_TOPIC, { data: JSON.stringify(statusPayload(this.status)) });
      }
      return { delivered: true, message: '' };
    } catch {
      return { delivered: false, message: '航点接口暂时不可用，手机定位统计继续；连接恢复后重新发送' };
    }
  }
}
