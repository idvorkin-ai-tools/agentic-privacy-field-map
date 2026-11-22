// node --test tools/tests
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const L = require('../../lab/bench-filter.js');

const html = fs.readFileSync(path.join(__dirname, '../../problems/evaluations.html'), 'utf8');
const table = html.match(/<table[^>]*id="bench-table"[\s\S]*?<\/table>/)[0];
const cells = [...table.matchAll(/<tr>((?:<td>[\s\S]*?<\/td>)+)<\/tr>/g)].map((m) =>
  [...m[1].matchAll(/<td>([\s\S]*?)<\/td>/g)].map((c) => c[1].replace(/&amp;/g, '&')));
const rows = L.toRows(cells);
const n = (c) => L.filter(rows, c).length;

test('the table has the 16 benchmarks of App. D', () => assert.strictEqual(rows.length, 16));
test('"8 of the 16 as explicit ambiguity and 2 as implicit"', () => {
  assert.strictEqual(n({ amb: 'Explicit' }), 8);
  assert.strictEqual(n({ amb: 'Implicit' }), 2);
});
test('"Only PrivaCI-Bench uses real data"', () => {
  const r = L.filter(rows, { real: 'Real' });
  assert.deepStrictEqual(r.map((x) => x.name.split(' ')[0]), ['PrivaCI-Bench']);
});
test('"No benchmark covers video or audio"; image only in AgentDAM, MPCI-Bench and SPILLage', () => {
  assert.strictEqual(n({ mod: ['Video'] }), 0);
  assert.strictEqual(n({ mod: ['Audio'] }), 0);
  assert.deepStrictEqual(L.filter(rows, { mod: ['Image'] }).map((x) => x.name.split(' ')[0]), ['AgentDAM', 'MPCI-Bench', 'SPILLage']);
});
test('CIMemories row: Simple / Simple / No / Synthetic / Text', () => {
  const r = rows.find((x) => x.name.startsWith('CIMemories'));
  assert.deepStrictEqual([r.ctx, r.tp, r.amb, r.real, r.mod], ['Simple', 'Simple', 'No', 'Synthetic', 'Text']);
});
test('multi-turn agent benchmarks named in §10.2 limitation 3 all use tool use', () => {
  const names = L.filter(rows, { mod: ['Multi-turn', 'Tool use'] }).map((x) => x.name.split(' ')[0]);
  for (const b of ['PrivacyLens-Live', 'AgentDAM', 'PrivacyBench']) assert.ok(names.includes(b), b);
});
