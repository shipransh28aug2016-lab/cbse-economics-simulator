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

// Language toggle for the 🌐 nav button. js/i18n_engine.js does the
// actual translation work (window.i18nApply); this just persists the
// choice, flips the button label/doc lang, and hands off to it.
let currentLang = localStorage.getItem('econsim-lang') || 'en';

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
    } else {
        window.currentLang = lang;
    }
}

function toggleLanguage() {
    applyLanguage(currentLang === 'hi' ? 'en' : 'hi');
}

function openSim(simId) {
    const sim = typeof SIMS !== 'undefined' ? SIMS.find(s => s.id === simId) : null;
    if (sim) {
        showScreen('sim');
        const titleElIndex = document.getElementById('sim-title-nav');
        const titleElSys = document.getElementById('sim-title');

        if (titleElIndex) titleElIndex.innerText = sim.title;
        if (titleElSys) titleElSys.innerText = sim.title;

        const tagEl = document.getElementById('sim-module-tag');
        if (tagEl) {
            tagEl.innerText = sim.module.toUpperCase();
        }

        if (typeof renderSim === 'function') {
            renderSim(sim);
        }
    }
}

// ── Home sim-card text (title/desc), kept in sync with the active
//    language. Cards are built once in initApp(); refreshHomeCardsLang()
//    re-labels the same DOM nodes on every toggle (i18nApply calls it)
//    instead of rebuilding the grids, so click handlers survive.
function simCardHTML(sim) {
    const isHi = (typeof window.getLang === 'function') && window.getLang() === 'hi';
    const simHi = window.I18N_HI && window.I18N_HI.sims && window.I18N_HI.sims[sim.id];
    const title = (isHi && simHi && simHi.title) ? simHi.title : sim.title;
    const desc = (isHi && simHi && simHi.desc) ? simHi.desc : sim.desc;
    return `<h3>${title}</h3><p>${desc}</p>`;
}

function refreshHomeCardsLang() {
    document.querySelectorAll('.sim-card[data-sim-id]').forEach(card => {
        const sim = (typeof SIMS !== 'undefined') ? SIMS.find(s => s.id === card.dataset.simId) : null;
        if (sim) card.innerHTML = simCardHTML(sim);
    });
}
window.refreshHomeCardsLang = refreshHomeCardsLang;

// ── Collapsible sidebar panels (Concept / Key Formulas / Live
//    Readings / Adjust the Variables) — click a panel's chevron to
//    shrink it to just its header, freeing up viewing area. State is
//    remembered per panel (localStorage) so it survives switching
//    simulations and reloading the page.
function applyStoredPanelState(panel) {
    if (!panel || !panel.dataset.panelKey) return;
    let collapsed = false;
    try { collapsed = localStorage.getItem('econsim-panel-' + panel.dataset.panelKey) === '1'; } catch (e) { /* ignore */ }
    panel.classList.toggle('panel-collapsed', collapsed);
    const btn = panel.querySelector('.panel-collapse-btn');
    if (btn) btn.setAttribute('aria-expanded', String(!collapsed));
}
window.applyStoredPanelState = applyStoredPanelState;

function initCollapsiblePanels() {
    document.querySelectorAll('.info-card[data-panel-key]').forEach(applyStoredPanelState);

    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.panel-collapse-btn');
        if (!btn) return;
        const panel = btn.closest('.info-card, .controls-panel');
        if (!panel) return;
        const collapsed = panel.classList.toggle('panel-collapsed');
        btn.setAttribute('aria-expanded', String(!collapsed));
        if (panel.dataset.panelKey) {
            try { localStorage.setItem('econsim-panel-' + panel.dataset.panelKey, collapsed ? '1' : '0'); } catch (err) { /* ignore */ }
        }
    });

    document.getElementById('collapse-all-btn')?.addEventListener('click', () => {
        const panels = document.querySelectorAll('#screen-sim .info-card[data-panel-key], #screen-sim .controls-panel[data-panel-key]');
        const anyExpanded = Array.from(panels).some(p => !p.classList.contains('panel-collapsed'));
        panels.forEach(p => {
            p.classList.toggle('panel-collapsed', anyExpanded);
            const btn = p.querySelector('.panel-collapse-btn');
            if (btn) btn.setAttribute('aria-expanded', String(!anyExpanded));
            if (p.dataset.panelKey) {
                try { localStorage.setItem('econsim-panel-' + p.dataset.panelKey, anyExpanded ? '1' : '0'); } catch (err) { /* ignore */ }
            }
        });
    });
}

function initApp() {
    applyLanguage(currentLang);

    // Populate grids in index.html
    const grids = {
        'micro': document.getElementById('grid-micro'),
        'macro': document.getElementById('grid-macro'),
        'stats': document.getElementById('grid-stats'),
        'india': document.getElementById('grid-india'),
        'all': document.getElementById('sim-grid') // for system_test.html
    };

    if (typeof SIMS !== 'undefined') {
        SIMS.forEach(sim => {
            // Note: each grid needs its own card element with its own click
            // handler attached directly. cloneNode(true) does NOT copy
            // JS-assigned event handlers (like .onclick), so cards created
            // by cloning were previously unresponsive to clicks.
            if (grids[sim.module]) {
                const card = document.createElement('div');
                card.className = `sim-card sim-card--${sim.module}`;
                card.dataset.simId = sim.id;
                card.innerHTML = simCardHTML(sim);
                card.onclick = () => openSim(sim.id);
                grids[sim.module].appendChild(card);
            }
            if (grids['all']) {
                const sysCard = document.createElement('div');
                sysCard.className = `sim-card sim-card--${sim.module}`;
                sysCard.dataset.simId = sim.id;
                sysCard.innerHTML = simCardHTML(sim);
                sysCard.onclick = () => openSim(sim.id);
                grids['all'].appendChild(sysCard);
            }
        });
    }

    // Attach back button behaviors
    const backBtnIndex = document.getElementById('sim-back');
    if (backBtnIndex) {
        backBtnIndex.addEventListener('click', () => {
            showScreen('home');
        });
    }

    const backBtnSys = document.getElementById('back-btn');
    if (backBtnSys) {
        backBtnSys.addEventListener('click', () => {
            showScreen('home');
        });
    }

    initCollapsiblePanels();
    if (typeof window.initQuizEngine === 'function') window.initQuizEngine();
}

// Global hook
document.addEventListener('DOMContentLoaded', initApp);
