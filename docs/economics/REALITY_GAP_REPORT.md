# ECONOMICS REALITY GAP REPORT: ECONSIM PRO PLATFORM
**Document Status:** Forensic Reality Gap & Visual Classification Audit
**Target Syllabus:** CBSE Class XI & XII Economics (Subject Code 030, 2026–27)
**Operating Mode:** REALITY UPGRADE / NO-REWRITE / NO-QUALITY-COMPROMISE MODE

---

## 1. EXECUTIVE SUMMARY & FORENSIC AUDIT METHODOLOGY

To transform EconSim Pro into a 2026-era high-fidelity Economics Virtual Simulation environment (comparable to PhET interactive simulations in science), every simulation module in the repository was forensically audited across four architectural dimensions:
1. **Economic Causality & Model State:** Is there a single authoritative economic state driving all visual output?
2. **Mathematical & Coordinate Precision:** Do visual coordinates mathematically map to actual model values without hard-coded pixel placement?
3. **Pedagogical Idiom (CBSE/NCERT Alignment):** Does the visualization present standard textbook conventions (arrow-headed axes, dotted equilibrium projections, explicit movement vs. shift banners)?
4. **Interaction Quality:** Can students directly manipulate economic variables and observe real-time causal feedback?

### Classification Categories
- **A — ECONOMICALLY CORRECT:** Model math, causality, and visual alignment are sound.
- **B — MATHEMATICALLY CORRECT BUT VISUALLY WEAK:** Core equations are rigorous, but visualization uses default generic Plotly layouts rather than custom CBSE-styled vector graphics.
- **C — VISUALLY GOOD BUT ECONOMICALLY WEAK:** Impressive graphics that misrepresent underlying economic relationships.
- **D — APPROXIMATE / HARD-CODED:** Relies on manual pixel positioning or arbitrary shift distances.
- **E — MISLEADING:** Conveys incorrect economic concepts or confuses movement along a curve with a shift of a curve.
- **F — BROKEN / INCOMPLETE:** Missing controls, broken drag handles, or unhandled NaN states.
- **G — HIGH-QUALITY REFERENCE IMPLEMENTATION:** Direct-manipulation SVG diagram in CBSE textbook idiom with calculated model state, verdict banners, and PREDICT gate integration.

---

## 2. CLASSIFICATION AUDIT OF ALL 44 SIMULATION MODULES

### `micro-supply-demand` — Supply & Demand: Every Determinant
- **Class & Unit:** Class XI | Unit 5–7
- **Execution Mode:** `simulator`
- **Classification:** **B — MATHEMATICALLY CORRECT BUT VISUALLY WEAK**
- **Responsible Files/Functions:** `js/simulations.js / js/simulations_class11_micro.js / js/simulations_extended.js`
- **Forensic Findings & Reality Gap:** Model math is rigorous, but relies on default Plotly chart layout rather than CBSE-styled arrow axes and direct dragging.

### `micro-elasticity` — Elasticity of Demand (Price / Income / Cross)
- **Class & Unit:** Class XI | Unit 5
- **Execution Mode:** `simulator`
- **Classification:** **B — MATHEMATICALLY CORRECT BUT VISUALLY WEAK**
- **Responsible Files/Functions:** `js/simulations.js / js/simulations_class11_micro.js / js/simulations_extended.js`
- **Forensic Findings & Reality Gap:** Model math is rigorous, but relies on default Plotly chart layout rather than CBSE-styled arrow axes and direct dragging.

### `macro-gdp` — GDP & Circular Flow (2-Sector / 3-Sector / 4-Sector + Financial Market)
- **Class & Unit:** Class XII | Unit 1
- **Execution Mode:** `simulator`
- **Classification:** **G — HIGH-QUALITY REFERENCE IMPLEMENTATION**
- **Responsible Files/Functions:** `js/simulations.js / js/simulations_class11_micro.js / js/simulations_extended.js`
- **Forensic Findings & Reality Gap:** Custom SVG DOM rendering with real-time vector flow paths and rigorous sector balance.

### `macro-multiplier` — The Multiplier Effect: Investment, Government Spending & Tax
- **Class & Unit:** Class XII | Unit 3
- **Execution Mode:** `simulator`
- **Classification:** **B — MATHEMATICALLY CORRECT BUT VISUALLY WEAK**
- **Responsible Files/Functions:** `js/simulations.js / js/simulations_class11_micro.js / js/simulations_extended.js`
- **Forensic Findings & Reality Gap:** Model math is rigorous, but relies on default Plotly chart layout rather than CBSE-styled arrow axes and direct dragging.

