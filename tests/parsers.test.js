/**
 * parsers.test.js — 100% coverage for all scraper parse functions
 *
 * Tests pure parsing functions (no network, no Puppeteer):
 *  - parseRst: RST.ua HTML → ads
 *  - parseOlx: OLX.ua HTML (NEXT_DATA + DOM fallback)
 *  - parseCarzone: Carzone.ie HTML (stock-summary-item + fallback)
 *  - parseCarsIreland: CarsIreland.ie HTML (Angular components + fallback)
 *  - parseCarsUa: CARS.ua HTML
 *  - parseDoneDeal: DoneDeal NEXT_DATA JSON (multiple paths)
 *  - parseDoneDealHtml: DoneDeal HTML DOM fallback
 */
import test from 'node:test';
import assert from 'node:assert';
import { parseRst } from '../server/scrapers/rst.js';
import { parseOlx } from '../server/scrapers/olx.js';
import { parseCarzone } from '../server/scrapers/carzone.js';
import { parseCarsIreland } from '../server/scrapers/carsireland.js';
import { parseCarsUa } from '../server/scrapers/carsua.js';
import { parseDoneDeal, parseDoneDealHtml } from '../server/scrapers/donedeal.js';

const mockRates = { usdToEur: 0.9, uahToEur: 0.025 };

