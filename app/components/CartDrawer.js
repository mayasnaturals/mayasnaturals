"use client";

import { X, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import styles from "./CartDrawer.module.css";

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cart, updateQuantity, removeLineItem, removeLines, isLoading } = useCart();

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
              {(() => {
                const groupedLines = [];
                const combos = {};

                cart.lines.edges.forEach((edge) => {
                  const item = edge.node;
                  const comboAttr = item.attributes?.find(a => a.key === '_comboId');
                  
                  if (comboAttr) {
                    const comboId = comboAttr.value;
                    if (!combos[comboId]) {
                      combos[comboId] = {
                        isCombo: true,
                        id: comboId,
                        lineIds: [],
                        title: "Makhana Custom Combo",
                        quantity: 1, // Visual quantity for the combo bundle
                        totalAmount: 0,
                        items: [],
                        image: "/products/Default Museli.png" // We can use the first item's image later
                      };
                      groupedLines.push(combos[comboId]);
                    }
                    combos[comboId].lineIds.push(item.id);
                    combos[comboId].totalAmount += parseFloat(item.cost.totalAmount.amount);
                    combos[comboId].items.push(item);
                    if (combos[comboId].items.length === 1) {
                        combos[comboId].image = item.merchandise.product.images?.edges[0]?.node?.url || "/products/Default Museli.png";
                    }
                  } else {
                    groupedLines.push({
                      isCombo: false,
                      ...item
                    });
                  }
                });

                return groupedLines.map((item) => {
                  if (item.isCombo) {
                    return (
                      <div key={item.id} className={styles.card}>
                        {isLoading && <div className={styles.loadingOverlay} />}
                        <div className={styles.imageWrapper}>
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className={styles.image}
                          />
                        </div>
                        <div className={styles.itemInfo}>
                          <div>
                            <h3 className={styles.itemName}>{item.title}</h3>
                            <p className={styles.itemPrice}>₹{item.totalAmount.toFixed(2)}</p>
                            
                            <div style={{ marginTop: '8px', marginBottom: '8px', background: '#fdf8f4', padding: '6px', borderRadius: '8px', border: '1px solid #f0e6dd' }}>
                              {item.items.map((subItem, idx) => {
                                 let title = subItem.merchandise.product.title.toLowerCase();
                                 title = title.replace('roasted makhana', '').replace(/[()]/g, '').trim() || 'original';
                                 return (
                                   <div key={idx} style={{ fontSize: '0.7rem', color: '#776153', display: 'flex', justifyContent: 'space-between', marginBottom: '2px', textTransform: 'capitalize' }}>
                                     <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '8px' }}>
                                       {title} ({subItem.merchandise.title})
                                     </span>
                                     <span>₹{parseFloat(subItem.cost.totalAmount.amount).toFixed(0)}</span>
                                   </div>
                                 );
                              })}
                            </div>
                          </div>
                          <div className={styles.itemBottom} style={{ marginTop: 'auto' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#888', background: '#f5f5f5', padding: '4px 10px', borderRadius: '12px' }}>
                                Qty: 1
                            </div>
                            <button 
                              onClick={() => removeLines(item.lineIds)}
                              className={styles.removeBtn}
                              disabled={isLoading}
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }

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
                });
              })()}
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
            <Link
              href="/checkout"
              onClick={() => setIsCartOpen(false)}
              className={styles.checkoutBtn}
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

