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
import GlassCard from '../components/GlassCard';
import { TrashIcon, CartIcon } from '../components/Icons';

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
    <div className="min-h-[calc(100vh-4rem)] text-neutral-900 p-4 sm:p-6 font-sans">
      <div className="max-w-3xl mx-auto space-y-5">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/60 pb-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black uppercase text-neutral-900 tracking-tight">
              Shopping Cart
            </h1>
            {items.length > 0 && (
              <p className="text-xs text-neutral-600 mt-0.5 font-medium">
                {runningItemCount} {runningItemCount === 1 ? 'item' : 'items'} currently in your cart
              </p>
            )}
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 hover:text-indigo-700 transition"
          >
            <span>←</span>
            <span>Back to Shop</span>
          </Link>
        </div>

        {/* Surface Error Banner */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50/80 border border-rose-200 text-rose-700 text-xs flex items-center justify-between gap-4 backdrop-blur-xs">
            <div className="flex items-center gap-2 font-bold">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
            <button
              onClick={() => dispatch(clearCartError())}
              className="text-xs font-bold text-rose-700 hover:underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* STATE 1: Fetch Error State */}
        {status === 'failed' && items.length === 0 && (
          <GlassCard className="p-8 text-center space-y-4 max-w-md mx-auto">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xl mx-auto shadow-xs">
              ⚠️
            </div>
            <h3 className="text-base font-bold text-neutral-900">Could Not Load Cart</h3>
            <p className="text-neutral-600 text-xs font-medium">{error || 'An unexpected error occurred.'}</p>
            <button
              onClick={() => dispatch(fetchCart())}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition shadow-xs cursor-pointer active:scale-95"
            >
              Try Again
            </button>
          </GlassCard>
        )}

        {/* STATE 2: Loading State */}
        {status === 'loading' && items.length === 0 && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <GlassCard key={idx} className="p-3.5 flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-neutral-200/50 rounded-lg"></div>
                  <div className="space-y-1.5">
                    <div className="h-3.5 bg-neutral-200/50 rounded w-36"></div>
                    <div className="h-2.5 bg-neutral-200/50 rounded w-20"></div>
                  </div>
                </div>
                <div className="h-7 bg-neutral-200/50 rounded w-24"></div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* STATE 3: Empty Cart State */}
        {status === 'succeeded' && items.length === 0 && (
          <GlassCard className="p-10 text-center space-y-4 max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto shadow-xs">
              <CartIcon size={28} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-neutral-900">Your Cart is Empty</h3>
              <p className="text-neutral-600 text-xs font-medium">
                Looks like you haven't added any products to your cart yet.
              </p>
            </div>
            <Link
              to="/shop"
              className="inline-block px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition shadow-xs active:scale-95"
            >
              Browse Shop
            </Link>
          </GlassCard>
        )}

        {/* SUCCESS STATE: Compact Cart Items List & Order Summary */}
        {items.length > 0 && (
          <div className="space-y-5">
            <GlassCard className="divide-y divide-neutral-200/60 overflow-hidden">
              {items.map((item) => {
                const stockCeilingReached = item.quantity >= item.product.stock;

                return (
                  <div
                    key={item.product._id}
                    className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/40 transition"
                  >
                    {/* Product Info */}
                    <div className="flex items-center gap-3">
                      {item.product.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded-lg bg-neutral-100 border border-white flex-shrink-0 shadow-xs"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-400 text-base font-bold">
                          📦
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-neutral-900 text-sm leading-snug">
                          {item.product.name}
                        </h3>
                        <p className="text-[11px] text-neutral-500 font-medium">
                          ₹{item.product.price} each ·{' '}
                          <span className="text-neutral-700 font-semibold">{item.product.category}</span>
                        </p>
                        {stockCeilingReached && (
                          <span className="inline-block text-[10px] font-bold text-amber-800 bg-amber-50/80 border border-amber-200/80 px-1.5 py-0.5 rounded">
                            Stock limit ({item.product.stock})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls, Line Total & Remove Action */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-200/60">
                      {/* +/- Quantity Controls */}
                      <div className="flex items-center gap-1 bg-white/60 rounded-lg p-0.5 border border-white/90 shadow-xs">
                        <button
                          onClick={() => handleQuantityDecrease(item.product._id, item.quantity)}
                          className="w-7 h-7 flex items-center justify-center rounded text-neutral-700 hover:bg-white text-xs font-bold transition active:scale-95 cursor-pointer"
                          title="Decrease Quantity"
                        >
                          -
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-neutral-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityIncrease(item.product._id, item.quantity, item.product.stock)
                          }
                          disabled={stockCeilingReached}
                          className={`w-7 h-7 flex items-center justify-center rounded text-xs font-bold transition ${
                            stockCeilingReached
                              ? 'text-neutral-300 bg-transparent cursor-not-allowed'
                              : 'text-neutral-700 hover:bg-white active:scale-95 cursor-pointer'
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
                      <div className="text-right min-w-[75px]">
                        <span className="text-[9px] text-neutral-400 block font-bold uppercase tracking-wider">
                          Line Total
                        </span>
                        <span className="font-black text-neutral-900 text-sm">
                          ₹{item.itemTotal}
                        </span>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemove(item.product._id)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        title="Remove item from cart"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </GlassCard>

            {/* Server-Calculated Order Summary */}
            <GlassCard className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-0.5 text-center sm:text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                  Server-Calculated Total ({runningItemCount}{' '}
                  {runningItemCount === 1 ? 'item' : 'items'})
                </span>
                <div className="flex items-baseline justify-center sm:justify-start gap-2">
                  <h2 className="text-2xl font-black text-neutral-900">₹{total}</h2>
                  <span className="text-[11px] text-emerald-700 font-bold">
                    ✓ Verified on server
                  </span>
                </div>
              </div>

              <button className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition shadow-sm cursor-pointer active:scale-95">
                Proceed to Checkout
              </button>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
