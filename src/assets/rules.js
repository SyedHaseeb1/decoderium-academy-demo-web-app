/* Business rules. These are the same rules as StandHF.Academy.Shared (Rules.cs) in the Blazor app.
   If a rule changes after client feedback, change it here first and record it in CHANGES.md,
   then mirror it in the Blazor app. */
var RULES = (function () {
  var R = {};

  R.lectureComplete = function (watched, seconds, fraction) { return seconds > 0 && watched >= Math.ceil(seconds * (fraction || 0.9)); };

  /* p = { lectures: { id: { w, done } }, attempts: [], certs: [] } */
  R.lectureDone = function (p, id) { var r = p.lectures[id]; return !!(r && r.done); };
  R.watched = function (p, id) { var r = p.lectures[id]; return r ? r.w : 0; };
  R.quizPassed = function (p, moduleId) { return p.attempts.some(function (a) { return a.moduleId === moduleId && a.passed; }); };
  R.attemptsUsed = function (p, moduleId) { return p.attempts.filter(function (a) { return a.moduleId === moduleId; }).length; };
  R.bestScore = function (p, moduleId) { return p.attempts.filter(function (a) { return a.moduleId === moduleId; }).reduce(function (m, a) { return Math.max(m, a.percent); }, 0); };

  /* 'locked' | 'progress' | 'quiz' | 'passed' */
  R.moduleState = function (course, module, p) {
    var i = course.modules.indexOf(module);
    if (i > 0 && !R.quizPassed(p, course.modules[i - 1].id)) return 'locked';
    if (R.quizPassed(p, module.id)) return 'passed';
    return module.lectures.every(function (l) { return R.lectureDone(p, l.id); }) ? 'quiz' : 'progress';
  };
  R.courseComplete = function (course, p) { return course.modules.length > 0 && course.modules.every(function (m) { return R.quizPassed(p, m.id); }); };
  R.courseStarted = function (course, p) {
    return course.modules.some(function (m) { return m.lectures.some(function (l) { return R.watched(p, l.id) > 0; }) || p.attempts.some(function (a) { return a.moduleId === m.id; }); });
  };
  R.lectureCount = function (c) { return c.modules.reduce(function (n, m) { return n + m.lectures.length; }, 0); };
  R.totalSeconds = function (c) { return c.modules.reduce(function (n, m) { return n + m.lectures.reduce(function (s, l) { return s + l.seconds; }, 0); }, 0); };

  /* Every lecture and every module quiz is one step of progress. */
  R.percent = function (course, p) {
    var steps = R.lectureCount(course) + course.modules.length;
    if (!steps) return 0;
    var done = course.modules.reduce(function (n, m) { return n + m.lectures.filter(function (l) { return R.lectureDone(p, l.id); }).length; }, 0)
      + course.modules.filter(function (m) { return R.quizPassed(p, m.id); }).length;
    return Math.round(done * 100 / steps);
  };
  R.nextLecture = function (course, p) {
    for (var i = 0; i < course.modules.length; i++) {
      var m = course.modules[i], s = R.moduleState(course, m, p);
      if (s === 'locked') return null;
      if (s === 'progress') return m.lectures.filter(function (l) { return !R.lectureDone(p, l.id); })[0] || null;
    }
    return null;
  };
  R.pendingQuiz = function (course, p) { return course.modules.filter(function (m) { return R.moduleState(course, m, p) === 'quiz'; })[0] || null; };

  /* ---- quiz ---- */
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function shuffle(arr, r) { var a = arr.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  /* pool items: { id, text, options (correct first), explanation } */
  R.buildQuiz = function (pool, count, seed) {
    var r = rng(seed);
    return shuffle(pool, r).slice(0, Math.min(count, pool.length)).map(function (q) {
      var order = shuffle(q.options.map(function (_, i) { return i; }), r);
      return { id: q.id, text: q.text, options: order.map(function (i) { return q.options[i]; }), answer: order.indexOf(0), explanation: q.explanation };
    });
  };
  /* Unanswered questions count as wrong. */
  R.score = function (qs, answers) {
    var c = 0; qs.forEach(function (q, i) { if (answers[i] === q.answer) c++; });
    return { correct: c, total: qs.length, percent: qs.length ? Math.round(c * 100 / qs.length) : 0 };
  };

  /* Short readable certificate number such as SHA-2026-7K3QF2 (FNV-1a hash of doctor, course and date). */
  R.certCode = function (doctorId, courseId, iso) {
    var alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', s = doctorId + '|' + courseId + '|' + iso.replace(/-/g, ''), h = 2166136261, out = '';
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    for (var k = 0; k < 6; k++) { out += alphabet[h % 32]; h = Math.floor(h / 32); if (h === 0) h = (2166136261 + k) >>> 0; }
    return 'SHA-' + iso.slice(0, 4) + '-' + out;
  };
  R.rng = rng;
  return R;
})();
