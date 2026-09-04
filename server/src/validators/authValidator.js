const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Name, email and password are required",
    });
  }

  if (typeof name !== "string" || name.trim().length < 2) {
    return res.status(400).json({
      message: "Name must be at least 2 characters long",
    });
  }

  if (typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({
      message: "Please provide a valid email",
    });
  }

  if (typeof password !== "string" || password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters long",
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  if (typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({
      message: "Please provide a valid email",
    });
  }

  if (typeof password !== "string") {
    return res.status(400).json({
      message: "Password must be a string",
    });
  }

  next();
};

module.exports = { validateRegister, validateLogin};