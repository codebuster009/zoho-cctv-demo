import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, X } from 'lucide-react';
import { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose, caseId }) => {
  useEffect(() => {
    if (onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="fixed top-4 right-4 z-50 max-w-md w-full"
      >
        <div
          className={`rounded-lg shadow-xl p-4 ${
            type === 'success'
              ? 'bg-teal-600 border border-teal-500'
              : 'bg-red-600 border border-red-500'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              {type === 'success' ? (
                <CheckCircle2 className="w-6 h-6 text-white" />
              ) : (
                <XCircle className="w-6 h-6 text-white" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">{message}</p>
              {caseId && (
                <p className="text-teal-100 text-sm mt-1">
                  Case ID: {caseId}
                </p>
              )}
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="flex-shrink-0 text-white hover:text-teal-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Toast;

