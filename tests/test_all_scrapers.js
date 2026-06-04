/**
 * E2E Test: Verify all scraper endpoints work correctly.
 * Tests each source individually and in combinations.
 * 
 * Run: node tests/test_all_scrapers.js
 */

const API = 'http://localhost:3001/api';

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function testEndpoint(name, url) {
  try {
    const start = Date.now();
    const res = await fetch(url);
    const elapsed = Date.now() - start;
    
    if (!res.ok) {
      console.log(`  ❌ ${name}: HTTP ${res.status} (${elapsed}ms)`);
      return { name, ok: false, error: `HTTP ${res.status}` };
    }
    
    const data = await res.json();
    const count = data.listings?.length || 0;
    const hasStats = !!data.stats;
    
    console.log(`  ${count > 0 ? '✅' : '⚠️'} ${name}: ${count} listings, stats: ${hasStats} (${elapsed}ms)`);
    return { name, ok: true, count, hasStats, elapsed };
  } catch (err) {
    console.log(`  ❌ ${name}: ${err.message}`);
    return { name, ok: false, error: err.message };
  }
}

async function main() {
  console.log('\n🚗 UA→IE Car Scout — Comprehensive Scraper Test\n');
  console.log('='.repeat(60));
  
  // Test health
  console.log('\n1. Health Check:');
  await testEndpoint('Health', `${API}/health`);
  
  // Test UA scrapers individually
  console.log('\n2. UA Scrapers (individual):');
  const uaResults = {};
  
  uaResults.rst = await testEndpoint('RST.ua only', 
    `${API}/scrape/ua?sources=rst&query=Toyota&yearFrom=1980&yearTo=2000`);
  
  uaResults.carsua = await testEndpoint('CARS.ua only', 
    `${API}/scrape/ua?sources=carsua&query=Toyota&yearFrom=1980&yearTo=2000`);
  
  uaResults.olx = await testEndpoint('OLX.ua only', 
    `${API}/scrape/ua?sources=olx&query=Toyota&yearFrom=1980&yearTo=2000`);
  
  // Test IE scrapers individually
  console.log('\n3. IE Scrapers (individual):');
  const ieResults = {};
  
  ieResults.donedeal = await testEndpoint('DoneDeal only', 
    `${API}/scrape/ie?sources=donedeal&make=Toyota&model=&yearFrom=1990&yearTo=2005`);
  
  ieResults.carsireland = await testEndpoint('CarsIreland only', 
    `${API}/scrape/ie?sources=carsireland&make=Toyota&model=&yearFrom=1990&yearTo=2005`);
  
  ieResults.carzone = await testEndpoint('Carzone only', 
    `${API}/scrape/ie?sources=carzone&make=Toyota&model=&yearFrom=1990&yearTo=2005`);
  
  // Test combinations
  console.log('\n4. Combinations:');
  
  await testEndpoint('RST + CARS.ua', 
    `${API}/scrape/ua?sources=rst,carsua&query=Toyota&yearFrom=1980&yearTo=2000`);
  
  await testEndpoint('RST + OLX', 
    `${API}/scrape/ua?sources=rst,olx&query=Toyota&yearFrom=1980&yearTo=2000`);
  
  await testEndpoint('All UA (rst+carsua+olx)', 
    `${API}/scrape/ua?sources=rst,carsua,olx&query=Toyota&yearFrom=1980&yearTo=2000`);
  
  await testEndpoint('DoneDeal + CarsIreland', 
    `${API}/scrape/ie?sources=donedeal,carsireland&make=Toyota&model=&yearFrom=1990&yearTo=2005`);
  
  await testEndpoint('DoneDeal + Carzone', 
    `${API}/scrape/ie?sources=donedeal,carzone&make=Toyota&model=&yearFrom=1990&yearTo=2005`);
  
  await testEndpoint('All IE (donedeal+carsireland+carzone)', 
    `${API}/scrape/ie?sources=donedeal,carsireland,carzone&make=Toyota&model=&yearFrom=1990&yearTo=2005`);
  
  // Test cross-market comparison scenario (CARS.ua + CarsIreland)
  console.log('\n5. Cross-market (UA + IE in parallel — simulating frontend):');
  
  const [uaCross, ieCross] = await Promise.all([
    testEndpoint('  UA: CARS.ua', 
      `${API}/scrape/ua?sources=carsua&query=Toyota&yearFrom=1990&yearTo=2000`),
    testEndpoint('  IE: CarsIreland', 
      `${API}/scrape/ie?sources=carsireland&make=Toyota&model=&yearFrom=1990&yearTo=2005`),
  ]);
  
  if (uaCross.count > 0 && ieCross.count > 0) {
    console.log('  ✅ Both markets returned data — comparison WILL work');
  } else {
    console.log(`  ⚠️ UA: ${uaCross.count}, IE: ${ieCross.count} — comparison may not show if one side is empty`);
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary:');
  const allResults = { ...uaResults, ...ieResults };
  const working = Object.values(allResults).filter(r => r.ok && r.count > 0);
  const empty = Object.values(allResults).filter(r => r.ok && r.count === 0);
  const failed = Object.values(allResults).filter(r => !r.ok);
  
  console.log(`  ✅ Working with data: ${working.map(r => r.name).join(', ') || 'none'}`);
  console.log(`  ⚠️ Working but empty: ${empty.map(r => r.name).join(', ') || 'none'}`);
  console.log(`  ❌ Failed: ${failed.map(r => r.name).join(', ') || 'none'}`);
  
  console.log('\n✅ Test complete!\n');
}

main().catch(console.error);
