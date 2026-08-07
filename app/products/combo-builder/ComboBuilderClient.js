"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Loader2, RotateCcw, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { getComboPrice } from "@/lib/pricing";
import styles from "./combo.module.css";


export default function ComboBuilderClient({ initialProducts }) {
  const [comboSize, setComboSize] = useState(6);
  const [slots, setSlots] = useState([]);
  const [lockedWeight, setLockedWeight] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const { addLinesToCart } = useCart();
  const router = useRouter();

  const availableProducts = initialProducts;

  // For each product, we also need to manage which variant (weight) is currently selected in the UI before they add it to a slot
  const [selectedVariants, setSelectedVariants] = useState(
    availableProducts.reduce((acc, p) => {
      acc[p.id] = p.variants[0];
      return acc;
    }, {})
  );

  const handleVariantSelect = (productId, variant) => {
    setSelectedVariants(prev => ({ ...prev, [productId]: variant }));

    if (slots.some(s => s.productId === productId)) {
      setSlots(slots.map(s =>
        s.productId === productId
          ? { ...s, variantId: variant.variantId, weight: variant.weight, price: variant.price }
          : s
      ));
    }
  };

  const handleProductSelect = (product) => {
    const currentCount = slots.filter(s => s.productId === product.id).length;
    const nextCount = currentCount + 1;

    // Ensure we have enough space to add 1 more item
    if (slots.length + 1 > comboSize) return;

    handleQuantityChange(product, nextCount);
  };

  const handleRemoveSlot = (index) => {
    const newSlots = slots.filter((_, i) => i !== index);
    setSlots(newSlots);
    if (newSlots.length === 0) setLockedWeight(null);
  };

  const handleClearCombo = () => {
    setSlots([]);
    setLockedWeight(null);
  };

  const handleQuantityChange = (product, newQuantity) => {
    const currentCount = slots.filter(s => s.productId === product.id).length;
    const diff = newQuantity - currentCount;

    if (diff > 0) {
      let variant = selectedVariants[product.id];
      if (lockedWeight) {
        variant = product.variants.find(v => v.weight === lockedWeight) || variant;
      }
      if (variant.availableForSale === false) return;

      const variantsToAdd = [];
      for (let i = 0; i < diff; i++) {
        variantsToAdd.push({
          productId: product.id,
          variantId: variant.variantId,
          name: product.name,
          weight: variant.weight,
          price: variant.price,
          image: product.image,
          isMystery: product.isMystery
        });
      }

      let newSlots = [...slots, ...variantsToAdd];
      if (slots.length === 0 && variantsToAdd.length > 0) {
        setLockedWeight(variant.weight);
      }
      setSlots(newSlots);
    } else if (diff < 0) {
      let removed = 0;
      const newSlots = slots.filter(s => {
        if (s.productId === product.id && removed < Math.abs(diff)) {
          removed++;
          return false;
        }
        return true;
      });
      setSlots(newSlots);
      if (newSlots.length === 0) setLockedWeight(null);
    }
  };

  // Calculate prices
  const totalOriginalPrice = slots.reduce((sum, slot) => sum + slot.price, 0);
  const hardcodedPrice = lockedWeight ? getComboPrice(lockedWeight, comboSize) : null;
  const currentComboPrice = hardcodedPrice ? (hardcodedPrice / comboSize) * slots.length : totalOriginalPrice;

  const handleAddToCart = async () => {
    if (slots.length !== comboSize) return;
    setIsAdding(true);

    const comboId = `combo_${Date.now()}`;
    const aggregated = {};

    slots.forEach(slot => {
      // If it's mystery flavor, we use a hack for now: add the first real product's variant but tag it
      let actualVariantId = slot.variantId;
      if (slot.isMystery) {
        // Find a real product's variant that matches the weight, or just use the first available real variant
        const realProduct = initialProducts[0];
        actualVariantId = realProduct.variants[0].variantId;
      }

      if (aggregated[actualVariantId]) {
        aggregated[actualVariantId].quantity += 1;
      } else {
        aggregated[actualVariantId] = {
          merchandiseId: actualVariantId,
          quantity: 1,
          attributes: [
            { key: "_comboId", value: comboId },
            { key: "_isMystery", value: slot.isMystery ? "true" : "false" }
          ]
        };
      }
    });

    const linesToAdd = Object.values(aggregated);

    await addLinesToCart(linesToAdd);
    setIsAdding(false);
  };

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <h1>Make Your Own Combo</h1>
        <p>Pick {comboSize} of your favorite makhana flavors and build the ultimate snack stash. No duplicates allowed!</p>
      </section>

      <div className={styles.builderContainer}>
        <div className={styles.stepsSection}>
          {/* Step 1: Size */}
          <div className={styles.stepBlock}>
            <div className={styles.stepHeader}>
              <div className={styles.stepNumber}>1</div>
              <h2>Select Size</h2>
            </div>
            <div className={styles.sizeOptions}>
              {[2, 4, 6, 8].map(size => (
                <button
                  key={size}
                  className={`${styles.sizeBtn} ${comboSize === size ? styles.active : ''}`}
                  onClick={() => {
                    setComboSize(size);
                    if (slots.length > size) {
                      setSlots(slots.slice(0, size));
                    }
                  }}
                >
                  Pack of {size}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Flavors & Weights */}
          <div className={styles.stepBlock}>
            <div className={styles.stepHeader}>
              <div className={styles.stepNumber}>2</div>
              <h2>Pick Flavors & Weights</h2>
            </div>

            <div className={styles.productGrid}>
              {availableProducts.map(product => {
                const selectedCount = slots.filter(s => s.productId === product.id).length;
                const isSelected = selectedCount > 0;
                const isMaxReached = slots.length >= comboSize;
                const isDisabled = !isSelected && isMaxReached;

                return (
                  <div
                    key={product.id}
                    className={`${styles.productCard} ${isSelected ? styles.selected : ''} ${isDisabled ? styles.disabled : ''}`}
                  >
                    <div className={styles.cardVisual} onClick={() => !isDisabled && handleProductSelect(product)} style={{ position: 'relative' }}>
                      <Image src={product.image} alt={product.name} fill style={{ objectFit: 'cover' }} />
                      {isSelected && (
                        <div style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          background: '#e44a32',
                          color: 'white',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                          fontWeight: 'bold',
                          fontSize: '0.85rem'
                        }}>
                          {selectedCount}
                        </div>
                      )}
                    </div>
                    <div className={styles.cardInfo}>
                      <h3 onClick={() => !isDisabled && handleProductSelect(product)}>{product.name}</h3>
                      <div className={styles.variantSelectors}>
                        {product.variants.map(variant => {
                          const isOutOfStock = variant.availableForSale === false;
                          const isWeightLockedOut = lockedWeight && lockedWeight !== variant.weight;
                          const isDisabledVariant = isWeightLockedOut || isOutOfStock;
                          const isActive = lockedWeight ? lockedWeight === variant.weight && !isOutOfStock : selectedVariants[product.id].variantId === variant.variantId && !isOutOfStock;

                          return (
                            <button
                              key={variant.variantId}
                              disabled={isDisabledVariant}
                              className={`${styles.variantBtn} ${isActive ? styles.active : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!isDisabledVariant) {
                                  handleVariantSelect(product.id, variant);
                                }
                              }}
                              style={{ opacity: isDisabledVariant ? 0.4 : 1, cursor: isDisabledVariant ? 'not-allowed' : 'pointer', textDecoration: isOutOfStock ? 'line-through' : 'none' }}
                            >
                              {variant.weight} - {isOutOfStock ? "Out of stock" : `₹${variant.price}`}
                            </button>
                          );
                        })}
                      </div>
                      <div style={{
                        marginTop: '8px',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center'
                      }}>
                        <select
                          value={selectedCount === 0 ? "" : selectedCount}
                          onChange={(e) => handleQuantityChange(product, parseInt(e.target.value))}
                          disabled={isDisabled && selectedCount === 0}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: selectedCount > 0 ? '#6a462f' : '#f0f0f0',
                            color: selectedCount > 0 ? 'white' : '#555',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            fontSize: '0.8rem',
                            cursor: (isDisabled && selectedCount === 0) ? 'not-allowed' : 'pointer',
                            outline: 'none',
                            width: '100%',
                            textAlign: 'center'
                          }}
                        >
                          {selectedCount === 0 && (
                            <option value="" disabled hidden>Add to Combo</option>
                          )}
                          {[...new Set([2, 4, 6, 8, selectedCount])]
                            .sort((a, b) => a - b)
                            .filter(num => num > 0 && (num === selectedCount || num <= selectedCount + (comboSize - slots.length)))
                            .map(num => (
                              <option key={num} value={num}>
                                {num} Selected
                              </option>
                            ))
                          }
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Summary */}
        <aside className={styles.summarySidebar}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Your Combo</h2>
            {slots.length > 0 && (
              <button
                onClick={handleClearCombo}
                style={{ fontSize: '0.8rem', color: '#f04e24', display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <RotateCcw size={14} /> Reset
              </button>
            )}
          </div>
          <div className={styles.slotsGrid}>
            {Array.from({ length: comboSize }).map((_, i) => {
              const slot = slots[i];
              return (
                <div key={i} className={`${styles.slot} ${slot ? styles.filled : ''}`}>
                  {slot ? (
                    <>
                      <Image src={slot.image} alt={slot.name} fill style={{ objectFit: 'cover' }} />
                      <button className={styles.slotRemoveBtn} onClick={() => handleRemoveSlot(i)}>
                        <X size={14} />
                      </button>
                    </>
                  ) : (
                    <span style={{ color: '#b9957d', fontSize: '2rem', fontWeight: 900 }}>?</span>
                  )}
                </div>
              );
            })}
          </div>

          {slots.length > 0 && (
            <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '16px', borderBottom: '1px solid #eadbcc' }}>
              {slots.map((slot, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#776153' }}>
                  <span style={{ textTransform: 'capitalize', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginRight: '10px' }}>
                    {slot.name.toLowerCase()} ({slot.weight})
                  </span>
                  <span>₹{slot.price}</span>
                </div>
              ))}
            </div>
          )}

          <div className={styles.summaryTotal} style={{ borderTop: slots.length > 0 ? 'none' : '2px solid #eadbcc', paddingTop: slots.length > 0 ? '0' : '16px', marginBottom: (hardcodedPrice && slots.length === comboSize && totalOriginalPrice > hardcodedPrice) ? '4px' : '20px' }}>
            <span>Total:</span>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              {hardcodedPrice && slots.length === comboSize && totalOriginalPrice > hardcodedPrice && (
                <span style={{ fontSize: '0.9rem', color: '#888', textDecoration: 'line-through' }}>₹{totalOriginalPrice.toFixed(2)}</span>
              )}
              <span>₹{slots.length === comboSize ? hardcodedPrice.toFixed(2) : currentComboPrice.toFixed(2)}</span>
            </div>
          </div>

          {hardcodedPrice && slots.length === comboSize && totalOriginalPrice > hardcodedPrice && (
            <div style={{
              color: '#34a853',
              fontSize: '0.9rem',
              fontWeight: '800',
              textAlign: 'right',
              marginBottom: '20px'
            }}>
              You save {Math.round((1 - (hardcodedPrice / totalOriginalPrice)) * 100)}% with this combo!
            </div>
          )}

          <button
            className={styles.addBtn}
            disabled={slots.length !== comboSize || isAdding}
            onClick={handleAddToCart}
          >
            {isAdding ? <Loader2 className="animate-spin" /> : <><ShoppingBag size={20} style={{ marginRight: '8px' }} /> Add to Cart</>}
          </button>
        </aside>
      </div>
    </main>
  );
}
