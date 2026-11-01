// ══════════════════════════════════════════════════════════════
// GRAPH LABS — Class XI Microeconomics (mode: 'graphlab').
//
// These are the diagrams a CBSE Economics student is actually asked to
// DRAW in the exam, rendered the way the textbook draws them (labelled
// axes with arrowheads, DD/SS curve labels, dotted OP/OQ projections,
// named shift and movement arrows) — and made draggable, because the
// distinctions they teach (movement vs shift, expansion vs increase) are
// distinctions about MOTION and cannot be learned from a static picture.
//
// See js/graph-lab-engine.js for the `graphLab` data contract.
// ══════════════════════════════════════════════════════════════

// ── shared verdict vocabulary ────────────────────────────────
// The exact four-way table the syllabus asks students to reproduce.
// Kept in one place so the demand lab, the supply lab and the market
// lab can never drift into naming the same event differently.
const GL_TERMS = {
    demand: {
        curve: 'DD', shifted: 'D₁D₁', qtyHi: 'माँगी गई मात्रा',
        up: 'Contraction of Demand', upHi: 'माँग में संकुचन',
        down: 'Expansion of Demand', downHi: 'माँग में विस्तार',
        right: 'Increase in Demand', rightHi: 'माँग में वृद्धि',
        left: 'Decrease in Demand', leftHi: 'माँग में कमी'
    },
    supply: {
        curve: 'SS', shifted: 'S₁S₁', qtyHi: 'पूर्ति की गई मात्रा',
        up: 'Expansion of Supply', upHi: 'पूर्ति में विस्तार',
        down: 'Contraction of Supply', downHi: 'पूर्ति में संकुचन',
        right: 'Increase in Supply', rightHi: 'पूर्ति में वृद्धि',
        left: 'Decrease in Supply', leftHi: 'पूर्ति में कमी'
    }
};

// Builds the verdict block shared by the demand and supply labs.
//   priceΔ  — change in OWN price (drives a MOVEMENT along the curve)
//   shiftΔ  — net non-price determinant effect (drives a SHIFT of the curve)
// ── Story Mode answer keys (js/story-mode.js) ─────────────────────
// Graded from the model's own verdict/metrics at the step's state — never
// an authored answer that could disagree with the diagram.
const GL_DEMAND_STORY_OPTIONS = [
    { en: 'Movement along DD (expansion / contraction)', hi: 'DD के साथ movement (विस्तार / संकुचन)' },
    { en: 'DD shifts right (increase in demand)', hi: 'DD दाईं ओर खिसकता है (माँग में वृद्धि)' },
    { en: 'DD shifts left (decrease in demand)', hi: 'DD बाईं ओर खिसकता है (माँग में कमी)' },
    { en: 'Both: a shift AND a movement', hi: 'दोनों: shift भी और movement भी' }
];
function glMoveShiftStoryAnswer(m) {
    const k = m.verdict && m.verdict.kind;
    if (k === 'movement') return 0;
    if (k === 'both') return 3;
    return m.metrics.shift > 0 ? 1 : 2;
}
const GL_SUPPLY_STORY_OPTIONS = [
    { en: 'Movement along SS (expansion / contraction)', hi: 'SS के साथ movement (विस्तार / संकुचन)' },
    { en: 'SS shifts right (increase in supply)', hi: 'SS दाईं ओर खिसकता है (आपूर्ति में वृद्धि)' },
    { en: 'SS shifts left (decrease in supply)', hi: 'SS बाईं ओर खिसकता है (आपूर्ति में कमी)' },
    { en: 'Both: a shift AND a movement', hi: 'दोनों: shift भी और movement भी' }
];
// Budget-line moves, classified from the model's own intercepts.
const GL_BUDGET_STORY_OPTIONS = [
    { en: 'Shifts outward, parallel (same slope)', hi: 'बाहर की ओर समानांतर खिसकती है (ढलान वही)' },
    { en: 'Swivels outward along the X-axis (Y-intercept stays)', hi: 'X-अक्ष पर बाहर घूमती है (Y-अंतःखंड वही रहता है)' },
    { en: 'Swivels outward along the Y-axis (X-intercept stays)', hi: 'Y-अक्ष पर बाहर घूमती है (X-अंतःखंड वही रहता है)' },
    { en: 'Does not move', hi: 'नहीं हिलती' }
];
function glBudgetStoryAnswer(m, prevM) {
    const dx = m.metrics.xInt - prevM.metrics.xInt, dy = m.metrics.yInt - prevM.metrics.yInt;
    if (Math.abs(dx) < 1e-9 && Math.abs(dy) < 1e-9) return 3;
    if (Math.abs(m.metrics.ratio - prevM.metrics.ratio) < 1e-9) return 0;
    return Math.abs(dy) < 1e-9 ? 1 : 2;
}
const GL_MARKET_STORY_OPTIONS = [
    { en: 'DD shifts right', hi: 'DD दाईं ओर खिसकता है' },
    { en: 'DD shifts left', hi: 'DD बाईं ओर खिसकता है' },
    { en: 'SS shifts right', hi: 'SS दाईं ओर खिसकता है' },
    { en: 'SS shifts left', hi: 'SS बाईं ओर खिसकता है' }
];
function glMarketStoryAnswer(m) {
    const d = m.metrics.dShift, s = m.metrics.sShift;
    if (Math.abs(s) > Math.abs(d)) return s > 0 ? 2 : 3;
    return d > 0 ? 0 : 1;
}

function glMoveShiftVerdict(kindKey, priceD, shiftD) {
    const T = GL_TERMS[kindKey];
    const moved = Math.abs(priceD) > 0.001;
    const shifted = Math.abs(shiftD) > 0.001;

    const moveName = priceD > 0 ? T.up : T.down;
    const moveHi = priceD > 0 ? T.upHi : T.downHi;
    const shiftName = shiftD > 0 ? T.right : T.left;
    const shiftHi = shiftD > 0 ? T.rightHi : T.leftHi;
    const dirWord = shiftD > 0 ? 'RIGHTWARD' : 'LEFTWARD';
    const dirHi = shiftD > 0 ? 'दाईं ओर' : 'बाईं ओर';
    // Demand: price up ⇒ quantity down. Supply: price up ⇒ quantity up.
    const qtyRose = kindKey === 'demand' ? priceD < 0 : priceD > 0;

    if (!moved && !shifted) {
        return {
            kind: 'none',
            title: `Nothing has changed yet — this is the original ${T.curve} curve.`,
            detail: `Move an <b>own-price</b> chip to travel <i>along</i> ${T.curve}. Move any <b>other determinant</b> to make the whole curve <i>shift</i> to a new position. The diagram will name what you did.`,
            hi: {
                title: `अभी कुछ नहीं बदला — यह मूल ${T.curve} वक्र है।`,
                detail: `${T.curve} के <i>साथ-साथ</i> चलने के लिए वस्तु की <b>अपनी कीमत</b> वाला चिप हिलाएँ। पूरे वक्र को नई स्थिति में <i>खिसकाने</i> के लिए कोई <b>अन्य निर्धारक</b> बदलें। आरेख बताएगा कि आपने क्या किया।`
            }
        };
    }
    if (moved && !shifted) {
        return {
            kind: 'movement',
            chips: ['Same curve', 'Price changed'],
            title: `MOVEMENT along ${T.curve} → <b>${moveName}</b> <span class="gl-hi">(${moveHi})</span>`,
            detail: `Only the good's <b>own price</b> changed, so the curve itself did <b>not</b> move — you slid from one point on ${T.curve} to another point on the <i>same</i> ${T.curve}. Price ${priceD > 0 ? 'rose' : 'fell'}, so quantity ${kindKey === 'demand' ? (priceD > 0 ? 'demanded fell' : 'demanded rose') : (priceD > 0 ? 'supplied rose' : 'supplied fell')}. In the exam this is called <b>${moveName}</b> — never "${shiftD >= 0 ? T.right : T.left}".`,
            hi: {
                chips: ['वही वक्र', 'कीमत बदली'],
                title: `${T.curve} के साथ संचलन → <b>${moveHi}</b>`,
                detail: `केवल वस्तु की <b>अपनी कीमत</b> बदली, इसलिए वक्र स्वयं <b>नहीं</b> खिसका — आप ${T.curve} के एक बिंदु से <i>उसी</i> ${T.curve} के दूसरे बिंदु पर गए। कीमत ${priceD > 0 ? 'बढ़ी' : 'घटी'}, इसलिए ${T.qtyHi} ${qtyRose ? 'बढ़ी' : 'घटी'}। परीक्षा में इसे <b>${moveHi}</b> कहते हैं — "${shiftD >= 0 ? T.rightHi : T.leftHi}" कभी नहीं।`
            }
        };
    }
    if (!moved && shifted) {
        return {
            kind: 'shift',
            chips: ['New curve', 'Price unchanged'],
            title: `SHIFT of ${T.curve} → ${T.shifted} (${dirWord}) → <b>${shiftName}</b> <span class="gl-hi">(${shiftHi})</span>`,
            detail: `A <b>non-price determinant</b> changed, so at <i>every</i> price the quantity ${kindKey === 'demand' ? 'demanded' : 'supplied'} is now ${shiftD > 0 ? 'higher' : 'lower'} — the entire curve has moved to a new position ${T.shifted}. Own price never moved, so this is <b>not</b> ${moveName.toLowerCase()}. The exam term is <b>${shiftName}</b>.`,
            hi: {
                chips: ['नया वक्र', 'कीमत अपरिवर्तित'],
                title: `${T.curve} का खिसकाव → ${T.shifted} (${dirHi}) → <b>${shiftHi}</b>`,
                detail: `एक <b>गैर-कीमत निर्धारक</b> बदला, इसलिए <i>हर</i> कीमत पर ${T.qtyHi} अब ${shiftD > 0 ? 'अधिक' : 'कम'} है — पूरा वक्र नई स्थिति ${T.shifted} पर खिसक गया। अपनी कीमत नहीं बदली, इसलिए यह ${moveHi} <b>नहीं</b> है। परीक्षा शब्द है <b>${shiftHi}</b>।`
            }
        };
    }
    return {
        kind: 'both',
        chips: ['New curve', 'Price changed'],
        title: `BOTH at once → <b>${shiftName}</b> + <b>${moveName}</b>`,
        detail: `Two separate things happened and the exam expects them named separately. <b>1.</b> A non-price determinant shifted ${T.curve} ${dirWord.toLowerCase()} to ${T.shifted} — that is <b>${shiftName}</b>. <b>2.</b> Own price then changed, moving you <i>along the new</i> ${T.shifted} — that is <b>${moveName}</b>. A shift relocates the curve; a movement relocates you on it.`,
        hi: {
            chips: ['नया वक्र', 'कीमत बदली'],
            title: `दोनों एक साथ → <b>${shiftHi}</b> + <b>${moveHi}</b>`,
            detail: `दो अलग घटनाएँ हुईं, और परीक्षा में दोनों के नाम अलग-अलग लिखने होते हैं। <b>1.</b> एक गैर-कीमत निर्धारक ने ${T.curve} को ${dirHi} ${T.shifted} पर खिसकाया — यह <b>${shiftHi}</b> है। <b>2.</b> फिर अपनी कीमत बदली, जिससे आप <i>नए</i> ${T.shifted} के साथ-साथ चले — यह <b>${moveHi}</b> है। खिसकाव वक्र की जगह बदलता है; संचलन वक्र पर आपकी जगह।`
        }
    };
}

// A straight demand line P = a − bQ, returned as the two endpoints that
// stay inside the plot box (drawing the segment, not an infinite line, is
// what makes it look like the book's figure rather than a plot).
function glLineSeg(fromP, slope, xMin, xMax, yMin, yMax) {
    // P(Q) = fromP + slope*Q. Clip to the y-window on both ends.
    const pAt = q => fromP + slope * q;
    let q1 = xMin, q2 = xMax;
    if (slope !== 0) {
        const qOfP = p => (p - fromP) / slope;
        const qa = qOfP(yMax), qb = qOfP(yMin);
        const lo = Math.min(qa, qb), hi = Math.max(qa, qb);
        q1 = Math.max(xMin, lo); q2 = Math.min(xMax, hi);
    }
    if (!(q2 > q1)) return [];
    return [[q1, pAt(q1)], [q2, pAt(q2)]];
}

