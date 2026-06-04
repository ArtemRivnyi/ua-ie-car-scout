import { describe, it, after } from 'node:test';
import assert from 'node:assert';
import supertest from 'supertest';
import app from '../server/index.js';
import { closeBrowser } from '../server/scrapers/puppeteerSetup.js';

describe('API Integration Tests with Deduplication and Year Filters', () => {
  it('GET /api/scrape/ua should strictly drop cars outside year range', async () => {
    const res = await supertest(app).get('/api/scrape/ua?sources=rst,olx&query=Toyota+Camry&yearFrom=2014&yearTo=2015');
    assert.strictEqual(res.status, 200);
    const { listings, stats } = res.body;
    
    assert(Array.isArray(listings), 'listings should be an array');
    
    for (const ad of listings) {
      assert.ok(ad.year >= 2014 && ad.year <= 2015, `Ad ${ad.id} year ${ad.year} is out of bounds!`);
    }
  });

  it('GET /api/scrape/ie should deduplicate and strictly filter years', async () => {
    const res = await supertest(app).get('/api/scrape/ie?sources=donedeal,carzone,carsireland&make=Toyota&model=Camry&yearFrom=2014&yearTo=2015');
    assert.strictEqual(res.status, 200);
    const { listings, stats } = res.body;
    
    assert(Array.isArray(listings), 'listings should be an array');
    
    for (const ad of listings) {
      assert.ok(ad.year >= 2014 && ad.year <= 2015, `Ad ${ad.id} year ${ad.year} is out of bounds!`);
    }
  });

  after(async () => {
    await closeBrowser();
  });
});
