/**
 * importCalcService.test.js — 100% coverage tests for the import calculator
 *
 * Tests every function, branch, and edge case:
 *  - calculateImportCost: classic/aged/modern, OMSP, CO₂ bands, NOx, fuel types
 *  - getVrtRateFromCo2: all 20 bands + edge cases
 *  - calculateNoxLevy: all 5 tiers + edge cases
 *  - calcMargin: profitable / breakeven / loss
 */
import test from 'node:test';
import assert from 'node:assert';
import {
  calculateImportCost,
  calcMargin,
  getVrtRateFromCo2,
  calculateNoxLevy,
  CUSTOMS_RATE,
  VAT_RATE,
  DEFAULT_VRT_RATE,
  CUSTOMS_EXEMPT_AGE,
} from '../src/services/importCalcService.js';

// ═══════════════════════════════════════════════════════════════
// calculateImportCost — core tax calculations
// ═══════════════════════════════════════════════════════════════

test('importCalcService — calculateImportCost', async (t) => {

  // ── Classic car (30+ years) ────────────────────────────────

  await t.test('classic car (1985 Toyota AE86, €5000) — customs exempt', () => {
    const r = calculateImportCost({ carPrice: 5000, carYear: 1985, shippingCost: 1400, miscCosts: 500 });

    assert.strictEqual(r.isClassic, true);
    assert.ok(r.carAge >= 30, `carAge ${r.carAge} should be >= 30`);

    // Customs: exempt for classics
    assert.strictEqual(r.customsDuty, 0);
    assert.strictEqual(r.customsValue, 5000 + 1400); // landed value

    // VAT: base = landed value + customs (0) = 6400
    assert.strictEqual(r.vatBase, 6400);
    assert.strictEqual(r.vatAmount, Math.round(6400 * VAT_RATE));

    // VRT: OMSP estimate = 2.5× price for classics
    assert.strictEqual(r.estimatedOmsp, 5000 * 2.5);
    assert.strictEqual(r.vrtBase, 12500);
    assert.strictEqual(r.vrtRate, DEFAULT_VRT_RATE);
    assert.strictEqual(r.vrtAmount, Math.round(12500 * 0.20));

    // NOx: 0 for petrol
    assert.strictEqual(r.noxLevy, 0);
    assert.strictEqual(r.fuelType, 'petrol');

    // Warning must mention classic
    assert.ok(r.warning.includes('classic'), 'warning should mention classic');

    // Total landed
    const expectedTax = 0 + r.vatAmount + r.vrtAmount + 0;
    assert.strictEqual(r.totalImportTax, expectedTax);
    assert.strictEqual(r.totalLanded, 5000 + expectedTax + 1400 + 500);
  });

  await t.test('classic car with OMSP override', () => {
    const r = calculateImportCost({ carPrice: 3000, carYear: 1990, omsp: 15000 });

    assert.strictEqual(r.omspOverride, 15000);
    assert.strictEqual(r.vrtBase, 15000); // OMSP override used, not estimate
    assert.strictEqual(r.vrtAmount, Math.round(15000 * 0.20));
  });

  // ── Modern car (under 20 years) ───────────────────────────

  await t.test('modern car (2015, €8000) — pays customs', () => {
    const r = calculateImportCost({ carPrice: 8000, carYear: 2015, shippingCost: 1400, miscCosts: 500 });

    assert.strictEqual(r.isClassic, false);
    assert.ok(r.carAge < 30);

    // Customs: 6.5% of landed value (8000 + 1400 = 9400)
    assert.strictEqual(r.customsValue, 9400);
    assert.strictEqual(r.customsDuty, Math.round(9400 * CUSTOMS_RATE));

    // VAT: base = landed value + customs
    assert.strictEqual(r.vatBase, 9400 + r.customsDuty);
    assert.strictEqual(r.vatAmount, Math.round(r.vatBase * VAT_RATE));

    // VRT: OMSP estimate = 1.1× for modern
    assert.strictEqual(r.estimatedOmsp, 8000 * 1.1);
    assert.strictEqual(r.vrtBase, 8800);

    // Warning should mention CO₂
    assert.ok(r.warning.includes('CO₂'), 'warning should mention CO₂');
  });

  await t.test('modern car with CO₂ input — precise VRT band', () => {
    const r = calculateImportCost({ carPrice: 8000, carYear: 2015, co2Gkm: 120 });

    assert.strictEqual(r.vrtRate, 0.18); // Band 10: 116–120 g/km → 18%
    assert.strictEqual(r.co2Gkm, 120);
    assert.ok(r.warning.includes('CO₂ band'));
  });

  // ── Diesel with NOx ───────────────────────────────────────

  await t.test('diesel car with NOx levy', () => {
    const r = calculateImportCost({ carPrice: 8000, carYear: 2015, fuelType: 'diesel', noxMgKm: 80 });

    assert.strictEqual(r.fuelType, 'diesel');
    assert.strictEqual(r.noxMgKm, 80);
    assert.strictEqual(r.noxLevy, calculateNoxLevy(80));
    assert.ok(r.noxLevy > 0);
    assert.ok(r.totalImportTax > 0);
  });

  await t.test('diesel without NOx data — levy = 0', () => {
    const r = calculateImportCost({ carPrice: 8000, carYear: 2015, fuelType: 'diesel' });
    assert.strictEqual(r.noxLevy, 0);
  });

  await t.test('petrol car — no NOx levy even with noxMgKm', () => {
    const r = calculateImportCost({ carPrice: 8000, carYear: 2015, fuelType: 'petrol', noxMgKm: 80 });
    assert.strictEqual(r.noxLevy, 0);
  });

  await t.test('hybrid car — no NOx levy', () => {
    const r = calculateImportCost({ carPrice: 8000, carYear: 2015, fuelType: 'hybrid', noxMgKm: 80 });
    assert.strictEqual(r.noxLevy, 0);
  });

  await t.test('electric car — no NOx levy', () => {
    const r = calculateImportCost({ carPrice: 8000, carYear: 2015, fuelType: 'electric' });
    assert.strictEqual(r.noxLevy, 0);
  });

  // ── Defaults ──────────────────────────────────────────────

  await t.test('default shipping = 1400, default misc = 500', () => {
    const r = calculateImportCost({ carPrice: 5000, carYear: 2015 });
    assert.strictEqual(r.shippingCost, 1400);
    assert.strictEqual(r.miscCosts, 500);
  });

  await t.test('default fuelType = petrol', () => {
    const r = calculateImportCost({ carPrice: 5000, carYear: 2015 });
    assert.strictEqual(r.fuelType, 'petrol');
  });

  await t.test('co2Gkm default = null (uses DEFAULT_VRT_RATE)', () => {
    const r = calculateImportCost({ carPrice: 5000, carYear: 2015 });
    assert.strictEqual(r.co2Gkm, null);
    assert.strictEqual(r.vrtRate, DEFAULT_VRT_RATE);
  });

  // ── Edge cases ────────────────────────────────────────────

  await t.test('zero carPrice', () => {
    const r = calculateImportCost({ carPrice: 0, carYear: 2015 });
    assert.strictEqual(r.carPrice, 0);
    assert.strictEqual(r.customsValue, 1400); // shipping only
    assert.strictEqual(r.estimatedOmsp, 0);
    assert.strictEqual(r.vrtAmount, 0);
  });

  await t.test('very high carPrice (€100,000)', () => {
    const r = calculateImportCost({ carPrice: 100000, carYear: 2020 });
    assert.ok(r.totalLanded > 100000);
    assert.ok(r.customsDuty > 0);
    assert.ok(r.vatAmount > 0);
    assert.ok(r.vrtAmount > 0);
  });

  await t.test('exactly 30 years old = classic', () => {
    const currentYear = new Date().getFullYear();
    const r = calculateImportCost({ carPrice: 5000, carYear: currentYear - 30 });
    assert.strictEqual(r.isClassic, true);
    assert.strictEqual(r.customsDuty, 0);
  });

  await t.test('29 years old = NOT classic', () => {
    const currentYear = new Date().getFullYear();
    const r = calculateImportCost({ carPrice: 5000, carYear: currentYear - 29 });
    assert.strictEqual(r.isClassic, false);
    assert.ok(r.customsDuty > 0);
  });

  await t.test('return object has all expected fields', () => {
    const r = calculateImportCost({ carPrice: 5000, carYear: 2015 });
    const expectedFields = [
      'carPrice', 'carYear', 'carAge', 'isClassic',
      'customsValue', 'customsDuty', 'vatAmount', 'vatBase',
      'vrtAmount', 'vrtRate', 'vrtBase', 'estimatedOmsp', 'omspOverride',
      'co2Gkm', 'fuelType', 'noxMgKm', 'noxLevy',
      'shippingCost', 'miscCosts', 'totalImportTax', 'totalLanded', 'warning',
    ];
    for (const field of expectedFields) {
      assert.ok(field in r, `Missing field: ${field}`);
    }
  });
});

