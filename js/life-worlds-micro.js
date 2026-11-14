// ══════════════════════════════════════════════════════════════
// js/life-worlds-micro.js — Living Worlds for Class XI
//   chai-stall    Part B · Units 5–6  (demand, elasticity, revenue, cost, MR = MC)
//   mandi         Part B · Unit 7     (price taker, equilibrium, ceiling, floor)
//   pocket-money  Part B · Unit 5     (diminishing MU, MUx/Px = MUy/Py, demand)
//   town-survey   Part A · Units 2–3  (census vs sample, bias, mean vs median)
// ══════════════════════════════════════════════════════════════
// Contract and honesty rules: top of js/life-engine.js. Each world's `truth`
// object IS its economics; step() only applies it to a decision, and every
// word in narrate()/debrief() is filled from step()'s own output.
// Worked references: docs/economics/models/living-worlds.md.

/* global LIFE_WORLDS, B2, rupee, lifeT */
/* exported lifeCrowd, lifeSvg, LIFE_INK, LIFE_MUTE */

// Shared scene helper: a block of people, one dot each.
function lifeCrowd(n, cols, x0, y0, gap, paint) {
    let out = '';
    for (let i = 0; i < n; i++) {
        const p = paint(i) || {};
        const cx = x0 + (i % cols) * gap, cy = y0 + Math.floor(i / cols) * gap;
        out += `<circle cx="${cx}" cy="${cy}" r="${p.r || 4}" fill="${p.fill || '#c7c3e0'}" opacity="${p.opacity === undefined ? 1 : p.opacity}" class="${p.cls || ''}" style="animation-delay:${(i % 25) * 18}ms"></circle>`;
    }
    return out;
}
function lifeSvg(label, inner, h) {
    return `<svg viewBox="0 0 520 ${h || 240}" class="life-svg" role="img" aria-label="${label}" preserveAspectRatio="xMidYMid meet">${inner}</svg>`;
}
const LIFE_INK = '#1e1b3a', LIFE_MUTE = '#6b668a';

// ── 1. THE CHAI STALL ─────────────────────────────────────────────
// One stall at a school gate, 100 passers-by a day. Person i will pay at
// most wtp_i; the stall sets ONE price. Evenly spread willingness to pay
// makes expected demand exactly linear:  Q = 4 × (25 + shift − P).
// Every cup costs the same to make (MC = AVC), plus a fixed daily rent.
const CHAI = {
    N: 100, PMAX: 25, TFC: 150, MC: 5,
    PRICE_MIN: 8, PRICE_MAX: 22,
    NOISE: 2, // each person's mood moves their limit by up to ±₹2 on the day
    regime(day) { return day <= 5 ? 'normal' : (day <= 7 ? 'cold' : 'costly'); },
    shift(reg) { return reg === 'cold' ? 6 : 0; },          // a cold wave: everyone will pay ₹6 more
    mc(reg) { return CHAI.MC + (reg === 'costly' ? 4 : 0); }, // milk dearer: ₹4 more per cup
    // Expected cups sold at price p.
    demand(p, reg) { return Math.max(0, Math.min(CHAI.N, 4 * (CHAI.PMAX + CHAI.shift(reg) - p))); },
    // Inverse demand and marginal revenue at quantity q (the textbook lines).
    priceAt(q, reg) { return CHAI.PMAX + CHAI.shift(reg) - q / 4; },
    mr(q, reg) { return CHAI.PMAX + CHAI.shift(reg) - q / 2; },
    profit(p, reg) { const q = CHAI.demand(p, reg); return q * (p - CHAI.mc(reg)) - CHAI.TFC; },
    // Best whole-rupee price the slider allows, by direct search of the model.
    best(reg) {
        let b = null;
        for (let p = CHAI.PRICE_MIN; p <= CHAI.PRICE_MAX; p++) { const pi = CHAI.profit(p, reg); if (!b || pi > b.profit) b = { price: p, profit: pi, cups: CHAI.demand(p, reg) }; }
        return b;
    },
    // Price where expected revenue peaks (unit-elastic point of the line).
    unitElasticPrice(reg) { return (CHAI.PMAX + CHAI.shift(reg)) / 2; },
    elasticity(p, reg) { const q = CHAI.demand(p, reg); return q > 0 ? 4 * p / q : Infinity; }
};
const CHAI_REG = {
    normal: { en: 'ordinary day', hi: 'सामान्य दिन', color: '#6366f1' },
    cold: { en: 'cold wave', hi: 'शीत लहर', color: '#0891b2' },
    costly: { en: 'costly milk', hi: 'महँगा दूध', color: '#f97316' }
};

