// ══════════════════════════════════════════════════════════════
// TRANSITION LAYER — the shared "cause → effect" half of the loop.
//
// Why this file exists:
// js/sim-engine.js's renderSimChart() used to remember only the previous
// CONTROL state (prevSimEngineState) and throw the model's own output
// (compute()'s traces + metrics) away after one render. So the app could
// say "you changed Consumer Income 0 → 8" but never "…which moved
// equilibrium price ₹60 → ₹55": it had the cause and had destroyed the
// effect. Every before/after visual in the app before this layer existed
// (micro-supply-demand's baseline curves, macro-multiplier's old/new
// equilibrium markers) was a per-sim hand re-derivation of a previous
// state the engine already had and dropped.
//
// Retaining one object — the previous compute() result — turns that into
// a shared capability, with no per-sim code:
//
//   1. diffMetrics()      the EFFECT half of the causal chain: which
//                         economic quantities moved, by how much, which way.
//   2. buildGhostTraces() the previous geometry of ONLY the curves that
//                         actually moved, drawn dimmed underneath the new
//                         ones. Curves that did not move get no ghost —
//                         which is the movement-vs-shift distinction
//                         (what moved vs what stayed put) generalised to
//                         every simulator-mode sim for free, derived from
//                         the model rather than authored per sim.
//
// Everything here reads the model's own output. Nothing in this file
// contains economic logic of its own, and nothing here positions anything
// by pixel: a ghost curve's coordinates ARE the previous compute()'s
// coordinates. See docs/economics/visual-audit.md.
// ══════════════════════════════════════════════════════════════

// A metric is only worth naming as an "effect" if it is a finite number
// that actually moved. Mode/flag metrics (sector, view, isCeiling,
// gapType…) are strings/booleans and fall out here automatically.
function isReportableMetric(value) {
    return typeof value === 'number' && isFinite(value);
}

// Standard CBSE economics abbreviations, shared rather than redeclared on
// every sim that uses them — `sd`/`cv`/`mrt` mean the same thing in every
// chapter they appear in. Deliberately excludes ambiguous single letters
// (P, Q, X, Y, k, n): `P` is a price in Market Structures and an exchange
// rate in the Forex lab, so those must be named by the sim that owns the
// meaning, via `metricLabels`, or left to humanise.
const ECON_METRIC_LABELS = {
    Ed: 'Price Elasticity of Demand (Ed)',
    Ey: 'Income Elasticity (Ey)',
    Exy: 'Cross Elasticity (Exy)',
    Es: 'Elasticity of Supply (Es)',
    mrt: 'Opportunity Cost (MRT)',
    mrs: 'Marginal Rate of Substitution (MRS)',
    MU: 'Marginal Utility (MU)',
    TU: 'Total Utility (TU)',
    AC: 'Average Cost (AC)',
    MC: 'Marginal Cost (MC)',
    TP: 'Total Product (TP)',
    AP: 'Average Product (AP)',
    MP: 'Marginal Product (MP)',
    TR: 'Total Revenue (TR)',
    TC: 'Total Cost (TC)',
    sd: 'Standard Deviation',
    cv: 'Coefficient of Variation',
    qd: 'Quartile Deviation',
    gini: 'Gini Coefficient',
    headcount: 'Headcount Ratio',
    Ystar: 'Equilibrium Income (Y*)',
    Yfe: 'Full-Employment Income (Yfe)',
    gapSize: 'Output Gap',
    multiplier: 'Money Multiplier',
    pearsonR: "Karl Pearson's r",
    spearmanR: "Spearman's Rank r"
};

