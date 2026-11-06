# STAND-HF Academy — Project Context & Architecture Reference

> **Document Status**: Grounded Architecture Reference  
> **Last Verified**: 2026-11-06  
> **Scope**: Stand-HF Academy UI Prototype & Core Domain Rules

---

## 1. Project Overview

- **Project Name**: Education & LMS Platform (Working Title / Name TBD — not yet finalized)
- **Ecosystem**: Education and certification companion to **Standhf.pk** (the Heart Failure Clinical Registry initiative built by Abrar for Decoderium Technologies).
- **Core Purpose**: An interactive online training and certification portal for medical doctors. The platform provides modular video curriculum, enforced completion gates (90% watch threshold), randomized timed module quizzes, deterministic certificate generation (PMDC verification), and administrative oversight.
- **Project Role**: This repository hosts the approved UI prototype and domain rules engine. It acts as the interactive specification and behavioral contract that the production .NET 8 / Blazor WebAssembly application (`StandHF.Academy.*`) mirrors.

---

## 2. Technology Stack

### Confirmed Stack (In-Repo)
- **Frontend Architecture**: Pure Vanilla Web Technologies — HTML5, CSS3, Vanilla JavaScript (ES5/ES6+ compatible).
- **Build System**: None (zero build step, zero npm dependencies, no bundler, no transpiler).
- **Persistence & State**:
  - Session state: Browser `sessionStorage` (`academy_auth`, `academy_role`, `academy_doctor`, `academy_name`).
  - Persistent mock database: Browser `localStorage` (`academy_state_v1`).
- **Static Asset Serving**: Standard HTTP servers (e.g. `python -m http.server 5200`, Nginx, GitHub Pages).
- **Typography & Icons**: Self-hosted WOFF2 fonts (`Roboto`, `Material Symbols Rounded`) under `assets/fonts/`.
- **Validation & Tooling**: Node.js (`node -c`) for static JS syntax checks; Python 3 for JSON dataset validation.

### Companion / Target Production Stack (Documented in HANDOFF.md)
- **Backend / Production Framework**: ASP.NET Core 8 Web API with Blazor WebAssembly (`StandHF.Academy.*`).
- **Domain Sharing**: Shared C# rules (`StandHF.Academy.Shared/Rules/Rules.cs`) mirroring `assets/rules.js`.

---

## 3. Repository & Module Structure

```
Stand-HF/
├── AGENTS.md                          # Master Autonomous Engineering Instructions (SSOT)
├── PROJECT_CONTEXT.md                 # This architecture & context reference
├── standhf-academy-ui-prototype.zip   # Preserved distribution archive
└── ui-prototype/                      # STAND-HF Academy UI Prototype Codebase
    ├── AGENTS.md                      # UI-specific rules & developer conventions
    ├── HANDOFF.md                     # API contract & Blazor migration specification
    ├── CHANGES.md                     # Client feedback & change tracker
    ├── README.md                      # Quick start & local execution guide
    ├── run.bat                        # Windows launcher script
    ├── 404.html, index.html           # Entry redirection and fallback
    ├── login/                         # Sign-in portal (Doctor vs Admin demo logins)
    ├── home/                          # Doctor dashboard (progress, next action)
    ├── courses/                       # Course catalog and course detail (#c1)
    ├── lecture/                       # Video lecture player (?id=...) with timer
    ├── quiz/                          # Module timed quiz (?m=...) with timer & scoring
    ├── certificates/                  # Certificate gallery and single view (#c1)
    ├── verify/                        # Public certificate check portal (?cert=...)
    ├── admin/                         # Admin portal (#overview, #courses, #doctors, #reports, #settings)
    ├── error/                         # Resilient boot error page
    ├── assets/
    │   ├── boot.js                    # Async loader for data/*.json -> window.ACADEMY_DATA
    │   ├── rules.js                   # Canonical business logic engine (RULES object)
    │   ├── access.js                  # Data abstraction layer & localStorage mock DB
    │   ├── ui.js                      # DOM utilities, formatters, toast notifications
    │   ├── views.js                   # Reusable HTML view renderers (cards, crumbs, nextStep)
    │   ├── header.js                  # Global responsive header & profile drawer
    │   ├── nav.js                     # Global responsive navigation menu
    │   ├── base.css                   # STAND-HF Registry design system styles
    │   ├── academy.css                # Academy-specific layout & component styling
    │   ├── STAND-HF-logo.svg          # Vector brand asset
    │   └── fonts/                     # Self-hosted Roboto and Material Symbols fonts
    └── data/
        ├── README.md                  # Data schema documentation
        ├── courses.json               # Courses, modules, lectures definition
        ├── questions.json             # 20-question randomized test pool
        ├── doctors.json               # Seed doctor accounts & admin profile
        └── settings.json              # Passing thresholds, timers, certificate metadata
```

