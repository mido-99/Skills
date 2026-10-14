/* Tutor quiz widget. Options are shuffled on every page load, so the correct answer moves.
 *
 * Markup (one per quiz):
 *   <div class="quiz" data-quiz='{
 *     "q": "Question text",
 *     "options": [
 *       {"text": "Right answer", "correct": true,  "why": "Why this is right."},
 *       {"text": "Distractor",   "correct": false, "why": "Why this is wrong."}
 *     ]
 *   }'></div>
 *
 * Every option needs a "why". Keep option texts the same length so length gives nothing away.
 */
(function () {
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function render(el) {
    var data = JSON.parse(el.getAttribute('data-quiz'));
    var opts = shuffle(data.options);
    el.innerHTML = '';

    var q = document.createElement('p');
    q.className = 'quiz-q';
    q.innerHTML = data.q;
    el.appendChild(q);

    var buttons = opts.map(function (o) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'quiz-opt';
      b.innerHTML = o.text;
      b.addEventListener('click', function () { answer(b, o); });
      el.appendChild(b);
      return b;
    });

    var why = document.createElement('div');
    why.className = 'quiz-why';
    why.hidden = true;
    el.appendChild(why);

    function answer(chosen, opt) {
      buttons.forEach(function (b, i) {
        b.disabled = true;
        if (opts[i].correct) b.classList.add('correct');
      });
      if (!opt.correct) chosen.classList.add('wrong');

      var head = opt.correct ? '<p><span class="tag-ok">✓ Correct.</span> Here is why, for every option:</p>'
                             : '<p><span class="tag-no">✗ Not quite.</span> Here is why, for every option:</p>';
      var items = opts.map(function (o) {
        var tag = o.correct ? '<span class="tag-ok">✓</span>' : '<span class="tag-no">✗</span>';
        return '<li>' + tag + ' <strong>' + o.text + '</strong>: ' + o.why + '</li>';
      }).join('');
      why.innerHTML = head + '<ul>' + items + '</ul>';
      why.hidden = false;
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.quiz[data-quiz]').forEach(render);
  });
})();