LIFE_WORLDS.push({
    id: 'chai-stall', icon: '☕', accent: '#b45309', minutes: 8,
    title: B2('The Chai Stall', 'चाय की टपरी'),
    role: B2('a chai-stall owner', 'चाय की टपरी के मालिक'),
    tagline: B2('Ten days, one decision a day: your price. Find out what a crowd does when it changes.', 'दस दिन, रोज़ एक निर्णय: आपकी कीमत। देखिए कीमत बदलने पर भीड़ क्या करती है।'),
    class: 'XI', part: 'B', unit: 5, unitTitle: "Consumer's Equilibrium and Demand",
    syllabusIds: ['XI-B-U5-DEMAND', 'XI-B-U5-ELASTICITY', 'XI-B-U6-COST', 'XI-B-U6-REVENUE', 'XI-B-U6-PRODUCER-EQ'],
    labs: ['gl-demand-movement-shift', 'micro-elasticity', 'gl-revenue-producer-eq'],
    rounds: 10, roundWord: B2('Day', 'दिन'),
    goLabel: B2('Open the stall ▶', 'टपरी खोलें ▶'),
    brief: B2(
        `<p>You have a chai stall at the school gate. About <b>100 people</b> walk past every day.</p>
         <p>Each morning you chalk <b>one price</b> on the board. Each cup costs you <b>₹5</b> to make (milk, leaves, sugar, gas), and the spot costs <b>₹150 a day</b> whether you sell a cup or not.</p>
         <p>Earn as much <b>profit</b> as you can in ten days. Nobody will tell you the right price — the crowd will.</p>`,
        `<p>स्कूल के गेट पर आपकी चाय की टपरी है। रोज़ लगभग <b>100 लोग</b> यहाँ से गुज़रते हैं।</p>
         <p>हर सुबह आप बोर्ड पर <b>एक कीमत</b> लिखते हैं। एक कप बनाने में <b>₹5</b> लगते हैं (दूध, पत्ती, चीनी, गैस), और जगह का किराया <b>₹150 रोज़</b> है — चाहे एक कप बिके या नहीं।</p>
         <p>दस दिनों में जितना हो सके <b>लाभ</b> कमाइए। सही कीमत कोई नहीं बताएगा — भीड़ बताएगी।</p>`),
    truth: CHAI,
    init(rng) {
        // The crowd stands in a shuffled order, so the scene never hands the
        // student a sorted willingness-to-pay line before the debrief.
        const order = Array.from({ length: CHAI.N }, (_, i) => i);
        for (let i = order.length - 1; i > 0; i--) { const j = rng.int(0, i); const t = order[i]; order[i] = order[j]; order[j] = t; }
        return { order };
    },
    news(state, day) {
        if (day === 6) return B2('❄️ A cold wave has hit the town. People are shivering at the gate.', '❄️ शहर में शीत लहर आ गई है। लोग गेट पर ठिठुर रहे हैं।');
        if (day === 8) return B2('🥛 The cold wave is over — and the dairy has raised milk prices. Each cup now costs you ₹9 to make.', '🥛 शीत लहर ख़त्म — और डेयरी ने दूध महँगा कर दिया। अब एक कप बनाने में ₹9 लगते हैं।');
        return null;
    },
    decisions() {
        return [{ id: 'price', label: B2('Price of one cup today', 'आज एक कप की कीमत'), min: CHAI.PRICE_MIN, max: CHAI.PRICE_MAX, step: 1, value: 10, unit: '₹' }];
    },
    predict(state, day, history) {
        if (!history.length) return null;
        const last = history[history.length - 1].decision.price;
        const opts = [B2('More cups', 'ज़्यादा कप'), B2('The same', 'उतने ही'), B2('Fewer cups', 'कम कप')];
        const cmp = (now, then) => (now > then ? 0 : (now === then ? 1 : 2));
        if (day === 6) {
            return {
                prompt: B2(`If you leave the price at ${rupee(last)}, exactly as yesterday, how many cups will you sell compared with an ordinary day?`, `यदि कीमत कल की तरह ${rupee(last)} ही रखें, तो सामान्य दिन की तुलना में कितने कप बिकेंगे?`),
                options: opts, answer: () => cmp(CHAI.demand(last, 'cold'), CHAI.demand(last, 'normal'))
            };
        }
        if (day === 8) {
            return {
                prompt: B2(`Milk is dearer for YOU. At any given price — say ${rupee(last)} — how many people will want a cup, compared with an ordinary day?`, `दूध आपके लिए महँगा हुआ है। किसी भी कीमत पर — मान लीजिए ${rupee(last)} — सामान्य दिन की तुलना में कितने लोग चाय चाहेंगे?`),
                options: opts, answer: () => cmp(CHAI.demand(last, 'costly'), CHAI.demand(last, 'normal'))
            };
        }
        return null;
    },
    step(state, decision, day, rng) {
        const reg = CHAI.regime(day), price = decision.price, mc = CHAI.mc(reg);
        // Person k's limit today: an evenly spaced base, the day's mood, the weather.
        const bought = new Array(CHAI.N);
        let cups = 0;
        for (let k = 0; k < CHAI.N; k++) {
            const wtp = (k + 0.5) * (CHAI.PMAX / CHAI.N) + CHAI.shift(reg) + rng.between(-CHAI.NOISE, CHAI.NOISE);
            bought[k] = wtp >= price;
            if (bought[k]) cups++;
        }
        const revenue = cups * price, tvc = cups * mc, cost = tvc + CHAI.TFC;
        const best = CHAI.best(reg);
        return {
            day, regime: reg, price, cups, walked: CHAI.N - cups, revenue, tvc, tfc: CHAI.TFC, cost, mc,
            profit: revenue - cost, expected: CHAI.demand(price, reg), bestPrice: best.price, bestProfit: best.profit,
            mask: state.order.map(k => (bought[k] ? '1' : '0')).join('')
        };
    },
    scene(state, o, day) {
        const reg = CHAI.regime(day), R = CHAI_REG[reg];
        const crowd = lifeCrowd(CHAI.N, 20, 26, 62, 15.5, i => {
            if (!o) return { fill: '#a5a1c9' };
            return o.mask[i] === '1' ? { fill: '#16a34a', cls: 'life-pop', r: 4.6 } : { fill: '#cbd5e1', opacity: 0.55, r: 3.6 };
        });
        const board = o ? rupee(o.price) : '₹ ?';
        return lifeSvg(lifeT(B2('The crowd at the school gate and your stall', 'स्कूल गेट पर भीड़ और आपकी टपरी')), `
            <rect x="0" y="0" width="520" height="240" rx="14" fill="${reg === 'cold' ? '#e0f2fe' : '#fff7ed'}"></rect>
            <text x="26" y="30" font-size="13" font-weight="700" fill="${LIFE_INK}">${reg === 'cold' ? '❄️' : (reg === 'costly' ? '🥛' : '☀️')} ${lifeT(R)}</text>
            <text x="26" y="48" font-size="10.5" fill="${LIFE_MUTE}">${o
        ? lifeT(B2(`${o.cups} bought · ${o.walked} walked past`, `${o.cups} ने ख़रीदी · ${o.walked} आगे बढ़ गए`))
        : lifeT(B2('100 people will pass today', 'आज 100 लोग गुज़रेंगे'))}</text>
            ${crowd}
            <g transform="translate(380,54)">
                <path d="M0 40 L60 6 L120 40 Z" fill="#b45309"></path>
                <rect x="10" y="40" width="100" height="92" rx="6" fill="#fde68a" stroke="#b45309" stroke-width="2"></rect>
                <rect x="24" y="52" width="72" height="34" rx="5" fill="#1e293b"></rect>
                <text x="60" y="75" text-anchor="middle" font-size="19" font-weight="800" fill="#fef3c7">${board}</text>
                <text x="60" y="118" text-anchor="middle" font-size="26">☕</text>
                <text x="60" y="150" text-anchor="middle" font-size="10" fill="${LIFE_MUTE}">${lifeT(B2('your stall', 'आपकी टपरी'))}</text>
            </g>
            ${o ? `<g font-size="10.5" fill="${LIFE_INK}"><circle cx="30" cy="222" r="4.6" fill="#16a34a"></circle><text x="40" y="226">${lifeT(B2('bought a cup', 'कप ख़रीदा'))}</text>
                   <circle cx="150" cy="222" r="3.6" fill="#cbd5e1"></circle><text x="160" y="226">${lifeT(B2('walked past', 'आगे बढ़ गए'))}</text></g>` : ''}`);
    },
    stats(o) {
        return [
            { label: B2('Cups sold', 'बिके कप'), value: String(o.cups) },
            { label: B2('Money in', 'आमदनी'), value: rupee(o.revenue) },
            { label: B2('Money out', 'ख़र्च'), value: rupee(o.cost) },
            { label: B2('Profit', 'लाभ'), value: rupee(o.profit), tone: o.profit >= 0 ? 'good' : 'bad' }
        ];
    },
    ledger: [
        { key: 'day', label: B2('Day', 'दिन'), get: r => String(r.round) },
        { key: 'price', label: B2('Price', 'कीमत'), get: r => rupee(r.outcome.price) },
        { key: 'cups', label: B2('Cups', 'कप'), get: r => String(r.outcome.cups) },
        { key: 'rev', label: B2('In', 'आमदनी'), get: r => rupee(r.outcome.revenue) },
        { key: 'profit', label: B2('Profit', 'लाभ'), get: r => rupee(r.outcome.profit) }
    ],
    narrate(o, state, history) {
        const prev = history.length > 1 ? history[history.length - 2].outcome : null;
        let en = `At ${rupee(o.price)} a cup, <b>${o.cups}</b> people bought and ${o.walked} walked past. You took in ${rupee(o.revenue)}; the cups cost you ${rupee(o.tvc)} and the spot ${rupee(o.tfc)}. <b>Profit: ${rupee(o.profit)}</b>.`;
        let hi = `${rupee(o.price)} प्रति कप पर <b>${o.cups}</b> लोगों ने चाय ली और ${o.walked} आगे बढ़ गए। आमदनी ${rupee(o.revenue)}; कप बनाने में ${rupee(o.tvc)} और जगह के ${rupee(o.tfc)} लगे। <b>लाभ: ${rupee(o.profit)}</b>।`;
        if (prev && prev.regime === o.regime && prev.price !== o.price) {
            en += ` Yesterday, at ${rupee(prev.price)}, it was ${prev.cups} cups and ${rupee(prev.profit)}.`;
            hi += ` कल ${rupee(prev.price)} पर ${prev.cups} कप और ${rupee(prev.profit)} था।`;
        } else if (prev && prev.regime !== o.regime && prev.price === o.price) {
            en += ` Same price as yesterday — but yesterday it was ${prev.cups} cups.`;
            hi += ` कीमत कल जैसी ही — पर कल ${prev.cups} कप बिके थे।`;
        }
        return B2(en, hi);
    },
    nudge(history, state, day) {
        if (history.length < 2) return null;
        const reg = CHAI.regime(day);
        const same = history.filter(r => r.outcome.regime === reg);
        const last = history[history.length - 1].outcome;
        if (same.length >= 2 && new Set(same.map(r => r.outcome.price)).size === 1) {
            const p = same[0].outcome.price;
            return B2(`You know what ${rupee(p)} does now. You still don't know what ${rupee(Math.min(CHAI.PRICE_MAX, p + 3))} does.`, `${rupee(p)} पर क्या होता है, आप जान चुके हैं। ${rupee(Math.min(CHAI.PRICE_MAX, p + 3))} पर क्या होगा, यह अभी नहीं जानते।`);
        }
        if (last.profit < 0) return B2('You lost money yesterday. Was it too few customers — or too little earned on each cup?', 'कल घाटा हुआ। ग्राहक बहुत कम थे — या हर कप पर कमाई बहुत कम?');
        if (same.length >= 3) {
            const top = same.reduce((a, b) => (b.outcome.revenue > a.outcome.revenue ? b : a)).outcome;
            const rich = same.reduce((a, b) => (b.outcome.profit > a.outcome.profit ? b : a)).outcome;
            if (top.day !== rich.day) return B2(`Your busiest till was Day ${top.day}. Your best profit was Day ${rich.day}. Why are they different days?`, `सबसे ज़्यादा आमदनी दिन ${top.day} को हुई। सबसे ज़्यादा लाभ दिन ${rich.day} को। ये दिन अलग क्यों हैं?`);
        }
        return null;
    },
    chart(history, reveal) {
        if (!history.length) return null;
        const traces = [];
        Object.keys(CHAI_REG).forEach(reg => {
            const rows = history.filter(r => r.outcome.regime === reg);
            if (!rows.length) return;
            traces.push({
                x: rows.map(r => r.outcome.cups), y: rows.map(r => r.outcome.price), text: rows.map(r => String(r.round)),
                mode: 'markers+text', textposition: 'top center', textfont: { size: 9, color: '#4b4470' },
                marker: { size: 11, color: CHAI_REG[reg].color, line: { color: '#fff', width: 1.5 } },
                name: lifeT(B2(`Your days — ${CHAI_REG[reg].en}`, `आपके दिन — ${CHAI_REG[reg].hi}`)), hoverinfo: 'x+y'
            });
        });
        if (reveal) {
            const line = (reg, name, color, dash) => ({ x: [0, 100], y: [CHAI.priceAt(0, reg), CHAI.priceAt(100, reg)], mode: 'lines', line: { color, width: 2.5, dash }, name });
            traces.unshift(
                line('normal', lifeT(B2('Demand DD (ordinary day)', 'मांग DD (सामान्य दिन)')), '#6366f1'),
                line('cold', lifeT(B2('Demand D₁D₁ (cold wave)', 'मांग D₁D₁ (शीत लहर)')), '#0891b2'),
                { x: [0, 50], y: [CHAI.mr(0, 'normal'), CHAI.mr(50, 'normal')], mode: 'lines', line: { color: '#a855f7', width: 2, dash: 'dash' }, name: lifeT(B2('MR (ordinary day)', 'MR (सामान्य दिन)')) },
                { x: [0, 100], y: [CHAI.mc('normal'), CHAI.mc('normal')], mode: 'lines', line: { color: '#16a34a', width: 2 }, name: lifeT(B2('MC = ₹5', 'MC = ₹5')) },
                { x: [0, 100], y: [CHAI.mc('costly'), CHAI.mc('costly')], mode: 'lines', line: { color: '#f97316', width: 2, dash: 'dot' }, name: lifeT(B2('MC = ₹9 (costly milk)', 'MC = ₹9 (महँगा दूध)')) }
            );
        }
        return {
            traces,
            layout: {
                xaxis: { title: lifeT(B2('Cups sold in a day', 'एक दिन में बिके कप')), range: [0, 100] },
                yaxis: { title: lifeT(B2('Price (₹)', 'कीमत (₹)')), range: [0, 32] }
            }
        };
    },
    debrief(history) {
        const byReg = reg => history.filter(r => r.outcome.regime === reg).map(r => r.outcome);
        const normal = byReg('normal'), cold = byReg('cold'), costly = byReg('costly');
        const totalProfit = history.reduce((s, r) => s + r.outcome.profit, 0);
        const bestTotal = history.reduce((s, r) => s + r.outcome.bestProfit, 0);
        const score = Math.max(0, Math.min(100, 100 * totalProfit / bestTotal));
        const maxBy = (rows, f) => rows.reduce((a, b) => (f(b) > f(a) ? b : a));

        // 1. Law of demand — the widest price gap inside one kind of day.
        let law = null;
        [normal, cold, costly].forEach(rows => rows.forEach(a => rows.forEach(b => {
            if (b.price > a.price && b.cups < a.cups && (!law || b.price - a.price > law.b.price - law.a.price)) law = { a, b };
        })));
        // 2. Shift — a cold day and an ordinary day at (nearly) the same price.
        let shift = null;
        // The cold day's price must be the SAME OR HIGHER: then none of the extra
        // cups can be put down to a cheaper cup — it can only be the shift.
        cold.forEach(c => normal.forEach(n => {
            const d = c.price - n.price;
            if (d < 0 || d > 1 || c.cups <= n.cups) return;
            if (!shift || d < shift.c.price - shift.n.price) shift = { c, n };
        }));
        // 3. Total-expenditure method — a pair wholly on one side of the unit-elastic price.
        let elastic = null, inelastic = null;
        [['normal', normal], ['cold', cold], ['costly', costly]].forEach(([reg, rows]) => {
            const u = CHAI.unitElasticPrice(reg);
            rows.forEach(a => rows.forEach(b => {
                if (b.price <= a.price) return;
                if (a.price >= u && b.revenue < a.revenue && !elastic) elastic = { a, b };
                if (b.price <= u && b.revenue > a.revenue && !inelastic) inelastic = { a, b };
            }));
        });
        // 4. Biggest till vs biggest profit, on ordinary days.
        const topRev = normal.length ? maxBy(normal, o => o.revenue) : null;
        const topPro = normal.length ? maxBy(normal, o => o.profit) : null;
        const revVsProfit = !!topRev && topRev.day !== topPro.day && topPro.price > topRev.price;
        // 5. MR = MC — did the student's own best ordinary day land on the model's optimum?
        const opt = CHAI.best('normal');
        const found = !!topPro && new Set(normal.map(o => o.price)).size >= 2 && Math.abs(topPro.price - opt.price) <= 1;
        // 6. A cost change moved the best price, not the crowd.
        const optCostly = CHAI.best('costly');
        const topCostly = costly.length ? maxBy(costly, o => o.profit) : null;
        const costMove = !!topCostly && !!topPro && topCostly.price > topPro.price;

        const insights = [
            {
                icon: '📉', concept: B2('Law of Demand', 'मांग का नियम'), holds: !!law,
                evidence: law ? B2(`Day ${law.a.day} at ${rupee(law.a.price)} → ${law.a.cups} cups. Day ${law.b.day} at ${rupee(law.b.price)} → ${law.b.cups} cups. Same kind of day, same crowd: a higher price, fewer buyers.`, `दिन ${law.a.day}: ${rupee(law.a.price)} पर ${law.a.cups} कप। दिन ${law.b.day}: ${rupee(law.b.price)} पर ${law.b.cups} कप। वैसा ही दिन, वही भीड़: कीमत बढ़ी, ख़रीदार घटे।`) : null,
                tryThis: B2('On two ordinary days, charge two clearly different prices.', 'दो सामान्य दिनों में दो साफ़ अलग कीमतें रखिए।'),
                exam: B2('Other things remaining the same, quantity demanded falls as price rises. Your two days are two points on ONE demand curve — a movement along it (contraction of demand).', 'अन्य बातें समान रहने पर, कीमत बढ़ने से मांगी गई मात्रा घटती है। आपके दो दिन एक ही मांग वक्र के दो बिंदु हैं — वक्र पर संचलन (मांग का संकुचन)।')
            },
            {
                icon: '↗️', concept: B2('A shift is not a movement', 'खिसकाव संचलन नहीं है'), holds: !!shift,
                evidence: shift ? (shift.c.price === shift.n.price
                    ? B2(`Day ${shift.n.day} (ordinary) and Day ${shift.c.day} (cold wave) had exactly the same price — ${rupee(shift.n.price)} — yet you sold ${shift.c.cups} cups instead of ${shift.n.cups}. The price did not do that. The weather did.`, `दिन ${shift.n.day} (सामान्य) और दिन ${shift.c.day} (शीत लहर) में कीमत बिल्कुल समान थी — ${rupee(shift.n.price)} — फिर भी ${shift.n.cups} की जगह ${shift.c.cups} कप बिके। यह कीमत ने नहीं, मौसम ने किया।`)
                    : B2(`Day ${shift.c.day} (cold wave) was DEARER than Day ${shift.n.day} (ordinary) — ${rupee(shift.c.price)} against ${rupee(shift.n.price)} — yet you sold ${shift.c.cups} cups instead of ${shift.n.cups}. A higher price cannot bring more buyers. The weather did.`, `दिन ${shift.c.day} (शीत लहर) दिन ${shift.n.day} (सामान्य) से महँगा था — ${rupee(shift.n.price)} के मुक़ाबले ${rupee(shift.c.price)} — फिर भी ${shift.n.cups} की जगह ${shift.c.cups} कप बिके। ऊँची कीमत ज़्यादा ख़रीदार नहीं ला सकती। यह मौसम ने किया।`)) : null,
                tryThis: B2('On the first cold day, keep the price exactly where it was.', 'शीत लहर के पहले दिन कीमत बिल्कुल वही रखिए।'),
                exam: B2('A change in a factor OTHER than the good’s own price (here, weather/tastes) shifts the whole curve: Increase in Demand, DD → D₁D₁. Never call it "expansion".', 'वस्तु की अपनी कीमत के अलावा किसी कारक (यहाँ मौसम/रुचि) में बदलाव पूरे वक्र को खिसकाता है: मांग में वृद्धि, DD → D₁D₁। इसे कभी "विस्तार" न कहें।')
            },
            {
                icon: '🧮', concept: B2('Elasticity, by the total-expenditure method', 'लोच — कुल व्यय विधि से'), holds: !!(elastic || inelastic),
                evidence: (elastic || inelastic) ? B2(
                    [elastic ? `Raising the price from ${rupee(elastic.a.price)} to ${rupee(elastic.b.price)} made your takings FALL (${rupee(elastic.a.revenue)} → ${rupee(elastic.b.revenue)}): up there demand is elastic (Ed > 1).` : '',
                        inelastic ? `Raising it from ${rupee(inelastic.a.price)} to ${rupee(inelastic.b.price)} made your takings RISE (${rupee(inelastic.a.revenue)} → ${rupee(inelastic.b.revenue)}): down there demand is inelastic (Ed < 1).` : ''].filter(Boolean).join(' '),
                    [elastic ? `कीमत ${rupee(elastic.a.price)} से ${rupee(elastic.b.price)} करने पर आमदनी घटी (${rupee(elastic.a.revenue)} → ${rupee(elastic.b.revenue)}): वहाँ मांग लोचदार है (Ed > 1)।` : '',
                        inelastic ? `कीमत ${rupee(inelastic.a.price)} से ${rupee(inelastic.b.price)} करने पर आमदनी बढ़ी (${rupee(inelastic.a.revenue)} → ${rupee(inelastic.b.revenue)}): वहाँ मांग बेलोचदार है (Ed < 1)।` : ''].filter(Boolean).join(' ')) : null,
                tryThis: B2('Try two prices above ₹13 and two below ₹12, and watch only the money coming in.', '₹13 से ऊपर दो और ₹12 से नीचे दो कीमतें आज़माइए, और केवल आमदनी पर नज़र रखिए।'),
                exam: B2('Price ↑ and total expenditure ↓ ⇒ Ed > 1. Price ↑ and total expenditure ↑ ⇒ Ed < 1. Unchanged ⇒ Ed = 1. On your ordinary-day line the turning point is ₹12.50.', 'कीमत ↑ और कुल व्यय ↓ ⇒ Ed > 1। कीमत ↑ और कुल व्यय ↑ ⇒ Ed < 1। अपरिवर्तित ⇒ Ed = 1। आपकी सामान्य-दिन रेखा पर मोड़ ₹12.50 पर है।')
            },
            {
                icon: '💰', concept: B2('Most revenue is not most profit', 'अधिकतम आगम अधिकतम लाभ नहीं'), holds: revVsProfit,
                evidence: revVsProfit ? B2(`Your fullest till on an ordinary day was Day ${topRev.day} (${rupee(topRev.price)}, ${rupee(topRev.revenue)} in). Your best profit was Day ${topPro.day} (${rupee(topPro.price)}, ${rupee(topPro.profit)}). Selling more cups also meant making more cups.`, `सामान्य दिनों में सबसे ज़्यादा आमदनी दिन ${topRev.day} को हुई (${rupee(topRev.price)}, ${rupee(topRev.revenue)})। सबसे ज़्यादा लाभ दिन ${topPro.day} को (${rupee(topPro.price)}, ${rupee(topPro.profit)})। ज़्यादा कप बेचने का मतलब ज़्यादा कप बनाना भी था।`) : null,
                tryThis: B2('On ordinary days, try ₹12 or ₹13 once and ₹15 once, and compare the till with the profit.', 'सामान्य दिनों में एक बार ₹12 या ₹13 और एक बार ₹15 रखिए; आमदनी और लाभ की तुलना कीजिए।'),
                exam: B2('Profit = TR − TC. TR is highest where MR = 0; profit is highest where MR = MC. With a positive MC these are different outputs.', 'लाभ = TR − TC। TR वहाँ अधिकतम है जहाँ MR = 0; लाभ वहाँ अधिकतम है जहाँ MR = MC। MC धनात्मक हो तो ये उत्पादन-स्तर अलग होते हैं।')
            },
            {
                icon: '🎯', concept: B2("Producer's equilibrium: MR = MC", 'उत्पादक का संतुलन: MR = MC'), holds: found,
                evidence: found ? B2(`Your best ordinary-day price was ${rupee(topPro.price)}. The model's best is ${rupee(opt.price)} — about ${opt.cups} cups. There, selling one more cup adds ${rupee(CHAI.mr(opt.cups, 'normal'))} to revenue (MR) and costs ${rupee(CHAI.mc('normal'))} to make (MC). Push further and each extra cup adds less than it costs.`, `सामान्य दिन की आपकी सर्वश्रेष्ठ कीमत ${rupee(topPro.price)} रही। मॉडल की सर्वश्रेष्ठ ${rupee(opt.price)} है — लगभग ${opt.cups} कप। वहाँ एक और कप बेचने से आगम ${rupee(CHAI.mr(opt.cups, 'normal'))} बढ़ता है (MR) और बनाने में ${rupee(CHAI.mc('normal'))} लगते हैं (MC)। इससे आगे हर अतिरिक्त कप लागत से कम जोड़ता है।`) : null,
                tryThis: B2(`Search the ordinary days around ${rupee(opt.price - 2)}–${rupee(opt.price + 2)} one rupee at a time.`, `सामान्य दिनों में ${rupee(opt.price - 2)}–${rupee(opt.price + 2)} के आसपास एक-एक रुपये से खोजिए।`),
                exam: B2('Equilibrium output is where (1) MR = MC and (2) MC is greater than MR after that output. Write BOTH conditions for full marks.', 'संतुलन उत्पादन वहाँ है जहाँ (1) MR = MC और (2) उस उत्पादन के बाद MC, MR से अधिक हो। पूरे अंक के लिए दोनों शर्तें लिखें।')
            },
            {
                icon: '🥛', concept: B2('A cost shock is not a demand shock', 'लागत का झटका मांग का झटका नहीं'), holds: costMove,
                evidence: costMove ? B2(`When milk got dearer the crowd did not change — the same price pulled the same people. But each cup earned you ₹4 less, and your best price moved up from ${rupee(topPro.price)} to ${rupee(topCostly.price)} (the model's best: ${rupee(optCostly.price)}).`, `दूध महँगा होने पर भीड़ नहीं बदली — उसी कीमत पर उतने ही लोग आए। पर हर कप पर ₹4 कम बचे, और आपकी सर्वश्रेष्ठ कीमत ${rupee(topPro.price)} से बढ़कर ${rupee(topCostly.price)} हो गई (मॉडल की सर्वश्रेष्ठ: ${rupee(optCostly.price)})।`) : null,
                tryThis: B2('From Day 8, test a price a little above your ordinary-day best.', 'दिन 8 से, अपनी सामान्य-दिन की सर्वश्रेष्ठ कीमत से थोड़ी ऊपर की कीमत आज़माइए।'),
                exam: B2('Price of inputs is a determinant of SUPPLY (it raises MC). It does not shift the demand curve — a classic one-mark trap.', 'साधनों की कीमत पूर्ति का निर्धारक है (यह MC बढ़ाती है)। यह मांग वक्र को नहीं खिसकाती — एक अंक का प्रसिद्ध जाल।')
            }
        ];
        return {
            score,
            scoreLine: B2(`You made ${rupee(totalProfit)} in ten days. A stall-owner who knew the crowd perfectly would expect about ${rupee(bestTotal)}.`, `दस दिनों में आपने ${rupee(totalProfit)} कमाए। भीड़ को पूरी तरह जानने वाला टपरी-मालिक लगभग ${rupee(bestTotal)} की अपेक्षा करता।`),
            insights
        };
    }
});

