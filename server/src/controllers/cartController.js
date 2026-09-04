const {getCart, addItemToCart, updateCartItem, removeCartItem, clearCart} = require("../services/cartService");

const getUserCart = async (req, res, next) => {
  try {
    const cart = await getCart(req.user.id);

    res.status(200).json({
      message: "Cart fetched successfully",
      cart,
    });
  } catch (error) {
    next(error);
  }
};

const addCartItem = async (req, res, next) => {
  try {
    const { bookId, quantity } = req.body;

    const cart = await addItemToCart(
      req.user.id,
      bookId,
      quantity
    );

    res.status(200).json({
      message: "Item added to cart successfully",
      cart,
    });
  } catch (error) {
    next(error);
  }
};

const updateItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;

    const cart = await updateCartItem(
      req.user.id,
      req.params.bookId,
      quantity
    );

    res.status(200).json({
      message: "Cart item updated successfully",
      cart,
    });
  } catch (error) {
    next(error);
  }
};

const removeItem = async (req, res, next) => {
  try {
    const cart = await removeCartItem(
      req.user.id,
      req.params.bookId
    );

    res.status(200).json({
      message: "Item removed from cart successfully",
      cart,
    });
  } catch (error) {
    next(error);
  }
};

const clearUserCart = async (req, res, next) => {
  try {
    const cart = await clearCart(req.user.id);

    res.status(200).json({
      message: "Cart cleared successfully",
      cart,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUserCart, addCartItem, updateItem, removeItem, clearUserCart };