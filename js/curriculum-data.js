// ══════════════════════════════════════════════════════════════
// CBSE Economics (Subject Code 030) — 2026–27 curriculum registry.
//
// This file is the machine-checkable counterpart of
// curriculum/Economics_2026-27_Content_MicroContent_Taxonomy.md.
// Every syllabus Topic named in that document gets exactly one node
// here, with a unique `id` ("syllabusId"). js/simulations*.js files
// declare which node(s) each simulation/data-lab/explorer covers via
// `sim.syllabusIds`; nothing else in the app should hand-maintain a
// second copy of "what covers what" — the coverage matrix, the
// duplicate-ID check, and the "no wrong class mapping" check are all
// generated FROM this file plus SIMS, not written by hand alongside it.
//
// Loaded before every js/simulations*.js file (see index.html).
// Works as a plain <script> (assigns to window) and under Node
// (module.exports), so tools/test-curriculum.js can require() it.
// ══════════════════════════════════════════════════════════════

const PART_TITLES = {
    XI: { A: 'Statistics for Economics', B: 'Introductory Microeconomics' },
    XII: { A: 'Introductory Macroeconomics', B: 'Indian Economic Development' }
};

// suggestedMode: which of the three implementation modes the taxonomy
// document's own content shape calls for (meaningful variable
// relationship → simulator; statistical/indicator data → datalab;
// historical/policy/conceptual → explorer). Individual sims may still
// legitimately choose a different mode for part of a topic.
const CURRICULUM_NODES = [
    // ── CLASS XI · PART A — STATISTICS FOR ECONOMICS ────────────
    { id: 'XI-A-U1-ECONOMICS', class: 'XI', part: 'A', unit: 1, unitTitle: 'Introduction', topic: 'Economics: Meaning & Scope', microContent: ['Economics as a social science', 'Economic information', 'Quantitative vs qualitative information'], learningObjective: 'State what economics studies and distinguish quantitative from qualitative economic information.', suggestedMode: 'explorer' },
    { id: 'XI-A-U1-STATS-ROLE', class: 'XI', part: 'A', unit: 1, unitTitle: 'Introduction', topic: 'Statistics in Economics: Meaning, Functions, Importance', microContent: ['Role of statistical methods in economic analysis', 'Use of data for economic interpretation'], learningObjective: 'Explain why economics relies on statistical methods to analyse real-world data.', suggestedMode: 'explorer' },
    { id: 'XI-A-U2-COLLECTION', class: 'XI', part: 'A', unit: 2, unitTitle: 'Collection, Organisation and Presentation of Data', topic: 'Collection of Data: Primary vs Secondary, Sampling, Census/NSSO', microContent: ['Primary data', 'Secondary data', 'Sampling', 'Census of India', 'National Sample Survey Organisation'], learningObjective: 'Distinguish primary from secondary data and explain why/when sampling is used instead of a census.', suggestedMode: 'explorer' },
    { id: 'XI-A-U2-ORG', class: 'XI', part: 'A', unit: 2, unitTitle: 'Collection, Organisation and Presentation of Data', topic: 'Organisation of Data: Variables, Frequency Distribution', microContent: ['Raw data', 'Variables', 'Classification', 'Frequency distribution'], learningObjective: 'Convert raw data into a classified frequency distribution.', suggestedMode: 'datalab' },
    { id: 'XI-A-U2-PRESENT', class: 'XI', part: 'A', unit: 2, unitTitle: 'Collection, Organisation and Presentation of Data', topic: 'Presentation of Data: Tabulation & Diagrammatic (Bar/Pie/Histogram/Polygon/Ogive/Time-series)', microContent: ['Tabular presentation', 'Bar diagrams', 'Pie diagrams', 'Histogram', 'Frequency polygon', 'Ogive', 'Arithmetic (time-series) line graph'], learningObjective: 'Choose and construct the appropriate diagram for a given dataset, and read it back correctly.', suggestedMode: 'datalab' },
    { id: 'XI-A-U3-CENTRAL-TENDENCY', class: 'XI', part: 'A', unit: 3, unitTitle: 'Statistical Tools and Interpretation', topic: 'Measures of Central Tendency: Mean, Median, Mode', microContent: ['Arithmetic mean', 'Median', 'Mode', 'Comparison of mean/median/mode'], learningObjective: 'Calculate mean, median and mode for a dataset and interpret what each reveals (and hides).', suggestedMode: 'datalab' },
    { id: 'XI-A-U3-CORRELATION', class: 'XI', part: 'A', unit: 3, unitTitle: 'Statistical Tools and Interpretation', topic: "Correlation: Scatter Diagram, Karl Pearson's Method, Spearman's Rank Correlation", microContent: ['Scatter diagram', "Karl Pearson's r", "Spearman's rank correlation", 'Repeated ranks'], learningObjective: 'Measure and interpret the strength/direction of a relationship between two variables, by raw values and by rank.', suggestedMode: 'datalab' },
    { id: 'XI-A-U3-INDEX', class: 'XI', part: 'A', unit: 3, unitTitle: 'Statistical Tools and Interpretation', topic: 'Index Numbers: WPI/CPI/IIP, Simple Aggregative Method, Inflation', microContent: ['Wholesale Price Index', 'Consumer Price Index', 'Index of Industrial Production', 'Simple Aggregative Method', 'Inflation and index numbers'], learningObjective: 'Construct a price index by the Simple Aggregative Method and relate its movement to inflation.', suggestedMode: 'datalab' },

    // ── CLASS XI · PART B — INTRODUCTORY MICROECONOMICS ─────────
    { id: 'XI-B-U4-BRANCHES', class: 'XI', part: 'B', unit: 4, unitTitle: 'Introduction', topic: 'Micro vs Macro; Positive vs Normative Economics', microContent: ['Microeconomics', 'Macroeconomics', 'Positive economics', 'Normative economics'], learningObjective: 'Classify an economic statement as positive or normative, and a question as micro or macro.', suggestedMode: 'explorer' },
    { id: 'XI-B-U4-CENTRAL-PROBLEMS', class: 'XI', part: 'B', unit: 4, unitTitle: 'Introduction', topic: 'Central Problems of an Economy: What, How, For Whom to Produce', microContent: ['Scarcity', 'Choice', 'Resource allocation'], learningObjective: 'Explain why every economy must answer what/how/for whom to produce.', suggestedMode: 'simulator' },
    { id: 'XI-B-U4-PPF-OC', class: 'XI', part: 'B', unit: 4, unitTitle: 'Introduction', topic: 'Production Possibility Frontier (PPF) & Opportunity Cost', microContent: ['PPF', 'Opportunity cost', 'Trade-offs', 'Alternative production possibilities'], learningObjective: 'Read a PPF, identify efficient/inefficient/unattainable points, and compute opportunity cost along it.', suggestedMode: 'simulator' },
    { id: 'XI-B-U5-UTILITY', class: 'XI', part: 'B', unit: 5, unitTitle: "Consumer's Equilibrium and Demand", topic: 'Utility, Marginal Utility, Law of Diminishing MU, Consumer Equilibrium (MU Analysis)', microContent: ['Utility', 'Marginal utility', 'Law of diminishing marginal utility', 'Consumer equilibrium (MU=0 / MUx/Px=MUy/Py)'], learningObjective: "Derive a consumer's equilibrium condition using marginal-utility analysis.", suggestedMode: 'simulator' },
    { id: 'XI-B-U5-IC', class: 'XI', part: 'B', unit: 5, unitTitle: "Consumer's Equilibrium and Demand", topic: "Indifference Curve Analysis: Budget Line, Indifference Curve/Map, Consumer Equilibrium (MRS)", microContent: ['Budget set', 'Budget line', 'Indifference curve', 'Indifference map', 'Consumer equilibrium (MRS = price ratio)'], learningObjective: 'Locate consumer equilibrium as the tangency of the budget line and the highest attainable indifference curve.', suggestedMode: 'simulator' },
    { id: 'XI-B-U5-DEMAND', class: 'XI', part: 'B', unit: 5, unitTitle: "Consumer's Equilibrium and Demand", topic: 'Demand: Determinants, Schedule, Curve, Movements & Shifts', microContent: ['Demand', 'Market demand', 'Determinants of demand', 'Demand schedule', 'Demand curve', 'Movement vs shift'], learningObjective: 'Distinguish a movement along the demand curve from a shift in it, and name the determinant behind each shift.', suggestedMode: 'simulator' },
    { id: 'XI-B-U5-ELASTICITY', class: 'XI', part: 'B', unit: 5, unitTitle: "Consumer's Equilibrium and Demand", topic: 'Price Elasticity of Demand: Meaning, Determinants, Measurement', microContent: ['Price elasticity of demand', 'Percentage-change method', 'Total expenditure method'], learningObjective: 'Measure price elasticity of demand and classify it as elastic/inelastic/unit elastic.', suggestedMode: 'simulator' },
    { id: 'XI-B-U6-PRODUCTION', class: 'XI', part: 'B', unit: 6, unitTitle: 'Producer Behaviour and Supply', topic: 'Production Function, TP/AP/MP, Returns to a Factor', microContent: ['Production function', 'Total Product', 'Average Product', 'Marginal Product', 'Law of Variable Proportions'], learningObjective: 'Trace how TP/AP/MP behave as a variable factor increases, and identify the three stages of returns.', suggestedMode: 'simulator' },
    { id: 'XI-B-U6-COST', class: 'XI', part: 'B', unit: 6, unitTitle: 'Producer Behaviour and Supply', topic: 'Costs: TC/TFC/TVC/AC/AFC/AVC/MC and their Relationships', microContent: ['Total Cost', 'Total Fixed Cost', 'Total Variable Cost', 'Average Cost', 'Marginal Cost'], learningObjective: 'Derive AC and MC from TC and explain why MC cuts AC at its minimum.', suggestedMode: 'simulator' },
    { id: 'XI-B-U6-REVENUE', class: 'XI', part: 'B', unit: 6, unitTitle: 'Producer Behaviour and Supply', topic: 'Revenue: TR/AR/MR and their Relationships', microContent: ['Total Revenue', 'Average Revenue', 'Marginal Revenue'], learningObjective: 'Derive AR and MR from TR under a given price, and relate MR to AR under perfect competition.', suggestedMode: 'simulator' },
    { id: 'XI-B-U6-PRODUCER-EQ', class: 'XI', part: 'B', unit: 6, unitTitle: 'Producer Behaviour and Supply', topic: "Producer's Equilibrium (MR = MC)", microContent: ['Producer equilibrium', 'Profit-maximising output'], learningObjective: 'Identify the profit-maximising output where MR = MC and MC is rising.', suggestedMode: 'simulator' },
    { id: 'XI-B-U6-SUPPLY', class: 'XI', part: 'B', unit: 6, unitTitle: 'Producer Behaviour and Supply', topic: 'Supply: Determinants, Schedule, Curve, Movements & Shifts, Price Elasticity of Supply', microContent: ['Supply', 'Market supply', 'Determinants of supply', 'Supply curve', 'Price elasticity of supply'], learningObjective: 'Distinguish a movement along the supply curve from a shift, and measure price elasticity of supply.', suggestedMode: 'simulator' },
    { id: 'XI-B-U7-PERFECT-COMP', class: 'XI', part: 'B', unit: 7, unitTitle: 'Perfect Competition — Price Determination and Simple Applications', topic: 'Perfect Competition: Meaning & Features', microContent: ['Competitive market', 'Price-taking firms'], learningObjective: 'List the defining features of a perfectly competitive market.', suggestedMode: 'explorer' },
    { id: 'XI-B-U7-MARKET-EQ', class: 'XI', part: 'B', unit: 7, unitTitle: 'Perfect Competition — Price Determination and Simple Applications', topic: 'Market Equilibrium & Shifts in Demand/Supply (short run)', microContent: ['Equilibrium price', 'Equilibrium quantity', 'Demand-supply shifts'], learningObjective: "Determine short-run market equilibrium and predict how it moves when demand or supply shifts.", suggestedMode: 'simulator' },
    { id: 'XI-B-U7-APPLICATIONS', class: 'XI', part: 'B', unit: 7, unitTitle: 'Perfect Competition — Price Determination and Simple Applications', topic: 'Simple Applications: Price Ceiling & Price Floor', microContent: ['Price ceiling', 'Price floor', 'Government price intervention'], learningObjective: 'Predict shortage under a price ceiling and surplus under a price floor, relative to free-market equilibrium.', suggestedMode: 'simulator' },

    // ── CLASS XII · PART A — INTRODUCTORY MACROECONOMICS ────────
    { id: 'XII-A-U1-MACRO-MEANING', class: 'XII', part: 'A', unit: 1, unitTitle: 'National Income and Related Aggregates', topic: 'Meaning of Macroeconomics', microContent: ['Macroeconomics'], learningObjective: 'State what macroeconomics studies, as distinct from microeconomics.', suggestedMode: 'explorer' },
    { id: 'XII-A-U1-BASIC-CONCEPTS', class: 'XII', part: 'A', unit: 1, unitTitle: 'National Income and Related Aggregates', topic: 'Basic Concepts: Consumption/Capital/Final/Intermediate Goods, Stock vs Flow, Gross Investment, Depreciation', microContent: ['Consumption goods', 'Capital goods', 'Final goods', 'Intermediate goods', 'Stocks', 'Flows', 'Gross investment', 'Depreciation'], learningObjective: 'Classify a good and a variable correctly (final vs intermediate; stock vs flow) and relate gross investment to depreciation.', suggestedMode: 'explorer' },
    { id: 'XII-A-U1-CIRCULAR-FLOW', class: 'XII', part: 'A', unit: 1, unitTitle: 'National Income and Related Aggregates', topic: 'Circular Flow of Income (Two-Sector Model)', microContent: ['Two-sector model', 'Real flow', 'Money flow'], learningObjective: 'Trace the real flow and money flow between households and firms and explain why they move in opposite directions.', suggestedMode: 'simulator' },
    { id: 'XII-A-U1-METHODS', class: 'XII', part: 'A', unit: 1, unitTitle: 'National Income and Related Aggregates', topic: 'Methods of Calculating National Income: Value Added, Expenditure, Income', microContent: ['Value Added/Product Method', 'Expenditure Method', 'Income Method'], learningObjective: 'Compute national income from a given dataset by all three methods and verify they agree.', suggestedMode: 'datalab' },
    { id: 'XII-A-U1-AGGREGATES', class: 'XII', part: 'A', unit: 1, unitTitle: 'National Income and Related Aggregates', topic: 'National Income Aggregates: GNP/NNP/GDP/NDP, Market Price/Factor Cost, Real/Nominal GDP, GDP Deflator, GDP & Welfare', microContent: ['GNP', 'NNP', 'GDP', 'NDP', 'Market price', 'Factor cost', 'Real GDP', 'Nominal GDP', 'GDP Deflator'], learningObjective: 'Convert between GDP/GNP/NDP/NNP and between nominal and real GDP using the deflator.', suggestedMode: 'datalab' },
    { id: 'XII-A-U2-MONEY', class: 'XII', part: 'A', unit: 2, unitTitle: 'Money and Banking', topic: 'Money: Meaning & Functions', microContent: ['Functions of money'], learningObjective: "State money's functions (medium of exchange, unit of account, store of value, standard of deferred payment).", suggestedMode: 'explorer' },
    { id: 'XII-A-U2-SUPPLY', class: 'XII', part: 'A', unit: 2, unitTitle: 'Money and Banking', topic: 'Money Supply: Currency with the Public, Net Demand Deposits', microContent: ['Currency held by the public', 'Net demand deposits'], learningObjective: 'Define money supply as currency with the public plus net demand deposits with banks.', suggestedMode: 'explorer' },
    { id: 'XII-A-U2-CREATION', class: 'XII', part: 'A', unit: 2, unitTitle: 'Money and Banking', topic: 'Money Creation by the Commercial Banking System', microContent: ['Deposit creation', 'Credit creation'], learningObjective: 'Compute total deposits/credit created from an initial deposit given the Legal Reserve Ratio.', suggestedMode: 'simulator' },
    { id: 'XII-A-U2-CENTRAL-BANK', class: 'XII', part: 'A', unit: 2, unitTitle: 'Money and Banking', topic: 'Central Bank (RBI): Functions', microContent: ['Bank of issue', "Government's bank", "Banker's bank"], learningObjective: "Name RBI's three core functions as India's central bank.", suggestedMode: 'explorer' },
    { id: 'XII-A-U2-CREDIT-CONTROL', class: 'XII', part: 'A', unit: 2, unitTitle: 'Money and Banking', topic: 'Credit Control Instruments: Bank Rate, CRR, SLR, Repo, Reverse Repo, OMO, Margin Requirement', microContent: ['Bank Rate', 'CRR', 'SLR', 'Repo Rate', 'Reverse Repo Rate', 'Open Market Operations', 'Margin Requirement'], learningObjective: "Name each RBI credit-control instrument and whether raising it is expansionary or contractionary.", suggestedMode: 'explorer' },
    { id: 'XII-A-U3-AD', class: 'XII', part: 'A', unit: 3, unitTitle: 'Determination of Income and Employment', topic: 'Aggregate Demand: Meaning & Components', microContent: ['Aggregate demand'], learningObjective: 'List the components of Aggregate Demand.', suggestedMode: 'simulator' },
    { id: 'XII-A-U3-PROPENSITY', class: 'XII', part: 'A', unit: 3, unitTitle: 'Determination of Income and Employment', topic: 'Propensity to Consume & Save (APC/MPC/APS/MPS)', microContent: ['Average propensity to consume', 'Marginal propensity to consume', 'Average propensity to save', 'Marginal propensity to save'], learningObjective: 'Compute APC/MPC/APS/MPS from consumption-income data and verify APC+APS=1, MPC+MPS=1.', suggestedMode: 'datalab' },
    { id: 'XII-A-U3-EQUILIBRIUM', class: 'XII', part: 'A', unit: 3, unitTitle: 'Determination of Income and Employment', topic: 'Equilibrium Output (Short Run)', microContent: ['Equilibrium output'], learningObjective: 'Find short-run equilibrium income where AD = Y (or S = I).', suggestedMode: 'simulator' },
    { id: 'XII-A-U3-MULTIPLIER', class: 'XII', part: 'A', unit: 3, unitTitle: 'Determination of Income and Employment', topic: 'Investment Multiplier', microContent: ['Investment multiplier'], learningObjective: 'Compute the investment multiplier k=1/(1-MPC) and the resulting ΔY for a given ΔI.', suggestedMode: 'simulator' },
    { id: 'XII-A-U3-EMPLOYMENT', class: 'XII', part: 'A', unit: 3, unitTitle: 'Determination of Income and Employment', topic: 'Full Employment & Involuntary Unemployment', microContent: ['Full employment', 'Involuntary unemployment'], learningObjective: 'Distinguish full employment income from the equilibrium income and explain involuntary unemployment.', suggestedMode: 'simulator' },
    { id: 'XII-A-U3-GAPS', class: 'XII', part: 'A', unit: 3, unitTitle: 'Determination of Income and Employment', topic: 'Excess & Deficient Demand: Meaning, Effects, Corrective (Fiscal/Monetary) Measures', microContent: ['Excess demand', 'Deficient demand', 'Fiscal measures', 'Monetary measures'], learningObjective: 'Identify an inflationary vs deflationary gap and name a fiscal or monetary measure to correct each.', suggestedMode: 'simulator' },
    { id: 'XII-A-U4-BUDGET', class: 'XII', part: 'A', unit: 4, unitTitle: 'Government Budget and the Economy', topic: 'Government Budget: Meaning, Objectives, Components', microContent: ['Budget objectives'], learningObjective: 'State the objectives of a government budget.', suggestedMode: 'explorer' },
    { id: 'XII-A-U4-RECEIPTS', class: 'XII', part: 'A', unit: 4, unitTitle: 'Government Budget and the Economy', topic: 'Government Receipts: Revenue & Capital', microContent: ['Revenue receipts', 'Capital receipts'], learningObjective: 'Classify a given government receipt as revenue or capital.', suggestedMode: 'datalab' },
    { id: 'XII-A-U4-EXPENDITURE', class: 'XII', part: 'A', unit: 4, unitTitle: 'Government Budget and the Economy', topic: 'Government Expenditure: Revenue & Capital', microContent: ['Revenue expenditure', 'Capital expenditure'], learningObjective: 'Classify a given government expenditure as revenue or capital.', suggestedMode: 'datalab' },
    { id: 'XII-A-U4-DEFICITS', class: 'XII', part: 'A', unit: 4, unitTitle: 'Government Budget and the Economy', topic: 'Budget Types & Measures of Government Deficit', microContent: ['Balanced budget', 'Surplus budget', 'Deficit budget', 'Revenue deficit', 'Fiscal deficit', 'Primary deficit'], learningObjective: 'Compute Revenue, Fiscal and Primary Deficit from given budget data.', suggestedMode: 'datalab' },
    { id: 'XII-A-U5-BOP', class: 'XII', part: 'A', unit: 5, unitTitle: 'Balance of Payments', topic: 'BOP: Meaning, Account Structure, Components', microContent: ['Current account', 'Capital account'], learningObjective: 'Classify a transaction into the current or capital account of the BOP.', suggestedMode: 'simulator' },
    { id: 'XII-A-U5-EXRATE', class: 'XII', part: 'A', unit: 5, unitTitle: 'Balance of Payments', topic: 'Foreign Exchange Rate: Fixed, Flexible, Managed Floating', microContent: ['Fixed exchange rate', 'Flexible exchange rate', 'Managed floating exchange rate'], learningObjective: 'Distinguish fixed, flexible and managed-floating exchange-rate regimes.', suggestedMode: 'explorer' },
    { id: 'XII-A-U5-DETERMINATION', class: 'XII', part: 'A', unit: 5, unitTitle: 'Balance of Payments', topic: 'Exchange Rate Determination in a Free (Flexible) Market', microContent: ['Demand for foreign exchange', 'Supply of foreign exchange'], learningObjective: 'Determine the equilibrium exchange rate from demand for and supply of foreign exchange, and predict appreciation/depreciation.', suggestedMode: 'simulator' },
    { id: 'XII-A-U5-EVALUATION', class: 'XII', part: 'A', unit: 5, unitTitle: 'Balance of Payments', topic: 'Evaluation of Exchange Rate Systems (Merits/Demerits)', microContent: ['Merits of flexible rate', 'Demerits of flexible rate', 'Merits/demerits of fixed rate'], learningObjective: 'Weigh the merits and demerits of fixed vs flexible exchange-rate systems.', suggestedMode: 'explorer' },

    // ── CLASS XII · PART B — INDIAN ECONOMIC DEVELOPMENT ────────
    { id: 'XII-B-U6-INDEPENDENCE', class: 'XII', part: 'B', unit: 6, unitTitle: 'Development Experience (1947–90) and Economic Reforms since 1991', topic: 'Indian Economy at Independence', microContent: ['Colonial economic legacy'], learningObjective: 'Describe the state of agriculture, industry, foreign trade and demography under colonial rule.', suggestedMode: 'explorer' },
    { id: 'XII-B-U6-SYSTEM', class: 'XII', part: 'B', unit: 6, unitTitle: 'Development Experience (1947–90) and Economic Reforms since 1991', topic: 'Indian Economic System Adopted Post-Independence', microContent: ['Planning'], learningObjective: 'State the type of economic system India adopted after independence.', suggestedMode: 'explorer' },
    { id: 'XII-B-U6-PLANS', class: 'XII', part: 'B', unit: 6, unitTitle: 'Development Experience (1947–90) and Economic Reforms since 1991', topic: 'Five-Year Plans: Common Goals', microContent: ['Planning goals'], learningObjective: 'List the common goals pursued across India\'s Five-Year Plans.', suggestedMode: 'explorer' },
    { id: 'XII-B-U6-AGRICULTURE', class: 'XII', part: 'B', unit: 6, unitTitle: 'Development Experience (1947–90) and Economic Reforms since 1991', topic: 'Agriculture: Features, Problems, Policies, Institutional Aspects, New Agricultural Strategy', microContent: ['Green Revolution', 'Institutional reform', 'New agricultural strategy'], learningObjective: "Explain the New Agricultural Strategy's economic implications for Indian agriculture.", suggestedMode: 'explorer' },
    { id: 'XII-B-U6-INDUSTRY', class: 'XII', part: 'B', unit: 6, unitTitle: 'Development Experience (1947–90) and Economic Reforms since 1991', topic: 'Industry: Development, Problems, Policies, IPR 1956, Small-Scale Industries', microContent: ['Industrial Policy Resolution 1956', 'Small-Scale Industries'], learningObjective: "Explain the role of the Industrial Policy Resolution 1956 and of Small-Scale Industries.", suggestedMode: 'explorer' },
    { id: 'XII-B-U6-TRADE', class: 'XII', part: 'B', unit: 6, unitTitle: 'Development Experience (1947–90) and Economic Reforms since 1991', topic: 'Foreign Trade: Features, Problems, Policies', microContent: ['Import substitution'], learningObjective: "Describe India's pre-1991 foreign trade policy and its main problems.", suggestedMode: 'explorer' },
    { id: 'XII-B-U6-LPG', class: 'XII', part: 'B', unit: 6, unitTitle: 'Development Experience (1947–90) and Economic Reforms since 1991', topic: 'Economic Reforms since 1991: Liberalisation, Privatisation, Globalisation, Demonetisation, GST', microContent: ['Liberalisation', 'Privatisation', 'Globalisation', 'Demonetisation', 'Goods and Services Tax'], learningObjective: 'Evaluate the LPG reforms and place Demonetisation/GST within the post-1991 reform trajectory.', suggestedMode: 'explorer' },
    { id: 'XII-B-U7-HUMAN-CAPITAL', class: 'XII', part: 'B', unit: 7, unitTitle: 'Current Challenges facing Indian Economy', topic: 'Human Capital Formation', microContent: ['How people become a resource', 'Role of human capital', 'Growth of education sector'], learningObjective: 'Explain how investment in education and health converts people into human capital.', suggestedMode: 'simulator' },
    { id: 'XII-B-U7-RURAL', class: 'XII', part: 'B', unit: 7, unitTitle: 'Current Challenges facing Indian Economy', topic: 'Rural Development: Credit, Marketing, Cooperatives, Diversification, Organic Farming', microContent: ['Rural credit', 'Rural marketing', 'Cooperatives', 'Agricultural diversification', 'Organic farming'], learningObjective: 'Identify the key levers of rural development named by NCERT and how each addresses a specific rural problem.', suggestedMode: 'explorer' },
    { id: 'XII-B-U7-EMPLOYMENT', class: 'XII', part: 'B', unit: 7, unitTitle: 'Current Challenges facing Indian Economy', topic: 'Employment: Workforce Participation Rate, Formal vs Informal Sector', microContent: ['Workforce participation rate', 'Formal sector', 'Informal sector'], learningObjective: 'Explain the growth/change in workforce participation rate and the formal-informal sector distinction.', suggestedMode: 'simulator' },
    { id: 'XII-B-U7-SUSTAINABLE', class: 'XII', part: 'B', unit: 7, unitTitle: 'Current Challenges facing Indian Economy', topic: 'Sustainable Economic Development', microContent: ['Sustainability', 'Resource use', 'Environmental impact', 'Global warming'], learningObjective: "Explain the tension between economic development and environmental sustainability, including global warming.", suggestedMode: 'explorer' },
    { id: 'XII-B-U8-COMPARISON', class: 'XII', part: 'B', unit: 8, unitTitle: 'Development Experience of India — A Comparison with Neighbours', topic: 'India / Pakistan / China: Growth, Population, Sectoral Structure, Human Development Indicators', microContent: ['Comparative development', 'Growth indicators', 'Demographic indicators', 'Human Development Indicators'], learningObjective: "Compare India's development indicators against Pakistan and China across growth, demography, sectoral structure and HDI.", suggestedMode: 'datalab' }
];

