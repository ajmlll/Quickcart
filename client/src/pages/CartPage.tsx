import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector, fetchCart, updateCartItem, removeFromCart } from '../store';

export const CartPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, total, status, error } = useAppSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h1 className="text-2xl font-bold text-white">Your Shopping Cart</h1>
          <Link to="/" className="text-sm text-indigo-400 hover:underline">
            ← Continue Shopping
          </Link>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
            {error}
          </div>
        )}

        {status === 'loading' && items.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">Loading your cart...</div>
        ) : items.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
            <p className="text-slate-400">Your cart is currently empty.</p>
            <Link to="/" className="inline-block px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-sm transition">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl divide-y divide-slate-800 overflow-hidden">
              {items.map((item) => (
                <div key={item.product._id} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {item.product.image && (
                      <img src={item.product.image} alt={item.product.name} className="w-14 h-14 object-cover rounded-lg bg-slate-800" />
                    )}
                    <div>
                      <h3 className="font-semibold text-white text-sm">{item.product.name}</h3>
                      <p className="text-xs text-slate-400">₹{item.product.price} each</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1 border border-slate-700">
                      <button
                        onClick={() =>
                          item.quantity > 1
                            ? dispatch(updateCartItem({ productId: item.product._id, quantity: item.quantity - 1 }))
                            : dispatch(removeFromCart(item.product._id))
                        }
                        className="w-7 h-7 flex items-center justify-center rounded text-slate-300 hover:bg-slate-700 text-sm font-bold"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-medium text-white">{item.quantity}</span>
                      <button
                        onClick={() => dispatch(updateCartItem({ productId: item.product._id, quantity: item.quantity + 1 }))}
                        className="w-7 h-7 flex items-center justify-center rounded text-slate-300 hover:bg-slate-700 text-sm font-bold"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right min-w-[80px]">
                      <span className="block font-bold text-indigo-400 text-sm">₹{item.itemTotal}</span>
                    </div>

                    <button
                      onClick={() => dispatch(removeFromCart(item.product._id))}
                      className="text-slate-500 hover:text-rose-400 p-1 transition"
                      title="Remove Item"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex justify-between items-center">
              <div>
                <span className="text-slate-400 text-sm">Server-Calculated Total:</span>
                <h2 className="text-2xl font-black text-white">₹{total}</h2>
              </div>
              <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm transition shadow-lg shadow-emerald-600/20">
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
