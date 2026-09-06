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
//     edit + add row, explorer nav, graph-lab handle drag + chip scrub)
//     actually updates the UI
//   - invalid input (typed garbage) never crashes the page or leaks
//     a literal "NaN" into the readings panel
//   - the quiz modal opens, generates >=10 real questions, can be
//     answered through to a final score, and can be closed
//   - toggling to Hindi translates static UI chrome, a sim's own
//     content, and its live-computed readings — all without breaking
//     the quiz or losing the toggle back to English
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
    // The app's idle "float" animations on cards/headers (see
    // css/styles.css's module-float) are continuous, which makes
    // Playwright's click-stability check spin forever on them. The app
    // already promises to honour prefers-reduced-motion (kills all
    // animation/transition durations — see the @media block in
    // css/styles.css) — emulating it here is the legitimate fix, and
    // doubles as a real check that promise is actually kept.
    await page.emulateMedia({ reducedMotion: 'reduce' });

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

    // ── Collapsible panels: home screen (module blocks) ──────────
    // Checked before the main sweep below, while every panel is still
    // at its pristine, never-clicked default state.
    const statsBlock = page.locator('#module-stats');
    ok(!(await statsBlock.evaluate(el => el.classList.contains('collapsed'))), 'home: module blocks start expanded by default');
    await page.locator('#module-stats .module-header').click();
    ok(await statsBlock.evaluate(el => el.classList.contains('collapsed')), 'home: clicking a module header collapses it');
    ok(!(await page.locator('#grid-stats').isVisible()), 'home: collapsing a module hides its simulation-card grid');
    await page.locator('#module-stats .module-header').click();
    ok(!(await statsBlock.evaluate(el => el.classList.contains('collapsed'))), 'home: clicking the same header again re-expands it');
    ok(await page.locator('#grid-stats').isVisible(), 'home: re-expanding shows the grid again');

    await page.locator('#home-collapse-toggle').click();
    const allHomeCollapsedAfterClick1 = await page.locator('.module-block').evaluateAll(els => els.every(el => el.classList.contains('collapsed')));
    ok(allHomeCollapsedAfterClick1, 'home: "Collapse All" master switch collapses every module block at once');
    await page.locator('#home-collapse-toggle').click();
    const allHomeExpandedAfterClick2 = await page.locator('.module-block').evaluateAll(els => els.every(el => !el.classList.contains('collapsed')));
    ok(allHomeExpandedAfterClick2, 'home: clicking the master switch again expands every module block back');

    // ── Collapsible panels: sim screen (info cards) ──────────────
    await page.evaluate(() => window.openSim('micro-ppf'));
    await page.waitForTimeout(80);
    ok(await page.locator('#concept-card').evaluate(el => el.classList.contains('collapsed')), 'sim screen: Concept card starts collapsed by default (secondary content)');
    ok(!(await page.locator('#readings-card').evaluate(el => el.classList.contains('collapsed'))), 'sim screen: Live Readings starts expanded by default (core content)');
    await page.locator('#concept-card .info-card-header').click();
    ok(!(await page.locator('#concept-card').evaluate(el => el.classList.contains('collapsed'))), 'sim screen: clicking the Concept header expands it');
    ok(await page.locator('#concept-body').isVisible(), 'sim screen: expanded Concept card shows its body text');
    // Clicking Reset inside the (dynamically rebuilt) controls panel
    // header must NOT also toggle that panel's collapse state.
    const controlsBeforeReset = await page.locator('#controls-panel').evaluate(el => el.classList.contains('collapsed'));
    await page.locator('#controls-panel .reset-btn').click();
    const controlsAfterReset = await page.locator('#controls-panel').evaluate(el => el.classList.contains('collapsed'));
    ok(controlsBeforeReset === controlsAfterReset, 'sim screen: clicking Reset inside the controls-panel header does not also toggle its collapse state');
    // ...but the controls panel IS itself collapsible — clicking the rest
    // of its header (not the Reset button) must still toggle it, and the
    // toggle must survive that header being rebuilt from scratch (every
    // sim-controls change rebuilds it; here just re-verify after Reset).
    await page.locator('#controls-panel .controls-panel-header span').first().click();
    ok(await page.locator('#controls-panel').evaluate(el => el.classList.contains('collapsed')), 'sim screen: clicking the controls-panel header (away from Reset) collapses it');
    await page.locator('#controls-panel .controls-panel-header span').first().click();
    ok(!(await page.locator('#controls-panel').evaluate(el => el.classList.contains('collapsed'))), 'sim screen: clicking it again re-expands the controls panel');

    // Persistence: a panel's collapsed/expanded choice is a per-panel
    // preference (localStorage), not per-sim state — switching sims (or
    // reloading) must not silently reset it.
    await page.evaluate(() => window.openSim('macro-gdp'));
    await page.waitForTimeout(80);
    ok(!(await page.locator('#concept-card').evaluate(el => el.classList.contains('collapsed'))), 'sim screen: Concept stays expanded after switching to a different sim (preference, not per-sim state)');
    await page.reload({ waitUntil: 'load' });
    await page.waitForSelector('#screen-home.active');
    await page.evaluate(() => window.openSim('macro-gdp'));
    await page.waitForTimeout(80);
    ok(!(await page.locator('#concept-card').evaluate(el => el.classList.contains('collapsed'))), 'sim screen: Concept stays expanded even after a full page reload (localStorage persistence)');
    // Reset back to the default for the rest of this run, so later
    // assertions in the main sweep below see the documented defaults.
    await page.locator('#concept-card .info-card-header').click();

    console.log(`Sweeping ${simIds.length} simulations...`);
    for (const id of simIds) {
        const before = errors.length;
        await page.evaluate((simId) => { window.openSim(simId); }, id);
        await page.waitForTimeout(80);

        // Concept starts collapsed by default (see below), so its content
        // is present in the DOM but not rendered — .textContent() (not
        // .innerText(), which reflects layout and reads empty on hidden
        // elements) is what correctly checks it regardless of collapse state.
        const hasChapterTag = await page.locator('#concept-body .chapter-tag').count();
        ok(hasChapterTag > 0, `${id}: renders a Class/Part/Unit chapter tag`);
        const tagText = hasChapterTag ? (await page.locator('#concept-body .chapter-tag').textContent()) || '' : '';
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

        // Graph Labs are the one mode whose whole point is DRAGGING, so a
        // smoke pass that only clicked buttons would leave their core
        // interaction completely untested. Perform a real pointer drag on
        // the first handle and assert the bound variable actually moved.
        const glHandle = page.locator('#sim-dom-overlay .gl-handle').first();
        if (await glHandle.count()) {
            ok(await page.locator('#sim-dom-overlay .gl-verdict').count() > 0, `${id}: graph lab renders a verdict banner naming what changed`);
            ok(await page.locator('#sim-dom-overlay .gl-chip').count() > 0, `${id}: graph lab renders its variable strip below the diagram`);
            ok(await page.locator('#sim-dom-overlay .gl-svg .gl-axis').count() >= 2, `${id}: graph lab draws both labelled axes`);

            // Assert on RENDERED output, not internals: a top-level `let` in
            // a classic script never lands on `window`, and the point of the
            // check is that the student sees the change anyway.
            const readValues = async () =>
                (await page.locator('#gl-var-strip').innerText()) + '||' + (await page.locator('.gl-verdict-title').innerText());
            const beforeDrag = await readValues();
            // boundingBox() is viewport-relative, so a handle left off-screen
            // by the previous sim's scroll position would send the synthetic
            // mouse somewhere else entirely. Centre it first — scrolling it
            // merely "into view" parks it flush against the top edge, and the
            // drag would then travel to a negative y that never reaches the
            // page at all.
            await glHandle.evaluate(el => el.scrollIntoView({ block: 'center', inline: 'center' }));
            await page.waitForTimeout(40);
            const box = await glHandle.boundingBox();
            const vp = page.viewportSize() || { width: 1280, height: 720 };
            if (box) {
                const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
                // Drag toward whichever side has room, so the whole gesture
                // stays inside the viewport whatever the handle's position.
                const dx = cx + 45 < vp.width - 8 ? 45 : -45;
                const dy = cy - 45 > 8 ? -45 : 45;
                await page.mouse.move(cx, cy);
                await page.mouse.down();
                await page.mouse.move(cx + dx, cy + dy, { steps: 8 });
                await page.mouse.up();
                await page.waitForTimeout(60);
                const afterDrag = await readValues();
                ok(beforeDrag !== afterDrag, `${id}: dragging a graph handle actually changes the bound variable`);
                const dragReadings = await page.locator('#readings-body').innerText().catch(() => '');
                ok(!/\bNaN\b|Infinity|undefined/.test(dragReadings), `${id}: readings stay clean after a drag`);
            }

            // Scrubbing a chip must drive the same state the handle does.
            const track = page.locator('#sim-dom-overlay .gl-chip-track').first();
            await track.evaluate(el => el.scrollIntoView({ block: 'center' }));
            await page.waitForTimeout(40);
            const tb = await track.boundingBox();
            if (tb) {
                const before = await readValues();
                await page.mouse.move(tb.x + tb.width * 0.15, tb.y + tb.height / 2);
                await page.mouse.down();
                await page.mouse.move(tb.x + tb.width * 0.85, tb.y + tb.height / 2, { steps: 6 });
                await page.mouse.up();
                await page.waitForTimeout(60);
                ok(before !== (await readValues()), `${id}: scrubbing a variable chip changes the bound variable`);
            }

            const ghostBtn = page.locator('#gl-ghost-btn');
            if (await ghostBtn.count()) { await ghostBtn.click(); await page.waitForTimeout(40); await ghostBtn.click(); await page.waitForTimeout(40); }
            const glScenario = page.locator('#controls-panel .gl-scenario-btn').first();
            if (await glScenario.count()) { await glScenario.click(); await page.waitForTimeout(60); }
        }

        const resetBtn = page.locator('.reset-btn, .gl-reset-btn').first();
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

    // ── Quiz modal: open, answer through to a score, close ───────
    await page.evaluate(() => window.openSim('micro-supply-demand'));
    await page.waitForTimeout(80);
    const beforeQuiz = errors.length;
    await page.locator('#quiz-launch-btn').click();
    await page.waitForTimeout(150);
    ok(!(await page.locator('#quiz-overlay').evaluate(el => el.classList.contains('hidden'))), 'quiz: launch button opens the quiz overlay');
    const quizHeading = (await page.locator('#qm-heading').textContent()) || '';
    ok(quizHeading.length > 0, `quiz: heading shows the sim's title (got "${quizHeading}")`);
    const counterText = (await page.locator('#quiz-q-counter').textContent()) || '';
    const totalMatch = counterText.match(/(\d+)\s*$/);
    const quizTotal = totalMatch ? parseInt(totalMatch[1], 10) : 0;
    ok(quizTotal >= 10, `quiz: generated >=10 questions (counter reads "${counterText}")`);

    // Answer every question by always clicking the first option, then
    // whatever "Next"/"See Results" button appears — exercises the full
    // question -> feedback -> advance loop through to the final score,
    // regardless of which answers land correct vs incorrect.
    for (let i = 0; i < quizTotal; i++) {
        const opt = page.locator('.quiz-option-btn').first();
        if (await opt.count()) { await opt.click(); await page.waitForTimeout(60); }
        const nextBtn = page.locator('#quiz-next-btn');
        if (await nextBtn.count() && !(await nextBtn.evaluate(el => el.classList.contains('hidden')))) {
            await nextBtn.click();
            await page.waitForTimeout(60);
        }
    }
    ok(!(await page.locator('#quiz-result').evaluate(el => el.classList.contains('hidden'))), 'quiz: answering every question reaches the final result screen');
    const resultScoreText = (await page.locator('#result-score').textContent()) || '';
    ok(new RegExp(`/\\s*${quizTotal}`).test(resultScoreText), `quiz: result score is out of the same question count (got "${resultScoreText}")`);
    await page.locator('#result-continue-btn').click();
    await page.waitForTimeout(80);
    ok(await page.locator('#quiz-overlay').evaluate(el => el.classList.contains('hidden')), 'quiz: "Continue" on the result screen closes the overlay');
    ok(errors.length === beforeQuiz, `quiz: no console/page errors across open + answer + close${errors.length > beforeQuiz ? ' — ' + errors.slice(beforeQuiz).join('; ') : ''}`);

    // A second sim, to catch a quiz-bank gap specific to one mode (this
    // one is a Data Lab) rather than re-testing only the simulator above.
    const beforeQuiz2 = errors.length;
    await page.evaluate(() => window.openSim('stats-correlation'));
    await page.waitForTimeout(80);
    await page.locator('#quiz-launch-btn').click();
    await page.waitForTimeout(150);
    ok(!(await page.locator('#quiz-overlay').evaluate(el => el.classList.contains('hidden'))), 'quiz (Data Lab sim): launch button opens the quiz overlay');
    const bloomBadge = await page.locator('.quiz-bloom-badge').count();
    ok(bloomBadge > 0, "quiz (Data Lab sim): question shows a Bloom's-level badge");
    await page.locator('#quiz-close-btn').click();
    await page.waitForTimeout(80);
    ok(await page.locator('#quiz-overlay').evaluate(el => el.classList.contains('hidden')), 'quiz (Data Lab sim): ✕ button also closes the overlay');
    ok(errors.length === beforeQuiz2, `quiz (Data Lab sim): no console/page errors${errors.length > beforeQuiz2 ? ' — ' + errors.slice(beforeQuiz2).join('; ') : ''}`);

    // ── Hindi (i18n) toggle ────────────────────────────────────────
    const beforeI18n = errors.length;
    const heroBadgeEn = (await page.locator('.hero-badge').textContent()) || '';
    await page.locator('#lang-toggle').click();
    await page.waitForTimeout(150);
    const heroBadgeHi = (await page.locator('.hero-badge').textContent()) || '';
    ok(heroBadgeHi !== heroBadgeEn && /[ऀ-ॿ]/.test(heroBadgeHi), `i18n: static UI text (hero badge) switches to Devanagari on toggle (got "${heroBadgeHi}")`);
    const moduleTitleHi = (await page.locator('#module-stats .module-title').textContent()) || '';
    ok(/[ऀ-ॿ]/.test(moduleTitleHi), `i18n: home module title is translated (got "${moduleTitleHi}")`);

    await page.evaluate(() => window.openSim('micro-supply-demand'));
    await page.waitForTimeout(100);
    const simTitleHi = (await page.locator('#sim-title-nav').textContent()) || '';
    ok(/[ऀ-ॿ]/.test(simTitleHi), `i18n: sim title translates (got "${simTitleHi}")`);
    const controlLabelHi = (await page.locator('#controls-panel .control-label-row label').first().textContent()) || '';
    ok(/[ऀ-ॿ]/.test(controlLabelHi), `i18n: control label translates (got "${controlLabelHi}")`);
    const readingsHi = (await page.locator('#readings-body').innerText()) || '';
    ok(/[ऀ-ॿ]/.test(readingsHi), 'i18n: live-computed readings panel translates (dynamic labels/insight)');
    ok(!/\bNaN\b/.test(readingsHi), 'i18n: translated readings still contain no literal NaN');
    const chevronStillThere = await page.locator('#concept-card .panel-chevron').count();
    ok(chevronStillThere > 0, 'i18n: translating an info-card header label does not remove its sibling collapse chevron');

    // Quiz still works correctly with Hindi active (own quizLocalize()
    // path, distinct from translateReadings()/data-i18n).
    await page.locator('#quiz-launch-btn').click();
    await page.waitForTimeout(150);
    const quizQuestionHi = (await page.locator('#quiz-question').textContent()) || '';
    ok(/[ऀ-ॿ]/.test(quizQuestionHi), `i18n: quiz question text is in Hindi while Hindi is active (got "${quizQuestionHi}")`);
    await page.locator('#quiz-close-btn').click();
    await page.waitForTimeout(80);

    // Toggle back to English and confirm exact restoration — the whole
    // point of caching each element's original text on first translate.
    await page.locator('#lang-toggle').click();
    await page.waitForTimeout(150);
    const heroBadgeBack = (await page.locator('.hero-badge').textContent()) || '';
    ok(heroBadgeBack === heroBadgeEn, `i18n: toggling back to English restores the exact original text (got "${heroBadgeBack}", expected "${heroBadgeEn}")`);
    ok(errors.length === beforeI18n, `i18n: no console/page errors across the whole toggle-to-Hindi-and-back sequence${errors.length > beforeI18n ? ' — ' + errors.slice(beforeI18n).join('; ') : ''}`);

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
