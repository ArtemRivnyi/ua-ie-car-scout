import { scrapeRst } from './server/scrapers/rst.js';
import { scrapeOlx } from './server/scrapers/olx.js';
import { scrapeDoneDeal } from './server/scrapers/donedeal.js';
import { closeBrowser } from './server/scrapers/puppeteerSetup.js';
import fs from 'fs';

async function runFullTest() {
  const report = [];
  const addReport = (text) => {
    console.log(text);
    report.push(text);
  };

  addReport('=== FULL SCRAPER E2E REPORT ===');
  addReport(`Date: ${new Date().toISOString()}`);
  addReport('Target: Toyota Corolla');
  addReport('----------------------------------------');

  // Test RST
  try {
    addReport('1. Testing RST.ua...');
    const t0 = Date.now();
    const rstAds = await scrapeRst('Toyota Corolla');
    addReport(`- Fetched ${rstAds.length} listings successfully.`);
    if (rstAds.length > 0) {
       addReport(`  Sample price: €${rstAds[0].priceEur} (${rstAds[0].priceOriginal} ${rstAds[0].priceOriginalCurrency})`);
       addReport(`  Sample ID: ${rstAds[0].id}`);
       addReport(`  Sample URL: ${rstAds[0].sourceUrl}`);
    }
    addReport(`- RST Test: SUCCESS (${Date.now() - t0}ms)`);
  } catch (err) {
    addReport(`- RST Test: FAILED (${err.message})`);
  }
  addReport('----------------------------------------');

  // Test OLX
  try {
    addReport('2. Testing OLX.ua...');
    const t0 = Date.now();
    const olxAds = await scrapeOlx('Toyota Corolla');
    addReport(`- Fetched ${olxAds.length} listings successfully.`);
    if (olxAds.length > 0) {
       addReport(`  Sample price: €${olxAds[0].priceEur} (${olxAds[0].priceOriginal} ${olxAds[0].priceOriginalCurrency})`);
       addReport(`  Sample ID: ${olxAds[0].id}`);
       addReport(`  Sample URL: ${olxAds[0].sourceUrl}`);
    }
    addReport(`- OLX Test: SUCCESS (${Date.now() - t0}ms)`);
  } catch (err) {
    addReport(`- OLX Test: FAILED (${err.message})`);
  }
  addReport('----------------------------------------');

  // Test DoneDeal
  try {
    addReport('3. Testing DoneDeal.ie...');
    const t0 = Date.now();
    const ddAds = await scrapeDoneDeal('Toyota Corolla');
    addReport(`- Fetched ${ddAds.length} listings successfully.`);
    if (ddAds.length > 0) {
       addReport(`  Sample price: €${ddAds[0].priceEur} (${ddAds[0].priceOriginal} ${ddAds[0].priceOriginalCurrency})`);
       addReport(`  Sample ID: ${ddAds[0].id}`);
       addReport(`  Sample URL: ${ddAds[0].sourceUrl}`);
    }
    addReport(`- DoneDeal Test: SUCCESS (${Date.now() - t0}ms)`);
  } catch (err) {
    addReport(`- DoneDeal Test: FAILED (${err.message})`);
  }
  addReport('----------------------------------------');

  await closeBrowser();

  addReport('=== TEST COMPLETED ===');
  fs.writeFileSync('e2e_report.txt', report.join('\n'));
}

runFullTest().catch(console.error);
