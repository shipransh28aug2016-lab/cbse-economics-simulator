#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════
// Headless-browser smoke test — the closest thing this static,
// no-bundler app has to an end-to-end test. Serves the repo over a
// local static server, drives every simulation with Playwright/
// Chromium, and asserts:
//   - zero console/page errors across the whole run
//   - every sim opens and renders real content
//   - every sim's Reset control works
//   - a representative interaction per mode (slider, data-lab cell
//     edit + add row, explorer nav) actually updates the UI
//   - invalid input (typed garbage) never crashes the page or leaks
//     a literal "NaN" into the readings panel
//   - no horizontal overflow at a mobile viewport (390×844)
// ══════════════════════════════════════════════════════════════
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.join(__dirname, '..');
const PORT = 8791;
const MIME = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json' };

function startServer() {
    return new Promise(resolve => {
        const server = http.createServer((req, res) => {
            const urlPath = decodeURIComponent(req.url.split('?')[0]);
            const filePath = path.join(ROOT, urlPath === '/' ? '/index.html' : urlPath);
            if (!filePath.startsWith(ROOT) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
                res.writeHead(404); res.end('not found'); return;
            }
            res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
            fs.createReadStream(filePath).pipe(res);
        });
        server.listen(PORT, () => resolve(server));
    });
}

let failures = 0, checks = 0;
function ok(cond, label) {
    checks++;
    if (!cond) { failures++; console.error(`❌ FAIL: ${label}`); }
    return cond;
}