test('Parser Unit Tests — Full Coverage', async (t) => {

  // ═══════════════════════════════════════════════════════════
  // parseRst
  // ═══════════════════════════════════════════════════════════

  await t.test('parseRst — multiple ads, no filters', () => {
    const html = `
      <div class="rst-ocb-i">
        <div class="p"><img src="//example.com/img.jpg" /></div>
        <div class="rst-ocb-i-d-l-i-s-p">$10,500</div>
        <div class="rst-ocb-i-h"><span><a class="rst-ocb-i-a" href="/auto/123.html">Toyota Camry</a></span></div>
        <div class="rst-ocb-i-d-l-i-s-y">2015</div>
        <div class="rst-ocb-i-d-d">Good condition</div>
      </div>
      <div class="rst-ocb-i">
        <div class="p"><img src="//example.com/img2.jpg" /></div>
        <div class="rst-ocb-i-d-l-i-s-p">$9,000</div>
        <div class="rst-ocb-i-h"><span><a class="rst-ocb-i-a" href="/auto/124.html">Toyota Camry</a></span></div>
        <div class="rst-ocb-i-d-l-i-s-y">2008</div>
        <div class="rst-ocb-i-d-d">Bad condition</div>
      </div>
    `;
    const ads = parseRst(html, 'Toyota Camry', mockRates, null, null);
    assert.strictEqual(ads.length, 2);
    assert.strictEqual(ads[0].priceOriginal, 10500);
    assert.strictEqual(ads[0].priceEur, Math.round(10500 * 0.9));
    assert.strictEqual(ads[0].source, 'RST.ua');
    assert.strictEqual(ads[0].year, 2015);
    assert.strictEqual(ads[0].priceOriginalCurrency, 'USD');
    assert.ok(ads[0].sourceUrl.startsWith('https://rst.ua'));
  });

  await t.test('parseRst — year filter applied', () => {
    const html = `
      <div class="rst-ocb-i">
        <div class="rst-ocb-i-d-l-i-s-p">$10,000</div>
        <div class="rst-ocb-i-h"><span><a class="rst-ocb-i-a" href="/auto/1.html">Toyota</a></span></div>
        <div class="rst-ocb-i-d-l-i-s-y">2015</div>
      </div>
      <div class="rst-ocb-i">
        <div class="rst-ocb-i-d-l-i-s-p">$9,000</div>
        <div class="rst-ocb-i-h"><span><a class="rst-ocb-i-a" href="/auto/2.html">Toyota</a></span></div>
        <div class="rst-ocb-i-d-l-i-s-y">2008</div>
      </div>
    `;
    const ads = parseRst(html, 'Toyota Camry', mockRates, 2010, 2016);
    assert.strictEqual(ads.length, 1);
    assert.strictEqual(ads[0].year, 2015);
  });

  await t.test('parseRst — ad without price is skipped', () => {
    const html = `
      <div class="rst-ocb-i">
        <div class="rst-ocb-i-d-l-i-s-p">Contact seller</div>
        <div class="rst-ocb-i-h"><span><a class="rst-ocb-i-a" href="/auto/1.html">Toyota</a></span></div>
        <div class="rst-ocb-i-d-l-i-s-y">2015</div>
      </div>
    `;
    const ads = parseRst(html, 'Toyota', mockRates, null, null);
    assert.strictEqual(ads.length, 0);
  });

  await t.test('parseRst — ad without href is skipped', () => {
    const html = `
      <div class="rst-ocb-i">
        <div class="rst-ocb-i-d-l-i-s-p">$10,000</div>
        <div class="rst-ocb-i-h"><span>Toyota Camry</span></div>
        <div class="rst-ocb-i-d-l-i-s-y">2015</div>
      </div>
    `;
    const ads = parseRst(html, 'Toyota', mockRates, null, null);
    assert.strictEqual(ads.length, 0);
  });

  await t.test('parseRst — empty HTML', () => {
    assert.strictEqual(parseRst('', 'Toyota', mockRates, null, null).length, 0);
  });

  // ═══════════════════════════════════════════════════════════
  // parseOlx
  // ═══════════════════════════════════════════════════════════

  await t.test('parseOlx — HTML DOM fallback (no NEXT_DATA)', () => {
    const html = `
      <div data-cy="l-card">
        <a href="/d/uk/obyavlenie/toyota-camry-ID123.html">Link</a>
        <h4>Toyota Camry</h4>
        <p data-testid="ad-price">10 000 $</p>
        <span class="css-123">2014 - 100 км</span>
        <img src="/img.jpg" />
      </div>
      <div data-cy="l-card">
        <a href="/d/uk/obyavlenie/toyota-camry-ID124.html">Link</a>
        <h4>Toyota Camry UAH</h4>
        <p data-testid="ad-price">400 000 грн.</p>
        <span class="css-123">2012 - 100 км</span>
        <img srcset="/img2.jpg 200w" />
      </div>
    `;
    const ads = parseOlx(html, 'Toyota Camry', mockRates, null, null);
    assert.strictEqual(ads.length, 2);
    assert.strictEqual(ads[0].priceOriginal, 10000);
    assert.strictEqual(ads[0].priceOriginalCurrency, 'USD');
    assert.strictEqual(ads[0].source, 'OLX.ua');
    assert.strictEqual(ads[1].priceOriginal, 400000);
    assert.strictEqual(ads[1].priceOriginalCurrency, 'UAH');
  });

  await t.test('parseOlx — NEXT_DATA path (props.pageProps.ads)', () => {
    const html = `
      <script id="__NEXT_DATA__">${JSON.stringify({
        props: { pageProps: { ads: [
          { id: 'olx1', title: 'Toyota Camry 2014', url: 'https://olx.ua/d/123',
            params: [
              { key: 'price', value: { value: 10000 } },
              { key: 'motor_year', value: { key: '2014' } }
            ],
            photos: ['https://img.olx.ua/1.jpg']
          }
        ]}}
      })}</script>
    `;
    const ads = parseOlx(html, 'Toyota Camry', mockRates, null, null);
    assert.strictEqual(ads.length, 1);
    assert.strictEqual(ads[0].id, 'olx_olx1');
    assert.strictEqual(ads[0].year, 2014);
    assert.strictEqual(ads[0].priceEur, Math.round(10000 * 0.9));
  });

  await t.test('parseOlx — year filter applied on NEXT_DATA', () => {
    const html = `
      <script id="__NEXT_DATA__">${JSON.stringify({
        props: { pageProps: { ads: [
          { id: '1', title: 'T1', url: 'u1', params: [{ key: 'price', value: { value: 5000 } }, { key: 'motor_year', value: { key: '2010' } }], photos: [] },
          { id: '2', title: 'T2', url: 'u2', params: [{ key: 'price', value: { value: 6000 } }, { key: 'motor_year', value: { key: '2016' } }], photos: [] },
        ]}}
      })}</script>
    `;
    const ads = parseOlx(html, 'Toyota', mockRates, 2009, 2011);
    assert.strictEqual(ads.length, 1);
    assert.strictEqual(ads[0].year, 2010);
  });

  await t.test('parseOlx — year filter applied on DOM fallback', () => {
    const html = `
      <div data-cy="l-card">
        <a href="/d/uk/obyavlenie/toyota-ID1.html">L</a><h4>Toyota</h4>
        <p data-testid="ad-price">5000 $</p>
        <span class="css-1">2014</span><img src="/i.jpg"/>
      </div>
      <div data-cy="l-card">
        <a href="/d/uk/obyavlenie/toyota-ID2.html">L</a><h4>Toyota</h4>
        <p data-testid="ad-price">6000 $</p>
        <span class="css-1">2018</span><img src="/i2.jpg"/>
      </div>
    `;
    const ads = parseOlx(html, 'Toyota', mockRates, 2013, 2015);
    assert.strictEqual(ads.length, 1);
    assert.strictEqual(ads[0].year, 2014);
  });

  await t.test('parseOlx — empty HTML', () => {
    assert.strictEqual(parseOlx('', 'Toyota', mockRates, null, null).length, 0);
  });

  // ═══════════════════════════════════════════════════════════
  // parseCarzone
  // ═══════════════════════════════════════════════════════════

  await t.test('parseCarzone — stock-summary-item elements', () => {
    const html = `
      <stock-summary-item>
        <div class="price">€ 15,500</div>
        <a href="/used-cars/toyota/camry/123">Link</a>
        <div>Toyota Camry 2015</div>
        <img src="img.jpg" />
      </stock-summary-item>
      <stock-summary-item>
        <div class="price">€ 10,000</div>
        <a href="/used-cars/toyota/camry/124">Link</a>
        <div>Toyota Camry 2008</div>
        <div style="background-image: url('img2.jpg')"></div>
      </stock-summary-item>
    `;
    const ads = parseCarzone(html, 'Toyota', 'Camry', null, null);
    assert.strictEqual(ads.length, 2);
    assert.strictEqual(ads[0].priceEur, 15500);
    assert.strictEqual(ads[0].source, 'Carzone');
    assert.strictEqual(ads[1].priceEur, 10000);
  });

  await t.test('parseCarzone — year filter', () => {
    const html = `
      <stock-summary-item>
        <div class="price">€ 15,500</div>
        <a href="/used-cars/toyota/123">Link</a>
        <div>Toyota 2015</div>
      </stock-summary-item>
      <stock-summary-item>
        <div class="price">€ 10,000</div>
        <a href="/used-cars/toyota/124">Link</a>
        <div>Toyota 2008</div>
      </stock-summary-item>
    `;
    const ads = parseCarzone(html, 'Toyota', 'Camry', 2010, 2016);
    assert.strictEqual(ads.length, 1);
    assert.strictEqual(ads[0].year, 2015);
  });

  await t.test('parseCarzone — fallback selectors (listing-card class)', () => {
    const html = `
      <div class="listing-card">
        <div class="price">€ 12,000</div>
        <a href="/used-cars/toyota/789">Link</a>
        <div>Toyota Camry 2016</div>
        <img src="fallback.jpg" />
      </div>
    `;
    const ads = parseCarzone(html, 'Toyota', 'Camry', null, null);
    assert.strictEqual(ads.length, 1);
    assert.strictEqual(ads[0].priceEur, 12000);
  });

  await t.test('parseCarzone — ad without price is skipped', () => {
    const html = `
      <stock-summary-item>
        <div>No price here</div>
        <a href="/used-cars/toyota/123">Link</a>
        <div>Toyota 2015</div>
      </stock-summary-item>
    `;
    const ads = parseCarzone(html, 'Toyota', 'Camry', null, null);
    assert.strictEqual(ads.length, 0);
  });

  await t.test('parseCarzone — empty HTML', () => {
    assert.strictEqual(parseCarzone('', 'Toyota', 'Camry', null, null).length, 0);
  });

  // ═══════════════════════════════════════════════════════════
  // parseCarsIreland
  // ═══════════════════════════════════════════════════════════

  await t.test('parseCarsIreland — Angular ng-star-inserted', () => {
    const html = `
      <div class="listing ng-star-inserted">
        <div class="price">€ 12,000</div>
        <a href="/used-cars/toyota/123">Link</a>
        <div>Toyota Camry 2014</div>
        <span style="background-image: url('img.jpg')"></span>
      </div>
      <div class="listing ng-star-inserted">
        <div class="price">€ 8,000</div>
        <a href="/used-cars/toyota/124">Link</a>
        <div>Toyota Camry 2005</div>
      </div>
    `;
    const ads = parseCarsIreland(html, 'Toyota', 'Camry', null, null);
    assert.strictEqual(ads.length, 2);
    assert.strictEqual(ads[0].priceEur, 12000);
    assert.strictEqual(ads[0].source, 'CarsIreland');
    assert.ok(ads[0].photos.length > 0); // has bg image
    assert.strictEqual(ads[1].photos.length, 0); // no image
  });

  await t.test('parseCarsIreland — year filter', () => {
    const html = `
      <div class="listing ng-star-inserted">
        <div class="price">€ 12,000</div><a href="/1">L</a><div>Toyota 2014</div>
      </div>
      <div class="listing ng-star-inserted">
        <div class="price">€ 8,000</div><a href="/2">L</a><div>Toyota 2005</div>
      </div>
    `;
    const ads = parseCarsIreland(html, 'Toyota', 'Camry', 2010, 2015);
    assert.strictEqual(ads.length, 1);
    assert.strictEqual(ads[0].year, 2014);
  });

  await t.test('parseCarsIreland — fallback selectors (listing-card class)', () => {
    const html = `
      <div class="listing-card">
        <div class="price">€ 9,500</div>
        <a href="/used-cars/toyota/555">Link</a>
        <div>Toyota 2018</div>
        <img src="fallback.jpg" />
      </div>
    `;
    const ads = parseCarsIreland(html, 'Toyota', 'Camry', null, null);
    assert.strictEqual(ads.length, 1);
    assert.strictEqual(ads[0].priceEur, 9500);
  });

  await t.test('parseCarsIreland — empty HTML', () => {
    assert.strictEqual(parseCarsIreland('', 'Toyota', 'Camry', null, null).length, 0);
  });

  // ═══════════════════════════════════════════════════════════
  // parseCarsUa
  // ═══════════════════════════════════════════════════════════

  await t.test('parseCarsUa — ticket-item elements', () => {
    const html = `
      <div class="ticket-item">
        <div class="price-ticket" data-main-price="10500"></div>
        <div class="ticket-title"><a href="/auto_123.html">Toyota Camry 2015</a></div>
        <div class="ticket-photo"><img src="img.jpg" /></div>
        <div class="descriptions-ticket">Auto from Kyiv</div>
      </div>
      <div class="ticket-item">
        <div class="size22">5000 $</div>
        <div class="ticket-title"><a href="/auto_124.html">Toyota Camry 2002</a></div>
        <div class="ticket-photo"><img src="img2.jpg" /></div>
      </div>
    `;
    const ads = parseCarsUa(html, 'Toyota', 'Camry', mockRates, null, null);
    assert.strictEqual(ads.length, 2);
    assert.strictEqual(ads[0].priceOriginal, 10500);
    assert.strictEqual(ads[0].source, 'CARS.ua');
    assert.strictEqual(ads[1].priceOriginal, 5000);
  });

  await t.test('parseCarsUa — year filter', () => {
    const html = `
      <div class="ticket-item">
        <div class="price-ticket" data-main-price="10500"></div>
        <div class="ticket-title"><a href="/auto_123.html">Toyota 2015</a></div>
      </div>
      <div class="ticket-item">
        <div class="price-ticket" data-main-price="5000"></div>
        <div class="ticket-title"><a href="/auto_124.html">Toyota 2002</a></div>
      </div>
    `;
    const ads = parseCarsUa(html, 'Toyota', 'Camry', mockRates, 2010, 2016);
    assert.strictEqual(ads.length, 1);
    assert.strictEqual(ads[0].year, 2015);
  });

  await t.test('parseCarsUa — empty HTML', () => {
    assert.strictEqual(parseCarsUa('', 'Toyota', 'Camry', mockRates, null, null).length, 0);
  });

  // ═══════════════════════════════════════════════════════════
  // parseDoneDeal (NEXT_DATA)
  // ═══════════════════════════════════════════════════════════

  await t.test('parseDoneDeal — props.pageProps.ads path', () => {
    const json = JSON.stringify({
      props: { pageProps: { ads: [
        { id: 123, title: 'Toyota Camry 2015', url: '/cars/123',
          priceInfo: { priceInEuro: 15000 }, year: '2015', mileageInKm: 100000 },
        { id: 124, header: 'Toyota Camry 2005', friendlyUrl: '/cars/124',
          price: '€5,000', metaInfo: ['2005', 'Diesel', '50,000 mi'] }
      ]}}
    });
    const ads = parseDoneDeal(json, 'Toyota Camry', null, null);
    assert.strictEqual(ads.length, 2);
    assert.strictEqual(ads[0].priceEur, 15000);
    assert.strictEqual(ads[0].year, 2015);
    assert.strictEqual(ads[0].mileageKm, 100000);
    assert.strictEqual(ads[1].priceEur, 5000);
    assert.strictEqual(ads[1].year, 2005);
  });

  await t.test('parseDoneDeal — year filter', () => {
    const json = JSON.stringify({
      props: { pageProps: { ads: [
        { id: 1, title: 'T1', priceInfo: { priceInEuro: 10000 }, year: '2015' },
        { id: 2, title: 'T2', priceInfo: { priceInEuro: 8000 }, year: '2005' },
      ]}}
    });
    const ads = parseDoneDeal(json, 'Toyota', 2010, 2016);
    assert.strictEqual(ads.length, 1);
    assert.strictEqual(ads[0].year, 2015);
  });

  await t.test('parseDoneDeal — displayAttributes fallback for price/year/mileage/make/model', () => {
    const json = JSON.stringify({
      props: { pageProps: { ads: [
        { id: 999, title: 'Test Car',
          displayAttributes: [
            { name: 'price', value: '€12,000' },
            { name: 'year', value: '2018' },
            { name: 'mileage', value: '50000 km' },
            { name: 'make', value: 'Honda' },
            { name: 'model', value: 'Civic' },
          ],
          gallery: { coverImage: { large: 'https://img.dd.ie/large.jpg' } },
          friendlyUrl: '/cars/999',
          county: 'Dublin',
        }
      ]}}
    });
    const ads = parseDoneDeal(json, 'Honda Civic', null, null);
    assert.strictEqual(ads.length, 1);
    assert.strictEqual(ads[0].priceEur, 12000);
    assert.strictEqual(ads[0].year, 2018);
    assert.strictEqual(ads[0].mileageKm, 50000);
    assert.strictEqual(ads[0].make, 'Honda');
    assert.strictEqual(ads[0].model, 'Civic');
    assert.strictEqual(ads[0].location, 'Dublin');
    assert.ok(ads[0].photos.length > 0);
  });

  await t.test('parseDoneDeal — mileage in miles converted to km', () => {
    const json = JSON.stringify({
      props: { pageProps: { ads: [
        { id: 1, title: 'T', priceInfo: { priceInEuro: 5000 }, year: '2015',
          displayAttributes: [{ name: 'mileage', value: '50000 mi' }]
        }
      ]}}
    });
    const ads = parseDoneDeal(json, 'T', null, null);
    assert.strictEqual(ads[0].mileageKm, Math.round(50000 * 1.60934));
  });

  await t.test('parseDoneDeal — null/empty script content', () => {
    assert.strictEqual(parseDoneDeal(null, 'T', null, null).length, 0);
    assert.strictEqual(parseDoneDeal('', 'T', null, null).length, 0);
  });

  await t.test('parseDoneDeal — invalid JSON', () => {
    assert.strictEqual(parseDoneDeal('not json', 'T', null, null).length, 0);
  });

  await t.test('parseDoneDeal — alternative path: initialProps.ads', () => {
    const json = JSON.stringify({
      props: { pageProps: { initialProps: { ads: [
        { id: 1, title: 'Test', priceInfo: { priceInEuro: 5000 }, year: '2020' }
      ]}}}
    });
    const ads = parseDoneDeal(json, 'T', null, null);
    assert.strictEqual(ads.length, 1);
    assert.strictEqual(ads[0].priceEur, 5000);
  });

  await t.test('parseDoneDeal — alternative path: searchResults.ads', () => {
    const json = JSON.stringify({
      props: { pageProps: { searchResults: { ads: [
        { id: 2, title: 'Test2', priceInfo: { priceInEuro: 7000 }, year: '2019' }
      ]}}}
    });
    const ads = parseDoneDeal(json, 'T', null, null);
    assert.strictEqual(ads.length, 1);
    assert.strictEqual(ads[0].priceEur, 7000);
  });

  // ═══════════════════════════════════════════════════════════
  // parseDoneDealHtml (DOM fallback)
  // ═══════════════════════════════════════════════════════════

  await t.test('parseDoneDealHtml — card elements with links and prices', () => {
    const html = `
      <a href="/cars/12345678">
        <div>Toyota Corolla 2016</div>
        <span>€12,500</span>
        <img src="https://img.dd.ie/photo.jpg" />
      </a>
      <a href="/cars/87654321">
        <div>Honda Civic 2018</div>
        <span>€15,000</span>
      </a>
    `;
    const ads = parseDoneDealHtml(html, 'Toyota', null, null);
    assert.strictEqual(ads.length, 2);
    assert.strictEqual(ads[0].priceEur, 12500);
    assert.strictEqual(ads[0].year, 2016);
    assert.strictEqual(ads[0].source, 'DoneDeal');
    assert.strictEqual(ads[1].priceEur, 15000);
    assert.strictEqual(ads[1].year, 2018);
  });

  await t.test('parseDoneDealHtml — year filter', () => {
    const html = `
      <a href="/cars/111"><span>€10,000</span><div>Car 2016</div></a>
      <a href="/cars/222"><span>€8,000</span><div>Car 2010</div></a>
    `;
    const ads = parseDoneDealHtml(html, 'Car', 2015, 2020);
    assert.strictEqual(ads.length, 1);
    assert.strictEqual(ads[0].year, 2016);
  });

  await t.test('parseDoneDealHtml — no price = skipped', () => {
    const html = `<a href="/cars/111"><div>Car without price 2016</div></a>`;
    const ads = parseDoneDealHtml(html, 'Car', null, null);
    assert.strictEqual(ads.length, 0);
  });

  await t.test('parseDoneDealHtml — empty HTML', () => {
    assert.strictEqual(parseDoneDealHtml('', 'T', null, null).length, 0);
  });
});
