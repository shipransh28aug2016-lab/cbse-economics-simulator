# CBSE V-LAB — Architecture

## What this is

`vlab/` is the first vertical slice of **CBSE V-LAB 2026-27**: an offline-first,
subject-agnostic virtual laboratory engine, built per the "MASTER BUILD LOOP"
specification, as a module living *inside* the `cbse-economics-simulator` repo
alongside — but never touching — EconSim Pro (the `js/`, `css/`, `index.html`
at repo root).

## Why it lives here instead of a separate repo

The full spec calls for a standalone platform. This session's git push is
bound to one repo/branch (`shipransh28aug2016-lab/cbse-economics-simulator`,
branch `claude/cbse-vlab-specification-ikkah8`), so a genuinely separate
GitHub repository wasn't something this session could create and push to.
`vlab/` is the closest honest equivalent: a self-contained subtree with its
own `docs/`, `src/`, `data/`, `tools/`, `index.html`, service worker and
manifest, zero shared code with EconSim Pro, and its own `npm run vlab:*`
scripts alongside (not replacing) the existing `npm run *` scripts. If/when a
separate repo becomes possible, this directory can be `git subtree split` out
directly.

## Why one experiment, not a subject grid

Spec §30 (Loop 3) and §33 (MVP target) are explicit: build one complete
vertical slice — curriculum mapping through offline persistence — before
adding more experiment cards. This slice is:

**CBSE Class XII Chemistry (043) — Standardization of an unknown KMnO4
solution against a standard oxalic acid solution** (permanganometric redox
titration, "Volumetric Analysis" in the NCERT/CBSE Chemistry practical list).

Chosen over Physics/Biology because the uploaded ChemVisuAI reference file
gave a Chemistry visual language (dark glass panels, a beaker widget) worth
building on, though its own "Virtual Lab" panel (temperature/concentration/pH
sliders on a decorative beaker, no real reaction chemistry) wasn't reusable
as-is — it isn't tied to any CBSE practical or real stoichiometry. What *was*
mined from it: the dark-glass visual language (panels, blur, accent gradient)
and the general "a beaker whose colour responds to controls" idea, rebuilt
from scratch as a real, testable titration model instead of a cosmetic demo.

## Layer map

```
vlab/
  index.html, styles.css, manifest.webmanifest, sw.js   — app shell
  app.js                                                  — bootstrap: owns
                                                             the session
                                                             object, wires
                                                             nav + events
  src/
    curriculum/registry.js     — CURRICULUM_NODES + validateCurriculumRegistry()
    core/state-machine.js      — subject-agnostic INITIALIZED..COMPLETED FSM
    simulation/
      permanganometry-model.js — pure chemistry: stoichiometry, endpoint
                                  detection, error conditions. Zero DOM.
    experiments/
      xii-chem-permanganometry.js — the one Experiment: apparatus,
                                     procedure, viva bank, assessment, safety
    offline/
      db.js             — IndexedDB wrapper, localStorage fallback
      progress-store.js — save/load observations, viva, assessment, progress
    ui/
      render.js — screen-rendering functions (Lab / Workspace / Notebook /
                  Viva / Assessment), pure functions returning HTML strings
  data/
    curriculum/cbse-2026-27-chemistry.json — human/audit copy of registry.js
    experiments/class-xii-permanganometry.json — pointer/index stub
  tools/
    test-vlab.js    — Node harness: sweeps the simulation model, the state
                      machine, and the curriculum audit (spec §28's example
                      output format)
    build-check.js  — "build" for a no-bundler app: local asset + sw.js
                      cache-list cross-check
    smoke.js        — Playwright: drives the full student workflow at
                      desktop + mobile viewports, asserts zero console errors
```

## Why plain `<script>` tags with dual exports, not ES modules or a bundler

This mirrors the parent EconSim Pro app's own proven approach (see the root
`CLAUDE.md`), for the same reason: the app must run from `file://` with zero
build step (spec §3-4). Every `src/**/*.js` file is wrapped in an IIFE that:

- assigns its exports to `window.VLAB.*` (consumed by other `<script>` tags
  sharing one global scope in the browser, in `index.html`'s load order), and
- also sets `module.exports` when `module` exists (consumed directly by
  `require()` in `tools/test-vlab.js`, no `vm` sandbox needed since these
  files never touch `document`).

`fetch()`-ing local JSON was deliberately avoided for the same file:// reason
the parent app avoids it: Chrome refuses `fetch()` of local files under the
`file://` scheme. Curriculum/experiment/apparatus/viva/assessment content
therefore lives as JS object literals in `src/`, with `data/*.json` as
human-readable, audit-friendly *mirrors* of that content (spec §14's literal
`/data/*.json` layout, adapted for this constraint — see each JSON file's own
`_readme` field for the exact mapping). If you edit curriculum or experiment
content, edit the `src/` file (the thing that actually runs) and keep the
`data/` mirror in sync by hand.

## State machine

`src/core/state-machine.js` implements spec §22's
`INITIALIZED → READY → RUNNING → MEASURING → OBSERVATION → CALCULATION →
RESULT → ASSESSMENT → COMPLETED` chain, subject/experiment-agnostic so a
future Physics/Biology experiment can reuse it unchanged. `app.js` drives it
from two independent UI paths (the burette *slider* and the +0.1/+1 mL
*buttons*) — both must call the same `beginMeasuring()` transition, or the
downstream chain silently never reaches `COMPLETED` for whichever path a
student actually uses. (This was caught by `tools/smoke.js` during
development — see its git history — and is exactly the kind of drift the
Definition of Done in spec §34 exists to catch.)

## Progress panel vs. a 6th "Progress" screen

Spec §21 lists `ProgressPanel` as its own component. Rather than a 6th nav
tab, it's a persistent strip in the header (`renderHeaderStrip`) showing
Pre-Lab / Titration / Notebook / Viva / Assessment completion at a glance —
fewer taps for a student mid-experiment, while still satisfying "student can
see completed vs. pending at a glance" without a dedicated screen.

## Content governance (spec §27-28)

`src/curriculum/registry.js`'s one node currently carries
`verificationStatus: 'needs-review'` and `contentStatus: 'review'` —
deliberately, not an oversight. It has not been cross-checked against the
official CBSE 2026-27 Chemistry (043) Practical syllabus PDF, because that
PDF has not been supplied to this repo (same situation the parent EconSim
Pro app is in for its own taxonomy — see the root `CLAUDE.md`). The chemistry
itself (stoichiometry, n-factors, the permanganometry procedure) is standard,
decades-stable NCERT/CBSE lab-manual content and is scientifically validated
by `tools/test-vlab.js`; what's unverified is specifically the *exact
official 2026-27 wording/numbering* of this practical. `npm run vlab:test`
prints the spec §28-style audit block on every run — do not hand-flip
`verificationStatus` to `'verified'` without the source PDF in hand.

## What's deliberately not built yet

Per spec §30 Loop 3 ("smallest complete vertical slice first, not 100 empty
cards"): no Teacher Dashboard, no second experiment, no Physics/Biology
module, no real sync-to-server (the `syncQueue` store in `db.js` exists but
nothing populates it — there is no server to sync to). All of these are
straightforward to add on top of the engine here (reuse
`state-machine.js`, `db.js`, the `Experiment` shape, and `render.js`'s
patterns) once this slice has been used and reviewed.
