const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const ts = require('typescript');

const network = {
  NetworkStateType: { WIFI: 'WIFI', NONE: 'NONE' },
  getNetworkStateAsync: async () => ({ type: 'WIFI' }),
  getIpAddressAsync: async () => '192.168.1.25',
};
const native = {
  getWifiGatewayAddressAsync: async () => '192.168.1.1',
  discoverJetsonAsync: async () => null,
};
const compiled = ts.transpileModule(readFileSync(`${__dirname}/gateway-discovery.ts`, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const exported = {};
new Function('require', 'exports', compiled)((name) => {
  if (name === 'expo-network') return network;
  if (name === 'react-native') return { Platform: { OS: 'android' } };
  if (name === '@/modules/jetson-discovery') return native;
  throw new Error(`unexpected import: ${name}`);
}, exported);
const { discoverGateway, hotspotGatewayCandidate } = exported;

test('热点地址只作为候选；验证确为 Jetson 网关后才选中', async () => {
  assert.equal(hotspotGatewayCandidate('10.42.0.84'), '10.42.0.1:8080');
  assert.equal(hotspotGatewayCandidate('8.8.8.8'), null);
  native.getWifiGatewayAddressAsync = async () => '10.42.0.1';
  network.getIpAddressAsync = async () => '10.42.0.84';
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url) => ({
    ok: true,
    json: async () => ({ status: 'ok', capabilities: url.includes('10.42.0.1')
      ? ['password_auth', 'image_topics'] : [] }),
  });
  try {
    assert.equal(await discoverGateway(), '10.42.0.1:8080');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('同一路由器下忽略路由器，使用 Jetson 发布的 mDNS 地址', async () => {
  native.getWifiGatewayAddressAsync = async () => '192.168.1.1';
  native.discoverJetsonAsync = async () => ({ address: '192.168.1.120', port: 8080 });
  network.getIpAddressAsync = async () => '192.168.1.25';
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url) => ({
    ok: true,
    json: async () => ({ status: 'ok', capabilities: url.includes('192.168.1.120')
      ? ['password_auth', 'image_topics'] : [] }),
  });
  try {
    assert.equal(await discoverGateway(), '192.168.1.120:8080');
  } finally {
    globalThis.fetch = originalFetch;
  }
});
