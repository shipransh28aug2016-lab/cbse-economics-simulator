// Base simulation set (Microeconomics/Macroeconomics/Statistics/India
// Economy, one flagship sim per module). Additional simulations are
// appended by js/simulations_extended.js and the newer
// js/simulations_class11_micro.js, js/simulations_statistics_datalab.js,
// js/simulations_macro_datalab.js and js/simulations_ied_class12.js
// files to reach the full curriculum-mapped lab count.
//
// Each entry's data contract:
//   id, module, title, desc          — used for cards + navigation
//   class, part, unit, unitTitle     — 2026-27 curriculum placement (see
//                                       curriculum/Economics_2026-27_Content_MicroContent_Taxonomy.md)
//   syllabusIds                      — CURRICULUM_NODES id(s) this sim covers (js/curriculum-data.js)
//   mode                             — 'simulator' (default), 'datalab', or 'explorer'
//   enrichment, enrichmentNote       — set when content goes beyond the named 2026-27 topic list
//   concept                          — short HTML explanation shown in the sim screen
//   formulas                        — list of formula strings
//   controls                        — slider/select definitions: {id,label,min,max,step,value,unit}
//   compute(values)                  — returns {traces, layout, readings, metrics?} for Plotly
//   practice, challenge              — optional guided-practice checklist + auto-checked challenge

const _corrRandN = makeRandN(42);
const _corrX = range(30).map(() => _corrRandN());
const _corrNoise = range(30).map(() => _corrRandN());

