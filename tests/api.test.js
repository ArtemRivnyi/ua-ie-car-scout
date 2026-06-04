import test from 'node:test';
import assert from 'node:assert';
import supertest from 'supertest';
import app from '../server/index.js';

test('API Endpoints Tests', async (t) => {
  
  await t.test('GET /api/health should return status ok', async () => {
    const res = await supertest(app).get('/api/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, 'ok');
    assert.ok(res.body.ts);
  });

  await t.test('GET /api/scrape/ua with invalid sources should return empty listings gracefully', async () => {
    const res = await supertest(app).get('/api/scrape/ua?sources=nonexistent&query=Toyota');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.listings));
    assert.strictEqual(res.body.listings.length, 0);
  });

  await t.test('GET /api/scrape/ie with no parameters should handle empty state', async () => {
    const res = await supertest(app).get('/api/scrape/ie?sources=nonexistent');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.listings));
    assert.strictEqual(res.body.listings.length, 0);
  });

  // Note: We don't trigger real scrapers for large queries here to avoid rate limits
  // Real scrapers are tested in test/scrapers.test.js
});
