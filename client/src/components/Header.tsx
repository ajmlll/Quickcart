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
    navigate('/shop');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-white/80 shadow-xs">
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

        {/* Center / Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          <Link
            to="/"
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              location.pathname === '/'
                ? 'text-indigo-600 bg-indigo-50/80 font-bold border border-indigo-100/60 shadow-xs'
                : 'text-neutral-700 hover:text-neutral-900 hover:bg-white/60'
            }`}
          >
            Home
          </Link>
          <Link
            to="/shop"
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              location.pathname === '/shop'
                ? 'text-indigo-600 bg-indigo-50/80 font-bold border border-indigo-100/60 shadow-xs'
                : 'text-neutral-700 hover:text-neutral-900 hover:bg-white/60'
            }`}
          >
            Shop
          </Link>
          {user && user.role === 'admin' && (
            <Link
              to="/admin"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-1.5 ${
                location.pathname === '/admin'
                  ? 'text-indigo-600 bg-indigo-50/80 font-bold border border-indigo-100/60 shadow-xs'
                  : 'text-neutral-700 hover:text-neutral-900 hover:bg-white/60'
              }`}
            >
              <span>⚡</span>
              <span>Admin</span>
            </Link>
          )}
        </nav>

        {/* Far Right Auth-Aware Controls */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/cart"
                className={`relative px-3.5 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 border ${
                  location.pathname === '/cart'
                    ? 'text-indigo-600 bg-indigo-50/80 border-indigo-100 font-semibold shadow-xs'
                    : 'text-neutral-700 bg-white/60 border-white/80 hover:bg-white/90'
                }`}
                title="View Shopping Cart"
              >
                <span>🛒</span>
                <span>Cart</span>
                {cartItemCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-indigo-600 text-white shadow-xs">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              <div className="h-5 w-px bg-neutral-300/60"></div>

              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 rounded-xl border border-white/80 shadow-xs">
                <span className="text-sm font-medium text-neutral-700">
                  Hi, <strong className="text-neutral-900">{user.name}</strong>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-indigo-100 text-indigo-800 uppercase tracking-wider">
                  {user.role}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl text-xs font-semibold glass-btn-secondary active:scale-95 cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition active:scale-95"
              >
                Sign In
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
            className="p-2 rounded-xl bg-white/70 text-neutral-700 hover:text-neutral-900 border border-white/80 focus:outline-none backdrop-blur-md"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-lg border-b border-white/80 px-4 py-4 space-y-3 shadow-md">
          <div className={`grid gap-2 ${user && user.role === 'admin' ? 'grid-cols-3' : 'grid-cols-2'}`}>
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-xl text-center text-xs font-medium transition ${
                location.pathname === '/'
                  ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-100'
                  : 'bg-white/60 text-neutral-800 border border-white/80'
              }`}
            >
              🏠 Home
            </Link>

            <Link
              to="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-xl text-center text-xs font-medium transition ${
                location.pathname === '/shop'
                  ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-100'
                  : 'bg-white/60 text-neutral-800 border border-white/80'
              }`}
            >
              🛍️ Shop
            </Link>

            {user && user.role === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-xl text-center text-xs font-bold transition ${
                  location.pathname === '/admin'
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                    : 'bg-white/60 text-neutral-800 border border-white/80'
                }`}
              >
                ⚡ Admin
              </Link>
            )}
          </div>

          {user ? (
            <div className="space-y-3 pt-2 border-t border-neutral-200/60">
              <div className="p-3 bg-white/70 rounded-xl border border-white/90 flex items-center justify-between">
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
                className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition text-center ${
                  location.pathname === '/cart'
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                    : 'bg-white/70 text-neutral-800 border border-white/80'
                }`}
              >
                🛒 Cart ({cartItemCount})
              </Link>

              <button
                onClick={handleLogout}
                className="w-full py-2.5 rounded-xl bg-rose-50/80 hover:bg-rose-100 text-rose-700 border border-rose-200 text-sm font-medium transition cursor-pointer"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-2 border-t border-neutral-200/60">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-700 transition"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
