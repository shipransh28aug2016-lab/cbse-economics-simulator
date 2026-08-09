// ══════════════════════════════════════════════════════════════
// Shared simulation engine.
// Each entry in SIMS carries its own `controls` (slider definitions)
// and `compute(values)` function returning Plotly traces/layout plus
// a readings HTML string. This file only supplies small math helpers
// and the generic rendering plumbing shared by every simulation.
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

const PLOTLY_DEFAULT_LAYOUT = {
    margin: { t: 20, r: 30, b: 45, l: 55 },
    font: { family: 'Inter, sans-serif', size: 11, color: '#111827' },
    paper_bgcolor: '#ffffff',
    plot_bgcolor: '#ffffff',
    showlegend: true,
    legend: { orientation: 'h', y: -0.25 }
};

let simEngineState = {};

function buildControls(sim) {
    const panel = document.getElementById('controls-panel');
    if (!panel) return;
    panel.innerHTML = '';

    if (!sim.controls || !sim.controls.length) {
        panel.innerHTML = '<p class="empty-hint">No adjustable inputs for this lab — explore the chart on the left.</p>';
        return;
    }

    sim.controls.forEach(c => {
        simEngineState[c.id] = c.value;

        const row = document.createElement('div');
        row.className = 'control-row';
        row.innerHTML = `
            <div class="control-label-row">
                <label for="ctl-${c.id}">${c.label}</label>
                <span class="control-value" id="ctl-${c.id}-val">${c.value}${c.unit || ''}</span>
            </div>
            <input type="range" id="ctl-${c.id}" min="${c.min}" max="${c.max}" step="${c.step}" value="${c.value}">
        `;
        panel.appendChild(row);

        const input = row.querySelector('input');
        input.addEventListener('input', () => {
            const v = parseFloat(input.value);
            simEngineState[c.id] = v;
            const valLabel = row.querySelector('.control-value');
            if (valLabel) valLabel.textContent = `${v}${c.unit || ''}`;
            renderSimChart(sim);
        });
    });
}

function renderSimChart(sim) {
    const overlay = document.getElementById('sim-dom-overlay');
    const readingsBody = document.getElementById('readings-body');
    if (!overlay || typeof sim.compute !== 'function') return;

    const result = sim.compute(simEngineState);
    const layout = Object.assign({}, PLOTLY_DEFAULT_LAYOUT, result.layout || {});

    if (typeof Plotly !== 'undefined') {
        Plotly.react(overlay, result.traces || [], layout, { displayModeBar: false, responsive: true });
    }

    if (readingsBody) {
        readingsBody.innerHTML = result.readings || '';
    }
}

function renderSim(sim) {
    const conceptBody = document.getElementById('concept-body');
    const formulaBody = document.getElementById('formula-body');
    const canvas = document.getElementById('sim-canvas');

    if (conceptBody) conceptBody.innerHTML = sim.concept || '';
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
