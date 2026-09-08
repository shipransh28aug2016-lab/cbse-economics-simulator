// ══════════════════════════════════════════════════════════════
// GRAPH LAB engine — `mode: 'graphlab'`.
//
// Why this exists (and why it isn't Plotly):
// The CBSE / Sandeep Garg textbook diagram is a *specific visual genre* —
// black axes with arrowheads and an "O" origin, curves labelled DD / SS /
// D₁D₁ at their far end, an equilibrium point with DOTTED projection lines
// down to OP and OQ on the axes, and labelled arrows naming the movement
// ("Expansion") or the shift ("Increase in Demand"). Plotly draws data;
// it does not draw that. So Graph Labs render hand-built SVG that matches
// the book, and — the part no chart library gives you — let the student
// GRAB the curve or the point and move it, which is the only way the
// movement-vs-shift distinction ever actually lands.
//
// A sim opts in with `mode: 'graphlab'` and a `graphLab` config:
//   graphLab: {
//     x: { label, min, max },      // data-space bounds of the plot area
//     y: { label, min, max },
//     vars: [{ id, label, min, max, step, value, unit?, group?, hint? }],
//     groupLabels: { price?, other? },   // headings for the two chip groups;
//         // defaults name the movement-vs-shift distinction, which only the
//         // demand/supply/market labs actually mean — everything else should
//         // say what ITS two groups of variables really are.
//         // `group: 'price'` marks an OWN-PRICE variable (its change causes a
//         // MOVEMENT along the curve); anything else is a non-price
//         // determinant (its change causes a SHIFT). The verdict engine and
//         // the variable strip both colour-code on this.
//     model(v) => {
//       curves:  [{ id, label, pts:[[x,y],…], color, dash?, width?, labelAt? }],
//       points:  [{ id, x, y, label?, color?, drop?, sub? }],
//       arrows:  [{ from:[x,y], to:[x,y], label?, color?, bend?, labelDx?, labelDy? }],
//       handles: [{ id, x, y, bind, axis:'x'|'y', k?, invert?, shape?, hint? }],
//       verdict: { kind, title, detail },   // rendered under the graph
//       readings:[{ label, value }] | 'html',
//       formulas:[…]?, metrics:{}?
//     },
//     predict?: true   // opt-in PREDICT gate (see glOpenPredictGate below):
//         // clicking a scenario preset asks the student to guess
//         // verdict.kind (none/movement/shift/both) BEFORE it applies,
//         // rather than applying it immediately. Requires `scenarios` to
//         // be declared too — it has nothing to gate otherwise. Direct
//         // handle-dragging is never gated (that stays instant, per the
//         // tested drag contract every Graph Lab relies on).
//   }
//
// A `handle` is the draggable affordance. Dragging it along `axis` by Δ data
// units writes `vars[bind] = start + Δ/k` (k = data units per one unit of the
// bound variable; `invert` flips the sign), clamped to that var's min/max and
// snapped to its step. That one rule covers every drag in every Graph Lab —
// dragging a whole curve sideways (shift), dragging a point along a curve
// (movement), dragging an intercept, dragging a budget line. No per-sim
// drag code.
//
// Renders into the same #sim-dom-overlay / #readings-body surfaces as the
// simulator and Data Lab engines, so a Graph Lab is the same app. The
// variable strip is deliberately rendered INSIDE the graph shell, directly
// below the diagram, as a compact horizontal chip row — not as the tall
// stacked slider column in #controls-panel, which pushed the diagram off
// screen. See CLAUDE.md.
// ══════════════════════════════════════════════════════════════

const GL_PAD = { t: 26, r: 92, b: 62, l: 78 };
const GL_W = 880;
const GL_H = 430;

let glState = {};
let glPrevState = {};
let glSim = null;
let glDrag = null;
let glSnapshot = null;      // "before" state, for the ghost/original curve
let glShowGhost = true;

function glVar(sim, id) {
    return (sim.graphLab.vars || []).find(v => v.id === id) || null;
}

function glClamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

function glSnap(val, step) {
    if (!step) return val;
    const s = Math.round(val / step) * step;
    // Kill float dust like 3.0000000000000004 that would otherwise show
    // up in a reading or a "what changed" line.
    const dec = (String(step).split('.')[1] || '').length;
    return parseFloat(s.toFixed(dec));
}

