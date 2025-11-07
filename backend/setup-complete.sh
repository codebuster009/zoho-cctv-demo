#!/bin/bash

# Complete Setup Script for Smart CCTV Zoho Integration
# This script will guide you through the entire setup process

CLIENT_ID="YOUR_CLIENT_ID_HERE"
CLIENT_SECRET="YOUR_CLIENT_SECRET_HERE"
REDIRECT_URI="https://www.google.com"

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║   Smart CCTV - Zoho CRM Integration Setup                     ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Step 1: Show authorization URL
echo "📋 STEP 1: Get Authorization Code"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "👉 Open this URL in your browser:"
echo ""
echo "https://accounts.zoho.com/oauth/v2/auth?scope=ZohoCRM.modules.ALL&client_id=${CLIENT_ID}&response_type=code&access_type=offline&redirect_uri=${REDIRECT_URI}"
echo ""
echo "After authorizing, you'll be redirected to Google."
echo "Copy the ENTIRE 'code' parameter from the URL (everything after 'code=')"
echo ""
read -p "📝 Paste your authorization code here: " AUTH_CODE

if [ -z "$AUTH_CODE" ]; then
  echo ""
  echo "❌ No code provided. Exiting."
  exit 1
fi

echo ""
echo "🔄 Getting your refresh token from Zoho..."
echo ""

# Step 2: Get refresh token using curl
RESPONSE=$(curl --request POST \
  --url "https://accounts.zoho.com/oauth/v2/token?grant_type=authorization_code&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${REDIRECT_URI}&code=${AUTH_CODE}" \
  --silent \
  --write-out "\n%{http_code}")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" != "200" ]; then
  echo "❌ Error: HTTP $HTTP_CODE"
  echo "Response: $BODY"
  exit 1
fi

# Extract refresh token
REFRESH_TOKEN=$(echo "$BODY" | grep -o '"refresh_token":"[^"]*' | sed 's/"refresh_token":"//')

if [ -z "$REFRESH_TOKEN" ]; then
  echo "❌ Error: Could not extract refresh token"
  echo "Response: $BODY"
  exit 1
fi

# Step 3: Update .env file
echo "✅ Success! Refresh token received"
echo ""
echo "📝 Updating .env file..."

# Check if .env exists, if not create it
if [ ! -f .env ]; then
  cat > .env << EOF
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/smartcctv
ZOHO_CLIENT_ID=${CLIENT_ID}
ZOHO_CLIENT_SECRET=${CLIENT_SECRET}
ZOHO_REFRESH_TOKEN=${REFRESH_TOKEN}
ZOHO_REDIRECT_URI=${REDIRECT_URI}
ZOHO_BASE_URL=https://www.zohoapis.com
ZOHO_CRM_API=https://www.zohoapis.com/crm/v3
EOF
else
  # Update existing .env file
  if grep -q "ZOHO_REFRESH_TOKEN" .env; then
    sed -i.bak "s|ZOHO_REFRESH_TOKEN=.*|ZOHO_REFRESH_TOKEN=${REFRESH_TOKEN}|" .env
  else
    echo "ZOHO_REFRESH_TOKEN=${REFRESH_TOKEN}" >> .env
  fi
fi

echo "✅ .env file updated successfully!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Your refresh token has been saved to .env"
echo ""
echo "Next steps:"
echo "  1. Make sure MongoDB is running"
echo "  2. Install dependencies: npm install"
echo "  3. Start the server: npm run dev"
echo ""

