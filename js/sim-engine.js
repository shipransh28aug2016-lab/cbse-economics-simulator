// ══════════════════════════════════════════════════════════════
// Shared simulation engine.
// Each entry in SIMS carries its own `controls` (input definitions)
// and either:
//   - a `compute(values)` function returning Plotly traces/layout plus
//     a readings HTML string (the common case), or
//   - a `customRender(container, values)` function that draws directly
//     into the chart container (e.g. an animated SVG flow diagram) and
//     returns just `{ readings }`.
// This file only supplies small math/SVG helpers and the generic
// rendering plumbing shared by every simulation.
// ══════════════════════════════════════════════════════════════

function fmt(n, d = 2) {
    if (typeof n !== 'number' || !isFinite(n)) return '—';
    return n.toFixed(d);
}

function range(n) {
    return Array.from({ length: n }, (_, i) => i);
}

// Solves two linear lines of the form P = a - b*Q (downward) and
// P = c + d*Q (upward) for their intersection point.
function lineIntersect(a, b, c, d) {
    const Q = (a - c) / (b + d);
    const P = a - b * Q;
    return { Q, P };
}

// Small seeded PRNG so demo datasets (e.g. the correlation scatter)
// stay stable across reloads instead of jumping around randomly.
function seededRand(seed) {
    let s = seed;
    return function () {
        s = (s * 9301 + 49297) % 233280;
        return s / 233280;
    };
}

function makeRandN(seed) {
    const rnd = seededRand(seed);
    return function () {
        let u = 0;
        for (let i = 0; i < 3; i++) u += rnd();
        return (u - 1.5) * 1.6329931619; // roughly unit variance
    };
}

// The quadratic-bezier control point for a curve from (x1,y1) to
// (x2,y2), offset sideways by `bend`. Shared by curvedPathD (the wire
// itself) and flow label placement, so a label can sit further out
// along the exact same side as its own arc.
//
// Note: the sideways offset is measured relative to *this edge's own*
// direction, and that direction's perpendicular flips sign when you
// reverse (x1,y1)<->(x2,y2). So to make two opposite-direction edges
// between the same pair of nodes land on opposite visual sides, both
// calls must use the SAME bend sign (not one positive, one negated) —
// the direction reversal itself does the mirroring.
function curveOffsetPoint(x1, y1, x2, y2, bend) {
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const nx = -dy / len, ny = dx / len;
    return { x: mx + nx * bend, y: my + ny * bend };
}

function curvedPathD(x1, y1, x2, y2, bend) {
    const c = curveOffsetPoint(x1, y1, x2, y2, bend);
    return `M ${x1} ${y1} Q ${c.x.toFixed(1)} ${c.y.toFixed(1)} ${x2} ${y2}`;
}

// A small pill-shaped, color-coded label that gently "breathes" (pulses
// opacity) in place — used to explicitly name every flow directly on
// the diagram, while still reading as dynamic/alive rather than a
// static caption nobody notices.
function flowLabelSVG(x, y, text, color, duration) {
    duration = duration || 2.4;
    const w = Math.max(30, text.length * 4.3 + 10);
    return `
        <g transform="translate(${x.toFixed(1)},${y.toFixed(1)})">
            <rect x="${(-w / 2).toFixed(1)}" y="-7.5" width="${w.toFixed(1)}" height="15" rx="7.5" fill="#fff" fill-opacity="0.88" stroke="${color}" stroke-width="1"></rect>
            <text x="0" y="3.2" text-anchor="middle" font-size="7" font-weight="700" fill="${color}" font-family="Inter, sans-serif">${text}</text>
            <animate attributeName="opacity" values="0.75;1;0.75" dur="${duration}s" repeatCount="indefinite"></animate>
        </g>`;
}

