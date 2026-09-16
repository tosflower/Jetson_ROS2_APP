'use dom';

import { useEffect, useRef, useState } from 'react';

type AMapPosition = [number, number] | { lng: number; lat: number };

type AMapMap = {
  add: (overlays: unknown[]) => void;
  destroy: () => void;
  setCenter: (position: AMapPosition) => void;
};

type AMapMarker = {
  setAngle: (angle: number) => void;
  setPosition: (position: AMapPosition) => void;
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

type AMapNamespace = {
  Map: new (container: string, options: Record<string, unknown>) => AMapMap;
  Marker: new (options: Record<string, unknown>) => AMapMarker;
  Circle: new (options: Record<string, unknown>) => AMapCircle;
  convertFrom: (
    position: [number, number],
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
  headingDegrees: number | null;
  headingAccuracy: number | null;
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
    // 网络恢复后重新进入地图页时允许再次加载，不永久缓存失败结果。
    if (amapLoadPromise === currentPromise) amapLoadPromise = null;
  });
  return amapLoadPromise;
}

function normalizeHeading(value: number): number {
  return ((value % 360) + 360) % 360;
}

/** 高德 Web JS API 运行在 Expo DOM WebView 中，原生层只传入传感器快照。 */
export default function AmapLocationMap({
  apiKey,
  securityJsCode,
  latitude,
  longitude,
  accuracy,
  headingDegrees,
  headingAccuracy,
  locationStatus,
  dark,
}: AmapLocationMapProps): React.JSX.Element {
  const [sdkState, setSdkState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [mapMessage, setMapMessage] = useState('正在加载高德地图…');
  const mapRef = useRef<AMapMap | null>(null);
  const markerRef = useRef<AMapMarker | null>(null);
  const accuracyCircleRef = useRef<AMapCircle | null>(null);
  const amapRef = useRef<AMapNamespace | null>(null);
  const conversionSequenceRef = useRef(0);

  useEffect(() => {
    let active = true;
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
        viewMode: '2D',
        zoom: 17,
        pitchEnable: false,
        rotateEnable: false,
        mapStyle: dark ? 'amap://styles/dark' : 'amap://styles/normal',
      });
      const marker = new amap.Marker({
        anchor: 'center',
        position: [0, 0],
        zIndex: 120,
        content: '<div class="vehicle-marker"><div class="vehicle-arrow"></div><div class="vehicle-center"></div></div>',
      });
      const accuracyCircle = new amap.Circle({
        center: [0, 0],
        radius: 0,
        strokeColor: '#1677ff',
        strokeOpacity: 0.75,
        strokeWeight: 1,
        fillColor: '#1677ff',
        fillOpacity: 0.14,
        zIndex: 20,
      });
      marker.setAngle(0);
      accuracyCircle.hide();
      map.add([accuracyCircle, marker]);
      amapRef.current = amap;
      mapRef.current = map;
      markerRef.current = marker;
      accuracyCircleRef.current = accuracyCircle;
      setSdkState('ready');
      setMapMessage('正在等待手机定位…');
    }).catch((error: unknown) => {
      if (!active) return;
      setSdkState('error');
      setMapMessage(error instanceof Error ? error.message : '高德地图初始化失败');
    });

    return () => {
      active = false;
      conversionSequenceRef.current += 1;
      mapRef.current?.destroy();
      mapRef.current = null;
      markerRef.current = null;
      accuracyCircleRef.current = null;
      amapRef.current = null;
    };
  }, [apiKey, dark, securityJsCode]);

  useEffect(() => {
    markerRef.current?.setAngle(normalizeHeading(headingDegrees ?? 0));
  }, [headingDegrees, sdkState]);

  useEffect(() => {
    const amap = amapRef.current;
    const map = mapRef.current;
    const marker = markerRef.current;
    const accuracyCircle = accuracyCircleRef.current;
    if (
      sdkState !== 'ready'
      || !amap
      || !map
      || !marker
      || !accuracyCircle
      || latitude === null
      || longitude === null
    ) return;

    const sequence = ++conversionSequenceRef.current;
    amap.convertFrom([longitude, latitude], 'gps', (status, result) => {
      if (sequence !== conversionSequenceRef.current) return;
      const position = result.locations?.[0];
      if (status !== 'complete' || result.info !== 'ok' || !position) {
        setMapMessage('GPS 坐标转换失败，暂时无法更新地图位置');
        return;
      }
      marker.setPosition(position);
      marker.show();
      map.setCenter(position);
      if (accuracy !== null && Number.isFinite(accuracy) && accuracy > 0) {
        accuracyCircle.setCenter(position);
        accuracyCircle.setRadius(accuracy);
        accuracyCircle.show();
      } else {
        accuracyCircle.hide();
      }
      setMapMessage('');
    });
  }, [accuracy, latitude, longitude, sdkState]);

  const headingText = headingDegrees === null
    ? '方向等待中'
    : `${normalizeHeading(headingDegrees).toFixed(0)}°`;
  const precisionText = accuracy === null ? 'GPS 精度未知' : `GPS ±${accuracy.toFixed(0)} m`;
  const compassText = headingAccuracy === null ? '' : `指南针 ${headingAccuracy}/3`;
  const visibleMessage = sdkState === 'ready' && latitude === null ? locationStatus : mapMessage;

  return (
    <main className="map-shell">
      <style>{`
        * { box-sizing: border-box; }
        html, body, #root { width: 100%; height: 100%; margin: 0; overflow: hidden; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        .map-shell { position: relative; width: 100%; height: 100%; background: ${dark ? '#071018' : '#eef2f6'}; }
        #amap-container { position: absolute; inset: 0; }
        .vehicle-marker { position: relative; width: 48px; height: 48px; display: grid; place-items: center; filter: drop-shadow(0 2px 4px rgba(0,0,0,.38)); }
        .vehicle-arrow { position: absolute; top: 2px; width: 0; height: 0; border-left: 11px solid transparent; border-right: 11px solid transparent; border-bottom: 30px solid #1677ff; }
        .vehicle-center { position: absolute; left: 17px; top: 17px; width: 14px; height: 14px; border-radius: 50%; background: #fff; border: 4px solid #1677ff; }
        .map-hud { position: absolute; top: 14px; left: 14px; right: 14px; display: flex; justify-content: center; pointer-events: none; }
        .map-hud-card { display: flex; gap: 10px; align-items: center; padding: 9px 13px; border-radius: 999px; color: ${dark ? '#f4f7fb' : '#15202b'}; background: ${dark ? 'rgba(15,24,34,.88)' : 'rgba(255,255,255,.92)'}; box-shadow: 0 4px 18px rgba(0,0,0,.18); backdrop-filter: blur(12px); font-size: 13px; font-variant-numeric: tabular-nums; }
        .heading { color: #1677ff; font-size: 16px; font-weight: 700; }
        .message { position: absolute; left: 20px; right: 20px; bottom: 28px; padding: 12px 14px; border-radius: 12px; color: ${dark ? '#f4f7fb' : '#15202b'}; background: ${dark ? 'rgba(15,24,34,.9)' : 'rgba(255,255,255,.94)'}; box-shadow: 0 4px 18px rgba(0,0,0,.18); text-align: center; font-size: 14px; }
      `}</style>
      <div id="amap-container" />
      <div className="map-hud">
        <div className="map-hud-card">
          <span className="heading">{headingText}</span>
          <span>{precisionText}</span>
          {compassText ? <span>{compassText}</span> : null}
        </div>
      </div>
      {visibleMessage ? <div className="message">{visibleMessage}</div> : null}
    </main>
  );
}