// ── 2. THE MANDI ──────────────────────────────────────────────────
// A tomato mandi with many sellers. Market demand and supply are straight
// lines; the price that clears the market is where they cross. You bring
// 10 kg a day and can only choose your asking price.
const MANDI = {
    STOCK: 10, ASK_MIN: 15, ASK_MAX: 45,
    regime(day) { return day <= 3 ? 'base' : (day <= 5 ? 'bumper' : (day <= 7 ? 'wedding' : (day <= 9 ? 'ceiling' : 'floor'))); },
    curves(reg) {
        return {
            a: reg === 'wedding' ? 360 : 300, b: 5,   // Qd = a − b·P
            c: reg === 'bumper' ? 0 : -60, d: 7       // Qs = c + d·P
        };
    },
    qd(p, reg) { const k = MANDI.curves(reg); return Math.max(0, k.a - k.b * p); },
    qs(p, reg) { const k = MANDI.curves(reg); return Math.max(0, k.c + k.d * p); },
    eq(reg) { const k = MANDI.curves(reg); const p = (k.a - k.c) / (k.b + k.d); return { p, q: k.a - k.b * p }; },
    control(reg) { return reg === 'ceiling' ? { type: 'ceiling', price: 24 } : (reg === 'floor' ? { type: 'floor', price: 36 } : null); },
    // What the market does at the going (or controlled) price.
    market(reg) {
        const e = MANDI.eq(reg), ctl = MANDI.control(reg);
        const binding = !!ctl && ((ctl.type === 'ceiling' && ctl.price < e.p) || (ctl.type === 'floor' && ctl.price > e.p));
        const p = binding ? ctl.price : e.p;
        const qd = MANDI.qd(p, reg), qs = MANDI.qs(p, reg);
        return { price: p, qd, qs, traded: Math.min(qd, qs), shortage: Math.max(0, qd - qs), surplus: Math.max(0, qs - qd), eq: e, control: ctl, binding };
    },
    // What ONE small seller sells at an asking price.
    sell(ask, reg) {
        const m = MANDI.market(reg);
        if (ask > m.price + 1e-9) return 0;                 // dearer than everyone else: nobody comes
        if (m.surplus > 0) return MANDI.STOCK * m.qd / m.qs; // more tomatoes than buyers: each seller sells a share
        return MANDI.STOCK;
    },
    bestRevenue(reg) { const m = MANDI.market(reg); return m.price * MANDI.sell(m.price, reg); }
};
// 6.25 → "6.25", 10 → "10"
const kgNum = v => String(Math.round(v * 100) / 100);
const MANDI_REG = {
    base: B2('ordinary day', 'सामान्य दिन'), bumper: B2('bumper crop', 'बंपर फ़सल'), wedding: B2('wedding season', 'शादियों का मौसम'),
    ceiling: B2('price ceiling', 'कीमत की उच्चतम सीमा'), floor: B2('support price', 'समर्थन मूल्य')
};

