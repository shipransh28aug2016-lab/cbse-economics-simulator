// Benchmark comparing Array.includes vs Set.has
const { performance } = require('perf_hooks');

const testCases = [
    { equals: '3,4', val: '4' },
    { equals: 'single', val: 'single' },
    { equals: 'costs,product', val: 'costs' },
    { equals: 'perfect,monopoly,monopolistic', val: 'monopoly' },
    { equals: 'price,income,cross,elasticity,supply,demand', val: 'cross' },
    { equals: 'a,b,c,d,e,f,g,h,i,j', val: 'z' }
];

const simEngineState = {
    sector: '4',
    view: 'single',
    marketType: 'monopoly',
    type: 'cross',
    test: 'z'
};

const rows = testCases.map(tc => ({
    dataset: {
        showWhenId: 'test',
        showWhenEquals: tc.equals
    },
    classList: {
        toggle: () => {}
    }
}));

function applyArrayIncludes() {
    rows.forEach(row => {
        const allowed = row.dataset.showWhenEquals.split(',');
        const match = allowed.includes(String(simEngineState[row.dataset.showWhenId]));
        row.classList.toggle('hidden', !match);
    });
}

function applySetHasDirect() {
    rows.forEach(row => {
        const allowed = new Set(row.dataset.showWhenEquals.split(','));
        const match = allowed.has(String(simEngineState[row.dataset.showWhenId]));
        row.classList.toggle('hidden', !match);
    });
}

function applySetCached() {
    rows.forEach(row => {
        if (!row._allowedSet || row._allowedStr !== row.dataset.showWhenEquals) {
            row._allowedStr = row.dataset.showWhenEquals;
            row._allowedSet = new Set(row.dataset.showWhenEquals.split(','));
        }
        const match = row._allowedSet.has(String(simEngineState[row.dataset.showWhenId]));
        row.classList.toggle('hidden', !match);
    });
}

const ITERATIONS = 1000000;

// Warmup
for (let i = 0; i < 10000; i++) {
    applyArrayIncludes();
    applySetHasDirect();
    applySetCached();
}

console.log(`Running benchmark (${ITERATIONS} iterations)...`);

const startArray = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
    applyArrayIncludes();
}
const endArray = performance.now();
const arrayTime = endArray - startArray;

const startSetDirect = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
    applySetHasDirect();
}
const endSetDirect = performance.now();
const setDirectTime = endSetDirect - startSetDirect;

const startSetCached = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
    applySetCached();
}
const endSetCached = performance.now();
const setCachedTime = endSetCached - startSetCached;

console.log(`Array.includes time     : ${arrayTime.toFixed(2)} ms`);
console.log(`Set.has (direct new Set): ${setDirectTime.toFixed(2)} ms`);
console.log(`Set.has (cached Set)    : ${setCachedTime.toFixed(2)} ms`);
