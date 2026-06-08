import { getBrowser } from './puppeteerSetup.js';
import * as cheerio from 'cheerio';
import crypto from 'crypto';

/**
 * Fetches car listings from DoneDeal.ie using Puppeteer (Stealth).
 * Extracts data from __NEXT_DATA__ JSON blob, with multiple path fallbacks
 * since DoneDeal periodically updates their Next.js structure.
 */

/**
 * @param {string} modelQuery — e.g. "Toyota AE86"
 * @param {number|string} [yearFrom]
 * @param {number|string} [yearTo]
 * @param {number} [pageSize=20]
 * @returns {Promise<NormalizedListing[]>}
 */
export async function scrapeDoneDeal(modelQuery, yearFrom, yearTo, pageSize = 20) {
  let url = `https://www.donedeal.ie/cars?words=${encodeURIComponent(modelQuery || '')}`;
  if (yearFrom) url += `&year_from=${yearFrom}`;
  if (yearTo) url += `&year_to=${yearTo}`;
  
  let page;
  try {
    const browser = await getBrowser();
    page = await browser.newPage();
    
    // Fast abort for images/fonts/css to speed up scraping
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const type = req.resourceType();
      if (['image', 'font', 'media'].includes(type)) {
        req.abort();
      } else {
        req.continue();
      }
    });

    console.log(`[donedeal] Navigating to ${url}...`);
    // Use networkidle2 — DoneDeal's Next.js may hydrate after domcontentloaded
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
    
    const content = await page.content();
    const $ = cheerio.load(content);

    // Try NEXT_DATA approach first
    const script = $('#__NEXT_DATA__').html();
    let adsList = parseDoneDeal(script, modelQuery, yearFrom, yearTo);
    
    // If NEXT_DATA yields nothing, try HTML DOM scraping as fallback
    if (adsList.length === 0) {
      console.log('[donedeal] NEXT_DATA yielded 0 results, trying HTML fallback...');
      adsList = parseDoneDealHtml(content, modelQuery, yearFrom, yearTo);
    }

    return adsList;
  } catch (err) {
    console.error('[donedeal] Puppeteer failed, falling back to HTTP:', err.message);
    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(10000),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'en-IE,en-GB;q=0.9,en-US;q=0.8,en;q=0.7'
        }
      });
      if (!res.ok) throw new Error(`HTTP status ${res.status}`);
      const content = await res.text();
      const $ = cheerio.load(content);
      const script = $('#__NEXT_DATA__').html();
      let adsList = parseDoneDeal(script, modelQuery, yearFrom, yearTo);
      if (adsList.length === 0) {
        adsList = parseDoneDealHtml(content, modelQuery, yearFrom, yearTo);
      }
      return adsList;
    } catch (fetchErr) {
      console.error('[donedeal] HTTP fallback failed:', fetchErr.message);
      return [];
    }
  } finally {
    if (page && !page.isClosed()) {
      await page.close().catch(() => {});
    }
  }
}

/**
 * Pure parsing function for DoneDeal NEXT_DATA script content.
 * Tries multiple data paths since DoneDeal updates their structure periodically.
 */
export function parseDoneDeal(scriptContent, modelQuery, yearFrom, yearTo) {
  if (!scriptContent) {
    console.warn('[donedeal] No __NEXT_DATA__ found on page.');
    return [];
  }

  let data;
  try {
    data = JSON.parse(scriptContent);
  } catch (err) {
    console.error('[donedeal] JSON parse failed:', err.message);
    return [];
  }

  // Try multiple known paths — DoneDeal updates these periodically
  const ads = 
    data?.props?.pageProps?.ads ||
    data?.props?.pageProps?.initialProps?.ads ||
    data?.props?.pageProps?.searchResults?.ads ||
    data?.props?.pageProps?.adsData?.ads ||
    data?.props?.pageProps?.data?.ads ||
    [];
  
  console.log(`[donedeal] Got ${ads.length} ads for "${modelQuery}" via NEXT_DATA`);

  let adsList = ads.map(ad => normalizeDoneDealAd(ad)).filter(Boolean);
  if (yearFrom) adsList = adsList.filter(ad => ad.year && ad.year >= parseInt(yearFrom, 10));
  if (yearTo) adsList = adsList.filter(ad => ad.year && ad.year <= parseInt(yearTo, 10));
  
  return adsList;
}

/**
 * HTML DOM fallback parser for DoneDeal when NEXT_DATA is unavailable or empty.
 */
