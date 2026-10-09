'use dom';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  formatRouteDistance,
  formatRouteDuration,
  mapCoordinate,
  requestRidingRoute,
  searchPlaces,
  type PlaceResult,
  type PlaceSearchSdk,
  type MapCoordinate,
  type RidingRoute,
  type RidingSdk,
} from './amap-routing';

import { buildNavigationRoute, startProgress, updateProgress, usableFix,
  type NavigationRoute, type NavigationProgress, type PositionSample } from '../services/navigation/route-geometry';
import { PositionEstimator, estimatedProgress, type EstimatedPosition } from '../services/navigation/position-estimator';
import { CoordinateConverter } from '../services/navigation/coordinate-converter';
import { makeNavigationStatus, navigationFixMessage } from '../services/navigation/navigation-status';
import type { NavigationEvent, PublishReceipt } from '../services/navigation/navigation-publisher';

type AMapPosition = MapCoordinate | { lng: number; lat: number };
type MapEvent = { lnglat?: AMapPosition };
type MapListener = (event: MapEvent) => void;

type AMapMap = {
  add: (overlays: unknown[]) => void;
  remove: (overlays: unknown[]) => void;
  destroy: () => void;
  setCenter: (position: AMapPosition) => void;
  setMapStyle: (style: string) => void;
  setFitView: (overlays: unknown[], immediately: boolean, padding: number[], maxZoom: number) => void;
  on: (event: string, listener: MapListener) => void;
  off: (event: string, listener: MapListener) => void;
};

type AMapMarker = {
  setAngle: (angle: number) => void;
  setPosition: (position: AMapPosition) => void;
  hide: () => void;
  show: () => void;
};

type AMapCircle = {
  hide: () => void;
  setCenter: (position: AMapPosition) => void;
  setRadius: (radius: number) => void;
  show: () => void;
};

type AMapConvertResult = {
  info?: string;
  locations?: AMapPosition[];
};

type AMapNamespace = RidingSdk & PlaceSearchSdk & {
  Map: new (container: string, options: Record<string, unknown>) => AMapMap;
  Marker: new (options: Record<string, unknown>) => AMapMarker;
  Circle: new (options: Record<string, unknown>) => AMapCircle;
  Polyline: new (options: Record<string, unknown>) => unknown;
  convertFrom: (
    position: MapCoordinate,
    source: 'gps',
    callback: (status: string, result: AMapConvertResult) => void,
  ) => void;
};

declare global {
  interface Window {
    AMap?: AMapNamespace;
    _AMapSecurityConfig?: { securityJsCode: string };
  }
}

type AmapLocationMapProps = {
  apiKey: string;
  securityJsCode: string;
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  gpsTimestamp: number | null;
  speedMps: number | null;
  rosConnected: boolean;
  onNavigationEvent: (event: NavigationEvent) => Promise<PublishReceipt>;
  headingDegrees: number | null;
  headingAccuracy: number | null;
  headingTimestamp: number | null;
  headingSource: 'true' | 'magnetic' | null;
  locationStatus: string;
  dark: boolean;
  dom?: import('expo/dom').DOMProps;
};

let amapLoadPromise: Promise<AMapNamespace> | null = null;

