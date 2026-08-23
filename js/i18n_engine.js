// Real Hindi i18n engine (replaces the earlier stub). Declares the two
// shared dictionaries this project's Hindi support is built from, plus the
// functions that apply them. See CLAUDE.md's i18n section and js/app.js's
// applyLanguage()/localize()/simField() for how this plugs in.
//
// - I18N_HI: static app-chrome text (nav, screen titles, section headers,
//   buttons, footers, profile-screen labels, quiz-modal chrome not already
//   covered by quizLocalize's {en,hi} objects) — a flat { key: 'Hindi text' }
//   map, English being whatever's already written into index.html.
// - SIM_I18N_HI: per-sim CONTENT translations, populated by js/i18n_hi.js
//   (and any further js/i18n_hi-*.js split files, following the same
//   load-after-the-container-exists convention as js/quiz-engine.js's
//   QUIZ_BANK / js/quiz-data*.js) — keyed by sim.id, each entry an object of
//   whichever fields that sim has translated (title/desc/concept/formulas/
//   controls/practice/challenge/dataLab/explorer/...).
//
// Neither dictionary needs to exist before this file's functions are
// CALLED (only before they run) — js/app.js only invokes them from
// applyLanguage(), itself only called after every <script> tag, including
// every simulations_*.js and quiz-data*.js file, has already executed.
if (typeof I18N_HI === 'undefined') {
    var I18N_HI = {
        'nav.profileTitle': 'मेरी प्रोफ़ाइल',

        'hero.badge': '🎓 सीबीएसई XI–XII',
        'hero.title': 'अर्थशास्त्र <span class="grad-text">आपके हाथों में जीवंत</span> हो उठता है',
        'hero.statsTitle': '34 सिमुलेशन, डेटा लैब और एक्सप्लोरर · कक्षा XI और XII · 4 भाग · 72+ प्रश्नोत्तरी प्रश्न',
        'hero.labs': 'लैब्स',
        'hero.classes': 'कक्षाएँ',
        'hero.parts': 'भाग',
        'hero.quizQs': 'प्रश्नोत्तरी प्रश्न',

        'class.xi.title': 'कक्षा XI <span class="class-title-sub">— विषय कोड 030</span>',
        'class.xi.parts': 'भाग A: अर्थशास्त्र हेतु सांख्यिकी · भाग B: प्रारंभिक सूक्ष्मअर्थशास्त्र',
        'class.xii.title': 'कक्षा XII <span class="class-title-sub">— विषय कोड 030</span>',
        'class.xii.parts': 'भाग A: प्रारंभिक स्थूलअर्थशास्त्र · भाग B: भारतीय आर्थिक विकास',

        'module.stats.title': 'अर्थशास्त्र के लिए सांख्यिकी',
        'module.stats.sub': 'कक्षा XI · भाग A · इकाई 1–3 · 7 लैब्स',
        'module.micro.title': 'प्रारंभिक सूक्ष्मअर्थशास्त्र',
        'module.micro.sub': 'कक्षा XI · भाग B · इकाई 4–7 · 11 लैब्स',
        'module.macro.title': 'प्रारंभिक स्थूलअर्थशास्त्र',
        'module.macro.sub': 'कक्षा XII · भाग A · इकाई 1–5 · 9 लैब्स',
        'module.india.title': 'भारतीय आर्थिक विकास',
        'module.india.sub': 'कक्षा XII · भाग B · इकाई 6–8 · 7 लैब्स',

        'achievements.title': '🏆 हाल की उपलब्धियाँ',
        'achievements.emptyHint': 'बैज अर्जित करने के लिए अपना पहला सिमुलेशन पूरा करें!',

        'common.back': '← वापस',

        'card.concept': '📚 अवधारणा',
        'card.formulas': '📐 प्रमुख सूत्र',
        'card.readings': '📊 लाइव रीडिंग्स',
        'card.practice': '🧩 निर्देशित अभ्यास',
        'card.challenge': '🎯 चुनौती',
        'sim.takeQuiz': '🎯 प्रश्नोत्तरी लें  →',

        'profile.title': 'मेरी प्रोफ़ाइल',
        'profile.nameDefault': 'अर्थशास्त्री',
        'profile.levelText': 'स्तर 1 — नौसिखिया',
        'profile.xpLabel': 'अगले स्तर के लिए 0 / 500 XP',
        'profile.totalXp': 'कुल XP',
        'profile.labsDone': 'पूर्ण लैब्स',
        'profile.quizzesPassed': 'उत्तीर्ण प्रश्नोत्तरी',
        'profile.badges': 'बैज',
        'profile.allAchievements': 'सभी उपलब्धियाँ',

        // Referenced directly by js/panel-collapse.js's wireCollapseAllToggle()
        // (that button's label is state-dependent, computed at click-time, so
        // it can't be a one-shot data-i18n swap — kept here anyway so every
        // Hindi string in the app lives in one dictionary).
        'toolbar.collapseAll': '🗂️ सभी छोटा करें',
        'toolbar.expandAll': '🗂️ सभी बड़ा करें'
    };
}
if (typeof SIM_I18N_HI === 'undefined') {
    var SIM_I18N_HI = {}; // populated by js/i18n_hi.js: SIM_I18N_HI['sim-id'] = {...}
}

