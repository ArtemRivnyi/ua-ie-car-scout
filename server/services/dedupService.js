/**
 * Deduplicates car listings by merging those that represent the same physical car.
 * 
 * Strategy (tightened to avoid false merges):
 * - Only dedup ACROSS different sources (never merge two ads from same source)
 * - If both ads have mileage: require year + price within 3% + mileage within 5,000 km
 * - If one/both lack mileage: require year match + price within 2% (stricter)
 * - Never merge if source URLs are from the same domain
 * 
 * @param {Array} ads - List of ad objects
 * @returns {Array} - Deduplicated ads
 */
export function deduplicateAds(ads) {
  const uniqueAds = [];
  
  for (const ad of ads) {
    const duplicateOf = uniqueAds.find(u => {
      // RULE: Never merge ads from the same source (same site = different cars)
      if (isSameSource(u.source, ad.source)) return false;

      // RULE: Strict year match — both must have year and it must match
      if (!u.year || !ad.year || u.year !== ad.year) return false;
      
      // RULE: Price similarity
      const maxPrice = Math.max(u.priceOriginal, ad.priceOriginal);
      if (maxPrice === 0) return false;
      const priceDiff = Math.abs(u.priceOriginal - ad.priceOriginal);

      // If both have mileage data, use relaxed price (3%) + mileage check
      if (u.mileageKm && ad.mileageKm) {
        const isPriceSimilar = priceDiff <= (maxPrice * 0.03);
        if (!isPriceSimilar) return false;
        
        const mileageDiff = Math.abs(u.mileageKm - ad.mileageKm);
        if (mileageDiff > 5000) return false;
        
        return true;
      }

      // If one/both lack mileage, require tighter price match (2%)
      const isPriceSimilar = priceDiff <= (maxPrice * 0.02);
      return isPriceSimilar;
    });
    
    if (duplicateOf) {
      // Merge: append source name and collect unique photos
      if (!duplicateOf.source.includes(ad.source)) {
        duplicateOf.source += `, ${ad.source}`;
      }
      const newPhotos = ad.photos.filter(p => !duplicateOf.photos.includes(p));
      duplicateOf.photos = [...duplicateOf.photos, ...newPhotos];
      // Keep the richer data (prefer ad with mileage)
      if (!duplicateOf.mileageKm && ad.mileageKm) {
        duplicateOf.mileageKm = ad.mileageKm;
      }
      if (!duplicateOf.location && ad.location) {
        duplicateOf.location = ad.location;
      }
    } else {
      uniqueAds.push(ad);
    }
  }
  
  return uniqueAds;
}

/**
 * Check if two source strings refer to the same marketplace.
 * Handles compound sources like "DoneDeal, Carzone".
 */
function isSameSource(source1, source2) {
  // Extract primary source names (before any comma from previous merges)
  const primary1 = source1.split(',')[0].trim().toLowerCase();
  const primary2 = source2.split(',')[0].trim().toLowerCase();
  return primary1 === primary2;
}
