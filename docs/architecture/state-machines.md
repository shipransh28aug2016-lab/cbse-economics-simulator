# State machines in EconSim Pro

Every interactive part of the app is a state machine. Most started out **implicit**: the
state was spread over globals, DOM classes and boolean flags, and each copy was updated by
hand. A bug appears whenever two of those copies disagree. The November 2026 audit found
five such bugs. All five are now fixed, and each one has a regression test in
`tools/smoke.js`.

| # | Bug (while the state was implicit) | Machine that now owns the state |
|---|---|---|
| 1 | Leaving a sim by the **logo** or **Profile** kept `currentSim`. A later language toggle on Home "re-rendered" that sim and pulled the student back into it, with its story resumed. | `app` |
| 2 | A language toggle redrew the open quiz question and reset `answered`. The same question could then be **answered and scored twice**, and the question text did not translate. | `quiz` |
| 3 | A revealed PREDICT result ("✅ It really was: Expansion of Demand") **stayed on screen after Reset or a drag**, contradicting the diagram beside it. | `predictGate` |
| 4 | A story, its narration and a glide in progress **kept running after the student left the sim**. | `app` exit → `onSimLeave` hooks |
| 5 | Mima's and Story's speak buttons could not see each other's speech. Also, `speechSynthesis.cancel()` fires the *old* utterance's `onerror` after a new utterance starts, which could flip the UI to "idle" while speech was still playing. | `voice` |

## The primitive: `js/state-machine.js`

```js
const m = createMachine({
    id: 'quiz', initial: 'closed', reflect: 'quiz', context: quizState,
    describe: ctx => ({ index: ctx.index, score: ctx.score }),
    states: {
        closed:   { on: { OPEN: { target: 'asking', action } }, enter },
        asking:   { on: { ANSWER: { target: 'answered', guard, action }, CLOSE: 'closed' } },
        answered: { on: { NEXT: { target: 'asking', guard }, FINISH: { target: 'results', guard }, CLOSE: 'closed' } },
        results:  { on: { CLOSE: 'closed', OPEN: { target: 'asking', action } } }
    }
});
m.send('ANSWER', { i: 2 });   // true if a transition ran
m.can('NEXT');                // would it be accepted right now?
m.subscribe((to, from, event) => …);
```

- **One owner and one table.** A machine's state changes only when its transition table
  allows the change. The table is also its documentation.
- **Refused events are safe.** An event the current state doesn't accept changes nothing.
  It is recorded as `lastRejected` (useful for debugging), and is never thrown or logged,
  so a double click cannot crash anything or print a console error.
- **Order on a transition:** `exit` (old state) → `action` → `enter` (new state) →
  subscribers. A self-transition runs only its `action`.
- **`reflect: 'quiz'`** mirrors the state onto `<body data-quiz="answered">`, so CSS, tests
  and screen-reader tooling can read it.
- **`onSimLeave(fn)`**: each engine registers its *own* teardown, and `app` runs them all
  when a sim is left (to Home or Profile, or by switching to a different sim). app.js never
  has to know any engine's internals. Re-rendering the same sim, as a language toggle does,
  is not leaving it.

## For agents and tests: `econsim.state()`

In the browser, `econsim.state()` returns one JSON-safe snapshot of the whole app. Read
this instead of reverse-engineering globals and CSS classes:

```json
{
  "machines": {
    "app":         { "state": "sim", "simId": "gl-demand-movement-shift", "lang": "hi" },
    "quiz":        { "state": "closed", "index": 0, "total": 0, "score": 0 },
    "predictGate": { "state": "revealed", "scenario": "कीमत ₹50 → ₹30", "correct": true },
    "voice":       { "state": "speaking", "owner": "story", "lang": "hi" }
  },
  "observed": {
    "graphLab":  { "simId": "…", "phase": "idle|dragging|gliding", "vars": { … } },
    "story":     { "phase": "off|intro|asking|revealed|finished", "step": 1, "steps": 4 },
    "simulator": { "controls": { … }, "predictCard": "none|pending|guessed|resolved" },
    "dataLab": { … }, "explorer": { … }, "holo": { … }, "mima": { … }, "aiTutor": { … }
  }
}
```

The `<body>` element also carries `data-screen`, `data-quiz`, `data-predict-gate` and
`data-voice`.

## The map: all 15 machines

**Explicit** means a `createMachine` owns the state. **Observed** means the state is still
implicit but works correctly, so it is exposed read-only through `registerStateObserver`
rather than rewritten. The rule for when to convert one is in the last section.

