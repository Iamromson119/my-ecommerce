# Meridian - Full Stack E-Commerce App

MERN stack ecommerce app - React frontend, Express/MongoDB backend, JWT auth, cart, checkout, admin panel.

## Stack

- Frontend: React (Vite), Tailwind, React Router, Axios
- Backend: Node, Express, MongoDB/Mongoose, JWT, bcrypt

## Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env
```

Fill in `.env`:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ecom
JWT_SECRET=some_random_string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Seed some sample products + demo accounts:

```bash
npm run seed
```

Admin login: admin@example.com / admin123
Customer login: customer@example.com / customer123

Then:

```bash
npm run dev
```

Backend runs on port 5000.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Runs on port 5173.

## Routes

Auth: register/login/profile
Products: list/detail + admin CRUD
Cart: get/add/update/remove/clear
Orders: create from cart, my orders, order detail
Admin: stats, all orders, update order status, all users

## Known gaps / todo

- No real payment processing, checkout just records a payment method string
- No input validation library on the backend routes
- No rate limiting
- Product images are just URLs, no actual upload handling
- Possible race condition on stock decrement under concurrent orders (fixed properly in the Encore project, worth porting back here)