SIMS.push({
    // ─────────────────────────────────────────────────────────
    // THE flagship lab. curriculum-data.js states the learning
    // objective for XI-B-U5-DEMAND as "Distinguish a movement along the
    // demand curve from a shift in it, and name the determinant behind
    // each shift." This is the lab that actually does that.
    // ─────────────────────────────────────────────────────────
    id: 'gl-demand-movement-shift',
    module: 'micro',
    title: 'Demand: Movement vs Shift (Drag the Curve)',
    desc: 'Drag the point ALONG DD for expansion/contraction; drag the whole curve for increase/decrease. The diagram names what you did, in exam words. Demand only, one cause at a time — for demand AND supply together with every named determinant, see "Supply & Demand: Every Determinant".',
    class: 'XI', part: 'B', unit: 5, unitTitle: "Consumer's Equilibrium and Demand", topicLabel: 'Movements vs Shifts',
    syllabusIds: ['XI-B-U5-DEMAND'],
    mode: 'graphlab',
    concept: '<p>This is the single most-tested distinction in the demand chapter, and the one students lose marks on.</p><p><b>Movement along the demand curve</b> happens when — and <i>only</i> when — the good\'s <b>own price</b> changes. You stay on the same curve DD and slide to a different point on it. Price falls ⇒ <b>Expansion (Extension) of Demand</b>. Price rises ⇒ <b>Contraction of Demand</b>.</p><p><b>Shift of the demand curve</b> happens when a <b>non-price determinant</b> changes — income, price of substitutes or complements, tastes, expectations, number of buyers. The whole curve moves to a new position D₁D₁. Rightward ⇒ <b>Increase in Demand</b>. Leftward ⇒ <b>Decrease in Demand</b>.</p><p>The exam wording matters: a price fall is <i>never</i> "an increase in demand". Drag both kinds of control here and watch the diagram say so. Use the <b>🎬 Textbook Scenarios</b> below to predict the outcome before it applies.</p><p>💡 This lab isolates <b>demand alone, one named cause at a time</b> — the sharpest tool for this one distinction. Once you\'ve got it, <b>"Supply &amp; Demand: Every Determinant"</b> lets you move several demand AND supply determinants together and watch the market <b>equilibrium</b> itself move.</p>',
    formulas: [
        'Demand curve: P = a − b·Q  (a = intercept, b = slope)',
        'Own price ↓ ⇒ MOVEMENT down along DD ⇒ Expansion of Demand',
        'Own price ↑ ⇒ MOVEMENT up along DD ⇒ Contraction of Demand',
        'Non-price determinant ↑ ⇒ DD shifts RIGHT to D₁D₁ ⇒ Increase in Demand',
        'Non-price determinant ↓ ⇒ DD shifts LEFT to D₁D₁ ⇒ Decrease in Demand',
        'Net shift = ΔIncome + ΔP(substitute) − ΔP(complement) + ΔTastes + ΔBuyers'
    ],
    graphLab: {
        // PREDICT gate: clicking a scenario preset first asks the student
        // to guess movement/shift/both/none, revealing the real answer
        // (computed live from this same model()) only after they answer —
        // see js/graph-lab-engine.js's glOpenPredictGate(). This is the
        // flagship lab for this feature; direct handle-dragging stays
        // instant as always.
        predict: true,
        x: { label: 'Quantity Demanded (units) →', min: 0, max: 100 },
        y: { label: 'Price (₹ per unit) →', min: 0, max: 100 },
        vars: [
            { id: 'price', label: 'Own Price of the Good', min: 5, max: 95, step: 1, value: 50, unit: '₹', group: 'price', hint: 'Changing this moves you ALONG the curve' },
            { id: 'income', label: 'Consumer Income', min: -20, max: 20, step: 1, value: 0, signed: true, hint: 'Normal good: income ↑ shifts DD right' },
            { id: 'pSub', label: 'Price of Substitute', min: -20, max: 20, step: 1, value: 0, signed: true, hint: 'Substitute dearer ⇒ more demand for this good' },
            { id: 'pComp', label: 'Price of Complement', min: -20, max: 20, step: 1, value: 0, signed: true, hint: 'Complement dearer ⇒ less demand for this good' },
            { id: 'tastes', label: 'Tastes & Preferences', min: -20, max: 20, step: 1, value: 0, signed: true },
            { id: 'buyers', label: 'Number of Buyers', min: -20, max: 20, step: 1, value: 0, signed: true }
        ],
        scenarios: [
            { label: 'Price falls ₹50 → ₹30', note: 'Expansion of Demand', set: { price: 30 } },
            { label: 'Price rises ₹50 → ₹70', note: 'Contraction of Demand', set: { price: 70 } },
            { label: 'Income rises (normal good)', note: 'Increase in Demand', set: { income: 15 } },
            { label: 'Substitute becomes cheaper', note: 'Decrease in Demand', set: { pSub: -15 } },
            { label: 'Complement becomes cheaper', note: 'Increase in Demand', set: { pComp: -15 } },
            { label: 'Price ↓ AND income ↑', note: 'Both at once', set: { price: 32, income: 14 } }
        ],
        // Story Mode (js/story-mode.js). Every number is read from the
        // model's own output; every claim is restated as check(), which
        // tools/test-curriculum.js runs against this model.
        stories: [{
            id: 'tea-stall',
            title: { en: "Ramu's Tea Stall — movement or shift?", hi: 'रामू की चाय की दुकान — movement या shift?' },
            intro: {
                en: 'Ramu sells tea outside a college. Four things will happen to his business. Before each one, predict what it does to the demand curve — then watch.',
                hi: 'रामू एक college के बाहर चाय बेचता है। उसके धंधे में चार चीज़ें होंगी। हर बार पहले अनुमान लगाइए कि demand curve पर क्या असर होगा — फिर देखिए।'
            },
            outro: {
                en: 'The whole chapter in one line: the good\'s OWN price moves you ALONG the curve (expansion/contraction); ANY other determinant moves the WHOLE curve (increase/decrease).',
                hi: 'पूरा अध्याय एक पंक्ति में: वस्तु की अपनी कीमत आपको curve के साथ-साथ चलाती है (विस्तार/संकुचन); कोई भी अन्य निर्धारक पूरे curve को खिसकाता है (वृद्धि/कमी)।'
            },
            steps: [
                {
                    set: {},
                    say: (c, hi) => hi
                        ? `₹${fmt(c.v.price, 0)} प्रति कप पर ग्राहक रोज़ ${fmt(c.m.metrics.q, 0)} कप खरीदते हैं — यह demand curve DD पर बिंदु A है।`
                        : `At ₹${fmt(c.v.price, 0)} a cup, customers buy ${fmt(c.m.metrics.q, 0)} cups a day — that is point A on the demand curve DD.`,
                    check: c => c.m.verdict.kind === 'none'
                },
                {
                    set: { price: 30 },
                    ask: {
                        q: { en: 'Ramu cuts the price of tea from ₹50 to ₹30. What happens on the diagram?', hi: 'रामू चाय की कीमत ₹50 से घटाकर ₹30 कर देता है। Diagram पर क्या होगा?' },
                        options: GL_DEMAND_STORY_OPTIONS,
                        correct: c => glMoveShiftStoryAnswer(c.m)
                    },
                    say: (c, hi) => hi
                        ? `केवल चाय की <b>अपनी कीमत</b> बदली, इसलिए हम उसी DD पर नीचे खिसकते हैं — A से B तक। मात्रा ${fmt(c.prev.m.metrics.q, 0)} से बढ़कर ${fmt(c.m.metrics.q, 0)} कप हो गई। परीक्षा का शब्द: <b>माँग का विस्तार</b> — "माँग में वृद्धि" नहीं।`
                        : `Only the tea's <b>own price</b> changed, so we slide DOWN the same DD — from A to B. Quantity rises from ${fmt(c.prev.m.metrics.q, 0)} to ${fmt(c.m.metrics.q, 0)} cups. Exam word: <b>Expansion of Demand</b> — never "increase in demand".`,
                    check: c => c.m.verdict.kind === 'movement' && c.m.metrics.q > c.prev.m.metrics.q
                },
                {
                    set: { buyers: 15 },
                    ask: {
                        q: { en: 'Price goes back to ₹50. Then a big new office opens next door — many more buyers. What happens?', hi: 'कीमत फिर ₹50 हो जाती है। फिर बगल में एक बड़ा नया दफ़्तर खुलता है — बहुत अधिक खरीदार। क्या होगा?' },
                        options: GL_DEMAND_STORY_OPTIONS,
                        correct: c => glMoveShiftStoryAnswer(c.m)
                    },
                    say: (c, hi) => hi
                        ? `एक <b>गैर-कीमत निर्धारक</b> (खरीदारों की संख्या) बदला, इसलिए पूरा curve <b>दाईं ओर</b> D₁D₁ पर खिसक गया। उसी ₹50 पर भी अब माँग ${fmt(c.m.metrics.q, 0)} कप है। परीक्षा का शब्द: <b>माँग में वृद्धि</b>।`
                        : `A <b>non-price determinant</b> (number of buyers) changed, so the whole curve shifts <b>RIGHT</b> to D₁D₁. Even at the same ₹50, demand is now ${fmt(c.m.metrics.q, 0)} cups. Exam word: <b>Increase in Demand</b>.`,
                    check: c => c.m.verdict.kind === 'shift' && c.m.metrics.shift > 0 && c.v.price === c.first.v.price && c.m.metrics.q > c.first.m.metrics.q
                },
                {
                    set: { buyers: 15, price: 40 },
                    ask: {
                        q: { en: 'The office stays — and now Ramu also cuts his price to ₹40. What happened compared with the very start?', hi: 'दफ़्तर बना रहता है — और अब रामू कीमत भी ₹40 कर देता है। शुरुआत की तुलना में क्या हुआ?' },
                        options: GL_DEMAND_STORY_OPTIONS,
                        correct: c => glMoveShiftStoryAnswer(c.m)
                    },
                    say: (c, hi) => hi
                        ? `<b>दो</b> अलग घटनाएँ: (1) curve दाईं ओर खिसका — <b>माँग में वृद्धि</b>; (2) फिर नए D₁D₁ पर नीचे चले — <b>माँग का विस्तार</b>। अब ₹${fmt(c.v.price, 0)} पर ${fmt(c.m.metrics.q, 0)} कप। परीक्षा में दोनों का नाम अलग-अलग लिखिए।`
                        : `<b>Two</b> separate events: (1) the curve shifted right — <b>Increase in Demand</b>; (2) then we moved down the new D₁D₁ — <b>Expansion of Demand</b>. Now ${fmt(c.m.metrics.q, 0)} cups at ₹${fmt(c.v.price, 0)}. The exam wants both named, separately.`,
                    check: c => c.m.verdict.kind === 'both' && c.m.metrics.shift > 0 && c.m.metrics.priceD < 0
                }
            ]
        }],
        model(v) {
            const b = 0.8, a0 = 90;
            const shift = v.income + v.pSub - v.pComp + v.tastes + v.buyers;
            const a1 = a0 + shift * b;   // measured so `shift` reads in QUANTITY units
            const qOf = (p, a) => (a - p) / b;

            const q0 = qOf(50, a0);          // original point, original curve
            const qNow = qOf(v.price, a1);   // where the student is now
            const qSamePriceNew = qOf(50, a1); // same price, new curve — isolates the shift
            const qNewPriceOld = qOf(v.price, a0); // new price, old curve — isolates the movement

            const priceD = v.price - 50;
            const shifted = Math.abs(shift) > 0.001;

            const curves = [];
            if (glShowGhost && shifted) {
                curves.push({ id: 'dd0', label: 'DD', color: '#94a3b8', width: 2.4, dash: '7 5',
                    pts: glLineSeg(a0, -b, 0, 100, 0, 100) });
            }
            curves.push({
                id: 'dd', label: shifted ? 'D₁D₁' : 'DD',
                color: shifted ? '#dc2626' : '#2563eb', width: 3.2,
                pts: glLineSeg(a1, -b, 0, 100, 0, 100)
            });

            const points = [{
                id: 'now', x: qNow, y: v.price,
                label: shifted && priceD ? 'B' : (shifted ? 'B' : (priceD ? 'B' : 'A')),
                color: '#7c3aed',
                xTick: `Q=${fmt(qNow, 0)}`, yTick: `₹${fmt(v.price, 0)}`
            }];
            if (priceD || shifted) {
                points.push({ id: 'orig', x: q0, y: 50, label: 'A', color: '#64748b', drop: true, xTick: `Q=${fmt(q0, 0)}`, yTick: '₹50' });
            }

            const arrows = [];
            // The two arrows are drawn as two SEPARATE legs on purpose:
            // the shift leg is horizontal (same price, new curve) and the
            // movement leg runs along the curve — which is precisely the
            // picture the exam answer needs.
            if (shifted) {
                arrows.push({
                    from: [q0, 50], to: [qSamePriceNew, 50], color: '#dc2626',
                    label: shift > 0 ? 'Increase in Demand (shift →)' : 'Decrease in Demand (← shift)', bend: -26
                });
            }
            if (Math.abs(priceD) > 0.001) {
                const fromQ = shifted ? qSamePriceNew : q0;
                arrows.push({
                    from: [fromQ, 50], to: [qNow, v.price], color: '#2563eb',
                    label: priceD > 0 ? 'Contraction (move ↑ along curve)' : 'Expansion (move ↓ along curve)',
                    bend: 0, labelDy: priceD > 0 ? -12 : 16
                });
            }

            const handles = [
                // Grab the point and slide it ALONG the curve — the drag is
                // vertical (price), and the curve equation supplies the
                // matching quantity, so the point can never leave the curve.
                { id: 'h-along', x: qNow, y: v.price, bind: 'price', axis: 'y', k: 1, color: '#2563eb',
                  hint: 'Drag up/down to change own price — moves you ALONG the curve' },
                // Grab the curve itself and drag it sideways — a pure SHIFT.
                // It writes to `tastes` because a shift must be caused by SOME
                // named non-price determinant, never by nothing.
                { id: 'h-shift', x: qOf(78, a1), y: 78, bind: 'tastes', axis: 'x', k: 1, color: '#dc2626',
                  hint: 'Drag left/right to shift the whole curve (tastes)' }
            ];

            const readings = [
                { label: 'Own Price (P)', value: `₹${fmt(v.price, 0)}` },
                { label: 'Quantity Demanded (Q)', value: `${fmt(qNow, 1)} units` },
                { label: 'Net non-price shift', value: `${shift > 0 ? '+' : ''}${fmt(shift, 0)} units at every price` },
                { label: 'Movement effect (price alone)', value: `${fmt(qNewPriceOld - q0, 1)} units` },
                { label: 'Shift effect (determinants alone)', value: `${fmt(qSamePriceNew - q0, 1)} units` },
                { label: 'Law of Demand holds?', value: (qNow - q0) * priceD <= 0 || shifted ? '✔ P and Q move opposite ways along a curve' : '—' }
            ];

            return {
                curves, points, arrows, handles, readings,
                verdict: glMoveShiftVerdict('demand', priceD, shift),
                metrics: { priceD, shift, q: qNow }
            };
        }
    },
    // Teaching & Learning Toolkit (js/sim-engine.js's renderTLM) — the
    // flagship lab for this too, per Stage 21's "build one module
    // excellently, then propagate." Every field independent/optional.
    tlm: {
        keyIdea: 'Own price moves you ALONG the curve (movement). Anything else moves the WHOLE curve (shift). Never mix the two up.',
        commonMistakes: [
            'Calling a price-driven expansion/contraction an "increase/decrease in demand" — that phrase is reserved for a SHIFT, never a movement.',
            'Saying the demand curve "shifts" when only price changed — price never shifts its own curve, it only moves you along it.',
            'Forgetting that "both at once" needs BOTH terms named separately in the exam answer, not one combined sentence.'
        ],
        examTip: 'If the question changes the good\'s OWN price, your answer must use "expansion"/"contraction" — never "increase"/"decrease". If it changes anything else (income, related-good prices, tastes, expectations, number of buyers), your answer must use "increase"/"decrease" — never "expansion"/"contraction". Examiners specifically award marks for using the right pair of words.',
        thinkQuestion: 'Bus fares rise AND, separately, more people move to the city this year. Sketch what happens to the demand curve for bus rides — is this a pure movement, a pure shift, or both? Which determinant is responsible for the shift?',
        activity: {
            title: 'Newspaper Headline Hunt',
            instructions: 'Find 3 real news headlines about a good/service becoming cheaper, dearer, more fashionable, or facing a new substitute. For each, decide: movement or shift? Which named determinant (if any) is responsible? Bring your 3 headlines and answers to class.'
        },
        exitTicket: 'In one sentence: petrol prices rise sharply. What happens to the demand curve for petrol — and what is the exam term for it?',
        teacherExplain: 'Project this lab on a screen. Set all non-price determinants to 0 first and drag ONLY the price handle — ask the class to name what they see before revealing the verdict banner. Then reset, and drag ONLY a determinant chip (e.g. Income) — again ask them to predict first. The contrast between the two drags, done back-to-back, is what actually fixes the distinction; doing them in the same sitting matters more than either demo alone.',
        quickCheck: {
            question: 'A shop announces "Diwali Sale — 20% off!" What happens to the demand curve for that shop\'s goods?',
            options: [
                'Movement down along the same demand curve (expansion)',
                'The demand curve shifts right (an increase in demand)',
                'Nothing changes',
                'The demand curve shifts left (a decrease in demand)'
            ],
            correctIndex: 0,
            explain: 'A sale is a price cut on the good itself — that is an OWN-PRICE change, so it is a movement along the same curve (expansion), not a shift. "Tastes changed because of the sale" is a common but incorrect reframing — the sale IS a price change.'
        }
    },
    practice: [
        { prompt: 'Set every determinant to 0, then drag the price handle down. Is this an expansion of demand or an increase in demand?', hint: 'Only the OWN PRICE changed and you stayed on the same curve DD ⇒ movement ⇒ Expansion (Extension) of Demand.' },
        { prompt: 'Now reset the price to ₹50 and raise Consumer Income instead. Which term applies?', hint: 'A non-price determinant changed ⇒ the whole curve shifts right to D₁D₁ ⇒ Increase in Demand.' },
        { prompt: 'The price of a substitute FALLS. Which way does DD shift, and what is it called?', hint: 'A cheaper substitute pulls buyers away, so at every price less is demanded ⇒ leftward shift ⇒ Decrease in Demand.' },
        { prompt: 'Give the exam sentence for the "Price ↓ AND income ↑" scenario.', hint: 'Two events, named separately: (i) income ↑ ⇒ DD shifts right to D₁D₁ ⇒ Increase in Demand; (ii) price ↓ ⇒ movement down along D₁D₁ ⇒ Expansion of Demand.' }
    ],
    challenge: {
        prompt: 'Produce a diagram showing an INCREASE in demand with NO expansion or contraction — i.e. a pure shift.',
        check: (s, m) => Math.abs(m.priceD) < 0.001 && m.shift > 0
    }
});

