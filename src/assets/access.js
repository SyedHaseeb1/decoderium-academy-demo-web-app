/* Session, roles and the demo "database" (localStorage). Loaded after boot.js, rules.js and ui.js.
   Everything here stands in for the API. The Blazor app replaces these functions with service calls.
   Storage keys: academy_* in sessionStorage (who is signed in), academy_state_v1 in localStorage (progress and edits). */
var STATE_KEY = 'academy_state_v2';
var ST = null;       // saved state
var COURSES = null;  // course tree with quiz pools built from the data files

var ss = function (k) { try { return sessionStorage.getItem(k) || ''; } catch (e) { return ''; } };
var ssSet = function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) { } };

/* ---- course tree ---- */
function buildCourses() {
  var bank = ACADEMY_DATA.questions.bank, size = ACADEMY_DATA.questions.poolSize;
  COURSES = JSON.parse(JSON.stringify(ACADEMY_DATA.courses));
  COURSES.forEach(function (c, ci) {
    c.accent = ACCENTS[ci % ACCENTS.length];
    c.modules.forEach(function (m) {
      m.courseId = c.id;
      m.lectures.forEach(function (l) { l.moduleId = m.id; });
      m.pool = [];
      for (var i = 0; i < size; i++) {
        var q = bank[(m.questionOffset + i) % bank.length];
        m.pool.push({ id: m.id + '-q' + (i + 1), text: q.text, options: q.options.slice(), explanation: q.explanation });
      }
    });
  });
}

/* ---- seeded sample progress: one doctor mid-course, one about to finish, the rest spread out ---- */
function isoDaysAgo(n) { return new Date(Date.now() - n * 86400000).toISOString().slice(0, 10); }
function between(r, lo, hi) { return lo + Math.floor(r() * (hi - lo)); }

function seedWatch(p, lec, fraction, frac) {
  var w = Math.floor(lec.seconds * fraction);
  p.lectures[lec.id] = { w: w, done: RULES.lectureComplete(w, lec.seconds, frac) };
}
function seedPass(p, course, mod, score, daysAgo, frac) {
  mod.lectures.forEach(function (l) { seedWatch(p, l, 1, frac); });
  var when = Date.now() - daysAgo * 86400000;
  p.attempts.push({ id: 'a' + Math.random().toString(36).slice(2, 10), courseId: course.id, moduleId: mod.id, startedAt: when - 360000, submittedAt: when, total: 10, correct: Math.round(score / 10), percent: score, passed: true, timedOut: false });
}
function seedCert(p, course, daysAgo) {
  var iso = isoDaysAgo(daysAgo);
  p.certs.push({ courseId: course.id, issuedOn: iso, code: RULES.certCode(p.doctorId, course.id, iso) });
}
function seedCourse(p, course, passed, r, frac) {
  for (var i = 0; i < Math.min(passed, course.modules.length); i++) seedPass(p, course, course.modules[i], between(r, 70, 101), between(r, 3, 60), frac);
  if (passed < course.modules.length) {
    var next = course.modules[passed], n = between(r, 0, next.lectures.length + 1);
    for (var j = 0; j < n; j++) seedWatch(p, next.lectures[j], 1, frac);
  }
  if (RULES.courseComplete(course, p)) seedCert(p, course, between(r, 1, 20));
}

function newState() {
  var frac = ACADEMY_DATA.settings.lectureCompleteFraction;
  var doctors = ACADEMY_DATA.doctors.doctors.map(function (d) {
    var o = JSON.parse(JSON.stringify(d)); o.joinedOn = isoDaysAgo(d.joinedDaysAgo); delete o.joinedDaysAgo; return o;
  });
  var progress = {};
  doctors.forEach(function (d) { progress[d.id] = { doctorId: d.id, lectures: {}, attempts: [], certs: [] }; });
  var c1 = COURSES[0], c2 = COURSES[1];

  var a = progress.d01;                                  // Dr. Ayesha Khan: completed course 1 with PMDC certificate
  c1.modules.forEach(function (m) { seedPass(a, c1, m, 92, 14 - m.number * 3, frac); });
  seedCert(a, c1, 4);
  seedPass(a, c2, c2.modules[0], 88, 2, frac);
  seedWatch(a, c2.modules[1].lectures[0], 1, frac);
  seedWatch(a, c2.modules[1].lectures[1], 0.6, frac);

  var b = progress.d02;                                  // Dr. Bilal Ahmed: one quiz from a second certificate
  c1.modules.slice(0, 3).forEach(function (m) { seedPass(b, c1, m, 85, 30 - m.number * 5, frac); });
  c1.modules[3].lectures.forEach(function (l) { seedWatch(b, l, 1, frac); });
  c2.modules.forEach(function (m) { seedPass(b, c2, m, 90, 20 - m.number * 4, frac); });
  seedCert(b, c2, 3);

  doctors.slice(2).forEach(function (d, i) {
    var r = RULES.rng(100 + i + 2);
    seedCourse(progress[d.id], c1, between(r, 0, 5), r, frac);
    if (between(r, 0, 3) > 0) seedCourse(progress[d.id], c2, between(r, 0, 4), r, frac);
  });
  var s = ACADEMY_DATA.settings;
  return { v: 2, doctors: doctors, progress: progress, published: {}, settings: { quiz: JSON.parse(JSON.stringify(s.quiz)), certificate: JSON.parse(JSON.stringify(s.certificate)) }, activeQuiz: null };
}

