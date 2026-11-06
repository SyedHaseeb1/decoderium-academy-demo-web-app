# Decoderium Academy — Medical Education & Clinical Registry Ecosystem

> **Document Type**: Comprehensive Project & Architectural Understanding  
> **Author**: Autonomous Engineering Orchestrator  
> **Date**: 2026-11-06  
> **Target Audience**: Haseeb, Decoderium Engineering Team & Project Stakeholders  
> **Prototype Working Title**: **Decoderium Academy** (Prototyping phase; companion to Abrar's clinical registry `Standhf.pk`)

---

## 1. Executive Summary & Vision

This initiative encompasses an integrated cardiovascular healthcare and education ecosystem developed by **Decoderium Technologies** for Heart Failure (HF) management in Pakistan.

Historically, medical education and clinical disease registries exist in disconnected silos. This prototype unites them into a **two-armed digital platform**:

```
                              ┌─────────────────────────────────────────┐
                              │            DECODERIUM HEALTH            │
                              │           HEALTHCARE ECOSYSTEM          │
                              └────────────────────┬────────────────────┘
                                                   │
                   ┌───────────────────────────────┴───────────────────────────────┐
                   ▼                                                               ▼
        ┌────────────────────────────────────┐                  ┌────────────────────────────────────┐
        │               ARM 1                │                  │               ARM 2                │
        │        DECODERIUM ACADEMY          │                  │         CLINICAL REGISTRY          │
        │      (Education Prototype)         │                  │            (Standhf.pk)            │
        │     Doctor Training, Quizzes       │                  │    Patient Onboarding, Labs,       │
        │        & PMDC Certification        │                  │     ECHO & GDMT (Made by Abrar)    │
        └────────────────────────────────────┘                  └────────────────────────────────────┘
```

The system serves a dual mission:
1. **Educate & Certify (Arm 1 — Decoderium Academy)**: Up-skill cardiologists, internal medicine specialists, and general physicians on international Guideline-Directed Medical Therapy (GDMT) and diagnostic protocols.
2. **Capture Real-World Evidence (Arm 2 — `Standhf.pk` / Clinical Registry)**: The patient registry developed by Abrar that onboards heart failure patients to monitor treatment patterns, echocardiographic parameters, biomarker trajectories, and clinical outcomes across tertiary hospitals in Pakistan.

---

## 2. Deep Dive: Arm 1 — STAND-HF Academy (LMS & Certification)

Arm 1 is an accredited **Continuing Medical Education (CME)** and certification platform with a strict **Mastery-Gated Progression Model**.

### 2.1 Doctor Identity & Registration
- **Doctor Registration & Login**: Every doctor has an individual, authenticated account (Login ID / Email and Password).
- **Core Doctor Profile Fields**:
  - Full Name (with title `Dr.`)
  - **PMDC Registration Number** (Pakistan Medical & Dental Council ID — the critical legal identifier for medical practice in Pakistan)
  - Primary Specialty (Cardiology, Interventional Cardiology, Internal Medicine, General Practice)
  - Hospital / Institution Affiliation & City (e.g., NICVD Karachi, PIC Lahore, AFIC Rawalpindi, PIMS Islamabad)
  - Mobile Number & Email Address
- **Doctor Dashboard**:
  - Real-time progress tracker across all enrolled courses.
  - Active curriculum status with "Continue where you left off" CTA.
  - Continuing Medical Education (CME) credit counter (e.g., `12 / 15 CME Hours Earned`).
  - Catalog of "Live & Upcoming" courses going active on the platform.
  - Verified credentials and certificates gallery.

### 2.2 Pedagogical Structure & Hierarchy
Each course is modeled as a 3-tier tree:
$$\text{Course} \longrightarrow \text{Modules} \longrightarrow \text{2–3 Video Lectures per Module} \longrightarrow \text{Timed Module Quiz}$$

```
Course: STAND-HF Guidelines on Heart Failure Management
│
├── Module 1: Diagnostic Workup & Biomarkers
│     ├── Lecture 1: Clinical Presentation & Framingham Criteria (14 min)
│     ├── Lecture 2: Natriuretic Peptides (NT-proBNP/BNP) & Biomarker Cutoffs (18 min)
│     └── Module 1 Quiz (10 Questions • 10-Min Countdown) ──[Pass ≥70%]──► Unlocks Module 2
│
├── Module 2: Guideline-Directed Medical Therapy (GDMT)
│     ├── Lecture 1: SGLT2 Inhibitors in HFpEF and HFrEF (16 min)
│     ├── Lecture 2: The Four Pillars of GDMT Titration (22 min)
│     ├── Lecture 3: Managing Renal Function & Hyperkalemia (15 min)
│     └── Module 2 Quiz (10 Questions • 10-Min Countdown) ──[Pass ≥70%]──► Unlocks Module 3
│
└── Module 3: Device Therapy & Advanced Heart Failure
      ├── Lecture 1: Indications for ICD and CRT-D (20 min)
      ├── Lecture 2: Inotropes, Mechanical Support & Referral Pathways (18 min)
      └── Module 3 Quiz (10 Questions • 10-Min Countdown) ──[Pass ≥70%]──► Issues Certificate
```

### 2.3 Strict Progression & Mastery Gates
- **Anti-Scrubbing Rule (90% Watch Rule)**:
  - Doctors cannot skip to the end of a video lecture to bypass training.
  - A lecture is marked complete **only** when watched seconds $\ge \lceil \text{duration} \times 0.90 \rceil$.
  - Forward scrubbing beyond the highest reached point is blocked; rewinding is freely permitted.
- **Sequential Module Unlocking**:
  - A module's quiz remains **locked** until all 2–3 lectures within that module are 90% watched.
  - Subsequent modules (Module $N+1$) remain **strictly locked** until the doctor passes the Module $N$ Quiz.
- **Timed Quiz Engine**:
  - Drawn from a validated question bank with deterministic PRNG shuffling of questions and distractors.
  - Exactly **10 questions** per attempt.
  - **Ticking Countdown Timer** (e.g., 10:00 minutes). If the timer hits zero, auto-submission triggers.
  - Passing score: $\ge 70\%$ (e.g., 7/10 correct answers).
  - Remediation loop: If failed, the doctor can review the feedback rationale and retake a freshly shuffled pool.
- **Global Course Progress Formula**:
  $$\text{Course Progress \%} = \left\lfloor \frac{\text{Lectures Watched} + \text{Quizzes Passed}}{\text{Total Lectures} + \text{Total Modules}} \times 100 \right\rceil$$

### 2.4 Certificate Generation & Verification
- **Issuance**: Automatically unlocked when every module and its quiz are passed.
- **Certificate Artifact Elements**:
  - Doctor's Full Legal Name
  - **PMDC ID Number**
  - Course Title, Completion Date, and CME Accreditation Statement
  - Formal Signatures (Academic Chair & Society President)
  - **Deterministic Verification Code**: Format `SHA-YYYY-XXXXXX` generated using an FNV-1a hash over `doctorId|courseId|YYYYMMDD`.
  - Verifiable QR Code linking directly to the public verification endpoint.
- **Exporting Options**:
  - **In-Browser Print**: Formatted specifically with CSS print media queries for clean A4 landscape printing without UI chrome.
  - **Direct PDF Download**: Pixel-perfect vector PDF for framing or official submission.
- **Public Verification Portal (`/verify/`)**:
  - Unauthenticated public page where PMDC regulators, hospitals, or employers can input a certificate number (or scan the QR code) to instantly confirm legitimacy, issue date, and doctor credentials.

### 2.5 The Mobile-First Physician Constraint
- **Context**: Doctors are busy clinicians who rarely sit in front of laptops for continuing education. They watch lectures and complete quizzes during OPD breaks, ward rounds, transit, or at night on smartphones (iPhone/Android).
- **UX Implication**:
  - Touch targets $\ge 48 \times 48\,\text{px}$.
  - Mobile bottom navigation bar for primary thumb-reach actions (`Home`, `Courses`, `Quiz`, `Profile`).
  - Resilient video player that supports fullscreen landscape orientation on mobile and resumes playback at the exact second if interrupted by a phone call.
  - Offline-safe state caching in `localStorage` so poor clinic Wi-Fi does not discard quiz answers.

---

## 3. Deep Dive: Arm 2 — Standhf.pk (Clinical Registry made by Abrar)

The client explicitly noted: *"second arm is much more like what abrar has already made. the patient onboarding all the parameters"*.

This represents **`Standhf.pk`** — the Electronic Case Report Form (E-CRF) & Clinical Data Registry built by Abrar, tracking heart failure patients across tertiary care centers in Pakistan.

### 3.1 Patient Onboarding & Clinical Parameters
1. **Patient Demographics**:
   - Registry ID / Hospital MRN, National CNIC (masked), Age, Gender, Center/Site, Enrolling Cardiologist.
2. **Clinical Baseline & Hemodynamics**:
   - NYHA Functional Classification: Class I, II, III, or IV.
   - Heart Failure Phenotype:
     - **HFrEF**: Heart Failure with Reduced Ejection Fraction ($\text{LVEF} \le 40\%$)
     - **HFmrEF**: Heart Failure with Mildly Reduced Ejection Fraction ($\text{LVEF } 41\text{--}49\%$)
     - **HFpEF**: Heart Failure with Preserved Ejection Fraction ($\text{LVEF} \ge 50\%$)
   - Vital signs: Blood pressure (SBP/DBP), Resting Heart Rate, JVP elevation, Peripheral Edema (trace to 3+), Pulmonary Rales, S3 Gallop.
3. **Etiology & Comorbidities**:
   - Ischemic Cardiomyopathy vs. Non-Ischemic / Dilated Cardiomyopathy, Hypertensive Heart Disease, Diabetic Cardiomyopathy, Valvular Disease, Peripartum Cardiomyopathy.
   - Comorbidity checklist: Hypertension, Type 2 Diabetes, Chronic Kidney Disease (CKD stage), Atrial Fibrillation, COPD, Dyslipidemia.
4. **Biomarkers & Laboratory Investigations**:
   - **Natriuretic Peptides**: Serum NT-proBNP or BNP levels (pg/mL).
   - **Renal Panel**: Serum Creatinine, Blood Urea, estimated GFR (eGFR via CKD-EPI).
   - **Electrolytes**: Serum Potassium ($\text{K}^+$), Serum Sodium ($\text{Na}^+$).
   - **Hematology**: Hemoglobin, Serum Ferritin, Transferrin Saturation (iron deficiency in HF).
5. **Echocardiography Data**:
   - Left Ventricular Ejection Fraction (LVEF %), LV End-Diastolic Dimension (LVEDD mm), Left Atrial Volume Index (LAVI), TAPSE (right ventricular function), Diastolic Dysfunction grade (I to III).
6. **Guideline-Directed Medical Therapy (The Four Pillars)**:
   - **ARNI / ACEi / ARB**: Sacubitril/Valsartan, Enalapril, Ramipril, Valsartan (starting vs. target dose titration).
   - **Evidence-Based Beta-Blockers**: Bisoprolol, Carvedilol, Metoprolol Succinate.
   - **Mineralocorticoid Receptor Antagonists (MRA)**: Spironolactone, Eplerenone.
   - **SGLT2 Inhibitors**: Dapagliflozin (10 mg), Empagliflozin (10 mg).
   - Additional therapies: Loop Diuretics (Furosemide, Torsemide), Ivabradine, Vericiguat, Digoxin, Iron replacement (Ferric Carboxymaltose).
7. **Longitudinal Follow-up Visits & Outcomes**:
   - Baseline, 30-Day, 3-Month, 6-Month, and 12-Month follow-up visits.
   - Outcome endpoints: All-cause mortality, HF re-hospitalization, emergency room visits, dose optimization milestones, and adverse drug reactions (hyperkalemia, hypotension, renal worsening).

---

## 4. Current Codebase vs. Target Production Architecture

### 4.1 Current Repository (In-Scope Codebase)
- **Nature**: High-fidelity static UI Prototype & Pure JavaScript Business Rules Engine located in `ui-prototype/`.
- **Zero Build Step**: No npm dependencies, no bundler, no node_modules. Instant execution via `python -m http.server 5200`.
- **Separation of Concerns**:
  - `ui-prototype/assets/rules.js`: Pure mathematical domain rules (unlocking logic, scoring, 90% watch threshold, certificate hashing).
  - `ui-prototype/assets/access.js`: Data abstraction layer interfacing with `sessionStorage` and `localStorage` mock database (`academy_state_v1`). Screens never manipulate storage directly.
  - `ui-prototype/assets/boot.js`: Asynchronous bootloader loading `data/*.json` (`courses.json`, `questions.json`, `doctors.json`, `settings.json`) into `window.ACADEMY_DATA`.
  - `ui-prototype/assets/base.css` + `assets/academy.css`: Design system tokens.
- **Role in Project Lifecycle**: The clickable prototype approved by the client here serves as the authoritative functional specification and visual contract for the production team.

### 4.2 Production Companion Architecture (`StandHF.Academy.*`)
- **Target Backend**: ASP.NET Core 8 Web API with C# Clean Architecture.
- **Target Frontend**: Blazor WebAssembly application mirroring this UI prototype.
- **Shared Domain**: `assets/rules.js` directly mirrors `StandHF.Academy.Shared/Rules/Rules.cs` so that quiz grading, progression, and certificate generation execute with exact 1:1 behavioral parity on both server and client.

---

## 5. Modern UI Redesign Strategy (Material 3 & Latest Standards)

The user has explicitly directed a visual overhaul:
> *"redo the ui. use the modern and lastest ui standard. use material ui roundness. and elevations. animations and the best of what you can think off."*

### 5.1 Design Tokens & Aesthetics
1. **Material Design 3 (M3) Roundness**:
   - Structural cards & modals: `border-radius: 20px` to `24px`.
   - Small cards & modules: `border-radius: 14px` to `16px`.
   - Badges, pills, and interactive chips: `border-radius: 9999px` (full pill shape).
2. **Elevations & Ambient Layering**:
   - Move away from flat 1px black borders.
   - Use soft multi-layered drop shadows (`var(--shadow-sm)`, `var(--shadow-md)`, `var(--shadow-xl)`):
     $$\text{Elevation 2} = \texttt{0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.05)}$$
     $$\text{Elevation 3} = \texttt{0 10px 15px -3px rgba(0,0,0,0.04), 0 4px 6px -4px rgba(0,0,0,0.04)}$$
   - Glowing accent active states: `box-shadow: 0 0 25px rgba(201, 0, 133, 0.20)`.
