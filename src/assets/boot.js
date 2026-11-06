/* Boot loader (same idea as the STAND-HF registry demo): fetches the data files in data/ first,
   then runs the page's scripts in document order. Load this file once, before the data-dependent scripts.
   Those are written as placeholders:
     <script type="text/plain" data-src="access.js"></script>   a file in assets/ (path relative to assets/)
     <script type="text/plain">…page code…</script>             inline code
   Data lands in window.ACADEMY_DATA. To move to the API, replace the fetches below with API calls and keep the same shape. */
(function () {
  var self = document.currentScript;
  var assetsUrl = new URL('.', self.src);
  var dataUrl = new URL('../data/', self.src);

  var fetchJson = function (name) {
    return fetch(new URL(name + '.json', dataUrl)).then(function (r) {
      if (!r.ok) throw new Error(name + '.json ' + r.status);
      return r.json();
    });
  };

  /* Data failed to load: send the user to the error page, which keeps their place (?from=). */
  var showError = function (err) {
    var here = location.pathname + location.search + location.hash;
    var u = new URL('../error/?from=' + encodeURIComponent(here), assetsUrl);
    if (err && err.message) u.searchParams.set('msg', err.message);
    if (location.protocol === 'file:') u.searchParams.set('code', 'file');
    location.replace(u.href);
  };

  var runNode = function (n) {
    var s = document.createElement('script');
    [].slice.call(n.attributes).forEach(function (a) {
      if (a.name !== 'type' && a.name !== 'data-src') s.setAttribute(a.name, a.value);
    });
    if (n.hasAttribute('data-src')) {
      return new Promise(function (resolve, reject) {
        s.onload = function () { resolve(); };
        s.onerror = function () { reject(new Error('Failed to load ' + n.getAttribute('data-src'))); };
        s.async = false;
        s.src = new URL(n.getAttribute('data-src'), assetsUrl).href;
        document.body.appendChild(s);
      });
    }
    s.textContent = n.textContent;
    document.body.appendChild(s);
    return Promise.resolve();
  };

  var ready = new Promise(function (resolve) {
    if (document.readyState !== 'loading') resolve();
    else document.addEventListener('DOMContentLoaded', function () { resolve(); });
  });

  Promise.all([ready, Promise.all([fetchJson('courses'), fetchJson('questions'), fetchJson('doctors'), fetchJson('settings')])])
    .then(function (res) {
      var d = res[1];
      window.ACADEMY_DATA = { courses: d[0].courses, questions: d[1], doctors: d[2], settings: d[3] };
      var nodes = [].slice.call(document.querySelectorAll('script[type="text/plain"]'));
      return nodes.reduce(function (p, n) { return p.then(function () { return runNode(n); }); }, Promise.resolve());
    })
    .catch(showError);
})();
