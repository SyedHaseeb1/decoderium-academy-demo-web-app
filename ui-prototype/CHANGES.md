# Change log: UI prototype and Blazor status

The prototype changes first, from client feedback. Each row says what changed and whether the Blazor app (`../StandHF.Academy.*`) has caught up. Add a row in the same commit as the change.

Status: `Done` (Blazor matches), `To do` (Blazor still differs), `n/a` (prototype only).

| Date | Change | Source | Screens / files | Blazor |
| --- | --- | --- | --- | --- |
| 2026-11-06 | First version of the prototype in the registry style (magenta brand, side menu, same components). Same flow as the Blazor demo. | Internal | all | Done (flow); To do: restyle Blazor to the registry look if the client prefers it |
| 2026-11-06 | Major modern UI transformation based on modern Skillshare/Masterclass reference: slim 78px icon dock, floating card canvas, 2-column workspace, 24px rounded video player with frosted glass center play button, active coral pill lecture items, right activity rail with doctor profile, mini courses, and weekly study arc graph. | Client Request | `home/`, `lecture/`, `assets/academy.css`, `assets/nav.js`, `assets/header.js` | To do (Blazor styling) |
| 2026-11-06 | Complete transformation to pastel dashboard & Educef 4-column catalog: soft pastel sidebar (#fdf7fa), floating white nav card, top faculty avatar rail, Goals Status card with 80% progress bar, tall featured course card with milestone badges (01-04), minimalist stat cards with pastel shapes, active filter pills, and 4-column course grid. | Client Request | `home/`, `courses/`, `assets/academy.css`, `assets/nav.js` | To do (Blazor styling) |
| 2026-11-06 | Full end-to-end transformation across all 8 screens: dark glassmorphic sign-in & registration portal with neon cardiology waves, pastel personal learning dashboard, Educef 4-column course catalog & detailed syllabus stepper, 24px video learning player with 90% watch threshold, timed 10-MCQ quiz engine with 10:00 countdown and results review, official A4 landscape certificates with FNV-1a verification hash and PDF download, public verification portal, and full executive admin portal. | Client Request | `login/`, `home/`, `courses/`, `lecture/`, `quiz/`, `certificates/`, `verify/`, `admin/`, `assets/` | To do (Blazor styling) |
| 2026-11-06 | Polish after a visual pass on desktop and phone: quiz options left-aligned, menu items kept together in the phone drawer, quiz "not open yet" message shown as a notice instead of an error, shorter labels that were cut off. | Internal QA | `quiz/`, `assets/academy.css`, `home/`, `login/` | n/a (prototype only) |
| 2026-11-06 | Sign-in uses Doctor / Administrator tabs and "any password" demo accounts, like the registry demo. | Internal | `login/` | To do |
| 2026-11-06 | Unified master design system across all screens via `assets/academy.css`. Re-aligned login page to reference image (floating rounded glassmorphism card, vertical center divider, Decoderium.com theme with ambient cardio waves). Removed public doctor registration/signup (registry is managed strictly by Super Admin). Integrated 1-click physician demo sign-in for effortless access by non-tech-savvy clinicians. Added collapsible accordion animation to course modules and mobile touch controls (10s rewind/forward, fullscreen, watch meter) to video player. | Client Request | `login/`, `home/`, `courses/`, `lecture/`, `quiz/`, `certificates/`, `verify/`, `admin/`, `assets/academy.css` | To do (Blazor styling) |
| 2026-11-06 | Refined home dashboard to modern COURSUE LMS layout: 3-column / center-plus-right-rail with electric violet curved hero banner, quick progress pill cards, Continue Watching video cards with durations, syllabus summary table, doctor profile summary with gradient arc ring, 7-day stacked activity bar chart in electric violet/indigo, and Clinical Faculty Mentors list. | Client Request | `home/`, `assets/academy.css` | To do (Blazor styling) |
| 2026-11-06 | Implemented high-end doctor UX enhancements based on prototyping references: sliding side alert cards (`sideAlert()`) for PMDC status and watch milestones, interactive modal dialogs (`openDialog()`) for faculty profiles and reset confirmations, notification bell trigger, and complete unification under the modern Electric Violet (`#582be8`) theme. | Client Request | `assets/ui.js`, `assets/header.js`, `assets/academy.css`, `home/`, `lecture/` | To do (Blazor styling) |

## Client feedback

Add each point here as it comes in, then move it to the table above when it is done.

| Date | Feedback | Decision | Status |
| --- | --- | --- | --- |
| | | | |
