const mongoose = require("mongoose");
const Book = require("../models/Book");
const Category = require("../models/Category");

const createBook = async ({
  title,
  author,
  isbn,
  description,
  price,
  stock,
  coverImage,
  category,
  publishedDate,
}) => {
  const existingBook = await Book.findOne({ isbn: isbn.trim() });

  if (existingBook) {
    const error = new Error("A book with this ISBN already exists");
    error.statusCode = 409;
    throw error;
  }

  const categoryExists = await Category.findById(category);

  if (!categoryExists) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  const book = await Book.create({
    title: title.trim(),
    author: author.trim(),
    isbn: isbn.trim(),
    description: description.trim(),
    price,
    stock,
    coverImage: coverImage?.trim(),
    category,
    publishedDate,
  });

  return book;
};

const getAllBooks = async ({
  search,
  category,
  minPrice,
  maxPrice,
  sort,
  page = 1,
  limit = 10,
}) => {
  const filter = {};

  if (search) {
    filter.$or = [
      {
        title: {
          $regex: search,
          $options: "i",
        },
      },
      {
        author: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  if (category) {
    const categoryExists = await Category.findOne({
      slug: category.toLowerCase(),
    });

    if (!categoryExists) {
      const error = new Error("Category not found");
      error.statusCode = 404;
      throw error;
    }

    filter.category = categoryExists._id;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};

    if (minPrice !== undefined) {
      filter.price.$gte = Number(minPrice);
    }

    if (maxPrice !== undefined) {
      filter.price.$lte = Number(maxPrice);
    }
  }

  let sortOption = {
    createdAt: -1,
  };

  if (sort === "price_asc") {
    sortOption = { price: 1 };
  }

  if (sort === "price_desc") {
    sortOption = { price: -1 };
  }

  if (sort === "title_asc") {
    sortOption = { title: 1 };
  }

  if (sort === "title_desc") {
    sortOption = { title: -1 };
  }

  const pageNumber = Math.max(Number(page) || 1, 1);
  const limitNumber = Math.min(
    Math.max(Number(limit) || 10, 1),
    50
  );

  const skip = (pageNumber - 1) * limitNumber;

  const [books, totalBooks] = await Promise.all([
    Book.find(filter)
      .populate("category", "name slug")
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber),

    Book.countDocuments(filter),
  ]);

  return {
    books,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      totalBooks,
      totalPages: Math.ceil(totalBooks / limitNumber),
    },
  };
};

const getBookById = async (bookId) => {
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    const error = new Error("Invalid book ID");
    error.statusCode = 400;
    throw error;
  }

  const book = await Book.findById(bookId).populate(
    "category",
    "name slug"
  );

  if (!book) {
    const error = new Error("Book not found");
    error.statusCode = 404;
    throw error;
  }

  return book;
};

const updateBook = async (bookId, updates) => {
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    const error = new Error("Invalid book ID");
    error.statusCode = 400;
    throw error;
  }

  const book = await Book.findById(bookId);

  if (!book) {
    const error = new Error("Book not found");
    error.statusCode = 404;
    throw error;
  }

  if (updates.isbn !== undefined) {
    const normalizedIsbn = updates.isbn.trim();

    const existingBook = await Book.findOne({
      isbn: normalizedIsbn,
      _id: { $ne: bookId },
    });

    if (existingBook) {
      const error = new Error("A book with this ISBN already exists");
      error.statusCode = 409;
      throw error;
    }

    updates.isbn = normalizedIsbn;
  }

  if (updates.category !== undefined) {
    const categoryExists = await Category.findById(updates.category);

    if (!categoryExists) {
      const error = new Error("Category not found");
      error.statusCode = 404;
      throw error;
    }
  }

  const stringFields = [
    "title",
    "author",
    "description",
    "coverImage",
  ];

  stringFields.forEach((field) => {
    if (updates[field] !== undefined) {
      updates[field] = updates[field].trim();
    }
  });

  if (updates.isbn !== undefined) {
    updates.isbn = updates.isbn.trim();
  }

  Object.assign(book, updates);

  await book.save();

  return Book.findById(book._id).populate(
    "category",
    "name slug"
  );
};

const deleteBook = async (bookId) => {
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    const error = new Error("Invalid book ID");
    error.statusCode = 400;
    throw error;
  }
  const book = await Book.findById(bookId);

  if (!book) {
    const error = new Error("Book not found");
    error.statusCode = 404;
    throw error;
  }

  await Book.findByIdAndDelete(bookId);

  return book;
};

module.exports = { createBook, getAllBooks, getBookById, updateBook, deleteBook };