// A graphLab string field, translated when the sim carries a matching
// `hi.graphLab.…` entry (same mechanism as hiPath elsewhere), else English.
function glT(path, fallback) {
    if (typeof hiPath !== 'function') return fallback;
    return hiPath(glSim, `graphLab.${path}`) || fallback;
}

// ── data-space ⇄ svg-space ────────────────────────────────────
function glScales(cfg) {
    const xw = (cfg.x.max - cfg.x.min) || 1;
    const yw = (cfg.y.max - cfg.y.min) || 1;
    const pw = GL_W - GL_PAD.l - GL_PAD.r;
    const ph = GL_H - GL_PAD.t - GL_PAD.b;
    return {
        sx: x => GL_PAD.l + ((x - cfg.x.min) / xw) * pw,
        sy: y => GL_PAD.t + ph - ((y - cfg.y.min) / yw) * ph,
        // Inverse — used by the drag handler to turn a pixel delta back
        // into a delta in the units the student is actually reasoning about.
        ix: px => cfg.x.min + ((px - GL_PAD.l) / pw) * xw,
        iy: py => cfg.y.min + ((GL_PAD.t + ph - py) / ph) * yw,
        pw, ph
    };
}

function glEsc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ── SVG pieces, in the textbook's own visual language ─────────
function glAxes(cfg, s) {
    const x0 = s.sx(cfg.x.min), y0 = s.sy(cfg.y.min);
    const xEnd = GL_W - GL_PAD.r + 26, yEnd = GL_PAD.t - 14;
    return `
    <line class="gl-axis" x1="${x0}" y1="${y0}" x2="${xEnd}" y2="${y0}" marker-end="url(#gl-axis-arrow)"></line>
    <line class="gl-axis" x1="${x0}" y1="${y0}" x2="${x0}" y2="${yEnd}" marker-end="url(#gl-axis-arrow)"></line>
    <text class="gl-origin" x="${x0 - 13}" y="${y0 + 17}">O</text>
    <text class="gl-axis-title" x="${(x0 + xEnd) / 2}" y="${y0 + 44}" text-anchor="middle">${glEsc(cfg.x.label)}</text>
    <text class="gl-axis-title" x="${x0 - 50}" y="${(y0 + yEnd) / 2}" text-anchor="middle"
          transform="rotate(-90 ${x0 - 50} ${(y0 + yEnd) / 2})">${glEsc(cfg.y.label)}</text>`;
}

function glCurve(c, s) {
    const pts = (c.pts || []).filter(p => isFinite(p[0]) && isFinite(p[1]));
    if (pts.length < 2) return '';
    const d = pts.map((p, i) => `${i ? 'L' : 'M'} ${s.sx(p[0]).toFixed(1)} ${s.sy(p[1]).toFixed(1)}`).join(' ');
    const last = pts[pts.length - 1];
    const at = c.labelAt === 'start' ? pts[0] : last;
    const lx = s.sx(at[0]) + (c.labelDx || 8);
    const ly = s.sy(at[1]) + (c.labelDy || -6);
    const dash = c.dash ? ` stroke-dasharray="${c.dash}"` : '';
    const label = c.label
        ? `<text class="gl-curve-label" x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" fill="${c.color}">${glEsc(c.label)}</text>` : '';
    return `<path class="gl-curve" d="${d}" stroke="${c.color}" stroke-width="${c.width || 2.8}"${dash}
             opacity="${c.opacity == null ? 1 : c.opacity}"></path>${label}`;
}

