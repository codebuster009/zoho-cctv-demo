# Quick Guide: Get Zoho Refresh Token

## Step 1: Get Authorization Code

Visit this URL in your browser:

```
https://accounts.zoho.com/oauth/v2/auth?scope=ZohoCRM.modules.ALL&client_id=YOUR_CLIENT_ID_HERE&response_type=code&access_type=offline&redirect_uri=https://www.google.com
```

1. Log in to your Zoho account
2. Click "Accept" to authorize
3. You'll be redirected to Google
4. **Copy the `code` parameter from the URL** (everything after `code=`)

## Step 2: Get Refresh Token

### Option A: Using curl (Direct)

Replace `YOUR_AUTH_CODE` with the code from Step 1:

```bash
curl --request POST \
  --url "https://accounts.zoho.com/oauth/v2/token?grant_type=authorization_code&client_id=YOUR_CLIENT_ID_HERE&client_secret=YOUR_CLIENT_SECRET_HERE&redirect_uri=https://www.google.com&code=YOUR_AUTH_CODE"
```

### Option B: Using the helper script (Node.js)

```bash
cd backend
node get-refresh-token.js YOUR_AUTH_CODE
```

### Option C: Using the bash script

```bash
cd backend
./get-refresh-token.sh YOUR_AUTH_CODE
```

## Step 3: Save the Refresh Token

The response will look like this:

```json
{
  "access_token": "...",
  "refresh_token": "1000.abc123def456...",
  "expires_in": 3600,
  "token_type": "Bearer"
}
```

**Copy the `refresh_token` value** and add it to your `.env` file:

```env
ZOHO_REFRESH_TOKEN=1000.abc123def456...
```

## Step 4: Test It!

Once you've added the refresh token to `.env`, start your server:

```bash
cd backend
npm install
npm run dev
```

The server should start successfully. Now you can sync events to Zoho CRM!

