// ══════════════════════════════════════════════════════════════
// MIMA EXPLAIN — the ONE explanation source shared by text and speech.
//
//   getMimaContext()  →  mimaExplain(context, intent)  →  { text, lang }
//                                                              ↓        ↓
//                                                          Mima UI   MimaVoice
//
// This is a pure function: same context + same intent = same string,
// every time. Nothing here decides an economic fact — every sentence is
// built by filling a phrase template with a value that already exists on
// the context object (which itself only mirrors what the readings panel
// / verdict banner already rendered). If a number here is ever wrong, the
// bug is upstream in js/mima-context.js or the sim's own model, never in
// the wording chosen here.
//
// No AI backend exists in this project (confirmed by inspection before
// writing this file — no fetch/API calls anywhere in js/*.js). This is
// the "deterministic explanation layer" the brief asks to build FIRST
// when no backend exists, not a placeholder for one.
// ══════════════════════════════════════════════════════════════

const MIMA_PHRASES = {
    en: {
        noSim: "Open a simulation and change something — I'll explain what happens.",
        firstRender: name => `This is ${name}. Try moving one of the controls, and I'll walk you through what changes and why.`,
        changedOne: (label, before, after) => `You changed ${label} from ${before} to ${after}.`,
        changedMany: n => `You changed ${n} things at once.`,
        noChangeYet: "Nothing has changed yet — move a control and ask me again.",
        effectIntro: "Here's what the model did in response:",
        effectLine: (label, before, after, rose) => `${label} ${rose ? 'rose' : 'fell'}, from ${before} to ${after}.`,
        noEffect: "The model's numbers didn't move — that combination cancels out, or the effect is too small to show.",
        movementVerdict: {
            movement: 'This is a MOVEMENT along the same curve — only the point moved, the curve itself is unchanged.',
            shift: 'This is a SHIFT of the curve itself — a non-price determinant changed, so the whole curve moved to a new position.',
            both: 'BOTH things happened here: the curve shifted to a new position, AND you also moved along it — the exam wants these named as two separate events.',
            none: 'Nothing has moved yet in a way that shows movement or shift — try changing a variable.'
        },
        curvesMovedIntro: names => `The curve${names.length > 1 ? 's' : ''} that moved: ${names.join(', ')}.`,
        curvesUnchanged: names => `${names.join(' and ')} stayed exactly where ${names.length > 1 ? 'they were' : 'it was'} — that variable doesn't affect ${names.length > 1 ? 'them' : 'it'}.`,
        keyIdea: idea => `The key idea here: ${idea}`,
        graphIntro: names => names.length ? `Right now the graph is showing: ${names.join(', ')}.` : "I don't have a description of the current graph yet.",
        why: "The change you made feeds directly into the model's formula, and that recalculation is what moved the numbers above.",
        unknownIntent: "I'm not sure which of those you're asking — try 'What changed?', 'Why?', 'Movement or shift?', or 'Explain the graph.'"
    },
    hi: {
        noSim: 'एक सिमुलेशन खोलें और कुछ बदलें — मैं बताऊँगी कि क्या होता है।',
        firstRender: name => `यह ${name} है। किसी नियंत्रण को हिलाकर देखें, मैं बताऊँगी कि क्या बदलता है और क्यों।`,
        changedOne: (label, before, after) => `आपने ${label} को ${before} से ${after} में बदला।`,
        changedMany: n => `आपने एक साथ ${n} चीज़ें बदलीं।`,
        noChangeYet: 'अभी तक कुछ नहीं बदला — एक नियंत्रण हिलाएँ और फिर मुझसे पूछें।',
        effectIntro: 'मॉडल ने इसके जवाब में यह किया:',
        effectLine: (label, before, after, rose) => `${label} ${rose ? 'बढ़ा' : 'घटा'}, ${before} से ${after} तक।`,
        noEffect: 'मॉडल की संख्याएँ नहीं हिलीं — या तो यह संयोजन एक-दूसरे को संतुलित कर देता है, या प्रभाव दिखाने के लिए बहुत छोटा है।',
        movementVerdict: {
            movement: 'यह वक्र के साथ एक MOVEMENT (गति) है — केवल बिंदु हिला है, वक्र स्वयं वही रहा।',
            shift: 'यह वक्र का SHIFT (खिसकाव) है — एक गैर-कीमत निर्धारक बदला, इसलिए पूरा वक्र एक नई स्थिति में चला गया।',
            both: 'यहाँ दोनों हुए: वक्र एक नई स्थिति में खिसका, और आप उसके साथ भी हिले — परीक्षा में इन्हें दो अलग घटनाओं के रूप में नाम देना अपेक्षित है।',
            none: 'अभी तक ऐसा कुछ नहीं हिला जो movement या shift दिखाए — कोई चर बदलकर देखें।'
        },
        curvesMovedIntro: names => `जो वक्र हिला: ${names.join(', ')}।`,
        curvesUnchanged: names => `${names.join(' और ')} बिल्कुल वहीं रहा — वह चर इसे प्रभावित नहीं करता।`,
        keyIdea: idea => `यहाँ मुख्य विचार: ${idea}`,
        graphIntro: names => names.length ? `अभी ग्राफ़ में यह दिख रहा है: ${names.join(', ')}।` : 'मेरे पास अभी वर्तमान ग्राफ़ का विवरण नहीं है।',
        why: 'आपने जो बदलाव किया वह सीधे मॉडल के सूत्र में जाता है, और उसी पुनर्गणना से ऊपर की संख्याएँ हिली हैं।',
        unknownIntent: "मुझे ठीक से समझ नहीं आया — 'क्या बदला?', 'क्यों?', 'Movement या Shift?', या 'ग्राफ़ समझाएँ' आज़माएँ।"
    }
};

