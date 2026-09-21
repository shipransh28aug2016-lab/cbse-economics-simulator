# REALITY UPGRADE PLAN: ECONSIM PRO PLATFORM
**Document Status:** Reference Architecture & Strategic Reality Upgrade Plan
**Target Syllabus:** CBSE Class XI & XII Economics (Subject Code 030, 2026–27)
**Operating Mode:** REALITY UPGRADE / NO-REWRITE / NO-QUALITY-COMPROMISE MODE

---

## 1. EXISTING ARCHITECTURE & CORE STRENGTHS

EconSim Pro is built as a static, client-side web application running without bundler overhead or backend dependencies. Its core architecture possesses four fundamental strengths:

1. **Strict Model/View Separation & Centralized State:**
   - Every simulation operates from a single authoritative economic state (`SIMEngineState`).
   - The renderer never invents or guesses economic values; output traces, readings, and explanations derive directly from `compute()` or `model()`.

2. **CBSE/NCERT Direct-Drag GraphLab Engine (`mode: 'graphlab'`):**
   - Implements authentic textbook diagrammatic idioms: arrow-headed axes, `O` origin, curves labeled at far ends (`DD`, `SS`, `D₁D₁`), dotted equilibrium projection lines (`OP*`, `OQ*`), and pointer drag handles.
   - Live verdict banners explicitly distinguish **Movement Along Curve** vs **Shift of Curve**.

3. **Causally Correct Transition & Ghosting Layer (`js/transition-layer.js`):**
   - Automatically retains `prevSimResult` to render dimmed ghost curves for moved traces and compute numeric effect diffs without per-sim code.

4. **Synchronized Pedagogical MIMA & Multi-Language Support:**
   - MIMA reads structured model snapshots without re-deriving economics, speaking and writing in English and Hindi (Devanagari).

---

## 2. TOP 10 VISUAL & ECONOMIC DEFICIENCIES

| # | Deficiency Description | Architectural Layer | Technology Target |
|---|------------------------|---------------------|-------------------|
| 1 | Standard Plotly charts lack CBSE arrow-headed axes and dotted projection lines | Renderer / Layout | Plotly Shapes / SVG |
| 2 | Movement vs. Shift animation ambiguity in slider-driven Plotly charts | Renderer / Ghosting | Transition Layer / Ghosting |
| 3 | Static axis domain ranges causing curve clipping during extreme parameter shifts | Model / Layout | Dynamic Domain Padding |
| 4 | PREDICT gate prediction system limited to 5 gold-standard simulations | Pedagogy / Engine | GraphLab / Simulator Engine |
| 5 | Teaching & Learning Toolkit (TLM) cards missing on 39 modules | Pedagogy / UI | Shared `renderTLM` Engine |
| 6 | Direct pointer-drag handle manipulation absent in `simulator` mode | Interaction | SVG Pointer Events / Drag API |
| 7 | High-dimensional production surfaces limited to 2D projections | Renderer | WebGL / Three.js (Selective) |
| 8 | Visual contrast & label hierarchy optimization for classroom projection | CSS / UI | Glassmorphism Design System |
| 9 | Tabular data lab state explanations lacking live MIMA snapshot integration | Explanation | MIMA Context Engine |
| 10 | Automated visual regression suite requiring expanded Playwright baselines | QA / Tooling | Playwright Visual Regression |

---

## 3. REFERENCE SIMULATION MODULE FOR WAVE 1 UPGRADE

### Selected Reference Module: `gl-demand-movement-shift` (Demand: Movement vs Shift)
- **File Location:** `js/simulations_graphlab.js`
- **Class & Unit:** Class XI | Part B | Unit 5 (Introductory Microeconomics)
- **Why Selected:** Serves as the primary pedagogical benchmark for Class XI CBSE students, demonstrating direct pointer-drag interactivity, real-time verdict banners distinguishing Movement (Expansion/Contraction) vs Shift (Increase/Decrease), PREDICT gate integration, and full Hindi translation.

### Reusable Components & Infrastructure to Extract
1. **`js/graph-lab-engine.js` Coordinate Engine:** Unified mathematical mapping from economic value $(Q, P)$ to SVG screen coordinates $(x, y)$ with dynamic domain padding.
2. **`js/transition-layer.js` Ghosting Pipeline:** Reusable ghost curve geometry generation for shifted curves.
3. **`js/mima-context.js` & `js/mima-explain.js` Snapshot Generator:** Unified snapshot generation for live MIMA explanation and speech synthesis.

---

## 4. UPGRADE & REGRESSION STRATEGY

1. **Wave 1 (Reference Validation):** Freeze `gl-demand-movement-shift`, `gl-supply-movement-shift`, and `gl-market-equilibrium-shifts` as reference benchmarks.
2. **Wave 2 (Engine Enhancement):** Enhance Plotly layout builders in `js/sim-engine.js` with default arrow annotations and equilibrium guide lines.
3. **Wave 3 (Module Propagation):** Progressively upgrade remaining Class XI Microeconomics and Class XII Macroeconomics modules in batch waves.
4. **Wave 4 (Automated Verification):** Run `npm run verify` (`node --check`, ESLint, `tools/test-curriculum.js`, `tools/build-check.js`, and `tools/smoke.js`) after every module update to enforce zero regressions.
