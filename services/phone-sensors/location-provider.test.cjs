const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const ts = require('typescript');

// 执行真实 Provider，只替换系统定位边界和 React 调度；模拟无 GMS 的 Android 设备。
function device(os = 'android') {
  const slots = [], effects = [], intervals = new Map(), timeouts = new Map();
  let cursor = 0, timerId = 0, gpsCallback, nextCallback, nextError, disposed = 0;
  const published = [], advertised = [], unadvertised = [];
  const rosbridge = {
    connectionState: 'connected',
    advertiseTopic: (topic, type) => advertised.push({ topic, type }),
    unadvertiseTopic: (topic) => unadvertised.push(topic),
    publishTopic: (topic, message) => published.push({ topic, message }),
  };
  const equal = (a, b) => a && b && a.length === b.length && a.every((v, i) => v === b[i]);
  const react = {
    createContext: () => ({}), use: (context) => context.value,
    useRef: (value) => { const i = cursor++; return slots[i] ??= { current: value }; },
    useState: (value) => {
      const i = cursor++;
      slots[i] ??= { value };
      return [slots[i].value, (next) => { slots[i].value = typeof next === 'function' ? next(slots[i].value) : next; }];
    },
    useCallback: (callback, deps) => {
      const i = cursor++;
      if (!equal(slots[i]?.deps, deps)) slots[i] = { deps, callback };
      return slots[i].callback;
    },
    useEffect: (effect, deps) => {
      const i = cursor++;
      if (!equal(slots[i]?.deps, deps)) {
        const previous = slots[i];
        slots[i] = { deps };
        effects.push(() => { previous?.cleanup?.(); slots[i].cleanup = effect(); });
      }
    },
  };
  const legacy = {
    Accuracy: { High: 4 },
    hasServicesEnabledAsync: async () => true,
    getForegroundPermissionsAsync: async () => ({ granted: true }),
    watchPositionAsync: async (_options, callback) => {
      gpsCallback = callback;
      // 旧 Android 实现即使底层 GMS Task 失败，也可能先报告订阅成功，随后没有位置。
      return { remove: () => { disposed++; } };
    },
  };
  let resolveInitial;
  const next = {
    LocationProfile: { OTHER_NAVIGATION: 'otherNavigation', LOW_POWER: 'lowPower' },
    Location: {
      watchPosition: ({ onPosition, onError }) => {
        nextCallback = onPosition;
        nextError = onError;
        return { dispose: () => { disposed++; } };
      },
      getPosition: () => new Promise((resolve) => { resolveInitial = resolve; }),
    },
  };
  const root = path.resolve(__dirname, '../..');
  const cache = new Map();
  function load(filename) {
    if (cache.has(filename)) return cache.get(filename);
    const exports = {};
    cache.set(filename, exports);
    const requireMock = (id) => {
      if (id === 'react') return react;
      if (id === 'react/jsx-runtime') return { jsx: (type, props) => { type.value = props.value; return props.children; } };
      if (id === 'react-native') return { Platform: { OS: os }, AppState: { currentState: 'active', addEventListener: () => ({ remove() {} }) } };
      if (id === 'expo-location') return legacy;
      if (id === 'expo-location/next') return next;
      if (id === 'expo-sensors') return {};
      if (id === './rosbridge-provider') return { useRosbridge: () => rosbridge };
      if (id.startsWith('@/')) return load(path.join(root, `${id.slice(2)}.ts`));
      if (id.startsWith('.')) return load(path.resolve(path.dirname(filename), `${id}.ts`));
      throw new Error(`Unexpected dependency: ${id}`);
    };
    const compiled = ts.transpileModule(readFileSync(filename, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
    }).outputText;
    new Function('exports', 'require', 'setInterval', 'clearInterval', 'setTimeout', 'clearTimeout', compiled)(
      exports, requireMock,
      (fn) => { intervals.set(++timerId, fn); return timerId; }, (id) => intervals.delete(id),
      (fn, delay) => { timeouts.set(++timerId, { fn, delay }); return timerId; }, (id) => timeouts.delete(id),
    );
    return exports;
  }
  const provider = load(path.join(root, 'providers/phone-sensors-provider.tsx'));
  function render() {
    cursor = 0;
    provider.PhoneSensorsProvider({ children: null });
    effects.splice(0).forEach((effect) => effect());
    return provider.usePhoneSensors();
  }
  return {
    render, published, advertised, unadvertised, rosbridge, intervals, timeouts,
    emit: (position) => os === 'android' ? nextCallback?.(position) : gpsCallback?.(position),
    initial: (position) => resolveInitial?.(position),
    error: (message) => nextError?.({ code: 'UNAVAILABLE', message }),
    get disposed() { return disposed; },
    tick: () => intervals.forEach((fn) => fn()),
  };
}