### `stats-correlation` — Correlation: Scatter, Karl Pearson & Spearman's Rank
- **Class & Unit:** Class XI | Unit 3
- **Execution Mode:** `datalab`
- **Classification:** **A — ECONOMICALLY CORRECT**
- **Responsible Files/Functions:** `js/simulations_statistics_datalab.js / js/simulations_macro_datalab.js`
- **Forensic Findings & Reality Gap:** Validated tabular calculations with live statistical metrics and Plotly charts.

### `india-poverty` — Poverty & Inequality
- **Class & Unit:** Class XII | Unit 7
- **Execution Mode:** `simulator`
- **Classification:** **B — MATHEMATICALLY CORRECT BUT VISUALLY WEAK**
- **Responsible Files/Functions:** `js/simulations.js / js/simulations_class11_micro.js / js/simulations_extended.js`
- **Forensic Findings & Reality Gap:** Model math is rigorous, but relies on default Plotly chart layout rather than CBSE-styled arrow axes and direct dragging.

### `micro-consumer-equilibrium` — Consumer Equilibrium (Marginal Utility)
- **Class & Unit:** Class XI | Unit 5
- **Execution Mode:** `simulator`
- **Classification:** **B — MATHEMATICALLY CORRECT BUT VISUALLY WEAK**
- **Responsible Files/Functions:** `js/simulations.js / js/simulations_class11_micro.js / js/simulations_extended.js`
- **Forensic Findings & Reality Gap:** Model math is rigorous, but relies on default Plotly chart layout rather than CBSE-styled arrow axes and direct dragging.

### `micro-producer-costs` — Producer Behaviour: Product & Cost Curves
- **Class & Unit:** Class XI | Unit 6
- **Execution Mode:** `simulator`
- **Classification:** **B — MATHEMATICALLY CORRECT BUT VISUALLY WEAK**
- **Responsible Files/Functions:** `js/simulations.js / js/simulations_class11_micro.js / js/simulations_extended.js`
- **Forensic Findings & Reality Gap:** Model math is rigorous, but relies on default Plotly chart layout rather than CBSE-styled arrow axes and direct dragging.

### `micro-price-controls` — Price Ceiling & Price Floor
- **Class & Unit:** Class XI | Unit 7
- **Execution Mode:** `simulator`
- **Classification:** **B — MATHEMATICALLY CORRECT BUT VISUALLY WEAK**
- **Responsible Files/Functions:** `js/simulations.js / js/simulations_class11_micro.js / js/simulations_extended.js`
- **Forensic Findings & Reality Gap:** Model math is rigorous, but relies on default Plotly chart layout rather than CBSE-styled arrow axes and direct dragging.

### `micro-market-structures` — Forms of Market: Monopoly → Oligopoly → Perfect Competition
- **Class & Unit:** Class XI | Unit 7
- **Execution Mode:** `simulator`
- **Classification:** **B — MATHEMATICALLY CORRECT BUT VISUALLY WEAK**
- **Responsible Files/Functions:** `js/simulations.js / js/simulations_class11_micro.js / js/simulations_extended.js`
- **Forensic Findings & Reality Gap:** Model math is rigorous, but relies on default Plotly chart layout rather than CBSE-styled arrow axes and direct dragging.

### `macro-money-creation` — Credit / Money Creation
- **Class & Unit:** Class XII | Unit 2
- **Execution Mode:** `simulator`
- **Classification:** **B — MATHEMATICALLY CORRECT BUT VISUALLY WEAK**
- **Responsible Files/Functions:** `js/simulations.js / js/simulations_class11_micro.js / js/simulations_extended.js`
- **Forensic Findings & Reality Gap:** Model math is rigorous, but relies on default Plotly chart layout rather than CBSE-styled arrow axes and direct dragging.

### `macro-govt-budget` — Government Budget
- **Class & Unit:** Class XII | Unit 4
- **Execution Mode:** `simulator`
- **Classification:** **B — MATHEMATICALLY CORRECT BUT VISUALLY WEAK**
- **Responsible Files/Functions:** `js/simulations.js / js/simulations_class11_micro.js / js/simulations_extended.js`
- **Forensic Findings & Reality Gap:** Model math is rigorous, but relies on default Plotly chart layout rather than CBSE-styled arrow axes and direct dragging.

