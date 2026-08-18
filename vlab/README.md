# CBSE V-LAB 2026-27

An offline-first, browser-based virtual laboratory for CBSE Classes XI/XII —
the first vertical slice of the MASTER BUILD LOOP specification, living
inside this repo alongside (and independent of) **EconSim Pro**
(`js/`, `css/`, `index.html` at repo root — see the root `CLAUDE.md`).

## Run it

No build step. Either open `vlab/index.html` directly, or serve it (needed
for the Service Worker / installability):

```
python3 -m http.server 8080 --directory vlab
# then open http://localhost:8080/index.html
```

## What's here

One complete experiment, end to end: **CBSE Class XII Chemistry (043) —
standardizing an unknown KMnO4 solution by titrating it against a standard
oxalic acid solution.** Curriculum mapping → apparatus → procedure →
interactive titration workspace (real stoichiometry, not a decorative
animation) → observation notebook → calculation → viva → post-lab
assessment → offline persistence. See `docs/ARCHITECTURE.md` for the full
layer map and the reasoning behind every structural decision, and
`docs/EXPERIMENT_AUTHORING.md` before adding a second one.

## Verify

```
npm run vlab:verify
```
from the repo root. See `docs/TESTING.md`.
