import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-4 right-4 rounded-lg p-4 text-white shadow-lg ${
        type === 'error' ? 'bg-red-500' : 'bg-green-500'
      }`}
    >
      {message}
    </div>
  );
};

export default Toast;
