const validateUpdateProfile = (req, res, next) => {
  const allowedFields = ["name", "email"];

  const providedFields = Object.keys(req.body);

  if (providedFields.length === 0) {
    return res.status(400).json({
      message: "At least one field is required to update the profile",
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

  if (req.body.name !== undefined) {
    if (
      typeof req.body.name !== "string" ||
      req.body.name.trim().length < 2
    ) {
      return res.status(400).json({
        message: "Name must be at least 2 characters long",
      });
    }

    if (req.body.name.trim().length > 50) {
      return res.status(400).json({
        message: "Name cannot exceed 50 characters",
      });
    }
  }

  if (req.body.email !== undefined) {
    if (
      typeof req.body.email !== "string" ||
      !req.body.email.includes("@")
    ) {
      return res.status(400).json({
        message: "Please provide a valid email",
      });
    }
  }

  next();
};

module.exports = {validateUpdateProfile};