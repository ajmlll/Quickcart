import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch, logout } from '../store';

export const HomePage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center space-y-6">
        <h1 className="text-3xl font-extrabold text-white">🛍️ QuickCart</h1>
        <p className="text-slate-400 text-sm">
          Welcome to QuickCart! Modern e-commerce experience powered by React & Node.js.
        </p>

        {user ? (
          <div className="space-y-4">
            <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/50 text-left text-sm">
              <p><span className="text-slate-400">Logged in as:</span> <strong className="text-indigo-400">{user.name}</strong></p>
              <p><span className="text-slate-400">Email:</span> {user.email}</p>
              <p><span className="text-slate-400">Role:</span> <span className="uppercase text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">{user.role}</span></p>
            </div>
            <div className="flex gap-3 justify-center">
              <Link to="/cart" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg text-sm transition">
                View Cart 🛒
              </Link>
              <button
                onClick={() => dispatch(logout())}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg text-sm transition"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-4 justify-center">
            <Link to="/login" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg text-sm transition">
              Login
            </Link>
            <Link to="/register" className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg text-sm transition">
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