SIMS.push({
    id: 'gl-supply-movement-shift',
    module: 'micro',
    title: 'Supply: Movement vs Shift (Drag the Curve)',
    desc: 'The supply-side twin: expansion/contraction of supply vs increase/decrease in supply, drawn and named as you drag.',
    class: 'XI', part: 'B', unit: 6, unitTitle: 'Producer Behaviour and Supply', topicLabel: 'Movements vs Shifts',
    syllabusIds: ['XI-B-U6-SUPPLY'],
    mode: 'graphlab',
    concept: '<p>Supply mirrors demand, and the same trap catches students. <b>Movement along SS</b> is caused by the good\'s <b>own price</b> only: price rises ⇒ <b>Expansion of Supply</b>; price falls ⇒ <b>Contraction of Supply</b>. Note the direction is <i>opposite</i> to demand, because SS slopes upward.</p><p><b>Shift of SS</b> is caused by a <b>non-price determinant</b>: input/factor prices, technology, taxes and subsidies, prices of other goods the firm could produce, the number of firms, and producer expectations. Rightward ⇒ <b>Increase in Supply</b>; leftward ⇒ <b>Decrease in Supply</b>.</p>',
    formulas: [
        'Supply curve: P = c + d·Q',
        'Own price ↑ ⇒ MOVEMENT up along SS ⇒ Expansion of Supply',
        'Own price ↓ ⇒ MOVEMENT down along SS ⇒ Contraction of Supply',
        'Cheaper inputs / better technology / subsidy ⇒ SS shifts RIGHT ⇒ Increase in Supply',
        'Costlier inputs / higher tax ⇒ SS shifts LEFT ⇒ Decrease in Supply'
    ],
    graphLab: {
        // See gl-demand-movement-shift's identical flag — same movement/
        // shift verdict vocabulary (glMoveShiftVerdict), so the PREDICT
        // gate propagates here for free.
        predict: true,
        x: { label: 'Quantity Supplied (units) →', min: 0, max: 100 },
        y: { label: 'Price (₹ per unit) →', min: 0, max: 100 },
        vars: [
            { id: 'price', label: 'Own Price of the Good', min: 5, max: 95, step: 1, value: 50, unit: '₹', group: 'price', hint: 'Changing this moves you ALONG the curve' },
            { id: 'inputCost', label: 'Input / Factor Cost', min: -20, max: 20, step: 1, value: 0, signed: true, hint: 'Costlier inputs shift SS left' },
            { id: 'tech', label: 'Technology (improvement)', min: -20, max: 20, step: 1, value: 0, signed: true, hint: 'Better technology shifts SS right' },
            { id: 'tax', label: 'Tax (+) / Subsidy (−)', min: -20, max: 20, step: 1, value: 0, signed: true },
            { id: 'firms', label: 'Number of Firms', min: -20, max: 20, step: 1, value: 0, signed: true }
        ],
        scenarios: [
            { label: 'Price rises ₹50 → ₹70', note: 'Expansion of Supply', set: { price: 70 } },
            { label: 'Price falls ₹50 → ₹30', note: 'Contraction of Supply', set: { price: 30 } },
            { label: 'Better technology arrives', note: 'Increase in Supply', set: { tech: 15 } },
            { label: 'Government imposes a tax', note: 'Decrease in Supply', set: { tax: 15 } },
            { label: 'Input prices rise sharply', note: 'Decrease in Supply', set: { inputCost: 16 } }
        ],
        stories: [{
            id: 'tomato-farm',
            title: { en: "Lakshmi's tomato farm — movement or shift?", hi: 'लक्ष्मी का टमाटर का खेत — movement या shift?' },
            intro: {
                en: 'Lakshmi grows tomatoes for the mandi. The price changes, then diesel gets costlier, then both happen together. Predict what each does to the supply curve.',
                hi: 'लक्ष्मी मंडी के लिए टमाटर उगाती है। पहले कीमत बदलती है, फिर डीज़ल महँगा होता है, फिर दोनों एक साथ। अनुमान लगाइए कि हर बार supply curve पर क्या असर होगा।'
            },
            outro: {
                en: 'Own price ⇒ movement along SS (expansion/contraction). Any other determinant — input cost, technology, tax, number of firms ⇒ the whole SS shifts (increase/decrease). Same quantity can be the result of two separate events.',
                hi: 'अपनी कीमत ⇒ SS के साथ movement (विस्तार/संकुचन)। कोई अन्य निर्धारक — आगत लागत, तकनीक, कर, फ़र्मों की संख्या ⇒ पूरा SS खिसकता है (वृद्धि/कमी)। एक ही मात्रा दो अलग घटनाओं का परिणाम हो सकती है।'
            },
            steps: [
                {
                    set: {},
                    say: (c, hi) => hi
                        ? `₹${fmt(c.v.price, 0)} प्रति crate पर लक्ष्मी मंडी में ${fmt(c.m.metrics.q, 0)} crate लाती है — supply curve SS पर बिंदु A।`
                        : `At ₹${fmt(c.v.price, 0)} a crate, Lakshmi brings ${fmt(c.m.metrics.q, 0)} crates to the mandi — point A on the supply curve SS.`,
                    check: c => c.m.verdict.kind === 'none'
                },
                {
                    set: { price: 70 },
                    ask: {
                        q: { en: 'The mandi price of tomatoes rises from ₹50 to ₹70. What happens on the diagram?', hi: 'टमाटर का मंडी भाव ₹50 से ₹70 हो जाता है। Diagram पर क्या होगा?' },
                        options: GL_SUPPLY_STORY_OPTIONS,
                        correct: c => glMoveShiftStoryAnswer(c.m)
                    },
                    say: (c, hi) => hi
                        ? `केवल टमाटर की <b>अपनी कीमत</b> बढ़ी, इसलिए हम उसी SS पर ऊपर चढ़ते हैं — A से B। मात्रा ${fmt(c.prev.m.metrics.q, 0)} से ${fmt(c.m.metrics.q, 0)} crate हुई। परीक्षा का शब्द: <b>आपूर्ति का विस्तार</b> — "आपूर्ति में वृद्धि" नहीं।`
                        : `Only the tomatoes' <b>own price</b> rose, so we climb UP the same SS — from A to B. Quantity goes from ${fmt(c.prev.m.metrics.q, 0)} to ${fmt(c.m.metrics.q, 0)} crates. Exam word: <b>Expansion of Supply</b> — never "increase in supply".`,
                    check: c => c.m.verdict.kind === 'movement' && c.m.metrics.q > c.prev.m.metrics.q
                },
                {
                    set: { inputCost: 15 },
                    ask: {
                        q: { en: 'Price is back at ₹50. Then diesel for her pump and tractor gets much costlier. What happens?', hi: 'कीमत फिर ₹50 है। फिर उसके पंप और ट्रैक्टर का डीज़ल बहुत महँगा हो जाता है। क्या होगा?' },
                        options: GL_SUPPLY_STORY_OPTIONS,
                        correct: c => glMoveShiftStoryAnswer(c.m)
                    },
                    say: (c, hi) => hi
                        ? `एक <b>गैर-कीमत निर्धारक</b> (आगत लागत) बढ़ा: हर crate उगाना महँगा हुआ, इसलिए पूरा SS <b>बाईं ओर</b> S₁S₁ पर खिसका। उसी ₹50 पर अब केवल ${fmt(c.m.metrics.q, 0)} crate। परीक्षा का शब्द: <b>आपूर्ति में कमी</b>।`
                        : `A <b>non-price determinant</b> (input cost) rose: every crate now costs more to grow, so the whole SS shifts <b>LEFT</b> to S₁S₁. At the same ₹50, only ${fmt(c.m.metrics.q, 0)} crates now. Exam word: <b>Decrease in Supply</b>.`,
                    check: c => c.m.verdict.kind === 'shift' && c.m.metrics.shift < 0 && c.v.price === c.first.v.price && c.m.metrics.q < c.first.m.metrics.q
                },
                {
                    set: { inputCost: 15, price: 62 },
                    ask: {
                        q: { en: 'Diesel stays costly — and the mandi price rises to ₹62. She is back to selling the same number of crates as at the start. Compared with the start, what happened?', hi: 'डीज़ल महँगा ही रहता है — और मंडी भाव ₹62 हो जाता है। वह फिर उतने ही crate बेच रही है जितने शुरुआत में। शुरुआत की तुलना में क्या हुआ?' },
                        options: GL_SUPPLY_STORY_OPTIONS,
                        correct: c => glMoveShiftStoryAnswer(c.m)
                    },
                    say: (c, hi) => hi
                        ? `मात्रा फिर ${fmt(c.m.metrics.q, 0)} crate — पर "कुछ नहीं हुआ" ग़लत उत्तर है। <b>दो</b> घटनाएँ हुईं: (1) SS बाईं ओर खिसका — <b>आपूर्ति में कमी</b>; (2) फिर नए S₁S₁ पर ऊपर चढ़े — <b>आपूर्ति का विस्तार</b>। दोनों ने एक-दूसरे को संयोग से बराबर कर दिया।`
                        : `Quantity is ${fmt(c.m.metrics.q, 0)} crates again — but "nothing happened" is the wrong answer. <b>Two</b> events: (1) SS shifted left — <b>Decrease in Supply</b>; (2) then she climbed up the new S₁S₁ — <b>Expansion of Supply</b>. They just happen to cancel out.`,
                    check: c => c.m.verdict.kind === 'both' && Math.abs(c.m.metrics.q - c.first.m.metrics.q) < 0.5
                }
            ]
        }],
        model(v) {
            const d = 0.8, c0 = 10;
            const shift = -v.inputCost + v.tech - v.tax + v.firms;
            const c1 = c0 - shift * d;
            const qOf = (p, c) => (p - c) / d;

            const q0 = qOf(50, c0);
            const qNow = qOf(v.price, c1);
            const qSamePriceNew = qOf(50, c1);
            const qNewPriceOld = qOf(v.price, c0);
            const priceD = v.price - 50;
            const shifted = Math.abs(shift) > 0.001;

            const curves = [];
            if (glShowGhost && shifted) {
                curves.push({ id: 'ss0', label: 'SS', color: '#94a3b8', width: 2.4, dash: '7 5', pts: glLineSeg(c0, d, 0, 100, 0, 100) });
            }
            curves.push({ id: 'ss', label: shifted ? 'S₁S₁' : 'SS', color: shifted ? '#dc2626' : '#16a34a', width: 3.2, pts: glLineSeg(c1, d, 0, 100, 0, 100) });

            const points = [{ id: 'now', x: qNow, y: v.price, label: (priceD || shifted) ? 'B' : 'A', color: '#7c3aed', xTick: `Q=${fmt(qNow, 0)}`, yTick: `₹${fmt(v.price, 0)}` }];
            if (priceD || shifted) points.push({ id: 'orig', x: q0, y: 50, label: 'A', color: '#64748b', xTick: `Q=${fmt(q0, 0)}`, yTick: '₹50' });

            const arrows = [];
            if (shifted) {
                arrows.push({ from: [q0, 50], to: [qSamePriceNew, 50], color: '#dc2626', bend: -26,
                    label: shift > 0 ? 'Increase in Supply (shift →)' : 'Decrease in Supply (← shift)' });
            }
            if (Math.abs(priceD) > 0.001) {
                arrows.push({ from: [shifted ? qSamePriceNew : q0, 50], to: [qNow, v.price], color: '#16a34a',
                    label: priceD > 0 ? 'Expansion (move ↑ along curve)' : 'Contraction (move ↓ along curve)',
                    labelDy: priceD > 0 ? -12 : 16 });
            }

            return {
                curves, points, arrows,
                handles: [
                    { id: 'h-along', x: qNow, y: v.price, bind: 'price', axis: 'y', k: 1, color: '#16a34a', hint: 'Drag up/down to change own price — moves you ALONG SS' },
                    { id: 'h-shift', x: qOf(82, c1), y: 82, bind: 'tech', axis: 'x', k: 1, color: '#dc2626', hint: 'Drag left/right to shift the whole curve (technology)' }
                ],
                readings: [
                    { label: 'Own Price (P)', value: `₹${fmt(v.price, 0)}` },
                    { label: 'Quantity Supplied (Q)', value: `${fmt(qNow, 1)} units` },
                    { label: 'Net non-price shift', value: `${shift > 0 ? '+' : ''}${fmt(shift, 0)} units at every price` },
                    { label: 'Movement effect (price alone)', value: `${fmt(qNewPriceOld - q0, 1)} units` },
                    { label: 'Shift effect (determinants alone)', value: `${fmt(qSamePriceNew - q0, 1)} units` }
                ],
                verdict: glMoveShiftVerdict('supply', priceD, shift),
                metrics: { priceD, shift, q: qNow }
            };
        }
    },
    tlm: {
        keyIdea: 'Own price moves you ALONG SS (movement). Anything else moves the WHOLE curve (shift) — exactly as with demand, just with the direction of the movement flipped.',
        commonMistakes: [
            'Calling a price-driven expansion/contraction of supply an "increase/decrease in supply" — reserved for a shift, never a movement.',
            'Assuming supply behaves like demand: a price RISE is an expansion of SUPPLY but a CONTRACTION of demand — same direction of price change, opposite name, because the curves slope opposite ways.',
            'Forgetting a subsidy is a non-price determinant (it cuts effective cost) — students sometimes treat it as a price change on the good itself.'
        ],
        examTip: 'Always check the SLOPE before naming a movement: SS slopes upward, so price↑ ⇒ Q↑ ⇒ expansion; DD slopes downward, so price↑ ⇒ Q↓ ⇒ contraction. Examiners specifically test this direction-flip between the two curves.',
        thinkQuestion: 'A new factory-automation technology arrives AND, separately, the government raises tax on the good. Sketch what happens to the supply curve — is this a pure shift, a pure movement, or both? Which direction does each named determinant push the curve?',
        activity: {
            title: 'Cost & Technology Tracker',
            instructions: 'Pick a real product (e.g. smartphones, sugar, cotton shirts). Find one real news item about its input costs, technology, or government tax/subsidy changing. Decide: does SS shift right or left? Bring your example and reasoning to class.'
        },
        exitTicket: 'In one sentence: a severe drought raises the cost of raw cotton. What happens to the supply curve for cotton shirts — and what is the exam term for it?',
        teacherExplain: 'Run this immediately after the Demand movement/shift lab, back-to-back — the payoff is the CONTRAST: drag price up on both labs and ask the class why the same direction of price change gets a different name (expansion for supply, contraction for demand). That single side-by-side comparison does more than either lab alone.',
        quickCheck: {
            question: 'The government announces a new tax on sugar production. What happens to the supply curve for sugar?',
            options: [
                'The supply curve shifts left (a decrease in supply)',
                'Movement up along the same supply curve (expansion)',
                'The supply curve shifts right (an increase in supply)',
                'Nothing changes'
            ],
            correctIndex: 0,
            explain: 'A tax raises the effective cost of production — a non-price determinant — so at every price less is supplied. The whole curve shifts left: a decrease in supply, not a movement.'
        }
    },
    practice: [
        { prompt: 'Why is a price RISE called an expansion for supply but a contraction for demand?', hint: 'Both are movements along the curve. SS slopes upward so P↑ ⇒ Q↑ (expansion); DD slopes downward so P↑ ⇒ Q↓ (contraction). The name follows the quantity, not the price.' },
        { prompt: 'A subsidy is announced. Drag the Tax(+)/Subsidy(−) chip negative. Movement or shift?', hint: 'A subsidy is a non-price determinant — it cuts effective cost, so SS shifts right ⇒ Increase in Supply.' },
        { prompt: 'Draw "Decrease in supply with no contraction of supply".', hint: 'Leave own price at ₹50; raise input cost or tax. The curve shifts left with no movement along it.' }
    ],
    challenge: {
        prompt: 'Show a DECREASE in supply that is NOT a contraction of supply.',
        check: (s, m) => Math.abs(m.priceD) < 0.001 && m.shift < 0
    }
});

