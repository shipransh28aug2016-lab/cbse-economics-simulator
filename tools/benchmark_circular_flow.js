const { performance } = require('perf_hooks');

// Benchmark the loop in GlowingParticleFlow

function runUncachedLoop(children, particles, time, curve) {
  let dummy = 0;
  for (let i = 0; i < children.length; i++) {
    if (i >= particles.length) break;
    const mesh = children[i];
    let t = (particles[i].offset + time) % 1.0;
    mesh.position.x = pt_x(t);
    mesh.position.y = pt_y(t);
    mesh.position.z = pt_z(t);

    const s = particles[i].scale * (0.8 + 0.4 * Math.sin(t * Math.PI * 2 + time * 3));
    mesh.scale.x = s;
    mesh.scale.y = s;
    mesh.scale.z = s;
    dummy += s;
  }
  return dummy;
}

function runCachedLoop(children, particles, time, curve) {
  let dummy = 0;
  for (let i = 0, len = children.length; i < len; i++) {
    if (i >= particles.length) break;
    const mesh = children[i];
    let t = (particles[i].offset + time) % 1.0;
    mesh.position.x = pt_x(t);
    mesh.position.y = pt_y(t);
    mesh.position.z = pt_z(t);

    const s = particles[i].scale * (0.8 + 0.4 * Math.sin(t * Math.PI * 2 + time * 3));
    mesh.scale.x = s;
    mesh.scale.y = s;
    mesh.scale.z = s;
    dummy += s;
  }
  return dummy;
}

function pt_x(t) { return t * 10; }
function pt_y(t) { return t * 5; }
function pt_z(t) { return t * 2; }

const N_CHILDREN = 25;
const children = Array.from({ length: N_CHILDREN }, () => ({
  position: { x: 0, y: 0, z: 0 },
  scale: { x: 1, y: 1, z: 1 }
}));

const particles = Array.from({ length: N_CHILDREN }, (_, i) => ({
  offset: i / N_CHILDREN,
  scale: 0.18
}));

const ITERATIONS = 2000000;

// Warm up V8
for (let i = 0; i < 100000; i++) {
  runUncachedLoop(children, particles, i * 0.01);
  runCachedLoop(children, particles, i * 0.01);
}

// Measure Uncached
const startUncached = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  runUncachedLoop(children, particles, i * 0.01);
}
const durationUncached = performance.now() - startUncached;

// Measure Cached
const startCached = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  runCachedLoop(children, particles, i * 0.01);
}
const durationCached = performance.now() - startCached;

console.log(`Uncached loop (2,000,000 frame updates): ${durationUncached.toFixed(2)} ms`);
console.log(`Cached loop   (2,000,000 frame updates): ${durationCached.toFixed(2)} ms`);
console.log(`Improvement: ${((durationUncached - durationCached) / durationUncached * 100).toFixed(2)}%`);
