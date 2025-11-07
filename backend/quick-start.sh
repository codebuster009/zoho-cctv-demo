#!/bin/bash

# Quick Start Script for Zoho Token
# This will show you the authorization URL and then help you get the token

CLIENT_ID="YOUR_CLIENT_ID_HERE"
CLIENT_SECRET="YOUR_CLIENT_SECRET_HERE"
REDIRECT_URI="https://www.google.com"

echo ""
echo "🚀 Zoho Refresh Token Setup"
echo "=========================="
echo ""
echo "STEP 1: Visit this URL in your browser:"
echo ""
echo "https://accounts.zoho.com/oauth/v2/auth?scope=ZohoCRM.modules.ALL&client_id=${CLIENT_ID}&response_type=code&access_type=offline&redirect_uri=${REDIRECT_URI}"
echo ""
echo "After authorizing, you'll be redirected to Google."
echo "Copy the 'code' parameter from the URL (everything after 'code=')"
echo ""
read -p "Paste your authorization code here: " AUTH_CODE

if [ -z "$AUTH_CODE" ]; then
  echo "❌ No code provided. Exiting."
  exit 1
fi

echo ""
echo "🔄 Getting your refresh token..."
echo ""

# Execute the curl command
curl --request POST \
  --url "https://accounts.zoho.com/oauth/v2/token?grant_type=authorization_code&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${REDIRECT_URI}&code=${AUTH_CODE}"

echo ""
echo ""
echo "✅ Done! Copy the 'refresh_token' value from above and add it to your .env file"
echo ""

