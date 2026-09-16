import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../store';
import GlassCard from '../components/GlassCard';
import { LogoIcon, ArrowRightIcon, SparklesIcon, LockIcon } from '../components/Icons';

export const LandingPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="min-h-[calc(100vh-4rem)] text-neutral-900 font-sans flex flex-col justify-between">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16 space-y-16 w-full">
        
        {/* SIMPLE PREMIUM HERO SECTION (IMAGE-FREE & CLEAN) */}
        <section className="relative overflow-hidden rounded-3xl bg-white/85 backdrop-blur-2xl border border-white/90 p-8 sm:p-16 lg:p-20 shadow-xl text-center">
          {/* Subtle Ambient Backlight */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider shadow-xs">
              <LogoIcon size={18} className="text-indigo-400" />
              <span>PREMIUM TECH & ELECTRONICS</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-neutral-900 tracking-tight leading-[1.05] uppercase">
              ESSENTIAL TECH FOR MODERN{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                WORKSPACES
              </span>
            </h1>

            <p className="text-neutral-600 text-base sm:text-lg leading-relaxed font-medium max-w-xl mx-auto">
              Discover high-performance audio equipment, smart wearables, and sleek desk accessories curated for ultimate efficiency.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/shop"
                className="px-8 py-4 rounded-2xl bg-neutral-900 hover:bg-black text-white font-black text-xs uppercase tracking-wider shadow-md hover:shadow-xl transition-all active:scale-95 flex items-center gap-2.5 cursor-pointer"
              >
                <span>EXPLORE CATALOG</span>
                <ArrowRightIcon size={16} />
              </Link>

              {!user ? (
                <Link
                  to="/register"
                  className="px-8 py-4 rounded-2xl bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-300 font-black text-xs uppercase tracking-wider shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <SparklesIcon size={16} />
                  <span>CREATE ACCOUNT</span>
                </Link>
              ) : (
                <Link
                  to="/about"
                  className="px-8 py-4 rounded-2xl bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-300 font-black text-xs uppercase tracking-wider shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  ABOUT QUICKCART
                </Link>
              )}
            </div>

            {/* Minimal Stat Counters */}
            <div className="pt-8 grid grid-cols-3 gap-6 border-t border-neutral-200/60 max-w-lg mx-auto">
              <div>
                <span className="block text-2xl sm:text-3xl font-black text-neutral-900">18+</span>
                <span className="text-[11px] font-bold text-neutral-500 uppercase">Curated Products</span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-black text-indigo-600">100%</span>
                <span className="text-[11px] font-bold text-neutral-500 uppercase">Live Stock Sync</span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-black text-neutral-900">2-Day</span>
                <span className="text-[11px] font-bold text-neutral-500 uppercase">Express Dispatch</span>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards Section */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 uppercase tracking-tight">
              WHY CHOOSE QUICKCART?
            </h2>
            <p className="text-neutral-500 text-sm max-w-md mx-auto font-semibold">
              Engineered for seamless tech shopping with absolute data security and fast delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard hoverEffect className="p-6 sm:p-8 space-y-4 bg-white/85">
              <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center text-2xl font-bold shadow-xs">
                🎧
              </div>
              <h3 className="text-lg font-black text-neutral-900 uppercase tracking-tight">Curated Catalog</h3>
              <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed font-medium">
                Explore premium headphones, smartwatches, keyboards, and office accessories with live stock tracking.
              </p>
            </GlassCard>

            <GlassCard hoverEffect className="p-6 sm:p-8 space-y-4 bg-white/85">
              <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center text-2xl font-bold shadow-xs">
                <LockIcon size={24} />
              </div>
              <h3 className="text-lg font-black text-neutral-900 uppercase tracking-tight">Cookie Security</h3>
              <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed font-medium">
                Bank-grade HTTP-only cookie authentication protecting your account credentials and personal data.
              </p>
            </GlassCard>

            <GlassCard hoverEffect className="p-6 sm:p-8 space-y-4 bg-white/85">
              <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center text-2xl font-bold shadow-xs">
                🚀
              </div>
              <h3 className="text-lg font-black text-neutral-900 uppercase tracking-tight">Express Shipping</h3>
              <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed font-medium">
                Fast order handling with automated inventory deduction and instant order confirmation across all items.
              </p>
            </GlassCard>
          </div>
        </section>

        {/* CTA Banner */}
        <GlassCard className="p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 bg-white/90">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black text-neutral-900 uppercase tracking-tight">
              READY TO UPGRADE YOUR WORKSPACE?
            </h3>
            <p className="text-neutral-600 text-sm font-medium">
              Discover 18+ high-performance products available right now in our catalog.
            </p>
          </div>

          <Link
            to="/shop"
            className="px-8 py-4 rounded-2xl bg-neutral-900 hover:bg-black text-white font-black text-xs uppercase tracking-wider transition shadow-sm active:scale-95 whitespace-nowrap cursor-pointer flex items-center gap-2"
          >
            <span>BROWSE SHOP</span>
            <ArrowRightIcon size={16} />
          </Link>
        </GlassCard>
      </div>

      <footer className="border-t border-white/60 bg-white/40 backdrop-blur-md py-6 text-center text-xs text-neutral-600 font-medium">
        <div className="max-w-7xl mx-auto px-4">
          © {new Date().getFullYear()} QuickCart Inc. All rights reserved. Premium minimal e-commerce.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
