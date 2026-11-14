// ══════════════════════════════════════════════════════════════
// js/life-engine.js — the Living Economy: economics you live, then name
// ══════════════════════════════════════════════════════════════
// Every other mode in this app starts from the diagram: here is the curve,
// move it. A Living World starts from a LIFE: you run a chai stall, sell in
// a mandi, manage a bank, present a budget. You take a decision, people
// react, money comes in or doesn't — and only after you have felt the
// pattern does the app tell you what the textbook calls it, using YOUR OWN
// days as the evidence. This is the experiential cycle NEP 2020 asks for:
//
//     LIVE (decide) → SEE (consequence) → NOTICE (your own data)
//                   → NAME (the concept) → APPLY (the lab, the exam)
//
// The honesty contract is the same one the rest of the app keeps:
//
//   • A world is a pure model: `step(state, decision, round, rng)` and the
//     functions on `world.truth`. The scene, ledger, chart, narration and
//     debrief only ever READ what that model produced. Nothing drawn here
//     is authored separately from the numbers.
//   • Randomness is seeded (lifeRng) — the same seed and the same decisions
//     always replay the same life, so a run can be tested and re-examined.
//   • A debrief insight is a claim about the student's own history. Each one
//     carries `holds` (computed from that history) and is shown as "lived"
//     only when it is true of what they actually did; otherwise it is shown
//     as something still to discover, never as something they proved.
//   • No world invents economics beyond its syllabus node; anything that is
//     an illustration (e.g. jobs shown proportional to output) says so.
//
// The world contract is documented on LIFE_WORLDS below; the worlds live in
// js/life-worlds.js. Tested in tools/test-curriculum.js (testLife*) and
// driven end-to-end by tools/smoke.js.

/* exported LIFE_WORLDS, lifeRng, lifeNewRun, lifeCommit, lifeDecisionDefaults, lifeClampDecision,
   lifeOpen, lifeClose, lifeRender, lifeBuildHub, lifeJournal, lifeMachine, lifeCurrentRun, lifePlain, lifeT, B2, rupee */

// ── World contract ────────────────────────────────────────────────
// {
//   id, icon, accent,                     // card identity
//   title, role, tagline: {en, hi}
//   class, part, unit, unitTitle, syllabusIds: [...], labs: [sim ids]
//   enrichment?, enrichmentNote?          // same rule as SIMS (CLAUDE.md §3)
//   rounds, roundWord: {en, hi}           // 'Day' / 'Year' / 'Round'
//   brief: {en, hi}                       // HTML — who you are, what you decide
//   goLabel: {en, hi}                     // the commit button, in the role's words
//   init(rng) → state                     // the hidden truth of this world
//   news(state, round, history) → {en,hi} | null
//   decisions(state, round, history) → [
//       { id, label, min, max, step, value, unit }             // a slider
//     | { id, label, type: 'choice', options: [{value, label}], value } ]
//   live?(state, decision, round, history) → { text: {en,hi}, ok: bool }
//                                         // readout while deciding; ok:false blocks commit
//   predict?(state, round, history) → null | { prompt, options: [{en,hi}],
//                                              answer(outcome, history) → index }
//   step(state, decision, round, rng, history) → outcome   // THE MODEL
//   scene(state, outcome | null, round, history) → HTML/SVG string
//   stats(outcome) → [{ label: {en,hi}, value: string, tone?: 'good'|'bad' }]
//   ledger: [{ key, label: {en,hi}, get(record) → string }]
//   narrate(outcome, state, history) → {en, hi}
//   nudge?(history, state, round) → {en, hi} | null         // the coach
//   chart(history, reveal, state) → { traces, layout } | null
//   debrief(history, state) → { score, scoreLine: {en,hi},
//        insights: [{ icon, concept: {en,hi}, holds: bool, evidence: {en,hi}, tryThis: {en,hi}, exam: {en,hi} }] }
//   truth: { … }                          // the model's pure economics, for tests
// }
const LIFE_WORLDS = [];

// A bilingual pair. Every piece of text a world produces is one of these.
function B2(en, hi) { return { en, hi }; }

