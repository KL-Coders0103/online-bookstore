import api from "./api";

const createOrder = async (orderData) => {
  const data = await api("/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  });

  return data.order;
};

const getOrders = async () => {
  const data = await api("/orders");
  return data.orders;
};

const getOrderById = async (orderId) => {
  const data = await api(`/orders/${orderId}`);
  return data.order;
};

export {
  createOrder,
  getOrders,
  getOrderById,
};