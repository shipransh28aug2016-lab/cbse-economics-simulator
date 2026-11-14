// ══════════════════════════════════════════════════════════════
// js/life-worlds-macro.js — Living Worlds for Class XII
//   town-bank         Part A · Unit 2      (credit creation, LRR, RBI's instruments)
//   finance-minister  Part A · Units 3–4   (multiplier, deficient/excess demand, deficits)
// ══════════════════════════════════════════════════════════════
// Contract and honesty rules: top of js/life-engine.js.
// Worked references: docs/economics/models/living-worlds.md.

/* global LIFE_WORLDS, B2, rupee, lifeT, lifeSvg, lifeCrowd, LIFE_INK, LIFE_MUTE */

// ── 5. THE TOWN BANK ──────────────────────────────────────────────
// NCERT's own story of credit creation: one fresh deposit, a legal reserve
// ratio, every loan spent and redeposited in the banking system. Rounds 1–6
// you ARE the banking system; rounds 7–8 you are the RBI.
const BANK = {
    INITIAL: 10000, LRR: 0.2, LEND_ROUNDS: 6, ROUNDS: 8,
    LRR_OPTIONS: [0.1, 0.2, 0.25],
    legalMax(deposit, lrr) { return deposit * (1 - lrr); },
    multiplier(lrr) { return 1 / lrr; },
    limit(initial, lrr) { return initial / lrr; },          // total deposits the system can reach
    // Cumulative deposits after n rounds if every round lends the legal maximum.
    maxPath(initial, lrr, n) { let d = initial, total = 0; for (let i = 0; i < n; i++) { total += d; d = BANK.legalMax(d, lrr); } return total; },
    situation(round) { return round === 7 ? 'inflation' : (round === 8 ? 'slowdown' : null); },
    // Is this move the right DIRECTION for the situation? (+1 tightens, −1 loosens)
    correctDir(situation) { return situation === 'inflation' ? 1 : -1; }
};

