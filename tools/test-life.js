// ══════════════════════════════════════════════════════════════
// tools/test-life.js — the Living Economy (js/life-engine.js + worlds)
// ══════════════════════════════════════════════════════════════
// Required by tools/test-curriculum.js, which hands over its vm context
// (so these run against the SAME loaded app the other tests use), its
// ok() counter, SIMS and CURRICULUM_NODES.
//
// Each assertion states the RULE the world claims to teach, not the number
// it currently produces — the form docs/economics/validation asks for:
//   • the model obeys the textbook relationship at every point of its domain
//   • the data a student generates really comes from the curve the debrief
//     later draws over it (so the "reveal" is not a second, prettier model)
//   • a debrief insight is "lived" only when the student's own history
//     supports it — verified with runs that should NOT earn it
//   • a full score is reachable, and only by playing well
//   • Hindi says the same thing with the same numbers, with no English left
const vm = require('vm');

module.exports = function runLifeTests({ context, ok, SIMS, CURRICULUM_NODES }) {
    const W = vm.runInContext('LIFE_WORLDS', context);
    const lifeNewRun = vm.runInContext('lifeNewRun', context);
    const lifeCommit = vm.runInContext('lifeCommit', context);
    const lifeDecisionDefaults = vm.runInContext('lifeDecisionDefaults', context);
    const lifeClampDecision = vm.runInContext('lifeClampDecision', context);
    const lifeRng = vm.runInContext('lifeRng', context);
    const lifeMachine = vm.runInContext('lifeMachine', context);
    const world = id => W.find(w => w.id === id);
    const setLang = l => { context.currentLang = l; };
    const near = (a, b, tol) => Math.abs(a - b) <= (tol === undefined ? 1e-9 : tol);
    const hasDeva = t => /[ऀ-ॿ]/.test(t);
    const plain = t => String(t).replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ');
    // An English word: a letter followed by 2+ lowercase letters. Symbols the
    // syllabus itself writes in Latin (MR, MC, AD, LRR, CRR, RBI, MUx, Ed…) pass.
    const englishWord = t => (plain(t).match(/[A-Za-z][a-z]{2,}/) || [null])[0];
    const numbers = t => (plain(t).match(/\d+(?:\.\d+)?/g) || []).map(Number).sort((a, b) => a - b).join(',');

    // Plays a whole run. policy(run, decisionSpecs) → {decision, predict}
    function play(w, seed, policy) {
        const run = lifeNewRun(w, seed);
        let guard = 0;
        while (!run.done && guard++ < 100) {
            const specs = w.decisions(run.state, run.round, run.history);
            const p = policy(run, specs) || {};
            const rec = lifeCommit(run, Object.assign(lifeDecisionDefaults(run), p.decision || {}), p.predict === undefined ? 0 : p.predict);
            if (!rec) { // a blocked decision (live().ok === false): fall back to every minimum
                const mins = {}; specs.forEach(d => { mins[d.id] = d.type === 'choice' ? d.options[0].value : d.min; });
                if (!lifeCommit(run, mins, 0)) break;
            }
        }
        return run;
    }
    const fill = (specs, how, rng) => {
        const d = {};
        specs.forEach((s, i) => {
            if (s.type === 'choice') { d[s.id] = s.options[how === 'max' ? s.options.length - 1 : (how === 'rand' ? rng.int(0, s.options.length - 1) : 0)].value; return; }
            const span = s.max - s.min;
            d[s.id] = how === 'min' ? s.min : how === 'max' ? s.max : how === 'mid' ? s.min + span / 2 : how === 'rand' ? rng.between(s.min, s.max) : s.min + span * (((i + 1) * 0.37) % 1);
        });
        return d;
    };
    const GENERIC = ['default', 'min', 'max', 'mid', 'rand'];

    // ── Registry integrity ─────────────────────────────────────────
    (function testLifeRegistry() {
        ok(W.length >= 6, `Life: at least six Living Worlds are registered (got ${W.length})`);
        ok(new Set(W.map(w => w.id)).size === W.length, 'Life: world ids are unique');
        ok(!W.some(w => SIMS.some(s => s.id === w.id)), 'Life: no world id collides with a sim id');
        ['XI', 'XII'].forEach(c => ok(W.some(w => w.class === c), `Life: Class ${c} has at least one world`));
        W.forEach(w => {
            ['id', 'icon', 'accent', 'title', 'role', 'tagline', 'brief', 'goLabel', 'roundWord', 'class', 'part', 'unit', 'unitTitle', 'rounds', 'minutes'].forEach(k => ok(w[k] !== undefined && w[k] !== '', `${w.id}: declares "${k}"`));
            ['init', 'news', 'decisions', 'step', 'scene', 'stats', 'narrate', 'chart', 'debrief'].forEach(k => ok(typeof w[k] === 'function', `${w.id}: implements ${k}()`));
            ok(Array.isArray(w.ledger) && w.ledger.length >= 3, `${w.id}: has a ledger of at least 3 columns`);
            ok(w.truth && typeof w.truth === 'object', `${w.id}: exposes its economics as world.truth`);
            ok(Array.isArray(w.syllabusIds) && w.syllabusIds.length > 0, `${w.id}: maps to at least one syllabus node`);
            (w.syllabusIds || []).forEach(sid => {
                const n = CURRICULUM_NODES.find(x => x.id === sid);
                ok(!!n, `${w.id}: syllabusId ${sid} exists in CURRICULUM_NODES`);
                if (n) ok(n.class === w.class && n.part === w.part, `${w.id}: ${sid} is in the world's own Class ${w.class} Part ${w.part} (node is ${n.class}-${n.part})`);
            });
            const home = CURRICULUM_NODES.find(x => x.id === w.syllabusIds[0]);
            ok(!!home && home.unit === w.unit && home.unitTitle === w.unitTitle, `${w.id}: unit/unitTitle shown on its card match its first syllabus node`);
            (w.labs || []).forEach(id => ok(SIMS.some(s => s.id === id), `${w.id}: "take it to the lab" link ${id} is a real sim`));
            ok((w.labs || []).length > 0, `${w.id}: links to at least one lab to apply the idea`);
        });
    })();

    // ── The engine's own contract ──────────────────────────────────
    (function testLifeEngineCore() {
        const a = lifeRng(123), b = lifeRng(123), c = lifeRng(124);
        const sa = [a(), a(), a()], sb = [b(), b(), b()], sc = [c(), c(), c()];
        ok(sa.join() === sb.join() && sa.join() !== sc.join(), 'Life RNG: same seed → same stream; a different seed → a different one');
        ok(sa.every(v => v >= 0 && v < 1), 'Life RNG: values lie in [0, 1)');
        const ints = Array.from({ length: 400 }, () => a.int(3, 7));
        ok(Math.min(...ints) === 3 && Math.max(...ints) === 7, 'Life RNG: int(lo, hi) covers both ends and never leaves them');

        W.forEach(w => {
            const policy = (run, specs) => ({ decision: fill(specs, 'rand', lifeRng(run.round * 31 + 5)), predict: 0 });
            const r1 = play(w, 99, policy), r2 = play(w, 99, policy);
            ok(JSON.stringify(r1.history) === JSON.stringify(r2.history), `${w.id}: the same seed and the same decisions replay the identical life`);
            ok(r1.done && r1.history.length === w.rounds, `${w.id}: a run lasts exactly ${w.rounds} rounds, then is done`);
            ok(lifeCommit(r1, lifeDecisionDefaults(lifeNewRun(w, 1)), 0) === null && r1.history.length === w.rounds, `${w.id}: a finished run accepts no further decisions`);

            // Garbage in → a decision inside the declared domain, never a crash.
            const run = lifeNewRun(w, 5);
            const specs = w.decisions(run.state, run.round, run.history);
            [{}, null, Object.fromEntries(specs.map(s => [s.id, 'abc'])), Object.fromEntries(specs.map(s => [s.id, 1e12])), Object.fromEntries(specs.map(s => [s.id, -1e12])), Object.fromEntries(specs.map(s => [s.id, NaN]))].forEach((raw, i) => {
                const d = lifeClampDecision(run, raw);
                const inside = specs.every(s => (s.type === 'choice' ? s.options.some(o => o.value === d[s.id]) : (typeof d[s.id] === 'number' && isFinite(d[s.id]) && d[s.id] >= s.min - 1e-9 && d[s.id] <= s.max + 1e-9)));
                ok(inside, `${w.id}: clamp turns out-of-domain input #${i} into a legal decision`);
            });
            specs.filter(s => s.type !== 'choice').forEach(s => {
                const d = lifeClampDecision(run, { [s.id]: s.min + (s.step || 1) * 0.4 });
                ok(near((d[s.id] - s.min) / (s.step || 1), Math.round((d[s.id] - s.min) / (s.step || 1)), 1e-6), `${w.id}: "${s.id}" snaps to its step`);
            });
        });

        const d = lifeMachine.definition();
        ok(d.initial === 'closed' && ['brief', 'deciding', 'outcome', 'debrief'].every(s => s in d.states), 'Life FSM: closed → brief → deciding → outcome → debrief are all states');
        ok(Object.keys(d.states).filter(s => s !== 'closed').every(s => 'CLOSE' in d.states[s]), 'Life FSM: every open state can be closed (leaving the screen always works)');
    })();

    // ── Every policy, every seed: finite, well-formed, bilingual ─────
    (function testLifeSweep() {
        const bad = v => typeof v === 'number' && !isFinite(v);
        const scan = (obj, pathLabel, out) => {
            if (obj === null || obj === undefined) return;
            if (typeof obj === 'number') { if (bad(obj)) out.push(pathLabel); return; }
            if (typeof obj !== 'object') return;
            Object.keys(obj).forEach(k => scan(obj[k], `${pathLabel}.${k}`, out));
        };
        const dirty = s => /NaN|undefined|Infinity|\[object/.test(String(s));
        W.forEach(w => {
            let englishLeft = null, numberDrift = null, missingHi = null, dirtyText = null, nonFinite = null, badDebrief = null, badPredict = null, textsChecked = 0;
            const pair = (p, where) => {
                if (p === null || p === undefined) return;
                if (typeof p === 'string') { if (dirty(p) && !dirtyText) dirtyText = `${where}: ${p.slice(0, 80)}`; return; }
                textsChecked++;
                if (typeof p.en !== 'string' || typeof p.hi !== 'string') { if (!missingHi) missingHi = where; return; }
                if ((dirty(p.en) || dirty(p.hi)) && !dirtyText) dirtyText = `${where}: ${p.en.slice(0, 90)}`;
                if (/[A-Za-z]{3}/.test(plain(p.en)) && !hasDeva(p.hi) && !missingHi) missingHi = `${where} (hi has no Devanagari: "${p.hi.slice(0, 60)}")`;
                const w0 = englishWord(p.hi);
                if (w0 && !englishLeft) englishLeft = `${where}: "${w0}" in "${plain(p.hi).slice(0, 90)}"`;
                if (numbers(p.en) !== numbers(p.hi) && !numberDrift) numberDrift = `${where}: en[${numbers(p.en)}] hi[${numbers(p.hi)}]`;
            };
            [w.title, w.role, w.tagline, w.brief, w.goLabel, w.roundWord].forEach((p, i) => pair(p, `static#${i}`));
            w.ledger.forEach(c => pair(typeof c.label === 'string' ? null : c.label, `ledger.${c.key}`));

            [1, 2, 3, 7, 11].forEach(seed => GENERIC.forEach(how => {
                const prng = lifeRng(seed * 977 + how.length);
                const run = lifeNewRun(w, seed);
                let guard = 0;
                while (!run.done && guard++ < 100) {
                    const specs = w.decisions(run.state, run.round, run.history);
                    specs.forEach(s => { pair(s.label, 'decision.label'); (s.options || []).forEach(o => pair(o.label, 'decision.option')); });
                    pair(w.news(run.state, run.round, run.history), `news r${run.round}`);
                    if (w.nudge) pair(w.nudge(run.history, run.state, run.round), `nudge r${run.round}`);
                    const pred = w.predict ? w.predict(run.state, run.round, run.history) : null;
                    if (pred) { pair(pred.prompt, `predict r${run.round}`); pred.options.forEach(o => pair(o, 'predict.option')); }
                    let dec = how === 'default' ? lifeDecisionDefaults(run) : fill(specs, how, prng);
                    if (w.live) {
                        const lv = w.live(run.state, lifeClampDecision(run, dec), run.round, run.history);
                        if (lv) pair(lv.text, `live r${run.round}`);
                        if (lv && lv.ok === false) dec = fill(specs, 'min', prng);
                    }
                    ['en', 'hi'].forEach(l => { setLang(l); const svg = w.scene(run.state, null, run.round, run.history); if (dirty(svg) && !dirtyText) dirtyText = `scene(before) r${run.round}`; });
                    const rec = lifeCommit(run, dec, pred ? prng.int(0, pred.options.length - 1) : null);
                    if (!rec) { nonFinite = nonFinite || `commit refused at round ${run.round} (${how})`; break; }
                    const junk = []; scan(rec.outcome, 'outcome', junk);
                    if (junk.length && !nonFinite) nonFinite = `${how}/seed ${seed}/r${rec.round}: ${junk.join(', ')}`;
                    if (rec.predict && !(Number.isInteger(rec.predict.answer) && rec.predict.answer >= 0 && rec.predict.answer < pred.options.length) && !badPredict) badPredict = `r${rec.round}: answer index ${rec.predict.answer} of ${pred.options.length}`;
                    pair(w.narrate(rec.outcome, run.state, run.history), `narrate r${rec.round} (${how})`);
                    w.stats(rec.outcome).forEach(s => { pair(s.label, 'stat.label'); if (dirty(s.value) && !dirtyText) dirtyText = `stat value "${s.value}"`; });
                    ['en', 'hi'].forEach(l => {
                        setLang(l);
                        const svg = w.scene(run.state, rec.outcome, rec.round, run.history);
                        if (dirty(svg) && !dirtyText) dirtyText = `scene(after) r${rec.round} (${how})`;
                        (svg.match(/<text[^>]*>([\s\S]*?)<\/text>/g) || []).forEach(t => { if (l === 'hi') { const w0 = englishWord(t); if (w0 && !englishLeft) englishLeft = `scene text "${plain(t).trim().slice(0, 70)}"`; } });
                        w.ledger.forEach(c => { const cell = c.get(rec); if (dirty(cell) && !dirtyText) dirtyText = `ledger ${c.key}: ${cell}`; if (l === 'hi' && englishWord(cell) && !englishLeft) englishLeft = `ledger cell "${cell}"`; });
                        [false, true].forEach(rev => {
                            const ch = w.chart(run.history, rev, run.state);
                            if (!ch) return;
                            ch.traces.forEach(t => {
                                ['x', 'y'].forEach(ax => (t[ax] || []).forEach(v => { if (typeof v !== 'number' || !isFinite(v)) nonFinite = nonFinite || `chart ${ax} value ${v} (reveal=${rev})`; }));
                                if (l === 'hi' && t.name && englishWord(t.name) && !englishLeft) englishLeft = `chart legend "${t.name}"`;
                            });
                            ['xaxis', 'yaxis'].forEach(ax => { const ti = ch.layout && ch.layout[ax] && ch.layout[ax].title; if (l === 'hi' && ti && englishWord(ti) && !englishLeft) englishLeft = `chart axis "${ti}"`; });
                        });
                    });
                    setLang('en');
                }
                const d = w.debrief(run.history, run.state);
                if (!(typeof d.score === 'number' && d.score >= 0 && d.score <= 100) && !badDebrief) badDebrief = `score ${d.score} (${how}, seed ${seed})`;
                pair(d.scoreLine, `scoreLine (${how})`);
                d.insights.forEach((ins, k) => {
                    pair(ins.concept, `insight${k}.concept`); pair(ins.tryThis, `insight${k}.tryThis`); pair(ins.exam, `insight${k}.exam`);
                    if (typeof ins.holds !== 'boolean' && !badDebrief) badDebrief = `insight ${k}: holds is not a boolean`;
                    if (ins.holds) { if (!ins.evidence && !badDebrief) badDebrief = `insight ${k} is "lived" with no evidence`; pair(ins.evidence, `insight${k}.evidence (${how}, seed ${seed})`); }
                    if (!ins.holds && !ins.tryThis && !badDebrief) badDebrief = `insight ${k} is pending with nothing to try`;
                });
            }));
            setLang('en');
            ok(!nonFinite, `${w.id}: every outcome and chart value is finite under every policy${nonFinite ? ' — ' + nonFinite : ''}`);
            ok(!dirtyText, `${w.id}: no "NaN"/"undefined" ever reaches the screen${dirtyText ? ' — ' + dirtyText : ''}`);
            ok(!badPredict, `${w.id}: every gut-call answer is a real option index${badPredict ? ' — ' + badPredict : ''}`);
            ok(!badDebrief, `${w.id}: the debrief is well-formed (score 0–100; lived ⇒ evidence; pending ⇒ something to try)${badDebrief ? ' — ' + badDebrief : ''}`);
            ok(!missingHi, `${w.id}: every piece of text has a Hindi twin in Devanagari${missingHi ? ' — ' + missingHi : ''}`);
            ok(!englishLeft, `${w.id}: no English word is left in any Hindi text${englishLeft ? ' — ' + englishLeft : ''}`);
            ok(!numberDrift, `${w.id}: Hindi carries exactly the numbers the English does${numberDrift ? ' — ' + numberDrift : ''}`);
            ok(textsChecked > 100, `${w.id}: the bilingual sweep actually examined text (${textsChecked} pairs)`);
        });
    })();

    // ── 1. Chai stall: demand, elasticity, MR = MC ─────────────────
    (function testLifeChai() {
        const w = world('chai-stall'), T = w.truth, REG = ['normal', 'cold', 'costly'];
        const prices = []; for (let p = T.PRICE_MIN; p <= T.PRICE_MAX; p++) prices.push(p);
        REG.forEach(reg => {
            ok(prices.every((p, i) => i === 0 || T.demand(p, reg) < T.demand(prices[i - 1], reg)), `Chai (${reg}): the law of demand — a higher price always means fewer cups, across the whole price range`);
            ok(prices.every(p => near(T.priceAt(T.demand(p, reg), reg), p)), `Chai (${reg}): the demand line drawn in the reveal is the inverse of the demand the model uses`);
            const b = T.best(reg);
            ok(prices.every(p => T.profit(p, reg) <= b.profit + 1e-9), `Chai (${reg}): best() is the profit-maximising price on the slider`);
            ok(near(T.mr(b.cups, reg), T.mc(reg)), `Chai (${reg}): at the profit-maximising output MR = MC exactly (MR ${T.mr(b.cups, reg)}, MC ${T.mc(reg)})`);
            ok(T.mr(b.cups - 4, reg) > T.mc(reg) && T.mr(b.cups + 4, reg) < T.mc(reg), `Chai (${reg}): below that output MR > MC, beyond it MR < MC — MC cuts MR from below`);
            const u = T.unitElasticPrice(reg), rev = p => p * T.demand(p, reg);
            ok(near(T.elasticity(u, reg), 1), `Chai (${reg}): elasticity is exactly 1 at the price the debrief calls the turning point`);
            ok(prices.filter(p => p + 1 <= u).every(p => rev(p + 1) > rev(p)) && prices.filter(p => p >= u).every(p => rev(p + 1) < rev(p)), `Chai (${reg}): total-expenditure method — revenue rises with price below the unit-elastic price and falls above it`);
            ok(b.price > u, `Chai (${reg}): the profit-maximising price lies in the elastic region (above the revenue-maximising price)`);
        });
        ok(prices.every(p => T.demand(p, 'cold') > T.demand(p, 'normal')), 'Chai: the cold wave is a SHIFT — more cups at every single price');
        ok(prices.every(p => T.demand(p, 'costly') === T.demand(p, 'normal')), 'Chai: dearer milk does not move demand at any price');
        ok(T.mc('costly') > T.mc('normal') && T.best('costly').price > T.best('normal').price && T.best('costly').cups < T.best('normal').cups, 'Chai: a higher MC raises the best price and lowers the best output');
        ok(T.best('cold').price > T.best('normal').price && T.best('cold').cups > T.best('normal').cups, 'Chai: an increase in demand raises both the best price and the best output');

        // The data a student generates comes from the curve the debrief draws.
        let worst = 0;
        [[1, 'normal'], [6, 'cold'], [8, 'costly']].forEach(([day, reg]) => [T.PRICE_MIN, 12, 15, 19, T.PRICE_MAX].forEach(p => {
            let sum = 0; const N = 400;
            for (let s = 1; s <= N; s++) { const run = lifeNewRun(w, s * 13 + p); sum += w.step(run.state, { price: p }, day, run.rng).cups; }
            worst = Math.max(worst, Math.abs(sum / N - T.demand(p, reg)));
        }));
        ok(worst < 0.6, `Chai: cups actually sold average out to the demand line shown in the reveal, at every price tested (worst gap ${worst.toFixed(2)} cups)`);

        const run = play(w, 21, r => ({ decision: { price: 8 + (r.round * 3) % 14 }, predict: 0 }));
        ok(run.history.every(r => { const o = r.outcome; return o.cups + o.walked === T.N && (o.mask.match(/1/g) || []).length === o.cups && near(o.profit, o.revenue - o.tvc - o.tfc) && near(o.revenue, o.price * o.cups) && near(o.tvc, o.cups * o.mc); }), 'Chai: every day’s books add up (buyers + walkers = 100; TR = P×Q; TVC = MC×Q; profit = TR − TVC − TFC) and the scene shows exactly the buyers counted');

        // Knowing the truth earns ~100 on average; nothing scores above it systematically.
        const optimal = r => ({ decision: { price: T.best(T.regime(r.round)).price }, predict: 0 });
        const scores = Array.from({ length: 30 }, (_, i) => w.debrief(play(w, i + 1, optimal).history).score);
        const raw = Array.from({ length: 30 }, (_, i) => { const h = play(w, i + 1, optimal).history; return h.reduce((s, r) => s + r.outcome.profit, 0) / h.reduce((s, r) => s + r.outcome.bestProfit, 0); });
        const avg = raw.reduce((s, v) => s + v, 0) / raw.length;
        ok(Math.abs(avg - 1) < 0.02 && Math.min(...scores) > 90, `Chai: charging the model's best price earns the benchmark profit on average (ratio ${avg.toFixed(3)}), so 100% is reachable and is the true ceiling`);
        const lazy = w.debrief(play(w, 4, () => ({ decision: { price: 10 } })).history);
        ok(lazy.score < 75, `Chai: never changing the price scores clearly lower (${lazy.score.toFixed(0)}%)`);
        const names = lazy.insights.map(i => i.holds);
        ok(!names[0] && !names[2] && !names[3] && !names[4], 'Chai: a student who never varied the price is NOT told they lived the law of demand, elasticity, revenue-vs-profit or MR = MC');

        // A curious, sensible stall-owner lives the whole chapter.
        const curious = [8, 12, 17, 15, 15, 15, 18, 13, 17, 17];
        let livedAll = 0, shiftOk = 0;
        for (let s = 1; s <= 20; s++) {
            const r = play(w, s, x => ({ decision: { price: curious[x.round - 1] }, predict: x.round === 6 ? 0 : 1 }));
            const d = w.debrief(r.history);
            if (d.insights.filter(i => i.holds).length >= 5) livedAll++;
            if (d.insights[1].holds) shiftOk++;
            const sh = d.insights[1];
            if (sh.holds) ok(/15/.test(sh.evidence.en), `Chai seed ${s}: the shift evidence compares days at the SAME price (so no part of it can be a movement)`);
            ok(r.history[5].predict.correct && r.history[7].predict.correct, `Chai seed ${s}: "more cups at the same price" (cold wave) and "the same" (dearer milk) are the graded gut-call answers`);
        }
        ok(livedAll >= 16 && shiftOk === 20, `Chai: an exploring student lives at least 5 of the 6 ideas in most towns (${livedAll}/20) and the shift in every one (${shiftOk}/20)`);
    })();

    // ── 2. Mandi: price taking, equilibrium, ceiling, floor ─────────
    (function testLifeMandi() {
        const w = world('mandi'), T = w.truth;
        ['base', 'bumper', 'wedding'].forEach(reg => {
            const e = T.eq(reg);
            ok(near(T.qd(e.p, reg), T.qs(e.p, reg)) && near(T.qd(e.p, reg), e.q), `Mandi (${reg}): at the equilibrium price, quantity demanded = quantity supplied`);
            ok(T.qd(e.p + 2, reg) < T.qs(e.p + 2, reg) && T.qd(e.p - 2, reg) > T.qs(e.p - 2, reg), `Mandi (${reg}): above equilibrium there is excess supply, below it excess demand`);
            ok(T.sell(e.p + 1, reg) === 0 && T.sell(e.p, reg) === T.STOCK && T.sell(e.p - 5, reg) === T.STOCK, `Mandi (${reg}): a price taker sells nothing above the market price and everything at or below it`);
            for (let a = T.ASK_MIN; a <= T.ASK_MAX; a++) if (a * T.sell(a, reg) > T.bestRevenue(reg) + 1e-9) ok(false, `Mandi (${reg}): asking ₹${a} beats asking the market price — the firm would not be a price taker`);
        });
        const b = T.eq('base'), s1 = T.eq('bumper'), d1 = T.eq('wedding');
        ok(s1.p < b.p && s1.q > b.q, 'Mandi: an increase in supply lowers the equilibrium price and raises the equilibrium quantity');
        ok(d1.p > b.p && d1.q > b.q, 'Mandi: an increase in demand raises both the equilibrium price and the equilibrium quantity');
        const c = T.market('ceiling'), f = T.market('floor');
        ok(c.binding && c.price < c.eq.p && c.shortage > 0 && c.surplus === 0 && near(c.shortage, c.qd - c.qs), 'Mandi: a ceiling below equilibrium creates a shortage equal to Qd − Qs at the capped price');
        ok(f.binding && f.price > f.eq.p && f.surplus > 0 && f.shortage === 0 && near(f.surplus, f.qs - f.qd), 'Mandi: a floor above equilibrium creates a surplus equal to Qs − Qd at the support price');
        ok(near(c.traded, c.qs) && near(f.traded, f.qd), 'Mandi: under a control the short side of the market decides how much is traded');
        ok(T.sell(f.price, 'floor') < T.STOCK && near(T.sell(f.price, 'floor'), T.STOCK * f.qd / f.qs), 'Mandi: with a surplus each seller sells only their share of what buyers take');
        const free = T.market('base');
        ok(!free.binding && free.shortage === 0 && free.surplus === 0, 'Mandi: with no control the market clears — neither shortage nor surplus');

        const expert = r => ({ decision: { ask: T.market(T.regime(r.round)).price }, predict: ({ 4: 2, 6: 0, 8: 0, 10: 2 })[r.round] });
        const top = w.debrief(play(w, 1, expert).history);
        ok(near(top.score, 100), `Mandi: asking the going rate every day earns the maximum (${top.score.toFixed(1)}%)`);
        ok(!top.insights[0].holds && top.insights.slice(1).every(i => i.holds), 'Mandi: a seller who always matched the rate lived every market idea — but is NOT told they discovered price-taking, having never tested it');
        const explorer = r => ({ decision: { ask: r.round === 1 ? 34 : (r.round === 2 ? 26 : T.market(T.regime(r.round)).price) }, predict: ({ 4: 2, 6: 0, 8: 0, 10: 2 })[r.round] });
        const ex = w.debrief(play(w, 1, explorer).history);
        ok(ex.insights.every(i => i.holds) && ex.score < 100 && ex.score > 80, `Mandi: asking once too high and once too low lives all five ideas, at a cost (${ex.score.toFixed(0)}%)`);
        const wrong = w.debrief(play(w, 1, r => ({ decision: { ask: 20 }, predict: 1 })).history);
        ok(!wrong.insights.some(i => i.holds), 'Mandi: a seller who always undercut and guessed "no change" every time is told they lived none of it');
        const h = play(w, 1, explorer).history;
        ok(h[0].outcome.sold === 0 && h[1].outcome.sold === T.STOCK && h[1].outcome.revenue < h[1].outcome.best, 'Mandi: too high → nothing sold; too low → sold out but money left on the table');
    })();

    // ── 3. Pocket money: DMU and the equi-marginal rule ────────────
    (function testLifePocket() {
        const w = world('pocket-money'), T = w.truth;
        const falling = xs => xs.every((v, i) => v > 0 && (i === 0 || v < xs[i - 1]));
        ok(falling(T.MU_X) && falling(T.MU_Y), 'Pocket: both marginal-utility schedules are positive and strictly diminishing');
        const pricesSeen = [...new Set(T.PX_BY_DAY)].sort((a, b) => a - b);
        const bests = pricesSeen.map(px => {
            const b = T.best(px);
            let ties = 0, feasibleBetter = 0;
            for (let x = 0; x <= T.MU_X.length; x++) for (let y = 0; y <= T.MU_Y.length; y++) {
                if (T.cost(x, y, px) > T.BUDGET) continue;
                if (T.tu(x, y) === b.tu && !(x === b.x && y === b.y)) ties++;
                if (T.tu(x, y) > b.tu) feasibleBetter++;
            }
            ok(ties === 0 && feasibleBetter === 0, `Pocket (samosa ₹${px}): the best tray is unique — brute force over every affordable tray`);
            ok(T.cost(b.x, b.y, px) === T.BUDGET, `Pocket (samosa ₹${px}): the best tray spends the whole budget`);
            ok(b.x > 0 && b.y > 0 && near(T.MU_X[b.x - 1] / px, T.MU_Y[b.y - 1] / T.PY), `Pocket (samosa ₹${px}): at the best tray MUx/Px = MUy/Py exactly (${T.MU_X[b.x - 1]}/${px} and ${T.MU_Y[b.y - 1]}/${T.PY})`);
            ok(T.MU_X[b.x] / px < T.MU_X[b.x - 1] / px && T.MU_Y[b.y] / T.PY < T.MU_Y[b.y - 1] / T.PY, `Pocket (samosa ₹${px}): the next unit of either good would give less per rupee than the last one bought`);
            return b;
        });
        ok(bests.every((b, i) => i === 0 || b.x < bests[i - 1].x), `Pocket: the demand curve derived from the best trays slopes downward (${bests.map((b, i) => `${b.x} at ₹${pricesSeen[i]}`).join(', ')})`);
        ok(bests.every((b, i) => i === 0 || b.tu < bests[i - 1].tu), 'Pocket: a dearer samosa lowers the most joy the same ₹120 can buy (the graded gut call)');

        const over = lifeNewRun(w, 1);
        ok(lifeCommit(over, { x: T.MU_X.length, y: T.MU_Y.length }, 0) === null && over.history.length === 0, 'Pocket: a tray that costs more than the pocket money cannot be bought');
        const expert = r => { const b = T.best(T.px(r.round)); const prev = r.round > 1 ? T.best(T.px(r.round - 1)).tu : null; return { decision: { x: b.x, y: b.y }, predict: prev === null ? 0 : (b.tu > prev ? 0 : 2) }; };
        const run = play(w, 1, expert), top = w.debrief(run.history);
        ok(near(top.score, 100) && top.insights.every(i => i.holds), 'Pocket: buying the best tray every day scores 100% and lives all three ideas');
        ok(run.history.filter(r => r.predict).every(r => r.predict.correct) && run.history.filter(r => r.predict).length === 2, 'Pocket: the two price changes each ask a gut call, graded from the model');
        ok(run.history.every(r => r.outcome.joy <= r.outcome.bestJoy), 'Pocket: no tray ever beats the best tray');
        const none = w.debrief(play(w, 1, () => ({ decision: { x: 0, y: 0 } })).history);
        ok(none.score === 0 && !none.insights.some(i => i.holds), 'Pocket: buying nothing scores 0 and lives nothing');
        const lopsided = w.debrief(play(w, 1, r => ({ decision: { x: Math.min(T.MU_X.length, Math.floor(T.BUDGET / T.px(r.round))), y: 0 } })).history);
        ok(lopsided.insights[0].holds && !lopsided.insights[1].holds && lopsided.score < 90, 'Pocket: spending everything on samosas shows diminishing MU but NOT equilibrium');
    })();

    // ── 4. Town survey: census, sample, bias, mean vs median ────────
    (function testLifeSurvey() {
        const w = world('town-survey'), T = w.truth;
        const seeds = Array.from({ length: 60 }, (_, i) => i + 1);
        let skewAll = true, roadBiasAll = true, censusExact = true, roadOnlyRoad = true;
        const relErr = { 10: [], 40: [] }, signed = [];
        seeds.forEach(s => {
            const run = lifeNewRun(w, s), st = run.state;
            ok(st.homes.length === T.N, `Survey seed ${s}: the town has ${T.N} households`);
            if (!(st.trueMean > st.trueMedian)) skewAll = false;
            const census = w.step(st, { method: 'census' }, 6, run.rng);
            if (!(census.n === T.N && near(census.mean, st.trueMean) && near(census.median, st.trueMedian))) censusExact = false;
            const road = w.step(st, { method: 'road', n: '20' }, 1, run.rng);
            if (!(road.mean > st.trueMean)) roadBiasAll = false;
            if (!road.ids.every(i => st.homes[i].zone === 'road')) roadOnlyRoad = false;
            [10, 40].forEach(n => { for (let k = 0; k < 8; k++) { const o = w.step(st, { method: 'random', n: String(n) }, 2, run.rng); relErr[n].push(Math.abs(o.mean - st.trueMean) / st.trueMean); signed.push((o.mean - st.trueMean) / st.trueMean); ok(new Set(o.ids).size === n, `Survey seed ${s}: a lottery sample of ${n} is ${n} DIFFERENT households`); } });
        });
        const avg = xs => xs.reduce((a, b2) => a + b2, 0) / xs.length;
        ok(censusExact, 'Survey: the census reproduces the true mean and median exactly (it has no sampling error)');
        ok(Math.abs(avg(signed)) < 0.02, `Survey: lottery samples are unbiased — over many draws they neither over- nor under-estimate (mean signed error ${(100 * avg(signed)).toFixed(2)}%)`);
        ok(roadBiasAll && roadOnlyRoad, 'Survey: the nearest-doors sample contains only Market Road and over-estimates income in every town');
        ok(avg(relErr[40]) < avg(relErr[10]), `Survey: a bigger lottery sample has a smaller sampling error on average (${(100 * avg(relErr[40])).toFixed(1)}% at n=40 vs ${(100 * avg(relErr[10])).toFixed(1)}% at n=10)`);
        ok(skewAll, 'Survey: income is right-skewed in every town — the mean lies above the median');

        const careful = r => ({ decision: r.round === 6 ? { method: 'census' } : { method: r.round === 1 ? 'road' : 'random', n: r.round === 2 ? '10' : '40' }, predict: 2 });
        let good = 0, biasSeen = 0, meanMedian = 0, total = 0;
        seeds.slice(0, 30).forEach(s => {
            const run = play(w, s, careful), d = w.debrief(run.history, run.state);
            total += d.score; if (d.insights[0].holds) good++; if (d.insights[1].holds) biasSeen++; if (d.insights[3].holds) meanMedian++;
            const best = run.history.slice(0, 5).reduce((a, b2) => (Math.abs(b2.outcome.mean - run.state.trueMean) < Math.abs(a.outcome.mean - run.state.trueMean) ? b2 : a));
            ok(run.history[5].predict.answer === best.round - 1, `Survey seed ${s}: the graded "closest estimate" is the one the census actually proves closest`);
        });
        ok(good >= 27 && biasSeen >= 27 && meanMedian === 30 && total / 30 > 80, `Survey: a careful investigator usually lives the sampling ideas and scores well (sample ${good}/30, bias ${biasSeen}/30, avg ${(total / 30).toFixed(0)}%)`);
        const lazyRun = play(w, 3, r => ({ decision: r.round === 6 ? { method: 'census' } : { method: 'road', n: '10' }, predict: 0 }));
        const lazy = w.debrief(lazyRun.history, lazyRun.state);
        ok(!lazy.insights[0].holds && !lazy.insights[1].holds && !lazy.insights[2].holds && lazy.score < 40, `Survey: knocking only on Market Road scores badly (${lazy.score.toFixed(0)}%) and is not credited with any sampling insight`);
    })();

    // ── 5. Town bank: credit creation and the RBI ───────────────────
    (function testLifeBank() {
        const w = world('town-bank'), T = w.truth;
        const maxPolicy = r => (r.round <= T.LEND_ROUNDS ? { decision: { pct: 100 * (1 - T.LRR) }, predict: 2 } : { decision: T.situation(r.round) === 'inflation' ? { lrr: '0.25', repo: 'raise' } : { lrr: '0.1', repo: 'cut' } });
        const run = play(w, 1, maxPolicy), bank = run.history.slice(0, T.LEND_ROUNDS).map(r => r.outcome);
        ok(bank.every((o, i) => i === 0 || near(o.deposit, bank[i - 1].deposit * (1 - T.LRR), 1e-6)), 'Bank: lending the legal maximum makes each new deposit (1 − LRR) of the last — a geometric series');
        ok(bank.every(o => near(o.totalDeposits, o.pathMax, 1e-6) && near(o.totalReserves, T.LRR * o.totalDeposits, 1e-6) && near(o.totalLoans + o.totalReserves, o.totalDeposits, 1e-6)), 'Bank: on that path reserves are exactly LRR × deposits, and loans + reserves = deposits');
        ok([1, 5, 20, 80].every(n => T.maxPath(T.INITIAL, T.LRR, n) < T.limit(T.INITIAL, T.LRR)) && near(T.maxPath(T.INITIAL, T.LRR, 400), T.limit(T.INITIAL, T.LRR), 1e-3), 'Bank: total deposits approach Initial × 1/LRR and never pass it');
        ok(near(T.limit(T.INITIAL, T.LRR), T.INITIAL * T.multiplier(T.LRR)) && near(T.multiplier(T.LRR), 5), 'Bank: money multiplier = 1/LRR (5 at 20%)');
        ok(T.multiplier(0.25) < T.multiplier(0.2) && T.multiplier(0.2) < T.multiplier(0.1), 'Bank: a higher reserve ratio means a smaller multiplier');
        ok(run.history[0].predict.correct, 'Bank: the round-1 gut call is graded against Initial × 1/LRR');
        const top = w.debrief(run.history, run.state);
        ok(near(top.score, 100, 1e-6), `Bank: lending the legal maximum and moving both RBI instruments the right way scores 100% (${top.score.toFixed(1)})`);
        ok(top.insights[0].holds && top.insights[1].holds && !top.insights[2].holds && top.insights[3].holds && top.insights[4].holds, 'Bank: that player lived creation, the multiplier and both RBI stances — and is honestly told they never saw what idle reserves do');

        [[0, 'lends nothing'], [50, 'lends half'], [100, 'tries to lend everything']].forEach(([pct, label]) => {
            const r = play(w, 1, x => (x.round <= T.LEND_ROUNDS ? { decision: { pct } } : { decision: { lrr: '0.2', repo: 'hold' } }));
            const os = r.history.slice(0, T.LEND_ROUNDS).map(x => x.outcome);
            ok(os.every(o => o.totalDeposits <= o.pathMax + 1e-6 && o.lent <= o.legalMax + 1e-6 && near(o.lent + o.kept, o.deposit, 1e-6)), `Bank (${label}): deposits never exceed the legal-maximum path, loans never exceed the legal limit, and lent + kept = the deposit`);
        });
        const greedy = play(w, 1, x => (x.round <= T.LEND_ROUNDS ? { decision: { pct: 100 } } : { decision: { lrr: '0.2', repo: 'hold' } }));
        ok(greedy.history.slice(0, T.LEND_ROUNDS).every(r => r.outcome.violation) && greedy.state.strikes === T.LEND_ROUNDS, 'Bank: lending past the reserve requirement is stopped every time and counted');
        ok(w.debrief(greedy.history, greedy.state).score < top.score, 'Bank: breaking the reserve rule scores below obeying it');
        const miser = play(w, 1, x => (x.round <= T.LEND_ROUNDS ? { decision: { pct: 0 } } : { decision: { lrr: '0.2', repo: 'hold' } }));
        const md = w.debrief(miser.history, miser.state);
        ok(miser.history[1].outcome.deposit === 0 && near(miser.history[5].outcome.totalDeposits, T.INITIAL) && !md.insights[0].holds, 'Bank: a bank that lends nothing creates nothing — deposits stay at the initial cash, and no credit creation is claimed');
        const half = play(w, 1, x => (x.round <= T.LEND_ROUNDS ? { decision: { pct: 40 } } : { decision: { lrr: '0.2', repo: 'hold' } }));
        ok(w.debrief(half.history, half.state).insights[2].holds, 'Bank: holding back loans is what earns the idle-reserves insight');
        const backwards = play(w, 1, x => (x.round <= T.LEND_ROUNDS ? { decision: { pct: 80 } } : { decision: T.situation(x.round) === 'inflation' ? { lrr: '0.1', repo: 'cut' } : { lrr: '0.25', repo: 'raise' } }));
        const bd = w.debrief(backwards.history, backwards.state);
        ok(!bd.insights[3].holds && !bd.insights[4].holds && backwards.history.slice(T.LEND_ROUNDS).every(r => r.outcome.marks === 0), 'Bank: loosening in inflation and tightening in a slowdown is marked wrong on both instruments');
        ok(run.history[6].outcome.limit < run.history[6].outcome.limitBefore && run.history[7].outcome.limit > run.history[7].outcome.limitBefore, 'Bank: raising the ratio shrinks, and cutting it enlarges, what the same deposit can become');
    })();

    // ── 6. Finance minister: multiplier, gaps, deficits ─────────────
    (function testLifeFM() {
        const w = world('finance-minister'), T = w.truth;
        const grid = (lo, hi, step) => { const o = []; for (let v = lo; v <= hi; v += step) o.push(v); return o; };
        let adOk = true, capOk = true, gapOk = true, budgetOk = true;
        grid(T.G_MIN, T.G_MAX, 20).forEach(g => grid(T.T_MIN, T.T_MAX, 20).forEach(t => T.I_BY_YEAR.forEach(i => {
            const y = T.yEq(g, t, i), r = T.year(g, t, i, T.DEBT0);
            if (!near(T.ad(y, g, t, i), y, 1e-6)) adOk = false;
            if (r.output > T.YF + 1e-9 || (r.gapType === 'deficient' && !near(r.output, y, 1e-9))) capOk = false;
            const wanted = y < T.YF - 1e-6 ? 'deficient' : (y > T.YF + 1e-6 ? 'excess' : 'none');
            if (r.gapType !== wanted || !near(r.gap, Math.abs(T.ad(T.YF, g, t, i) - T.YF), 1e-9) || (wanted !== 'deficient' && r.idlePct !== 0)) gapOk = false;
            if (!near(r.fiscal, g + T.RATE * T.DEBT0 - t, 1e-9) || !near(r.primary, r.fiscal - r.interest, 1e-9) || !near(r.debtEnd, T.DEBT0 + r.fiscal, 1e-9)) budgetOk = false;
        })));
        ok(adOk, 'FM: at equilibrium income, aggregate demand equals income (Y = AD) for every G, T and I');
        ok(capOk, 'FM: output never exceeds full-employment income; in a slump output is the equilibrium income');
        ok(gapOk, 'FM: the gap is |AD − Y| measured AT full employment, named deflationary below it and inflationary above it; no unemployment is drawn at or above full employment');
        ok(budgetOk, 'FM: fiscal deficit = G + interest − T; primary deficit = fiscal deficit − interest; debt grows by the fiscal deficit');
        ok(near(T.yEq(T.G0 + 10, T.T0, 200) - T.yEq(T.G0, T.T0, 200), 10 * T.kG(), 1e-6) && near(T.kG(), 1 / (1 - T.B)), 'FM: ΔY/ΔG = 1/(1 − MPC)');
        ok(near(T.yEq(T.G0, T.T0, 210) - T.yEq(T.G0, T.T0, 200), 10 * T.kG(), 1e-6), 'FM: the investment multiplier is the same 1/(1 − MPC)');
        ok(near(T.yEq(T.G0, T.T0 + 10, 200) - T.yEq(T.G0, T.T0, 200), 10 * T.kT(), 1e-6) && near(T.kT(), -T.B / (1 - T.B)) && Math.abs(T.kT()) < T.kG(), 'FM: ΔY/ΔT = −MPC/(1 − MPC), weaker than the spending multiplier');
        ok(near(T.yEq(T.G0, T.T0, T.I_NORMAL), T.YF, 1e-6), 'FM: the opening budget with normal investment sits exactly at full employment, as the brief says');
        T.I_BY_YEAR.forEach((i, k) => {
            const hit = grid(T.G_MIN, T.G_MAX, 5).some(g => grid(T.T_MIN, T.T_MAX, 5).some(t => near(T.yEq(g, t, i), T.YF, 1e-6)));
            ok(hit, `FM year ${k + 1}: some G and T on the sliders close the gap exactly (so 100% is reachable)`);
        });

        // Year 1 cuts tax, later years steer with G — every year lands on Yf.
        const plan = { 1: { g: 300, t: 200 }, 2: { g: 310, t: 200 }, 3: { g: 260, t: 200 }, 4: { g: 210, t: 200 }, 5: { g: 230, t: 200 } };
        const run = play(w, 1, r => ({ decision: plan[r.round], predict: r.round === 1 ? 1 : 2 }));
        const top = w.debrief(run.history, run.state);
        ok(near(top.score, 100, 1e-6) && run.history.every(r => r.outcome.gapType === 'none'), `FM: a minister who closes every gap scores 100% (${top.score.toFixed(1)})`);
        ok(top.insights.every(i => i.holds), 'FM: that minister lived the multiplier, both gaps, the tax lever and the deficits');
        ok(run.history[0].predict.correct && run.history[3].predict.correct, 'FM: both gut calls are graded from the model (income falls by k × ΔI; an untouched boom is excess demand)');
        const y1 = run.history[0].outcome;
        ok(near(y1.doNothingY, T.YF - (T.I_NORMAL - T.invest(1)) * T.kG(), 1e-6), 'FM: "had you done nothing" is the model run with last year’s G and T');
        ok(run.history.every((r, k) => k === 0 || near(r.outcome.debtStart, run.history[k - 1].outcome.debtEnd, 1e-9)) && run.history.every(r => near(r.outcome.interest, T.RATE * r.outcome.debtStart, 1e-9)), 'FM: each year’s interest is charged on the debt the last year actually left');

        const idle = play(w, 1, () => ({ decision: { g: T.G0, t: T.T0 }, predict: 0 }));
        const id = w.debrief(idle.history, idle.state);
        ok(id.score < 60 && !id.insights[1].holds && !id.insights[2].holds && !id.insights[3].holds, `FM: a minister who never moves a lever scores low (${id.score.toFixed(0)}%) and is not credited with correcting either gap or using the tax lever`);
        ok(idle.history[0].outcome.gapType === 'deficient' && idle.history[0].outcome.idlePct > 0 && idle.history[3].outcome.gapType === 'excess' && near(idle.history[3].outcome.output, T.YF), 'FM: untouched, the slump leaves workers idle and the boom leaves output stuck at capacity with prices rising');
        const wrongWay = play(w, 1, r => ({ decision: T.invest(r.round) < T.I_NORMAL ? { g: T.G_MIN, t: T.T_MAX } : { g: T.G_MAX, t: T.T_MIN } }));
        const wd = w.debrief(wrongWay.history, wrongWay.state);
        ok(!wd.insights[1].holds && !wd.insights[2].holds, 'FM: cutting spending in a slump and raising it in a boom is never credited as a correction');
    })();

    setLang('en');
    console.log(`Living Economy: ${W.length} worlds tested (${W.map(x => x.id).join(', ')}).`);
};
