// Quiz banks for the 4 sims defined in js/simulations_ied_class12.js.
// See js/quiz-engine.js's header for the QUIZ_BANK data contract.
// ied-five-year-plans, ied-rural-development and ied-sustainable-development are
// explorer-mode (timeline/scenario, no compute()/dataLab) so each carries 10 static
// questions with no applyTemplates. ied-comparison-neighbours is datalab-mode, so it
// gets static questions plus apply-templates driven by its own calculate() metrics.

if (typeof QUIZ_BANK !== 'undefined') {
    QUIZ_BANK['ied-five-year-plans'] = {
        static: [
            {
                level: 'remember',
                question: { en: 'India adopted which type of economy in the post-Independence period?', hi: 'स्वतंत्रता के बाद के काल में भारत ने किस प्रकार की अर्थव्यवस्था अपनाई?' },
                options: [
                    { en: 'A Mixed Economy (public and private sectors coexisting)', hi: 'एक मिश्रित अर्थव्यवस्था (सार्वजनिक और निजी क्षेत्र साथ-साथ)' },
                    { en: 'A purely state-run (command) economy', hi: 'पूर्णतः राज्य-संचालित (कमांड) अर्थव्यवस्था' },
                    { en: 'A purely free-market economy', hi: 'पूर्णतः मुक्त-बाजार अर्थव्यवस्था' },
                    { en: 'A barter economy', hi: 'वस्तु-विनिमय अर्थव्यवस्था' }
                ],
                correctIndex: 0,
                explain: { en: 'India chose a Mixed Economy, with the Planning Commission designing Five-Year Plans and the state taking the lead in heavy industry and infrastructure.', hi: 'भारत ने मिश्रित अर्थव्यवस्था चुनी, योजना आयोग ने पंचवर्षीय योजनाएँ बनाईं और राज्य ने भारी उद्योग व अवसंरचना में अगुवाई की।' },
                syllabusId: 'XII-B-U6-SYSTEM'
            },
            {
                level: 'remember',
                question: { en: 'Which of these was NOT one of the four recurring goals of the Five-Year Plans?', hi: 'इनमें से कौन-सा पंचवर्षीय योजनाओं का बार-बार दोहराया गया लक्ष्य नहीं था?' },
                options: [
                    { en: 'Maximising foreign debt', hi: 'विदेशी ऋण को अधिकतम करना' },
                    { en: 'Growth', hi: 'संवृद्धि (Growth)' },
                    { en: 'Modernisation', hi: 'आधुनिकीकरण' },
                    { en: 'Equity', hi: 'समता (Equity)' }
                ],
                correctIndex: 0,
                explain: { en: 'The four recurring goals were Growth, Modernisation, Self-Reliance and Equity — never maximising foreign debt, which the Plans generally tried to avoid.', hi: 'चार बार-बार दोहराए गए लक्ष्य थे: संवृद्धि, आधुनिकीकरण, आत्मनिर्भरता और समता — विदेशी ऋण को अधिकतम करना कभी नहीं, जिससे योजनाएँ आम तौर पर बचती थीं।' },
                syllabusId: 'XII-B-U6-PLANS'
            },
            {
                level: 'understand',
                question: { en: 'The "New Agricultural Strategy" (Green Revolution) relied mainly on…', hi: '"नई कृषि रणनीति" (हरित क्रांति) मुख्यतः किस पर निर्भर थी…' },
                options: [
                    { en: 'HYV seeds, irrigation and fertilisers', hi: 'HYV बीज, सिंचाई और उर्वरक' },
                    { en: 'Abolishing all land ownership', hi: 'सभी भूमि स्वामित्व को समाप्त करना' },
                    { en: 'Importing all foodgrain from abroad', hi: 'सारा खाद्यान्न विदेश से आयात करना' },
                    { en: 'Banning the use of machinery in farms', hi: 'खेतों में मशीनरी के उपयोग पर प्रतिबंध' }
                ],
                correctIndex: 0,
                explain: { en: 'High-Yielding Variety (HYV) seeds, expanded irrigation and chemical fertilisers sharply raised foodgrain output, mainly in Punjab, Haryana and western UP.', hi: 'उच्च-उपज किस्म (HYV) बीज, विस्तारित सिंचाई और रासायनिक उर्वरकों ने खाद्यान्न उत्पादन में तेज़ी से वृद्धि की, मुख्यतः पंजाब, हरियाणा और पश्चिमी UP में।' },
                syllabusId: 'XII-B-U6-AGRICULTURE'
            },
            {
                level: 'understand',
                question: { en: '"Import Substitution", the trade policy followed before 1991, aimed to…', hi: '1991 से पहले अपनाई गई व्यापार नीति "आयात प्रतिस्थापन" का उद्देश्य था…' },
                options: [
                    { en: 'Produce domestically what was previously imported, to reduce dependence on foreign goods', hi: 'घरेलू स्तर पर वह उत्पादन करना जो पहले आयात होता था, ताकि विदेशी वस्तुओं पर निर्भरता कम हो' },
                    { en: 'Maximise imports of every category of good', hi: 'हर श्रेणी की वस्तु का आयात अधिकतम करना' },
                    { en: 'Remove all tariffs on imports immediately', hi: 'आयात पर सभी शुल्क तुरंत हटाना' },
                    { en: 'Encourage foreign firms to dominate Indian industry', hi: 'विदेशी फर्मों को भारतीय उद्योग पर हावी होने के लिए प्रोत्साहित करना' }
                ],
                correctIndex: 0,
                explain: { en: 'Import substitution meant building domestic capacity to make goods India would otherwise import, protected by tariffs and licensing.', hi: 'आयात प्रतिस्थापन का अर्थ था उन वस्तुओं के लिए घरेलू क्षमता बनाना जो भारत अन्यथा आयात करता, शुल्क और लाइसेंसिंग द्वारा संरक्षित।' },
                syllabusId: 'XII-B-U6-TRADE'
            },
            {
                level: 'apply',
                question: { en: 'A country\'s foreign exchange reserves fall to barely cover a few weeks of imports, and it must airlift gold to secure an emergency loan. This describes India\'s situation in…', hi: 'एक देश का विदेशी मुद्रा भंडार गिरकर आयात के कुछ हफ्तों को भी बमुश्किल कवर करता है, और उसे आपातकालीन ऋण सुरक्षित करने के लिए सोना हवाई मार्ग से भेजना पड़ता है। यह भारत की स्थिति का वर्णन करता है…' },
                options: [
                    { en: '1991', hi: '1991' },
                    { en: '1950', hi: '1950' },
                    { en: '2017', hi: '2017' },
                    { en: '1947', hi: '1947' }
                ],
                correctIndex: 0,
                explain: { en: 'This was the 1991 Balance of Payments crisis — the immediate trigger for the LPG reforms.', hi: 'यह 1991 का भुगतान संतुलन संकट था — LPG सुधारों का तात्कालिक कारण।' },
                syllabusId: 'XII-B-U6-LPG'
            },
            {
                level: 'apply',
                question: { en: 'Which LPG reform most directly reverses the earlier "License-Permit-Quota Raj" of heavy industrial licensing?', hi: 'कौन-सा LPG सुधार भारी औद्योगिक लाइसेंसिंग के पहले के "लाइसेंस-परमिट-कोटा राज" को सबसे सीधे उलटता है?' },
                options: [
                    { en: 'Liberalisation', hi: 'उदारीकरण (Liberalisation)' },
                    { en: 'Privatisation', hi: 'निजीकरण (Privatisation)' },
                    { en: 'Globalisation', hi: 'वैश्वीकरण (Globalisation)' },
                    { en: 'Demonetisation', hi: 'विमुद्रीकरण (Demonetisation)' }
                ],
                correctIndex: 0,
                explain: { en: 'Liberalisation scrapped industrial licensing for most industries and moved interest/exchange rates closer to market determination.', hi: 'उदारीकरण ने अधिकांश उद्योगों के लिए औद्योगिक लाइसेंसिंग समाप्त की और ब्याज/विनिमय दरों को बाजार निर्धारण के करीब लाया।' },
                syllabusId: 'XII-B-U6-LPG'
            },
            {
                level: 'analyse',
                question: { en: 'How do the pre-1991 policies and the post-1991 LPG reforms relate to each other?', hi: '1991-पूर्व नीतियाँ और 1991-पश्चात LPG सुधार एक-दूसरे से किस प्रकार संबंधित हैं?' },
                options: [
                    { en: 'LPG reforms largely reverse the earlier tools — licensing, public-sector dominance, and import substitution — with liberalisation, privatisation and globalisation respectively', hi: 'LPG सुधार बड़े पैमाने पर पहले के उपकरणों — लाइसेंसिंग, सार्वजनिक-क्षेत्र प्रभुत्व, और आयात प्रतिस्थापन — को क्रमशः उदारीकरण, निजीकरण और वैश्वीकरण से उलटते हैं' },
                    { en: 'LPG reforms are identical in method to the pre-1991 policies', hi: 'LPG सुधार पद्धति में 1991-पूर्व नीतियों के समान हैं' },
                    { en: 'There is no relationship between the two periods', hi: 'दोनों कालों के बीच कोई संबंध नहीं है' },
                    { en: 'LPG reforms increased licensing requirements further', hi: 'LPG सुधारों ने लाइसेंसिंग आवश्यकताओं को और बढ़ाया' }
                ],
                correctIndex: 0,
                explain: { en: 'Each LPG pillar directly targets a specific pre-1991 tool: Liberalisation ↔ licensing, Privatisation ↔ public-sector dominance, Globalisation ↔ import substitution.', hi: 'हर LPG स्तंभ एक विशिष्ट 1991-पूर्व उपकरण को सीधे लक्षित करता है: उदारीकरण ↔ लाइसेंसिंग, निजीकरण ↔ सार्वजनिक-क्षेत्र प्रभुत्व, वैश्वीकरण ↔ आयात प्रतिस्थापन।' }
            },
            {
                level: 'analyse',
                question: { en: 'What is a key difference between Demonetisation (2016) and the LPG reforms (1991 onward)?', hi: 'विमुद्रीकरण (2016) और LPG सुधारों (1991 से) के बीच एक प्रमुख अंतर क्या है?' },
                options: [
                    { en: 'Demonetisation was a sudden monetary/administrative move; LPG was a gradual structural reform package', hi: 'विमुद्रीकरण एक अचानक मौद्रिक/प्रशासनिक कदम था; LPG एक क्रमिक संरचनात्मक सुधार पैकेज था' },
                    { en: 'They are the same kind of policy, just at different dates', hi: 'ये एक ही प्रकार की नीति हैं, बस अलग-अलग तारीखों पर' },
                    { en: 'Demonetisation lasted three decades', hi: 'विमुद्रीकरण तीन दशकों तक चला' },
                    { en: 'LPG happened overnight with no transition', hi: 'LPG रातोंरात बिना किसी परिवर्तन काल के हुआ' }
                ],
                correctIndex: 0,
                explain: { en: 'Demonetisation withdrew high-value notes overnight to curb black money and fake currency; LPG was a multi-year structural shift in industrial, trade and public-sector policy.', hi: 'विमुद्रीकरण ने काला धन और नकली मुद्रा पर अंकुश के लिए उच्च-मूल्य नोट रातोंरात वापस लिए; LPG औद्योगिक, व्यापार और सार्वजनिक-क्षेत्र नीति में एक बहु-वर्षीय संरचनात्मक बदलाव था।' }
            },
            {
                level: 'evaluate',
                question: { en: 'The LPG reforms are credited with raising GDP growth and foreign investment, but also critiqued for slower agricultural growth and rising inequality. What does this balanced appraisal tell you about evaluating any major reform?', hi: 'LPG सुधारों का श्रेय GDP संवृद्धि और विदेशी निवेश बढ़ाने को दिया जाता है, पर धीमी कृषि संवृद्धि और बढ़ती असमानता के लिए आलोचना भी होती है। यह संतुलित मूल्यांकन किसी भी बड़े सुधार का आकलन करने के बारे में क्या बताता है?' },
                options: [
                    { en: 'A reform can raise aggregate growth while its benefits are unevenly distributed across sectors and groups — both effects need to be weighed together', hi: 'एक सुधार समग्र संवृद्धि बढ़ा सकता है जबकि इसके लाभ क्षेत्रों और समूहों में असमान रूप से वितरित होते हैं — दोनों प्रभावों को साथ तौला जाना चाहिए' },
                    { en: 'Any reform that raises GDP growth has no downsides', hi: 'कोई भी सुधार जो GDP संवृद्धि बढ़ाता है, उसका कोई नकारात्मक पक्ष नहीं होता' },
                    { en: 'Agricultural growth and GDP growth always move together', hi: 'कृषि संवृद्धि और GDP संवृद्धि हमेशा साथ-साथ चलती हैं' },
                    { en: 'Inequality is irrelevant to judging economic reforms', hi: 'आर्थिक सुधारों का आकलन करने में असमानता अप्रासंगिक है' }
                ],
                correctIndex: 0,
                explain: { en: 'A genuinely useful appraisal weighs both the aggregate gains (growth, investment) and the distributional/sectoral costs (agriculture, inequality) — the syllabus explicitly expects both sides.', hi: 'एक वास्तविक रूप से उपयोगी मूल्यांकन समग्र लाभ (संवृद्धि, निवेश) और वितरणात्मक/क्षेत्रीय लागत (कृषि, असमानता) दोनों को तौलता है — पाठ्यक्रम स्पष्ट रूप से दोनों पक्षों की अपेक्षा करता है।' }
            },
            {
                level: 'evaluate',
                question: { en: 'Why is GST (2017) described as belonging on this timeline "alongside, not the same as" the original 1991 LPG package?', hi: 'GST (2017) को इस समयरेखा पर मूल 1991 LPG पैकेज के "साथ, समान नहीं" के रूप में क्यों वर्णित किया गया है?' },
                options: [
                    { en: 'GST is a major structural reform (unifying indirect taxes) in its own right, arriving 26 years after LPG, not a component of the original 1991 package', hi: 'GST स्वयं में एक बड़ा संरचनात्मक सुधार है (अप्रत्यक्ष करों को एकीकृत करना), जो LPG के 26 वर्ष बाद आया, मूल 1991 पैकेज का घटक नहीं' },
                    { en: 'GST and LPG are identical policies under different names', hi: 'GST और LPG अलग-अलग नामों के तहत समान नीतियाँ हैं' },
                    { en: 'GST reversed all the LPG reforms', hi: 'GST ने सभी LPG सुधारों को उलट दिया' },
                    { en: 'GST predates the 1991 reforms', hi: 'GST 1991 के सुधारों से पहले का है' }
                ],
                correctIndex: 0,
                explain: { en: 'GST replaced a patchwork of central and state indirect taxes with a single system — significant enough to be "the most significant tax reform since 1991", but a separate, later structural reform rather than part of the original LPG package.', hi: 'GST ने केंद्रीय और राज्य अप्रत्यक्ष करों की पच्चीकारी को एक ही प्रणाली से बदला — यह "1991 के बाद का सबसे महत्वपूर्ण कर सुधार" कहलाने योग्य है, पर यह मूल LPG पैकेज का हिस्सा नहीं बल्कि एक अलग, बाद का संरचनात्मक सुधार है।' }
            }
        ]
    };

    QUIZ_BANK['ied-rural-development'] = {
        static: [
            {
                level: 'remember',
                question: { en: 'Rural Development, as used in this unit, means…', hi: 'इस इकाई में प्रयुक्त ग्रामीण विकास का अर्थ है…' },
                options: [
                    { en: 'Raising the standard of living of the rural population', hi: 'ग्रामीण जनसंख्या के जीवन स्तर को ऊँचा उठाना' },
                    { en: 'Building only new roads in cities', hi: 'केवल शहरों में नई सड़कें बनाना' },
                    { en: 'Moving all rural residents to urban areas', hi: 'सभी ग्रामीण निवासियों को शहरी क्षेत्रों में स्थानांतरित करना' },
                    { en: 'Reducing agricultural output', hi: 'कृषि उत्पादन को कम करना' }
                ],
                correctIndex: 0,
                explain: { en: 'Rural development means raising the standard of living of the rural population, which in India is still predominantly agricultural.', hi: 'ग्रामीण विकास का अर्थ है ग्रामीण जनसंख्या के जीवन स्तर को ऊँचा उठाना, जो भारत में अभी भी मुख्यतः कृषि पर निर्भर है।' },
                syllabusId: 'XII-B-U7-RURAL'
            },
            {
                level: 'remember',
                question: { en: 'Historically, rural credit was dominated by…', hi: 'ऐतिहासिक रूप से, ग्रामीण ऋण पर किसका प्रभुत्व था…' },
                options: [
                    { en: 'Moneylenders charging very high interest', hi: 'बहुत ऊँची ब्याज दर वसूलने वाले साहूकार' },
                    { en: 'Only large commercial banks', hi: 'केवल बड़े वाणिज्यिक बैंक' },
                    { en: 'The stock market', hi: 'शेयर बाजार' },
                    { en: 'Foreign direct investment', hi: 'प्रत्यक्ष विदेशी निवेश' }
                ],
                correctIndex: 0,
                explain: { en: 'Informal moneylenders historically dominated rural credit, often trapping farmers in generational debt cycles at exploitative interest rates.', hi: 'अनौपचारिक साहूकारों का ऐतिहासिक रूप से ग्रामीण ऋण पर प्रभुत्व था, जो अक्सर शोषणकारी ब्याज दरों पर किसानों को पीढ़ी-दर-पीढ़ी ऋण चक्रों में फँसाते थे।' },
                syllabusId: 'XII-B-U7-RURAL'
            },
            {
                level: 'understand',
                question: { en: 'NABARD\'s role in rural development is best described as…', hi: 'ग्रामीण विकास में NABARD की भूमिका का सबसे अच्छा वर्णन है…' },
                options: [
                    { en: 'An apex institution financing agriculture and rural development', hi: 'कृषि और ग्रामीण विकास को वित्तपोषित करने वाली एक शीर्ष संस्था' },
                    { en: 'A private moneylending firm', hi: 'एक निजी साहूकारी फर्म' },
                    { en: 'A body that only regulates urban housing', hi: 'एक निकाय जो केवल शहरी आवास को विनियमित करता है' },
                    { en: 'A foreign aid agency', hi: 'एक विदेशी सहायता एजेंसी' }
                ],
                correctIndex: 0,
                explain: { en: 'NABARD (National Bank for Agriculture and Rural Development) is the apex institution channelling formal credit into agriculture and rural development.', hi: 'NABARD (राष्ट्रीय कृषि और ग्रामीण विकास बैंक) कृषि और ग्रामीण विकास में औपचारिक ऋण पहुँचाने वाली शीर्ष संस्था है।' },
                syllabusId: 'XII-B-U7-RURAL'
            },
            {
                level: 'understand',
                question: { en: 'Minimum Support Price (MSP) is best understood, in microeconomic terms, as…', hi: 'न्यूनतम समर्थन मूल्य (MSP) को सूक्ष्मअर्थशास्त्रीय रूप में सबसे अच्छा समझा जाता है…' },
                options: [
                    { en: 'A price floor protecting farmers from distress sales at very low prices', hi: 'किसानों को बहुत कम कीमतों पर संकटपूर्ण बिक्री से बचाने वाला एक मूल्य तल (price floor)' },
                    { en: 'A price ceiling limiting how much a farmer can charge', hi: 'एक मूल्य सीमा (price ceiling) जो सीमित करती है कि किसान कितना शुल्क ले सकता है' },
                    { en: 'A tax on agricultural exports', hi: 'कृषि निर्यात पर एक कर' },
                    { en: 'A subsidy paid only to urban consumers', hi: 'केवल शहरी उपभोक्ताओं को दी जाने वाली एक सब्सिडी' }
                ],
                correctIndex: 0,
                explain: { en: 'MSP guarantees a minimum price to farmers for key crops — exactly the real-world counterpart of the "price floor" concept from Class XI Microeconomics.', hi: 'MSP प्रमुख फसलों के लिए किसानों को न्यूनतम मूल्य की गारंटी देता है — यह कक्षा XI सूक्ष्मअर्थशास्त्र की "मूल्य तल" अवधारणा का वास्तविक-जगत समकक्ष है।' },
                syllabusId: 'XII-B-U7-RURAL'
            },
            {
                level: 'apply',
                question: { en: 'A dairy cooperative like AMUL lets individual small farmers collectively bargain for better prices and processing access. This is an example of which lever of rural development?', hi: 'AMUL जैसी डेयरी सहकारी समिति व्यक्तिगत छोटे किसानों को बेहतर कीमतों और प्रसंस्करण पहुँच के लिए सामूहिक रूप से मोलभाव करने देती है। यह ग्रामीण विकास के किस लीवर का उदाहरण है?' },
                options: [
                    { en: 'Role of Cooperatives', hi: 'सहकारी समितियों की भूमिका' },
                    { en: 'Rural Credit', hi: 'ग्रामीण ऋण' },
                    { en: 'Organic Farming', hi: 'जैविक खेती' },
                    { en: 'Global Warming mitigation', hi: 'वैश्विक तापन शमन' }
                ],
                correctIndex: 0,
                explain: { en: 'AMUL-style dairy cooperatives (Operation Flood) are NCERT\'s flagship success story for the cooperative lever — pooling resources for collective marketing and processing.', hi: 'AMUL-शैली की डेयरी सहकारी समितियाँ (ऑपरेशन फ्लड) सहकारी लीवर की NCERT की प्रमुख सफलता कहानी हैं — सामूहिक विपणन और प्रसंस्करण के लिए संसाधन इकट्ठा करना।' },
                syllabusId: 'XII-B-U7-RURAL'
            },
            {
                level: 'apply',
                question: { en: 'A farming household starts a small poultry and dairy business alongside its usual crop farming, so a bad crop year hurts less. This best illustrates…', hi: 'एक कृषि परिवार अपनी सामान्य फसल खेती के साथ एक छोटा मुर्गी पालन और डेयरी व्यवसाय शुरू करता है, ताकि एक बुरा फसल वर्ष कम नुकसान करे। यह सबसे अच्छा उदाहरण है…' },
                options: [
                    { en: 'Agricultural Diversification', hi: 'कृषि विविधीकरण' },
                    { en: 'Rural Marketing', hi: 'ग्रामीण विपणन' },
                    { en: 'Rural Credit', hi: 'ग्रामीण ऋण' },
                    { en: 'Global Warming', hi: 'वैश्विक तापन' }
                ],
                correctIndex: 0,
                explain: { en: 'Diversification into allied activities (dairy, poultry, fisheries, horticulture) or non-farm work spreads risk away from dependence on crop farming alone.', hi: 'सहायक गतिविधियों (डेयरी, मुर्गी पालन, मत्स्य पालन, बागवानी) या गैर-कृषि कार्य में विविधीकरण अकेले फसल खेती पर निर्भरता से जोखिम को फैलाता है।' },
                syllabusId: 'XII-B-U7-RURAL'
            },
            {
                level: 'analyse',
                question: { en: 'Why does the explorer link Rural Marketing directly to the Price Floor simulator from Class XI Microeconomics rather than to Rural Credit?', hi: 'यह एक्सप्लोरर ग्रामीण विपणन को ग्रामीण ऋण के बजाय कक्षा XI सूक्ष्मअर्थशास्त्र के मूल्य तल सिम्युलेटर से सीधे क्यों जोड़ता है?' },
                options: [
                    { en: 'Because MSP (a Rural Marketing tool) IS a real-world price floor, while Rural Credit addresses a completely different problem (input finance, not output price)', hi: 'क्योंकि MSP (एक ग्रामीण विपणन उपकरण) एक वास्तविक-जगत मूल्य तल ही है, जबकि ग्रामीण ऋण एक पूरी तरह अलग समस्या (इनपुट वित्त, आउटपुट कीमत नहीं) को संबोधित करता है' },
                    { en: 'Because credit and marketing are always the same thing', hi: 'क्योंकि ऋण और विपणन हमेशा एक ही चीज़ हैं' },
                    { en: 'Because Rural Credit has nothing to do with farmers', hi: 'क्योंकि ग्रामीण ऋण का किसानों से कोई लेना-देना नहीं है' },
                    { en: 'There is no real connection intended', hi: 'कोई वास्तविक संबंध अभिप्रेत नहीं है' }
                ],
                correctIndex: 0,
                explain: { en: 'Rural Marketing tools (MSP, regulated markets) act on the OUTPUT price a farmer receives — the exact mechanism of a price floor — while Rural Credit addresses financing INPUTS before production, a separate problem.', hi: 'ग्रामीण विपणन उपकरण (MSP, विनियमित बाजार) किसान को मिलने वाली आउटपुट कीमत पर कार्य करते हैं — मूल्य तल का ठीक वही तंत्र — जबकि ग्रामीण ऋण उत्पादन से पहले इनपुट के वित्तपोषण को संबोधित करता है, एक अलग समस्या।' }
            },
            {
                level: 'analyse',
                question: { en: 'What connects Organic Farming (in this explorer) to Sustainable Economic Development (the next topic)?', hi: 'इस एक्सप्लोरर में जैविक खेती को स्थायी आर्थिक विकास (अगला विषय) से क्या जोड़ता है?' },
                options: [
                    { en: 'Organic farming avoids synthetic chemicals, reducing environmental damage — directly linking a rural-development lever to sustainability concerns', hi: 'जैविक खेती कृत्रिम रसायनों से बचती है, जिससे पर्यावरणीय क्षति कम होती है — यह एक ग्रामीण विकास लीवर को स्थायित्व संबंधी चिंताओं से सीधे जोड़ता है' },
                    { en: 'Organic farming always yields more than chemical farming', hi: 'जैविक खेती हमेशा रासायनिक खेती से अधिक उपज देती है' },
                    { en: 'They are unrelated topics placed next to each other by coincidence', hi: 'ये असंबंधित विषय हैं जो संयोगवश एक-दूसरे के बगल में रखे गए हैं' },
                    { en: 'Sustainable development only concerns urban areas', hi: 'स्थायी विकास केवल शहरी क्षेत्रों से संबंधित है' }
                ],
                correctIndex: 0,
                explain: { en: 'Organic farming\'s environmental sustainability (no chemical runoff) is exactly the kind of resource/environment trade-off explored in depth in the Sustainable Economic Development topic.', hi: 'जैविक खेती की पर्यावरणीय स्थिरता (कोई रासायनिक बहाव नहीं) ठीक उसी प्रकार का संसाधन/पर्यावरण व्यापार-बंद है जिसकी गहराई से पड़ताल स्थायी आर्थिक विकास विषय में होती है।' }
            },
            {
                level: 'evaluate',
                question: { en: 'A policymaker has a limited budget and must choose ONE lever to prioritise first for farmers who already have credit access but still sell at distress prices right after harvest. Which is the better choice, and why?', hi: 'एक नीति निर्माता के पास सीमित बजट है और उसे उन किसानों के लिए पहले प्राथमिकता देने हेतु एक लीवर चुनना है जिनकी ऋण तक पहुँच पहले से है पर फिर भी वे फसल कटाई के तुरंत बाद संकटपूर्ण कीमतों पर बेचते हैं। कौन-सा बेहतर विकल्प है, और क्यों?' },
                options: [
                    { en: 'Rural Marketing (storage, MSP, regulated markets) — it directly targets the stated problem, since credit is already adequate', hi: 'ग्रामीण विपणन (भंडारण, MSP, विनियमित बाजार) — यह बताई गई समस्या को सीधे लक्षित करता है, क्योंकि ऋण पहले से पर्याप्त है' },
                    { en: 'Rural Credit — more loans always solve every rural problem', hi: 'ग्रामीण ऋण — अधिक ऋण हमेशा हर ग्रामीण समस्या हल करते हैं' },
                    { en: 'Global Warming mitigation — unrelated to the stated problem but always the top priority', hi: 'वैश्विक तापन शमन — बताई गई समस्या से असंबंधित पर हमेशा शीर्ष प्राथमिकता' },
                    { en: 'None of the levers can help', hi: 'कोई भी लीवर मदद नहीं कर सकता' }
                ],
                correctIndex: 0,
                explain: { en: 'Since the stated bottleneck is distress selling at harvest (not lack of finance), storage/warehousing, MSP and regulated markets — the Rural Marketing lever — address the actual constraint; more credit would not fix a marketing/storage problem.', hi: 'चूँकि बताई गई बाधा फसल कटाई पर संकटपूर्ण बिक्री है (वित्त की कमी नहीं), भंडारण/वेयरहाउसिंग, MSP और विनियमित बाजार — ग्रामीण विपणन लीवर — वास्तविक बाधा को संबोधित करते हैं; अधिक ऋण एक विपणन/भंडारण समस्या को हल नहीं करेगा।' }
            },
            {
                level: 'evaluate',
                question: { en: 'Why might relying on Agricultural Diversification alone NOT be a sufficient rural-development strategy for a region with poor rural roads and no cold storage?', hi: 'खराब ग्रामीण सड़कों और शीत भंडारण की कमी वाले क्षेत्र के लिए केवल कृषि विविधीकरण पर निर्भर रहना पर्याप्त ग्रामीण-विकास रणनीति क्यों नहीं हो सकती?' },
                options: [
                    { en: 'New activities like dairy or horticulture still need marketing infrastructure (roads, storage) to reach buyers before spoiling — diversification alone doesn\'t fix that gap', hi: 'डेयरी या बागवानी जैसी नई गतिविधियों को भी खराब होने से पहले खरीदारों तक पहुँचने के लिए विपणन अवसंरचना (सड़कें, भंडारण) चाहिए — केवल विविधीकरण यह अंतर नहीं भरता' },
                    { en: 'Diversification automatically builds roads', hi: 'विविधीकरण स्वतः सड़कें बना देता है' },
                    { en: 'Diversification eliminates the need for any marketing at all', hi: 'विविधीकरण किसी भी विपणन की आवश्यकता को समाप्त कर देता है' },
                    { en: 'Poor infrastructure has no effect on perishable goods', hi: 'खराब अवसंरचना का नाशवान वस्तुओं पर कोई प्रभाव नहीं होता' }
                ],
                correctIndex: 0,
                explain: { en: 'Levers interact: diversifying into perishable products (dairy, horticulture) without complementary marketing infrastructure (roads, storage) can leave farmers as exposed to distress sales as before — a well-rounded strategy typically combines multiple levers.', hi: 'लीवर परस्पर क्रिया करते हैं: पूरक विपणन अवसंरचना (सड़कें, भंडारण) के बिना नाशवान उत्पादों (डेयरी, बागवानी) में विविधीकरण किसानों को पहले जितना ही संकटपूर्ण बिक्री के प्रति उजागर छोड़ सकता है — एक सुसंतुलित रणनीति सामान्यतः कई लीवरों को मिलाती है।' }
            }
        ]
    };

    QUIZ_BANK['ied-sustainable-development'] = {
        static: [
            {
                level: 'remember',
                question: { en: 'Sustainable Development is best defined as development that…', hi: 'स्थायी विकास को सबसे अच्छा इस प्रकार परिभाषित किया जाता है जो…' },
                options: [
                    { en: 'Meets the needs of the present without compromising future generations\' ability to meet their own needs', hi: 'भविष्य की पीढ़ियों की अपनी आवश्यकताओं को पूरा करने की क्षमता से समझौता किए बिना वर्तमान की आवश्यकताओं को पूरा करता है' },
                    { en: 'Maximises resource extraction today regardless of the future', hi: 'भविष्य की परवाह किए बिना आज संसाधन निष्कर्षण को अधिकतम करता है' },
                    { en: 'Only concerns industrialised countries', hi: 'केवल औद्योगीकृत देशों से संबंधित है' },
                    { en: 'Means stopping all economic growth permanently', hi: 'हमेशा के लिए सभी आर्थिक संवृद्धि को रोकने का अर्थ है' }
                ],
                correctIndex: 0,
                explain: { en: 'This is the anchor definition — growth today should not permanently deplete the resource base future generations depend on.', hi: 'यह मूल परिभाषा है — आज की संवृद्धि को उस संसाधन आधार को स्थायी रूप से समाप्त नहीं करना चाहिए जिस पर भविष्य की पीढ़ियाँ निर्भर हैं।' },
                syllabusId: 'XII-B-U7-SUSTAINABLE'
            },
            {
                level: 'remember',
                question: { en: 'Which of these is classified as a NON-renewable resource?', hi: 'इनमें से किसे अनवीकरणीय (non-renewable) संसाधन के रूप में वर्गीकृत किया जाता है?' },
                options: [
                    { en: 'Fossil fuels', hi: 'जीवाश्म ईंधन' },
                    { en: 'Forests', hi: 'वन' },
                    { en: 'Fisheries', hi: 'मत्स्य संपदा' },
                    { en: 'Groundwater (if managed sustainably)', hi: 'भूजल (यदि स्थायी रूप से प्रबंधित हो)' }
                ],
                correctIndex: 0,
                explain: { en: 'Fossil fuels are finite by definition — unlike forests, fisheries or groundwater, which can regenerate if not overused.', hi: 'जीवाश्म ईंधन परिभाषा से ही सीमित हैं — वनों, मत्स्य संपदा या भूजल के विपरीत, जो अत्यधिक उपयोग न होने पर पुनर्जनित हो सकते हैं।' },
                syllabusId: 'XII-B-U7-SUSTAINABLE'
            },
            {
                level: 'understand',
                question: { en: 'Groundwater depletion from intensive irrigation is an example of…', hi: 'गहन सिंचाई से भूजल की कमी किसका उदाहरण है…' },
                options: [
                    { en: 'The effects of development placing pressure on resources', hi: 'संसाधनों पर दबाव डालने वाले विकास के प्रभाव' },
                    { en: 'Global warming directly', hi: 'सीधे वैश्विक तापन' },
                    { en: 'A strategy for sustainability', hi: 'स्थिरता के लिए एक रणनीति' },
                    { en: 'A renewable, inexhaustible process', hi: 'एक नवीकरणीय, अक्षय प्रक्रिया' }
                ],
                correctIndex: 0,
                explain: { en: 'Rising production and consumption place direct pressure on land, water, forests and minerals — groundwater depletion from intensive irrigation is a textbook example.', hi: 'बढ़ता उत्पादन और उपभोग भूमि, जल, वनों और खनिजों पर सीधा दबाव डालता है — गहन सिंचाई से भूजल की कमी एक पाठ्यपुस्तक उदाहरण है।' },
                syllabusId: 'XII-B-U7-SUSTAINABLE'
            },
            {
                level: 'understand',
                question: { en: 'Global Warming is primarily caused by…', hi: 'वैश्विक तापन मुख्यतः किसके कारण होता है…' },
                options: [
                    { en: 'Rising greenhouse gas concentrations, mainly from burning fossil fuels', hi: 'बढ़ती ग्रीनहाउस गैस सांद्रता, मुख्यतः जीवाश्म ईंधन जलाने से' },
                    { en: 'Increased rainfall alone', hi: 'केवल बढ़ी हुई वर्षा' },
                    { en: 'A decrease in ocean levels', hi: 'महासागर स्तरों में कमी' },
                    { en: 'Excess afforestation', hi: 'अत्यधिक वनरोपण' }
                ],
                correctIndex: 0,
                explain: { en: 'Rising greenhouse gas concentrations trap more heat, raising global temperatures — with consequences like extreme weather and rising sea levels.', hi: 'बढ़ती ग्रीनहाउस गैस सांद्रता अधिक ऊष्मा को रोकती है, जिससे वैश्विक तापमान बढ़ता है — जिसके परिणाम चरम मौसम और बढ़ता समुद्र स्तर हैं।' },
                syllabusId: 'XII-B-U7-SUSTAINABLE'
            },
            {
                level: 'apply',
                question: { en: 'A village replaces firewood/dung-cake cooking fuel with LPG/CNG, and switches street lighting to solar. Which sustainability strategy does this illustrate?', hi: 'एक गाँव खाना पकाने के ईंधन के रूप में लकड़ी/उपले को LPG/CNG से बदलता है, और सड़क की रोशनी को सौर ऊर्जा में बदलता है। यह किस स्थिरता रणनीति को दर्शाता है?' },
                options: [
                    { en: 'Shifting to renewable/cleaner energy sources', hi: 'नवीकरणीय/स्वच्छ ऊर्जा स्रोतों की ओर स्थानांतरण' },
                    { en: 'Increasing fossil fuel dependence', hi: 'जीवाश्म ईंधन पर निर्भरता बढ़ाना' },
                    { en: 'Deforestation for urban expansion', hi: 'शहरी विस्तार के लिए वनोन्मूलन' },
                    { en: 'Ignoring environmental costs entirely', hi: 'पर्यावरणीय लागतों को पूरी तरह अनदेखा करना' }
                ],
                correctIndex: 0,
                explain: { en: 'Substituting cleaner fuels (LPG/CNG) for biomass and shifting to solar energy are named strategies for sustainability — reducing both resource depletion and pollution.', hi: 'जैव ईंधन के बदले स्वच्छ ईंधन (LPG/CNG) और सौर ऊर्जा की ओर स्थानांतरण स्थिरता के लिए नामित रणनीतियाँ हैं — जो संसाधन क्षय और प्रदूषण दोनों को कम करती हैं।' },
                syllabusId: 'XII-B-U7-SUSTAINABLE'
            },
            {
                level: 'apply',
                question: { en: 'The Chipko movement, where villagers hugged trees to prevent logging, is an example of which sustainability strategy?', hi: 'चिपको आंदोलन, जिसमें ग्रामीणों ने कटाई रोकने के लिए पेड़ों को गले लगाया, किस स्थिरता रणनीति का उदाहरण है?' },
                options: [
                    { en: 'Afforestation and community forest protection', hi: 'वनरोपण और सामुदायिक वन संरक्षण' },
                    { en: 'Fossil fuel expansion', hi: 'जीवाश्म ईंधन विस्तार' },
                    { en: 'Import substitution', hi: 'आयात प्रतिस्थापन' },
                    { en: 'Demonetisation', hi: 'विमुद्रीकरण' }
                ],
                correctIndex: 0,
                explain: { en: 'Chipko is NCERT\'s named example of community forest protection — a grassroots strategy to prevent deforestation.', hi: 'चिपको सामुदायिक वन संरक्षण का NCERT का नामित उदाहरण है — वनोन्मूलन रोकने की एक जमीनी रणनीति।' },
                syllabusId: 'XII-B-U7-SUSTAINABLE'
            },
            {
                level: 'analyse',
                question: { en: 'Why is global warming described as "a problem no single country can solve alone"?', hi: 'वैश्विक तापन को "एक समस्या जिसे कोई एक देश अकेले हल नहीं कर सकता" के रूप में क्यों वर्णित किया जाता है?' },
                options: [
                    { en: 'Greenhouse gases mix in the shared atmosphere, so emissions anywhere affect the climate everywhere — a genuinely global externality', hi: 'ग्रीनहाउस गैसें साझा वायुमंडल में मिलती हैं, इसलिए कहीं भी उत्सर्जन हर जगह जलवायु को प्रभावित करता है — एक वास्तविक वैश्विक बाह्यता' },
                    { en: 'Every country experiences global warming identically and independently', hi: 'हर देश वैश्विक तापन को समान रूप से और स्वतंत्र रूप से अनुभव करता है' },
                    { en: 'Only one country in the world emits greenhouse gases', hi: 'दुनिया में केवल एक देश ग्रीनहाउस गैसें उत्सर्जित करता है' },
                    { en: 'Global warming has no cross-border effects', hi: 'वैश्विक तापन का कोई सीमा-पार प्रभाव नहीं है' }
                ],
                correctIndex: 0,
                explain: { en: 'Because emissions mix globally regardless of source, one country\'s development choices impose costs on all others — requiring coordinated, not unilateral, action.', hi: 'क्योंकि स्रोत चाहे जो हो, उत्सर्जन वैश्विक रूप से मिलते हैं, एक देश की विकास पसंद अन्य सभी पर लागत थोपती है — जिसके लिए समन्वित, न कि एकतरफा, कार्रवाई आवश्यक है।' }
            },
            {
                level: 'analyse',
                question: { en: 'Why does the explorer note that "environmental damage is often a cost borne by people who did not benefit from the activity that caused it"?', hi: 'एक्सप्लोरर यह क्यों नोट करता है कि "पर्यावरणीय क्षति अक्सर उन लोगों द्वारा वहन की जाने वाली लागत है जिन्हें उस गतिविधि से लाभ नहीं हुआ जिसने इसे उत्पन्न किया"?' },
                options: [
                    { en: 'It highlights an equity dimension — those downstream/downwind of pollution often gain nothing from the polluting activity itself', hi: 'यह एक समता आयाम को उजागर करता है — प्रदूषण के डाउनस्ट्रीम/डाउनविंड लोगों को अक्सर प्रदूषणकारी गतिविधि से स्वयं कोई लाभ नहीं मिलता' },
                    { en: 'It means pollution always benefits everyone equally', hi: 'इसका अर्थ है प्रदूषण हमेशा सभी को समान रूप से लाभान्वित करता है' },
                    { en: 'It implies environmental costs never matter economically', hi: 'इसका अर्थ है पर्यावरणीय लागतें आर्थिक रूप से कभी मायने नहीं रखतीं' },
                    { en: 'Only the polluter ever suffers the consequences', hi: 'केवल प्रदूषणकर्ता को ही परिणाम भुगतने पड़ते हैं' }
                ],
                correctIndex: 0,
                explain: { en: 'This is an equity point the syllabus expects: the party enjoying an activity\'s benefits and the party bearing its environmental cost are often different people — a classic externality problem.', hi: 'यह पाठ्यक्रम द्वारा अपेक्षित एक समता बिंदु है: किसी गतिविधि के लाभ का आनंद लेने वाला पक्ष और उसकी पर्यावरणीय लागत वहन करने वाला पक्ष अक्सर अलग-अलग लोग होते हैं — एक क्लासिक बाह्यता समस्या।' }
            },
            {
                level: 'evaluate',
                question: { en: 'A region has two options: (A) grow using only fossil fuels for cheaper short-run energy, or (B) invest more upfront in renewable energy. Evaluate which choice better serves sustainable development, and why.', hi: 'एक क्षेत्र के पास दो विकल्प हैं: (A) सस्ती अल्पकालिक ऊर्जा के लिए केवल जीवाश्म ईंधन का उपयोग करके विकास करना, या (B) नवीकरणीय ऊर्जा में अधिक अग्रिम निवेश करना। मूल्यांकन करें कि कौन-सा विकल्प स्थायी विकास की बेहतर सेवा करता है, और क्यों।' },
                options: [
                    { en: 'Option B — a higher upfront cost avoids compounding fossil-fuel depletion and emissions, protecting future generations\' resource base as the definition requires', hi: 'विकल्प B — एक उच्च अग्रिम लागत जीवाश्म ईंधन क्षय और उत्सर्जन के संचय से बचाती है, परिभाषा की आवश्यकतानुसार भविष्य की पीढ़ियों के संसाधन आधार की रक्षा करती है' },
                    { en: 'Option A — cheaper short-run energy always means better long-run development', hi: 'विकल्प A — सस्ती अल्पकालिक ऊर्जा का अर्थ हमेशा बेहतर दीर्घकालिक विकास होता है' },
                    { en: 'Both options are identical in their effect on future generations', hi: 'दोनों विकल्पों का भविष्य की पीढ़ियों पर प्रभाव समान है' },
                    { en: 'Sustainability considerations do not apply to energy choices', hi: 'स्थिरता संबंधी विचार ऊर्जा विकल्पों पर लागू नहीं होते' }
                ],
                correctIndex: 0,
                explain: { en: 'The core definition of sustainable development is exactly this trade-off: accepting some near-term cost (B\'s higher upfront investment) to avoid permanently depleting the resource base and emissions burden future generations inherit.', hi: 'स्थायी विकास की मूल परिभाषा ठीक यही व्यापार-बंद है: कुछ निकट-अवधि लागत (B का उच्च अग्रिम निवेश) स्वीकार करना ताकि संसाधन आधार को स्थायी रूप से समाप्त होने और भविष्य की पीढ़ियों को विरासत में मिलने वाले उत्सर्जन बोझ से बचा जा सके।' }
            },
            {
                level: 'evaluate',
                question: { en: 'A strategy is proposed that shifts to renewable energy AND simultaneously reduces greenhouse gas emissions. Why does the explorer highlight this as a particularly effective strategy compared to single-purpose fixes?', hi: 'एक ऐसी रणनीति प्रस्तावित है जो नवीकरणीय ऊर्जा की ओर स्थानांतरित करती है और साथ ही ग्रीनहाउस गैस उत्सर्जन को कम करती है। एक्सप्लोरर इसे एकल-उद्देश्यीय समाधानों की तुलना में विशेष रूप से प्रभावी रणनीति के रूप में क्यों उजागर करता है?' },
                options: [
                    { en: 'It addresses BOTH resource depletion (moving away from finite fossil fuels) AND global warming (cutting emissions) at once, rather than trading one problem off against the other', hi: 'यह संसाधन क्षय (सीमित जीवाश्म ईंधन से दूर जाना) और वैश्विक तापन (उत्सर्जन में कटौती) दोनों को एक साथ संबोधित करती है, न कि एक समस्या को दूसरी के बदले में' },
                    { en: 'It only helps resource depletion, not global warming at all', hi: 'यह केवल संसाधन क्षय में मदद करती है, वैश्विक तापन में बिल्कुल नहीं' },
                    { en: 'It has no effect on either problem', hi: 'इसका किसी भी समस्या पर कोई प्रभाव नहीं है' },
                    { en: 'Single-purpose fixes are always more effective', hi: 'एकल-उद्देश्यीय समाधान हमेशा अधिक प्रभावी होते हैं' }
                ],
                correctIndex: 0,
                explain: { en: 'Renewable energy is a rare "double win": it reduces dependence on a depletable resource (fossil fuels) while also cutting the greenhouse gas emissions that drive global warming — two problems addressed by one strategy.', hi: 'नवीकरणीय ऊर्जा एक दुर्लभ "दोहरी जीत" है: यह एक क्षयशील संसाधन (जीवाश्म ईंधन) पर निर्भरता कम करती है और साथ ही उन ग्रीनहाउस गैस उत्सर्जनों में भी कटौती करती है जो वैश्विक तापन को बढ़ाते हैं — एक रणनीति से दो समस्याएँ संबोधित।' }
            }
        ]
    };

    QUIZ_BANK['ied-comparison-neighbours'] = {
        static: [
            {
                level: 'remember',
                question: { en: 'The Human Development Index (HDI) combines which three dimensions?', hi: 'मानव विकास सूचकांक (HDI) किन तीन आयामों को जोड़ता है?' },
                options: [
                    { en: 'Income, education and life expectancy', hi: 'आय, शिक्षा और जीवन प्रत्याशा' },
                    { en: 'Only GDP growth rate', hi: 'केवल GDP संवृद्धि दर' },
                    { en: 'Population and area alone', hi: 'केवल जनसंख्या और क्षेत्रफल' },
                    { en: 'Military spending and exports', hi: 'सैन्य व्यय और निर्यात' }
                ],
                correctIndex: 0,
                explain: { en: 'HDI combines income, education and life-expectancy indicators into a single 0–1 score, giving a broader picture than income alone.', hi: 'HDI आय, शिक्षा और जीवन प्रत्याशा संकेतकों को एक ही 0-1 स्कोर में जोड़ता है, जो अकेले आय से व्यापक तस्वीर देता है।' },
                syllabusId: 'XII-B-U8-COMPARISON'
            },
            {
                level: 'understand',
                question: { en: 'Which development strategy is China generally associated with, compared to India\'s more gradual reform path?', hi: 'भारत के अधिक क्रमिक सुधार पथ की तुलना में चीन आम तौर पर किस विकास रणनीति से जुड़ा है?' },
                options: [
                    { en: 'State-led, export-oriented industrialisation, moving earliest and fastest', hi: 'राज्य-नेतृत्व वाला, निर्यात-उन्मुख औद्योगीकरण, जो सबसे पहले और सबसे तेज़ी से आगे बढ़ा' },
                    { en: 'A purely agricultural economy with no industry', hi: 'बिना किसी उद्योग के पूर्णतः कृषि अर्थव्यवस्था' },
                    { en: 'Complete economic isolation from world trade', hi: 'विश्व व्यापार से पूर्ण आर्थिक अलगाव' },
                    { en: 'Reliance mainly on remittances', hi: 'मुख्यतः प्रेषण पर निर्भरता' }
                ],
                correctIndex: 0,
                explain: { en: 'China\'s state-led, export-oriented industrialisation moved earliest and fastest among the three, contrasted with India\'s democratic, gradual reform path and Pakistan\'s more volatile growth.', hi: 'चीन का राज्य-नेतृत्व वाला, निर्यात-उन्मुख औद्योगीकरण तीनों में सबसे पहले और सबसे तेज़ी से आगे बढ़ा, जो भारत के लोकतांत्रिक, क्रमिक सुधार पथ और पाकिस्तान की अधिक अस्थिर संवृद्धि के विपरीत है।' },
                syllabusId: 'XII-B-U8-COMPARISON'
            },
            {
                level: 'analyse',
                question: { en: 'If a country shows fast GDP growth but a comparatively low HDI relative to a slower-growing neighbour, what does this suggest?', hi: 'यदि एक देश तेज़ GDP संवृद्धि दिखाता है परंतु धीमी गति से बढ़ते पड़ोसी की तुलना में अपेक्षाकृत निम्न HDI रखता है, तो यह क्या सुझाता है?' },
                options: [
                    { en: 'Fast growth has not fully translated into health, education and income gains for the population', hi: 'तेज़ संवृद्धि जनसंख्या के लिए स्वास्थ्य, शिक्षा और आय लाभ में पूरी तरह परिवर्तित नहीं हुई है' },
                    { en: 'HDI and GDP growth always move in perfect lockstep', hi: 'HDI और GDP संवृद्धि हमेशा पूर्ण तालमेल में चलते हैं' },
                    { en: 'The country\'s population must be shrinking', hi: 'देश की जनसंख्या अवश्य घट रही होगी' },
                    { en: 'HDI has nothing to do with growth at all', hi: 'HDI का संवृद्धि से कोई लेना-देना ही नहीं है' }
                ],
                correctIndex: 0,
                explain: { en: 'Fast growth and high human development do not automatically move together — growth has to translate into health, education and income gains to raise HDI, exactly the interpretation this Data Lab computes.', hi: 'तेज़ संवृद्धि और उच्च मानव विकास स्वतः साथ-साथ नहीं चलते — HDI बढ़ाने के लिए संवृद्धि को स्वास्थ्य, शिक्षा और आय लाभ में परिवर्तित होना चाहिए, ठीक वही व्याख्या जो यह डेटा लैब गणना करती है।' }
            }
        ],
        applyTemplates: [
            {
                level: 'apply',
                build(rows, metrics) {
                    if (!Array.isArray(rows) || rows.length === 0) return null;
                    const byHDI = [...rows].sort((a, b) => b.hdi - a.hdi);
                    const top = byHDI[0];
                    if (!top || typeof top.hdi !== 'number') return null;
                    const options = quizShuffle(rows.map(r => ({ en: r.country, hi: r.country }))).slice(0, Math.min(4, rows.length));
                    if (!options.some(o => o.en === top.country)) options[0] = { en: top.country, hi: top.country };
                    const correctIndex = options.findIndex(o => o.en === top.country);
                    return {
                        question: { en: 'For the country data currently shown in the table, which country has the HIGHEST HDI?', hi: 'तालिका में वर्तमान में दिखाए गए देश डेटा के लिए, किस देश का HDI सबसे अधिक है?' },
                        options,
                        correctIndex,
                        explain: { en: `Read the "Highest HDI" row in Live Readings/Stats: ${top.country} (${Math.round(top.hdi * 100) / 100}).`, hi: `Live Readings/Stats में "Highest HDI" पंक्ति पढ़ें: ${top.country} (${Math.round(top.hdi * 100) / 100})।` }
                    };
                }
            },
            {
                level: 'apply',
                build(rows, metrics) {
                    if (!Array.isArray(rows) || rows.length === 0) return null;
                    const byGrowth = [...rows].sort((a, b) => b.growth - a.growth);
                    const top = byGrowth[0];
                    if (!top || typeof top.growth !== 'number') return null;
                    const options = quizShuffle(rows.map(r => ({ en: r.country, hi: r.country }))).slice(0, Math.min(4, rows.length));
                    if (!options.some(o => o.en === top.country)) options[0] = { en: top.country, hi: top.country };
                    const correctIndex = options.findIndex(o => o.en === top.country);
                    return {
                        question: { en: 'For the country data currently shown in the table, which country has the FASTEST GDP Growth Rate?', hi: 'तालिका में वर्तमान में दिखाए गए देश डेटा के लिए, किस देश की GDP संवृद्धि दर सबसे तेज़ है?' },
                        options,
                        correctIndex,
                        explain: { en: `Read the "Fastest GDP Growth" row in Live Readings/Stats: ${top.country} (${Math.round(top.growth * 10) / 10}%).`, hi: `Live Readings/Stats में "Fastest GDP Growth" पंक्ति पढ़ें: ${top.country} (${Math.round(top.growth * 10) / 10}%)।` }
                    };
                }
            }
        ]
    };
}