LIFE_WORLDS.push({
    id: 'mandi', icon: '🍅', accent: '#dc2626', minutes: 8,
    title: B2('The Tomato Mandi', 'टमाटर की मंडी'),
    role: B2('one tomato seller among hundreds', 'सैकड़ों में से एक टमाटर विक्रेता'),
    tagline: B2('You bring 10 kg a day. You can ask any price you like. See who listens.', 'आप रोज़ 10 किलो लाते हैं। जो चाहें कीमत माँग सकते हैं। देखिए कौन सुनता है।'),
    class: 'XI', part: 'B', unit: 7, unitTitle: 'Perfect Competition — Price Determination and Simple Applications',
    syllabusIds: ['XI-B-U7-PERFECT-COMP', 'XI-B-U7-MARKET-EQ', 'XI-B-U7-APPLICATIONS'],
    labs: ['gl-market-equilibrium-shifts', 'micro-price-controls', 'micro-market-structures'],
    rounds: 10, roundWord: B2('Day', 'दिन'),
    goLabel: B2('Call out your price ▶', 'अपनी कीमत बोलें ▶'),
    brief: B2(
        `<p>You sell tomatoes in a big mandi. So do <b>hundreds of others</b>, and every tomato looks the same.</p>
         <p>Each morning you arrive with <b>10 kg</b>. They will not keep — what you don't sell today is thrown away.</p>
         <p>You choose your <b>asking price per kg</b>. Earn as much as you can in ten days.</p>`,
        `<p>आप एक बड़ी मंडी में टमाटर बेचते हैं। <b>सैकड़ों और लोग</b> भी बेचते हैं, और हर टमाटर एक जैसा दिखता है।</p>
         <p>हर सुबह आप <b>10 किलो</b> लेकर आते हैं। ये टिकेंगे नहीं — जो आज नहीं बिका, वह फेंकना पड़ेगा।</p>
         <p>आप अपनी <b>प्रति किलो माँगी कीमत</b> तय करते हैं। दस दिनों में जितना हो सके कमाइए।</p>`),
    truth: MANDI,
    init() { return {}; },
    news(state, day, history) {
        const prev = history.length ? history[history.length - 1].outcome : null;
        const board = prev ? B2(` Yesterday's rate on the board: ${rupee(prev.market)}/kg.`, ` बोर्ड पर कल का भाव: ${rupee(prev.market)}/किलो।`) : B2('', '');
        const say = (en, hi) => B2(en + board.en, hi + board.hi);
        if (day === 1) { const e = MANDI.eq('base'); return B2(`Old hands say tomatoes have been going for about ${rupee(e.p - 1)}–${rupee(e.p + 1)} a kg.`, `पुराने व्यापारी कहते हैं टमाटर लगभग ${rupee(e.p - 1)}–${rupee(e.p + 1)} किलो चल रहा है।`); }
        if (day === 4) return say('🚜 A bumper crop! Trucks of tomatoes are arriving from every village.', '🚜 बंपर फ़सल! हर गाँव से टमाटर के ट्रक आ रहे हैं।');
        if (day === 6) return say('💍 The harvest rush is over — and the wedding season has begun. Caterers are buying for feasts.', '💍 फ़सल की भरमार ख़त्म — और शादियों का मौसम शुरू। हलवाई दावतों के लिए ख़रीद रहे हैं।');
        if (day === 8) return say(`📢 Things are back to normal, but the government has announced: no one may sell above ${rupee(MANDI.control('ceiling').price)}/kg.`, `📢 हालात सामान्य हैं, पर सरकार ने घोषणा की है: कोई भी ${rupee(MANDI.control('ceiling').price)}/किलो से ऊपर नहीं बेचेगा।`);
        if (day === 10) return say(`📢 The ceiling is gone. To protect farmers, no one may now sell below ${rupee(MANDI.control('floor').price)}/kg.`, `📢 उच्चतम सीमा हटी। किसानों की रक्षा के लिए अब कोई ${rupee(MANDI.control('floor').price)}/किलो से नीचे नहीं बेचेगा।`);
        return prev ? B2(board.en.trim(), board.hi.trim()) : null;
    },
    decisions(state, day) {
        const ctl = MANDI.control(MANDI.regime(day));
        return [{
            id: 'ask', label: B2('Your asking price per kg', 'आपकी माँगी कीमत (प्रति किलो)'), unit: '₹', step: 1, value: 30,
            min: ctl && ctl.type === 'floor' ? ctl.price : MANDI.ASK_MIN,
            max: ctl && ctl.type === 'ceiling' ? ctl.price : MANDI.ASK_MAX
        }];
    },
    predict(state, day, history) {
        const reg = MANDI.regime(day);
        if (day === 4 || day === 6) {
            const before = history[history.length - 1].outcome.market;
            return {
                prompt: B2("Compared with yesterday's rate, today's mandi rate will…", 'कल के भाव की तुलना में आज मंडी का भाव…'),
                options: [B2('Rise', 'बढ़ेगा'), B2('Stay the same', 'वही रहेगा'), B2('Fall', 'गिरेगा')],
                answer: o => (o.market > before ? 0 : (o.market === before ? 1 : 2))
            };
        }
        if (day === 8 || day === 10) {
            const ctl = MANDI.control(reg);
            return {
                prompt: B2(`At ${rupee(ctl.price)}/kg, by law, the mandi will have…`, `क़ानूनन ${rupee(ctl.price)}/किलो पर मंडी में होगा…`),
                options: [B2('More buyers than tomatoes', 'टमाटर से ज़्यादा ख़रीदार'), B2('Exactly enough of both', 'दोनों बराबर'), B2('More tomatoes than buyers', 'ख़रीदारों से ज़्यादा टमाटर')],
                answer: o => (o.shortage > 0 ? 0 : (o.surplus > 0 ? 2 : 1))
            };
        }
        return null;
    },
    step(state, decision, day) {
        const reg = MANDI.regime(day), m = MANDI.market(reg), ask = decision.ask;
        const sold = MANDI.sell(ask, reg);
        return {
            day, regime: reg, ask, market: m.price, eqPrice: m.eq.p, eqQty: m.eq.q, qd: m.qd, qs: m.qs, traded: m.traded,
            shortage: m.shortage, surplus: m.surplus, control: m.binding ? m.control.type : null,
            sold, unsold: MANDI.STOCK - sold, revenue: sold * ask, best: MANDI.bestRevenue(reg)
        };
    },
    scene(state, o, day) {
        const reg = MANDI.regime(day);
        const stalls = [0, 1, 2, 3, 4, 5, 6].map(i => {
            const mine = i === 3, x = 22 + i * 70;
            const tag = mine ? (o ? rupee(o.ask) : '₹ ?') : (o ? rupee(o.market) : '···');
            const mark = !o ? '' : (mine ? (o.sold >= MANDI.STOCK ? '✅' : (o.sold > 0 ? '➗' : '❌')) : '');
            return `<g transform="translate(${x},70)">
                <rect x="0" y="18" width="56" height="50" rx="6" fill="${mine ? '#fee2e2' : '#f1f5f9'}" stroke="${mine ? '#dc2626' : '#cbd5e1'}" stroke-width="${mine ? 2.5 : 1.2}"></rect>
                <text x="28" y="40" text-anchor="middle" font-size="16">🍅</text>
                <text x="28" y="60" text-anchor="middle" font-size="11.5" font-weight="800" fill="${LIFE_INK}">${tag}</text>
                ${mine ? `<text x="28" y="10" text-anchor="middle" font-size="10" font-weight="700" fill="#dc2626">${lifeT(B2('YOU', 'आप'))} ${mark}</text>` : ''}
            </g>`;
        }).join('');
        let foot = lifeT(B2('Buyers walk the row and stop at the cheapest stall.', 'ख़रीदार क़तार में घूमते हैं और सबसे सस्ती दुकान पर रुकते हैं।'));
        let extra = '';
        if (o) {
            foot = lifeT(B2(`The mandi wanted ${o.qd} kg and brought ${o.qs} kg at ${rupee(o.market)}.`, `${rupee(o.market)} पर मंडी ने ${o.qd} किलो चाहा और ${o.qs} किलो आया।`));
            if (o.shortage > 0) extra = `<text x="260" y="196" text-anchor="middle" font-size="12.5" font-weight="700" fill="#b91c1c">😟 ${lifeT(B2(`${o.shortage} kg of buyers went home empty-handed`, `${o.shortage} किलो के ख़रीदार ख़ाली हाथ लौटे`))}</text>`;
            else if (o.surplus > 0) extra = `<text x="260" y="196" text-anchor="middle" font-size="12.5" font-weight="700" fill="#b45309">📦 ${lifeT(B2(`${o.surplus} kg of tomatoes found no buyer`, `${o.surplus} किलो टमाटर को ख़रीदार नहीं मिला`))}</text>`;
        }
        return lifeSvg(lifeT(B2('A row of tomato stalls; yours is highlighted', 'टमाटर की दुकानों की क़तार; आपकी दुकान उभरी हुई है')), `
            <rect x="0" y="0" width="520" height="240" rx="14" fill="#fef2f2"></rect>
            <text x="22" y="30" font-size="13" font-weight="700" fill="${LIFE_INK}">🏪 ${lifeT(MANDI_REG[reg])}</text>
            <text x="22" y="50" font-size="10.5" fill="${LIFE_MUTE}">${foot}</text>
            ${stalls}${extra}
            <text x="260" y="222" text-anchor="middle" font-size="10.5" fill="${LIFE_MUTE}">${o ? lifeT(B2(`You sold ${kgNum(o.sold)} of ${MANDI.STOCK} kg`, `आपने ${MANDI.STOCK} में से ${kgNum(o.sold)} किलो बेचा`)) : ''}</text>`);
    },
    stats(o) {
        return [
            { label: B2('You asked', 'आपने माँगा'), value: rupee(o.ask) },
            { label: B2('Mandi rate', 'मंडी भाव'), value: rupee(o.market) },
            { label: B2('You sold', 'आपने बेचा'), value: `${kgNum(o.sold)} ${lifeT(B2('kg', 'किलो'))}`, tone: o.sold >= MANDI.STOCK ? 'good' : 'bad' },
            { label: B2('You earned', 'आपकी कमाई'), value: rupee(o.revenue), tone: o.revenue >= o.best - 1e-9 ? 'good' : undefined }
        ];
    },
    ledger: [
        { key: 'day', label: B2('Day', 'दिन'), get: r => String(r.round) },
        { key: 'ask', label: B2('Asked', 'माँगा'), get: r => rupee(r.outcome.ask) },
        { key: 'rate', label: B2('Rate', 'भाव'), get: r => rupee(r.outcome.market) },
        { key: 'sold', label: B2('Sold kg', 'बिका किलो'), get: r => kgNum(r.outcome.sold) },
        { key: 'rev', label: B2('Earned', 'कमाई'), get: r => rupee(r.outcome.revenue) }
    ],
    narrate(o) {
        if (o.surplus > 0) {
            return o.sold > 0
                ? B2(`By law nobody could go below ${rupee(o.market)}. At that price farmers brought ${o.qs} kg but buyers wanted only ${o.qd} kg. You sold <b>${kgNum(o.sold)} kg</b> of your 10 and threw the rest away: ${rupee(o.revenue)}.`, `क़ानूनन कोई ${rupee(o.market)} से नीचे नहीं जा सकता था। उस कीमत पर किसान ${o.qs} किलो लाए पर ख़रीदार केवल ${o.qd} किलो चाहते थे। आपने 10 में से <b>${kgNum(o.sold)} किलो</b> बेचा, बाक़ी फेंकना पड़ा: ${rupee(o.revenue)}।`)
                : B2(`You asked ${rupee(o.ask)} when everyone else stood at ${rupee(o.market)} with tomatoes to spare. Nobody came. <b>All 10 kg wasted.</b>`, `आपने ${rupee(o.ask)} माँगे जबकि बाक़ी सब ${rupee(o.market)} पर ढेर लिए खड़े थे। कोई नहीं आया। <b>पूरे 10 किलो बेकार।</b>`);
        }
        if (o.sold === 0) return B2(`You asked ${rupee(o.ask)}. Every other stall was selling the very same tomatoes at ${rupee(o.market)}. Buyers walked straight past. <b>You sold nothing</b> — 10 kg thrown away.`, `आपने ${rupee(o.ask)} माँगे। हर दूसरी दुकान वही टमाटर ${rupee(o.market)} पर बेच रही थी। ख़रीदार सीधे आगे निकल गए। <b>कुछ नहीं बिका</b> — 10 किलो फेंकने पड़े।`);
        if (o.shortage > 0) return B2(`The law capped the price at ${rupee(o.market)}. At that price buyers wanted ${o.qd} kg but only ${o.qs} kg came to the mandi. Your 10 kg vanished in minutes — ${rupee(o.revenue)} — and people were still queuing when you left.`, `क़ानून ने कीमत ${rupee(o.market)} पर रोक दी। उस कीमत पर ख़रीदार ${o.qd} किलो चाहते थे पर मंडी में केवल ${o.qs} किलो आया। आपके 10 किलो मिनटों में ख़त्म — ${rupee(o.revenue)} — और आपके जाते समय भी लोग क़तार में थे।`);
        if (o.ask < o.market) return B2(`You asked ${rupee(o.ask)} and sold out at once — but the mandi rate was ${rupee(o.market)}. The same 10 kg would have fetched ${rupee(o.best)}; you took home ${rupee(o.revenue)}. <b>${rupee(o.best - o.revenue)} left on the table.</b>`, `आपने ${rupee(o.ask)} माँगे और तुरंत सब बिक गया — पर मंडी भाव ${rupee(o.market)} था। वही 10 किलो ${rupee(o.best)} दिलाते; आप ${rupee(o.revenue)} लेकर लौटे। <b>${rupee(o.best - o.revenue)} हाथ से गए।</b>`);
        return B2(`You asked ${rupee(o.ask)} — exactly the going rate. All 10 kg sold: <b>${rupee(o.revenue)}</b>. Today nobody in this mandi did better per kilo.`, `आपने ${rupee(o.ask)} माँगे — ठीक चालू भाव। पूरे 10 किलो बिके: <b>${rupee(o.revenue)}</b>। आज इस मंडी में प्रति किलो इससे बेहतर किसी ने नहीं किया।`);
    },
    nudge(history, state, day) {
        if (!history.length) return null;
        const reg = MANDI.regime(day), last = history[history.length - 1].outcome;
        if (last.regime !== reg) return B2('Something has changed in the mandi. Is it the buyers or the sellers who are different today — and which way does that push the rate?', 'मंडी में कुछ बदला है। आज ख़रीदार बदले हैं या विक्रेता — और इससे भाव किधर जाएगा?');
        if (last.sold === 0) return B2('You held out for more and went home with nothing. What did the buyers have that let them ignore you?', 'आप ज़्यादा के लिए अड़े रहे और ख़ाली लौटे। ख़रीदारों के पास ऐसा क्या था कि वे आपको अनदेखा कर सके?');
        if (last.ask < last.market) return B2('You sold out instantly. That feels good — but what does selling out instantly tell you about your price?', 'सब तुरंत बिक गया। अच्छा लगता है — पर तुरंत बिक जाना आपकी कीमत के बारे में क्या बताता है?');
        return null;
    },
    chart(history, reveal) {
        if (!history.length) return null;
        if (!reveal) {
            return {
                traces: [
                    { x: history.map(r => r.round), y: history.map(r => r.outcome.market), mode: 'lines+markers', line: { color: '#64748b', width: 2, shape: 'hv' }, marker: { size: 6 }, name: lifeT(B2('Mandi rate', 'मंडी भाव')) },
                    { x: history.map(r => r.round), y: history.map(r => r.outcome.ask), mode: 'markers', marker: { size: 12, symbol: history.map(r => (r.outcome.sold > 0 ? 'circle' : 'x')), color: history.map(r => (r.outcome.sold >= MANDI.STOCK ? '#16a34a' : (r.outcome.sold > 0 ? '#f59e0b' : '#dc2626'))), line: { color: '#fff', width: 1.5 } }, name: lifeT(B2('Your asking price', 'आपकी माँगी कीमत')) }
                ],
                layout: { xaxis: { title: lifeT(B2('Day', 'दिन')), range: [0.5, 10.5], dtick: 1 }, yaxis: { title: lifeT(B2('Price per kg (₹)', 'कीमत प्रति किलो (₹)')), range: [12, 48] } }
            };
        }
        const seg = (fn, reg) => { const xs = [], ys = []; for (let p = 10; p <= 50; p += 5) { xs.push(fn(p, reg)); ys.push(p); } return { x: xs, y: ys }; };
        const curve = (fn, reg, name, color, dash) => Object.assign(seg(fn, reg), { mode: 'lines', line: { color, width: 2.5, dash }, name });
        const eqs = ['base', 'bumper', 'wedding'].map(r => MANDI.eq(r));
        const cap = MANDI.control('ceiling').price, flr = MANDI.control('floor').price;
        return {
            traces: [
                curve(MANDI.qd, 'base', lifeT(B2('Demand DD', 'मांग DD')), '#6366f1'),
                curve(MANDI.qs, 'base', lifeT(B2('Supply SS', 'पूर्ति SS')), '#16a34a'),
                curve(MANDI.qs, 'bumper', lifeT(B2('Supply S₁S₁ (bumper crop)', 'पूर्ति S₁S₁ (बंपर फ़सल)')), '#16a34a', 'dash'),
                curve(MANDI.qd, 'wedding', lifeT(B2('Demand D₁D₁ (weddings)', 'मांग D₁D₁ (शादियाँ)')), '#6366f1', 'dash'),
                { x: [0, 300], y: [cap, cap], mode: 'lines', line: { color: '#dc2626', width: 1.5, dash: 'dot' }, name: lifeT(B2(`Ceiling ₹${cap}`, `उच्चतम सीमा ₹${cap}`)) },
                { x: [0, 300], y: [flr, flr], mode: 'lines', line: { color: '#b45309', width: 1.5, dash: 'dot' }, name: lifeT(B2(`Floor ₹${flr}`, `न्यूनतम सीमा ₹${flr}`)) },
                { x: eqs.map(e => e.q), y: eqs.map(e => e.p), text: ['E', 'E₁', 'E₂'], mode: 'markers+text', textposition: 'middle right', marker: { size: 11, color: '#1e1b3a' }, name: lifeT(B2('The rate each day settled at', 'हर दिन भाव जहाँ ठहरा')) }
            ],
            layout: { xaxis: { title: lifeT(B2('Tomatoes in the mandi (kg)', 'मंडी में टमाटर (किलो)')), range: [0, 300] }, yaxis: { title: lifeT(B2('Price per kg (₹)', 'कीमत प्रति किलो (₹)')), range: [10, 50] } }
        };
    },
    debrief(history) {
        const total = history.reduce((s, r) => s + r.outcome.revenue, 0), best = history.reduce((s, r) => s + r.outcome.best, 0);
        const free = history.filter(r => !r.outcome.control).map(r => r.outcome);
        const high = free.find(o => o.ask > o.market), low = free.find(o => o.ask < o.market);
        const rec = d => history.find(r => r.round === d);
        const right = d => !!(rec(d) && rec(d).predict && rec(d).predict.correct);
        const adapted = d => { const r = rec(d); return !!r && r.outcome.ask === r.outcome.market; };
        const b4 = rec(4) && rec(4).outcome, b3 = rec(3) && rec(3).outcome, w6 = rec(6) && rec(6).outcome, c8 = rec(8) && rec(8).outcome, f10 = rec(10) && rec(10).outcome;
        return {
            score: Math.max(0, Math.min(100, 100 * total / best)),
            scoreLine: B2(`You earned ${rupee(total)} from 100 kg. The most any single seller could have earned was ${rupee(best)}.`, `100 किलो से आपने ${rupee(total)} कमाए। कोई भी अकेला विक्रेता अधिकतम ${rupee(best)} कमा सकता था।`),
            insights: [
                {
                    icon: '🙇', concept: B2('The firm is a price taker', 'फर्म कीमत स्वीकारक है'), holds: !!(high && low),
                    evidence: (high && low) ? B2(`Day ${high.day}: you asked ${rupee(high.ask)} against a rate of ${rupee(high.market)} and sold nothing. Day ${low.day}: you asked ${rupee(low.ask)} against ${rupee(low.market)}, sold out, and gave away ${rupee(low.best - low.revenue)}. Above the rate you sell zero; below it you only lose. One seller among hundreds does not set the price — the market does.`, `दिन ${high.day}: ${rupee(high.market)} के भाव पर आपने ${rupee(high.ask)} माँगे और कुछ नहीं बिका। दिन ${low.day}: ${rupee(low.market)} के भाव पर ${rupee(low.ask)} माँगे, सब बिका, और ${rupee(low.best - low.revenue)} गँवाए। भाव से ऊपर बिक्री शून्य; नीचे केवल नुकसान। सैकड़ों में एक विक्रेता कीमत तय नहीं करता — बाज़ार करता है।`) : null,
                    tryThis: B2('On ordinary days, ask once clearly above the board rate and once clearly below it.', 'सामान्य दिनों में एक बार बोर्ड के भाव से साफ़ ऊपर और एक बार साफ़ नीचे माँगिए।'),
                    exam: B2('Perfect competition: very many sellers, a homogeneous product, perfect knowledge. So the firm faces a perfectly elastic (horizontal) demand curve at the market price: AR = MR = Price.', 'पूर्ण प्रतियोगिता: बहुत अधिक विक्रेता, समरूप वस्तु, पूर्ण ज्ञान। इसलिए फर्म का मांग वक्र बाज़ार कीमत पर पूर्णतया लोचदार (क्षैतिज) होता है: AR = MR = कीमत।')
                },
                {
                    icon: '🚜', concept: B2('More supply, lower price', 'पूर्ति बढ़ी, कीमत घटी'), holds: !!b4 && (right(4) || adapted(5)),
                    evidence: (b4 && b3) ? B2(`The bumper crop moved the rate from ${rupee(b3.market)} to ${rupee(b4.market)}, while the quantity traded ROSE from ${b3.traded} to ${b4.traded} kg. Nothing about buyers changed — sellers had more to sell at every price.`, `बंपर फ़सल ने भाव ${rupee(b3.market)} से ${rupee(b4.market)} कर दिया, जबकि बिकी मात्रा ${b3.traded} से बढ़कर ${b4.traded} किलो हुई। ख़रीदारों में कुछ नहीं बदला — विक्रेताओं के पास हर कीमत पर बेचने को ज़्यादा था।`) : null,
                    tryThis: B2('When the trucks arrive on Day 4, decide which way the rate must move before you ask.', 'दिन 4 को ट्रक आने पर माँगने से पहले तय कीजिए कि भाव किधर जाएगा।'),
                    exam: B2('Increase in supply (SS → S₁S₁, rightward): equilibrium price falls, equilibrium quantity rises.', 'पूर्ति में वृद्धि (SS → S₁S₁, दायीं ओर): संतुलन कीमत घटती है, संतुलन मात्रा बढ़ती है।')
                },
                {
                    icon: '💍', concept: B2('More demand, higher price', 'मांग बढ़ी, कीमत बढ़ी'), holds: !!w6 && (right(6) || adapted(7)),
                    evidence: (w6 && b3) ? B2(`In the wedding season the rate went to ${rupee(w6.market)} and ${w6.traded} kg changed hands — both higher than an ordinary day (${rupee(b3.market)}, ${b3.traded} kg). Buyers wanted more at every price.`, `शादियों के मौसम में भाव ${rupee(w6.market)} हुआ और ${w6.traded} किलो बिका — दोनों सामान्य दिन (${rupee(b3.market)}, ${b3.traded} किलो) से ऊँचे। ख़रीदार हर कीमत पर ज़्यादा चाहते थे।`) : null,
                    tryThis: B2('On Day 6, think about who has changed — the people buying or the people selling.', 'दिन 6 को सोचिए कौन बदला है — ख़रीदने वाले या बेचने वाले।'),
                    exam: B2('Increase in demand (DD → D₁D₁, rightward): equilibrium price AND equilibrium quantity both rise.', 'मांग में वृद्धि (DD → D₁D₁, दायीं ओर): संतुलन कीमत और संतुलन मात्रा दोनों बढ़ती हैं।')
                },
                {
                    icon: '🧢', concept: B2('A price ceiling creates a shortage', 'उच्चतम कीमत सीमा से कमी पैदा होती है'), holds: right(8),
                    evidence: c8 ? B2(`Capped at ${rupee(c8.market)} (below the ${rupee(c8.eqPrice)} the market would reach), buyers wanted ${c8.qd} kg and sellers brought ${c8.qs} kg: a shortage of ${c8.shortage} kg. You saw the queue.`, `${rupee(c8.market)} की सीमा पर (बाज़ार के ${rupee(c8.eqPrice)} से नीचे) ख़रीदार ${c8.qd} किलो चाहते थे और विक्रेता ${c8.qs} किलो लाए: ${c8.shortage} किलो की कमी। क़तार आपने देखी।`) : null,
                    tryThis: B2('Before Day 8, ask yourself: at a lower price, who wants more and who brings less?', 'दिन 8 से पहले ख़ुद से पूछिए: कम कीमत पर कौन ज़्यादा चाहता है और कौन कम लाता है?'),
                    exam: B2('A ceiling set BELOW equilibrium price ⇒ excess demand (shortage) ⇒ rationing, queues, black marketing. A ceiling above equilibrium has no effect.', 'संतुलन कीमत से नीचे रखी उच्चतम सीमा ⇒ अधिमांग (कमी) ⇒ राशनिंग, क़तारें, कालाबाज़ारी। संतुलन से ऊपर की सीमा का कोई प्रभाव नहीं।')
                },
                {
                    icon: '🧱', concept: B2('A price floor creates a surplus', 'न्यूनतम कीमत सीमा से अधिशेष पैदा होता है'), holds: right(10),
                    evidence: f10 ? B2(`Held up at ${rupee(f10.market)} (above ${rupee(f10.eqPrice)}), farmers brought ${f10.qs} kg and buyers took only ${f10.qd} kg: a surplus of ${f10.surplus} kg. That is why you could sell only ${kgNum(f10.sold)} of your 10 kg.`, `${rupee(f10.market)} पर रोके जाने से (${rupee(f10.eqPrice)} से ऊपर) किसान ${f10.qs} किलो लाए और ख़रीदारों ने केवल ${f10.qd} किलो लिया: ${f10.surplus} किलो का अधिशेष। इसीलिए आप 10 में से केवल ${kgNum(f10.sold)} किलो बेच पाए।`) : null,
                    tryThis: B2('Before Day 10: at a HIGHER price than the market wants, who shows up in larger numbers?', 'दिन 10 से पहले: बाज़ार की चाह से ऊँची कीमत पर कौन ज़्यादा संख्या में आता है?'),
                    exam: B2('A floor (e.g. Minimum Support Price) set ABOVE equilibrium ⇒ excess supply (surplus), which the government must buy up as buffer stock.', 'संतुलन से ऊपर रखी न्यूनतम सीमा (जैसे न्यूनतम समर्थन मूल्य) ⇒ अतिरिक्त पूर्ति (अधिशेष), जिसे सरकार को बफ़र स्टॉक के रूप में ख़रीदना पड़ता है।')
                }
            ]
        };
    }
});

