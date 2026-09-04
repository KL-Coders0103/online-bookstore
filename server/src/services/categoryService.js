const Category = require("../models/Category");

const createCategory = async ({ name, slug, description }) => {
  const normalizedName = name.trim();
  const normalizedSlug = slug.trim().toLowerCase();

  const existingCategory = await Category.findOne({
    $or: [
      { name: normalizedName },
      { slug: normalizedSlug },
    ],
  });

  if (existingCategory) {
    const error = new Error("Category with this name or slug already exists");
    error.statusCode = 409;
    throw error;
  }

  const category = await Category.create({
    name: normalizedName,
    slug: normalizedSlug,
    description: description?.trim(),
  });

  return category;
};

const getAllCategories = async () => {
  return Category.find().sort({ name: 1 });
};

const getCategoryById = async (categoryId) => {
  const category = await Category.findById(categoryId);

  if (!category) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  return category;
};

module.exports = { createCategory, getAllCategories, getCategoryById };