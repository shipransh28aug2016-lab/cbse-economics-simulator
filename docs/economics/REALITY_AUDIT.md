# ECONOMICS REALITY AUDIT: ECONSIM PRO PLATFORM
**Document Status:** Comprehensive System Audit & Economic Reality Baseline
**Target Syllabus:** CBSE Class XI & XII Economics (Subject Code 030, 2026–27)
**Governing Skill:** `ECONOMICS_REALITY_VISUALIZATION_ENGINE.SKILL.md`

---

## 1. EXECUTIVE SUMMARY & PLATFORM ARCHITECTURE

### 1.1 Architecture Overview
EconSim Pro is an interactive, static web platform built with HTML5, CSS3 (glassmorphism design system), and vanilla JavaScript. It runs client-side with no bundler, no transpilation step, and no backend dependencies. The system operates across four primary interactive execution modes:
1. **`simulator` (Plotly.js / Custom SVG):** Numeric parameter-driven simulations where controls update a centralized mathematical model (`compute()`), generating analytical chart traces, layout annotations, metrics, and live readings.
2. **`graphlab` (Direct-Drag Interactive SVG Engine):** Direct-manipulation visual diagrams drawn in the standard CBSE/NCERT textbook idiom (arrow-headed axes with `O` origin, curves labeled at far ends, dotted projection lines to equilibrium coordinates). Direct pointer dragging updates underlying economic variables (`model()`), triggering real-time verdict banners (Distinguishing Movement vs. Shift).
3. **`datalab` (Editable Tabular Data & Statistical Engine):** Live, validated data table interface (`dataLab.calculate()`) supporting statistical computations (Mean, Median, Mode, Karl Pearson r, Spearman rank, Index Numbers, National Income Methods) coupled with Plotly visualizations.
4. **`explorer` (Pedagogical Flashcards & Timeline Scenarios):** Structured qualitative modules for historical, comparative, and structural economic concepts (e.g., Indian Economic Development, Five Year Plans).

### 1.2 Core Architectural Subsystems
- **Unified State Pipeline:** Single source of truth model where User Actions update `SIMEngineState` -> `compute()` / `model()` -> Visual Rendering + Numerical Readings + MIMA Explanation.
- **Transition & Ghosting Layer (`js/transition-layer.js`):** Automatically retains previous mathematical model results to calculate numeric effect diffs and render dimmed ghost traces for moved curves (generalizing the movement-vs-shift distinction).
- **MIMA Pedagogical Assistant (`js/mima-*.js`):** A voice and text explanation layer that reads structured snapshots directly from the simulation model state without re-deriving economics, ensuring zero contradiction between UI and explanations.
- **Multi-Language Engine (`js/i18n_*.js`):** Full English and Hindi (Devanagari) bilingual support covering UI chrome, control labels, readings, quiz questions, and MIMA voice output.
- **Automated Verification Pipeline:** No-build verification including `node --check` typechecks, ESLint, `tools/test-curriculum.js` (sweeping min/max/step domains across all 44 simulations), asset build checks, and Playwright headless browser smoke tests (`tools/smoke.js`).

---

## 2. SYSTEM-WIDE EVALUATION & DEFICIENCY ANALYSIS

### 2.1 Strengths & Working Components
- **Causally Sound Mathematical Models:** Underlying equations across Microeconomics (PPF, Utility, Costs, Revenue, Elasticity) and Macroeconomics (Multiplier, National Income, Circular Flow) are mathematically rigorous and verified against domain sweeps.
- **Movement vs. Shift Pedagogy:** Graph Labs physically enforce the distinction: dragging a point along a curve updates price/quantity (movement/expansion/contraction), while dragging a curve sideways updates non-price determinants (shift/increase/decrease).
- **Zero Model Drift:** Visual geometry, numeric readings, and MIMA explanations derive from a single `compute()` or `model()` execution call.

### 2.2 Visually & Mathematically Weak Areas
- **Plotly Chart Formatting Defaulting:** Standard Plotly charts in `simulator` mode lack explicit CBSE textbook styling (e.g., arrow-headed axes, dotted equilibrium projection lines) which are present in `graphlab` mode.
- **Hard-Coded Domain Scales in Older Simulators:** Certain Plotly layouts use static axis ranges (`range: [0, 100]`) rather than dynamic domain padding, occasionally compressing curves during extreme parameter shifts.
- **Rendering Technology Suitability:** Ordinary 2D supply/demand graphs do not use WebGL or Three.js (which is economically correct), but high-dimensional production surfaces (e.g., 3D Isoquant/Isocost surfaces) currently rely on 2D projections rather than interactive 3D WebGL scenes.

---

## 3. AUDIT OF ALL 44 SIMULATION MODULES

### 1. Supply & Demand: Every Determinant (`micro-supply-demand`)
- **Class & Unit:** Class XI | Part B | Unit 5–7
- **Execution Mode:** `simulator`
- **Rendering Technology:** Plotly.js
- **Pedagogical Concept:** <p>Demand and supply each shift for specific, named reasons — this lab makes every one of them a separate control instead of one abstract "shift" number. <b>Demand</b> shifts with consumer income, the price of substitute/complement goods, and tastes &amp; preferences. <b>Supply</b> shifts with input/factor costs, technology, and government tax or subsidy policy. Move any factor and watch exactly how it moves its own curve — and the resulting equilibrium.</p><p>This equilibrium is the one taught for a <b>Perfect Competition</b> market — many buyers and sellers, an identical (homogeneous) product, free entry and exit, and every buyer/seller a price-taker rather than a price-setter — which is why one demand curve and one supply curve are enough to pin down a single market price.</p><p>💡 This lab is for seeing <b>many determinants and both curves at once</b>. If you specifically need to nail the exam distinction between a <b>movement along</b> the demand curve and a <b>shift of</b> it — with the diagram naming which one you just did — open <b>"Demand: Movement vs Shift (Drag the Curve)"</b> instead; it drags one curve at a time and is built exactly for that distinction.</p>
- **Input Variables:** Consumer Income (slider, min:-10, max:10, default:0), Price of Substitute Good (slider, min:-10, max:10, default:0), Price of Complement Good (slider, min:-10, max:10, default:0), Consumer Tastes & Preferences (slider, min:-10, max:10, default:0), Input / Factor Cost (slider, min:-10, max:10, default:0), Technology (improvement) (slider, min:-10, max:10, default:0), Govt. Tax(+) / Subsidy(−) (slider, min:-10, max:10, default:0)
- **Output Variables / Metrics:** equilibriumPrice, equilibriumQuantity, demandShift, supplyShift
- **Curves / Visual Elements:** Demand, Supply, Equilibrium
- **Axes Definition:** X: Quantity | Y: Price (₹)
- **Coordinate Scale Mapping:** Dynamic / Continuous
- **Equilibrium / Calculation Logic:** Calculated from underlying model parameters
- **Movement along Curve Mechanic:** Parameter variation along fixed curve domain
- **Shift of Curve Mechanic:** Parameter transformation redrawing full curve domain
- **Interaction Mechanism:** Sliders, Selects, Number inputs
- **Labels & Annotations:** Plotly annotations / SVG text elements

