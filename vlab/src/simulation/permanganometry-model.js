// ══════════════════════════════════════════════════════════════
// CBSE V-LAB — Class XII Chemistry (043), Volumetric Analysis
// Simulation model: standardizing an unknown KMnO4 solution against a
// standard oxalic acid solution (permanganometric redox titration).
//
// Pure, deterministic, DOM-free functions only — no rendering, no
// state, no randomness beyond the explicit seeded PRNG below. This is
// the file tools/test-vlab.js sweeps for scientific correctness.
// Works as a plain <script> (assigns to window) and under Node
// (module.exports), mirroring js/curriculum-data.js's dual-export
// pattern in the parent EconSim Pro app — chosen so the app keeps
// working from file:// with no fetch() of local data.
//
// ── Chemistry model ──────────────────────────────────────────
// Reaction (acidic medium):
//   2 KMnO4 + 3 H2SO4 + 5 H2C2O4 → K2SO4 + 2 MnSO4 + 10 CO2 + 8 H2O
// n-factors: KMnO4 (Mn7+ -> Mn2+) = 5 e-; oxalic acid (C2O4^2- -> 2CO2) = 2 e-.
// At the equivalence point, milliequivalents are equal:
//   5 * M(KMnO4) * V(KMnO4) = 2 * M(oxalic) * V(oxalic)
// KMnO4 is self-indicating: it is decolourised (Mn2+, near colourless)
// while oxalic acid is still in excess, and the first drop past the
// equivalence point leaves a permanent light pink because there is
// nothing left to reduce it.
//
// Source: NCERT Chemistry Practical Manual, Class XII — Volumetric
// Analysis (permanganometry). CONTENT_STATUS: needs-review — cross
// check exact wording/experiment numbering against the official CBSE
// 2026-27 Chemistry (043) Practical syllabus PDF once it is added to
// this repo (see src/curriculum/registry.js and CURRICULUM.md).
// ══════════════════════════════════════════════════════════════

