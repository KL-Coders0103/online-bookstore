const express = require("express");
const { register, login, me } = require("../controllers/authController");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const { validateRegister, validateLogin } = require("../validators/authValidator");

const router = express.Router();

router.post("/register",validateRegister, register);
router.post("/login", validateLogin, login);
router.get("/me", authenticate, me);
router.get("/admin-test", authenticate, authorize("admin"), (req, res) => {
    res.status(200).json({
        message: "Admin access granted",
        user: req.user
    });
});

module.exports = router;