SIMS.push({
    id: 'gl-market-equilibrium-shifts',
    module: 'micro',
    title: 'Market Equilibrium: Drag DD & SS',
    desc: 'Drag either curve and read off the new equilibrium, plus excess demand / excess supply at any price you set.',
    class: 'XI', part: 'B', unit: 7, unitTitle: 'Forms of Market and Price Determination', topicLabel: 'Equilibrium & Shifts',
    syllabusIds: ['XI-B-U7-MARKET-EQ', 'XI-B-U7-APPLICATIONS'],
    mode: 'graphlab',
    concept: '<p>Equilibrium is where DD cuts SS — one price at which quantity demanded equals quantity supplied. Set the market price <i>away</i> from it and the diagram shows the gap the textbook calls <b>excess demand</b> (shortage, price is pushed up) or <b>excess supply</b> (surplus, price is pushed down).</p><p>Then drag a curve. The four standard cases the exam asks for: <b>DD right</b> ⇒ P↑ Q↑ · <b>DD left</b> ⇒ P↓ Q↓ · <b>SS right</b> ⇒ P↓ Q↑ · <b>SS left</b> ⇒ P↑ Q↓. Shift both together and one of price or quantity becomes <i>indeterminate</i> — which is itself a standard exam answer.</p>',
    formulas: [
        'Equilibrium: Qd = Qs',
        'Excess Demand (shortage) = Qd − Qs > 0  ⇒ price rises',
        'Excess Supply (surplus) = Qs − Qd > 0  ⇒ price falls',
        'DD → right: P↑, Q↑   |   DD → left: P↓, Q↓',
        'SS → right: P↓, Q↑   |   SS → left: P↑, Q↓',
        'Both shift right: Q↑ definitely, P indeterminate'
    ],
    graphLab: {
        // This lab's own verdict.kind vocabulary means something different
        // from demand/supply's ('movement' here = "price away from
        // equilibrium", not "movement along a curve"), so it declares its
        // own predictChoices rather than reusing GL_PREDICT_CHOICES's
        // wording, which would be confidently wrong here.
        predict: true,
        predictChoices: [
            { kind: 'none', label: '✔️ Market already clears (Qd = Qs)' },
            { kind: 'movement', label: '⚖️ Disequilibrium — price is away from equilibrium (excess demand/supply)' },
            { kind: 'shift', label: '↗️ A curve shifts — equilibrium itself moves' }
        ],
        x: { label: 'Quantity (units) →', min: 0, max: 100 },
        y: { label: 'Price (₹ per unit) →', min: 0, max: 100 },
        vars: [
            { id: 'mktPrice', label: 'Market Price set by you', min: 5, max: 95, step: 1, value: 47, unit: '₹', group: 'price', hint: 'Away from equilibrium this creates excess demand or excess supply' },
            { id: 'dShift', label: 'Demand shift (income, tastes…)', min: -25, max: 25, step: 1, value: 0, signed: true },
            { id: 'sShift', label: 'Supply shift (cost, technology…)', min: -25, max: 25, step: 1, value: 0, signed: true }
        ],
        scenarios: [
            { label: 'Increase in demand', note: 'P↑ and Q↑', set: { dShift: 18 } },
            { label: 'Decrease in demand', note: 'P↓ and Q↓', set: { dShift: -18 } },
            { label: 'Increase in supply', note: 'P↓ and Q↑', set: { sShift: 18 } },
            { label: 'Decrease in supply', note: 'P↑ and Q↓', set: { sShift: -18 } },
            { label: 'Both increase equally', note: 'Q↑, P indeterminate', set: { dShift: 18, sShift: 18 } }
        ],
        stories: [{
            id: 'onion-prices',
            title: { en: 'Why did onion prices shoot up?', hi: 'प्याज़ की कीमतें अचानक क्यों बढ़ीं?' },
            intro: {
                en: 'A headline every Indian has read. Follow the onion market through a bad monsoon and then a festival season — predicting each move before the market makes it.',
                hi: 'एक ऐसी ख़बर जो हर भारतीय ने पढ़ी है। ख़राब मानसून और फिर त्योहारों के मौसम में प्याज़ बाज़ार के साथ चलिए — बाज़ार के हर कदम से पहले उसका अनुमान लगाइए।'
            },
            outro: {
                en: 'Decrease in supply ⇒ P↑ Q↓. Shortage at the old price is what pushes the price up. When both curves shift, one of P or Q becomes indeterminate — and "indeterminate" is a full exam answer.',
                hi: 'आपूर्ति में कमी ⇒ P↑ Q↓। पुरानी कीमत पर कमी (shortage) ही कीमत को ऊपर धकेलती है। जब दोनों curve खिसकते हैं, तो P या Q में से एक अनिर्धारित हो जाता है — और "अनिर्धारित" परीक्षा में पूरा उत्तर है।'
            },
            steps: [
                {
                    set: { mktPrice: 50 },
                    say: (c, hi) => hi
                        ? `बाज़ार संतुलन में है: DD और SS बिंदु E पर कटते हैं — कीमत OP = ₹${fmt(c.m.metrics.eqP, 0)}, मात्रा OQ = ${fmt(c.m.metrics.eqQ, 0)} टन। जितना खरीदार चाहते हैं, उतना ही किसान लाते हैं।`
                        : `The market is in equilibrium: DD cuts SS at E — price OP = ₹${fmt(c.m.metrics.eqP, 0)}, quantity OQ = ${fmt(c.m.metrics.eqQ, 0)} tonnes. Buyers want exactly what farmers bring.`,
                    check: c => c.m.verdict.kind === 'none' && Math.abs(c.m.metrics.gap) < 0.6
                },
                {
                    set: { mktPrice: 50, sShift: -15 },
                    ask: {
                        q: { en: 'Heavy rain destroys part of the onion crop. Which curve moves, and which way?', hi: 'भारी बारिश प्याज़ की फ़सल का कुछ हिस्सा नष्ट कर देती है। कौन-सा curve खिसकेगा, और किस ओर?' },
                        options: GL_MARKET_STORY_OPTIONS,
                        correct: c => glMarketStoryAnswer(c.m)
                    },
                    say: (c, hi) => hi
                        ? `आपूर्ति घटी: SS <b>बाईं ओर</b> खिसका। पुरानी कीमत ₹${fmt(c.v.mktPrice, 0)} पर अब खरीदार ज़्यादा चाहते हैं जितना किसान ला पाते हैं — <b>अधिमाँग (shortage)</b> ${fmt(c.m.metrics.gap, 0)} टन की। बाज़ार अब संतुलन में नहीं है।`
                        : `Supply falls: SS shifts <b>LEFT</b>. At the old price ₹${fmt(c.v.mktPrice, 0)}, buyers now want more than farmers can bring — an <b>excess demand (shortage)</b> of ${fmt(c.m.metrics.gap, 0)} tonnes. The market no longer clears.`,
                    check: c => c.m.metrics.sShift < 0 && c.m.metrics.dShift === 0 && c.m.metrics.gap > 0
                },
                {
                    set: { mktPrice: 56, sShift: -15 },
                    ask: {
                        q: { en: 'With that shortage, what happens to the price of onions?', hi: 'इस कमी के साथ प्याज़ की कीमत का क्या होगा?' },
                        options: [
                            { en: 'It rises until the shortage disappears', hi: 'यह तब तक बढ़ेगी जब तक कमी ख़त्म न हो जाए' },
                            { en: 'It falls', hi: 'यह घटेगी' },
                            { en: 'It stays at ₹50', hi: 'यह ₹50 पर ही रहेगी' }
                        ],
                        correct: c => c.m.metrics.eqP > c.first.m.metrics.eqP + 0.5 ? 0 : (c.m.metrics.eqP < c.first.m.metrics.eqP - 0.5 ? 1 : 2)
                    },
                    say: (c, hi) => hi
                        ? `कम प्याज़ के लिए खरीदार होड़ करते हैं और कीमत बढ़ाते जाते हैं। यह ₹${fmt(c.m.metrics.eqP, 0)} पर रुकती है, जहाँ कमी ख़त्म हो जाती है: नया संतुलन E₁ — कीमत <b>ऊपर</b> (₹${fmt(c.first.m.metrics.eqP, 0)} → ₹${fmt(c.m.metrics.eqP, 0)}), मात्रा <b>नीचे</b> (${fmt(c.first.m.metrics.eqQ, 1)} → ${fmt(c.m.metrics.eqQ, 1)} टन)।`
                        : `Buyers compete for scarce onions and bid the price up. It stops at ₹${fmt(c.m.metrics.eqP, 0)}, where the shortage disappears: new equilibrium E₁ — price <b>UP</b> (₹${fmt(c.first.m.metrics.eqP, 0)} → ₹${fmt(c.m.metrics.eqP, 0)}), quantity <b>DOWN</b> (${fmt(c.first.m.metrics.eqQ, 1)} → ${fmt(c.m.metrics.eqQ, 1)} tonnes).`,
                    check: c => Math.abs(c.m.metrics.gap) < 0.6 && c.m.metrics.eqP > c.first.m.metrics.eqP && c.m.metrics.eqQ < c.first.m.metrics.eqQ
                },
                {
                    set: { mktPrice: 50, dShift: 15, sShift: 15 },
                    ask: {
                        q: { en: 'Next year: a bumper crop raises supply, and festival demand rises by the same amount. What happens to the price?', hi: 'अगले साल: बंपर फ़सल से आपूर्ति बढ़ती है, और त्योहारों की माँग भी उतनी ही बढ़ती है। कीमत का क्या होगा?' },
                        options: [
                            { en: 'It definitely rises', hi: 'यह निश्चित रूप से बढ़ेगी' },
                            { en: 'It definitely falls', hi: 'यह निश्चित रूप से घटेगी' },
                            { en: 'Indeterminate — it depends on which shift is bigger', hi: 'अनिर्धारित — यह इस पर निर्भर है कि कौन-सा खिसकाव बड़ा है' }
                        ],
                        correct: c => Math.abs(c.m.metrics.eqP - c.first.m.metrics.eqP) < 1.2 ? 2 : (c.m.metrics.eqP > c.first.m.metrics.eqP ? 0 : 1)
                    },
                    say: (c, hi) => hi
                        ? `दोनों curve बराबर दाईं ओर खिसके: मात्रा निश्चित रूप से बढ़ी (${fmt(c.first.m.metrics.eqQ, 0)} → ${fmt(c.m.metrics.eqQ, 0)} टन), पर कीमत ₹${fmt(c.m.metrics.eqP, 0)} पर रही — कीमत पर असर <b>अनिर्धारित</b> है; किसी एक curve को ज़्यादा खिसकाइए और कीमत उसी ओर टूट जाएगी।`
                        : `Both curves shifted right by the same amount: quantity definitely rises (${fmt(c.first.m.metrics.eqQ, 0)} → ${fmt(c.m.metrics.eqQ, 0)} tonnes), but price ends at ₹${fmt(c.m.metrics.eqP, 0)} — the price effect is <b>indeterminate</b>; drag one curve further than the other and the price breaks that way.`,
                    check: c => c.m.metrics.dShift > 0 && c.m.metrics.sShift > 0 && c.m.metrics.eqQ > c.first.m.metrics.eqQ && Math.abs(c.m.metrics.eqP - c.first.m.metrics.eqP) < 1.2
                }
            ]
        }],
        model(v) {
            const b = 0.8, dS = 0.8;
            const a = 90 + v.dShift * b;
            const c = 10 - v.sShift * dS;
            const eq = lineIntersect(a, b, c, dS);
            const eq0 = lineIntersect(90, b, 10, dS);

            const qd = Math.max(0, (a - v.mktPrice) / b);
            const qs = Math.max(0, (v.mktPrice - c) / dS);
            const gap = qd - qs;

            const dMoved = Math.abs(v.dShift) > 0.001, sMoved = Math.abs(v.sShift) > 0.001;
            const curves = [];
            if (glShowGhost && dMoved) curves.push({ id: 'dd0', label: 'DD', color: '#94a3b8', width: 2.2, dash: '7 5', pts: glLineSeg(90, -b, 0, 100, 0, 100) });
            if (glShowGhost && sMoved) curves.push({ id: 'ss0', label: 'SS', color: '#94a3b8', width: 2.2, dash: '7 5', pts: glLineSeg(10, dS, 0, 100, 0, 100) });
            curves.push({ id: 'dd', label: dMoved ? 'D₁D₁' : 'DD', color: '#2563eb', width: 3.2, pts: glLineSeg(a, -b, 0, 100, 0, 100) });
            curves.push({ id: 'ss', label: sMoved ? 'S₁S₁' : 'SS', color: '#16a34a', width: 3.2, pts: glLineSeg(c, dS, 0, 100, 0, 100) });

            const points = [{ id: 'eq', x: eq.Q, y: eq.P, label: (dMoved || sMoved) ? 'E₁' : 'E', color: '#7c3aed', xTick: `OQ=${fmt(eq.Q, 0)}`, yTick: `OP=₹${fmt(eq.P, 0)}` }];
            if (dMoved || sMoved) points.push({ id: 'eq0', x: eq0.Q, y: eq0.P, label: 'E', color: '#64748b', xTick: `${fmt(eq0.Q, 0)}`, yTick: `₹${fmt(eq0.P, 0)}` });

            const arrows = [];
            if (Math.abs(gap) > 0.6) {
                arrows.push({
                    from: [Math.min(qd, qs), v.mktPrice], to: [Math.max(qd, qs), v.mktPrice],
                    color: gap > 0 ? '#dc2626' : '#ea580c', bend: 0, labelDy: -12,
                    label: gap > 0 ? `Excess Demand = ${fmt(gap, 0)} (price ↑)` : `Excess Supply = ${fmt(-gap, 0)} (price ↓)`
                });
            }

            let vTitle, vKind, vDetail, vHi;
            if (!dMoved && !sMoved) {
                vKind = Math.abs(gap) > 0.6 ? 'movement' : 'none';
                vHi = {
                    title: Math.abs(gap) > 0.6
                        ? (gap > 0 ? 'कीमत संतुलन से <b>नीचे</b> → <b>अधिमाँग (वस्तु की कमी)</b>' : 'कीमत संतुलन से <b>ऊपर</b> → <b>अधिपूर्ति (वस्तु का आधिक्य)</b>')
                        : 'बाज़ार <b>संतुलन</b> में है — Qd = Qs।',
                    detail: Math.abs(gap) > 0.6
                        ? `₹${fmt(v.mktPrice, 0)} पर Qd = ${fmt(qd, 0)} और Qs = ${fmt(qs, 0)}। ${gap > 0 ? 'क्रेता कम वस्तुओं के लिए होड़ करते हैं और कीमत को ₹' + fmt(eq.P, 0) + ' की ओर <b>ऊपर</b> धकेलते हैं — अंतर मिटने तक पूर्ति की गई मात्रा का विस्तार और माँगी गई मात्रा का संकुचन होता है।' : 'बिना बिका माल विक्रेताओं को कीमत ₹' + fmt(eq.P, 0) + ' की ओर <b>घटाने</b> पर मजबूर करता है — अंतर मिटने तक माँगी गई मात्रा का विस्तार और पूर्ति की गई मात्रा का संकुचन होता है।'}`
                        : `संतुलन कीमत OP = ₹${fmt(eq.P, 0)}, संतुलन मात्रा OQ = ${fmt(eq.Q, 0)} इकाइयाँ। अब कोई वक्र खिसकाएँ, या कीमत को OP से दूर रखें, और बाज़ार को बिगड़ते और फिर संतुलित होते देखें।`
                };
                vTitle = Math.abs(gap) > 0.6
                    ? (gap > 0 ? 'Price is BELOW equilibrium → <b>Excess Demand (Shortage)</b>' : 'Price is ABOVE equilibrium → <b>Excess Supply (Surplus)</b>')
                    : 'Market is in <b>equilibrium</b> — Qd = Qs.';
                vDetail = Math.abs(gap) > 0.6
                    ? `At ₹${fmt(v.mktPrice, 0)}, Qd = ${fmt(qd, 0)} and Qs = ${fmt(qs, 0)}. ${gap > 0 ? 'Buyers compete for too few goods, bidding the price <b>up</b> toward ₹' + fmt(eq.P, 0) + ' — quantity supplied expands and quantity demanded contracts until the gap closes.' : 'Unsold stock forces sellers to cut the price <b>down</b> toward ₹' + fmt(eq.P, 0) + ' — quantity demanded expands and quantity supplied contracts until the gap closes.'}`
                    : `Equilibrium price OP = ₹${fmt(eq.P, 0)}, equilibrium quantity OQ = ${fmt(eq.Q, 0)} units. Now shift a curve, or set a price away from OP, to see the market break and re-clear.`;
            } else {
                const dp = eq.P - eq0.P, dq = eq.Q - eq0.Q;
                const both = dMoved && sMoved;
                vKind = 'shift';
                const cause = both ? 'Both curves shifted' : (dMoved ? (v.dShift > 0 ? 'Increase in Demand' : 'Decrease in Demand') : (v.sShift > 0 ? 'Increase in Supply' : 'Decrease in Supply'));
                vTitle = `<b>${cause}</b> → equilibrium moved E → E₁: price ${dp > 0.5 ? '↑ rises' : dp < -0.5 ? '↓ falls' : '— unchanged'}, quantity ${dq > 0.5 ? '↑ rises' : dq < -0.5 ? '↓ falls' : '— unchanged'}`;
                const causeHi = both ? 'दोनों वक्र खिसके' : (dMoved ? (v.dShift > 0 ? 'माँग में वृद्धि' : 'माँग में कमी') : (v.sShift > 0 ? 'पूर्ति में वृद्धि' : 'पूर्ति में कमी'));
                const was = `New equilibrium: OP = ₹${fmt(eq.P, 0)} (was ₹${fmt(eq0.P, 0)}), OQ = ${fmt(eq.Q, 0)} (was ${fmt(eq0.Q, 0)}).`;
                const wasHi = `नया संतुलन: OP = ₹${fmt(eq.P, 0)} (पहले ₹${fmt(eq0.P, 0)}), OQ = ${fmt(eq.Q, 0)} (पहले ${fmt(eq0.Q, 0)})।`;
                const indet = both && Math.abs(dp) < 1.2;
                // With BOTH curves moved there is no "other curve that stayed
                // put" — the old text said so in every case, which was false
                // whenever both shifted far enough to move the price.
                vDetail = indet
                    ? `Both curves shifted by a similar amount, so quantity changes definitely but the <b>price effect is indeterminate</b> — it depends on the <i>relative</i> size of the two shifts. Drag one further than the other and watch the price break one way. "Indeterminate" is a complete exam answer here.`
                    : both
                        ? `${was} Both curves moved to new positions; the new equilibrium E₁ is where D₁D₁ cuts S₁S₁. Price moved because one shift outweighed the other — with equal shifts its direction would be indeterminate.`
                        : `${was} The curve moved to a new position — the other curve did not move; the market only travelled <i>along</i> it to the new intersection.`;
                const arrowHi = d => d > 0.5 ? '↑ बढ़ी' : d < -0.5 ? '↓ घटी' : '— अपरिवर्तित';
                vHi = {
                    title: `<b>${causeHi}</b> → संतुलन E → E₁ पर गया: कीमत ${arrowHi(dp)}, मात्रा ${arrowHi(dq)}`,
                    detail: indet
                        ? `दोनों वक्र लगभग बराबर खिसके, इसलिए मात्रा में परिवर्तन निश्चित है पर <b>कीमत पर प्रभाव अनिर्धार्य</b> है — यह दोनों खिसकावों के <i>सापेक्ष</i> आकार पर निर्भर करता है। एक वक्र को दूसरे से अधिक खींचें और कीमत को एक दिशा में जाते देखें। यहाँ "अनिर्धार्य" परीक्षा में पूरा उत्तर है।`
                        : both
                            ? `${wasHi} दोनों वक्र नई स्थितियों पर गए; नया संतुलन E₁ वहाँ है जहाँ D₁D₁, S₁S₁ को काटता है। कीमत इसलिए बदली कि एक खिसकाव दूसरे से बड़ा था — बराबर खिसकाव पर उसकी दिशा अनिर्धार्य होती।`
                            : `${wasHi} खिसका हुआ वक्र नई स्थिति पर गया — दूसरा वक्र नहीं खिसका; बाज़ार केवल उसके <i>साथ-साथ</i> नए कटान बिंदु तक चला।`
                };
            }

            return {
                curves, points, arrows,
                handles: [
                    { id: 'h-price', x: Math.max(qd, qs), y: v.mktPrice, bind: 'mktPrice', axis: 'y', color: '#7c3aed', hint: 'Drag the market price up/down' },
                    { id: 'h-dd', x: (a - 78) / b, y: 78, bind: 'dShift', axis: 'x', k: b, color: '#2563eb', hint: 'Drag DD left/right' },
                    { id: 'h-ss', x: (82 - c) / dS, y: 82, bind: 'sShift', axis: 'x', k: dS, color: '#16a34a', hint: 'Drag SS left/right' }
                ],
                readings: [
                    { label: 'Equilibrium Price (OP)', value: `₹${fmt(eq.P, 1)}` },
                    { label: 'Equilibrium Quantity (OQ)', value: `${fmt(eq.Q, 1)} units` },
                    { label: 'Your market price', value: `₹${fmt(v.mktPrice, 0)}` },
                    { label: 'Quantity demanded there', value: `${fmt(qd, 1)} units` },
                    { label: 'Quantity supplied there', value: `${fmt(qs, 1)} units` },
                    { label: gap > 0 ? 'Excess Demand' : gap < 0 ? 'Excess Supply' : 'Market clears', value: Math.abs(gap) < 0.05 ? '✔ Qd = Qs' : `${fmt(Math.abs(gap), 1)} units` }
                ],
                verdict: { kind: vKind, title: vTitle, detail: vDetail, hi: vHi },
                metrics: { eqP: eq.P, eqQ: eq.Q, gap, dShift: v.dShift, sShift: v.sShift }
            };
        }
    },
    tlm: {
        keyIdea: 'Equilibrium is the ONE price where Qd = Qs. Push price away from it and the market itself pushes back — that pressure IS excess demand or excess supply.',
        commonMistakes: [
            'Assuming price can sit anywhere — a price away from equilibrium always creates a gap (shortage or surplus) that pushes it back, it does not just stay put.',
            'When both curves shift together, trying to name a definite price direction — "indeterminate" is the correct, complete exam answer when the shifts are of similar size, not a sign of not knowing the answer.',
            'Mixing up which shift caused which change in a two-shift scenario, instead of tracing demand and supply effects on price and quantity separately.'
        ],
        examTip: 'For a single shift, use the 4-case table directly: DD right ⇒ P↑Q↑, DD left ⇒ P↓Q↓, SS right ⇒ P↓Q↑, SS left ⇒ P↑Q↓. For BOTH shifting, decide quantity first (it is usually determinate) and only call price "indeterminate" when the two effects genuinely oppose each other by unclear relative size — say so explicitly, don\'t guess a direction.',
        thinkQuestion: 'A bumper harvest increases the supply of onions AND, separately, a food-delivery trend increases demand for restaurant meals using onions. If both shifts happen to onions\' market at once, what can you say for certain about quantity, and what would you need to know to say anything about price?',
        activity: {
            title: 'Real Market Disequilibrium Hunt',
            instructions: 'Find one real example of a price ceiling (e.g. rent control) or a price floor (e.g. minimum support price for crops) in the news. Identify whether it creates excess demand or excess supply, and what real-world symptom that produces (queues, black markets, unsold stock, etc.).'
        },
        exitTicket: 'In one sentence: a government sets a price ceiling below the market equilibrium price. What does the diagram show, and what real-world symptom follows?',
        teacherExplain: 'Set the market price handle away from equilibrium FIRST (before touching either curve) and ask the class to predict which way price will move and why — this establishes the "market has a pull toward equilibrium" intuition before shifts are introduced at all. Only then drag a curve to show a shift moving the equilibrium point itself.',
        quickCheck: {
            question: 'At the current market price, Quantity Demanded is 40 units and Quantity Supplied is 25 units. What is happening, and which way will price move?',
            options: [
                'Excess Demand (shortage) of 15 units — price will rise',
                'Excess Supply (surplus) of 15 units — price will fall',
                'The market is in equilibrium — no change',
                'Excess Demand of 65 units — price will fall'
            ],
            correctIndex: 0,
            explain: 'Qd (40) > Qs (25) means buyers want more than is being offered — excess demand (a shortage) of 40−25=15 units. Buyers competing for the scarce goods bid the price up, which is exactly the market\'s own pressure back toward equilibrium.'
        }
    },
    practice: [
        { prompt: 'Set the market price to ₹30. Name the disequilibrium and say which way price moves.', hint: '₹30 is below OP, so Qd > Qs ⇒ Excess Demand (shortage). Buyers bid the price up until Qd = Qs.' },
        { prompt: 'Increase demand and increase supply by the same amount. What happens to price?', hint: 'Quantity definitely rises; the price effect is indeterminate because the two shifts pull it in opposite directions by equal force.' },
        { prompt: 'Which single shift raises price AND lowers quantity?', hint: 'A decrease in supply (SS shifts left): P↑, Q↓.' }
    ],
    challenge: {
        prompt: 'Make equilibrium quantity rise while equilibrium price stays (almost) unchanged.',
        check: (s, m) => m.eqQ > 51 && Math.abs(m.eqP - 50) < 2
    }
});

