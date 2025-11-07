import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID;
const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET;
const ZOHO_REDIRECT_URI = process.env.ZOHO_REDIRECT_URI || 'http://localhost:5000/oauth/callback';

/**
 * OAuth callback route - handles the redirect from Zoho after authorization
 */
router.get('/oauth/callback', async (req, res) => {
  try {
    const { code, error } = req.query;

    if (error) {
      return res.status(400).send(`
        <html>
          <head><title>Authorization Error</title></head>
          <body style="font-family: Arial; padding: 40px; text-align: center;">
            <h1 style="color: #dc2626;">❌ Authorization Error</h1>
            <p>${error}</p>
            <p style="margin-top: 20px;">
              <a href="/oauth/authorize" style="color: #14b8a6;">Try Again</a>
            </p>
          </body>
        </html>
      `);
    }

    if (!code) {
      return res.status(400).send(`
        <html>
          <head><title>No Authorization Code</title></head>
          <body style="font-family: Arial; padding: 40px; text-align: center;">
            <h1 style="color: #dc2626;">❌ No Authorization Code</h1>
            <p>No authorization code received from Zoho.</p>
            <p style="margin-top: 20px;">
              <a href="/oauth/authorize" style="color: #14b8a6;">Try Again</a>
            </p>
          </body>
        </html>
      `);
    }

    console.log('🔄 Exchanging authorization code for tokens...');
    console.log('Client ID:', ZOHO_CLIENT_ID ? ZOHO_CLIENT_ID.substring(0, 20) + '...' : 'MISSING');
    console.log('Redirect URI:', ZOHO_REDIRECT_URI);
    console.log('Code received:', code ? code.substring(0, 20) + '...' : 'MISSING');

    // Exchange code for tokens - Using India region (.in)
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: ZOHO_CLIENT_ID,
      client_secret: ZOHO_CLIENT_SECRET,
      redirect_uri: ZOHO_REDIRECT_URI,
      code: code
    });

    const response = await axios.post(
      'https://accounts.zoho.in/oauth/v2/token',
      params.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    if (response.data && response.data.refresh_token) {
      const refreshToken = response.data.refresh_token;
      const accessToken = response.data.access_token;

      // Display success page with instructions
      res.send(`
        <html>
          <head>
            <title>✅ Authorization Successful</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
              .success { background: #10b981; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
              .token-box { background: #1f2937; color: #10b981; padding: 15px; border-radius: 8px; font-family: monospace; word-break: break-all; margin: 10px 0; }
              .instructions { background: #f3f4f6; padding: 20px; border-radius: 8px; margin-top: 20px; }
              code { background: #e5e7eb; padding: 2px 6px; border-radius: 4px; }
            </style>
          </head>
          <body>
            <div class="success">
              <h1>✅ Authorization Successful!</h1>
              <p>Your Zoho refresh token has been generated.</p>
            </div>
            
            <div class="instructions">
              <h2>📝 Next Steps:</h2>
              <p><strong>1. Copy your refresh token:</strong></p>
              <div class="token-box">${refreshToken}</div>
              
              <p><strong>2. Update your <code>.env</code> file:</strong></p>
              <p>Open <code>backend/.env</code> and update this line:</p>
              <div class="token-box">ZOHO_REFRESH_TOKEN=${refreshToken}</div>
              
              <p><strong>3. Restart your backend server:</strong></p>
              <p>Stop the server (Ctrl+C) and run <code>npm run dev</code> again.</p>
              
              <p><strong>4. Test the integration:</strong></p>
              <p>Go to your dashboard and click "Send to Zoho CRM" on any event.</p>
            </div>
            
            <div style="margin-top: 30px; padding: 15px; background: #dbeafe; border-radius: 8px;">
              <p><strong>💡 Quick Copy Command:</strong></p>
              <p style="font-family: monospace; background: white; padding: 10px; border-radius: 4px;">
                echo 'ZOHO_REFRESH_TOKEN=${refreshToken}' >> backend/.env
              </p>
            </div>
          </body>
        </html>
      `);

      console.log('✅ Refresh token received:', refreshToken.substring(0, 20) + '...');
      console.log('📝 Please update your .env file with this refresh token');
    } else {
      const errorMsg = response.data?.error || 'Unknown error';
      const errorDesc = response.data?.error_description || 'No description';
      
      let troubleshooting = '';
      if (errorMsg === 'invalid_client') {
        troubleshooting = `
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: left;">
            <h3 style="margin-top: 0;">💡 Troubleshooting "invalid_client" error:</h3>
            <ul>
              <li><strong>Check Client ID:</strong> Make sure it matches your Zoho app (starts with 1000.)</li>
              <li><strong>Check Client Secret:</strong> Make sure it's correct in your .env file</li>
              <li><strong>Check Redirect URI:</strong> Must match exactly in Zoho console: <code>${ZOHO_REDIRECT_URI}</code></li>
              <li><strong>Verify in Zoho:</strong> Go to <a href="https://api-console.zoho.com" target="_blank">Zoho API Console</a> and check your app settings</li>
            </ul>
          </div>
        `;
      }
      
      res.status(500).send(`
        <html>
          <head><title>Token Exchange Failed</title></head>
          <body style="font-family: Arial; padding: 40px; max-width: 800px; margin: 0 auto;">
            <h1 style="color: #dc2626;">❌ Token Exchange Failed</h1>
            <p><strong>Error:</strong> ${errorMsg}</p>
            <p><strong>Description:</strong> ${errorDesc}</p>
            ${troubleshooting}
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3>Full Response:</h3>
              <pre style="text-align: left; background: white; padding: 15px; border-radius: 8px; overflow-x: auto;">${JSON.stringify(response.data, null, 2)}</pre>
            </div>
            <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3>Current Configuration:</h3>
              <ul style="text-align: left;">
                <li><strong>Client ID:</strong> ${ZOHO_CLIENT_ID ? ZOHO_CLIENT_ID.substring(0, 30) + '...' : 'MISSING'}</li>
                <li><strong>Redirect URI:</strong> ${ZOHO_REDIRECT_URI}</li>
                <li><strong>Code received:</strong> ${code ? 'Yes' : 'No'}</li>
              </ul>
            </div>
            <p style="margin-top: 20px;">
              <a href="/oauth/authorize" style="color: #14b8a6; text-decoration: underline;">Try Again</a>
            </p>
          </body>
        </html>
      `);
    }
  } catch (error) {
    console.error('Error in OAuth callback:', error.response?.data || error.message);
    res.status(500).send(`
      <html>
        <head><title>Error</title></head>
        <body style="font-family: Arial; padding: 40px; text-align: center;">
          <h1 style="color: #dc2626;">❌ Error</h1>
          <p>${error.response?.data?.error_description || error.message}</p>
          <pre style="text-align: left; background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px auto; max-width: 600px;">${JSON.stringify(error.response?.data || { message: error.message }, null, 2)}</pre>
        </body>
      </html>
    `);
  }
});

/**
 * Authorization route - redirects to Zoho OAuth
 * Tries US region first (most common)
 */
router.get('/oauth/authorize', (req, res) => {
  const scope = 'ZohoCRM.modules.ALL';
  // Using India region (.in)
  const authUrl = `https://accounts.zoho.in/oauth/v2/auth?scope=${scope}&client_id=${ZOHO_CLIENT_ID}&response_type=code&access_type=offline&redirect_uri=${encodeURIComponent(ZOHO_REDIRECT_URI)}`;
  
  console.log('🔐 Redirecting to Zoho authorization (India region)...');
  console.log('Using redirect URI:', ZOHO_REDIRECT_URI);
  
  res.redirect(authUrl);
});

export default router;

