import fs from 'fs';
import * as cheerio from 'cheerio';

function checkCarsIreland() {
  const html = fs.readFileSync('carsireland.html', 'utf8');
  const $ = cheerio.load(html);
  const links = $('a').filter((i, el) => {
    const href = $(el).attr('href');
    return href && href.includes('/used-cars/') && $(el).text().trim().includes('Corolla');
  }).slice(0, 1);
  
  if (links.length) {
    console.log("CarsIreland Link:", links.attr('href'));
    console.log("CarsIreland Parent HTML:", links.parent().parent().html().substring(0, 500));
  } else {
    // Maybe something else?
    const h3 = $('h3, h2').filter((i, el) => $(el).text().includes('Corolla')).slice(0, 1);
    console.log("CarsIreland Header:", h3.text());
    console.log("CarsIreland Header Parent:", h3.parent().parent().parent().html().substring(0, 500));
  }
}

function checkCarzone() {
  const html = fs.readFileSync('carzone.html', 'utf8');
  const $ = cheerio.load(html);
  
  const h3 = $('h3, h2, h4, h5').filter((i, el) => $(el).text().includes('Corolla')).slice(0, 1);
  if (h3.length) {
    console.log("Carzone Header:", h3.text());
    console.log("Carzone Parent:", h3.parent().parent().parent().html().substring(0, 500));
  }
}

checkCarsIreland();
checkCarzone();
