# Zoho OAuth Callback Setup

## ✅ OAuth Callback Route Added

I've added the OAuth callback route to handle Zoho's redirect. The callback endpoint is now available at:

```
http://localhost:5000/oauth/callback
```

## 🔧 Update Your Zoho App Settings

You need to update your Zoho app's redirect URI to match:

1. Go to [Zoho API Console](https://api-console.zoho.com/)
2. Select your application
3. Update the **Redirect URI** to:
   ```
   http://localhost:5000/oauth/callback
   ```
4. Save the changes

## 🚀 How to Use

### Option 1: Use the Authorization Route (Easiest)

1. Make sure your backend server is running
2. Visit this URL in your browser:
   ```
   http://localhost:5000/oauth/authorize
   ```
3. You'll be redirected to Zoho to authorize
4. After authorization, you'll be redirected back to the callback
5. The page will show your refresh token
6. Copy the refresh token and update your `.env` file

### Option 2: Manual Authorization

1. Visit the authorization URL directly:
   ```
   https://accounts.zoho.com/oauth/v2/auth?scope=ZohoCRM.modules.ALL&client_id=YOUR_CLIENT_ID&response_type=code&access_type=offline&redirect_uri=http://localhost:5000/oauth/callback
   ```
2. Authorize the app
3. You'll be redirected to `http://localhost:5000/oauth/callback?code=...`
4. The callback will automatically exchange the code for tokens
5. Copy the refresh token from the success page

## 📝 Update .env File

After getting the refresh token, update `backend/.env`:

```env
ZOHO_REDIRECT_URI=http://localhost:5000/oauth/callback
ZOHO_REFRESH_TOKEN=your_refresh_token_here
```

## 🔄 Restart Server

After updating the `.env` file, restart your backend server:

```bash
cd backend
npm run dev
```

## ✅ Test

Once everything is set up:
1. Go to your dashboard at `http://localhost:3000`
2. Click "Send to Zoho CRM" on any event
3. It should successfully create a Case in Zoho CRM!

