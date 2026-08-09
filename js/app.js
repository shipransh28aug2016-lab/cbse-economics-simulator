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

// Language toggle for the 🌐 nav button. Full sentence-level translation
// depends on the i18n engine/data files (js/i18n_engine.js, js/i18n_hi.js),
// which currently ship as stubs. This keeps the toggle functional (no
// crash) and updates the parts of the UI that don't need a translation
// dictionary: the button label itself and the document's language tag.
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
        // Hook for a fuller i18n engine, if/when one is implemented.
        window.i18nApply(lang);
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
                card.className = 'sim-card';
                card.innerHTML = `<h3>${sim.title}</h3><p>${sim.desc}</p>`;
                card.onclick = () => openSim(sim.id);
                grids[sim.module].appendChild(card);
            }
            if (grids['all']) {
                const sysCard = document.createElement('div');
                sysCard.className = 'sim-card';
                sysCard.innerHTML = `<h3>${sim.title}</h3><p>${sim.desc}</p>`;
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
}

// Global hook
document.addEventListener('DOMContentLoaded', initApp);
