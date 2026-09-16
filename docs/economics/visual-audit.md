# Visual Teaching Audit — all 44 sims

This is the machine-usable audit the L99/"Teach-by-Visualization" directive asked for.
It is a **living tracking table**, not a one-time report — update a row's Status/Gap
whenever you touch that sim's visual layer, and re-derive Priority from
`docs/economics/README.md`'s priority order (Incorrect Economics > incorrect
simulation behaviour > syllabus gaps > missing core visual > broken interaction >
misconception risk > teacher/student mode > accessibility > architecture > polish),
never the reverse.

**Legend — Visual Type:** `curve` (Plotly functional graph) · `graphlab` (hand-built
draggable SVG, movement/shift genre — see `js/graph-lab-engine.js`) · `custom` (bespoke
SVG, e.g. circular flow) · `table→chart` (Data Lab) · `diagram/classify` (explorer,
no numeric model) · `bar` (categorical comparison).

**Status:** ✅ complete for its genre · 🟡 works, key point/gap not marked · 🔧 fixed
this pass · — not applicable (genre doesn't need it, per item 7/12 of the directive:
"do not manufacture a visual merely to claim coverage").

| Sim ID | Mode/Visual | Unit | Key relationship | Equilibrium/key point marked? | Movement vs Shift applicable? | Status | Gap | Priority |
|---|---|---|---|---|---|---|---|---|
| `micro-supply-demand` | curve | XI-B-U5/6 | Every named D/S determinant → equilibrium | ✅ marker | N/A (multi-determinant, not the single-cause distinction) | ✅ | none found | — |
| `gl-demand-movement-shift` | graphlab | XI-B-U5 | Demand: movement vs shift | ✅ verdict + points A/B | ✅ core feature | ✅ | none | — |
| `gl-supply-movement-shift` | graphlab | XI-B-U6 | Supply: movement vs shift | ✅ | ✅ core feature | ✅ | none | — |
| `gl-market-equilibrium-shifts` | graphlab | XI-B-U7 | D&S together → equilibrium moves | ✅ | ✅ (own `predictChoices`, see pedagogy doc) | ✅ | none | — |
| `micro-elasticity` | curve + predict card | XI-B-U5 | Ed determinants | N/A (no equilibrium; single curve) | N/A | ✅ gold-standard (TLM+predict) | none | — |
| `micro-elasticity-supply` | curve | XI-B-U6 | Es, market period vs long run | N/A (single curve, no equilibrium) | N/A | ✅ | none | — |
| `micro-ppf` | curve | XI-B-U4 | Opportunity cost, concavity, **attainable vs unattainable region** | 🔧 attainable region shaded (this pass, 2nd audit) | N/A | 🔧 fixed | "inside/on = attainable" was an inference from one dot's position — a real gap the first pass missed by treating "has a curve + a point" as sufficient | — |
| `gl-ppc-drag` | graphlab | XI-B-U4 | Attainable/unattainable/efficient points, PPF shift | ✅ point classification | shift = resource/tech change (handled) | ✅ | none | — |
| `micro-consumer-equilibrium` | curve | XI-B-U5 | MU=0 (single good); MUx/Px=MUy/Py (two goods) | 🔧 star at crossing (two-good view, this pass) | N/A | 🔧 fixed | none remaining | — |
| `gl-consumer-equilibrium-ic` | graphlab | XI-B-U5 | IC + budget line tangency | ✅ (existing) | N/A (tangency, not movement/shift) | ✅ | none | — |
| `micro-indifference-curve` | curve | XI-B-U5 | IC tangency (alternate, non-drag view) | ✅ marker at tangency | N/A | ✅ | possible duplicate-of-`gl-consumer-equilibrium-ic` in spirit, but this is the slider-driven twin, not redundant — different interaction affordance | low |
| `micro-producer-costs` | curve | XI-B-U6 | TP/AP/MP stages; AC/MC | 🔧 stage boundaries + MC=AC star (this pass) | N/A | 🔧 fixed | none remaining | — |
| `gl-cost-curves` | graphlab | XI-B-U6 | Cost curve shift (input cost/tech) | ✅ (existing) | ✅ (shift-only genre) | ✅ | none | — |
| `micro-revenue-producer-equilibrium` | curve | XI-B-U6 | AR/MR/MC, MR=MC | ✅ marker | N/A | ✅ | none | — |
| `gl-revenue-producer-eq` | graphlab | XI-B-U6 | Revenue/producer equilibrium, drag-based | ✅ (existing) | N/A | ✅ | none | — |
| `micro-price-controls` | curve | XI-B-U7 | Ceiling/floor → shortage/surplus | 🔧 bracket + on-chart annotation (this pass) | N/A | 🔧 fixed | none remaining | — |
| `micro-market-structures` | curve | XI-B-U7 (enrichment) | N firms → P→MC | 🔧 continuous P(N) curve approaching MC asymptote (this pass) | N/A | 🔧 fixed | none remaining | — |
| `macro-gdp` | custom (SVG) | XII-A-U1 | Circular flow, injections/leakages | N/A (flow diagram, not curve equilibrium) | N/A | ✅ (TLM added prior pass) | none | — |
| `macro-multiplier` | curve | XII-A-U3 | ΔG/ΔT → ΔY via multiplier | ✅ old/new equilibrium markers + AE before/after | N/A | ✅ | none | — |
| `macro-propensity` | table→chart | XII-A-U3 | MPC/MPS from C,Y data | ✅ fitted line + 45° line | N/A | ✅ | none | — |
| `gl-consumption-saving` | graphlab | XII-A-U3 | C/S schedules, break-even point | ✅ (existing) | shift = autonomous C change (handled) | ✅ | none | — |
| `macro-inflation-gap` | curve | XII-A-U3 | AD-AS, inflationary/deflationary gap | 🔧 bracket + guide lines (this pass) | N/A (gap, not movement/shift) | 🔧 fixed | none remaining | — |
| `gl-ad-as-equilibrium` | graphlab | XII-A-U3 | AD-AS equilibrium & gaps, drag-based | ✅ (existing) | ✅ shift genre | ✅ | none | — |
| `macro-money-creation` | curve/numeric | XII-A-U2 | Credit multiplier | 🔧 cumulative-total curve vs asymptote (this pass, 2nd audit) | N/A | 🔧 fixed | the geometric series' actual convergence (D0/r as a *limit*, not a fact) was invisible until this pass — a real gap the first audit pass missed by accepting "has a bar chart" as sufficient | — |
| `macro-national-income-methods` | table→chart | XII-A-U1 | 3-method GDP equality | N/A (bar comparison of 3 methods) | N/A | ✅ | none | — |
| `macro-basic-concepts` | explorer | XII-A-U1 | Stock/flow, final/intermediate | — (classificatory) | N/A | ✅ | none | — |
| `macro-govt-budget` | bar | XII-A-U4 | Receipts vs Expenditure → deficits | 🔧 fixed this pass (see commit) | N/A | 🔧 fixed | — | — |
| `macro-forex` | curve | XII-A-U5 | D$/S$ → exchange rate | 🔧 dotted P/Q guide lines added (this pass) | N/A (single equilibrium, no gap) | 🔧 fixed | none remaining | — |
| `gl-forex-determination` | graphlab | XII-A-U5 | Exchange rate, D/S shift | ✅ (existing) | ✅ shift genre | ✅ | none | — |
| `india-poverty` | curve | XII-B-U7 (enrichment) | Lorenz curve, headcount ratio, **Gini = 2×area between curves** | 🔧 inequality area shaded (this pass, 2nd audit) | N/A | 🔧 fixed | the Gini number was disconnected from the two unfilled lines it actually measures — a real gap the first pass missed | — |
| `india-human-capital` | curve | XII-B-U7 | Literacy/life-expectancy trend | N/A (time series, no equilibrium) | N/A | ✅ | none | — |
| `india-employment-structure` | bar | XII-B-U7 | Formal/informal composition | N/A (composition, not equilibrium) | N/A | ✅ | none | — |
| `ied-five-year-plans` | explorer | XII-B-U6 | Timeline | — | N/A | ✅ | none | — |
| `ied-rural-development` | explorer | XII-B-U7 | Classification | — | N/A | ✅ | none | — |
| `ied-sustainable-development` | explorer | XII-B-U7 | Classification | — | N/A | ✅ | none | — |
| `ied-comparison-neighbours` | table→chart | XII-B-U8 | India/Pak/China bar comparison | N/A | N/A | ✅ | none | — |
| `micro-positive-normative` | explorer | XI-B-U4 | Classification (testable vs value judgement) | — | N/A | ✅ | none — correctly NOT a graph (item 7/12) | — |
| `stats-central-tendency` | table→chart | XI-A-U3 | Mean/median/mode, skew | N/A | N/A | ✅ (TLM added) | none | — |
| `stats-dispersion` | curve | XI-A-U3 (enrichment) | Range/QD/SD | N/A | N/A | ✅ | none | — |
| `stats-data-organisation` | table→chart | XI-A-U2 | Raw data → histogram/polygon/ogive, **graphical median from Ogive** | 🔧 N/2 guide lines + median marker (this pass, 2nd audit) | N/A | 🔧 fixed | the Ogive's single most-taught use (locate the median graphically) was never drawn — a real gap the first pass missed by treating "the three charts render" as sufficient | — |
| `stats-data-presentation` | table→chart | XI-A-U2 | Bar/pie from same table | N/A | N/A | ✅ | none | — |
| `stats-data-collection` | explorer | XI-A-U1 | Classification | — | N/A | ✅ | none | — |
| `stats-index-numbers` | table→chart | XI-A-U3 | Simple aggregative index | N/A | N/A | ✅ | none | — |
| `stats-correlation` | curve (scatter) | XI-A-U3 | Karl Pearson r | N/A (scatter + fit line, no equilibrium) | N/A | ✅ | none | — |

