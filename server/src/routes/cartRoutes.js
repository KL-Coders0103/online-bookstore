const express = require("express");

const {getUserCart, addCartItem, updateItem, removeItem, clearUserCart} = require("../controllers/cartController");
const authenticate = require("../middleware/authMiddleware");
const {validateAddCartItem, validateUpdateCartItem} = require("../validators/cartValidator");

const router = express.Router();

router.get("/", authenticate, getUserCart);
router.post("/items", authenticate, validateAddCartItem,addCartItem);
router.put("/items/:bookId", authenticate, validateUpdateCartItem, updateItem);
router.delete("/items/:bookId", authenticate, removeItem);
router.delete("/", authenticate, clearUserCart);

module.exports = router;