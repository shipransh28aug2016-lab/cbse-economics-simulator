// ══════════════════════════════════════════════════════════════
// Dynamic quiz generation engine — every simulation's "🎯 Take the
// Quiz" button opens a fresh, ≥10-question quiz built from that sim's
// entry in QUIZ_BANK (see js/quiz-data*.js). Each question is tagged
// with a Bloom's Taxonomy level (remember/understand/apply/analyse/
// evaluate/create), matching the cognitive-level split the CBSE 030
// syllabus's own question-paper design uses (see
// curriculum/Economics_2026-27_Content_MicroContent_Taxonomy.md §12/§30).
//
// A quiz mixes two kinds of question:
//   - `static` — hand-authored, fixed question/options/explanation.
//   - `applyTemplates` — a `build(state, metrics)` function that reuses
//     the SAME already-tested sim.compute()/dataLab.calculate() output
//     to generate a fresh numeric question (with a live-correct answer
//     and plausible near-miss distractors) from a randomized input
//     state. This is what makes the engine "dynamic": re-opening the
//     quiz for the same sim can produce different Apply-level
//     questions each time, without ever risking a wrong hard-coded
//     answer (the correct option is always computed, never authored).
// ══════════════════════════════════════════════════════════════

// quizState is the quiz machine's context (see quizMachine below). Kept as a
// global of the same name and shape so existing readers keep working;
// `answered` is now DERIVED from the machine's state, never set by hand.
let quizState = { sim: null, items: [], questions: [], index: 0, score: 0, chosen: null, answered: false };

// Populated by js/quiz-data*.js, one property per sim id: { static: [...],
// applyTemplates: [...] } — see the file header above for the shape of
// each. Declared here (loads first) so every quiz-data file can safely
// mutate the same shared object, exactly like js/simulations.js's SIMS.
const QUIZ_BANK = {};

const BLOOM_LABELS = {
    remember: { en: 'Remember', hi: 'याद रखना' },
    understand: { en: 'Understand', hi: 'समझना' },
    apply: { en: 'Apply', hi: 'अनुप्रयोग' },
    analyse: { en: 'Analyse', hi: 'विश्लेषण' },
    evaluate: { en: 'Evaluate', hi: 'मूल्यांकन' },
    create: { en: 'Create', hi: 'सृजन' }
};

function bloomLabel(level) {
    const entry = BLOOM_LABELS[level] || BLOOM_LABELS.understand;
    return typeof localize === 'function' ? localize(entry) : entry.en;
}

function quizShuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// Picks a uniformly random value within a simulator control's own
// min/max/step (or a random option, for a `select` control) — used to
// drive apply-templates through compute() at a fresh input each time.
function quizRandomState(sim) {
    const state = {};
    // A Graph Lab declares its inputs as `graphLab.vars` rather than
    // `controls` (they render as the chip strip under the diagram, not as
    // the slider column) — same {min,max,step} shape, so the same random
    // walk works once we read from the right list.
    const inputs = (sim.mode === 'graphlab' && sim.graphLab)
        ? (sim.graphLab.vars || [])
        : (sim.controls || []);
    inputs.forEach(c => {
        if (c.type === 'select') {
            state[c.id] = c.options[Math.floor(Math.random() * c.options.length)].value;
        } else {
            const steps = Math.max(1, Math.round((c.max - c.min) / c.step));
            const k = Math.floor(Math.random() * (steps + 1));
            state[c.id] = Math.round((c.min + k * c.step) * 1e6) / 1e6;
        }
    });
    return state;
}

function quizLocalize(val) {
    if (typeof localize === 'function') return localize(val);
    // Standalone (no app.js, e.g. the test harness): same rule as localize().
    if (val && typeof val === 'object') return (typeof currentLang !== 'undefined' && currentLang === 'hi' && val.hi) || val.en || '';
    return val || '';
}

