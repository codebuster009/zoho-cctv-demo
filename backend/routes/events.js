import express from 'express';
import Event from '../models/Event.js';
import { sendToZoho } from './zoho.js';

const router = express.Router();

// GET /api/events - Fetch all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 }).limit(50);
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// POST /api/events - Create new event
router.post('/', async (req, res) => {
  try {
    const { camera_name, eventType, site, time } = req.body;
    
    const event = new Event({
      camera_name,
      eventType,
      site,
      time,
      status: 'Pending',
      syncedToCRM: false
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// POST /api/zoho/:id - Send event to Zoho CRM
router.post('/zoho/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.syncedToCRM) {
      return res.json({ 
        message: 'Event already synced to Zoho CRM',
        caseId: event.zohoCaseId,
        event 
      });
    }

    // Send to Zoho CRM
    const zohoResponse = await sendToZoho(event);

    // Update event in database
    event.syncedToCRM = true;
    event.status = 'Synced';
    event.zohoCaseId = zohoResponse.caseId;
    await event.save();

    res.json({
      success: true,
      message: 'Event sent to Zoho CRM successfully',
      caseId: zohoResponse.caseId,
      event
    });
  } catch (error) {
    console.error('Error sending to Zoho:', error);
    
    // Update event status to Failed
    try {
      const event = await Event.findById(req.params.id);
      if (event) {
        event.status = 'Failed';
        await event.save();
      }
    } catch (updateError) {
      console.error('Error updating event status:', updateError);
    }

    res.status(500).json({ 
      error: 'Failed to send event to Zoho CRM',
      message: error.message 
    });
  }
});

export default router;

