/**
 * scrapers/olxPuppeteer.js
 *
 * Scrapes OLX.ua using Puppeteer (headless Chrome).
 * Run from server/index.js only — never from the browser bundle.
 *
 * Install Puppeteer: npm install puppeteer
 *
 * OLX search URL format:
 *   https://www.olx.ua/uk/transport/legkovye-avtomobili/?search[filter_float_price:to]=10000&search[description]=1&q=AE86
 *
 * TODO:
 *  1. Launch Puppeteer (headless)
 *  2. Navigate to OLX search URL with query params
 *  3. Extract listings: title, price, year, link, photo, location
 *  4. Normalize to NormalizedListing format (same as autoRiaService)
 *  5. Handle pagination (next page button)
 *  6. Return array of NormalizedListing
 *
 * Puppeteer tips for OLX:
 *  - OLX is React SPA — wait for: '[data-testid="listing-grid"]'
 *  - Price selector (may change): '[data-testid="ad-price"]'
 *  - Title selector: 'h6[data-testid="ad-title"]' or 'h3.css-...'
 *  - Always add random delay (1-2s) between pages to avoid blocks
 *  - Consider using puppeteer-extra + stealth plugin
 */

// import puppeteer from 'puppeteer';

export async function scrapeOLX({ query, yearFrom, yearTo, priceFrom, priceTo, maxPages = 2 }) {
  // TODO: implement

  console.log('[olxPuppeteer] scrapeOLX called — not yet implemented');
  return [];
}

function normalizeOLXListing(raw) {
  // TODO: map OLX listing fields to NormalizedListing
  return {
    id: `olx_${raw.id}`,
    source: 'OLX.ua',
    sourceUrl: raw.url,
    make: raw.make || '',
    model: raw.model || '',
    year: raw.year || null,
    priceEur: raw.priceEur || null,
    mileageKm: raw.mileage || null,
    location: raw.city || 'Ukraine',
    photos: raw.photos || [],
    description: raw.description || '',
  };
}
