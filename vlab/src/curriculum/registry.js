// ══════════════════════════════════════════════════════════════
// CBSE V-LAB — curriculum registry (spec §2 / §14 / §28).
//
// This is the machine-checkable twin of
// vlab/data/curriculum/cbse-2026-27-chemistry.json — that JSON file is
// the human-readable audit document; this file is what the app and
// tools/test-vlab.js actually load (dual module.exports/window export,
// same reasoning as js/curriculum-data.js in the parent EconSim Pro
// app: avoids fetch()-ing local JSON, which Chrome blocks under
// file://). If the two ever disagree, treat the JSON as the source of
// intent and fix this file to match it.
//
// Every Experiment (vlab/src/experiments/*.js) must declare a
// `curriculumMapping` whose `topicId` resolves to a node here — the
// audit in tools/test-vlab.js fails otherwise.
// ══════════════════════════════════════════════════════════════

(function (root) {
    'use strict';

    // CONTENT_STATUS ladder (spec §27): draft -> review -> verified ->
    // published -> deprecated. Nothing below is "verified" yet because
    // the official CBSE 2026-27 Chemistry (043) Practical syllabus PDF
    // has not been supplied to this repo for cross-check (mirrors how
    // the parent app's CLAUDE.md treats its own taxonomy file as the
    // thing that must exist before anything is marked verified).
    const CURRICULUM_NODES = [
        {
            id: 'XII-CHEM-VOLUMETRIC-PERMANGANOMETRY',
            curriculumYear: '2026-27',
            board: 'CBSE',
            class: 'XII',
            subject: 'Chemistry',
            subjectCode: '043',
            unit: 'Practicals — Volumetric Analysis',
            topic: 'Standardization of an unknown KMnO4 solution by titration against a standard oxalic acid solution (permanganometry)',
            contentStatus: 'review',
            verificationStatus: 'needs-review',
            sourceReference: 'NCERT Chemistry Practical Manual, Class XII — Volumetric Analysis (redox/permanganometric titration). Needs cross-check against the official CBSE 2026-27 Chemistry (043) Practical syllabus PDF once it is added to this repo.',
            lastVerified: null,
            verifiedBy: null
        }
    ];

    function findNode(id) {
        return CURRICULUM_NODES.find(n => n.id === id) || null;
    }

    // Mirrors js/curriculum-data.js's validateCurriculum: run against
    // whatever list of Experiment objects the caller has loaded, so
    // this file stays subject/experiment-agnostic.
    function validateCurriculumRegistry(experiments) {
        const list = experiments || [];
        const seenExperimentIds = new Map();
        const unknownRefs = [];
        const classMismatches = [];
        const missingFields = [];
        const coverage = new Map(CURRICULUM_NODES.map(n => [n.id, []]));

        const REQUIRED_EXPERIMENT_FIELDS = [
            'id', 'class', 'subject', 'title', 'curriculumMapping',
            'objective', 'apparatus', 'procedure', 'observationModel',
            'expectedResult', 'safety', 'viva', 'assessment'
        ];

        list.forEach(exp => {
            seenExperimentIds.set(exp.id, (seenExperimentIds.get(exp.id) || 0) + 1);

            REQUIRED_EXPERIMENT_FIELDS.forEach(f => {
                const v = exp[f];
                const empty = v == null || (Array.isArray(v) && v.length === 0);
                if (empty) missingFields.push({ experimentId: exp.id, field: f });
            });

            const topicId = exp.curriculumMapping && exp.curriculumMapping.topicId;
            const node = topicId ? findNode(topicId) : null;
            if (!node) {
                unknownRefs.push({ experimentId: exp.id, topicId: topicId || null });
                return;
            }
            if (exp.class && exp.class !== node.class) {
                classMismatches.push({ experimentId: exp.id, topicId, expClass: exp.class, nodeClass: node.class });
            }
            coverage.get(topicId).push(exp.id);
        });

        const duplicateExperimentIds = [...seenExperimentIds.entries()]
            .filter(([, count]) => count > 1)
            .map(([id]) => id);

        const orphanedTopics = CURRICULUM_NODES
            .filter(n => coverage.get(n.id).length === 0)
            .map(n => n.id);

        return {
            experimentCount: list.length,
            verified: list.filter(e => (e.curriculumMapping || {}).verificationStatus === 'verified').length,
            needsReview: list.filter(e => (e.curriculumMapping || {}).verificationStatus !== 'verified').length,
            coverage, orphanedTopics, duplicateExperimentIds, unknownRefs, classMismatches, missingFields
        };
    }

    const api = { CURRICULUM_NODES, findNode, validateCurriculumRegistry };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    }
    if (root) {
        root.VLAB = root.VLAB || {};
        root.VLAB.curriculum = api;
    }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : null));
