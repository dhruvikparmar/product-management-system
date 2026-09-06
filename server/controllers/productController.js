const Product = require("../models/Product");
const StockHistory = require("../models/StockHistory");

// GET PRODUCTS
const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// ADD PRODUCT
const addProduct = async (req, res) => {
  try {
    const existingProduct = await Product.findOne({
      productId: req.body.productId,
    });

    // PRODUCT ALREADY EXISTS
    if (existingProduct) {

      existingProduct.stock =
        Number(existingProduct.stock) +
        Number(req.body.stock);

      existingProduct.purchasePrice =
        req.body.purchasePrice;

      existingProduct.sellPrice =
        req.body.sellPrice;

      await existingProduct.save();

      // SAVE PURCHASE HISTORY
      await StockHistory.create({
  supplierName: req.body.supplierName,
  supplierMobile: req.body.supplierMobile,
  billNumber: req.body.billNumber,
  purchaseDate: req.body.purchaseDate,

  productId: req.body.productId,
  productName: req.body.name,
  brand: req.body.brand,

  purchasePrice: req.body.purchasePrice,
  quantity: req.body.stock,

  image: existingProduct.image,
});

      return res.status(200).json({
        message:
          "Stock Updated Successfully",
      });
    }

    // NEW PRODUCT
    const product = new Product({
      ...req.body,
      image: req.file
        ? req.file.filename
        : "",
    });

    await product.save();

    // SAVE PURCHASE HISTORY
    await StockHistory.create({
  supplierName: req.body.supplierName,
  supplierMobile: req.body.supplierMobile,
  billNumber: req.body.billNumber,
  purchaseDate: req.body.purchaseDate,

  productId: req.body.productId,
  productName: req.body.name,
  brand: req.body.brand,

  purchasePrice: req.body.purchasePrice,
  quantity: req.body.stock,

  image: product.image,
});

    res.status(201).json({
      message:
        "New Product Added Successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
// DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Product Deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// UPDATE PRODUCT
const updateProduct = async (req, res) => {

  try {
    if (req.file) {
      req.body.image = req.file.filename;
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getProducts,
  addProduct,
  deleteProduct,
  updateProduct,
};