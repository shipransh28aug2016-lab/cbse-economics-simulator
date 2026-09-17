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
        if (isSupported()) window.speechSynthesis.cancel();
        currentUtterance = null;
    }

    // lang: 'en' | 'hi'. onEnd/onError are optional callbacks so the UI
    // can flip its Speak/Stop button back without polling.
    function speak(text, lang, onEnd, onError) {
        if (!isSupported() || !text) return false;
        stop();
        const utter = new window.SpeechSynthesisUtterance(text);
        utter.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
        const voice = pickVoice(lang);
        if (voice) utter.voice = voice;
        utter.rate = 0.95;
        utter.pitch = 1.0;
        utter.onend = () => { currentUtterance = null; if (typeof onEnd === 'function') onEnd(); };
        utter.onerror = () => { currentUtterance = null; if (typeof onError === 'function') onError(); };
        currentUtterance = utter;
        window.speechSynthesis.speak(utter);
        return true;
    }

    function isSpeaking() {
        return isSupported() && window.speechSynthesis.speaking;
    }

    // Some browsers (notably Chrome) load the voice list asynchronously
    // after page load; refresh the cache when it fires so pickVoice()
    // doesn't stay stuck with an empty list from the first call.
    if (isSupported() && typeof window.speechSynthesis.addEventListener === 'function') {
        window.speechSynthesis.addEventListener('voiceschanged', () => { cachedVoices = null; });
    }

    return { speak, stop, isSpeaking, isSupported };
})();
