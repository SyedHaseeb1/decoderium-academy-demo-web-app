# GILEAP Academy & Patients Registry — Project Context & Architecture Reference

> **Document Status**: Grounded Architecture Reference  
> **Last Verified**: 2026-11-08  
> **Scope**: GILEAP Academy UI Prototype & Core Domain Rules Engine

---

## 1. Project Overview & Clinical Domain

- **Project Identity**: **GILEAP** (Gastroenterology Learning, Evidence & Accreditation Platform).
- **Domain Specialization**: **Gastroenterology** (P-CAB, PPI acid suppression, APD, GERD).
- **Two Core Strategic Objectives**:
  1. **Arm 1 (Educational Portal / LMS)**: Connect gastroenterologists, doctors, and healthcare professionals through accredited CME courses, 90% watch velocity gating, randomized MCQ assessments, and PMDC-compliant cryptographic certification.
  2. **Arm 2 (Patients Registry & Clinical Follow-up)**: Digital observational clinical trial replacing physical paper data collection with digital E-CRF intake, Day-3 triage alerts, and Day-7 recovery endpoints across 12 Pakistan regional hospital clusters.
- **Repository Scope**: This repository hosts the approved UI prototype and domain rules engine for GILEAP (Arm 1 LMS & Arm 2 Patients Registry).

---

## 2. Technology Stack

### Confirmed Stack (In-Repo)
- **Frontend Architecture**: Pure Vanilla Web Technologies — HTML5, CSS3, Vanilla JavaScript (ES5/ES6+ compatible).
- **Build System**: None (zero build step, zero npm dependencies, no bundler, no transpiler).
- **Persistence & State**:
  - Session state: Browser `sessionStorage` (`academy_auth`, `academy_role`, `academy_doctor`, `academy_name`).
  - Persistent mock database: Browser `localStorage` (`academy_state_v1`).
- **Static Asset Serving**: Standard HTTP servers (e.g. `python3 -m http.server 5200`, Nginx, GitHub Pages).
- **Typography & Icons**: Self-hosted WOFF2 fonts (`Roboto`, `Material Symbols Rounded`) under `src/assets/fonts/`.
- **Validation & Tooling**: Node.js (`node -c`) for static JS syntax checks; Python 3 for JSON dataset validation.

### Companion / Target Production Stack (Documented in HANDOFF.md)
- **Backend / Production Framework**: ASP.NET Core 8 Web API with Blazor WebAssembly (`StandHF.Academy.*`).
- **Domain Sharing**: Shared C# rules (`StandHF.Academy.Shared/Rules/Rules.cs`) mirroring `src/assets/rules.js`.

---

## 3. Repository & Module Structure

```
Stand-HF/
├── AGENTS.md                          # Master Autonomous Engineering Instructions (SSOT)
├── CLAUDE.md, GEMINI.md, OPENCODE.md, .cursorrules -> symlinks to AGENTS.md
├── PROJECT_CONTEXT.md                 # Grounded architecture & context reference (this file)
├── PROGRESS.md                        # Master progress and resumption handover
├── PROJECT_PROPOSAL.md                # Project proposal document
├── PROJECT_UNDERSTANDING.md           # Business understanding and domain model
├── index.html                         # Root redirect to src/login/ (GitHub Pages entry)
├── 404.html                           # Root 404 error handler -> src/error/
├── .nojekyll                          # Disables Jekyll processing on GitHub Pages
├── Docs/                              # Project briefs and specification PDFs
└── src/                               # Decoderium Academy Prototype Codebase
    ├── AGENTS.md                      # UI-specific rules & developer conventions
    ├── HANDOFF.md                     # API contract & Blazor migration specification
    ├── CHANGES.md                     # Client feedback & change tracker
    ├── README.md                      # Quick start & local execution guide
    ├── run.bat                        # Windows launcher script
    ├── 404.html, index.html           # Subfolder fallback and redirect
    ├── login/                         # Sign-in portal (Doctor vs Admin demo logins)
    ├── home/                          # Doctor dashboard (KPIs, course progress, mentors)
    ├── courses/                       # Course catalog and course detail (#c1)
    ├── lecture/                       # Video lecture player (?id=...) with 90% watch gate
    ├── quiz/                          # Module timed quiz (?m=...) with timer & scoring
    ├── certificates/                  # Certificate gallery and single view (#c1)
    ├── verify/                        # Public certificate check portal (?cert=...)
    ├── admin/                         # Admin portal (#overview, #courses, #doctors, #reports, #settings)
    ├── error/                         # Resilient boot error page
    ├── assets/
    │   ├── boot.js                    # Async loader for data/*.json -> window.ACADEMY_DATA
    │   ├── rules.js                   # Canonical business logic engine (RULES object)
    │   ├── access.js                  # Data abstraction layer & localStorage mock DB
    │   ├── ui.js                      # DOM utilities, formatters, toast notifications, modals
    │   ├── views.js                   # Reusable HTML view renderers (cards, crumbs, nextStep)
    │   ├── header.js                  # Global responsive header & profile drawer
    │   ├── nav.js                     # Global responsive navigation menu
    │   ├── base.css                   # Core design system tokens and reset styles
    │   ├── academy.css                # GILEAP Academy layout, theme & component styling
    │   ├── decoderium-mark.svg        # Clean vector brand mark
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

1. **`index.html`**:
   - Immediate redirect to `./src/login/` for GitHub Pages root visits.
2. **`404.html`**:
   - Captures unmapped paths and forwards to `src/error/?code=404`.
3. **`src/login/index.html`**:
   - Dual-tab authentication interface (`doctor` vs `admin`).
   - Provides 1-click demo accounts (`ayesha.khan`, `bilal.ahmed`, `admin`).
4. **`src/home/index.html`**:
   - Primary doctor landing view. Displays KPIs, resume button, enrolled course cards, 7-day study graph, and faculty mentors.
5. **`src/courses/index.html`**:
   - Course catalog at root; single course details and module status at `#<courseId>` (e.g. `#c1`).
