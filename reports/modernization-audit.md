# EconSim Pro → EconSim 2.0 — Modernization Audit (Stage 1)

Date: 2026-09-07
Scope: STAGE 1 only — inspection and classification. No code changed in this pass.
Method: read `CLAUDE.md`/`README.md`/`index.html`/`css/**`/`js/**`/`curriculum/**`/`reports/**`/`tools/**`,
ran `npm run verify` (see finding C-1 — it currently cannot complete), and read the actual source of the
five gold-standard modules named in the brief (Demand, Supply, Equilibrium, Elasticity, PPF) rather than
assuming their state from file names.

**Every claim below is evidence-grounded (file:line or a command output).** Where the brief's assumed
starting point ("everything is a slider", "no movement-vs-shift distinction", "no accessibility") turned
out to already be handled, that is reported as a strength, not silently confirmed — an audit that only
finds problems the brief expected to find isn't a real audit.

---

## A. Architecture map

```
index.html                  shell: nav, Home (module grids by Class), Simulation screen
                             (chart + controls + info sidebar), Profile, Quiz modal.
                             Plain <script> tags, dependency order, one shared global scope
                             (no bundler, no ES modules — see eslint.config.js's appGlobals
                             list, which is the de-facto module interface).

js/curriculum-data.js        CURRICULUM_NODES registry (source of truth), PART_TITLES,
                             chapterTagText(), validateCurriculum(). Loaded first.

js/sim-engine.js (694L)      shared engine: SIMEngineState, buildControls() (slider/number/
                             select), renderSimChart() dispatch by sim.mode, generic
                             "what changed" diff, practice/challenge rendering, Plotly
                             layout helpers, SVG flow-diagram helpers (curvedPathD,
                             flowStreamSVG, flowLabelSVG — used by the Circular Flow lab).

js/graph-lab-engine.js (572L) mode:'graphlab' engine: hand-built SVG diagrams in the CBSE/
                             textbook idiom (arrow axes, O origin, DD/D₁D₁ labels, dotted
                             OP/OQ projections), curves/points the student DRAGS directly.
                             Already has: ghost (before) curve toggle, scenario presets,
                             per-lab group labels, a generic movement/shift verdict
                             (glMoveShiftVerdict), keyboard-operable handles (role="slider",
                             tabindex, arrow-key adjustment — graph-lab-engine.js:191-192,
                             276-277, 341, 407).

js/datalab-engine.js (206L) mode:'datalab': editable data table -> calculate() -> table/
                             stats/chart/interpretation. Table+chart+reading already share
                             one source of truth per-render (no separate sync problem here).

js/explorer-engine.js (251L) mode:'explorer': timeline/cards/scenario content, no numeric
                             model (e.g. Five-Year Plans history).

js/quiz-engine.js (301L) +
js/quiz-data*.js (7 files,
~4000L combined)            per-sim question banks: hand-authored `static` + `applyTemplates`
                             whose correct answer is computed live from the sim's own
                             compute()/model() output (quiz-engine.js:137-177), so answers
                             cannot drift from the simulation. tools/test-curriculum.js fails
                             the build if any bank can't generate >=10 questions.

js/i18n_engine.js +
js/i18n_hi*.js (6 files)    real Hindi translation: static chrome (I18N_HI), per-sim content
                             (SIM_I18N_HI), and READINGS_I18N_HI — substring translation of
                             text a compute()/model() function builds live from numbers
                             (documented order-sensitivity: sim-engine.js:223-233).

js/simulations*.js (8 files,
~3800L)                     the actual sim registry (SIMS.push), ~44 entries across
                             module=micro/macro/stats/india, each carrying class/part/unit/
                             syllabusIds/mode + controls|graphLab|dataLab|explorer.

js/panel-collapse.js        per-panel collapse/expand, persisted in localStorage,
                             "Collapse All" master switch.

css/styles.css (1917L)      glassmorphism design system, one accent gradient per module,
                             prefers-reduced-motion support (line 106), 5 responsive
                             breakpoints (640/900/768/560/900px — lines 694,1540,1550,
                             1556,1911).

tools/*.js                  test-curriculum.js (curriculum integrity + full numeric sweep +
                             i18n structural checks), smoke.js (real headless-Chromium pass,
                             desktop+mobile viewport, drags every Graph Lab handle), build-
                             check.js (asset resolution), generate-*-report.js (docs).
```

