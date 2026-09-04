const mongoose = require("mongoose");

const validateAddCartItem = (req, res, next) => {
  const { bookId, quantity } = req.body;

  if (!bookId || !mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(400).json({
      message: "A valid bookId is required",
    });
  }

  if (
    quantity === undefined ||
    !Number.isInteger(quantity) ||
    quantity < 1
  ) {
    return res.status(400).json({
      message: "Quantity must be a positive integer",
    });
  }

  next();
};

const validateUpdateCartItem = (req, res, next) => {
  const { quantity } = req.body;

  if (
    quantity === undefined ||
    !Number.isInteger(quantity) ||
    quantity < 1
  ) {
    return res.status(400).json({
      message: "Quantity must be a positive integer",
    });
  }

  next();
};

module.exports = {validateAddCartItem, validateUpdateCartItem};