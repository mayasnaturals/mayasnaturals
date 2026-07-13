"use client";

import { Check, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import s from "./detail.module.css";

export default function AddToCartButton({ productId, quantity = 1 }) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = async () => {
    setIsAdded(true);
    await addToCart(productId, quantity);
    setTimeout(() => setIsAdded(false), 1600);
  };

  return (
    <button 
      className={s.addBtn} 
      data-anim="action"
      onClick={handleAdd}
    >
      {isAdded ? <Check size={20} strokeWidth={3} /> : <ShoppingBag size={20} strokeWidth={3} />}
      {isAdded ? "Added" : "Add to bag"}
    </button>
  );
}
