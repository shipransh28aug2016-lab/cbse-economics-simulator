#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════
// CBSE V-LAB — Node test harness (spec §24, §28).
// DOM-free: requires src/*.js directly (each has a module.exports
// guard, no `document` touched by the files loaded here) and:
//   1. Sweeps the titration simulation model for scientific
//      correctness (stoichiometry, endpoint detection, edge cases).
//   2. Runs the state-machine transition table for illegal moves.
//   3. Runs the curriculum-registry audit (spec §28) and prints the
//      same style of summary the spec's example shows.
// Exits non-zero on any failure.
// ══════════════════════════════════════════════════════════════
const path = require('path');

const ROOT = path.join(__dirname, '..');
const M = require(path.join(ROOT, 'src/simulation/permanganometry-model.js'));
const SM = require(path.join(ROOT, 'src/core/state-machine.js'));
const CURRICULUM = require(path.join(ROOT, 'src/curriculum/registry.js'));
const { EXPERIMENT } = require(path.join(ROOT, 'src/experiments/xii-chem-permanganometry.js'));

let failures = 0;
function check(name, cond, detail) {
    if (cond) { console.log('  ok   ' + name); }
    else { failures++; console.log('  FAIL ' + name + (detail ? ' — ' + detail : '')); }
}
function approx(a, b, eps) { return Math.abs(a - b) <= (eps == null ? 1e-9 : eps); }

console.log('\n=== Simulation model: permanganometry ===');

// 1. Stoichiometry round-trip: equivalenceVolumeML and
//    computeMolarityFromTitration must be exact inverses for every
//    candidate unknown molarity.
M.UNKNOWN_MOLARITY_CANDIDATES.forEach((trueM) => {
    const eqV = M.equivalenceVolumeML(trueM);
    check(`round-trip molarity=${trueM}`, isFinite(eqV) && eqV > 0, `eqV=${eqV}`);
    const back = M.computeMolarityFromTitration(eqV);
    check(`inverse recovers molarity=${trueM}`, approx(back, trueM, 1e-9), `got ${back}`);
});

// 2. Known worked example: M(oxalic)=0.05, V(oxalic)=10 mL,
//    M(KMnO4)=0.02 -> eqV = (2*0.05*10)/(5*0.02) = 10 mL.
check('worked example: 0.02 M KMnO4 -> 10.0 mL titre',
    approx(M.equivalenceVolumeML(0.02), 10, 1e-9), M.equivalenceVolumeML(0.02));

// 3. requiredOxalicAcidMassGrams: 0.05 mol/L * 0.25 L * 126.07 g/mol ≈ 1.5759 g
check('oxalic acid mass for M/20, 250 mL ≈ 1.576 g',
    approx(M.requiredOxalicAcidMassGrams(0.05, 0.25), 1.5759, 0.001),
    M.requiredOxalicAcidMassGrams(0.05, 0.25));

// 4. flaskState: no acid -> error state regardless of volume/temp.
check('no acid added -> error-no-acid',
    M.flaskState({ volumeAddedML: 5, equivalenceVolumeML: 10, temperatureC: 65, sulfuricAcidAdded: false }).colorState === 'error-no-acid');

// 5. flaskState: below equivalence with acid+heat -> colorless.
check('under-titrated, acidified, heated -> colorless',
    M.flaskState({ volumeAddedML: 5, equivalenceVolumeML: 10, temperatureC: 65, sulfuricAcidAdded: true }).colorState === 'colorless');

// 6. flaskState: at equivalence -> endpoint.
check('at equivalence -> endpoint',
    M.flaskState({ volumeAddedML: 10, equivalenceVolumeML: 10, temperatureC: 65, sulfuricAcidAdded: true }).colorState === 'endpoint');

// 7. flaskState: well past equivalence -> overshot, with a warning.
{
    const r = M.flaskState({ volumeAddedML: 15, equivalenceVolumeML: 10, temperatureC: 65, sulfuricAcidAdded: true });
    check('overshot -> overshot state with warning', r.colorState === 'overshot' && r.warnings.length > 0);
}

// 8. flaskState: cold temperature -> warning + reduced reaction rate, but not a hard error.
{
    const r = M.flaskState({ volumeAddedML: 5, equivalenceVolumeML: 10, temperatureC: 25, sulfuricAcidAdded: true });
    check('cold flask -> warns and slows reaction', r.warnings.length > 0 && r.reactionRateFactor < 1);
}

// 9. flaskState: overheated -> warning.
{
    const r = M.flaskState({ volumeAddedML: 5, equivalenceVolumeML: 10, temperatureC: 95, sulfuricAcidAdded: true });
    check('overheated -> decomposition warning', r.warnings.some(w => /decompos/i.test(w)));
}

// 10. flaskState: no stirring near endpoint -> local colour artifact + warning.
{
    const r = M.flaskState({ volumeAddedML: 9.7, equivalenceVolumeML: 10, temperatureC: 65, sulfuricAcidAdded: true, isStirring: false });
    check('no stirring near endpoint -> local artifact flagged', r.localColorArtifact === true);
}

