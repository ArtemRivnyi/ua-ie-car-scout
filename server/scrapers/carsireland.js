import { getBrowser } from './puppeteerSetup.js';
import * as cheerio from 'cheerio';
import crypto from 'crypto';

/**
 * Fetches car listings from CarsIreland.ie using Puppeteer.
 * CarsIreland is an Angular SPA — requires networkidle2 and waiting for
 * Angular-rendered components.
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
      if (['image', 'font', 'media'].includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });

    console.log(`[carsireland] Navigating to ${url}...`);
    // Use networkidle2 — Angular SPA needs full rendering
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
    
    // Wait for Angular to render listings or show no-results
    try {
      await page.waitForSelector(
        '.listing, cids-o-listing-card, [class*="listing"], [class*="car-card"], .no-results, [class*="no-results"]',
        { timeout: 15000 }
      );
    } catch (waitErr) {
      console.warn('[carsireland] Timed out waiting for Angular rendering, trying with current DOM...');
    }

    const content = await page.content();

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

  // Try multiple selectors — Angular SPA may render different component structures
  let cards = $('.listing.ng-star-inserted, cids-o-listing-card');
  
  // Fallback: try generic selectors if Angular components didn't match
  if (cards.length === 0) {
    cards = $('[class*="listing-card"], [class*="car-card"], [class*="vehicle-card"], a[href*="/used-cars/"]').closest('[class*="card"], [class*="listing"], li, article');
  }

  // Second fallback: any element that looks like a listing with a price
  if (cards.length === 0) {
    cards = $('[class*="listing"]').filter((i, el) => {
      const text = $(el).text();
      return text.match(/€\s*\d/) && text.match(/\b(19|20)\d{2}\b/);
    });
  }

  cards.each((i, el) => {
    // Get price
    const priceText = $(el).find('[class*="price"]').first().text().trim() || $(el).text();
    const priceMatch = priceText.match(/€\s*(\d[\d\s,]*)/);
    const priceEur = priceMatch ? parseInt(priceMatch[1].replace(/[^\d]/g, ''), 10) : 0;
    
    // Get link
    let href = $(el).find('a').first().attr('href');
    if (!href) {
      href = $(el).is('a') ? $(el).attr('href') : null;
    }
    if (href && !href.startsWith('http')) {
      href = href.startsWith('/') ? href : `/${href}`;
    }
    
    // Get year
    const fullText = $(el).text().replace(/\s+/g, ' ');
    const yearMatch = fullText.match(/\b(19|20)\d{2}\b/);
    const year = yearMatch ? parseInt(yearMatch[0], 10) : null;
    
    // Get image
    let imgUrl = $(el).find('img').first().attr('src');
    if (!imgUrl) {
      const bgSpan = $(el).find('span[style*="background-image"], div[style*="background-image"]').first();
      const style = bgSpan.attr('style') || '';
      const imgMatch = style.match(/url\("?([^"\)]+)"?\)/);
      imgUrl = imgMatch ? imgMatch[1] : null;
    }
    
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