// The equilibrium/reference point plus its dotted drop-lines to both
// axes and the OP / OQ readings on the axes themselves — the single most
// recognisable feature of a textbook economics diagram, and the thing
// students are asked to reproduce in the exam.
function glPoint(p, s, cfg) {
    const px = s.sx(p.x), py = s.sy(p.y);
    const x0 = s.sx(cfg.x.min), y0 = s.sy(cfg.y.min);
    const col = p.color || '#1e1b3a';
    let out = '';
    if (p.drop !== false) {
        out += `<line class="gl-drop" x1="${px}" y1="${py}" x2="${x0}" y2="${py}" stroke="${col}"></line>
                <line class="gl-drop" x1="${px}" y1="${py}" x2="${px}" y2="${y0}" stroke="${col}"></line>`;
        if (p.yTick !== false) out += `<text class="gl-tick" x="${x0 - 8}" y="${py + 4}" text-anchor="end" fill="${col}">${glEsc(p.yTick || p.y)}</text>`;
        if (p.xTick !== false) out += `<text class="gl-tick" x="${px}" y="${y0 + 17}" text-anchor="middle" fill="${col}">${glEsc(p.xTick || p.x)}</text>`;
    }
    out += `<circle class="gl-point" cx="${px}" cy="${py}" r="5.2" fill="${col}"></circle>`;
    if (p.label) out += `<text class="gl-point-label" x="${px + (p.labelDx || 9)}" y="${py + (p.labelDy || -9)}" fill="${col}">${glEsc(p.label)}</text>`;
    if (p.sub) out += `<text class="gl-point-sub" x="${px + (p.labelDx || 9)}" y="${py + (p.labelDy || -9) + 13}" fill="${col}">${glEsc(p.sub)}</text>`;
    return out;
}

// A labelled arrow — used for BOTH "this curve shifted right" and
// "you moved along the curve", which is exactly the pair of ideas the
// syllabus asks students to tell apart.
function glArrow(a, s) {
    const x1 = s.sx(a.from[0]), y1 = s.sy(a.from[1]);
    const x2 = s.sx(a.to[0]), y2 = s.sy(a.to[1]);
    const col = a.color || '#6d28d9';
    const bend = a.bend || 0;
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    const cx = mx + (-dy / len) * bend, cy = my + (dx / len) * bend;
    const d = bend ? `M ${x1} ${y1} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${x2} ${y2}` : `M ${x1} ${y1} L ${x2} ${y2}`;
    const id = 'gl-arrow-' + col.replace(/[^a-z0-9]/gi, '');
    let out = `<path class="gl-arrowline" d="${d}" stroke="${col}" marker-end="url(#${id})"></path>`;
    if (a.label) {
        const lx = (bend ? cx : mx) + (a.labelDx || 0);
        const ly = (bend ? cy : my) + (a.labelDy == null ? -9 : a.labelDy);
        const w = String(a.label).length * 5.6 + 14;
        out += `<g transform="translate(${lx.toFixed(1)},${ly.toFixed(1)})">
            <rect class="gl-arrow-chip" x="${(-w / 2).toFixed(1)}" y="-9" width="${w.toFixed(1)}" height="18" rx="9" stroke="${col}"></rect>
            <text class="gl-arrow-text" x="0" y="4" text-anchor="middle" fill="${col}">${glEsc(a.label)}</text></g>`;
    }
    return out;
}

// The grab target. Deliberately larger than it looks (an invisible fat
// hit-circle under a small visible ring) so it works with a finger on a
// phone, not just a mouse.
function glHandle(h, s) {
    const px = s.sx(h.x), py = s.sy(h.y);
    const col = h.color || '#7c3aed';
    const cls = 'gl-handle' + (h.axis === 'y' ? ' gl-handle--y' : ' gl-handle--x');
    return `<g class="${cls}" data-handle="${glEsc(h.id)}" tabindex="0" role="slider"
               aria-label="${glEsc(h.hint || h.id)}" transform="translate(${px.toFixed(1)},${py.toFixed(1)})">
        <circle class="gl-handle-hit" r="24"></circle>
        <circle class="gl-handle-halo" r="13" stroke="${col}"></circle>
        <circle class="gl-handle-dot" r="7" fill="${col}"></circle>
        <path class="gl-handle-grip" d="${h.axis === 'y' ? 'M0,-4 L0,4 M-3.5,-1.5 L0,-5 L3.5,-1.5 M-3.5,1.5 L0,5 L3.5,1.5' : 'M-4,0 L4,0 M-1.5,-3.5 L-5,0 L-1.5,3.5 M1.5,-3.5 L5,0 L1.5,3.5'}"></path>
    </g>`;
}

function glDefs() {
    const cols = ['#6d28d9', '#7c3aed', '#dc2626', '#16a34a', '#2563eb', '#ea580c', '#0891b2', '#1e1b3a', '#db2777'];
    const markers = cols.map(c => {
        const id = 'gl-arrow-' + c.replace(/[^a-z0-9]/gi, '');
        return `<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="${c}"></path></marker>`;
    }).join('');
    return `<defs>${markers}
        <marker id="gl-axis-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#1e1b3a"></path></marker>
    </defs>`;
}

