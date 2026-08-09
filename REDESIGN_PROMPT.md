# Prompt: Glassmorphism Redesign & CBSE 2026–27 Syllabus Alignment for EconSim Pro

Copy everything below the line into your coding assistant of choice.

---

## Role & Context

You are working on **EconSim Pro**, a static HTML/CSS/JavaScript web app (`index.html`, `css/styles.css`, `js/*.js`, Plotly.js for charts) that teaches CBSE Class XI–XII Economics through 18 interactive simulations. The current architecture is:

- `js/simulations.js` and `js/simulations_extended.js` define a global `SIMS` array. Each simulation object has `id`, `module`, `title`, `desc`, `concept` (HTML string), `formulas` (array of strings), `controls` (array of slider configs: `{id, label, min, max, step, value, unit}`), and a `compute(values)` function returning `{ traces, layout, readings }` for Plotly.
- `js/sim-engine.js` is the shared rendering engine: it builds slider controls from `sim.controls`, calls `sim.compute()`, renders the Plotly chart into `#sim-dom-overlay`, and writes `sim.concept`/`sim.formulas`/computed `readings` into the info sidebar.
- `js/app.js` handles screen navigation (`showScreen`, `openSim`) and populates the home-screen module grids from `SIMS`.
- `css/styles.css` currently uses a **plain light theme** (flat white cards, `#f9fafb` background, thin gray borders, no shadows, no gradients, no animation) — functional but visually flat and static.

Your task has two equally important parts: **(A) a full visual redesign** and **(B) a content/interactivity upgrade**, applied consistently across **all 18 simulations**, without breaking the existing data-driven architecture.

---

## Part A — Modern Glassmorphism Redesign

Replace the current flat, static visual design with a living, colorful, glassmorphism-based interface. Concretely:

