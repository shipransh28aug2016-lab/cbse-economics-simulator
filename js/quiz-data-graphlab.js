// Quiz banks for the 10 Graph Labs (js/simulations_graphlab.js and
// js/simulations_graphlab_macro.js). See js/quiz-engine.js for the
// QUIZ_BANK contract.
//
// These lean hard on the movement-vs-shift / expansion-vs-increase
// vocabulary, because that is the distinction the Graph Labs exist to
// teach and the one CBSE marks most often. Apply-templates read the same
// `metrics` object graphLab.model() already returns, so a generated
// question's correct answer is always computed, never authored.

if (typeof QUIZ_BANK !== 'undefined') {

    QUIZ_BANK['gl-demand-movement-shift'] = {
        static: [
            {
                level: 'remember',
                question: { en: 'A fall in the price of a good, other things constant, causes…', hi: 'अन्य बातें समान रहने पर वस्तु की कीमत में गिरावट किसका कारण बनती है…' },
                options: [
                    { en: 'Expansion (extension) of demand — a movement DOWN along the same demand curve', hi: 'माँग में विस्तार — उसी माँग वक्र पर नीचे की ओर संचलन' },
                    { en: 'Increase in demand — a rightward shift of the curve', hi: 'माँग में वृद्धि — वक्र का दाईं ओर खिसकना' },
                    { en: 'Decrease in demand — a leftward shift of the curve', hi: 'माँग में कमी — वक्र का बाईं ओर खिसकना' },
                    { en: 'Contraction of demand', hi: 'माँग में संकुचन' }
                ],
                correctIndex: 0,
                explain: { en: 'Own price is the one variable already measured on the axis, so a price change never moves the curve — it moves you along it. Price down means quantity demanded up: expansion.', hi: 'स्वयं की कीमत पहले से ही अक्ष पर मापी जाती है, इसलिए कीमत परिवर्तन वक्र को कभी नहीं हिलाता — यह आपको वक्र पर सरकाता है। कीमत घटी तो माँगी गई मात्रा बढ़ी: विस्तार।' },
                syllabusId: 'XI-B-U5-DEMAND',
                // Option index 1 is THE classic exam mix-up this whole lab
                // is built to prevent — a price-driven change mistaken for
                // a shift. See CLAUDE.md's "Graph Labs" section.
                misconceptions: {
                    1: { en: 'A price change is a MOVEMENT along the same curve, never a shift — "increase in demand" specifically means the whole curve relocated, which only a non-price determinant (income, tastes, substitutes…) can cause. This price fall is an expansion, not an increase.', hi: 'कीमत परिवर्तन उसी वक्र पर एक संचलन है, कभी खिसकाव नहीं — "माँग में वृद्धि" का अर्थ विशेष रूप से यह है कि पूरा वक्र स्थानांतरित हुआ, जो केवल एक गैर-कीमत निर्धारक (आय, रुचि, स्थानापन्न…) से हो सकता है। यह कीमत गिरावट एक विस्तार है, वृद्धि नहीं।' }
                }
            },
            {
                level: 'understand',
                question: { en: 'Consumer income rises and the good is a normal good. What happens on the diagram?', hi: 'उपभोक्ता की आय बढ़ती है और वस्तु सामान्य वस्तु है। आरेख पर क्या होता है?' },
                options: [
                    { en: 'The whole demand curve shifts rightward to D₁D₁ — an increase in demand', hi: 'पूरा माँग वक्र दाईं ओर D₁D₁ पर खिसकता है — माँग में वृद्धि' },
                    { en: 'You move down along the existing curve', hi: 'आप मौजूदा वक्र पर नीचे सरकते हैं' },
                    { en: 'The curve shifts leftward', hi: 'वक्र बाईं ओर खिसकता है' },
                    { en: 'Nothing changes until price changes', hi: 'कीमत बदलने तक कुछ नहीं बदलता' }
                ],
                correctIndex: 0,
                explain: { en: 'Income is a non-price determinant. For a normal good, higher income means more is demanded at EVERY price — so the entire curve relocates rightward.', hi: 'आय एक गैर-कीमत निर्धारक है। सामान्य वस्तु के लिए अधिक आय का अर्थ है हर कीमत पर अधिक माँग — इसलिए पूरा वक्र दाईं ओर स्थानांतरित होता है।' },
                syllabusId: 'XI-B-U5-DEMAND',
                // The mirror-image mix-up of the question above — a
                // non-price determinant mistaken for a price-driven
                // movement.
                misconceptions: {
                    1: { en: '"Moving down along the existing curve" is what an OWN-PRICE fall causes — but income is not the good\'s own price, it\'s a non-price determinant. Those always relocate the whole curve (a shift), never just slide you along it.', hi: '"मौजूदा वक्र पर नीचे सरकना" वह है जो स्वयं की कीमत में गिरावट से होता है — लेकिन आय वस्तु की अपनी कीमत नहीं, एक गैर-कीमत निर्धारक है। ये हमेशा पूरे वक्र को स्थानांतरित करते हैं (खिसकाव), कभी केवल उस पर सरकाते नहीं।' }
                }
            },
            {
                level: 'analyse',
                question: { en: 'Tea and coffee are substitutes. The price of coffee FALLS. What happens to the demand curve for tea?', hi: 'चाय और कॉफ़ी स्थानापन्न हैं। कॉफ़ी की कीमत घटती है। चाय के माँग वक्र का क्या होता है?' },
                options: [
                    { en: 'It shifts leftward — a decrease in demand for tea', hi: 'यह बाईं ओर खिसकता है — चाय की माँग में कमी' },
                    { en: 'It shifts rightward — an increase in demand for tea', hi: 'यह दाईं ओर खिसकता है — चाय की माँग में वृद्धि' },
                    { en: 'There is a movement along the tea demand curve', hi: 'चाय के माँग वक्र पर संचलन होता है' },
                    { en: 'The tea curve becomes vertical', hi: 'चाय का वक्र ऊर्ध्वाधर हो जाता है' }
                ],
                correctIndex: 0,
                explain: { en: 'Cheaper coffee pulls buyers away from tea, so less tea is demanded at every tea price. The price of a RELATED good is a non-price determinant for tea — so the tea curve shifts left.', hi: 'सस्ती कॉफ़ी खरीदारों को चाय से दूर खींचती है, इसलिए हर कीमत पर कम चाय माँगी जाती है। संबंधित वस्तु की कीमत चाय के लिए गैर-कीमत निर्धारक है — इसलिए चाय का वक्र बाईं ओर खिसकता है।' },
                syllabusId: 'XI-B-U5-DEMAND'
            },
            {
                level: 'evaluate',
                question: { en: 'A student writes: "Price fell, so demand increased." Why does this lose marks?', hi: 'एक छात्र लिखता है: "कीमत घटी, इसलिए माँग बढ़ी।" इससे अंक क्यों कटते हैं?' },
                options: [
                    { en: '"Increase in demand" means a rightward SHIFT caused by a non-price factor; a price fall causes expansion, a MOVEMENT along the curve', hi: '"माँग में वृद्धि" का अर्थ है गैर-कीमत कारक से दाईं ओर खिसकना; कीमत गिरने से विस्तार होता है, वक्र पर संचलन' },
                    { en: 'Because demand never responds to price', hi: 'क्योंकि माँग कभी कीमत पर प्रतिक्रिया नहीं करती' },
                    { en: 'Because the demand curve slopes upward', hi: 'क्योंकि माँग वक्र ऊपर की ओर ढलान वाला है' },
                    { en: 'It does not lose marks — the two terms mean the same thing', hi: 'इससे अंक नहीं कटते — दोनों शब्दों का अर्थ एक ही है' }
                ],
                correctIndex: 0,
                explain: { en: 'The two terms describe two different diagrams. Quantity demanded rose, but demand (the whole schedule/curve) did not change at all. Correct wording: "quantity demanded rose — an expansion of demand."', hi: 'दोनों शब्द दो अलग आरेखों का वर्णन करते हैं। माँगी गई मात्रा बढ़ी, पर माँग (पूरी अनुसूची/वक्र) बिल्कुल नहीं बदली। सही शब्द: "माँगी गई मात्रा बढ़ी — माँग में विस्तार।"' },
                syllabusId: 'XI-B-U5-DEMAND'
            },
            {
                level: 'understand',
                question: { en: 'Which of these causes a MOVEMENT along the demand curve rather than a shift?', hi: 'इनमें से कौन माँग वक्र पर संचलन कराता है, खिसकाव नहीं?' },
                options: [
                    { en: 'A change in the price of the good itself', hi: 'वस्तु की अपनी कीमत में परिवर्तन' },
                    { en: 'A change in consumer income', hi: 'उपभोक्ता आय में परिवर्तन' },
                    { en: 'A change in tastes and preferences', hi: 'रुचि और वरीयता में परिवर्तन' },
                    { en: 'A change in the number of buyers', hi: 'खरीदारों की संख्या में परिवर्तन' }
                ],
                correctIndex: 0,
                explain: { en: 'Only the good\'s own price is plotted on the diagram\'s axis. Everything else is held constant when the curve is drawn, so a change in any of them redraws the curve in a new position.', hi: 'केवल वस्तु की अपनी कीमत आरेख के अक्ष पर होती है। वक्र बनाते समय बाकी सब स्थिर रखा जाता है, इसलिए उनमें कोई भी परिवर्तन वक्र को नई स्थिति में खींच देता है।' },
                syllabusId: 'XI-B-U5-DEMAND'
            },
            {
                level: 'apply',
                question: { en: 'The government announces that petrol prices will rise sharply NEXT month. What happens to today\'s demand curve for petrol?', hi: 'सरकार घोषणा करती है कि अगले महीने पेट्रोल की कीमतें तेज़ी से बढ़ेंगी। आज के पेट्रोल माँग वक्र का क्या होता है?' },
                options: [
                    { en: 'It shifts rightward today — expected future price rise is a non-price determinant', hi: 'यह आज दाईं ओर खिसकता है — भविष्य में कीमत बढ़ने की अपेक्षा एक गैर-कीमत निर्धारक है' },
                    { en: 'It shifts leftward today', hi: 'यह आज बाईं ओर खिसकता है' },
                    { en: 'There is a contraction along today\'s curve', hi: 'आज के वक्र पर संकुचन होता है' },
                    { en: 'Nothing happens until the price actually rises', hi: 'कीमत वास्तव में बढ़ने तक कुछ नहीं होता' }
                ],
                correctIndex: 0,
                explain: { en: 'Buyers rush to stock up now. Today\'s price has not changed, so this cannot be a movement — expectations shift the whole curve rightward.', hi: 'खरीदार अभी स्टॉक करने के लिए दौड़ पड़ते हैं। आज की कीमत नहीं बदली, इसलिए यह संचलन नहीं हो सकता — अपेक्षाएँ पूरे वक्र को दाईं ओर खिसकाती हैं।' },
                syllabusId: 'XI-B-U5-DEMAND'
            }
        ],
        applyTemplates: [
            {
                level: 'apply',
                build(state, m) {
                    if (typeof m.q !== 'number' || !isFinite(m.q)) return null;
                    return {
                        question: { en: `On this diagram the own price is ₹${Math.round(state.price)} and the net non-price shift is ${m.shift >= 0 ? '+' : ''}${Math.round(m.shift)}. What is the quantity demanded?`, hi: `इस आरेख में स्वयं की कीमत ₹${Math.round(state.price)} है और शुद्ध गैर-कीमत खिसकाव ${m.shift >= 0 ? '+' : ''}${Math.round(m.shift)} है। माँगी गई मात्रा कितनी है?` },
                        options: quizNumericOptions(m.q, [6, -5, 11], { round: 1, suffix: ' units' }),
                        correctIndex: 0,
                        explain: { en: `Read off the curve at that price: Q = ${m.q.toFixed(1)} units.`, hi: `उस कीमत पर वक्र से पढ़ें: Q = ${m.q.toFixed(1)} इकाई।` },
                        syllabusId: 'XI-B-U5-DEMAND'
                    };
                }
            },
            {
                level: 'analyse',
                build(state, m) {
                    if (typeof m.priceD !== 'number' || typeof m.shift !== 'number') return null;
                    const moved = Math.abs(m.priceD) > 0.001, shifted = Math.abs(m.shift) > 0.001;
                    const right = moved && shifted
                        ? { en: 'Both — a shift of the curve AND a movement along the new curve', hi: 'दोनों — वक्र का खिसकाव और नए वक्र पर संचलन' }
                        : moved
                            ? (m.priceD > 0 ? { en: 'Contraction of demand (movement along the curve)', hi: 'माँग में संकुचन (वक्र पर संचलन)' } : { en: 'Expansion of demand (movement along the curve)', hi: 'माँग में विस्तार (वक्र पर संचलन)' })
                            : shifted
                                ? (m.shift > 0 ? { en: 'Increase in demand (rightward shift)', hi: 'माँग में वृद्धि (दाईं ओर खिसकाव)' } : { en: 'Decrease in demand (leftward shift)', hi: 'माँग में कमी (बाईं ओर खिसकाव)' })
                                : { en: 'No change at all', hi: 'कोई परिवर्तन नहीं' };
                    const wrong = [
                        { en: 'Increase in demand (rightward shift)', hi: 'माँग में वृद्धि (दाईं ओर खिसकाव)' },
                        { en: 'Decrease in demand (leftward shift)', hi: 'माँग में कमी (बाईं ओर खिसकाव)' },
                        { en: 'Expansion of demand (movement along the curve)', hi: 'माँग में विस्तार (वक्र पर संचलन)' },
                        { en: 'Contraction of demand (movement along the curve)', hi: 'माँग में संकुचन (वक्र पर संचलन)' },
                        { en: 'Both — a shift of the curve AND a movement along the new curve', hi: 'दोनों — वक्र का खिसकाव और नए वक्र पर संचलन' },
                        { en: 'No change at all', hi: 'कोई परिवर्तन नहीं' }
                    ].filter(o => o.en !== right.en).slice(0, 3);
                    return {
                        question: { en: `Own price went from ₹50 to ₹${Math.round(state.price)} and the net non-price effect is ${m.shift >= 0 ? '+' : ''}${Math.round(m.shift)}. Name what happened, in exam terms.`, hi: `स्वयं की कीमत ₹50 से ₹${Math.round(state.price)} हुई और शुद्ध गैर-कीमत प्रभाव ${m.shift >= 0 ? '+' : ''}${Math.round(m.shift)} है। परीक्षा की भाषा में बताइए क्या हुआ।` },
                        options: [right, ...wrong],
                        correctIndex: 0,
                        explain: { en: 'Own price ⇒ movement (expansion/contraction). Non-price determinant ⇒ shift (increase/decrease). Both changed ⇒ name both, separately.', hi: 'स्वयं की कीमत ⇒ संचलन (विस्तार/संकुचन)। गैर-कीमत निर्धारक ⇒ खिसकाव (वृद्धि/कमी)। दोनों बदले ⇒ दोनों अलग-अलग बताइए।' },
                        syllabusId: 'XI-B-U5-DEMAND'
                    };
                }
            }
        ]
    };

    QUIZ_BANK['gl-supply-movement-shift'] = {
        static: [
            {
                level: 'remember',
                question: { en: 'A rise in the price of a good, other things constant, causes…', hi: 'अन्य बातें समान रहने पर वस्तु की कीमत में वृद्धि किसका कारण बनती है…' },
                options: [
                    { en: 'Expansion of supply — a movement UP along the same supply curve', hi: 'पूर्ति में विस्तार — उसी पूर्ति वक्र पर ऊपर की ओर संचलन' },
                    { en: 'Increase in supply — a rightward shift', hi: 'पूर्ति में वृद्धि — दाईं ओर खिसकाव' },
                    { en: 'Contraction of supply', hi: 'पूर्ति में संकुचन' },
                    { en: 'Decrease in supply — a leftward shift', hi: 'पूर्ति में कमी — बाईं ओर खिसकाव' }
                ],
                correctIndex: 0,
                explain: { en: 'SS slopes upward, so a higher own price means more is supplied — but you stay on the same curve. That movement is called expansion of supply.', hi: 'SS ऊपर की ओर ढलान वाला है, इसलिए अधिक कीमत का अर्थ अधिक पूर्ति — पर आप उसी वक्र पर रहते हैं। इस संचलन को पूर्ति में विस्तार कहते हैं।' },
                syllabusId: 'XI-B-U6-SUPPLY',
                misconceptions: {
                    1: { en: 'A price change is a MOVEMENT along the same SS curve, never a shift — "increase in supply" specifically means the whole curve relocated, which only a non-price determinant (input cost, technology, tax/subsidy…) can cause. This price rise is an expansion, not an increase.', hi: 'कीमत परिवर्तन उसी SS वक्र पर एक संचलन है, कभी खिसकाव नहीं — "पूर्ति में वृद्धि" का अर्थ विशेष रूप से यह है कि पूरा वक्र स्थानांतरित हुआ, जो केवल एक गैर-कीमत निर्धारक (इनपुट लागत, प्रौद्योगिकी, कर/सब्सिडी…) से हो सकता है। यह कीमत वृद्धि एक विस्तार है, वृद्धि नहीं।' }
                }
            },
            {
                level: 'understand',
                question: { en: 'The government grants a per-unit subsidy to producers. On the diagram this is…', hi: 'सरकार उत्पादकों को प्रति-इकाई सब्सिडी देती है। आरेख पर यह है…' },
                options: [
                    { en: 'A rightward shift of SS — an increase in supply', hi: 'SS का दाईं ओर खिसकाव — पूर्ति में वृद्धि' },
                    { en: 'A movement up along SS — expansion of supply', hi: 'SS पर ऊपर संचलन — पूर्ति में विस्तार' },
                    { en: 'A leftward shift of SS', hi: 'SS का बाईं ओर खिसकाव' },
                    { en: 'A movement down along SS', hi: 'SS पर नीचे संचलन' }
                ],
                correctIndex: 0,
                explain: { en: 'A subsidy cuts the effective cost of production, so more is supplied at EVERY price. Cost is a non-price determinant, so the whole curve relocates rightward.', hi: 'सब्सिडी उत्पादन की प्रभावी लागत घटाती है, इसलिए हर कीमत पर अधिक पूर्ति होती है। लागत गैर-कीमत निर्धारक है, इसलिए पूरा वक्र दाईं ओर खिसकता है।' },
                syllabusId: 'XI-B-U6-SUPPLY',
                misconceptions: {
                    1: { en: 'A subsidy is not the good\'s own price — it\'s a non-price determinant (it cuts effective cost), so it always relocates the WHOLE curve. "Movement along SS" is what an own-price rise causes, not a subsidy.', hi: 'सब्सिडी वस्तु की अपनी कीमत नहीं है — यह एक गैर-कीमत निर्धारक है (यह प्रभावी लागत घटाती है), इसलिए यह हमेशा पूरे वक्र को स्थानांतरित करती है। "SS पर संचलन" वह है जो स्वयं की कीमत में वृद्धि से होता है, सब्सिडी से नहीं।' }
                }
            },
            {
                level: 'analyse',
                question: { en: 'Why is a price RISE called "expansion" for supply but "contraction" for demand?', hi: 'कीमत बढ़ने को पूर्ति में "विस्तार" पर माँग में "संकुचन" क्यों कहते हैं?' },
                options: [
                    { en: 'Both are movements along a curve; the name follows the QUANTITY, and SS slopes up while DD slopes down', hi: 'दोनों वक्र पर संचलन हैं; नाम मात्रा का अनुसरण करता है, और SS ऊपर जबकि DD नीचे ढलान वाला है' },
                    { en: 'Because supply curves shift but demand curves do not', hi: 'क्योंकि पूर्ति वक्र खिसकते हैं पर माँग वक्र नहीं' },
                    { en: 'Because price affects supply but not demand', hi: 'क्योंकि कीमत पूर्ति को प्रभावित करती है, माँग को नहीं' },
                    { en: 'It is just a naming convention with no logic', hi: 'यह बिना तर्क की केवल एक नामकरण परंपरा है' }
                ],
                correctIndex: 0,
                explain: { en: 'Expansion always means quantity ROSE; contraction always means quantity FELL. Because the two curves slope in opposite directions, the same price rise raises Qs but lowers Qd.', hi: 'विस्तार का अर्थ हमेशा मात्रा बढ़ी; संकुचन का अर्थ हमेशा मात्रा घटी। चूँकि दोनों वक्र विपरीत दिशा में ढलान वाले हैं, वही कीमत वृद्धि Qs बढ़ाती है पर Qd घटाती है।' },
                syllabusId: 'XI-B-U6-SUPPLY'
            },
            {
                level: 'apply',
                question: { en: 'Wages of factory workers rise sharply. What happens to the supply curve?', hi: 'कारखाना श्रमिकों की मजदूरी तेज़ी से बढ़ती है। पूर्ति वक्र का क्या होता है?' },
                options: [
                    { en: 'It shifts leftward — a decrease in supply', hi: 'यह बाईं ओर खिसकता है — पूर्ति में कमी' },
                    { en: 'It shifts rightward — an increase in supply', hi: 'यह दाईं ओर खिसकता है — पूर्ति में वृद्धि' },
                    { en: 'Movement up along the curve', hi: 'वक्र पर ऊपर संचलन' },
                    { en: 'The curve becomes horizontal', hi: 'वक्र क्षैतिज हो जाता है' }
                ],
                correctIndex: 0,
                explain: { en: 'Wages are an input/factor cost — a non-price determinant. Higher costs mean less is supplied at every price, so SS shifts left.', hi: 'मजदूरी एक आगत/साधन लागत है — गैर-कीमत निर्धारक। अधिक लागत का अर्थ हर कीमत पर कम पूर्ति, इसलिए SS बाईं ओर खिसकता है।' },
                syllabusId: 'XI-B-U6-SUPPLY'
            },
            {
                level: 'evaluate',
                question: { en: 'Which pair correctly matches cause to diagram effect?', hi: 'कौन सी जोड़ी कारण को आरेख-प्रभाव से सही मिलाती है?' },
                options: [
                    { en: 'Better technology → rightward shift; own price falls → contraction of supply', hi: 'बेहतर तकनीक → दाईं ओर खिसकाव; स्वयं की कीमत गिरे → पूर्ति में संकुचन' },
                    { en: 'Better technology → contraction; own price falls → leftward shift', hi: 'बेहतर तकनीक → संकुचन; स्वयं की कीमत गिरे → बाईं ओर खिसकाव' },
                    { en: 'Both cause a rightward shift', hi: 'दोनों दाईं ओर खिसकाव कराते हैं' },
                    { en: 'Both cause a movement along the curve', hi: 'दोनों वक्र पर संचलन कराते हैं' }
                ],
                correctIndex: 0,
                explain: { en: 'Technology is non-price ⇒ the curve relocates. Own price is on the axis ⇒ you travel along the curve; a fall means less supplied, i.e. contraction.', hi: 'तकनीक गैर-कीमत है ⇒ वक्र स्थानांतरित होता है। स्वयं की कीमत अक्ष पर है ⇒ आप वक्र पर चलते हैं; गिरावट का अर्थ कम पूर्ति, यानी संकुचन।' },
                syllabusId: 'XI-B-U6-SUPPLY'
            },
            {
                level: 'remember',
                question: { en: 'Which is NOT a determinant that shifts the supply curve?', hi: 'कौन सा निर्धारक पूर्ति वक्र को नहीं खिसकाता?' },
                options: [
                    { en: 'The price of the good itself', hi: 'वस्तु की अपनी कीमत' },
                    { en: 'The state of technology', hi: 'तकनीक की स्थिति' },
                    { en: 'Input / factor prices', hi: 'आगत/साधन कीमतें' },
                    { en: 'Government taxes and subsidies', hi: 'सरकारी कर और सब्सिडी' }
                ],
                correctIndex: 0,
                explain: { en: 'The good\'s own price is the axis variable — it moves you along the curve, never shifts it.', hi: 'वस्तु की अपनी कीमत अक्ष चर है — यह आपको वक्र पर सरकाती है, उसे कभी नहीं खिसकाती।' },
                syllabusId: 'XI-B-U6-SUPPLY'
            }
        ],
        applyTemplates: [
            {
                level: 'apply',
                build(state, m) {
                    if (typeof m.q !== 'number' || !isFinite(m.q)) return null;
                    return {
                        question: { en: `At an own price of ₹${Math.round(state.price)} with a net non-price shift of ${m.shift >= 0 ? '+' : ''}${Math.round(m.shift)}, what quantity is supplied?`, hi: `₹${Math.round(state.price)} की स्वयं कीमत और ${m.shift >= 0 ? '+' : ''}${Math.round(m.shift)} के शुद्ध गैर-कीमत खिसकाव पर कितनी मात्रा की पूर्ति होगी?` },
                        options: quizNumericOptions(m.q, [7, -6, 12], { round: 1, suffix: ' units' }),
                        correctIndex: 0,
                        explain: { en: `Read the supply curve at that price: Q = ${m.q.toFixed(1)} units.`, hi: `उस कीमत पर पूर्ति वक्र पढ़ें: Q = ${m.q.toFixed(1)} इकाई।` },
                        syllabusId: 'XI-B-U6-SUPPLY'
                    };
                }
            }
        ]
    };

    QUIZ_BANK['gl-market-equilibrium-shifts'] = {
        static: [
            {
                level: 'remember',
                question: { en: 'When the market price is BELOW the equilibrium price, the market has…', hi: 'जब बाज़ार कीमत संतुलन कीमत से नीचे हो, तो बाज़ार में होता है…' },
                options: [
                    { en: 'Excess demand (a shortage) — price is pushed up', hi: 'अतिरेक माँग (कमी) — कीमत ऊपर धकेली जाती है' },
                    { en: 'Excess supply (a surplus) — price is pushed down', hi: 'अतिरेक पूर्ति (आधिक्य) — कीमत नीचे धकेली जाती है' },
                    { en: 'Equilibrium', hi: 'संतुलन' },
                    { en: 'A shift of both curves', hi: 'दोनों वक्रों का खिसकाव' }
                ],
                correctIndex: 0,
                explain: { en: 'Below equilibrium, Qd exceeds Qs. Buyers compete for scarce goods and bid the price up until Qd = Qs again.', hi: 'संतुलन से नीचे Qd, Qs से अधिक होती है। खरीदार दुर्लभ वस्तुओं के लिए प्रतिस्पर्धा करते हैं और कीमत तब तक बढ़ाते हैं जब तक Qd = Qs न हो।' },
                syllabusId: 'XI-B-U7-MARKET-EQ'
            },
            {
                level: 'understand',
                question: { en: 'Demand increases while supply stays unchanged. The new equilibrium has…', hi: 'माँग बढ़ती है जबकि पूर्ति अपरिवर्तित रहती है। नए संतुलन में होगा…' },
                options: [
                    { en: 'Higher price and higher quantity', hi: 'अधिक कीमत और अधिक मात्रा' },
                    { en: 'Lower price and higher quantity', hi: 'कम कीमत और अधिक मात्रा' },
                    { en: 'Higher price and lower quantity', hi: 'अधिक कीमत और कम मात्रा' },
                    { en: 'Lower price and lower quantity', hi: 'कम कीमत और कम मात्रा' }
                ],
                correctIndex: 0,
                explain: { en: 'DD shifts right along an unchanged SS, so the intersection slides up the supply curve: both P and Q rise.', hi: 'DD अपरिवर्तित SS के साथ दाईं ओर खिसकता है, इसलिए प्रतिच्छेदन पूर्ति वक्र पर ऊपर सरकता है: P और Q दोनों बढ़ते हैं।' },
                syllabusId: 'XI-B-U7-MARKET-EQ'
            },
            {
                level: 'analyse',
                question: { en: 'Supply increases while demand stays unchanged. The new equilibrium has…', hi: 'पूर्ति बढ़ती है जबकि माँग अपरिवर्तित रहती है। नए संतुलन में होगा…' },
                options: [
                    { en: 'Lower price and higher quantity', hi: 'कम कीमत और अधिक मात्रा' },
                    { en: 'Higher price and higher quantity', hi: 'अधिक कीमत और अधिक मात्रा' },
                    { en: 'Lower price and lower quantity', hi: 'कम कीमत और कम मात्रा' },
                    { en: 'Higher price and lower quantity', hi: 'अधिक कीमत और कम मात्रा' }
                ],
                correctIndex: 0,
                explain: { en: 'SS shifts right along an unchanged DD, so the intersection slides down the demand curve: P falls, Q rises.', hi: 'SS अपरिवर्तित DD के साथ दाईं ओर खिसकता है, इसलिए प्रतिच्छेदन माँग वक्र पर नीचे सरकता है: P घटती है, Q बढ़ती है।' },
                syllabusId: 'XI-B-U7-MARKET-EQ'
            },
            {
                level: 'evaluate',
                question: { en: 'Both demand and supply increase by a similar amount. What is the effect on equilibrium price?', hi: 'माँग और पूर्ति दोनों समान मात्रा में बढ़ती हैं। संतुलन कीमत पर क्या प्रभाव होगा?' },
                options: [
                    { en: 'Indeterminate — it depends on the relative size of the two shifts', hi: 'अनिश्चित — यह दोनों खिसकावों के सापेक्ष आकार पर निर्भर करता है' },
                    { en: 'It definitely rises', hi: 'यह निश्चित रूप से बढ़ती है' },
                    { en: 'It definitely falls', hi: 'यह निश्चित रूप से घटती है' },
                    { en: 'It definitely stays exactly the same', hi: 'यह निश्चित रूप से बिल्कुल वही रहती है' }
                ],
                correctIndex: 0,
                explain: { en: 'An increase in demand pushes price up; an increase in supply pushes it down. The two forces oppose, so quantity definitely rises but the price change is indeterminate — a complete exam answer.', hi: 'माँग वृद्धि कीमत ऊपर धकेलती है; पूर्ति वृद्धि नीचे। दोनों बल विरोधी हैं, इसलिए मात्रा निश्चित बढ़ती है पर कीमत परिवर्तन अनिश्चित है — यह पूरा परीक्षा उत्तर है।' },
                syllabusId: 'XI-B-U7-MARKET-EQ'
            },
            {
                level: 'apply',
                question: { en: 'A price CEILING set below equilibrium (like a maximum price on wheat) produces…', hi: 'संतुलन से नीचे तय की गई अधिकतम कीमत (जैसे गेहूँ पर) उत्पन्न करती है…' },
                options: [
                    { en: 'Persistent excess demand — a shortage requiring rationing', hi: 'लगातार अतिरेक माँग — कमी जिसके लिए राशनिंग चाहिए' },
                    { en: 'Persistent excess supply', hi: 'लगातार अतिरेक पूर्ति' },
                    { en: 'Equilibrium at a lower price', hi: 'कम कीमत पर संतुलन' },
                    { en: 'A rightward shift of supply', hi: 'पूर्ति का दाईं ओर खिसकाव' }
                ],
                correctIndex: 0,
                explain: { en: 'A ceiling below equilibrium legally stops the price from rising to clear the market, so the shortage persists — which is why ceilings are usually paired with ration cards or queues.', hi: 'संतुलन से नीचे की अधिकतम सीमा कीमत को बाज़ार साफ़ करने के लिए बढ़ने से क़ानूनन रोकती है, इसलिए कमी बनी रहती है — इसीलिए इसके साथ राशन कार्ड या कतारें होती हैं।' },
                syllabusId: 'XI-B-U7-APPLICATIONS'
            },
            {
                level: 'understand',
                question: { en: 'At equilibrium, which statement is true?', hi: 'संतुलन पर कौन सा कथन सत्य है?' },
                options: [
                    { en: 'Quantity demanded equals quantity supplied, so there is no tendency for price to change', hi: 'माँगी गई मात्रा = पूर्ति की गई मात्रा, इसलिए कीमत बदलने की प्रवृत्ति नहीं' },
                    { en: 'Everyone who wants the good gets it free', hi: 'जो भी वस्तु चाहता है उसे मुफ़्त मिलती है' },
                    { en: 'Supply exceeds demand', hi: 'पूर्ति माँग से अधिक है' },
                    { en: 'The demand curve is vertical', hi: 'माँग वक्र ऊर्ध्वाधर है' }
                ],
                correctIndex: 0,
                explain: { en: 'Equilibrium means the plans of buyers and sellers exactly match at that price, so nothing pushes the price either way.', hi: 'संतुलन का अर्थ है उस कीमत पर खरीदारों और विक्रेताओं की योजनाएँ बिल्कुल मेल खाती हैं, इसलिए कीमत किसी ओर नहीं धकेली जाती।' },
                syllabusId: 'XI-B-U7-MARKET-EQ'
            }
        ],
        applyTemplates: [
            {
                level: 'apply',
                build(state, m) {
                    if (typeof m.eqP !== 'number' || !isFinite(m.eqP)) return null;
                    return {
                        question: { en: `With a demand shift of ${state.dShift >= 0 ? '+' : ''}${Math.round(state.dShift)} and a supply shift of ${state.sShift >= 0 ? '+' : ''}${Math.round(state.sShift)}, what is the new equilibrium price?`, hi: `${state.dShift >= 0 ? '+' : ''}${Math.round(state.dShift)} माँग खिसकाव और ${state.sShift >= 0 ? '+' : ''}${Math.round(state.sShift)} पूर्ति खिसकाव पर नई संतुलन कीमत क्या है?` },
                        options: quizNumericOptions(m.eqP, [5, -4, 9], { round: 1, prefix: '₹' }),
                        correctIndex: 0,
                        explain: { en: `Equilibrium is where DD cuts SS: P = ₹${m.eqP.toFixed(1)}, Q = ${m.eqQ.toFixed(1)} units.`, hi: `संतुलन वहाँ है जहाँ DD, SS को काटता है: P = ₹${m.eqP.toFixed(1)}, Q = ${m.eqQ.toFixed(1)} इकाई।` },
                        syllabusId: 'XI-B-U7-MARKET-EQ'
                    };
                }
            },
            {
                level: 'analyse',
                build(state, m) {
                    if (typeof m.gap !== 'number' || Math.abs(m.gap) < 0.5) return null;
                    return {
                        question: { en: `At a market price of ₹${Math.round(state.mktPrice)}, how large is the ${m.gap > 0 ? 'excess demand' : 'excess supply'}?`, hi: `₹${Math.round(state.mktPrice)} की बाज़ार कीमत पर ${m.gap > 0 ? 'अतिरेक माँग' : 'अतिरेक पूर्ति'} कितनी है?` },
                        options: quizNumericOptions(Math.abs(m.gap), [4, -3, 8], { round: 1, suffix: ' units' }),
                        correctIndex: 0,
                        explain: { en: `The gap is |Qd − Qs| at that price = ${Math.abs(m.gap).toFixed(1)} units, which pushes the price ${m.gap > 0 ? 'up' : 'down'} toward equilibrium.`, hi: `उस कीमत पर अंतर |Qd − Qs| = ${Math.abs(m.gap).toFixed(1)} इकाई है, जो कीमत को संतुलन की ओर ${m.gap > 0 ? 'ऊपर' : 'नीचे'} धकेलता है।` },
                        syllabusId: 'XI-B-U7-MARKET-EQ'
                    };
                }
            }
        ]
    };

    QUIZ_BANK['gl-consumer-equilibrium-ic'] = {
        static: [
            {
                level: 'remember',
                question: { en: 'The condition for consumer equilibrium under the Indifference Curve approach is…', hi: 'तटस्थता वक्र दृष्टिकोण में उपभोक्ता संतुलन की शर्त है…' },
                options: [
                    { en: 'MRS = Px/Py, with MRS diminishing', hi: 'MRS = Px/Py, और MRS घटती हुई' },
                    { en: 'MU = Price for each good only', hi: 'केवल हर वस्तु के लिए MU = कीमत' },
                    { en: 'The budget line cuts the indifference curve twice', hi: 'बजट रेखा तटस्थता वक्र को दो बार काटे' },
                    { en: 'Total utility equals total expenditure', hi: 'कुल उपयोगिता = कुल व्यय' }
                ],
                correctIndex: 0,
                explain: { en: 'Equilibrium is the tangency point: the slope of the IC (MRS) equals the slope of the budget line (Px/Py), and the IC must be convex so MRS is falling.', hi: 'संतुलन स्पर्श बिंदु है: IC का ढाल (MRS) = बजट रेखा का ढाल (Px/Py), और IC उत्तल हो ताकि MRS घटती रहे।' },
                syllabusId: 'XI-B-U5-IC'
            },
            {
                level: 'understand',
                question: { en: 'A rise in the consumer\'s income, with prices unchanged, causes the budget line to…', hi: 'कीमतें अपरिवर्तित रहते हुए उपभोक्ता की आय बढ़ने पर बजट रेखा…' },
                options: [
                    { en: 'Shift outward, parallel to the original line', hi: 'मूल रेखा के समांतर बाहर की ओर खिसकती है' },
                    { en: 'Swivel outward on the Y-intercept only', hi: 'केवल Y-अंतःखंड पर बाहर घूमती है' },
                    { en: 'Become steeper', hi: 'अधिक तीव्र ढलान वाली हो जाती है' },
                    { en: 'Stay exactly where it is', hi: 'बिल्कुल वहीं रहती है' }
                ],
                correctIndex: 0,
                explain: { en: 'The slope is Px/Py, which depends only on prices. If prices do not change, the slope cannot change — so more income moves the line outward in parallel.', hi: 'ढाल Px/Py है, जो केवल कीमतों पर निर्भर है। कीमतें न बदलें तो ढाल नहीं बदल सकता — इसलिए अधिक आय रेखा को समांतर बाहर सरकाती है।' },
                syllabusId: 'XI-B-U5-IC'
            },
            {
                level: 'analyse',
                question: { en: 'Why can an indifference curve never be thick, and never intersect another IC?', hi: 'तटस्थता वक्र कभी मोटा क्यों नहीं हो सकता, और दूसरे IC को क्यों नहीं काट सकता?' },
                options: [
                    { en: 'Both would violate monotonicity/transitivity — a bundle with more of a good must give more satisfaction, and one bundle cannot be on two different satisfaction levels', hi: 'दोनों एकदिष्टता/संक्रामकता का उल्लंघन करेंगे — अधिक वस्तु वाला संयोजन अधिक संतुष्टि दे, और एक संयोजन दो अलग संतुष्टि स्तरों पर नहीं हो सकता' },
                    { en: 'Because the budget line is straight', hi: 'क्योंकि बजट रेखा सीधी होती है' },
                    { en: 'Because prices are always positive', hi: 'क्योंकि कीमतें हमेशा धनात्मक होती हैं' },
                    { en: 'ICs actually can intersect', hi: 'IC वास्तव में काट सकते हैं' }
                ],
                correctIndex: 0,
                explain: { en: 'A thick IC would put two bundles with different quantities on the same satisfaction level. Two intersecting ICs would put the crossing bundle on two levels at once — both are logically impossible.', hi: 'मोटा IC अलग मात्राओं वाले दो संयोजनों को एक ही संतुष्टि स्तर पर रखेगा। दो कटते IC प्रतिच्छेदन संयोजन को एक साथ दो स्तरों पर रखेंगे — दोनों तार्किक रूप से असंभव हैं।' },
                syllabusId: 'XI-B-U5-IC'
            },
            {
                level: 'evaluate',
                question: { en: 'Why must the indifference curve be CONVEX to the origin?', hi: 'तटस्थता वक्र मूल बिंदु की ओर उत्तल क्यों होना चाहिए?' },
                options: [
                    { en: 'Because MRS diminishes — as more X is consumed, less Y is given up for each further unit of X', hi: 'क्योंकि MRS घटती है — जैसे-जैसे अधिक X खपाई जाती है, हर अतिरिक्त X के लिए कम Y छोड़ी जाती है' },
                    { en: 'Because prices are constant', hi: 'क्योंकि कीमतें स्थिर हैं' },
                    { en: 'Because income is limited', hi: 'क्योंकि आय सीमित है' },
                    { en: 'Because both goods are free', hi: 'क्योंकि दोनों वस्तुएँ मुफ़्त हैं' }
                ],
                correctIndex: 0,
                explain: { en: 'Diminishing MRS is exactly what makes the curve bow inward. If MRS were constant the IC would be a straight line (perfect substitutes) and tangency would fail.', hi: 'घटती MRS ही वक्र को भीतर की ओर मोड़ती है। MRS स्थिर होती तो IC सीधी रेखा (पूर्ण स्थानापन्न) होती और स्पर्श विफल हो जाता।' },
                syllabusId: 'XI-B-U5-IC'
            },
            {
                level: 'apply',
                question: { en: 'The price of Good X falls while income and Py stay the same. The budget line…', hi: 'आय और Py समान रहते हुए वस्तु X की कीमत घटती है। बजट रेखा…' },
                options: [
                    { en: 'Swivels outward on the unchanged Y-intercept — the X-intercept moves right', hi: 'अपरिवर्तित Y-अंतःखंड पर बाहर घूमती है — X-अंतःखंड दाईं ओर सरकता है' },
                    { en: 'Shifts outward in parallel', hi: 'समांतर बाहर खिसकती है' },
                    { en: 'Shifts inward in parallel', hi: 'समांतर भीतर खिसकती है' },
                    { en: 'Does not move', hi: 'नहीं हिलती' }
                ],
                correctIndex: 0,
                explain: { en: 'The Y-intercept is M/Py, which is untouched by a change in Px. The X-intercept M/Px rises — so the line pivots rather than shifting.', hi: 'Y-अंतःखंड M/Py है, जिसे Px का परिवर्तन नहीं छूता। X-अंतःखंड M/Px बढ़ता है — इसलिए रेखा खिसकने के बजाय घूमती है।' },
                syllabusId: 'XI-B-U5-IC'
            },
            {
                level: 'remember',
                question: { en: 'The equation of the budget line is…', hi: 'बजट रेखा का समीकरण है…' },
                options: [
                    { en: 'Px·X + Py·Y = M', hi: 'Px·X + Py·Y = M' },
                    { en: 'X + Y = M', hi: 'X + Y = M' },
                    { en: 'Px·Py = M', hi: 'Px·Py = M' },
                    { en: 'M = X/Y', hi: 'M = X/Y' }
                ],
                correctIndex: 0,
                explain: { en: 'Total spending on both goods exactly exhausts income M. Rearranged, Y = M/Py − (Px/Py)·X, so the slope is Px/Py.', hi: 'दोनों वस्तुओं पर कुल व्यय आय M को पूरी तरह ख़र्च करता है। पुनर्व्यवस्थित करने पर Y = M/Py − (Px/Py)·X, इसलिए ढाल Px/Py है।' },
                syllabusId: 'XI-B-U5-IC'
            }
        ],
        applyTemplates: [
            {
                level: 'apply',
                build(state, m) {
                    if (typeof m.ratio !== 'number' || !isFinite(m.ratio)) return null;
                    return {
                        question: { en: `With Px = ₹${state.Px} and Py = ₹${state.Py}, what is the MRS at consumer equilibrium?`, hi: `Px = ₹${state.Px} और Py = ₹${state.Py} पर उपभोक्ता संतुलन पर MRS क्या है?` },
                        options: quizNumericOptions(m.ratio, [0.6, -0.4, 1.1], { round: 2 }),
                        correctIndex: 0,
                        explain: { en: `At equilibrium MRS = Px/Py = ${state.Px}/${state.Py} = ${m.ratio.toFixed(2)}.`, hi: `संतुलन पर MRS = Px/Py = ${state.Px}/${state.Py} = ${m.ratio.toFixed(2)}।` },
                        syllabusId: 'XI-B-U5-IC'
                    };
                }
            }
        ]
    };

    QUIZ_BANK['gl-cost-curves'] = {
        static: [
            {
                level: 'remember',
                question: { en: 'The MC curve cuts the AC and AVC curves…', hi: 'MC वक्र AC और AVC वक्रों को काटता है…' },
                options: [
                    { en: 'At their minimum points, from below', hi: 'उनके न्यूनतम बिंदुओं पर, नीचे से' },
                    { en: 'At their maximum points', hi: 'उनके अधिकतम बिंदुओं पर' },
                    { en: 'Never — MC lies entirely above them', hi: 'कभी नहीं — MC पूरी तरह उनके ऊपर रहता है' },
                    { en: 'At the origin', hi: 'मूल बिंदु पर' }
                ],
                correctIndex: 0,
                explain: { en: 'While MC < AC the average is pulled down; while MC > AC it is pulled up. They can only be equal exactly where AC stops falling and starts rising — its minimum.', hi: 'जब तक MC < AC, औसत नीचे खिंचता है; जब MC > AC, ऊपर। वे केवल वहीं बराबर हो सकते हैं जहाँ AC गिरना बंद कर बढ़ना शुरू करे — उसका न्यूनतम।' },
                syllabusId: 'XI-B-U6-COST'
            },
            {
                level: 'understand',
                question: { en: 'AFC (Average Fixed Cost) as output rises…', hi: 'उत्पादन बढ़ने पर AFC (औसत स्थिर लागत)…' },
                options: [
                    { en: 'Falls continuously and never touches the X-axis', hi: 'लगातार घटती है और कभी X-अक्ष को नहीं छूती' },
                    { en: 'Is U-shaped', hi: 'U-आकार की होती है' },
                    { en: 'Stays constant', hi: 'स्थिर रहती है' },
                    { en: 'Rises continuously', hi: 'लगातार बढ़ती है' }
                ],
                correctIndex: 0,
                explain: { en: 'AFC = TFC/Q. As Q rises the same fixed cost is spread over more units, so AFC keeps falling — a rectangular hyperbola that approaches, but never reaches, zero.', hi: 'AFC = TFC/Q। Q बढ़ने पर वही स्थिर लागत अधिक इकाइयों पर बँटती है, इसलिए AFC घटती जाती है — एक आयताकार अतिपरवलय जो शून्य के पास जाती है पर पहुँचती नहीं।' },
                syllabusId: 'XI-B-U6-COST'
            },
            {
                level: 'analyse',
                question: { en: 'Why do AC and AVC get closer together as output rises, without ever meeting?', hi: 'उत्पादन बढ़ने पर AC और AVC पास क्यों आते हैं, पर कभी मिलते क्यों नहीं?' },
                options: [
                    { en: 'The vertical gap between them IS AFC, which shrinks toward zero but never equals zero', hi: 'उनके बीच का ऊर्ध्वाधर अंतर ही AFC है, जो शून्य की ओर घटता है पर कभी शून्य नहीं होता' },
                    { en: 'Because MC rises', hi: 'क्योंकि MC बढ़ता है' },
                    { en: 'Because TFC rises with output', hi: 'क्योंकि TFC उत्पादन के साथ बढ़ती है' },
                    { en: 'They do meet, at maximum output', hi: 'वे अधिकतम उत्पादन पर मिलते हैं' }
                ],
                correctIndex: 0,
                explain: { en: 'AC = AVC + AFC, so AC − AVC = AFC = TFC/Q. Since TFC > 0, this gap is always positive however large Q gets.', hi: 'AC = AVC + AFC, इसलिए AC − AVC = AFC = TFC/Q। चूँकि TFC > 0, Q कितना भी बड़ा हो यह अंतर हमेशा धनात्मक रहता है।' },
                syllabusId: 'XI-B-U6-COST'
            },
            {
                level: 'evaluate',
                question: { en: 'Total Fixed Cost rises. Which curves are affected?', hi: 'कुल स्थिर लागत बढ़ती है। कौन से वक्र प्रभावित होते हैं?' },
                options: [
                    { en: 'AFC and AC shift up; AVC and MC are completely unaffected', hi: 'AFC और AC ऊपर खिसकते हैं; AVC और MC बिल्कुल अप्रभावित' },
                    { en: 'All four curves shift up equally', hi: 'चारों वक्र समान रूप से ऊपर खिसकते हैं' },
                    { en: 'Only MC shifts up', hi: 'केवल MC ऊपर खिसकता है' },
                    { en: 'Only AVC shifts up', hi: 'केवल AVC ऊपर खिसकता है' }
                ],
                correctIndex: 0,
                explain: { en: 'Fixed cost does not vary with output, so it cannot appear in MC (= ΔTVC/ΔQ) or AVC. It only lifts AFC, and therefore AC.', hi: 'स्थिर लागत उत्पादन के साथ नहीं बदलती, इसलिए यह MC (= ΔTVC/ΔQ) या AVC में नहीं आ सकती। यह केवल AFC को, और इसलिए AC को उठाती है।' },
                syllabusId: 'XI-B-U6-COST'
            },
            {
                level: 'understand',
                question: { en: 'AVC reaches its minimum at a LOWER output than AC because…', hi: 'AVC अपना न्यूनतम AC से कम उत्पादन पर पाती है क्योंकि…' },
                options: [
                    { en: 'Past AVC\'s minimum, falling AFC keeps dragging AC down until the rise in AVC finally outweighs it', hi: 'AVC के न्यूनतम के बाद, घटती AFC AC को नीचे खींचती रहती है जब तक AVC की वृद्धि उस पर भारी न पड़े' },
                    { en: 'AFC rises with output', hi: 'AFC उत्पादन के साथ बढ़ती है' },
                    { en: 'MC never cuts AVC', hi: 'MC कभी AVC को नहीं काटता' },
                    { en: 'AC is always below AVC', hi: 'AC हमेशा AVC से नीचे होती है' }
                ],
                correctIndex: 0,
                explain: { en: 'AC = AVC + AFC. Just after AVC bottoms out, AVC is rising slowly while AFC is still falling fast enough to keep the sum falling.', hi: 'AC = AVC + AFC। AVC के न्यूनतम के तुरंत बाद, AVC धीरे बढ़ती है जबकि AFC इतनी तेज़ी से घटती है कि योग गिरता रहता है।' },
                syllabusId: 'XI-B-U6-COST'
            },
            {
                level: 'remember',
                question: { en: 'Marginal Cost is defined as…', hi: 'सीमांत लागत की परिभाषा है…' },
                options: [
                    { en: 'ΔTC/ΔQ — and equally ΔTVC/ΔQ, since TFC does not change', hi: 'ΔTC/ΔQ — और समान रूप से ΔTVC/ΔQ, क्योंकि TFC नहीं बदलती' },
                    { en: 'TC/Q', hi: 'TC/Q' },
                    { en: 'TFC/Q', hi: 'TFC/Q' },
                    { en: 'TC − TVC', hi: 'TC − TVC' }
                ],
                correctIndex: 0,
                explain: { en: 'MC is the addition to total cost from one more unit. Since TFC is constant, all of that addition comes from TVC — so both formulas give the same number.', hi: 'MC एक अतिरिक्त इकाई से कुल लागत में वृद्धि है। TFC स्थिर होने से यह पूरी वृद्धि TVC से आती है — इसलिए दोनों सूत्र एक ही संख्या देते हैं।' },
                syllabusId: 'XI-B-U6-COST'
            }
        ],
        applyTemplates: [
            {
                level: 'apply',
                build(state, m) {
                    if (typeof m.ac !== 'number' || !isFinite(m.ac)) return null;
                    return {
                        question: { en: `At output ${state.q} units with TFC = ₹${state.tfc}, what is the Average Cost?`, hi: `TFC = ₹${state.tfc} पर ${state.q} इकाई उत्पादन पर औसत लागत क्या है?` },
                        options: quizNumericOptions(m.ac, [2.5, -2, 5], { round: 2, prefix: '₹' }),
                        correctIndex: 0,
                        explain: { en: `AC = AVC + AFC = ₹${m.avc.toFixed(2)} + ₹${(m.ac - m.avc).toFixed(2)} = ₹${m.ac.toFixed(2)}.`, hi: `AC = AVC + AFC = ₹${m.avc.toFixed(2)} + ₹${(m.ac - m.avc).toFixed(2)} = ₹${m.ac.toFixed(2)}।` },
                        syllabusId: 'XI-B-U6-COST'
                    };
                }
            }
        ]
    };

    QUIZ_BANK['gl-revenue-producer-eq'] = {
        static: [
            {
                level: 'remember',
                question: { en: 'Under perfect competition, the relationship between AR and MR is…', hi: 'पूर्ण प्रतियोगिता में AR और MR का संबंध है…' },
                options: [
                    { en: 'AR = MR = price, both shown as one horizontal line', hi: 'AR = MR = कीमत, दोनों एक क्षैतिज रेखा' },
                    { en: 'MR is always double AR', hi: 'MR हमेशा AR का दुगुना' },
                    { en: 'MR lies below AR and falls twice as fast', hi: 'MR, AR से नीचे और दुगुनी तेज़ी से गिरता है' },
                    { en: 'AR is zero', hi: 'AR शून्य है' }
                ],
                correctIndex: 0,
                explain: { en: 'A price-taker sells every extra unit at the same unchanged price, so the revenue from one more unit IS the price — MR equals AR equals P.', hi: 'कीमत-स्वीकारक हर अतिरिक्त इकाई उसी अपरिवर्तित कीमत पर बेचता है, इसलिए एक अतिरिक्त इकाई से आय ही कीमत है — MR = AR = P।' },
                syllabusId: 'XI-B-U6-REVENUE'
            },
            {
                level: 'understand',
                question: { en: 'Under monopoly, why does MR lie BELOW AR?', hi: 'एकाधिकार में MR, AR से नीचे क्यों होता है?' },
                options: [
                    { en: 'To sell one more unit the firm must cut price on ALL units, so the gain is partly offset by the loss on earlier units', hi: 'एक अतिरिक्त इकाई बेचने के लिए फ़र्म को सभी इकाइयों पर कीमत घटानी पड़ती है, इसलिए लाभ पहले की इकाइयों पर हानि से आंशिक रूप से कट जाता है' },
                    { en: 'Because the monopolist has no costs', hi: 'क्योंकि एकाधिकारी की कोई लागत नहीं' },
                    { en: 'Because AR is always zero', hi: 'क्योंकि AR हमेशा शून्य है' },
                    { en: 'Because MR must equal MC', hi: 'क्योंकि MR को MC के बराबर होना चाहिए' }
                ],
                correctIndex: 0,
                explain: { en: 'The extra unit earns the new (lower) price, but every unit that could have been sold at the old price now earns less. Net addition to revenue is therefore less than the price.', hi: 'अतिरिक्त इकाई नई (कम) कीमत कमाती है, पर जो इकाइयाँ पुरानी कीमत पर बिक सकती थीं वे अब कम कमाती हैं। इसलिए आय में शुद्ध वृद्धि कीमत से कम है।' },
                syllabusId: 'XI-B-U6-REVENUE'
            },
            {
                level: 'analyse',
                question: { en: 'The two conditions for producer\'s equilibrium are…', hi: 'उत्पादक संतुलन की दो शर्तें हैं…' },
                options: [
                    { en: 'MR = MC, and MC must be rising (cutting MR from below)', hi: 'MR = MC, और MC बढ़ता हुआ हो (MR को नीचे से काटता)' },
                    { en: 'MR = MC alone is sufficient', hi: 'केवल MR = MC पर्याप्त है' },
                    { en: 'AR = AC, and AC must be falling', hi: 'AR = AC, और AC घटती हुई हो' },
                    { en: 'TR must be at its maximum', hi: 'TR अधिकतम पर हो' }
                ],
                correctIndex: 0,
                explain: { en: 'MR = MC can also occur on the FALLING branch of MC, where producing more still adds to profit. Only where MC is rising is profit actually maximised.', hi: 'MR = MC, MC की गिरती शाखा पर भी हो सकता है, जहाँ और उत्पादन अब भी लाभ बढ़ाता है। लाभ वास्तव में तभी अधिकतम है जब MC बढ़ता हो।' },
                syllabusId: 'XI-B-U6-PRODUCER-EQ'
            },
            {
                level: 'evaluate',
                question: { en: 'If MR > MC at the current output, the firm should…', hi: 'यदि वर्तमान उत्पादन पर MR > MC है, तो फ़र्म को चाहिए…' },
                options: [
                    { en: 'Expand output — each extra unit adds more to revenue than to cost', hi: 'उत्पादन बढ़ाना — हर अतिरिक्त इकाई लागत से अधिक आय जोड़ती है' },
                    { en: 'Cut output', hi: 'उत्पादन घटाना' },
                    { en: 'Shut down immediately', hi: 'तुरंत बंद कर देना' },
                    { en: 'Keep output exactly where it is', hi: 'उत्पादन वहीं रखना' }
                ],
                correctIndex: 0,
                explain: { en: 'Every unit where MR exceeds MC adds positively to profit, so the firm keeps expanding until the two are equal.', hi: 'हर वह इकाई जहाँ MR, MC से अधिक है लाभ में धनात्मक जोड़ती है, इसलिए फ़र्म तब तक बढ़ाती है जब तक दोनों बराबर न हो जाएँ।' },
                syllabusId: 'XI-B-U6-PRODUCER-EQ'
            },
            {
                level: 'understand',
                question: { en: 'Total Revenue is at its MAXIMUM where…', hi: 'कुल आय अधिकतम वहाँ होती है जहाँ…' },
                options: [
                    { en: 'MR = 0', hi: 'MR = 0' },
                    { en: 'MR = MC', hi: 'MR = MC' },
                    { en: 'AR = 0', hi: 'AR = 0' },
                    { en: 'AC is minimum', hi: 'AC न्यूनतम है' }
                ],
                correctIndex: 0,
                explain: { en: 'TR rises while MR is positive and falls once MR turns negative, so TR peaks exactly where MR crosses zero. Note this is NOT where profit is maximised.', hi: 'MR धनात्मक रहते TR बढ़ती है और MR ऋणात्मक होते ही गिरती है, इसलिए TR ठीक वहाँ शिखर पर है जहाँ MR शून्य पार करता है। ध्यान दें यह वह बिंदु नहीं जहाँ लाभ अधिकतम हो।' },
                syllabusId: 'XI-B-U6-REVENUE'
            },
            {
                level: 'apply',
                question: { en: 'Under perfect competition, why is the AR curve horizontal?', hi: 'पूर्ण प्रतियोगिता में AR वक्र क्षैतिज क्यों होता है?' },
                options: [
                    { en: 'The firm is a price-taker — it can sell any quantity at the ruling market price without affecting it', hi: 'फ़र्म कीमत-स्वीकारक है — वह प्रचलित बाज़ार कीमत पर कोई भी मात्रा बेच सकती है बिना उसे प्रभावित किए' },
                    { en: 'Because it produces nothing', hi: 'क्योंकि वह कुछ उत्पादन नहीं करती' },
                    { en: 'Because it sets its own price', hi: 'क्योंकि वह अपनी कीमत खुद तय करती है' },
                    { en: 'Because its costs are constant', hi: 'क्योंकि उसकी लागतें स्थिर हैं' }
                ],
                correctIndex: 0,
                explain: { en: 'The individual firm is a tiny part of a large market with a homogeneous product, so its own output decision cannot move the market price.', hi: 'व्यक्तिगत फ़र्म समरूप उत्पाद वाले बड़े बाज़ार का छोटा हिस्सा है, इसलिए उसका अपना उत्पादन निर्णय बाज़ार कीमत को नहीं हिला सकता।' },
                syllabusId: 'XI-B-U7-PERFECT-COMP'
            }
        ],
        applyTemplates: [
            {
                level: 'apply',
                build(state, m) {
                    if (typeof m.profit !== 'number' || !isFinite(m.profit)) return null;
                    return {
                        question: { en: `At output ${state.q} units with an AR intercept of ₹${state.price}, what is the firm's profit?`, hi: `₹${state.price} के AR अंतःखंड पर ${state.q} इकाई उत्पादन पर फ़र्म का लाभ क्या है?` },
                        options: quizNumericOptions(m.profit, [18, -14, 30], { round: 1, prefix: '₹' }),
                        correctIndex: 0,
                        explain: { en: `Profit = (AR − AC) × Q = ₹${m.profit.toFixed(1)}.`, hi: `लाभ = (AR − AC) × Q = ₹${m.profit.toFixed(1)}।` },
                        syllabusId: 'XI-B-U6-PRODUCER-EQ'
                    };
                }
            }
        ]
    };

    QUIZ_BANK['gl-ppc-drag'] = {
        static: [
            {
                level: 'remember',
                question: { en: 'A point lying OUTSIDE the Production Possibility Curve is…', hi: 'उत्पादन संभावना वक्र के बाहर स्थित बिंदु है…' },
                options: [
                    { en: 'Unattainable with the economy\'s current resources and technology', hi: 'अर्थव्यवस्था के वर्तमान संसाधनों और तकनीक से अप्राप्य' },
                    { en: 'Efficient and fully employed', hi: 'कुशल और पूर्ण रोज़गार वाला' },
                    { en: 'Inefficient', hi: 'अकुशल' },
                    { en: 'The equilibrium point', hi: 'संतुलन बिंदु' }
                ],
                correctIndex: 0,
                explain: { en: 'The PPC marks the limit of what can be produced. Reaching beyond it needs growth — more resources or better technology — which shifts the whole curve outward.', hi: 'PPC यह सीमा दिखाता है कि क्या उत्पादित हो सकता है। इससे आगे पहुँचने के लिए वृद्धि चाहिए — अधिक संसाधन या बेहतर तकनीक — जो पूरे वक्र को बाहर खिसकाती है।' },
                syllabusId: 'XI-B-U4-PPF-OC'
            },
            {
                level: 'understand',
                question: { en: 'At a point INSIDE the PPC, the opportunity cost of producing one more unit of Good X is…', hi: 'PPC के अंदर एक बिंदु पर वस्तु X की एक अतिरिक्त इकाई की अवसर लागत है…' },
                options: [
                    { en: 'Zero — idle resources can be employed without sacrificing any Y', hi: 'शून्य — बेकार पड़े संसाधन बिना कोई Y छोड़े लगाए जा सकते हैं' },
                    { en: 'Equal to the MRT on the curve', hi: 'वक्र पर MRT के बराबर' },
                    { en: 'Infinite', hi: 'अनंत' },
                    { en: 'Always exactly one unit of Y', hi: 'हमेशा ठीक एक इकाई Y' }
                ],
                correctIndex: 0,
                explain: { en: 'Opportunity cost only bites when resources are fully employed. Inside the curve there is slack, so more X can be produced with no reduction in Y.', hi: 'अवसर लागत तभी लगती है जब संसाधन पूर्ण रूप से लगे हों। वक्र के अंदर ढील है, इसलिए Y घटाए बिना अधिक X उत्पादित हो सकती है।' },
                syllabusId: 'XI-B-U4-PPF-OC'
            },
            {
                level: 'analyse',
                question: { en: 'The PPC is concave to the origin because…', hi: 'PPC मूल बिंदु की ओर अवतल है क्योंकि…' },
                options: [
                    { en: 'MRT rises — resources are not equally efficient in both goods, so each extra X costs progressively more Y', hi: 'MRT बढ़ती है — संसाधन दोनों वस्तुओं में समान रूप से कुशल नहीं, इसलिए हर अतिरिक्त X क्रमशः अधिक Y माँगती है' },
                    { en: 'MRT falls as more X is produced', hi: 'अधिक X उत्पादित होने पर MRT घटती है' },
                    { en: 'MRT is constant', hi: 'MRT स्थिर है' },
                    { en: 'Resources are unlimited', hi: 'संसाधन असीमित हैं' }
                ],
                correctIndex: 0,
                explain: { en: 'The first resources moved to X are the ones best suited to X. Each further unit must pull in resources better suited to Y, so the sacrifice grows — a rising MRT bends the curve outward.', hi: 'X की ओर सबसे पहले वे संसाधन जाते हैं जो X के लिए सर्वोत्तम हैं। हर अगली इकाई को Y के लिए अधिक उपयुक्त संसाधन खींचने पड़ते हैं, इसलिए त्याग बढ़ता है — बढ़ती MRT वक्र को बाहर मोड़ती है।' },
                syllabusId: 'XI-B-U4-PPF-OC'
            },
            {
                level: 'evaluate',
                question: { en: 'Which distinguishes a MOVEMENT along the PPC from a SHIFT of it?', hi: 'PPC पर संचलन को उसके खिसकाव से क्या अलग करता है?' },
                options: [
                    { en: 'Movement = reallocating existing resources between the two goods; shift = the economy\'s productive capacity itself changes', hi: 'संचलन = मौजूदा संसाधनों का दोनों वस्तुओं में पुनर्आबंटन; खिसकाव = अर्थव्यवस्था की उत्पादन क्षमता स्वयं बदलना' },
                    { en: 'There is no difference', hi: 'कोई अंतर नहीं' },
                    { en: 'A movement needs new technology', hi: 'संचलन के लिए नई तकनीक चाहिए' },
                    { en: 'A shift means unemployment', hi: 'खिसकाव का अर्थ बेरोज़गारी' }
                ],
                correctIndex: 0,
                explain: { en: 'Exactly the same logic as movement-vs-shift on a demand curve: along the curve, capacity is fixed and a sacrifice must be paid; a shift changes the capacity itself.', hi: 'माँग वक्र पर संचलन-बनाम-खिसकाव जैसा ही तर्क: वक्र पर क्षमता स्थिर है और त्याग देना पड़ता है; खिसकाव क्षमता को स्वयं बदलता है।' },
                syllabusId: 'XI-B-U4-PPF-OC'
            },
            {
                level: 'apply',
                question: { en: 'A country discovers large new oil reserves. On the PPC diagram this is shown as…', hi: 'एक देश बड़े नए तेल भंडार खोजता है। PPC आरेख पर यह दिखाया जाता है…' },
                options: [
                    { en: 'An outward shift of the whole PPC', hi: 'पूरे PPC का बाहर की ओर खिसकाव' },
                    { en: 'A movement along the existing PPC', hi: 'मौजूदा PPC पर संचलन' },
                    { en: 'A point moving inside the PPC', hi: 'बिंदु का PPC के अंदर जाना' },
                    { en: 'The PPC becoming a straight line', hi: 'PPC का सीधी रेखा बन जाना' }
                ],
                correctIndex: 0,
                explain: { en: 'More resources raises the maximum producible amount of both goods — that is economic growth, and it relocates the whole curve outward.', hi: 'अधिक संसाधन दोनों वस्तुओं की अधिकतम उत्पादनीय मात्रा बढ़ाते हैं — यही आर्थिक वृद्धि है, और यह पूरे वक्र को बाहर स्थानांतरित करती है।' },
                syllabusId: 'XI-B-U4-PPF-OC'
            },
            {
                level: 'remember',
                question: { en: 'The three central problems of an economy arise because…', hi: 'अर्थव्यवस्था की तीन केंद्रीय समस्याएँ उत्पन्न होती हैं क्योंकि…' },
                options: [
                    { en: 'Resources are scarce relative to unlimited wants and have alternative uses', hi: 'संसाधन असीमित इच्छाओं की तुलना में दुर्लभ हैं और उनके वैकल्पिक उपयोग हैं' },
                    { en: 'Governments cannot make decisions', hi: 'सरकारें निर्णय नहीं ले सकतीं' },
                    { en: 'Prices are always rising', hi: 'कीमतें हमेशा बढ़ती रहती हैं' },
                    { en: 'Money is limited', hi: 'पैसा सीमित है' }
                ],
                correctIndex: 0,
                explain: { en: 'Scarcity plus alternative uses forces a choice — what to produce, how to produce, and for whom. That choice is exactly what the PPC pictures.', hi: 'दुर्लभता और वैकल्पिक उपयोग मिलकर चुनाव पर मजबूर करते हैं — क्या, कैसे, और किसके लिए उत्पादन करें। यही चुनाव PPC दर्शाता है।' },
                syllabusId: 'XI-B-U4-CENTRAL-PROBLEMS'
            }
        ],
        applyTemplates: [
            {
                level: 'apply',
                build(state, m) {
                    if (typeof m.mrt !== 'number' || !isFinite(m.mrt) || m.mrt <= 0) return null;
                    return {
                        question: { en: `At X = ${state.px} on this PPC, what is the MRT (units of Y sacrificed per extra unit of X)?`, hi: `इस PPC पर X = ${state.px} पर MRT क्या है (हर अतिरिक्त X इकाई के लिए त्यागी गई Y इकाइयाँ)?` },
                        options: quizNumericOptions(m.mrt, [0.45, -0.3, 0.9], { round: 2 }),
                        correctIndex: 0,
                        explain: { en: `MRT = ${m.mrt.toFixed(2)} at that point — and it RISES as X rises, which is why the PPC is concave.`, hi: `उस बिंदु पर MRT = ${m.mrt.toFixed(2)} — और X बढ़ने पर यह बढ़ती है, इसीलिए PPC अवतल है।` },
                        syllabusId: 'XI-B-U4-PPF-OC'
                    };
                }
            }
        ]
    };

    QUIZ_BANK['gl-ad-as-equilibrium'] = {
        static: [
            {
                level: 'remember',
                question: { en: 'On the AD–AS diagram, equilibrium income is determined where…', hi: 'AD–AS आरेख पर संतुलन आय वहाँ निर्धारित होती है जहाँ…' },
                options: [
                    { en: 'The AD line cuts the 45° line, i.e. AD = AS', hi: 'AD रेखा 45° रेखा को काटे, यानी AD = AS' },
                    { en: 'AD is at its maximum', hi: 'AD अधिकतम हो' },
                    { en: 'AD touches the Y-axis', hi: 'AD, Y-अक्ष को छुए' },
                    { en: 'Saving equals consumption', hi: 'बचत = उपभोग' }
                ],
                correctIndex: 0,
                explain: { en: 'Every point on the 45° line has aggregate demand exactly equal to output, so the intersection is the only income level where planned spending matches what is produced.', hi: '45° रेखा के हर बिंदु पर समग्र माँग उत्पादन के ठीक बराबर है, इसलिए प्रतिच्छेदन ही वह एकमात्र आय स्तर है जहाँ नियोजित व्यय उत्पादन से मेल खाता है।' },
                syllabusId: 'XII-A-U3-EQUILIBRIUM'
            },
            {
                level: 'understand',
                question: { en: 'A deflationary gap is measured on the diagram as…', hi: 'आरेख पर अपस्फीतिक अंतराल मापा जाता है…' },
                options: [
                    { en: 'The VERTICAL shortfall of AD below the 45° line, measured AT full-employment income Y_F', hi: 'पूर्ण रोज़गार आय Y_F पर 45° रेखा से नीचे AD की ऊर्ध्वाधर कमी' },
                    { en: 'The horizontal distance between Y* and Y_F', hi: 'Y* और Y_F के बीच की क्षैतिज दूरी' },
                    { en: 'The area under the AD line', hi: 'AD रेखा के नीचे का क्षेत्रफल' },
                    { en: 'The slope of the AD line', hi: 'AD रेखा का ढाल' }
                ],
                correctIndex: 0,
                explain: { en: 'The gap is a shortfall of DEMAND, not of income, so it is measured vertically at Y_F. Measuring it horizontally is the most common diagram error in this chapter.', hi: 'अंतराल माँग की कमी है, आय की नहीं, इसलिए इसे Y_F पर ऊर्ध्वाधर मापा जाता है। क्षैतिज मापना इस अध्याय की सबसे आम आरेख-त्रुटि है।' },
                syllabusId: 'XII-A-U3-GAPS'
            },
            {
                level: 'analyse',
                question: { en: 'With excess demand at full employment, what happens to output and prices?', hi: 'पूर्ण रोज़गार पर अतिरेक माँग होने पर उत्पादन और कीमतों का क्या होता है?' },
                options: [
                    { en: 'Output cannot rise (no idle resources), so prices rise — inflation', hi: 'उत्पादन नहीं बढ़ सकता (कोई बेकार संसाधन नहीं), इसलिए कीमतें बढ़ती हैं — मुद्रास्फीति' },
                    { en: 'Both output and prices rise', hi: 'उत्पादन और कीमतें दोनों बढ़ते हैं' },
                    { en: 'Output rises, prices fall', hi: 'उत्पादन बढ़ता है, कीमतें गिरती हैं' },
                    { en: 'Nothing changes', hi: 'कुछ नहीं बदलता' }
                ],
                correctIndex: 0,
                explain: { en: 'At full employment every resource is already in use, so extra demand cannot call forth extra output — it only bids up the prices of the existing output.', hi: 'पूर्ण रोज़गार पर हर संसाधन पहले से लगा है, इसलिए अतिरिक्त माँग अतिरिक्त उत्पादन नहीं बुला सकती — यह केवल मौजूदा उत्पादन की कीमतें बढ़ाती है।' },
                syllabusId: 'XII-A-U3-GAPS'
            },
            {
                level: 'apply',
                question: { en: 'MPC = 0.8 and the deflationary gap is ₹50 crore. By how much must income rise to reach full employment?', hi: 'MPC = 0.8 और अपस्फीतिक अंतराल ₹50 करोड़ है। पूर्ण रोज़गार तक पहुँचने के लिए आय कितनी बढ़नी चाहिए?' },
                options: [
                    { en: '₹250 crore — the gap of ₹50 cr multiplied by k = 1/(1−0.8) = 5', hi: '₹250 करोड़ — ₹50 करोड़ का अंतराल × k = 1/(1−0.8) = 5' },
                    { en: '₹50 crore', hi: '₹50 करोड़' },
                    { en: '₹40 crore', hi: '₹40 करोड़' },
                    { en: '₹100 crore', hi: '₹100 करोड़' }
                ],
                correctIndex: 0,
                explain: { en: 'The gap is the required rise in AUTONOMOUS expenditure. The resulting rise in INCOME is that gap times the multiplier: 50 × 5 = ₹250 crore.', hi: 'अंतराल स्वायत्त व्यय में आवश्यक वृद्धि है। आय में परिणामी वृद्धि = अंतराल × गुणक: 50 × 5 = ₹250 करोड़।' },
                syllabusId: 'XII-A-U3-MULTIPLIER'
            },
            {
                level: 'evaluate',
                question: { en: 'Which policy set is appropriate for correcting DEFICIENT demand?', hi: 'न्यून माँग को ठीक करने के लिए कौन सा नीति-समूह उपयुक्त है?' },
                options: [
                    { en: 'Expansionary — raise government spending, cut taxes, cut repo/CRR/SLR', hi: 'विस्तारकारी — सरकारी व्यय बढ़ाएँ, कर घटाएँ, रेपो/CRR/SLR घटाएँ' },
                    { en: 'Contractionary — cut government spending, raise taxes, raise repo', hi: 'संकुचनकारी — सरकारी व्यय घटाएँ, कर बढ़ाएँ, रेपो बढ़ाएँ' },
                    { en: 'No policy is needed', hi: 'किसी नीति की ज़रूरत नहीं' },
                    { en: 'Reduce the money supply sharply', hi: 'मुद्रा आपूर्ति तेज़ी से घटाएँ' }
                ],
                correctIndex: 0,
                explain: { en: 'Deficient demand leaves resources idle, so the aim is to LIFT the AD line. Both fiscal (more G, lower T) and monetary (cheaper credit) tools push AD upward.', hi: 'न्यून माँग संसाधनों को बेकार छोड़ती है, इसलिए लक्ष्य AD रेखा को ऊपर उठाना है। राजकोषीय (अधिक G, कम T) और मौद्रिक (सस्ता ऋण) दोनों उपकरण AD ऊपर धकेलते हैं।' },
                syllabusId: 'XII-A-U3-GAPS'
            },
            {
                level: 'understand',
                question: { en: 'A HIGHER MPC makes the AD line…', hi: 'अधिक MPC से AD रेखा…' },
                options: [
                    { en: 'Steeper, and raises the multiplier', hi: 'अधिक तीव्र होती है, और गुणक बढ़ाती है' },
                    { en: 'Flatter, and lowers the multiplier', hi: 'चपटी होती है, और गुणक घटाती है' },
                    { en: 'Vertical', hi: 'ऊर्ध्वाधर' },
                    { en: 'Horizontal', hi: 'क्षैतिज' }
                ],
                correctIndex: 0,
                explain: { en: 'MPC is the slope of the AD line. A higher MPC means less leaks into saving at each round, so k = 1/(1−MPC) is larger.', hi: 'MPC ही AD रेखा का ढाल है। अधिक MPC का अर्थ हर चक्र में बचत में कम रिसाव, इसलिए k = 1/(1−MPC) बड़ा होता है।' },
                syllabusId: 'XII-A-U3-MULTIPLIER'
            }
        ],
        applyTemplates: [
            {
                level: 'apply',
                build(state, m) {
                    if (typeof m.yStar !== 'number' || !isFinite(m.yStar)) return null;
                    return {
                        question: { en: `With autonomous expenditure ₹${Math.round(state.auto)} cr and MPC = ${state.mpc.toFixed(2)}, what is equilibrium income?`, hi: `₹${Math.round(state.auto)} करोड़ स्वायत्त व्यय और MPC = ${state.mpc.toFixed(2)} पर संतुलन आय क्या है?` },
                        options: quizNumericOptions(m.yStar, [70, -55, 130], { round: 0, prefix: '₹', suffix: ' cr' }),
                        correctIndex: 0,
                        explain: { en: `Y* = autonomous / (1 − MPC) = ${Math.round(state.auto)} / ${(1 - state.mpc).toFixed(2)} = ₹${Math.round(m.yStar)} cr.`, hi: `Y* = स्वायत्त / (1 − MPC) = ${Math.round(state.auto)} / ${(1 - state.mpc).toFixed(2)} = ₹${Math.round(m.yStar)} करोड़।` },
                        syllabusId: 'XII-A-U3-EQUILIBRIUM'
                    };
                }
            },
            {
                level: 'apply',
                build(state, m) {
                    if (typeof m.k !== 'number' || !isFinite(m.k)) return null;
                    return {
                        question: { en: `If MPC = ${state.mpc.toFixed(2)}, what is the investment multiplier?`, hi: `यदि MPC = ${state.mpc.toFixed(2)} है, तो निवेश गुणक क्या है?` },
                        options: quizNumericOptions(m.k, [1.4, -0.9, 2.6], { round: 2 }),
                        correctIndex: 0,
                        explain: { en: `k = 1/(1 − MPC) = 1/MPS = 1/${(1 - state.mpc).toFixed(2)} = ${m.k.toFixed(2)}.`, hi: `k = 1/(1 − MPC) = 1/MPS = 1/${(1 - state.mpc).toFixed(2)} = ${m.k.toFixed(2)}।` },
                        syllabusId: 'XII-A-U3-MULTIPLIER'
                    };
                }
            }
        ]
    };

    QUIZ_BANK['gl-consumption-saving'] = {
        static: [
            {
                level: 'remember',
                question: { en: 'At the break-even point of the consumption function…', hi: 'उपभोग फलन के सम-विच्छेद बिंदु पर…' },
                options: [
                    { en: 'C = Y, so saving is zero and APC = 1', hi: 'C = Y, इसलिए बचत शून्य और APC = 1' },
                    { en: 'Saving is at its maximum', hi: 'बचत अधिकतम है' },
                    { en: 'Consumption is zero', hi: 'उपभोग शून्य है' },
                    { en: 'MPC = 1', hi: 'MPC = 1' }
                ],
                correctIndex: 0,
                explain: { en: 'Break-even is where the C line cuts the 45° line. There the whole income is consumed, so S = Y − C = 0 and APC = C/Y = 1.', hi: 'सम-विच्छेद वहाँ है जहाँ C रेखा 45° रेखा को काटती है। वहाँ पूरी आय खपती है, इसलिए S = Y − C = 0 और APC = C/Y = 1।' },
                syllabusId: 'XII-A-U3-PROPENSITY'
            },
            {
                level: 'understand',
                question: { en: 'Which is TRUE about APC and MPC?', hi: 'APC और MPC के बारे में क्या सत्य है?' },
                options: [
                    { en: 'APC can exceed 1 (below break-even, through dissaving), but MPC cannot', hi: 'APC 1 से अधिक हो सकती है (सम-विच्छेद से नीचे, ऋण-बचत से), पर MPC नहीं' },
                    { en: 'Both can exceed 1', hi: 'दोनों 1 से अधिक हो सकती हैं' },
                    { en: 'Neither can exceed 1', hi: 'दोनों 1 से अधिक नहीं हो सकतीं' },
                    { en: 'MPC can exceed 1 but APC cannot', hi: 'MPC 1 से अधिक हो सकती है पर APC नहीं' }
                ],
                correctIndex: 0,
                explain: { en: 'At low income, consumption exceeds income by drawing on past savings, so C/Y > 1. But no household can spend more than 100% of an ADDITIONAL rupee, so MPC ≤ 1.', hi: 'कम आय पर उपभोग पुरानी बचत से आय से अधिक हो जाता है, इसलिए C/Y > 1। पर कोई परिवार एक अतिरिक्त रुपये का 100% से अधिक ख़र्च नहीं कर सकता, इसलिए MPC ≤ 1।' },
                syllabusId: 'XII-A-U3-PROPENSITY'
            },
            {
                level: 'analyse',
                question: { en: 'Below the break-even income, the saving curve lies…', hi: 'सम-विच्छेद आय से नीचे, बचत वक्र स्थित होता है…' },
                options: [
                    { en: 'Below the X-axis — saving is negative (dissaving)', hi: 'X-अक्ष से नीचे — बचत ऋणात्मक है (ऋण-बचत)' },
                    { en: 'Above the 45° line', hi: '45° रेखा से ऊपर' },
                    { en: 'Exactly on the X-axis', hi: 'ठीक X-अक्ष पर' },
                    { en: 'Vertical', hi: 'ऊर्ध्वाधर' }
                ],
                correctIndex: 0,
                explain: { en: 'S = Y − C. When C exceeds Y, S is negative — the household is running down past savings or borrowing, so the saving line dips below the axis.', hi: 'S = Y − C। जब C, Y से अधिक हो तो S ऋणात्मक है — परिवार पुरानी बचत ख़र्च कर रहा है या उधार ले रहा है, इसलिए बचत रेखा अक्ष से नीचे जाती है।' },
                syllabusId: 'XII-A-U3-PROPENSITY'
            },
            {
                level: 'evaluate',
                question: { en: 'Why do APC + APS always equal exactly 1?', hi: 'APC + APS हमेशा ठीक 1 क्यों होता है?' },
                options: [
                    { en: 'Because income is either consumed or saved: C + S = Y, so dividing through by Y gives C/Y + S/Y = 1', hi: 'क्योंकि आय या तो खपती है या बचती है: C + S = Y, इसलिए Y से भाग देने पर C/Y + S/Y = 1' },
                    { en: 'Because MPC is always 0.5', hi: 'क्योंकि MPC हमेशा 0.5 होती है' },
                    { en: 'It is a coincidence', hi: 'यह संयोग है' },
                    { en: 'Because APC is always 1', hi: 'क्योंकि APC हमेशा 1 होती है' }
                ],
                correctIndex: 0,
                explain: { en: 'It is an identity, not a result. Every rupee of income is by definition either spent or not spent, and "not spent" is saving.', hi: 'यह एक तत्समक है, कोई परिणाम नहीं। आय का हर रुपया परिभाषा से या तो ख़र्च होता है या नहीं, और "नहीं ख़र्च हुआ" ही बचत है।' },
                syllabusId: 'XII-A-U3-PROPENSITY'
            },
            {
                level: 'apply',
                question: { en: 'If MPC = 0.75, what is the value of the multiplier?', hi: 'यदि MPC = 0.75 है, तो गुणक का मान क्या है?' },
                options: [
                    { en: '4', hi: '4' },
                    { en: '0.25', hi: '0.25' },
                    { en: '1.33', hi: '1.33' },
                    { en: '7.5', hi: '7.5' }
                ],
                correctIndex: 0,
                explain: { en: 'k = 1/(1 − MPC) = 1/MPS = 1/0.25 = 4. Every ₹1 of extra autonomous spending eventually raises income by ₹4.', hi: 'k = 1/(1 − MPC) = 1/MPS = 1/0.25 = 4। हर ₹1 अतिरिक्त स्वायत्त व्यय अंततः आय ₹4 बढ़ाता है।' },
                syllabusId: 'XII-A-U3-PROPENSITY'
            },
            {
                level: 'understand',
                question: { en: 'The consumption function C = C̄ + bY has a positive intercept C̄ because…', hi: 'उपभोग फलन C = C̄ + bY का धनात्मक अंतःखंड C̄ है क्योंकि…' },
                options: [
                    { en: 'Even at zero income people must consume, funded by past savings or borrowing', hi: 'शून्य आय पर भी लोगों को उपभोग करना पड़ता है, जो पुरानी बचत या उधार से होता है' },
                    { en: 'Income can never be zero', hi: 'आय कभी शून्य नहीं हो सकती' },
                    { en: 'The government pays for it', hi: 'सरकार इसका भुगतान करती है' },
                    { en: 'Saving is always zero', hi: 'बचत हमेशा शून्य होती है' }
                ],
                correctIndex: 0,
                explain: { en: 'C̄ is autonomous consumption — the minimum needed to survive, independent of current income. That is exactly why saving is negative at very low income levels.', hi: 'C̄ स्वायत्त उपभोग है — जीवित रहने के लिए न्यूनतम आवश्यक, वर्तमान आय से स्वतंत्र। इसीलिए बहुत कम आय स्तर पर बचत ऋणात्मक होती है।' },
                syllabusId: 'XII-A-U3-PROPENSITY'
            }
        ],
        applyTemplates: [
            {
                level: 'apply',
                build(state, m) {
                    if (typeof m.apc !== 'number' || !isFinite(m.apc)) return null;
                    return {
                        question: { en: `At income ₹${Math.round(state.y)} cr with C̄ = ₹${state.cbar} cr and MPC = ${state.mpc.toFixed(2)}, what is APC?`, hi: `₹${Math.round(state.y)} करोड़ आय, C̄ = ₹${state.cbar} करोड़ और MPC = ${state.mpc.toFixed(2)} पर APC क्या है?` },
                        options: quizNumericOptions(m.apc, [0.12, -0.09, 0.22], { round: 3 }),
                        correctIndex: 0,
                        explain: { en: `C = ${state.cbar} + ${state.mpc.toFixed(2)}×${Math.round(state.y)}, so APC = C/Y = ${m.apc.toFixed(3)}. Check: APC + APS = ${(m.apc + m.aps).toFixed(3)}.`, hi: `C = ${state.cbar} + ${state.mpc.toFixed(2)}×${Math.round(state.y)}, इसलिए APC = C/Y = ${m.apc.toFixed(3)}। जाँच: APC + APS = ${(m.apc + m.aps).toFixed(3)}।` },
                        syllabusId: 'XII-A-U3-PROPENSITY'
                    };
                }
            },
            {
                level: 'apply',
                build(state, m) {
                    if (typeof m.be !== 'number' || !isFinite(m.be)) return null;
                    return {
                        question: { en: `With C̄ = ₹${state.cbar} cr and MPC = ${state.mpc.toFixed(2)}, at what income is saving exactly zero?`, hi: `C̄ = ₹${state.cbar} करोड़ और MPC = ${state.mpc.toFixed(2)} पर किस आय पर बचत ठीक शून्य होगी?` },
                        options: quizNumericOptions(m.be, [45, -35, 85], { round: 0, prefix: '₹', suffix: ' cr' }),
                        correctIndex: 0,
                        explain: { en: `Break-even income = C̄/(1 − MPC) = ${state.cbar}/${(1 - state.mpc).toFixed(2)} = ₹${Math.round(m.be)} cr.`, hi: `सम-विच्छेद आय = C̄/(1 − MPC) = ${state.cbar}/${(1 - state.mpc).toFixed(2)} = ₹${Math.round(m.be)} करोड़।` },
                        syllabusId: 'XII-A-U3-PROPENSITY'
                    };
                }
            }
        ]
    };

    QUIZ_BANK['gl-forex-determination'] = {
        static: [
            {
                level: 'remember',
                question: { en: 'Under a flexible exchange rate system, the rate is determined by…', hi: 'लचीली विनिमय दर प्रणाली में दर निर्धारित होती है…' },
                options: [
                    { en: 'Market forces — the demand for and supply of foreign exchange', hi: 'बाज़ार शक्तियों से — विदेशी मुद्रा की माँग और पूर्ति' },
                    { en: 'The central bank fixing it by decree', hi: 'केंद्रीय बैंक द्वारा आदेश से तय करने से' },
                    { en: 'The IMF alone', hi: 'केवल IMF द्वारा' },
                    { en: 'The rate of inflation only', hi: 'केवल मुद्रास्फीति दर से' }
                ],
                correctIndex: 0,
                explain: { en: 'A flexible (floating) rate is a market price like any other — it settles where the demand curve for forex cuts the supply curve.', hi: 'लचीली (तैरती) दर किसी अन्य बाज़ार कीमत जैसी है — यह वहाँ स्थिर होती है जहाँ विदेशी मुद्रा का माँग वक्र पूर्ति वक्र को काटता है।' },
                syllabusId: 'XII-A-U5-DETERMINATION'
            },
            {
                level: 'understand',
                question: { en: 'The rupee moves from ₹75/$ to ₹82/$. This is…', hi: 'रुपया ₹75/$ से ₹82/$ पर जाता है। यह है…' },
                options: [
                    { en: 'Depreciation of the rupee — each dollar now costs more rupees', hi: 'रुपये का अवमूल्यन (depreciation) — अब हर डॉलर अधिक रुपये माँगता है' },
                    { en: 'Appreciation of the rupee', hi: 'रुपये का मूल्यवर्धन' },
                    { en: 'Revaluation of the rupee', hi: 'रुपये का पुनर्मूल्यांकन' },
                    { en: 'No change in value', hi: 'मूल्य में कोई परिवर्तन नहीं' }
                ],
                correctIndex: 0,
                explain: { en: 'A higher ₹/$ figure means the rupee buys fewer dollars — it has lost value. Under a flexible system that is depreciation, not devaluation.', hi: 'अधिक ₹/$ का अर्थ है रुपया कम डॉलर ख़रीदता है — इसका मूल्य घटा। लचीली प्रणाली में यह depreciation है, devaluation नहीं।' },
                syllabusId: 'XII-A-U5-EXRATE'
            },
            {
                level: 'analyse',
                question: { en: 'Indian software exports boom. What happens in the forex market?', hi: 'भारतीय सॉफ़्टवेयर निर्यात में उछाल आता है। विदेशी मुद्रा बाज़ार में क्या होता है?' },
                options: [
                    { en: 'The SUPPLY of forex shifts right, so ₹/$ falls — the rupee appreciates', hi: 'विदेशी मुद्रा की पूर्ति दाईं ओर खिसकती है, इसलिए ₹/$ गिरती है — रुपया मज़बूत होता है' },
                    { en: 'The DEMAND for forex shifts right, so the rupee depreciates', hi: 'विदेशी मुद्रा की माँग दाईं ओर खिसकती है, इसलिए रुपया कमज़ोर होता है' },
                    { en: 'Supply shifts left', hi: 'पूर्ति बाईं ओर खिसकती है' },
                    { en: 'Nothing changes', hi: 'कुछ नहीं बदलता' }
                ],
                correctIndex: 0,
                explain: { en: 'Exports EARN foreign currency, so more dollars flow into India — that is an increase in the supply of forex, which lowers its rupee price.', hi: 'निर्यात विदेशी मुद्रा कमाते हैं, इसलिए अधिक डॉलर भारत आते हैं — यह विदेशी मुद्रा की पूर्ति में वृद्धि है, जो उसकी रुपया-कीमत घटाती है।' },
                syllabusId: 'XII-A-U5-DETERMINATION'
            },
            {
                level: 'evaluate',
                question: { en: 'What is the difference between depreciation and devaluation?', hi: 'Depreciation और devaluation में क्या अंतर है?' },
                options: [
                    { en: 'Depreciation is market-driven under a flexible system; devaluation is a deliberate government decision under a fixed system', hi: 'Depreciation लचीली प्रणाली में बाज़ार-चालित है; devaluation स्थिर प्रणाली में सरकार का जानबूझकर लिया निर्णय है' },
                    { en: 'They are the same thing', hi: 'दोनों एक ही हैं' },
                    { en: 'Depreciation raises the currency\'s value', hi: 'Depreciation मुद्रा का मूल्य बढ़ाता है' },
                    { en: 'Devaluation only happens to the dollar', hi: 'Devaluation केवल डॉलर के साथ होता है' }
                ],
                correctIndex: 0,
                explain: { en: 'Both mean the domestic currency loses value against a foreign one; only the MECHANISM differs — market forces versus an official announcement.', hi: 'दोनों का अर्थ है घरेलू मुद्रा का विदेशी मुद्रा के मुक़ाबले मूल्य घटना; केवल तंत्र अलग है — बाज़ार शक्तियाँ बनाम आधिकारिक घोषणा।' },
                syllabusId: 'XII-A-U5-EXRATE'
            },
            {
                level: 'apply',
                question: { en: 'The rupee depreciates. What is the likely effect on India\'s exports and imports?', hi: 'रुपया कमज़ोर होता है। भारत के निर्यात और आयात पर संभावित प्रभाव क्या है?' },
                options: [
                    { en: 'Exports rise (cheaper abroad) and imports fall (dearer at home)', hi: 'निर्यात बढ़ते हैं (विदेश में सस्ते) और आयात घटते हैं (घर पर महँगे)' },
                    { en: 'Exports fall and imports rise', hi: 'निर्यात घटते हैं और आयात बढ़ते हैं' },
                    { en: 'Both rise', hi: 'दोनों बढ़ते हैं' },
                    { en: 'Both fall', hi: 'दोनों घटते हैं' }
                ],
                correctIndex: 0,
                explain: { en: 'A weaker rupee means foreigners pay fewer of their own units for Indian goods, while Indians pay more rupees for imports — so the trade balance tends to improve.', hi: 'कमज़ोर रुपये का अर्थ है विदेशी भारतीय वस्तुओं के लिए अपनी कम इकाइयाँ देते हैं, जबकि भारतीय आयात के लिए अधिक रुपये — इसलिए व्यापार संतुलन सुधरता है।' },
                syllabusId: 'XII-A-U5-EXRATE'
            },
            {
                level: 'understand',
                question: { en: 'Why does the demand curve for foreign exchange slope DOWNWARD?', hi: 'विदेशी मुद्रा का माँग वक्र नीचे की ओर ढलान वाला क्यों है?' },
                options: [
                    { en: 'A dearer dollar makes imports and foreign travel costlier in rupees, so less forex is demanded', hi: 'महँगा डॉलर आयात और विदेश यात्रा को रुपयों में महँगा बनाता है, इसलिए कम विदेशी मुद्रा माँगी जाती है' },
                    { en: 'Because exports rise', hi: 'क्योंकि निर्यात बढ़ते हैं' },
                    { en: 'Because the RBI fixes the rate', hi: 'क्योंकि RBI दर तय करता है' },
                    { en: 'It actually slopes upward', hi: 'यह वास्तव में ऊपर की ओर ढलान वाला है' }
                ],
                correctIndex: 0,
                explain: { en: 'Forex is demanded for imports, travel, remittances abroad and investing abroad. All of those become costlier in rupee terms when ₹/$ rises, so the quantity demanded falls.', hi: 'विदेशी मुद्रा आयात, यात्रा, विदेश भेजी रक़म और विदेश निवेश के लिए माँगी जाती है। ₹/$ बढ़ने पर ये सब रुपयों में महँगे हो जाते हैं, इसलिए माँगी गई मात्रा घटती है।' },
                syllabusId: 'XII-A-U5-DETERMINATION'
            }
        ],
        applyTemplates: [
            {
                level: 'apply',
                build(state, m) {
                    if (typeof m.rate !== 'number' || !isFinite(m.rate)) return null;
                    return {
                        question: { en: `With a forex demand shift of ${state.demandShift >= 0 ? '+' : ''}${Math.round(state.demandShift)} and a supply shift of ${state.supplyShift >= 0 ? '+' : ''}${Math.round(state.supplyShift)}, what is the equilibrium exchange rate?`, hi: `${state.demandShift >= 0 ? '+' : ''}${Math.round(state.demandShift)} माँग खिसकाव और ${state.supplyShift >= 0 ? '+' : ''}${Math.round(state.supplyShift)} पूर्ति खिसकाव पर संतुलन विनिमय दर क्या है?` },
                        options: quizNumericOptions(m.rate, [6, -5, 11], { round: 1, prefix: '₹', suffix: '/$' }),
                        correctIndex: 0,
                        explain: { en: `Equilibrium is where forex demand cuts forex supply: ₹${m.rate.toFixed(1)} per $. That is ${m.dRate > 0 ? 'a depreciation' : m.dRate < 0 ? 'an appreciation' : 'unchanged'} against the original ₹50/$ baseline.`, hi: `संतुलन वहाँ है जहाँ विदेशी मुद्रा की माँग पूर्ति को काटती है: ₹${m.rate.toFixed(1)} प्रति $। यह मूल स्तर के मुक़ाबले ${m.dRate > 0 ? 'depreciation' : m.dRate < 0 ? 'appreciation' : 'अपरिवर्तित'} है।` },
                        syllabusId: 'XII-A-U5-DETERMINATION'
                    };
                }
            }
        ]
    };
}
