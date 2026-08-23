// Quiz banks for the 3 sims defined in js/simulations_macro_datalab.js.
// See js/quiz-engine.js's header for the QUIZ_BANK data contract.

if (typeof QUIZ_BANK !== 'undefined') {
    QUIZ_BANK['macro-national-income-methods'] = {
        static: [
            {
                level: 'remember',
                question: { en: 'The Value Added Method computes GDP as…', hi: 'मूल्य वर्धित विधि (Value Added Method) GDP की गणना इस प्रकार करती है…' },
                options: [
                    { en: 'Σ (Value of Output − Intermediate Consumption) across all firms', hi: 'सभी फर्मों में Σ (उत्पादन मूल्य − मध्यवर्ती उपभोग)' },
                    { en: 'Σ Value of Output only', hi: 'केवल Σ उत्पादन मूल्य' },
                    { en: 'C + I + G + (X−M)', hi: 'C + I + G + (X−M)' },
                    { en: 'Wages + Rent + Interest + Profit', hi: 'मज़दूरी + किराया + ब्याज + लाभ' }
                ],
                correctIndex: 0,
                explain: { en: 'Subtracting Intermediate Consumption from Output avoids double-counting the value already counted at an earlier production stage.', hi: 'आउटपुट से मध्यवर्ती उपभोग घटाना उस मूल्य के दोहरे-गणना से बचाता है जो पहले के उत्पादन चरण में पहले से गिना जा चुका है।' },
                syllabusId: 'XII-A-U1-METHODS'
            },
            {
                level: 'understand',
                question: { en: 'Why does the Income Method total ALWAYS exactly equal the Value Added Method total in this lab?', hi: 'इस लैब में आय विधि का कुल हमेशा मूल्य वर्धित विधि के कुल के बराबर क्यों होता है?' },
                options: [
                    { en: 'Because Profit is defined as the residual left after paying Wages, Rent and Interest out of Value Added', hi: 'क्योंकि लाभ को मूल्य वर्धित में से मज़दूरी, किराया और ब्याज चुकाने के बाद बचे शेष के रूप में परिभाषित किया गया है' },
                    { en: 'It is a coincidence with no reason', hi: 'यह बिना किसी कारण के एक संयोग है' },
                    { en: 'Because taxes are ignored entirely', hi: 'क्योंकि करों को पूरी तरह से नज़रअंदाज़ किया जाता है' },
                    { en: 'They are never actually equal', hi: 'वे वास्तव में कभी बराबर नहीं होते' }
                ],
                correctIndex: 0,
                explain: { en: 'Profit = Value Added − Wages − Rent − Interest by construction, so Wages+Rent+Interest+Profit automatically sums back to Value Added.', hi: 'लाभ = मूल्य वर्धित − मज़दूरी − किराया − ब्याज संरचना के अनुसार, इसलिए मज़दूरी+किराया+ब्याज+लाभ स्वतः वापस मूल्य वर्धित के बराबर हो जाता है।' },
                syllabusId: 'XII-A-U1-METHODS'
            },
            {
                level: 'analyse',
                question: { en: 'A firm\'s Intermediate Consumption rises to exactly equal its Value of Output. What happens to its Value Added?', hi: 'एक फर्म का मध्यवर्ती उपभोग बढ़कर ठीक उसके उत्पादन मूल्य के बराबर हो जाता है। इसके मूल्य वर्धित का क्या होता है?' },
                options: [
                    { en: 'It falls to zero — the firm added no new value of its own', hi: 'यह शून्य हो जाता है — फर्म ने अपना कोई नया मूल्य नहीं जोड़ा' },
                    { en: 'It doubles', hi: 'यह दोगुना हो जाता है' },
                    { en: 'It becomes infinite', hi: 'यह अनंत हो जाता है' },
                    { en: 'It is unaffected', hi: 'यह अप्रभावित रहता है' }
                ],
                correctIndex: 0,
                explain: { en: 'Value Added = Output − Intermediate Consumption; if they are equal, the firm bought as much from others as it sold, adding nothing itself.', hi: 'मूल्य वर्धित = उत्पादन − मध्यवर्ती उपभोग; यदि वे बराबर हैं, तो फर्म ने दूसरों से उतना ही खरीदा जितना बेचा, स्वयं कुछ नहीं जोड़ा।' }
            },
            {
                level: 'evaluate',
                question: { en: 'The Expenditure Method split shown in this lab (60% C, 20% I, 15% G, 5% NX) is labelled "illustrative". Why is that an honest caveat rather than a real limitation of the method?', hi: 'इस लैब में दिखाया गया व्यय विधि विभाजन (60% C, 20% I, 15% G, 5% NX) "उदाहरणात्मक" लेबल किया गया है। यह विधि की वास्तविक सीमा के बजाय एक ईमानदार चेतावनी क्यों है?' },
                options: [
                    { en: 'Because C/I/G/NX aren\'t naturally per-firm figures the way Value Added is, so a real split needs separate expenditure-side data, not fixed shares of one total', hi: 'क्योंकि C/I/G/NX स्वाभाविक रूप से प्रति-फर्म आँकड़े नहीं हैं जैसे मूल्य वर्धित है, इसलिए वास्तविक विभाजन को एक कुल के निश्चित हिस्सों की नहीं, बल्कि अलग व्यय-पक्ष डेटा की आवश्यकता है' },
                    { en: 'Because the Expenditure Method is entirely wrong', hi: 'क्योंकि व्यय विधि पूरी तरह गलत है' },
                    { en: 'Because GDP has no relationship to expenditure at all', hi: 'क्योंकि GDP का व्यय से कोई संबंध ही नहीं है' },
                    { en: 'Because only India uses this method', hi: 'क्योंकि केवल भारत इस विधि का उपयोग करता है' }
                ],
                correctIndex: 0,
                explain: { en: 'The three methods really do arrive at the same GDP in principle — this lab is honest that its C/I/G/NX split is a simplification for this specific table, not a flaw in the Expenditure Method itself.', hi: 'तीनों विधियाँ सिद्धांततः वास्तव में समान GDP पर पहुँचती हैं — यह लैब ईमानदार है कि इसका C/I/G/NX विभाजन इस विशिष्ट तालिका के लिए एक सरलीकरण है, व्यय विधि में स्वयं कोई दोष नहीं।' }
            }
        ],
        applyTemplates: [
            {
                level: 'apply',
                build(rows, metrics) {
                    if (!metrics || typeof metrics.GDP_VA !== 'number') return null;
                    const correct = Math.round(metrics.GDP_VA);
                    const options = quizNumericOptions(correct, [30, -30, 60], { round: 0, prefix: '₹' });
                    return {
                        question: { en: 'For the firm data currently shown in the table, what is GDP by the Value Added Method?', hi: 'तालिका में वर्तमान में दिखाए गए फर्म डेटा के लिए, मूल्य वर्धित विधि से GDP क्या है?' },
                        options,
                        correctIndex: 0,
                        explain: { en: `Sum (Output − Intermediate Consumption) across every firm, shown in Live Readings: ₹${correct}.`, hi: `हर फर्म में (उत्पादन − मध्यवर्ती उपभोग) का योग, Live Readings में दिखाया गया: ₹${correct}।` }
                    };
                }
            }
        ]
    };

    QUIZ_BANK['macro-basic-concepts'] = {
        static: [
            {
                level: 'remember',
                question: { en: 'A Capital Good is best described as…', hi: 'एक पूँजीगत वस्तु (Capital Good) का सबसे अच्छा वर्णन है…' },
                options: [
                    { en: 'A good used as a means of further production', hi: 'आगे के उत्पादन के साधन के रूप में उपयोग की जाने वाली वस्तु' },
                    { en: 'A good consumed immediately for personal use', hi: 'व्यक्तिगत उपयोग के लिए तुरंत उपभोग की जाने वाली वस्तु' },
                    { en: 'Any good bought by a government', hi: 'सरकार द्वारा खरीदी गई कोई भी वस्तु' },
                    { en: 'A good with zero value', hi: 'शून्य मूल्य वाली वस्तु' }
                ],
                correctIndex: 0,
                explain: { en: 'A taxi driver\'s car is a capital good — it earns future income rather than being consumed for its own sake.', hi: 'एक टैक्सी चालक की कार एक पूँजीगत वस्तु है — यह भविष्य की आय अर्जित करती है, अपने लिए उपभोग नहीं होती।' },
                syllabusId: 'XII-A-U1-BASIC-CONCEPTS'
            },
            {
                level: 'remember',
                question: { en: 'An Intermediate Good is excluded from GDP because…', hi: 'एक मध्यवर्ती वस्तु को GDP से बाहर रखा जाता है क्योंकि…' },
                options: [
                    { en: 'Counting it separately would double-count value already inside a final good\'s price', hi: 'इसे अलग से गिनने से पहले से किसी अंतिम वस्तु की कीमत के भीतर के मूल्य की दोहरी गिनती होगी' },
                    { en: 'It has no economic value at all', hi: 'इसका कोई आर्थिक मूल्य ही नहीं है' },
                    { en: 'It is always more expensive than a final good', hi: 'यह हमेशा एक अंतिम वस्तु से अधिक महंगी होती है' },
                    { en: 'The government bans it', hi: 'सरकार इसे प्रतिबंधित करती है' }
                ],
                correctIndex: 0,
                explain: { en: 'Steel bought to build a car is already embedded in the car\'s final price — counting both would double-count the steel\'s value.', hi: 'कार बनाने के लिए खरीदा गया स्टील पहले से ही कार की अंतिम कीमत में शामिल है — दोनों को गिनने से स्टील के मूल्य की दोहरी गिनती होगी।' },
                syllabusId: 'XII-A-U1-BASIC-CONCEPTS'
            },
            {
                level: 'understand',
                question: { en: 'A "Stock" variable (like wealth) differs from a "Flow" variable (like income) because a stock is…', hi: '"स्टॉक" चर (जैसे संपत्ति) "प्रवाह" चर (जैसे आय) से इसलिए भिन्न है क्योंकि एक स्टॉक…' },
                options: [
                    { en: 'Measured at one point in time', hi: 'एक समय बिंदु पर मापा जाता है' },
                    { en: 'Measured only over a year', hi: 'केवल एक वर्ष में मापा जाता है' },
                    { en: 'Always larger than a flow', hi: 'हमेशा एक प्रवाह से बड़ा होता है' },
                    { en: 'Never has a numerical value', hi: 'कभी भी संख्यात्मक मूल्य नहीं रखता' }
                ],
                correctIndex: 0,
                explain: { en: 'A stock (e.g. capital as on 31 March) is a snapshot at a point in time; a flow (e.g. GDP for the year) is measured over a period.', hi: 'एक स्टॉक (जैसे 31 मार्च तक पूँजी) एक समय बिंदु पर एक स्नैपशॉट है; एक प्रवाह (जैसे वर्ष के लिए GDP) एक अवधि में मापा जाता है।' },
                syllabusId: 'XII-A-U1-BASIC-CONCEPTS'
            },
            {
                level: 'apply',
                question: { en: 'Net Investment equals…', hi: 'निवल निवेश (Net Investment) बराबर है…' },
                options: [
                    { en: 'Gross Investment − Depreciation', hi: 'सकल निवेश − मूल्यह्रास' },
                    { en: 'Gross Investment + Depreciation', hi: 'सकल निवेश + मूल्यह्रास' },
                    { en: 'Depreciation alone', hi: 'केवल मूल्यह्रास' },
                    { en: 'Consumption Expenditure', hi: 'उपभोग व्यय' }
                ],
                correctIndex: 0,
                explain: { en: 'Depreciation is capital used up through wear-and-tear; subtracting it from Gross Investment leaves only the genuinely NEW addition to capital stock.', hi: 'मूल्यह्रास टूट-फूट से इस्तेमाल हुई पूँजी है; इसे सकल निवेश से घटाने पर केवल पूँजी स्टॉक में वास्तविक नई वृद्धि बचती है।' },
                syllabusId: 'XII-A-U1-BASIC-CONCEPTS'
            },
            {
                level: 'apply',
                question: { en: 'A car bought by a household purely for personal use is classified as a…', hi: 'एक परिवार द्वारा पूर्णतः व्यक्तिगत उपयोग के लिए खरीदी गई कार को वर्गीकृत किया जाता है…' },
                options: [
                    { en: 'Final consumption good', hi: 'अंतिम उपभोग वस्तु' },
                    { en: 'Intermediate good', hi: 'मध्यवर्ती वस्तु' },
                    { en: 'Capital good for the household', hi: 'परिवार के लिए पूँजीगत वस्तु' },
                    { en: 'Not counted anywhere in GDP', hi: 'GDP में कहीं भी नहीं गिना जाता' }
                ],
                correctIndex: 0,
                explain: { en: 'It leaves the production boundary for final personal use and is counted once, in full, in GDP.', hi: 'यह अंतिम व्यक्तिगत उपयोग के लिए उत्पादन सीमा को छोड़ती है और GDP में एक बार, पूरी तरह गिनी जाती है।' },
                syllabusId: 'XII-A-U1-BASIC-CONCEPTS'
            },
            {
                level: 'analyse',
                question: { en: 'The SAME car could be a Consumption Good OR a Capital Good depending on…', hi: 'वही कार उपभोग वस्तु या पूँजीगत वस्तु हो सकती है, यह किस पर निर्भर करता है…' },
                options: [
                    { en: 'Who buys it and for what purpose (personal use vs. earning future income)', hi: 'इसे कौन खरीदता है और किस उद्देश्य के लिए (व्यक्तिगत उपयोग बनाम भविष्य की आय अर्जित करना)' },
                    { en: 'The car\'s colour', hi: 'कार का रंग' },
                    { en: 'The car\'s brand name only', hi: 'केवल कार का ब्रांड नाम' },
                    { en: 'It can never change classification', hi: 'यह कभी भी वर्गीकरण नहीं बदल सकती' }
                ],
                correctIndex: 0,
                explain: { en: 'Classification depends on USE, not the physical good itself — a taxi driver\'s car is capital; a household\'s personal car is consumption.', hi: 'वर्गीकरण उपयोग पर निर्भर करता है, भौतिक वस्तु पर नहीं — एक टैक्सी चालक की कार पूँजी है; एक परिवार की व्यक्तिगत कार उपभोग है।' },
                syllabusId: 'XII-A-U1-BASIC-CONCEPTS'
            },
            {
                level: 'evaluate',
                question: { en: 'Why does GDP being "Gross" (not "Net") of depreciation matter for judging an economy\'s TRUE growth?', hi: 'एक अर्थव्यवस्था की वास्तविक वृद्धि का आकलन करने के लिए GDP का मूल्यह्रास का "सकल" (न कि "निवल") होना क्यों मायने रखता है?' },
                options: [
                    { en: 'A high Gross figure could partly just be replacing worn-out capital, not genuinely new output — NDP strips that out', hi: 'एक उच्च सकल आँकड़ा आंशिक रूप से केवल घिसी हुई पूँजी को बदल सकता है, वास्तव में नया उत्पादन नहीं — NDP इसे हटा देता है' },
                    { en: 'Gross and Net figures are always numerically identical', hi: 'सकल और निवल आँकड़े हमेशा संख्यात्मक रूप से समान होते हैं' },
                    { en: 'Depreciation never actually happens in real economies', hi: 'वास्तविक अर्थव्यवस्थाओं में मूल्यह्रास वास्तव में कभी नहीं होता' },
                    { en: 'This distinction is purely academic with no real meaning', hi: 'यह अंतर पूर्णतः शैक्षणिक है जिसका कोई वास्तविक अर्थ नहीं' }
                ],
                correctIndex: 0,
                explain: { en: 'If a country\'s Gross output just barely covers replacing worn-out machinery, its NET (genuinely new) output could be much smaller — this is exactly why NDP/NNP matter alongside GDP/GNP.', hi: 'यदि किसी देश का सकल उत्पादन घिसी हुई मशीनरी को बदलने भर के बराबर ही है, तो इसका निवल (वास्तव में नया) उत्पादन बहुत छोटा हो सकता है — यही कारण है कि GDP/GNP के साथ NDP/NNP भी मायने रखते हैं।' },
                syllabusId: 'XII-A-U1-BASIC-CONCEPTS'
            },
            {
                level: 'remember',
                question: { en: 'A "Final Good" is one that…', hi: 'एक "अंतिम वस्तु" वह है जो…' },
                options: [
                    { en: 'Leaves the production boundary for final use, not for resale or further processing', hi: 'पुनर्विक्रय या आगे प्रसंस्करण के लिए नहीं, बल्कि अंतिम उपयोग के लिए उत्पादन सीमा को छोड़ती है' },
                    { en: 'Is always the last item produced in a factory each day', hi: 'हमेशा एक कारखाने में हर दिन उत्पादित अंतिम वस्तु होती है' },
                    { en: 'Has no further use whatsoever', hi: 'जिसका आगे कोई उपयोग नहीं है' },
                    { en: 'Is produced only by the government', hi: 'केवल सरकार द्वारा उत्पादित की जाती है' }
                ],
                correctIndex: 0,
                explain: { en: 'A final good is meant for end-use (consumption or investment), so its full value is counted once in GDP — unlike an intermediate good.', hi: 'एक अंतिम वस्तु अंतिम उपयोग (उपभोग या निवेश) के लिए होती है, इसलिए इसका पूरा मूल्य GDP में एक बार गिना जाता है — मध्यवर्ती वस्तु के विपरीत।' },
                syllabusId: 'XII-A-U1-BASIC-CONCEPTS'
            },
            {
                level: 'understand',
                question: { en: 'Why is "Depreciation" also called a Consumption of Fixed Capital?', hi: '"मूल्यह्रास" को स्थिर पूँजी का उपभोग (Consumption of Fixed Capital) भी क्यों कहा जाता है?' },
                options: [
                    { en: 'Because fixed capital (machinery, buildings) gets gradually used up/worn out in production, just as goods get consumed', hi: 'क्योंकि स्थिर पूँजी (मशीनरी, भवन) उत्पादन में धीरे-धीरे उपयोग/घिसती जाती है, ठीक वैसे ही जैसे वस्तुएँ उपभोग होती हैं' },
                    { en: 'Because machines are literally eaten', hi: 'क्योंकि मशीनों को शाब्दिक रूप से खाया जाता है' },
                    { en: 'Because it only applies to consumer goods', hi: 'क्योंकि यह केवल उपभोक्ता वस्तुओं पर लागू होता है' },
                    { en: 'Because it is set by household demand', hi: 'क्योंकि यह घरेलू माँग द्वारा निर्धारित होता है' }
                ],
                correctIndex: 0,
                explain: { en: 'Fixed capital wears out through normal use and the passage of time (wear-and-tear, obsolescence) — that gradual using-up is exactly what depreciation measures.', hi: 'स्थिर पूँजी सामान्य उपयोग और समय बीतने के साथ (टूट-फूट, अप्रचलन) घिसती है — यही क्रमिक उपयोग मूल्यह्रास मापता है।' },
                syllabusId: 'XII-A-U1-BASIC-CONCEPTS'
            },
            {
                level: 'apply',
                question: { en: 'A farmer grows wheat, keeps some for his own family\'s meals and sells the rest in the market. The portion he keeps for self-consumption is treated in national income accounting as…', hi: 'एक किसान गेहूँ उगाता है, कुछ अपने परिवार के भोजन के लिए रखता है और बाकी बाजार में बेचता है। स्व-उपभोग के लिए रखा गया हिस्सा राष्ट्रीय आय लेखांकन में माना जाता है…' },
                options: [
                    { en: 'An imputed final good, valued at market price and included in GDP', hi: 'एक अनुमानित (imputed) अंतिम वस्तु, बाजार मूल्य पर मूल्यांकित और GDP में शामिल' },
                    { en: 'Completely excluded from GDP since no money changes hands', hi: 'GDP से पूरी तरह बाहर, क्योंकि कोई पैसा हाथ नहीं बदलता' },
                    { en: 'An intermediate good', hi: 'एक मध्यवर्ती वस्तु' },
                    { en: 'A government transfer payment', hi: 'एक सरकारी हस्तांतरण भुगतान' }
                ],
                correctIndex: 0,
                explain: { en: 'Goods produced and consumed within the same household (self-consumption of own produce) are imputed a market value and included in GDP, even without a market transaction.', hi: 'एक ही परिवार के भीतर उत्पादित और उपभोग की गई वस्तुओं (स्वयं के उत्पाद का स्व-उपभोग) का बाजार मूल्य अनुमानित किया जाता है और बिना किसी बाजार लेनदेन के भी GDP में शामिल किया जाता है।' },
                syllabusId: 'XII-A-U1-BASIC-CONCEPTS'
            }
        ]
    };

    QUIZ_BANK['macro-propensity'] = {
        static: [
            {
                level: 'remember',
                question: { en: 'Marginal Propensity to Consume (MPC) is…', hi: 'सीमांत उपभोग प्रवृत्ति (MPC) है…' },
                options: [
                    { en: 'ΔConsumption / ΔIncome', hi: 'ΔउपΔग / Δआय' },
                    { en: 'Total Consumption / Total Income', hi: 'कुल उपभोग / कुल आय' },
                    { en: 'Total Saving / Total Income', hi: 'कुल बचत / कुल आय' },
                    { en: 'A constant equal to 1 always', hi: 'हमेशा 1 के बराबर एक स्थिरांक' }
                ],
                correctIndex: 0,
                explain: { en: 'MPC is the FRACTION of an extra rupee of income that gets spent — the slope of the consumption line.', hi: 'MPC आय के एक अतिरिक्त रुपये का वह अंश है जो खर्च होता है — उपभोग रेखा की ढलान।' },
                syllabusId: 'XII-A-U3-PROPENSITY'
            },
            {
                level: 'understand',
                question: { en: 'MPC + MPS always equals…', hi: 'MPC + MPS हमेशा किसके बराबर होता है…' },
                options: [
                    { en: '1', hi: '1' },
                    { en: '0', hi: '0' },
                    { en: '100', hi: '100' },
                    { en: 'It varies randomly', hi: 'यह यादृच्छिक रूप से बदलता है' }
                ],
                correctIndex: 0,
                explain: { en: 'Every extra rupee of income is either spent (MPC) or saved (MPS) — the two fractions must add to 1.', hi: 'आय का हर अतिरिक्त रुपया या तो खर्च होता है (MPC) या बचाया जाता है (MPS) — दोनों अंशों का योग 1 होना चाहिए।' },
                syllabusId: 'XII-A-U3-PROPENSITY'
            },
            {
                level: 'analyse',
                question: { en: 'At the Break-even Income (where the consumption line crosses the 45° line), Saving is…', hi: 'ब्रेक-ईवन आय पर (जहाँ उपभोग रेखा 45° रेखा को काटती है), बचत होती है…' },
                options: [
                    { en: 'Exactly zero', hi: 'ठीक शून्य' },
                    { en: 'At its maximum', hi: 'अपने अधिकतम पर' },
                    { en: 'Negative infinity', hi: 'ऋणात्मक अनंत' },
                    { en: 'Always equal to Income', hi: 'हमेशा आय के बराबर' }
                ],
                correctIndex: 0,
                explain: { en: 'At break-even, Consumption = Income exactly, so Saving = Income − Consumption = 0.', hi: 'ब्रेक-ईवन पर, उपभोग = आय बिल्कुल बराबर, इसलिए बचत = आय − उपभोग = 0।' },
                syllabusId: 'XII-A-U3-PROPENSITY'
            },
            {
                level: 'evaluate',
                question: { en: 'A household\'s APC exceeds 1 in a given period. What does that mean, and is it sustainable?', hi: 'एक परिवार का APC किसी अवधि में 1 से अधिक है। इसका क्या अर्थ है, और क्या यह टिकाऊ है?' },
                options: [
                    { en: 'They are dissaving (spending more than income, e.g. from past savings or borrowing) — not sustainable indefinitely', hi: 'वे बचत-अपकर्षण कर रहे हैं (आय से अधिक खर्च, जैसे पिछली बचत या उधार से) — यह अनिश्चित काल तक टिकाऊ नहीं है' },
                    { en: 'They are saving a large fraction of income', hi: 'वे आय का एक बड़ा हिस्सा बचा रहे हैं' },
                    { en: 'This is mathematically impossible', hi: 'यह गणितीय रूप से असंभव है' },
                    { en: 'Their income must be negative', hi: 'उनकी आय अवश्य ऋणात्मक होनी चाहिए' }
                ],
                correctIndex: 0,
                explain: { en: 'APC = C/Y > 1 means Consumption exceeds Income — the gap must come from drawing down savings or borrowing, which cannot continue forever.', hi: 'APC = C/Y > 1 का अर्थ है उपभोग आय से अधिक है — अंतर पिछली बचत या उधार से आना चाहिए, जो हमेशा के लिए जारी नहीं रह सकता।' }
            }
        ],
        applyTemplates: [
            {
                level: 'apply',
                build(rows, metrics) {
                    if (!metrics || typeof metrics.MPC !== 'number') return null;
                    const correct = Math.round(metrics.MPC * 100) / 100;
                    const options = quizNumericOptions(correct, [0.15, -0.15, 0.3], { round: 2 });
                    return {
                        question: { en: 'For the Income/Consumption data currently shown, what is the fitted MPC?', hi: 'वर्तमान में दिखाए गए आय/उपभोग डेटा के लिए, फिट किया गया MPC क्या है?' },
                        options,
                        correctIndex: 0,
                        explain: { en: `Read the "MPC (fitted slope)" row in Live Readings: ${correct}.`, hi: `Live Readings में "MPC (fitted slope)" पंक्ति पढ़ें: ${correct}।` }
                    };
                }
            }
        ]
    };
}
