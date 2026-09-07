// ══════════════════════════════════════════════════════════════
// WebGL (Three.js) immersive 3D view for the Circular Flow of Income.
//
// The 2D animated-SVG flow diagram (js/simulations.js, sim 'macro-gdp')
// stays the tested, always-correct default rendering — this file only
// adds an OPT-IN "🌐 3D View" companion rendered from the exact same
// `flows`/`nodes` data, so the two views can never disagree.
//
// Contract: `renderCircularFlow3D(container, flows, nodes)` returns
// `true` if it actually drew something, `false` if WebGL/Three.js
// isn't available (headless test harness, `file://` without WebGL,
// GPU-less CI) — callers must treat `false` as "silently do nothing",
// never as an error. The scene, renderer and geometry are created once
// and reused across calls (re-parenting the same <canvas> into whatever
// container is passed) so repeatedly dragging a slider updates tube
// radii/colors and particle speed in place instead of rebuilding a
// WebGL context every tick (browsers cap concurrent contexts).
// ══════════════════════════════════════════════════════════════
(function (global) {
    let ctx = null; // persists for the life of the page: {renderer, scene, camera, canvas, nodeMeshes, tubes, particleGroups, clock, angle, raf}

    function supported() {
        try {
            if (typeof document === 'undefined' || typeof THREE === 'undefined') return false;
            if (typeof document.createElement !== 'function') return false;
            const c = document.createElement('canvas');
            if (!c || typeof c.getContext !== 'function') return false;
            const gl = c.getContext('webgl2') || c.getContext('webgl') || c.getContext('experimental-webgl');
            return !!gl;
        } catch (e) {
            return false;
        }
    }

    // Maps the flow diagram's 500×390 SVG viewBox coordinates onto a
    // ground plane in 3D space, centered on the origin.
    function mapXZ(x, y) {
        return { x: (x - 250) / 250 * 4.2, z: (y - 195) / 195 * 3.4 };
    }

    function buildCurve(from, to, bend) {
        const p0 = mapXZ(from.x, from.y);
        const p2 = mapXZ(to.x, to.y);
        const mx = (from.x + to.x) / 2, my = (from.y + to.y) / 2;
        const dx = to.x - from.x, dy = to.y - from.y;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const nx = -dy / len, ny = dx / len;
        const pc = mapXZ(mx + nx * bend, my + ny * bend);
        const height = 0.4 + Math.min(1.4, Math.abs(bend) / 40);
        return new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(p0.x, 0.15, p0.z),
            new THREE.Vector3(pc.x, height, pc.z),
            new THREE.Vector3(p2.x, 0.15, p2.z)
        );
    }

    function ensureScene(container) {
        if (ctx) {
            if (ctx.canvas.parentNode !== container) container.appendChild(ctx.canvas);
            return ctx;
        }
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0b1020);
        const camera = new THREE.PerspectiveCamera(45, 4 / 3, 0.1, 100);
        camera.position.set(0, 5.5, 7.5);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(Math.min(2, global.devicePixelRatio || 1));
        container.appendChild(renderer.domElement);

        scene.add(new THREE.AmbientLight(0xffffff, 0.65));
        const dl = new THREE.DirectionalLight(0xffffff, 0.9);
        dl.position.set(4, 8, 4);
        scene.add(dl);

        const floor = new THREE.Mesh(
            new THREE.CircleGeometry(6, 48),
            new THREE.MeshStandardMaterial({ color: 0x131a33, roughness: 1 })
        );
        floor.rotation.x = -Math.PI / 2;
        scene.add(floor);

        ctx = {
            renderer, scene, camera, canvas: renderer.domElement,
            nodeMeshes: {}, tubes: {}, particleGroups: {},
            clock: new THREE.Clock(), angle: 0
        };

        (function animate() {
            ctx.raf = requestAnimationFrame(animate);
            const dt = Math.min(0.1, ctx.clock.getDelta());
            ctx.angle += dt * 0.12;
            ctx.camera.position.x = Math.sin(ctx.angle) * 8.2;
            ctx.camera.position.z = Math.cos(ctx.angle) * 8.2;
            ctx.camera.position.y = 5.5;
            ctx.camera.lookAt(0, 0.4, 0);
            Object.keys(ctx.particleGroups).forEach(id => ctx.particleGroups[id].update(dt));
            ctx.renderer.render(ctx.scene, ctx.camera);
        })();

        return ctx;
    }

    function makeParticleGroup(color, shape) {
        const geo = shape === 'square'
            ? new THREE.BoxGeometry(0.12, 0.12, 0.12)
            : new THREE.SphereGeometry(0.08, 10, 10);
        const mat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.6 });
        const count = 5;
        const meshes = [];
        for (let i = 0; i < count; i++) meshes.push(new THREE.Mesh(geo, mat));
        const state = { curve: null, t: 0, speed: 0.15 };
        return {
            meshes,
            state,
            update(dt) {
                if (!state.curve) return;
                state.t = (state.t + dt * state.speed) % 1;
                meshes.forEach((m, i) => {
                    const tt = (state.t + i / meshes.length) % 1;
                    m.position.copy(state.curve.getPointAt(tt));
                });
            }
        };
    }

    // `flows`: [{ id, from:{x,y}, to:{x,y}, bend, value, color, kind }]
    // `nodes`: { key: { x, y, color } }
    function render(container, flows, nodes) {
        if (!supported() || !container) return false;
        const sc = ensureScene(container);
        const w = container.clientWidth || 480, h = container.clientHeight || 360;
        sc.renderer.setSize(w, h, false);
        sc.camera.aspect = w / h;
        sc.camera.updateProjectionMatrix();

        Object.keys(nodes).forEach(key => {
            const n = nodes[key];
            const p = mapXZ(n.x, n.y);
            let mesh = sc.nodeMeshes[key];
            if (!mesh) {
                mesh = new THREE.Mesh(
                    new THREE.SphereGeometry(0.55, 24, 24),
                    new THREE.MeshStandardMaterial({ color: n.color, emissive: n.color, emissiveIntensity: 0.15, roughness: 0.4 })
                );
                sc.scene.add(mesh);
                sc.nodeMeshes[key] = mesh;
            }
            mesh.position.set(p.x, 0.55, p.z);
        });

        const maxValue = Math.max.apply(null, flows.map(f => f.value).concat([1]));
        const activeIds = {};
        flows.forEach(f => {
            activeIds[f.id] = true;
            const curve = buildCurve(f.from, f.to, f.bend);
            const ratio = Math.max(0.05, Math.min(1, f.value / maxValue));
            const radius = 0.03 + 0.05 * ratio;
            const geometry = new THREE.TubeGeometry(curve, 48, radius, 8, false);
            const color = new THREE.Color(f.color);

            let tube = sc.tubes[f.id];
            if (tube) {
                tube.geometry.dispose();
                tube.geometry = geometry;
                tube.material.color.copy(color);
                tube.material.opacity = 0.55 + 0.35 * ratio;
            } else {
                tube = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({
                    color, transparent: true, opacity: 0.55 + 0.35 * ratio, roughness: 0.35
                }));
                sc.scene.add(tube);
                sc.tubes[f.id] = tube;
            }

            let pg = sc.particleGroups[f.id];
            if (!pg) {
                pg = makeParticleGroup(color, f.kind === 'real' ? 'square' : 'round');
                pg.meshes.forEach(m => sc.scene.add(m));
                sc.particleGroups[f.id] = pg;
            }
            pg.state.curve = curve;
            pg.state.speed = 0.12 + 0.35 * ratio;
        });

        Object.keys(sc.tubes).forEach(id => {
            if (activeIds[id]) return;
            sc.scene.remove(sc.tubes[id]);
            sc.tubes[id].geometry.dispose();
            sc.tubes[id].material.dispose();
            delete sc.tubes[id];
            if (sc.particleGroups[id]) {
                sc.particleGroups[id].meshes.forEach(m => sc.scene.remove(m));
                delete sc.particleGroups[id];
            }
        });

        return true;
    }

    global.renderCircularFlow3D = render;
    global.circularFlow3DSupported = supported;
})(typeof window !== 'undefined' ? window : globalThis);
