import { getBrowser } from './puppeteerSetup.js';
import * as cheerio from 'cheerio';
import crypto from 'crypto';

/**
 * Fetches car listings from Carzone.ie using Puppeteer.
 * Carzone is a SPA — requires networkidle2 and waiting for custom elements.
 */
export async function scrapeCarzone(make, model, yearFrom, yearTo) {
  let makeF = make ? make.charAt(0).toUpperCase() + make.slice(1).toLowerCase() : '';
  let modelF = model ? model.charAt(0).toUpperCase() + model.slice(1).toLowerCase() : '';
  
  const params = new URLSearchParams();
  if (makeF) params.set('make', makeF);
  if (modelF) params.set('model', modelF);
  if (yearFrom) params.set('minYear', yearFrom);
  if (yearTo) params.set('maxYear', yearTo);

  const url = `https://www.carzone.ie/search?${params.toString()}`;

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

    console.log(`[carzone] Navigating to ${url}...`);
    // Use networkidle2 instead of domcontentloaded — Carzone is a SPA
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
    
    // Wait for SPA to render the custom web components or a no-results indicator
    try {
      await page.waitForSelector(
        'stock-summary-item, [class*="listing-card"], [class*="result-card"], .no-results, [class*="no-results"]',
        { timeout: 15000 }
      );
    } catch (waitErr) {
      console.warn('[carzone] Timed out waiting for listing elements, trying with current DOM...');
    }

    const content = await page.content();
    const ads = parseCarzone(content, make, model, yearFrom, yearTo);
    console.log(`[carzone] Got ${ads.length} ads via Puppeteer`);
    return ads;
  } catch (err) {
    console.error('[carzone] scrapeCarzone failed:', err.message);
    return [];
  } finally {
    if (page && !page.isClosed()) {
      await page.close().catch(() => {});
    }
  }
}

export function parseCarzone(htmlContent, make, model, yearFrom, yearTo) {
  const $ = cheerio.load(htmlContent);
  let ads = [];

  // Primary: try the custom web component selector
  let cards = $('stock-summary-item');
  
  // Fallback: try generic card/listing selectors if SPA rendered differently
  if (cards.length === 0) {
    cards = $('[class*="listing-card"], [class*="result-card"], [class*="stock-item"], a[href*="/used-cars/"]').closest('[class*="card"], [class*="item"], li');
  }

  cards.each((i, el) => {
    const fullText = $(el).text().replace(/\s+/g, ' ');
    
    // Get price
    const priceText = $(el).find('[class*="price"]').first().text().trim() || fullText;
    const priceMatch = priceText.match(/€\s*(\d[\d\s,]*)/);
    const priceEur = priceMatch ? parseInt(priceMatch[1].replace(/[^\d]/g, ''), 10) : 0;
    
    // Get link
    let href = $(el).find('a[href*="/used-cars/"], a[href*="/car-details/"]').first().attr('href');
    if (!href) href = $(el).find('a').first().attr('href');
    if (!href) {
      // The element itself might be a link
      href = $(el).is('a') ? $(el).attr('href') : null;
    }
    
    if (href && !href.startsWith('http')) {
      href = href.startsWith('/') ? href : `/${href}`;
    }
    
    // Get year
    const yearMatch = fullText.match(/\b(19|20)\d{2}\b/);
    const year = yearMatch ? parseInt(yearMatch[0], 10) : null;
    
    if (yearFrom && (!year || year < parseInt(yearFrom, 10))) return;
    if (yearTo && (!year || year > parseInt(yearTo, 10))) return;
    
    // Get image
    let imgUrl = $(el).find('img').first().attr('src');
    if (!imgUrl) {
      const bgSpan = $(el).find('[style*="background-image"]').first();
      const style = bgSpan.attr('style') || '';
      const imgMatch = style.match(/url\("?([^"\)]+)"?\)/);
      imgUrl = imgMatch ? imgMatch[1] : null;
    }
    
    if (priceEur > 0 && href && href.length > 5) {
      const rawId = href.split('?')[0].replace(/\D/g, '') || href;
      const hash = crypto.createHash('md5').update(rawId).digest('hex').substring(0, 8);
      
      ads.push({
        id: `cz_${hash}`,
        source: 'Carzone',
        sourceUrl: `https://www.carzone.ie${href}`,
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
