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

// Resolves a nested path (e.g. 'controls.income.label' or 'practice.0.hint')
// against a sim's `hi` companion object (see js/i18n_hi.js / js/i18n_engine.js's
// mergeSimTranslations()), returning `undefined` if the current language
// isn't Hindi, the sim has no translations, or that particular path wasn't
// translated — callers always follow this with `|| englishValue` so a
// partially-translated sim degrades field-by-field to English rather than
// going blank. Shared by sim-engine.js, datalab-engine.js and
// explorer-engine.js (all three render from a sim's nested content).
function hiPath(sim, path) {
    if (!sim || !sim.hi) return undefined;
    if (typeof currentLang === 'undefined' || currentLang !== 'hi') return undefined;
    let node = sim.hi;
    const parts = path.split('.');
    for (let i = 0; i < parts.length; i++) {
        if (node === null || typeof node !== 'object') return undefined;
        node = node[parts[i]];
    }
    return node === undefined || node === null ? undefined : node;
}

// Best-effort translation of a sim's DYNAMICALLY COMPUTED readings/
// interpretation HTML (built inside compute()/dataLab.calculate()/
// customRender() from live numbers, so it can't be pre-translated as
// static content the way sim.hi's other fields are — see js/i18n_hi.js's
// header comment). Looks up an ordered list of [English, Hindi] literal
// substring pairs for this sim from READINGS_I18N_HI (declared by
// js/i18n_engine.js, populated per-sim-group by js/i18n_hi*.js, mirroring
// the QUIZ_BANK/SIM_I18N_HI population pattern) and applies them in order
// against the already-rendered English HTML — translating every reading
// LABEL and every static sentence fragment while leaving embedded numbers,
// ₹ amounts and other live-computed values untouched (a plain string
// substring replace never touches the digits/markup around it). Falls
// through to the original English HTML untouched when Hindi isn't active,
// this sim has no entry, or (defensively) something in the dictionary
// doesn't match — never blocks rendering.
function translateReadings(sim, html) {
    if (!html || typeof currentLang === 'undefined' || currentLang !== 'hi') return html;
    if (typeof READINGS_I18N_HI === 'undefined') return html;
    const pairs = READINGS_I18N_HI[sim.id];
    if (!Array.isArray(pairs)) return html;
    let out = html;
    pairs.forEach(([en, hi]) => {
        if (typeof en === 'string' && out.indexOf(en) !== -1) out = out.split(en).join(hi);
    });
    return out;
}

// Looks up a fixed (non-sim-specific) UI string from js/i18n_engine.js's
// I18N_HI dictionary when Hindi is active — used for the handful of
// hand-built HTML strings in this file/datalab-engine.js/explorer-engine.js
// that aren't simple textContent (so can't use index.html's data-i18n
// mechanism) but also aren't sim content (so don't belong in a sim's `hi`
// companion object either) — e.g. the controls panel's own header/hint/
// Reset button, and the auto-checked challenge's status line.
function tEngine(key, fallback) {
    if (typeof currentLang !== 'undefined' && currentLang === 'hi' && typeof I18N_HI !== 'undefined' && I18N_HI[key]) {
        return I18N_HI[key];
    }
    return fallback;
}

let simEngineState = {};
let prevSimEngineState = {};
let suppressNextWhatChanged = true;

function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
}

// ── "What changed?" (generic, works for every simulator control) ──
// Looks up a human label (and, for a `select` control, the option's
// display label rather than its raw value) so the diff line reads like
// "Consumer Income: 0 → 8", not "income: 0 → 8".
function controlMeta(sim, key) {
    if (!sim || !sim.controls) return null;
    return sim.controls.find(c => c.id === key) || null;
}

// A control's label, translated when its sim has a matching
// `hi.controls.<id>.label` entry (see js/i18n_hi.js), else its English label.
function controlLabel(sim, c) {
    return hiPath(sim, `controls.${c.id}.label`) || c.label;
}

function displayValue(sim, ctl, raw) {
    if (!ctl) return String(raw);
    if (ctl.type === 'select') {
        const opt = (ctl.options || []).find(o => String(o.value) === String(raw));
        if (!opt) return String(raw);
        return hiPath(sim, `controls.${ctl.id}.options.${opt.value}`) || opt.label;
    }
    return typeof raw === 'number' ? fmt(raw, Number.isInteger(raw) ? 0 : 2) : String(raw);
}

