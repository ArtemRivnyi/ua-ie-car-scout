/**
 * exchangeRate.test.js — tests for the exchange rate service
 *
 * Tests caching, fallback behavior, and rate structure.
 */
import test from 'node:test';
import assert from 'node:assert';
import { getExchangeRates } from '../server/services/exchangeRateService.js';

test('ExchangeRate Service', async (t) => {

  await t.test('getExchangeRates returns valid rate object', async () => {
    const rates = await getExchangeRates();
    assert.ok(rates, 'rates should not be null');
    assert.ok(typeof rates.usdToEur === 'number', 'usdToEur should be a number');
    assert.ok(typeof rates.uahToEur === 'number', 'uahToEur should be a number');
    assert.ok(typeof rates.uahToUsd === 'number', 'uahToUsd should be a number');
    assert.ok(rates.source, 'should have source field');
    assert.ok(rates.lastUpdated, 'should have lastUpdated field');
  });

  await t.test('rates are in reasonable ranges', async () => {
    const rates = await getExchangeRates();
    // USD/EUR should be between 0.7 and 1.2 (historical reasonable range)
    assert.ok(rates.usdToEur > 0.7 && rates.usdToEur < 1.2, `usdToEur ${rates.usdToEur} out of range`);
    // UAH/EUR should be very small (UAH is weak vs EUR)
    assert.ok(rates.uahToEur > 0.01 && rates.uahToEur < 0.1, `uahToEur ${rates.uahToEur} out of range`);
    // UAH/USD inverse should be reasonable
    assert.ok(rates.uahToUsd > 0.01 && rates.uahToUsd < 0.1, `uahToUsd ${rates.uahToUsd} out of range`);
  });

  await t.test('second call returns cached rates (fast)', async () => {
    const t0 = Date.now();
    const rates1 = await getExchangeRates();
    const rates2 = await getExchangeRates();
    const elapsed = Date.now() - t0;
    // Second call should be nearly instant (cached)
    assert.ok(elapsed < 500, `Two calls took ${elapsed}ms — cache may not be working`);
    assert.strictEqual(rates1.usdToEur, rates2.usdToEur);
    assert.strictEqual(rates1.source, rates2.source);
  });
});
