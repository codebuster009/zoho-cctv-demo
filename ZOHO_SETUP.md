# Zoho CRM Setup Guide

## Step 1: Get Your Refresh Token

You have your Client ID and Client Secret. Now you need to get a **Refresh Token** to complete the OAuth2 setup.

### Method 1: Using Browser (Easiest)

1. **Generate Authorization URL:**
   Open this URL in your browser (replace `YOUR_CLIENT_ID` with your actual Client ID):
   
   ```
   https://accounts.zoho.com/oauth/v2/auth?scope=ZohoCRM.modules.ALL&client_id=YOUR_CLIENT_ID_HERE&response_type=code&access_type=offline&redirect_uri=https://www.google.com
   ```

2. **Authorize the Application:**
   - You'll be redirected to Zoho login page
   - Log in with your Zoho account
   - Click "Accept" to authorize the application
   - You'll be redirected to `https://www.google.com` with a `code` parameter in the URL

3. **Extract the Authorization Code:**
   - Look at the URL after redirect, it will look like:
   ```
   https://www.google.com/?code=1000.abc123def456...
   ```
   - Copy the `code` value (everything after `code=`)

4. **Exchange Code for Refresh Token:**
   Run this command in your terminal (replace `YOUR_CODE` with the code from step 3):

   ```bash
   curl -X POST "https://accounts.zoho.com/oauth/v2/token" \
     -d "grant_type=authorization_code" \
     -d "client_id=YOUR_CLIENT_ID_HERE" \
     -d "client_secret=YOUR_CLIENT_SECRET_HERE" \
     -d "redirect_uri=https://www.google.com" \
     -d "code=YOUR_CODE"
   ```

5. **Save the Refresh Token:**
   - The response will contain `refresh_token` and `access_token`
   - Copy the `refresh_token` value
   - Update your `.env` file with this refresh token

### Method 2: Using Postman or cURL Script

I can create a helper script for you if you prefer.

## Step 2: Update .env File

Once you have the refresh token, update the `.env` file in the `backend` folder:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/smartcctv
ZOHO_CLIENT_ID=YOUR_CLIENT_ID_HERE
ZOHO_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
ZOHO_REFRESH_TOKEN=YOUR_REFRESH_TOKEN_HERE
ZOHO_REDIRECT_URI=https://www.google.com
ZOHO_BASE_URL=https://www.zohoapis.com
ZOHO_CRM_API=https://www.zohoapis.com/crm/v3
```

## Step 3: Verify Setup

1. Make sure MongoDB is running
2. Start the backend server:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
3. The server should start without errors
4. Try creating an event and syncing it to Zoho CRM

## Troubleshooting

- **"Invalid refresh token"**: Make sure you copied the entire refresh token (it's usually a long string)
- **"Invalid client credentials"**: Double-check your Client ID and Secret
- **"Scope not allowed"**: Make sure your Zoho app has CRM API scopes enabled

