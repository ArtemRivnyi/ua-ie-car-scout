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
    console.log("Data keys:", Object.keys(data));
    console.log("Search response keys:", Object.keys(data?.props?.pageProps?.searchResponse || {}));
    if (data?.props?.pageProps?.searchResponse?.error) {
      console.log("Error:", data.props.pageProps.searchResponse.error);
    }
  } else {
    console.log("No NEXT_DATA. Page title:", $('title').text());
    console.log("Body length:", content.length);
  }

  await closeBrowser();
}
test().catch(console.error);
