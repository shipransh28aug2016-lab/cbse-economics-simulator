// ══════════════════════════════════════════════════════════════
// i18n engine — applies window.I18N_HI (js/i18n_hi.js) to the page.
// Called by applyLanguage()/toggleLanguage() in js/app.js whenever
// the 🌐 nav button is used (and once on load, from the saved
// preference). Exposes small helpers other scripts rely on:
//   window.getLang()              → 'en' | 'hi'
//   window.t(key, vars, fallback) → translated UI-chrome string
//   window.translatePhrases(html) → runs the readings/formula
//                                    phrase dictionary over a string
// ══════════════════════════════════════════════════════════════

window.getLang = function () {
    return window.currentLang === 'hi' ? 'hi' : 'en';
};

// Generic UI-chrome lookup used by JS-generated strings (quiz
// engine, sim-engine control panel, home card rendering…). `vars`
// substitutes {token} placeholders; `fallback` is the English text
// to use when not in Hindi mode (or when no Hindi entry exists).
window.t = function (key, vars, fallback) {
    const isHi = window.getLang() === 'hi';
    const dict = (window.I18N_HI && window.I18N_HI.ui) || {};
    let str;
    if (isHi && Object.prototype.hasOwnProperty.call(dict, key)) {
        str = dict[key];
    } else if (fallback !== undefined) {
        str = fallback;
    } else if (Object.prototype.hasOwnProperty.call(dict, key)) {
        str = dict[key];
    } else {
        str = key;
    }
    if (vars) {
        str = str.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? String(vars[k]) : ''));
    }
    return str;
};

// Cache a longest-first-sorted key list so every readings/formula
// re-render (which can fire many times a second while dragging a
// slider) doesn't re-sort the whole phrase dictionary each time.
let _phraseKeysSorted = null;
function phraseKeys() {
    if (_phraseKeysSorted) return _phraseKeysSorted;
    const dict = (window.I18N_HI && window.I18N_HI.phrases) || {};
    _phraseKeysSorted = Object.keys(dict).sort((a, b) => b.length - a.length);
    return _phraseKeysSorted;
}

function escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Runs the EN→HI phrase dictionary over a chunk of already-rendered
// HTML (Live Readings, or a dynamically mode-specific formula
// string) — a longest-match-first plain substring replace, so full
// sentences/labels translate before their shorter constituent words
// get a turn (see js/i18n_hi.js header comment for why order
// matters). No-ops entirely outside Hindi mode.
window.translatePhrases = function (html) {
    if (window.getLang() !== 'hi' || !html) return html;
    const dict = window.I18N_HI.phrases;
    let out = html;
    phraseKeys().forEach(key => {
        if (out.indexOf(key) === -1) return;
        out = out.replace(new RegExp(escapeRegExp(key), 'g'), dict[key]);
    });
    return out;
};

// Applies data-i18n[-html|-title|-aria-label] attributes across the
// whole document, then re-renders every language-dependent dynamic
// area (home sim cards, Quiz Center, and — if a sim screen is open
// — that sim's concept/formulas/controls/chart) without disturbing
// any slider state the student has already set.
window.i18nApply = function (lang) {
    window.currentLang = lang === 'hi' ? 'hi' : 'en';
    const isHi = window.currentLang === 'hi';
    const dict = (window.I18N_HI && window.I18N_HI.ui) || {};

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (el.dataset.i18nOrig === undefined) el.dataset.i18nOrig = el.textContent;
        el.textContent = (isHi && dict[key] !== undefined) ? dict[key] : el.dataset.i18nOrig;
    });

    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        if (el.dataset.i18nOrigHtml === undefined) el.dataset.i18nOrigHtml = el.innerHTML;
        el.innerHTML = (isHi && dict[key] !== undefined) ? dict[key] : el.dataset.i18nOrigHtml;
    });

    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        if (el.dataset.i18nOrigTitle === undefined) el.dataset.i18nOrigTitle = el.getAttribute('title') || '';
        el.setAttribute('title', (isHi && dict[key] !== undefined) ? dict[key] : el.dataset.i18nOrigTitle);
    });

    document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
        const key = el.getAttribute('data-i18n-aria-label');
        if (el.dataset.i18nOrigAria === undefined) el.dataset.i18nOrigAria = el.getAttribute('aria-label') || '';
        el.setAttribute('aria-label', (isHi && dict[key] !== undefined) ? dict[key] : el.dataset.i18nOrigAria);
    });

    if (typeof window.refreshHomeCardsLang === 'function') window.refreshHomeCardsLang();
    if (typeof window.buildQuizCenter === 'function') window.buildQuizCenter();
    if (window.currentSim && typeof window.translateSimStaticText === 'function') {
        window.translateSimStaticText(window.currentSim);
    }
};
