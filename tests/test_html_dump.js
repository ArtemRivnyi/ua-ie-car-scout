import fs from 'fs';
import { getBrowser, closeBrowser } from './server/scrapers/puppeteerSetup.js';

async function dumpHTML(name, url) {
  console.log(`Dumping ${name}...`);
  const browser = await getBrowser();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000)); // wait for JS rendering
  const html = await page.content();
  fs.writeFileSync(`${name}.html`, html);
  console.log(`Saved ${name}.html (${html.length} bytes)`);
}

async function test() {
  await dumpHTML('rst', 'https://rst.ua/oldcars/toyota/corolla/');
  await dumpHTML('olx', 'https://www.olx.ua/uk/transport/legkovye-avtomobili/q-Toyota-Corolla/');
  await dumpHTML('carsua', 'https://cars.ua/search/toyota/corolla');
  await dumpHTML('carsireland', 'https://www.carsireland.ie/search?make=Toyota&model=Corolla');
  await dumpHTML('carzone', 'https://www.carzone.ie/search?make=Toyota&model=Corolla');
  await closeBrowser();
}

test().catch(console.error);