const position = (timestamp = Date.now()) => ({
  coordinates: { latitude: 31.2, longitude: 121.5 }, timestamp,
  horizontalAccuracy: 8, altitude: null, verticalAccuracy: null,
  speed: 0, heading: null, mocked: false,
});
const flush = async () => { for (let i = 0; i < 12; i++) await Promise.resolve(); };

test('无 GMS 的 Android 仍将系统定位的首个位置送到地图和 ROS', async () => {
  const d = device();
  d.render().startGps();
  await flush();
  const fix = position();
  d.emit(fix);
  d.tick();
  const state = d.render();
  assert.equal(state.latestGps?.latitude, 31.2, '系统已有位置，但地图仍在等待首个定位');
  assert.equal(state.latestGps?.timestamp, fix.timestamp);
  assert.ok(d.published.some((message) => message.topic === '/phone/gps_data'));
  assert.ok(!d.published.some((message) => message.topic === '/phone/gps'), '不能把缺少海拔的网络位置伪造成 GPS 高度');
  state.stopGps();
  assert.equal(d.disposed, 1);
});

test('GPS 冷启动期间可先使用新鲜网络位置，旧缓存不能覆盖更新的定位', async () => {
  const d = device();
  d.render().startGps();
  await flush();
  const fix = { ...position(Date.now() - 1000), horizontalAccuracy: 150 };
  d.initial(fix);
  await flush();
  d.tick();
  assert.equal(d.render().latestGps?.accuracy, 150);
  const precise = { ...position(), horizontalAccuracy: 5 };
  d.emit(precise);
  d.emit(fix);
  d.tick();
  assert.equal(d.render().latestGps?.accuracy, 5);
  assert.equal(d.render().latestGps?.timestamp, precise.timestamp);
});

test('无首个位置时给出等待提示并继续监听，位置到达后恢复正常发布', async () => {
  const d = device();
  d.render().startGps();
  await flush();
  d.initial(position(Date.now() - 600000));
  await flush();
  d.tick();
  assert.equal(d.render().latestGps, null, '10 分钟前的缓存不能冒充当前位置');
  const watchdog = [...d.timeouts.values()].find((timer) => timer.delay === 15000);
  assert.ok(watchdog, '首次定位不能无限无提示等待');
  watchdog.fn();
  assert.match(d.render().gpsStatus, /尚未收到首个位置/);
  d.emit(position());
  d.tick();
  assert.equal(d.render().latestGps?.latitude, 31.2);
  assert.doesNotMatch(d.render().gpsStatus, /尚未收到首个位置/);
});

test('延迟返回的网络位置不能覆盖已收到的高精度新位置', async () => {
  const d = device();
  d.render().startGps();
  await flush();
  const live = { ...position(), horizontalAccuracy: 4 };
  d.emit(live);
  d.initial({ ...position(live.timestamp - 1000), horizontalAccuracy: 200 });
  await flush();
  d.tick();
  assert.equal(d.render().latestGps?.accuracy, 4);
  assert.equal(d.render().latestGps?.timestamp, live.timestamp);
});

test('停止定位后忽略迟到的起始位置和监听回调，并释放监听和计时器', async () => {
  const d = device();
  d.render().startGps();
  await flush();
  d.render().stopGps();
  d.initial(position());
  d.emit(position());
  await flush();
  d.tick();
  assert.equal(d.render().latestGps, null);
  assert.equal(d.disposed, 1);
  assert.equal(d.intervals.size, 0);
  assert.equal(d.timeouts.size, 0);
});

