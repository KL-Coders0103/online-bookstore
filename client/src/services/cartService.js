import api from "./api";

const getCart = async () => {
  const data = await api("/cart");

  return data.cart;
};

const addToCart = async (bookId, quantity = 1) => {
  const data = await api("/cart/items", {
    method: "POST",
    body: JSON.stringify({
      bookId,
      quantity,
    }),
  });

  return data.cart;
};

const updateCartItem = async (bookId, quantity) => {
  const data = await api(`/cart/items/${bookId}`, {
    method: "PUT",
    body: JSON.stringify({
      quantity,
    }),
  });

  return data.cart;
};

const removeFromCart = async (bookId) => {
  const data = await api(`/cart/items/${bookId}`, {
    method: "DELETE",
  });

  return data.cart;
};

const clearCart = async () => {
  const data = await api("/cart", {
    method: "DELETE",
  });

  return data.cart;
};

export { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
