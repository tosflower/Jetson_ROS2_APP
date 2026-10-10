const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const ts = require('typescript');

// 直接执行生产状态逻辑，不依赖手机或额外测试框架。
const compiled = ts.transpileModule(readFileSync(`${__dirname}/frameBuffer.ts`, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
const exported = {};
new Function('exports', compiled)(exported);
const { initialFrameBuffer, reduceFrameBuffer: reduce } = exported;
const receive = (state, uri) => reduce(state, { type: 'receive', uri });
const loaded = (state) => reduce(state, { type: 'loaded', id: state.loading.id });

test('慢解码时保留可见帧和正在加载的帧，仅排队最新输入', () => {
  let state = loaded(receive(initialFrameBuffer, 'A'));
  const front = state.front;
  state = receive(state, 'B');
  const loading = state.loading;
  for (let i = 0; i < 1000; i++) state = receive(state, `frame-${i}`);
  assert.equal(state.front, front);
  assert.equal(state.loading, loading);
  assert.equal(state.pending, 'frame-999');
  state = loaded(state);
  assert.equal(state.front, loading);
  assert.equal(state.loading.uri, 'frame-999');
  assert.equal(state.pending, null);
  state = loaded(state);
  assert.equal(state.front.uri, 'frame-999');
  assert.equal(state.loading, null);
});

test('坏帧保留上一张成功图片，继续加载最新帧，忽略迟到回调', () => {
  let state = loaded(receive(initialFrameBuffer, 'A'));
  const front = state.front;
  state = receive(state, 'bad');
  const badId = state.loading.id;
  state = receive(state, 'C');
  state = reduce(state, { type: 'failed', id: badId });
  assert.equal(state.front, front);
  assert.equal(state.loading.uri, 'C');
  assert.equal(reduce(state, { type: 'loaded', id: badId }), state);
  assert.equal(loaded(state).front.uri, 'C');
});

test('首帧失败后可以恢复，相同画面不会重新加载', () => {
  let state = receive(initialFrameBuffer, 'bad');
  state = reduce(state, { type: 'failed', id: state.loading.id });
  assert.equal(state.front, null);
  state = loaded(receive(state, 'A'));
  assert.equal(receive(state, 'A'), state);
});

test('相同 JPEG 的不同帧仍保留独立计时标签，慢加载只保留最新标签', () => {
  let state = reduce(initialFrameBuffer, { type: 'receive', uri: 'same', tag: 1 });
  state = loaded(state);
  state = reduce(state, { type: 'receive', uri: 'same', tag: 2 });
  assert.equal(state.loading.tag, 2);
  state = reduce(state, { type: 'receive', uri: 'same', tag: 3 });
  state = reduce(state, { type: 'receive', uri: 'same', tag: 4 });
  state = loaded(state);
  assert.equal(state.front.tag, 2);
  assert.equal(state.loading.tag, 4);
  assert.equal(loaded(state).front.tag, 4);
});
