import { getBrowser } from './puppeteerSetup.js';
import * as cheerio from 'cheerio';
import crypto from 'crypto';
import { getExchangeRates } from '../services/exchangeRateService.js';

/**
 * Fetches car listings from CARS.ua using Puppeteer.
 */
export async function scrapeCarsUa(query, yearFrom, yearTo) {
  const parts = (query || '').toLowerCase().split(' ');
  const make = parts[0] || '';
  const model = parts[1] || '';
  const rates = await getExchangeRates();
  
  const params = new URLSearchParams();
  if (yearFrom) params.set('year_min', yearFrom);
  if (yearTo) params.set('year_max', yearTo);

  const url = `https://cars.ua/search/${make}/${model}?${params.toString()}`;

  let page;
  try {
    const browser = await getBrowser();
    page = await browser.newPage();
    
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if (['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });

    console.log(`[carsua] Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    const content = await page.content();
    const ads = parseCarsUa(content, make, model, rates, yearFrom, yearTo);

    console.log(`[carsua] Got ${ads.length} ads via Puppeteer`);
    return ads;
  } catch (err) {
    console.error('[carsua] Puppeteer failed, falling back to HTTP:', err.message);
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'uk-UA,uk;q=0.9,en-US;q=0.8,en;q=0.7'
        }
      });
      if (!res.ok) throw new Error(`HTTP status ${res.status}`);
      const content = await res.text();
      return parseCarsUa(content, make, model, rates, yearFrom, yearTo);
    } catch (fetchErr) {
      console.error('[carsua] HTTP fallback failed:', fetchErr.message);
      return [];
    }
  } finally {
    if (page && !page.isClosed()) {
      await page.close().catch(() => {});
    }
  }
}

export function parseCarsUa(htmlContent, make, model, rates, yearFrom, yearTo) {
  const $ = cheerio.load(htmlContent);
  const ads = [];

  $('.ticket-item').each((i, el) => {
    try {
      const priceText = $(el).find('.price-ticket').attr('data-main-price') || $(el).find('.size22').text();
      const priceNum = parseInt(priceText.replace(/[^0-9]/g, ''), 10);
      if (!priceNum) return;

      const titleElem = $(el).find('.ticket-title a');
      const href = titleElem.attr('href');
      if (!href) return;
      const titleText = titleElem.text().trim();

      const yearMatch = titleText.match(/\b(19|20)\d{2}\b/);
      const year = yearMatch ? parseInt(yearMatch[0], 10) : null;
      
      if (yearFrom && (!year || year < parseInt(yearFrom, 10))) return;
      if (yearTo && (!year || year > parseInt(yearTo, 10))) return;

      const img = $(el).find('.ticket-photo img').attr('src');
      const desc = $(el).find('.descriptions-ticket').text().trim();

      const priceEur = Math.round(priceNum * rates.usdToEur);

      const rawId = href.match(/(\d+)\.html/)?.[1] || titleText;
      const hash = crypto.createHash('md5').update(rawId + priceNum).digest('hex').substring(0, 8);

      ads.push({
        id: `carsua_${hash}`,
        source: 'CARS.ua',
        sourceUrl: href.startsWith('http') ? href : `https://cars.ua${href}`,
        make,
        model,
        year,
        priceEur,
        priceOriginal: priceNum,
        priceOriginalCurrency: 'USD',
        photos: img ? [img] : [],
        description: titleText + ' - ' + desc
      });
    } catch (e) {
      // skip corrupted ad
    }
  });

  return ads;
}
