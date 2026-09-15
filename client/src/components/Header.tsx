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
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-sm group-hover:bg-indigo-700 transition-colors">
            ⚡
          </div>
          <span className="text-xl font-black tracking-tight text-neutral-900">
            QuickCart
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-1">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition ${
                location.pathname === '/'
                  ? 'text-indigo-600 bg-indigo-50/70 font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70'
              }`}
            >
              Home
            </Link>

            {user && (
              <Link
                to="/cart"
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 ${
                  location.pathname === '/cart'
                    ? 'text-indigo-600 bg-indigo-50/70 font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70'
                }`}
              >
                <span>🛒</span>
                <span>Cart</span>
                {cartItemCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-indigo-600 text-white shadow-xs">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            )}
          </nav>

          <div className="h-5 w-px bg-neutral-200/80"></div>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-50 rounded-xl border border-neutral-200/60">
                <span className="text-sm font-medium text-neutral-700">
                  Hi, <strong className="text-neutral-900">{user.name}</strong>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-indigo-100 text-indigo-800 uppercase tracking-wider">
                  {user.role}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200 transition cursor-pointer shadow-xs active:scale-95"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition active:scale-95"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Actions & Hamburger */}
        <div className="flex items-center gap-3 md:hidden">
          {user && (
            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="relative p-2 text-neutral-700 hover:text-neutral-900"
            >
              <span className="text-xl">🛒</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-indigo-600 text-white shadow-xs">
                  {cartItemCount}
                </span>
              )}
            </Link>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-neutral-100 text-neutral-700 hover:text-neutral-900 border border-neutral-200 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-neutral-200 px-4 py-4 space-y-3 shadow-md">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition ${
              location.pathname === '/'
                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                : 'bg-neutral-50 text-neutral-800 hover:bg-neutral-100'
            }`}
          >
            🏠 Home
          </Link>

          {user ? (
            <div className="space-y-3 pt-1 border-t border-neutral-100">
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between">
                <div>
                  <span className="block text-xs text-neutral-500">Signed in as</span>
                  <span className="text-sm font-bold text-neutral-900">{user.name}</span>
                  <span className="text-xs text-neutral-500 block">{user.email}</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase">
                  {user.role}
                </span>
              </div>

              <Link
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                  location.pathname === '/cart'
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                    : 'bg-neutral-50 text-neutral-800 hover:bg-neutral-100'
                }`}
              >
                🛒 Cart ({cartItemCount})
              </Link>

              <button
                onClick={handleLogout}
                className="w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-sm font-medium transition cursor-pointer"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-1 border-t border-neutral-100">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-neutral-50 text-center text-sm font-medium text-neutral-800 border border-neutral-200"
              >
                Browse Catalog
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-white text-center text-sm font-medium text-neutral-800 border border-neutral-200"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-700 transition"
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
