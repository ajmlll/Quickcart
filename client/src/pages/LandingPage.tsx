import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../store';
import GlassCard from '../components/GlassCard';

export const LandingPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="min-h-[calc(100vh-4rem)] text-neutral-900 font-sans flex flex-col justify-between">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16 sm:space-y-24 w-full">
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50/80 backdrop-blur-md border border-indigo-100/80 text-indigo-700 text-xs sm:text-sm font-bold shadow-xs">
            <span>⚡ Next-Generation Shopping</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-neutral-900 tracking-tight leading-[1.15]">
            Experience Next-Level Shopping with{' '}
            <span className="text-indigo-600 drop-shadow-xs">QuickCart</span>
          </h1>

          <p className="text-neutral-700 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed font-normal">
            Curated tech gear, high-performance workspace essentials, and premium accessories — delivered straight to your door with real-time stock management.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/shop"
              className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span>Shop Now</span>
              <span className="text-lg">→</span>
            </Link>

            {!user && (
              <Link
                to="/register"
                className="px-8 py-4 rounded-xl glass-btn-secondary font-bold text-base shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                Create Account
              </Link>
            )}
          </div>
        </section>

        {/* Feature / Value Proposition Cards Section */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              Why Shop With QuickCart?
            </h2>
            <p className="text-neutral-600 text-sm sm:text-base max-w-md mx-auto">
              Built for seamless browsing, absolute data privacy, and fast delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <GlassCard hoverEffect className="p-6 sm:p-8 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50/80 border border-indigo-100 text-indigo-600 flex items-center justify-center text-2xl font-bold shadow-xs">
                🎧
              </div>
              <h3 className="text-xl font-bold text-neutral-900">Curated Tech Catalog</h3>
              <p className="text-neutral-700 text-sm leading-relaxed">
                Explore handpicked gadgets, peripherals, and desk accessories with verified real-time stock quantities.
              </p>
            </GlassCard>

            {/* Feature 2 */}
            <GlassCard hoverEffect className="p-6 sm:p-8 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50/80 border border-indigo-100 text-indigo-600 flex items-center justify-center text-2xl font-bold shadow-xs">
                🔒
              </div>
              <h3 className="text-xl font-bold text-neutral-900">Secure & Isolated Checkout</h3>
              <p className="text-neutral-700 text-sm leading-relaxed">
                Bank-grade HTTP-only cookie authentication and user-isolated cart management to protect your privacy.
              </p>
            </GlassCard>

            {/* Feature 3 */}
            <GlassCard hoverEffect className="p-6 sm:p-8 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50/80 border border-indigo-100 text-indigo-600 flex items-center justify-center text-2xl font-bold shadow-xs">
                🚀
              </div>
              <h3 className="text-xl font-bold text-neutral-900">Express Delivery</h3>
              <p className="text-neutral-700 text-sm leading-relaxed">
                Fast order handling with automated inventory deduction and instant order verification across all items.
              </p>
            </GlassCard>
          </div>
        </section>

        {/* Catalog Preview Banner */}
        <GlassCard className="p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              Ready to Upgrade Your Workspace?
            </h3>
            <p className="text-neutral-600 text-sm sm:text-base">
              Discover 18+ high-performance products available right now in our catalog.
            </p>
          </div>

          <Link
            to="/shop"
            className="px-6 py-3.5 rounded-xl bg-neutral-900 hover:bg-black text-white font-semibold text-sm transition shadow-sm active:scale-95 whitespace-nowrap cursor-pointer"
          >
            Explore Catalog →
          </Link>
        </GlassCard>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/60 bg-white/40 backdrop-blur-md py-6 text-center text-xs text-neutral-600">
        <div className="max-w-7xl mx-auto px-4">
          © {new Date().getFullYear()} QuickCart Inc. All rights reserved. Premium minimal e-commerce.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
