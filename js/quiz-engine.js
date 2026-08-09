// ══════════════════════════════════════════════════════════════
// Quiz engine — drives the #quiz-overlay modal (already in
// index.html) using question sets from js/quiz-data.js
// (window.QUIZ_BANK). Two entry points:
//   1. Per-simulation "🎯 Take the Quiz" button in the sim screen.
//   2. The dedicated Quiz Center screen (screen-quiz): a quiz per
//      simulation, grouped by module, plus a shuffled "Full
//      Syllabus Review" pulling from the entire question bank.
// Bilingual: reads window.getLang() so every question, option and
// piece of quiz chrome follows the active language toggle.
// ══════════════════════════════════════════════════════════════

const MODULE_ICONS = { micro: 'μ', macro: 'M', stats: 'σ', india: '🇮🇳' };
const MODULE_LABEL_KEYS = {
    micro: 'module.micro.title', macro: 'module.macro.title',
    stats: 'module.stats.title', india: 'module.india.title'
};

let quizState = { questions: [], index: 0, score: 0, meta: {} };

function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function lang() {
    return (typeof window.getLang === 'function') ? window.getLang() : 'en';
}

function tr(key, fallback) {
    return (typeof window.t === 'function') ? window.t(key, null, fallback) : fallback;
}

// Opens the quiz modal with a given list of question objects
// (each shaped like the entries in js/quiz-data.js) and modal
// chrome metadata: { icon, heading, headingHi }.
function startQuiz(questions, meta) {
    if (!questions || !questions.length) return;
    quizState = { questions, index: 0, score: 0, meta: meta || {} };
    const overlay = document.getElementById('quiz-overlay');
    if (!overlay) return;
    overlay.classList.remove('hidden');
    document.getElementById('quiz-result')?.classList.add('hidden');
    document.getElementById('quiz-question')?.classList.remove('hidden');
    document.getElementById('quiz-options')?.classList.remove('hidden');
    document.getElementById('quiz-q-counter')?.classList.remove('hidden');
    document.querySelector('.quiz-progress-bar-outer')?.classList.remove('hidden');
    renderQuizQuestion();
}

function closeQuiz() {
    document.getElementById('quiz-overlay')?.classList.add('hidden');
}

function renderQuizQuestion() {
    const q = quizState.questions[quizState.index];
    const total = quizState.questions.length;
    const isHi = lang() === 'hi';

    const iconEl = document.getElementById('qm-icon');
    const headingEl = document.getElementById('qm-heading');
    if (iconEl) iconEl.textContent = quizState.meta.icon || '📈';
    if (headingEl) headingEl.textContent = (isHi && quizState.meta.headingHi) ? quizState.meta.headingHi : (quizState.meta.heading || tr('quiz.defaultHeading', 'Quick Quiz'));

    const pbar = document.getElementById('quiz-pbar');
    if (pbar) pbar.style.width = `${(quizState.index / total) * 100}%`;

    const counter = document.getElementById('quiz-q-counter');
    if (counter) counter.textContent = isHi ? `प्रश्न ${quizState.index + 1} / ${total}` : `Q ${quizState.index + 1} of ${total}`;

    const questionEl = document.getElementById('quiz-question');
    if (questionEl) questionEl.textContent = (isHi && q.qHi) ? q.qHi : q.q;

    const optionsEl = document.getElementById('quiz-options');
    if (optionsEl) {
        optionsEl.innerHTML = '';
        const opts = (isHi && q.optionsHi) ? q.optionsHi : q.options;
        opts.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'quiz-option';
            btn.textContent = opt;
            btn.addEventListener('click', () => selectAnswer(i));
            optionsEl.appendChild(btn);
        });
    }

    const feedback = document.getElementById('quiz-feedback');
    if (feedback) {
        feedback.classList.add('hidden');
        feedback.innerHTML = '';
    }
}

function selectAnswer(i) {
    const q = quizState.questions[quizState.index];
    const isHi = lang() === 'hi';
    const optionsEl = document.getElementById('quiz-options');
    if (!optionsEl || optionsEl.dataset.answered === '1') return;
    optionsEl.dataset.answered = '1';

    const buttons = Array.from(optionsEl.querySelectorAll('.quiz-option'));
    buttons.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === q.correct) btn.classList.add('correct');
        else if (idx === i) btn.classList.add('incorrect');
    });

    const correct = i === q.correct;
    if (correct) quizState.score++;

    const isLast = quizState.index === quizState.questions.length - 1;
    const nextLabel = isLast
        ? (isHi ? 'परिणाम देखें →' : 'See Results →')
        : (isHi ? 'अगला प्रश्न →' : 'Next Question →');
    const explainText = (isHi && q.explainHi) ? q.explainHi : q.explain;
    const feedbackHeadline = correct
        ? (isHi ? '✅ सही उत्तर!' : '✅ Correct!')
        : (isHi ? '❌ सही उत्तर नहीं' : '❌ Not quite');

    const feedback = document.getElementById('quiz-feedback');
    if (feedback) {
        feedback.classList.remove('hidden');
        feedback.innerHTML = `
            <div><b>${feedbackHeadline}</b></div>
            <div class="quiz-explanation">${explainText || ''}</div>
            <button type="button" class="quiz-next-btn" id="quiz-next-btn">${nextLabel}</button>
        `;
        document.getElementById('quiz-next-btn')?.addEventListener('click', () => {
            if (optionsEl) optionsEl.dataset.answered = '0';
            quizState.index++;
            if (quizState.index < quizState.questions.length) {
                renderQuizQuestion();
            } else {
                showQuizResult();
            }
        });
    }
}

