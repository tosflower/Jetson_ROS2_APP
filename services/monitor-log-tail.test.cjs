const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const ts = require('typescript');

// 用真实的快照追加函数验证重复轮询和有界尾部滚动。
const compiled = ts.transpileModule(readFileSync(`${__dirname}/monitor-log-tail.ts`, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const exported = {};
new Function('exports', compiled)(exported);
const { newLogTail } = exported;

test('重复快照不重复写入，新输出只追加变化部分', () => {
  assert.equal(newLogTail('第一行\n', '第一行\n'), '');
  assert.equal(newLogTail('第一行\n', '第一行\n第二行\n'), '第二行\n');
});

test('尾部截断后仍保留交叠并追加新行', () => {
  assert.equal(newLogTail('旧行\n中间行\n', '中间行\n新行\n'), '新行\n');
  assert.equal(newLogTail('旧输出', '完全不同'), '完全不同');
});
