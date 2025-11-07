# Complete Setup Guide - Smart CCTV Zoho Integration

## 🚀 Automated Setup

I've created everything for you! Here's what to do:

### Step 1: Run the Setup Script

```bash
cd /Users/kartavya/Documents/GitHub/Personal/SmartCCTV-Zoho-RealAPI/backend
./setup-complete.sh
```

This script will:
1. Show you the authorization URL
2. Prompt you to paste the authorization code
3. Automatically get your refresh token using curl
4. Update your .env file with the refresh token

### Step 2: Install Dependencies

```bash
# Backend
cd /Users/kartavya/Documents/GitHub/Personal/SmartCCTV-Zoho-RealAPI/backend
npm install

# Frontend
cd /Users/kartavya/Documents/GitHub/Personal/SmartCCTV-Zoho-RealAPI/frontend
npm install
```

### Step 3: Start MongoDB

Make sure MongoDB is running:

```bash
# Check if MongoDB is running
mongosh --eval "db.version()" 2>/dev/null && echo "✅ MongoDB is running" || echo "❌ MongoDB is not running"

# If not running, start it:
# macOS with Homebrew:
brew services start mongodb-community

# Or manually:
mongod --dbpath /path/to/data
```

### Step 4: Start the Servers

**Terminal 1 - Backend:**
```bash
cd /Users/kartavya/Documents/GitHub/Personal/SmartCCTV-Zoho-RealAPI/backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd /Users/kartavya/Documents/GitHub/Personal/SmartCCTV-Zoho-RealAPI/frontend
npm run dev
```

### Step 5: Open the App

Open your browser to: `http://localhost:3000`

## 📋 Manual Setup (Alternative)

If you prefer to do it manually:

### Get Refresh Token Manually

1. Visit this URL:
```
https://accounts.zoho.com/oauth/v2/auth?scope=ZohoCRM.modules.ALL&client_id=YOUR_CLIENT_ID_HERE&response_type=code&access_type=offline&redirect_uri=https://www.google.com
```

2. Authorize and copy the `code` from the redirect URL

3. Run this curl command (replace YOUR_CODE):
```bash
curl --request POST \
  --url "https://accounts.zoho.com/oauth/v2/token?grant_type=authorization_code&client_id=YOUR_CLIENT_ID_HERE&client_secret=YOUR_CLIENT_SECRET_HERE&redirect_uri=https://www.google.com&code=YOUR_CODE"
```

4. Copy the `refresh_token` from the response

5. Update `backend/.env`:
```env
ZOHO_REFRESH_TOKEN=your_refresh_token_here
```

## ✅ Verification

Once everything is set up:

1. Backend should show: `✅ Connected to MongoDB` and `🚀 Server running on http://localhost:5000`
2. Backend should start generating events every 5 seconds
3. Frontend should open at `http://localhost:3000`
4. You should see events appearing in the dashboard
5. Click "Send to Zoho CRM" on any event to test the integration

## 🐛 Troubleshooting

- **MongoDB connection error**: Make sure MongoDB is running
- **Zoho API error**: Verify your refresh token is correct in `.env`
- **Port already in use**: Change PORT in `.env` or kill the process using the port

