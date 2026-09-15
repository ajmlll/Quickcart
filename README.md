# QuickCart

QuickCart is a modern full-stack e-commerce web application built using a Node.js/Express backend with MongoDB and a React/TypeScript frontend with Tailwind CSS and Redux Toolkit.

---

## 🚀 Tech Stack

### Frontend (`/client`)
- **Core Framework:** React 19 + TypeScript (Vite)
- **Styling:** Tailwind CSS v4
- **State Management:** Redux Toolkit (`@reduxjs/toolkit`, `react-redux`)
- **Routing:** React Router DOM (`react-router-dom`)
- **HTTP Client:** Custom typed `fetch` wrapper (`credentials: 'include'`)

### Backend (`/server`)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database & ODM:** MongoDB & Mongoose
- **Validation:** Zod
- **Authentication & Security:** `bcrypt` (12 rounds), JSON Web Token (`jsonwebtoken`), `cookie-parser`, `cors`
- **Environment Management:** `dotenv`
- **Development Tooling:** `nodemon`

---

## ⚙️ Environment Variables & Setup

### Environment Variables (`server/.env`)
Copy `server/.env.example` to `server/.env` and update the placeholders:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/quickcart
JWT_SECRET=quickcart_super_secret_jwt_key_2026
CLIENT_ORIGIN=http://localhost:5173
```

---

## 🛠️ Step-by-Step Local Setup

### 1. Backend Setup & Seeding

```bash
# Navigate to the server folder
cd server

# Install backend dependencies
npm install

# Create local .env from example template
cp .env.example .env

# Run the standalone database seed script (populates 18 products & admin user)
npm run seed

# Start backend development server (http://localhost:5000)
npm run dev
```

### 2. Frontend Setup

```bash
# Navigate to the client folder (in a new terminal)
cd client

# Install frontend dependencies
npm install

# Start frontend development server (http://localhost:5173)
npm run dev
```

---

## 🔑 Admin Login Credentials

The database seed script initializes the default admin user with the following credentials:

- **Email:** `admin@example.com`
- **Password:** `Admin123!`
- **Role:** `admin`

---

## 💡 Architectural Note on Cart Identifiers

> [!IMPORTANT]
> **Cart Product Line Identifiers:**  
> The `PATCH /cart/:productId` and `DELETE /cart/:productId` endpoints accept the **product's Mongo ObjectId** (`:productId`) directly rather than a separate cart-line ID.  
> Because each user's cart holds at most **one line item per product**, the `productId` uniquely identifies the line item within that specific user's cart.

---

## 📐 Assumptions Made

1. **Monorepo Structure:** Clean separation between `/server` (API services, Mongoose models, controllers) and `/client` (Vite, React, Redux Toolkit, Tailwind CSS).
2. **Cookie-Based Authentication:** JWT tokens are stored in `httpOnly`, `sameSite: 'lax'` cookies named `'token'` (`secure: true` in production) to protect against XSS token theft.
3. **Ownership-Isolation Guarantee:** Every database query for cart operations (`getCart`, `addToCart`, `updateCartItem`, `removeCartItem`) is strictly scoped by `{ user: req.user._id }`.
4. **Server-Side Pricing Authority:** Cart line totals and grand totals are calculated dynamically on the server at request time (`product.price * quantity`). Client-sent prices or totals are never trusted or stored.

---

## 📊 Status: What's Done / What's Partial / What's Left

### ✅ What's Done
- **Monorepo Setup**: Full folder structure with server and client configured.
- **Database & Schemas**: `User`, `Product`, and `Cart` Mongoose models with unique indexes on `user` (Cart) and `email` (User).
- **Authentication System**: `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`, and `GET /auth/me` with Zod validation, `bcrypt` password hashing (12 rounds), auto-creation of empty Cart on registration, and `httpOnly` cookie management.
- **Product Management**: `GET /products` (supports debounced search, min/max price range, and sorting), `POST /products` (Admin), `PATCH /products/:id` (Admin), `DELETE /products/:id` (Admin).
- **Cart System**: `GET /cart`, `POST /cart`, `PATCH /cart/:productId`, `DELETE /cart/:productId` with stock ceiling checks, HTTP `409` conflict responses for stock overruns, and 100% ownership isolation.
- **Database Seeding**: Standalone script (`server/seed.js`) that clears existing products, inserts the 18 product dataset (including out-of-stock item), and creates the default admin user.
- **Frontend RTK & API Layer**: Typed `fetch` wrapper with `credentials: 'include'`, `authSlice`, `cartSlice`, `productSlice`, and custom hooks (`useAppDispatch`, `useAppSelector`).
- **Routing & Navigation**: `App.tsx` router setup (`/`, `/login`, `/register`, `/cart`), `ProtectedRoute` component with loading states, and responsive navbar header (`Header.tsx`) with mobile menu drawer.
- **Product Grid Home Page**: Hero banner, debounced search (300ms), sort dropdown, out-of-stock badges, and auth-gated "Add to Cart" button.
- **Protected Cart Page**: Running item count, stock ceiling enforcement, `409` stock limit alert banner, and distinct states for Loading, Fetch Error (with retry button), and Empty Cart.
- **Security & Error Handling**: Stripped stack traces from all response bodies, return `400` for invalid ObjectIDs, `401` for unauthorized cart requests, `403` for non-admin requests to admin routes, and `409` for duplicate emails or stock overruns.

### 🟡 What's Partial
- **Error Middleware**: Centralized Express error handler and baseline health check endpoint (`/health`).
- **Checkout Trigger**: Client-side UI checkout trigger button (ready for order placement integration).

### ⏳ What's Left
- **Order Management System**: Order model (`Order.js`) and API endpoints (`POST /orders`, `GET /orders`, `GET /orders/:id`) for completing purchases and clearing carts.
- **Payment Integration**: Third-party payment gateway processing (e.g. Stripe or Razorpay integration).
- **Admin Management Dashboard**: Admin UI pages for creating, editing, and deleting products directly from the web interface.