// Diffs `next` against `prev` using the sim's own control labels, and
// returns a short "🔄 What changed" line naming exactly the field(s) the
// student just touched. Returns '' when nothing differs (or on the very
// first render of a simulation, where "changed" has no meaning yet).
function describeWhatChanged(sim, prev, next) {
    if (!sim || !sim.controls || !sim.controls.length) return '';
    const changes = [];
    sim.controls.forEach(c => {
        const before = prev[c.id];
        const after = next[c.id];
        if (before === undefined || after === undefined) return;
        if (String(before) === String(after)) return;
        changes.push(`<b>${controlLabel(sim, c)}</b>: ${displayValue(sim, c, before)} → ${displayValue(sim, c, after)}`);
    });
    if (!changes.length) return '';
    return `<div class="reading-row whatchanged-row">🔄 <span>${tEngine('engine.whatChanged', 'What changed:')}</span> ${changes.join(', ')}</div>`;
}

// ── Practice checklist + auto-checked Challenge (generic, optional) ──
// A sim opts in by declaring `practice: [{prompt, hint?}, ...]` and/or
// `challenge: {prompt, check?(state, metrics) => boolean}`. Neither
// requires touching the rendering pipeline for other sims/modes.
function renderPractice(sim) {
    const card = document.getElementById('practice-card');
    const body = document.getElementById('practice-body');
    if (!card || !body) return;
    if (!sim.practice || !sim.practice.length) {
        card.classList.add('hidden');
        return;
    }
    card.classList.remove('hidden');
    body.innerHTML = sim.practice.map((p, i) => {
        const item = typeof p === 'string' ? { prompt: p } : p;
        const prompt = hiPath(sim, `practice.${i}.prompt`) || item.prompt;
        const hint = hiPath(sim, `practice.${i}.hint`) || item.hint;
        return `<details class="practice-item">
            <summary>${prompt}</summary>
            ${hint ? `<div class="practice-hint">💡 ${hint}</div>` : ''}
        </details>`;
    }).join('');
}

function renderChallengeShell(sim) {
    const card = document.getElementById('challenge-card');
    const body = document.getElementById('challenge-body');
    if (!card || !body) return;
    if (!sim.challenge) {
        card.classList.add('hidden');
        return;
    }
    card.classList.remove('hidden');
    const prompt = hiPath(sim, 'challenge.prompt') || sim.challenge.prompt;
    const initialStatus = sim.challenge.check
        ? tEngine('challenge.notYet', 'Not yet — keep adjusting the inputs.')
        : tEngine('challenge.workItOut', 'Work it out, then check your reasoning against the readings panel.');
    body.innerHTML = `<p class="challenge-prompt">${prompt}</p><div class="challenge-status" id="challenge-status">${initialStatus}</div>`;
}

function refreshChallenge(sim, metrics) {
    if (!sim.challenge || typeof sim.challenge.check !== 'function') return;
    const statusEl = document.getElementById('challenge-status');
    if (!statusEl) return;
    let solved;
    try {
        solved = !!sim.challenge.check(simEngineState, metrics || {});
    } catch {
        // A challenge.check() that throws (e.g. against a mid-edit,
        // momentarily-inconsistent state) just reads as "not solved yet".
        solved = false;
    }
    statusEl.textContent = solved
        ? tEngine('challenge.solved', '✅ Challenge complete — nice work!')
        : tEngine('challenge.notYet', 'Not yet — keep adjusting the inputs.');
    statusEl.classList.toggle('challenge-solved', solved);
}

