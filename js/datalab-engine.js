// ══════════════════════════════════════════════════════════════
// Data Lab engine — DATA → TABLE → CALCULATION → GRAPH → INTERPRETATION.
//
// A sim opts in with `mode: 'datalab'` and a `dataLab` config:
//   dataLab: {
//     columns: [{ id, label, type: 'number'|'text', unit?, step?, min?, max?, default? }],
//     defaultRows: [ {colId: value, ...}, ... ],
//     minRows, maxRows,          // row-count bounds for Add/Remove (defaults 2 / 30)
//     addRowDefault: {...},      // template used by "+ Add Row" (else clones the last row)
//     calculate(rows) => ({
//       traces, layout,          // Plotly chart spec (same shape as compute())
//       stats: [{label, value}], // calculated readouts shown above the interpretation
//       interpretation: 'html',  // plain-English takeaway
//       formulas: [...],         // optional — overrides the static formula card
//       metrics: {...}           // optional — feeds an auto-checked `challenge`
//     })
//   }
//
// Reuses the exact same #controls-panel / #sim-dom-overlay / #readings-body
// surfaces the simulator engine renders into, so a Data Lab is visually and
// structurally the same app — not a bolted-on widget. See CLAUDE.md.
// ══════════════════════════════════════════════════════════════

let dataLabRows = [];
let dataLabPrevRows = null;

function cloneRows(rows) {
    return (rows || []).map(r => Object.assign({}, r));
}

// Guards against NaN/blank/out-of-range cells ever reaching calculate() —
// an invalid or empty cell falls back to a safe default instead of
// crashing the computation or propagating NaN into the chart.
function dataLabValidate(sim, rows) {
    const cols = sim.dataLab.columns;
    return rows.map(row => {
        const clean = {};
        cols.forEach(c => {
            if (c.type === 'text') {
                clean[c.id] = (typeof row[c.id] === 'string' && row[c.id].trim()) ? row[c.id] : (c.default || '—');
                return;
            }
            let v = parseFloat(row[c.id]);
            if (!isFinite(v)) v = typeof c.default === 'number' ? c.default : 0;
            if (typeof c.min === 'number') v = Math.max(c.min, v);
            if (typeof c.max === 'number') v = Math.min(c.max, v);
            clean[c.id] = v;
        });
        return clean;
    });
}

function describeRowChange(sim, prevRows, nextRows) {
    if (!prevRows) return '';
    if (prevRows.length < nextRows.length) return `<div class="reading-row whatchanged-row">🔄 <span>What changed:</span> a row was added — n = ${nextRows.length} now.</div>`;
    if (prevRows.length > nextRows.length) return `<div class="reading-row whatchanged-row">🔄 <span>What changed:</span> a row was removed — n = ${nextRows.length} now.</div>`;
    const cols = sim.dataLab.columns;
    for (let i = 0; i < nextRows.length && i < prevRows.length; i++) {
        for (const c of cols) {
            if (String(prevRows[i][c.id]) !== String(nextRows[i][c.id])) {
                return `<div class="reading-row whatchanged-row">🔄 <span>What changed:</span> row ${i + 1} — <b>${c.label}</b>: ${prevRows[i][c.id]} → ${nextRows[i][c.id]}</div>`;
            }
        }
    }
    return '';
}