(function (root) {
    'use strict';

    // ── Constants (fixed apparatus/reagent parameters for this experiment) ──
    const OXALIC_ACID_MOLAR_MASS = 126.07;   // g/mol, H2C2O4·2H2O (dihydrate)
    const STANDARD_OXALIC_MOLARITY = 0.05;   // mol/L (M/20), the prepared standard
    const ALIQUOT_VOLUME_ML = 10;            // mL of standard oxalic acid pipetted per trial
    const OXALIC_N_FACTOR = 2;
    const KMNO4_N_FACTOR = 5;
    const MIN_SAFE_TEMP_C = 60;
    const MAX_SAFE_TEMP_C = 90;              // oxalic acid begins decomposing above this
    const BURETTE_CAPACITY_ML = 50;

    // Realistic unknown-sample molarities a school might issue (mol/L).
    // Not curriculum content — an experimental-sample parameter, freely
    // chosen within a chemically sane range for an "N/10-ish" KMnO4 stock.
    const UNKNOWN_MOLARITY_CANDIDATES = [0.016, 0.018, 0.020, 0.022, 0.024];

    // Small deterministic PRNG (mulberry32) so "pick an unknown sample"
    // is reproducible from a seed — used by tests and by "new sample".
    function mulberry32(seed) {
        let a = seed >>> 0;
        return function () {
            a |= 0; a = (a + 0x6D2B79F5) | 0;
            let t = Math.imul(a ^ (a >>> 15), 1 | a);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    function pickUnknownMolarity(seed) {
        const rand = mulberry32(seed >>> 0);
        const idx = Math.floor(rand() * UNKNOWN_MOLARITY_CANDIDATES.length);
        return UNKNOWN_MOLARITY_CANDIDATES[Math.min(idx, UNKNOWN_MOLARITY_CANDIDATES.length - 1)];
    }

    // Mass (g) of oxalic acid dihydrate crystals needed to prepare
    // `volumeLitres` of `molarity` mol/L standard solution.
    function requiredOxalicAcidMassGrams(molarity, volumeLitres) {
        return molarity * volumeLitres * OXALIC_ACID_MOLAR_MASS;
    }

    // The titre volume (mL of KMnO4) at which the flask would reach
    // exact chemical equivalence, given the unknown's true molarity.
    function equivalenceVolumeML(unknownMolarityKMnO4, oxalicMolarity, oxalicVolumeML) {
        oxalicMolarity = oxalicMolarity == null ? STANDARD_OXALIC_MOLARITY : oxalicMolarity;
        oxalicVolumeML = oxalicVolumeML == null ? ALIQUOT_VOLUME_ML : oxalicVolumeML;
        if (!(unknownMolarityKMnO4 > 0)) return Infinity;
        return (OXALIC_N_FACTOR * oxalicMolarity * oxalicVolumeML) / (KMNO4_N_FACTOR * unknownMolarityKMnO4);
    }

    // Inverse: molarity of KMnO4 implied by an observed titre volume.
    function computeMolarityFromTitration(titreVolumeML, oxalicMolarity, oxalicVolumeML) {
        oxalicMolarity = oxalicMolarity == null ? STANDARD_OXALIC_MOLARITY : oxalicMolarity;
        oxalicVolumeML = oxalicVolumeML == null ? ALIQUOT_VOLUME_ML : oxalicVolumeML;
        if (!(titreVolumeML > 0) || !isFinite(titreVolumeML)) return NaN;
        return (OXALIC_N_FACTOR * oxalicMolarity * oxalicVolumeML) / (KMNO4_N_FACTOR * titreVolumeML);
    }

    // The dynamic state of the conical flask as the student titrates.
    // Pure function of the current apparatus/control state — no
    // hidden mutable state, so the UI can call it on every input event.
    function flaskState(input) {
        const {
            volumeAddedML = 0,
            equivalenceVolumeML: eqV,
            temperatureC = 25,
            sulfuricAcidAdded = false,
            isStirring = true
        } = input;

        const warnings = [];
        let colorState;
        let colorHex;
        let reactionRateFactor = 1;

        if (!sulfuricAcidAdded) {
            warnings.push('No dilute H2SO4 has been added — without an acidic medium, KMnO4 is reduced to brown MnO2 precipitate instead of colourless Mn2+, ruining the titration. Add ~5 mL dilute H2SO4 before titrating.');
            return { colorState: 'error-no-acid', colorHex: '#6b4a2a', reactionRateFactor: 0, warnings, localColorArtifact: false };
        }

        if (temperatureC > MAX_SAFE_TEMP_C) {
            warnings.push('Above ~90°C oxalic acid decomposes before it can react with KMnO4 — the titre will be unreliable. Let the flask cool to 60-70°C.');
            reactionRateFactor = 0.15;
        } else if (temperatureC < MIN_SAFE_TEMP_C) {
            warnings.push('Below 60°C the reaction is very slow — each drop of KMnO4 will take a long time to decolourise, and it is easy to mistake a slow-fading drop for the endpoint. Heat the flask to 60-70°C.');
            reactionRateFactor = Math.max(0.05, temperatureC / MIN_SAFE_TEMP_C * 0.4);
        }

        const eq = eqV > 0 ? eqV : Infinity;
        const ratio = isFinite(eq) ? volumeAddedML / eq : 0;

        let localColorArtifact = false;
        if (volumeAddedML <= 0) {
            colorState = 'colorless'; colorHex = '#f2f5f0';
        } else if (ratio < 0.98) {
            colorState = 'colorless'; colorHex = '#f4efe2';
            if (!isStirring) {
                localColorArtifact = true;
                warnings.push('Without swirling, the last drop can look pink right where it lands even though the flask is not yet at the endpoint — that colour is local, not a true persistent endpoint. Swirl the flask before reading it.');
            }
        } else if (ratio >= 0.98 && ratio <= 1.02) {
            colorState = 'endpoint'; colorHex = '#f3b6d6';
        } else {
            colorState = 'overshot'; colorHex = '#a31a63';
            warnings.push('Overshot the endpoint — this deep, non-fading pink/purple means excess KMnO4 was added. Discard this trial and repeat with a fresh 10 mL aliquot.');
        }

        return { colorState, colorHex, reactionRateFactor, warnings, localColorArtifact, ratio };
    }

    function isValidTitre(volumeML) {
        return isFinite(volumeML) && volumeML > 0 && volumeML <= BURETTE_CAPACITY_ML;
    }

    // Two readings are "concordant" per standard practical convention
    // if they agree within 0.1 mL.
    function areConcordant(titreA, titreB, toleranceML) {
        toleranceML = toleranceML == null ? 0.1 : toleranceML;
        if (!isValidTitre(titreA) || !isValidTitre(titreB)) return false;
        return Math.abs(titreA - titreB) <= toleranceML;
    }

    function gradeTitre(observedTitreML, trueEquivalenceML, toleranceML) {
        toleranceML = toleranceML == null ? 0.2 : toleranceML;
        const errorML = observedTitreML - trueEquivalenceML;
        return { withinTolerance: Math.abs(errorML) <= toleranceML, errorML };
    }

    function validateMolarityAnswer(studentAnswerM, trueMolarity, tolerancePercent) {
        tolerancePercent = tolerancePercent == null ? 5 : tolerancePercent;
        if (!(studentAnswerM > 0) || !isFinite(studentAnswerM)) {
            return { correct: false, percentError: null, reason: 'Enter a positive molarity in mol/L.' };
        }
        const percentError = Math.abs((studentAnswerM - trueMolarity) / trueMolarity) * 100;
        return { correct: percentError <= tolerancePercent, percentError };
    }

    const api = {
        OXALIC_ACID_MOLAR_MASS, STANDARD_OXALIC_MOLARITY, ALIQUOT_VOLUME_ML,
        OXALIC_N_FACTOR, KMNO4_N_FACTOR, MIN_SAFE_TEMP_C, MAX_SAFE_TEMP_C, BURETTE_CAPACITY_ML,
        UNKNOWN_MOLARITY_CANDIDATES,
        pickUnknownMolarity,
        requiredOxalicAcidMassGrams,
        equivalenceVolumeML,
        computeMolarityFromTitration,
        flaskState,
        isValidTitre,
        areConcordant,
        gradeTitre,
        validateMolarityAnswer
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    }
    if (root) {
        root.VLAB = root.VLAB || {};
        root.VLAB.permanganometry = api;
    }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : null));
