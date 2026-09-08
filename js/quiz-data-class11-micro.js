// Quiz banks for the 5 sims defined in js/simulations_class11_micro.js.
// See js/quiz-engine.js's header for the QUIZ_BANK data contract.

if (typeof QUIZ_BANK !== 'undefined') {
    QUIZ_BANK['micro-ppf'] = {
        static: [
            {
                level: 'remember',
                question: { en: 'A point INSIDE the Production Possibility Frontier represents…', hi: 'उत्पादन संभावना सीमा (PPF) के अंदर एक बिंदु क्या दर्शाता है…' },
                options: [
                    { en: 'An inefficient use of resources (unemployed/underused)', hi: 'संसाधनों का अकुशल उपयोग (बेरोज़गार/कम उपयोग)' },
                    { en: 'The most efficient point possible', hi: 'सबसे कुशल संभव बिंदु' },
                    { en: 'An unattainable combination', hi: 'एक अप्राप्य संयोजन' },
                    { en: 'A point with zero opportunity cost', hi: 'शून्य अवसर लागत वाला बिंदु' }
                ],
                correctIndex: 0,
                explain: { en: 'A point inside the frontier means resources are unemployed or badly allocated — the economy could produce more of both goods.', hi: 'सीमा के अंदर एक बिंदु का अर्थ है संसाधन बेरोज़गार हैं या ख़राब ढंग से आबंटित हैं — अर्थव्यवस्था दोनों वस्तुओं का अधिक उत्पादन कर सकती है।' },
                syllabusId: 'XI-B-U4-PPF-OC',
                // Classic mix-up: INSIDE (has the resources, just wasting
                // them — inefficient) vs OUTSIDE (doesn't have enough
                // resources yet — unattainable) get swapped constantly.
                misconceptions: {
                    2: { en: '"Unattainable" describes a point OUTSIDE the frontier — where the economy doesn\'t have enough resources/technology to produce that combination at all. A point INSIDE is the opposite problem: the resources exist, they\'re just unemployed or misallocated.', hi: '"अप्राप्य" सीमा के बाहर के बिंदु का वर्णन करता है — जहाँ अर्थव्यवस्था के पास वह संयोजन उत्पादित करने के लिए पर्याप्त संसाधन/प्रौद्योगिकी बिल्कुल नहीं है। सीमा के अंदर का बिंदु इसका उल्टा है: संसाधन मौजूद हैं, बस वे बेरोज़गार हैं या ग़लत ढंग से आबंटित हैं।' }
                }
            },
            {
                level: 'understand',
                question: { en: 'The Law of Increasing Opportunity Cost explains why the PPF is…', hi: 'बढ़ती अवसर लागत नियम यह बताता है कि PPF क्यों है…' },
                options: [
                    { en: 'Concave to the origin (bows outward)', hi: 'मूल बिंदु की ओर अवतल (बाहर की ओर मुड़ा हुआ)' },
                    { en: 'A straight line', hi: 'एक सीधी रेखा' },
                    { en: 'Convex to the origin', hi: 'मूल बिंदु की ओर उत्तल' },
                    { en: 'Always vertical', hi: 'हमेशा ऊर्ध्वाधर' }
                ],
                correctIndex: 0,
                explain: { en: 'Resources aren\'t equally suited to producing both goods — shifting more toward one good costs progressively more of the other, curving the PPF outward.', hi: 'संसाधन दोनों वस्तुओं के उत्पादन के लिए समान रूप से उपयुक्त नहीं होते — एक वस्तु की ओर अधिक शिफ्ट करने पर दूसरी वस्तु की लागत क्रमशः बढ़ती जाती है, जिससे PPF बाहर की ओर मुड़ता है।' },
                syllabusId: 'XI-B-U4-PPF-OC'
            },
            {
                level: 'analyse',
                question: { en: 'The three Central Problems every economy must answer are…', hi: 'हर अर्थव्यवस्था को हल करने वाली तीन केंद्रीय समस्याएँ हैं…' },
                options: [
                    { en: 'What to produce, How to produce, For whom to produce', hi: 'क्या उत्पादन करें, कैसे उत्पादन करें, किसके लिए उत्पादन करें' },
                    { en: 'Where to produce, When to produce, Who regulates it', hi: 'कहाँ उत्पादन करें, कब उत्पादन करें, इसे कौन नियंत्रित करता है' },
                    { en: 'Import, Export, Tax', hi: 'आयात, निर्यात, कर' },
                    { en: 'Supply, Demand, Price', hi: 'आपूर्ति, माँग, कीमत' }
                ],
                correctIndex: 0,
                explain: { en: 'Because resources are scarce relative to wants, every economy must decide What, How, and For Whom to produce.', hi: 'चूँकि संसाधन इच्छाओं की तुलना में दुर्लभ हैं, हर अर्थव्यवस्था को तय करना होता है कि क्या, कैसे, और किसके लिए उत्पादन करें।' },
                syllabusId: 'XI-B-U4-CENTRAL-PROBLEMS'
            },
            {
                level: 'evaluate',
                question: { en: 'A country discovers new technology that only improves production of Good X, not Good Y. How does the PPF change?', hi: 'एक देश एक नई तकनीक खोजता है जो केवल वस्तु X के उत्पादन में सुधार करती है, वस्तु Y में नहीं। PPF कैसे बदलता है?' },
                options: [
                    { en: 'It shifts outward on the X-axis side, but not the Y-axis side (an asymmetric shift)', hi: 'यह X-अक्ष की ओर बाहर की ओर शिफ्ट होता है, पर Y-अक्ष की ओर नहीं (एक असममित शिफ्ट)' },
                    { en: 'It shrinks uniformly', hi: 'यह समान रूप से सिकुड़ता है' },
                    { en: 'It becomes a straight line', hi: 'यह एक सीधी रेखा बन जाता है' },
                    { en: 'Nothing changes', hi: 'कुछ नहीं बदलता' }
                ],
                correctIndex: 0,
                explain: { en: 'Technology specific to one good expands the maximum attainable output of just that good, pulling the frontier outward unevenly rather than uniformly.', hi: 'एक वस्तु के लिए विशिष्ट तकनीक केवल उस वस्तु के अधिकतम प्राप्य उत्पादन का विस्तार करती है, जिससे सीमा असमान रूप से बाहर की ओर खिंचती है, समान रूप से नहीं।' }
            }
        ],
        applyTemplates: [
            {
                level: 'apply',
                build(state, metrics) {
                    if (!metrics || state.pointType !== 'on' || typeof metrics.mrt !== 'number') return null;
                    const correct = Math.round(metrics.mrt * 100) / 100;
                    const options = quizNumericOptions(correct, [0.4, -0.4, 0.8], { round: 2 });
                    return {
                        question: { en: `On the Frontier, with Resources & Technology (C)=${state.resources} and Output of Good X=${state.x}, what is the Opportunity Cost of one more unit of X (in terms of Y)?`, hi: `सीमा पर, संसाधन व तकनीक (C)=${state.resources} और वस्तु X का उत्पादन=${state.x} के साथ, X की एक और इकाई की अवसर लागत (Y के संदर्भ में) क्या है?` },
                        options,
                        correctIndex: 0,
                        explain: { en: `Opportunity Cost = MRT = 2X/C = 2×${state.x}/${state.resources} = ${correct}.`, hi: `अवसर लागत = MRT = 2X/C = 2×${state.x}/${state.resources} = ${correct}।` }
                    };
                }
            }
        ]
    };

    QUIZ_BANK['micro-positive-normative'] = {
        static: [
            {
                level: 'remember',
                question: { en: 'Positive economics deals with statements that are…', hi: 'सकारात्मक (Positive) अर्थशास्त्र किन कथनों से संबंधित है…' },
                options: [
                    { en: 'Testable against facts ("what is")', hi: 'तथ्यों के विरुद्ध परीक्षण योग्य ("क्या है")' },
                    { en: 'Value judgements ("what ought to be")', hi: 'मूल्य निर्णय ("क्या होना चाहिए")' },
                    { en: 'Always about the future only', hi: 'हमेशा केवल भविष्य के बारे में' },
                    { en: 'Never quantifiable', hi: 'कभी भी मात्रात्मक नहीं' }
                ],
                correctIndex: 0,
                explain: { en: 'Positive statements are factual and testable, e.g. "unemployment is 7%" — no value judgement involved.', hi: 'सकारात्मक कथन तथ्यात्मक और परीक्षण योग्य होते हैं, जैसे "बेरोज़गारी 7% है" — कोई मूल्य निर्णय शामिल नहीं।' },
                syllabusId: 'XI-B-U4-BRANCHES'
            },
            {
                level: 'remember',
                question: { en: 'Normative economics deals with statements that are…', hi: 'आदर्शात्मक (Normative) अर्थशास्त्र किन कथनों से संबंधित है…' },
                options: [
                    { en: 'Value judgements about what should happen', hi: 'क्या होना चाहिए इसके बारे में मूल्य निर्णय' },
                    { en: 'Purely factual and testable', hi: 'पूर्णतः तथ्यात्मक और परीक्षण योग्य' },
                    { en: 'Only about historical data', hi: 'केवल ऐतिहासिक डेटा के बारे में' },
                    { en: 'Never used in policy debates', hi: 'नीति बहसों में कभी उपयोग नहीं होते' }
                ],
                correctIndex: 0,
                explain: { en: '"Should", "ought to", "deserve" signal a normative (opinion-based) statement.', hi: '"चाहिए", "होना चाहिए", "योग्य है" जैसे शब्द एक आदर्शात्मक (राय-आधारित) कथन का संकेत देते हैं।' },
                syllabusId: 'XI-B-U4-BRANCHES'
            },
            {
                level: 'understand',
                question: { en: 'Microeconomics studies…', hi: 'सूक्ष्मअर्थशास्त्र (Microeconomics) अध्ययन करता है…' },
                options: [
                    { en: 'Individual units — a household, firm, or single market', hi: 'व्यक्तिगत इकाइयाँ — एक परिवार, फर्म, या एकल बाज़ार' },
                    { en: 'The economy as a whole', hi: 'संपूर्ण अर्थव्यवस्था' },
                    { en: 'Only international trade', hi: 'केवल अंतर्राष्ट्रीय व्यापार' },
                    { en: 'Only government policy', hi: 'केवल सरकारी नीति' }
                ],
                correctIndex: 0,
                explain: { en: 'Microeconomics zooms into individual decision-making units, unlike macroeconomics which studies aggregates.', hi: 'सूक्ष्मअर्थशास्त्र व्यक्तिगत निर्णय लेने वाली इकाइयों पर केंद्रित है, जबकि स्थूलअर्थशास्त्र समग्र चीज़ों का अध्ययन करता है।' },
                syllabusId: 'XI-B-U4-BRANCHES'
            },
            {
                level: 'understand',
                question: { en: 'Macroeconomics studies…', hi: 'स्थूलअर्थशास्त्र (Macroeconomics) अध्ययन करता है…' },
                options: [
                    { en: 'Economy-wide aggregates like national income, price level, employment', hi: 'राष्ट्रीय आय, कीमत स्तर, रोज़गार जैसे अर्थव्यवस्था-व्यापी समग्र' },
                    { en: 'One single firm\'s pricing decision', hi: 'एक ही फर्म का मूल्य निर्धारण निर्णय' },
                    { en: 'One household\'s grocery budget', hi: 'एक परिवार का किराने का बजट' },
                    { en: 'A single consumer\'s preferences', hi: 'एक उपभोक्ता की प्राथमिकताएँ' }
                ],
                correctIndex: 0,
                explain: { en: 'Macroeconomics studies the economy as a whole — aggregates, not individual units.', hi: 'स्थूलअर्थशास्त्र संपूर्ण अर्थव्यवस्था का अध्ययन करता है — समग्र, व्यक्तिगत इकाइयाँ नहीं।' },
                syllabusId: 'XI-B-U4-BRANCHES'
            },
            {
                level: 'apply',
                question: { en: '"India\'s GDP grew by 7.2% last year" is a…', hi: '"भारत की GDP पिछले साल 7.2% बढ़ी" एक…' },
                options: [
                    { en: 'Positive statement', hi: 'सकारात्मक कथन' },
                    { en: 'Normative statement', hi: 'आदर्शात्मक कथन' },
                    { en: 'Neither positive nor normative', hi: 'न तो सकारात्मक न ही आदर्शात्मक' },
                    { en: 'A microeconomic statement', hi: 'एक सूक्ष्मअर्थशास्त्रीय कथन' }
                ],
                correctIndex: 0,
                explain: { en: 'This is a factual, testable claim about a measured quantity — positive, and also a macroeconomic (aggregate) statement.', hi: 'यह एक मापी गई मात्रा के बारे में तथ्यात्मक, परीक्षण योग्य दावा है — सकारात्मक, और साथ ही एक स्थूलअर्थशास्त्रीय (समग्र) कथन भी।' }
            },
            {
                level: 'apply',
                question: { en: '"The government should reduce income inequality" is a…', hi: '"सरकार को आय असमानता कम करनी चाहिए" एक…' },
                options: [
                    { en: 'Normative statement', hi: 'आदर्शात्मक कथन' },
                    { en: 'Positive statement', hi: 'सकारात्मक कथन' },
                    { en: 'A statement with no economic content', hi: 'बिना किसी आर्थिक सामग्री वाला कथन' },
                    { en: 'A microeconomic statement about one firm', hi: 'एक फर्म के बारे में एक सूक्ष्मअर्थशास्त्रीय कथन' }
                ],
                correctIndex: 0,
                explain: { en: '"Should" signals a value judgement about what ought to happen — normative.', hi: '"चाहिए" शब्द यह दर्शाता है कि क्या होना चाहिए इसके बारे में एक मूल्य निर्णय है — आदर्शात्मक।' }
            },
            {
                level: 'apply',
                question: { en: '"How a single firm decides how much wheat to produce" belongs to…', hi: '"एक फर्म कितना गेहूँ उत्पादन करने का निर्णय कैसे लेती है" यह किसके अंतर्गत आता है…' },
                options: [
                    { en: 'Microeconomics', hi: 'सूक्ष्मअर्थशास्त्र' },
                    { en: 'Macroeconomics', hi: 'स्थूलअर्थशास्त्र' },
                    { en: 'Neither branch', hi: 'कोई भी शाखा नहीं' },
                    { en: 'International trade only', hi: 'केवल अंतर्राष्ट्रीय व्यापार' }
                ],
                correctIndex: 0,
                explain: { en: 'This is about one individual economic unit (a firm), not the whole economy — Microeconomics.', hi: 'यह एक व्यक्तिगत आर्थिक इकाई (एक फर्म) के बारे में है, संपूर्ण अर्थव्यवस्था के बारे में नहीं — सूक्ष्मअर्थशास्त्र।' }
            },
            {
                level: 'analyse',
                question: { en: 'Why can a single policy debate contain BOTH positive and normative claims?', hi: 'एक ही नीति बहस में सकारात्मक और आदर्शात्मक दोनों दावे क्यों हो सकते हैं?' },
                options: [
                    { en: 'A factual prediction (positive) is often used to justify a value judgement (normative) about what to do', hi: 'एक तथ्यात्मक भविष्यवाणी (सकारात्मक) अक्सर क्या करना है इसके बारे में एक मूल्य निर्णय (आदर्शात्मक) को उचित ठहराने के लिए उपयोग की जाती है' },
                    { en: 'They are actually the same thing', hi: 'वे वास्तव में एक ही चीज़ हैं' },
                    { en: 'Policy debates never contain positive claims', hi: 'नीति बहसों में कभी सकारात्मक दावे नहीं होते' },
                    { en: 'Policy debates never contain normative claims', hi: 'नीति बहसों में कभी आदर्शात्मक दावे नहीं होते' }
                ],
                correctIndex: 0,
                explain: { en: 'E.g. "a price ceiling causes a shortage" (positive) is often paired with "so we should/shouldn\'t impose one" (normative) — economics uses both together, but keeps them logically distinct.', hi: 'उदाहरण के लिए "एक मूल्य सीमा कमी पैदा करती है" (सकारात्मक) को अक्सर "इसलिए हमें एक लगानी चाहिए/नहीं लगानी चाहिए" (आदर्शात्मक) के साथ जोड़ा जाता है — अर्थशास्त्र दोनों को साथ उपयोग करता है, पर उन्हें तार्किक रूप से अलग रखता है।' }
            },
            {
                level: 'evaluate',
                question: { en: 'Can a normative statement ever be proven "true" or "false" the way a positive statement can?', hi: 'क्या एक आदर्शात्मक कथन को कभी भी उतना ही "सत्य" या "असत्य" साबित किया जा सकता है जितना एक सकारात्मक कथन को?' },
                options: [
                    { en: 'No — normative statements express values/opinions, which can be debated but not factually verified the way positive claims can', hi: 'नहीं — आदर्शात्मक कथन मूल्य/राय व्यक्त करते हैं, जिन पर बहस हो सकती है पर सकारात्मक दावों की तरह तथ्यात्मक रूप से सत्यापित नहीं किया जा सकता' },
                    { en: 'Yes, always, using the same methods as positive economics', hi: 'हाँ, हमेशा, सकारात्मक अर्थशास्त्र की समान विधियों का उपयोग करके' },
                    { en: 'Normative statements are always true by definition', hi: 'आदर्शात्मक कथन परिभाषा के अनुसार हमेशा सत्य होते हैं' },
                    { en: 'Normative statements are always false by definition', hi: 'आदर्शात्मक कथन परिभाषा के अनुसार हमेशा असत्य होते हैं' }
                ],
                correctIndex: 0,
                explain: { en: 'This is the key distinction the syllabus wants you to internalise: positive claims are checked against evidence; normative claims reflect values and are argued, not "proven".', hi: 'यही मुख्य अंतर है जिसे पाठ्यक्रम आपको आत्मसात करवाना चाहता है: सकारात्मक दावों की जाँच प्रमाण के विरुद्ध की जाती है; आदर्शात्मक दावे मूल्यों को दर्शाते हैं और उन पर तर्क किया जाता है, "सिद्ध" नहीं।' }
            },
            {
                level: 'create',
                question: { en: 'Which pair below correctly matches ONE positive and ONE normative statement about the same topic (inflation)?', hi: 'नीचे कौन-सा जोड़ा मुद्रास्फीति के बारे में एक सकारात्मक और एक आदर्शात्मक कथन का सही मिलान करता है?' },
                options: [
                    { en: '"Inflation rose to 6% this quarter" (positive) / "The RBI should raise interest rates" (normative)', hi: '"इस तिमाही मुद्रास्फीति 6% तक बढ़ी" (सकारात्मक) / "RBI को ब्याज दरें बढ़ानी चाहिए" (आदर्शात्मक)' },
                    { en: 'Both statements are positive', hi: 'दोनों कथन सकारात्मक हैं' },
                    { en: 'Both statements are normative', hi: 'दोनों कथन आदर्शात्मक हैं' },
                    { en: 'Neither statement is about inflation', hi: 'कोई भी कथन मुद्रास्फीति के बारे में नहीं है' }
                ],
                correctIndex: 0,
                explain: { en: 'The first is a testable, factual claim; the second is a value judgement about what policy action should follow — exactly one of each.', hi: 'पहला एक परीक्षण योग्य, तथ्यात्मक दावा है; दूसरा इस बारे में एक मूल्य निर्णय है कि कौन-सी नीतिगत कार्रवाई होनी चाहिए — बिल्कुल एक-एक।' }
            }
        ]
    };

    QUIZ_BANK['micro-indifference-curve'] = {
        static: [
            {
                level: 'remember',
                question: { en: 'Consumer equilibrium under Indifference Curve analysis occurs where…', hi: 'तटस्थता वक्र (Indifference Curve) विश्लेषण के तहत उपभोक्ता संतुलन कहाँ होता है…' },
                options: [
                    { en: 'The budget line is tangent to the highest attainable indifference curve', hi: 'बजट रेखा उच्चतम प्राप्य तटस्थता वक्र की स्पर्शरेखा है' },
                    { en: 'MU = 0', hi: 'MU = 0' },
                    { en: 'Price = 0', hi: 'कीमत = 0' },
                    { en: 'Income = 0', hi: 'आय = 0' }
                ],
                correctIndex: 0,
                explain: { en: 'The tangency point is where MRS = price ratio — the consumer can\'t do better without more income.', hi: 'स्पर्श बिंदु वह है जहाँ MRS = कीमत अनुपात — उपभोक्ता बिना अधिक आय के बेहतर नहीं कर सकता।' },
                syllabusId: 'XI-B-U5-IC'
            },
            {
                level: 'understand',
                question: { en: 'At consumer equilibrium under IC analysis, the equilibrium condition MRS = Price Ratio means…', hi: 'IC विश्लेषण के तहत उपभोक्ता संतुलन पर, MRS = कीमत अनुपात संतुलन शर्त का अर्थ है…' },
                options: [
                    { en: 'The rate the consumer is willing to trade goods equals the rate the market requires', hi: 'उपभोक्ता जिस दर पर वस्तुओं का व्यापार करने को तैयार है, वह बाज़ार द्वारा आवश्यक दर के बराबर है' },
                    { en: 'The consumer has run out of money entirely', hi: 'उपभोक्ता के पास पैसे पूरी तरह खत्म हो गए हैं' },
                    { en: 'Both goods are free', hi: 'दोनों वस्तुएँ मुफ्त हैं' },
                    { en: 'The indifference curve is a straight line', hi: 'तटस्थता वक्र एक सीधी रेखा है' }
                ],
                correctIndex: 0,
                explain: { en: 'MRS is the subjective trade-off rate; the price ratio is the market\'s trade-off rate — equality means the consumer is optimally allocated.', hi: 'MRS व्यक्तिपरक विनिमय दर है; कीमत अनुपात बाज़ार की विनिमय दर है — समानता का अर्थ है उपभोक्ता का इष्टतम आबंटन है।' },
                syllabusId: 'XI-B-U5-IC'
            },
            {
                level: 'analyse',
                question: { en: 'A higher (outer) indifference curve than the one touching the budget line represents…', hi: 'बजट रेखा को छूने वाली तटस्थता वक्र से ऊँची (बाहरी) तटस्थता वक्र क्या दर्शाती है…' },
                options: [
                    { en: 'A preferred but unattainable level of satisfaction given the current budget', hi: 'वर्तमान बजट को देखते हुए एक पसंदीदा लेकिन अप्राप्य संतुष्टि स्तर' },
                    { en: 'The actual chosen equilibrium', hi: 'वास्तविक चुना गया संतुलन' },
                    { en: 'A curve with lower satisfaction', hi: 'कम संतुष्टि वाली एक वक्र' },
                    { en: 'An impossible mathematical error', hi: 'एक असंभव गणितीय त्रुटि' }
                ],
                correctIndex: 0,
                explain: { en: 'Higher indifference curves mean more satisfaction — but if the budget line doesn\'t reach it, it\'s unaffordable at current income and prices.', hi: 'ऊँची तटस्थता वक्रें अधिक संतुष्टि दर्शाती हैं — पर यदि बजट रेखा उस तक नहीं पहुँचती, तो यह वर्तमान आय और कीमतों पर वहनीय नहीं है।' }
            },
            {
                level: 'evaluate',
                question: { en: 'If Px rises while Income and Py stay fixed, what happens to Equilibrium X* under this Cobb-Douglas model?', hi: 'यदि Px बढ़ता है जबकि आय और Py स्थिर रहते हैं, तो इस कॉब-डगलस मॉडल के तहत संतुलन X* का क्या होता है?' },
                options: [
                    { en: 'X* falls, since X* = a×Income/Px', hi: 'X* घटता है, क्योंकि X* = a×आय/Px' },
                    { en: 'X* rises', hi: 'X* बढ़ता है' },
                    { en: 'X* is unaffected by Px', hi: 'X*, Px से अप्रभावित रहता है' },
                    { en: 'Y* becomes negative', hi: 'Y* ऋणात्मक हो जाता है' }
                ],
                correctIndex: 0,
                explain: { en: 'X* = a·Income/Px — since Px is in the denominator, a higher Px directly reduces X* (and the budget line pivots inward on the X-axis).', hi: 'X* = a·आय/Px — चूँकि Px हर में है, अधिक Px सीधे X* को घटाता है (और बजट रेखा X-अक्ष पर अंदर की ओर घूमती है)।' }
            }
        ],
        applyTemplates: [
            {
                level: 'apply',
                build(state, metrics) {
                    if (!metrics || typeof metrics.X !== 'number') return null;
                    const correct = Math.round(metrics.X * 100) / 100;
                    const options = quizNumericOptions(correct, [3, -3, 6], { round: 2 });
                    return {
                        question: { en: `With Income=₹${state.income}, Px=₹${state.px}, Py=₹${state.py}, Preference Weight a=${state.pref}, what is the Equilibrium Quantity of X?`, hi: `आय=₹${state.income}, Px=₹${state.px}, Py=₹${state.py}, वरीयता भार a=${state.pref} के साथ, X की संतुलन मात्रा क्या है?` },
                        options,
                        correctIndex: 0,
                        explain: { en: `X* = a × Income / Px = ${state.pref} × ${state.income} / ${state.px} = ${correct}.`, hi: `X* = a × आय / Px = ${state.pref} × ${state.income} / ${state.px} = ${correct}।` }
                    };
                }
            }
        ]
    };

    QUIZ_BANK['micro-revenue-producer-equilibrium'] = {
        static: [
            {
                level: 'remember',
                question: { en: 'Under Perfect Competition, Average Revenue (AR) always equals…', hi: 'पूर्ण प्रतिस्पर्धा के तहत, औसत आय (AR) हमेशा किसके बराबर होती है…' },
                options: [
                    { en: 'Price, and also Marginal Revenue (AR=MR=P)', hi: 'कीमत, और साथ ही सीमांत आय (AR=MR=P)' },
                    { en: 'Total Cost', hi: 'कुल लागत' },
                    { en: 'Zero', hi: 'शून्य' },
                    { en: 'Marginal Cost, always', hi: 'हमेशा सीमांत लागत' }
                ],
                correctIndex: 0,
                explain: { en: 'A price-taking firm sells every unit at the market price, so AR=Price, and each extra unit adds exactly that price — so MR=Price too.', hi: 'एक कीमत-स्वीकर्ता फर्म हर इकाई बाज़ार कीमत पर बेचती है, इसलिए AR=कीमत, और हर अतिरिक्त इकाई ठीक उतनी ही कीमत जोड़ती है — इसलिए MR=कीमत भी।' },
                syllabusId: 'XI-B-U6-REVENUE'
            },
            {
                level: 'understand',
                question: { en: "A Producer's Equilibrium (profit-maximising output) occurs where…", hi: 'एक उत्पादक का संतुलन (लाभ-अधिकतमीकरण उत्पादन) कहाँ होता है…' },
                options: [
                    { en: 'MR = MC, with MC rising', hi: 'MR = MC, जहाँ MC बढ़ रही हो' },
                    { en: 'TR = TC exactly', hi: 'TR = TC बिल्कुल बराबर' },
                    { en: 'AR = AC', hi: 'AR = AC' },
                    { en: 'Price = 0', hi: 'कीमत = 0' }
                ],
                correctIndex: 0,
                explain: { en: 'Producing where MR=MC (with MC rising through that point) maximises profit — producing more or less would reduce it.', hi: 'MR=MC (जहाँ MC उस बिंदु से बढ़ रही हो) पर उत्पादन करना लाभ को अधिकतम करता है — अधिक या कम उत्पादन इसे कम कर देगा।' },
                syllabusId: 'XI-B-U6-PRODUCER-EQ'
            },
            {
                level: 'analyse',
                question: { en: 'Under a downward-sloping demand curve (contrast case), why does MR fall FASTER than AR/Price as output rises?', hi: 'नीचे की ओर ढलान वाली माँग वक्र (विरोधाभासी स्थिति) के तहत, उत्पादन बढ़ने पर MR, AR/कीमत की तुलना में तेज़ी से क्यों घटता है?' },
                options: [
                    { en: 'To sell one more unit, the firm must lower price on ALL units, not just the last one', hi: 'एक और इकाई बेचने के लिए, फर्म को सभी इकाइयों पर कीमत घटानी होती है, केवल अंतिम पर नहीं' },
                    { en: 'MR and AR are actually always identical here too', hi: 'यहाँ भी MR और AR वास्तव में हमेशा समान होते हैं' },
                    { en: 'Costs rise faster than revenue always', hi: 'लागत हमेशा आय से तेज़ी से बढ़ती है' },
                    { en: 'It is a random modelling choice with no economic reason', hi: 'यह बिना किसी आर्थिक कारण के एक यादृच्छिक मॉडलिंग विकल्प है' }
                ],
                correctIndex: 0,
                explain: { en: 'A firm facing a downward-sloping demand curve must cut price on all units sold to sell one more, so each extra unit\'s NET revenue contribution (MR) falls faster than price (AR) itself.', hi: 'नीचे की ओर ढलान वाली माँग वक्र का सामना करने वाली फर्म को एक और बेचने के लिए सभी बेची गई इकाइयों पर कीमत घटानी पड़ती है, इसलिए प्रत्येक अतिरिक्त इकाई का निवल आय योगदान (MR) कीमत (AR) से तेज़ी से घटता है।' }
            },
            {
                level: 'evaluate',
                question: { en: 'A firm is currently producing where MC > MR. What should it do to increase profit?', hi: 'एक फर्म वर्तमान में वहाँ उत्पादन कर रही है जहाँ MC > MR है। लाभ बढ़ाने के लिए उसे क्या करना चाहिए?' },
                options: [
                    { en: 'Reduce output — the last units are costing more than they earn', hi: 'उत्पादन कम करे — अंतिम इकाइयों की लागत उनकी कमाई से अधिक है' },
                    { en: 'Increase output further', hi: 'उत्पादन और बढ़ाए' },
                    { en: 'Shut down immediately regardless of costs', hi: 'लागत की परवाह किए बिना तुरंत बंद कर दे' },
                    { en: 'Raise Fixed Cost', hi: 'स्थिर लागत बढ़ाए' }
                ],
                correctIndex: 0,
                explain: { en: 'If MC exceeds MR, the last units produced cost more than they bring in — cutting back toward MR=MC raises profit.', hi: 'यदि MC, MR से अधिक है, तो उत्पादित अंतिम इकाइयों की लागत उनकी कमाई से अधिक है — MR=MC की ओर उत्पादन घटाने से लाभ बढ़ता है।' }
            }
        ],
        applyTemplates: [
            {
                level: 'apply',
                build(state, metrics) {
                    if (!metrics || typeof metrics.Qstar !== 'number') return null;
                    const correct = Math.round(metrics.Qstar * 10) / 10;
                    const options = quizNumericOptions(correct, [3, -3, 6], { round: 1, suffix: ' units' });
                    return {
                        question: { en: `In ${state.marketType === 'perfect' ? 'Perfect Competition' : 'the downward-sloping demand'} mode, with MC Base=₹${state.mcBase} and MC Slope=${state.mcSlope}, what is the Producer's Equilibrium Output?`, hi: `${state.marketType === 'perfect' ? 'पूर्ण प्रतिस्पर्धा' : 'नीचे की ओर ढलान वाली माँग'} मोड में, MC आधार=₹${state.mcBase} और MC ढलान=${state.mcSlope} के साथ, उत्पादक का संतुलन उत्पादन क्या है?` },
                        options,
                        correctIndex: 0,
                        explain: { en: `The red marker on the chart (where MR=MC) sits at Q ≈ ${correct}.`, hi: `चार्ट पर लाल चिह्न (जहाँ MR=MC) Q ≈ ${correct} पर स्थित है।` }
                    };
                }
            }
        ]
    };

    QUIZ_BANK['micro-elasticity-supply'] = {
        static: [
            {
                level: 'remember',
                question: { en: 'Price Elasticity of Supply (Es) measures…', hi: 'आपूर्ति की कीमत लोच (Es) क्या मापती है…' },
                options: [
                    { en: 'How much quantity supplied responds to a price change', hi: 'आपूर्ति की मात्रा कीमत परिवर्तन पर कितनी प्रतिक्रिया देती है' },
                    { en: 'How much demand responds to income', hi: 'माँग आय पर कितनी प्रतिक्रिया देती है' },
                    { en: 'The absolute level of price', hi: 'कीमत का पूर्ण स्तर' },
                    { en: 'Total Revenue only', hi: 'केवल कुल आय' }
                ],
                correctIndex: 0,
                explain: { en: 'Es = %ΔQuantity Supplied / %ΔPrice.', hi: 'Es = आपूर्ति मात्रा में % परिवर्तन / कीमत में % परिवर्तन।' },
                syllabusId: 'XI-B-U6-SUPPLY'
            },
            {
                level: 'understand',
                question: { en: 'In the "Market Period", supply is typically…', hi: '"बाज़ार अवधि" में, आपूर्ति सामान्यतः होती है…' },
                options: [
                    { en: 'Highly inelastic — output is already produced and nearly fixed', hi: 'अत्यधिक बेलोचदार — उत्पादन पहले से ही हो चुका है और लगभग स्थिर है' },
                    { en: 'Highly elastic', hi: 'अत्यधिक लोचदार' },
                    { en: 'Exactly unit elastic always', hi: 'हमेशा बिल्कुल इकाई लोचदार' },
                    { en: 'Undefined', hi: 'अपरिभाषित' }
                ],
                correctIndex: 0,
                explain: { en: 'In the very short market period, producers can\'t adjust output at all — think of a fish market with today\'s catch already fixed.', hi: 'बहुत छोटी बाज़ार अवधि में, उत्पादक बिल्कुल भी उत्पादन समायोजित नहीं कर सकते — एक मछली बाज़ार के बारे में सोचें जहाँ आज की पकड़ पहले से तय है।' },
                syllabusId: 'XI-B-U6-SUPPLY'
            },
            {
                level: 'analyse',
                question: { en: 'Why is supply MORE elastic in the Long Run than in the Short Run?', hi: 'दीर्घकाल में आपूर्ति अल्पकाल की तुलना में अधिक लोचदार क्यों होती है?' },
                options: [
                    { en: 'Firms can build new capacity or exit the industry, allowing a much bigger quantity response', hi: 'फर्में नई क्षमता बना सकती हैं या उद्योग से बाहर निकल सकती हैं, जिससे मात्रा में बहुत बड़ी प्रतिक्रिया संभव होती है' },
                    { en: 'Prices are fixed by law in the long run', hi: 'दीर्घकाल में कीमतें कानून द्वारा तय होती हैं' },
                    { en: 'The long run has no producers at all', hi: 'दीर्घकाल में कोई उत्पादक ही नहीं होते' },
                    { en: 'There is no difference at all', hi: 'इसमें बिल्कुल भी कोई अंतर नहीं है' }
                ],
                correctIndex: 0,
                explain: { en: 'More time allows more adjustment — new plants, more workers, even new firms entering — so quantity responds much more strongly to price in the long run.', hi: 'अधिक समय अधिक समायोजन की अनुमति देता है — नए संयंत्र, अधिक श्रमिक, यहाँ तक कि नई फर्मों का प्रवेश — इसलिए दीर्घकाल में मात्रा कीमत पर बहुत अधिक तेज़ी से प्रतिक्रिया देती है।' }
            }
        ],
        applyTemplates: [
            {
                level: 'apply',
                build(state, metrics) {
                    if (!metrics || typeof metrics.Es !== 'number') return null;
                    const correct = Math.round(metrics.Es * 100) / 100;
                    const options = quizNumericOptions(correct, [0.3, -0.15, 0.6], { round: 2 });
                    return {
                        question: { en: `In the "${state.period === 'market' ? 'Market Period' : state.period === 'short' ? 'Short Run' : 'Long Run'}" at Price=₹${state.price}, what is Es?`, hi: `"${state.period === 'market' ? 'बाज़ार अवधि' : state.period === 'short' ? 'अल्पकाल' : 'दीर्घकाल'}" में कीमत=₹${state.price} पर, Es क्या है?` },
                        options,
                        correctIndex: 0,
                        explain: { en: `Read the "Price Elasticity of Supply (Es)" row in Live Readings: ${correct}.`, hi: `Live Readings में "Price Elasticity of Supply (Es)" पंक्ति पढ़ें: ${correct}।` }
                    };
                }
            }
        ]
    };
}