function renderDataLabTable(sim, container) {
    const cols = sim.dataLab.columns;
    const minRows = sim.dataLab.minRows || 2;
    const maxRows = sim.dataLab.maxRows || 30;
    const canRemove = dataLabRows.length > minRows;
    const canAdd = dataLabRows.length < maxRows;

    let html = `<div class="controls-panel-header collapsible-header" data-panel-key="controls" role="button" tabindex="0"><span>📋 Your Data — edit any cell</span>
            <button type="button" class="reset-btn" id="datalab-reset">↺ Reset</button>
            <span class="panel-chevron" aria-hidden="true">⌄</span>
        </div>
        <p class="controls-panel-hint">Type your own numbers directly into the table below — the calculation, chart and interpretation update instantly. Add or remove rows to try a dataset of your own, not just the sample.</p>
        <div class="datalab-table-wrap"><table class="datalab-table"><thead><tr>`;
    cols.forEach(c => { html += `<th>${c.label}${c.unit ? ` (${c.unit})` : ''}</th>`; });
    html += `<th class="datalab-row-action-col"></th></tr></thead><tbody>`;
    dataLabRows.forEach((row, i) => {
        html += '<tr>';
        cols.forEach(c => {
            const val = row[c.id] === undefined ? '' : row[c.id];
            if (c.type === 'text') {
                html += `<td><input type="text" class="datalab-cell" data-row="${i}" data-col="${c.id}" value="${String(val).replace(/"/g, '&quot;')}" aria-label="${c.label}, row ${i + 1}"></td>`;
            } else {
                html += `<td><input type="number" class="datalab-cell" data-row="${i}" data-col="${c.id}" value="${val}" step="${c.step || 1}"${typeof c.min === 'number' ? ` min="${c.min}"` : ''}${typeof c.max === 'number' ? ` max="${c.max}"` : ''} aria-label="${c.label}, row ${i + 1}"></td>`;
            }
        });
        html += `<td>${canRemove ? `<button type="button" class="datalab-row-remove" data-row="${i}" title="Remove row" aria-label="Remove row ${i + 1}">✕</button>` : ''}</td>`;
        html += '</tr>';
    });
    html += `</tbody></table></div>
        <div class="datalab-toolbar">
            <button type="button" class="datalab-btn" id="datalab-add-row" ${canAdd ? '' : 'disabled'}>+ Add Row</button>
            <span class="datalab-row-count">n = ${dataLabRows.length}</span>
        </div>`;
    container.innerHTML = html;

    container.querySelectorAll('.datalab-cell').forEach(input => {
        const handler = () => {
            const r = parseInt(input.dataset.row, 10);
            const c = input.dataset.col;
            dataLabRows[r][c] = input.value;
            recomputeDataLab(sim, false);
        };
        input.addEventListener('input', handler);
        input.addEventListener('blur', handler);
    });
    container.querySelectorAll('.datalab-row-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            const r = parseInt(btn.dataset.row, 10);
            dataLabRows.splice(r, 1);
            recomputeDataLab(sim, true);
        });
    });
    const addBtn = document.getElementById('datalab-add-row');
    if (addBtn) addBtn.addEventListener('click', () => {
        const template = sim.dataLab.addRowDefault
            ? Object.assign({}, sim.dataLab.addRowDefault)
            : Object.assign({}, dataLabRows[dataLabRows.length - 1] || {});
        dataLabRows.push(template);
        recomputeDataLab(sim, true);
    });
    const resetBtn = document.getElementById('datalab-reset');
    if (resetBtn) {
        // Reset sits inside the same header that toggles collapse — stop
        // the click from bubbling up and also toggling the panel.
        resetBtn.addEventListener('click', (e) => e.stopPropagation());
        resetBtn.addEventListener('click', () => {
            dataLabRows = cloneRows(sim.dataLab.defaultRows);
            dataLabPrevRows = null;
            recomputeDataLab(sim, true);
        });
    }

    const dataLabHeader = container.querySelector('.controls-panel-header');
    if (dataLabHeader && typeof initPanelCollapse === 'function') initPanelCollapse(container, dataLabHeader, 'controls', false);
}

function recomputeDataLab(sim, rebuildTable) {
    const overlay = document.getElementById('sim-dom-overlay');
    const readingsBody = document.getElementById('readings-body');
    const controlsPanel = document.getElementById('controls-panel');
    if (!overlay || !sim.dataLab) return;

    const cleanRows = dataLabValidate(sim, dataLabRows);
    let result;
    try {
        result = sim.dataLab.calculate(cleanRows) || {};
    } catch {
        result = { stats: [], interpretation: 'Could not compute with the current data — check that every cell has a valid number.' };
    }

    const whatChangedHTML = describeRowChange(sim, dataLabPrevRows, cleanRows);

    const base = plotlyDefaultLayout();
    const layout = Object.assign({}, base, result.layout || {});
    layout.xaxis = styledAxisTitle(Object.assign({}, base.xaxis, (result.layout && result.layout.xaxis) || {}));
    layout.yaxis = styledAxisTitle(Object.assign({}, base.yaxis, (result.layout && result.layout.yaxis) || {}));
    if (typeof Plotly !== 'undefined') {
        Plotly.react(overlay, result.traces || [], layout, { displayModeBar: false, responsive: true }).catch(() => {});
    }
    overlay.classList.remove('chart-fresh');
    void overlay.offsetWidth; // restart the CSS "just updated" fade
    overlay.classList.add('chart-fresh');

    if (readingsBody) {
        const statsHTML = (result.stats || []).map(s => `<div class="reading-row"><span>${s.label}</span><b>${s.value}</b></div>`).join('');
        readingsBody.innerHTML = whatChangedHTML + statsHTML + (result.interpretation ? `<div class="reading-row insight-row">💡 ${result.interpretation}</div>` : '');
        readingsBody.classList.remove('pulse');
        void readingsBody.offsetWidth;
        readingsBody.classList.add('pulse');
    }

    if (Array.isArray(result.formulas)) {
        const formulaBody = document.getElementById('formula-body');
        if (formulaBody) formulaBody.innerHTML = result.formulas.map(f => `<div class="formula-line">${f}</div>`).join('');
    }

    if (typeof refreshChallenge === 'function') refreshChallenge(sim, result.metrics);

    dataLabPrevRows = cloneRows(cleanRows);
    if (rebuildTable && controlsPanel) renderDataLabTable(sim, controlsPanel);
}

function renderDataLab(sim) {
    const controlsPanel = document.getElementById('controls-panel');
    if (!controlsPanel || !sim.dataLab) return;
    dataLabRows = cloneRows(sim.dataLab.defaultRows);
    dataLabPrevRows = null;
    renderDataLabTable(sim, controlsPanel);
    recomputeDataLab(sim, false);
}
