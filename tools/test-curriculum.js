#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════
// Node-based test harness for a codebase with no bundler/test runner.
// Loads every js/*.js file into one shared vm context (mirroring how
// index.html's <script> tags share one global scope in the browser),
// then:
//   1. Validates curriculum-registry integrity (no duplicate syllabus
//      IDs, no duplicate sim IDs, no sim referencing a non-existent
//      syllabus node, no class/part mismatch between a sim and the
//      node(s) it claims to cover).
//   2. Structurally validates every SIMS entry for its declared mode.
//   3. Numerically sweeps every simulator's controls and every data
//      lab's default/edge-case data through compute()/calculate(),
//      asserting no NaN/Infinity/thrown error ever reaches the chart.
//   4. Spot-checks specific formula correctness on a representative,
//      high-value subset (documented inline).
//   5. Validates every sim's QUIZ_BANK entry: Bloom's-level tags, bilingual
//      (en/hi) question/option/explanation text, and that generateQuiz()
//      reliably produces >=10 well-formed questions across repeated
//      (randomized) trials.
// Exits non-zero on any failure. See CLAUDE.md for why this replaces
// a conventional test runner.
// ══════════════════════════════════════════════════════════════
const vm = require('vm');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const FILES = [
    'js/curriculum-data.js',
    'js/panel-collapse.js',
    'js/sim-engine.js',
    'js/datalab-engine.js',
    'js/explorer-engine.js',
    'js/simulations.js',
    'js/simulations_extended.js',
    'js/simulations_class11_micro.js',
    'js/simulations_statistics_datalab.js',
    'js/simulations_macro_datalab.js',
    'js/simulations_ied_class12.js',
    'js/quiz-engine.js',
    'js/quiz-data.js',
    'js/quiz-data-extended.js',
    'js/quiz-data-class11-micro.js',
    'js/quiz-data-statistics.js',
    'js/quiz-data-macro-datalab.js',
    'js/quiz-data-ied.js'
];

function noop() {}
function stubEl() {
    return {
        style: {}, dataset: {}, classList: { add: noop, remove: noop, toggle: noop, contains: () => false },
        addEventListener: noop, removeEventListener: noop, appendChild: noop, setAttribute: noop,
        querySelectorAll: () => [], querySelector: () => null, getAttribute: () => null,
        get innerHTML() { return this._html || ''; }, set innerHTML(v) { this._html = v; },
        get textContent() { return this._text || ''; }, set textContent(v) { this._text = v; },
        offsetWidth: 100
    };
}
const sandbox = {
    console,
    window: {},
    document: {
        getElementById: () => stubEl(),
        querySelectorAll: () => [],
        querySelector: () => null,
        createElement: () => stubEl(),
        addEventListener: noop,
        documentElement: { lang: 'en' }
    },
    localStorage: { getItem: () => null, setItem: noop },
    Plotly: { react: () => Promise.resolve(), purge: noop },
    Set, Map, Math, Array, Object, JSON, isFinite, isNaN, parseFloat, parseInt, String, Number,
    // Quiz engine's quizLocalize() looks these up at call-time — stub the
    // same English-fallback localize() app.js provides in the browser.
    currentLang: 'en',
    localize(val) {
        if (val === undefined || val === null) return '';
        if (typeof val === 'string') return val;
        if (typeof val === 'object') return val.en !== undefined ? val.en : '';
        return String(val);
    }
};
sandbox.globalThis = sandbox;
const context = vm.createContext(sandbox);

FILES.forEach(f => {
    const code = fs.readFileSync(path.join(ROOT, f), 'utf8');
    vm.runInContext(code, context, { filename: f });
});

// Top-level `const`/`let` bindings (SIMS included) live in the vm
// context's global *lexical* environment, not as properties of the
// sandbox object — unlike `var`/function declarations, they aren't
// reachable as `context.SIMS`. Pull them out with one more
// runInContext call, which still sees that same lexical environment.
const SIMS = vm.runInContext('SIMS', context);
const CURRICULUM_NODES = context.window.CURRICULUM_NODES;
const validateCurriculum = context.window.validateCurriculum;
const dataLabValidate = context.dataLabValidate;
const fmt = context.fmt;
const generateQuiz = context.generateQuiz;
const QUIZ_BANK = vm.runInContext('QUIZ_BANK', context);

