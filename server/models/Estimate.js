const mongoose = require("mongoose");

const estimateSchema = new mongoose.Schema(
  {
    estimateNo: {
      type: String,
      required: true,
    },

    customerName: {
      type: String,
      required: true,
    },

    customerMobile: {
      type: String,
      required: true,
    },

    estimateDate: {
      type: Date,
      required: true,
    },

    items: [
      {
        productId: String,

        productName: String,

        price: Number,

        quantity: Number,

        total: Number,
      },
    ],

    discountType: {
      type: String,
      default: "amount",
    },

    discountValue: {
      type: Number,
      default: 0,
    },

    grandTotal: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Estimate",
  estimateSchema
);