SIMS.push({
    id: 'gl-consumer-equilibrium-ic',
    module: 'micro',
    title: "Consumer's Equilibrium: IC + Budget Line",
    desc: 'Drag the budget line and the chosen bundle. Tangency, MRS = Px/Py, and what an income vs a price change does to the line.',
    class: 'XI', part: 'B', unit: 5, unitTitle: "Consumer's Equilibrium and Demand", topicLabel: 'Indifference Curve Analysis',
    syllabusIds: ['XI-B-U5-IC'],
    mode: 'graphlab',
    concept: '<p>The consumer is in equilibrium where the <b>budget line is tangent to the highest attainable indifference curve</b>. At that point the slope of the IC (the <b>MRS</b>) equals the slope of the budget line (the price ratio <b>Px/Py</b>), and the IC is convex to the origin.</p><p>Two conditions, both examinable: <b>(i) MRS = Px/Py</b> and <b>(ii) MRS falls</b> as more X is consumed (diminishing MRS ⇒ IC convex).</p><p>Drag the budget line: a change in <b>income</b> shifts it parallel; a change in <b>Px</b> swivels it around the Y-intercept. That difference is the whole basis for deriving the demand curve from IC analysis.</p>',
    formulas: [
        'Budget line: Px·X + Py·Y = M',
        'Slope of budget line = Px / Py',
        'MRS(xy) = ΔY / ΔX  (units of Y given up for one more X)',
        "Consumer's equilibrium: MRS = Px / Py, with MRS falling",
        'Income ↑ ⇒ budget line shifts parallel outward',
        'Px ↓ ⇒ budget line swivels outward on the X-intercept'
    ],
    graphLab: {
        groupLabels: { price: 'Prices — these SWIVEL the budget line', other: 'Income — this SHIFTS the budget line parallel' },
        x: { label: 'Good X (units) →', min: 0, max: 50 },
        y: { label: 'Good Y (units) →', min: 0, max: 50 },
        vars: [
            { id: 'M', label: 'Income (M)', min: 60, max: 260, step: 5, value: 160, unit: '₹', hint: 'Shifts the budget line PARALLEL' },
            { id: 'Px', label: 'Price of X (Px)', min: 2, max: 16, step: 0.5, value: 5, unit: '₹', group: 'price', hint: 'Swivels the budget line' },
            { id: 'Py', label: 'Price of Y (Py)', min: 2, max: 16, step: 0.5, value: 5, unit: '₹', group: 'price' }
        ],
        scenarios: [
            { label: 'Income rises', note: 'Parallel outward shift', set: { M: 220 } },
            { label: 'Income falls', note: 'Parallel inward shift', set: { M: 100 } },
            { label: 'Price of X falls', note: 'Swivel outward on X-axis', set: { Px: 3 } },
            { label: 'Price of X rises', note: 'Swivel inward on X-axis', set: { Px: 9 } }
        ],
        stories: [{
            id: 'pocket-money',
            title: { en: "Priya's pocket money — books (X) and movies (Y)", hi: 'प्रिया का जेब ख़र्च — किताबें (X) और फ़िल्में (Y)' },
            intro: {
                en: 'Priya spends her monthly pocket money on books (X) and movie tickets (Y). Her income changes, then the price of books changes. Predict what each does to her budget line — the exam always asks.',
                hi: 'प्रिया अपना मासिक जेब ख़र्च किताबों (X) और फ़िल्म टिकटों (Y) पर ख़र्च करती है। पहले उसकी आय बदलती है, फिर किताबों की कीमत। अनुमान लगाइए कि हर बार उसकी बजट रेखा पर क्या असर होगा — परीक्षा में यह हमेशा पूछा जाता है।'
            },
            outro: {
                en: 'Income change ⇒ budget line shifts PARALLEL. Price change ⇒ it SWIVELS on the other axis. Equilibrium: the highest IC the line touches, where MRS = Px/Py. A fall in Px raising X demanded is the law of demand, derived from IC analysis.',
                hi: 'आय में बदलाव ⇒ बजट रेखा समानांतर खिसकती है। कीमत में बदलाव ⇒ वह दूसरे अक्ष पर टिककर घूमती है। संतुलन: सबसे ऊँचा IC जिसे रेखा छूती है, जहाँ MRS = Px/Py। Px घटने पर X की माँग बढ़ना माँग का नियम है, जो IC विश्लेषण से निकलता है।'
            },
            steps: [
                {
                    set: {},
                    say: (c, hi) => hi
                        ? `₹${fmt(c.v.M, 0)} में, किताब ₹${fmt(c.v.Px, 0)} और टिकट ₹${fmt(c.v.Py, 0)}: सबसे अच्छा संयोजन E है — ${fmt(c.m.metrics.xStar, 0)} किताबें और ${fmt(c.m.metrics.yStar, 0)} टिकट, जहाँ बजट रेखा IC₂ को छूती है और MRS = Px/Py = ${fmt(c.m.metrics.ratio, 2)}।`
                        : `With ₹${fmt(c.v.M, 0)}, books at ₹${fmt(c.v.Px, 0)} and tickets at ₹${fmt(c.v.Py, 0)}: her best bundle is E — ${fmt(c.m.metrics.xStar, 0)} books and ${fmt(c.m.metrics.yStar, 0)} tickets, where the budget line just touches IC₂ and MRS = Px/Py = ${fmt(c.m.metrics.ratio, 2)}.`,
                    check: c => Math.abs(c.m.metrics.ratio - c.v.Px / c.v.Py) < 1e-9 && Math.abs(c.m.metrics.xStar * c.v.Px + c.m.metrics.yStar * c.v.Py - c.v.M) < 1e-6
                },
                {
                    set: { M: 220 },
                    ask: {
                        q: { en: 'Her pocket money rises from ₹160 to ₹220. Prices stay the same. What happens to her budget line?', hi: 'उसका जेब ख़र्च ₹160 से ₹220 हो जाता है। कीमतें वही रहती हैं। उसकी बजट रेखा का क्या होगा?' },
                        options: GL_BUDGET_STORY_OPTIONS,
                        correct: c => glBudgetStoryAnswer(c.m, c.prev.m)
                    },
                    say: (c, hi) => hi
                        ? `दोनों अंतःखंड बढ़े (${fmt(c.prev.m.metrics.xInt, 0)} → ${fmt(c.m.metrics.xInt, 0)} किताबें, ${fmt(c.prev.m.metrics.yInt, 0)} → ${fmt(c.m.metrics.yInt, 0)} टिकट), पर ढलान Px/Py = ${fmt(c.m.metrics.ratio, 2)} वही रहा — रेखा <b>समानांतर</b> बाहर खिसकी। अब वह ऊँचे IC पर पहुँचती है: ${fmt(c.m.metrics.xStar, 0)} किताबें और ${fmt(c.m.metrics.yStar, 0)} टिकट।`
                        : `Both intercepts grew (${fmt(c.prev.m.metrics.xInt, 0)} → ${fmt(c.m.metrics.xInt, 0)} books, ${fmt(c.prev.m.metrics.yInt, 0)} → ${fmt(c.m.metrics.yInt, 0)} tickets), but the slope Px/Py = ${fmt(c.m.metrics.ratio, 2)} did not change — the line shifted out <b>parallel</b>. She now reaches a higher IC: ${fmt(c.m.metrics.xStar, 0)} books and ${fmt(c.m.metrics.yStar, 0)} tickets.`,
                    check: c => c.m.metrics.ratio === c.prev.m.metrics.ratio && c.m.metrics.xInt > c.prev.m.metrics.xInt && c.m.metrics.yInt > c.prev.m.metrics.yInt && c.m.metrics.xStar > c.prev.m.metrics.xStar
                },
                {
                    set: { Px: 4 },
                    ask: {
                        q: { en: 'Pocket money goes back to ₹160 — but books get cheaper: ₹5 → ₹4. What happens to her budget line?', hi: 'जेब ख़र्च फिर ₹160 — पर किताबें सस्ती हो जाती हैं: ₹5 → ₹4। उसकी बजट रेखा का क्या होगा?' },
                        options: GL_BUDGET_STORY_OPTIONS,
                        correct: c => glBudgetStoryAnswer(c.m, c.first.m)
                    },
                    say: (c, hi) => hi
                        ? `Y-अंतःखंड ${fmt(c.m.metrics.yInt, 0)} टिकट पर टिका रहा (सारा पैसा फ़िल्मों पर लगाने पर कुछ नहीं बदला), पर X-अंतःखंड ${fmt(c.first.m.metrics.xInt, 0)} से ${fmt(c.m.metrics.xInt, 0)} किताबें हो गया — रेखा X-अक्ष पर <b>बाहर घूमी</b>। वह अब ${fmt(c.first.m.metrics.xStar, 0)} की जगह ${fmt(c.m.metrics.xStar, 0)} किताबें खरीदती है: कीमत घटी, माँगी गई मात्रा बढ़ी — <b>माँग का नियम</b>, IC से निकला।`
                        : `The Y-intercept stayed at ${fmt(c.m.metrics.yInt, 0)} tickets (spending everything on movies is unchanged), but the X-intercept went from ${fmt(c.first.m.metrics.xInt, 0)} to ${fmt(c.m.metrics.xInt, 0)} books — the line <b>swivelled outward</b> on the X-axis. She now buys ${fmt(c.m.metrics.xStar, 0)} books instead of ${fmt(c.first.m.metrics.xStar, 0)}: price down, quantity demanded up — the <b>law of demand</b>, derived from ICs.`,
                    check: c => c.m.metrics.yInt === c.first.m.metrics.yInt && c.m.metrics.xInt > c.first.m.metrics.xInt && c.m.metrics.xStar > c.first.m.metrics.xStar
                },
                {
                    set: { Px: 4 },
                    ask: {
                        q: { en: 'At her new equilibrium, what is her MRS (books for tickets)?', hi: 'उसके नए संतुलन पर उसकी MRS (टिकटों के बदले किताबें) क्या है?' },
                        options: c => [
                            { en: fmt(c.m.metrics.ratio, 2) + ' — the new Px/Py', hi: fmt(c.m.metrics.ratio, 2) + ' — नया Px/Py' },
                            { en: fmt(c.first.m.metrics.ratio, 2) + ' — the old Px/Py', hi: fmt(c.first.m.metrics.ratio, 2) + ' — पुराना Px/Py' },
                            { en: fmt(1 / c.m.metrics.ratio, 2) + ' — Py/Px, the ratio upside down', hi: fmt(1 / c.m.metrics.ratio, 2) + ' — Py/Px, उल्टा अनुपात' }
                        ],
                        correct: c => {
                            const vals = [c.m.metrics.ratio, c.first.m.metrics.ratio, 1 / c.m.metrics.ratio];
                            return vals.findIndex(x => Math.abs(x - c.v.Px / c.v.Py) < 1e-9);
                        }
                    },
                    say: (c, hi) => hi
                        ? `संतुलन पर हमेशा <b>MRS = Px/Py = ${fmt(c.m.metrics.ratio, 2)}</b> — बजट रेखा IC को ठीक स्पर्श करती है। जाँच: ₹${fmt(c.m.metrics.xStar * c.v.Px, 0)} किताबों पर + ₹${fmt(c.m.metrics.yStar * c.v.Py, 0)} फ़िल्मों पर = पूरे ₹${fmt(c.v.M, 0)}। दोनों शर्तें पूरी।`
                        : `At equilibrium <b>MRS = Px/Py = ${fmt(c.m.metrics.ratio, 2)}</b>, always — the budget line is exactly tangent to the IC. Check: ₹${fmt(c.m.metrics.xStar * c.v.Px, 0)} on books + ₹${fmt(c.m.metrics.yStar * c.v.Py, 0)} on movies = the whole ₹${fmt(c.v.M, 0)}. Both conditions hold.`,
                    check: c => Math.abs(c.m.metrics.ratio - c.v.Px / c.v.Py) < 1e-9 && Math.abs(c.m.metrics.xStar * c.v.Px + c.m.metrics.yStar * c.v.Py - c.v.M) < 1e-6
                }
            ]
        }],
        model(v) {
            const xInt = v.M / v.Px, yInt = v.M / v.Py;
            const ratio = v.Px / v.Py;
            // Cobb-Douglas U = X^0.5 Y^0.5 gives the standard convex IC and
            // the tidy equilibrium the textbook uses: spend M/2 on each good.
            const xStar = v.M / (2 * v.Px), yStar = v.M / (2 * v.Py);
            const U = Math.sqrt(Math.max(xStar, 0.01) * Math.max(yStar, 0.01));

            // IC through the equilibrium: Y = U²/X.
            const icPts = (u, n) => {
                const out = [];
                for (let i = 0; i <= n; i++) {
                    const x = 1.2 + (48 - 1.2) * (i / n);
                    const y = (u * u) / x;
                    if (y <= 50 && y >= 0.4) out.push([x, y]);
                }
                return out;
            };

            const curves = [
                { id: 'ic-lo', label: 'IC₁', color: '#cbd5e1', width: 2, pts: icPts(U * 0.72, 60), labelAt: 'end' },
                { id: 'ic', label: 'IC₂', color: '#7c3aed', width: 3, pts: icPts(U, 60), labelAt: 'end' },
                { id: 'ic-hi', label: 'IC₃ (unattainable)', color: '#cbd5e1', width: 2, dash: '5 5', pts: icPts(U * 1.3, 60), labelAt: 'end', labelDx: -110, labelDy: -8 },
                { id: 'bl', label: 'Budget Line', color: '#dc2626', width: 3, labelAt: 'start', labelDx: 6, labelDy: -12,
                  pts: glLineSeg(yInt, -yInt / (xInt || 1), 0, Math.min(50, xInt), 0, Math.min(50, yInt)) }
            ];

            const inRange = xStar <= 50 && yStar <= 50;
            const points = inRange ? [{
                id: 'eq', x: xStar, y: yStar, label: 'E (equilibrium)', color: '#1e1b3a',
                xTick: `${fmt(xStar, 1)}`, yTick: `${fmt(yStar, 1)}`
            }] : [];

            return {
                curves, points,
                arrows: [],
                handles: [
                    { id: 'h-income', x: Math.min(xInt, 49) * 0.5, y: Math.min(yInt, 49) * 0.5, bind: 'M', axis: 'x', k: 1 / v.Px, color: '#dc2626', hint: 'Drag out/in — an INCOME change shifts the line parallel' },
                    { id: 'h-px', x: Math.min(xInt, 49.5), y: 0, bind: 'Px', axis: 'x', k: -v.M / (v.Px * v.Px), color: '#ea580c', hint: 'Drag the X-intercept — a PRICE OF X change swivels the line' }
                ],
                readings: [
                    { label: 'X-intercept (M/Px)', value: `${fmt(xInt, 1)} units of X` },
                    { label: 'Y-intercept (M/Py)', value: `${fmt(yInt, 1)} units of Y` },
                    { label: 'Price ratio Px/Py', value: fmt(ratio, 2) },
                    { label: 'MRS at equilibrium', value: `${fmt(ratio, 2)} ✔ equals Px/Py` },
                    { label: 'Equilibrium bundle E', value: `X = ${fmt(xStar, 1)}, Y = ${fmt(yStar, 1)}` },
                    { label: 'Spending check', value: `₹${fmt(v.Px * xStar, 0)} + ₹${fmt(v.Py * yStar, 0)} = ₹${fmt(v.M, 0)}` }
                ],
                verdict: {
                    kind: 'movement',
                    title: `Equilibrium at E: <b>MRS = Px/Py = ${fmt(ratio, 2)}</b>, on the highest attainable IC₂`,
                    detail: `The consumer cannot reach IC₃ — it lies entirely beyond the budget line. Any point on IC₁ is affordable but gives less satisfaction than E. Only at E is the budget line <b>tangent</b>, so both conditions hold: MRS equals the price ratio, and MRS is diminishing (the IC is convex to the origin). Drag the <span style="color:#dc2626">red</span> handle to change income — notice the line stays <b>parallel</b>. Drag the <span style="color:#ea580c">orange</span> X-intercept to change Px — notice the line <b>swivels</b> instead. That difference is why a price change, not an income change, traces out the demand curve.`,
                    hi: {
                        title: `E पर संतुलन: <b>MRS = Px/Py = ${fmt(ratio, 2)}</b>, सबसे ऊँचे प्राप्य IC₂ पर`,
                        detail: `उपभोक्ता IC₃ तक नहीं पहुँच सकता — वह पूरी तरह बजट रेखा के बाहर है। IC₁ का कोई भी बिंदु खरीदा जा सकता है पर E से कम संतुष्टि देता है। केवल E पर बजट रेखा IC को <b>स्पर्श</b> करती है, इसलिए दोनों शर्तें पूरी होती हैं: MRS कीमत-अनुपात के बराबर है, और MRS घटती है (IC मूल बिंदु की ओर उन्नतोदर है)। आय बदलने के लिए <span style="color:#dc2626">लाल</span> हैंडल खींचें — रेखा <b>समानांतर</b> खिसकती है। Px बदलने के लिए <span style="color:#ea580c">नारंगी</span> X-अंतःखंड खींचें — रेखा <b>घूमती</b> है। यही अंतर बताता है कि माँग वक्र आय के परिवर्तन से नहीं, कीमत के परिवर्तन से बनता है।`
                    }
                },
                metrics: { xStar, yStar, ratio, M: v.M, xInt, yInt }
            };
        }
    },
    practice: [
        { prompt: 'State the two conditions for consumer equilibrium under the IC approach.', hint: '(i) MRS = Px/Py, and (ii) MRS is diminishing — i.e. the IC is convex to the origin at that point.' },
        { prompt: 'Change income and then change Px by amounts that give the same new X-intercept. How do the two budget lines differ?', hint: 'The income change moves the line parallel (both intercepts move); the Px change swivels it (only the X-intercept moves). Different bundles become affordable.' },
        { prompt: 'Why can the consumer not settle on IC₃?', hint: 'IC₃ lies wholly outside the budget line — no bundle on it is affordable at the given income and prices.' }
    ],
    challenge: {
        prompt: 'Make the price ratio Px/Py exactly 2 — so the consumer must give up 2 units of Y for each extra unit of X.',
        check: (s, m) => Math.abs(m.ratio - 2) < 0.06
    }
});

