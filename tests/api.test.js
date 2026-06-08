/**
 * api.test.js — API endpoint tests for server/index.js
 *
 * Tests all routes, filter logic, caching, and error handling.
 * Uses supertest (no real scraping — tests route structure and response format).
 */
import test from 'node:test';
import assert from 'node:assert';
import supertest from 'supertest';
import app from '../server/index.js';

test('API Endpoints Tests', async (t) => {

  // ── Health ────────────────────────────────────────────────

  await t.test('GET /api/health should return status ok', async () => {
    const res = await supertest(app).get('/api/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, 'ok');
    assert.ok(res.body.ts);
    assert.ok('cacheSize' in res.body);
  });

  // ── /api/scrape/ua ────────────────────────────────────────

  await t.test('GET /api/scrape/ua with invalid sources should return empty listings', async () => {
    const res = await supertest(app).get('/api/scrape/ua?sources=nonexistent&query=Toyota');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.listings));
    assert.strictEqual(res.body.listings.length, 0);
  });

  await t.test('GET /api/scrape/ua with no sources should return empty listings', async () => {
    const res = await supertest(app).get('/api/scrape/ua?query=Toyota');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.listings));
  });

  await t.test('GET /api/scrape/ua returns stats field', async () => {
    const res = await supertest(app).get('/api/scrape/ua?sources=nonexistent&query=Toyota');
    assert.strictEqual(res.status, 200);
    // stats is null when no listings
    assert.ok('stats' in res.body);
  });

  // ── /api/scrape/ie ────────────────────────────────────────

  await t.test('GET /api/scrape/ie with no parameters should handle empty state', async () => {
    const res = await supertest(app).get('/api/scrape/ie?sources=nonexistent');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.listings));
    assert.strictEqual(res.body.listings.length, 0);
  });

  await t.test('GET /api/scrape/ie with empty sources returns empty', async () => {
    const res = await supertest(app).get('/api/scrape/ie');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.listings));
  });

  // ── /api/irish-prices (legacy) ────────────────────────────

  await t.test('GET /api/irish-prices without model returns 400', async () => {
    const res = await supertest(app).get('/api/irish-prices');
    assert.strictEqual(res.status, 400);
    assert.ok(res.body.error);
  });

  // ── Caching ───────────────────────────────────────────────

  await t.test('GET /api/scrape/ua — second call should use cache', async () => {
    const url = '/api/scrape/ua?sources=nonexistent&query=CacheTest123';
    const res1 = await supertest(app).get(url);
    assert.strictEqual(res1.status, 200);
    // Second call — should hit cache
    const res2 = await supertest(app).get(url);
    assert.strictEqual(res2.status, 200);
    assert.deepStrictEqual(res1.body, res2.body);
  });
});
