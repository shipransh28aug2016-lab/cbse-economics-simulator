# Consumer Equilibrium — Marginal Utility Analysis — `micro-consumer-equilibrium`

Sim: `js/simulations_extended.js` (`mode: 'simulator'`). Syllabus: `XI-B-U5-UTILITY`,
whose taxonomy micro-content explicitly names **both** halves of this topic —
`Consumer equilibrium (MU=0 / MUx/Px=MUy/Py)` — which is why this sim carries two
views rather than one.

## What

Two views of the same Law of Diminishing Marginal Utility, switched via a `view`
control:

1. **Single Good** (pre-existing): one good, free disposal, equilibrium at `MU = 0`.
2. **Two Goods (Equi-Marginal)** (added this pass): a fixed money income `M` split
   between two goods X and Y, equilibrium at `MUx/Px = MUy/Py`.

## Why the two-good view was added

The taxonomy names `MUx/Px=MUy/Py` explicitly as micro-content under this syllabus
topic. Before this pass, the sim only implemented the `MU=0` half — a real,
previously-unflagged syllabus gap (not an `enrichment` case; the opposite: under-
covering a topic the sim's own `syllabusIds` claims). This is the Law of
Equi-Marginal Utility, the actual multi-good generalisation of "stop at MU=0" that
the single-good concept text already gestured at without ever showing it.

## Assumptions (two-good view)

- Both goods share the same MU curve shape `MU = 20 − Q` (same `a=20, b=1` as the
  single-good view) — a deliberate simplification so the only asymmetry the student
  controls is price, keeping the comparative-statics question ("what happens when Y
  gets dearer?") uncluttered by also varying utility-curve shape.
- The student's own bundle is parameterised as `shareX` (% of the fixed budget spent
  on X) rather than a raw `Qx` slider, precisely so `Px·Qx + Py·Qy = M` is an
  algebraic identity of the model, never a constraint that could be violated by an
  out-of-range slider value.

## Variables

`income (M)`, `px (Px)`, `py (Py)`, `shareX` (student control); derived `Qx = shareX/100 · M/Px`,
`Qy = (M − Px·Qx)/Py`.

## Relationship / Math

- `MUx = 20 − Qx`, `MUy = 20 − Qy`.
- `MUx/Px` and `MUy/Py` are swept across the full feasible `Qx ∈ [0, M/Px]` range
  (`Qy` determined at each point by the budget identity) and drawn as two curves.
- The equilibrium `Qx*` is located by a **fine grid search** (201 points) for the `Qx`
  minimizing `|MUx/Px − MUy/Py|`, not a closed-form algebraic solve — deliberately,
  so the "equilibrium" marker is guaranteed consistent with the exact same model the
  two curves themselves are drawn from (a separately-derived closed form is one more
  place the algebra could drift from the chart).

## Comparative statics (verified in `tools/test-curriculum.js`'s `testEquiMarginalUtility`)

| Change | Effect on equilibrium |
|---|---|
| `Px = Py` (symmetric prices, identical MU curves) | Equilibrium share is exactly 50/50 |
| `Py` rises (Y becomes dearer) | Equilibrium budget share on X **rises** — Y's MU-per-Rupee is lower at any given physical split, so the rational consumer shifts toward the now-relatively-cheaper X |
| Any `shareX` the student picks | `Px·Qx + Py·Qy` always equals `M` exactly — the budget identity holds by construction |
| Large enough price gap | The grid search can land at a **corner solution** (all budget on one good) when one good's MU-per-Rupee curve stays above the other's across the entire feasible range — a genuine, correctly-handled economic outcome, not a bug |

## Interpretation

The two curves crossing (or failing to cross inside the feasible range, for a corner
solution) IS the Law of Equi-Marginal Utility made visible: moving ₹1 away from the
crossing point always takes it from the good giving more utility-per-rupee to the one
giving less, which is a loss.

## Limitation

Both goods forced to share one MU curve shape (only price differs) — a real two-good
problem where the goods have genuinely different marginal-utility schedules is not
modelled; the taxonomy's own micro-content list does not require that generality.

## Misconception

Confusing "the consumer spends less overall" with "the consumer buys less of a
good" — the budget is always fully spent (`Px·Qx + Py·Qy = M`, enforced by
construction here); the equi-marginal decision is only ever about the *split*, never
about spending less than the full income.

## Simulation mapping

`compute(v)` branches on `v.view`; the `twogood` branch returns
`metrics: {Qx, Qy, muxPerRupee, muyPerRupee, diff, bestQx, bestQy, TU}` — `challenge.check`
reads `metrics.Qx`/`metrics.bestQx` directly, never re-deriving the equilibrium
independently.
