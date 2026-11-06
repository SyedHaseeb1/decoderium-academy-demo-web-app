/* Shared navigation component:
   - Renders desktop & tablet sidebar into #side with smooth collapsible drawer.
   - Injects ergonomic mobile bottom navigation bar into body for mobile-first doctors. */
(function () {
  var root = document.getElementById('side');
  if (!root) return;
  var s = session(), d = me(), page = document.body.dataset.page;
  var name = s.name || (d ? d.name : 'Clinician');
  var firstName = name.replace(/^Dr\.\s*/i, '').split(' ')[0] || 'Doctor';

  var navItems = s.role === 'admin' ? [
    { key: 'admin-overview', label: 'Dashboard', href: '../admin/#overview', icon: 'space_dashboard' },
    { key: 'admin-courses', label: 'Courses', href: '../admin/#courses', icon: 'video_library' },
    { key: 'admin-doctors', label: 'Doctors', href: '../admin/#doctors', icon: 'group' },
    { key: 'admin-reports', label: 'Reports', href: '../admin/#reports', icon: 'monitoring' },
    { key: 'admin-settings', label: 'Settings', href: '../admin/#settings', icon: 'tune' }
  ] : [
    { key: 'home', label: 'Dashboard', href: '../home/', icon: 'space_dashboard' },
    { key: 'courses', label: 'My Courses', href: '../courses/', icon: 'menu_book' },
    { key: 'certificates', label: 'Certificates', href: '../certificates/', icon: 'workspace_premium' },
    { key: 'verify', label: 'Verify PMDC', href: '../verify/', icon: 'verified' }
  ];

  var current = function () {
    if (s.role === 'admin') {
      var h = location.hash.slice(1).split('/')[0];
      return ['overview', 'courses', 'doctors', 'reports', 'settings'].indexOf(h) > -1 ? 'admin-' + h : 'admin-overview';
    }
    return page;
  };

  var cur = current();

  /* 1. Render Left Sidebar Component */
  root.innerHTML =
    '<div>' +
      '<div class="side-brand-wrap" style="margin-bottom:20px;">' +
        '<div style="font-size:18px;font-weight:800;color:var(--navy);letter-spacing:-0.3px;">Decoderium</div>' +
        '<div style="font-size:11px;color:var(--slate);font-weight:600;">Heart Failure Academy</div>' +
      '</div>' +

      '<div class="side-user-header" style="display:flex;align-items:center;gap:10px;margin-bottom:24px;">' +
        '<div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#ff4760,#e60057);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;box-shadow:var(--shadow-sm);">' +
          esc(initials(name)) +
        '</div>' +
        '<div>' +
          '<div style="font-size:14px;font-weight:800;color:var(--navy);">Hi ' + esc(firstName) + '</div>' +
          '<div style="font-size:11px;color:var(--slate);">' + (s.role === 'admin' ? 'Administrator' : 'Physician') + '</div>' +
        '</div>' +
      '</div>' +

      '<div class="side-floating-nav" style="background:#fff;border:1px solid var(--line);border-radius:var(--radius-lg);padding:8px;box-shadow:var(--shadow-xs);display:flex;flex-direction:column;gap:4px;">' +
        navItems.map(function (item) {
          var on = item.key === cur;
          return '<a class="nav' + (on ? ' active' : '') + '" href="' + item.href + '" data-key="' + item.key + '" style="display:flex;align-items:center;gap:12px;padding:10px 14px;border-radius:var(--radius-md);font-size:13px;font-weight:600;text-decoration:none;transition:all 0.2s ease;' + (on ? 'background:var(--navy);color:#fff;' : 'color:var(--slate);') + '">' +
            '<i class="ms" style="font-size:20px;' + (on ? 'color:#fff;' : 'color:var(--slate);') + '">' + item.icon + '</i>' +
            '<span>' + item.label + '</span>' +
          '</a>';
        }).join('') +
      '</div>' +
    '</div>' +

    '<div style="display:flex;flex-direction:column;gap:10px;">' +
      '<div style="background:#fff;border:1px solid var(--line);border-radius:var(--radius-md);padding:14px;display:flex;align-items:center;gap:10px;box-shadow:var(--shadow-xs);">' +
        '<div style="width:34px;height:34px;border-radius:50%;background:#ecfdf5;color:#059669;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;"><i class="ms">verified</i></div>' +
        '<div style="min-width:0;flex:1;">' +
          '<div style="font-size:12px;font-weight:800;color:var(--navy);">PMDC Verified</div>' +
          '<div style="font-size:10.5px;color:var(--slate);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + (d ? esc(d.pmdcId) : 'Licensed Doctor') + '</div>' +
        '</div>' +
      '</div>' +

      '<button type="button" class="btn" id="navOut" style="width:100%;justify-content:center;background:#fff;border:1px solid var(--line);border-radius:var(--radius-pill);font-size:12px;padding:8px;font-weight:700;">' +
        '<i class="ms" style="font-size:16px;">logout</i> Sign out' +
      '</button>' +
    '</div>';

  var btnOut = document.getElementById('navOut');
  if (btnOut) {
    btnOut.onclick = function () { signOut('../login/'); };
  }

  /* 2. Inject Mobile Drawer Scrim */
  var scrim = document.getElementById('drawerScrim');
  if (!scrim) {
    scrim = document.createElement('div');
    scrim.id = 'drawerScrim';
    scrim.className = 'drawer-scrim';
    scrim.style.display = 'none';
    document.body.appendChild(scrim);
    scrim.onclick = function () {
      root.classList.remove('open');
      scrim.style.display = 'none';
    };
  }

  /* 3. Inject Ergonomic Mobile Bottom Bar for Tablets/Smartphones */
  var bNav = document.getElementById('mobileBottomNav');
  if (!bNav) {
    bNav = document.createElement('nav');
    bNav.id = 'mobileBottomNav';
    bNav.className = 'mobile-bottom-nav';
    bNav.setAttribute('aria-label', 'Mobile navigation');

    var mobileLinks = s.role === 'admin' ? [
      { key: 'admin-overview', label: 'Overview', href: '../admin/#overview', icon: 'space_dashboard' },
      { key: 'admin-courses', label: 'Courses', href: '../admin/#courses', icon: 'video_library' },
      { key: 'admin-doctors', label: 'Doctors', href: '../admin/#doctors', icon: 'group' },
      { key: 'admin-settings', label: 'Settings', href: '../admin/#settings', icon: 'tune' }
    ] : [
      { key: 'home', label: 'Home', href: '../home/', icon: 'space_dashboard' },
      { key: 'courses', label: 'Courses', href: '../courses/', icon: 'menu_book' },
      { key: 'certificates', label: 'Certs', href: '../certificates/', icon: 'workspace_premium' },
      { key: 'verify', label: 'Verify', href: '../verify/', icon: 'verified' }
    ];

    bNav.innerHTML = mobileLinks.map(function (item) {
      var on = item.key === cur;
      return '<a href="' + item.href + '" class="mobile-nav-link' + (on ? ' active' : '') + '">' +
        '<i class="ms">' + item.icon + '</i>' +
        '<span>' + item.label + '</span>' +
      '</a>';
    }).join('');

    document.body.appendChild(bNav);
  }

  /* Update active state on hashchange */
  window.academyUpdateNav = function () {
    var c = current();
    [].forEach.call(root.querySelectorAll('a.nav[data-key]'), function (a) {
      var on = a.dataset.key === c;
      a.classList.toggle('active', on);
      if (on) {
        a.style.background = 'var(--navy)';
        a.style.color = '#fff';
      } else {
        a.style.background = 'transparent';
        a.style.color = 'var(--slate)';
      }
    });
  };
  window.addEventListener('hashchange', window.academyUpdateNav);
})();