// ═══════════════════════════════════════════════════════════════
// getVrtRateFromCo2 — all 20 bands
// ═══════════════════════════════════════════════════════════════

test('importCalcService — getVrtRateFromCo2', async (t) => {
  // Band boundaries
  const cases = [
    [0, 0.07],     // Band 1: 0–50
    [50, 0.07],    // upper boundary of Band 1
    [51, 0.09],    // Band 2: 51–80
    [80, 0.09],
    [81, 0.0975],  // Band 3: 81–85
    [85, 0.0975],
    [86, 0.105],   // Band 4: 86–90
    [90, 0.105],
    [91, 0.1125],  // Band 5: 91–95
    [95, 0.1125],
    [96, 0.12],    // Band 6: 96–100
    [100, 0.12],
    [101, 0.135],  // Band 7: 101–105
    [105, 0.135],
    [106, 0.15],   // Band 8: 106–110
    [110, 0.15],
    [111, 0.165],  // Band 9: 111–115
    [115, 0.165],
    [116, 0.18],   // Band 10: 116–120
    [120, 0.18],
    [121, 0.195],  // Band 11: 121–125
    [125, 0.195],
    [126, 0.21],   // Band 12: 126–130
    [130, 0.21],
    [131, 0.225],  // Band 13: 131–135
    [135, 0.225],
    [136, 0.24],   // Band 14: 136–140
    [140, 0.24],
    [141, 0.255],  // Band 15: 141–145
    [145, 0.255],
    [146, 0.27],   // Band 16: 146–150
    [150, 0.27],
    [151, 0.295],  // Band 17: 151–155
    [155, 0.295],
    [156, 0.32],   // Band 18: 156–170
    [170, 0.32],
    [171, 0.355],  // Band 19: 171–190
    [190, 0.355],
    [191, 0.41],   // Band 20: 191+
    [250, 0.41],
    [500, 0.41],
  ];

  for (const [co2, expected] of cases) {
    await t.test(`CO₂ ${co2} g/km → ${(expected * 100).toFixed(2)}%`, () => {
      assert.strictEqual(getVrtRateFromCo2(co2), expected);
    });
  }

  await t.test('null CO₂ returns DEFAULT_VRT_RATE', () => {
    assert.strictEqual(getVrtRateFromCo2(null), DEFAULT_VRT_RATE);
  });

  await t.test('undefined CO₂ returns DEFAULT_VRT_RATE', () => {
    assert.strictEqual(getVrtRateFromCo2(undefined), DEFAULT_VRT_RATE);
  });

  await t.test('negative CO₂ returns DEFAULT_VRT_RATE', () => {
    assert.strictEqual(getVrtRateFromCo2(-10), DEFAULT_VRT_RATE);
  });
});

