import { Send, Clock, MapPin, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { sendToZoho } from '../api';

const EventLog = ({ events, onSyncSuccess }) => {
  const handleSendToZoho = async (eventId) => {
    try {
      const response = await sendToZoho(eventId);
      if (onSyncSuccess) {
        onSyncSuccess(response.caseId, response.message);
      }
    } catch (error) {
      if (onSyncSuccess) {
        onSyncSuccess(null, error.response?.data?.error || 'Failed to send to Zoho CRM', 'error');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Synced':
        return 'bg-green-500';
      case 'Failed':
        return 'bg-red-500';
      case 'Pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getEventTypeColor = (eventType) => {
    switch (eventType) {
      case 'Fire':
      case 'Intrusion':
        return 'text-red-400';
      case 'Motion':
        return 'text-yellow-400';
      default:
        return 'text-teal-400';
    }
  };

  if (!events || events.length === 0) {
    return (
      <div className="px-6 py-6">
        <h2 className="text-2xl font-bold text-white mb-4">Event Log</h2>
        <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 text-center">
          <p className="text-slate-400">No events yet. Waiting for IoT events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-6">
      <h2 className="text-2xl font-bold text-white mb-4">Event Log</h2>
      <div className="space-y-3">
        {events.map((event, index) => (
          <motion.div
            key={event._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-teal-500 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <AlertCircle className={`w-5 h-5 ${getEventTypeColor(event.eventType)}`} />
                  <span className={`font-semibold ${getEventTypeColor(event.eventType)}`}>
                    {event.eventType}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(
                      event.status
                    )}`}
                  >
                    {event.status}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{event.camera_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{event.site}</span>
                  </div>
                </div>
                {event.zohoCaseId && (
                  <div className="mt-2 text-xs text-teal-400">
                    Zoho Case ID: {event.zohoCaseId}
                  </div>
                )}
              </div>
              <div className="flex-shrink-0">
                <button
                  onClick={() => handleSendToZoho(event._id)}
                  disabled={event.syncedToCRM}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    event.syncedToCRM
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                      : 'bg-teal-600 hover:bg-teal-700 text-white hover:scale-105'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  {event.syncedToCRM ? 'Synced' : 'Send to Zoho CRM'}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default EventLog;

