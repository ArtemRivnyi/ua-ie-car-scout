import test from 'node:test';
import assert from 'node:assert';
import { calcPriceStats, compareMarkets } from '../src/services/priceService.js';

test('priceService.js - Statistical Analysis', async (t) => {
  await t.test('calcPriceStats with valid numeric array', () => {
    const data = [1000, 2000, 3000, 4000, 5000];
    const stats = calcPriceStats(data);
    assert.strictEqual(stats.count, 5);
    assert.strictEqual(stats.min, 1000);
    assert.strictEqual(stats.max, 5000);
    assert.strictEqual(stats.median, 3000);
    assert.strictEqual(stats.avg, 3000);
  });

  await t.test('calcPriceStats with valid listings array', () => {
    const data = [
      { priceEur: 1000 }, { priceEur: 2000 }, { priceEur: 3000 }
    ];
    const stats = calcPriceStats(data);
    assert.strictEqual(stats.count, 3);
    assert.strictEqual(stats.median, 2000);
  });

  await t.test('calcPriceStats filters outliers', () => {
    const data = [1000, 1100, 1200, 1050, 1150, 10000]; // 10000 is an outlier
    const stats = calcPriceStats(data);
    assert.ok(stats.outliers.includes(10000));
    assert.ok(stats.avgFiltered < stats.avg);
  });

  await t.test('calcPriceStats with empty/invalid inputs', () => {
    assert.strictEqual(calcPriceStats([]), null);
    assert.strictEqual(calcPriceStats(null), null);
  });

  await t.test('compareMarkets calculates savings and percentage correctly', () => {
    const uaStats = { median: 10000 };
    const ieStats = { median: 8000 };
    const result = compareMarkets(uaStats, ieStats);
    assert.strictEqual(result.uaAvg, 10000);
    assert.strictEqual(result.ieAvg, 8000);
    assert.strictEqual(result.saving, -2000);
    assert.strictEqual(result.pct, -20);
  });
});
