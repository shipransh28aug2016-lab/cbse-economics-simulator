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
| 6. Measures of Dispersion | Range, Quartile Deviation, Mean Deviation | 📖 **now enriched** — Range & Quartile Deviation added to `stats-dispersion` readings |
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
| 4. Poverty | Poverty line concept & calorie-based method, absolute vs relative poverty, poverty estimates, causes, government programmes | 📖 **now enriched** — poverty-line methodology added to `india-poverty` concept text (previously jumped straight to Lorenz/Gini without covering the chapter's actual core method) |
| | Income inequality (Lorenz Curve, Gini Coefficient) | ✅ `india-poverty` — flagged in this sim's own chapter tag as a supplementary analytical tool, since Lorenz/Gini aren't the NCERT chapter's central method |
| 5. Human Capital Formation | Meaning, sources (education, health, on-job training), Human Development Index context | ✅ `india-human-capital` (education spending → literacy, illustrative) |
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
| 2. Consumer Equilibrium & Demand | Utility approach: TU, MU, Law of Diminishing Marginal Utility, consumer equilibrium (MU=0 / MUx/Px=MUy/Py) | ✅ `micro-consumer-equilibrium` |
| | Indifference Curve approach: budget line, IC properties, consumer equilibrium (MRS = price ratio) | ❌ — **a real, flagged gap.** The existing sim only models the cardinal utility approach; NCERT Ch.2 presents both approaches side by side. Adding a genuine IC/budget-line interactive diagram is a distinct, non-trivial visualization (2D indifference-map + budget line + tangency) that deserves its own follow-up rather than being bolted onto the existing MU sim. |
| | Demand: meaning, determinants, law of demand, movement vs shift | ✅ `micro-supply-demand` |
| | Price elasticity of demand | ✅ `micro-elasticity` |
| | Income elasticity of demand | ✅ **now added** — `micro-elasticity` has an elasticity-type selector (Price / Income / Cross) |
| | Cross elasticity of demand | ✅ **now added** — same selector |
| 3. Producer Behaviour & Supply | Production function, Total/Average/Marginal Product, Law of Variable Proportions (Returns to a Factor) | ✅ **now added** — `micro-producer-costs` has a Product/Cost view toggle; previously this sim only modeled AC/MC and never touched TP/AP/MP at all |
| | Costs: TC, TFC, TVC, AC, AVC, MC and their relationships | ✅ `micro-producer-costs` |
| | Revenue: TR, AR, MR | ❌ (not modeled) |
| | Producer's equilibrium (MR = MC) | 📖 referenced via the Market Structures sim's MR=MC formula, not independently interactive here |
| | Supply: law of supply, determinants, price elasticity of supply | ❌ (supply curve appears as a fixed line in `micro-supply-demand`/`micro-price-controls`, but elasticity of *supply* isn't separately modeled) |
| 4. Forms of Market & Price Determination | Perfect competition, Monopoly, Monopolistic competition, Oligopoly (features) | ✅ `micro-market-structures` (Perfect Competition vs Monopoly interactively; Monopolistic Competition/Oligopoly described conceptually only) |
| | Price determination under perfect competition, shifts in demand/supply | ✅ `micro-supply-demand` |
| | Simple applications: price ceiling, price floor | ✅ `micro-price-controls` |

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
| | Short-run equilibrium, investment multiplier | ✅ `macro-multiplier` |
| | Excess demand & deficient demand, inflationary/deflationary gap, correcting policies | ✅ `macro-inflation-gap` |
| 5. Government Budget & the Economy | Objectives, Revenue/Capital Receipts, Revenue/Capital Expenditure | ✅ `macro-govt-budget` |
| | Revenue Deficit, Fiscal Deficit | ✅ `macro-govt-budget` |
| | Primary Deficit | ✅ **now added** — `macro-govt-budget` computes Primary Deficit = Fiscal Deficit − Interest Payments |
| 6. Balance of Payments | BoP account structure: current account, capital account | ❌ |
| | Foreign exchange rate: determination under a flexible system | ✅ `macro-forex` |
| | Fixed exchange rate & managed floating systems | 📖 **now enriched** — named and distinguished in `macro-forex`'s concept text; the interactive model still only demonstrates the flexible/market-determined case (a fixed rate has no meaningful demand/supply diagram to explore, since it's administratively set rather than market-cleared) |

---

## Honest summary

- **18 of 18 simulations remain economically accurate and CBSE-chapter-tagged** (unchanged from the prior validation pass).
- **6 simulations gained a genuinely new interactive dimension** in this pass: `micro-elasticity` (3 elasticity types instead of 1), `micro-producer-costs` (Product/Returns view), `stats-dispersion` (Range + Quartile Deviation), `macro-govt-budget` (Primary Deficit), `india-employment-structure` (Formal/Informal sector view), `india-poverty` (poverty-line methodology).
- **5 simulations gained named-terminology text coverage** without new interactive controls: `macro-gdp` (GDP/GNP/NDP/NNP definitions), `macro-money-creation` (CRR/SLR/Repo/Bank Rate/OMO), `macro-forex` (fixed/managed-float systems), `stats-correlation` (Spearman's Rank).
- **Real, unclosed gaps**, listed rather than hidden: Collection/Organisation/Presentation of Data (Ch. 2–4, Statistics), Central Tendency measures, five whole Indian Economic Development chapters (Eve of Independence, 1950–90, LPG, Rural Development, Infrastructure, Environment & Sustainable Development), the Indifference Curve approach to consumer equilibrium, Revenue curves (TR/AR/MR) and elasticity of supply, and the BoP account structure. None of these were force-fit into an existing simulation just to claim coverage — several (e.g. Collection/Presentation of Data, the IC/budget-line diagram) are substantial enough to warrant their own dedicated simulation rather than a bolt-on to an unrelated one.
