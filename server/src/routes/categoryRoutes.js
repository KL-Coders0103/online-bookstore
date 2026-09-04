const express = require("express");
const {create, getAll, getOne } = require("../controllers/categoryController");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizationMiddleware");

const {validateCreateCategory} = require("../validators/categoryValidator");

const router = express.Router();

// Public
router.get("/", getAll);
router.get("/:id", getOne);

// Admin only
router.post("/", authenticate, authorize("admin"), validateCreateCategory, create);

module.exports = router;