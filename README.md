# EconSim Pro — CBSE Economics (030) Simulator, Class XI & XII

An interactive learning app for the CBSE Economics 2026–27 syllabus (Subject Code 030) — 6 Living Worlds
(role-play economies you run yourself) and 44 Simulators, Graph Labs, Data Labs and Concept Explorers covering Statistics for Economics, Introductory Microeconomics (Class XI),
Introductory Macroeconomics, and Indian Economic Development (Class XII). Static HTML/CSS/JS, no build step,
Plotly for charts.

- **Live the Economy:** run a chai stall, sell in a mandi, spend pocket money, survey a town, manage a
  bank, present a Budget. You decide first; the textbook name comes afterwards, from your own data.
  English and Hindi. Models: `docs/economics/models/living-worlds.md`.
- **Architecture, data contract, working conventions:** see `CLAUDE.md`.
- **Curriculum source of truth:** `curriculum/Economics_2026-27_Content_MicroContent_Taxonomy.md`.
- **Coverage matrix, QA results, calculation tests, known gaps:** see `reports/`.
- **Run locally:** open `index.html` in a browser, or `npx http-server .`.
- **Run checks:** `npm run verify` (typecheck, lint, curriculum/calculation tests, build check, headless
  browser smoke test — see `CLAUDE.md` for what each substitutes for in a no-bundler codebase).
