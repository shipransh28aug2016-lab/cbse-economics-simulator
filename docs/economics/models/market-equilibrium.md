# Model: Market Equilibrium — Excess Demand/Supply and Shifts

**Sim:** `gl-market-equilibrium-shifts`
**File:** `js/simulations_graphlab.js` (`model()`)
**Syllabus:** Class XI, Part B, Unit 7 (`XI-B-U7-MARKET-EQ`, `XI-B-U7-APPLICATIONS`)

## What

DD and SS on one diagram; equilibrium is their intersection. The student can (a) set a
market price away from equilibrium and read off the resulting gap, or (b) shift either
curve and read off the new equilibrium.

## Why it matters

Two distinct skills the syllabus names: identifying disequilibrium (excess demand /
excess supply) and its price-adjustment mechanism, and predicting the direction of
equilibrium price/quantity change from a shift (the "4-case table") — including the
one case where the *direction itself* is genuinely indeterminate without more
information.

## Assumptions

- Perfectly competitive market: one equilibrium price clears the whole market, no price
  discrimination, no quantity rationing beyond what excess demand/supply itself implies.
- Both curves are linear (`P = a − b·Q`, `P = c + d·Q`) over the modelled range.
- Adjustment toward equilibrium is assumed, not modelled dynamically — the diagram shows
  the *size* of the gap at a given price, not a time-path of how fast price converges.

## Variables

`mktPrice` (student-set, own-price axis), `dShift` (net demand shift), `sShift` (net
supply shift).

## Relationship

`a = 90 + dShift·b`, `c = 10 − sShift·d` (same sign convention as the demand-supply
model — see that file for why a positive `sShift` *decreases* `c`).
`Qd = max(0, (a − mktPrice)/b)`, `Qs = max(0, (mktPrice − c)/d)`, `gap = Qd − Qs`.

## Graphical representation

Both curves drawn together; the equilibrium point is `E` (or `E₁` after a shift, with
the original `E` kept visible as a ghost point). A horizontal double-headed arrow marks
the excess-demand/excess-supply gap at the student's chosen price, labelled with its
size and direction of pressure.

## Comparative statics

| Shift | Price | Quantity |
|---|---|---|
| DD right | ↑ | ↑ |
| DD left | ↓ | ↓ |
| SS right | ↓ | ↑ |
| SS left | ↑ | ↓ |
| Both right (similar size) | **indeterminate** | ↑ (definite) |

The "both shift, similar size ⇒ price indeterminate" row is not a hedge — it is
mathematically true of the model: `eq.P` moves by an amount that depends on the
*relative* size of `dShift` and `sShift`, and can be pushed either way by making one
larger than the other. The sim's `tlm.examTip` teaches "decide quantity first (usually
determinate), only call price indeterminate when the two effects genuinely oppose by
unclear relative size" — this is exactly right and should never be simplified into
"both shifting always means indeterminate everything."

## Interpretation

`vKind` in `model()` takes one of three values, and — this is the one non-obvious,
load-bearing design decision in this file — **it reuses the same string values
(`'none'`/`'movement'`/`'shift'`) that the demand-supply verdict uses, for a
*different* concept**: here `'movement'` means "price is away from equilibrium
(disequilibrium)," not "movement along a curve." This is why
`gl-market-equilibrium-shifts` declares its own `graphLab.predictChoices` (see
`docs/economics/pedagogy/README.md`) instead of reusing the shared
`GL_PREDICT_CHOICES` — those are worded for the demand/supply meaning of the word and
would be actively wrong here.

## Limitation

No price ceiling/floor control exists in the model itself (the `tlm.activity` asks
students to research a real one), so the sim demonstrates the *general* disequilibrium
mechanism, and the student has to make the connection to a specific policy-imposed
disequilibrium themselves.

## Misconception

Not yet quiz-tagged with per-option `misconceptions` (see
`docs/economics/misconceptions/README.md` backlog) — the `tlm.commonMistakes` field
covers "assuming price can sit anywhere" and the indeterminate-answer trap in prose,
but no `QUIZ_BANK` option is specifically flagged yet.

## Simulation mapping

`inputs (market price handle, 2 shift handles) → mechanism (recompute a, c, Qd, Qs) →
outputs (curves, equilibrium point, gap arrow, verdict) → visual feedback`. Scenario
presets go through the PREDICT gate with the lab's own 3-choice set.