6. **`src/lecture/index.html?id=<lectureId>`**:
   - Video player simulation with 30x accelerated timer, scrubbing prevention past watched mark, and auto-completion when 90% watched.
7. **`src/quiz/index.html?m=<moduleId>`**:
   - Timed quiz interface with active clock preservation across page refreshes.
8. **`src/certificates/index.html`**:
   - Certificate gallery and print/view modal with deterministic FNV-1a hash verification code.
9. **`src/verify/index.html?cert=<codeOrHash>`**:
   - Public unauthenticated portal to verify authenticity of doctor certificates.
10. **`src/admin/index.html#<section>`**:
    - Administrative portal hash-routed between `#overview`, `#courses`, `#doctors`, `#reports`, and `#settings`.
11. **`src/error/index.html`**:
    - Boot error and 404 display with helpful retry link.

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
│                 src/assets/access.js                   │
│  (Mock API Layer: courses(), progressOf(), submitQuiz) │
└─────────────┬───────────────────────────┬──────────────┘
              │                           │
    enforces  ▼                 persists  ▼
┌───────────────────────────┐   ┌────────────────────────┐
│    src/assets/rules.js    │   │  Storage Engine        │
│ (Pure Business Rules):    │   │  - localStorage        │
│ - lectureComplete (90%)   │   │    (academy_state_v1)  │
│ - moduleState (unlocking) │   │  - sessionStorage      │
│ - buildQuiz / score       │   │    (academy_auth/role) │
│ - certCode (FNV-1a hash)  │   └────────────────────────┘
└───────────────────────────┘
```

### Script Execution Sequence (Protected Pages)
1. `src/assets/boot.js`: Reads data files (`courses.json`, `questions.json`, `doctors.json`, `settings.json`) into `window.ACADEMY_DATA`.
2. Placeholder scripts executed in order:
   - `src/assets/ui.js`: DOM helpers, string escaper, duration formatters, toast alerts (`sideAlert`), modals (`openDialog`).
   - `src/assets/rules.js`: Evaluates domain logic.
   - `src/assets/access.js`: Sets up state and mock persistence.
   - `src/assets/views.js`: Shared component rendering functions.
   - Page Inline Script: Guarded by `if (!requireRole('doctor')) return;` (or `'admin'`).
   - `src/assets/header.js`: Injects top bar and profile management.
   - `src/assets/nav.js`: Injects navigation sidebar / mobile drawer / bottom bar.

---

## 6. Business Logic Rules (`src/assets/rules.js`)

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
# Serve repository root on port 5200
python3 -m http.server 5200
# Access via http://localhost:5200/ (auto-redirects to ./src/login/)
```

### Static Syntax & Integrity Verification
```bash
# 1. Verify JavaScript syntax across all core modules
node -c src/assets/*.js

# 2. Validate JSON dataset formatting
python3 -c "import json, glob; [json.load(open(f)) for f in glob.glob('src/data/*.json')]; print('JSON datasets valid.')"

# 3. Verify Business Rules Headlessly in Node.js
node -e "
const fs = require('fs');
eval(fs.readFileSync('src/assets/rules.js', 'utf8'));
console.log('RULES module valid. Sample cert:', RULES.certCode('d1', 'c1', '2026-11-06'));
"
```

---

## 8. Coding & Design Conventions

1. **Decoderium Academy Design System**:
   - Base tokens in `src/assets/base.css` (`.app`, `.side`, `.nav`, `.hello`, `.kpis`, `.card`, `.btn`, `.btn.primary`, `.tag`, `.snack`).
   - Academy-specific additions go strictly into `src/assets/academy.css`.
   - Brand tokens: Electric Violet (`#582be8` / `#7c3aed`), soft porcelain background (`#f8f9fd`), pure white elevated cards, coral/emerald status accents.
2. **Touch Targets & Responsiveness**:
   - Minimum interactive element size: $44 \times 44\,\text{px}$ (targets $\ge 48\,\text{px}$ on mobile).
   - Breakpoint checkpoints: $1024\,\text{px}$ (drawer switch), $768\,\text{px}$, and $<640\,\text{px}$ (mobile portrait).
3. **Architecture Boundary Invariant**:
   - Pages must **never** access `localStorage` or `sessionStorage` directly. All state access must go through `access.js`.
   - Business rules must **never** be hardcoded in HTML pages; they must reside in `src/assets/rules.js`.
   - Changes to rules or requirements must be logged in `src/CHANGES.md`.

---

## 9. Critical Implementation Constraints & Known Limitations

### Confirmed Constraints
- **Zero Build Step**: Do not introduce npm, bundlers, Webpack, Vite, or external package managers to `src/`.
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
| Prototype is vanilla HTML/CSS/JS without build step | **Confirmed Fact** | `src/AGENTS.md`, inspected file structure |
| Codebase moved from `ui-prototype/` to `src/` | **Confirmed Fact** | Git commit `436fd27` and root `index.html` redirection |
| Data resides in static JSON loaded via `boot.js` | **Confirmed Fact** | `src/assets/boot.js`, `src/data/*.json` |
| Rules in `rules.js` match Blazor `Rules.cs` contract | **Confirmed Fact** | `src/HANDOFF.md`, `src/assets/rules.js` |
| Companion Blazor production codebase exists in external repository | **Confirmed Fact** | Referenced in `CHANGES.md` and `HANDOFF.md`, not present in current workspace directory |
| Git repository initialized and tracking `origin/master` | **Confirmed Fact** | `git status` shows branch master up to date |
