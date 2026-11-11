// Run with: node scripts/selftest.js
// Checks the scoring logic against synthetic price series (no API key or network needed).

import { computeTrendSignal } from '../api/_lib/trendScore.js';

function mulberry32(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function series(drift, noise, n = 300, seed = 1) {
  const rand = mulberry32(seed);
  let price = 100;
  const start = new Date('2025-01-01');
  return Array.from({ length: n }, (_, i) => {
    price *= 1 + drift + (rand() - 0.5) * 2 * noise;
    const d = new Date(start); d.setDate(d.getDate() + i);
    return { date: d.toISOString().slice(0, 10), close: price, volume: 1e6 };
  });
}

const cases = [
  { name: 'steady uptrend',   bars: series(0.0012, 0.004), expect: 'buy' },
  { name: 'steady downtrend', bars: series(-0.0012, 0.004), expect: 'sell' },
  { name: 'flat / choppy',    bars: series(0, 0.006), expect: 'hold' },
];

let failed = 0;
for (const c of cases) {
  const s = computeTrendSignal('TEST', c.bars);
  const ok = s.action === c.expect;
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${c.name.padEnd(18)} action=${s.action} score=${s.score} confidence=${s.confidence}`);
}

try {
  computeTrendSignal('TEST', series(0.001, 0.004, 100));
  console.log('FAIL  short history should throw'); failed++;
} catch { console.log('PASS  short history is rejected'); }

process.exit(failed ? 1 : 0);