# STAND-HF Academy: UI prototype

A clickable prototype of the online course platform for doctors. Sample data only: nothing is sent anywhere.

## Open it

The prototype loads its data files, so it must be served by a web server (opening `index.html` straight from the folder will not work).

**Windows:** double-click `run.bat` (needs Python installed). It starts a server and opens the prototype in your browser.

**Any system with Python:**

```bash
python -m http.server 5200
```

Then open http://localhost:5200/.

**Hosting:** upload the whole folder to any static host (GitHub Pages, Netlify, an IIS or nginx folder). There is nothing to build.

## Try it

On the sign-in screen, tap a demo account (any password works):

- **Dr. Ayesha Khan**: part-way through a course. Watch the next lecture, take the module quiz, and the next module unlocks.
- **Dr. Bilal Ahmed**: one quiz away from a certificate. Pass the last quiz to get it, then open Verify certificate.
- **Administrator**: courses, doctors, reports and settings.

Lectures play as a timer at 30× speed so you can see the flow quickly. Use "Reset demo data" in the profile menu (top right) to start again.

For developers: see `AGENTS.md` (rules), `HANDOFF.md` (what the live system must provide) and `CHANGES.md` (feedback log).
