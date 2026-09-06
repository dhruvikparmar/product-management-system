const express = require("express");
const upload = require("../middleware/upload");
const router = express.Router();

const {
  getProducts,
  addProduct,
  deleteProduct,
  updateProduct,
} = require("../controllers/productController");


// GET PRODUCTS
router.get("/", getProducts);


// ADD PRODUCT
router.post(
  "/",
  upload.single("image"),
  addProduct
);

// DELETE PRODUCT
router.delete("/:id", deleteProduct);

// UPDATE PRODUCT
router.put(
  "/:id",
  upload.single("image"),
  updateProduct
);


module.exports = router;