| Machine | Kind | Owner | States | Invariant it protects |
|---|---|---|---|---|
| App lifecycle | explicit `app` | `js/app.js` | `home` · `sim` · `life` · `profile` | `currentSim` is set only on entering `sim` and cleared on leaving it; leaving runs every `onSimLeave` hook. |
| Living World | explicit `life` | `js/life-engine.js` | `closed` · `brief` · `deciding` · `outcome` · `debrief` | A decision is committed exactly once per round (`COMMIT` only from `deciding`); `NEXT`/`FINISH` are guarded by whether the run is done. The whole screen is a pure function of (run, state, language), so a language toggle redraws the same round with the same history. Leaving the `life` screen closes the run (`app` exit → `lifeClose`), so a later toggle on Home cannot reopen it. |
| Quiz | explicit `quiz` | `js/quiz-engine.js` | `closed` · `asking` · `answered` · `results` | Only `ANSWER` scores, and only from `asking`. A re-render (language toggle) redraws the current state and never changes it. Questions keep their raw bilingual source and a fixed option order, so they re-localize in place. |
| PREDICT gate (Graph Labs) | explicit `predictGate` | `js/graph-lab-engine.js` | `hidden` · `asking` · `revealed` | A revealed answer is visible only while `glState` equals the state it was revealed for. `glRender()` sends `STALE` otherwise. |
| Voice | explicit `voice` | `js/mima-voice.js` | `idle` · `speaking`(owner) | Only the *current* utterance can end `speaking`. The owner (`mima`/`story`) decides which button shows ⏹. |
| Graph Lab interaction | observed `graphLab` | `js/graph-lab-engine.js` | `idle` · `dragging` · `gliding` | Any render cancels a glide in flight. A press on the diagram lands it. The Holo tilt is flattened before a drag begins (CLAUDE.md, Holo Mode). |
| Story Mode | observed `story` | `js/story-mode.js` | `off` · `intro` · step *k* `asking`/`revealed` · `finished` | States are encoded in `idx` and `answered[idx]`. A language toggle stashes the story and resumes it within 3 s. Leaving the sim ends it (`onSimLeave`). |
| Simulator PREDICT card | observed `simulator.predictCard` | `js/sim-engine.js` | `none` · `pending` · `guessed` · `resolved` | Grades once, on the first real move of `controlId`. `evaluate()` returning `null` keeps it pending. |
| Transition baseline | implicit | `js/sim-engine.js` | first render · transition | `suppressNextWhatChanged` + `prevSimResult`: the first render of a sim, or a repaint with unchanged controls, never reports a "what changed" line or ghost curves. |
| Data Lab table | observed `dataLab` | `js/datalab-engine.js` | rows + previous rows | Defaults are re-filled (in the current language) on open and Reset. Typed values are never translated. |
| Explorer | observed `explorer` | `js/explorer-engine.js` | timeline index · scenario · card answers | Reset on every open. |
| Holo Mode | observed `holo` | `js/holo-mode.js` | on/off · fullscreen | Per-viewer, kept in `localStorage`. |
| Mima panel | observed `mima` | `js/mima-ui.js` | `closed` · `open` · `minimized` (+ dragging) | Position and minimized state are kept per session. Voice is started only by a click. |
| AI tutor | observed `aiTutor` | `js/ai-tutor.js` | session XP · missions · touched controls | Session-only. Never claims progress that doesn't persist. |
| Panels & language | implicit | `js/panel-collapse.js`, `js/app.js` | collapsed per panel · `currentLang` | Kept per viewer in `localStorage`. The language appears as `app.lang` in the snapshot. |

## When to make an implicit machine explicit

Convert one when **any** of these is true. Otherwise expose it with
`registerStateObserver` and leave it alone, because a working machine rewritten for style
is only a new chance to break it.

1. Two or more copies of its state exist (a global *and* a DOM class *and* a flag) that are
   updated in different places.
2. Something other than its own UI triggers its transitions (a language toggle, a
   navigation, another engine). That's exactly where bugs 1–4 came from.
3. A transition must be refused in some states, such as scoring twice or answering after
   a reveal.
4. A claim it shows must stay true of the model, as with the PREDICT gate. A model-honesty
   invariant belongs in a guard or a `STALE` check, not in hoping that every caller
   remembers it.

When you add or change a machine: `tools/test-curriculum.js` (`testStateMachines`) audits
every registered machine structurally. It fails on a transition to a missing state, a state
unreachable from `initial`, and a dead-end state. Add a browser regression to
`tools/smoke.js` for the bug the machine prevents.
