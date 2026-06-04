import fs from 'fs';
import * as cheerio from 'cheerio';

function checkRST() {
  const html = fs.readFileSync('rst.html', 'utf8');
  const $ = cheerio.load(html);
  
  const cars = $('.rst-page-wrap .rst-ix'); // Wait, let's just find the first item
  const link = $('a[href*="/oldcars/toyota/corolla/toyota_corolla_"]').first();
  console.log("RST Item HTML:", link.parent().parent().parent().html());
}

function checkOlx() {
  const html = fs.readFileSync('olx.html', 'utf8');
  const $ = cheerio.load(html);
  const script = $('script#__NEXT_DATA__').html();
  if (script) console.log("OLX NEXT_DATA YES");
  
  // Try to find PRERENDERED_STATE
  const state = $('script').filter((i, el) => $(el).html() && $(el).html().includes('__PRERENDERED_STATE__')).html();
  if (state) console.log("OLX STATE YES");
  
  const link = $('a[href*="/d/uk/obyavlenie/"]').first();
  if (link.length) {
    console.log("OLX Link found:", link.attr('href'));
    console.log("OLX Card HTML:", link.parent().parent().parent().html());
  }
}

checkRST();
checkOlx();
