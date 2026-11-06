# STAND-HF Decoderium Academy — Prototyping Asset Inventory

This directory maintains visual design references, layout mockups, and UI benchmarks utilized during the prototyping and architectural phases of **STAND-HF Decoderium Academy**.

---

## 📁 Directory Architecture

All original prototype files in the root and `udemy/` directories are preserved for backward compatibility. Categorized copies reside in semantic subdirectories:

```
src/Prototyping/
├── login/         # Authentication, glassmorphism cards, and clinical portal login mockups
├── dashboard/     # Student/Doctor LMS dashboards, progress widgets, and analytics
├── courses/       # Curriculum lists, course grids, module tables, and lecture trackers
├── home/          # Public landing pages, hero banners, and faculty/instructor showcases
├── admin/         # LMS course management tables and administrative CRUD interfaces
├── udemy/         # Original ingested benchmark assets (Udemy & Eduleb screenshots)
└── README.md      # This asset inventory and architectural mapping
```

---

## 📊 Comprehensive Image Inventory

| # | Asset File | Semantic Folder | Format & Size | UI Archetype / Theme | Architectural Role & Implementation Impact |
|---|---|---|---|---|---|
| 1 | `glassmorphism-website-login_492010-8.avif` | `login/` | AVIF (740×463) | Dark Glassmorphism | Translucent frosted glass card, purple mesh background, floating input fields (`src/login/index.html`). |
| 2 | `original-9082b9b495511d1460abf79c9ba106a2.webp` | `login/` | WEBP (800×600) | Healthcare / Medical Portal | Split-card doctor login ("MyHHub"), trust badge statistics, PMDC/credentials authentication reference. |
| 3 | `079c223b95046da0a3e06800bd04c8cf.jpg` | `dashboard/` | JPEG (736×552) | Academic LMS ("Educame") | Grade progress bars, semester metrics, "Today Tasks" checklist, upcoming schedule widgets. |
| 4 | `37208f4d0f268dba816d2590219f129c0751351d.avif` | `dashboard/` | AVIF (1280×960) | Electric Violet ("Coursue") | Foundation for `#582be8` theme; "Continue Watching" carousel, student status card, and mentor sidebar. |
| 5 | `original-817e8d5833dcaa72626fd46e55c080e6.webp` | `dashboard/` | WEBP (1600×1200) | High-Res Coursue | Detailed circular progress indicator, horizontal course pills, and lesson activity timeline. |
| 6 | `lms-dashboard-01-shadcnuikit-academy.avif` | `dashboard/` | AVIF (1520×1032) | Shadcn UI Kit Academy | Modern clean dashboard metrics: Student success rate (88%), activity donut chart, and leaderboard rankings. |
| 7 | `images.jpeg` | `dashboard/` | JPEG (547×365) | Minimalist Personal Learning | Goal tracking widget (83%), quick status cards, course calendar integration reference. |
| 8 | `images (1).jpeg` | `dashboard/` | JPEG (595×515) | Academic Tracker ("MyStudy") | Multi-ring concentric progress gauges (completed/in-progress/not-started) and bar charts. |
| 9 | `original-959ce369f7c059694282dfda428c4fb2.webp` | `dashboard/` | WEBP (3466×2600) | Course Activity & Gantt | Course activity cards, enrolled student badges, radial completion rings, and weekly schedule planner. |
| 10 | `original-622eb65208f11be39cef3096a0b75635.webp` | `courses/` | WEBP (1600×1200) | Tabular Catalog ("EduMate") | Tab filters (Upcoming/In Progress/Completed), course table with duration, progress bars, and "Continue" buttons. |
| 11 | `original-d004072fa8f26368f4a3500d7c912676.webp` | `courses/` | WEBP (3200×2400) | Modular LMS ("Growly") | Category pills (Design/Marketing/Brand), featured course spotlight cards, and linear lecture playlist. |
| 12 | `original-1bb05e5dec73301cb3573da790004975.webp` | `courses/` | WEBP (752×752) | Udemy "My Learning" Grid | Standard multi-column course cards with thumbnails, progress percentages, and star rating system. |
| 13 | `IMG-20261107-WA0019.jpg` | `courses/` | JPEG (1105×1600) | Eduleb "All Course" Catalog | 6-card course catalog grid with category pills (Science, Modern, Lifestyle), lesson counts, and course fees. |
| 14 | `IMG-20261107-WA0016.jpg` | `home/` | JPEG (1600×684) | Udemy Header & Resume | Top navigation banner, "Welcome back" personalized greetings, and "Let's start learning" video resume cards. |
| 15 | `IMG-20261107-WA0017.jpg` | `home/` | JPEG (1427×1600) | Eduleb Faculty Showcase | "Meet our Instructors" card grid with doctor/teacher portraits, credentials, course counts, and social links. |
| 16 | `IMG-20261107-WA0018.jpg` | `home/` | JPEG (285×1600) | Eduleb Landing Page | Full vertical landing page layout: hero banner, partner logos, statistics strip, testimonials, and blog feed. |
| 17 | `IMG-20261107-WA0020.jpg` | `home/` | JPEG (381×1600) | Udemy Homepage Feed | Comprehensive personalized homepage structure: recommended courses, trending topics, and career paths. |
| 18 | `PbYKpAthTJF5RDu6u9eJ0bOH3xcZC6aXhZjEFN6N.png` | `admin/` | PNG (4800×3600) | AnggaCBT Admin Management | Course administration table ("Manage Course"), purple "Add New Course" button, and row action dropdown menu. |

---

## 🎨 Semantic Design Influences on Decoderium Academy

- **Color Palette**: The electric violet (`#582be8`) theme in `src/assets/academy.css` was directly inspired by the *Coursue* (`37208f4d0f268dba816d2590219f129c0751351d.avif`) and *AnggaCBT* (`PbYKpAthTJF5RDu6u9eJ0bOH3xcZC6aXhZjEFN6N.png`) references.
- **Login Experience**: The login layout combines glassmorphic card styling (`glassmorphism-website-login_492010-8.avif`) with clinical healthcare verification (`original-9082b9b495511d1460abf79c9ba106a2.webp`).
- **Course & Module Navigation**: The tabular course listing in `src/courses/index.html` derives from the *EduMate* (`original-622eb65208f11be39cef3096a0b75635.webp`) and *Growly* (`original-d004072fa8f26368f4a3500d7c912676.webp`) structures.
- **Faculty Profiles**: The doctor faculty modal dialogs (`openDialog()`) and card layouts reflect the *Eduleb Instructor Showcase* (`IMG-20261107-WA0017.jpg`).
