const express = require("express");
const { create, getAll, getOne, remove, update } = require("../controllers/bookController");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const { validateCreateBook, validateUpdateBook } = require("../validators/bookValidator");
const { validateBookQuery } = require("../validators/bookQueryValidator");

const router = express.Router();

// Public
router.get("/", validateBookQuery, getAll);
router.get("/:id", getOne);

// Admin only
router.post("/", authenticate, authorize("admin"),
  validateCreateBook, create
);
router.put("/:id", authenticate, authorize("admin"),
  validateUpdateBook, update
);
router.delete("/:id", authenticate, authorize("admin"), remove);

module.exports = router;