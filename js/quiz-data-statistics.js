// Quiz banks for the 4 sims defined in js/simulations_statistics_datalab.js.
// See js/quiz-engine.js's header for the QUIZ_BANK data contract.

if (typeof QUIZ_BANK !== 'undefined') {
    QUIZ_BANK['stats-central-tendency'] = {
        static: [
            {
                level: 'remember',
                question: { en: 'The Median of a dataset is…', hi: 'किसी डेटासेट की माध्यिका (Median) है…' },
                options: [
                    { en: 'The middle value when the data is sorted', hi: 'डेटा को क्रमबद्ध करने पर मध्य मान' },
                    { en: 'The sum of all values divided by n', hi: 'सभी मानों का योग n से विभाजित' },
                    { en: 'The most frequently occurring value', hi: 'सबसे अधिक बार आने वाला मान' },
                    { en: 'The largest value in the dataset', hi: 'डेटासेट में सबसे बड़ा मान' }
                ],
                correctIndex: 0,
                explain: { en: 'Sort the data; the Median is the middle value (or the average of the two middle values if n is even).', hi: 'डेटा को क्रमबद्ध करें; माध्यिका मध्य मान है (या यदि n सम है तो दो मध्य मानों का औसत)।' },
                syllabusId: 'XI-A-U3-CENTRAL-TENDENCY'
            },
            {
                level: 'understand',
                question: { en: 'Why does the Median resist outliers better than the Mean?', hi: 'माध्यिका आउटलायर्स का बेहतर प्रतिरोध माध्य की तुलना में क्यों करती है?' },
                options: [
                    { en: 'It only depends on the middle position, not the exact size of extreme values', hi: 'यह केवल मध्य स्थिति पर निर्भर करती है, चरम मानों के सटीक आकार पर नहीं' },
                    { en: 'It ignores half the data entirely', hi: 'यह आधे डेटा को पूरी तरह नज़रअंदाज़ करती है' },
                    { en: 'The Mean is always larger than the Median', hi: 'माध्य हमेशा माध्यिका से बड़ा होता है' },
                    { en: 'Median cannot be calculated with outliers present', hi: 'आउटलायर्स की उपस्थिति में माध्यिका की गणना नहीं की जा सकती' }
                ],
                correctIndex: 0,
                explain: { en: 'The Mean uses every value\'s exact size (an extreme value pulls it hard); the Median only cares about ORDER, so one huge value barely moves it.', hi: 'माध्य हर मान के सटीक आकार का उपयोग करता है (एक चरम मान इसे ज़ोर से खींचता है); माध्यिका केवल क्रम की परवाह करती है, इसलिए एक बड़ा मान इसे मुश्किल से हिलाता है।' },
                syllabusId: 'XI-A-U3-CENTRAL-TENDENCY'
            },
            {
                level: 'analyse',
                question: { en: 'If Mean > Median > Mode for a dataset, the distribution is described as…', hi: 'यदि किसी डेटासेट के लिए माध्य > माध्यिका > बहुलक है, तो वितरण का वर्णन इस प्रकार किया जाता है…' },
                options: [
                    { en: 'Positively skewed (a few high values pull the mean up)', hi: 'धनात्मक विषम (कुछ उच्च मान माध्य को ऊपर खींचते हैं)' },
                    { en: 'Negatively skewed', hi: 'ऋणात्मक विषम' },
                    { en: 'Perfectly symmetric', hi: 'पूर्णतः सममित' },
                    { en: 'Impossible to occur', hi: 'होना असंभव है' }
                ],
                correctIndex: 0,
                explain: { en: 'When a few unusually high values pull the mean above the median (which is above the mode), the distribution has a long right tail — positive skew.', hi: 'जब कुछ असामान्य रूप से उच्च मान माध्य को माध्यिका से ऊपर खींचते हैं (जो बहुलक से ऊपर है), तो वितरण की एक लंबी दाईं पूँछ होती है — धनात्मक विषमता।' },
                syllabusId: 'XI-A-U3-CENTRAL-TENDENCY'
            },
            {
                level: 'evaluate',
                question: { en: 'A dataset has every value appearing exactly once (no repeats). Which measure of central tendency is LEAST useful here?', hi: 'एक डेटासेट में हर मान बिल्कुल एक बार आता है (कोई दोहराव नहीं)। यहाँ केंद्रीय प्रवृत्ति का कौन-सा माप सबसे कम उपयोगी है?' },
                options: [
                    { en: 'Mode — with no repeats, it doesn\'t summarise the data meaningfully', hi: 'बहुलक — बिना दोहराव के, यह डेटा को सार्थक रूप से संक्षेप नहीं करता' },
                    { en: 'Mean', hi: 'माध्य' },
                    { en: 'Median', hi: 'माध्यिका' },
                    { en: 'All three are equally useless', hi: 'तीनों समान रूप से बेकार हैं' }
                ],
                correctIndex: 0,
                explain: { en: 'With every value unique, "the most common value" is not a meaningful concept — Mean or Median are much more informative here.', hi: 'हर मान अद्वितीय होने पर, "सबसे सामान्य मान" एक सार्थक अवधारणा नहीं है — माध्य या माध्यिका यहाँ बहुत अधिक जानकारीपूर्ण हैं।' }
            }
        ],
        applyTemplates: [
            {
                level: 'apply',
                build(rows, metrics) {
                    if (!metrics || typeof metrics.mean !== 'number') return null;
                    const correct = Math.round(metrics.mean * 100) / 100;
                    const options = quizNumericOptions(correct, [4, -4, 8], { round: 2 });
                    return {
                        question: { en: 'For the marks currently shown in the Data Lab table, what is the Mean (x̄)?', hi: 'डेटा लैब तालिका में वर्तमान में दिखाए गए अंकों के लिए, माध्य (x̄) क्या है?' },
                        options,
                        correctIndex: 0,
                        explain: { en: `Mean = Σx / n, shown directly in Live Readings: ${correct}.`, hi: `माध्य = Σx / n, Live Readings में सीधे दिखाया गया: ${correct}।` }
                    };
                }
            },
            {
                level: 'apply',
                build(rows, metrics) {
                    if (!metrics || typeof metrics.median !== 'number') return null;
                    const correct = Math.round(metrics.median * 100) / 100;
                    const options = quizNumericOptions(correct, [4, -4, 8], { round: 2 });
                    return {
                        question: { en: 'For the marks currently shown in the Data Lab table, what is the Median?', hi: 'डेटा लैब तालिका में वर्तमान में दिखाए गए अंकों के लिए, माध्यिका क्या है?' },
                        options,
                        correctIndex: 0,
                        explain: { en: `Sort the values and take the middle one — shown directly in Live Readings: ${correct}.`, hi: `मानों को क्रमबद्ध करें और मध्य वाला लें — Live Readings में सीधे दिखाया गया: ${correct}।` }
                    };
                }
            }
        ]
    };

    QUIZ_BANK['stats-data-organisation'] = {
        static: [
            {
                level: 'remember',
                question: { en: 'Grouping raw data into class intervals with counts is called…', hi: 'कच्चे डेटा को गणना के साथ वर्ग अंतरालों में समूहित करना कहलाता है…' },
                options: [
                    { en: 'A frequency distribution', hi: 'एक बारंबारता बंटन (frequency distribution)' },
                    { en: 'A scatter diagram', hi: 'एक प्रकीर्णन आरेख' },
                    { en: 'A correlation matrix', hi: 'एक सहसंबंध आव्यूह' },
                    { en: 'A pie chart', hi: 'एक पाई चार्ट' }
                ],
                correctIndex: 0,
                explain: { en: 'A frequency distribution organises raw data into class intervals, each with a count (frequency) of observations.', hi: 'एक बारंबारता बंटन कच्चे डेटा को वर्ग अंतरालों में व्यवस्थित करता है, प्रत्येक में अवलोकनों की गणना (बारंबारता) होती है।' },
                syllabusId: 'XI-A-U2-ORG'
            },
            {
                level: 'understand',
                question: { en: 'A Histogram differs from a Bar Diagram mainly because…', hi: 'हिस्टोग्राम एक बार आरेख से मुख्यतः किस कारण भिन्न है…' },
                options: [
                    { en: 'A histogram represents continuous class intervals with no gaps between bars', hi: 'हिस्टोग्राम बारों के बीच बिना अंतराल के निरंतर वर्ग अंतरालों का प्रतिनिधित्व करता है' },
                    { en: 'A histogram is always a single bar', hi: 'हिस्टोग्राम हमेशा एक ही बार होता है' },
                    { en: 'A histogram cannot show frequency', hi: 'हिस्टोग्राम बारंबारता नहीं दिखा सकता' },
                    { en: 'There is no difference at all', hi: 'इसमें बिल्कुल भी कोई अंतर नहीं है' }
                ],
                correctIndex: 0,
                explain: { en: 'Because class intervals are continuous, histogram bars touch each other (no gaps), unlike a bar diagram for discrete categories.', hi: 'चूँकि वर्ग अंतराल निरंतर होते हैं, हिस्टोग्राम की बारें एक-दूसरे को छूती हैं (कोई अंतराल नहीं), जबकि असतत श्रेणियों के लिए बार आरेख में ऐसा नहीं होता।' },
                syllabusId: 'XI-A-U2-PRESENT'
            },
            {
                level: 'analyse',
                question: { en: 'An Ogive ("less than" cumulative frequency curve) is steepest exactly where…', hi: 'एक तोरण वक्र (ओजिव, "से कम" संचयी बारंबारता वक्र) ठीक वहाँ सबसे तीव्र होता है जहाँ…' },
                options: [
                    { en: 'The class with the highest frequency (the modal class) is', hi: 'सबसे अधिक बारंबारता वाला वर्ग (बहुलक वर्ग) है' },
                    { en: 'The class with the lowest frequency is', hi: 'सबसे कम बारंबारता वाला वर्ग है' },
                    { en: 'The data begins', hi: 'डेटा शुरू होता है' },
                    { en: 'It is always a flat, straight line', hi: 'यह हमेशा एक सपाट, सीधी रेखा होती है' }
                ],
                correctIndex: 0,
                explain: { en: 'Cumulative frequency climbs fastest where the most observations are added at once — the modal class.', hi: 'संचयी बारंबारता वहाँ सबसे तेज़ी से चढ़ती है जहाँ एक साथ सबसे अधिक अवलोकन जुड़ते हैं — बहुलक वर्ग।' }
            },
            {
                level: 'evaluate',
                question: { en: 'A student sets Class Width to 1 by making every observation identical. What problem does this illustrate?', hi: 'एक छात्र हर अवलोकन को समान बनाकर वर्ग चौड़ाई को 1 पर सेट करता है। यह किस समस्या को दर्शाता है?' },
                options: [
                    { en: 'A degenerate dataset (zero range) needs a safeguard so class-width calculation doesn\'t break', hi: 'एक अपभ्रष्ट डेटासेट (शून्य रेंज) को एक सुरक्षा उपाय की ज़रूरत है ताकि वर्ग-चौड़ाई गणना न टूटे' },
                    { en: 'This is always the ideal way to organise data', hi: 'यह डेटा व्यवस्थित करने का हमेशा आदर्श तरीका है' },
                    { en: 'Frequency distributions require at least 3 classes', hi: 'बारंबारता बंटन के लिए कम से कम 3 वर्गों की आवश्यकता है' },
                    { en: 'No real dataset could ever have this property', hi: 'किसी वास्तविक डेटासेट में यह गुण कभी नहीं हो सकता' }
                ],
                correctIndex: 0,
                explain: { en: 'With Range=0, naive class-width calculation (Range/Classes) would divide by zero — this lab guards against it by defaulting to a class width of 1 in that edge case.', hi: 'रेंज=0 के साथ, सरल वर्ग-चौड़ाई गणना (रेंज/वर्ग) शून्य से विभाजन करेगी — यह लैब इस किनारे की स्थिति में वर्ग चौड़ाई को 1 पर डिफ़ॉल्ट करके इससे बचाव करता है।' }
            }
        ],
        applyTemplates: [
            {
                level: 'apply',
                build(rows, metrics) {
                    if (!metrics || typeof metrics.modalClassIndex !== 'number' || typeof metrics.numClasses !== 'number') return null;
                    const correct = metrics.modalClassIndex + 1;
                    const distractorOffsets = [1, -1, 2].filter(d => correct + d >= 1 && correct + d <= metrics.numClasses);
                    while (distractorOffsets.length < 3) distractorOffsets.push(distractorOffsets.length + 2);
                    const options = quizNumericOptions(correct, distractorOffsets.slice(0, 3), { round: 0 });
                    return {
                        question: { en: `For the current raw data, which class interval (numbered 1 to ${metrics.numClasses}, left to right) is the Modal Class?`, hi: `वर्तमान कच्चे डेटा के लिए, कौन-सा वर्ग अंतराल (1 से ${metrics.numClasses} तक क्रमांकित, बाएँ से दाएँ) बहुलक वर्ग है?` },
                        options,
                        correctIndex: 0,
                        explain: { en: `Read the "Modal Class" row in Live Readings and count its position among the ${metrics.numClasses} classes: #${correct}.`, hi: `Live Readings में "Modal Class" पंक्ति पढ़ें और ${metrics.numClasses} वर्गों में इसकी स्थिति गिनें: #${correct}।` }
                    };
                }
            }
        ]
    };

    QUIZ_BANK['stats-data-presentation'] = {
        static: [
            {
                level: 'remember',
                question: { en: 'A Pie Diagram is best suited for showing…', hi: 'एक पाई आरेख किसे दिखाने के लिए सबसे उपयुक्त है…' },
                options: [
                    { en: "Each category's share of a total", hi: 'कुल का प्रत्येक श्रेणी का हिस्सा' },
                    { en: 'Change over many years precisely', hi: 'कई वर्षों में सटीक परिवर्तन' },
                    { en: 'Correlation between two variables', hi: 'दो चरों के बीच सहसंबंध' },
                    { en: 'Central tendency', hi: 'केंद्रीय प्रवृत्ति' }
                ],
                correctIndex: 0,
                explain: { en: 'A pie chart divides a circle proportionally, making each slice\'s SHARE of the whole immediately visible.', hi: 'एक पाई चार्ट एक वृत्त को आनुपातिक रूप से विभाजित करता है, जिससे प्रत्येक टुकड़े का पूरे में हिस्सा तुरंत दिखाई देता है।' },
                syllabusId: 'XI-A-U2-PRESENT'
            },
            {
                level: 'understand',
                question: { en: 'A Bar Diagram is generally better than a Pie Diagram for…', hi: 'एक बार आरेख सामान्यतः एक पाई आरेख से किसके लिए बेहतर है…' },
                options: [
                    { en: 'Comparing absolute values across categories at a glance', hi: 'एक नज़र में श्रेणियों में पूर्ण मानों की तुलना' },
                    { en: 'Showing percentage shares only', hi: 'केवल प्रतिशत हिस्से दिखाने के लिए' },
                    { en: 'Hiding the underlying data', hi: 'अंतर्निहित डेटा छिपाने के लिए' },
                    { en: 'Removing the need for a table', hi: 'तालिका की आवश्यकता को समाप्त करने के लिए' }
                ],
                correctIndex: 0,
                explain: { en: 'Bar height makes absolute comparison across categories easy to read directly, which a pie chart\'s angles don\'t do as precisely.', hi: 'बार की ऊँचाई श्रेणियों में पूर्ण तुलना को सीधे पढ़ना आसान बनाती है, जो एक पाई चार्ट के कोण उतनी सटीकता से नहीं करते।' },
                syllabusId: 'XI-A-U2-PRESENT'
            },
            {
                level: 'analyse',
                question: { en: 'If one category\'s Value is increased while all others stay fixed, what happens to that category\'s Share (%)?', hi: 'यदि एक श्रेणी का मान बढ़ाया जाता है जबकि बाकी सभी स्थिर रहती हैं, तो उस श्रेणी की हिस्सेदारी (%) का क्या होता है?' },
                options: [
                    { en: 'It rises, since the Total also rises but this category grows faster relative to it', hi: 'यह बढ़ती है, क्योंकि कुल भी बढ़ता है पर यह श्रेणी उसके सापेक्ष तेज़ी से बढ़ती है' },
                    { en: 'It always falls', hi: 'यह हमेशा घटती है' },
                    { en: 'It never changes', hi: 'यह कभी नहीं बदलती' },
                    { en: 'It becomes negative', hi: 'यह ऋणात्मक हो जाती है' }
                ],
                correctIndex: 0,
                explain: { en: 'Share = Category Value / Total × 100 — raising the numerator (while the denominator rises by the same amount) increases the ratio.', hi: 'हिस्सा = श्रेणी मान / कुल × 100 — अंश को बढ़ाने पर (जबकि हर उतनी ही मात्रा से बढ़ता है) अनुपात बढ़ जाता है।' }
            },
            {
                level: 'evaluate',
                question: { en: 'Why does this lab draw the Bar and Pie diagram from ONE shared table instead of two separate datasets?', hi: 'यह लैब दो अलग डेटासेट के बजाय एक साझा तालिका से बार और पाई आरेख क्यों बनाता है?' },
                options: [
                    { en: 'To show they are two different VIEWS of the same underlying data, not two unrelated facts', hi: 'यह दिखाने के लिए कि वे एक ही अंतर्निहित डेटा के दो अलग-अलग दृश्य हैं, दो असंबंधित तथ्य नहीं' },
                    { en: 'Because Bar and Pie diagrams require completely different numbers', hi: 'क्योंकि बार और पाई आरेख को पूरी तरह से भिन्न संख्याओं की आवश्यकता होती है' },
                    { en: 'It is a limitation with no pedagogical purpose', hi: 'यह बिना किसी शैक्षणिक उद्देश्य के एक सीमा है' },
                    { en: 'Pie diagrams cannot use real data', hi: 'पाई आरेख वास्तविक डेटा का उपयोग नहीं कर सकते' }
                ],
                correctIndex: 0,
                explain: { en: 'The syllabus point is that tabulation and diagrammatic presentation are different ways of PRESENTING the same data — sharing one table makes that visible.', hi: 'पाठ्यक्रम का बिंदु यह है कि सारणीयन और आरेखीय प्रस्तुति एक ही डेटा को प्रस्तुत करने के भिन्न तरीके हैं — एक तालिका साझा करना इसे दृश्यमान बनाता है।' }
            }
        ],
        applyTemplates: [
            {
                level: 'apply',
                build(rows, metrics) {
                    if (!metrics || typeof metrics.largestShare !== 'number') return null;
                    const correct = Math.round(metrics.largestShare * 10) / 10;
                    const options = quizNumericOptions(correct, [8, -8, 15], { round: 1, suffix: '%' });
                    return {
                        question: { en: 'For the category data currently shown, what is the largest category\'s share of the total?', hi: 'वर्तमान में दिखाए गए श्रेणी डेटा के लिए, सबसे बड़ी श्रेणी का कुल में हिस्सा क्या है?' },
                        options,
                        correctIndex: 0,
                        explain: { en: `Read the "Largest Category" row in Live Readings: ${correct}%.`, hi: `Live Readings में "Largest Category" पंक्ति पढ़ें: ${correct}%।` }
                    };
                }
            }
        ]
    };

    QUIZ_BANK['stats-data-collection'] = {
        static: [
            {
                level: 'remember',
                question: { en: 'Primary data is…', hi: 'प्राथमिक डेटा है…' },
                options: [
                    { en: 'Collected first-hand, directly for the investigator\'s own purpose', hi: 'अन्वेषक के अपने उद्देश्य के लिए सीधे प्रथम-हस्त एकत्र किया गया' },
                    { en: 'Always taken from a government report', hi: 'हमेशा एक सरकारी रिपोर्ट से लिया गया' },
                    { en: 'Never numerical', hi: 'कभी भी संख्यात्मक नहीं' },
                    { en: 'The same thing as secondary data', hi: 'द्वितीयक डेटा के समान ही' }
                ],
                correctIndex: 0,
                explain: { en: 'Primary data is collected directly by the investigator — e.g. a survey they conduct themselves.', hi: 'प्राथमिक डेटा अन्वेषक द्वारा सीधे एकत्र किया जाता है — जैसे एक सर्वेक्षण जो वे स्वयं करते हैं।' },
                syllabusId: 'XI-A-U2-COLLECTION'
            },
            {
                level: 'remember',
                question: { en: 'Secondary data is…', hi: 'द्वितीयक डेटा है…' },
                options: [
                    { en: 'Data already collected by someone else for a different purpose, and reused', hi: 'पहले से किसी और के द्वारा किसी अन्य उद्देश्य के लिए एकत्र किया गया डेटा, जिसका पुनः उपयोग किया जाता है' },
                    { en: 'Always more accurate than primary data', hi: 'हमेशा प्राथमिक डेटा से अधिक सटीक' },
                    { en: 'Collected directly by the researcher', hi: 'शोधकर्ता द्वारा सीधे एकत्र किया गया' },
                    { en: 'Never published anywhere', hi: 'कहीं भी प्रकाशित नहीं होता' }
                ],
                correctIndex: 0,
                explain: { en: 'Secondary data (e.g. Census figures, government reports) was collected by someone else, for a different purpose, and is reused.', hi: 'द्वितीयक डेटा (जैसे जनगणना आँकड़े, सरकारी रिपोर्ट) किसी और के द्वारा, किसी अन्य उद्देश्य के लिए एकत्र किया गया था, और इसका पुनः उपयोग किया जाता है।' },
                syllabusId: 'XI-A-U2-COLLECTION'
            },
            {
                level: 'understand',
                question: { en: 'The Census of India is conducted…', hi: 'भारत की जनगणना संचालित की जाती है…' },
                options: [
                    { en: 'Once every 10 years, covering every unit (complete enumeration)', hi: 'हर 10 वर्ष में एक बार, हर इकाई को कवर करते हुए (पूर्ण गणना)' },
                    { en: 'Every single day', hi: 'हर दिन' },
                    { en: 'Only in odd-numbered years', hi: 'केवल विषम-संख्या वाले वर्षों में' },
                    { en: 'Only for a small sample of people', hi: 'केवल लोगों के एक छोटे नमूने के लिए' }
                ],
                correctIndex: 0,
                explain: { en: 'The Census is a complete enumeration (covers everyone), conducted once every 10 years — the most accurate but slowest/most expensive method.', hi: 'जनगणना एक पूर्ण गणना है (हर किसी को कवर करती है), जो हर 10 वर्ष में एक बार संचालित होती है — सबसे सटीक पर सबसे धीमी/सबसे महंगी विधि।' },
                syllabusId: 'XI-A-U2-COLLECTION'
            },
            {
                level: 'understand',
                question: { en: 'The National Sample Survey Organisation (NSSO) primarily conducts…', hi: 'राष्ट्रीय प्रतिदर्श सर्वेक्षण संगठन (NSSO) मुख्यतः क्या संचालित करता है…' },
                options: [
                    { en: 'Large-scale nationwide SAMPLE surveys between Census years', hi: 'जनगणना वर्षों के बीच बड़े पैमाने पर देशव्यापी नमूना सर्वेक्षण' },
                    { en: 'A complete census every year', hi: 'हर साल एक पूर्ण जनगणना' },
                    { en: 'International trade negotiations', hi: 'अंतर्राष्ट्रीय व्यापार वार्ता' },
                    { en: 'Currency printing', hi: 'मुद्रा छपाई' }
                ],
                correctIndex: 0,
                explain: { en: 'NSSO conducts sample surveys (not a full census) to gather timely data between the decadal Census rounds.', hi: 'NSSO दशकीय जनगणना दौरों के बीच समय पर डेटा एकत्र करने के लिए नमूना सर्वेक्षण (पूर्ण जनगणना नहीं) संचालित करता है।' },
                syllabusId: 'XI-A-U2-COLLECTION'
            },
            {
                level: 'analyse',
                question: { en: 'Sampling is generally preferred over a Census when…', hi: 'जनगणना की तुलना में नमूनाकरण सामान्यतः कब पसंद किया जाता है…' },
                options: [
                    { en: 'Speed and cost matter more than covering every single unit', hi: 'हर एक इकाई को कवर करने की तुलना में गति और लागत अधिक महत्वपूर्ण हों' },
                    { en: 'Perfect accuracy is the only goal, regardless of cost', hi: 'लागत की परवाह किए बिना पूर्ण सटीकता ही एकमात्र लक्ष्य हो' },
                    { en: 'The population has exactly one member', hi: 'जनसंख्या में बिल्कुल एक सदस्य हो' },
                    { en: 'Never — a census is always better', hi: 'कभी नहीं — जनगणना हमेशा बेहतर होती है' }
                ],
                correctIndex: 0,
                explain: { en: 'Sampling trades some precision for a large gain in speed and cost — appropriate whenever a full census would be too slow/expensive for the need at hand.', hi: 'नमूनाकरण गति और लागत में बड़े लाभ के लिए कुछ सटीकता का व्यापार करता है — जब भी एक पूर्ण जनगणना आवश्यकता के लिए बहुत धीमी/महंगी होगी तब उपयुक्त है।' },
                syllabusId: 'XI-A-U2-COLLECTION'
            },
            {
                level: 'apply',
                question: { en: 'A student wants to know their own class\'s average marks. Should they use primary or secondary data?', hi: 'एक छात्र अपनी कक्षा के औसत अंक जानना चाहता है। उन्हें प्राथमिक या द्वितीयक डेटा का उपयोग करना चाहिए?' },
                options: [
                    { en: 'Primary — they would collect it themselves, directly', hi: 'प्राथमिक — वे इसे स्वयं, सीधे एकत्र करेंगे' },
                    { en: 'Secondary — from a national report', hi: 'द्वितीयक — एक राष्ट्रीय रिपोर्ट से' },
                    { en: 'Neither type applies here', hi: 'यहाँ कोई भी प्रकार लागू नहीं होता' },
                    { en: 'Census of India data only', hi: 'केवल भारत की जनगणना डेटा' }
                ],
                correctIndex: 0,
                explain: { en: 'Collecting their own class\'s marks directly, for their own purpose, is a textbook example of primary data.', hi: 'अपनी कक्षा के अंकों को सीधे, अपने उद्देश्य के लिए एकत्र करना प्राथमिक डेटा का एक विशिष्ट उदाहरण है।' }
            },
            {
                level: 'apply',
                question: { en: 'A researcher wants India\'s population by state. Should they collect primary data or use secondary data?', hi: 'एक शोधकर्ता को राज्यवार भारत की जनसंख्या चाहिए। उन्हें प्राथमिक डेटा एकत्र करना चाहिए या द्वितीयक डेटा का उपयोग करना चाहिए?' },
                options: [
                    { en: 'Secondary — use the already-published Census of India figures', hi: 'द्वितीयक — पहले से प्रकाशित भारत की जनगणना के आँकड़ों का उपयोग करें' },
                    { en: 'Primary — count every person themselves', hi: 'प्राथमिक — स्वयं हर व्यक्ति की गिनती करें' },
                    { en: 'Neither is possible', hi: 'दोनों में से कोई भी संभव नहीं है' },
                    { en: 'Only NSSO can answer this', hi: 'केवल NSSO ही इसका उत्तर दे सकता है' }
                ],
                correctIndex: 0,
                explain: { en: 'Re-counting India\'s entire population would be absurd — this is exactly what published secondary sources like the Census are for.', hi: 'भारत की पूरी जनसंख्या को फिर से गिनना बेतुका होगा — यही वह है जिसके लिए जनगणना जैसे प्रकाशित द्वितीयक स्रोत हैं।' }
            },
            {
                level: 'analyse',
                question: { en: 'Statistics is valuable to Economics mainly because it…', hi: 'सांख्यिकी अर्थशास्त्र के लिए मुख्यतः मूल्यवान है क्योंकि यह…' },
                options: [
                    { en: 'Simplifies complex data and helps test economic hypotheses with evidence', hi: 'जटिल डेटा को सरल बनाती है और प्रमाण के साथ आर्थिक परिकल्पनाओं का परीक्षण करने में मदद करती है' },
                    { en: 'Replaces the need for any economic theory', hi: 'किसी भी आर्थिक सिद्धांत की आवश्यकता को समाप्त कर देती है' },
                    { en: 'Only matters for historians', hi: 'केवल इतिहासकारों के लिए मायने रखती है' },
                    { en: 'Has no real use in economics', hi: 'अर्थशास्त्र में इसका कोई वास्तविक उपयोग नहीं है' }
                ],
                correctIndex: 0,
                explain: { en: 'Statistics presents facts in comparable form, simplifies unwieldy data, and helps formulate/test hypotheses — the analytical backbone under economic theory.', hi: 'सांख्यिकी तथ्यों को तुलनीय रूप में प्रस्तुत करती है, बोझिल डेटा को सरल बनाती है, और परिकल्पनाओं को तैयार/परीक्षण करने में मदद करती है — आर्थिक सिद्धांत के नीचे विश्लेषणात्मक रीढ़।' },
                syllabusId: 'XI-A-U1-STATS-ROLE'
            },
            {
                level: 'evaluate',
                question: { en: 'A government wants BOTH speed and reasonable accuracy to track unemployment monthly. Which approach fits best?', hi: 'एक सरकार मासिक रूप से बेरोज़गारी को ट्रैक करने के लिए गति और उचित सटीकता दोनों चाहती है। कौन-सा दृष्टिकोण सबसे उपयुक्त है?' },
                options: [
                    { en: 'A well-designed sample survey (NSSO-style), not a full census every month', hi: 'एक अच्छी तरह से डिज़ाइन किया गया नमूना सर्वेक्षण (NSSO-शैली), हर महीने पूर्ण जनगणना नहीं' },
                    { en: 'A full Census every single month', hi: 'हर महीने एक पूर्ण जनगणना' },
                    { en: 'No data collection at all', hi: 'बिल्कुल भी डेटा संग्रह नहीं' },
                    { en: 'Guessing based on last year\'s numbers only', hi: 'केवल पिछले वर्ष की संख्याओं के आधार पर अनुमान' }
                ],
                correctIndex: 0,
                explain: { en: 'A census every month would be far too slow/costly; a well-designed sample survey is exactly the trade-off that makes frequent, reasonably accurate tracking possible.', hi: 'हर महीने जनगणना बहुत धीमी/महंगी होगी; एक अच्छी तरह से डिज़ाइन किया गया नमूना सर्वेक्षण ठीक वही व्यापार-बंद है जो बार-बार, उचित सटीक ट्रैकिंग को संभव बनाता है।' }
            },
            {
                level: 'create',
                question: { en: 'Design the best data-collection plan for "average monthly household spending in a single village": which combination is most sensible?', hi: '"एक ही गाँव में औसत मासिक घरेलू खर्च" के लिए सबसे अच्छी डेटा-संग्रह योजना बनाएँ: कौन-सा संयोजन सबसे उपयुक्त है?' },
                options: [
                    { en: 'Primary data via a small direct survey of that village\'s households', hi: 'उस गाँव के घरों के एक छोटे प्रत्यक्ष सर्वेक्षण के माध्यम से प्राथमिक डेटा' },
                    { en: 'Secondary data from the full national Census only', hi: 'केवल पूर्ण राष्ट्रीय जनगणना से द्वितीयक डेटा' },
                    { en: 'No data is needed — guess the answer', hi: 'किसी डेटा की आवश्यकता नहीं — उत्तर का अनुमान लगाएँ' },
                    { en: 'Ask only one household and assume it represents everyone', hi: 'केवल एक घर से पूछें और मान लें कि यह सभी का प्रतिनिधित्व करता है' }
                ],
                correctIndex: 0,
                explain: { en: 'For a small, specific, local question, a direct primary survey of that village is both feasible and far more relevant than a national secondary source — while a single household is too small a sample to generalise from.', hi: 'एक छोटे, विशिष्ट, स्थानीय प्रश्न के लिए, उस गाँव का प्रत्यक्ष प्राथमिक सर्वेक्षण एक राष्ट्रीय द्वितीयक स्रोत की तुलना में व्यवहार्य और अधिक प्रासंगिक दोनों है — जबकि एक ही घर सामान्यीकरण के लिए बहुत छोटा नमूना है।' }
            }
        ]
    };
}
