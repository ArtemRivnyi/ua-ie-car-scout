/**
 * Deep debug: dump HTML structure of each site's listing cards
 */
import { getBrowser, closeBrowser } from '../server/scrapers/puppeteerSetup.js';
import * as cheerio from 'cheerio';

async function debugCarsIrelandDeep() {
  console.log('\n=== CarsIreland DEEP ===\n');
  const url = 'https://www.carsireland.ie/search?make=Toyota';
  const browser = await getBrowser();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
  // Wait for listings to load (Angular SPA)
  await page.waitForSelector('.listing', { timeout: 10000 }).catch(() => console.log('No .listing selector found within timeout'));
  
  const content = await page.content();
  const $ = cheerio.load(content);
  
  // Find listing cards
  const listings = $('.listing.ng-star-inserted');
  console.log(`Found ${listings.length} .listing cards`);
  
  listings.each((i, el) => {
    if (i >= 5) return;
    const html = $(el).html()?.substring(0, 500);
    console.log(`\n--- Listing ${i} ---`);
    
    // Try various selectors for title
    const title = $(el).find('h2, h3, .title, [class*="title"]').first().text().trim();
    const price = $(el).find('[class*="price"]').first().text().trim();
    const year = $(el).find('[class*="year"]').first().text().trim();
    const link = $(el).find('a').first().attr('href');
    const img = $(el).find('img').first().attr('src');
    
    console.log(`  Title: ${title}`);
    console.log(`  Price: ${price}`);
    console.log(`  Year: ${year}`);
    console.log(`  Link: ${link}`);
    console.log(`  Img: ${img}`);
    
    // Show all classes
    const innerHtml = $(el).html()?.substring(0, 800);
    console.log(`  HTML snippet: ${innerHtml?.replace(/\s+/g, ' ')}`);
  });
  
  await page.close();
}

async function debugCarzoneDeep() {
  console.log('\n=== Carzone DEEP ===\n');
  const url = 'https://www.carzone.ie/search?make=Toyota';
  const browser = await getBrowser();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
  await page.waitForSelector('[class*="partner-card"], [class*="listing"]', { timeout: 10000 }).catch(() => console.log('No card selector found'));
  
  const content = await page.content();
  const $ = cheerio.load(content);
  
  // Find cards
  const cards = $('[class*="partner-card"].ng-star-inserted');
  console.log(`Found ${cards.length} partner-card elements`);
  
  cards.each((i, el) => {
    if (i >= 5) return;
    console.log(`\n--- Card ${i} ---`);
    
    const title = $(el).find('h2, h3, [class*="title"]').first().text().trim();
    const price = $(el).find('[class*="price"]').first().text().trim();
    const link = $(el).find('a').first().attr('href');
    const img = $(el).find('img').first().attr('src');
    
    console.log(`  Title: ${title}`);
    console.log(`  Price: ${price}`);
    console.log(`  Link: ${link}`);
    console.log(`  Img: ${img}`);
    
    const innerHtml = $(el).html()?.substring(0, 800);
    console.log(`  HTML snippet: ${innerHtml?.replace(/\s+/g, ' ')}`);
  });
  
  await page.close();
}

async function debugRstDeep() {
  console.log('\n=== RST.ua DEEP ===\n');
  const url = 'https://rst.ua/oldcars/toyota/?year=1980-2000&condition=2';
  const browser = await getBrowser();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  
  const content = await page.content();
  const $ = cheerio.load(content);
  
  const cards = $('.c');
  console.log(`Found ${cards.length} .c cards`);
  
  cards.each((i, el) => {
    if (i >= 5) return;
    console.log(`\n--- RST Card ${i} ---`);
    
    const titleA = $(el).find('.t a');
    const title = titleA.text().trim();
    const href = titleA.attr('href');
    
    // Price - try multiple approaches
    const prBlock = $(el).find('.pr');
    const priceAll = prBlock.text().trim();
    const priceBold = prBlock.find('b').first().text().trim();
    
    // Year 
    const yearLi = $(el).find('.ps li');
    const yearTexts = [];
    yearLi.each((j, li) => yearTexts.push($(li).text().trim()));
    
    // Image
    const prevP = $(el).prev('.p');
    const img = prevP.find('img').not('.wm').attr('src');
    
    console.log(`  Title: ${title}`);
    console.log(`  Href: ${href}`);
    console.log(`  Price all: ${priceAll}`);
    console.log(`  Price bold: ${priceBold}`);
    console.log(`  Year info: ${yearTexts.join(' | ')}`);
    console.log(`  Img: ${img}`);
  });
  
  await page.close();
}

async function debugCarsUaDeep() {
  console.log('\n=== Cars.ua DEEP ===\n');
  
  // First check what URLs work
  const urls = [
    'https://cars.ua/search/toyota/',
    'https://cars.ua/toyota/',
    'https://cars.ua/search?q=toyota',
    'https://cars.ua/ua/search?q=toyota',
    'https://cars.ua/',
  ];
  
  const browser = await getBrowser();
  
  for (const url of urls) {
    const page = await browser.newPage();
    try {
      console.log(`\nTrying: ${url}`);
      const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
      const status = resp?.status();
      const content = await page.content();
      const $ = cheerio.load(content);
      const title = $('title').text().trim();
      const h1 = $('h1').first().text().trim();
      console.log(`  Status: ${status}, Title: "${title}", H1: "${h1}"`);
      
      if (status === 200 && !title.includes('404')) {
        // Look for car listings
        const allClasses = new Set();
        $('[class]').each((_, el) => {
          $(el).attr('class')?.split(/\s+/).forEach(c => allClasses.add(c));
        });
        const carRelated = [...allClasses].filter(c => 
          /car|auto|vehic|list|card|item|result|product|offer/i.test(c)
        );
        console.log(`  Car-related classes: ${carRelated.slice(0, 20).join(', ')}`);
        
        // Check for listing-like structures
        const links = $('a[href]').filter((_, a) => {
          const h = $(a).attr('href');
          return h && (h.includes('/auto/') || h.includes('/car/') || h.includes('/vehicle/') || h.includes('/offer/'));
        });
        console.log(`  Car links found: ${links.length}`);
        
        if (links.length > 0) {
          links.each((j, a) => {
            if (j < 3) console.log(`    Link: ${$(a).attr('href')} — "${$(a).text().trim().substring(0, 60)}"`);
          });
        }
      }
    } catch (e) {
      console.log(`  Error: ${e.message}`);
    }
    await page.close();
  }
}

async function main() {
  try {
    await debugRstDeep();
    await debugCarsIrelandDeep();
    await debugCarzoneDeep();
    await debugCarsUaDeep();
  } catch (e) {
    console.error('Fatal:', e);
  }
  await closeBrowser();
  process.exit(0);
}

main();