function applyPublished() { COURSES.forEach(function (c) { if (ST.published.hasOwnProperty(c.id)) c.published = ST.published[c.id]; }); }
function saveState() { try { localStorage.setItem(STATE_KEY, JSON.stringify(ST)); } catch (e) { } }
function loadState() {
  buildCourses();
  var saved = null;
  try { saved = JSON.parse(localStorage.getItem(STATE_KEY)); } catch (e) { }
  ST = saved && saved.v === 2 && saved.doctors && saved.doctors.length ? saved : newState();
  applyPublished();
}
function resetDemo() { try { localStorage.removeItem(STATE_KEY); } catch (e) { } loadState(); saveState(); }

/* ---- session ---- */
function session() { return { auth: ss('academy_auth') === '1', role: ss('academy_role'), doctorId: ss('academy_doctor'), name: ss('academy_name') }; }

/* Demo rule (as in the registry demo): any password works. Identifier is the email or the part before the @. */
function signIn(identifier, role) {
  var id = String(identifier || '').trim().toLowerCase();
  if (!id) return 'Enter your username or email.';
  if (role === 'admin') {
    var ad = ACADEMY_DATA.doctors.adminAccount;
    if (id !== 'admin' && id !== ad.email.toLowerCase()) return 'No administrator account matches this username or email.';
    ssSet('academy_auth', '1'); ssSet('academy_role', 'admin'); ssSet('academy_doctor', ''); ssSet('academy_name', ad.name);
    return '';
  }
  var d = ST.doctors.filter(function (x) { return x.email.toLowerCase() === id || x.email.split('@')[0].toLowerCase() === id; })[0];
  if (!d) return 'No doctor account matches this username or email.';
  if (!d.active) return 'This account has been deactivated. Please contact the administrator.';
  ssSet('academy_auth', '1'); ssSet('academy_role', 'doctor'); ssSet('academy_doctor', d.id); ssSet('academy_name', d.name);
  return '';
}
function signOut(loginUrl) { try { sessionStorage.clear(); } catch (e) { } ST.activeQuiz = null; saveState(); location.replace(loginUrl || '../login/'); }
/* Gate: call at the top of every protected page, after the data has loaded. */
function requireRole(role) {
  var s = session();
  var ok = s.auth && s.role === role && (role !== 'doctor' || (ST.doctors.some(function (d) { return d.id === s.doctorId && d.active; })));
  if (!ok) { location.replace('../login/'); return false; }
  return true;
}

/* ---- reads ---- */
function courses() { return COURSES; }
function course(id) { return COURSES.filter(function (c) { return c.id === id; })[0] || null; }
function findModule(id) { for (var i = 0; i < COURSES.length; i++) for (var j = 0; j < COURSES[i].modules.length; j++) if (COURSES[i].modules[j].id === id) return { course: COURSES[i], module: COURSES[i].modules[j] }; return null; }
function findLecture(id) { for (var i = 0; i < COURSES.length; i++) for (var j = 0; j < COURSES[i].modules.length; j++) for (var k = 0; k < COURSES[i].modules[j].lectures.length; k++) if (COURSES[i].modules[j].lectures[k].id === id) return { course: COURSES[i], module: COURSES[i].modules[j], lecture: COURSES[i].modules[j].lectures[k] }; return null; }
function doctors() { return ST.doctors; }
function me() { var s = session(); return ST.doctors.filter(function (d) { return d.id === s.doctorId; })[0] || null; }
function progressOf(doctorId) { if (!ST.progress[doctorId]) ST.progress[doctorId] = { doctorId: doctorId, lectures: {}, attempts: [], certs: [] }; return ST.progress[doctorId]; }
function settings() { return ST.settings; }