// 11. Edge cases: zero/negative/non-finite inputs must never throw or
//     produce NaN silently accepted as a valid state.
[0, -1, NaN, Infinity].forEach((bad) => {
    let threw = false;
    let result;
    try { result = M.equivalenceVolumeML(bad); } catch { threw = true; }
    check(`equivalenceVolumeML(${bad}) does not throw`, !threw);
    if (!threw) check(`equivalenceVolumeML(${bad}) is not a finite positive misleadingly`, !(result > 0 && isFinite(result)) || bad > 0);
});
check('computeMolarityFromTitration(0) -> NaN, not a crash', Number.isNaN(M.computeMolarityFromTitration(0)));
check('computeMolarityFromTitration(-5) -> NaN, not a crash', Number.isNaN(M.computeMolarityFromTitration(-5)));

// 12. Concordance + grading.
check('concordant readings within 0.1 mL', M.areConcordant(10.0, 10.05));
check('non-concordant readings beyond 0.1 mL', !M.areConcordant(9.8, 11.3));
check('gradeTitre flags within-tolerance trial', M.gradeTitre(10.1, 10.0, 0.2).withinTolerance);
check('gradeTitre flags out-of-tolerance trial', !M.gradeTitre(11.0, 10.0, 0.2).withinTolerance);

// 13. Answer validation, both directions of the 5% tolerance band.
{
    const trueM = 0.02;
    check('answer within 5% -> correct', M.validateMolarityAnswer(0.0205, trueM, 5).correct);
    check('answer outside 5% -> incorrect', !M.validateMolarityAnswer(0.024, trueM, 5).correct);
    check('non-numeric/zero answer handled without throwing', M.validateMolarityAnswer(0, trueM, 5).correct === false);
}

// 14. Deterministic PRNG: same seed -> same sample (needed for
//     reproducible test runs and for grading a specific session).
check('pickUnknownMolarity is deterministic per seed', M.pickUnknownMolarity(42) === M.pickUnknownMolarity(42));

console.log('\n=== State machine ===');
{
    const sm = SM.createLabStateMachine('INITIALIZED');
    const forwardPath = ['READY', 'RUNNING', 'MEASURING', 'OBSERVATION', 'CALCULATION', 'RESULT', 'ASSESSMENT', 'COMPLETED'];
    let ok = true;
    forwardPath.forEach((s) => { try { sm.transition(s); } catch { ok = false; } });
    check('full forward path INITIALIZED -> COMPLETED succeeds', ok && sm.state === 'COMPLETED');

    const sm2 = SM.createLabStateMachine('INITIALIZED');
    let threw = false;
    try { sm2.transition('RESULT'); } catch { threw = true; }
    check('illegal jump INITIALIZED -> RESULT throws', threw);

    const sm3 = SM.createLabStateMachine('INITIALIZED');
    sm3.transition('READY'); sm3.transition('RUNNING'); sm3.transition('MEASURING');
    sm3.transition('RUNNING'); // retry a trial
    check('MEASURING -> RUNNING retry is legal', sm3.state === 'RUNNING');
}

console.log('\n=== CBSE 2026-27 Curriculum Audit (Chemistry, V-LAB slice) ===');
{
    const report = CURRICULUM.validateCurriculumRegistry([EXPERIMENT]);
    console.log(`Experiments: ${report.experimentCount}`);
    console.log(`Verified: ${report.verified}`);
    console.log(`Needs Review: ${report.needsReview}`);
    console.log(`Orphaned Curriculum Topics: ${report.orphanedTopics.length}`);
    console.log(`Duplicate Experiment IDs: ${report.duplicateExperimentIds.length}`);
    console.log(`Unknown Curriculum Refs: ${report.unknownRefs.length}`);
    console.log(`Class Mismatches: ${report.classMismatches.length}`);
    console.log(`Missing Required Fields: ${report.missingFields.length}`);

    check('experiment maps to a known curriculum topic', report.unknownRefs.length === 0, JSON.stringify(report.unknownRefs));
    check('no class/subject mismatch', report.classMismatches.length === 0, JSON.stringify(report.classMismatches));
    check('no duplicate experiment IDs', report.duplicateExperimentIds.length === 0, JSON.stringify(report.duplicateExperimentIds));
    check('no required Experiment fields missing', report.missingFields.length === 0, JSON.stringify(report.missingFields));
    check('every registered curriculum topic is covered by an experiment', report.orphanedTopics.length === 0, JSON.stringify(report.orphanedTopics));
    check('EXPERIMENT.curriculumMapping.verificationStatus is honestly "needs-review", not falsely "verified"',
        EXPERIMENT.curriculumMapping.verificationStatus === 'needs-review');

    console.log(`STATUS: ${report.needsReview > 0 ? 'PASS WITH REVIEW ITEMS' : 'PASS'}`);
}

console.log('\n=== Experiment content structural checks ===');
check('viva bank spans multiple difficulty levels', new Set(EXPERIMENT.viva.map(v => v.difficulty)).size >= 3);
check('every viva question has expectedConcept and commonMisconception',
    EXPERIMENT.viva.every(v => v.expectedConcept && v.commonMisconception));
check('every apparatus item has a use', EXPERIMENT.apparatus.every(a => a.use && a.use.length > 5));
check('at least 5 safety notes', EXPERIMENT.safety.length >= 5);
check('observationModel.minTrials matches concordance-check design (2)', EXPERIMENT.observationModel.minTrials === 2);
check('pre-lab MCQs all have a correctIndex within range',
    EXPERIMENT.assessment.preLab.every(q => q.correctIndex >= 0 && q.correctIndex < q.options.length));

console.log(failures === 0 ? '\nAll V-LAB checks passed.\n' : `\n${failures} V-LAB check(s) FAILED.\n`);
process.exit(failures === 0 ? 0 : 1);
