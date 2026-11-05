const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const ts = require('typescript');

const compiled = ts.transpileModule(readFileSync(`${__dirname}/../providers/gateway-provider.tsx`, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
}).outputText;

/** 执行真实 Provider 的 hooks、生命周期和 WebSocket 回调，不访问手机或网络。 */
function mountGateway() {
  const slots = [], effects = [], sockets = [], appListeners = new Set(), networkListeners = new Set();
  let cursor = 0, queued = false, disposed = false, now = 0, nextTimer = 0;
  const timers = new Map();
  const discovery = { result: '10.23.15.41:8080', calls: 0 };
  let output, Provider;
  const same = (a, b) => a && b && a.length === b.length && a.every((value, i) => Object.is(value, b[i]));
  const enqueue = () => {
    if (queued || disposed) return;
    queued = true;
    queueMicrotask(() => { queued = false; if (!disposed) render(); });
  };
  const React = {
    createContext: () => ({}),
    useState(initial) {
      const i = cursor++;
      if (!slots[i]) slots[i] = { value: typeof initial === 'function' ? initial() : initial };
      return [slots[i].value, (value) => {
        const next = typeof value === 'function' ? value(slots[i].value) : value;
        if (!Object.is(next, slots[i].value)) { slots[i].value = next; enqueue(); }
      }];
    },
    useRef(initial) {
      const i = cursor++;
      if (!slots[i]) slots[i] = { current: initial };
      return slots[i];
    },
    useCallback(callback, deps) {
      const i = cursor++;
      if (!slots[i] || !same(slots[i].deps, deps)) slots[i] = { value: callback, deps };
      return slots[i].value;
    },
    useEffect(callback, deps) {
      const i = cursor++;
      if (!slots[i] || !same(slots[i].deps, deps)) {
        const previous = slots[i];
        slots[i] = { deps, cleanup: previous?.cleanup };
        effects.push(() => { slots[i].cleanup?.(); slots[i].cleanup = callback(); });
      }
    },
  };
  class Socket {
    static OPEN = 1;
    static CLOSED = 3;
    constructor(url) { this.url = url; this.readyState = 0; this.sent = []; sockets.push(this); }
    send(value) { this.sent.push(JSON.parse(value)); }
    close() { this.readyState = 3; this.onclose?.({ code: 1000, reason: '' }); }
    open() { this.readyState = 1; this.onopen?.(); }
    ready() { this.onmessage?.({ data: JSON.stringify({ type: 'status', connection_ready: true }) }); }
    serverClose(code = 1006, reason = 'network lost') {
      this.readyState = 3; this.onclose?.({ code, reason });
    }
  }
  const setTimer = (callback, delay, interval = false) => {
    const id = ++nextTimer; timers.set(id, { callback, due: now + delay, interval, delay }); return id;
  };
  const imports = {
    react: { ...React, default: React },
    'react/jsx-runtime': { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) },
    'react-native': { AppState: { currentState: 'active', addEventListener: (_, callback) => {
      appListeners.add(callback); return { remove: () => appListeners.delete(callback) };
    } } },
    'expo-network': { addNetworkStateListener: (callback) => {
      networkListeners.add(callback); return { remove: () => networkListeners.delete(callback) };
    } },
    'expo-secure-store': { getItemAsync: async () => '10.23.15.41:8080', setItemAsync: async () => {} },
    '@/connectionStatus': { closeStatusTarget: value => value },
    '@/latency': { LatencyTracker: class { snapshot() { return {}; } probe() {} } },
    '@/services/gateway-discovery': { discoverGateway: async () => { discovery.calls++; return discovery.result; } },
    '@/services/gateway-address-options': { DEFAULT_GATEWAY_ADDRESS: '10.42.0.1:8080',
      normalizeGatewayHttpBase: value => value.startsWith('http') ? value : `http://${value}` },
  };
  const exports = {};
  new Function('require', 'exports', 'WebSocket', 'fetch', 'setTimeout', 'clearTimeout',
    'setInterval', 'clearInterval', 'process', 'performance', compiled)(
    name => { if (!(name in imports)) throw Error(`unexpected import ${name}`); return imports[name]; },
    exports, Socket, async url => ({ ok: true, json: async () => url.endsWith('/api/auth/login')
      ? { token: 'test-token' } : { status: 'ok', capabilities: ['commands', 'image_topics', 'password_auth'] } }),
    (fn, ms) => setTimer(fn, ms), id => timers.delete(id),
    (fn, ms) => setTimer(fn, ms, true), id => timers.delete(id), { env: {} }, { now: () => now },
  );
  Provider = exports.GatewayProvider;
  function render() {
    cursor = 0; output = Provider({ children: null }).props.value;
    while (effects.length) effects.shift()();
  }
  async function flush() { for (let i = 0; i < 12; i++) await Promise.resolve(); }
  render();
  return {
    sockets, discovery, get value() { return output; }, flush,
    async login(auto = true) {
      if (auto) await output.rediscoverGateway();
      await flush(); await output.checkGateway('test-password'); await flush();
      sockets.at(-1).open(); sockets.at(-1).ready(); await flush();
      assert.equal(output.authToken, 'test-token'); assert.equal(output.sessionReady, true);
    },
    async app(state) { appListeners.forEach(fn => fn(state)); await flush(); },
    async network() { networkListeners.forEach(fn => fn({ isConnected: true })); await flush(); },
    async advance(ms) {
      const end = now + ms;
      while (true) {
        const pending = [...timers.entries()].filter(([, value]) => value.due <= end)
          .sort((a, b) => a[1].due - b[1].due)[0];
        if (!pending) break;
        const [id, job] = pending; now = job.due;
        if (job.interval) job.due += job.delay; else timers.delete(id);
        job.callback(); await flush();
      }
      now = end; await flush();
    },
    dispose() { disposed = true; slots.forEach(slot => slot?.cleanup?.()); timers.clear(); },
  };
}

