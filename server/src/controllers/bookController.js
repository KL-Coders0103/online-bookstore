const {createBook, getAllBooks, getBookById, updateBook, deleteBook} = require("../services/bookService");

const create = async (req, res, next) => {
  try {
    const book = await createBook(req.body);

    res.status(201).json({
      message: "Book created successfully",
      book,
    });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const result = await getAllBooks(req.query);

    res.status(200).json({
      message: "Books fetched successfully",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const book = await getBookById(req.params.id);

    res.status(200).json({
      book,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const book = await updateBook(req.params.id, req.body);

    res.status(200).json({
      message: "Book updated successfully",
      book,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const book = await deleteBook(req.params.id);

    res.status(200).json({
      message: "Book deleted successfully",
      book,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {create, getAll, getOne, update, remove};