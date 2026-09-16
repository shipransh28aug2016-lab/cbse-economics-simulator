# AGENTS.md

This repository's operating contract lives in **[`CLAUDE.md`](./CLAUDE.md)** — architecture,
curriculum source of truth, the PREDICT/Teaching-&-Learning-Toolkit/misconceptions
systems, the no-build verification pipeline, and the five working conventions every
change must follow. Read it in full before making any change here.

This file exists only so agents/tools that specifically look for `AGENTS.md` (rather
than `CLAUDE.md`) land somewhere useful. It is a pointer, not a second contract —
duplicating the content here would just give it a chance to drift out of sync with
`CLAUDE.md` as the project evolves, which is exactly the kind of split source-of-truth
this project's own curriculum-integrity rules exist to prevent (see `CLAUDE.md`'s
"Curriculum source of truth" section for the same principle applied to syllabus data).

Two lines worth repeating here anyway, because they're the ones most likely to be
skipped:

1. **Economics correctness has priority over visual novelty.** A beautiful simulation
   that teaches an incorrect economic relationship is a failed feature.
2. **Validation is two-level and both are required**: `npm run verify` (software) AND
   an actual check that the model's math produces the economic relationship the UI
   claims (economic) — see `CLAUDE.md`'s "Operating principles" and
   `docs/economics/validation/README.md`.

For the durable economics knowledge layer (curriculum navigation, per-concept worked
models, known misconceptions, the PREDICT/TLM pedagogy pattern), see `docs/economics/`.
