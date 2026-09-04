const User = require("../models/User");
const Book = require("../models/Book");

const getCart = async (userId) => {
  const user = await User.findById(userId).populate({
    path: "cart.items.book",
    select: "title author price stock coverImage",
  });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user.cart;
};

const addItemToCart = async (userId, bookId, quantity) => {
  const book = await Book.findById(bookId);

  if (!book) {
    const error = new Error("Book not found");
    error.statusCode = 404;
    throw error;
  }

  if (book.stock < quantity) {
    const error = new Error("Insufficient stock");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const existingItem = user.cart.items.find(
    (item) => item.book.toString() === bookId
  );

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;

    if (newQuantity > book.stock) {
      const error = new Error("Requested quantity exceeds available stock");
      error.statusCode = 400;
      throw error;
    }

    existingItem.quantity = newQuantity;
  } else {
    user.cart.items.push({
      book: bookId,
      quantity,
    });
  }

  await user.save();

  return getCart(userId);
};

const updateCartItem = async (userId, bookId, quantity) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const cartItem = user.cart.items.find(
    (item) => item.book.toString() === bookId
  );

  if (!cartItem) {
    const error = new Error("Book is not in the cart");
    error.statusCode = 404;
    throw error;
  }

  const book = await Book.findById(bookId);

  if (!book) {
    const error = new Error("Book not found");
    error.statusCode = 404;
    throw error;
  }

  if (quantity > book.stock) {
    const error = new Error("Requested quantity exceeds available stock");
    error.statusCode = 400;
    throw error;
  }

  cartItem.quantity = quantity;

  await user.save();

  return getCart(userId);
};

const removeCartItem = async (userId, bookId) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const itemIndex = user.cart.items.findIndex(
    (item) => item.book.toString() === bookId
  );

  if (itemIndex === -1) {
    const error = new Error("Book is not in the cart");
    error.statusCode = 404;
    throw error;
  }

  user.cart.items.splice(itemIndex, 1);

  await user.save();

  return getCart(userId);
};

const clearCart = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  user.cart.items = [];

  await user.save();

  return getCart(userId);
};

module.exports = { getCart, addItemToCart, updateCartItem, removeCartItem, clearCart };