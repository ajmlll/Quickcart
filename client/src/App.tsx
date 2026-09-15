import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAppDispatch, fetchCurrentUser } from './store';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import ProtectedRoute from './components/ProtectedRoute';

export const App: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Dispatch fetchCurrentUser once on app mount
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