// ═══════════════════════════════════════════════════════════════
// calculateNoxLevy — all 5 tiers
// ═══════════════════════════════════════════════════════════════

test('importCalcService — calculateNoxLevy', async (t) => {
  // Tier 1: 0–40 mg/km → €5/mg
  await t.test('0 mg/km → €0', () => assert.strictEqual(calculateNoxLevy(0), 0));
  await t.test('20 mg/km → €100 (20×5)', () => assert.strictEqual(calculateNoxLevy(20), 100));
  await t.test('40 mg/km → €200 (40×5)', () => assert.strictEqual(calculateNoxLevy(40), 200));

  // Tier 2: 41–80 mg/km → €15/mg
  await t.test('41 mg/km → €615 (41×15)', () => assert.strictEqual(calculateNoxLevy(41), 615));
  await t.test('60 mg/km → €900 (60×15)', () => assert.strictEqual(calculateNoxLevy(60), 900));
  await t.test('80 mg/km → €1200 (80×15)', () => assert.strictEqual(calculateNoxLevy(80), 1200));

  // Tier 3: 81–120 mg/km → €25/mg
  await t.test('81 mg/km → €2025 (81×25)', () => assert.strictEqual(calculateNoxLevy(81), 2025));
  await t.test('100 mg/km → €2500 (100×25)', () => assert.strictEqual(calculateNoxLevy(100), 2500));
  await t.test('120 mg/km → €3000 (120×25)', () => assert.strictEqual(calculateNoxLevy(120), 3000));

  // Tier 4: 121–180 mg/km → €30/mg
  await t.test('121 mg/km → €3630 (121×30)', () => assert.strictEqual(calculateNoxLevy(121), 3630));
  await t.test('180 mg/km → €5400 (180×30)', () => assert.strictEqual(calculateNoxLevy(180), 5400));

  // Tier 5: 180+ mg/km → €35/mg
  await t.test('181 mg/km → €6335 (181×35)', () => assert.strictEqual(calculateNoxLevy(181), 6335));
  await t.test('200 mg/km → €7000 (200×35)', () => assert.strictEqual(calculateNoxLevy(200), 7000));

  // Edge cases
  await t.test('null → €0', () => assert.strictEqual(calculateNoxLevy(null), 0));
  await t.test('undefined → €0', () => assert.strictEqual(calculateNoxLevy(undefined), 0));
  await t.test('negative → €0', () => assert.strictEqual(calculateNoxLevy(-5), 0));
});

