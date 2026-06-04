import fs from 'fs';
import * as cheerio from 'cheerio';
const $ = cheerio.load(fs.readFileSync('carzone_test.html', 'utf8'));
const cards = $('stock-summary-item');
console.log('Found', cards.length, 'cards');
if (cards.length > 0) {
  const card = cards.eq(0);
  console.log('Images inside card:', card.find('img').length);
  card.find('img').each((i, el) => console.log($.html(el)));
  console.log('Background elements:', card.find('[style*="background-image"]').length);
  card.find('[style*="background-image"]').each((i, el) => console.log($.html(el)));
}
