/**
 * Test script to verify Zoho token setup
 */

import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID;
const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET;
const ZOHO_REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN;
const ZOHO_REDIRECT_URI = process.env.ZOHO_REDIRECT_URI;

console.log('\n🔍 Testing Zoho Token Configuration\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Check configuration
if (!ZOHO_REFRESH_TOKEN || ZOHO_REFRESH_TOKEN === 'your_refresh_token_here') {
  console.log('❌ ERROR: Refresh token is not configured!');
  console.log('\nTo fix this:');
  console.log('1. Run: cd backend && ../get-token.sh');
  console.log('2. Or manually get your refresh token and update .env file\n');
  process.exit(1);
}

console.log('✅ Client ID:', ZOHO_CLIENT_ID ? 'Set' : 'Missing');
console.log('✅ Client Secret:', ZOHO_CLIENT_SECRET ? 'Set' : 'Missing');
console.log('✅ Refresh Token:', ZOHO_REFRESH_TOKEN.substring(0, 20) + '...');
console.log('✅ Redirect URI:', ZOHO_REDIRECT_URI);
console.log('\n🔄 Testing token refresh...\n');

// Test token refresh
try {
  const params = new URLSearchParams({
    refresh_token: ZOHO_REFRESH_TOKEN,
    client_id: ZOHO_CLIENT_ID,
    client_secret: ZOHO_CLIENT_SECRET,
    redirect_uri: ZOHO_REDIRECT_URI,
    grant_type: 'refresh_token'
  });

  const response = await axios.post(
    'https://accounts.zoho.in/oauth/v2/token',
    params.toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );

  if (response.data && response.data.access_token) {
    console.log('✅ SUCCESS! Token refresh works!');
    console.log('✅ Access Token received (length:', response.data.access_token.length, ')');
    console.log('✅ Token expires in:', response.data.expires_in, 'seconds');
    console.log('\n🎉 Your Zoho integration is ready to use!\n');
  } else {
    console.log('❌ ERROR: No access token in response');
    console.log('Response:', response.data);
  }
} catch (error) {
  console.log('❌ ERROR: Token refresh failed');
  if (error.response) {
    console.log('Status:', error.response.status);
    console.log('Error:', JSON.stringify(error.response.data, null, 2));
    
    if (error.response.data?.error === 'invalid_client') {
      console.log('\n💡 This usually means:');
      console.log('   - Client ID or Secret is incorrect');
      console.log('   - Check your .env file');
    } else if (error.response.data?.error === 'invalid_grant') {
      console.log('\n💡 This usually means:');
      console.log('   - Refresh token is invalid or expired');
      console.log('   - You need to get a new refresh token');
      console.log('   - Run: cd backend && ../get-token.sh');
    }
  } else {
    console.log('Error:', error.message);
  }
  process.exit(1);
}