// Builds a 4-option (or however many `deltas` + 1) numeric MCQ options
// list from one correct value and a list of offsets for distractors —
// shared by apply-templates across every quiz-data*.js file so each
// one doesn't hand-roll rounding/collision logic. Numbers render the
// same in both languages, so these are plain strings, not {en,hi}
// pairs — quizLocalize() passes a plain string through unchanged.
function quizNumericOptions(correctValue, deltas, opts) {
    opts = opts || {};
    const round = opts.round === undefined ? 2 : opts.round;
    const prefix = opts.prefix || '';
    const suffix = opts.suffix || '';
    const fmtNum = (n) => {
        const factor = Math.pow(10, round);
        const r = Math.round(n * factor) / factor;
        return round === 0 ? String(Math.round(r)) : String(r);
    };
    const seen = new Set([fmtNum(correctValue)]);
    const finalValues = [correctValue];
    deltas.forEach(d => {
        let v = correctValue + d, guard = 0;
        while (seen.has(fmtNum(v)) && guard < 6) { v += (d >= 0 ? 1 : -1) * Math.max(0.5, Math.abs(d) * 0.5); guard++; }
        seen.add(fmtNum(v));
        finalValues.push(v);
    });
    const sfx = suffix;
    // A unit word is language-specific, so those options carry both forms
    // and re-localize with the rest of the question on a language toggle.
    const SUFFIX_EN_HI = { ' units': ' इकाई', ' cr': ' करोड़' };
    if (SUFFIX_EN_HI[suffix]) {
        return finalValues.map(v => ({ en: `${prefix}${fmtNum(v)}${suffix}`, hi: `${prefix}${fmtNum(v)}${SUFFIX_EN_HI[suffix]}` }));
    }
    return finalValues.map(v => `${prefix}${fmtNum(v)}${sfx}`);
}

// A template's Hindi text names readings rows ("Karl Pearson's r") as they
// read in English, but in Hindi mode the panel shows them in Hindi. Run the
// Hindi through the SAME translateReadings() the panel uses, so the quiz
// names exactly the label the student sees. No-op in English mode.
function quizHindiLabels(sim, built) {
    if (typeof currentLang === 'undefined' || currentLang !== 'hi' || typeof translateReadings !== 'function') return built;
    const fix = v => (v && typeof v === 'object' && typeof v.hi === 'string')
        ? Object.assign({}, v, { hi: translateReadings(sim, v.hi.replace(/Live Readings(\/Stats)?/g, 'लाइव रीडिंग्स')) }) : v;
    return Object.assign({}, built, { question: fix(built.question), explain: fix(built.explain), options: (built.options || []).map(fix) });
}

// Resolves a raw bank entry (English/Hindi option objects, etc.) to a
// plain-string question ready to render in the current language.
//
// `q.misconceptions` (optional): { <original option index>: {en,hi} } —
// a targeted "why this specific wrong answer is a common mix-up" message
// for a wrong option, distinct from `explain`'s general "here's the right
// answer" text. Converted here into a map keyed by the option's own
// (already-localized) TEXT rather than its index, so it survives
// shuffleQuizOptions() reordering the options array untouched — no
// separate bookkeeping needed to keep it aligned after a shuffle.
function normalizeQuizQuestion(q) {
    const options = (q.options || []).map(quizLocalize);
    let misconceptions = null;
    if (q.misconceptions) {
        misconceptions = {};
        Object.keys(q.misconceptions).forEach(idx => {
            if (options[idx] !== undefined) misconceptions[options[idx]] = quizLocalize(q.misconceptions[idx]);
        });
    }
    return {
        level: q.level || 'understand',
        question: quizLocalize(q.question),
        options,
        correctIndex: q.correctIndex,
        explain: quizLocalize(q.explain),
        syllabusId: q.syllabusId || null,
        misconceptions
    };
}

// Shuffles a normalized question's options while keeping track of
// which one is correct (matched by text, so every option in a
// question must be textually distinct — enforced by
// tools/test-curriculum.js).
function shuffleQuizOptions(q) {
    const correctText = q.options[q.correctIndex];
    const options = quizShuffle(q.options);
    return Object.assign({}, q, { options, correctIndex: options.indexOf(correctText) });
}

