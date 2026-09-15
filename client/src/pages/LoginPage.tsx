import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector, login, clearError } from '../store';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [clientError, setClientError] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const validate = (): boolean => {
    if (!email.trim()) {
      setClientError('Email address is required.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setClientError('Please enter a valid email address.');
      return false;
    }
    if (!password) {
      setClientError('Password is required.');
      return false;
    }
    setClientError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await dispatch(login({ email: email.trim(), password }));
    if (login.fulfilled.match(result)) {
      navigate('/');
    }
  };

  const activeError = clientError || error;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-neutral-50 text-neutral-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-neutral-200/80 rounded-2xl p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center text-2xl mx-auto mb-3">
            🔑
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Welcome Back</h1>
          <p className="text-neutral-500 text-sm">Sign in to manage your QuickCart account</p>
        </div>

        {/* Visible Alert Area for Client & Server Errors */}
        {activeError && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm space-y-1">
            <div className="flex items-center gap-2 font-semibold">
              <span>⚠️</span>
              <span>Authentication Error</span>
            </div>
            <p className="text-xs text-rose-600 leading-relaxed">{activeError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (clientError) setClientError(null);
              }}
              placeholder="admin@example.com"
              className="w-full px-4 py-3 bg-white border border-neutral-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-xl text-neutral-900 placeholder-neutral-400 text-sm transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (clientError) setClientError(null);
              }}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-white border border-neutral-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-xl text-neutral-900 placeholder-neutral-400 text-sm transition"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium rounded-xl text-sm transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            {status === 'loading' ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="text-center text-xs text-neutral-500 pt-2">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-indigo-600 font-medium hover:underline">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
