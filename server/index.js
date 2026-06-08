/**
 * server/index.js — UA→IE Car Scout backend
 *
 * Endpoints:
 *   GET  /api/health
 *   GET  /api/autoria/search
 *   GET  /api/autoria/info
 *   GET  /api/scrape/ua   ?sources=rst,olx,carsua&query=Toyota+Corolla&yearFrom=1985&yearTo=1995&priceFrom=0&priceTo=10000
 *   GET  /api/scrape/ie   ?sources=donedeal,carsireland,carzone&make=Toyota&model=Corolla&yearFrom=1985&yearTo=1995
 */

import express from 'express';
import cors from 'cors';
import { scrapeDoneDeal }   from './scrapers/donedeal.js';
import { scrapeCarsIreland } from './scrapers/carsireland.js';
import { scrapeCarzone }    from './scrapers/carzone.js';
import { scrapeRst }        from './scrapers/rst.js';
import { scrapeOlx }        from './scrapers/olx.js';
import { scrapeCarsUa }     from './scrapers/carsua.js';
import { closeBrowser }     from './scrapers/puppeteerSetup.js';
import { deduplicateAds }   from './services/dedupService.js';

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

/* ── Cache (10 min TTL) ─────────────────────────── */
const cache    = new Map();
const CACHE_TTL = 10 * 60 * 1000;

function getCached(key) {
  const e = cache.get(key);
  if (!e) return null;
  if (Date.now() - e.ts > CACHE_TTL) { cache.delete(key); return null; }
  return e.data;
}
function setCache(key, data) { cache.set(key, { data, ts: Date.now() }); }

/* ── Stats helper: adds median ──────────────────── */
function calcStats(listings) {
  const prices = listings.map(l => l.priceEur).filter(p => p > 0).sort((a, b) => a - b);
  if (!prices.length) return null;
  const n   = prices.length;
  const sum = prices.reduce((a, b) => a + b, 0);
  const avg = Math.round(sum / n);
  const median = n % 2 === 0
    ? Math.round((prices[n/2-1] + prices[n/2]) / 2)
    : prices[Math.floor(n/2)];
  // IQR outlier removal for avgFiltered
  const q1 = prices[Math.floor(n * 0.25)];
  const q3 = prices[Math.floor(n * 0.75)];
  const iqr = q3 - q1;
  const lo  = q1 - 1.5 * iqr;
  const hi  = q3 + 1.5 * iqr;
  const filtered   = prices.filter(p => p >= lo && p <= hi);
  const avgFiltered = filtered.length
    ? Math.round(filtered.reduce((a, b) => a + b, 0) / filtered.length)
    : avg;
  const outliers = prices.filter(p => p < lo || p > hi);
  return { count: n, min: prices[0], max: prices[n-1], avg, median, avgFiltered, outliers };
}

/* ── Health ─────────────────────────────────────── */
app.get('/api/health', (_req, res) =>
  res.json({ status: 'ok', ts: new Date().toISOString(), cacheSize: cache.size })
);

