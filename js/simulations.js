// Base simulation set (Microeconomics/Macroeconomics/Statistics/India
// Economy, one flagship sim per module). Additional simulations are
// appended by js/simulations_extended.js to reach the full 18-lab count
// advertised on the home page.
//
// Each entry:
//   id, module, title, desc  — used for cards + navigation
//   concept                  — short HTML explanation shown in the sim screen
//   formulas                 — list of formula strings
//   controls                 — slider definitions: {id,label,min,max,step,value,unit}
//   compute(values)           — returns {traces, layout, readings} for Plotly

const _corrRandN = makeRandN(42);
const _corrX = range(30).map(() => _corrRandN());
const _corrNoise = range(30).map(() => _corrRandN());

const SIMS = [
    {
        id: 'micro-supply-demand',
        module: 'micro',
        title: 'Supply & Demand',
        desc: 'Interact with supply and demand curves to find equilibrium.',
        chapter: 'Class XII Microeconomics · Ch. 2 & 4: Demand, Supply and Market Equilibrium',
        concept: '<p>The equilibrium price and quantity occur where the market demand curve and the market supply curve intersect. Shifting demand — say, due to a change in income, tastes, or a related good\'s price — moves this intersection along the supply curve, changing both the equilibrium price and quantity.</p>',
        formulas: ['Demand: P = 100 − 1.2Q', 'Supply: P = 20 + 0.8Q', 'Equilibrium: Qd = Qs'],
        controls: [
            { id: 'shift', label: 'Demand Shift (Δa)', min: -30, max: 30, step: 1, value: 0, unit: '' }
        ],
        compute(v) {
            const a = 100 + v.shift, b = 1.2, c = 20, d = 0.8;
            const { Q, P } = lineIntersect(a, b, c, d);
            const qs = range(61);
            const demand = qs.map(q => a - b * q);
            const supply = qs.map(q => c + d * q);
            return {
                traces: [
                    { x: qs, y: demand, mode: 'lines', name: 'Demand', line: { color: '#2563eb', width: 3 } },
                    { x: qs, y: supply, mode: 'lines', name: 'Supply', line: { color: '#f59e0b', width: 3 } },
                    { x: [Q], y: [P], mode: 'markers', name: 'Equilibrium', marker: { color: '#ef4444', size: 10 } }
                ],
                layout: { xaxis: { title: 'Quantity', range: [0, 60] }, yaxis: { title: 'Price (₹)', range: [0, 110] } },
                readings: `<div class="reading-row"><span>Equilibrium Price</span><b>₹${fmt(P)}</b></div>
                           <div class="reading-row"><span>Equilibrium Quantity</span><b>${fmt(Q)} units</b></div>
                           <div class="reading-row insight-row">💡 ${v.shift > 0 ? 'Demand shifted right → both equilibrium price and quantity rise.' : v.shift < 0 ? 'Demand shifted left → both equilibrium price and quantity fall.' : 'No shift yet — try moving the slider to see the equilibrium change.'}</div>`
            };
        }
    },
    {
        id: 'micro-elasticity',
        module: 'micro',
        title: 'Elasticity of Demand (Price / Income / Cross)',
        desc: 'Explore all three CBSE-named elasticities of demand in one lab.',
        chapter: 'Class XII Microeconomics · Ch. 2: Consumer Equilibrium and Demand (Price, Income & Cross Elasticity)',
        concept: '<p>The NCERT syllabus names three distinct elasticities of demand. <b>Price elasticity (Ed)</b> measures responsiveness to the good\'s own price. <b>Income elasticity (Ey)</b> measures responsiveness to consumer income — positive for a normal good, negative for an inferior good. <b>Cross elasticity (Exy)</b> measures responsiveness to a <i>related</i> good\'s price — positive for substitutes, negative for complements. Use the switch below to explore all three.</p>',
        formulas: ['Ed = (%ΔQ) / (%ΔP)', 'Point elasticity: Ed = (dQ/dP) × (P/Q)', 'Demand: Q = 50 − 0.5P'],
        controls: [
            {
                id: 'type', label: 'Elasticity Type', type: 'select', value: 'price',
                options: [
                    { value: 'price', label: 'Price (Ed)' },
                    { value: 'income', label: 'Income (Ey)' },
                    { value: 'cross', label: 'Cross (Exy)' }
                ]
            },
            { id: 'price', label: 'Price (₹)', min: 5, max: 95, step: 1, value: 40, unit: '', showWhen: { id: 'type', equals: 'price' } },
            { id: 'income', label: 'Consumer Income (₹\'000/mo)', min: 10, max: 100, step: 5, value: 40, unit: '', showWhen: { id: 'type', equals: 'income' } },
            { id: 'pricey', label: 'Price of Related Good Y (₹)', min: 5, max: 95, step: 1, value: 40, unit: '', showWhen: { id: 'type', equals: 'cross' } }
        ],
        compute(v) {
            if (v.type === 'income') {
                const Y = v.income, Q = Math.max(0.01, 5 + 0.3 * Y);
                const Ey = 0.3 * (Y / Q);
                const ys = range(21).map(i => i * 5);
                const qs = ys.map(y => 5 + 0.3 * y);
                const label = Ey > 1 ? 'Luxury Good' : Ey > 0 ? 'Necessity (Normal Good)' : 'Inferior Good';
                return {
                    traces: [
                        { x: ys, y: qs, mode: 'lines', name: 'Engel Curve', line: { color: '#10b981', width: 3 } },
                        { x: [Y], y: [Q], mode: 'markers', name: 'Current Point', marker: { color: '#ef4444', size: 10 } }
                    ],
                    layout: { xaxis: { title: 'Consumer Income (₹\'000/month)', range: [0, 105] }, yaxis: { title: 'Quantity Demanded', range: [0, 35] } },
                    formulas: ['Ey = (%ΔQ) / (%ΔY)', 'Point elasticity: Ey = (dQ/dY) × (Y/Q)', 'Demand: Q = 5 + 0.3Y (normal good)'],
                    readings: `<div class="reading-row"><span>Quantity Demanded</span><b>${fmt(Q)}</b></div>
                               <div class="reading-row"><span>Income Elasticity (Ey)</span><b>${fmt(Ey)}</b></div>
                               <div class="reading-row"><span>Classification</span><b>${label}</b></div>
                               <div class="reading-row insight-row">💡 Ey &gt; 0 means demand rises with income (a normal good) — Ey &gt; 1 marks it a luxury, 0 &lt; Ey &lt; 1 a necessity. An inferior good (not modeled here) would show Ey &lt; 0.</div>`
                };
            }
            if (v.type === 'cross') {
                const Py = v.pricey, Qx = Math.max(0.01, 10 + 0.5 * Py);
                const Exy = 0.5 * (Py / Qx);
                const pys = range(20).map(i => i * 5);
                const qxs = pys.map(py => 10 + 0.5 * py);
                return {
                    traces: [
                        { x: pys, y: qxs, mode: 'lines', name: 'Demand for X vs Price of Y', line: { color: '#f59e0b', width: 3 } },
                        { x: [Py], y: [Qx], mode: 'markers', name: 'Current Point', marker: { color: '#ef4444', size: 10 } }
                    ],
                    layout: { xaxis: { title: 'Price of Related Good Y (₹)', range: [0, 100] }, yaxis: { title: 'Quantity Demanded of Good X', range: [0, 60] } },
                    formulas: ['Exy = (%ΔQx) / (%ΔPy)', 'Point elasticity: Exy = (dQx/dPy) × (Py/Qx)', 'Demand: Qx = 10 + 0.5Py (X and Y are substitutes)'],
                    readings: `<div class="reading-row"><span>Quantity Demanded of X</span><b>${fmt(Qx)}</b></div>
                               <div class="reading-row"><span>Cross Elasticity (Exy)</span><b>${fmt(Exy)}</b></div>
                               <div class="reading-row"><span>Relationship</span><b>Substitutes (Exy &gt; 0)</b></div>
                               <div class="reading-row insight-row">💡 Exy &gt; 0 (e.g. tea &amp; coffee) means a price rise in Y pushes buyers toward X — they're substitutes. Complements (e.g. car &amp; petrol) would show Exy &lt; 0 instead.</div>`
                };
            }
            const P = v.price, Q = Math.max(0.01, 50 - 0.5 * P);
            const Ed = -0.5 * (P / Q);
            const ps = range(20).map(i => i * 5);
            const qs = ps.map(p => 50 - 0.5 * p);
            const label = Math.abs(Ed) > 1 ? 'Elastic' : Math.abs(Ed) < 1 ? 'Inelastic' : 'Unit Elastic';
            const insight = Math.abs(Ed) > 1
                ? 'Demand is elastic here — a price change causes a proportionally larger change in quantity demanded, so total revenue moves opposite to price.'
                : Math.abs(Ed) < 1
                    ? 'Demand is inelastic here — quantity barely responds to the price change, so total revenue moves with price.'
                    : 'Demand is unit elastic here — %ΔQ exactly equals %ΔP.';
            return {
                traces: [
                    { x: qs, y: ps, mode: 'lines', name: 'Demand', line: { color: '#2563eb', width: 3 } },
                    { x: [Q], y: [P], mode: 'markers', name: 'Current Point', marker: { color: '#ef4444', size: 10 } }
                ],
                layout: { xaxis: { title: 'Quantity', range: [0, 55] }, yaxis: { title: 'Price (₹)', range: [0, 100] } },
                formulas: ['Ed = (%ΔQ) / (%ΔP)', 'Point elasticity: Ed = (dQ/dP) × (P/Q)', 'Demand: Q = 50 − 0.5P'],
                readings: `<div class="reading-row"><span>Quantity Demanded</span><b>${fmt(Q)}</b></div>
                           <div class="reading-row"><span>Point Elasticity (Ed)</span><b>${fmt(Ed)}</b></div>
                           <div class="reading-row"><span>Classification</span><b>${label}</b></div>
                           <div class="reading-row insight-row">💡 ${insight}</div>`
            };
        }
    },
    {
        id: 'macro-gdp',
        module: 'macro',
        title: 'GDP & Circular Flow (Real Flow vs Money Flow)',
        desc: 'Watch the real flow of factors & goods move opposite to the money flow that pays for them.',
        chapter: 'Class XII Macroeconomics · Ch. 2: National Income and Related Aggregates (Circular Flow of Income)',
        concept: '<p>The circular flow has two mirror-image halves that always move in <b>opposite directions</b> for the same transaction. The <b>real flow</b> (dashed wire, square markers) is what physically changes hands: households supply <b>factor services</b> — labour, land, capital, enterprise — to firms, and firms supply <b>goods &amp; services</b> back to households. The <b>money flow</b> (solid wire, round markers) is the payment for it, moving the other way: firms pay <b>factor payments</b> (wages, rent, interest, profit) to households, and households pay <b>consumption expenditure</b> to firms. Government spending and exports are injections into this flow; taxes and imports are leakages out of it.</p><p>This flow of income adds up to <b>GDP</b> (Gross Domestic Product — everything produced <i>within</i> the country). <b>GNP</b> = GDP + income earned abroad by residents − income earned domestically by non-residents. <b>NDP</b>/<b>NNP</b> subtract depreciation (wear-and-tear of capital) from GDP/GNP respectively — "Net" figures reflect only genuinely new output, not just replacing worn-out capital.</p>',
        formulas: [
            'Factor Services HH→Firms (real) moves opposite to Factor Payments Firms→HH (money)',
            'Goods &amp; Services Firms→HH (real) moves opposite to Consumption Exp. HH→Firms (money)',
            'GDP (expenditure method) = C + I + G + (X − M)',
            'GNP = GDP + Net Factor Income from Abroad',
            'NDP/NNP = GDP/GNP − Depreciation',
            'Injections (G + X) vs Leakages (T + M)'
        ],
        controls: [
            { id: 'consumption', label: 'Consumption Expenditure (C)', min: 20, max: 150, step: 5, value: 90, unit: '₹B' },
            { id: 'wages', label: 'Factor Payments — Wages etc. (₹B)', min: 20, max: 150, step: 5, value: 100, unit: '₹B' },
            { id: 'g', label: 'Government Spending (G)', min: 0, max: 100, step: 5, value: 40, unit: '₹B' },
            { id: 'nx', label: 'Net Exports (X − M)', min: -40, max: 40, step: 5, value: 10, unit: '₹B' }
        ],
        // Custom-rendered as an animated SVG instead of a Plotly chart: a
        // static sankey diagram can't show a real flow moving opposite to
        // a money flow, which is the actual concept being taught here. The
        // real flow (factor services / goods & services — dashed wire,
        // square markers) and the money flow (factor payments / consumption
        // — solid wire, round markers) are drawn as two visually distinct
        // rings between Households and Firms, each with its own breathing
        // label naming the transaction, so the opposite-direction
        // relationship is genuinely visible, not just described in text.
        customRender(container, v) {
            const consumption = v.consumption, wages = v.wages, taxes = 35, g = v.g, nx = v.nx;
            const exportsVal = Math.max(nx, 0) + 50, imports = Math.max(-nx, 0) + 50;

            const nodes = {
                hh: { x: 50, y: 195, label: 'Households', icon: '🏠', color: '#6366f1' },
                firm: { x: 450, y: 195, label: 'Firms', icon: '🏭', color: '#10b981' },
                gov: { x: 250, y: 26, label: 'Government', icon: '🏛️', color: '#f59e0b' },
                foreign: { x: 250, y: 364, label: 'Foreign Sector', icon: '🌍', color: '#f43f5e' }
            };

            // IMPORTANT geometry note: `bend` offsets a curve sideways from
            // the straight line between its two points, but the "sideways"
            // direction is relative to *that edge's own* direction — which
            // flips when you reverse (from,to). So to make two
            // opposite-direction edges between the same pair of nodes land
            // on opposite visual sides (instead of re-overlapping on the
            // same side), both edges of a pair must use the SAME bend sign,
            // not one positive and one negated — the direction reversal
            // itself supplies the mirroring.
            const flows = [
                // Money flow (inner ring, solid, round particles): payment
                // moving opposite to whatever real thing it's paying for.
                { id: 'flow-cons', from: nodes.hh, to: nodes.firm, bend: 20, labelOffset: 11, value: consumption, color: '#8b5cf6', kind: 'money', label: 'Consumption Exp. (C)' },
                { id: 'flow-wage', from: nodes.firm, to: nodes.hh, bend: 20, labelOffset: 11, value: wages, color: '#f59e0b', kind: 'money', label: 'Factor Payments (Wages)' },
                // Real flow (outer ring, dashed, square particles): what
                // actually changes hands, sized to match the payment it
                // corresponds to (factor services ≈ what wages pay for;
                // goods & services ≈ what consumption spending buys).
                { id: 'flow-factors', from: nodes.hh, to: nodes.firm, bend: 58, labelOffset: 11, value: wages, color: '#6366f1', kind: 'real', label: 'Factor Services' },
                { id: 'flow-goods', from: nodes.firm, to: nodes.hh, bend: 58, labelOffset: 11, value: consumption, color: '#10b981', kind: 'real', label: 'Goods &amp; Services' },
                // Government & foreign sector: shown as money flows only
                // (matches the standard 4-sector textbook diagram).
                { id: 'flow-tax', from: nodes.hh, to: nodes.gov, bend: 16, labelOffset: 11, value: taxes, color: nodes.gov.color, kind: 'money', label: 'Taxes (T)' },
                { id: 'flow-gspend', from: nodes.gov, to: nodes.hh, bend: 16, labelOffset: 11, value: g, color: nodes.gov.color, kind: 'money', label: 'Govt Spending (G)' },
                { id: 'flow-exp', from: nodes.firm, to: nodes.foreign, bend: 16, labelOffset: 11, value: exportsVal, color: nodes.foreign.color, kind: 'money', label: 'Exports (X)' },
                { id: 'flow-imp', from: nodes.foreign, to: nodes.firm, bend: 16, labelOffset: 11, value: imports, color: nodes.foreign.color, kind: 'money', label: 'Imports (M)' }
            ];

            const maxValue = Math.max(...flows.map(f => f.value), 1);
            const flowsSVG = flows
                .map(f => flowStreamSVG(
                    f.id,
                    curvedPathD(f.from.x, f.from.y, f.to.x, f.to.y, f.bend),
                    f.color, f.value, maxValue,
                    f.kind === 'real' ? { dashed: true, shape: 'square' } : {}
                ))
                .join('');

            // Each label sits further out along the exact same side as its
            // own arc (same bend sign, larger magnitude) so it reads next
            // to its own wire rather than crossing toward the other one —
            // and breathes at the same speed as that wire's particles, so
            // the label itself feels tied to the flow it names.
            const labelsSVG = flows
                .map(f => {
                    const ratio = Math.max(0, Math.min(1, f.value / maxValue));
                    const duration = Math.max(1.1, 3.4 - 2.1 * ratio);
                    const pos = curveOffsetPoint(f.from.x, f.from.y, f.to.x, f.to.y, f.bend + f.labelOffset);
                    return flowLabelSVG(pos.x, pos.y, f.label, f.color, duration);
                })
                .join('');

            const nodesSVG = Object.values(nodes)
                .map(n => `
                    <g>
                        <circle cx="${n.x}" cy="${n.y}" r="26" fill="${n.color}26" stroke="${n.color}" stroke-width="2"></circle>
                        <text x="${n.x}" y="${n.y - 1}" text-anchor="middle" font-size="16">${n.icon}</text>
                        <text x="${n.x}" y="${n.y + 17}" text-anchor="middle" font-size="8.5" font-weight="700" fill="#1e1b3a">${n.label}</text>
                    </g>`)
                .join('');

            const legendSVG = `
                <g font-family="Inter, sans-serif">
                    <line x1="8" y1="9" x2="26" y2="9" stroke="#8b5cf6" stroke-width="2.5"></line>
                    <text x="30" y="12" font-size="8" fill="#4b4470">Money Flow (payments)</text>
                    <line x1="8" y1="20" x2="26" y2="20" stroke="#6366f1" stroke-width="2.5" stroke-dasharray="5 4"></line>
                    <text x="30" y="23" font-size="8" fill="#4b4470">Real Flow (factors / goods)</text>
                </g>`;

            container.innerHTML = `
                <svg viewBox="0 0 500 390" class="flow-diagram" preserveAspectRatio="xMidYMid meet" role="img"
                     aria-label="Animated circular flow of income, with every transaction labeled: real flow of factor services and goods moving opposite to the money flow of payments and expenditure, between households, firms, government and the foreign sector">
                    ${flowsSVG}
                    ${nodesSVG}
                    ${labelsSVG}
                    ${legendSVG}
                </svg>`;

            return {
                readings: `<div class="reading-row"><span>Consumption Expenditure (C)</span><b>₹${consumption}B</b></div>
                           <div class="reading-row"><span>Factor Payments (Wages etc.)</span><b>₹${wages}B</b></div>
                           <div class="reading-row"><span>Govt Spending (G)</span><b>₹${g}B</b></div>
                           <div class="reading-row"><span>Net Exports (X−M)</span><b>₹${nx}B</b></div>
                           <div class="reading-row insight-row">💡 Notice the <b>real flow</b> (dashed, square) always moves opposite to the <b>money flow</b> (solid, round) it pays for — Factor Services flow to Firms while Factor Payments flow back to Households, and Goods &amp; Services flow to Households while Consumption Expenditure flows back to Firms. Raising G or exports adds new injections and speeds up the whole flow.</div>`
            };
        }
    },
    {
        id: 'macro-multiplier',
        module: 'macro',
        title: 'The Multiplier Effect',
        desc: 'See how a change in investment leads to a larger change in national income.',
        chapter: 'Class XII Macroeconomics · Ch. 4: Determination of Income and Employment (Investment Multiplier)',
        concept: '<p>Because one person\'s spending is another person\'s income, an initial injection of investment spending triggers successive rounds of consumption spending. The multiplier shows how much larger the final change in income is compared to the initial injection.</p>',
        formulas: ['k = 1 / (1 − MPC)', 'ΔY = k × ΔI', 'AE = C + I = a + MPC×Y + I'],
        controls: [
            { id: 'mpc', label: 'Marginal Propensity to Consume', min: 0.1, max: 0.9, step: 0.05, value: 0.6, unit: '' },
            { id: 'di', label: 'Additional Investment (ΔI)', min: 0, max: 100, step: 5, value: 20, unit: '₹B' }
        ],
        compute(v) {
            const a = 50, I0 = 50, c = v.mpc, dI = v.di;
            const k = 1 / (1 - c);
            const Y0 = (a + I0) / (1 - c);
            const Y1 = (a + I0 + dI) / (1 - c);
            const ys = range(41).map(i => i * 10);
            const ae0 = ys.map(y => a + c * y + I0);
            const ae1 = ys.map(y => a + c * y + I0 + dI);
            return {
                traces: [
                    { x: ys, y: ys, mode: 'lines', name: '45° Line (Y=AE)', line: { color: '#9ca3af', dash: 'dot', width: 2 } },
                    { x: ys, y: ae0, mode: 'lines', name: 'AE (before)', line: { color: '#2563eb', width: 3 } },
                    { x: ys, y: ae1, mode: 'lines', name: 'AE (after ΔI)', line: { color: '#10b981', width: 3 } },
                    { x: [Y0], y: [Y0], mode: 'markers', name: 'Old Equilibrium', marker: { color: '#f59e0b', size: 9 } },
                    { x: [Y1], y: [Y1], mode: 'markers', name: 'New Equilibrium', marker: { color: '#ef4444', size: 9 } }
                ],
                layout: { xaxis: { title: 'National Income (Y)', range: [0, 400] }, yaxis: { title: 'Aggregate Expenditure (AE)', range: [0, 400] } },
                readings: `<div class="reading-row"><span>Multiplier (k)</span><b>${fmt(k)}</b></div>
                           <div class="reading-row"><span>Old Equilibrium Y</span><b>₹${fmt(Y0)}B</b></div>
                           <div class="reading-row"><span>New Equilibrium Y</span><b>₹${fmt(Y1)}B</b></div>
                           <div class="reading-row"><span>ΔY (actual)</span><b>₹${fmt(Y1 - Y0)}B</b></div>
                           <div class="reading-row insight-row">💡 A higher MPC means households spend more of every extra rupee they earn, so each round of spending recycles further — a bigger multiplier and a bigger final change in income for the same ΔI.</div>`
            };
        }
    },
    {
        id: 'stats-correlation',
        module: 'stats',
        title: 'Correlation & Scatter',
        desc: 'Study Hours vs Test Score — visualize how two economic/statistical variables relate.',
        chapter: 'Class XI Statistics for Economics · Ch. 7: Correlation',
        concept: '<p>Correlation measures the strength and direction of the linear relationship between two variables — here, a class\'s weekly study hours and their test scores. A coefficient near +1 or −1 indicates a strong relationship; near 0 indicates little to no linear relationship. This is the same method used to study real economic variable pairs, e.g. advertisement expenditure and sales, or price and quantity demanded. NCERT also covers <b>Spearman\'s Rank Correlation</b> — the same idea applied to <i>ranked</i> (ordinal) data instead of raw numeric values, useful when only relative order matters, e.g. ranking two judges\' preferences.</p>',
        formulas: ['Karl Pearson\'s r = Σ(x−x̄)(y−ȳ) / √[Σ(x−x̄)² · Σ(y−ȳ)²]', 'Spearman\'s Rank r = 1 − [6Σd² / n(n²−1)], d = rank difference', '−1 ≤ r ≤ +1'],
        controls: [
            { id: 'r', label: 'Target Correlation (r)', min: -1, max: 1, step: 0.1, value: 0.7, unit: '' }
        ],
        compute(v) {
            const r = v.r;
            const xsStd = _corrX;
            const ysStd = xsStd.map((x, i) => r * x + Math.sqrt(Math.max(0, 1 - r * r)) * _corrNoise[i]);
            // Rescale the standardized synthetic data into a believable
            // real-world example (Karl Pearson's r is scale-invariant, so
            // this doesn't change the correlation, just the units shown).
            const xs = xsStd.map(x => Math.max(0.5, +(5 + 1.6 * x).toFixed(1)));
            const ys = ysStd.map(y => Math.max(30, Math.min(100, +(70 + 9 * y).toFixed(1))));

            const n = xs.length;
            const xbar = xs.reduce((s, x) => s + x, 0) / n;
            const ybar = ys.reduce((s, y) => s + y, 0) / n;
            let num = 0, dx2 = 0, dy2 = 0;
            for (let i = 0; i < n; i++) {
                num += (xs[i] - xbar) * (ys[i] - ybar);
                dx2 += (xs[i] - xbar) ** 2;
                dy2 += (ys[i] - ybar) ** 2;
            }
            const actualR = num / Math.sqrt(dx2 * dy2);
            return {
                traces: [
                    { x: xs, y: ys, mode: 'markers', name: 'Students', marker: { color: '#2563eb', size: 8 } }
                ],
                layout: { xaxis: { title: 'Study Hours per Week' }, yaxis: { title: 'Test Score (%)' }, showlegend: false },
                readings: `<div class="reading-row"><span>Sample Correlation (r)</span><b>${fmt(actualR)}</b></div>
                           <div class="reading-row"><span>Interpretation</span><b>${Math.abs(actualR) > 0.7 ? 'Strong' : Math.abs(actualR) > 0.3 ? 'Moderate' : 'Weak'} ${actualR >= 0 ? 'Positive' : 'Negative'}</b></div>
                           <div class="reading-row insight-row">💡 ${actualR >= 0 ? 'As study hours rise, test scores tend to rise too' : 'As study hours rise, test scores tend to fall'} — but remember, correlation only measures the linear relationship and never proves that one variable causes the other.</div>`
            };
        }
    },
    {
        id: 'india-poverty',
        module: 'india',
        title: 'Poverty & Inequality',
        desc: 'Analyze income distribution and poverty lines using the Lorenz curve.',
        chapter: 'Class XI Indian Economic Development · Ch. 4: Poverty (Poverty Line & Income Inequality)',
        concept: '<p>NCERT\'s core method for identifying the poor is the <b>poverty line</b> — a calorie-based minimum consumption expenditure (historically ~2400 kcal/day rural, ~2100 kcal/day urban) converted into a rupee cutoff; anyone below it is counted as <b>absolutely poor</b>. Beyond that headline number, economists also study <b>income inequality</b> — how unevenly income is distributed even among the non-poor — using the Lorenz curve and Gini coefficient (standard statistical tools, used here to extend the poverty-line discussion). The Lorenz curve plots the cumulative share of income received against the cumulative share of the population; the further it bows away from the diagonal "line of equality", the greater the inequality.</p>',
        formulas: ['Lorenz Curve: L(p) = p^k', 'Gini Coefficient ≈ (k−1) / (k+1)', 'Gini = 0 → perfect equality; Gini = 1 → perfect inequality'],
        controls: [
            { id: 'e', label: 'Inequality Parameter', min: 0, max: 5, step: 0.25, value: 1.5, unit: '' }
        ],
        compute(v) {
            const k = 1 + v.e;
            const ps = range(21).map(i => i * 0.05);
            const Ls = ps.map(p => Math.pow(p, k));
            const gini = (k - 1) / (k + 1);
            return {
                traces: [
                    { x: ps, y: ps, mode: 'lines', name: 'Line of Equality', line: { color: '#9ca3af', dash: 'dot' } },
                    { x: ps, y: Ls, mode: 'lines', name: 'Lorenz Curve', line: { color: '#ef4444', width: 3 } }
                ],
                layout: { xaxis: { title: 'Cumulative % of Population' }, yaxis: { title: 'Cumulative % of Income' } },
                readings: `<div class="reading-row"><span>Approx. Gini Coefficient</span><b>${fmt(gini)}</b></div>
                           <div class="reading-row"><span>Interpretation</span><b>${gini < 0.3 ? 'Relatively Equal' : gini < 0.5 ? 'Moderate Inequality' : 'High Inequality'}</b></div>
                           <div class="reading-row insight-row">💡 The further the red Lorenz curve bows away from the diagonal line of equality, the more national income is concentrated among fewer people.</div>`
            };
        }
    }
];
