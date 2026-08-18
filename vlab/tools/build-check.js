#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════
// CBSE V-LAB — "build" step (spec §24), mirroring tools/build-check.js
// in the parent EconSim Pro app: no bundler exists, so "build" means
// verifying every local asset index.html and sw.js reference actually
// exists on disk, and that the service worker's app-shell list stays
// in sync with what index.html actually loads.
// ══════════════════════════════════════════════════════════════
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
let failures = 0;

function checkHtmlRefs(entry) {
    const filePath = path.join(ROOT, entry);
    if (!fs.existsSync(filePath)) { console.error(`❌ Entry point missing: ${entry}`); failures++; return; }
    const html = fs.readFileSync(filePath, 'utf8');
    const refs = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(m => m[1]);
    let checked = 0;
    refs.forEach(ref => {
        if (/^(https?:)?\/\//.test(ref) || ref.startsWith('#') || ref.startsWith('mailto:')) return;
        const clean = ref.split('?')[0];
        const resolved = path.join(ROOT, clean);
        checked++;
        if (!fs.existsSync(resolved)) {
            console.error(`❌ ${entry} references missing local asset: ${ref}`);
            failures++;
        }
    });
    console.log(`✓ ${entry}: ${checked} local asset reference(s) resolved`);
}

checkHtmlRefs('index.html');

// The service worker's cache list is hand-maintained (see sw.js's own
// header comment) — verify every file it names on disk, and cross-
// check it against index.html's own <script src> list so a newly
// added script can't silently be missed by the offline cache.
const swPath = path.join(ROOT, 'sw.js');
if (!fs.existsSync(swPath)) {
    console.error('❌ sw.js missing');
    failures++;
} else {
    const swSrc = fs.readFileSync(swPath, 'utf8');
    const listMatch = /APP_SHELL\s*=\s*\[([\s\S]*?)\]/.exec(swSrc);
    const shellEntries = listMatch
        ? [...listMatch[1].matchAll(/'([^']+)'/g)].map(m => m[1])
        : [];
    if (!shellEntries.length) { console.error('❌ sw.js APP_SHELL list is empty or unparsable'); failures++; }
    shellEntries.forEach(entry => {
        const clean = entry.replace(/^\.\//, '');
        const resolved = path.join(ROOT, clean === '' ? 'index.html' : clean);
        if (!fs.existsSync(resolved)) {
            console.error(`❌ sw.js APP_SHELL references missing file: ${entry}`);
            failures++;
        }
    });

    const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    const scriptSrcs = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]);
    scriptSrcs.forEach(src => {
        if (!shellEntries.includes('./' + src) && !shellEntries.includes(src)) {
            console.error(`❌ index.html loads ${src} but sw.js APP_SHELL does not cache it — offline mode would break`);
            failures++;
        }
    });
    console.log(`✓ sw.js: ${shellEntries.length} app-shell file(s) resolved and cross-checked against index.html`);
}

if (failures > 0) {
    console.error(`\n❌ vlab/tools/build-check.js FAILED (${failures} issue(s)).`);
    process.exit(1);
}
console.log('\n✅ vlab/tools/build-check.js PASSED.');
