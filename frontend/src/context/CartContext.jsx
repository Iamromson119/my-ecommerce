import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!user) {
      setCart([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get("/cart");
      setCart(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productId, qty = 1) => {
    const { data } = await api.post("/cart", { productId, qty });
    setCart(data);
  };

  const updateQty = async (productId, qty) => {
    const { data } = await api.put(`/cart/${productId}`, { qty });
    setCart(data);
  };

  const removeFromCart = async (productId) => {
    const { data } = await api.delete(`/cart/${productId}`);
    setCart(data);
  };

  const clearCart = async () => {
    await api.delete("/cart");
    setCart([]);
  };

  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.qty, 0);

  return (
    <CartContext.Provider
      value={{ cart, loading, addToCart, updateQty, removeFromCart, clearCart, refreshCart, itemCount, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
