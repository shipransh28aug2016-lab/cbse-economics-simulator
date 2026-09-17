// ══════════════════════════════════════════════════════════════
// MIMA UI — the small draggable floating teaching companion.
//
//   getMimaContext() → mimaExplain(ctx, intent) → { text, lang }
//                                                     ↓         ↓
//                                              this file's    MimaVoice
//                                              text panel     .speak(text, lang)
//
// Both the on-screen text and the spoken audio come from the SAME
// mimaExplain() call for a given click — never two separate explanations
// for the same question. See js/mima-explain.js's header.
//
// Deliberately NOT a chat window: one toggle bubble, one small panel,
// a handful of quick-action buttons. Position persists for the session
// only (sessionStorage), per the brief ("remembers its position during
// the current session").
// ══════════════════════════════════════════════════════════════

(function () {
    const POS_KEY = 'mima-panel-pos';
    const OPEN_KEY = 'mima-panel-open';
    const MIN_KEY = 'mima-panel-min';

    let panelEl = null, bubbleEl = null, textEl = null, langTagEl = null, speakBtnEl = null;
    let dragging = false, dragOffset = { x: 0, y: 0 };
    let lastResult = null; // the last { text, lang } shown — what Replay repeats

    function loadPos() {
        try {
            const raw = sessionStorage.getItem(POS_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (e) { return null; }
    }
    function savePos(pos) {
        try { sessionStorage.setItem(POS_KEY, JSON.stringify(pos)); } catch (e) { /* private mode: position just won't persist */ }
    }

    function mimaLabel(key, en, hi) {
        return (typeof currentLang !== 'undefined' && currentLang === 'hi') ? hi : en;
    }

    function currentLangCode() {
        return (typeof currentLang !== 'undefined' && currentLang === 'hi') ? 'hi' : 'en';
    }

    function buildDOM() {
        bubbleEl = document.createElement('button');
        bubbleEl.type = 'button';
        bubbleEl.id = 'mima-bubble';
        bubbleEl.className = 'mima-bubble';
        bubbleEl.setAttribute('aria-label', 'Mima — Economics teaching assistant');
        bubbleEl.innerHTML = '🎓';
        document.body.appendChild(bubbleEl);

        panelEl = document.createElement('div');
        panelEl.id = 'mima-panel';
        panelEl.className = 'mima-panel hidden';
        panelEl.innerHTML = `
            <div class="mima-header" id="mima-drag-handle">
                <span class="mima-title">🎓 <b>Mima</b> <span class="mima-lang-tag" id="mima-lang-tag">EN</span></span>
                <span class="mima-header-actions">
                    <button type="button" class="mima-icon-btn" id="mima-min-btn" title="Minimize">━</button>
                    <button type="button" class="mima-icon-btn" id="mima-close-btn" title="Close">✕</button>
                </span>
            </div>
            <div class="mima-body" id="mima-body">
                <p class="mima-text" id="mima-text"></p>
                <div class="mima-actions">
                    <button type="button" class="mima-action-btn" data-intent="explain">💡 <span data-en="Explain this" data-hi="समझाएँ">Explain this</span></button>
                    <button type="button" class="mima-action-btn" data-intent="whatChanged">🔄 <span data-en="What changed?" data-hi="क्या बदला?">What changed?</span></button>
                    <button type="button" class="mima-action-btn" data-intent="why">❓ <span data-en="Why?" data-hi="क्यों?">Why?</span></button>
                    <button type="button" class="mima-action-btn" data-intent="movementOrShift">↔️ <span data-en="Movement or shift?" data-hi="Movement या Shift?">Movement or shift?</span></button>
                    <button type="button" class="mima-action-btn" data-intent="graph">📈 <span data-en="Explain the graph" data-hi="ग्राफ़ समझाएँ">Explain the graph</span></button>
                </div>
            </div>
            <div class="mima-footer">
                <button type="button" class="mima-voice-btn" id="mima-speak-btn">🔊 <span data-en="Speak" data-hi="बोलें">Speak</span></button>
                <button type="button" class="mima-voice-btn" id="mima-stop-btn">⏹ <span data-en="Stop" data-hi="रोकें">Stop</span></button>
                <button type="button" class="mima-voice-btn" id="mima-replay-btn">🔁 <span data-en="Replay" data-hi="दोहराएँ">Replay</span></button>
            </div>`;
        document.body.appendChild(panelEl);

        textEl = panelEl.querySelector('#mima-text');
        langTagEl = panelEl.querySelector('#mima-lang-tag');
        speakBtnEl = panelEl.querySelector('#mima-speak-btn');

        wireEvents();
        applyPosition(loadPos());
        if (sessionStorage.getItem(OPEN_KEY) === '1') openPanel(false);
        if (sessionStorage.getItem(MIN_KEY) === '1') panelEl.classList.add('mima-minimized');
    }

    function applyPosition(pos) {
        if (!pos) return;
        const maxX = window.innerWidth - 60, maxY = window.innerHeight - 60;
        panelEl.style.left = Math.min(Math.max(pos.x, 0), maxX) + 'px';
        panelEl.style.top = Math.min(Math.max(pos.y, 0), maxY) + 'px';
        panelEl.style.right = 'auto';
        panelEl.style.bottom = 'auto';
    }

    function openPanel(persist) {
        panelEl.classList.remove('hidden');
        bubbleEl.classList.add('mima-bubble--active');
        if (persist !== false) { try { sessionStorage.setItem(OPEN_KEY, '1'); } catch (e) { /* ignore */ } }
        refreshLangTag();
        if (!textEl.textContent) showResult(mimaExplain(getMimaContext(), 'explain'));
    }
    function closePanel() {
        panelEl.classList.add('hidden');
        bubbleEl.classList.remove('mima-bubble--active');
        MimaVoice.stop();
        updateSpeakButton();
        try { sessionStorage.setItem(OPEN_KEY, '0'); } catch (e) { /* ignore */ }
    }

    function refreshLangTag() {
        if (langTagEl) langTagEl.textContent = currentLangCode() === 'hi' ? 'हिंदी' : 'EN';
        panelEl.querySelectorAll('[data-en]').forEach(el => {
            el.textContent = currentLangCode() === 'hi' ? el.dataset.hi : el.dataset.en;
        });
    }

    function showResult(result) {
        lastResult = result;
        textEl.textContent = result.text;
    }

    function updateSpeakButton() {
        if (!speakBtnEl) return;
        speakBtnEl.classList.toggle('mima-voice-btn--active', MimaVoice.isSpeaking());
    }

    function runIntent(intent) {
        const ctx = getMimaContext();
        const result = mimaExplain(ctx, intent);
        showResult(result);
        return result;
    }

    function wireEvents() {
        bubbleEl.addEventListener('click', () => {
            if (panelEl.classList.contains('hidden')) openPanel();
            else closePanel();
        });

        panelEl.querySelector('#mima-close-btn').addEventListener('click', closePanel);
        panelEl.querySelector('#mima-min-btn').addEventListener('click', () => {
            const nowMin = panelEl.classList.toggle('mima-minimized');
            try { sessionStorage.setItem(MIN_KEY, nowMin ? '1' : '0'); } catch (e) { /* ignore */ }
        });

        panelEl.querySelectorAll('.mima-action-btn').forEach(btn => {
            btn.addEventListener('click', () => runIntent(btn.dataset.intent));
        });

        panelEl.querySelector('#mima-speak-btn').addEventListener('click', () => {
            if (!lastResult) lastResult = runIntent('explain');
            if (MimaVoice.isSpeaking()) { MimaVoice.stop(); updateSpeakButton(); return; }
            const started = MimaVoice.speak(lastResult.text, lastResult.lang, updateSpeakButton, updateSpeakButton);
            if (started) updateSpeakButton();
            else textEl.textContent += (currentLangCode() === 'hi' ? ' (इस ब्राउज़र में आवाज़ उपलब्ध नहीं है)' : ' (Voice is not available in this browser)');
        });
        panelEl.querySelector('#mima-stop-btn').addEventListener('click', () => { MimaVoice.stop(); updateSpeakButton(); });
        panelEl.querySelector('#mima-replay-btn').addEventListener('click', () => {
            if (!lastResult) lastResult = runIntent('explain');
            MimaVoice.speak(lastResult.text, lastResult.lang, updateSpeakButton, updateSpeakButton);
            updateSpeakButton();
        });

        // Drag by the header only, so it never fights with clicking a
        // quick-action button or the graph underneath.
        const handle = panelEl.querySelector('#mima-drag-handle');
        handle.addEventListener('pointerdown', (e) => {
            // A pointerdown that started ON one of the header's own
            // buttons (minimize/close) must reach that button's own click
            // handler untouched — capturing the pointer here first was
            // silently swallowing every click on those two buttons
            // (found by comparing a real Playwright click, which failed,
            // against a synthetic .click() call, which worked).
            if (e.target.closest('.mima-icon-btn')) return;
            dragging = true;
            const rect = panelEl.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;
            handle.setPointerCapture(e.pointerId);
        });
        handle.addEventListener('pointermove', (e) => {
            if (!dragging) return;
            const x = e.clientX - dragOffset.x, y = e.clientY - dragOffset.y;
            panelEl.style.left = x + 'px';
            panelEl.style.top = y + 'px';
            panelEl.style.right = 'auto';
            panelEl.style.bottom = 'auto';
        });
        const endDrag = () => {
            if (!dragging) return;
            dragging = false;
            const rect = panelEl.getBoundingClientRect();
            savePos({ x: rect.left, y: rect.top });
        };
        handle.addEventListener('pointerup', endDrag);
        handle.addEventListener('pointercancel', endDrag);
    }

    // Called by js/mima-context.js after every sim render. Deliberately
    // does NOT speak or change the visible text on its own — it only
    // marks the bubble so the student notices there's something new,
    // preserving "never start voice playback without user interaction".
    function mimaOnStateChanged() {
        if (!bubbleEl) return;
        const ctx = getMimaContext();
        const isClosed = panelEl.classList.contains('hidden');
        bubbleEl.classList.toggle('mima-bubble--has-update', !!ctx && isClosed);
        if (!isClosed && !panelEl.classList.contains('mima-minimized')) {
            // Panel is open and visible: keep her explanation current
            // automatically (text only — still no autoplay of audio).
            showResult(mimaExplain(ctx, 'explain'));
        }
    }
    window.mimaOnStateChanged = mimaOnStateChanged;

    function mimaInitUI() {
        if (panelEl) return; // idempotent — safe to call more than once
        buildDOM();
    }
    window.mimaInitUI = mimaInitUI;

    // Keep the language tag and button captions in sync whenever the app
    // language toggles, without Mima needing her own language switch.
    document.addEventListener('DOMContentLoaded', () => {
        mimaInitUI();
        const langBtn = document.getElementById('lang-toggle');
        if (langBtn) langBtn.addEventListener('click', () => setTimeout(() => { refreshLangTag(); mimaOnStateChanged(); }, 0));
    });
})();
