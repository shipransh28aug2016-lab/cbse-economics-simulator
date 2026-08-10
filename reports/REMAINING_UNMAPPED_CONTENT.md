# List of Remaining Unmapped Content

`reports/SYLLABUS_COVERAGE_REPORT.md` shows **59 / 59 syllabus Topics (100%)** have at least one covering
Simulator, Data Lab or Concept Explorer. That number is real, but it's measured at the *Topic* granularity
(the `###`-level headings in `curriculum/Economics_2026-27_Content_MicroContent_Taxonomy.md`). This report
goes one level more honest: what, within a "covered" topic, is still only *referenced* rather than
independently interactive — and what was deliberately left out of scope.

## 1. Named sub-items covered at "referenced" depth, not independent interactivity

These topics have a real, working lab — but a specific *named sub-item* inside them is explained in the
concept text rather than being its own control the student can manipulate:

| Topic | Covering lab | What's fully interactive | What's referenced-only |
|---|---|---|---|
| Index Numbers (Unit 3, Stats) | `stats-index-numbers` | Simple Aggregative Method on a student-edited commodity basket | WPI, CPI and IIP are *named and explained*, but the lab builds one generic index — it doesn't reproduce the separate weighted-basket construction each of those three specific official indices actually uses |
| Money and Banking (Unit 2, Macro) | `macro-money-creation` | Legal Reserve Ratio → money multiplier | CRR and SLR are modelled (they *are* the Legal Reserve Ratio lever); Repo Rate, Reverse Repo Rate, Bank Rate and Open Market Operations are named and their direction of effect explained, but only as text — the interactive model has one lever, not five |
| Collection of Data (Unit 2, Stats) | `stats-data-collection` | Primary vs secondary, sampling vs census — as a scenario explorer | Census of India and NSSO are named as concrete examples, not modelled as distinct tools with their own data |
| Balance of Payments (Unit 5, Macro) | `macro-forex` | Flexible/floating exchange rate determination, plus a merits/demerits comparison in text | Fixed and Managed Floating regimes are *named, defined and evaluated in prose*; only the flexible-rate case has a live demand/supply model (a fixed rate is, by definition, administratively set rather than market-cleared, so there's no equivalent "diagram to explore" for it) |
| Government Budget (Unit 4, Macro) | `macro-govt-budget` | Revenue/Fiscal/Primary Deficit computed live from entered receipts & expenditure | The budget's stated *objectives* (reallocation, redistribution, stability) are prose, not a separate interactive |

None of these are silently hidden — each lab's own `concept` text says so, and the sim explicitly lists the
node as covered because the syllabus's own "Definition/Institution" content type (see the taxonomy's §28
Content Type Taxonomy) doesn't require a dedicated simulator to be genuinely taught.

## 2. Content flagged `enrichment: true` — present, but outside the 2026-27 topic list as supplied

Four existing labs (carried over from the pre-2026-27 version of this app) teach real, standard economics
content that this specific taxonomy document does not name as a topic for that unit. Each is kept (useful,
correct economics) but excluded from the "core coverage" count and clearly labelled in-app:

- **`micro-market-structures`** (Monopoly → Oligopoly → Perfect Competition spectrum) — Class XI Unit 7 is
  explicitly scoped by the taxonomy to *"Perfect Competition — Price Determination and Simple Applications"*
  with a stated *"Short-run analysis only"* limitation; Monopoly/Oligopoly/Monopolistic Competition aren't
  named Class XI Microeconomics topics in this document.
- **`stats-dispersion`** (Range, Quartile Deviation, SD, CV) — Unit 3's topic list is Central Tendency,
  Correlation and Index Numbers only; Dispersion isn't itemized separately in this taxonomy.
- **`india-poverty`** (Poverty line, Lorenz curve, Gini) — Class XII Unit 7 (Current Challenges) lists Human
  Capital Formation, Rural Development, Employment and Sustainable Development; Poverty isn't named as a
  standalone Unit 7 topic in this document.
- **`macro-multiplier`**'s Government Spending and Tax multipliers — Unit 3 names the Investment Multiplier
  specifically; the other two are kept as contrast, not claimed as separately-named core content.

Per the taxonomy's own Alignment Rule #14 ("avoid introducing content outside the stated syllabus unless
explicitly labelled as enrichment"), all four carry `enrichment: true` and a specific `enrichmentNote` in
`js/simulations*.js`, and render a visible "✨ Enrichment" tag in the app itself — this is a live, checked
property (`tools/test-curriculum.js` asserts every `enrichment: true` sim has a real, non-trivial note), not
just a claim in this document.

## 3. Deliberately out of scope

- **Part C — Project Work** (20 marks, both classes). Per Alignment Rule #11 ("keep project work distinct
  from theory content"), this integration did not build project-topic scaffolding — the taxonomy's own
  Project Objectives/Checklist/Marking Scheme (§11, §22–25) describe an independent research deliverable,
  not an interactive concept to simulate. This is a deliberate exclusion, not an oversight.
- **Exact current-year statistics.** `ied-comparison-neighbours` and `india-poverty` ship editable,
  clearly-labelled *illustrative* starting figures rather than a live official data feed (World
  Bank/UNDP/NSSO). The taxonomy's own Alignment Rule #15 asks that syllabus concept and contemporary example
  be kept visibly separate — this app leans toward "keep the concept correct, let the teacher/student swap in
  the current figure" rather than embedding a number that will silently go stale.

## 4. Pre-existing app features, unrelated to curriculum mapping, left untouched

- Hindi translation (`js/i18n_engine.js`, `js/i18n_hi.js`) — stub, toggles a button label only.
- Quiz question bank, XP system, Badges, Profile progress rings — UI-complete, content/tracking placeholders.

These predate this integration pass and are outside "map the curriculum to working learning experiences" —
see `reports/QA_REGRESSION_REPORT.md`'s "Pre-existing, out-of-scope items" section.

## Bottom line

Every one of the 59 syllabus Topics has a real, tested, interactive home. The gaps that remain are at a finer
grain than the coverage matrix's own unit of measurement — a handful of *named instruments/indices* explained
in text rather than each getting a dedicated control, four legacy labs correctly relabelled as enrichment
rather than silently counted as core, and Project Work left alone because the syllabus itself treats it as a
different kind of deliverable. None of this was found by omission — it's exactly what
`tools/test-curriculum.js`'s coverage/enrichment checks were built to surface.
