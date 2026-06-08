/**
 * autoRiaService.js
 *
 * Wrapper for the AUTO.RIA public API.
 * Docs: https://developers.auto.ria.com/docs/
 *
 * Free tier: 100 requests/day. Register at https://auto.ria.com/api/
 *
 * Key endpoints used:
 *  GET /api/search/auto      — search listings
 *  GET /api/auto/{autoId}    — single listing detail
 *  GET /api/categories/{id}/marks  — get make/model IDs
 */

const API_BASE = import.meta.env.VITE_API_BASE
  ? import.meta.env.VITE_API_BASE.replace(/\/api\/?$/, '') + '/api'
  : 'https://ua-ie-car-scout-api.onrender.com/api';
const API_KEY = import.meta.env.VITE_AUTORIA_API_KEY;

/**
 * Search listings on AUTO.RIA.
 *
 * @param {object} params
 * @param {string} [params.query]       - Free text keyword
 * @param {number} [params.markId]      - Make ID (Toyota = 79)
 * @param {number} [params.modelId]     - Model ID
 * @param {number} [params.yearFrom]
 * @param {number} [params.yearTo]
 * @param {number} [params.priceFrom]   - EUR
 * @param {number} [params.priceTo]     - EUR
 * @param {number} [params.page]        - Pagination, default 0
 * @param {number} [params.count]       - Results per page, max 100
 * @returns {Promise<AutoRiaSearchResult>}
 */
export async function searchAutoRia({
  query = '',
  markId,
  modelId,
  yearFrom,
  yearTo,
  priceFrom,
  priceTo,
  page = 0,
  count = 20,
} = {}) {
  // TODO: Install and configure API key
  // Full param list: https://developers.auto.ria.com/docs/search

  const params = new URLSearchParams({
    api_key: API_KEY,
    category_id: 1,        // passenger cars
    currency: 1,           // USD (AUTO.RIA prices in USD — convert to EUR)
    page,
    countpage: count,
  });

  if (markId)    params.set('marka_id[0]', markId);
  if (modelId)   params.set('model_id[0]', modelId);
  if (yearFrom)  params.set('s_yers[0]', yearFrom);
  if (yearTo)    params.set('po_yers[0]', yearTo);
  if (priceFrom) params.set('price_ot', priceFrom);
  if (priceTo)   params.set('price_do', priceTo);
  if (query)     params.set('q', query);

  const url = `${API_BASE}/autoria/search?${params}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`AUTO.RIA error: ${res.status}`);
    const data = await res.json();

    // data.result.search_result.ids — array of listing IDs
    // data.result.search_result.count — total count
    return {
      ids: data?.result?.search_result?.ids || [],
      total: data?.result?.search_result?.count || 0,
      rawData: data,
    };
  } catch (err) {
    console.error('[autoRiaService] searchAutoRia failed:', err);
    return { ids: [], total: 0, error: err.message };
  }
}

/**
 * Fetch a single listing detail by ID.
 * @param {number} autoId
 * @returns {Promise<AutoRiaListing>}
 */
export async function getAutoRiaListing(autoId) {
  const url = `${API_BASE}/autoria/info?api_key=${API_KEY}&auto_id=${autoId}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`AUTO.RIA listing error: ${res.status}`);
    const data = await res.json();
    
    const rates = await getLiveRates();
    return normalizeAutoRiaListing(data, rates.usdToEur || 0.92);
  } catch (err) {
    console.error(`[autoRiaService] getAutoRiaListing(${autoId}) failed:`, err);
    return null;
  }
}

/**
 * Fetch live exchange rates from our backend
 */
let cachedRates = null;
let lastRatesFetch = 0;
async function getLiveRates() {
  const now = Date.now();
  if (cachedRates && now - lastRatesFetch < 3600000) {
    return cachedRates;
  }
  try {
    const res = await fetch(`${API_BASE}/currency`);
    if (res.ok) {
      cachedRates = await res.json();
      lastRatesFetch = now;
      return cachedRates;
    }
  } catch (err) {
    console.warn('[autoRiaService] failed to fetch live rates:', err);
  }
  return { usdToEur: 0.92 }; // fallback
}

/**
 * Normalize AUTO.RIA raw listing to our internal format.
 * @param {object} raw
 * @param {number} usdToEur
 * @returns {NormalizedListing}
 */
function normalizeAutoRiaListing(raw, usdToEur) {
  const priceUsd = raw.USD || raw.price?.USD || 0;

  // Photos can appear in different fields depending on API version
  let photos = [];
  if (raw.photoData?.seoLinkF) {
    photos = [raw.photoData.seoLinkF];
  } else if (raw.photoData?.seoLinkSX) {
    photos = [raw.photoData.seoLinkSX];
  } else if (raw.photo_links?.length) {
    photos = Array.isArray(raw.photo_links) ? raw.photo_links : [raw.photo_links];
  } else if (raw.mainPhoto) {
    photos = [raw.mainPhoto];
  }

  return {
    id: `autoria_${raw.autoId}`,
    source: 'AUTO.RIA',
    sourceUrl: raw.linkToView || `https://auto.ria.com/auto_${raw.autoId}.html`,
    make: raw.markName || '',
    model: raw.modelName || '',
    year: raw.year || null,
    priceEur: Math.round(priceUsd * usdToEur),
    priceOriginal: priceUsd,
    priceOriginalCurrency: 'USD',
    engineCc: raw.engineVolume ? raw.engineVolume * 1000 : null,
    mileageKm: raw.raceInt || null,
    location: raw.cityName || raw.regionName || 'Ukraine',
    photos,
    description: raw.description || '',
    rawData: raw,
  };
}

/**
 * Fetch multiple listings by IDs (batched).
 * @param {number[]} ids
 * @returns {Promise<NormalizedListing[]>}
 */
export async function fetchAutoRiaListings(ids) {
  const results = await Promise.allSettled(
    ids.slice(0, 20).map(id => getAutoRiaListing(id))
  );
  return results
    .filter(r => r.status === 'fulfilled' && r.value)
    .map(r => r.value);
}