function loadAmap(apiKey: string, securityJsCode: string): Promise<AMapNamespace> {
  if (window.AMap) return Promise.resolve(window.AMap);
  if (amapLoadPromise) return amapLoadPromise;

  window._AMapSecurityConfig = { securityJsCode };
  amapLoadPromise = new Promise<AMapNamespace>((resolve, reject) => {
    const script = document.createElement('script');
    script.dataset.amapSdk = 'true';
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${encodeURIComponent(apiKey)}`;
    script.async = true;
    script.onload = () => {
      if (window.AMap) resolve(window.AMap);
      else reject(new Error('高德地图脚本已加载，但 API 未初始化'));
    };
    script.onerror = () => reject(new Error('高德地图加载失败，请检查手机互联网连接'));
    document.head.appendChild(script);
  });
  const currentPromise = amapLoadPromise;
  void currentPromise.catch(() => {
    if (amapLoadPromise === currentPromise) amapLoadPromise = null;
  });
  return amapLoadPromise;
}

function mapPadding(panel: HTMLElement | null): number[] {
  const bounds = panel?.getBoundingClientRect();
  // 宽屏避让左上方的面板；窄屏把路线放在面板下方，底部留给定位信息。
  return window.innerWidth >= 640
    ? [24, 96, (bounds?.right ?? 374) + 20, 24]
    : [(bounds?.bottom ?? 300) + 20, 100, 28, 28];
}

function normalizeHeading(value: number): number {
  return ((value % 360) + 360) % 360;
}

/** 高德地图与路线均使用 GCJ-02；原生 GPS 在 convertFrom 成功后才能作为路线起点。 */
export default function AmapLocationMap({
  apiKey, securityJsCode, latitude, longitude, accuracy,
  headingDegrees, headingAccuracy, headingTimestamp, headingSource, locationStatus, dark, gpsTimestamp, speedMps, rosConnected, onNavigationEvent,
}: AmapLocationMapProps): React.JSX.Element {
  const [sdkState, setSdkState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [mapMessage, setMapMessage] = useState('正在加载高德地图…');
  const [originReady, setOriginReady] = useState(false);
  const [destination, setDestination] = useState<MapCoordinate | null>(null);
  const [destinationName, setDestinationName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PlaceResult[]>([]);
  const [searchState, setSearchState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [searchMessage, setSearchMessage] = useState('');
  const [route, setRoute] = useState<RidingRoute | null>(null);
  const [routeState, setRouteState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [routeMessage, setRouteMessage] = useState('');
  const [following, setFollowing] = useState(true);
  const [navigationRoute, setNavigationRoute] = useState<NavigationRoute | null>(null);
  const [navigationActive, setNavigationActive] = useState(false);
  const [progress, setProgress] = useState<NavigationProgress | null>(null);
  const [clockNow, setClockNow] = useState(Date.now);
  const [transportMessage, setTransportMessage] = useState('');
  const [convertedFix, setConvertedFix] = useState<PositionSample | null>(null);
  const [estimate, setEstimate] = useState<EstimatedPosition | null>(null);
  const estimatorRef = useRef(new PositionEstimator());
  const estimationHeadingRef = useRef({ degrees: headingDegrees, timestamp: headingTimestamp });
  useEffect(() => {
    estimationHeadingRef.current = { degrees: headingDegrees, timestamp: headingTimestamp };
  }, [headingDegrees, headingTimestamp]);
  const converterRef = useRef<CoordinateConverter | null>(null);
  const activeRef = useRef(false);
  const navigationRouteRef = useRef<NavigationRoute | null>(null);
  const progressRef = useRef<NavigationProgress | null>(null);
  const eventCallbackRef = useRef(onNavigationEvent);
  const receiptSequence = useRef(0);
  useEffect(() => { eventCallbackRef.current = onNavigationEvent; }, [onNavigationEvent]);
  const publishEvent = useCallback((event: NavigationEvent): void => {
    const sequence = ++receiptSequence.current;
    void eventCallbackRef.current(event).then((receipt) => {
      if (sequence === receiptSequence.current) setTransportMessage(receipt.message);
    }).catch(() => {
      if (sequence === receiptSequence.current) setTransportMessage('数据接口暂时不可用，手机定位统计继续');
    });
  }, []);
  // 保留上次完整转换成功的采样；不能把旧位置与新时间戳拼接，也不能在转换期间误报无定位。
  const sample = latitude !== null && longitude !== null && gpsTimestamp !== null ? convertedFix : null;
  const currentEstimate = sample && estimate?.timestamp === sample.timestamp ? estimate : null;
  const displaySample = currentEstimate ?? sample;
  const displayProgress = estimatedProgress(navigationRoute, progress, sample, currentEstimate, clockNow);
  const isEstimated = !!currentEstimate && !!sample && (currentEstimate.position[0] !== sample.position[0]
    || currentEstimate.position[1] !== sample.position[1]);
  const status = makeNavigationStatus(navigationRoute, navigationActive ? 'tracking' : 'preview', displayProgress, displaySample, clockNow);

  useEffect(() => {
    const tick = (): void => {
      const now = Date.now();
      setClockNow(now);
      const heading = estimationHeadingRef.current;
      setEstimate(estimatorRef.current.update(sample, heading.degrees, heading.timestamp, now));
    };
    const timer = window.setInterval(tick, 200);
    return () => window.clearInterval(timer);
  }, [sample]);

  useEffect(() => {
    if (!navigationActive || !navigationRoute) return;
    const now = Date.now();
    let next = progressRef.current;
    if (next && sample) next = updateProgress(navigationRoute, next, sample, now);
    progressRef.current = next;
    setProgress(next);
    publishEvent({ kind: 'update', status: makeNavigationStatus(navigationRoute, 'tracking',
      estimatedProgress(navigationRoute, next, sample, currentEstimate, now), displaySample, now) });
  }, [navigationActive, navigationRoute, sample, clockNow, currentEstimate, displaySample, publishEvent]);

  const startNavigation = (): void => {
    if (!navigationRoute || !sample) { setRouteMessage('请等待手机定位更新后开始导航'); return; }
    try {
      const now = Date.now();
      const initial = startProgress(navigationRoute, sample, now);
      progressRef.current = initial;
      activeRef.current = true;
      setProgress(initial);
      setClockNow(now);
      setNavigationActive(true);
      setRouteMessage('');
      publishEvent({ kind: 'start', route: navigationRoute, status: makeNavigationStatus(navigationRoute, 'tracking', initial, sample, now) });
    } catch (error) {
      setRouteMessage(error instanceof Error ? error.message : '暂时无法开始导航');
    }
  };

  const stopNavigation = (): void => {
    activeRef.current = false;
    setNavigationActive(false);
    publishEvent({ kind: 'stop', status: makeNavigationStatus(navigationRoute, 'stopped', progressRef.current, sample, Date.now()) });
    progressRef.current = null;
    setProgress(null);
    setRouteMessage('');
  };
  const mapRef = useRef<AMapMap | null>(null);
  const markerRef = useRef<AMapMarker | null>(null);
  const accuracyCircleRef = useRef<AMapCircle | null>(null);
  const destinationMarkerRef = useRef<AMapMarker | null>(null);
  const amapRef = useRef<AMapNamespace | null>(null);
  const originRef = useRef<MapCoordinate | null>(null);
  const destinationRef = useRef<MapCoordinate | null>(null);
  const followingRef = useRef(true);
  const routeRequestRef = useRef<AbortController | null>(null);
  const searchRequestRef = useRef<AbortController | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const focusDestinationRef = useRef(false);
  const routeOverlaysRef = useRef<unknown[]>([]);
  const waypointMarkersRef = useRef<{ marker: AMapMarker; distanceAlongM: number }[]>([]);
  const passedAlongRef = useRef(-Infinity);
  const panelRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // 与下一航点的 +1 米阈值一致；本次导航已经通过的标记不因定位回退而恢复。
    if (!navigationActive) passedAlongRef.current = -Infinity;
    else if (displayProgress) passedAlongRef.current = Math.max(passedAlongRef.current, displayProgress.alongM + 1);
    for (const { marker, distanceAlongM } of waypointMarkersRef.current) {
      if (distanceAlongM <= passedAlongRef.current) marker.hide();
      else marker.show();
    }
  }, [navigationActive, navigationRoute, displayProgress]);

  useEffect(() => {
    if (sdkState !== 'ready' || !displaySample) return;
    markerRef.current?.setPosition(displaySample.position);
    accuracyCircleRef.current?.setCenter(displaySample.position);
    if (followingRef.current) mapRef.current?.setCenter(displaySample.position);
  }, [displaySample, sdkState]);

  const discardRoute = useCallback((): void => {
    routeRequestRef.current?.abort();
    routeRequestRef.current = null;
    if (routeOverlaysRef.current.length) mapRef.current?.remove(routeOverlaysRef.current);
    routeOverlaysRef.current = [];
    waypointMarkersRef.current = [];
    passedAlongRef.current = -Infinity;
    destinationMarkerRef.current?.show();
  }, []);

  const resetRoute = useCallback((): void => {
    discardRoute();
    if (navigationRouteRef.current) publishEvent({ kind: 'clear', status: makeNavigationStatus(null, 'cleared', null, null, Date.now()) });
    navigationRouteRef.current = null;
    activeRef.current = false;
    progressRef.current = null;
    setNavigationRoute(null);
    setNavigationActive(false);
    setProgress(null);
    setRoute(null);
    setRouteState('idle');
    setRouteMessage('');
  }, [discardRoute, publishEvent]);

  const resetSearch = useCallback((): void => {
    searchRequestRef.current?.abort();
    searchRequestRef.current = null;
    setSearchResults([]);
    setSearchState('idle');
    setSearchMessage('');
    setSearchQuery('');
  }, []);

  const chooseDestination = useCallback((position: MapCoordinate, name = '', focus = false): void => {
    const amap = amapRef.current;
    const map = mapRef.current;
    if (!amap || !map || activeRef.current) return;
    resetRoute();
    resetSearch();
    followingRef.current = false;
    setFollowing(false);
    destinationRef.current = position;
    focusDestinationRef.current = focus;
    setDestination(position);
    setDestinationName(name);
    setSearchQuery(name);
    searchInputRef.current?.blur();
    if (!destinationMarkerRef.current) {
      destinationMarkerRef.current = new amap.Marker({
        position, anchor: 'bottom-center', zIndex: 130,
        content: '<div class="destination-marker">终</div>',
      });
      map.add([destinationMarkerRef.current]);
    } else {
      destinationMarkerRef.current.setPosition(position);
      destinationMarkerRef.current.show();
    }
  }, [resetRoute, resetSearch]);

  useEffect(() => {
    if (!destination || !focusDestinationRef.current || !destinationMarkerRef.current) return;
    focusDestinationRef.current = false;
    mapRef.current?.setFitView([destinationMarkerRef.current], false, mapPadding(panelRef.current), 17);
  }, [destination]);

  useEffect(() => {
    let active = true;
    let instance: AMapMap | null = null;
    const stopFollowing = (): void => {
      followingRef.current = false;
      setFollowing(false);
    };
    const selectMapPoint = (event: MapEvent): void => {
      const position = mapCoordinate(event.lnglat);
      if (position) chooseDestination(position);
    };

    originRef.current = null;
    destinationRef.current = null;
    followingRef.current = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 外部地图实例重建时同步重置交互状态。
    setOriginReady(false);
    setDestination(null);
    setDestinationName('');
    setFollowing(true);
    resetRoute();
    resetSearch();
    if (!apiKey || !securityJsCode) {
      setSdkState('error');
      setMapMessage('缺少高德地图配置，请设置 EXPO_PUBLIC_AMAP_WEB_KEY 和安全密钥');
      return () => { active = false; };
    }

    setSdkState('loading');
    setMapMessage('正在加载高德地图…');
    void loadAmap(apiKey, securityJsCode).then((amap) => {
      if (!active) return;
      const map = new amap.Map('amap-container', {
        viewMode: '2D', zoom: 17, pitchEnable: false, rotateEnable: false,
      });
      instance = map;
      const marker = new amap.Marker({
        anchor: 'center', position: [0, 0], zIndex: 120,
        content: '<div class="vehicle-marker"><div class="vehicle-arrow"></div><div class="vehicle-center"></div></div>',
      });
      const accuracyCircle = new amap.Circle({
        center: [0, 0], radius: 0, strokeColor: '#1677ff', strokeOpacity: 0.75,
        strokeWeight: 1, fillColor: '#1677ff', fillOpacity: 0.14, zIndex: 20,
      });
      marker.hide();
      accuracyCircle.hide();
      map.add([accuracyCircle, marker]);
      amapRef.current = amap;
      mapRef.current = map;
      markerRef.current = marker;
      accuracyCircleRef.current = accuracyCircle;
      map.on('click', selectMapPoint);
      map.on('dragstart', stopFollowing);
      setSdkState('ready');
      setMapMessage('正在等待手机定位…');
    }).catch((error: unknown) => {
      if (!active) return;
      setSdkState('error');
      setMapMessage(error instanceof Error ? error.message : '高德地图初始化失败');
    });

    return () => {
      active = false;
      discardRoute();
      searchRequestRef.current?.abort();
      searchRequestRef.current = null;
      instance?.off('click', selectMapPoint);
      instance?.off('dragstart', stopFollowing);
      instance?.destroy();
      mapRef.current = null;
      markerRef.current = null;
      accuracyCircleRef.current = null;
      destinationMarkerRef.current = null;
      amapRef.current = null;
    };
  }, [apiKey, chooseDestination, discardRoute, resetRoute, resetSearch, securityJsCode]);

  // 外观切换不重建地图，保留已选终点和路线。
  useEffect(() => {
    mapRef.current?.setMapStyle(dark ? 'amap://styles/dark' : 'amap://styles/normal');
  }, [dark, sdkState]);

  useEffect(() => {
    markerRef.current?.setAngle(normalizeHeading(headingDegrees ?? 0));
  }, [headingDegrees, sdkState]);

  useEffect(() => {
    const amap = amapRef.current;
    const map = mapRef.current;
    const marker = markerRef.current;
    const accuracyCircle = accuracyCircleRef.current;
    if (sdkState !== 'ready' || !amap || !map || !marker || !accuracyCircle) return;
    const converter = new CoordinateConverter((position, done) => {
      amap.convertFrom(position, 'gps', (status, result) => {
        done(status === 'complete' && result.info === 'ok' ? mapCoordinate(result.locations?.[0]) : null);
      });
    }, (fix) => {
      originRef.current = fix.position;
      setConvertedFix(fix);
      setOriginReady(true);
      marker.setPosition(fix.position);
      marker.show();
      if (followingRef.current) map.setCenter(fix.position);
      if (fix.accuracyM !== null && Number.isFinite(fix.accuracyM) && fix.accuracyM > 0) {
        accuracyCircle.setCenter(fix.position);
        accuracyCircle.setRadius(fix.accuracyM);
        accuracyCircle.show();
      } else accuracyCircle.hide();
      setMapMessage('');
    }, () => {
      setMapMessage('GPS 坐标转换暂未成功，正在等待下一次定位转换');
    });
    converterRef.current = converter;
    return () => {
      converter.dispose();
      if (converterRef.current === converter) converterRef.current = null;
    };
  }, [sdkState]);

  useEffect(() => {
    if (latitude === null || longitude === null || gpsTimestamp === null || !mapCoordinate([longitude, latitude])) return;
    converterRef.current?.submit({ position: [longitude, latitude], timestamp: gpsTimestamp, accuracyM: accuracy, speedMps });
  }, [accuracy, gpsTimestamp, latitude, longitude, sdkState, speedMps]);

  const fitRoute = useCallback((): void => {
    const overlays = routeOverlaysRef.current;
    if (!overlays.length) return;
    followingRef.current = false;
    setFollowing(false);
    mapRef.current?.setFitView(
      destinationMarkerRef.current ? [...overlays, destinationMarkerRef.current] : overlays,
      false, mapPadding(panelRef.current), 18,
    );
  }, []);

  const searchDestination = async (): Promise<void> => {
    const amap = amapRef.current;
    const map = mapRef.current;
    const keyword = searchQuery.trim();
    if (!amap || !map || !keyword) return;
    searchRequestRef.current?.abort();
    const controller = new AbortController();
    searchRequestRef.current = controller;
    setSearchResults([]);
    setSearchMessage('');
    setSearchState('loading');
    searchInputRef.current?.blur();
    try {
      const places = await searchPlaces(amap, keyword, controller.signal);
      if (controller.signal.aborted || mapRef.current !== map) return;
      setSearchResults(places);
      setSearchState('ready');
      setSearchMessage(places.length ? '选择一个地点作为终点' : '未找到可选地点，请加上城市名或换一个关键词');
    } catch (error) {
      if (controller.signal.aborted || mapRef.current !== map) return;
      setSearchState('error');
      setSearchMessage(error instanceof Error ? error.message : '地点搜索失败，请重试');
    } finally {
      if (searchRequestRef.current === controller) searchRequestRef.current = null;
    }
  };

  const planRoute = async (): Promise<void> => {
    const origin = originRef.current;
    const target = destinationRef.current;
    const amap = amapRef.current;
    const map = mapRef.current;
    if (!origin || !target || !amap || !map || activeRef.current) return;
    resetRoute();
    const controller = new AbortController();
    routeRequestRef.current = controller;
    followingRef.current = false;
    setFollowing(false);
    setRouteState('loading');
    try {
      const planned = await requestRidingRoute(amap, [...origin], [...target], controller.signal);
      if (controller.signal.aborted || mapRef.current !== map) return;
      const now = Date.now();
      const sampled = buildNavigationRoute(planned.path, planned.distance, planned.duration,
        `route-${now}-${Math.random().toString(36).slice(2, 9)}`, now);
      const waypointMarkers = sampled.waypoints.slice(1, -1).map((point) => new amap.Marker({
        position: point.position, anchor: 'center', zIndex: 90,
        content: `<div class="waypoint-marker">${point.index + 1}</div>`,
        title: `航点 ${point.index + 1}`,
      }));
      const line = new amap.Polyline({
        path: planned.path, isOutline: true, outlineColor: '#ffffff', borderWeight: 2,
        strokeWeight: 6, strokeColor: '#1677ff', strokeOpacity: 0.95,
        lineJoin: 'round', lineCap: 'round', showDir: true, zIndex: 60,
      });
      const start = new amap.Marker({
        position: origin, anchor: 'bottom-center', zIndex: 110,
        content: '<div class="start-marker">起</div>',
      });
      routeOverlaysRef.current = [line, ...waypointMarkers, start];
      waypointMarkersRef.current = [
        { marker: start, distanceAlongM: 0 },
        ...waypointMarkers.map((marker, index) => ({
          marker, distanceAlongM: sampled.waypoints[index + 1].distanceAlongM,
        })),
        ...(destinationMarkerRef.current
          ? [{ marker: destinationMarkerRef.current, distanceAlongM: sampled.geometryLengthM }]
          : []),
      ];
      map.add(routeOverlaysRef.current);
      navigationRouteRef.current = sampled;
      setNavigationRoute(sampled);
      setClockNow(now);
      publishEvent({ kind: 'route', route: sampled, status: makeNavigationStatus(sampled, 'preview', null, sample, now) });
      setRoute(planned);
      setRouteState('ready');
    } catch (error) {
      if (controller.signal.aborted || mapRef.current !== map) return;
      setRouteState('error');
      setRouteMessage(error instanceof Error ? error.message : '路线查询失败，请重试');
    } finally {
      if (routeRequestRef.current === controller) routeRequestRef.current = null;
    }
  };

  // 等结果卡片完成布局后再避让，防止路线端点被顶部卡片遮挡。
  useEffect(() => {
    if (!route) return;
    fitRoute();
    window.addEventListener('resize', fitRoute);
    return () => window.removeEventListener('resize', fitRoute);
  }, [fitRoute, route, navigationActive]);

  const clearDestination = (): void => {
    resetRoute();
    resetSearch();
    setDestinationName('');
    destinationRef.current = null;
    setDestination(null);
    destinationMarkerRef.current?.hide();
  };

  const recenter = (): void => {
    if (!originRef.current) return;
    followingRef.current = true;
    setFollowing(true);
    mapRef.current?.setCenter(displaySample?.position ?? originRef.current);
  };

  const currentHeading = headingDegrees !== null && Number.isFinite(headingDegrees) && headingTimestamp !== null
    && clockNow - headingTimestamp <= 10000 && clockNow - headingTimestamp >= -2000 ? normalizeHeading(headingDegrees) : null;
  const angleText = (angle: number | null): string => angle === null ? '—' : `${(Math.round(angle) % 360)}°`;
  const headingText = headingDegrees === null ? '方向等待中' : `${normalizeHeading(headingDegrees).toFixed(0)}°`;
  const precisionText = accuracy === null ? 'GPS 精度未知' : `GPS ±${accuracy.toFixed(0)} m`;
  const compassText = headingAccuracy === null ? '' : `指南针 ${headingAccuracy}/3`;
  const visibleMessage = sdkState === 'ready' && latitude === null ? locationStatus : mapMessage;
  const hasOrigin = originReady && latitude !== null && longitude !== null;
  const canPlan = sdkState === 'ready' && hasOrigin && destination !== null && routeState !== 'loading';

  return (
    <main className="map-shell">
      <style>{`
        * { box-sizing: border-box; }
        html, body, #root { width: 100%; height: 100%; margin: 0; overflow: hidden; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        button, input { font: inherit; cursor: pointer; touch-action: manipulation; }
        button:focus-visible, input:focus-visible { outline: 3px solid #66aaff; outline-offset: 3px; }
        button:disabled { opacity: .45; cursor: default; }
        .map-shell { --panel: ${dark ? 'rgba(15,24,34,.96)' : 'rgba(255,255,255,.97)'}; --text: ${dark ? '#f4f7fb' : '#15202b'}; --muted: ${dark ? '#afbdcc' : '#5b6878'}; --subtle: ${dark ? '#203146' : '#edf3fb'}; position: relative; width: 100%; height: 100%; color: var(--text); background: ${dark ? '#071018' : '#eef2f6'}; }
        #amap-container { position: absolute; inset: 0; }
        .vehicle-marker { position: relative; width: 48px; height: 48px; display: grid; place-items: center; filter: drop-shadow(0 2px 4px rgba(0,0,0,.38)); }
        .vehicle-arrow { position: absolute; top: 2px; width: 0; height: 0; border-left: 11px solid transparent; border-right: 11px solid transparent; border-bottom: 30px solid #1677ff; }
        .vehicle-center { position: absolute; left: 17px; top: 17px; width: 14px; height: 14px; border-radius: 50%; background: #fff; border: 4px solid #1677ff; }
        .destination-marker, .start-marker { display: grid; place-items: center; width: 34px; height: 38px; border: 2px solid #fff; border-radius: 16px 16px 16px 3px; color: #fff; background: #dc3749; font-size: 15px; font-weight: 700; box-shadow: 0 2px 7px #0004; }
        .waypoint-marker { display: grid; place-items: center; min-width: 23px; height: 23px; padding: 0 4px; border: 2px solid white; border-radius: 50%; color: white; background: #1265cf; font-size: 10px; font-weight: 700; box-shadow: 0 1px 5px #0004; }
        .navigation-metrics { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 6px; margin: 8px 0; }
        .navigation-metrics div { grid-column: span 2; background: var(--subtle); padding: 8px; border-radius: 10px; }
        .navigation-metrics dt { color: var(--muted); font-size: 11px; margin-bottom: 5px; }
        .navigation-metrics dd { margin: 0; font-size: 17px; font-weight: 700; font-variant-numeric: tabular-nums; white-space: nowrap; }
        .navigation-metrics .angle-metric { grid-column: span 3; }
        .navigation-metrics small { font-size: 10px; font-weight: 400; }
        .route-panel.navigating { max-width: 360px; padding: 12px; border-radius: 16px; }
        .navigating .route-header { margin-bottom: 5px; }
        .navigating .route-header h2 { font-size: 16px; }
        .navigating .route-caption { font-size: 11px; margin: 5px 0; }
        .navigating .route-actions { margin-top: 8px; }
        .navigating .map-message { margin-top: 6px; padding: 7px 9px; font-size: 11px; }
        .route-actions .stop-navigation { width: 100%; color: #fff; background: #ce354b; }
        .start-marker { background: #13875a; }
        .map-hud { position: absolute; bottom: max(14px, env(safe-area-inset-bottom)); left: 14px; right: 14px; display: flex; justify-content: center; pointer-events: none; }
        .map-hud-card { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px 10px; align-items: center; padding: 9px 13px; border-radius: 22px; background: var(--panel); box-shadow: 0 4px 18px #0002; font-size: 13px; font-variant-numeric: tabular-nums; }
        .heading { color: ${dark ? '#72b0ff' : '#1265cf'}; font-size: 16px; font-weight: 700; }
        .recenter { position: absolute; right: 14px; bottom: 72px; min-height: 48px; padding: 0 14px; border: 0; border-radius: 14px; background: var(--panel); color: var(--text); box-shadow: 0 3px 14px #0002; }
        .route-panel { position: absolute; left: 14px; right: 14px; top: max(14px, env(safe-area-inset-top)); max-width: 420px; max-height: min(60%, calc(100% - 140px)); overflow-y: auto; padding: 16px; border-radius: 20px; background: var(--panel); box-shadow: 0 8px 30px #0003; }
        .route-header { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 8px; }
        .route-header h2 { margin: 0; font-size: 18px; }
        .route-mode { font-size: 12px; padding: 5px 9px; border-radius: 12px; color: ${dark ? '#9dc7ff' : '#165da8'}; background: var(--subtle); }
        .route-caption { margin: 8px 0; color: var(--muted); font-size: 13px; line-height: 1.5; }
        .destination { margin: 10px 0; font-size: 14px; overflow-wrap: anywhere; }
        .route-summary { display: flex; flex-wrap: wrap; gap: 8px 18px; align-items: baseline; margin: 12px 0 4px; font-variant-numeric: tabular-nums; }
        .route-summary strong { font-size: 26px; }
        .route-summary span { font-size: 16px; }
        .route-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
        .route-actions button { min-height: 48px; padding: 10px 14px; border: 0; border-radius: 12px; font-weight: 600; }
        .primary { flex: 1; color: #fff; background: #1265cf; }
        .secondary { color: var(--text); background: var(--subtle); }
        .map-message, .route-error { margin: 10px 0 0; padding: 10px 12px; border-radius: 10px; font-size: 13px; line-height: 1.5; background: var(--subtle); overflow-wrap: anywhere; }
        .route-error { color: ${dark ? '#ffb7b7' : '#ac2032'}; }
        .place-search { display: flex; gap: 8px; margin: 12px 0 8px; }
        .place-search input { flex: 1; min-width: 0; min-height: 48px; padding: 10px 12px; border: 1px solid ${dark ? '#46566a' : '#cbd6e3'}; border-radius: 12px; background: var(--subtle); color: var(--text); font-size: 16px; }
        .place-search input::placeholder { color: var(--muted); }
        .search-submit { min-width: 64px; min-height: 48px; border: 0; border-radius: 12px; color: #fff; background: #1265cf; padding: 8px 12px; }
        .search-status { margin: 6px 0; color: var(--muted); font-size: 13px; line-height: 1.5; }
        .search-status[role="alert"] { color: ${dark ? '#ffb7b7' : '#ac2032'}; }
        .search-results { margin: 8px 0; padding: 0; list-style: none; max-height: 200px; overflow-y: auto; overscroll-behavior: contain; border-radius: 12px; background: var(--subtle); }
        .search-results li + li { border-top: 1px solid ${dark ? '#3b4959' : '#d6dfe9'}; }
        .place-result { display: block; width: 100%; min-height: 60px; padding: 11px 12px; border: 0; background: transparent; color: var(--text); text-align: left; }
        .place-result:hover { background: ${dark ? '#31465f' : '#dbeaff'}; }
        .place-result strong, .place-result small { display: block; overflow-wrap: anywhere; }
        .place-result strong { font-size: 14px; }
        .place-result small { margin-top: 4px; font-size: 12px; line-height: 1.4; color: var(--muted); }
        @media (min-width: 640px) {
          .route-panel { right: auto; width: min(360px, calc(100% - 28px)); max-height: calc(100% - 28px); padding: 14px; }
          .map-hud { left: 398px; }
        }
      `}</style>
      <div id="amap-container" aria-label="地图，轻点选择路线终点" />
      <div className="map-hud">
        <div className="map-hud-card">
          <span className="heading">{headingText}</span>
          <span>{precisionText}</span>
          {isEstimated ? <span>{sample && usableFix(sample, clockNow) ? '推算定位' : '推算已暂停，等待 GPS'}</span> : null}
          {compassText ? <span>{compassText}</span> : null}
        </div>
      </div>
      <button type="button" className="recenter" onClick={recenter} disabled={!hasOrigin} aria-pressed={following}>
        {following ? '正在跟随定位' : '回到当前位置'}
      </button>
      <section className={`route-panel${navigationActive ? ' navigating' : ''}`} ref={panelRef} aria-label="骑行路线规划">
        {navigationActive ? <>
          <div className="route-header"><h2>导航中</h2><span className="route-mode">自行车</span></div>
          <p className="route-caption">手机 GPS 统计 · {navigationRoute?.waypoints.length ?? 0} 个航点</p>
          <dl className="navigation-metrics">
            <div><dt>已行驶距离</dt><dd data-testid="travelled">{formatRouteDistance(status.travelledM)}</dd></div>
            <div><dt>{status.fixState === 'off_route' ? '剩余距离（估算）' : '剩余距离'}</dt><dd data-testid="remaining">{status.remainingM === null ? '—' : formatRouteDistance(status.remainingM)}</dd></div>
            <div className="speed-metric"><dt>当前速度</dt><dd data-testid="speed">{status.speedMps === null ? '—' : (status.speedMps * 3.6).toFixed(1)} <small>km/h</small></dd></div>
            <div className="angle-metric"><dt>当前航向{headingSource === 'magnetic' ? '（磁北）' : ''}</dt><dd data-testid="current-heading">{angleText(currentHeading)}</dd></div>
            <div className="angle-metric"><dt>下一航点方向{status.nextWaypoint !== null ? ` · ${status.nextWaypoint + 1}号` : ''}</dt><dd data-testid="waypoint-heading">{angleText(status.nextWaypointBearingDegrees)}</dd></div>
          </dl>
          <p className="route-caption">北为 0° · 顺时针{status.nextWaypoint === null && status.fixState === 'fresh' ? ' · 已到路线末端' : ''}</p>
          {status.fixState !== 'fresh' ? <p className="map-message" role="status">{navigationFixMessage(status.fixState, sample, clockNow)}</p> : null}
          {visibleMessage ? <p className="map-message" role="status">{visibleMessage}</p> : null}
          <div className="route-actions"><button type="button" className="stop-navigation" onClick={stopNavigation}>停止导航</button></div>
        </> : <>
        <div className="route-header"><h2>路线规划</h2><span className="route-mode">自行车</span></div>
        <p className="route-caption">从当前位置出发，搜索目的地或轻点地图选终点。</p>
        <form className="place-search" role="search" onSubmit={(event) => { event.preventDefault(); void searchDestination(); }}>
          <input
            ref={searchInputRef}
            type="search"
            aria-label="搜索目的地"
            placeholder="搜索地点 / 地址，可加城市名"
            value={searchQuery}
            maxLength={100}
            enterKeyHint="search"
            autoComplete="off"
            onChange={(event) => { const value = event.target.value; resetSearch(); setSearchQuery(value); }}
          />
          <button className="search-submit" type="submit" disabled={sdkState !== 'ready' || !searchQuery.trim() || searchState === 'loading'}>
            {searchState === 'loading' ? '搜索中…' : '搜索'}
          </button>
        </form>
        {searchMessage ? <p className="search-status" role={searchState === 'error' ? 'alert' : 'status'}>{searchMessage}</p> : null}
        {searchResults.length ? <ul className="search-results" aria-label="搜索结果">
          {searchResults.map((place) => <li key={place.id}>
            <button type="button" className="place-result" onClick={() => chooseDestination(place.location, place.name, true)}>
              <strong>{place.name}</strong><small>{place.address || '点击在地图上查看并设为终点'}</small>
            </button>
          </li>)}
        </ul> : null}
        <p className="destination">{destination
          ? `终点：${destinationName || `${destination[0].toFixed(5)}, ${destination[1].toFixed(5)}`}`
          : '尚未选择终点。'}</p>
        {route ? <div aria-live="polite">
          <div className="route-summary"><strong>{formatRouteDistance(route.distance)}</strong><span>{formatRouteDuration(route.duration)}</span></div>
          <p className="route-caption">{navigationRoute?.waypoints.length ?? 0} 个道路航点 · 起终点已包含，转弯处保留航点。</p>
        </div> : null}
        {visibleMessage ? <p className="map-message" role="status">{visibleMessage}</p> : null}
        {routeMessage ? <p className="route-error" role="alert">{routeMessage}</p> : null}
        <div className="route-actions">
          {route ? <button type="button" className="primary" onClick={startNavigation} disabled={!sample || !usableFix(sample, clockNow)}>开始导航</button> : null}
          <button type="button" className={route ? 'secondary' : 'primary'} onClick={() => void planRoute()} disabled={!canPlan}>
            {routeState === 'loading' ? '正在规划…' : routeState === 'error' ? '重试规划' : route ? '重新规划' : '规划路线'}
          </button>
          {route ? <button type="button" className="secondary" onClick={fitRoute}>全览</button> : null}
          {destination ? <button type="button" className="secondary" onClick={clearDestination}>清除</button> : null}
        </div>
        </>}
        {navigationRoute ? <p className="route-caption" role="status">{!rosConnected ? 'ROS 未连接 · 路线暂存在手机' : transportMessage || 'ROS 已连接 · 航点接口已启用'}</p> : null}
      </section>
    </main>
  );
}