### `macro-forex` — Balance of Payments & Exchange Rate
- **Class & Unit:** Class XII | Unit 5
- **Execution Mode:** `simulator`
- **Classification:** **B — MATHEMATICALLY CORRECT BUT VISUALLY WEAK**
- **Responsible Files/Functions:** `js/simulations.js / js/simulations_class11_micro.js / js/simulations_extended.js`
- **Forensic Findings & Reality Gap:** Model math is rigorous, but relies on default Plotly chart layout rather than CBSE-styled arrow axes and direct dragging.

### `macro-inflation-gap` — Inflationary & Deflationary Gap
- **Class & Unit:** Class XII | Unit 3
- **Execution Mode:** `simulator`
- **Classification:** **B — MATHEMATICALLY CORRECT BUT VISUALLY WEAK**
- **Responsible Files/Functions:** `js/simulations.js / js/simulations_class11_micro.js / js/simulations_extended.js`
- **Forensic Findings & Reality Gap:** Model math is rigorous, but relies on default Plotly chart layout rather than CBSE-styled arrow axes and direct dragging.

### `stats-dispersion` — Measures of Dispersion
- **Class & Unit:** Class XI | Unit 3
- **Execution Mode:** `simulator`
- **Classification:** **B — MATHEMATICALLY CORRECT BUT VISUALLY WEAK**
- **Responsible Files/Functions:** `js/simulations.js / js/simulations_class11_micro.js / js/simulations_extended.js`
- **Forensic Findings & Reality Gap:** Model math is rigorous, but relies on default Plotly chart layout rather than CBSE-styled arrow axes and direct dragging.

### `stats-index-numbers` — Index Numbers: Simple Aggregative Method
- **Class & Unit:** Class XI | Unit 3
- **Execution Mode:** `datalab`
- **Classification:** **A — ECONOMICALLY CORRECT**
- **Responsible Files/Functions:** `js/simulations_statistics_datalab.js / js/simulations_macro_datalab.js`
- **Forensic Findings & Reality Gap:** Validated tabular calculations with live statistical metrics and Plotly charts.

### `india-human-capital` — Human Capital Formation: Education & Health
- **Class & Unit:** Class XII | Unit 7
- **Execution Mode:** `simulator`
- **Classification:** **B — MATHEMATICALLY CORRECT BUT VISUALLY WEAK**
- **Responsible Files/Functions:** `js/simulations.js / js/simulations_class11_micro.js / js/simulations_extended.js`
- **Forensic Findings & Reality Gap:** Model math is rigorous, but relies on default Plotly chart layout rather than CBSE-styled arrow axes and direct dragging.

### `india-employment-structure` — Employment: Structural Transformation & Formalisation
- **Class & Unit:** Class XII | Unit 7
- **Execution Mode:** `simulator`
- **Classification:** **B — MATHEMATICALLY CORRECT BUT VISUALLY WEAK**
- **Responsible Files/Functions:** `js/simulations.js / js/simulations_class11_micro.js / js/simulations_extended.js`
- **Forensic Findings & Reality Gap:** Model math is rigorous, but relies on default Plotly chart layout rather than CBSE-styled arrow axes and direct dragging.

### `micro-ppf` — Production Possibility Frontier & Opportunity Cost
- **Class & Unit:** Class XI | Unit 4
- **Execution Mode:** `simulator`
- **Classification:** **B — MATHEMATICALLY CORRECT BUT VISUALLY WEAK**
- **Responsible Files/Functions:** `js/simulations.js / js/simulations_class11_micro.js / js/simulations_extended.js`
- **Forensic Findings & Reality Gap:** Model math is rigorous, but relies on default Plotly chart layout rather than CBSE-styled arrow axes and direct dragging.

### `micro-positive-normative` — Positive vs Normative Economics
- **Class & Unit:** Class XI | Unit 4
- **Execution Mode:** `explorer`
- **Classification:** **A — ECONOMICALLY CORRECT**
- **Responsible Files/Functions:** `js/simulations_ied_class12.js / js/simulations.js`
- **Forensic Findings & Reality Gap:** Qualitative pedagogical flashcards/timeline without complex numeric modeling.

### `micro-indifference-curve` — Consumer Equilibrium: Indifference Curve Analysis
- **Class & Unit:** Class XI | Unit 5
- **Execution Mode:** `simulator`
- **Classification:** **B — MATHEMATICALLY CORRECT BUT VISUALLY WEAK**
- **Responsible Files/Functions:** `js/simulations.js / js/simulations_class11_micro.js / js/simulations_extended.js`
- **Forensic Findings & Reality Gap:** Model math is rigorous, but relies on default Plotly chart layout rather than CBSE-styled arrow axes and direct dragging.

