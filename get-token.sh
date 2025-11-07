#!/bin/bash

# Quick script to get Zoho refresh token

CLIENT_ID="YOUR_CLIENT_ID_HERE"
CLIENT_SECRET="YOUR_CLIENT_SECRET_HERE"
REDIRECT_URI="https://www.google.com"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Get Zoho Refresh Token"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "STEP 1: Open this URL in your browser:"
echo ""
echo "https://accounts.zoho.com/oauth/v2/auth?scope=ZohoCRM.modules.ALL&client_id=${CLIENT_ID}&response_type=code&access_type=offline&redirect_uri=${REDIRECT_URI}"
echo ""
echo "After authorizing, copy the 'code' from the redirect URL"
echo ""
read -p "STEP 2: Paste your authorization code: " AUTH_CODE

if [ -z "$AUTH_CODE" ]; then
  echo "❌ No code provided"
  exit 1
fi

echo ""
echo "🔄 Getting refresh token..."

RESPONSE=$(curl -s -X POST \
  "https://accounts.zoho.com/oauth/v2/token?grant_type=authorization_code&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${REDIRECT_URI}&code=${AUTH_CODE}")

REFRESH_TOKEN=$(echo "$RESPONSE" | grep -o '"refresh_token":"[^"]*' | sed 's/"refresh_token":"//')

if [ -z "$REFRESH_TOKEN" ]; then
  echo "❌ Error getting token:"
  echo "$RESPONSE"
  exit 1
fi

echo "✅ Success! Refresh token:"
echo ""
echo "$REFRESH_TOKEN"
echo ""
echo "📝 Updating .env file..."

cd backend
sed -i.bak "s|ZOHO_REFRESH_TOKEN=.*|ZOHO_REFRESH_TOKEN=${REFRESH_TOKEN}|" .env

echo "✅ Done! Your .env file has been updated."
echo ""
echo "You can now start the servers:"
echo "  Backend:  cd backend && npm run dev"
echo "  Frontend: cd frontend && npm run dev"
echo ""

