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
    <div className="min-h-[calc(100vh-4rem)] bg-neutral-50 text-neutral-900 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              Your Shopping Cart
            </h1>
            {items.length > 0 && (
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                {runningItemCount} {runningItemCount === 1 ? 'item' : 'items'} currently in your cart
              </p>
            )}
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition"
          >
            <span>←</span>
            <span>Back to Catalog</span>
          </Link>
        </div>

        {/* Surface Error Banner */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-medium">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
            <button
              onClick={() => dispatch(clearCartError())}
              className="text-xs font-semibold text-rose-700 hover:underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* STATE 1: Fetch Error State */}
        {status === 'failed' && items.length === 0 && (
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-8 sm:p-12 text-center space-y-4 max-w-md mx-auto shadow-xs">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-2xl mx-auto">
              💥
            </div>
            <h3 className="text-lg font-bold text-neutral-900">Could Not Load Cart</h3>
            <p className="text-neutral-600 text-sm">{error || 'An unexpected error occurred.'}</p>
            <button
              onClick={() => dispatch(fetchCart())}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl text-sm transition shadow-xs cursor-pointer"
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
                className="bg-white border border-neutral-200/80 rounded-2xl p-4 flex items-center justify-between animate-pulse shadow-xs"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-neutral-100 rounded-xl"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-neutral-100 rounded w-40"></div>
                    <div className="h-3 bg-neutral-100 rounded w-20"></div>
                  </div>
                </div>
                <div className="h-8 bg-neutral-100 rounded w-28"></div>
              </div>
            ))}
          </div>
        )}

        {/* STATE 3: Empty Cart State */}
        {status === 'succeeded' && items.length === 0 && (
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-12 text-center space-y-5 max-w-md mx-auto shadow-xs">
            <div className="text-5xl">🛒</div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-neutral-900">Your Cart is Empty</h3>
              <p className="text-neutral-500 text-sm">
                Looks like you haven't added any products to your cart yet.
              </p>
            </div>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition shadow-xs"
            >
              Browse Catalog
            </Link>
          </div>
        )}

        {/* SUCCESS STATE: Cart Items List & Order Summary */}
        {items.length > 0 && (
          <div className="space-y-6">
            <div className="bg-white border border-neutral-200/80 rounded-2xl divide-y divide-neutral-100 overflow-hidden shadow-xs">
              {items.map((item) => {
                const stockCeilingReached = item.quantity >= item.product.stock;

                return (
                  <div
                    key={item.product._id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50/50 transition"
                  >
                    {/* Product Info */}
                    <div className="flex items-center gap-4">
                      {item.product.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-xl bg-neutral-100 border border-neutral-200 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-400 text-xl font-bold">
                          📦
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-neutral-900 text-base leading-snug">
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          ₹{item.product.price} each ·{' '}
                          <span className="text-neutral-600">Category: {item.product.category}</span>
                        </p>
                        {stockCeilingReached && (
                          <span className="inline-block mt-1 text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                            Stock limit reached ({item.product.stock} available)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls, Line Total & Remove Action */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                      {/* +/- Quantity Controls */}
                      <div className="flex items-center gap-1 bg-neutral-50 rounded-xl p-1 border border-neutral-200">
                        <button
                          onClick={() => handleQuantityDecrease(item.product._id, item.quantity)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-700 hover:bg-neutral-200 text-base font-bold transition active:scale-95 cursor-pointer"
                          title="Decrease Quantity"
                        >
                          -
                        </button>
                        <span className="w-9 text-center text-sm font-bold text-neutral-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityIncrease(item.product._id, item.quantity, item.product.stock)
                          }
                          disabled={stockCeilingReached}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg text-base font-bold transition ${
                            stockCeilingReached
                              ? 'text-neutral-300 bg-neutral-50 cursor-not-allowed'
                              : 'text-neutral-700 hover:bg-neutral-200 active:scale-95 cursor-pointer'
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
                        <span className="text-[10px] text-neutral-400 block font-semibold uppercase tracking-wider">
                          Line Total
                        </span>
                        <span className="font-extrabold text-neutral-900 text-base">
                          ₹{item.itemTotal}
                        </span>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemove(item.product._id)}
                        className="p-2 rounded-xl text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
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
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Server-Calculated Total ({runningItemCount}{' '}
                  {runningItemCount === 1 ? 'item' : 'items'})
                </span>
                <div className="flex items-baseline justify-center sm:justify-start gap-2">
                  <h2 className="text-3xl font-extrabold text-neutral-900">₹{total}</h2>
                  <span className="text-xs text-emerald-700 font-medium">
                    ✓ Verified on server
                  </span>
                </div>
              </div>

              <button className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition shadow-xs cursor-pointer">
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
