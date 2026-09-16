# Misconceptions — encoded and backlog

Two places a misconception can live in this codebase, and they serve different moments:

1. **`QUIZ_BANK[id].static[i].misconceptions`** (`js/quiz-engine.js`'s
   `normalizeQuizQuestion`/`selectQuizAnswer`) — shown *after* a student picks that
   specific wrong option, in addition to the question's general `explain`. Reactive:
   fires only on the mistake.
2. **`sim.tlm.commonMistakes`** (`js/sim-engine.js`'s `renderTLM`) — a list visible in
   the sim screen's Teaching & Learning Toolkit card, readable *before* a student ever
   answers a question wrong. Proactive.

Use (1) for a mistake specific to one exact wrong option's wording; use (2) for the
general "students commonly confuse X with Y" statement worth reading up front. A
concept can and often should have both — they're not redundant, they hit at different
moments in the PREDICT→CHANGE→OBSERVE→EXPLAIN loop (see `docs/economics/pedagogy/`).

## Encoded so far

| Concept | Misconception | Where |
|---|---|---|
| Demand movement/shift | Price-driven expansion mistaken for "increase in demand" | `js/quiz-data-graphlab.js`, `gl-demand-movement-shift` static Q1, option 1 |
| Demand movement/shift | Income-driven shift mistaken for "movement along the curve" | same file, static Q2, option 1 |
| Supply movement/shift | Price-driven expansion mistaken for "increase in supply" | `js/quiz-data-graphlab.js`, `gl-supply-movement-shift` static Q1, option 1 |
| Supply movement/shift | Subsidy (non-price) mistaken for a movement | same file, static Q2, option 1 |
| PPF | INSIDE (inefficient, has resources) swapped with OUTSIDE (unattainable, lacks resources) | `js/quiz-data-class11-micro.js`, `micro-ppf` static Q1, option 2 |
| Elasticity | "Elastic" confused with "expensive"/"important" | `micro-elasticity`'s `tlm.commonMistakes[0]` (prose, not quiz-tagged) |
| Elasticity | Reading curve slope alone as "the" elasticity, ignoring the price/quantity point | `tlm.commonMistakes[1]` |
| Elasticity | Sign convention — `\|Ed\|>1` is "elastic," not `Ed>1` literally | `tlm.commonMistakes[2]` + `tlm.quickCheck` |
| Market equilibrium | Assuming price can sit away from equilibrium indefinitely | `tlm.commonMistakes[0]` (prose only) |
| Market equilibrium | Calling "indeterminate" a non-answer rather than the correct complete answer | `tlm.commonMistakes[1]` |

## Backlog (known common mistakes, not yet encoded anywhere)

These are standard, well-documented CBSE Economics mix-ups this project has not yet
attached to a specific sim/quiz option. Adding one is a small, safe, high-value change
— follow the pattern in `js/quiz-engine.js`'s doc comment on `normalizeQuizQuestion`.

- **Circular flow**: treating Government Spending and Taxes as always equal (they are
  independent sliders in `macro-gdp`; a balanced budget is one point in the range, not
  an assumption of the model).
- **Circular flow**: confusing GDP (produced *within* the country) with GNP (produced
  *by* residents, wherever) — the sim's `formulas` state the GNP adjustment correctly
  but no quiz option currently targets the GDP/GNP conflation directly.
- **PPF**: assuming a shift of the *whole* frontier (more resources) is the same thing
  as moving *along* a fixed frontier (reallocating existing resources) — these are
  different central-problem answers ("how much can we produce" vs "what to produce with
  what we have").
- **Elasticity**: assuming total revenue always rises when price rises — true only for
  inelastic demand; false for elastic demand (revenue rises when price *falls* instead).
  The `micro-elasticity` sim's `insight` reading states the correct relationship live,
  but it isn't yet a `tlm.commonMistakes` entry or a quiz misconception.