// Renders one "wire" (a faint path) plus a stream of small particles
// animated along it with SMIL <animateMotion> — an electric-current /
// data-packet look. `value` (relative to `maxValue`) scales both the
// particle speed and how many particles are on the wire at once, so a
// bigger flow visibly reads as faster and busier.
//
// `opts.shape: 'square'` + `opts.dashed: true` gives a visually distinct
// style — used to tell a "real flow" (factors, goods & services) apart
// from a "money flow" (payments, expenditure) on the same diagram, since
// economically they are two different, opposite-direction things.
function flowStreamSVG(id, d, color, value, maxValue, opts) {
    opts = opts || {};
    maxValue = maxValue || 150;
    const ratio = Math.max(0, Math.min(1, value / maxValue));
    const strokeWidth = (1.4 + 2.4 * ratio).toFixed(1);
    const count = Math.max(2, Math.min(8, Math.round(2 + 6 * ratio)));
    const duration = Math.max(1.1, 3.4 - 2.1 * ratio); // bigger flow = faster particles
    const dashAttr = opts.dashed ? ' stroke-dasharray="6 5"' : '';
    const size = 3.4;
    const particleTag = opts.shape === 'square'
        ? `<rect x="${-size}" y="${-size}" width="${size * 2}" height="${size * 2}" rx="1" fill="${color}">`
        : `<circle r="${size}" fill="${color}">`;
    const particleClose = opts.shape === 'square' ? '</rect>' : '</circle>';

    let particles = '';
    for (let i = 0; i < count; i++) {
        const begin = (-(duration / count) * i).toFixed(2);
        particles += `
            ${particleTag}
                <animateMotion dur="${duration}s" begin="${begin}s" repeatCount="indefinite" rotate="auto">
                    <mpath href="#${id}" xlink:href="#${id}"></mpath>
                </animateMotion>
            ${particleClose}`;
    }

    return `<path id="${id}" d="${d}" fill="none" stroke="${color}" stroke-opacity="0.28" stroke-width="${strokeWidth}"${dashAttr} stroke-linecap="round"></path>${particles}`;
}

function plotlyDefaultLayout() {
    // Note: deliberately no `layout.transition` here. Plotly's built-in
    // animated transitions are asynchronous, and a real slider drag fires
    // many rapid-fire `input` events (and simulations can be switched
    // while one is mid-flight) — overlapping/interrupted transitions on
    // the same container reliably threw inside Plotly's internal tween
    // code once the old DOM nodes were gone. A plain, synchronous redraw
    // is fully robust; the "chart just updated" feel comes from the CSS
    // fade applied in renderSimChart() instead.
    // Shared axis look so every chart's X/Y axis is unmistakably visible:
    // a solid axis line, a visible zero line, light gridlines, and a bold
    // title so students can always tell what each axis actually measures.
    // renderSimChart() merges this per-axis (not just spread at the top
    // level) so a simulation's own `xaxis: { title, range }` doesn't wipe
    // this styling out — it only adds to it.
    // Note: no default `title` here on purpose — every sim passes its
    // axis title as a plain string (e.g. `title: 'Quantity'`), and a
    // shallow per-axis merge would overwrite an object default with
    // that string, silently discarding any font styling placed here.
    // renderSimChart() normalizes the title into a styled object *after*
    // merging instead — see styledAxisTitle().
    const axisDefaults = {
        tickfont: { size: 10, color: '#4b4470' },
        showline: true,
        linewidth: 1.5,
        linecolor: 'rgba(30,27,58,0.35)',
        showgrid: true,
        gridcolor: 'rgba(30,27,58,0.08)',
        zeroline: true,
        zerolinewidth: 1.5,
        zerolinecolor: 'rgba(30,27,58,0.22)'
    };

    return {
        margin: { t: 20, r: 30, b: 55, l: 60 },
        font: { family: 'Inter, sans-serif', size: 11, color: '#1e1b3a' },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(255,255,255,0.35)',
        showlegend: true,
        legend: { orientation: 'h', y: -0.32 },
        xaxis: axisDefaults,
        yaxis: axisDefaults
    };
}

// Every simulation passes its axis title as a plain string. Plotly also
// accepts an object form (`{text, font, standoff}`) that lets us force a
// bold, clearly legible title font — this converts the string form into
// that styled object after the default/per-sim axis configs are merged,
// so the styling always applies regardless of which axis title is used.
function styledAxisTitle(axis) {
    if (axis && typeof axis.title === 'string' && axis.title.length) {
        axis.title = {
            text: axis.title,
            font: { size: 12.5, color: '#1e1b3a', family: 'Inter, sans-serif' },
            standoff: 10
        };
    }
    return axis;
}

let simEngineState = {};

function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
}

