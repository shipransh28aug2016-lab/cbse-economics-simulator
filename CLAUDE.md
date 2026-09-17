# CLAUDE.md — EconSim Pro (CBSE Economics 030 Simulator)

This file orients an AI agent (or a new engineer) working in this repository. It did not
exist before the CBSE 2026–27 curriculum-integration pass; it is written from a direct
audit of the code, not from assumptions.

## What this project is

**EconSim Pro** is a static, no-build, vanilla HTML/CSS/JavaScript web app that teaches
CBSE Economics (Subject Code 030), Class XI and Class XII, through interactive
simulations, data labs, and concept explorers. There is no backend — everything runs
client-side from `file://` or any static file server.

## Operating principles (read this before touching any sim)

1. **Economics correctness has priority over visual novelty.** A beautiful simulation
   that teaches an incorrect economic relationship is a failed feature, full stop — no
   amount of polish on `customRender`/`graphLab` art offsets a wrong slope, a wrong
   injection/leakage direction, or a movement drawn where a shift belongs. The Circular
   Flow lab's Export/Import direction bug (fixed in the sector-model rewrite — see
   `js/simulations.js`'s `macro-gdp`) is the canonical example of exactly the mistake to
   never repeat: it looked fine and was economically backwards.
2. **Validation is two-level, and both levels are required, not either/or:**
   - *Software* — `npm run verify` (typecheck/lint/test/build/smoke — see below). Catches
     crashes, NaN, broken drags, console errors.
   - *Economic* — does the model's own math actually produce the relationship the UI
     claims? (a demand curve that doesn't slope the right way, an elasticity formula
     that doesn't respond to its own stated determinant, an "indeterminate" claim the
     model can actually contradict). `tools/test-curriculum.js`'s formula-correctness
     assertions (mean/median/mode, Karl Pearson r, GDP three-method equality, elasticity
     signs, MRT sign, etc.) are the *automated* half of this; the rest is a
     read-the-formula-and-do-the-algebra check a human (or an agent) does before
     shipping — see `docs/economics/` for the worked reference this project maintains
     for exactly that purpose.
   - A sim is not done when `npm run verify` is green. It is done when it is ALSO
     economically correct and pedagogically honest about what it teaches (see
     `docs/economics/validation/README.md`).
