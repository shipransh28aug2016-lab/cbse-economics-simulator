// Polyfill / utility to safely toggle screens based on id
function showScreen(screenId) {
    const screens = document.querySelectorAll('.screen, .view');
    screens.forEach(s => {
        s.classList.remove('active');
        s.classList.add('hidden');
    });

    // Check for both screen- prefix and -view suffix to support index.html and system_test.html
    const targetScreen = document.getElementById(`screen-${screenId}`) || document.getElementById(`${screenId}-view`);
    if (targetScreen) {
        targetScreen.classList.add('active');
        targetScreen.classList.remove('hidden');
    }
}

// Language toggle for the 🌐 nav button, backed by a real i18n engine
// (js/i18n_engine.js) and dictionary (js/i18n_hi.js) — see CLAUDE.md.
let currentLang = localStorage.getItem('econsim-lang') || 'en';

// The sim currently open on the Simulation screen (null on the home/
// profile screens). Needed so the Quiz button and a language-toggle
// re-render both know what to act on without re-deriving it from the DOM.
let currentSim = null;

// Resolves a value that may be a plain string (English-only, never
// translated) or a `{en, hi}` pair (see js/i18n_hi.js) to the text for
// the current language, falling back to English — so a missing Hindi
// entry degrades to readable English instead of blank/undefined text.
function localize(val, fallback) {
    if (val === undefined || val === null) return fallback !== undefined ? fallback : '';
    if (typeof val === 'string') return val;
    if (typeof val === 'object') {
        if (currentLang === 'hi' && val.hi) return val.hi;
        return val.en !== undefined ? val.en : (fallback !== undefined ? fallback : '');
    }
    return String(val);
}

// Resolves one field of a sim (title/desc/concept/...) to the current
// language via that sim's optional `hi` companion object (see
// js/i18n_hi.js's SIM_I18N_HI, merged onto SIMS by mergeSimTranslations()
// in js/i18n_engine.js). Falls back to the sim's own (English) field.
function simField(sim, field) {
    if (!sim) return '';
    if (currentLang === 'hi' && sim.hi && sim.hi[field] !== undefined) return sim.hi[field];
    return sim[field];
}

function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('econsim-lang', lang);
    document.documentElement.lang = lang === 'hi' ? 'hi' : 'en';

    const btn = document.getElementById('lang-toggle');
    if (btn) {
        btn.textContent = lang === 'hi' ? '🌐 English' : '🌐 हिन्दी';
    }

    if (typeof window.i18nApply === 'function') {
        window.i18nApply(lang);
    }

    // The two "Collapse All" master-switch buttons compute their own
    // label from current state (see js/panel-collapse.js's
    // wireCollapseAllToggle) rather than static markup, so translateStaticUI()
    // above can't reach them — re-derive their label directly here instead
    // of waiting for the next click inside their panel group.
    document.querySelectorAll('.panel-toolbar-btn').forEach(btn => {
        if (typeof btn._refreshCollapseLabel === 'function') btn._refreshCollapseLabel();
    });

    // Re-render whatever's currently on screen so labels switch live,
    // with no reload and no lost slider/table/quiz state beyond what a
    // normal re-render already resets.
    if (typeof rebuildHomeGrids === 'function') rebuildHomeGrids();
    if (currentSim && typeof renderSim === 'function') {
        openSim(currentSim.id); // re-runs the title/tag/renderSim wiring below
    }
    const quizOverlay = document.getElementById('quiz-overlay');
    if (typeof quizState !== 'undefined' && quizState && quizState.sim && quizOverlay && !quizOverlay.classList.contains('hidden')) {
        if (typeof renderQuizQuestion === 'function') renderQuizQuestion();
    }
}

function toggleLanguage() {
    applyLanguage(currentLang === 'hi' ? 'en' : 'hi');
}

function openSim(simId) {
    const sim = typeof SIMS !== 'undefined' ? SIMS.find(s => s.id === simId) : null;
    if (sim) {
        currentSim = sim;
        showScreen('sim');
        const titleElIndex = document.getElementById('sim-title-nav');
        const titleElSys = document.getElementById('sim-title');
        const title = simField(sim, 'title');

        if (titleElIndex) titleElIndex.innerText = title;
        if (titleElSys) titleElSys.innerText = title;

        const tagEl = document.getElementById('sim-module-tag');
        if (tagEl) {
            tagEl.innerText = sim.module.toUpperCase();
        }

        if (typeof renderSim === 'function') {
            renderSim(sim);
        }
    }
}

