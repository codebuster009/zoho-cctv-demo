import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID;
const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET;
const ZOHO_REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN;
const ZOHO_REDIRECT_URI = process.env.ZOHO_REDIRECT_URI;
const ZOHO_CRM_API = process.env.ZOHO_CRM_API;

/**
 * Get a new access token using the refresh token
 * @returns {Promise<string>} Access token
 */
export async function getAccessToken() {
  try {
    // Check if refresh token is set
    if (!ZOHO_REFRESH_TOKEN || ZOHO_REFRESH_TOKEN === 'your_refresh_token_here') {
      throw new Error('Zoho refresh token is not configured. Please run ./get-token.sh to set it up.');
    }

    const tokenUrl = 'https://accounts.zoho.in/oauth/v2/token';
    
    const params = new URLSearchParams({
      refresh_token: ZOHO_REFRESH_TOKEN,
      client_id: ZOHO_CLIENT_ID,
      client_secret: ZOHO_CLIENT_SECRET,
      redirect_uri: ZOHO_REDIRECT_URI,
      grant_type: 'refresh_token'
    });

    const response = await axios.post(tokenUrl, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    if (response.data && response.data.access_token) {
      return response.data.access_token;
    } else {
      console.error('Zoho API Response:', response.data);
      throw new Error('Failed to get access token: No access_token in response');
    }
  } catch (error) {
    console.error('Error getting Zoho access token:', error.response?.data || error.message);
    if (error.response?.data) {
      console.error('Full error response:', JSON.stringify(error.response.data, null, 2));
    }
    throw new Error(`Failed to refresh Zoho token: ${error.message}`);
  }
}

/**
 * Send event data to Zoho CRM as a Case
 * @param {Object} eventData - Event data to send
 * @returns {Promise<Object>} Response with Case ID
 */
export async function sendToZoho(eventData) {
  try {
    // Get access token
    const accessToken = await getAccessToken();

    // Prepare Case data for Zoho CRM
    const caseData = {
      data: [
        {
          Subject: `CCTV Alert: ${eventData.eventType} - ${eventData.camera_name}`,
          Description: `Event Type: ${eventData.eventType}\nCamera: ${eventData.camera_name}\nSite: ${eventData.site}\nTime: ${eventData.time}\nEvent ID: ${eventData._id}`,
          Status: 'New',
          Priority: eventData.eventType === 'Fire' || eventData.eventType === 'Intrusion' ? 'High' : 'Medium',
          Origin: 'Web'
        }
      ]
    };

    // Send to Zoho CRM Cases API
    const response = await axios.post(
      `${ZOHO_CRM_API}/Cases`,
      caseData,
      {
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data && response.data.data && response.data.data[0]) {
      const caseId = response.data.data[0].details?.id || response.data.data[0].id;
      return {
        success: true,
        caseId: caseId,
        data: response.data.data[0]
      };
    } else {
      throw new Error('Invalid response from Zoho CRM');
    }
  } catch (error) {
    console.error('Error sending to Zoho CRM:', error.response?.data || error.message);
    throw new Error(`Failed to send to Zoho CRM: ${error.response?.data?.message || error.message}`);
  }
}

