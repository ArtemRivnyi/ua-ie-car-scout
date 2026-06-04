import fs from 'fs';
import * as cheerio from 'cheerio';
const html = fs.readFileSync('olx_test.html', 'utf8');
const $ = cheerio.load(html);
const cards = $('a[href*="/d/uk/obyavlenie/"], a[href*="/d/obyavlenie/"]');
console.log('Cards found:', cards.length);
if (cards.length > 0) {
  const card = cards.eq(0).closest('div[type="list"], [data-cy="l-card"]');
  console.log('Images inside card:', card.find('img').length);
  card.find('img').each((i, el) => {
     console.log('src:', $(el).attr('src'));
     console.log('srcset:', $(el).attr('srcset'));
  });
}
