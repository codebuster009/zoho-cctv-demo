import { useState, useEffect } from 'react';
import { getEvents } from './api';
import Header from './components/Header';
import CameraGrid from './components/CameraGrid';
import EventLog from './components/EventLog';
import Toast from './components/Toast';

function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Fetch events every 5 seconds
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoading(false);
      }
    };

    // Initial fetch
    fetchEvents();

    // Poll every 5 seconds
    const interval = setInterval(fetchEvents, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSyncSuccess = (caseId, message, type = 'success') => {
    if (type === 'success' && caseId) {
      setToast({
        message: `✅ ${message || 'Sent to Zoho CRM'}`,
        type: 'success',
        caseId: caseId
      });
    } else {
      setToast({
        message: `❌ ${message || 'Failed to send to Zoho CRM'}`,
        type: 'error'
      });
    }

    // Refresh events to update sync status
    setTimeout(async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (error) {
        console.error('Error refreshing events:', error);
      }
    }, 1000);
  };

  const closeToast = () => {
    setToast(null);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <main className="max-w-7xl mx-auto">
        <CameraGrid />
        {loading ? (
          <div className="px-6 py-6">
            <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 text-center">
              <p className="text-slate-400">Loading events...</p>
            </div>
          </div>
        ) : (
          <EventLog events={events} onSyncSuccess={handleSyncSuccess} />
        )}
      </main>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          caseId={toast.caseId}
          onClose={closeToast}
        />
      )}
    </div>
  );
}

export default App;

