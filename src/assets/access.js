/* Session, roles and the demo "database" (localStorage). Loaded after boot.js, rules.js and ui.js.
   Everything here stands in for the API. The Blazor app replaces these functions with service calls.
   Storage keys: academy_* in sessionStorage (who is signed in), academy_state_v1 in localStorage (progress and edits). */
var STATE_KEY = 'academy_state_v2';
var ST = null;       // saved state
var COURSES = null;  // course tree with quiz pools built from the data files

var ss = function (k) { try { return sessionStorage.getItem(k) || localStorage.getItem(k) || ''; } catch (e) { return ''; } };
var ssSet = function (k, v) { try { sessionStorage.setItem(k, v); localStorage.setItem(k, v); } catch (e) { } };

/* ---- course tree ---- */
function buildCourses() {
  var bank = ACADEMY_DATA.questions.bank, size = ACADEMY_DATA.questions.poolSize;
  COURSES = JSON.parse(JSON.stringify(ACADEMY_DATA.courses));
  COURSES.forEach(function (c, ci) {
    c.accent = c.accent || ACCENTS[ci % ACCENTS.length];
    c.thumbStyle = c.thumbStyle || (ci === 0 ? 'pcab' : (ci === 1 ? 'clinic' : 'endoscopy'));
    c.cmeHours = c.cmeHours || (ci === 0 ? 12 : (ci === 1 ? 8 : 16));
    c.facultyChair = c.facultyChair || (ci === 0 ? 'Prof. Sara Anwar, MD, FRCP' : (ci === 1 ? 'Dr. Tahir Mahmood, FCPS' : 'Dr. Nadia Rehman, MD'));
    c.materials = c.materials || [];
    c.assignedDoctors = c.assignedDoctors || [];
    c.modules.forEach(function (m) {
      m.courseId = c.id;
      m.passingScore = m.passingScore || 70;
      m.timeLimitMinutes = m.timeLimitMinutes || 10;
      m.lectures.forEach(function (l) {
        l.moduleId = m.id;
        l.videoUrl = l.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
      });
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

function getZoneForCity(city) {
  var c = String(city || '').toLowerCase().trim();
  if (c.indexOf('islamabad') > -1 || c.indexOf('rawalpindi') > -1 || c.indexOf('peshawar') > -1) return 'z-north';
  if (c.indexOf('lahore') > -1 || c.indexOf('faisalabad') > -1 || c.indexOf('gujranwala') > -1 || c.indexOf('sialkot') > -1) return 'z-central';
  if (c.indexOf('karachi') > -1 || c.indexOf('hyderabad') > -1) return 'z-south';
  if (c.indexOf('quetta') > -1) return 'z-west';
  if (c.indexOf('multan') > -1 || c.indexOf('bahawalpur') > -1) return 'z-south-punjab';
  return 'z-central';
}

function seedInitialZones() {
  return [
    {
      id: 'z-north',
      name: 'North Zone - Islamabad & KPK',
      code: 'ZONE-NORTH',
      region: 'North',
      leadHospital: 'Federal General Hospital',
      cities: ['Islamabad', 'Rawalpindi', 'Peshawar'],
      coordinator: 'Dr. Ayesha Khan',
      coordinatorEmail: 'ayesha.khan@example.com',
      targetEnrollment: 60,
      activeStatus: 'active',
      description: 'Capital territory, Potohar plateau, and Khyber Pakhtunkhwa clinical network.'
    },
    {
      id: 'z-central',
      name: 'Central Zone - Lahore & Punjab Hubs',
      code: 'ZONE-CENTRAL',
      region: 'Central',
      leadHospital: 'Lahore Medical Centre',
      cities: ['Lahore', 'Faisalabad', 'Gujranwala', 'Sialkot'],
      coordinator: 'Dr. Bilal Ahmed',
      coordinatorEmail: 'bilal.ahmed@example.com',
      targetEnrollment: 100,
      activeStatus: 'active',
      description: 'Central Punjab high-density tertiary gastro & endoscopy research clusters.'
    },
    {
      id: 'z-south',
      name: 'South Zone - Karachi & Sindh',
      code: 'ZONE-SOUTH',
      region: 'South',
      leadHospital: 'Karachi Heart Clinic & Civil Hospital',
      cities: ['Karachi', 'Hyderabad'],
      coordinator: 'Dr. Hina Siddiqui',
      coordinatorEmail: 'hina.siddiqui@example.com',
      targetEnrollment: 80,
      activeStatus: 'active',
      description: 'Metropolitan Karachi and Lower Sindh multi-centre trial network.'
    },
    {
      id: 'z-west',
      name: 'West Zone - Quetta & Balochistan',
      code: 'ZONE-WEST',
      region: 'West',
      leadHospital: 'Civil Hospital Quetta',
      cities: ['Quetta'],
      coordinator: 'Dr. Rabia Noor',
      coordinatorEmail: 'rabia.noor@example.com',
      targetEnrollment: 30,
      activeStatus: 'active',
      description: 'Western provincial healthcare facilities and regional tertiary referral centers.'
    },
    {
      id: 'z-south-punjab',
      name: 'South Punjab Zone - Multan & Bahawalpur',
      code: 'ZONE-SPUNJAB',
      region: 'South Punjab',
      leadHospital: 'Malik Family Clinic & Victoria Hospital',
      cities: ['Multan', 'Bahawalpur'],
      coordinator: 'Dr. Sana Malik',
      coordinatorEmail: 'sana.malik@example.com',
      targetEnrollment: 45,
      activeStatus: 'active',
      description: 'Southern agricultural belt and specialized APD patient cohorts.'
    }
  ];
}

function newState() {
  var frac = ACADEMY_DATA.settings.lectureCompleteFraction;
  var initialZones = seedInitialZones();
  var doctors = ACADEMY_DATA.doctors.doctors.map(function (d) {
    var o = JSON.parse(JSON.stringify(d)); o.joinedOn = isoDaysAgo(d.joinedDaysAgo); delete o.joinedDaysAgo;
    o.assignedCourses = o.assignedCourses || (COURSES[0] ? [COURSES[0].id] : []);
    o.courseNotifications = o.courseNotifications || [];
    o.zoneId = getZoneForCity(o.city);
    var zObj = initialZones.filter(function (z) { return z.id === o.zoneId; })[0];
    o.zone = zObj ? zObj.name : 'Central Zone - Lahore & Punjab Hubs';
    return o;
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
  return { v: 2, doctors: doctors, progress: progress, published: {}, settings: { quiz: JSON.parse(JSON.stringify(s.quiz)), certificate: JSON.parse(JSON.stringify(s.certificate)) }, activeQuiz: null, courses: COURSES, patients: seedInitialPatients(), zones: initialZones };
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
    COURSES.forEach(function (c, ci) {
      c.accent = c.accent || ACCENTS[ci % ACCENTS.length];
      c.thumbStyle = c.thumbStyle || (ci === 0 ? 'pcab' : (ci === 1 ? 'clinic' : 'endoscopy'));
      c.cmeHours = c.cmeHours || (ci === 0 ? 12 : (ci === 1 ? 8 : 16));
      c.facultyChair = c.facultyChair || (ci === 0 ? 'Prof. Sara Anwar, MD, FRCP' : (ci === 1 ? 'Dr. Tahir Mahmood, FCPS' : 'Dr. Nadia Rehman, MD'));
      c.materials = c.materials || [];
      if (c.modules) {
        c.modules.forEach(function (m) {
          m.passingScore = m.passingScore || 70;
          m.timeLimitMinutes = m.timeLimitMinutes || 10;
          if (m.lectures) {
            m.lectures.forEach(function (l) {
              l.videoUrl = l.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
            });
          }
        });
      }
    });
  } else {
    ST.courses = COURSES;
  }
  // Ensure courses have assignedDoctors
  COURSES.forEach(function (c) {
    if (!c.assignedDoctors || !c.assignedDoctors.length) {
      var origC = (ACADEMY_DATA.courses || []).filter(function (x) { return x.id === c.id; })[0];
      c.assignedDoctors = (origC && origC.assignedDoctors) ? origC.assignedDoctors.slice() : [];
    }
  });
  // Ensure doctors have assignedCourses and courseNotifications
  (ST.doctors || []).forEach(function (d) {
    if (!d.assignedCourses || !d.assignedCourses.length) {
      var origD = (ACADEMY_DATA.doctors.doctors || []).filter(function (x) { return x.id === d.id; })[0];
      d.assignedCourses = (origD && origD.assignedCourses) ? origD.assignedCourses.slice() : (COURSES[0] ? [COURSES[0].id] : []);
    }
    if (!d.courseNotifications) d.courseNotifications = [];
  });
  if (!ST.patients || !ST.patients.length || !ST.patients[0].hasOwnProperty('pwaInstalled')) {
    ST.patients = seedInitialPatients();
  }
  if (!ST.zones || !ST.zones.length) {
    ST.zones = seedInitialZones();
  }
  (ST.doctors || []).forEach(function (d) {
    if (!d.zoneId) {
      d.zoneId = getZoneForCity(d.city);
    }
    var zObj = (ST.zones || []).filter(function (z) { return z.id === d.zoneId; })[0];
    d.zone = zObj ? zObj.name : (d.zone || 'Central Zone - Lahore & Punjab Hubs');
  });
  applyPublished();
}
function resetDemo() { try { localStorage.removeItem(STATE_KEY); } catch (e) { } loadState(); saveState(); }

/* ---- session ---- */
function session() {
  var p = null;
  try { p = new URLSearchParams(window.location.search || ''); } catch (e) { }

  var isLogin = (typeof location !== 'undefined' && location.pathname && location.pathname.indexOf('/login') > -1);
  if (isLogin) {
    if (p && p.get('logout') === '1') {
      try {
        sessionStorage.clear();
        ['academy_auth', 'academy_role', 'academy_doctor', 'academy_name', 'academy_admin_preview', 'academy_eval_mode'].forEach(function(k) {
          try { localStorage.removeItem(k); } catch (e) {}
        });
      } catch (e) {}
      return { auth: false, role: '', doctorId: '', name: '' };
    }
    var a = ss('academy_auth');
    var r = ss('academy_role');
    if (a !== '1' || !r) {
      return { auth: false, role: '', doctorId: '', name: '' };
    }
  }

  if (p && (p.get('eval_demo') === 'admin' || p.get('admin') === '1')) {
    ssSet('academy_auth', '1');
    ssSet('academy_role', 'admin');
    ssSet('academy_name', 'Executive Admin');
    ssSet('academy_doctor', '');
    ssSet('academy_admin_preview', '');
  } else if (p && (p.get('preview') === '1' || p.get('preview') === 'doc')) {
    ssSet('academy_admin_preview', '1');
    ssSet('academy_eval_mode', 'doctor_preview');
    ssSet('academy_auth', '1');
    ssSet('academy_role', 'admin');
    ssSet('academy_name', 'Executive Admin');
    ssSet('academy_doctor', '');
  }

  var auth = ss('academy_auth');
  var role = ss('academy_role');
  var docId = ss('academy_doctor');
  var name = ss('academy_name');
  var isAdminPreview = (ss('academy_admin_preview') === '1') || (p && p.get('preview') === '1');

  // Fallback only on non-login pages
  if (!isLogin && (auth !== '1' || !role)) {
    var isAdm = (typeof location !== 'undefined' && location.pathname && location.pathname.indexOf('/admin') > -1);
    auth = '1';
    role = isAdm ? 'admin' : 'doctor';
    docId = isAdm ? '' : 'd01';
    name = isAdm ? 'Executive Admin' : 'Dr. Ayesha Khan';
    ssSet('academy_auth', auth);
    ssSet('academy_role', role);
    ssSet('academy_doctor', docId);
    ssSet('academy_name', name);
  }

  if (role === 'doctor' && (!docId || (ST && ST.doctors && !ST.doctors.some(function (d) { return d.id === docId; })))) {
    docId = (ST && ST.doctors && ST.doctors[0]) ? ST.doctors[0].id : 'd01';
    ssSet('academy_doctor', docId);
  }

  return { auth: auth === '1', role: role, doctorId: docId, name: name, isPreview: isAdminPreview };
}

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
function signOut(loginUrl) {
  try {
    sessionStorage.clear();
    ['academy_auth', 'academy_role', 'academy_doctor', 'academy_name', 'academy_admin_preview'].forEach(function(k) {
      try { localStorage.removeItem(k); } catch (e) {}
    });
  } catch (e) { }
  ST.activeQuiz = null;
  saveState();
  location.replace(loginUrl || '../login/');
}

function startDoctorPreview(doctorId, redirectUrl) {
  // If in admin console with in-app simulation modal available, open simulation stage without opening a new tab
  if (typeof openCourseDoctorPreviewModal === 'function') {
    var cMatch = (redirectUrl || '').match(/[#?]c=([a-zA-Z0-9_-]+)/) || (redirectUrl || '').match(/#([a-zA-Z0-9_-]+)/);
    var cid = cMatch ? cMatch[1] : null;
    openCourseDoctorPreviewModal(cid, doctorId);
    return;
  }

  // Retain Super Admin session in sandboxed read-only preview without touching doctor accounts
  ssSet('academy_auth', '1');
  ssSet('academy_role', 'admin');
  ssSet('academy_name', 'Executive Admin');
  ssSet('academy_doctor', '');
  ssSet('academy_admin_preview', '1');
  ssSet('academy_eval_mode', 'sandbox_preview');

  var target = redirectUrl || '../lecture/?mode=sandbox_preview';
  var sep = target.indexOf('?') > -1 ? '&' : '?';
  var hashIdx = target.indexOf('#');
  if (hashIdx > -1) {
    target = target.slice(0, hashIdx) + sep + 'mode=sandbox_preview' + target.slice(hashIdx);
  } else {
    target = target + sep + 'mode=sandbox_preview';
  }
  window.open(target, '_blank');
}

function returnToAdminConsole(targetRoute) {
  var ad = ACADEMY_DATA.doctors.adminAccount;
  ssSet('academy_auth', '1');
  ssSet('academy_role', 'admin');
  ssSet('academy_doctor', '');
  ssSet('academy_name', ad.name);
  ssSet('academy_admin_preview', '');
  ssSet('academy_eval_mode', '');
  try { localStorage.removeItem('academy_admin_preview'); } catch (e) { }
  try { sessionStorage.removeItem('academy_admin_preview'); } catch (e) { }
  location.href = '../admin/' + (targetRoute || '#courses') + '?eval_demo=admin';
}

/* Gate: call at the top of every protected page, after the data has loaded. */
function requireRole(role) {
  var s = session();

  // Super Admin preview mode allows viewing all doctor-protected views without redirect
  if (s.role === 'admin' || ss('academy_admin_preview') === '1') {
    if (role === 'doctor') {
      ssSet('academy_admin_preview', '1');
    }
    return true;
  }

  // Doctor accessing doctor views
  if (s.role === role) {
    return true;
  }

  // Seamless fallback for client prototype: never kick to login
  if (role === 'doctor') {
    ssSet('academy_auth', '1');
    ssSet('academy_role', 'doctor');
    ssSet('academy_doctor', (ST.doctors && ST.doctors[0]) ? ST.doctors[0].id : 'd01');
    return true;
  }
  if (role === 'admin') {
    ssSet('academy_auth', '1');
    ssSet('academy_role', 'admin');
    return true;
  }

  return true;
}

/* ---- reads ---- */
function courses() { return COURSES; }
function course(id) { return COURSES.filter(function (c) { return c.id === id; })[0] || null; }
function findModule(id) { for (var i = 0; i < COURSES.length; i++) for (var j = 0; j < COURSES[i].modules.length; j++) if (COURSES[i].modules[j].id === id) return { course: COURSES[i], module: COURSES[i].modules[j] }; return null; }
function findLecture(id) { for (var i = 0; i < COURSES.length; i++) for (var j = 0; j < COURSES[i].modules.length; j++) if (COURSES[i].modules[j].lectures) for (var k = 0; k < COURSES[i].modules[j].lectures.length; k++) if (COURSES[i].modules[j].lectures[k].id === id) return { course: COURSES[i], module: COURSES[i].modules[j], lecture: COURSES[i].modules[j].lectures[k] }; return null; }
function doctors() { return ST.doctors; }
function me() {
  var s = session();
  if (s.role === 'admin' && (ss('academy_admin_preview') === '1' || s.isPreview)) {
    return {
      id: 'admin_eval',
      name: s.name || 'Executive Admin',
      speciality: 'Super Administrator · Clinician Evaluator',
      hospital: 'GILEAP Clinical Academy',
      city: 'Islamabad',
      pmdcId: 'SYS-ADMIN-EVAL',
      active: true
    };
  }
  return (ST.doctors || []).filter(function (d) { return d.id === s.doctorId; })[0] ||
         (ST.doctors && ST.doctors[0]) || null;
}
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
  if (!d.zoneId) d.zoneId = getZoneForCity(d.city);
  var zObj = (ST.zones || []).filter(function (z) { return z.id === d.zoneId; })[0];
  if (!d.zone) d.zone = zObj ? zObj.name : 'Central Zone - Lahore & Punjab Hubs';
  ST.doctors.push(d); progressOf(d.id); saveState();
  return '';
}
function setDoctorActive(id, active) { var d = ST.doctors.filter(function (x) { return x.id === id; })[0]; if (d) { d.active = active; saveState(); } }
function updateDoctor(id, updates) {
  var d = ST.doctors.filter(function (x) { return x.id === id; })[0];
  if (!d) return 'Doctor not found.';
  Object.keys(updates || {}).forEach(function (k) { d[k] = updates[k]; });
  if (updates.zoneId && !updates.zone) {
    var zObj = (ST.zones || []).filter(function (z) { return z.id === updates.zoneId; })[0];
    if (zObj) d.zone = zObj.name;
  }
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

/* ---- Regional Clinical Trial Zones ---- */
function zones() {
  if (!ST.zones || !ST.zones.length) {
    ST.zones = seedInitialZones();
    try { saveState(); } catch (e) { }
  }
  return ST.zones || [];
}
function zone(id) { return (ST.zones || []).filter(function (z) { return z.id === id; })[0] || null; }
function addZone(z) {
  if (!z.id) z.id = 'z-' + (z.code ? z.code.toLowerCase().replace(/[^a-z0-9]/g, '-') : Date.now());
  if ((ST.zones || []).some(function (x) { return x.id === z.id || x.name.toLowerCase() === z.name.toLowerCase(); })) {
    return 'A zone with this name or code already exists.';
  }
  z.targetEnrollment = parseInt(z.targetEnrollment, 10) || 50;
  z.activeStatus = z.activeStatus || 'active';
  if (typeof z.cities === 'string') {
    z.cities = z.cities.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
  }
  ST.zones = ST.zones || [];
  ST.zones.push(z);
  saveState();
  return null;
}
function updateZone(id, updates) {
  var z = (ST.zones || []).filter(function (x) { return x.id === id; })[0];
  if (!z) return 'Zone not found.';
  if (typeof updates.cities === 'string') {
    updates.cities = updates.cities.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
  }
  if (updates.targetEnrollment) {
    updates.targetEnrollment = parseInt(updates.targetEnrollment, 10) || z.targetEnrollment;
  }
  Object.keys(updates || {}).forEach(function (k) { z[k] = updates[k]; });
  saveState();
  return null;
}
function deleteZone(id) {
  var idx = -1;
  for (var i = 0; i < (ST.zones || []).length; i++) {
    if (ST.zones[i].id === id) { idx = i; break; }
  }
  if (idx > -1) {
    ST.zones.splice(idx, 1);
    saveState();
    return true;
  }
  return false;
}

function setPublished(id, flag) { var c = course(id); if (c) { c.published = flag; ST.published[id] = flag; saveState(); } }
function saveSettings(quiz, cert) { ST.settings.quiz = quiz; ST.settings.certificate = cert; saveState(); }

/* ---- Course Assignment Engine ---- */
function assignCourse(courseId, target) {
  var c = course(courseId);
  if (!c) return { success: false, error: 'Course not found.' };
  c.assignedDoctors = c.assignedDoctors || [];

  var allDocs = ST.doctors.filter(function (d) { return d.active; });
  var matched = [];

  if (Array.isArray(target)) {
    matched = allDocs.filter(function (d) { return target.indexOf(d.id) > -1; });
  } else if (target && target.mode === 'doctor') {
    matched = allDocs.filter(function (d) { return d.id === target.doctorId; });
  } else if (target && (target.mode === 'zone' || target.mode === 'region')) {
    var zoneVal = String(target.zoneId || target.zone || target.city || '').trim().toLowerCase();
    matched = allDocs.filter(function (d) {
      return (d.zoneId && String(d.zoneId).toLowerCase() === zoneVal) ||
             (d.zone && String(d.zone).toLowerCase().indexOf(zoneVal) > -1) ||
             (d.city && String(d.city).trim().toLowerCase() === zoneVal);
    });
  } else if (target && target.mode === 'specialty') {
    var specQuery = String(target.specialty || '').trim().toLowerCase();
    matched = allDocs.filter(function (d) {
      return String(d.speciality || '').toLowerCase().indexOf(specQuery) > -1;
    });
  } else if (target && target.mode === 'all') {
    matched = allDocs;
  } else if (typeof target === 'string') {
    matched = allDocs.filter(function (d) { return d.id === target; });
  }

  if (matched.length === 0) return { success: false, error: 'No matching active doctors found.' };

  var nowIso = new Date().toISOString().slice(0, 10);
  var newCount = 0;

  matched.forEach(function (d) {
    d.assignedCourses = d.assignedCourses || [];
    if (d.assignedCourses.indexOf(courseId) === -1) {
      d.assignedCourses.push(courseId);
      newCount++;
    }
    if (c.assignedDoctors.indexOf(d.id) === -1) {
      c.assignedDoctors.push(d.id);
    }
    d.courseNotifications = d.courseNotifications || [];
    d.courseNotifications.unshift({
      id: 'notif_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      courseId: courseId,
      courseTitle: c.title,
      assignedAt: nowIso,
      read: false,
      note: (target && target.note) ? target.note : 'Mandatory CME assignment by Administration.'
    });
  });

  saveState();
  return { success: true, count: matched.length, newCount: newCount, doctors: matched };
}

function assignedCoursesOf(doctorId) {
  var d = (ST.doctors || []).filter(function (x) { return x.id === doctorId; })[0];
  if (!d) return [];
  return courses().filter(function (c) {
    return (d.assignedCourses && d.assignedCourses.indexOf(c.id) > -1) ||
           (c.assignedDoctors && c.assignedDoctors.indexOf(doctorId) > -1);
  });
}

function assignedDoctorsOf(courseId) {
  var c = course(courseId);
  if (!c) return [];
  return (ST.doctors || []).filter(function (d) {
    return (c.assignedDoctors && c.assignedDoctors.indexOf(d.id) > -1) ||
           (d.assignedCourses && d.assignedCourses.indexOf(courseId) > -1);
  });
}

function markCourseNotificationRead(doctorId, notifId) {
  var d = (ST.doctors || []).filter(function (x) { return x.id === doctorId; })[0];
  if (!d || !d.courseNotifications) return;
  d.courseNotifications.forEach(function (n) {
    if (!notifId || n.id === notifId) n.read = true;
  });
  saveState();
}

loadState();
