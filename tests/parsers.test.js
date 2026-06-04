import test from 'node:test';
import assert from 'node:assert';
import { parseRst } from '../server/scrapers/rst.js';
import { parseOlx } from '../server/scrapers/olx.js';
import { parseCarzone } from '../server/scrapers/carzone.js';
import { parseCarsIreland } from '../server/scrapers/carsireland.js';
import { parseCarsUa } from '../server/scrapers/carsua.js';
import { parseDoneDeal } from '../server/scrapers/donedeal.js';

const mockRates = { usdToEur: 0.9, uahToEur: 0.025 };

test('Parser Unit Tests for 100% Coverage', async (t) => {

  await t.test('parseRst', () => {
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
    
    // Test without filters
    const adsAll = parseRst(html, 'Toyota Camry', mockRates, null, null);
    assert.strictEqual(adsAll.length, 2);
    assert.strictEqual(adsAll[0].priceOriginal, 10500);
    assert.strictEqual(adsAll[0].priceEur, Math.round(10500 * 0.9));

    // Test with filters
    const adsFiltered = parseRst(html, 'Toyota Camry', mockRates, 2010, 2016);
    assert.strictEqual(adsFiltered.length, 1);
    assert.strictEqual(adsFiltered[0].year, 2015);
  });

  await t.test('parseOlx', () => {
    const html = `
      <div data-cy="l-card">
        <a href="/d/uk/obyavlenie/toyota-camry-123.html">Link</a>
        <h4>Toyota Camry</h4>
        <p data-testid="ad-price">10 000 $</p>
        <span class="css-123">2014 - 100 км</span>
        <img src="/img.jpg" />
      </div>
      <div data-cy="l-card">
        <a href="/d/uk/obyavlenie/toyota-camry-124.html">Link</a>
        <h4>Toyota Camry UAH</h4>
        <p data-testid="ad-price">400 000 грн.</p>
        <span class="css-123">2012 - 100 км</span>
        <img srcset="/img2.jpg 200w" />
      </div>
    `;
    
    // Test without filters
    const adsAll = parseOlx(html, 'Toyota Camry', mockRates, null, null);
    assert.strictEqual(adsAll.length, 2);
    assert.strictEqual(adsAll[0].priceOriginal, 10000);
    assert.strictEqual(adsAll[0].priceOriginalCurrency, 'USD');
    assert.strictEqual(adsAll[1].priceOriginal, 400000);
    assert.strictEqual(adsAll[1].priceOriginalCurrency, 'UAH');
    
    // Test with filters
    const adsFiltered = parseOlx(html, 'Toyota Camry', mockRates, 2014, 2015);
    assert.strictEqual(adsFiltered.length, 1);
    assert.strictEqual(adsFiltered[0].year, 2014);
  });

  await t.test('parseCarzone', () => {
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
    
    // Test without filters
    const adsAll = parseCarzone(html, 'Toyota', 'Camry', null, null);
    assert.strictEqual(adsAll.length, 2);
    assert.strictEqual(adsAll[0].priceEur, 15500);
    
    // Test with filters
    const adsFiltered = parseCarzone(html, 'Toyota', 'Camry', 2010, 2016);
    assert.strictEqual(adsFiltered.length, 1);
    assert.strictEqual(adsFiltered[0].year, 2015);
  });

  await t.test('parseCarsIreland', () => {
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
    
    // Test without filters
    const adsAll = parseCarsIreland(html, 'Toyota', 'Camry', null, null);
    assert.strictEqual(adsAll.length, 2);
    assert.strictEqual(adsAll[0].priceEur, 12000);
    
    // Test with filters
    const adsFiltered = parseCarsIreland(html, 'Toyota', 'Camry', 2010, 2015);
    assert.strictEqual(adsFiltered.length, 1);
    assert.strictEqual(adsFiltered[0].year, 2014);
  });

  await t.test('parseCarsUa', () => {
    const html = `
      <div class="ticket-item">
        <div class="price-ticket" data-main-price="10500"></div>
        <div class="ticket-title"><a href="/auto_123.html">Toyota Camry 2015</a></div>
        <div class="ticket-photo"><img src="img.jpg" /></div>
      </div>
      <div class="ticket-item">
        <div class="size22">5000 $</div>
        <div class="ticket-title"><a href="/auto_124.html">Toyota Camry 2002</a></div>
        <div class="ticket-photo"><img src="img2.jpg" /></div>
      </div>
    `;
    
    // Test without filters
    const adsAll = parseCarsUa(html, 'Toyota', 'Camry', mockRates, null, null);
    assert.strictEqual(adsAll.length, 2);
    assert.strictEqual(adsAll[0].priceOriginal, 10500);
    assert.strictEqual(adsAll[1].priceOriginal, 5000);
    
    // Test with filters
    const adsFiltered = parseCarsUa(html, 'Toyota', 'Camry', mockRates, 2010, 2016);
    assert.strictEqual(adsFiltered.length, 1);
    assert.strictEqual(adsFiltered[0].year, 2015);
  });

  await t.test('parseDoneDeal', () => {
    const json = JSON.stringify({
      props: {
        pageProps: {
          ads: [
            {
              id: 123,
              title: 'Toyota Camry 2015',
              url: '/cars/123',
              priceInfo: { priceInEuro: 15000 },
              year: '2015',
              mileageInKm: 100000
            },
            {
              id: 124,
              header: 'Toyota Camry 2005',
              friendlyUrl: '/cars/124',
              price: '€5,000',
              metaInfo: ['2005', 'Diesel', '50,000 mi']
            }
          ]
        }
      }
    });
    
    // Test without filters
    const adsAll = parseDoneDeal(json, 'Toyota Camry', null, null);
    assert.strictEqual(adsAll.length, 2);
    assert.strictEqual(adsAll[0].priceEur, 15000);
    assert.strictEqual(adsAll[1].priceEur, 5000);
    assert.strictEqual(adsAll[1].year, 2005);
    
    // Test with filters
    const adsFiltered = parseDoneDeal(json, 'Toyota Camry', 2010, 2016);
    assert.strictEqual(adsFiltered.length, 1);
    assert.strictEqual(adsFiltered[0].year, 2015);
  });
});
