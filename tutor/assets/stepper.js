/* Tutor debugger-style stepper. Walks through real code one step at a time.
 *
 * Markup:
 *   <div class="stepper" data-stepper='{
 *     "path": "pymc_marketing/mmm/transformers.py:120",
 *     "code": ["def f(x):", "    y = x * 2", "    return y"],
 *     "start": 120,
 *     "steps": [
 *       {"line": 0, "note": "Call f with x = 3.", "vars": {"x": 3}},
 *       {"line": 1, "note": "Double it.",        "vars": {"x": 3, "y": 6}},
 *       {"line": 2, "note": "Return y.",         "vars": {"x": 3, "y": 6}}
 *     ]
 *   }'></div>
 *
 * "code" is copied verbatim from the repo. "line" is a 0-based index into "code".
 * "start" is the real file line number of code[0]. Vars that changed at a step are highlighted.
 */
(function () {
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function build(el) {
    var d = JSON.parse(el.getAttribute('data-stepper'));
    var start = d.start || 1;
    var i = 0;

    el.innerHTML =
      (d.path ? '<div class="path" style="padding:.6rem 1rem 0">' + esc(d.path) + '</div>' : '') +
      '<pre class="stepper-code"></pre>' +
      '<div class="stepper-note"></div>' +
      '<div class="stepper-vars"></div>' +
      '<div class="stepper-ctl"><button type="button" data-a="back">◀ Back</button>' +
      '<button type="button" data-a="next">Step ▶</button>' +
      '<button type="button" data-a="reset">Reset</button><span class="stepper-pos"></span></div>';

    var pre = el.querySelector('.stepper-code');
    var note = el.querySelector('.stepper-note');
    var vars = el.querySelector('.stepper-vars');
    var pos = el.querySelector('.stepper-pos');
    var back = el.querySelector('[data-a=back]');
    var next = el.querySelector('[data-a=next]');

    pre.innerHTML = d.code.map(function (ln, k) {
      return '<span class="stepper-line" data-k="' + k + '"><span class="stepper-ln">' + (start + k) + '</span>' + esc(ln) + '</span>';
    }).join('\n');

    function show() {
      var s = d.steps[i];
      var prev = i > 0 ? d.steps[i - 1].vars || {} : {};
      pre.querySelectorAll('.stepper-line').forEach(function (n) {
        n.classList.toggle('active', Number(n.getAttribute('data-k')) === s.line);
      });
      note.innerHTML = s.note;
      var names = Object.keys(s.vars || {});
      vars.innerHTML = names.length ? names.map(function (n) {
        var changed = !(n in prev) || String(prev[n]) !== String(s.vars[n]);
        return '<span class="var-name">' + esc(n) + '</span> = <span class="' + (changed ? 'var-new' : '') + '">' + esc(s.vars[n]) + '</span>';
      }).join('&nbsp;&nbsp;·&nbsp;&nbsp;') : '<span style="opacity:.6">no variables yet</span>';
      pos.textContent = 'step ' + (i + 1) + ' / ' + d.steps.length;
      back.disabled = i === 0;
      next.disabled = i === d.steps.length - 1;
    }

    el.addEventListener('click', function (e) {
      var a = e.target.getAttribute && e.target.getAttribute('data-a');
      if (!a) return;
      if (a === 'next' && i < d.steps.length - 1) i++;
      if (a === 'back' && i > 0) i--;
      if (a === 'reset') i = 0;
      show();
    });
    show();
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.stepper[data-stepper]').forEach(build);
  });
})();
