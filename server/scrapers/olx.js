import { getBrowser } from './puppeteerSetup.js';
import * as cheerio from 'cheerio';
import crypto from 'crypto';
import { getExchangeRates } from '../services/exchangeRateService.js';

/**
 * Fetches car listings from OLX.ua using Puppeteer.
 * OLX.ua periodically changes its NEXT_DATA structure, so we try
 * multiple data paths and fall back to HTML DOM scraping.
 */
export async function scrapeOlx(query, yearFrom, yearTo) {
  const rates = await getExchangeRates();
  // OLX query
  const searchQ = encodeURIComponent(query || '');
  let url = `https://www.olx.ua/uk/transport/legkovye-avtomobili/q-${searchQ}/?currency=USD`;
  
  if (yearFrom || yearTo) {
    if (yearFrom) url += `&search%5Bfilter_float_motor_year%3Afrom%5D=${yearFrom}`;
    if (yearTo) url += `&search%5Bfilter_float_motor_year%3Ato%5D=${yearTo}`;
  }

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

    console.log(`[olx] Navigating to ${url}...`);
    // Use networkidle2 for OLX SPA
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
    
    // Wait for listings or no-results indicator
    try {
      await page.waitForSelector(
        '[data-cy="l-card"], [data-testid="listing-grid"], .css-1sw7q4x, .emptynew, [data-testid="no-results"]',
        { timeout: 10000 }
      );
    } catch (waitErr) {
      console.warn('[olx] Timed out waiting for listing elements, trying with current DOM...');
    }

    const content = await page.content();
    const ads = parseOlx(content, query, rates, yearFrom, yearTo);
    return ads;
  } catch (err) {
    console.error('[olx] Puppeteer failed, falling back to HTTP:', err.message);
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      if (!res.ok) throw new Error(`HTTP status ${res.status}`);
      const content = await res.text();
      return parseOlx(content, query, rates, yearFrom, yearTo);
    } catch (fetchErr) {
      console.error('[olx] HTTP fallback failed:', fetchErr.message);
      return [];
    }
  } finally {
    if (page && !page.isClosed()) {
      await page.close().catch(() => {});
    }
  }
}

/**
 * Pure parsing function for OLX HTML content.
 * Tries NEXT_DATA first (multiple paths), then falls back to HTML DOM.
 */