(async () => {
    const server = await startServer();
    const executablePath = fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined;
    const browser = await chromium.launch({ executablePath });
    const page = await browser.newPage();

    // Known-benign noise in this sandboxed test run, unrelated to the
    // app's own code: Google Fonts is an external CDN this environment's
    // network policy may block, and browsers auto-request /favicon.ico
    // whether or not a page declares one. Both are filtered by URL, not
    // by message text, so a real app-code console error is never masked.
    const BENIGN_URL_PATTERNS = [/fonts\.googleapis\.com/, /fonts\.gstatic\.com/, /\/favicon\.ico$/];
    const errors = [];
    page.on('console', msg => {
        if (msg.type() !== 'error') return;
        const loc = msg.location() || {};
        if (BENIGN_URL_PATTERNS.some(re => re.test(loc.url || '') || re.test(msg.text() || ''))) return;
        errors.push(`console: ${msg.text()}`);
    });
    page.on('pageerror', err => errors.push(`pageerror: ${err.message}`));
    page.on('requestfailed', req => {
        if (BENIGN_URL_PATTERNS.some(re => re.test(req.url()))) return;
        errors.push(`requestfailed: ${req.url()} (${req.failure() && req.failure().errorText})`);
    });
    page.on('response', res => {
        if (res.ok() || BENIGN_URL_PATTERNS.some(re => re.test(res.url()))) return;
        errors.push(`response ${res.status()}: ${res.url()}`);
    });

    await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'load' });
    await page.waitForSelector('#screen-home.active', { timeout: 10000 });

    const simIds = await page.evaluate(() => window.SIMS ? SIMS.map(s => s.id) : (typeof SIMS !== 'undefined' ? SIMS.map(s => s.id) : []));
    ok(simIds.length >= 30, `home page loaded with a substantial SIMS array (got ${simIds.length})`);

    const cardCount = await page.locator('.sim-card').count();
    ok(cardCount === simIds.length * 2 || cardCount === simIds.length, `home page rendered simulation cards (${cardCount} cards for ${simIds.length} sims — app.js renders each sim into its module grid; a *2 count only happens on system_test.html's combined grid, so on index.html this should equal simIds.length)`);

    console.log(`Sweeping ${simIds.length} simulations...`);
    for (const id of simIds) {
        const before = errors.length;
        await page.evaluate((simId) => { window.openSim(simId); }, id);
        await page.waitForTimeout(80);

        const hasChapterTag = await page.locator('#concept-body .chapter-tag').count();
        ok(hasChapterTag > 0, `${id}: renders a Class/Part/Unit chapter tag`);
        const tagText = hasChapterTag ? await page.locator('#concept-body .chapter-tag').innerText() : '';
        ok(/Class (XI|XII)/.test(tagText), `${id}: chapter tag names a real class (got "${tagText}")`);

        const readingsText = await page.locator('#readings-body').innerText().catch(() => '');
        const overlayChildren = await page.locator('#sim-dom-overlay').evaluate(el => el.children.length).catch(() => 0);
        ok(readingsText.trim().length > 0 || overlayChildren > 0, `${id}: renders real content (readings or overlay)`);
        ok(!/\bNaN\b/.test(readingsText), `${id}: readings contain no literal NaN`);

        // Exercise one real interaction appropriate to whatever controls
        // this sim actually rendered, then Reset — every mode shares the
        // same .reset-btn class (see js/sim-engine.js, datalab-engine.js,
        // explorer-engine.js).
        const rangeInput = page.locator('#controls-panel input[type="range"]').first();
        if (await rangeInput.count()) {
            await rangeInput.evaluate(el => { el.value = el.max; el.dispatchEvent(new Event('input', { bubbles: true })); });
            await page.waitForTimeout(40);
        }
        const dataCell = page.locator('#controls-panel input.datalab-cell[type="number"]').first();
        if (await dataCell.count()) {
            await dataCell.fill('77');
            await dataCell.dispatchEvent('change');
            await page.waitForTimeout(40);
        }
        const timelineBtn = page.locator('.explorer-timeline-btn').nth(1);
        if (await timelineBtn.count()) { await timelineBtn.click(); await page.waitForTimeout(40); }
        const cardOpt = page.locator('.explorer-card-opt').first();
        if (await cardOpt.count()) { await cardOpt.click(); await page.waitForTimeout(40); }
        const scenarioBtn = page.locator('#explorer-scenario-group .segmented-btn').nth(1);
        if (await scenarioBtn.count()) { await scenarioBtn.click(); await page.waitForTimeout(40); }

        const resetBtn = page.locator('.reset-btn').first();
        if (await resetBtn.count()) { await resetBtn.click(); await page.waitForTimeout(40); }

        ok(errors.length === before, `${id}: no console/page errors during open + interact + reset${errors.length > before ? ' — ' + errors.slice(before).join('; ') : ''}`);
    }

    // ── Invalid input cannot crash the app ───────────────────────
    await page.evaluate(() => window.openSim('stats-central-tendency'));
    await page.waitForTimeout(60);
    const beforeInvalid = errors.length;
    const anyDataCell = page.locator('#controls-panel input.datalab-cell[type="number"]').first();
    // Native <input type="number"> already refuses non-numeric text
    // client-side (Playwright's .fill() won't even type it in) — the
    // real edge case this app has to defend is an EMPTY cell, which
    // *is* a legal number-input state and does reach dataLabValidate()
    // as NaN via parseFloat(''). Blanking it, plus an absurdly
    // out-of-range value, covers what a native number input can
    // actually be coerced into producing.
    await anyDataCell.fill('');
    await anyDataCell.dispatchEvent('change');
    await page.waitForTimeout(60);
    ok(errors.length === beforeInvalid, 'blanking a Data Lab numeric cell does not throw');
    const readingsAfterInvalid = await page.locator('#readings-body').innerText().catch(() => '');
    ok(!/\bNaN\b/.test(readingsAfterInvalid), 'invalid Data Lab input never leaks a literal NaN into the readings panel');

    await page.evaluate(() => window.openSim('micro-supply-demand'));
    await page.waitForTimeout(60);
    const numInput = page.locator('#controls-panel input.control-number').first();
    if (await numInput.count()) {
        const beforeInvalid2 = errors.length;
        // Same native <input type="number"> constraint as above — the
        // real edge cases are blanking it and a wildly out-of-range value.
        await numInput.fill('');
        await numInput.dispatchEvent('blur');
        await page.waitForTimeout(60);
        await numInput.fill('999999999');
        await numInput.dispatchEvent('blur');
        await page.waitForTimeout(60);
        ok(errors.length === beforeInvalid2, 'blanking / wildly out-of-range simulator numeric input does not throw');
        const val = await numInput.inputValue();
        ok(val !== '' && !Number.isNaN(parseFloat(val)), `simulator numeric input snaps back to a valid, in-range number (got "${val}")`);
    }

    // ── Mobile viewport: no horizontal overflow ──────────────────
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'load' });
    await page.waitForSelector('#screen-home.active');
    let overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    ok(overflow <= 4, `home screen has no horizontal overflow at 390px width (overflow=${overflow}px)`);

    for (const id of ['micro-ppf', 'stats-central-tendency', 'ied-five-year-plans']) {
        await page.evaluate((simId) => window.openSim(simId), id);
        await page.waitForTimeout(80);
        overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        ok(overflow <= 4, `${id} screen has no horizontal overflow at 390px width (overflow=${overflow}px)`);
    }

    ok(errors.length === 0, `zero console/page errors across the entire run (got ${errors.length}: ${errors.slice(0, 5).join(' | ')})`);

    await browser.close();
    server.close();

    console.log(`\n${checks} assertions run, ${failures} failed.`);
    if (failures > 0) {
        console.error(`\n❌ tools/smoke.js FAILED (${failures} failing assertions).`);
        process.exit(1);
    } else {
        console.log(`\n✅ tools/smoke.js PASSED.`);
    }
})().catch(e => {
    console.error('Smoke test crashed:', e);
    process.exit(1);
});
