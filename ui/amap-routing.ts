export type MapCoordinate = [number, number];

export type RidingRoute = {
  distance: number;
  duration: number;
  path: MapCoordinate[];
};

export type PlaceResult = {
  id: string;
  name: string;
  address: string;
  location: MapCoordinate;
};

type SearchCallback = (status: string, result: unknown) => void;
type PluginSdk = { plugin: (name: string, callback: () => void) => void };

export type RidingSdk = PluginSdk & {
  Riding: new (options: Record<string, unknown>) => {
    search: (origin: MapCoordinate, destination: MapCoordinate, callback: SearchCallback) => void;
  };
};

export type PlaceSearchSdk = PluginSdk & {
  PlaceSearch: new (options: Record<string, unknown>) => {
    search: (keyword: string, callback: SearchCallback) => void;
  };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/** GPS 转换结果、地图选点和 POI 都使用 GCJ-02，不对搜索结果重复转换。 */
export function mapCoordinate(value: unknown): MapCoordinate | null {
  const lng = Array.isArray(value) ? value[0] : isRecord(value) ? value.lng : undefined;
  const lat = Array.isArray(value) ? value[1] : isRecord(value) ? value.lat : undefined;
  return typeof lng === 'number' && Number.isFinite(lng) && Math.abs(lng) <= 180
    && typeof lat === 'number' && Number.isFinite(lat) && Math.abs(lat) <= 90
    ? [lng, lat] : null;
}

export function parseRidingRoute(result: unknown): RidingRoute {
  const route: unknown = isRecord(result) && Array.isArray(result.routes) ? result.routes[0] : undefined;
  if (!isRecord(route) || !Array.isArray(route.rides)
    || typeof route.distance !== 'number' || !Number.isFinite(route.distance) || route.distance < 0
    || typeof route.time !== 'number' || !Number.isFinite(route.time) || route.time < 0) {
    throw new Error('未获得有效骑行路线，请重新选择终点');
  }
  const path: MapCoordinate[] = [];
  for (const ride of route.rides) {
    if (!isRecord(ride) || !Array.isArray(ride.path)) throw new Error('路线数据不完整，请重试');
    for (const point of ride.path) {
      const coordinate = mapCoordinate(point);
      // 不跳过无效点，以免把中间缺失的路段绘制成可通行的直线。
      if (!coordinate) throw new Error('路线坐标无效，请重试');
      path.push(coordinate);
    }
  }
  if (path.length < 2) throw new Error('起终点过近或暂无可显示路线，请重新选择终点');
  return { distance: route.distance, duration: route.time, path };
}

export function parsePlaceResults(result: unknown): PlaceResult[] {
  if (!isRecord(result) || !isRecord(result.poiList) || !Array.isArray(result.poiList.pois)) {
    throw new Error('地点搜索返回的数据不完整，请重试');
  }
  const places: PlaceResult[] = [];
  const ids = new Set<string>();
  for (const poi of result.poiList.pois) {
    if (!isRecord(poi) || typeof poi.name !== 'string' || !poi.name.trim()) continue;
    const location = mapCoordinate(poi.location);
    if (!location) continue;
    const id = typeof poi.id === 'string' && poi.id ? poi.id : `${poi.name}:${location.join(',')}`;
    if (ids.has(id)) continue;
    ids.add(id);
    const address = [poi.cityname, poi.adname, poi.address]
      .filter((part): part is string => typeof part === 'string' && part.trim().length > 0)
      .join(' ');
    places.push({ id, name: poi.name.trim(), address, location });
  }
  return places.slice(0, 8);
}

/** 插件加载和请求共用超时/取消边界；无 map 参数，过期回调不会自动绘图。 */
function requestService<T>(
  amap: PluginSdk,
  plugin: string,
  label: string,
  signal: AbortSignal,
  timeoutMs: number,
  start: (callback: SearchCallback) => void,
  parse: (status: string, result: unknown) => T,
): Promise<T> {
  return new Promise((resolve, reject) => {
    let settled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const cleanup = (): boolean => {
      if (settled) return false;
      settled = true;
      clearTimeout(timer);
      signal.removeEventListener('abort', abort);
      return true;
    };
    const fail = (error: Error): void => { if (cleanup()) reject(error); };
    const abort = (): void => fail(new Error(`${label}已取消`));
    if (signal.aborted) { abort(); return; }
    signal.addEventListener('abort', abort, { once: true });
    timer = setTimeout(() => fail(new Error(`${label}超时，请检查网络后重试`)), timeoutMs);
    try {
      amap.plugin(plugin, () => {
        if (settled) return;
        try {
          start((status, result) => {
            if (settled) return;
            try {
              const parsed = parse(status, result);
              if (cleanup()) resolve(parsed);
            } catch (error) {
              fail(error instanceof Error ? error : new Error(`${label}数据解析失败`));
            }
          });
        } catch {
          fail(new Error(`${label}服务未能启动，请检查网络后重试`));
        }
      });
    } catch {
      fail(new Error(`${label}插件加载失败，请检查网络后重试`));
    }
  });
}

export function requestRidingRoute(
  amap: RidingSdk,
  origin: MapCoordinate,
  destination: MapCoordinate,
  signal: AbortSignal,
  timeoutMs = 15000,
): Promise<RidingRoute> {
  return requestService(amap, 'AMap.Riding', '骑行路线查询', signal, timeoutMs,
    (callback) => new amap.Riding({ policy: 1 }).search(origin, destination, callback),
    (status, result) => {
      if (status !== 'complete') throw new Error(status === 'no_data'
        ? '这两个位置之间暂无骑行路线，请选择附近道路上的终点'
        : '骑行路线查询失败，请检查网络或高德路线服务权限后重试');
      return parseRidingRoute(result);
    });
}

export function searchPlaces(
  amap: PlaceSearchSdk,
  keyword: string,
  signal: AbortSignal,
  timeoutMs = 15000,
): Promise<PlaceResult[]> {
  if (!keyword.trim()) return Promise.resolve([]);
  return requestService(amap, 'AMap.PlaceSearch', '地点搜索', signal, timeoutMs,
    (callback) => new amap.PlaceSearch({ pageSize: 8, pageIndex: 1, extensions: 'base' })
      .search(keyword.trim(), callback),
    (status, result) => {
      if (status === 'no_data') return [];
      if (status !== 'complete') throw new Error('地点搜索失败，请检查网络或高德搜索服务权限后重试');
      return parsePlaceResults(result);
    });
}

export function formatRouteDistance(metres: number): string {
  return metres < 1000 ? `${Math.round(metres)} 米` : `${(metres / 1000).toFixed(1)} 公里`;
}

export function formatRouteDuration(seconds: number): string {
  const minutes = Math.max(1, Math.ceil(seconds / 60));
  if (minutes < 60) return `约 ${minutes} 分钟`;
  const remaining = minutes % 60;
  return `约 ${Math.floor(minutes / 60)} 小时${remaining ? ` ${remaining} 分钟` : ''}`;
}
