# Model: Price / Income / Cross Elasticity of Demand

**Sim:** `micro-elasticity`
**File:** `js/simulations.js` (`compute()`)
**Syllabus:** Class XI, Part B, Unit 5 (`XI-B-U5-ELASTICITY`) names **Price elasticity
of demand** specifically, with its determinants and two measurement methods. Income and
Cross elasticity are enrichment in this sim (not separately flagged with
`enrichment: true` at the sim level since the sim's primary, default mode IS the named
Price Elasticity content — see the sim's own `concept` text, which states this
explicitly rather than silently claiming full coverage).

## What

Point elasticity `Ed = (dQ/dP)·(P/Q)` computed live from a linear demand curve whose
slope itself depends on the number of close substitutes — so "more substitutes ⇒ more
elastic" is a directly observable consequence of the model, not an asserted rule.

## Why it matters

Elasticity is a *responsiveness* concept, not a size or importance concept — the single
most common student confusion, and the one the sim's `tlm.commonMistakes` leads with.

## Assumptions

- Demand is linear: `Q = 50 − bEff·P`, `bEff = 0.3 + 0.1·substitutes`. A linear demand
  curve has a *different* Ed at every point on it — this is itself taught as a common
  mistake (`tlm.commonMistakes[1]`), and the sim's own demo (fixed price, varying
  substitutes) is deliberately designed so it never contradicts that: it isolates the
  substitutes effect by holding price fixed, rather than implying "Ed" is one number for
  the whole curve.
- Income elasticity model: `Q = 5 + 0.3Y` (an Engel curve for a normal good only — no
  inferior-good branch is modelled, `Ey < 0` is described in the reading text but never
  actually producible by moving the slider).
- Cross elasticity model: `Qx = 10 + 0.5Py` (X and Y modelled as substitutes only —
  `Exy` is always positive in this sim; a complements scenario is not modelled). Stated
  explicitly in the sim's own formula text ("X and Y are substitutes") — do not read the
  "Relationship: Substitutes" reading row as if the sim can also show complements.

## Variables

`price`, `substitutes` (price mode) · `income` (income mode) · `pricey` (cross mode) —
gated by the `type` select control, one mode active at a time.

## Relationship

`Ed = −bEff·(P/Q)`. As `substitutes` rises 0→5, `bEff` rises 0.3→0.8, and — holding
price fixed — `|Ed|` rises (verified: at `price=40`, `substitutes=1` gives `Ed ≈ −0.47`
(inelastic); `substitutes=5` gives `Ed ≈ −1.78` (elastic)). `Ey = 0.3·(Y/Q)` for income;
`Exy = 0.5·(Py/Qx)` for cross.

## Graphical representation

Demand curve (or Engel curve, or cross-price demand curve depending on mode) with the
current point marked. Standard P on y-axis, Q on x-axis for the price-mode chart.

## Comparative statics

| Change | Effect |
|---|---|
| Substitutes ↑ (price mode) | `\|Ed\|` ↑ (more elastic) |
| Income ↑ (income mode, this sim's linear Engel curve) | `Ey` stays constant in sign (always > 0 here — a normal good by construction) |
| Price of Y ↑ (cross mode) | `Exy` stays positive (substitutes by construction) |

## Interpretation

`label = |Ed| > 1 ? 'Elastic' : |Ed| < 1 ? 'Inelastic' : 'Unit Elastic'` — standard
threshold, correctly applied to the *magnitude*, not the signed value (Ed is negative
for a normal downward-sloping demand curve; this is stated explicitly in
`tlm.commonMistakes[2]` and the `quickCheck` explanation). Income elasticity
classification (`Ey > 1` luxury, `0 < Ey < 1` necessity/normal, `Ey < 0` inferior) is the
standard convention.

## Limitation

No total-expenditure method is computed alongside the percentage-change method, even
though the syllabus names both measurement methods — the sim covers the
percentage-change/point-elasticity method only. A future addition (not yet built) would
be a `TR = P·Q` reading alongside `Ed`, showing how total revenue moves with price
depending on elasticity — see `docs/economics/pedagogy/README.md`'s backlog note.

## Misconception (encoded)

`sim.tlm.commonMistakes` (three entries: elastic≠expensive, slope≠elasticity,
sign convention) and `tlm.quickCheck` (Ed = −0.3 ⇒ inelastic, tests the sign-convention
mistake directly). Not yet quiz-bank-tagged with per-option `misconceptions`.

## Known design nuance (not a correctness bug)

The `sim.predict` card (`controlId: 'substitutes'`) grades "more/less elastic" by
comparing `|Ed|` before vs after the student moves `substitutes`. If a student changes
**both** `price` and `substitutes` before the card resolves, the graded answer is still
mathematically true to what actually happened to `|Ed|`, but the question framing
("what happens when you drag substitutes") no longer cleanly isolates that one variable.
Tightening this (freezing `price` while a guess is pending, or re-baselining on any
other control change) is a small, safe follow-up — not yet implemented.

## Simulation mapping

`inputs (type selector + one mode-specific slider) → mechanism (compute()) → outputs
(traces, metrics, readings) → visual feedback (live Plotly redraw)`. The `sim.predict`
card is the PREDICT mechanism here (continuous slider, not a discrete scenario).
