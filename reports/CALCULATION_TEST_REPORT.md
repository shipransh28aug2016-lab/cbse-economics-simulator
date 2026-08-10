# Calculation Test Report

How every numeric model in EconSim Pro was tested, and what actually got verified — not just "it built".

## Method (see `tools/test-curriculum.js`, run via `npm test`)

Since this is a static, no-bundler app, there is no Jest/Mocha config to lean on. The harness instead loads
every `js/*.js` file into one shared Node `vm` context (mirroring the browser's shared global scope from
`<script>` tags), then runs two layers of checks against the live `SIMS` array:

1. **Generic sweep, all 34 labs.** For every Simulator control, every value in `{min, max, default value,
   midpoint}` is fed into `compute()` (cross-product across all controls with the others held at default);
   every trace's `x`/`y` arrays and every returned `metrics` value is asserted finite (no `NaN`/`Infinity`
   ever reaches Plotly). For every Data Lab, `dataLab.calculate()` is run on its default dataset, on a
   dataset with **every numeric cell corrupted** (simulating what `dataLabValidate()` must sanitise before
   calculation), and on the minimum legal row count — asserting no thrown error and no non-finite output in
   any case. Every `challenge.check()` function is also invoked and asserted not to throw.
   **Result: 2,667 assertions, 0 failures, 0 warnings** (latest run; re-run with `node tools/test-curriculum.js`).
2. **Targeted formula-correctness checks** on a representative, economically load-bearing subset — picked
   because each is either brand-new to this integration pass or is the kind of formula a board exam would
   actually grade numerically:

| # | Sim | What's verified | Why this one |
|---|---|---|---|
| 1 | `stats-central-tendency` | Mean, Median and Mode of `[2,4,4,6]` all equal 4 | Hand-computable ground truth for all three central-tendency measures at once |
| 2 | `stats-correlation` | Perfectly linear data ⇒ Karl Pearson's r = 1; perfectly monotonic data ⇒ Spearman's rank r = 1 | The two headline formulas of Unit 3's Correlation topic, on the one dataset shape that has an unambiguous correct answer |
| 3 | `stats-index-numbers` | Doubling every commodity price ⇒ Index = 200, Inflation = 100% | Simple Aggregative Method arithmetic, the topic's named formula |
| 4 | `macro-national-income-methods` | Value Added Method total exactly equals Income Method total (profit is the residual) | The core "the three methods must agree" identity the syllabus's own learning objective names |
| 5 | `macro-propensity` | Fitted MPC recovers the true slope (0.7) on a clean linear Y/C dataset; MPC + MPS = 1 always | Regression-based MPC has to actually fit correctly, not just "look plausible" |
| 6 | `macro-multiplier` | k − \|kt\| = 1 at MPC = 0.2, 0.5, 0.8 | The fixed algebraic relationship between the spending and tax multipliers, checked across the whole MPC range, not one value |
| 7 | `micro-ppf` | Y=C at X=0, Y=0 at X=C, opportunity cost (MRT) = 1 at the midpoint of a C=20 frontier | The three defining properties of the illustrative PPF used (endpoints + the Law of Increasing Opportunity Cost) |
| 8 | `micro-indifference-curve` | Equilibrium bundle exactly exhausts the budget line; MRS = price ratio at equilibrium | The two defining conditions of consumer equilibrium under indifference-curve analysis |
| 9 | `micro-revenue-producer-equilibrium` | MR = MC at Q* under Perfect Competition | The producer's-equilibrium condition itself |
| 10 | `micro-price-controls` | A control price below equilibrium is correctly classified a ceiling with a shortage; above equilibrium, a floor with a surplus | Direction-of-effect correctness, not just "a number came out" |

All ten pass. Run `node tools/test-curriculum.js` to re-execute this exact list (search the file for
`testCentralTendency`, `testCorrelation`, etc.).

## Known simplifications (disclosed, not hidden)

A few models trade exact realism for a clean, explorable illustration — each is called out **in its own
concept text**, not just here:

- `micro-ppf` uses an illustrative concave PPF (`Y = C − X²/C`), not real production data.
- `micro-indifference-curve` assumes Cobb-Douglas preferences (closed-form, verifiably correct equilibrium)
  rather than a general utility function.
- `macro-national-income-methods`'s Expenditure Method total is an **illustrative fixed-percentage split**
  of the Value-Added total, not an independently entered/verified figure — the report and the sim's own
  interpretation text say so explicitly, because C/I/G/NX aren't naturally per-firm data.
- `ied-comparison-neighbours` and `india-poverty` ship **illustrative, editable** starting figures (labelled
  as such), not a live official statistics feed — replacing them with current World Bank/UNDP/NSSO figures
  is a one-edit action in the Data Lab table itself.
- `stats-index-numbers` implements the **Simple Aggregative Method** specifically (the syllabus-named
  method); it does not reproduce the actual weighted-basket WPI/CPI/IIP construction methodology used by
  official Indian statistics.

## What this does *not* claim

Passing this suite means every formula that ships is internally consistent and matches its own documented
economics for the input domain exercised. It does not substitute for an economics teacher's review of the
wording, nor does it check every possible input combination (continuous sliders have infinite domains; the
sweep samples min/max/mid/default, which is where a linear/rational-function bug is overwhelmingly likely to
surface, but is not an exhaustive proof).
