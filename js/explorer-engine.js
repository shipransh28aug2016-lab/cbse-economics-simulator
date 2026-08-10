// ══════════════════════════════════════════════════════════════
// Concept Explorer engine — for historical/policy/conceptual content
// where a numeric simulation would be artificial (Five-Year Plans, LPG
// reforms, Rural Development, Sustainable Development, classification
// of positive/normative statements, etc). Three explorer types:
//
//   explorer: { type: 'timeline', eras: [{period,title,body,insight}] }
//   explorer: { type: 'cards', cards: [{prompt,options,correctIndex,explain}] }
//   explorer: { type: 'scenario', scenarios: [{id,label,summary,sections:[{heading,items:[...]}]}] }
//
// Renders into the same #controls-panel (navigation) / #sim-dom-overlay
// (content) / #readings-body (interpretation) surfaces as every other
// mode, so switching between a Simulator, a Data Lab and a Concept
// Explorer never feels like a different app.
// ══════════════════════════════════════════════════════════════

let explorerState = { timelineIndex: 0, scenarioId: null, cardAnswers: {} };

function renderExplorer(sim) {
    const panel = document.getElementById('controls-panel');
    const overlay = document.getElementById('sim-dom-overlay');
    if (!panel || !overlay || !sim.explorer) return;
    explorerState = { timelineIndex: 0, scenarioId: (sim.explorer.scenarios && sim.explorer.scenarios[0] && sim.explorer.scenarios[0].id) || null, cardAnswers: {} };

    const type = sim.explorer.type;
    if (type === 'timeline') return renderTimelineExplorer(sim, panel, overlay);
    if (type === 'cards') return renderCardsExplorer(sim, panel, overlay);
    if (type === 'scenario') return renderScenarioExplorer(sim, panel, overlay);
}

function explorerReadings(html) {
    const readingsBody = document.getElementById('readings-body');
    if (!readingsBody) return;
    readingsBody.innerHTML = html || '';
    readingsBody.classList.remove('pulse');
    void readingsBody.offsetWidth;
    readingsBody.classList.add('pulse');
}

function explorerFade(overlay) {
    overlay.classList.remove('chart-fresh');
    void overlay.offsetWidth;
    overlay.classList.add('chart-fresh');
}

