const { createCategory, getAllCategories, getCategoryById } = require("../services/categoryService");

const create = async (req, res, next) => {
  try {
    const category = await createCategory(req.body);

    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const categories = await getAllCategories();

    res.status(200).json({
      categories,
    });
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const category = await getCategoryById(req.params.id);

    res.status(200).json({
      category,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { create, getAll, getOne};