// `equilibriumPrice` → `Equilibrium Price`. Deliberately the last resort,
// after a sim's own `metricLabels` and the shared glossary above, so the
// layer still works on every simulator-mode sim with zero per-sim
// authoring.
function humaniseMetricKey(key) {
    const spaced = String(key)
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        .replace(/[_-]+/g, ' ')
        .trim();
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function metricLabel(sim, key) {
    const declared = sim && sim.metricLabels && sim.metricLabels[key];
    if (declared) return hiPath(sim, `metricLabels.${key}`) || declared;
    return ECON_METRIC_LABELS[key] || humaniseMetricKey(key);
}

// Relative move, used only to rank which effects are worth showing when a
// single control change moves many metrics at once. Scale-free so a
// metric measured in ₹billions doesn't always outrank one measured as a
// ratio.
function relativeChange(before, after) {
    const denom = Math.max(Math.abs(before), Math.abs(after), 1e-9);
    return Math.abs(after - before) / denom;
}

// The EFFECT half of the causal chain. Returns at most `limit` entries,
// most-moved first, so a sim with a dozen metrics reports the three the
// student's change actually drove rather than a wall of numbers.
function diffMetrics(sim, prevMetrics, nextMetrics, limit, echoedControlIds) {
    if (!prevMetrics || !nextMetrics) return [];
    const echoes = echoedControlIds || [];
    const out = [];
    Object.keys(nextMetrics).forEach(key => {
        const before = prevMetrics[key];
        const after = nextMetrics[key];
        if (!isReportableMetric(before) || !isReportableMetric(after)) return;
        if (before === after) return;
        // A metric that simply mirrors the control the student just moved
        // is the cause restated, not an effect — reporting "Consumption
        // 90 → 130" as the *result* of moving the Consumption slider is
        // circular. Metrics the student did NOT touch stay in, even when
        // some other control shares the name: a model forcing wages to
        // follow consumption (the Y = C identity) is a real effect, and
        // one of the more interesting ones.
        if (echoes.indexOf(key) !== -1) return;
        // A change far below display precision is one the student cannot
        // see in the readings either — reporting it as an "effect" would
        // be noise that looks like a bug.
        if (relativeChange(before, after) < 0.0005) return;
        out.push({
            key,
            label: metricLabel(sim, key),
            before,
            after,
            rose: after > before,
            rank: relativeChange(before, after)
        });
    });
    out.sort((a, b) => b.rank - a.rank);
    return out.slice(0, limit || 3);
}

function formatMetricValue(value) {
    const decimals = Number.isInteger(value) ? 0 : 2;
    return typeof fmt === 'function' ? fmt(value, decimals) : String(value);
}

// Renders the effect half only — sim-engine.js already renders the cause
// half (describeWhatChanged) and owns the ordering of the two rows.
function describeEffects(sim, changes) {
    if (!changes || !changes.length) return '';
    const parts = changes.map(c => {
        const arrow = c.rose ? '▲' : '▼';
        const dirClass = c.rose ? 'effect-up' : 'effect-down';
        return `<span class="causal-effect ${dirClass}"><b>${c.label}</b> ${formatMetricValue(c.before)} → ${formatMetricValue(c.after)} ${arrow}</span>`;
    });
    return `<div class="reading-row causal-row">⚡ <span>${tEngine('engine.resultingEffect', 'Resulting effect:')}</span> ${parts.join(' · ')}</div>`;
}

// ── Ghost geometry ────────────────────────────────────────────────
// A trace is ghostable only if it draws a CURVE. Bars, single markers and
// reference/annotation traces either have no meaningful "previous shape"
// or turn into visual clutter when doubled.
function isGhostableTrace(trace) {
    if (!trace || trace.type === 'bar') return false;
    if (!Array.isArray(trace.y) || trace.y.length < 3) return false;
    return typeof trace.mode === 'string' && trace.mode.indexOf('lines') !== -1;
}

// Did this curve actually move, by enough to see? Normalised against the
// curve's own y-range so the test means the same thing for a curve
// measured in rupees and one measured in utils.
function traceMoved(prevTrace, nextTrace) {
    const a = prevTrace.y, b = nextTrace.y;
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return true;
    let maxDelta = 0, lo = Infinity, hi = -Infinity;
    for (let i = 0; i < a.length; i++) {
        const av = a[i], bv = b[i];
        if (typeof av !== 'number' || typeof bv !== 'number' || !isFinite(av) || !isFinite(bv)) continue;
        maxDelta = Math.max(maxDelta, Math.abs(bv - av));
        lo = Math.min(lo, av, bv);
        hi = Math.max(hi, av, bv);
    }
    const span = (hi - lo) || Math.max(Math.abs(hi), 1e-9);
    return maxDelta / span > 0.005;
}

// The previous positions of only the curves that moved, restyled as
// subordinate "where this was a moment ago" geometry. Coordinates are the
// previous compute()'s own x/y arrays — never re-derived, never nudged.
function buildGhostTraces(prevTraces, nextTraces) {
    if (!Array.isArray(prevTraces) || !Array.isArray(nextTraces)) return [];
    const ghosts = [];
    nextTraces.forEach((nextTrace, i) => {
        // Pair by name first (a sim may add/remove traces between renders,
        // e.g. the price-control gap bracket appearing), falling back to
        // index only when the names genuinely match nothing.
        let prevTrace = prevTraces.find(t => t.name && nextTrace.name && t.name === nextTrace.name);
        if (!prevTrace && !nextTrace.name) prevTrace = prevTraces[i];
        if (!prevTrace) return;
        if (!isGhostableTrace(prevTrace) || !isGhostableTrace(nextTrace)) return;
        if (!traceMoved(prevTrace, nextTrace)) return;

        const ghost = {
            x: prevTrace.x,
            y: prevTrace.y,
            mode: 'lines',
            type: prevTrace.type,
            hoverinfo: 'skip',
            showlegend: false,
            name: `${nextTrace.name || ''} (before)`,
            line: {
                color: (prevTrace.line && prevTrace.line.color) || '#94a3b8',
                width: 1.5,
                dash: 'dot'
            },
            opacity: 0.4
        };
        if (prevTrace.yaxis) ghost.yaxis = prevTrace.yaxis;
        ghosts.push(ghost);
    });
    return ghosts;
}
