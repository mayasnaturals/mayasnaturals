"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createCart, getCart, addToCart as shopifyAddToCart, updateCart, removeFromCart } from "@/lib/shopify";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeCart = async () => {
      setIsLoading(true);
      const cartId = localStorage.getItem("shopifyCartId");
      if (cartId) {
        const existingCart = await getCart(cartId);
        if (existingCart) {
          setCart(existingCart);
        } else {
          // If the cart doesn't exist anymore on Shopify
          localStorage.removeItem("shopifyCartId");
        }
      }
      setIsLoading(false);
    };

    initializeCart();
  }, []);

  const addToCart = async (variantId, quantity = 1, attributes = []) => {
    await addLinesToCart([{ merchandiseId: variantId, quantity, attributes }]);
  };

  const addLinesToCart = async (lines) => {
    setIsLoading(true);
    let currentCartId = cart?.id || localStorage.getItem("shopifyCartId");

    if (!currentCartId) {
      const newCart = await createCart();
      if (newCart?.id) {
        currentCartId = newCart.id;
        localStorage.setItem("shopifyCartId", currentCartId);
      }
    }

    if (currentCartId) {
      const updatedCart = await shopifyAddToCart(currentCartId, lines);
      setCart(updatedCart);
      setIsCartOpen(true); // Auto-open cart
    }
    setIsLoading(false);
  };

  const updateQuantity = async (lineId, quantity) => {
    if (!cart?.id) return;
    setIsLoading(true);
    if (quantity <= 0) {
      const updatedCart = await removeFromCart(cart.id, [lineId]);
      setCart(updatedCart);
    } else {
      const updatedCart = await updateCart(cart.id, [{ id: lineId, quantity }]);
      setCart(updatedCart);
    }
    setIsLoading(false);
  };

  const removeLineItem = async (lineId) => {
    await removeLines([lineId]);
  };

  const removeLines = async (lineIds) => {
    if (!cart?.id) return;
    setIsLoading(true);
    const updatedCart = await removeFromCart(cart.id, lineIds);
    setCart(updatedCart);
    setIsLoading(false);
  };

  const refreshCart = async () => {
    if (!cart?.id) return;
    setIsLoading(true);
    const updatedCart = await getCart(cart.id);
    if (updatedCart) setCart(updatedCart);
    setIsLoading(false);
  };

  const clearCart = () => {
    localStorage.removeItem("shopifyCartId");
    setCart(null);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        addLinesToCart,
        updateQuantity,
        removeLineItem,
        removeLines,
        refreshCart,
        clearCart,
        checkoutUrl: cart?.checkoutUrl,
        cartCount: cart?.lines?.edges?.reduce((sum, edge) => sum + edge.node.quantity, 0) || 0,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
