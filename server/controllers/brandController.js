const Brand = require("../models/Brands");


// GET ALL BRANDS
const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find()
      .sort({ createdAt: -1 });

    res.json(brands);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ADD BRAND
const addBrand = async (req, res) => {
  try {
    const brand = await Brand.create({
      name: req.body.name,
      image: req.file
        ? req.file.filename
        : "",
      status: req.body.status,
    });

    res.status(201).json(brand);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// UPDATE BRAND
const updateBrand = async (
  req,
  res
) => {
  try {

    const brand =
      await Brand.findById(
        req.params.id
      );

    if (!brand) {
      return res.status(404).json({
        message: "Brand Not Found",
      });
    }

    brand.name =
      req.body.name || brand.name;

    brand.status =
      req.body.status ||
      brand.status;

    if (req.file) {
      brand.image =
        req.file.filename;
    }

    const updatedBrand =
      await brand.save();

    res.json(updatedBrand);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// DELETE BRAND
const deleteBrand = async (
  req,
  res
) => {
  try {

    const brand =
      await Brand.findById(
        req.params.id
      );

    if (!brand) {
      return res.status(404).json({
        message: "Brand Not Found",
      });
    }

    await brand.deleteOne();

    res.json({
      message:
        "Brand Deleted Successfully",
    });

  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }
};


module.exports = {
  getBrands,
  addBrand,
  updateBrand,
  deleteBrand,
};