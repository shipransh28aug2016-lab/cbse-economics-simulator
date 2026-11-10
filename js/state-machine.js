// ══════════════════════════════════════════════════════════════
// js/state-machine.js — explicit state machines, one small primitive
// ══════════════════════════════════════════════════════════════
// The app is full of state that used to be implicit: which screen is
// showing, whether a quiz question is answered, whether a PREDICT result
// is still true of the diagram, whether the voice is speaking. Each was
// spread across globals, DOM classes and flags, and those copies could
// disagree — e.g. leaving a sim by the logo kept `currentSim`, so a later
// language toggle on Home jumped back into that sim. Every bug of that kind
// is two copies of one state drifting apart.
//
// createMachine() gives a machine ONE place its state lives and ONE table
// of the transitions allowed out of each state:
//
//   const m = createMachine({
//       id: 'quiz', initial: 'closed', context: {...},
//       dom: el => el.dataset.quiz = state,          // optional reflection
//       describe: ctx => ({ index: ctx.index }),     // optional snapshot extras
//       states: {
//           closed:  { on: { OPEN: 'asking' } },
//           asking:  { on: { ANSWER: { target: 'answered', guard, action } } },
//           ...
//       }
//   });
//   m.send('OPEN', payload) → true if a transition ran, false if the event
//   is not allowed in the current state (or its guard said no).
//
// A refused event changes nothing and is remembered as `lastRejected` — it
// is never thrown and never logged, so a stray double-click can't crash or
// spam the console (tools/smoke.js fails on any console error).
//
// For people and agents driving the app, econsimState() returns a plain
// snapshot of EVERY machine plus the observed state of the ones that are
// still implicit (see registerStateObserver), and each machine with a
// `reflect` key mirrors its state onto <body data-…>. Nothing here holds
// economic logic. The full map: docs/architecture/state-machines.md.

/* exported createMachine, registerStateObserver, econsimState, onSimLeave, runSimLeaveHooks */
const ECONSIM_MACHINES = {};
const ECONSIM_OBSERVERS = {};

function createMachine(def) {
    if (!def || !def.id || !def.states || !def.states[def.initial]) {
        throw new Error('createMachine: needs id, states and an initial state that exists');
    }
    let state = def.initial;
    let lastRejected = null;
    const listeners = new Set();
    const ctx = def.context || {};

    const reflect = () => {
        if (!def.reflect || typeof document === 'undefined' || !document.body || !document.body.dataset) return;
        document.body.dataset[def.reflect] = state;
    };

    const spec = event => {
        const node = def.states[state];
        const t = node && node.on && node.on[event];
        if (!t) return null;
        return typeof t === 'string' ? { target: t } : t;
    };

    const machine = {
        id: def.id,
        get state() { return state; },
        context: ctx,
        // Would `event` be accepted right now (target exists and guard passes)?
        can(event, payload) {
            const s = spec(event);
            return !!s && (!s.guard || !!s.guard(ctx, payload));
        },
        send(event, payload) {
            const s = spec(event);
            if (!s || (s.guard && !s.guard(ctx, payload))) {
                lastRejected = { event, state, at: Date.now() };
                return false;
            }
            const from = state;
            const to = s.target || state;
            if (!def.states[to]) throw new Error(`${def.id}: transition to unknown state "${to}"`);
            const changing = to !== from;
            if (changing && def.states[from].exit) def.states[from].exit(ctx, payload, to);
            if (s.action) s.action(ctx, payload);
            state = to;
            if (changing && def.states[to].enter) def.states[to].enter(ctx, payload, from);
            reflect();
            listeners.forEach(fn => { try { fn(state, from, event); } catch { /* a listener must not break a transition */ } });
            return true;
        },
        subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
        snapshot() {
            return Object.assign({ state }, def.describe ? def.describe(ctx) : {}, lastRejected ? { lastRejected } : {});
        },
        // The transition table itself, for tests and docs (read-only copy).
        definition() {
            const out = {};
            Object.keys(def.states).forEach(name => { out[name] = Object.assign({}, (def.states[name].on || {})); });
            return { id: def.id, initial: def.initial, states: out };
        }
    };
    ECONSIM_MACHINES[def.id] = machine;
    if (typeof document !== 'undefined' && document.readyState !== 'loading') reflect();
    else if (typeof document !== 'undefined' && document.addEventListener) document.addEventListener('DOMContentLoaded', reflect);
    return machine;
}

// Lifecycle: leaving a sim (to Home/Profile, or switching to a different
// sim) must stop everything that sim started — a story mid-step, a voice
// still narrating it, a glide in flight, an open quiz. Each engine registers
// its OWN teardown here, so app.js never needs to know their internals and a
// new engine cannot forget to be told. Re-rendering the same sim (language
// toggle) is not leaving it, so these do not run then.
const SIM_LEAVE_HOOKS = [];
function onSimLeave(fn) { SIM_LEAVE_HOOKS.push(fn); }
function runSimLeaveHooks(simId) {
    SIM_LEAVE_HOOKS.forEach(fn => { try { fn(simId); } catch { /* one engine's teardown must not block the others */ } });
}

// For state that is still implicit (it works and has no bug worth a
// rewrite): a function that reads it, so it shows up in econsimState().
function registerStateObserver(id, read) { ECONSIM_OBSERVERS[id] = read; }

// One plain, JSON-safe snapshot of the whole app's state — what an agent or
// a test should read instead of reverse-engineering globals and CSS classes.
function econsimState() {
    const out = { machines: {}, observed: {} };
    Object.keys(ECONSIM_MACHINES).forEach(id => { out.machines[id] = ECONSIM_MACHINES[id].snapshot(); });
    Object.keys(ECONSIM_OBSERVERS).forEach(id => {
        try { out.observed[id] = ECONSIM_OBSERVERS[id](); } catch (e) { out.observed[id] = { error: String(e && e.message) }; }
    });
    return JSON.parse(JSON.stringify(out));
}

if (typeof window !== 'undefined') {
    window.econsim = Object.assign(window.econsim || {}, { state: econsimState, machines: ECONSIM_MACHINES });
}
