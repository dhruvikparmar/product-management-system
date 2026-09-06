const express = require("express");
const router = express.Router();

const StockHistory = require("../models/StockHistory");

router.get("/", async (req, res) => {
  try {
    const history =
      await StockHistory.find().sort({
        createdAt: -1,
      });

    res.json(history);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;