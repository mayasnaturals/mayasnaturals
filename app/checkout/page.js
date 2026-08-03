"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Script from "next/script";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import styles from "./checkout.module.css";
import { getMrp } from "@/lib/utils";
import { getComboPrice } from "@/lib/pricing";

export default function CheckoutPage() {
  const { cart, isLoading: cartLoading, refreshCart } = useCart();
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  
  const [discountCode, setDiscountCode] = useState("");
  const [discountError, setDiscountError] = useState("");
  const [discountSuccess, setDiscountSuccess] = useState("");
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!cart?.id) {
      setError("Your cart is empty.");
      return;
    }

    const requiredFields = ["email", "phone", "firstName", "lastName", "address", "city", "state", "pincode"];
    const isFormIncomplete = requiredFields.some(field => !formData[field].trim());
    
    if (isFormIncomplete) {
      setError("Please fill in all contact and shipping details before proceeding.");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      // 1. Create Order
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId: cart.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      // 2. Initialize Razorpay Options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
        amount: data.amount,
        currency: data.currency,
        name: "Maya's Naturals",
        description: "Order Payment",
        order_id: data.orderId,
        handler: async function (response) {
          // 3. Verify Payment
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                cartId: cart.id,
                customerData: formData,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok) {
              // Clear cart locally
              localStorage.removeItem("shopifyCartId");
              // Store order data for invoice page
              if (verifyData.orderData) {
                sessionStorage.setItem("invoiceData", JSON.stringify(verifyData.orderData));
              }
              // Redirect to order success / invoice page
              window.location.href = "/order-success";
            } else {
              setError(verifyData.error || "Payment verification failed");
            }
          } catch (err) {
            setError("Error verifying payment.");
            console.error(err);
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#f25c2a",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        setError(response.error.description);
      });
      rzp.open();
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyDiscount = async () => {
    setDiscountError("");
    setDiscountSuccess("");
    if (!discountCode.trim()) {
      setDiscountError("Please enter a discount code.");
      return;
    }
    if (!formData.email.trim()) {
      setDiscountError("Please enter your email first to apply a discount.");
      return;
    }
    

    setIsApplyingDiscount(true);
    try {
      const res = await fetch("/api/apply-discount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId: cart.id,
          code: discountCode,
          email: formData.email,
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to apply discount.");
      }
      setDiscountSuccess("🎉 Discount applied successfully!");
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#82b94b', '#ffc833', '#f25c2a', '#fff8eb']
      });
      setDiscountCode("");
      await refreshCart();
    } catch (err) {
      setDiscountError(err.message);
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  const handleRemoveDiscount = async (codeToRemove) => {
    setDiscountError("");
    setDiscountSuccess("");
    setIsApplyingDiscount(true);
    try {
      const res = await fetch("/api/remove-discount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId: cart.id, code: codeToRemove })
      });
      if (!res.ok) throw new Error("Failed to remove discount.");
      setDiscountSuccess("Discount removed.");
      setDiscountCode("");
      await refreshCart();
    } catch (err) {
      setDiscountError(err.message);
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  if (cartLoading && !cart?.id) return (
    <div className={styles.page}>
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner} />
        <div className={styles.loadingText}>Loading your cart...</div>
      </div>
    </div>
  );

  const groupedLines = [];
  const combos = {};
  let calculatedSubtotal = 0; // The total we will charge before shipping
  let calculatedOriginalSubtotal = 0; // Total MRP of everything

  // Get the exact discount amount Shopify calculated
  const shopifySubtotal = parseFloat(cart?.cost?.subtotalAmount?.amount || 0);
  const shopifyTotal = parseFloat(cart?.cost?.totalAmount?.amount || 0);
  const shopifyDiscount = Math.round(Math.max(0, shopifySubtotal - shopifyTotal));

  if (cart?.lines?.edges) {
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
            quantity: 1, 
            totalAmount: 0,
            originalTotalAmount: 0,
            items: [],
            image: "/products/Default Museli.png"
          };
        }
        combos[comboId].lineIds.push(item.id);
        const itemAmount = parseFloat(item.cost.totalAmount.amount);
        const perUnitPrice = itemAmount / item.quantity;
        const baseMrp = getMrp(item.merchandise.product.title, item.merchandise.title, perUnitPrice);
        const mrp = baseMrp !== null ? baseMrp : perUnitPrice + 100;
        
        combos[comboId].originalTotalAmount += (mrp * item.quantity);
        combos[comboId].items.push(item);
        if (combos[comboId].items.length === 1) {
            combos[comboId].image = item.merchandise.product.images?.edges[0]?.node?.url || "/products/Default Museli.png";
        }
      } else {
        const itemAmount = parseFloat(item.cost.totalAmount.amount);
        
        const perUnitPrice = itemAmount / item.quantity; 
        const baseMrp = getMrp(item.merchandise.product.title, item.merchandise.title, perUnitPrice);
        const mrp = baseMrp !== null ? baseMrp : perUnitPrice + 100;
        const totalMrp = mrp * item.quantity;
        
        calculatedOriginalSubtotal += totalMrp;
        calculatedSubtotal += itemAmount;

        groupedLines.push({
          isCombo: false,
          ...item,
          mrp,
          totalMrp,
          savings: Math.max(0, totalMrp - itemAmount)
        });
      }
    });

    Object.values(combos).forEach(combo => {
      if (combo.items.length > 0) {
        const sampleVariant = combo.items[0].merchandise.title;
        const size = combo.items.length;
        const hardcoded = getComboPrice(sampleVariant, size);
        
        if (hardcoded) {
          combo.totalAmount = hardcoded;
        } else {
          combo.totalAmount = combo.originalTotalAmount;
        }
        
        calculatedSubtotal += combo.totalAmount;
        calculatedOriginalSubtotal += combo.originalTotalAmount;
        groupedLines.push(combo);
      }
    });
  }

  // Simple, clear math:
  // 1. Our subtotal (sum of our prices)
  // 2. Sequential discount math (e.g. 5% then 5% applied step-by-step)
  // 3. Shipping on the after-discount amount
  calculatedSubtotal = Math.round(calculatedSubtotal);
  
  let effectiveDiscount = 0;
  const applicableCodes = (cart?.discountCodes || []).filter(dc => dc.applicable);
  const numCodes = applicableCodes.length;

  if (shopifySubtotal > 0 && shopifyDiscount > 0 && numCodes > 0) {
    // Shopify natively adds percentages (e.g. 5% + 5% = 10% total additive).
    const additiveTotalPercentage = shopifyDiscount / shopifySubtotal; 
    
    // Average per-coupon percentage
    const perCouponPercentage = additiveTotalPercentage / numCodes;
    
    // Calculate sequential discount mathematically: 1 - (1 - P)^n
    const sequentialMultiplier = Math.pow(1 - perCouponPercentage, numCodes);
    const sequentialTotalPercentage = 1 - sequentialMultiplier;
    
    effectiveDiscount = Math.round(calculatedSubtotal * sequentialTotalPercentage);
  }

  const discountedSubtotal = calculatedSubtotal - effectiveDiscount;
  const shipping = discountedSubtotal > 0 && discountedSubtotal < 499 ? 49 : 0;
  const total = discountedSubtotal + shipping;
  const totalSavings = Math.max(0, calculatedOriginalSubtotal - discountedSubtotal);

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className={styles.page}>
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <div className={styles.pageKicker}>🛒 Secure Checkout</div>
          <h1 className={styles.pageTitle}>
            Almost <span>There!</span>
          </h1>
        </div>

        <div className={styles.container}>
          {/* Left Column — Forms */}
          <div>
            {/* Contact Information */}
            <div className={styles.section}>
              <span className={styles.sectionEyebrow}>Step 1</span>
              <h2 className={styles.title}>
                <span className={styles.titleIcon}>📧</span>
                Contact Info
              </h2>
              <div className={styles.formGroup}>
                <label className={styles.label}>Email Address</label>
                <input type="email" name="email" value={formData.email} required className={styles.input} onChange={handleChange} placeholder="your@email.com" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} required className={styles.input} onChange={handleChange} placeholder="+91 98765 43210" />
              </div>
            </div>

            {/* Shipping Address */}
            <div className={styles.section}>
              <span className={styles.sectionEyebrow}>Step 2</span>
              <h2 className={styles.title}>
                <span className={styles.titleIcon}>📦</span>
                Shipping Address
              </h2>
              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>First Name</label>
                  <input type="text" name="firstName" value={formData.firstName} required className={styles.input} onChange={handleChange} placeholder="First name" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Last Name</label>
                  <input type="text" name="lastName" value={formData.lastName} required className={styles.input} onChange={handleChange} placeholder="Last name" />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Street Address</label>
                <input type="text" name="address" value={formData.address} required className={styles.input} onChange={handleChange} placeholder="House no, street, area" />
              </div>
              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>City</label>
                  <input type="text" name="city" value={formData.city} required className={styles.input} onChange={handleChange} placeholder="City" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>State</label>
                  <input type="text" name="state" value={formData.state} required className={styles.input} onChange={handleChange} placeholder="State" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>PIN Code</label>
                  <input type="text" name="pincode" value={formData.pincode} required className={styles.input} onChange={handleChange} placeholder="PIN" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column — Order Summary */}
          <div className={styles.orderCard}>
            <div className={styles.section}>
              <span className={styles.sectionEyebrow}>Your Order</span>
              <h2 className={styles.title}>
                <span className={styles.titleIcon}>🧾</span>
                Order Summary
              </h2>

              {/* Product Items */}
              {groupedLines.map((item) => {
                  if (item.isCombo) {
                    const savings = Math.max(0, item.originalTotalAmount - item.totalAmount);
                    return (
                      <div key={item.id} className={styles.productRow}>
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={56}
                          height={56}
                          className={styles.summaryImage}
                        />
                        <div className={styles.summaryDetails}>
                          <div className={styles.summaryTitle}>{item.title}</div>
                          <div className={styles.summaryQuantity}>{item.items.length} items (Qty: 1)</div>
                          {savings > 0 && <div className={styles.discountBadge}>🔥 You save ₹{savings.toFixed(0)}</div>}
                        </div>
                        <div className={styles.priceContainer}>
                          <span className={styles.originalPrice}>₹{item.originalTotalAmount.toFixed(0)}</span>
                          <span className={styles.discountedPrice}>₹{item.totalAmount.toFixed(0)}</span>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={item.id} className={styles.productRow}>
                      <Image
                        src={item.merchandise.product.images?.edges[0]?.node?.url || "/products/Default Museli.png"}
                        alt={item.merchandise.product.title}
                        width={56}
                        height={56}
                        className={styles.summaryImage}
                      />
                      <div className={styles.summaryDetails}>
                        <div className={styles.summaryTitle}>{item.merchandise.product.title}</div>
                        <div className={styles.summaryQuantity}>Qty: {item.quantity}</div>
                        {item.savings > 0 && <div className={styles.discountBadge}>🔥 You save ₹{item.savings.toFixed(0)}</div>}
                      </div>
                      <div className={styles.priceContainer}>
                        <span className={styles.originalPrice}>₹{item.totalMrp.toFixed(0)}</span>
                        <span className={styles.discountedPrice}>₹{parseFloat(item.cost.totalAmount.amount).toFixed(0)}</span>
                      </div>
                    </div>
                  );
                })}

              <div className={styles.divider} />

              {/* Subtotal */}
              <div className={styles.summaryItem}>
                <span>Subtotal</span>
                <div className={styles.priceContainer}>
                  <span className={styles.originalPrice}>₹{calculatedOriginalSubtotal.toFixed(0)}</span>
                  <span className={styles.discountedPrice}>₹{calculatedSubtotal}</span>
                </div>
              </div>

              {/* Applied Discounts */}
              {(() => {
                if (numCodes === 0) return null;
                
                const additiveTotalPercentage = shopifySubtotal > 0 ? (shopifyDiscount / shopifySubtotal) : 0;
                const perCouponPercentage = additiveTotalPercentage / numCodes;
                const displayPercent = Math.round(perCouponPercentage * 100);
                
                let currentSubtotal = calculatedSubtotal;
                
                return applicableCodes.map((dc, index) => {
                  // Apply sequentially for display
                  let stepDiscount = Math.round(currentSubtotal * perCouponPercentage);
                  
                  // Make sure the sum of step discounts perfectly matches effectiveDiscount due to rounding
                  if (index === numCodes - 1) {
                    const previousDiscounts = Math.round(calculatedSubtotal - currentSubtotal);
                    stepDiscount = effectiveDiscount - previousDiscounts;
                  }
                  
                  currentSubtotal -= stepDiscount;

                  return (
                    <div key={index} className={styles.appliedDiscount}>
                      <div className={styles.appliedDiscountLeft}>
                        <span>🏷️ {dc.code}</span>
                        {displayPercent > 0 && (
                          <span className={styles.discountPercentBadge}>{displayPercent}% OFF</span>
                        )}
                      </div>
                      <span className={styles.appliedDiscountAmount}>
                        -₹{stepDiscount}
                      </span>
                      <button
                        onClick={() => handleRemoveDiscount(dc.code)}
                        disabled={isApplyingDiscount}
                        className={styles.removeDiscountBtn}
                        title={`Remove ${dc.code}`}
                      >
                        ✕
                      </button>
                    </div>
                  );
                });
              })()}

              {/* Shipping */}
              <div className={styles.summaryItem}>
                <span>
                  Shipping
                  {discountedSubtotal >= 499 && <span className={styles.shippingNote}>FREE ✨</span>}
                </span>
                <span style={{ fontWeight: 900 }}>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
              </div>

              <div className={styles.divider} />

              {/* Discount Code Input */}
              <div className={styles.discountSection}>
                <div className={styles.discountInputRow}>
                  <input
                    type="text"
                    placeholder="Got a coupon code?"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className={styles.discountInput}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyDiscount()}
                  />
                  <button
                    onClick={handleApplyDiscount}
                    disabled={isApplyingDiscount}
                    className={styles.applyButton}
                  >
                    {isApplyingDiscount ? "..." : "Apply"}
                  </button>
                </div>
                {discountError && <div className={styles.discountError}>⚠️ {discountError}</div>}
                {discountSuccess && <div className={styles.discountSuccess}>✅ {discountSuccess}</div>}
              </div>

              <div className={styles.divider} />

              {/* Total Savings */}
              {totalSavings > 0 && (
                <div className={styles.savingsRow}>
                  <span>🎉 Total Savings</span>
                  <span>-₹{totalSavings.toFixed(0)}</span>
                </div>
              )}

              {/* Grand Total */}
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Total</span>
                <span className={styles.totalAmount}>₹{total.toFixed(0)}</span>
              </div>

              {error && <div className={styles.error}>⚠️ {error}</div>}

              <button
                className={styles.payButton}
                onClick={handlePayment}
                disabled={isProcessing || !cart?.lines?.edges?.length}
              >
                {isProcessing ? "Processing..." : `Pay ₹${total.toFixed(0)} →`}
              </button>

              <div className={styles.secureNote}>
                🔒 Secured by Razorpay
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
