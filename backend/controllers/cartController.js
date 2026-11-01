const User = require("../models/User");
const Product = require("../models/Product");

// returns a whole number > 0, or null if the value isn't usable
const toQty = (value) => {
  const qty = Number(value);
  return Number.isInteger(qty) && qty > 0 ? qty : null;
};

// @desc Get current user's cart
// @route GET /api/cart
const getCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("cart.product");
    res.json(user.cart);
  } catch (error) {
    next(error);
  }
};

// @desc Add item to cart (or increment qty)
// @route POST /api/cart
const addToCart = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const qty = toQty(req.body.qty ?? 1);
    if (!qty) {
      res.status(400);
      throw new Error("Quantity must be a whole number, 1 or more");
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    const user = await User.findById(req.user._id);
    const existing = user.cart.find((item) => item.product.toString() === productId);

    const alreadyInCart = existing ? existing.qty : 0;
    if (alreadyInCart + qty > product.stock) {
      res.status(400);
      throw new Error(`Only ${product.stock} of ${product.name} in stock`);
    }

    if (existing) {
      existing.qty += qty;
    } else {
      user.cart.push({ product: productId, qty });
    }

    await user.save();
    const populated = await user.populate("cart.product");
    res.status(201).json(populated.cart);
  } catch (error) {
    next(error);
  }
};

// @desc Update item quantity
// @route PUT /api/cart/:productId
const updateCartItem = async (req, res, next) => {
  try {
    const qty = Number(req.body.qty);
    if (!Number.isInteger(qty)) {
      res.status(400);
      throw new Error("Quantity must be a whole number");
    }

    const user = await User.findById(req.user._id);
    const item = user.cart.find((i) => i.product.toString() === req.params.productId);

    if (!item) {
      res.status(404);
      throw new Error("Item not in cart");
    }

    if (qty <= 0) {
      user.cart = user.cart.filter((i) => i.product.toString() !== req.params.productId);
    } else {
      item.qty = qty;
    }

    await user.save();
    const populated = await user.populate("cart.product");
    res.json(populated.cart);
  } catch (error) {
    next(error);
  }
};

// @desc Remove item from cart
// @route DELETE /api/cart/:productId
const removeFromCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = user.cart.filter((i) => i.product.toString() !== req.params.productId);
    await user.save();
    const populated = await user.populate("cart.product");
    res.json(populated.cart);
  } catch (error) {
    next(error);
  }
};

// @desc Clear cart
// @route DELETE /api/cart
const clearCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();
    res.json([]);
  } catch (error) {
    next(error);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
