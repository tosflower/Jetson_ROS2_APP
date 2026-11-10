import { requireOptionalNativeModule } from 'expo-modules-core';

export type ProbeProvider = 'gps' | 'network';
export type ProbeSummary = { count: number; meanMs: number | null; minMs: number | null; maxMs: number | null };
export type ProbeMetrics = {
  callbackCount: number; newFixCount: number; duplicateCount: number; outOfOrderCount: number; invalidCount: number;
  firstCallbackMs: number | null; firstFreshFixMs: number | null;
  lastCallbackIntervalMs: number | null; lastSampleIntervalMs: number | null;
  lastCallbackAgeMs: number | null; currentAgeMs: number | null; silenceMs: number | null;
  callbackIntervals: ProbeSummary; sampleIntervals: ProbeSummary; callbackAges: ProbeSummary;
};
export type ProbeSnapshot = {
  id: number; createdAtMs: number; running: boolean; reason: string;
  device: string; apiLevel: number; gpsHardware: boolean; finePermission: boolean; coarsePermission: boolean;
  requestedIntervalMs: number; elapsedMs: number; satellitesSeen: number | null; satellitesUsed: number | null;
  providers: {
    provider: ProbeProvider; available: boolean; enabled: boolean; status: string; metrics: ProbeMetrics | null;
    lastFix: { latitude: number; longitude: number; actualProvider: string | null; accuracyM: number | null; sampleUnixMs: number } | null;
  }[];
  recentRows: string[]; logCount: number; droppedLogCount: number;
};

type ProbeNativeModule = {
  getStatusAsync(): Promise<ProbeSnapshot>;
  startAsync(providers: ProbeProvider[], intervalMs: number): Promise<ProbeSnapshot>;
  stopAsync(): Promise<ProbeSnapshot>;
  getLogAsync(): Promise<string>;
  addListener(event: 'onSnapshot', listener: (snapshot: ProbeSnapshot) => void): { remove(): void };
};

// 普通 Expo Go、iOS 和网页没有该 Android 模块；显示明确提示，不伪装成 GNSS 测试。
export const locationProbe = requireOptionalNativeModule<ProbeNativeModule>('LocationProbe');
