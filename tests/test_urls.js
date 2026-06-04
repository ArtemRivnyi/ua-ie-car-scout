import { 
  buildAutoRiaUrl, 
  buildRstUrl, 
  buildCarsUaUrl, 
  buildOlxUrl, 
  buildDoneDealUrl, 
  buildCarsIrelandUrl, 
  buildCarzoneUrl 
} from './src/services/externalSearchService.js';

const query = "Toyota Corolla Levin";
const yearFrom = "1980";
const yearTo = "1995";

console.log("=== UA Sources ===");
console.log("AUTO.RIA:  ", buildAutoRiaUrl(query, yearFrom, yearTo));
console.log("RST.ua:    ", buildRstUrl(query, yearFrom, yearTo));
console.log("CARS.ua:   ", buildCarsUaUrl(query, yearFrom, yearTo));
console.log("OLX.ua:    ", buildOlxUrl(query, yearFrom, yearTo));

console.log("\n=== IE Sources ===");
console.log("DoneDeal:   ", buildDoneDealUrl(query, yearFrom, yearTo));
console.log("CarsIreland:", buildCarsIrelandUrl(query, yearFrom, yearTo));
console.log("Carzone:    ", buildCarzoneUrl(query, yearFrom, yearTo));
