import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    setCartItems([...cartItems, { ...item, id: `${item.type}-${Date.now()}` }]);
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const updateCartItem = (id, updates) => {
    setCartItems(
      cartItems.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.length;

  const total = cartItems.reduce((sum, item) => {
    if (item.type === 'hotel') return sum + item.pricePerNight * item.nights * item.rooms;
    if (item.type === 'activity') return sum + item.pricePerPerson * item.participants;
    if (item.type === 'tourPackage') return sum + item.pricePerPerson * item.participants;
    if (item.type === 'carRental') return sum + item.pricePerDay * item.days;
    return sum;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart,
        cartCount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
