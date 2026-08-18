// ══════════════════════════════════════════════════════════════
// CBSE V-LAB — app bootstrap.
// Owns the session object (state machine + one experiment's live
// student state), wires nav + event delegation, and re-renders the
// active screen after every change. Loaded last, after every src/*.js
// script tag (see vlab/index.html).
// ══════════════════════════════════════════════════════════════

(function () {
    'use strict';
    const VLAB = window.VLAB;
    const R = VLAB.ui.render;
    const M = VLAB.permanganometry;

    const exp = VLAB.experiments[0]; // one-experiment MVP slice

    function newSession() {
        const sm = VLAB.stateMachine.createLabStateMachine('INITIALIZED');
        return {
            experiment: exp,
            sm,
            trueMolarity: M.pickUnknownMolarity(Date.now() ^ 0x9e3779b9),
            preLab: { answers: {}, done: false },
            flask: { volumeAddedML: 0, temperatureC: 25, sulfuricAcidAdded: false, isStirring: true },
            trials: [],
            calculation: { studentAnswer: null, result: null },
            viva: { attempted: new Set() },
            postLab: { shortAnswer: '' },
            screen: 'lab'
        };
    }

    let session = newSession();

    const SCREENS = {
        lab: { label: '🧪 Lab', render: R.renderLabScreen },
        workspace: { label: '⚗ Workspace', render: R.renderWorkspaceScreen },
        notebook: { label: '📓 Notebook', render: R.renderNotebookScreen },
        viva: { label: '🗣 Viva', render: R.renderVivaScreen },
        assessment: { label: '📝 Assessment', render: R.renderAssessmentScreen }
    };

    function persist() {
        if (!VLAB.progressStore) return;
        VLAB.progressStore.saveExperimentProgress(exp.id, {
            state: session.sm.state,
            trialCount: session.trials.length,
            vivaAttempted: session.viva.attempted.size,
            calculationCorrect: !!(session.calculation.result && session.calculation.result.correct),
            completed: session.sm.state === 'COMPLETED'
        }).catch(function () { /* offline / storage unavailable — non-fatal */ });
    }

    function render() {
        const app = document.getElementById('app');
        const navHtml = Object.keys(SCREENS).map(id =>
            `<button class="nav-tab${session.screen === id ? ' active' : ''}" data-screen="${id}">${SCREENS[id].label}</button>`
        ).join('');
        app.innerHTML = `
      ${R.renderHeaderStrip(session)}
      <nav class="screen-nav" aria-label="Lab sections">${navHtml}</nav>
      <main class="screen-body">${SCREENS[session.screen].render(session)}</main>
    `;
        bindEvents();
    }

    function goto(screenId) { session.screen = screenId; render(); }

    // Targeted DOM update for the Assessment screen's gate, used where a
    // full render() would blow away in-progress typing (see
    // shortAnswerInput.oninput below).
    function refreshCompleteGate() {
        const btn = document.getElementById('markCompleteBtn');
        const note = document.getElementById('completeNote');
        if (!btn || !note) return;
        const canComplete = R.assessmentCanComplete(session);
        btn.disabled = !canComplete || session.sm.state === 'COMPLETED';
        note.textContent = canComplete ? '' : 'Complete the calculation, the short answer, and at least 3 viva questions to finish.';
    }

    function bindEvents() {
        document.querySelectorAll('[data-screen]').forEach(btn => {
            btn.onclick = () => goto(btn.dataset.screen);
        });

        // ── Lab screen: pre-lab MCQ + begin experiment ──
        document.querySelectorAll('[data-prelab]').forEach(btn => {
            btn.onclick = () => {
                const qId = btn.dataset.prelab;
                if (session.preLab.answers[qId] != null) return;
                session.preLab.answers[qId] = Number(btn.dataset.idx);
                const allDone = exp.assessment.preLab.every(q => session.preLab.answers[q.id] != null);
                if (allDone) session.preLab.done = true;
                render();
            };
        });
        const beginBtn = document.getElementById('beginExperimentBtn');
        if (beginBtn) beginBtn.onclick = () => {
            if (session.sm.can('READY')) session.sm.transition('READY');
            if (session.sm.can('RUNNING')) session.sm.transition('RUNNING');
            goto('workspace');
        };

        // ── Workspace screen ──
        const addAcidBtn = document.getElementById('addAcidBtn');
        if (addAcidBtn) addAcidBtn.onclick = () => { session.flask.sulfuricAcidAdded = true; render(); };
        const tempRange = document.getElementById('tempRange');
        if (tempRange) tempRange.oninput = (e) => { session.flask.temperatureC = Number(e.target.value); render(); };
        const stirCheck = document.getElementById('stirCheck');
        if (stirCheck) stirCheck.onchange = (e) => { session.flask.isStirring = e.target.checked; render(); };
        // Any addition of titrant (slider drag or the +0.1/+1 mL
        // buttons) counts as starting to measure — both paths must
        // drive the same state-machine transition, or the downstream
        // OBSERVATION/CALCULATION/RESULT/ASSESSMENT/COMPLETED chain
        // silently never fires for whichever path a student actually uses.
        function beginMeasuring() { if (session.sm.can('MEASURING')) session.sm.transition('MEASURING'); }
        const buretteRange = document.getElementById('buretteRange');
        if (buretteRange) buretteRange.oninput = (e) => {
            session.flask.volumeAddedML = Number(e.target.value);
            beginMeasuring();
            render();
        };
        document.querySelectorAll('[data-drop]').forEach(btn => {
            btn.onclick = () => {
                const inc = Number(btn.dataset.drop);
                session.flask.volumeAddedML = Math.min(M.BURETTE_CAPACITY_ML, session.flask.volumeAddedML + inc);
                beginMeasuring();
                render();
            };
        });
        const resetTrialBtn = document.getElementById('resetTrialBtn');
        if (resetTrialBtn) resetTrialBtn.onclick = () => {
            session.flask = { volumeAddedML: 0, temperatureC: 25, sulfuricAcidAdded: false, isStirring: true };
            render();
        };
        const recordTitreBtn = document.getElementById('recordTitreBtn');
        if (recordTitreBtn) recordTitreBtn.onclick = () => {
            const trial = {
                trialNumber: session.trials.length + 1,
                initialReadingML: 0,
                finalReadingML: session.flask.volumeAddedML,
                titreVolumeML: session.flask.volumeAddedML
            };
            session.trials.push(trial);
            if (VLAB.progressStore) VLAB.progressStore.saveObservationTrial(exp.id, trial).catch(function () {});
            if (session.sm.can('OBSERVATION')) session.sm.transition('OBSERVATION');
            persist();
            goto('notebook');
        };

        // ── Notebook screen ──
        const molarityInput = document.getElementById('molarityInput');
        if (molarityInput) molarityInput.oninput = (e) => {
            session.calculation.studentAnswer = e.target.value === '' ? null : Number(e.target.value);
        };
        const checkAnswerBtn = document.getElementById('checkAnswerBtn');
        if (checkAnswerBtn) checkAnswerBtn.onclick = () => {
            if (session.calculation.studentAnswer == null) return;
            if (session.sm.can('CALCULATION')) session.sm.transition('CALCULATION');
            session.calculation.result = M.validateMolarityAnswer(session.calculation.studentAnswer, session.trueMolarity, exp.expectedResult.toleranceForCorrectPercent);
            if (session.sm.can('RESULT')) session.sm.transition('RESULT');
            if (VLAB.progressStore) {
                VLAB.progressStore.saveAssessmentResult(exp.id, { stage: 'calculation', studentAnswer: session.calculation.studentAnswer, result: session.calculation.result }).catch(function () {});
            }
            persist();
            render();
        };

        // ── Viva screen ──
        document.querySelectorAll('[data-viva-toggle]').forEach(btn => {
            btn.onclick = () => {
                const i = Number(btn.dataset.vivaToggle);
                if (session.viva.attempted.has(i)) { session.viva.attempted.delete(i); }
                else {
                    session.viva.attempted.add(i);
                    if (VLAB.progressStore) VLAB.progressStore.saveVivaAttempt(exp.id, i, { question: exp.viva[i].question }).catch(function () {});
                }
                persist();
                render();
            };
        });

        // ── Assessment screen ──
        const shortAnswerInput = document.getElementById('shortAnswerInput');
        if (shortAnswerInput) shortAnswerInput.oninput = (e) => {
            session.postLab.shortAnswer = e.target.value;
            refreshCompleteGate(); // live-update the button without a full re-render (would steal focus/caret)
        };
        const markCompleteBtn = document.getElementById('markCompleteBtn');
        if (markCompleteBtn) markCompleteBtn.onclick = () => {
            if (session.sm.can('ASSESSMENT')) session.sm.transition('ASSESSMENT');
            if (session.sm.can('COMPLETED')) session.sm.transition('COMPLETED');
            if (VLAB.progressStore) {
                VLAB.progressStore.saveAssessmentResult(exp.id, { stage: 'post-lab', shortAnswer: session.postLab.shortAnswer }).catch(function () {});
            }
            persist();
            render();
        };
    }

    function registerServiceWorker() {
        if ('serviceWorker' in navigator && (location.protocol === 'http:' || location.protocol === 'https:')) {
            navigator.serviceWorker.register('sw.js').catch(function () { /* offline install optional, never fatal */ });
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        render();
        registerServiceWorker();
    });
})();