const SIMS = [
    {
        id: 'micro-supply-demand',
        module: 'micro',
        title: 'Supply & Demand: Every Determinant',
        desc: 'Every named CBSE determinant of demand and supply as its own live control — not just one abstract "shift".',
        class: 'XI', part: 'B', unit: '5–7', unitTitle: 'Demand, Supply & Market Equilibrium', topicLabel: 'Every Named Determinant',
        syllabusIds: ['XI-B-U5-DEMAND', 'XI-B-U6-SUPPLY', 'XI-B-U7-MARKET-EQ', 'XI-B-U7-PERFECT-COMP'],
        mode: 'simulator',
        concept: '<p>Demand and supply each shift for specific, named reasons — this lab makes every one of them a separate control instead of one abstract "shift" number. <b>Demand</b> shifts with consumer income, the price of substitute/complement goods, and tastes &amp; preferences. <b>Supply</b> shifts with input/factor costs, technology, and government tax or subsidy policy. Move any factor and watch exactly how it moves its own curve — and the resulting equilibrium.</p><p>This equilibrium is the one taught for a <b>Perfect Competition</b> market — many buyers and sellers, an identical (homogeneous) product, free entry and exit, and every buyer/seller a price-taker rather than a price-setter — which is why one demand curve and one supply curve are enough to pin down a single market price.</p>',
        formulas: [
            'Demand: P = 100 − 1.2Q + (net demand shift)',
            'Supply: P = 20 + 0.8Q + (net supply shift)',
            'Net Demand Shift = ΔIncome + ΔPrice(Substitute) − ΔPrice(Complement) + ΔTastes',
            'Net Supply Shift = ΔInput Cost − ΔTechnology + ΔGovt. Tax(+)/Subsidy(−)',
            'Equilibrium: Qd = Qs'
        ],
        controls: [
            { id: 'income', label: 'Consumer Income', min: -10, max: 10, step: 1, value: 0, unit: '' },
            { id: 'priceSub', label: 'Price of Substitute Good', min: -10, max: 10, step: 1, value: 0, unit: '' },
            { id: 'priceComp', label: 'Price of Complement Good', min: -10, max: 10, step: 1, value: 0, unit: '' },
            { id: 'tastes', label: 'Consumer Tastes & Preferences', min: -10, max: 10, step: 1, value: 0, unit: '' },
            { id: 'inputCost', label: 'Input / Factor Cost', min: -10, max: 10, step: 1, value: 0, unit: '' },
            { id: 'tech', label: 'Technology (improvement)', min: -10, max: 10, step: 1, value: 0, unit: '' },
            { id: 'govt', label: 'Govt. Tax(+) / Subsidy(−)', min: -10, max: 10, step: 1, value: 0, unit: '' }
        ],
        compute(v) {
            const demandShift = v.income + v.priceSub - v.priceComp + v.tastes;
            const supplyShift = v.inputCost - v.tech + v.govt;
            const a = Math.max(20, 100 + demandShift), b = 1.2;
            const c = Math.max(5, 20 + supplyShift), d = 0.8;
            const { Q, P } = lineIntersect(a, b, c, d);
            const qs = range(81);
            const demand = qs.map(q => a - b * q);
            const supply = qs.map(q => c + d * q);

            const factors = [
                { label: 'Income', v: v.income, effect: v.income },
                { label: 'Price of Substitute', v: v.priceSub, effect: v.priceSub },
                { label: 'Price of Complement', v: v.priceComp, effect: -v.priceComp },
                { label: 'Tastes', v: v.tastes, effect: v.tastes },
                { label: 'Input Cost', v: v.inputCost, effect: v.inputCost },
                { label: 'Technology', v: v.tech, effect: -v.tech },
                { label: 'Govt. Tax/Subsidy', v: v.govt, effect: v.govt }
            ].filter(f => f.v !== 0);
            const biggest = factors.length
                ? factors.reduce((m, f) => Math.abs(f.effect) > Math.abs(m.effect) ? f : m)
                : null;

            return {
                traces: [
                    { x: qs, y: demand, mode: 'lines', name: 'Demand', line: { color: '#2563eb', width: 3 } },
                    { x: qs, y: supply, mode: 'lines', name: 'Supply', line: { color: '#f59e0b', width: 3 } },
                    { x: [Q], y: [P], mode: 'markers', name: 'Equilibrium', marker: { color: '#ef4444', size: 10 } }
                ],
                layout: { xaxis: { title: 'Quantity', range: [0, 80] }, yaxis: { title: 'Price (₹)', range: [0, 160] } },
                metrics: { equilibriumPrice: P, equilibriumQuantity: Q, demandShift, supplyShift },
                readings: `<div class="reading-row"><span>Net Demand Shift</span><b>${demandShift >= 0 ? '+' : ''}${demandShift}</b></div>
                           <div class="reading-row"><span>Net Supply Shift</span><b>${supplyShift >= 0 ? '+' : ''}${supplyShift}</b></div>
                           <div class="reading-row"><span>Equilibrium Price</span><b>₹${fmt(P)}</b></div>
                           <div class="reading-row"><span>Equilibrium Quantity</span><b>${fmt(Q)} units</b></div>
                           <div class="reading-row insight-row">💡 ${biggest
                               ? `The biggest mover right now is <b>${biggest.label}</b> (Δ${biggest.v >= 0 ? '+' : ''}${biggest.v}). ${demandShift !== 0 ? (demandShift > 0 ? 'Demand has shifted right (increased)' : 'Demand has shifted left (decreased)') + '. ' : ''}${supplyShift !== 0 ? (supplyShift < 0 ? 'Supply has shifted right (increased) — lower net cost/higher tech/subsidy.' : 'Supply has shifted left (decreased) — higher net cost/tax.') : ''}`
                               : 'All factors are at zero — move any slider to see its own named effect on demand or supply.'}</div>`
            };
        },
        practice: [
            { prompt: 'Move only "Consumer Income" — which curve moves, and which way?', hint: 'Income is a demand determinant — only the Demand line shifts. A positive income change shifts Demand right (more is demanded at every price).' },
            { prompt: 'Move only "Input / Factor Cost" up — which curve moves, and which way?', hint: 'Cost is a supply determinant — only the Supply line shifts, and it shifts left/up: sellers need a higher price to supply the same quantity.' }
        ],
        challenge: {
            prompt: 'Find a mix of demand-side and supply-side factors that pushes the Equilibrium Quantity above 55 units while keeping the Equilibrium Price under ₹65.',
            check(state, metrics) { return !!metrics && metrics.equilibriumQuantity > 55 && metrics.equilibriumPrice < 65; }
        }
    },
    {
        id: 'micro-elasticity',
        module: 'micro',
        title: 'Elasticity of Demand (Price / Income / Cross)',
        desc: 'The CBSE-named Price Elasticity of Demand, plus Income and Cross elasticity as extra contrast.',
        class: 'XI', part: 'B', unit: 5, unitTitle: "Consumer's Equilibrium and Demand", topicLabel: 'Price Elasticity of Demand',
        syllabusIds: ['XI-B-U5-ELASTICITY'],
        mode: 'simulator',
        concept: '<p>The 2026–27 Class XI Microeconomics unit names <b>Price elasticity of demand (Ed)</b> — responsiveness to the good\'s own price — with its determinants (substitutes, necessity vs luxury, share of income, time) and its two measurement methods (percentage-change, total-expenditure). This lab also lets you explore <b>Income elasticity (Ey)</b> and <b>Cross elasticity (Exy)</b> as useful contrast — they sharpen what "elasticity" means in general, even though the supplied 2026–27 topic list names price elasticity specifically, not these two by name.</p>',
        formulas: ['Ed = (%ΔQ) / (%ΔP)', 'Point elasticity: Ed = (dQ/dP) × (P/Q)', 'Demand: Q = 50 − 0.5P'],
        controls: [
            {
                id: 'type', label: 'Elasticity Type', type: 'select', value: 'price',
                options: [
                    { value: 'price', label: 'Price (Ed) — core syllabus' },
                    { value: 'income', label: 'Income (Ey) — contrast' },
                    { value: 'cross', label: 'Cross (Exy) — contrast' }
                ]
            },
            { id: 'price', label: 'Price (₹)', min: 5, max: 95, step: 1, value: 40, unit: '', showWhen: { id: 'type', equals: 'price' } },
            { id: 'substitutes', label: 'Number of Close Substitutes', min: 0, max: 5, step: 1, value: 1, unit: '', showWhen: { id: 'type', equals: 'price' } },
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
                    metrics: { Ey, mode: 'income' },
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
                    metrics: { Exy, mode: 'cross' },
                    readings: `<div class="reading-row"><span>Quantity Demanded of X</span><b>${fmt(Qx)}</b></div>
                               <div class="reading-row"><span>Cross Elasticity (Exy)</span><b>${fmt(Exy)}</b></div>
                               <div class="reading-row"><span>Relationship</span><b>Substitutes (Exy &gt; 0)</b></div>
                               <div class="reading-row insight-row">💡 Exy &gt; 0 (e.g. tea &amp; coffee) means a price rise in Y pushes buyers toward X — they're substitutes. Complements (e.g. car &amp; petrol) would show Exy &lt; 0 instead.</div>`
                };
            }
            const P = v.price, subs = v.substitutes;
            // Number of close substitutes is a named CBSE determinant of
            // price elasticity: more substitutes → more elastic demand.
            // Modeled by scaling the demand slope directly with it.
            const bEff = 0.3 + 0.1 * subs;
            const Q = Math.max(0.01, 50 - bEff * P);
            const Ed = -bEff * (P / Q);
            const ps = range(20).map(i => i * 5);
            const qs = ps.map(p => 50 - bEff * p);
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
                formulas: ['Ed = (%ΔQ) / (%ΔP)', 'Point elasticity: Ed = (dQ/dP) × (P/Q)', `Demand: Q = 50 − ${fmt(bEff, 1)}P (steeper slope with more substitutes)`, 'Determinants of Ed: substitutes, necessity vs luxury, share of income, time period'],
                metrics: { Ed, mode: 'price', substitutes: subs },
                readings: `<div class="reading-row"><span>Quantity Demanded</span><b>${fmt(Q)}</b></div>
                           <div class="reading-row"><span>Point Elasticity (Ed)</span><b>${fmt(Ed)}</b></div>
                           <div class="reading-row"><span>Classification</span><b>${label}</b></div>
                           <div class="reading-row insight-row">💡 ${insight}</div>`
            };
        },
        practice: [
            { prompt: 'With Elasticity Type = Price, push Substitutes from 0 to 5 at a fixed price. What happens to |Ed|?', hint: 'More close substitutes make demand more elastic — |Ed| rises as the slider increases.' },
            { prompt: 'Find a price where demand is exactly unit elastic (Ed = −1) with 1 substitute.', hint: 'With bEff = 0.4, Ed = −1 when P/Q = 2.5 — try prices around ₹36–38 and watch the readings panel.' }
        ],
        challenge: {
            prompt: 'Using Price Elasticity mode, find a price/substitutes combination where demand is Elastic (|Ed| > 1.5).',
            check(state, metrics) { return metrics && metrics.mode === 'price' && Math.abs(metrics.Ed) > 1.5; }
        }
    },
    {
        id: 'macro-gdp',
        module: 'macro',
        title: 'GDP & Circular Flow (2-Sector / 3-Sector / 4-Sector)',
        desc: 'Choose 2-Sector, 3-Sector or 4-Sector — the diagram shows ONLY that sector\'s real sectors and flows, correctly split into injections and leakages.',
        class: 'XII', part: 'A', unit: 1, unitTitle: 'National Income and Related Aggregates', topicLabel: 'Circular Flow of Income',
        syllabusIds: ['XII-A-U1-CIRCULAR-FLOW', 'XII-A-U1-AGGREGATES', 'XII-A-U1-MACRO-MEANING'],
        mode: 'simulator',
        concept: '<p><b>Macroeconomics</b> studies the economy as a whole — aggregates like total output, the overall price level and total employment — rather than a single household or firm (that\'s microeconomics). NCERT builds the circular flow up in three stages of increasing realism, and this lab draws exactly the sectors and flows of whichever stage you pick — nothing extra, nothing missing.</p><p><b>2-Sector model</b> (Households + Firms only): the simplest, closed economy with no government and no foreign trade. Households spend their <i>entire</i> income on consumption and firms pay out their <i>entire</i> revenue as factor income — nothing leaks out anywhere, so <b>National Income (Y) = Consumption Expenditure (C)</b> exactly, always.</p><p><b>3-Sector model</b> adds Government: Taxes (T) pull money OUT of the household–firm loop (a <b>leakage</b>) and Government Spending (G) pushes new money IN (an <b>injection</b>).</p><p><b>4-Sector model</b> adds the Foreign Sector: Exports (X) bring in payment from abroad for domestically-made goods (an <b>injection</b>) and Imports (M) send money abroad to pay for foreign-made goods (a <b>leakage</b>). The general CBSE rule holds at every stage: if total Injections &gt; total Leakages, National Income tends to RISE; if Injections &lt; Leakages, it tends to FALL; Injections = Leakages is equilibrium.</p><p>In every stage, the <b>real flow</b> (dashed wire, square markers) — factor services and goods &amp; services physically changing hands — always moves opposite to the <b>money flow</b> (solid wire, round markers) that pays for it.</p>',
        formulas: [
            '2-Sector: Y (National Income) = C (Consumption) — no leakage, no injection, by definition',
            '3-Sector: adds Leakage = Taxes (T); Injection = Govt. Spending (G)',
            '4-Sector: adds Leakage = Imports (M); Injection = Exports (X) — money paid BY foreigners INTO domestic Firms',
            'Injections &gt; Leakages ⇒ National Income rises · Injections &lt; Leakages ⇒ falls · Injections = Leakages ⇒ equilibrium',
            'GDP (expenditure method) = C + I + G + (X − M)',
            'GNP = GDP + Net Factor Income from Abroad · NDP/NNP = GDP/GNP − Depreciation'
        ],
        controls: [
            {
                id: 'sector', label: 'Economy Model', type: 'select', value: '2',
                options: [
                    { value: '2', label: '2-Sector (HH + Firms)' },
                    { value: '3', label: '3-Sector (+ Govt.)' },
                    { value: '4', label: '4-Sector (+ Foreign)' }
                ]
            },
            { id: 'consumption', label: 'Consumption Expenditure (C)', min: 20, max: 150, step: 5, value: 90, unit: '₹B' },
            { id: 'wages', label: 'Factor Payments — Wages etc. (₹B)', min: 20, max: 150, step: 5, value: 100, unit: '₹B', showWhen: { id: 'sector', equals: ['3', '4'] } },
            { id: 'g', label: 'Government Spending (G)', min: 0, max: 100, step: 5, value: 40, unit: '₹B', showWhen: { id: 'sector', equals: ['3', '4'] } },
            { id: 'nx', label: 'Net Exports (X − M)', min: -40, max: 40, step: 5, value: 10, unit: '₹B', showWhen: { id: 'sector', equals: '4' } }
        ],
        // Custom-rendered as an animated SVG instead of a Plotly chart: a
        // static sankey diagram can't show a real flow moving opposite to
        // a money flow, which is the actual concept being taught here.
        //
        // Sector gating: the diagram draws ONLY the nodes/flows that exist
        // in the chosen model — a 2-sector economy must never show a
        // Government or Foreign Sector node, because it doesn't have one.
        // In the 2-sector case, Wages is also forced equal to Consumption
        // (never read from the hidden `wages` slider) because that
        // equality — Y = C — is the entire economic content of the
        // 2-sector model, not an independent choice.
        //
        // Direction rule (this is the part earlier versions of this lab
        // got backwards): Taxes/Imports are LEAKAGES — money flows OUT of
        // Households/Firms; Govt. Spending/Exports are INJECTIONS — money
        // flows IN. In particular, export revenue is paid BY the Foreign
        // Sector TO domestic Firms (Foreign→Firm), and import spending is
        // paid BY domestic Firms TO the Foreign Sector (Firm→Foreign) —
        // the opposite of which sector shipped the physical goods.
        customRender(container, v) {
            const sector = v.sector || '2';
            const has3 = sector === '3' || sector === '4';
            const has4 = sector === '4';

            const consumption = v.consumption;
            const wages = sector === '2' ? consumption : v.wages; // Y = C identity in the 2-sector model
            const taxes = has3 ? 35 : 0;
            const g = has3 ? v.g : 0;
            const nx = has4 ? v.nx : 0;
            const exportsVal = Math.max(nx, 0) + 50, imports = Math.max(-nx, 0) + 50;

            const hh = { x: 50, y: 195, label: 'Households', icon: '🏠', color: '#6366f1' };
            const firm = { x: 450, y: 195, label: 'Firms', icon: '🏭', color: '#10b981' };
            const gov = { x: 250, y: 26, label: 'Government', icon: '🏛️', color: '#f59e0b' };
            const foreign = { x: 250, y: 364, label: 'Foreign Sector', icon: '🌍', color: '#f43f5e' };

            const nodes = { hh, firm };
            if (has3) nodes.gov = gov;
            if (has4) nodes.foreign = foreign;

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
                { id: 'flow-cons', from: hh, to: firm, bend: 20, labelOffset: 11, value: consumption, color: '#8b5cf6', kind: 'money', label: 'Consumption Exp. (C)' },
                { id: 'flow-wage', from: firm, to: hh, bend: 20, labelOffset: 11, value: wages, color: '#f59e0b', kind: 'money', label: 'Factor Payments (Wages)' },
                // Real flow (outer ring, dashed, square particles): what
                // actually changes hands, sized to match the payment it
                // corresponds to (factor services ≈ what wages pay for;
                // goods & services ≈ what consumption spending buys).
                { id: 'flow-factors', from: hh, to: firm, bend: 58, labelOffset: 11, value: wages, color: '#6366f1', kind: 'real', label: 'Factor Services' },
                { id: 'flow-goods', from: firm, to: hh, bend: 58, labelOffset: 11, value: consumption, color: '#10b981', kind: 'real', label: 'Goods &amp; Services' }
            ];
            if (has3) {
                flows.push(
                    { id: 'flow-tax', from: hh, to: gov, bend: 16, labelOffset: 11, value: taxes, color: gov.color, kind: 'money', label: 'Taxes (T) — Leakage' },
                    { id: 'flow-gspend', from: gov, to: hh, bend: 16, labelOffset: 11, value: g, color: gov.color, kind: 'money', label: 'Govt Spending (G) — Injection' }
                );
            }
            if (has4) {
                flows.push(
                    // Export revenue is an INJECTION — the Foreign Sector
                    // pays domestic Firms for what they exported.
                    { id: 'flow-exp', from: foreign, to: firm, bend: 16, labelOffset: 11, value: exportsVal, color: foreign.color, kind: 'money', label: 'Exports (X) — Injection' },
                    // Import spending is a LEAKAGE — domestic Firms pay the
                    // Foreign Sector for what was imported.
                    { id: 'flow-imp', from: firm, to: foreign, bend: 16, labelOffset: 11, value: imports, color: foreign.color, kind: 'money', label: 'Imports (M) — Leakage' }
                );
            }

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

            const sectorLabel = sector === '2' ? '2-Sector' : (sector === '3' ? '3-Sector' : '4-Sector');
            container.innerHTML = `
                <svg viewBox="0 0 500 390" class="flow-diagram" preserveAspectRatio="xMidYMid meet" role="img"
                     aria-label="${sectorLabel} circular flow of income, showing only the sectors and flows that belong to this model, with the real flow of factor services and goods moving opposite to the money flow of payments and expenditure">
                    ${flowsSVG}
                    ${nodesSVG}
                    ${labelsSVG}
                    ${legendSVG}
                </svg>`;

            // Injections vs Leakages — the actual CBSE-taught rule for
            // whether National Income is rising, falling, or in
            // equilibrium. Undefined (not "zero and balanced") for the
            // 2-sector model, which has neither concept.
            //
            // The verdict sentence deliberately carries NO embedded
            // numbers (the numbers already have their own reading rows
            // above it) — READINGS_I18N_HI (js/i18n_hi.js) translates it
            // by exact substring match, which only works on fixed prose.
            const totalInjections = has4 ? (g + exportsVal) : (has3 ? g : 0);
            const totalLeakages = has4 ? (taxes + imports) : (has3 ? taxes : 0);
            const gap = Math.round((totalInjections - totalLeakages) * 100) / 100;
            let verdict;
            if (!has3) {
                verdict = 'This is the <b>2-Sector model</b> — no Government, no Foreign Sector, so there is no leakage or injection at all. By definition <b>Y = C</b>: households spend every rupee they earn, and firms pay out every rupee they receive.';
            } else if (Math.abs(gap) < 0.01) {
                verdict = 'Total Injections = Total Leakages — the economy is in <b>equilibrium</b>, National Income stays constant.';
            } else if (gap > 0) {
                verdict = 'Total Injections are greater than Total Leakages — a net injection, so National Income tends to <b>RISE</b>.';
            } else {
                verdict = 'Total Leakages are greater than Total Injections — a net leakage, so National Income tends to <b>FALL</b>.';
            }

            const gdpExp = sector === '2' ? consumption : consumption + 50 + g + nx; // C, or C + I(illustrative ₹50B) + G + NX once Govt./Foreign exist
            return {
                metrics: { sector, consumption, wages, g, nx, taxes, exportsVal, imports, totalInjections, totalLeakages, gdpExp },
                readings: `<div class="reading-row"><span>Economy Model</span><b>${sectorLabel}</b></div>
                           <div class="reading-row"><span>Consumption Expenditure (C)</span><b>₹${consumption}B</b></div>
                           <div class="reading-row"><span>Factor Payments (Wages etc.)</span><b>₹${wages}B</b></div>
                           ${has3 ? `<div class="reading-row"><span>Taxes (T) — Leakage</span><b>₹${taxes}B</b></div>
                           <div class="reading-row"><span>Govt Spending (G) — Injection</span><b>₹${g}B</b></div>` : ''}
                           ${has4 ? `<div class="reading-row"><span>Exports (X) — Injection</span><b>₹${fmt(exportsVal, 0)}B</b></div>
                           <div class="reading-row"><span>Imports (M) — Leakage</span><b>₹${fmt(imports, 0)}B</b></div>` : ''}
                           ${has3 ? `<div class="reading-row"><span>Total Injections</span><b>₹${fmt(totalInjections, 0)}B</b></div>
                           <div class="reading-row"><span>Total Leakages</span><b>₹${fmt(totalLeakages, 0)}B</b></div>` : ''}
                           <div class="reading-row insight-row">💡 ${verdict}</div>
                           <div class="reading-row insight-row">Notice the <b>real flow</b> (dashed, square) always moves opposite to the <b>money flow</b> (solid, round) it pays for — Factor Services flow to Firms while Factor Payments flow back to Households, and Goods &amp; Services flow to Households while Consumption Expenditure flows back to Firms.</div>`
            };
        },
        practice: [
            { prompt: 'Set Economy Model to "2-Sector". How many nodes does the diagram show, and how many flows?', hint: 'Exactly 2 nodes (Households, Firms) and 4 flows: Factor Services + Goods & Services (real), Factor Payments + Consumption Expenditure (money) — no Government, no Foreign Sector.' },
            { prompt: 'Now switch to "3-Sector". Which new node appears, and which of its two flows is the injection?', hint: 'Government appears. Govt Spending (Government→Households) is the injection — new money entering the flow. Taxes (Households→Government) is the leakage — money withdrawn from it.' },
            { prompt: 'Switch to "4-Sector" and make Net Exports negative. Which flow (Exports or Imports) is now bigger, and is that a net injection or a net leakage on the Foreign Sector leg?', hint: 'Negative Net Exports means Imports > Exports — a net leakage: more money is flowing OUT to the Foreign Sector (Imports, Firms→Foreign) than is flowing IN (Exports, Foreign→Firms).' }
        ],
        challenge: {
            prompt: 'End on the 4-Sector model with Net Exports negative — this only works if you correctly read Imports as a leakage (money leaving Firms) and Exports as an injection (money entering Firms from abroad).',
            check(state) { return state.sector === '4' && state.nx < 0; }
        }
    },
    {
        id: 'macro-multiplier',
        module: 'macro',
        title: 'The Multiplier Effect: Investment, Government Spending & Tax',
        desc: 'The named Investment Multiplier, plus Government Spending and Tax multipliers as extra contrast.',
        class: 'XII', part: 'A', unit: 3, unitTitle: 'Determination of Income and Employment', topicLabel: 'Investment Multiplier',
        syllabusIds: ['XII-A-U3-MULTIPLIER', 'XII-A-U3-EQUILIBRIUM'],
        mode: 'simulator',
        enrichment: false,
        enrichmentNote: 'The Government Spending and Tax multipliers extend beyond the single "Investment Multiplier" topic named in the 2026–27 Unit 3 list; they are standard NCERT content (Ch. on Determination of Income) and are kept because they make the Investment Multiplier itself easier to understand by contrast, not counted as separate core coverage.',
        concept: '<p>The chart\'s "Old Equilibrium" and "New Equilibrium" markers are exactly the syllabus\'s <b>short-run equilibrium output</b> — the income level where Aggregate Expenditure equals income (AE = Y, the point where the AE line crosses the 45° line). Because one person\'s spending is another person\'s income, an injection of spending triggers successive rounds of further spending, moving that equilibrium. NCERT\'s named <b>Investment Multiplier</b> captures this: k = 1/(1−MPC). This lab also shows the Government Spending Multiplier (identical in size to the investment multiplier, since both are direct injections) and the Tax Multiplier (smaller, opposite-signed, since a tax cut only raises spending indirectly through disposable income) as contrast.</p>',
        formulas: ['Investment Multiplier: k = 1 / (1 − MPC)', 'Tax Multiplier (contrast): kt = −MPC / (1 − MPC)', 'ΔY = k×(ΔI + ΔG) + kt×ΔT'],
        controls: [
            { id: 'mpc', label: 'Marginal Propensity to Consume', min: 0.1, max: 0.9, step: 0.05, value: 0.6, unit: '' },
            { id: 'di', label: 'Additional Investment (ΔI)', min: 0, max: 60, step: 5, value: 20, unit: '₹B' },
            { id: 'dg', label: 'Additional Govt. Spending (ΔG)', min: 0, max: 60, step: 5, value: 0, unit: '₹B' },
            { id: 'dt', label: 'Tax Change (ΔT, + = increase)', min: -60, max: 60, step: 5, value: 0, unit: '₹B' }
        ],
        compute(v) {
            const a = 50, I0 = 50, c = v.mpc, dI = v.di, dG = v.dg, dT = v.dt;
            const k = 1 / (1 - c);
            const kt = -c / (1 - c);
            const autonomous1 = I0;
            const autonomous2 = I0 + dI + dG - c * dT;
            const Y0 = (a + autonomous1) / (1 - c);
            const Y1 = (a + autonomous2) / (1 - c);
            const ys = range(41).map(i => i * 10);
            const ae0 = ys.map(y => a + c * y + autonomous1);
            const ae1 = ys.map(y => a + c * y + autonomous2);
            const dySpending = k * (dI + dG), dyTax = kt * dT;
            return {
                traces: [
                    { x: ys, y: ys, mode: 'lines', name: '45° Line (Y=AE)', line: { color: '#9ca3af', dash: 'dot', width: 2 } },
                    { x: ys, y: ae0, mode: 'lines', name: 'AE (before)', line: { color: '#2563eb', width: 3 } },
                    { x: ys, y: ae1, mode: 'lines', name: 'AE (after)', line: { color: '#10b981', width: 3 } },
                    { x: [Y0], y: [Y0], mode: 'markers', name: 'Old Equilibrium', marker: { color: '#f59e0b', size: 9 } },
                    { x: [Y1], y: [Y1], mode: 'markers', name: 'New Equilibrium', marker: { color: '#ef4444', size: 9 } }
                ],
                layout: { xaxis: { title: 'National Income (Y)', range: [0, 400] }, yaxis: { title: 'Aggregate Expenditure (AE)', range: [0, 400] } },
                metrics: { k, kt, dySpending, dyTax, Y1 },
                readings: `<div class="reading-row"><span>Investment Multiplier (k)</span><b>${fmt(k)}</b></div>
                           <div class="reading-row"><span>Tax Multiplier (kt, contrast)</span><b>${fmt(kt)}</b></div>
                           <div class="reading-row"><span>ΔY from Spending (I+G)</span><b>₹${fmt(dySpending)}B</b></div>
                           <div class="reading-row"><span>ΔY from Tax</span><b>₹${fmt(dyTax)}B</b></div>
                           <div class="reading-row"><span>New Equilibrium Y</span><b>₹${fmt(Y1)}B</b></div>
                           <div class="reading-row insight-row">💡 A higher MPC means each round of spending recycles further — a bigger multiplier. The tax multiplier is always smaller in magnitude than the spending multiplier (by exactly one unit: k − |kt| = 1), because a tax change only affects spending indirectly through disposable income.</div>`
            };
        },
        practice: [
            { prompt: 'Set MPC to 0.9, then 0.1, keeping ΔI = 20. How much does k change?', hint: 'k = 1/(1−MPC): at MPC=0.9, k=10; at MPC=0.1, k≈1.11 — a much smaller multiplier when people save more of each extra rupee.' },
            { prompt: 'Verify k − |kt| = 1 at any MPC.', hint: 'k=1/(1−c) and kt=−c/(1−c), so k−|kt| = (1−c)/(1−c) = 1 always — check the readings panel at any MPC.' }
        ],
        challenge: {
            prompt: 'Using only ΔI (keep ΔG = 0, ΔT = 0), reach a New Equilibrium Y of at least ₹300B.',
            check(state, metrics) { return state.dg === 0 && state.dt === 0 && metrics && metrics.Y1 >= 300; }
        }
    },
    {
        id: 'stats-correlation',
        module: 'stats',
        title: 'Correlation: Scatter, Karl Pearson & Spearman\'s Rank',
        desc: 'Enter your own paired data and see Karl Pearson\'s r and Spearman\'s Rank correlation computed live — table, scatter and interpretation together.',
        class: 'XI', part: 'A', unit: 3, unitTitle: 'Statistical Tools and Interpretation', topicLabel: "Correlation — Karl Pearson's & Spearman's Rank",
        syllabusIds: ['XI-A-U3-CORRELATION'],
        mode: 'datalab',
        concept: '<p>Correlation measures the strength and direction of the relationship between two variables. <b>Karl Pearson\'s coefficient (r)</b> uses the raw values; <b>Spearman\'s Rank Correlation</b> uses only each value\'s <i>rank</i> — useful when data is ordinal or when you want a quick, outlier-resistant measure. Edit the Study Hours / Test Score table below (or switch to your own numbers entirely) and both coefficients recompute live, with ranks and rank-differences shown so you can see exactly how Spearman\'s formula uses them.</p>',
        formulas: ['Karl Pearson\'s r = Σ(x−x̄)(y−ȳ) / √[Σ(x−x̄)² · Σ(y−ȳ)²]', "Spearman's Rank r = 1 − [6Σd² / n(n²−1)], d = rank(x) − rank(y)", '−1 ≤ r ≤ +1'],
        dataLab: {
            columns: [
                { id: 'x', label: 'Study Hours / Week', type: 'number', step: 0.5, min: 0, max: 40, default: 5 },
                { id: 'y', label: 'Test Score (%)', type: 'number', step: 1, min: 0, max: 100, default: 50 }
            ],
            minRows: 4,
            maxRows: 15,
            addRowDefault: { x: 5, y: 60 },
            defaultRows: [
                { x: 2, y: 45 }, { x: 4, y: 52 }, { x: 5, y: 58 }, { x: 6, y: 62 },
                { x: 7, y: 68 }, { x: 8, y: 74 }, { x: 9, y: 80 }, { x: 10, y: 88 }
            ],
            calculate(rows) {
                const n = rows.length;
                const xs = rows.map(r => r.x), ys = rows.map(r => r.y);
                const xbar = xs.reduce((s, x) => s + x, 0) / n;
                const ybar = ys.reduce((s, y) => s + y, 0) / n;
                let num = 0, dx2 = 0, dy2 = 0;
                for (let i = 0; i < n; i++) {
                    num += (xs[i] - xbar) * (ys[i] - ybar);
                    dx2 += (xs[i] - xbar) ** 2;
                    dy2 += (ys[i] - ybar) ** 2;
                }
                const denom = Math.sqrt(dx2 * dy2);
                const pearsonR = denom === 0 ? 0 : num / denom;

                // Spearman: average ("mid") rank for ties, per NCERT's
                // repeated-ranks treatment.
                function ranksOf(vals) {
                    const idx = vals.map((v, i) => i).sort((a, b) => vals[a] - vals[b]);
                    const ranks = new Array(vals.length);
                    let i = 0;
                    while (i < idx.length) {
                        let j = i;
                        while (j + 1 < idx.length && vals[idx[j + 1]] === vals[idx[i]]) j++;
                        const avgRank = (i + j) / 2 + 1;
                        for (let k = i; k <= j; k++) ranks[idx[k]] = avgRank;
                        i = j + 1;
                    }
                    return ranks;
                }
                const rx = ranksOf(xs), ry = ranksOf(ys);
                const d2sum = rx.reduce((s, r, i) => s + (r - ry[i]) ** 2, 0);
                const spearmanR = n > 1 ? 1 - (6 * d2sum) / (n * (n * n - 1)) : 0;
                const hasTies = new Set(xs).size < n || new Set(ys).size < n;

                const strength = r => Math.abs(r) > 0.7 ? 'Strong' : Math.abs(r) > 0.3 ? 'Moderate' : 'Weak';
                const direction = r => r >= 0 ? 'Positive' : 'Negative';

                return {
                    traces: [{ x: xs, y: ys, mode: 'markers', name: 'Data', marker: { color: '#2563eb', size: 9 } }],
                    layout: { xaxis: { title: 'Study Hours / Week' }, yaxis: { title: 'Test Score (%)' }, showlegend: false },
                    stats: [
                        { label: 'n (data points)', value: n },
                        { label: "Karl Pearson's r", value: fmt(pearsonR) },
                        { label: "Spearman's Rank r", value: fmt(spearmanR) + (hasTies ? ' (ties averaged)' : '') }
                    ],
                    metrics: { pearsonR, spearmanR, n },
                    interpretation: `${strength(pearsonR)} ${direction(pearsonR)} correlation (Pearson r = ${fmt(pearsonR)}). Spearman's rank r (${fmt(spearmanR)}) is close to it here because the data has few reversals in rank order — the two methods can diverge more with outliers or non-linear patterns, which is exactly why NCERT teaches both. Correlation never proves that one variable causes the other.`
                };
            }
        },
        practice: [
            { prompt: 'Change one Test Score to an outlier (e.g. row 1 → 95) while keeping Study Hours low. What happens to Pearson\'s r vs Spearman\'s r?', hint: "Pearson's r is sensitive to the outlier's exact distance; Spearman's r only cares about its rank, so it often moves less." },
            { prompt: 'Make two rows share the exact same Study Hours value. Watch how Spearman handles the tie.', hint: 'The Data Lab averages ("mid-ranks") tied values before computing Spearman\'s r, per the NCERT repeated-ranks method.' }
        ],
        challenge: {
            prompt: 'Edit the table so that Karl Pearson\'s r comes out negative (Study Hours and Test Score move in opposite directions).',
            check(state, metrics) { return metrics && metrics.pearsonR < -0.1; }
        }
    },
    {
        id: 'india-poverty',
        module: 'india',
        title: 'Poverty & Inequality',
        desc: 'Analyze income distribution and poverty lines using the Lorenz curve.',
        class: 'XII', part: 'B', unit: 7, unitTitle: 'Current Challenges facing Indian Economy', topicLabel: 'Poverty & Income Inequality',
        syllabusIds: [],
        mode: 'simulator',
        enrichment: true,
        enrichmentNote: "Poverty is well-established NCERT Indian Economic Development content, but the supplied 2026–27 taxonomy's Unit 7 (Current Challenges facing Indian Economy) names only Human Capital Formation, Rural Development, Employment and Sustainable Economic Development as topics — Poverty is not listed as a standalone Unit 7 topic in that document. Retained here as enrichment (and moved from the old, incorrect Class XI tag to Class XII, since Indian Economic Development itself is a Class XII part in 2026–27), not counted toward core Unit 7 coverage until confirmed against the official CBSE circular.",
        concept: '<p>NCERT\'s core method for identifying the poor is the <b>poverty line</b> — a calorie-based minimum consumption expenditure (historically ~2400 kcal/day rural, ~2100 kcal/day urban) converted into a rupee cutoff; anyone below it is counted as <b>absolutely poor</b>. Beyond that headline number, economists also study <b>income inequality</b> — how unevenly income is distributed even among the non-poor — using the Lorenz curve and Gini coefficient (standard statistical tools, used here to extend the poverty-line discussion). The Lorenz curve plots the cumulative share of income received against the cumulative share of the population; the further it bows away from the diagonal "line of equality", the greater the inequality.</p>',
        formulas: ['Lorenz Curve: L(p) = p^k', 'Gini Coefficient ≈ (k−1) / (k+1)', 'Headcount Ratio = % of population below the Poverty Line', 'Gini = 0 → perfect equality; Gini = 1 → perfect inequality'],
        controls: [
            { id: 'e', label: 'Inequality Parameter', min: 0, max: 5, step: 0.25, value: 1.5, unit: '' },
            { id: 'povLine', label: 'Poverty Line (₹/month)', min: 1000, max: 12000, step: 500, value: 3000, unit: '' }
        ],
        compute(v) {
            const k = 1 + v.e;
            const meanIncome = 15000; // illustrative reference average, not an official statistic
            const ps = range(21).map(i => i * 0.05);
            const Ls = ps.map(p => Math.pow(p, k));
            const gini = (k - 1) / (k + 1);

            // Headcount ratio derived from the same Lorenz curve: income at
            // percentile p is proportional to dL/dp = k·p^(k−1), so solving
            // that for the poverty-line income gives the population share
            // below it — an honest (if simplified/illustrative) link
            // between this lab's inequality model and the actual NCERT
            // headcount-ratio method, not two disconnected numbers.
            let headcount;
            if (Math.abs(k - 1) < 0.01) {
                headcount = v.povLine >= meanIncome ? 100 : 0;
            } else {
                const base = v.povLine / (meanIncome * k);
                const pStar = base <= 0 ? 0 : Math.pow(base, 1 / (k - 1));
                headcount = Math.max(0, Math.min(100, pStar * 100));
            }

            return {
                traces: [
                    { x: ps, y: ps, mode: 'lines', name: 'Line of Equality', line: { color: '#9ca3af', dash: 'dot' } },
                    { x: ps, y: Ls, mode: 'lines', name: 'Lorenz Curve', line: { color: '#ef4444', width: 3 } },
                    { x: [headcount / 100, headcount / 100], y: [0, 1], mode: 'lines', name: 'Headcount Cutoff', line: { color: '#f59e0b', dash: 'dash', width: 2 } }
                ],
                layout: { xaxis: { title: 'Cumulative % of Population' }, yaxis: { title: 'Cumulative % of Income' } },
                metrics: { gini, headcount },
                readings: `<div class="reading-row"><span>Approx. Gini Coefficient</span><b>${fmt(gini)}</b></div>
                           <div class="reading-row"><span>Interpretation</span><b>${gini < 0.3 ? 'Relatively Equal' : gini < 0.5 ? 'Moderate Inequality' : 'High Inequality'}</b></div>
                           <div class="reading-row"><span>Headcount Ratio (illustrative)</span><b>${fmt(headcount, 1)}%</b></div>
                           <div class="reading-row insight-row">💡 The amber dashed line marks the population share below your Poverty Line — that percentage is exactly what NCERT calls the <b>headcount ratio</b>. Raise the Poverty Line and more people fall below it; raise inequality and, for the same line, a larger low-income group forms.</div>`
            };
        },
        practice: [
            { prompt: 'Keep the Poverty Line fixed and raise the Inequality Parameter. What happens to the Headcount Ratio?', hint: 'More inequality (higher Gini) concentrates income at the top, pushing more people under a fixed poverty line — headcount rises.' }
        ],
        challenge: {
            prompt: 'Find a Poverty Line / Inequality combination that gives a Headcount Ratio between 40% and 60%.',
            check(state, metrics) { return metrics && metrics.headcount >= 40 && metrics.headcount <= 60; }
        }
    }
];