3. **Clinical Color Palette**:
   - **Primary Brand Accent**: Vibrant Magenta (`#C90085`, `var(--primary)`) symbolizing cardiovascular pulse and STAND-HF brand identity.
   - **Deep Surface Navy**: Clinical midnight slate (`#0F172A`) for sidebars, top headers, and hero banners.
   - **Surface Base**: Clean off-white slate (`#F8FAFC`).
   - **Card Surface**: Pure crisp white (`#FFFFFF`).
   - **Status Colors**: Emerald Green (`#059669`) for completions/verified badges; Amber (`#D97706`) for countdown timers and pending actions.
4. **Fluid Micro-Interactions & Animations**:
   - Smooth card lift on hover (`transform: translateY(-2px)` with `cubic-bezier(0.16, 1, 0.3, 1)` easing).
   - Gradient pulse on active progress bars.
   - Interactive ticking countdown timer badge with soft pulse.
   - Module unlock transition animation (lock icon smoothly resolving to unlocked state).
5. **Ecosystem Navigation Switcher**:
   - Unified top/sidebar pill switcher allowing doctors to seamlessly toggle between:
     $$\mathbf{[ \text{ STAND-HF Academy (LMS) } ]} \longleftrightarrow \mathbf{[ \text{ STAND-HF Registry (Patients) } ]}$$

