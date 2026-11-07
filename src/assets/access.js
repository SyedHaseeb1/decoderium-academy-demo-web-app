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
  return { v: 2, doctors: doctors, progress: progress, published: {}, settings: { quiz: JSON.parse(JSON.stringify(s.quiz)), certificate: JSON.parse(JSON.stringify(s.certificate)) }, activeQuiz: null, courses: COURSES, patients: seedInitialPatients() };
}

function seedInitialPatients() {
  var indications = ['GERD & Chronic Dyspepsia', 'Acid Peptic Disease (APD)', 'Functional Dyspepsia', 'Erosive Esophagitis', 'Gastric Ulceration'];
  var genders = ['Male', 'Female'];
  var pts = [];
  var docList = ACADEMY_DATA.doctors.doctors;
  for (var i = 1; i <= 48; i++) {
    var doc = docList[(i - 1) % docList.length];
    var isPending = (i === 2 || i === 9 || i === 18);
    var baseline = 7.0 + Math.round(((i * 7) % 25) / 10 * 10) / 10;
    var day3 = isPending ? null : Math.max(2.0, Math.round((baseline - 3.5 - ((i % 5) / 5)) * 10) / 10);
    var day7 = (isPending || i > 30) ? null : Math.max(1.0, Math.round((day3 - 2.0) * 10) / 10);
    var pwaInstalled = (i % 4 !== 0); // ~75% installed
    var pushEnabled = pwaInstalled && (i % 3 !== 0); // ~50% notifications on
    var notifStatus = (day3 !== null || day7 !== null) ? (pushEnabled ? 'delivered' : 'undelivered') : 'scheduled';
    pts.push({
      id: 'pt' + (i < 10 ? '0' + i : i),
      code: 'PT-' + (400 + i),
      age: 28 + ((i * 13) % 45),
      gender: genders[i % 2],
      indication: indications[i % indications.length],
      doctorId: doc.id,
      doctorName: doc.name,
      hospital: doc.hospital,
      city: doc.city,
      baselineScore: baseline,
      day3Score: day3,
      day7Score: day7,
      followupStatus: isPending ? 'due_today' : (day7 !== null ? 'completed' : 'day3_done'),
      adverseEvents: 'None',
      enrolledOn: isoDaysAgo(14 - (i % 12)),
      pwaInstalled: pwaInstalled,
      pushEnabled: pushEnabled,
      notificationStatus: notifStatus
    });
  }
  return pts;
}

