// ══════════════════════════════════════════════════════════════
// MIMA CONTEXT — the shared state interface between the simulation
// engine and Mima (Micro & Macro Economics Interactive Mentor Assistant).
//
//   Simulator/GraphLab/customRender
//         ↓ (each engine writes one snapshot after every render)
//   mimaSnapshot                    (this file's only piece of state)
//         ↓
//   getMimaContext()                (this file's only exported reader)
//         ↓
//   js/mima-explain.js              (turns context into TEXT)
//         ↓
//   js/mima-voice.js                (speaks that SAME text)
//
// This file contains NO economics and NO explanation wording. It only
// assembles what already exists elsewhere:
//   - js/sim-engine.js's renderSimChart() already computes "what changed"
//     (describeWhatChanged) and "what effect followed"
//     (js/transition-layer.js's diffMetrics) for every simulator/
//     customRender sim — this file reads that, never recomputes it.
//   - js/graph-lab-engine.js's glRender() already computes the
//     movement/shift verdict (cfg.model()'s own `verdict.kind`) — this
//     file reads that, never re-derives movement vs shift itself.
// If Mima ever seems to say something the simulator doesn't, the bug is
// in whichever engine WROTE the snapshot, not in Mima — she is a reader,
// never a second source of truth.
// ══════════════════════════════════════════════════════════════

// Written by sim-engine.js's renderSimChart() and graph-lab-engine.js's
// glRender() after every render. Never written from anywhere else.
let mimaSnapshot = null;

// mode: 'simulator' | 'customRender' | 'graphlab'
function mimaSetSnapshot(sim, mode, data) {
    if (!sim) {
        mimaClearSnapshot();
        return;
    }
    const d = data || {};
    mimaSnapshot = {
        simId: sim.id || null,
        title: (typeof hiPath === 'function' && hiPath(sim, 'title')) || sim.title || '',
        module: sim.module || null,
        classLabel: sim.class || null,
        part: sim.part || null,
        unit: sim.unit || null,
        unitTitle: sim.unitTitle || null,
        mode,
        isFirstRender: !!d.isFirstRender,
        changedControls: d.changedControls || [],   // [{label, before, after}]
        effects: d.effects || [],                    // [{label, before, after, rose}]
        verdict: d.verdict || null,                   // graphlab only: {kind, title, detail}
        ghostedNames: d.ghostedNames || [],            // simulator only: curves that moved
        allTraceNames: d.allTraceNames || [],          // simulator only: every curve on screen
        currentMetrics: d.currentMetrics || {},
        readingsHTML: d.readingsHTML || '',
        keyIdea: (sim.tlm && (hiPath(sim, 'tlm.keyIdea') || sim.tlm.keyIdea)) || null,
        at: Date.now()
    };
    if (typeof mimaOnStateChanged === 'function') mimaOnStateChanged();
}

function mimaClearSnapshot() {
    mimaSnapshot = null;
    if (typeof mimaOnStateChanged === 'function') mimaOnStateChanged();
}

// The one function everything downstream (js/mima-explain.js) reads.
// Returns null when no sim has rendered yet (app just loaded, Home screen).
function getMimaContext() {
    if (!mimaSnapshot) return null;
    return Object.assign({}, mimaSnapshot, {
        lang: (typeof currentLang !== 'undefined' && currentLang === 'hi') ? 'hi' : 'en'
    });
}