// ── 3. POCKET MONEY ───────────────────────────────────────────────
// ₹120 a day, two things in the canteen. The joy of each extra one falls.
// The schedules are chosen so the equi-marginal rule holds EXACTLY, with the
// whole budget spent, at each of the three samosa prices (tested by brute force).
const POCKET = {
    BUDGET: 120, PY: 20,
    MU_X: [100, 80, 60, 20, 18, 15, 12, 10, 5, 2],  // samosas
    MU_Y: [120, 90, 60, 40, 25, 10],                // lassi
    PX_BY_DAY: [10, 10, 20, 20, 5, 5],
    px(day) { return POCKET.PX_BY_DAY[day - 1]; },
    tu(x, y) { let s = 0; for (let i = 0; i < x; i++) s += POCKET.MU_X[i]; for (let j = 0; j < y; j++) s += POCKET.MU_Y[j]; return s; },
    cost(x, y, px) { return x * px + y * POCKET.PY; },
    // The best affordable tray, by trying every one.
    best(px) {
        let b = null;
        for (let x = 0; x <= POCKET.MU_X.length; x++) for (let y = 0; y <= POCKET.MU_Y.length; y++) {
            if (POCKET.cost(x, y, px) > POCKET.BUDGET) continue;
            const tu = POCKET.tu(x, y);
            if (!b || tu > b.tu) b = { x, y, tu };
        }
        return b;
    }
};