function applyPublished() { COURSES.forEach(function (c) { if (ST.published.hasOwnProperty(c.id)) c.published = ST.published[c.id]; }); }
function saveState() {
  if (ST) ST.courses = COURSES;
  try { localStorage.setItem(STATE_KEY, JSON.stringify(ST)); } catch (e) { }
}
function loadState() {
  buildCourses();
  var saved = null;
  try { saved = JSON.parse(localStorage.getItem(STATE_KEY)); } catch (e) { }
  ST = saved && saved.v === 2 && saved.doctors && saved.doctors.length ? saved : newState();
  if (ST.courses && ST.courses.length && ST.courses[0] && ST.courses[0].title && ST.courses[0].title.indexOf('Acid Peptic') > -1) {
    COURSES = ST.courses;
  } else {
    ST.courses = COURSES;
  }
  if (!ST.patients || !ST.patients.length || !ST.patients[0].hasOwnProperty('pwaInstalled')) {
    ST.patients = seedInitialPatients();
  }
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
function updateDoctor(id, updates) {
  var d = ST.doctors.filter(function (x) { return x.id === id; })[0];
  if (!d) return 'Doctor not found.';
  Object.keys(updates || {}).forEach(function (k) { d[k] = updates[k]; });
  saveState();
  return '';
}
function deleteDoctor(id) {
  var idx = ST.doctors.findIndex ? ST.doctors.findIndex(function (x) { return x.id === id; }) : -1;
  if (idx === -1) {
    for (var i = 0; i < ST.doctors.length; i++) { if (ST.doctors[i].id === id) { idx = i; break; } }
  }
  if (idx > -1) {
    ST.doctors.splice(idx, 1);
    delete ST.progress[id];
    saveState();
    return true;
  }
  return false;
}

/* Course CRUD */
function addCourse(c) {
  if (!c.id) c.id = 'c' + (COURSES.length + 1) + Math.random().toString(36).slice(2, 5);
  c.modules = c.modules || [];
  c.published = !!c.published;
  c.accent = c.accent || '#582be8';
  COURSES.push(c);
  ST.courses = COURSES;
  saveState();
  return c;
}
function updateCourse(id, updates) {
  var c = course(id);
  if (!c) return false;
  Object.keys(updates || {}).forEach(function (k) { c[k] = updates[k]; });
  ST.courses = COURSES;
  saveState();
  return true;
}
function deleteCourse(id) {
  var idx = -1;
  for (var i = 0; i < COURSES.length; i++) { if (COURSES[i].id === id) { idx = i; break; } }
  if (idx > -1) {
    COURSES.splice(idx, 1);
    ST.courses = COURSES;
    delete ST.published[id];
    saveState();
    return true;
  }
  return false;
}

/* Module CRUD */
function addModule(courseId, m) {
  var c = course(courseId);
  if (!c) return null;
  if (!m.id) m.id = c.id + '-m' + (c.modules.length + 1);
  m.courseId = c.id;
  m.number = c.modules.length + 1;
  m.lectures = m.lectures || [];
  m.pool = m.pool || [];
  c.modules.push(m);
  ST.courses = COURSES;
  saveState();
  return m;
}
function updateModule(courseId, moduleId, updates) {
  var c = course(courseId); if (!c) return false;
  var m = c.modules.filter(function (x) { return x.id === moduleId; })[0];
  if (!m) return false;
  Object.keys(updates || {}).forEach(function (k) { m[k] = updates[k]; });
  ST.courses = COURSES;
  saveState();
  return true;
}
function deleteModule(courseId, moduleId) {
  var c = course(courseId); if (!c) return false;
  var idx = -1;
  for (var i = 0; i < c.modules.length; i++) { if (c.modules[i].id === moduleId) { idx = i; break; } }
  if (idx > -1) {
    c.modules.splice(idx, 1);
    c.modules.forEach(function (m, i) { m.number = i + 1; });
    ST.courses = COURSES;
    saveState();
    return true;
  }
  return false;
}

/* Lecture CRUD */
function addLecture(courseId, moduleId, l) {
  var f = findModule(moduleId); if (!f) return null;
  if (!l.id) l.id = moduleId + '-l' + (f.module.lectures.length + 1);
  l.moduleId = moduleId;
  l.seconds = Math.max(60, Math.floor(l.seconds || 300));
  f.module.lectures.push(l);
  ST.courses = COURSES;
  saveState();
  return l;
}
function updateLecture(courseId, moduleId, lectureId, updates) {
  var f = findLecture(lectureId); if (!f) return false;
  Object.keys(updates || {}).forEach(function (k) { f.lecture[k] = updates[k]; });
  ST.courses = COURSES;
  saveState();
  return true;
}
function deleteLecture(courseId, moduleId, lectureId) {
  var f = findModule(moduleId); if (!f) return false;
  var idx = -1;
  for (var i = 0; i < f.module.lectures.length; i++) { if (f.module.lectures[i].id === lectureId) { idx = i; break; } }
  if (idx > -1) {
    f.module.lectures.splice(idx, 1);
    ST.courses = COURSES;
    saveState();
    return true;
  }
  return false;
}

/* Question Pool CRUD */
function addQuestion(courseId, moduleId, q) {
  var f = findModule(moduleId); if (!f) return null;
  if (!q.id) q.id = moduleId + '-q' + (f.module.pool.length + 1);
  q.options = q.options && q.options.length ? q.options : ['Correct Answer', 'Option B', 'Option C', 'Option D'];
  q.explanation = q.explanation || 'Official curriculum clinical guidance rationale.';
  f.module.pool.push(q);
  ST.courses = COURSES;
  saveState();
  return q;
}
function updateQuestion(courseId, moduleId, questionId, updates) {
  var f = findModule(moduleId); if (!f) return false;
  var q = f.module.pool.filter(function (x) { return x.id === questionId; })[0];
  if (!q) return false;
  Object.keys(updates || {}).forEach(function (k) { q[k] = updates[k]; });
  ST.courses = COURSES;
  saveState();
  return true;
}
function deleteQuestion(courseId, moduleId, questionId) {
  var f = findModule(moduleId); if (!f) return false;
  var idx = -1;
  for (var i = 0; i < f.module.pool.length; i++) { if (f.module.pool[i].id === questionId) { idx = i; break; } }
  if (idx > -1) {
    f.module.pool.splice(idx, 1);
    ST.courses = COURSES;
    saveState();
    return true;
  }
  return false;
}

/* Clinical Trial Patients CRUD */
function patients() { return ST.patients || []; }
function addPatient(p) {
  if (!p.id) p.id = 'pt' + (ST.patients.length + 1) + Math.random().toString(36).slice(2, 5);
  p.code = p.code || ('PT-' + (400 + ST.patients.length + 1));
  p.enrolledOn = p.enrolledOn || isoDaysAgo(0);
  p.followupStatus = p.followupStatus || 'due_today';
  ST.patients.unshift(p);
  saveState();
  return p;
}
function updatePatient(id, updates) {
  var p = (ST.patients || []).filter(function (x) { return x.id === id; })[0];
  if (!p) return false;
  Object.keys(updates || {}).forEach(function (k) { p[k] = updates[k]; });
  saveState();
  return true;
}
function deletePatient(id) {
  var pts = ST.patients || [];
  var idx = -1;
  for (var i = 0; i < pts.length; i++) { if (pts[i].id === id) { idx = i; break; } }
  if (idx > -1) {
    pts.splice(idx, 1);
    saveState();
    return true;
  }
  return false;
}

function setPublished(id, flag) { var c = course(id); if (c) { c.published = flag; ST.published[id] = flag; saveState(); } }
function saveSettings(quiz, cert) { ST.settings.quiz = quiz; ST.settings.certificate = cert; saveState(); }

loadState();
