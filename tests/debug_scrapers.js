/**
 * Debug script to check what CarsIreland and Carzone pages actually return
 */
import { getBrowser } from '../server/scrapers/puppeteerSetup.js';
import * as cheerio from 'cheerio';

async function debugCarsIreland() {
  console.log('\n=== Debugging CarsIreland ===\n');
  
  const url = 'https://www.carsireland.ie/search?make=Volkswagen&model=Golf&year=2015&maxYear=2025';
  console.log('URL:', url);
  
  const browser = await getBrowser();
  const page = await browser.newPage();
  
  // Don't block images for debugging
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  
  const content = await page.content();
  const $ = cheerio.load(content);
  
  // Check for __NEXT_DATA__
  const script = $('#__NEXT_DATA__').html();
  if (script) {
    try {
      const data = JSON.parse(script);
      console.log('__NEXT_DATA__ keys:', Object.keys(data));
      console.log('props keys:', data?.props ? Object.keys(data.props) : 'N/A');
      console.log('pageProps keys:', data?.props?.pageProps ? Object.keys(data.props.pageProps) : 'N/A');
      
      // Try to find search results at various paths
      const pp = data?.props?.pageProps;
      if (pp) {
        for (const [k, v] of Object.entries(pp)) {
          if (Array.isArray(v) && v.length > 0) {
            console.log(`  Found array at pageProps.${k}: ${v.length} items`);
            console.log('  Sample:', JSON.stringify(v[0]).substring(0, 200));
          } else if (typeof v === 'object' && v !== null) {
            for (const [k2, v2] of Object.entries(v)) {
              if (Array.isArray(v2) && v2.length > 0) {
                console.log(`  Found array at pageProps.${k}.${k2}: ${v2.length} items`);
                console.log('  Sample:', JSON.stringify(v2[0]).substring(0, 200));
              }
            }
          }
        }
      }
    } catch (e) {
      console.log('Failed to parse __NEXT_DATA__:', e.message);
    }
  } else {
    console.log('No __NEXT_DATA__ found!');
  }
  
  // Check HTML elements
  const cards = $('[class*="vehicle"], [class*="card"], [class*="listing"], [class*="result"]');
  console.log(`\nHTML cards found (class contains vehicle/card/listing/result): ${cards.length}`);
  cards.each((i, el) => {
    if (i < 3) console.log(`  Card ${i}: tag=${el.tagName} class="${$(el).attr('class')}"`);
  });
  
  // Check title
  console.log('Page title:', $('title').text());
  console.log('H1:', $('h1').first().text().substring(0, 100));
  
  await page.close();
}

async function debugCarzone() {
  console.log('\n=== Debugging Carzone ===\n');
  
  const url = 'https://www.carzone.ie/search?make=Volkswagen&model=Golf&minYear=2015&maxYear=2025';
  console.log('URL:', url);
  
  const browser = await getBrowser();
  const page = await browser.newPage();
  
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  
  const content = await page.content();
  const $ = cheerio.load(content);
  
  // Check for __NEXT_DATA__
  const script = $('#__NEXT_DATA__').html();
  if (script) {
    try {
      const data = JSON.parse(script);
      console.log('__NEXT_DATA__ keys:', Object.keys(data));
      console.log('props keys:', data?.props ? Object.keys(data.props) : 'N/A');
      console.log('pageProps keys:', data?.props?.pageProps ? Object.keys(data.props.pageProps) : 'N/A');
      
      const pp = data?.props?.pageProps;
      if (pp) {
        for (const [k, v] of Object.entries(pp)) {
          if (Array.isArray(v) && v.length > 0) {
            console.log(`  Found array at pageProps.${k}: ${v.length} items`);
            console.log('  Sample:', JSON.stringify(v[0]).substring(0, 200));
          } else if (typeof v === 'object' && v !== null) {
            for (const [k2, v2] of Object.entries(v)) {
              if (Array.isArray(v2) && v2.length > 0) {
                console.log(`  Found array at pageProps.${k}.${k2}: ${v2.length} items`);
                console.log('  Sample:', JSON.stringify(v2[0]).substring(0, 200));
              }
            }
          }
        }
      }
    } catch (e) {
      console.log('Failed to parse __NEXT_DATA__:', e.message);
    }
  } else {
    console.log('No __NEXT_DATA__ found!');
  }
  
  // Check HTML
  const cards = $('[class*="card"], [class*="listing"], [class*="result"], [class*="advert"]');
  console.log(`\nHTML cards found: ${cards.length}`);
  cards.each((i, el) => {
    if (i < 3) console.log(`  Card ${i}: tag=${el.tagName} class="${$(el).attr('class')}"`);
  });
  
  console.log('Page title:', $('title').text());
  console.log('H1:', $('h1').first().text().substring(0, 100));
  
  await page.close();
}

async function debugRst() {
  console.log('\n=== Debugging RST.ua ===\n');
  
  const url = 'https://rst.ua/oldcars/toyota/?year=1980-2000&condition=2';
  console.log('URL:', url);
  
  const browser = await getBrowser();
  const page = await browser.newPage();
  
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  
  const content = await page.content();
  const $ = cheerio.load(content);
  
  const cards = $('.c');
  console.log(`RST .c cards found: ${cards.length}`);
  cards.each((i, el) => {
    if (i < 3) {
      const title = $(el).find('.t a').text().trim();
      const price = $(el).find('.pr b').text().trim();
      console.log(`  Card ${i}: "${title}" price="${price}"`);
    }
  });
  
  console.log('Page title:', $('title').text().substring(0, 100));
  
  await page.close();
}

async function debugCarsUa() {
  console.log('\n=== Debugging Cars.ua ===\n');
  
  const url = 'https://cars.ua/search/toyota/?year_min=1980&year_max=2000';
  console.log('URL:', url);
  
  const browser = await getBrowser();
  const page = await browser.newPage();
  
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  
  const content = await page.content();
  const $ = cheerio.load(content);
  
  const cards = $('.car-item');
  console.log(`Cars.ua .car-item found: ${cards.length}`);
  
  // Try other selectors
  const allLinks = $('a[href*="/car/"]');
  console.log(`Links with /car/: ${allLinks.length}`);
  
  // Look at page structure
  const allClasses = new Set();
  $('[class]').each((i, el) => {
    const cls = $(el).attr('class');
    if (cls) cls.split(/\s+/).forEach(c => allClasses.add(c));
  });
  const carClasses = [...allClasses].filter(c => c.toLowerCase().includes('car') || c.toLowerCase().includes('listing') || c.toLowerCase().includes('result') || c.toLowerCase().includes('item'));
  console.log(`Car-related classes: ${carClasses.join(', ')}`);
  
  console.log('Page title:', $('title').text().substring(0, 100));
  console.log('H1:', $('h1').first().text().substring(0, 100));
  
  await page.close();
}

async function main() {
  try {
    await debugCarsIreland();
    await debugCarzone();
    await debugRst();
    await debugCarsUa();
  } catch (e) {
    console.error('Error:', e);
  }
  
  const { closeBrowser } = await import('../server/scrapers/puppeteerSetup.js');
  await closeBrowser();
  process.exit(0);
}

main();