// ── Timeline (Five-Year Plans, LPG reforms, colonial-era economy, …) ──
function renderTimelineExplorer(sim, panel, overlay) {
    const eras = sim.explorer.eras;

    function draw() {
        const i = explorerState.timelineIndex;
        const era = eras[i];

        panel.innerHTML = `
            <div class="controls-panel-header collapsible-header" data-panel-key="controls" role="button" tabindex="0"><span>🧭 Explore the Timeline</span>
                <button type="button" class="reset-btn" id="explorer-reset">↺ Reset</button>
                <span class="panel-chevron" aria-hidden="true">⌄</span>
            </div>
            <p class="controls-panel-hint">Step through each period, or jump straight to one — the panel on the right explains why that period mattered economically.</p>
            <div class="explorer-timeline-nav" id="explorer-timeline-nav"></div>
            <div class="explorer-timeline-controls">
                <button type="button" class="datalab-btn" id="explorer-prev" ${i === 0 ? 'disabled' : ''}>← Previous</button>
                <button type="button" class="datalab-btn" id="explorer-next" ${i === eras.length - 1 ? 'disabled' : ''}>Next →</button>
            </div>`;

        const navEl = document.getElementById('explorer-timeline-nav');
        eras.forEach((e, idx) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'explorer-timeline-btn' + (idx === i ? ' active' : '');
            btn.innerHTML = `<span class="explorer-timeline-period">${e.period}</span><span class="explorer-timeline-title">${e.title}</span>`;
            btn.addEventListener('click', () => { explorerState.timelineIndex = idx; draw(); });
            navEl.appendChild(btn);
        });
        document.getElementById('explorer-prev').addEventListener('click', () => { explorerState.timelineIndex--; draw(); });
        document.getElementById('explorer-next').addEventListener('click', () => { explorerState.timelineIndex++; draw(); });
        const timelineResetBtn = document.getElementById('explorer-reset');
        timelineResetBtn.addEventListener('click', (e) => e.stopPropagation());
        timelineResetBtn.addEventListener('click', () => { explorerState.timelineIndex = 0; draw(); });
        if (typeof initPanelCollapse === 'function') initPanelCollapse(panel, panel.querySelector('.controls-panel-header'), 'controls', false);

        overlay.innerHTML = `
            <div class="explorer-timeline-card">
                <div class="explorer-timeline-card-period">${era.period}</div>
                <h3 class="explorer-timeline-card-title">${era.title}</h3>
                <div class="explorer-timeline-card-body">${era.body}</div>
                ${era.tags ? `<div class="explorer-tags">${era.tags.map(t => `<span class="explorer-tag">${t}</span>`).join('')}</div>` : ''}
                <div class="explorer-progress-dots">${eras.map((_, idx) => `<span class="explorer-dot${idx === i ? ' active' : ''}"></span>`).join('')}</div>
            </div>`;
        explorerFade(overlay);

        const changed = i === 0 ? '' : `<div class="reading-row whatchanged-row">🔄 <span>What changed:</span> moved to "${era.title}" (${era.period}).</div>`;
        explorerReadings(changed + `<div class="reading-row insight-row">💡 ${era.insight || 'Read the period card and note how it changed the answer to what/how/for whom to produce, or how it moved India along its development path.'}</div>`);
        if (typeof refreshChallenge === 'function') refreshChallenge(sim, { timelineIndex: i, eraTitle: era.title });
    }
    draw();
}

// ── Cards (classification exercises: Positive vs Normative, etc.) ──
function renderCardsExplorer(sim, panel, overlay) {
    const cards = sim.explorer.cards;

    function score() {
        const answered = Object.keys(explorerState.cardAnswers).length;
        const correct = Object.values(explorerState.cardAnswers).filter(a => a.correct).length;
        return { answered, correct, total: cards.length };
    }

    function draw() {
        panel.innerHTML = `
            <div class="controls-panel-header collapsible-header" data-panel-key="controls" role="button" tabindex="0"><span>🧭 Classify Each Statement</span>
                <button type="button" class="reset-btn" id="explorer-reset">↺ Reset</button>
                <span class="panel-chevron" aria-hidden="true">⌄</span>
            </div>
            <p class="controls-panel-hint">Pick an answer for each card on the right — you'll see the correct classification and a short explanation immediately.</p>`;
        const cardsResetBtn = document.getElementById('explorer-reset');
        cardsResetBtn.addEventListener('click', (e) => e.stopPropagation());
        cardsResetBtn.addEventListener('click', () => { explorerState.cardAnswers = {}; draw(); });
        if (typeof initPanelCollapse === 'function') initPanelCollapse(panel, panel.querySelector('.controls-panel-header'), 'controls', false);

        overlay.innerHTML = `<div class="explorer-cards-list">${cards.map((c, idx) => {
            const ans = explorerState.cardAnswers[idx];
            return `<div class="explorer-card">
                <div class="explorer-card-prompt">${c.prompt}</div>
                <div class="explorer-card-options" data-idx="${idx}">
                    ${c.options.map((opt, oi) => `<button type="button" class="explorer-card-opt${ans ? (oi === c.correctIndex ? ' correct' : (oi === ans.chosen ? ' incorrect' : '')) : ''}" data-idx="${idx}" data-opt="${oi}" ${ans ? 'disabled' : ''}>${opt}</button>`).join('')}
                </div>
                ${ans ? `<div class="explorer-card-explain">${ans.correct ? '✅' : '❌'} ${c.explain}</div>` : ''}
            </div>`;
        }).join('')}</div>`;
        explorerFade(overlay);

        overlay.querySelectorAll('.explorer-card-opt').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.idx, 10);
                const oi = parseInt(btn.dataset.opt, 10);
                explorerState.cardAnswers[idx] = { chosen: oi, correct: oi === cards[idx].correctIndex };
                draw();
            });
        });

        const s = score();
        explorerReadings(`<div class="reading-row"><span>Answered</span><b>${s.answered} / ${s.total}</b></div>
            <div class="reading-row"><span>Correct</span><b>${s.correct} / ${s.total}</b></div>
            <div class="reading-row insight-row">💡 ${s.answered === 0 ? 'Classify each statement — there is no single "right feeling", only whether it makes a testable claim (positive) or a value judgement (normative).' : s.correct === s.total ? 'All correct — you\'re reliably telling a testable claim apart from a value judgement.' : 'Re-read any card marked ❌ — the explanation under it says exactly what tips a statement from one category to the other.'}</div>`);
        if (typeof refreshChallenge === 'function') refreshChallenge(sim, s);
    }
    draw();
}

