// ══════════════════════════════════════════════════════════════
// js/circular-flow-layout.js — where the 3D Circular Flow puts things
// ══════════════════════════════════════════════════════════════
// Pure geometry, no three.js and no DOM, so it is bundled into the 3D view
// (js/circular-flow-3d.js) AND run directly by tools/test-curriculum.js.
//
// The problem it solves: ten flows each carry a text label, and the scene is
// seen through ONE fixed isometric camera. Placing every label at the middle
// of its curve (the first version) stacked labels of flows that cross in the
// picture, so "Factor Services" sat on "Consumption" and "Exports" on "Imports".
//
// So label placement happens in SCREEN space — the camera is fixed, hence a
// world point maps to the screen by two dot products — and each label takes
// the first position along its own curve that overlaps nothing already placed
// (not another label, not a sector's name, not a sector's building). If no
// position is free it takes the least-overlapping one and reports it, and the
// test fails — it never silently ships a collision.

// Fixed anchors, one per sector — toggling a sector never moves another one.
const NODE_POS = {
    hh: [-7, 0, 0], firm: [7, 0, 0], gov: [0, 0, -7.5], bank: [-3.4, 0, 7.2], foreign: [3.4, 0, 7.2]
};
// Height of each sector's name above its platform (matches the models).
const NODE_LABEL_Y = { hh: 2.2, firm: 2.5, gov: 2.4, bank: 2.2, foreign: 2.2 };
const NODE_LABEL_H = 0.75, FLOW_LABEL_H = 0.5;
const CAMERA = { position: [14, 14, 14] }; // looking at the origin, orthographic

// Camera basis for a camera at (d, d, d) looking at the origin.
const RIGHT = [1 / Math.SQRT2, 0, -1 / Math.SQRT2];
const UP = [-1 / Math.sqrt(6), 2 / Math.sqrt(6), -1 / Math.sqrt(6)];
const toScreen = p => [p[0] * RIGHT[0] + p[1] * RIGHT[1] + p[2] * RIGHT[2], p[0] * UP[0] + p[1] * UP[1] + p[2] * UP[2]];

// The curve a flow travels: a quadratic Bezier bowed sideways, perpendicular
// (in the ground plane) to the edge's own direction — so a reversed edge bows
// to the opposite side by itself. Money flows between Households and Firms are
// the inner raised ring, real flows the outer low one, like the 2D diagram.
function flowGeometry(f) {
    const a = NODE_POS[f.from], b = NODE_POS[f.to];
    const core = (f.from === 'hh' && f.to === 'firm') || (f.from === 'firm' && f.to === 'hh');
    const bow = core ? (f.kind === 'real' ? 7.4 : 3.6) : 1.0;
    const lift = core ? (f.kind === 'real' ? 0.5 : 2.2) : 2.4;
    const dx = b[0] - a[0], dz = b[2] - a[2], len = Math.hypot(dx, dz) || 1;
    return { a, b, mid: [(a[0] + b[0]) / 2 + (-dz / len) * bow, lift, (a[2] + b[2]) / 2 + (dx / len) * bow] };
}
function bezierPoint(g, t) {
    const u = 1 - t;
    return [0, 1, 2].map(i => u * u * g.a[i] + 2 * u * t * g.mid[i] + t * t * g.b[i]);
}

// Positions to try along a curve, best first: the middle, then alternating
// outward, 0.05 apart. At each, heights above/below the curve, nearest first.
const T_CANDIDATES = [0.5];
for (let k = 1; k <= 9; k++) T_CANDIDATES.push(+(0.5 - 0.05 * k).toFixed(2), +(0.5 + 0.05 * k).toFixed(2));
const Y_CANDIDATES = [0.45];
for (let k = 1; k <= 14; k++) Y_CANDIDATES.push(+(0.45 + 0.35 * k).toFixed(2), +(0.45 - 0.35 * k).toFixed(2));
const PAD = 0.08; // breathing room between any two rectangles, in world units

const rect = (center, w, h) => ({ x0: center[0] - w / 2 - PAD, x1: center[0] + w / 2 + PAD, y0: center[1] - h / 2 - PAD, y1: center[1] + h / 2 + PAD });
const overlapArea = (p, q) => Math.max(0, Math.min(p.x1, q.x1) - Math.max(p.x0, q.x0)) * Math.max(0, Math.min(p.y1, q.y1) - Math.max(p.y0, q.y0));

// spec: { nodes: [{key,label}], flows: [{id,from,to,value,kind,label}] }
// measure(text, worldHeight) → the label's width in world units.
// Returns { place: { [flowId]: { t, dy, position: [x,y,z] } }, overlaps, rects }.
function layoutFlowLabels(spec, measure) {
    const obstacles = [];
    spec.nodes.forEach(n => {
        const pos = NODE_POS[n.key];
        obstacles.push({ owner: `node:${n.key}`, r: rect(toScreen([pos[0], pos[1] + NODE_LABEL_Y[n.key], pos[2]]), measure(n.label, NODE_LABEL_H), NODE_LABEL_H) });
        // The building itself (platform + tallest structure), roughly.
        obstacles.push({ owner: `body:${n.key}`, r: rect(toScreen([pos[0], pos[1] + 0.9, pos[2]]), 3.1, 2.4) });
    });
    const place = {};
    const placed = [];
    // Biggest flows first: they are the most visible and get the best spots.
    const flows = spec.flows.filter(f => f.value > 0).slice().sort((p, q) => q.value - p.value);
    flows.forEach(f => {
        const g = flowGeometry(f), w = measure(f.label, FLOW_LABEL_H);
        let best = null;
        for (const t of T_CANDIDATES) {
            for (const dy of Y_CANDIDATES) {
                const p = bezierPoint(g, t);
                const position = [p[0], p[1] + dy, p[2]];
                const r = rect(toScreen(position), w, FLOW_LABEL_H);
                let bad = 0;
                obstacles.forEach(o => { bad += overlapArea(r, o.r); });
                placed.forEach(o => { bad += overlapArea(r, o.r); });
                // A little pull toward the middle and toward the curve, so ties are tidy.
                const score = bad * 1000 + Math.abs(t - 0.5) * 0.4 + Math.abs(dy - 0.45) * 0.1;
                if (!best || score < best.score) best = { score, bad, t, dy, position, r };
                if (bad === 0 && t === 0.5 && dy === Y_CANDIDATES[0]) break;
            }
            if (best && best.bad === 0) break;
        }
        place[f.id] = { t: best.t, dy: best.dy, position: best.position };
        placed.push({ owner: f.id, r: best.r });
    });
    // Count real collisions (padding removed): flow↔flow and flow↔sector label.
    let overlaps = 0;
    const unpad = r => ({ x0: r.x0 + PAD, x1: r.x1 - PAD, y0: r.y0 + PAD, y1: r.y1 - PAD });
    const labelRects = placed.concat(obstacles.filter(o => o.owner.indexOf('node:') === 0));
    for (let i = 0; i < labelRects.length; i++) for (let j = i + 1; j < labelRects.length; j++) {
        if (labelRects[i].owner.indexOf('node:') === 0 && labelRects[j].owner.indexOf('node:') === 0) continue;
        if (overlapArea(unpad(labelRects[i].r), unpad(labelRects[j].r)) > 1e-9) overlaps++;
    }
    return { place, overlaps };
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NODE_POS, NODE_LABEL_Y, CAMERA, flowGeometry, bezierPoint, layoutFlowLabels, toScreen };
}
