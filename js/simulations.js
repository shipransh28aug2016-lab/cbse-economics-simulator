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
        title: 'Price Elasticity of Demand',
        desc: 'Understand how elasticity affects consumer and producer behavior.',
        chapter: 'Class XII Microeconomics · Ch. 2: Consumer Equilibrium and Demand (Price Elasticity)',
        concept: '<p>Price elasticity of demand measures how responsive the quantity demanded is to a change in price. Demand is <b>elastic</b> (|Ed| &gt; 1) when quantity changes proportionally more than price, and <b>inelastic</b> (|Ed| &lt; 1) when quantity barely responds.</p>',
        formulas: ['Ed = (%ΔQ) / (%ΔP)', 'Point elasticity: Ed = (dQ/dP) × (P/Q)', 'Demand: Q = 50 − 0.5P'],
        controls: [
            { id: 'price', label: 'Price (₹)', min: 5, max: 95, step: 1, value: 40, unit: '' }
        ],
        compute(v) {
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
        title: 'GDP & Circular Flow',
        desc: 'Track the flow of money through households, firms, government and the foreign sector.',
        chapter: 'Class XII Macroeconomics · Ch. 2: National Income and Related Aggregates (Circular Flow)',
        concept: '<p>The circular flow of income shows how money moves between households, firms, the government and the foreign sector. Government spending injects income into the flow while taxes withdraw it — the size of each flow affects aggregate demand and national income.</p>',
        formulas: ['GDP (expenditure method) = C + I + G + (X − M)', 'Injections = I + G + X', 'Leakages = S + T + M'],
        controls: [
            { id: 'g', label: 'Government Spending (G)', min: 0, max: 100, step: 5, value: 40, unit: '₹B' },
            { id: 'nx', label: 'Net Exports (X − M)', min: -40, max: 40, step: 5, value: 10, unit: '₹B' }
        ],
        compute(v) {
            const wages = 100, consumption = 90, taxes = 35, g = v.g, nx = v.nx;
            const exports = Math.max(nx, 0) + 50, imports = Math.max(-nx, 0) + 50;
            const labels = ['Households', 'Firms', 'Government', 'Foreign Sector'];
            return {
                traces: [{
                    type: 'sankey',
                    orientation: 'h',
                    node: { label: labels, color: ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6'], pad: 20, thickness: 18 },
                    link: {
                        source: [0, 1, 0, 2, 1, 3],
                        target: [1, 0, 2, 0, 3, 1],
                        value: [consumption, wages, taxes, g, exports, imports],
                        color: 'rgba(37,99,235,0.25)'
                    }
                }],
                layout: { showlegend: false },
                readings: `<div class="reading-row"><span>Govt Spending (G)</span><b>₹${g}B</b></div>
                           <div class="reading-row"><span>Net Exports (X−M)</span><b>₹${nx}B</b></div>
                           <div class="reading-row"><span>Injections (G + Exports, est.)</span><b>₹${fmt(g + exports, 0)}B</b></div>
                           <div class="reading-row insight-row">💡 Government spending and exports are <b>injections</b> into the circular flow — raising them increases the flow of income between households and firms and pushes national income up.</div>`
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
        desc: 'Visualize data relationships in a scatter plot.',
        chapter: 'Class XI Statistics for Economics · Ch. 7: Correlation',
        concept: '<p>Correlation measures the strength and direction of the linear relationship between two variables. A coefficient near +1 or −1 indicates a strong relationship; near 0 indicates little to no linear relationship.</p>',
        formulas: ['Karl Pearson\'s r = Σ(x−x̄)(y−ȳ) / √[Σ(x−x̄)² · Σ(y−ȳ)²]', '−1 ≤ r ≤ +1'],
        controls: [
            { id: 'r', label: 'Target Correlation (r)', min: -1, max: 1, step: 0.1, value: 0.7, unit: '' }
        ],
        compute(v) {
            const r = v.r;
            const xs = _corrX;
            const ys = xs.map((x, i) => r * x + Math.sqrt(Math.max(0, 1 - r * r)) * _corrNoise[i]);
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
                    { x: xs, y: ys, mode: 'markers', name: 'Data Points', marker: { color: '#2563eb', size: 8 } }
                ],
                layout: { xaxis: { title: 'X', range: [-4, 4] }, yaxis: { title: 'Y', range: [-4, 4] }, showlegend: false },
                readings: `<div class="reading-row"><span>Sample Correlation (r)</span><b>${fmt(actualR)}</b></div>
                           <div class="reading-row"><span>Interpretation</span><b>${Math.abs(actualR) > 0.7 ? 'Strong' : Math.abs(actualR) > 0.3 ? 'Moderate' : 'Weak'} ${actualR >= 0 ? 'Positive' : 'Negative'}</b></div>
                           <div class="reading-row insight-row">💡 ${actualR >= 0 ? 'As X rises, Y tends to rise too' : 'As X rises, Y tends to fall'} — but remember, correlation only measures the linear relationship and never proves that one variable causes the other.</div>`
            };
        }
    },
    {
        id: 'india-poverty',
        module: 'india',
        title: 'Poverty & Inequality',
        desc: 'Analyze income distribution and poverty lines using the Lorenz curve.',
        chapter: 'Class XI Indian Economic Development · Ch. 4: Poverty',
        concept: '<p>The Lorenz curve plots the cumulative share of income received against the cumulative share of the population. The further it bows away from the diagonal "line of equality", the greater the income inequality — summarized by the Gini coefficient.</p>',
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
