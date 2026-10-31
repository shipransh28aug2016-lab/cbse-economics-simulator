// ══════════════════════════════════════════════════════════════
// GRAPH LABS — Class XII Macroeconomics (mode: 'graphlab').
//
// The Class XII diagrams that carry the most marks and are drawn most
// often: the AD–AS / 45° income-determination figure with its deficient
// and excess demand gaps, the consumption and saving functions with the
// break-even point, and exchange-rate determination. Same drag-first
// treatment as the Class XI labs — see js/graph-lab-engine.js.
// ══════════════════════════════════════════════════════════════

// Indian digit grouping for rupee amounts in story narration: ₹8,60,000.
function glINR(n) { return Math.round(n).toLocaleString('en-IN'); }

SIMS.push({
    id: 'gl-ad-as-equilibrium',
    module: 'macro',
    title: 'AD–AS Equilibrium, Deficient & Excess Demand',
    desc: 'The 45° diagram: drag AD and watch equilibrium income move, then see the deflationary or inflationary gap measured against full employment.',
    class: 'XII', part: 'A', unit: 3, unitTitle: 'Determination of Income and Employment', topicLabel: 'AD–AS Equilibrium & Gaps',
    syllabusIds: ['XII-A-U3-EQUILIBRIUM', 'XII-A-U3-AD', 'XII-A-U3-GAPS', 'XII-A-U3-EMPLOYMENT'],
    mode: 'graphlab',
    concept: '<p>The economy is in equilibrium where <b>AD = AS</b> — where the aggregate demand line cuts the 45° line, since every point on the 45° line has AD equal to output.</p><p>Full-employment income (Y<sub>F</sub>) is a <i>separate</i> vertical line. Equilibrium need not land on it, and that is the whole point:</p><ul><li><b>Deficient demand</b> — AD cuts the 45° line <i>below</i> Y<sub>F</sub>. The vertical shortfall of AD at Y<sub>F</sub> is the <b>deflationary gap</b>. Consequence: output and employment fall, involuntary unemployment.</li><li><b>Excess demand</b> — AD would cut it <i>beyond</i> Y<sub>F</sub>, but output cannot exceed Y<sub>F</sub>. The vertical excess of AD at Y<sub>F</sub> is the <b>inflationary gap</b>. Consequence: prices rise, output does not.</li></ul><p>Note the gap is measured <b>at Y<sub>F</sub>, vertically</b> — not as the horizontal distance between the two income levels. That is the most common diagram error in the exam.</p>',
    formulas: [
        'AD = C + I  (two-sector);  AD = C + I + G + (X − M)',
        'C = C̄ + b·Y   (C̄ = autonomous consumption, b = MPC)',
        'Equilibrium: AD = AS, i.e. AD = Y  (the 45° line)',
        'Y* = (C̄ + I) / (1 − b)',
        'Multiplier k = 1 / (1 − MPC) = 1 / MPS',
        'Deflationary gap = AD needed at Y_F − actual AD at Y_F',
        'Inflationary gap = actual AD at Y_F − AD needed at Y_F'
    ],
    graphLab: {
        groupLabels: { price: 'The benchmark you measure against', other: 'What determines the AD line' },
        x: { label: 'Income / Output (Y) ₹ crore →', min: 0, max: 1000 },
        y: { label: 'Aggregate Demand (AD) ₹ crore →', min: 0, max: 1000 },
        vars: [
            { id: 'auto', label: 'Autonomous Expenditure (C̄ + I)', min: 20, max: 400, step: 5, value: 150, unit: '₹cr', hint: 'Shifts the whole AD line up or down' },
            { id: 'mpc', label: 'MPC (b)', min: 0.1, max: 0.9, step: 0.05, value: 0.6, hint: 'Steepens or flattens AD; sets the multiplier' },
            { id: 'yf', label: 'Full-employment income (Y_F)', min: 200, max: 900, step: 10, value: 500, unit: '₹cr', group: 'price', hint: 'The target the gap is measured against' }
        ],
        scenarios: [
            { label: 'Full-employment equilibrium', note: 'No gap', set: { auto: 200, mpc: 0.6, yf: 500 } },
            { label: 'Deficient demand', note: 'Deflationary gap', set: { auto: 120, mpc: 0.6, yf: 500 } },
            { label: 'Excess demand', note: 'Inflationary gap', set: { auto: 280, mpc: 0.6, yf: 500 } },
            { label: 'Higher MPC', note: 'Bigger multiplier, steeper AD', set: { mpc: 0.8 } }
        ],
        // Story Mode (js/story-mode.js) — see js/simulations_graphlab.js's
        // tea-stall story for the honesty contract every step follows.
        stories: [{
            id: 'recession-recovery',
            title: { en: 'A recession — and the way out', hi: 'एक मंदी — और उससे निकलने का रास्ता' },
            intro: {
                en: 'An economy at full employment loses business confidence. Watch income fall by MORE than the spending cut — and see exactly how much the government must spend to undo it.',
                hi: 'पूर्ण रोज़गार वाली एक अर्थव्यवस्था में व्यापार का भरोसा टूट जाता है। देखिए कि आय ख़र्च में हुई कटौती से भी ज़्यादा कैसे गिरती है — और सरकार को इसे ठीक करने के लिए ठीक कितना ख़र्च करना होगा।'
            },
            outro: {
                en: 'A spending change moves income by k times itself (k = 1/(1−MPC)). So policy must fill the deflationary GAP, measured vertically at Y_F — not the whole fall in income.',
                hi: 'ख़र्च में बदलाव आय को अपने k गुना बदलता है (k = 1/(1−MPC))। इसलिए नीति को अवस्फीतिक अंतराल भरना होता है, जो Y_F पर ऊर्ध्वाधर मापा जाता है — आय में पूरी गिरावट नहीं।'
            },
            steps: [
                {
                    set: { auto: 200 },
                    say: (c, hi) => hi
                        ? `AD, 45° रेखा को Y* = ₹${fmt(c.m.metrics.yStar, 0)} cr पर काटती है — ठीक Y<sub>F</sub> पर। काम चाहने वाले हर व्यक्ति को काम मिला हुआ है: <b>पूर्ण रोज़गार, कोई अंतराल नहीं</b>।`
                        : `AD cuts the 45° line at Y* = ₹${fmt(c.m.metrics.yStar, 0)} cr — exactly at Y<sub>F</sub>. Everyone who wants work has it: <b>full employment, no gap</b>.`,
                    check: c => c.m.verdict.kind === 'none' && Math.abs(c.m.metrics.yStar - c.v.yf) < 1
                },
                {
                    set: { auto: 150 },
                    ask: {
                        q: { en: 'Business confidence collapses: firms cut investment by ₹50 cr. Where does equilibrium income go?', hi: 'व्यापार का भरोसा टूट जाता है: फ़र्में निवेश ₹50 cr घटा देती हैं। संतुलन आय कहाँ जाएगी?' },
                        options: [
                            { en: 'Below Y_F — a deflationary gap', hi: 'Y_F से नीचे — अवस्फीतिक अंतराल' },
                            { en: 'Above Y_F — an inflationary gap', hi: 'Y_F से ऊपर — स्फीतिक अंतराल' },
                            { en: 'It stays at Y_F', hi: 'यह Y_F पर ही रहेगी' }
                        ],
                        correct: c => c.m.metrics.gap < -1 ? 0 : (c.m.metrics.gap > 1 ? 1 : 2)
                    },
                    say: (c, hi) => {
                        const cut = c.prev.v.auto - c.v.auto, fall = c.prev.m.metrics.yStar - c.m.metrics.yStar;
                        return hi
                            ? `AD नीचे खिसकी। संतुलन Y* = ₹${fmt(c.m.metrics.yStar, 0)} cr पर आ गया, Y<sub>F</sub> से नीचे। ख़र्च में कटौती केवल ₹${fmt(cut, 0)} cr थी, पर आय ₹${fmt(fall, 0)} cr गिरी — यह गुणक k = ${fmt(c.m.metrics.k, 2)} का असर है। Y<sub>F</sub> पर ऊर्ध्वाधर कमी = <b>अवस्फीतिक अंतराल ₹${fmt(-c.m.metrics.gap, 0)} cr</b> → अनैच्छिक बेरोज़गारी।`
                            : `AD shifts down. Equilibrium falls to Y* = ₹${fmt(c.m.metrics.yStar, 0)} cr, below Y<sub>F</sub>. Spending fell by only ₹${fmt(cut, 0)} cr, yet income fell by ₹${fmt(fall, 0)} cr — that is the multiplier k = ${fmt(c.m.metrics.k, 2)} at work. The vertical shortfall at Y<sub>F</sub> is the <b>deflationary gap of ₹${fmt(-c.m.metrics.gap, 0)} cr</b> → involuntary unemployment.`;
                    },
                    check: c => c.m.metrics.gap < -1 && c.m.metrics.yStar < c.v.yf &&
                        Math.abs((c.prev.m.metrics.yStar - c.m.metrics.yStar) - (c.prev.v.auto - c.v.auto) * c.m.metrics.k) < 0.5
                },
                {
                    set: { auto: 200 },
                    ask: {
                        q: { en: 'The government wants full employment back. How much EXTRA spending does it need?', hi: 'सरकार पूर्ण रोज़गार वापस चाहती है। उसे कितना अतिरिक्त ख़र्च करना होगा?' },
                        // Built from the PREVIOUS step's model, i.e. the
                        // economy the student is looking at when asked.
                        options: c => {
                            const gap = -c.prev.m.metrics.gap, k = c.prev.m.metrics.k;
                            return [
                                { en: `₹${fmt(gap, 0)} cr — the size of the gap`, hi: `₹${fmt(gap, 0)} cr — अंतराल जितना` },
                                { en: `₹${fmt(gap * k, 0)} cr — the whole fall in income`, hi: `₹${fmt(gap * k, 0)} cr — आय में पूरी गिरावट जितना` },
                                { en: `₹${fmt(gap / k, 0)} cr — the gap divided by k`, hi: `₹${fmt(gap / k, 0)} cr — अंतराल को k से भाग देकर` }
                            ];
                        },
                        correct: c => {
                            const added = c.v.auto - c.prev.v.auto, gap = -c.prev.m.metrics.gap, k = c.prev.m.metrics.k;
                            const opts = [gap, gap * k, gap / k];
                            return opts.reduce((best, x, i) => Math.abs(x - added) < Math.abs(opts[best] - added) ? i : best, 0);
                        }
                    },
                    say: (c, hi) => {
                        const added = c.v.auto - c.prev.v.auto, rise = c.m.metrics.yStar - c.prev.m.metrics.yStar;
                        return hi
                            ? `सरकार ₹${fmt(added, 0)} cr अतिरिक्त ख़र्च करती है (जैसे राजमार्ग परियोजनाएँ)। गुणक ${fmt(c.m.metrics.k, 2)} के कारण आय ₹${fmt(rise, 0)} cr बढ़ती है — ठीक वापस Y<sub>F</sub> = ₹${fmt(c.v.yf, 0)} cr पर। इसीलिए नीति को <b>अंतराल</b> भरना होता है, आय की पूरी गिरावट नहीं।`
                            : `The government spends ₹${fmt(added, 0)} cr more (say, highway projects). Through the multiplier of ${fmt(c.m.metrics.k, 2)}, income rises by ₹${fmt(rise, 0)} cr — exactly back to Y<sub>F</sub> = ₹${fmt(c.v.yf, 0)} cr. That is why policy fills the <b>gap</b>, not the whole fall in income.`;
                    },
                    check: c => Math.abs(c.m.metrics.gap) < 1 &&
                        Math.abs((c.v.auto - c.prev.v.auto) - (-c.prev.m.metrics.gap)) < 0.5 &&
                        Math.abs((c.m.metrics.yStar - c.prev.m.metrics.yStar) - (c.v.auto - c.prev.v.auto) * c.m.metrics.k) < 0.5
                }
            ]
        }],
        model(v) {
            const adAt = y => v.auto + v.mpc * y;
            const yStar = v.auto / (1 - v.mpc);
            const k = 1 / (1 - v.mpc);
            const adAtYf = adAt(v.yf);
            const gap = adAtYf - v.yf;         // >0 inflationary, <0 deflationary
            const isInfl = gap > 1, isDefl = gap < -1;

            const line = f => { const o = []; for (let y = 0; y <= 1000; y += 25) { const val = f(y); if (val <= 1000) o.push([y, val]); } return o; };

            const curves = [
                { id: 'as', label: 'AS (45°)', color: '#1e1b3a', width: 2.4, pts: [[0, 0], [1000, 1000]], labelAt: 'end', labelDx: -60, labelDy: 16 },
                { id: 'ad', label: 'AD = C + I', color: '#2563eb', width: 3.2, pts: line(adAt) },
                // Y_F drawn as a vertical line, exactly as the textbook does.
                { id: 'yf', label: 'Y_F', color: '#16a34a', width: 2.4, dash: '7 5', pts: [[v.yf, 0], [v.yf, 1000]], labelAt: 'end', labelDx: 4, labelDy: 14 }
            ];
            if (glShowGhost && (isInfl || isDefl)) {
                // The AD line that WOULD give full-employment equilibrium —
                // the dotted reference the gap is measured against.
                const need = v.yf * (1 - v.mpc);
                curves.push({ id: 'adf', label: 'AD needed for Y_F', color: '#94a3b8', width: 2, dash: '5 5', pts: line(y => need + v.mpc * y), labelAt: 'end', labelDx: -128, labelDy: -8 });
            }

            const points = [{ id: 'e', x: Math.min(yStar, 990), y: Math.min(yStar, 990), label: 'E (AD = AS)', color: '#7c3aed', xTick: `Y*=${fmt(Math.min(yStar, 9999), 0)}`, yTick: `${fmt(Math.min(yStar, 9999), 0)}` }];
            if (isInfl || isDefl) points.push({ id: 'f', x: v.yf, y: v.yf, label: 'F', color: '#16a34a', drop: false });

            const arrows = [];
            if (isInfl || isDefl) {
                // The gap: a VERTICAL segment at Y_F between the 45° line and
                // the AD line. Drawing it any other way is the classic error.
                arrows.push({
                    from: [v.yf, v.yf], to: [v.yf, adAtYf],
                    color: isInfl ? '#dc2626' : '#ea580c', bend: 0,
                    // The arrow runs vertically along Y_F, so its label has to
                    // sit off to one side or it lands on top of point F.
                    labelDx: -108, labelDy: 4,
                    label: `${isInfl ? 'Inflationary' : 'Deflationary'} Gap = ₹${fmt(Math.abs(gap), 0)} cr`
                });
            }

            return {
                curves, points, arrows,
                handles: [
                    { id: 'h-ad', x: 60, y: adAt(60), bind: 'auto', axis: 'y', color: '#2563eb', hint: 'Drag AD up/down (autonomous expenditure)' },
                    { id: 'h-slope', x: 820, y: adAt(820), bind: 'mpc', axis: 'y', k: 820, color: '#0891b2', hint: 'Drag the far end of AD — changes MPC (the slope)' },
                    { id: 'h-yf', x: v.yf, y: 900, bind: 'yf', axis: 'x', color: '#16a34a', hint: 'Drag the full-employment line left/right' }
                ],
                readings: [
                    { label: 'Autonomous expenditure', value: `₹${fmt(v.auto, 0)} cr` },
                    { label: 'MPC (b)', value: fmt(v.mpc, 2) },
                    { label: 'MPS = 1 − MPC', value: fmt(1 - v.mpc, 2) },
                    { label: 'Multiplier k = 1/(1−MPC)', value: fmt(k, 2) },
                    { label: 'Equilibrium income Y*', value: `₹${fmt(yStar, 0)} cr` },
                    { label: 'Full-employment income Y_F', value: `₹${fmt(v.yf, 0)} cr` },
                    { label: 'AD at Y_F', value: `₹${fmt(adAtYf, 0)} cr` },
                    { label: isInfl ? 'Inflationary gap' : isDefl ? 'Deflationary gap' : 'Gap', value: Math.abs(gap) < 1 ? '✔ none — full employment' : `₹${fmt(Math.abs(gap), 0)} cr` },
                    { label: 'Change in Y needed', value: Math.abs(gap) < 1 ? '—' : `₹${fmt(Math.abs(gap) * k, 0)} cr (gap × multiplier)` }
                ],
                verdict: {
                    kind: isInfl ? 'shift' : isDefl ? 'shift' : 'none',
                    title: isInfl
                        ? 'EXCESS DEMAND → <b>Inflationary Gap</b> of ₹' + fmt(gap, 0) + ' crore'
                        : isDefl
                            ? 'DEFICIENT DEMAND → <b>Deflationary Gap</b> of ₹' + fmt(-gap, 0) + ' crore'
                            : '✔ Equilibrium is AT full employment — <b>no gap</b>',
                    detail: isInfl
                        ? `At Y<sub>F</sub> = ₹${fmt(v.yf, 0)} cr, AD is ₹${fmt(adAtYf, 0)} cr — <b>above</b> what the economy can actually produce. Output cannot rise past Y<sub>F</sub>, so the excess demand spends itself on <b>rising prices</b>, not more goods. The gap is the <b>vertical</b> distance at Y<sub>F</sub>, and it is ₹${fmt(gap, 0)} cr. Correction: <b>contractionary</b> policy — cut government spending, raise taxes, raise repo/CRR/SLR. To close it, autonomous expenditure must fall by ₹${fmt(gap, 0)} cr (which cuts income by gap × multiplier = ₹${fmt(gap * k, 0)} cr).`
                        : isDefl
                            ? `At Y<sub>F</sub> = ₹${fmt(v.yf, 0)} cr, AD is only ₹${fmt(adAtYf, 0)} cr — <b>short</b> of what would buy full-employment output. Firms find stocks piling up, cut production, and equilibrium settles at Y* = ₹${fmt(yStar, 0)} cr, <b>below</b> Y<sub>F</sub>, leaving <b>involuntary unemployment</b>. The gap is the <b>vertical</b> shortfall at Y<sub>F</sub>: ₹${fmt(-gap, 0)} cr. Correction: <b>expansionary</b> policy — raise government spending, cut taxes, cut repo/CRR/SLR. Autonomous expenditure must rise by ₹${fmt(-gap, 0)} cr, which raises income by ₹${fmt(-gap * k, 0)} cr through the multiplier of ${fmt(k, 2)}.`
                            : `AD cuts the 45° line exactly at Y<sub>F</sub> = ₹${fmt(v.yf, 0)} cr, so aggregate demand is precisely enough to buy full-employment output — neither gap exists. Drag the AD line up to create excess demand, or down to create deficient demand, and watch the gap appear as a vertical segment at Y<sub>F</sub>.`
                },
                metrics: { yStar, gap, k, mpc: v.mpc }
            };
        }
    },
    practice: [
        { prompt: 'Create a deflationary gap. Where exactly on the diagram is it measured?', hint: 'Vertically, at Y_F: from the AD line up to the 45° line. It is NOT the horizontal distance between Y* and Y_F.' },
        { prompt: 'The deflationary gap is ₹50 cr and MPC = 0.8. By how much must income rise to close it?', hint: 'Multiplier = 1/(1−0.8) = 5. Income must rise by 50 × 5 = ₹250 cr, achieved by raising autonomous expenditure by ₹50 cr.' },
        { prompt: 'With excess demand, why does output NOT rise?', hint: 'The economy is already at full employment — there are no idle resources left. The extra demand only bids up prices, causing inflation.' },
        { prompt: 'Raise MPC and watch AD steepen. What happens to the multiplier and to equilibrium income?', hint: 'A higher MPC means less leaks into saving, so k = 1/(1−MPC) rises and each rupee of autonomous spending raises income by more.' }
    ],
    challenge: {
        prompt: 'Produce an inflationary gap of about ₹60 crore.',
        check: (s, m) => m.gap > 50 && m.gap < 72
    }
});