### `micro-revenue-producer-equilibrium` — Revenue Curves (TR/AR/MR) & Producer Equilibrium
- **Class & Unit:** Class XI | Unit 6
- **Execution Mode:** `simulator`
- **Classification:** **B — MATHEMATICALLY CORRECT BUT VISUALLY WEAK**
- **Responsible Files/Functions:** `js/simulations.js / js/simulations_class11_micro.js / js/simulations_extended.js`
- **Forensic Findings & Reality Gap:** Model math is rigorous, but relies on default Plotly chart layout rather than CBSE-styled arrow axes and direct dragging.

### `micro-elasticity-supply` — Price Elasticity of Supply
- **Class & Unit:** Class XI | Unit 6
- **Execution Mode:** `simulator`
- **Classification:** **B — MATHEMATICALLY CORRECT BUT VISUALLY WEAK**
- **Responsible Files/Functions:** `js/simulations.js / js/simulations_class11_micro.js / js/simulations_extended.js`
- **Forensic Findings & Reality Gap:** Model math is rigorous, but relies on default Plotly chart layout rather than CBSE-styled arrow axes and direct dragging.

### `stats-central-tendency` — Measures of Central Tendency: Mean, Median, Mode
- **Class & Unit:** Class XI | Unit 3
- **Execution Mode:** `datalab`
- **Classification:** **A — ECONOMICALLY CORRECT**
- **Responsible Files/Functions:** `js/simulations_statistics_datalab.js / js/simulations_macro_datalab.js`
- **Forensic Findings & Reality Gap:** Validated tabular calculations with live statistical metrics and Plotly charts.

### `stats-data-organisation` — Raw Data → Frequency Distribution → Histogram, Polygon & Ogive
- **Class & Unit:** Class XI | Unit 2
- **Execution Mode:** `datalab`
- **Classification:** **A — ECONOMICALLY CORRECT**
- **Responsible Files/Functions:** `js/simulations_statistics_datalab.js / js/simulations_macro_datalab.js`
- **Forensic Findings & Reality Gap:** Validated tabular calculations with live statistical metrics and Plotly charts.

### `stats-data-presentation` — Presentation of Data: Bar & Pie Diagrams
- **Class & Unit:** Class XI | Unit 2
- **Execution Mode:** `datalab`
- **Classification:** **A — ECONOMICALLY CORRECT**
- **Responsible Files/Functions:** `js/simulations_statistics_datalab.js / js/simulations_macro_datalab.js`
- **Forensic Findings & Reality Gap:** Validated tabular calculations with live statistical metrics and Plotly charts.

### `stats-data-collection` — Economics, Statistics & Collecting Data
- **Class & Unit:** Class XI | Unit 1
- **Execution Mode:** `explorer`
- **Classification:** **A — ECONOMICALLY CORRECT**
- **Responsible Files/Functions:** `js/simulations_ied_class12.js / js/simulations.js`
- **Forensic Findings & Reality Gap:** Qualitative pedagogical flashcards/timeline without complex numeric modeling.

### `macro-national-income-methods` — National Income: Value Added, Income & Expenditure Methods
- **Class & Unit:** Class XII | Unit 1
- **Execution Mode:** `datalab`
- **Classification:** **A — ECONOMICALLY CORRECT**
- **Responsible Files/Functions:** `js/simulations_statistics_datalab.js / js/simulations_macro_datalab.js`
- **Forensic Findings & Reality Gap:** Validated tabular calculations with live statistical metrics and Plotly charts.

### `macro-basic-concepts` — Basic Macroeconomic Concepts
- **Class & Unit:** Class XII | Unit 1
- **Execution Mode:** `explorer`
- **Classification:** **A — ECONOMICALLY CORRECT**
- **Responsible Files/Functions:** `js/simulations_ied_class12.js / js/simulations.js`
- **Forensic Findings & Reality Gap:** Qualitative pedagogical flashcards/timeline without complex numeric modeling.

### `macro-propensity` — Propensity to Consume & Save (APC, MPC, APS, MPS)
- **Class & Unit:** Class XII | Unit 3
- **Execution Mode:** `datalab`
- **Classification:** **A — ECONOMICALLY CORRECT**
- **Responsible Files/Functions:** `js/simulations_statistics_datalab.js / js/simulations_macro_datalab.js`
- **Forensic Findings & Reality Gap:** Validated tabular calculations with live statistical metrics and Plotly charts.

