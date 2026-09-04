const mongoose = require("mongoose");

const Order = require("../models/Order");
const Book = require("../models/Book");
const User = require("../models/User");

const createOrder = async (userId, { items, shippingAddress }) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const user = await User.findById(userId).session(session);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    for (const item of items) {
      const cartItem = user.cart.items.find(
        (cartItem) =>
          cartItem.book.toString() === item.bookId
      );

      if (!cartItem) {
        const error = new Error(
          "All ordered books must be present in the cart"
        );
        error.statusCode = 400;
        throw error;
      }

      if (cartItem.quantity !== item.quantity) {
        const error = new Error(
          "Order quantity must match the cart quantity"
        );
        error.statusCode = 400;
        throw error;
      }
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const book = await Book.findById(item.bookId).session(session);

      if (!book) {
        const error = new Error(
          `Book not found: ${item.bookId}`
        );
        error.statusCode = 404;
        throw error;
      }

      if (book.stock < item.quantity) {
        const error = new Error(
          `Insufficient stock for book: ${book.title}`
        );
        error.statusCode = 400;
        throw error;
      }

      const itemTotal = book.price * item.quantity;

      totalAmount += itemTotal;

      orderItems.push({
        book: book._id,
        title: book.title,
        price: book.price,
        quantity: item.quantity,
      });

      book.stock -= item.quantity;

      await book.save({ session });
    }

    const [order] = await Order.create(
      [
        {
          user: userId,
          items: orderItems,
          totalAmount,
          shippingAddress: {
            fullName: shippingAddress.fullName.trim(),
            addressLine1: shippingAddress.addressLine1.trim(),
            addressLine2: shippingAddress.addressLine2?.trim(),
            city: shippingAddress.city.trim(),
            state: shippingAddress.state.trim(),
            postalCode: shippingAddress.postalCode.trim(),
            country: shippingAddress.country.trim(),
          },
        },
      ],
      { session }
    );

    for (const item of items) {
      const cartItem = user.cart.items.find(
        (cartItem) =>
          cartItem.book.toString() === item.bookId
      );

      if (cartItem) {
        user.cart.items.pull(cartItem._id);
      }
    }

    await user.save({ session });
    await session.commitTransaction();

    return order;
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    await session.endSession();
  }
};

const getUserOrders = async (userId) => {
  return Order.find({ user: userId }).sort({
    createdAt: -1,
  });
};

const getOrderById = async (userId, orderId) => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    const error = new Error("Invalid order ID");
    error.statusCode = 400;
    throw error;
  }

  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  });

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  return order;
};

const updateOrderStatus = async (orderId, status) => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    const error = new Error("Invalid order ID");
    error.statusCode = 400;
    throw error;
  }

  const order = await Order.findById(orderId);

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  order.status = status;

  await order.save();

  return order;
};

module.exports = {createOrder, getUserOrders, getOrderById, updateOrderStatus};