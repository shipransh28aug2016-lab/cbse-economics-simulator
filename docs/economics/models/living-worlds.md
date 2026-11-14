# The Living Economy — worked models

`js/life-engine.js` · `js/life-worlds-micro.js` · `js/life-worlds-macro.js` · tests: `tools/test-life.js`

A Living World puts the student in a role and lets a concept be **named after it has been
felt**. Each world is one small textbook model. This file states every model's rule in one
sentence, the assumptions it leans on, and the test that holds it to that rule — the same
form as the November 2026 audit (`docs/economics/validation/audit-2026-11.md`).

Three rules apply to all six:

1. **The reveal is not a second model.** The curve drawn in the debrief is the function
   that generated the student's data (`world.truth`). Where there is noise, the test checks
   that realised outcomes average to that curve.
2. **An insight is a claim about the student's own history.** `holds` is computed from the
   rounds they played. It is shown as *lived* only then; otherwise as *not yet lived*, with
   something to try. Every world has a test with a run that must **not** earn an insight.
3. **A gut call is graded by the model**, from the outcome or from a counterfactual fixed
   *before* `step()` runs (a closure that reads `state` lazily reads the state *after* the
   decision — `finance-minister` had exactly this bug until a test caught it).

---

## 1. Chai stall — `chai-stall` (XI · Part B · Units 5–6)

**Rule.** 100 passers-by each have a most-they-will-pay; with those limits spread evenly
from ₹0 to ₹25, expected demand is the straight line `Q = 4 × (25 + shift − P)`.

| | Ordinary day | Cold wave (days 6–7) | Costly milk (days 8–10) |
|---|---|---|---|
| Demand | `Q = 100 − 4P` | `Q = 124 − 4P` (shift +₹6) | `Q = 100 − 4P` |
| MC = AVC | ₹5 | ₹5 | ₹9 |
| MR | `25 − Q/2` | `31 − Q/2` | `25 − Q/2` |
| MR = MC at | Q = 40, **P = ₹15** | Q = 52, **P = ₹18** | Q = 32, **P = ₹17** |
| Unit-elastic price | ₹12.50 | ₹15.50 | ₹12.50 |

Fixed cost ₹150/day. Each person's limit moves by up to ±₹2 on the day (seeded), so a day's
sales scatter around the line by about ±1.6 cups.

**Assumptions.** One seller with a local monopoly (it is the only stall at the gate), so
choosing a price is choosing an output. Constant marginal cost: the second-order condition
"MC cuts MR from below" holds because MR is falling — the general condition recorded in
`producer-equilibrium.md`, not "MC is rising". The slider runs ₹8–₹22 so that the noise
never reaches the ends of the willingness-to-pay range, where the expected line would bend.

**What the debrief may claim, and when.** Law of demand (two different prices on the same
kind of day, fewer cups at the higher). Shift vs movement (a cold-wave day at the **same or
a higher** price than an ordinary day that still sold more — never a lower price, or part
of the gain would be a movement). Elasticity by total expenditure (a pair wholly on one
side of the unit-elastic price). Revenue ≠ profit. MR = MC. A cost shock moves MC, not
demand.

**Tests (`testLifeChai`).** Demand falls at every price; the reveal's line is the inverse of
the model's demand; `best()` is the slider's profit maximum and has MR = MC exactly, with
MR > MC before and < after; revenue rises below the unit-elastic price and falls above;
the cold wave raises demand at every price; dearer milk changes demand at none; cups
actually sold average to the line (400 draws × 15 price/regime points); charging the best
price earns the benchmark on average (so 100% is the true ceiling).

## 2. Tomato mandi — `mandi` (XI · Part B · Unit 7)

**Rule.** Market demand `Qd = a − 5P` and supply `Qs = c + 7P` cross at the price every
seller must take; one seller's 10 kg changes nothing.

| Days | Event | a | c | P\* | Q\* |
|---|---|---|---|---|---|
| 1–3 | ordinary | 300 | −60 | ₹30 | 150 |
| 4–5 | bumper crop (supply ↑) | 300 | 0 | ₹25 | 175 |
| 6–7 | wedding season (demand ↑) | 360 | −60 | ₹35 | 185 |
| 8–9 | ceiling ₹24 on ordinary curves | | | ₹24 | Qd 180, Qs 108 → shortage 72 |
| 10 | floor ₹36 on ordinary curves | | | ₹36 | Qd 120, Qs 192 → surplus 72 |

A seller asking above the going price sells nothing; at or below it, everything (so asking
less only gives money away). Under the floor each seller sells the share `Qd/Qs` of stock.

**Assumptions.** Homogeneous good, perfect knowledge, very many sellers. Stock is
perishable, so unsold tomatoes are a pure loss. Proportional rationing under a surplus is an
illustration of "more is offered than is bought", not a claim about how real mandis ration.

**Tests (`testLifeMandi`).** Qd = Qs at P\* in every regime; excess supply above it, excess
demand below; no asking price beats the market price; supply ↑ ⇒ P↓ Q↑; demand ↑ ⇒ P↑ Q↑;
a binding ceiling gives shortage = Qd − Qs, a binding floor gives surplus = Qs − Qd; with no
control neither exists. A seller who always matched the rate is **not** told they discovered
price-taking.