function buildControls(sim) {
    const panel = document.getElementById('controls-panel');
    if (!panel) return;
    panel.innerHTML = '';

    const isHi = (typeof window.getLang === 'function') && window.getLang() === 'hi';
    const simHi = window.I18N_HI && window.I18N_HI.sims && window.I18N_HI.sims[sim.id];
    const tr = (key, fallback) => (typeof window.t === 'function' ? window.t(key, null, fallback) : fallback);
    const ctlLabel = (c) => (isHi && simHi && simHi.controls && simHi.controls[c.id]) ? simHi.controls[c.id] : c.label;
    const ctlOptionLabel = (c, opt) => (isHi && simHi && simHi.controlOptions && simHi.controlOptions[c.id] && simHi.controlOptions[c.id][opt.value]) ? simHi.controlOptions[c.id][opt.value] : opt.label;

    if (!sim.controls || !sim.controls.length) {
        panel.innerHTML = `<p class="empty-hint">${tr('ctl.emptyHint', 'No adjustable inputs for this lab — explore the chart on the left.')}</p>`;
        return;
    }

    const header = document.createElement('div');
    header.className = 'controls-panel-header';
    const headerLabel = document.createElement('span');
    headerLabel.textContent = tr('ctl.header', '🎛️ Adjust the Variables');
    header.appendChild(headerLabel);

    const headerActions = document.createElement('div');
    headerActions.className = 'controls-panel-header-inner';

    const hint = document.createElement('p');
    hint.className = 'controls-panel-hint';
    hint.textContent = tr('ctl.hint', 'Try your own numbers — drag a slider or type an exact value and watch the chart and readings update instantly. Great for self-paced or classroom what-if exploration.');

    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'reset-btn';
    resetBtn.innerHTML = tr('ctl.reset', '↺ Reset');
    resetBtn.addEventListener('click', () => {
        sim.controls.forEach(c => {
            simEngineState[c.id] = c.value;
            if (c.type === 'select') {
                const group = document.getElementById(`ctl-${c.id}`);
                if (group) {
                    group.querySelectorAll('.segmented-btn').forEach((btn, i) => {
                        const isDefault = c.options[i].value === c.value;
                        btn.classList.toggle('active', isDefault);
                        btn.setAttribute('aria-pressed', String(isDefault));
                    });
                }
            } else {
                const rangeEl = document.getElementById(`ctl-${c.id}`);
                const numEl = document.getElementById(`ctl-${c.id}-num`);
                if (rangeEl) rangeEl.value = c.value;
                if (numEl) numEl.value = c.value;
            }
        });
        applyControlVisibility(sim);
        renderSimChart(sim);
    });

    const collapseBtn = document.createElement('button');
    collapseBtn.type = 'button';
    collapseBtn.className = 'panel-collapse-btn';
    collapseBtn.setAttribute('aria-label', tr('sim.hdr.controls.collapse', 'Collapse Adjust the Variables panel'));
    collapseBtn.textContent = '▾';

    headerActions.appendChild(resetBtn);
    headerActions.appendChild(collapseBtn);
    header.appendChild(headerActions);
    panel.appendChild(header);
    panel.appendChild(hint);

    sim.controls.forEach(c => {
        simEngineState[c.id] = c.value;

        const row = document.createElement('div');
        row.className = 'control-row';
        if (c.showWhen) {
            row.dataset.showWhenId = c.showWhen.id;
            row.dataset.showWhenEquals = String(c.showWhen.equals);
        }

        if (c.type === 'select') {
            // A small segmented-button group for a categorical choice
            // (e.g. "which elasticity?" or "which view?") rather than a
            // continuous slider — some variables in the syllabus are a
            // choice of mode, not a number.
            row.innerHTML = `
                <div class="control-label-row">
                    <label>${ctlLabel(c)}</label>
                </div>
                <div class="control-segmented" id="ctl-${c.id}" role="group" aria-label="${ctlLabel(c)}"></div>
            `;
            panel.appendChild(row);
            const group = row.querySelector('.control-segmented');
            c.options.forEach(opt => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'segmented-btn';
                btn.textContent = ctlOptionLabel(c, opt);
                btn.setAttribute('aria-pressed', String(opt.value === c.value));
                if (opt.value === c.value) btn.classList.add('active');
                btn.addEventListener('click', () => {
                    simEngineState[c.id] = opt.value;
                    group.querySelectorAll('.segmented-btn').forEach(b => {
                        b.classList.remove('active');
                        b.setAttribute('aria-pressed', 'false');
                    });
                    btn.classList.add('active');
                    btn.setAttribute('aria-pressed', 'true');
                    applyControlVisibility(sim);
                    renderSimChart(sim);
                });
                group.appendChild(btn);
            });
            return;
        }

        row.innerHTML = `
            <div class="control-label-row">
                <label for="ctl-${c.id}">${ctlLabel(c)}</label>
                ${c.unit ? `<span class="control-unit">${c.unit}</span>` : ''}
            </div>
            <div class="control-input-group">
                <input type="range" id="ctl-${c.id}" min="${c.min}" max="${c.max}" step="${c.step}" value="${c.value}">
                <input type="number" id="ctl-${c.id}-num" class="control-number" min="${c.min}" max="${c.max}" step="${c.step}" value="${c.value}" aria-label="${c.label} (exact value)">
            </div>
        `;
        panel.appendChild(row);

        const rangeEl = row.querySelector('input[type="range"]');
        const numEl = row.querySelector('input[type="number"]');

        // Dragging the slider always stays within bounds (native behaviour).
        rangeEl.addEventListener('input', () => {
            const v = parseFloat(rangeEl.value);
            simEngineState[c.id] = v;
            numEl.value = v;
            renderSimChart(sim);
        });

        // Typing a value updates live as soon as it parses, without
        // hard-clamping mid-keystroke (so typing "45" doesn't get cut
        // off after the first digit) — it snaps into range on blur.
        numEl.addEventListener('input', () => {
            const v = parseFloat(numEl.value);
            if (!isNaN(v)) {
                simEngineState[c.id] = v;
                rangeEl.value = clamp(v, c.min, c.max);
                renderSimChart(sim);
            }
        });
        numEl.addEventListener('blur', () => {
            const v = parseFloat(numEl.value);
            const clamped = isNaN(v) ? c.value : clamp(v, c.min, c.max);
            numEl.value = clamped;
            rangeEl.value = clamped;
            simEngineState[c.id] = clamped;
            renderSimChart(sim);
        });
    });

    applyControlVisibility(sim);
    if (typeof window.applyStoredPanelState === 'function') window.applyStoredPanelState(panel);
}