// Applies I18N_HI to every element in the DOM carrying one of the
// data-i18n* attributes below. Safe to call repeatedly (e.g. once per
// language toggle in either direction) — each element's ORIGINAL English
// content/attribute is cached in a data-i18n-orig-* attribute on first
// call, so switching back to English restores it exactly rather than
// leaving stale Hindi behind or requiring a second, English-only dictionary.
//
// Three attribute forms, matching how the underlying markup is shaped:
//   data-i18n="key"          textContent swap — for elements with no
//                             nested markup (a nested chevron/badge would
//                             be destroyed by a textContent write, which
//                             is exactly why the info-card headers wrap
//                             their label in its own inner <span> instead
//                             of tagging the header <div> itself).
//   data-i18n-html="key"     innerHTML swap — for the few elements whose
//                             English text itself contains nested markup
//                             (e.g. the hero title's <span class="grad-text">
//                             accent, the class-block titles' sub-badge).
//   data-i18n-title="key"    swaps the `title` (or `placeholder`, when
//                             present instead) attribute — tooltips, the
//                             hero stats strip's hover text.
function translateStaticUI(lang) {
    if (typeof document === 'undefined') return;
    const dict = (typeof I18N_HI !== 'undefined') ? I18N_HI : {};
    const isHi = lang === 'hi';

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (!key) return;
        if (el.dataset.i18nOrig === undefined) el.dataset.i18nOrig = el.textContent;
        el.textContent = (isHi && dict[key]) ? dict[key] : el.dataset.i18nOrig;
    });

    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        if (!key) return;
        if (el.dataset.i18nOrigHtml === undefined) el.dataset.i18nOrigHtml = el.innerHTML;
        el.innerHTML = (isHi && dict[key]) ? dict[key] : el.dataset.i18nOrigHtml;
    });

    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        if (!key) return;
        const attr = el.hasAttribute('placeholder') ? 'placeholder' : 'title';
        if (el.dataset.i18nOrigTitle === undefined) el.dataset.i18nOrigTitle = el.getAttribute(attr) || '';
        el.setAttribute(attr, (isHi && dict[key]) ? dict[key] : el.dataset.i18nOrigTitle);
    });
}

// Attaches each sim's Hindi companion object (from SIM_I18N_HI) onto its
// SIMS entry as sim.hi, which js/app.js's simField()/localize() already
// know how to read — see js/app.js. Cheap and idempotent, so it's safe to
// call on every language toggle rather than only once at load.
function mergeSimTranslations() {
    if (typeof SIMS === 'undefined' || typeof SIM_I18N_HI === 'undefined') return;
    SIMS.forEach(sim => {
        if (SIM_I18N_HI[sim.id]) sim.hi = SIM_I18N_HI[sim.id];
    });
}

// The single entry point js/app.js's applyLanguage() calls on every
// language switch (in either direction).
if (typeof window !== 'undefined') {
    window.i18nApply = function i18nApply(lang) {
        mergeSimTranslations();
        translateStaticUI(lang);
    };
}
