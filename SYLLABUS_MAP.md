# CBSE Class XI–XII Economics — Syllabus Map & Simulation Coverage

**Purpose:** a full breakdown of the CBSE Economics curriculum (both books, both classes), cross-referenced against what EconSim Pro's 18 simulations actually cover — so gaps are visible and honest, not implied away.

**A necessary caveat, stated plainly:** the chapter/topic structure below reflects the long-standing, well-established CBSE Economics curriculum. CBSE revises specific sub-topic inclusions/exclusions periodically (the post-2020 "rationalisation" round, for instance, trimmed several topics). This map has **not** been checked against an official 2026–27 CBSE circular — that document should be the final authority before treating any row below as exam-scope-confirmed. Treat "✅ Covered" as "covered relative to this map," not as a guarantee of official 2026–27 alignment.

**Coverage key:** ✅ Interactive (a control drives a live computation/chart for it) · 📖 Referenced (named and explained in the sim's text, not independently interactive) · ❌ Not covered by any simulation.

---

## Class XI — Statistics for Economics

| Chapter | Topic / Sub-topic | Coverage |
|---|---|---|
| 1. Introduction | Economics & its scope; role of statistics in economics | 📖 general framing only |
| 2. Collection of Data | Primary vs secondary data; census vs sample; sampling methods | ❌ |
| 3. Organisation of Data | Classification, variables, frequency distribution | ❌ |
| 4. Presentation of Data | Tabulation; bar diagrams, pie diagrams, histogram, frequency polygon, ogive | ❌ |
| 5. Measures of Central Tendency | Mean, Median, Mode, Partition values (Quartiles) | ❌ (not modeled by any sim) |
| 6. Measures of Dispersion | Range, Coefficient of Range, Quartile Deviation, Mean Deviation | ✅ Range, Coefficient of Range & Quartile Deviation all computed live in `stats-dispersion` (Mean Deviation still not modeled) |
| | Standard Deviation, Coefficient of Variation | ✅ `stats-dispersion` |
| | Lorenz Curve (dispersion/inequality application) | ✅ `india-poverty` |
| 7. Correlation | Scatter diagram; Karl Pearson's Coefficient of Correlation | ✅ `stats-correlation` |
| | Spearman's Rank Correlation | 📖 formula referenced in `stats-correlation`, not independently interactive (ranked/ordinal data needs a different UI than a continuous scatter — flagged as a real gap, not silently merged in) |
| 8. Index Numbers | Meaning, types (price/quantity/value), construction, uses, limitations | ✅ `stats-index-numbers` (price index, compounding) |
| | Inflation and Index Numbers | ✅ `stats-index-numbers` |

## Class XI — Indian Economic Development

| Chapter | Topic / Sub-topic | Coverage |
|---|---|---|
| 1. Indian Economy on the Eve of Independence | Colonial economy structure, agriculture/industry/foreign trade/demography under British rule | ❌ |
| 2. Indian Economy 1950–1990 | Planning goals, agriculture (Green Revolution), industry & trade policy (IMS, import substitution) | ❌ |
| 3. Liberalisation, Privatisation & Globalisation | 1991 reforms, LPG policies, outcomes | ❌ |
| 4. Poverty | Poverty line concept, calorie-based method, headcount ratio | ✅ **now interactive** — `india-poverty` has a Poverty Line (₹/month) slider that computes a live Headcount Ratio (% of population below it), derived from the same Lorenz-curve inequality model so the two aren't disconnected numbers. Explicitly labeled "illustrative" since it's a simplified distribution, not official Tendulkar/Rangarajan-committee data. |
| | Income inequality (Lorenz Curve, Gini Coefficient) | ✅ `india-poverty` — flagged in this sim's own chapter tag as a supplementary analytical tool, since Lorenz/Gini aren't the NCERT chapter's central method |
| 5. Human Capital Formation | Sources: Education AND Health (+ on-job training, migration) | ✅ **now dual-factor** — `india-human-capital` models Education Spending → Literacy and Health Spending → Life Expectancy as two independent tracks, since NCERT treats them as separate (not interchangeable) sources |
| 6. Rural Development | Credit, marketing, diversification, sustainable development, organic farming | ❌ |
| 7. Employment | Formal vs informal sector; workforce categories (self-employed, regular salaried, casual labour); types of unemployment (disguised, seasonal, open, structural) | 📖 **now enriched** — Formal/Informal sector split added as a toggle-able view in `india-employment-structure`, which previously modeled only the Agriculture/Industry/Services axis and never actually addressed "informalisation" despite it being in the sim's own title |
| | Structural transformation of employment across sectors | ✅ `india-employment-structure` |
| 8. Infrastructure | Meaning, types (economic/social), state in India, energy, health | ❌ |
| 9. Environment & Sustainable Development | Environmental degradation, sustainable development strategies | ❌ |
| 10. Comparative Development (India/Pakistan/China) | *(this chapter has been dropped/re-added across different CBSE rationalisation rounds — verify current status)* | ❌ |

## Class XII — Introductory Microeconomics

| Chapter | Topic / Sub-topic | Coverage |
|---|---|---|
| 1. Introduction | Central problems of an economy, PPC, positive vs normative economics | ❌ |
| 2. Consumer Equilibrium & Demand | Utility approach: TU, MU, Law of Diminishing Marginal Utility, consumer equilibrium (MU=0 / MUx/Px=MUy/Py) | ✅ `micro-consumer-equilibrium` — **now also models Price and MU-per-Rupee (MU/P)**, the actual multi-good equilibrium comparison, not just the single-good MU=0 special case |
| | Indifference Curve approach: budget line, IC properties, consumer equilibrium (MRS = price ratio) | ❌ — **a real, flagged gap.** The existing sim only models the cardinal utility approach; NCERT Ch.2 presents both approaches side by side. Adding a genuine IC/budget-line interactive diagram is a distinct, non-trivial visualization (2D indifference-map + budget line + tangency) that deserves its own follow-up rather than being bolted onto the existing MU sim. |
| | Demand determinants: income, price of related goods (substitutes/complements), tastes | ✅ **fully decomposed** — `micro-supply-demand` now has four separate named demand-side controls (Consumer Income, Price of Substitute, Price of Complement, Tastes & Preferences) instead of one abstract "shift" number, each visibly moving its own curve |
| | Price elasticity of demand + its determinants (substitutes, necessity/luxury, income share, time) | ✅ `micro-elasticity` — **substitutes now modeled**: a "Number of Close Substitutes" control directly changes the demand slope, so students see more substitutes → more elastic demand (verified: Ed magnitude rises from 0.32 to 1.78 across the slider's range) |
| | Income elasticity of demand | ✅ `micro-elasticity` elasticity-type selector (Price / Income / Cross) |
| | Cross elasticity of demand | ✅ same selector |
| 3. Producer Behaviour & Supply | Production function, Total/Average/Marginal Product, Law of Variable Proportions (Returns to a Factor) | ✅ `micro-producer-costs` Product/Cost view toggle — verified MP crosses AP exactly at AP's peak |
| | Costs: TC, TFC, TVC, AC, AVC, MC and their relationships | ✅ `micro-producer-costs` — **Fixed Cost is now its own control** (previously hardcoded), showing how FC raises AC at every output level without ever touching MC |
| | Revenue: TR, AR, MR | ❌ (not modeled) |
| | Producer's equilibrium (MR = MC) | 📖 referenced via the Market Structures sim's MR=MC formula, not independently interactive here |
| | Supply determinants: input/factor cost, technology, govt. tax/subsidy | ✅ **now added** — `micro-supply-demand` has three named supply-side controls (Input/Factor Cost, Technology, Govt. Tax/Subsidy), each moving the supply curve in the economically correct direction |
| | Price elasticity of supply | ❌ (not separately modeled) |
| 4. Forms of Market & Price Determination | Perfect competition, Monopoly, Monopolistic competition, Oligopoly (features) | ✅ **now a continuous spectrum** — `micro-market-structures` uses the Cournot model with a Number-of-Firms control, so moving one slider sweeps from Monopoly (N=1) through Oligopoly and Monopolistic Competition to Near-Perfect Competition, instead of only showing the two extremes |
| | Price determination under perfect competition, shifts in demand/supply | ✅ `micro-supply-demand` |
| | Simple applications: price ceiling, price floor | ✅ `micro-price-controls` — **now also has a Market Demand Conditions control**, so shortage/surplus size responds to market conditions, not just the government's chosen control price |

## Class XII — Introductory Macroeconomics

| Chapter | Topic / Sub-topic | Coverage |
|---|---|---|
| 1. Introduction | Consumption vs capital goods, stock vs flow, gross investment vs depreciation | ❌ |
| | Circular flow of income; real flow vs money flow | ✅ `macro-gdp` — this is the sim rebuilt earlier in this project specifically to correct its real-flow/money-flow direction and label every transaction |
| 2. National Income & Related Aggregates | GDP, GNP, NDP, NNP (market price & factor cost), National Disposable Income, Personal/Private Income | 📖 **now enriched** — definitions and relationships added to `macro-gdp`'s concept text (the sim itself visualizes the circular flow, not aggregate calculation, so this is textual coverage, not a calculator) |
| | Methods of calculating National Income (value added, income, expenditure) | ❌ |
| 3. Money & Banking | Functions of money, demand for/supply of money | ❌ |
| | Money creation by the commercial banking system | ✅ `macro-money-creation` |
| | Central bank functions; monetary policy instruments: CRR, SLR, Repo Rate, Reverse Repo, Bank Rate, OMO | 📖 **now enriched** — named and explained in `macro-money-creation`'s concept text; the sim's interactive model (a single reserve-ratio lever) still only mirrors CRR mechanically — SLR/Repo/Bank Rate/OMO are referenced, not separately interactive |
| 4. Determination of Income & Employment | Aggregate Demand & Aggregate Supply, propensity to consume/save | ✅ `macro-multiplier` |
| | Investment multiplier, Government Spending multiplier, Tax multiplier | ✅ **all three now modeled** — `macro-multiplier` has separate ΔI, ΔG and ΔT controls, with the correct relationship enforced (spending multiplier = 1/(1−MPC) applies equally to I and G; tax multiplier = −MPC/(1−MPC) is smaller and opposite-signed) |
| | Excess demand & deficient demand, inflationary/deflationary gap, correcting policies | ✅ `macro-inflation-gap` — **AD is now decomposed into its four named components** (ΔC, ΔI, ΔG, ΔNX per AD = C+I+G+(X−M)) instead of one abstract shift, with a "biggest mover" readout |
| 5. Government Budget & the Economy | Objectives, Revenue/Capital Receipts, Revenue/Capital Expenditure | ✅ `macro-govt-budget` |
| | Revenue Deficit, Fiscal Deficit, Primary Deficit | ✅ `macro-govt-budget` computes all three, with its own Interest Payments control driving Primary Deficit |
| 6. Balance of Payments | BoP account structure: current account, capital account | ✅ **now modeled directly** — `macro-forex` has four named controls (Imports, Exports, Capital Outflow, Capital Inflow) mapped explicitly to the Current Account and Capital Account, each shown as its own reading, instead of one unlabeled "shift" |
| | Foreign exchange rate: determination under a flexible system | ✅ `macro-forex` |
| | Fixed exchange rate & managed floating systems | 📖 named and distinguished in `macro-forex`'s concept text; the interactive model still only demonstrates the flexible/market-determined case (a fixed rate has no meaningful demand/supply diagram to explore, since it's administratively set rather than market-cleared) |

---

## Honest summary

- **18 of 18 simulations remain economically accurate and CBSE-chapter-tagged.**
- **A second, deeper pass (this revision) decomposed abstract "shift" sliders into every named CBSE determinant, across 12 of the 18 simulations** — not a token gesture on one or two, per the explicit request to go deep on all of them:
  - `micro-supply-demand`: the flagship example — one abstract "Demand Shift" slider replaced with **7 named factors** (4 demand determinants: Income, Price of Substitute, Price of Complement, Tastes; 3 supply determinants: Input Cost, Technology, Govt. Tax/Subsidy), each moving its own curve independently, with a live "biggest mover" readout.
  - `micro-elasticity`: Number of Close Substitutes now drives elasticity magnitude directly (verified Ed rises from 0.32 to 1.78 across its range).
  - `micro-consumer-equilibrium`: added Price and MU-per-Rupee (the real multi-good equilibrium comparison, not just MU=0).
  - `micro-producer-costs`: Fixed Cost is now its own control instead of a hardcoded constant.
  - `micro-price-controls`: added a Market Demand Conditions control so shortage/surplus responds to market conditions, not just the ceiling/floor price alone.
  - `micro-market-structures`: rebuilt on the Cournot model with a Number-of-Firms control — now a continuous spectrum across Monopoly → Oligopoly → Monopolistic Competition → Near-Perfect Competition, instead of only the two extremes.
  - `macro-multiplier`: added the Government Spending multiplier and Tax multiplier alongside the existing Investment multiplier, all three correctly related (k for I and G, −MPC/(1−MPC) for T).
  - `macro-inflation-gap`: AD decomposed into its four textbook components (ΔC, ΔI, ΔG, ΔNX) instead of one abstract shift.
  - `macro-forex`: decomposed into Imports/Exports/Capital Outflow/Capital Inflow, explicitly mapped to the Current Account and Capital Account.
  - `macro-govt-budget`: added Primary Deficit with its own Interest Payments control.
  - `india-poverty`: added an interactive Poverty Line slider computing a live Headcount Ratio, mathematically derived from the same Lorenz-curve model (not a disconnected number) — verified across a grid of inputs with no NaN/out-of-range results.
  - `india-human-capital`: added Health Spending as a second, independent source of human capital alongside Education Spending.
  - `stats-dispersion`: added Coefficient of Range alongside Range and Quartile Deviation.
- **Real, unclosed gaps**, listed rather than hidden: Collection/Organisation/Presentation of Data (Ch. 2–4, Statistics), Central Tendency measures, Mean Deviation, five whole Indian Economic Development chapters (Eve of Independence, 1950–90, LPG, Rural Development, Infrastructure, Environment & Sustainable Development), the Indifference Curve approach to consumer equilibrium, Revenue curves (TR/AR/MR), elasticity of supply, and modeling a fixed exchange-rate regime. None of these were force-fit into an existing simulation just to claim coverage — several (e.g. Collection/Presentation of Data, the IC/budget-line diagram) are substantial enough to warrant their own dedicated simulation rather than a bolt-on to an unrelated one, and are left honestly marked ❌ rather than papered over.
