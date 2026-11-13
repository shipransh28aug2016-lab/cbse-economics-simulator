// Hindi for the text inside every Plotly chart (trace names, axis titles,
// chart titles, annotations, category labels) of the simulator and Data Lab
// sims, plus the default rows of the Data Lab tables.
//
// CHART_I18N_HI[simId] holds [english, hindi] pairs. sim-engine.js's
// translateChartText() applies the sim's own pairs and the shared `_common`
// ones together, longest first, and only where the English stands as whole
// words ("Demand" never matches inside "Demanded"), to the text the model
// already produced, so numbers in a label ("Shortage: 80 units") survive.
//
// DATALAB_ROWS_HI[simId] maps each English default-row text value to Hindi.
// The rows are translated when the table is first filled (a language toggle
// re-opens the sim, so it refills), so the table, chart and interpretation all
// show the same Hindi names. A student's own typed values are never touched.
//
// tools/test-curriculum.js (testChartsAreTranslated) sweeps every sim and
// fails on English left in a chart, on a number changed by translation, or on
// a dead pair.
/* exported CHART_I18N_HI, DATALAB_ROWS_HI */
const CHART_I18N_HI = {
    _common: [
        ['Demand', 'माँग'], ['Supply', 'पूर्ति'], ['Equilibrium', 'संतुलन'], ['Quantity', 'मात्रा'],
        ['Price', 'कीमत'], ['Current Point', 'वर्तमान बिंदु'], ['Current', 'वर्तमान'], ['Output', 'उत्पादन'],
        ['Data', 'आँकड़े'], ['Mean', 'माध्य'], ['Median', 'माध्यिका'], ['Value', 'मान'],
        ['(dotted)', '(बिंदुदार)'], ['(before)', '(पहले)'], ['units', 'इकाई'], ['Good', 'वस्तु'], ['Income', 'आय'],
        ['Consumption', 'उपभोग'], ['Line', 'रेखा'], ['National Income', 'राष्ट्रीय आय'], ['Cost', 'लागत']
    ],
    'micro-supply-demand': [['(original)', '(मूल)'], ['Original', 'मूल']],
    'macro-gdp': [
        ['Households', 'परिवार'], ['Firms', 'फ़र्में'], ['Government', 'सरकार'], ['Financial Market (Banks)', 'वित्तीय बाज़ार (बैंक)'],
        ['Foreign Sector', 'विदेशी क्षेत्र'], ['Consumption Exp. (C)', 'उपभोग व्यय (C)'], ['Factor Payments (Wages)', 'साधन भुगतान (मज़दूरी)'],
        ['Factor Services', 'साधन सेवाएँ'], ['Goods &amp; Services', 'वस्तुएँ और सेवाएँ'],
        ['Savings (S) — Leakage', 'बचत (S) — लीकेज'], ['Investment (I) — Injection', 'निवेश (I) — इंजेक्शन'],
        ['Taxes (T) — Leakage', 'कर (T) — लीकेज'], ['Govt Purchases (G) — Injection', 'सरकारी क्रय (G) — इंजेक्शन'],
        ['Exports (X) — Injection', 'निर्यात (X) — इंजेक्शन'], ['Imports (M) — Leakage', 'आयात (M) — लीकेज'],
        ['Money Flow (payments)', 'मौद्रिक प्रवाह (भुगतान)'], ['Real Flow (factors / goods)', 'वास्तविक प्रवाह (साधन / वस्तुएँ)']
    ],
    'micro-elasticity': [
        ['Engel Curve', 'एंजेल वक्र'], ["Consumer Income (₹'000/month)", "उपभोक्ता आय (₹'000/माह)"],
        ['Quantity Demanded of Good X', 'वस्तु X की माँगी गई मात्रा'], ['Quantity Demanded', 'माँगी गई मात्रा'],
        ['Demand for X vs Price of Y', 'X की माँग बनाम Y की कीमत'], ['Price of Related Good Y (₹)', 'संबंधित वस्तु Y की कीमत (₹)']
    ],
    'macro-multiplier': [
        ['(after)', '(बाद में)'], ['Old Equilibrium', 'पुराना संतुलन'],
        ['New Equilibrium', 'नया संतुलन'], ['Aggregate Expenditure', 'समग्र व्यय']
    ],
    'stats-correlation': [
        ['Best-fit line', 'सर्वोत्तम-अनुरूप रेखा'], ['Study Hours / Week', 'अध्ययन घंटे / सप्ताह'], ['Test Score', 'परीक्षा अंक']
    ],
    'india-poverty': [
        ['Line of Equality', 'समानता रेखा'], ['Lorenz Curve (Area of Inequality shaded)', 'लॉरेंज वक्र (असमानता का क्षेत्र छायांकित)'],
        ['Headcount Cutoff', 'निर्धनता रेखा (गणना सीमा)'], ['Cumulative % of Population', 'जनसंख्या का संचयी %'],
        ['Cumulative % of Income', 'आय का संचयी %']
    ],
    'micro-consumer-equilibrium': [
        ['Marginal Utility (in ₹)', 'सीमांत उपयोगिता (₹ में)'],
        ['(TU at its maximum — the stop only if the good were free)', '(TU अधिकतम — रुकने का बिंदु केवल तब, जब वस्तु मुफ़्त हो)'],
        ['Zero Utility', 'शून्य उपयोगिता'], ['Units Consumed', 'उपभोग की गई इकाइयाँ'],
        ['Marginal Utility (₹ worth)', 'सीमांत उपयोगिता (₹ मूल्य)'], ['Equi-Marginal Equilibrium', 'सम-सीमांत संतुलन'],
        ['Your', 'आपका'], ['Units of X purchased', 'खरीदी गई X की इकाइयाँ'], ['Marginal Utility per Rupee', 'प्रति रुपया सीमांत उपयोगिता']
    ],
    'micro-producer-costs': [
        ['Average Cost', 'औसत लागत'], ['Marginal Cost', 'सीमांत लागत'], ['(Minimum Average Cost)', '(न्यूनतम औसत लागत)'],
        ['Average Product', 'औसत उत्पाद'], ['Marginal Product', 'सीमांत उत्पाद'], ['Zero', 'शून्य'],
        ['Phase I / II boundary (MP at its maximum)', 'अवस्था I / II की सीमा (MP अधिकतम)'],
        ['Phase II / III boundary (MP = 0, TP max)', 'अवस्था II / III की सीमा (MP = 0, TP अधिकतम)'],
        ['Labour Units', 'श्रम इकाइयाँ'], ['Product (units)', 'उत्पाद (इकाइयाँ)'], ['(AP at its maximum)', '(AP अधिकतम)'], ['Phase', 'अवस्था']
    ],
    'micro-price-controls': [
        ['Price Floor', 'न्यूनतम कीमत सीमा'], ['Price Ceiling', 'उच्चतम कीमत सीमा'], ['Free-Market', 'मुक्त-बाज़ार'],
        ['Surplus', 'अधिशेष'], ['Shortage', 'कमी']
    ],
    'micro-market-structures': [
        ['Marginal Cost (perfect-competition benchmark)', 'सीमांत लागत (पूर्ण प्रतियोगिता मानक)'], ['Number of Firms', 'फ़र्मों की संख्या']
    ],
    'macro-money-creation': [
        ['New Deposit This Round', 'इस दौर की नई जमा'], ['Round', 'दौर'], ['Cumulative Money Created', 'संचयी सृजित मुद्रा'],
        ['Total Money Created', 'कुल सृजित मुद्रा'], ['Successive Deposit Rounds', 'क्रमिक जमा दौर'], ['Cumulative Total', 'संचयी कुल']
    ],
    'macro-govt-budget': [
        ['Revenue Receipts', 'राजस्व प्राप्तियाँ'], ['Non-debt Capital Receipts', 'गैर-ऋण पूँजीगत प्राप्तियाँ'],
        ['Revenue Exp.', 'राजस्व व्यय'], ['Capital Exp.', 'पूँजीगत व्यय'], ['Total Receipts (excl. borrowing)', 'कुल प्राप्तियाँ (उधार छोड़कर)'],
        ['Total Expenditure', 'कुल व्यय'], ['Budget Component', 'बजट घटक'], ['₹ Billion', '₹ अरब'],
        ['Fiscal Deficit', 'राजकोषीय घाटा']
    ],
    'macro-forex': [
        ['Demand for $', '$ की माँग'], ['Supply of $', '$ की पूर्ति'], ['Equilibrium Rate', 'संतुलन दर'],
        ['Quantity of US$ (millions)', 'US$ की मात्रा (मिलियन)'], ['Exchange Rate', 'विनिमय दर']
    ],
    'macro-inflation-gap': [
        ['Aggregate Supply (45° line, AS = Y)', 'समग्र पूर्ति (45° रेखा, AS = Y)'], ['Aggregate Demand', 'समग्र माँग'],
        ['Full Employment', 'पूर्ण रोज़गार'], ['National Income / Output (Y, ₹ crore)', 'राष्ट्रीय आय / उत्पादन (Y, ₹ करोड़)'],
        ['Aggregate Demand / Supply (₹ crore)', 'समग्र माँग / पूर्ति (₹ करोड़)'], ['AD needed for full employment', 'पूर्ण रोज़गार के लिए आवश्यक AD'],
        ['(vertical, at Yfe)', '(ऊर्ध्वाधर, Yfe पर)'], ['Deflationary Gap', 'अवस्फीतिक अंतराल'], ['Inflationary Gap', 'स्फीतिक अंतराल'],
        ['cr', 'करोड़'], ['Where AD would meet AS — beyond full employment, unattainable', 'जहाँ AD, AS से मिलती — पूर्ण रोज़गार से आगे, अप्राप्य']
    ],
    'stats-dispersion': [['Range', 'परिसर'], ['Data Point', 'आँकड़ा बिंदु']],
    'stats-index-numbers': [
        ['Base Year Price', 'आधार वर्ष की कीमत'], ['Current Year Price', 'चालू वर्ष की कीमत'], ['Base Year', 'आधार वर्ष'],
        ['Price Index', 'कीमत सूचकांक'], ['Current Index', 'चालू सूचकांक'], ['Commodity', 'वस्तु'], ['Base', 'आधार']
    ],
    'india-human-capital': [
        ['Literacy Rate', 'साक्षरता दर'], ['Year', 'वर्ष'], ['Life Expectancy (yrs)', 'जीवन प्रत्याशा (वर्ष)'],
        ['Years from the start (illustrative projection — not official data)', 'आरंभ से वर्ष (उदाहरणात्मक अनुमान — आधिकारिक आँकड़े नहीं)']
    ],
    'india-employment-structure': [
        ['Agriculture', 'कृषि'], ['Industry', 'उद्योग'], ['Services', 'सेवाएँ'], ['Selected Year', 'चुना गया वर्ष'], ['yrs', ' वर्ष'],
        ['Years of Growth', 'संवृद्धि के वर्ष'], ['Share of Employment', 'रोज़गार में हिस्सा'], ['Informal Sector', 'अनौपचारिक क्षेत्र'],
        ['Formal Sector', 'औपचारिक क्षेत्र'], ['Informal now', 'अभी अनौपचारिक'], ['Formal now', 'अभी औपचारिक'],
        ['Share of Workforce', 'कार्यबल में हिस्सा']
    ],
    'micro-ppf': [['(Efficient Frontier)', '(कुशल सीमा)'], ['Chosen Point', 'चुना गया बिंदु']],
    'micro-indifference-curve': [
        ['Lower IC (attainable, not chosen)', 'निचला IC (प्राप्य, पर चुना नहीं गया)'], ['IC through Equilibrium', 'संतुलन से गुज़रता IC'],
        ['Higher IC (unattainable)', 'ऊँचा IC (अप्राप्य)'], ['Budget Line', 'बजट रेखा'], ['Consumer Equilibrium', 'उपभोक्ता संतुलन']
    ],
    'micro-revenue-producer-equilibrium': [
        ['Producer Equilibrium', 'उत्पादक संतुलन'], ['₹ per unit', '₹ प्रति इकाई'],
        ['No output (MC > MR from the first unit)', 'कोई उत्पादन नहीं (पहली इकाई से ही MC > MR)']
    ],
    'micro-elasticity-supply': [
        ['Market Period Supply', 'बाज़ार अवधि की पूर्ति'], ['Short Run Supply', 'अल्पकालीन पूर्ति'],
        ['Long Run Supply', 'दीर्घकालीन पूर्ति'], ['Quantity Supplied', 'पूर्ति की गई मात्रा']
    ],
    'stats-central-tendency': [['Marks', 'अंक'], ['Student', 'छात्र']],
    'stats-data-organisation': [
        ['Histogram', 'आयतचित्र'], ['Frequency Polygon', 'आवृत्ति बहुभुज'], ['Ogive (Less Than)', 'तोरण (से कम)'],
        ['(read from Ogive)', '(तोरण से पढ़ी गई)'], ['Class Interval (midpoint / upper boundary)', 'वर्ग अंतराल (मध्य बिंदु / ऊपरी सीमा)'],
        ['Frequency', 'आवृत्ति'], ['Cumulative Frequency', 'संचयी आवृत्ति']
    ],
    'stats-data-presentation': [['Bar Diagram', 'दंड आरेख'], ['Pie Diagram', 'वृत्त आरेख'], ['Category', 'श्रेणी']],
    'macro-national-income-methods': [
        ['Value Added Method', 'मूल्य वर्धित विधि'], ['Income Method', 'आय विधि'], ['Expenditure Method', 'व्यय विधि'],
        ['(illustrative split)', '(उदाहरणात्मक विभाजन)'], ['Method', 'विधि']
    ],
    'macro-propensity': [['Fitted Consumption Line', 'आसंजित उपभोग रेखा']],
    'ied-comparison-neighbours': [
        ['GDP Growth Rate', 'GDP संवृद्धि दर'], ['right axis', 'दायाँ अक्ष'], ['Agriculture Share of GDP', 'GDP में कृषि का हिस्सा'],
        ['Country', 'देश'], ['Agriculture Share', 'कृषि का हिस्सा']
    ]
};