/* ---- learning ---- */
function recordWatch(lectureId, seconds) {
  var d = me(), f = findLecture(lectureId); if (!d || !f) return;
  var p = progressOf(d.id), row = p.lectures[lectureId] || (p.lectures[lectureId] = { w: 0, done: false });
  row.w = Math.min(Math.max(row.w, Math.floor(seconds)), f.lecture.seconds);   // progress only moves forward
  row.done = row.done || RULES.lectureComplete(row.w, f.lecture.seconds, ACADEMY_DATA.settings.lectureCompleteFraction);
  saveState();
}
function activeQuiz() { return ST.activeQuiz; }
/* Starts a quiz, or resumes the running one so a refresh cannot restart the clock. Returns null when it cannot start. */
function startQuiz(moduleId) {
  var d = me(), f = findModule(moduleId); if (!d || !f) return null;
  if (ST.activeQuiz && ST.activeQuiz.moduleId === moduleId) return ST.activeQuiz;
  var p = progressOf(d.id), q = ST.settings.quiz;
  if (RULES.moduleState(f.course, f.module, p) !== 'quiz') return null;
  if (RULES.attemptsUsed(p, moduleId) >= q.maxAttempts) return null;
  var now = Date.now();
  ST.activeQuiz = { courseId: f.course.id, moduleId: moduleId, startedAt: now, deadline: now + q.timeLimitMinutes * 60000, settings: JSON.parse(JSON.stringify(q)), questions: RULES.buildQuiz(f.module.pool, q.questionCount, now % 2147483647) };
  saveState();
  return ST.activeQuiz;
}
function submitQuiz(sess, answers, timedOut) {
  var d = me(), sc = RULES.score(sess.questions, answers);
  var attempt = { id: 'a' + Math.random().toString(36).slice(2, 10), courseId: sess.courseId, moduleId: sess.moduleId, startedAt: sess.startedAt, submittedAt: Date.now(), total: sc.total, correct: sc.correct, percent: sc.percent, passed: sc.percent >= sess.settings.passMark, timedOut: !!timedOut };
  progressOf(d.id).attempts.push(attempt);
  ST.activeQuiz = null; saveState();
  return attempt;
}
function ensureCert(courseId) {
  var d = me(), c = course(courseId); if (!d || !c) return null;
  var p = progressOf(d.id);
  if (!RULES.courseComplete(c, p)) return null;
  var ex = p.certs.filter(function (x) { return x.courseId === courseId; })[0];
  if (ex) return ex;
  var iso = isoDaysAgo(0), cert = { courseId: courseId, issuedOn: iso, code: RULES.certCode(d.id, courseId, iso) };
  p.certs.push(cert); saveState();
  return cert;
}
function verifyCert(code) {
  code = String(code || '').trim().toUpperCase();
  var ids = Object.keys(ST.progress);
  for (var i = 0; i < ids.length; i++) {
    var c = ST.progress[ids[i]].certs.filter(function (x) { return x.code.toUpperCase() === code; })[0];
    if (c) { var d = ST.doctors.filter(function (x) { return x.id === ids[i]; })[0], co = course(c.courseId); if (d && co) return { cert: c, doctor: d, course: co }; }
  }
  return null;
}

/* ---- administration ---- */
function addDoctor(d) {
  if (ST.doctors.some(function (x) { return x.email.toLowerCase() === d.email.toLowerCase(); })) return 'A doctor with this email already exists.';
  if (ST.doctors.some(function (x) { return x.pmdcId.toLowerCase() === d.pmdcId.toLowerCase(); })) return 'A doctor with this PMDC ID already exists.';
  d.id = 'd' + (ST.doctors.length + 1) + Math.random().toString(36).slice(2, 5); d.active = true; d.joinedOn = isoDaysAgo(0);
  ST.doctors.push(d); progressOf(d.id); saveState();
  return '';
}
function setDoctorActive(id, active) { var d = ST.doctors.filter(function (x) { return x.id === id; })[0]; if (d) { d.active = active; saveState(); } }
function setPublished(id, flag) { var c = course(id); if (c) { c.published = flag; ST.published[id] = flag; saveState(); } }
function saveSettings(quiz, cert) { ST.settings.quiz = quiz; ST.settings.certificate = cert; saveState(); }

loadState();