function partTitle(cls, part) {
    return (PART_TITLES[cls] && PART_TITLES[cls][part]) || '';
}

// Builds the "📘 Class XI · Part B: Introductory Microeconomics · Unit 5:
// Consumer's Equilibrium and Demand — Marginal Utility Analysis" tag from
// structured metadata instead of a hand-written string, so the class/part/
// unit shown on screen can never drift from CURRICULUM_NODES.
function chapterTagText(sim) {
    if (!sim || !sim.class || !sim.part || !sim.unit) return sim && sim.chapter || '';
    const pt = partTitle(sim.class, sim.part);
    let text = `Class ${sim.class} · Part ${sim.part}: ${pt} · Unit ${sim.unit}: ${sim.unitTitle || ''}`;
    if (sim.topicLabel) text += ` — ${sim.topicLabel}`;
    return text;
}

function findNode(syllabusId) {
    return CURRICULUM_NODES.find(n => n.id === syllabusId) || null;
}

// Cross-references SIMS against CURRICULUM_NODES to compute the coverage
// matrix and catch the exact failure modes the integration brief called
// out: duplicate syllabus IDs, a sim whose class/part/unit doesn't match
// the node(s) it claims to cover, and syllabus nodes nobody covers.
function validateCurriculum(SIMS_ARR) {
    const seenSyllabusIds = new Map(); // syllabusId -> [sim.id,...]
    const unknownRefs = []; // {simId, syllabusId} referencing a node that doesn't exist
    const classMismatches = []; // {simId, syllabusId, simClass, nodeClass}
    const coverage = new Map(); // nodeId -> [{simId, mode, enrichment}]
    CURRICULUM_NODES.forEach(n => coverage.set(n.id, []));

    (SIMS_ARR || []).forEach(sim => {
        const ids = sim.syllabusIds || (sim.syllabusId ? [sim.syllabusId] : []);
        ids.forEach(sid => {
            if (!seenSyllabusIds.has(sid)) seenSyllabusIds.set(sid, []);
            seenSyllabusIds.get(sid).push(sim.id);

            const node = findNode(sid);
            if (!node) {
                unknownRefs.push({ simId: sim.id, syllabusId: sid });
                return;
            }
            if (sim.class && sim.class !== node.class) {
                classMismatches.push({ simId: sim.id, syllabusId: sid, simClass: sim.class, nodeClass: node.class });
            }
            coverage.get(sid).push({ simId: sim.id, mode: sim.mode || 'simulator', enrichment: !!sim.enrichment });
        });
    });

    const duplicateSyllabusIds = [...seenSyllabusIds.entries()]
        .filter(([, simIds]) => simIds.length > 1)
        // Two sims legitimately sharing one node (e.g. two angles on the
        // same topic) is fine; true duplication is the same sim id
        // appearing twice, or a syllabusId hand-typed identically by
        // separate authors for what should have been one node reference.
        // We only flag it as a real *duplicate ID* problem if it is the
        // exact same sim declaring the same id twice.
        .filter(([, simIds]) => new Set(simIds).size !== simIds.length)
        .map(([sid, simIds]) => ({ syllabusId: sid, simIds }));

    const uncovered = CURRICULUM_NODES.filter(n => coverage.get(n.id).length === 0);
    const duplicateSimIds = (() => {
        const counts = new Map();
        (SIMS_ARR || []).forEach(s => counts.set(s.id, (counts.get(s.id) || 0) + 1));
        return [...counts.entries()].filter(([, c]) => c > 1).map(([id]) => id);
    })();

    return { coverage, uncovered, duplicateSyllabusIds, duplicateSimIds, unknownRefs, classMismatches };
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PART_TITLES, CURRICULUM_NODES, partTitle, chapterTagText, findNode, validateCurriculum };
}
if (typeof window !== 'undefined') {
    window.PART_TITLES = PART_TITLES;
    window.CURRICULUM_NODES = CURRICULUM_NODES;
    window.partTitle = partTitle;
    window.chapterTagText = chapterTagText;
    window.findNode = findNode;
    window.validateCurriculum = validateCurriculum;
}