const DATALAB_ROWS_HI = {
    'stats-index-numbers': {
        'Rice (per kg)': 'चावल (प्रति kg)', 'Wheat (per kg)': 'गेहूँ (प्रति kg)', 'Milk (per litre)': 'दूध (प्रति लीटर)',
        'Petrol (per litre)': 'पेट्रोल (प्रति लीटर)', 'Sugar (per kg)': 'चीनी (प्रति kg)'
    },
    'stats-central-tendency': {
        Aarav: 'आरव', Diya: 'दीया', Kabir: 'कबीर', Meera: 'मीरा', Ishaan: 'ईशान', Ananya: 'अनन्या', Vihaan: 'विहान', Sara: 'सारा'
    },
    'stats-data-presentation': {
        Food: 'भोजन', Housing: 'आवास', Education: 'शिक्षा', Transport: 'परिवहन', Health: 'स्वास्थ्य', Other: 'अन्य'
    },
    'macro-national-income-methods': { 'Farmer (wheat)': 'किसान (गेहूँ)', 'Flour Mill': 'आटा मिल', Bakery: 'बेकरी' },
    'macro-propensity': { 'Year 1': 'वर्ष 1', 'Year 2': 'वर्ष 2', 'Year 3': 'वर्ष 3', 'Year 4': 'वर्ष 4', 'Year 5': 'वर्ष 5', 'Year 6': 'वर्ष 6' },
    'ied-comparison-neighbours': { India: 'भारत', Pakistan: 'पाकिस्तान', China: 'चीन' }
};

