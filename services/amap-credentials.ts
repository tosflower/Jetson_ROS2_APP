import * as SecureStore from 'expo-secure-store';

const WEB_KEY_STORAGE = 'amap-web-js-key';
const SECURITY_CODE_STORAGE = 'amap-web-js-security-code';
// 默认随 App 分发，首次安装无需手动填写高德 Web JS API 凭据。
const DEFAULT_WEB_KEY = '5b8765510c5219d7175ebd03d751786e';
const DEFAULT_SECURITY_CODE = 'fa4c6953a6c8d7a5d5b8e7187bdd5e37';

declare const process: {
  env: {
    EXPO_PUBLIC_AMAP_WEB_KEY?: string;
    EXPO_PUBLIC_AMAP_SECURITY_JS_CODE?: string;
  };
};

export type AmapCredentials = { apiKey: string; securityJsCode: string };

/** 本机配置优先，环境变量用于预配置安装包。 */
export async function loadAmapCredentials(): Promise<AmapCredentials> {
  const [storedKey, storedCode] = await Promise.all([
    SecureStore.getItemAsync(WEB_KEY_STORAGE).catch(() => null),
    SecureStore.getItemAsync(SECURITY_CODE_STORAGE).catch(() => null),
  ]);
  return {
    apiKey: storedKey?.trim() || process.env.EXPO_PUBLIC_AMAP_WEB_KEY?.trim() || DEFAULT_WEB_KEY,
    securityJsCode: storedCode?.trim() || process.env.EXPO_PUBLIC_AMAP_SECURITY_JS_CODE?.trim() || DEFAULT_SECURITY_CODE,
  };
}

export async function saveAmapCredentials(credentials: AmapCredentials): Promise<void> {
  const apiKey = credentials.apiKey.trim();
  const securityJsCode = credentials.securityJsCode.trim();
  if (!apiKey || !securityJsCode) throw new Error('请填写高德 Web JS API Key 和安全密钥');
  await Promise.all([
    SecureStore.setItemAsync(WEB_KEY_STORAGE, apiKey),
    SecureStore.setItemAsync(SECURITY_CODE_STORAGE, securityJsCode),
  ]);
}
