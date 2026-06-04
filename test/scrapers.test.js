import { describe, it, after } from 'node:test';
import assert from 'node:assert';
import { scrapeRst } from '../server/scrapers/rst.js';
import { scrapeOlx } from '../server/scrapers/olx.js';
import { scrapeCarsUa } from '../server/scrapers/carsua.js';
import { scrapeCarsIreland } from '../server/scrapers/carsireland.js';
import { scrapeCarzone } from '../server/scrapers/carzone.js';
import { closeBrowser } from '../server/scrapers/puppeteerSetup.js';

describe('Scrapers - Integration Tests', () => {
  const checkResults = (results, expectedMake) => {
    assert(Array.isArray(results), 'Should return an array');
    assert(results.length > 0, 'Should return at least one item');
    for (const ad of results) {
      assert(ad.priceEur > 0, `Should have price in EUR for ${ad.sourceUrl}`);
      assert(ad.sourceUrl, 'Should have a source URL');
      if (expectedMake) {
        const makeMatch = (ad.make && ad.make.toLowerCase().includes(expectedMake.toLowerCase())) || 
                          (ad.description && ad.description.toLowerCase().includes(expectedMake.toLowerCase()));
        assert(makeMatch, `Ad ${ad.sourceUrl} should match make ${expectedMake}`);
      }
    }
  };

  it('should scrape RST and apply filters correctly', async () => {
    const results = await scrapeRst("Toyota Corolla", 2010, 2015);
    checkResults(results, "Toyota");
    for (const ad of results) {
      assert(ad.year !== null, `Ad ${ad.sourceUrl} MUST have a year`);
      assert(ad.year >= 2010 && ad.year <= 2015, `Year ${ad.year} should be between 2010 and 2015`);
    }
  });

  it('should scrape OLX and apply filters correctly', async () => {
    const results = await scrapeOlx("Toyota Corolla", 2010, 2015);
    checkResults(results, "Toyota");
    for (const ad of results) {
      assert(ad.year !== null, `Ad ${ad.sourceUrl} MUST have a year`);
      assert(ad.year >= 2010 && ad.year <= 2015, `Year ${ad.year} should be between 2010 and 2015`);
    }
  });



  it('should scrape CarsIreland and apply filters correctly', async () => {
    const results = await scrapeCarsIreland("Toyota", "Corolla", 2010, 2015);
    checkResults(results, "Toyota");
    for (const ad of results) {
      assert(ad.year !== null, `Ad ${ad.sourceUrl} MUST have a year`);
      assert(ad.year >= 2010 && ad.year <= 2015, `Year ${ad.year} should be between 2010 and 2015`);
    }
  });

  it('should scrape Carzone and apply filters correctly', async () => {
    const results = await scrapeCarzone("Toyota", "Corolla", 2010, 2015);
    checkResults(results, "Toyota");
    for (const ad of results) {
      assert(ad.year !== null, `Ad ${ad.sourceUrl} MUST have a year`);
      assert(ad.year >= 2010 && ad.year <= 2015, `Year ${ad.year} should be between 2010 and 2015`);
    }
  });

  after(async () => {
    await closeBrowser();
  });
});
