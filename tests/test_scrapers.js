import { scrapeRst } from './server/scrapers/rst.js';
import { scrapeOlx } from './server/scrapers/olx.js';
import { scrapeCarsUa } from './server/scrapers/carsua.js';
import { scrapeCarsIreland } from './server/scrapers/carsireland.js';
import { scrapeCarzone } from './server/scrapers/carzone.js';
import { closeBrowser } from './server/scrapers/puppeteerSetup.js';

async function test() {
  console.log("Testing RST (broad)...");
  const rst = await scrapeRst("Toyota Corolla");
  console.log("RST items:", rst.length);

  console.log("Testing OLX (broad)...");
  const olx = await scrapeOlx("Toyota Corolla");
  console.log("OLX items:", olx.length);

  console.log("Testing CarsUa (broad)...");
  const carsua = await scrapeCarsUa("Toyota Corolla");
  console.log("CarsUa items:", carsua.length);

  console.log("Testing CarsIreland (broad)...");
  const ci = await scrapeCarsIreland("Toyota", "Corolla");
  console.log("CarsIreland items:", ci.length);

  console.log("Testing Carzone (broad)...");
  const cz = await scrapeCarzone("Toyota", "Corolla");
  console.log("Carzone items:", cz.length);

  await closeBrowser();
}

test().catch(console.error);