function mimaJoinChanges(ctx, P) {
    if (!ctx.changedControls.length) return '';
    if (ctx.changedControls.length === 1) {
        const c = ctx.changedControls[0];
        return P.changedOne(c.label, c.before, c.after);
    }
    return P.changedMany(ctx.changedControls.length) + ' ' +
        ctx.changedControls.map(c => `${c.label}: ${c.before} → ${c.after}`).join('; ') + '.';
}

function mimaMovementOrShift(ctx, P) {
    // Graph Labs (mode: 'graphlab') already compute the exam-precise
    // verdict — read it, never re-derive it.
    if (ctx.mode === 'graphlab') {
        const kind = (ctx.verdict && ctx.verdict.kind) || 'none';
        return P.movementVerdict[kind] || P.movementVerdict.none;
    }
    // Plain simulator/customRender sims: the auto-ghost layer
    // (js/transition-layer.js) already worked out which curves moved —
    // that IS the movement/shift signal, generalised. A curve that moved
    // = shifted (its whole shape/position changed); if no curve moved but
    // a metric did, the effect is a movement of the READING POINT along
    // an unchanged curve.
    if (ctx.ghostedNames && ctx.ghostedNames.length) {
        const unchanged = (ctx.allTraceNames || []).filter(n => ctx.ghostedNames.indexOf(n) === -1);
        let text = P.curvesMovedIntro(ctx.ghostedNames);
        if (unchanged.length) text += ' ' + P.curvesUnchanged(unchanged);
        return text;
    }
    if (ctx.effects.length) {
        return P.movementVerdict.movement;
    }
    return P.movementVerdict.none;
}

function mimaStripTags(html) {
    return String(html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

// intent: 'explain' | 'whatChanged' | 'why' | 'movementOrShift' | 'graph'
function mimaExplain(context, intent) {
    const lang = (context && context.lang === 'hi') ? 'hi' : 'en';
    const P = MIMA_PHRASES[lang];

    if (!context) return { text: P.noSim, lang };
    if (context.isFirstRender || (!context.changedControls.length && !context.effects.length && intent !== 'graph')) {
        if (intent === 'whatChanged') return { text: P.noChangeYet, lang };
        if (intent === 'movementOrShift') return { text: mimaMovementOrShift(context, P), lang };
        if (intent === 'graph') {
            const names = context.allTraceNames && context.allTraceNames.length ? context.allTraceNames : [];
            const parts = [P.graphIntro(names)];
            if (context.keyIdea) parts.push(P.keyIdea(context.keyIdea));
            return { text: parts.join(' '), lang };
        }
        return { text: P.firstRender(context.title), lang };
    }

    if (intent === 'whatChanged') {
        return { text: mimaJoinChanges(context, P) || P.noChangeYet, lang };
    }

    if (intent === 'movementOrShift') {
        return { text: mimaMovementOrShift(context, P), lang };
    }

    if (intent === 'graph') {
        const names = context.allTraceNames && context.allTraceNames.length ? context.allTraceNames : [];
        const parts = [P.graphIntro(names)];
        if (context.ghostedNames && context.ghostedNames.length) parts.push(P.curvesMovedIntro(context.ghostedNames));
        return { text: parts.join(' '), lang };
    }

    if (intent === 'why') {
        const parts = [P.why];
        if (context.effects.length) {
            parts.push(P.effectIntro);
            context.effects.forEach(e => parts.push(P.effectLine(e.label, e.before, e.after, e.rose)));
        }
        if (context.verdict && context.verdict.detail) parts.push(mimaStripTags(context.verdict.detail));
        return { text: parts.join(' '), lang };
    }

    // Default: 'explain' — the full cause → effect → notice-this chain.
    const parts = [];
    const cause = mimaJoinChanges(context, P);
    if (cause) parts.push(cause);
    if (context.effects.length) {
        parts.push(P.effectIntro);
        context.effects.forEach(e => parts.push(P.effectLine(e.label, e.before, e.after, e.rose)));
    } else if (context.mode !== 'graphlab') {
        parts.push(P.noEffect);
    }
    if (context.mode === 'graphlab' || (context.ghostedNames && context.ghostedNames.length)) {
        parts.push(mimaMovementOrShift(context, P));
    }
    if (context.verdict && context.verdict.title) parts.push(mimaStripTags(context.verdict.title));
    if (context.keyIdea && !cause) parts.push(P.keyIdea(context.keyIdea));
    return { text: parts.join(' ') || P.firstRender(context.title), lang };
}
