// Hindi labels for the "⚡ परिणामी प्रभाव" (resulting effect) line that
// js/transition-layer.js builds from each sim's compute() metrics — and that
// Mima reads aloud. Before this file every one of those labels stayed in
// English in Hindi mode. Labels shared across chapters (Ed, AC, MRT, sd…)
// live in transition-layer.js's ECON_METRIC_LABELS_HI; the sim-specific ones
// below are merged into each sim's SIM_I18N_HI entry as `metricLabels`, read
// through the same hiPath() as every other per-sim Hindi string.
// tools/test-curriculum.js (testEffectLabelsAreTranslated) fails the build if
// any numeric metric a simulator sim produces lacks a Hindi label here or in
// the glossary, or if a key here matches no real metric.
(function () {
    if (typeof SIM_I18N_HI === 'undefined') return;
    const LABELS = {
        'micro-supply-demand': {
            equilibriumPrice: 'संतुलन कीमत', equilibriumQuantity: 'संतुलन मात्रा',
            demandShift: 'निवल माँग शिफ्ट', supplyShift: 'निवल आपूर्ति शिफ्ट (+ = आपूर्ति घटी)'
        },
        'micro-elasticity': { substitutes: 'निकट स्थानापन्नों की संख्या' },
        'macro-gdp': {
            consumption: 'उपभोग व्यय', wages: 'कारक भुगतान', saving: 'बचत (S)', investment: 'निवेश (I)',
            g: 'सरकारी व्यय (G)', nx: 'निवल निर्यात (X − M)', taxes: 'कर (T)', exportsVal: 'निर्यात (X)',
            imports: 'आयात (M)', totalInjections: 'कुल इंजेक्शन', totalLeakages: 'कुल लीकेज', gdpExp: 'GDP (व्यय विधि)'
        },
        'macro-multiplier': {
            k: 'व्यय गुणक (k)', kt: 'कर गुणक (kt)', dySpending: 'व्यय से ΔY', dyTax: 'कर से ΔY', Y1: 'नई संतुलन आय'
        },
        'micro-consumer-equilibrium': {
            muPerRupee: 'प्रति रुपया MU', Qstar: 'संतुलन Q* (MU = कीमत)', Qx: 'X की मात्रा (Qx)', Qy: 'Y की मात्रा (Qy)',
            muxPerRupee: 'X की प्रति रुपया MU (MUx/Px)', muyPerRupee: 'Y की प्रति रुपया MU (MUy/Py)',
            diff: 'MUx/Px − MUy/Py का अंतर', bestQx: 'समसीमांत Qx', bestQy: 'समसीमांत Qy'
        },
        'micro-producer-costs': { qStar: 'न्यूनतम-AC उत्पादन (Q*)', acStar: 'न्यूनतम बिंदु पर AC', phase: 'अवस्था (साधन के प्रतिफल)' },
        'micro-price-controls': { gap: 'कमी / अधिशेष' },
        'micro-market-structures': { P: 'बाज़ार कीमत', Q: 'बाज़ार मात्रा', N: 'फ़र्मों की संख्या' },
        'macro-money-creation': { totalMoney: 'कुल सृजित मुद्रा' },
        'macro-govt-budget': { revenueDeficit: 'राजस्व घाटा', fiscalDeficit: 'राजकोषीय घाटा', primaryDeficit: 'प्राथमिक घाटा' },
        'macro-forex': { P: 'विनिमय दर (₹/$)', Q: 'व्यापारित US$ की मात्रा' },
        'macro-inflation-gap': {
            Ystar: 'संतुलन आय (AD = AS)', gapSize: 'अंतराल का आकार (Yfe पर ऊर्ध्वाधर)', adAtYfe: 'पूर्ण रोज़गार पर AD', output: 'उत्पादन'
        },
        'stats-dispersion': { range: 'परिसर' },
        'india-human-capital': { literacy: 'साक्षरता दर (%)', lifeExpectancy: 'जीवन प्रत्याशा (वर्ष)' },
        'india-employment-structure': {
            agri: 'कृषि (% रोज़गार)', industry: 'उद्योग (% रोज़गार)', services: 'सेवाएँ (% रोज़गार)',
            formal: 'औपचारिक क्षेत्र (%)', informal: 'अनौपचारिक क्षेत्र (%)'
        },
        'micro-ppf': { oppCost: 'इस बिंदु पर अवसर लागत', X: 'बिंदु पर वस्तु X', Y: 'बिंदु पर वस्तु Y', Yfrontier: 'इस X पर सीमा का Y' },
        'micro-indifference-curve': { X: 'संतुलन पर वस्तु X', Y: 'संतुलन पर वस्तु Y', priceRatio: 'कीमत अनुपात (Px/Py)' },
        'micro-revenue-producer-equilibrium': { Qstar: 'संतुलन उत्पादन (Q*)', MRatQstar: 'Q* पर MR', MCatQstar: 'Q* पर MC', profit: 'लाभ' }
    };
    Object.keys(LABELS).forEach(id => {
        SIM_I18N_HI[id] = SIM_I18N_HI[id] || {};
        SIM_I18N_HI[id].metricLabels = Object.assign({}, SIM_I18N_HI[id].metricLabels, LABELS[id]);
    });
})();
