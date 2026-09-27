// ══════════════════════════════════════════════════════════════
// AI TUTOR ("Multiplier Coach") — a rule-based, deterministic teaching
// layer scoped to sims that opt in with `sim.aiTutor = {...}`.
//
// This project is 100% static files with no backend (confirmed by
// inspection — no fetch/API calls anywhere in js/*.js), so there is no
// safe place to hold an LLM API key: calling a real LLM straight from
// the browser would ship that key to every visitor. Exactly like
// js/mima-explain.js, this file is the deterministic explanation layer
// itself, not a placeholder for a real one — every sentence is built
// from a template plus a value that already came out of the sim's own
// compute(), so it can never contradict the model.
//
// What makes this distinct from Mima (js/mima-*.js), which is app-wide
// and read-only: this is a per-sim side panel that can also DRIVE the
// sim's own sliders from a typed question ("bidirectional actuation"),
// and it turns the student's own interaction history into an adaptive
// quiz question, computed live from sim.compute() — never authored,
// so it cannot drift from the model the way a hand-written question
// could.
//
// Currently wired to exactly one sim: macro-multiplier (js/simulations.js).
// A second sim can opt in by adding its own `aiTutor: { scenarios, missions }`
// (see macro-multiplier's entry for the shape) — nothing here is
// hard-coded to that one sim's id.
// ══════════════════════════════════════════════════════════════