// ── Scenario (Fixed vs Flexible exchange rate, formal vs informal
//    rural credit, LPG-era policy comparisons, …) ──
function renderScenarioExplorer(sim, panel, overlay) {
    const scenarios = sim.explorer.scenarios;

    function draw() {
        const current = scenarios.find(s => s.id === explorerState.scenarioId) || scenarios[0];

        panel.innerHTML = `
            <div class="controls-panel-header collapsible-header" data-panel-key="controls" role="button" tabindex="0"><span>🧭 Choose a Scenario</span>
                <button type="button" class="reset-btn" id="explorer-reset">↺ Reset</button>
                <span class="panel-chevron" aria-hidden="true">⌄</span>
            </div>
            <p class="controls-panel-hint">Switch between scenarios to compare them side by side.</p>
            <div class="control-segmented control-segmented--stacked" id="explorer-scenario-group" role="group"></div>`;
        const group = document.getElementById('explorer-scenario-group');
        scenarios.forEach(s => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'segmented-btn' + (s.id === current.id ? ' active' : '');
            btn.textContent = s.label;
            btn.addEventListener('click', () => { explorerState.scenarioId = s.id; draw(); });
            group.appendChild(btn);
        });
        const scenarioResetBtn = document.getElementById('explorer-reset');
        scenarioResetBtn.addEventListener('click', (e) => e.stopPropagation());
        scenarioResetBtn.addEventListener('click', () => { explorerState.scenarioId = scenarios[0].id; draw(); });
        if (typeof initPanelCollapse === 'function') initPanelCollapse(panel, panel.querySelector('.controls-panel-header'), 'controls', false);

        overlay.innerHTML = `<div class="explorer-scenario-card">
            <h3 class="explorer-scenario-title">${current.label}</h3>
            <p class="explorer-scenario-summary">${current.summary}</p>
            ${(current.sections || []).map(sec => `
                <div class="explorer-scenario-section">
                    <div class="explorer-scenario-heading">${sec.heading}</div>
                    <ul class="explorer-scenario-list">${sec.items.map(it => `<li>${it}</li>`).join('')}</ul>
                </div>`).join('')}
        </div>`;
        explorerFade(overlay);

        const prevLabel = explorerState.__prevScenarioLabel;
        const changed = (prevLabel && prevLabel !== current.label)
            ? `<div class="reading-row whatchanged-row">🔄 <span>What changed:</span> switched from "${prevLabel}" to "${current.label}".</div>`
            : '';
        explorerState.__prevScenarioLabel = current.label;
        explorerReadings(changed + `<div class="reading-row insight-row">💡 ${current.insight || 'Compare this scenario against the others in the list — the syllabus expects you to weigh both sides, not just describe one.'}</div>`);
        if (typeof refreshChallenge === 'function') refreshChallenge(sim, { scenarioId: current.id, scenarioLabel: current.label });
    }
    draw();
}
