const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const ts = require('typescript');
const compiled = ts.transpileModule(readFileSync(`${__dirname}/latency.ts`, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
const exported = {};
new Function('exports', compiled)(exported);
const { LatencyTracker } = exported;

test('时钟偏移消除设备起点差异；过期或负估计不可显示为真实延迟', () => {
  const tracker = new LatencyTracker();
  assert.equal(tracker.network(1000, 0), undefined);
  // 服务器时钟领先 1000ms，双向各 10ms，服务处理 2ms。
  tracker.probe(100);
  tracker.pong(100, 1110, 1112, 122);
  assert.equal(tracker.network(1120, 130), 10);
  assert.equal(tracker.snapshot().clock_rtt_ms.latest, 20);
  assert.equal(tracker.network(2000, 130), undefined);
  assert.equal(tracker.network(17000, 17010), undefined);
});

test('忽略未发出的探测，选择窗口内最低 RTT，统计内存有界', () => {
  const tracker = new LatencyTracker();
  tracker.pong(100, 1110, 1112, 122);
  assert.deepEqual(tracker.snapshot(), {});
  tracker.probe(100);
  tracker.pong(100, 1110, 1112, 122);
  tracker.probe(200);
  tracker.pong(200, 1210, 1212, 302);
  assert.equal(tracker.network(1400, 410), 10);
  for (let i = 0; i < 400; i++) tracker.add({ jpeg_encode_ms: i });
  tracker.add({ jpeg_encode_ms: NaN, network_estimate_ms: -1 });
  assert.deepEqual(tracker.snapshot().jpeg_encode_ms,
    { count: 300, latest: 399, mean: 249.5, p95: 384, max: 399 });
});
