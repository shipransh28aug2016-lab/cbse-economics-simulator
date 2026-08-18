# CBSE V-LAB — Offline Architecture

## Principle (spec §3, §19)

The simulator itself never depends on a live network call. Everything —
apparatus, procedure, viva bank, assessment, the simulation model — is
embedded JS loaded via `<script>` tags (see `ARCHITECTURE.md` for why, not
`fetch()`). The only network-shaped things in the app are:

1. The initial page load (or a Service Worker install), and
2. The `syncQueue` IndexedDB store, which exists but nothing currently
   populates — there is no backend to sync to in this slice (spec §19's
   optional-sync stage of the pipeline is a documented future step, not
   built).

## Service Worker (`sw.js`)

Cache-first with network fallback:

- `install`: pre-caches the fixed `APP_SHELL` list (every file `index.html`
  loads, plus itself/the manifest). `vlab/tools/build-check.js` cross-checks
  this list against `index.html`'s actual `<script>` tags on every
  `npm run vlab:build` / `vlab:verify` run, so a newly added script can't
  silently fall out of the offline cache.
- `activate`: deletes any cache from a previous `CACHE_NAME` (bump the
  version string on any app-shell change).
- `fetch`: serve from cache if present; otherwise fetch from network and
  populate the cache for next time; if the network fetch itself fails
  (offline), fall back to whatever's cached (possibly nothing, for a
  never-visited URL — expected, not a bug).

Registered only over `http:`/`https:` (`app.js`'s `registerServiceWorker()`)
— Service Workers require a secure context and don't apply to `file://`
usage, which the app supports independently of the SW (everything needed to
run is already inline/embedded, SW or not).

## IndexedDB (`src/offline/db.js`)

One database (`vlab-cbse-2026-27`), one object store per spec §19's list:
`studentProfile`, `experimentProgress`, `experimentAttempts`, `observations`,
`assessmentResults`, `vivaAttempts`, `settings`, `cachedCurriculum`,
`appVersion`, `syncQueue`. Every record has an `id` (the object stores use
`keyPath: 'id'`).

**Never throws for lack of storage.** Every read/write path
(`put`/`get`/`getAll`) tries IndexedDB first and falls back to a namespaced
`localStorage` key (`vlab:<store>:<id>`) on any failure — private-browsing
modes, disabled IndexedDB, or a `file://` context where it's unreliable.
`src/offline/progress-store.js`'s higher-level helpers
(`saveObservationTrial`, `saveAssessmentResult`, `saveVivaAttempt`,
`saveExperimentProgress`) are all promise-based and every call site in
`app.js` chains a no-op `.catch()` — a storage failure degrades to
in-memory-only state for that session, it never blocks or crashes the
student's workflow (spec §19: "the app must remain functional if
synchronization fails").

## What's genuinely not built

- **Sync to a server**: there is no server. `syncQueue` is a real object
  store with nothing writing to it yet — add a `queueForSync()` helper next
  to `progress-store.js`'s other helpers when a sync target exists, following
  the same "never block the UI on it" pattern.
- **`studentProfile` / `settings` / `cachedCurriculum` / `appVersion`
  stores**: created (so the schema won't need a version bump later) but
  unused by this one-experiment slice — there's currently one experiment and
  no login, so there's nothing profile-specific to store yet.
- **App icons for the manifest**: `manifest.webmanifest`'s `icons` array is
  empty. Installability will work without it in most browsers but will warn;
  add real icon files (SVG preferred — no external/CDN images per spec §4)
  before treating "installable PWA" as done.

## Offline test

`npm run vlab:smoke` automates this (spec §24/§25's "disable network and
verify the application opens"): after the desktop-viewport workflow run, it
waits for `navigator.serviceWorker.ready`, calls Playwright's
`context.setOffline(true)`, reloads, and asserts the app shell still renders
— then restores connectivity before the mobile pass. This only proves the
*app shell* survives a disconnect (it doesn't yet re-run the full student
workflow while offline); extend the offline block in `tools/smoke.js` if you
need that stronger guarantee for a future experiment.
