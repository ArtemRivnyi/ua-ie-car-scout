import { getBrowser, closeBrowser } from './server/scrapers/puppeteerSetup.js';
import * as cheerio from 'cheerio';

async function test() {
  const browser = await getBrowser();
  const page = await browser.newPage();
  
  await page.goto('https://www.donedeal.ie/cars?words=Toyota+Corolla', { waitUntil: 'networkidle2' });
  
  const content = await page.content();
  const $ = cheerio.load(content);
  
  const script = $('#__NEXT_DATA__').html();
  if (script) {
    const data = JSON.parse(script);
    console.log("pageProps keys:", Object.keys(data?.props?.pageProps || {}));
    if (data?.props?.pageProps?.searchResult) {
      console.log("searchResult ads:", data.props.pageProps.searchResult.ads?.length);
    }
  }

  await closeBrowser();
}
test().catch(console.error);