### 2. Elasticity of Demand (Price / Income / Cross) (`micro-elasticity`)
- **Class & Unit:** Class XI | Part B | Unit 5
- **Execution Mode:** `simulator`
- **Rendering Technology:** Plotly.js
- **Pedagogical Concept:** <p>The 2026–27 Class XI Microeconomics unit names <b>Price elasticity of demand (Ed)</b> — responsiveness to the good's own price — with its determinants (substitutes, necessity vs luxury, share of income, time) and its two measurement methods (percentage-change, total-expenditure). This lab also lets you explore <b>Income elasticity (Ey)</b> and <b>Cross elasticity (Exy)</b> as useful contrast — they sharpen what "elasticity" means in general, even though the supplied 2026–27 topic list names price elasticity specifically, not these two by name.</p>
- **Input Variables:** Elasticity Type (select, min:undefined, max:undefined, default:price), Price (₹) (slider, min:5, max:95, default:40), Number of Close Substitutes (slider, min:0, max:5, default:1), Consumer Income (₹'000/mo) (slider, min:10, max:100, default:40), Price of Related Good Y (₹) (slider, min:5, max:95, default:40)
- **Output Variables / Metrics:** Ed, mode, substitutes
- **Curves / Visual Elements:** Demand, Current Point
- **Axes Definition:** X: Quantity | Y: Price (₹)
- **Coordinate Scale Mapping:** Dynamic / Continuous
- **Equilibrium / Calculation Logic:** Calculated from underlying model parameters
- **Movement along Curve Mechanic:** Parameter variation along fixed curve domain
- **Shift of Curve Mechanic:** Parameter transformation redrawing full curve domain
- **Interaction Mechanism:** Sliders, Selects, Number inputs
- **Labels & Annotations:** Plotly annotations / SVG text elements

### 3. GDP & Circular Flow (2-Sector / 3-Sector / 4-Sector + Financial Market) (`macro-gdp`)
- **Class & Unit:** Class XII | Part A | Unit 1
- **Execution Mode:** `simulator`
- **Rendering Technology:** Custom SVG / DOM
- **Pedagogical Concept:** <p><b>Macroeconomics</b> studies the economy as a whole — aggregates like total output, the overall price level and total employment — rather than a single household or firm (that's microeconomics). The named 2026-27 syllabus content here is the <b>Two-sector model</b>; this lab also lets you build it up, stage by stage, toward the fuller picture used in board-exam diagrams — and draws exactly the sectors and flows of whatever you pick, nothing extra, nothing missing.</p><p><b>2-Sector model</b> (Households + Firms only, Financial Market OFF): the simplest, closed economy with no government, no foreign trade, and no saving. Households spend their <i>entire</i> income on consumption and firms pay out their <i>entire</i> revenue as factor income — nothing leaks out anywhere, so <b>National Income (Y) = Consumption Expenditure (C)</b> exactly, always.</p><p><b>Financial Market (Banks)</b> — switch it ON at any stage to add Savings (S): households now keep back part of their income instead of spending it (a <b>leakage</b>, Households→Banks), and the banking system channels that saving out to firms as Investment (I) (an <b>injection</b>, Banks→Firms). This lab keeps S = I always (Savings fully re-invested) — the separate Multiplier lab is where planned Investment and Saving are allowed to diverge.</p><p><b>3-Sector model</b> adds Government: Taxes (T) pull money OUT of the household–firm loop (a <b>leakage</b>) and Government Spending (G) pushes new money IN (an <b>injection</b>).</p><p><b>4-Sector model</b> adds the Foreign Sector: Exports (X) bring in payment from abroad for domestically-made goods (an <b>injection</b>) and Imports (M) send money abroad to pay for foreign-made goods (a <b>leakage</b>). The general CBSE rule holds at every stage: if total Injections &gt; total Leakages, National Income tends to RISE; if Injections &lt; Leakages, it tends to FALL; Injections = Leakages is equilibrium.</p><p>In every stage, the <b>real flow</b> (dashed wire, square markers) — factor services and goods &amp; services physically changing hands — always moves opposite to the <b>money flow</b> (solid wire, round markers) that pays for it.</p>
- **Input Variables:** Economy Model (select, min:undefined, max:undefined, default:2), Financial Market (Banks) (select, min:undefined, max:undefined, default:no), Consumption Expenditure (C) (slider, min:20, max:150, default:90), Factor Payments — Wages etc. (₹B) (slider, min:20, max:150, default:100), Savings (S) = Investment (I) (slider, min:0, max:80, default:30), Government Spending (G) (slider, min:0, max:100, default:40), Net Exports (X − M) (slider, min:-40, max:40, default:10)
- **Output Variables / Metrics:** Rendered Visual State
- **Curves / Visual Elements:** Hand-crafted SVG Geometry, Animated Flow Paths
- **Axes Definition:** X: 2D Spatial Canvas Layout | Y: 2D Spatial Canvas Layout
- **Coordinate Scale Mapping:** Dynamic / Continuous
- **Equilibrium / Calculation Logic:** Calculated from underlying model parameters
- **Movement along Curve Mechanic:** Parameter variation along fixed curve domain
- **Shift of Curve Mechanic:** Parameter transformation redrawing full curve domain
- **Interaction Mechanism:** Interactive SVG DOM controls / Toggles
- **Labels & Annotations:** Plotly annotations / SVG text elements

### 4. The Multiplier Effect: Investment, Government Spending & Tax (`macro-multiplier`)
- **Class & Unit:** Class XII | Part A | Unit 3
- **Execution Mode:** `simulator`
- **Rendering Technology:** Plotly.js
- **Pedagogical Concept:** <p>The chart's "Old Equilibrium" and "New Equilibrium" markers are exactly the syllabus's <b>short-run equilibrium output</b> — the income level where Aggregate Expenditure equals income (AE = Y, the point where the AE line crosses the 45° line). Because one person's spending is another person's income, an injection of spending triggers successive rounds of further spending, moving that equilibrium. NCERT's named <b>Investment Multiplier</b> captures this: k = 1/(1−MPC). This lab also shows the Government Spending Multiplier (identical in size to the investment multiplier, since both are direct injections) and the Tax Multiplier (smaller, opposite-signed, since a tax cut only raises spending indirectly through disposable income) as contrast.</p>
- **Input Variables:** Marginal Propensity to Consume (slider, min:0.1, max:0.9, default:0.6), Additional Investment (ΔI) (slider, min:0, max:60, default:20), Additional Govt. Spending (ΔG) (slider, min:0, max:60, default:0), Tax Change (ΔT, + = increase) (slider, min:-60, max:60, default:0)
- **Output Variables / Metrics:** k, kt, dySpending, dyTax, Y1
- **Curves / Visual Elements:** 45° Line (Y=AE), AE (before), AE (after), Old Equilibrium, New Equilibrium
- **Axes Definition:** X: National Income (Y) | Y: Aggregate Expenditure (AE)
- **Coordinate Scale Mapping:** Dynamic / Continuous
- **Equilibrium / Calculation Logic:** Calculated from underlying model parameters
- **Movement along Curve Mechanic:** Parameter variation along fixed curve domain
- **Shift of Curve Mechanic:** Parameter transformation redrawing full curve domain
- **Interaction Mechanism:** Sliders, Selects, Number inputs
- **Labels & Annotations:** Plotly annotations / SVG text elements

### 5. Correlation: Scatter, Karl Pearson & Spearman's Rank (`stats-correlation`)
- **Class & Unit:** Class XI | Part A | Unit 3
- **Execution Mode:** `datalab`
- **Rendering Technology:** DataLab Engine (HTML Table + Plotly)
- **Pedagogical Concept:** <p>Correlation measures the strength and direction of the relationship between two variables. <b>Karl Pearson's coefficient (r)</b> uses the raw values; <b>Spearman's Rank Correlation</b> uses only each value's <i>rank</i> — useful when data is ordinal or when you want a quick, outlier-resistant measure. Edit the Study Hours / Test Score table below (or switch to your own numbers entirely) and both coefficients recompute live, with ranks and rank-differences shown so you can see exactly how Spearman's formula uses them.</p>
- **Input Variables:** Study Hours / Week (number), Test Score (%) (number)
- **Output Variables / Metrics:** n (data points), Karl Pearson's r, Spearman's Rank r
- **Curves / Visual Elements:** Data, Best-fit line (r = 0.99)
- **Axes Definition:** X: Auto / Dependent | Y: Auto / Dependent
- **Coordinate Scale Mapping:** Dynamic / Continuous
- **Equilibrium / Calculation Logic:** Calculated from underlying model parameters
- **Movement along Curve Mechanic:** Parameter variation along fixed curve domain
- **Shift of Curve Mechanic:** Parameter transformation redrawing full curve domain
- **Interaction Mechanism:** Editable HTML Data Table / Add-Remove Rows
- **Labels & Annotations:** Plotly annotations / SVG text elements

### 6. Poverty & Inequality (`india-poverty`)
- **Class & Unit:** Class XII | Part B | Unit 7
- **Execution Mode:** `simulator`
- **Rendering Technology:** Plotly.js
- **Pedagogical Concept:** <p>NCERT's core method for identifying the poor is the <b>poverty line</b> — a calorie-based minimum consumption expenditure (historically ~2400 kcal/day rural, ~2100 kcal/day urban) converted into a rupee cutoff; anyone below it is counted as <b>absolutely poor</b>. Beyond that headline number, economists also study <b>income inequality</b> — how unevenly income is distributed even among the non-poor — using the Lorenz curve and Gini coefficient (standard statistical tools, used here to extend the poverty-line discussion). The Lorenz curve plots the cumulative share of income received against the cumulative share of the population; the further it bows away from the diagonal "line of equality", the greater the inequality.</p>
- **Input Variables:** Inequality Parameter (slider, min:0, max:5, default:1.5), Poverty Line (₹/month) (slider, min:1000, max:12000, default:3000)
- **Output Variables / Metrics:** gini, headcount
- **Curves / Visual Elements:** Line of Equality, Lorenz Curve (Area of Inequality shaded), Headcount Cutoff
- **Axes Definition:** X: Cumulative % of Population | Y: Cumulative % of Income
- **Coordinate Scale Mapping:** Dynamic / Continuous
- **Equilibrium / Calculation Logic:** Calculated from underlying model parameters
- **Movement along Curve Mechanic:** Parameter variation along fixed curve domain
- **Shift of Curve Mechanic:** Parameter transformation redrawing full curve domain
- **Interaction Mechanism:** Sliders, Selects, Number inputs
- **Labels & Annotations:** Plotly annotations / SVG text elements

### 7. Consumer Equilibrium (Marginal Utility) (`micro-consumer-equilibrium`)
- **Class & Unit:** Class XI | Part B | Unit 5
- **Execution Mode:** `simulator`
- **Rendering Technology:** Plotly.js
- **Pedagogical Concept:** <p>The Law of Diminishing Marginal Utility states that as a consumer consumes more units of a good, the additional (marginal) utility from each extra unit falls. With only <b>one good</b> and free disposal, a rational consumer keeps consuming until <b>MU = 0</b> — the <b>Single Good</b> view below.</p><p>But a real consumer splits a <b>fixed money income</b> across <b>two (or more) goods</b>. The actual equilibrium condition — the <b>Law of Equi-Marginal Utility</b> — is reached when the last rupee spent on every good buys the same Marginal Utility: <b>MUx/Px = MUy/Py</b>. If MUx/Px is higher, the consumer is better off shifting a rupee from Y to X (and vice versa) — switch to the <b>Two Goods (Equi-Marginal)</b> view to move your budget between X and Y and watch the two MU/Rupee curves cross exactly at that equilibrium.</p>
- **Input Variables:** View (select, min:undefined, max:undefined, default:single), Units Consumed (Q) (slider, min:0, max:20, default:5), Price per Unit (₹) (slider, min:2, max:20, default:5), Money Income (M, ₹) (slider, min:20, max:100, default:60), Price of X (₹) (slider, min:5, max:20, default:5), Price of Y (₹) (slider, min:5, max:20, default:5), Budget Spent on X (%) (slider, min:0, max:100, default:50)
- **Output Variables / Metrics:** MU, muPerRupee, TU
- **Curves / Visual Elements:** Marginal Utility, Current MU, Zero Utility
- **Axes Definition:** X: Units Consumed (Q) | Y: Utility (Utils)
- **Coordinate Scale Mapping:** Dynamic / Continuous
- **Equilibrium / Calculation Logic:** Calculated from underlying model parameters
- **Movement along Curve Mechanic:** Parameter variation along fixed curve domain
- **Shift of Curve Mechanic:** Parameter transformation redrawing full curve domain
- **Interaction Mechanism:** Sliders, Selects, Number inputs
- **Labels & Annotations:** Plotly annotations / SVG text elements

### 8. Producer Behaviour: Product & Cost Curves (`micro-producer-costs`)
- **Class & Unit:** Class XI | Part B | Unit 6
- **Execution Mode:** `simulator`
- **Rendering Technology:** Plotly.js
- **Pedagogical Concept:** <p>Switch between two related views. <b>Product</b> shows the Law of Variable Proportions: as one variable factor (labour) increases with other factors fixed, Marginal Product rises (Stage I), then falls while still positive (Stage II), then turns negative (Stage III). <b>Cost</b> shows the mirror-image relationship: Average Cost (AC) falls then rises, and Marginal Cost (MC) cuts AC exactly at its minimum.</p>
- **Input Variables:** View (select, min:undefined, max:undefined, default:costs), Output Level (Q) (slider, min:1, max:30, default:10), Fixed Cost (₹) (slider, min:20, max:200, default:100), Labour Units (L) (slider, min:1, max:24, default:10)
- **Output Variables / Metrics:** AC, MC, view, qStar, acStar
- **Curves / Visual Elements:** Average Cost (AC), Marginal Cost (MC), MC = AC (Minimum Average Cost), AC at Q, MC at Q
- **Axes Definition:** X: Output (Q) | Y: Cost (₹)
- **Coordinate Scale Mapping:** Dynamic / Continuous
- **Equilibrium / Calculation Logic:** Calculated from underlying model parameters
- **Movement along Curve Mechanic:** Parameter variation along fixed curve domain
- **Shift of Curve Mechanic:** Parameter transformation redrawing full curve domain
- **Interaction Mechanism:** Sliders, Selects, Number inputs
- **Labels & Annotations:** Plotly annotations / SVG text elements

### 9. Price Ceiling & Price Floor (`micro-price-controls`)
- **Class & Unit:** Class XI | Part B | Unit 7
- **Execution Mode:** `simulator`
- **Rendering Technology:** Plotly.js
- **Pedagogical Concept:** <p>A <b>price ceiling</b> set below the free-market equilibrium price causes a shortage (quantity demanded exceeds quantity supplied). A <b>price floor</b> set above equilibrium causes a surplus (quantity supplied exceeds quantity demanded).</p>
- **Input Variables:** Government Price Control (₹) (slider, min:20, max:100, default:60), Market Demand Conditions (slider, min:-20, max:20, default:0)
- **Output Variables / Metrics:** gap, isCeiling
- **Curves / Visual Elements:** Demand, Supply, Price Floor, Free-Market Q (dotted), Free-Market P (dotted), Free-Market Equilibrium, Surplus (Qs − Qd), Qd = 40, Qs = 40
- **Axes Definition:** X: Quantity | Y: Price (₹)
- **Coordinate Scale Mapping:** Dynamic / Continuous
- **Equilibrium / Calculation Logic:** Calculated from underlying model parameters
- **Movement along Curve Mechanic:** Parameter variation along fixed curve domain
- **Shift of Curve Mechanic:** Parameter transformation redrawing full curve domain
- **Interaction Mechanism:** Sliders, Selects, Number inputs
- **Labels & Annotations:** Plotly annotations / SVG text elements

### 10. Forms of Market: Monopoly → Oligopoly → Perfect Competition (`micro-market-structures`)
- **Class & Unit:** Class XI | Part B | Unit 7
- **Execution Mode:** `simulator`
- **Rendering Technology:** Plotly.js
- **Pedagogical Concept:** <p>This lab goes beyond the syllabus's Perfect-Competition-only scope to show <i>why</i> perfect competition is the benchmark it is: it uses the standard Cournot model — symmetric firms each choosing output, taking rivals' output as given — so moving the Number of Firms slider sweeps from Monopoly (1 firm) toward Perfect Competition as more firms enter and price converges to marginal cost (P = MC).</p>
- **Input Variables:** Marginal Cost (₹) (slider, min:10, max:60, default:20), Number of Firms (N) (slider, min:1, max:30, default:1)
- **Output Variables / Metrics:** P, Q, N, structure
- **Curves / Visual Elements:** Price P(N), Quantity Q(N), Marginal Cost (perfect-competition benchmark), Current (N=1), Current Quantity
- **Axes Definition:** X: Number of Firms (N) | Y: Price (₹)
- **Coordinate Scale Mapping:** Dynamic / Continuous
- **Equilibrium / Calculation Logic:** Calculated from underlying model parameters
- **Movement along Curve Mechanic:** Parameter variation along fixed curve domain
- **Shift of Curve Mechanic:** Parameter transformation redrawing full curve domain
- **Interaction Mechanism:** Sliders, Selects, Number inputs
- **Labels & Annotations:** Plotly annotations / SVG text elements

### 11. Credit / Money Creation (`macro-money-creation`)
- **Class & Unit:** Class XII | Part A | Unit 2
- **Execution Mode:** `simulator`
- **Rendering Technology:** Plotly.js
- **Pedagogical Concept:** <p><b>Money</b> is anything generally accepted as a medium of exchange; NCERT names four functions — medium of exchange, unit of account (measuring value), store of value, and standard of deferred payment (settling future debts). India's <b>money supply</b> is defined as currency held by the public plus net demand deposits held by commercial banks — the deposits this lab simulates are exactly that second component.</p><p>When a bank keeps only a fraction of deposits as reserves (the Legal Reserve Ratio, modeled by the slider below) and lends out the rest, that lending becomes a new deposit elsewhere in the banking system. This process repeats, creating a total money supply many times the original deposit. The <b>Reserve Bank of India (RBI)</b>, India's central bank, controls this process — acting as the <b>bank of issue</b> (sole authority to issue currency notes), the <b>government's bank</b> (manages its accounts and public debt), and the <b>banker's bank</b> (holds commercial banks' reserves and lends to them as a last resort) — using several named monetary-policy tools: <b>CRR</b> (Cash Reserve Ratio) and <b>SLR</b> (Statutory Liquidity Ratio) directly set the reserve requirement modeled here; the <b>Repo Rate</b>, <b>Reverse Repo Rate</b> and <b>Bank Rate</b> change how expensive it is for banks to borrow, indirectly affecting how much they lend; and <b>Open Market Operations (OMO)</b> — the RBI buying/selling government securities — directly add or remove money from circulation.</p>
- **Input Variables:** Legal Reserve Ratio (%) (slider, min:5, max:50, default:20), Initial Deposit (₹) (slider, min:1000, max:10000, default:5000)
- **Output Variables / Metrics:** multiplier, totalMoney
- **Curves / Visual Elements:** New Deposit This Round, Cumulative Money Created, Total Money Created (D0/LRR = ₹25000)
- **Axes Definition:** X: Successive Deposit Rounds | Y: New Deposit This Round (₹)
- **Coordinate Scale Mapping:** Dynamic / Continuous
- **Equilibrium / Calculation Logic:** Calculated from underlying model parameters
- **Movement along Curve Mechanic:** Parameter variation along fixed curve domain
- **Shift of Curve Mechanic:** Parameter transformation redrawing full curve domain
- **Interaction Mechanism:** Sliders, Selects, Number inputs
- **Labels & Annotations:** Plotly annotations / SVG text elements

### 12. Government Budget (`macro-govt-budget`)
- **Class & Unit:** Class XII | Part A | Unit 4
- **Execution Mode:** `simulator`
- **Rendering Technology:** Plotly.js
- **Pedagogical Concept:** <p>The government budget is the government's annual statement of expected receipts and expenditure, presented with several objectives in mind — reallocating resources (e.g. taxing polluting activity, subsidising merit goods), redistributing income (progressive taxes, welfare spending), maintaining economic stability, and managing public enterprises. It records planned receipts (revenue + capital) and expenditure (revenue + capital) for the year. When expenditure exceeds receipts, the shortfall shows up as a deficit. The NCERT chapter names three: <b>Revenue Deficit</b> (routine expenses exceeding routine receipts), <b>Fiscal Deficit</b> (total borrowing requirement), and <b>Primary Deficit</b> (fiscal deficit excluding interest on past borrowing — showing the deficit from this year's policy alone).</p>
- **Input Variables:** Revenue Receipts (₹B) (slider, min:50, max:300, default:150), Revenue Expenditure (₹B) (slider, min:50, max:300, default:180), Interest Payments (₹B) (slider, min:0, max:80, default:30)
- **Output Variables / Metrics:** revenueDeficit, fiscalDeficit, primaryDeficit
- **Curves / Visual Elements:** Unnamed Trace
- **Axes Definition:** X: Budget Component | Y: ₹ Billion
- **Coordinate Scale Mapping:** Dynamic / Continuous
- **Equilibrium / Calculation Logic:** Calculated from underlying model parameters
- **Movement along Curve Mechanic:** Parameter variation along fixed curve domain
- **Shift of Curve Mechanic:** Parameter transformation redrawing full curve domain
- **Interaction Mechanism:** Sliders, Selects, Number inputs
- **Labels & Annotations:** Plotly annotations / SVG text elements

### 13. Balance of Payments & Exchange Rate (`macro-forex`)
- **Class & Unit:** Class XII | Part A | Unit 5
- **Execution Mode:** `simulator`
- **Rendering Technology:** Plotly.js
- **Pedagogical Concept:** <p>This lab models a <b>flexible (floating) exchange rate</b> system, where the rate (₹ per US$) is set purely by market forces. The Balance of Payments splits into two named accounts, each modeled here as its own factor: the <b>Current Account</b> (Imports raise demand for $; Exports raise supply of $) and the <b>Capital Account</b> (Capital Outflow — Indians investing abroad — raises demand for $; Capital Inflow — FDI/FII into India — raises supply of $). The NCERT chapter also names two alternatives to this floating system: a <b>fixed exchange rate</b>, officially pegged by the central bank rather than market-determined; and <b>managed floating</b> — India's actual regime — where the rate mostly floats but the RBI intervenes occasionally to smooth volatility.</p><p><b>Weighing the systems:</b> a flexible rate self-corrects BOP imbalances automatically and needs no reserves to defend, but its unpredictability can discourage trade and investment. A fixed rate gives businesses certainty, but requires the central bank to hold large reserves to defend it and removes an automatic adjustment mechanism. Managed floating tries to combine flexibility with occasional stability — at the cost of needing constant RBI judgement calls about when to intervene.</p>
- **Input Variables:** Imports (Current A/c) (slider, min:-20, max:20, default:0), Exports (Current A/c) (slider, min:-20, max:20, default:0), Capital Outflow (Capital A/c) (slider, min:-20, max:20, default:0), Capital Inflow (Capital A/c) (slider, min:-20, max:20, default:0)
- **Output Variables / Metrics:** P, Q, trend
- **Curves / Visual Elements:** Demand for $, Supply of $, Equilibrium Q (dotted), Equilibrium P (dotted), Equilibrium Rate
- **Axes Definition:** X: Quantity of US$ (millions) | Y: Exchange Rate (₹/$)
- **Coordinate Scale Mapping:** Dynamic / Continuous
- **Equilibrium / Calculation Logic:** Calculated from underlying model parameters
- **Movement along Curve Mechanic:** Parameter variation along fixed curve domain
- **Shift of Curve Mechanic:** Parameter transformation redrawing full curve domain
- **Interaction Mechanism:** Sliders, Selects, Number inputs
- **Labels & Annotations:** Plotly annotations / SVG text elements

### 14. Inflationary & Deflationary Gap (`macro-inflation-gap`)
- **Class & Unit:** Class XII | Part A | Unit 3
- **Execution Mode:** `simulator`
- **Rendering Technology:** Plotly.js
- **Pedagogical Concept:** <p><b>Yfe</b> on this chart is the <b>full employment</b> level of income — where every willing worker at the going wage has a job. When equilibrium national income exceeds Yfe, the economy faces an <b>inflationary gap</b> — excess demand pushes prices up even though output can't rise further. When equilibrium income falls short of Yfe, a <b>deflationary gap</b> exists: demand is too low to employ everyone willing to work, which is exactly what NCERT calls <b>involuntary unemployment</b> — workers who want a job at the prevailing wage but can't find one, not by choice. Aggregate Demand is the sum of four named components — Autonomous Consumption, Investment, Government Spending, and Net Exports — each modeled here as its own control so you can see which one is driving the gap.</p>
- **Input Variables:** Autonomous Consumption (ΔC) (slider, min:-10, max:10, default:0), Investment (ΔI) (slider, min:-10, max:10, default:0), Government Spending (ΔG) (slider, min:-10, max:10, default:0), Net Exports (ΔX−M) (slider, min:-10, max:10, default:0)
- **Output Variables / Metrics:** Ystar, Yfe, gapType, gapSize
- **Curves / Visual Elements:** Aggregate Demand, Aggregate Supply, Full Employment (Yfe), Equilibrium Y (dotted), Equilibrium P (dotted), Equilibrium, Inflationary Gap
- **Axes Definition:** X: National Income (Y) | Y: Price Level
- **Coordinate Scale Mapping:** Dynamic / Continuous
- **Equilibrium / Calculation Logic:** Calculated from underlying model parameters
- **Movement along Curve Mechanic:** Parameter variation along fixed curve domain
- **Shift of Curve Mechanic:** Parameter transformation redrawing full curve domain
- **Interaction Mechanism:** Sliders, Selects, Number inputs
- **Labels & Annotations:** Plotly annotations / SVG text elements

### 15. Measures of Dispersion (`stats-dispersion`)
- **Class & Unit:** Class XI | Part A | Unit 3
- **Execution Mode:** `simulator`
- **Rendering Technology:** Plotly.js
- **Pedagogical Concept:** <p>While the mean summarizes the "centre" of a dataset, dispersion measures describe how spread out the values are around that centre. This lab covers the simple <b>Range</b> and <b>Quartile Deviation</b> (based on position), and the more powerful <b>Standard Deviation</b> and <b>Coefficient of Variation</b> (based on every value). Two datasets can share the same mean yet look very different once you compare their spread.</p>
- **Input Variables:** Spread Factor (slider, min:1, max:10, default:4)
- **Output Variables / Metrics:** sd, cv, range, qd
- **Curves / Visual Elements:** Data, Mean (52.57), Q1 (49.00), Q3 (56.50), Range (15.00)
- **Axes Definition:** X: Data Point | Y: Value
- **Coordinate Scale Mapping:** Dynamic / Continuous
- **Equilibrium / Calculation Logic:** Calculated from underlying model parameters
- **Movement along Curve Mechanic:** Parameter variation along fixed curve domain
- **Shift of Curve Mechanic:** Parameter transformation redrawing full curve domain
- **Interaction Mechanism:** Sliders, Selects, Number inputs
- **Labels & Annotations:** Plotly annotations / SVG text elements

### 16. Index Numbers: Simple Aggregative Method (`stats-index-numbers`)
- **Class & Unit:** Class XI | Part A | Unit 3
- **Execution Mode:** `datalab`
- **Rendering Technology:** DataLab Engine (HTML Table + Plotly)
- **Pedagogical Concept:** <p>An index number expresses the value of a variable in a given period relative to its value in a fixed base period (= 100). NCERT names the <b>Simple Aggregative Method</b> for building a price index directly from a commodity basket: sum every commodity's current-year price, sum every commodity's base-year price, and take the ratio. This is the same underlying idea behind the <b>Wholesale Price Index (WPI)</b>, <b>Consumer Price Index (CPI)</b> and <b>Index of Industrial Production (IIP)</b> (which use weighted baskets in practice) — and the index's movement above/below 100 is exactly what <b>inflation</b> measures.</p>
- **Input Variables:** Commodity (text), Base Year Price (number), Current Year Price (number)
- **Output Variables / Metrics:** ΣP₀ (Base Year Total), ΣP₁ (Current Year Total), Price Index (Base = 100), Inflation Rate
- **Curves / Visual Elements:** Base Year Price, Current Year Price, Base Year (= 100), Current Index (113.59)
- **Axes Definition:** X: Auto / Dependent | Y: Auto / Dependent
- **Coordinate Scale Mapping:** Dynamic / Continuous
- **Equilibrium / Calculation Logic:** Calculated from underlying model parameters
- **Movement along Curve Mechanic:** Parameter variation along fixed curve domain
- **Shift of Curve Mechanic:** Parameter transformation redrawing full curve domain
- **Interaction Mechanism:** Editable HTML Data Table / Add-Remove Rows
- **Labels & Annotations:** Plotly annotations / SVG text elements

### 17. Human Capital Formation: Education & Health (`india-human-capital`)
- **Class & Unit:** Class XII | Part B | Unit 7
- **Execution Mode:** `simulator`
- **Rendering Technology:** Plotly.js
- **Pedagogical Concept:** <p>NCERT names several sources of human capital formation; the two most emphasized are investment in <b>education</b> (raises literacy and skills) and investment in <b>health</b> (raises life expectancy and productive years). Both are modeled here as independent, adjustable spending levels, each driving its own outcome over time.</p>
- **Input Variables:** Education Spending (% of GDP) (slider, min:1, max:8, default:4), Health Spending (% of GDP) (slider, min:1, max:6, default:2)
- **Output Variables / Metrics:** literacy, lifeExpectancy
- **Curves / Visual Elements:** Literacy Rate (%), Life Expectancy (yrs)
- **Axes Definition:** X: Year | Y: Literacy Rate (%)
- **Coordinate Scale Mapping:** Dynamic / Continuous
- **Equilibrium / Calculation Logic:** Calculated from underlying model parameters
- **Movement along Curve Mechanic:** Parameter variation along fixed curve domain
- **Shift of Curve Mechanic:** Parameter transformation redrawing full curve domain
- **Interaction Mechanism:** Sliders, Selects, Number inputs
- **Labels & Annotations:** Plotly annotations / SVG text elements

### 18. Employment: Structural Transformation & Formalisation (`india-employment-structure`)
- **Class & Unit:** Class XII | Part B | Unit 7
- **Execution Mode:** `simulator`
- **Rendering Technology:** Plotly.js
- **Pedagogical Concept:** <p>The Employment topic covers two related shifts. <b>Structural transformation</b>: as economies develop, the workforce share in agriculture typically falls while industry and services rise. <b>Formal vs informal sector</b>: workers move (unevenly) from the <b>informal sector</b> — no job security, no social security, often self-employed or casual labour — toward <b>formal sector</b> jobs with regular wages and legal protection. Switch views below to explore either.</p>
- **Input Variables:** View (select, min:undefined, max:undefined, default:sector), Years of Growth (slider, min:0, max:30, default:10)
- **Output Variables / Metrics:** agri, industry, services, view
- **Curves / Visual Elements:** Agriculture (%), Industry (%), Services (%), Selected Year (+10yrs), Unnamed Trace, Unnamed Trace, Unnamed Trace
- **Axes Definition:** X: Years of Growth | Y: Share of Employment (%)
- **Coordinate Scale Mapping:** Dynamic / Continuous
- **Equilibrium / Calculation Logic:** Calculated from underlying model parameters
- **Movement along Curve Mechanic:** Parameter variation along fixed curve domain
- **Shift of Curve Mechanic:** Parameter transformation redrawing full curve domain
- **Interaction Mechanism:** Sliders, Selects, Number inputs
- **Labels & Annotations:** Plotly annotations / SVG text elements

### 19. Production Possibility Frontier & Opportunity Cost (`micro-ppf`)
- **Class & Unit:** Class XI | Part B | Unit 4
- **Execution Mode:** `simulator`
- **Rendering Technology:** Plotly.js
- **Pedagogical Concept:** <p>Every economy faces three central problems — <b>what</b> to produce, <b>how</b> to produce it, and <b>for whom</b> — because resources are scarce relative to wants. The <b>Production Possibility Frontier (PPF)</b> shows every combination of two goods an economy can produce at full, efficient resource use. A point <i>on</i> the frontier is efficient; a point <i>inside</i> it means resources are unemployed or underused (an "inefficient" economy — one answer to "how to produce" gone wrong); a point <i>outside</i> it is unattainable with current resources and technology. The PPF bows outward (concave to the origin) because resources aren't perfectly suited to producing both goods — shifting more resources toward Good X costs progressively <i>more</i> Good Y each time: the <b>Law of Increasing Opportunity Cost</b>.</p>
- **Input Variables:** Resources & Technology (C) (slider, min:10, max:30, default:20), Output of Good X (slider, min:0, max:30, default:10), Point Type (select, min:undefined, max:undefined, default:on)
- **Output Variables / Metrics:** pointType, mrt, Y, Yfrontier
- **Curves / Visual Elements:** PPF (Efficient Frontier), Chosen Point
- **Axes Definition:** X: Good X (units) | Y: Good Y (units)
- **Coordinate Scale Mapping:** Dynamic / Continuous
- **Equilibrium / Calculation Logic:** Calculated from underlying model parameters
- **Movement along Curve Mechanic:** Parameter variation along fixed curve domain
- **Shift of Curve Mechanic:** Parameter transformation redrawing full curve domain
- **Interaction Mechanism:** Sliders, Selects, Number inputs
- **Labels & Annotations:** Plotly annotations / SVG text elements

### 20. Positive vs Normative Economics (`micro-positive-normative`)
- **Class & Unit:** Class XI | Part B | Unit 4
- **Execution Mode:** `explorer`
- **Rendering Technology:** Explorer Engine (HTML Cards/Timeline)
- **Pedagogical Concept:** <p><b>Positive economics</b> deals with statements that can be tested against facts — "what is". <b>Normative economics</b> deals with value judgements about what <i>should</i> be — "what ought to be". <b>Microeconomics</b> studies individual units (a household, a firm, a market); <b>Macroeconomics</b> studies the economy as a whole (national income, price level, employment). Classify each statement below.</p>
- **Input Variables:** None / Static
- **Output Variables / Metrics:** Selected Era / Card State, Explanation / Pedagogical Insight
- **Curves / Visual Elements:** N/A
- **Axes Definition:** X: Auto / Dependent | Y: Auto / Dependent
- **Coordinate Scale Mapping:** Dynamic / Continuous
- **Equilibrium / Calculation Logic:** Calculated from underlying model parameters
- **Movement along Curve Mechanic:** Parameter variation along fixed curve domain
- **Shift of Curve Mechanic:** Parameter transformation redrawing full curve domain
- **Interaction Mechanism:** Clickable Timeline Eras / Concept Flashcards / Scenario Pickers
- **Labels & Annotations:** Plotly annotations / SVG text elements

### 21. Consumer Equilibrium: Indifference Curve Analysis (`micro-indifference-curve`)
- **Class & Unit:** Class XI | Part B | Unit 5
- **Execution Mode:** `simulator`
- **Rendering Technology:** Plotly.js
- **Pedagogical Concept:** <p>Indifference Curve analysis models consumer choice without needing to measure utility in numbers. The <b>budget line</b> (Px·X + Py·Y = Income) shows every bundle the consumer can just afford. An <b>indifference curve</b> joins bundles giving equal satisfaction; the full <b>indifference map</b> is a family of such curves — higher curves mean more satisfaction. <b>Consumer equilibrium</b> is where the budget line is <i>tangent</i> to the highest indifference curve it can reach — at that point, the slope of the indifference curve (MRS) equals the slope of the budget line (the price ratio Px/Py).</p>
- **Input Variables:** Money Income (slider, min:50, max:300, default:150), Price of X (Px) (slider, min:2, max:20, default:5), Price of Y (Py) (slider, min:2, max:20, default:5), Preference Weight for X (a) (slider, min:0.2, max:0.8, default:0.5)
- **Output Variables / Metrics:** X, Y, mrs, priceRatio
- **Curves / Visual Elements:** Lower IC (attainable, not chosen), IC through Equilibrium, Higher IC (unattainable), Budget Line, Consumer Equilibrium
- **Axes Definition:** X: Good X | Y: Good Y
- **Coordinate Scale Mapping:** Dynamic / Continuous
- **Equilibrium / Calculation Logic:** Calculated from underlying model parameters
- **Movement along Curve Mechanic:** Parameter variation along fixed curve domain
- **Shift of Curve Mechanic:** Parameter transformation redrawing full curve domain
- **Interaction Mechanism:** Sliders, Selects, Number inputs
- **Labels & Annotations:** Plotly annotations / SVG text elements

### 22. Revenue Curves (TR/AR/MR) & Producer Equilibrium (`micro-revenue-producer-equilibrium`)
- **Class & Unit:** Class XI | Part B | Unit 6
- **Execution Mode:** `simulator`
- **Rendering Technology:** Plotly.js
- **Pedagogical Concept:** <p><b>Total Revenue (TR)</b> = Price × Quantity sold. <b>Average Revenue (AR)</b> = TR/Q — which is always just the price per unit. <b>Marginal Revenue (MR)</b> = the extra revenue from selling one more unit. Under <b>Perfect Competition</b> a firm is a price-taker, so AR = MR = Price (a flat line) — every extra unit sells at the same market price. A firm reaches <b>Producer's Equilibrium</b> — the profit-maximising output — where <b>MR = MC</b>, with MC rising through that point. (The "Downward-Sloping Demand" option is shown only as a contrast to make AR=MR=P under perfect competition easier to see — the syllabus's Unit 7 scope is Perfect Competition specifically.)</p>
- **Input Variables:** Market Type (select, min:undefined, max:undefined, default:perfect), Market Price (Perfect Competition) (slider, min:10, max:90, default:50), Marginal Cost — Base (slider, min:2, max:40, default:10), Marginal Cost — Slope (slider, min:0.5, max:5, default:2), Fixed Cost (slider, min:0, max:100, default:20)
- **Output Variables / Metrics:** Qstar, MRatQstar, MCatQstar, profit, TR, TC
- **Curves / Visual Elements:** AR (= Demand/Price), MR, MC, Producer Equilibrium (MR=MC)
- **Axes Definition:** X: Output (Q) | Y: ₹ per unit
- **Coordinate Scale Mapping:** Dynamic / Continuous
- **Equilibrium / Calculation Logic:** Calculated from underlying model parameters
- **Movement along Curve Mechanic:** Parameter variation along fixed curve domain
- **Shift of Curve Mechanic:** Parameter transformation redrawing full curve domain
- **Interaction Mechanism:** Sliders, Selects, Number inputs
- **Labels & Annotations:** Plotly annotations / SVG text elements

### 23. Price Elasticity of Supply (`micro-elasticity-supply`)
- **Class & Unit:** Class XI | Part B | Unit 6
- **Execution Mode:** `simulator`
- **Rendering Technology:** Plotly.js
- **Pedagogical Concept:** <p><b>Price elasticity of supply (Es)</b> measures how much quantity supplied responds to a price change. Its biggest determinant is the <b>time period</b> a producer has to adjust: in the very short <b>market period</b> output is nearly fixed (supply is highly inelastic — think of a fish market where today's catch is already fixed); in the <b>short run</b> firms can vary some inputs (moderately elastic); in the <b>long run</b> firms can build new capacity entirely (highly elastic).</p>
- **Input Variables:** Time Period (select, min:undefined, max:undefined, default:short), Price (₹) (slider, min:5, max:95, default:40)
- **Output Variables / Metrics:** Es, period
- **Curves / Visual Elements:** Market Period Supply, Short Run Supply, Long Run Supply, Current Point
- **Axes Definition:** X: Quantity Supplied | Y: Price (₹)
- **Coordinate Scale Mapping:** Dynamic / Continuous
- **Equilibrium / Calculation Logic:** Calculated from underlying model parameters
- **Movement along Curve Mechanic:** Parameter variation along fixed curve domain
- **Shift of Curve Mechanic:** Parameter transformation redrawing full curve domain
- **Interaction Mechanism:** Sliders, Selects, Number inputs
- **Labels & Annotations:** Plotly annotations / SVG text elements

### 24. Measures of Central Tendency: Mean, Median, Mode (`stats-central-tendency`)
- **Class & Unit:** Class XI | Part A | Unit 3
- **Execution Mode:** `datalab`
- **Rendering Technology:** DataLab Engine (HTML Table + Plotly)
- **Pedagogical Concept:** <p>Central tendency measures try to summarise a whole dataset with one representative number. The <b>Arithmetic Mean</b> uses every value but is pulled by outliers; the <b>Median</b> is the middle value when sorted, so it resists outliers; the <b>Mode</b> is simply the most frequent value. Edit the data below — a class's test marks, by default — and watch all three recalculate, and where they sit relative to each other, live.</p>
- **Input Variables:** Student (text), Marks (number)
- **Output Variables / Metrics:** n (data points), Mean (x̄), Median, Mode
- **Curves / Visual Elements:** Marks, Mean, Median
- **Axes Definition:** X: Auto / Dependent | Y: Auto / Dependent
- **Coordinate Scale Mapping:** Dynamic / Continuous
- **Equilibrium / Calculation Logic:** Calculated from underlying model parameters
- **Movement along Curve Mechanic:** Parameter variation along fixed curve domain
- **Shift of Curve Mechanic:** Parameter transformation redrawing full curve domain
- **Interaction Mechanism:** Editable HTML Data Table / Add-Remove Rows
- **Labels & Annotations:** Plotly annotations / SVG text elements

### 25. Raw Data → Frequency Distribution → Histogram, Polygon & Ogive (`stats-data-organisation`)
- **Class & Unit:** Class XI | Part A | Unit 2
- **Execution Mode:** `datalab`
- **Rendering Technology:** DataLab Engine (HTML Table + Plotly)
- **Pedagogical Concept:** <p>Raw, unclassified data is hard to read at a glance. <b>Organisation of Data</b> groups it into a <b>frequency distribution</b> — equal-width class intervals, each with a count (frequency) of how many observations fall in it. That frequency distribution is then <b>presented</b> as a <b>Histogram</b> (bars, no gaps, area ∝ frequency), a <b>Frequency Polygon</b> (line joining each class's midpoint, closed to zero at both ends), and an <b>Ogive</b> (cumulative "less than" frequency curve). Type in raw numbers below — marks, ages, incomes, anything — and this lab classifies them into 5 class intervals automatically and draws all three.</p>
- **Input Variables:** Raw Observation (number)
- **Output Variables / Metrics:** n (observations), Range, Class Width, Modal Class, Median (graphically, from Ogive)
- **Curves / Visual Elements:** Histogram, Frequency Polygon, Ogive (Less Than), N/2 (dotted), Median (dotted), Median ≈ 32.6 (read from Ogive)
- **Axes Definition:** X: Auto / Dependent | Y: Auto / Dependent
- **Coordinate Scale Mapping:** Dynamic / Continuous
- **Equilibrium / Calculation Logic:** Calculated from underlying model parameters
- **Movement along Curve Mechanic:** Parameter variation along fixed curve domain
- **Shift of Curve Mechanic:** Parameter transformation redrawing full curve domain
- **Interaction Mechanism:** Editable HTML Data Table / Add-Remove Rows
- **Labels & Annotations:** Plotly annotations / SVG text elements

### 26. Presentation of Data: Bar & Pie Diagrams (`stats-data-presentation`)
- **Class & Unit:** Class XI | Part A | Unit 2
- **Execution Mode:** `datalab`
- **Rendering Technology:** DataLab Engine (HTML Table + Plotly)
- **Pedagogical Concept:** <p>The same tabulated data can be presented several ways. <b>Bar diagrams</b> make categories easy to compare by height; <b>Pie diagrams</b> make each category's <i>share of the total</i> easy to see at a glance. Both come from exactly the same table — edit any category or value below and both diagrams update together, so you can see they are two views of one dataset, not two different datasets. (An <b>arithmetic line/time-series graph</b> — the third named presentation form — is simply this same idea plotted with Year on the X-axis instead of a category; see the Index Numbers Data Lab for a worked time-series line chart.)</p>
- **Input Variables:** Category (text), Value (number)
- **Output Variables / Metrics:** Total, Largest Category, Smallest Category
- **Curves / Visual Elements:** Bar Diagram, Pie Diagram
- **Axes Definition:** X: Auto / Dependent | Y: Auto / Dependent
- **Coordinate Scale Mapping:** Dynamic / Continuous
- **Equilibrium / Calculation Logic:** Calculated from underlying model parameters
- **Movement along Curve Mechanic:** Parameter variation along fixed curve domain
- **Shift of Curve Mechanic:** Parameter transformation redrawing full curve domain
- **Interaction Mechanism:** Editable HTML Data Table / Add-Remove Rows
- **Labels & Annotations:** Plotly annotations / SVG text elements

### 27. Economics, Statistics & Collecting Data (`stats-data-collection`)
- **Class & Unit:** Class XI | Part A | Unit 1
- **Execution Mode:** `explorer`
- **Rendering Technology:** Explorer Engine (HTML Cards/Timeline)
- **Pedagogical Concept:** <p>Before any calculation, statistics starts with a question: where does the data come from? This explorer walks through what economics and statistics study, and the two big data-collection choices every study makes: <b>primary vs secondary data</b>, and <b>sampling vs a full census</b>.</p>
- **Input Variables:** None / Static
- **Output Variables / Metrics:** Selected Era / Card State, Explanation / Pedagogical Insight
- **Curves / Visual Elements:** N/A
- **Axes Definition:** X: Auto / Dependent | Y: Auto / Dependent
- **Coordinate Scale Mapping:** Dynamic / Continuous
- **Equilibrium / Calculation Logic:** Calculated from underlying model parameters
- **Movement along Curve Mechanic:** Parameter variation along fixed curve domain
- **Shift of Curve Mechanic:** Parameter transformation redrawing full curve domain
- **Interaction Mechanism:** Clickable Timeline Eras / Concept Flashcards / Scenario Pickers
- **Labels & Annotations:** Plotly annotations / SVG text elements

### 28. National Income: Value Added, Income & Expenditure Methods (`macro-national-income-methods`)
- **Class & Unit:** Class XII | Part A | Unit 1
- **Execution Mode:** `datalab`
- **Rendering Technology:** DataLab Engine (HTML Table + Plotly)
- **Pedagogical Concept:** <p>National income can be measured three ways, and — measured correctly — all three give the <b>same total</b>, because they trace the same flow of production, income and spending around the economy. The <b>Value Added Method</b> sums each firm's Value of Output minus what it bought from other firms (Intermediate Consumption), avoiding double-counting. The <b>Income Method</b> sums the factor incomes (Wages + Rent + Interest + Profit) generated by that same production — Profit is what is left over after paying the other three factors, so the Income Method total is <i>guaranteed</i> to equal the Value Added total. The <b>Expenditure Method</b> (C + I + G + X−M) reaches the same total from the spending side; here it is shown as an illustrative split of that same GDP figure rather than a separately entered dataset, since Expenditure-side data isn't naturally per-firm.</p>
- **Input Variables:** Firm / Sector (text), Value of Output (number), Intermediate Consumption (number), Wages Paid (number), Rent Paid (number), Interest Paid (number)
- **Output Variables / Metrics:** GDP — Value Added Method, GDP — Income Method, Implied Total Profit, GDP — Expenditure (C+I+G+NX, illustrative split)
- **Curves / Visual Elements:** Data Plot
- **Axes Definition:** X: Auto / Dependent | Y: Auto / Dependent
- **Coordinate Scale Mapping:** Dynamic / Continuous
- **Equilibrium / Calculation Logic:** Calculated from underlying model parameters
- **Movement along Curve Mechanic:** Parameter variation along fixed curve domain
- **Shift of Curve Mechanic:** Parameter transformation redrawing full curve domain
- **Interaction Mechanism:** Editable HTML Data Table / Add-Remove Rows
- **Labels & Annotations:** Plotly annotations / SVG text elements

### 29. Basic Macroeconomic Concepts (`macro-basic-concepts`)
- **Class & Unit:** Class XII | Part A | Unit 1
- **Execution Mode:** `explorer`
- **Rendering Technology:** Explorer Engine (HTML Cards/Timeline)
- **Pedagogical Concept:** <p>Before computing national income, a few basic classifications need to be second-nature. Is a good bought for immediate use (a <b>consumption good</b>) or to produce other things (a <b>capital good</b>)? Is it used up within the year of production (an <b>intermediate good</b>, excluded from GDP to avoid double-counting) or does it leave the production boundary for final use (a <b>final good</b>, included in GDP)? Is a variable measured at a point in time (a <b>stock</b>) or over a period of time (a <b>flow</b>)? Classify each item below.</p>
- **Input Variables:** None / Static
- **Output Variables / Metrics:** Selected Era / Card State, Explanation / Pedagogical Insight
- **Curves / Visual Elements:** N/A
- **Axes Definition:** X: Auto / Dependent | Y: Auto / Dependent
- **Coordinate Scale Mapping:** Dynamic / Continuous
- **Equilibrium / Calculation Logic:** Calculated from underlying model parameters
- **Movement along Curve Mechanic:** Parameter variation along fixed curve domain
- **Shift of Curve Mechanic:** Parameter transformation redrawing full curve domain
- **Interaction Mechanism:** Clickable Timeline Eras / Concept Flashcards / Scenario Pickers
- **Labels & Annotations:** Plotly annotations / SVG text elements

### 30. Propensity to Consume & Save (APC, MPC, APS, MPS) (`macro-propensity`)
- **Class & Unit:** Class XII | Part A | Unit 3
- **Execution Mode:** `datalab`
- **Rendering Technology:** DataLab Engine (HTML Table + Plotly)
- **Pedagogical Concept:** <p><b>Average Propensity to Consume (APC)</b> = Consumption / Income for a given period. <b>Marginal Propensity to Consume (MPC)</b> = the change in Consumption per extra rupee of Income — the slope of the consumption line across periods. <b>APS</b> and <b>MPS</b> are the saving-side mirror images (APC+APS=1, MPC+MPS=1). The <b>break-even income</b> is where Consumption exactly equals Income (saving is zero). Edit the Income/Consumption table for each period and every measure recalculates.</p>
- **Input Variables:** Period (text), Income (Y) (number), Consumption (C) (number)
- **Output Variables / Metrics:** MPC (fitted slope), MPS, APC (latest period), APS (latest period), Break-even Income
- **Curves / Visual Elements:** Data (Y, C), Fitted Consumption Line, 45° Line (C = Y)
- **Axes Definition:** X: Auto / Dependent | Y: Auto / Dependent
- **Coordinate Scale Mapping:** Dynamic / Continuous
- **Equilibrium / Calculation Logic:** Calculated from underlying model parameters
- **Movement along Curve Mechanic:** Parameter variation along fixed curve domain
- **Shift of Curve Mechanic:** Parameter transformation redrawing full curve domain
- **Interaction Mechanism:** Editable HTML Data Table / Add-Remove Rows
- **Labels & Annotations:** Plotly annotations / SVG text elements

### 31. India's Development Path: 1947 to the GST Era (`ied-five-year-plans`)
- **Class & Unit:** Class XII | Part B | Unit 6
- **Execution Mode:** `explorer`
- **Rendering Technology:** Explorer Engine (HTML Cards/Timeline)
- **Pedagogical Concept:** <p>India's economic development since Independence is a story best told as a timeline, not a formula — from a stagnant colonial economy, through decades of planned development, to a market-oriented economy after 1991. Step through each period below.</p>
- **Input Variables:** None / Static
- **Output Variables / Metrics:** Selected Era / Card State, Explanation / Pedagogical Insight
- **Curves / Visual Elements:** N/A
- **Axes Definition:** X: Auto / Dependent | Y: Auto / Dependent
- **Coordinate Scale Mapping:** Dynamic / Continuous
- **Equilibrium / Calculation Logic:** Calculated from underlying model parameters
- **Movement along Curve Mechanic:** Parameter variation along fixed curve domain
- **Shift of Curve Mechanic:** Parameter transformation redrawing full curve domain
- **Interaction Mechanism:** Clickable Timeline Eras / Concept Flashcards / Scenario Pickers
- **Labels & Annotations:** Plotly annotations / SVG text elements

### 32. Rural Development: Credit, Marketing, Cooperatives & Diversification (`ied-rural-development`)
- **Class & Unit:** Class XII | Part B | Unit 7
- **Execution Mode:** `explorer`
- **Rendering Technology:** Explorer Engine (HTML Cards/Timeline)
- **Pedagogical Concept:** <p>Rural development means raising the standard of living of the rural population, which in India is still predominantly agricultural. NCERT names several specific levers — not a single policy. Compare them below.</p>
- **Input Variables:** None / Static
- **Output Variables / Metrics:** Selected Era / Card State, Explanation / Pedagogical Insight
- **Curves / Visual Elements:** N/A
- **Axes Definition:** X: Auto / Dependent | Y: Auto / Dependent
- **Coordinate Scale Mapping:** Dynamic / Continuous
- **Equilibrium / Calculation Logic:** Calculated from underlying model parameters
- **Movement along Curve Mechanic:** Parameter variation along fixed curve domain
- **Shift of Curve Mechanic:** Parameter transformation redrawing full curve domain
- **Interaction Mechanism:** Clickable Timeline Eras / Concept Flashcards / Scenario Pickers
- **Labels & Annotations:** Plotly annotations / SVG text elements

### 33. Sustainable Economic Development (`ied-sustainable-development`)
- **Class & Unit:** Class XII | Part B | Unit 7
- **Execution Mode:** `explorer`
- **Rendering Technology:** Explorer Engine (HTML Cards/Timeline)
- **Pedagogical Concept:** <p>Development that meets today's needs can strain the resources tomorrow's generation will need. <b>Sustainable development</b> tries to grow the economy without permanently damaging that capacity. Compare the dimensions of this trade-off below.</p>
- **Input Variables:** None / Static
- **Output Variables / Metrics:** Selected Era / Card State, Explanation / Pedagogical Insight
- **Curves / Visual Elements:** N/A
- **Axes Definition:** X: Auto / Dependent | Y: Auto / Dependent
- **Coordinate Scale Mapping:** Dynamic / Continuous
- **Equilibrium / Calculation Logic:** Calculated from underlying model parameters
- **Movement along Curve Mechanic:** Parameter variation along fixed curve domain
- **Shift of Curve Mechanic:** Parameter transformation redrawing full curve domain
- **Interaction Mechanism:** Clickable Timeline Eras / Concept Flashcards / Scenario Pickers
- **Labels & Annotations:** Plotly annotations / SVG text elements

### 34. Development Comparison: India, Pakistan & China (`ied-comparison-neighbours`)
- **Class & Unit:** Class XII | Part B | Unit 8
- **Execution Mode:** `datalab`
- **Rendering Technology:** DataLab Engine (HTML Table + Plotly)
- **Pedagogical Concept:** <p>India, Pakistan and China had broadly comparable starting points around the mid-20th century but followed very different development strategies — China's state-led, export-oriented industrialisation moved earliest and fastest; India's democratic, more gradual reform path; Pakistan's more volatile growth and heavier reliance on agriculture and remittances. The table below uses illustrative figures — edit them with current World Bank/UNDP data for an exact, up-to-date comparison — but the comparison structure itself (growth, demography, sectoral structure, HDI) is exactly the one NCERT asks for.</p>
- **Input Variables:** Country (text), GDP Growth Rate (number), Population (number), Agriculture Share of GDP (number), HDI (number)
- **Output Variables / Metrics:** Highest HDI, Fastest GDP Growth, Most Agriculture-Dependent
- **Curves / Visual Elements:** GDP Growth Rate (%), HDI (×100, right axis), Agriculture Share of GDP (%, right axis)
- **Axes Definition:** X: Auto / Dependent | Y: Auto / Dependent
- **Coordinate Scale Mapping:** Dynamic / Continuous
- **Equilibrium / Calculation Logic:** Calculated from underlying model parameters
- **Movement along Curve Mechanic:** Parameter variation along fixed curve domain
- **Shift of Curve Mechanic:** Parameter transformation redrawing full curve domain
- **Interaction Mechanism:** Editable HTML Data Table / Add-Remove Rows
- **Labels & Annotations:** Plotly annotations / SVG text elements

### 35. Demand: Movement vs Shift (Drag the Curve) (`gl-demand-movement-shift`)
- **Class & Unit:** Class XI | Part B | Unit 5
- **Execution Mode:** `graphlab`
- **Rendering Technology:** GraphLab Engine (Interactive Direct-Drag SVG)
- **Pedagogical Concept:** <p>This is the single most-tested distinction in the demand chapter, and the one students lose marks on.</p><p><b>Movement along the demand curve</b> happens when — and <i>only</i> when — the good's <b>own price</b> changes. You stay on the same curve DD and slide to a different point on it. Price falls ⇒ <b>Expansion (Extension) of Demand</b>. Price rises ⇒ <b>Contraction of Demand</b>.</p><p><b>Shift of the demand curve</b> happens when a <b>non-price determinant</b> changes — income, price of substitutes or complements, tastes, expectations, number of buyers. The whole curve moves to a new position D₁D₁. Rightward ⇒ <b>Increase in Demand</b>. Leftward ⇒ <b>Decrease in Demand</b>.</p><p>The exam wording matters: a price fall is <i>never</i> "an increase in demand". Drag both kinds of control here and watch the diagram say so. Use the <b>🎬 Textbook Scenarios</b> below to predict the outcome before it applies.</p><p>💡 This lab isolates <b>demand alone, one named cause at a time</b> — the sharpest tool for this one distinction. Once you've got it, <b>"Supply &amp; Demand: Every Determinant"</b> lets you move several demand AND supply determinants together and watch the market <b>equilibrium</b> itself move.</p>
- **Input Variables:** Own Price of the Good (min:5, max:95, step:1, default:50), Consumer Income (min:-20, max:20, step:1, default:0), Price of Substitute (min:-20, max:20, step:1, default:0), Price of Complement (min:-20, max:20, step:1, default:0), Tastes & Preferences (min:-20, max:20, step:1, default:0), Number of Buyers (min:-20, max:20, step:1, default:0)
- **Output Variables / Metrics:** priceD, shift, q
- **Curves / Visual Elements:** DD (line)
- **Axes Definition:** X: Quantity Demanded (units) → (units) | Y: Price (₹ per unit) → (units)
- **Coordinate Scale Mapping:** Dynamic / Continuous
- **Equilibrium / Calculation Logic:** Nothing has changed yet — this is the original DD curve. (none)
- **Movement along Curve Mechanic:** Parameter variation along fixed curve domain
- **Shift of Curve Mechanic:** Parameter transformation redrawing full curve domain
- **Interaction Mechanism:** Direct SVG Pointer Dragging on Handles / Preset Scenario Buttons
- **Labels & Annotations:** Plotly annotations / SVG text elements

### 36. Supply: Movement vs Shift (Drag the Curve) (`gl-supply-movement-shift`)
- **Class & Unit:** Class XI | Part B | Unit 6
- **Execution Mode:** `graphlab`
- **Rendering Technology:** GraphLab Engine (Interactive Direct-Drag SVG)
- **Pedagogical Concept:** <p>Supply mirrors demand, and the same trap catches students. <b>Movement along SS</b> is caused by the good's <b>own price</b> only: price rises ⇒ <b>Expansion of Supply</b>; price falls ⇒ <b>Contraction of Supply</b>. Note the direction is <i>opposite</i> to demand, because SS slopes upward.</p><p><b>Shift of SS</b> is caused by a <b>non-price determinant</b>: input/factor prices, technology, taxes and subsidies, prices of other goods the firm could produce, the number of firms, and producer expectations. Rightward ⇒ <b>Increase in Supply</b>; leftward ⇒ <b>Decrease in Supply</b>.</p>
- **Input Variables:** Own Price of the Good (min:5, max:95, step:1, default:50), Input / Factor Cost (min:-20, max:20, step:1, default:0), Technology (improvement) (min:-20, max:20, step:1, default:0), Tax (+) / Subsidy (−) (min:-20, max:20, step:1, default:0), Number of Firms (min:-20, max:20, step:1, default:0)
- **Output Variables / Metrics:** priceD, shift, q
- **Curves / Visual Elements:** SS (line)
- **Axes Definition:** X: Quantity Supplied (units) → (units) | Y: Price (₹ per unit) → (units)
- **Coordinate Scale Mapping:** Dynamic / Continuous
- **Equilibrium / Calculation Logic:** Nothing has changed yet — this is the original SS curve. (none)
- **Movement along Curve Mechanic:** Parameter variation along fixed curve domain
- **Shift of Curve Mechanic:** Parameter transformation redrawing full curve domain
- **Interaction Mechanism:** Direct SVG Pointer Dragging on Handles / Preset Scenario Buttons
- **Labels & Annotations:** Plotly annotations / SVG text elements

### 37. Market Equilibrium: Drag DD & SS (`gl-market-equilibrium-shifts`)
- **Class & Unit:** Class XI | Part B | Unit 7
- **Execution Mode:** `graphlab`
- **Rendering Technology:** GraphLab Engine (Interactive Direct-Drag SVG)
- **Pedagogical Concept:** <p>Equilibrium is where DD cuts SS — one price at which quantity demanded equals quantity supplied. Set the market price <i>away</i> from it and the diagram shows the gap the textbook calls <b>excess demand</b> (shortage, price is pushed up) or <b>excess supply</b> (surplus, price is pushed down).</p><p>Then drag a curve. The four standard cases the exam asks for: <b>DD right</b> ⇒ P↑ Q↑ · <b>DD left</b> ⇒ P↓ Q↓ · <b>SS right</b> ⇒ P↓ Q↑ · <b>SS left</b> ⇒ P↑ Q↓. Shift both together and one of price or quantity becomes <i>indeterminate</i> — which is itself a standard exam answer.</p>
- **Input Variables:** Market Price set by you (min:5, max:95, step:1, default:47), Demand shift (income, tastes…) (min:-25, max:25, step:1, default:0), Supply shift (cost, technology…) (min:-25, max:25, step:1, default:0)
- **Output Variables / Metrics:** eqP, eqQ, gap, dShift, sShift
- **Curves / Visual Elements:** DD (line), SS (line)
- **Axes Definition:** X: Quantity (units) → (units) | Y: Price (₹ per unit) → (units)
- **Coordinate Scale Mapping:** Dynamic / Continuous
- **Equilibrium / Calculation Logic:** Price is BELOW equilibrium → <b>Excess Demand (Shortage)</b> (movement)
- **Movement along Curve Mechanic:** Parameter variation along fixed curve domain
- **Shift of Curve Mechanic:** Parameter transformation redrawing full curve domain
- **Interaction Mechanism:** Direct SVG Pointer Dragging on Handles / Preset Scenario Buttons
- **Labels & Annotations:** Plotly annotations / SVG text elements

### 38. Consumer's Equilibrium: IC + Budget Line (`gl-consumer-equilibrium-ic`)
- **Class & Unit:** Class XI | Part B | Unit 5
- **Execution Mode:** `graphlab`
- **Rendering Technology:** GraphLab Engine (Interactive Direct-Drag SVG)
- **Pedagogical Concept:** <p>The consumer is in equilibrium where the <b>budget line is tangent to the highest attainable indifference curve</b>. At that point the slope of the IC (the <b>MRS</b>) equals the slope of the budget line (the price ratio <b>Px/Py</b>), and the IC is convex to the origin.</p><p>Two conditions, both examinable: <b>(i) MRS = Px/Py</b> and <b>(ii) MRS falls</b> as more X is consumed (diminishing MRS ⇒ IC convex).</p><p>Drag the budget line: a change in <b>income</b> shifts it parallel; a change in <b>Px</b> swivels it around the Y-intercept. That difference is the whole basis for deriving the demand curve from IC analysis.</p>
- **Input Variables:** Income (M) (min:60, max:260, step:5, default:160), Price of X (Px) (min:2, max:16, step:0.5, default:5), Price of Y (Py) (min:2, max:16, step:0.5, default:5)
- **Output Variables / Metrics:** xStar, yStar, ratio, M
- **Curves / Visual Elements:** IC₁ (line), IC₂ (line), IC₃ (unattainable) (line), Budget Line (line)
- **Axes Definition:** X: Good X (units) → (units) | Y: Good Y (units) → (units)
- **Coordinate Scale Mapping:** Dynamic / Continuous
- **Equilibrium / Calculation Logic:** Equilibrium at E: <b>MRS = Px/Py = 1.00</b>, on the highest attainable IC₂ (movement)
- **Movement along Curve Mechanic:** Parameter variation along fixed curve domain
- **Shift of Curve Mechanic:** Parameter transformation redrawing full curve domain
- **Interaction Mechanism:** Direct SVG Pointer Dragging on Handles / Preset Scenario Buttons
- **Labels & Annotations:** Plotly annotations / SVG text elements

### 39. Cost Curves: AC, AVC, AFC & MC (`gl-cost-curves`)
- **Class & Unit:** Class XI | Part B | Unit 6
- **Execution Mode:** `graphlab`
- **Rendering Technology:** GraphLab Engine (Interactive Direct-Drag SVG)
- **Pedagogical Concept:** <p>The short-run cost family, and the two properties the exam always asks to prove on a diagram:</p><p><b>1.</b> <b>MC cuts both AC and AVC at their minimum points</b>, and always from below. When MC &lt; AC, AC is falling; when MC &gt; AC, AC is rising; they can only be equal where AC is at its lowest.</p><p><b>2.</b> <b>AFC falls continuously</b> and never touches the X-axis (it is a rectangular hyperbola: TFC ÷ Q). So the vertical gap between AC and AVC keeps narrowing but never closes — AC and AVC <i>approach</i> each other without meeting.</p>
- **Input Variables:** Output level shown (min:1, max:19, step:0.5, default:8), Total Fixed Cost (TFC) (min:20, max:160, step:5, default:80), Production efficiency (min:-6, max:6, step:1, default:0)
- **Output Variables / Metrics:** q, ac, mc, avc, minACq
- **Curves / Visual Elements:** AFC (line), AVC (line), AC (line), MC (line)
- **Axes Definition:** X: Output (units) → (units) | Y: Cost (₹) → (units)
- **Coordinate Scale Mapping:** Dynamic / Continuous
- **Equilibrium / Calculation Logic:** MC &lt; AC → <b>AC is still falling</b> (movement)
- **Movement along Curve Mechanic:** Parameter variation along fixed curve domain
- **Shift of Curve Mechanic:** Parameter transformation redrawing full curve domain
- **Interaction Mechanism:** Direct SVG Pointer Dragging on Handles / Preset Scenario Buttons
- **Labels & Annotations:** Plotly annotations / SVG text elements

### 40. Revenue & Producer Equilibrium (MR = MC) (`gl-revenue-producer-eq`)
- **Class & Unit:** Class XI | Part B | Unit 6
- **Execution Mode:** `graphlab`
- **Rendering Technology:** GraphLab Engine (Interactive Direct-Drag SVG)
- **Pedagogical Concept:** <p><b>Perfect competition:</b> the firm is a price-taker, so it sells any quantity at the same price. Then <b>AR = MR = price</b>, and both are a horizontal straight line; TR rises as a straight line through the origin.</p><p><b>Monopoly / imperfect competition:</b> to sell more the firm must cut price, so AR slopes downward and <b>MR falls twice as fast</b>, lying below AR. TR rises, peaks where MR = 0, then falls.</p><p><b>Producer's equilibrium</b> is where <b>MR = MC and MC is rising</b> (cutting MR from below). Both conditions are needed — MR = MC alone can also occur at a loss-maximising point where MC is falling.</p>
- **Input Variables:** Output chosen by the firm (min:1, max:19, step:0.5, default:8), Price / AR intercept (min:15, max:55, step:1, default:34), Monopoly power (AR steepness) (min:0, max:10, step:1, default:0), Cost level (min:-6, max:8, step:1, default:0)
- **Output Variables / Metrics:** q, eqQ, profit, isPC
- **Curves / Visual Elements:** AR = MR = P (line), MC (line), AC (line)
- **Axes Definition:** X: Output (units) → (units) | Y: Revenue / Cost per unit (₹) → (units)
- **Coordinate Scale Mapping:** Dynamic / Continuous
- **Equilibrium / Calculation Logic:** MR &gt; MC → the firm should <b>expand</b> output (shift)
- **Movement along Curve Mechanic:** Parameter variation along fixed curve domain
- **Shift of Curve Mechanic:** Parameter transformation redrawing full curve domain
- **Interaction Mechanism:** Direct SVG Pointer Dragging on Handles / Preset Scenario Buttons
- **Labels & Annotations:** Plotly annotations / SVG text elements

### 41. PPC: Drag the Point, Read the Opportunity Cost (`gl-ppc-drag`)
- **Class & Unit:** Class XI | Part B | Unit 4
- **Execution Mode:** `graphlab`
- **Rendering Technology:** GraphLab Engine (Interactive Direct-Drag SVG)
- **Pedagogical Concept:** <p>The <b>Production Possibility Curve</b> shows every combination of two goods an economy can produce when resources are fully and efficiently used, with given technology.</p><p><b>On the curve</b> ⇒ full and efficient use. <b>Inside</b> ⇒ resources unemployed or used inefficiently. <b>Outside</b> ⇒ unattainable with current resources.</p><p>The PPC is <b>concave to the origin</b> because the <b>Marginal Rate of Transformation (MRT)</b> — the units of Good Y sacrificed for one more unit of Good X — <b>rises</b> as more X is produced: resources are not equally suited to both goods.</p><p>A growth in resources or better technology shifts the whole PPC <b>outward</b>.</p>
- **Input Variables:** Your point: Good X (min:0, max:48, step:1, default:20), Your point: Good Y (min:0, max:48, step:1, default:25), Resources / Technology (min:-10, max:15, step:1, default:0)
- **Output Variables / Metrics:** zone, mrt, px, py, growth
- **Curves / Visual Elements:** PPC (line)
- **Axes Definition:** X: Good X (units) → (units) | Y: Good Y (units) → (units)
- **Coordinate Scale Mapping:** Dynamic / Continuous
- **Equilibrium / Calculation Logic:** ⚠ INSIDE the PPC — <b>unemployment or inefficient use</b> of resources (shift)
- **Movement along Curve Mechanic:** Parameter variation along fixed curve domain
- **Shift of Curve Mechanic:** Parameter transformation redrawing full curve domain
- **Interaction Mechanism:** Direct SVG Pointer Dragging on Handles / Preset Scenario Buttons
- **Labels & Annotations:** Plotly annotations / SVG text elements

### 42. AD–AS Equilibrium, Deficient & Excess Demand (`gl-ad-as-equilibrium`)
- **Class & Unit:** Class XII | Part A | Unit 3
- **Execution Mode:** `graphlab`
- **Rendering Technology:** GraphLab Engine (Interactive Direct-Drag SVG)
- **Pedagogical Concept:** <p>The economy is in equilibrium where <b>AD = AS</b> — where the aggregate demand line cuts the 45° line, since every point on the 45° line has AD equal to output.</p><p>Full-employment income (Y<sub>F</sub>) is a <i>separate</i> vertical line. Equilibrium need not land on it, and that is the whole point:</p><ul><li><b>Deficient demand</b> — AD cuts the 45° line <i>below</i> Y<sub>F</sub>. The vertical shortfall of AD at Y<sub>F</sub> is the <b>deflationary gap</b>. Consequence: output and employment fall, involuntary unemployment.</li><li><b>Excess demand</b> — AD would cut it <i>beyond</i> Y<sub>F</sub>, but output cannot exceed Y<sub>F</sub>. The vertical excess of AD at Y<sub>F</sub> is the <b>inflationary gap</b>. Consequence: prices rise, output does not.</li></ul><p>Note the gap is measured <b>at Y<sub>F</sub>, vertically</b> — not as the horizontal distance between the two income levels. That is the most common diagram error in the exam.</p>
- **Input Variables:** Autonomous Expenditure (C̄ + I) (min:20, max:400, step:5, default:150), MPC (b) (min:0.1, max:0.9, step:0.05, default:0.6), Full-employment income (Y_F) (min:200, max:900, step:10, default:500)
- **Output Variables / Metrics:** yStar, gap, k, mpc
- **Curves / Visual Elements:** AS (45°) (line), AD = C + I (line), Y_F (line), AD needed for Y_F (line)
- **Axes Definition:** X: Income / Output (Y) ₹ crore → (units) | Y: Aggregate Demand (AD) ₹ crore → (units)
- **Coordinate Scale Mapping:** Dynamic / Continuous
- **Equilibrium / Calculation Logic:** DEFICIENT DEMAND → <b>Deflationary Gap</b> of ₹50 crore (shift)
- **Movement along Curve Mechanic:** Parameter variation along fixed curve domain
- **Shift of Curve Mechanic:** Parameter transformation redrawing full curve domain
- **Interaction Mechanism:** Direct SVG Pointer Dragging on Handles / Preset Scenario Buttons
- **Labels & Annotations:** Plotly annotations / SVG text elements

### 43. Consumption & Saving Functions (Break-even Point) (`gl-consumption-saving`)
- **Class & Unit:** Class XII | Part A | Unit 3
- **Execution Mode:** `graphlab`
- **Rendering Technology:** GraphLab Engine (Interactive Direct-Drag SVG)
- **Pedagogical Concept:** <p>The <b>consumption function</b> C = C̄ + bY has a positive intercept: even at zero income people consume C̄ by drawing on past savings (dissaving). The <b>saving function</b> is its mirror: S = Y − C = −C̄ + (1−b)Y.</p><p>The <b>break-even point</b> is where the C line cuts the 45° line: there C = Y, so <b>S = 0</b> and <b>APC = 1</b>. Left of it the economy dissaves (S is negative, APC > 1); right of it it saves.</p><p>Four ratios the exam asks to compute and relate: <b>APC + APS = 1</b> and <b>MPC + MPS = 1</b>. APC can exceed 1 (at low income); MPC cannot exceed 1 and cannot be negative.</p>
- **Input Variables:** Autonomous Consumption (C̄) (min:10, max:200, step:5, default:60), MPC (b) (min:0.1, max:0.95, step:0.05, default:0.7), Income level shown (Y) (min:20, max:580, step:10, default:300)
- **Output Variables / Metrics:** apc, aps, s, be, y
- **Curves / Visual Elements:** 45° (C = Y) (line), C = C̄ + bY (line), S = −C̄ + (1−b)Y (line), zero (line)
- **Axes Definition:** X: Income (Y) ₹ crore → (units) | Y: Consumption / Saving ₹ crore → (units)
- **Coordinate Scale Mapping:** Dynamic / Continuous
- **Equilibrium / Calculation Logic:** Above break-even → <b>saving</b>: S = ₹30 cr and <b>APC = 0.90 &lt; 1</b> (movement)
- **Movement along Curve Mechanic:** Parameter variation along fixed curve domain
- **Shift of Curve Mechanic:** Parameter transformation redrawing full curve domain
- **Interaction Mechanism:** Direct SVG Pointer Dragging on Handles / Preset Scenario Buttons
- **Labels & Annotations:** Plotly annotations / SVG text elements

### 44. Exchange Rate: Drag Demand & Supply of Forex (`gl-forex-determination`)
- **Class & Unit:** Class XII | Part A | Unit 5
- **Execution Mode:** `graphlab`
- **Rendering Technology:** GraphLab Engine (Interactive Direct-Drag SVG)
- **Pedagogical Concept:** <p>Under a <b>flexible (floating)</b> system the exchange rate is set where the <b>demand for foreign exchange</b> meets its <b>supply</b>.</p><p><b>Demand for forex</b> comes from imports, foreign travel, sending gifts/remittances abroad, and investing abroad — it slopes <b>downward</b>: a dearer dollar makes imports costlier, so less forex is demanded.</p><p><b>Supply of forex</b> comes from exports, foreign tourists, remittances received, and foreign investment coming in — it slopes <b>upward</b>: a dearer dollar makes Indian goods cheaper to foreigners, so more forex flows in.</p><p><b>Depreciation</b> = the rupee falls (₹/$ rises) under market forces. <b>Devaluation</b> is the same direction but done deliberately by the government under a fixed system — an exam distinction worth a mark.</p>
- **Input Variables:** Demand for forex (imports, travel, investing abroad) (min:-25, max:25, step:1, default:0), Supply of forex (exports, FDI/FII inflow, remittances) (min:-25, max:25, step:1, default:0), Rate set by you (₹ per $) (min:45, max:115, step:1, default:80)
- **Output Variables / Metrics:** rate, dRate, gap, traded
- **Curves / Visual Elements:** D (forex demand) (line), S (forex supply) (line)
- **Axes Definition:** X: Quantity of Foreign Exchange (US $ million) → (units) | Y: Exchange Rate (₹ per US $) → (units)
- **Coordinate Scale Mapping:** Dynamic / Continuous
- **Equilibrium / Calculation Logic:** Foreign-exchange market is in <b>equilibrium</b> (none)
- **Movement along Curve Mechanic:** Parameter variation along fixed curve domain
- **Shift of Curve Mechanic:** Parameter transformation redrawing full curve domain
- **Interaction Mechanism:** Direct SVG Pointer Dragging on Handles / Preset Scenario Buttons
- **Labels & Annotations:** Plotly annotations / SVG text elements

---

## 4. RECOMMENDATIONS & SAFE UPGRADE SEQUENCE

### 4.1 Recommended Technology Map
1. **SVG (Default for Precision Diagrams & Graph Labs):** Use SVG for high-precision 2D diagrams requiring arrow axes, curve labels, intersection markers, dotted projections, and direct pointer dragging.
2. **Plotly.js / Canvas (Statistical Labs & Continuous Function Sweeps):** Retain Plotly/Canvas for multi-data scatter plots, histograms, time-series data labs, and high-frequency parameter sweeps.
3. **WebGL / Three.js (Optional 3D Spatial Visualizations):** Reserve WebGL exclusively for 3D production functions, utility surfaces, or spatial market trade models where 3D spatial rotation genuinely enhances economic intuition.

### 4.2 Safe Implementation Sequence
1. **Reference Architecture Validation:** Preserve `gl-demand-movement-shift` and `gl-market-equilibrium-shifts` as the baseline standard for Graph Lab direct-drag interactivity and verdict banners.
2. **Dynamic Range & Domain Padding Polish:** Standardize Plotly axis auto-scaling across all Class XI Microeconomics and Class XII Macroeconomics simulators to prevent clipping during extreme parameter shifts.
3. **Expansion of PREDICT & TLM Systems:** Incrementally extend PREDICT prediction gates and Teaching & Learning Toolkit cards to all remaining 39 simulation modules.
4. **Continuous Automated Verification:** Enforce `npm run verify` after every individual module update to guarantee zero regressions across software and economic correctness checks.
