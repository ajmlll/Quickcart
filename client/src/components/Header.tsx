import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch, logout } from '../store';

export const Header: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            ⚡
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            QuickCart
          </span>
        </Link>

        {/* Navigation & Auth Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                to="/cart"
                className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition flex items-center gap-2 text-sm font-medium"
                title="View Cart"
              >
                <span>🛒</span>
                <span className="hidden sm:inline">Cart</span>
                {cartItemCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-indigo-500 text-white shadow-md">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              <div className="h-4 w-px bg-slate-800 hidden sm:block"></div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-300 hidden sm:inline">
                  Hi, <strong className="text-white">{user.name}</strong>
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md font-semibold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 uppercase">
                  {user.role}
                </span>

                <button
                  onClick={handleLogout}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 transition"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/20 transition"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
