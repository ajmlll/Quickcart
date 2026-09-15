// NOTE: This works for ANY user whose role is 'admin' in the database (including the seeded admin@example.com account) — it's a real role check driven by MongoDB user.role, not hardcoded frontend credentials.

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store';

interface AdminRouteProps {
  children?: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, status } = useAppSelector((state) => state.auth);

  if (status === 'loading') {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 font-sans">
        <div className="flex flex-col items-center space-y-3 bg-white/75 backdrop-blur-md p-8 rounded-2xl border border-white/80 shadow-xs">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-neutral-700 text-sm font-semibold">Checking admin authorization...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Real database role check: verify user.role === 'admin'
  if (user.role !== 'admin') {
    return <Navigate to="/shop" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
