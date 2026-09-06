const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
  {
    billNo: {
      type: String,
      unique: true,
    },

    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },

    items: [
      {
        productId: {
          type: String,
        },

        productCode: {
          type: String,
        },

        productName: {
          type: String,
        },

        image: {
          type: String,
        },

        brand: {
          type: String,
        },

        quantity: {
          type: Number,
          default: 1,
        },

        price: {
          type: Number,
          default: 0,
        },

        total: {
          type: Number,
          default: 0,
        },
      },
    ],

    saleDate: {
      type: Date,
      required: true,
    },

    totalAmount: {
      type: Number,
      default: 0,
    },

    discount: {
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
  "Sale",
  saleSchema
);