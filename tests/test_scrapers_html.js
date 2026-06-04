import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function testRstSelectors() {
  console.log('\n--- Testing RST.ua Selectors ---');
  const htmlPath = path.join(__dirname, '../test_data/rst.html');
  if (!fs.existsSync(htmlPath)) {
    console.error('File not found:', htmlPath);
    return;
  }
  const content = fs.readFileSync(htmlPath, 'utf8');
  const $ = cheerio.load(content);
  
  const ads = [];
  $('.c').each((i, el) => {
    const a = $(el).find('.t a');
    const href = a.attr('href');
    if (!href) return;
    
    const title = a.text().trim();
    let priceElem = $(el).find('.pr b').first();
    if (!priceElem.length) priceElem = $(el).find('.pr .t').first();
    
    const priceText = priceElem.clone().children().remove().end().text().trim(); // e.g. "$13'999= 621'900 грн"
    
    let priceUsd = 0;
    const usdPart = priceText.split('=')[0]; 
    if (usdPart && usdPart.includes('$')) {
      priceUsd = parseInt(usdPart.replace(/[^0-9]/g, ''), 10) || 0;
    }
    
    const yearText = $(el).find('.ps li').text() || '';
    const yearMatch = yearText.match(/\b(19|20)\d{2}\b/);
    const year = yearMatch ? parseInt(yearMatch[0], 10) : null;
    
    const img = $(el).prev('.p').find('img').not('.wm').attr('src');
    
    ads.push({
      title,
      href,
      priceText,
      priceUsd,
      year,
      img
    });
  });

  console.log(`Extracted ${ads.length} ads using current selectors.`);
  if (ads.length > 0) {
    console.log('Sample ad:', ads[0]);
  } else {
    console.log('FAILED to extract any ads. Selectors might be outdated.');
    
    // Let's debug what items we can find
    console.log('\nDebugging RST structure:');
    const links = $('a[href*="rst.ua/oldcars/"]').length;
    console.log(`Found ${links} links matching oldcars.`);
  }
}

function testCarsUaSelectors() {
  console.log('\n--- Testing CARS.ua Selectors ---');
  const htmlPath = path.join(__dirname, '../test_data/carsua.html');
  if (!fs.existsSync(htmlPath)) {
    console.error('File not found:', htmlPath);
    return;
  }
  const content = fs.readFileSync(htmlPath, 'utf8');
  const $ = cheerio.load(content);
  
  const ads = [];
  $('.car-item').each((i, el) => {
    const title = $(el).find('.car-title').text().trim();
    const priceText = $(el).find('.car-price').text().trim();
    const priceUsd = parseInt(priceText.replace(/[^0-9]/g, ''), 10) || 0;
    const href = $(el).find('a').attr('href');
    
    ads.push({
      title,
      priceText,
      priceUsd,
      href
    });
  });

  console.log(`Extracted ${ads.length} ads using current selectors.`);
  if (ads.length > 0) {
    console.log('Sample ad:', ads[0]);
  } else {
    console.log('FAILED to extract any ads. Selectors might be outdated.');
    
    // Let's debug what items we can find
    console.log('\nDebugging CARS.ua structure:');
    const items = $('.item').length;
    console.log(`Found ${items} elements with class 'item'.`);
    const containers = $('.car-container').length;
    console.log(`Found ${containers} elements with class 'car-container'.`);
    
    // Try to find price elements
    const prices = $('[class*="price"]').length;
    console.log(`Found ${prices} elements with class containing 'price'.`);
    
    if (items > 0) {
      console.log('HTML of first item:', $('.item').first().html().substring(0, 500));
    }
  }
}

testRstSelectors();
testCarsUaSelectors();
