const crypto = require("crypto");
const Razorpay = require("razorpay");
const Order = require("../models/Order");

// created on first use, so the server still starts (and cash on delivery still works)
// when the Razorpay keys aren't set
let client = null;
const getClient = () => {
  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) return null;
  if (!client) client = new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET });
  return client;
};

// the order has to belong to whoever is asking
const findOwnedOrder = async (orderId, userId, res) => {
  const order = await Order.findById(orderId);
  if (!order || order.user.toString() !== userId.toString()) {
    res.status(404);
    throw new Error("Order not found");
  }
  return order;
};

// @desc Create a Razorpay order for one of our saved orders
// @route POST /api/payments/razorpay/order
const createRazorpayOrder = async (req, res, next) => {
  try {
    const razorpay = getClient();
    if (!razorpay) {
      res.status(503);
      throw new Error("Online payments aren't set up on this server");
    }

    const order = await findOwnedOrder(req.body.orderId, req.user._id, res);

    if (order.paymentMethod !== "Razorpay") {
      res.status(400);
      throw new Error("This order isn't set up for online payment");
    }
    if (order.isPaid) {
      res.status(400);
      throw new Error("This order is already paid");
    }
    if (order.status === "cancelled") {
      res.status(400);
      throw new Error("This order was cancelled");
    }

    let razorpayOrder;
    try {
      razorpayOrder = await razorpay.orders.create({
        // always taken from our database, never from the browser. Razorpay wants paise
        amount: Math.round(order.totalPrice * 100),
        currency: "INR",
        receipt: order._id.toString(),
      });
    } catch (sdkError) {
      // the SDK throws plain objects, not Errors
      res.status(502);
      throw new Error(sdkError?.error?.description || "Could not start the payment");
    }

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.json({
      keyId: process.env.RAZORPAY_KEY_ID,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Check the signature Razorpay sends back and mark the order as paid
// @route POST /api/payments/razorpay/verify
const verifyPayment = async (req, res, next) => {
  try {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      res.status(503);
      throw new Error("Online payments aren't set up on this server");
    }

    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const order = await findOwnedOrder(orderId, req.user._id, res);

    // verifying twice (double click, refresh) shouldn't be an error
    if (order.isPaid) return res.json(order);

    if (!razorpay_payment_id || !razorpay_signature || order.razorpayOrderId !== razorpay_order_id) {
      res.status(400);
      throw new Error("That payment doesn't match this order");
    }

    const expected = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const received = Buffer.from(String(razorpay_signature));
    const wanted = Buffer.from(expected);
    const valid = received.length === wanted.length && crypto.timingSafeEqual(received, wanted);

    if (!valid) {
      res.status(400);
      throw new Error("Payment could not be verified");
    }

    order.isPaid = true;
    order.paidAt = new Date();
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    res.json(order);
  } catch (error) {
    next(error);
  }
};

module.exports = { createRazorpayOrder, verifyPayment };
