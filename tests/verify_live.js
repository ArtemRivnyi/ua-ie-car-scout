async function verifyEndpoint(url) {
  console.log(`\nTesting: ${url}`);
  try {
    const res = await fetch(`http://localhost:3001${url}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    
    console.log(`Results: ${data.listings.length} cars`);
    if (data.listings.length > 0) {
      // Check for images
      const withoutImages = data.listings.filter(l => !l.photos || l.photos.length === 0);
      console.log(`  - Cars without images: ${withoutImages.length}`);
      
      // Check years
      const years = data.listings.map(l => l.year).filter(y => y !== null);
      if (years.length > 0) {
        console.log(`  - Year range found: ${Math.min(...years)} - ${Math.max(...years)}`);
      } else {
        console.log(`  - NO YEARS FOUND IN ANY LISTING!`);
      }
      
      // Look at first listing
      console.log(`  - Sample [1]: ${data.listings[0].source} | ${data.listings[0].year} | ${data.listings[0].make} ${data.listings[0].model} | ${data.listings[0].priceEur} EUR | Photos: ${data.listings[0].photos?.length}`);
    }
  } catch (err) {
    console.error(`Error testing ${url}:`, err.message);
  }
}

async function run() {
  console.log('--- STARTING LIVE API VERIFICATION ---');
  // UA Tests
  await verifyEndpoint('/api/scrape/ua?sources=rst&query=Toyota+Camry&yearFrom=2012&yearTo=2015');
  await verifyEndpoint('/api/scrape/ua?sources=olx&query=Toyota+Camry&yearFrom=2012&yearTo=2015');
  await verifyEndpoint('/api/scrape/ua?sources=rst,olx&query=Toyota+Camry&yearFrom=2012&yearTo=2015');
  
  // IE Tests
  await verifyEndpoint('/api/scrape/ie?sources=donedeal&make=Toyota&model=Camry&yearFrom=2012&yearTo=2015');
  await verifyEndpoint('/api/scrape/ie?sources=carzone&make=Toyota&model=Camry&yearFrom=2012&yearTo=2015');
  await verifyEndpoint('/api/scrape/ie?sources=carsireland&make=Toyota&model=Camry&yearFrom=2012&yearTo=2015');
  await verifyEndpoint('/api/scrape/ie?sources=donedeal,carzone,carsireland&make=Toyota&model=Camry&yearFrom=2012&yearTo=2015');
  
  console.log('\n--- VERIFICATION COMPLETE ---');
}

run();
