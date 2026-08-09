// ══════════════════════════════════════════════════════════════
// Quiz question bank — 4 questions per simulation (18 sims × 4 =
// 72+ questions, matching the "72+ Quiz Qs" figure advertised on
// the home page). Each question ships in both English and Hindi
// so the Quiz engine (js/quiz-engine.js) can render either
// depending on the active language (see js/i18n_engine.js).
//
// Shape:
//   QUIZ_BANK[simId] = {
//     module: 'micro' | 'macro' | 'stats' | 'india',
//     title, titleHi,
//     questions: [
//       { q, qHi, options: [4], optionsHi: [4], correct: 0-3, explain, explainHi }
//     ]
//   }
// ══════════════════════════════════════════════════════════════

const QUIZ_BANK = {

    // ── MICROECONOMICS ──────────────────────────────────────────
    'micro-supply-demand': {
        module: 'micro',
        title: 'Supply & Demand: Every Determinant',
        titleHi: 'माँग व आपूर्ति: हर निर्धारक तत्व',
        questions: [
            {
                q: 'Which of the following is NOT a determinant of demand in this lab?',
                qHi: 'निम्नलिखित में से कौन-सा इस लैब में माँग का निर्धारक तत्व नहीं है?',
                options: ['Consumer Income', 'Price of Substitute Good', 'Number of Firms in the Industry', 'Consumer Tastes & Preferences'],
                optionsHi: ['उपभोक्ता आय', 'स्थानापन्न वस्तु की कीमत', 'उद्योग में फर्मों की संख्या', 'उपभोक्ता की रुचियाँ व पसंद'],
                correct: 2,
                explain: 'Income, price of related goods, and tastes & preferences are named determinants of demand; the number of firms affects market structure/supply, not an individual demand curve.',
                explainHi: 'आय, संबंधित वस्तुओं की कीमत, और रुचियाँ व पसंद — ये माँग के निर्धारक तत्व हैं। फर्मों की संख्या बाज़ार संरचना/आपूर्ति को प्रभावित करती है, माँग वक्र को नहीं।'
            },
            {
                q: 'If the price of a complement good rises, what happens to demand for the good in this lab?',
                qHi: 'यदि किसी पूरक वस्तु की कीमत बढ़ती है, तो इस लैब में मूल वस्तु की माँग पर क्या प्रभाव पड़ता है?',
                options: ['Demand increases (shifts right)', 'Demand decreases (shifts left)', 'Demand is unaffected', 'Supply decreases'],
                optionsHi: ['माँग बढ़ती है (दाईं ओर खिसकती है)', 'माँग घटती है (बाईं ओर खिसकती है)', 'माँग पर कोई प्रभाव नहीं पड़ता', 'आपूर्ति घटती है'],
                correct: 1,
                explain: 'A complement is used together with the good; a pricier complement lowers demand for both, shifting the demand curve left.',
                explainHi: 'पूरक वस्तु मूल वस्तु के साथ प्रयोग होती है; पूरक वस्तु महंगी होने पर दोनों की माँग घट जाती है, जिससे माँग वक्र बाईं ओर खिसकता है।'
            },
            {
                q: 'An improvement in technology has what effect on the supply curve?',
                qHi: 'तकनीक में सुधार का आपूर्ति वक्र पर क्या प्रभाव पड़ता है?',
                options: ['Shifts supply left (decreases)', 'Shifts supply right (increases)', 'Shifts demand right', 'No effect'],
                optionsHi: ['आपूर्ति बाईं ओर खिसकती है (घटती है)', 'आपूर्ति दाईं ओर खिसकती है (बढ़ती है)', 'माँग दाईं ओर खिसकती है', 'कोई प्रभाव नहीं'],
                correct: 1,
                explain: 'Better technology lowers production cost per unit, letting firms supply more at every price — supply increases (shifts right).',
                explainHi: 'बेहतर तकनीक प्रति इकाई उत्पादन लागत घटाती है, जिससे फर्में हर कीमत पर अधिक आपूर्ति कर पाती हैं — आपूर्ति बढ़ती है (दाईं ओर खिसकती है)।'
            },
            {
                q: 'At market equilibrium, which condition holds?',
                qHi: 'बाज़ार संतुलन पर कौन-सी स्थिति सत्य होती है?',
                options: ['Qd > Qs', 'Qd < Qs', 'Qd = Qs', 'Price = 0'],
                optionsHi: ['Qd > Qs', 'Qd < Qs', 'Qd = Qs', 'कीमत = 0'],
                correct: 2,
                explain: 'Equilibrium is where quantity demanded exactly equals quantity supplied — where the demand and supply curves intersect.',
                explainHi: 'संतुलन वह बिंदु है जहाँ माँगी गई मात्रा आपूर्ति की गई मात्रा के बिल्कुल बराबर होती है — यानी माँग और आपूर्ति वक्र का प्रतिच्छेदन बिंदु।'
            }
        ]
    },

    'micro-elasticity': {
        module: 'micro',
        title: 'Elasticity of Demand (Price / Income / Cross)',
        titleHi: 'माँग की लोच (कीमत / आय / वर्ग)',
        questions: [
            {
                q: 'A good with many close substitutes tends to have demand that is:',
                qHi: 'जिस वस्तु के कई निकट स्थानापन्न उपलब्ध हों, उसकी माँग सामान्यतः कैसी होती है?',
                options: ['Perfectly inelastic', 'More elastic', 'More inelastic', 'Unrelated to substitutes'],
                optionsHi: ['पूर्णतः बेलोचदार', 'अधिक लोचदार', 'अधिक बेलोचदार', 'स्थानापन्न से असंबंधित'],
                correct: 1,
                explain: 'More substitutes make it easy for consumers to switch away when price rises, so demand responds more — i.e., is more elastic.',
                explainHi: 'अधिक स्थानापन्न होने पर कीमत बढ़ने पर उपभोक्ता आसानी से दूसरी वस्तु की ओर रुख कर सकते हैं, इसलिए माँग अधिक संवेदनशील यानी अधिक लोचदार होती है।'
            },
            {
                q: 'If Income Elasticity of Demand (Ey) is negative, the good is:',
                qHi: 'यदि माँग की आय-लोच (Ey) ऋणात्मक है, तो वह वस्तु कैसी है?',
                options: ['A normal good', 'A luxury good', 'An inferior good', 'A substitute good'],
                optionsHi: ['सामान्य वस्तु', 'विलासिता की वस्तु', 'निम्नकोटि वस्तु', 'स्थानापन्न वस्तु'],
                correct: 2,
                explain: 'Ey<0 means demand falls as income rises — the definition of an inferior good.',
                explainHi: 'Ey<0 का अर्थ है कि आय बढ़ने पर माँग घटती है — यही निम्नकोटि वस्तु की परिभाषा है।'
            },
            {
                q: 'Cross elasticity of demand (Exy) between tea and coffee (substitutes) is expected to be:',
                qHi: 'चाय और कॉफ़ी (स्थानापन्न वस्तुएँ) के बीच माँग की वर्ग-लोच (Exy) सामान्यतः कैसी होती है?',
                options: ['Positive', 'Negative', 'Zero', 'Undefined'],
                optionsHi: ['धनात्मक', 'ऋणात्मक', 'शून्य', 'अपरिभाषित'],
                correct: 0,
                explain: 'For substitutes, a price rise in one raises demand for the other, so Exy is positive; complements show negative Exy.',
                explainHi: 'स्थानापन्न वस्तुओं में एक की कीमत बढ़ने पर दूसरी की माँग बढ़ती है, इसलिए Exy धनात्मक होता है; पूरक वस्तुओं में Exy ऋणात्मक होता है।'
            },
            {
                q: 'Demand is described as "unit elastic" when:',
                qHi: 'माँग को "एकक लोचदार" (unit elastic) कब कहा जाता है?',
                options: ['|Ed| > 1', '|Ed| < 1', '|Ed| = 1', '|Ed| = 0'],
                optionsHi: ['|Ed| > 1', '|Ed| < 1', '|Ed| = 1', '|Ed| = 0'],
                correct: 2,
                explain: 'Unit elasticity means the percentage change in quantity demanded exactly equals the percentage change in price.',
                explainHi: 'एकक लोच का अर्थ है कि माँगी गई मात्रा में प्रतिशत परिवर्तन कीमत में प्रतिशत परिवर्तन के बिल्कुल बराबर होता है।'
            }
        ]
    },

    'micro-consumer-equilibrium': {
        module: 'micro',
        title: 'Consumer Equilibrium (Marginal Utility)',
        titleHi: 'उपभोक्ता संतुलन (सीमांत उपयोगिता)',
        questions: [
            {
                q: 'According to the Law of Diminishing Marginal Utility:',
                qHi: 'ह्रासमान सीमांत उपयोगिता के नियम के अनुसार:',
                options: ['MU rises as more units are consumed', 'MU falls as more units are consumed', 'MU stays constant', 'TU always falls'],
                optionsHi: ['अधिक इकाइयाँ उपभोग करने पर MU बढ़ती है', 'अधिक इकाइयाँ उपभोग करने पर MU घटती है', 'MU स्थिर रहती है', 'TU हमेशा घटती है'],
                correct: 1,
                explain: 'As successive units of a good are consumed, the extra (marginal) satisfaction from each additional unit diminishes.',
                explainHi: 'किसी वस्तु की क्रमिक इकाइयाँ उपभोग करने पर प्रत्येक अतिरिक्त इकाई से मिलने वाली अतिरिक्त (सीमांत) संतुष्टि घटती जाती है।'
            },
            {
                q: "With a single good and free disposal, a rational consumer's equilibrium is at:",
                qHi: 'एक वस्तु और मुक्त निपटान की स्थिति में, एक विवेकशील उपभोक्ता का संतुलन कहाँ होता है?',
                options: ['MU = Price', 'MU = 0', 'MU = Maximum', 'TU = 0'],
                optionsHi: ['MU = कीमत', 'MU = 0', 'MU = अधिकतम', 'TU = 0'],
                correct: 1,
                explain: 'The consumer keeps consuming as long as MU is positive, stopping exactly where MU=0 — the point of maximum Total Utility.',
                explainHi: 'जब तक MU धनात्मक रहती है, उपभोक्ता उपभोग करता रहता है और ठीक MU=0 पर रुकता है — यही कुल उपयोगिता के अधिकतम होने का बिंदु है।'
            },
            {
                q: 'When choosing between multiple goods, the consumer maximizes satisfaction by equalizing:',
                qHi: 'कई वस्तुओं के बीच चयन करते समय, उपभोक्ता संतुष्टि को अधिकतम करने के लिए किसे बराबर करता है?',
                options: ['Price across goods', 'Total Utility across goods', 'Marginal Utility per Rupee (MU/P) across goods', 'Quantity consumed of each good'],
                optionsHi: ['सभी वस्तुओं की कीमत', 'सभी वस्तुओं की कुल उपयोगिता', 'सभी वस्तुओं की प्रति रुपया सीमांत उपयोगिता (MU/P)', 'हर वस्तु की उपभोग मात्रा'],
                correct: 2,
                explain: 'The consumer allocates limited income to get the most satisfaction per rupee spent — equalizing MU/P across all goods purchased.',
                explainHi: 'उपभोक्ता सीमित आय को इस प्रकार बाँटता है कि प्रति रुपया अधिकतम संतुष्टि मिले — अर्थात सभी खरीदी गई वस्तुओं की MU/P बराबर हो जाए।'
            },
            {
                q: 'Total Utility (TU) is related to Marginal Utility (MU) as:',
                qHi: 'कुल उपयोगिता (TU) का सीमांत उपयोगिता (MU) से क्या संबंध है?',
                options: ['TU = MU × Price', 'TU = Σ MU', 'TU = MU / Q', 'TU is unrelated to MU'],
                optionsHi: ['TU = MU × कीमत', 'TU = Σ MU', 'TU = MU / Q', 'TU का MU से कोई संबंध नहीं'],
                correct: 1,
                explain: 'Total Utility is the sum of the marginal utilities of all units consumed.',
                explainHi: 'कुल उपयोगिता, उपभोग की गई सभी इकाइयों की सीमांत उपयोगिताओं का योग होती है।'
            }
        ]
    },

    'micro-producer-costs': {
        module: 'micro',
        title: 'Producer Behaviour: Product & Cost Curves',
        titleHi: 'उत्पादक व्यवहार: उत्पाद व लागत वक्र',
        questions: [
            {
                q: 'In Stage II of the Law of Variable Proportions:',
                qHi: 'परिवर्तनशील अनुपात के नियम की द्वितीय अवस्था में:',
                options: ['MP is negative', 'MP is positive but falling', 'MP is rising', 'TP is falling'],
                optionsHi: ['MP ऋणात्मक होती है', 'MP धनात्मक परंतु घटती हुई होती है', 'MP बढ़ती है', 'TP घटती है'],
                correct: 1,
                explain: 'Stage II shows diminishing (but still positive) marginal returns — the normal, rational stage of production.',
                explainHi: 'द्वितीय अवस्था में सीमांत प्रतिफल घटता है (परंतु धनात्मक रहता है) — यह उत्पादन की सामान्य, विवेकपूर्ण अवस्था है।'
            },
            {
                q: 'The Marginal Cost (MC) curve intersects the Average Cost (AC) curve:',
                qHi: 'सीमांत लागत (MC) वक्र औसत लागत (AC) वक्र को कहाँ काटता है?',
                options: ["At AC's maximum point", "At AC's minimum point", 'Only at Q=0', 'They never intersect'],
                optionsHi: ['AC के अधिकतम बिंदु पर', 'AC के न्यूनतम बिंदु पर', 'केवल Q=0 पर', 'वे कभी नहीं कटते'],
                correct: 1,
                explain: "MC cuts AC exactly at AC's minimum — while MC < AC, AC is still falling; once MC > AC, AC starts rising.",
                explainHi: 'MC, AC को ठीक उसके न्यूनतम बिंदु पर काटती है — जब तक MC < AC है, AC घटती रहती है; MC > AC होते ही AC बढ़ने लगती है।'
            },
            {
                q: 'Fixed Cost affects which of the following?',
                qHi: 'स्थिर लागत निम्नलिखित में से किसे प्रभावित करती है?',
                options: ['It raises AC at every output level but never changes MC', 'It changes MC but not AC', 'It has no effect on any cost curve', 'It only affects Total Product'],
                optionsHi: ['यह हर उत्पादन स्तर पर AC को बढ़ाती है परंतु MC को कभी नहीं बदलती', 'यह MC को बदलती है परंतु AC को नहीं', 'इसका किसी लागत वक्र पर कोई प्रभाव नहीं पड़ता', 'यह केवल कुल उत्पाद को प्रभावित करती है'],
                correct: 0,
                explain: 'Fixed cost is spread over output in AC, but since MC is the change in TC for the last unit, a constant FC drops out of MC entirely.',
                explainHi: 'स्थिर लागत AC में उत्पादन पर बँट जाती है, परंतु चूँकि MC अंतिम इकाई से TC में हुए परिवर्तन को दर्शाती है, एक स्थिर FC MC को बिल्कुल प्रभावित नहीं करती।'
            },
            {
                q: 'When does Marginal Product (MP) become negative?',
                qHi: 'सीमांत उत्पाद (MP) ऋणात्मक कब होती है?',
                options: ['Stage I', 'Stage II', 'Stage III', 'Never'],
                optionsHi: ['प्रथम अवस्था', 'द्वितीय अवस्था', 'तृतीय अवस्था', 'कभी नहीं'],
                correct: 2,
                explain: 'In Stage III, too much of the variable factor is applied to fixed factors, so an extra unit actually reduces Total Product.',
                explainHi: 'तृतीय अवस्था में स्थिर साधनों पर परिवर्तनशील साधन की अत्यधिक मात्रा लगाई जाती है, जिससे एक अतिरिक्त इकाई वास्तव में कुल उत्पाद को घटा देती है।'
            }
        ]
    },

    'micro-price-controls': {
        module: 'micro',
        title: 'Price Ceiling & Price Floor',
        titleHi: 'मूल्य उच्चतम सीमा व मूल्य निम्नतम सीमा',
        questions: [
            {
                q: 'A price ceiling set below equilibrium price causes:',
                qHi: 'संतुलन कीमत से नीचे निर्धारित मूल्य उच्चतम सीमा किसका कारण बनती है?',
                options: ['A surplus', 'A shortage', 'No change in quantity', 'Equilibrium is unaffected'],
                optionsHi: ['अधिशेष', 'कमी (अभाव)', 'मात्रा में कोई परिवर्तन नहीं', 'संतुलन अप्रभावित रहता है'],
                correct: 1,
                explain: 'At an artificially low price, quantity demanded exceeds quantity supplied, creating excess demand — a shortage.',
                explainHi: 'कृत्रिम रूप से कम कीमत पर माँगी गई मात्रा आपूर्ति की गई मात्रा से अधिक हो जाती है, जिससे अतिरिक्त माँग यानी कमी उत्पन्न होती है।'
            },
            {
                q: 'Minimum Support Price (MSP) for crops is an example of:',
                qHi: 'फसलों के लिए न्यूनतम समर्थन मूल्य (MSP) किसका उदाहरण है?',
                options: ['A price ceiling', 'A price floor', 'A tax', 'A subsidy'],
                optionsHi: ['मूल्य उच्चतम सीमा', 'मूल्य निम्नतम सीमा', 'कर', 'सब्सिडी'],
                correct: 1,
                explain: "MSP guarantees farmers a price at or above the free-market level to protect their income — a classic price floor.",
                explainHi: 'MSP किसानों की आय की सुरक्षा हेतु उन्हें मुक्त बाज़ार स्तर पर या उससे ऊपर मूल्य की गारंटी देता है — यह मूल्य निम्नतम सीमा का सटीक उदाहरण है।'
            },
            {
                q: 'A price floor set above equilibrium typically results in:',
                qHi: 'संतुलन से ऊपर निर्धारित मूल्य निम्नतम सीमा सामान्यतः किसका परिणाम देती है?',
                options: ['A shortage', 'A surplus', 'A lower quantity supplied', 'No effect on the market'],
                optionsHi: ['कमी', 'अधिशेष', 'आपूर्ति की मात्रा में कमी', 'बाज़ार पर कोई प्रभाव नहीं'],
                correct: 1,
                explain: 'At a price above equilibrium, quantity supplied exceeds quantity demanded, leaving unsold output — a surplus.',
                explainHi: 'संतुलन से ऊपर की कीमत पर आपूर्ति की गई मात्रा माँगी गई मात्रा से अधिक हो जाती है, जिससे उत्पादन अनबिका रह जाता है — यह अधिशेष है।'
            },
            {
                q: 'Rent control is an example of which type of price control?',
                qHi: 'किराया नियंत्रण किस प्रकार के मूल्य नियंत्रण का उदाहरण है?',
                options: ['Price floor', 'Price ceiling', 'Import duty', 'Export subsidy'],
                optionsHi: ['मूल्य निम्नतम सीमा', 'मूल्य उच्चतम सीमा', 'आयात शुल्क', 'निर्यात सब्सिडी'],
                correct: 1,
                explain: 'Rent control caps rent below the free-market rate to help tenants — a price ceiling, which can cause a housing shortage.',
                explainHi: 'किराया नियंत्रण किरायेदारों की सहायता हेतु किराए को मुक्त बाज़ार दर से नीचे सीमित करता है — यह मूल्य उच्चतम सीमा है, जो आवास की कमी उत्पन्न कर सकती है।'
            }
        ]
    },

    'micro-market-structures': {
        module: 'micro',
        title: 'Forms of Market: Monopoly → Oligopoly → Perfect Competition',
        titleHi: 'बाज़ार के स्वरूप: एकाधिकार → अल्पाधिकार → पूर्ण प्रतिस्पर्धा',
        questions: [
            {
                q: 'How many firms exist in a monopoly?',
                qHi: 'एकाधिकार में कितनी फर्में होती हैं?',
                options: ['One', 'A few', 'Many with differentiation', 'Very many, price-takers'],
                optionsHi: ['एक', 'कुछ', 'विभेदीकरण के साथ कई', 'बहुत अधिक, मूल्य-स्वीकर्ता'],
                correct: 0,
                explain: 'Monopoly means a single firm supplies the entire market with no close substitutes.',
                explainHi: 'एकाधिकार का अर्थ है कि पूरे बाज़ार को एक ही फर्म आपूर्ति करती है, जिसका कोई निकट स्थानापन्न नहीं होता।'
            },
            {
                q: 'Perfect competition is characterized by:',
                qHi: 'पूर्ण प्रतिस्पर्धा की मुख्य विशेषता क्या है?',
                options: ['One large firm', 'A few large firms', 'Very many firms, each a price-taker', 'A few firms with product differentiation'],
                optionsHi: ['एक बड़ी फर्म', 'कुछ बड़ी फर्में', 'बहुत सारी फर्में, हर एक मूल्य-स्वीकर्ता', 'उत्पाद विभेदीकरण वाली कुछ फर्में'],
                correct: 2,
                explain: 'In perfect competition there are so many small firms that none can influence price — each firm is a price-taker.',
                explainHi: 'पूर्ण प्रतिस्पर्धा में इतनी अधिक छोटी फर्में होती हैं कि कोई भी कीमत को प्रभावित नहीं कर सकती — हर फर्म मूल्य-स्वीकर्ता होती है।'
            },
            {
                q: 'In the Cournot model used in this lab, as the number of firms (N) increases, price moves toward:',
                qHi: 'इस लैब में प्रयुक्त कूर्नो मॉडल में, फर्मों की संख्या (N) बढ़ने पर कीमत किसकी ओर बढ़ती है?',
                options: ['Zero', 'Marginal Cost', 'Infinity', 'The monopoly price'],
                optionsHi: ['शून्य', 'सीमांत लागत', 'अनंत', 'एकाधिकार कीमत'],
                correct: 1,
                explain: 'As more firms compete, undercutting rivals matters more and price is pushed down toward marginal cost.',
                explainHi: 'जैसे-जैसे अधिक फर्में प्रतिस्पर्धा करती हैं, प्रतिद्वंद्वियों से कम कीमत रखना अधिक मायने रखता है, और कीमत सीमांत लागत की ओर नीचे धकेली जाती है।'
            },
            {
                q: 'Oligopoly is best described as a market with:',
                qHi: 'अल्पाधिकार को सबसे उपयुक्त रूप से किस प्रकार वर्णित किया जाता है?',
                options: ['A single seller', 'A few dominant firms', 'Countless small sellers', 'No sellers'],
                optionsHi: ['एक अकेला विक्रेता', 'कुछ प्रभावी फर्में', 'अनगिनत छोटे विक्रेता', 'कोई विक्रेता नहीं'],
                correct: 1,
                explain: 'Oligopoly features a small number of firms, each large enough that its decisions affect rivals and the market.',
                explainHi: 'अल्पाधिकार में फर्मों की संख्या कम होती है, और हर फर्म इतनी बड़ी होती है कि उसके निर्णय प्रतिद्वंद्वियों व बाज़ार को प्रभावित करते हैं।'
            }
        ]
    },

    // ── MACROECONOMICS ──────────────────────────────────────────
    'macro-gdp': {
        module: 'macro',
        title: 'GDP & Circular Flow (Real Flow vs Money Flow)',
        titleHi: 'जीडीपी व चक्रीय प्रवाह (वास्तविक प्रवाह बनाम मुद्रा प्रवाह)',
        questions: [
            {
                q: 'In the circular flow, "Factor Services" flow from:',
                qHi: 'चक्रीय प्रवाह में "साधन सेवाएँ" कहाँ से कहाँ प्रवाहित होती हैं?',
                options: ['Firms to Households', 'Households to Firms', 'Government to Firms', 'Foreign Sector to Households'],
                optionsHi: ['फर्मों से परिवारों की ओर', 'परिवारों से फर्मों की ओर', 'सरकार से फर्मों की ओर', 'विदेशी क्षेत्र से परिवारों की ओर'],
                correct: 1,
                explain: 'Households own factors of production and supply factor services to firms; firms pay factor payments back to households.',
                explainHi: 'परिवार उत्पादन के साधनों के स्वामी होते हैं और फर्मों को साधन सेवाएँ प्रदान करते हैं; बदले में फर्में परिवारों को साधन भुगतान करती हैं।'
            },
            {
                q: 'GDP measured by the expenditure method is:',
                qHi: 'व्यय विधि से मापा गया जीडीपी क्या है?',
                options: ['C + I + G + (X−M)', 'C − I + G', 'Wages + Rent + Interest + Profit only', 'Only Government spending'],
                optionsHi: ['C + I + G + (X−M)', 'C − I + G', 'केवल मजदूरी + लगान + ब्याज + लाभ', 'केवल सरकारी व्यय'],
                correct: 0,
                explain: 'The expenditure method sums Consumption, Investment, Government spending, and Net Exports.',
                explainHi: 'व्यय विधि उपभोग, निवेश, सरकारी व्यय और शुद्ध निर्यात को जोड़कर जीडीपी निकालती है।'
            },
            {
                q: 'NDP differs from GDP because NDP:',
                qHi: 'NDP, GDP से किस कारण भिन्न है?',
                options: ['Adds Net Factor Income from Abroad', 'Subtracts Depreciation', 'Adds Depreciation', 'Subtracts Taxes only'],
                optionsHi: ['विदेश से शुद्ध साधन आय जोड़ता है', 'मूल्यह्रास घटाता है', 'मूल्यह्रास जोड़ता है', 'केवल कर घटाता है'],
                correct: 1,
                explain: '"Net" domestic product subtracts depreciation from Gross Domestic Product, reflecting only genuinely new output.',
                explainHi: '"शुद्ध" घरेलू उत्पाद, सकल घरेलू उत्पाद में से मूल्यह्रास घटा देता है, जिससे केवल वास्तविक नया उत्पादन दिखाई देता है।'
            },
            {
                q: 'In the circular flow, which of these is a "leakage"?',
                qHi: 'चक्रीय प्रवाह में इनमें से कौन-सा "रिसाव" (leakage) है?',
                options: ['Government Spending (G)', 'Exports (X)', 'Taxes (T)', 'Investment (I)'],
                optionsHi: ['सरकारी व्यय (G)', 'निर्यात (X)', 'कर (T)', 'निवेश (I)'],
                correct: 2,
                explain: 'Taxes and imports withdraw money from the circular flow (leakages); government spending and exports are injections into it.',
                explainHi: 'कर और आयात चक्रीय प्रवाह से धन निकालते हैं (रिसाव); जबकि सरकारी व्यय और निर्यात इसमें धन जोड़ते हैं (अंतःक्षेप)।'
            }
        ]
    },

    'macro-multiplier': {
        module: 'macro',
        title: 'The Multiplier Effect: Investment, Government Spending & Tax',
        titleHi: 'गुणक प्रभाव: निवेश, सरकारी व्यय व कर',
        questions: [
            {
                q: 'The formula for the spending (investment/government) multiplier is:',
                qHi: 'व्यय (निवेश/सरकारी) गुणक का सूत्र क्या है?',
                options: ['k = 1/(1−MPC)', 'k = MPC/(1−MPC)', 'k = 1−MPC', 'k = 1/MPC'],
                optionsHi: ['k = 1/(1−MPC)', 'k = MPC/(1−MPC)', 'k = 1−MPC', 'k = 1/MPC'],
                correct: 0,
                explain: 'k = 1/(1−MPC) = 1/MPS; it applies equally to ΔI and ΔG since both are direct spending injections.',
                explainHi: 'k = 1/(1−MPC) = 1/MPS; यह ΔI और ΔG दोनों पर समान रूप से लागू होता है क्योंकि दोनों प्रत्यक्ष व्यय अंतःक्षेप हैं।'
            },
            {
                q: 'The Tax Multiplier is:',
                qHi: 'कर गुणक कैसा होता है?',
                options: ['Larger than the spending multiplier and same sign', 'Smaller in magnitude than the spending multiplier and opposite sign', 'Always positive and larger', 'Always equal to zero'],
                optionsHi: ['व्यय गुणक से बड़ा और समान चिह्न वाला', 'व्यय गुणक से परिमाण में छोटा और विपरीत चिह्न वाला', 'हमेशा धनात्मक और बड़ा', 'हमेशा शून्य के बराबर'],
                correct: 1,
                explain: 'kt = −MPC/(1−MPC); a tax rise reduces disposable income, and only a fraction (MPC) of that gets cut from spending.',
                explainHi: 'kt = −MPC/(1−MPC); कर बढ़ने से प्रयोज्य आय घटती है, और उसका केवल एक अंश (MPC) ही व्यय से कम होता है।'
            },
            {
                q: 'A higher MPC (Marginal Propensity to Consume) results in:',
                qHi: 'उच्च MPC (उपभोग की सीमांत प्रवृत्ति) का क्या परिणाम होता है?',
                options: ['A smaller multiplier', 'A larger multiplier', 'No change in the multiplier', 'A negative multiplier'],
                optionsHi: ['एक छोटा गुणक', 'एक बड़ा गुणक', 'गुणक में कोई परिवर्तन नहीं', 'एक ऋणात्मक गुणक'],
                correct: 1,
                explain: 'A higher MPC means more of each extra rupee of income gets re-spent in the next round, so the multiplier k = 1/(1−MPC) grows larger.',
                explainHi: 'उच्च MPC का अर्थ है कि आय के हर अतिरिक्त रुपये का बड़ा हिस्सा अगले चरण में फिर खर्च होता है, इसलिए गुणक k = 1/(1−MPC) बड़ा हो जाता है।'
            },
            {
                q: 'The multiplier effect works because:',
                qHi: 'गुणक प्रभाव किस कारण कार्य करता है?',
                options: ["One person's spending is another person's income", 'Prices always rise', 'Government always increases taxes', 'Firms never save'],
                optionsHi: ['एक व्यक्ति का व्यय दूसरे व्यक्ति की आय होता है', 'कीमतें हमेशा बढ़ती हैं', 'सरकार हमेशा कर बढ़ाती है', 'फर्में कभी बचत नहीं करतीं'],
                correct: 0,
                explain: 'Every rupee spent becomes income for someone else, who then re-spends part of it (MPC), triggering successive rounds of spending.',
                explainHi: 'खर्च किया गया हर रुपया किसी और की आय बन जाता है, जो उसका एक हिस्सा (MPC) फिर से खर्च करता है — इस तरह व्यय के क्रमिक चरण चलते हैं।'
            }
        ]
    },

    'macro-money-creation': {
        module: 'macro',
        title: 'Credit / Money Creation',
        titleHi: 'साख / मुद्रा निर्माण',
        questions: [
            {
                q: 'The Credit/Money Multiplier is calculated as:',
                qHi: 'साख/मुद्रा गुणक की गणना कैसे होती है?',
                options: ['LRR', '1/LRR', '1 − LRR', 'LRR × Deposit'],
                optionsHi: ['LRR', '1/LRR', '1 − LRR', 'LRR × जमा राशि'],
                correct: 1,
                explain: 'The money multiplier equals 1 divided by the Legal Reserve Ratio (LRR) — a lower LRR means a larger multiplier.',
                explainHi: 'मुद्रा गुणक, वैधानिक आरक्षित अनुपात (LRR) से 1 को भाग देने पर प्राप्त होता है — LRR जितना कम होगा, गुणक उतना बड़ा होगा।'
            },
            {
                q: 'Which RBI tool directly changes how much of a deposit a bank must hold back as reserves?',
                qHi: 'RBI का कौन-सा साधन सीधे यह तय करता है कि बैंक को जमा राशि का कितना भाग आरक्षित रखना है?',
                options: ['Repo Rate', 'CRR (Cash Reserve Ratio)', 'Open Market Operations', 'Bank Rate'],
                optionsHi: ['रेपो दर', 'CRR (नकद आरक्षित अनुपात)', 'खुले बाज़ार का प्रचालन', 'बैंक दर'],
                correct: 1,
                explain: 'CRR (along with SLR) is a legal reserve requirement set directly by the RBI, modeled in this lab as the Legal Reserve Ratio.',
                explainHi: 'CRR (SLR के साथ) RBI द्वारा सीधे निर्धारित एक वैधानिक आरक्षित आवश्यकता है, जिसे इस लैब में वैधानिक आरक्षित अनुपात के रूप में दिखाया गया है।'
            },
            {
                q: 'If the Legal Reserve Ratio is lowered, total money created in the economy:',
                qHi: 'यदि वैधानिक आरक्षित अनुपात घटाया जाए, तो अर्थव्यवस्था में कुल निर्मित मुद्रा पर क्या प्रभाव पड़ता है?',
                options: ['Decreases', 'Increases', 'Stays the same', 'Becomes zero'],
                optionsHi: ['घटती है', 'बढ़ती है', 'वही रहती है', 'शून्य हो जाती है'],
                correct: 1,
                explain: 'A lower reserve ratio means banks lend out a larger share of every deposit, raising the total money multiplier.',
                explainHi: 'कम आरक्षित अनुपात का अर्थ है कि बैंक हर जमा राशि का बड़ा हिस्सा उधार देते हैं, जिससे कुल मुद्रा गुणक बढ़ जाता है।'
            },
            {
                q: 'Open Market Operations (OMO) refer to:',
                qHi: 'खुले बाज़ार का प्रचालन (OMO) किसे कहते हैं?',
                options: ['The RBI setting the CRR', 'The RBI buying/selling government securities', 'Banks lending to each other', "The government's budget deficit"],
                optionsHi: ['RBI द्वारा CRR निर्धारित करना', 'RBI द्वारा सरकारी प्रतिभूतियों का क्रय/विक्रय', 'बैंकों का एक-दूसरे को उधार देना', 'सरकार का बजट घाटा'],
                correct: 1,
                explain: 'OMO is the RBI directly adding or removing money from circulation by trading government securities in the open market.',
                explainHi: 'OMO के अंतर्गत RBI खुले बाज़ार में सरकारी प्रतिभूतियों का व्यापार करके सीधे प्रचलन में मुद्रा जोड़ता या घटाता है।'
            }
        ]
    },

    'macro-govt-budget': {
        module: 'macro',
        title: 'Government Budget',
        titleHi: 'सरकारी बजट',
        questions: [
            {
                q: 'Revenue Deficit is defined as:',
                qHi: 'राजस्व घाटे की परिभाषा क्या है?',
                options: ['Revenue Expenditure − Revenue Receipts', 'Total Expenditure − Total Receipts', 'Fiscal Deficit − Interest Payments', 'Capital Expenditure − Capital Receipts'],
                optionsHi: ['राजस्व व्यय − राजस्व प्राप्तियाँ', 'कुल व्यय − कुल प्राप्तियाँ', 'राजकोषीय घाटा − ब्याज भुगतान', 'पूँजीगत व्यय − पूँजीगत प्राप्तियाँ'],
                correct: 0,
                explain: 'Revenue Deficit measures the shortfall of routine (revenue) receipts relative to routine (revenue) expenditure.',
                explainHi: 'राजस्व घाटा यह मापता है कि नियमित (राजस्व) प्राप्तियाँ नियमित (राजस्व) व्यय की तुलना में कितनी कम हैं।'
            },
            {
                q: 'Fiscal Deficit represents:',
                qHi: 'राजकोषीय घाटा किसे दर्शाता है?',
                options: ['Only interest owed on past loans', "The government's total borrowing requirement", 'Only revenue-account imbalance', 'Capital receipts minus capital expenditure'],
                optionsHi: ['केवल पिछले ऋणों पर बकाया ब्याज', 'सरकार की कुल उधार आवश्यकता', 'केवल राजस्व खाते का असंतुलन', 'पूँजीगत प्राप्तियाँ घटा पूँजीगत व्यय'],
                correct: 1,
                explain: 'Fiscal Deficit = Total Expenditure − Total Receipts (excluding borrowings) — it shows how much the government must borrow.',
                explainHi: 'राजकोषीय घाटा = कुल व्यय − कुल प्राप्तियाँ (उधार को छोड़कर) — यह दर्शाता है कि सरकार को कितना उधार लेना पड़ेगा।'
            },
            {
                q: 'Primary Deficit is calculated as:',
                qHi: 'प्राथमिक घाटे की गणना कैसे होती है?',
                options: ['Fiscal Deficit + Interest Payments', 'Fiscal Deficit − Interest Payments', 'Revenue Deficit − Interest Payments', 'Fiscal Deficit × Interest Rate'],
                optionsHi: ['राजकोषीय घाटा + ब्याज भुगतान', 'राजकोषीय घाटा − ब्याज भुगतान', 'राजस्व घाटा − ब्याज भुगतान', 'राजकोषीय घाटा × ब्याज दर'],
                correct: 1,
                explain: "Primary Deficit excludes interest owed on past borrowing, isolating the deficit caused by this year's own decisions.",
                explainHi: 'प्राथमिक घाटा पिछले उधार पर बकाया ब्याज को अलग कर देता है, जिससे केवल इस वर्ष के निर्णयों से उत्पन्न घाटा दिखता है।'
            },
            {
                q: 'If Primary Deficit is zero, it means:',
                qHi: 'यदि प्राथमिक घाटा शून्य है, तो इसका क्या अर्थ है?',
                options: ['The government has no debt', 'The Fiscal Deficit is entirely explained by interest on past borrowing', 'Revenue Receipts exceed Revenue Expenditure', 'There is no borrowing at all'],
                optionsHi: ['सरकार पर कोई ऋण नहीं है', 'राजकोषीय घाटा पूरी तरह पिछले उधार के ब्याज से स्पष्ट होता है', 'राजस्व प्राप्तियाँ राजस्व व्यय से अधिक हैं', 'कोई उधार ही नहीं लिया गया'],
                correct: 1,
                explain: "A zero Primary Deficit means this year's fiscal deficit is made up entirely of interest on old debt, not fresh overspending.",
                explainHi: 'शून्य प्राथमिक घाटे का अर्थ है कि इस वर्ष का राजकोषीय घाटा पूरी तरह पुराने ऋण के ब्याज से बना है, नए अतिरिक्त व्यय से नहीं।'
            }
        ]
    },

    'macro-forex': {
        module: 'macro',
        title: 'Balance of Payments & Exchange Rate',
        titleHi: 'भुगतान संतुलन व विनिमय दर',
        questions: [
            {
                q: 'In a floating exchange rate system, a rise in imports:',
                qHi: 'प्लवमान (floating) विनिमय दर प्रणाली में, आयात बढ़ने पर क्या होता है?',
                options: ['Increases supply of dollars', 'Increases demand for dollars', 'Has no effect on the exchange rate', 'Decreases demand for dollars'],
                optionsHi: ['डॉलर की आपूर्ति बढ़ती है', 'डॉलर की माँग बढ़ती है', 'विनिमय दर पर कोई प्रभाव नहीं पड़ता', 'डॉलर की माँग घटती है'],
                correct: 1,
                explain: 'Importers need foreign currency to pay for goods from abroad, so higher imports raise demand for dollars.',
                explainHi: 'आयातकों को विदेश से वस्तुएँ खरीदने हेतु विदेशी मुद्रा चाहिए, इसलिए आयात बढ़ने पर डॉलर की माँग बढ़ जाती है।'
            },
            {
                q: 'An increase in exports leads to:',
                qHi: 'निर्यात बढ़ने पर क्या परिणाम होता है?',
                options: ['Increased supply of dollars, rupee tends to appreciate', 'Increased demand for dollars, rupee tends to depreciate', 'No change in the exchange rate', 'A rise in the fiscal deficit'],
                optionsHi: ['डॉलर की आपूर्ति बढ़ती है, रुपये का मूल्य बढ़ता है', 'डॉलर की माँग बढ़ती है, रुपये का मूल्य घटता है', 'विनिमय दर में कोई परिवर्तन नहीं', 'राजकोषीय घाटे में वृद्धि'],
                correct: 0,
                explain: 'Exporters earn and sell foreign currency for rupees, raising the supply of dollars — pushing the rupee to appreciate.',
                explainHi: 'निर्यातक विदेशी मुद्रा कमाकर उसे रुपयों में बदलते हैं, जिससे डॉलर की आपूर्ति बढ़ती है — इससे रुपये का मूल्य बढ़ता है।'
            },
            {
                q: 'Capital Outflow (Indians investing abroad) affects the forex market by:',
                qHi: 'पूँजी बहिर्वाह (भारतीयों का विदेश में निवेश) विदेशी मुद्रा बाज़ार को कैसे प्रभावित करता है?',
                options: ['Raising supply of dollars', 'Raising demand for dollars', 'Only affecting the Current Account', 'Having no effect'],
                optionsHi: ['डॉलर की आपूर्ति बढ़ाकर', 'डॉलर की माँग बढ़ाकर', 'केवल चालू खाते को प्रभावित करके', 'कोई प्रभाव न डालकर'],
                correct: 1,
                explain: 'Investing abroad requires buying foreign currency, so Capital Outflow raises demand for dollars.',
                explainHi: 'विदेश में निवेश हेतु विदेशी मुद्रा खरीदनी पड़ती है, इसलिए पूँजी बहिर्वाह से डॉलर की माँग बढ़ती है।'
            },
            {
                q: "India's actual exchange rate regime is best described as:",
                qHi: 'भारत की वास्तविक विनिमय दर प्रणाली को किस रूप में सबसे उपयुक्त वर्णित किया जाता है?',
                options: ['A fully fixed exchange rate', 'A fully floating exchange rate', 'Managed floating', 'Barter exchange'],
                optionsHi: ['पूर्णतः स्थिर विनिमय दर', 'पूर्णतः प्लवमान विनिमय दर', 'प्रबंधित प्लवन (managed floating)', 'वस्तु-विनिमय'],
                correct: 2,
                explain: "India's rupee mostly floats with market forces, but the RBI occasionally intervenes to smooth excessive volatility.",
                explainHi: 'भारत का रुपया अधिकांशतः बाज़ार शक्तियों के अनुसार चलता है, परंतु RBI कभी-कभी अत्यधिक उतार-चढ़ाव को नियंत्रित करने हेतु हस्तक्षेप करता है।'
            }
        ]
    },

    'macro-inflation-gap': {
        module: 'macro',
        title: 'Inflationary & Deflationary Gap',
        titleHi: 'स्फीतिक व अपस्फीतिक अंतराल',
        questions: [
            {
                q: 'An inflationary gap occurs when:',
                qHi: 'स्फीतिक अंतराल कब उत्पन्न होता है?',
                options: ['Equilibrium income equals full-employment income', 'Equilibrium income exceeds full-employment income', 'Equilibrium income is below full-employment income', 'Aggregate Demand is zero'],
                optionsHi: ['संतुलन आय पूर्ण रोजगार आय के बराबर हो', 'संतुलन आय पूर्ण रोजगार आय से अधिक हो', 'संतुलन आय पूर्ण रोजगार आय से कम हो', 'सकल माँग शून्य हो'],
                correct: 1,
                explain: 'When equilibrium national income exceeds the full-employment level, excess demand pushes prices up — an inflationary gap.',
                explainHi: 'जब संतुलन राष्ट्रीय आय पूर्ण रोजगार स्तर से अधिक हो जाती है, तो अतिरिक्त माँग कीमतों को ऊपर धकेलती है — यही स्फीतिक अंतराल है।'
            },
            {
                q: 'Aggregate Demand (AD) in this lab is the sum of:',
                qHi: 'इस लैब में सकल माँग (AD) किन घटकों का योग है?',
                options: ['C + I + G + (X−M)', 'C + I only', 'G + T', 'MPC + MPS'],
                optionsHi: ['C + I + G + (X−M)', 'केवल C + I', 'G + T', 'MPC + MPS'],
                correct: 0,
                explain: 'AD sums Autonomous Consumption, Investment, Government Spending, and Net Exports — the four named components.',
                explainHi: 'AD, स्वायत्त उपभोग, निवेश, सरकारी व्यय, और शुद्ध निर्यात — इन चार घटकों का योग है।'
            },
            {
                q: 'A deflationary gap can be closed by:',
                qHi: 'अपस्फीतिक अंतराल को कैसे दूर किया जा सकता है?',
                options: ['Cutting government spending', 'Raising taxes', 'Expansionary policy such as raising G or cutting taxes', 'Doing nothing, as it never matters'],
                optionsHi: ['सरकारी व्यय घटाकर', 'कर बढ़ाकर', 'विस्तारवादी नीति द्वारा, जैसे G बढ़ाना या कर घटाना', 'कुछ न करके, क्योंकि यह कभी मायने नहीं रखता'],
                correct: 2,
                explain: 'A deflationary gap means demand falls short of full-employment output; expansionary fiscal policy raises AD toward Yfe.',
                explainHi: 'अपस्फीतिक अंतराल का अर्थ है कि माँग पूर्ण रोजगार उत्पादन से कम है; विस्तारवादी राजकोषीय नीति AD को Yfe की ओर बढ़ाती है।'
            },
            {
                q: 'To close an inflationary gap, appropriate policy would be:',
                qHi: 'स्फीतिक अंतराल को दूर करने हेतु उपयुक्त नीति क्या होगी?',
                options: ['Contractionary policy (raise taxes, cut G)', 'Expansionary policy (raise G, cut taxes)', 'Devaluing the currency', 'Lowering the CRR'],
                optionsHi: ['संकुचनकारी नीति (कर बढ़ाना, G घटाना)', 'विस्तारवादी नीति (G बढ़ाना, कर घटाना)', 'मुद्रा का अवमूल्यन', 'CRR घटाना'],
                correct: 0,
                explain: 'An inflationary gap reflects excess demand; contractionary policy reduces AD back toward the full-employment level.',
                explainHi: 'स्फीतिक अंतराल अतिरिक्त माँग को दर्शाता है; संकुचनकारी नीति AD को पूर्ण रोजगार स्तर की ओर वापस घटाती है।'
            }
        ]
    },

    // ── STATISTICS FOR ECONOMICS ────────────────────────────────
    'stats-correlation': {
        module: 'stats',
        title: 'Correlation & Scatter',
        titleHi: 'सहसंबंध व प्रकीर्णन',
        questions: [
            {
                q: "Karl Pearson's correlation coefficient (r) ranges between:",
                qHi: 'कार्ल पियर्सन सहसंबंध गुणांक (r) का मान किस परास में होता है?',
                options: ['0 and 1', '−1 and +1', '−100 and +100', 'Any real number'],
                optionsHi: ['0 और 1', '−1 और +1', '−100 और +100', 'कोई भी वास्तविक संख्या'],
                correct: 1,
                explain: 'r always lies between −1 (perfect negative) and +1 (perfect positive linear relationship).',
                explainHi: 'r का मान हमेशा −1 (पूर्ण ऋणात्मक) और +1 (पूर्ण धनात्मक रैखिक संबंध) के बीच होता है।'
            },
            {
                q: 'A correlation coefficient near 0 indicates:',
                qHi: 'शून्य के निकट सहसंबंध गुणांक क्या दर्शाता है?',
                options: ['A strong linear relationship', 'Little to no linear relationship', 'A perfect positive relationship', 'A perfect negative relationship'],
                optionsHi: ['प्रबल रैखिक संबंध', 'बहुत कम या कोई रैखिक संबंध नहीं', 'पूर्ण धनात्मक संबंध', 'पूर्ण ऋणात्मक संबंध'],
                correct: 1,
                explain: 'Values close to zero mean the two variables show little to no linear association.',
                explainHi: 'शून्य के निकट मान का अर्थ है कि दोनों चरों के बीच बहुत कम या कोई रैखिक संबंध नहीं है।'
            },
            {
                q: "Spearman's Rank Correlation is best used when:",
                qHi: 'स्पीयरमैन कोटि सहसंबंध का प्रयोग सबसे उपयुक्त कब होता है?',
                options: ['Data is raw numeric values', 'Data is ranked/ordinal', 'There are no observations', 'Only one variable exists'],
                optionsHi: ['आँकड़े कच्चे संख्यात्मक मान हों', 'आँकड़े क्रमबद्ध (ordinal) हों', 'कोई प्रेक्षण न हो', 'केवल एक ही चर हो'],
                correct: 1,
                explain: "Spearman's method applies the same correlation idea to ranked (ordinal) data — useful when only relative order matters.",
                explainHi: 'स्पीयरमैन विधि सहसंबंध की उसी अवधारणा को क्रमबद्ध (ordinal) आँकड़ों पर लागू करती है — जब केवल सापेक्ष क्रम महत्वपूर्ण हो, तब उपयोगी है।'
            },
            {
                q: 'A high correlation between two variables proves that:',
                qHi: 'दो चरों के बीच उच्च सहसंबंध क्या सिद्ध करता है?',
                options: ['One variable causes the other', 'They are unrelated', 'They move together linearly, but causation is not proven', 'The relationship is always negative'],
                optionsHi: ['एक चर दूसरे का कारण है', 'वे असंबंधित हैं', 'वे रैखिक रूप से साथ चलते हैं, परंतु कारणता सिद्ध नहीं होती', 'संबंध हमेशा ऋणात्मक होता है'],
                correct: 2,
                explain: 'Correlation measures association, not causation — two variables can be strongly correlated without one causing the other.',
                explainHi: 'सहसंबंध जुड़ाव को मापता है, कारणता को नहीं — दो चर बिना एक-दूसरे का कारण बने भी प्रबल रूप से सहसंबंधित हो सकते हैं।'
            }
        ]
    },

    'stats-dispersion': {
        module: 'stats',
        title: 'Measures of Dispersion',
        titleHi: 'परिक्षेपण के माप',
        questions: [
            {
                q: 'Which measure of dispersion uses only the extreme values of a dataset?',
                qHi: 'कौन-सा परिक्षेपण माप केवल आँकड़ों के चरम मानों का उपयोग करता है?',
                options: ['Standard Deviation', 'Range', 'Coefficient of Variation', 'Mean Deviation'],
                optionsHi: ['मानक विचलन', 'परिसर (Range)', 'विचरण गुणांक', 'माध्य विचलन'],
                correct: 1,
                explain: 'Range = Maximum − Minimum, using only the two extreme values and ignoring everything in between.',
                explainHi: 'परिसर = अधिकतम − न्यूनतम, यह केवल दो चरम मानों का उपयोग करता है और बीच के सभी मानों को अनदेखा करता है।'
            },
            {
                q: 'The Coefficient of Variation (CV) is most useful for:',
                qHi: 'विचरण गुणांक (CV) किस कार्य हेतु सर्वाधिक उपयोगी है?',
                options: ['Finding the mean of a dataset', 'Comparing the relative consistency of two datasets with different means', 'Measuring central tendency', 'Ranking ordinal data'],
                optionsHi: ['आँकड़ों का माध्य ज्ञात करना', 'भिन्न माध्य वाले दो आँकड़ा-समूहों की सापेक्ष स्थिरता की तुलना करना', 'केंद्रीय प्रवृत्ति मापना', 'क्रमबद्ध आँकड़ों की रैंकिंग करना'],
                correct: 1,
                explain: 'CV = (σ/x̄) × 100 expresses SD as a percentage of the mean, allowing fair comparison of variability across datasets.',
                explainHi: 'CV = (σ/x̄) × 100, मानक विचलन को माध्य के प्रतिशत के रूप में व्यक्त करता है, जिससे विभिन्न आँकड़ा-समूहों की परिवर्तनशीलता की निष्पक्ष तुलना संभव होती है।'
            },
            {
                q: 'Quartile Deviation (QD) is calculated as:',
                qHi: 'चतुर्थक विचलन (QD) की गणना कैसे होती है?',
                options: ['Q3 − Q1', '(Q3 − Q1)/2', 'Q3 + Q1', '(Q3 + Q1)/2'],
                optionsHi: ['Q3 − Q1', '(Q3 − Q1)/2', 'Q3 + Q1', '(Q3 + Q1)/2'],
                correct: 1,
                explain: 'QD = (Q3 − Q1)/2, half of the interquartile range, describing the spread of the middle 50% of data.',
                explainHi: 'QD = (Q3 − Q1)/2, यह अंतर-चतुर्थक परास का आधा है, जो मध्य 50% आँकड़ों के फैलाव को दर्शाता है।'
            },
            {
                q: 'Which measure of dispersion uses every single value in the dataset?',
                qHi: 'कौन-सा परिक्षेपण माप आँकड़ों के हर एक मान का उपयोग करता है?',
                options: ['Range', 'Coefficient of Range', 'Standard Deviation', 'Neither Range nor Quartile Deviation'],
                optionsHi: ['परिसर', 'परिसर गुणांक', 'मानक विचलन', 'न परिसर, न चतुर्थक विचलन'],
                correct: 2,
                explain: 'Unlike Range or Quartile Deviation (positional values only), Standard Deviation is computed from every value.',
                explainHi: 'परिसर या चतुर्थक विचलन (केवल स्थितीय मानों) के विपरीत, मानक विचलन हर मान से परिकलित होता है।'
            }
        ]
    },

    'stats-index-numbers': {
        module: 'stats',
        title: 'Index Numbers',
        titleHi: 'सूचकांक',
        questions: [
            {
                q: 'In an index number series, the base year value is always set to:',
                qHi: 'सूचकांक शृंखला में आधार वर्ष का मान सदैव किसके बराबर रखा जाता है?',
                options: ['0', '1', '100', '1000'],
                optionsHi: ['0', '1', '100', '1000'],
                correct: 2,
                explain: "By convention, the base period's index value is fixed at 100, and all other periods are expressed relative to it.",
                explainHi: 'परंपरा के अनुसार आधार अवधि का सूचकांक मान 100 निश्चित किया जाता है, और अन्य सभी अवधियों को इसके सापेक्ष व्यक्त किया जाता है।'
            },
            {
                q: 'If the Price Index rises from 100 to 118 over a year, the inflation rate for that year is:',
                qHi: 'यदि मूल्य सूचकांक एक वर्ष में 100 से बढ़कर 118 हो जाए, तो उस वर्ष की मुद्रास्फीति दर क्या होगी?',
                options: ['100%', '18%', '82%', '118%'],
                optionsHi: ['100%', '18%', '82%', '118%'],
                correct: 1,
                explain: 'Inflation Rate = % change in Price Index = (118−100)/100 × 100 = 18%.',
                explainHi: 'मुद्रास्फीति दर = मूल्य सूचकांक में % परिवर्तन = (118−100)/100 × 100 = 18%।'
            },
            {
                q: 'A Price Index is used to measure:',
                qHi: 'मूल्य सूचकांक का उपयोग किसे मापने हेतु किया जाता है?',
                options: ['Changes in the general price level relative to a base period', 'The absolute price of one specific good', 'Population growth', 'GDP growth alone'],
                optionsHi: ['आधार अवधि के सापेक्ष सामान्य मूल्य स्तर में परिवर्तन', 'किसी एक विशेष वस्तु की निरपेक्ष कीमत', 'जनसंख्या वृद्धि', 'केवल जीडीपी वृद्धि'],
                correct: 0,
                explain: "A price index tracks how the price level of a basket of goods moves over time compared to its value in a fixed base period.",
                explainHi: 'मूल्य सूचकांक यह दर्शाता है कि वस्तुओं की एक टोकरी का मूल्य स्तर समय के साथ आधार अवधि की तुलना में कैसे बदलता है।'
            },
            {
                q: "If this year's Price Index is below 100, what does that indicate relative to the base year?",
                qHi: 'यदि इस वर्ष का मूल्य सूचकांक 100 से कम है, तो यह आधार वर्ष के सापेक्ष क्या दर्शाता है?',
                options: ['Prices have risen', 'Prices have fallen', 'Prices are unchanged', 'Data is invalid'],
                optionsHi: ['कीमतें बढ़ी हैं', 'कीमतें घटी हैं', 'कीमतें अपरिवर्तित हैं', 'आँकड़े अमान्य हैं'],
                correct: 1,
                explain: 'An index value below 100 means the price level is now lower than it was in the base year.',
                explainHi: '100 से कम सूचकांक मान का अर्थ है कि वर्तमान मूल्य स्तर आधार वर्ष की तुलना में कम है।'
            }
        ]
    },

    // ── INDIAN ECONOMIC DEVELOPMENT ─────────────────────────────
    'india-poverty': {
        module: 'india',
        title: 'Poverty & Inequality',
        titleHi: 'निर्धनता व असमानता',
        questions: [
            {
                q: "NCERT's poverty line is based primarily on:",
                qHi: 'NCERT की निर्धनता रेखा मुख्यतः किस आधार पर तय होती है?',
                options: ['Income tax records', 'A calorie-based minimum consumption expenditure', 'Literacy rate', 'Life expectancy'],
                optionsHi: ['आयकर रिकॉर्ड', 'कैलोरी-आधारित न्यूनतम उपभोग व्यय', 'साक्षरता दर', 'जीवन प्रत्याशा'],
                correct: 1,
                explain: 'The poverty line converts a minimum calorie requirement into a rupee expenditure cutoff.',
                explainHi: 'निर्धनता रेखा एक न्यूनतम कैलोरी आवश्यकता को रुपये में व्यय की सीमा में परिवर्तित करती है।'
            },
            {
                q: 'The Lorenz Curve plots:',
                qHi: 'लॉरेंज वक्र किसका आलेखन करता है?',
                options: ['Cumulative % of population vs cumulative % of income', 'Price vs quantity', 'Time vs GDP', 'Literacy vs life expectancy'],
                optionsHi: ['जनसंख्या का संचयी % बनाम आय का संचयी %', 'कीमत बनाम मात्रा', 'समय बनाम जीडीपी', 'साक्षरता बनाम जीवन प्रत्याशा'],
                correct: 0,
                explain: 'The Lorenz Curve shows the cumulative share of income received against the cumulative share of the population.',
                explainHi: 'लॉरेंज वक्र जनसंख्या के संचयी हिस्से के सापेक्ष प्राप्त आय के संचयी हिस्से को दर्शाता है।'
            },
            {
                q: 'A Gini Coefficient of 0 represents:',
                qHi: 'गिनी गुणांक का मान 0 होना क्या दर्शाता है?',
                options: ['Perfect inequality', 'Perfect equality', 'Maximum poverty', 'No population'],
                optionsHi: ['पूर्ण असमानता', 'पूर्ण समानता', 'अधिकतम निर्धनता', 'कोई जनसंख्या नहीं'],
                correct: 1,
                explain: 'Gini = 0 means income is distributed perfectly equally across the population; Gini = 1 is perfect inequality.',
                explainHi: 'Gini = 0 का अर्थ है कि आय जनसंख्या में पूर्णतः समान रूप से वितरित है; Gini = 1 पूर्ण असमानता दर्शाता है।'
            },
            {
                q: 'The "Headcount Ratio" refers to:',
                qHi: '"शीर्ष गणना अनुपात" (Headcount Ratio) किसे संदर्भित करता है?',
                options: ['The number of firms in poverty', 'The percentage of population below the poverty line', 'The Gini coefficient', 'The average income of the poor'],
                optionsHi: ['निर्धनता में फर्मों की संख्या', 'निर्धनता रेखा से नीचे जनसंख्या का प्रतिशत', 'गिनी गुणांक', 'निर्धनों की औसत आय'],
                correct: 1,
                explain: 'The headcount ratio is the proportion (%) of the total population whose consumption expenditure falls below the poverty line.',
                explainHi: 'शीर्ष गणना अनुपात कुल जनसंख्या का वह प्रतिशत है जिसका उपभोग व्यय निर्धनता रेखा से नीचे है।'
            }
        ]
    },

    'india-human-capital': {
        module: 'india',
        title: 'Human Capital Formation: Education & Health',
        titleHi: 'मानव पूँजी निर्माण: शिक्षा व स्वास्थ्य',
        questions: [
            {
                q: 'Human Capital Formation is driven mainly by investment in:',
                qHi: 'मानव पूँजी निर्माण मुख्यतः किसमें निवेश से प्रेरित होता है?',
                options: ['Only physical infrastructure', 'Education and Health', 'Only foreign trade', 'Only agriculture'],
                optionsHi: ['केवल भौतिक अवसंरचना', 'शिक्षा व स्वास्थ्य', 'केवल विदेशी व्यापार', 'केवल कृषि'],
                correct: 1,
                explain: 'NCERT names education and health as the two most emphasized sources of human capital formation.',
                explainHi: 'NCERT शिक्षा व स्वास्थ्य को मानव पूँजी निर्माण के दो सर्वाधिक महत्वपूर्ण स्रोतों के रूप में बताता है।'
            },
            {
                q: 'Higher investment in education primarily raises:',
                qHi: 'शिक्षा में अधिक निवेश मुख्यतः किसे बढ़ाता है?',
                options: ['Life expectancy directly', 'Literacy and skills', 'Foreign exchange reserves', 'Population growth rate'],
                optionsHi: ['सीधे जीवन प्रत्याशा को', 'साक्षरता व कौशल को', 'विदेशी मुद्रा भंडार को', 'जनसंख्या वृद्धि दर को'],
                correct: 1,
                explain: 'Education spending builds literacy and skills, raising the productive capacity of the workforce.',
                explainHi: 'शिक्षा पर व्यय साक्षरता और कौशल का निर्माण करता है, जिससे कार्यबल की उत्पादक क्षमता बढ़ती है।'
            },
            {
                q: 'Higher investment in health primarily raises:',
                qHi: 'स्वास्थ्य में अधिक निवेश मुख्यतः किसे बढ़ाता है?',
                options: ['Literacy rate', 'Life expectancy and productive years', 'Fiscal deficit', 'Import demand'],
                optionsHi: ['साक्षरता दर', 'जीवन प्रत्याशा व उत्पादक वर्ष', 'राजकोषीय घाटा', 'आयात माँग'],
                correct: 1,
                explain: 'Health spending improves nutrition and healthcare, raising life expectancy and the number of productive working years.',
                explainHi: 'स्वास्थ्य पर व्यय पोषण व स्वास्थ्य सेवा में सुधार करता है, जिससे जीवन प्रत्याशा और उत्पादक कार्य-वर्षों की संख्या बढ़ती है।'
            },
            {
                q: 'Why does NCERT treat education and health as two SEPARATE sources of human capital?',
                qHi: 'NCERT शिक्षा व स्वास्थ्य को मानव पूँजी के दो अलग-अलग स्रोतों के रूप में क्यों मानता है?',
                options: ['Because they always move together', 'Because a country can be strong in one and weak in the other', 'Because only education matters', 'Because health spending has no economic effect'],
                optionsHi: ['क्योंकि वे हमेशा साथ चलते हैं', 'क्योंकि कोई देश एक में मजबूत और दूसरे में कमजोर हो सकता है', 'क्योंकि केवल शिक्षा मायने रखती है', 'क्योंकि स्वास्थ्य व्यय का कोई आर्थिक प्रभाव नहीं होता'],
                correct: 1,
                explain: 'Since they compound independently, a country can excel in literacy while lagging in health outcomes, or vice versa.',
                explainHi: 'चूँकि दोनों स्वतंत्र रूप से प्रभाव डालते हैं, कोई देश साक्षरता में आगे रहते हुए भी स्वास्थ्य परिणामों में पीछे हो सकता है, या इसके विपरीत।'
            }
        ]
    },

    'india-employment-structure': {
        module: 'india',
        title: 'Employment: Structural Transformation & Informalisation',
        titleHi: 'रोजगार: संरचनात्मक परिवर्तन व अनौपचारिकीकरण',
        questions: [
            {
                q: '"Structural transformation" of employment refers to the shift of workers from:',
                qHi: 'रोजगार का "संरचनात्मक परिवर्तन" श्रमिकों के किस स्थानांतरण को संदर्भित करता है?',
                options: ['Industry to Agriculture', 'Agriculture to Industry & Services', 'Formal to Informal work', 'Urban to Rural areas'],
                optionsHi: ['उद्योग से कृषि की ओर', 'कृषि से उद्योग व सेवाओं की ओर', 'औपचारिक से अनौपचारिक कार्य की ओर', 'शहरी से ग्रामीण क्षेत्रों की ओर'],
                correct: 1,
                explain: 'As economies develop, the workforce share in agriculture typically falls while industry and services rise.',
                explainHi: 'जैसे-जैसे अर्थव्यवस्था विकसित होती है, कृषि में कार्यबल का हिस्सा सामान्यतः घटता है जबकि उद्योग व सेवाओं का हिस्सा बढ़ता है।'
            },
            {
                q: 'The informal sector is characterized by:',
                qHi: 'अनौपचारिक क्षेत्र की मुख्य विशेषता क्या है?',
                options: ['Regular wages and strong legal protection', 'No job/social security, often self-employed or casual labour', 'Government-guaranteed pensions', 'High capital investment only'],
                optionsHi: ['नियमित मजदूरी व मजबूत कानूनी सुरक्षा', 'नौकरी/सामाजिक सुरक्षा का अभाव, अक्सर स्वरोजगार या अस्थायी श्रम', 'सरकार-गारंटीकृत पेंशन', 'केवल उच्च पूँजी निवेश'],
                correct: 1,
                explain: 'Informal-sector work lacks job security and social security, and is often self-employed or casual in nature.',
                explainHi: 'अनौपचारिक क्षेत्र के कार्य में नौकरी व सामाजिक सुरक्षा नहीं होती, और यह प्रायः स्वरोजगार या अस्थायी प्रकृति का होता है।'
            },
            {
                q: 'A rising share of "Formal Sector" employment generally indicates:',
                qHi: '"औपचारिक क्षेत्र" रोजगार का बढ़ता हिस्सा सामान्यतः क्या दर्शाता है?',
                options: ['More workers losing legal protection', 'More workers gaining job security and legal protection', 'A shrinking economy', 'Falling literacy rates'],
                optionsHi: ['अधिक श्रमिकों का कानूनी सुरक्षा खोना', 'अधिक श्रमिकों का नौकरी सुरक्षा व कानूनी सुरक्षा पाना', 'सिकुड़ती अर्थव्यवस्था', 'घटती साक्षरता दर'],
                correct: 1,
                explain: 'The formal sector offers registered enterprises, regular wages, and legal/social protection.',
                explainHi: 'औपचारिक क्षेत्र पंजीकृत उद्यम, नियमित मजदूरी, और कानूनी/सामाजिक सुरक्षा प्रदान करता है।'
            },
            {
                q: "Which of these is a concern NCERT raises about India's informalisation trend?",
                qHi: 'भारत के अनौपचारिकीकरण रुझान को लेकर NCERT कौन-सी चिंता व्यक्त करता है?',
                options: ['The shift toward formal jobs has been too fast', 'The shift toward formal jobs has been slow and uneven', 'There is no informal sector in India', 'Agriculture employs almost no one'],
                optionsHi: ['औपचारिक नौकरियों की ओर बदलाव बहुत तेज़ रहा है', 'औपचारिक नौकरियों की ओर बदलाव धीमा व असमान रहा है', 'भारत में कोई अनौपचारिक क्षेत्र नहीं है', 'कृषि लगभग किसी को रोजगार नहीं देती'],
                correct: 1,
                explain: "Despite gradual improvement, India's workforce has historically been overwhelmingly informal, and the shift has been slow and uneven.",
                explainHi: 'क्रमिक सुधार के बावजूद, भारत का कार्यबल ऐतिहासिक रूप से अत्यधिक अनौपचारिक रहा है, और यह बदलाव धीमा व असमान रहा है।'
            }
        ]
    }
};

window.QUIZ_BANK = QUIZ_BANK;
