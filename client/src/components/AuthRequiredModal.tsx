import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LockIcon, KeyIcon, SparklesIcon, CloseIcon } from './Icons';

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export const AuthRequiredModal: React.FC<AuthRequiredModalProps> = ({
  isOpen,
  onClose,
  title = 'Authentication Required',
  message = 'Please log in or create an account to manage your shopping cart and complete purchases.',
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = () => {
    onClose();
    navigate('/login');
  };

  const handleRegister = () => {
    onClose();
    navigate('/register');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-sans">
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-md p-6 sm:p-8 bg-white/95 backdrop-blur-xl border border-white/90 rounded-3xl shadow-2xl space-y-6 text-center transform transition-all scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-800 flex items-center justify-center transition cursor-pointer"
          aria-label="Close modal"
        >
          <CloseIcon size={16} />
        </button>

        {/* Icon & Title Header */}
        <div className="space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto shadow-xs">
            <LockIcon size={32} />
          </div>
          <h2 className="text-2xl font-black text-neutral-900 tracking-tight uppercase">
            {title}
          </h2>
          <p className="text-neutral-600 text-sm font-medium leading-relaxed max-w-xs mx-auto">
            {message}
          </p>
        </div>

        {/* Action Buttons: Log In & Sign Up */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleLogin}
            className="w-full py-3.5 rounded-2xl bg-black hover:bg-neutral-800 text-white font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
          >
            <KeyIcon size={16} />
            <span>Log In</span>
          </button>

          <button
            onClick={handleRegister}
            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
          >
            <SparklesIcon size={16} />
            <span>Sign Up / Create Account</span>
          </button>
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-neutral-100">
          <button
            onClick={onClose}
            className="text-xs font-bold text-neutral-400 hover:text-neutral-700 transition cursor-pointer"
          >
            Continue browsing as guest
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthRequiredModal;