SIMS.push({
    id: 'gl-consumption-saving',
    module: 'macro',
    title: 'Consumption & Saving Functions (Break-even Point)',
    desc: 'Drag the consumption line: see the break-even point where C = Y and S = 0, and read APC, APS, MPC, MPS live.',
    class: 'XII', part: 'A', unit: 3, unitTitle: 'Determination of Income and Employment', topicLabel: 'Propensity to Consume & Save',
    syllabusIds: ['XII-A-U3-PROPENSITY'],
    mode: 'graphlab',
    concept: '<p>The <b>consumption function</b> C = C̄ + bY has a positive intercept: even at zero income people consume C̄ by drawing on past savings (dissaving). The <b>saving function</b> is its mirror: S = Y − C = −C̄ + (1−b)Y.</p><p>The <b>break-even point</b> is where the C line cuts the 45° line: there C = Y, so <b>S = 0</b> and <b>APC = 1</b>. Left of it the economy dissaves (S is negative, APC > 1); right of it it saves.</p><p>Four ratios the exam asks to compute and relate: <b>APC + APS = 1</b> and <b>MPC + MPS = 1</b>. APC can exceed 1 (at low income); MPC cannot exceed 1 and cannot be negative.</p>',
    formulas: [
        'C = C̄ + b·Y      S = Y − C = −C̄ + (1 − b)·Y',
        'APC = C / Y       APS = S / Y       APC + APS = 1',
        'MPC = ΔC / ΔY = b   MPS = ΔS / ΔY = 1 − b   MPC + MPS = 1',
        'Break-even income: Y = C̄ / (1 − b), where S = 0 and APC = 1',
        'Multiplier k = 1 / MPS = 1 / (1 − MPC)'
    ],
    graphLab: {
        groupLabels: { price: 'Where you are reading the functions', other: 'What determines the consumption line' },
        x: { label: 'Income (Y) ₹ crore →', min: 0, max: 600 },
        y: { label: 'Consumption / Saving ₹ crore →', min: -100, max: 600 },
        vars: [
            { id: 'cbar', label: 'Autonomous Consumption (C̄)', min: 10, max: 200, step: 5, value: 60, unit: '₹cr', hint: 'The intercept — consumption at zero income' },
            { id: 'mpc', label: 'MPC (b)', min: 0.1, max: 0.95, step: 0.05, value: 0.7, hint: 'The slope of the consumption line' },
            { id: 'y', label: 'Income level shown (Y)', min: 20, max: 580, step: 10, value: 300, unit: '₹cr', group: 'price', hint: 'Drag along the lines to read APC/APS here' }
        ],
        scenarios: [
            { label: 'Read the break-even point', note: 'S = 0, APC = 1', set: { y: 200, cbar: 60, mpc: 0.7 } },
            { label: 'Low income — dissaving', note: 'APC > 1, S < 0', set: { y: 100 } },
            { label: 'High income — saving', note: 'APC < 1, S > 0', set: { y: 500 } },
            { label: 'Higher MPC', note: 'Flatter saving line, bigger multiplier', set: { mpc: 0.9 } }
        ],
        stories: [{
            id: 'household',
            title: { en: 'A country growing richer — saving and spending', hi: 'एक अमीर होता देश — बचत और ख़र्च' },
            intro: {
                en: 'Follow one economy as its income rises from ₹100 cr to ₹500 cr. People must eat even with no income — so watch when they dissave, when they break even, and when saving begins.',
                hi: 'एक अर्थव्यवस्था के साथ चलिए जिसकी आय ₹100 cr से ₹500 cr तक बढ़ती है। आय न हो तब भी लोगों को खाना तो है — इसलिए देखिए कि वे कब अबचत करते हैं, कब बराबरी पर आते हैं, और कब बचत शुरू होती है।'
            },
            outro: {
                en: 'APC can exceed 1 (dissaving) at low income, equals 1 at break-even, and keeps falling as income rises — while MPC stays constant along a straight consumption line. APC + APS = 1 and MPC + MPS = 1, always.',
                hi: 'कम आय पर APC, 1 से ज़्यादा (अबचत) हो सकता है, बराबरी बिंदु पर 1 होता है, और आय बढ़ने पर गिरता जाता है — जबकि सीधी उपभोग रेखा पर MPC स्थिर रहता है। APC + APS = 1 और MPC + MPS = 1, हमेशा।'
            },
            steps: [
                {
                    set: { y: 100 },
                    say: (c, hi) => hi
                        ? `आय ₹${fmt(c.v.y, 0)} cr, पर उपभोग ₹${fmt(c.v.y * c.m.metrics.apc, 0)} cr — आय से ज़्यादा! अंतर ₹${fmt(-c.m.metrics.s, 0)} cr पुरानी बचत या उधार से आता है: <b>अबचत</b>। APC = ${fmt(c.m.metrics.apc, 2)} — हाँ, APC 1 से ज़्यादा हो सकता है।`
                        : `Income is ₹${fmt(c.v.y, 0)} cr, but consumption is ₹${fmt(c.v.y * c.m.metrics.apc, 0)} cr — more than income! The ₹${fmt(-c.m.metrics.s, 0)} cr gap comes from past savings or borrowing: <b>dissaving</b>. APC = ${fmt(c.m.metrics.apc, 2)} — yes, APC can be greater than 1.`,
                    check: c => c.m.metrics.s < 0 && c.m.metrics.apc > 1
                },
                {
                    set: { y: 200 },
                    ask: {
                        q: { en: 'Income doubles to ₹200 cr. What happens to saving?', hi: 'आय दोगुनी होकर ₹200 cr हो जाती है। बचत का क्या होगा?' },
                        options: [
                            { en: 'Saving becomes exactly zero — the break-even point', hi: 'बचत ठीक शून्य हो जाती है — बराबरी बिंदु' },
                            { en: 'Still negative (dissaving)', hi: 'अब भी ऋणात्मक (अबचत)' },
                            { en: 'Positive saving begins', hi: 'धनात्मक बचत शुरू होती है' }
                        ],
                        correct: c => Math.abs(c.m.metrics.s) < 0.5 ? 0 : (c.m.metrics.s < 0 ? 1 : 2)
                    },
                    say: (c, hi) => hi
                        ? `₹${fmt(c.v.y, 0)} cr पर उपभोग ठीक आय के बराबर: C = Y, <b>S = 0</b>, <b>APC = ${fmt(c.m.metrics.apc, 2)}</b>। यह <b>बराबरी बिंदु</b> है — यहीं उपभोग रेखा 45° रेखा को काटती है और बचत रेखा X-अक्ष को।`
                        : `At ₹${fmt(c.v.y, 0)} cr, consumption exactly equals income: C = Y, <b>S = 0</b>, <b>APC = ${fmt(c.m.metrics.apc, 2)}</b>. This is the <b>break-even point</b> — where the consumption line cuts the 45° line and the saving line cuts the X-axis.`,
                    check: c => Math.abs(c.m.metrics.s) < 0.5 && Math.abs(c.m.metrics.apc - 1) < 0.005 && Math.abs(c.m.metrics.be - c.v.y) < 0.5
                },
                {
                    set: { y: 500 },
                    ask: {
                        q: { en: 'Income keeps rising, to ₹500 cr. What happens to APC?', hi: 'आय बढ़ती रहती है, ₹500 cr तक। APC का क्या होगा?' },
                        options: [
                            { en: 'It falls below 1 — and keeps falling', hi: 'यह 1 से नीचे गिरता है — और गिरता रहता है' },
                            { en: 'It stays at 1', hi: 'यह 1 पर ही रहता है' },
                            { en: 'It rises above 1', hi: 'यह 1 से ऊपर बढ़ता है' }
                        ],
                        correct: c => c.m.metrics.apc < c.prev.m.metrics.apc - 0.001 ? 0 : (c.m.metrics.apc > c.prev.m.metrics.apc + 0.001 ? 2 : 1)
                    },
                    say: (c, hi) => hi
                        ? `APC ${fmt(c.first.m.metrics.apc, 2)} → ${fmt(c.prev.m.metrics.apc, 2)} → <b>${fmt(c.m.metrics.apc, 2)}</b> गिरता गया, और अब ₹${fmt(c.m.metrics.s, 0)} cr की बचत है। पर फंदा देखिए: इस पूरे सफ़र में <b>MPC = ${fmt(c.v.mpc, 2)} एक बार भी नहीं बदला</b>। APC गिरता है, MPC स्थिर रहता है — परीक्षा में इन्हें मत मिलाइए। जाँच: APC + APS = ${fmt(c.m.metrics.apc + c.m.metrics.aps, 2)}।`
                        : `APC kept falling, ${fmt(c.first.m.metrics.apc, 2)} → ${fmt(c.prev.m.metrics.apc, 2)} → <b>${fmt(c.m.metrics.apc, 2)}</b>, and there is now ₹${fmt(c.m.metrics.s, 0)} cr of saving. But spot the trap: <b>MPC = ${fmt(c.v.mpc, 2)} never changed once</b> on this whole journey. APC falls while MPC stays constant — don't mix them up in the exam. Check: APC + APS = ${fmt(c.m.metrics.apc + c.m.metrics.aps, 2)}.`,
                    check: c => c.m.metrics.apc < c.prev.m.metrics.apc && c.m.metrics.apc < 1 && c.m.metrics.s > 0 && c.v.mpc === c.first.v.mpc && Math.abs(c.m.metrics.apc + c.m.metrics.aps - 1) < 1e-9
                },
                {
                    set: { y: 500, mpc: 0.9 },
                    ask: {
                        q: { en: 'A consumer boom: people now spend 90 paise of every extra rupee (MPC 0.7 → 0.9). What happens to the break-even income?', hi: 'उपभोक्ता उछाल: लोग अब हर अतिरिक्त रुपये में से 90 पैसे ख़र्च करते हैं (MPC 0.7 → 0.9)। बराबरी आय का क्या होगा?' },
                        options: [
                            { en: 'It moves to a higher income', hi: 'यह ऊँची आय पर खिसक जाती है' },
                            { en: 'It moves to a lower income', hi: 'यह कम आय पर खिसक जाती है' },
                            { en: 'It stays the same', hi: 'यह वही रहती है' }
                        ],
                        correct: c => c.m.metrics.be > c.prev.m.metrics.be + 0.5 ? 0 : (c.m.metrics.be < c.prev.m.metrics.be - 0.5 ? 1 : 2)
                    },
                    say: (c, hi) => hi
                        ? `बराबरी आय ₹${fmt(c.prev.m.metrics.be, 0)} cr से <b>₹${fmt(c.m.metrics.be, 0)} cr</b> पर चली गई — अब बचत शुरू होने के लिए कहीं ज़्यादा आय चाहिए। उसी ₹${fmt(c.v.y, 0)} cr पर बचत ₹${fmt(c.prev.m.metrics.s, 0)} cr से गिरकर ₹${fmt(c.m.metrics.s, 0)} cr हो गई — फिर से अबचत। ऊँचा MPC = छोटा MPS (${fmt(1 - c.v.mpc, 2)})।`
                        : `Break-even income jumped from ₹${fmt(c.prev.m.metrics.be, 0)} cr to <b>₹${fmt(c.m.metrics.be, 0)} cr</b> — saving now needs far more income to begin. At the same ₹${fmt(c.v.y, 0)} cr, saving fell from ₹${fmt(c.prev.m.metrics.s, 0)} cr to ₹${fmt(c.m.metrics.s, 0)} cr — dissaving again. Higher MPC = smaller MPS (${fmt(1 - c.v.mpc, 2)}).`,
                    check: c => c.m.metrics.be > c.prev.m.metrics.be && c.m.metrics.s < c.prev.m.metrics.s
                }
            ]
        }],
        model(v) {
            const C = y => v.cbar + v.mpc * y;
            const S = y => y - C(y);
            const be = v.cbar / (1 - v.mpc);
            const c = C(v.y), s = S(v.y);
            const apc = c / v.y, aps = s / v.y;

            const line = f => { const o = []; for (let y = 0; y <= 600; y += 20) { const val = f(y); if (val >= -100 && val <= 600) o.push([y, val]); } return o; };

            return {
                curves: [
                    { id: 'ref', label: '45° (C = Y)', color: '#1e1b3a', width: 2.2, dash: '4 4', pts: [[0, 0], [600, 600]], labelAt: 'end', labelDx: -58, labelDy: 16 },
                    { id: 'c', label: 'C = C̄ + bY', color: '#2563eb', width: 3.2, pts: line(C) },
                    { id: 's', label: 'S = −C̄ + (1−b)Y', color: '#16a34a', width: 3, pts: line(S) },
                    { id: 'zero', label: '', color: '#cbd5e1', width: 1.6, pts: [[0, 0], [600, 0]] }
                ],
                points: [
                    { id: 'be', x: be, y: be, label: 'Break-even (S = 0, APC = 1)', color: '#dc2626', xTick: `${fmt(be, 0)}`, yTick: `${fmt(be, 0)}` },
                    { id: 'c', x: v.y, y: c, label: 'C', color: '#2563eb', drop: false },
                    { id: 's', x: v.y, y: s, label: 'S', color: '#16a34a', drop: false }
                ],
                arrows: [{
                    from: [v.y, s], to: [v.y, c], color: s < 0 ? '#ea580c' : '#7c3aed', bend: 0, labelDy: -10,
                    label: s < 0 ? `Dissaving ₹${fmt(-s, 0)} cr` : `Saving ₹${fmt(s, 0)} cr`
                }],
                handles: [
                    { id: 'h-cbar', x: 20, y: C(20), bind: 'cbar', axis: 'y', color: '#2563eb', hint: 'Drag the C intercept up/down' },
                    { id: 'h-mpc', x: 520, y: C(520), bind: 'mpc', axis: 'y', k: 520, color: '#0891b2', hint: 'Drag the far end of C — changes MPC' },
                    { id: 'h-y', x: v.y, y: c, bind: 'y', axis: 'x', color: '#7c3aed', hint: 'Drag the income level left/right' }
                ],
                readings: [
                    { label: 'Income (Y)', value: `₹${fmt(v.y, 0)} cr` },
                    { label: 'Consumption (C)', value: `₹${fmt(c, 1)} cr` },
                    { label: 'Saving (S = Y − C)', value: `₹${fmt(s, 1)} cr` },
                    { label: 'APC = C/Y', value: fmt(apc, 3) },
                    { label: 'APS = S/Y', value: fmt(aps, 3) },
                    { label: 'APC + APS', value: `${fmt(apc + aps, 3)} ✔ = 1` },
                    { label: 'MPC (b)', value: fmt(v.mpc, 2) },
                    { label: 'MPS = 1 − MPC', value: fmt(1 - v.mpc, 2) },
                    { label: 'Break-even income', value: `₹${fmt(be, 0)} cr` },
                    { label: 'Multiplier k = 1/MPS', value: fmt(1 / (1 - v.mpc), 2) }
                ],
                verdict: {
                    kind: Math.abs(v.y - be) < 12 ? 'none' : (s < 0 ? 'shift' : 'movement'),
                    title: Math.abs(v.y - be) < 12
                        ? `At the <b>break-even point</b> — C = Y, so <b>S = 0</b> and <b>APC = 1</b>`
                        : s < 0
                            ? `Below break-even → <b>dissaving</b>: S = −₹${fmt(-s, 0)} cr and <b>APC = ${fmt(apc, 2)} &gt; 1</b>`
                            : `Above break-even → <b>saving</b>: S = ₹${fmt(s, 0)} cr and <b>APC = ${fmt(apc, 2)} &lt; 1</b>`,
                    detail: `${s < 0 ? `Income of ₹${fmt(v.y, 0)} cr is not enough to cover consumption of ₹${fmt(c, 1)} cr, so the gap of ₹${fmt(-s, 0)} cr is met out of <b>past savings or borrowing</b> — this is why the saving line lies <i>below</i> the X-axis here, and why APC can exceed 1 while MPC cannot.` : `Consumption of ₹${fmt(c, 1)} cr leaves ₹${fmt(s, 1)} cr saved. As income rises, APC keeps <b>falling</b> and APS keeps <b>rising</b>, but they always sum to exactly 1.`} MPC = ${fmt(v.mpc, 2)} means ${fmt(v.mpc * 100, 0)} paise of every extra rupee is spent and ${fmt((1 - v.mpc) * 100, 0)} paise saved — that leakage is what sets the multiplier at ${fmt(1 / (1 - v.mpc), 2)}. Note the C line and the S line always cross the 45° line and the X-axis <b>at the same income</b> — that is the break-even point at ₹${fmt(be, 0)} cr.`
                },
                metrics: { apc, aps, s, be, y: v.y }
            };
        }
    },
    practice: [
        { prompt: 'Drag income to the break-even point. What are S and APC there?', hint: 'S = 0 exactly, and APC = 1, because at break-even the whole income is consumed (C = Y).' },
        { prompt: 'Can APC be greater than 1? Can MPC be?', hint: 'APC yes — below break-even, consumption exceeds income through dissaving. MPC no — a household cannot spend more than the whole of an ADDITIONAL rupee.' },
        { prompt: 'Why do the C line and the S line cross their reference lines at the same income?', hint: 'S = Y − C by definition, so S = 0 exactly when C = Y — which is the point where C cuts the 45° line.' }
    ],
    challenge: {
        prompt: 'Find an income level where APC is between 0.85 and 0.9.',
        check: (s, m) => m.apc > 0.85 && m.apc < 0.9
    }
});

