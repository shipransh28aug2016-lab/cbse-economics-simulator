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
        curve: 'DD', shifted: 'D₁D₁',
        up: 'Contraction of Demand', upHi: 'माँग में संकुचन',
        down: 'Expansion of Demand', downHi: 'माँग में विस्तार',
        right: 'Increase in Demand', rightHi: 'माँग में वृद्धि',
        left: 'Decrease in Demand', leftHi: 'माँग में कमी'
    },
    supply: {
        curve: 'SS', shifted: 'S₁S₁',
        up: 'Expansion of Supply', upHi: 'पूर्ति में विस्तार',
        down: 'Contraction of Supply', downHi: 'पूर्ति में संकुचन',
        right: 'Increase in Supply', rightHi: 'पूर्ति में वृद्धि',
        left: 'Decrease in Supply', leftHi: 'पूर्ति में कमी'
    }
};

// Builds the verdict block shared by the demand and supply labs.
//   priceΔ  — change in OWN price (drives a MOVEMENT along the curve)
//   shiftΔ  — net non-price determinant effect (drives a SHIFT of the curve)
function glMoveShiftVerdict(kindKey, priceD, shiftD) {
    const T = GL_TERMS[kindKey];
    const moved = Math.abs(priceD) > 0.001;
    const shifted = Math.abs(shiftD) > 0.001;

    const moveName = priceD > 0 ? T.up : T.down;
    const moveHi = priceD > 0 ? T.upHi : T.downHi;
    const shiftName = shiftD > 0 ? T.right : T.left;
    const shiftHi = shiftD > 0 ? T.rightHi : T.leftHi;
    const dirWord = shiftD > 0 ? 'RIGHTWARD' : 'LEFTWARD';

    if (!moved && !shifted) {
        return {
            kind: 'none',
            title: `Nothing has changed yet — this is the original ${T.curve} curve.`,
            detail: `Move an <b>own-price</b> chip to travel <i>along</i> ${T.curve}. Move any <b>other determinant</b> to make the whole curve <i>shift</i> to a new position. The diagram will name what you did.`
        };
    }
    if (moved && !shifted) {
        return {
            kind: 'movement',
            chips: ['Same curve', 'Price changed'],
            title: `MOVEMENT along ${T.curve} → <b>${moveName}</b> <span class="gl-hi">(${moveHi})</span>`,
            detail: `Only the good's <b>own price</b> changed, so the curve itself did <b>not</b> move — you slid from one point on ${T.curve} to another point on the <i>same</i> ${T.curve}. Price ${priceD > 0 ? 'rose' : 'fell'}, so quantity ${kindKey === 'demand' ? (priceD > 0 ? 'demanded fell' : 'demanded rose') : (priceD > 0 ? 'supplied rose' : 'supplied fell')}. In the exam this is called <b>${moveName}</b> — never "${shiftD >= 0 ? T.right : T.left}".`
        };
    }
    if (!moved && shifted) {
        return {
            kind: 'shift',
            chips: ['New curve', 'Price unchanged'],
            title: `SHIFT of ${T.curve} → ${T.shifted} (${dirWord}) → <b>${shiftName}</b> <span class="gl-hi">(${shiftHi})</span>`,
            detail: `A <b>non-price determinant</b> changed, so at <i>every</i> price the quantity ${kindKey === 'demand' ? 'demanded' : 'supplied'} is now ${shiftD > 0 ? 'higher' : 'lower'} — the entire curve has moved to a new position ${T.shifted}. Own price never moved, so this is <b>not</b> ${moveName.toLowerCase()}. The exam term is <b>${shiftName}</b>.`
        };
    }
    return {
        kind: 'both',
        chips: ['New curve', 'Price changed'],
        title: `BOTH at once → <b>${shiftName}</b> + <b>${moveName}</b>`,
        detail: `Two separate things happened and the exam expects them named separately. <b>1.</b> A non-price determinant shifted ${T.curve} ${dirWord.toLowerCase()} to ${T.shifted} — that is <b>${shiftName}</b>. <b>2.</b> Own price then changed, moving you <i>along the new</i> ${T.shifted} — that is <b>${moveName}</b>. A shift relocates the curve; a movement relocates you on it.`
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

            let vTitle, vKind, vDetail;
            if (!dMoved && !sMoved) {
                vKind = Math.abs(gap) > 0.6 ? 'movement' : 'none';
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
                vDetail = both && Math.abs(dp) < 1.2
                    ? `Both curves shifted by a similar amount, so quantity changes definitely but the <b>price effect is indeterminate</b> — it depends on the <i>relative</i> size of the two shifts. Drag one further than the other and watch the price break one way. "Indeterminate" is a complete exam answer here.`
                    : `New equilibrium: OP = ₹${fmt(eq.P, 0)} (was ₹${fmt(eq0.P, 0)}), OQ = ${fmt(eq.Q, 0)} (was ${fmt(eq0.Q, 0)}). The curve moved to a new position — the other curve did not move, students only travelled <i>along</i> it to the new intersection.`;
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
                verdict: { kind: vKind, title: vTitle, detail: vDetail },
                metrics: { eqP: eq.P, eqQ: eq.Q, gap, dShift: v.dShift, sShift: v.sShift }
            };
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
                    detail: `The consumer cannot reach IC₃ — it lies entirely beyond the budget line. Any point on IC₁ is affordable but gives less satisfaction than E. Only at E is the budget line <b>tangent</b>, so both conditions hold: MRS equals the price ratio, and MRS is diminishing (the IC is convex to the origin). Drag the <span style="color:#dc2626">red</span> handle to change income — notice the line stays <b>parallel</b>. Drag the <span style="color:#ea580c">orange</span> X-intercept to change Px — notice the line <b>swivels</b> instead. That difference is why a price change, not an income change, traces out the demand curve.`
                },
                metrics: { xStar, yStar, ratio, M: v.M }
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
            { label: 'Read cost at min AC', note: 'MC = AC here', set: { q: 11.5 } },
            { label: 'Efficiency improves', note: 'AVC and MC both fall', set: { eff: 4 } }
        ],
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
                    title: mc(v.q) < ac(v.q) - 0.15
                        ? 'MC &lt; AC → <b>AC is still falling</b>'
                        : mc(v.q) > ac(v.q) + 0.15
                            ? 'MC &gt; AC → <b>AC is now rising</b>'
                            : 'MC = AC → you are at the <b>minimum point of AC</b>',
                    detail: `At Q = ${fmt(v.q, 1)}: MC = ₹${fmt(mc(v.q), 2)} and AC = ₹${fmt(ac(v.q), 2)}. ${mc(v.q) < ac(v.q) - 0.15 ? 'Each extra unit costs less than the running average, so the average is pulled <b>down</b>.' : mc(v.q) > ac(v.q) + 0.15 ? 'Each extra unit costs more than the running average, so the average is pulled <b>up</b>.' : 'Neither pulls — this is exactly where MC crosses AC, and AC is at its lowest.'} AC reaches its minimum at Q ≈ ${fmt(minAC.q, 1)} and AVC at Q ≈ ${fmt(minAVC.q, 1)} — AVC bottoms out <b>before</b> AC, because falling AFC keeps dragging AC down for a while longer. Raise TFC and watch AC and AFC lift while <b>AVC and MC do not move at all</b>.`
                },
                metrics: { q: v.q, ac: ac(v.q), mc: mc(v.q), avc: avc(v.q), minACq: minAC.q }
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
    concept: '<p><b>Perfect competition:</b> the firm is a price-taker, so it sells any quantity at the same price. Then <b>AR = MR = price</b>, and both are a horizontal straight line; TR rises as a straight line through the origin.</p><p><b>Monopoly / imperfect competition:</b> to sell more the firm must cut price, so AR slopes downward and <b>MR falls twice as fast</b>, lying below AR. TR rises, peaks where MR = 0, then falls.</p><p><b>Producer\'s equilibrium</b> is where <b>MR = MC and MC is rising</b> (cutting MR from below). Both conditions are needed — MR = MC alone can also occur at a loss-maximising point where MC is falling.</p>',
    formulas: [
        'TR = P × Q      AR = TR / Q = P      MR = ΔTR / ΔQ',
        'Perfect competition: AR = MR = P (horizontal line)',
        'Monopoly: AR slopes down; MR falls twice as steeply, MR < AR',
        'TR is maximum where MR = 0',
        "Producer's equilibrium: MR = MC, and MC rising",
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
            let eqQ = null;
            for (let q = 2; q <= 19; q += 0.05) {
                if (mr(q) - mc(q) <= 0 && mc(q) > mc(q - 0.05)) { eqQ = q; break; }
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
                        ? "✔ <b>Producer's equilibrium</b> — MR = MC and MC is rising."
                        : (mr(v.q) > mc(v.q) ? 'MR &gt; MC → the firm should <b>expand</b> output' : 'MR &lt; MC → the firm should <b>cut</b> output'),
                    detail: `${isPC ? 'Under perfect competition the firm is a price-taker: <b>AR = MR = price</b>, so the revenue line is horizontal and the firm produces where MC rises to meet it.' : 'Under monopoly the firm must cut price to sell more, so AR slopes down and <b>MR falls twice as fast</b> and lies below AR — which is why the monopolist stops at a smaller output and charges a price <i>above</i> MR.'} ${atEq ? `At Q = ${fmt(v.q, 1)} the last unit adds exactly what it costs, so no further change raises profit. Profit here = ₹${fmt(profit, 1)}.` : `At Q = ${fmt(v.q, 1)}, MR = ₹${fmt(mr(v.q), 2)} against MC = ₹${fmt(mc(v.q), 2)} — the last unit ${mr(v.q) > mc(v.q) ? 'earns more than it costs, so producing it adds to profit' : 'costs more than it earns, so producing it destroys profit'}. Drag toward Q = ${eqQ ? fmt(eqQ, 1) : '—'}.`} Remember: MR = MC alone is <b>not</b> enough — MC must also be <b>rising</b> through MR.`
                },
                metrics: { q: v.q, eqQ, profit, isPC }
            };
        }
    },
    practice: [
        { prompt: 'Set monopoly power to 0. What is the relationship between AR and MR, and why?', hint: 'AR = MR = price. A price-taker sells every extra unit at the same unchanged price, so the extra revenue from one more unit IS the price.' },
        { prompt: 'Raise monopoly power. Why does MR fall below AR?', hint: 'To sell one more unit the monopolist must cut the price on ALL units. The gain from the extra unit is partly offset by the loss on the earlier ones, so MR < AR.' },
        { prompt: 'Why is "MR = MC" alone not the full equilibrium condition?', hint: 'MR = MC can also happen where MC is falling — there, producing more still adds to profit. The second condition is that MC must be rising (cutting MR from below).' }
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
                    detail: `${zone === 'on' ? `Producing more X now <b>requires</b> giving up Y — that sacrifice is the opportunity cost. Here MRT = ${fmt(mrt, 2)}, so one more unit of X costs ${fmt(mrt, 2)} units of Y.` : zone === 'inside' ? `The economy could produce ${fmt(onY - v.py, 1)} more units of Y <b>without giving up any X at all</b> — so nothing is being sacrificed, which is exactly why an interior point means idle or misallocated resources.` : `No reallocation of existing resources can reach this point. Only <b>economic growth</b> — more resources or better technology — can, and that shifts the whole PPC outward. Drag the growth chip and watch this point come within reach.`} Notice the MRT <b>rises</b> as you move right along the curve: the first units of X are made with resources well suited to X, but each further unit pulls in resources better suited to Y. Rising MRT is exactly what makes the PPC <b>concave to the origin</b>.`
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
