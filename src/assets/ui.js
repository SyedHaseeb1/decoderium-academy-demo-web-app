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

/* Modern Sliding Alert Side Cards for Doctors */
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

  var extraClass = (opts.wide ? ' adm-dialog-wide' : '') + (opts.dialogClass ? ' ' + opts.dialogClass : '');
  overlay.innerHTML =
    '<div class="lms-dialog-card' + extraClass + ' animate-scale-up" role="dialog" aria-modal="true">' +
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
  document.body.classList.add('modal-open');
  document.body.style.overflow = 'hidden';

  var doClose = function () { closeDialog(); };
  overlay.querySelector('#dlgCloseBtn').onclick = doClose;
  if (overlay.querySelector('#dlgCancelBtn')) overlay.querySelector('#dlgCancelBtn').onclick = doClose;
  if (overlay.querySelector('#dlgConfirmBtn')) {
    overlay.querySelector('#dlgConfirmBtn').onclick = function () {
      if (onConfirm) {
        var res = onConfirm();
        if (res === false) return;
      }
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
  if (!document.getElementById('activeDialogOverlay') && !document.querySelector('.adm-drawer.open')) {
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
  }
}

/* Unified Form & Field Validation System */
function validateField(inputEl) {
  if (!inputEl) return { valid: true };

  // Remove existing validation state
  inputEl.classList.remove('is-invalid');
  var parent = inputEl.closest('.adm-form-group') || inputEl.parentElement;
  if (parent) {
    var oldErr = parent.querySelector('.adm-field-error');
    if (oldErr) oldErr.remove();
  }

  var val = (inputEl.value || '').trim();
  var isReq = inputEl.hasAttribute('required') || inputEl.getAttribute('data-required') === 'true';
  var type = (inputEl.getAttribute('type') || '').toLowerCase();
  var min = inputEl.getAttribute('min');
  var max = inputEl.getAttribute('max');
  var minLen = inputEl.getAttribute('minlength');
  var maxLen = inputEl.getAttribute('maxlength');
  var fieldLabel = inputEl.getAttribute('data-label') || (parent && parent.querySelector('.adm-label') ? parent.querySelector('.adm-label').textContent.replace(/\*/g, '').trim() : 'This field');

  var errorMsg = '';

  // 1. Required Check
  if (isReq && !val) {
    errorMsg = fieldLabel + ' is required.';
  }
  // 2. Email Check
  else if (type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
    errorMsg = 'Please enter a valid email address.';
  }
  // 3. Number Bounds
  else if (type === 'number' && val) {
    var num = Number(val);
    if (isNaN(num)) {
      errorMsg = 'Please enter a valid number.';
    } else if (min !== null && num < Number(min)) {
      errorMsg = 'Value must be at least ' + min + '.';
    } else if (max !== null && num > Number(max)) {
      errorMsg = 'Value must be no more than ' + max + '.';
    }
  }
  // 4. URL Check
  else if (type === 'url' && val && !/^https?:\/\/.+/i.test(val)) {
    errorMsg = 'Please enter a valid URL starting with http:// or https://';
  }
  // 5. Length Constraints
  else if (minLen && val.length < parseInt(minLen, 10)) {
    errorMsg = 'Must be at least ' + minLen + ' characters.';
  } else if (maxLen && val.length > parseInt(maxLen, 10)) {
    errorMsg = 'Cannot exceed ' + maxLen + ' characters.';
  }

  if (errorMsg) {
    inputEl.classList.add('is-invalid');
    if (parent) {
      var errEl = document.createElement('div');
      errEl.className = 'adm-field-error';
      errEl.innerHTML = '<i class="ms" style="font-size:14px;">error_outline</i><span>' + esc(errorMsg) + '</span>';
      parent.appendChild(errEl);
    }

    var onInput = function () {
      inputEl.classList.remove('is-invalid');
      if (parent) {
        var e = parent.querySelector('.adm-field-error');
        if (e) e.remove();
      }
      inputEl.removeEventListener('input', onInput);
      inputEl.removeEventListener('change', onInput);
    };
    inputEl.addEventListener('input', onInput);
    inputEl.addEventListener('change', onInput);

    return { valid: false, message: errorMsg };
  }

  return { valid: true };
}

function validateForm(container) {
  var root = container || document;
  var selector = 'input[required], textarea[required], select[required], [data-required="true"], input[type="email"], input[type="number"], input[type="url"], [minlength], [maxlength]';
  var fields = [].slice.call(root.querySelectorAll(selector));
  var firstInvalid = null;
  var allValid = true;

  fields.forEach(function (field) {
    if (field.type === 'hidden' || field.disabled || field.offsetParent === null) return;
    var res = validateField(field);
    if (!res.valid) {
      allValid = false;
      if (!firstInvalid) firstInvalid = field;
    }
  });

  if (!allValid && firstInvalid) {
    try { firstInvalid.focus(); } catch (e) {}
    snack('Please correct the highlighted fields.');
  }

  return allValid;
}

/* Course accent colours (the modern palette) */
var ACCENTS = ['#582be8', '#3b82f6', '#10b981', '#ec4899'];
