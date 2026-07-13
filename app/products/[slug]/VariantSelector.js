"use client";

import { useState } from "react";
import s from "./detail.module.css";
import AddToCartButton from "./AddToCartButton";

export default function VariantSelector({ options, variants, initialVariant }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState(
    initialVariant ? initialVariant.selectedOptions.reduce((acc, opt) => ({ ...acc, [opt.name]: opt.value }), {}) : {}
  );

  const handleOptionChange = (name, value) => {
    setSelectedOptions(prev => ({ ...prev, [name]: value }));
    setQuantity(1);
  };

  // Find the variant that matches all selected options
  const currentVariant = variants.find(variant => 
    variant.selectedOptions.every(opt => selectedOptions[opt.name] === opt.value)
  ) || initialVariant || variants[0];

  return (
    <>
      {options && options.map((option) => {
        if (option.values.length <= 1) return null; // Don't show if there's only one option
        return (
          <div key={option.name} className={s.optionsGroup} data-anim="action">
            <p className={s.optionsLabel}>{option.name}</p>
            <div className={s.optionsList}>
              {option.values.map(val => (
                <button 
                  key={val} 
                  className={`${s.optionBtn} ${selectedOptions[option.name] === val ? s.optionBtnActive : ''}`}
                  onClick={() => handleOptionChange(option.name, val)}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        );
      })}
      
      <div className={s.heroActions}>
        <div className={s.priceBox} data-anim="action">
          <p className={s.priceLabel}>Price</p>
          <strong className={s.priceValue}>
            Rs.&nbsp;{(parseFloat(currentVariant?.price?.amount || 0) * quantity).toFixed(2).replace(/\.00$/, '')}
          </strong>
        </div>
        
        <div className={s.qtySelector} data-anim="action">
          <button className={s.qtySelectorBtn} onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
          <span className={s.qtySelectorNum}>{quantity}</span>
          <button className={s.qtySelectorBtn} onClick={() => setQuantity(quantity + 1)}>+</button>
        </div>

        <AddToCartButton productId={currentVariant?.id} quantity={quantity} />
      </div>
    </>
  );
}
