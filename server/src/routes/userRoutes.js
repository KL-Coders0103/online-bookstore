const express = require("express");

const { getProfile, updateProfile } = require("../controllers/userController");
const authenticate = require("../middleware/authMiddleware");
const {validateUpdateProfile} = require("../validators/userValidator");

const router = express.Router();

router.get("/profile", authenticate, getProfile);

router.put("/profile", authenticate, validateUpdateProfile, updateProfile);

module.exports = router;