export function parseDoneDealHtml(htmlContent, modelQuery, yearFrom, yearTo) {
  const $ = cheerio.load(htmlContent);
  const ads = [];

  // DoneDeal card selectors — try multiple patterns
  const cards = $('a[href*="/cars/"], a[href*="/ad/"], [class*="card"][class*="listing"], [data-testid*="card"]');

  cards.each((i, el) => {
    try {
      const href = $(el).is('a') ? $(el).attr('href') : $(el).find('a').first().attr('href');
      if (!href || !href.includes('/')) return;

      const fullText = $(el).text().replace(/\s+/g, ' ').trim();
      
      // Extract price
      const priceMatch = fullText.match(/€\s*([\d,]+)/);
      const priceEur = priceMatch ? parseInt(priceMatch[1].replace(/,/g, ''), 10) : 0;
      if (!priceEur) return;

      // Extract year
      const yearMatch = fullText.match(/\b(19|20)\d{2}\b/);
      const year = yearMatch ? parseInt(yearMatch[0], 10) : null;

      if (yearFrom && (!year || year < parseInt(yearFrom, 10))) return;
      if (yearTo && (!year || year > parseInt(yearTo, 10))) return;

      // Extract image
      let img = $(el).find('img').first().attr('src');
      if (!img) {
        const bgEl = $(el).find('[style*="background-image"]').first();
        const style = bgEl.attr('style') || '';
        const imgMatch = style.match(/url\("?([^"\)]+)"?\)/);
        img = imgMatch ? imgMatch[1] : null;
      }

      const rawId = href.match(/(\d{6,})/)?.[1] || href;
      const hash = crypto.createHash('md5').update(String(rawId)).digest('hex').substring(0, 8);

      const sourceUrl = href.startsWith('http') ? href : `https://www.donedeal.ie${href}`;

      ads.push({
        id: `donedeal_${hash}`,
        source: 'DoneDeal',
        sourceUrl,
        make: '',
        model: '',
        year,
        priceEur,
        priceOriginal: priceEur,
        priceOriginalCurrency: 'EUR',
        photos: img ? [img] : [],
        description: fullText.substring(0, 150).trim(),
      });
    } catch (e) {
      // skip broken card
    }
  });

  console.log(`[donedeal] Got ${ads.length} ads via HTML fallback`);
  return ads;
}

/**
 * Normalize a DoneDeal ad to our internal listing format.
 */
function normalizeDoneDealAd(ad) {
  if (!ad) return null;

  // Extract price — DoneDeal prices are in EUR
  let priceEur = 0;
  if (ad.priceInfo?.priceInEuro) {
    priceEur = ad.priceInfo.priceInEuro;
  } else if (ad.price) {
    priceEur = parseInt(String(ad.price).replace(/[^0-9]/g, ''), 10) || 0;
  } else if (ad.displayAttributes) {
    const priceAttr = ad.displayAttributes.find(a => a.name === 'price');
    if (priceAttr) priceEur = parseInt(String(priceAttr.value).replace(/[^0-9]/g, ''), 10) || 0;
  }

  // Extract year
  let year = null;
  if (ad.metaInfo && ad.metaInfo.length > 0) {
    year = parseInt(ad.metaInfo[0], 10) || null;
  } else if (ad.year) {
    year = parseInt(ad.year, 10) || null;
  } else if (ad.displayAttributes) {
    const yearAttr = ad.displayAttributes.find(a => a.name === 'year');
    if (yearAttr) year = parseInt(yearAttr.value, 10) || null;
  }

  // Extract mileage
  let mileageKm = null;
  if (ad.mileageInKm) {
    mileageKm = ad.mileageInKm;
  } else if (ad.metaInfo && ad.metaInfo.length > 2) {
    mileageKm = parseInt(ad.metaInfo[2].replace(/[^0-9]/g, ''), 10) || null;
  } else if (ad.mileage) {
    mileageKm = parseInt(String(ad.mileage).replace(/[^0-9]/g, ''), 10) || null;
  } else if (ad.displayAttributes) {
    const mileAttr = ad.displayAttributes.find(a => a.name === 'mileage');
    if (mileAttr) {
      mileageKm = parseInt(String(mileAttr.value).replace(/[^0-9]/g, ''), 10) || null;
      if (mileAttr.value?.toLowerCase().includes('mi')) {
        mileageKm = mileageKm ? Math.round(mileageKm * 1.60934) : null;
      }
    }
  }

  // Extract photos
  const photos = [];
  if (ad.gallery?.coverImage?.large) {
    photos.push(ad.gallery.coverImage.large);
  } else if (ad.photos?.length) {
    ad.photos.forEach(p => {
      if (p.small) photos.push(p.small);
      else if (p.medium) photos.push(p.medium);
      else if (p.large) photos.push(p.large);
    });
  } else if (ad.mainPhoto) {
    photos.push(ad.mainPhoto);
  }

  // Extract location
  const county = ad.county || ad.area || '';

  // Extract make/model from header or attributes
  const header = ad.title || ad.header || '';
  let make = '';
  let model = '';
  if (ad.displayAttributes) {
    const makeAttr = ad.displayAttributes.find(a => a.name === 'make');
    const modelAttr = ad.displayAttributes.find(a => a.name === 'model');
    if (makeAttr) make = makeAttr.value || '';
    if (modelAttr) model = modelAttr.value || '';
  }
  if (!make && !model) {
    // Fall back to header
    make = header;
  }

  const rawId = ad.id || ad.adId || (header + priceEur);
  const hash = crypto.createHash('md5').update(String(rawId)).digest('hex').substring(0, 8);

  return {
    id: `donedeal_${hash}`,
    source: 'DoneDeal',
    sourceUrl: ad.friendlyUrl
      ? (ad.friendlyUrl.startsWith('http') ? ad.friendlyUrl : `https://www.donedeal.ie${ad.friendlyUrl}`)
      : `https://www.donedeal.ie/cars/${ad.id || ad.adId}`,
    make,
    model,
    year,
    priceEur,
    priceOriginal: priceEur,
    priceOriginalCurrency: 'EUR',
    mileageKm,
    location: county,
    photos,
    description: ad.description || header,
  };
}

export default scrapeDoneDeal;
