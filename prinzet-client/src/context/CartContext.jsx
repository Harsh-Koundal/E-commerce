import { createContext, useContext, useState, useEffect } from "react";
import { getData, postData, updateData, deleteData } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  // 🔄 Normalize item IDs
  const normalizeCart = (items = []) =>
    items.map((item) => ({
      ...item,
      id: item.id || item._id,
    }));

  const refreshCart = async () => {
    if (!user) {
      setCart([]); 
      return;
    }
    try {
      const data = await getData("/cart/view");
      const serverCart = data.cart?.items || [];
      setCart(normalizeCart(serverCart));
    } catch (err) {
      console.error("Error refreshing cart:", err);
      toast.error("Failed to refresh cart");
      setCart([]);
    }
  };
  useEffect(() => {
    if (user) {
      refreshCart();
    } else {
      setCart([]); // clear cart when user logs out
    }
  }, [user]);

  const addToCart = async (item) => {
    if (!user) {
      toast.error("Please login to add items to your cart");
      return;
    }
    try {
      await postData("/cart/add", item);
      await refreshCart();
      toast.success("Item added to cart");
    } catch (err) {
      console.error("Error adding to cart:", err.response.data.message);
      toast.error(err.response.data.message || "Failed to add item");
    }
  };
  const removeFromCart = async (id) => {
    if (!user) return;
    try {
      await deleteData("/cart/remove", { itemId: id });
      await refreshCart();
      toast.success("Item removed from cart");
    } catch (err) {
      console.error("Error removing from cart:", err);
      toast.error("Failed to remove item");
    }
  };

  const updateQuantity = async (id, newQty) => {
    if (!user) return;
    try {
      await updateData("/cart/update", {
        itemId: id,
        updates: { numCopies: newQty },
      });
      await refreshCart();
      toast.success("Item quantity updated");
    } catch (err) {
      console.error("Error updating cart:", err);
      toast.error("Failed to update item quantity");
    }
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      const promises = cart.map((item) =>
        deleteData("/cart/remove", { itemId: item.id || item._id })
      );
      await Promise.all(promises);
      await refreshCart();
      toast.success("Cart cleared");
    } catch (err) {
      console.error("Error clearing cart:", err);
      toast.error("Failed to clear cart");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
