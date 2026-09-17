# Visual Teaching Audit — all 44 sims

> **Architectural note (4th pass, supersedes the per-sim framing below).**
> The first three passes fixed 18 real gaps one sim at a time — each defensible, but
> all of them treating a missing *annotation* as the unit of work. The structural
> question went unasked until an architecture audit: `renderSimChart()` retained the
> previous **inputs** and discarded the model's **output**, so the app could state a
> cause and never an effect, and every before/after visual had to be hand-derived per
> sim. Retaining one object (`prevSimResult`) turned that into a shared capability —
> see `js/transition-layer.js` and CLAUDE.md's "transition layer" section. The rows
> below still record per-sim visual state, but the **default** for cause→effect and
> for before/after geometry is now the shared layer, not per-sim authoring. Prefer
> extending that layer over adding another one-off annotation.

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
| `micro-supply-demand` | curve | XI-B-U5/6 | Every named D/S determinant → equilibrium | 🔧 ghost original curves + original equilibrium (this pass, 3rd audit) | N/A (multi-determinant, not the single-cause distinction) | 🔧 fixed | with 7 determinants live, only the CURRENT curve ever rendered — no before/after comparison was possible | — |
| `gl-demand-movement-shift` | graphlab | XI-B-U5 | Demand: movement vs shift | ✅ verdict + points A/B | ✅ core feature | ✅ | none | — |
| `gl-supply-movement-shift` | graphlab | XI-B-U6 | Supply: movement vs shift | ✅ | ✅ core feature | ✅ | none | — |
| `gl-market-equilibrium-shifts` | graphlab | XI-B-U7 | D&S together → equilibrium moves | ✅ | ✅ (own `predictChoices`, see pedagogy doc) | ✅ | none | — |
| `micro-elasticity` | curve + predict card | XI-B-U5 | Ed determinants | N/A (no equilibrium; single curve) | N/A | ✅ gold-standard (TLM+predict) | none | — |
| `micro-elasticity-supply` | curve | XI-B-U6 | Es, market period vs long run | N/A (single curve, no equilibrium) | N/A | 🔧 fixed | 🔧 all 3 period curves now drawn together (this pass, 3rd audit) — switching the selector used to REPLACE the only visible curve, so the steepness comparison this concept is built around was never actually visible | — |
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
| `macro-gdp` | custom (SVG) | XII-A-U1 | Circular flow, injections/leakages, **stable node topology across 2/3/4-Sector + Financial Market** | N/A (flow diagram, not curve equilibrium) | N/A | 🔧 fixed (4th audit) | Financial Market and Foreign Sector shared two conditional slots and visibly swapped/slid position whenever the OTHER sector was toggled, turning the diagram into a vertical/plus-shaped stack instead of a stable circular ring — a genuine model-visualization bug (not a missing-annotation gap like the other rows), found via a direct user report, root-caused to the exact two lines sharing a conditional x-coordinate, fixed with permanent fixed anchors, and covered by a new automated regression (`testCircularFlowTopology()`) that would have caught it | — |
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
| `india-human-capital` | curve | XII-B-U7 | Literacy/life-expectancy trend, both converging to a natural ceiling | N/A (time series, no equilibrium) | N/A | ✅ confirmed (3rd audit) | axis bounds (100%/85yrs) already imply the ceiling clearly enough for a teaching purpose; an explicit ceiling line was considered and judged unnecessary decoration — not every convergence needs the money-creation/market-structures treatment | — |
| `india-employment-structure` | curve | XII-B-U7 | Structural transformation & formalisation OVER TIME | 🔧 trend lines across full year range + selected-year marker (this pass, 3rd audit) | N/A | 🔧 fixed | "Years of Growth" drove a single-year snapshot bar chart with no visible trajectory — the transformation itself (the concept's own name) was never a visible trend | — |
| `ied-five-year-plans` | explorer | XII-B-U6 | Timeline | — | N/A | ✅ | none | — |
| `ied-rural-development` | explorer | XII-B-U7 | Classification | — | N/A | ✅ | none | — |
| `ied-sustainable-development` | explorer | XII-B-U7 | Classification | — | N/A | ✅ | none | — |
| `ied-comparison-neighbours` | table→chart | XII-B-U8 | India/Pak/China: growth, HDI, agri-share comparison | 🔧 Agriculture Share now charted (this pass, 3rd audit) | N/A | 🔧 fixed | Agriculture Share had a data column and a callout stat but was never drawn — only 2 of 3 compared dimensions were visible | — |
| `micro-positive-normative` | explorer | XI-B-U4 | Classification (testable vs value judgement) | — | N/A | ✅ | none — correctly NOT a graph (item 7/12) | — |
| `stats-central-tendency` | table→chart | XI-A-U3 | Mean/median/mode, skew | N/A | N/A | ✅ (TLM added) | none | — |
| `stats-dispersion` | curve | XI-A-U3 (enrichment) | Range/QD/SD, Mean, quartiles | 🔧 Mean/Q1/Q3 lines + Range bracket (this pass, 3rd audit) | N/A | 🔧 fixed | Range, QD and Mean were all readings-panel numbers with nothing to look at on the bar chart — no mean line, no quartile markers, no visible Range span | — |
| `stats-data-organisation` | table→chart | XI-A-U2 | Raw data → histogram/polygon/ogive, **graphical median from Ogive** | 🔧 N/2 guide lines + median marker (this pass, 2nd audit) | N/A | 🔧 fixed | the Ogive's single most-taught use (locate the median graphically) was never drawn — a real gap the first pass missed by treating "the three charts render" as sufficient | — |
| `stats-data-presentation` | table→chart | XI-A-U2 | Bar/pie from same table | N/A | N/A | ✅ | none | — |
| `stats-data-collection` | explorer | XI-A-U1 | Classification | — | N/A | ✅ | none | — |
| `stats-index-numbers` | table→chart | XI-A-U3 | Simple aggregative index vs Base=100 | 🔧 index bar + dashed Base=100 reference line (this pass, 3rd audit) | N/A | 🔧 fixed | the index number (the actual answer to "how much costlier") was only a % in the readings panel, disconnected from the price bars; first attempt used a 2nd BAR for the reference, which Plotly rendered hidden behind the taller index bar — caught only by looking at the rendered screenshot, fixed with a line instead | — |
| `stats-correlation` | curve (scatter) | XI-A-U3 | Karl Pearson r, linear association | 🔧 least-squares best-fit line (this pass, 3rd audit) | N/A (scatter + fit line, no equilibrium) | 🔧 fixed | "Strong/Weak", "Positive/Negative" were claims about linear association with no line showing that association on the scatter | — |

## What three audit passes have found and fixed so far

**First pass** (accepted "has a graph/marker" too readily) found and fixed three real
gaps: `micro-consumer-equilibrium`, `micro-producer-costs`, `micro-price-controls`.

**Second pass** — applying the harder standard "does the student have to *infer* the
important relationship, or can they *see* it?" — found and fixed four more:
`macro-money-creation` (convergence to a finite total was a number, never a curve),
`india-poverty` (Gini's own defining area was unshaded), `micro-ppf` (attainable region
was never shaded), `stats-data-organisation` (the Ogive's median-reading technique was
never drawn). Plus `macro-govt-budget` and `macro-inflation-gap`/`macro-forex`
(gap brackets / equilibrium guide lines).

**Third pass** — systematically working through every row the second pass had left
marked "not yet re-verified" — found and fixed seven more real gaps:

- `micro-supply-demand` — with 7 determinants live at once, only the current curve
  ever rendered; no ghost of the original position existed for comparison.
- `micro-elasticity-supply` — switching the Time Period selector replaced the only
  visible curve, so the steepness COMPARISON this concept is entirely built around
  was never actually visible at once.
- `stats-dispersion` — Mean, Q1, Q3 and Range were all readings-panel numbers with
  nothing drawn on the bar chart itself.
- `stats-correlation` — no best-fit line existed to show the linear association
  Pearson's r actually measures.
- `stats-index-numbers` — the index number had no visible relationship to its own
  Base=100 definition. (This one also caught a real *implementation* bug, not just a
  missing feature: the first attempt drew the Base=100 reference as a second BAR,
  which Plotly rendered completely hidden behind the taller index bar in the same
  category — found only by looking at the actual rendered screenshot, not by reading
  the code or trusting `npm run verify`. Fixed with a dashed line instead.)
- `india-employment-structure` — "Years of Growth" drove a single-year snapshot; the
  transformation itself (the concept's own name) was never a visible trend across
  years.
- `ied-comparison-neighbours` — Agriculture Share had a data column and a callout stat
  but was never charted.

**Eighteen real visual/pedagogical gaps fixed across three passes, all verified**
(software + economic + visual, per `docs/economics/validation/README.md`).

**The load-bearing lesson, restated after three passes:** every single gap found in
passes two and three existed on a row the previous pass had already marked ✅. A chart
rendering without errors, having a marker, or looking "fine" at a glance is not
evidence of pedagogical completeness — only running the full 14-question Teacher/
Student test against a row, and then actually looking at the rendered screenshot
(not just the code), reliably finds these. Passing `npm run verify` and reading the
`compute()` function were both insufficient on their own for `stats-index-numbers` —
the bug was only visible in the rendered chart.

## Spot-checked and confirmed genuinely complete (not just "has a chart")

Re-examined against the deeper standard, not merely re-stamped: `gl-cost-curves` and
`gl-revenue-producer-eq` (both already mark their MC=AC/MR=MC crossing exactly the way
the Plotly twins needed fixing to do — confirmed by reading their `model()` functions
directly); `gl-consumption-saving` (break-even point, dissaving/saving arrows, both
ratios' sum already shown); `macro-multiplier` (old/new equilibrium markers plus AE
before/after already present); `macro-national-income-methods` (the three-bar equality
IS the correct visual for that claim — no line/marker needed beyond the bars matching);
`macro-basic-concepts`/`ied-five-year-plans`/`ied-rural-development`/
`ied-sustainable-development`/`stats-data-collection`/`micro-positive-normative`
(explorer/classification content — correctly not forced into a graph, per item 7 of
the directive); `india-human-capital` (axis bounds already make the natural
literacy/life-expectancy ceiling clear enough; an explicit asymptote line was
considered and judged unnecessary for this one, unlike the money-creation/
market-structures cases where the convergence itself is the exam-tested claim).

## Remaining open item (not a gap)

`micro-indifference-curve` vs `gl-consumer-equilibrium-ic` — worth re-confirming on a
future pass that the two stay genuinely complementary (slider-driven vs drag-driven)
rather than drifting into redundancy. Every other row in the table above has now been
through the full 14-question test at least once.
