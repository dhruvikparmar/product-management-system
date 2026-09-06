const express = require("express");

const router = express.Router();

const {
  getEstimates,
  getEstimateById,
  createEstimate,
  deleteEstimate,
  updateEstimate,
} = require("../controllers/estimateController");

router.get(
  "/",
  getEstimates
);

router.get(
  "/:id",
  getEstimateById
);

router.post(
  "/",
  createEstimate
);

router.put("/:id",updateEstimate);

router.delete("/:id", deleteEstimate);

module.exports = router;