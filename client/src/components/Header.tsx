import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch, logout } from '../store';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = async () => {
    setMobileMenuOpen(false);
    await dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 group"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            ⚡
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            QuickCart
          </span>
        </Link>

        {/* Desktop Navigation (>= 768px) */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/"
            className={`text-sm font-medium transition ${
              location.pathname === '/' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Catalog
          </Link>

          {user ? (
            <>
              <Link
                to="/cart"
                className="relative px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition flex items-center gap-2 text-sm font-medium"
                title="View Shopping Cart"
              >
                <span>🛒</span>
                <span>Cart</span>
                {cartItemCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-indigo-500 text-white shadow-md">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              <div className="h-4 w-px bg-slate-800"></div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-300">
                  Hi, <strong className="text-white">{user.name}</strong>
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md font-semibold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 uppercase">
                  {user.role}
                </span>

                <button
                  onClick={handleLogout}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 transition cursor-pointer"
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

        {/* Mobile Header Quick Actions & Hamburger (< 768px) */}
        <div className="flex items-center gap-3 md:hidden">
          {user && (
            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="relative p-2 text-slate-300 hover:text-white"
            >
              <span className="text-xl">🛒</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500 text-white shadow-md">
                  {cartItemCount}
                </span>
              )}
            </Link>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu (375px - 767px) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-4 space-y-3">
          {user ? (
            <div className="space-y-3">
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50 flex items-center justify-between">
                <div>
                  <span className="block text-xs text-slate-400">Signed in as</span>
                  <span className="text-sm font-bold text-white">{user.name}</span>
                  <span className="text-xs text-slate-400 block">{user.email}</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded font-semibold bg-indigo-500/20 text-indigo-300 uppercase">
                  {user.role}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-center text-sm font-medium text-slate-200"
                >
                  Catalog
                </Link>
                <Link
                  to="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600/20 text-center text-sm font-medium text-indigo-300 border border-indigo-500/30"
                >
                  Cart ({cartItemCount})
                </Link>
              </div>

              <button
                onClick={handleLogout}
                className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-sm font-medium transition"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800/80 text-center text-sm font-medium text-slate-200"
              >
                Browse Catalog
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-center text-sm font-medium text-white border border-slate-700"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-center text-sm font-semibold text-white shadow-lg"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