LIFE_WORLDS.push({
    id: 'pocket-money', icon: '🥟', accent: '#7c3aed', minutes: 6,
    title: B2('Pocket Money', 'जेब-ख़र्च'),
    role: B2('a hungry student with ₹120', '₹120 के साथ एक भूखे विद्यार्थी'),
    tagline: B2('Samosas or lassi? Fill your tray and feel what the fourth samosa is really worth.', 'समोसा या लस्सी? थाली भरिए और महसूस कीजिए चौथा समोसा सच में कितने का है।'),
    class: 'XI', part: 'B', unit: 5, unitTitle: "Consumer's Equilibrium and Demand",
    syllabusIds: ['XI-B-U5-UTILITY', 'XI-B-U5-DEMAND'],
    labs: ['micro-consumer-equilibrium', 'gl-consumer-equilibrium-ic', 'gl-demand-movement-shift'],
    rounds: 6, roundWord: B2('Day', 'दिन'),
    goLabel: B2('Eat ▶', 'खाइए ▶'),
    brief: B2(
        `<p>Every day you get <b>₹120</b> for the canteen. It sells two things: <b>samosas</b> and <b>lassi</b>.</p>
         <p>You love both — but notice how much you enjoy the <b>next</b> one each time. Your tray shows the joy each item gave you.</p>
         <p>Get the most <b>joy</b> out of your ₹120. Canteen prices will change.</p>`,
        `<p>हर दिन आपको कैंटीन के लिए <b>₹120</b> मिलते हैं। वहाँ दो चीज़ें बिकती हैं: <b>समोसा</b> और <b>लस्सी</b>।</p>
         <p>दोनों आपको पसंद हैं — पर ध्यान दीजिए कि हर बार <b>अगली</b> चीज़ में कितना आनंद आता है। आपकी थाली हर चीज़ से मिला आनंद दिखाएगी।</p>
         <p>अपने ₹120 से अधिकतम <b>आनंद</b> पाइए। कैंटीन की कीमतें बदलेंगी।</p>`),
    truth: POCKET,
    init() { return {}; },
    news(state, day) {
        const px = POCKET.px(day);
        if (day === 1) return B2(`Canteen board: samosa ${rupee(px)}, lassi ${rupee(POCKET.PY)}.`, `कैंटीन बोर्ड: समोसा ${rupee(px)}, लस्सी ${rupee(POCKET.PY)}।`);
        if (px !== POCKET.px(day - 1)) return B2(`📢 New samosa price: ${rupee(px)} (it was ${rupee(POCKET.px(day - 1))}). Lassi is still ${rupee(POCKET.PY)}.`, `📢 समोसे की नई कीमत: ${rupee(px)} (पहले ${rupee(POCKET.px(day - 1))})। लस्सी अब भी ${rupee(POCKET.PY)}।`);
        return B2(`Same prices as yesterday: samosa ${rupee(px)}, lassi ${rupee(POCKET.PY)}. Can you do better?`, `कीमतें कल जैसी: समोसा ${rupee(px)}, लस्सी ${rupee(POCKET.PY)}। क्या आप बेहतर कर सकते हैं?`);
    },
    decisions() {
        return [
            { id: 'x', label: B2('🥟 Samosas', '🥟 समोसे'), min: 0, max: POCKET.MU_X.length, step: 1, value: 2, unit: '' },
            { id: 'y', label: B2('🥤 Glasses of lassi', '🥤 लस्सी के गिलास'), min: 0, max: POCKET.MU_Y.length, step: 1, value: 2, unit: '' }
        ];
    },
    live(state, d, day) {
        const px = POCKET.px(day), spent = POCKET.cost(d.x, d.y, px), left = POCKET.BUDGET - spent;
        if (left < 0) return { ok: false, text: B2(`That tray costs ${rupee(spent)} — you only have ${rupee(POCKET.BUDGET)}.`, `इस थाली की कीमत ${rupee(spent)} है — आपके पास केवल ${rupee(POCKET.BUDGET)} हैं।`) };
        return { ok: true, text: B2(`Tray: ${rupee(spent)} · left in pocket: ${rupee(left)}`, `थाली: ${rupee(spent)} · जेब में बचे: ${rupee(left)}`) };
    },
    predict(state, day, history) {
        const px = POCKET.px(day);
        if (day === 1 || px === POCKET.px(day - 1)) return null;
        const before = Math.max.apply(null, history.filter(r => r.outcome.px === POCKET.px(day - 1)).map(r => r.outcome.bestJoy));
        return {
            prompt: B2(`Samosas now cost ${rupee(px)}. Before you fill the tray — the MOST joy ₹120 can buy today will be…`, `समोसा अब ${rupee(px)} का है। थाली भरने से पहले — आज ₹120 से मिलने वाला अधिकतम आनंद होगा…`),
            options: [B2('More than before', 'पहले से अधिक'), B2('The same', 'उतना ही'), B2('Less than before', 'पहले से कम')],
            answer: o => (o.bestJoy > before ? 0 : (o.bestJoy === before ? 1 : 2))
        };
    },
    step(state, d, day) {
        const px = POCKET.px(day), best = POCKET.best(px), joy = POCKET.tu(d.x, d.y), spent = POCKET.cost(d.x, d.y, px);
        return {
            day, px, py: POCKET.PY, x: d.x, y: d.y, spent, left: POCKET.BUDGET - spent, joy,
            bestJoy: best.tu, bestX: best.x, bestY: best.y,
            muX: d.x > 0 ? POCKET.MU_X[d.x - 1] : null, muY: d.y > 0 ? POCKET.MU_Y[d.y - 1] : null,
            stars: joy >= best.tu ? 3 : (joy >= 0.92 * best.tu ? 2 : 1)
        };
    },
    scene(state, o, day) {
        const px = POCKET.px(day);
        const row = (n, mu, emoji, y) => {
            let out = '';
            for (let i = 0; i < n; i++) {
                const x = 30 + i * 47;
                out += `<g class="life-pop" style="animation-delay:${i * 90}ms"><text x="${x}" y="${y}" font-size="24">${emoji}</text>
                    <text x="${x + 14}" y="${y + 18}" text-anchor="middle" font-size="11" font-weight="700" fill="${mu[i] >= 60 ? '#15803d' : (mu[i] >= 20 ? '#b45309' : '#b91c1c')}">+${mu[i]}</text></g>`;
            }
            return out;
        };
        return lifeSvg(lifeT(B2('Your canteen tray, with the joy each item gave', 'आपकी कैंटीन थाली, हर चीज़ से मिले आनंद के साथ')), `
            <rect x="0" y="0" width="520" height="240" rx="14" fill="#f5f3ff"></rect>
            <text x="22" y="30" font-size="13" font-weight="700" fill="${LIFE_INK}">🍽️ ${lifeT(B2(`Samosa ${rupee(px)} · Lassi ${rupee(POCKET.PY)} · Pocket ${rupee(POCKET.BUDGET)}`, `समोसा ${rupee(px)} · लस्सी ${rupee(POCKET.PY)} · जेब ${rupee(POCKET.BUDGET)}`))}</text>
            ${o ? `${row(o.x, POCKET.MU_X, '🥟', 86)}${row(o.y, POCKET.MU_Y, '🥤', 156)}
                   <text x="22" y="216" font-size="12.5" font-weight="700" fill="${LIFE_INK}">${lifeT(B2(`Total joy ${o.joy}`, `कुल आनंद ${o.joy}`))} ${'⭐'.repeat(o.stars)}</text>
                   <text x="498" y="216" text-anchor="end" font-size="10.5" fill="${LIFE_MUTE}">${lifeT(B2('number = joy from that one', 'संख्या = उस एक से मिला आनंद'))}</text>`
        : `<text x="260" y="130" text-anchor="middle" font-size="44">😋</text>
                   <text x="260" y="165" text-anchor="middle" font-size="12" fill="${LIFE_MUTE}">${lifeT(B2('What goes on the tray today?', 'आज थाली में क्या रखेंगे?'))}</text>`}`);
    },
    stats(o) {
        return [
            { label: B2('Samosas', 'समोसे'), value: String(o.x) },
            { label: B2('Lassi', 'लस्सी'), value: String(o.y) },
            { label: B2('Spent', 'ख़र्च'), value: rupee(o.spent) },
            { label: B2('Total joy', 'कुल आनंद'), value: `${o.joy} ${'⭐'.repeat(o.stars)}`, tone: o.stars === 3 ? 'good' : undefined }
        ];
    },
    ledger: [
        { key: 'day', label: B2('Day', 'दिन'), get: r => String(r.round) },
        { key: 'px', label: B2('🥟 price', '🥟 कीमत'), get: r => rupee(r.outcome.px) },
        { key: 'x', label: '🥟', get: r => String(r.outcome.x) },
        { key: 'y', label: '🥤', get: r => String(r.outcome.y) },
        { key: 'joy', label: B2('Joy', 'आनंद'), get: r => `${r.outcome.joy} ${'⭐'.repeat(r.outcome.stars)}` }
    ],
    narrate(o) {
        const tray = B2(`${o.x} samosa(s) and ${o.y} lassi for ${rupee(o.spent)}: <b>${o.joy} joy</b>.`, `${o.x} समोसे और ${o.y} लस्सी, ${rupee(o.spent)} में: <b>${o.joy} आनंद</b>।`);
        if (o.stars === 3) return B2(`${tray.en} ⭐⭐⭐ Nobody could squeeze more joy out of ${rupee(POCKET.BUDGET)} at these prices.`, `${tray.hi} ⭐⭐⭐ इन कीमतों पर ${rupee(POCKET.BUDGET)} से इससे अधिक आनंद कोई नहीं निकाल सकता।`);
        const left = o.left > 0 ? B2(` You still had ${rupee(o.left)} in your pocket.`, ` जेब में अब भी ${rupee(o.left)} थे।`) : B2('', '');
        return B2(`${tray.en}${left.en} ${'⭐'.repeat(o.stars)} A different tray for the same money would have felt better.`, `${tray.hi}${left.hi} ${'⭐'.repeat(o.stars)} उतने ही पैसों में कोई दूसरी थाली ज़्यादा अच्छी लगती।`);
    },
    nudge(history) {
        if (!history.length) return null;
        const o = history[history.length - 1].outcome;
        if (o.stars === 3) return null;
        if (o.left >= Math.min(o.px, o.py)) return B2('You went home with money in your pocket that could still have bought something you would enjoy.', 'आप जेब में ऐसे पैसे लेकर लौटे जिनसे अब भी कुछ मज़ेदार ख़रीदा जा सकता था।');
        return B2('Look at the LAST samosa and the LAST lassi on yesterday’s tray. Which gave you less joy for each rupee it cost? Would one more of the other have been worth more?', 'कल की थाली का आख़िरी समोसा और आख़िरी लस्सी देखिए। किसने अपने हर रुपये पर कम आनंद दिया? क्या दूसरी चीज़ एक और लेना ज़्यादा अच्छा होता?');
    },
    chart(history, reveal) {
        if (!history.length) return null;
        const traces = [{
            x: history.map(r => r.outcome.x), y: history.map(r => r.outcome.px), text: history.map(r => String(r.round)),
            mode: 'markers+text', textposition: 'top center', textfont: { size: 9 },
            marker: { size: 12, color: history.map(r => (r.outcome.stars === 3 ? '#16a34a' : '#a78bfa')), line: { color: '#fff', width: 1.5 } },
            name: lifeT(B2('Samosas you bought (green = best possible tray)', 'आपने ख़रीदे समोसे (हरा = सर्वोत्तम थाली)'))
        }];
        if (reveal) {
            const prices = [5, 10, 20];
            traces.unshift({ x: prices.map(p => POCKET.best(p).x), y: prices, mode: 'lines+markers', line: { color: '#7c3aed', width: 2.5 }, marker: { size: 7 }, name: lifeT(B2('Your demand curve for samosas (best tray at each price)', 'समोसे के लिए आपका मांग वक्र (हर कीमत पर सर्वोत्तम थाली)')) });
        }
        return { traces, layout: { xaxis: { title: lifeT(B2('Samosas bought in a day', 'एक दिन में ख़रीदे समोसे')), range: [0, 10.5], dtick: 1 }, yaxis: { title: lifeT(B2('Price of a samosa (₹)', 'समोसे की कीमत (₹)')), range: [0, 24] } } };
    },
    debrief(history) {
        const os = history.map(r => r.outcome);
        const score = os.reduce((s, o) => s + 100 * o.joy / o.bestJoy, 0) / os.length;
        const dmu = os.find(o => o.x >= 3) || os.find(o => o.y >= 3);
        const dmuList = dmu ? (dmu.x >= 3 ? POCKET.MU_X.slice(0, dmu.x) : POCKET.MU_Y.slice(0, dmu.y)) : [];
        const eq = os.find(o => o.stars === 3 && o.x > 0 && o.y > 0);
        const bestAt = px => { const rows = os.filter(o => o.px === px && o.stars === 3); return rows.length ? rows[0] : null; };
        const a = bestAt(5), b = bestAt(10), c = bestAt(20);
        const pts = [a, b, c].filter(Boolean);
        const derived = pts.length >= 2 && pts.every((p, i) => i === 0 || p.x < pts[i - 1].x);
        return {
            score,
            scoreLine: B2(`Across six days you got ${Math.round(score)}% of all the joy your pocket money could have bought.`, `छह दिनों में आपने उस पूरे आनंद का ${Math.round(score)}% पाया जो आपका जेब-ख़र्च ख़रीद सकता था।`),
            insights: [
                {
                    icon: '📉', concept: B2('Law of Diminishing Marginal Utility', 'ह्रासमान सीमांत उपयोगिता का नियम'), holds: !!dmu,
                    evidence: dmu ? B2(`Day ${dmu.day}: one after another, your ${dmu.x >= 3 ? 'samosas' : 'glasses of lassi'} gave ${dmuList.join(', ')} joy. Each one was worth less to you than the one before — though your total joy kept rising.`, `दिन ${dmu.day}: एक के बाद एक, आपके ${dmu.x >= 3 ? 'समोसों' : 'लस्सी के गिलासों'} ने ${dmuList.join(', ')} आनंद दिया। हर अगला आपके लिए पिछले से कम मूल्य का था — हालाँकि कुल आनंद बढ़ता रहा।`) : null,
                    tryThis: B2('Put at least three of the same thing on one tray and read the numbers in order.', 'एक थाली में एक ही चीज़ कम से कम तीन रखिए और संख्याएँ क्रम से पढ़िए।'),
                    exam: B2('As more units of a good are consumed, the marginal utility from each successive unit falls. TU rises at a diminishing rate as long as MU is positive.', 'जैसे-जैसे किसी वस्तु की अधिक इकाइयों का उपभोग होता है, हर अगली इकाई की सीमांत उपयोगिता घटती है। जब तक MU धनात्मक है, TU घटती दर से बढ़ती है।')
                },
                {
                    icon: '⚖️', concept: B2("Consumer's equilibrium: MUx/Px = MUy/Py", 'उपभोक्ता संतुलन: MUx/Px = MUy/Py'), holds: !!eq,
                    evidence: eq ? B2(`Day ${eq.day}, your best tray: the last samosa gave ${eq.muX} joy for ${rupee(eq.px)} — ${eq.muX / eq.px} per rupee. The last lassi gave ${eq.muY} for ${rupee(eq.py)} — ${eq.muY / eq.py} per rupee. Equal. No rupee could be moved from one to the other to feel better, and nothing was left unspent.`, `दिन ${eq.day}, आपकी सर्वोत्तम थाली: आख़िरी समोसे ने ${rupee(eq.px)} में ${eq.muX} आनंद दिया — प्रति रुपया ${eq.muX / eq.px}। आख़िरी लस्सी ने ${rupee(eq.py)} में ${eq.muY} — प्रति रुपया ${eq.muY / eq.py}। बराबर। एक भी रुपया इधर से उधर करके बेहतर महसूस नहीं किया जा सकता था, और कुछ भी बिना ख़र्च नहीं बचा।`) : null,
                    tryThis: B2('For each item ask: joy of the last one ÷ its price. Shift a rupee toward the bigger answer.', 'हर चीज़ के लिए पूछिए: आख़िरी वाले का आनंद ÷ उसकी कीमत। रुपया बड़े उत्तर की ओर खिसकाइए।'),
                    exam: B2('Two-good equilibrium: (1) MUx/Px = MUy/Py (= MU of a rupee), and (2) the whole income is spent. If MUx/Px > MUy/Py, buy more X and less Y.', 'दो वस्तुओं का संतुलन: (1) MUx/Px = MUy/Py (= रुपये की सीमांत उपयोगिता), और (2) पूरी आय ख़र्च हो। यदि MUx/Px > MUy/Py, तो X अधिक और Y कम ख़रीदें।')
                },
                {
                    icon: '🛒', concept: B2('Your demand curve came out of your own tray', 'आपका मांग वक्र आपकी अपनी थाली से निकला'), holds: derived,
                    evidence: derived ? B2(`Your best trays: ${pts.map(p => `${p.x} samosas at ${rupee(p.px)}`).join(', ')}. Your tastes never changed — only the price did — and you bought fewer as it rose. That schedule IS a demand curve.`, `आपकी सर्वोत्तम थालियाँ: ${pts.map(p => `${rupee(p.px)} पर ${p.x} समोसे`).join(', ')}। आपकी रुचि कभी नहीं बदली — केवल कीमत बदली — और कीमत बढ़ने पर आपने कम ख़रीदे। यही अनुसूची मांग वक्र है।`) : null,
                    tryThis: B2('Reach the three-star tray at two different samosa prices.', 'समोसे की दो अलग कीमतों पर तीन-सितारा थाली तक पहुँचिए।'),
                    exam: B2('When Px rises, MUx/Px falls below MUy/Py, so the consumer buys less X until equality is restored. This is why the demand curve slopes downward.', 'जब Px बढ़ती है, MUx/Px, MUy/Py से कम हो जाता है, इसलिए उपभोक्ता X कम ख़रीदता है जब तक बराबरी न लौट आए। इसी कारण मांग वक्र नीचे की ओर ढलता है।')
                }
            ]
        };
    }
});

