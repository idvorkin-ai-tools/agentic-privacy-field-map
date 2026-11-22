/* bench-filter: filter the 16-benchmark table on problems/evaluations.html#benchmarks
   (App. D Table 2, five of its columns). The rows are read from the page's own
   table, so the widget can only show what the page prints. Tested in
   tools/tests/bench-filter.test.js against the counts the page states. */
(function (root) {
  var COLS = ['name', 'ctx', 'tp', 'amb', 'real', 'mod'];
  // cells: one array of 6 strings per table row, in the table's column order.
  function toRows(cells) {
    return cells.map(function (c) {
      var r = {};
      COLS.forEach(function (k, i) { r[k] = String(c[i] || '').trim(); });
      return r;
    });
  }
  function tokens(s) { return s.toLowerCase().split(/;\s*/).map(function (x) { return x.trim(); }); }
  // crit: { ctx, tp, amb, real: '' for any or one value; mod: list of modalities that must all be present }.
  function match(r, c) {
    if (c.ctx && r.ctx !== c.ctx) return false;
    if (c.tp && r.tp !== c.tp) return false;
    if (c.amb && r.amb !== c.amb) return false;
    if (c.real && tokens(r.real).indexOf(c.real.toLowerCase()) < 0) return false;
    var m = tokens(r.mod);
    return (c.mod || []).every(function (x) { return m.indexOf(x.toLowerCase()) >= 0; });
  }
  function filter(rows, c) { return rows.filter(function (r) { return match(r, c || {}); }); }
  var api = { COLS: COLS, toRows: toRows, match: match, filter: filter };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.BenchFilter = api;
})(this);
