/**
 * Deduplicates car listings by merging those that represent the same physical car.
 * 
 * @param {Array} ads - List of ad objects
 * @returns {Array} - Deduplicated ads
 */
export function deduplicateAds(ads) {
  const uniqueAds = [];
  
  for (const ad of ads) {
    const duplicateOf = uniqueAds.find(u => {
      // Strict year match if both have it
      if (u.year !== ad.year && u.year && ad.year) return false; 
      
      const priceDiff = Math.abs(u.priceOriginal - ad.priceOriginal);
      const isPriceSimilar = priceDiff <= (Math.max(u.priceOriginal, ad.priceOriginal) * 0.05); 
      
      if (!isPriceSimilar) return false;
      
      if (u.mileageKm && ad.mileageKm) {
        const mileageDiff = Math.abs(u.mileageKm - ad.mileageKm);
        if (mileageDiff > 10000) return false; 
      }
      
      // Basic make/model similarity could be added, but we assume
      // the filter already restricted it to the requested make/model.
      
      return true; 
    });
    
    if (duplicateOf) {
      if (!duplicateOf.source.includes(ad.source)) {
        duplicateOf.source += `, ${ad.source}`;
      }
      const newPhotos = ad.photos.filter(p => !duplicateOf.photos.includes(p));
      duplicateOf.photos = [...duplicateOf.photos, ...newPhotos];
    } else {
      uniqueAds.push(ad);
    }
  }
  
  return uniqueAds;
}