function rupee(n, d) {
    if (typeof n !== 'number' || !isFinite(n)) return '—';
    const digits = d === undefined ? (Math.abs(n % 1) > 1e-9 ? 2 : 0) : d;
    const s = Math.abs(n).toFixed(digits).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return (n < 0 ? '−₹' : '₹') + s;
}

function lifeLang() { return (typeof currentLang !== 'undefined' && currentLang === 'hi') ? 'hi' : 'en'; }
function lifeT(pair) {
    if (pair === undefined || pair === null) return '';
    if (typeof pair === 'string') return pair;
    return lifeLang() === 'hi' && pair.hi !== undefined ? pair.hi : pair.en;
}
function lifePlain(html) { return String(html).replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim(); }

// Seeded PRNG (mulberry32): a run is fully determined by (seed, decisions).
function lifeRng(seed) {
    let a = (seed >>> 0) || 1;
    const next = function () {
        a = (a + 0x6D2B79F5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    next.between = (lo, hi) => lo + (hi - lo) * next();
    next.int = (lo, hi) => Math.floor(next.between(lo, hi + 1));
    return next;
}

// ── The pure core (no DOM): what tests and the UI both drive ────────
function lifeNewRun(world, seed) {
    const rng = lifeRng(seed);
    return { world, seed, rng, state: world.init(rng), round: 1, history: [], done: false };
}

function lifeDecisionDefaults(run) {
    const out = {};
    run.world.decisions(run.state, run.round, run.history).forEach(d => { out[d.id] = d.value; });
    return out;
}

// Whatever arrives (a typed value, a stale draft from the previous round),
// the model only ever sees a decision inside this round's declared domain.
function lifeClampDecision(run, raw) {
    const out = {};
    run.world.decisions(run.state, run.round, run.history).forEach(d => {
        let v = raw ? raw[d.id] : undefined;
        if (d.type === 'choice') {
            out[d.id] = d.options.some(o => o.value === v) ? v : d.value;
            return;
        }
        v = Number(v);
        if (!isFinite(v)) v = d.value;
        v = Math.min(d.max, Math.max(d.min, v));
        const step = d.step || 1;
        v = d.min + Math.round((v - d.min) / step) * step;
        out[d.id] = Math.min(d.max, Math.round(v * 1e6) / 1e6);
    });
    return out;
}

// One decision → one consequence. Returns the history record, or null when
// the run is over or the decision is not allowed (live().ok === false).
function lifeCommit(run, rawDecision, predictChoice) {
    if (!run || run.done) return null;
    const w = run.world;
    const decision = lifeClampDecision(run, rawDecision);
    if (typeof w.live === 'function') {
        const check = w.live(run.state, decision, run.round, run.history);
        if (check && check.ok === false) return null;
    }
    const pred = typeof w.predict === 'function' ? w.predict(run.state, run.round, run.history) : null;
    const outcome = w.step(run.state, decision, run.round, run.rng, run.history);
    const record = { round: run.round, decision, outcome };
    if (pred) {
        const answer = pred.answer(outcome, run.history);
        const choice = (typeof predictChoice === 'number') ? predictChoice : null;
        record.predict = { choice, answer, correct: choice === answer };
    }
    run.history.push(record);
    if (run.round >= w.rounds) run.done = true; else run.round++;
    return record;
}

// ── The journal: what a student has lived, kept on their own device ──
const LIFE_JOURNAL_KEY = 'econsim-life-journal';
function lifeJournal() {
    try { return JSON.parse(localStorage.getItem(LIFE_JOURNAL_KEY) || '{}') || {}; } catch { return {}; }
}
function lifeJournalRecord(worldId, score, livedCount, totalCount) {
    const j = lifeJournal();
    const e = j[worldId] || { best: 0, runs: 0, lived: 0 };
    e.runs += 1;
    e.best = Math.max(e.best, Math.round(score));
    e.lived = Math.max(e.lived, livedCount);
    e.of = totalCount;
    j[worldId] = e;
    try { localStorage.setItem(LIFE_JOURNAL_KEY, JSON.stringify(j)); } catch { /* private mode: nothing kept */ }
    // The hub cards show the best score; they are otherwise only rebuilt on a
    // language change, so a finished run would not appear until then.
    if (typeof document !== 'undefined') lifeBuildHub();
}

// ── UI state ──────────────────────────────────────────────────────
let lifeRun = null;          // the run on screen (null when closed)
let lifeDraft = {};          // the decision being composed this round
let lifePredictChoice = null;
let lifeDebriefCache = null; // debrief() result for the finished run
let lifeJournaled = false;

function lifeCurrentRun() { return lifeRun; }

// closed ─OPEN→ brief ─START→ deciding ─COMMIT→ outcome ─NEXT→ deciding …
//                                                 └─FINISH→ debrief ─REPLAY→ brief
const lifeMachine = createMachine({
    id: 'life', initial: 'closed', reflect: 'life',
    describe: () => (lifeRun ? { worldId: lifeRun.world.id, round: lifeRun.round, rounds: lifeRun.world.rounds, played: lifeRun.history.length, seed: lifeRun.seed } : {}),
    states: {
        closed: { on: { OPEN: 'brief' } },
        brief: { on: { START: 'deciding', OPEN: 'brief', CLOSE: 'closed' } },
        deciding: { on: { COMMIT: 'outcome', OPEN: 'brief', CLOSE: 'closed' } },
        outcome: {
            on: {
                NEXT: { target: 'deciding', guard: () => !!lifeRun && !lifeRun.done },
                FINISH: { target: 'debrief', guard: () => !!lifeRun && lifeRun.done },
                OPEN: 'brief', CLOSE: 'closed'
            }
        },
        debrief: { on: { REPLAY: 'brief', OPEN: 'brief', CLOSE: 'closed' } }
    }
});

const LIFE_UI = {
    hubTitle: B2('🌏 Live the Economy', '🌏 अर्थव्यवस्था को जियो'),
    hubSub: B2('Don’t study it first — run a stall, sell in a mandi, manage a bank, present a budget. The textbook name comes after you have felt it.',
        'पहले पढ़ो मत — टपरी चलाओ, मंडी में बेचो, बैंक सँभालो, बजट पेश करो। किताब वाला नाम तब आएगा जब आप उसे महसूस कर चुके होंगे।'),
    youAre: B2('You are', 'आप हैं'),
    start: B2('Begin ▶', 'शुरू करें ▶'),
    next: B2('Next ▶', 'आगे ▶'),
    seeDebrief: B2('See what you just lived ▶', 'देखें आपने क्या जिया ▶'),
    back: B2('← All lives', '← सभी भूमिकाएँ'),
    gutCall: B2('Gut call — before you decide', 'पहले अंदाज़ा लगाइए'),
    gutRight: B2('Your gut call was right.', 'आपका अंदाज़ा सही निकला।'),
    gutWrong: B2('Your gut call missed — this is what happened:', 'अंदाज़ा चूक गया — हुआ यह:'),
    pickFirst: B2('Make your gut call first.', 'पहले अपना अंदाज़ा चुनिए।'),
    ledger: B2('📒 Your record', '📒 आपका बहीखाता'),
    ledgerEmpty: B2('Nothing yet — your decisions will be written here.', 'अभी कुछ नहीं — आपके निर्णय यहाँ दर्ज होंगे।'),
    yourData: B2('📈 Your own data', '📈 आपके अपने आँकड़े'),
    dataEmpty: B2('Every decision you take adds a point here.', 'आपका हर निर्णय यहाँ एक बिंदु जोड़ेगा।'),
    coach: B2('Coach', 'मार्गदर्शक'),
    news: B2('Today', 'आज की ख़बर'),
    score: B2('How well you lived it', 'आपने इसे कितना अच्छा जिया'),
    named: B2('What you lived has a name', 'जो आपने जिया, उसका एक नाम है'),
    lived: B2('You lived this', 'आपने यह जिया'),
    notYet: B2('Not yet lived', 'अभी जिया नहीं'),
    tryThis: B2('Try next time', 'अगली बार आज़माएँ'),
    exam: B2('In the exam', 'परीक्षा में'),
    apply: B2('Now take it to the lab', 'अब इसे प्रयोगशाला में ले जाइए'),
    replay: B2('↻ Live it again (a new town)', '↻ फिर से जिएँ (नया शहर)'),
    revealNote: B2('The dots are your own days. The line is the rule that was running underneath all along.', 'बिंदु आपके अपने दिन हैं। रेखा वह नियम है जो शुरू से पीछे चल रहा था।'),
    best: B2('Best', 'सर्वश्रेष्ठ'),
    runs: B2('runs', 'बार'),
    mins: B2('min', 'मिनट'),
    listen: B2('🔊 Listen', '🔊 सुनें'),
    stopVoice: B2('⏹ Stop', '⏹ रोकें'),
    enrichment: B2('✨ Goes a step beyond the named 2026–27 topic', '✨ 2026–27 के नामित विषय से एक क़दम आगे'),
    classWord: B2('Class', 'कक्षा'),
    unitWord: B2('Unit', 'इकाई')
};

function lifeChapterTag(w) {
    return typeof chapterTagText === 'function' ? chapterTagText(w) : `${lifeT(LIFE_UI.classWord)} ${w.class} · ${lifeT(LIFE_UI.unitWord)} ${w.unit}`;
}

// ── Home hub ──────────────────────────────────────────────────────
function lifeBuildHub() {
    const host = document.getElementById('life-hub');
    if (!host) return;
    const journal = lifeJournal();
    host.innerHTML = `
        <div class="life-hub-head">
            <h2 class="life-hub-title">${lifeT(LIFE_UI.hubTitle)}</h2>
            <p class="life-hub-sub">${lifeT(LIFE_UI.hubSub)}</p>
        </div>
        <div class="life-grid" id="grid-life"></div>`;
    const grid = host.querySelector('#grid-life');
    LIFE_WORLDS.forEach(w => {
        const e = journal[w.id];
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'life-card';
        card.dataset.lifeId = w.id;
        card.style.setProperty('--life-accent', w.accent);
        card.innerHTML = `
            <span class="life-card-icon" aria-hidden="true">${w.icon}</span>
            <span class="life-card-role">${lifeT(LIFE_UI.youAre)}: ${lifeT(w.role)}</span>
            <span class="life-card-title">${lifeT(w.title)}</span>
            <span class="life-card-tag">${lifeT(w.tagline)}</span>
            <span class="life-card-meta">
                <span>${lifeT(LIFE_UI.classWord)} ${w.class} · ${lifeT(LIFE_UI.unitWord)} ${w.unit}</span>
                <span>⏱ ${w.minutes} ${lifeT(LIFE_UI.mins)}</span>
                ${e ? `<span class="life-card-best">★ ${lifeT(LIFE_UI.best)} ${e.best}% · ${e.runs} ${lifeT(LIFE_UI.runs)}</span>` : ''}
            </span>`;
        card.addEventListener('click', () => lifeOpen(w.id));
        grid.appendChild(card);
    });
}

// ── Opening / leaving ─────────────────────────────────────────────
function lifeOpen(worldId, seed) {
    const world = LIFE_WORLDS.find(w => w.id === worldId);
    if (!world) return false;
    const s = (typeof seed === 'number') ? seed : ((Date.now() ^ Math.floor(Math.random() * 1e9)) >>> 0);
    lifeRun = lifeNewRun(world, s);
    lifeDraft = lifeDecisionDefaults(lifeRun);
    lifePredictChoice = null;
    lifeDebriefCache = null;
    lifeJournaled = false;
    if (typeof appMachine !== 'undefined') appMachine.send('OPEN_LIFE');
    lifeMachine.send('OPEN');
    lifeRender();
    return true;
}

function lifeClose() {
    if (typeof MimaVoice !== 'undefined' && MimaVoice.owner && MimaVoice.owner() === 'life') MimaVoice.stop();
    lifeMachine.send('CLOSE');
    lifeRun = null;
    const chart = document.getElementById('life-chart');
    if (chart && chart.data && typeof Plotly !== 'undefined') Plotly.purge(chart);
}

// ── Rendering: a pure function of (run, machine state, language) ────
function lifeEl(id) { return document.getElementById(id); }

function lifeRenderDecisions() {
    const run = lifeRun, w = run.world;
    const decs = w.decisions(run.state, run.round, run.history);
    lifeDraft = lifeClampDecision(run, lifeDraft);
    return decs.map(d => {
        if (d.type === 'choice') {
            return `<div class="life-decision">
                <div class="life-decision-label">${lifeT(d.label)}</div>
                <div class="life-choice-row" role="group">
                    ${d.options.map(o => `<button type="button" class="life-choice${lifeDraft[d.id] === o.value ? ' active' : ''}" data-life-choice="${d.id}" data-value="${o.value}" aria-pressed="${lifeDraft[d.id] === o.value}">${lifeT(o.label)}</button>`).join('')}
                </div></div>`;
        }
        return `<div class="life-decision">
            <label class="life-decision-label" for="life-in-${d.id}">${lifeT(d.label)}</label>
            <div class="life-range-row">
                <input type="range" id="life-in-${d.id}" data-life-range="${d.id}" min="${d.min}" max="${d.max}" step="${d.step || 1}" value="${lifeDraft[d.id]}">
                <output class="life-range-val" id="life-out-${d.id}">${lifeFormatDecision(d, lifeDraft[d.id])}</output>
            </div></div>`;
    }).join('');
}
function lifeFormatDecision(d, v) {
    const u = lifeT(d.unit || '');
    if (u === '₹') return rupee(v);
    return `${v}${u ? ' ' + u : ''}`;
}

function lifeRenderLive() {
    const host = lifeEl('life-live');
    const go = lifeEl('life-go');
    if (!lifeRun) return;
    const w = lifeRun.world;
    let okNow = true;
    if (typeof w.live === 'function') {
        const r = w.live(lifeRun.state, lifeClampDecision(lifeRun, lifeDraft), lifeRun.round, lifeRun.history);
        if (host) { host.innerHTML = r ? lifeT(r.text) : ''; host.classList.toggle('bad', !!r && r.ok === false); }
        okNow = !r || r.ok !== false;
    } else if (host) host.innerHTML = '';
    const needsPredict = typeof w.predict === 'function' && !!w.predict(lifeRun.state, lifeRun.round, lifeRun.history);
    if (go) {
        go.disabled = !okNow || (needsPredict && lifePredictChoice === null);
        go.title = (needsPredict && lifePredictChoice === null) ? lifeT(LIFE_UI.pickFirst) : '';
    }
}

function lifeRenderSide() {
    const run = lifeRun, w = run.world;
    const led = lifeEl('life-ledger');
    if (led) {
        const rows = run.history.map(rec => `<tr>${w.ledger.map(c => `<td>${c.get(rec)}</td>`).join('')}</tr>`).join('');
        led.innerHTML = `<h3 class="life-side-title">${lifeT(LIFE_UI.ledger)}</h3>` + (run.history.length
            ? `<div class="life-ledger-scroll"><table class="life-ledger-table"><thead><tr>${w.ledger.map(c => `<th>${lifeT(c.label)}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>`
            : `<p class="life-empty">${lifeT(LIFE_UI.ledgerEmpty)}</p>`);
    }
    lifeDrawChart(lifeEl('life-chart'), false);
    const title = lifeEl('life-chart-title');
    if (title) title.textContent = lifeT(LIFE_UI.yourData);
}

function lifeDrawChart(host, reveal) {
    if (!host || !lifeRun) return;
    const spec = lifeRun.world.chart(lifeRun.history, reveal, lifeRun.state);
    if (!spec || !spec.traces || !spec.traces.length || typeof Plotly === 'undefined') {
        if (host.data && typeof Plotly !== 'undefined') Plotly.purge(host);
        host.innerHTML = `<p class="life-empty">${lifeT(LIFE_UI.dataEmpty)}</p>`;
        return;
    }
    if (!host.data) host.innerHTML = '';
    const base = typeof plotlyDefaultLayout === 'function' ? plotlyDefaultLayout() : {};
    const layout = Object.assign({}, base, spec.layout || {});
    layout.xaxis = Object.assign({}, base.xaxis, (spec.layout && spec.layout.xaxis) || {});
    layout.yaxis = Object.assign({}, base.yaxis, (spec.layout && spec.layout.yaxis) || {});
    layout.margin = { l: 52, r: 14, t: 12, b: 44 };
    layout.showlegend = reveal;
    layout.legend = { orientation: 'h', y: -0.28, font: { size: 10 } };
    if (reveal) layout.margin.b = 78;
    Plotly.react(host, spec.traces, layout, { displayModeBar: false, responsive: true }).catch(() => {});
}

function lifeRender() {
    const run = lifeRun;
    const st = lifeMachine.state;
    const stage = lifeEl('life-stage'), panel = lifeEl('life-panel');
    if (!run || st === 'closed' || !stage || !panel) return;
    const w = run.world;
    const screen = lifeEl('screen-life');
    if (screen) { screen.dataset.lifeState = st; screen.style.setProperty('--life-accent', w.accent); }

    lifeEl('life-title').textContent = `${w.icon} ${lifeT(w.title)}`;
    lifeEl('life-back').textContent = lifeT(LIFE_UI.back);
    const shownRound = st === 'outcome' ? run.history[run.history.length - 1].round : run.round;
    lifeEl('life-round').textContent = (st === 'brief' || st === 'debrief') ? '' : `${lifeT(w.roundWord)} ${shownRound} / ${w.rounds}`;
    const prog = lifeEl('life-progress');
    if (prog) prog.style.width = `${Math.round(100 * run.history.length / w.rounds)}%`;

    if (st === 'brief') {
        stage.innerHTML = `
            <div class="life-brief">
                <div class="life-brief-icon" aria-hidden="true">${w.icon}</div>
                <div class="life-brief-role">${lifeT(LIFE_UI.youAre)} <b>${lifeT(w.role)}</b></div>
                <div class="life-brief-body">${lifeT(w.brief)}</div>
                <div class="life-brief-tag">📘 ${lifeChapterTag(w)}</div>
                ${w.enrichment ? `<div class="life-brief-enrich" title="${lifeT(w.enrichmentNote || '')}">${lifeT(LIFE_UI.enrichment)}</div>` : ''}
            </div>`;
        panel.innerHTML = `<button type="button" class="life-go" id="life-start">${lifeT(LIFE_UI.start)}</button>`;
    } else if (st === 'deciding') {
        const news = w.news(run.state, run.round, run.history);
        const nudge = typeof w.nudge === 'function' ? w.nudge(run.history, run.state, run.round) : null;
        const pred = typeof w.predict === 'function' ? w.predict(run.state, run.round, run.history) : null;
        stage.innerHTML = `<div class="life-scene">${w.scene(run.state, null, run.round, run.history)}</div>`;
        panel.innerHTML = `
            ${news ? `<div class="life-news"><span class="life-chip">${lifeT(LIFE_UI.news)}</span><span>${lifeT(news)}</span></div>` : ''}
            ${nudge ? `<div class="life-nudge"><span class="life-chip life-chip--coach">🧭 ${lifeT(LIFE_UI.coach)}</span><span>${lifeT(nudge)}</span></div>` : ''}
            ${pred ? `<div class="life-predict" id="life-predict">
                <div class="life-predict-title">🤔 ${lifeT(LIFE_UI.gutCall)}</div>
                <div class="life-predict-prompt">${lifeT(pred.prompt)}</div>
                <div class="life-choice-row">${pred.options.map((o, i) => `<button type="button" class="life-choice${lifePredictChoice === i ? ' active' : ''}" data-life-predict="${i}" aria-pressed="${lifePredictChoice === i}">${lifeT(o)}</button>`).join('')}</div>
            </div>` : ''}
            <div class="life-decisions">${lifeRenderDecisions()}</div>
            <div class="life-live" id="life-live" aria-live="polite"></div>
            <button type="button" class="life-go" id="life-go">${lifeT(w.goLabel)}</button>`;
        lifeRenderLive();
    } else if (st === 'outcome') {
        const rec = run.history[run.history.length - 1];
        const pred = rec.predict;
        const text = w.narrate(rec.outcome, run.state, run.history);
        stage.innerHTML = `<div class="life-scene life-scene--result">${w.scene(run.state, rec.outcome, rec.round, run.history)}</div>`;
        panel.innerHTML = `
            <div class="life-stats">${w.stats(rec.outcome).map(s => `<div class="life-stat${s.tone ? ' life-stat--' + s.tone : ''}"><span>${lifeT(s.label)}</span><b>${s.value}</b></div>`).join('')}</div>
            ${pred ? `<div class="life-predict-result ${pred.correct ? 'ok' : 'miss'}">${pred.correct ? '✅ ' + lifeT(LIFE_UI.gutRight) : '🔎 ' + lifeT(LIFE_UI.gutWrong)}</div>` : ''}
            <div class="life-narration" id="life-narration">${lifeT(text)}</div>
            <div class="life-actions">
                <button type="button" class="life-ghost" id="life-speak">${lifeT(LIFE_UI.listen)}</button>
                <button type="button" class="life-go" id="life-next">${run.done ? lifeT(LIFE_UI.seeDebrief) : lifeT(LIFE_UI.next)}</button>
            </div>`;
    } else if (st === 'debrief') {
        if (!lifeDebriefCache) lifeDebriefCache = w.debrief(run.history, run.state);
        const d = lifeDebriefCache;
        const lived = d.insights.filter(i => i.holds).length;
        if (!lifeJournaled) { lifeJournalRecord(w.id, d.score, lived, d.insights.length); lifeJournaled = true; }
        const labs = (w.labs || []).map(id => (typeof SIMS !== 'undefined' ? SIMS.find(s => s.id === id) : null)).filter(Boolean);
        stage.innerHTML = `
            <div class="life-debrief-head">
                <div class="life-score-ring" style="--pct:${Math.max(0, Math.min(100, d.score))}"><b>${Math.round(d.score)}%</b></div>
                <div>
                    <div class="life-score-label">${lifeT(LIFE_UI.score)}</div>
                    <div class="life-score-line">${lifeT(d.scoreLine)}</div>
                </div>
            </div>
            <div class="life-reveal-chart" id="life-reveal-chart"></div>
            <p class="life-reveal-note">${lifeT(LIFE_UI.revealNote)}</p>`;
        panel.innerHTML = `
            <h3 class="life-named-title">${lifeT(LIFE_UI.named)} <span class="life-named-count">${lifeLang() === 'hi' ? `${d.insights.length} में से ${lived}` : `${lived} of ${d.insights.length}`}</span></h3>
            <div class="life-insights">${d.insights.map(i => `
                <article class="life-insight ${i.holds ? 'lived' : 'pending'}">
                    <div class="life-insight-head"><span class="life-insight-icon" aria-hidden="true">${i.icon}</span><h4>${lifeT(i.concept)}</h4>
                        <span class="life-insight-badge">${i.holds ? '✓ ' + lifeT(LIFE_UI.lived) : '○ ' + lifeT(LIFE_UI.notYet)}</span></div>
                    <p>${i.holds ? lifeT(i.evidence) : `<b>${lifeT(LIFE_UI.tryThis)}:</b> ${lifeT(i.tryThis)}`}</p>
                    <p class="life-insight-exam"><b>${lifeT(LIFE_UI.exam)}:</b> ${lifeT(i.exam)}</p>
                </article>`).join('')}</div>
            ${labs.length ? `<h3 class="life-named-title">${lifeT(LIFE_UI.apply)}</h3>
            <div class="life-labs">${labs.map(s => `<button type="button" class="life-lab" data-life-lab="${s.id}">🔬 ${typeof simField === 'function' ? simField(s, 'title') : s.title}</button>`).join('')}</div>` : ''}
            <div class="life-actions">
                <button type="button" class="life-ghost" id="life-home">${lifeT(LIFE_UI.back)}</button>
                <button type="button" class="life-go" id="life-replay">${lifeT(LIFE_UI.replay)}</button>
            </div>`;
        lifeDrawChart(lifeEl('life-reveal-chart'), true);
    }
    lifeRenderSide();
}

// ── Events: one delegated listener on the life screen ───────────────
function lifeWire() {
    const screen = lifeEl('screen-life');
    if (!screen || screen.dataset.wired) return;
    screen.dataset.wired = '1';

    screen.addEventListener('input', e => {
        const t = e.target;
        if (!lifeRun || !t || !t.dataset || !t.dataset.lifeRange) return;
        const id = t.dataset.lifeRange;
        lifeDraft[id] = Number(t.value);
        lifeDraft = lifeClampDecision(lifeRun, lifeDraft);
        const d = lifeRun.world.decisions(lifeRun.state, lifeRun.round, lifeRun.history).find(x => x.id === id);
        const out = lifeEl(`life-out-${id}`);
        if (out && d) out.textContent = lifeFormatDecision(d, lifeDraft[id]);
        lifeRenderLive();
    });

    screen.addEventListener('click', e => {
        const t = e.target && e.target.closest ? e.target.closest('button') : null;
        if (!t) return;
        if (t.id === 'life-back' || t.id === 'life-home') { if (typeof showScreen === 'function') showScreen('home'); return; }
        if (!lifeRun) return;
        if (t.dataset.lifeChoice) {
            lifeDraft[t.dataset.lifeChoice] = t.dataset.value;
            lifeRender();
        } else if (t.dataset.lifePredict !== undefined) {
            lifePredictChoice = Number(t.dataset.lifePredict);
            lifeRender();
        } else if (t.id === 'life-start') {
            if (lifeMachine.send('START')) lifeRender();
        } else if (t.id === 'life-go') {
            if (lifeMachine.state !== 'deciding') return;
            const rec = lifeCommit(lifeRun, lifeDraft, lifePredictChoice);
            if (!rec) { lifeRenderLive(); return; }
            lifePredictChoice = null;
            lifeMachine.send('COMMIT');
            lifeRender();
        } else if (t.id === 'life-next') {
            if (typeof MimaVoice !== 'undefined') MimaVoice.stop();
            if (lifeRun.done) lifeMachine.send('FINISH');
            else { lifeDraft = Object.assign(lifeDecisionDefaults(lifeRun), lifeKeepDraft()); lifeMachine.send('NEXT'); }
            lifeRender();
            const top = lifeEl('screen-life');
            if (top && typeof top.scrollIntoView === 'function') top.scrollIntoView({ block: 'start' });
        } else if (t.id === 'life-speak') {
            lifeToggleVoice();
        } else if (t.id === 'life-replay') {
            lifeOpen(lifeRun.world.id);
        } else if (t.dataset.lifeLab) {
            if (typeof openSim === 'function') openSim(t.dataset.lifeLab);
        }
    });

    if (typeof MimaVoice !== 'undefined' && MimaVoice.subscribe) {
        MimaVoice.subscribe((state, owner) => {
            const btn = lifeEl('life-speak');
            if (btn) btn.textContent = (state === 'speaking' && owner === 'life') ? lifeT(LIFE_UI.stopVoice) : lifeT(LIFE_UI.listen);
        });
    }
}

// Yesterday's choice is today's starting point (a shopkeeper does not forget
// their own price overnight) — but only for sliders that still exist, and
// lifeClampDecision() re-clamps it into the new round's domain.
function lifeKeepDraft() {
    if (!lifeRun || !lifeRun.history.length) return {};
    const last = lifeRun.history[lifeRun.history.length - 1].decision;
    const keep = {};
    lifeRun.world.decisions(lifeRun.state, lifeRun.round, lifeRun.history).forEach(d => {
        if (d.type !== 'choice' && d.carry !== false && last[d.id] !== undefined) keep[d.id] = last[d.id];
    });
    return keep;
}

function lifeToggleVoice() {
    if (typeof MimaVoice === 'undefined' || !MimaVoice.isSupported()) return;
    if (MimaVoice.owner() === 'life') { MimaVoice.stop(); return; }
    const el = lifeEl('life-narration');
    if (el) MimaVoice.speak(lifePlain(el.innerHTML), lifeLang(), null, null, 'life');
}

if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
    document.addEventListener('DOMContentLoaded', lifeWire);
}
if (typeof registerStateObserver === 'function') {
    registerStateObserver('life', () => (lifeRun ? {
        worldId: lifeRun.world.id, round: lifeRun.round, done: lifeRun.done,
        draft: lifeDraft, predictChoice: lifePredictChoice,
        last: lifeRun.history.length ? lifeRun.history[lifeRun.history.length - 1].outcome : null
    } : null));
}
if (typeof window !== 'undefined') {
    window.lifeOpen = lifeOpen;
    window.lifeClose = lifeClose;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LIFE_WORLDS, lifeRng, lifeNewRun, lifeCommit, lifeDecisionDefaults, lifeClampDecision };
}
