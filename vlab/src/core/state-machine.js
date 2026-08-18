// ══════════════════════════════════════════════════════════════
// CBSE V-LAB — shared lab state machine (spec §22).
// Subject/experiment-agnostic: any experiment module can reuse this
// instead of hand-rolling its own screen/step transitions.
// Dual export (module.exports / window.VLAB.stateMachine) — see
// permanganometry-model.js header for why.
// ══════════════════════════════════════════════════════════════

(function (root) {
    'use strict';

    const STATES = Object.freeze([
        'INITIALIZED', 'READY', 'RUNNING', 'MEASURING',
        'OBSERVATION', 'CALCULATION', 'RESULT', 'ASSESSMENT', 'COMPLETED'
    ]);

    // Forward path plus the explicitly-allowed backward moves
    // (RESET / RETRY / UNDO from spec §22).
    const TRANSITIONS = {
        INITIALIZED: ['READY'],
        READY: ['RUNNING', 'INITIALIZED'],
        RUNNING: ['MEASURING', 'READY', 'INITIALIZED'],
        MEASURING: ['OBSERVATION', 'RUNNING', 'READY', 'INITIALIZED'], // RUNNING = undo/retry a trial
        OBSERVATION: ['CALCULATION', 'MEASURING', 'INITIALIZED'],       // MEASURING = retry a trial
        CALCULATION: ['RESULT', 'OBSERVATION', 'INITIALIZED'],
        RESULT: ['ASSESSMENT', 'CALCULATION', 'INITIALIZED'],          // CALCULATION = redo the sum
        ASSESSMENT: ['COMPLETED', 'RESULT', 'INITIALIZED'],
        COMPLETED: ['INITIALIZED']                                     // start a fresh attempt
    };

    function createLabStateMachine(initial) {
        let current = STATES.includes(initial) ? initial : 'INITIALIZED';
        const history = [current];
        const listeners = [];

        function can(to) {
            return (TRANSITIONS[current] || []).includes(to);
        }

        function transition(to) {
            if (!STATES.includes(to)) {
                throw new Error('Unknown lab state: ' + to);
            }
            if (!can(to)) {
                throw new Error('Illegal transition ' + current + ' -> ' + to);
            }
            const from = current;
            current = to;
            history.push(to);
            listeners.forEach(fn => fn(to, from));
            return current;
        }

        function reset() {
            return transition('INITIALIZED');
        }

        return {
            get state() { return current; },
            get history() { return history.slice(); },
            can,
            transition,
            reset,
            onChange(fn) { listeners.push(fn); }
        };
    }

    const api = { STATES, TRANSITIONS, createLabStateMachine };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    }
    if (root) {
        root.VLAB = root.VLAB || {};
        root.VLAB.stateMachine = api;
    }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : null));
