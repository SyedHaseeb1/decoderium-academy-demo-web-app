/* Shared view builders (HTML strings) used by more than one page. Load after access.js. */

function crumbs(items) {
  return '<nav class="crumbs" aria-label="Breadcrumb">' + items.map(function (i, n) {
    var last = n === items.length - 1;
    return (i.href && !last ? '<a href="' + i.href + '">' + esc(i.label) + '</a>' : '<span>' + esc(i.label) + '</span>') + (last ? '' : '<i class="ms">chevron_right</i>');
  }).join('') + '</nav>';
}

function courseStatus(c, p) {
  if (RULES.courseComplete(c, p)) return 'Completed';
  return RULES.courseStarted(c, p) ? 'In progress' : 'Not started';
}

function courseCard(c, p) {
  var pc = RULES.percent(c, p), done = RULES.courseComplete(c, p), started = RULES.courseStarted(c, p);
  var head = '<div class="crs-head" style="background:linear-gradient(135deg,' + c.accent + ',#1b1d22)"><span class="tag">' + esc(c.category + ' · ' + c.level) + '</span><h2>' + esc(c.title) + '</h2><small>' + esc(c.subtitle) + '</small></div>';
  var meta = '<div class="crs-meta"><span><i class="ms">layers</i>' + c.modules.length + ' modules</span><span><i class="ms">videocam</i>' + RULES.lectureCount(c) + ' lectures</span><span><i class="ms">schedule</i>' + fmtDur(RULES.totalSeconds(c)) + '</span></div>';
  if (!c.published) return '<article class="card crs">' + head + '<div class="crs-body">' + meta + '<span class="tag warn" style="align-self:flex-start">Coming soon</span><p class="muted">' + esc(c.description) + '</p></div></article>';
  return '<article class="card crs">' + head + '<div class="crs-body">' + meta + '<p class="muted">' + esc(c.description) + '</p>' +
    '<div><div class="row-between" style="font-size:13px"><b>' + courseStatus(c, p) + '</b><span class="muted">' + pc + '%</span></div><div class="bar' + (done ? ' done' : '') + '" style="margin-top:6px"><span style="width:' + pc + '%"></span></div></div>' +
    '<a class="btn ' + (done ? '' : 'primary') + '" href="../courses/#' + c.id + '"><i class="ms">' + (done ? 'visibility' : 'play_arrow') + '</i>' + (done ? 'View course' : started ? 'Continue' : 'Start course') + '</a></div></article>';
}

/* The next thing a doctor should do: a quiz that is waiting, else the next lecture. */
function nextStep(c, p) {
  var q = RULES.pendingQuiz(c, p);
  if (q) return { title: 'Module ' + q.number + ' quiz is ready', sub: c.title, href: '../quiz/?m=' + q.id, label: 'Start quiz', icon: 'quiz' };
  var l = RULES.nextLecture(c, p);
  if (l) return { title: l.title, sub: c.title, href: '../lecture/?id=' + l.id, label: 'Resume', icon: 'play_arrow' };
  return null;
}