// Some controls only make sense for a particular mode of a "select"
// control (e.g. the "Price of Related Good" slider only matters when
// Elasticity Type = Cross). `showWhen: {id, equals}` on a control marks
// it as conditional; this shows/hides those rows to match current state
// without ever touching the controls that don't declare a condition.
function applyControlVisibility(sim) {
    const panel = document.getElementById('controls-panel');
    if (!panel) return;
    panel.querySelectorAll('.control-row[data-show-when-id]').forEach(row => {
        const match = String(simEngineState[row.dataset.showWhenId]) === row.dataset.showWhenEquals;
        row.classList.toggle('hidden', !match);
    });
}

function renderSimChart(sim) {
    const overlay = document.getElementById('sim-dom-overlay');
    const readingsBody = document.getElementById('readings-body');
    if (!overlay) return;

    let result;
    if (typeof sim.customRender === 'function') {
        // Simulations that need something Plotly can't express (e.g. an
        // animated flow diagram) draw straight into the overlay div and
        // just hand back the readings HTML.
        result = sim.customRender(overlay, simEngineState) || {};
    } else if (typeof sim.compute === 'function') {
        result = sim.compute(simEngineState);
        const base = plotlyDefaultLayout();
        const layout = Object.assign({}, base, result.layout || {});
        // A shallow merge would let a simulation's own `xaxis: { title,
        // range }` silently replace (not extend) the shared axis styling
        // above — so every X/Y axis line, gridline and title font would
        // quietly disappear the moment a sim sets its own axis title.
        // Merge one level deeper for xaxis/yaxis specifically.
        layout.xaxis = styledAxisTitle(Object.assign({}, base.xaxis, (result.layout && result.layout.xaxis) || {}));
        layout.yaxis = styledAxisTitle(Object.assign({}, base.yaxis, (result.layout && result.layout.yaxis) || {}));
        // A secondary y-axis (only used by the dual-axis Market Structures
        // bar chart) isn't covered by the shared defaults above, but its
        // title still needs the same bold-legible treatment.
        if (layout.yaxis2) layout.yaxis2 = styledAxisTitle(layout.yaxis2);
        if (typeof Plotly !== 'undefined') {
            Plotly.react(overlay, result.traces || [], layout, { displayModeBar: false, responsive: true }).catch(() => {});
        }
    } else {
        return;
    }

    // Pure-CSS fade so a chart update still feels alive without relying
    // on Plotly's own (fragile, async) transition engine.
    overlay.classList.remove('chart-fresh');
    void overlay.offsetWidth; // force reflow to restart the animation
    overlay.classList.add('chart-fresh');

    if (readingsBody) {
        const readingsHtml = typeof window.translatePhrases === 'function'
            ? window.translatePhrases(result.readings || '')
            : (result.readings || '');
        readingsBody.innerHTML = readingsHtml;
        // Restart the highlight animation on every recompute so students
        // notice the readings actually changed.
        readingsBody.classList.remove('pulse');
        void readingsBody.offsetWidth; // force reflow to restart the CSS animation
        readingsBody.classList.add('pulse');
    }

    // A sim whose controls include a mode/view switch (e.g. Elasticity
    // Type, or Product vs Cost view) can return its own `formulas` for
    // the *current* mode, so the formula card stays relevant instead of
    // always showing every mode's formulas at once. Sims that don't
    // return this just keep the static list set once in renderSim().
    // These mode-specific formulas bypass the per-sim Hindi override in
    // renderSim()/translateSimStaticText() (which only covers a sim's
    // *default* formulas), so they're run through the same phrase
    // dictionary as the readings above.
    if (Array.isArray(result.formulas)) {
        const formulaBody = document.getElementById('formula-body');
        if (formulaBody) {
            formulaBody.innerHTML = result.formulas
                .map(f => `<div class="formula-line">${typeof window.translatePhrases === 'function' ? window.translatePhrases(f) : f}</div>`)
                .join('');
        }
    }
}

