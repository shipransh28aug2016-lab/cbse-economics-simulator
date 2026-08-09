// Polyfill / utility to safely toggle screens based on id
function showScreen(screenId) {
    const screens = document.querySelectorAll('.screen, .view');
    screens.forEach(s => {
        s.classList.remove('active');
        s.classList.add('hidden');
    });

    // Check for both screen- prefix and -view suffix to support index.html and system_test.html
    const targetScreen = document.getElementById(`screen-${screenId}`) || document.getElementById(`${screenId}-view`);
    if (targetScreen) {
        targetScreen.classList.add('active');
        targetScreen.classList.remove('hidden');
    }
}

// Language toggle for the 🌐 nav button. Full sentence-level translation
// depends on the i18n engine/data files (js/i18n_engine.js, js/i18n_hi.js),
// which currently ship as stubs. This keeps the toggle functional (no
// crash) and updates the parts of the UI that don't need a translation
// dictionary: the button label itself and the document's language tag.
let currentLang = localStorage.getItem('econsim-lang') || 'en';

function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('econsim-lang', lang);
    document.documentElement.lang = lang === 'hi' ? 'hi' : 'en';

    const btn = document.getElementById('lang-toggle');
    if (btn) {
        btn.textContent = lang === 'hi' ? '🌐 English' : '🌐 हिन्दी';
    }

    if (typeof window.i18nApply === 'function') {
        // Hook for a fuller i18n engine, if/when one is implemented.
        window.i18nApply(lang);
    }
}

function toggleLanguage() {
    applyLanguage(currentLang === 'hi' ? 'en' : 'hi');
}

function openSim(simId) {
    const sim = typeof SIMS !== 'undefined' ? SIMS.find(s => s.id === simId) : null;
    if (sim) {
        showScreen('sim');
        const titleElIndex = document.getElementById('sim-title-nav');
        const titleElSys = document.getElementById('sim-title');

        if (titleElIndex) titleElIndex.innerText = sim.title;
        if (titleElSys) titleElSys.innerText = sim.title;

        const tagEl = document.getElementById('sim-module-tag');
        if (tagEl) {
            tagEl.innerText = sim.module.toUpperCase();
        }
    }
}

function initApp() {
    applyLanguage(currentLang);

    // Populate grids in index.html
    const grids = {
        'micro': document.getElementById('grid-micro'),
        'macro': document.getElementById('grid-macro'),
        'stats': document.getElementById('grid-stats'),
        'india': document.getElementById('grid-india'),
        'all': document.getElementById('sim-grid') // for system_test.html
    };

    if (typeof SIMS !== 'undefined') {
        SIMS.forEach(sim => {
            // Note: each grid needs its own card element with its own click
            // handler attached directly. cloneNode(true) does NOT copy
            // JS-assigned event handlers (like .onclick), so cards created
            // by cloning were previously unresponsive to clicks.
            if (grids[sim.module]) {
                const card = document.createElement('div');
                card.className = 'sim-card';
                card.innerHTML = `<h3>${sim.title}</h3><p>${sim.desc}</p>`;
                card.onclick = () => openSim(sim.id);
                grids[sim.module].appendChild(card);
            }
            if (grids['all']) {
                const sysCard = document.createElement('div');
                sysCard.className = 'sim-card';
                sysCard.innerHTML = `<h3>${sim.title}</h3><p>${sim.desc}</p>`;
                sysCard.onclick = () => openSim(sim.id);
                grids['all'].appendChild(sysCard);
            }
        });
    }

    // Attach back button behaviors
    const backBtnIndex = document.getElementById('sim-back');
    if (backBtnIndex) {
        backBtnIndex.addEventListener('click', () => {
            showScreen('home');
        });
    }

    const backBtnSys = document.getElementById('back-btn');
    if (backBtnSys) {
        backBtnSys.addEventListener('click', () => {
            showScreen('home');
        });
    }
}

// Global hook
document.addEventListener('DOMContentLoaded', initApp);

// Add canvas drawing functionality for scratch.txt references
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('sim-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Simulate drawing
    const W = canvas.width = 800;
    const H = canvas.height = 600;

    // Some basic drawing functions for the sim
    function drawNodes() {
        const nodes = [];
        const s = 4;
        if(s>=2){ nodes.push({label:'Households\\n🏠',x:W*0.18,y:H*0.5,color:'#10b981'}); nodes.push({label:'Firms\\n🏭',x:W*0.82,y:H*0.5,color:'#818cf8'}); }
        if(s>=3) nodes.push({label:'Government\\n🏛️',x:W*0.5,y:H*0.15,color:'#f59e0b'});
        if(s>=4) nodes.push({label:'Foreign Sector\\n🌍',x:W*0.5,y:H*0.85,color:'#f97316'});

        nodes.forEach(n=>{
            const lines=n.label.split('\\n');
            ctx.save();
            ctx.fillStyle=n.color+'22';
            ctx.strokeStyle=n.color;
            ctx.lineWidth=2;
            const W2=90,H2=55;
            ctx.beginPath();
            ctx.roundRect(n.x-W2/2,n.y-H2/2,W2,H2,12);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle=n.color;
            ctx.font='bold 12px Inter';
            ctx.textAlign='center';
            lines.forEach((l,i)=>ctx.fillText(l,n.x,n.y-8+i*18));
            ctx.restore();
        });
    }

    function drawGap() {
        const Ystar = 100, Yfe = 80;
        const gapLabel=Ystar>Yfe?'Inflationary\\nGap':'Deflationary\\nGap';
        const gx1 = 200, gx2 = 300, gy = 400;
        ctx.fillText(gapLabel.split('\\n').join(' '), (gx1+gx2)/2, gy-20);
    }

    function drawBars() {
        const revR = 100, totalR = 150, rexp = 90, totalExp = 140;
        const bars=[{l:'Revenue\\nReceipts',v:revR,c:'#10b981'},{l:'Total\\nReceipts',v:totalR,c:'#34d399'},{l:'Revenue\\nExpenditure',v:rexp,c:'#f87171'},{l:'Total\\nExpenditure',v:totalExp,c:'#f97316'}];

        bars.forEach((b, i) => {
            const bx = 100 + i * 80;
            const barW = 40;
            b.l.split('\\n').forEach((l,j)=>ctx.fillText(l,bx+barW/2,H-55+j*12));
        });
    }

    function labelPoint(ctx, x, y, label, color) {
        ctx.fillStyle = color;
        ctx.fillText(label, x, y);
    }

    drawNodes();
    drawGap();
    drawBars();
    labelPoint(ctx, 100, 100, 'Perfect\\nEquality'.split('\\n').join(' '), 'rgba(0,0,0,1)');
});
