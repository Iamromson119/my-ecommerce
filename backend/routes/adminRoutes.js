const express = require("express");
const router = express.Router();
const {
  getStats,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
} = require("../controllers/adminController");
const { protect, admin } = require("../middleware/auth");

router.use(protect, admin);

router.get("/stats", getStats);
router.get("/orders", getAllOrders);
router.put("/orders/:id", updateOrderStatus);
router.get("/users", getAllUsers);

module.exports = router;
