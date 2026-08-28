const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

// @desc Get dashboard stats
// @route GET /api/admin/stats
const getStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();
    const revenueAgg = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    res.json({ totalOrders, totalProducts, totalUsers, totalRevenue });
  } catch (error) {
    next(error);
  }
};

// @desc Get all orders
// @route GET /api/admin/orders
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc Update order status
// @route PUT /api/admin/orders/:id
const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }
    order.status = req.body.status || order.status;
    if (req.body.status === "delivered") {
      order.isPaid = true;
      order.paidAt = Date.now();
    }
    const updated = await order.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc Get all users
// @route GET /api/admin/users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats, getAllOrders, updateOrderStatus, getAllUsers };
