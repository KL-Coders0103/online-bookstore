import { useCallback, useEffect, useState } from "react";

import CartContext from "./CartContext";
import {
  addToCart as addToCartRequest,
  clearCart as clearCartRequest,
  getCart,
  removeFromCart as removeFromCartRequest,
  updateCartItem as updateCartItemRequest,
} from "../services/cartService";
import useAuth from "../hooks/useAuth";

const CartProvider = ({ children }) => {
  const { user } = useAuth();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState("");

  const fetchCart = useCallback(async () => {
    if (!user) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getCart();

      setCart(data);
    } catch (err) {
      setError(err.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    let cancelled = false;

    getCart()
      .then((data) => {
        if (!cancelled) {
          setCart(data);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || "Failed to load cart");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  const addToCart = useCallback(
    async (bookId, quantity = 1) => {
      try {
        setAdding(true);
        setError("");

        const updatedCart = await addToCartRequest(bookId, quantity);

        setCart(updatedCart);

        return {
          success: true,
          cart: updatedCart,
        };
      } catch (err) {
        const message = err.message || "Failed to add item to cart";

        setError(message);

        return {
          success: false,
          error: message,
        };
      } finally {
        setAdding(false);
      }
    },
    []
  );

  const updateCartItem = useCallback(async (bookId, quantity) => {
    try {
      setUpdating(true);
      setError("");

      const updatedCart = await updateCartItemRequest(bookId, quantity);

      setCart(updatedCart);

      return {
        success: true,
        cart: updatedCart,
      };
    } catch (err) {
      const message = err.message || "Failed to update cart item";

      setError(message);

      return {
        success: false,
        error: message,
      };
    } finally {
      setUpdating(false);
    }
  }, []);

  const removeFromCart = useCallback(async (bookId) => {
    try {
      setRemoving(true);
      setError("");

      const updatedCart = await removeFromCartRequest(bookId);

      setCart(updatedCart);

      return {
        success: true,
        cart: updatedCart,
      };
    } catch (err) {
      const message = err.message || "Failed to remove item from cart";

      setError(message);

      return {
        success: false,
        error: message,
      };
    } finally {
      setRemoving(false);
    }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      setClearing(true);
      setError("");

      const updatedCart = await clearCartRequest();

      setCart(updatedCart);

      return {
        success: true,
        cart: updatedCart,
      };
    } catch (err) {
      const message = err.message || "Failed to clear cart";

      setError(message);

      return {
        success: false,
        error: message,
      };
    } finally {
      setClearing(false);
    }
  }, []);

  const value = {
    cart: user ? cart : null,
    loading: user ? loading : false,
    adding,
    updating,
    removing,
    clearing,
    error: user ? error : "",
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;