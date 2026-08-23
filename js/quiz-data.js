// Quiz banks for the 6 sims defined in js/simulations.js. See
// js/quiz-engine.js's header for the QUIZ_BANK data contract and how
// `applyTemplates` generate fresh, live-computed questions.

if (typeof QUIZ_BANK !== 'undefined') {
    QUIZ_BANK['micro-supply-demand'] = {
        static: [
            {
                level: 'remember',
                question: { en: 'Which of these is a DEMAND-side determinant in this lab (not a supply-side one)?', hi: 'इनमें से कौन-सा इस लैब में माँग-पक्ष (डिमांड-साइड) का कारक है (आपूर्ति-पक्ष का नहीं)?' },
                options: [
                    { en: 'Consumer Income', hi: 'उपभोक्ता की आय' },
                    { en: 'Input / Factor Cost', hi: 'इनपुट / फैक्टर लागत' },
                    { en: 'Technology', hi: 'तकनीक' },
                    { en: 'Govt. Tax / Subsidy', hi: 'सरकारी कर / सब्सिडी' }
                ],
                correctIndex: 0,
                explain: { en: 'Consumer Income, Price of Substitute/Complement, and Tastes shift Demand; Input Cost, Technology and Govt. Tax/Subsidy shift Supply.', hi: 'उपभोक्ता आय, स्थानापन्न/पूरक वस्तु की कीमत और रुचियाँ माँग को शिफ्ट करती हैं; इनपुट लागत, तकनीक और सरकारी कर/सब्सिडी आपूर्ति को शिफ्ट करते हैं।' },
                syllabusId: 'XI-B-U5-DEMAND'
            },
            {
                level: 'understand',
                question: { en: 'If the Price of a Complement Good rises, what happens to Demand for THIS good?', hi: 'यदि किसी पूरक वस्तु (Complement) की कीमत बढ़ती है, तो इस वस्तु की माँग का क्या होगा?' },
                options: [
                    { en: 'Demand increases (shifts right)', hi: 'माँग बढ़ती है (दाईं ओर शिफ्ट)' },
                    { en: 'Demand decreases (shifts left)', hi: 'माँग घटती है (बाईं ओर शिफ्ट)' },
                    { en: 'Supply increases', hi: 'आपूर्ति बढ़ती है' },
                    { en: 'No change to either curve', hi: 'किसी भी वक्र में कोई परिवर्तन नहीं' }
                ],
                correctIndex: 1,
                explain: { en: 'Complements are used together (e.g. cars and petrol) — a costlier complement makes this good less attractive, so demand falls (shifts left).', hi: 'पूरक वस्तुएँ साथ में उपयोग होती हैं (जैसे कार और पेट्रोल) — पूरक वस्तु महँगी होने पर यह वस्तु कम आकर्षक हो जाती है, इसलिए माँग घटती है (बाईं ओर शिफ्ट)।' },
                syllabusId: 'XI-B-U5-DEMAND'
            },
            {
                level: 'analyse',
                question: { en: 'A rise in Input/Factor Cost shifts the Supply curve which way, and why?', hi: 'इनपुट/फैक्टर लागत में वृद्धि आपूर्ति वक्र को किस दिशा में शिफ्ट करती है, और क्यों?' },
                options: [
                    { en: 'Left/up — producers need a higher price for the same quantity', hi: 'बाईं/ऊपर — उत्पादकों को समान मात्रा के लिए अधिक कीमत चाहिए' },
                    { en: 'Right/down — production becomes cheaper', hi: 'दाईं/नीचे — उत्पादन सस्ता हो जाता है' },
                    { en: 'It does not move the supply curve at all', hi: 'यह आपूर्ति वक्र को बिल्कुल भी नहीं हिलाता' },
                    { en: 'It shifts the demand curve instead', hi: 'यह इसके बजाय माँग वक्र को शिफ्ट करता है' }
                ],
                correctIndex: 0,
                explain: { en: 'Higher costs mean sellers need a higher price to supply the same quantity — the supply curve shifts left (a decrease in supply).', hi: 'अधिक लागत का मतलब है कि विक्रेताओं को समान मात्रा की आपूर्ति के लिए अधिक कीमत चाहिए — आपूर्ति वक्र बाईं ओर शिफ्ट होता है (आपूर्ति में कमी)।' },
                syllabusId: 'XI-B-U6-SUPPLY'
            },
            {
                level: 'evaluate',
                question: { en: 'Consumer Income rises AND Input Cost rises at the same time. What can you say for certain about Equilibrium Price?', hi: 'उपभोक्ता आय बढ़ती है और साथ ही इनपुट लागत भी बढ़ती है। संतुलन कीमत के बारे में आप निश्चित रूप से क्या कह सकते हैं?' },
                options: [
                    { en: 'It must rise — both push price up', hi: 'यह अवश्य बढ़ेगी — दोनों कारक कीमत को ऊपर धकेलते हैं' },
                    { en: 'It must fall', hi: 'यह अवश्य घटेगी' },
                    { en: 'It stays exactly the same', hi: 'यह बिल्कुल वैसी ही रहेगी' },
                    { en: 'It becomes negative', hi: 'यह ऋणात्मक हो जाएगी' }
                ],
                correctIndex: 0,
                explain: { en: 'Higher income shifts demand right; higher input cost shifts supply left — both effects push price up, so price rises unambiguously (quantity\'s change is ambiguous, but price\'s is not).', hi: 'अधिक आय माँग को दाईं ओर शिफ्ट करती है; अधिक इनपुट लागत आपूर्ति को बाईं ओर शिफ्ट करती है — दोनों प्रभाव कीमत को ऊपर धकेलते हैं, इसलिए कीमत निश्चित रूप से बढ़ती है (मात्रा में परिवर्तन अनिश्चित है, पर कीमत में नहीं)।' }
            }
        ],
        applyTemplates: [
            {
                level: 'apply',
                build(state, metrics) {
                    if (!metrics || typeof metrics.equilibriumPrice !== 'number') return null;
                    const correct = Math.round(metrics.equilibriumPrice);
                    const options = quizNumericOptions(correct, [8, -8, 16], { round: 0, prefix: '₹' });
                    return {
                        question: {
                            en: `With Income=${state.income}, Price of Substitute=${state.priceSub}, Price of Complement=${state.priceComp}, Tastes=${state.tastes}, Input Cost=${state.inputCost}, Technology=${state.tech}, Govt=${state.govt} — what is the Equilibrium Price (to the nearest ₹)?`,
                            hi: `Income=${state.income}, Price of Substitute=${state.priceSub}, Price of Complement=${state.priceComp}, Tastes=${state.tastes}, Input Cost=${state.inputCost}, Technology=${state.tech}, Govt=${state.govt} के साथ — संतुलन कीमत (निकटतम ₹ तक) क्या है?`
                        },
                        options,
                        correctIndex: 0,
                        explain: { en: `Equilibrium is where Quantity Demanded = Quantity Supplied, i.e. where the Demand and Supply lines cross on the chart — here, ₹${correct}.`, hi: `संतुलन वहाँ होता है जहाँ माँगी गई मात्रा = आपूर्ति की गई मात्रा, यानी चार्ट पर माँग और आपूर्ति रेखाएँ मिलती हैं — यहाँ, ₹${correct}।` }
                    };
                }
            }
        ]
    };

    QUIZ_BANK['micro-elasticity'] = {
        static: [
            {
                level: 'remember',
                question: { en: 'Price elasticity of demand (Ed) is defined as…', hi: 'माँग की कीमत लोच (Ed) को परिभाषित किया जाता है…' },
                options: [
                    { en: '%ΔQuantity Demanded ÷ %ΔPrice', hi: 'माँगी गई मात्रा में % परिवर्तन ÷ कीमत में % परिवर्तन' },
                    { en: '%ΔPrice ÷ %ΔQuantity Demanded', hi: 'कीमत में % परिवर्तन ÷ माँगी गई मात्रा में % परिवर्तन' },
                    { en: 'Price ÷ Quantity', hi: 'कीमत ÷ मात्रा' },
                    { en: 'Total Revenue ÷ Price', hi: 'कुल आय ÷ कीमत' }
                ],
                correctIndex: 0,
                explain: { en: 'Ed = (percentage change in quantity demanded) / (percentage change in price).', hi: 'Ed = (माँगी गई मात्रा में प्रतिशत परिवर्तन) / (कीमत में प्रतिशत परिवर्तन)।' },
                syllabusId: 'XI-B-U5-ELASTICITY'
            },
            {
                level: 'understand',
                question: { en: 'As the Number of Close Substitutes for a good increases, its price elasticity of demand becomes…', hi: 'किसी वस्तु के निकट स्थानापन्नों (substitutes) की संख्या बढ़ने पर, उसकी माँग की कीमत लोच…' },
                options: [
                    { en: 'More elastic (larger |Ed|)', hi: 'अधिक लोचदार (बड़ा |Ed|)' },
                    { en: 'More inelastic (smaller |Ed|)', hi: 'अधिक बेलोचदार (छोटा |Ed|)' },
                    { en: 'Exactly zero', hi: 'बिल्कुल शून्य' },
                    { en: 'Unaffected by substitutes', hi: 'स्थानापन्नों से अप्रभावित' }
                ],
                correctIndex: 0,
                explain: { en: 'More substitutes make it easy to switch away when price rises, so demand responds more strongly — elasticity rises.', hi: 'अधिक स्थानापन्न होने पर कीमत बढ़ने पर वस्तु बदलना आसान होता है, इसलिए माँग अधिक तेज़ी से प्रतिक्रिया करती है — लोच बढ़ जाती है।' },
                syllabusId: 'XI-B-U5-ELASTICITY'
            },
            {
                level: 'analyse',
                question: { en: 'If |Ed| < 1, demand is classified as…', hi: 'यदि |Ed| < 1 है, तो माँग को कहा जाता है…' },
                options: [
                    { en: 'Inelastic', hi: 'बेलोचदार (Inelastic)' },
                    { en: 'Elastic', hi: 'लोचदार (Elastic)' },
                    { en: 'Unit elastic', hi: 'इकाई लोचदार (Unit Elastic)' },
                    { en: 'Perfectly elastic', hi: 'पूर्णतः लोचदार (Perfectly Elastic)' }
                ],
                correctIndex: 0,
                explain: { en: '|Ed| < 1 means %ΔQ is smaller than %ΔP — quantity barely responds, so demand is inelastic.', hi: '|Ed| < 1 का अर्थ है %ΔQ, %ΔP से छोटा है — मात्रा बहुत कम प्रतिक्रिया देती है, इसलिए माँग बेलोचदार है।' },
                syllabusId: 'XI-B-U5-ELASTICITY'
            },
            {
                level: 'evaluate',
                question: { en: 'A firm selling a good with INELASTIC demand wants to raise Total Revenue. What should it do?', hi: 'बेलोचदार माँग वाली वस्तु बेचने वाली फर्म कुल आय (Total Revenue) बढ़ाना चाहती है। उसे क्या करना चाहिए?' },
                options: [
                    { en: 'Raise the price', hi: 'कीमत बढ़ाए' },
                    { en: 'Lower the price', hi: 'कीमत घटाए' },
                    { en: 'Keep price and output both unchanged', hi: 'कीमत और उत्पादन दोनों को अपरिवर्तित रखे' },
                    { en: 'Give the good away for free', hi: 'वस्तु मुफ़्त में दे दे' }
                ],
                correctIndex: 0,
                explain: { en: 'When demand is inelastic, quantity falls proportionally less than price rises — so raising price increases Total Revenue (Price × Quantity).', hi: 'जब माँग बेलोचदार होती है, मात्रा में गिरावट कीमत में वृद्धि की तुलना में अनुपातिक रूप से कम होती है — इसलिए कीमत बढ़ाने से कुल आय (कीमत × मात्रा) बढ़ती है।' }
            }
        ],
        applyTemplates: [
            {
                level: 'apply',
                build(state, metrics) {
                    if (!metrics || metrics.mode !== 'price' || typeof metrics.Ed !== 'number') return null;
                    const correct = Math.round(metrics.Ed * 100) / 100;
                    const options = quizNumericOptions(correct, [0.4, -0.4, 0.8], { round: 2 });
                    return {
                        question: { en: `At Price=₹${state.price} with ${state.substitutes} close substitute(s), what is the Price Elasticity of Demand (Ed)?`, hi: `कीमत=₹${state.price} और ${state.substitutes} निकट स्थानापन्न(नों) के साथ, माँग की कीमत लोच (Ed) क्या है?` },
                        options,
                        correctIndex: 0,
                        explain: { en: `Ed = (dQ/dP) × (P/Q), read directly off the Live Readings panel at these settings: ${correct}.`, hi: `Ed = (dQ/dP) × (P/Q), इन सेटिंग्स पर Live Readings पैनल से सीधे पढ़ा गया: ${correct}।` }
                    };
                }
            }
        ]
    };

    QUIZ_BANK['macro-gdp'] = {
        static: [
            {
                level: 'remember',
                question: { en: 'In the circular flow, "Factor Services" flow from Households to Firms as part of…', hi: 'चक्रीय प्रवाह (Circular Flow) में, "फैक्टर सेवाएँ" परिवारों से फर्मों की ओर किसके भाग के रूप में प्रवाहित होती हैं…' },
                options: [
                    { en: 'The real flow', hi: 'वास्तविक प्रवाह (Real Flow)' },
                    { en: 'The money flow', hi: 'मुद्रा प्रवाह (Money Flow)' },
                    { en: 'Neither flow', hi: 'दोनों में से कोई नहीं' },
                    { en: 'The foreign sector only', hi: 'केवल विदेशी क्षेत्र' }
                ],
                correctIndex: 0,
                explain: { en: 'Factor services (labour, land, capital, enterprise) are physical/real things that change hands — that\'s the real flow, paid for by the opposite-direction money flow (factor payments).', hi: 'फैक्टर सेवाएँ (श्रम, भूमि, पूँजी, उद्यम) भौतिक/वास्तविक चीज़ें हैं जो हाथ बदलती हैं — यही वास्तविक प्रवाह है, जिसका भुगतान विपरीत दिशा में मुद्रा प्रवाह (फैक्टर भुगतान) से होता है।' },
                syllabusId: 'XII-A-U1-CIRCULAR-FLOW'
            },
            {
                level: 'understand',
                question: { en: 'Why does the real flow move in the OPPOSITE direction to the money flow for the same transaction?', hi: 'एक ही लेन-देन के लिए वास्तविक प्रवाह मुद्रा प्रवाह की विपरीत दिशा में क्यों चलता है?' },
                options: [
                    { en: 'The money flow is the payment FOR what the real flow delivers', hi: 'मुद्रा प्रवाह वास्तविक प्रवाह द्वारा दी गई चीज़ का भुगतान है' },
                    { en: 'It is a coincidence with no economic reason', hi: 'यह बिना किसी आर्थिक कारण के एक संयोग है' },
                    { en: 'Government regulation requires it', hi: 'यह सरकारी नियमन द्वारा आवश्यक है' },
                    { en: 'Real flows do not actually exist', hi: 'वास्तविक प्रवाह वास्तव में मौजूद नहीं होते' }
                ],
                correctIndex: 0,
                explain: { en: 'Every transaction has two sides: what changes hands (real) and what pays for it (money) — moving opposite ways is exactly what "payment for a good/service received" means.', hi: 'हर लेन-देन के दो पक्ष होते हैं: क्या हाथ बदलता है (वास्तविक) और उसका भुगतान क्या करता है (मुद्रा) — विपरीत दिशा में चलना ही "प्राप्त वस्तु/सेवा के लिए भुगतान" का अर्थ है।' },
                syllabusId: 'XII-A-U1-CIRCULAR-FLOW'
            },
            {
                level: 'analyse',
                question: { en: 'Which of these is an INJECTION into the circular flow of income?', hi: 'इनमें से कौन-सा आय के चक्रीय प्रवाह में एक "इंजेक्शन" (वृद्धिकारक प्रवाह) है?' },
                options: [
                    { en: 'Government Spending (G)', hi: 'सरकारी व्यय (G)' },
                    { en: 'Taxes (T)', hi: 'कर (T)' },
                    { en: 'Imports (M)', hi: 'आयात (M)' },
                    { en: 'Household Saving', hi: 'परिवारों की बचत' }
                ],
                correctIndex: 0,
                explain: { en: 'Government Spending and Exports are injections (add to the flow); Taxes, Imports and Saving are leakages (withdraw from it).', hi: 'सरकारी व्यय और निर्यात इंजेक्शन हैं (प्रवाह में जोड़ते हैं); कर, आयात और बचत लीकेज (रिसाव) हैं (इससे निकालते हैं)।' }
            },
            {
                level: 'create',
                question: { en: 'A student wants to redraw this circular flow to also include a bank sector. Where would "household saving" most logically be added?', hi: 'एक छात्र इस चक्रीय प्रवाह को बैंक क्षेत्र शामिल करने के लिए फिर से बनाना चाहता है। "परिवारों की बचत" को तार्किक रूप से कहाँ जोड़ा जाएगा?' },
                options: [
                    { en: 'As a leakage from Households into the financial/banking sector', hi: 'परिवारों से वित्तीय/बैंकिंग क्षेत्र में एक लीकेज (रिसाव) के रूप में' },
                    { en: 'As a factor payment from Firms', hi: 'फर्मों से एक फैक्टर भुगतान के रूप में' },
                    { en: 'As government expenditure', hi: 'सरकारी व्यय के रूप में' },
                    { en: 'It cannot be shown in a circular flow at all', hi: 'इसे चक्रीय प्रवाह में बिल्कुल नहीं दिखाया जा सकता' }
                ],
                correctIndex: 0,
                explain: { en: 'Saving is income not spent on consumption — it leaves (leaks out of) the household-firm spending loop into the financial sector, from where it can be re-injected as investment.', hi: 'बचत वह आय है जो उपभोग पर खर्च नहीं होती — यह परिवार-फर्म खर्च चक्र से निकलकर (रिसकर) वित्तीय क्षेत्र में चली जाती है, जहाँ से इसे निवेश के रूप में पुनः इंजेक्ट किया जा सकता है।' }
            }
        ],
        applyTemplates: [
            {
                level: 'apply',
                build(state, metrics) {
                    if (!metrics || typeof metrics.gdpExp !== 'number') return null;
                    const correct = Math.round(metrics.gdpExp);
                    const options = quizNumericOptions(correct, [20, -20, 40], { round: 0, prefix: '₹', suffix: 'B' });
                    return {
                        question: { en: `With Consumption=₹${metrics.consumption}B, Government Spending=₹${metrics.g}B and Net Exports=₹${metrics.nx}B (Investment fixed at ₹50B for this illustration), what is GDP by the Expenditure Method (C+I+G+NX)?`, hi: `उपभोग=₹${metrics.consumption}B, सरकारी व्यय=₹${metrics.g}B और निवल निर्यात=₹${metrics.nx}B के साथ (इस उदाहरण के लिए निवेश ₹50B पर स्थिर), व्यय विधि (C+I+G+NX) से GDP क्या है?` },
                        options,
                        correctIndex: 0,
                        explain: { en: `GDP (Expenditure Method) = C + I + G + (X−M) = ${metrics.consumption} + 50 + ${metrics.g} + ${metrics.nx} = ₹${correct}B.`, hi: `GDP (व्यय विधि) = C + I + G + (X−M) = ${metrics.consumption} + 50 + ${metrics.g} + ${metrics.nx} = ₹${correct}B.` }
                    };
                }
            }
        ]
    };

    QUIZ_BANK['macro-multiplier'] = {
        static: [
            {
                level: 'remember',
                question: { en: 'The Investment Multiplier (k) is calculated as…', hi: 'निवेश गुणक (k) की गणना इस प्रकार की जाती है…' },
                options: [
                    { en: 'k = 1 / (1 − MPC)', hi: 'k = 1 / (1 − MPC)' },
                    { en: 'k = 1 / MPC', hi: 'k = 1 / MPC' },
                    { en: 'k = MPC / (1 − MPC)', hi: 'k = MPC / (1 − MPC)' },
                    { en: 'k = 1 − MPC', hi: 'k = 1 − MPC' }
                ],
                correctIndex: 0,
                explain: { en: 'k = 1/(1−MPC) — the standard multiplier formula, where MPC is the Marginal Propensity to Consume.', hi: 'k = 1/(1−MPC) — मानक गुणक सूत्र, जहाँ MPC सीमांत उपभोग प्रवृत्ति है।' },
                syllabusId: 'XII-A-U3-MULTIPLIER'
            },
            {
                level: 'understand',
                question: { en: 'As MPC rises toward 1, what happens to the multiplier k?', hi: 'जैसे-जैसे MPC 1 की ओर बढ़ता है, गुणक k का क्या होता है?' },
                options: [
                    { en: 'k grows very large', hi: 'k बहुत बड़ा हो जाता है' },
                    { en: 'k shrinks toward 0', hi: 'k घटकर 0 के पास पहुँच जाता है' },
                    { en: 'k stays exactly 1', hi: 'k बिल्कुल 1 पर रहता है' },
                    { en: 'k becomes negative', hi: 'k ऋणात्मक हो जाता है' }
                ],
                correctIndex: 0,
                explain: { en: 'As MPC → 1, (1−MPC) → 0, and k = 1/(1−MPC) → ∞ — each extra rupee of income keeps getting almost entirely re-spent.', hi: 'जैसे-जैसे MPC → 1, (1−MPC) → 0, और k = 1/(1−MPC) → ∞ — आय की हर अतिरिक्त रुपये लगभग पूरी तरह पुनः खर्च होती रहती है।' },
                syllabusId: 'XII-A-U3-MULTIPLIER'
            },
            {
                level: 'analyse',
                question: { en: 'Why is the Tax Multiplier (kt) always SMALLER in magnitude than the Investment/Spending Multiplier (k)?', hi: 'कर गुणक (kt) परिमाण में निवेश/व्यय गुणक (k) से हमेशा छोटा क्यों होता है?' },
                options: [
                    { en: 'A tax change affects spending only indirectly, through disposable income', hi: 'कर परिवर्तन खर्च को केवल अप्रत्यक्ष रूप से, प्रयोज्य आय के माध्यम से प्रभावित करता है' },
                    { en: 'Taxes are illegal so their multiplier is capped', hi: 'कर अवैध हैं इसलिए उनका गुणक सीमित है' },
                    { en: 'kt and k are actually always equal', hi: 'kt और k वास्तव में हमेशा बराबर होते हैं' },
                    { en: 'The government does not allow kt to exceed k', hi: 'सरकार kt को k से अधिक होने की अनुमति नहीं देती' }
                ],
                correctIndex: 0,
                explain: { en: 'A rupee of G or I is spent directly and in full; a rupee of tax cut only becomes spending after the MPC fraction is applied — so kt = −MPC/(1−MPC), smaller in magnitude than k = 1/(1−MPC) by exactly 1.', hi: 'G या I का एक रुपया सीधे और पूरी तरह खर्च होता है; कर में कटौती का एक रुपया MPC अंश लागू होने के बाद ही खर्च बनता है — इसलिए kt = −MPC/(1−MPC), जो k = 1/(1−MPC) से परिमाण में ठीक 1 कम है।' }
            },
            {
                level: 'evaluate',
                question: { en: 'To close a deflationary gap with the SMALLEST change in the government budget, a policymaker should prefer…', hi: 'सरकारी बजट में सबसे कम परिवर्तन के साथ अपस्फीतिकारी अंतराल (deflationary gap) को बंद करने के लिए, एक नीति-निर्माता को क्या प्राथमिकता देनी चाहिए…' },
                options: [
                    { en: 'Raising Government Spending (G) rather than cutting taxes by the same amount', hi: 'समान राशि से कर कटौती के बजाय सरकारी व्यय (G) बढ़ाना' },
                    { en: 'Cutting taxes by the same amount rather than raising G', hi: 'G बढ़ाने के बजाय समान राशि से कर कटौती करना' },
                    { en: 'Both have identical effect, so it does not matter', hi: 'दोनों का प्रभाव समान है, इसलिए इससे कोई फ़र्क नहीं पड़ता' },
                    { en: 'Neither policy can affect national income', hi: 'कोई भी नीति राष्ट्रीय आय को प्रभावित नहीं कर सकती' }
                ],
                correctIndex: 0,
                explain: { en: 'Since |k| > |kt|, an equal-sized change in G raises income by MORE than the same-sized tax cut — so G achieves the same goal with a smaller budgetary change.', hi: 'चूँकि |k| > |kt|, G में समान आकार का परिवर्तन समान आकार की कर कटौती की तुलना में आय को अधिक बढ़ाता है — इसलिए G, छोटे बजटीय परिवर्तन के साथ ही समान लक्ष्य प्राप्त कर लेता है।' }
            }
        ],
        applyTemplates: [
            {
                level: 'apply',
                build(state, metrics) {
                    if (!metrics || typeof metrics.k !== 'number') return null;
                    const correct = Math.round(metrics.k * 100) / 100;
                    const options = quizNumericOptions(correct, [1, -1, 2.5], { round: 2 });
                    return {
                        question: { en: `At MPC = ${state.mpc}, what is the Investment Multiplier k?`, hi: `MPC = ${state.mpc} पर, निवेश गुणक k क्या है?` },
                        options,
                        correctIndex: 0,
                        explain: { en: `k = 1/(1−MPC) = 1/(1−${state.mpc}) = ${correct}.`, hi: `k = 1/(1−MPC) = 1/(1−${state.mpc}) = ${correct}।` }
                    };
                }
            },
            {
                level: 'apply',
                build(state, metrics) {
                    if (!metrics || typeof metrics.dySpending !== 'number') return null;
                    const correct = Math.round(metrics.dySpending);
                    const options = quizNumericOptions(correct, [correct * 0.3 || 5, -(correct * 0.3) || -5, correct * 0.6 || 10], { round: 0, prefix: '₹', suffix: 'B' });
                    return {
                        question: { en: `At MPC=${state.mpc}, ΔI=₹${state.di}B and ΔG=₹${state.dg}B, what is the total increase in income from spending (ΔY = k×(ΔI+ΔG))?`, hi: `MPC=${state.mpc}, ΔI=₹${state.di}B और ΔG=₹${state.dg}B पर, व्यय से आय में कुल वृद्धि (ΔY = k×(ΔI+ΔG)) क्या है?` },
                        options,
                        correctIndex: 0,
                        explain: { en: `ΔY = k × (ΔI + ΔG) = ${Math.round(metrics.k * 100) / 100} × (${state.di}+${state.dg}) ≈ ₹${correct}B.`, hi: `ΔY = k × (ΔI + ΔG) = ${Math.round(metrics.k * 100) / 100} × (${state.di}+${state.dg}) ≈ ₹${correct}B.` }
                    };
                }
            }
        ]
    };

    QUIZ_BANK['stats-correlation'] = {
        static: [
            {
                level: 'remember',
                question: { en: 'Karl Pearson\'s Correlation Coefficient (r) always lies in the range…', hi: 'कार्ल पियर्सन सहसंबंध गुणांक (r) हमेशा किस सीमा में होता है…' },
                options: [
                    { en: '−1 to +1', hi: '−1 से +1' },
                    { en: '0 to 100', hi: '0 से 100' },
                    { en: '−∞ to +∞', hi: '−∞ से +∞' },
                    { en: '0 to 1 only', hi: 'केवल 0 से 1' }
                ],
                correctIndex: 0,
                explain: { en: 'r always lies between −1 (perfect negative) and +1 (perfect positive) correlation.', hi: 'r हमेशा −1 (पूर्ण ऋणात्मक) और +1 (पूर्ण धनात्मक) सहसंबंध के बीच होता है।' },
                syllabusId: 'XI-A-U3-CORRELATION'
            },
            {
                level: 'understand',
                question: { en: "Spearman's Rank Correlation is especially useful when…", hi: "स्पीयरमैन रैंक सहसंबंध विशेष रूप से तब उपयोगी होता है जब…" },
                options: [
                    { en: 'Data is ordinal, or you want an outlier-resistant quick measure using ranks', hi: 'डेटा क्रमसूचक (ordinal) है, या आप रैंक का उपयोग करके एक आउटलायर-प्रतिरोधी त्वरित माप चाहते हैं' },
                    { en: 'You need the exact numerical strength of a linear relationship', hi: 'आपको एक रैखिक संबंध की सटीक संख्यात्मक शक्ति चाहिए' },
                    { en: 'There are no repeated values at all', hi: 'बिल्कुल भी कोई दोहराया गया मान नहीं है' },
                    { en: 'You only have one variable', hi: 'आपके पास केवल एक चर है' }
                ],
                correctIndex: 0,
                explain: { en: "Spearman's uses ranks, not raw values, so it works well for ordinal data and is less sensitive to a single outlier than Pearson's r.", hi: "स्पीयरमैन रैंक का उपयोग करता है, कच्चे मानों का नहीं, इसलिए यह क्रमसूचक डेटा के लिए अच्छा काम करता है और पियर्सन के r की तुलना में एक अकेले आउटलायर के प्रति कम संवेदनशील है।" },
                syllabusId: 'XI-A-U3-CORRELATION'
            },
            {
                level: 'analyse',
                question: { en: 'A scatter diagram shows points sloping downward from top-left to bottom-right. This suggests correlation is…', hi: 'एक प्रकीर्णन आरेख (scatter diagram) में बिंदु ऊपर-बाएँ से नीचे-दाएँ की ओर ढलान दिखाते हैं। यह सुझाव देता है कि सहसंबंध है…' },
                options: [
                    { en: 'Negative', hi: 'ऋणात्मक' },
                    { en: 'Positive', hi: 'धनात्मक' },
                    { en: 'Zero', hi: 'शून्य' },
                    { en: 'Undefined', hi: 'अपरिभाषित' }
                ],
                correctIndex: 0,
                explain: { en: 'A downward-sloping scatter (as X rises, Y falls) is the visual signature of negative correlation.', hi: 'नीचे की ओर ढलान वाला प्रकीर्णन (जैसे-जैसे X बढ़ता है, Y घटता है) ऋणात्मक सहसंबंध का दृश्य संकेत है।' }
            },
            {
                level: 'create',
                question: { en: "You have Study Hours and Test Scores for 8 students, but 3 students recorded IDENTICAL Study Hours. Which measure needs a special tie-handling adjustment?", hi: "आपके पास 8 छात्रों के अध्ययन घंटे और परीक्षा अंक हैं, लेकिन 3 छात्रों ने समान अध्ययन घंटे दर्ज किए। किस माप को टाई (बराबर मान) संभालने के लिए विशेष समायोजन चाहिए?" },
                options: [
                    { en: "Spearman's Rank Correlation (average/mid-ranks for the tied values)", hi: "स्पीयरमैन रैंक सहसंबंध (बराबर मानों के लिए औसत/मध्य-रैंक)" },
                    { en: "Karl Pearson's r (it ignores ties entirely)", hi: "कार्ल पियर्सन का r (यह टाई को पूरी तरह से नज़रअंदाज़ करता है)" },
                    { en: 'Neither measure is affected by ties', hi: 'दोनों में से किसी भी माप पर टाई का प्रभाव नहीं पड़ता' },
                    { en: 'The Mean of the dataset', hi: 'डेटासेट का माध्य (Mean)' }
                ],
                correctIndex: 0,
                explain: { en: "Since Spearman's works on ranks, tied raw values must share an averaged ('mid') rank — this Data Lab does exactly that automatically.", hi: "चूँकि स्पीयरमैन रैंक पर काम करता है, बराबर कच्चे मानों को एक औसत ('मध्य') रैंक साझा करना चाहिए — यह डेटा लैब स्वतः यही करता है।" }
            }
        ],
        applyTemplates: [
            {
                level: 'apply',
                build(rows, metrics) {
                    if (!metrics || typeof metrics.pearsonR !== 'number') return null;
                    const correct = Math.round(metrics.pearsonR * 100) / 100;
                    const options = quizNumericOptions(correct, [0.3, -0.3, 0.6], { round: 2 });
                    return {
                        question: { en: 'For the current Study Hours / Test Score table shown in the Data Lab, what is the Karl Pearson correlation coefficient (r)?', hi: 'डेटा लैब में दिखाई गई वर्तमान अध्ययन घंटे / परीक्षा अंक तालिका के लिए, कार्ल पियर्सन सहसंबंध गुणांक (r) क्या है?' },
                        options,
                        correctIndex: 0,
                        explain: { en: `Read directly from the "Karl Pearson's r" row in Live Readings: ${correct}.`, hi: `Live Readings में "Karl Pearson's r" पंक्ति से सीधे पढ़ें: ${correct}।` }
                    };
                }
            }
        ]
    };

    QUIZ_BANK['india-poverty'] = {
        static: [
            {
                level: 'remember',
                question: { en: 'The Headcount Ratio measures…', hi: 'हेडकाउंट अनुपात (Headcount Ratio) किसे मापता है…' },
                options: [
                    { en: 'The percentage of population below the poverty line', hi: 'गरीबी रेखा से नीचे जनसंख्या का प्रतिशत' },
                    { en: 'The average income of the richest 10%', hi: 'सबसे अमीर 10% की औसत आय' },
                    { en: 'The total number of billionaires in a country', hi: 'किसी देश में अरबपतियों की कुल संख्या' },
                    { en: 'The Gini coefficient', hi: 'गिनी गुणांक' }
                ],
                correctIndex: 0,
                explain: { en: 'The Headcount Ratio is the share of the population whose consumption expenditure falls below the poverty line.', hi: 'हेडकाउंट अनुपात वह जनसंख्या हिस्सा है जिसका उपभोग व्यय गरीबी रेखा से नीचे है।' }
            },
            {
                level: 'understand',
                question: { en: 'A Gini coefficient closer to 1 indicates…', hi: 'गिनी गुणांक जो 1 के करीब हो, वह दर्शाता है…' },
                options: [
                    { en: 'Higher income inequality', hi: 'अधिक आय असमानता' },
                    { en: 'Perfect equality', hi: 'पूर्ण समानता' },
                    { en: 'Zero poverty', hi: 'शून्य गरीबी' },
                    { en: 'A shrinking population', hi: 'घटती हुई जनसंख्या' }
                ],
                correctIndex: 0,
                explain: { en: 'Gini = 0 is perfect equality; Gini = 1 is maximum inequality — closer to 1 means more unequal.', hi: 'गिनी = 0 पूर्ण समानता है; गिनी = 1 अधिकतम असमानता है — 1 के करीब होने का अर्थ है अधिक असमानता।' }
            },
            {
                level: 'analyse',
                question: { en: 'On a Lorenz Curve, the further the curve bows away from the diagonal "line of equality"…', hi: 'लोरेन्ज़ वक्र (Lorenz Curve) पर, वक्र विकर्ण "समानता रेखा" से जितना अधिक दूर मुड़ता है…' },
                options: [
                    { en: 'The greater the income inequality', hi: 'आय असमानता उतनी ही अधिक होती है' },
                    { en: 'The lower the income inequality', hi: 'आय असमानता उतनी ही कम होती है' },
                    { en: 'The higher the population', hi: 'जनसंख्या उतनी ही अधिक होती है' },
                    { en: 'It has no relationship to inequality', hi: 'इसका असमानता से कोई संबंध नहीं है' }
                ],
                correctIndex: 0,
                explain: { en: 'The Lorenz curve coincides with the diagonal under perfect equality — the further it bows away, the more unevenly income is distributed.', hi: 'पूर्ण समानता में लोरेन्ज़ वक्र विकर्ण के साथ मेल खाता है — यह जितना अधिक दूर मुड़ता है, आय का वितरण उतना ही असमान होता है।' }
            },
            {
                level: 'evaluate',
                question: { en: 'If the government raises the official Poverty Line without changing anyone\'s actual income, what happens to the measured Headcount Ratio, and is that a real improvement in living standards?', hi: 'यदि सरकार किसी की वास्तविक आय बदले बिना आधिकारिक गरीबी रेखा बढ़ाती है, तो मापे गए हेडकाउंट अनुपात का क्या होता है, और क्या यह जीवन स्तर में वास्तविक सुधार है?' },
                options: [
                    { en: 'The Headcount Ratio rises — but this is a measurement artifact, not a real change in welfare', hi: 'हेडकाउंट अनुपात बढ़ता है — लेकिन यह एक मापन कलाकृति (artifact) है, कल्याण में वास्तविक बदलाव नहीं' },
                    { en: 'The Headcount Ratio falls, showing genuine improvement', hi: 'हेडकाउंट अनुपात घटता है, जो वास्तविक सुधार दिखाता है' },
                    { en: 'Nothing changes at all', hi: 'कुछ भी नहीं बदलता' },
                    { en: 'The Gini coefficient automatically becomes zero', hi: 'गिनी गुणांक स्वतः शून्य हो जाता है' }
                ],
                correctIndex: 0,
                explain: { en: 'Raising the cutoff (with real incomes unchanged) mechanically pushes more people below it — the poverty statistic moves, but no one is actually worse off, illustrating why the poverty-line choice itself matters.', hi: 'कट-ऑफ बढ़ाने से (वास्तविक आय अपरिवर्तित रहते हुए) यांत्रिक रूप से अधिक लोग उससे नीचे आ जाते हैं — गरीबी का आँकड़ा बदलता है, पर वास्तव में किसी की स्थिति ख़राब नहीं होती — यह दिखाता है कि गरीबी-रेखा का चुनाव स्वयं क्यों महत्वपूर्ण है।' }
            }
        ],
        applyTemplates: [
            {
                level: 'apply',
                build(state, metrics) {
                    if (!metrics || typeof metrics.headcount !== 'number') return null;
                    const correct = Math.round(metrics.headcount * 10) / 10;
                    const options = quizNumericOptions(correct, [10, -10, 20], { round: 1, suffix: '%' });
                    return {
                        question: { en: `At an Inequality Parameter of ${state.e} and a Poverty Line of ₹${state.povLine}/month, what is the (illustrative) Headcount Ratio?`, hi: `असमानता पैरामीटर ${state.e} और गरीबी रेखा ₹${state.povLine}/माह पर, (उदाहरणात्मक) हेडकाउंट अनुपात क्या है?` },
                        options,
                        correctIndex: 0,
                        explain: { en: `Read from the "Headcount Ratio (illustrative)" row in Live Readings: ${correct}%.`, hi: `Live Readings में "Headcount Ratio (illustrative)" पंक्ति से पढ़ें: ${correct}%।` }
                    };
                }
            }
        ]
    };
}
