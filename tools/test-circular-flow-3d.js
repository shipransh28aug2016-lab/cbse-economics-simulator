// ══════════════════════════════════════════════════════════════
// tools/test-circular-flow-3d.js — the opt-in 3D Circular Flow view
// ══════════════════════════════════════════════════════════════
// Required by tools/test-curriculum.js with its vm context. Rules checked:
//   • the 3D scene is handed exactly the nodes/flows the 2D diagram draws
//     (taken from the REAL macro-gdp customRender, not rebuilt here)
//   • export money flows Foreign→Firms and import money flows Firms→Foreign
//   • no flow label overlaps another label or a sector's name, in any
//     sector/bank combination, in English or Hindi, at every Wages/G/NX
//     extreme (the first version stacked labels on top of one another)
//   • the layout is deterministic and every label sits at a finite point
const vm = require('vm');
const layoutLib = require('../js/circular-flow-layout.js');

module.exports = function runCircularFlow3DTests({ context, ok, SIMS }) {
    const sim = SIMS.find(s => s.id === 'macro-gdp');
    let captured = null;
    vm.runInContext('cf3dModule = { render3DCircularFlow(c, spec) { globalThis.__cf3dSpec = spec; return true; }, unmount3DCircularFlow() {} };', context);
    const lsGet = context.localStorage.getItem;
    context.localStorage.getItem = () => '1';
    const container = { querySelector: () => null, insertAdjacentHTML() {}, innerHTML: '' };
    const specFor = values => { context.__cf3dSpec = null; sim.customRender(container, values); return context.__cf3dSpec; };
    // A deliberately generous width: ~19px per character, like a wide font.
    const measure = (text, h) => h * (String(text).length * 19 + 44) / 60;

    const dirs = {};
    ['en', 'hi'].forEach(lang => {
        context.currentLang = lang;
        ['2', '3', '4'].forEach(sector => ['no', 'yes'].forEach(bank => {
            const tag = `${lang}/${sector}-sector/${bank === 'yes' ? 'bank' : 'no bank'}`;
            const extremes = [[20, 20, 0, -40], [150, 150, 80, 40], [90, 100, 40, 10], [20, 150, 100, -40], [150, 20, 0, 40]];
            let worst = 0, bad = null, nonFinite = false, last = null;
            extremes.forEach(([c, w, g, nx]) => {
                const spec = specFor({ sector, bank, consumption: c, wages: w, saving: 30, g, nx });
                if (!spec) { bad = `${tag}: no spec produced`; return; }
                last = spec;
                const a = layoutLib.layoutFlowLabels(spec, measure), b = layoutLib.layoutFlowLabels(spec, measure);
                if (JSON.stringify(a) !== JSON.stringify(b)) bad = `${tag}: layout is not deterministic`;
                worst = Math.max(worst, a.overlaps);
                if (a.overlaps && !bad) bad = `${tag} (C=${c},W=${w},G=${g},NX=${nx}): ${a.overlaps} overlapping label pair(s)`;
                spec.flows.filter(f => f.value > 0).forEach(f => {
                    const p = a.place[f.id];
                    if (!p || !p.position.every(Number.isFinite)) nonFinite = true;
                });
            });
            ok(!bad && worst === 0, `3D layout ${tag}: no flow label overlaps another label or a sector's name${bad ? ' — ' + bad : ''}`);
            ok(!nonFinite, `3D layout ${tag}: every label has a finite position`);
            if (lang === 'en' && last) dirs[`${sector}/${bank}`] = last;
        }));
    });
    context.currentLang = 'en';

    // The scene draws the model's own sectors and directions.
    const four = dirs['4/yes'], two = dirs['2/no'], three = dirs['3/no'];
    const edge = (spec, id) => { const f = spec.flows.find(x => x.id === id); return f ? `${f.from}>${f.to}` : null; };
    ok(two.nodes.map(n => n.key).join() === 'hh,firm' && three.nodes.map(n => n.key).join() === 'hh,firm,gov' && four.nodes.map(n => n.key).join() === 'hh,firm,gov,bank,foreign', '3D spec: 2-, 3- and 4-sector economies list exactly their own sectors');
    ok(edge(four, 'flow-exp') === 'foreign>firm' && edge(four, 'flow-imp') === 'firm>foreign', '3D spec: export revenue flows Foreign→Firms and import spending Firms→Foreign');
    ok(edge(four, 'flow-saving') === 'hh>bank' && edge(four, 'flow-invest') === 'bank>firm' && edge(four, 'flow-tax') === 'hh>gov' && edge(four, 'flow-gspend') === 'gov>firm', '3D spec: saving and tax leave Households; investment and G reach Firms');
    ok(edge(two, 'flow-cons') === 'hh>firm' && edge(two, 'flow-wage') === 'firm>hh' && edge(two, 'flow-factors') === 'hh>firm' && edge(two, 'flow-goods') === 'firm>hh', '3D spec: real flows run opposite to the money flows they pay for');
    ok(four.flows.every(f => layoutLib.NODE_POS[f.from] && layoutLib.NODE_POS[f.to]), '3D spec: every flow connects two sectors that have an anchor');
    context.localStorage.getItem = lsGet;
    vm.runInContext('cf3dModule = null;', context);
    void captured;
};