// ── 4. THE TOWN SURVEY ────────────────────────────────────────────
// 200 households in three neighbourhoods; you must estimate the town's
// average monthly income without visiting everyone — until the census does.
const SURVEY = {
    N: 200, SIZES: [10, 20, 40],
    ZONES: [
        { id: 'road', n: 40, lo: 60, hi: 200, x0: 30, y0: 66, cols: 10, name: B2('Market Road', 'बाज़ार रोड') },
        { id: 'colony', n: 90, lo: 25, hi: 60, x0: 196, y0: 66, cols: 15, name: B2('The Colony', 'कॉलोनी') },
        { id: 'basti', n: 70, lo: 8, hi: 25, x0: 30, y0: 160, cols: 28, name: B2('The Basti', 'बस्ती') }
    ],
    build(rng) {
        const homes = [];
        SURVEY.ZONES.forEach(z => {
            for (let i = 0; i < z.n; i++) {
                // Skewed inside each zone: most households near the bottom of its range.
                const u = rng();
                homes.push({ zone: z.id, income: Math.round(z.lo + (z.hi - z.lo) * u * u), x: z.x0 + (i % z.cols) * 17, y: z.y0 + Math.floor(i / z.cols) * 17 });
            }
        });
        return homes;
    },
    mean(xs) { return xs.reduce((s, v) => s + v, 0) / xs.length; },
    median(xs) { const s = xs.slice().sort((a, b) => a - b), m = Math.floor(s.length / 2); return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; },
    // Which households a method visits.
    pick(homes, method, n, rng) {
        if (method === 'census') return homes.map((h, i) => i);
        if (method === 'road') return homes.map((h, i) => i).filter(i => homes[i].zone === 'road').slice(0, n); // the first doors on Market Road
        const idx = homes.map((h, i) => i);
        for (let i = idx.length - 1; i > 0; i--) { const j = rng.int(0, i); const t = idx[i]; idx[i] = idx[j]; idx[j] = t; }
        return idx.slice(0, n);
    }
};
const SURVEY_METHOD = { road: B2('Market Road doors', 'बाज़ार रोड के घर'), random: B2('Lottery draw', 'लॉटरी से चयन'), census: B2('Census', 'जनगणना') };
const kRupee = v => `₹${(Math.round(v * 10) / 10).toFixed(1)}k`;

