# QA / Regression Report

Every item below is checked against a command you can re-run yourself (`npm run verify` runs all of them in
order). "Pass" means the automated check passed on the latest run in this session; nothing here is asserted
from memory.

| Requirement | Check | Result |
|---|---|---|
| Class XI complete | `reports/SYLLABUS_COVERAGE_REPORT.md` — Class XI, Parts A+B: 23/23 topics covered (Part A: 8, Part B: 15) | ✅ Pass |
| Class XII complete | `reports/SYLLABUS_COVERAGE_REPORT.md` — Class XII, Parts A+B: 36/36 topics covered (Part A: 24, Part B: 12) | ✅ Pass |
| Correct syllabus hierarchy | `js/curriculum-data.js` `CURRICULUM_NODES` encodes Class→Part→Unit→Topic exactly as `curriculum/Economics_2026-27_Content_MicroContent_Taxonomy.md`; `index.html` home screen is grouped Class XI (Stats + Micro) → Class XII (Macro + IED), matching it | ✅ Pass (see "Critical correction" below) |
| No duplicate syllabus IDs | `tools/test-curriculum.js`: `duplicateSyllabusIds` check + `CURRICULUM_NODES` self-uniqueness check | ✅ Pass — 0 found |
| No wrong class mapping | `tools/test-curriculum.js`: `classMismatches` check (every `sim.syllabusIds` reference is cross-checked against that node's actual `class`) | ✅ Pass — 0 found |
| All simulator calculations tested | `tools/test-curriculum.js`: 2,667 assertions (generic sweep, all 34 labs) + 10 targeted formula checks — see `reports/CALCULATION_TEST_REPORT.md` | ✅ Pass — 0 failed |
| Student data input works | `tools/smoke.js`: every Data Lab's editable cells filled/changed live in a real browser; every Simulator's range/number/segmented controls exercised | ✅ Pass |
| Graphs update correctly | `tools/smoke.js`: after every interaction, `#sim-dom-overlay` / `#readings-body` re-render is asserted non-empty and free of `NaN` | ✅ Pass |
| Reset works | `tools/smoke.js`: `.reset-btn` clicked for all 34 labs (shared class across Simulator/Data Lab/Explorer engines) | ✅ Pass |
| Invalid inputs cannot crash the app | `tools/smoke.js`: blanked/out-of-range Data Lab cell and Simulator numeric input — 0 thrown errors, numeric inputs snap back to a valid in-range value, no literal `NaN` leaks into the UI | ✅ Pass |
| Responsive / mobile UI works | `tools/smoke.js`: 390×844 viewport, home screen + 3 representative labs (one per non-legacy mode) — 0px horizontal overflow | ✅ Pass |
| No console errors | `tools/smoke.js`: `console`/`pageerror`/`requestfailed`/non-OK `response` listeners across the entire run (34-lab sweep + invalid-input tests + mobile pass) | ✅ Pass — 0 errors (after filtering the sandbox's external Google Fonts CDN block and the browser's automatic `/favicon.ico` probe, neither of which is app code — see `tools/smoke.js`'s `BENIGN_URL_PATTERNS`) |
| No TypeScript errors | N/A — this codebase is plain, untyped JavaScript with no `tsconfig.json` in the original repo; see "Typecheck substitution" below | ✅ Substituted check passes |
| No lint errors | `npx eslint js/*.js` (flat config, `eslint.config.js`) | ✅ Pass — 0 errors, 13 warnings (all explained below) |
| Production build succeeds | `tools/build-check.js` — every local `<script src>`/`<link href>` in `index.html` and `system_test.html` resolves, and `plotly.min.js` is verified to be the real 4.6MB library, not a stub | ✅ Pass |

## Critical correction made during this pass

**The pre-existing app had Class XI and Class XII swapped.** Before this integration: Microeconomics and
Macroeconomics were both labelled "Class XII", and Indian Economic Development was labelled "Class XI" — the
pre-2026-27 CBSE structure. The supplied 2026-27 taxonomy places **Introductory Microeconomics in Class XI**
(Part B, alongside Statistics for Economics) and **Indian Economic Development in Class XII** (Part B,
alongside Introductory Macroeconomics). This is now corrected throughout: `js/curriculum-data.js`'s
`CURRICULUM_NODES`, every sim's `class`/`part` metadata, the generated chapter tag on every lab screen, and
the home page's Class XI / Class XII grouping. `tools/test-curriculum.js`'s `classMismatches` check exists
specifically to catch a regression of this bug.

## Typecheck substitution

The original repo has no `package.json`, bundler, or `tsconfig.json` — it is deliberately plain
`<script>`-tag JavaScript (see `CLAUDE.md`). "Typecheck" here means `node --check` on every `js/*.js` file
(syntax validity), which is the honest equivalent available without introducing a build step the project
never had. `npm run typecheck` — **pass**.

## Lint warnings, explained (0 errors)

All 13 ESLint warnings are `no-unused-vars` false positives inherent to the "one shared global scope across
plain `<script>` tags, no bundler" architecture: a function like `fmt()` or `range()` is declared in
`js/sim-engine.js` and consumed by `js/simulations.js` et al., but ESLint lints one file at a time and can't
see across files. Each is a function/variable that genuinely is used — just not in the file that defines it.
`eslint.config.js` documents this explicitly. Two real issues of this kind (a redundant `no-useless-assignment`
in a `try/catch`, an unnecessary string escape) were found and fixed during this pass, not left as noise.

## Pre-existing, out-of-scope items (unchanged by this pass)

- `js/i18n_engine.js` / `js/i18n_hi.js` are stubs (`console.log('stub loaded')`) — the 🌐 language toggle
  swaps a button label only, not sentence-level content. Present before this integration; not part of the
  CBSE curriculum-mapping task, so left as-is rather than silently expanded in scope.
- The Quiz engine, XP/Badges, and Profile progress rings are UI-complete but their content banks/progress
  tracking are placeholders (`0%` rings, static quiz content) — likewise pre-existing and out of this task's
  scope. The new `practice`/`challenge` system added in this pass is a **separate, fully live** mechanic
  (see `reports/SIMULATOR_COVERAGE_REPORT.md`) and is not affected by the Quiz system's placeholder status.

## How to re-run everything

```bash
npm run verify   # typecheck && lint && test && build && smoke, in that order
```
