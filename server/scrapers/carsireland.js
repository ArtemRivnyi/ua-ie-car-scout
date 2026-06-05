import { getBrowser } from './puppeteerSetup.js';
import * as cheerio from 'cheerio';
import crypto from 'crypto';

/**
 * Fetches car listings from CarsIreland.ie using Puppeteer.
 */
export async function scrapeCarsIreland(make, model, yearFrom, yearTo) {
  const params = new URLSearchParams();
  if (yearFrom) params.set('year', yearFrom);
  if (yearTo) params.set('maxYear', yearTo);

  let urlPath = 'used-cars';
  if (make) urlPath += `/${encodeURIComponent(make.toLowerCase())}`;
  if (model) urlPath += `/${encodeURIComponent(model.toLowerCase().replace(/\s+/g, '-'))}`;

  const queryString = params.toString() ? `?${params.toString()}` : '';
  const url = `https://www.carsireland.ie/${urlPath}${queryString}`;

  let page;
  try {
    const browser = await getBrowser();
    page = await browser.newPage();
    
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if (['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });

    console.log(`[carsireland] Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    const content = await page.content();

    // Fallback HTML parsing since it's an Angular SPA now
    const ads = parseCarsIreland(content, make, model, yearFrom, yearTo);
    console.log(`[carsireland] Got ${ads.length} ads via Puppeteer`);
    return ads;
  } catch (err) {
    console.error('[carsireland] scrapeCarsIreland failed:', err.message);
    return [];
  } finally {
    if (page && !page.isClosed()) {
      await page.close().catch(() => {});
    }
  }
}

export function parseCarsIreland(htmlContent, make, model, yearFrom, yearTo) {
  const $ = cheerio.load(htmlContent);
  let ads = [];
  $('.listing.ng-star-inserted, cids-o-listing-card').each((i, el) => {
    // Get price
    const priceText = $(el).find('[class*="price"]').first().text().trim() || $(el).text();
    const priceMatch = priceText.match(/€\s*(\d[\d\s,]*)/);
    const priceEur = priceMatch ? parseInt(priceMatch[1].replace(/[^\d]/g, ''), 10) : 0;
    
    // Get link
    let href = $(el).find('a').first().attr('href');
    if (href && !href.startsWith('http')) {
      href = href.startsWith('/') ? href : `/${href}`;
    }
    
    // Get year
    const fullText = $(el).text().replace(/\s+/g, ' ');
    const yearMatch = fullText.match(/\b(19|20)\d{2}\b/);
    const year = yearMatch ? parseInt(yearMatch[0], 10) : null;
    
    // Get image
    const bgSpan = $(el).find('span[style*="background-image"]').first();
    const style = bgSpan.attr('style') || '';
    const imgMatch = style.match(/url\("?([^"\)]+)"?\)/);
    const imgUrl = imgMatch ? imgMatch[1] : null;
    
    if (yearFrom && (!year || year < parseInt(yearFrom, 10))) return;
    if (yearTo && (!year || year > parseInt(yearTo, 10))) return;

    if (priceEur > 0 && href) {
      const rawId = href.split('?')[0].replace(/\D/g, '') || href;
      const hash = crypto.createHash('md5').update(rawId).digest('hex').substring(0, 8);

      ads.push({
        id: `ci_${hash}`,
        source: 'CarsIreland',
        sourceUrl: `https://www.carsireland.ie${href}`,
        make,
        model,
        year,
        priceEur,
        priceOriginal: priceEur,
        priceOriginalCurrency: 'EUR',
        photos: imgUrl ? [imgUrl] : [],
        description: fullText.substring(0, 100).trim()
      });
    }
  });

  return ads;
}
