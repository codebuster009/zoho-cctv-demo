import { Camera } from 'lucide-react';
import { motion } from 'framer-motion';

const cameras = [
  { camera_name: 'Warehouse Entrance', status: 'Alert' },
  { camera_name: 'Gate 2', status: 'Idle' },
  { camera_name: 'Loading Bay', status: 'Normal' }
];

const getStatusColor = (status) => {
  switch (status) {
    case 'Alert':
      return 'bg-red-500';
    case 'Idle':
      return 'bg-yellow-500';
    case 'Normal':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

const CameraGrid = () => {
  return (
    <div className="px-6 py-6">
      <h2 className="text-2xl font-bold text-white mb-4">Camera Status</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cameras.map((camera, index) => (
          <motion.div
            key={camera.camera_name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-teal-500 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-slate-700 rounded-lg">
                <Camera className="w-6 h-6 text-teal-400" />
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(
                  camera.status
                )}`}
              >
                {camera.status}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-white">
              {camera.camera_name}
            </h3>
            <p className="text-slate-400 text-sm mt-2">
              {camera.status === 'Alert'
                ? 'Motion detected'
                : camera.status === 'Idle'
                ? 'No activity'
                : 'Operating normally'}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CameraGrid;

