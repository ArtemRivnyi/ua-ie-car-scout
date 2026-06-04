import { getBrowser, closeBrowser } from '../server/scrapers/puppeteerSetup.js';
import * as cheerio from 'cheerio';

async function debugOlx() {
  const url = 'https://www.olx.ua/uk/transport/legkovye-avtomobili/q-Toyota/';
  const browser = await getBrowser();
  const page = await browser.newPage();
  
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  
  const content = await page.content();
  const $ = cheerio.load(content);
  
  const script = $('#__NEXT_DATA__').html();
  if (script) {
    const data = JSON.parse(script);
    console.log('Keys in pageProps:', Object.keys(data?.props?.pageProps || {}));
    const ads = data?.props?.pageProps?.ads || data?.props?.pageProps?.offers || data?.props?.pageProps?.listing?.listing?.offers || [];
    console.log(`Found ${ads.length} ads in NEXT_DATA`);
    
    if (ads.length > 0) {
      const ad = ads[0];
      console.log('Ad keys:', Object.keys(ad));
      console.log('Ad params:', JSON.stringify(ad.params));
      console.log('Ad photos:', JSON.stringify(ad.photos));
    }
  } else {
    console.log('NO NEXT_DATA!');
    
    const firstCard = $('[data-cy="l-card"]').first();
    console.log('Images in first card:', firstCard.find('img').length);
    firstCard.find('img').each((i, el) => {
      console.log(`Img ${i} src:`, $(el).attr('src'));
      console.log(`Img ${i} srcset:`, $(el).attr('srcset'));
    });
    // Check if image is somewhere else
    const allImgs = firstCard.html().match(/<img[^>]+>/g);
    console.log('Regex found imgs:', allImgs);
  }
  
  await page.close();
  await closeBrowser();
}

debugOlx().catch(console.error);