test('定位服务运行期间的错误可见，后续位置仍可恢复', async () => {
  const d = device();
  d.render().startGps();
  await flush();
  d.error('系统暂时没有可用位置');
  assert.match(d.render().gpsStatus, /系统暂时没有可用位置/);
  d.emit(position());
  d.tick();
  assert.equal(d.render().latestGps?.latitude, 31.2);
});

test('iOS 保持原定位接口和数据格式', async () => {
  const d = device('ios');
  d.render().startGps();
  await flush();
  const fix = { timestamp: Date.now(), coords: { latitude: 31.2, longitude: 121.5, accuracy: 3, altitude: 20, altitudeAccuracy: 5, speed: 0 } };
  d.emit(fix);
  d.tick();
  assert.equal(d.render().latestGps?.latitude, 31.2);
  assert.ok(d.published.some((message) => message.topic === '/phone/gps'));
  d.render().stopGps();
  assert.equal(d.disposed, 1);
});

test('官方转换晚于新 GPS 到达时仍使用对应原始采样，原始话题不变', async () => {
  const d = device();
  d.render().startGps();
  await flush();
  const raw = position(Date.now() - 1000);
  d.emit(raw);
  d.tick();
  assert.ok(d.advertised.some(({ topic, type }) => topic === '/phone/gps_gcj02' && type === 'std_msgs/msg/String'));
  assert.ok(!d.published.some(({ topic }) => topic === '/phone/gps_gcj02'), '转换成功前不能发布原始坐标冒充 GCJ-02');
  d.emit({ ...position(), altitude: 25, horizontalAccuracy: 2 });
  d.tick();
  const fix = { position: [121.5045, 31.198], timestamp: raw.timestamp, accuracyM: 999, speedMps: 0 };
  await d.render().publishGcj02Location(fix);
  const converted = d.published.filter(({ topic }) => topic === '/phone/gps_gcj02');
  assert.equal(converted.length, 1);
  assert.deepEqual(JSON.parse(converted[0].message.data), {
    longitude: fix.position[0], latitude: fix.position[1], altitude: null,
    accuracy_m: 8, timestamp_ms: raw.timestamp, coordinate_system: 'GCJ-02',
    source_coordinate_system: 'WGS84', conversion_provider: 'AMap.convertFrom',
  });
  const original = JSON.parse(d.published.find(({ topic }) => topic === '/phone/gps_data').message.data);
  assert.equal(original.longitude, raw.coordinates.longitude);
  assert.equal(original.latitude, raw.coordinates.latitude);
});

test('转换结果断线时缓存，重连补发；旧结果和停止后的回调不再发布', async () => {
  const d = device();
  d.render().startGps();
  await flush();
  const raw = position();
  d.emit(raw);
  d.tick();
  const fix = { position: [121.5045, 31.198], timestamp: raw.timestamp, accuracyM: 8, speedMps: 0 };
  d.rosbridge.connectionState = 'disconnected';
  d.render();
  await d.render().publishGcj02Location(fix);
  assert.ok(!d.published.some(({ topic }) => topic === '/phone/gps_gcj02'));
  d.rosbridge.connectionState = 'connected';
  d.render();
  d.tick();
  const count = d.published.length;
  const packet = d.published.find(({ topic }) => topic === '/phone/gps_gcj02');
  assert.equal(JSON.parse(packet.message.data).timestamp_ms, raw.timestamp);
  await d.render().publishGcj02Location({ ...fix, timestamp: raw.timestamp - 1 });
  await d.render().publishGcj02Location(fix);
  assert.equal(d.published.length, count, '倒序和重复回调不能覆盖已转换结果');
  d.render().stopGps();
  await d.render().publishGcj02Location(fix);
  assert.equal(d.published.length, count);
  assert.ok(d.unadvertised.includes('/phone/gps_gcj02'));
  d.render().startGps();
  await flush();
  await d.render().publishGcj02Location(fix);
  assert.equal(d.published.length, count, '重新启动后不能复用上次采集的转换回调');
});
