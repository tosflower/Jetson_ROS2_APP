const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const ts = require('typescript');

const compiled = ts.transpileModule(readFileSync(`${__dirname}/protocol.ts`, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const exported = {};
new Function('exports', compiled)(exported);
const { normalizeRosbridgeUrl, parseRosbridgeMessage, parseRosbridgePublish, rosbridgeUrlFromGateway } = exported;

test('规范化 rosbridge 地址并从 Phone Gateway 地址推导独立端口', () => {
  assert.equal(normalizeRosbridgeUrl('10.42.0.1:9090'), 'ws://10.42.0.1:9090');
  assert.equal(normalizeRosbridgeUrl('wss://robot.local'), 'wss://robot.local:9090');
  assert.equal(rosbridgeUrlFromGateway('http://10.42.0.1:8080'), 'ws://10.42.0.1:9090');
  assert.throws(() => normalizeRosbridgeUrl('http://10.42.0.1:9090'), /ws:\/\/ 或 wss:\/\//);
});

test('只接受字段完整的 rosbridge publish 消息', () => {
  assert.deepEqual(parseRosbridgePublish('{"op":"publish","topic":"/phone/gps","msg":{"latitude":31.2}}'), {
    op: 'publish', topic: '/phone/gps', msg: { latitude: 31.2 },
  });
  assert.equal(parseRosbridgePublish('{bad json'), undefined);
  assert.equal(parseRosbridgePublish('{"op":"publish","topic":"/phone/gps"}'), undefined);
  assert.equal(parseRosbridgePublish(new Uint8Array()), undefined);
});

test('只接受带 id 的 Service 响应', () => {
  assert.deepEqual(parseRosbridgeMessage('{"op":"service_response","id":"service:1","result":true,"values":{"success":true}}'), {
    op: 'service_response',
    id: 'service:1',
    service: undefined,
    result: true,
    values: { success: true },
  });
  assert.equal(parseRosbridgeMessage('{"op":"service_response","values":{}}'), undefined);
  assert.equal(parseRosbridgeMessage('{"op":"service_response","id":"bad","result":"yes"}'), undefined);
});