// ── the verdict banner ────────────────────────────────────────
// The whole point of the Graph Lab: name, in the textbook's own words,
// what the student just did to the diagram.
const GL_VERDICT_TONE = {
    movement: '#2563eb', shift: '#dc2626', both: '#7c3aed', none: '#64748b'
};

function glVerdictHTML(verdict) {
    if (!verdict) return '';
    const tone = GL_VERDICT_TONE[verdict.kind] || GL_VERDICT_TONE.none;
    const chips = (verdict.chips || []).map(c =>
        `<span class="gl-verdict-chip" style="border-color:${tone};color:${tone}">${glEsc(c)}</span>`).join('');
    return `<div class="gl-verdict gl-verdict--${glEsc(verdict.kind || 'none')}" style="--gl-tone:${tone}">
        <div class="gl-verdict-head"><span class="gl-verdict-title">${verdict.title}</span>${chips}</div>
        ${verdict.detail ? `<div class="gl-verdict-detail">${verdict.detail}</div>` : ''}
    </div>`;
}

// ── the variable strip (below the graph, not beside it) ───────
// One compact chip per variable. Each chip is BOTH a slider and a
// horizontal scrub target: press anywhere on the chip's track and drag.
// `group: 'price'` chips are tinted as own-price (⇒ movement) and the
// rest as non-price determinants (⇒ shift), so the cause of what the
// student is about to see is colour-coded before they even move it.
function glRenderVarStrip(sim, host) {
    const vars = sim.graphLab.vars || [];
    if (!vars.length) { host.innerHTML = ''; return; }

    // The movement-vs-shift wording is right for the demand/supply/market
    // labs and actively WRONG for the others (nothing "moves along a curve"
    // when you drag Y_F on an AD–AS diagram), so any lab can name its own
    // two groups via `graphLab.groupLabels`.
    const custom = sim.graphLab.groupLabels || {};
    const groups = [
        { key: 'price', label: glT('groupLabels.price', custom.price || tEngine('gl.ownPrice', 'Own Price → movement ALONG the curve')) },
        { key: 'other', label: glT('groupLabels.other', custom.other || tEngine('gl.nonPrice', 'Other determinants → SHIFT of the curve')) }
    ];

    host.innerHTML = groups.map(g => {
        const list = vars.filter(v => (v.group === 'price' ? 'price' : 'other') === g.key);
        if (!list.length) return '';
        return `<div class="gl-var-group gl-var-group--${g.key}">
            <div class="gl-var-group-label">${glEsc(g.label)}</div>
            <div class="gl-var-chips">${list.map(v => glVarChip(sim, v)).join('')}</div>
        </div>`;
    }).join('');

    vars.forEach(v => glWireChip(sim, host, v));
}

function glVarChip(sim, v) {
    const val = glState[v.id];
    const label = hiPath(sim, `graphLab.vars.${v.id}.label`) || v.label;
    const unit = hiPath(sim, `graphLab.vars.${v.id}.unit`) || v.unit || '';
    const pct = ((val - v.min) / ((v.max - v.min) || 1)) * 100;
    return `<div class="gl-chip" id="gl-chip-${glEsc(v.id)}" data-var="${glEsc(v.id)}" title="${glEsc(v.hint || label)}">
        <div class="gl-chip-top">
            <span class="gl-chip-label">${glEsc(label)}</span>
            <span class="gl-chip-val" id="gl-val-${glEsc(v.id)}">${glFmtVar(val, v)}<em>${glEsc(unit)}</em></span>
        </div>
        <div class="gl-chip-track" data-track="${glEsc(v.id)}">
            <div class="gl-chip-fill" id="gl-fill-${glEsc(v.id)}" style="width:${pct.toFixed(1)}%"></div>
            <div class="gl-chip-knob" id="gl-knob-${glEsc(v.id)}" style="left:${pct.toFixed(1)}%"
                 role="slider" tabindex="0" aria-label="${glEsc(label)}"
                 aria-valuemin="${v.min}" aria-valuemax="${v.max}" aria-valuenow="${val}"></div>
        </div>
    </div>`;
}

function glFmtVar(val, v) {
    const dec = (String(v.step || 1).split('.')[1] || '').length;
    const s = Number(val).toFixed(dec);
    return (v.signed && val > 0 ? '+' : '') + s;
}