// Builds a fresh set of `count` questions for `sim`: every static bank
// question, plus enough freshly-generated apply-template instances
// (each invoked at a new random input) to comfortably clear `count`,
// then shuffled and trimmed. Never throws — a template that fails at a
// particular random state (e.g. a division edge case) is just skipped
// and retried at a different state.
function generateQuiz(sim, count) {
    count = count || 10;
    const bank = (typeof QUIZ_BANK !== 'undefined' && QUIZ_BANK[sim.id]) || { static: [], applyTemplates: [] };
    // Each pool entry keeps its RAW bilingual source (not a localized copy),
    // so the question can be re-rendered in the other language mid-quiz.
    const pool = (bank.static || []).map(q => ({ raw: q }));

    const templates = bank.applyTemplates || [];
    let guard = 0;
    while (pool.length < count + 2 && templates.length && guard < 60) {
        templates.forEach(tpl => {
            if (pool.length >= count + 4) return;
            try {
                let built = null;
                if (sim.mode === 'graphlab' && sim.graphLab) {
                    const state = quizRandomState(sim);
                    const result = sim.graphLab.model(state, { prev: state, base: state });
                    built = tpl.build(state, (result && result.metrics) || {});
                } else if (sim.mode === 'datalab' && sim.dataLab) {
                    // The same rows the table shows (Hindi names in Hindi mode).
                    const rows = typeof localDefaultRows === 'function' ? localDefaultRows(sim) : sim.dataLab.defaultRows;
                    const result = sim.dataLab.calculate(rows);
                    built = tpl.build(rows, (result && result.metrics) || {});
                } else if (typeof sim.compute === 'function') {
                    const state = quizRandomState(sim);
                    const result = sim.compute(state);
                    built = tpl.build(state, (result && result.metrics) || {});
                } else if (typeof sim.customRender === 'function') {
                    // e.g. macro-gdp's animated circular-flow diagram — no
                    // compute(), so run customRender against a throwaway,
                    // never-attached container purely to get its metrics.
                    const state = quizRandomState(sim);
                    const scratch = document.createElement('div');
                    const result = sim.customRender(scratch, state);
                    built = tpl.build(state, (result && result.metrics) || {});
                }
                if (built) pool.push({ raw: Object.assign({ level: tpl.level || 'apply' }, built) });
            } catch (e) {
                // Skip — this random state didn't produce a well-formed
                // question (e.g. a metric was undefined); try again.
            }
        });
        guard++;
    }

    // Fix each question's option order ONCE (as original indices), so a
    // re-render in another language shows the same options in the same places.
    const items = quizShuffle(pool).slice(0, count).map(it => Object.assign(it, {
        sim, order: quizShuffle((it.raw.options || []).map((_, i) => i))
    }));
    return items.map(quizView);
}

// One question, in the CURRENT language, with its options in the item's
// fixed order: { level, question, options, correctIndex, explain,
// syllabusId, misconceptions, item }. `item` is the raw source, for re-use.
function quizView(item) {
    const q = normalizeQuizQuestion(quizHindiLabels(item.sim, item.raw));
    const order = item.order && item.order.length === q.options.length ? item.order : q.options.map((_, i) => i);
    const options = order.map(i => q.options[i]);
    return Object.assign({}, q, { options, correctIndex: order.indexOf(q.correctIndex), item });
}

// ── The quiz machine ─────────────────────────────────────────────
//   closed ─OPEN→ asking ─ANSWER→ answered ─NEXT→ asking (more questions)
//                                          └FINISH→ results
//   any state ─CLOSE→ closed
// It used to be a boolean `answered` that every re-render reset — so a
// language toggle on an answered question let the student answer it again
// and score it twice. Now only ANSWER and NEXT move between the two, and a
// re-render (renderQuizQuestion) just redraws whatever state it finds.
const quizMachine = createMachine({
    id: 'quiz', initial: 'closed', reflect: 'quiz', context: quizState,
    describe: ctx => ({ simId: ctx.sim ? ctx.sim.id : null, index: ctx.index, total: ctx.items.length, score: ctx.score }),
    states: {
        closed: {
            on: { OPEN: { target: 'asking', action: (ctx, p) => Object.assign(ctx, { sim: p.sim, items: p.items, index: 0, score: 0, chosen: null }) } },
            enter: () => { const o = document.getElementById('quiz-overlay'); if (o) o.classList.add('hidden'); }
        },
        asking: {
            on: {
                ANSWER: {
                    target: 'answered',
                    guard: (ctx, p) => Number.isInteger(p && p.i) && p.i >= 0,
                    action: (ctx, p) => {
                        ctx.chosen = p.i;
                        if (p.i === quizView(ctx.items[ctx.index]).correctIndex) ctx.score++;
                    }
                },
                CLOSE: 'closed'
            }
        },
        answered: {
            on: {
                NEXT: { target: 'asking', guard: ctx => ctx.index < ctx.items.length - 1, action: ctx => { ctx.index++; ctx.chosen = null; } },
                FINISH: { target: 'results', guard: ctx => ctx.index >= ctx.items.length - 1 },
                CLOSE: 'closed'
            }
        },
        results: { on: { CLOSE: 'closed', OPEN: { target: 'asking', action: (ctx, p) => Object.assign(ctx, { sim: p.sim, items: p.items, index: 0, score: 0, chosen: null }) } } }
    }
});
// Keep the legacy derived fields true after every transition.
quizMachine.subscribe(state => { quizState.answered = state === 'answered' || state === 'results'; });

