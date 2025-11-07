#!/bin/bash

# Complete Automated Setup Script
# This will set up everything for you!

PROJECT_DIR="/Users/kartavya/Documents/GitHub/Personal/SmartCCTV-Zoho-RealAPI"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"

CLIENT_ID="YOUR_CLIENT_ID_HERE"
CLIENT_SECRET="YOUR_CLIENT_SECRET_HERE"
REDIRECT_URI="https://www.google.com"

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║   Smart CCTV - Complete Automated Setup                        ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Step 1: Get Refresh Token
echo "📋 STEP 1: Get Zoho Refresh Token"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "👉 Open this URL in your browser:"
echo ""
echo "https://accounts.zoho.com/oauth/v2/auth?scope=ZohoCRM.modules.ALL&client_id=${CLIENT_ID}&response_type=code&access_type=offline&redirect_uri=${REDIRECT_URI}"
echo ""
echo "After authorizing, copy the 'code' from the redirect URL"
echo ""
read -p "📝 Paste your authorization code: " AUTH_CODE

if [ -z "$AUTH_CODE" ]; then
  echo "❌ No code provided. Exiting."
  exit 1
fi

echo ""
echo "🔄 Getting refresh token..."
RESPONSE=$(curl --request POST \
  --url "https://accounts.zoho.com/oauth/v2/token?grant_type=authorization_code&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${REDIRECT_URI}&code=${AUTH_CODE}" \
  --silent \
  --write-out "\n%{http_code}")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" != "200" ]; then
  echo "❌ Error: HTTP $HTTP_CODE"
  echo "$BODY"
  exit 1
fi

REFRESH_TOKEN=$(echo "$BODY" | grep -o '"refresh_token":"[^"]*' | sed 's/"refresh_token":"//')

if [ -z "$REFRESH_TOKEN" ]; then
  echo "❌ Error: Could not extract refresh token"
  echo "$BODY"
  exit 1
fi

echo "✅ Refresh token received!"

# Step 2: Update .env file
echo ""
echo "📝 STEP 2: Updating .env file..."
cd "$BACKEND_DIR"

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

echo "✅ .env file created/updated!"

# Step 3: Install Backend Dependencies
echo ""
echo "📦 STEP 3: Installing backend dependencies..."
cd "$BACKEND_DIR"
if [ ! -d "node_modules" ]; then
  npm install
  echo "✅ Backend dependencies installed!"
else
  echo "✅ Backend dependencies already installed"
fi

# Step 4: Install Frontend Dependencies
echo ""
echo "📦 STEP 4: Installing frontend dependencies..."
cd "$FRONTEND_DIR"
if [ ! -d "node_modules" ]; then
  npm install
  echo "✅ Frontend dependencies installed!"
else
  echo "✅ Frontend dependencies already installed"
fi

# Step 5: Check MongoDB
echo ""
echo "🔍 STEP 5: Checking MongoDB..."
if command -v mongosh &> /dev/null; then
  if mongosh --quiet --eval "db.version()" &> /dev/null; then
    echo "✅ MongoDB is running"
  else
    echo "⚠️  MongoDB is not running"
    echo "   Start it with: brew services start mongodb-community"
  fi
else
  echo "⚠️  MongoDB not found in PATH"
  echo "   Make sure MongoDB is installed and running"
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next steps:"
echo ""
echo "1. Make sure MongoDB is running"
echo "2. Start the backend server:"
echo "   cd $BACKEND_DIR"
echo "   npm run dev"
echo ""
echo "3. Start the frontend server (in a new terminal):"
echo "   cd $FRONTEND_DIR"
echo "   npm run dev"
echo ""
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

