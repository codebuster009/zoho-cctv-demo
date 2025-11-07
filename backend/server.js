import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import eventRoutes from './routes/events.js';
import zohoAuthRoutes from './routes/zohoAuth.js';
import Event from './models/Event.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/events', eventRoutes);
app.use('/', zohoAuthRoutes); // OAuth callback routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smartcctv')
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
  });

// Event generation service - creates random IoT events every 5 seconds
const eventTypes = ['Motion', 'Intrusion', 'Fire', 'Tampering', 'Object Detection'];
const cameraNames = ['Warehouse Entrance', 'Gate 2', 'Loading Bay', 'Parking Lot', 'Main Office'];
const sites = ['Warehouse A', 'Warehouse B', 'Distribution Center', 'Main Facility', 'Storage Unit'];

function generateRandomEvent() {
  const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
  const camera_name = cameraNames[Math.floor(Math.random() * cameraNames.length)];
  const site = sites[Math.floor(Math.random() * sites.length)];
  
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  });

  return {
    camera_name,
    eventType,
    site,
    time,
    status: 'Pending',
    syncedToCRM: false
  };
}

// Generate events every 5 seconds
setInterval(async () => {
  try {
    const newEvent = new Event(generateRandomEvent());
    await newEvent.save();
    console.log(`📹 New event created: ${newEvent.eventType} at ${newEvent.camera_name} (${newEvent.time})`);
  } catch (error) {
    console.error('Error generating event:', error);
  }
}, 5000);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Event generation started (every 5 seconds)`);
});