3. **Definition of done** for any sim change: economic correctness + syllabus fidelity
   (`enrichment`/`enrichmentNote` used honestly, see Working Convention 3) + the model
   actually drives the visual (never a `customRender`/`graphLab` picture that implies a
   relationship the `compute()`/`model()` function doesn't produce) + `npm run verify`
   green + no regression in a neighbouring sim that shares engine code.

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

- `js/app.js` — screen routing (`showScreen`, `openSim`) and populates the home-screen
  grids from `SIMS` (keyed by `sim.module`: `micro`/`macro`/`stats`/`india` — this is a
  *display grouping*, independent of the `sim.class`/`sim.part`/`sim.unit` curriculum
  metadata, which is what the coverage matrix actually checks).
- `css/styles.css` — glassmorphism design system; one accent gradient per module.
- `js/plotly.min.js` — real Plotly.js v2.35.2 (not a stub).
- `js/i18n_engine.js` + `js/i18n_hi*.js` — real Hindi support, not stubs (they were
  stubs when this file was first written; that note is no longer true). `I18N_HI` holds
  static chrome strings, `SIM_I18N_HI` holds per-sim content keyed by `sim.id`, and
  `READINGS_I18N_HI` translates the strings that `compute()`/`calculate()`/`model()`
  build live from numbers, by literal substring replacement after rendering.
  `tools/test-curriculum.js` asserts every translated key matches something real on its
  sim and actually contains Devanagari.
- `js/quiz-engine.js` + `js/quiz-data*.js` — real, curriculum-tagged question banks:
  hand-authored `static` questions plus `applyTemplates` whose correct answer is
  *computed* from the sim's own output rather than authored, so it cannot drift.
  Every sim has one, and the test harness fails the build if a bank cannot generate
  ≥10 well-formed questions. XP/Badges/Profile remain UI-only — those are still
  placeholders and should not be described as curriculum-mapped.

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

## The transition layer (`js/transition-layer.js`) — cause → effect

`renderSimChart()` used to retain only the previous **control** state and discard the
model's own output after one render. So the app could name what the student moved and
never what the model did about it — cause without effect — and every before/after
visual in the app was a per-sim hand re-derivation of a previous state the engine
already had and dropped.

The engine now also retains `prevSimResult` (the previous `compute()`'s traces +
metrics). From that one retained object, two shared capabilities fall out with **no
per-sim code**:

- **The effect line** (`diffMetrics` → `describeEffects`) — the `⚡ Resulting effect`
  row under `🔄 What changed`. Reports only numeric metrics that actually moved, ranked
  by relative size, capped at 3. Metrics that merely echo a control the student just
  moved are suppressed (reporting "Consumption 90 → 130" as the *result* of moving the
  Consumption slider is circular) — but a metric the student did *not* touch stays in
  even if some other control shares its name, because a model forcing wages to follow
  consumption (the `Y = C` identity) is a real effect and one of the more interesting
  ones. Labels come from `sim.metricLabels`, then a shared glossary of standard
  economics abbreviations, then camelCase humanisation.
- **Auto-ghosting** (`buildGhostTraces`) — the previous positions of **only the curves
  that actually moved**, drawn dimmed beneath the live ones. This is the
  movement-vs-shift distinction generalised to every simulator-mode sim, derived from
  the model rather than authored: raising Fixed Cost ghosts AC and leaves MC alone
  (fixed cost cannot move marginal cost); raising autonomous consumption ghosts
  Aggregate Demand and leaves Aggregate Supply alone. Bars, markers and short traces
  are never ghosted. A sim that already draws its own before/after geometry opts out
  with `autoGhost: false` (`micro-supply-demand`, `macro-multiplier`) rather than
  stacking two different "previous" references on one chart.

The rule this layer must keep: **it contains no economic logic of its own.** A ghost
curve's coordinates ARE the previous `compute()`'s coordinates; an effect's numbers ARE
the model's metrics. It decides what is worth *showing*, never what is *true*. Direction
arrows are literal numeric direction (Ed −0.47 → −1.78 shows ▼, the number falling) and
deliberately do not editorialise ("more elastic") — that would be the layer inventing
economics. Covered by `testTransitionLayer*` in `tools/test-curriculum.js`, including
the AD-AS case asserted against the real model.

## PREDICT, the Teaching & Learning Toolkit, and misconceptions

Added on top of the Graph Lab / Quiz systems above, currently live on the 5
"gold-standard" sims (`gl-demand-movement-shift`, `gl-supply-movement-shift`,
`gl-market-equilibrium-shifts`, `micro-elasticity`, `micro-ppf`) and **not yet
propagated to the other 39** — treat that as an open backlog item, not a design
decision to leave it that way. See `docs/economics/pedagogy/README.md` for when each
piece below is actually worth adding to a sim (none of them are mandatory the way
`practice`/`challenge`/i18n/`QUIZ_BANK` are).

- **PREDICT gate (Graph Labs)** — `graphLab.predict: true` (`js/graph-lab-engine.js`'s
  `glOpenPredictGate`/`glComputeScenarioVerdict`). Gates a **scenario-button** click (never
  live dragging, which must stay instant): the student picks a guess from
  `GL_PREDICT_CHOICES` (movement/shift/both/none) — or a lab's own `predictChoices` when
  its `verdict.kind` means something else, e.g. `gl-market-equilibrium-shifts` where
  `'movement'` means "price away from equilibrium," not "movement along a curve" — before
  the scenario applies. The graded answer is always `sim.graphLab.model()`'s own live
  output for that scenario's target state, never a separately-authored answer.
- **PREDICT card (`simulator`-mode sims)** — `sim.predict = { controlId, prompt,
  choices, evaluate(before, after) }` (`js/sim-engine.js`'s `resetPredictCard`/
  `checkPredictReveal`). For a *continuous* slider rather than a discrete scenario click:
  the student guesses a trend, then the guess auto-grades the first time they actually
  move `controlId`, comparing `sim.compute()`'s own metrics before/after.
  `evaluate` returning `null` (e.g. a `select` control got switched to a mode the
  question doesn't apply to) leaves the card pending rather than grading a stale
  question — always design `evaluate` to fail this way, never to guess. Currently wired
  only through the `sim.compute` path — a `customRender` sim's `checkPredictReveal` call
  would need adding to `renderSimChart()`'s customRender branch before this could work
  there too.
- **Teaching & Learning Toolkit** — `sim.tlm = { keyIdea?, commonMistakes?:[...],
  examTip?, thinkQuestion?, activity?:{title,instructions}, exitTicket?, teacherExplain?,
  quickCheck?:{question,options,correctIndex,explain} }` (`js/sim-engine.js`'s
  `renderTLM`/`renderQuickCheck`, index.html's `#tlm-card`). Mode-agnostic — wired once
  at the shared `renderSim()` level, works identically on `simulator`/`graphlab`/
  `datalab`/`explorer`. Every field is independent and optional; render only what a sim
  actually declares. `quickCheck` is a single ungraded MCQ, deliberately not the full
  Quiz modal (no pool, no score, no Bloom's tag) — don't blur that line.
- **Misconception-tagged quiz answers** — `q.misconceptions = { <original option
  index>: {en,hi} }` on a `QUIZ_BANK` static question (`js/quiz-engine.js`'s
  `normalizeQuizQuestion`/`selectQuizAnswer`). Converted internally to a map keyed by the
  option's own text (so it survives `shuffleQuizOptions()`), and shown — in addition to,
  never instead of, `explain` — only for the specific wrong option the student picked.
  Use it for a genuinely common, *specific* mix-up (the classic movement-vs-shift or
  inside-vs-outside swaps), not as a second `explain` for every option.

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
6. Before changing (not just adding) a sim's economics, read `docs/economics/models/`
   first if that concept has a worked reference there — it documents the assumptions
   the current `compute()`/`model()` relies on, so a "fix" doesn't break an assumption
   another part of the same sim (or its quiz bank's `applyTemplates`) depends on. If the
   concept has no reference file yet and you're touching its formula meaningfully,
   add one — see `docs/economics/README.md` for the template and folder layout.
