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
import AuthRequiredModal from '../components/AuthRequiredModal';
import { SearchIcon, FilterIcon, CartIcon, CheckIcon, CloseIcon } from '../components/Icons';

const CATEGORIES = ['All', 'Accessories', 'Audio', 'Office', 'Displays', 'Storage', 'Wearables'];
const ITEMS_PER_PAGE = 9;

export const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortOption, setSortOption] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user } = useAppSelector((state) => state.auth);
  const { products, status, error } = useAppSelector((state) => state.products);

  // Debounce search term by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch products whenever debouncedSearch, selectedCategory, or sortOption changes
  useEffect(() => {
    const params: Record<string, any> = {
      search: debouncedSearch,
      sort: sortOption,
    };
    if (selectedCategory !== 'All') {
      params.category = selectedCategory;
    }
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;

    dispatch(fetchProducts(params));
  }, [dispatch, debouncedSearch, selectedCategory, sortOption, minPrice, maxPrice]);

  // Reset page to 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, minPrice, maxPrice, inStockOnly, sortOption]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setSelectedCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
    setSortOption('');
    setCurrentPage(1);
  };

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    try {
      setAddingId(product._id);
      await dispatch(addToCart({ productId: product._id, quantity: 1 })).unwrap();
    } catch {
      // Error handled via cart slice
    } finally {
      setTimeout(() => setAddingId(null), 600);
    }
  };

  // Filter in-stock only client side if toggled
  const filteredProducts = products.filter((p) => {
    if (inStockOnly && p.stock === 0) return false;
    return true;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-[calc(100vh-4rem)] text-neutral-900 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header Bar (Modelled after reference design) */}
        <GlassCard className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/85">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight uppercase">
              ALL PRODUCTS
            </h1>
            <p className="text-sm font-semibold text-neutral-500 mt-1">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'Product Found' : 'Products Found'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-neutral-800 text-xs font-bold flex items-center gap-2 cursor-pointer"
            >
              <FilterIcon size={16} />
              <span>{mobileFilterOpen ? 'Close Filters' : 'Filter Options'}</span>
            </button>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                <SearchIcon size={16} />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-7 py-2 bg-white/80 border border-neutral-300 focus:border-neutral-900 rounded-xl text-neutral-900 text-xs font-medium focus:outline-none transition"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                >
                  <CloseIcon size={14} />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-neutral-700 whitespace-nowrap">Sort By:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="px-3.5 py-2 bg-white/90 border border-neutral-300 rounded-xl text-neutral-900 text-xs font-semibold focus:outline-none focus:border-neutral-900 transition cursor-pointer"
              >
                <option value="">Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name: A to Z</option>
                <option value="name_desc">Name: Z to A</option>
              </select>
            </div>
          </div>
        </GlassCard>

        {/* Main Content Layout: Left Filter Sidebar + Right Products Grid */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar Filters (Fixed / Sticky on Desktop, Drawer on Mobile) */}
          <aside
            className={`w-full lg:w-64 flex-shrink-0 space-y-6 lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)] lg:overflow-y-auto ${
              mobileFilterOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <GlassCard className="p-5 space-y-6 bg-white/85">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200/80">
                <h2 className="font-black text-sm uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                  <span>⚡</span>
                  <span>FILTERS</span>
                </h2>
                {(selectedCategory !== 'All' || minPrice || maxPrice || inStockOnly || searchTerm) && (
                  <button
                    onClick={handleClearFilters}
                    className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-600">
                  CATEGORY
                </h3>
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-between cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-neutral-900 text-white font-bold shadow-xs'
                          : 'text-neutral-700 hover:bg-neutral-100/80'
                      }`}
                    >
                      <span>{cat}</span>
                      {selectedCategory === cat && <span className="text-[10px]">✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="space-y-3 pt-4 border-t border-neutral-200/60">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-600">
                  PRICE RANGE (₹)
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">
                      Min Price
                    </label>
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      placeholder="₹ 0"
                      className="w-full px-2.5 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs font-medium focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">
                      Max Price
                    </label>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder="₹ 20000"
                      className="w-full px-2.5 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs font-medium focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>
              </div>

              {/* In Stock Only Checkbox */}
              <div className="pt-4 border-t border-neutral-200/60">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-neutral-800">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-neutral-300 cursor-pointer"
                  />
                  <span>In Stock Items Only</span>
                </label>
              </div>
            </GlassCard>
          </aside>

          {/* Right Product Grid Column */}
          <div className="flex-1 space-y-6">
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
                  className="px-5 py-2.5 bg-neutral-900 hover:bg-black text-white font-medium rounded-xl text-sm transition shadow-xs cursor-pointer"
                >
                  Try Again
                </button>
              </GlassCard>
            )}

            {/* STATE 2: Loading Skeletons */}
            {status === 'loading' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <GlassCard key={idx} className="p-4 space-y-4 animate-pulse bg-white/80">
                    <div className="w-full h-48 bg-neutral-200/60 rounded-xl"></div>
                    <div className="h-4 bg-neutral-200/60 rounded w-3/4"></div>
                    <div className="h-3 bg-neutral-200/60 rounded w-1/2"></div>
                    <div className="h-10 bg-neutral-200/60 rounded-xl w-full pt-2"></div>
                  </GlassCard>
                ))}
              </div>
            )}

            {/* STATE 3: Empty State */}
            {status === 'succeeded' && currentProducts.length === 0 && (
              <GlassCard className="p-12 text-center space-y-4 max-w-md mx-auto bg-white/85">
                <div className="text-4xl">🔍</div>
                <h3 className="text-xl font-bold text-neutral-900">No Products Found</h3>
                <p className="text-neutral-600 text-sm">
                  We couldn't find any products matching your current filter criteria.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Reset All Filters
                </button>
              </GlassCard>
            )}

            {/* SUCCESS STATE: Product Listing Grid (Modelled after reference image) */}
            {status === 'succeeded' && currentProducts.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {currentProducts.map((product) => {
                    const isOutOfStock = product.stock === 0;
                    const isAdding = addingId === product._id;

                    return (
                      <GlassCard
                        key={product._id}
                        hoverEffect
                        className="group p-4 flex flex-col justify-between bg-white/85 border border-white/90 shadow-xs"
                      >
                        <div className="space-y-3">
                          {/* Image Container */}
                          <div className="relative w-full h-52 rounded-xl overflow-hidden bg-neutral-100/90 flex items-center justify-center border border-neutral-100">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                              loading="lazy"
                            />
                            {isOutOfStock ? (
                              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-xs">
                                OUT OF STOCK
                              </div>
                            ) : (
                              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-neutral-900/90 text-white backdrop-blur-xs shadow-xs">
                                {product.category}
                              </div>
                            )}
                          </div>

                          {/* Product Details */}
                          <div className="space-y-1">
                            <h3 className="font-black text-neutral-900 text-base uppercase tracking-tight leading-snug group-hover:text-indigo-600 transition-colors line-clamp-1">
                              {product.name}
                            </h3>
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-black text-neutral-900">
                                ₹{product.price.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Full-width ADD TO CART Button (Reference design pattern) */}
                        <div className="pt-4 border-t border-neutral-200/60 mt-4">
                          <button
                            onClick={() => handleAddToCart(product)}
                            disabled={isOutOfStock || isAdding}
                            className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-xs ${
                              isOutOfStock
                                ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed border border-neutral-300'
                                : isAdding
                                ? 'bg-emerald-600 text-white'
                                : 'bg-black hover:bg-neutral-800 text-white active:scale-[0.98] cursor-pointer'
                            }`}
                          >
                            {isAdding ? (
                              <>
                                <CheckIcon size={16} />
                                <span>ADDED TO CART</span>
                              </>
                            ) : isOutOfStock ? (
                              <span>OUT OF STOCK</span>
                            ) : (
                              <>
                                <CartIcon size={16} />
                                <span>ADD TO CART</span>
                              </>
                            )}
                          </button>
                        </div>
                      </GlassCard>
                    );
                  })}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <GlassCard className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/85">
                    <span className="text-xs font-bold text-neutral-600">
                      Showing <strong className="text-neutral-900">{startIndex + 1}</strong> -{' '}
                      <strong className="text-neutral-900">
                        {Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length)}
                      </strong>{' '}
                      of <strong className="text-neutral-900">{filteredProducts.length}</strong> Products
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-neutral-100 disabled:opacity-40 border border-neutral-300 text-neutral-800 cursor-pointer disabled:cursor-not-allowed"
                      >
                        ‹ Prev
                      </button>

                      {Array.from({ length: totalPages }).map((_, idx) => {
                        const pageNum = idx + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-8 h-8 rounded-xl text-xs font-bold transition ${
                              currentPage === pageNum
                                ? 'bg-black text-white shadow-xs'
                                : 'bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-neutral-100 disabled:opacity-40 border border-neutral-300 text-neutral-800 cursor-pointer disabled:cursor-not-allowed"
                      >
                        Next ›
                      </button>
                    </div>
                  </GlassCard>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <AuthRequiredModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        title="Login Required"
        message="Please log in or create an account to add items to your shopping cart."
      />
    </div>
  );
};

export default HomePage;
