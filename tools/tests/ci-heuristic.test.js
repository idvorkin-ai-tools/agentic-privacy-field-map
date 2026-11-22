// node --test tools/tests
const test = require('node:test');
const assert = require('node:assert');
const L = require('../../lab/ci-heuristic.js');

test('Flow A conforms: appropriate, no evaluation (page table, #ci-tuple)', () => {
  const f = L.FLOWS.a;
  assert.strictEqual(f.kase, 1);
  assert.strictEqual(L.verdict(f.kase, f.evals).outcome, 'appropriate');
});
test('Flow B is a Case 3 gap that fails evaluation (page table, #ci-tuple)', () => {
  const f = L.FLOWS.b;
  assert.strictEqual(f.kase, 3);
  assert.match(L.CASES[3], /gap/);
  assert.doesNotMatch(L.CASES[3], /violation;/);
  assert.strictEqual(L.verdict(f.kase, f.evals).outcome, 'reject');
});
test('a practice must pass all three layers (#legitimacy)', () => {
  assert.strictEqual(L.verdict(2, ['pass', 'pass', 'pass']).outcome, 'accept');
  assert.strictEqual(L.verdict(3, ['pass', 'pass', 'pass']).outcome, 'accept');
  assert.strictEqual(L.verdict(2, ['pass', 'fail', 'pass']).outcome, 'reject');
});
test('anything unclear without a fail is ambiguous (step 5)', () => {
  assert.strictEqual(L.verdict(3, ['pass', 'unclear', 'pass']).outcome, 'ambiguous');
  assert.strictEqual(L.verdict(2, [null, null, null]).outcome, 'ambiguous');
  assert.match(L.verdict(2, []).text, /status quo/);
});
test('the flows match the table printed on the page', () => {
  const fs = require('node:fs'), path = require('node:path');
  const html = fs.readFileSync(path.join(__dirname, '../../concepts/contextual-integrity.html'), 'utf8');
  for (const k of ['a', 'b']) {
    const f = L.FLOWS[k];
    for (const v of [f.context, f.recipient, f.attribute, f.tp]) assert.ok(html.includes(v.replace(/'/g, "'")), v);
  }
});
