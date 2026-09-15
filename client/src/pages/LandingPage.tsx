import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../store';
import GlassCard from '../components/GlassCard';

export const LandingPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="min-h-[calc(100vh-4rem)] text-neutral-900 font-sans flex flex-col justify-between">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16 sm:space-y-24 w-full">
        {/* ATTRACTIVE HERO SECTION */}
        <section className="relative overflow-hidden rounded-3xl bg-white/70 backdrop-blur-xl border border-white/90 p-8 sm:p-16 shadow-lg">
          {/* Ambient Glow background accent */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/90 text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-md">
              <span>⚡ NEXT-GEN TECH & WORKSPACE GEAR</span>
            </div>

            <h1 className="text-4xl sm:text-7xl font-black text-neutral-900 tracking-tight leading-[1.08] uppercase">
              ELEVATE YOUR SETUP WITH{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600">
                QUICKCART
              </span>
            </h1>

            <p className="text-neutral-600 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
              Handpicked audio equipment, smart wearables, workspace peripherals, and high-performance devices — delivered straight to your door with real-time stock verification.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/shop"
                className="px-8 py-4 rounded-2xl bg-black hover:bg-neutral-800 text-white font-black text-sm uppercase tracking-wider shadow-md hover:shadow-xl transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <span>EXPLORE CATALOG</span>
                <span className="text-base">→</span>
              </Link>

              {!user ? (
                <Link
                  to="/register"
                  className="px-8 py-4 rounded-2xl glass-btn-secondary font-black text-sm uppercase tracking-wider shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  CREATE ACCOUNT
                </Link>
              ) : (
                <Link
                  to="/shop"
                  className="px-8 py-4 rounded-2xl glass-btn-secondary font-black text-sm uppercase tracking-wider shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  VIEW SHOP
                </Link>
              )}
            </div>

            {/* Floating Quick Stats Pills inside Hero */}
            <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto border-t border-neutral-200/60">
              <div className="p-4 rounded-2xl bg-white/60 border border-white/90 text-center">
                <span className="block text-2xl font-black text-neutral-900">18+</span>
                <span className="text-xs font-bold text-neutral-500 uppercase">Verified Tech Products</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/60 border border-white/90 text-center">
                <span className="block text-2xl font-black text-indigo-600">100%</span>
                <span className="text-xs font-bold text-neutral-500 uppercase">Real-Time Stock Sync</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/60 border border-white/90 text-center">
                <span className="block text-2xl font-black text-neutral-900">2-DAY</span>
                <span className="text-xs font-bold text-neutral-500 uppercase">Express Dispatch</span>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards Section */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-4xl font-black text-neutral-900 uppercase tracking-tight">
              WHY CHOOSE QUICKCART?
            </h2>
            <p className="text-neutral-600 text-sm sm:text-base max-w-md mx-auto font-medium">
              Engineered for seamless tech shopping with absolute data security and fast delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <GlassCard hoverEffect className="p-6 sm:p-8 space-y-4 bg-white/85">
              <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center text-2xl font-bold shadow-sm">
                🎧
              </div>
              <h3 className="text-xl font-black text-neutral-900 uppercase tracking-tight">Curated Tech Catalog</h3>
              <p className="text-neutral-700 text-sm leading-relaxed">
                Explore premium headphones, smartwatches, keyboards, and office accessories with live stock tracking.
              </p>
            </GlassCard>

            {/* Feature 2 */}
            <GlassCard hoverEffect className="p-6 sm:p-8 space-y-4 bg-white/85">
              <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center text-2xl font-bold shadow-sm">
                🔒
              </div>
              <h3 className="text-xl font-black text-neutral-900 uppercase tracking-tight">Secure & Isolated Checkout</h3>
              <p className="text-neutral-700 text-sm leading-relaxed">
                Bank-grade HTTP-only cookie authentication and user-isolated cart management protecting your data.
              </p>
            </GlassCard>

            {/* Feature 3 */}
            <GlassCard hoverEffect className="p-6 sm:p-8 space-y-4 bg-white/85">
              <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center text-2xl font-bold shadow-sm">
                🚀
              </div>
              <h3 className="text-xl font-black text-neutral-900 uppercase tracking-tight">Express Delivery</h3>
              <p className="text-neutral-700 text-sm leading-relaxed">
                Fast order handling with automated inventory deduction and instant order confirmation across all items.
              </p>
            </GlassCard>
          </div>
        </section>

        {/* Call To Action Catalog Banner */}
        <GlassCard className="p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 bg-white/90">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black text-neutral-900 uppercase tracking-tight">
              READY TO UPGRADE YOUR WORKSPACE?
            </h3>
            <p className="text-neutral-600 text-sm sm:text-base font-medium">
              Discover 18+ high-performance products available right now in our catalog.
            </p>
          </div>

          <Link
            to="/shop"
            className="px-8 py-4 rounded-2xl bg-black hover:bg-neutral-800 text-white font-black text-xs uppercase tracking-wider transition shadow-sm active:scale-95 whitespace-nowrap cursor-pointer"
          >
            BROWSE SHOP →
          </Link>
        </GlassCard>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/60 bg-white/40 backdrop-blur-md py-6 text-center text-xs text-neutral-600 font-medium">
        <div className="max-w-7xl mx-auto px-4">
          © {new Date().getFullYear()} QuickCart Inc. All rights reserved. Premium minimal e-commerce.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
