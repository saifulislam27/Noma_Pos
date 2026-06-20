import { createContext, useContext, useState } from "react";
import { createTransaction } from "../services/transactionService";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

    const checkout = async () => {
  if (cart.length === 0) {
    alert("Cart masih kosong");
    return;
  }

  try {
    const payload = {
      items: cart.map((item) => ({
        productId: item.id,
        qty: item.qty,
        price: item.price,
      })),
      total: totalPrice,
    };

    const res = await createTransaction(payload);

    alert("Transaksi berhasil");

    clearCart();

    return res;
  } catch (err) {
    console.error(err);
    alert("Gagal checkout");
  }
};


  const addToCart = (product) => {
    setCart((prev) => {
      const exist = prev.find((item) => item.id === product.id);

      if (exist) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }

      return [...prev, { ...product, qty: 1 }];
    });
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, qty: item.qty - 1 }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        decreaseQty,
        removeFromCart,
        clearCart,
        totalPrice,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);