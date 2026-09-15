const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const ts = require('typescript');

const compiled = ts.transpileModule(readFileSync(`${__dirname}/history.ts`, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const exported = {};
new Function('exports', compiled)(exported);

test('传感器终端历史只保留最近的有界记录', () => {
  let history = [];
  for (let id = 1; id <= 5; id += 1) {
    history = exported.appendBoundedHistory(history, { id, publishedAt: id, data: `${id}` }, 3);
  }
  assert.deepEqual(history.map((entry) => entry.id), [3, 4, 5]);
  assert.deepEqual(exported.appendBoundedHistory(history, { id: 6 }, 0), []);
});