function glSetVar(id, value, opts) {
    const v = glVar(glSim, id);
    if (!v) return;
    const next = glSnap(glClamp(value, v.min, v.max), v.step);
    if (next === glState[id]) return;
    glState[id] = next;
    glRender(glSim, (opts && opts.silent) !== true);
}

// Keeps a chip's own readout in sync while the student is dragging the
// GRAPH (not the chip) — the two are the same variable seen two ways.
function glSyncChip(v) {
    const val = glState[v.id];
    const pct = ((val - v.min) / ((v.max - v.min) || 1)) * 100;
    const fill = document.getElementById(`gl-fill-${v.id}`);
    const knob = document.getElementById(`gl-knob-${v.id}`);
    const out = document.getElementById(`gl-val-${v.id}`);
    if (fill) fill.style.width = pct.toFixed(1) + '%';
    if (knob) { knob.style.left = pct.toFixed(1) + '%'; knob.setAttribute('aria-valuenow', String(val)); }
    if (out) out.innerHTML = `${glFmtVar(val, v)}<em>${glEsc(hiPath(glSim, `graphLab.vars.${v.id}.unit`) || v.unit || '')}</em>`;
}

function glWireChip(sim, host, v) {
    const track = host.querySelector(`[data-track="${v.id}"]`);
    const knob = document.getElementById(`gl-knob-${v.id}`);
    if (!track) return;

    const fromClientX = clientX => {
        const r = track.getBoundingClientRect();
        const t = glClamp((clientX - r.left) / (r.width || 1), 0, 1);
        return v.min + t * (v.max - v.min);
    };

    let scrubbing = false;
    const down = e => {
        scrubbing = true;
        track.setPointerCapture && track.setPointerCapture(e.pointerId);
        glSetVar(v.id, fromClientX(e.clientX));
        e.preventDefault();
    };
    const move = e => { if (scrubbing) glSetVar(v.id, fromClientX(e.clientX)); };
    const up = e => {
        scrubbing = false;
        if (track.releasePointerCapture && e.pointerId != null) {
            try { track.releasePointerCapture(e.pointerId); } catch { /* capture already gone */ }
        }
    };
    track.addEventListener('pointerdown', down);
    track.addEventListener('pointermove', move);
    track.addEventListener('pointerup', up);
    track.addEventListener('pointercancel', up);

    if (knob) {
        knob.addEventListener('keydown', e => {
            const step = e.shiftKey ? v.step * 5 : v.step;
            if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { glSetVar(v.id, glState[v.id] + step); e.preventDefault(); }
            else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { glSetVar(v.id, glState[v.id] - step); e.preventDefault(); }
            else if (e.key === 'Home') { glSetVar(v.id, v.min); e.preventDefault(); }
            else if (e.key === 'End') { glSetVar(v.id, v.max); e.preventDefault(); }
        });
    }
}

// ── dragging the graph itself ─────────────────────────────────
function glPointerToData(svg, evt, s) {
    const pt = svg.createSVGPoint ? svg.createSVGPoint() : null;
    if (pt && svg.getScreenCTM()) {
        pt.x = evt.clientX; pt.y = evt.clientY;
        const loc = pt.matrixTransform(svg.getScreenCTM().inverse());
        return { x: s.ix(loc.x), y: s.iy(loc.y) };
    }
    // Fallback for environments without full SVG CTM support: scale the
    // bounding box against the fixed viewBox.
    const r = svg.getBoundingClientRect();
    const ux = ((evt.clientX - r.left) / (r.width || 1)) * GL_W;
    const uy = ((evt.clientY - r.top) / (r.height || 1)) * GL_H;
    return { x: s.ix(ux), y: s.iy(uy) };
}

