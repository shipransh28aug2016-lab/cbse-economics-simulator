// ══════════════════════════════════════════════════════════════
// MIMA VOICE — abstract speech provider. Speaks EXACTLY the text
// js/mima-explain.js produced; never composes its own wording.
//
// Backed by the browser's native Web Speech API (speechSynthesis) —
// this project has no server, so there is no existing TTS integration to
// reuse (confirmed by inspection: no fetch/API calls anywhere in this
// repo). The interface below (`speak`/`stop`/`isSpeaking`/`isSupported`)
// is deliberately the whole contract, so a future paid provider (e.g. a
// cloud TTS call) can replace the inside of `speak()` without touching
// js/mima-ui.js, which only ever calls this object.
//
// Never starts speaking or requests any permission except in direct
// response to a user click — js/mima-ui.js is the only caller, and it
// only calls `speak()` from a button's click handler.
// ══════════════════════════════════════════════════════════════

const MimaVoice = (function () {
    let currentUtterance = null;
    let cachedVoices = null;

    // idle ─SPEAK→ speaking ─END/STOP→ idle   (SPEAK while speaking = a new
    // owner/utterance takes over). One global voice, two speakers (Mima's
    // panel and the Story card): the owner says whose words are playing, and
    // subscribers keep BOTH speak buttons true without polling.
    const machine = typeof createMachine === 'function' ? createMachine({
        id: 'voice', initial: 'idle', reflect: 'voice', context: { owner: null, lang: null },
        describe: ctx => ({ owner: ctx.owner, lang: ctx.lang }),
        states: {
            idle: { on: { SPEAK: { target: 'speaking', action: (ctx, p) => { ctx.owner = p.owner; ctx.lang = p.lang; } }, STOP: 'idle', END: 'idle' } },
            speaking: {
                on: {
                    SPEAK: { target: 'speaking', action: (ctx, p) => { ctx.owner = p.owner; ctx.lang = p.lang; } },
                    END: { target: 'idle', action: ctx => { ctx.owner = null; ctx.lang = null; } },
                    STOP: { target: 'idle', action: ctx => { ctx.owner = null; ctx.lang = null; } }
                }
            }
        }
    }) : null;
    const send = (e, p) => { if (machine) machine.send(e, p); };

    function isSupported() {
        return typeof window !== 'undefined' && !!window.speechSynthesis && typeof window.SpeechSynthesisUtterance === 'function';
    }

    function voices() {
        if (!isSupported()) return [];
        if (!cachedVoices || !cachedVoices.length) cachedVoices = window.speechSynthesis.getVoices() || [];
        return cachedVoices;
    }

    // Prefer an Indian voice for the requested language (native delivery,
    // never a fabricated accent) — falls through to any voice for that
    // language, then lets the browser's default apply.
    function pickVoice(lang) {
        const list = voices();
        if (!list.length) return null;
        const bcp = lang === 'hi' ? 'hi-IN' : 'en-IN';
        const genericPrefix = lang === 'hi' ? 'hi' : 'en';
        return list.find(v => v.lang === bcp)
            || list.find(v => v.lang && v.lang.toLowerCase().indexOf(genericPrefix) === 0 && /IN|India/i.test(v.lang + v.name))
            || list.find(v => v.lang && v.lang.toLowerCase().indexOf(genericPrefix) === 0)
            || null;
    }

    function stop() {
        currentUtterance = null; // first: the cancelled utterance's late onerror must not count
        if (isSupported()) window.speechSynthesis.cancel();
        send('STOP');
    }

    // lang: 'en' | 'hi'. onEnd/onError are optional callbacks so the UI
    // can flip its Speak/Stop button back without polling.
    // owner: 'mima' | 'story' | … — whose words these are (for the buttons).
    function speak(text, lang, onEnd, onError, owner) {
        if (!isSupported() || !text) return false;
        stop();
        const utter = new window.SpeechSynthesisUtterance(text);
        utter.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
        const voice = pickVoice(lang);
        if (voice) utter.voice = voice;
        utter.rate = 0.95;
        utter.pitch = 1.0;
        // Only the CURRENT utterance may end the speaking state: cancel()
        // fires the previous one's onerror after a new one has started.
        utter.onend = () => { if (currentUtterance !== utter) return; currentUtterance = null; send('END'); if (typeof onEnd === 'function') onEnd(); };
        utter.onerror = () => { if (currentUtterance !== utter) return; currentUtterance = null; send('END'); if (typeof onError === 'function') onError(); };
        currentUtterance = utter;
        window.speechSynthesis.speak(utter);
        send('SPEAK', { owner: owner || 'mima', lang });
        return true;
    }

    function isSpeaking() {
        return isSupported() && window.speechSynthesis.speaking;
    }

    // fn(state, owner) on every change — keeps a speak button honest.
    function subscribe(fn) {
        if (!machine) return () => {};
        return machine.subscribe(st => fn(st, machine.context.owner));
    }
    function owner() { return machine && machine.state === 'speaking' ? machine.context.owner : null; }

    // Some browsers (notably Chrome) load the voice list asynchronously
    // after page load; refresh the cache when it fires so pickVoice()
    // doesn't stay stuck with an empty list from the first call.
    if (isSupported() && typeof window.speechSynthesis.addEventListener === 'function') {
        window.speechSynthesis.addEventListener('voiceschanged', () => { cachedVoices = null; });
    }

    if (typeof onSimLeave === 'function') onSimLeave(() => stop());

    return { speak, stop, isSpeaking, isSupported, subscribe, owner };
})();
