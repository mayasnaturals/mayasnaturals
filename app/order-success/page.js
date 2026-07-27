"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import styles from "./orderSuccess.module.css";

export default function OrderSuccessPage() {
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const invoiceRef = useRef(null);
  const router = useRouter();
  const confettiFired = useRef(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("invoiceData");
    if (stored) {
      setOrderData(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  // Fire confetti once when data loads
  useEffect(() => {
    if (orderData && !confettiFired.current) {
      confettiFired.current = true;
      // Multiple bursts for a grand celebration
      const duration = 2000;
      const end = Date.now() + duration;
      const colors = ["#82b94b", "#ffc833", "#f25c2a", "#fff8eb", "#E30613"];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      })();
    }
  }, [orderData]);

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;
    const html2canvas = (await import("html2canvas")).default;
    const jsPDF = (await import("jspdf")).default;

    const canvas = await html2canvas(invoiceRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`MayasNaturals_Order_${orderData.orderNumber || "Invoice"}.pdf`);
  };

  const handleDownloadImage = async () => {
    if (!invoiceRef.current) return;
    const html2canvas = (await import("html2canvas")).default;

    const canvas = await html2canvas(invoiceRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const link = document.createElement("a");
    link.download = `MayasNaturals_Order_${orderData.orderNumber || "Invoice"}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner} />
          <div className={styles.loadingText}>Loading your order...</div>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className={styles.page}>
        <div className={styles.emptyState}>
          <div className={styles.emptyTitle}>No order found</div>
          <p className={styles.emptyText}>
            This page is only available right after placing an order.
          </p>
          <Link href="/" className={styles.homeBtn}>
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const orderDate = new Date(orderData.date);
  const formattedDate = orderDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const formattedTime = orderDate.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={styles.page}>
      {/* Success Header */}
      <div className={styles.successHero}>
        <div className={styles.successIcon}>✅</div>
        <h1 className={styles.successTitle}>
          Order <span>Confirmed!</span>
        </h1>
        <p className={styles.successSubtitle}>
          Thank you for ordering from <strong>Maya&apos;s Naturals</strong>!
          <br />A confirmation has been sent to <strong>{orderData.customer.email}</strong>
        </p>
      </div>

      {/* Action Buttons */}
      <div className={styles.actionBar}>
        <button onClick={handleDownloadPDF} className={styles.downloadBtn}>
          📄 Download PDF
        </button>
        <button onClick={handleDownloadImage} className={styles.downloadBtn}>
          🖼️ Download Image
        </button>
        <Link href="/" className={styles.homeBtn}>
          ← Continue Shopping
        </Link>
      </div>

      {/* Invoice Card */}
      <div ref={invoiceRef} className={styles.invoiceCard}>
        {/* Invoice Header */}
        <div className={styles.invoiceHeader}>
          <div>
            <div className={styles.invoiceBrand}>Maya&apos;s Naturals</div>
            <div className={styles.invoiceBrandSub}>Order Invoice</div>
          </div>
          <div className={styles.invoiceMeta}>
            <div className={styles.invoiceOrderNum}>
              #{orderData.orderNumber || "—"}
            </div>
            <div className={styles.invoiceDate}>
              {formattedDate} at {formattedTime}
            </div>
            <div className={styles.invoicePaymentId}>
              Payment: {orderData.razorpayPaymentId}
            </div>
          </div>
        </div>

        {/* Invoice Body */}
        <div className={styles.invoiceBody}>
          {/* Customer Details */}
          <div className={styles.customerSection}>
            <div className={styles.customerBlock}>
              <div className={styles.customerBlockLabel}>Billed To</div>
              <div className={styles.customerBlockValue}>{orderData.customer.name}</div>
              <div className={styles.customerBlockValueSmall}>{orderData.customer.email}</div>
              <div className={styles.customerBlockValueSmall}>{orderData.customer.phone}</div>
            </div>
            <div className={styles.customerBlock}>
              <div className={styles.customerBlockLabel}>Ship To</div>
              <div className={styles.customerBlockValue}>{orderData.customer.address}</div>
            </div>
          </div>

          {/* Items Table */}
          <div className={styles.itemsHeader}>
            <span>Product</span>
            <span style={{ textAlign: "center" }}>Qty</span>
            <span style={{ textAlign: "right" }}>Price</span>
            <span style={{ textAlign: "right" }}>Total</span>
          </div>

          {orderData.items.map((item, index) => (
            <div key={index} className={styles.itemRow}>
              <div>
                <div className={styles.itemName}>{item.title}</div>
                {item.variant && item.variant !== "Default Title" && (
                  <div className={styles.itemVariant}>{item.variant}</div>
                )}
              </div>
              <div className={styles.itemQty}>{item.quantity}</div>
              <div className={styles.itemPrice}>₹{item.unitPrice.toFixed(2)}</div>
              <div className={styles.itemTotal}>₹{item.lineTotal.toFixed(2)}</div>
            </div>
          ))}

          {/* Summary */}
          <div className={styles.summarySection}>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Subtotal</span>
              <span>₹{orderData.subtotal.toFixed(2)}</span>
            </div>

            {orderData.discountAmount > 0 && (
              <div className={`${styles.summaryRow} ${styles.discountRow}`}>
                <span className={styles.summaryLabel}>
                  Discount ({orderData.discountCodes.join(", ")})
                  {orderData.discountPercentage > 0 && ` — ${orderData.discountPercentage}% OFF`}
                </span>
                <span>-₹{orderData.discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Shipping</span>
              <span>{orderData.shipping === 0 ? "Free" : `₹${orderData.shipping.toFixed(2)}`}</span>
            </div>

            <div className={styles.totalDivider} />

            <div className={styles.grandTotal}>
              <span>Grand Total</span>
              <span>₹{orderData.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Savings */}
          {orderData.discountAmount > 0 && (
            <div className={styles.savingsBanner}>
              <span>🎉 You saved on this order</span>
              <span>₹{orderData.discountAmount.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Invoice Footer */}
        <div className={styles.invoiceFooter}>
          Thank you for choosing <strong>Maya&apos;s Naturals</strong> — wholesome snacking, delivered with love 💛
        </div>
      </div>
    </div>
  );
}
