import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import { searchAutoRia, fetchAutoRiaListings } from '../src/services/autoRiaService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

async function run() {
  console.log('Testing AutoRIA API Wrapper...');
  try {
    // 1. Search for Toyota AE86
    console.log('1. Searching for "AE86" on AUTO.RIA...');
    // autoRiaService searchAutoRia signature is (params) but wait, let's look at it.
    // If we don't know the signature, we can pass something generic or we'll see if it fails.
    // Let's assume it takes an object with keywords or make/model.
    // Actually, I'll just pass generic params.
    const searchRes = await searchAutoRia({ markId: 79, modelId: 0, yearFrom: 1980, yearTo: 1996 });
    console.log(`Found ${searchRes.total} total listings. Fetched ${searchRes.ids.length} ids.`);
    
    if (searchRes.ids.length > 0) {
      console.log('First 3 IDs:', searchRes.ids.slice(0, 3));
      
      console.log(`\n2. Fetching details for first listing (ID: ${searchRes.ids[0]})...`);
      const details = await fetchAutoRiaListings([searchRes.ids[0]]);
      console.log('Normalized output:');
      console.log(details[0]);
    } else {
      console.log('No listings found for this query.');
    }
  } catch (err) {
    console.error('Test Failed:', err.message);
  }
}

run();
