// Hindi for the 📘 chapter tag at the top of every sim's Concept card
// (curriculum-data.js's chapterTagText): part titles, unit titles and topic
// labels, in the terms CBSE's Hindi-medium NCERT books use. Keyed by the
// English text, so the curriculum registry stays the single source of truth
// for WHICH unit a sim belongs to; this file only says how to name it.
// tools/test-curriculum.js (testChapterTagsAreTranslated) fails the build if
// any sim's tag is not fully Hindi in Hindi mode, or if an entry here is dead.
/* exported PART_TITLES_HI, UNIT_TITLES_HI, TOPIC_LABELS_HI */
const PART_TITLES_HI = {
    'Statistics for Economics': 'अर्थशास्त्र में सांख्यिकी',
    'Introductory Microeconomics': 'व्यष्टि अर्थशास्त्र: एक परिचय',
    'Introductory Macroeconomics': 'समष्टि अर्थशास्त्र: एक परिचय',
    'Indian Economic Development': 'भारतीय अर्थव्यवस्था का विकास'
};
const UNIT_TITLES_HI = {
    'Introduction': 'परिचय',
    'Collection, Organisation and Presentation of Data': 'आँकड़ों का संग्रह, संगठन और प्रस्तुतीकरण',
    'Statistical Tools and Interpretation': 'सांख्यिकीय उपकरण और निर्वचन',
    'Introduction to Microeconomics': 'व्यष्टि अर्थशास्त्र का परिचय',
    "Consumer's Equilibrium and Demand": 'उपभोक्ता का संतुलन और माँग',
    'Demand, Supply & Market Equilibrium': 'माँग, पूर्ति और बाज़ार संतुलन',
    'Producer Behaviour and Supply': 'उत्पादक व्यवहार और पूर्ति',
    'Forms of Market and Price Determination': 'बाज़ार के रूप और कीमत निर्धारण',
    'Perfect Competition — Price Determination and Simple Applications': 'पूर्ण प्रतियोगिता — कीमत निर्धारण और सरल अनुप्रयोग',
    'National Income and Related Aggregates': 'राष्ट्रीय आय और संबंधित समुच्चय',
    'Money and Banking': 'मुद्रा और बैंकिंग',
    'Determination of Income and Employment': 'आय और रोज़गार का निर्धारण',
    'Government Budget and the Economy': 'सरकारी बजट और अर्थव्यवस्था',
    'Balance of Payments': 'भुगतान संतुलन',
    'Development Experience (1947–90) and Economic Reforms since 1991': 'विकास अनुभव (1947–90) और 1991 से आर्थिक सुधार',
    'Current Challenges facing Indian Economy': 'भारतीय अर्थव्यवस्था की वर्तमान चुनौतियाँ',
    'Development Experience of India — A Comparison with Neighbours': 'भारत का विकास अनुभव — पड़ोसियों से तुलना'
};
const TOPIC_LABELS_HI = {
    'Every Named Determinant': 'हर नामित निर्धारक',
    'Price Elasticity of Demand': 'माँग की कीमत लोच',
    'Circular Flow of Income': 'आय का चक्रीय प्रवाह',
    'Investment Multiplier': 'निवेश गुणक',
    "Correlation — Karl Pearson's & Spearman's Rank": 'सहसंबंध — कार्ल पियर्सन और स्पियरमैन का कोटि',
    'Poverty & Income Inequality': 'निर्धनता और आय असमानता',
    'Marginal Utility Analysis': 'सीमांत उपयोगिता विश्लेषण',
    'Returns to a Factor & Cost Curves': 'साधन के प्रतिफल और लागत वक्र',
    'Price Ceiling & Price Floor': 'उच्चतम कीमत सीमा और न्यूनतम कीमत सीमा',
    'Forms of Market (extension)': 'बाज़ार के रूप (विस्तार)',
    'Money Creation by the Commercial Banking System': 'वाणिज्यिक बैंकिंग प्रणाली द्वारा मुद्रा सृजन',
    'Receipts, Expenditure & Deficits': 'प्राप्तियाँ, व्यय और घाटे',
    'BOP Accounts & Exchange Rate Determination': 'भुगतान संतुलन खाते और विनिमय दर निर्धारण',
    'Excess & Deficient Demand': 'अधिमाँग और अभावी माँग',
    'Measures of Dispersion (extension)': 'परिक्षेपण के माप (विस्तार)',
    'Index Numbers — Simple Aggregative Method': 'सूचकांक — सरल समूही विधि',
    'Human Capital Formation': 'मानव पूँजी निर्माण',
    'Employment: Workforce Participation & Formal/Informal Sector': 'रोज़गार: कार्यबल सहभागिता और औपचारिक/अनौपचारिक क्षेत्र',
    'PPF, Opportunity Cost & the Central Problems': 'उत्पादन संभावना वक्र, अवसर लागत और केंद्रीय समस्याएँ',
    'Positive vs Normative Economics; Micro vs Macro': 'वास्तविक बनाम आदर्शक अर्थशास्त्र; व्यष्टि बनाम समष्टि',
    'Indifference Curve Analysis': 'अनधिमान वक्र विश्लेषण',
    'Revenue (TR/AR/MR) & Producer Equilibrium (MR=MC)': 'आगम (TR/AR/MR) और उत्पादक संतुलन (MR=MC)',
    'Price Elasticity of Supply': 'पूर्ति की कीमत लोच',
    'Mean, Median, Mode': 'माध्य, माध्यिका, बहुलक',
    'Organisation & Frequency Diagrams': 'आँकड़ों का संगठन और आवृत्ति आरेख',
    'Tabulation & Geometric (Bar/Pie) Diagrams': 'सारणीयन और ज्यामितीय (दंड/वृत्त) आरेख',
    'Economics, Statistics & Data Collection': 'अर्थशास्त्र, सांख्यिकी और आँकड़ों का संग्रह',
    'Methods of Calculating National Income': 'राष्ट्रीय आय की गणना की विधियाँ',
    'Consumption/Capital, Final/Intermediate Goods, Stock/Flow, Depreciation': 'उपभोग/पूँजीगत, अंतिम/मध्यवर्ती वस्तुएँ, स्टॉक/प्रवाह, मूल्यह्रास',
    'Propensity to Consume & Save': 'उपभोग और बचत प्रवृत्ति',
    'Independence → Planning → LPG → Demonetisation → GST': 'स्वतंत्रता → नियोजन → उदारीकरण-निजीकरण-वैश्वीकरण → विमुद्रीकरण → GST',
    'Rural Development': 'ग्रामीण विकास',
    'Sustainable Economic Development': 'धारणीय आर्थिक विकास',
    'India / Pakistan / China Comparison': 'भारत / पाकिस्तान / चीन तुलना',
    'Movements vs Shifts': 'संचलन बनाम खिसकाव',
    'Equilibrium & Shifts': 'संतुलन और खिसकाव',
    'Short-run Costs': 'अल्पकालीन लागतें',
    'Revenue & Producer Equilibrium': 'आगम और उत्पादक संतुलन',
    'PPC & Opportunity Cost': 'उत्पादन संभावना वक्र और अवसर लागत',
    'AD–AS Equilibrium & Gaps': 'AD–AS संतुलन और अंतराल',
    'Exchange Rate Determination': 'विनिमय दर निर्धारण'
};
