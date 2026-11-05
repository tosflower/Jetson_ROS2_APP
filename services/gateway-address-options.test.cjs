const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const ts = require('typescript');

// 使用生产地址规则验证默认开发板和自定义地址的实际连接目标。
const compiled = ts.transpileModule(readFileSync(`${__dirname}/gateway-address-options.ts`, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const exported = {};
new Function('exports', compiled)(exported);
const { DEFAULT_GATEWAY_ADDRESS, JETSON_GATEWAY_OPTIONS, normalizeGatewayHttpBase } = exported;

test('首次默认选择开发板 1，两个选项均使用网关端口', () => {
  assert.equal(DEFAULT_GATEWAY_ADDRESS, '10.42.0.1:8080');
  assert.equal(normalizeGatewayHttpBase(JETSON_GATEWAY_OPTIONS[1].address), 'http://192.168.50.1:8080');
});

test('自定义 IP 补齐 8080，显式端口保持不变', () => {
  assert.equal(normalizeGatewayHttpBase('192.168.1.22'), 'http://192.168.1.22:8080');
  assert.equal(normalizeGatewayHttpBase('http://192.168.1.22:9091/'), 'http://192.168.1.22:9091');
  assert.equal(normalizeGatewayHttpBase('https://jetson.local'), 'https://jetson.local');
});