LIFE_WORLDS.push({
    id: 'town-bank', icon: '🏦', accent: '#0e7490', minutes: 6,
    title: B2('The Town Bank', 'शहर का बैंक'),
    role: B2('the town’s banker — then the RBI Governor', 'शहर के बैंकर — फिर RBI गवर्नर'),
    tagline: B2('₹10,000 walks in. Watch how much money it becomes — and who decides the limit.', '₹10,000 बैंक में आते हैं। देखिए वे कितना मुद्रा बन जाते हैं — और सीमा कौन तय करता है।'),
    class: 'XII', part: 'A', unit: 2, unitTitle: 'Money and Banking',
    syllabusIds: ['XII-A-U2-CREATION', 'XII-A-U2-CREDIT-CONTROL'],
    labs: ['macro-money-creation'],
    rounds: BANK.ROUNDS, roundWord: B2('Round', 'चक्र'),
    goLabel: B2('Confirm ▶', 'पक्का करें ▶'),
    brief: B2(
        `<p>You run the only bank in town. A farmer has just sold her crop and deposited <b>₹10,000</b> in cash.</p>
         <p>The RBI's rule: keep at least <b>20%</b> of every deposit as reserves. The rest you may <b>lend</b>. Whatever you lend gets spent in town — and the shopkeepers put it straight back in your bank as a <b>new deposit</b>.</p>
         <p>For six rounds, decide how much of each new deposit to lend. Then you will be handed a bigger chair.</p>`,
        `<p>आप शहर का इकलौता बैंक चलाते हैं। एक किसान ने अभी फ़सल बेचकर <b>₹10,000</b> नक़द जमा किए हैं।</p>
         <p>RBI का नियम: हर जमा का कम से कम <b>20%</b> आरक्षित रखिए। बाक़ी आप <b>उधार</b> दे सकते हैं। जो उधार देते हैं वह शहर में ख़र्च होता है — और दुकानदार उसे सीधे आपके बैंक में <b>नई जमा</b> के रूप में वापस रख देते हैं।</p>
         <p>छह चक्रों तक तय कीजिए कि हर नई जमा का कितना उधार देना है। फिर आपको एक बड़ी कुर्सी मिलेगी।</p>`),
    truth: BANK,
    init() { return { lrr: BANK.LRR, deposit: BANK.INITIAL, totalDeposits: 0, totalLoans: 0, totalReserves: 0, strikes: 0 }; },
    news(state, round) {
        if (round === 1) return B2(`A fresh deposit of ${rupee(BANK.INITIAL)} is on your counter.`, `${rupee(BANK.INITIAL)} की नई जमा आपके काउंटर पर है।`);
        if (round <= BANK.LEND_ROUNDS) {
            return state.deposit > 0
                ? B2(`Last round's loans were spent in town and have come back: a new deposit of ${rupee(state.deposit)}.`, `पिछले चक्र के ऋण शहर में ख़र्च हुए और लौट आए: ${rupee(state.deposit)} की नई जमा।`)
                : B2('No loans went out last round — so nothing came back. The counter is empty.', 'पिछले चक्र में कोई ऋण नहीं गया — इसलिए कुछ लौटा नहीं। काउंटर ख़ाली है।');
        }
        if (round === 7) return B2('🏛️ You are now the RBI Governor. Prices are rising month after month: too much money is chasing too few goods.', '🏛️ अब आप RBI गवर्नर हैं। कीमतें हर महीने बढ़ रही हैं: बहुत अधिक मुद्रा बहुत कम वस्तुओं के पीछे दौड़ रही है।');
        return B2('🏛️ A year later, the ratio is back at 20% — and the opposite trouble: shops are empty, factories idle, loans hard to get.', '🏛️ एक साल बाद, अनुपात फिर 20% पर है — और उल्टी मुसीबत: दुकानें ख़ाली, कारख़ाने बंद, ऋण मिलना कठिन।');
    },
    decisions(state, round) {
        if (round <= BANK.LEND_ROUNDS) {
            return [{ id: 'pct', label: B2("Share of this round's new deposit you lend out", 'इस चक्र की नई जमा का वह भाग जो आप उधार देंगे'), min: 0, max: 100, step: 5, value: 50, unit: '%' }];
        }
        return [
            {
                id: 'lrr', type: 'choice', label: B2('Reserve ratio banks must keep (CRR + SLR)', 'बैंकों के लिए अनिवार्य आरक्षित अनुपात (CRR + SLR)'), value: '0.2', carry: false,
                options: BANK.LRR_OPTIONS.map(v => ({ value: String(v), label: B2(`${v * 100}%${v === BANK.LRR ? ' (no change)' : ''}`, `${v * 100}%${v === BANK.LRR ? ' (कोई बदलाव नहीं)' : ''}`) }))
            },
            {
                id: 'repo', type: 'choice', label: B2('Repo rate (what banks pay to borrow from the RBI)', 'रेपो दर (RBI से उधार लेने पर बैंक जो चुकाते हैं)'), value: 'hold',
                options: [{ value: 'cut', label: B2('Cut it', 'घटाएँ') }, { value: 'hold', label: B2('Hold', 'यथावत') }, { value: 'raise', label: B2('Raise it', 'बढ़ाएँ') }]
            }
        ];
    },
    live(state, d, round) {
        if (round > BANK.LEND_ROUNDS) return null;
        const lent = state.deposit * d.pct / 100, kept = state.deposit - lent, need = state.deposit * state.lrr;
        const short = kept < need - 1e-9;
        return {
            ok: true,
            text: B2(`You lend ${rupee(lent, 0)} and keep ${rupee(kept, 0)} in reserve (${100 - d.pct}%).${short ? ' ⚠️ That is below the 20% the RBI requires.' : ''}`, `आप ${rupee(lent, 0)} उधार देते हैं और ${rupee(kept, 0)} आरक्षित रखते हैं (${100 - d.pct}%)।${short ? ' ⚠️ यह RBI के अनिवार्य 20% से कम है।' : ''}`)
        };
    },
    predict(state, round) {
        if (round !== 1) return null;
        const opts = [BANK.INITIAL, BANK.INITIAL * 1.8, BANK.limit(BANK.INITIAL, BANK.LRR), null];
        return {
            prompt: B2(`If you always lend as much as the law allows, the town's total deposits will eventually head toward…`, `यदि आप हमेशा क़ानून की अनुमति भर उधार दें, तो शहर की कुल जमा अंततः किस ओर जाएगी…`),
            options: opts.map(v => (v === null ? B2('No limit at all', 'कोई सीमा नहीं') : B2(rupee(v), rupee(v)))),
            answer: o => opts.indexOf(o.limit)
        };
    },
    step(state, d, round) {
        if (round <= BANK.LEND_ROUNDS) {
            const deposit = state.deposit, legalMax = BANK.legalMax(deposit, state.lrr);
            const asked = deposit * d.pct / 100, violation = asked > legalMax + 1e-9;
            const lent = violation ? legalMax : asked, kept = deposit - lent;
            if (violation) state.strikes++;
            state.totalDeposits += deposit; state.totalLoans += lent; state.totalReserves += kept;
            state.deposit = lent; // every rupee lent is spent and redeposited
            return {
                round, phase: 'bank', deposit, asked, lent, kept, legalMax, violation, lrr: state.lrr,
                totalDeposits: state.totalDeposits, totalLoans: state.totalLoans, totalReserves: state.totalReserves,
                limit: BANK.limit(BANK.INITIAL, state.lrr), pathMax: BANK.maxPath(BANK.INITIAL, state.lrr, round), nextDeposit: lent
            };
        }
        const situation = BANK.situation(round), lrr = Number(d.lrr), want = BANK.correctDir(situation);
        const lrrDir = lrr > BANK.LRR ? 1 : (lrr < BANK.LRR ? -1 : 0);
        const repoDir = d.repo === 'raise' ? 1 : (d.repo === 'cut' ? -1 : 0);
        return {
            round, phase: 'rbi', situation, lrr, lrrDir, repoDir, want,
            multiplierBefore: BANK.multiplier(BANK.LRR), multiplier: BANK.multiplier(lrr),
            limitBefore: BANK.limit(BANK.INITIAL, BANK.LRR), limit: BANK.limit(BANK.INITIAL, lrr),
            lrrRight: lrrDir === want, repoRight: repoDir === want,
            marks: (lrrDir === want ? 1 : 0) + (repoDir === want ? 1 : 0)
        };
    },
    scene(state, o, round, history) {
        const bankRows = history.filter(r => r.outcome.phase === 'bank').map(r => r.outcome);
        if (round <= BANK.LEND_ROUNDS) {
            const limit = BANK.limit(BANK.INITIAL, BANK.LRR), H = 132, base = 196, w = 44;
            const bars = bankRows.map((b, i) => {
                const x = 34 + i * 62, hl = H * b.lent / BANK.INITIAL, hk = H * b.kept / BANK.INITIAL;
                return `<g class="${i === bankRows.length - 1 && o ? 'life-pop' : ''}">
                    <rect x="${x}" y="${base - hk}" width="${w}" height="${hk}" fill="#eab308"></rect>
                    <rect x="${x}" y="${base - hk - hl}" width="${w}" height="${hl}" fill="#16a34a"></rect>
                    <text x="${x + w / 2}" y="${base - hk - hl - 5}" text-anchor="middle" font-size="9.5" font-weight="700" fill="${LIFE_INK}">${rupee(b.deposit, 0)}</text>
                    <text x="${x + w / 2}" y="${base + 13}" text-anchor="middle" font-size="9.5" fill="${LIFE_MUTE}">${b.round}</text></g>`;
            }).join('');
            const total = bankRows.length ? bankRows[bankRows.length - 1].totalDeposits : 0;
            const tw = 96 * Math.min(1, total / limit);
            return lifeSvg(lifeT(B2('Each bar is one round’s new deposit, split into loans and reserves', 'हर स्तंभ एक चक्र की नई जमा है, ऋण और आरक्षित में बँटी हुई')), `
                <rect x="0" y="0" width="520" height="240" rx="14" fill="#ecfeff"></rect>
                <text x="22" y="28" font-size="13" font-weight="700" fill="${LIFE_INK}">🏦 ${lifeT(B2('New deposit arriving each round', 'हर चक्र में आने वाली नई जमा'))}</text>
                ${bars}
                <line x1="24" y1="${base}" x2="400" y2="${base}" stroke="#94a3b8" stroke-width="1.5"></line>
                <g font-size="10" fill="${LIFE_INK}"><rect x="24" y="218" width="10" height="10" fill="#16a34a"></rect><text x="38" y="227">${lifeT(B2('lent out', 'उधार दिया'))}</text>
                   <rect x="110" y="218" width="10" height="10" fill="#eab308"></rect><text x="124" y="227">${lifeT(B2('kept in reserve', 'आरक्षित रखा'))}</text></g>
                <g transform="translate(410,56)">
                    <text x="48" y="0" text-anchor="middle" font-size="10.5" font-weight="700" fill="${LIFE_INK}">${lifeT(B2('Total deposits', 'कुल जमा'))}</text>
                    <rect x="0" y="12" width="96" height="16" rx="8" fill="#cffafe"></rect>
                    <rect x="0" y="12" width="${tw}" height="16" rx="8" fill="#0e7490"></rect>
                    <text x="48" y="48" text-anchor="middle" font-size="15" font-weight="800" fill="#0e7490">${rupee(total, 0)}</text>
                    ${o && o.violation ? `<text x="48" y="78" text-anchor="middle" font-size="22">🚨</text>` : ''}
                </g>`);
        }
        const before = BANK.limit(BANK.INITIAL, BANK.LRR), after = o ? o.limit : before, top = BANK.limit(BANK.INITIAL, Math.min.apply(null, BANK.LRR_OPTIONS));
        const bar = (x, v, color, label) => `<rect x="${x}" y="${200 - 140 * v / top}" width="90" height="${140 * v / top}" rx="6" fill="${color}"></rect>
            <text x="${x + 45}" y="${192 - 140 * v / top}" text-anchor="middle" font-size="12" font-weight="800" fill="${LIFE_INK}">${rupee(v, 0)}</text>
            <text x="${x + 45}" y="218" text-anchor="middle" font-size="10.5" fill="${LIFE_MUTE}">${label}</text>`;
        const sit = BANK.situation(round);
        return lifeSvg(lifeT(B2('The most deposits the same ₹10,000 can become, before and after your decision', 'वही ₹10,000 अधिकतम कितनी जमा बन सकते हैं — आपके निर्णय से पहले और बाद')), `
            <rect x="0" y="0" width="520" height="240" rx="14" fill="${sit === 'inflation' ? '#fef2f2' : '#eff6ff'}"></rect>
            <text x="22" y="28" font-size="13" font-weight="700" fill="${LIFE_INK}">${sit === 'inflation' ? '🔥' : '🥶'} ${lifeT(sit === 'inflation' ? B2('Prices rising — excess demand', 'कीमतें बढ़ रही हैं — अधिमांग') : B2('Economy slowing — deficient demand', 'अर्थव्यवस्था धीमी — न्यून मांग'))}</text>
            <text x="22" y="46" font-size="10.5" fill="${LIFE_MUTE}">${lifeT(B2(`The most that ${rupee(BANK.INITIAL)} of fresh deposits can become`, `${rupee(BANK.INITIAL)} की नई जमा अधिकतम कितनी बन सकती है`))}</text>
            ${bar(120, before, '#94a3b8', lifeT(B2('at 20%', '20% पर')))}
            ${o ? bar(300, after, o.lrrRight ? '#16a34a' : (o.lrrDir === 0 ? '#94a3b8' : '#dc2626'), lifeT(B2(`at ${o.lrr * 100}%`, `${o.lrr * 100}% पर`))) : `<text x="345" y="140" text-anchor="middle" font-size="34">❓</text>`}`);
    },
    stats(o) {
        if (o.phase === 'bank') {
            return [
                { label: B2('New deposit', 'नई जमा'), value: rupee(o.deposit, 0) },
                { label: B2('Lent out', 'उधार दिया'), value: rupee(o.lent, 0) },
                { label: B2('Kept in reserve', 'आरक्षित रखा'), value: rupee(o.kept, 0), tone: o.violation ? 'bad' : undefined },
                { label: B2('Total deposits so far', 'अब तक कुल जमा'), value: rupee(o.totalDeposits, 0), tone: 'good' }
            ];
        }
        return [
            { label: B2('Reserve ratio', 'आरक्षित अनुपात'), value: `${o.lrr * 100}%` },
            { label: B2('Money multiplier', 'मुद्रा गुणक'), value: `${o.multiplierBefore} → ${o.multiplier}` },
            { label: B2('Deposits ₹10,000 can become', '₹10,000 से बनने वाली जमा'), value: rupee(o.limit, 0), tone: o.lrrRight ? 'good' : (o.lrrDir === 0 ? undefined : 'bad') }
        ];
    },
    ledger: [
        { key: 'r', label: '#', get: r => String(r.round) },
        { key: 'dep', label: B2('New deposit', 'नई जमा'), get: r => (r.outcome.phase === 'bank' ? rupee(r.outcome.deposit, 0) : lifeT(B2('RBI', 'RBI'))) },
        { key: 'lent', label: B2('Lent', 'उधार'), get: r => (r.outcome.phase === 'bank' ? rupee(r.outcome.lent, 0) : `${r.outcome.lrr * 100}%`) },
        { key: 'tot', label: B2('Total deposits', 'कुल जमा'), get: r => (r.outcome.phase === 'bank' ? rupee(r.outcome.totalDeposits, 0) : `×${r.outcome.multiplier}`) }
    ],
    narrate(o) {
        if (o.phase === 'bank') {
            if (o.deposit === 0) return B2('Nothing was deposited, so there was nothing to lend. Credit creation in this town has stopped.', 'कुछ जमा नहीं हुआ, इसलिए उधार देने को कुछ नहीं था। इस शहर में साख सृजन रुक गया है।');
            const law = o.violation
                ? B2(`🚨 The RBI inspector stopped you: you tried to lend ${rupee(o.asked, 0)}, but only ${rupee(o.legalMax, 0)} is legal. `, `🚨 RBI निरीक्षक ने आपको रोका: आपने ${rupee(o.asked, 0)} उधार देने की कोशिश की, पर केवल ${rupee(o.legalMax, 0)} वैध है। `)
                : B2('', '');
            return B2(`${law.en}Of the ${rupee(o.deposit, 0)} deposited you lent <b>${rupee(o.lent, 0)}</b> and kept ${rupee(o.kept, 0)}. The borrowers spent it in town, and it is coming back to you as a new deposit of ${rupee(o.nextDeposit, 0)}. Deposits in your books now total <b>${rupee(o.totalDeposits, 0)}</b> — yet only ${rupee(BANK.INITIAL)} of cash ever entered the bank.`, `${law.hi}जमा हुए ${rupee(o.deposit, 0)} में से आपने <b>${rupee(o.lent, 0)}</b> उधार दिए और ${rupee(o.kept, 0)} रखे। उधार लेने वालों ने इसे शहर में ख़र्च किया, और यह ${rupee(o.nextDeposit, 0)} की नई जमा बनकर आपके पास लौट रहा है। आपके खातों में कुल जमा अब <b>${rupee(o.totalDeposits, 0)}</b> है — जबकि बैंक में नक़द केवल ${rupee(BANK.INITIAL)} ही आया था।`);
        }
        const dirWord = o.lrrDir > 0 ? B2('raised', 'बढ़ाया') : (o.lrrDir < 0 ? B2('cut', 'घटाया') : B2('left', 'यथावत रखा'));
        const effect = o.lrrDir === 0
            ? B2(`Banks can still turn ${rupee(BANK.INITIAL)} into ${rupee(o.limit, 0)}.`, `बैंक अब भी ${rupee(BANK.INITIAL)} को ${rupee(o.limit, 0)} बना सकते हैं।`)
            : B2(`The multiplier moved from ${o.multiplierBefore} to ${o.multiplier}: the same ${rupee(BANK.INITIAL)} can now become ${rupee(o.limit, 0)} instead of ${rupee(o.limitBefore, 0)}.`, `गुणक ${o.multiplierBefore} से ${o.multiplier} हो गया: वही ${rupee(BANK.INITIAL)} अब ${rupee(o.limitBefore, 0)} की जगह ${rupee(o.limit, 0)} बन सकते हैं।`);
        const repo = o.repoDir > 0 ? B2('You raised the repo rate: banks pay more to borrow from the RBI, so they charge more and lend less.', 'आपने रेपो दर बढ़ाई: बैंकों को RBI से उधार महँगा पड़ता है, इसलिए वे ब्याज बढ़ाते और कम उधार देते हैं।')
            : (o.repoDir < 0 ? B2('You cut the repo rate: banks borrow from the RBI more cheaply, so they charge less and lend more.', 'आपने रेपो दर घटाई: बैंकों को RBI से उधार सस्ता पड़ता है, इसलिए वे ब्याज घटाते और अधिक उधार देते हैं।')
                : B2('You held the repo rate, so the cost of borrowing did not change.', 'आपने रेपो दर यथावत रखी, इसलिए उधार की लागत नहीं बदली।'));
        const need = o.situation === 'inflation' ? B2('With prices rising, the economy needed LESS credit.', 'कीमतें बढ़ रही हैं, तो अर्थव्यवस्था को कम साख चाहिए थी।') : B2('With demand weak, the economy needed MORE credit.', 'मांग कमज़ोर है, तो अर्थव्यवस्था को अधिक साख चाहिए थी।');
        const verdict = o.marks === 2 ? B2('Both of your moves pushed the right way.', 'आपके दोनों क़दम सही दिशा में थे।') : (o.marks === 1 ? B2('One of your two moves pushed the right way.', 'आपके दो में से एक क़दम सही दिशा में था।') : B2('Neither move pushed the right way.', 'कोई भी क़दम सही दिशा में नहीं था।'));
        return B2(`You ${dirWord.en} the reserve ratio at ${o.lrr * 100}%. ${effect.en} ${repo.en} ${need.en} <b>${verdict.en}</b>`, `आपने आरक्षित अनुपात ${o.lrr * 100}% पर ${dirWord.hi}। ${effect.hi} ${repo.hi} ${need.hi} <b>${verdict.hi}</b>`);
    },
    nudge(history, state, round) {
        if (round > BANK.LEND_ROUNDS || !history.length) return null;
        const o = history[history.length - 1].outcome;
        if (o.violation) return B2('The inspector will catch that every time. How much of a deposit does the 20% rule actually leave you free to lend?', 'निरीक्षक हर बार पकड़ लेगा। 20% का नियम जमा का वास्तव में कितना भाग उधार के लिए छोड़ता है?');
        if (o.nextDeposit === 0) return B2('Nothing went out, so nothing can come back: the remaining lending rounds will stay empty. That silence is what a bank that will not lend does to a town.', 'कुछ बाहर नहीं गया, इसलिए कुछ लौट नहीं सकता: उधार के शेष चक्र ख़ाली रहेंगे। जो बैंक उधार नहीं देता, वह शहर के साथ यही करता है।');
        if (o.deposit > 0 && o.lent < 0.95 * o.legalMax) return B2(`You could legally have lent ${rupee(o.legalMax, 0)}. The ${rupee(o.legalMax - o.lent, 0)} you held back is sitting idle — and it will not come back as anyone's deposit.`, `आप क़ानूनन ${rupee(o.legalMax, 0)} उधार दे सकते थे। जो ${rupee(o.legalMax - o.lent, 0)} आपने रोके, वे बेकार पड़े हैं — और किसी की जमा बनकर नहीं लौटेंगे।`);
        if (history.length >= 3) return B2('Look down the "New deposit" column. What is each number as a fraction of the one above it?', '"नई जमा" कॉलम को ऊपर से नीचे देखिए। हर संख्या अपने ऊपर वाली का कितना भाग है?');
        return null;
    },
    chart(history, reveal) {
        const rows = history.filter(r => r.outcome.phase === 'bank').map(r => r.outcome);
        if (!rows.length) return null;
        const traces = [{ x: rows.map(o => o.round), y: rows.map(o => o.totalDeposits), mode: 'lines+markers', line: { color: '#0e7490', width: 3 }, marker: { size: 9 }, name: lifeT(B2('Total deposits — your bank', 'कुल जमा — आपका बैंक')) }];
        if (reveal) {
            const xs = []; const ys = [];
            for (let n = 1; n <= 16; n++) { xs.push(n); ys.push(BANK.maxPath(BANK.INITIAL, BANK.LRR, n)); }
            traces.unshift(
                { x: xs, y: ys, mode: 'lines', line: { color: '#16a34a', width: 2, dash: 'dash' }, name: lifeT(B2('If every round lends the legal maximum', 'यदि हर चक्र में वैध अधिकतम उधार दिया जाए')) },
                { x: [1, 16], y: [BANK.limit(BANK.INITIAL, BANK.LRR), BANK.limit(BANK.INITIAL, BANK.LRR)], mode: 'lines', line: { color: '#dc2626', width: 2, dash: 'dot' }, name: lifeT(B2('Limit = ₹10,000 × 1/LRR = ₹50,000', 'सीमा = ₹10,000 × 1/LRR = ₹50,000')) }
            );
        }
        return { traces, layout: { xaxis: { title: lifeT(B2('Round', 'चक्र')), range: [0.5, reveal ? 16.5 : 6.5], dtick: reveal ? 2 : 1 }, yaxis: { title: lifeT(B2('Total deposits (₹)', 'कुल जमा (₹)')), range: [0, 54000] } } };
    },
    debrief(history, state) {
        const rows = history.filter(r => r.outcome.phase === 'bank').map(r => r.outcome);
        const rbi = history.filter(r => r.outcome.phase === 'rbi').map(r => r.outcome);
        const last = rows[rows.length - 1], pathMax = BANK.maxPath(BANK.INITIAL, BANK.LRR, BANK.LEND_ROUNDS);
        const lendScore = Math.max(0, 100 * last.totalDeposits / pathMax - 5 * state.strikes);
        const rbiScore = 100 * rbi.reduce((s, o) => s + o.marks, 0) / (2 * rbi.length);
        const score = Math.max(0, Math.min(100, 0.7 * lendScore + 0.3 * rbiScore));
        const full = rows.filter(o => o.deposit > 0 && Math.abs(o.lent - o.legalMax) < 1e-6);
        const idle = rows.find(o => o.deposit > 0 && !o.violation && o.lent < 0.95 * o.legalMax);
        const infl = rbi.find(o => o.situation === 'inflation'), slow = rbi.find(o => o.situation === 'slowdown');
        const chain = rows.filter(o => o.deposit > 0).map(o => rupee(o.deposit, 0)).join(' → ');
        const exemplar = [1, 2, 3, 4].map(n => rupee(BANK.INITIAL * Math.pow(1 - BANK.LRR, n - 1), 0)).join(' → ');
        return {
            score,
            scoreLine: B2(`Your bank turned ${rupee(BANK.INITIAL)} of cash into ${rupee(last.totalDeposits, 0)} of deposits in six rounds (the most possible: ${rupee(pathMax, 0)}), and got ${rbi.reduce((s, o) => s + o.marks, 0)} of 4 RBI moves right.`, `आपके बैंक ने छह चक्रों में ${rupee(BANK.INITIAL)} नक़द को ${rupee(last.totalDeposits, 0)} की जमा में बदला (अधिकतम संभव: ${rupee(pathMax, 0)}), और RBI के 4 में से ${rbi.reduce((s, o) => s + o.marks, 0)} क़दम सही रहे।`),
            insights: [
                {
                    icon: '🪄', concept: B2('Banks create money (credit creation)', 'बैंक मुद्रा का सृजन करते हैं (साख सृजन)'), holds: last.totalDeposits >= 2 * BANK.INITIAL,
                    evidence: B2(`Only ${rupee(BANK.INITIAL)} of cash ever came in, yet your books show ${rupee(last.totalDeposits, 0)} of deposits: ${chain}. Every loan became someone else's deposit.`, `नक़द केवल ${rupee(BANK.INITIAL)} आया, फिर भी आपके खातों में ${rupee(last.totalDeposits, 0)} की जमा है: ${chain}। हर ऋण किसी और की जमा बन गया।`),
                    tryThis: B2('Lend as much as the rule allows in every round and watch the total.', 'हर चक्र में नियम की अनुमति भर उधार दीजिए और कुल जमा देखिए।'),
                    exam: B2('Commercial banks create credit by lending out deposits in excess of the reserves they must keep; loans return as fresh (derivative) deposits. Assumption: all transactions pass through banks.', 'व्यावसायिक बैंक अनिवार्य आरक्षित से ऊपर की जमा उधार देकर साख सृजन करते हैं; ऋण नई (व्युत्पन्न) जमा के रूप में लौटते हैं। मान्यता: सभी लेन-देन बैंकों के माध्यम से होते हैं।')
                },
                {
                    icon: '✖️', concept: B2('Money multiplier = 1 / LRR', 'मुद्रा गुणक = 1 / LRR'), holds: full.length >= 4,
                    evidence: B2(`You lent the legal maximum in ${full.length} of 6 rounds, so each new deposit was 80% of the one before (${exemplar} …). Such a series adds up toward ${rupee(BANK.INITIAL)} × 1/0.2 = ${rupee(BANK.limit(BANK.INITIAL, BANK.LRR))} and never beyond it.`, `आपने 6 में से ${full.length} चक्रों में वैध अधिकतम उधार दिया, इसलिए हर नई जमा पिछली की 80% रही (${exemplar} …)। ऐसी श्रेणी का योग ${rupee(BANK.INITIAL)} × 1/0.2 = ${rupee(BANK.limit(BANK.INITIAL, BANK.LRR))} की ओर बढ़ता है और उससे आगे कभी नहीं जाता।`),
                    tryThis: B2('Lend exactly 80% for at least four rounds and read the "New deposit" column.', 'कम से कम चार चक्रों तक ठीक 80% उधार दीजिए और "नई जमा" कॉलम पढ़िए।'),
                    exam: B2('Total deposits = Initial deposit × 1/LRR. With LRR = 20%, the multiplier is 5: ₹10,000 → ₹50,000 of deposits, of which ₹40,000 is credit created.', 'कुल जमा = प्रारंभिक जमा × 1/LRR। LRR = 20% हो तो गुणक 5 है: ₹10,000 → ₹50,000 की जमा, जिसमें ₹40,000 सृजित साख है।')
                },
                {
                    icon: '💤', concept: B2('Idle reserves create nothing', 'निष्क्रिय आरक्षित कुछ नहीं रचते'), holds: !!idle,
                    evidence: idle ? B2(`In round ${idle.round} you could have lent ${rupee(idle.legalMax, 0)} but lent ${rupee(idle.lent, 0)}. So the next deposit was ${rupee(idle.lent, 0)}, not ${rupee(idle.legalMax, 0)} — and every later round was smaller for it. You finished ${rupee(pathMax - last.totalDeposits, 0)} below what was possible.`, `चक्र ${idle.round} में आप ${rupee(idle.legalMax, 0)} उधार दे सकते थे पर ${rupee(idle.lent, 0)} दिए। इसलिए अगली जमा ${rupee(idle.legalMax, 0)} नहीं, ${rupee(idle.lent, 0)} रही — और बाद का हर चक्र उसी कारण छोटा रहा। आप संभव स्तर से ${rupee(pathMax - last.totalDeposits, 0)} नीचे रहे।`) : null,
                    tryThis: B2('In one round, lend only half of what you could, then follow what happens to every later deposit.', 'किसी एक चक्र में संभव राशि का केवल आधा उधार दीजिए, फिर देखिए बाद की हर जमा का क्या होता है।'),
                    exam: B2('The multiplier formula gives the MAXIMUM. Actual credit is smaller if banks hold excess reserves or the public keeps cash outside banks.', 'गुणक सूत्र अधिकतम सीमा बताता है। यदि बैंक अतिरिक्त आरक्षित रखें या जनता नक़दी बैंकों से बाहर रखे, तो वास्तविक साख कम होती है।')
                },
                {
                    icon: '🔥', concept: B2('Fighting inflation: raise CRR / repo', 'मुद्रास्फीति से लड़ाई: CRR / रेपो बढ़ाएँ'), holds: !!infl && infl.marks === 2,
                    evidence: infl ? B2(`With prices rising you set the reserve ratio at ${infl.lrr * 100}%, taking the multiplier from ${infl.multiplierBefore} to ${infl.multiplier}, and you made borrowing from the RBI dearer. Less credit, less spending, less pressure on prices.`, `कीमतें बढ़ते समय आपने आरक्षित अनुपात ${infl.lrr * 100}% किया, जिससे गुणक ${infl.multiplierBefore} से ${infl.multiplier} हुआ, और RBI से उधार महँगा किया। कम साख, कम व्यय, कीमतों पर कम दबाव।`) : null,
                    tryThis: B2('When too much money chases too few goods, which way should BOTH instruments move?', 'जब बहुत अधिक मुद्रा बहुत कम वस्तुओं के पीछे हो, तो दोनों उपकरण किस दिशा में चलने चाहिए?'),
                    exam: B2('Excess demand ⇒ contractionary monetary policy: raise Bank Rate, Repo Rate, CRR, SLR and margin requirement; SELL securities in the open market.', 'अधिमांग ⇒ संकुचनकारी मौद्रिक नीति: बैंक दर, रेपो दर, CRR, SLR और मार्जिन आवश्यकता बढ़ाएँ; खुले बाज़ार में प्रतिभूतियाँ बेचें।')
                },
                {
                    icon: '🥶', concept: B2('Fighting a slowdown: cut CRR / repo', 'मंदी से लड़ाई: CRR / रेपो घटाएँ'), holds: !!slow && slow.marks === 2,
                    evidence: slow ? B2(`With demand weak you set the reserve ratio at ${slow.lrr * 100}%, taking the multiplier from ${slow.multiplierBefore} to ${slow.multiplier}, and you made borrowing from the RBI cheaper. More credit, more spending.`, `मांग कमज़ोर होने पर आपने आरक्षित अनुपात ${slow.lrr * 100}% किया, जिससे गुणक ${slow.multiplierBefore} से ${slow.multiplier} हुआ, और RBI से उधार सस्ता किया। अधिक साख, अधिक व्यय।`) : null,
                    tryThis: B2('When shops are empty and loans are scarce, which way should BOTH instruments move?', 'जब दुकानें ख़ाली हों और ऋण दुर्लभ, तो दोनों उपकरण किस दिशा में चलने चाहिए?'),
                    exam: B2('Deficient demand ⇒ expansionary monetary policy: cut Bank Rate, Repo Rate, CRR, SLR and margin requirement; BUY securities in the open market.', 'न्यून मांग ⇒ विस्तारकारी मौद्रिक नीति: बैंक दर, रेपो दर, CRR, SLR और मार्जिन आवश्यकता घटाएँ; खुले बाज़ार में प्रतिभूतियाँ ख़रीदें।')
                }
            ]
        };
    }
});