test('锁屏唤醒时查找暂时失败，仍保留登录并恢复同一网关', async () => {
  const app = mountGateway();
  try {
    await app.login();
    await app.app('background');
    app.discovery.result = null;
    app.sockets[0].serverClose();
    await app.app('active'); await app.advance(1000);
    assert.equal(app.value.authToken, 'test-token');
    assert.equal(app.value.sessionReady, true);
    assert.equal(app.discovery.calls, 1, '已登录时直接恢复旧地址，无需重新发现');
    assert.equal(app.sockets.length, 2);
    app.sockets[1].open(); app.sockets[1].ready(); await app.flush();
    assert.equal(app.value.gatewayState, '已连接');
    assert.deepEqual(app.sockets[1].sent[0], { type: 'auth', token: 'test-token' });
  } finally { app.dispose(); }
});

test('手动地址连接在网络断开后自动重连，显式断开取消重试', async () => {
  const app = mountGateway();
  try {
    await app.login(false);
    app.sockets[0].serverClose(); await app.advance(1000);
    assert.equal(app.sockets.length, 2);
    assert.equal(app.value.authToken, 'test-token');
    app.value.disconnect(); await app.advance(15000);
    assert.equal(app.sockets.length, 2);
  } finally { app.dispose(); }
});

test('主动重新查找失败不会清除已有登录令牌', async () => {
  const app = mountGateway();
  try {
    await app.login(); app.discovery.result = null;
    await app.value.rediscoverGateway(); await app.flush();
    assert.equal(app.value.authToken, 'test-token');
    assert.equal(app.value.sessionReady, true);
    assert.equal(app.sockets[0].readyState, 1);
  } finally { app.dispose(); }
});

test('仅明确的认证拒绝才要求重新输入密码；更换地址清除旧会话', async () => {
  const app = mountGateway();
  try {
    await app.login();
    app.sockets[0].serverClose(1008, '请先使用 Ubuntu 密码登录'); await app.flush();
    assert.equal(app.value.authToken, undefined);
    assert.equal(app.value.sessionReady, false);
    await app.advance(15000); assert.equal(app.sockets.length, 1);
    await app.login(false);
    app.value.setGatewayAddress('192.168.50.1:8080'); await app.flush();
    assert.equal(app.value.authToken, undefined);
    assert.equal(app.value.sessionReady, false);
  } finally { app.dispose(); }
});

test('持续离线满 60 秒才退出连接状态，令牌保留且仍继续恢复', async () => {
  const app = mountGateway();
  try {
    await app.login(false);
    app.sockets[0].serverClose();
    await app.advance(59999);
    assert.equal(app.value.sessionReady, true);
    assert.equal(app.value.gatewayState, '已连接');
    assert.equal(app.value.authToken, 'test-token');
    await app.advance(1);
    assert.equal(app.value.sessionReady, false);
    assert.equal(app.value.gatewayState, '未连接');
    assert.equal(app.value.authToken, 'test-token');
    await app.network();
    const socket = app.sockets.at(-1);
    socket.open(); socket.ready(); await app.flush();
    assert.equal(app.value.sessionReady, true);
    assert.equal(app.value.gatewayState, '已连接');
  } finally { app.dispose(); }
});

test('一分钟内恢复会取消离线判定，锁屏不会主动关闭连接', async () => {
  const app = mountGateway();
  try {
    await app.login(false);
    await app.app('background');
    assert.equal(app.sockets[0].readyState, 1);
    app.sockets[0].serverClose(); await app.advance(1000);
    app.sockets[1].open(); app.sockets[1].ready(); await app.flush();
    for (let i = 0; i < 35; i++) {
      app.sockets[1].onmessage({ data: JSON.stringify({ type: 'status', message: 'alive' }) });
      await app.advance(2000);
    }
    assert.equal(app.value.sessionReady, true);
    assert.equal(app.sockets.length, 2);
    assert.equal(app.value.authToken, 'test-token');
  } finally { app.dispose(); }
});

test('套接字仍为 OPEN 但没有回包时，从最后回包时刻累计 60 秒', async () => {
  const app = mountGateway();
  try {
    await app.login(false);
    await app.advance(59999);
    assert.equal(app.value.sessionReady, true);
    assert.equal(app.value.gatewayState, '已连接');
    await app.advance(1);
    assert.equal(app.value.sessionReady, false);
    assert.equal(app.value.authToken, 'test-token');
  } finally { app.dispose(); }
});
