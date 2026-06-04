/**
 * priceService.js — statistical analysis of listing prices.
 * Accepts either an array of Listing objects OR an array of numbers.
 */

export function calcPriceStats(input) {
  if (!input || input.length === 0) return null;

  // Accepts listings[] or numbers[]
  const prices = Array.isArray(input) && typeof input[0] === 'object'
    ? input.map(l => l.priceEur).filter(p => typeof p === 'number' && p > 0)
    : input.filter(p => typeof p === 'number' && p > 0);

  if (!prices.length) return null;

  const sorted = [...prices].sort((a, b) => a - b);
  const n   = sorted.length;
  const sum = sorted.reduce((a, b) => a + b, 0);
  const avg = Math.round(sum / n);

  const median = n % 2 === 0
    ? Math.round((sorted[n/2-1] + sorted[n/2]) / 2)
    : sorted[Math.floor(n/2)];

  const q1  = sorted[Math.floor(n * 0.25)];
  const q3  = sorted[Math.floor(n * 0.75)];
  const iqr = q3 - q1;
  const lo  = q1 - 1.5 * iqr;
  const hi  = q3 + 1.5 * iqr;

  const filtered    = sorted.filter(p => p >= lo && p <= hi);
  const avgFiltered = filtered.length
    ? Math.round(filtered.reduce((a, b) => a + b, 0) / filtered.length)
    : avg;
  const outliers = sorted.filter(p => p < lo || p > hi);

  return { count: n, min: sorted[0], max: sorted[n-1], avg, median, avgFiltered, q1, q3, outliers, prices: sorted };
}

export function compareMarkets(uaStats, ieMarket) {
  if (!uaStats || !ieMarket) return null;
  const uaRef = uaStats.median || uaStats.avgFiltered || uaStats.avg;
  const ieRef = ieMarket.median || ieMarket.avg;
  const saving = ieRef - uaRef;
  const pct    = uaRef > 0 ? Math.round((saving / uaRef) * 100) : 0;
  return { uaAvg: uaRef, ieAvg: ieRef, saving, pct };
}
