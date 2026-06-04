import fs from 'fs';
import { getBrowser, closeBrowser } from './server/scrapers/puppeteerSetup.js';
import * as cheerio from 'cheerio';

async function test() {
  const browser = await getBrowser();
  const page = await browser.newPage();
  await page.goto('https://www.donedeal.ie/cars?words=Toyota%20Corolla', { waitUntil: 'domcontentloaded' });
  const content = await page.content();
  const $ = cheerio.load(content);
  const script = $('#__NEXT_DATA__').html();
  const data = JSON.parse(script);
  console.log("Keys in data.props.pageProps:", Object.keys(data.props.pageProps));
  const ads = data.props.pageProps.ads || data.props.pageProps.pageInfo?.ads || [];
  if (ads.length > 0) {
    fs.writeFileSync('donedeal_raw_ad.json', JSON.stringify(ads[0], null, 2));
    console.log("Wrote donedeal_raw_ad.json");
  }
  await closeBrowser();
}

test().catch(console.error);