// Leaving the sim closes its quiz.
if (typeof onSimLeave === 'function') onSimLeave(() => closeQuiz());

function closeQuiz() { if (quizMachine.state !== 'closed') quizMachine.send('CLOSE'); }

function openQuiz(sim) {
    const overlay = document.getElementById('quiz-overlay');
    if (!overlay) return;
    const questions = generateQuiz(sim, 10);
    if (quizMachine.state !== 'closed') quizMachine.send('CLOSE');
    quizMachine.send('OPEN', { sim, items: questions.map(q => q.item) });

    const iconEl = document.getElementById('qm-icon');
    const moduleIcons = { micro: 'μ', macro: 'M', stats: 'σ', india: '🇮🇳' };
    if (iconEl) iconEl.textContent = moduleIcons[sim.module] || '📈';
    const headingEl = document.getElementById('qm-heading');
    if (headingEl) headingEl.textContent = (typeof simField === 'function' ? simField(sim, 'title') : sim.title);

    overlay.classList.remove('hidden');
    renderQuizQuestion();
}

// Draws whatever state the quiz machine is in, in the current language.
// Safe to call any time (a language toggle does): it never changes state.
function renderQuizQuestion() {
    const st = quizMachine.state;
    if (st === 'closed' || !quizState.items.length) return;
    const qArea = document.getElementById('quiz-question-area');
    const rArea = document.getElementById('quiz-result');
    if (st === 'results') {
        if (qArea) qArea.classList.add('hidden');
        if (rArea) rArea.classList.remove('hidden');
        showQuizResult();
        return;
    }
    if (qArea) qArea.classList.remove('hidden');
    if (rArea) rArea.classList.add('hidden');

    quizState.questions = quizState.items.map(quizView);
    const { questions, index } = quizState;
    const q = questions[index];

    const counterEl = document.getElementById('quiz-q-counter');
    if (counterEl) counterEl.textContent = `Q ${index + 1} / ${questions.length}`;
    const barEl = document.getElementById('quiz-pbar');
    if (barEl) barEl.style.width = `${Math.round((index / questions.length) * 100)}%`;

    const questionEl = document.getElementById('quiz-question');
    if (questionEl) {
        questionEl.textContent = '';
        const badge = document.createElement('span');
        badge.className = `quiz-bloom-badge quiz-bloom-${q.level}`;
        badge.textContent = bloomLabel(q.level);
        questionEl.appendChild(badge);
        questionEl.appendChild(document.createTextNode(q.question));
    }

    const optsEl = document.getElementById('quiz-options');
    if (optsEl) {
        optsEl.textContent = '';
        q.options.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'quiz-option-btn';
            btn.textContent = opt;
            btn.addEventListener('click', () => selectQuizAnswer(i));
            optsEl.appendChild(btn);
        });
    }

    const feedbackEl = document.getElementById('quiz-feedback');
    if (feedbackEl) { feedbackEl.classList.add('hidden'); feedbackEl.textContent = ''; }
    const nextBtn = document.getElementById('quiz-next-btn');
    if (st !== 'answered') {
        if (feedbackEl) { feedbackEl.classList.add('hidden'); feedbackEl.innerHTML = ''; }
        if (nextBtn) nextBtn.classList.add('hidden');
        return;
    }

    // answered: lock the options, mark them, explain — from the stored choice.
    const i = quizState.chosen;
    const correct = i === q.correctIndex;
    const btns = document.querySelectorAll('#quiz-options .quiz-option-btn');
    btns.forEach((b, bi) => {
        b.disabled = true;
        if (bi === q.correctIndex) b.classList.add('correct');
        else if (bi === i) b.classList.add('incorrect');
    });
    if (feedbackEl) {
        feedbackEl.classList.remove('hidden');
        feedbackEl.textContent = '';
        const statusB = document.createElement('b');
        const correctText = localize
            ? localize({ en: '✅ Correct!', hi: '✅ सही जवाब!' })
            : '✅ Correct!';
        const incorrectText = localize
            ? localize({ en: '❌ Not quite.', hi: '❌ यह सही नहीं है।' })
            : '❌ Not quite.';
        statusB.textContent = (correct ? correctText : incorrectText) + ' ';
        feedbackEl.appendChild(statusB);

        feedbackEl.appendChild(document.createTextNode(q.explain || ''));

        const correctText = quizLocalize({ en: '✅ Correct!', hi: '✅ सही जवाब!' });
        const incorrectText = quizLocalize({ en: '❌ Not quite.', hi: '❌ यह सही नहीं है।' });
        // A wrong option can carry its OWN targeted misconception text
        // (q.misconceptions, see normalizeQuizQuestion) — distinct from
        // `explain`'s general "here's the right answer" — naming exactly
        // why THIS specific wrong answer is a common mix-up, not just that
        // it's wrong. Shown only for the option the student actually
        // picked, in addition to (not instead of) the usual explanation.
        const misconception = !correct && q.misconceptions ? q.misconceptions[q.options[i]] : null;
        if (misconception) {
            const miscDiv = document.createElement('div');
            miscDiv.className = 'quiz-misconception';
            const labelText = localize ? localize({ en: 'Common mistake:', hi: 'सामान्य भूल:' }) : 'Common mistake:';
            miscDiv.textContent = `⚠️ ${labelText} ${misconception}`;
            feedbackEl.appendChild(miscDiv);
        }
        const misconceptionHTML = misconception
            ? `<div class="quiz-misconception">⚠️ ${quizLocalize({ en: 'Common mistake:', hi: 'सामान्य भूल:' })} ${misconception}</div>`
            : '';
        feedbackEl.innerHTML = `<b>${correct ? correctText : incorrectText}</b> ${q.explain}${misconceptionHTML}`;
    }
    if (nextBtn) {
        nextBtn.classList.remove('hidden');
        nextBtn.textContent = index < questions.length - 1
            ? quizLocalize({ en: 'Next Question →', hi: 'अगला प्रश्न →' })
            : quizLocalize({ en: 'See Results →', hi: 'परिणाम देखें →' });
    }
}