## What two audit passes have found and fixed so far

**First pass** (accepted "has a graph/marker" too readily) found and fixed three real
gaps: `micro-consumer-equilibrium`, `micro-producer-costs`, `micro-price-controls`.

**Second, deeper pass** — applying the harder standard "does the student have to
*infer* the important relationship, or can they *see* it?" rather than "does a chart
render?" — found four MORE real gaps the first pass had wrongly marked ✅ merely
because a technically-correct chart existed:

- `macro-money-creation` — the geometric series' convergence to a finite total was a
  number, never a curve shape.
- `india-poverty` — the Gini coefficient (the area between two curves) was drawn as
  two unfilled lines with no visible area.
- `micro-ppf` — "attainable vs unattainable" was an inference from one dot's position,
  never a shaded region.
- `stats-data-organisation` — the Ogive's own single most-taught technique (read the
  median graphically) was never drawn on it.

Plus two more from the widened scope of the second pass: `macro-govt-budget` (Fiscal
Deficit bracket) and `macro-inflation-gap` / `macro-forex` (equilibrium guide lines) —
**eleven real visual/pedagogical gaps fixed across both passes, all verified**
(software + economic + visual, per `docs/economics/validation/README.md`).

**This is the honest, load-bearing lesson of the second pass:** a first audit that only
asks "does this have a graph, and is there a marker somewhere" will systematically
under-count gaps, because a graph can be technically correct and still leave the
actual economic relationship (a convergence, an area, a region, a graphical
construction) for the student to imagine. The 14-question Teacher/Student test in the
governing directive is the actual bar — "graph exists" is not.

