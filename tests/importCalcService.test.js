import test from 'node:test';
import assert from 'node:assert';
import { calculateImportCost, calcMargin, VRT_RATES, CUSTOMS_RATE, VAT_RATE } from '../src/services/importCalcService.js';

test('calculateImportCost for a classic Toyota AE86 1985 (€5000)', () => {
  const result = calculateImportCost({
    carPrice: 5000,
    carYear: 1985,
    shippingCost: 900,
    miscCosts: 500
  });

  // customs = 0 for classics (>= 30 years)
  assert.strictEqual(result.customsDuty, 0);

  // vrt ≈ €700 (5000 * 0.14)
  assert.strictEqual(result.vrtAmount, Math.round(5000 * VRT_RATES.classic));
  assert.strictEqual(result.vrtAmount, 700);

  // vat ≈ €1150 (5000 * 0.23)
  assert.strictEqual(result.vatAmount, 5000 * VAT_RATE);
  assert.strictEqual(result.vatAmount, 1150);

  // total landed = 5000 + 0 + 700 + 1150 + 900 + 500 = 8250
  assert.strictEqual(result.totalLanded, 8250);
});

test('calculateImportCost for a 2005 car (€5000)', () => {
  const result = calculateImportCost({
    carPrice: 5000,
    carYear: 2005, // 21 years old as of 2026 => aged (20-30y)
    shippingCost: 900,
    miscCosts: 500
  });

  // customs duty = 6.5% of 5000 = 325
  assert.strictEqual(result.customsDuty, 325);

  // vat = 23% of (5000 + 325) = 1224.75 -> round to 1225
  assert.strictEqual(result.vatAmount, 1225);

  // vrt = 25% of 5000 = 1250 (aged rate)
  assert.strictEqual(result.vrtAmount, 1250);
});

test('calcMargin scenarios', () => {
  // Profitable
  const res1 = calcMargin(10000, 15000);
  assert.strictEqual(res1.profit, 5000);
  assert.strictEqual(res1.verdict, 'profitable');

  // Break even
  const res2 = calcMargin(10000, 10200);
  assert.strictEqual(res2.profit, 200);
  assert.strictEqual(res2.verdict, 'breakEven');

  // Loss
  const res3 = calcMargin(15000, 10000);
  assert.strictEqual(res3.profit, -5000);
  assert.strictEqual(res3.verdict, 'loss');
});
