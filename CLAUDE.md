# CLAUDE.md — EconSim Pro (CBSE Economics 030 Simulator)

This file orients an AI agent (or a new engineer) working in this repository. It did not
exist before the CBSE 2026–27 curriculum-integration pass; it is written from a direct
audit of the code, not from assumptions.

## What this project is

**EconSim Pro** is a static, no-build, vanilla HTML/CSS/JavaScript web app that teaches
CBSE Economics (Subject Code 030), Class XI and Class XII, through interactive
simulations, data labs, and concept explorers. There is no backend — everything runs
client-side from `file://` or any static file server.

## Curriculum source of truth

- `curriculum/Economics_2026-27_Content_MicroContent_Taxonomy.md` — the structured
  Class → Part → Unit → Topic → Micro-content taxonomy derived from the official CBSE
  2026–27 Economics (030) syllabus PDF. **This governs every class/part/unit label,
  every "chapter" tag, and every syllabus ID in the codebase.** If code and this file
  disagree, the file wins and the code is wrong.
- `js/curriculum-data.js` — the taxonomy above, re-expressed as a machine-checkable
  `CURRICULUM_NODES` registry (one entry per syllabus Topic, each with a unique
  `syllabusId`). This is the single source of truth the coverage matrix, the
  duplicate-ID check, and the class-mapping check are generated from — **do not**
  hand-maintain a separate coverage table that can drift from this file.
- `curriculum/Economics_SecP2_2026-27.pdf` is referenced by the taxonomy file's own
  header as the primary source it was derived from; the PDF itself was not supplied to
  this repository and is not present here. Treat the taxonomy `.md` as authoritative
  until/unless the PDF is added and cross-checked against it.

**2026–27 structure** (this is the correction this integration pass made — the app
previously had Micro/IED swapped between classes):

```
Class XI  — Part A: Statistics for Economics (Units 1–3)
          — Part B: Introductory Microeconomics (Units 4–7)
Class XII — Part A: Introductory Macroeconomics (Units 1–5)
          — Part B: Indian Economic Development (Units 6–8)
```

## Architecture (audited, not assumed)

- `index.html` — the shell: nav, Home screen (module grids grouped by Class), Simulation
  screen (chart + controls + info sidebar), Profile screen, Quiz modal. Loads every JS
  file via plain `<script>` tags in dependency order (no bundler, no ES modules).
- `js/curriculum-data.js` — `CURRICULUM_NODES`, `PART_TITLES`, `chapterTagText()`,
  `validateCurriculum()`. Loaded first; every sim file depends on it for tagging.
- `js/sim-engine.js` — shared engine. Owns `SIMEngineState`, builds control panels,
  dispatches rendering by `sim.mode`:
  - `mode: 'simulator'` (default/legacy) — slider/number controls drive `sim.compute(values)`
    → `{ traces, layout, readings }` rendered via Plotly, or `sim.customRender(container, values)`
    for hand-built SVG (e.g. the circular-flow animation).
  - `mode: 'datalab'` — routed to `js/datalab-engine.js`: an editable data table drives
    `sim.dataLab.calculate(rows)` → table/stats/chart/interpretation.
  - `mode: 'explorer'` — routed to `js/explorer-engine.js`: timeline / comparison /
    scenario content, no numeric computation.
  - `mode: 'graphlab'` — routed to `js/graph-lab-engine.js`: a hand-built SVG
    diagram drawn in the CBSE/Sandeep-Garg textbook idiom (arrow-headed axes with
    an `O` origin, curves labelled DD/SS/D₁D₁ at their far end, dotted OP/OQ
    projections from the equilibrium point, and named shift/movement arrows), whose
    curves and points the student **drags directly**. See "Graph Labs" below.
  All four modes share: Reset, a generic "🔄 What changed" diff line (computed from the
  previous vs. current control state — no per-sim code needed), and an optional
  `practice` checklist + auto-checked `challenge`.
- `js/panel-collapse.js` — every panel (home screen module blocks; the sim screen's
  Concept/Formulas/Readings/Practice/Challenge cards; the controls panel) is collapsible by
  clicking its header, with the choice persisted per-panel (not per-sim) in `localStorage`
  and a "Collapse All" master switch on each screen — see `initPanelCollapse()`,
  `initStaticPanelCollapse()`, `wireCollapseAllToggle()`. Static panels (module blocks, the
  five info cards) are wired once in `app.js`'s `initApp()`; the controls panel is rebuilt
  from scratch on every sim switch (and, for Data Labs, every add/remove row), so
  `buildControls()`/`renderDataLabTable()`/the explorer render functions each re-call
  `initPanelCollapse()` on their freshly-built header — it's idempotent, so this never
  stacks duplicate listeners. Defaults: Concept/Formulas/Practice/Challenge start collapsed
  (secondary/reference content); Live Readings and the controls panel start expanded (the
  core interactive loop) — chosen so a lab's whole screen fits with minimal scrolling
  without hiding the parts a student needs first.
- `js/simulations.js`, `js/simulations_extended.js`, `js/simulations_class11_micro.js`,
  `js/simulations_statistics_datalab.js`, `js/simulations_macro_datalab.js`,
  `js/simulations_ied_class12.js`, `js/simulations_graphlab.js`,
  `js/simulations_graphlab_macro.js` — all push onto the single global `SIMS` array. Every
  entry's data contract is documented at the top of `js/simulations.js`.

## Graph Labs (`mode: 'graphlab'`) — why they exist and how they work

