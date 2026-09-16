# Validation — two levels, both required

See `CLAUDE.md`'s "Operating principles" for the one-paragraph version. This file is
the how-to.

## Level 1: Software (automated, run `npm run verify`)

- `npm run typecheck` — `node --check` every `js/*.js` file (syntax only; untyped JS).
- `npm run lint` — `eslint js/*.js` (flat config `eslint.config.js`).
- `npm run test` — `node tools/test-curriculum.js`: loads every `compute()`/
  `dataLab.calculate()`/`graphLab.model()` in a DOM-free Node context, sweeps each
  control's **full** min/max/step domain (not just min/mid/max — a drag calls the
  function once per pixel) asserting no NaN/Infinity, checks curriculum-registry
  integrity, and runs the specific formula-correctness assertions listed below.
- `npm run build` — `tools/build-check.js`: every local asset reference resolves,
  vendored libraries are the real thing (not a stub).
- `npm run smoke` — `tools/smoke.js`: a real headless-Chromium pass opens every
  simulation, exercises its controls (including a real pointer drag on every Graph Lab
  handle), and asserts zero console/page errors, at both a desktop and a mobile
  viewport.

Run all four after every change, not batched to the end of a session (`CLAUDE.md`).

### Formula-correctness assertions already in `tools/test-curriculum.js`

Mean/median/mode, Karl Pearson's r, Spearman's rank correlation, GDP three-method
equality, elasticity signs, curriculum-registry integrity (no duplicate `syllabusId`,
no sim mapped to a class/part/unit absent from `CURRICULUM_NODES`), i18n structural
checks (Hindi array lengths match English, Devanagari actually present).

**This list is not exhaustive of the economics the app teaches** — it's exhaustive of
what has an automated assertion. Level 2 below is where everything else gets checked.

## Level 2: Economic (a human or agent does the algebra)

Before shipping a changed or new `compute()`/`model()`/`customRender()`:

1. **Does the sign of every derivative match the economic law it's supposed to
   represent?** (Does a higher input cost actually shift supply the correct direction?
   Does more substitutes actually raise `|Ed|`? Does the PPF's MRT actually rise as `X`
   rises?) Do the algebra by hand, don't just trust that the code "looks right" — the
   Circular Flow Export/Import direction bug (see
   `docs/economics/models/circular-flow.md`) looked completely reasonable in the
   diagram and was backwards.
2. **Does every UI claim (a reading, an insight sentence, a verdict) match what the
   model actually computed**, not what it's supposed to compute in the general case?
   (e.g. a GDP quiz template must use the *actual* Investment figure the current state
   implies — `js/quiz-data.js`'s two guarded `macro-gdp` templates exist specifically
   because "Investment fixed at ₹50B" stops being true once the Financial Market toggle
   is on.)
3. **Does the stated assumption set actually hold in the code**, or has a "temporary"
   simplification silently become a permanent, undocumented one? (e.g. `S = I` in the
   Circular Flow lab is a *stated, correct* simplification for that lab — but it would
   be wrong to quietly reuse the same hardcoded equality in the Multiplier lab, where
   planned S≠I is the entire point.)
4. **Does the answer to a quiz `applyTemplates` question ever get computed twice with
   different formulas** (once in the sim, once in the quiz bank)? It should be computed
   once, by the sim's own `compute()`/`model()`, and read from `metrics` — never
   re-derived independently in `js/quiz-data*.js` (this is why `applyTemplates`
   questions "cannot drift," per `CLAUDE.md`).
5. **Write down the check in a `docs/economics/models/*.md` file** if the concept is
   substantial enough to warrant one (see the template in `docs/economics/README.md`) —
   this is what turns a one-time manual check into a durable, re-checkable record
   instead of tribal knowledge that has to be re-derived from scratch next time someone
   touches the same formula.

## Definition of done (repeated from `CLAUDE.md`, this is the enforceable checklist)

- [ ] Level 1 (`npm run verify`) is green.
- [ ] Level 2 checks above have actually been done, not assumed.
- [ ] `enrichment`/`enrichmentNote` used honestly if the content goes beyond the named
      syllabus topic (`CLAUDE.md` Working Convention 3).
- [ ] The visual (`customRender`/`graphLab` diagram, Plotly chart) is driven BY the
      model's output, never hand-tuned to imply a relationship the model doesn't
      actually produce.
- [ ] No regression in a neighbouring sim that shares engine code (`js/sim-engine.js`,
      `js/graph-lab-engine.js`, `js/quiz-engine.js`) — re-run smoke on at least one
      other sim of the same mode after touching shared code.
