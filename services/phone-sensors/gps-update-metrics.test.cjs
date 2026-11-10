const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const ts = require('typescript');

const exportsForTest = {};
const compiled = ts.transpileModule(readFileSync(path.join(__dirname, 'gps-update-metrics.ts'), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
new Function('exports', compiled)(exportsForTest);
const { GpsUpdateMetrics } = exportsForTest;

test('完整周期使用上一条包龄配对，不误加本条新位置的到达包龄', () => {
  const metrics = new GpsUpdateMetrics();
  const first = metrics.record(100000, 100007, 1000);
  assert.equal(first.arrivalAgeMs, 7);
  assert.equal(first.updateCycleMs, null);
  const second = metrics.record(101000, 101022, 2015);
  assert.equal(second.callbackIntervalMs, 1015);
  assert.equal(second.arrivalAgeMs, 22);
  assert.equal(second.previousArrivalAgeMs, 7);
  assert.equal(second.updateCycleMs, 1022);
  const third = metrics.record(102000, 102003, 2996);
  assert.equal(third.updateCycleMs, 1003);
  assert.equal(third.previousArrivalAgeMs, 22);
  assert.equal(third.meanUpdateCycleMs, 1012.5);
  assert.equal(third.completedCycles, 2);
  // 没有下一条新位置时，读取历史结果不会计入尚未完成的尾部等待。
  assert.equal(second.meanUpdateCycleMs, 1022);
});

test('重复和倒序位置不增加周期数，也不移动上一次新定位的回调基线', () => {
  const metrics = new GpsUpdateMetrics();
  const first = metrics.record(100000, 100007, 1000);
  assert.equal(metrics.record(100000, 100500, 1493), first);
  assert.equal(metrics.record(99000, 100700, 1693), first);
  const second = metrics.record(101000, 101007, 2000);
  assert.equal(second.updateCycleMs, 1007);
  assert.equal(second.completedCycles, 1);
});

test('暂停后新建采集统计，不把停止期间的等待算成一个完整周期', () => {
  const beforePause = new GpsUpdateMetrics();
  beforePause.record(100000, 100007, 1000);
  beforePause.record(101000, 101007, 2000);
  const afterResume = new GpsUpdateMetrics();
  const first = afterResume.record(319000, 319007, 220000);
  assert.equal(first.updateCycleMs, null);
  assert.equal(first.meanUpdateCycleMs, null);
  assert.equal(first.completedCycles, 0);
});

test('缺失、未来位置时间及单调时钟倒退不会生成负数或伪造的周期', () => {
  const metrics = new GpsUpdateMetrics();
  metrics.record(100000, 100007, 1000);
  assert.equal(metrics.record(110000, 101000, 2000).arrivalAgeMs, null);
  assert.equal(metrics.record(102000, 102007, 3000).updateCycleMs, null);
  assert.equal(metrics.record(103000, 103007, 2000).updateCycleMs, null);
  assert.equal(metrics.record(NaN, 104000, 4000).arrivalAgeMs, null);
  assert.equal(metrics.record(0, 104000, 4000).arrivalAgeMs, null);
  const next = metrics.record(105000, 105007, 5000);
  assert.equal(next.completedCycles, 0);
  assert.equal(next.meanUpdateCycleMs, null);
});
