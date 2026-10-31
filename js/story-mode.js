// ══════════════════════════════════════════════════════════════
// STORY MODE — guided, predict-first walkthroughs on a Graph Lab.
//
// A blackboard shows the END of an argument. A story lets the student
// live through it: a real situation ("Ramu's tea stall", "heavy rain hits
// the onion crop") unfolds one step at a time, the student PREDICTS each
// step before it happens, the diagram glides to the new state, and the
// narration explains what they just watched.
//
// A lab opts in with `graphLab.stories: [{ id, title:{en,hi}, intro:{en,hi},
// steps:[step…] }]`, where a step is:
//   set:      vars to apply on top of the lab's defaults (absolute, not
//             cumulative — so Back/Next always land on the same state)
//   ask?:     { q:{en,hi}, options: [{en,hi}] | (ctx) => [{en,hi}],
//               correct(ctx) => index }   asked BEFORE the step applies
//   say(ctx, hi) => string                narration AFTER it applies
//   check(ctx) => boolean                 the economic claim this step makes
// ctx = { v, m, prev:{v,m}|null, first:{v,m} } — m is graphLab.model()'s
// own output at that state.
//
// Honesty rule (enforced by tools/test-curriculum.js, not by convention):
// every number in a narration is read from ctx.m, the graded answer is
// computed from ctx.m, and every claim the narration makes is restated as
// check(), which the test suite runs against the real model. A story
// whose words drift from its model fails the build.
// ══════════════════════════════════════════════════════════════

let storyActive = null; // { sim, story, idx, answered:{idx:choice}, order:{idx:[…]} }
// The language toggle re-opens the sim (js/app.js applyLanguage → openSim),
// which rebuilds the stage. Remember where the story was, for a moment, so
// it resumes in the new language instead of being thrown away.
let storyResume = null;
document.addEventListener('click', e => {
    if (!e.target.closest || !e.target.closest('#lang-toggle')) return;
    if (!storyActive || !document.getElementById('story-card')) return;
    storyResume = {
        simId: storyActive.sim.id, storyId: storyActive.story.id, idx: storyActive.idx,
        answered: Object.assign({}, storyActive.answered), order: Object.assign({}, storyActive.order), at: Date.now()
    };
}, true);

function storyLang() {
    return (typeof currentLang !== 'undefined' && currentLang === 'hi') ? 'hi' : 'en';
}
function storyText(obj) {
    if (obj == null) return '';
    if (typeof obj === 'string') return obj;
    return obj[storyLang()] || obj.en || '';
}

function storyStateFor(sim, step) {
    const s = {};
    (sim.graphLab.vars || []).forEach(v => { s[v.id] = v.value; });
    return Object.assign(s, step.set || {});
}
function storyModelAt(sim, state) {
    return sim.graphLab.model(Object.assign({}, state), { prev: state, base: state }) || {};
}

// Pure: the ctx for every step of a story, no DOM. Used by the UI and by
// the test suite, so the two can never evaluate a story differently.
function storyContexts(sim, story) {
    const out = [];
    let first = null, prev = null;
    story.steps.forEach(step => {
        const v = storyStateFor(sim, step);
        const m = storyModelAt(sim, v);
        if (!first) first = { v, m };
        out.push({ v, m, prev, first });
        prev = { v, m };
    });
    return out;
}

function storyOptions(step, ctx) {
    if (!step.ask) return [];
    return typeof step.ask.options === 'function' ? step.ask.options(ctx) : step.ask.options;
}