Several things the syllabus names explicitly are distinctions about **motion**, and a
static chart cannot teach them. `js/curriculum-data.js` states the objective for
`XI-B-U5-DEMAND` as *"Distinguish a movement along the demand curve from a shift in it"* —
so a Graph Lab is a diagram the student physically moves:

- **Drag a point along a curve** ⇒ own price changed ⇒ **movement** ⇒ *Expansion /
  Contraction*.
- **Drag the whole curve sideways** ⇒ a non-price determinant changed ⇒ **shift** ⇒
  *Increase / Decrease*.
- A **verdict banner** under the diagram names, in exam wording (English + Hindi), exactly
  which of those just happened — including "both at once", which the exam expects to be
  named as two separate events.

The full `graphLab` data contract is documented at the top of `js/graph-lab-engine.js`.
Three points that are load-bearing rather than stylistic:

1. **The variable strip renders BELOW the diagram, inside the same stage** — a compact
   horizontal chip grid, not the tall stacked slider column in `#controls-panel` that the
   other modes use. That column pushed the diagram off-screen, so cause and effect could
   never be watched together. `#controls-panel` carries only optional
   `graphLab.scenarios` presets, and is hidden outright when a lab declares none.
2. **Every drag goes through one generic rule.** A `handle` declares `{bind, axis, k,
   invert}`; dragging it by Δ data units writes `vars[bind] = start + Δ/k`, clamped and
   step-snapped. There is no per-sim drag code, and `tools/smoke.js` performs a real
   pointer drag on every Graph Lab and asserts the rendered output actually changed.
3. **Chip group headings are per-lab** (`graphLab.groupLabels`). The default headings name
   the movement-vs-shift distinction, which only the demand/supply/market labs actually
   mean — every other lab must say what *its* two groups of variables really are, or the
   headings become confidently wrong.
- `js/app.js` — screen routing (`showScreen`, `openSim`) and populates the home-screen
  grids from `SIMS` (keyed by `sim.module`: `micro`/`macro`/`stats`/`india` — this is a
  *display grouping*, independent of the `sim.class`/`sim.part`/`sim.unit` curriculum
  metadata, which is what the coverage matrix actually checks).
- `css/styles.css` — glassmorphism design system; one accent gradient per module.
- `js/plotly.min.js` — real Plotly.js v2.35.2 (not a stub). `js/i18n_engine.js` and
  `js/i18n_hi.js` **are** stubs (`console.log('stub loaded')`) — the Hindi toggle only
  swaps a button label, not sentence content. Quiz/XP/Badges/Profile are UI-complete but
  their content banks are placeholders — do not represent them as curriculum-mapped.

## No build system — how "typecheck/lint/test/build" actually run here

There is no `package.json`, bundler, TypeScript, or test runner in the original repo.
This pass added a minimal one (`package.json` + `tools/`) using tools already available
in this environment (Node 22, global `eslint`, global `playwright`) rather than inventing
a framework the project never had:

- **Typecheck** → `node --check` on every `js/*.js` file (syntax-level; this codebase is
  untyped JS, so there is no real type system to check).
- **Lint** → `npx eslint js/*.js` (flat config at `eslint.config.js`).
- **Test** → `node tools/test-curriculum.js`: loads the math/data helpers and every
  `compute()` / `dataLab.calculate()` in a DOM-free Node context, sweeps each control's
  full min/max/step domain asserting no NaN/Infinity, and checks specific formula
  correctness (mean/median/mode, Karl Pearson r, Spearman's rank, GDP three-method
  equality, elasticity signs, etc.) plus curriculum-registry integrity (no duplicate
  `syllabusId`, no sim mapped to a class/part/unit absent from `CURRICULUM_NODES`).
- **Build** → there is nothing to bundle; "build" means `tools/smoke.js` (a Playwright
  headless pass) serves the static files, opens every simulation, exercises its
  controls, and asserts zero console/page errors, at both a desktop and a mobile
  viewport.

Run all four with `npm run verify`. Run them after every module you add — do not batch
verification to the end of a session.

## Working conventions

1. Never remove or repurpose an existing `sim.id` — cards may be referenced by saved
   progress. Extend entries; don't replace them.
2. Every sim must carry `class`, `part`, `unit`, `syllabusId(s)`, and `mode`. These drive
   the generated coverage matrix — an entry without them is invisible to it. It also needs
   a `QUIZ_BANK` entry (`js/quiz-data*.js`) and a `SIM_I18N_HI` entry (`js/i18n_hi*.js`);
   `tools/test-curriculum.js` fails the build without both.
3. If a sim's content is not explicitly named in `curriculum/Economics_2026-27_Content_MicroContent_Taxonomy.md`
   for the unit it sits under (even if it's standard NCERT content from a prior
   syllabus), set `enrichment: true` and say why in `enrichmentNote`. Do not silently
   claim syllabus coverage for it.
4. Reuse `js/sim-engine.js`'s shared helpers (`fmt`, `range`, `lineIntersect`,
   `plotlyDefaultLayout`, the practice/challenge/what-changed renderers) instead of
   duplicating logic per simulation.
5. Any numeric formula you add belongs in `tools/test-curriculum.js` too — an
   uncovered `compute()` is exactly the kind of "claims tested, isn't" gap this project
   is trying to avoid. A Graph Lab's `graphLab.model()` is swept across every variable's
   **full** declared domain (not just min/mid/max), because a drag calls it once per
   pixel and an NaN two-thirds of the way through a drag is one a student would hit.
