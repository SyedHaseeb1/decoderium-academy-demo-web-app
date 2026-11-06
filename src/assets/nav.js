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
      '<div class="side-brand-wrap">' +
        '<div class="side-brand-title">' +
          '<div class="side-brand-logo"><img src="../assets/decoderium-mark.svg" alt="Decoderium Mark"></div>' +
          '<div class="side-brand-text">' +
            '<div class="side-brand-name">Decoderium</div>' +
            '<div class="side-brand-sub">Medical Academy</div>' +
          '</div>' +
        '</div>' +
        '<button type="button" class="side-collapse-toggle" id="sideCollapseToggle" aria-label="Collapse sidebar" title="Collapse sidebar">' +
          '<i class="ms" id="sideCollapseIcon">menu_open</i>' +
        '</button>' +
      '</div>' +

      '<div class="side-user-header">' +
        '<div class="side-user-avatar">' +
          esc(initials(name)) +
        '</div>' +
        '<div class="side-user-info">' +
          '<div style="font-size:14px;font-weight:800;color:var(--navy);">Hi ' + esc(firstName) + '</div>' +
          '<div style="font-size:11px;color:var(--slate);">' + (s.role === 'admin' ? 'Administrator' : 'Physician') + '</div>' +
        '</div>' +
      '</div>' +

      '<div class="side-floating-nav">' +
        navItems.map(function (item) {
          var on = item.key === cur;
          return '<a class="nav' + (on ? ' active' : '') + '" href="' + item.href + '" data-key="' + item.key + '" title="' + esc(item.label) + '">' +
            '<i class="ms">' + item.icon + '</i>' +
            '<span class="nav-text">' + item.label + '</span>' +
          '</a>';
        }).join('') +
      '</div>' +
    '</div>' +

    '<div class="side-bottom-wrap">' +
      '<div class="side-pmdc-card" title="PMDC Verified: ' + (d ? esc(d.pmdcId) : 'Licensed Doctor') + '">' +
        '<div class="side-pmdc-icon"><i class="ms">verified</i></div>' +
        '<div class="side-pmdc-info" style="min-width:0;flex:1;">' +
          '<div style="font-size:12px;font-weight:800;color:var(--navy);">PMDC Verified</div>' +
          '<div style="font-size:10.5px;color:var(--slate);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + (d ? esc(d.pmdcId) : 'Licensed Doctor') + '</div>' +
        '</div>' +
      '</div>' +

      '<button type="button" class="btn side-logout-btn" id="navOut" title="Sign out">' +
        '<i class="ms" style="font-size:18px;">logout</i> <span class="side-logout-text">Sign out</span>' +
      '</button>' +
    '</div>';

  var btnOut = document.getElementById('navOut');
  if (btnOut) {
    btnOut.onclick = function () { signOut('../login/'); };
  }

  /* 2. Setup Collapsible Sidebar Handler & Persistence */
  var appEl = document.getElementById('app') || document.body;
  var colBtn = document.getElementById('sideCollapseToggle');
  var colIcon = document.getElementById('sideCollapseIcon');

  function syncCollapseUI(isCol) {
    if (colIcon) {
      colIcon.textContent = isCol ? 'menu' : 'menu_open';
    }
    if (colBtn) {
      colBtn.setAttribute('title', isCol ? 'Expand sidebar' : 'Collapse sidebar');
      colBtn.setAttribute('aria-label', isCol ? 'Expand sidebar' : 'Collapse sidebar');
    }
  }

  window.toggleAcademySidebar = function () {
    var isCol = appEl.classList.toggle('collapsed');
    root.classList.toggle('collapsed', isCol);
    try {
      localStorage.setItem('side_collapsed', isCol ? '1' : '0');
    } catch (e) {}
    syncCollapseUI(isCol);
  };

  if (colBtn) {
    colBtn.onclick = function (e) {
      e.preventDefault();
      window.toggleAcademySidebar();
    };
  }

  // Restore stored collapse preference on load
  try {
    if (localStorage.getItem('side_collapsed') === '1' && window.innerWidth > 1024) {
      appEl.classList.add('collapsed');
      root.classList.add('collapsed');
      syncCollapseUI(true);
    }
  } catch (e) {}

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