// ── 6. THE FINANCE MINISTER ───────────────────────────────────────
// The Keynesian cross with a lump-sum tax:
//   C = a + b(Y − T)      AD = C + I + G      equilibrium: Y = AD
//   ⇒ Y* = (a − bT + I + G) / (1 − b)
// Output cannot exceed full-employment income Yf; AD beyond it only raises
// prices. All figures in ₹ thousand crore.
const FM = {
    A: 100, B: 0.8, YF: 2000, G0: 300, T0: 250, DEBT0: 1000, RATE: 0.05,
    I_BY_YEAR: [160, 150, 200, 250, 230], I_NORMAL: 200,
    G_MIN: 200, G_MAX: 420, T_MIN: 150, T_MAX: 350,
    invest(year) { return FM.I_BY_YEAR[year - 1]; },
    ad(y, g, t, i) { return FM.A + FM.B * (y - t) + i + g; },
    yEq(g, t, i) { return (FM.A - FM.B * t + i + g) / (1 - FM.B); },
    kG() { return 1 / (1 - FM.B); },              // investment / government-spending multiplier
    kT() { return -FM.B / (1 - FM.B); },          // lump-sum tax multiplier
    // Everything that follows from one year's (G, T) given investment and opening debt.
    year(g, t, i, debt) {
        const yEq = FM.yEq(g, t, i), adF = FM.ad(FM.YF, g, t, i);
        const gapType = Math.abs(yEq - FM.YF) < 1e-6 ? 'none' : (yEq < FM.YF ? 'deficient' : 'excess');
        const interest = FM.RATE * debt, primary = g - t, fiscal = primary + interest;
        return {
            yEq, output: Math.min(yEq, FM.YF), adAtYf: adF, gap: Math.abs(adF - FM.YF), gapType,
            gapPct: 100 * Math.abs(yEq - FM.YF) / FM.YF,
            idlePct: gapType === 'deficient' ? 100 * (1 - yEq / FM.YF) : 0, // illustrative: jobs proportional to output
            interest, primary, fiscal, debtEnd: debt + fiscal
        };
    }
};
const crore = (v, d) => rupee(Math.round(v * 100) / 100, d);

