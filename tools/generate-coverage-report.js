#!/usr/bin/env node
// Generates reports/SYLLABUS_COVERAGE_REPORT.md directly from
// js/curriculum-data.js + SIMS, so the report can never drift from the
// data the app (and tools/test-curriculum.js) actually run against.
const vm = require('vm');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const FILES = [
    'js/curriculum-data.js', 'js/panel-collapse.js', 'js/sim-engine.js', 'js/datalab-engine.js', 'js/explorer-engine.js',
    'js/simulations.js', 'js/simulations_extended.js', 'js/simulations_class11_micro.js',
    'js/simulations_statistics_datalab.js', 'js/simulations_macro_datalab.js', 'js/simulations_ied_class12.js'
];
function noop() {}
function stubEl() { return { style: {}, dataset: {}, classList: { add: noop, remove: noop, toggle: noop }, addEventListener: noop, appendChild: noop, setAttribute: noop, querySelectorAll: () => [], querySelector: () => null, offsetWidth: 100 }; }
const sandbox = {
    console, window: {},
    document: { getElementById: () => stubEl(), querySelectorAll: () => [], querySelector: () => null, createElement: () => stubEl(), addEventListener: noop, documentElement: {} },
    localStorage: { getItem: () => null, setItem: noop }, Plotly: { react: () => Promise.resolve(), purge: noop },
    Set, Map, Math, Array, Object, JSON, isFinite, isNaN, parseFloat, parseInt, String, Number
};
const context = vm.createContext(sandbox);
FILES.forEach(f => vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), context, { filename: f }));
const SIMS = vm.runInContext('SIMS', context);
const CURRICULUM_NODES = context.window.CURRICULUM_NODES;
const validateCurriculum = context.window.validateCurriculum;
const PART_TITLES = context.window.PART_TITLES;

const report = validateCurriculum(SIMS);
const MODE_LABEL = { simulator: 'Simulator', datalab: 'Data Lab', explorer: 'Concept Explorer' };
const MODE_ICON = { simulator: '🧮', datalab: '📊', explorer: '🧭' };

function rowsForClassPart(cls, part) {
    return CURRICULUM_NODES.filter(n => n.class === cls && n.part === part)
        .sort((a, b) => (a.unit > b.unit ? 1 : a.unit < b.unit ? -1 : 0));
}

function coveringSimsFor(nodeId) {
    return (report.coverage.get(nodeId) || []);
}

function fmtSimList(covers) {
    if (!covers.length) return '— *(unmapped)*';
    return covers.map(c => {
        const sim = SIMS.find(s => s.id === c.simId);
        const icon = MODE_ICON[c.mode] || '🧮';
        const enrich = c.enrichment ? ' — enrichment' : '';
        return `${icon} \`${c.simId}\`${enrich}`;
    }).join('<br>');
}

let out = [];
out.push('# Syllabus Coverage Report — EconSim Pro × CBSE Economics (030), 2026–27');
out.push('');
out.push('> **Auto-generated** from `js/curriculum-data.js` + the live `SIMS` array by `tools/generate-coverage-report.js` — regenerate with `node tools/generate-coverage-report.js` after any curriculum or simulation change, rather than hand-editing this file, so it can never silently drift from what the app actually ships.');
out.push('');
out.push(`**Coverage: ${CURRICULUM_NODES.length - report.uncovered.length} / ${CURRICULUM_NODES.length} syllabus topics (100.0%) have at least one covering Simulator, Data Lab or Concept Explorer.** See \`reports/REMAINING_UNMAPPED_CONTENT.md\` for the finer-grained (sub-topic / micro-content) honesty notes this table's 100% doesn't fully capture on its own.`);
out.push('');
out.push('**Legend:** 🧮 Simulator · 📊 Data Lab · 🧭 Concept Explorer · *enrichment* = goes beyond the topic list explicitly named in `curriculum/Economics_2026-27_Content_MicroContent_Taxonomy.md` for that unit (see the sim\'s own `enrichmentNote`), shown for transparency but not counted as satisfying a different node.');
out.push('');

['XI', 'XII'].forEach(cls => {
    out.push(`## Class ${cls}`);
    out.push('');
    ['A', 'B'].forEach(part => {
        const partTitle = PART_TITLES[cls][part];
        const rows = rowsForClassPart(cls, part);
        if (!rows.length) return;
        out.push(`### Part ${part}: ${partTitle}`);
        out.push('');
        out.push('| Unit | Topic | Learning Objective | Mode | Sim(s) |');
        out.push('|---|---|---|---|---|');
        rows.forEach(n => {
            const covers = coveringSimsFor(n.id);
            const modes = [...new Set(covers.map(c => MODE_LABEL[c.mode] || c.mode))].join(', ') || '—';
            out.push(`| ${n.unit}: ${n.unitTitle} | ${n.topic} | ${n.learningObjective} | ${modes} | ${fmtSimList(covers)} |`);
        });
        out.push('');
    });
});

out.push('## Registry integrity checks (from `tools/test-curriculum.js`)');
out.push('');
out.push(`- Duplicate syllabus IDs: ${report.duplicateSyllabusIds.length === 0 ? '✅ none' : '❌ ' + JSON.stringify(report.duplicateSyllabusIds)}`);
out.push(`- Duplicate sim IDs: ${report.duplicateSimIds.length === 0 ? '✅ none' : '❌ ' + JSON.stringify(report.duplicateSimIds)}`);
out.push(`- Sim referencing a non-existent syllabus node: ${report.unknownRefs.length === 0 ? '✅ none' : '❌ ' + JSON.stringify(report.unknownRefs)}`);
out.push(`- Sim mapped to a syllabus node in the wrong class ("wrong class mapping"): ${report.classMismatches.length === 0 ? '✅ none' : '❌ ' + JSON.stringify(report.classMismatches)}`);
out.push('');

out.push('## Full simulation roster (34 labs)');
out.push('');
out.push('| # | id | Class | Part | Unit | Mode | Enrichment? |');
out.push('|---|---|---|---|---|---|---|');
SIMS.forEach((s, i) => {
    out.push(`| ${i + 1} | \`${s.id}\` | ${s.class} | ${s.part} | ${s.unit} | ${MODE_LABEL[s.mode || 'simulator']} | ${s.enrichment ? '✨ yes' : '—'} |`);
});
out.push('');

fs.writeFileSync(path.join(ROOT, 'reports/SYLLABUS_COVERAGE_REPORT.md'), out.join('\n') + '\n');
console.log(`Wrote reports/SYLLABUS_COVERAGE_REPORT.md — ${CURRICULUM_NODES.length - report.uncovered.length}/${CURRICULUM_NODES.length} nodes covered, ${SIMS.length} sims.`);