function glWireHandles(svg, handles, s) {
    handles.forEach(h => {
        const el = svg.querySelector(`[data-handle="${h.id}"]`);
        if (!el) return;

        const begin = e => {
            const d = glPointerToData(svg, e, s);
            glDrag = {
                handle: h,
                start: h.axis === 'y' ? d.y : d.x,
                startVar: glState[h.bind]
            };
            el.classList.add('gl-handle--active');
            svg.classList.add('gl-dragging');
            el.setPointerCapture && el.setPointerCapture(e.pointerId);
            e.preventDefault();
        };
        const move = e => {
            if (!glDrag || glDrag.handle.id !== h.id) return;
            const d = glPointerToData(svg, e, s);
            const delta = (h.axis === 'y' ? d.y : d.x) - glDrag.start;
            const k = h.k == null ? 1 : h.k;
            const next = glDrag.startVar + (h.invert ? -delta : delta) / (k || 1);
            glSetVar(h.bind, next);
            e.preventDefault();
        };
        const end = e => {
            if (!glDrag || glDrag.handle.id !== h.id) return;
            glDrag = null;
            el.classList.remove('gl-handle--active');
            svg.classList.remove('gl-dragging');
            if (el.releasePointerCapture && e && e.pointerId != null) {
                try { el.releasePointerCapture(e.pointerId); } catch { /* capture already gone */ }
            }
        };

        el.addEventListener('pointerdown', begin);
        el.addEventListener('pointermove', move);
        el.addEventListener('pointerup', end);
        el.addEventListener('pointercancel', end);
        el.addEventListener('keydown', e => {
            const v = glVar(glSim, h.bind);
            if (!v) return;
            const step = (e.shiftKey ? 5 : 1) * v.step;
            const fwd = e.key === 'ArrowRight' || e.key === 'ArrowUp';
            const back = e.key === 'ArrowLeft' || e.key === 'ArrowDown';
            if (!fwd && !back) return;
            const dir = (fwd ? 1 : -1) * (h.invert ? -1 : 1) * (h.axis === 'y' && back ? 1 : 1);
            glSetVar(h.bind, glState[h.bind] + dir * step);
            e.preventDefault();
        });
    });
}

// ── main render ───────────────────────────────────────────────
function glRender(sim, syncChips) {
    const overlay = document.getElementById('sim-dom-overlay');
    if (!overlay) return;
    const cfg = sim.graphLab;
    const s = glScales(cfg);

    let m;
    try {
        m = cfg.model(Object.assign({}, glState), { prev: glPrevState, base: glSnapshot }) || {};
    } catch (err) {
        // A model that throws must not blank the whole screen mid-drag.
        overlay.innerHTML = `<div class="gl-error">${tEngine('gl.renderError', 'Could not draw this diagram — reset and try again.')}</div>`;
        if (typeof console !== 'undefined') console.error('[graphlab]', sim.id, err);
        return;
    }

    const svgBody = [
        glDefs(),
        `<rect class="gl-plot-bg" x="${GL_PAD.l}" y="${GL_PAD.t}" width="${s.pw}" height="${s.ph}"></rect>`,
        glAxes(cfg, s),
        (m.curves || []).map(c => glCurve(c, s)).join(''),
        (m.arrows || []).map(a => glArrow(a, s)).join(''),
        (m.points || []).map(p => glPoint(p, s, cfg)).join(''),
        (m.handles || []).map(h => glHandle(h, s)).join('')
    ].join('');

    let host = overlay.querySelector('.gl-shell');
    if (!host) {
        overlay.innerHTML = `<div class="gl-shell">
            <div class="gl-canvas-wrap"><svg class="gl-svg" viewBox="0 0 ${GL_W} ${GL_H}" preserveAspectRatio="xMidYMid meet" role="img"></svg></div>
            <div class="gl-verdict-host" id="gl-verdict-host"></div>
            <div class="gl-var-strip" id="gl-var-strip"></div>
            <div class="gl-strip-foot">
                <span class="gl-strip-hint">${tEngine('gl.dragHint', '✋ Drag the ● handles on the diagram, or scrub a chip below — both move the same variable.')}</span>
                <span class="gl-strip-actions">
                    <button type="button" class="gl-ghost-btn" id="gl-ghost-btn"></button>
                    <button type="button" class="gl-reset-btn" id="gl-reset-btn">${tEngine('engine.reset', '↺ Reset')}</button>
                </span>
            </div>
        </div>`;
        host = overlay.querySelector('.gl-shell');
        glRenderVarStrip(sim, host.querySelector('#gl-var-strip'));
        host.querySelector('#gl-reset-btn').addEventListener('click', () => {
            (cfg.vars || []).forEach(v => { glState[v.id] = v.value; });
            glSnapshot = Object.assign({}, glState);
            glRender(sim, true);
        });
        const gb = host.querySelector('#gl-ghost-btn');
        gb.addEventListener('click', () => { glShowGhost = !glShowGhost; glRender(sim, false); });
    }

    const svg = host.querySelector('.gl-svg');
    svg.innerHTML = svgBody;
    glWireHandles(svg, m.handles || [], s);

    const gb = host.querySelector('#gl-ghost-btn');
    if (gb) {
        gb.textContent = glShowGhost
            ? tEngine('gl.ghostOn', '👻 Original curve: ON')
            : tEngine('gl.ghostOff', '👻 Original curve: OFF');
        gb.classList.toggle('gl-ghost-btn--on', glShowGhost);
    }

    const vh = host.querySelector('#gl-verdict-host');
    if (vh) vh.innerHTML = glVerdictHTML(m.verdict);

    if (syncChips !== false) (cfg.vars || []).forEach(v => glSyncChip(v));

    const readingsBody = document.getElementById('readings-body');
    if (readingsBody) {
        const rows = Array.isArray(m.readings)
            ? m.readings.map(r => `<div class="reading-row"><span>${r.label}</span><b>${r.value}</b></div>`).join('')
            : (m.readings || '');
        const changed = typeof describeWhatChanged === 'function'
            ? describeWhatChanged({ controls: cfg.vars }, glPrevState, glState) : '';
        readingsBody.innerHTML = changed + (typeof translateReadings === 'function' ? translateReadings(sim, rows) : rows);
        readingsBody.classList.remove('pulse');
        void readingsBody.offsetWidth;
        readingsBody.classList.add('pulse');
    }

    if (Array.isArray(m.formulas)) {
        const fb = document.getElementById('formula-body');
        if (fb) fb.innerHTML = m.formulas.map(f => `<div class="formula-line">${typeof translateReadings === 'function' ? translateReadings(sim, f) : f}</div>`).join('');
    }

    if (typeof refreshChallenge === 'function') refreshChallenge(sim, m.metrics);
    glPrevState = Object.assign({}, glState);
}

