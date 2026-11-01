const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("../config/db");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

// npm run seed             -> adds the sample data, but only if the database is empty
// npm run seed -- --reset  -> wipes users, products and orders first, then seeds
// npm run seed -- --destroy -> wipes everything and stops
const args = process.argv.slice(2);
const reset = args.includes("--reset");
const destroy = args.includes("--destroy");

const products = [
  {
    name: "Classic Leather Backpack",
    description: "Durable full-grain leather backpack with padded laptop sleeve.",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
    category: "Bags",
    stock: 25,
  },
  {
    name: "Wireless Noise-Cancelling Headphones",
    description: "Over-ear headphones with 30-hour battery life and active noise cancellation.",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    category: "Electronics",
    stock: 40,
  },
  {
    name: "Minimalist Ceramic Mug Set",
    description: "Set of 4 handcrafted ceramic mugs, dishwasher and microwave safe.",
    price: 34.5,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500",
    category: "Home",
    stock: 60,
  },
  {
    name: "Running Sneakers",
    description: "Lightweight breathable running shoes with responsive cushioning.",
    price: 74.0,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
    category: "Footwear",
    stock: 35,
  },
  {
    name: "Smart Fitness Watch",
    description: "Track heart rate, sleep, and workouts with a 7-day battery life.",
    price: 129.0,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    category: "Electronics",
    stock: 20,
  },
  {
    name: "Organic Cotton T-Shirt",
    description: "Soft, breathable, sustainably sourced organic cotton t-shirt.",
    price: 22.0,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    category: "Apparel",
    stock: 100,
  },
];

const wipe = async () => {
  await Order.deleteMany();
  await Product.deleteMany();
  await User.deleteMany();
};

const run = async () => {
  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (!destroy && (!adminEmail || !adminPassword)) {
    console.error("Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in your .env before seeding.");
    process.exit(1);
  }

  await connectDB();

  if (destroy) {
    await wipe();
    console.log("Data destroyed.");
    return;
  }

  const existing = (await User.countDocuments()) + (await Product.countDocuments());
  if (existing > 0 && !reset) {
    console.log("This database already has data, so I left it alone.");
    console.log("Run `npm run seed -- --reset` if you really want to wipe it and start over.");
    return;
  }

  if (reset) await wipe();

  await User.create({
    name: "Admin User",
    email: adminEmail,
    password: adminPassword,
    role: "admin",
  });

  await User.create({
    name: "Test Customer",
    email: "customer@example.com",
    password: "customer123",
    role: "customer",
  });

  await Product.insertMany(products);

  console.log("Data imported.");
  console.log(`Admin login: ${adminEmail}`);
  console.log("Customer login: customer@example.com / customer123");
};

run()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  });
