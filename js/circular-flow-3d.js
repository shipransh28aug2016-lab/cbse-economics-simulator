// SOURCE for js/vendor/circular-flow-3d.bundle.js — rebuild with `npm run vendor:3d`.
// An OPT-IN second view of the Circular Flow lab (macro-gdp). It holds no
// economics: it draws the node/flow list js/simulations.js hands it.
import React, { useEffect, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';

const h = React.createElement;

// A text label as a camera-facing sprite. The canvas is sized to the text
// (a fixed 256px one cut long labels off mid-word), at 2x for sharpness.
function createTextSprite(text, color = '#ffffff', bgColor = 'rgba(15, 23, 42, 0.75)', worldHeight = 0.75) {
  const font = '700 30px Inter, "Noto Sans Devanagari", system-ui, sans-serif';
  const measure = document.createElement('canvas').getContext('2d');
  measure.font = font;
  const w = Math.ceil(measure.measureText(text).width) + 44, hgt = 60;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = hgt;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = bgColor;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(3, 3, w - 6, hgt - 6, 14); else ctx.rect(3, 3, w - 6, hgt - 6);
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.font = font;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, w / 2, hgt / 2 + 1);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  // depthTest off: a label is never hidden behind a building.
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false }));
  sprite.renderOrder = 10;
  sprite.scale.set(worldHeight * (w / hgt), worldHeight, 1);
  return sprite;
}

// 3D Models for Entities
function HouseholdModel({ position, label }) {
  const spriteRef = useRef();
  useEffect(() => {
    if (spriteRef.current) {
      const sprite = createTextSprite(label, '#f97316');
      sprite.position.set(0, 2.2, 0);
      spriteRef.current.add(sprite);
      return () => {
        if (spriteRef.current) spriteRef.current.remove(sprite);
      };
    }
  }, [label]);

  return h('group', { position },
    h('group', { ref: spriteRef }),
    // Base Platform
    h('mesh', { position: [0, -0.1, 0] },
      h('cylinderGeometry', { args: [1.8, 2.0, 0.2, 32] }),
      h('meshStandardMaterial', { color: '#334155', roughness: 0.3, metalness: 0.2 })
    ),
    h('mesh', { position: [0, 0.05, 0] },
      h('cylinderGeometry', { args: [1.7, 1.7, 0.1, 32] }),
      h('meshStandardMaterial', { color: '#f97316', emissive: '#f97316', emissiveIntensity: 0.2 })
    ),
    // House Main Body
    h('mesh', { position: [-0.3, 0.6, 0.2], castShadow: true, receiveShadow: true },
      h('boxGeometry', { args: [0.9, 0.9, 0.9] }),
      h('meshStandardMaterial', { color: '#fdba74' })
    ),
    // Roof
    h('mesh', { position: [-0.3, 1.3, 0.2], rotation: [0, Math.PI / 4, 0], castShadow: true },
      h('coneGeometry', { args: [0.8, 0.6, 4] }),
      h('meshStandardMaterial', { color: '#ea580c' })
    ),
    // Second House
    h('mesh', { position: [0.4, 0.5, -0.2], castShadow: true, receiveShadow: true },
      h('boxGeometry', { args: [0.7, 0.7, 0.7] }),
      h('meshStandardMaterial', { color: '#fed7aa' })
    ),
    h('mesh', { position: [0.4, 1.05, -0.2], rotation: [0, Math.PI / 4, 0], castShadow: true },
      h('coneGeometry', { args: [0.6, 0.5, 4] }),
      h('meshStandardMaterial', { color: '#c2410c' })
    ),
    // Trees
    h('mesh', { position: [-0.9, 0.4, -0.6] },
      h('cylinderGeometry', { args: [0.08, 0.08, 0.4] }),
      h('meshStandardMaterial', { color: '#78350f' })
    ),
    h('mesh', { position: [-0.9, 0.8, -0.6] },
      h('coneGeometry', { args: [0.35, 0.6, 8] }),
      h('meshStandardMaterial', { color: '#22c55e' })
    )
  );
}

