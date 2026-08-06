"use client";

import { Check, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import s from "./detail.module.css";

export default function AddToCartButton({ productId, quantity = 1, availableForSale = true }) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = async () => {
    if (!availableForSale) return;
    setIsAdded(true);
    await addToCart(productId, quantity);
    setTimeout(() => setIsAdded(false), 1600);
  };

  return (
    <button 
      className={s.addBtn} 
      data-anim="action"
      onClick={handleAdd}
      disabled={!availableForSale}
      style={!availableForSale ? { opacity: 0.6, cursor: 'not-allowed', backgroundColor: '#e0e0e0', color: '#666' } : {}}
    >
      {isAdded ? <Check size={20} strokeWidth={3} /> : (availableForSale && <ShoppingBag size={20} strokeWidth={3} />)}
      {!availableForSale ? "Out of stock" : (isAdded ? "Added" : "Add to bag")}
    </button>
  );
}
