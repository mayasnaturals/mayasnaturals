"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import styles from "./checkout.module.css";

export default function CheckoutPage() {
  const { cart, isLoading: cartLoading } = useCart();
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!cart?.id) {
      setError("Your cart is empty.");
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
              // Redirect to success page or home
              window.location.href = "/";
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
          color: "#000000",
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

  if (cartLoading) return <div className={styles.container}>Loading cart...</div>;

  const subtotal = cart?.cost?.subtotalAmount?.amount ? parseFloat(cart.cost.subtotalAmount.amount) : 0;
  const shipping = subtotal > 0 && subtotal < 500 ? 49 : 0;
  const total = subtotal + shipping;
  const totalQuantity = cart?.lines?.edges?.reduce((acc, edge) => acc + edge.node.quantity, 0) || 0;
  const totalSavings = totalQuantity * 100;

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className={styles.container}>
        <div>
          <div className={styles.section}>
            <h2 className={styles.title}>Contact Information</h2>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input type="email" name="email" required className={styles.input} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Phone</label>
              <input type="tel" name="phone" required className={styles.input} onChange={handleChange} />
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.title}>Shipping Address</h2>
            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label className={styles.label}>First Name</label>
                <input type="text" name="firstName" required className={styles.input} onChange={handleChange} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Last Name</label>
                <input type="text" name="lastName" required className={styles.input} onChange={handleChange} />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Address</label>
              <input type="text" name="address" required className={styles.input} onChange={handleChange} />
            </div>
            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label className={styles.label}>City</label>
                <input type="text" name="city" required className={styles.input} onChange={handleChange} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>State</label>
                <input type="text" name="state" required className={styles.input} onChange={handleChange} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>PIN Code</label>
                <input type="text" name="pincode" required className={styles.input} onChange={handleChange} />
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className={styles.section}>
            <h2 className={styles.title}>Order Summary</h2>
            {cart?.lines?.edges?.map((edge) => {
              const item = edge.node;
              return (
                <div key={item.id} className={styles.summaryItem}>
                  <Image
                    src={item.merchandise.product.images?.edges[0]?.node?.url || "/products/Default Museli.png"}
                    alt={item.merchandise.product.title}
                    width={60}
                    height={60}
                    className={styles.summaryImage}
                  />
                  <div className={styles.summaryDetails}>
                    <div className={styles.summaryTitle}>{item.merchandise.product.title}</div>
                    <div className={styles.summaryQuantity}>Qty: {item.quantity}</div>
                    <div className={styles.discountBadge}>🔥 You save ₹{100 * item.quantity}</div>
                  </div>
                  <div className={styles.priceContainer}>
                    <span className={styles.originalPrice}>
                      ₹{(parseFloat(item.cost.totalAmount.amount) + 100 * item.quantity).toFixed(2)}
                    </span>
                    <span className={styles.discountedPrice}>
                      ₹{parseFloat(item.cost.totalAmount.amount).toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}

            <div className={styles.divider} />
            
            <div className={styles.summaryItem}>
              <span>Subtotal</span>
              <div className={styles.priceContainer}>
                <span className={styles.originalPrice}>
                  ₹{(subtotal + (cart?.lines?.edges?.reduce((acc, edge) => acc + edge.node.quantity, 0) || 0) * 100).toFixed(2)}
                </span>
                <span className={styles.discountedPrice}>₹{subtotal.toFixed(2)}</span>
              </div>
            </div>
            <div className={styles.summaryItem}>
              <span>Shipping {subtotal >= 500 && "(Free above ₹500)"}</span>
              <span>{shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span>
            </div>
            
            <div className={styles.divider} />
            
            <div className={styles.summaryItem} style={{ marginBottom: '10px' }}>
              <span style={{ color: '#2b8a3e', fontWeight: '600' }}>Total Savings</span>
              <span style={{ color: '#2b8a3e', fontWeight: '600' }}>-₹{totalSavings.toFixed(2)}</span>
            </div>
            
            <div className={styles.totalRow}>
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <button 
              className={styles.payButton} 
              onClick={handlePayment}
              disabled={isProcessing || !cart?.lines?.edges?.length}
            >
              {isProcessing ? "Processing..." : `Pay ₹${total.toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