**Rendering dispatch is real and already 4-way** (`sim-engine.js` `renderSimChart()`):
`simulator` (Plotly, slider-driven) / `datalab` / `explorer` / `graphlab` (hand-built,
drag-driven SVG). This already IS most of the "MODEL → STATE → VISUAL" pipeline the brief
asks for — it is not a flat slider-only app.

---

## B. Existing strengths (do not discard these — the brief explicitly warns against
rewriting working logic for visual novelty)

1. **Movement-vs-shift is already a first-class, working feature**, not a gap to invent from
   scratch. `js/simulations_graphlab.js:104-224`, sim `gl-demand-movement-shift`:
   - dragging the point along the curve writes only `price` (own-price) → movement;
     dragging the curve writes a named non-price determinant (`tastes`) → shift
     (graph-lab-engine's generic `handle: {bind, axis, k}` contract, documented in
     CLAUDE.md's "Graph Labs" section).
   - a **ghost (before) curve** is drawn when a shift happened (`glShowGhost`,
     lines 128-131) — this is literally Stage 3's "old curve remains visible briefly."
   - **two separate arrows** are drawn, one for the shift leg (horizontal, same price) and
     one for the movement leg (along the curve) — lines 163-183.
   - a **live verdict** names the exam-correct term via `glMoveShiftVerdict('demand',
     priceD, shift)` (line 190), including the "both at once" case the syllabus explicitly
     wants named as two separate events (CLAUDE.md, "Graph Labs" section).
   - **6 textbook scenario presets** exist (lines 118-125): price fall, price rise, income
     rise, substitute cheaper, complement cheaper, "both at once".
   - readings already isolate movement-effect vs shift-effect as separate numbers
     (lines 186-191: "Movement effect (price alone)" vs "Shift effect (determinants alone)").
   The Supply Graph Lab (`gl-supply-movement-shift`, line 236) and the Market Equilibrium
   Graph Lab (`gl-market-equilibrium-shifts`, line 331) follow the identical pattern.
2. **The generic drag contract is real, not per-sim hacked code.** One handle schema
   (`{bind, axis, k, invert}`) drives every Graph Lab; `tools/smoke.js` performs an actual
   pointer drag on every Graph Lab and asserts the rendered output changed — this is a
   genuine regression test for the causal loop the brief calls "STUDENT ACTION → ECONOMIC
   CAUSE → MODEL CHANGE → VISUAL CHANGE," already enforced by CI-equivalent tooling.
3. **Handles are already keyboard-operable** (`graph-lab-engine.js:191-192, 276-277, 341,
   407` — `role="slider"`, `tabindex="0"`, arrow-key adjustment), and the chip-strip
   variable controls likewise. Accessibility for drag interactions is not a blank slate.
4. **Quiz answers cannot drift from the simulation** — `applyTemplates` computes the correct
   option from the sim's own live output (`quiz-engine.js:137-177`), not an authored number
   that can go stale when a formula changes. This is a stronger foundation than most "AI-age"
   ed-tech quiz systems, which usually hardcode answers.
5. **A real "what changed" diff already exists generically** (`sim-engine.js`
   `describeWhatChanged()`), and DataLab already keeps table/chart/reading in sync from one
   `calculate()` call per render — the STAGE 12 "single source of truth" pattern already
   exists for 2 of the 4 modes.
6. **Curriculum-vs-code honesty is already a first-class constraint**, not something to add:
   `enrichment`/`enrichmentNote` fields, `tools/test-curriculum.js`'s class/part/unit
   validation, and 100% (59/59) curriculum-node coverage are enforced by the test suite
   today (`npm run test` output: "Curriculum coverage: 59 / 59... Quiz bank coverage: 44/44
   ... 38,188 assertions run, 0 failed").
7. **Real Hindi throughout**, including translating text built live from numbers
   (`READINGS_I18N_HI`), not just static chrome.
8. **A real headless-browser regression suite** (`tools/smoke.js`) already checks desktop
   AND mobile viewports and zero console errors across all 44 sims — this is uncommon rigor
   for a no-build static app and should be extended, not replaced.

---

## C. Technical weaknesses

- **[P0] `npm run verify` cannot currently complete.** `npm run lint` exits with 3 real
  `no-undef` errors (`performance`, `requestAnimationFrame` ×2 — `js/app.js:193,198,200`),
  and the npm script chain is `typecheck && lint && test && build && smoke`, so a `&&` chain
  halts at lint and `test`/`build`/`smoke` never run when invoked via `npm run verify`. The
  code itself is correct (these are real browser globals used correctly); the error is a gap
  in `eslint.config.js`'s `appGlobals`/environment globals list. This is the single most
  important P0: the project's own stated verification gate for every future change is
  broken today, independent of anything about economics or UI.
- **[P1] Two independent "Demand" experiences with no cross-navigation or stated
  relationship**: `micro-supply-demand` (Plotly, 7 determinant sliders, one static chart) and
  `gl-demand-movement-shift` (Graph Lab, drag-based, movement/shift-aware). A student or
  teacher has no way to know from the Home grid that these are different depths of the same
  topic, or which to use for what. This is a genuine information-architecture gap the brief's
  "one gold-standard Demand module" framing doesn't fully anticipate, since the depth already
  exists but is split across two disconnected cards.
- **[P2] No shared "visual grammar" library.** `flowStreamSVG`/`flowLabelSVG`/`curvedPathD`
  (Circular Flow) and the Graph Lab's curve/point/arrow renderer are two separate,
  independently-built SVG systems with no shared primitives (`Curve`, `Point`, `Shift`,
  `Equilibrium`, `Shock` as the brief's Stage 6 names them). Extending "shift" styling or
  "ghost-curve" behavior to a non-Graph-Lab visualization currently means re-implementing it.
- **[P2] No component-level reuse between `simulator` mode's Plotly charts and `graphlab`
  mode's hand-drawn SVG** — a determinant-sweep sim like `micro-supply-demand` cannot use the
  Graph Lab's ghost-curve/verdict/drag primitives without a rewrite to `mode: 'graphlab'`.
- **[P3] `js/simulations_graphlab.js` (853L) and `js/quiz-data-graphlab.js` (1060L) are the
  two largest files in the repo** and will only grow as more Graph Labs are added — no
  internal grouping by topic yet (all Graph Labs concatenated in encounter order).

---

## D. Educational weaknesses

- **[P1] No PREDICT step anywhere.** Every sim (including the already-strong Graph Labs)
  shows cause and effect simultaneously as the student drags — there is no "guess the
  direction/outcome, then reveal" mechanic (`grep -rn "predict"` across `js/*.js` finds only
  prose mentions in concept text and curriculum data, never an interactive predict-then-check
  UI). This is the single biggest gap relative to the brief's core PREDICT→CHANGE→OBSERVE→
  MEASURE→COMPARE→EXPLAIN→PRACTISE loop — 6 of 7 stages exist somewhere, PREDICT exists
  nowhere.
- **[P1] No misconception engine.** `grep -rn "misconception"` across `js/*.js` returns
  nothing. Wrong quiz answers get a static `explain` string (authored per-question) but there
  is no structured "detected misconception → targeted correction → retry" loop as Stage 13
  describes; a wrong answer and a right-but-lucky answer get the same generic feedback shape.
- **[P1] No live "WHY did this happen?" button anywhere**, despite the underlying data
  already existing to build one cheaply: `metrics` objects already carry `priceD`/`shift`
  (Graph Labs) or `demandShift`/`supplyShift` (`micro-supply-demand`), and
  `glMoveShiftVerdict()` already generates exam-correct wording from exactly that data. The
  verdict/insight text is currently baked into the render pass rather than exposed as an
  on-demand, structured explanation a student re-reads after the fact.
- **[P2] No before/after COMPARE view as a distinct mode** — the ghost curve is a
  same-screen overlay, not a side-by-side "before | after" the brief's Stage 4 names
  explicitly. A student who wants to freeze and compare two states cannot without manually
  toggling and screenshotting.
- **[P2] XP/Badges/Profile are explicitly UI-only placeholders** (per `CLAUDE.md`: "XP/
  Badges/Profile remain UI-only... should not be described as curriculum-mapped") — the
  gamification layer is decorative, not tied to the PRACTISE/ASSESS loop.
- **[P3] Practice checklists are static hint text** (`sim.practice: [{prompt, hint}]`,
  rendered via `<details>`), not adaptive to what the student actually did.

---

## E. UX weaknesses

- **[P1] No mode separation for audience** — Student/Teacher/Presentation modes named in
  Stage 9/10 do not exist (`grep` confirms zero matches for "teacher mode"/"presentation
  mode" in `js/*.js` or `index.html`). Every screen is the same regardless of who's using it
  or on what device (a smartboard vs. a phone), beyond CSS responsive breakpoints.
- **[P1] The controls panel is slider/number-first for every `simulator`-mode sim** — CLAUDE.md
  itself documents `select` (segmented buttons) as a second control type, and Graph Labs
  already use chips/knobs/drag, but every plain `simulator`-mode sim (the majority of the 44)
  still defaults to sliders even for genuinely categorical choices, exactly Stage 7's
  complaint — just not universally true across the whole app the way the brief assumes.
- **[P2] No "freeze/reveal" affordance for classroom use** — a teacher projecting a Graph Lab
  cannot freeze the current state, hide the verdict/explanation to ask the class first, then
  reveal it; the verdict renders immediately and unconditionally.
- **[P2] Home screen density**: with `enrichment:true` now spreading to more sims (including
  the just-updated Circular Flow lab), there is no visual marker on the Home grid cards
  distinguishing "core syllabus" from "enrichment" content — a student/teacher only discovers
  this by opening the sim and reading its Concept card.
- **[P3] No onboarding/tour** for a first-time user landing on 44 cards across 4 module
  groups; the Home screen's own hero stats strip is the only orientation.

---

## F. Visual weaknesses

- **[P2] Two unrelated visual languages coexist**: the glassmorphism/gradient card system
  (`css/styles.css`, module accent colors) for the app chrome, and the flat, textbook-style
  SVG diagrams for Graph Labs — intentionally different (Graph Labs deliberately mimic the
  CBSE/Sandeep-Garg textbook idiom, which is correct and should NOT be "modernized" away),
  but there is currently no shared visual bridge (e.g., consistent color-per-concept across
  both systems: "shift" is red in Graph Labs but has no fixed meaning in Plotly-mode sims).
- **[P3] The brief's stated risk ("childish UI, excessive neon, decorative particles") is
  only partially present**: `#particle-bg` canvas exists in `index.html:33` as an ambient
  background; the emoji-heavy module icons/badges are a deliberate, consistent system (not
  noise) but do read as playful rather than "scientific software" — a legitimate, moderate
  finding, not the "balloon" level of the earlier 3D miss.
- **[P3] No dark mode** — `css/styles.css` defines one light glass theme; a classroom
  projector or evening self-study session gets no alternative.

---

## G. Interaction weaknesses

- **[P1] `simulator`-mode charts (Plotly) are not directly manipulable** — a student reads a
  chart that redraws in response to sliders, but (unlike Graph Labs) cannot drag a point or
  curve directly on the Plotly chart itself. This is the real, narrower version of Stage 7's
  complaint: it's not that "everything is a slider" project-wide (Graph Labs disprove that),
  it's that the two rendering paths (`compute()`→Plotly vs `graphLab.model()`→hand SVG) offer
  fundamentally different interaction richness, and most of the 44 sims are on the
  less-interactive path.
- **[P2] No stepper/timeline scrubbing** for any sim that has a natural sequence (e.g., the
  Multiplier lab's successive spending rounds, or a business-cycle/Five-Year-Plans timeline)
  — `explorer` mode has `type:'timeline'` for pure historical content, but no sim currently
  lets a student step through a multi-round economic process (e.g., multiplier rounds 1,2,3…)
  one step at a time.
- **[P3] Scenario presets exist only in Graph Labs** (`graphLab.scenarios`) — `simulator`-mode
  sims have no equivalent one-click named-scenario control, despite the underlying `controls`
  data shape making it straightforward to add.

---

## H. Curriculum gaps

- **[P1] No single "TLM per topic" registry.** `CURRICULUM_NODES` maps topics to covering
  sims (many-to-many via `syllabusIds`), which is the right foundation, but there is no
  parallel registry for non-simulator TLM artifacts (concept sheets, worksheets, board
  diagrams) the brief's Stage 15/16 wants generated per topic — today "coverage" means "has a
  sim," not "has a full Concept→Visual→Demo→Simulation→Activity→Practice→Exam-Question
  chain" per topic.
- **[P2] Enrichment is sim-level, not content-level within a sim.** The Circular Flow lab
  (just updated) is now `enrichment:true` as a whole, even though its baseline 2-Sector
  content IS the named syllabus topic — a student/teacher has no way to see, within one sim,
  which specific reading/control is core vs. enrichment (this is a direct, current
  consequence of the enrichment flag being sim-granular, worth revisiting if EconSim 2.0
  reworks the registry).
- **[P3] `reports/REMAINING_UNMAPPED_CONTENT.md` and `SYLLABUS_COVERAGE_REPORT.md` already
  exist and are generated by `tools/generate-coverage-report.js`** — this infrastructure is a
  strength to build on for Stage 16, not a gap, but it currently reports sim-level coverage
  only, not the fuller TLM chain.

---

## I. Teacher/TLM gaps

- **[P0 educational, not code]** Every item in Stage 8/9/15 is currently absent:
  `ConceptCard`/`InteractiveDiagram`/`TeacherExplain`/`KeyIdea`/`CommonMistake`/`ExamTip`/
  `ThinkQuestion`/`QuickCheck`/`Activity`/`ExitTicket` as reusable components do not exist;
  the closest analogues are the existing `concept`/`formulas`/`practice`/`challenge` fields,
  which cover maybe 3 of these 10 named artifact types (Concept≈ConceptCard,
  Practice≈Activity/QuickCheck loosely, Challenge≈ExitTicket loosely). This is the largest
  clean-sheet gap in the whole audit — nothing to "fix," a genuine net-new subsystem.
- **[P1] No generator for Worksheet/MCQ/Assertion-Reason/Case-Study/Viva/Revision-Card** —
  `quiz-data*.js` covers MCQ only, and only inside the app's own quiz modal, not as an
  exportable/printable artifact a teacher could hand out.

---

## J. Assessment gaps

- **[P1] Quiz questions are single-attempt, single-question-at-a-time, no adaptive
  difficulty** — `quiz-engine.js` shuffles a fixed pool and steps through it; there's no
  branching on repeated wrong answers to the same concept (ties back to the missing
  misconception engine, D above).
- **[P2] No assessment artifact beyond the in-app quiz** — no Assertion-Reason, Case Study,
  or Competency-based question types anywhere in `quiz-data*.js` (all are 4-option MCQ),
  despite CBSE's own board papers using exactly those formats (the codebase's own Bloom's
  Taxonomy tagging in `quiz-engine.js` — remember/understand/apply/analyse/evaluate/create —
  shows real intent toward CBSE's cognitive-level split, just not yet toward its
  question-*format* variety).
- **[P3] No per-student progress persistence beyond localStorage panel-collapse state and
  UI-only XP** — no record of which concepts a student has demonstrated mastery of.

---

## K. Accessibility gaps

*(Correcting the brief's assumption that this is a blank slate — see B.3 above for what
already works.)*

- **[P1] Plotly-mode charts have no keyboard/non-pointer equivalent for the (currently
  nonexistent) direct-manipulation interaction** — moot today since those charts aren't
  drag-manipulable at all (see G above), but becomes a real requirement the moment
  Plotly-mode sims gain direct manipulation.
- **[P2] No systematic screen-reader-only live-region announcement** when a Graph Lab's
  verdict changes (e.g., "Expansion of Demand") — the verdict is visible text, but a screen
  reader user dragging a keyboard-operable handle gets no equivalent of the sighted "the text
  just changed to X" feedback unless it happens to be within an already-focused/read element.
- **[P3] Color is used as a primary signal for movement (blue) vs shift (red) in Graph Labs**
  — labels and arrow text also carry the distinction in words (good), but a colorblind-safe
  audit of the specific hex pairs (`#2563eb` vs `#dc2626`) hasn't been done.
- **[P3] No documented contrast audit** of the glassmorphism panels (translucent white-on-
  gradient) against WCAG AA, though the design system is consistent enough to check quickly.

---

## L. Performance gaps

- **[P3] `js/plotly.min.js` is 4.6MB** (`tools/build-check.js` output) and loads on every
  page view regardless of whether the opened sim is `simulator` mode (uses Plotly) or
  `graphlab`/`datalab`/`explorer` (mostly do not) — no lazy-loading of Plotly for sims that
  never call it.
- **[P3] All 8 `simulations*.js` + 7 `quiz-data*.js` + 6 `i18n_hi*.js` files (44 sims'
  worth) load on every page view** — no per-sim or per-module code-splitting, though at
  current total size (~11,800 lines of plain JS, no framework) this is very unlikely to be a
  real user-facing problem yet; flagged for awareness if EconSim 2.0 adds substantially more
  per-sim code (e.g., new visual-grammar components) without revisiting load strategy.
- **[P3] No lazy-loading of the 44 sims' definitions** — `SIMS` is one flat array built
  entirely at page load; fine at current scale, worth re-checking if Stage 21's expansion
  significantly grows per-sim payload size.
- **No P0/P1 performance issues found** — `tools/smoke.js` already passes with zero console
  errors at both desktop and mobile viewports across all 44 sims, and the architecture's
  "no bundler, no framework" choice keeps baseline load light. Performance is not currently
  the constraint; correctness of the verify pipeline (C-1) and the educational/TLM gaps
  (D, I, J) are.

---

## Summary count by severity

| Severity | Count | Representative items |
|---|---|---|
| P0 | 2 | `npm run verify` broken at lint (C-1); the full teacher-TLM component set is entirely absent (I-1) |
| P1 | 10 | two disconnected Demand experiences; no PREDICT step; no misconception engine; no live WHY button; no Student/Teacher/Presentation modes; Plotly charts not directly manipulable; no TLM-per-topic registry; no worksheet/assertion-reason/case-study generators; non-adaptive quiz; Plotly-mode has no keyboard-equivalent direct manipulation (moot today, real once G is fixed) |
| P2 | 11 | no shared visual-grammar library; no Plotly↔GraphLab component reuse; no before/after compare view; XP/Profile decorative; no freeze/reveal; Home grid doesn't flag enrichment; two coexisting visual languages; no stepper/timeline scrubbing; scenario presets Graph-Lab-only; enrichment is sim- not content-granular; no assessment-format variety |
| P3 | 11 | large Graph Lab files ungrouped; particle background reads as decorative; no dark mode; no onboarding; no per-student mastery tracking; color-only movement/shift signal risk; no contrast audit; 4.6MB Plotly always loads; no code-splitting; no sim-definition lazy-loading; static (non-adaptive) practice hints |