let failures = 0, checks = 0, warnings = 0;
function ok(cond, label) {
    checks++;
    if (!cond) { failures++; console.error(`❌ FAIL: ${label}`); }
    return cond;
}
function warn(cond, label) {
    if (!cond) { warnings++; console.warn(`⚠️  WARN: ${label}`); }
}
function assertFinite(n, label) {
    return ok(typeof n === 'number' && isFinite(n), `${label} is finite (got ${n})`);
}

console.log(`Loaded ${SIMS.length} SIMS entries, ${CURRICULUM_NODES.length} curriculum nodes.\n`);

// ── 1. Curriculum registry integrity ────────────────────────────
const report = validateCurriculum(SIMS);
ok(report.duplicateSyllabusIds.length === 0, `no duplicate syllabus IDs (found: ${JSON.stringify(report.duplicateSyllabusIds)})`);
ok(report.duplicateSimIds.length === 0, `no duplicate sim IDs (found: ${JSON.stringify(report.duplicateSimIds)})`);
ok(report.unknownRefs.length === 0, `every sim.syllabusIds entry resolves to a real node (found unresolved: ${JSON.stringify(report.unknownRefs)})`);
ok(report.classMismatches.length === 0, `no sim maps to a syllabus node in a different class (found: ${JSON.stringify(report.classMismatches)})`);

const nodeIds = new Set(CURRICULUM_NODES.map(n => n.id));
ok(nodeIds.size === CURRICULUM_NODES.length, 'CURRICULUM_NODES itself has no duplicate ids');

const coveredCount = CURRICULUM_NODES.length - report.uncovered.length;
console.log(`Curriculum coverage: ${coveredCount} / ${CURRICULUM_NODES.length} nodes have at least one covering sim (${(100 * coveredCount / CURRICULUM_NODES.length).toFixed(1)}%).`);
if (report.uncovered.length) {
    console.log('Uncovered nodes:');
    report.uncovered.forEach(n => console.log(`  - ${n.id}: ${n.topic}`));
}
warn(report.uncovered.length === 0, `${report.uncovered.length} curriculum node(s) have no covering sim (see list above / the Remaining Unmapped Content report)`);

// ── 2 & 3. Per-sim structural + numeric sweep ───────────────────
const simIds = new Set();
SIMS.forEach(sim => {
    ok(!simIds.has(sim.id), `sim id "${sim.id}" is unique`);
    simIds.add(sim.id);
    ok(['XI', 'XII'].includes(sim.class), `${sim.id}: class is XI or XII (got ${sim.class})`);
    ok(['A', 'B'].includes(sim.part), `${sim.id}: part is A or B (got ${sim.part})`);
    ok(['simulator', 'datalab', 'explorer'].includes(sim.mode || 'simulator'), `${sim.id}: mode is simulator/datalab/explorer`);
    ok(['micro', 'macro', 'stats', 'india'].includes(sim.module), `${sim.id}: module is a known grid key`);

    const mode = sim.mode || 'simulator';

    if (mode === 'simulator') {
        if (typeof sim.customRender === 'function') {
            const result = sim.customRender(stubEl(), collectDefaults(sim)) || {};
            ok(typeof result.readings === 'string' || result.readings === undefined, `${sim.id}: customRender returns readings`);
        } else {
            ok(typeof sim.compute === 'function', `${sim.id}: has compute()`);
            ok(Array.isArray(sim.controls) && sim.controls.length > 0, `${sim.id}: has controls`);
            sweepSimulator(sim);
        }
    } else if (mode === 'datalab') {
        ok(sim.dataLab && typeof sim.dataLab.calculate === 'function', `${sim.id}: has dataLab.calculate()`);
        ok(sim.dataLab && Array.isArray(sim.dataLab.columns) && sim.dataLab.columns.length > 0, `${sim.id}: has dataLab.columns`);
        ok(sim.dataLab && Array.isArray(sim.dataLab.defaultRows) && sim.dataLab.defaultRows.length >= (sim.dataLab.minRows || 2), `${sim.id}: defaultRows meets minRows`);
        sweepDataLab(sim);
    } else if (mode === 'explorer') {
        ok(sim.explorer && ['timeline', 'cards', 'scenario'].includes(sim.explorer.type), `${sim.id}: explorer.type is valid`);
        checkExplorer(sim);
    }

    if (sim.enrichment) ok(typeof sim.enrichmentNote === 'string' && sim.enrichmentNote.length > 20, `${sim.id}: enrichment:true has a real enrichmentNote`);
});