---

## 6. Key Decision Points & Next Milestones

| # | Topic | Current Prototype Model | Live Production Model | Action Required |
|---|---|---|---|---|
| **1** | **Video Hosting** | 30× accelerated simulation timer for quick prototype testing. | Authoritative video CDN (Vimeo OTT, Cloudflare Stream, or YouTube Unlisted). | Align on video player embed format. |
| **2** | **Quiz Security** | PRNG randomized pool on client, questions in `questions.json`. | Server-side question retrieval; answers never exposed to client DOM before submit. | Implemented via `access.js` API abstraction. |
| **3** | **PMDC Verification** | Deterministic PMDC ID format check (`#####-P`) and demo account verification. | Verification against PMDC public registry database or administrator manual approval. | Keep PMDC ID as mandatory field on registration. |
| **4** | **Certificate Export** | Browser print dialog (`@media print` landscape A4) + local PDF download mock. | Server-side Chromium / PDFSharp high-resolution PDF rendering with cryptographic signature. | Ensure HTML certificate renders crisply on both. |
| **5** | **Unified Shell** | Dual-arm toggle in prototype navigation (`Academy` vs `Registry`). | Single Sign-On (SSO) JWT bridging Academy portal with Abrar's Clinical Registry. | Share session credentials across modules. |

---

*This document serves as the shared conceptual and technical foundation for all subsequent UI engineering tasks.*
