const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

const PAYMENT_METHODS = ["Cash on Delivery", "Razorpay"];

const round2 = (n) => Math.round(n * 100) / 100;

// @desc Create new order from current cart
// @route POST /api/orders
const createOrder = async (req, res, next) => {
  // stock we've already taken off products, so we can give it back if the order fails
  const reserved = [];
  let orderPlaced = false;

  try {
    const { shippingAddress, paymentMethod = "Cash on Delivery" } = req.body;

    const fields = ["fullName", "address", "city", "postalCode", "country"];
    if (!shippingAddress || fields.some((f) => !shippingAddress[f])) {
      res.status(400);
      throw new Error("Please fill in the full shipping address");
    }

    if (!PAYMENT_METHODS.includes(paymentMethod)) {
      res.status(400);
      throw new Error("That payment method isn't supported");
    }

    const user = await User.findById(req.user._id).populate("cart.product");
    if (!user.cart.length) {
      res.status(400);
      throw new Error("Cart is empty");
    }

    let itemsPrice = 0;
    const items = [];

    for (const cartItem of user.cart) {
      const product = cartItem.product;
      if (!product) {
        res.status(400);
        throw new Error("A product in your cart is no longer available");
      }

      // only take the stock if there's still enough left. Doing the check and the
      // decrement in one query means two people can't both buy the last item
      const updated = await Product.findOneAndUpdate(
        { _id: product._id, stock: { $gte: cartItem.qty } },
        { $inc: { stock: -cartItem.qty } }
      );
      if (!updated) {
        res.status(400);
        throw new Error(`Not enough stock for ${product.name}`);
      }
      reserved.push({ id: product._id, qty: cartItem.qty });

      itemsPrice += product.price * cartItem.qty;
      items.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        qty: cartItem.qty,
      });
    }

    itemsPrice = round2(itemsPrice);
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const totalPrice = round2(itemsPrice + shippingPrice);

    const order = await Order.create({
      user: user._id,
      items,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    });
    orderPlaced = true;

    user.cart = [];
    await user.save();

    res.status(201).json(order);
  } catch (error) {
    if (!orderPlaced) {
      await Promise.all(
        reserved.map((r) => Product.updateOne({ _id: r.id }, { $inc: { stock: r.qty } }))
      );
    }
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

// @desc Cancel an unpaid order that hasn't been processed yet, and put the stock back
// @route PUT /api/orders/:id/cancel
const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order || order.user.toString() !== req.user._id.toString()) {
      res.status(404);
      throw new Error("Order not found");
    }
    if (order.isPaid || order.status !== "pending") {
      res.status(400);
      throw new Error("This order can't be cancelled any more");
    }

    // flip the status first, so a double click can't give the stock back twice
    const claimed = await Order.findOneAndUpdate(
      { _id: order._id, status: "pending", isPaid: false },
      { status: "cancelled" },
      { new: true }
    );
    if (!claimed) {
      res.status(400);
      throw new Error("This order can't be cancelled any more");
    }

    await Promise.all(
      order.items.map((item) =>
        Product.updateOne({ _id: item.product }, { $inc: { stock: item.qty } })
      )
    );

    res.json(claimed);
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getMyOrders, getOrderById, cancelOrder };
