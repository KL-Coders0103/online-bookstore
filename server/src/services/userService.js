const User = require("../models/User");

const getUserProfile = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

const updateUserProfile = async (userId, updates) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (updates.email !== undefined) {
    const normalizedEmail = updates.email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: userId },
    });

    if (existingUser) {
      const error = new Error(
        "User with this email already exists"
      );
      error.statusCode = 409;
      throw error;
    }

    user.email = normalizedEmail;
  }

  if (updates.name !== undefined) {
    user.name = updates.name.trim();
  }

  await user.save();

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

module.exports = {getUserProfile, updateUserProfile};