// ═══════════════════════════════════════════════════════════════
// calcMargin
// ═══════════════════════════════════════════════════════════════

test('importCalcService — calcMargin', async (t) => {
  await t.test('profitable (profit > 500)', () => {
    const r = calcMargin(10000, 15000);
    assert.strictEqual(r.profit, 5000);
    assert.strictEqual(r.margin, 50);
    assert.strictEqual(r.verdict, 'profitable');
  });

  await t.test('break even (profit between -500 and 500)', () => {
    const r = calcMargin(10000, 10200);
    assert.strictEqual(r.profit, 200);
    assert.strictEqual(r.verdict, 'breakEven');
  });

  await t.test('break even — exactly 0', () => {
    const r = calcMargin(10000, 10000);
    assert.strictEqual(r.profit, 0);
    assert.strictEqual(r.verdict, 'breakEven');
  });

  await t.test('break even — exactly 500', () => {
    const r = calcMargin(10000, 10500);
    assert.strictEqual(r.profit, 500);
    assert.strictEqual(r.verdict, 'breakEven');
  });

  await t.test('break even — exactly -500', () => {
    const r = calcMargin(10000, 9500);
    assert.strictEqual(r.profit, -500);
    assert.strictEqual(r.verdict, 'breakEven');
  });

  await t.test('loss (profit < -500)', () => {
    const r = calcMargin(15000, 10000);
    assert.strictEqual(r.profit, -5000);
    assert.strictEqual(r.verdict, 'loss');
  });

  await t.test('ieMarketAvg = 0 → margin = 0', () => {
    const r = calcMargin(10000, 0);
    assert.strictEqual(r.margin, 0);
  });

  await t.test('large profitable margin', () => {
    const r = calcMargin(5000, 20000);
    assert.strictEqual(r.profit, 15000);
    assert.strictEqual(r.margin, 300); // 15000/5000 * 100
    assert.strictEqual(r.verdict, 'profitable');
  });
});

// ═══════════════════════════════════════════════════════════════
// Exported constants
// ═══════════════════════════════════════════════════════════════

test('importCalcService — exported constants', async (t) => {
  await t.test('CUSTOMS_RATE = 6.5%', () => assert.strictEqual(CUSTOMS_RATE, 0.065));
  await t.test('VAT_RATE = 23%', () => assert.strictEqual(VAT_RATE, 0.23));
  await t.test('DEFAULT_VRT_RATE = 20%', () => assert.strictEqual(DEFAULT_VRT_RATE, 0.20));
  await t.test('CUSTOMS_EXEMPT_AGE = 30', () => assert.strictEqual(CUSTOMS_EXEMPT_AGE, 30));
});
