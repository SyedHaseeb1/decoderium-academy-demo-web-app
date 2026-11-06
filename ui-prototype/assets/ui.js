/* Small shared helpers: DOM shortcuts, formatting, toast. */
var $ = function (s, r) { return (r || document).querySelector(s); };
var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

/* 9:05 */
function fmtClock(sec) { var s = Math.max(0, Math.floor(sec)); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
/* 9 min, or 1 h 20 min */
function fmtDur(sec) {
  var m = Math.round(sec / 60);
  if (m < 60) return Math.max(1, m) + ' min';
  var h = Math.floor(m / 60), r = m % 60;
  return r ? h + ' h ' + r + ' min' : h + ' h';
}
function fmtDate(v) {
  var d = typeof v === 'number' ? new Date(v) : new Date(String(v).length <= 10 ? v + 'T00:00:00' : v);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
function initials(name) {
  var p = String(name || '').split(/\s+/).filter(function (w) { return w && !/\.$/.test(w); });
  return (p.slice(0, 2).map(function (w) { return w[0].toUpperCase(); }).join('')) || '?';
}

/* Toast: needs <div class="snack" id="snack"></div> on the page (the shared scripts add it if missing). */
var snackTimer;
function snack(msg) {
  var el = document.getElementById('snack');
  if (!el) { el = document.createElement('div'); el.className = 'snack'; el.id = 'snack'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(snackTimer);
  snackTimer = setTimeout(function () { el.classList.remove('show'); }, 3200);
}

/* Modern Sliding Alert Side Cards for Physicians */
function sideAlert(title, message, type) {
  type = type || 'info';
  var host = document.getElementById('sideAlertHost');
  if (!host) {
    host = document.createElement('div');
    host.id = 'sideAlertHost';
    host.className = 'side-alert-container';
    document.body.appendChild(host);
  }

  var iconMap = {
    info: 'info',
    success: 'verified',
    warning: 'warning_amber',
    cme: 'military_tech',
    pmdc: 'verified_user'
  };

  var icon = iconMap[type] || 'notifications_none';
  var card = document.createElement('div');
  card.className = 'side-alert-card side-alert-' + type + ' animate-slide-left';
  card.innerHTML =
    '<div class="side-alert-icon-wrap"><i class="ms">' + icon + '</i></div>' +
    '<div class="side-alert-body">' +
      '<div class="side-alert-title">' + esc(title) + '</div>' +
      '<div class="side-alert-msg">' + esc(message) + '</div>' +
    '</div>' +
    '<button type="button" class="side-alert-close" aria-label="Dismiss alert">&times;</button>';

  card.querySelector('.side-alert-close').onclick = function () {
    card.classList.add('side-alert-fade-out');
    setTimeout(function () { if (card.parentNode) card.parentNode.removeChild(card); }, 250);
  };

  host.appendChild(card);

  setTimeout(function () {
    if (card.parentNode) {
      card.classList.add('side-alert-fade-out');
      setTimeout(function () { if (card.parentNode) card.parentNode.removeChild(card); }, 250);
    }
  }, 5000);
}

/* High-End Modal Dialogs for Clinical Assessments & Actions */
function openDialog(opts) {
  closeDialog();
  var title = opts.title || 'Notice';
  var body = opts.body || '';
  var confirmText = opts.confirmText || 'Confirm';
  var cancelText = opts.cancelText || 'Cancel';
  var onConfirm = opts.onConfirm;

  var overlay = document.createElement('div');
  overlay.id = 'activeDialogOverlay';
  overlay.className = 'lms-dialog-overlay';

  overlay.innerHTML =
    '<div class="lms-dialog-card animate-scale-up" role="dialog" aria-modal="true">' +
      '<div class="lms-dialog-header">' +
        '<h3 class="lms-dialog-title">' + esc(title) + '</h3>' +
        '<button type="button" class="lms-dialog-close" id="dlgCloseBtn" aria-label="Close dialog">&times;</button>' +
      '</div>' +
      '<div class="lms-dialog-body">' + body + '</div>' +
      '<div class="lms-dialog-footer">' +
        (cancelText ? '<button type="button" class="btn-pill-outline" id="dlgCancelBtn">' + esc(cancelText) + '</button>' : '') +
        (confirmText ? '<button type="button" class="btn-pill-primary" id="dlgConfirmBtn">' + esc(confirmText) + '</button>' : '') +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);

  var doClose = function () { closeDialog(); };
  overlay.querySelector('#dlgCloseBtn').onclick = doClose;
  if (overlay.querySelector('#dlgCancelBtn')) overlay.querySelector('#dlgCancelBtn').onclick = doClose;
  if (overlay.querySelector('#dlgConfirmBtn')) {
    overlay.querySelector('#dlgConfirmBtn').onclick = function () {
      if (onConfirm) onConfirm();
      doClose();
    };
  }

  overlay.onclick = function (e) {
    if (e.target === overlay) doClose();
  };
}

function closeDialog() {
  var ex = document.getElementById('activeDialogOverlay');
  if (ex && ex.parentNode) ex.parentNode.removeChild(ex);
}

/* Course accent colours (the modern palette) */
var ACCENTS = ['#582be8', '#3b82f6', '#10b981', '#ec4899'];