function buildControls(sim) {
    const panel = document.getElementById('controls-panel');
    if (!panel) return;
    panel.innerHTML = '';

    if (!sim.controls || !sim.controls.length) {
        panel.innerHTML = `<p class="empty-hint">${tEngine('engine.noInputs', 'No adjustable inputs for this lab — explore the chart on the left.')}</p>`;
        return;
    }

    const header = document.createElement('div');
    header.className = 'controls-panel-header collapsible-header';
    header.dataset.panelKey = 'controls';
    header.setAttribute('role', 'button');
    header.setAttribute('tabindex', '0');
    header.innerHTML = `<span>${tEngine('engine.adjustVariables', '🎛️ Adjust the Variables')}</span>`;

    const hint = document.createElement('p');
    hint.className = 'controls-panel-hint';
    hint.textContent = tEngine('engine.controlsHint', 'Try your own numbers — drag a slider or type an exact value and watch the chart and readings update instantly. Great for self-paced or classroom what-if exploration.');

    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'reset-btn';
    resetBtn.innerHTML = tEngine('engine.reset', '↺ Reset');
    // Reset sits inside the same header that toggles collapse (a bigger,
    // more ergonomic click target than a chevron alone) — stop the click
    // from bubbling up and also toggling the panel collapsed/expanded.
    resetBtn.addEventListener('click', (e) => { e.stopPropagation(); });
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
    header.appendChild(resetBtn);
    const chevron = document.createElement('span');
    chevron.className = 'panel-chevron';
    chevron.setAttribute('aria-hidden', 'true');
    chevron.textContent = '⌄';
    header.appendChild(chevron);
    panel.appendChild(header);
    panel.appendChild(hint);
    if (typeof initPanelCollapse === 'function') initPanelCollapse(panel, header, 'controls', false);

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
            const label = controlLabel(sim, c);
            row.innerHTML = `
                <div class="control-label-row">
                    <label>${label}</label>
                </div>
                <div class="control-segmented" id="ctl-${c.id}" role="group" aria-label="${label}"></div>
            `;
            panel.appendChild(row);
            const group = row.querySelector('.control-segmented');
            c.options.forEach(opt => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'segmented-btn';
                btn.textContent = hiPath(sim, `controls.${c.id}.options.${opt.value}`) || opt.label;
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

        const label = controlLabel(sim, c);
        const unit = hiPath(sim, `controls.${c.id}.unit`) || c.unit;
        row.innerHTML = `
            <div class="control-label-row">
                <label for="ctl-${c.id}">${label}</label>
                ${unit ? `<span class="control-unit">${unit}</span>` : ''}
            </div>
            <div class="control-input-group">
                <input type="range" id="ctl-${c.id}" min="${c.min}" max="${c.max}" step="${c.step}" value="${c.value}">
                <input type="number" id="ctl-${c.id}-num" class="control-number" min="${c.min}" max="${c.max}" step="${c.step}" value="${c.value}" aria-label="${label} (${tEngine('engine.exactValue', 'exact value')})">
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

    // Snapshot the diff line BEFORE recording this render's state as
    // "previous" — it names exactly what the student just moved.
    const whatChangedHTML = suppressNextWhatChanged ? '' : describeWhatChanged(sim, prevSimEngineState, simEngineState);
    suppressNextWhatChanged = false;

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
        readingsBody.innerHTML = whatChangedHTML + translateReadings(sim, result.readings || '');
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
    if (Array.isArray(result.formulas)) {
        const formulaBody = document.getElementById('formula-body');
        if (formulaBody) {
            formulaBody.innerHTML = result.formulas.map(f => `<div class="formula-line">${translateReadings(sim, f)}</div>`).join('');
        }
    }

    refreshChallenge(sim, result.metrics);
    prevSimEngineState = Object.assign({}, simEngineState);
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
        const tagText = (typeof chapterTagText === 'function' && chapterTagText(sim)) || sim.chapter || '';
        const chapterTag = tagText ? `<div class="chapter-tag">📘 ${tagText}</div>` : '';
        const modeBadge = sim.mode && sim.mode !== 'simulator'
            ? `<div class="mode-badge mode-badge--${sim.mode}">${sim.mode === 'datalab' ? tEngine('engine.dataLabBadge', '📊 Data Lab') : tEngine('engine.explorerBadge', '🧭 Concept Explorer')}</div>`
            : '';
        const enrichmentNote = hiPath(sim, 'enrichmentNote') || sim.enrichmentNote || '';
        const enrichmentTag = sim.enrichment
            ? `<div class="enrichment-tag" title="${enrichmentNote.replace(/"/g, '&quot;')}">${tEngine('engine.enrichmentTag', '✨ Enrichment — beyond the 2026–27 unit list for this topic')}</div>`
            : '';
        const concept = hiPath(sim, 'concept') || sim.concept || '';
        conceptBody.innerHTML = chapterTag + modeBadge + enrichmentTag + concept;
    }
    if (formulaBody) {
        const formulas = hiPath(sim, 'formulas') || sim.formulas || [];
        formulaBody.innerHTML = formulas
            .map(f => `<div class="formula-line">${f}</div>`)
            .join('');
    }
    // Charts render into #sim-dom-overlay via Plotly; the raw canvas
    // underneath isn't used by any simulation, so keep it out of the way.
    if (canvas) canvas.style.display = 'none';

    simEngineState = {};
    prevSimEngineState = {};
    suppressNextWhatChanged = true;
    renderPractice(sim);
    renderChallengeShell(sim);

    if (sim.mode === 'datalab' && typeof renderDataLab === 'function') {
        const panel = document.getElementById('controls-panel');
        if (panel) panel.innerHTML = '';
        renderDataLab(sim, overlay);
    } else if (sim.mode === 'explorer' && typeof renderExplorer === 'function') {
        const panel = document.getElementById('controls-panel');
        if (panel) panel.innerHTML = '';
        renderExplorer(sim, overlay);
    } else {
        buildControls(sim);
        renderSimChart(sim);
    }
}
