# CBSE V-LAB — Testing

Same "no build system" situation as the parent EconSim Pro app (see root
`CLAUDE.md`'s "No build system" section) — no `package.json` test runner of
its own beyond what's already installed (Node 22, global `eslint`, global
`playwright`). `vlab/` reuses those via its own `npm run vlab:*` scripts,
kept separate from the root `npm run *` scripts so neither pipeline can
break the other.

| Command | What it does |
|---|---|
| `npm run vlab:typecheck` | `node --check` on every `vlab/**/*.js` file (syntax only — untyped JS) |
| `npm run vlab:lint` | `eslint` over `vlab/*.js`, `vlab/src/**/*.js`, `vlab/tools/*.js`, `vlab/sw.js` |
| `npm run vlab:test` | `node vlab/tools/test-vlab.js` — see below |
| `npm run vlab:build` | `node vlab/tools/build-check.js` — local asset + service-worker cache-list check |
| `npm run vlab:smoke` | `node vlab/tools/smoke.js` — Playwright, full student workflow |
| `npm run vlab:verify` | all five, in order |

Run `npm run vlab:verify` after every change to `vlab/` — don't batch
verification to the end of a session (same rule as the root `CLAUDE.md`).

## `tools/test-vlab.js` (unit + curriculum audit)

DOM-free Node harness, `require()`s `src/**/*.js` directly (no `vm` sandbox
needed — these files never touch `document`, unlike the parent app's UI
files). Three sections:

1. **Simulation model** (`src/simulation/permanganometry-model.js`):
   stoichiometry round-trips, a hand-checked worked example, every
   `flaskState()` branch (no acid / under-titrated / at equivalence /
   overshot / too cold / too hot / no-stirring artifact), edge cases
   (zero/negative/`NaN`/`Infinity` never throw or silently validate),
   concordance + tolerance grading, answer validation in both directions of
   the 5% band, and PRNG determinism.
2. **State machine** (`src/core/state-machine.js`): the full forward path,
   one illegal jump, one legal retry (`MEASURING → RUNNING`).
3. **Curriculum audit** (`src/curriculum/registry.js`): prints the spec
   §28-style summary block (`Experiments:` / `Verified:` / `Needs Review:` /
   `Orphaned Curriculum Topics:` / etc.) and asserts each count is what it
   should be for the current registry — including an explicit check that
   the one experiment's `verificationStatus` is honestly `'needs-review'`,
   not prematurely marked `'verified'`.

Any new numeric formula you add to `src/simulation/` needs a matching sweep
here — the same rule the root `CLAUDE.md` states for the parent app applies
verbatim.

## `tools/build-check.js`

Verifies every local asset `index.html` references exists on disk, and
cross-checks `sw.js`'s hand-maintained `APP_SHELL` cache list against
`index.html`'s actual `<script>` tags — a script added to one but not the
other is a real bug (either a 404 in the browser, or a script silently
excluded from the offline cache) and fails the build.

## `tools/smoke.js` (Playwright)

Drives the entire one-experiment student workflow — pre-lab MCQs, begin,
titrate by watching the beaker's own colour feedback (not a hard-coded
titre; the unknown molarity is randomised per session via a seeded PRNG),
record two concordant trials, compute + check the molarity via the app's own
formula, answer 3 viva questions, fill the post-lab short answer, mark
complete — at a desktop (1280×900) and a mobile (375×700) viewport, and
asserts:

- zero console errors / page errors / failed requests / non-OK responses
  (favicon.ico's auto-request is filtered as benign, same as the parent
  app's `tools/smoke.js` — see its comment for why)
- no horizontal overflow at the mobile viewport
- the app shell survives an offline reload once the service worker is ready
  (spec §19/§24/§25's offline test — see `OFFLINE_ARCHITECTURE.md`)

If you add a second experiment, add a second `runWorkflow`-style function
here rather than making the existing one branch on which experiment is
active — that's exactly the kind of "not tested, claims tested" gap this
project's `CLAUDE.md`-style discipline exists to prevent.

## What's not automated yet

- Accessibility (spec §17): no automated axe-core/Lighthouse pass yet. The
  UI uses semantic buttons/labels/`aria-live`/`role="status"` and honours
  `prefers-reduced-motion`, but this hasn't been machine-checked.
- Lighthouse/performance budget (spec §25): not run in this environment; the
  app is small and dependency-free by construction, but no numeric budget is
  enforced yet.