// Entry point called by sim-engine.js's renderSim() for `mode: 'graphlab'`.
function renderGraphLab(sim) {
    glSim = sim;
    glDrag = null;
    glShowGhost = true;
    glState = {};
    (sim.graphLab.vars || []).forEach(v => { glState[v.id] = v.value; });
    glPrevState = Object.assign({}, glState);
    glSnapshot = Object.assign({}, glState);

    // The variable strip lives under the graph, so #controls-panel carries
    // only the lab's own scenario presets (if any) — or nothing at all.
    const panel = document.getElementById('controls-panel');
    if (panel) {
        panel.innerHTML = '';
        if ((sim.graphLab.scenarios || []).length) glRenderScenarios(sim, panel);
        else panel.classList.add('hidden');
    }
    glRender(sim, true);
}

// One-tap "show me the exam question" presets. Each sets several variables
// at once — the fastest path from a textbook question to its diagram.
function glRenderScenarios(sim, panel) {
    panel.classList.remove('hidden');
    const header = document.createElement('div');
    header.className = 'controls-panel-header collapsible-header';
    header.dataset.panelKey = 'controls';
    header.setAttribute('role', 'button');
    header.setAttribute('tabindex', '0');
    header.innerHTML = `<span>${tEngine('gl.scenarios', '🎬 Textbook Scenarios')}</span><span class="panel-chevron" aria-hidden="true">⌄</span>`;
    panel.appendChild(header);

    const hint = document.createElement('p');
    hint.className = 'controls-panel-hint';
    hint.textContent = tEngine('gl.scenariosHint', 'One tap sets up a standard exam case on the diagram. Then drag the handles yourself to see why the answer is what it is.');
    panel.appendChild(hint);

    const wrap = document.createElement('div');
    wrap.className = 'gl-scenario-grid';
    (sim.graphLab.scenarios || []).forEach((sc, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'gl-scenario-btn';
        const label = hiPath(sim, `graphLab.scenarios.${i}.label`) || sc.label;
        const note = hiPath(sim, `graphLab.scenarios.${i}.note`) || sc.note || '';
        btn.innerHTML = `<span class="gl-scenario-label">${glEsc(label)}</span>${note ? `<span class="gl-scenario-note">${glEsc(note)}</span>` : ''}`;
        const applyScenario = () => {
            (sim.graphLab.vars || []).forEach(v => { glState[v.id] = v.value; });
            Object.keys(sc.set || {}).forEach(k => { glState[k] = sc.set[k]; });
            glSnapshot = Object.assign({}, glState);
            // A preset is a jump, not a drag — re-baseline "previous" so the
            // verdict describes the scenario itself, not the jump into it.
            glPrevState = Object.assign({}, glState);
            glRender(sim, true);
        };
        btn.addEventListener('click', () => {
            if (sim.graphLab.predict) glOpenPredictGate(sim, sc, applyScenario);
            else applyScenario();
        });
        wrap.appendChild(btn);
    });
    panel.appendChild(wrap);

    if (sim.graphLab.predict) {
        const gate = document.createElement('div');
        gate.className = 'gl-predict-gate hidden';
        gate.id = 'gl-predict-gate';
        panel.appendChild(gate);
    }

    if (typeof initPanelCollapse === 'function') initPanelCollapse(panel, header, 'controls', false);
}