function FirmModel({ position, label }) {
  const spriteRef = useRef();
  useEffect(() => {
    if (spriteRef.current) {
      const sprite = createTextSprite(label, '#10b981');
      sprite.position.set(0, 2.5, 0);
      spriteRef.current.add(sprite);
      return () => {
        if (spriteRef.current) spriteRef.current.remove(sprite);
      };
    }
  }, [label]);

  return h('group', { position },
    h('group', { ref: spriteRef }),
    // Base Platform
    h('mesh', { position: [0, -0.1, 0] },
      h('cylinderGeometry', { args: [1.8, 2.0, 0.2, 32] }),
      h('meshStandardMaterial', { color: '#334155', roughness: 0.3, metalness: 0.2 })
    ),
    h('mesh', { position: [0, 0.05, 0] },
      h('cylinderGeometry', { args: [1.7, 1.7, 0.1, 32] }),
      h('meshStandardMaterial', { color: '#10b981', emissive: '#10b981', emissiveIntensity: 0.2 })
    ),
    // Main Factory Building
    h('mesh', { position: [-0.2, 0.75, 0], castShadow: true, receiveShadow: true },
      h('boxGeometry', { args: [1.2, 1.3, 1.1] }),
      h('meshStandardMaterial', { color: '#64748b' })
    ),
    // Office Tower
    h('mesh', { position: [0.5, 1.1, -0.2], castShadow: true, receiveShadow: true },
      h('boxGeometry', { args: [0.7, 2.0, 0.7] }),
      h('meshStandardMaterial', { color: '#38bdf8', roughness: 0.1, metalness: 0.8 })
    ),
    // Chimneys
    h('mesh', { position: [-0.5, 1.6, -0.3] },
      h('cylinderGeometry', { args: [0.12, 0.15, 0.6, 16] }),
      h('meshStandardMaterial', { color: '#475569' })
    ),
    h('mesh', { position: [-0.2, 1.6, -0.3] },
      h('cylinderGeometry', { args: [0.12, 0.15, 0.6, 16] }),
      h('meshStandardMaterial', { color: '#475569' })
    ),
    // Smoke
    h('mesh', { position: [-0.5, 2.0, -0.3] },
      h('sphereGeometry', { args: [0.18, 8, 8] }),
      h('meshStandardMaterial', { color: '#cbd5e1', transparent: true, opacity: 0.6 })
    )
  );
}

function GovtModel({ position, label }) {
  const spriteRef = useRef();
  useEffect(() => {
    if (spriteRef.current) {
      const sprite = createTextSprite(label, '#3b82f6');
      sprite.position.set(0, 2.4, 0);
      spriteRef.current.add(sprite);
      return () => {
        if (spriteRef.current) spriteRef.current.remove(sprite);
      };
    }
  }, [label]);

  return h('group', { position },
    h('group', { ref: spriteRef }),
    h('mesh', { position: [0, -0.1, 0] },
      h('cylinderGeometry', { args: [1.6, 1.8, 0.2, 32] }),
      h('meshStandardMaterial', { color: '#334155', roughness: 0.3, metalness: 0.2 })
    ),
    h('mesh', { position: [0, 0.05, 0] },
      h('cylinderGeometry', { args: [1.5, 1.5, 0.1, 32] }),
      h('meshStandardMaterial', { color: '#3b82f6', emissive: '#3b82f6', emissiveIntensity: 0.2 })
    ),
    h('mesh', { position: [0, 0.25, 0], castShadow: true, receiveShadow: true },
      h('boxGeometry', { args: [1.6, 0.3, 1.2] }),
      h('meshStandardMaterial', { color: '#e2e8f0' })
    ),
    h('mesh', { position: [0, 0.7, 0], castShadow: true, receiveShadow: true },
      h('boxGeometry', { args: [1.3, 0.6, 0.9] }),
      h('meshStandardMaterial', { color: '#f8fafc' })
    ),
    ...[-0.45, -0.15, 0.15, 0.45].map((x, i) =>
      h('mesh', { key: i, position: [x, 0.7, 0.4] },
        h('cylinderGeometry', { args: [0.05, 0.05, 0.6, 12] }),
        h('meshStandardMaterial', { color: '#cbd5e1' })
      )
    ),
    h('mesh', { position: [0, 1.2, 0], castShadow: true },
      h('sphereGeometry', { args: [0.45, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2] }),
      h('meshStandardMaterial', { color: '#60a5fa', metalness: 0.5, roughness: 0.2 })
    ),
    h('mesh', { position: [0, 1.55, 0] },
      h('coneGeometry', { args: [0.08, 0.4, 8] }),
      h('meshStandardMaterial', { color: '#fbbf24', metalness: 0.8 })
    )
  );
}