function renderSim(sim) {
    window.currentSim = sim; // read by the quiz engine's "Take the Quiz" button and by i18nApply() on language toggle
    const conceptBody = document.getElementById('concept-body');
    const formulaBody = document.getElementById('formula-body');
    const canvas = document.getElementById('sim-canvas');
    const overlay = document.getElementById('sim-dom-overlay');

    // Different simulations can have very different chart shapes (line vs
    // bar, one axis vs two, sankey vs cartesian, or a hand-built animated
    // SVG). Reusing a container across two incompatible renders can throw
    // deep inside Plotly's redraw code, so fully tear down whatever was
    // there whenever we switch simulations. Slider-driven updates *within*
    // the same simulation skip this (they call renderSimChart directly).
    if (overlay) {
        if (overlay.data && typeof Plotly !== 'undefined') {
            Plotly.purge(overlay);
        } else {
            overlay.innerHTML = '';
        }
    }

    const isHi = (typeof window.getLang === 'function') && window.getLang() === 'hi';
    const simHi = window.I18N_HI && window.I18N_HI.sims && window.I18N_HI.sims[sim.id];

    const titleNav = document.getElementById('sim-title-nav');
    if (titleNav) titleNav.textContent = (isHi && simHi && simHi.title) ? simHi.title : sim.title;

    if (conceptBody) {
        const chapterText = (isHi && simHi && simHi.chapter) ? simHi.chapter : sim.chapter;
        const chapterTag = chapterText
            ? `<div class="chapter-tag">📘 ${chapterText}</div>`
            : '';
        const conceptHtml = (isHi && simHi && simHi.concept) ? simHi.concept : sim.concept;
        conceptBody.innerHTML = chapterTag + (conceptHtml || '');
    }
    if (formulaBody) {
        const formulasArr = (isHi && simHi && simHi.formulas) ? simHi.formulas : (sim.formulas || []);
        formulaBody.innerHTML = formulasArr
            .map(f => `<div class="formula-line">${f}</div>`)
            .join('');
    }
    // Charts render into #sim-dom-overlay via Plotly; the raw canvas
    // underneath isn't used by any simulation, so keep it out of the way.
    if (canvas) canvas.style.display = 'none';

    simEngineState = {};
    buildControls(sim);
    renderSimChart(sim);
}