SIMS.push({
    id: 'gl-forex-determination',
    module: 'macro',
    title: 'Exchange Rate: Drag Demand & Supply of Forex',
    desc: 'Flexible exchange-rate determination — drag either curve and read appreciation, depreciation, and the effect on exports and imports.',
    class: 'XII', part: 'A', unit: 5, unitTitle: 'Balance of Payments', topicLabel: 'Exchange Rate Determination',
    syllabusIds: ['XII-A-U5-DETERMINATION', 'XII-A-U5-EXRATE'],
    mode: 'graphlab',
    concept: '<p>Under a <b>flexible (floating)</b> system the exchange rate is set where the <b>demand for foreign exchange</b> meets its <b>supply</b>.</p><p><b>Demand for forex</b> comes from imports, foreign travel, sending gifts/remittances abroad, and investing abroad — it slopes <b>downward</b>: a dearer dollar makes imports costlier, so less forex is demanded.</p><p><b>Supply of forex</b> comes from exports, foreign tourists, remittances received, and foreign investment coming in — it slopes <b>upward</b>: a dearer dollar makes Indian goods cheaper to foreigners, so more forex flows in.</p><p><b>Depreciation</b> = the rupee falls (₹/$ rises) under market forces. <b>Devaluation</b> is the same direction but done deliberately by the government under a fixed system — an exam distinction worth a mark.</p>',
    formulas: [
        'Equilibrium: Demand for forex = Supply of forex',
        '₹/$ rises  ⇒ rupee DEPRECIATES (each $ costs more ₹)',
        '₹/$ falls  ⇒ rupee APPRECIATES',
        'Depreciation ⇒ exports cheaper abroad ⇒ exports ↑, imports ↓',
        'Appreciation ⇒ imports cheaper ⇒ imports ↑, exports ↓',
        'Depreciation/appreciation = market-driven; devaluation/revaluation = government-decided'
    ],
    graphLab: {
        groupLabels: { price: 'The rate you set', other: 'What shifts forex demand and supply' },
        x: { label: 'Quantity of Foreign Exchange (US $ million) →', min: 0, max: 100 },
        y: { label: 'Exchange Rate (₹ per US $) →', min: 40, max: 120 },
        vars: [
            { id: 'demandShift', label: 'Demand for forex (imports, travel, investing abroad)', min: -25, max: 25, step: 1, value: 0, signed: true },
            { id: 'supplyShift', label: 'Supply of forex (exports, FDI/FII inflow, remittances)', min: -25, max: 25, step: 1, value: 0, signed: true },
            { id: 'rate', label: 'Rate set by you (₹ per $)', min: 45, max: 115, step: 1, value: 80, unit: '₹', group: 'price', hint: 'Off equilibrium this creates a surplus or shortage of forex' }
        ],
        scenarios: [
            { label: 'Imports surge', note: 'Rupee depreciates', set: { demandShift: 18 } },
            { label: 'Exports boom', note: 'Rupee appreciates', set: { supplyShift: 18 } },
            { label: 'FII money flows out', note: 'Rupee depreciates', set: { supplyShift: -18 } },
            { label: 'Remittances rise', note: 'Rupee appreciates', set: { supplyShift: 14 } }
        ],
        stories: [{
            id: 'study-abroad',
            title: { en: "Aarav's US college fees — is the rupee stronger or weaker?", hi: 'आरव की अमेरिकी कॉलेज फ़ीस — रुपया मज़बूत हुआ या कमज़ोर?' },
            intro: {
                en: "Aarav's family must pay $10,000 in college fees. Foreign investors pull money out, then exports boom. Predict each move of the ₹/$ rate — and catch the trap that a BIGGER number means a WEAKER rupee.",
                hi: 'आरव के परिवार को $10,000 कॉलेज फ़ीस भरनी है। विदेशी निवेशक पैसा निकालते हैं, फिर निर्यात में उछाल आता है। ₹/$ दर की हर चाल का अनुमान लगाइए — और उस फंदे को पकड़िए कि बड़ी संख्या का मतलब कमज़ोर रुपया है।'
            },
            outro: {
                en: 'More ₹ per $ = rupee DEPRECIATES (weaker); fewer ₹ per $ = rupee APPRECIATES (stronger). Forex supply: exports, FDI/FII inflows, remittances. Forex demand: imports, travel and study abroad, investing abroad.',
                hi: 'प्रति $ ज़्यादा ₹ = रुपये का मूल्यह्रास (कमज़ोर); प्रति $ कम ₹ = रुपये का मूल्यवृद्धि (मज़बूत)। विदेशी मुद्रा की आपूर्ति: निर्यात, FDI/FII प्रवाह, प्रेषण। माँग: आयात, विदेश यात्रा और पढ़ाई, विदेश में निवेश।'
            },
            steps: [
                {
                    set: { rate: 80 },
                    say: (c, hi) => hi
                        ? `विदेशी मुद्रा बाज़ार संतुलन में है: ₹${fmt(c.m.metrics.rate, 0)} प्रति $। आरव की $10,000 फ़ीस = ₹${glINR(c.m.metrics.rate * 10000)}।`
                        : `The forex market clears at ₹${fmt(c.m.metrics.rate, 0)} per $. Aarav's $10,000 fees cost ₹${glINR(c.m.metrics.rate * 10000)}.`,
                    check: c => c.m.verdict.kind === 'none' && Math.abs(c.m.metrics.gap) < 0.6
                },
                {
                    set: { rate: 80, supplyShift: -15 },
                    ask: {
                        q: { en: 'Foreign investors (FIIs) pull their money out of Indian shares. Which curve moves, and which way?', hi: 'विदेशी निवेशक (FII) भारतीय शेयरों से अपना पैसा निकाल लेते हैं। कौन-सा curve खिसकेगा, और किस ओर?' },
                        options: [
                            { en: 'Forex demand (D) shifts right', hi: 'विदेशी मुद्रा की माँग (D) दाईं ओर' },
                            { en: 'Forex demand (D) shifts left', hi: 'विदेशी मुद्रा की माँग (D) बाईं ओर' },
                            { en: 'Forex supply (S) shifts right', hi: 'विदेशी मुद्रा की आपूर्ति (S) दाईं ओर' },
                            { en: 'Forex supply (S) shifts left', hi: 'विदेशी मुद्रा की आपूर्ति (S) बाईं ओर' }
                        ],
                        correct: c => {
                            const d = c.v.demandShift, s = c.v.supplyShift;
                            return Math.abs(s) > Math.abs(d) ? (s > 0 ? 2 : 3) : (d > 0 ? 0 : 1);
                        }
                    },
                    say: (c, hi) => hi
                        ? `डॉलर देश में <b>आना</b> बंद हुए — विदेशी मुद्रा की <b>आपूर्ति</b> घटी, S बाईं ओर खिसका। पुरानी दर ₹${fmt(c.v.rate, 0)} पर अब $${fmt(c.m.metrics.gap, 0)}m डॉलर की <b>कमी</b> है: ख़रीदार ज़्यादा, डॉलर कम।`
                        : `Dollars stopped <b>coming in</b> — the <b>supply</b> of forex fell, and S shifted left. At the old rate of ₹${fmt(c.v.rate, 0)} there is now a <b>shortage</b> of $${fmt(c.m.metrics.gap, 0)}m: more buyers than dollars.`,
                    check: c => c.v.supplyShift < 0 && c.v.demandShift === 0 && c.m.metrics.gap > 0
                },
                {
                    set: { rate: 86, supplyShift: -15 },
                    ask: {
                        q: { en: 'The shortage pushes the rate from ₹80 to ₹86 per $. Has the rupee become stronger or weaker?', hi: 'कमी के कारण दर ₹80 से ₹86 प्रति $ हो जाती है। रुपया मज़बूत हुआ या कमज़ोर?' },
                        options: [
                            { en: 'Weaker — it depreciated (more ₹ needed for each $)', hi: 'कमज़ोर — मूल्यह्रास (हर $ के लिए ज़्यादा ₹)' },
                            { en: 'Stronger — it appreciated (the number went up)', hi: 'मज़बूत — मूल्यवृद्धि (संख्या बढ़ गई)' },
                            { en: 'No change', hi: 'कोई बदलाव नहीं' }
                        ],
                        correct: c => c.m.metrics.dRate > 0.4 ? 0 : (c.m.metrics.dRate < -0.4 ? 1 : 2)
                    },
                    say: (c, hi) => hi
                        ? `संख्या <i>बढ़ी</i>, पर रुपया <b>कमज़ोर</b> हुआ — अब हर डॉलर के लिए ₹${fmt(c.m.metrics.rate, 0)} चाहिए: <b>मूल्यह्रास</b>। आरव की वही $10,000 फ़ीस अब ₹${glINR(c.m.metrics.rate * 10000)} की है — ₹${glINR(c.m.metrics.dRate * 10000)} ज़्यादा, बिना किसी के कुछ बदले।`
                        : `The number went <i>up</i>, but the rupee got <b>weaker</b> — each dollar now takes ₹${fmt(c.m.metrics.rate, 0)}: <b>depreciation</b>. Aarav's same $10,000 fees now cost ₹${glINR(c.m.metrics.rate * 10000)} — ₹${glINR(c.m.metrics.dRate * 10000)} more, though nothing about the college changed.`,
                    check: c => c.m.metrics.dRate > 0.4 && Math.abs(c.m.metrics.gap) < 0.6 && Math.abs(c.v.rate - c.m.metrics.rate) < 0.5
                },
                {
                    set: { rate: 74, supplyShift: 15 },
                    ask: {
                        q: { en: 'Next year Indian software exports boom and dollars pour in. What happens to the rupee?', hi: 'अगले साल भारतीय सॉफ़्टवेयर निर्यात में उछाल आता है और डॉलर बरसते हैं। रुपये का क्या होगा?' },
                        options: [
                            { en: 'It appreciates — fewer ₹ per $', hi: 'मूल्यवृद्धि — प्रति $ कम ₹' },
                            { en: 'It depreciates — more ₹ per $', hi: 'मूल्यह्रास — प्रति $ ज़्यादा ₹' },
                            { en: 'No change', hi: 'कोई बदलाव नहीं' }
                        ],
                        correct: c => c.m.metrics.dRate < -0.4 ? 0 : (c.m.metrics.dRate > 0.4 ? 1 : 2)
                    },
                    say: (c, hi) => hi
                        ? `निर्यात से विदेशी मुद्रा की <b>आपूर्ति</b> बढ़ी — S दाईं ओर खिसका, दर ₹${fmt(c.m.metrics.rate, 0)} प्रति $ पर आ गई: रुपये की <b>मूल्यवृद्धि</b>। अब आरव की फ़ीस ₹${glINR(c.m.metrics.rate * 10000)} — पिछले साल से ₹${glINR((c.prev.m.metrics.rate - c.m.metrics.rate) * 10000)} कम।`
                        : `Exports raised the <b>supply</b> of forex — S shifted right and the rate fell to ₹${fmt(c.m.metrics.rate, 0)} per $: the rupee <b>appreciated</b>. Aarav's fees now cost ₹${glINR(c.m.metrics.rate * 10000)} — ₹${glINR((c.prev.m.metrics.rate - c.m.metrics.rate) * 10000)} less than last year.`,
                    check: c => c.v.supplyShift > 0 && c.m.metrics.dRate < -0.4 && Math.abs(c.m.metrics.gap) < 0.6 && c.m.metrics.rate < c.prev.m.metrics.rate
                }
            ]
        }],
        model(v) {
            const b = 0.8, d = 0.8;
            const a = 120 + v.demandShift * b;   // Demand: R = a − b·Q
            const c = 40 - v.supplyShift * d;    // Supply: R = c + d·Q
            const eq = lineIntersect(a, b, c, d);
            const eq0 = lineIntersect(120, b, 40, d);

            const qd = Math.max(0, (a - v.rate) / b);
            const qs = Math.max(0, (v.rate - c) / d);
            const gap = qd - qs;

            const dMoved = v.demandShift !== 0, sMoved = v.supplyShift !== 0;
            const moved = dMoved || sMoved;
            const dRate = eq.P - eq0.P;

            const curves = [];
            if (glShowGhost && dMoved) curves.push({ id: 'd0', label: 'D', color: '#94a3b8', width: 2.2, dash: '7 5', pts: glLineSeg(120, -b, 0, 100, 40, 120) });
            if (glShowGhost && sMoved) curves.push({ id: 's0', label: 'S', color: '#94a3b8', width: 2.2, dash: '7 5', pts: glLineSeg(40, d, 0, 100, 40, 120) });
            curves.push({ id: 'd', label: dMoved ? 'D₁ (forex demand)' : 'D (forex demand)', color: '#2563eb', width: 3.2, pts: glLineSeg(a, -b, 0, 100, 40, 120) });
            curves.push({ id: 's', label: sMoved ? 'S₁ (forex supply)' : 'S (forex supply)', color: '#16a34a', width: 3.2, pts: glLineSeg(c, d, 0, 100, 40, 120) });

            const points = [{ id: 'eq', x: eq.Q, y: eq.P, label: moved ? 'E₁' : 'E', color: '#7c3aed', xTick: `$${fmt(eq.Q, 0)}m`, yTick: `₹${fmt(eq.P, 1)}` }];
            if (moved) points.push({ id: 'eq0', x: eq0.Q, y: eq0.P, label: 'E', color: '#64748b', xTick: `$${fmt(eq0.Q, 0)}m`, yTick: `₹${fmt(eq0.P, 1)}` });

            const arrows = [];
            if (Math.abs(gap) > 0.6) {
                arrows.push({
                    from: [Math.min(qd, qs), v.rate], to: [Math.max(qd, qs), v.rate],
                    color: gap > 0 ? '#dc2626' : '#ea580c', bend: 0, labelDy: -12,
                    label: gap > 0 ? `Shortage of forex $${fmt(gap, 0)}m → ₹/$ rises` : `Surplus of forex $${fmt(-gap, 0)}m → ₹/$ falls`
                });
            }

            const dep = dRate > 0.4, app = dRate < -0.4;
            return {
                curves, points, arrows,
                handles: [
                    { id: 'h-rate', x: Math.max(qd, qs), y: v.rate, bind: 'rate', axis: 'y', color: '#7c3aed', hint: 'Drag the exchange rate up/down' },
                    { id: 'h-d', x: (a - 105) / b, y: 105, bind: 'demandShift', axis: 'x', k: b, color: '#2563eb', hint: 'Drag the forex DEMAND curve' },
                    { id: 'h-s', x: (108 - c) / d, y: 108, bind: 'supplyShift', axis: 'x', k: d, color: '#16a34a', hint: 'Drag the forex SUPPLY curve' }
                ],
                readings: [
                    { label: 'Equilibrium exchange rate', value: `₹${fmt(eq.P, 2)} per $` },
                    { label: 'Was', value: `₹${fmt(eq0.P, 2)} per $` },
                    { label: 'Equilibrium forex traded', value: `$${fmt(eq.Q, 1)} million` },
                    { label: 'Rate you set', value: `₹${fmt(v.rate, 0)} per $` },
                    { label: 'Forex demanded there', value: `$${fmt(qd, 1)}m` },
                    { label: 'Forex supplied there', value: `$${fmt(qs, 1)}m` },
                    { label: gap > 0 ? 'Shortage of forex' : gap < 0 ? 'Surplus of forex' : 'Market clears', value: Math.abs(gap) < 0.05 ? '✔ D = S' : `$${fmt(Math.abs(gap), 1)}m` },
                    { label: 'Rupee', value: dep ? `⬇ Depreciated by ₹${fmt(dRate, 2)}` : app ? `⬆ Appreciated by ₹${fmt(-dRate, 2)}` : '— unchanged' }
                ],
                verdict: {
                    kind: moved ? 'shift' : (Math.abs(gap) > 0.6 ? 'movement' : 'none'),
                    title: dep
                        ? `Rupee <b>DEPRECIATES</b>: ₹${fmt(eq0.P, 1)} → ₹${fmt(eq.P, 1)} per $`
                        : app
                            ? `Rupee <b>APPRECIATES</b>: ₹${fmt(eq0.P, 1)} → ₹${fmt(eq.P, 1)} per $`
                            : Math.abs(gap) > 0.6
                                ? (gap > 0 ? 'Rate below equilibrium → <b>shortage of forex</b>, ₹/$ is pushed up' : 'Rate above equilibrium → <b>surplus of forex</b>, ₹/$ is pushed down')
                                : 'Foreign-exchange market is in <b>equilibrium</b>',
                    detail: dep
                        ? `${dMoved && v.demandShift > 0 ? 'More forex is demanded at every rate (imports, travel or investment abroad rose), so the D curve shifted <b>right</b>. ' : ''}${sMoved && v.supplyShift < 0 ? 'Less forex is supplied at every rate (exports fell or foreign investment left), so the S curve shifted <b>left</b>. ' : ''}Each dollar now costs more rupees. Consequence: Indian <b>exports become cheaper</b> for foreigners so exports rise, while <b>imports become dearer</b> so imports fall — which is why depreciation tends to improve the trade balance. This is depreciation, <b>not devaluation</b>: it came from market forces, not a government decision.`
                        : app
                            ? `${sMoved && v.supplyShift > 0 ? 'More forex is supplied at every rate (exports, remittances or foreign investment rose), so the S curve shifted <b>right</b>. ' : ''}${dMoved && v.demandShift < 0 ? 'Less forex is demanded at every rate, so the D curve shifted <b>left</b>. ' : ''}Each dollar now costs fewer rupees. Consequence: <b>imports become cheaper</b> so imports rise, while Indian <b>exports become dearer</b> abroad so exports fall.`
                            : Math.abs(gap) > 0.6
                                ? `At ₹${fmt(v.rate, 0)} per $, forex demanded is $${fmt(qd, 1)}m against supply of $${fmt(qs, 1)}m. ${gap > 0 ? 'Buyers of forex outbid each other, driving ₹/$ <b>up</b> toward ₹' + fmt(eq.P, 1) + ' — the rupee depreciates until the market clears.' : 'Unsold forex forces the rate <b>down</b> toward ₹' + fmt(eq.P, 1) + ' — the rupee appreciates until the market clears.'}`
                                : `Demand for and supply of foreign exchange are equal at ₹${fmt(eq.P, 1)} per $, with $${fmt(eq.Q, 1)}m traded. Drag either curve to see the rate move, or set an off-equilibrium rate to create a shortage or surplus.`
                },
                metrics: { rate: eq.P, dRate, gap, traded: eq.Q }
            };
        }
    },
    practice: [
        { prompt: 'Indian software exports boom. Which curve shifts, and what happens to the rupee?', hint: 'Exports bring dollars IN, so the SUPPLY of forex shifts right. ₹/$ falls — the rupee appreciates.' },
        { prompt: 'Distinguish depreciation from devaluation.', hint: 'Both mean the domestic currency loses value. Depreciation happens through market forces under a flexible system; devaluation is a deliberate government decision under a fixed system.' },
        { prompt: 'Why does the demand curve for foreign exchange slope downward?', hint: 'A dearer dollar makes imports and foreign travel costlier in rupee terms, so residents demand less foreign exchange.' },
        { prompt: 'How does depreciation affect the trade balance?', hint: 'Exports become cheaper for foreigners (exports rise) and imports become dearer at home (imports fall), so the trade balance tends to improve.' }
    ],
    challenge: {
        prompt: 'Make the rupee appreciate to about ₹72 per dollar or better.',
        check: (s, m) => m.rate <= 73
    }
});
