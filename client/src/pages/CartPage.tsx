import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  useAppDispatch,
  useAppSelector,
  fetchCart,
  updateCartItem,
  removeFromCart,
  clearCartError,
} from '../store';

export const CartPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, total, status, error } = useAppSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const runningItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleQuantityIncrease = (productId: string, currentQuantity: number, stock: number) => {
    if (currentQuantity < stock) {
      dispatch(clearCartError());
      dispatch(updateCartItem({ productId, quantity: currentQuantity + 1 }));
    }
  };

  const handleQuantityDecrease = (productId: string, currentQuantity: number) => {
    dispatch(clearCartError());
    if (currentQuantity > 1) {
      dispatch(updateCartItem({ productId, quantity: currentQuantity - 1 }));
    } else {
      dispatch(removeFromCart(productId));
    }
  };

  const handleRemove = (productId: string) => {
    dispatch(clearCartError());
    dispatch(removeFromCart(productId));
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Your Shopping Cart
            </h1>
            {items.length > 0 && (
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                {runningItemCount} {runningItemCount === 1 ? 'item' : 'items'} currently in your cart
              </p>
            )}
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition"
          >
            <span>←</span>
            <span>Back to Products</span>
          </Link>
        </div>

        {/* Surface Error Banner (e.g. 409 Stock Limit Exceeded or fetch error) */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
            <button
              onClick={() => dispatch(clearCartError())}
              className="text-xs font-semibold text-rose-400 hover:text-rose-300 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* STATE 1: Fetch Error State with Retry Button */}
        {status === 'failed' && items.length === 0 && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center space-y-4 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-2xl mx-auto">
              💥
            </div>
            <h3 className="text-lg font-bold text-white">Could Not Load Cart</h3>
            <p className="text-slate-400 text-sm">{error || 'An unexpected error occurred.'}</p>
            <button
              onClick={() => dispatch(fetchCart())}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-sm transition shadow-lg shadow-indigo-600/20"
            >
              Try Again
            </button>
          </div>
        )}

        {/* STATE 2: Loading State */}
        {status === 'loading' && items.length === 0 && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between animate-pulse"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-slate-800 rounded-xl"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-800 rounded w-40"></div>
                    <div className="h-3 bg-slate-800 rounded w-20"></div>
                  </div>
                </div>
                <div className="h-8 bg-slate-800 rounded w-28"></div>
              </div>
            ))}
          </div>
        )}

        {/* STATE 3: Empty Cart State */}
        {status === 'succeeded' && items.length === 0 && (
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-12 text-center space-y-5 max-w-md mx-auto">
            <div className="text-5xl">🛒</div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">Your Cart is Empty</h3>
              <p className="text-slate-400 text-sm">
                Looks like you haven't added any products to your cart yet.
              </p>
            </div>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-xl text-sm transition shadow-lg shadow-indigo-600/25"
            >
              Browse Catalog
            </Link>
          </div>
        )}

        {/* SUCCESS STATE: Cart Items List & Total */}
        {items.length > 0 && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl divide-y divide-slate-800/80 overflow-hidden shadow-xl backdrop-blur-md">
              {items.map((item) => {
                const stockCeilingReached = item.quantity >= item.product.stock;

                return (
                  <div
                    key={item.product._id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/30 transition"
                  >
                    {/* Product Info */}
                    <div className="flex items-center gap-4">
                      {item.product.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-xl bg-slate-800 border border-slate-700/50 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500 text-xl font-bold">
                          📦
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-white text-base leading-snug">
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          ₹{item.product.price} each ·{' '}
                          <span className="text-slate-300">Category: {item.product.category}</span>
                        </p>
                        {stockCeilingReached && (
                          <span className="inline-block mt-1 text-[11px] font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded">
                            Stock limit reached ({item.product.stock} available)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls, Line Total & Remove Action */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                      {/* +/- Quantity Controls */}
                      <div className="flex items-center gap-1.5 bg-slate-800/90 rounded-xl p-1 border border-slate-700/80">
                        <button
                          onClick={() => handleQuantityDecrease(item.product._id, item.quantity)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:bg-slate-700/80 hover:text-white text-base font-bold transition active:scale-95"
                          title="Decrease Quantity"
                        >
                          -
                        </button>
                        <span className="w-9 text-center text-sm font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityIncrease(item.product._id, item.quantity, item.product.stock)
                          }
                          disabled={stockCeilingReached}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg text-base font-bold transition ${
                            stockCeilingReached
                              ? 'text-slate-600 bg-slate-800/40 cursor-not-allowed'
                              : 'text-slate-300 hover:bg-slate-700/80 hover:text-white active:scale-95'
                          }`}
                          title={
                            stockCeilingReached
                              ? `Max stock limit reached (${item.product.stock})`
                              : 'Increase Quantity'
                          }
                        >
                          +
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <div className="text-right min-w-[90px]">
                        <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">
                          Line Total
                        </span>
                        <span className="font-extrabold text-indigo-400 text-base">
                          ₹{item.itemTotal}
                        </span>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemove(item.product._id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                        title="Remove item from cart"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Server-Calculated Order Summary */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl backdrop-blur-xl">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Server-Calculated Total ({runningItemCount}{' '}
                  {runningItemCount === 1 ? 'item' : 'items'})
                </span>
                <div className="flex items-baseline justify-center sm:justify-start gap-2">
                  <h2 className="text-3xl font-black text-white">₹{total}</h2>
                  <span className="text-xs text-emerald-400 font-medium">
                    ✓ Dynamically verified
                  </span>
                </div>
              </div>

              <button className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-emerald-600/25">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