LIFE_WORLDS.push({
    id: 'town-survey', icon: '📋', accent: '#d97706', minutes: 6,
    title: B2('Survey the Town', 'शहर का सर्वेक्षण'),
    role: B2('a field investigator with a clipboard', 'क्लिपबोर्ड लिए एक क्षेत्र-अन्वेषक'),
    tagline: B2('200 households. You cannot visit them all. How close can a few doors get you?', '200 परिवार। आप सबके यहाँ नहीं जा सकते। कुछ दरवाज़े आपको कितना पास पहुँचा सकते हैं?'),
    class: 'XI', part: 'A', unit: 2, unitTitle: 'Collection, Organisation and Presentation of Data',
    syllabusIds: ['XI-A-U2-COLLECTION', 'XI-A-U3-CENTRAL-TENDENCY'],
    labs: ['stats-data-collection', 'stats-central-tendency'],
    rounds: 6, roundWord: B2('Survey', 'सर्वेक्षण'),
    goLabel: B2('Go knocking ▶', 'दरवाज़े खटखटाएँ ▶'),
    brief: B2(
        `<p>The district office wants one number: the <b>average monthly income</b> of this town's <b>200 households</b>.</p>
         <p>You have time for five small surveys. Each time, choose <b>which doors</b> to knock on and <b>how many</b>.</p>
         <p>Then the Census will count every household — and show how close you got.</p>`,
        `<p>ज़िला कार्यालय को एक संख्या चाहिए: इस शहर के <b>200 परिवारों</b> की <b>औसत मासिक आय</b>।</p>
         <p>आपके पास पाँच छोटे सर्वेक्षणों का समय है। हर बार चुनिए <b>किन दरवाज़ों</b> पर जाना है और <b>कितने</b>।</p>
         <p>फिर जनगणना हर परिवार को गिनेगी — और दिखाएगी आप कितने पास पहुँचे।</p>`),
    truth: SURVEY,
    init(rng) {
        const homes = SURVEY.build(rng), all = homes.map(h => h.income);
        return { homes, trueMean: SURVEY.mean(all), trueMedian: SURVEY.median(all) };
    },
    news(state, round) {
        if (round === 6) return B2('🏛️ The Census of India team has arrived. Every one of the 200 households will be counted.', '🏛️ भारत की जनगणना का दल आ गया है। सभी 200 परिवार गिने जाएँगे।');
        if (round === 1) return B2('Market Road is right by the bus stand — easy doors. The Basti is a long walk.', 'बाज़ार रोड बस अड्डे के पास है — आसान दरवाज़े। बस्ती दूर पैदल है।');
        return null;
    },
    decisions(state, round) {
        if (round === 6) return [{ id: 'method', type: 'choice', label: B2('The Census counts everyone', 'जनगणना सबको गिनती है'), value: 'census', options: [{ value: 'census', label: B2('Count all 200 households', 'सभी 200 परिवार गिनें') }] }];
        return [
            {
                id: 'method', type: 'choice', label: B2('Which doors?', 'कौन-से दरवाज़े?'), value: 'road', options: [
                    { value: 'road', label: B2('🚌 The nearest doors, on Market Road', '🚌 सबसे पास के दरवाज़े, बाज़ार रोड पर') },
                    { value: 'random', label: B2('🎲 Draw house numbers by lottery', '🎲 लॉटरी से मकान नंबर निकालें') }]
            },
            { id: 'n', type: 'choice', label: B2('How many households?', 'कितने परिवार?'), value: '10', options: SURVEY.SIZES.map(n => ({ value: String(n), label: B2(String(n), String(n)) })) }
        ];
    },
    predict(state, round, history) {
        if (round !== 6) return null;
        return {
            prompt: B2('Which of your five estimates will the Census prove closest to the truth?', 'जनगणना आपके पाँच अनुमानों में से किसे सच के सबसे निकट सिद्ध करेगी?'),
            options: history.map(r => B2(`#${r.round}: ${kRupee(r.outcome.mean)} (${SURVEY_METHOD[r.outcome.method].en}, ${r.outcome.n})`, `#${r.round}: ${kRupee(r.outcome.mean)} (${SURVEY_METHOD[r.outcome.method].hi}, ${r.outcome.n})`)),
            answer: (o, hist) => { let best = 0; hist.forEach((r, i) => { if (Math.abs(r.outcome.mean - o.mean) < Math.abs(hist[best].outcome.mean - o.mean)) best = i; }); return best; }
        };
    },
    step(state, d, round, rng) {
        const method = d.method, n = method === 'census' ? SURVEY.N : Number(d.n);
        const ids = SURVEY.pick(state.homes, method, n, rng), xs = ids.map(i => state.homes[i].income);
        const mean = SURVEY.mean(xs), median = SURVEY.median(xs);
        return { round, method, n: ids.length, ids, mean, median, zones: SURVEY.ZONES.map(z => ids.filter(i => state.homes[i].zone === z.id).length), isCensus: method === 'census' };
    },
    scene(state, o) {
        const chosen = o ? new Set(o.ids) : null;
        const dots = state.homes.map((h, i) => {
            const on = chosen && chosen.has(i);
            return `<rect x="${h.x - 5}" y="${h.y - 5}" width="10" height="10" rx="2" fill="${on ? '#d97706' : '#e2e8f0'}" stroke="${on ? '#92400e' : '#cbd5e1'}" stroke-width="1" class="${on ? 'life-pop' : ''}" style="animation-delay:${(i % 30) * 14}ms"></rect>`;
        }).join('');
        const labels = SURVEY.ZONES.map((z, k) => `<text x="${z.x0 - 6}" y="${z.y0 - 12}" font-size="11" font-weight="700" fill="${LIFE_INK}">${lifeT(z.name)}${o ? ` · ${o.zones[k]}` : ''}</text>`).join('');
        return lifeSvg(lifeT(B2('Map of the town: every square is a household, orange ones were surveyed', 'शहर का नक़्शा: हर वर्ग एक परिवार है, नारंगी वाले सर्वेक्षण में आए')), `
            <rect x="0" y="0" width="520" height="240" rx="14" fill="#fffbeb"></rect>
            <text x="22" y="28" font-size="13" font-weight="700" fill="${LIFE_INK}">🗺️ ${o ? lifeT(B2(`${o.n} of ${SURVEY.N} households asked`, `${SURVEY.N} में से ${o.n} परिवारों से पूछा`)) : lifeT(B2('200 households, three neighbourhoods', '200 परिवार, तीन मोहल्ले'))}</text>
            <text x="498" y="28" text-anchor="end" font-size="10.5" fill="${LIFE_MUTE}">🚌 ${lifeT(B2('bus stand ↖', 'बस अड्डा ↖'))}</text>
            ${labels}${dots}`);
    },
    stats(o) {
        return [
            { label: B2('Households asked', 'पूछे गए परिवार'), value: String(o.n) },
            { label: B2('Mean income', 'माध्य आय'), value: kRupee(o.mean) },
            { label: B2('Median income', 'माध्यिका आय'), value: kRupee(o.median) }
        ];
    },
    ledger: [
        { key: 'r', label: '#', get: r => String(r.round) },
        { key: 'm', label: B2('Doors', 'दरवाज़े'), get: r => lifeT(SURVEY_METHOD[r.outcome.method]) },
        { key: 'n', label: 'n', get: r => String(r.outcome.n) },
        { key: 'mean', label: B2('Mean', 'माध्य'), get: r => kRupee(r.outcome.mean) },
        { key: 'med', label: B2('Median', 'माध्यिका'), get: r => kRupee(r.outcome.median) }
    ],
    narrate(o, state, history) {
        if (o.isCensus) {
            return B2(`All ${o.n} households counted. The town's true mean monthly income is <b>${kRupee(o.mean)}</b>; its median is <b>${kRupee(o.median)}</b>. It took ${o.n} interviews to be certain.`, `सभी ${o.n} परिवार गिने गए। शहर की वास्तविक माध्य मासिक आय <b>${kRupee(o.mean)}</b> है; माध्यिका <b>${kRupee(o.median)}</b>। निश्चित होने में ${o.n} साक्षात्कार लगे।`);
        }
        const where = B2(`${o.zones[0]} on Market Road, ${o.zones[1]} in the Colony, ${o.zones[2]} in the Basti`, `${o.zones[0]} बाज़ार रोड पर, ${o.zones[1]} कॉलोनी में, ${o.zones[2]} बस्ती में`);
        const prev = history.length > 1 ? history[history.length - 2].outcome : null;
        const cmp = prev ? B2(` Your last survey said ${kRupee(prev.mean)}.`, ` पिछले सर्वेक्षण ने ${kRupee(prev.mean)} बताया था।`) : B2('', '');
        return B2(`You asked ${o.n} households (${where.en}). Their mean income: <b>${kRupee(o.mean)}</b> a month; median ${kRupee(o.median)}.${cmp.en} Which number would you sign your name under?`, `आपने ${o.n} परिवारों से पूछा (${where.hi})। उनकी माध्य आय: <b>${kRupee(o.mean)}</b> प्रति माह; माध्यिका ${kRupee(o.median)}।${cmp.hi} किस संख्या के नीचे आप अपना नाम लिखेंगे?`);
    },
    nudge(history, state, round) {
        if (round === 6 || !history.length) return null;
        const methods = new Set(history.map(r => r.outcome.method));
        if (methods.size === 1 && history.length >= 2) {
            return methods.has('road')
                ? B2('Every household you have met lives on one road. What do you actually know about the other 160?', 'आप जिन परिवारों से मिले, सब एक ही सड़क पर रहते हैं। बाक़ी 160 के बारे में आप वास्तव में क्या जानते हैं?')
                : B2('Your lottery samples keep disagreeing a little. Would knocking on more doors change that?', 'आपके लॉटरी नमूने थोड़ा-थोड़ा अलग आ रहे हैं। क्या ज़्यादा दरवाज़ों पर जाने से यह बदलेगा?');
        }
        const sizes = new Set(history.filter(r => r.outcome.method === 'random').map(r => r.outcome.n));
        if (methods.has('random') && sizes.size === 1 && history.length >= 3) return B2('You have only tried one sample size by lottery. Try a much bigger or a much smaller draw.', 'आपने लॉटरी से केवल एक ही आकार का नमूना लिया है। कहीं बड़ा या कहीं छोटा नमूना आज़माइए।');
        return null;
    },
    chart(history, reveal, state) {
        const rows = history.filter(r => !r.outcome.isCensus);
        if (!rows.length) return null;
        const traces = ['road', 'random'].map(m => {
            const rs = rows.filter(r => r.outcome.method === m);
            return { x: rs.map(r => r.round), y: rs.map(r => r.outcome.mean), text: rs.map(r => `n=${r.outcome.n}`), mode: 'markers+text', textposition: 'top center', textfont: { size: 9 }, marker: { size: 13, color: m === 'road' ? '#dc2626' : '#2563eb', line: { color: '#fff', width: 1.5 } }, name: lifeT(B2(`Your estimate — ${SURVEY_METHOD[m].en}`, `आपका अनुमान — ${SURVEY_METHOD[m].hi}`)) };
        }).filter(t => t.x.length);
        if (reveal) {
            traces.unshift(
                { x: [0.5, 5.5], y: [state.trueMean, state.trueMean], mode: 'lines', line: { color: '#16a34a', width: 2.5 }, name: lifeT(B2('True mean (Census)', 'वास्तविक माध्य (जनगणना)')) },
                { x: [0.5, 5.5], y: [state.trueMedian, state.trueMedian], mode: 'lines', line: { color: '#7c3aed', width: 2, dash: 'dash' }, name: lifeT(B2('True median (Census)', 'वास्तविक माध्यिका (जनगणना)')) }
            );
        }
        return { traces, layout: { xaxis: { title: lifeT(B2('Survey number', 'सर्वेक्षण संख्या')), range: [0.5, 5.5], dtick: 1 }, yaxis: { title: lifeT(B2('Mean income (₹ thousand a month)', 'माध्य आय (₹ हज़ार प्रति माह)')), rangemode: 'tozero' } } };
    },
    debrief(history, state) {
        const rows = history.filter(r => !r.outcome.isCensus).map(r => r.outcome);
        const err = o => Math.abs(o.mean - state.trueMean), pct = o => 100 * err(o) / state.trueMean;
        // Scored on the three closest of the five surveys, so two can be spent
        // finding out what a bad method does. 100 − 2 × (% error), floored at 0.
        const top3 = rows.slice().sort((x, y) => pct(x) - pct(y)).slice(0, 3);
        const score = top3.reduce((s, o) => s + Math.max(0, 100 - 2 * pct(o)), 0) / top3.length;
        const avgErr = top3.reduce((s, o) => s + pct(o), 0) / top3.length;
        const rnd = rows.filter(o => o.method === 'random'), road = rows.filter(o => o.method === 'road');
        const closest = rnd.length ? rnd.reduce((a, b) => (err(b) < err(a) ? b : a)) : null;
        const goodSample = !!closest && pct(closest) <= 15;
        const worstRoad = road.length ? road.reduce((a, b) => (err(b) > err(a) ? b : a)) : null;
        const biased = !!worstRoad && !!closest && err(worstRoad) > err(closest);
        let sizePair = null;
        rnd.forEach(s => rnd.forEach(l => { if (l.n > s.n && err(l) < err(s) && !sizePair) sizePair = { s, l }; }));
        const census = history.find(r => r.outcome.isCensus);
        return {
            score,
            scoreLine: B2(`Your three closest estimates missed the Census mean of ${kRupee(state.trueMean)} by ${avgErr.toFixed(1)}% on average.`, `आपके तीन निकटतम अनुमान जनगणना के माध्य ${kRupee(state.trueMean)} से औसतन ${avgErr.toFixed(1)}% चूके।`),
            insights: [
                {
                    icon: '🎲', concept: B2('A sample can stand in for a census', 'प्रतिदर्श जनगणना का काम कर सकता है'), holds: goodSample,
                    evidence: goodSample ? B2(`Survey #${closest.round} asked only ${closest.n} of 200 households by lottery and said ${kRupee(closest.mean)}. The Census, after all 200, said ${kRupee(state.trueMean)} — a gap of just ${kRupee(err(closest))}.`, `सर्वेक्षण #${closest.round} ने लॉटरी से 200 में से केवल ${closest.n} परिवारों से पूछा और ${kRupee(closest.mean)} बताया। जनगणना ने सभी 200 के बाद ${kRupee(state.trueMean)} बताया — अंतर केवल ${kRupee(err(closest))}।`) : null,
                    tryThis: B2('Use the lottery draw with 40 households at least once.', 'कम से कम एक बार 40 परिवारों के साथ लॉटरी से चयन कीजिए।'),
                    exam: B2('Census method: every unit of the population is studied (e.g. Census of India) — accurate but costly and slow. Sample method: a representative part is studied (e.g. NSSO surveys) — quicker and cheaper.', 'जनगणना विधि: समष्टि की हर इकाई का अध्ययन (जैसे भारत की जनगणना) — सटीक पर महँगी और धीमी। प्रतिदर्श विधि: एक प्रतिनिधि भाग का अध्ययन (जैसे NSSO सर्वेक्षण) — तेज़ और सस्ती।')
                },
                {
                    icon: '🚌', concept: B2('A convenient sample is a biased sample', 'सुविधाजनक प्रतिदर्श पक्षपाती प्रतिदर्श है'), holds: biased,
                    evidence: biased ? B2(`Survey #${worstRoad.round} knocked on the nearest doors and said ${kRupee(worstRoad.mean)} — off by ${kRupee(err(worstRoad))}. Your lottery draw #${closest.round} was off by only ${kRupee(err(closest))}. Market Road is not the town: nobody from the Colony or the Basti had any chance of being asked.`, `सर्वेक्षण #${worstRoad.round} सबसे पास के दरवाज़ों पर गया और ${kRupee(worstRoad.mean)} बताया — ${kRupee(err(worstRoad))} की चूक। आपका लॉटरी चयन #${closest.round} केवल ${kRupee(err(closest))} चूका। बाज़ार रोड पूरा शहर नहीं है: कॉलोनी या बस्ती के किसी परिवार के पूछे जाने की कोई संभावना ही नहीं थी।`) : null,
                    tryThis: B2('Run one survey on Market Road and one by lottery, then compare them with the Census.', 'एक सर्वेक्षण बाज़ार रोड पर और एक लॉटरी से कीजिए, फिर दोनों की जनगणना से तुलना कीजिए।'),
                    exam: B2('Random sampling gives every unit an equal chance of selection, so the sample is representative. Non-random (convenience/judgement) sampling carries the investigator’s bias — a non-sampling error that a bigger sample does NOT cure.', 'यादृच्छिक प्रतिचयन में हर इकाई के चुने जाने की समान संभावना होती है, इसलिए प्रतिदर्श प्रतिनिधि होता है। अयादृच्छिक (सुविधा/निर्णय) प्रतिचयन में अन्वेषक का पक्षपात आ जाता है — यह अप्रतिचयन त्रुटि है जिसे बड़ा प्रतिदर्श भी ठीक नहीं करता।')
                },
                {
                    icon: '🔍', concept: B2('A bigger random sample usually lands closer', 'बड़ा यादृच्छिक प्रतिदर्श प्रायः अधिक निकट पहुँचता है'), holds: !!sizePair,
                    evidence: sizePair ? B2(`Your lottery draw of ${sizePair.s.n} missed by ${kRupee(err(sizePair.s))}; your draw of ${sizePair.l.n} missed by ${kRupee(err(sizePair.l))}. (This is a tendency, not a guarantee — a small sample can get lucky.)`, `${sizePair.s.n} के लॉटरी चयन की चूक ${kRupee(err(sizePair.s))} रही; ${sizePair.l.n} के चयन की ${kRupee(err(sizePair.l))}। (यह प्रवृत्ति है, गारंटी नहीं — छोटा प्रतिदर्श भी संयोग से सही पड़ सकता है।)`) : null,
                    tryThis: B2('Take a lottery sample of 10 and another of 40 and see which one the Census favours.', '10 का और फिर 40 का लॉटरी प्रतिदर्श लीजिए और देखिए जनगणना किसका साथ देती है।'),
                    exam: B2('Sampling error = estimate − true value. It falls as the size of a RANDOM sample grows; a census has none.', 'प्रतिचयन त्रुटि = अनुमान − वास्तविक मान। यादृच्छिक प्रतिदर्श का आकार बढ़ने पर यह घटती है; जनगणना में यह नहीं होती।')
                },
                {
                    icon: '⚖️', concept: B2('Mean and median tell different stories', 'माध्य और माध्यिका अलग कहानियाँ कहते हैं'), holds: !!census && census.outcome.mean > census.outcome.median,
                    evidence: census ? B2(`The Census mean is ${kRupee(census.outcome.mean)} but the median is only ${kRupee(census.outcome.median)}. A few high incomes on Market Road pull the mean up; half the town actually lives on less than ${kRupee(census.outcome.median)}.`, `जनगणना का माध्य ${kRupee(census.outcome.mean)} है पर माध्यिका केवल ${kRupee(census.outcome.median)}। बाज़ार रोड की कुछ ऊँची आयें माध्य को ऊपर खींचती हैं; आधा शहर वास्तव में ${kRupee(census.outcome.median)} से कम पर जीता है।`) : null,
                    tryThis: B2('Finish all six surveys so the Census can report both numbers.', 'सभी छह सर्वेक्षण पूरे कीजिए ताकि जनगणना दोनों संख्याएँ बता सके।'),
                    exam: B2('The arithmetic mean is affected by extreme values; the median (the middle value) is not. For a skewed distribution such as income, the median represents the typical household better.', 'समांतर माध्य चरम मानों से प्रभावित होता है; माध्यिका (मध्य मान) नहीं। आय जैसे विषम वितरण में माध्यिका सामान्य परिवार का बेहतर प्रतिनिधित्व करती है।')
                }
            ]
        };
    }
});