// Re-applies translated concept/formulas/control-labels/chart text for
// the currently-open simulation when the language toggle is flipped —
// WITHOUT calling buildControls()/renderSim() again, which would wipe
// out whatever slider values the student had already set. Called by
// js/i18n_engine.js's i18nApply().
function translateSimStaticText(sim) {
    if (!sim) return;
    const isHi = (typeof window.getLang === 'function') && window.getLang() === 'hi';
    const simHi = window.I18N_HI && window.I18N_HI.sims && window.I18N_HI.sims[sim.id];

    const titleNav = document.getElementById('sim-title-nav');
    if (titleNav) titleNav.textContent = (isHi && simHi && simHi.title) ? simHi.title : sim.title;

    const conceptBody = document.getElementById('concept-body');
    if (conceptBody) {
        const chapterText = (isHi && simHi && simHi.chapter) ? simHi.chapter : sim.chapter;
        const chapterTag = chapterText ? `<div class="chapter-tag">📘 ${chapterText}</div>` : '';
        const conceptHtml = (isHi && simHi && simHi.concept) ? simHi.concept : sim.concept;
        conceptBody.innerHTML = chapterTag + (conceptHtml || '');
    }

    // Re-apply the sim's default formula list first. Most sims never
    // override this, so without this step their formula card would
    // stay in whatever language it was last rendered in. Sims whose
    // compute() *does* return a mode-specific formula set (e.g. the
    // Elasticity Type switch) get it immediately overwritten below by
    // renderSimChart(), which re-runs compute() and phrase-translates
    // whichever set is actually active — so this is always safe.
    const formulaBody = document.getElementById('formula-body');
    if (formulaBody) {
        const formulasArr = (isHi && simHi && simHi.formulas) ? simHi.formulas : (sim.formulas || []);
        formulaBody.innerHTML = formulasArr.map(f => `<div class="formula-line">${f}</div>`).join('');
    }

    if (sim.controls && sim.controls.length) {
        const panel = document.getElementById('controls-panel');
        sim.controls.forEach(c => {
            const label = (isHi && simHi && simHi.controls && simHi.controls[c.id]) ? simHi.controls[c.id] : c.label;
            if (c.type === 'select') {
                const group = panel ? panel.querySelector(`#ctl-${c.id}`) : null;
                const row = group ? group.closest('.control-row') : null;
                const labelEl = row ? row.querySelector('.control-label-row label') : null;
                if (labelEl) labelEl.textContent = label;
                if (group) group.setAttribute('aria-label', label);
                if (group && c.options) {
                    const btns = group.querySelectorAll('.segmented-btn');
                    c.options.forEach((opt, i) => {
                        const optLabel = (isHi && simHi && simHi.controlOptions && simHi.controlOptions[c.id] && simHi.controlOptions[c.id][opt.value])
                            ? simHi.controlOptions[c.id][opt.value] : opt.label;
                        if (btns[i]) btns[i].textContent = optLabel;
                    });
                }
            } else {
                const rangeEl = panel ? panel.querySelector(`#ctl-${c.id}`) : null;
                const row = rangeEl ? rangeEl.closest('.control-row') : null;
                const labelEl = row ? row.querySelector('label[for]') : null;
                if (labelEl) labelEl.textContent = label;
            }
        });

        const headerLabel = document.querySelector('#controls-panel .controls-panel-header > span');
        if (headerLabel) headerLabel.textContent = (typeof window.t === 'function') ? window.t('ctl.header', null, '🎛️ Adjust the Variables') : headerLabel.textContent;
        const hintEl = document.querySelector('#controls-panel .controls-panel-hint');
        if (hintEl) hintEl.textContent = (typeof window.t === 'function') ? window.t('ctl.hint', null, hintEl.textContent) : hintEl.textContent;
        const resetBtn = document.querySelector('#controls-panel .reset-btn');
        if (resetBtn) resetBtn.innerHTML = (typeof window.t === 'function') ? window.t('ctl.reset', null, '↺ Reset') : resetBtn.innerHTML;
    }

    // Re-render the chart/readings in place — this reads the existing
    // simEngineState (untouched above), so slider positions are kept.
    renderSimChart(sim);
}
window.translateSimStaticText = translateSimStaticText;