1. **Glass surfaces everywhere it makes sense**: simulation info cards, the controls panel, the quiz modal, nav bar, module header cards, and stat chips should use frosted-glass panels — semi-transparent background (`rgba(255,255,255,0.55–0.7)` on light, or a dark translucent equivalent), `backdrop-filter: blur(12–20px)` (+ `-webkit-backdrop-filter` for Safari), a subtle `1px` semi-transparent border (`rgba(255,255,255,0.4)`), and a soft, layered `box-shadow` for depth. Do **not** apply glass to body text blocks where it would hurt readability — use it for containers, not paragraphs.
2. **Vivid, layered background**: replace the flat `#f9fafb` body background with a soft animated or static multi-stop gradient (mesh-gradient / aurora style) using the module accent colors (see below) at low opacity, so glass panels have something colorful to blur. Keep contrast high enough for text (verify WCAG AA against card backgrounds).
3. **Distinct color identity per module** — assign each of the 4 modules (Microeconomics, Macroeconomics, Statistics for Economics, Indian Economic Development) its own accent gradient (e.g. blue→violet, emerald→teal, amber→orange, rose→fuchsia), and use it consistently for that module's badge, ring progress indicator, card hover glow, and chart accent color, so the app feels colorful and organized rather than monotone.
4. **Motion and micro-interactions** (respect `prefers-reduced-motion: reduce` and fall back to no/minimal motion): 
   - Simulation cards lift, glow, and gently scale on hover.
   - Screen transitions (home ↔ simulation) fade/slide instead of an instant flat swap.
   - When a slider or input changes, the Plotly chart should transition smoothly (Plotly's built-in transition config) rather than snapping, and the updated reading values should briefly pulse/highlight so the change is visible.
   - Buttons have tactile hover/active states (scale, glow, shadow shift), not just a color change.
5. **Typography & iconography**: keep the existing Inter/JetBrains Mono font pairing but strengthen the type hierarchy (larger, bolder headings; clear label/value contrast in the controls panel). Use accent-colored icons/emoji already present in the markup as visual anchors rather than adding an icon font/CDN.
6. **No flat/static leftovers**: audit every screen (Home, Simulation, Profile, Quiz modal, XP/achievement popups) and ensure nothing looks like plain unstyled HTML — every interactive element needs a real hover/focus/active state.
7. **Responsive & accessible**: the glass redesign must hold up on mobile widths (single-column stacking, touch-friendly slider/input hit areas ≥ 44px) and must not drop below WCAG AA contrast for body text. Respect both light and dark OS color-scheme preferences if you introduce a dark mode — otherwise commit to one polished theme deliberately.
8. **Stay self-contained**: no new external CDN dependencies beyond what's already used (Google Fonts, local `plotly.min.js`). All new CSS/animation must be plain CSS/JS — no build step, no framework.

---

## Part B — Content & Interactivity Upgrade (CBSE 2026–27, Class XI–XII)

1. **Verify the syllabus first.** Before writing or editing any simulation's `concept`/`formulas` content, check the *current, official* CBSE Curriculum for Economics, Class XI (Code 030) and Class XII (Code 030) for the **2026–27** academic session (cbseacademic.nic.in) — chapter names, topic weightage, and case-study inclusions/exclusions are revised periodically (e.g. the earlier "rationalisation" round removed some topics). Do not assume the syllabus is identical to older years; confirm chapter titles and scope against the official document and cite what you changed and why.
2. **Baseline structure to align against** (verify against the official 2026–27 document before finalizing — treat this list as a strong starting point, not gospel):
   - **Class XI – Statistics for Economics**: Introduction; Collection, Organisation and Presentation of Data; Statistical Tools and Interpretation (Measures of Central Tendency, Measures of Dispersion, Correlation, Index Numbers).
   - **Class XI – Indian Economic Development**: Development Experience of India — a Comparison with Neighbours; Current Challenges facing Indian Economy (Poverty, Human Capital Formation, Rural Development, Employment, Infrastructure, Environment and Sustainable Development).
   - **Class XII – Introductory Microeconomics**: Introduction; Consumer Equilibrium and Demand; Producer Behaviour and Supply; Forms of Market and Price Determination under different markets.
   - **Class XII – Introductory Macroeconomics**: National Income and Related Aggregates; Money and Banking; Determination of Income and Employment; Government Budget and the Economy; Balance of Payments.
   - Map each of the 18 existing simulations (listed below) to the specific chapter and learning outcome it teaches, and correct/expand the `concept` and `formulas` fields so wording, terminology, and notation match the current NCERT/CBSE textbook exactly (e.g. correct use of "Legal Reserve Ratio", "Marginal Propensity to Consume", "Aggregate Demand/Supply", Gini coefficient conventions, etc.).
3. **The 18 simulations to update** (do not remove or rename IDs — students' progress/badges may reference them):
   - Micro: `micro-supply-demand`, `micro-elasticity`, `micro-consumer-equilibrium`, `micro-producer-costs`, `micro-price-controls`, `micro-market-structures`
   - Macro: `macro-gdp`, `macro-multiplier`, `macro-money-creation`, `macro-govt-budget`, `macro-forex`, `macro-inflation-gap`
   - Statistics: `stats-correlation`, `stats-dispersion`, `stats-index-numbers`
   - Indian Economy: `india-poverty`, `india-human-capital`, `india-employment-structure`
4. **Add explicit data-input fields alongside every slider.** Sliders are good for quick exploration but Class XI–XII students also need to type an exact value (e.g. "what if MPC = 0.73 exactly?") and see the outcome recompute immediately. For every control in every simulation:
   - Pair the existing `<input type="range">` with a linked numeric `<input type="number">` (or a small editable value field) — moving the slider updates the number and vice versa, both driving the same `compute()` call.
   - Enforce the same `min`/`max`/`step` bounds on the numeric input as the slider, with inline validation feedback (don't allow silently invalid/NaN values to reach `compute()`).
   - Where a control is categorical rather than continuous (e.g. choosing "Perfect Competition vs Monopoly" framing, or ceiling vs floor), offer a clear dropdown/segmented-button selector instead of forcing it through a slider.
   - Add a visible **"Reset to default"** action per simulation that restores the original `control.value` for every input.
5. **Make outcomes obviously dynamic.** Every recompute should: update the Plotly chart with a smooth transition, update the "Live Readings" panel values (with the pulse/highlight from Part A), and where relevant show a short plain-English takeaway sentence tied to the CBSE learning outcome (e.g. "Because MC is below AC, average cost is still falling — the firm hasn't reached its most efficient scale yet.").
6. **Keep it age-appropriate and exam-relevant.** Language, formula notation, and the level of interactivity should match what a Class XI/XII CBSE student actually needs for board exam preparation — avoid graduate-level jargon, but don't oversimplify to the point of being inaccurate. Every simulation should reinforce content a student could be asked to reproduce or apply in the CBSE board exam.

---

## Constraints & Acceptance Criteria

- Do **not** change the existing `SIMS` data contract (`id`, `module`, `title`, `desc`, `concept`, `formulas`, `controls`, `compute`) in a way that breaks `js/sim-engine.js` and `js/app.js` — extend it (e.g. add an optional `inputs`/`controlType` field) rather than replacing it, unless you also update the engine and every simulation consistently.
- All 18 simulations must remain fully functional after the change: opening each one from the home screen must render its chart, controls, concept, formulas, and readings with **zero console/page errors**.
- Every slider must have a working linked numeric input (and vice versa) with no way to desync them or push an invalid value into `compute()`.
- Test on a realistic viewport (desktop ~1400px and mobile ~390px) and confirm no horizontal scrolling, no illegible low-contrast text on glass surfaces, and no broken layout when a control panel has 1 vs. 3 inputs.
- Before calling this done, do a full pass opening all 18 simulations, moving every control, and confirming: chart updates correctly, readings update correctly, no layout breakage, no JS errors in the console.
- Summarize, per simulation, what content changed to align with the 2026–27 syllabus (or state "no change needed, already aligned") so the changes can be reviewed against the official CBSE curriculum document.
