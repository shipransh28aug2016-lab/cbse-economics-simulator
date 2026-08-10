// Class XI · Part B — Introductory Microeconomics: the simulators that
// were completely missing before this integration pass (Unit 4 PPF &
// Opportunity Cost, Unit 5 Indifference Curve analysis, Unit 6 Revenue
// curves & Producer Equilibrium, Unit 6 Price Elasticity of Supply).
// See CLAUDE.md for the data contract.

if (typeof SIMS !== 'undefined') {
    SIMS.push(
        {
            id: 'micro-ppf',
            module: 'micro',
            title: 'Production Possibility Frontier & Opportunity Cost',
            desc: 'Choose a point on, inside, or outside the PPF and see the opportunity cost of producing more of one good in terms of the other.',
            class: 'XI', part: 'B', unit: 4, unitTitle: 'Introduction', topicLabel: 'PPF, Opportunity Cost & the Central Problems',
            syllabusIds: ['XI-B-U4-PPF-OC', 'XI-B-U4-CENTRAL-PROBLEMS'],
            mode: 'simulator',
            concept: '<p>Every economy faces three central problems — <b>what</b> to produce, <b>how</b> to produce it, and <b>for whom</b> — because resources are scarce relative to wants. The <b>Production Possibility Frontier (PPF)</b> shows every combination of two goods an economy can produce at full, efficient resource use. A point <i>on</i> the frontier is efficient; a point <i>inside</i> it means resources are unemployed or underused (an "inefficient" economy — one answer to "how to produce" gone wrong); a point <i>outside</i> it is unattainable with current resources and technology. The PPF bows outward (concave to the origin) because resources aren\'t perfectly suited to producing both goods — shifting more resources toward Good X costs progressively <i>more</i> Good Y each time: the <b>Law of Increasing Opportunity Cost</b>.</p>',
            formulas: ['Illustrative PPF: Y = C − X² / C  (C = resource/technology endowment)', 'Opportunity Cost of one more X (in terms of Y) = Marginal Rate of Transformation = 2X / C', 'On the frontier = efficient · Inside = inefficient · Outside = unattainable'],
            controls: [
                { id: 'resources', label: 'Resources & Technology (C)', min: 10, max: 30, step: 1, value: 20, unit: '' },
                { id: 'x', label: 'Output of Good X', min: 0, max: 30, step: 1, value: 10, unit: '' },
                {
                    id: 'pointType', label: 'Point Type', type: 'select', value: 'on',
                    options: [
                        { value: 'on', label: 'On the Frontier (Efficient)' },
                        { value: 'inefficient', label: 'Inside (Inefficient)' },
                        { value: 'unattainable', label: 'Outside (Unattainable)' }
                    ]
                }
            ],
            compute(v) {
                const C = v.resources;
                const X = Math.min(v.x, C);
                const xsAxis = range(Math.round(C) + 1);
                const frontierY = xsAxis.map(x => Math.max(0, C - (x * x) / C));
                const Yfrontier = Math.max(0, C - (X * X) / C);
                let Y, label, note;
                if (v.pointType === 'inefficient') {
                    Y = Yfrontier * 0.7;
                    label = 'Inside the PPF — Inefficient';
                    note = 'Resources are unemployed or badly allocated — the economy could produce more of BOTH goods by moving out to the frontier, without sacrificing anything.';
                } else if (v.pointType === 'unattainable') {
                    Y = Yfrontier * 1.3;
                    label = 'Outside the PPF — Unattainable';
                    note = 'This combination needs more resources or better technology than the economy currently has — it cannot be produced right now.';
                } else {
                    Y = Yfrontier;
                    label = 'On the PPF — Productively Efficient';
                    note = 'Every point on the curve already uses all resources fully — the only way to get more X is to give up some Y. That trade-off IS opportunity cost.';
                }
                const mrt = (2 * X) / C; // slope magnitude of the PPF at X — opportunity cost of X in terms of Y
                return {
                    traces: [
                        { x: xsAxis, y: frontierY, mode: 'lines', name: 'PPF (Efficient Frontier)', line: { color: '#2563eb', width: 3 } },
                        { x: [X], y: [Y], mode: 'markers', name: 'Chosen Point', marker: { color: v.pointType === 'unattainable' ? '#ef4444' : v.pointType === 'inefficient' ? '#f59e0b' : '#10b981', size: 12 } }
                    ],
                    layout: { xaxis: { title: 'Good X (units)', range: [0, 32] }, yaxis: { title: 'Good Y (units)', range: [0, 32] } },
                    metrics: { pointType: v.pointType, mrt, Y, Yfrontier },
                    readings: `<div class="reading-row"><span>Point Status</span><b>${label}</b></div>
                               <div class="reading-row"><span>Good Y at this point</span><b>${fmt(Y)}</b></div>
                               <div class="reading-row"><span>Opportunity Cost of 1 more X (in Y)</span><b>${fmt(mrt)}</b></div>
                               <div class="reading-row insight-row">💡 ${note} At X=${X}, giving up ${fmt(mrt)} units of Y buys one more unit of X — and that cost keeps rising as X increases, because resources are progressively less suited to producing X.</div>`
                };
            },
            practice: [
                { prompt: 'With Point Type = "On the Frontier", raise Good X output from 5 to 25. Does the Opportunity Cost of X rise or fall?', hint: 'It rises steadily (MRT = 2X/C) — the Law of Increasing Opportunity Cost, visible directly in the readings panel.' },
                { prompt: 'Switch Point Type to "Inside (Inefficient)" at the same X. What real-world situation does this represent?', hint: 'Unemployed resources, or resources not used in their most productive way — the economy is producing less than it could of both goods.' }
            ],
            challenge: {
                prompt: 'On the Frontier, find an X where the Opportunity Cost of one more unit of X exceeds 1.5 units of Y.',
                check(state, metrics) { return metrics && metrics.pointType === 'on' && metrics.mrt > 1.5; }
            }
        },
        {
            id: 'micro-positive-normative',
            module: 'micro',
            title: 'Positive vs Normative Economics',
            desc: 'Classify economic statements as positive (testable claims) or normative (value judgements).',
            class: 'XI', part: 'B', unit: 4, unitTitle: 'Introduction', topicLabel: 'Positive vs Normative Economics; Micro vs Macro',
            syllabusIds: ['XI-B-U4-BRANCHES'],
            mode: 'explorer',
            concept: '<p><b>Positive economics</b> deals with statements that can be tested against facts — "what is". <b>Normative economics</b> deals with value judgements about what <i>should</i> be — "what ought to be". <b>Microeconomics</b> studies individual units (a household, a firm, a market); <b>Macroeconomics</b> studies the economy as a whole (national income, price level, employment). Classify each statement below.</p>',
            formulas: [],
            explorer: {
                type: 'cards',
                cards: [
                    { prompt: '"India\'s GDP grew by 7.2% last year."', options: ['Positive', 'Normative'], correctIndex: 0, explain: 'Positive — it is a factual, testable claim about a measured quantity.' },
                    { prompt: '"The government should reduce income inequality."', options: ['Positive', 'Normative'], correctIndex: 1, explain: 'Normative — "should" signals a value judgement about what ought to happen.' },
                    { prompt: '"A price ceiling below equilibrium causes a shortage."', options: ['Positive', 'Normative'], correctIndex: 0, explain: 'Positive — this is a testable prediction from demand-supply theory, not a value judgement.' },
                    { prompt: '"Farmers deserve a higher Minimum Support Price."', options: ['Positive', 'Normative'], correctIndex: 1, explain: '"Deserve" is a value judgement — Normative.' },
                    { prompt: '"How a single firm decides how much wheat to produce."', options: ['Microeconomics', 'Macroeconomics'], correctIndex: 0, explain: 'Microeconomics — this is about one individual economic unit (a firm), not the whole economy.' },
                    { prompt: '"Why India\'s overall price level (inflation) rose this year."', options: ['Microeconomics', 'Macroeconomics'], correctIndex: 1, explain: 'Macroeconomics — the general price level is an economy-wide aggregate, not one firm or household.' }
                ]
            },
            practice: [
                { prompt: 'Write one positive and one normative sentence about the same topic (e.g. unemployment).', hint: 'Positive: "Unemployment rose to 7% this quarter." Normative: "The government should do more to reduce unemployment."' }
            ]
        },
        {
            id: 'micro-indifference-curve',
            module: 'micro',
            title: "Consumer Equilibrium: Indifference Curve Analysis",
            desc: 'Budget line meets the highest attainable indifference curve — drag Income and Prices and watch the tangency point move.',
            class: 'XI', part: 'B', unit: 5, unitTitle: "Consumer's Equilibrium and Demand", topicLabel: 'Indifference Curve Analysis',
            syllabusIds: ['XI-B-U5-IC'],
            mode: 'simulator',
            concept: '<p>Indifference Curve analysis models consumer choice without needing to measure utility in numbers. The <b>budget line</b> (Px·X + Py·Y = Income) shows every bundle the consumer can just afford. An <b>indifference curve</b> joins bundles giving equal satisfaction; the full <b>indifference map</b> is a family of such curves — higher curves mean more satisfaction. <b>Consumer equilibrium</b> is where the budget line is <i>tangent</i> to the highest indifference curve it can reach — at that point, the slope of the indifference curve (MRS) equals the slope of the budget line (the price ratio Px/Py).</p>',
            formulas: ['Budget Line: Px·X + Py·Y = Income', 'Equilibrium condition: MRS = Px / Py', 'Cobb-Douglas demand at equilibrium: X* = a·(Income/Px), Y* = (1−a)·(Income/Py)'],
            controls: [
                { id: 'income', label: 'Money Income', min: 50, max: 300, step: 10, value: 150, unit: '₹' },
                { id: 'px', label: 'Price of X (Px)', min: 2, max: 20, step: 1, value: 5, unit: '₹' },
                { id: 'py', label: 'Price of Y (Py)', min: 2, max: 20, step: 1, value: 5, unit: '₹' },
                { id: 'pref', label: 'Preference Weight for X (a)', min: 0.2, max: 0.8, step: 0.1, value: 0.5, unit: '' }
            ],
            compute(v) {
                const M = v.income, Px = v.px, Py = v.py, a = v.pref;
                const Xstar = a * M / Px;
                const Ystar = (1 - a) * M / Py;
                const Ustar = Math.pow(Xstar, a) * Math.pow(Ystar, 1 - a);
                const mrs = (a / (1 - a)) * (Ystar / Xstar);
                const priceRatio = Px / Py;

                const xMaxBudget = M / Px;
                const xsBudget = range(41).map(i => (i / 40) * xMaxBudget);
                const ysBudget = xsBudget.map(x => Math.max(0, (M - Px * x) / Py));

                function icCurve(u, xMax) {
                    const xs = range(60).map(i => Math.max(0.3, (i / 59) * xMax));
                    return { xs, ys: xs.map(x => Math.pow(u / Math.pow(x, a), 1 / (1 - a))) };
                }
                const xMaxIC = xMaxBudget * 1.6;
                const icMid = icCurve(Ustar, xMaxIC);
                const icLow = icCurve(Ustar * 0.6, xMaxIC);
                const icHigh = icCurve(Ustar * 1.5, xMaxIC);
                const yAxisMax = Math.max(...ysBudget, Ystar) * 1.7;

                return {
                    traces: [
                        { x: icLow.xs, y: icLow.ys, mode: 'lines', name: 'Lower IC (attainable, not chosen)', line: { color: '#a5b4fc', width: 2, dash: 'dot' } },
                        { x: icMid.xs, y: icMid.ys, mode: 'lines', name: 'IC through Equilibrium', line: { color: '#6366f1', width: 3 } },
                        { x: icHigh.xs, y: icHigh.ys, mode: 'lines', name: 'Higher IC (unattainable)', line: { color: '#c4b5fd', width: 2, dash: 'dash' } },
                        { x: xsBudget, y: ysBudget, mode: 'lines', name: 'Budget Line', line: { color: '#f59e0b', width: 3 } },
                        { x: [Xstar], y: [Ystar], mode: 'markers', name: 'Consumer Equilibrium', marker: { color: '#ef4444', size: 12 } }
                    ],
                    layout: { xaxis: { title: 'Good X', range: [0, xMaxBudget * 1.3] }, yaxis: { title: 'Good Y', range: [0, yAxisMax] } },
                    metrics: { X: Xstar, Y: Ystar, mrs, priceRatio },
                    readings: `<div class="reading-row"><span>Equilibrium Quantity of X</span><b>${fmt(Xstar)}</b></div>
                               <div class="reading-row"><span>Equilibrium Quantity of Y</span><b>${fmt(Ystar)}</b></div>
                               <div class="reading-row"><span>MRS at Equilibrium</span><b>${fmt(mrs)}</b></div>
                               <div class="reading-row"><span>Price Ratio (Px/Py)</span><b>${fmt(priceRatio)}</b></div>
                               <div class="reading-row insight-row">💡 The budget line just touches (is tangent to) the middle indifference curve exactly at the red point — that's why MRS ≈ Price Ratio there (${fmt(mrs)} ≈ ${fmt(priceRatio)}). The lower curve is attainable but gives less satisfaction; the higher curve would be preferred but costs more than the budget allows.</div>`
                };
            },
            practice: [
                { prompt: 'Raise Px only. Does the consumer buy more or less X at the new equilibrium?', hint: 'Less — X* = a·Income/Px falls as Px rises, and the budget line pivots inward on the X-axis.' },
                { prompt: 'Raise Income only, keeping both prices fixed. Do X* and Y* rise together?', hint: 'Yes — with this Cobb-Douglas preference, both goods are normal goods, so equilibrium quantities of both rise proportionally with income.' }
            ],
            challenge: {
                prompt: 'Adjust Px and Py so that MRS at equilibrium equals exactly 1 (±0.05).',
                check(state, metrics) { return metrics && Math.abs(metrics.mrs - 1) < 0.05; }
            }
        },
        {
            id: 'micro-revenue-producer-equilibrium',
            module: 'micro',
            title: 'Revenue Curves (TR/AR/MR) & Producer Equilibrium',
            desc: 'See how Total/Average/Marginal Revenue relate, and find the profit-maximising output where MR = MC.',
            class: 'XI', part: 'B', unit: 6, unitTitle: 'Producer Behaviour and Supply', topicLabel: 'Revenue (TR/AR/MR) & Producer Equilibrium (MR=MC)',
            syllabusIds: ['XI-B-U6-REVENUE', 'XI-B-U6-PRODUCER-EQ'],
            mode: 'simulator',
            concept: '<p><b>Total Revenue (TR)</b> = Price × Quantity sold. <b>Average Revenue (AR)</b> = TR/Q — which is always just the price per unit. <b>Marginal Revenue (MR)</b> = the extra revenue from selling one more unit. Under <b>Perfect Competition</b> a firm is a price-taker, so AR = MR = Price (a flat line) — every extra unit sells at the same market price. A firm reaches <b>Producer\'s Equilibrium</b> — the profit-maximising output — where <b>MR = MC</b>, with MC rising through that point. (The "Downward-Sloping Demand" option is shown only as a contrast to make AR=MR=P under perfect competition easier to see — the syllabus\'s Unit 7 scope is Perfect Competition specifically.)</p>',
            formulas: ['TR = P × Q', 'AR = TR / Q', 'MR = ΔTR / ΔQ', 'Perfect Competition: AR = MR = Price (constant)', "Producer's Equilibrium: MR = MC, with MC rising"],
            controls: [
                {
                    id: 'marketType', label: 'Market Type', type: 'select', value: 'perfect',
                    options: [
                        { value: 'perfect', label: 'Perfect Competition (AR=MR=P)' },
                        { value: 'downward', label: 'Downward-Sloping Demand (contrast)' }
                    ]
                },
                { id: 'price', label: 'Market Price (Perfect Competition)', min: 10, max: 90, step: 5, value: 50, unit: '₹', showWhen: { id: 'marketType', equals: 'perfect' } },
                { id: 'mcBase', label: 'Marginal Cost — Base', min: 2, max: 40, step: 2, value: 10, unit: '₹' },
                { id: 'mcSlope', label: 'Marginal Cost — Slope', min: 0.5, max: 5, step: 0.5, value: 2, unit: '' },
                { id: 'fc', label: 'Fixed Cost', min: 0, max: 100, step: 10, value: 20, unit: '₹' }
            ],
            compute(v) {
                const qs = range(31);
                const mcBase = v.mcBase, mcSlope = v.mcSlope, fc = v.fc;
                const mcOf = q => mcBase + mcSlope * q;
                let arOf, mrOf, Qstar;
                if (v.marketType === 'perfect') {
                    const P = v.price;
                    arOf = () => P; mrOf = () => P;
                    Qstar = Math.max(0, (P - mcBase) / mcSlope);
                } else {
                    const a = 100, b = 2;
                    arOf = q => Math.max(0, a - b * q); mrOf = q => a - 2 * b * q;
                    Qstar = Math.max(0, (a - mcBase) / (2 * b + mcSlope));
                }
                Qstar = Math.min(30, Qstar);
                const MRatQstar = mrOf(Qstar);
                const MCatQstar = mcOf(Qstar);
                const AR = arOf(Qstar);
                const TR = AR * Qstar;
                const TC = fc + mcBase * Qstar + (mcSlope * Qstar * Qstar) / 2;
                const profit = TR - TC;

                return {
                    traces: [
                        { x: qs, y: qs.map(arOf), mode: 'lines', name: 'AR (= Demand/Price)', line: { color: '#2563eb', width: 3 } },
                        { x: qs, y: qs.map(mrOf), mode: 'lines', name: 'MR', line: { color: '#10b981', width: 3 } },
                        { x: qs, y: qs.map(mcOf), mode: 'lines', name: 'MC', line: { color: '#f59e0b', width: 3 } },
                        { x: [Qstar], y: [MRatQstar], mode: 'markers', name: 'Producer Equilibrium (MR=MC)', marker: { color: '#ef4444', size: 12 } }
                    ],
                    layout: { xaxis: { title: 'Output (Q)', range: [0, 30] }, yaxis: { title: '₹ per unit', range: [0, 110] } },
                    metrics: { Qstar, MRatQstar, MCatQstar, profit, TR, TC },
                    readings: `<div class="reading-row"><span>Producer's Equilibrium Output (Q*)</span><b>${fmt(Qstar)}</b></div>
                               <div class="reading-row"><span>MR at Q*</span><b>₹${fmt(MRatQstar)}</b></div>
                               <div class="reading-row"><span>MC at Q*</span><b>₹${fmt(MCatQstar)}</b></div>
                               <div class="reading-row"><span>Total Revenue at Q*</span><b>₹${fmt(TR)}</b></div>
                               <div class="reading-row"><span>Profit (TR − TC)</span><b>₹${fmt(profit)}</b></div>
                               <div class="reading-row insight-row">💡 The red point marks where MR = MC — the profit-maximising output. ${v.marketType === 'perfect' ? 'Because this firm is a price-taker, AR and MR sit on the same flat line at the market price.' : 'With a downward-sloping demand curve, MR falls twice as fast as AR/Price — a standard contrast case, shown here to make the perfect-competition AR=MR result easier to recognise.'}</div>`
                };
            },
            practice: [
                { prompt: 'In Perfect Competition mode, why do the AR and MR lines sit exactly on top of each other?', hint: 'A price-taking firm sells every unit at the same market price, so each extra unit adds exactly that price to revenue — AR = MR = P.' },
                { prompt: 'Raise the Marginal Cost Slope. Does the profit-maximising output rise or fall?', hint: 'It falls — a steeper MC curve crosses MR at a lower quantity.' }
            ],
            challenge: {
                prompt: "Find inputs where the Producer's Equilibrium Output exceeds 15 units AND profit is positive.",
                check(state, metrics) { return metrics && metrics.Qstar > 15 && metrics.profit > 0; }
            }
        },
        {
            id: 'micro-elasticity-supply',
            module: 'micro',
            title: 'Price Elasticity of Supply',
            desc: 'See how the time period a producer has to respond changes how elastic supply is.',
            class: 'XI', part: 'B', unit: 6, unitTitle: 'Producer Behaviour and Supply', topicLabel: 'Price Elasticity of Supply',
            syllabusIds: ['XI-B-U6-SUPPLY'],
            mode: 'simulator',
            concept: '<p><b>Price elasticity of supply (Es)</b> measures how much quantity supplied responds to a price change. Its biggest determinant is the <b>time period</b> a producer has to adjust: in the very short <b>market period</b> output is nearly fixed (supply is highly inelastic — think of a fish market where today\'s catch is already fixed); in the <b>short run</b> firms can vary some inputs (moderately elastic); in the <b>long run</b> firms can build new capacity entirely (highly elastic).</p>',
            formulas: ['Es = (%ΔQs) / (%ΔP)', 'Point elasticity: Es = (dQ/dP) × (P/Q)', 'Supply: Q = 5 + d·P, where d depends on the time period'],
            controls: [
                {
                    id: 'period', label: 'Time Period', type: 'select', value: 'short',
                    options: [
                        { value: 'market', label: 'Market Period (almost fixed)' },
                        { value: 'short', label: 'Short Run' },
                        { value: 'long', label: 'Long Run (most flexible)' }
                    ]
                },
                { id: 'price', label: 'Price (₹)', min: 5, max: 95, step: 5, value: 40, unit: '' }
            ],
            compute(v) {
                const slopes = { market: 0.05, short: 0.5, long: 2 };
                const d = slopes[v.period];
                const c = 5;
                const P = v.price;
                const Q = Math.max(0.01, c + d * P);
                const Es = d * (P / Q);
                const ps = range(20).map(i => i * 5);
                const qs = ps.map(p => c + d * p);
                const label = Es > 1 ? 'Elastic' : Es < 1 ? 'Inelastic' : 'Unit Elastic';
                return {
                    traces: [
                        { x: qs, y: ps, mode: 'lines', name: 'Supply', line: { color: '#f59e0b', width: 3 } },
                        { x: [Q], y: [P], mode: 'markers', name: 'Current Point', marker: { color: '#ef4444', size: 10 } }
                    ],
                    layout: { xaxis: { title: 'Quantity Supplied', range: [0, 200] }, yaxis: { title: 'Price (₹)', range: [0, 100] } },
                    metrics: { Es, period: v.period },
                    readings: `<div class="reading-row"><span>Quantity Supplied</span><b>${fmt(Q)}</b></div>
                               <div class="reading-row"><span>Price Elasticity of Supply (Es)</span><b>${fmt(Es)}</b></div>
                               <div class="reading-row"><span>Classification</span><b>${label}</b></div>
                               <div class="reading-row insight-row">💡 ${v.period === 'market' ? 'In the market period, output is already produced and nearly fixed — supply barely responds to price, so Es is close to 0.' : v.period === 'long' ? 'In the long run, producers can build new capacity or exit the industry entirely — supply responds strongly to price, so Es is well above 1.' : 'In the short run, firms can vary some inputs (e.g. overtime, more raw material) but not fixed capacity — a middling elasticity.'}</div>`
                };
            },
            practice: [
                { prompt: 'Keep Price fixed and switch from Market Period → Short Run → Long Run. What happens to Es?', hint: 'Es rises sharply at each step — more time to adjust production means a much bigger quantity response to the same price change.' }
            ],
            challenge: {
                prompt: 'Find a Time Period + Price combination with Es > 1 (elastic supply).',
                check(state, metrics) { return metrics && metrics.Es > 1; }
            }
        }
    );
}
