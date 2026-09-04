const express = require("express");
const {create, getAll, getOne} = require("../controllers/orderController");
const authenticate = require("../middleware/authMiddleware");
const {validateCreateOrder, validateUpdateOrderStatus} = require("../validators/orderValidator");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", authenticate, validateCreateOrder, create);
router.get("/", authenticate, getAll);
router.get("/:id", authenticate, getOne);
router.patch("/:id/status", authenticate, authorize("admin"), validateUpdateOrderStatus, updateStatus);

module.exports = router;