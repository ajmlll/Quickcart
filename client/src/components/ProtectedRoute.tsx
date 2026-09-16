import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store';
import AuthRequiredModal from './AuthRequiredModal';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, status } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  if (status === 'idle' || status === 'loading') {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-neutral-50 text-neutral-900 flex items-center justify-center p-4 font-sans">
        <div className="flex flex-col items-center space-y-3 bg-white p-8 rounded-2xl border border-neutral-200/80 shadow-sm">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-neutral-600 text-sm font-medium">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 font-sans">
        <AuthRequiredModal
          isOpen={true}
          onClose={() => navigate('/shop')}
          title="Cart Requires Login"
          message="You need to log in or create an account to view and manage your shopping cart."
        />
      </div>
    );
  }

  // Admins do not access user shopping cart pages; redirect them to /admin
  if (user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
