import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useAppDispatch,
  useAppSelector,
  fetchProducts,
  addToCart,
  type Product,
} from '../store';

export const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [addingId, setAddingId] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user } = useAppSelector((state) => state.auth);
  const { products, status, error } = useAppSelector((state) => state.products);

  // Debounce search input by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch products whenever debouncedSearch or sortOption changes
  useEffect(() => {
    dispatch(fetchProducts({ search: debouncedSearch, sort: sortOption }));
  }, [dispatch, debouncedSearch, sortOption]);

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setAddingId(product._id);
      await dispatch(addToCart({ productId: product._id, quantity: 1 })).unwrap();
    } catch {
      // Error handled via cart slice error state
    } finally {
      setTimeout(() => setAddingId(null), 600);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-indigo-900/40 via-slate-900 to-slate-900 border border-slate-800 p-8 sm:p-12 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              ⚡ Explore Tech Essentials
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Upgrade Your Setup with Premium Tech
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Browse top-tier accessories, audio gear, and office equipment with instant stock validation and real-time cart syncing.
            </p>
          </div>
        </div>

        {/* Controls Bar (Debounced Search & Sort) */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 backdrop-blur-md">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-base">
              🔍
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:inline">
              Sort By:
            </label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full sm:w-48 px-3.5 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 transition cursor-pointer"
            >
              <option value="">Featured / Latest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="name_desc">Name: Z to A</option>
            </select>
          </div>
        </div>

        {/* STATE 1: Error State */}
        {status === 'failed' && (
          <div className="p-8 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center space-y-4 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-2xl mx-auto">
              ⚠️
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Failed to Load Products</h3>
              <p className="text-slate-400 text-sm mt-1">{error}</p>
            </div>
            <button
              onClick={() => dispatch(fetchProducts({ search: debouncedSearch, sort: sortOption }))}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded-xl text-sm transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* STATE 2: Loading Skeleton Grid */}
        {status === 'loading' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-4 animate-pulse"
              >
                <div className="w-full h-48 bg-slate-800 rounded-xl"></div>
                <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                <div className="h-3 bg-slate-800 rounded w-1/2"></div>
                <div className="flex justify-between items-center pt-2">
                  <div className="h-6 bg-slate-800 rounded w-1/3"></div>
                  <div className="h-9 bg-slate-800 rounded-lg w-24"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STATE 3: Empty Results */}
        {status === 'succeeded' && products.length === 0 && (
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto">
            <div className="text-4xl">🔍</div>
            <h3 className="text-xl font-bold text-white">No Products Found</h3>
            <p className="text-slate-400 text-sm">
              We couldn't find any products matching "{debouncedSearch}". Try resetting your search filters.
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-medium transition"
              >
                Clear Search Filter
              </button>
            )}
          </div>
        )}

        {/* SUCCESS STATE: Product Cards Grid */}
        {status === 'succeeded' && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => {
              const isOutOfStock = product.stock === 0;
              const isAdding = addingId === product._id;

              return (
                <div
                  key={product._id}
                  className="group bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5"
                >
                  <div className="space-y-3">
                    {/* Product Image & Badges */}
                    <div className="relative w-full h-48 rounded-xl overflow-hidden bg-slate-800 flex items-center justify-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {isOutOfStock && (
                        <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center">
                          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/20 border border-rose-500/40 text-rose-400 shadow-md">
                            Out of Stock
                          </span>
                        </div>
                      )}
                      {!isOutOfStock && (
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-slate-300">
                          {product.category}
                        </span>
                      )}
                    </div>

                    {/* Name & Stock info */}
                    <div>
                      <h3 className="font-bold text-white text-base leading-snug group-hover:text-indigo-300 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Stock:{' '}
                        <span
                          className={isOutOfStock ? 'text-rose-400 font-semibold' : 'text-slate-300'}
                        >
                          {product.stock} units
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Price & Action Button */}
                  <div className="pt-4 flex items-center justify-between border-t border-slate-800/80 mt-4">
                    <div>
                      <span className="text-xs text-slate-400 block font-medium">Price</span>
                      <span className="text-lg font-black text-white">₹{product.price}</span>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={isOutOfStock || isAdding}
                      className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-md ${
                        isOutOfStock
                          ? 'bg-slate-800/60 text-slate-500 cursor-not-allowed border border-slate-800'
                          : isAdding
                          ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/25 active:scale-95'
                      }`}
                    >
                      {isAdding ? (
                        <>
                          <span>✓</span>
                          <span>Added!</span>
                        </>
                      ) : isOutOfStock ? (
                        <span>Out of Stock</span>
                      ) : (
                        <>
                          <span>🛒</span>
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
