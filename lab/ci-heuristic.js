/* ci-heuristic: the rules behind the CI decision heuristic stepper on
   concepts/contextual-integrity.html#heuristic. Pure; tested in
   tools/tests/ci-heuristic.test.js. Sources on that page: the App. A.8
   steps (#heuristic) and the three layers a practice must pass (#legitimacy). */
(function (root) {
  // The two flows of the page's Flow A / Flow B table (#ci-tuple).
  var FLOWS = {
    a: { label: 'Flow A: booking physical therapy', context: 'Healthcare',
      sender: "The patient's assistant agent, acting as the patient", recipient: 'Clinic scheduler',
      subject: 'The patient', attribute: 'Knee injury description, insurance member ID',
      tp: 'In confidence, for arranging care', kase: 1, evals: [null, null, null] },
    b: { label: 'Flow B: same data, wrong place', context: 'Commerce (gym class booking)',
      sender: 'The same agent', recipient: "Gym's booking agent",
      subject: 'The patient', attribute: 'Knee injury description, insurance member ID',
      tp: 'None stated; the agent volunteered it', kase: 3, evals: ['unclear', 'unclear', 'fail'] }
  };
  var CASES = {
    1: 'flow conforms: appropriate',
    2: 'flow breaches a norm: prima facie violation; presumption favors the entrenched norm',
    3: 'no norm covers it: a gap, not yet a violation'
  };
  // kase: 1 | 2 | 3. evals: three of 'pass' | 'fail' | 'unclear' (I interests,
  // II moral and political principles, III the context's own purposes).
  // A practice is justified only if it passes all three layers, so one fail rejects.
  function verdict(kase, evals) {
    if (kase === 1) return { step: 3, outcome: 'appropriate', text: 'Appropriate. It matches a norm, so no evaluation is needed.' };
    var e = evals || [];
    var fails = e.filter(function (x) { return x === 'fail'; }).length;
    var passes = e.filter(function (x) { return x === 'pass'; }).length;
    if (fails > 0) return { step: 5, outcome: 'reject', text: 'Reject. It fails ' + fails + ' of the three evaluations, and a practice must pass all three.' };
    if (passes === 3) return { step: 5, outcome: 'accept', text: kase === 2 ?
      'Accept. It breaks the entrenched norm but serves the context better, so the new practice can win.' :
      'Accept. No norm covered it, and it passes all three evaluations.' };
    return { step: 5, outcome: 'ambiguous', text: 'Ambiguous. Gather more data, deliberate, or revert to the status quo.' };
  }
  var api = { FLOWS: FLOWS, CASES: CASES, verdict: verdict };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.CIHeuristic = api;
})(this);
