import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Fetch all events from the backend
 * @returns {Promise<Array>} Array of events
 */
export const getEvents = async () => {
  try {
    const response = await api.get('/events');
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

/**
 * Create a new event
 * @param {Object} eventData - Event data
 * @returns {Promise<Object>} Created event
 */
export const createEvent = async (eventData) => {
  try {
    const response = await api.post('/events', eventData);
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

/**
 * Send event to Zoho CRM
 * @param {string} eventId - Event ID
 * @returns {Promise<Object>} Response with Case ID
 */
export const sendToZoho = async (eventId) => {
  try {
    const response = await api.post(`/events/zoho/${eventId}`);
    return response.data;
  } catch (error) {
    console.error('Error sending to Zoho:', error);
    throw error;
  }
};

export default api;

