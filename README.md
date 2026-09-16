# QuickCart

QuickCart is a full-stack e-commerce web application featuring a product catalog with search, filtering, and sorting, a user shopping cart, user authentication with role-based authorization (User and Admin), and an Admin management dashboard.

## Live Demo

- **Frontend**: [https://quickcart-sand-eta.vercel.app](https://quickcart-sand-eta.vercel.app)
- **Backend API**: [https://quickcart-api.onrender.com](https://quickcart-api.onrender.com)
- **GitHub Repository**: [https://github.com/ajmlll/Quickcart](https://github.com/ajmlll/Quickcart)

---

## Admin Credentials

The initial database seed script creates an Admin account with full administrative permissions. The Admin logs into the standard `/login` route; access to Admin routes is dynamically authorized based on the `role` property (`admin` vs `user`) stored in MongoDB and signed into the JWT payload.

```text
Email:    admin@example.com
Password: Admin123!
```

---

## Tech Stack

### Backend
- **Core Runtime**: Node.js (v24+), Express.js (`^4.21.2`)
- **Database & ODM**: MongoDB Atlas, Mongoose (`^8.12.0`)
- **Authentication & Security**: `bcrypt` (`^5.1.1`), `jsonwebtoken` (`^9.0.2`), `cookie-parser` (`^1.4.7`)
- **Input Validation**: Zod (`^3.24.2`)
- **Middleware & Utilities**: `cors` (`^2.8.5`), `dotenv` (`^16.4.7`), `nodemon` (`^3.1.9`)

### Frontend
- **Core Framework & Build Tool**: React (`^19.2.8`), Vite (`^8.3.0`), TypeScript (`~6.0.2`)
- **Routing**: React Router DOM (`^7.18.4`)
- **State Management**: Redux Toolkit (`^2.12.0`), React Redux (`^9.3.0`)
- **Styling**: TailwindCSS v4 (`^4.3.3`)
- **Code Quality & Linting**: Oxlint (`^1.81.0`)

---

## Features

### Auth & Roles
- Registration (`POST /auth/register`) and Login (`POST /auth/login`) with Zod schema validation.
- User session persistence via HTTP-only cookies in development and dual HTTP-only (`sameSite: 'none'`, `secure: true`) cookie + Bearer token header in production.
- Role-based authorization middleware enforcing `admin` rights on administrative product routes.
- Current user session hydration endpoint (`GET /auth/me`).

### Product Catalog
- Public product listing with search by product title and description.
- Filter products by category (Accessories, Audio, Office, Storage, Wearables, Displays) and price range.
- Server-side and client-side sorting by price (ascending/descending) and product name.
- Responsive grid layout displaying 2 products per row on mobile viewports and 3 products per row on desktop viewports.
- Real-time stock status indication (In Stock vs Out of Stock).

### Shopping Cart
- One persistent cart document per user stored in MongoDB.
- Add items to cart directly from the product catalog or product cards.
- Real-time cart badge counter in navigation header displaying total item quantity.
- Update item quantity (`PATCH /cart/:productId`) and remove items (`DELETE /cart/:productId`).
- Automatic price calculation displaying item totals, subtotals, and total checkout summary.

### Admin Dashboard
- Protected Admin route (`/admin`) accessible only to users with the `admin` role.
- Product management dashboard listing all items with pagination.
- Create new products with modal dialog including title, category, price, stock count, and image URL.
- Edit existing product details via pre-populated modal dialog (`PATCH /products/:id`).
- Delete products (`DELETE /products/:id`) with immediate UI cache invalidation.

### Design & Architecture
- Modern glassmorphism design system using backdrop blurs, translucent cards, and smooth CSS transitions.
- Responsive layout adapting seamlessly across mobile, tablet, and desktop screens.
- Vector SVG icon set built without external icon library dependencies.

---

## API Reference

All requests expecting or returning JSON use standard HTTP response status codes (`200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`).

> **Note on Cart Route IDs**: In `PATCH /cart/:productId` and `DELETE /cart/:productId`, the route parameter `:productId` refers directly to the MongoDB `_id` of the target **Product**, not a separate cart-item line ID. Each user has a single Cart document containing an array of item subdocuments, keyed by `productId`.

| Method | Path | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Public | Register new user account and initialize empty cart |
| `POST` | `/auth/login` | Public | Authenticate credentials and return user object + cookie/token |
| `POST` | `/auth/logout` | Public | Clear session cookie and invalidate client state |
| `GET` | `/auth/me` | User | Retrieve current authenticated user profile |
| `GET` | `/products` | Public | List products with optional `search`, `category`, and `sort` query parameters |
| `POST` | `/products` | Admin | Create a new product item |
| `PATCH` | `/products/:id` | Admin | Update existing product details by product ID |
| `DELETE` | `/products/:id` | Admin | Delete product item by product ID |
| `GET` | `/cart` | User | Fetch current user's shopping cart and populated product details |
| `POST` | `/cart/add` | User | Add product to cart or increment quantity if item already exists |
| `PATCH` | `/cart/:productId` | User | Update quantity of a specific product in the cart |
| `DELETE` | `/cart/:productId` | User | Remove specific product from the cart |
| `GET` | `/health` | Public | Server health check endpoint |

---

## Project Structure

```text
Quickcart/
├── client/
│   ├── public/
│   │   ├── favicon.svg             # Custom SVG brand favicon
│   │   └── icons.svg
│   ├── src/
│   │   ├── components/             # Reusable UI components (Header, Footer, GlassCard, Icons, AuthModal)
│   │   ├── lib/                    # Fetch wrapper (api.ts) with Bearer token & error handling
│   │   ├── pages/                  # Page components (HomePage, LandingPage, CartPage, AdminPage, AboutPage, LoginPage, RegisterPage)
│   │   ├── store/                  # Redux Toolkit store & slices (authSlice, cartSlice, productSlice, adminProductsSlice)
│   │   ├── App.tsx                 # Client routing & app frame
│   │   └── main.tsx                # Client entry point
│   ├── package.json
│   ├── tsconfig.json
│   ├── vercel.json                 # Vercel SPA client-side rewrite rules
│   └── vite.config.ts
└── server/
    ├── controllers/                # Request handlers (authController.js, productController.js, cartController.js)
    ├── middleware/                 # Auth & role guards (auth.js)
    ├── models/                     # Mongoose schemas (User.js, Product.js, Cart.js)
    ├── routes/                     # Express routers (auth.js, products.js, cart.js)
    ├── app.js                      # Express application setup, CORS, and middleware configuration
    ├── db.js                       # MongoDB Mongoose connection handler
    ├── seed.js                     # Database initial seeding script
    └── package.json
```

---

## Setup — Run Locally

Follow these steps to run QuickCart on your local machine:

### 1. Clone Repository
```bash
git clone https://github.com/ajmlll/Quickcart.git
cd Quickcart
```

### 2. Install Dependencies
Install dependencies in both backend (`/server`) and frontend (`/client`):
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the `/server` directory:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/quickcart?retryWrites=true&w=majority
JWT_SECRET=your_local_jwt_secret_key_12345
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

*(Optional)* Create a `.env` file in the `/client` directory:
```env
VITE_API_URL=http://localhost:5000
```

### 4. Seed Database
Run the seed script to populate MongoDB with initial tech products and the Admin user:
```bash
cd ../server
npm run seed
```

This creates:
- 18 high-quality tech products.
- 1 Admin user (`admin@example.com` / `Admin123!`).

### 5. Start Backend Server
```bash
# In /server directory
npm run dev
```
The backend API server will run on `http://localhost:5000`.

### 6. Start Frontend Development Server
Open a second terminal window:
```bash
cd client
npm run dev
```
The Vite frontend dev server will run on `http://localhost:5173`.

---

## Environment Variables

### Server (`server/.env`)
```env
PORT=5000
# Port number Express server listens on (default: 5000)

MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/quickcart
# MongoDB Atlas connection string

JWT_SECRET=super_secret_jwt_key
# Secret string used to sign and verify authentication JSON Web Tokens

CLIENT_ORIGIN=http://localhost:5173
# Allowed origin domain for CORS credentials headers (Vercel URL in production)

NODE_ENV=development
# Node environment mode ('development' or 'production')
```

### Client (`client/.env`)
```env
VITE_API_URL=http://localhost:5000
# Base HTTP URL of the backend API server (Render URL in production)
```

---

## Assumptions & Design Decisions

1. **One Cart per User Model**: Each user document maps to exactly one Cart document in MongoDB containing an array of item objects (`{ product: ObjectId, quantity: Number }`).
2. **Product ID Route Parameter in Cart Endpoints**: `PATCH /cart/:productId` and `DELETE /cart/:productId` identify cart entries by `productId` rather than generating separate line item subdocument IDs.
3. **Dual Session Token Handling**: To handle cross-origin third-party cookie restrictions across separate hosting platforms (Render + Vercel), authentication uses HTTP-only cookies in standard single-domain settings while supplementing with an `Authorization: Bearer <token>` header in `localStorage` for cross-domain production reliability.
4. **Dedicated Landing & Shop Pages**: The application separates the promotional Hero/Landing page (`/`) from the full interactive product catalog page (`/shop`).
5. **No External UI Library Dependencies**: All components, modals, dropdowns, and SVG icons were constructed using native React and TailwindCSS without relying on external UI component kits.

---

## What's Done / Partial / Left

### Done
- Full User & Admin authentication flow (Register, Login, Session Check, Logout).
- Product Catalog with search, category filtering, price range filter, and sorting.
- Persistent Shopping Cart (Add, Update Quantity, Delete Item, Total Calculations).
- Protected Admin Dashboard (Create Product, Edit Product, Delete Product).
- Cross-domain deployment on Vercel (Frontend) and Render (Backend) with MongoDB Atlas integration.
- Responsive 2-column mobile product layout and drawer navigation.

### Partial
- Query parameter validation in `GET /products` relies on inline fallbacks and parsing inside `productController.js` rather than a standalone Zod query middleware.

### Left / Out of Scope
- **Payment Gateway & Checkout Flow**: Intentionally not built as order placement and payment integration were out of scope for the required task deliverables.
- **User Profile Management**: Editing user profile details (e.g. changing password or delivery addresses) was not implemented.

---

## Known Limitations

1. **Cold Start Latency on Free Tier Hosting**: Render free tier web services spin down after inactivity. The first API request after a sleep period may experience a 30-second delay while the server instance boots up.
2. **Unvalidated Query Filters**: Invalid price query parameters (e.g. `minPrice=invalid`) fall back to default numeric bounds (`0` and `Infinity`) rather than returning explicit HTTP 400 validation errors.