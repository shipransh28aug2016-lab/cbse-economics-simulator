// ══════════════════════════════════════════════════════════════
// HOLO MODE — an immersive "touch the hologram" presentation layer for
// every Graph Lab (mode: 'graphlab'), switched on per-viewer.
//
// Presentation only. It never computes an economic fact: the floating
// HUD shows the SAME verdict + readings the lab's own graphLab.model()
// just returned (handed in by glRender), and every drag still goes
// through the engine's one generic handle rule. What it adds:
//   • a dark holographic theme (neon curves, live grid, HUD brackets)
//   • a touch ripple wherever the diagram is pressed
//   • a gentle 3D parallax tilt that follows the pointer — FROZEN flat
//     the instant a press starts, because glPointerToData() converts
//     pointer → data through svg.getScreenCTM(), which is a 2D matrix
//     and would mis-map a drag on a 3D-tilted surface
//   • a fullscreen stage for projectors / smartboards / tablets
// Respects prefers-reduced-motion (no tilt, no scanline animation).
// ══════════════════════════════════════════════════════════════

const HOLO_KEY = 'econsim-holo';
const HOLO_MAX_TILT = 6; // degrees

function holoEnabled() {
    try { return localStorage.getItem(HOLO_KEY) !== '0'; } catch { return true; }
}
function holoSave(on) {
    try { localStorage.setItem(HOLO_KEY, on ? '1' : '0'); } catch { /* private mode */ }
}
function holoReducedMotion() {
    return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
function holoLabel(en, hi) {
    return (typeof currentLang !== 'undefined' && currentLang === 'hi') ? hi : en;
}
// Plain text of a model-built HTML string, entities decoded (so "MC &lt; AC"
// reads "MC < AC" once re-escaped). DOMParser documents are inert: nothing
// in them loads or runs.
function holoStrip(html) {
    const s = String(html == null ? '' : html);
    const text = typeof DOMParser === 'function'
        ? new DOMParser().parseFromString(s, 'text/html').body.textContent
        : s.replace(/<[^>]*>/g, ' ');
    return text.replace(/\s+/g, ' ').trim();
}

function holoApply(host, on) {
    host.classList.toggle('gl-holo', on);
    const btn = host.querySelector('#gl-holo-btn');
    if (btn) {
        btn.textContent = on ? holoLabel('🛸 Holo: ON', '🛸 होलो: चालू') : holoLabel('🛸 Holo: OFF', '🛸 होलो: बंद');
        btn.classList.toggle('gl-holo-btn--on', on);
        btn.setAttribute('aria-pressed', String(on));
    }
    const wrap = host.querySelector('.gl-canvas-wrap');
    if (wrap && !on) wrap.style.transform = '';
}

function holoRipple(wrap, e) {
    const r = wrap.getBoundingClientRect();
    const dot = document.createElement('span');
    dot.className = 'gl-holo-ripple';
    dot.style.left = (e.clientX - r.left) + 'px';
    dot.style.top = (e.clientY - r.top) + 'px';
    wrap.appendChild(dot);
    setTimeout(() => dot.remove(), 700);
}

// Called once, when glRender() first builds a lab's .gl-shell.
function holoAttach(host) {
    if (!host || host.dataset.holoWired === '1') return;
    host.dataset.holoWired = '1';

    const actions = host.querySelector('.gl-strip-actions');
    if (actions) {
        const holoBtn = document.createElement('button');
        holoBtn.type = 'button';
        holoBtn.className = 'gl-holo-btn';
        holoBtn.id = 'gl-holo-btn';
        holoBtn.addEventListener('click', () => {
            const on = !host.classList.contains('gl-holo');
            holoSave(on);
            holoApply(host, on);
        });
        actions.insertBefore(holoBtn, actions.firstChild);

        if (host.requestFullscreen) {
            const fsBtn = document.createElement('button');
            fsBtn.type = 'button';
            fsBtn.className = 'gl-holo-btn';
            fsBtn.id = 'gl-fullscreen-btn';
            fsBtn.textContent = holoLabel('⛶ Fullscreen', '⛶ पूर्ण स्क्रीन');
            fsBtn.addEventListener('click', () => {
                if (document.fullscreenElement) document.exitFullscreen();
                else host.requestFullscreen().catch(() => { /* blocked by browser policy */ });
            });
            actions.insertBefore(fsBtn, holoBtn.nextSibling);
        }
    }

    const wrap = host.querySelector('.gl-canvas-wrap');
    if (wrap) {
        const hud = document.createElement('div');
        hud.className = 'gl-holo-hud';
        hud.id = 'gl-holo-hud';
        hud.setAttribute('aria-hidden', 'true');
        // A strip ABOVE the diagram, never floating over it — an overlay
        // would hide whichever curve label happens to sit in that corner.
        wrap.parentNode.insertBefore(hud, wrap);

        let pressed = false;
        // Capture phase: runs BEFORE the handle's own pointerdown, so the
        // surface is already flat when glPointerToData() reads the CTM.
        wrap.addEventListener('pointerdown', e => {
            if (!host.classList.contains('gl-holo')) return;
            pressed = true;
            wrap.style.transition = 'none';
            wrap.style.transform = '';
            holoRipple(wrap, e);
        }, true);
        const release = () => {
            pressed = false;
            wrap.style.transition = '';
        };
        window.addEventListener('pointerup', release);
        window.addEventListener('pointercancel', release);

        wrap.addEventListener('pointermove', e => {
            if (pressed || e.pointerType !== 'mouse' || !host.classList.contains('gl-holo') || holoReducedMotion()) return;
            const r = wrap.getBoundingClientRect();
            const nx = ((e.clientX - r.left) / (r.width || 1)) - 0.5;
            const ny = ((e.clientY - r.top) / (r.height || 1)) - 0.5;
            wrap.style.transform = `perspective(1400px) rotateX(${(-ny * HOLO_MAX_TILT).toFixed(2)}deg) rotateY(${(nx * HOLO_MAX_TILT).toFixed(2)}deg)`;
        });
        wrap.addEventListener('pointerleave', () => { if (!pressed) wrap.style.transform = ''; });
    }

    holoApply(host, holoEnabled());
}

// Called after every glRender(), with the model output it just drew.
function holoUpdate(host, m) {
    if (!host) return;
    holoApply(host, host.classList.contains('gl-holo'));
    const hud = host.querySelector('#gl-holo-hud');
    if (!hud) return;
    const rows = Array.isArray(m && m.readings) ? m.readings.slice(0, 3) : [];
    const title = m && m.verdict ? holoStrip(glLocalVerdict(m.verdict).title) : '';
    const tone = (m && m.verdict && m.verdict.kind) || 'none';
    hud.dataset.kind = tone;
    const html = (title ? `<div class="gl-holo-hud-title">${glEsc(title)}</div>` : '') +
        rows.map(r => `<div class="gl-holo-hud-row"><span>${glEsc(holoStrip(r.label))}</span><b>${glEsc(holoStrip(r.value))}</b></div>`).join('');
    // Same translation pass the readings panel gets, so Hindi mode stays Hindi.
    hud.innerHTML = typeof translateReadings === 'function' ? translateReadings(glSim, html) : html;
    hud.classList.toggle('gl-holo-hud--empty', !title && !rows.length);
}