function storyPlain(html) {
    const s = String(html == null ? '' : html);
    return typeof DOMParser === 'function'
        ? new DOMParser().parseFromString(s, 'text/html').body.textContent.replace(/\s+/g, ' ').trim()
        : s.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function storyShuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function storyLabel(en, hi) { return storyLang() === 'hi' ? hi : en; }

// ── launcher in the lab's controls panel ─────────────────────────
function storyRenderLauncher(sim, panel) {
    storyActive = null;
    const stories = (sim.graphLab && sim.graphLab.stories) || [];
    if (!panel || !stories.length) return;
    panel.classList.remove('hidden');
    const box = document.createElement('div');
    box.className = 'story-launcher';
    box.innerHTML = `<div class="story-launcher-title">${storyLabel('🎬 Story Mode — live the concept', '🎬 स्टोरी मोड — अवधारणा को जियो')}</div>
        <p class="story-launcher-hint">${storyLabel('A real situation unfolds step by step. Predict each step, then watch the diagram move.', 'एक असली स्थिति कदम-दर-कदम सामने आती है। हर कदम का अनुमान लगाइए, फिर diagram को चलते देखिए।')}</p>`;
    stories.forEach(story => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'story-launch-btn';
        btn.innerHTML = `<span class="story-launch-name">${glEsc(storyText(story.title))}</span><span class="story-launch-meta">${story.steps.length} ${storyLabel('steps', 'कदम')}</span>`;
        btn.addEventListener('click', () => storyStart(sim, story));
        box.appendChild(btn);
    });
    const header = panel.querySelector('.controls-panel-header');
    panel.insertBefore(box, header ? header.nextSibling : panel.firstChild);

    // Also on the diagram's own toolbar — on a phone the controls panel
    // sits below the stage, where nobody would find the launcher.
    const actions = document.querySelector('#sim-dom-overlay .gl-strip-actions');
    if (actions && !actions.querySelector('#gl-story-btn')) {
        const quick = document.createElement('button');
        quick.type = 'button';
        quick.className = 'gl-holo-btn gl-story-btn';
        quick.id = 'gl-story-btn';
        quick.textContent = storyLabel('🎬 Story', '🎬 स्टोरी');
        quick.addEventListener('click', () => storyStart(sim, stories[0]));
        actions.insertBefore(quick, actions.firstChild);
    }

    const resume = storyResume;
    storyResume = null;
    if (resume && resume.simId === sim.id && Date.now() - resume.at < 3000) {
        const story = stories.find(st => st.id === resume.storyId);
        if (story) {
            storyStart(sim, story);
            storyActive.answered = resume.answered;
            storyActive.order = resume.order;
            if (resume.idx >= story.steps.length) storyFinish();
            else if (resume.idx >= 0) storyGo(resume.idx, false);
        }
    }
}

// ── the story card, inside the Graph Lab stage ───────────────────
function storyCard() {
    const shell = document.querySelector('#sim-dom-overlay .gl-shell');
    if (!shell) return null;
    let card = shell.querySelector('#story-card');
    if (!card) {
        card = document.createElement('div');
        card.id = 'story-card';
        card.className = 'story-card';
        card.setAttribute('role', 'region');
        card.setAttribute('aria-live', 'polite');
        shell.insertBefore(card, shell.firstChild);
    }
    shell.classList.add('story-on');
    return card;
}

