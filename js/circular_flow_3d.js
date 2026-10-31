// js/circular_flow_3d.js
// Premium Isometric 3D Circular Flow Simulation with React Three Fiber

let r3fLoadedPromise = null;

export function render3DCircularFlow(container, values) {
    if (!container) return;

    if (!container.querySelector('.cf-3d-wrapper')) {
        container.innerHTML = `
            <div class="cf-3d-wrapper" style="width:100%; height:480px; position:relative; border-radius:18px; overflow:hidden; background: radial-gradient(circle at 50% 30%, #1e1b4b 0%, #090d16 100%); border: 1px solid rgba(255, 255, 255, 0.12); box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
                <div id="cf-3d-canvas-root" style="width:100%; height:100%;"></div>
            </div>
        `;
    }

    const canvasRoot = container.querySelector('#cf-3d-canvas-root');
    if (!canvasRoot) return;

    if (!window.__CF3D_RENDERER) {
        if (!r3fLoadedPromise) {
            r3fLoadedPromise = (async () => {
                const React = await import('react');
                const ReactDOM = await import('react-dom/client');
                const THREE = await import('three');
                const R3F = await import('@react-three/fiber');

                return { React, ReactDOM, THREE, R3F };
            })().catch(err => {
                console.error('Failed to load React/R3F ESM modules:', err);
                return null;
            });
        }

        r3fLoadedPromise.then(modules => {
            if (!modules) return;
            const { React, ReactDOM, THREE, R3F } = modules;
            const h = React.createElement;

            // ── Building / Model Components ──

            // 1. Households (Residential Villa)
            const HouseholdBuilding = ({ position }) => {
                return h('group', { position }, [
                    // Base pedestal
                    h('mesh', { key: 'base', position: [0, 0.1, 0] }, [
                        h('cylinderGeometry', { key: 'g', args: [1.8, 2.0, 0.2, 32] }),
                        h('meshStandardMaterial', { key: 'm', color: '#3b82f6', roughness: 0.3, metalness: 0.2, emissive: '#1d4ed8', emissiveIntensity: 0.2 })
                    ]),
                    // Main house body
                    h('mesh', { key: 'body', position: [-0.3, 0.8, -0.2] }, [
                        h('boxGeometry', { key: 'g', args: [1.2, 1.2, 1.2] }),
                        h('meshStandardMaterial', { key: 'm', color: '#e0e7ff', roughness: 0.2 })
                    ]),
                    // Roof
                    h('mesh', { key: 'roof', position: [-0.3, 1.7, -0.2], rotation: [0, Math.PI / 4, 0] }, [
                        h('coneGeometry', { key: 'g', args: [1.1, 0.8, 4] }),
                        h('meshStandardMaterial', { key: 'm', color: '#ef4444', roughness: 0.3 })
                    ]),
                    // Side Annex
                    h('mesh', { key: 'annex', position: [0.5, 0.6, 0.1] }, [
                        h('boxGeometry', { key: 'g', args: [0.8, 0.8, 0.9] }),
                        h('meshStandardMaterial', { key: 'm', color: '#c7d2fe' })
                    ]),
                    // Windows glowing
                    h('mesh', { key: 'win1', position: [-0.3, 0.9, 0.41] }, [
                        h('planeGeometry', { key: 'g', args: [0.4, 0.4] }),
                        h('meshBasicMaterial', { key: 'm', color: '#fbbf24' })
                    ]),
                    // Label
                    h('pointLight', { key: 'light', position: [0, 1.5, 0], color: '#60a5fa', intensity: 2, distance: 5 })
                ]);
            };

            // 2. Firms (HQ Factory)
            const FirmBuilding = ({ position }) => {
                return h('group', { position }, [
                    // Base pedestal
                    h('mesh', { key: 'base', position: [0, 0.1, 0] }, [
                        h('cylinderGeometry', { key: 'g', args: [1.8, 2.0, 0.2, 32] }),
                        h('meshStandardMaterial', { key: 'm', color: '#8b5cf6', roughness: 0.3, metalness: 0.2, emissive: '#6d28d9', emissiveIntensity: 0.2 })
                    ]),
                    // Factory main hall
                    h('mesh', { key: 'hall', position: [0, 0.7, 0] }, [
                        h('boxGeometry', { key: 'g', args: [1.6, 1.0, 1.4] }),
                        h('meshStandardMaterial', { key: 'm', color: '#334155', metalness: 0.5, roughness: 0.3 })
                    ]),
                    // High-tech Glass Tower
                    h('mesh', { key: 'tower', position: [-0.4, 1.4, -0.3] }, [
                        h('boxGeometry', { key: 'g', args: [0.7, 1.6, 0.7] }),
                        h('meshStandardMaterial', { key: 'm', color: '#a855f7', roughness: 0.1, transparent: true, opacity: 0.85 })
                    ]),
                    // Smokestack 1
                    h('mesh', { key: 'smoke1', position: [0.5, 1.4, 0.3] }, [
                        h('cylinderGeometry', { key: 'g', args: [0.15, 0.2, 1.0, 16] }),
                        h('meshStandardMaterial', { key: 'm', color: '#64748b', metalness: 0.8 })
                    ]),
                    // Smokestack 2
                    h('mesh', { key: 'smoke2', position: [0.5, 1.4, -0.2] }, [
                        h('cylinderGeometry', { key: 'g', args: [0.15, 0.2, 1.0, 16] }),
                        h('meshStandardMaterial', { key: 'm', color: '#64748b', metalness: 0.8 })
                    ]),
                    h('pointLight', { key: 'light', position: [0, 1.5, 0], color: '#c084fc', intensity: 2, distance: 5 })
                ]);
            };

            // 3. Government (Capitol Building)
            const GovernmentBuilding = ({ position }) => {
                return h('group', { position }, [
                    // Base pedestal
                    h('mesh', { key: 'base', position: [0, 0.1, 0] }, [
                        h('cylinderGeometry', { key: 'g', args: [1.8, 2.0, 0.2, 32] }),
                        h('meshStandardMaterial', { key: 'm', color: '#f59e0b', roughness: 0.3, metalness: 0.2, emissive: '#b45309', emissiveIntensity: 0.2 })
                    ]),
                    // Stairs base
                    h('mesh', { key: 'steps', position: [0, 0.3, 0] }, [
                        h('boxGeometry', { key: 'g', args: [1.8, 0.2, 1.4] }),
                        h('meshStandardMaterial', { key: 'm', color: '#fef3c7' })
                    ]),
                    // Main Hall
                    h('mesh', { key: 'hall', position: [0, 0.8, 0] }, [
                        h('boxGeometry', { key: 'g', args: [1.4, 0.8, 1.1] }),
                        h('meshStandardMaterial', { key: 'm', color: '#fffbeb' })
                    ]),
                    // Dome
                    h('mesh', { key: 'dome', position: [0, 1.4, 0] }, [
                        h('sphereGeometry', { key: 'g', args: [0.55, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2] }),
                        h('meshStandardMaterial', { key: 'm', color: '#f59e0b', metalness: 0.8, roughness: 0.2 })
                    ]),
                    // Pillars
                    ...[-0.5, -0.2, 0.2, 0.5].map((x, i) =>
                        h('mesh', { key: `col_${i}`, position: [x, 0.7, 0.56] }, [
                            h('cylinderGeometry', { key: 'g', args: [0.06, 0.06, 0.6, 12] }),
                            h('meshStandardMaterial', { key: 'm', color: '#ffffff' })
                        ])
                    ),
                    h('pointLight', { key: 'light', position: [0, 1.5, 0], color: '#fbbf24', intensity: 2, distance: 5 })
                ]);
            };

            // 4. Foreign Sector (Port / Trade Terminal)
            const ForeignBuilding = ({ position }) => {
                return h('group', { position }, [
                    // Base pedestal
                    h('mesh', { key: 'base', position: [0, 0.1, 0] }, [
                        h('cylinderGeometry', { key: 'g', args: [1.8, 2.0, 0.2, 32] }),
                        h('meshStandardMaterial', { key: 'm', color: '#06b6d4', roughness: 0.3, metalness: 0.2, emissive: '#0e7490', emissiveIntensity: 0.2 })
                    ]),
                    // Water/Dock platform
                    h('mesh', { key: 'dock', position: [0, 0.25, 0] }, [
                        h('boxGeometry', { key: 'g', args: [1.6, 0.1, 1.6] }),
                        h('meshStandardMaterial', { key: 'm', color: '#155e75', roughness: 0.1 })
                    ]),
                    // Cargo containers
                    h('mesh', { key: 'box1', position: [-0.4, 0.5, -0.3] }, [
                        h('boxGeometry', { key: 'g', args: [0.6, 0.4, 0.5] }),
                        h('meshStandardMaterial', { key: 'm', color: '#ef4444' })
                    ]),
                    h('mesh', { key: 'box2', position: [-0.4, 0.9, -0.3] }, [
                        h('boxGeometry', { key: 'g', args: [0.6, 0.4, 0.5] }),
                        h('meshStandardMaterial', { key: 'm', color: '#3b82f6' })
                    ]),
                    h('mesh', { key: 'box3', position: [0.3, 0.5, 0.2] }, [
                        h('boxGeometry', { key: 'g', args: [0.6, 0.4, 0.5] }),
                        h('meshStandardMaterial', { key: 'm', color: '#10b981' })
                    ]),
                    // Cargo Crane
                    h('mesh', { key: 'crane', position: [0.4, 1.1, -0.4] }, [
                        h('boxGeometry', { key: 'g', args: [0.1, 1.2, 0.1] }),
                        h('meshStandardMaterial', { key: 'm', color: '#f59e0b', metalness: 0.8 })
                    ]),
                    h('pointLight', { key: 'light', position: [0, 1.5, 0], color: '#22d3ee', intensity: 2, distance: 5 })
                ]);
            };

            // 5. Central Bank (Financial Market)
            const BankBuilding = ({ position }) => {
                return h('group', { position }, [
                    // Base pedestal
                    h('mesh', { key: 'base', position: [0, 0.1, 0] }, [
                        h('cylinderGeometry', { key: 'g', args: [1.6, 1.8, 0.2, 32] }),
                        h('meshStandardMaterial', { key: 'm', color: '#10b981', roughness: 0.3, metalness: 0.2, emissive: '#047857', emissiveIntensity: 0.2 })
                    ]),
                    // Classical Bank Body
                    h('mesh', { key: 'body', position: [0, 0.7, 0] }, [
                        h('boxGeometry', { key: 'g', args: [1.3, 0.8, 1.1] }),
                        h('meshStandardMaterial', { key: 'm', color: '#ecfdf5', roughness: 0.2 })
                    ]),
                    // Pediment Triangular Roof
                    h('mesh', { key: 'roof', position: [0, 1.25, 0], rotation: [0, 0, 0] }, [
                        h('coneGeometry', { key: 'g', args: [1.0, 0.4, 4] }),
                        h('meshStandardMaterial', { key: 'm', color: '#10b981', metalness: 0.5 })
                    ]),
                    // Golden Vault Coin Emblem
                    h('mesh', { key: 'coin', position: [0, 1.7, 0], rotation: [Math.PI / 2, 0, 0] }, [
                        h('cylinderGeometry', { key: 'g', args: [0.25, 0.25, 0.08, 24] }),
                        h('meshStandardMaterial', { key: 'm', color: '#fbbf24', metalness: 0.9, roughness: 0.1 })
                    ]),
                    h('pointLight', { key: 'light', position: [0, 1.5, 0], color: '#34d399', intensity: 2, distance: 5 })
                ]);
            };

            // ── Curved Particle Flow Tube Component ──
            const ParticleFlow = ({ start, end, midHeight = 1.2, color = '#a855f7', speed = 1.0, count = 12, isDashed = false }) => {
                const pointsRef = React.useRef();

                // Compute Bezier curve
                const curve = React.useMemo(() => {
                    const vStart = new THREE.Vector3(...start);
                    const vEnd = new THREE.Vector3(...end);
                    const mid = new THREE.Vector3().addVectors(vStart, vEnd).multiplyScalar(0.5);
                    mid.y += midHeight;
                    return new THREE.QuadraticBezierCurve3(vStart, mid, vEnd);
                }, [start[0], start[1], start[2], end[0], end[1], end[2], midHeight]);

                // Create particles along the curve
                const particleOffsets = React.useMemo(() => {
                    const arr = new Float32Array(count);
                    for (let i = 0; i < count; i++) {
                        arr[i] = i / count;
                    }
                    return arr;
                }, [count]);

                // Tube geometry for flow line path
                const tubeGeometry = React.useMemo(() => {
                    return new THREE.TubeGeometry(curve, 32, isDashed ? 0.02 : 0.035, 8, false);
                }, [curve, isDashed]);

                // Particle instanced positions updated frame by frame
                const particleGeom = React.useMemo(() => {
                    return isDashed ? new THREE.BoxGeometry(0.08, 0.08, 0.08) : new THREE.SphereGeometry(0.07, 12, 12);
                }, [isDashed]);

                const dummy = React.useMemo(() => new THREE.Object3D(), []);

                R3F.useFrame((state, delta) => {
                    if (!pointsRef.current) return;
                    for (let i = 0; i < count; i++) {
                        particleOffsets[i] = (particleOffsets[i] + delta * 0.3 * speed) % 1.0;
                        const pt = curve.getPoint(particleOffsets[i]);
                        const tangent = curve.getTangent(particleOffsets[i]);
                        dummy.position.copy(pt);
                        dummy.lookAt(pt.clone().add(tangent));
                        dummy.updateMatrix();
                        pointsRef.current.setMatrixAt(i, dummy.matrix);
                    }
                    pointsRef.current.instanceMatrix.needsUpdate = true;
                });

                return h('group', {}, [
                    // Glow Path Tube
                    h('mesh', { key: 'tube', geometry: tubeGeometry }, [
                        h('meshStandardMaterial', {
                            key: 'mat',
                            color: color,
                            emissive: color,
                            emissiveIntensity: 0.6,
                            transparent: true,
                            opacity: isDashed ? 0.35 : 0.55,
                            roughness: 0.2
                        })
                    ]),
                    // Animated Particle Stream
                    h('instancedMesh', {
                        key: 'particles',
                        ref: pointsRef,
                        args: [particleGeom, null, count]
                    }, [
                        h('meshBasicMaterial', { key: 'pmat', color: '#ffffff' })
                    ])
                ]);
            };

            // ── Main Scene Component ──
            const Scene = ({ values }) => {
                const sector = values.sector || '2';
                const has3 = sector === '3' || sector === '4';
                const has4 = sector === '4';
                const hasBank = values.bank === 'yes';

                // Flow Values
                const cVal = values.consumption || 90;
                const wVal = (sector === '2' && !hasBank) ? cVal : (values.wages || 100);
                const sVal = hasBank ? (values.saving || 30) : 0;
                const iVal = hasBank ? sVal : 50;
                const gVal = has3 ? (values.g || 40) : 0;
                const tVal = has3 ? 35 : 0;
                const nxVal = has4 ? (values.nx || 10) : 0;
                const expVal = has4 ? Math.max(5, 20 + nxVal) : 0;
                const impVal = has4 ? Math.max(5, 20 - nxVal) : 0;

                // Node Positions in Isometric Space
                const posHH = [-4.0, 0, 0];
                const posFirms = [4.0, 0, 0];
                const posGovt = [0, 0, -4.0];
                const posForeign = [0, 0, 4.0];
                const posBank = [0, 0, 0];

                return h('group', {}, [
                    // Ambient Light & Direct Key Light
                    h('ambientLight', { key: 'amb', intensity: 1.0 }),
                    h('directionalLight', { key: 'dir', position: [12, 18, 10], intensity: 1.8, castShadow: true }),
                    h('directionalLight', { key: 'fill', position: [-10, 10, -10], intensity: 0.6 }),

                    // Ground Grid Base
                    h('gridHelper', { key: 'grid', args: [18, 18, '#818cf8', '#312e81'], position: [0, -0.05, 0] }),

                    // ── Sectors ──
                    h(HouseholdBuilding, { key: 'hh', position: posHH }),
                    h(FirmBuilding, { key: 'firms', position: posFirms }),
                    has3 && h(GovernmentBuilding, { key: 'govt', position: posGovt }),
                    has4 && h(ForeignBuilding, { key: 'foreign', position: posForeign }),
                    hasBank && h(BankBuilding, { key: 'bank', position: posBank }),

                    // ── Flows ──

                    // 1. Consumption Expenditure (HH -> Firms, Money Flow)
                    h(ParticleFlow, {
                        key: 'flow_c',
                        start: [-3.2, 0.4, -0.6],
                        end: [3.2, 0.4, -0.6],
                        midHeight: 1.8,
                        color: '#a855f7', // Magenta/Purple
                        speed: cVal / 50,
                        count: Math.round(cVal / 7)
                    }),

                    // 2. Factor Payments / Wages (Firms -> HH, Money Flow)
                    h(ParticleFlow, {
                        key: 'flow_w',
                        start: [3.2, 0.4, 0.6],
                        end: [-3.2, 0.4, 0.6],
                        midHeight: 1.8,
                        color: '#ec4899', // Pink
                        speed: wVal / 50,
                        count: Math.round(wVal / 7)
                    }),

                    // 3. Goods & Services (Firms -> HH, Real Flow)
                    h(ParticleFlow, {
                        key: 'flow_goods',
                        start: [3.2, 0.2, -1.2],
                        end: [-3.2, 0.2, -1.2],
                        midHeight: 2.2,
                        color: '#38bdf8', // Light Cyan
                        speed: cVal / 50,
                        count: 10,
                        isDashed: true
                    }),

                    // 4. Factor Services (HH -> Firms, Real Flow)
                    h(ParticleFlow, {
                        key: 'flow_factors',
                        start: [-3.2, 0.2, 1.2],
                        end: [3.2, 0.2, 1.2],
                        midHeight: 2.2,
                        color: '#38bdf8', // Light Cyan
                        speed: wVal / 50,
                        count: 10,
                        isDashed: true
                    }),

                    // 5. Financial Market Flows
                    hasBank && h(ParticleFlow, {
                        key: 'flow_s',
                        start: [-3.2, 0.3, 0],
                        end: [-1.2, 0.3, 0],
                        midHeight: 0.8,
                        color: '#10b981', // Emerald Savings
                        speed: Math.max(0.5, sVal / 30),
                        count: Math.max(5, Math.round(sVal / 5))
                    }),
                    hasBank && h(ParticleFlow, {
                        key: 'flow_i',
                        start: [1.2, 0.3, 0],
                        end: [3.2, 0.3, 0],
                        midHeight: 0.8,
                        color: '#10b981', // Emerald Investment
                        speed: Math.max(0.5, iVal / 30),
                        count: Math.max(5, Math.round(iVal / 5))
                    }),

                    // 6. Government Sector Flows
                    has3 && h(ParticleFlow, {
                        key: 'flow_taxes',
                        start: [-3.0, 0.4, -0.8],
                        end: [-0.8, 0.4, -3.2],
                        midHeight: 1.2,
                        color: '#f59e0b', // Amber Taxes
                        speed: tVal / 25,
                        count: Math.round(tVal / 4)
                    }),
                    has3 && h(ParticleFlow, {
                        key: 'flow_g',
                        start: [0.8, 0.4, -3.2],
                        end: [3.0, 0.4, -0.8],
                        midHeight: 1.2,
                        color: '#fbbf24', // Gold Govt Spending
                        speed: Math.max(0.4, gVal / 30),
                        count: Math.max(5, Math.round(gVal / 6))
                    }),

                    // 7. Foreign Sector Flows
                    has4 && h(ParticleFlow, {
                        key: 'flow_m',
                        start: [3.0, 0.4, 0.8],
                        end: [0.8, 0.4, 3.2],
                        midHeight: 1.2,
                        color: '#f43f5e', // Rose Imports
                        speed: Math.max(0.4, impVal / 20),
                        count: Math.max(5, Math.round(impVal / 4))
                    }),
                    has4 && h(ParticleFlow, {
                        key: 'flow_x',
                        start: [-0.8, 0.4, 3.2],
                        end: [3.0, 0.4, 0.8],
                        midHeight: 1.5,
                        color: '#06b6d4', // Cyan Exports
                        speed: Math.max(0.4, expVal / 20),
                        count: Math.max(5, Math.round(expVal / 4))
                    })
                ]);
            };

            const App3D = ({ values }) => {
                return h(R3F.Canvas, {
                    orthographic: true,
                    camera: { zoom: 36, position: [14, 14, 14], near: 0.1, far: 1000 },
                    style: { width: '100%', height: '100%' }
                }, [
                    h(Scene, { key: 'scene', values })
                ]);
            };

            let reactRoot = window.__CF3D_REACT_ROOT;
            if (!reactRoot) {
                reactRoot = ReactDOM.createRoot(canvasRoot);
                window.__CF3D_REACT_ROOT = reactRoot;
            }

            window.__CF3D_RENDERER = (vals) => {
                reactRoot.render(h(App3D, { values: vals }));
            };

            window.__CF3D_RENDERER(values);
        });
    } else {
        window.__CF3D_RENDERER(values);
    }
}
