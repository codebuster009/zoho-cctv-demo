#!/bin/bash

# Zoho Refresh Token Helper Script
# Usage: ./get-refresh-token.sh YOUR_AUTH_CODE

CLIENT_ID="YOUR_CLIENT_ID_HERE"
CLIENT_SECRET="YOUR_CLIENT_SECRET_HERE"
REDIRECT_URI="https://www.google.com"
AUTH_CODE="$1"

if [ -z "$AUTH_CODE" ]; then
  echo ""
  echo "📋 STEP 1: Get Authorization Code"
  echo ""
  echo "Visit this URL in your browser:"
  echo ""
  echo "================================================================================"
  echo "https://accounts.zoho.com/oauth/v2/auth?scope=ZohoCRM.modules.ALL&client_id=${CLIENT_ID}&response_type=code&access_type=offline&redirect_uri=${REDIRECT_URI}"
  echo "================================================================================"
  echo ""
  echo "After authorizing, you will be redirected to Google."
  echo "Copy the 'code' parameter from the URL (everything after code=)"
  echo ""
  echo "Then run:"
  echo "  ./get-refresh-token.sh YOUR_CODE"
  echo ""
  exit 0
fi

echo ""
echo "🔄 Exchanging authorization code for tokens..."
echo ""

# Use curl to get tokens
RESPONSE=$(curl --request POST \
  --url "https://accounts.zoho.com/oauth/v2/token?grant_type=authorization_code&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${REDIRECT_URI}&code=${AUTH_CODE}" \
  --silent)

# Check if we got a response
if [ -z "$RESPONSE" ]; then
  echo "❌ Error: No response from Zoho API"
  exit 1
fi

# Extract refresh token using grep and sed (simple parsing)
REFRESH_TOKEN=$(echo "$RESPONSE" | grep -o '"refresh_token":"[^"]*' | sed 's/"refresh_token":"//')
ACCESS_TOKEN=$(echo "$RESPONSE" | grep -o '"access_token":"[^"]*' | sed 's/"access_token":"//')

if [ -z "$REFRESH_TOKEN" ]; then
  echo "❌ Error: Could not extract refresh token"
  echo "Response: $RESPONSE"
  exit 1
fi

echo "✅ Success! Here are your tokens:"
echo ""
echo "================================================================================"
echo "REFRESH TOKEN:"
echo "$REFRESH_TOKEN"
echo "================================================================================"
echo ""
echo "📝 Add this to your .env file:"
echo "ZOHO_REFRESH_TOKEN=$REFRESH_TOKEN"
echo ""
echo "Access Token (valid for 1 hour):"
echo "$ACCESS_TOKEN"
echo ""