function BankModel({ position, label }) {
  const spriteRef = useRef();
  useEffect(() => {
    if (spriteRef.current) {
      const sprite = createTextSprite(label, '#eab308');
      sprite.position.set(0, 2.2, 0);
      spriteRef.current.add(sprite);
      return () => {
        if (spriteRef.current) spriteRef.current.remove(sprite);
      };
    }
  }, [label]);

  return h('group', { position },
    h('group', { ref: spriteRef }),
    h('mesh', { position: [0, -0.1, 0] },
      h('cylinderGeometry', { args: [1.5, 1.7, 0.2, 32] }),
      h('meshStandardMaterial', { color: '#334155', roughness: 0.3, metalness: 0.2 })
    ),
    h('mesh', { position: [0, 0.05, 0] },
      h('cylinderGeometry', { args: [1.4, 1.4, 0.1, 32] }),
      h('meshStandardMaterial', { color: '#eab308', emissive: '#eab308', emissiveIntensity: 0.2 })
    ),
    h('mesh', { position: [0, 0.6, 0], castShadow: true, receiveShadow: true },
      h('boxGeometry', { args: [1.2, 0.9, 1.0] }),
      h('meshStandardMaterial', { color: '#fef08a', metalness: 0.6, roughness: 0.3 })
    ),
    h('mesh', { position: [0, 1.2, 0], castShadow: true },
      h('cylinderGeometry', { args: [0.01, 0.8, 0.4, 4], rotation: [0, Math.PI / 4, 0] }),
      h('meshStandardMaterial', { color: '#eab308', metalness: 0.8 })
    ),
    h('mesh', { position: [0, 1.45, 0] },
      h('cylinderGeometry', { args: [0.25, 0.25, 0.1, 20], rotation: [Math.PI / 2, 0, 0] }),
      h('meshStandardMaterial', { color: '#f59e0b', metalness: 0.9, roughness: 0.1 })
    )
  );
}

function ForeignModel({ position, label }) {
  const spriteRef = useRef();
  useEffect(() => {
    if (spriteRef.current) {
      const sprite = createTextSprite(label, '#ec4899');
      sprite.position.set(0, 2.2, 0);
      spriteRef.current.add(sprite);
      return () => {
        if (spriteRef.current) spriteRef.current.remove(sprite);
      };
    }
  }, [label]);

  return h('group', { position },
    h('group', { ref: spriteRef }),
    h('mesh', { position: [0, -0.1, 0] },
      h('cylinderGeometry', { args: [1.6, 1.8, 0.2, 32] }),
      h('meshStandardMaterial', { color: '#334155', roughness: 0.3, metalness: 0.2 })
    ),
    h('mesh', { position: [0, 0.05, 0] },
      h('cylinderGeometry', { args: [1.5, 1.5, 0.1, 32] }),
      h('meshStandardMaterial', { color: '#ec4899', emissive: '#ec4899', emissiveIntensity: 0.2 })
    ),
    h('mesh', { position: [0, 0.8, 0], castShadow: true },
      h('sphereGeometry', { args: [0.65, 24, 24] }),
      h('meshStandardMaterial', { color: '#0284c7', roughness: 0.4 })
    ),
    h('mesh', { position: [0, 0.8, 0], rotation: [0.4, 0.8, 0] },
      h('torusGeometry', { args: [0.72, 0.04, 12, 32] }),
      h('meshStandardMaterial', { color: '#f472b6', emissive: '#f472b6', emissiveIntensity: 0.5 })
    ),
    h('mesh', { position: [-0.5, 0.25, 0.5], rotation: [0, 0.3, 0], castShadow: true },
      h('boxGeometry', { args: [0.5, 0.3, 0.3] }),
      h('meshStandardMaterial', { color: '#ef4444' })
    ),
    h('mesh', { position: [0.4, 0.25, 0.6], rotation: [0, -0.2, 0], castShadow: true },
      h('boxGeometry', { args: [0.5, 0.3, 0.3] }),
      h('meshStandardMaterial', { color: '#10b981' })
    )
  );
}

// One stream of particles along a 3D quadratic Bezier, sized and timed from
// the flow's own value — the same value the SVG diagram draws.
function FlowStream({ start, end, mid, color, isReal, ratio, label, labelAt }) {
  const groupRef = useRef();
  const labelRef = useRef();

  const curve = useMemo(() => new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(...start), new THREE.Vector3(...mid), new THREE.Vector3(...end)
  ), [start, end, mid]);

  // More money ⇒ more particles, moving faster (2…14 particles).
  const count = Math.max(2, Math.round(2 + 12 * ratio));
  const particles = useMemo(() => Array.from({ length: count }, (_, i) => i / count), [count]);

  useEffect(() => {
    if (!labelRef.current || !label) return undefined;
    const sprite = createTextSprite(label, color, 'rgba(15, 23, 42, 0.92)', 0.5);
    sprite.position.copy(curve.getPoint(labelAt)).add(new THREE.Vector3(0, 0.45, 0));
    const holder = labelRef.current;
    holder.add(sprite);
    return () => { holder.remove(sprite); };
  }, [label, color, curve, labelAt]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime() * (0.12 + 0.3 * ratio);
    const children = groupRef.current.children;
    for (let i = 0; i < children.length && i < particles.length; i++) {
      children[i].position.copy(curve.getPoint((particles[i] + time) % 1));
    }
  });

  const lineGeometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(curve.getPoints(30)), [curve]);
  const size = isReal ? 0.2 : 0.14;

  return h('group', null,
    h('line', { geometry: lineGeometry },
      h('lineBasicMaterial', { color, transparent: true, opacity: isReal ? 0.3 : 0.55 })
    ),
    h('group', { ref: labelRef }),
    h('group', { ref: groupRef },
      particles.map((p, idx) =>
        h('mesh', { key: idx, scale: [size, size, size] },
          // Same idiom as the 2D diagram: real flow = squares, money flow = round.
          isReal ? h('boxGeometry', { args: [1, 1, 1] }) : h('sphereGeometry', { args: [1, 12, 12] }),
          h('meshBasicMaterial', { color })
        )
      )
    )
  );
}