function showQuizResult() {
    const isHi = lang() === 'hi';
    const total = quizState.questions.length;
    const score = quizState.score;
    const pct = total ? (score / total) * 100 : 0;

    document.getElementById('quiz-question')?.classList.add('hidden');
    document.getElementById('quiz-options')?.classList.add('hidden');
    document.getElementById('quiz-feedback')?.classList.add('hidden');
    document.getElementById('quiz-q-counter')?.classList.add('hidden');
    document.querySelector('.quiz-progress-bar-outer')?.classList.add('hidden');

    const pbar = document.getElementById('quiz-pbar');
    if (pbar) pbar.style.width = '100%';

    let emoji, msgEn, msgHi;
    if (pct >= 90) { emoji = '🏆'; msgEn = 'Outstanding! You know this cold.'; msgHi = 'शानदार! आपने इसे पूरी तरह समझ लिया है।'; }
    else if (pct >= 70) { emoji = '🎉'; msgEn = 'Great job — solid understanding!'; msgHi = 'बहुत बढ़िया — ठोस समझ है!'; }
    else if (pct >= 50) { emoji = '💪'; msgEn = 'Good effort — revisit the concept and try again.'; msgHi = 'अच्छा प्रयास — अवधारणा दोबारा पढ़ें और फिर प्रयास करें।'; }
    else { emoji = '📚'; msgEn = "Keep practicing — re-read the Concept panel and try again."; msgHi = 'अभ्यास जारी रखें — Concept पैनल दोबारा पढ़ें और फिर प्रयास करें।'; }

    const resultEl = document.getElementById('quiz-result');
    resultEl?.classList.remove('hidden');
    const emojiEl = document.getElementById('result-emoji');
    if (emojiEl) emojiEl.textContent = emoji;
    const scoreEl = document.getElementById('result-score');
    if (scoreEl) scoreEl.textContent = isHi ? `${score} / ${total} सही` : `${score} / ${total}`;
    const msgEl = document.getElementById('result-msg');
    if (msgEl) msgEl.textContent = isHi ? msgHi : msgEn;
}

// ── Quiz Center screen (grouped per-module quiz picker + a
//    shuffled full-syllabus review of >=10 questions) ───────────
function buildQuizCenter() {
    const wrap = document.getElementById('quiz-module-blocks');
    if (!wrap || typeof SIMS === 'undefined' || !window.QUIZ_BANK) return;
    wrap.innerHTML = '';
    const isHi = lang() === 'hi';
    const moduleOrder = ['micro', 'macro', 'stats', 'india'];

    moduleOrder.forEach(modKey => {
        const simsInModule = SIMS.filter(s => s.module === modKey);
        if (!simsInModule.length) return;

        const block = document.createElement('div');
        block.className = 'quiz-module-block';

        const heading = document.createElement('div');
        heading.className = 'quiz-module-heading';
        const modLabel = tr(MODULE_LABEL_KEYS[modKey], modKey);
        heading.innerHTML = `<span>${MODULE_ICONS[modKey] || ''}</span><span>${modLabel}</span>`;
        block.appendChild(heading);

        const grid = document.createElement('div');
        grid.className = 'quiz-card-grid';

        simsInModule.forEach(sim => {
            const bank = window.QUIZ_BANK[sim.id];
            if (!bank) return;
            const title = (isHi && bank.titleHi) ? bank.titleHi : bank.title;
            const simHi = window.I18N_HI && window.I18N_HI.sims && window.I18N_HI.sims[sim.id];
            const desc = (isHi && simHi && simHi.desc) ? simHi.desc : sim.desc;
            const qLabel = isHi ? `${bank.questions.length} प्रश्न` : `${bank.questions.length} Questions`;

            const card = document.createElement('div');
            card.className = 'quiz-pick-card';
            card.setAttribute('role', 'button');
            card.tabIndex = 0;
            card.innerHTML = `<h4>${title}</h4><p>${desc}</p><span class="quiz-pick-count">${qLabel}</span>`;
            const launch = () => startQuiz(bank.questions, { icon: MODULE_ICONS[modKey], heading: bank.title, headingHi: bank.titleHi });
            card.addEventListener('click', launch);
            card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); launch(); } });
            grid.appendChild(card);
        });

        block.appendChild(grid);
        wrap.appendChild(block);
    });
}

function launchFullReviewQuiz() {
    if (!window.QUIZ_BANK) return;
    const all = [];
    Object.keys(window.QUIZ_BANK).forEach(id => {
        window.QUIZ_BANK[id].questions.forEach(q => all.push(q));
    });
    const picked = shuffleArray(all).slice(0, Math.min(20, all.length));
    startQuiz(picked, {
        icon: '🎲',
        heading: 'Full Syllabus Review',
        headingHi: 'पूर्ण पाठ्यक्रम समीक्षा'
    });
}

function initQuizEngine() {
    document.getElementById('quiz-close-btn')?.addEventListener('click', closeQuiz);
    document.getElementById('result-continue-btn')?.addEventListener('click', closeQuiz);
    document.getElementById('quiz-overlay')?.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'quiz-overlay') closeQuiz();
    });

    document.getElementById('quiz-launch-btn')?.addEventListener('click', () => {
        const sim = window.currentSim;
        if (!sim || !window.QUIZ_BANK) return;
        const bank = window.QUIZ_BANK[sim.id];
        if (!bank) return;
        startQuiz(bank.questions, { icon: MODULE_ICONS[sim.module] || '📈', heading: bank.title, headingHi: bank.titleHi });
    });

    document.getElementById('full-review-quiz-btn')?.addEventListener('click', launchFullReviewQuiz);

    buildQuizCenter();
}

window.startQuiz = startQuiz;
window.buildQuizCenter = buildQuizCenter;
window.initQuizEngine = initQuizEngine;