// Readings and formula lines that compute() builds and that had slipped past
// READINGS_I18N_HI. Prepended, because translateReadings() applies pairs in
// order: a whole sentence must be replaced before an older pair rewrites one
// word inside it and leaves the rest of the sentence unmatched.
(function () {
    if (typeof READINGS_I18N_HI === 'undefined') return;
    const EXTRA = {
        'micro-market-structures': [
            ['As N rises, each firm has less market power and undercutting rivals matters more — price is pushed down toward marginal cost. At N=1 (monopoly) price is highest and output lowest; the blue P(N) curve approaches, but never touches, the green MC line — it gets arbitrarily close only in the limit N→∞.',
                'जैसे-जैसे N बढ़ता है, हर फ़र्म की बाज़ार शक्ति घटती है और प्रतिद्वंद्वियों से सस्ता बेचना अधिक मायने रखने लगता है — कीमत सीमांत लागत की ओर नीचे धकेली जाती है। N=1 (एकाधिकार) पर कीमत सबसे ऊँची और उत्पादन सबसे कम है; नीला P(N) वक्र हरी MC रेखा के पास आता जाता है, पर उसे कभी छूता नहीं — वह केवल सीमा N→∞ में मनचाहे ढंग से पास पहुँचता है।']
        ],
        'macro-money-creation': [
            ['The orange cumulative line climbs toward, but never quite reaches, the green Total Money Created line — an infinite number of ever-shrinking rounds sums to a FINITE total.',
                'नारंगी संचयी रेखा हरी "कुल सृजित मुद्रा" रेखा की ओर चढ़ती है, पर उस तक कभी पूरी तरह नहीं पहुँचती — लगातार छोटे होते अनगिनत दौरों का योग एक सीमित (FINITE) कुल बनता है।']
        ],
        'stats-dispersion': [
            ["Range and QD only use the extreme/positional values, so they're quick but ignore most of the data. SD and CV use every value, so they're more reliable — CV is best for comparing the consistency of two datasets with different means.",
                'परिसर और QD केवल चरम/स्थितीय मानों का उपयोग करते हैं, इसलिए वे जल्दी निकल आते हैं पर अधिकांश आँकड़ों को अनदेखा करते हैं। SD और CV हर मान का उपयोग करते हैं, इसलिए अधिक विश्वसनीय हैं — अलग-अलग माध्य वाले दो आँकड़ा-समूहों की स्थिरता की तुलना के लिए CV सबसे अच्छा है।']
        ],
        'micro-consumer-equilibrium': [['Total Utility (your bundle)', 'कुल उपयोगिता (आपका बंडल)']],
        'micro-producer-costs': [
            [' units (AC', ' इकाई (AC'],
            ['(raises AC at every Q, but never changes MC)', '(हर Q पर AC बढ़ाती है, पर MC को कभी नहीं बदलती)'],
            ['Fixed Cost = ₹', 'स्थिर लागत = ₹'],
            ['TP = f(L), other factors fixed', 'TP = f(L), अन्य साधन स्थिर'],
            ['Law of Variable Proportions: MP rises, then falls, then turns negative', 'परिवर्ती अनुपात का नियम: MP पहले बढ़ता है, फिर घटता है, फिर ऋणात्मक हो जाता है']
        ],
        'macro-inflation-gap': [[' cr)', ' करोड़)'], [' cr<', ' करोड़<']],
        'india-employment-structure': [
            ['Structural Transformation: labour shifts from Agriculture → Industry & Services as the economy develops', 'संरचनात्मक परिवर्तन: अर्थव्यवस्था के विकास के साथ श्रम कृषि से उद्योग और सेवाओं की ओर जाता है'],
            ['Informal Sector: no job/social security, often self-employed or casual labour', 'अनौपचारिक क्षेत्र: नौकरी/सामाजिक सुरक्षा नहीं, प्रायः स्व-रोज़गार या अनियत श्रम'],
            ['Formal Sector: registered enterprises, regular wages, legal & social protection', 'औपचारिक क्षेत्र: पंजीकृत उद्यम, नियमित मज़दूरी, कानूनी और सामाजिक सुरक्षा']
        ],
        'micro-elasticity': [
            ['Determinants of Ed: substitutes, necessity vs luxury, share of income, time period', 'Ed के निर्धारक: स्थानापन्न, आवश्यकता बनाम विलासिता, आय में हिस्सा, समयावधि'],
            ['(X and Y are substitutes)', '(X और Y स्थानापन्न हैं)'], ['(normal good)', '(सामान्य वस्तु)'],
            ['Point elasticity:', 'बिंदु लोच:'], ['Demand: ', 'माँग: ']
        ]
    };
    Object.keys(EXTRA).forEach(id => { READINGS_I18N_HI[id] = EXTRA[id].concat(READINGS_I18N_HI[id] || []); });
})();

// The two simulator PREDICT cards (sim.predict), read through hiPath().
(function () {
    if (typeof SIM_I18N_HI === 'undefined') return;
    const PREDICT = {
        'micro-elasticity': {
            prompt: '"निकट स्थानापन्नों की संख्या" खींचने से पहले अनुमान लगाइए: माँग की कीमत लोच का क्या होगा?',
            choices: [{ label: '📈 माँग अधिक लोचदार होती है (|Ed| बढ़ता है)' }, { label: '📉 माँग कम लोचदार होती है (|Ed| घटता है)' }]
        },
        'micro-ppf': {
            prompt: '"सीमा पर" रहते हुए, वस्तु X का उत्पादन बढ़ाने से पहले अनुमान लगाइए: X की एक और इकाई की अवसर लागत का क्या होगा?',
            choices: [{ label: '📈 अवसर लागत बढ़ती है' }, { label: '📉 अवसर लागत घटती है' }]
        }
    };
    Object.keys(PREDICT).forEach(id => { SIM_I18N_HI[id] = SIM_I18N_HI[id] || {}; SIM_I18N_HI[id].predict = PREDICT[id]; });
})();