// Fixed anchors, one per sector — toggling a sector never moves another one.
const NODE_POS = {
  hh: [-7, 0, 0], firm: [7, 0, 0], gov: [0, 0, -7.5], bank: [-3.4, 0, 7.2], foreign: [3.4, 0, 7.2]
};
const NODE_MODEL = { hh: HouseholdModel, firm: FirmModel, gov: GovtModel, bank: BankModel, foreign: ForeignModel };

// The scene draws ONLY what `spec` lists. `spec` is built by macro-gdp's
// customRender (js/simulations.js) from the very same nodes/flows arrays its
// SVG diagram is drawn from, so the two views cannot disagree about which
// sectors exist, which way money moves, or how big a flow is.
function CircularFlow3DScene({ spec }) {
  const maxValue = Math.max(1, ...spec.flows.map(f => f.value));
  return h(React.Fragment, null,
    h('ambientLight', { intensity: 0.8 }),
    h('directionalLight', { position: [12, 20, 10], intensity: 1.2 }),
    h('directionalLight', { position: [-10, 10, -10], intensity: 0.4, color: '#a5f3fc' }),
    h('gridHelper', { args: [26, 26, '#475569', '#1e293b'], position: [0, -0.2, 0] }),

    spec.nodes.map(n => h(NODE_MODEL[n.key], { key: n.key, position: NODE_POS[n.key], label: n.label })),

    spec.flows.filter(f => f.value > 0).map(f => {
      const a = NODE_POS[f.from], b = NODE_POS[f.to];
      // Bow sideways, perpendicular (in the ground plane) to the edge's own
      // direction — so a reversed edge bows to the opposite side by itself.
      // Money flows form the inner raised ring, real flows the outer low one,
      // exactly as the 2D diagram's inner/outer rings.
      const core = (f.from === 'hh' && f.to === 'firm') || (f.from === 'firm' && f.to === 'hh');
      const bow = core ? (f.kind === 'real' ? 7.4 : 3.6) : 1.0;
      const lift = core ? (f.kind === 'real' ? 0.5 : 2.2) : 2.4;
      const dx = b[0] - a[0], dz = b[2] - a[2], len = Math.hypot(dx, dz) || 1;
      const mid = [(a[0] + b[0]) / 2 + (-dz / len) * bow, lift, (a[2] + b[2]) / 2 + (dx / len) * bow];
      return h(FlowStream, {
        key: f.id, start: a, end: b, mid, color: f.color, isReal: f.kind === 'real',
        ratio: Math.max(0, Math.min(1, f.value / maxValue)), label: f.label, labelAt: 0.5
      });
    })
  );
}

let rootInstance = null;
let currentContainer = null;

export function render3DCircularFlow(container, spec) {
  if (!container || !spec || !Array.isArray(spec.flows) || !Array.isArray(spec.nodes)) return false;

  if (!rootInstance || currentContainer !== container || !container.querySelector('.cf-3d-wrapper')) {
    unmount3DCircularFlow();
    container.innerHTML = '';
    currentContainer = container;
    const wrapper = document.createElement('div');
    wrapper.className = 'cf-3d-wrapper';
    wrapper.setAttribute('role', 'img');
    container.appendChild(wrapper);
    rootInstance = createRoot(wrapper);
  }
  const wrapper = container.querySelector('.cf-3d-wrapper');
  if (wrapper) {
    wrapper.setAttribute('aria-label', spec.ariaLabel || '');
    // Machine-readable mirror of what is drawn — what tools/smoke.js asserts on.
    wrapper.dataset.nodes = spec.nodes.map(n => n.key).join(',');
    wrapper.dataset.flows = spec.flows.filter(f => f.value > 0).map(f => `${f.id}:${f.from}>${f.to}:${f.value}`).join(',');
  }

  rootInstance.render(
    h(Canvas, {
      orthographic: true,
      camera: { position: [14, 14, 14], zoom: 26, near: -100, far: 1000 },
      style: { width: '100%', height: '100%' }
    },
      h(CircularFlow3DScene, { spec })
    )
  );
  return true;
}

// Stops the WebGL loop and frees the context — called when the student turns
// the 3D view off or leaves the sim.
export function unmount3DCircularFlow() {
  if (rootInstance) {
    try { rootInstance.unmount(); } catch { /* already gone */ }
  }
  rootInstance = null;
  currentContainer = null;
}