// Populates (or, on a language switch, re-populates) the home-screen
// module grids from SIMS. Split out from initApp() so applyLanguage()
// can call it again to swap every card's title/description without a
// full page reload.
function rebuildHomeGrids() {
    const grids = {
        'micro': document.getElementById('grid-micro'),
        'macro': document.getElementById('grid-macro'),
        'stats': document.getElementById('grid-stats'),
        'india': document.getElementById('grid-india'),
        'all': document.getElementById('sim-grid') // for system_test.html
    };

    Object.values(grids).forEach(g => { if (g) g.innerHTML = ''; });

    if (typeof SIMS !== 'undefined') {
        SIMS.forEach(sim => {
            const title = simField(sim, 'title');
            const desc = simField(sim, 'desc');
            // Surfaced on the Home grid too, not just inside the sim screen
            // (sim-engine.js's enrichment-tag) — a student/teacher browsing
            // cards should see "this goes beyond the named 2026-27 topic"
            // BEFORE opening it, not discover it only after clicking in.
            const badge = sim.enrichment
                ? `<span class="sim-card-badge" title="${tEngine('engine.enrichmentTag', '✨ Enrichment — beyond the 2026–27 unit list for this topic')}">✨</span>`
                : '';
            // Note: each grid needs its own card element with its own click
            // handler attached directly. cloneNode(true) does NOT copy
            // JS-assigned event handlers (like .onclick), so cards created
            // by cloning were previously unresponsive to clicks.
            if (grids[sim.module]) {
                const card = document.createElement('div');
                card.className = `sim-card sim-card--${sim.module}`;
                card.innerHTML = `${badge}<h3>${title}</h3><p>${desc}</p>`;
                card.onclick = () => openSim(sim.id);
                grids[sim.module].appendChild(card);
            }
            if (grids['all']) {
                const sysCard = document.createElement('div');
                sysCard.className = `sim-card sim-card--${sim.module}`;
                sysCard.innerHTML = `${badge}<h3>${title}</h3><p>${desc}</p>`;
                sysCard.onclick = () => openSim(sim.id);
                grids['all'].appendChild(sysCard);
            }
        });
    }
}

// Wires the Quiz modal: launching it for the currently open sim,
// closing it (✕ button, backdrop click, or the result screen's
// Continue button), answering a question, and stepping to the next
// one. See js/quiz-engine.js for question generation/scoring.
function wireQuizModal() {
    const launchBtn = document.getElementById('quiz-launch-btn');
    if (launchBtn) launchBtn.addEventListener('click', () => {
        if (currentSim && typeof openQuiz === 'function') openQuiz(currentSim);
    });

    const closeBtn = document.getElementById('quiz-close-btn');
    const overlay = document.getElementById('quiz-overlay');
    const closeQuiz = () => { if (overlay) overlay.classList.add('hidden'); };
    if (closeBtn) closeBtn.addEventListener('click', closeQuiz);
    if (overlay) overlay.addEventListener('click', (e) => { if (e.target === overlay) closeQuiz(); });

    const continueBtn = document.getElementById('result-continue-btn');
    if (continueBtn) continueBtn.addEventListener('click', closeQuiz);

    const nextBtn = document.getElementById('quiz-next-btn');
    if (nextBtn) nextBtn.addEventListener('click', () => {
        if (typeof advanceQuiz === 'function') advanceQuiz();
    });
}

// Animates each hero-stats-strip number counting up from 0 to its real,
// static value once on load — a genuine value already in the markup,
// not fabricated data, so this is purely a motion touch. Respects
// prefers-reduced-motion by snapping straight to the final value.
function animateHeroStats() {
    const nums = document.querySelectorAll('.hero-stats-strip b');
    if (!nums.length) return;
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    nums.forEach(el => {
        const text = el.textContent.trim();
        const target = parseInt(text, 10);
        const suffix = text.replace(/^[0-9]+/, ''); // e.g. "72+" -> "+"
        if (isNaN(target) || reduceMotion) return;
        const duration = 900;
        const start = performance.now();
        function tick(now) {
            const p = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased) + (p >= 1 ? suffix : '');
            if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    });
}

function initApp() {
    applyLanguage(currentLang); // builds the home grids (via rebuildHomeGrids) in the active language
    wireQuizModal();
    animateHeroStats();

    // Every module block (home) and info card (sim screen) is
    // collapsible — wire up the click/keyboard toggles and the two
    // "Collapse All" master switches once, here, since these headers
    // are static markup present from page load (see js/panel-collapse.js).
    if (typeof initStaticPanelCollapse === 'function') initStaticPanelCollapse();
    if (typeof wireCollapseAllToggle === 'function') {
        wireCollapseAllToggle(document.getElementById('home-collapse-toggle'), '.module-block');
        wireCollapseAllToggle(document.getElementById('sim-collapse-toggle'), '.sim-right .info-card:not(.hidden)');
    }

    // Attach back button behaviors
    const backBtnIndex = document.getElementById('sim-back');
    if (backBtnIndex) {
        backBtnIndex.addEventListener('click', () => {
            currentSim = null;
            showScreen('home');
        });
    }

    const backBtnSys = document.getElementById('back-btn');
    if (backBtnSys) {
        backBtnSys.addEventListener('click', () => {
            showScreen('home');
        });
    }
}

// Global hook
document.addEventListener('DOMContentLoaded', initApp);
