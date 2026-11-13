# Model: Producer's Equilibrium — MR = MC, with MC cutting MR from below

**Sim:** `gl-revenue-producer-eq`
**File:** `js/simulations_graphlab.js` (`model()`)
**Syllabus:** Class XI, Part B, Unit 6 (`XI-B-U6-PRODUCER-EQ`, `XI-B-U6-REVENUE`)

## What

AR, MR, MC and AC on one diagram. The student picks an output and a price level, and
can move from perfect competition (flat AR = MR) toward monopoly (downward AR, with MR
falling twice as fast below it). The model marks the producer's equilibrium and says
whether the chosen output should expand or contract.

## Why it matters

The syllabus names the MR = MC approach to producer's equilibrium. Students lose marks by
stating MR = MC alone. The full answer adds the second condition: **MC must cut MR from
below**, meaning that beyond the equilibrium output MC is greater than MR.

## Assumptions

- `AR = P − s·Q` with `s = 0.22 × market` (`market = 0` is perfect competition),
  `MR = P − 2s·Q`.
- `MC = k(26 − 3.6Q + 0.24Q²)` is U-shaped with its minimum at Q = 7.5.
  `AC = k(26 − 1.8Q + 0.08Q²) + 60/Q`, with `k = 1 + 0.06·cost`.
- Profit = (AR − AC) × Q. The lab looks for interior equilibria between Q = 1 and Q = 19.

## The second-order condition: "cuts from below", not "MC rising"

Profit is at a maximum where MR − MC changes sign **from positive to negative**. Before
that point each extra unit adds more revenue than cost; after it, each extra unit
destroys profit.

- **Perfect competition:** MR is flat, so MC can only cut it from below while MC is
  rising. Here "MC rising" and "MC cuts MR from below" are the same condition. This is
  why textbooks often state it as "MC must be rising".
- **Monopoly:** MR slopes down. MC can cut it from below while MC is still falling, as
  long as MR falls faster. "MC rising" is then the wrong test.

`model()` searches for the first Q where MR − MC goes from > 0 to ≤ 0. Until this fix it
tested "MC rising" literally, which put the monopoly equilibrium at MC's minimum. At
monopoly power 10 and price ₹34 it reported Q = 7.55 (loss ₹56.8), while the true profit
maximum is Q = 4.35 (loss ₹39.4). In that state the screen labelled a loss-making output
"✔ equilibrium" and drew an "Expand output → profit rises" arrow that was false.

## Worked check

Perfect competition, P = 34, cost level 0: MR = 34. Setting MR = MC gives
0.24Q² − 3.6Q − 8 = 0, so Q = (3.6 + √20.64)/0.48 ≈ 16.96. MC is rising there and MC > MR
beyond it, so this is the equilibrium. The model reports 17.0, and brute-force profit
peaks at 16.95.

## Tests

`testProducerEquilibriumIsProfitMax` in `tools/test-curriculum.js` compares the model's
`eqQ` with a brute-force profit maximum across market power 0–10, price ₹20–50 and cost
−6…8. On the old "MC rising" search it fails in 7 cases; on the current search it passes
in all of them.