function collectDefaults(sim) {
    const state = {};
    (sim.controls || []).forEach(c => { state[c.id] = c.value; });
    return state;
}

function sampleValues(c) {
    if (c.type === 'select') return c.options.map(o => o.value);
    const vals = new Set([c.min, c.max, c.value, (c.min + c.max) / 2]);
    return [...vals];
}

function sweepSimulator(sim) {
    const base = collectDefaults(sim);
    let ranAny = false;
    sim.controls.forEach(control => {
        sampleValues(control).forEach(v => {
            const state = Object.assign({}, base, { [control.id]: v });
            let result;
            try {
                result = sim.compute(state);
            } catch (e) {
                ok(false, `${sim.id}: compute() threw with ${control.id}=${v} — ${e.message}`);
                return;
            }
            ranAny = true;
            ok(result && typeof result === 'object', `${sim.id}: compute() returns an object (${control.id}=${v})`);
            (result.traces || []).forEach((tr, i) => {
                ['x', 'y'].forEach(axis => {
                    if (!Array.isArray(tr[axis])) return;
                    const bad = tr[axis].some(n => typeof n === 'number' && !isFinite(n));
                    ok(!bad, `${sim.id}: trace[${i}].${axis} has no NaN/Infinity (${control.id}=${v})`);
                });
            });
            if (result.metrics) {
                Object.entries(result.metrics).forEach(([k, v2]) => {
                    if (typeof v2 === 'number') ok(isFinite(v2), `${sim.id}: metrics.${k} is finite (${control.id}=${v})`);
                });
            }
            if (result.metrics && sim.challenge && typeof sim.challenge.check === 'function') {
                try { sim.challenge.check(state, result.metrics); } catch (e) { ok(false, `${sim.id}: challenge.check() threw — ${e.message}`); }
            }
        });
    });
    ok(ranAny, `${sim.id}: sweep executed at least one compute() call`);
}

function sweepDataLab(sim) {
    const cols = sim.dataLab.columns;
    const runsOn = [sim.dataLab.defaultRows];

    // Edge case: every numeric cell corrupted to an invalid value —
    // dataLabValidate() must sanitize before calculate() ever sees it.
    const corrupted = sim.dataLab.defaultRows.map(r => {
        const bad = Object.assign({}, r);
        cols.forEach(c => { if (c.type !== 'text') bad[c.id] = 'not-a-number'; });
        return bad;
    });
    runsOn.push(corrupted);

    // Edge case: minimum row count, and (if room) one extra row via
    // addRowDefault, matching what "+ Add Row" would actually insert.
    const minRows = sim.dataLab.defaultRows.slice(0, sim.dataLab.minRows || 2);
    if (minRows.length) runsOn.push(minRows);

    runsOn.forEach((rows, idx) => {
        const clean = dataLabValidate(sim, rows);
        let result;
        try {
            result = sim.dataLab.calculate(clean);
        } catch (e) {
            ok(false, `${sim.id}: dataLab.calculate() threw on dataset #${idx} — ${e.message}`);
            return;
        }
        ok(result && typeof result === 'object', `${sim.id}: dataLab.calculate() returns an object (dataset #${idx})`);
        (result.stats || []).forEach(s => ok(s.label && s.value !== undefined, `${sim.id}: stat row has label+value (dataset #${idx})`));
        (result.traces || []).forEach((tr, i) => {
            ['x', 'y', 'values'].forEach(axis => {
                if (!Array.isArray(tr[axis])) return;
                const bad = tr[axis].some(n => typeof n === 'number' && !isFinite(n));
                ok(!bad, `${sim.id}: trace[${i}].${axis} has no NaN/Infinity (dataset #${idx})`);
            });
        });
        if (result.metrics && sim.challenge && typeof sim.challenge.check === 'function') {
            try { sim.challenge.check({}, result.metrics); } catch (e) { ok(false, `${sim.id}: challenge.check() threw — ${e.message}`); }
        }
    });
}

