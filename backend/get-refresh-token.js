/**
 * Helper script to get Zoho Refresh Token using curl-style request
 * 
 * Usage:
 * 1. First, visit the authorization URL printed below
 * 2. Authorize the app and copy the 'code' from the redirect URL
 * 3. Run: node get-refresh-token.js YOUR_CODE
 */

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const CLIENT_ID = process.env.ZOHO_CLIENT_ID || 'YOUR_CLIENT_ID_HERE';
const CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET || 'YOUR_CLIENT_SECRET_HERE';
const REDIRECT_URI = process.env.ZOHO_REDIRECT_URI || 'https://www.google.com';

// Get authorization code from command line
const authCode = process.argv[2];

if (!authCode) {
  console.log('\n📋 STEP 1: Get Authorization Code\n');
  console.log('Visit this URL in your browser:');
  console.log('\n' + '='.repeat(80));
  console.log(
    `https://accounts.zoho.com/oauth/v2/auth?scope=ZohoCRM.modules.ALL&client_id=${CLIENT_ID}&response_type=code&access_type=offline&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`
  );
  console.log('='.repeat(80) + '\n');
  console.log('After authorizing, you will be redirected to Google.');
  console.log('Copy the "code" parameter from the URL (everything after code=)');
  console.log('\nThen run:');
  console.log(`  node get-refresh-token.js YOUR_CODE\n`);
  process.exit(0);
}

// Exchange code for tokens using the exact curl format
async function getRefreshToken() {
  try {
    console.log('\n🔄 Exchanging authorization code for tokens...\n');

    // Using the exact format from your curl command
    const url = `https://accounts.zoho.com/oauth/v2/token?grant_type=authorization_code&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&code=${authCode}`;

    const response = await axios.post(url);

    if (response.data && response.data.refresh_token) {
      console.log('✅ Success! Here are your tokens:\n');
      console.log('='.repeat(80));
      console.log('REFRESH TOKEN:');
      console.log(response.data.refresh_token);
      console.log('='.repeat(80));
      console.log('\n📝 Add this to your .env file:');
      console.log(`ZOHO_REFRESH_TOKEN=${response.data.refresh_token}\n`);
      console.log('Access Token (valid for 1 hour):');
      console.log(response.data.access_token);
      console.log('\n');
      
      // Also show the full response for debugging
      console.log('Full response:');
      console.log(JSON.stringify(response.data, null, 2));
    } else {
      console.error('❌ Error: No refresh token in response');
      console.error('Response:', JSON.stringify(response.data, null, 2));
    }
  } catch (error) {
    console.error('❌ Error getting refresh token:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Message:', error.message);
    }
  }
}

getRefreshToken();
