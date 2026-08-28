# Meridian — Full-Stack E-Commerce App

React (Vite + Tailwind) frontend, Node/Express backend, MongoDB database.
Includes product catalog, cart, checkout, JWT auth, and an admin panel
(product management, order management, dashboard stats).

## Project structure

```
ecom-app/
├── backend/     Express API + MongoDB models
└── frontend/    React (Vite) app
```

## Prerequisites

- Node.js 18+ and npm
- MongoDB running locally, or a free MongoDB Atlas cluster

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ecom
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Seed the database with sample products and demo accounts:

```bash
npm run seed
```

This creates:
- Admin login: `admin@example.com` / `admin123`
- Customer login: `customer@example.com` / `customer123`
- 6 sample products

Start the API:

```bash
npm run dev
```

The API runs at `http://localhost:5000`. Check `http://localhost:5000/api/health`.

## 2. Frontend setup

In a new terminal:

```bash
cd frontend
npm install
cp .env.example .env
```

`.env` defaults to `VITE_API_URL=http://localhost:5000/api`, which matches the backend above.

Start the dev server:

```bash
npm run dev
```

Visit `http://localhost:5173`.

## 3. Using the app

- Browse and search products on the home page.
- Register an account or log in with the demo customer to add items to cart and check out.
- Log in with the demo admin to access `/admin` — dashboard stats, product CRUD, and order status management.

## API overview

| Method | Route | Description |
|---|---|---|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Log in |
| GET | /api/auth/profile | Current user (auth) |
| GET | /api/products | List products (search/category/pagination) |
| GET | /api/products/:id | Product detail |
| POST/PUT/DELETE | /api/products(/:id) | Admin product management |
| GET/POST/PUT/DELETE | /api/cart | Cart operations (auth) |
| POST | /api/orders | Place order from cart (auth) |
| GET | /api/orders/myorders | My orders (auth) |
| GET | /api/orders/:id | Order detail (auth) |
| GET | /api/admin/stats | Dashboard stats (admin) |
| GET/PUT | /api/admin/orders(/:id) | Admin order management |
| GET | /api/admin/users | List users (admin) |

## Notes on production readiness

This is a solid learning/prototype base, not a hardened production deploy. Before going live, consider:
- Real payment processing (Stripe/PayPal) — checkout currently just records a payment method string.
- Input validation library (e.g. `zod`/`joi`) on all endpoints.
- Rate limiting and helmet for the API.
- Image uploads (currently expects an image URL).
- Refresh tokens / shorter-lived access tokens.
- HTTPS and environment-specific CORS origins.
