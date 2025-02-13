import React, { useEffect } from 'react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, message }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000); // Close after 2 seconds

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-30"></div>
      <div className="bg-white rounded-lg p-6 shadow-xl z-10 transform transition-all ease-in-out duration-300 animate-bounce-in">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg
              className="h-8 w-8 text-green-500 animate-check"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Success!</h3>
          <p className="text-sm text-gray-500">{message}</p>
        </div>
      </div>
    </div>
  );
}; 