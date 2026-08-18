# CBSE V-LAB — Curriculum

## Source of truth

`src/curriculum/registry.js` (`CURRICULUM_NODES`) is what the app and
`tools/test-vlab.js` actually load. `data/curriculum/cbse-2026-27-chemistry.json`
is a human-readable mirror for audit purposes — see
`docs/ARCHITECTURE.md`'s "Why plain `<script>` tags" section for why the
runtime source isn't the JSON file directly.

## Current coverage

| Curriculum Topic ID | Class | Subject | Unit | Verification |
|---|---|---|---|---|
| `XII-CHEM-VOLUMETRIC-PERMANGANOMETRY` | XII | Chemistry (043) | Practicals — Volumetric Analysis | `needs-review` |

One experiment (`xii-chem-permanganometry-v1`) covers this node. Run
`npm run vlab:test` for the live audit (spec §28 format): orphaned topics,
duplicate experiment IDs, unknown curriculum refs, class mismatches, and
missing required Experiment fields.

## What "needs-review" means here, precisely

- **Chemistry**: standard, stable NCERT/CBSE lab-manual content
  (permanganometry, n-factor 5 for KMnO4 in acid, n-factor 2 for oxalic acid,
  60-90°C reaction window, self-indicating endpoint). Numerically validated
  by `tools/test-vlab.js`.
- **Curriculum placement** (exact 2026-27 CBSE Chemistry 043 Practical
  syllabus wording/numbering for this experiment): not yet cross-checked,
  because the official syllabus PDF has not been added to this repo. Do this
  before flipping `verificationStatus` to `'verified'`:
  1. Add the official CBSE 2026-27 Chemistry (043) Practical syllabus PDF to
     the repo (mirroring how `curriculum/Economics_SecP2_2026-27.pdf` is
     referenced — but not present — for the parent Economics app).
  2. Confirm this practical is listed for 2026-27 Class XII Chemistry, and
     capture its exact experiment number/wording.
  3. Update `sourceReference`, set `verificationStatus: 'verified'`,
     `contentStatus: 'verified'`, `lastVerified` (ISO date), `verifiedBy` in
     **both** `src/curriculum/registry.js` and the `data/` JSON mirror.
  4. Re-run `npm run vlab:test` — the audit block should then report
     `Verified: 1`, `Needs Review: 0`.

## Adding a second experiment

See `EXPERIMENT_AUTHORING.md`. In short: add a `CURRICULUM_NODES` entry here
first (with an honest `verificationStatus`), then author the `Experiment`
object referencing its `topicId` — `validateCurriculumRegistry()` will reject
an experiment whose `curriculumMapping.topicId` doesn't resolve to a node
that exists here.

## Class XI / XII separation (spec §16)

`CURRICULUM_NODES[i].class` and `Experiment.class` must match — enforced by
`validateCurriculumRegistry()`'s `classMismatches` check. There is currently
only one Class XII node; the UI has no class filter yet because there is
nothing to filter (spec §30 Loop 3 — add filtering when there's a second
class to filter between, not before).
