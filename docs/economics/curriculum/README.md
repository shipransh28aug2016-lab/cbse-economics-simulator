# Curriculum navigation

**Source of truth** (do not duplicate the syllabus here — navigate to it):
`curriculum/Economics_2026-27_Content_MicroContent_Taxonomy.md` (human-readable) and
`js/curriculum-data.js`'s `CURRICULUM_NODES` (machine-checkable — one entry per
syllabus Topic, each with a unique `syllabusId`). If this file and either of those ever
disagree, they win (`CLAUDE.md`).

## Structure (2026–27)

```
Class XI  — Part A: Statistics for Economics (Units 1–3)
          — Part B: Introductory Microeconomics (Units 4–7)
Class XII — Part A: Introductory Macroeconomics (Units 1–5)
          — Part B: Indian Economic Development (Units 6–8)
```

## Core vs. enrichment, right now

`tools/generate-coverage-report.js` regenerates `reports/SYLLABUS_COVERAGE_REPORT.md`
and `reports/REMAINING_UNMAPPED_CONTENT.md` from `CURRICULUM_NODES` — those are the
live, regenerable coverage matrix. As of this pass: **59/59 curriculum nodes have at
least one covering sim (100%)**. That number describes "has a sim," not "the sim's
content is entirely within the named topic" — see the enrichment list below for where
those two things diverge.

Exactly 4 sims currently carry `enrichment: true` (grep `js/simulations*.js` for
`enrichment: true` to keep this list honest as it changes):

| Sim | Named topic it sits under | Why it's enrichment |
|---|---|---|
| `macro-gdp` | XII-A-U1 Circular Flow of Income | Taxonomy names only "Two-sector model" + "Circular flow mechanism"; the 3/4-Sector and Financial Market extensions are standard board content, not literally named here |
| `india-poverty` | XII-B-U7 Current Challenges | Taxonomy's Unit 7 names Human Capital, Rural Development, Employment, Sustainable Development — not Poverty as a standalone topic |
| `micro-market-structures` | XI-B-U7 (scoped to Perfect Competition only) | Taxonomy explicitly scopes Unit 7 to Perfect Competition, short-run only — Monopoly/Oligopoly/Monopolistic Competition aren't Class XI Micro topics in this taxonomy |
| `stats-dispersion` | XI-A-U3 Statistical Tools | Taxonomy's Unit 3 lists Central Tendency, Correlation, Index Numbers — not Dispersion as its own itemized topic |
| (check `enrichmentNote` on each — this table is a summary, the sim's own field is authoritative) | | |

**Prerequisite/cross-class connections worth knowing when writing a model file or TLM
content:**

- Circular Flow (XII-A-U1) assumes the student already has the basic demand/supply
  vocabulary from XI-B, but does *not* assume the Multiplier (XII-A-U3) — the `S = I`
  identity in `macro-gdp` is deliberately the simpler, ex-post version; the ex-ante
  planned-S-vs-planned-I distinction belongs to `macro-multiplier` (see
  `docs/economics/models/circular-flow.md`).
- PPF/Opportunity Cost (XI-B-U4) is a prerequisite concept for basically everything
  downstream in microeconomics — Introductory Micro's whole framing (scarcity, choice)
  rests on it — but is not itself revisited later in the taxonomy.
- Elasticity (XI-B-U5) determinants (substitutes, necessity/luxury, income share, time)
  reappear informally when discussing tax incidence and price-ceiling/floor effects in
  later Micro units, though the taxonomy does not cross-link them explicitly.

## Content unsuitable for simulation (a legitimate category, not a gap)

Not every named topic should become an interactive slider/drag simulation. Positive vs
Normative Economics (`micro-positive-normative`) is correctly built as `mode:
'explorer'` (classification cards), not a numeric model — there is no meaningful
"drag a slider" version of "is this statement testable or a value judgement." Five-Year
Plans history is similarly `explorer`/timeline content, not a simulation. Don't force a
`compute()`/`graphLab.model()` onto content that's fundamentally classificatory or
historical.
