import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector, type RootState } from '../store';
import {
  fetchAllAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  clearAdminStatus,
} from '../store/adminProductsSlice';
import type { Product } from '../store/productSlice';
import GlassCard from '../components/GlassCard';

export const AdminPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products, status, actionStatus, error, successMessage } = useAppSelector(
    (state: RootState) => state.adminProducts
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAllAdminProducts());
  }, [dispatch]);

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setCategory('Accessories');
    setPrice('');
    setStock('');
    setImage('');
    setFormError(null);
    dispatch(clearAdminStatus());
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setCategory(product.category);
    setPrice(String(product.price));
    setStock(String(product.stock));
    setImage(product.image || '');
    setFormError(null);
    dispatch(clearAdminStatus());
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormError(null);
  };

  const validateForm = (): boolean => {
    if (!name.trim()) {
      setFormError('Product name is required.');
      return false;
    }
    if (!category.trim()) {
      setFormError('Category is required.');
      return false;
    }
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      setFormError('Price must be a valid positive number greater than 0.');
      return false;
    }
    const numStock = parseInt(stock, 10);
    if (isNaN(numStock) || numStock < 0) {
      setFormError('Stock must be a valid non-negative integer.');
      return false;
    }
    setFormError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      name: name.trim(),
      category: category.trim(),
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      image: image.trim() || 'https://picsum.photos/seed/product/400',
    };

    if (editingProduct) {
      const res = await dispatch(
        updateAdminProduct({ id: editingProduct._id, data: payload })
      );
      if (updateAdminProduct.fulfilled.match(res)) {
        closeModal();
      }
    } else {
      const res = await dispatch(createAdminProduct(payload));
      if (createAdminProduct.fulfilled.match(res)) {
        closeModal();
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;
    const res = await dispatch(deleteAdminProduct(deletingProduct._id));
    if (deleteAdminProduct.fulfilled.match(res)) {
      setDeletingProduct(null);
    }
  };

  const filteredProducts = products.filter(
    (p: Product) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] text-neutral-900 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header Banner */}
        <GlassCard className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/85 backdrop-blur-sm border border-white">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800">
                Admin Control
              </span>
              <span className="text-xs text-neutral-500">Real MongoDB Synchronization</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              Product Inventory Management
            </h1>
          </div>

          <button
            onClick={openAddModal}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition shadow-sm active:scale-95 flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <span>+</span>
            <span>Add New Product</span>
          </button>
        </GlassCard>

        {/* Global Feedback Banner */}
        {(successMessage || error) && (
          <div
            className={`p-4 rounded-xl border text-sm flex items-center justify-between gap-4 ${
              successMessage
                ? 'bg-emerald-50/90 border-emerald-200 text-emerald-800'
                : 'bg-rose-50/90 border-rose-200 text-rose-800'
            }`}
          >
            <div className="flex items-center gap-2 font-semibold">
              <span>{successMessage ? '✅' : '⚠️'}</span>
              <span>{successMessage || error}</span>
            </div>
            <button
              onClick={() => dispatch(clearAdminStatus())}
              className="text-xs font-bold hover:underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Inventory Search Controls */}
        <GlassCard className="p-4 flex items-center justify-between gap-4 bg-white/80">
          <div className="relative w-full sm:w-80">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">
              🔍
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter inventory by name or category..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-neutral-300 focus:border-indigo-600 rounded-xl text-neutral-900 text-sm focus:outline-none transition"
            />
          </div>
          <span className="text-xs font-bold text-neutral-600 hidden sm:inline">
            Total Items: <strong className="text-neutral-900">{filteredProducts.length}</strong>
          </span>
        </GlassCard>

        {/* Loading State */}
        {status === 'loading' && (
          <GlassCard className="p-12 text-center space-y-3 bg-white/80">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-neutral-600 text-sm font-semibold">Fetching MongoDB products...</p>
          </GlassCard>
        )}

        {/* Empty State */}
        {status === 'succeeded' && filteredProducts.length === 0 && (
          <GlassCard className="p-12 text-center space-y-4 bg-white/80">
            <div className="text-4xl">📦</div>
            <h3 className="text-lg font-bold text-neutral-900">No Products Found</h3>
            <p className="text-neutral-600 text-sm">
              {searchTerm ? `No matches for "${searchTerm}".` : 'Your database catalog is currently empty.'}
            </p>
          </GlassCard>
        )}

        {/* Desktop Table (High Data Density & Readability) */}
        {status === 'succeeded' && filteredProducts.length > 0 && (
          <>
            <div className="hidden sm:block overflow-hidden bg-white/85 backdrop-blur-sm border border-white rounded-2xl shadow-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-100/70 border-b border-neutral-200/80 text-[11px] font-extrabold uppercase tracking-wider text-neutral-600">
                    <th className="py-3 px-4">Item</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200/60 text-sm">
                  {filteredProducts.map((product: Product) => {
                    const isOutOfStock = product.stock === 0;
                    return (
                      <tr key={product._id} className="hover:bg-indigo-50/30 transition">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded-lg bg-neutral-100 border border-neutral-200 flex-shrink-0"
                            />
                            <div>
                              <span className="font-bold text-neutral-900 block leading-tight">
                                {product.name}
                              </span>
                              <span className="text-[11px] text-neutral-400 font-mono">
                                ID: {product._id.substring(0, 8)}...
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-neutral-100 border border-neutral-200 text-neutral-700">
                            {product.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-black text-neutral-900">
                          ₹{product.price}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              isOutOfStock
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : product.stock < 5
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {isOutOfStock ? 'Out of Stock (0)' : `${product.stock} units`}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(product)}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300 transition cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => setDeletingProduct(product)}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Card List */}
            <div className="sm:hidden space-y-4">
              {filteredProducts.map((product: Product) => {
                const isOutOfStock = product.stock === 0;
                return (
                  <GlassCard key={product._id} className="p-4 space-y-3 bg-white/85">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-xl bg-neutral-100 border border-neutral-200"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-neutral-900 truncate">{product.name}</h4>
                        <span className="text-xs text-neutral-500">{product.category}</span>
                      </div>
                      <span className="font-black text-neutral-900 text-base">₹{product.price}</span>
                    </div>

                    <div className="flex items-center justify-between border-t border-neutral-200/60 pt-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          isOutOfStock ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isOutOfStock ? 'Out of Stock' : `Stock: ${product.stock}`}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-neutral-100 text-neutral-800 border border-neutral-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeletingProduct(product)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </>
        )}

        {/* Add / Edit Form Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-xs">
            <div className="w-full max-w-lg bg-white/95 backdrop-blur-md rounded-2xl border border-white p-6 shadow-xl space-y-5 animate-in fade-in zoom-in duration-150">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                <h3 className="text-lg font-bold text-neutral-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button
                  onClick={closeModal}
                  className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 text-lg cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  ⚠️ {formError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Wireless Noise Cancelling Headphones"
                    className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-300 focus:bg-white focus:border-indigo-600 rounded-xl text-sm transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Category *
                    </label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="e.g. Audio, Wearables"
                      className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-300 focus:bg-white focus:border-indigo-600 rounded-xl text-sm transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g. 2499"
                      className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-300 focus:bg-white focus:border-indigo-600 rounded-xl text-sm transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      placeholder="e.g. 10"
                      className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-300 focus:bg-white focus:border-indigo-600 rounded-xl text-sm transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Image URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="https://picsum.photos/..."
                      className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-300 focus:bg-white focus:border-indigo-600 rounded-xl text-sm transition"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionStatus === 'submitting'}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white shadow-xs cursor-pointer"
                  >
                    {actionStatus === 'submitting'
                      ? 'Saving...'
                      : editingProduct
                      ? 'Update Product'
                      : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deletingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-xs">
            <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xl font-bold">
                  🗑️
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900">Confirm Product Deletion</h3>
                  <p className="text-xs text-neutral-500">This action will permanently delete the item from MongoDB.</p>
                </div>
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-sm">
                Deleting: <strong className="text-neutral-900">{deletingProduct.name}</strong> (₹{deletingProduct.price})
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setDeletingProduct(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={actionStatus === 'submitting'}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white shadow-xs cursor-pointer"
                >
                  {actionStatus === 'submitting' ? 'Deleting...' : 'Delete Permanently'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
