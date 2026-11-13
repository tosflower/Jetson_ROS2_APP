/** 指定来源时直接使用系统 provider，避免自动融合导致来源不明确。 */
export type LocationMode = 'auto' | 'gnss' | 'network';

export const LOCATION_MODE_STORAGE_KEY = 'phone-location-mode';
export const LOCATION_MODE_LABELS: Record<LocationMode, string> = {
  auto: '默认自动', gnss: 'GNSS 优先', network: '网络定位优先',
};

export function isLocationMode(value: unknown): value is LocationMode {
  return value === 'auto' || value === 'gnss' || value === 'network';
}
