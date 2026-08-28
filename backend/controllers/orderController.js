const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

// @desc Create new order from current cart
// @route POST /api/orders
const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    const user = await User.findById(req.user._id).populate("cart.product");
    if (!user.cart.length) {
      res.status(400);
      throw new Error("Cart is empty");
    }

    let itemsPrice = 0;
    const items = [];

    for (const cartItem of user.cart) {
      const product = cartItem.product;
      if (!product || product.stock < cartItem.qty) {
        res.status(400);
        throw new Error(`Insufficient stock for ${product ? product.name : "a product"}`);
      }
      itemsPrice += product.price * cartItem.qty;
      items.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        qty: cartItem.qty,
      });
      product.stock -= cartItem.qty;
      await product.save();
    }

    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const totalPrice = itemsPrice + shippingPrice;

    const order = await Order.create({
      user: user._id,
      items,
      shippingAddress,
      paymentMethod: paymentMethod || "Cash on Delivery",
      itemsPrice,
      shippingPrice,
      totalPrice,
    });

    user.cart = [];
    await user.save();

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

// @desc Get logged-in user's orders
// @route GET /api/orders/myorders
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc Get single order (owner or admin)
// @route GET /api/orders/:id
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      res.status(403);
      throw new Error("Not authorized to view this order");
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getMyOrders, getOrderById };
