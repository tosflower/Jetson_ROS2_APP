const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const ts = require('typescript');

const compiled = ts.transpileModule(readFileSync(`${__dirname}/connectionStatus.ts`, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
const exported = {};
new Function('exports', compiled)(exported);
const { closeStatusTarget } = exported;

test('图像流关闭不应把仍可使用的网关控制连接标记为断开', () => {
  assert.equal(closeStatusTarget('image'), 'image');
  assert.equal(closeStatusTarget('gateway'), 'gateway');
});
