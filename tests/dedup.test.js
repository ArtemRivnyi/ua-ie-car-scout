/**
 * dedup.test.js — 100% coverage tests for dedupService
 *
 * Tests the tightened dedup logic:
 *  - Cross-source dedup only (same source never merges)
 *  - Year match required
 *  - Price + mileage thresholds
 *  - Photo and data enrichment on merge
 */
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { deduplicateAds } from '../server/services/dedupService.js';

describe('deduplicateAds — core dedup logic', () => {

  // ── Merge scenarios ───────────────────────────────────────

  it('should merge ads from DIFFERENT sources with same year and similar price (within 2%)', () => {
    const ads = [
      { id: '1', source: 'RST.ua', year: 2012, priceOriginal: 7400, photos: ['img1.jpg'] },
      { id: '2', source: 'OLX.ua', year: 2012, priceOriginal: 7500, photos: ['img2.jpg'] }, // 1.35% diff
    ];
    const deduped = deduplicateAds(ads);
    assert.strictEqual(deduped.length, 1);
    assert.ok(deduped[0].source.includes('RST.ua'));
    assert.ok(deduped[0].source.includes('OLX.ua'));
    assert.strictEqual(deduped[0].photos.length, 2);
  });

  it('should merge with mileage match (within 5000km, price within 3%)', () => {
    const ads = [
      { id: '1', source: 'DoneDeal', year: 2015, priceOriginal: 10000, mileageKm: 80000, photos: [] },
      { id: '2', source: 'Carzone',  year: 2015, priceOriginal: 10200, mileageKm: 82000, photos: ['img.jpg'] }, // 2% price, 2000km
    ];
    const deduped = deduplicateAds(ads);
    assert.strictEqual(deduped.length, 1);
    assert.ok(deduped[0].source.includes('DoneDeal'));
    assert.ok(deduped[0].source.includes('Carzone'));
  });

  // ── No-merge scenarios ────────────────────────────────────

  it('should NOT merge ads from the SAME source (different cars on same site)', () => {
    const ads = [
      { id: '1', source: 'RST.ua', year: 2012, priceOriginal: 7400, photos: [] },
      { id: '2', source: 'RST.ua', year: 2012, priceOriginal: 7400, photos: [] },
    ];
    const deduped = deduplicateAds(ads);
    assert.strictEqual(deduped.length, 2);
  });

  it('should NOT merge if year is different', () => {
    const ads = [
      { id: '1', source: 'RST.ua', year: 2012, priceOriginal: 7400, photos: [] },
      { id: '2', source: 'OLX.ua', year: 2013, priceOriginal: 7400, photos: [] },
    ];
    const deduped = deduplicateAds(ads);
    assert.strictEqual(deduped.length, 2);
  });

  it('should NOT merge if either year is null', () => {
    const ads = [
      { id: '1', source: 'RST.ua', year: null, priceOriginal: 7400, photos: [] },
      { id: '2', source: 'OLX.ua', year: 2012, priceOriginal: 7400, photos: [] },
    ];
    const deduped = deduplicateAds(ads);
    assert.strictEqual(deduped.length, 2);
  });

  it('should NOT merge if both years are null', () => {
    const ads = [
      { id: '1', source: 'RST.ua', year: null, priceOriginal: 7400, photos: [] },
      { id: '2', source: 'OLX.ua', year: null, priceOriginal: 7400, photos: [] },
    ];
    const deduped = deduplicateAds(ads);
    assert.strictEqual(deduped.length, 2);
  });

  it('should NOT merge if price difference > 2% (no mileage)', () => {
    const ads = [
      { id: '1', source: 'RST.ua', year: 2012, priceOriginal: 7400, photos: [] },
      { id: '2', source: 'OLX.ua', year: 2012, priceOriginal: 7700, photos: [] }, // ~4% diff → > 2%
    ];
    const deduped = deduplicateAds(ads);
    assert.strictEqual(deduped.length, 2);
  });

  it('should NOT merge if price difference > 3% (with mileage)', () => {
    const ads = [
      { id: '1', source: 'DoneDeal', year: 2015, priceOriginal: 10000, mileageKm: 80000, photos: [] },
      { id: '2', source: 'Carzone',  year: 2015, priceOriginal: 10500, mileageKm: 80500, photos: [] }, // 5% price
    ];
    const deduped = deduplicateAds(ads);
    assert.strictEqual(deduped.length, 2);
  });

  it('should NOT merge if mileage difference > 5000km', () => {
    const ads = [
      { id: '1', source: 'DoneDeal', year: 2015, priceOriginal: 10000, mileageKm: 80000, photos: [] },
      { id: '2', source: 'Carzone',  year: 2015, priceOriginal: 10100, mileageKm: 90000, photos: [] }, // 10000km diff
    ];
    const deduped = deduplicateAds(ads);
    assert.strictEqual(deduped.length, 2);
  });

  it('should NOT merge if price is 0', () => {
    const ads = [
      { id: '1', source: 'RST.ua', year: 2012, priceOriginal: 0, photos: [] },
      { id: '2', source: 'OLX.ua', year: 2012, priceOriginal: 0, photos: [] },
    ];
    const deduped = deduplicateAds(ads);
    assert.strictEqual(deduped.length, 2);
  });

  // ── Data enrichment ───────────────────────────────────────

  it('should enrich merged ad with mileage from duplicate', () => {
    const ads = [
      { id: '1', source: 'RST.ua', year: 2012, priceOriginal: 7400, photos: [] },
      { id: '2', source: 'OLX.ua', year: 2012, priceOriginal: 7500, mileageKm: 120000, photos: [] },
    ];
    const deduped = deduplicateAds(ads);
    assert.strictEqual(deduped.length, 1);
    assert.strictEqual(deduped[0].mileageKm, 120000);
  });

  it('should enrich merged ad with location from duplicate', () => {
    const ads = [
      { id: '1', source: 'RST.ua', year: 2012, priceOriginal: 7400, photos: [] },
      { id: '2', source: 'OLX.ua', year: 2012, priceOriginal: 7500, location: 'Dublin', photos: [] },
    ];
    const deduped = deduplicateAds(ads);
    assert.strictEqual(deduped.length, 1);
    assert.strictEqual(deduped[0].location, 'Dublin');
  });

  it('should not overwrite existing mileage with duplicate mileage', () => {
    const ads = [
      { id: '1', source: 'RST.ua', year: 2012, priceOriginal: 7400, mileageKm: 100000, photos: [] },
      { id: '2', source: 'OLX.ua', year: 2012, priceOriginal: 7500, mileageKm: 102000, photos: [] },
    ];
    const deduped = deduplicateAds(ads);
    assert.strictEqual(deduped[0].mileageKm, 100000); // original kept
  });

  it('should deduplicate photos (no duplicates)', () => {
    const ads = [
      { id: '1', source: 'RST.ua', year: 2012, priceOriginal: 7400, photos: ['img1.jpg', 'shared.jpg'] },
      { id: '2', source: 'OLX.ua', year: 2012, priceOriginal: 7500, photos: ['shared.jpg', 'img2.jpg'] },
    ];
    const deduped = deduplicateAds(ads);
    assert.strictEqual(deduped[0].photos.length, 3); // img1, shared, img2
    assert.ok(deduped[0].photos.includes('img1.jpg'));
    assert.ok(deduped[0].photos.includes('shared.jpg'));
    assert.ok(deduped[0].photos.includes('img2.jpg'));
  });

  // ── Source string handling ────────────────────────────────

  it('should handle already-merged source strings (compound sources)', () => {
    const ads = [
      { id: '1', source: 'RST.ua, OLX.ua', year: 2012, priceOriginal: 7400, photos: [] },
      { id: '2', source: 'RST.ua', year: 2012, priceOriginal: 7400, photos: [] },
    ];
    // These share primary source 'RST.ua', so should NOT merge
    const deduped = deduplicateAds(ads);
    assert.strictEqual(deduped.length, 2);
  });

  // ── Multiple ads ──────────────────────────────────────────

  it('should correctly handle 5 ads with some duplicates', () => {
    const ads = [
      { id: '1', source: 'RST.ua',     year: 2012, priceOriginal: 7400, photos: [] },
      { id: '2', source: 'OLX.ua',     year: 2012, priceOriginal: 7500, photos: [] }, // dupe of 1
      { id: '3', source: 'AUTO.RIA',   year: 2015, priceOriginal: 12000, photos: [] },
      { id: '4', source: 'DoneDeal',   year: 2012, priceOriginal: 7400, photos: [] }, // dupe of 1 (cross-source)
      { id: '5', source: 'RST.ua',     year: 2012, priceOriginal: 7400, photos: [] }, // NOT dupe (same source as 1)
    ];
    const deduped = deduplicateAds(ads);
    // 1+2+4 merge → 1 ad, 3 stays, 5 stays (same source as 1)
    assert.strictEqual(deduped.length, 3);
  });

  // ── Empty input ───────────────────────────────────────────

  it('should handle empty array', () => {
    assert.strictEqual(deduplicateAds([]).length, 0);
  });

  it('should handle single ad', () => {
    const ads = [{ id: '1', source: 'RST.ua', year: 2012, priceOriginal: 7400, photos: [] }];
    assert.strictEqual(deduplicateAds(ads).length, 1);
  });
});
