# STAND-HF Academy: UI Prototype (agent and developer rules)

This is the clickable prototype we show the client first. The Blazor app (`../StandHF.Academy.*`) follows what the client approves here. It is built the same way as the STAND-HF registry demo (`decoderium-stand-hf-demo-web-app`).

## What this folder is

- A static front end: HTML, CSS and vanilla JavaScript. **No build step, no npm, no framework.**
- Sample data only. Nothing is sent anywhere. Progress and edits live in the browser (`localStorage`).
- The place where UI, flow and rules change first. The Blazor app mirrors it.

## Run it

Data files are fetched, so it needs a web server (as the registry demo does). From this folder:

```bash
python -m http.server 5200
```

Open http://localhost:5200/. Opening `index.html` straight from disk shows a clear "open from a web server" page. GitHub Pages works as is (`.nojekyll` and `404.html` are included).

## Structure

```
index.html            redirects to login/
login/                sign-in (Doctor / Administrator tabs, demo accounts)
home/                 doctor dashboard
courses/              course list; #c1 shows one course and its modules
lecture/?id=…         lecture player (timer, not real video)
quiz/?m=…             timed module quiz, result and review
certificates/         certificate list; #c1 shows one certificate
verify/               public certificate check (no sign-in)
admin/                #overview #courses #courses/c1 #doctors #reports #settings
error/, 404.html      error pages (boot.js redirects here when data fails to load)
assets/
  base.css            the registry's design system (copied, do not edit; extend in academy.css)
  academy.css         Academy additions (course cards, modules, player, quiz, certificate)
  boot.js             loads data/*.json into window.ACADEMY_DATA, then runs the page scripts in order
  ui.js               $, esc, date and duration formatting, snack (toast)
  rules.js            business rules (unlocking, 90% lecture rule, scoring, certificate number)
  access.js           session, demo database in localStorage, all the actions a screen can call
  views.js            shared view builders (course card, breadcrumbs, next step)
  header.js, nav.js   top bar and side menu (same classes as the registry)
data/                 courses.json, questions.json, doctors.json, settings.json (see data/README.md)
```

## Rules for changes

1. **Keep the registry look.** Use the classes in `assets/base.css` (`.app`, `.side`, `.nav`, `.hello`, `.kpis` / `.kpi`, `.card`, `.btn` / `.btn.primary`, `.tag`, `.table-wrap`, `.field`, `.segment`, `.snack`). Add new classes to `academy.css` only, using the same tokens (`var(--primary)`, `var(--card)`, `var(--ink)`, `var(--line)`, `var(--success)`, `var(--error)`).
2. **Icons** are Material Symbols Rounded: `<i class="ms">school</i>`. Fonts are self-hosted in `assets/fonts/`.
3. **Touch targets** are at least 44 px. The first device is a phone. Check 1024 px, 768 px and under 640 px.
4. **Script order on every protected page** (as in the registry): `boot.js`, then placeholders for `ui.js`, `rules.js`, `access.js`, `views.js`, then the page's inline script, then `header.js` and `nav.js`. The page script starts with `if (!requireRole('doctor')) return;` (or `'admin'`).
5. **Rules live in `assets/rules.js`.** Do not put business rules inside a page. A rule change goes here first, then into `CHANGES.md`, then into `StandHF.Academy.Shared/Rules/Rules.cs`.
6. **Data lives in `data/*.json`.** Do not hard-code courses, questions or people in a page.
7. **Server-side thinking:** the quiz answers, the quiz timer and certificate numbers would be decided by the server in the live system. Keep them behind the functions in `access.js` so a screen never needs to know.
8. **Log every client-driven change in `CHANGES.md`** in the same commit.

## Demo accounts

Password is any value. `ayesha.khan` (mid-course), `bilal.ahmed` (one quiz from a certificate), `admin` (administrator). "Reset demo data" in the profile menu restores the sample data.
