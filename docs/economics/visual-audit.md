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
| `micro-ppf` | curve | XI-B-U4 | Opportunity cost, concavity | N/A (frontier, not equilibrium) | N/A | ✅ | none | — |
| `gl-ppc-drag` | graphlab | XI-B-U4 | Attainable/unattainable/efficient points, PPF shift | ✅ point classification | shift = resource/tech change (handled) | ✅ | none | — |
| `micro-consumer-equilibrium` | curve | XI-B-U5 | MU=0 (single good); MUx/Px=MUy/Py (two goods) | 🔧 star at crossing (two-good view, this pass) | N/A | 🔧 fixed | none remaining | — |
| `gl-consumer-equilibrium-ic` | graphlab | XI-B-U5 | IC + budget line tangency | ✅ (existing) | N/A (tangency, not movement/shift) | ✅ | none | — |
| `micro-indifference-curve` | curve | XI-B-U5 | IC tangency (alternate, non-drag view) | ✅ marker at tangency | N/A | ✅ | possible duplicate-of-`gl-consumer-equilibrium-ic` in spirit, but this is the slider-driven twin, not redundant — different interaction affordance | low |
| `micro-producer-costs` | curve | XI-B-U6 | TP/AP/MP stages; AC/MC | 🔧 stage boundaries + MC=AC star (this pass) | N/A | 🔧 fixed | none remaining | — |
| `gl-cost-curves` | graphlab | XI-B-U6 | Cost curve shift (input cost/tech) | ✅ (existing) | ✅ (shift-only genre) | ✅ | none | — |
| `micro-revenue-producer-equilibrium` | curve | XI-B-U6 | AR/MR/MC, MR=MC | ✅ marker | N/A | ✅ | none | — |
| `gl-revenue-producer-eq` | graphlab | XI-B-U6 | Revenue/producer equilibrium, drag-based | ✅ (existing) | N/A | ✅ | none | — |
| `micro-price-controls` | curve | XI-B-U7 | Ceiling/floor → shortage/surplus | 🔧 bracket + on-chart annotation (this pass) | N/A | 🔧 fixed | none remaining | — |
| `micro-market-structures` | bar (before/after) | XI-B-U7 (enrichment) | N firms → P→MC | ✅ paired bar (current vs PC benchmark) | N/A | 🟡 | bar comparison works but doesn't show the *curve* of P falling continuously as N rises — a line trace of P(N) would show the convergence directly, current bar only shows two snapshots | medium |
| `macro-gdp` | custom (SVG) | XII-A-U1 | Circular flow, injections/leakages | N/A (flow diagram, not curve equilibrium) | N/A | ✅ (TLM added prior pass) | none | — |
| `macro-multiplier` | curve | XII-A-U3 | ΔG/ΔT → ΔY via multiplier | ✅ old/new equilibrium markers + AE before/after | N/A | ✅ | none | — |
| `macro-propensity` | table→chart | XII-A-U3 | MPC/MPS from C,Y data | ✅ fitted line + 45° line | N/A | ✅ | none | — |
| `gl-consumption-saving` | graphlab | XII-A-U3 | C/S schedules, break-even point | ✅ (existing) | shift = autonomous C change (handled) | ✅ | none | — |
| `macro-inflation-gap` | curve | XII-A-U3 | AD-AS, inflationary/deflationary gap | ✅ equilibrium + Yfe line | N/A (gap, not movement/shift) | 🟡 | equilibrium marked but the GAP itself (Ystar − Yfe) is not bracketed/labelled on the chart the way price-controls now is — same fix pattern applies | high |
| `gl-ad-as-equilibrium` | graphlab | XII-A-U3 | AD-AS equilibrium & gaps, drag-based | ✅ (existing) | ✅ shift genre | ✅ | none | — |
| `macro-money-creation` | curve/numeric | XII-A-U2 | Credit multiplier | N/A (geometric series, not a 2-curve equilibrium) | N/A | ✅ | none | — |
| `macro-national-income-methods` | table→chart | XII-A-U1 | 3-method GDP equality | N/A (bar comparison of 3 methods) | N/A | ✅ | none | — |
| `macro-basic-concepts` | explorer | XII-A-U1 | Stock/flow, final/intermediate | — (classificatory) | N/A | ✅ | none | — |
| `macro-govt-budget` | bar | XII-A-U4 | Receipts vs Expenditure → deficits | 🔧 fixed this pass (see commit) | N/A | 🔧 fixed | — | — |
| `macro-forex` | curve | XII-A-U5 | D$/S$ → exchange rate | ✅ marker, no guide lines | N/A (single equilibrium, no gap) | 🟡 | equilibrium point marked but no dotted P/Q guide lines down to axes (the price-controls pattern) — minor, lower value than the AD-AS gap fix since there's no second quantity to compare against | low-medium |
| `gl-forex-determination` | graphlab | XII-A-U5 | Exchange rate, D/S shift | ✅ (existing) | ✅ shift genre | ✅ | none | — |
| `india-poverty` | curve | XII-B-U7 (enrichment) | Lorenz curve, headcount ratio | ✅ headcount cutoff line | N/A | ✅ | none | — |
| `india-human-capital` | curve | XII-B-U7 | Literacy/life-expectancy trend | N/A (time series, no equilibrium) | N/A | ✅ | none | — |
| `india-employment-structure` | bar | XII-B-U7 | Formal/informal composition | N/A (composition, not equilibrium) | N/A | ✅ | none | — |
| `ied-five-year-plans` | explorer | XII-B-U6 | Timeline | — | N/A | ✅ | none | — |
| `ied-rural-development` | explorer | XII-B-U7 | Classification | — | N/A | ✅ | none | — |
| `ied-sustainable-development` | explorer | XII-B-U7 | Classification | — | N/A | ✅ | none | — |
| `ied-comparison-neighbours` | table→chart | XII-B-U8 | India/Pak/China bar comparison | N/A | N/A | ✅ | none | — |
| `micro-positive-normative` | explorer | XI-B-U4 | Classification (testable vs value judgement) | — | N/A | ✅ | none — correctly NOT a graph (item 7/12) | — |
| `stats-central-tendency` | table→chart | XI-A-U3 | Mean/median/mode, skew | N/A | N/A | ✅ (TLM added) | none | — |
| `stats-dispersion` | curve | XI-A-U3 (enrichment) | Range/QD/SD | N/A | N/A | ✅ | none | — |
| `stats-data-organisation` | table→chart | XI-A-U2 | Raw data → histogram/polygon/ogive | N/A | N/A | ✅ | none | — |
| `stats-data-presentation` | table→chart | XI-A-U2 | Bar/pie from same table | N/A | N/A | ✅ | none | — |
| `stats-data-collection` | explorer | XI-A-U1 | Classification | — | N/A | ✅ | none | — |
| `stats-index-numbers` | table→chart | XI-A-U3 | Simple aggregative index | N/A | N/A | ✅ | none | — |
| `stats-correlation` | curve (scatter) | XI-A-U3 | Karl Pearson r | N/A (scatter + fit line, no equilibrium) | N/A | ✅ | none | — |

## What this table already changed about the work order

Before this pass, `micro-consumer-equilibrium`, `micro-producer-costs` and
`micro-price-controls` were the top three rows with a real, load-bearing visual gap
(equilibrium/crossing/gap implied but never drawn) — all three are now fixed (🔧) and
verified. The next two real gaps, in priority order, are:

1. **`macro-inflation-gap`** (🟡, priority *high*) — the inflationary/deflationary GAP
   itself (the actual named syllabus quantity — `Y* − Yfe`) is not bracketed on the
   chart the same way the price-control shortage/surplus now is. This is the same
   pattern as the fixed `micro-price-controls` gap, on a macro concept that is
   currently missing it.
2. **`micro-market-structures`** (🟡, priority *medium*) — a continuous `P(N)` curve
   would show the "price converges to MC as N grows" relationship directly, instead of
   two isolated bars.

Everything else audited is either already visually complete for its genre, or
correctly has no equilibrium/movement-shift concept to visualize (explorer/timeline/
classification content, per item 7 of the directive: don't force a graph onto content
that's fundamentally classificatory).
