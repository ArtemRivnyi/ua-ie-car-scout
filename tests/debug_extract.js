/**
 * Extract detailed listing data from CarsIreland and Cars.ua
 */
import { getBrowser, closeBrowser } from '../server/scrapers/puppeteerSetup.js';
import * as cheerio from 'cheerio';

async function carsIrelandExtract() {
  console.log('\n=== CarsIreland — Full card extraction ===\n');
  const url = 'https://www.carsireland.ie/search?make=Toyota';
  const browser = await getBrowser();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
  await page.waitForSelector('.listing', { timeout: 10000 }).catch(() => {});
  
  const content = await page.content();
  const $ = cheerio.load(content);
  
  // Try to extract detailed info from listing cards  
  const listings = $('.listing.ng-star-inserted');
  console.log(`Total listings: ${listings.length}\n`);
  
  listings.each((i, el) => {
    if (i >= 3) return;
    console.log(`--- Listing ${i} ---`);
    
    // Link and ID
    const link = $(el).find('a').first();
    const href = link.attr('href');
    console.log(`  href: ${href}`);
    
    // Try to get the text content of the full card in structured way
    const cardComp = $(el).find('cids-o-listing-card');
    const cardDiv = cardComp.find('.cids-o-listing-card');
    
    // Get all text blocks
    const allText = $(el).text().replace(/\s+/g, ' ').trim();
    console.log(`  Full text: ${allText.substring(0, 300)}`);
    
    // Try specific selectors for model name
    const titleEl = $(el).find('.listing-card-mobile__title, .listing-card-desktop__title, [class*="__title"]');
    console.log(`  Title elements: ${titleEl.length}`);
    titleEl.each((j, t) => {
      console.log(`    title[${j}]: class="${$(t).attr('class')}" text="${$(t).text().trim().substring(0, 100)}"`);
    });
    
    // Price
    const priceEl = $(el).find('[class*="price"]');
    priceEl.each((j, p) => {
      if (j < 3) console.log(`    price[${j}]: class="${$(p).attr('class')}" text="${$(p).text().trim().substring(0, 50)}"`);
    });
    
    // Image from background-image style
    const bgSpan = $(el).find('span[style*="background-image"]').first();
    const style = bgSpan.attr('style') || '';
    const imgMatch = style.match(/url\("([^"]+)"\)/);
    console.log(`  Background image: ${imgMatch?.[1] || 'none'}`);
    
    // Look for make/model/year in text or data attributes
    const details = $(el).find('[class*="detail"], [class*="spec"]');
    details.each((j, d) => {
      if (j < 5) console.log(`    detail[${j}]: class="${$(d).attr('class')}" text="${$(d).text().trim().substring(0, 80)}"`);
    });
    
    console.log();
  });
  
  await page.close();
}

async function carsUaExplore() {
  console.log('\n=== Cars.ua — Explore homepage ===\n');
  const browser = await getBrowser();
  const page = await browser.newPage();
  await page.goto('https://cars.ua/', { waitUntil: 'networkidle2', timeout: 30000 });
  
  const content = await page.content();
  const $ = cheerio.load(content);
  
  // Look for search form and links to figure out URL structure
  const forms = $('form');
  forms.each((i, f) => {
    const action = $(f).attr('action');
    const method = $(f).attr('method');
    console.log(`Form ${i}: action="${action}" method="${method}"`);
    $(f).find('input, select').each((j, inp) => {
      const name = $(inp).attr('name');
      const type = $(inp).attr('type') || $(inp).prop('tagName');
      const val = $(inp).val();
      console.log(`  ${type}: name="${name}" value="${val}"`);
    });
  });
  
  // Find search/navigation links
  console.log('\nNavigation links:');
  $('a[href*="search"], a[href*="auto"], a[href*="toyota"]').each((i, a) => {
    if (i < 10) console.log(`  ${$(a).attr('href')} — "${$(a).text().trim().substring(0, 50)}"`);
  });
  
  // Check the items on the homepage
  console.log('\nHomepage car items (.car-container or .item):');
  const items = $('.car-container, .item');
  items.each((i, el) => {
    if (i >= 5) return;
    const title = $(el).find('a').first().text().trim().substring(0, 60);
    const href = $(el).find('a').first().attr('href');
    const price = $(el).find('[class*="price"]').text().trim();
    console.log(`  Item ${i}: "${title}" href=${href} price="${price}"`);
  });
  
  // Check if there's a way to search via GET params
  console.log('\nAll links containing filter/search patterns:');
  $('a[href]').each((i, a) => {
    const h = $(a).attr('href') || '';
    if ((h.includes('filter') || h.includes('search') || h.includes('brand') || h.includes('mark')) && i < 20) {
      console.log(`  ${h}`);
    }
  });
  
  await page.close();
}

async function carzoneExtract() {
  console.log('\n=== Carzone — Detailed extraction ===\n');
  const url = 'https://www.carzone.ie/search?make=Toyota';
  const browser = await getBrowser();
  const page = await browser.newPage();
  
  // Wait for Angular SPA content
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
  await new Promise(r => setTimeout(r, 3000)); // extra wait for Angular
  
  const content = await page.content();
  const $ = cheerio.load(content);
  
  // Try different card selectors
  const selectors = [
    '.czds-o-partner-card',
    '[class*="partner-card"]',
    '[class*="listing"]',
    '[class*="advert"]',
    'czds-o-listing-card',
    'app-search-result-card',
    '[class*="search-result"]',
    '[class*="result-card"]',
  ];
  
  for (const sel of selectors) {
    const els = $(sel);
    if (els.length > 0) {
      console.log(`${sel}: ${els.length} elements`);
      els.each((i, el) => {
        if (i >= 2) return;
        const text = $(el).text().replace(/\s+/g, ' ').trim().substring(0, 200);
        console.log(`  [${i}] ${text}`);
      });
    }
  }
  
  // Look for links that go to car detail pages
  console.log('\nLinks to car detail pages:');
  $('a[href*="/used-cars/"], a[href*="/car-details/"]').each((i, a) => {
    if (i < 5) {
      const href = $(a).attr('href');
      const text = $(a).text().replace(/\s+/g, ' ').trim().substring(0, 80);
      console.log(`  ${href} — "${text}"`);
    }
  });
  
  // Get all unique component/class patterns
  const classesWithContent = [];
  $('[class]').each((_, el) => {
    const cls = $(el).attr('class');
    const text = $(el).children().length === 0 ? $(el).text().trim() : '';
    if (text && text.includes('€') && text.length < 30) {
      classesWithContent.push({ class: cls, text });
    }
  });
  console.log('\nElements containing € price:');
  classesWithContent.slice(0, 10).forEach(c => console.log(`  class="${c.class}" text="${c.text}"`));
  
  await page.close();
}

async function main() {
  try {
    await carsIrelandExtract();
    await carzoneExtract();
    await carsUaExplore();
  } catch (e) {
    console.error('Error:', e);
  }
  await closeBrowser();
  process.exit(0);
}

main();
