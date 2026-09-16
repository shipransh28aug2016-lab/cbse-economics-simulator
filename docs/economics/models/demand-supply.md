# Model: Movement vs Shift (Demand and Supply)

**Sims:** `gl-demand-movement-shift`, `gl-supply-movement-shift`
**Files:** `js/simulations_graphlab.js` (`model()` for each), `js/graph-lab-engine.js`
(drag/verdict engine), `GL_TERMS`/`glMoveShiftVerdict` in `js/simulations_graphlab.js`
**Syllabus:** Class XI, Part B, Units 5–6 (`XI-B-U5-DEMAND`, `XI-B-U6-SUPPLY`) — the
taxonomy's own stated objective is *"Distinguish a movement along the demand curve from
a shift in it, and name the determinant behind each shift"* (see `CLAUDE.md`'s Graph
Labs section).

## What

Two curves, each drawn as a straight line `P = a − b·Q` (demand) or `P = c + d·Q`
(supply). The entire pedagogical point is not the curve's shape — it's **what kind of
change moved the diagram**: a slide along the same curve, or a relocation of the whole
curve.

## Why it matters

This is the single most board-tested distinction in the Class XI microeconomics
syllabus, and the one place students reliably lose marks: writing "increase in demand"
for a price-driven change (should be "expansion"), or vice versa.

## Assumptions

- One good, one market, all other prices held constant (ceteris paribus) except the one
  determinant being moved.
- The demand/supply relationship is linear over the modelled range (`Q = 0..100`,
  `P = 0..100`) — a simplification for a teaching diagram, not a claim that real demand
  curves are linear.
- Non-price determinants (income, related-good prices, tastes, buyers for demand;
  input cost, technology, tax/subsidy, number of firms for supply) are modelled as
  **additively combining into one net "shift" number** in "quantity units at every
  price" (`shift = Σ determinant effects`) — this is a simplification for the sake of
  having one slider-driven diagram; it does not model any real elasticity of demand
  with respect to income, substitute price, etc. Do not read the magnitude of the
  slider values as calibrated to any real elasticity.

## Variables

| Variable | Meaning | Effect on curve |
|---|---|---|
| `price` (own price) | the good's own price | **movement** along the curve |
| `income`, `pSub`, `pComp`, `tastes`, `buyers` (demand) | non-price determinants | **shift** of DD |
| `inputCost`, `tech`, `tax`, `firms` (supply) | non-price determinants | **shift** of SS |

## Relationship

- Demand: `Q = (a − P) / b`, with `a = a0 + shift·b` where `a0 = 90`, `b = 0.8`. Own
  price change (`v.price`) moves the point along this fixed-`a` line; a non-price
  determinant changes `shift`, which relocates the whole line (changes `a`, so the
  intercept moves, so the curve is now in a new position).
- Supply: `Q = (P − c) / d`, with `c = c0 − shift·d`, `c0 = 10`, `d = 0.8`. Note the
  **sign on `shift`**: for supply, a *positive* shift (e.g. better technology, or a
  subsidy) *decreases* `c` — a lower intercept at `Q=0` means the curve has moved
  toward the origin, i.e. rightward/downward — more is supplied at every price. Get this
  sign wrong and "improved technology" would incorrectly shift supply left.

## Graphical representation

- x-axis: Quantity (demanded or supplied), 0–100 units.
- y-axis: Price (₹ per unit), 0–100.
- A ghost (grey, dashed) copy of the *original* curve is drawn whenever a shift has
  happened (`glShowGhost`), so "before" stays visible next to "after" — this is a
  genuine before/after comparison, not just a redrawn line.
- Two separate arrows are drawn when both a shift and a movement have occurred: one
  horizontal (same price, old curve → new curve — isolates the shift) and one along the
  curve (old point → new point on the new curve — isolates the movement). This
  decomposition is exactly the diagram a board exam answer needs.

## Comparative statics (what happens when one variable changes)

| Change | Demand | Supply |
|---|---|---|
| Own price ↑ | Movement up-left ⇒ **Contraction of Demand** | Movement up-right ⇒ **Expansion of Supply** |
| Own price ↓ | Movement down-right ⇒ **Expansion of Demand** | Movement down-left ⇒ **Contraction of Supply** |
| Non-price determinant ↑ (net shift > 0) | Shift right ⇒ **Increase in Demand** | Shift right ⇒ **Increase in Supply** |
| Non-price determinant ↓ (net shift < 0) | Shift left ⇒ **Decrease in Demand** | Shift left ⇒ **Decrease in Supply** |

**The direction-flip to teach explicitly**: the same direction of *price* change gets
an *opposite* movement name between demand and supply (price↑ = contraction of demand,
but expansion of supply) — because DD slopes down and SS slopes up. This is stated in
both sims' `tlm.examTip` and is exactly the kind of thing worth demonstrating on the two
labs back-to-back (see `docs/economics/pedagogy/README.md`).

## Interpretation

`glMoveShiftVerdict(kindKey, priceD, shiftD)` (`js/simulations_graphlab.js`) is the
single function that names the exam-correct term from the two raw numbers
(`priceD = v.price − 50`, `shiftD = shift`), returning one of four `kind`s: `'none'`
(nothing moved), `'movement'` (price only), `'shift'` (determinant only), `'both'`
(both at once — named as **two separate events**, per the syllabus's own expectation).

## Limitation

- The model cannot represent a genuinely non-linear demand/supply relationship, a
  backward-bending supply curve, or a Giffen/Veblen good — none of those are in the
  Class XI syllabus at this point, so this is not a gap relative to what's taught, only
  relative to real-world demand theory.
- "Number of buyers"/"number of firms" are folded into the same additive `shift` number
  as every other determinant, even though economically they operate through a different
  channel (market size vs individual willingness-to-pay/cost) — fine for teaching "this
  is still a shift, not a movement," not fine as a claim that they're interchangeable in
  magnitude.

## Misconception (encoded)

See `docs/economics/misconceptions/README.md` — `js/quiz-data-graphlab.js` tags two
specific wrong answers on each sim's quiz bank: a price-driven movement mistaken for
"increase/decrease in demand/supply," and a determinant-driven shift mistaken for
"movement along the curve."

## Simulation mapping

`inputs (price slider, 5 determinant chips) → mechanism (model() recomputes a/c and the
point's position) → outputs (curves, points, arrows, verdict, readings) → visual
feedback (drag is instant; scenario presets go through the PREDICT gate first)`. Fully
interactive — every input is directly draggable, not just slider-driven. See
`js/graph-lab-engine.js`'s handle contract in `CLAUDE.md`.
