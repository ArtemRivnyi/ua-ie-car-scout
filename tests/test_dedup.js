import fs from 'fs';

// Quick mock of deduplicateAds from index.js
function deduplicateAds(ads) {
  const uniqueAds = [];
  
  for (const ad of ads) {
    const duplicateOf = uniqueAds.find(u => {
      if (u.year !== ad.year && u.year && ad.year) return false; 
      
      const priceDiff = Math.abs(u.priceOriginal - ad.priceOriginal);
      const isPriceSimilar = priceDiff <= (Math.max(u.priceOriginal, ad.priceOriginal) * 0.05); 
      
      if (!isPriceSimilar) return false;
      
      if (u.mileageKm && ad.mileageKm) {
        const mileageDiff = Math.abs(u.mileageKm - ad.mileageKm);
        if (mileageDiff > 10000) return false; 
      }
      
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

const ads = [
  { id: '1', source: 'RST.ua', make: 'Toyota', model: 'Corolla', year: 2012, priceOriginal: 7400, photos: ['img1.jpg'] },
  { id: '2', source: 'OLX.ua', make: 'Toyota', model: 'Corolla', year: 2012, priceOriginal: 7300, photos: ['img2.jpg'] }, // Should deduplicate
  { id: '3', source: 'AUTO.RIA', make: 'Toyota', model: 'Corolla', year: 2015, priceOriginal: 12000, photos: ['img3.jpg'] }
];

console.log('Original ads count:', ads.length);
const deduped = deduplicateAds(ads);
console.log('Deduped ads count:', deduped.length);
console.log('Deduped ads:', JSON.stringify(deduped, null, 2));
