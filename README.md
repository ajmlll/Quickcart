# QuickCart

QuickCart is a modern full-stack e-commerce web application built using a Node.js/Express backend and a React/TypeScript frontend.

---

## Tech Stack

### Frontend (`/client`)
- **Core Framework:** React 19 + TypeScript (Vite)
- **Styling:** Tailwind CSS v4
- **State Management:** Redux Toolkit (`@reduxjs/toolkit`, `react-redux`)
- **Routing:** React Router DOM (`react-router-dom`)

### Backend (`/server`)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database / ODM:** MongoDB & Mongoose
- **Validation:** Zod
- **Authentication & Security:** bcrypt, JSON Web Token (`jsonwebtoken`), `cookie-parser`, `cors`
- **Environment Management:** `dotenv`
- **Development Tooling:** `nodemon`

---

## Setup

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)
- MongoDB instance (Local or MongoDB Atlas)

### 1. Server Setup
```bash
# Navigate to the server directory
cd server

# Install backend dependencies
npm install

# Set up environment variables
cp .env.example .env
# Update .env with your local or remote MONGO_URI, JWT_SECRET, etc.

# Start development server
npm run dev
```

### 2. Client Setup
```bash
# Navigate to the client directory
cd client

# Install frontend dependencies
npm install

# Start development server
npm run dev
```

---

## Admin Credentials

> [!NOTE]
> Admin user seeding/initialization will be added when user authentication and role management are implemented.

- **Email:** `admin@quickcart.com` *(Placeholder)*
- **Password:** `Admin@123` *(Placeholder)*

---

## Assumptions

1. **Monorepo Architecture:** Clean separation into two dedicated folders: `/server` for API backend services and `/client` for frontend UI application.
2. **Ports & Origins:** Server defaults to port `5000` (`http://localhost:5000`) and CORS allows requests from the Vite client origin `http://localhost:5173`.
3. **Cookie-Based Authentication:** Tokens/cookies will be passed securely via `cookie-parser` and CORS credentials configured on Express.

---

## What's Done / Partial / Left

### ✅ What's Done
- Monorepo folder structure initialized (`/server` and `/client`).
- Backend skeleton created with `package.json`, `app.js`, CORS configuration, `cookie-parser`, `express.json()` middleware, and centralized error-handling middleware.
- Server `.env.example` created with `PORT`, `MONGO_URI`, `JWT_SECRET`, and `CLIENT_ORIGIN` variables.
- Client scaffolded using Vite (React + TypeScript template).
- Client dependencies installed: Tailwind CSS v4 (`@tailwindcss/vite`), React Router DOM (`react-router-dom`), and Redux Toolkit (`@reduxjs/toolkit`, `react-redux`).
- Baseline Redux store (`client/src/store/store.ts`) and React Router setup configured.
- Created Mongoose schemas and models (`User`, `Product`, `Cart`) with indexes.
- Implemented Authentication middleware (`requireAuth`, `requireAdmin`) and routes (`POST /auth/register`, `POST /auth/login`, `POST /auth/logout`) with Zod validation, bcrypt password hashing (12 rounds), auto-creation of empty user Cart on register, JWT signing (7-day expiry), and httpOnly cookie management.
- Implemented Product management routes (`/products`):
  - `GET /products` (Public: search regex filter, minPrice/maxPrice filtering, sorting by price/name/date).
  - `POST /products` (Admin: Zod validation for name, category, price > 0, stock >= 0, image).
  - `PATCH /products/:id` (Admin: ObjectId 400 validation, 404 handling, partial updates).
  - `DELETE /products/:id` (Admin: ObjectId 400 validation, 404 handling, deletion confirmation).
  - All handlers wrapped in `try/catch` passing unexpected errors to `next(err)`.

### 🟡 Partial
- Express baseline error handler and health endpoint `/health`.
- Frontend App boilerplate with store wrapper.

### ⏳ What's Left
- Database connection configuration (`mongoose.connect`).
- Cart & Order API routes and controllers.
- Client-side pages (Home, Shop, Product Detail, Cart, Checkout, Auth, Admin Dashboard).
- Redux slices (Auth slice, Cart slice, Product slice).