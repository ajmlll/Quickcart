import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './db.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';

dotenv.config();

const app = express();

// CORS configuration
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
  })
);

// Body parsing & cookie parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Base health / placeholder check
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'QuickCart API Server is running',
    frontend: clientOrigin,
    endpoints: {
      health: '/health',
      auth: '/auth',
      products: '/products',
      cart: '/cart',
    },
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'QuickCart server is running' });
});

// Routes
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);

// 404 Fallback Middleware for unmapped routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Centralized error-handling middleware (last in the middleware chain)
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Failed to connect to DB, starting server anyway:', err.message);
      app.listen(PORT, () => {
        console.log(`Server running without active DB connection on port ${PORT}`);
      });
    });
}

export default app;