SIMS.push({
    id: 'gl-cost-curves',
    module: 'micro',
    title: 'Cost Curves: AC, AVC, AFC & MC',
    desc: 'The U-shaped family drawn properly — with MC cutting AC and AVC at their minimum points. Drag the output level.',
    class: 'XI', part: 'B', unit: 6, unitTitle: 'Producer Behaviour and Supply', topicLabel: 'Short-run Costs',
    syllabusIds: ['XI-B-U6-COST'],
    mode: 'graphlab',
    concept: '<p>The short-run cost family, and the two properties the exam always asks to prove on a diagram:</p><p><b>1.</b> <b>MC cuts both AC and AVC at their minimum points</b>, and always from below. When MC &lt; AC, AC is falling; when MC &gt; AC, AC is rising; they can only be equal where AC is at its lowest.</p><p><b>2.</b> <b>AFC falls continuously</b> and never touches the X-axis (it is a rectangular hyperbola: TFC ÷ Q). So the vertical gap between AC and AVC keeps narrowing but never closes — AC and AVC <i>approach</i> each other without meeting.</p>',
    formulas: [
        'TC = TFC + TVC',
        'AFC = TFC / Q      (falls continuously, never zero)',
        'AVC = TVC / Q      (U-shaped)',
        'AC  = TC / Q = AFC + AVC',
        'MC  = ΔTC / ΔQ = ΔTVC / ΔQ',
        'MC cuts AVC and AC at their MINIMUM points, from below'
    ],
    graphLab: {
        groupLabels: { price: 'Where you are reading the curves', other: 'Cost conditions that move the curves' },
        x: { label: 'Output (units) →', min: 0, max: 20 },
        y: { label: 'Cost (₹) →', min: 0, max: 120 },
        vars: [
            { id: 'q', label: 'Output level shown', min: 1, max: 19, step: 0.5, value: 8, unit: 'units', group: 'price', hint: 'Drag along the curves to read every cost at this output' },
            { id: 'tfc', label: 'Total Fixed Cost (TFC)', min: 20, max: 160, step: 5, value: 80, unit: '₹' },
            { id: 'eff', label: 'Production efficiency', min: -6, max: 6, step: 1, value: 0, signed: true, hint: 'Shifts the variable-cost curves up or down' }
        ],
        scenarios: [
            { label: 'Higher fixed cost', note: 'AC and AFC rise, AVC & MC unchanged', set: { tfc: 140 } },
            { label: 'Lower fixed cost', note: 'AC falls, AVC & MC unchanged', set: { tfc: 30 } },
            { label: 'Read cost at min AC', note: 'MC = AC here', set: { q: 12.5 } },
            { label: 'Efficiency improves', note: 'AVC and MC both fall', set: { eff: 4 } }
        ],
        stories: [{
            id: 'bakery',
            title: { en: 'How many cakes should the bakery bake?', hi: 'बेकरी कितने केक बनाए?' },
            intro: {
                en: 'A small bakery pays fixed rent and buys flour, gas and labour for every cake. As it bakes more, watch the average cost — and catch the two traps examiners love.',
                hi: 'एक छोटी बेकरी तय किराया देती है और हर केक के लिए आटा, गैस और मज़दूरी ख़रीदती है। जैसे-जैसे वह ज़्यादा केक बनाती है, औसत लागत देखिए — और उन दो फंदों को पकड़िए जो परीक्षक को बहुत पसंद हैं।'
            },
            outro: {
                en: 'MC below AC pulls AC down; MC above AC pulls it up — so MC cuts AC at AC\'s minimum, from below. Whether MC itself is rising does not decide it. Fixed cost moves AC and AFC only; MC and AVC never notice it.',
                hi: 'AC से नीचे MC, AC को नीचे खींचता है; AC से ऊपर MC उसे ऊपर खींचता है — इसलिए MC, AC को उसके न्यूनतम बिंदु पर नीचे से काटता है। MC ख़ुद बढ़ रहा है या नहीं, यह तय नहीं करता। स्थिर लागत केवल AC और AFC को हिलाती है; MC और AVC पर उसका कोई असर नहीं।'
            },
            steps: [
                {
                    set: { q: 4 },
                    say: (c, hi) => hi
                        ? `${fmt(c.v.q, 0)} केक पर: एक और केक की लागत (MC) ₹${fmt(c.m.metrics.mc, 1)} है, जबकि औसत लागत (AC) ₹${fmt(c.m.metrics.ac, 1)} — ज़्यादातर किराया, जो बहुत कम केकों में बँटा है। MC < AC, इसलिए AC गिर रहा है।`
                        : `At ${fmt(c.v.q, 0)} cakes: one more cake costs (MC) ₹${fmt(c.m.metrics.mc, 1)}, while the average cost (AC) is ₹${fmt(c.m.metrics.ac, 1)} — mostly rent spread over very few cakes. MC < AC, so AC is falling.`,
                    check: c => c.m.metrics.mc < c.m.metrics.ac
                },
                {
                    set: { q: 8 },
                    ask: {
                        q: { en: 'The bakery goes to 8 cakes. MC has started RISING. Does AC start rising too?', hi: 'बेकरी 8 केक तक जाती है। MC बढ़ना शुरू हो गया है। क्या AC भी बढ़ने लगेगा?' },
                        options: [
                            { en: 'Yes — when MC rises, AC rises', hi: 'हाँ — जब MC बढ़ता है, AC भी बढ़ता है' },
                            { en: 'No — AC keeps falling as long as MC is below AC', hi: 'नहीं — जब तक MC, AC से नीचे है, AC गिरता रहता है' },
                            { en: 'AC stays exactly the same', hi: 'AC बिल्कुल वही रहता है' }
                        ],
                        correct: c => c.m.metrics.ac < c.prev.m.metrics.ac ? 1 : (c.m.metrics.ac > c.prev.m.metrics.ac ? 0 : 2)
                    },
                    say: (c, hi) => hi
                        ? `फंदा नंबर 1: MC ₹${fmt(c.prev.m.metrics.mc, 1)} से ₹${fmt(c.m.metrics.mc, 1)} तक <b>बढ़ा</b>, फिर भी AC ₹${fmt(c.prev.m.metrics.ac, 1)} से ₹${fmt(c.m.metrics.ac, 1)} तक <b>गिरा</b>। क्यों? हर नया केक (₹${fmt(c.m.metrics.mc, 1)}) अब भी औसत (₹${fmt(c.m.metrics.ac, 1)}) से सस्ता है — इसलिए औसत नीचे खिंचता है। MC की <i>दिशा</i> नहीं, AC से उसकी <i>तुलना</i> मायने रखती है।`
                        : `Trap #1: MC <b>rose</b> from ₹${fmt(c.prev.m.metrics.mc, 1)} to ₹${fmt(c.m.metrics.mc, 1)}, yet AC <b>fell</b> from ₹${fmt(c.prev.m.metrics.ac, 1)} to ₹${fmt(c.m.metrics.ac, 1)}. Why? Each new cake (₹${fmt(c.m.metrics.mc, 1)}) still costs less than the average (₹${fmt(c.m.metrics.ac, 1)}), so it drags the average down. What matters is MC <i>compared with</i> AC, not MC's direction.`,
                    check: c => c.m.metrics.mc > c.prev.m.metrics.mc && c.m.metrics.ac < c.prev.m.metrics.ac && c.m.metrics.mc < c.m.metrics.ac
                },
                {
                    set: { q: 12.5 },
                    ask: {
                        q: { en: 'Keep baking. Where will MC finally meet AC?', hi: 'बनाते रहिए। MC आख़िर AC से कहाँ मिलेगा?' },
                        options: [
                            { en: 'At the lowest point of AC', hi: 'AC के सबसे निचले बिंदु पर' },
                            { en: 'At the highest point of AC', hi: 'AC के सबसे ऊँचे बिंदु पर' },
                            { en: 'They never meet', hi: 'वे कभी नहीं मिलते' }
                        ],
                        correct: c => c.m.metrics.atMinAC ? 0 : 2
                    },
                    say: (c, hi) => hi
                        ? `${fmt(c.v.q, 1)} केक पर MC (₹${fmt(c.m.metrics.mc, 2)}) और AC (₹${fmt(c.m.metrics.ac, 2)}) लगभग बराबर हैं — और यही AC का <b>सबसे निचला बिंदु</b> है। यह संयोग नहीं: इससे पहले MC, AC को नीचे खींच रहा था; इसके बाद ऊपर खींचेगा। MC, AC को उसके न्यूनतम पर <b>नीचे से</b> काटता है।`
                        : `At ${fmt(c.v.q, 1)} cakes, MC (₹${fmt(c.m.metrics.mc, 2)}) and AC (₹${fmt(c.m.metrics.ac, 2)}) are nearly equal — and this is the <b>lowest point of AC</b>. Not a coincidence: before this, MC was pulling AC down; after it, MC pulls it up. MC cuts AC at its minimum, <b>from below</b>.`,
                    check: c => c.m.metrics.atMinAC && c.m.metrics.ac < c.prev.m.metrics.ac && Math.abs(c.m.metrics.mc - c.m.metrics.ac) < 0.5
                },
                {
                    set: { q: 15 },
                    ask: {
                        q: { en: 'Now 15 cakes: the oven is overcrowded and MC is well above AC. What happens to AC?', hi: 'अब 15 केक: ओवन भर गया है और MC, AC से काफ़ी ऊपर है। AC का क्या होगा?' },
                        options: [
                            { en: 'It rises — MC above AC pulls it up', hi: 'यह बढ़ेगा — AC से ऊपर MC उसे ऊपर खींचता है' },
                            { en: 'It keeps falling', hi: 'यह गिरता रहेगा' },
                            { en: 'It stays at its minimum', hi: 'यह न्यूनतम पर ही रहेगा' }
                        ],
                        correct: c => c.m.metrics.ac > c.prev.m.metrics.ac ? 0 : (c.m.metrics.ac < c.prev.m.metrics.ac ? 1 : 2)
                    },
                    say: (c, hi) => hi
                        ? `हर नया केक (MC ₹${fmt(c.m.metrics.mc, 1)}) अब औसत (₹${fmt(c.m.metrics.ac, 1)}) से महँगा है, इसलिए AC ₹${fmt(c.prev.m.metrics.ac, 2)} से बढ़कर ₹${fmt(c.m.metrics.ac, 2)} हो गया। यही AC का U-आकार है।`
                        : `Each new cake (MC ₹${fmt(c.m.metrics.mc, 1)}) now costs more than the average (₹${fmt(c.m.metrics.ac, 1)}), so AC rises from ₹${fmt(c.prev.m.metrics.ac, 2)} to ₹${fmt(c.m.metrics.ac, 2)}. That is the U-shape of AC.`,
                    check: c => c.m.metrics.mc > c.m.metrics.ac && c.m.metrics.ac > c.prev.m.metrics.ac
                },
                {
                    set: { q: 15, tfc: 140 },
                    ask: {
                        q: { en: 'The landlord raises the rent (TFC ₹80 → ₹140). Output stays at 15. Which curves move?', hi: 'मकान-मालिक किराया बढ़ा देता है (TFC ₹80 → ₹140)। उत्पादन 15 ही रहता है। कौन-से curve हिलेंगे?' },
                        options: [
                            { en: 'Only AC and AFC — MC and AVC do not move', hi: 'केवल AC और AFC — MC और AVC नहीं हिलते' },
                            { en: 'All four curves move up', hi: 'चारों curve ऊपर जाते हैं' },
                            { en: 'Only MC and AVC', hi: 'केवल MC और AVC' }
                        ],
                        correct: c => {
                            const mcSame = c.m.metrics.mc === c.prev.m.metrics.mc, avcSame = c.m.metrics.avc === c.prev.m.metrics.avc;
                            const acMoved = c.m.metrics.ac !== c.prev.m.metrics.ac;
                            return mcSame && avcSame && acMoved ? 0 : (!mcSame && !avcSame && acMoved ? 1 : 2);
                        }
                    },
                    say: (c, hi) => hi
                        ? `फंदा नंबर 2: MC (₹${fmt(c.m.metrics.mc, 1)}) और AVC (₹${fmt(c.m.metrics.avc, 1)}) <b>बिल्कुल नहीं हिले</b> — किराया इस पर निर्भर नहीं कि कितने केक बने। केवल AC (₹${fmt(c.prev.m.metrics.ac, 1)} → ₹${fmt(c.m.metrics.ac, 1)}) और AFC ऊपर गए। और देखिए: सबसे सस्ता उत्पादन ${fmt(c.prev.m.metrics.minACq, 1)} से ${fmt(c.m.metrics.minACq, 1)} केक पर खिसक गया — बड़ा किराया ज़्यादा केकों में बाँटना सस्ता पड़ता है।`
                        : `Trap #2: MC (₹${fmt(c.m.metrics.mc, 1)}) and AVC (₹${fmt(c.m.metrics.avc, 1)}) <b>did not move at all</b> — rent does not depend on how many cakes are baked. Only AC (₹${fmt(c.prev.m.metrics.ac, 1)} → ₹${fmt(c.m.metrics.ac, 1)}) and AFC went up. And notice: the lowest-cost output moved from ${fmt(c.prev.m.metrics.minACq, 1)} to ${fmt(c.m.metrics.minACq, 1)} cakes — a bigger rent is cheaper when spread over more cakes.`,
                    check: c => c.m.metrics.mc === c.prev.m.metrics.mc && c.m.metrics.avc === c.prev.m.metrics.avc && c.m.metrics.ac > c.prev.m.metrics.ac && c.m.metrics.minACq > c.prev.m.metrics.minACq
                }
            ]
        }],
        model(v) {
            // A cubic TVC gives the textbook's U-shaped AVC and the rising
            // MC that cuts it at its minimum — the whole point of the figure.
            const k = 1 - v.eff * 0.05;
            const tvc = q => k * (2.2 * q - 0.22 * q * q + 0.016 * q * q * q) * 3;
            const mc = q => k * (2.2 - 0.44 * q + 0.048 * q * q) * 3;
            const avc = q => tvc(q) / q;
            const afc = q => v.tfc / q;
            const ac = q => avc(q) + afc(q);

            const sample = f => {
                const out = [];
                for (let q = 0.8; q <= 19.6; q += 0.2) {
                    const y = f(q);
                    if (isFinite(y) && y <= 120 && y >= 0) out.push([q, y]);
                }
                return out;
            };
            // Numeric minima — kept honest rather than hard-coded, so the
            // "MC cuts at the minimum" claim stays true when the sliders move.
            const argmin = f => {
                let best = 1, bv = Infinity;
                for (let q = 1; q <= 19.5; q += 0.05) { const y = f(q); if (y < bv) { bv = y; best = q; } }
                return { q: best, v: bv };
            };
            const minAVC = argmin(avc), minAC = argmin(ac);
            // The output slider moves in 0.5 steps, so MC and AC are almost
            // never within a few paise of each other at a reachable Q — the
            // old "|MC − AC| < 0.15" test showed the minimum-point verdict in
            // 110 of ~14,000 states and never at the defaults. Name the
            // minimum at the reachable output where AC is LOWEST — i.e. AC
            // is no higher than at either neighbouring slider stop (the
            // output var's step is 0.5).
            const atMinAC = ac(v.q) <= ac(v.q - 0.5) && ac(v.q) < ac(v.q + 0.5);

            return {
                curves: [
                    { id: 'afc', label: 'AFC', color: '#94a3b8', width: 2.4, pts: sample(afc) },
                    { id: 'avc', label: 'AVC', color: '#16a34a', width: 2.8, pts: sample(avc) },
                    { id: 'ac', label: 'AC', color: '#2563eb', width: 3, pts: sample(ac) },
                    { id: 'mc', label: 'MC', color: '#dc2626', width: 3, pts: sample(mc) }
                ],
                points: [
                    { id: 'onAC', x: v.q, y: ac(v.q), label: 'AC', color: '#2563eb', xTick: `Q=${fmt(v.q, 1)}`, yTick: `₹${fmt(ac(v.q), 0)}` },
                    { id: 'onMC', x: v.q, y: mc(v.q), label: 'MC', color: '#dc2626', drop: false },
                    { id: 'onAVC', x: v.q, y: avc(v.q), label: 'AVC', color: '#16a34a', drop: false },
                    { id: 'minAVC', x: minAVC.q, y: minAVC.v, label: 'min AVC', color: '#065f46', drop: false, labelDy: 16 },
                    { id: 'minAC', x: minAC.q, y: minAC.v, label: 'min AC', color: '#1d4ed8', drop: false, labelDy: 18 }
                ],
                arrows: [],
                handles: [{ id: 'h-q', x: v.q, y: ac(v.q), bind: 'q', axis: 'x', color: '#7c3aed', hint: 'Drag left/right along the output axis' }],
                readings: [
                    { label: 'Output (Q)', value: `${fmt(v.q, 1)} units` },
                    { label: 'TFC', value: `₹${fmt(v.tfc, 0)}` },
                    { label: 'TVC', value: `₹${fmt(tvc(v.q), 1)}` },
                    { label: 'TC = TFC + TVC', value: `₹${fmt(v.tfc + tvc(v.q), 1)}` },
                    { label: 'AFC = TFC/Q', value: `₹${fmt(afc(v.q), 2)}` },
                    { label: 'AVC = TVC/Q', value: `₹${fmt(avc(v.q), 2)}` },
                    { label: 'AC = AFC + AVC', value: `₹${fmt(ac(v.q), 2)}` },
                    { label: 'MC', value: `₹${fmt(mc(v.q), 2)}` },
                    { label: 'AC − AVC (= AFC)', value: `₹${fmt(ac(v.q) - avc(v.q), 2)}` }
                ],
                verdict: {
                    kind: mc(v.q) < ac(v.q) ? 'movement' : 'shift',
                    title: atMinAC
                        ? 'MC = AC → you are at the <b>minimum point of AC</b>'
                        : mc(v.q) < ac(v.q)
                            ? 'MC &lt; AC → <b>AC is still falling</b>'
                            : 'MC &gt; AC → <b>AC is now rising</b>',
                    detail: `At Q = ${fmt(v.q, 1)}: MC = ₹${fmt(mc(v.q), 2)} and AC = ₹${fmt(ac(v.q), 2)}. ${atMinAC ? `MC crosses AC at Q ≈ ${fmt(minAC.q, 2)} — the nearest output on this slider — and that crossing is exactly where AC is lowest: below it MC pulls AC down, above it MC pulls AC up.` : mc(v.q) < ac(v.q) ? 'Each extra unit costs less than the running average, so the average is pulled <b>down</b>.' : 'Each extra unit costs more than the running average, so the average is pulled <b>up</b>.'} AC reaches its minimum at Q ≈ ${fmt(minAC.q, 1)} and AVC at Q ≈ ${fmt(minAVC.q, 1)} — AVC bottoms out <b>before</b> AC, because falling AFC keeps dragging AC down for a while longer. Raise TFC and watch AC and AFC lift while <b>AVC and MC do not move at all</b>.`,
                    hi: {
                        title: atMinAC
                            ? 'MC = AC → आप <b>AC के न्यूनतम बिंदु</b> पर हैं'
                            : mc(v.q) < ac(v.q)
                                ? 'MC &lt; AC → <b>AC अभी घट रहा है</b>'
                                : 'MC &gt; AC → <b>AC अब बढ़ रहा है</b>',
                        detail: `Q = ${fmt(v.q, 1)} पर: MC = ₹${fmt(mc(v.q), 2)} और AC = ₹${fmt(ac(v.q), 2)}। ${atMinAC ? `MC, AC को Q ≈ ${fmt(minAC.q, 2)} पर काटता है — इस स्लाइडर पर निकटतम उत्पादन यही है — और यही कटान वह बिंदु है जहाँ AC न्यूनतम है: इससे पहले MC, AC को नीचे खींचता है, इसके बाद ऊपर।` : mc(v.q) < ac(v.q) ? 'हर अतिरिक्त इकाई की लागत अब तक के औसत से कम है, इसलिए औसत <b>नीचे</b> खिंचता है।' : 'हर अतिरिक्त इकाई की लागत अब तक के औसत से अधिक है, इसलिए औसत <b>ऊपर</b> खिंचता है।'} AC न्यूनतम Q ≈ ${fmt(minAC.q, 1)} पर और AVC न्यूनतम Q ≈ ${fmt(minAVC.q, 1)} पर होता है — AVC, AC से <b>पहले</b> न्यूनतम पर पहुँचता है, क्योंकि घटता AFC, AC को कुछ देर और नीचे खींचता रहता है। TFC बढ़ाएँ और देखें कि AC और AFC ऊपर उठते हैं, जबकि <b>AVC और MC बिल्कुल नहीं हिलते</b>।`
                    }
                },
                metrics: { q: v.q, ac: ac(v.q), mc: mc(v.q), avc: avc(v.q), minACq: minAC.q, atMinAC }
            };
        }
    },
    practice: [
        { prompt: 'Raise TFC. Which curves move and which do not — and why?', hint: 'AFC and AC shift up; AVC and MC do not move at all, because fixed cost is not part of variable or marginal cost.' },
        { prompt: 'Why does AVC reach its minimum at a LOWER output than AC?', hint: 'AC = AVC + AFC. Past AVC\'s minimum, AVC is rising but AFC is still falling; AC keeps falling until the rise in AVC finally outweighs the fall in AFC.' },
        { prompt: 'Can AC and AVC ever meet?', hint: 'No. Their gap is AFC = TFC/Q, which shrinks toward zero but never reaches it — so the curves get closer forever without touching.' }
    ],
    challenge: {
        prompt: 'Set the output to the point where MC cuts AC (their intersection = minimum AC).',
        check: (s, m) => Math.abs(m.mc - m.ac) < 0.6
    }
});

