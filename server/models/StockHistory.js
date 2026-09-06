const mongoose = require("mongoose");

const stockHistorySchema = new mongoose.Schema(
    {
        supplierName: String,
        supplierMobile: String,
        billNumber: String,
        purchaseDate: Date,

        productId: String,
        productName: String,
        brand: String,

        purchasePrice: Number,
        quantity: Number,

        image: String, // add this
    },
    { timestamps: true }
);

module.exports = mongoose.model(
    "StockHistory",
    stockHistorySchema
);