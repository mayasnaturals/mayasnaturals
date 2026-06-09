"use client";

import { CartProvider } from "@/context/CartContext";
import { CustomerProvider } from "@/context/CustomerContext";
import CartDrawer from "@/app/components/CartDrawer";

export function Providers({ children }) {
  return (
    <CustomerProvider>
      <CartProvider>
        {children}
        <CartDrawer />
      </CartProvider>
    </CustomerProvider>
  );
}
