import { describe, it } from 'node:test';
import assert from 'node:assert';
import { deduplicateAds } from '../server/services/dedupService.js';

describe('deduplicateAds', () => {
  it('should merge ads with same year and similar price', () => {
    const ads = [
      { id: '1', source: 'RST.ua', make: 'Toyota', model: 'Corolla', year: 2012, priceOriginal: 7400, photos: ['img1.jpg'] },
      { id: '2', source: 'OLX.ua', make: 'Toyota', model: 'Corolla', year: 2012, priceOriginal: 7300, photos: ['img2.jpg'] }, 
      { id: '3', source: 'AUTO.RIA', make: 'Toyota', model: 'Corolla', year: 2015, priceOriginal: 12000, photos: ['img3.jpg'] }
    ];

    const deduped = deduplicateAds(ads);
    assert.strictEqual(deduped.length, 2);
    
    const mergedAd = deduped.find(ad => ad.id === '1');
    assert.ok(mergedAd.source.includes('RST.ua'));
    assert.ok(mergedAd.source.includes('OLX.ua'));
    assert.strictEqual(mergedAd.photos.length, 2);
  });

  it('should not merge if year is different', () => {
    const ads = [
      { id: '1', source: 'RST.ua', year: 2012, priceOriginal: 7400, photos: [] },
      { id: '2', source: 'OLX.ua', year: 2013, priceOriginal: 7400, photos: [] }
    ];

    const deduped = deduplicateAds(ads);
    assert.strictEqual(deduped.length, 2);
  });

  it('should not merge if price difference > 5%', () => {
    const ads = [
      { id: '1', source: 'RST.ua', year: 2012, priceOriginal: 7400, photos: [] },
      { id: '2', source: 'OLX.ua', year: 2012, priceOriginal: 8000, photos: [] } // 8000 * 0.05 = 400. 8000 - 7400 = 600 > 400
    ];

    const deduped = deduplicateAds(ads);
    assert.strictEqual(deduped.length, 2);
  });

  it('should handle null years gracefully', () => {
    const ads = [
      { id: '1', source: 'RST.ua', year: null, priceOriginal: 7400, photos: [] },
      { id: '2', source: 'OLX.ua', year: 2012, priceOriginal: 7400, photos: [] }
    ];

    const deduped = deduplicateAds(ads);
    // Our logic allows merging if one year is null
    assert.strictEqual(deduped.length, 1);
  });
});
