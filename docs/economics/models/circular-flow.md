# Model: Circular Flow of Income — 2/3/4-Sector + Financial Market

**Sim:** `macro-gdp`
**File:** `js/simulations.js` (`customRender()`)
**Syllabus:** Class XII, Part A, Unit 1 (`XII-A-U1-CIRCULAR-FLOW`, `-AGGREGATES`,
`-MACRO-MEANING`). **This sim carries `enrichment: true`** — the taxonomy names only
"Two-sector model" and "Circular flow mechanism" for this topic; the 3-Sector,
4-Sector, and Financial Market extensions are standard board-exam content built on top
of the named topic, not literally named under it (Saving/Investment are separately
named under Unit 3 — see `enrichmentNote` on the sim itself, and `CLAUDE.md` Working
Convention 3 for the general rule this follows).

## What

A student-selectable Economy Model (2/3/4-Sector) plus an independent Financial Market
(Banks) on/off toggle. The diagram draws **only** the nodes and flows that exist in the
chosen combination — this was a real, fixed bug: earlier versions always drew all four
nodes regardless of the sector selection.

## Why it matters

Three separate, board-tested skills: (1) building the sector model up in stages rather
than only ever seeing the full 4-sector picture, (2) correctly classifying every flow as
an injection or a leakage, (3) applying the injections-vs-leakages rule to predict
whether national income rises, falls, or is in equilibrium.

## Assumptions

- **2-Sector, Financial Market off** (the strict baseline): households spend their
  *entire* income on consumption, firms pay out their *entire* revenue as factor
  income. Nothing leaks out anywhere, so `Y = C` is an **identity**, not a modelling
  choice — the sim enforces this by overriding the `wages` slider to equal `consumption`
  whenever this baseline is active (`identityHolds` in `customRender()`), and explains
  the override in the readings rather than silently ignoring the slider.
- **Financial Market ON**: `Investment (I) = Savings (S)` always, in this lab
  specifically. This is the **ex-post national-income-accounting identity** (`Y = C+S`
  on the income side, `Y = C+I` on the expenditure side, in a 2-sector economy, forces
  `S = I` after the fact) — it is *not* a claim that planned/ex-ante Investment always
  equals planned/ex-ante Saving. The separate `macro-multiplier` sim is where that
  ex-ante S≠I distinction (and the equilibrium condition S=I as the *point* the economy
  settles at, rather than an identity true at every point) is taught — see Unit 3,
  Determination of Income and Employment. Do not "fix" this sim to let S and I diverge;
  that would conflate two different, both-correct, both-taught models.
- **3-Sector**: Taxes are modelled as a single household→government flow (`taxes = 35`,
  fixed, not a slider) — a simplification; real government revenue also includes
  corporate/indirect taxes collected from firms. Government spending is modelled as a
  single government→household flow — also a simplification (real G includes government
  purchases from firms, subsidies, etc.). Both simplifications are standard for a
  *diagram-level* teaching tool at this stage; they are not claims about the real
  composition of tax/spending flows.
- **4-Sector**: `exportsVal = max(nx, 0) + 50`, `imports = max(-nx, 0) + 50` — a fixed
  ₹50B baseline in both directions, tilted by the student-set Net Exports slider. This
  keeps both flows visibly present (never literally zero) purely for diagram legibility.

## Variables

`sector` (`2`/`3`/`4`), `bank` (`no`/`yes`), `consumption`, `wages`, `saving` (only when
`bank='yes'`), `g` (only when `sector` ∈ `{3,4}`), `nx` (only when `sector='4'`).

## Relationship — the direction rule that was previously a real bug

**Leakages** pull money OUT of the Households/Firms loop: Taxes (HH→Govt), Imports
(Firm→Foreign), Savings (HH→Bank). **Injections** push new money IN: Govt Spending
(Govt→HH), Exports (Foreign→Firm), Investment (Bank→Firm).

The specific bug this model previously had, and the reason this file states the rule
so bluntly: Exports were drawn as a money flow **Firm→Foreign** and Imports as
**Foreign→Firm** — exactly backwards. Export revenue is paid **by** the Foreign Sector
**to** domestic Firms (money flows in — an injection); import spending is paid **by**
domestic Firms **to** the Foreign Sector (money flows out — a leakage). The real
(physical) goods move the opposite way from the money in each case, which is precisely
why getting the *payment* direction right — not the goods direction — is the point.

## Graphical representation

