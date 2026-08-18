// ══════════════════════════════════════════════════════════════
// CBSE V-LAB — student progress helpers on top of src/offline/db.js.
// The app must stay usable if this rejects (spec §19: "must remain
// functional if synchronization fails") — callers should treat every
// promise here as best-effort and not block UI on it.
// ══════════════════════════════════════════════════════════════

(function (root) {
    'use strict';
    if (!root || !root.VLAB || !root.VLAB.db) return;

    const db = root.VLAB.db;

    function saveObservationTrial(experimentId, trial) {
        const id = experimentId + ':' + trial.trialNumber;
        return db.put('observations', Object.assign({ id, experimentId, savedAt: Date.now() }, trial));
    }

    function loadObservationTrials(experimentId) {
        return db.getAll('observations').then(rows => rows.filter(r => r.experimentId === experimentId));
    }

    function saveAssessmentResult(experimentId, result) {
        const id = experimentId + ':' + (result.stage || 'result') + ':' + Date.now();
        return db.put('assessmentResults', Object.assign({ id, experimentId, savedAt: Date.now() }, result));
    }

    function saveVivaAttempt(experimentId, questionIndex, attempt) {
        const id = experimentId + ':' + questionIndex + ':' + Date.now();
        return db.put('vivaAttempts', Object.assign({ id, experimentId, questionIndex, savedAt: Date.now() }, attempt));
    }

    function saveExperimentProgress(experimentId, state) {
        return db.put('experimentProgress', Object.assign({ id: experimentId, savedAt: Date.now() }, state));
    }

    function loadExperimentProgress(experimentId) {
        return db.get('experimentProgress', experimentId);
    }

    root.VLAB.progressStore = {
        saveObservationTrial, loadObservationTrials,
        saveAssessmentResult, saveVivaAttempt,
        saveExperimentProgress, loadExperimentProgress
    };
})(typeof window !== 'undefined' ? window : null);
