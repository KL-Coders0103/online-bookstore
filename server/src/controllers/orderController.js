const {createOrder, getUserOrders, getOrderById, updateOrderStatus} = require("../services/orderService");

const create = async (req, res, next) => {
  try {
    const order = await createOrder(req.user.id, req.body);

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const orders = await getUserOrders(req.user.id);

    res.status(200).json({
      message: "Orders fetched successfully",
      orders,
    });
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const order = await getOrderById(
      req.user.id,
      req.params.id
    );

    res.status(200).json({
      message: "Order fetched successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const order = await updateOrderStatus(
      req.params.id,
      req.body.status
    );

    res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {create, getAll, getOne, updateStatus};