SIMS.push({
    id: 'gl-revenue-producer-eq',
    module: 'micro',
    title: 'Revenue & Producer Equilibrium (MR = MC)',
    desc: 'TR / MR / AR under perfect competition vs monopoly, plus the MR = MC output with the profit rectangle drawn in.',
    class: 'XI', part: 'B', unit: 6, unitTitle: 'Producer Behaviour and Supply', topicLabel: 'Revenue & Producer Equilibrium',
    syllabusIds: ['XI-B-U6-REVENUE', 'XI-B-U6-PRODUCER-EQ'],
    mode: 'graphlab',
    concept: '<p><b>Perfect competition:</b> the firm is a price-taker, so it sells any quantity at the same price. Then <b>AR = MR = price</b>, and both are a horizontal straight line; TR rises as a straight line through the origin.</p><p><b>Monopoly / imperfect competition:</b> to sell more the firm must cut price, so AR slopes downward and <b>MR falls twice as fast</b>, lying below AR. TR rises, peaks where MR = 0, then falls.</p><p><b>Producer\'s equilibrium</b> is where <b>MR = MC and MC cuts MR from below</b> — beyond that output MC is greater than MR. Both conditions are needed: MR = MC can also occur where MC cuts MR from <i>above</i>, which is a profit-<i>minimising</i> point. Under perfect competition (flat MR) "cuts from below" simply means MC is rising; under monopoly MR slopes down, so MC can cut it from below even while MC is still falling.</p>',
    formulas: [
        'TR = P × Q      AR = TR / Q = P      MR = ΔTR / ΔQ',
        'Perfect competition: AR = MR = P (horizontal line)',
        'Monopoly: AR slopes down; MR falls twice as steeply, MR < AR',
        'TR is maximum where MR = 0',
        "Producer's equilibrium: MR = MC, and MC cuts MR from below (MC > MR beyond it)",
        'Profit = (AR − AC) × Q'
    ],
    graphLab: {
        groupLabels: { price: 'Output & price you choose', other: 'Market form and cost conditions' },
        x: { label: 'Output (units) →', min: 0, max: 20 },
        y: { label: 'Revenue / Cost per unit (₹) →', min: 0, max: 60 },
        vars: [
            { id: 'q', label: 'Output chosen by the firm', min: 1, max: 19, step: 0.5, value: 8, unit: 'units', group: 'price', hint: 'Drag toward where MC cuts MR' },
            { id: 'price', label: 'Price / AR intercept', min: 15, max: 55, step: 1, value: 34, unit: '₹', group: 'price' },
            { id: 'market', label: 'Monopoly power (AR steepness)', min: 0, max: 10, step: 1, value: 0, hint: '0 = perfect competition (flat AR); higher = steeper AR, MR falls below it' },
            { id: 'cost', label: 'Cost level', min: -6, max: 8, step: 1, value: 0, signed: true }
        ],
        scenarios: [
            { label: 'Perfect competition', note: 'AR = MR = price, horizontal', set: { market: 0 } },
            { label: 'Monopoly', note: 'AR slopes down, MR below AR', set: { market: 7 } },
            { label: 'Jump to MR = MC', note: "Producer's equilibrium", set: { q: 11 } },
            { label: 'Costs rise', note: 'Equilibrium output falls', set: { cost: 6 } }
        ],
        stories: [{
            id: 'workshop',
            title: { en: "Meera's workshop — how much to produce?", hi: 'मीरा की कार्यशाला — कितना उत्पादन करें?' },
            intro: {
                en: 'Meera stitches kurtas in a competitive market: she can sell any number at the market price of ₹34. Help her find the output that makes the most profit — one unit at a time.',
                hi: 'मीरा प्रतियोगी बाज़ार में कुर्ते सिलती है: वह बाज़ार कीमत ₹34 पर कितने भी बेच सकती है। एक-एक इकाई सोचकर उसे सबसे ज़्यादा लाभ वाला उत्पादन ढूँढ़ने में मदद कीजिए।'
            },
            outro: {
                en: "Producer's equilibrium: MR = MC, and MC cuts MR from below (beyond it MC > MR). Under perfect competition MR = AR = price; under monopoly MR falls below AR, and the price is read off AR — above MR.",
                hi: 'उत्पादक संतुलन: MR = MC, और MC, MR को नीचे से काटे (उसके बाद MC > MR)। पूर्ण प्रतियोगिता में MR = AR = कीमत; एकाधिकार में MR, AR से नीचे चला जाता है, और कीमत AR से पढ़ी जाती है — MR से ऊपर।'
            },
            steps: [
                {
                    set: { q: 4 },
                    say: (c, hi) => hi
                        ? `${fmt(c.v.q, 0)} कुर्तों पर: एक और कुर्ता ₹${fmt(c.m.metrics.mr, 0)} लाता है (MR) पर केवल ₹${fmt(c.m.metrics.mc, 1)} लागत (MC) लगाता है। MR > MC — हर अतिरिक्त कुर्ता लाभ <b>बढ़ाता</b> है, इसलिए उत्पादन बढ़ाना चाहिए।`
                        : `At ${fmt(c.v.q, 0)} kurtas: one more kurta brings in ₹${fmt(c.m.metrics.mr, 0)} (MR) but costs only ₹${fmt(c.m.metrics.mc, 1)} (MC). MR > MC — every extra kurta <b>adds</b> to profit, so output should expand.`,
                    check: c => c.m.metrics.isPC && c.m.metrics.mr > c.m.metrics.mc
                },
                {
                    set: { q: 19 },
                    ask: {
                        q: { en: 'Excited, Meera jumps to 19 kurtas. Is that 19th kurta worth making?', hi: 'उत्साह में मीरा 19 कुर्तों पर पहुँच जाती है। क्या वह 19वाँ कुर्ता बनाना ठीक है?' },
                        options: c => [
                            { en: `No — it costs ₹${fmt(c.m.metrics.mc, 0)} but earns only ₹${fmt(c.m.metrics.mr, 0)}`, hi: `नहीं — इसकी लागत ₹${fmt(c.m.metrics.mc, 0)} है पर कमाई केवल ₹${fmt(c.m.metrics.mr, 0)}` },
                            { en: 'Yes — more output always means more profit', hi: 'हाँ — ज़्यादा उत्पादन का मतलब हमेशा ज़्यादा लाभ' },
                            { en: 'Yes — her total profit is still positive', hi: 'हाँ — उसका कुल लाभ अब भी धनात्मक है' }
                        ],
                        correct: c => c.m.metrics.mr < c.m.metrics.mc ? 0 : 1
                    },
                    say: (c, hi) => hi
                        ? `अब MC (₹${fmt(c.m.metrics.mc, 1)}) > MR (₹${fmt(c.m.metrics.mr, 0)}): आख़िरी कुर्ते <b>लाभ घटा रहे</b> हैं। कुल लाभ अब भी धनात्मक है (₹${fmt(c.m.metrics.profit, 0)}), पर यह एक फंदा है — सवाल यह नहीं कि लाभ है या नहीं, सवाल यह है कि <i>अगली इकाई</i> उसे बढ़ाती है या घटाती है।`
                        : `Now MC (₹${fmt(c.m.metrics.mc, 1)}) > MR (₹${fmt(c.m.metrics.mr, 0)}): the last kurtas are <b>eating into profit</b>. Total profit is still positive (₹${fmt(c.m.metrics.profit, 0)}), but that is the trap — the question is not whether there is profit, but whether the <i>next unit</i> adds to it or takes from it.`,
                    check: c => c.m.metrics.mr < c.m.metrics.mc && c.m.metrics.profit > 0 && c.m.metrics.eqQ < c.v.q
                },
                {
                    set: { q: 17 },
                    ask: {
                        q: { en: 'So where should she settle?', hi: 'तो उसे कहाँ रुकना चाहिए?' },
                        options: [
                            { en: 'Where MR = MC, with MC cutting MR from below', hi: 'जहाँ MR = MC हो, और MC, MR को नीचे से काटे' },
                            { en: 'Where AC is lowest', hi: 'जहाँ AC सबसे कम हो' },
                            { en: 'At the largest output she can manage', hi: 'जितना अधिकतम उत्पादन वह कर सके' }
                        ],
                        correct: c => c.m.verdict.kind === 'movement' ? 0 : 2
                    },
                    say: (c, hi) => hi
                        ? `${fmt(c.v.q, 0)} कुर्तों पर MR = MC (₹${fmt(c.m.metrics.mr, 0)} ≈ ₹${fmt(c.m.metrics.mc, 1)}), और इसके आगे MC, MR से ऊपर चला जाता है। लाभ यहीं सबसे अधिक है: ₹${fmt(c.m.metrics.profit, 0)} — 4 कुर्तों (₹${fmt(c.first.m.metrics.profit, 0)}) और 19 कुर्तों (₹${fmt(c.prev.m.metrics.profit, 0)}) दोनों से ज़्यादा। यही <b>उत्पादक संतुलन</b> है।`
                        : `At ${fmt(c.v.q, 0)} kurtas MR = MC (₹${fmt(c.m.metrics.mr, 0)} ≈ ₹${fmt(c.m.metrics.mc, 1)}), and beyond it MC rises above MR. Profit peaks right here: ₹${fmt(c.m.metrics.profit, 0)} — more than at 4 kurtas (₹${fmt(c.first.m.metrics.profit, 0)}) or at 19 (₹${fmt(c.prev.m.metrics.profit, 0)}). This is <b>producer's equilibrium</b>.`,
                    check: c => c.m.verdict.kind === 'movement' && c.m.metrics.profit > c.prev.m.metrics.profit && c.m.metrics.profit > c.first.m.metrics.profit
                },
                {
                    set: { q: 11, market: 7, price: 50 },
                    ask: {
                        q: { en: 'Years later her designs are unique — she has monopoly power, so to sell more she must lower her price. At her new equilibrium, which is true?', hi: 'बरसों बाद उसके डिज़ाइन अनोखे हैं — उसके पास एकाधिकार शक्ति है, इसलिए ज़्यादा बेचने के लिए उसे कीमत घटानी पड़ती है। उसके नए संतुलन पर क्या सही है?' },
                        options: [
                            { en: 'Price (AR) is above MR = MC', hi: 'कीमत (AR), MR = MC से ऊपर है' },
                            { en: 'Price = MR = MC, just like before', hi: 'कीमत = MR = MC, पहले जैसा' },
                            { en: 'Price is below MC', hi: 'कीमत, MC से नीचे है' }
                        ],
                        correct: c => (c.m.metrics.ar > c.m.metrics.mr + 1 ? 0 : (Math.abs(c.m.metrics.ar - c.m.metrics.mr) <= 1 ? 1 : 2))
                    },
                    say: (c, hi) => hi
                        ? `अब AR नीचे ढलता है और MR उससे भी तेज़ी से गिरकर AR के <b>नीचे</b> रहता है। संतुलन फिर MR = MC पर है (${fmt(c.v.q, 0)} इकाई, MR ₹${fmt(c.m.metrics.mr, 1)} ≈ MC ₹${fmt(c.m.metrics.mc, 1)}), पर कीमत AR से पढ़ी जाती है: ₹${fmt(c.m.metrics.ar, 1)} — MR से काफ़ी ऊपर। प्रतियोगिता में कीमत = MR थी; एकाधिकार में कीमत > MR।`
                        : `Now AR slopes down, and MR falls even faster, lying <b>below</b> AR. Equilibrium is still at MR = MC (${fmt(c.v.q, 0)} units, MR ₹${fmt(c.m.metrics.mr, 1)} ≈ MC ₹${fmt(c.m.metrics.mc, 1)}), but the price is read off AR: ₹${fmt(c.m.metrics.ar, 1)} — well above MR. Under competition price = MR; under monopoly price > MR.`,
                    check: c => !c.m.metrics.isPC && c.m.verdict.kind === 'movement' && c.m.metrics.ar > c.m.metrics.mr + 1 && Math.abs(c.m.metrics.mr - c.m.metrics.mc) < 1.5
                }
            ]
        }],
        model(v) {
            const slope = v.market * 0.22;
            const ar = q => v.price - slope * q;
            const mr = q => v.price - 2 * slope * q;
            const tr = q => ar(q) * q;
            const k = 1 + v.cost * 0.06;
            const mc = q => k * (26 - 3.6 * q + 0.24 * q * q);
            const avc = q => k * (26 - 1.8 * q + 0.08 * q * q);
            const ac = q => avc(q) + 60 / q;

            const sample = (f, lo, hi) => {
                const out = [];
                for (let q = lo; q <= hi; q += 0.2) { const y = f(q); if (isFinite(y) && y >= 0 && y <= 60) out.push([q, y]); }
                return out;
            };
            // Solve MR = MC on the rising branch of MC — "MC rising" is half
            // the equilibrium condition, so picking the falling-branch root
            // would be teaching the wrong answer.
            // Equilibrium = where MC cuts MR FROM BELOW: MR − MC turns from
            // positive to non-positive (beyond it, MC > MR). Under perfect
            // competition (flat MR) that is the same as "MC rising", but a
            // monopolist's MR slopes down, so MC can cut it from below while
            // MC itself is still falling. Testing "MC rising" literally put
            // the monopoly equilibrium at MC's minimum instead — e.g. Q 7.55
            // vs the true profit maximum 4.35 at monopoly power 10.
            let eqQ = null;
            for (let q = 1.05; q <= 19; q += 0.05) {
                if (mr(q - 0.05) - mc(q - 0.05) > 0 && mr(q) - mc(q) <= 0) { eqQ = q; break; }
            }

            const isPC = v.market === 0;
            const curves = [
                { id: 'ar', label: isPC ? 'AR = MR = P' : 'AR', color: '#2563eb', width: 3, pts: sample(ar, 0.2, 19.8) },
                { id: 'mc', label: 'MC', color: '#dc2626', width: 3, pts: sample(mc, 0.8, 19.8) },
                { id: 'ac', label: 'AC', color: '#7c3aed', width: 2.4, dash: '6 4', pts: sample(ac, 1.6, 19.8) }
            ];
            if (!isPC) curves.push({ id: 'mr', label: 'MR', color: '#0891b2', width: 2.8, dash: '8 4', pts: sample(mr, 0.2, 19.8) });

            const points = [{ id: 'q', x: v.q, y: ar(v.q), label: 'chosen Q', color: '#7c3aed', xTick: `Q=${fmt(v.q, 1)}`, yTick: `AR ₹${fmt(ar(v.q), 0)}` }];
            if (eqQ) points.push({ id: 'eq', x: eqQ, y: mc(eqQ), label: 'E: MR = MC', color: '#dc2626', drop: false, labelDy: -14 });

            const profit = (ar(v.q) - ac(v.q)) * v.q;
            const atEq = eqQ && Math.abs(v.q - eqQ) < 0.6;

            return {
                curves, points,
                arrows: eqQ && !atEq ? [{ from: [v.q, ar(v.q)], to: [eqQ, ar(eqQ)], color: '#16a34a', bend: -20, label: v.q < eqQ ? 'Expand output → profit rises' : 'Cut output → profit rises' }] : [],
                handles: [
                    { id: 'h-q', x: v.q, y: ar(v.q), bind: 'q', axis: 'x', color: '#7c3aed', hint: 'Drag output left/right' },
                    { id: 'h-p', x: 1.4, y: ar(1.4), bind: 'price', axis: 'y', color: '#2563eb', hint: 'Drag the AR line up/down (price)' }
                ],
                readings: [
                    { label: 'Market form', value: isPC ? 'Perfect competition (price-taker)' : 'Monopoly / imperfect' },
                    { label: 'AR (price)', value: `₹${fmt(ar(v.q), 2)}` },
                    { label: 'MR', value: `₹${fmt(mr(v.q), 2)}` },
                    { label: 'TR = P × Q', value: `₹${fmt(tr(v.q), 1)}` },
                    { label: 'MC', value: `₹${fmt(mc(v.q), 2)}` },
                    { label: 'AC', value: `₹${fmt(ac(v.q), 2)}` },
                    { label: 'Profit = (AR − AC) × Q', value: `₹${fmt(profit, 1)}` },
                    { label: 'Equilibrium output (MR = MC)', value: eqQ ? `${fmt(eqQ, 1)} units` : 'none in range' }
                ],
                verdict: {
                    kind: atEq ? 'movement' : 'shift',
                    title: atEq
                        ? "✔ <b>Producer's equilibrium</b> — MR = MC, and MC cuts MR from below."
                        : (mr(v.q) > mc(v.q) ? 'MR &gt; MC → the firm should <b>expand</b> output' : 'MR &lt; MC → the firm should <b>cut</b> output'),
                    detail: `${isPC ? 'Under perfect competition the firm is a price-taker: <b>AR = MR = price</b>, so the revenue line is horizontal and the firm produces where MC rises to meet it.' : 'Under monopoly the firm must cut price to sell more, so AR slopes down and <b>MR falls twice as fast</b> and lies below AR — which is why the monopolist stops at a smaller output and charges a price <i>above</i> MR.'} ${atEq ? `At Q = ${fmt(v.q, 1)} the last unit adds exactly what it costs, so no further change raises profit. Profit here = ₹${fmt(profit, 1)}.` : `At Q = ${fmt(v.q, 1)}, MR = ₹${fmt(mr(v.q), 2)} against MC = ₹${fmt(mc(v.q), 2)} — the last unit ${mr(v.q) > mc(v.q) ? 'earns more than it costs, so producing it adds to profit' : 'costs more than it earns, so producing it destroys profit'}. Drag toward Q = ${eqQ ? fmt(eqQ, 1) : '—'}.`} Remember: MR = MC alone is <b>not</b> enough — MC must cut MR <b>from below</b>, so that beyond this output MC &gt; MR. Under perfect competition that simply means MC must be rising.`,
                    hi: {
                        title: atEq
                            ? '✔ <b>उत्पादक का संतुलन</b> — MR = MC, और MC, MR को नीचे से काटता है।'
                            : (mr(v.q) > mc(v.q) ? 'MR &gt; MC → फ़र्म को उत्पादन <b>बढ़ाना</b> चाहिए' : 'MR &lt; MC → फ़र्म को उत्पादन <b>घटाना</b> चाहिए'),
                        detail: `${isPC ? 'पूर्ण प्रतियोगिता में फ़र्म कीमत-स्वीकारक है: <b>AR = MR = कीमत</b>, इसलिए आगम रेखा क्षैतिज है और फ़र्म वहाँ उत्पादन करती है जहाँ बढ़ता हुआ MC उससे मिलता है।' : 'एकाधिकार में अधिक बेचने के लिए फ़र्म को कीमत घटानी पड़ती है, इसलिए AR नीचे की ओर ढलता है, और <b>MR उससे दोगुनी तेज़ी से गिरता है</b> तथा AR के नीचे रहता है — इसीलिए एकाधिकारी कम उत्पादन पर रुकता है और MR से <i>ऊँची</i> कीमत लेता है।'} ${atEq ? `Q = ${fmt(v.q, 1)} पर अंतिम इकाई ठीक उतना जोड़ती है जितनी उसकी लागत है, इसलिए कोई और परिवर्तन लाभ नहीं बढ़ाता। यहाँ लाभ = ₹${fmt(profit, 1)}।` : `Q = ${fmt(v.q, 1)} पर MR = ₹${fmt(mr(v.q), 2)} जबकि MC = ₹${fmt(mc(v.q), 2)} — अंतिम इकाई ${mr(v.q) > mc(v.q) ? 'अपनी लागत से अधिक कमाती है, इसलिए उसे बनाने से लाभ बढ़ता है' : 'जितना कमाती है उससे अधिक लागत लेती है, इसलिए उसे बनाने से लाभ घटता है'}। Q = ${eqQ ? fmt(eqQ, 1) : '—'} की ओर खींचें।`} याद रखें: केवल MR = MC पर्याप्त <b>नहीं</b> है — MC को MR को <b>नीचे से</b> काटना चाहिए, ताकि इस उत्पादन के आगे MC &gt; MR रहे। पूर्ण प्रतियोगिता में इसका सीधा अर्थ है कि MC बढ़ रहा हो।`
                    }
                },
                metrics: { q: v.q, eqQ, profit, isPC, mr: mr(v.q), mc: mc(v.q), ar: ar(v.q) }
            };
        }
    },
    practice: [
        { prompt: 'Set monopoly power to 0. What is the relationship between AR and MR, and why?', hint: 'AR = MR = price. A price-taker sells every extra unit at the same unchanged price, so the extra revenue from one more unit IS the price.' },
        { prompt: 'Raise monopoly power. Why does MR fall below AR?', hint: 'To sell one more unit the monopolist must cut the price on ALL units. The gain from the extra unit is partly offset by the loss on the earlier ones, so MR < AR.' },
        { prompt: 'Why is "MR = MC" alone not the full equilibrium condition?', hint: 'MR = MC can also happen where MC is falling — there, producing more still adds to profit. The second condition is that MC must cut MR from below (MC > MR beyond that output) — which under perfect competition means MC must be rising.' }
    ],
    challenge: {
        prompt: "Find the producer's equilibrium output under monopoly (set monopoly power to 7, then drag to where MR = MC).",
        check: (s, m) => !m.isPC && m.eqQ && Math.abs(m.q - m.eqQ) < 0.6
    }
});

