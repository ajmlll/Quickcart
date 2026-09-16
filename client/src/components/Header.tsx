import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch, logout } from '../store';
import {
  LogoIcon,
  CartIcon,
  AdminIcon,
  HomeIcon,
  ShopIcon,
  InfoIcon,
  MenuIcon,
  CloseIcon,
  UserIcon,
} from './Icons';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Admin pages use a dedicated sidebar layout instead of the consumer header navbar
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const isAuthPage =
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/signup';

  const handleLogout = async () => {
    setMobileMenuOpen(false);
    const userRole = user?.role;
    await dispatch(logout());
    if (userRole === 'admin') {
      navigate('/login');
    } else {
      navigate('/');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/75 backdrop-blur-md border-b border-white/90 shadow-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative">
        
        {/* Brand Logo with Custom LogoIcon */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group"
          onClick={() => setMobileMenuOpen(false)}
        >
          <LogoIcon size={34} className="text-indigo-600 group-hover:scale-105 transition-transform" />
          <span className="text-xl font-black tracking-tight text-neutral-900">
            QuickCart
          </span>
        </Link>

        {/* Center / Desktop Navigation Links (Positioned exact center) */}
        <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          <Link
            to="/"
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
              location.pathname === '/'
                ? 'text-indigo-600 bg-indigo-50/80 border border-indigo-100/60 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/60'
            }`}
          >
            Home
          </Link>
          <Link
            to="/shop"
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
              location.pathname === '/shop'
                ? 'text-indigo-600 bg-indigo-50/80 border border-indigo-100/60 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/60'
            }`}
          >
            Shop
          </Link>
          <Link
            to="/about"
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
              location.pathname === '/about'
                ? 'text-indigo-600 bg-indigo-50/80 border border-indigo-100/60 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/60'
            }`}
          >
            About
          </Link>
          {user && user.role === 'admin' && (
            <Link
              to="/admin"
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 ${
                location.pathname === '/admin'
                  ? 'text-indigo-600 bg-indigo-50/80 border border-indigo-100/60 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/60'
              }`}
            >
              <AdminIcon size={15} />
              <span>Admin</span>
            </Link>
          )}
        </nav>

        {/* Far Right Controls */}
        <div className="hidden md:flex items-center gap-3">
          {/* Cart Icon & Count Badge */}
          {!isAuthPage && (
            <Link
              to="/cart"
              className={`relative p-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center border ${
                location.pathname === '/cart'
                  ? 'text-indigo-600 bg-indigo-50/80 border-indigo-100 shadow-xs'
                  : 'text-neutral-700 bg-white/70 border-white/90 hover:bg-white'
              }`}
              title="View Shopping Cart"
            >
              <CartIcon size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 flex items-center justify-center text-[10px] font-black rounded-full bg-indigo-600 text-white shadow-xs leading-none">
                  {cartItemCount}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              {!isAuthPage && <div className="h-5 w-px bg-neutral-300/60"></div>}

              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/70 rounded-xl border border-white/90 shadow-xs">
                <UserIcon size={16} className="text-neutral-600" />
                <span className="text-xs font-semibold text-neutral-700">
                  Hi, <strong className="text-neutral-900">{user.name}</strong>
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider glass-btn-secondary active:scale-95 cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            !isAuthPage && (
              <div className="flex items-center gap-3">
                <div className="h-5 w-px bg-neutral-300/60"></div>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition active:scale-95"
                >
                  Sign In
                </Link>
              </div>
            )
          )}
        </div>

        {/* Mobile Actions & Hamburger */}
        <div className="flex items-center gap-3 md:hidden">
          {!isAuthPage && (
            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="relative p-2 text-neutral-700 hover:text-neutral-900 flex items-center"
            >
              <CartIcon size={22} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] font-black rounded-full bg-indigo-600 text-white shadow-xs">
                  {cartItemCount}
                </span>
              )}
            </Link>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white/70 text-neutral-700 hover:text-neutral-900 border border-white/80 focus:outline-none backdrop-blur-md cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-b border-white/80 px-4 py-4 space-y-3 shadow-md">
          <div className={`grid gap-2 ${user && user.role === 'admin' ? 'grid-cols-4' : 'grid-cols-3'}`}>
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2.5 rounded-xl text-center text-xs font-bold uppercase tracking-wider transition ${
                location.pathname === '/'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                  : 'bg-white/60 text-neutral-800 border border-white/80'
              }`}
            >
              <HomeIcon size={18} />
              <span>Home</span>
            </Link>

            <Link
              to="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2.5 rounded-xl text-center text-xs font-bold uppercase tracking-wider transition ${
                location.pathname === '/shop'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                  : 'bg-white/60 text-neutral-800 border border-white/80'
              }`}
            >
              <ShopIcon size={18} />
              <span>Shop</span>
            </Link>

            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2.5 rounded-xl text-center text-xs font-bold uppercase tracking-wider transition ${
                location.pathname === '/about'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                  : 'bg-white/60 text-neutral-800 border border-white/80'
              }`}
            >
              <InfoIcon size={18} />
              <span>About</span>
            </Link>

            {user && user.role === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-2.5 rounded-xl text-center text-xs font-bold uppercase tracking-wider transition ${
                  location.pathname === '/admin'
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                    : 'bg-white/60 text-neutral-800 border border-white/80'
                }`}
              >
                <AdminIcon size={18} />
                <span>Admin</span>
              </Link>
            )}
          </div>

          {user ? (
            <div className="space-y-3 pt-2 border-t border-neutral-200/60">
              <div className="p-3 bg-white/70 rounded-xl border border-white/90 flex items-center gap-3">
                <UserIcon size={20} className="text-neutral-600" />
                <div>
                  <span className="block text-[11px] text-neutral-500 font-bold uppercase">Signed in as</span>
                  <span className="text-sm font-black text-neutral-900">{user.name}</span>
                </div>
              </div>

              {!isAuthPage && (
                <Link
                  to="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition text-center ${
                    location.pathname === '/cart'
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                      : 'bg-white/70 text-neutral-800 border border-white/80'
                  }`}
                >
                  <CartIcon size={18} />
                  <span>Cart</span> {cartItemCount > 0 ? `(${cartItemCount})` : ''}
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="w-full py-2.5 rounded-xl bg-rose-50/80 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-black uppercase tracking-wider transition cursor-pointer"
              >
                Log Out
              </button>
            </div>
          ) : (
            !isAuthPage && (
              <div className="flex flex-col gap-2 pt-2 border-t border-neutral-200/60">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 text-center text-xs font-black uppercase tracking-wider text-white shadow-xs hover:bg-indigo-700 transition"
                >
                  Sign In
                </Link>
              </div>
            )
          )}
        </div>
      )}

    </header>
  );
};

export default Header;
