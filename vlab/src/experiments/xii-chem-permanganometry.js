// ══════════════════════════════════════════════════════════════
// CBSE V-LAB — Experiment definition (spec §5).
// "Standardization of an unknown KMnO4 solution by titrating it
// against a standard solution of oxalic acid" — CBSE Class XII
// Chemistry (043), Practicals: Volumetric Analysis.
//
// Pure data (apparatus/procedure/viva/assessment text + numeric
// parameters) — no rendering logic lives here; vlab/src/ui/*.js reads
// this object. Dual export, same reasoning as the other src/ files.
// ══════════════════════════════════════════════════════════════

(function (root) {
    'use strict';

    const EXPERIMENT = {
        id: 'xii-chem-permanganometry-v1',
        class: 'XII',
        subject: 'Chemistry',

        curriculumMapping: {
            curriculumYear: '2026-27',
            board: 'CBSE',
            class: 'XII',
            subject: 'Chemistry',
            subjectCode: '043',
            unit: 'Practicals — Volumetric Analysis',
            topicId: 'XII-CHEM-VOLUMETRIC-PERMANGANOMETRY',
            topic: 'Permanganometric titration (self-indicating redox titration)',
            practical: 'Standardization of an unknown KMnO4 solution against a standard oxalic acid solution',
            learningObjectives: [
                'Prepare a standard solution of oxalic acid of exact known molarity by accurate weighing and volumetric dilution.',
                'Standardize an unknown KMnO4 solution by titrating it against the standard oxalic acid solution, using KMnO4 itself as the internal (self) indicator.',
                'Explain why the reaction mixture must be acidified with dilute H2SO4 and heated to 60-70°C before titrating.',
                'Calculate the molarity of the unknown KMnO4 solution from titre values using normality equivalence (n1M1V1 = n2M2V2).',
                'Identify and explain sources of error in a redox titration (temperature, acidification, overshooting the endpoint).'
            ],
            competencies: [
                'Quantitative reasoning with stoichiometry and equivalence',
                'Experimental design, procedural sequencing and error analysis',
                'Accurate data recording and unit-consistent calculation'
            ],
            sourceReference: 'NCERT Chemistry Practical Manual, Class XII — Volumetric Analysis (permanganometry). Needs cross-check against the official CBSE 2026-27 Chemistry (043) Practical syllabus PDF once added to this repo.',
            verificationStatus: 'needs-review'
        },

        title: 'Standardization of KMnO₄ Using Oxalic Acid',
        objective: [
            'Determine the molarity (strength) of a given unknown KMnO₄ solution by titrating it against a standard solution of oxalic acid.'
        ],

        apparatus: [
            { id: 'burette', name: 'Burette (50 mL) with stopcock', use: 'Delivers the KMnO4 solution drop-wise and measures the titre volume.' },
            { id: 'pipette', name: 'Volumetric pipette (10 mL)', use: 'Transfers an exact 10 mL aliquot of standard oxalic acid solution into the conical flask.' },
            { id: 'conical-flask', name: 'Conical flask (250 mL)', use: 'Holds the oxalic acid aliquot during titration; swirled to mix as KMnO4 is added.' },
            { id: 'volumetric-flask', name: 'Volumetric flask (250 mL)', use: 'Used to prepare the standard oxalic acid solution to an exact volume.' },
            { id: 'balance', name: 'Chemical/analytical balance', use: 'Weighs the oxalic acid crystals accurately for the standard solution.' },
            { id: 'burner', name: 'Burner / water bath', use: 'Heats the flask to 60-70°C before titrating (the reaction is too slow cold).' },
            { id: 'thermometer', name: 'Thermometer (0-110°C)', use: 'Monitors the flask temperature so it stays in the 60-90°C safe reaction range.' },
            { id: 'clamp-stand', name: 'Clamp stand with burette clamp', use: 'Holds the burette vertically over the flask.' },
            { id: 'glass-rod', name: 'Glass stirring rod', use: 'Dissolves the weighed oxalic acid crystals when preparing the standard solution.' },
            { id: 'wash-bottle', name: 'Wash bottle (distilled water)', use: 'Rinses glassware and washes down the sides of the flask during titration.' }
        ],
        materials: [
            { id: 'oxalic-acid', name: 'Oxalic acid crystals (H2C2O4·2H2O)', hazard: 'Mildly toxic if ingested; wash hands after handling.' },
            { id: 'dilute-h2so4', name: 'Dilute sulfuric acid (~2N)', hazard: 'Corrosive — causes burns on skin/eye contact.' },
            { id: 'unknown-kmno4', name: 'Unknown KMnO4 solution (in burette)', hazard: 'Strong oxidizer; stains skin and clothing purple-brown.' },
            { id: 'distilled-water', name: 'Distilled water', hazard: 'None.' }
        ],

        variables: [
            { id: 'volumeAddedML', label: 'KMnO4 added (burette reading)', unit: 'mL', min: 0, max: 50, step: 0.1 },
            { id: 'temperatureC', label: 'Flask temperature', unit: '°C', min: 20, max: 100, step: 1, default: 25 },
            { id: 'sulfuricAcidAdded', label: 'Dilute H2SO4 added', type: 'boolean', default: false },
            { id: 'isStirring', label: 'Swirling the flask', type: 'boolean', default: true }
        ],

        procedure: [
            { step: 1, text: 'Rinse the burette with a little KMnO4 solution and the pipette with oxalic acid solution before use.' },
            { step: 2, text: 'Weigh out the required mass of oxalic acid crystals and dissolve to prepare exactly 250 mL of M/20 (0.05 M) standard solution in the volumetric flask.' },
            { step: 3, text: 'Fill the burette with the given (unknown) KMnO4 solution up to the zero mark, removing any air bubble from the jet.' },
            { step: 4, text: 'Pipette out exactly 10.0 mL of the standard oxalic acid solution into a clean conical flask.' },
            { step: 5, text: 'Add about 5 mL of dilute H2SO4 to the flask to acidify it.' },
            { step: 6, text: 'Heat the flask gently to 60-70°C — hot to the touch, not boiling.' },
            { step: 7, text: 'Titrate the hot, acidified oxalic acid against KMnO4 from the burette, adding it drop by drop with constant swirling, until a permanent light pink colour persists for about 30 seconds.' },
            { step: 8, text: 'Record the initial and final burette readings; the difference is the titre volume for this trial.' },
            { step: 9, text: 'Repeat the titration to obtain at least two concordant readings (within 0.1 mL of each other).' },
            { step: 10, text: 'Calculate the molarity of the KMnO4 solution from the mean concordant titre.' }
        ],

        // How the burette/flask control state maps onto observable
        // error conditions — read by vlab/src/ui/workspace.js and
        // checked in tools/test-vlab.js.
        errorSimulation: [
            { trigger: 'sulfuricAcidAdded=false while titrating', feedback: 'Incorrect medium. Why? KMnO4 needs an acidic medium (dilute H2SO4) to be reduced cleanly to colourless Mn2+; without it, a brown MnO2 precipitate forms instead. Add the acid and try again.' },
            { trigger: 'temperatureC < 60 while titrating', feedback: 'Too slow to read reliably. Why? Below 60°C the reaction between KMnO4 and oxalic acid is slow, so a fading drop can be mistaken for the permanent endpoint. Heat the flask to 60-70°C.' },
            { trigger: 'temperatureC > 90', feedback: 'Too hot. Why? Above ~90°C oxalic acid starts to decompose before it can react, giving an unreliable titre. Let the flask cool slightly.' },
            { trigger: 'isStirring=false near the endpoint', feedback: 'Reading error risk. Why? Without swirling, a drop can look permanently pink right where it lands even though the rest of the flask is not yet decolourised. Swirl before deciding you have reached the endpoint.' },
            { trigger: 'volumeAddedML overshoots equivalence by >2%', feedback: 'Overshot the endpoint. Why? Once you pass equivalence there is no more oxalic acid left to reduce the KMnO4, so the flask stays deep pink/purple. Discard this trial and repeat with a fresh 10 mL aliquot.' }
        ],

        simulation: {
            engine: 'permanganometry',
            module: 'VLAB.permanganometry'
        },

        observationModel: {
            fields: [
                { id: 'trialNumber', label: 'Trial', type: 'integer' },
                { id: 'initialReadingML', label: 'Initial burette reading', unit: 'mL', type: 'number' },
                { id: 'finalReadingML', label: 'Final burette reading', unit: 'mL', type: 'number' },
                { id: 'titreVolumeML', label: 'Titre volume (V)', unit: 'mL', type: 'number', derived: 'finalReadingML - initialReadingML' }
            ],
            minTrials: 2,
            concordanceToleranceML: 0.1
        },

        calculations: {
            formula: 'M(KMnO4) = (2 × M(oxalic) × V(oxalic)) / (5 × mean concordant titre)',
            inputs: [
                { id: 'oxalicMolarity', label: 'Molarity of standard oxalic acid', unit: 'mol/L', fixed: 0.05 },
                { id: 'oxalicVolumeML', label: 'Volume of oxalic acid used', unit: 'mL', fixed: 10 },
                { id: 'meanTitreML', label: 'Mean concordant titre volume', unit: 'mL', fromNotebook: true }
            ],
            output: { id: 'kmno4Molarity', label: 'Molarity of KMnO4', unit: 'mol/L' }
        },

        expectedResult: {
            summary: 'The molarity of the unknown KMnO4 solution, calculated from the mean concordant titre using n1M1V1 = n2M2V2.',
            toleranceForCorrectPercent: 5
        },

        safety: [
            { id: 'safety-acid', text: 'Dilute H2SO4 is corrosive — avoid skin/eye contact and always add acid to water, never water to acid. Wear safety goggles.' },
            { id: 'safety-kmno4', text: 'KMnO4 stains skin and clothing purple-brown and is hard to remove — work over a tray and wipe up spills immediately.' },
            { id: 'safety-heat', text: 'Do not overheat the oxalic acid solution — it decomposes above ~90°C. Never let it boil.' },
            { id: 'safety-glass', text: 'Handle hot glassware with tongs or a cloth holder, not bare hands.' },
            { id: 'safety-waste', text: 'Dispose of manganese-containing waste according to your school lab protocol, not directly down the sink.' }
        ],

        viva: [
            {
                question: 'Why is dilute H2SO4, and not dilute HCl, used to acidify the solution in this titration?',
                expectedConcept: 'Cl- ions are themselves oxidized by KMnO4 (to Cl2), consuming extra titrant and giving a falsely high titre; SO4^2- ions are not oxidized under these conditions.',
                difficulty: 'apply',
                answerLogic: 'Compare the oxidizing strength of KMnO4 against the reducing tendency of Cl- vs the inertness of SO4^2-.',
                commonMisconception: 'Any dilute acid works the same for acidifying a redox titration.'
            },
            {
                question: 'Why does the pink colour of each added drop of KMnO4 disappear before the endpoint?',
                expectedConcept: 'Oxalic acid is still present in excess and reduces the incoming MnO4- to nearly colourless Mn2+ as fast as it is added.',
                difficulty: 'understand',
                answerLogic: 'Relate colour disappearance to which reactant is in excess at that point in the titration.',
                commonMisconception: 'The colour fades because KMnO4 is unstable in water.'
            },
            {
                question: 'Why is KMnO4 described as a "self-indicating" titrant?',
                expectedConcept: 'Its own intense purple colour, and the colour of the reduced Mn2+ product, are enough to signal the endpoint — no separate indicator is needed.',
                difficulty: 'remember',
                answerLogic: 'Define self-indicating in terms of the titrant\'s own colour change.',
                commonMisconception: 'Self-indicating means no calculation is needed to find the endpoint.'
            },
            {
                question: 'What would you expect to observe if you titrated at room temperature instead of heating the flask to 60-70°C?',
                expectedConcept: 'The reaction proceeds very slowly at room temperature, so each drop takes a long time to decolourise and it becomes hard to judge the true endpoint.',
                difficulty: 'apply',
                answerLogic: 'Apply reaction-rate/temperature dependence to predict the titration\'s behaviour.',
                commonMisconception: 'Temperature only affects how fast you can finish the experiment, not the reliability of the result.'
            },
            {
                question: 'Why should the flask not be heated above about 90°C before or during titration?',
                expectedConcept: 'Oxalic acid begins to decompose thermally above ~90°C, reducing the amount available to react and giving an inaccurate (too-low) titre.',
                difficulty: 'analyze',
                answerLogic: 'Link thermal decomposition of the reductant to a systematic error in the measured titre.',
                commonMisconception: 'Higher temperature always makes a titration more accurate because the reaction goes faster.'
            },
            {
                question: 'Predict what you would see in the flask if you accidentally added KMnO4 well past the true endpoint.',
                expectedConcept: 'A deep, non-fading pink/purple colour, since excess unreacted KMnO4 remains in solution with nothing left to reduce it.',
                difficulty: 'apply',
                answerLogic: 'Extend the colour-change model past the equivalence point.',
                commonMisconception: 'Overshooting just means the titration finished "extra correctly".'
            },
            {
                question: 'Two students titrating the same unknown obtained titre values of 9.8 mL and 11.3 mL. What is the most likely explanation, and how would you resolve it?',
                expectedConcept: 'The values are not concordant (differ by well over 0.1 mL), suggesting one trial had a procedural error (e.g. missed heating, overshoot, or a reading mistake); repeat the titration until two readings agree within 0.1 mL before averaging.',
                difficulty: 'evaluate',
                answerLogic: 'Apply the concordance criterion to detect and diagnose an outlier trial.',
                commonMisconception: 'Any two titre values can just be averaged regardless of how far apart they are.'
            }
        ],

        assessment: {
            preLab: [
                {
                    id: 'pre-1',
                    type: 'mcq',
                    question: 'Which of these must be added to the oxalic acid flask before titrating with KMnO4?',
                    options: ['Dilute HCl', 'Dilute H2SO4', 'Dilute HNO3', 'Concentrated H2SO4'],
                    correctIndex: 1,
                    explanation: 'HCl and HNO3 are themselves oxidized/reduced by the reagents, introducing error; concentrated H2SO4 is too vigorous and unsafe to add directly. Dilute H2SO4 is inert to both reactants.'
                },
                {
                    id: 'pre-2',
                    type: 'mcq',
                    question: 'Which apparatus is used to transfer an exact 10 mL aliquot of the standard oxalic acid solution?',
                    options: ['Burette', 'Measuring cylinder', 'Volumetric pipette', 'Beaker'],
                    correctIndex: 2,
                    explanation: 'A volumetric pipette delivers a fixed, accurately calibrated volume, unlike a measuring cylinder or beaker.'
                }
            ],
            duringLab: {
                note: 'Procedural decision points (acidification, heating range, swirling, endpoint judgement) are assessed live by the workspace simulation — see errorSimulation above.'
            },
            postLab: [
                {
                    id: 'post-1',
                    type: 'calculation',
                    question: 'Using your mean concordant titre, calculate the molarity of the unknown KMnO4 solution.',
                    checksAgainst: 'kmno4Molarity',
                    tolerancePercent: 5
                },
                {
                    id: 'post-2',
                    type: 'short-answer',
                    question: 'State one source of error in this titration and how it would affect the calculated molarity (too high / too low).',
                    rubricHint: 'Valid answers include: not heating enough (slow fade misread as endpoint), overshooting (too-high titre -> calculated molarity too high if misread as the true titre), overheating (decomposition -> too-low titre), reading the burette meniscus incorrectly.'
                }
            ]
        }
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { EXPERIMENT };
    }
    if (root) {
        root.VLAB = root.VLAB || {};
        root.VLAB.experiments = root.VLAB.experiments || [];
        root.VLAB.experiments.push(EXPERIMENT);
    }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : null));