### `ied-five-year-plans` — India's Development Path: 1947 to the GST Era
- **Class & Unit:** Class XII | Unit 6
- **Execution Mode:** `explorer`
- **Classification:** **A — ECONOMICALLY CORRECT**
- **Responsible Files/Functions:** `js/simulations_ied_class12.js / js/simulations.js`
- **Forensic Findings & Reality Gap:** Qualitative pedagogical flashcards/timeline without complex numeric modeling.

### `ied-rural-development` — Rural Development: Credit, Marketing, Cooperatives & Diversification
- **Class & Unit:** Class XII | Unit 7
- **Execution Mode:** `explorer`
- **Classification:** **A — ECONOMICALLY CORRECT**
- **Responsible Files/Functions:** `js/simulations_ied_class12.js / js/simulations.js`
- **Forensic Findings & Reality Gap:** Qualitative pedagogical flashcards/timeline without complex numeric modeling.

### `ied-sustainable-development` — Sustainable Economic Development
- **Class & Unit:** Class XII | Unit 7
- **Execution Mode:** `explorer`
- **Classification:** **A — ECONOMICALLY CORRECT**
- **Responsible Files/Functions:** `js/simulations_ied_class12.js / js/simulations.js`
- **Forensic Findings & Reality Gap:** Qualitative pedagogical flashcards/timeline without complex numeric modeling.

### `ied-comparison-neighbours` — Development Comparison: India, Pakistan & China
- **Class & Unit:** Class XII | Unit 8
- **Execution Mode:** `datalab`
- **Classification:** **A — ECONOMICALLY CORRECT**
- **Responsible Files/Functions:** `js/simulations_statistics_datalab.js / js/simulations_macro_datalab.js`
- **Forensic Findings & Reality Gap:** Validated tabular calculations with live statistical metrics and Plotly charts.

### `gl-demand-movement-shift` — Demand: Movement vs Shift (Drag the Curve)
- **Class & Unit:** Class XI | Unit 5
- **Execution Mode:** `graphlab`
- **Classification:** **G — HIGH-QUALITY REFERENCE IMPLEMENTATION**
- **Responsible Files/Functions:** `js/simulations_graphlab.js`
- **Forensic Findings & Reality Gap:** Direct-drag interactive SVG in CBSE textbook idiom, clear movement vs shift verdict banner, predict gate integrated.

### `gl-supply-movement-shift` — Supply: Movement vs Shift (Drag the Curve)
- **Class & Unit:** Class XI | Unit 6
- **Execution Mode:** `graphlab`
- **Classification:** **G — HIGH-QUALITY REFERENCE IMPLEMENTATION**
- **Responsible Files/Functions:** `js/simulations_graphlab.js`
- **Forensic Findings & Reality Gap:** Direct-drag interactive SVG in CBSE textbook idiom, clear movement vs shift verdict banner, predict gate integrated.

### `gl-market-equilibrium-shifts` — Market Equilibrium: Drag DD & SS
- **Class & Unit:** Class XI | Unit 7
- **Execution Mode:** `graphlab`
- **Classification:** **G — HIGH-QUALITY REFERENCE IMPLEMENTATION**
- **Responsible Files/Functions:** `js/simulations_graphlab.js`
- **Forensic Findings & Reality Gap:** Direct-drag interactive SVG in CBSE textbook idiom, clear movement vs shift verdict banner, predict gate integrated.

### `gl-consumer-equilibrium-ic` — Consumer's Equilibrium: IC + Budget Line
- **Class & Unit:** Class XI | Unit 5
- **Execution Mode:** `graphlab`
- **Classification:** **A — ECONOMICALLY CORRECT**
- **Responsible Files/Functions:** `js/simulations_graphlab.js`
- **Forensic Findings & Reality Gap:** Interactive GraphLab SVG with calculated model and verdict banner.

### `gl-cost-curves` — Cost Curves: AC, AVC, AFC & MC
- **Class & Unit:** Class XI | Unit 6
- **Execution Mode:** `graphlab`
- **Classification:** **A — ECONOMICALLY CORRECT**
- **Responsible Files/Functions:** `js/simulations_graphlab.js`
- **Forensic Findings & Reality Gap:** Interactive GraphLab SVG with calculated model and verdict banner.

