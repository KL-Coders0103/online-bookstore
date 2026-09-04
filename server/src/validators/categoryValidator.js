const validateCreateCategory = (req, res, next) => {
  const { name, slug } = req.body;

  if (!name || !slug) {
    return res.status(400).json({
      message: "Category name and slug are required",
    });
  }

  if (typeof name !== "string" || name.trim().length < 2) {
    return res.status(400).json({
      message: "Category name must be at least 2 characters long",
    });
  }

  if (name.trim().length > 50) {
    return res.status(400).json({
      message: "Category name cannot exceed 50 characters",
    });
  }

  if (typeof slug !== "string" || slug.trim().length < 2) {
    return res.status(400).json({
      message: "Category slug must be at least 2 characters long",
    });
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug.trim().toLowerCase())) {
    return res.status(400).json({
      message: "Category slug must contain only lowercase letters, numbers and hyphens",
    });
  }

  if (
    req.body.description !== undefined &&
    typeof req.body.description !== "string"
  ) {
    return res.status(400).json({
      message: "Category description must be a string",
    });
  }

  next();
};

module.exports = { validateCreateCategory };