const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

const diagnostics = {};
new Function('exports', ts.transpileModule(readFileSync(`${__dirname}/amap-webview-diagnostics.ts`, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText)(diagnostics);

function page() {
  const listeners = new Map();
  const messages = [];
  const window = {
    ReactNativeWebView: { postMessage: (value) => messages.push(JSON.parse(value)) },
    addEventListener: (type, listener) => {
      const registered = listeners.get(type) || [];
      registered.push(listener);
      listeners.set(type, registered);
    },
  };
  const context = vm.createContext({ window });
  return {
    inject: () => vm.runInContext(diagnostics.AMAP_WEBVIEW_DIAGNOSTICS, context),
    emit: (type, event) => listeners.get(type)?.forEach((listener) => listener(event)),
    window, messages, listeners,
  };
}

test('DOM 入口执行失败、尚未挂载控件时，仍能把错误发送给原生页面', () => {
  const p = page();
  p.inject();
  // Expo 的 HTML 入口会同步读取此方法；缺失时 React 控件尚未开始渲染。
  let error;
  try { p.window.ReactNativeWebView.injectedObjectJson(); } catch (caught) { error = caught; }
  assert.ok(error);
  p.emit('error', { message: error.message });
  assert.equal(p.messages.length, 1);
  assert.equal(p.messages[0].type, 'amap-page-error');
  assert.match(p.messages[0].data, /injectedObjectJson/);
});

test('加载前和加载后注入不会重复注册监听，拒绝的 Promise 有可读错误', () => {
  const p = page();
  p.inject();
  p.inject();
  assert.equal(p.listeners.get('error').length, 1);
  p.emit('unhandledrejection', { reason: new Error('地图初始化失败') });
  assert.deepEqual(p.messages, [{ type: 'amap-page-error', data: '地图初始化失败' }]);
});

test('资源加载事件不遮住地图控件，超长错误截断后发送', () => {
  const p = page();
  p.inject();
  p.emit('error', { target: { src: 'https://example.invalid/map.js' } });
  assert.equal(p.messages.length, 0);
  p.emit('error', { message: 'x'.repeat(1000) });
  assert.equal(p.messages[0].data.length, 300);
});