LIFE_WORLDS.push({
    id: 'finance-minister', icon: '🏛️', accent: '#047857', minutes: 7,
    title: B2('The Finance Minister', 'वित्त मंत्री'),
    role: B2('the Finance Minister, five Budgets in a row', 'वित्त मंत्री — लगातार पाँच बजट'),
    tagline: B2('Investment slumps, then booms. You hold two levers: what the government spends and what it taxes.', 'निवेश गिरता है, फिर उछलता है। आपके हाथ में दो लीवर हैं: सरकार का व्यय और कर।'),
    class: 'XII', part: 'A', unit: 3, unitTitle: 'Determination of Income and Employment',
    syllabusIds: ['XII-A-U3-MULTIPLIER', 'XII-A-U3-EMPLOYMENT', 'XII-A-U3-GAPS', 'XII-A-U4-DEFICITS'],
    labs: ['macro-inflation-gap', 'macro-multiplier', 'macro-govt-budget', 'gl-ad-as-equilibrium'],
    rounds: 5, roundWord: B2('Year', 'वर्ष'),
    goLabel: B2('Present the Budget ▶', 'बजट पेश करें ▶'),
    brief: B2(
        `<p>The economy can produce <b>₹2,000</b> (thousand crore) a year when everyone who wants work has it. Last year it did exactly that.</p>
         <p>Households spend <b>80 paise</b> of every extra rupee they are left with. You decide two numbers each year: <b>government spending (G)</b> and <b>taxes (T)</b>.</p>
         <p>Businesses will invest less in some years and more in others. Keep the country at full employment — without prices running away, and watch what it does to your borrowing.</p>`,
        `<p>जब काम चाहने वाले हर व्यक्ति को काम मिला हो, अर्थव्यवस्था साल में <b>₹2,000</b> (हज़ार करोड़) का उत्पादन कर सकती है। पिछले साल ठीक इतना ही हुआ।</p>
         <p>परिवार अपने पास बचे हर अतिरिक्त रुपये में से <b>80 पैसे</b> ख़र्च करते हैं। हर साल आप दो संख्याएँ तय करते हैं: <b>सरकारी व्यय (G)</b> और <b>कर (T)</b>।</p>
         <p>व्यवसायी किसी साल कम निवेश करेंगे, किसी साल ज़्यादा। देश को पूर्ण रोज़गार पर रखिए — कीमतें बेक़ाबू न हों, और देखिए आपकी उधारी का क्या होता है।</p>`),
    truth: FM,
    init() { return { g: FM.G0, t: FM.T0, debt: FM.DEBT0 }; },
    news(state, year) {
        const i = FM.invest(year), prev = year === 1 ? FM.I_NORMAL : FM.invest(year - 1), d = i - prev;
        const head = d < 0 ? B2(`📉 Business confidence has fallen. Private investment this year: ${crore(i)} (down ${crore(-d)}).`, `📉 व्यवसायियों का भरोसा घटा है। इस वर्ष निजी निवेश: ${crore(i)} (${crore(-d)} कम)।`)
            : (d > 0 ? B2(`📈 Businesses are building again. Private investment this year: ${crore(i)} (up ${crore(d)}).`, `📈 व्यवसायी फिर निर्माण कर रहे हैं। इस वर्ष निजी निवेश: ${crore(i)} (${crore(d)} अधिक)।`)
                : B2(`Private investment this year: ${crore(i)} (unchanged).`, `इस वर्ष निजी निवेश: ${crore(i)} (अपरिवर्तित)।`));
        return B2(`${head.en} Interest due on past borrowing: ${crore(FM.RATE * state.debt)}.`, `${head.hi} पिछली उधारी पर देय ब्याज: ${crore(FM.RATE * state.debt)}।`);
    },
    decisions(state) {
        return [
            { id: 'g', label: B2('Government spending (G)', 'सरकारी व्यय (G)'), min: FM.G_MIN, max: FM.G_MAX, step: 5, value: state.g, unit: '₹' },
            { id: 't', label: B2('Taxes collected (T)', 'एकत्रित कर (T)'), min: FM.T_MIN, max: FM.T_MAX, step: 5, value: state.t, unit: '₹' }
        ];
    },
    live(state, d) {
        const dg = d.g - state.g, dt = d.t - state.t;
        const sign = v => (v > 0 ? '+' : (v < 0 ? '−' : '±')) + Math.abs(v);
        return { ok: true, text: B2(`Against last year: G ${sign(dg)}, T ${sign(dt)} · you will need to borrow ${crore(d.g - d.t + FM.RATE * state.debt)} this year.`, `पिछले वर्ष की तुलना में: G ${sign(dg)}, T ${sign(dt)} · इस वर्ष आपको ${crore(d.g - d.t + FM.RATE * state.debt)} उधार लेना होगा।`) };
    },
    predict(state, year) {
        const i = FM.invest(year);
        if (year === 1) {
            const fall = FM.I_NORMAL - i, real = fall * FM.kG(), opts = [fall, real, fall * FM.B];
            const drop = FM.yEq(state.g, state.t, FM.I_NORMAL) - FM.yEq(state.g, state.t, i);
            return {
                prompt: B2(`Investment has fallen by ${crore(fall)}. If you change nothing, national income will fall by about…`, `निवेश ${crore(fall)} घटा है। यदि आप कुछ न बदलें, तो राष्ट्रीय आय लगभग कितनी घटेगी…`),
                options: opts.map(v => B2(crore(v), crore(v))),
                answer: () => { let k = 0; opts.forEach((v, j) => { if (Math.abs(v - drop) < Math.abs(opts[k] - drop)) k = j; }); return k; }
            };
        }
        if (year === 4) {
            // "If you leave G and T where they are" — fixed NOW: by the time the
            // answer is graded, step() has already written this year's choices.
            const idle = FM.year(state.g, state.t, i, state.debt).gapType;
            return {
                prompt: B2(`Investment has jumped to ${crore(i)}. If you leave G and T exactly where they are, the economy will be…`, `निवेश उछलकर ${crore(i)} हो गया है। यदि G और T को ठीक वहीं छोड़ दें, तो अर्थव्यवस्था होगी…`),
                options: [B2('Still short of full employment', 'अब भी पूर्ण रोज़गार से नीचे'), B2('Exactly at full employment', 'ठीक पूर्ण रोज़गार पर'), B2('Trying to buy more than it can produce — prices rise', 'उत्पादन क्षमता से अधिक ख़रीदने की कोशिश — कीमतें बढ़ेंगी')],
                answer: () => (idle === 'deficient' ? 0 : (idle === 'none' ? 1 : 2))
            };
        }
        return null;
    },
    step(state, d, year) {
        const i = FM.invest(year), prevG = state.g, prevT = state.t, debt = state.debt;
        const now = FM.year(d.g, d.t, i, debt), idle = FM.year(prevG, prevT, i, debt); // idle = had you done nothing
        state.g = d.g; state.t = d.t; state.debt = now.debtEnd;
        return Object.assign({ year, invest: i, g: d.g, t: d.t, dG: d.g - prevG, dT: d.t - prevT, yf: FM.YF, debtStart: debt, doNothingY: idle.yEq, doNothingType: idle.gapType, doNothingGapPct: idle.gapPct }, now);
    },
    scene(state, o) {
        const idle = o ? Math.round(o.idlePct) : 0;
        const crowd = lifeCrowd(100, 20, 26, 70, 13.5, i => {
            if (!o) return { fill: '#a7f3d0' };
            return i >= 100 - idle ? { fill: '#cbd5e1', opacity: 0.7, r: 3.4 } : { fill: '#059669', cls: 'life-pop', r: 4 };
        });
        // Bars share one scale within each pair; every label sits ABOVE its bar
        // so no value can run off the edge of the picture.
        const wAD = v => 180 * v / Math.max(o ? o.adAtYf : FM.YF, FM.YF);
        const wB = v => 180 * v / Math.max(o ? o.g + o.interest : 1, o ? o.t : 1);
        const adColor = o && o.gapType === 'excess' ? '#dc2626' : (o && o.gapType === 'deficient' ? '#2563eb' : '#059669');
        const bars = o ? `
            <g transform="translate(318,64)" font-size="10" fill="${LIFE_INK}">
                <text x="0" y="0">${lifeT(B2('The economy can produce', 'अर्थव्यवस्था की उत्पादन क्षमता'))} <tspan font-weight="800">${crore(o.yf)}</tspan></text>
                <rect x="0" y="5" width="${wAD(o.yf)}" height="11" rx="4" fill="#94a3b8"></rect>
                <text x="0" y="33">${lifeT(B2('It wants to buy (AD)', 'यह ख़रीदना चाहती है (AD)'))} <tspan font-weight="800">${crore(o.adAtYf)}</tspan></text>
                <rect x="0" y="38" width="${wAD(o.adAtYf)}" height="11" rx="4" fill="${adColor}"></rect>
                <text x="0" y="78">${lifeT(B2('Taxes collected (T)', 'एकत्रित कर (T)'))} <tspan font-weight="800">${crore(o.t)}</tspan></text>
                <rect x="0" y="83" width="${wB(o.t)}" height="11" rx="4" fill="#059669"></rect>
                <text x="0" y="111">${lifeT(B2('Spent: G + interest', 'व्यय: G + ब्याज'))} <tspan font-weight="800">${crore(o.g + o.interest)}</tspan></text>
                <rect x="0" y="116" width="${wB(o.g + o.interest)}" height="11" rx="4" fill="#f59e0b"></rect>
            </g>` : '';
        const head = !o ? lifeT(B2('100 people who want work', '100 लोग जो काम चाहते हैं'))
            : (o.gapType === 'deficient' ? lifeT(B2(`${idle} of every 100 are without work`, `हर 100 में ${idle} बिना काम के हैं`))
                : (o.gapType === 'excess' ? lifeT(B2('Everyone is working — and prices are climbing 🔥', 'सब काम पर हैं — और कीमतें चढ़ रही हैं 🔥')) : lifeT(B2('Everyone who wants work has it ✅', 'काम चाहने वाले हर व्यक्ति के पास काम है ✅'))));
        return lifeSvg(lifeT(B2('The workforce, spending against capacity, and the budget', 'कार्यबल, क्षमता के मुक़ाबले व्यय, और बजट')), `
            <rect x="0" y="0" width="520" height="240" rx="14" fill="${o && o.gapType === 'excess' ? '#fef2f2' : '#ecfdf5'}"></rect>
            <text x="22" y="30" font-size="13" font-weight="700" fill="${LIFE_INK}">👷 ${head}</text>
            <text x="22" y="48" font-size="9.5" fill="${LIFE_MUTE}">${lifeT(B2('(jobs drawn in proportion to output — an illustration)', '(रोज़गार उत्पादन के अनुपात में दिखाया गया है — एक चित्रण)'))}</text>
            ${crowd}${bars}`, 240);
    },
    stats(o) {
        return [
            { label: B2('National income', 'राष्ट्रीय आय'), value: crore(o.output), tone: o.gapType === 'none' ? 'good' : undefined },
            { label: o.gapType === 'excess' ? B2('Inflationary gap', 'स्फीतिक अंतराल') : B2('Deflationary gap', 'अवस्फीतिक अंतराल'), value: crore(o.gap), tone: o.gapType === 'none' ? 'good' : 'bad' },
            { label: B2('Fiscal deficit', 'राजकोषीय घाटा'), value: crore(o.fiscal) },
            { label: B2('Debt at year end', 'वर्ष के अंत में ऋण'), value: crore(o.debtEnd) }
        ];
    },
    ledger: [
        { key: 'y', label: B2('Yr', 'वर्ष'), get: r => String(r.round) },
        { key: 'i', label: 'I', get: r => String(r.outcome.invest) },
        { key: 'g', label: 'G', get: r => String(r.outcome.g) },
        { key: 't', label: 'T', get: r => String(r.outcome.t) },
        { key: 'inc', label: B2('Income', 'आय'), get: r => String(Math.round(r.outcome.yEq)) },
        { key: 'fd', label: B2('Deficit', 'घाटा'), get: r => String(Math.round(r.outcome.fiscal)) }
    ],
    narrate(o) {
        const move = (o.dG === 0 && o.dT === 0) ? B2('You changed nothing.', 'आपने कुछ नहीं बदला।')
            : B2(`You ${o.dG === 0 ? 'left G alone' : (o.dG > 0 ? `raised G by ${crore(o.dG)}` : `cut G by ${crore(-o.dG)}`)} and ${o.dT === 0 ? 'left T alone' : (o.dT > 0 ? `raised T by ${crore(o.dT)}` : `cut T by ${crore(-o.dT)}`)}.`,
                `आपने ${o.dG === 0 ? 'G को नहीं छेड़ा' : (o.dG > 0 ? `G ${crore(o.dG)} बढ़ाया` : `G ${crore(-o.dG)} घटाया`)} और ${o.dT === 0 ? 'T को नहीं छेड़ा' : (o.dT > 0 ? `T ${crore(o.dT)} बढ़ाया` : `T ${crore(-o.dT)} घटाया`)}।`);
        const result = o.gapType === 'none'
            ? B2(`Spending now exactly matches what the economy can produce: national income <b>${crore(o.output)}</b>, full employment, stable prices.`, `व्यय अब ठीक उतना है जितना अर्थव्यवस्था उत्पादन कर सकती है: राष्ट्रीय आय <b>${crore(o.output)}</b>, पूर्ण रोज़गार, स्थिर कीमतें।`)
            : (o.gapType === 'deficient'
                ? B2(`People and businesses together want to buy too little. Income settles at <b>${crore(o.yEq)}</b>, short of the ${crore(o.yf)} the country could produce — willing workers are sitting idle. At full employment, spending would fall short by ${crore(o.gap)}.`, `लोग और व्यवसायी मिलकर बहुत कम ख़रीदना चाहते हैं। आय <b>${crore(o.yEq)}</b> पर ठहरती है, जबकि देश ${crore(o.yf)} उत्पादन कर सकता है — काम को तैयार लोग ख़ाली बैठे हैं। पूर्ण रोज़गार पर व्यय ${crore(o.gap)} कम पड़ता।`)
                : B2(`The country is trying to buy ${crore(o.adAtYf)} of goods but can only make <b>${crore(o.yf)}</b>. Output cannot rise any further, so the extra ${crore(o.gap)} of spending just bids prices up.`, `देश ${crore(o.adAtYf)} की वस्तुएँ ख़रीदना चाहता है पर केवल <b>${crore(o.yf)}</b> बना सकता है। उत्पादन और नहीं बढ़ सकता, इसलिए ${crore(o.gap)} का अतिरिक्त व्यय केवल कीमतें चढ़ाता है।`));
        const cf = B2(` Had you done nothing, income would have been ${crore(o.doNothingY)}.`, ` यदि आप कुछ न करते, तो आय ${crore(o.doNothingY)} होती।`);
        const budget = B2(` The Budget: spent ${crore(o.g)} plus ${crore(o.interest)} interest, collected ${crore(o.t)} — you borrowed <b>${crore(o.fiscal)}</b>.`, ` बजट: ${crore(o.g)} व्यय और ${crore(o.interest)} ब्याज, ${crore(o.t)} वसूले — आपने <b>${crore(o.fiscal)}</b> उधार लिया।`);
        const showCf = !(o.dG === 0 && o.dT === 0);
        return B2(`${move.en} ${result.en}${showCf ? cf.en : ''}${budget.en}`, `${move.hi} ${result.hi}${showCf ? cf.hi : ''}${budget.hi}`);
    },
    nudge(history) {
        if (!history.length) return null;
        const o = history[history.length - 1].outcome;
        if (o.gapType === 'deficient') return B2(`Income fell ${crore(o.yf - o.yEq)} short. Notice how much smaller the change in investment was than the change in income.`, `आय ${crore(o.yf - o.yEq)} कम रही। ध्यान दीजिए निवेश में बदलाव आय में बदलाव से कितना छोटा था।`);
        if (o.gapType === 'excess') return B2('Output is already at its ceiling. Which of your two levers takes spending OUT of the economy?', 'उत्पादन पहले ही अपनी सीमा पर है। आपके दो लीवरों में से कौन अर्थव्यवस्था से व्यय बाहर निकालता है?');
        if (history.every(r => r.outcome.dT === 0)) return B2('You have only ever moved G. A rupee of tax cut and a rupee of spending — do they do the same job?', 'आपने अब तक केवल G बदला है। कर में एक रुपये की कटौती और व्यय का एक रुपया — क्या दोनों एक-सा काम करते हैं?');
        return null;
    },
    chart(history, reveal) {
        if (!history.length) return null;
        const os = history.map(r => r.outcome);
        if (!reveal) {
            return {
                traces: [
                    { x: [0.5, 5.5], y: [FM.YF, FM.YF], mode: 'lines', line: { color: '#059669', width: 2, dash: 'dash' }, name: lifeT(B2('Full-employment income', 'पूर्ण रोज़गार आय')) },
                    { x: os.map(o => o.year), y: os.map(o => o.yEq), mode: 'lines+markers', line: { color: '#047857', width: 3 }, marker: { size: 10, color: os.map(o => (o.gapType === 'none' ? '#059669' : (o.gapType === 'excess' ? '#dc2626' : '#2563eb'))) }, name: lifeT(B2('Where spending settled', 'व्यय जहाँ ठहरा')) }
                ],
                layout: { xaxis: { title: lifeT(B2('Year', 'वर्ष')), range: [0.5, 5.5], dtick: 1 }, yaxis: { title: lifeT(B2('Income (₹ thousand crore)', 'आय (₹ हज़ार करोड़)')), range: [1400, 2600] } }
            };
        }
        const colors = ['#2563eb', '#7c3aed', '#059669', '#dc2626', '#f59e0b'];
        const traces = [{ x: [1200, 2800], y: [1200, 2800], mode: 'lines', line: { color: '#1e1b3a', width: 2 }, name: lifeT(B2('45° line (Y = AD)', '45° रेखा (Y = AD)')) }];
        os.forEach((o, k) => traces.push({ x: [1200, 2800], y: [FM.ad(1200, o.g, o.t, o.invest), FM.ad(2800, o.g, o.t, o.invest)], mode: 'lines', line: { color: colors[k], width: 2 }, name: lifeT(B2(`AD, year ${o.year}`, `AD, वर्ष ${o.year}`)) }));
        traces.push(
            { x: os.map(o => o.yEq), y: os.map(o => o.yEq), text: os.map(o => String(o.year)), mode: 'markers+text', textposition: 'top left', marker: { size: 10, color: colors }, name: lifeT(B2('Your equilibrium each year', 'हर वर्ष आपका संतुलन')) },
            { x: [FM.YF, FM.YF], y: [1200, 2800], mode: 'lines', line: { color: '#059669', width: 2, dash: 'dash' }, name: lifeT(B2('Full-employment income', 'पूर्ण रोज़गार आय')) }
        );
        return { traces, layout: { xaxis: { title: lifeT(B2('Income / output (Y)', 'आय / उत्पादन (Y)')), range: [1400, 2600] }, yaxis: { title: lifeT(B2('Aggregate demand (AD)', 'समग्र मांग (AD)')), range: [1400, 2600] } } };
    },
    debrief(history) {
        const os = history.map(r => r.outcome);
        const score = os.reduce((s, o) => s + Math.max(0, 100 - 10 * o.gapPct), 0) / os.length;
        const y1 = history[0], mult = !!(y1.predict && y1.predict.correct);
        const fellI = FM.I_NORMAL - os[0].invest;
        const closer = o => o.gapPct < o.doNothingGapPct - 1e-9;
        const fixedDef = os.find(o => o.doNothingType === 'deficient' && (o.dG > 0 || o.dT < 0) && closer(o));
        const fixedExc = os.find(o => o.doNothingType === 'excess' && (o.dG < 0 || o.dT > 0) && closer(o));
        const taxYear = os.find(o => o.dT !== 0);
        const defYear = os.find(o => o.fiscal > 0);
        const hits = os.filter(o => o.gapType === 'none').length;
        return {
            score,
            scoreLine: B2(`You held the economy exactly at full employment in ${hits} of 5 years, and ended with public debt of ${crore(os[os.length - 1].debtEnd)} (it began at ${crore(FM.DEBT0)}).`, `5 में से ${hits} वर्षों में आपने अर्थव्यवस्था को ठीक पूर्ण रोज़गार पर रखा, और अंत में सार्वजनिक ऋण ${crore(os[os.length - 1].debtEnd)} रहा (शुरुआत ${crore(FM.DEBT0)} से हुई थी)।`),
            insights: [
                {
                    icon: '✖️', concept: B2('The investment multiplier', 'निवेश गुणक'), holds: mult,
                    evidence: B2(`In Year 1 investment fell by ${crore(fellI)} — and, left alone, income would have fallen by ${crore(fellI * FM.kG())}, ${FM.kG()} times as much. One person's cut in spending is the next person's cut in income, round after round: k = 1/(1 − MPC) = 1/(1 − ${FM.B}) = ${FM.kG()}.`, `वर्ष 1 में निवेश ${crore(fellI)} घटा — और यूँ ही छोड़ देने पर आय ${crore(fellI * FM.kG())} घटती, यानी ${FM.kG()} गुना। एक व्यक्ति के व्यय की कटौती अगले की आय की कटौती है, चक्र-दर-चक्र: k = 1/(1 − MPC) = 1/(1 − ${FM.B}) = ${FM.kG()}।`),
                    tryThis: B2('In Year 1, before touching anything, work out how far income falls when investment drops by 40 and households spend 80 paise of each extra rupee.', 'वर्ष 1 में, कुछ छूने से पहले, निकालिए कि निवेश 40 घटने और परिवारों के हर अतिरिक्त रुपये में से 80 पैसे ख़र्च करने पर आय कितनी गिरेगी।'),
                    exam: B2('Investment multiplier k = ΔY/ΔI = 1/(1 − MPC) = 1/MPS. It works in reverse too: a fall in investment lowers income by k times.', 'निवेश गुणक k = ΔY/ΔI = 1/(1 − MPC) = 1/MPS। यह उल्टी दिशा में भी काम करता है: निवेश घटने पर आय k गुना घटती है।')
                },
                {
                    icon: '🧊', concept: B2('Deficient demand and involuntary unemployment', 'न्यून मांग और अनैच्छिक बेरोज़गारी'), holds: !!fixedDef,
                    evidence: fixedDef ? B2(`Year ${fixedDef.year}: doing nothing would have left income at ${crore(fixedDef.doNothingY)}, below the ${crore(FM.YF)} the country could produce, with willing workers idle. You ${fixedDef.dG > 0 ? `raised G by ${crore(fixedDef.dG)}` : ''}${fixedDef.dG > 0 && fixedDef.dT < 0 ? ' and ' : ''}${fixedDef.dT < 0 ? `cut T by ${crore(-fixedDef.dT)}` : ''} and brought it to ${crore(fixedDef.yEq)}.`, `वर्ष ${fixedDef.year}: कुछ न करने पर आय ${crore(fixedDef.doNothingY)} रहती — देश की क्षमता ${crore(FM.YF)} से नीचे, और काम को तैयार लोग ख़ाली। आपने ${fixedDef.dG > 0 ? `G ${crore(fixedDef.dG)} बढ़ाया` : ''}${fixedDef.dG > 0 && fixedDef.dT < 0 ? ' और ' : ''}${fixedDef.dT < 0 ? `T ${crore(-fixedDef.dT)} घटाया` : ''} और आय ${crore(fixedDef.yEq)} पर पहुँचाई।`) : null,
                    tryThis: B2('In a slump year, raise G or cut T until the workers are back at work.', 'मंदी के वर्ष में G बढ़ाइए या T घटाइए, जब तक मज़दूर काम पर न लौट आएँ।'),
                    exam: B2('Deficient demand: AD falls short of AS at full employment ⇒ deflationary gap ⇒ output, income and employment fall. Fiscal remedy: increase government expenditure, reduce taxes.', 'न्यून मांग: पूर्ण रोज़गार पर AD, AS से कम ⇒ अवस्फीतिक अंतराल ⇒ उत्पादन, आय और रोज़गार घटते हैं। राजकोषीय उपाय: सरकारी व्यय बढ़ाएँ, कर घटाएँ।')
                },
                {
                    icon: '🔥', concept: B2('Excess demand and the inflationary gap', 'अधिमांग और स्फीतिक अंतराल'), holds: !!fixedExc,
                    evidence: fixedExc ? B2(`Year ${fixedExc.year}: left alone, the country would have tried to spend its way to ${crore(fixedExc.doNothingY)} with only ${crore(FM.YF)} of goods to buy — pure price rise. You ${fixedExc.dG < 0 ? `cut G by ${crore(-fixedExc.dG)}` : ''}${fixedExc.dG < 0 && fixedExc.dT > 0 ? ' and ' : ''}${fixedExc.dT > 0 ? `raised T by ${crore(fixedExc.dT)}` : ''} and cooled it to ${crore(fixedExc.yEq)}.`, `वर्ष ${fixedExc.year}: यूँ ही छोड़ने पर देश ${crore(fixedExc.doNothingY)} तक ख़र्च करना चाहता, जबकि ख़रीदने को केवल ${crore(FM.YF)} की वस्तुएँ थीं — केवल मूल्य-वृद्धि। आपने ${fixedExc.dG < 0 ? `G ${crore(-fixedExc.dG)} घटाया` : ''}${fixedExc.dG < 0 && fixedExc.dT > 0 ? ' और ' : ''}${fixedExc.dT > 0 ? `T ${crore(fixedExc.dT)} बढ़ाया` : ''} और इसे ${crore(fixedExc.yEq)} पर ठंडा किया।`) : null,
                    tryThis: B2('In the boom year, do the uncomfortable thing: spend less or tax more.', 'उछाल के वर्ष में असुविधाजनक काम कीजिए: कम ख़र्च या अधिक कर।'),
                    exam: B2('Excess demand: AD exceeds AS at full employment ⇒ inflationary gap. Output cannot rise, so only prices do. Fiscal remedy: reduce government expenditure, increase taxes.', 'अधिमांग: पूर्ण रोज़गार पर AD, AS से अधिक ⇒ स्फीतिक अंतराल। उत्पादन नहीं बढ़ सकता, इसलिए केवल कीमतें बढ़ती हैं। राजकोषीय उपाय: सरकारी व्यय घटाएँ, कर बढ़ाएँ।')
                },
                {
                    icon: '✂️', enrichment: true, concept: B2('A rupee of tax is weaker than a rupee of spending', 'कर का एक रुपया व्यय के एक रुपये से कमज़ोर है'), holds: !!taxYear,
                    evidence: taxYear ? B2(`Year ${taxYear.year}: you changed T by ${crore(taxYear.dT)}. On its own that moves income by ${crore(taxYear.dT * FM.kT())} (${Math.abs(FM.kT())} per rupee); the same rupees of G would have moved it by ${crore(Math.abs(taxYear.dT) * FM.kG())} (${FM.kG()} per rupee). Households save 20 paise of every rupee of tax they are spared — it never gets spent.`, `वर्ष ${taxYear.year}: आपने T में ${crore(taxYear.dT)} का बदलाव किया। अकेले इससे आय ${crore(taxYear.dT * FM.kT())} बदलती है (प्रति रुपया ${Math.abs(FM.kT())}); उतने ही रुपये G में लगते तो आय ${crore(Math.abs(taxYear.dT) * FM.kG())} बदलती (प्रति रुपया ${FM.kG()})। परिवार बचे हुए कर के हर रुपये में से 20 पैसे बचा लेते हैं — वह कभी ख़र्च नहीं होता।`) : null,
                    tryThis: B2('Close one gap using only T and compare how many rupees it took.', 'एक अंतराल केवल T से पाटिए और तुलना कीजिए कि कितने रुपये लगे।'),
                    exam: B2('✨ Enrichment beyond the named 2026–27 topic: the syllabus asks you to NAME tax and spending changes as fiscal measures, not to compute a tax multiplier (−MPC/MPS).', '✨ 2026–27 के नामित विषय से आगे का संवर्धन: पाठ्यक्रम कर और व्यय परिवर्तन को राजकोषीय उपाय के रूप में बताने को कहता है, कर गुणक (−MPC/MPS) की गणना करने को नहीं।')
                },
                {
                    icon: '📑', concept: B2('Fiscal deficit and primary deficit', 'राजकोषीय घाटा और प्राथमिक घाटा'), holds: !!defYear,
                    evidence: defYear ? B2(`Year ${defYear.year}: total expenditure ${crore(defYear.g)} + ${crore(defYear.interest)} interest = ${crore(defYear.g + defYear.interest)}; receipts ${crore(defYear.t)}. Fiscal deficit = ${crore(defYear.fiscal)} — exactly what you had to borrow. Take out the interest and the primary deficit is ${crore(defYear.primary)}. Your debt went from ${crore(defYear.debtStart)} to ${crore(defYear.debtEnd)}, so next year's interest bill is bigger.`, `वर्ष ${defYear.year}: कुल व्यय ${crore(defYear.g)} + ${crore(defYear.interest)} ब्याज = ${crore(defYear.g + defYear.interest)}; प्राप्तियाँ ${crore(defYear.t)}। राजकोषीय घाटा = ${crore(defYear.fiscal)} — ठीक उतना जितना आपको उधार लेना पड़ा। ब्याज हटा दें तो प्राथमिक घाटा ${crore(defYear.primary)}। आपका ऋण ${crore(defYear.debtStart)} से ${crore(defYear.debtEnd)} हुआ, इसलिए अगले वर्ष का ब्याज और बड़ा होगा।`) : null,
                    tryThis: B2('Run a year where spending plus interest exceeds taxes and read the borrowing figure.', 'ऐसा वर्ष चलाइए जिसमें व्यय और ब्याज मिलकर करों से अधिक हों, और उधारी का आँकड़ा पढ़िए।'),
                    exam: B2('Fiscal deficit = Total expenditure − Total receipts excluding borrowings (= borrowing requirement). Primary deficit = Fiscal deficit − Interest payments.', 'राजकोषीय घाटा = कुल व्यय − उधार के अतिरिक्त कुल प्राप्तियाँ (= उधार की आवश्यकता)। प्राथमिक घाटा = राजकोषीय घाटा − ब्याज भुगतान।')
                }
            ]
        };
    }
});
