const { getUserProfile, updateUserProfile} = require("../services/userService");

const getProfile = async (req, res, next) => {
  try {
    const user = await getUserProfile(req.user.id);

    res.status(200).json({
      message: "Profile fetched successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await updateUserProfile(
      req.user.id,
      req.body
    );

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {getProfile, updateProfile};