---

## 4. Important Entry Points

1. **`ui-prototype/index.html`**:
   - Immediate redirect to `login/`.
2. **`ui-prototype/login/index.html`**:
   - Dual-tab authentication interface (`doctor` vs `admin`).
   - Provides 1-click demo accounts (`ayesha.khan`, `bilal.ahmed`, `admin`).
3. **`ui-prototype/home/index.html`**:
   - Primary doctor landing view. Displays KPIs, resume button, and enrolled course cards.
4. **`ui-prototype/courses/index.html`**:
   - Course catalog at root; single course details and module status at `#<courseId>` (e.g. `#c1`).
5. **`ui-prototype/lecture/index.html?id=<lectureId>`**:
   - Video player simulation with 30x accelerated timer, scrubbing prevention past watched mark, and auto-completion.
6. **`ui-prototype/quiz/index.html?m=<moduleId>`**:
   - Timed quiz interface with active clock preservation across page refreshes.
7. **`ui-prototype/verify/index.html?cert=<codeOrHash>`**:
   - Public unauthenticated portal to verify authenticity of doctor certificates.
8. **`ui-prototype/admin/index.html#<section>`**:
   - Administrative portal hash-routed between `#overview`, `#courses`, `#doctors`, `#reports`, and `#settings`.

---

## 5. Architectural Boundaries & Data Flow

### Prototype Architecture
```
┌────────────────────────────────────────────────────────┐
│                      HTML Screen                       │
│  (login, home, courses, lecture, quiz, certs, admin)   │
└───────────────────────────┬────────────────────────────┘
                            │
               calls only   ▼
┌────────────────────────────────────────────────────────┐
│                   assets/access.js                     │
│  (Mock API Layer: courses(), progressOf(), submitQuiz) │
└─────────────┬───────────────────────────┬──────────────┘
              │                           │
    enforces  ▼                 persists  ▼
┌───────────────────────────┐   ┌────────────────────────┐
│     assets/rules.js       │   │  Storage Engine        │
│ (Pure Business Rules):    │   │  - localStorage        │
│ - lectureComplete (90%)   │   │    (academy_state_v1)  │
│ - moduleState (unlocking) │   │  - sessionStorage      │
│ - buildQuiz / score       │   │    (academy_auth/role) │
│ - certCode (FNV-1a hash)  │   └────────────────────────┘
└───────────────────────────┘
```

### Script Execution Sequence (Protected Pages)
1. `boot.js`: Reads data files (`courses.json`, `questions.json`, `doctors.json`, `settings.json`) into `window.ACADEMY_DATA`.
2. Placeholder scripts executed in order:
   - `assets/ui.js`: DOM helpers, string escaper, duration formatters.
   - `assets/rules.js`: Evaluates domain logic.
   - `assets/access.js`: Sets up state and mock persistence.
   - `assets/views.js`: Shared component rendering functions.
   - Page Inline Script: Guarded by `if (!requireRole('doctor')) return;` (or `'admin'`).
   - `assets/header.js`: Injects top bar and profile management.
   - `assets/nav.js`: Injects navigation sidebar / mobile drawer.

---

## 6. Business Logic Rules (`assets/rules.js`)

- **Lecture Completion**: Complete when watched seconds $\ge \lceil \text{duration} \times 0.90 \rceil$. Skipping forward past the furthest reached point is blocked; rewinding is permitted.
- **Module Unlocking Sequence**:
  - `locked`: Previous module's quiz has not been passed.
  - `progress`: Previous quiz passed (or first module), but current lectures not all 90% watched.
  - `quiz`: All module lectures 90% watched; quiz is unlocked and ready.
  - `passed`: Module quiz successfully passed.