export function parseOlx(htmlContent, query, rates, yearFrom, yearTo) {
  const $ = cheerio.load(htmlContent);
  const script = $('#__NEXT_DATA__').html();
  const make = query.split(' ')[0] || '';
  const model = query.split(' ').slice(1).join(' ') || '';

  if (script) {
    try {
      const data = JSON.parse(script);
      
      // Try multiple NEXT_DATA paths — OLX changes these periodically
      const ads = 
        data?.props?.pageProps?.ads ||
        data?.props?.pageProps?.offers ||
        data?.props?.pageProps?.listing?.ads ||
        data?.props?.pageProps?.data?.ads ||
        data?.props?.pageProps?.listingResponse?.ads ||
        [];
      
      if (ads.length > 0) {
        console.log(`[olx] Found ${ads.length} ads via NEXT_DATA`);
        return ads.map(ad => {
          const priceObj = ad.params?.find(p => p.key === 'price');
          const priceUsd = priceObj?.value?.value || ad.price?.regularPrice?.value || 0;
          
          const yearObj = ad.params?.find(p => p.key === 'motor_year');
          const year = yearObj?.value?.key ? parseInt(yearObj.value.key, 10) : null;
          if (yearFrom && (!year || year < parseInt(yearFrom, 10))) return null;
          if (yearTo && (!year || year > parseInt(yearTo, 10))) return null;

          let photoUrl = null;
          if (ad.photos && ad.photos.length > 0) {
            photoUrl = typeof ad.photos[0] === 'string' ? ad.photos[0] : ad.photos[0].link || ad.photos[0].url;
          }

          return {
            id: `olx_${ad.id}`,
            source: 'OLX.ua',
            sourceUrl: ad.url,
            make,
            model,
            year,
            priceEur: Math.round(priceUsd * rates.usdToEur),
            priceOriginal: priceUsd,
            priceOriginalCurrency: 'USD',
            photos: photoUrl ? [photoUrl] : [],
            description: ad.title
          };
        }).filter(Boolean);
      }
    } catch (parseErr) {
      console.warn('[olx] NEXT_DATA parse failed:', parseErr.message);
    }
  }

  // No NEXT_DATA or 0 results — scrape HTML DOM directly
  console.log('[olx] Falling back to HTML DOM scraping...');
  const ads = [];
  const seenUrls = new Set();

  // Updated selectors for OLX 2024+ structure
  const cardSelectors = [
    '[data-cy="l-card"]',
    'a[href*="/d/uk/obyavlenie/"]',
    'a[href*="/d/obyavlenie/"]',
    '[data-testid="listing-grid"] > div',
  ];

  const cardElements = $(cardSelectors.join(', '));

  cardElements.each((i, el) => {
    let card = $(el);
    // If el is a link inside a card, go up to the card container
    if (card.is('a')) {
      const parent = card.closest('[data-cy="l-card"], div[type="list"]');
      if (parent.length) card = parent;
    }

    const href = card.find('a[href*="/d/"]').first().attr('href') || card.find('a').first().attr('href');
    if (!href) return;
    
    // Prevent double-processing if multiple selectors match the same card
    if (seenUrls.has(href)) return;
    seenUrls.add(href);

    const title = card.find('h4, h6, [data-testid="ad-title"]').first().text().trim();
    
    // Get price — multiple selectors for different OLX versions
    const priceElem = card.find(
      'p[data-testid="ad-price"], [data-testid="ad-price"], [class*="price"]'
    ).first();
    const priceText = priceElem.length 
      ? priceElem.clone().children().remove().end().text().trim()
      : card.text().match(/[\d\s]+(?:грн|USD|\$)/)?.[0] || '';
    
    const isUsd = priceText.includes('$') || priceText.includes('USD');
    const priceMainPart = priceText.split(/[,.]/)[0];
    const priceNum = parseInt(priceMainPart.replace(/[^0-9]/g, ''), 10) || 0;
    if (!priceNum) return;

    // Extract year from badges
    const yearText = card.find('[data-nx-name="P5"], span[class*="css"], [class*="params"]').text();
    const yearMatch = yearText.match(/\b(19|20)\d{2}\b/);
    const year = yearMatch ? parseInt(yearMatch[0], 10) : null;

    if (yearFrom && (!year || year < parseInt(yearFrom, 10))) return;
    if (yearTo && (!year || year > parseInt(yearTo, 10))) return;

    let img = card.find('img').attr('src') || card.find('img').attr('srcset')?.split(' ')[0];
    if (!img) {
       img = card.html().match(/src="([^"]+)"/)?.[1];
    }
    if (img && img.startsWith('/')) img = `https://www.olx.ua${img}`;
    if (img) img = img.replace(':443', '');

    const rawId = href.match(/-ID(.*?)\.html/)?.[1] || title;
    const hash = crypto.createHash('md5').update(rawId + priceNum).digest('hex').substring(0, 8);

    ads.push({
      id: `olx_${hash}`,
      source: 'OLX.ua',
      sourceUrl: href.startsWith('http') ? href : `https://www.olx.ua${href}`,
      make,
      model,
      year,
      priceEur: isUsd ? Math.round(priceNum * rates.usdToEur) : Math.round(priceNum * rates.uahToEur),
      priceOriginal: priceNum,
      priceOriginalCurrency: isUsd ? 'USD' : 'UAH',
      photos: img ? [img] : [],
      description: title
    });
  });

  console.log(`[olx] Got ${ads.length} ads via HTML fallback`);
  return ads;
}