(function () {
    let activeSim = null;
    let history = []; // { id, dir: 1 | -1, at }
    let completedMissions = new Set();
    let sessionXP = 0;
    // The metrics from the render currently on screen. NOT read from
    // sim-engine.js's `prevSimResult` — by the time aiTutorOnRender runs,
    // that global still holds the PREVIOUS render's metrics (it's only
    // reassigned after this hook returns), so this file tracks its own
    // "current" copy instead, handed in directly by aiTutorOnRender.
    let lastMetrics = null;
    let cardEl = null, logEl = null, scenarioEl = null, missionsEl = null, quizBodyEl = null;

    function lang() { return (typeof currentLang !== 'undefined' && currentLang === 'hi') ? 'hi' : 'en'; }
    function t(en, hi) { return lang() === 'hi' ? hi : en; }

    function els() {
        cardEl = document.getElementById('ai-tutor-card');
        logEl = document.getElementById('ai-tutor-log');
        scenarioEl = document.getElementById('ai-tutor-scenario');
        missionsEl = document.getElementById('ai-tutor-missions');
        quizBodyEl = document.getElementById('ai-tutor-quiz-body');
    }

    function findControl(sim, id) {
        return (sim.controls || []).find(c => c.id === id);
    }

    function clampToStep(value, c) {
        const snapped = Math.round((value - c.min) / c.step) * c.step + c.min;
        return Math.min(c.max, Math.max(c.min, +snapped.toFixed(6)));
    }

    // ── Bidirectional actuation ──────────────────────────────────────
    // Moves an actual control (same DOM the student drags) and replays
    // the SAME code path a manual drag uses, so every downstream effect
    // (ghosts, effect line, Mima, missions) fires exactly as it would
    // for a real interaction — no separate "AI-triggered" recompute path
    // to keep in sync with the real one.
    function actuateControl(sim, id, delta) {
        const c = findControl(sim, id);
        if (!c) return null;
        const before = simEngineState[id] != null ? simEngineState[id] : c.value;
        const after = clampToStep(before + delta, c);
        simEngineState[id] = after;
        const rangeEl = document.getElementById('ctl-' + id);
        const numEl = document.getElementById('ctl-' + id + '-num');
        if (rangeEl) rangeEl.value = after;
        if (numEl) numEl.value = after;
        history.push({ id, dir: after > before ? 1 : (after < before ? -1 : 0), at: Date.now() });
        if (typeof renderSimChart === 'function') renderSimChart(sim);
        return { before, after };
    }

    const VAR_KEYWORDS = {
        mpc: ['mpc', 'marginal propensity', 'consume', 'consumption', 'save', 'saving', 'spend'],
        di: ['investment', 'firms invest', ' di ', 'δi', 'invest'],
        dg: ['government', 'govt', 'public spending', 'infrastructure', 'highway', ' dg '],
        dt: ['tax', 'taxes', ' dt ']
    };
    const UP_WORDS = ['increase', 'raise', 'rise', 'more', 'higher', 'up', 'boost', 'grow', 'jump', 'expand'];
    const DOWN_WORDS = ['decrease', 'lower', 'less', 'fall', 'cut', 'reduce', 'drop', 'down', 'shrink'];

    function detectVar(text) {
        for (const id of Object.keys(VAR_KEYWORDS)) {
            if (VAR_KEYWORDS[id].some(k => text.indexOf(k) !== -1)) return id;
        }
        return null;
    }
    function detectDirection(text) {
        if (UP_WORDS.some(w => text.indexOf(w) !== -1)) return 1;
        if (DOWN_WORDS.some(w => text.indexOf(w) !== -1)) return -1;
        // "save most/more of their income" ⇒ consumers spend a smaller
        // share of each extra rupee ⇒ MPC down, even with no other
        // up/down word present.
        if (/\bsav(e|ing|es)\b/.test(text)) return -1;
        return 0;
    }

    const FAQ = [
        { keys: ['what is', 'multiplier'], en: () => `The multiplier (k = 1 / (1 − MPC)) measures how much a ₹1 injection of spending ultimately raises national income, once every round of re-spending is added up. Right now, with MPC = ${fmt(simEngineState.mpc)}, k = ${fmt(prevMetric('k'))}.`,
          hi: () => `गुणक (k = 1 / (1 − MPC)) यह मापता है कि ₹1 के व्यय-इंजेक्शन से, हर दौर के पुनः-व्यय को जोड़ने पर, अंततः राष्ट्रीय आय कितनी बढ़ती है। अभी MPC = ${fmt(simEngineState.mpc)} पर, k = ${fmt(prevMetric('k'))} है।` },
        { keys: ['formula'], en: () => `Investment/Govt multiplier: k = 1 / (1 − MPC). Tax multiplier: kt = −MPC / (1 − MPC). Total ΔY = k×(ΔI + ΔG) + kt×ΔT.`,
          hi: () => `निवेश/सरकारी व्यय गुणक: k = 1 / (1 − MPC)। कर गुणक: kt = −MPC / (1 − MPC)। कुल ΔY = k×(ΔI + ΔG) + kt×ΔT।` },
        { keys: ['negative', 'kt', 'tax multiplier'], en: () => `The tax multiplier (kt) is negative because a TAX INCREASE lowers disposable income, so it lowers spending — a rise in ΔT should reduce Y, hence the minus sign.`,
          hi: () => `कर गुणक (kt) ऋणात्मक इसलिए है क्योंकि कर वृद्धि प्रयोज्य आय घटाती है, जिससे व्यय घटता है — ΔT बढ़ने से Y घटना चाहिए, इसलिए ऋण चिह्न है।` },
        { keys: ['smaller', 'tax multiplier', 'spending multiplier'], en: () => `The tax multiplier is always smaller in size than the spending multiplier — exactly by 1 (k − |kt| = 1) — because a tax change only reaches spending indirectly, through disposable income, while ΔI/ΔG are spent directly.`,
          hi: () => `कर गुणक हमेशा व्यय गुणक से छोटा होता है — ठीक 1 से (k − |kt| = 1) — क्योंकि कर परिवर्तन व्यय तक केवल अप्रत्यक्ष रूप से (प्रयोज्य आय के माध्यम से) पहुँचता है, जबकि ΔI/ΔG सीधे व्यय होते हैं।` }
    ];

    function prevMetric(key) {
        return lastMetrics ? lastMetrics[key] : NaN;
    }

    function matchFAQ(text) {
        return FAQ.find(f => f.keys.every(k => text.indexOf(k) !== -1));
    }

    function aiTutorAnswer(sim, rawText) {
        const text = (' ' + rawText.toLowerCase() + ' ');
        const varId = detectVar(text);
        const dir = detectDirection(text);

        if (varId && dir !== 0) {
            const c = findControl(sim, varId);
            if (!c) return t("I don't have a control for that yet.", 'मेरे पास अभी उसके लिए कोई नियंत्रण नहीं है।');
            const delta = dir * c.step * 3;
            actuateControl(sim, varId, delta);
            const ctx = (typeof getMimaContext === 'function') ? getMimaContext() : null;
            const label = controlLabel(sim, c);
            const parts = [t(`Done — I moved ${label} for you.`, `हो गया — मैंने ${label} बदल दिया है।`)];
            if (ctx && ctx.effects && ctx.effects.length) {
                ctx.effects.forEach(e => parts.push(`${e.label}: ${e.before} → ${e.after}${e.rose ? ' ▲' : ' ▼'}.`));
            } else {
                parts.push(t('The numbers barely moved from here — try a bigger change.', 'यहाँ से संख्याएँ मुश्किल से हिलीं — बड़ा बदलाव आज़माएँ।'));
            }
            return parts.join(' ');
        }

        const faq = matchFAQ(text);
        if (faq) return faq[lang()]();

        return t(
            'I can move ΔI, ΔG, ΔT or MPC for you — try "what if MPC falls?" or "raise government spending". Or ask about "the formula", "why is the tax multiplier smaller", or "what is the multiplier".',
            'मैं आपके लिए ΔI, ΔG, ΔT या MPC बदल सकता हूँ — "अगर MPC घटे तो?" या "सरकारी व्यय बढ़ाएँ" जैसा पूछें। या "सूत्र", "कर गुणक छोटा क्यों है", या "गुणक क्या है" के बारे में पूछें।'
        );
    }

    // ── Dynamic real-world scenario (Phase 2) ───────────────────────
    function renderScenario(sim) {
        if (!scenarioEl) return;
        const bank = sim.aiTutor && sim.aiTutor.scenarios;
        if (!bank) { scenarioEl.innerHTML = ''; return; }
        const last = history.length ? history[history.length - 1] : null;
        if (!last || last.dir === 0) {
            scenarioEl.innerHTML = `<p class="ai-tutor-scenario-hint">${t('Change a variable (or ask me to) to see a real-world example.', 'वास्तविक दुनिया का उदाहरण देखने के लिए कोई चर बदलें (या मुझसे कहें)।')}</p>`;
            return;
        }
        const generator = bank[last.id] && bank[last.id][last.dir > 0 ? 'up' : 'down'];
        if (!generator) { scenarioEl.innerHTML = ''; return; }
        const text = generator(simEngineState[last.id], lang() === 'hi');
        scenarioEl.innerHTML = `<p class="ai-tutor-scenario-text">🌍 ${text}</p>`;
    }

    // ── Adaptive quiz generation (Phase 3) ──────────────────────────
    function roundNice(n) {
        return Math.round(n * 100) / 100;
    }
    function distractorsFor(correct) {
        const set = new Set([roundNice(correct)]);
        [correct * 0.5, correct * 1.5, -correct, correct + (correct === 0 ? 5 : correct * 0.25)]
            .forEach(v => { const r = roundNice(v); if (isFinite(r)) set.add(r); });
        const arr = Array.from(set).slice(0, 4);
        while (arr.length < 4) arr.push(roundNice(correct + arr.length * 3 + 1));
        return arr;
    }
    function shuffle(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function generateQuiz(sim) {
        const metrics = lastMetrics;
        if (!metrics) return null;
        const touched = Array.from(new Set(history.slice(-6).map(h => h.id)));
        let question, correct, unit = '₹', suffix = 'B';

        if (touched.indexOf('dt') !== -1 && (touched.indexOf('mpc') !== -1 || touched.indexOf('di') !== -1 || touched.indexOf('dg') !== -1)) {
            question = t(
                `You set MPC = ${fmt(simEngineState.mpc)}, ΔI = ₹${fmt(simEngineState.di)}B, ΔG = ₹${fmt(simEngineState.dg)}B and ΔT = ₹${fmt(simEngineState.dt)}B. What is the TOTAL ΔY (spending effect + tax effect combined)?`,
                `आपने MPC = ${fmt(simEngineState.mpc)}, ΔI = ₹${fmt(simEngineState.di)}B, ΔG = ₹${fmt(simEngineState.dg)}B और ΔT = ₹${fmt(simEngineState.dt)}B सेट किया। कुल ΔY (व्यय प्रभाव + कर प्रभाव मिलाकर) क्या है?`
            );
            correct = roundNice(metrics.dySpending + metrics.dyTax);
        } else if (touched.length) {
            const id = touched[touched.length - 1];
            if (id === 'mpc') {
                question = t(`At MPC = ${fmt(simEngineState.mpc)}, what is the Investment/Govt Multiplier (k)?`, `MPC = ${fmt(simEngineState.mpc)} पर, निवेश/सरकारी गुणक (k) क्या है?`);
                correct = roundNice(metrics.k);
                unit = ''; suffix = '';
            } else if (id === 'dt') {
                question = t(`With MPC = ${fmt(simEngineState.mpc)} and ΔT = ₹${fmt(simEngineState.dt)}B, what is ΔY from tax alone?`, `MPC = ${fmt(simEngineState.mpc)} और ΔT = ₹${fmt(simEngineState.dt)}B के साथ, केवल कर से ΔY क्या है?`);
                correct = roundNice(metrics.dyTax);
            } else {
                const label = id === 'di' ? 'ΔI' : 'ΔG';
                question = t(`With MPC = ${fmt(simEngineState.mpc)} and ${label} = ₹${fmt(simEngineState[id])}B, what is ΔY from spending alone?`, `MPC = ${fmt(simEngineState.mpc)} और ${label} = ₹${fmt(simEngineState[id])}B के साथ, केवल व्यय से ΔY क्या है?`);
                correct = roundNice(metrics.dySpending);
            }
        } else {
            question = t(`At MPC = ${fmt(simEngineState.mpc)}, what is the Investment Multiplier (k)?`, `MPC = ${fmt(simEngineState.mpc)} पर, निवेश गुणक (k) क्या है?`);
            correct = roundNice(metrics.k);
            unit = ''; suffix = '';
        }

        const options = shuffle(distractorsFor(correct));
        const correctIndex = options.indexOf(correct);
        return { question, options, correctIndex, unit, suffix };
    }

    function renderQuiz(sim) {
        if (!quizBodyEl) return;
        const q = generateQuiz(sim);
        if (!q) { quizBodyEl.innerHTML = `<p class="empty-hint">${t('Move a slider first, then generate a question.', 'पहले कोई स्लाइडर हिलाएँ, फिर प्रश्न बनाएँ।')}</p>`; return; }
        quizBodyEl.innerHTML = `
            <p class="ai-tutor-quiz-q">${q.question}</p>
            <div class="ai-tutor-quiz-opts">
                ${q.options.map((opt, i) => `<button type="button" class="ai-tutor-quiz-opt" data-i="${i}">${q.unit}${fmt(opt)}${q.suffix}</button>`).join('')}
            </div>
            <p class="ai-tutor-quiz-result" id="ai-tutor-quiz-result"></p>
        `;
        quizBodyEl.querySelectorAll('.ai-tutor-quiz-opt').forEach(btn => {
            btn.addEventListener('click', () => {
                const i = parseInt(btn.dataset.i, 10);
                const resultEl = document.getElementById('ai-tutor-quiz-result');
                quizBodyEl.querySelectorAll('.ai-tutor-quiz-opt').forEach(b => b.disabled = true);
                if (i === q.correctIndex) {
                    btn.classList.add('correct');
                    if (resultEl) resultEl.textContent = t('✅ Correct!', '✅ सही!');
                    awardXP(10);
                } else {
                    btn.classList.add('incorrect');
                    const correctBtn = quizBodyEl.querySelector(`[data-i="${q.correctIndex}"]`);
                    if (correctBtn) correctBtn.classList.add('correct');
                    if (resultEl) resultEl.textContent = t('❌ Not quite — correct answer highlighted.', '❌ सही नहीं — सही उत्तर हाइलाइट किया गया।');
                }
            });
        });
    }

    // ── Missions / session XP (Phase 3) ─────────────────────────────
    function awardXP(n) {
        sessionXP += n;
        renderXPTotal();
    }
    function renderXPTotal() {
        const el = document.getElementById('ai-tutor-xp-total');
        if (el) el.textContent = t(`Session XP: ${sessionXP}`, `सत्र XP: ${sessionXP}`);
    }
    function safeCheck(mission) {
        try { return !!mission.check(simEngineState, lastMetrics); } catch (e) { return false; }
    }
    function renderMissions(sim) {
        if (!missionsEl) return;
        const missions = (sim.aiTutor && sim.aiTutor.missions) || [];
        if (!missions.length) { missionsEl.innerHTML = ''; return; }
        missionsEl.innerHTML = missions.map(m => {
            const done = safeCheck(m);
            if (done && !completedMissions.has(m.id)) {
                completedMissions.add(m.id);
                awardXP(m.xp);
            }
            const label = lang() === 'hi' ? (m.hiPrompt || m.prompt) : m.prompt;
            return `<div class="ai-tutor-mission${completedMissions.has(m.id) ? ' done' : ''}">${completedMissions.has(m.id) ? '✅' : '⬜'} ${label} <span class="ai-tutor-mission-xp">+${m.xp} XP</span></div>`;
        }).join('') + `<div class="ai-tutor-xp-total" id="ai-tutor-xp-total">${t(`Session XP: ${sessionXP}`, `सत्र XP: ${sessionXP}`)}</div>`;
    }

    // ── Chat log ─────────────────────────────────────────────────────
    function appendLog(role, text) {
        if (!logEl) return;
        const row = document.createElement('div');
        row.className = 'ai-tutor-msg ai-tutor-msg--' + role;
        row.textContent = text;
        logEl.appendChild(row);
        logEl.scrollTop = logEl.scrollHeight;
    }

    // ── Engine hooks (called from js/sim-engine.js) ─────────────────
    function aiTutorOnSimSwitch(sim) {
        els();
        activeSim = (sim && sim.aiTutor) ? sim : null;
        history = [];
        completedMissions = new Set();
        sessionXP = 0;
        lastMetrics = null;
        if (logEl) logEl.innerHTML = '';
        if (quizBodyEl) quizBodyEl.innerHTML = '';
        if (!cardEl) return;
        cardEl.classList.toggle('hidden', !activeSim);
        if (activeSim) {
            appendLog('bot', t(
                'Hi! I’m your Multiplier Coach. Drag a slider, or ask me things like "what if MPC falls?" — I can move the sliders myself and explain what happens.',
                'नमस्ते! मैं आपका मल्टीप्लायर कोच हूं। कोई स्लाइडर खींचें, या मुझसे पूछें जैसे "अगर MPC घटे तो?" — मैं खुद स्लाइडर हिला सकता हूं और बता सकता हूं कि क्या होता है।'
            ));
            renderScenario(activeSim);
            renderMissions(activeSim);
        }
    }

    function aiTutorOnRender(sim, metrics) {
        if (!sim || !sim.aiTutor) return;
        els();
        if (!cardEl) return;
        activeSim = sim;
        lastMetrics = metrics || {};
        renderScenario(sim);
        renderMissions(sim);
    }

    // ── UI wiring (static DOM, present in index.html; wired once) ───
    function wireEvents() {
        els();
        const form = document.getElementById('ai-tutor-chat-form');
        const input = document.getElementById('ai-tutor-chat-input');
        if (form && !form.dataset.wired) {
            form.dataset.wired = '1';
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const text = input.value.trim();
                if (!text || !activeSim) return;
                appendLog('user', text);
                appendLog('bot', aiTutorAnswer(activeSim, text));
                input.value = '';
            });
        }
        const quizBtn = document.getElementById('ai-tutor-quiz-btn');
        if (quizBtn && !quizBtn.dataset.wired) {
            quizBtn.dataset.wired = '1';
            quizBtn.addEventListener('click', () => { if (activeSim) renderQuiz(activeSim); });
        }
        const themeBtn = document.getElementById('ai-tutor-theme-btn');
        if (themeBtn && !themeBtn.dataset.wired) {
            themeBtn.dataset.wired = '1';
            themeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!cardEl) return;
                const dark = cardEl.classList.toggle('ai-tutor-dark');
                themeBtn.textContent = dark ? '☀️' : '🌙';
            });
        }
    }

    window.aiTutorOnSimSwitch = aiTutorOnSimSwitch;
    window.aiTutorOnRender = aiTutorOnRender;
    document.addEventListener('DOMContentLoaded', wireEvents);
})();
