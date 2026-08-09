// Extends the base SIMS array (js/simulations.js) with 12 more labs so
// every module reaches the count promised on the home page:
// Microeconomics 6, Macroeconomics 6, Statistics 3, Indian Economy 3.

if (typeof SIMS !== 'undefined') {
    SIMS.push(
        // ── MICROECONOMICS ─────────────────────────────────────────
        {
            id: 'micro-consumer-equilibrium',
            module: 'micro',
            title: 'Consumer Equilibrium (Marginal Utility)',
            desc: 'See how diminishing marginal utility shapes the consumer\'s choice.',
            concept: '<p>The Law of Diminishing Marginal Utility states that as a consumer consumes more units of a good, the additional (marginal) utility from each extra unit falls. A rational consumer keeps consuming as long as marginal utility is positive.</p>',
            formulas: ['MU = ΔTU / ΔQ', 'TU = Σ MU', 'Consumer stops at MU = 0 (satiation point)'],
            controls: [
                { id: 'q', label: 'Units Consumed (Q)', min: 0, max: 20, step: 1, value: 5, unit: '' }
            ],
            compute(v) {
                const a = 20, b = 1, Q = v.q;
                const qs = range(21);
                const mus = qs.map(q => a - b * q);
                const MU = a - b * Q;
                const TU = a * Q - (b * Q * Q) / 2;
                return {
                    traces: [
                        { x: qs, y: mus, mode: 'lines', name: 'Marginal Utility', line: { color: '#2563eb', width: 3 } },
                        { x: [Q], y: [MU], mode: 'markers', name: 'Current MU', marker: { color: '#ef4444', size: 10 } },
                        { x: qs, y: qs.map(() => 0), mode: 'lines', name: 'Zero Utility', line: { color: '#9ca3af', dash: 'dot' } }
                    ],
                    layout: { xaxis: { title: 'Units Consumed (Q)' }, yaxis: { title: 'Utility (Utils)', range: [-5, 22] } },
                    readings: `<div class="reading-row"><span>Marginal Utility at Q</span><b>${fmt(MU)}</b></div>
                               <div class="reading-row"><span>Total Utility</span><b>${fmt(TU)}</b></div>`
                };
            }
        },
        {
            id: 'micro-producer-costs',
            module: 'micro',
            title: 'Producer Costs (AC & MC)',
            desc: 'Explore how average and marginal cost curves relate to output.',
            concept: '<p>Average Cost (AC) typically falls and then rises as output increases, forming a U-shape. Marginal Cost (MC) cuts AC at its minimum point — while MC is below AC, average cost is still falling; once MC rises above AC, average cost starts rising too.</p>',
            formulas: ['TC = FC + VC', 'AC = TC / Q', 'MC = ΔTC / ΔQ'],
            controls: [
                { id: 'q', label: 'Output Level (Q)', min: 1, max: 30, step: 1, value: 10, unit: '' }
            ],
            compute(v) {
                const a = 100, b = 5, c = 0.3, Q = v.q;
                const qs = range(30).map(i => i + 1);
                const acs = qs.map(q => a / q + b + c * q);
                const mcs = qs.map(q => b + 2 * c * q);
                const AC = a / Q + b + c * Q, MC = b + 2 * c * Q;
                return {
                    traces: [
                        { x: qs, y: acs, mode: 'lines', name: 'Average Cost (AC)', line: { color: '#2563eb', width: 3 } },
                        { x: qs, y: mcs, mode: 'lines', name: 'Marginal Cost (MC)', line: { color: '#f59e0b', width: 3 } },
                        { x: [Q], y: [AC], mode: 'markers', name: 'AC at Q', marker: { color: '#2563eb', size: 9 } },
                        { x: [Q], y: [MC], mode: 'markers', name: 'MC at Q', marker: { color: '#f59e0b', size: 9 } }
                    ],
                    layout: { xaxis: { title: 'Output (Q)' }, yaxis: { title: 'Cost (₹)', range: [0, 60] } },
                    readings: `<div class="reading-row"><span>Average Cost at Q</span><b>₹${fmt(AC)}</b></div>
                               <div class="reading-row"><span>Marginal Cost at Q</span><b>₹${fmt(MC)}</b></div>
                               <div class="reading-row"><span>AC is currently</span><b>${MC < AC ? 'Falling' : 'Rising'}</b></div>`
                };
            }
        },
        {
            id: 'micro-price-controls',
            module: 'micro',
            title: 'Price Ceiling & Price Floor',
            desc: 'See how government price controls create shortages or surpluses.',
            concept: '<p>A <b>price ceiling</b> set below the free-market equilibrium price causes a shortage (quantity demanded exceeds quantity supplied). A <b>price floor</b> set above equilibrium causes a surplus (quantity supplied exceeds quantity demanded).</p>',
            formulas: ['Demand: P = 100 − Q', 'Supply: P = 20 + Q', 'Shortage/Surplus = |Qd − Qs| at the controlled price'],
            controls: [
                { id: 'ctrl', label: 'Government Price Control (₹)', min: 20, max: 100, step: 5, value: 60, unit: '' }
            ],
            compute(v) {
                const a = 100, b = 1, c = 20, d = 1;
                const { Q: Qe, P: Pe } = lineIntersect(a, b, c, d);
                const ctrl = v.ctrl;
                const qd = Math.max(a - b * ctrl, 0);
                const qs = Math.max((ctrl - c) / d, 0);
                const isCeiling = ctrl < Pe;
                const gap = isCeiling ? qd - qs : qs - qd;
                const qsAxis = range(101);
                return {
                    traces: [
                        { x: qsAxis, y: qsAxis.map(q => a - b * q), mode: 'lines', name: 'Demand', line: { color: '#2563eb', width: 3 } },
                        { x: qsAxis, y: qsAxis.map(q => c + d * q), mode: 'lines', name: 'Supply', line: { color: '#f59e0b', width: 3 } },
                        { x: [0, 100], y: [ctrl, ctrl], mode: 'lines', name: isCeiling ? 'Price Ceiling' : 'Price Floor', line: { color: '#ef4444', width: 2, dash: 'dash' } },
                        { x: [Qe], y: [Pe], mode: 'markers', name: 'Free-Market Equilibrium', marker: { color: '#10b981', size: 9 } }
                    ],
                    layout: { xaxis: { title: 'Quantity', range: [0, 100] }, yaxis: { title: 'Price (₹)', range: [0, 100] } },
                    readings: `<div class="reading-row"><span>Free-Market Equilibrium</span><b>₹${fmt(Pe)} / ${fmt(Qe)} units</b></div>
                               <div class="reading-row"><span>Control Type</span><b>${isCeiling ? 'Price Ceiling' : 'Price Floor'}</b></div>
                               <div class="reading-row"><span>${isCeiling ? 'Shortage' : 'Surplus'}</span><b>${fmt(Math.max(gap, 0))} units</b></div>`
                };
            }
        },
        {
            id: 'micro-market-structures',
            module: 'micro',
            title: 'Market Structures: Competition vs Monopoly',
            desc: 'Compare price and output under perfect competition and monopoly.',
            concept: '<p>Under perfect competition, firms are price-takers and produce where price equals marginal cost. A monopolist restricts output to where marginal revenue equals marginal cost, resulting in a higher price and lower quantity than under competition.</p>',
            formulas: ['Perfect Competition: P = MC', 'Monopoly: MR = MC, where MR = 100 − 2Q (demand P = 100 − Q)'],
            controls: [
                { id: 'mc', label: 'Marginal Cost (₹)', min: 10, max: 60, step: 5, value: 20, unit: '' }
            ],
            compute(v) {
                const mc = v.mc;
                const Qc = 100 - mc, Pc = mc;
                const Qm = (100 - mc) / 2, Pm = 100 - Qm;
                return {
                    traces: [
                        { x: ['Perfect Competition', 'Monopoly'], y: [Pc, Pm], name: 'Price (₹)', type: 'bar', marker: { color: '#2563eb' } },
                        { x: ['Perfect Competition', 'Monopoly'], y: [Qc, Qm], name: 'Quantity', type: 'bar', marker: { color: '#f59e0b' }, yaxis: 'y2' }
                    ],
                    layout: {
                        yaxis: { title: 'Price (₹)', range: [0, 100] },
                        yaxis2: { title: 'Quantity', overlaying: 'y', side: 'right', range: [0, 100] },
                        barmode: 'group'
                    },
                    readings: `<div class="reading-row"><span>Competitive Price / Qty</span><b>₹${fmt(Pc)} / ${fmt(Qc)}</b></div>
                               <div class="reading-row"><span>Monopoly Price / Qty</span><b>₹${fmt(Pm)} / ${fmt(Qm)}</b></div>
                               <div class="reading-row"><span>Effect of Monopoly</span><b>Higher price, lower output</b></div>`
                };
            }
        },

        // ── MACROECONOMICS ─────────────────────────────────────────
        {
            id: 'macro-money-creation',
            module: 'macro',
            title: 'Credit / Money Creation',
            desc: 'See how banks multiply an initial deposit through successive lending.',
            concept: '<p>When a bank keeps only a fraction of deposits as reserves (the Legal Reserve Ratio) and lends out the rest, that lending becomes a new deposit elsewhere in the banking system. This process repeats, creating a total money supply many times the original deposit.</p>',
            formulas: ['Credit Multiplier = 1 / LRR', 'Total Deposits Created = Initial Deposit × (1 / LRR)'],
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
                return {
                    traces: [{ x: vals.map((_, i) => `Round ${i + 1}`), y: vals, type: 'bar', marker: { color: '#2563eb' } }],
                    layout: { xaxis: { title: 'Successive Deposit Rounds' }, yaxis: { title: 'New Deposit (₹)' }, showlegend: false },
                    readings: `<div class="reading-row"><span>Money Multiplier (1/LRR)</span><b>${fmt(1 / r)}</b></div>
                               <div class="reading-row"><span>Total Money Created</span><b>₹${fmt(totalMoney, 0)}</b></div>`
                };
            }
        },
        {
            id: 'macro-govt-budget',
            module: 'macro',
            title: 'Government Budget',
            desc: 'Compare government receipts and expenditure and see the resulting deficits.',
            concept: '<p>The government budget records planned receipts (revenue + capital) and expenditure (revenue + capital) for the year. When expenditure exceeds receipts, the shortfall shows up as a deficit — the revenue deficit and fiscal deficit are two key measures used to judge the budget\'s health.</p>',
            formulas: ['Revenue Deficit = Revenue Expenditure − Revenue Receipts', 'Fiscal Deficit = Total Expenditure − Total Receipts (excl. borrowings)'],
            controls: [
                { id: 'rr', label: 'Revenue Receipts (₹B)', min: 50, max: 300, step: 10, value: 150, unit: '' },
                { id: 're', label: 'Revenue Expenditure (₹B)', min: 50, max: 300, step: 10, value: 180, unit: '' }
            ],
            compute(v) {
                const revenueReceipts = v.rr, capitalReceipts = 60, revenueExp = v.re, capitalExp = 90;
                const totalReceipts = revenueReceipts + capitalReceipts, totalExp = revenueExp + capitalExp;
                const revenueDeficit = revenueExp - revenueReceipts;
                const fiscalDeficit = totalExp - totalReceipts;
                return {
                    traces: [{
                        x: ['Revenue Receipts', 'Capital Receipts', 'Revenue Exp.', 'Capital Exp.'],
                        y: [revenueReceipts, capitalReceipts, revenueExp, capitalExp],
                        type: 'bar',
                        marker: { color: ['#10b981', '#34d399', '#f87171', '#f97316'] }
                    }],
                    layout: { yaxis: { title: '₹ Billion' }, showlegend: false },
                    readings: `<div class="reading-row"><span>Total Receipts</span><b>₹${fmt(totalReceipts, 0)}B</b></div>
                               <div class="reading-row"><span>Total Expenditure</span><b>₹${fmt(totalExp, 0)}B</b></div>
                               <div class="reading-row"><span>Revenue Deficit</span><b>₹${fmt(Math.max(revenueDeficit, 0), 0)}B</b></div>
                               <div class="reading-row"><span>Fiscal Deficit (illustrative)</span><b>₹${fmt(Math.max(fiscalDeficit, 0), 0)}B</b></div>`
                };
            }
        },
        {
            id: 'macro-forex',
            module: 'macro',
            title: 'Balance of Payments & Exchange Rate',
            desc: 'See how demand and supply of foreign exchange set the exchange rate.',
            concept: '<p>The exchange rate (₹ per US$) is set where the demand for foreign exchange (driven by imports and capital outflows) equals the supply of foreign exchange (driven by exports and capital inflows). A rise in demand for dollars depreciates the rupee.</p>',
            formulas: ['Demand for $ ↑ ⇒ Rupee depreciates (₹/$ rises)', 'Equilibrium: Demand for $ = Supply of $'],
            controls: [
                { id: 'shift', label: 'Demand for $ Shift (Imports)', min: -30, max: 30, step: 5, value: 0, unit: '' }
            ],
            compute(v) {
                const a = 90 + v.shift, b = 0.5, c = 40, d = 0.5;
                const { Q, P } = lineIntersect(a, b, c, d);
                const qs = range(101);
                return {
                    traces: [
                        { x: qs, y: qs.map(q => a - b * q), mode: 'lines', name: 'Demand for $', line: { color: '#2563eb', width: 3 } },
                        { x: qs, y: qs.map(q => c + d * q), mode: 'lines', name: 'Supply of $', line: { color: '#f59e0b', width: 3 } },
                        { x: [Q], y: [P], mode: 'markers', name: 'Equilibrium Rate', marker: { color: '#ef4444', size: 10 } }
                    ],
                    layout: { xaxis: { title: 'Quantity of US$ (millions)', range: [0, 100] }, yaxis: { title: 'Exchange Rate (₹/$)', range: [0, 100] } },
                    readings: `<div class="reading-row"><span>Equilibrium Exchange Rate</span><b>₹${fmt(P)} / $</b></div>
                               <div class="reading-row"><span>Quantity Traded</span><b>${fmt(Q)}M</b></div>
                               <div class="reading-row"><span>Rupee Trend</span><b>${v.shift > 0 ? 'Depreciating' : v.shift < 0 ? 'Appreciating' : 'Stable'}</b></div>`
                };
            }
        },
        {
            id: 'macro-inflation-gap',
            module: 'macro',
            title: 'Inflationary & Deflationary Gap',
            desc: 'See how aggregate demand shifts create output gaps relative to full employment.',
            concept: '<p>When equilibrium national income exceeds the full-employment level (Yfe), the economy faces an <b>inflationary gap</b> — excess demand pushes prices up. When equilibrium income falls short of Yfe, a <b>deflationary gap</b> exists, with resources left idle.</p>',
            formulas: ['Inflationary Gap: Equilibrium Y > Yfe', 'Deflationary Gap: Equilibrium Y < Yfe'],
            controls: [
                { id: 'ad', label: 'Aggregate Demand Shift', min: -40, max: 40, step: 5, value: 0, unit: '' }
            ],
            compute(v) {
                const Yfe = 200;
                const asA = 10, asB = 0.3;
                const adA = 190 + v.ad, adB = 0.4;
                const Ystar = (adA - asA) / (adB + asB);
                const Pstar = adA - adB * Ystar;
                const ys = range(81).map(i => i * 5);
                const gapType = Ystar > Yfe + 1 ? 'Inflationary Gap' : Ystar < Yfe - 1 ? 'Deflationary Gap' : 'No Gap';
                return {
                    traces: [
                        { x: ys, y: ys.map(y => adA - adB * y), mode: 'lines', name: 'Aggregate Demand', line: { color: '#2563eb', width: 3 } },
                        { x: ys, y: ys.map(y => asA + asB * y), mode: 'lines', name: 'Aggregate Supply', line: { color: '#f59e0b', width: 3 } },
                        { x: [Yfe, Yfe], y: [0, 150], mode: 'lines', name: 'Full Employment (Yfe)', line: { color: '#10b981', dash: 'dash' } },
                        { x: [Ystar], y: [Pstar], mode: 'markers', name: 'Equilibrium', marker: { color: '#ef4444', size: 9 } }
                    ],
                    layout: { xaxis: { title: 'National Income (Y)', range: [0, 400] }, yaxis: { title: 'Price Level', range: [0, 150] } },
                    readings: `<div class="reading-row"><span>Equilibrium Income</span><b>${fmt(Ystar)}</b></div>
                               <div class="reading-row"><span>Full Employment Income (Yfe)</span><b>${Yfe}</b></div>
                               <div class="reading-row"><span>Gap Type</span><b>${gapType}</b></div>
                               <div class="reading-row"><span>Gap Size</span><b>${fmt(Math.abs(Ystar - Yfe))}</b></div>`
                };
            }
        },

        // ── STATISTICS FOR ECONOMICS ────────────────────────────────
        {
            id: 'stats-dispersion',
            module: 'stats',
            title: 'Measures of Dispersion',
            desc: 'See how spread-out data affects mean, standard deviation and CV.',
            concept: '<p>While the mean summarizes the "centre" of a dataset, dispersion measures like standard deviation describe how spread out the values are around that centre. Two datasets can share the same mean yet look very different once you compare their spread.</p>',
            formulas: ['Mean (x̄) = Σx / n', 'SD (σ) = √[Σ(x−x̄)² / n]', 'Coefficient of Variation = (σ / x̄) × 100'],
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
                return {
                    traces: [{ x: data.map((_, i) => `X${i + 1}`), y: data, type: 'bar', marker: { color: '#2563eb' } }],
                    layout: { yaxis: { title: 'Value', range: [0, 100] }, showlegend: false },
                    readings: `<div class="reading-row"><span>Mean</span><b>${fmt(mean)}</b></div>
                               <div class="reading-row"><span>Standard Deviation</span><b>${fmt(sd)}</b></div>
                               <div class="reading-row"><span>Coefficient of Variation</span><b>${fmt(cv)}%</b></div>`
                };
            }
        },
        {
            id: 'stats-index-numbers',
            module: 'stats',
            title: 'Index Numbers',
            desc: 'See how a price index compounds over time with inflation.',
            concept: '<p>An index number expresses the value of a variable in a given period relative to its value in a fixed base period (= 100). A price index tracks how the general price level moves over time relative to that base.</p>',
            formulas: ['Price Index = (Value in Given Year / Value in Base Year) × 100', 'Inflation Rate = % change in Price Index'],
            controls: [
                { id: 'inf', label: 'Annual Inflation Rate (%)', min: 0, max: 15, step: 0.5, value: 6, unit: '%' }
            ],
            compute(v) {
                const years = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'];
                const idx = [100];
                for (let i = 1; i < years.length; i++) idx.push(idx[i - 1] * (1 + v.inf / 100));
                return {
                    traces: [{ x: years, y: idx, mode: 'lines+markers', name: 'Price Index (Base=100)', line: { color: '#2563eb', width: 3 } }],
                    layout: { yaxis: { title: 'Index (Base Year = 100)' }, showlegend: false },
                    readings: `<div class="reading-row"><span>Index in Year 5</span><b>${fmt(idx[4])}</b></div>
                               <div class="reading-row"><span>Cumulative Inflation</span><b>${fmt(idx[4] - 100)}%</b></div>`
                };
            }
        },

        // ── INDIAN ECONOMIC DEVELOPMENT ─────────────────────────────
        {
            id: 'india-human-capital',
            module: 'india',
            title: 'Human Capital Formation',
            desc: 'See how education investment accelerates literacy growth over time.',
            concept: '<p>Human capital formation refers to investment in education, health and training that raises the productive capacity of people. Higher, sustained investment in education tends to raise literacy and skill levels faster over time.</p>',
            formulas: ['Human Capital = Investment in Education + Health + Training', 'Higher literacy & skill levels raise an economy\'s productive capacity'],
            controls: [
                { id: 'edu', label: 'Education Spending (% of GDP)', min: 1, max: 8, step: 0.5, value: 4, unit: '%' }
            ],
            compute(v) {
                const years = ['2000', '2005', '2010', '2015', '2020', '2025'];
                const rate = v.edu / 8;
                const lit = [60];
                for (let i = 1; i < years.length; i++) lit.push(lit[i - 1] + (100 - lit[i - 1]) * 0.25 * rate);
                return {
                    traces: [{ x: years, y: lit, mode: 'lines+markers', name: 'Literacy Rate (%)', line: { color: '#10b981', width: 3 } }],
                    layout: { yaxis: { title: 'Literacy Rate (%)', range: [50, 100] }, showlegend: false },
                    readings: `<div class="reading-row"><span>Projected Literacy (latest)</span><b>${fmt(lit[lit.length - 1])}%</b></div>
                               <div class="reading-row"><span>Insight</span><b>Higher education spending accelerates human capital formation</b></div>`
                };
            }
        },
        {
            id: 'india-employment-structure',
            module: 'india',
            title: 'Structural Transformation of Employment',
            desc: 'See how employment shifts from agriculture to industry and services as the economy grows.',
            concept: '<p>As economies develop, the share of the workforce employed in agriculture typically falls while the shares in industry and services rise — a pattern known as structural transformation, closely tied to rising productivity and incomes.</p>',
            formulas: ['Structural Transformation: labour shifts from Agriculture → Industry & Services as the economy develops'],
            controls: [
                { id: 'yr', label: 'Years of Growth', min: 0, max: 30, step: 1, value: 10, unit: ' yrs' }
            ],
            compute(v) {
                const t = v.yr / 30;
                const agri = 50 - 30 * t;
                const services = 25 + 25 * t;
                const industry = 100 - agri - services;
                return {
                    traces: [{
                        x: ['Agriculture', 'Industry', 'Services'],
                        y: [agri, industry, services],
                        type: 'bar',
                        marker: { color: ['#84cc16', '#f59e0b', '#3b82f6'] }
                    }],
                    layout: { yaxis: { title: 'Share of Employment (%)', range: [0, 100] }, showlegend: false },
                    readings: `<div class="reading-row"><span>Agriculture</span><b>${fmt(agri)}%</b></div>
                               <div class="reading-row"><span>Industry</span><b>${fmt(industry)}%</b></div>
                               <div class="reading-row"><span>Services</span><b>${fmt(services)}%</b></div>`
                };
            }
        }
    );
}