// Computes what a scenario WOULD produce, without touching live glState —
// so the predict gate can ask "what will happen?" using the exact same
// model() a real click would run, never a separately-authored answer that
// could drift from what the diagram actually goes on to show.
function glComputeScenarioVerdict(sim, sc) {
    const trial = {};
    (sim.graphLab.vars || []).forEach(v => { trial[v.id] = v.value; });
    Object.keys(sc.set || {}).forEach(k => { trial[k] = sc.set[k]; });
    try {
        const result = sim.graphLab.model(trial, { prev: trial, base: trial }) || {};
        return result.verdict || null;
    } catch (err) {
        return null;
    }
}

const GL_PREDICT_CHOICES = [
    { kind: 'none', key: 'gl.predictNone', fallback: '❌ Nothing changes' },
    { kind: 'movement', key: 'gl.predictMovement', fallback: '↔️ Movement along the curve' },
    { kind: 'shift', key: 'gl.predictShift', fallback: '⇄ Shift of the curve' },
    { kind: 'both', key: 'gl.predictBoth', fallback: '↔️⇄ Both — movement AND shift' }
];

// PREDICT-before-REVEAL gate for a scenario preset (see the `predict` doc
// above `graphLab`'s contract). If the model throws while computing the
// trial verdict, this fails open — applies the scenario immediately rather
// than blocking the student on a broken prediction question.
function glOpenPredictGate(sim, sc, applyScenario) {
    const gate = document.getElementById('gl-predict-gate');
    if (!gate) { applyScenario(); return; }
    const answerVerdict = glComputeScenarioVerdict(sim, sc);
    if (!answerVerdict) { applyScenario(); return; }

    gate.classList.remove('hidden');
    gate.innerHTML = `
        <p class="gl-predict-prompt">${tEngine('gl.predictPrompt', '🤔 Before this applies — predict: what will it cause?')}</p>
        <div class="gl-predict-choices">
            ${GL_PREDICT_CHOICES.map(c => `<button type="button" class="gl-predict-btn" data-kind="${c.kind}">${tEngine(c.key, c.fallback)}</button>`).join('')}
        </div>
        <button type="button" class="gl-predict-skip">${tEngine('gl.predictSkip', 'Skip prediction →')}</button>
        <div class="gl-predict-result hidden" id="gl-predict-result"></div>
    `;

    const finish = (chosenKind) => {
        applyScenario();
        const resultEl = document.getElementById('gl-predict-result');
        if (chosenKind && resultEl) {
            const correct = chosenKind === answerVerdict.kind;
            resultEl.classList.remove('hidden');
            resultEl.classList.toggle('gl-predict-result--correct', correct);
            resultEl.classList.toggle('gl-predict-result--wrong', !correct);
            const prefix = correct
                ? tEngine('gl.predictCorrectPrefix', '✅ Correct! It really was:')
                : tEngine('gl.predictWrongPrefix', '❌ Not quite — it was actually:');
            resultEl.innerHTML = `<b>${prefix}</b> ${answerVerdict.title}`;
        }
        gate.querySelectorAll('.gl-predict-btn, .gl-predict-skip').forEach(b => { b.disabled = true; });
    };

    gate.querySelectorAll('.gl-predict-btn').forEach(btn => {
        btn.addEventListener('click', () => finish(btn.dataset.kind));
    });
    const skipBtn = gate.querySelector('.gl-predict-skip');
    if (skipBtn) skipBtn.addEventListener('click', () => finish(null));
}
