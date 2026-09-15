import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../store';

export const LandingPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-neutral-50 text-neutral-900 font-sans flex flex-col justify-between">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16 sm:space-y-24 w-full">
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs sm:text-sm font-semibold shadow-xs">
            <span>⚡ Next-Generation Shopping</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-neutral-900 tracking-tight leading-[1.15]">
            Experience Next-Level Shopping with{' '}
            <span className="text-indigo-600">QuickCart</span>
          </h1>

          <p className="text-neutral-600 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed font-normal">
            Curated tech gear, high-performance workspace essentials, and premium accessories — delivered straight to your door with real-time stock management.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/shop"
              className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              <span>Shop Now</span>
              <span className="text-lg">→</span>
            </Link>

            {!user && (
              <Link
                to="/register"
                className="px-8 py-4 rounded-xl bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300 font-semibold text-base shadow-xs transition-all active:scale-95"
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
            <p className="text-neutral-500 text-sm sm:text-base max-w-md mx-auto">
              Built for seamless browsing, absolute data privacy, and fast delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs hover:border-neutral-300 hover:shadow-sm transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center text-2xl font-bold">
                🎧
              </div>
              <h3 className="text-xl font-bold text-neutral-900">Curated Tech Catalog</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Explore handpicked gadgets, peripherals, and desk accessories with verified real-time stock quantities.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs hover:border-neutral-300 hover:shadow-sm transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center text-2xl font-bold">
                🔒
              </div>
              <h3 className="text-xl font-bold text-neutral-900">Secure & Isolated Checkout</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Bank-grade HTTP-only cookie authentication and user-isolated cart management to protect your privacy.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs hover:border-neutral-300 hover:shadow-sm transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center text-2xl font-bold">
                🚀
              </div>
              <h3 className="text-xl font-bold text-neutral-900">Express Delivery</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Fast order handling with automated inventory deduction and instant order verification across all items.
              </p>
            </div>
          </div>
        </section>

        {/* Catalog Preview Banner */}
        <section className="bg-white border border-neutral-200/80 rounded-3xl p-8 sm:p-12 shadow-xs flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              Ready to Upgrade Your Workspace?
            </h3>
            <p className="text-neutral-500 text-sm sm:text-base">
              Discover 18+ high-performance products available right now in our catalog.
            </p>
          </div>

          <Link
            to="/shop"
            className="px-6 py-3.5 rounded-xl bg-neutral-900 hover:bg-black text-white font-semibold text-sm transition shadow-xs active:scale-95 whitespace-nowrap"
          >
            Explore Catalog →
          </Link>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-neutral-200/80 bg-white py-6 text-center text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4">
          © {new Date().getFullYear()} QuickCart Inc. All rights reserved. Premium minimal e-commerce.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