SIMS.push({
    id: 'gl-ppc-drag',
    module: 'micro',
    title: 'PPC: Drag the Point, Read the Opportunity Cost',
    desc: 'Drag a production point on, inside, or beyond the curve — and watch the MRT (opportunity cost) change as the curve bends.',
    class: 'XI', part: 'B', unit: 4, unitTitle: 'Introduction to Microeconomics', topicLabel: 'PPC & Opportunity Cost',
    syllabusIds: ['XI-B-U4-PPF-OC', 'XI-B-U4-CENTRAL-PROBLEMS'],
    mode: 'graphlab',
    concept: '<p>The <b>Production Possibility Curve</b> shows every combination of two goods an economy can produce when resources are fully and efficiently used, with given technology.</p><p><b>On the curve</b> ⇒ full and efficient use. <b>Inside</b> ⇒ resources unemployed or used inefficiently. <b>Outside</b> ⇒ unattainable with current resources.</p><p>The PPC is <b>concave to the origin</b> because the <b>Marginal Rate of Transformation (MRT)</b> — the units of Good Y sacrificed for one more unit of Good X — <b>rises</b> as more X is produced: resources are not equally suited to both goods.</p><p>A growth in resources or better technology shifts the whole PPC <b>outward</b>.</p>',
    formulas: [
        'MRT = ΔY / ΔX = opportunity cost of one more unit of X',
        'PPC concave to origin ⇔ MRT rises ⇔ increasing opportunity cost',
        'Point ON the curve  ⇒ full and efficient employment',
        'Point INSIDE         ⇒ unemployment / inefficiency',
        'Point OUTSIDE        ⇒ unattainable',
        'More resources or better technology ⇒ PPC shifts outward'
    ],
    graphLab: {
        groupLabels: { price: 'Your production point (drag it)', other: 'The economy’s productive capacity' },
        x: { label: 'Good X (units) →', min: 0, max: 50 },
        y: { label: 'Good Y (units) →', min: 0, max: 50 },
        vars: [
            { id: 'px', label: 'Your point: Good X', min: 0, max: 48, step: 1, value: 20, group: 'price', hint: 'Drag the point sideways' },
            { id: 'py', label: 'Your point: Good Y', min: 0, max: 48, step: 1, value: 25, group: 'price', hint: 'Drag the point up/down' },
            { id: 'growth', label: 'Resources / Technology', min: -10, max: 15, step: 1, value: 0, signed: true, hint: 'Shifts the whole PPC outward or inward' }
        ],
        scenarios: [
            { label: 'A point ON the curve', note: 'Full employment', set: { px: 24, py: 32 } },
            { label: 'A point INSIDE', note: 'Unemployment / inefficiency', set: { px: 15, py: 15 } },
            { label: 'A point OUTSIDE', note: 'Unattainable', set: { px: 38, py: 38 } },
            { label: 'Economic growth', note: 'PPC shifts outward', set: { growth: 12 } }
        ],
        stories: [{
            id: 'lockdown',
            title: { en: 'A lockdown, a recovery — and growth', hi: 'एक लॉकडाउन, एक रिकवरी — और विकास' },
            intro: {
                en: 'An economy makes wheat (X) and cloth (Y). Live through a lockdown, the recovery, a change of priorities and finally new technology — and see where every point sits on the PPC.',
                hi: 'एक अर्थव्यवस्था गेहूँ (X) और कपड़ा (Y) बनाती है। एक लॉकडाउन, रिकवरी, प्राथमिकताओं में बदलाव और आख़िर में नई तकनीक के दौर से गुज़रिए — और देखिए कि हर बिंदु PPC पर कहाँ बैठता है।'
            },
            outro: {
                en: 'ON the PPC: full, efficient use — more of one good costs some of the other (rising MRT). INSIDE: idle resources — you can have more of both for free. OUTSIDE: unattainable — only growth shifts the PPC out to reach it.',
                hi: 'PPC पर: पूर्ण, कुशल उपयोग — एक वस्तु ज़्यादा लेने पर दूसरी कुछ छोड़नी पड़ती है (बढ़ती MRT)। अंदर: बेकार पड़े संसाधन — दोनों ज़्यादा मुफ़्त में मिल सकते हैं। बाहर: अप्राप्य — केवल विकास PPC को बाहर खिसकाकर वहाँ पहुँचाता है।'
            },
            steps: [
                {
                    set: { px: 24, py: 32 },
                    say: (c, hi) => hi
                        ? `अर्थव्यवस्था ${c.v.px} इकाई गेहूँ और ${c.v.py} इकाई कपड़ा बनाती है — PPC <b>पर</b>। हर कारखाना और हर कामगार काम पर है: पूर्ण और कुशल उपयोग।`
                        : `The economy makes ${c.v.px} units of wheat and ${c.v.py} units of cloth — <b>on</b> the PPC. Every factory and every worker is busy: full, efficient use.`,
                    check: c => c.m.metrics.zone === 'on'
                },
                {
                    set: { px: 15, py: 20 },
                    ask: {
                        q: { en: 'A lockdown: factories shut, workers sit at home. Machines and people still exist. Where does the production point go?', hi: 'एक लॉकडाउन: कारखाने बंद, कामगार घर बैठे। मशीनें और लोग अब भी मौजूद हैं। उत्पादन बिंदु कहाँ जाएगा?' },
                        options: [
                            { en: 'Inside the PPC', hi: 'PPC के अंदर' },
                            { en: 'The whole PPC shifts inward', hi: 'पूरा PPC अंदर खिसक जाता है' },
                            { en: 'It stays on the PPC', hi: 'यह PPC पर ही रहता है' },
                            { en: 'Outside the PPC', hi: 'PPC के बाहर' }
                        ],
                        correct: c => c.m.metrics.growth !== 0 ? 1 : ({ inside: 0, on: 2, outside: 3 })[c.m.metrics.zone]
                    },
                    say: (c, hi) => hi
                        ? `बिंदु PPC के <b>अंदर</b> चला गया (${c.v.px} गेहूँ, ${c.v.py} कपड़ा)। PPC नहीं खिसका — क्षमता वही है, बस इस्तेमाल नहीं हो रही। अंदर का बिंदु = <b>बेरोज़गारी या संसाधनों का अकुशल उपयोग</b>।`
                        : `The point dropped <b>inside</b> the PPC (${c.v.px} wheat, ${c.v.py} cloth). The PPC did not shift — the capacity is all still there, just unused. An inside point = <b>unemployment or inefficient use</b> of resources.`,
                    check: c => c.m.metrics.zone === 'inside' && c.m.metrics.growth === 0
                },
                {
                    set: { px: 24, py: 32 },
                    ask: {
                        q: { en: 'The lockdown ends and everyone returns to work. To get back on the curve, what must the economy give up?', hi: 'लॉकडाउन ख़त्म, सब काम पर लौटते हैं। वापस curve पर आने के लिए अर्थव्यवस्था को क्या छोड़ना पड़ेगा?' },
                        options: [
                            { en: 'Nothing — idle resources simply come back into use', hi: 'कुछ नहीं — बेकार संसाधन बस फिर काम पर लग जाते हैं' },
                            { en: 'Some cloth, to get more wheat', hi: 'थोड़ा कपड़ा, ज़्यादा गेहूँ पाने के लिए' },
                            { en: 'It needs economic growth first', hi: 'पहले आर्थिक विकास चाहिए' }
                        ],
                        correct: c => (c.m.metrics.zone === 'on' && c.v.px >= c.prev.v.px && c.v.py >= c.prev.v.py && c.m.metrics.growth === 0) ? 0 : 1
                    },
                    say: (c, hi) => hi
                        ? `<b>दोनों</b> वस्तुएँ बढ़ीं — गेहूँ ${c.prev.v.px} → ${c.v.px}, कपड़ा ${c.prev.v.py} → ${c.v.py} — और कुछ भी नहीं छोड़ना पड़ा। अंदर के बिंदु से curve तक जाना <b>मुफ़्त</b> है: कोई अवसर लागत नहीं, क्योंकि कोई संसाधन किसी और काम से नहीं हटाया गया।`
                        : `<b>Both</b> goods rose — wheat ${c.prev.v.px} → ${c.v.px}, cloth ${c.prev.v.py} → ${c.v.py} — and nothing was given up. Moving from inside to the curve is <b>free</b>: no opportunity cost, because no resource was pulled away from anything else.`,
                    check: c => c.m.metrics.zone === 'on' && c.v.px > c.prev.v.px && c.v.py > c.prev.v.py
                },
                {
                    set: { px: 32, py: 24 },
                    ask: {
                        q: { en: 'After a bad harvest abroad, the country wants more wheat: 32 units. What does that cost now?', hi: 'विदेश में ख़राब फ़सल के बाद, देश ज़्यादा गेहूँ चाहता है: 32 इकाई। अब इसकी क्या कीमत है?' },
                        options: [
                            { en: 'Some cloth must be given up — an opportunity cost', hi: 'कुछ कपड़ा छोड़ना होगा — अवसर लागत' },
                            { en: 'Nothing, just like after the lockdown', hi: 'कुछ नहीं, लॉकडाउन के बाद की तरह' },
                            { en: 'It is impossible', hi: 'यह असंभव है' }
                        ],
                        correct: c => (c.m.metrics.zone === 'on' && c.v.py < c.prev.v.py) ? 0 : (c.m.metrics.zone === 'outside' ? 2 : 1)
                    },
                    say: (c, hi) => hi
                        ? `अब हम <b>curve के साथ</b> चले: ${c.v.px - c.prev.v.px} इकाई और गेहूँ के लिए ${c.prev.v.py - c.v.py} इकाई कपड़ा छोड़ना पड़ा — यही <b>अवसर लागत</b> है। और देखिए, MRT ${fmt(c.prev.m.metrics.mrt, 2)} से बढ़कर ${fmt(c.m.metrics.mrt, 2)} हो गई: हर अगला गेहूँ महँगा पड़ता है, क्योंकि कपड़े में ज़्यादा माहिर संसाधन खींचने पड़ते हैं। बढ़ती MRT ही PPC को मूल-बिंदु की ओर <b>अवतल</b> बनाती है।`
                        : `Now we moved <b>along the curve</b>: ${c.v.px - c.prev.v.px} more units of wheat cost ${c.prev.v.py - c.v.py} units of cloth — that is the <b>opportunity cost</b>. And MRT rose from ${fmt(c.prev.m.metrics.mrt, 2)} to ${fmt(c.m.metrics.mrt, 2)}: each extra unit of wheat costs more, because it pulls in resources better suited to cloth. Rising MRT is what makes the PPC <b>concave</b> to the origin.`,
                    check: c => c.m.metrics.zone === 'on' && c.prev.m.metrics.zone === 'on' && c.v.py < c.prev.v.py && c.m.metrics.mrt > c.prev.m.metrics.mrt
                },
                {
                    set: { px: 38, py: 35 },
                    ask: {
                        q: { en: 'Citizens now demand 38 wheat AND 35 cloth. Can the economy produce that today?', hi: 'नागरिक अब 38 गेहूँ और 35 कपड़ा माँगते हैं। क्या अर्थव्यवस्था आज इतना बना सकती है?' },
                        options: [
                            { en: 'No — the point lies outside the PPC', hi: 'नहीं — बिंदु PPC के बाहर है' },
                            { en: 'Yes — it lies on the PPC', hi: 'हाँ — यह PPC पर है' },
                            { en: 'Yes — it lies inside the PPC', hi: 'हाँ — यह PPC के अंदर है' }
                        ],
                        correct: c => ({ outside: 0, on: 1, inside: 2 })[c.m.metrics.zone]
                    },
                    say: (c, hi) => hi
                        ? `(${c.v.px}, ${c.v.py}) PPC के <b>बाहर</b> है — मौजूदा संसाधनों का कोई भी बँटवारा वहाँ नहीं पहुँचा सकता। यह <b>अप्राप्य</b> है।`
                        : `(${c.v.px}, ${c.v.py}) lies <b>outside</b> the PPC — no way of re-arranging today's resources can reach it. It is <b>unattainable</b>.`,
                    check: c => c.m.metrics.zone === 'outside' && c.m.metrics.growth === 0
                },
                {
                    set: { px: 38, py: 35, growth: 12 },
                    ask: {
                        q: { en: 'What could bring that point within reach?', hi: 'उस बिंदु तक कौन पहुँचा सकता है?' },
                        options: [
                            { en: 'Economic growth — more resources or better technology', hi: 'आर्थिक विकास — ज़्यादा संसाधन या बेहतर तकनीक' },
                            { en: 'Using today\'s resources more efficiently', hi: 'आज के संसाधनों का ज़्यादा कुशल उपयोग' },
                            { en: 'Reducing unemployment', hi: 'बेरोज़गारी घटाना' }
                        ],
                        correct: c => (c.m.metrics.growth > 0 && c.m.metrics.zone !== 'outside') ? 0 : 1
                    },
                    say: (c, hi) => hi
                        ? `नई तकनीक और ज़्यादा संसाधनों से पूरा PPC <b>बाहर खिसक</b> गया (PPC₁)। जो बिंदु कल अप्राप्य था, वह अब नए curve पर है। कुशलता या रोज़गार केवल आपको पुराने PPC <i>तक</i> ला सकते हैं — उसके <i>पार</i> सिर्फ़ विकास ले जाता है।`
                        : `New technology and more resources shifted the whole PPC <b>outward</b> (PPC₁). The point that was unattainable yesterday is now on the new curve. Efficiency or full employment can only bring you <i>up to</i> the old PPC — only growth takes you <i>beyond</i> it.`,
                    check: c => c.m.metrics.growth > 0 && c.m.metrics.zone === 'on' && c.prev.m.metrics.zone === 'outside'
                }
            ]
        }],
        model(v) {
            const R = 40 + v.growth;           // "radius": a quarter-ellipse PPC is concave to the origin
            const yOf = x => R * Math.sqrt(Math.max(0, 1 - (x / R) * (x / R)));
            const pts = [];
            for (let x = 0; x <= Math.min(R, 50); x += 0.5) { const y = yOf(x); if (y <= 50) pts.push([x, y]); }

            const onY = yOf(v.px);
            const dist = v.py - onY;
            const zone = Math.abs(dist) < 1.2 ? 'on' : (dist < 0 ? 'inside' : 'outside');
            // MRT = |dy/dx| on the curve at this X — rises as X rises, which
            // IS the concavity the syllabus asks students to explain.
            const mrt = v.px >= R ? Infinity : (v.px / Math.max(0.01, yOf(v.px)));

            const curves = [];
            if (glShowGhost && v.growth !== 0) {
                const base = [];
                for (let x = 0; x <= 40; x += 0.5) { const y = 40 * Math.sqrt(Math.max(0, 1 - (x / 40) * (x / 40))); base.push([x, y]); }
                curves.push({ id: 'ppc0', label: 'PPC', color: '#94a3b8', width: 2.2, dash: '7 5', pts: base });
            }
            curves.push({ id: 'ppc', label: v.growth ? 'PPC₁' : 'PPC', color: v.growth ? '#dc2626' : '#7c3aed', width: 3.2, pts, labelAt: 'start', labelDx: 10, labelDy: -10 });

            const zoneColor = zone === 'on' ? '#16a34a' : zone === 'inside' ? '#ea580c' : '#dc2626';
            return {
                curves,
                points: [{ id: 'p', x: v.px, y: v.py, label: zone === 'on' ? 'A (efficient)' : zone === 'inside' ? 'B (inefficient)' : 'C (unattainable)', color: zoneColor, xTick: `${v.px}`, yTick: `${v.py}` }],
                arrows: v.growth > 0 ? [{ from: [28, 28], to: [28 * (R / 40), 28 * (R / 40)], color: '#dc2626', label: 'Economic growth', bend: 0 }] : [],
                handles: [
                    { id: 'h-x', x: v.px, y: v.py, bind: 'px', axis: 'x', color: zoneColor, hint: 'Drag the production point left/right' },
                    { id: 'h-y', x: v.px, y: v.py, bind: 'py', axis: 'y', color: zoneColor, hint: 'Drag the production point up/down' }
                ],
                readings: [
                    { label: 'Your point', value: `X = ${v.px}, Y = ${v.py}` },
                    { label: 'Maximum Y at this X', value: `${fmt(onY, 1)} units` },
                    { label: 'Position', value: zone === 'on' ? 'ON the PPC' : zone === 'inside' ? 'INSIDE the PPC' : 'OUTSIDE the PPC' },
                    { label: 'MRT at this X', value: isFinite(mrt) ? `${fmt(mrt, 2)} units of Y per unit of X` : '∞' },
                    { label: 'Opportunity cost', value: isFinite(mrt) ? `${fmt(mrt, 2)} Y sacrificed for 1 more X` : '—' }
                ],
                verdict: {
                    kind: zone === 'on' ? 'movement' : 'shift',
                    title: zone === 'on'
                        ? '✔ ON the PPC — resources are <b>fully and efficiently employed</b>'
                        : zone === 'inside'
                            ? '⚠ INSIDE the PPC — <b>unemployment or inefficient use</b> of resources'
                            : '✖ OUTSIDE the PPC — this combination is <b>unattainable</b>',
                    detail: `${zone === 'on' ? `Producing more X now <b>requires</b> giving up Y — that sacrifice is the opportunity cost. Here MRT = ${fmt(mrt, 2)}, so one more unit of X costs ${fmt(mrt, 2)} units of Y.` : zone === 'inside' ? `The economy could produce ${fmt(onY - v.py, 1)} more units of Y <b>without giving up any X at all</b> — so nothing is being sacrificed, which is exactly why an interior point means idle or misallocated resources.` : `No reallocation of existing resources can reach this point. Only <b>economic growth</b> — more resources or better technology — can, and that shifts the whole PPC outward. Drag the growth chip and watch this point come within reach.`} Notice the MRT <b>rises</b> as you move right along the curve: the first units of X are made with resources well suited to X, but each further unit pulls in resources better suited to Y. Rising MRT is exactly what makes the PPC <b>concave to the origin</b>.`,
                    hi: {
                        title: zone === 'on'
                            ? '✔ PPC <b>पर</b> — संसाधनों का <b>पूर्ण और कुशल उपयोग</b>'
                            : zone === 'inside'
                                ? '⚠ PPC के <b>अंदर</b> — संसाधनों की <b>बेरोज़गारी या अकुशल उपयोग</b>'
                                : '✖ PPC के <b>बाहर</b> — यह संयोजन <b>अप्राप्य</b> है',
                        detail: `${zone === 'on' ? `अब अधिक X बनाने के लिए Y छोड़ना <b>ज़रूरी</b> है — यही त्याग अवसर लागत है। यहाँ MRT = ${fmt(mrt, 2)}, अर्थात X की एक और इकाई की लागत Y की ${fmt(mrt, 2)} इकाइयाँ है।` : zone === 'inside' ? `अर्थव्यवस्था <b>X की एक भी इकाई छोड़े बिना</b> Y की ${fmt(onY - v.py, 1)} इकाइयाँ और बना सकती है — कुछ भी त्यागना नहीं पड़ता, और ठीक इसीलिए अंदर का बिंदु निष्क्रिय या गलत ढंग से बँटे संसाधनों का संकेत है।` : `मौजूदा संसाधनों के किसी भी पुनर्बंटन से यह बिंदु नहीं मिल सकता। केवल <b>आर्थिक संवृद्धि</b> — अधिक संसाधन या बेहतर तकनीक — इसे संभव बनाती है, और वह पूरे PPC को बाहर की ओर खिसकाती है। संवृद्धि वाला चिप खींचें और इस बिंदु को पहुँच में आते देखें।`} ध्यान दें, वक्र पर दाईं ओर बढ़ने पर MRT <b>बढ़ता</b> है: X की पहली इकाइयाँ X के लिए उपयुक्त संसाधनों से बनती हैं, पर हर अगली इकाई Y के लिए बेहतर संसाधनों को खींच लाती है। बढ़ता MRT ही PPC को <b>मूल बिंदु की ओर नतोदर</b> बनाता है।`
                    }
                },
                metrics: { zone, mrt, px: v.px, py: v.py, growth: v.growth }
            };
        }
    },
    practice: [
        { prompt: 'Put the point inside the curve. What does the economy give up to produce more X from here?', hint: 'Nothing — idle resources can be put to work, so X can rise with no fall in Y. That is why opportunity cost is zero at an interior point.' },
        { prompt: 'Why is the PPC concave rather than a straight line?', hint: 'Because MRT rises: resources are not equally efficient in both goods, so each extra unit of X costs progressively more Y.' },
        { prompt: 'Distinguish a movement ALONG the PPC from a SHIFT of it.', hint: 'Along = reallocating existing resources between the two goods (opportunity cost is paid). Shift = the economy\'s capacity itself changes — growth in resources or technology moves the whole curve.' }
    ],
    challenge: {
        prompt: 'Reach the point X = 38, Y = 38 — you will have to grow the economy to do it.',
        check: (s, m) => m.px >= 37 && m.py >= 37 && m.zone !== 'outside'
    }
});
