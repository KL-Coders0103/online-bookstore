const allowedSorts = [
  "price_asc",
  "price_desc",
  "title_asc",
  "title_desc",
];

const validateBookQuery = (req, res, next) => {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    sort,
    page,
    limit,
  } = req.query;

  if (
    search !== undefined &&
    (typeof search !== "string" || search.trim().length === 0)
  ) {
    return res.status(400).json({
      message: "Search must be a non-empty string",
    });
  }

  if (
    category !== undefined &&
    (typeof category !== "string" || category.trim().length === 0)
  ) {
    return res.status(400).json({
      message: "Category must be a non-empty string",
    });
  }

  if (minPrice !== undefined) {
    const value = Number(minPrice);

    if (Number.isNaN(value) || value < 0) {
      return res.status(400).json({
        message: "minPrice must be a non-negative number",
      });
    }
  }

  if (maxPrice !== undefined) {
    const value = Number(maxPrice);

    if (Number.isNaN(value) || value < 0) {
      return res.status(400).json({
        message: "maxPrice must be a non-negative number",
      });
    }
  }

  if (
    minPrice !== undefined &&
    maxPrice !== undefined &&
    Number(minPrice) > Number(maxPrice)
  ) {
    return res.status(400).json({
      message: "minPrice cannot be greater than maxPrice",
    });
  }

  if (sort !== undefined && !allowedSorts.includes(sort)) {
    return res.status(400).json({
      message: "Invalid sort option",
    });
  }

  if (page !== undefined) {
    const pageNumber = Number(page);

    if (
      !Number.isInteger(pageNumber) ||
      pageNumber < 1
    ) {
      return res.status(400).json({
        message: "Page must be a positive integer",
      });
    }
  }

  if (limit !== undefined) {
    const limitNumber = Number(limit);

    if (
      !Number.isInteger(limitNumber) ||
      limitNumber < 1 ||
      limitNumber > 50
    ) {
      return res.status(400).json({
        message: "Limit must be an integer between 1 and 50",
      });
    }
  }

  next();
};

module.exports = {validateBookQuery};