- **Quiz Constraints**:
  - Drawn from module's question pool (`poolSize` consecutive questions from `questionOffset`).
  - Questions and options shuffled using deterministic PRNG.
  - Unanswered questions count as wrong.
  - Pass score is inclusive ($\ge 70\%$).
- **Course Progress Metric**:
  $$\text{Progress} \% = \left\lfloor \frac{\text{Lectures Watched} + \text{Quizzes Passed}}{\text{Total Lectures} + \text{Total Modules}} \times 100 \right\rceil$$
- **Certificate Issuance**:
  - Issued when all course modules are passed.
  - Code format: `SHA-YYYY-XXXXXX` generated via FNV-1a hash over `doctorId|courseId|YYYYMMDD`.

---

## 7. Build, Run, and Verification Commands

### Run Local Development Server
```bash
# In ui-prototype/
python3 -m http.server 5200
# Access via http://localhost:5200/
```

### Static Syntax & Integrity Verification
```bash
# Verify JavaScript syntax across all core modules
node -c ui-prototype/assets/*.js

# Validate JSON dataset formatting
python3 -c "import json, glob; [json.load(open(f)) for f in glob.glob('ui-prototype/data/*.json')]; print('JSON datasets valid.')"

# Verify Business Rules Headlessly in Node.js
node -e "
const fs = require('fs');
eval(fs.readFileSync('ui-prototype/assets/rules.js', 'utf8'));
console.log('RULES module valid. Sample cert:', RULES.certCode('d1', 'c1', '2026-11-06'));
"
```

---

## 8. Coding & Design Conventions

1. **STAND-HF Registry Design System**:
   - Must use classes from `assets/base.css` (`.app`, `.side`, `.nav`, `.hello`, `.kpis`, `.card`, `.btn`, `.btn.primary`, `.tag`, `.snack`).
   - Academy-specific additions go strictly into `assets/academy.css`.
   - Brand tokens: Magenta accent (`#C90085`, `var(--primary)`), `var(--card)`, `var(--ink)`, `var(--line)`, `var(--success)`, `var(--error)`.
2. **Touch Targets & Responsiveness**:
   - Minimum interactive element size: $44 \times 44\,\text{px}$.
   - Breakpoint checkpoints: $1024\,\text{px}$ (drawer switch), $768\,\text{px}$, and $<640\,\text{px}$ (mobile portrait).
3. **Architecture Boundary Invariant**:
   - Pages must **never** access `localStorage` or `sessionStorage` directly. All state access must go through `access.js`.
   - Business rules must **never** be hardcoded in HTML pages; they must reside in `assets/rules.js`.
   - Changes to rules or requirements must be logged in `CHANGES.md`.

---

## 9. Critical Implementation Constraints & Known Limitations

### Confirmed Constraints
- **Zero Build Step**: Do not introduce npm, bundlers, Webpack, Vite, or external package managers to `ui-prototype/`.
- **Offline / Self-Contained**: All fonts, icons, and stylesheets are self-hosted. Do not rely on external CDNs.
- **Preserve Client Experience**: Changes made here represent the client-facing prototype. High visual fidelity and immediate responsiveness are paramount.

### Known Prototype Limitations (Documented in HANDOFF.md)
- Video lectures use an accelerated timer (30x by default) rather than streaming video.
- "Download PDF" for certificates triggers the browser print dialog instead of backend PDF synthesis.
- Authentication accepts any password for demo accounts.
- Quiz timer runs client-side (backed by `localStorage`) rather than enforced on an authoritative server.

---

## 10. Fact vs. Assumption Matrix

| Item | Status | Supporting Evidence |
|---|---|---|
| Prototype is vanilla HTML/CSS/JS without build step | **Confirmed Fact** | `ui-prototype/AGENTS.md`, inspected file structure |
| Data resides in static JSON loaded via `boot.js` | **Confirmed Fact** | `ui-prototype/assets/boot.js`, `ui-prototype/data/*.json` |
| Rules in `rules.js` match Blazor `Rules.cs` contract | **Confirmed Fact** | `ui-prototype/HANDOFF.md`, `ui-prototype/assets/rules.js` |
| Blazor codebase (`StandHF.Academy.*`) exists in external repo | **Confirmed Fact** | Referenced in `CHANGES.md` and `HANDOFF.md`, not present in current workspace directory |
| Root repository was uninitialized git workspace | **Confirmed Fact** | `git status` exited 128 |
