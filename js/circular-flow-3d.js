import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';

const h = React.createElement;

// Helper to generate text texture for 3D Sprites
function createTextSprite(text, color = '#ffffff', bgColor = 'rgba(15, 23, 42, 0.75)') {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  // Background pill
  ctx.fillStyle = bgColor;
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(8, 8, 240, 48, 12);
  } else {
    ctx.rect(8, 8, 240, 48);
  }
  ctx.fill();

  // Border
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.stroke();

  // Text
  ctx.fillStyle = color;
  ctx.font = 'Bold 20px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 128, 32);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;

  const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(3, 0.75, 1);
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

// Glowing Particle Stream along 3D Quadratic Bezier Curve
function GlowingParticleFlow({ start, end, mid, color, isRealFlow, intensity = 1, speed = 1, particleCount = 12 }) {
  const groupRef = useRef();

  const curve = useMemo(() => {
    return new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...start),
      new THREE.Vector3(...mid),
      new THREE.Vector3(...end)
    );
  }, [start, end, mid]);

  const particles = useMemo(() => {
    const arr = [];
    const count = Math.max(3, Math.min(25, Math.floor(particleCount * (intensity / 100))));
    for (let i = 0; i < count; i++) {
      arr.push({
        offset: i / count,
        scale: isRealFlow ? 0.14 : 0.18,
      });
    }
    return arr;
  }, [particleCount, intensity, isRealFlow]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime() * 0.4 * (speed + intensity / 100);
    const children = groupRef.current.children;

    for (let i = 0; i < children.length; i++) {
      if (i >= particles.length) break;
      const mesh = children[i];
      let t = (particles[i].offset + time) % 1.0;
      const pt = curve.getPoint(t);
      mesh.position.copy(pt);

      const s = particles[i].scale * (0.8 + 0.4 * Math.sin(t * Math.PI * 2 + time * 3));
      mesh.scale.set(s, s, s);
    }
  });

  const linePoints = useMemo(() => curve.getPoints(30), [curve]);
  const lineGeometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(linePoints), [linePoints]);

  if (intensity <= 0) return null;

  return h('group', null,
    h('line', { geometry: lineGeometry },
      h('lineBasicMaterial', { color, transparent: true, opacity: 0.35, linewidth: 2 })
    ),
    h('group', { ref: groupRef },
      particles.map((p, idx) =>
        h('mesh', { key: idx },
          isRealFlow ? h('boxGeometry', { args: [1, 1, 1] }) : h('sphereGeometry', { args: [1, 12, 12] }),
          h('meshBasicMaterial', { color })
        )
      )
    )
  );
}

// Main 3D Circular Flow Scene
function CircularFlow3DScene({ values }) {
  const model = values.model || '2-sector';
  const hasBank = !!values.hasBank;

  const C = values.C || 90;
  const Y = values.Y || 90;
  const S = values.S || 0;
  const I = values.I || 0;
  const T = values.T || 0;
  const G = values.G || 0;
  const X = values.X || 0;
  const M = values.M || 0;

  const householdPos = [-6.2, 0, 0];
  const firmPos = [6.2, 0, 0];
  const govtPos = [0, 0, -4.8];
  const bankPos = [0, 0, 0];
  const foreignPos = [0, 0, 4.8];

  return h(React.Fragment, null,
    h('ambientLight', { intensity: 0.8 }),
    h('directionalLight', { position: [12, 20, 10], intensity: 1.2, castShadow: true }),
    h('directionalLight', { position: [-10, 10, -10], intensity: 0.4, color: '#a5f3fc' }),
    h('gridHelper', { args: [24, 24, '#475569', '#1e293b'], position: [0, -0.2, 0] }),

    h(HouseholdModel, { position: householdPos, label: 'Households' }),
    h(FirmModel, { position: firmPos, label: 'Firms' }),

    (model === '3-sector' || model === '4-sector') && h(GovtModel, { position: govtPos, label: 'Government' }),
    hasBank && h(BankModel, { position: bankPos, label: 'Financial Market' }),
    model === '4-sector' && h(ForeignModel, { position: foreignPos, label: 'Foreign Sector' }),

    h(GlowingParticleFlow, {
      start: householdPos, end: firmPos, mid: [0, 1.8, 2.2],
      color: '#a855f7', isRealFlow: false, intensity: C, particleCount: 14
    }),
    h(GlowingParticleFlow, {
      start: firmPos, end: householdPos, mid: [0, 1.8, -2.2],
      color: '#eab308', isRealFlow: false, intensity: Y, particleCount: 14
    }),
    h(GlowingParticleFlow, {
      start: firmPos, end: householdPos, mid: [0, 0.6, 1.5],
      color: '#22c55e', isRealFlow: true, intensity: C, particleCount: 10
    }),
    h(GlowingParticleFlow, {
      start: householdPos, end: firmPos, mid: [0, 0.6, -1.5],
      color: '#3b82f6', isRealFlow: true, intensity: Y, particleCount: 10
    }),

    hasBank && S > 0 && h(GlowingParticleFlow, {
      start: householdPos, end: bankPos, mid: [-3.1, 1.2, 0],
      color: '#06b6d4', isRealFlow: false, intensity: S * 3, particleCount: 10
    }),
    hasBank && I > 0 && h(GlowingParticleFlow, {
      start: bankPos, end: firmPos, mid: [3.1, 1.2, 0],
      color: '#f97316', isRealFlow: false, intensity: I * 3, particleCount: 10
    }),

    (model === '3-sector' || model === '4-sector') && T > 0 && h(GlowingParticleFlow, {
      start: householdPos, end: govtPos, mid: [-3.5, 1.5, -2.8],
      color: '#ef4444', isRealFlow: false, intensity: T * 3, particleCount: 10
    }),
    (model === '3-sector' || model === '4-sector') && G > 0 && h(GlowingParticleFlow, {
      start: govtPos, end: firmPos, mid: [3.5, 1.5, -2.8],
      color: '#3b82f6', isRealFlow: false, intensity: G * 3, particleCount: 10
    }),

    model === '4-sector' && M > 0 && h(GlowingParticleFlow, {
      start: householdPos, end: foreignPos, mid: [-3.5, 1.5, 2.8],
      color: '#ec4899', isRealFlow: false, intensity: M * 3, particleCount: 10
    }),
    model === '4-sector' && X > 0 && h(GlowingParticleFlow, {
      start: foreignPos, end: firmPos, mid: [3.5, 1.5, 2.8],
      color: '#10b981', isRealFlow: false, intensity: X * 3, particleCount: 10
    })
  );
}

// Container Component attached to window
let rootInstance = null;
let currentContainer = null;

export function render3DCircularFlow(container, values) {
  if (!container) return;

  if (!rootInstance || currentContainer !== container) {
    container.innerHTML = '';
    currentContainer = container;

    container.style.position = 'relative';
    container.style.width = '100%';
    container.style.height = '480px';
    container.style.borderRadius = '16px';
    container.style.overflow = 'hidden';
    container.style.background = 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)';

    const canvasWrapper = document.createElement('div');
    canvasWrapper.style.width = '100%';
    canvasWrapper.style.height = '100%';
    container.appendChild(canvasWrapper);

    rootInstance = createRoot(canvasWrapper);
  }

  rootInstance.render(
    h(Canvas, {
      orthographic: true,
      camera: { position: [14, 14, 14], zoom: 36, near: -100, far: 1000 },
      style: { width: '100%', height: '100%' }
    },
      h(CircularFlow3DScene, { values })
    )
  );
}

if (typeof window !== 'undefined') {
  window.renderCircularFlow3D = render3DCircularFlow;
}
