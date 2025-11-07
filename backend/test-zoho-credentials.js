/**
 * Test Zoho credentials directly
 */

import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const CLIENT_ID = process.env.ZOHO_CLIENT_ID;
const CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET;
const REDIRECT_URI = process.env.ZOHO_REDIRECT_URI;

console.log('\n🔍 Testing Zoho Credentials\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('Client ID:', CLIENT_ID);
console.log('Client Secret:', CLIENT_SECRET ? CLIENT_SECRET.substring(0, 10) + '...' : 'MISSING');
console.log('Redirect URI:', REDIRECT_URI);
console.log('');

// Test different Zoho regions
const regions = [
  { name: 'US', url: 'https://accounts.zoho.com' },
  { name: 'EU', url: 'https://accounts.zoho.eu' },
  { name: 'IN', url: 'https://accounts.zoho.in' }
];

console.log('📋 Authorization URLs for each region:\n');

regions.forEach(region => {
  const authUrl = `${region.url}/oauth/v2/auth?scope=ZohoCRM.modules.ALL&client_id=${CLIENT_ID}&response_type=code&access_type=offline&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
  console.log(`${region.name}: ${authUrl}\n`);
});

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('💡 Instructions:\n');
console.log('1. Try the authorization URL for your region');
console.log('2. After authorizing, you\'ll get a code in the redirect URL');
console.log('3. Then test the token exchange with that code\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// If a code is provided as argument, test token exchange
const testCode = process.argv[2];
if (testCode) {
  console.log('🔄 Testing token exchange with code...\n');
  
  for (const region of regions) {
    try {
      console.log(`Trying ${region.name} region (${region.url})...`);
      
      const params = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        code: testCode
      });

      const response = await axios.post(
        `${region.url}/oauth/v2/token`,
        params.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      if (response.data && response.data.refresh_token) {
        console.log(`\n✅ SUCCESS with ${region.name} region!`);
        console.log('Refresh Token:', response.data.refresh_token);
        console.log('Access Token:', response.data.access_token.substring(0, 30) + '...');
        process.exit(0);
      }
    } catch (error) {
      if (error.response) {
        console.log(`  ❌ ${region.name}: ${error.response.data?.error || error.response.status}`);
      } else {
        console.log(`  ❌ ${region.name}: ${error.message}`);
      }
    }
  }
  
  console.log('\n❌ Token exchange failed for all regions');
  process.exit(1);
}

