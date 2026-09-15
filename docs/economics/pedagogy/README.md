# Pedagogy — when to use PREDICT, the TLM Toolkit, or nothing

This project's learning loop, as actually built (not aspirational): **Observe → Predict
→ Manipulate → Observe the consequence → Explain (via the verdict/insight text) →
Compare (scenarios, ghost curves) → Apply (practice/challenge) → Check (quiz)**. Not
every sim needs every piece of machinery below — decide per concept.

## PREDICT: gate vs card — these are not interchangeable

| | Graph Lab gate (`graphLab.predict: true`) | Simulator card (`sim.predict`) |
|---|---|---|
| Triggers on | a discrete **scenario button** click | a **continuous slider** actually moving |
| Right for | "what will THIS named event cause" (a subsidy, a price fall, an income rise) | "what's the TREND as I push this variable further" (more substitutes → more/less elastic; more X → rising/falling opportunity cost) |
| Wrong for | a continuously-draggable variable (gating every pixel of a drag would break the tested instant-drag contract) | a one-shot discrete event with no natural "before/after" slider position |
| Grading source | re-runs `graphLab.model()` against the scenario's target state | compares `sim.compute()`'s metrics at the moment the card was shown vs. the moment the tracked control changed |

**Do not build a third variant.** If a concept doesn't fit either shape — no scenario
presets and no single continuously-varying "trend" variable — it may simply not be a
good candidate for PREDICT. That's a legitimate outcome, not a gap to force-fill (this
mirrors the top-level directive's own rule: "If a concept has no reasonable simulation
potential, do not force it into a simulation").

## `predictChoices` — only override when the shared vocabulary would lie

`GL_PREDICT_CHOICES`'s four options (none/movement/shift/both) are correct *only* for
labs using `glMoveShiftVerdict`'s movement-along-a-curve / shift-of-a-curve meaning.
`gl-market-equilibrium-shifts` needed its own 3-choice set because its `verdict.kind`
values mean something else entirely under the same string names. Before reusing the
shared choices on a new lab, check what its own `verdict.kind` actually represents —
don't assume the string `'movement'` always means the same thing.

## Teaching & Learning Toolkit — fill in what's genuinely useful, not all 8 fields

`sim.tlm`'s 8 fields (KeyIdea, CommonMistakes, ExamTip, ThinkQuestion, Activity,
ExitTicket, TeacherExplain, QuickCheck) map to distinct classroom/self-study moments —
see `js/sim-engine.js`'s doc comment on `renderTLM`. In practice, on the 5 sims that
have it, every field was worth filling because each of these 5 concepts genuinely has:
a one-line essence (KeyIdea), a specific common confusion (CommonMistakes), a concrete
exam-scoring tip (ExamTip), something worth reflecting on beyond the slider (
ThinkQuestion), a real-world connection worth researching (Activity), a fast
end-of-lesson check (ExitTicket), a concrete classroom demo sequence (TeacherExplain),
and an immediate self-check (QuickCheck). A thinner concept doesn't need to force all 8
— an empty/generic field is worse than an absent one, and `renderTLM` already renders
only the sections a sim actually declares.

## `misconceptions` on a quiz option — one specific wrong answer, not a second `explain`

Only tag an option when the mistake is a *named, common, specific* confusion (the kind
a teacher would recognise instantly: "ah, they mixed up expansion and increase again").
Do not add a generic "this is wrong because..." to every distractor — that's what
`explain` already covers for the question as a whole.

## Propagation backlog (honest state, see `CLAUDE.md`)

PREDICT + TLM + misconception-tagging currently live on 5 of 44 sims (the
"gold-standard order": Demand, Supply, Market Equilibrium, Elasticity, PPF). The
remaining ~39 — Statistics, the rest of Microeconomics, Macroeconomics (including
`macro-gdp`, which specifically has zero PREDICT/TLM despite being one of the richest
models in the app), and Indian Economic Development — do not have any of this yet.
Extend concept-by-concept, writing a `docs/economics/models/*.md` file first if the
concept doesn't have one, so the TLM/misconception content is grounded in a checked
model rather than written from memory.
