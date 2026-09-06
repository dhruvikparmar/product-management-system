const express = require("express");

const router = express.Router();

const upload = require(
  "../middleware/upload"
);

const {
  getBrands,
  addBrand,
  updateBrand,
  deleteBrand,
} = require(
  "../controllers/brandController"
);


router.get(
  "/",
  getBrands
);

router.post(
  "/",
  upload.single("image"),
  addBrand
);

router.put(
  "/:id",
  upload.single("image"),
  updateBrand
);

router.delete(
  "/:id",
  deleteBrand
);

module.exports = router;