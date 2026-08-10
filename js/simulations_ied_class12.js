// Class XII · Part B — Indian Economic Development: the Concept Explorer /
// Data Lab content that was completely missing before this integration
// pass (Unit 6 Development Experience & Reforms, Unit 7 Rural Development
// & Sustainable Development, Unit 8 Comparison with Neighbours). See
// CLAUDE.md for the data contract.

if (typeof SIMS !== 'undefined') {
    SIMS.push(
        {
            id: 'ied-five-year-plans',
            module: 'india',
            title: "India's Development Path: 1947 to the GST Era",
            desc: 'Step through the Indian economy at Independence, the Five-Year Plans, and the 1991 reforms — LPG, Demonetisation, GST.',
            class: 'XII', part: 'B', unit: 6, unitTitle: 'Development Experience (1947–90) and Economic Reforms since 1991', topicLabel: 'Independence → Planning → LPG → Demonetisation → GST',
            syllabusIds: ['XII-B-U6-INDEPENDENCE', 'XII-B-U6-SYSTEM', 'XII-B-U6-PLANS', 'XII-B-U6-AGRICULTURE', 'XII-B-U6-INDUSTRY', 'XII-B-U6-TRADE', 'XII-B-U6-LPG'],
            mode: 'explorer',
            concept: '<p>India\'s economic development since Independence is a story best told as a timeline, not a formula — from a stagnant colonial economy, through decades of planned development, to a market-oriented economy after 1991. Step through each period below.</p>',
            formulas: [],
            explorer: {
                type: 'timeline',
                eras: [
                    {
                        period: 'Before 1947', title: 'The Indian Economy at Independence',
                        body: 'Under colonial rule, agriculture stagnated despite being the main livelihood, India\'s traditional handicraft industries were deliberately run down without modern industry replacing them ("de-industrialisation"), foreign trade served British interests (raw materials out, finished British goods in), and demographic indicators — life expectancy, literacy — were extremely poor.',
                        tags: ['Colonial Legacy', 'Stagnant Agriculture', 'De-industrialisation'],
                        insight: 'This is the starting point every later reform is measured against — "development" in this unit means moving away from exactly this state.'
                    },
                    {
                        period: '1950', title: 'A Mixed Economy & the Planning Commission',
                        body: 'Independent India adopted a "mixed economy" — public and private sectors coexisting, with the state taking a leading role in heavy industry and infrastructure. The Planning Commission was set up to design Five-Year Plans for the whole economy.',
                        tags: ['Mixed Economy', 'Planning Commission'],
                        insight: 'This is the economic system referenced in the syllabus as "adopted in the post-independence period" — neither fully state-run nor fully market-driven.'
                    },
                    {
                        period: '1951–1990', title: 'Five-Year Plans: Common Goals',
                        body: 'Across the Plans, four goals recur: <b>Growth</b> (raising the economy\'s capacity to produce), <b>Modernisation</b> (adopting new technology and social outlook), <b>Self-Reliance</b> (avoiding dependence on imports, especially food and capital goods), and <b>Equity</b> (ensuring the poorest also benefit from growth). In agriculture, the <b>New Agricultural Strategy</b> (HYV seeds, irrigation, fertilisers — the "Green Revolution") raised foodgrain output sharply, mainly in Punjab, Haryana and western UP. In industry, the <b>Industrial Policy Resolution (IPR) 1956</b> gave the state a dominant role in heavy industry while reserving many products for <b>Small-Scale Industries (SSI)</b>. Foreign trade stayed restrictive — <b>import substitution</b> aimed to produce domestically what was previously imported.',
                        tags: ['Five-Year Plans', 'Green Revolution', 'IPR 1956', 'SSI', 'Import Substitution'],
                        insight: 'The "License-Permit-Quota Raj" that built up across this period — heavy government control over what firms could produce and import — is exactly what the 1991 reforms later targeted.'
                    },
                    {
                        period: '1991', title: 'The Balance of Payments Crisis',
                        body: 'By 1991, India faced a severe economic crisis: foreign exchange reserves fell to barely cover a few weeks of imports, the fiscal deficit was unsustainable, and inflation was high. India had to airlift gold reserves to secure an emergency IMF loan. This crisis was the immediate trigger for major reform.',
                        tags: ['BOP Crisis', 'IMF Loan'],
                        insight: 'Reforms are rarely adopted purely on economic theory — this crisis is the concrete "why now" behind 1991.'
                    },
                    {
                        period: '1991 onward', title: 'Economic Reforms: Liberalisation, Privatisation, Globalisation (LPG)',
                        body: '<b>Liberalisation</b> reduced government control over industry — licensing was scrapped for most industries, and interest/exchange rates moved closer to market determination. <b>Privatisation</b> reduced the role of the public sector — through disinvestment and allowing private/foreign firms into previously reserved sectors. <b>Globalisation</b> integrated India more closely with the world economy — lower import tariffs, easier foreign investment. <b>Appraisal:</b> reforms are credited with raising GDP growth and foreign investment, but critiqued for slower agricultural growth, jobless growth in some sectors, and rising inequality — the syllabus expects both sides.',
                        tags: ['Liberalisation', 'Privatisation', 'Globalisation'],
                        insight: 'Notice the LPG reforms directly reverse the previous era\'s tools: licensing (Liberalisation reverses it), public-sector dominance (Privatisation reverses it), import substitution (Globalisation reverses it).'
                    },
                    {
                        period: '2016', title: 'Demonetisation',
                        body: 'The government withdrew ₹500 and ₹1000 notes from circulation overnight, aiming to curb black money, fake currency and push toward a less cash-dependent economy. It caused significant short-term disruption, especially to the informal cash-based economy.',
                        tags: ['Demonetisation'],
                        insight: 'A useful contrast to LPG: this was a sudden monetary/administrative move, not a gradual structural reform.'
                    },
                    {
                        period: '2017', title: 'Goods and Services Tax (GST)',
                        body: 'GST replaced a patchwork of central and state indirect taxes (excise duty, VAT, service tax, and more) with a single "one nation, one tax" system, aiming to simplify compliance and reduce the tax-on-tax ("cascading") effect that raised prices under the old system.',
                        tags: ['GST', 'Indirect Tax Reform'],
                        insight: 'GST is the most significant tax reform since 1991 — it belongs on this timeline as a structural reform, alongside (not the same as) the original LPG package.'
                    }
                ]
            },
            practice: [
                { prompt: 'Name one goal of the Five-Year Plans that the LPG reforms arguably worked against, and one they supported.', hint: "Equity is the most contested — critics argue LPG-era growth was less evenly shared; Growth and Modernisation are generally credited to the reforms." }
            ],
            challenge: {
                prompt: 'Reach the GST era at the end of the timeline.',
                check(state, metrics) { return metrics && typeof metrics.eraTitle === 'string' && metrics.eraTitle.indexOf('GST') !== -1; }
            }
        },
        {
            id: 'ied-rural-development',
            module: 'india',
            title: 'Rural Development: Credit, Marketing, Cooperatives & Diversification',
            desc: 'Compare the key levers of rural development named by NCERT — credit, marketing, cooperatives, diversification, and organic farming.',
            class: 'XII', part: 'B', unit: 7, unitTitle: 'Current Challenges facing Indian Economy', topicLabel: 'Rural Development',
            syllabusIds: ['XII-B-U7-RURAL'],
            mode: 'explorer',
            concept: "<p>Rural development means raising the standard of living of the rural population, which in India is still predominantly agricultural. NCERT names several specific levers — not a single policy. Compare them below.</p>",
            formulas: [],
            explorer: {
                type: 'scenario',
                scenarios: [
                    {
                        id: 'credit', label: 'Rural Credit', summary: 'Farmers need credit for seeds, fertiliser and equipment — historically from moneylenders at exploitative interest rates.',
                        sections: [
                            { heading: 'The Problem', items: ['Historically dominated by moneylenders charging very high interest', 'Debt cycles trapped farmers across generations'] },
                            { heading: 'The Institutional Response', items: ['Cooperative credit societies', 'Regional Rural Banks and commercial bank branch expansion into villages', "NABARD (National Bank for Agriculture and Rural Development) apex financing"] }
                        ],
                        insight: 'Institutional (formal) credit is cheaper and safer than informal moneylenders — but reach and awareness remain uneven across regions.'
                    },
                    {
                        id: 'marketing', label: 'Rural Marketing', summary: 'Getting produce from the farm to the final buyer at a fair price — historically farmers were exploited by intermediaries.',
                        sections: [
                            { heading: 'The Problem', items: ['Farmers often lack storage, so must sell immediately at low, distress prices', 'Multiple middlemen each take a margin before the produce reaches consumers'] },
                            { heading: 'The Response', items: ['Regulated markets (mandis) to ensure fair, transparent pricing', 'Minimum Support Price (MSP) as a price floor for key crops', 'Better rural roads and storage/warehousing to reduce distress sales'] }
                        ],
                        insight: 'This connects directly to the Price Floor simulator in the Class XI Microeconomics part — MSP is a real-world price floor.'
                    },
                    {
                        id: 'cooperatives', label: 'Role of Cooperatives', summary: 'Farmers pooling resources collectively — for credit, marketing, or processing — to gain bargaining power individuals lack alone.',
                        sections: [
                            { heading: 'What They Do', items: ['Collective purchase of inputs (cheaper in bulk)', 'Collective marketing/processing (e.g. AMUL-style dairy cooperatives)', 'Collective access to credit and storage'] }
                        ],
                        insight: 'The dairy cooperative movement (Operation Flood, AMUL) is NCERT\'s flagship success story for this lever.'
                    },
                    {
                        id: 'diversification', label: 'Agricultural Diversification', summary: 'Reducing over-dependence on crop farming alone by expanding into allied and non-farm rural activities.',
                        sections: [
                            { heading: 'Allied Activities', items: ['Animal husbandry (dairy, poultry)', 'Fisheries', 'Horticulture (fruits, vegetables, flowers)'] },
                            { heading: 'Non-Farm Employment', items: ['Rural industry and services reduce disguised unemployment in agriculture'] }
                        ],
                        insight: 'Diversification spreads risk — a bad crop year hurts less if a household also earns from dairy or a non-farm trade.'
                    },
                    {
                        id: 'organic', label: 'Organic Farming', summary: 'Farming without synthetic chemical fertilisers/pesticides — an alternative, more sustainable production method.',
                        sections: [
                            { heading: 'Merits', items: ['Environmentally sustainable — no chemical runoff', 'Often lower input cost over time', 'Growing premium export/domestic market'] },
                            { heading: 'Challenges', items: ['Yields can be lower during the transition period', 'Certification and market access take time to build'] }
                        ],
                        insight: 'Organic farming links this topic directly to Sustainable Economic Development — the next explorer in this module.'
                    }
                ]
            },
            practice: [
                { prompt: 'Which lever most directly addresses a farmer being forced to sell at a low price right after harvest?', hint: 'Rural Marketing (storage, MSP, regulated markets) — Rural Credit addresses a different problem (input finance).' }
            ]
        },
        {
            id: 'ied-sustainable-development',
            module: 'india',
            title: 'Sustainable Economic Development',
            desc: 'The tension between growth and the environment — resource use, environmental impact, global warming, and strategies for sustainability.',
            class: 'XII', part: 'B', unit: 7, unitTitle: 'Current Challenges facing Indian Economy', topicLabel: 'Sustainable Economic Development',
            syllabusIds: ['XII-B-U7-SUSTAINABLE'],
            mode: 'explorer',
            concept: '<p>Development that meets today\'s needs can strain the resources tomorrow\'s generation will need. <b>Sustainable development</b> tries to grow the economy without permanently damaging that capacity. Compare the dimensions of this trade-off below.</p>',
            formulas: [],
            explorer: {
                type: 'scenario',
                scenarios: [
                    {
                        id: 'meaning', label: 'What is Sustainable Development?', summary: 'Development that meets the needs of the present generation without compromising the ability of future generations to meet their own needs.',
                        sections: [{ heading: 'Core Idea', items: ['Growth today should not permanently deplete the resource base future generations depend on', 'Applies to renewable resources (forests, fisheries — can be overused faster than they regenerate) and non-renewable ones (fossil fuels — finite by definition)'] }],
                        insight: 'This one-sentence definition is the anchor for every other scenario in this explorer — each is a specific way growth can undermine it.'
                    },
                    {
                        id: 'resource-effects', label: 'Effects of Development on Resources', summary: 'Rising production and consumption place direct pressure on land, water, forests and minerals.',
                        sections: [{ heading: 'Examples', items: ['Groundwater depletion from intensive irrigation', 'Deforestation for agricultural land, timber and urban expansion', 'Soil degradation from overuse of chemical fertilisers'] }],
                        insight: 'Notice these are largely the same resources the Green Revolution and industrial growth (covered in the previous Development Experience explorer) relied on most heavily.'
                    },
                    {
                        id: 'environment', label: 'Effects on the Environment', summary: 'Beyond resource depletion, production and consumption also generate pollution and waste that the environment must absorb.',
                        sections: [{ heading: 'Examples', items: ['Air and water pollution from industry and vehicles', 'Waste generation outpacing safe disposal capacity in fast-growing cities'] }],
                        insight: 'Environmental damage is often a cost borne by people who did not benefit from the activity that caused it — an equity dimension the syllabus expects you to note.'
                    },
                    {
                        id: 'global-warming', label: 'Global Warming', summary: 'Rising greenhouse gas concentrations (mainly from burning fossil fuels) trap more heat, raising global temperatures with wide-ranging consequences.',
                        sections: [{ heading: 'Consequences', items: ['More extreme and unpredictable weather', 'Rising sea levels threatening coastal areas', 'Impacts on agricultural productivity and water availability'] }],
                        insight: 'Global warming is the clearest example of a problem no single country can solve alone — development choices in one country affect all others.'
                    },
                    {
                        id: 'strategies', label: 'Strategies for Sustainability', summary: 'Policy and behavioural responses aimed at growing the economy while protecting the resource base.',
                        sections: [{ heading: 'Approaches', items: ['Shifting to renewable energy (solar, wind) instead of fossil fuels', 'Substituting cleaner fuels (LPG/CNG) for traditional biomass (firewood, dung cakes)', 'Afforestation and community forest protection (e.g. the Chipko movement)', 'More efficient, judicious use of scarce resources like water'] }],
                        insight: 'This connects back to Class XI Microeconomics — every strategy here is really a change in relative prices or incentives (e.g. cheaper renewable energy, taxes/subsidies) nudging producers and consumers toward less resource-intensive choices.'
                    }
                ]
            },
            practice: [
                { prompt: 'Give one example of a strategy that addresses BOTH resource depletion and global warming at once.', hint: 'Shifting to renewable/solar energy — it reduces fossil-fuel depletion AND cuts the greenhouse gas emissions driving global warming.' }
            ]
        },
        {
            id: 'ied-comparison-neighbours',
            module: 'india',
            title: 'Development Comparison: India, Pakistan & China',
            desc: 'Enter (or edit) growth, population, sectoral and HDI figures for India, Pakistan and China and compare them live.',
            class: 'XII', part: 'B', unit: 8, unitTitle: 'Development Experience of India — A Comparison with Neighbours', topicLabel: 'India / Pakistan / China Comparison',
            syllabusIds: ['XII-B-U8-COMPARISON'],
            mode: 'datalab',
            concept: '<p>India, Pakistan and China had broadly comparable starting points around the mid-20th century but followed very different development strategies — China\'s state-led, export-oriented industrialisation moved earliest and fastest; India\'s democratic, more gradual reform path; Pakistan\'s more volatile growth and heavier reliance on agriculture and remittances. The table below uses illustrative figures — edit them with current World Bank/UNDP data for an exact, up-to-date comparison — but the comparison structure itself (growth, demography, sectoral structure, HDI) is exactly the one NCERT asks for.</p>',
            formulas: ['Human Development Index (HDI) combines income, education and life-expectancy indicators into a single 0–1 score'],
            dataLab: {
                columns: [
                    { id: 'country', label: 'Country', type: 'text', default: 'Country' },
                    { id: 'growth', label: 'GDP Growth Rate', type: 'number', step: 0.1, min: -10, max: 15, unit: '%', default: 5 },
                    { id: 'population', label: 'Population', type: 'number', step: 10, min: 0, unit: 'million', default: 100 },
                    { id: 'agriShare', label: 'Agriculture Share of GDP', type: 'number', step: 0.5, min: 0, max: 60, unit: '%', default: 15 },
                    { id: 'hdi', label: 'HDI', type: 'number', step: 0.01, min: 0, max: 1, default: 0.6 }
                ],
                minRows: 3,
                maxRows: 6,
                addRowDefault: { country: 'New Country', growth: 5, population: 100, agriShare: 15, hdi: 0.6 },
                defaultRows: [
                    { country: 'India', growth: 7.0, population: 1428, agriShare: 16, hdi: 0.64 },
                    { country: 'Pakistan', growth: 2.4, population: 240, agriShare: 22, hdi: 0.54 },
                    { country: 'China', growth: 5.0, population: 1411, agriShare: 7, hdi: 0.79 }
                ],
                calculate(rows) {
                    const byHDI = [...rows].sort((a, b) => b.hdi - a.hdi);
                    const byGrowth = [...rows].sort((a, b) => b.growth - a.growth);
                    return {
                        traces: [
                            { x: rows.map(r => r.country), y: rows.map(r => r.growth), name: 'GDP Growth Rate (%)', type: 'bar', marker: { color: '#2563eb' } },
                            { x: rows.map(r => r.country), y: rows.map(r => r.hdi * 100), name: 'HDI (×100, right axis)', type: 'bar', marker: { color: '#f59e0b' }, yaxis: 'y2' }
                        ],
                        layout: {
                            xaxis: { title: 'Country' },
                            yaxis: { title: 'GDP Growth Rate (%)' },
                            yaxis2: { title: 'HDI (× 100)', overlaying: 'y', side: 'right', range: [0, 100] },
                            barmode: 'group'
                        },
                        stats: [
                            { label: 'Highest HDI', value: `${byHDI[0].country} (${fmt(byHDI[0].hdi, 2)})` },
                            { label: 'Fastest GDP Growth', value: `${byGrowth[0].country} (${fmt(byGrowth[0].growth, 1)}%)` },
                            { label: 'Most Agriculture-Dependent', value: `${[...rows].sort((a, b) => b.agriShare - a.agriShare)[0].country}` }
                        ],
                        metrics: Object.fromEntries(rows.map(r => [(r.country || '').toLowerCase() + 'HDI', r.hdi])),
                        interpretation: `${byHDI[0].country} has the highest Human Development Index here, while ${byGrowth[0].country} shows the fastest GDP growth — a reminder that fast growth and high human development don't automatically move together; growth has to translate into health, education and income gains to raise HDI.`
                    };
                }
            },
            practice: [
                { prompt: "Raise India's Agriculture Share of GDP while lowering China's. What does that suggest about each economy's structure?", hint: 'A lower agriculture share generally signals a more industrialised/services-driven economy — part of why comparing sectoral structure matters alongside growth and HDI.' }
            ],
            challenge: {
                prompt: "Edit the table so India's HDI value exceeds China's.",
                check(state, metrics) { return metrics && typeof metrics.indiaHDI === 'number' && typeof metrics.chinaHDI === 'number' && metrics.indiaHDI > metrics.chinaHDI; }
            }
        }
    );
}
