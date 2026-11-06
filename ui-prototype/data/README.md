# Data files

All content is sample data made up for the prototype: names, PMDC numbers, lectures and questions.

| File | Contents |
| --- | --- |
| `courses.json` | Courses, modules and lectures (`seconds` = duration). `published: false` shows "coming soon". |
| `questions.json` | 20 sample questions. First option is correct; options are shuffled for every attempt. A module draws `poolSize` questions starting at its `questionOffset`. |
| `doctors.json` | 12 sample doctors and the administrator account. `joinedDaysAgo` becomes a date when the state is built. |
| `settings.json` | Quiz rules, the 90% lecture rule, demo playback speed, certificate text. |

Progress (lectures watched, quiz attempts, certificates) is not a file: `assets/access.js` builds it on first load from a fixed seed, so every visitor starts from the same story (one doctor mid-course, one about to finish, the rest spread out). It is then kept in `localStorage` under `academy_state_v1`. "Reset demo data" in the profile menu rebuilds it.