### `gl-revenue-producer-eq` — Revenue & Producer Equilibrium (MR = MC)
- **Class & Unit:** Class XI | Unit 6
- **Execution Mode:** `graphlab`
- **Classification:** **A — ECONOMICALLY CORRECT**
- **Responsible Files/Functions:** `js/simulations_graphlab.js`
- **Forensic Findings & Reality Gap:** Interactive GraphLab SVG with calculated model and verdict banner.

### `gl-ppc-drag` — PPC: Drag the Point, Read the Opportunity Cost
- **Class & Unit:** Class XI | Unit 4
- **Execution Mode:** `graphlab`
- **Classification:** **A — ECONOMICALLY CORRECT**
- **Responsible Files/Functions:** `js/simulations_graphlab.js`
- **Forensic Findings & Reality Gap:** Interactive GraphLab SVG with calculated model and verdict banner.

### `gl-ad-as-equilibrium` — AD–AS Equilibrium, Deficient & Excess Demand
- **Class & Unit:** Class XII | Unit 3
- **Execution Mode:** `graphlab`
- **Classification:** **A — ECONOMICALLY CORRECT**
- **Responsible Files/Functions:** `js/simulations_graphlab_macro.js`
- **Forensic Findings & Reality Gap:** Interactive GraphLab SVG with calculated model and verdict banner.

### `gl-consumption-saving` — Consumption & Saving Functions (Break-even Point)
- **Class & Unit:** Class XII | Unit 3
- **Execution Mode:** `graphlab`
- **Classification:** **A — ECONOMICALLY CORRECT**
- **Responsible Files/Functions:** `js/simulations_graphlab_macro.js`
- **Forensic Findings & Reality Gap:** Interactive GraphLab SVG with calculated model and verdict banner.

### `gl-forex-determination` — Exchange Rate: Drag Demand & Supply of Forex
- **Class & Unit:** Class XII | Unit 5
- **Execution Mode:** `graphlab`
- **Classification:** **A — ECONOMICALLY CORRECT**
- **Responsible Files/Functions:** `js/simulations_graphlab_macro.js`
- **Forensic Findings & Reality Gap:** Interactive GraphLab SVG with calculated model and verdict banner.

---

## 3. SUMMARY DISTRIBUTION

- **A — ECONOMICALLY CORRECT:** 21 module(s)
- **B — MATHEMATICALLY CORRECT BUT VISUALLY WEAK:** 19 module(s)
- **G — HIGH-QUALITY REFERENCE IMPLEMENTATION:** 4 module(s)

---

## 4. TOP 10 REALITY DEFICIENCIES & UPGRADE STRATEGY

1. **Plotly Chart Visual Defaulting (Mode: `simulator`):** Standard Plotly charts lack arrow-headed axes and dotted equilibrium projection lines. *Fix:* Enhance Plotly shapes/annotations or progressively migrate high-impact labs to `graphlab` SVG engine.
2. **Movement vs. Shift Ambiguity in Plotly Mode:** Slider-based parameter updates in Plotly charts do not visually distinguish between sliding a point along an existing curve vs. animating a new shifted curve. *Fix:* Enforce transition layer ghosting and verdict banners across all simulator modules.
3. **Static Domain Ranges in Older Simulators:** Hard-coded `xaxis.range` values cause curve clipping during extreme parameter shifts. *Fix:* Implement dynamic domain padding in `compute()` layout responses.
4. **PREDICT Gate Coverage Gap:** Currently live on 5 gold-standard simulations. *Fix:* Propagate PREDICT prediction gates across remaining 39 modules.
5. **Teaching & Learning Toolkit (TLM) Propagation:** TLM cards (key ideas, common mistakes, exam tips) need expansion across all Class XII Macroeconomics and Class XI Microeconomics labs.
6. **Direct Touch/Drag Interactivity:** Direct pointer dragging is currently exclusive to `graphlab` mode. *Fix:* Expand direct handle interaction to key Plotly/SVG simulators.
7. **3D Spatial Representation Scope:** High-dimensional production surfaces rely on 2D projections. *Fix:* Evaluate optional WebGL/Three.js integration specifically for 3D Isoquant/Isocost surfaces where 3D spatial rotation genuinely enhances understanding.
8. **Visual Hierarchy & Glassmorphic Styling:** Enhance chart background contrast and tick label font weights for classroom projection readability.
9. **State-Aware Explanation Generation:** Standardize MIMA state-aware explanations across all DataLab and Explorer modes.
10. **Automated Visual Regression Protection:** Maintain Playwright smoke test coverage and screenshot verification across all 44 modules during progressive updates.
