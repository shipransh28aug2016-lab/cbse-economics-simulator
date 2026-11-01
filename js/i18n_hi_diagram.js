// Hindi for the text drawn INSIDE each Graph Lab diagram: axis titles, curve
// and point labels, arrow labels and handle hints. Before this file every one
// of them stayed English in Hindi mode while the banner beside it was Hindi.
//
// GL_DIAGRAM_HI[simId] holds [english, hindi] substring pairs. The engine's
// glDiagramText() applies them longest-first, only in Hindi mode, to the text
// the model already produced, so numbers inside a label ("Excess Demand = 8")
// pass through untouched. The model itself is never consulted twice.
//
// tools/test-curriculum.js (testGraphLabDiagramIsTranslated) sweeps every lab
// and fails if any diagram text is still English after translation, if a
// translated label's numbers differ from the English, or if a pair here
// matches no text the lab can actually draw.
//
// The chip tooltips and units go through the same hiPath() route as the chip
// labels; they are merged into SIM_I18N_HI below.
/* exported GL_DIAGRAM_HI */
const GL_DIAGRAM_HI = (function () {
    const PRICE = ['Price (₹ per unit) →', 'कीमत (₹ प्रति इकाई) →'];
    const GOOD_X = ['Good X (units) →', 'वस्तु X (इकाइयाँ) →'];
    const GOOD_Y = ['Good Y (units) →', 'वस्तु Y (इकाइयाँ) →'];
    const OUTPUT = ['Output (units) →', 'उत्पादन (इकाइयाँ) →'];
    const CR = [' cr', ' करोड़'];
    return {
        'gl-demand-movement-shift': [
            ['Quantity Demanded (units) →', 'माँगी गई मात्रा (इकाइयाँ) →'], PRICE,
            ['Drag up/down to change own price — moves you ALONG the curve', 'अपनी कीमत बदलने के लिए ऊपर/नीचे खींचें — आप वक्र के साथ-साथ चलते हैं'],
            ['Drag left/right to shift the whole curve (tastes)', 'पूरे वक्र को खिसकाने के लिए बाएँ/दाएँ खींचें (रुचि)'],
            ['Decrease in Demand (← shift)', 'माँग में कमी (← खिसकाव)'],
            ['Increase in Demand (shift →)', 'माँग में वृद्धि (खिसकाव →)'],
            ['Expansion (move ↓ along curve)', 'विस्तार (वक्र पर ↓ संचलन)'],
            ['Contraction (move ↑ along curve)', 'संकुचन (वक्र पर ↑ संचलन)']
        ],
        'gl-supply-movement-shift': [
            ['Quantity Supplied (units) →', 'पूर्ति की गई मात्रा (इकाइयाँ) →'], PRICE,
            ['Drag up/down to change own price — moves you ALONG SS', 'अपनी कीमत बदलने के लिए ऊपर/नीचे खींचें — आप SS के साथ-साथ चलते हैं'],
            ['Drag left/right to shift the whole curve (technology)', 'पूरे वक्र को खिसकाने के लिए बाएँ/दाएँ खींचें (तकनीक)'],
            ['Increase in Supply (shift →)', 'पूर्ति में वृद्धि (खिसकाव →)'],
            ['Decrease in Supply (← shift)', 'पूर्ति में कमी (← खिसकाव)'],
            ['Contraction (move ↓ along curve)', 'संकुचन (वक्र पर ↓ संचलन)'],
            ['Expansion (move ↑ along curve)', 'विस्तार (वक्र पर ↑ संचलन)']
        ],
        'gl-market-equilibrium-shifts': [
            ['Quantity (units) →', 'मात्रा (इकाइयाँ) →'], PRICE,
            ['Excess Demand', 'अधिमाँग'], ['Excess Supply', 'अधिपूर्ति'],
            ['(price ↑)', '(कीमत ↑)'], ['(price ↓)', '(कीमत ↓)'],
            ['Drag the market price up/down', 'बाज़ार कीमत को ऊपर/नीचे खींचें'],
            ['Drag DD left/right', 'DD को बाएँ/दाएँ खींचें'],
            ['Drag SS left/right', 'SS को बाएँ/दाएँ खींचें']
        ],
        'gl-consumer-equilibrium-ic': [
            GOOD_X, GOOD_Y,
            ['(unattainable)', '(अप्राप्य)'], ['Budget Line', 'बजट रेखा'], ['(equilibrium)', '(संतुलन)'],
            ['Drag out/in — an INCOME change shifts the line parallel', 'बाहर/अंदर खींचें — आय का परिवर्तन रेखा को समानांतर खिसकाता है'],
            ['Drag the X-intercept — a PRICE OF X change swivels the line', 'X-अंतःखंड खींचें — X की कीमत का परिवर्तन रेखा को घुमाता है']
        ],
        'gl-cost-curves': [
            OUTPUT, ['Cost (₹) →', 'लागत (₹) →'],
            ['min AVC', 'न्यूनतम AVC'], ['min AC', 'न्यूनतम AC'],
            ['Drag left/right along the output axis', 'उत्पादन अक्ष पर बाएँ/दाएँ खींचें']
        ],
        'gl-revenue-producer-eq': [
            OUTPUT, ['Revenue / Cost per unit (₹) →', 'आगम / प्रति इकाई लागत (₹) →'],
            ['chosen Q', 'चुना गया Q'],
            ['Expand output → profit rises', 'उत्पादन बढ़ाएँ → लाभ बढ़ता है'],
            ['Cut output → profit rises', 'उत्पादन घटाएँ → लाभ बढ़ता है'],
            ['Drag output left/right', 'उत्पादन को बाएँ/दाएँ खींचें'],
            ['Drag the AR line up/down (price)', 'AR रेखा को ऊपर/नीचे खींचें (कीमत)']
        ],
        'gl-ppc-drag': [
            GOOD_X, GOOD_Y,
            ['(inefficient)', '(अकुशल)'], ['(unattainable)', '(अप्राप्य)'], ['(efficient)', '(कुशल)'],
            ['Economic growth', 'आर्थिक संवृद्धि'],
            ['Drag the production point left/right', 'उत्पादन बिंदु को बाएँ/दाएँ खींचें'],
            ['Drag the production point up/down', 'उत्पादन बिंदु को ऊपर/नीचे खींचें']
        ],
        'gl-ad-as-equilibrium': [
            ['Income / Output (Y) ₹ crore →', 'आय / उत्पादन (Y) ₹ करोड़ →'],
            ['Aggregate Demand (AD) ₹ crore →', 'समग्र माँग (AD) ₹ करोड़ →'],
            ['AD needed for Y_F', 'Y_F के लिए आवश्यक AD'],
            ['Deflationary Gap', 'अवस्फीतिक अंतराल'], ['Inflationary Gap', 'स्फीतिक अंतराल'], CR,
            ['Drag AD up/down (autonomous expenditure)', 'AD को ऊपर/नीचे खींचें (स्वायत्त व्यय)'],
            ['Drag the far end of AD — changes MPC (the slope)', 'AD का दूर वाला सिरा खींचें — MPC (ढलान) बदलता है'],
            ['Drag the full-employment line left/right', 'पूर्ण-रोज़गार रेखा को बाएँ/दाएँ खींचें']
        ],
        'gl-consumption-saving': [
            ['Income (Y) ₹ crore →', 'आय (Y) ₹ करोड़ →'],
            ['Consumption / Saving ₹ crore →', 'उपभोग / बचत ₹ करोड़ →'],
            ['Break-even', 'सम-विच्छेद'], ['Dissaving', 'अबचत'], ['Saving', 'बचत'], CR,
            ['Drag the C intercept up/down', 'C अंतःखंड को ऊपर/नीचे खींचें'],
            ['Drag the far end of C — changes MPC', 'C का दूर वाला सिरा खींचें — MPC बदलता है'],
            ['Drag the income level left/right', 'आय स्तर को बाएँ/दाएँ खींचें']
        ],
        'gl-forex-determination': [
            ['Quantity of Foreign Exchange (US $ million) →', 'विदेशी मुद्रा की मात्रा (US $ मिलियन) →'],
            ['Exchange Rate (₹ per US $) →', 'विनिमय दर (₹ प्रति US $) →'],
            ['(forex demand)', '(विदेशी मुद्रा की माँग)'], ['(forex supply)', '(विदेशी मुद्रा की पूर्ति)'],
            ['Drag the exchange rate up/down', 'विनिमय दर को ऊपर/नीचे खींचें'],
            ['Drag the forex DEMAND curve', 'विदेशी मुद्रा का माँग वक्र खींचें'],
            ['Drag the forex SUPPLY curve', 'विदेशी मुद्रा का पूर्ति वक्र खींचें'],
            ['Shortage of forex', 'विदेशी मुद्रा की कमी'], ['Surplus of forex', 'विदेशी मुद्रा का आधिक्य'],
            ['→ ₹/$ rises', '→ ₹/$ बढ़ता है'], ['→ ₹/$ falls', '→ ₹/$ घटता है']
        ]
    };
})();