## Spot-checked and confirmed genuinely complete (not just "has a chart")

Re-examined against the deeper standard this pass, not merely re-stamped: `gl-cost-curves`
and `gl-revenue-producer-eq` (both already mark their MC=AC/MR=MC crossing exactly the
way the Plotly twins needed fixing to do — confirmed by reading their `model()`
functions directly, not assumed from genre); `gl-consumption-saving` (break-even point,
dissaving/saving arrows, and both ratios' sum already shown); `macro-multiplier`
(old/new equilibrium markers plus AE before/after already present).

## Rows not yet re-verified at this depth

Everything else in the table above still carries its first-pass ✅/— rating, which
means: technically correct and *plausibly* complete for its genre, but not
re-interrogated against the full 14-question Teacher/Student test this second pass
applied to the seven rows above. `macro-national-income-methods` (3-bar GDP-method
equality) and `macro-basic-concepts`/`ied-*` explorer content were spot-checked and
look sound, but the rest — `stats-index-numbers`, `stats-dispersion`,
`stats-correlation`, `india-human-capital`, `india-employment-structure`,
`ied-comparison-neighbours`, `micro-elasticity-supply`, `micro-supply-demand` — have
not been individually re-audited against the deeper standard. Treat "✅" on those rows
as "not yet proven otherwise," not as "confirmed complete." The honest next step on any
future pass is to run the 14-question test against each of them before touching
anything else, exactly as this pass did for the four it found.

`micro-indifference-curve` vs `gl-consumer-equilibrium-ic` remains an open note (not a
gap): worth re-confirming the two stay genuinely complementary (slider-driven vs
drag-driven) rather than drifting into redundancy.
