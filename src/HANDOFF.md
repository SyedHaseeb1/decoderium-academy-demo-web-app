# GILEAP Academy: Front-End Handoff to the Blazor / API team

This explains what the UI prototype reads today, where that data lives, and what the live system must provide. The prototype is pure HTML, CSS and vanilla JavaScript.

## 1. How data reaches the screen today

1. Each page loads `assets/boot.js`, which fetches `data/courses.json`, `questions.json`, `doctors.json` and `settings.json` and stores them in `window.ACADEMY_DATA`. If a fetch fails it redirects to `error/`.
2. `assets/access.js` builds the working state from that data (sample progress included) and keeps changes in `localStorage` under `academy_state_v1`. Who is signed in is kept in `sessionStorage` (`academy_auth`, `academy_role`, `academy_doctor`, `academy_name`).
3. Screens call the functions in `access.js` only. They never touch storage directly.

**To move to the API:** replace the bodies of the `access.js` functions below with API calls and keep the same inputs and outputs. In Blazor, these are the members of `IAcademyService`.

## 2. Screen functions and the endpoints they stand for

| `access.js` function | Meaning | Suggested endpoint |
| --- | --- | --- |
| `signIn(identifier, role)` | Sign in with email or username | `POST /api/auth/login` |
| `signOut()` | End the session | `POST /api/auth/logout` |
| `courses()`, `course(id)` | Course tree: modules, lectures | `GET /api/courses` |
| `progressOf(doctorId)` | Lectures watched, quiz attempts, certificates | `GET /api/me/progress` |
| `recordWatch(lectureId, seconds)` | Save furthest point reached (only moves forward) | `PUT /api/lectures/{id}/progress` |
| `startQuiz(moduleId)` | Start or resume a quiz; returns questions (no answers), deadline | `POST /api/modules/{id}/quiz` |
| `submitQuiz(session, answers, timedOut)` | Mark on the server; returns score and review | `POST /api/quizzes/{id}/submit` |
| `ensureCert(courseId)`, `verifyCert(code)` | Issue once; public check by number | `POST /api/certificates`, `GET /api/certificates/{code}` (public) |
| `doctors()`, `addDoctor()`, `setDoctorActive()` | Admin account management | `/api/admin/doctors` |
| `setPublished()`, `saveSettings()` | Publish a course; quiz and certificate rules | `/api/admin/courses/{id}`, `/api/admin/settings` |

In the live system the correct answers never reach the browser before submission, and the quiz deadline is kept by the server.

## 3. Data files

- `courses.json`: courses → modules → lectures (`seconds` is the duration). `published: false` means "coming soon". Modules carry `questionOffset` (see below).
- `questions.json`: the sample question bank. In each entry the first option is correct; each attempt shuffles. A module's pool is `poolSize` consecutive questions from its `questionOffset`. In the live system a module owns its own questions.
- `doctors.json`: sample doctors (PMDC ID, speciality, hospital, city, phone) and the admin account.
- `settings.json`: quiz rules (questions, minutes, pass mark, attempts), the 90% lecture rule, the demo playback speed and the certificate text.

## 4. Rules to mirror (`assets/rules.js`)

- A lecture counts as watched at 90% played. Skipping ahead of the furthest point reached is blocked; rewinding is free.
- A module's quiz opens when all its lectures are watched. The next module opens when the quiz is passed.
- Quiz: random questions from the pool, shuffled options, unanswered counts as wrong, pass mark inclusive.
- Course progress = (lectures watched + quizzes passed) ÷ (lectures + modules).
- A certificate is issued when every module quiz is passed. Number format `SHA-YYYY-XXXXXX` (FNV-1a hash of doctor, course and date). It matches the Blazor `CertificateRules.BuildCode`.

## 5. What the prototype simulates

- Lecture video is a timer (30× speed by default). The live system streams hosted video.
- "Download PDF" opens the browser print dialog. The live system creates the PDF on the server.
- No email is sent. "Account created" only shows the message.
- The quiz clock is saved in the browser. The live system keeps it on the server.