function storyStart(sim, story) {
    if (typeof glSim === 'undefined' || glSim !== sim) return;
    storyActive = { sim, story, idx: -1, answered: {}, order: {} };
    const card = storyCard();
    if (!card) return;
    card.innerHTML = `
        <div class="story-head">
            <span class="story-title">${glEsc(storyText(story.title))}</span>
            <button type="button" class="story-x" aria-label="${storyLabel('Exit story', 'स्टोरी बंद करें')}">✕</button>
        </div>
        <div class="story-dots"></div>
        <div class="story-body"></div>
        <div class="story-nav">
            <button type="button" class="story-btn story-back">◀ ${storyLabel('Back', 'पीछे')}</button>
            <button type="button" class="story-btn story-speak">🔊 ${storyLabel('Speak', 'बोलें')}</button>
            <button type="button" class="story-btn story-next story-btn--primary">${storyLabel('Start', 'शुरू करें')} ▶</button>
        </div>`;
    card.querySelector('.story-x').addEventListener('click', storyExit);
    card.querySelector('.story-back').addEventListener('click', () => storyGo(storyActive.idx - 1, true));
    card.querySelector('.story-next').addEventListener('click', () => {
        if (!storyActive) return;
        if (storyActive.idx >= story.steps.length) { storyExit(); return; }
        if (storyActive.idx >= story.steps.length - 1) { storyFinish(); return; }
        storyGo(storyActive.idx + 1, false);
    });
    card.querySelector('.story-speak').addEventListener('click', () => {
        if (typeof MimaVoice === 'undefined') return;
        if (MimaVoice.isSpeaking()) { MimaVoice.stop(); return; }
        const body = card.querySelector('.story-body');
        MimaVoice.speak(storyPlain(body ? body.innerHTML : ''), storyLang());
    });
    card.querySelector('.story-body').innerHTML = `<p class="story-say">${storyText(story.intro)}</p>`;
    storyRefreshNav();
    card.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

function storyExit() {
    storyActive = null;
    if (typeof MimaVoice !== 'undefined') MimaVoice.stop();
    const card = document.getElementById('story-card');
    if (card) card.remove();
    const shell = document.querySelector('#sim-dom-overlay .gl-shell');
    if (shell) shell.classList.remove('story-on');
}

function storyRefreshNav() {
    const card = document.getElementById('story-card');
    if (!card || !storyActive) return;
    const { story, idx } = storyActive;
    card.querySelector('.story-dots').innerHTML = story.steps.map((_, i) =>
        `<span class="story-dot${i < idx ? ' done' : ''}${i === idx ? ' now' : ''}"></span>`).join('');
    card.querySelector('.story-back').disabled = idx <= 0;
    const next = card.querySelector('.story-next');
    const waiting = idx >= 0 && story.steps[idx].ask && storyActive.answered[idx] === undefined;
    next.disabled = waiting;
    next.textContent = idx < 0 ? `${storyLabel('Start', 'शुरू करें')} ▶`
        : idx >= story.steps.length - 1 ? `${storyLabel('Finish', 'पूरा करें')} ✓`
            : `${storyLabel('Next', 'आगे')} ▶`;
}

// Move the live diagram to a step's state, gliding from wherever it is now.
function storyApply(sim, state) {
    const from = typeof glDisplayedState === 'function' ? glDisplayedState() : null;
    Object.keys(state).forEach(k => { glState[k] = state[k]; });
    glRender(sim, true, from ? { glideFrom: from } : undefined);
}

function storyGo(idx, skipAsk) {
    if (!storyActive || idx < 0 || idx >= storyActive.story.steps.length) return;
    const { sim, story } = storyActive;
    if (typeof glSim === 'undefined' || glSim !== sim) { storyExit(); return; }
    storyActive.idx = idx;
    if (typeof MimaVoice !== 'undefined') MimaVoice.stop();
    const step = story.steps[idx];
    const ctx = storyContexts(sim, story)[idx];
    const body = document.querySelector('#story-card .story-body');
    if (!body) return;

    const reveal = (choice) => {
        storyApply(sim, ctx.v);
        let verdictHTML = '';
        if (step.ask && choice != null) {
            const right = step.ask.correct(ctx);
            const opts = storyOptions(step, ctx);
            verdictHTML = choice === right
                ? `<div class="story-result story-result--right">${storyLabel('✅ You predicted it!', '✅ आपका अनुमान सही था!')}</div>`
                : `<div class="story-result story-result--wrong">${storyLabel('❌ Not quite — the model shows:', '❌ पूरी तरह नहीं — model दिखाता है:')} <b>${glEsc(storyText(opts[right]))}</b></div>`;
        }
        body.innerHTML = verdictHTML + `<p class="story-say">${step.say(ctx, storyLang() === 'hi')}</p>`;
        storyRefreshNav();
    };

    if (step.ask && !skipAsk && storyActive.answered[idx] === undefined) {
        // Ask with the diagram still showing the PREVIOUS state — the
        // prediction has to come before the student sees the answer.
        const opts = storyOptions(step, ctx);
        // Shown in a shuffled order (kept for this run), graded by the
        // original index — so "always click the first one" can't score.
        if (!storyActive.order[idx]) storyActive.order[idx] = storyShuffle(opts.map((_, i) => i));
        body.innerHTML = `<p class="story-q">🤔 ${storyText(step.ask.q)}</p>
            <div class="story-opts">${storyActive.order[idx].map(i => `<button type="button" class="story-opt" data-i="${i}">${glEsc(storyText(opts[i]))}</button>`).join('')}</div>`;
        body.querySelectorAll('.story-opt').forEach(btn => btn.addEventListener('click', () => {
            const choice = parseInt(btn.dataset.i, 10);
            storyActive.answered[idx] = choice;
            reveal(choice);
        }));
        storyRefreshNav();
        return;
    }
    reveal(skipAsk ? null : storyActive.answered[idx]);
}

function storyFinish() {
    if (!storyActive) return;
    const { story, answered } = storyActive;
    const ctxs = storyContexts(storyActive.sim, story);
    const asked = story.steps.map((s, i) => i).filter(i => story.steps[i].ask);
    const right = asked.filter(i => answered[i] === story.steps[i].ask.correct(ctxs[i])).length;
    const body = document.querySelector('#story-card .story-body');
    if (body) {
        body.innerHTML = `<div class="story-result story-result--right">${storyLabel(`🏁 Story complete — ${right} of ${asked.length} predictions right.`, `🏁 स्टोरी पूरी — ${asked.length} में से ${right} अनुमान सही।`)}</div>
            <p class="story-say">${storyText(story.outro)}</p>`;
    }
    const next = document.querySelector('#story-card .story-next');
    if (next) { next.textContent = storyLabel('Close ✕', 'बंद करें ✕'); next.disabled = false; }
    storyActive.idx = story.steps.length;
    const dots = document.querySelector('#story-card .story-dots');
    if (dots) dots.querySelectorAll('.story-dot').forEach(d => { d.className = 'story-dot done'; });
}
