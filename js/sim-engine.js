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

    if (!sim.controls || !sim.controls.length) {
        panel.innerHTML = '<p class="empty-hint">No adjustable inputs for this lab — explore the chart on the left.</p>';
        return;
    }

    const header = document.createElement('div');
    header.className = 'controls-panel-header';
    header.innerHTML = `<span>🎛️ Adjust the Variables</span>`;

    const hint = document.createElement('p');
    hint.className = 'controls-panel-hint';
    hint.textContent = 'Try your own numbers — drag a slider or type an exact value and watch the chart and readings update instantly. Great for self-paced or classroom what-if exploration.';

    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'reset-btn';
    resetBtn.innerHTML = '↺ Reset';
    resetBtn.addEventListener('click', () => {
        sim.controls.forEach(c => {
            simEngineState[c.id] = c.value;
            const rangeEl = document.getElementById(`ctl-${c.id}`);
            const numEl = document.getElementById(`ctl-${c.id}-num`);
            if (rangeEl) rangeEl.value = c.value;
            if (numEl) numEl.value = c.value;
        });
        renderSimChart(sim);
    });
    header.appendChild(resetBtn);
    panel.appendChild(header);
    panel.appendChild(hint);

    sim.controls.forEach(c => {
        simEngineState[c.id] = c.value;

        const row = document.createElement('div');
        row.className = 'control-row';
        row.innerHTML = `
            <div class="control-label-row">
                <label for="ctl-${c.id}">${c.label}</label>
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
        readingsBody.innerHTML = result.readings || '';
        // Restart the highlight animation on every recompute so students
        // notice the readings actually changed.
        readingsBody.classList.remove('pulse');
        void readingsBody.offsetWidth; // force reflow to restart the CSS animation
        readingsBody.classList.add('pulse');
    }
}

function renderSim(sim) {
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

    if (conceptBody) {
        const chapterTag = sim.chapter
            ? `<div class="chapter-tag">📘 ${sim.chapter}</div>`
            : '';
        conceptBody.innerHTML = chapterTag + (sim.concept || '');
    }
    if (formulaBody) {
        formulaBody.innerHTML = (sim.formulas || [])
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
