import { requireOptionalNativeModule } from 'expo-modules-core';

export type DiscoveredJetson = { address: string; port: number };

type JetsonDiscoveryNativeModule = {
  getWifiGatewayAddressAsync: () => Promise<string | null>;
  discoverJetsonAsync: () => Promise<DiscoveredJetson | null>;
};

// Expo Go 没有本地模块；独立 APK 会自动链接 Android 的网络发现实现。
const nativeModule = requireOptionalNativeModule<JetsonDiscoveryNativeModule>('JetsonDiscovery');

export const getWifiGatewayAddressAsync = (): Promise<string | null> =>
  nativeModule?.getWifiGatewayAddressAsync() ?? Promise.resolve(null);

export const discoverJetsonAsync = (): Promise<DiscoveredJetson | null> =>
  nativeModule?.discoverJetsonAsync() ?? Promise.resolve(null);
