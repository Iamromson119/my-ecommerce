# Meridian

A full-stack e-commerce app I built with the MERN stack. React frontend, Express API, MongoDB, JWT login, a cart, checkout and a small admin panel.

Live demo:https://my-ecommerce-nine-psi.vercel.app/
Code: https://github.com/Iamromson119/my-ecommerce

The API runs on a free Render plan, so after a quiet spell the first request can take up to a minute while it wakes up.

## What it does

- Register / log in (passwords hashed with bcrypt, sessions with JWT)
- Browse and search products, filter by category
- Cart that's saved on the account, so it follows you between devices
- Checkout creates an order from the cart and takes the stock off the products
- Order history and order details
- Admin area: dashboard stats, manage products, update order status

## Stack

- Frontend: React (Vite), Tailwind, React Router, Axios
- Backend: Node, Express, Mongoose, JWT, bcryptjs, helmet, express-rate-limit
- Database: MongoDB Atlas
- Hosting: Vercel (frontend), Render (API)

## Running it locally

You'll need Node 18+ and a MongoDB connection string. A free Atlas cluster works, or a local MongoDB.

### Backend

```bash
cd backend
npm install
cp .env.example .env
```

Fill in `.env` (see `.env.example` for what each value is), then add the sample data and start the server:

```bash
npm run seed
npm run dev
```

The seed script only runs on an empty database. To wipe everything and start over use `npm run seed -- --reset`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Opens on http://localhost:5173.

## Deploying

1. **Database.** Create a free M0 cluster on MongoDB Atlas, add a database user, and under Network Access allow `0.0.0.0/0` (Render's free plan doesn't have a fixed IP). Copy the connection string and put a database name in it, like `.../ecom?retryWrites=true&w=majority`.
2. **API on Render.** New Web Service from this repo. Root directory `backend`, build command `npm install`, start command `npm start`. Set these environment variables: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (the Vercel URL, no trailing slash) and `NODE_ENV=production`. Check `/api/health` once it's up.
3. **Seed the live database** once from your own machine: put the Atlas string in your local `.env` as `MONGO_URI`, set `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD`, run `npm run seed`, then switch `.env` back to your local database.
4. **Frontend on Vercel.** Import the repo, root directory `frontend`, and set `VITE_API_URL` to your Render URL plus `/api`. Redeploy after changing it, because Vite reads it at build time.

## Demo account

Customer: `customer@example.com` / `customer123`

The admin login isn't public. Ask me if you'd like to see the admin panel.

## API overview

- Auth: register, login, profile
- Products: list (search, category, pagination), categories, detail, admin create / update / delete
- Cart: get, add, update quantity, remove, clear
- Orders: create from cart, my orders, order detail
- Admin: stats, all orders, update order status, all users

## Known gaps

- There's no real payment processing. Checkout only supports cash on delivery and just records the order.
- No automated tests yet.
- Product images are plain URLs, there's no upload.
- Input validation is basic (required fields and number checks), no validation library.