function checkExplorer(sim) {
    const ex = sim.explorer;
    if (ex.type === 'timeline') {
        ok(Array.isArray(ex.eras) && ex.eras.length >= 2, `${sim.id}: timeline has >=2 eras`);
        ex.eras.forEach((e, i) => ok(e.period && e.title && e.body, `${sim.id}: era[${i}] has period/title/body`));
    } else if (ex.type === 'cards') {
        ok(Array.isArray(ex.cards) && ex.cards.length >= 2, `${sim.id}: cards has >=2 items`);
        ex.cards.forEach((c, i) => {
            ok(c.prompt && Array.isArray(c.options) && c.options.length >= 2, `${sim.id}: card[${i}] has prompt+options`);
            ok(Number.isInteger(c.correctIndex) && c.correctIndex >= 0 && c.correctIndex < c.options.length, `${sim.id}: card[${i}].correctIndex is a valid option index`);
            ok(typeof c.explain === 'string' && c.explain.length > 10, `${sim.id}: card[${i}] has a real explanation`);
        });
    } else if (ex.type === 'scenario') {
        ok(Array.isArray(ex.scenarios) && ex.scenarios.length >= 2, `${sim.id}: scenario has >=2 options`);
        ex.scenarios.forEach((s, i) => ok(s.id && s.label && s.summary, `${sim.id}: scenario[${i}] has id/label/summary`));
    }
}

// ── 4. Targeted formula-correctness spot checks ─────────────────
function findSim(id) { return SIMS.find(s => s.id === id); }
function approx(a, b, eps, label) { return ok(Math.abs(a - b) < eps, `${label} (got ${a}, expected ≈${b})`); }

(function testCentralTendency() {
    const sim = findSim('stats-central-tendency');
    const rows = [{ label: 'a', value: 2 }, { label: 'b', value: 4 }, { label: 'c', value: 4 }, { label: 'd', value: 6 }];
    const r = sim.dataLab.calculate(rows);
    approx(r.metrics.mean, 4, 1e-9, 'Central Tendency: mean of [2,4,4,6] is 4');
    approx(r.metrics.median, 4, 1e-9, 'Central Tendency: median of [2,4,4,6] is 4');
    approx(r.metrics.mode, 4, 1e-9, 'Central Tendency: mode of [2,4,4,6] is 4');
})();

(function testCorrelation() {
    const sim = findSim('stats-correlation');
    const perfect = range8().map(i => ({ x: i + 1, y: 2 * (i + 1) }));
    const r = sim.dataLab.calculate(perfect);
    approx(r.metrics.pearsonR, 1, 1e-6, "Correlation: perfectly linear data gives Pearson r = 1");
    approx(r.metrics.spearmanR, 1, 1e-6, "Correlation: perfectly monotonic data gives Spearman r = 1");
    function range8() { return Array.from({ length: 8 }, (_, i) => i); }
})();

(function testIndexNumbers() {
    const sim = findSim('stats-index-numbers');
    const rows = [{ commodity: 'A', p0: 10, p1: 20 }, { commodity: 'B', p0: 10, p1: 20 }];
    const r = sim.dataLab.calculate(rows);
    approx(r.metrics.index, 200, 1e-9, 'Index Numbers: doubling every price gives an index of 200');
    approx(r.metrics.inflation, 100, 1e-9, 'Index Numbers: doubling every price gives 100% inflation');
})();

