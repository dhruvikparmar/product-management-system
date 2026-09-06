const Sale = require("../models/Sale");
const Product = require("../models/Product");


// GET SALES
const getSales = async (req, res) => {
  try {

    const sales = await Sale.find()
      .sort({ createdAt: -1 });

    res.status(200).json(sales);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// GET SALE BY ID
const getSaleById = async (req, res) => {
  try {

    const sale =
      await Sale.findById(
        req.params.id
      );

    res.json(sale);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// ADD SALE
const addSale = async (req, res) => {

  try {

    const {
      customerName,
      phoneNumber,
      saleDate,
      items,
      discount,
      grandTotal,
    } = req.body;

    // VALIDATION

    if (!customerName) {
      return res.status(400).json({
        message: "Customer Name Required",
      });
    }

    if (
      !phoneNumber ||
      phoneNumber.length !== 10
    ) {
      return res.status(400).json({
        message:
          "Phone Number must be 10 digits",
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({
        message:
          "Please add at least one product",
      });
    }

    // STOCK CHECK

    for (const item of items) {

      // Skip custom products
      if (
        item.custom ||
        !item.productId
      ) {
        continue;
      }

      const product =
        await Product.findById(
          item.productId
        );

      if (!product) {

        return res.status(400).json({
          message: `${item.productName} not found`
        });

      }

      product.stock =
        Number(product.stock) -
        Number(item.quantity);

      await product.save();

    }

    // STOCK DEDUCT
    for (const item of items) {

      if (
        item.custom ||
        !item.productId
      ) {
        continue;
      }

      const product =
        await Product.findById(
          item.productId
        );

      if (!product) {
        continue;
      }

      product.stock =
        Number(product.stock) -
        Number(item.quantity);

      await product.save();

    }

    // SAVE SALE

    const lastSale =
      await Sale.findOne()
        .sort({ createdAt: -1 });

    let billNo = "BILL-0001";

    if (lastSale?.billNo) {

      const lastNumber =
        parseInt(
          lastSale.billNo.split("-")[1]
        );

      billNo =
        `BILL-${String(
          lastNumber + 1
        ).padStart(4, "0")}`;
    }

    const sale = await Sale.create({
      billNo,
      customerName,
      phoneNumber,
      saleDate,
      items,
      discount:
        Number(discount || 0),
      grandTotal,
    });

    res.status(201).json({
      success: true,
      message:
        "Sale Saved Successfully",
      sale,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });

  }

};

const updateSale = async (req, res) => {
  try {

    const saleId = req.params.id;

    const {
      customerName,
      phoneNumber,
      items,
      discount,
      grandTotal,
    } = req.body;

    const oldSale = await Sale.findById(saleId);

    if (!oldSale) {
      return res.status(404).json({
        message: "Sale not found",
      });
    }

    // RETURN OLD STOCK

    for (const oldItem of oldSale.items) {

      const product =
        await Product.findById(
          oldItem.productId
        );

      if (product) {

        product.stock =
          Number(product.stock) +
          Number(oldItem.quantity);

        await product.save();
      }
    }

    // CHECK NEW STOCK

    for (const item of items) {

      const product =
        await Product.findById(
          item.productId
        );

      if (!product) {
        return res.status(404).json({
          message:
            `${item.productName} not found`,
        });
      }

      if (
        Number(item.quantity) >
        Number(product.stock)
      ) {
        return res.status(400).json({
          message:
            `Insufficient stock for ${product.name}`,
        });
      }
    }

    // DEDUCT NEW STOCK

    for (const item of items) {

      const product =
        await Product.findById(
          item.productId
        );

      product.stock =
        Number(product.stock) -
        Number(item.quantity);

      await product.save();
    }

    oldSale.customerName =
      customerName;

    oldSale.phoneNumber =
      phoneNumber;

    oldSale.items = items;

    oldSale.discount =
      discount || 0;

    oldSale.grandTotal =
      grandTotal;

    await oldSale.save();

    res.json({
      success: true,
      message:
        "Sale Updated Successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

const deleteSale = async (
  req,
  res
) => {

  try {

    const sale =
      await Sale.findById(
        req.params.id
      );

    if (!sale) {
      return res.status(404).json({
        message:
          "Sale not found",
      });
    }

    // RESTORE STOCK

    for (
      const item of sale.items
    ) {

      const product =
        await Product.findById(
          item.productId
        );

      if (product) {

        product.stock =
          Number(product.stock) +
          Number(item.quantity);

        await product.save();
      }
    }

    await Sale.findByIdAndDelete(
      req.params.id
    );

    res.json({
      success: true,
      message:
        "Bill Deleted Successfully",
    });

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });

  }
};

module.exports = {
  getSales,
  getSaleById,
  addSale,
  updateSale,
  deleteSale,
};