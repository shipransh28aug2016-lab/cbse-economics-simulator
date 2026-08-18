#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════
// CBSE V-LAB — headless-browser smoke test (spec §24 "build").
// Mirrors tools/smoke.js in the parent EconSim Pro app: serves vlab/
// over a local static server, drives the full one-experiment student
// workflow with Playwright/Chromium end to end, and asserts zero
// console/page errors at a desktop and a mobile viewport.
//
// Workflow driven, matching what a real student does:
//   pre-lab MCQs -> begin experiment -> acidify + heat -> titrate by
//   watching the beaker's own colour feedback (not a hard-coded
//   titre — the unknown molarity is randomised per session) -> record
//   two concordant trials -> compute molarity from the app's own mean
//   titre -> pass Notebook validation -> answer 3 viva questions ->
//   fill the post-lab short answer -> Mark Complete.
// ══════════════════════════════════════════════════════════════
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.join(__dirname, '..');
const PORT = 8792;
const MIME = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json' };

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

const BENIGN_URL_PATTERNS = [/\/favicon\.ico$/];

async function titrateToEndpoint(page) {
    await page.click('#addAcidBtn');
    await page.fill('#tempRange', '65');
    await page.dispatchEvent('#tempRange', 'input');
    let vol = 0;
    for (let i = 0; i < 300; i++) {
        const caption = (await page.textContent('.beaker-caption')).trim();
        if (caption === 'endpoint') return true;
        if (caption === 'overshot') return false;
        vol = Math.min(50, Math.round((vol + 0.2) * 10) / 10);
        await page.fill('#buretteRange', String(vol));
        await page.dispatchEvent('#buretteRange', 'input');
    }
    return false;
}

async function runWorkflow(page, label) {
    await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'load' });
    await page.waitForSelector('#app .glass-panel');

    await page.click('[data-prelab="pre-1"][data-idx="1"]');
    await page.click('[data-prelab="pre-2"][data-idx="2"]');
    ok(!(await page.isDisabled('#beginExperimentBtn')), `${label}: begin-experiment unlocks after both pre-lab MCQs`);
    await page.click('#beginExperimentBtn');
    await page.waitForSelector('.beaker');

    ok(await titrateToEndpoint(page), `${label}: trial 1 reaches a visible endpoint via burette-slider drag`);
    ok(!(await page.isDisabled('#recordTitreBtn')), `${label}: record button enables once titrant has been added`);
    await page.click('#recordTitreBtn');
    await page.waitForSelector('.obs-table');

    await page.click('[data-screen="workspace"]');
    await page.click('#resetTrialBtn');
    ok(await titrateToEndpoint(page), `${label}: trial 2 (retry path) reaches a visible endpoint`);
    await page.click('#recordTitreBtn');

    ok((await page.textContent('#notebook-panel')).includes('concordant'), `${label}: two same-condition trials are recognised as concordant`);

    const molInput = await page.$('#molarityInput');
    ok(!!molInput && !(await molInput.isDisabled()), `${label}: molarity input enables once a mean concordant titre exists`);
    const meanTitreText = await page.textContent('#calc-panel .panel-body');
    const m = /Mean titre = ([\d.]+) mL/.exec(meanTitreText);
    ok(!!m, `${label}: Calculation panel displays the mean titre`);
    const meanTitre = parseFloat(m[1]);
    const molarity = (2 * 0.05 * 10) / (5 * meanTitre);
    await page.fill('#molarityInput', molarity.toFixed(4));
    await page.click('#checkAnswerBtn');
    ok((await page.textContent('#calc-panel')).includes('Within 5% of the accepted value'), `${label}: the app's own inverse-formula answer is accepted within its own tolerance`);

    await page.click('[data-screen="viva"]');
    const vivaCount = await page.$$eval('[data-viva-toggle]', els => els.length);
    ok(vivaCount >= 5, `${label}: viva bank has a real question count (${vivaCount})`);
    for (let i = 0; i < Math.min(3, vivaCount); i++) await page.click(`[data-viva-toggle="${i}"]`);

    await page.click('[data-screen="assessment"]');
    await page.fill('#shortAnswerInput', 'Overheating decomposes oxalic acid before it can react, giving a too-low titre and an inflated calculated molarity.');
    ok(!(await page.isDisabled('#markCompleteBtn')), `${label}: Mark Complete enables live once calc+viva+short-answer are all satisfied (no full re-render needed while typing)`);
    await page.click('#markCompleteBtn');
    ok((await page.textContent('#completeNote')).includes('marked complete'), `${label}: completing the experiment updates the progress note`);
    ok((await page.textContent('.header-strip')).includes('✓ Assessment'), `${label}: header progress strip reflects Assessment done`);
}

(async () => {
    const server = await startServer();
    const executablePath = fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined;
    const browser = await chromium.launch({ executablePath });

    for (const vp of [{ label: 'desktop', width: 1280, height: 900 }, { label: 'mobile', width: 375, height: 700 }]) {
        const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
        await page.emulateMedia({ reducedMotion: 'reduce' });
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

        try {
            await runWorkflow(page, vp.label);
        } catch (e) {
            failures++; checks++;
            console.error(`❌ FAIL: ${vp.label} workflow threw: ${e.message}`);
        }

        // No horizontal overflow at the mobile viewport.
        if (vp.label === 'mobile') {
            const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
            ok(overflow <= 1, `mobile: no horizontal overflow (scrollWidth-clientWidth=${overflow})`);
        }

        // Offline test (spec §19/§24): once the service worker has taken
        // control, the app shell must still load with the network cut off.
        if (vp.label === 'desktop') {
            try {
                await page.evaluate(() => navigator.serviceWorker && navigator.serviceWorker.ready);
                await page.context().setOffline(true);
                await page.reload({ waitUntil: 'load' });
                await page.waitForSelector('#app .glass-panel', { timeout: 10000 });
                ok(true, 'offline: app shell reloads from cache with network disabled');
                await page.context().setOffline(false);
            } catch (e) {
                ok(false, `offline: app shell failed to reload from cache — ${e.message}`);
                await page.context().setOffline(false).catch(() => {});
            }
        }

        if (errors.length) {
            failures++; checks++;
            console.error(`❌ FAIL: ${vp.label} had console/page errors:\n  ${errors.join('\n  ')}`);
        }

        await page.close();
    }

    await browser.close();
    server.close();

    console.log(`\n${checks - failures}/${checks} vlab smoke checks passed.`);
    if (failures > 0) {
        console.error(`\n❌ vlab/tools/smoke.js FAILED (${failures} failing assertions).`);
        process.exit(1);
    }
    console.log('✅ vlab/tools/smoke.js PASSED — zero console/page errors, full student workflow, desktop + mobile.');
})().catch(e => { console.error('vlab smoke test crashed:', e); process.exit(1); });
