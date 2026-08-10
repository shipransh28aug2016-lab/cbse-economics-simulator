#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════
// "Build" step for a static, no-bundler app: there is nothing to
// compile, so this instead verifies every local asset an HTML entry
// point references actually exists on disk (a broken <script src>
// or <link href> is this project's equivalent of a failed build) and
// that plotly.min.js — the one binary dependency — is present and
// looks like the real library, not an empty/corrupt stub.
// ══════════════════════════════════════════════════════════════
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const ENTRY_POINTS = ['index.html', 'system_test.html'];
let failures = 0;

ENTRY_POINTS.forEach(entry => {
    const filePath = path.join(ROOT, entry);
    if (!fs.existsSync(filePath)) { console.error(`❌ Entry point missing: ${entry}`); failures++; return; }
    const html = fs.readFileSync(filePath, 'utf8');
    const refs = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(m => m[1]);
    let checked = 0;
    refs.forEach(ref => {
        if (/^(https?:)?\/\//.test(ref) || ref.startsWith('#') || ref.startsWith('mailto:')) return; // external/anchor
        const clean = ref.split('?')[0];
        const resolved = path.join(ROOT, clean);
        checked++;
        if (!fs.existsSync(resolved)) {
            console.error(`❌ ${entry} references missing local asset: ${ref}`);
            failures++;
        }
    });
    console.log(`${entry}: checked ${checked} local asset reference(s).`);
});

const plotlyPath = path.join(ROOT, 'js/plotly.min.js');
if (!fs.existsSync(plotlyPath)) {
    console.error('❌ js/plotly.min.js is missing.');
    failures++;
} else {
    const size = fs.statSync(plotlyPath).size;
    const head = fs.readFileSync(plotlyPath, { encoding: 'utf8', flag: 'r' }).slice(0, 200);
    if (size < 1_000_000) { console.error(`❌ js/plotly.min.js is only ${size} bytes — looks like a stub, not the real library.`); failures++; }
    if (!/plotly/i.test(head)) { console.error('❌ js/plotly.min.js does not look like the Plotly library (no "plotly" in file header).'); failures++; }
    if (!failures) console.log(`js/plotly.min.js: ${(size / 1e6).toFixed(1)}MB, looks like the real library.`);
}

// Guard against the exact regression this integration pass fixed once
// already: i18n files silently staying empty stubs while the UI
// implies a working translation.
['js/i18n_engine.js', 'js/i18n_hi.js'].forEach(f => {
    const p = path.join(ROOT, f);
    if (!fs.existsSync(p)) { console.error(`❌ ${f} is missing.`); failures++; }
});

if (failures > 0) {
    console.error(`\n❌ tools/build-check.js FAILED (${failures} problem(s)).`);
    process.exit(1);
} else {
    console.log('\n✅ tools/build-check.js PASSED — all local assets resolve, plotly.min.js is the real library.');
}
