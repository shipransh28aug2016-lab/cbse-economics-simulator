// Quiz banks for the 12 sims defined in js/simulations_extended.js.
// See js/quiz-engine.js's header for the QUIZ_BANK data contract.

if (typeof QUIZ_BANK !== 'undefined') {
    QUIZ_BANK['micro-consumer-equilibrium'] = {
        static: [
            {
                level: 'remember',
                question: { en: 'The Law of Diminishing Marginal Utility states that as consumption of a good increases…', hi: 'सीमांत उपयोगिता ह्रास नियम (Law of Diminishing Marginal Utility) कहता है कि किसी वस्तु का उपभोग बढ़ने पर…' },
                options: [
                    { en: 'Marginal Utility from each extra unit falls', hi: 'प्रत्येक अतिरिक्त इकाई से सीमांत उपयोगिता घटती है' },
                    { en: 'Marginal Utility keeps rising', hi: 'सीमांत उपयोगिता लगातार बढ़ती रहती है' },
                    { en: 'Total Utility always falls', hi: 'कुल उपयोगिता हमेशा घटती है' },
                    { en: 'Price automatically falls', hi: 'कीमत स्वतः घट जाती है' }
                ],
                correctIndex: 0,
                explain: { en: 'Each successive unit adds less satisfaction than the one before — this is the Law of Diminishing Marginal Utility.', hi: 'प्रत्येक क्रमिक इकाई पिछली की तुलना में कम संतुष्टि जोड़ती है — यही सीमांत उपयोगिता ह्रास नियम है।' },
                syllabusId: 'XI-B-U5-UTILITY'
            },
            {
                level: 'understand',
                question: { en: 'With a single good, a rational consumer stops consuming when…', hi: 'एक वस्तु के साथ, एक तर्कसंगत उपभोक्ता उपभोग कब बंद करता है…' },
                options: [
                    { en: 'MU = 0 (Total Utility is at its maximum)', hi: 'MU = 0 (कुल उपयोगिता अपने अधिकतम पर है)' },
                    { en: 'MU is at its highest', hi: 'MU अपने उच्चतम पर है' },
                    { en: 'Price = 0', hi: 'कीमत = 0' },
                    { en: 'They have consumed exactly 1 unit', hi: 'उन्होंने ठीक 1 इकाई का उपभोग किया है' }
                ],
                correctIndex: 0,
                explain: { en: 'Beyond MU=0, extra units would actually reduce Total Utility, so a rational consumer stops exactly there.', hi: 'MU=0 के बाद, अतिरिक्त इकाइयाँ वास्तव में कुल उपयोगिता को घटा देंगी, इसलिए एक तर्कसंगत उपभोक्ता वहीं रुक जाता है।' },
                syllabusId: 'XI-B-U5-UTILITY'
            },
            {
                level: 'analyse',
                question: { en: 'With MULTIPLE goods and a limited budget, a consumer maximises satisfaction by comparing…', hi: 'कई वस्तुओं और सीमित बजट के साथ, एक उपभोक्ता तुलना करके संतुष्टि को अधिकतम करता है…' },
                options: [
                    { en: 'Marginal Utility per Rupee (MU/P) across goods', hi: 'वस्तुओं में प्रति रुपया सीमांत उपयोगिता (MU/P) की' },
                    { en: 'Total Utility of each good alone', hi: 'प्रत्येक वस्तु की कुल उपयोगिता अकेले की' },
                    { en: 'Just the price of each good', hi: 'केवल प्रत्येक वस्तु की कीमत की' },
                    { en: 'The number of goods available in the market', hi: 'बाज़ार में उपलब्ध वस्तुओं की संख्या की' }
                ],
                correctIndex: 0,
                explain: { en: 'A rational consumer buys more of whichever good gives the highest satisfaction per rupee spent — comparing MU/P, not MU alone.', hi: 'एक तर्कसंगत उपभोक्ता उस वस्तु की अधिक खरीद करता है जो खर्च किए गए प्रति रुपये सबसे अधिक संतुष्टि देती है — MU/P की तुलना, अकेले MU की नहीं।' },
                syllabusId: 'XI-B-U5-UTILITY'
            },
            {
                level: 'evaluate',
                question: { en: 'At the current settings, MU is still positive but small, and MU/P has fallen well below 1. What should the consumer do next?', hi: 'वर्तमान सेटिंग्स पर, MU अभी भी धनात्मक लेकिन छोटा है, और MU/P 1 से काफी नीचे गिर गया है। उपभोक्ता को आगे क्या करना चाहिए?' },
                options: [
                    { en: 'Consider switching spending toward a good with higher MU per rupee, since satisfaction-per-rupee here is now low', hi: 'खर्च को अधिक MU प्रति रुपया वाली वस्तु की ओर मोड़ने पर विचार करें, क्योंकि यहाँ प्रति रुपया संतुष्टि अब कम है' },
                    { en: 'Keep consuming only this good forever', hi: 'हमेशा केवल इसी वस्तु का उपभोग करते रहें' },
                    { en: 'Stop consuming everything entirely', hi: 'सब कुछ का उपभोग पूरी तरह बंद कर दें' },
                    { en: 'Demand a refund', hi: 'रिफंड की माँग करें' }
                ],
                correctIndex: 0,
                explain: { en: 'A falling MU/P signals diminishing returns on that rupee — comparing it against other goods\' MU/P is exactly the multi-good equilibrium logic.', hi: 'गिरता हुआ MU/P उस रुपये पर घटते प्रतिफल का संकेत है — इसकी तुलना अन्य वस्तुओं के MU/P से करना ही बहु-वस्तु संतुलन तर्क है।' }
            }
        ],
        applyTemplates: [
            {
                level: 'apply',
                build(state, metrics) {
                    if (!metrics || typeof metrics.MU !== 'number') return null;
                    const correct = Math.round(metrics.MU * 100) / 100;
                    const options = quizNumericOptions(correct, [3, -3, 6], { round: 2 });
                    return {
                        question: { en: `With Units Consumed (Q) = ${state.q}, and MU = 20 − Q, what is the Marginal Utility?`, hi: `उपभोग की गई इकाइयाँ (Q) = ${state.q}, और MU = 20 − Q के साथ, सीमांत उपयोगिता क्या है?` },
                        options,
                        correctIndex: 0,
                        explain: { en: `MU = 20 − Q = 20 − ${state.q} = ${correct}.`, hi: `MU = 20 − Q = 20 − ${state.q} = ${correct}।` }
                    };
                }
            }
        ]
    };

    QUIZ_BANK['micro-producer-costs'] = {
        static: [
            {
                level: 'remember',
                question: { en: 'Marginal Cost (MC) is defined as…', hi: 'सीमांत लागत (MC) को परिभाषित किया जाता है…' },
                options: [
                    { en: 'ΔTotal Cost / ΔQuantity', hi: 'Δकुल लागत / Δमात्रा' },
                    { en: 'Total Cost / Quantity', hi: 'कुल लागत / मात्रा' },
                    { en: 'Total Cost − Fixed Cost', hi: 'कुल लागत − स्थिर लागत' },
                    { en: 'Price × Quantity', hi: 'कीमत × मात्रा' }
                ],
                correctIndex: 0,
                explain: { en: 'MC = ΔTC/ΔQ — the extra cost of producing one more unit.', hi: 'MC = ΔTC/ΔQ — एक अतिरिक्त इकाई उत्पादन की अतिरिक्त लागत।' },
                syllabusId: 'XI-B-U6-COST'
            },
            {
                level: 'understand',
                question: { en: 'When MC is below AC, what happens to Average Cost as output rises?', hi: 'जब MC, AC से नीचे होती है, तो उत्पादन बढ़ने पर औसत लागत का क्या होता है?' },
                options: [
                    { en: 'AC falls', hi: 'AC घटती है' },
                    { en: 'AC rises', hi: 'AC बढ़ती है' },
                    { en: 'AC stays constant', hi: 'AC स्थिर रहती है' },
                    { en: 'AC becomes negative', hi: 'AC ऋणात्मक हो जाती है' }
                ],
                correctIndex: 0,
                explain: { en: 'When the marginal (extra) unit costs less than the current average, it pulls the average down — MC below AC means AC is falling.', hi: 'जब सीमांत (अतिरिक्त) इकाई वर्तमान औसत से कम लागत की होती है, तो यह औसत को नीचे खींचती है — MC का AC से नीचे होना अर्थात AC घट रही है।' },
                syllabusId: 'XI-B-U6-COST'
            },
            {
                level: 'analyse',
                question: { en: 'In the Product view, at the labour level where MP crosses AP, MP is exactly…', hi: 'उत्पाद दृश्य (Product view) में, जिस श्रम स्तर पर MP, AP को काटता है, वहाँ MP ठीक-ठीक…' },
                options: [
                    { en: 'At its maximum (equal to AP)', hi: 'अपने अधिकतम पर (AP के बराबर)' },
                    { en: 'At zero', hi: 'शून्य पर' },
                    { en: 'Negative', hi: 'ऋणात्मक' },
                    { en: 'Equal to Total Product', hi: 'कुल उत्पाद के बराबर' }
                ],
                correctIndex: 0,
                explain: { en: 'MP crosses AP exactly where AP is at its maximum — a standard result of the Law of Variable Proportions.', hi: 'MP, AP को ठीक वहीं काटता है जहाँ AP अपने अधिकतम पर होता है — परिवर्तनशील अनुपात नियम का एक मानक परिणाम।' },
                syllabusId: 'XI-B-U6-PRODUCTION'
            },
            {
                level: 'evaluate',
                question: { en: 'A firm doubles its Fixed Cost. What happens to its Marginal Cost curve?', hi: 'एक फर्म अपनी स्थिर लागत को दोगुना कर देती है। इसकी सीमांत लागत वक्र का क्या होता है?' },
                options: [
                    { en: 'Nothing — MC is unaffected by Fixed Cost', hi: 'कुछ नहीं — MC स्थिर लागत से अप्रभावित रहती है' },
                    { en: 'MC doubles at every output level', hi: 'MC प्रत्येक उत्पादन स्तर पर दोगुनी हो जाती है' },
                    { en: 'MC becomes zero', hi: 'MC शून्य हो जाती है' },
                    { en: 'MC becomes undefined', hi: 'MC अपरिभाषित हो जाती है' }
                ],
                correctIndex: 0,
                explain: { en: 'MC = ΔTC/ΔQ has no Fixed Cost term — only AC (which divides FC by Q) shifts when FC changes.', hi: 'MC = ΔTC/ΔQ में कोई स्थिर लागत पद नहीं है — केवल AC (जो FC को Q से विभाजित करता है) FC बदलने पर शिफ्ट होता है।' }
            }
        ],
        applyTemplates: [
            {
                level: 'apply',
                build(state, metrics) {
                    if (!metrics || metrics.view !== 'costs' || typeof metrics.MC !== 'number') return null;
                    const correct = Math.round(metrics.MC * 100) / 100;
                    const options = quizNumericOptions(correct, [2, -2, 4], { round: 2, prefix: '₹' });
                    return {
                        question: { en: `In the Cost view at Output = ${state.q}, what is the Marginal Cost (MC = 5 + 2×0.3×Q)?`, hi: `लागत दृश्य में उत्पादन = ${state.q} पर, सीमांत लागत (MC = 5 + 2×0.3×Q) क्या है?` },
                        options,
                        correctIndex: 0,
                        explain: { en: `Read directly from the "Marginal Cost at Q" row in Live Readings: ₹${correct}.`, hi: `Live Readings में "Marginal Cost at Q" पंक्ति से सीधे पढ़ें: ₹${correct}।` }
                    };
                }
            }
        ]
    };

    QUIZ_BANK['micro-price-controls'] = {
        static: [
            {
                level: 'remember',
                question: { en: 'A price ceiling set BELOW the free-market equilibrium price creates…', hi: 'मुक्त-बाज़ार संतुलन कीमत से नीचे निर्धारित मूल्य सीमा (price ceiling) क्या उत्पन्न करती है…' },
                options: [
                    { en: 'A shortage', hi: 'एक कमी (Shortage)' },
                    { en: 'A surplus', hi: 'एक अधिशेष (Surplus)' },
                    { en: 'No effect', hi: 'कोई प्रभाव नहीं' },
                    { en: 'Perfect equilibrium', hi: 'पूर्ण संतुलन' }
                ],
                correctIndex: 0,
                explain: { en: 'A ceiling below equilibrium keeps price artificially low — quantity demanded exceeds quantity supplied, a shortage.', hi: 'संतुलन से नीचे की मूल्य सीमा कीमत को कृत्रिम रूप से कम रखती है — माँगी गई मात्रा आपूर्ति की गई मात्रा से अधिक हो जाती है, एक कमी।' },
                syllabusId: 'XI-B-U7-APPLICATIONS'
            },
            {
                level: 'understand',
                question: { en: 'A Minimum Support Price (MSP) for crops is an example of…', hi: 'फसलों के लिए न्यूनतम समर्थन मूल्य (MSP) किसका उदाहरण है…' },
                options: [
                    { en: 'A price floor', hi: 'एक मूल्य तल (Price Floor)' },
                    { en: 'A price ceiling', hi: 'एक मूल्य सीमा (Price Ceiling)' },
                    { en: 'A tax', hi: 'एक कर' },
                    { en: 'A subsidy on inputs only', hi: 'केवल इनपुट पर एक सब्सिडी' }
                ],
                correctIndex: 0,
                explain: { en: 'MSP guarantees farmers a minimum price above free-market equilibrium, protecting sellers — a textbook price floor.', hi: 'MSP किसानों को मुक्त-बाज़ार संतुलन से ऊपर एक न्यूनतम कीमत की गारंटी देता है, विक्रेताओं की रक्षा करता है — एक विशिष्ट मूल्य तल।' },
                syllabusId: 'XI-B-U7-APPLICATIONS'
            },
            {
                level: 'analyse',
                question: { en: 'If a control price is set EXACTLY at the free-market equilibrium price, the shortage/surplus is…', hi: 'यदि नियंत्रण कीमत ठीक मुक्त-बाज़ार संतुलन कीमत पर निर्धारित की जाती है, तो कमी/अधिशेष होगा…' },
                options: [
                    { en: 'Zero', hi: 'शून्य' },
                    { en: 'Maximum possible', hi: 'अधिकतम संभव' },
                    { en: 'Always positive', hi: 'हमेशा धनात्मक' },
                    { en: 'Undefined', hi: 'अपरिभाषित' }
                ],
                correctIndex: 0,
                explain: { en: 'A control at the market-clearing price changes nothing — Qd already equals Qs there.', hi: 'बाज़ार-समाशोधन कीमत पर नियंत्रण कुछ नहीं बदलता — वहाँ Qd पहले से ही Qs के बराबर है।' }
            },
            {
                level: 'evaluate',
                question: { en: 'Rent control (a price ceiling on housing) is often criticised because it…', hi: 'किराया नियंत्रण (आवास पर एक मूल्य सीमा) की अक्सर आलोचना की जाती है क्योंकि यह…' },
                options: [
                    { en: 'Benefits some current tenants but worsens the housing shortage for others', hi: 'कुछ वर्तमान किरायेदारों को लाभ पहुँचाता है लेकिन दूसरों के लिए आवास की कमी को और बदतर बना देता है' },
                    { en: 'Always eliminates all housing shortages', hi: 'हमेशा सभी आवास कमियों को समाप्त कर देता है' },
                    { en: 'Has no effect on the housing market at all', hi: 'आवास बाज़ार पर कोई प्रभाव नहीं डालता' },
                    { en: 'Raises the market-clearing price', hi: 'बाज़ार-समाशोधन कीमत को बढ़ा देता है' }
                ],
                correctIndex: 0,
                explain: { en: 'This is the classic ceiling trade-off: those who secure housing at the controlled rent benefit, but the resulting shortage leaves others unable to find housing at all.', hi: 'यह एक क्लासिक मूल्य-सीमा व्यापार-बंद (trade-off) है: नियंत्रित किराए पर आवास पाने वालों को लाभ होता है, लेकिन परिणामी कमी के कारण अन्य लोगों को आवास बिल्कुल नहीं मिल पाता।' }
            }
        ],
        applyTemplates: [
            {
                level: 'apply',
                build(state, metrics) {
                    if (!metrics || typeof metrics.gap !== 'number') return null;
                    const correct = Math.round(metrics.gap);
                    const options = quizNumericOptions(correct, [8, -8, 15], { round: 0, suffix: ' units' });
                    return {
                        question: { en: `At a Government Price Control of ₹${state.ctrl} with Market Demand Conditions=${state.demandShift}, what is the resulting shortage/surplus size?`, hi: `सरकारी मूल्य नियंत्रण ₹${state.ctrl} पर बाज़ार माँग स्थितियों=${state.demandShift} के साथ, परिणामी कमी/अधिशेष का आकार क्या है?` },
                        options,
                        correctIndex: 0,
                        explain: { en: `The gap between quantity demanded and quantity supplied at ₹${state.ctrl} is ${correct} units — read it directly from Live Readings.`, hi: `₹${state.ctrl} पर माँगी गई और आपूर्ति की गई मात्रा के बीच का अंतर ${correct} इकाइयाँ है — इसे सीधे Live Readings से पढ़ें।` }
                    };
                }
            }
        ]
    };

    QUIZ_BANK['micro-market-structures'] = {
        static: [
            {
                level: 'remember',
                question: { en: 'Under Monopoly (N=1 in this Cournot model), price is…', hi: 'एकाधिकार (Monopoly) के तहत (इस कोर्नो मॉडल में N=1), कीमत होती है…' },
                options: [
                    { en: 'At its highest, output at its lowest', hi: 'अपने उच्चतम पर, उत्पादन अपने न्यूनतम पर' },
                    { en: 'At its lowest', hi: 'अपने न्यूनतम पर' },
                    { en: 'Equal to Marginal Cost', hi: 'सीमांत लागत के बराबर' },
                    { en: 'Undefined', hi: 'अपरिभाषित' }
                ],
                correctIndex: 0,
                explain: { en: 'With no competitors, a monopolist restricts output to charge the highest sustainable price.', hi: 'बिना किसी प्रतिस्पर्धी के, एक एकाधिकारी उच्चतम टिकाऊ कीमत वसूलने के लिए उत्पादन को सीमित करता है।' }
            },
            {
                level: 'understand',
                question: { en: 'As the Number of Firms (N) increases toward a very large number, price moves toward…', hi: 'फर्मों की संख्या (N) बहुत बड़ी संख्या की ओर बढ़ने पर, कीमत किसकी ओर बढ़ती है…' },
                options: [
                    { en: 'Marginal Cost (the Perfect Competition outcome)', hi: 'सीमांत लागत (पूर्ण प्रतिस्पर्धा का परिणाम)' },
                    { en: 'Zero', hi: 'शून्य' },
                    { en: 'Infinity', hi: 'अनंत' },
                    { en: 'The Monopoly price, unchanged', hi: 'एकाधिकार कीमत, अपरिवर्तित' }
                ],
                correctIndex: 0,
                explain: { en: 'As more firms compete, each has less market power and undercutting matters more — price converges to P=MC.', hi: 'जैसे-जैसे अधिक फर्में प्रतिस्पर्धा करती हैं, प्रत्येक के पास कम बाज़ार शक्ति होती है और कम कीमत लगाना अधिक मायने रखता है — कीमत P=MC की ओर अभिसरित होती है।' }
            },
            {
                level: 'analyse',
                question: { en: 'Which market form is characterised by "a few firms" with significant interdependence in decisions?', hi: 'कौन-सा बाज़ार स्वरूप "कुछ फर्मों" द्वारा निर्णयों में महत्वपूर्ण अन्योन्याश्रितता (interdependence) से चिह्नित है?' },
                options: [
                    { en: 'Oligopoly', hi: 'अल्पाधिकार (Oligopoly)' },
                    { en: 'Perfect Competition', hi: 'पूर्ण प्रतिस्पर्धा' },
                    { en: 'Monopoly', hi: 'एकाधिकार' },
                    { en: 'None of the above', hi: 'इनमें से कोई नहीं' }
                ],
                correctIndex: 0,
                explain: { en: 'Oligopoly (a few firms) is defined by strategic interdependence — each firm\'s decisions directly affect, and are affected by, its rivals.', hi: 'अल्पाधिकार (कुछ फर्में) रणनीतिक अन्योन्याश्रितता द्वारा परिभाषित है — प्रत्येक फर्म के निर्णय सीधे अपने प्रतिद्वंद्वियों को प्रभावित करते हैं, और उनसे प्रभावित होते हैं।' }
            }
        ],
        applyTemplates: [
            {
                level: 'apply',
                build(state, metrics) {
                    if (!metrics || typeof metrics.P !== 'number') return null;
                    const correct = Math.round(metrics.P);
                    const options = quizNumericOptions(correct, [10, -10, 20], { round: 0, prefix: '₹' });
                    return {
                        question: { en: `With Marginal Cost=₹${state.mc} and Number of Firms=${state.n}, what is the current Price?`, hi: `सीमांत लागत=₹${state.mc} और फर्मों की संख्या=${state.n} के साथ, वर्तमान कीमत क्या है?` },
                        options,
                        correctIndex: 0,
                        explain: { en: `P = (100 + N×MC) / (N+1) = (100 + ${state.n}×${state.mc}) / ${state.n + 1} ≈ ₹${correct}.`, hi: `P = (100 + N×MC) / (N+1) = (100 + ${state.n}×${state.mc}) / ${state.n + 1} ≈ ₹${correct}।` }
                    };
                }
            }
        ]
    };

    QUIZ_BANK['macro-money-creation'] = {
        static: [
            {
                level: 'remember',
                question: { en: 'The Money/Credit Multiplier is calculated as…', hi: 'मुद्रा/साख गुणक (Money/Credit Multiplier) की गणना की जाती है…' },
                options: [
                    { en: '1 / Legal Reserve Ratio', hi: '1 / वैधानिक कोष अनुपात' },
                    { en: 'Legal Reserve Ratio × Deposit', hi: 'वैधानिक कोष अनुपात × जमा' },
                    { en: '1 − Legal Reserve Ratio', hi: '1 − वैधानिक कोष अनुपात' },
                    { en: 'Deposit / Legal Reserve Ratio²', hi: 'जमा / वैधानिक कोष अनुपात²' }
                ],
                correctIndex: 0,
                explain: { en: 'Money Multiplier = 1/LRR — a smaller reserve requirement means more re-lending, and a bigger multiplier.', hi: 'मुद्रा गुणक = 1/LRR — छोटी कोष आवश्यकता का अर्थ है अधिक पुनः-उधार, और एक बड़ा गुणक।' },
                syllabusId: 'XII-A-U2-CREATION'
            },
            {
                level: 'understand',
                question: { en: 'If the RBI RAISES the Cash Reserve Ratio (CRR), what happens to the money multiplier?', hi: 'यदि RBI नकद कोष अनुपात (CRR) को बढ़ाता है, तो मुद्रा गुणक का क्या होता है?' },
                options: [
                    { en: 'It falls — banks must hold back more, lending less', hi: 'यह घटता है — बैंकों को अधिक रोकना होता है, कम उधार देना होता है' },
                    { en: 'It rises', hi: 'यह बढ़ता है' },
                    { en: 'It becomes exactly 1', hi: 'यह ठीक 1 हो जाता है' },
                    { en: 'CRR has no relation to the multiplier', hi: 'CRR का गुणक से कोई संबंध नहीं है' }
                ],
                correctIndex: 0,
                explain: { en: 'CRR is a reserve requirement, modeled here by the Legal Reserve Ratio — raising it means banks lend out less of every deposit, shrinking the multiplier.', hi: 'CRR एक कोष आवश्यकता है, जिसे यहाँ वैधानिक कोष अनुपात द्वारा मॉडल किया गया है — इसे बढ़ाने का अर्थ है बैंक हर जमा का कम हिस्सा उधार देते हैं, जिससे गुणक छोटा हो जाता है।' },
                syllabusId: 'XII-A-U2-CREDIT-CONTROL'
            },
            {
                level: 'analyse',
                question: { en: 'The RBI acts as the "Banker\'s Bank" by…', hi: 'RBI "बैंकर के बैंक" के रूप में कार्य करता है…' },
                options: [
                    { en: 'Holding commercial banks\' reserves and lending to them as a last resort', hi: 'वाणिज्यिक बैंकों के भंडार को रखकर और अंतिम उपाय के रूप में उन्हें उधार देकर' },
                    { en: 'Opening savings accounts for individual citizens', hi: 'व्यक्तिगत नागरिकों के लिए बचत खाते खोलकर' },
                    { en: 'Selling groceries', hi: 'किराने का सामान बेचकर' },
                    { en: 'Setting the price of gold', hi: 'सोने की कीमत तय करके' }
                ],
                correctIndex: 0,
                explain: { en: 'As Banker\'s Bank, RBI holds commercial banks\' reserves and is their lender of last resort — one of its three core functions.', hi: 'बैंकर के बैंक के रूप में, RBI वाणिज्यिक बैंकों के भंडार रखता है और उनका अंतिम उपाय ऋणदाता है — इसका एक मुख्य कार्य।' },
                syllabusId: 'XII-A-U2-CENTRAL-BANK'
            }
        ],
        applyTemplates: [
            {
                level: 'apply',
                build(state, metrics) {
                    if (!metrics || typeof metrics.totalMoney !== 'number') return null;
                    const correct = Math.round(metrics.totalMoney);
                    const options = quizNumericOptions(correct, [correct * 0.2 || 500, -(correct * 0.2) || -500, correct * 0.4 || 1000], { round: 0, prefix: '₹' });
                    return {
                        question: { en: `With an Initial Deposit of ₹${state.deposit} and a Legal Reserve Ratio of ${state.rr}%, what is the Total Money Created?`, hi: `प्रारंभिक जमा ₹${state.deposit} और वैधानिक कोष अनुपात ${state.rr}% के साथ, कुल कितनी मुद्रा बनती है?` },
                        options,
                        correctIndex: 0,
                        explain: { en: `Total Money = Initial Deposit / LRR = ${state.deposit} / ${state.rr / 100} ≈ ₹${correct}.`, hi: `कुल मुद्रा = प्रारंभिक जमा / LRR = ${state.deposit} / ${state.rr / 100} ≈ ₹${correct}।` }
                    };
                }
            }
        ]
    };

    QUIZ_BANK['macro-govt-budget'] = {
        static: [
            {
                level: 'remember',
                question: { en: 'Fiscal Deficit is defined as…', hi: 'राजकोषीय घाटे (Fiscal Deficit) को परिभाषित किया जाता है…' },
                options: [
                    { en: 'Total Expenditure − Total Receipts (excluding borrowings)', hi: 'कुल व्यय − कुल प्राप्तियाँ (उधार को छोड़कर)' },
                    { en: 'Revenue Expenditure − Revenue Receipts', hi: 'राजस्व व्यय − राजस्व प्राप्तियाँ' },
                    { en: 'Fiscal Deficit − Interest Payments', hi: 'राजकोषीय घाटा − ब्याज भुगतान' },
                    { en: 'Capital Receipts + Capital Expenditure', hi: 'पूँजीगत प्राप्तियाँ + पूँजीगत व्यय' }
                ],
                correctIndex: 0,
                explain: { en: 'Fiscal Deficit = Total Expenditure − Total Receipts (excluding borrowing) — the total borrowing requirement of the government.', hi: 'राजकोषीय घाटा = कुल व्यय − कुल प्राप्तियाँ (उधार को छोड़कर) — सरकार की कुल उधार आवश्यकता।' },
                syllabusId: 'XII-A-U4-DEFICITS'
            },
            {
                level: 'understand',
                question: { en: 'Primary Deficit is calculated by subtracting what from Fiscal Deficit?', hi: 'प्राथमिक घाटे की गणना राजकोषीय घाटे से क्या घटाकर की जाती है?' },
                options: [
                    { en: 'Interest Payments', hi: 'ब्याज भुगतान' },
                    { en: 'Revenue Receipts', hi: 'राजस्व प्राप्तियाँ' },
                    { en: 'Capital Expenditure', hi: 'पूँजीगत व्यय' },
                    { en: 'GDP', hi: 'GDP' }
                ],
                correctIndex: 0,
                explain: { en: 'Primary Deficit = Fiscal Deficit − Interest Payments, isolating the deficit caused by THIS year\'s policy, not past borrowing.', hi: 'प्राथमिक घाटा = राजकोषीय घाटा − ब्याज भुगतान, जो इस वर्ष की नीति से हुए घाटे को अलग करता है, न कि पिछले उधार से।' },
                syllabusId: 'XII-A-U4-DEFICITS'
            },
            {
                level: 'evaluate',
                question: { en: 'If a government\'s Primary Deficit is zero but its Fiscal Deficit is large, what does that tell you?', hi: 'यदि किसी सरकार का प्राथमिक घाटा शून्य है लेकिन राजकोषीय घाटा बड़ा है, तो यह आपको क्या बताता है?' },
                options: [
                    { en: 'The entire fiscal deficit is explained by interest on past borrowing, not fresh overspending', hi: 'पूरा राजकोषीय घाटा पिछले उधार पर ब्याज से समझाया जाता है, नए अत्यधिक खर्च से नहीं' },
                    { en: 'The government has no debt at all', hi: 'सरकार पर कोई कर्ज़ नहीं है' },
                    { en: 'The budget is perfectly balanced', hi: 'बजट बिल्कुल संतुलित है' },
                    { en: 'Revenue Receipts must be zero', hi: 'राजस्व प्राप्तियाँ शून्य होनी चाहिए' }
                ],
                correctIndex: 0,
                explain: { en: 'Primary Deficit = 0 means Fiscal Deficit = Interest Payments exactly — old debt is the whole story, not this year\'s fresh spending.', hi: 'प्राथमिक घाटा = 0 का अर्थ है राजकोषीय घाटा = ब्याज भुगतान ठीक-ठीक — पुराना कर्ज़ ही पूरी कहानी है, इस वर्ष का नया खर्च नहीं।' }
            }
        ],
        applyTemplates: [
            {
                level: 'apply',
                build(state, metrics) {
                    if (!metrics || typeof metrics.fiscalDeficit !== 'number') return null;
                    const correct = Math.round(Math.max(metrics.fiscalDeficit, 0));
                    const options = quizNumericOptions(correct, [15, -15, 30], { round: 0, prefix: '₹', suffix: 'B' });
                    return {
                        question: { en: `With Revenue Receipts=₹${state.rr}B and Revenue Expenditure=₹${state.re}B (Capital Receipts fixed at ₹60B, Capital Expenditure at ₹90B), what is the Fiscal Deficit?`, hi: `राजस्व प्राप्तियाँ=₹${state.rr}B और राजस्व व्यय=₹${state.re}B के साथ (पूँजीगत प्राप्तियाँ ₹60B और पूँजीगत व्यय ₹90B पर स्थिर), राजकोषीय घाटा क्या है?` },
                        options,
                        correctIndex: 0,
                        explain: { en: `Fiscal Deficit = (Revenue Exp. + Capital Exp.) − (Revenue Receipts + Capital Receipts) = (${state.re}+90) − (${state.rr}+60) = ₹${correct}B.`, hi: `राजकोषीय घाटा = (राजस्व व्यय + पूँजीगत व्यय) − (राजस्व प्राप्तियाँ + पूँजीगत प्राप्तियाँ) = (${state.re}+90) − (${state.rr}+60) = ₹${correct}B.` }
                    };
                }
            }
        ]
    };

    QUIZ_BANK['macro-forex'] = {
        static: [
            {
                level: 'remember',
                question: { en: 'Under a flexible (floating) exchange rate, the rate is determined by…', hi: 'लचीली (फ्लोटिंग) विनिमय दर के तहत, दर किसके द्वारा निर्धारित होती है…' },
                options: [
                    { en: 'Demand for and supply of foreign exchange', hi: 'विदेशी मुद्रा की माँग और आपूर्ति' },
                    { en: 'A fixed government-announced peg', hi: 'एक निश्चित सरकार-घोषित पेग' },
                    { en: 'The Reserve Bank alone, always', hi: 'हमेशा केवल रिज़र्व बैंक' },
                    { en: 'The IMF', hi: 'IMF' }
                ],
                correctIndex: 0,
                explain: { en: 'In a flexible system, the exchange rate is purely market-determined, by demand for and supply of foreign currency.', hi: 'एक लचीली प्रणाली में, विनिमय दर पूर्णतः बाज़ार द्वारा निर्धारित होती है, विदेशी मुद्रा की माँग और आपूर्ति से।' },
                syllabusId: 'XII-A-U5-DETERMINATION'
            },
            {
                level: 'understand',
                question: { en: 'A rise in Imports (Current Account) does what to the Rupee?', hi: 'आयात (चालू खाता) में वृद्धि रुपये का क्या करती है?' },
                options: [
                    { en: 'Depreciates it (more rupees needed per dollar)', hi: 'इसका मूल्यह्रास करती है (प्रति डॉलर अधिक रुपये चाहिए)' },
                    { en: 'Appreciates it', hi: 'इसकी सराहना (appreciate) करती है' },
                    { en: 'Has no effect', hi: 'कोई प्रभाव नहीं' },
                    { en: 'Fixes it permanently', hi: 'इसे स्थायी रूप से तय कर देती है' }
                ],
                correctIndex: 0,
                explain: { en: 'Imports raise demand for foreign currency (dollars) — more dollars demanded relative to supply means the rupee depreciates.', hi: 'आयात विदेशी मुद्रा (डॉलर) की माँग बढ़ाते हैं — आपूर्ति की तुलना में अधिक डॉलर की माँग का अर्थ है रुपये का मूल्यह्रास।' },
                syllabusId: 'XII-A-U5-BOP'
            },
            {
                level: 'analyse',
                question: { en: 'Which exchange-rate system requires the central bank to hold large reserves to defend a specific rate?', hi: 'कौन-सी विनिमय दर प्रणाली में केंद्रीय बैंक को एक विशिष्ट दर की रक्षा के लिए बड़े भंडार रखने पड़ते हैं?' },
                options: [
                    { en: 'Fixed exchange rate', hi: 'निश्चित विनिमय दर' },
                    { en: 'Flexible exchange rate', hi: 'लचीली विनिमय दर' },
                    { en: 'Barter system', hi: 'वस्तु विनिमय प्रणाली' },
                    { en: 'None of these need reserves', hi: 'इनमें से किसी को भंडार की आवश्यकता नहीं' }
                ],
                correctIndex: 0,
                explain: { en: 'A fixed rate is administratively pegged, so the central bank must intervene (buy/sell reserves) whenever market pressure would otherwise move the rate away from the peg.', hi: 'एक निश्चित दर प्रशासनिक रूप से तय की जाती है, इसलिए केंद्रीय बैंक को हस्तक्षेप करना पड़ता है (भंडार खरीदना/बेचना) जब भी बाज़ार का दबाव दर को पेग से हटाना चाहता है।' },
                syllabusId: 'XII-A-U5-EXRATE'
            }
        ],
        applyTemplates: [
            {
                level: 'apply',
                build(state, metrics) {
                    if (!metrics || typeof metrics.trend !== 'string') return null;
                    const options = quizShuffle(['Depreciating', 'Appreciating', 'Stable']).map(v => ({ Depreciating: { en: 'Depreciating', hi: 'मूल्यह्रास (Depreciating)' }, Appreciating: { en: 'Appreciating', hi: 'सराहना (Appreciating)' }, Stable: { en: 'Stable', hi: 'स्थिर (Stable)' } }[v]));
                    const correctOpt = { Depreciating: { en: 'Depreciating', hi: 'मूल्यह्रास (Depreciating)' }, Appreciating: { en: 'Appreciating', hi: 'सराहना (Appreciating)' }, Stable: { en: 'Stable', hi: 'स्थिर (Stable)' } }[metrics.trend];
                    return {
                        question: { en: `With Imports=${state.imports}, Exports=${state.exports}, Capital Outflow=${state.capOut}, Capital Inflow=${state.capIn} — is the Rupee Depreciating, Appreciating, or Stable?`, hi: `आयात=${state.imports}, निर्यात=${state.exports}, पूँजी बहिर्वाह=${state.capOut}, पूँजी अंतर्वाह=${state.capIn} के साथ — रुपया मूल्यह्रास, सराहना, या स्थिर है?` },
                        options: [correctOpt, ...options.filter(o => quizLocalize(o) !== quizLocalize(correctOpt))].slice(0, 3),
                        correctIndex: 0,
                        explain: { en: `Comparing total demand for $ (Imports+Capital Outflow) against total supply of $ (Exports+Capital Inflow) gives the "Rupee Trend" reading: ${metrics.trend}.`, hi: `डॉलर की कुल माँग (आयात+पूँजी बहिर्वाह) की डॉलर की कुल आपूर्ति (निर्यात+पूँजी अंतर्वाह) से तुलना करने पर "Rupee Trend" रीडिंग मिलती है: ${metrics.trend}.` }
                    };
                }
            }
        ]
    };

    QUIZ_BANK['macro-inflation-gap'] = {
        static: [
            {
                level: 'remember',
                question: { en: 'An Inflationary Gap occurs when…', hi: 'मुद्रास्फीतिकारी अंतराल (Inflationary Gap) तब होता है जब…' },
                options: [
                    { en: 'Equilibrium income exceeds the full-employment level', hi: 'संतुलन आय पूर्ण-रोजगार स्तर से अधिक हो जाती है' },
                    { en: 'Equilibrium income equals zero', hi: 'संतुलन आय शून्य के बराबर होती है' },
                    { en: 'Prices never change', hi: 'कीमतें कभी नहीं बदलतीं' },
                    { en: 'The government has a balanced budget', hi: 'सरकार का बजट संतुलित होता है' }
                ],
                correctIndex: 0,
                explain: { en: 'When equilibrium Y > Yfe, excess demand exists at full employment — output can\'t rise further, so prices rise instead: an inflationary gap.', hi: 'जब संतुलन Y > Yfe, पूर्ण रोजगार पर अतिरिक्त माँग होती है — उत्पादन आगे नहीं बढ़ सकता, इसलिए कीमतें बढ़ती हैं: एक मुद्रास्फीतिकारी अंतराल।' },
                syllabusId: 'XII-A-U3-GAPS'
            },
            {
                level: 'understand',
                question: { en: 'To close a DEFLATIONARY gap, an appropriate policy is…', hi: 'अपस्फीतिकारी (deflationary) अंतराल को बंद करने के लिए, एक उपयुक्त नीति है…' },
                options: [
                    { en: 'Expansionary policy — raise G or cut taxes', hi: 'विस्तारवादी नीति — G बढ़ाना या करों में कटौती' },
                    { en: 'Contractionary policy — cut G or raise taxes', hi: 'संकुचनकारी नीति — G घटाना या कर बढ़ाना' },
                    { en: 'Do nothing, ever', hi: 'कभी कुछ न करें' },
                    { en: 'Reduce the money supply', hi: 'मुद्रा आपूर्ति कम करें' }
                ],
                correctIndex: 0,
                explain: { en: 'A deflationary gap means demand is too low for full employment — expansionary policy raises demand to close it.', hi: 'अपस्फीतिकारी अंतराल का अर्थ है पूर्ण रोजगार के लिए माँग बहुत कम है — विस्तारवादी नीति इसे बंद करने के लिए माँग बढ़ाती है।' },
                syllabusId: 'XII-A-U3-GAPS'
            },
            {
                level: 'analyse',
                question: { en: 'Aggregate Demand (AD) in this lab is the sum of which four components?', hi: 'इस लैब में समग्र माँग (AD) किन चार घटकों का योग है?' },
                options: [
                    { en: 'Consumption, Investment, Government Spending, Net Exports', hi: 'उपभोग, निवेश, सरकारी व्यय, निवल निर्यात' },
                    { en: 'Wages, Rent, Interest, Profit', hi: 'मज़दूरी, किराया, ब्याज, लाभ' },
                    { en: 'CRR, SLR, Repo Rate, Bank Rate', hi: 'CRR, SLR, रेपो रेट, बैंक रेट' },
                    { en: 'Imports, Exports, Taxes, Subsidies', hi: 'आयात, निर्यात, कर, सब्सिडी' }
                ],
                correctIndex: 0,
                explain: { en: 'AD = C + I + G + (X−M) — Consumption, Investment, Government Spending, and Net Exports.', hi: 'AD = C + I + G + (X−M) — उपभोग, निवेश, सरकारी व्यय, और निवल निर्यात।' },
                syllabusId: 'XII-A-U3-AD'
            }
        ],
        applyTemplates: [
            {
                level: 'apply',
                build(state, metrics) {
                    if (!metrics || typeof metrics.gapType !== 'string') return null;
                    const opts = { 'Inflationary Gap': { en: 'Inflationary Gap', hi: 'मुद्रास्फीतिकारी अंतराल' }, 'Deflationary Gap': { en: 'Deflationary Gap', hi: 'अपस्फीतिकारी अंतराल' }, 'No Gap': { en: 'No Gap', hi: 'कोई अंतराल नहीं' } };
                    const all = Object.values(opts);
                    const correctOpt = opts[metrics.gapType];
                    return {
                        question: { en: `With ΔC=${state.dc}, ΔI=${state.di}, ΔG=${state.dg}, ΔX−M=${state.dnx}, which gap type results?`, hi: `ΔC=${state.dc}, ΔI=${state.di}, ΔG=${state.dg}, ΔX−M=${state.dnx} के साथ, कौन-सा अंतराल प्रकार बनता है?` },
                        options: [correctOpt, ...all.filter(o => o !== correctOpt)],
                        correctIndex: 0,
                        explain: { en: `Comparing the new Equilibrium Income against the Full Employment Income (Yfe=200) gives: ${metrics.gapType}.`, hi: `नई संतुलन आय की पूर्ण रोजगार आय (Yfe=200) से तुलना करने पर मिलता है: ${metrics.gapType}.` }
                    };
                }
            }
        ]
    };

    QUIZ_BANK['stats-dispersion'] = {
        static: [
            {
                level: 'remember',
                question: { en: 'Standard Deviation (σ) is calculated as…', hi: 'मानक विचलन (σ) की गणना की जाती है…' },
                options: [
                    { en: '√[Σ(x−x̄)² / n]', hi: '√[Σ(x−x̄)² / n]' },
                    { en: 'Σx / n', hi: 'Σx / n' },
                    { en: 'Max − Min', hi: 'अधिकतम − न्यूनतम' },
                    { en: '(Q3 − Q1) / 2', hi: '(Q3 − Q1) / 2' }
                ],
                correctIndex: 0,
                explain: { en: 'SD = √[Σ(x−mean)²/n] — the square root of the average squared deviation from the mean.', hi: 'SD = √[Σ(x−माध्य)²/n] — माध्य से औसत वर्ग विचलन का वर्गमूल।' }
            },
            {
                level: 'understand',
                question: { en: 'The Coefficient of Variation (CV) is most useful for…', hi: 'विचरण गुणांक (CV) सबसे उपयोगी है…' },
                options: [
                    { en: 'Comparing the consistency of two datasets with different means', hi: 'भिन्न माध्य वाले दो डेटासेट की संगति की तुलना के लिए' },
                    { en: 'Finding the mode', hi: 'बहुलक (mode) ज्ञात करने के लिए' },
                    { en: 'Calculating the median only', hi: 'केवल माध्यिका (median) की गणना के लिए' },
                    { en: 'Measuring correlation', hi: 'सहसंबंध मापने के लिए' }
                ],
                correctIndex: 0,
                explain: { en: 'CV = (SD/Mean)×100 is unit-free and mean-adjusted, so it fairly compares relative spread across datasets of different scale.', hi: 'CV = (SD/माध्य)×100 इकाई-मुक्त और माध्य-समायोजित है, इसलिए यह विभिन्न पैमाने के डेटासेट में सापेक्ष प्रसार की निष्पक्ष तुलना करता है।' }
            },
            {
                level: 'analyse',
                question: { en: 'Range and Quartile Deviation are considered "quicker but less reliable" than SD because they…', hi: 'रेंज और चतुर्थक विचलन को SD की तुलना में "तेज़ लेकिन कम विश्वसनीय" माना जाता है क्योंकि वे…' },
                options: [
                    { en: 'Only use extreme/positional values, ignoring most of the data', hi: 'केवल चरम/स्थितीय मानों का उपयोग करते हैं, अधिकांश डेटा को नज़रअंदाज़ करते हैं' },
                    { en: 'Use every single data point', hi: 'हर एक डेटा बिंदु का उपयोग करते हैं' },
                    { en: 'Cannot be calculated at all', hi: 'बिल्कुल भी गणना नहीं की जा सकती' },
                    { en: 'Always equal zero', hi: 'हमेशा शून्य के बराबर होते हैं' }
                ],
                correctIndex: 0,
                explain: { en: 'Range uses only the two extreme values; QD uses only Q1 and Q3 — both ignore the values in between, unlike SD which uses every value.', hi: 'रेंज केवल दो चरम मानों का उपयोग करती है; QD केवल Q1 और Q3 का उपयोग करता है — दोनों बीच के मानों को नज़रअंदाज़ करते हैं, जबकि SD हर मान का उपयोग करता है।' }
            }
        ],
        applyTemplates: [
            {
                level: 'apply',
                build(state, metrics) {
                    if (!metrics || typeof metrics.cv !== 'number') return null;
                    const correct = Math.round(metrics.cv * 10) / 10;
                    const options = quizNumericOptions(correct, [3, -3, 6], { round: 1, suffix: '%' });
                    return {
                        question: { en: `At a Spread Factor of ${state.spread}, what is the Coefficient of Variation?`, hi: `प्रसार कारक ${state.spread} पर, विचरण गुणांक क्या है?` },
                        options,
                        correctIndex: 0,
                        explain: { en: `CV = (SD / Mean) × 100, read directly from Live Readings at this Spread Factor: ${correct}%.`, hi: `CV = (SD / माध्य) × 100, इस प्रसार कारक पर Live Readings से सीधे पढ़ें: ${correct}%।` }
                    };
                }
            }
        ]
    };

    QUIZ_BANK['stats-index-numbers'] = {
        static: [
            {
                level: 'remember',
                question: { en: 'The Simple Aggregative Method computes a price index as…', hi: 'सरल समग्रात्मक विधि (Simple Aggregative Method) मूल्य सूचकांक की गणना इस प्रकार करती है…' },
                options: [
                    { en: '(ΣP₁ / ΣP₀) × 100', hi: '(ΣP₁ / ΣP₀) × 100' },
                    { en: 'ΣP₁ − ΣP₀', hi: 'ΣP₁ − ΣP₀' },
                    { en: '(ΣP₀ / ΣP₁) × 100', hi: '(ΣP₀ / ΣP₁) × 100' },
                    { en: 'ΣP₁ × ΣP₀', hi: 'ΣP₁ × ΣP₀' }
                ],
                correctIndex: 0,
                explain: { en: 'Sum every commodity\'s current-year price, sum every base-year price, and take the ratio ×100.', hi: 'हर वस्तु की चालू-वर्ष कीमत का योग करें, हर आधार-वर्ष कीमत का योग करें, और अनुपात ×100 लें।' },
                syllabusId: 'XI-A-U3-INDEX'
            },
            {
                level: 'understand',
                question: { en: 'If a price index rises from 100 to 112, the inflation rate is…', hi: 'यदि मूल्य सूचकांक 100 से 112 तक बढ़ता है, तो मुद्रास्फीति दर है…' },
                options: [
                    { en: '12%', hi: '12%' },
                    { en: '112%', hi: '112%' },
                    { en: '1.12%', hi: '1.12%' },
                    { en: '0%', hi: '0%' }
                ],
                correctIndex: 0,
                explain: { en: 'Inflation Rate = Index − 100 = 112 − 100 = 12%.', hi: 'मुद्रास्फीति दर = सूचकांक − 100 = 112 − 100 = 12%।' },
                syllabusId: 'XI-A-U3-INDEX'
            },
            {
                level: 'evaluate',
                question: { en: 'Why does this lab distinguish WPI, CPI and IIP as separately-named indices even though it builds only one generic index?', hi: 'यह लैब WPI, CPI और IIP को अलग-अलग नामित सूचकांकों के रूप में क्यों अलग करता है, भले ही यह केवल एक सामान्य सूचकांक बनाता है?' },
                options: [
                    { en: 'Because each tracks a different basket (wholesale prices, retail/consumer prices, industrial output) even though the underlying index-number logic is similar', hi: 'क्योंकि प्रत्येक एक अलग बास्केट को ट्रैक करता है (थोक कीमतें, खुदरा/उपभोक्ता कीमतें, औद्योगिक उत्पादन) भले ही अंतर्निहित सूचकांक तर्क समान हो' },
                    { en: 'Because they are unrelated statistical concepts', hi: 'क्योंकि वे असंबंधित सांख्यिकीय अवधारणाएँ हैं' },
                    { en: 'Because only one of them is a real index', hi: 'क्योंकि उनमें से केवल एक ही वास्तविक सूचकांक है' },
                    { en: 'There is no meaningful difference at all', hi: 'इनमें बिल्कुल भी कोई सार्थक अंतर नहीं है' }
                ],
                correctIndex: 0,
                explain: { en: 'WPI, CPI and IIP all use index-number construction, but over different baskets/purposes — this lab teaches the shared method while naming the real official indices honestly.', hi: 'WPI, CPI और IIP सभी सूचकांक-संख्या निर्माण का उपयोग करते हैं, लेकिन अलग-अलग बास्केट/उद्देश्यों पर — यह लैब साझा विधि सिखाता है जबकि वास्तविक आधिकारिक सूचकांकों को ईमानदारी से नाम देता है।' }
            }
        ],
        applyTemplates: [
            {
                level: 'apply',
                build(rows, metrics) {
                    if (!metrics || typeof metrics.index !== 'number') return null;
                    const correct = Math.round(metrics.index * 10) / 10;
                    const options = quizNumericOptions(correct, [8, -8, 15], { round: 1 });
                    return {
                        question: { en: 'For the commodity basket currently shown in the table, what is the Price Index (Base = 100)?', hi: 'तालिका में वर्तमान में दिखाई गई वस्तु बास्केट के लिए, मूल्य सूचकांक (आधार = 100) क्या है?' },
                        options,
                        correctIndex: 0,
                        explain: { en: `Index = (ΣP₁/ΣP₀)×100, read directly from the "Price Index" row: ${correct}.`, hi: `सूचकांक = (ΣP₁/ΣP₀)×100, "Price Index" पंक्ति से सीधे पढ़ें: ${correct}।` }
                    };
                }
            }
        ]
    };

    QUIZ_BANK['india-human-capital'] = {
        static: [
            {
                level: 'remember',
                question: { en: 'NCERT names two main sources of Human Capital Formation. Which pair is correct?', hi: 'NCERT मानव पूँजी निर्माण के दो मुख्य स्रोत बताता है। कौन-सा जोड़ा सही है?' },
                options: [
                    { en: 'Education and Health', hi: 'शिक्षा और स्वास्थ्य' },
                    { en: 'Roads and Railways', hi: 'सड़कें और रेलवे' },
                    { en: 'Exports and Imports', hi: 'निर्यात और आयात' },
                    { en: 'Taxes and Subsidies', hi: 'कर और सब्सिडी' }
                ],
                correctIndex: 0,
                explain: { en: 'Investment in Education (literacy/skills) and Health (life expectancy/productive years) are the two most emphasised sources.', hi: 'शिक्षा (साक्षरता/कौशल) और स्वास्थ्य (जीवन प्रत्याशा/उत्पादक वर्ष) में निवेश दो सबसे अधिक जोर दिए गए स्रोत हैं।' },
                syllabusId: 'XII-B-U7-HUMAN-CAPITAL'
            },
            {
                level: 'understand',
                question: { en: 'Why does this lab model Education and Health spending as two INDEPENDENT tracks rather than one combined number?', hi: 'यह लैब शिक्षा और स्वास्थ्य व्यय को एक संयुक्त संख्या के बजाय दो स्वतंत्र ट्रैक के रूप में क्यों मॉडल करता है?' },
                options: [
                    { en: 'A country can be strong in one and weak in the other — they are not interchangeable', hi: 'एक देश एक में मज़बूत और दूसरे में कमज़ोर हो सकता है — वे परस्पर बदले नहीं जा सकते' },
                    { en: 'They are always numerically identical', hi: 'वे संख्यात्मक रूप से हमेशा समान होते हैं' },
                    { en: 'Health spending has no real effect', hi: 'स्वास्थ्य व्यय का कोई वास्तविक प्रभाव नहीं होता' },
                    { en: 'Education spending has no real effect', hi: 'शिक्षा व्यय का कोई वास्तविक प्रभाव नहीं होता' }
                ],
                correctIndex: 0,
                explain: { en: 'NCERT treats education and health as separate, non-substitutable sources of human capital — modelling them independently reflects that.', hi: 'NCERT शिक्षा और स्वास्थ्य को मानव पूँजी के अलग, गैर-प्रतिस्थापन योग्य स्रोतों के रूप में मानता है — उन्हें स्वतंत्र रूप से मॉडल करना इसे दर्शाता है।' },
                syllabusId: 'XII-B-U7-HUMAN-CAPITAL'
            }
        ],
        applyTemplates: [
            {
                level: 'apply',
                build(state, metrics) {
                    if (!metrics || typeof metrics.literacy !== 'number') return null;
                    const correct = Math.round(metrics.literacy * 10) / 10;
                    const options = quizNumericOptions(correct, [5, -5, 10], { round: 1, suffix: '%' });
                    return {
                        question: { en: `At Education Spending = ${state.edu}% of GDP, what is the projected Literacy Rate by the final year shown?`, hi: `शिक्षा व्यय = GDP का ${state.edu}% पर, दिखाए गए अंतिम वर्ष तक अनुमानित साक्षरता दर क्या है?` },
                        options,
                        correctIndex: 0,
                        explain: { en: `Read the "Projected Literacy (latest)" row in Live Readings: ${correct}%.`, hi: `Live Readings में "Projected Literacy (latest)" पंक्ति पढ़ें: ${correct}%।` }
                    };
                }
            }
        ]
    };

    QUIZ_BANK['india-employment-structure'] = {
        static: [
            {
                level: 'remember',
                question: { en: 'The "Informal Sector" is characterised by…', hi: '"अनौपचारिक क्षेत्र" की विशेषता है…' },
                options: [
                    { en: 'No job/social security, often self-employed or casual labour', hi: 'कोई नौकरी/सामाजिक सुरक्षा नहीं, अक्सर स्वरोजगार या आकस्मिक श्रम' },
                    { en: 'Guaranteed pensions for all workers', hi: 'सभी श्रमिकों के लिए गारंटीकृत पेंशन' },
                    { en: 'Only government jobs', hi: 'केवल सरकारी नौकरियाँ' },
                    { en: 'Zero unemployment', hi: 'शून्य बेरोज़गारी' }
                ],
                correctIndex: 0,
                explain: { en: 'The informal sector lacks the job security, social security and legal protection that formal-sector jobs provide.', hi: 'अनौपचारिक क्षेत्र में नौकरी सुरक्षा, सामाजिक सुरक्षा और कानूनी सुरक्षा का अभाव होता है जो औपचारिक क्षेत्र की नौकरियाँ प्रदान करती हैं।' },
                syllabusId: 'XII-B-U7-EMPLOYMENT'
            },
            {
                level: 'understand',
                question: { en: 'As an economy develops, the classic pattern of "structural transformation" is…', hi: 'जैसे-जैसे अर्थव्यवस्था विकसित होती है, "संरचनात्मक परिवर्तन" का विशिष्ट पैटर्न है…' },
                options: [
                    { en: "Agriculture's employment share falls while Industry and Services rise", hi: 'कृषि की रोज़गार हिस्सेदारी घटती है जबकि उद्योग और सेवाएँ बढ़ती हैं' },
                    { en: 'Agriculture always grows fastest', hi: 'कृषि हमेशा सबसे तेज़ी से बढ़ती है' },
                    { en: 'Services always shrink to zero', hi: 'सेवाएँ हमेशा शून्य तक सिकुड़ जाती हैं' },
                    { en: 'No sector share ever changes', hi: 'किसी भी क्षेत्र की हिस्सेदारी कभी नहीं बदलती' }
                ],
                correctIndex: 0,
                explain: { en: 'Workers move to more productive sectors as the economy develops — agriculture\'s share falls while industry and services rise.', hi: 'अर्थव्यवस्था के विकास के साथ श्रमिक अधिक उत्पादक क्षेत्रों की ओर बढ़ते हैं — कृषि की हिस्सेदारी घटती है जबकि उद्योग और सेवाएँ बढ़ती हैं।' },
                syllabusId: 'XII-B-U7-EMPLOYMENT'
            },
            {
                level: 'evaluate',
                question: { en: 'India\'s workforce has historically been "overwhelmingly informal" (Formal Sector share starts at just 10% at Years=0 in this lab). What does a slow rise in the Formal share over decades suggest about policy priorities?', hi: 'भारत का कार्यबल ऐतिहासिक रूप से "भारी मात्रा में अनौपचारिक" रहा है (इस लैब में Years=0 पर औपचारिक क्षेत्र की हिस्सेदारी केवल 10% से शुरू होती है)। दशकों में औपचारिक हिस्से की धीमी वृद्धि नीतिगत प्राथमिकताओं के बारे में क्या सुझाव देती है?' },
                options: [
                    { en: 'Formalisation (extending job/social security to more workers) remains a slow, ongoing policy challenge', hi: 'औपचारिकीकरण (अधिक श्रमिकों को नौकरी/सामाजिक सुरक्षा प्रदान करना) एक धीमी, चल रही नीतिगत चुनौती बनी हुई है' },
                    { en: 'The informal sector has already disappeared entirely', hi: 'अनौपचारिक क्षेत्र पहले ही पूरी तरह से गायब हो चुका है' },
                    { en: 'Formalisation happens automatically with no policy needed', hi: 'औपचारिकीकरण बिना किसी नीति के स्वतः होता है' },
                    { en: 'India has the world\'s most formalised workforce', hi: 'भारत में दुनिया का सबसे अधिक औपचारिक कार्यबल है' }
                ],
                correctIndex: 0,
                explain: { en: 'The slow, uneven shift from informal to formal work is exactly the "informalisation" concern this topic raises — it does not resolve on its own.', hi: 'अनौपचारिक से औपचारिक काम की ओर धीमी, असमान शिफ्ट ही "अनौपचारिकीकरण" की वह चिंता है जो यह विषय उठाता है — यह अपने आप हल नहीं होती।' }
            }
        ],
        applyTemplates: [
            {
                level: 'apply',
                build(state, metrics) {
                    if (!metrics || metrics.view !== 'sector' || typeof metrics.agri !== 'number') return null;
                    const correct = Math.round(metrics.agri * 10) / 10;
                    const options = quizNumericOptions(correct, [8, -8, 15], { round: 1, suffix: '%' });
                    return {
                        question: { en: `In the Sector Shift view, after ${state.yr} years of growth, what is Agriculture's employment share?`, hi: `सेक्टर शिफ्ट दृश्य में, ${state.yr} वर्षों के विकास के बाद, कृषि की रोज़गार हिस्सेदारी क्या है?` },
                        options,
                        correctIndex: 0,
                        explain: { en: `Agriculture share = 50 − 30×(Years/30), read from Live Readings: ${correct}%.`, hi: `कृषि हिस्सेदारी = 50 − 30×(वर्ष/30), Live Readings से पढ़ें: ${correct}%।` }
                    };
                }
            }
        ]
    };
}
