// Hindi translations of every sim's core content (title/desc/concept/
// formulas/controls/practice/challenge/dataLab/explorer — whichever fields
// a given sim has). Populates SIM_I18N_HI (declared by js/i18n_engine.js,
// loaded before this file) keyed by sim.id, exactly mirroring how
// js/quiz-data*.js populate js/quiz-engine.js's QUIZ_BANK.
//
// js/i18n_engine.js's mergeSimTranslations() attaches each entry here onto
// its SIMS entry as sim.hi; js/app.js's simField()/localize() read it from
// there. A sim with no entry here simply falls back to its English fields
// — see simField()'s doc comment.
//
// TODO(#18): author SIM_I18N_HI['<sim-id>'] for every one of the 34 sims in
// js/simulations*.js. Left empty for now so the i18n engine (js/i18n_engine.js)
// and its static-UI dictionary can ship and be verified independently.
if (typeof SIM_I18N_HI !== 'undefined') {
    // Object.assign(SIM_I18N_HI, { 'sim-id': { title: '...', desc: '...', ... } });
}
