/* bench-filter widget: filter the App. D benchmark table beside it.
   On problems/evaluations.html#benchmarks; rows come from the table named in
   data-table, maths in lab/bench-filter.js. */
(function () {
  var H = window.AIToolsWidgets, L = window.BenchFilter;
  if (!H || !L) return;
  var SEL = [['ctx', 'Contextualization', ['Simple', 'Rich']], ['tp', 'Transmission principles', ['Simple', 'Complex']],
    ['amb', 'Ambiguity', ['No', 'Implicit', 'Explicit']], ['real', 'Realism includes', ['Grounded', 'Synthetic', 'Real']]];
  var MOD = ['Text', 'Image', 'Multi-turn', 'Tool use', 'Video', 'Audio'];
  var PRE = {
    all: {}, hard: { tp: 'Complex', amb: 'Explicit' }, real: { real: 'Real' },
    img: { mod: ['Image'] }, av: { mod: ['Video'] }, agent: { mod: ['Multi-turn', 'Tool use'] }
  };
  H.register('bench-filter', function (el) {
    var table = document.getElementById(el.getAttribute('data-table'));
    if (!table) throw new Error('bench-filter: no table');
    var trs = [].slice.call(table.querySelectorAll('tr')).filter(function (tr) { return tr.querySelector('td'); });
    var rows = L.toRows(trs.map(function (tr) { return [].map.call(tr.querySelectorAll('td'), function (td) { return td.textContent; }); }));
    var p = 'bf' + H.uid();
    el.innerHTML = H.presets([['all', 'All 16'], ['hard', 'Complex TPs + explicit ambiguity'], ['real', 'Real data'],
      ['img', 'Images'], ['av', 'Video'], ['agent', 'Multi-turn tool use']]) +
      '<div class="bf-ctl">' + SEL.map(function (s) {
        return '<label>' + s[1] + '<select id="' + p + '-' + s[0] + '"><option value="">any</option>' +
          s[2].map(function (v) { return '<option>' + v + '</option>'; }).join('') + '</select></label>';
      }).join('') + '</div>' +
      '<fieldset class="bf-mod"><legend>Modality must include</legend>' + MOD.map(function (m, i) {
        return '<label><input type="checkbox" id="' + p + '-m' + i + '" value="' + m + '"> ' + m + '</label>';
      }).join('') + '</fieldset>' +
      '<div class="statgrid">' + H.stat('benchmarks left', p + '-n') + H.stat('of the 16', p + '-pc') + '</div>' +
      H.sum(p + '-sum');
    var sel = {}; SEL.forEach(function (s) { sel[s[0]] = H.$(el, p + '-' + s[0]); });
    var boxes = MOD.map(function (m, i) { return H.$(el, p + '-m' + i); });
    function crit() {
      var c = { mod: boxes.filter(function (b) { return b.checked; }).map(function (b) { return b.value; }) };
      SEL.forEach(function (s) { c[s[0]] = sel[s[0]].value; });
      return c;
    }
    function draw() {
      var c = crit(), hit = 0, names = [];
      rows.forEach(function (r, i) { var ok = L.match(r, c); trs[i].hidden = !ok; if (ok) { hit++; names.push(r.name.replace(/\s*\(.*$/, '')); } });
      H.$(el, p + '-n').textContent = hit;
      H.$(el, p + '-pc').innerHTML = H.pct(hit / rows.length);
      H.$(el, p + '-sum').textContent = hit + ' of ' + rows.length + ' benchmarks match' + (hit ? ': ' + names.join(', ') + '.' : '. The table below is empty.');
    }
    function preset(k) {
      var c = PRE[k]; if (!c) return;
      SEL.forEach(function (s) { sel[s[0]].value = c[s[0]] || ''; });
      boxes.forEach(function (b) { b.checked = (c.mod || []).indexOf(b.value) >= 0; });
      draw();
    }
    el.querySelectorAll('[data-p]').forEach(function (b) { b.addEventListener('click', function () { preset(b.getAttribute('data-p')); }); });
    SEL.forEach(function (s) { sel[s[0]].addEventListener('change', draw); });
    boxes.forEach(function (b) { b.addEventListener('change', draw); });
    el.labPreset = preset;
    draw();
  });
})();
