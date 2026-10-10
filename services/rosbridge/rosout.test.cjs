const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const ts = require('typescript');

const compiled = ts.transpileModule(readFileSync(`${__dirname}/rosout.ts`, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const rosout = {};
new Function('exports', compiled)(rosout);

test('手动启动的 ROS2 节点日志转成可读终端行', () => {
  const line = rosout.formatRosoutMessage({
    stamp: { sec: 10, nanosec: 500_000_000 }, level: 20,
    name: 'camera_node', msg: '相机已启动', file: 'camera.py', line: 12,
  });
  assert.match(line, /INFO.*camera_node.*相机已启动/);
  assert.equal(rosout.formatRosoutMessage({ name: 'camera_node' }), null);
});
