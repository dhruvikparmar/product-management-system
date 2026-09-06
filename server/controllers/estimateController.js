const Estimate = require("../models/Estimate");

// GET ESTIMATES
const getEstimates = async (req, res) => {
  try {
    const estimates =
      await Estimate.find().sort({
        createdAt: -1,
      });

    res.json(estimates);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SINGLE ESTIMATE
const getEstimateById = async (
  req,
  res
) => {
  try {
    const estimate =
      await Estimate.findById(
        req.params.id
      );

    if (!estimate) {
      return res.status(404).json({
        message:
          "Estimate Not Found",
      });
    }

    res.json(estimate);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// CREATE ESTIMATE
const createEstimate = async (
  req,
  res
) => {
  try {
    const lastEstimate =
      await Estimate.findOne().sort({
        createdAt: -1,
      });

    let estimateNo = "EST-0001";

    if (lastEstimate) {
      const lastNumber =
        parseInt(
          lastEstimate.estimateNo.split(
            "-"
          )[1]
        ) + 1;

      estimateNo = `EST-${String(
        lastNumber
      ).padStart(4, "0")}`;
    }

    const estimate =
      await Estimate.create({
        estimateNo,
        ...req.body,
      });

    res.status(201).json(
      estimate
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE ESTIMATE
const deleteEstimate = async (req, res) => {
  try {

    await Estimate.findByIdAndDelete(
      req.params.id
    );

    res.json({
      success: true,
      message:
        "Estimate Deleted Successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

const updateEstimate = async (
  req,
  res
) => {

  try {

    const estimate =
      await Estimate.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.json(estimate);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

module.exports = {
  getEstimates,
  getEstimateById,
  createEstimate,
  updateEstimate,
  deleteEstimate,
};