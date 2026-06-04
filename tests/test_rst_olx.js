import { scrapeRst } from './server/scrapers/rst.js';
import { scrapeOlx } from './server/scrapers/olx.js';
import { closeBrowser } from './server/scrapers/puppeteerSetup.js';

async function test() {
  console.log("Testing RST...");
  const rst = await scrapeRst("Toyota Corolla");
  console.log(`RST items: ${rst.length}`);
  if (rst.length) console.log("RST [0]:", rst[0]);

  console.log("Testing OLX...");
  const olx = await scrapeOlx("Toyota Corolla");
  console.log(`OLX items: ${olx.length}`);
  if (olx.length) console.log("OLX [0]:", olx[0]);

  await closeBrowser();
}

test().catch(console.error);
