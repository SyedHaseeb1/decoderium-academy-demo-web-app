/* Top App Header Component: Loads independently into #app-header.
   Features mobile menu hamburger, search pill, CME credit counter,
   and doctor profile dropdown with PMDC license identifier. */
(function () {
  var host = document.getElementById('app-header');
  if (!host) return;
  var s = session(), d = me();
  var isAdmin = s.role === 'admin';
  var name = s.name || (d ? d.name : 'Physician');

  host.className = 'app-header';
  host.innerHTML =
    '<header class="topbar">' +
      '<div style="display:flex;align-items:center;gap:16px;">' +
        '<button type="button" class="btn" id="mobileMenuBtn" style="display:none;width:40px;height:40px;border-radius:10px;padding:0;align-items:center;justify-content:center;border:1px solid var(--line);background:#fff;" aria-label="Toggle menu">' +
          '<i class="ms">menu</i>' +
        '</button>' +
        '<div>' +
          '<div style="font-size:17px;font-weight:800;color:var(--navy);letter-spacing:-0.3px;">Decoderium</div>' +
          '<div style="font-size:11px;color:var(--slate);font-weight:600;">Medical Education</div>' +
        '</div>' +
      '</div>' +

      '<div class="search-pill-box">' +
        '<i class="ms">search</i>' +
        '<input type="text" placeholder="Search heart failure modules, GDMT..." aria-label="Search curriculum">' +
      '</div>' +

      '<div style="display:flex;align-items:center;gap:12px;">' +
        '<button type="button" class="btn" id="headerAlertBtn" style="position:relative;width:40px;height:40px;border-radius:50%;padding:0;align-items:center;justify-content:center;border:1px solid var(--line);background:#fff;cursor:pointer;" title="Clinical & PMDC Alerts" aria-label="Notifications">' +
          '<i class="ms" style="font-size:20px;color:var(--slate);">notifications_none</i>' +
          '<span style="position:absolute;top:6px;right:6px;width:8px;height:8px;border-radius:50%;background:#ef4444;box-shadow:0 0 0 2px #fff;"></span>' +
        '</button>' +

        '<a href="../courses/" class="btn-pill-dark" style="font-size:12px;padding:7px 16px;">' +
          '<i class="ms" style="font-size:16px;color:#f59e0b;">military_tech</i>' +
          '<span>12 CME Hours</span>' +
        '</a>' +

        '<div class="profile-wrap" style="position:relative;">' +
          '<button type="button" id="profBtn" style="border:none;background:transparent;cursor:pointer;padding:2px;" aria-label="Doctor profile">' +
            '<div style="width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#ff4760,#e60057);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;box-shadow:var(--shadow-sm);">' +
              esc(initials(name)) +
            '</div>' +
          '</button>' +

          '<div class="profile-panel" id="profPanel" role="dialog" aria-label="Profile panel" hidden style="position:absolute;right:0;top:48px;width:260px;background:#fff;border:1px solid var(--line);border-radius:var(--radius-lg);padding:18px;box-shadow:var(--shadow-lg);z-index:1000;">' +
            '<div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid var(--line);">' +
              '<div style="width:40px;height:40px;border-radius:50%;background:var(--navy);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;">' + esc(initials(name)) + '</div>' +
              '<div>' +
                '<strong style="font-size:13.5px;color:var(--navy);display:block;">' + esc(name) + '</strong>' +
                '<small style="font-size:11.5px;color:var(--slate);">' + (isAdmin ? 'Administrator' : esc(d ? d.speciality : 'Physician')) + '</small>' +
              '</div>' +
            '</div>' +
            (d ?
              '<div style="font-size:12px;color:var(--slate);display:flex;flex-direction:column;gap:6px;margin-bottom:14px;">' +
                '<div>PMDC ID: <strong style="color:var(--navy);">' + esc(d.pmdcId) + '</strong></div>' +
                '<div>Hospital: <strong style="color:var(--navy);">' + esc(d.hospital) + '</strong></div>' +
              '</div>' : '') +
            '<button type="button" class="btn" id="bReset" style="width:100%;justify-content:center;margin-bottom:8px;font-size:12px;padding:8px;border-radius:var(--radius-pill);border:1px solid var(--line);">' +
              '<i class="ms" style="font-size:16px;">restart_alt</i> Reset demo data' +
            '</button>' +
            '<button type="button" class="btn-pill-primary" id="bOut" style="width:100%;padding:8px;font-size:12px;">' +
              '<i class="ms" style="font-size:16px;">logout</i> Sign out' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</header>';

  /* Wire notification alerts button */
  var alertBtn = document.getElementById('headerAlertBtn');
  if (alertBtn) {
    alertBtn.onclick = function () {
      sideAlert('PMDC License #48291-P Active', 'Your medical license is accredited for 2026 heart failure CME requirements.', 'pmdc');
      setTimeout(function () {
        sideAlert('Lecture Watch Threshold Reached', 'Module 1 (90% watch time) passed. Module Quiz is unlocked!', 'success');
      }, 350);
      setTimeout(function () {
        sideAlert('Guideline Consensus Updated', 'Quadruple GDMT therapy protocol published by Faculty.', 'cme');
      }, 700);
    };
  }

  /* Wire profile dropdown */
  var pp = document.getElementById('profPanel'), pb = document.getElementById('profBtn');
  if (pb && pp) {
    pb.onclick = function (e) {
      e.stopPropagation();
      pp.hidden = !pp.hidden;
    };
    document.addEventListener('click', function (e) {
      if (!pp.hidden && !e.target.closest('.profile-wrap')) pp.hidden = true;
    });
  }

  var btnReset = document.getElementById('bReset');
  if (btnReset) {
    btnReset.onclick = function () {
      if (typeof openDialog === 'function') {
        openDialog({
          title: 'Reset Demo Data?',
          body: '<p style="margin:0 0 10px;">This will reset all course progression, quiz attempts, and certificates back to the default physician state.</p><p style="margin:0;font-size:12px;color:var(--slate);">Do you wish to proceed?</p>',
          confirmText: 'Reset Now',
          cancelText: 'Cancel',
          onConfirm: function () {
            resetDemo();
            location.reload();
          }
        });
      } else {
        resetDemo();
        location.reload();
      }
    };
  }

  var btnOut = document.getElementById('bOut');
  if (btnOut) {
    btnOut.onclick = function () { signOut('../login/'); };
  }

  /* Responsive hamburger for tablet & mobile */
  var mBtn = document.getElementById('mobileMenuBtn');
  var side = document.getElementById('side');
  if (mBtn && side) {
    var checkMobile = function () {
      mBtn.style.display = window.innerWidth <= 1024 ? 'inline-flex' : 'none';
    };
    window.addEventListener('resize', checkMobile);
    checkMobile();

    mBtn.onclick = function () {
      side.classList.toggle('open');
      var scrim = document.getElementById('drawerScrim');
      if (scrim) scrim.style.display = side.classList.contains('open') ? 'block' : 'none';
    };
  }
})();