// A click on option i. Ignored unless the machine is asking (a second click,
// or a click after a re-render, cannot score the same question twice).
function selectQuizAnswer(i) {
    if (quizMachine.send('ANSWER', { i })) renderQuizQuestion();
}

function advanceQuiz() {
    if (quizMachine.send('NEXT') || quizMachine.send('FINISH')) renderQuizQuestion();
}

function showQuizResult() {
    const barEl = document.getElementById('quiz-pbar');
    if (barEl) barEl.style.width = '100%';
    document.getElementById('quiz-question-area').classList.add('hidden');
    const resultEl = document.getElementById('quiz-result');
    resultEl.classList.remove('hidden');

    const { score, questions } = quizState;
    const total = questions.length;
    const pct = total ? score / total : 0;

    document.getElementById('result-score').textContent = `${score} / ${total}`;
    const emojiEl = document.getElementById('result-emoji');
    const msgEl = document.getElementById('result-msg');
    let emoji, msg;
    if (pct >= 0.9) { emoji = '🏆'; msg = { en: 'Outstanding! You\'ve mastered this topic.', hi: 'शानदार! आपने यह विषय पूरी तरह समझ लिया है।' }; }
    else if (pct >= 0.7) { emoji = '🎉'; msg = { en: 'Great job — solid understanding!', hi: 'बहुत बढ़िया — अच्छी समझ है!' }; }
    else if (pct >= 0.5) { emoji = '👍'; msg = { en: 'Good effort — review the Concept card and try again.', hi: 'अच्छा प्रयास — Concept कार्ड दोबारा पढ़ें और फिर से कोशिश करें।' }; }
    else { emoji = '📘'; msg = { en: 'Keep practising — re-read the Concept and Formulas cards first.', hi: 'अभ्यास जारी रखें — पहले Concept और Formulas कार्ड दोबारा पढ़ें।' }; }
    if (emojiEl) emojiEl.textContent = emoji;
    if (msgEl) msgEl.textContent = quizLocalize(msg);
}