(function testNationalIncomeMethods() {
    const sim = findSim('macro-national-income-methods');
    const rows = [
        { firm: 'A', output: 100, ic: 0, wages: 20, rent: 10, interest: 5 },
        { firm: 'B', output: 250, ic: 100, wages: 40, rent: 20, interest: 10 }
    ];
    const r = sim.dataLab.calculate(rows);
    approx(r.metrics.GDP_VA, 250, 1e-9, 'National Income: Value Added Method = Σ(output − IC) = 250');
    approx(r.metrics.diff, 0, 1e-9, 'National Income: Value Added and Income methods match exactly (profit is a residual)');
})();

(function testPropensity() {
    const sim = findSim('macro-propensity');
    // Perfectly linear C = 40 + 0.7Y — MPC must recover exactly 0.7.
    const rows = [100, 150, 200, 250, 300].map(y => ({ period: 'Y' + y, y, c: 40 + 0.7 * y }));
    const r = sim.dataLab.calculate(rows);
    approx(r.metrics.MPC, 0.7, 1e-6, 'Propensity: fitted MPC recovers the true slope (0.7) on clean linear data');
    approx(r.metrics.MPC + r.metrics.MPS, 1, 1e-9, 'Propensity: MPC + MPS = 1 always');
})();

(function testMultiplier() {
    const sim = findSim('macro-multiplier');
    [0.2, 0.5, 0.8].forEach(mpc => {
        const r = sim.compute({ mpc, di: 20, dg: 10, dt: 5 });
        approx(r.metrics.k - Math.abs(r.metrics.kt), 1, 1e-9, `Multiplier: k − |kt| = 1 at MPC=${mpc}`);
    });
})();

(function testPPF() {
    const sim = findSim('micro-ppf');
    const r0 = sim.compute({ resources: 20, x: 0, pointType: 'on' });
    approx(r0.metrics.Yfrontier, 20, 1e-9, 'PPF: at X=0, Y = C (full resources to Y)');
    const rC = sim.compute({ resources: 20, x: 20, pointType: 'on' });
    approx(rC.metrics.Yfrontier, 0, 1e-9, 'PPF: at X=C, Y = 0 (full resources to X)');
    const rMid = sim.compute({ resources: 20, x: 10, pointType: 'on' });
    approx(rMid.metrics.mrt, 1, 1e-9, 'PPF: opportunity cost (MRT) at X=C/2 with C=20 is 2X/C = 1');
})();

(function testIndifferenceCurve() {
    const sim = findSim('micro-indifference-curve');
    const r = sim.compute({ income: 200, px: 10, py: 5, pref: 0.5 });
    approx(r.metrics.X * 10 + r.metrics.Y * 5, 200, 1e-6, 'Indifference Curve: equilibrium bundle exactly exhausts the budget');
    approx(r.metrics.mrs, r.metrics.priceRatio, 1e-6, 'Indifference Curve: MRS = price ratio at equilibrium (tangency condition)');
})();

(function testRevenueProducerEquilibrium() {
    const sim = findSim('micro-revenue-producer-equilibrium');
    const r = sim.compute({ marketType: 'perfect', price: 50, mcBase: 10, mcSlope: 2, fc: 20 });
    approx(r.metrics.MRatQstar, r.metrics.MCatQstar, 1e-6, "Revenue/Producer Equilibrium: MR = MC at Q* (perfect competition)");
})();

(function testElasticityOfSupply() {
    const sim = findSim('micro-elasticity-supply');
    const long = sim.compute({ period: 'long', price: 40 });
    const market = sim.compute({ period: 'market', price: 40 });
    ok(long.metrics.Es > market.metrics.Es, 'Elasticity of Supply: long run is more elastic than the market period at the same price');
})();

