// ══════════════════════════════════════════════════════════════
// CBSE V-LAB — UI rendering (spec §21: LabShell, GlassPanel,
// ApparatusPanel, Workspace, ControlPanel, MeasurementPanel,
// ObservationTable, CalculationPanel, ResultPanel, SafetyPanel,
// VivaPanel, ProgressPanel, OfflineIndicator).
//
// Browser-only (touches document) — not exercised by tools/test-vlab.js.
// Screens are plain functions returning HTML strings; app.js owns the
// session object and re-renders the active screen after every change
// (small app, small DOM — a full diffing layer would be over-
// engineering for one experiment).
// ══════════════════════════════════════════════════════════════

(function (root) {
    'use strict';
    if (!root) return;
    const M = root.VLAB.permanganometry;

    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[c]));
    }
    function fmt(n, d) { return isFinite(n) ? Number(n).toFixed(d == null ? 2 : d) : '—'; }

    function glassPanel(title, bodyHtml, opts) {
        opts = opts || {};
        const id = opts.id ? ` id="${opts.id}"` : '';
        return `<section class="glass-panel"${id}><h3 class="panel-title">${esc(title)}</h3><div class="panel-body">${bodyHtml}</div></section>`;
    }

    // ── ProgressPanel + OfflineIndicator (header strip) ─────────
    function renderHeaderStrip(session) {
        const s = session;
        const steps = [
            { label: 'Pre-Lab', done: s.preLab.done },
            { label: 'Titration', done: s.trials.length > 0 },
            { label: 'Notebook', done: !!s.calculation.result },
            { label: 'Viva', done: s.viva.attempted.size >= s.experiment.viva.length },
            { label: 'Assessment', done: s.sm.state === 'COMPLETED' }
        ];
        const dots = steps.map(st => `<span class="progress-step${st.done ? ' done' : ''}">${st.done ? '✓' : '○'} ${esc(st.label)}</span>`).join('');
        const online = root.navigator ? root.navigator.onLine : true;
        return `
      <div class="header-strip">
        <div class="progress-panel" aria-label="Experiment progress">${dots}</div>
        <div class="offline-indicator ${online ? 'online' : 'offline'}" role="status">
          ${online ? '🟢 Online (optional sync)' : '⚪ Offline — fully functional'}
        </div>
      </div>`;
    }

    // ── Screen: Lab (objective + apparatus + safety + pre-lab) ──
    function renderLabScreen(session) {
        const exp = session.experiment;
        const cm = exp.curriculumMapping;
        const apparatusHtml = `<ul class="apparatus-list">${exp.apparatus.map(a =>
            `<li><b>${esc(a.name)}</b> — ${esc(a.use)}</li>`).join('')}</ul>`;
        const materialsHtml = `<ul class="apparatus-list">${exp.materials.map(m =>
            `<li><b>${esc(m.name)}</b>${m.hazard !== 'None.' ? ` — <span class="hazard">${esc(m.hazard)}</span>` : ''}</li>`).join('')}</ul>`;
        const safetyHtml = `<ul class="safety-list">${exp.safety.map(s => `<li>⚠ ${esc(s.text)}</li>`).join('')}</ul>`;
        const procedureHtml = `<ol class="procedure-list">${exp.procedure.map(p => `<li>${esc(p.text)}</li>`).join('')}</ol>`;

        const preLabHtml = exp.assessment.preLab.map(q => {
            const chosen = session.preLab.answers[q.id];
            const opts = q.options.map((opt, i) => {
                const state = chosen == null ? '' : (i === chosen ? (i === q.correctIndex ? ' correct' : ' incorrect') : (i === q.correctIndex && chosen != null ? ' correct-reveal' : ''));
                return `<button class="mcq-option${state}" data-prelab="${q.id}" data-idx="${i}" ${chosen != null ? 'disabled' : ''}>${esc(opt)}</button>`;
            }).join('');
            const explain = chosen != null ? `<p class="explain">${esc(q.explanation)}</p>` : '';
            return `<div class="mcq-card"><p>${esc(q.question)}</p><div class="mcq-options">${opts}</div>${explain}</div>`;
        }).join('');

        const allAnswered = exp.assessment.preLab.every(q => session.preLab.answers[q.id] != null);
        const beginDisabled = !allAnswered ? 'disabled' : '';

        return `
      <div class="curriculum-badge">CBSE ${cm.curriculumYear} · Class ${cm.class} · ${esc(cm.subject)} (${cm.subjectCode}) · ${esc(cm.unit)}
        <span class="status-chip status-${cm.verificationStatus}">${cm.verificationStatus}</span></div>
      <h2>${esc(exp.title)}</h2>
      <p class="objective">${esc(exp.objective[0])}</p>
      ${glassPanel('🧪 Apparatus', apparatusHtml)}
      ${glassPanel('⚗ Materials & Reagents', materialsHtml)}
      ${glassPanel('⚠ Safety Notes', safetyHtml)}
      ${glassPanel('📋 Procedure', procedureHtml)}
      ${glassPanel('✅ Pre-Lab Check', preLabHtml + `<button id="beginExperimentBtn" class="btn primary" ${beginDisabled}>Begin Experiment →</button>`)}
    `;
    }

    // ── Screen: Workspace (interactive titration) ────────────────
    function renderWorkspaceScreen(session) {
        const exp = session.experiment;
        const f = session.flask;
        const notStarted = session.sm.state === 'INITIALIZED' || session.sm.state === 'READY';
        const startNote = notStarted
            ? `<p class="warning">⚠ Complete the Pre-Lab Check on the Lab tab and click "Begin Experiment" first.</p>`
            : '';
        const eqV = M.equivalenceVolumeML(session.trueMolarity);
        const fs = M.flaskState({
            volumeAddedML: f.volumeAddedML,
            equivalenceVolumeML: eqV,
            temperatureC: f.temperatureC,
            sulfuricAcidAdded: f.sulfuricAcidAdded,
            isStirring: f.isStirring
        });
        const warningsHtml = fs.warnings.length
            ? `<div class="warnings">${fs.warnings.map(w => `<p class="warning">⚠ ${esc(w)}</p>`).join('')}</div>`
            : `<p class="ok-note">No procedural issues detected.</p>`;

        const beakerHtml = `
      <div class="beaker" role="img" aria-label="Conical flask, current colour ${esc(fs.colorState)}">
        <div class="beaker-glass"><div class="beaker-liquid" style="background:${fs.colorHex};height:${Math.min(90, 30 + f.volumeAddedML)}%"></div></div>
        <div class="beaker-caption">${fs.colorState.replace(/-/g, ' ')}</div>
      </div>`;

        const controlsHtml = `
      <div class="control-row">
        <label>H2SO4 (dilute) <button id="addAcidBtn" class="btn ${f.sulfuricAcidAdded ? 'done' : ''}" ${f.sulfuricAcidAdded ? 'disabled' : ''}>${f.sulfuricAcidAdded ? 'Added ✓' : 'Add ~5 mL'}</button></label>
      </div>
      <div class="control-row">
        <label for="tempRange">Temperature: <span id="tempVal">${f.temperatureC}</span>°C</label>
        <input id="tempRange" type="range" min="20" max="100" step="1" value="${f.temperatureC}">
      </div>
      <div class="control-row">
        <label><input id="stirCheck" type="checkbox" ${f.isStirring ? 'checked' : ''}> Swirling the flask</label>
      </div>
      <div class="control-row">
        <label for="buretteRange">Burette (KMnO4 added): <span id="buretteVal">${fmt(f.volumeAddedML, 1)}</span> mL</label>
        <input id="buretteRange" type="range" min="0" max="${M.BURETTE_CAPACITY_ML}" step="0.1" value="${f.volumeAddedML}">
        <div class="btn-row">
          <button class="btn" data-drop="0.1">+0.1 mL</button>
          <button class="btn" data-drop="1">+1 mL</button>
          <button class="btn" id="resetTrialBtn">↺ New trial (fresh aliquot)</button>
        </div>
      </div>
      <button id="recordTitreBtn" class="btn primary" ${f.volumeAddedML <= 0 ? 'disabled' : ''}>Record burette reading →</button>
    `;

        const oxalicM = exp.calculations.inputs[0].fixed;
        const oxalicV = exp.calculations.inputs[1].fixed;
        return `
      ${startNote}
      ${glassPanel('🧫 Titration Workspace', `<div class="workspace-grid">${beakerHtml}<div class="workspace-controls">${controlsHtml}${warningsHtml}</div></div>`)}
      <p class="hint">Aliquot: ${fmt(oxalicV, 1)} mL of standard oxalic acid (${oxalicM} M), pre-measured into the flask for each new trial.</p>
    `;
    }

    // ── Screen: Notebook (observations + calculation + result) ──
    function renderNotebookScreen(session) {
        const exp = session.experiment;
        const rows = session.trials.map(t => `
      <tr><td>${t.trialNumber}</td><td>${fmt(t.initialReadingML, 1)}</td><td>${fmt(t.finalReadingML, 1)}</td><td>${fmt(t.titreVolumeML, 1)}</td></tr>
    `).join('');
        const tableHtml = session.trials.length
            ? `<table class="obs-table"><thead><tr><th>Trial</th><th>Initial (mL)</th><th>Final (mL)</th><th>Titre V (mL)</th></tr></thead><tbody>${rows}</tbody></table>`
            : `<p class="muted">No trials recorded yet — go to the Workspace tab and titrate to record a reading.</p>`;

        let concordanceHtml = '';
        let meanTitre = null;
        if (session.trials.length >= 2) {
            const last2 = session.trials.slice(-2);
            const concordant = M.areConcordant(last2[0].titreVolumeML, last2[1].titreVolumeML, exp.observationModel.concordanceToleranceML);
            if (concordant) meanTitre = (last2[0].titreVolumeML + last2[1].titreVolumeML) / 2;
            concordanceHtml = `<p class="${concordant ? 'ok-note' : 'warning'}">${concordant ? '✓ Last two readings are concordant (within 0.1 mL) — ready to calculate.' : '⚠ Last two readings are not concordant — repeat the titration for a fresh aliquot.'}</p>`;
        }

        const calcHtml = `
      <p>M(KMnO4) = (2 × M(oxalic) × V(oxalic)) / (5 × mean concordant titre)</p>
      <p>M(oxalic) = ${exp.calculations.inputs[0].fixed} mol/L &nbsp; V(oxalic) = ${exp.calculations.inputs[1].fixed} mL &nbsp; Mean titre = ${meanTitre != null ? fmt(meanTitre, 2) + ' mL' : '— (need concordant trials)'}</p>
      <div class="control-row">
        <label for="molarityInput">Your calculated molarity of KMnO4 (mol/L):</label>
        <input id="molarityInput" type="number" step="0.001" min="0" ${meanTitre == null ? 'disabled' : ''} value="${session.calculation.studentAnswer != null ? session.calculation.studentAnswer : ''}">
        <button id="checkAnswerBtn" class="btn primary" ${meanTitre == null ? 'disabled' : ''}>Check answer</button>
      </div>
      ${session.calculation.result ? `<p class="${session.calculation.result.correct ? 'ok-note' : 'warning'}">${session.calculation.result.correct ? '✓ Within 5% of the accepted value.' : '⚠ Outside 5% tolerance — recheck your titre and formula.'} (Percent error: ${fmt(session.calculation.result.percentError, 2)}%)</p>` : ''}
    `;

        return `
      ${glassPanel('📓 Observation Notebook', tableHtml + concordanceHtml, { id: 'notebook-panel' })}
      ${glassPanel('🧮 Calculation & Result', calcHtml, { id: 'calc-panel' })}
    `;
    }

    // ── Screen: Viva ──────────────────────────────────────────────
    function renderVivaScreen(session) {
        const cards = session.experiment.viva.map((q, i) => {
            const open = session.viva.attempted.has(i);
            return `
        <div class="viva-card">
          <p><b>Q${i + 1}.</b> ${esc(q.question)} <span class="chip">${esc(q.difficulty)}</span></p>
          <button class="btn" data-viva-toggle="${i}">${open ? 'Hide answer notes' : 'Show answer notes'}</button>
          ${open ? `<div class="viva-answer">
              <p><b>Expected concept:</b> ${esc(q.expectedConcept)}</p>
              <p class="muted"><b>Common misconception:</b> ${esc(q.commonMisconception)}</p>
            </div>` : ''}
        </div>`;
        }).join('');
        return glassPanel('🗣 Viva Voce', cards + `<p class="muted">Attempted ${session.viva.attempted.size} of ${session.experiment.viva.length}.</p>`);
    }

    // ── Screen: Assessment (post-lab + complete) ─────────────────
    function renderAssessmentScreen(session) {
        const exp = session.experiment;
        const mcq = exp.assessment.postLab.find(q => q.type === 'calculation');
        const short = exp.assessment.postLab.find(q => q.type === 'short-answer');
        const calcOk = !!(session.calculation.result && session.calculation.result.correct);

        const calcSection = `<p>${esc(mcq.question)}</p><p class="${calcOk ? 'ok-note' : 'muted'}">${calcOk ? '✓ Completed via the Notebook tab.' : 'Not yet completed — finish the calculation in the Notebook tab.'}</p>`;

        const shortAnswerVal = session.postLab.shortAnswer || '';
        const shortSection = `
      <p>${esc(short.question)}</p>
      <textarea id="shortAnswerInput" rows="3" placeholder="Type your answer...">${esc(shortAnswerVal)}</textarea>
    `;

        const canComplete = assessmentCanComplete(session);
        const noteClass = session.sm.state === 'COMPLETED' ? 'ok-note' : 'muted';
        const noteText = session.sm.state === 'COMPLETED'
            ? '✓ Experiment marked complete.'
            : (!canComplete ? 'Complete the calculation, the short answer, and at least 3 viva questions to finish.' : '');

        return `
      ${glassPanel('📝 Post-Lab Assessment', calcSection + '<hr>' + shortSection)}
      <button id="markCompleteBtn" class="btn primary" ${(!canComplete || session.sm.state === 'COMPLETED') ? 'disabled' : ''}>Mark Experiment Complete ✓</button>
      <p id="completeNote" class="${noteClass}">${esc(noteText)}</p>
    `;
    }

    // Shared by renderAssessmentScreen (initial paint) and app.js's
    // shortAnswerInput typing handler (a live update without a full
    // innerHTML re-render, which would otherwise steal focus/caret
    // from the textarea on every keystroke).
    function assessmentCanComplete(session) {
        const exp = session.experiment;
        const calcOk = !!(session.calculation.result && session.calculation.result.correct);
        return calcOk && !!(session.postLab.shortAnswer && session.postLab.shortAnswer.trim().length > 0)
            && session.viva.attempted.size >= Math.min(3, exp.viva.length);
    }

    root.VLAB.ui = root.VLAB.ui || {};
    root.VLAB.ui.render = {
        renderHeaderStrip, renderLabScreen, renderWorkspaceScreen,
        renderNotebookScreen, renderVivaScreen, renderAssessmentScreen,
        assessmentCanComplete,
        esc, fmt
    };
})(typeof window !== 'undefined' ? window : null);
