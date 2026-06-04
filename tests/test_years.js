import { scrapeRst } from './server/scrapers/rst.js';
import { scrapeOlx } from './server/scrapers/olx.js';
import { scrapeDoneDeal } from './server/scrapers/donedeal.js';
import { closeBrowser } from './server/scrapers/puppeteerSetup.js';

async function testScrapers() {
  const q = 'Toyota Corolla';
  console.log('Testing RST...');
  try {
    const rstAds = await scrapeRst(q, '1980', '1995');
    console.log(`RST found ${rstAds.length} cars.`);
    rstAds.slice(0, 3).forEach(a => console.log(`  [RST] Year: ${a.year}, Model: ${a.model}, Title: ${a.title}`));
  } catch (e) { console.error('RST error:', e.message); }

  console.log('Testing OLX...');
  try {
    const olxAds = await scrapeOlx(q, '1980', '1995');
    console.log(`OLX found ${olxAds.length} cars.`);
    olxAds.slice(0, 3).forEach(a => console.log(`  [OLX] Year: ${a.year}, Model: ${a.model}, Title: ${a.title}`));
  } catch (e) { console.error('OLX error:', e.message); }

  console.log('Testing DoneDeal...');
  try {
    const ddAds = await scrapeDoneDeal(q);
    console.log(`DoneDeal found ${ddAds.length} cars.`);
    ddAds.slice(0, 3).forEach(a => console.log(`  [DD] Year: ${a.year}, Model: ${a.model}, Title: ${a.title || a.description?.substring(0,20)}`));
  } catch (e) { console.error('DD error:', e.message); }

  await closeBrowser();
}

testScrapers();