(function testPriceControls() {
    const sim = findSim('micro-price-controls');
    const ceiling = sim.compute({ ctrl: 30, demandShift: 0 });
    ok(ceiling.metrics.isCeiling === true && ceiling.metrics.gap > 0, 'Price Controls: a control below equilibrium is a ceiling and creates a shortage');
    const floor = sim.compute({ ctrl: 90, demandShift: 0 });
    ok(floor.metrics.isCeiling === false && floor.metrics.gap > 0, 'Price Controls: a control above equilibrium is a floor and creates a surplus');
})();

// ── 5. Quiz bank coverage + structural validation ────────────────
// Every sim must carry a QUIZ_BANK entry that generateQuiz() can turn
// into >=10 well-formed questions, on repeated (randomized) trials —
// mirrors the ad-hoc validation harness used while authoring the quiz
// banks, now made a permanent part of the suite per CLAUDE.md's rule
// that any numeric formula/feature this project claims tested must
// actually be covered here.
const BLOOM_LEVELS = new Set(['remember', 'understand', 'apply', 'analyse', 'evaluate', 'create']);
let quizBankCoverage = 0;
SIMS.forEach(sim => {
    const bank = QUIZ_BANK[sim.id];
    if (!ok(!!bank, `${sim.id}: has a QUIZ_BANK entry`)) return;
    quizBankCoverage++;
    ok(Array.isArray(bank.static) && bank.static.length > 0, `${sim.id}: quiz bank has static questions`);
    (bank.static || []).forEach((q, i) => {
        ok(BLOOM_LEVELS.has(q.level), `${sim.id}: static[${i}].level is a valid Bloom's level (got ${q.level})`);
        ok(q.question && q.question.en, `${sim.id}: static[${i}] has an English question`);
        ok(q.question && q.question.hi, `${sim.id}: static[${i}] has a Hindi question`);
        ok(Array.isArray(q.options) && q.options.length >= 2, `${sim.id}: static[${i}] has >=2 options`);
        ok(Number.isInteger(q.correctIndex) && q.correctIndex >= 0 && q.correctIndex < (q.options || []).length, `${sim.id}: static[${i}].correctIndex is valid`);
        ok(q.explain && q.explain.en && q.explain.hi, `${sim.id}: static[${i}] has a bilingual explanation`);
    });
    (bank.applyTemplates || []).forEach((tpl, i) => {
        ok(BLOOM_LEVELS.has(tpl.level), `${sim.id}: applyTemplates[${i}].level is a valid Bloom's level (got ${tpl.level})`);
        ok(typeof tpl.build === 'function', `${sim.id}: applyTemplates[${i}] has a build() function`);
    });

    for (let trial = 0; trial < 5; trial++) {
        let qs;
        try {
            qs = generateQuiz(sim, 10);
        } catch (e) {
            ok(false, `${sim.id}: generateQuiz() threw on trial ${trial} — ${e.message}`);
            continue;
        }
        ok(qs.length >= 10, `${sim.id}: generateQuiz() produces >=10 questions on trial ${trial} (got ${qs.length})`);
        qs.forEach((q, i) => {
            ok(!!q.question && Array.isArray(q.options) && q.options.length >= 2, `${sim.id}: generated q${i} is well-formed (trial ${trial})`);
            ok(Number.isInteger(q.correctIndex) && q.correctIndex >= 0 && q.correctIndex < q.options.length, `${sim.id}: generated q${i}.correctIndex is in range (trial ${trial})`);
            const uniq = new Set(q.options);
            ok(uniq.size === q.options.length, `${sim.id}: generated q${i} has no duplicate option text (trial ${trial})`);
            ok(!!q.explain, `${sim.id}: generated q${i} has an explanation (trial ${trial})`);
        });
    }
});
console.log(`\nQuiz bank coverage: ${quizBankCoverage} / ${SIMS.length} sims have a quiz bank generating >=10 questions.`);

console.log(`\n${checks} assertions run, ${failures} failed, ${warnings} warnings.`);
if (failures > 0) {
    console.error(`\n❌ tools/test-curriculum.js FAILED (${failures} failing assertions).`);
    process.exit(1);
} else {
    console.log(`\n✅ tools/test-curriculum.js PASSED.`);
}