Real flow (dashed wire, square markers: Factor Services HH→Firm, Goods & Services
Firm→HH) always drawn opposite in direction to the money flow that pays for it (solid
wire, round markers: Factor Payments Firm→HH, Consumption Firm←HH).

**Node layout — one fixed 5-point ring, never recomputed from which other sectors are
active.** Households (9 o'clock), Firms (3 o'clock), Government (12 o'clock), Financial
Market (roughly 8 o'clock), Foreign Sector (roughly 4 o'clock) each own a single,
permanent `(x, y)` anchor. Toggling the sector selector or the Financial Market switch
only ever adds or removes *that sector's own* node and flows — it must never recompute
another node's position.

**The bug this replaced:** Financial Market and Foreign Sector used to *share* two
conditional slots — `x: has4 && hasBank ? 370 : 250` for one, the mirror-image
expression for the other. Whichever of the two was on screen alone sat at the shared
bottom-center spot (`x=250`); the instant the other sector was also switched on, BOTH
nodes' x-coordinates were recomputed and the one already visible visibly slid sideways
(bottom-center → bottom-left or bottom-right). That silent jump — a node moving purely
because an *unrelated* sector was toggled, not because its own sector was — is exactly
the failure mode a circular-flow diagram cannot have: a teacher mid-explanation would
watch a node the class was already looking at relocate for no economic reason. Fixed by
giving Financial Market a fixed `(130, 344)` and Foreign Sector a fixed `(370, 344)`
unconditionally — the same coordinate pair that already rendered correctly in the
"both present" case, now used whether or not the other sector is present. Verified both
by screenshot (before/after every 2→3→4-sector and bank on/off transition) and by an
automated regression, `testCircularFlowTopology()` in `tools/test-curriculum.js`, which
renders every combination and asserts every node shared between two states has
byte-identical coordinates, plus a pairwise-distance check that no two simultaneously
visible nodes ever land within 60px of each other.

## Comparative statics

`Total Injections = (sector≥3 ? G : 0) + (sector=4 ? Exports : 0) + (bank=on ? I : 0)`,
`Total Leakages = (sector≥3 ? T : 0) + (sector=4 ? Imports : 0) + (bank=on ? S : 0)`.

| Comparison | Effect on National Income |
|---|---|
| Injections > Leakages | tends to **rise** |
| Injections < Leakages | tends to **fall** |
| Injections = Leakages | **equilibrium** (constant) |

Because `I = S` always in this lab, turning on the Financial Market *alone* (no
government, no foreign sector) always nets to Injections = Leakages for that pair — by
construction, not coincidence: it demonstrates that a pure savings-investment channel,
on its own, doesn't create a systematic pull on national income the way an
under- or over-taxed government budget, or a trade imbalance, does.

## Interpretation

The verdict text is deliberately written with **no embedded numbers** — the numeric
readings sit in their own rows above it — specifically so `READINGS_I18N_HI`'s
substring-based translation (see `CLAUDE.md`) can translate the sentence whole. See
`js/i18n_hi.js`'s `macro-gdp` entry for the ordering constraint this creates (long
sentences must be listed before short patterns that are substrings of them).

## Limitation

Government spending/taxes don't distinguish direct tax (on households) from indirect
tax (on goods, effectively paid by firms/consumers together) — a distinction the
syllabus does name elsewhere (Unit 2, Government Budget, which this sim does not cover).
GDP by the expenditure method here uses a fixed illustrative `I = 50` when the Financial
Market is off — the `QUIZ_BANK['macro-gdp']` `applyTemplates` guard this explicitly
(`js/quiz-data.js`: one template fires only when `bank !== 'yes'`, using the fixed I=50
wording; a second fires only when `bank === 'yes'`, using the real `metrics.investment`
value) so a generated question is never wrong about which Investment figure applies.

## Misconception (encoded)

`js/quiz-data.js`'s static questions cover the injection/leakage classification
directly (including "which of these is an injection" with Household Saving as a
plausible-but-wrong distractor, correctly labelled a leakage). No per-option
`misconceptions` field is used on this sim's quiz bank yet.

## Simulation mapping

`inputs (sector select, bank select, 5 conditionally-shown sliders) → mechanism
(customRender() recomputes which nodes/flows exist and their values) → outputs (SVG
flow diagram, readings, injections/leakages verdict) → visual feedback (live redraw on
every slider move)`. No PREDICT mechanism is wired on this sim yet — `sim.tlm` and
`sim.predict` are both real backlog items here (see `docs/economics/pedagogy/README.md`);
`sim.tlm` in particular would attach with zero new engine code, since it works
identically on `customRender` sims already.
