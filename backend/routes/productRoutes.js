const express = require("express");
const router = express.Router();
const {
  getProducts,
  getCategories,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect, admin } = require("../middleware/auth");

router.route("/").get(getProducts).post(protect, admin, createProduct);
// keep this above "/:id" or "categories" gets treated as an id
router.get("/categories", getCategories);
router
  .route("/:id")
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;
