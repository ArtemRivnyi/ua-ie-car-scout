import { getBrowser, closeBrowser } from './server/scrapers/puppeteerSetup.js';
import * as cheerio from 'cheerio';

async function test() {
  const browser = await getBrowser();
  const page = await browser.newPage();
  
  console.log("Navigating to DoneDeal...");
  await page.goto('https://www.donedeal.ie/cars?words=Toyota+Corolla', { waitUntil: 'networkidle2' });
  
  const content = await page.content();
  const $ = cheerio.load(content);
  
  const cars = [];
  $('li[data-testid="search-result-ad"]').each((i, el) => {
    const title = $(el).find('h2').text().trim();
    const priceText = $(el).find('p[data-testid="ad-price"]').text().trim();
    const url = $(el).find('a').attr('href');
    
    if (title) {
      cars.push({ title, priceText, url });
    }
  });

  console.log(`Found ${cars.length} cars`);
  if (cars.length > 0) {
    console.log(cars[0]);
  } else {
    // maybe SSR JSON?
    const script = $('#__NEXT_DATA__').html();
    if (script) {
      console.log("Found Next.js data block!");
      const data = JSON.parse(script);
      const ads = data?.props?.pageProps?.searchResponse?.ads || [];
      console.log(`Extracted ${ads.length} ads from NEXT_DATA`);
      if (ads.length > 0) console.log(ads[0].header);
    }
  }

  await closeBrowser();
}
test().catch(console.error);
