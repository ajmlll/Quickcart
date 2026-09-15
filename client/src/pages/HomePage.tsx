import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useAppDispatch,
  useAppSelector,
  fetchProducts,
  addToCart,
  type Product,
} from '../store';
import GlassCard from '../components/GlassCard';

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
    <div className="min-h-[calc(100vh-4rem)] text-neutral-900 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Glass Hero Banner */}
        <GlassCard className="p-6 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-indigo-50/80 border border-indigo-100 text-indigo-700 shadow-xs">
              ⚡ Minimalist Tech Catalog
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight leading-tight">
              Essential Tech & Office Gear
            </h1>
            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
              Curated accessories, audio equipment, and workplace solutions with real-time stock management.
            </p>
          </div>
        </GlassCard>

        {/* Filter Controls Bar (Search & Sort) */}
        <GlassCard className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">
              🔍
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-8 py-2.5 bg-white/70 border border-white/90 focus:bg-white rounded-xl text-neutral-900 placeholder-neutral-400 text-sm focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <label className="text-xs font-bold text-neutral-600 uppercase tracking-wider hidden sm:inline">
              Sort By:
            </label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full sm:w-48 px-3.5 py-2.5 bg-white/70 border border-white/90 rounded-xl text-neutral-900 text-sm focus:outline-none focus:border-indigo-600 transition cursor-pointer"
            >
              <option value="">Featured / Latest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="name_desc">Name: Z to A</option>
            </select>
          </div>
        </GlassCard>

        {/* STATE 1: Error State */}
        {status === 'failed' && (
          <GlassCard className="p-8 border-rose-200/80 bg-rose-50/60 text-center space-y-4 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-2xl mx-auto shadow-xs">
              ⚠️
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900">Failed to Load Products</h3>
              <p className="text-neutral-700 text-sm mt-1">{error}</p>
            </div>
            <button
              onClick={() => dispatch(fetchProducts({ search: debouncedSearch, sort: sortOption }))}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl text-sm transition shadow-xs cursor-pointer"
            >
              Try Again
            </button>
          </GlassCard>
        )}

        {/* STATE 2: Loading Skeleton Grid */}
        {status === 'loading' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <GlassCard key={idx} className="p-4 space-y-4 animate-pulse">
                <div className="w-full h-48 bg-neutral-200/50 rounded-xl"></div>
                <div className="h-4 bg-neutral-200/50 rounded w-3/4"></div>
                <div className="h-3 bg-neutral-200/50 rounded w-1/2"></div>
                <div className="flex justify-between items-center pt-2">
                  <div className="h-6 bg-neutral-200/50 rounded w-1/3"></div>
                  <div className="h-9 bg-neutral-200/50 rounded-xl w-24"></div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* STATE 3: Empty Results */}
        {status === 'succeeded' && products.length === 0 && (
          <GlassCard className="p-12 text-center space-y-4 max-w-md mx-auto">
            <div className="text-4xl">🔍</div>
            <h3 className="text-xl font-bold text-neutral-900">No Products Found</h3>
            <p className="text-neutral-600 text-sm">
              We couldn't find any products matching "{debouncedSearch}". Try resetting your search filters.
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="px-4 py-2 glass-btn-secondary rounded-xl text-sm font-semibold cursor-pointer"
              >
                Clear Search Filter
              </button>
            )}
          </GlassCard>
        )}

        {/* SUCCESS STATE: Glass Product Cards Grid */}
        {status === 'succeeded' && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => {
              const isOutOfStock = product.stock === 0;
              const isAdding = addingId === product._id;

              return (
                <GlassCard
                  key={product._id}
                  hoverEffect
                  className="group p-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Product Image & Badges */}
                    <div className="relative w-full h-48 rounded-xl overflow-hidden bg-neutral-100/80 flex items-center justify-center border border-white/60">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                        loading="lazy"
                      />
                      {isOutOfStock && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center p-2">
                          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 border border-rose-200 text-rose-700 shadow-xs">
                            Out of Stock
                          </span>
                        </div>
                      )}
                      {!isOutOfStock && (
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/90 backdrop-blur-md border border-white text-neutral-800 shadow-xs">
                          {product.category}
                        </span>
                      )}
                    </div>

                    {/* Product Title & Stock Info */}
                    <div>
                      <h3 className="font-bold text-neutral-900 text-base leading-snug group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-neutral-600 mt-1 font-medium">
                        Stock:{' '}
                        <span
                          className={isOutOfStock ? 'text-rose-600 font-bold' : 'text-neutral-800'}
                        >
                          {product.stock} units
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Price & Action Button */}
                  <div className="pt-4 flex items-center justify-between border-t border-neutral-200/60 mt-4">
                    <div>
                      <span className="text-[10px] text-neutral-500 block font-bold uppercase tracking-wider">
                        Price
                      </span>
                      <span className="text-xl font-black text-neutral-900">
                        ₹{product.price}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={isOutOfStock || isAdding}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs ${
                        isOutOfStock
                          ? 'bg-neutral-200/70 border border-neutral-300/80 text-neutral-400 cursor-not-allowed'
                          : isAdding
                          ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-[0.98] cursor-pointer'
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
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
