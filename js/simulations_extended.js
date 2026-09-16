// Extends the base SIMS array (js/simulations.js) with the remaining
// legacy labs, retrofitted with 2026-27 class/part/unit metadata. See
// CLAUDE.md and js/simulations.js's header comment for the data contract.

if (typeof SIMS !== 'undefined') {
    SIMS.push(
        // ── MICROECONOMICS (Class XI, Part B) ──────────────────────
        {
            id: 'micro-consumer-equilibrium',
            module: 'micro',
            title: 'Consumer Equilibrium (Marginal Utility)',
            desc: 'See how diminishing marginal utility, price, and money income together determine equilibrium — single-good (MU=0) and the two-good Law of Equi-Marginal Utility (MUx/Px = MUy/Py).',
            class: 'XI', part: 'B', unit: 5, unitTitle: "Consumer's Equilibrium and Demand", topicLabel: 'Marginal Utility Analysis',
            syllabusIds: ['XI-B-U5-UTILITY'],
            mode: 'simulator',
            concept: '<p>The Law of Diminishing Marginal Utility states that as a consumer consumes more units of a good, the additional (marginal) utility from each extra unit falls. With only <b>one good</b> and free disposal, a rational consumer keeps consuming until <b>MU = 0</b> — the <b>Single Good</b> view below.</p><p>But a real consumer splits a <b>fixed money income</b> across <b>two (or more) goods</b>. The actual equilibrium condition — the <b>Law of Equi-Marginal Utility</b> — is reached when the last rupee spent on every good buys the same Marginal Utility: <b>MUx/Px = MUy/Py</b>. If MUx/Px is higher, the consumer is better off shifting a rupee from Y to X (and vice versa) — switch to the <b>Two Goods (Equi-Marginal)</b> view to move your budget between X and Y and watch the two MU/Rupee curves cross exactly at that equilibrium.</p>',
            formulas: ['Single good: MU = ΔTU / ΔQ; TU = Σ MU; consumer stops at MU = 0',
                'Two goods: Budget constraint Px·Qx + Py·Qy = M',
                'Equi-Marginal condition: MUx / Px = MUy / Py'],
            controls: [
                { id: 'view', label: 'View', type: 'select', options: [
                    { value: 'single', label: 'Single Good (MU = 0)' },
                    { value: 'twogood', label: 'Two Goods (Equi-Marginal)' }
                ], value: 'single' },
                { id: 'q', label: 'Units Consumed (Q)', min: 0, max: 20, step: 1, value: 5, unit: '', showWhen: { id: 'view', equals: 'single' } },
                { id: 'price', label: 'Price per Unit (₹)', min: 2, max: 20, step: 1, value: 5, unit: '', showWhen: { id: 'view', equals: 'single' } },
                { id: 'income', label: 'Money Income (M, ₹)', min: 20, max: 100, step: 10, value: 60, unit: '', showWhen: { id: 'view', equals: 'twogood' } },
                { id: 'px', label: 'Price of X (₹)', min: 5, max: 20, step: 1, value: 5, unit: '', showWhen: { id: 'view', equals: 'twogood' } },
                { id: 'py', label: 'Price of Y (₹)', min: 5, max: 20, step: 1, value: 5, unit: '', showWhen: { id: 'view', equals: 'twogood' } },
                { id: 'shareX', label: 'Budget Spent on X (%)', min: 0, max: 100, step: 5, value: 50, unit: '%', showWhen: { id: 'view', equals: 'twogood' } }
            ],
            compute(v) {
                const a = 20, b = 1;
                if (v.view === 'twogood') {
                    const M = v.income, Px = v.px, Py = v.py;
                    const qxMax = M / Px;
                    const Qx = (v.shareX / 100) * qxMax;
                    const Qy = Math.max((M - Px * Qx) / Py, 0);
                    const MUx = a - b * Qx, MUy = a - b * Qy;
                    const muxPerRupee = MUx / Px, muyPerRupee = MUy / Py;
                    const diff = muxPerRupee - muyPerRupee;

                    // Sweep the whole feasible Qx range to draw both MU/Rupee curves
                    // and to locate the equi-marginal crossing by grid search — a
                    // closed-form solve would be one more place to get the algebra
                    // wrong; a fine grid search over the actual model is guaranteed
                    // consistent with what the chart itself shows.
                    const N = 200;
                    const qxs = range(N + 1).map(i => (i / N) * qxMax);
                    const muxSeries = qxs.map(qx => (a - b * qx) / Px);
                    const muySeries = qxs.map(qx => (a - b * Math.max((M - Px * qx) / Py, 0)) / Py);
                    let bestQx = 0, bestGap = Infinity;
                    qxs.forEach((qx, i) => {
                        const gap = Math.abs(muxSeries[i] - muySeries[i]);
                        if (gap < bestGap) { bestGap = gap; bestQx = qx; }
                    });
                    const bestQy = Math.max((M - Px * bestQx) / Py, 0);
                    const bestMuPerRupee = (a - b * bestQx) / Px;

                    const TU = (a * Qx - (b * Qx * Qx) / 2) + (a * Qy - (b * Qy * Qy) / 2);
                    const verdict = Math.abs(diff) < 0.4
                        ? '✔ At (or very near) equilibrium — MUx/Px ≈ MUy/Py'
                        : diff > 0 ? '→ MUx/Px is higher: shift budget from Y to X'
                            : '→ MUy/Py is higher: shift budget from X to Y';

                    return {
                        traces: [
                            { x: qxs, y: muxSeries, mode: 'lines', name: 'MUx / Px', line: { color: '#2563eb', width: 3 } },
                            { x: qxs, y: muySeries, mode: 'lines', name: 'MUy / Py', line: { color: '#f59e0b', width: 3 } },
                            { x: [bestQx], y: [bestMuPerRupee], mode: 'markers', name: 'Equi-Marginal Equilibrium', marker: { color: '#10b981', size: 13, symbol: 'star' } },
                            { x: [Qx], y: [muxPerRupee], mode: 'markers', name: 'Your MUx/Px', marker: { color: '#2563eb', size: 10 } },
                            { x: [Qx], y: [muyPerRupee], mode: 'markers', name: 'Your MUy/Py', marker: { color: '#f59e0b', size: 10 } }
                        ],
                        layout: { xaxis: { title: 'Units of X purchased (Qx)', range: [0, qxMax] }, yaxis: { title: 'Marginal Utility per Rupee' } },
                        metrics: { Qx, Qy, muxPerRupee, muyPerRupee, diff, bestQx, bestQy, TU },
                        readings: `<div class="reading-row"><span>Your bundle</span><b>Qx = ${fmt(Qx, 1)}, Qy = ${fmt(Qy, 1)}</b></div>
                                   <div class="reading-row"><span>MUx / Px</span><b>${fmt(muxPerRupee)}</b></div>
                                   <div class="reading-row"><span>MUy / Py</span><b>${fmt(muyPerRupee)}</b></div>
                                   <div class="reading-row"><span>Equi-Marginal Bundle</span><b>Qx = ${fmt(bestQx, 1)}, Qy = ${fmt(bestQy, 1)}</b></div>
                                   <div class="reading-row"><span>Total Utility (your bundle)</span><b>${fmt(TU)}</b></div>
                                   <div class="reading-row insight-row">💡 ${verdict}. Both goods together always spend the full ₹${M} income (Px·Qx + Py·Qy = M) — the question is only how to SPLIT it. The consumer maximizes total satisfaction exactly where the two MU-per-Rupee curves cross, because moving even ₹1 away from that split takes a rupee from the good giving MORE utility per rupee and gives it to the one giving less.</div>`
                    };
                }
                const Q = v.q, P = v.price;
                const qs = range(21);
                const mus = qs.map(q => a - b * q);
                const MU = a - b * Q;
                const TU = a * Q - (b * Q * Q) / 2;
                const muPerRupee = MU / P;
                return {
                    traces: [
                        { x: qs, y: mus, mode: 'lines', name: 'Marginal Utility', line: { color: '#2563eb', width: 3 } },
                        { x: [Q], y: [MU], mode: 'markers', name: 'Current MU', marker: { color: '#ef4444', size: 10 } },
                        { x: qs, y: qs.map(() => 0), mode: 'lines', name: 'Zero Utility', line: { color: '#9ca3af', dash: 'dot' } }
                    ],
                    layout: { xaxis: { title: 'Units Consumed (Q)' }, yaxis: { title: 'Utility (Utils)', range: [-5, 22] } },
                    metrics: { MU, muPerRupee, TU },
                    readings: `<div class="reading-row"><span>Marginal Utility at Q</span><b>${fmt(MU)}</b></div>
                               <div class="reading-row"><span>MU per Rupee (MU/P)</span><b>${fmt(muPerRupee)}</b></div>
                               <div class="reading-row"><span>Total Utility</span><b>${fmt(TU)}</b></div>
                               <div class="reading-row insight-row">💡 ${MU > 0 ? 'MU is still positive — one more unit would add to Total Utility, so a rational consumer keeps consuming.' : MU < 0 ? 'MU has turned negative — the consumer has over-consumed past the point of maximum satisfaction.' : 'MU = 0 — this is the single-good equilibrium (maximum Total Utility).'} With multiple goods, the consumer instead compares MU/P across goods and buys more of whichever gives more satisfaction per rupee — at ₹${P}/unit, this good currently gives ${fmt(muPerRupee)} utils per rupee. Switch to the "Two Goods" view above to see that comparison directly.</div>`
                };
            },
            practice: [
                { prompt: 'Increase Q from 0 to 20. At what point does MU hit zero?', hint: 'MU = 20 − Q, so MU = 0 exactly at Q = 20 — the single-good satiation point.' },
                { prompt: 'Keep Q = 10. Raise the price from ₹2 to ₹20 — what happens to MU per Rupee?', hint: 'MU stays fixed at Q=10 (MU=10), but MU/P = 10/P falls as price rises — the same satisfaction costs more per rupee.' },
                { prompt: 'Switch to Two Goods. Set Px = Py, then move the Budget slider. At what share is the consumer in equilibrium?', hint: 'Exactly 50% — with identical prices and identical MU curves, the two goods are symmetric, so an equal split is the only point where MUx/Px = MUy/Py.' },
                { prompt: 'Now make Y more expensive than X (raise Py). Does the equilibrium share of budget on X rise or fall?', hint: 'It rises — a dearer Y means Y\'s Marginal Utility per Rupee is lower at any given physical split, so the consumer rationally shifts more of the budget toward the now-relatively-cheaper X.' }
            ],
            challenge: {
                prompt: 'In the Two Goods view, get within 0.3 of the Equi-Marginal Equilibrium share using the Budget slider.',
                check(state, metrics) {
                    if (state.view !== 'twogood' || !metrics || metrics.bestQx === undefined) return false;
                    return Math.abs(metrics.Qx - metrics.bestQx) < 0.3;
                }
            }
        },
        {
            id: 'micro-producer-costs',
            module: 'micro',
            title: 'Producer Behaviour: Product & Cost Curves',
            desc: 'Explore Total/Average/Marginal Product (Returns to a Factor) and Average/Marginal Cost curves.',
            class: 'XI', part: 'B', unit: 6, unitTitle: 'Producer Behaviour and Supply', topicLabel: 'Returns to a Factor & Cost Curves',
            syllabusIds: ['XI-B-U6-PRODUCTION', 'XI-B-U6-COST'],
            mode: 'simulator',
            concept: '<p>Switch between two related views. <b>Product</b> shows the Law of Variable Proportions: as one variable factor (labour) increases with other factors fixed, Marginal Product rises (Stage I), then falls while still positive (Stage II), then turns negative (Stage III). <b>Cost</b> shows the mirror-image relationship: Average Cost (AC) falls then rises, and Marginal Cost (MC) cuts AC exactly at its minimum.</p>',
            formulas: ['TC = FC + VC', 'AC = TC / Q', 'MC = ΔTC / ΔQ'],
            controls: [
                {
                    id: 'view', label: 'View', type: 'select', value: 'costs',
                    options: [
                        { value: 'costs', label: 'Cost Curves (AC, MC)' },
                        { value: 'product', label: 'Product Curves (TP, AP, MP)' }
                    ]
                },
                { id: 'q', label: 'Output Level (Q)', min: 1, max: 30, step: 1, value: 10, unit: '', showWhen: { id: 'view', equals: 'costs' } },
                { id: 'fc', label: 'Fixed Cost (₹)', min: 20, max: 200, step: 10, value: 100, unit: '', showWhen: { id: 'view', equals: 'costs' } },
                { id: 'labor', label: 'Labour Units (L)', min: 1, max: 24, step: 1, value: 10, unit: '', showWhen: { id: 'view', equals: 'product' } }
            ],
            compute(v) {
                if (v.view === 'product') {
                    const L = v.labor;
                    const Ls = range(24).map(i => i + 1);
                    const tp = l => 30 * l * l - l * l * l;
                    const ap = l => 30 * l - l * l;
                    const mp = l => 60 * l - 3 * l * l;
                    const TP = tp(L), AP = ap(L), MP = mp(L);
                    const stage = MP > AP ? 'Stage I: Increasing Returns' : MP >= 0 ? 'Stage II: Diminishing Returns' : 'Stage III: Negative Returns';
                    const stageNote = MP > AP
                        ? 'Each extra worker adds more than the average — MP is still pulling AP up.'
                        : MP >= 0
                            ? 'Each extra worker adds less than before (and less than the average) — this is the normal, rational stage of production.'
                            : 'Too much labour is now crowded onto fixed factors — an extra worker actually reduces Total Product.';
                    // Stage boundaries are exact algebraic roots of THIS production
                    // function (30l² − l³), not eyeballed off the chart: AP is
                    // maximised, and MP crosses it, at L=15 (solving MP=AP); MP
                    // itself hits zero — the Stage II/III boundary — at L=20
                    // (solving MP=0). Marking both is what makes "three stages"
                    // an actual, visible fact on the diagram instead of a claim
                    // only the readings-panel text makes.
                    const lStar1 = 15, lStar2 = 20;
                    const apAtStar1 = ap(lStar1);
                    return {
                        traces: [
                            { x: Ls, y: Ls.map(ap), mode: 'lines', name: 'Average Product (AP)', line: { color: '#2563eb', width: 3 } },
                            { x: Ls, y: Ls.map(mp), mode: 'lines', name: 'Marginal Product (MP)', line: { color: '#f59e0b', width: 3 } },
                            { x: Ls, y: Ls.map(() => 0), mode: 'lines', name: 'Zero', line: { color: '#9ca3af', dash: 'dot' } },
                            { x: [lStar1, lStar1], y: [-60, 260], mode: 'lines', name: 'Stage I / II boundary (MP = AP, AP max)', line: { color: '#94a3b8', width: 1, dash: 'dash' } },
                            { x: [lStar2, lStar2], y: [-60, 260], mode: 'lines', name: 'Stage II / III boundary (MP = 0)', line: { color: '#94a3b8', width: 1, dash: 'dash' } },
                            { x: [lStar1], y: [apAtStar1], mode: 'markers', name: 'MP = AP (AP at its maximum)', marker: { color: '#10b981', size: 12, symbol: 'star' } },
                            { x: [L], y: [AP], mode: 'markers', name: 'AP at L', marker: { color: '#2563eb', size: 9 } },
                            { x: [L], y: [MP], mode: 'markers', name: 'MP at L', marker: { color: '#f59e0b', size: 9 } }
                        ],
                        layout: {
                            xaxis: { title: 'Labour Units (L)' }, yaxis: { title: 'Product (units)', range: [-60, 260] },
                            annotations: [
                                { x: lStar1, y: 245, showarrow: false, text: 'Stage I | Stage II', font: { color: '#64748b', size: 11 } },
                                { x: lStar2, y: 245, showarrow: false, text: 'Stage II | Stage III', font: { color: '#64748b', size: 11 } }
                            ]
                        },
                        formulas: ['TP = f(L), other factors fixed', 'AP = TP / L', 'MP = ΔTP / ΔL', 'Law of Variable Proportions: MP rises, then falls, then turns negative', 'MP crosses AP exactly at AP\'s maximum — never before, never after'],
                        metrics: { TP, AP, MP, view: 'product' },
                        readings: `<div class="reading-row"><span>Total Product (TP)</span><b>${fmt(TP, 0)}</b></div>
                                   <div class="reading-row"><span>Average Product (AP)</span><b>${fmt(AP)}</b></div>
                                   <div class="reading-row"><span>Marginal Product (MP)</span><b>${fmt(MP)}</b></div>
                                   <div class="reading-row"><span>Stage</span><b>${stage}</b></div>
                                   <div class="reading-row insight-row">💡 ${stageNote}</div>`
                    };
                }
                const a = v.fc, b = 5, c = 0.3, Q = v.q;
                const qs = range(30).map(i => i + 1);
                const acs = qs.map(q => a / q + b + c * q);
                const mcs = qs.map(q => b + 2 * c * q);
                const AC = a / Q + b + c * Q, MC = b + 2 * c * Q;
                // The AC-minimum / MC=AC crossing is an exact algebraic result for
                // this cost function (AC' = 0 at Q* = sqrt(a/c)), not eyeballed —
                // marking it is the single most exam-tested fact about these two
                // curves ("MC cuts AC at AC's minimum"), so it belongs ON the
                // chart, not only inferred from the Falling/Rising reading.
                const qStar = Math.sqrt(a / c);
                const acStar = a / qStar + b + c * qStar;
                return {
                    traces: [
                        { x: qs, y: acs, mode: 'lines', name: 'Average Cost (AC)', line: { color: '#2563eb', width: 3 } },
                        { x: qs, y: mcs, mode: 'lines', name: 'Marginal Cost (MC)', line: { color: '#f59e0b', width: 3 } },
                        { x: [qStar], y: [acStar], mode: 'markers', name: 'MC = AC (Minimum Average Cost)', marker: { color: '#10b981', size: 13, symbol: 'star' } },
                        { x: [Q], y: [AC], mode: 'markers', name: 'AC at Q', marker: { color: '#2563eb', size: 9 } },
                        { x: [Q], y: [MC], mode: 'markers', name: 'MC at Q', marker: { color: '#f59e0b', size: 9 } }
                    ],
                    layout: { xaxis: { title: 'Output (Q)' }, yaxis: { title: 'Cost (₹)' } },
                    formulas: ['TC = FC + VC', 'AC = TC / Q', 'MC = ΔTC / ΔQ', `Fixed Cost = ₹${a} (raises AC at every Q, but never changes MC)`, 'MC cuts AC exactly at AC\'s minimum point — never before, never after'],
                    metrics: { AC, MC, view: 'costs', qStar, acStar },
                    readings: `<div class="reading-row"><span>Average Cost at Q</span><b>₹${fmt(AC)}</b></div>
                               <div class="reading-row"><span>Marginal Cost at Q</span><b>₹${fmt(MC)}</b></div>
                               <div class="reading-row"><span>Minimum-AC Output (Q*)</span><b>${fmt(qStar, 1)} units (AC = ₹${fmt(acStar)})</b></div>
                               <div class="reading-row"><span>AC is currently</span><b>${MC < AC ? 'Falling' : 'Rising'}</b></div>
                               <div class="reading-row insight-row">💡 ${MC < AC ? 'MC is below AC, so it is still pulling the average down — the firm hasn\'t reached its most efficient output yet.' : 'MC is above AC, so it is pulling the average up — output has moved past the most efficient scale.'} The green star marks exactly where MC crosses AC — always at AC's minimum.</div>`
                };
            },
            practice: [
                { prompt: 'Switch to the Product view and increase Labour from 1 to 24. Find the L where MP crosses AP.', hint: 'MP crosses AP exactly at AP\'s maximum — exactly L=15 with this production function (marked with a green star on the chart).' },
                { prompt: 'Switch to Cost view and raise Fixed Cost. Does Marginal Cost change?', hint: 'No — MC = b + 2cQ has no FC term. Only AC (which divides FC by Q) shifts up.' }
            ],
            challenge: {
                prompt: 'In the Product view, find a Labour value in Stage II (MP positive but below AP).',
                check(state, metrics) { return metrics && metrics.view === 'product' && metrics.MP > 0 && metrics.MP < metrics.AP; }
            }
        },
        {
            id: 'micro-price-controls',
            module: 'micro',
            title: 'Price Ceiling & Price Floor',
            desc: 'See how government price controls create shortages or surpluses.',
            class: 'XI', part: 'B', unit: 7, unitTitle: 'Perfect Competition — Price Determination and Simple Applications', topicLabel: 'Price Ceiling & Price Floor',
            syllabusIds: ['XI-B-U7-APPLICATIONS'],
            mode: 'simulator',
            concept: '<p>A <b>price ceiling</b> set below the free-market equilibrium price causes a shortage (quantity demanded exceeds quantity supplied). A <b>price floor</b> set above equilibrium causes a surplus (quantity supplied exceeds quantity demanded).</p>',
            formulas: ['Demand: P = 100 − Q (+ market demand shift)', 'Supply: P = 20 + Q', 'Shortage/Surplus = |Qd − Qs| at the controlled price'],
            controls: [
                { id: 'ctrl', label: 'Government Price Control (₹)', min: 20, max: 100, step: 5, value: 60, unit: '' },
                { id: 'demandShift', label: 'Market Demand Conditions', min: -20, max: 20, step: 5, value: 0, unit: '' }
            ],
            compute(v) {
                const a = 100 + v.demandShift, b = 1, c = 20, d = 1;
                const { Q: Qe, P: Pe } = lineIntersect(a, b, c, d);
                const ctrl = v.ctrl;
                const qd = Math.max(a - b * ctrl, 0);
                const qs = Math.max((ctrl - c) / d, 0);
                const isCeiling = ctrl < Pe;
                const gap = isCeiling ? qd - qs : qs - qd;
                const qsAxis = range(101);
                const gapLo = Math.min(qd, qs), gapHi = Math.max(qd, qs);
                const gapLabel = isCeiling ? 'Shortage (Qd − Qs)' : 'Surplus (Qs − Qd)';
                return {
                    traces: [
                        { x: qsAxis, y: qsAxis.map(q => a - b * q), mode: 'lines', name: 'Demand', line: { color: '#2563eb', width: 3 } },
                        { x: qsAxis, y: qsAxis.map(q => c + d * q), mode: 'lines', name: 'Supply', line: { color: '#f59e0b', width: 3 } },
                        { x: [0, 100], y: [ctrl, ctrl], mode: 'lines', name: isCeiling ? 'Price Ceiling' : 'Price Floor', line: { color: '#ef4444', width: 2, dash: 'dash' } },
                        { x: [Qe, Qe], y: [0, Pe], mode: 'lines', name: 'Free-Market Q (dotted)', line: { color: '#9ca3af', width: 1, dash: 'dot' }, showlegend: false },
                        { x: [0, Qe], y: [Pe, Pe], mode: 'lines', name: 'Free-Market P (dotted)', line: { color: '#9ca3af', width: 1, dash: 'dot' }, showlegend: false },
                        { x: [Qe], y: [Pe], mode: 'markers', name: 'Free-Market Equilibrium', marker: { color: '#10b981', size: 9 } },
                        // The gap itself, drawn as a thick bracket segment ON the control-price
                        // line between Qs and Qd — the shortage/surplus is a length a student
                        // can SEE, not just a number inferred from two crossing lines.
                        { x: [gapLo, gapHi], y: [ctrl, ctrl], mode: 'lines+markers', name: gapLabel,
                            line: { color: '#7c3aed', width: 7 },
                            marker: { color: '#7c3aed', size: 9, symbol: 'line-ns-open' } },
                        { x: [qd], y: [ctrl], mode: 'markers', name: `Qd = ${fmt(qd, 0)}`, marker: { color: '#2563eb', size: 8 } },
                        { x: [qs], y: [ctrl], mode: 'markers', name: `Qs = ${fmt(qs, 0)}`, marker: { color: '#f59e0b', size: 8 } }
                    ],
                    layout: {
                        xaxis: { title: 'Quantity', range: [0, 100] }, yaxis: { title: 'Price (₹)', range: [0, 100] },
                        annotations: gap > 0.5 ? [{
                            x: (gapLo + gapHi) / 2, y: ctrl, yshift: 16, showarrow: false,
                            text: `${gapLabel.split(' (')[0]}: ${fmt(gap, 0)} units`,
                            font: { color: '#7c3aed', size: 13 }
                        }] : []
                    },
                    metrics: { gap: Math.max(gap, 0), isCeiling },
                    readings: `<div class="reading-row"><span>Free-Market Equilibrium</span><b>₹${fmt(Pe)} / ${fmt(Qe)} units</b></div>
                               <div class="reading-row"><span>Control Type</span><b>${isCeiling ? 'Price Ceiling' : 'Price Floor'}</b></div>
                               <div class="reading-row"><span>${isCeiling ? 'Shortage' : 'Surplus'}</span><b>${fmt(Math.max(gap, 0))} units</b></div>
                               <div class="reading-row insight-row">💡 ${isCeiling ? 'Setting the price below equilibrium (e.g. rent control) benefits some buyers but leaves demand unmet — a classic shortage.' : 'Setting the price above equilibrium (e.g. minimum wage, MSP) protects sellers but leaves excess supply unsold — a classic surplus.'}</div>`
                };
            },
            practice: [
                { prompt: 'Set the control price above the free-market equilibrium. Is that a ceiling or a floor?', hint: 'A control price ABOVE equilibrium is a Price Floor (creates a surplus) — the sim relabels automatically.' },
                { prompt: 'Set the control exactly at the free-market equilibrium price. What is the shortage/surplus?', hint: 'Zero — a control at equilibrium changes nothing, since the market already clears there.' }
            ],
            challenge: {
                prompt: 'Create a shortage of at least 30 units using a price ceiling.',
                check(state, metrics) { return metrics && metrics.isCeiling && metrics.gap >= 30; }
            }
        },
        {
            id: 'micro-market-structures',
            module: 'micro',
            title: 'Forms of Market: Monopoly → Oligopoly → Perfect Competition',
            desc: 'Slide the Number of Firms to move continuously across every named market structure.',
            class: 'XI', part: 'B', unit: 7, unitTitle: 'Perfect Competition — Price Determination and Simple Applications', topicLabel: 'Forms of Market (extension)',
            syllabusIds: [],
            mode: 'simulator',
            enrichment: true,
            enrichmentNote: 'The supplied 2026–27 taxonomy explicitly scopes Class XI Unit 7 to "Perfect Competition — Price Determination and Simple Applications" with a stated "Short-run analysis only" limitation, and does not list Monopoly, Oligopoly or Monopolistic Competition as Class XI Microeconomics topics. This lab is retained as enrichment — it still illuminates the Perfect Competition endpoint (N→∞, P→MC) that IS in scope — but is not counted toward core Unit 7 coverage.',
            concept: '<p>This lab goes beyond the syllabus\'s Perfect-Competition-only scope to show <i>why</i> perfect competition is the benchmark it is: it uses the standard Cournot model — symmetric firms each choosing output, taking rivals\' output as given — so moving the Number of Firms slider sweeps from Monopoly (1 firm) toward Perfect Competition as more firms enter and price converges to marginal cost (P = MC).</p>',
            formulas: ['Cournot price with N firms: P = (100 + N×MC) / (N + 1)', 'N = 1 → Monopoly', 'N large → Perfect Competition (P → MC)'],
            controls: [
                { id: 'mc', label: 'Marginal Cost (₹)', min: 10, max: 60, step: 5, value: 20, unit: '' },
                { id: 'n', label: 'Number of Firms (N)', min: 1, max: 30, step: 1, value: 1, unit: '' }
            ],
            compute(v) {
                const mc = v.mc, N = v.n;
                const priceAt = n => (100 + n * mc) / (n + 1);
                const P = priceAt(N);
                const Q = 100 - P;
                const Pc = mc, Qc = 100 - mc; // perfect-competition benchmark (P = MC)
                const structure = N === 1 ? 'Monopoly' : N <= 4 ? 'Oligopoly' : N <= 15 ? 'Monopolistic Competition' : 'Near-Perfect Competition';
                // The two isolated "current vs benchmark" bars used to leave the
                // ACTUAL convergence — price falling continuously as N rises —
                // something the student had to imagine. Drawing P(N) as a real
                // curve, against the MC line it approaches but never crosses,
                // makes "N → ∞ ⇒ P → MC" a visible fact rather than an inference
                // from two disconnected snapshots.
                const Ns = range(30).map(i => i + 1);
                const ps = Ns.map(priceAt);
                const qs = Ns.map(n => 100 - priceAt(n));
                return {
                    traces: [
                        { x: Ns, y: ps, mode: 'lines', name: 'Price P(N)', line: { color: '#2563eb', width: 3 } },
                        { x: Ns, y: qs, mode: 'lines', name: 'Quantity Q(N)', line: { color: '#f59e0b', width: 3 }, yaxis: 'y2' },
                        { x: [1, 30], y: [mc, mc], mode: 'lines', name: 'Marginal Cost (perfect-competition benchmark)', line: { color: '#10b981', dash: 'dash', width: 2 } },
                        { x: [N], y: [P], mode: 'markers', name: `Current (N=${N})`, marker: { color: '#2563eb', size: 11 } },
                        { x: [N], y: [Q], mode: 'markers', name: `Current Quantity`, marker: { color: '#f59e0b', size: 11 }, yaxis: 'y2', showlegend: false }
                    ],
                    layout: {
                        xaxis: { title: 'Number of Firms (N)', range: [1, 30] },
                        yaxis: { title: 'Price (₹)', range: [0, 100] },
                        yaxis2: { title: 'Quantity', overlaying: 'y', side: 'right', range: [0, 100] }
                    },
                    metrics: { P, Q, N, structure },
                    readings: `<div class="reading-row"><span>Market Structure (at N=${N})</span><b>${structure}</b></div>
                               <div class="reading-row"><span>Current Price / Qty</span><b>₹${fmt(P)} / ${fmt(Q)}</b></div>
                               <div class="reading-row"><span>Perfect-Competition Benchmark</span><b>₹${fmt(Pc)} / ${fmt(Qc)}</b></div>
                               <div class="reading-row insight-row">💡 As N rises, each firm has less market power and undercutting rivals matters more — price is pushed down toward marginal cost. At N=1 (monopoly) price is highest and output lowest; the blue P(N) curve approaches, but never touches, the green MC line — it gets arbitrarily close only in the limit N→∞.</div>`
                };
            },
            practice: [
                { prompt: 'Push N from 1 to 30. Does price ever exactly equal MC?', hint: 'Only in the limit — P = (100+N·MC)/(N+1) approaches MC as N→∞ but only exactly equals it at N=∞.' }
            ],
            challenge: {
                prompt: 'Find the smallest N where price comes within ₹5 of the Perfect-Competition benchmark.',
                check(state, metrics) { return !!metrics && Math.abs(metrics.P - state.mc) <= 5; }
            }
        },

        // ── MACROECONOMICS (Class XII, Part A) ─────────────────────
        {
            id: 'macro-money-creation',
            module: 'macro',
            title: 'Credit / Money Creation',
            desc: 'See how banks multiply an initial deposit through successive lending.',
            class: 'XII', part: 'A', unit: 2, unitTitle: 'Money and Banking', topicLabel: 'Money Creation by the Commercial Banking System',
            syllabusIds: ['XII-A-U2-CREATION', 'XII-A-U2-CREDIT-CONTROL', 'XII-A-U2-MONEY', 'XII-A-U2-SUPPLY', 'XII-A-U2-CENTRAL-BANK'],
            mode: 'simulator',
            concept: '<p><b>Money</b> is anything generally accepted as a medium of exchange; NCERT names four functions — medium of exchange, unit of account (measuring value), store of value, and standard of deferred payment (settling future debts). India\'s <b>money supply</b> is defined as currency held by the public plus net demand deposits held by commercial banks — the deposits this lab simulates are exactly that second component.</p><p>When a bank keeps only a fraction of deposits as reserves (the Legal Reserve Ratio, modeled by the slider below) and lends out the rest, that lending becomes a new deposit elsewhere in the banking system. This process repeats, creating a total money supply many times the original deposit. The <b>Reserve Bank of India (RBI)</b>, India\'s central bank, controls this process — acting as the <b>bank of issue</b> (sole authority to issue currency notes), the <b>government\'s bank</b> (manages its accounts and public debt), and the <b>banker\'s bank</b> (holds commercial banks\' reserves and lends to them as a last resort) — using several named monetary-policy tools: <b>CRR</b> (Cash Reserve Ratio) and <b>SLR</b> (Statutory Liquidity Ratio) directly set the reserve requirement modeled here; the <b>Repo Rate</b>, <b>Reverse Repo Rate</b> and <b>Bank Rate</b> change how expensive it is for banks to borrow, indirectly affecting how much they lend; and <b>Open Market Operations (OMO)</b> — the RBI buying/selling government securities — directly add or remove money from circulation.</p>',
            formulas: ['Credit Multiplier = 1 / LRR', 'Total Deposits Created = Initial Deposit × (1 / LRR)', 'RBI tools: CRR, SLR, Repo Rate, Reverse Repo Rate, Bank Rate, Open Market Operations'],
            controls: [
                { id: 'rr', label: 'Legal Reserve Ratio (%)', min: 5, max: 50, step: 5, value: 20, unit: '%' },
                { id: 'deposit', label: 'Initial Deposit (₹)', min: 1000, max: 10000, step: 500, value: 5000, unit: '' }
            ],
            compute(v) {
                const r = v.rr / 100, D0 = v.deposit;
                let amt = D0;
                const vals = [];
                for (let i = 0; i < 8; i++) {
                    vals.push(amt);
                    amt = amt * (1 - r);
                }
                const totalMoney = D0 / r;
                // The per-round bars alone leave the actual claim of this topic —
                // that the round-by-round series SUMS to a finite total, D0/r,
                // even though lending never technically stops — something the
                // student had to take on faith from the readings-panel number.
                // Overlaying the running cumulative total against that asymptote
                // line makes "it converges to D0/r" a visible curve shape, the
                // same convergence pattern used on the Market Structures lab.
                let running = 0;
                const cumulative = vals.map(x => { running += x; return running; });
                return {
                    traces: [
                        { x: vals.map((_, i) => `Round ${i + 1}`), y: vals, type: 'bar', name: 'New Deposit This Round', marker: { color: '#2563eb' } },
                        { x: vals.map((_, i) => `Round ${i + 1}`), y: cumulative, mode: 'lines+markers', name: 'Cumulative Money Created', line: { color: '#f59e0b', width: 3 }, yaxis: 'y2' },
                        { x: vals.map((_, i) => `Round ${i + 1}`), y: vals.map(() => totalMoney), mode: 'lines', name: `Total Money Created (D0/LRR = ₹${fmt(totalMoney, 0)})`, line: { color: '#10b981', dash: 'dash', width: 2 }, yaxis: 'y2' }
                    ],
                    layout: {
                        xaxis: { title: 'Successive Deposit Rounds' },
                        yaxis: { title: 'New Deposit This Round (₹)' },
                        yaxis2: { title: 'Cumulative Total (₹)', overlaying: 'y', side: 'right', range: [0, totalMoney * 1.15] }
                    },
                    metrics: { multiplier: 1 / r, totalMoney },
                    readings: `<div class="reading-row"><span>Money Multiplier (1/LRR)</span><b>${fmt(1 / r)}</b></div>
                               <div class="reading-row"><span>Total Money Created</span><b>₹${fmt(totalMoney, 0)}</b></div>
                               <div class="reading-row insight-row">💡 A lower Legal Reserve Ratio means banks hold back less and lend out more of every deposit — so each rupee gets re-lent more times, and the money multiplier grows larger. The orange cumulative line climbs toward, but never quite reaches, the green Total Money Created line — an infinite number of ever-shrinking rounds sums to a FINITE total.</div>`
                };
            },
            practice: [
                { prompt: 'Halve the Legal Reserve Ratio. Does Total Money Created double?', hint: 'Total Money = Deposit/LRR, so halving LRR exactly doubles total money created — try 20% → 10%.' }
            ],
            challenge: {
                prompt: 'Reach a Money Multiplier of at least 10 using the Legal Reserve Ratio slider.',
                check(state, metrics) { return metrics && metrics.multiplier >= 10; }
            }
        },
        {
            id: 'macro-govt-budget',
            module: 'macro',
            title: 'Government Budget',
            desc: 'Compare government receipts and expenditure and see the resulting deficits.',
            class: 'XII', part: 'A', unit: 4, unitTitle: 'Government Budget and the Economy', topicLabel: 'Receipts, Expenditure & Deficits',
            syllabusIds: ['XII-A-U4-RECEIPTS', 'XII-A-U4-EXPENDITURE', 'XII-A-U4-DEFICITS', 'XII-A-U4-BUDGET'],
            mode: 'simulator',
            concept: '<p>The government budget is the government\'s annual statement of expected receipts and expenditure, presented with several objectives in mind — reallocating resources (e.g. taxing polluting activity, subsidising merit goods), redistributing income (progressive taxes, welfare spending), maintaining economic stability, and managing public enterprises. It records planned receipts (revenue + capital) and expenditure (revenue + capital) for the year. When expenditure exceeds receipts, the shortfall shows up as a deficit. The NCERT chapter names three: <b>Revenue Deficit</b> (routine expenses exceeding routine receipts), <b>Fiscal Deficit</b> (total borrowing requirement), and <b>Primary Deficit</b> (fiscal deficit excluding interest on past borrowing — showing the deficit from this year\'s policy alone).</p>',
            formulas: ['Revenue Deficit = Revenue Expenditure − Revenue Receipts', 'Fiscal Deficit = Total Expenditure − Total Receipts (excl. borrowings)', 'Primary Deficit = Fiscal Deficit − Interest Payments'],
            controls: [
                { id: 'rr', label: 'Revenue Receipts (₹B)', min: 50, max: 300, step: 10, value: 150, unit: '' },
                { id: 're', label: 'Revenue Expenditure (₹B)', min: 50, max: 300, step: 10, value: 180, unit: '' },
                { id: 'interest', label: 'Interest Payments (₹B)', min: 0, max: 80, step: 5, value: 30, unit: '' }
            ],
            compute(v) {
                const revenueReceipts = v.rr, capitalReceipts = 60, revenueExp = v.re, capitalExp = 90, interest = v.interest;
                const totalReceipts = revenueReceipts + capitalReceipts, totalExp = revenueExp + capitalExp;
                const revenueDeficit = revenueExp - revenueReceipts;
                const fiscalDeficit = totalExp - totalReceipts;
                const primaryDeficit = fiscalDeficit - interest;
                const deficitTop = Math.max(totalReceipts, totalExp);
                return {
                    traces: [
                        {
                            x: ['Revenue Receipts', 'Capital Receipts', 'Revenue Exp.', 'Capital Exp.', 'Total Receipts', 'Total Expenditure'],
                            y: [revenueReceipts, capitalReceipts, revenueExp, capitalExp, totalReceipts, totalExp],
                            type: 'bar',
                            marker: { color: ['#10b981', '#34d399', '#f87171', '#f97316', '#059669', '#dc2626'] }
                        }
                    ],
                    layout: {
                        xaxis: { title: 'Budget Component' }, yaxis: { title: '₹ Billion', range: [0, deficitTop * 1.25] }, showlegend: false,
                        // The Fiscal Deficit is the syllabus's own named headline
                        // number — drawing it as a visible bracket between the two
                        // TOTAL bars (not just the four components) is the same
                        // "make the gap a length, not an inferred subtraction"
                        // pattern used on the Price Ceiling/Floor lab.
                        shapes: fiscalDeficit > 0.5 ? [{
                            type: 'line', x0: 'Total Receipts', x1: 'Total Expenditure',
                            y0: deficitTop * 1.1, y1: deficitTop * 1.1,
                            line: { color: '#7c3aed', width: 5 }
                        }] : [],
                        annotations: fiscalDeficit > 0.5 ? [{
                            x: 'Total Receipts', xshift: 60, y: deficitTop * 1.1, yshift: 14, showarrow: false,
                            text: `Fiscal Deficit: ₹${fmt(fiscalDeficit, 0)}B`, font: { color: '#7c3aed', size: 13 }
                        }] : []
                    },
                    metrics: { revenueDeficit, fiscalDeficit, primaryDeficit },
                    readings: `<div class="reading-row"><span>Total Receipts</span><b>₹${fmt(totalReceipts, 0)}B</b></div>
                               <div class="reading-row"><span>Total Expenditure</span><b>₹${fmt(totalExp, 0)}B</b></div>
                               <div class="reading-row"><span>Revenue Deficit</span><b>₹${fmt(Math.max(revenueDeficit, 0), 0)}B</b></div>
                               <div class="reading-row"><span>Fiscal Deficit (illustrative)</span><b>₹${fmt(Math.max(fiscalDeficit, 0), 0)}B</b></div>
                               <div class="reading-row"><span>Primary Deficit</span><b>₹${fmt(Math.max(primaryDeficit, 0), 0)}B</b></div>
                               <div class="reading-row insight-row">💡 ${primaryDeficit <= 0 ? 'Primary deficit is zero or negative — this year\'s fiscal deficit is entirely (or more than) explained by interest owed on past borrowing, not fresh overspending.' : 'A positive primary deficit means the government is borrowing for more than just interest on old debt — it reflects this year\'s own spending decisions.'}</div>`
                };
            },
            practice: [
                { prompt: 'Raise Interest Payments until Primary Deficit turns zero or negative. What does that mean?', hint: 'It means the entire Fiscal Deficit is explained by interest on past borrowing — no fresh overspending this year.' }
            ],
            challenge: {
                prompt: 'Make Revenue Receipts exceed Revenue Expenditure (i.e. Revenue Deficit ≤ 0).',
                check(state, metrics) { return metrics && metrics.revenueDeficit <= 0; }
            }
        },
        {
            id: 'macro-forex',
            module: 'macro',
            title: 'Balance of Payments & Exchange Rate',
            desc: 'Current Account (Exports/Imports) and Capital Account (flows) each drive the exchange rate separately.',
            class: 'XII', part: 'A', unit: 5, unitTitle: 'Balance of Payments', topicLabel: 'BOP Accounts & Exchange Rate Determination',
            syllabusIds: ['XII-A-U5-BOP', 'XII-A-U5-DETERMINATION', 'XII-A-U5-EXRATE', 'XII-A-U5-EVALUATION'],
            mode: 'simulator',
            concept: '<p>This lab models a <b>flexible (floating) exchange rate</b> system, where the rate (₹ per US$) is set purely by market forces. The Balance of Payments splits into two named accounts, each modeled here as its own factor: the <b>Current Account</b> (Imports raise demand for $; Exports raise supply of $) and the <b>Capital Account</b> (Capital Outflow — Indians investing abroad — raises demand for $; Capital Inflow — FDI/FII into India — raises supply of $). The NCERT chapter also names two alternatives to this floating system: a <b>fixed exchange rate</b>, officially pegged by the central bank rather than market-determined; and <b>managed floating</b> — India\'s actual regime — where the rate mostly floats but the RBI intervenes occasionally to smooth volatility.</p><p><b>Weighing the systems:</b> a flexible rate self-corrects BOP imbalances automatically and needs no reserves to defend, but its unpredictability can discourage trade and investment. A fixed rate gives businesses certainty, but requires the central bank to hold large reserves to defend it and removes an automatic adjustment mechanism. Managed floating tries to combine flexibility with occasional stability — at the cost of needing constant RBI judgement calls about when to intervene.</p>',
            formulas: ['Demand for $ ↑ ⇒ Rupee depreciates (₹/$ rises)', 'Current Account: Imports (demand) vs Exports (supply)', 'Capital Account: Capital Outflow (demand) vs Capital Inflow (supply)', 'Equilibrium: Demand for $ = Supply of $'],
            controls: [
                { id: 'imports', label: 'Imports (Current A/c)', min: -20, max: 20, step: 2, value: 0, unit: '' },
                { id: 'exports', label: 'Exports (Current A/c)', min: -20, max: 20, step: 2, value: 0, unit: '' },
                { id: 'capOut', label: 'Capital Outflow (Capital A/c)', min: -20, max: 20, step: 2, value: 0, unit: '' },
                { id: 'capIn', label: 'Capital Inflow (Capital A/c)', min: -20, max: 20, step: 2, value: 0, unit: '' }
            ],
            compute(v) {
                const demandShift = v.imports + v.capOut;
                const supplyShift = -(v.exports + v.capIn);
                const a = 90 + demandShift, b = 0.5, c = Math.max(10, 40 + supplyShift), d = 0.5;
                const { Q, P } = lineIntersect(a, b, c, d);
                const qs = range(101);
                const netShift = demandShift + (-supplyShift); // positive = net pressure toward depreciation
                const trend = netShift > 0 ? 'Depreciating' : netShift < 0 ? 'Appreciating' : 'Stable';
                return {
                    traces: [
                        { x: qs, y: qs.map(q => a - b * q), mode: 'lines', name: 'Demand for $', line: { color: '#2563eb', width: 3 } },
                        { x: qs, y: qs.map(q => c + d * q), mode: 'lines', name: 'Supply of $', line: { color: '#f59e0b', width: 3 } },
                        { x: [Q, Q], y: [0, P], mode: 'lines', name: 'Equilibrium Q (dotted)', line: { color: '#9ca3af', width: 1, dash: 'dot' }, showlegend: false },
                        { x: [0, Q], y: [P, P], mode: 'lines', name: 'Equilibrium P (dotted)', line: { color: '#9ca3af', width: 1, dash: 'dot' }, showlegend: false },
                        { x: [Q], y: [P], mode: 'markers', name: 'Equilibrium Rate', marker: { color: '#ef4444', size: 10 } }
                    ],
                    layout: { xaxis: { title: 'Quantity of US$ (millions)', range: [0, 100] }, yaxis: { title: 'Exchange Rate (₹/$)', range: [0, 100] } },
                    metrics: { P, Q, trend },
                    readings: `<div class="reading-row"><span>Current Account (X−M)</span><b>${v.exports - v.imports >= 0 ? '+' : ''}${v.exports - v.imports}</b></div>
                               <div class="reading-row"><span>Capital Account (In−Out)</span><b>${v.capIn - v.capOut >= 0 ? '+' : ''}${v.capIn - v.capOut}</b></div>
                               <div class="reading-row"><span>Equilibrium Exchange Rate</span><b>₹${fmt(P)} / $</b></div>
                               <div class="reading-row"><span>Quantity Traded</span><b>${fmt(Q)}M</b></div>
                               <div class="reading-row"><span>Rupee Trend</span><b>${trend}</b></div>
                               <div class="reading-row insight-row">💡 ${trend === 'Depreciating' ? 'Demand for dollars (imports + capital outflow) outweighs supply (exports + capital inflow) — more rupees are needed per dollar.' : trend === 'Appreciating' ? 'Supply of dollars (exports + capital inflow) outweighs demand (imports + capital outflow) — fewer rupees are needed per dollar.' : 'Current Account and Capital Account pressures are balanced at the current rate.'}</div>`
                };
            },
            practice: [
                { prompt: 'Raise Imports only. Does the rupee appreciate or depreciate?', hint: 'Imports raise demand for dollars — the rupee depreciates (₹/$ rises).' },
                { prompt: 'Raise Capital Inflow only. Does the rupee appreciate or depreciate?', hint: 'Capital inflow raises the supply of dollars — the rupee appreciates (₹/$ falls).' }
            ],
            challenge: {
                prompt: 'Use only Capital Account controls (leave Imports = Exports = 0) to make the rupee Appreciate.',
                check(state, metrics) { return state.imports === 0 && state.exports === 0 && metrics && metrics.trend === 'Appreciating'; }
            }
        },
        {
            id: 'macro-inflation-gap',
            module: 'macro',
            title: 'Inflationary & Deflationary Gap',
            desc: 'Each component of Aggregate Demand (C, I, G, X−M) as its own control, driving the output gap.',
            class: 'XII', part: 'A', unit: 3, unitTitle: 'Determination of Income and Employment', topicLabel: 'Excess & Deficient Demand',
            syllabusIds: ['XII-A-U3-AD', 'XII-A-U3-GAPS', 'XII-A-U3-EMPLOYMENT'],
            mode: 'simulator',
            concept: '<p><b>Yfe</b> on this chart is the <b>full employment</b> level of income — where every willing worker at the going wage has a job. When equilibrium national income exceeds Yfe, the economy faces an <b>inflationary gap</b> — excess demand pushes prices up even though output can\'t rise further. When equilibrium income falls short of Yfe, a <b>deflationary gap</b> exists: demand is too low to employ everyone willing to work, which is exactly what NCERT calls <b>involuntary unemployment</b> — workers who want a job at the prevailing wage but can\'t find one, not by choice. Aggregate Demand is the sum of four named components — Autonomous Consumption, Investment, Government Spending, and Net Exports — each modeled here as its own control so you can see which one is driving the gap.</p>',
            formulas: ['AD = C + I + G + (X − M)', 'Inflationary Gap: Equilibrium Y > Yfe', 'Deflationary Gap: Equilibrium Y < Yfe'],
            controls: [
                { id: 'dc', label: 'Autonomous Consumption (ΔC)', min: -10, max: 10, step: 1, value: 0, unit: '' },
                { id: 'di', label: 'Investment (ΔI)', min: -10, max: 10, step: 1, value: 0, unit: '' },
                { id: 'dg', label: 'Government Spending (ΔG)', min: -10, max: 10, step: 1, value: 0, unit: '' },
                { id: 'dnx', label: 'Net Exports (ΔX−M)', min: -10, max: 10, step: 1, value: 0, unit: '' }
            ],
            compute(v) {
                const Yfe = 200;
                const asA = 10, asB = 0.3;
                const adShift = v.dc + v.di + v.dg + v.dnx;
                const adA = 190 + adShift, adB = 0.4;
                const Ystar = (adA - asA) / (adB + asB);
                const Pstar = adA - adB * Ystar;
                const ys = range(81).map(i => i * 5);
                const gapType = Ystar > Yfe + 1 ? 'Inflationary Gap' : Ystar < Yfe - 1 ? 'Deflationary Gap' : 'No Gap';
                const parts = [
                    { label: 'Consumption (C)', d: v.dc }, { label: 'Investment (I)', d: v.di },
                    { label: 'Govt. Spending (G)', d: v.dg }, { label: 'Net Exports (X−M)', d: v.dnx }
                ].filter(p => p.d !== 0);
                const biggest = parts.length ? parts.reduce((m, p) => Math.abs(p.d) > Math.abs(m.d) ? p : m) : null;
                const gapLo = Math.min(Ystar, Yfe), gapHi = Math.max(Ystar, Yfe);
                const gapBracketY = 140;
                return {
                    traces: [
                        { x: ys, y: ys.map(y => adA - adB * y), mode: 'lines', name: 'Aggregate Demand', line: { color: '#2563eb', width: 3 } },
                        { x: ys, y: ys.map(y => asA + asB * y), mode: 'lines', name: 'Aggregate Supply', line: { color: '#f59e0b', width: 3 } },
                        { x: [Yfe, Yfe], y: [0, 150], mode: 'lines', name: 'Full Employment (Yfe)', line: { color: '#10b981', dash: 'dash' } },
                        { x: [Ystar, Ystar], y: [0, Pstar], mode: 'lines', name: 'Equilibrium Y (dotted)', line: { color: '#9ca3af', width: 1, dash: 'dot' }, showlegend: false },
                        { x: [0, Ystar], y: [Pstar, Pstar], mode: 'lines', name: 'Equilibrium P (dotted)', line: { color: '#9ca3af', width: 1, dash: 'dot' }, showlegend: false },
                        { x: [Ystar], y: [Pstar], mode: 'markers', name: 'Equilibrium', marker: { color: '#ef4444', size: 9 } },
                        // The inflationary/deflationary GAP is the syllabus's own
                        // named headline quantity (Y* vs Yfe) — draw it as a visible
                        // bracket the same way the shortage/surplus bracket now
                        // works on the Price Ceiling/Floor lab, instead of leaving
                        // it inferable only from two vertical lines' separation.
                        ...(gapType !== 'No Gap' ? [{
                            x: [gapLo, gapHi], y: [gapBracketY, gapBracketY], mode: 'lines+markers',
                            name: gapType, line: { color: '#7c3aed', width: 7 },
                            marker: { color: '#7c3aed', size: 9, symbol: 'line-ns-open' }
                        }] : [])
                    ],
                    layout: {
                        xaxis: { title: 'National Income (Y)', range: [0, 400] }, yaxis: { title: 'Price Level', range: [0, 150] },
                        annotations: gapType !== 'No Gap' ? [{
                            x: (gapLo + gapHi) / 2, y: gapBracketY, yshift: 14, showarrow: false,
                            text: `${gapType}: ${fmt(Math.abs(Ystar - Yfe), 0)} units`, font: { color: '#7c3aed', size: 13 }
                        }] : []
                    },
                    metrics: { Ystar, Yfe, gapType, gapSize: Math.abs(Ystar - Yfe) },
                    readings: `<div class="reading-row"><span>Net AD Shift (ΔC+ΔI+ΔG+ΔNX)</span><b>${adShift >= 0 ? '+' : ''}${adShift}</b></div>
                               <div class="reading-row"><span>Equilibrium Income</span><b>${fmt(Ystar)}</b></div>
                               <div class="reading-row"><span>Full Employment Income (Yfe)</span><b>${Yfe}</b></div>
                               <div class="reading-row"><span>Gap Type</span><b>${gapType}</b></div>
                               <div class="reading-row"><span>Gap Size</span><b>${fmt(Math.abs(Ystar - Yfe))}</b></div>
                               <div class="reading-row insight-row">💡 ${biggest ? `<b>${biggest.label}</b> is driving this the most (Δ${biggest.d >= 0 ? '+' : ''}${biggest.d}). ` : ''}${gapType === 'Inflationary Gap' ? 'Excess demand at full employment pushes prices up — contractionary policy (raise taxes, cut G, or raise interest rates) can help close the gap.' : gapType === 'Deflationary Gap' ? 'Demand falls short of what\'s needed for full employment, leaving resources idle — expansionary policy (raise G, cut taxes) can help close the gap.' : 'The economy is at (or very near) full-employment equilibrium.'}</div>`
                };
            },
            practice: [
                { prompt: 'Push all four ΔC/ΔI/ΔG/ΔNX sliders to +10. What kind of gap appears?', hint: 'A large positive AD shift pushes equilibrium income above Yfe — an Inflationary Gap.' },
                { prompt: 'Push them all to −10 instead.', hint: 'A large negative AD shift pushes equilibrium income below Yfe — a Deflationary Gap.' }
            ],
            challenge: {
                prompt: 'Find a combination that produces "No Gap" (equilibrium income within 1 of Yfe) without setting every slider to exactly 0.',
                check(state, metrics) { return metrics && metrics.gapType === 'No Gap' && (state.dc !== 0 || state.di !== 0 || state.dg !== 0 || state.dnx !== 0); }
            }
        },

        // ── STATISTICS FOR ECONOMICS (Class XI, Part A) ────────────
        {
            id: 'stats-dispersion',
            module: 'stats',
            title: 'Measures of Dispersion',
            desc: 'See how spread-out data affects Range, Quartile Deviation, SD and CV.',
            class: 'XI', part: 'A', unit: 3, unitTitle: 'Statistical Tools and Interpretation', topicLabel: 'Measures of Dispersion (extension)',
            syllabusIds: [],
            mode: 'simulator',
            enrichment: true,
            enrichmentNote: "Measures of Dispersion is standard NCERT statistical-tools content, but the supplied 2026–27 taxonomy's Unit 3 lists only Measures of Central Tendency, Correlation and Index Numbers as topics — Dispersion is not itemized separately in that document. Retained as enrichment (it directly complements the Central Tendency Data Lab, which shares the same dataset shape), not counted toward core Unit 3 coverage.",
            concept: '<p>While the mean summarizes the "centre" of a dataset, dispersion measures describe how spread out the values are around that centre. This lab covers the simple <b>Range</b> and <b>Quartile Deviation</b> (based on position), and the more powerful <b>Standard Deviation</b> and <b>Coefficient of Variation</b> (based on every value). Two datasets can share the same mean yet look very different once you compare their spread.</p>',
            formulas: ['Range = Maximum − Minimum', 'Coefficient of Range = [(Max−Min)/(Max+Min)] × 100', 'Quartile Deviation (QD) = (Q3 − Q1) / 2', 'Mean (x̄) = Σx / n', 'SD (σ) = √[Σ(x−x̄)² / n]', 'Coefficient of Variation = (σ / x̄) × 100'],
            controls: [
                { id: 'spread', label: 'Spread Factor', min: 1, max: 10, step: 1, value: 4, unit: '' }
            ],
            compute(v) {
                const base = [45, 52, 48, 60, 55, 50, 58];
                const mean0 = base.reduce((s, x) => s + x, 0) / base.length;
                const data = base.map(x => mean0 + (x - mean0) * (v.spread / 4));
                const mean = data.reduce((s, x) => s + x, 0) / data.length;
                const variance = data.reduce((s, x) => s + (x - mean) ** 2, 0) / data.length;
                const sd = Math.sqrt(variance);
                const cv = (sd / mean) * 100;
                const sorted = [...data].sort((a, b) => a - b);
                const range_ = sorted[sorted.length - 1] - sorted[0];
                const quartile = (p) => {
                    const pos = p * (sorted.length - 1);
                    const lo = Math.floor(pos), hi = Math.ceil(pos);
                    return sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
                };
                const q1 = quartile(0.25), q3 = quartile(0.75);
                const qd = (q3 - q1) / 2;
                const coeffRange = ((sorted[sorted.length - 1] - sorted[0]) / (sorted[sorted.length - 1] + sorted[0])) * 100;
                // Range and QD were previously numbers in the readings panel with
                // nothing to look at on the bar chart itself — no mean line, no
                // quartile markers, no visible span for the Range they're computed
                // from. Drawing all three directly on the chart makes "half the
                // distance between Q1 and Q3" and "max minus min" visible spans,
                // not numbers a student has to take on faith.
                const labels = data.map((_, i) => `X${i + 1}`);
                const minIdx = data.indexOf(sorted[0]);
                return {
                    traces: [
                        { x: labels, y: data, type: 'bar', name: 'Data', marker: { color: '#2563eb' } },
                        { x: [labels[0], labels[labels.length - 1]], y: [mean, mean], mode: 'lines', name: `Mean (${fmt(mean)})`, line: { color: '#10b981', width: 2 } },
                        { x: [labels[0], labels[labels.length - 1]], y: [q1, q1], mode: 'lines', name: `Q1 (${fmt(q1)})`, line: { color: '#7c3aed', width: 1.5, dash: 'dot' } },
                        { x: [labels[0], labels[labels.length - 1]], y: [q3, q3], mode: 'lines', name: `Q3 (${fmt(q3)})`, line: { color: '#7c3aed', width: 1.5, dash: 'dot' } },
                        // Range is a Y-axis (value) distance, not an X-axis one — the
                        // bracket is drawn VERTICALLY, anchored just beside the
                        // minimum bar, spanning from the minimum value up to the
                        // maximum value, so its length is the actual span it names.
                        { x: [labels[minIdx], labels[minIdx]], y: [sorted[0], sorted[sorted.length - 1]], mode: 'lines+markers', name: `Range (${fmt(range_)})`, line: { color: '#dc2626', width: 5 }, marker: { color: '#dc2626', size: 8, symbol: 'line-ew-open' } }
                    ],
                    layout: { xaxis: { title: 'Data Point' }, yaxis: { title: 'Value', range: [0, 110] } },
                    metrics: { sd, cv, range: range_, qd },
                    readings: `<div class="reading-row"><span>Range</span><b>${fmt(range_)}</b></div>
                               <div class="reading-row"><span>Coefficient of Range</span><b>${fmt(coeffRange)}%</b></div>
                               <div class="reading-row"><span>Quartile Deviation (QD)</span><b>${fmt(qd)}</b></div>
                               <div class="reading-row"><span>Mean</span><b>${fmt(mean)}</b></div>
                               <div class="reading-row"><span>Standard Deviation</span><b>${fmt(sd)}</b></div>
                               <div class="reading-row"><span>Coefficient of Variation</span><b>${fmt(cv)}%</b></div>
                               <div class="reading-row insight-row">💡 Range and QD only use the extreme/positional values, so they're quick but ignore most of the data. SD and CV use every value, so they're more reliable — CV is best for comparing the consistency of two datasets with different means.</div>`
                };
            },
            practice: [
                { prompt: 'Set Spread Factor to 1, then to 10. Does the Mean change?', hint: 'No — the spread transformation is centred on the original mean, so only SD/Range/QD change, not the mean itself.' }
            ],
            challenge: {
                prompt: 'Push the Coefficient of Variation above 25%.',
                check(state, metrics) { return metrics && metrics.cv > 25; }
            }
        },
        {
            id: 'stats-index-numbers',
            module: 'stats',
            title: 'Index Numbers: Simple Aggregative Method',
            desc: 'Enter your own commodity basket (base-year and current-year prices) and compute a price index live.',
            class: 'XI', part: 'A', unit: 3, unitTitle: 'Statistical Tools and Interpretation', topicLabel: 'Index Numbers — Simple Aggregative Method',
            syllabusIds: ['XI-A-U3-INDEX'],
            mode: 'datalab',
            concept: '<p>An index number expresses the value of a variable in a given period relative to its value in a fixed base period (= 100). NCERT names the <b>Simple Aggregative Method</b> for building a price index directly from a commodity basket: sum every commodity\'s current-year price, sum every commodity\'s base-year price, and take the ratio. This is the same underlying idea behind the <b>Wholesale Price Index (WPI)</b>, <b>Consumer Price Index (CPI)</b> and <b>Index of Industrial Production (IIP)</b> (which use weighted baskets in practice) — and the index\'s movement above/below 100 is exactly what <b>inflation</b> measures.</p>',
            formulas: ['Simple Aggregative Price Index = (ΣP₁ / ΣP₀) × 100', 'Inflation Rate = Index − 100 (%, relative to the base year)'],
            dataLab: {
                columns: [
                    { id: 'commodity', label: 'Commodity', type: 'text', default: 'Item' },
                    { id: 'p0', label: 'Base Year Price', type: 'number', step: 1, min: 0, default: 20 },
                    { id: 'p1', label: 'Current Year Price', type: 'number', step: 1, min: 0, default: 20 }
                ],
                minRows: 3,
                maxRows: 10,
                addRowDefault: { commodity: 'New Item', p0: 20, p1: 20 },
                defaultRows: [
                    { commodity: 'Rice (per kg)', p0: 20, p1: 24 },
                    { commodity: 'Wheat (per kg)', p0: 18, p1: 21 },
                    { commodity: 'Milk (per litre)', p0: 40, p1: 46 },
                    { commodity: 'Petrol (per litre)', p0: 90, p1: 102 },
                    { commodity: 'Sugar (per kg)', p0: 38, p1: 41 }
                ],
                calculate(rows) {
                    const sumP0 = rows.reduce((s, r) => s + r.p0, 0);
                    const sumP1 = rows.reduce((s, r) => s + r.p1, 0);
                    const index = sumP0 > 0 ? (sumP1 / sumP0) * 100 : 100;
                    const inflation = index - 100;
                    const categories = [...rows.map(r => r.commodity), 'Price Index'];
                    return {
                        traces: [
                            { x: rows.map(r => r.commodity), y: rows.map(r => r.p0), name: 'Base Year Price', type: 'bar', marker: { color: '#9ca3af' } },
                            { x: rows.map(r => r.commodity), y: rows.map(r => r.p1), name: 'Current Year Price', type: 'bar', marker: { color: '#2563eb' } },
                            // The index number itself — the actual answer to "how much
                            // costlier is the basket?" — was previously only a % in the
                            // readings panel, disconnected from the price bars above it.
                            // Plotting it against its own fixed Base=100 reference line
                            // (on a secondary axis, since 100-ish index points and
                            // rupee prices are different scales) makes "how far above/
                            // below 100" a visible distance, not just a percentage to
                            // read and mentally relate back to the bars. The reference
                            // is a LINE, not a second bar in the same category, so it
                            // can never end up hidden behind the index bar it's meant
                            // to be compared against.
                            { x: [categories[0], categories[categories.length - 1]], y: [100, 100], name: 'Base Year (= 100)', mode: 'lines', line: { color: '#6b7280', dash: 'dash', width: 2 }, yaxis: 'y2' },
                            { x: ['Price Index'], y: [index], name: `Current Index (${fmt(index)})`, type: 'bar', marker: { color: inflation >= 0 ? '#dc2626' : '#16a34a' }, yaxis: 'y2' }
                        ],
                        layout: {
                            xaxis: { title: 'Commodity' }, yaxis: { title: 'Price (₹)' }, barmode: 'group',
                            yaxis2: { title: 'Price Index (Base = 100)', overlaying: 'y', side: 'right', range: [0, Math.max(200, index * 1.2)] }
                        },
                        stats: [
                            { label: 'ΣP₀ (Base Year Total)', value: '₹' + fmt(sumP0, 0) },
                            { label: 'ΣP₁ (Current Year Total)', value: '₹' + fmt(sumP1, 0) },
                            { label: 'Price Index (Base = 100)', value: fmt(index) },
                            { label: 'Inflation Rate', value: (inflation >= 0 ? '+' : '') + fmt(inflation) + '%' }
                        ],
                        metrics: { index, inflation, sumP0, sumP1 },
                        interpretation: inflation > 0
                            ? `The basket costs ${fmt(inflation)}% more than in the base year — the same commodities that cost ₹${fmt(sumP0, 0)} now cost ₹${fmt(sumP1, 0)}. That rise in the index is exactly what "inflation" measures.`
                            : inflation < 0
                                ? `The basket costs ${fmt(Math.abs(inflation))}% LESS than in the base year — a falling price index (deflation) for this basket.`
                                : 'The index is exactly 100 — this basket costs the same as in the base year.'
                    };
                }
            },
            practice: [
                { prompt: 'Double the Current Year Price of one commodity only. How much does the overall Index move?', hint: 'A single commodity moves the index by (that commodity\'s ΔP)/(ΣP₀) × 100 — a bigger-priced item swings the index more.' },
                { prompt: 'Set every Current Year Price equal to its Base Year Price. What is the Index?', hint: 'Exactly 100 — ΣP₁ = ΣP₀, so the ratio is 1 and the index is unchanged from the base year.' }
            ],
            challenge: {
                prompt: 'Edit the table so the Inflation Rate is between 8% and 12%.',
                check(state, metrics) { return metrics && metrics.inflation >= 8 && metrics.inflation <= 12; }
            }
        },

        // ── INDIAN ECONOMIC DEVELOPMENT (Class XII, Part B) ────────
        {
            id: 'india-human-capital',
            module: 'india',
            title: 'Human Capital Formation: Education & Health',
            desc: 'Both named sources of human capital — Education and Health spending — modeled and charted together.',
            class: 'XII', part: 'B', unit: 7, unitTitle: 'Current Challenges facing Indian Economy', topicLabel: 'Human Capital Formation',
            syllabusIds: ['XII-B-U7-HUMAN-CAPITAL'],
            mode: 'simulator',
            concept: '<p>NCERT names several sources of human capital formation; the two most emphasized are investment in <b>education</b> (raises literacy and skills) and investment in <b>health</b> (raises life expectancy and productive years). Both are modeled here as independent, adjustable spending levels, each driving its own outcome over time.</p>',
            formulas: ['Human Capital = Investment in Education + Health + Training', 'Higher literacy & life expectancy raise an economy\'s productive capacity'],
            controls: [
                { id: 'edu', label: 'Education Spending (% of GDP)', min: 1, max: 8, step: 0.5, value: 4, unit: '%' },
                { id: 'health', label: 'Health Spending (% of GDP)', min: 1, max: 6, step: 0.5, value: 2, unit: '%' }
            ],
            compute(v) {
                const years = ['2000', '2005', '2010', '2015', '2020', '2025'];
                const eduRate = v.edu / 8, healthRate = v.health / 6;
                const lit = [60], life = [55];
                for (let i = 1; i < years.length; i++) {
                    lit.push(lit[i - 1] + (100 - lit[i - 1]) * 0.25 * eduRate);
                    life.push(life[i - 1] + (82 - life[i - 1]) * 0.22 * healthRate);
                }
                return {
                    traces: [
                        { x: years, y: lit, mode: 'lines+markers', name: 'Literacy Rate (%)', line: { color: '#10b981', width: 3 } },
                        { x: years, y: life, mode: 'lines+markers', name: 'Life Expectancy (yrs)', line: { color: '#8b5cf6', width: 3 }, yaxis: 'y2' }
                    ],
                    layout: {
                        xaxis: { title: 'Year' },
                        yaxis: { title: 'Literacy Rate (%)', range: [50, 100] },
                        yaxis2: { title: 'Life Expectancy (yrs)', overlaying: 'y', side: 'right', range: [50, 85] }
                    },
                    metrics: { literacy: lit[lit.length - 1], lifeExpectancy: life[life.length - 1] },
                    readings: `<div class="reading-row"><span>Projected Literacy (latest)</span><b>${fmt(lit[lit.length - 1])}%</b></div>
                               <div class="reading-row"><span>Projected Life Expectancy (latest)</span><b>${fmt(life[life.length - 1])} yrs</b></div>
                               <div class="reading-row insight-row">💡 Education and health spending compound independently over time — a country can be strong in one and weak in the other, which is exactly why NCERT treats them as two separate (not interchangeable) sources of human capital.</div>`
                };
            },
            practice: [
                { prompt: 'Max out Education Spending but keep Health Spending at 1%. Which outcome lags?', hint: 'Life Expectancy grows much more slowly — health and education compound independently, not as substitutes.' }
            ],
            challenge: {
                prompt: 'Reach a projected Literacy Rate above 95% by the final year.',
                check(state, metrics) { return metrics && metrics.literacy > 95; }
            }
        },
        {
            id: 'india-employment-structure',
            module: 'india',
            title: 'Employment: Structural Transformation & Formalisation',
            desc: 'See how employment shifts from agriculture to industry/services, and from informal to formal work.',
            class: 'XII', part: 'B', unit: 7, unitTitle: 'Current Challenges facing Indian Economy', topicLabel: 'Employment: Workforce Participation & Formal/Informal Sector',
            syllabusIds: ['XII-B-U7-EMPLOYMENT'],
            mode: 'simulator',
            concept: '<p>The Employment topic covers two related shifts. <b>Structural transformation</b>: as economies develop, the workforce share in agriculture typically falls while industry and services rise. <b>Formal vs informal sector</b>: workers move (unevenly) from the <b>informal sector</b> — no job security, no social security, often self-employed or casual labour — toward <b>formal sector</b> jobs with regular wages and legal protection. Switch views below to explore either.</p>',
            formulas: ['Structural Transformation: labour shifts from Agriculture → Industry & Services as the economy develops'],
            controls: [
                {
                    id: 'view', label: 'View', type: 'select', value: 'sector',
                    options: [
                        { value: 'sector', label: 'Sector Shift' },
                        { value: 'formality', label: 'Formal vs Informal' }
                    ]
                },
                { id: 'yr', label: 'Years of Growth', min: 0, max: 30, step: 1, value: 10, unit: ' yrs' }
            ],
            compute(v) {
                const t = v.yr / 30;
                // "Structural Transformation" and "rising formal share" are both
                // claims about a TRAJECTORY over years, but a bar chart driven
                // by a single "Years of Growth" slider only ever showed one
                // year's snapshot — switching the slider replaced the bars
                // entirely, so the actual transformation (the thing the topic
                // is named for) was never visible as a trend, only inferable by
                // remembering what the previous snapshot looked like. Plotting
                // every series across the full 0–30 year range, with a vertical
                // marker at the selected year, makes the transformation itself
                // a visible curve.
                const yrs = range(16).map(i => i * 2);
                if (v.view === 'formality') {
                    const formalAt = yr => 10 + 40 * (yr / 30);
                    const formal = formalAt(v.yr), informal = 100 - formal;
                    return {
                        traces: [
                            { x: yrs, y: yrs.map(y => 100 - formalAt(y)), mode: 'lines', name: 'Informal Sector (%)', line: { color: '#f97316', width: 3 } },
                            { x: yrs, y: yrs.map(formalAt), mode: 'lines', name: 'Formal Sector (%)', line: { color: '#3b82f6', width: 3 } },
                            { x: [v.yr, v.yr], y: [0, 100], mode: 'lines', name: `Selected Year (+${v.yr}yrs)`, line: { color: '#6b7280', width: 1, dash: 'dot' }, showlegend: false },
                            { x: [v.yr], y: [informal], mode: 'markers', name: 'Informal now', marker: { color: '#f97316', size: 10 }, showlegend: false },
                            { x: [v.yr], y: [formal], mode: 'markers', name: 'Formal now', marker: { color: '#3b82f6', size: 10 }, showlegend: false }
                        ],
                        layout: { xaxis: { title: 'Years of Growth' }, yaxis: { title: 'Share of Workforce (%)', range: [0, 100] } },
                        formulas: ['Informal Sector: no job/social security, often self-employed or casual labour', 'Formal Sector: registered enterprises, regular wages, legal & social protection'],
                        metrics: { formal, informal, view: 'formality' },
                        readings: `<div class="reading-row"><span>Informal Sector</span><b>${fmt(informal)}%</b></div>
                                   <div class="reading-row"><span>Formal Sector</span><b>${fmt(formal)}%</b></div>
                                   <div class="reading-row insight-row">💡 India's workforce has historically been overwhelmingly informal. A rising formal share means more workers gaining job security, social security and legal protection — this shift has been slow and uneven, which is the central concern of this topic.</div>`
                    };
                }
                const agriAt = yr => 50 - 30 * (yr / 30);
                const servicesAt = yr => 25 + 25 * (yr / 30);
                const industryAt = yr => 100 - agriAt(yr) - servicesAt(yr);
                const agri = agriAt(v.yr), services = servicesAt(v.yr), industry = industryAt(v.yr);
                return {
                    traces: [
                        { x: yrs, y: yrs.map(agriAt), mode: 'lines', name: 'Agriculture (%)', line: { color: '#84cc16', width: 3 } },
                        { x: yrs, y: yrs.map(industryAt), mode: 'lines', name: 'Industry (%)', line: { color: '#f59e0b', width: 3 } },
                        { x: yrs, y: yrs.map(servicesAt), mode: 'lines', name: 'Services (%)', line: { color: '#3b82f6', width: 3 } },
                        { x: [v.yr, v.yr], y: [0, 100], mode: 'lines', name: `Selected Year (+${v.yr}yrs)`, line: { color: '#6b7280', width: 1, dash: 'dot' }, showlegend: false },
                        { x: [v.yr], y: [agri], mode: 'markers', marker: { color: '#84cc16', size: 10 }, showlegend: false },
                        { x: [v.yr], y: [industry], mode: 'markers', marker: { color: '#f59e0b', size: 10 }, showlegend: false },
                        { x: [v.yr], y: [services], mode: 'markers', marker: { color: '#3b82f6', size: 10 }, showlegend: false }
                    ],
                    layout: { xaxis: { title: 'Years of Growth' }, yaxis: { title: 'Share of Employment (%)', range: [0, 100] } },
                    formulas: ['Structural Transformation: labour shifts from Agriculture → Industry & Services as the economy develops'],
                    metrics: { agri, industry, services, view: 'sector' },
                    readings: `<div class="reading-row"><span>Agriculture</span><b>${fmt(agri)}%</b></div>
                               <div class="reading-row"><span>Industry</span><b>${fmt(industry)}%</b></div>
                               <div class="reading-row"><span>Services</span><b>${fmt(services)}%</b></div>
                               <div class="reading-row insight-row">💡 As agriculture's employment share falls and industry/services rise, workers are moving to more productive sectors — a hallmark of structural transformation and rising per-capita income.</div>`
                };
            },
            practice: [
                { prompt: 'Switch to "Formal vs Informal" and set Years of Growth to 0. What is the Formal Sector share?', hint: 'Just 10% — matching NCERT\'s point that India starts from an overwhelmingly informal base.' }
            ],
            challenge: {
                prompt: 'In the Formal vs Informal view, push the Formal Sector share above 45%.',
                check(state, metrics) { return metrics && metrics.view === 'formality' && metrics.formal > 45; }
            }
        }
    );
}
