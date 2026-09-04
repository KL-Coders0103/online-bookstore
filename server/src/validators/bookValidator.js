const mongoose = require("mongoose");

const validateCreateBook = (req, res, next) => {
  const { title, author, isbn, description, price, stock, category} = req.body;

  if (
    !title ||
    !author ||
    !isbn ||
    !description ||
    price === undefined ||
    stock === undefined ||
    !category
  ) {
    return res.status(400).json({
      message:
        "Title, author, ISBN, description, price, stock and category are required",
    });
  }

  if (typeof title !== "string" || title.trim().length < 1) {
    return res.status(400).json({
      message: "Book title cannot be empty",
    });
  }

  if (title.trim().length > 200) {
    return res.status(400).json({
      message: "Book title cannot exceed 200 characters",
    });
  }

  if (typeof author !== "string" || author.trim().length < 1) {
    return res.status(400).json({
      message: "Author is required",
    });
  }

  if (author.trim().length > 100) {
    return res.status(400).json({
      message: "Author name cannot exceed 100 characters",
    });
  }

  if (typeof isbn !== "string" || isbn.trim().length < 1) {
    return res.status(400).json({
      message: "ISBN is required",
    });
  }

  if (
    typeof description !== "string" ||
    description.trim().length < 1
  ) {
    return res.status(400).json({
      message: "Book description cannot be empty",
    });
  }

  if (description.trim().length > 2000) {
    return res.status(400).json({
      message: "Book description cannot exceed 2000 characters",
    });
  }

  if (typeof price !== "number" || Number.isNaN(price)) {
    return res.status(400).json({
      message: "Price must be a valid number",
    });
  }

  if (price < 0) {
    return res.status(400).json({
      message: "Price cannot be negative",
    });
  }

  if (typeof stock !== "number" || Number.isNaN(stock)) {
    return res.status(400).json({
      message: "Stock must be a valid number",
    });
  }

  if (!Number.isInteger(stock) || stock < 0) {
    return res.status(400).json({
      message: "Stock must be a non-negative integer",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(category)) {
    return res.status(400).json({
      message: "Invalid category ID",
    });
  }

  if (
    req.body.coverImage !== undefined &&
    typeof req.body.coverImage !== "string"
  ) {
    return res.status(400).json({
      message: "Cover image must be a string",
    });
  }

  if (
    req.body.publishedDate !== undefined &&
    Number.isNaN(Date.parse(req.body.publishedDate))
  ) {
    return res.status(400).json({
      message: "Published date must be a valid date",
    });
  }

  next();
};

const validateUpdateBook = (req, res, next) => {
  const allowedFields = [
    "title",
    "author",
    "isbn",
    "description",
    "price",
    "stock",
    "coverImage",
    "category",
    "publishedDate",
  ];

  const providedFields = Object.keys(req.body);

  if (providedFields.length === 0) {
    return res.status(400).json({
      message: "At least one field is required to update the book",
    });
  }

  const hasInvalidField = providedFields.some(
    (field) => !allowedFields.includes(field)
  );

  if (hasInvalidField) {
    return res.status(400).json({
      message: "Request contains an invalid field",
    });
  }

  if (
    req.body.title !== undefined &&
    (typeof req.body.title !== "string" ||
      req.body.title.trim().length < 1)
  ) {
    return res.status(400).json({
      message: "Book title cannot be empty",
    });
  }

  if (
    req.body.title !== undefined &&
    req.body.title.trim().length > 200
  ) {
    return res.status(400).json({
      message: "Book title cannot exceed 200 characters",
    });
  }

  if (
    req.body.author !== undefined &&
    (typeof req.body.author !== "string" ||
      req.body.author.trim().length < 1)
  ) {
    return res.status(400).json({
      message: "Author is required",
    });
  }

  if (
    req.body.author !== undefined &&
    req.body.author.trim().length > 100
  ) {
    return res.status(400).json({
      message: "Author name cannot exceed 100 characters",
    });
  }

  if (
    req.body.isbn !== undefined &&
    (typeof req.body.isbn !== "string" ||
      req.body.isbn.trim().length < 1)
  ) {
    return res.status(400).json({
      message: "ISBN is required",
    });
  }

  if (
    req.body.description !== undefined &&
    (typeof req.body.description !== "string" ||
      req.body.description.trim().length < 1)
  ) {
    return res.status(400).json({
      message: "Book description cannot be empty",
    });
  }

  if (
    req.body.description !== undefined &&
    req.body.description.trim().length > 2000
  ) {
    return res.status(400).json({
      message: "Book description cannot exceed 2000 characters",
    });
  }

  if (req.body.price !== undefined) {
    if (
      typeof req.body.price !== "number" ||
      Number.isNaN(req.body.price)
    ) {
      return res.status(400).json({
        message: "Price must be a valid number",
      });
    }

    if (req.body.price < 0) {
      return res.status(400).json({
        message: "Price cannot be negative",
      });
    }
  }

  if (req.body.stock !== undefined) {
    if (
      typeof req.body.stock !== "number" ||
      Number.isNaN(req.body.stock)
    ) {
      return res.status(400).json({
        message: "Stock must be a valid number",
      });
    }

    if (!Number.isInteger(req.body.stock) || req.body.stock < 0) {
      return res.status(400).json({
        message: "Stock must be a non-negative integer",
      });
    }
  }

  if (req.body.category !== undefined) {
    if (!mongoose.Types.ObjectId.isValid(req.body.category)) {
      return res.status(400).json({
        message: "Invalid category ID",
      });
    }
  }

  if (
    req.body.coverImage !== undefined &&
    typeof req.body.coverImage !== "string"
  ) {
    return res.status(400).json({
      message: "Cover image must be a string",
    });
  }

  if (
    req.body.publishedDate !== undefined &&
    Number.isNaN(Date.parse(req.body.publishedDate))
  ) {
    return res.status(400).json({
      message: "Published date must be a valid date",
    });
  }

  next();
};

module.exports = { validateCreateBook, validateUpdateBook };
