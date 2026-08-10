// Flat ESLint config for a no-build, plain-<script>-tag codebase — every
// js/*.js file shares one global scope in the browser (see index.html's
// script order), so cross-file globals are declared explicitly below
// rather than using ES modules the app doesn't actually use.
const js = require('@eslint/js');

const appGlobals = {
    // Shared across js/*.js via plain <script> tags, in load order.
    PART_TITLES: 'readonly', CURRICULUM_NODES: 'readonly', partTitle: 'readonly',
    chapterTagText: 'readonly', findNode: 'readonly', validateCurriculum: 'readonly',
    Plotly: 'readonly',
    fmt: 'readonly', range: 'readonly', lineIntersect: 'readonly', seededRand: 'readonly',
    makeRandN: 'readonly', curveOffsetPoint: 'readonly', curvedPathD: 'readonly',
    flowLabelSVG: 'readonly', flowStreamSVG: 'readonly', plotlyDefaultLayout: 'readonly',
    styledAxisTitle: 'readonly', clamp: 'readonly', buildControls: 'readonly',
    applyControlVisibility: 'readonly', renderSimChart: 'readonly', renderSim: 'readonly',
    refreshChallenge: 'readonly', renderPractice: 'readonly', renderChallengeShell: 'readonly',
    describeWhatChanged: 'readonly',
    renderDataLab: 'readonly', renderExplorer: 'readonly',
    SIMS: 'writable',
    showScreen: 'readonly', openSim: 'readonly', applyLanguage: 'readonly',
    toggleLanguage: 'readonly', initApp: 'readonly', currentLang: 'writable'
};

module.exports = [
    js.configs.recommended,
    {
        // Vendored third-party library — not ours to lint or fix.
        ignores: ['js/plotly.min.js']
    },
    {
        files: ['js/**/*.js'],
        ignores: ['js/plotly.min.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'script',
            globals: {
                window: 'readonly', document: 'readonly', console: 'readonly',
                localStorage: 'readonly', fetch: 'readonly', setTimeout: 'readonly',
                module: 'writable', require: 'readonly',
                ...appGlobals
            }
        },
        rules: {
            'no-unused-vars': ['warn', { args: 'none', varsIgnorePattern: '^_' }],
            'no-undef': 'error',
            'no-redeclare': ['error', { builtinGlobals: false }],
            'no-empty': ['warn', { allowEmptyCatch: true }]
        }
    },
    {
        files: ['tools/**/*.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'commonjs',
            globals: { require: 'readonly', module: 'writable', process: 'readonly', console: 'readonly', __dirname: 'readonly' }
        }
    }
];