// Chip tooltips (graphLab.vars[].hint) and units, read through hiPath() like
// the chip labels already are.
(function () {
    if (typeof SIM_I18N_HI === 'undefined') return;
    const VARS = {
        'gl-demand-movement-shift': {
            price: { hint: 'इसे बदलने से आप वक्र के साथ-साथ चलते हैं' },
            income: { hint: 'सामान्य वस्तु: आय ↑ होने पर DD दाईं ओर खिसकता है' },
            pSub: { hint: 'स्थानापन्न महँगा ⇒ इस वस्तु की माँग अधिक' },
            pComp: { hint: 'पूरक महँगा ⇒ इस वस्तु की माँग कम' }
        },
        'gl-supply-movement-shift': {
            price: { hint: 'इसे बदलने से आप वक्र के साथ-साथ चलते हैं' },
            inputCost: { hint: 'महँगे आगत SS को बाईं ओर खिसकाते हैं' },
            tech: { hint: 'बेहतर तकनीक SS को दाईं ओर खिसकाती है' }
        },
        'gl-market-equilibrium-shifts': {
            mktPrice: { hint: 'संतुलन से दूर यह अधिमाँग या अधिपूर्ति पैदा करती है' }
        },
        'gl-consumer-equilibrium-ic': {
            M: { hint: 'बजट रेखा को समानांतर खिसकाती है' },
            Px: { hint: 'बजट रेखा को घुमाती है' }
        },
        'gl-cost-curves': {
            q: { hint: 'इस उत्पादन पर हर लागत पढ़ने के लिए वक्रों के साथ खींचें', unit: 'इकाई' },
            eff: { hint: 'परिवर्ती-लागत वक्रों को ऊपर या नीचे खिसकाती है' }
        },
        'gl-revenue-producer-eq': {
            q: { hint: 'वहाँ की ओर खींचें जहाँ MC, MR को काटता है', unit: 'इकाई' },
            market: { hint: '0 = पूर्ण प्रतियोगिता (क्षैतिज AR); अधिक = अधिक ढलवाँ AR, MR उसके नीचे गिरता है' }
        },
        'gl-ppc-drag': {
            px: { hint: 'बिंदु को बाएँ/दाएँ खींचें' },
            py: { hint: 'बिंदु को ऊपर/नीचे खींचें' },
            growth: { hint: 'पूरे PPC को बाहर या अंदर की ओर खिसकाती है' }
        },
        'gl-ad-as-equilibrium': {
            auto: { hint: 'पूरी AD रेखा को ऊपर या नीचे खिसकाता है', unit: '₹ करोड़' },
            mpc: { hint: 'AD को अधिक या कम ढलवाँ बनाता है; गुणक तय करता है' },
            yf: { hint: 'वह लक्ष्य जिससे अंतराल मापा जाता है', unit: '₹ करोड़' }
        },
        'gl-consumption-saving': {
            cbar: { hint: 'अंतःखंड — शून्य आय पर उपभोग', unit: '₹ करोड़' },
            mpc: { hint: 'उपभोग रेखा का ढलान' },
            y: { hint: 'यहाँ APC/APS पढ़ने के लिए रेखाओं के साथ खींचें', unit: '₹ करोड़' }
        },
        'gl-forex-determination': {
            rate: { hint: 'संतुलन से दूर यह विदेशी मुद्रा का आधिक्य या कमी पैदा करती है' }
        }
    };
    Object.keys(VARS).forEach(id => {
        const hi = SIM_I18N_HI[id] = SIM_I18N_HI[id] || {};
        hi.graphLab = hi.graphLab || {};
        hi.graphLab.vars = hi.graphLab.vars || {};
        Object.keys(VARS[id]).forEach(v => { hi.graphLab.vars[v] = Object.assign({}, hi.graphLab.vars[v], VARS[id][v]); });
    });
})();
