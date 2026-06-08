import { getBrowser } from './puppeteerSetup.js';
import * as cheerio from 'cheerio';
import crypto from 'crypto';
import { getExchangeRates } from '../services/exchangeRateService.js';

/**
 * Fetches car listings from RST.ua using Puppeteer.
 * 
 * Correct URL structure: https://rst.ua/oldcars/car/toyota/corolla/?year=1985-1995
 * Note the /car/ segment between /oldcars/ and the make.
 */
export async function scrapeRst(query, yearFrom, yearTo) {
  // Extract make and model from query
  const parts = (query || '').toLowerCase().split(' ');
  const make = parts[0] || '';
  const model = parts[1] || '';
  const rates = await getExchangeRates();
  
  // RST URL structure: /oldcars/{make}/{model}/?year={from}-{to}
  let url = `https://rst.ua/oldcars/`;
  if (make) url += `${make}/`;
  if (model) url += `${model}/`;
  
  const params = new URLSearchParams();
  if (yearFrom && yearTo) params.set('year', `${yearFrom}-${yearTo}`);
  else if (yearFrom) params.set('year', `${yearFrom}-0`);
  else if (yearTo) params.set('year', `0-${yearTo}`);
  
  params.set('condition', '2'); // Not crashed
  
  if (params.toString()) url += `?${params.toString()}`;

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

    console.log(`[rst] Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
    
    const content = await page.content();
    const ads = parseRst(content, query, rates, yearFrom, yearTo);
    console.log(`[rst] Got ${ads.length} ads via Puppeteer`);
    return ads;
  } catch (err) {
    console.error('[rst] scrapeRst failed:', err.message);
    return [];
  } finally {
    if (page && !page.isClosed()) {
      await page.close().catch(() => {});
    }
  }
}

export function parseRst(htmlContent, query, rates, yearFrom, yearTo) {
  const $ = cheerio.load(htmlContent);
  const ads = [];
  const make = query.split(' ')[0] || '';
  const model = query.split(' ').slice(1).join(' ') || '';

  $('.rst-ocb-i').each((i, el) => {
    try {
      const priceText = $(el).find('.rst-ocb-i-d-l-i-s-p').text();
      const priceNum = parseInt(priceText.replace(/[^0-9]/g, ''), 10);
      if (!priceNum) return;

      const titleText = $(el).find('.rst-ocb-i-h span').text().trim();
      const href = $(el).find('a.rst-ocb-i-a').attr('href');
      if (!href) return;

      const yearText = $(el).find('.rst-ocb-i-d-l-i-s-y').text();
      const yearMatch = yearText.match(/\b(19|20)\d{2}\b/);
      const year = yearMatch ? parseInt(yearMatch[0], 10) : null;
      
      if (yearFrom && (!year || year < parseInt(yearFrom, 10))) return;
      if (yearTo && (!year || year > parseInt(yearTo, 10))) return;
      
      const img = $(el).prev('.p').find('img').not('.wm').attr('src');
      
      const desc = $(el).find('.rst-ocb-i-d-d').text().trim();

      const priceEur = Math.round(priceNum * rates.usdToEur);

      const rawId = href.match(/-(\\d+)\\.html/)?.[1] || titleText;
      const hash = crypto.createHash('md5').update(rawId + priceNum).digest('hex').substring(0, 8);

      ads.push({
        id: `rst_${hash}`,
        source: 'RST.ua',
        sourceUrl: `https://rst.ua${href}`,
        make,
        model,
        year,
        priceEur,
        priceOriginal: priceNum,
        priceOriginalCurrency: 'USD',
        photos: img ? [`https:${img}`] : [],
        description: titleText + ' - ' + desc
      });
    } catch (e) {
      // skip corrupted ad
    }
  });

  return ads;
}
