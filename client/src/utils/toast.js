import toast from 'react-hot-toast';

const toastConfig = {
  duration: 4000,
  position: 'top-right',
  style: {
    padding: '16px',
    borderRadius: '12px',
    background: '#333',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '500',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
  success: {
    style: {
      background: '#10b981', // Emerald 500
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#10b981',
    },
  },
  error: {
    style: {
      background: '#ef4444', // Red 500
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#ef4444',
    },
  },
};

export const showToast = {
  success: (message) => toast.success(message, toastConfig),
  error: (message) => toast.error(message, toastConfig),
  loading: (message) => toast.loading(message, toastConfig),
  dismiss: (toastId) => toast.dismiss(toastId),
  promise: (promise, msgs) => toast.promise(promise, msgs, toastConfig)
};

export default showToast;