/* ── AutoRIA proxy ──────────────────────────────── */
app.get('/api/autoria/search', async (req, res) => {
  try {
    const rawQuery = req.url.split('?')[1] || '';
    const cleaned  = rawQuery.replace(/api_key=[^&]*&?/, '').replace(/&$/, '');
    const url = `https://auto.ria.com/api/search/auto?${cleaned}`;
    const r   = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' } });
    if (!r.ok) throw new Error(`AutoRIA ${r.status}`);
    res.json(await r.json());
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/autoria/info', async (req, res) => {
  try {
    const params = new URLSearchParams(req.query);
    const url = `https://developers.ria.com/auto/info?${params}`;
    const r   = await fetch(url);
    if (!r.ok) throw new Error(`AutoRIA info ${r.status}`);
    res.json(await r.json());
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ── /api/scrape/ie ─────────────────────────────── */
app.get('/api/scrape/ie', async (req, res) => {
  try {
    const rawSources = req.query.sources;
    const sources = Array.isArray(rawSources) ? rawSources.join(',') : String(rawSources || '');
    const make = String(req.query.make || '');
    const model = String(req.query.model || '');
    const { yearFrom, yearTo, priceFrom, priceTo } = req.query;
    
    const sourcesArr = sources.split(',').map(s => s.trim()).filter(Boolean);

    const cacheKey = `ie:${sources}:${make}:${model}:${yearFrom}:${yearTo}:${priceFrom}:${priceTo}`;
    const cached = getCached(cacheKey);
    if (cached) { console.log(`[cache HIT] ${cacheKey}`); return res.json(cached); }

    console.log(`[ie] sources=${sourcesArr} make=${make} model=${model} years=${yearFrom}-${yearTo}`);

    // Run all scrapers in parallel, never let one crash the whole response
    const tasks = sourcesArr.map(src => {
      if (src === 'donedeal')    return scrapeDoneDeal(`${make} ${model}`.trim(), yearFrom, yearTo, 40).catch(e => { console.error('[donedeal]',e.message); return []; });
      if (src === 'carsireland') return scrapeCarsIreland(make, model, yearFrom, yearTo).catch(e => { console.error('[carsireland]',e.message); return []; });
      if (src === 'carzone')     return scrapeCarzone(make, model, yearFrom, yearTo).catch(e => { console.error('[carzone]',e.message); return []; });
      return Promise.resolve([]);
    });

    let allAds = (await Promise.allSettled(tasks))
      .flatMap(r => r.status === 'fulfilled' ? r.value : []);

    // Apply strict post-scrape filters
    allAds = applyFilters(allAds, { make, model, yearFrom, yearTo, priceFrom, priceTo });

    // Deduplicate before stats
    allAds = deduplicateAds(allAds);

    const stats = calcStats(allAds);
    const result = { listings: allAds, stats };
    setCache(cacheKey, result);
    res.json(result);
  } catch (err) {
    console.error('[ie] API Error:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

/* ── /api/test-puppeteer ──────────────────────────── */
app.get('/api/test-puppeteer', async (req, res) => {
  let page;
  try {
    const browser = await import('./scrapers/puppeteerSetup.js').then(m => m.getBrowser());
    page = await browser.newPage();
    await page.goto('https://www.olx.ua/uk/', { waitUntil: 'networkidle2', timeout: 15000 });
    const title = await page.title();
    const content = await page.content();
    res.json({ status: 'ok', title, contentSnippet: content.substring(0, 200) });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  } finally {
    if (page) await page.close().catch(()=>{});
  }
});

/* ── /api/currency ──────────────────────────────────────── */
app.get('/api/currency', async (req, res) => {
  try {
    const { getExchangeRates } = await import('./scrapers/currency.js');
    const rates = await getExchangeRates();
    res.json(rates);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch currency rates' });
  }
});

/* ── /api/scrape/ua ─────────────────────────────── */
app.get('/api/scrape/ua', async (req, res) => {
  try {
    const rawSources = req.query.sources;
    const sources = Array.isArray(rawSources) ? rawSources.join(',') : String(rawSources || '');
    const rawQuery = req.query.query;
    const query = Array.isArray(rawQuery) ? rawQuery.join(' ') : String(rawQuery || '');
    const { yearFrom, yearTo, priceFrom, priceTo } = req.query;
    
    const sourcesArr = sources.split(',').map(s => s.trim()).filter(Boolean);

    const cacheKey = `ua:${sources}:${query}:${yearFrom}:${yearTo}:${priceFrom}:${priceTo}`;
    const cached = getCached(cacheKey);
    if (cached) { console.log(`[cache HIT] ${cacheKey}`); return res.json(cached); }

    console.log(`[ua] sources=${sourcesArr} query=${query} years=${yearFrom}-${yearTo}`);

    let scrapeErrors = [];
    const tasks = sourcesArr.map(src => {
      if (src === 'rst')    return scrapeRst(query, yearFrom, yearTo).catch(e => { scrapeErrors.push(`[rst] ${e.message}`); return []; });
      if (src === 'olx')    return scrapeOlx(query, yearFrom, yearTo).catch(e => { scrapeErrors.push(`[olx] ${e.message}`); return []; });
      if (src === 'carsua') return scrapeCarsUa(query, yearFrom, yearTo).catch(e => { scrapeErrors.push(`[carsua] ${e.message}`); return []; });
      return Promise.resolve([]);
    });

    const results = await Promise.all(tasks);
    let allAds = [];
    results.forEach(ads => { if (Array.isArray(ads)) allAds.push(...ads); });

    // Extract make/model from query string for filtering
    const parts = query.trim().split(' ');
    const make  = parts[0] || '';
    const model = parts.slice(1).join(' ') || '';
    allAds = applyFilters(allAds, { make, model, yearFrom, yearTo, priceFrom, priceTo });

    // Deduplicate before stats
    allAds = deduplicateAds(allAds);

    const stats = calcStats(allAds);
    const responseData = { listings: allAds, stats, errors: scrapeErrors };
    setCache(cacheKey, responseData);
    res.json(responseData);
  } catch (err) {
    console.error('[ua] API Error:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

/* ── /api/irish-prices (legacy compat) ─────────── */
app.get('/api/irish-prices', async (req, res) => {
  const { model } = req.query;
  if (!model) return res.status(400).json({ error: 'model required' });
  const cacheKey = `legacy:${model.toLowerCase()}`;
  const cached = getCached(cacheKey);
  if (cached) return res.json(cached);
  try {
    const listings = await scrapeDoneDeal(model, 20);
    const stats    = calcStats(listings);
    const result   = { listings, stats, source: 'DoneDeal', model };
    setCache(cacheKey, result);
    res.json(result);
  } catch (err) {
    res.status(500).json({ listings: [], stats: null, error: err.message });
  }
});

/* ── Filter helper ─────────────────────────────── */
function applyFilters(ads, { make, model, yearFrom, yearTo, priceFrom, priceTo }) {
  const yf = yearFrom  ? parseInt(yearFrom, 10)  : null;
  const yt = yearTo    ? parseInt(yearTo, 10)    : null;
  const pf = priceFrom ? parseFloat(priceFrom)   : null;
  const pt = priceTo   ? parseFloat(priceTo)     : null;

  return ads.filter(ad => {
    // Year filter — include ads without year (don't silently drop them),
    // only exclude ads with a known year that falls outside the range
    if (yf !== null && ad.year && ad.year < yf) return false;
    if (yt !== null && ad.year && ad.year > yt) return false;

    // Price filter
    if (pf !== null && ad.priceEur > 0 && ad.priceEur < pf) return false;
    if (pt !== null && ad.priceEur > 0 && ad.priceEur > pt) return false;

    // Model keyword filter — only if model given
    if (model && model.trim()) {
      const q    = model.toLowerCase();
      const hay  = `${ad.make||''} ${ad.model||''} ${ad.description||''} ${ad.title||''}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }

    return true;
  });
}

/* ── Start ─────────────────────────────────────── */
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚗 UA→IE Car Scout server on http://localhost:${PORT}`);
  });
}

process.on('SIGINT', async () => { await closeBrowser(); process.exit(0); });

export default app;
