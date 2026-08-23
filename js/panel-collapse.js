// ══════════════════════════════════════════════════════════════
// Shared collapsible-panel mechanic. Every panel in the app — the home
// screen's module blocks, the sim screen's Concept/Formulas/Readings/
// Practice/Challenge cards, and the controls panel (sliders / data-lab
// table / explorer nav) — can be expanded or collapsed by clicking its
// header. The choice is remembered per PANEL (not per sim) in
// localStorage, so "I always want Concept collapsed" persists across
// every lab and every visit, and collapsing what you don't need is how
// the whole screen ends up fitting with far less scrolling.
//
// Static panels (home module blocks; the sim screen's five info cards)
// are wired once, at page load, by initStaticPanelCollapse(). The
// controls panel is rebuilt from scratch on every sim switch (and, for
// Data Labs, on every add/remove row), so its engine calls
// initPanelCollapse() again each time it rebuilds that header —
// initPanelCollapse() is idempotent (guarded by a data attribute) so
// that never stacks duplicate listeners.
// ══════════════════════════════════════════════════════════════

function loadPanelCollapsed(key, defaultCollapsed) {
    try {
        const v = localStorage.getItem('econsim-panel-' + key);
        if (v === null) return !!defaultCollapsed;
        return v === '1';
    } catch {
        return !!defaultCollapsed;
    }
}

function savePanelCollapsed(key, collapsed) {
    try { localStorage.setItem('econsim-panel-' + key, collapsed ? '1' : '0'); } catch { /* ignore (private browsing etc.) */ }
}

function setPanelCollapsed(panelEl, headerEl, key, collapsed) {
    panelEl.classList.toggle('collapsed', collapsed);
    if (headerEl) headerEl.setAttribute('aria-expanded', String(!collapsed));
    savePanelCollapsed(key, collapsed);
}

// Wires `headerEl` up as the collapse/expand toggle for `panelEl`,
// applying whatever state was last saved under `key` (or
// `defaultCollapsed` on first visit). Safe to call repeatedly on a
// header that gets rebuilt (e.g. every time the controls panel
// re-renders) — re-applies the persisted state without adding a
// second click listener.
function initPanelCollapse(panelEl, headerEl, key, defaultCollapsed) {
    if (!panelEl || !headerEl) return;
    let collapsed = loadPanelCollapsed(key, defaultCollapsed);
    panelEl.classList.toggle('collapsed', collapsed);
    headerEl.setAttribute('aria-expanded', String(!collapsed));
    if (headerEl.dataset.collapseWired === '1') return;
    headerEl.dataset.collapseWired = '1';
    const toggle = () => {
        collapsed = !collapsed;
        setPanelCollapsed(panelEl, headerEl, key, collapsed);
    };
    headerEl.addEventListener('click', toggle);
    headerEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
}

// Wires up every `.collapsible-header[data-panel-key]` already present
// in the DOM at call time — the home page's module headers and the sim
// screen's five static info-card headers. Call once, at app init.
function initStaticPanelCollapse(root) {
    (root || document).querySelectorAll('.collapsible-header[data-panel-key]').forEach(header => {
        const panel = header.closest('.info-card, .module-block');
        if (!panel) return;
        const key = header.dataset.panelKey;
        const defaultCollapsed = header.getAttribute('aria-expanded') === 'false';
        initPanelCollapse(panel, header, key, defaultCollapsed);
    });
}

// A single "Collapse All / Expand All" master switch for every panel
// matching `panelSelector` that currently has a wired collapsible
// header. One click always does something visible: if any panel is
// still expanded, it collapses everything; only once everything is
// already collapsed does it switch to expanding everything.
function wireCollapseAllToggle(buttonEl, panelSelector) {
    if (!buttonEl) return;
    function panels() {
        return [...document.querySelectorAll(panelSelector)]
            .map(panel => ({ panel, header: panel.querySelector('.collapsible-header[data-panel-key]') }))
            .filter(p => p.header);
    }
    // The label is state-dependent (computed from current collapse state),
    // so it can't be a one-shot data-i18n swap like the rest of the static
    // UI (js/i18n_engine.js) — it looks up currentLang/I18N_HI itself, at
    // call time, and re-derives the right string in whichever language is
    // active whenever it's recomputed.
    function refreshLabel() {
        const all = panels();
        const collapsedCount = all.filter(p => p.panel.classList.contains('collapsed')).length;
        const allCollapsed = all.length > 0 && collapsedCount === all.length;
        const isHi = typeof currentLang !== 'undefined' && currentLang === 'hi';
        const dict = (typeof I18N_HI !== 'undefined') ? I18N_HI : {};
        if (allCollapsed) {
            buttonEl.textContent = (isHi && dict['toolbar.expandAll']) || '🗂️ Expand All';
        } else {
            buttonEl.textContent = (isHi && dict['toolbar.collapseAll']) || '🗂️ Collapse All';
        }
    }
    buttonEl.addEventListener('click', () => {
        const all = panels();
        const collapsedCount = all.filter(p => p.panel.classList.contains('collapsed')).length;
        const collapseAll = collapsedCount < all.length;
        all.forEach(({ panel, header }) => setPanelCollapsed(panel, header, header.dataset.panelKey, collapseAll));
        refreshLabel();
    });
    refreshLabel();
    // Individual header clicks (not through this button) should still
    // keep the button's own label honest.
    document.addEventListener('click', (e) => {
        if (e.target.closest(panelSelector)) refreshLabel();
    });
    // Exposed so js/app.js's applyLanguage() can re-derive this button's
    // label immediately on a language switch, without waiting for the
    // next click inside panelSelector.
    buttonEl._refreshCollapseLabel = refreshLabel;
}
