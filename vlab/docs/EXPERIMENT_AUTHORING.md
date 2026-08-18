# CBSE V-LAB — Authoring a New Experiment

Follow this order — each step depends on the previous one passing
`npm run vlab:test`.

## 1. Curriculum node first

Add an entry to `CURRICULUM_NODES` in `src/curriculum/registry.js` (and mirror
it in `data/curriculum/*.json`). Required fields: `id` (unique, all-caps
hyphenated, e.g. `XI-PHYS-...`), `class`, `board`, `subject`, `subjectCode`,
`unit`, `topic`, `contentStatus`, `verificationStatus`, `sourceReference`.
Set `verificationStatus: 'needs-review'` unless you have the official
CBSE 2026-27 syllabus PDF in hand and have actually checked it — see
`CURRICULUM.md`'s honesty rule.

## 2. The simulation model, pure and DOM-free

If the experiment has a numeric/physical model (most do), write it as a
standalone file in `src/simulation/`, following
`permanganometry-model.js`'s shape:

- Every exported function takes plain values/objects, returns plain
  values/objects. No `document`, no `window` (other than the dual-export
  wrapper), no hidden mutable module state beyond true constants.
- Handle zero/negative/`NaN`/`Infinity` inputs without throwing — return
  `NaN`/`Infinity`/a safe sentinel instead. `tools/test-vlab.js` sweeps for
  exactly this.
- Dual export: `module.exports = api;` and `root.VLAB.<yourModel> = api;`
  inside the same IIFE pattern as the existing files.

Add the matching sweep to `tools/test-vlab.js` — spec §5's rule applies
here too: an uncovered formula is exactly the kind of "claims tested, isn't"
gap this project exists to avoid.

## 3. The Experiment object

New file in `src/experiments/`, one `EXPERIMENT` constant with (spec §5,
§28's `REQUIRED_EXPERIMENT_FIELDS`): `id`, `class`, `subject`,
`curriculumMapping` (with `topicId` pointing at step 1's node),
`objective`, `apparatus`, `materials`, `variables`, `procedure`,
`errorSimulation`, `observationModel`, `calculations`, `expectedResult`,
`safety`, `viva`, `assessment`. Push it onto `root.VLAB.experiments` in the
same dual-export IIFE pattern.

`id` is permanent once shipped — spec's working-convention #1 ("never
remove/repurpose an id") applies to experiments exactly as it applies to
EconSim Pro's `sim.id`.

### Viva bank

Spread difficulty across remember/understand/apply/analyze/evaluate (not all
"remember"). Every question needs `expectedConcept` *and*
`commonMisconception` — `tools/test-vlab.js` checks both are present.

### Error simulation

List the procedural mistakes a real student could make and the corrective
feedback (spec §8: explain *why*, never just "wrong"). Wire the
corresponding condition into the simulation model's state function (see
`permanganometry-model.js`'s `flaskState()` `warnings` array) so the
workspace UI can surface it live, not just in this text.

## 4. UI

Add render functions to `src/ui/render.js` only if the new experiment's
interaction shape genuinely differs from the existing Workspace/Notebook/
Viva/Assessment screens (a titration, a circuit, a microscopy stage-drag all
plausibly reuse the same 5-screen shell with different Workspace content).
Reuse `glassPanel()`, `esc()`, `fmt()` — don't duplicate them per experiment.

## 5. Wire it into `app.js` and `index.html`

- Add the new `src/**/*.js` files to `index.html`'s `<script>` list, in
  dependency order (curriculum → state-machine → simulation → experiment →
  offline → ui → app.js), and to `sw.js`'s `APP_SHELL` array —
  `vlab/tools/build-check.js` will fail the build if you forget the latter.
- If multiple experiments coexist, `app.js` will need an experiment picker
  before the Lab screen — not built yet because there is currently exactly
  one experiment (spec §30 Loop 3 again).

## 6. Verify

```
npm run vlab:verify
```
runs typecheck → lint → `tools/test-vlab.js` (formulas, state machine,
curriculum audit) → `tools/build-check.js` (asset + cache-list check) →
`tools/smoke.js` (full Playwright workflow, desktop + mobile, zero console
errors required). All five must pass before the new experiment is
considered done — spec §34's Definition of Done, checked mechanically where
it can be.
