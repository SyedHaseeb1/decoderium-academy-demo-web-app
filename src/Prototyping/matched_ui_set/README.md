# GILEAP Academy — Mutually Matched UI Prototype Suite

This directory contains a unified, production-grade visual design set for the **GILEAP Academy**. Every screen adheres to a cohesive design system (clean cards, porcelain `#f8f9fd` surfaces, electric violet `#582be8` primary branding, coral `#ff4760` status accents, and emerald `#10b981` compliance highlights).

---

## 🎨 Design System Foundation

| Attribute | Specification |
|---|---|
| **Background Surface** | Soft porcelain (`#f8f9fd`), neutral line borders (`#e8ecf4`, `1.5px`) |
| **Card Geometry** | 16px–24px border radius, subtle ambient elevation (`rgba(15, 23, 42, 0.08)`) |
| **Primary Brand** | Electric Violet (`#582be8`), hover (`#4a21d1`), subtle tint (`#f5f3ff`) |
| **Accents & Badges** | Coral alert/threshold (`#ff4760`), Emerald compliance (`#10b981`), Amber warning (`#f59e0b`) |
| **Typography** | Inter / System UI, high-contrast dark ink (`#0f172a`), slate muted (`#64748b`) |
| **Navigation Invariant** | 260px fixed physician sidebar, persistent 72px top action header |

---

## 🖼️ Primary Matched UI Screens

### 1. `01_login_screen.png` (Ultra-Clean Medical Authentication)
- **Role**: Frictionless single-card physician authentication.
- **Key Elements**:
  - Centered floating glassmorphic card (600×690) with subtle ambient violet and coral mesh glows.
  - PMDC / Medical License Number input with instant validity verification badge.
  - Hospital/Center affiliation dropdown (e.g., NICVD Karachi — Center #01 Lead).
  - Quick one-click investigator demo selector (Dr. Sarah Khan PI / Dr. Siddiqui Co-PI / Prof. Hashim Admin).
  - 256-bit encrypted clinical trial badge with Protocol Registry #NCT0529841.
- **Source Files**: [`01_login_screen.png`](01_login_screen.png) & [`01_login_screen.svg`](01_login_screen.svg)
- **Benchmark Inspiration**: [`benchmarks/ref_01_login_portal.webp`](benchmarks/ref_01_login_portal.webp) (Healthcare portal doctor authentication).

---

### 2. `02_home_screen.png` (Doctor's Personal Landing Hub)
- **Role**: Physician command center with personalized greeting, CME progress, and one-click quick resume.
- **Key Elements**:
  - Welcome banner highlighting PMDC accreditation status and outstanding CME requirement (12.0 of 15.0 units).
  - **Quick Resume Spotlight Card**: Active module "Module 03: GDMT Up-Titration in Worsening HF" showing 74% watched with dashed 90% target threshold marker and "Resume Lecture 4 ▶" CTA.
  - Accreditation summary metric card with live watch threshold average (92.4%).
  - Recommended protocols and Grand Rounds card grid with CME badges and lecture counts.
- **Source Files**: [`02_home_screen.png`](02_home_screen.png) & [`02_home_screen.svg`](02_home_screen.svg)
- **Benchmark Inspiration**: [`benchmarks/ref_02_home_resume.jpg`](benchmarks/ref_02_home_resume.jpg) (Resume learning header & card feed).

---

### 3. `03_dashboard_screen.png` (CME & 90% Watch Threshold Compliance)
- **Role**: Real-time compliance monitoring enforcing GILEAP study invariants (`rules.js`).
- **Key Elements**:
  - **Top 4 KPI Strip**: Total Watch Time (14h 25m), Mandatory Threshold (90.0%), Actual Watch Completion (92.4% — Compliant), Quiz Pass Ratio (3/4).
  - **Watch Compliance Matrix**: Detailed table tracking individual protocol watch percentages against the strict 90% rule, distinguishing between unlocked, passed, and locked modules.
  - **Radial Gauge Chart**: 92.4% circular progress ring highlighting threshold achievement with breakdown of completed, in-progress, and target certificates.
  - Direct reference to `RULES.isQuizUnlocked()` business logic rule.
- **Source Files**: [`03_dashboard_screen.png`](03_dashboard_screen.png) & [`03_dashboard_screen.svg`](03_dashboard_screen.svg)
- **Benchmark Inspiration**: [`benchmarks/ref_03_dashboard_coursue.png`](benchmarks/ref_03_dashboard_coursue.png) (Coursue violet metric layout).

---

### 4. `04_courses_screen.png` (EduMate Tabular Course Hub)
- **Role**: Tabular curriculum catalog matching the clean EduMate architectural standard.
- **Key Elements**:
  - Filter and tab pill navigation: `All Protocols (8)`, `In Progress (3)`, `Completed (4)`, `CME Certified (1)`.
  - Comprehensive table schema:
    - Protocol & Module Name with numerical badge and duration.
    - Faculty Lead & Clinical Track.
    - Dual Watch Progress Bar with percentage and pass status.
    - Status badges: `CERTIFIED ✓`, `IN PROGRESS`, `QUIZ READY`, `ENROLLED`.
    - Contextual action buttons: "Continue ▶", "Review", "Take Quiz", "Start".
  - EduMate-standard pagination footer.
- **Source Files**: [`04_courses_screen.png`](04_courses_screen.png) & [`04_courses_screen.svg`](04_courses_screen.svg)
- **Benchmark Inspiration**: [`benchmarks/ref_04_courses_edumate.webp`](benchmarks/ref_04_courses_edumate.webp) (EduMate course catalog table).

---

## 📂 Directory File Manifest

```
src/Prototyping/matched_ui_set/
├── 01_login_screen.png          # 1440x900 Bespoke Medical Authentication Mockup
├── 01_login_screen.svg          # Source Vector Graphics
├── 02_home_screen.png           # 1440x900 Doctor Personal Landing & Resume Mockup
├── 02_home_screen.svg           # Source Vector Graphics
├── 03_dashboard_screen.png      # 1440x900 CME Metrics & 90% Watch Threshold Mockup
├── 03_dashboard_screen.svg      # Source Vector Graphics
├── 04_courses_screen.png        # 1440x900 EduMate Tabular Course Hub Mockup
├── 04_courses_screen.svg        # Source Vector Graphics
├── generate_mockups.py          # Python generation script
├── README.md                    # This architectural documentation
└── benchmarks/
    ├── ref_01_login_portal.webp      # Benchmark reference: Healthcare login
    ├── ref_02_home_resume.jpg        # Benchmark reference: Learning resume banner
    ├── ref_03_dashboard_coursue.png  # Benchmark reference: Coursue metrics
    └── ref_04_courses_edumate.webp   # Benchmark reference: EduMate table standard
```
