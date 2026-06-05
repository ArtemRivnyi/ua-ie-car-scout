import { getBrowser } from './puppeteerSetup.js';
import * as cheerio from 'cheerio';
import crypto from 'crypto';

/**
 * Fetches car listings from DoneDeal.ie using Puppeteer (Stealth).
 * This bypasses Datadome/Cloudflare by loading the search page 
 * and extracting the NEXT_DATA JSON blob.
 */

/**
 * @param {string} modelQuery — e.g. "Toyota AE86"
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
      if (['image', 'stylesheet', 'font', 'media'].includes(type)) {
        req.abort();
      } else {
        req.continue();
      }
    });

    console.log(`[donedeal] Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    const content = await page.content();
    const $ = cheerio.load(content);

    const script = $('#__NEXT_DATA__').html();
    const adsList = parseDoneDeal(script, modelQuery, yearFrom, yearTo);
    return adsList;
  } catch (err) {
    console.error('[donedeal] scrapeDoneDeal failed:', err.message);
    return [];
  } finally {
    if (page && !page.isClosed()) {
      await page.close().catch(() => {});
    }
  }
}

/**
 * Pure parsing function for DoneDeal NEXT_DATA script content.
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

  const ads = data?.props?.pageProps?.ads || [];
  console.log(`[donedeal] Got ${ads.length} ads for "${modelQuery}" via Puppeteer`);

  let adsList = ads.map(ad => normalizeDoneDealAd(ad)).filter(Boolean);
  if (yearFrom) adsList = adsList.filter(ad => ad.year && ad.year >= parseInt(yearFrom, 10));
  if (yearTo) adsList = adsList.filter(ad => ad.year && ad.year <= parseInt(yearTo, 10));
  
  return adsList;
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
