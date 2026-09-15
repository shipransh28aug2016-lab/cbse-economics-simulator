# docs/economics/ — the durable Economics knowledge layer

This folder exists so the economics reasoning behind each simulation lives somewhere
durable and browsable, not only scattered across code comments and this session's own
conversation history. It is a **reference for humans and agents**, not new syllabus
content — every claim in here is checked against `curriculum/Economics_2026-27_Content_MicroContent_Taxonomy.md`
and `js/curriculum-data.js` (the project's actual sources of truth for syllabus scope;
see `CLAUDE.md`), and against the live formulas in the code it documents.

## Honesty note on sourcing

This layer was written **without access to a physical or PDF copy of Sandeep Garg's
Class XI/XII Economics textbooks** — this environment has no general internet browsing
and no such file was supplied to the repository. Every model/formula/misconception
documented here is instead grounded in:

1. the official CBSE 2026–27 syllabus taxonomy already checked into this repo
   (`curriculum/Economics_2026-27_Content_MicroContent_Taxonomy.md`), and
2. standard NCERT-level microeconomics/macroeconomics content that is common to every
   major CBSE-aligned textbook (Sandeep Garg included) at this level — the movement/shift
   distinction, the elasticity determinants, the PPF and increasing-opportunity-cost
   law, the circular flow and injections/leakages framework, and so on are not
   book-specific; they are the syllabus's own named content.

If you *do* have Sandeep Garg (or NCERT) available, treat this folder as a draft to
cross-check and correct against the book's exact wording/notation — particularly
worked-example numbers and any notation convention (e.g. some books write price
elasticity as a positive number by convention, others keep the negative sign) — and
update the relevant `docs/economics/models/*.md` file plus a note here about what was
verified. Do not silently change a model file without recording that the correction
came from the textbook rather than from re-deriving the formula.

## Layout

```
docs/economics/
  curriculum/    — how to navigate CURRICULUM_NODES / the taxonomy file; what's core
                   vs enrichment right now, and why
  models/        — one file per implemented economic model: what/why/assumptions/
                   variables/relationship/math/graph/comparative-statics/
                   interpretation/limitation/misconception/simulation-mapping
                   (the section 8 template) — grounded in the actual compute()/
                   model()/customRender() function it documents, not idealized
  misconceptions/ — the misconceptions already encoded in quiz banks (js/quiz-data*.js's
                   `misconceptions` fields) and TLM `commonMistakes`, indexed by concept,
                   plus known-but-not-yet-encoded ones flagged as backlog
  pedagogy/      — when to use PREDICT (gate vs card) vs the Teaching & Learning
                   Toolkit vs a misconception tag vs nothing at all — this is a design
                   decision per concept, not a checklist to always fill in
  validation/    — the two-level (software + economic) validation this project
                   actually runs, and how to extend it when you add a model
```

## What's actually covered right now

`docs/economics/models/` currently has one file per sim in the "gold-standard" set
built out with PREDICT + the Teaching & Learning Toolkit (see `CLAUDE.md`):

- `demand-supply.md` — `gl-demand-movement-shift`, `gl-supply-movement-shift`
- `market-equilibrium.md` — `gl-market-equilibrium-shifts`
- `elasticity.md` — `micro-elasticity`
- `ppf.md` — `micro-ppf`
- `circular-flow.md` — `macro-gdp`

The other ~39 sims (Statistics, the rest of Microeconomics, Macroeconomics, Indian
Economic Development) do not have a model file yet — that is a real backlog, not a
signal they're lower quality. Add one when you meaningfully touch a concept's formula,
per `CLAUDE.md` Working Convention 6.
