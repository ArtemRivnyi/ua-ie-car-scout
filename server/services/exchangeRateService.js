let cachedRates = null;
let lastFetchTime = 0;
const CACHE_TTL = 12 * 60 * 60 * 1000; // 12 hours

/**
 * Fetches the latest exchange rates for USD -> EUR and UAH -> EUR.
 * Caches the results for 12 hours.
 * 
 * @returns {Promise<{ usdToEur: number, uahToEur: number, uahToUsd: number }>}
 */
export async function getExchangeRates() {
  if (cachedRates && (Date.now() - lastFetchTime < CACHE_TTL)) {
    return cachedRates;
  }

  try {
    const response = await fetch('https://open.er-api.com/v6/latest/USD');
    if (!response.ok) {
      throw new Error(`Failed to fetch rates: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    
    if (data && data.rates && data.rates.EUR && data.rates.UAH) {
      const eurRate = data.rates.EUR;
      const uahRate = data.rates.UAH;
      
      cachedRates = {
        usdToEur: eurRate,
        uahToEur: eurRate / uahRate,
        uahToUsd: 1 / uahRate,
        source: 'open.er-api.com',
        lastUpdated: new Date().toISOString(),
      };
      lastFetchTime = Date.now();
      
      console.log(`[ExchangeRates] Updated rates: USD->EUR=${cachedRates.usdToEur.toFixed(3)}, UAH->EUR=${cachedRates.uahToEur.toFixed(4)}, UAH/USD=${uahRate.toFixed(1)}`);
      return cachedRates;
    } else {
      throw new Error('Invalid rate format from API');
    }
  } catch (err) {
    console.error('[ExchangeRates] Error fetching rates, using fallback values:', err.message);
    
    // Fallback to hardcoded estimates if API fails
    // Updated to mid-2026 approximate rates (NBU official ~41.5 UAH/USD)
    if (!cachedRates) {
      console.warn('[ExchangeRates] ⚠️ Using FALLBACK hardcoded rates — prices may be inaccurate!');
      cachedRates = {
        usdToEur: 0.92,
        uahToEur: 0.92 / 41.5, // ~41.5 UAH per USD (mid-2026 NBU rate)
        uahToUsd: 1 / 41.5,
        source: 'fallback',
        lastUpdated: '2026-06-01T00:00:00Z', // hardcoded baseline date
      };
    }
    return cachedRates;
  }
}
