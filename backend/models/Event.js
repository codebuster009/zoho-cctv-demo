import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  camera_name: {
    type: String,
    required: true
  },
  eventType: {
    type: String,
    required: true,
    enum: ['Motion', 'Intrusion', 'Fire', 'Tampering', 'Object Detection']
  },
  site: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Synced', 'Failed'],
    default: 'Pending'
  },
  syncedToCRM: {
    type: Boolean,
    default: false
  },
  zohoCaseId: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.model('Event', eventSchema);

