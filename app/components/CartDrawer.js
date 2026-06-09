"use client";

import { X, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import styles from "./CartDrawer.module.css";

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cart, updateQuantity, removeLineItem, checkoutUrl, isLoading } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      <div 
        className={styles.backdrop}
        onClick={() => setIsCartOpen(false)}
      />
      <div className={styles.drawer}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Your Cart</h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className={styles.closeButton}
          >
            <X />
          </button>
        </div>

        {/* Cart Items */}
        <div className={styles.itemsContainer}>
          {(!cart?.lines?.edges || cart.lines.edges.length === 0) ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>🛒</span>
              <p className={styles.emptyText}>Your cart is empty</p>
            </div>
          ) : (
            <div className={styles.itemsList}>
              {cart.lines.edges.map((edge) => {
                const item = edge.node;
                const product = item.merchandise.product;
                return (
                  <div key={item.id} className={styles.card}>
                    {isLoading && <div className={styles.loadingOverlay} />}
                    <div className={styles.imageWrapper}>
                      <Image
                        src={product.images?.edges[0]?.node?.url || "/products/Default Museli.png"}
                        alt={product.title}
                        fill
                        className={styles.image}
                      />
                    </div>
                    <div className={styles.itemInfo}>
                      <div>
                        <h3 className={styles.itemName}>{product.title}</h3>
                        <p className={styles.itemPrice}>₹{item.cost.totalAmount.amount}</p>
                      </div>
                      <div className={styles.itemBottom}>
                        <div className={styles.quantitySelector}>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className={styles.quantityBtn}
                            disabled={isLoading}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className={styles.quantityValue}>{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className={styles.quantityBtn}
                            disabled={isLoading}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeLineItem(item.id)}
                          className={styles.removeBtn}
                          disabled={isLoading}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart?.lines?.edges?.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.subtotalRow}>
              <span className={styles.subtotalLabel}>Subtotal</span>
              <span className={styles.subtotalAmount}>
                ₹{cart.cost.subtotalAmount.amount}
              </span>
            </div>
            <a
              href={checkoutUrl}
              className={styles.checkoutBtn}
            >
              Checkout
            </a>
          </div>
        )}
      </div>
    </>
  );
}

