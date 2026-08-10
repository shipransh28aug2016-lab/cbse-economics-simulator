# EconSim Pro — CBSE Economics (030) Simulator, Class XI & XII

An interactive learning app for the CBSE Economics 2026–27 syllabus (Subject Code 030) — 34 Simulators,
Data Labs and Concept Explorers covering Statistics for Economics, Introductory Microeconomics (Class XI),
Introductory Macroeconomics, and Indian Economic Development (Class XII). Static HTML/CSS/JS, no build step,
Plotly for charts.

- **Architecture, data contract, working conventions:** see `CLAUDE.md`.
- **Curriculum source of truth:** `curriculum/Economics_2026-27_Content_MicroContent_Taxonomy.md`.
- **Coverage matrix, QA results, calculation tests, known gaps:** see `reports/`.
- **Run locally:** open `index.html` in a browser, or `npx http-server .`.
- **Run checks:** `npm run verify` (typecheck, lint, curriculum/calculation tests, build check, headless
  browser smoke test — see `CLAUDE.md` for what each substitutes for in a no-bundler codebase).
