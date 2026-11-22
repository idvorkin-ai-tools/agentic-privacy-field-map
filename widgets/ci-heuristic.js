/* ci-heuristic widget: step one flow through the CI decision heuristic.
   Beside concepts/contextual-integrity.html#heuristic. Rules: lab/ci-heuristic.js. */
(function () {
  var H = window.AIToolsWidgets, L = window.CIHeuristic;
  if (!H || !L) return;
  var EV = [['I', 'Interests of the parties'], ['II', 'Moral and political principles'], ['III', "The context's own purposes"]];
  H.register('ci-heuristic', function (el) {
    var p = 'ch' + H.uid(), st = { flow: 'a', kase: 1, evals: [null, null, null] };
    var cases = [1, 2, 3].map(function (k) {
      return '<label class="ch-opt"><input type="radio" name="' + p + '-case" value="' + k + '"> <b>Case ' + k + '</b> ' + L.CASES[k] + '</label>';
    }).join('');
    var evs = EV.map(function (e, i) {
      return '<label class="ch-ev"><span>' + e[0] + '. ' + e[1] + '</span><select id="' + p + '-e' + i + '">' +
        '<option value="">choose</option><option value="pass">passes</option><option value="fail">fails</option><option value="unclear">unclear</option></select></label>';
    }).join('');
    el.innerHTML = H.presets([['a', 'Flow A'], ['b', 'Flow B']]) +
      '<div class="ch-step"><b>1&ndash;2. Describe the flow and its context</b><dl class="ch-tuple" id="' + p + '-t"></dl></div>' +
      '<fieldset class="ch-step"><legend>3. Compare with the norms</legend>' + cases + '</fieldset>' +
      '<fieldset class="ch-step" id="' + p + '-ev"><legend>4. Evaluate (Case 2 or 3 only)</legend>' + evs + '</fieldset>' +
      '<svg class="dg" viewBox="0 0 360 96" role="img" aria-label="Path through the heuristic" id="' + p + '-svg"></svg>' +
      H.sum(p + '-sum');
    var t = H.$(el, p + '-t'), svg = H.$(el, p + '-svg'), evBox = H.$(el, p + '-ev');
    var radios = el.querySelectorAll('input[name="' + p + '-case"]');
    var sels = [0, 1, 2].map(function (i) { return H.$(el, p + '-e' + i); });
    function box(x, y, w, label, on, cls) {
      return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="26" rx="6" class="' + (on ? cls : 'box') + '"/>' +
        H.t(x + w / 2, y + 17, label, on ? 't-ink' : 't-dim', 'font-size="11" text-anchor="middle"');
    }
    function draw() {
      var f = L.FLOWS[st.flow], v = L.verdict(st.kase, st.evals), ev = st.kase !== 1;
      // Off the preset, the verdict is the reader's, not the page's: say so.
      var mine = st.kase !== f.kase || st.evals.some(function (x, i) { return x !== f.evals[i]; });
      var name = mine ? 'What-if (your choices, not the page\'s verdict on ' + f.label.split(':')[0] + ')' : f.label;
      t.innerHTML = [['Context', f.context], ['Sender', f.sender], ['Recipient', f.recipient], ['Subject', f.subject],
        ['Attribute', f.attribute], ['Transmission principle', f.tp]].map(function (r) {
        return '<dt>' + r[0] + '</dt><dd>' + r[1] + '</dd>';
      }).join('');
      radios.forEach(function (r) { r.checked = +r.value === st.kase; });
      sels.forEach(function (s, i) { s.value = st.evals[i] || ''; s.disabled = !ev; });
      evBox.classList.toggle('ch-off', !ev);
      var o = v.outcome;
      svg.innerHTML =
        box(4, 8, 66, 'Case ' + st.kase, true, st.kase === 1 ? 'box-ok' : st.kase === 2 ? 'box-crit' : 'box-off') +
        '<path d="M70 21h16" class="ln"/>' +
        box(86, 8, 114, 'Evaluate I&ndash;III', ev, 'box-def') +
        '<path d="M200 21h16" class="ln"/>' +
        box(216, 8, 140, o === 'appropriate' ? 'Appropriate' : o === 'accept' ? 'Accept' : o === 'reject' ? 'Reject' : 'Ambiguous',
          true, o === 'reject' ? 'box-crit' : o === 'ambiguous' ? 'box-off' : 'box-ok') +
        H.t(180, 62, ev ? 'A practice must pass all three layers.' : 'Conforming flows skip step 4.', 't-dim', 'font-size="11" text-anchor="middle"') +
        H.t(180, 82, mine ? 'What-if: your choices' : f.label, 't-dim', 'font-size="10.5" text-anchor="middle"');
      H.$(el, p + '-sum').textContent = name + ', Case ' + st.kase + '. ' + v.text;
    }
    function preset(k) { var f = L.FLOWS[k]; if (!f) return; st.flow = k; st.kase = f.kase; st.evals = f.evals.slice(); draw(); }
    el.querySelectorAll('[data-p]').forEach(function (b) { b.addEventListener('click', function () { preset(b.getAttribute('data-p')); }); });
    radios.forEach(function (r) { r.addEventListener('change', function () { st.kase = +r.value; draw(); }); });
    sels.forEach(function (s, i) { s.addEventListener('change', function () { st.evals[i] = s.value || null; draw(); }); });
    el.labPreset = preset;
    preset('a');
  });
})();
