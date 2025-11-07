# Troubleshooting "invalid_client" Error

## Common Causes

The "invalid_client" error from Zoho usually means one of these:

### 1. **Redirect URI Mismatch** (Most Common)
- The redirect URI in your `.env` file must **exactly match** what's in Zoho API Console
- Check both places:
  - **Zoho Console**: `http://localhost:5000/oauth/callback`
  - **Your .env**: `ZOHO_REDIRECT_URI=http://localhost:5000/oauth/callback`
- They must be **identical** (including http vs https, trailing slashes, etc.)

### 2. **Client ID/Secret Mismatch**
- Verify your Client ID and Secret in Zoho API Console
- Make sure they match what's in your `.env` file
- Client ID should start with `1000.`

### 3. **Zoho Region Issue**
Zoho has different endpoints for different regions:
- **US**: `https://accounts.zoho.com`
- **EU**: `https://accounts.zoho.eu`
- **IN**: `https://accounts.zoho.in`

If your Zoho account is in EU or IN, you need to use the correct endpoint.

### 4. **App Not Properly Configured**
- Make sure your app in Zoho API Console has:
  - ✅ Client ID and Secret generated
  - ✅ Redirect URI configured
  - ✅ Scopes enabled (ZohoCRM.modules.ALL)

## Quick Fix Checklist

1. ✅ Go to [Zoho API Console](https://api-console.zoho.com/)
2. ✅ Select your application
3. ✅ Verify Redirect URI is exactly: `http://localhost:5000/oauth/callback`
4. ✅ Copy your Client ID and Secret
5. ✅ Update `backend/.env` with exact values
6. ✅ Restart the server
7. ✅ Try again

## Test Your Configuration

After updating, visit:
```
http://localhost:5000/oauth/authorize
```

The error page will now show more details about what's wrong.

