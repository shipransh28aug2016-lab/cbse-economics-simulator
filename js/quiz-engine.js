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

let quizState = { sim: null, questions: [], index: 0, score: 0, answered: false };

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
    return typeof localize === 'function' ? localize(val) : (val && val.en) || val || '';
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
    return finalValues.map(v => `${prefix}${fmtNum(v)}${suffix}`);
}

// Resolves a raw bank entry (English/Hindi option objects, etc.) to a
// plain-string question ready to render in the current language.
function normalizeQuizQuestion(q) {
    return {
        level: q.level || 'understand',
        question: quizLocalize(q.question),
        options: (q.options || []).map(quizLocalize),
        correctIndex: q.correctIndex,
        explain: quizLocalize(q.explain),
        syllabusId: q.syllabusId || null
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
    const pool = (bank.static || []).map(q => normalizeQuizQuestion(q));

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
                    const rows = sim.dataLab.defaultRows;
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
                if (built) pool.push(normalizeQuizQuestion(Object.assign({ level: tpl.level || 'apply' }, built)));
            } catch (e) {
                // Skip — this random state didn't produce a well-formed
                // question (e.g. a metric was undefined); try again.
            }
        });
        guard++;
    }

    const shuffledPool = quizShuffle(pool).map(shuffleQuizOptions);
    return shuffledPool.slice(0, count);
}

function openQuiz(sim) {
    const overlay = document.getElementById('quiz-overlay');
    if (!overlay) return;
    const questions = generateQuiz(sim, 10);
    quizState = { sim, questions, index: 0, score: 0, answered: false };

    const iconEl = document.getElementById('qm-icon');
    const moduleIcons = { micro: 'μ', macro: 'M', stats: 'σ', india: '🇮🇳' };
    if (iconEl) iconEl.textContent = moduleIcons[sim.module] || '📈';
    const headingEl = document.getElementById('qm-heading');
    if (headingEl) headingEl.textContent = (typeof simField === 'function' ? simField(sim, 'title') : sim.title);

    document.getElementById('quiz-result').classList.add('hidden');
    document.getElementById('quiz-question-area').classList.remove('hidden');
    overlay.classList.remove('hidden');
    renderQuizQuestion();
}

function renderQuizQuestion() {
    const { questions, index } = quizState;
    if (!questions.length) return;
    const q = questions[index];

    const counterEl = document.getElementById('quiz-q-counter');
    if (counterEl) counterEl.textContent = `Q ${index + 1} / ${questions.length}`;
    const barEl = document.getElementById('quiz-pbar');
    if (barEl) barEl.style.width = `${Math.round((index / questions.length) * 100)}%`;

    const questionEl = document.getElementById('quiz-question');
    if (questionEl) {
        questionEl.innerHTML = `<span class="quiz-bloom-badge quiz-bloom-${q.level}">${bloomLabel(q.level)}</span>${q.question}`;
    }

    const optsEl = document.getElementById('quiz-options');
    if (optsEl) {
        optsEl.innerHTML = '';
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
    if (feedbackEl) { feedbackEl.classList.add('hidden'); feedbackEl.innerHTML = ''; }
    const nextBtn = document.getElementById('quiz-next-btn');
    if (nextBtn) nextBtn.classList.add('hidden');
    quizState.answered = false;
}

function selectQuizAnswer(i) {
    if (quizState.answered) return;
    quizState.answered = true;
    const q = quizState.questions[quizState.index];
    const correct = i === q.correctIndex;
    if (correct) quizState.score++;

    const btns = document.querySelectorAll('#quiz-options .quiz-option-btn');
    btns.forEach((b, bi) => {
        b.disabled = true;
        if (bi === q.correctIndex) b.classList.add('correct');
        else if (bi === i) b.classList.add('incorrect');
    });

    const feedbackEl = document.getElementById('quiz-feedback');
    if (feedbackEl) {
        feedbackEl.classList.remove('hidden');
        const correctText = localize
            ? localize({ en: '✅ Correct!', hi: '✅ सही जवाब!' })
            : '✅ Correct!';
        const incorrectText = localize
            ? localize({ en: '❌ Not quite.', hi: '❌ यह सही नहीं है।' })
            : '❌ Not quite.';
        feedbackEl.innerHTML = `<b>${correct ? correctText : incorrectText}</b> ${q.explain}`;
    }
    const nextBtn = document.getElementById('quiz-next-btn');
    if (nextBtn) {
        nextBtn.classList.remove('hidden');
        nextBtn.textContent = quizState.index < quizState.questions.length - 1
            ? quizLocalize({ en: 'Next Question →', hi: 'अगला प्रश्न →' })
            : quizLocalize({ en: 'See Results →', hi: 'परिणाम देखें →' });
    }
}

function advanceQuiz() {
    if (!quizState.answered) return;
    if (quizState.index < quizState.questions.length - 1) {
        quizState.index++;
        renderQuizQuestion();
    } else {
        showQuizResult();
    }
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
