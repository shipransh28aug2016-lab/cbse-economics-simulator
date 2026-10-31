# Model: Production Possibility Frontier & Opportunity Cost

**Sim:** `micro-ppf`
**File:** `js/simulations_class11_micro.js` (`compute()`)
**Syllabus:** Class XI, Part B, Unit 4 (`XI-B-U4-PPF-OC`, `XI-B-U4-CENTRAL-PROBLEMS`)

## What

An illustrative PPF `Y = C − X²/C` (`C` = a single resources/technology endowment
parameter), with a point the student places on, inside, or outside it.

## Why it matters

The three central economic problems (what/how/for whom) and the PPF's own shape are
both named syllabus content, and the Law of Increasing Opportunity Cost is the reason
the curve bows outward rather than being a straight line — a fact the model actually
proves, not just states.

## Assumptions

- Two goods only, one composite resource/technology parameter `C` (not separately
  modelled labour/capital/land) — a standard simplification at this level.
- The specific functional form `Y = C − X²/C` is illustrative (stated as such in the
  sim's own `formulas` array) — chosen because it is symmetric, has simple endpoints
  `(0, C)` and `(C, 0)`, and gives a clean, linear-in-`X` marginal rate of transformation
  — not because real production possibility frontiers are literally quadratic.
- "Inside" and "outside" points are the frontier point `(X, Y)` scaled **radially** from
  the origin (`0.75×` and `1.2×`). (Until the Nov 2026 audit they scaled `Y` only, at the
  same `X`, which put both points exactly ON the frontier at `X = C`, where the frontier's
  `Y` is 0, and labelled that point "inefficient" or "unattainable".) Radial scaling is
  strictly inside/outside at every `X`, because the frontier is concave to the origin.
- Opportunity cost depends on the point: on the frontier it is the MRT; at an inside point
  it is **0** (idle resources: more X needs no sacrifice of Y); an outside point cannot be
  produced. `x` above `C` is capped at `C`, and the readings now say so.

## Variables

`resources` (`C`, 10–30), `x` (Good X output, 0–30, clamped to `≤ C`), `pointType`
(`on`/`inefficient`/`unattainable`).

## Relationship

`X = min(v.x, C)`. On the frontier: `Y = C − X²/C`. Opportunity cost of one more unit of
X, in terms of Y (Marginal Rate of Transformation): `MRT = |dY/dX| = 2X/C`.

**Verified property, not just asserted**: `d²Y/dX² = −2/C < 0` for all `C > 0` — the
frontier is genuinely concave (bows outward from the origin) as a mathematical
consequence of this formula, and `MRT = 2X/C` is genuinely strictly increasing in `X`
(holding `C` fixed) — so the Law of Increasing Opportunity Cost is not an assertion
layered on top of an arbitrary curve, it is what this specific curve's own slope does.

## Graphical representation

The full frontier curve (`X` from 0 to `C`) plus the single chosen point, coloured by
`pointType` (green = efficient, amber = inefficient, red = unattainable).

## Comparative statics

| Change (staying "on the frontier") | Effect |
|---|---|
| `X` ↑ | `MRT` ↑ (opportunity cost of the next unit of X rises) |
| `resources` (`C`) ↑ | frontier shifts outward (more of both goods producible); `MRT` at a *given* `X` falls (2X/C shrinks as C grows) |

## Interpretation

Three point-status labels map directly to the three real economic situations: **on**
the frontier = productively efficient (the only way to get more X is to give up Y —
that trade-off *is* opportunity cost); **inside** = inefficient (resources unemployed or
misallocated — more of *both* goods is achievable without giving up anything, since you
are not yet paying any opportunity cost); **outside** = unattainable (needs more
resources/technology than currently exist — a *different* problem from inefficiency,
not a bigger version of it).

## Limitation

`resources` changing the PPF's *size* is modelled, but a resources change that is
biased toward one good only (e.g. new irrigation technology that helps Food far more
than Manufacturing) is not — the sim's `tlm.thinkQuestion` deliberately raises this case
as a question the student has to reason about *beyond* what the slider can show them,
rather than pretending the model covers it.

## Misconception (encoded)

`js/quiz-data-class11-micro.js` tags the INSIDE-vs-OUTSIDE swap (option index 2 on the
"a point INSIDE the PPF" static question) as a `misconceptions` entry — the classic
"has the resources and wastes them" vs "doesn't have the resources yet" confusion.
`sim.tlm.commonMistakes` also covers the straight-line misconception and the
"opportunity cost only matters at the current point" misconception.

## Simulation mapping

`inputs (resources, X, point type) → mechanism (compute MRT, Y, frontier array) →
outputs (Plotly frontier + point, readings) → visual feedback`. The `sim.predict` card
(`controlId: 'x'`) tests the Law of Increasing Opportunity Cost directly: guess
rise/fall before raising `X` on the frontier, graded against the live `mrt` value.