## 3. Pocket money — `pocket-money` (XI · Part B · Unit 5)

**Rule.** With ₹120 and two goods whose marginal utility falls, joy is greatest where the
last rupee spent on each buys the same joy and nothing is left over.

`MU samosa = 100, 80, 60, 20, 18, 15, 12, 10, 5, 2` · `MU lassi = 120, 90, 60, 40, 25, 10` ·
lassi ₹20.

| Samosa price | Best tray | MUx/Px | MUy/Py | Spent |
|---|---|---|---|---|
| ₹5 | 8 samosas, 4 lassi | 10/5 = 2 | 40/20 = 2 | ₹120 |
| ₹10 | 4 samosas, 4 lassi | 20/10 = 2 | 40/20 = 2 | ₹120 |
| ₹20 | 3 samosas, 3 lassi | 60/20 = 3 | 60/20 = 3 | ₹120 |

The schedules were chosen so the equi-marginal condition holds **exactly** with whole units
at all three prices. With arbitrary schedules it holds only "as nearly as whole units
allow", which would make the textbook statement approximately true on screen.

**Tests (`testLifePocket`).** Both schedules strictly diminishing; at each price the best
tray is unique by brute force over every affordable tray, spends the whole budget, and has
MUx/Px = MUy/Py; the samosas in the best tray fall as the price rises (8 → 4 → 3), which is
the demand curve the debrief draws.

## 4. Town survey — `town-survey` (XI · Part A · Units 2–3)

**Rule.** A random sample estimates the population mean without bias and more closely as it
grows; a sample taken where it is convenient estimates something else.

200 households: Market Road (40, ₹60–200k), Colony (90, ₹25–60k), Basti (70, ₹8–25k), each
skewed toward the bottom of its range. "Nearest doors" visits only Market Road.

**Tests (`testLifeSurvey`).** Over 60 towns: the census equals the true mean and median
exactly; lottery samples have mean signed error under 2%; the Market Road sample
over-estimates in every town; n = 40 has a smaller average error than n = 10; the mean lies
above the median in every town. The "bigger sample lands closer" insight is credited only
when the student's own larger draw really was closer, and its text says it is a tendency.

## 5. Town bank — `town-bank` (XII · Part A · Unit 2)

**Rule.** Each loan is redeposited, so with a legal reserve ratio `r` total deposits
approach `Initial × 1/r` and never pass it.

₹10,000, `r` = 20% → new deposits 10,000, 8,000, 6,400 … → limit ₹50,000 (multiplier 5).
Rounds 7–8 put the student in the RBI's chair: raising `r` to 25% cuts the multiplier to 4;
cutting it to 10% raises it to 10. Repo-rate moves are graded for **direction only** — the
syllabus asks which way each instrument works, and the model computes no number for it.

**Assumptions (NCERT's own).** All transactions pass through banks; no cash leaks out;
the banking system is treated as one bank. Lending above the legal maximum is stopped and
counted, not executed.

**Tests (`testLifeBank`).** On the legal-maximum path each deposit is (1 − r) of the last,
reserves are exactly r × deposits, loans + reserves = deposits; the cumulative path stays
below the limit for every n and converges to it; no policy exceeds that path; a bank that
lends nothing is **not** credited with credit creation; a player who never under-lent is
told they have not yet seen what idle reserves do.

## 6. Finance minister — `finance-minister` (XII · Part A · Units 3–4)

**Rule.** With `C = 100 + 0.8(Y − T)`, income settles where `Y = C + I + G`, i.e.
`Y* = (100 − 0.8T + I + G) / 0.2`; output cannot exceed full-employment income 2,000.

- Spending/investment multiplier `1/(1 − 0.8) = 5`; lump-sum tax multiplier `−0.8/0.2 = −4`.
- Gap = `|AD(Yf) − Yf|`, measured **at full employment**: deflationary below, inflationary
  above (vertical, as the 2026-11 audit required of `macro-inflation-gap`).
- Fiscal deficit = `G + interest − T`; primary deficit = fiscal deficit − interest; debt
  grows by the fiscal deficit and next year's interest is 5% of it.
- Investment by year: 160, 150, 200, 250, 230 (normal 200).

**What is illustration, and says so on screen.** Idle workers are drawn in proportion to
the output shortfall. The syllabus teaches that deficient demand causes involuntary
unemployment; it gives no formula for how much.

**Enrichment.** The tax-multiplier insight goes beyond the named 2026–27 topic (the
syllabus asks students to *name* tax and spending changes as fiscal measures). It is
labelled ✨ in the debrief, as `macro-multiplier`'s `enrichmentNote` already does.

**Tests (`testLifeFM`).** Y = AD at equilibrium across the whole G × T × I grid; output never
above Yf; the gap is the vertical one and is named correctly; the three budget identities;
ΔY/ΔG = ΔY/ΔI = 5 and ΔY/ΔT = −4; the opening budget sits exactly at Yf; every year has a
slider setting that closes the gap exactly. A minister who never moves a lever, or moves
them the wrong way, is not credited with correcting either gap.
