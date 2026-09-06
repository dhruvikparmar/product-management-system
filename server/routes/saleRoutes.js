const express = require("express");

const router = express.Router();

const {
  getSales,
  getSaleById,
  addSale,
  updateSale,
  deleteSale,
} = require(
  "../controllers/saleController"
);

router.get("/", getSales);

router.get("/:id", getSaleById);

router.post("/", addSale);

router.put("/:id", updateSale);

router.delete("/:id", deleteSale);

module.exports = router;