import { getBrowser } from './puppeteerSetup.js';
import * as cheerio from 'cheerio';
import { getExchangeRates } from '../services/exchangeRateService.js';

/**
 * Fetches car listings from OLX.ua using Puppeteer.
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

  try {
    const browser = await getBrowser();
    const page = await browser.newPage();
    
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if (['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });

    console.log(`[olx] Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    const content = await page.content();
    const ads = parseOlx(content, query, rates, yearFrom, yearTo);
    return ads;
  } catch (err) {
    console.error('[olx] scrapeOlx failed:', err.message);
    return [];
  }
}

/**
 * Pure parsing function for OLX HTML content.
 */
export function parseOlx(htmlContent, query, rates, yearFrom, yearTo) {
  const $ = cheerio.load(htmlContent);
  const script = $('#__NEXT_DATA__').html();
  const make = query.split(' ')[0] || '';
  const model = query.split(' ').slice(1).join(' ') || '';

  if (script) {
    const data = JSON.parse(script);
    const ads = data?.props?.pageProps?.ads || data?.props?.pageProps?.offers || [];
    
    if (ads.length > 0) {
      return ads.map(ad => {
        const priceObj = ad.params?.find(p => p.key === 'price');
        const priceUsd = priceObj?.value?.value || 0;
        
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
  }

  // No NEXT_DATA, scrape HTML DOM directly
  const ads = [];
  $('a[href*="/d/uk/obyavlenie/"], a[href*="/d/obyavlenie/"]').each((i, el) => {
    const href = $(el).attr('href');
    if (!href) return;
    const card = $(el).closest('div[type="list"], [data-cy="l-card"]');
    if (!card.length) return;

    const title = card.find('h4, h6').first().text().trim();
    const priceElem = card.find('p[data-testid="ad-price"], [data-testid="ad-price"]').first();
    const priceText = priceElem.clone().children().remove().end().text().trim();
    const isUsd = priceText.includes('$');
    // Price text might be "637 820.32 грн." so split by '.' or ',' and take first part
    const priceMainPart = priceText.split(/[,.]/)[0];
    const priceNum = parseInt(priceMainPart.replace(/[^0-9]/g, ''), 10) || 0;
    if (!priceNum) return;

    // Extract year from badges like "2001 500 тис.км."
    const yearText = card.find('[data-nx-name="P5"], span[class*="css"]').text();
    const yearMatch = yearText.match(/\b(19|20)\d{2}\b/);
    const year = yearMatch ? parseInt(yearMatch[0], 10) : null;

    // Ensure we drop the listing if year filtering is active and year doesn't match
    if (yearFrom && (!year || year < parseInt(yearFrom, 10))) return;
    if (yearTo && (!year || year > parseInt(yearTo, 10))) return;

    let img = card.find('img').attr('src') || card.find('img').attr('srcset')?.split(' ')[0];
    if (!img) {
       // fallback for lazy loading
       img = card.html().match(/src="([^"]+)"/)?.[1];
    }
    if (img && img.startsWith('/')) img = `https://www.olx.ua${img}`;
    if (img) img = img.replace(':443', '');

    ads.push({
      id: `olx_${href.match(/-ID(.*?)\.html/)?.[1] || Math.random()}`,
      source: 'OLX.ua',
      sourceUrl: `https://www.olx.ua${href}`,
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
