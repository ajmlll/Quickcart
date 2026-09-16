import React from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '../components/GlassCard';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] text-neutral-900 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-12 py-6">
        
        {/* HERO SECTION */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-900 via-neutral-900 to-black text-white p-8 sm:p-14 shadow-xl">
          {/* Ambient Glow accents */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black uppercase tracking-wider text-indigo-300">
              <span>⚡ ABOUT QUICKCART</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight uppercase">
              NEXT-GEN E-COMMERCE FOR TECH ENTHUSIASTS
            </h1>

            <p className="text-neutral-300 text-base sm:text-lg leading-relaxed font-medium">
              QuickCart was built to redefine online tech shopping — combining ultra-fast, real-time inventory synchronization with minimalist glassmorphism aesthetics and total data privacy.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition active:scale-95"
              >
                Browse Catalog →
              </Link>
            </div>
          </div>
        </div>

        {/* STATS HIGHLIGHT BAR */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <GlassCard className="p-6 text-center space-y-1 bg-white/85">
            <span className="block text-3xl sm:text-4xl font-black text-indigo-600">10k+</span>
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Active Customers</span>
          </GlassCard>

          <GlassCard className="p-6 text-center space-y-1 bg-white/85">
            <span className="block text-3xl sm:text-4xl font-black text-neutral-900">99.9%</span>
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Uptime & Reliability</span>
          </GlassCard>

          <GlassCard className="p-6 text-center space-y-1 bg-white/85">
            <span className="block text-3xl sm:text-4xl font-black text-indigo-600">24/7</span>
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Live Inventory Sync</span>
          </GlassCard>

          <GlassCard className="p-6 text-center space-y-1 bg-white/85">
            <span className="block text-3xl sm:text-4xl font-black text-neutral-900">4.9 ★</span>
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">User Satisfaction</span>
          </GlassCard>
        </div>

        {/* MISSION & VISION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <GlassCard hoverEffect className="p-8 space-y-4 bg-white/85">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-sm">
              🎯
            </div>
            <h2 className="text-2xl font-black text-neutral-900 uppercase tracking-tight">Our Mission</h2>
            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed font-medium">
              We empower modern professionals and creators by delivering curated tech gadgets, premium audio equipment, and workspace accessories with zero stock friction and instant real-time checkout verification.
            </p>
          </GlassCard>

          <GlassCard hoverEffect className="p-8 space-y-4 bg-white/85">
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center text-2xl font-bold shadow-sm">
              🚀
            </div>
            <h2 className="text-2xl font-black text-neutral-900 uppercase tracking-tight">Our Vision</h2>
            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed font-medium">
              To build the cleanest, fastest full-stack shopping platform where high-grade security, cookie-isolated cart authorization, and sleek user experience set the benchmark for modern e-commerce.
            </p>
          </GlassCard>
        </div>

        {/* CORE VALUES */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 uppercase tracking-tight">
              WHAT SETS US APART
            </h2>
            <p className="text-neutral-500 text-sm font-semibold max-w-md mx-auto">
              Built on core architectural principles that put speed, privacy, and user experience first.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard hoverEffect className="p-6 space-y-3 bg-white/85">
              <span className="text-3xl">🛡️</span>
              <h3 className="text-lg font-black text-neutral-900 uppercase">Cookie Security</h3>
              <p className="text-neutral-600 text-xs leading-relaxed font-medium">
                HTTP-only cookie tokens protect your authentication session from XSS vulnerabilities and unauthorized token access.
              </p>
            </GlassCard>

            <GlassCard hoverEffect className="p-6 space-y-3 bg-white/85">
              <span className="text-3xl">📦</span>
              <h3 className="text-lg font-black text-neutral-900 uppercase">Real-Time Inventory</h3>
              <p className="text-neutral-600 text-xs leading-relaxed font-medium">
                Server-side stock validation prevents overselling and guarantees that items added to your cart are strictly reserved.
              </p>
            </GlassCard>

            <GlassCard hoverEffect className="p-6 space-y-3 bg-white/85">
              <span className="text-3xl">⚡</span>
              <h3 className="text-lg font-black text-neutral-900 uppercase">Lightning Performance</h3>
              <p className="text-neutral-600 text-xs leading-relaxed font-medium">
                Powered by React 19, Vite, Redux Toolkit, and Node.js Express for instant state updates and swift navigation.
              </p>
            </GlassCard>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
