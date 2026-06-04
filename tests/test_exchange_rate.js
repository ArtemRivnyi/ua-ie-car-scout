import { getExchangeRates } from '../server/services/exchangeRateService.js';

async function test() {
  console.log('Fetching exchange rates...');
  const rates = await getExchangeRates();
  console.log('Result:', rates);
  
  if (rates.usdToEur > 0.5 && rates.usdToEur < 1.5) {
    console.log('SUCCESS: USD to EUR looks reasonable.');
  } else {
    console.error('ERROR: USD to EUR looks wrong!');
  }
}

test();
