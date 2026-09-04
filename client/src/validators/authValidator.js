const validateRegisterForm = ({ name, email, password, confirmPassword}) => {
  const errors = {};

  const trimmedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();

  if (!trimmedName) {
    errors.name = "Name is required";
  } else if (trimmedName.length < 2) {
    errors.name = "Name must be at least 2 characters long";
  } else if (trimmedName.length > 50) {
    errors.name = "Name cannot exceed 50 characters";
  }

  if (!normalizedEmail) {
    errors.email = "Email is required";
  } else if (!normalizedEmail.includes("@")) {
    errors.email = "Please provide a valid email";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters long";
  }

  if (!confirmPassword) {
    errors.confirmPassword =
      "Please confirm your password";
  } else if (password !== confirmPassword) {
    errors.confirmPassword =
      "Passwords do not match";
  }

  return errors;
};

export default validateRegisterForm;