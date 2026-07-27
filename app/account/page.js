"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCustomer } from "@/context/CustomerContext";
import styles from "./account.module.css";

export default function AccountPage() {
  const { customer, isLoading, refreshCustomer } = useCustomer();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    if (!isLoading && !customer) {
      router.push("/login");
    }
  }, [customer, isLoading, router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    window.location.href = "/api/auth/logout";
  };

  const handleDownloadPDF = async (orderId, orderName) => {
    try {
      setDownloadingId(orderId);
      const element = document.getElementById(`receipt-${orderId}`);
      if (!element) return;
      
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      // Temporarily hide the download button from the PDF
      const btn = element.querySelector('.receiptDownloadBtn');
      if (btn) btn.style.display = 'none';

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#fffdf8",
      });

      if (btn) btn.style.display = 'inline-flex';

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`MayasNaturals_Order_${orderName || orderId}.pdf`);
    } catch (err) {
      console.error("Failed to generate PDF", err);
    } finally {
      setDownloadingId(null);
    }
  };

  if (isLoading || !customer) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner} />
        <div className={styles.loadingText}>Loading your account...</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        
        {/* Header */}
        <div className={styles.headerCard}>
          <div>
            <h1 className={styles.userName}>
              Hi, {customer.firstName || 'There'}!
            </h1>
            <p className={styles.userEmail}>{customer.emailAddress?.emailAddress}</p>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={styles.logoutBtn}
          >
            {isLoggingOut ? "Logging out..." : "Log Out"}
          </button>
        </div>

        {/* Orders Section */}
        <div className={styles.ordersSection}>
          <h2 className={styles.ordersTitle}>
            <span className={styles.ordersTitleIcon}>📦</span>
            Your Orders
          </h2>
          
          {(!customer.orders?.edges || customer.orders.edges.length === 0) ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>🛍️</span>
              <p className={styles.emptyText}>You haven&apos;t placed any orders yet.</p>
              <Link href="/products" className={styles.shopBtn}>
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className={styles.ordersList}>
              {customer.orders.edges.map((edge) => {
                const order = edge.node;
                const orderDate = new Date(order.processedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                });

                // Safely compute values
                const grandTotal = parseFloat(order.totalPrice?.amount || 0);
                const apiSubtotal = order.subtotalPrice ? parseFloat(order.subtotalPrice.amount) : 0;
                const apiShipping = order.totalShippingPrice ? parseFloat(order.totalShippingPrice.amount) : 0;
                
                let manualSubtotal = 0;
                const lineItemsData = order.lineItems.edges.map(itemEdge => {
                  const item = itemEdge.node;
                  // Try various Shopify fields for line item total price
                  const priceObj = item.totalPrice || item.discountedTotalPrice || item.originalTotalPrice || item.price;
                  const lineTotal = parseFloat(priceObj?.amount || 0);
                  // if totalPrice is per unit, multiply by quantity (some API versions do this)
                  // Let's assume totalPrice is the actual total for the line. If it's 0 and price isn't, fallback to price * qty
                  const fallbackTotal = lineTotal === 0 && item.price ? parseFloat(item.price.amount) * item.quantity : lineTotal;
                  
                  manualSubtotal += fallbackTotal;
                  
                  return {
                    ...item,
                    calculatedLineTotal: fallbackTotal,
                    currencyCode: priceObj?.currencyCode || order.totalPrice?.currencyCode || "INR"
                  };
                });

                // Decide between API summary and manual summary
                const finalSubtotal = apiSubtotal > 0 ? apiSubtotal : manualSubtotal;
                
                // Get Discounts
                let discountTotal = 0;
                let discountCodes = [];
                if (order.discountApplications?.edges?.length > 0) {
                  order.discountApplications.edges.forEach(dEdge => {
                    if (dEdge.node.code) discountCodes.push(dEdge.node.code);
                    if (dEdge.node.value?.amount) {
                      discountTotal += parseFloat(dEdge.node.value.amount);
                    } else if (dEdge.node.value?.percentage) {
                      discountTotal += (finalSubtotal * parseFloat(dEdge.node.value.percentage) / 100);
                    }
                  });
                }
                
                // If API didn't provide shipping, we can estimate it based on difference
                let finalShipping = apiShipping;
                if (apiShipping === 0 && grandTotal > (finalSubtotal - discountTotal)) {
                   finalShipping = grandTotal - (finalSubtotal - discountTotal);
                }
                
                // Final safety fallback for discount if grand total is less than subtotal + shipping
                if (discountTotal === 0 && grandTotal < (finalSubtotal + finalShipping)) {
                  discountTotal = (finalSubtotal + finalShipping) - grandTotal;
                }

                return (
                  <div key={order.id} id={`receipt-${order.id}`} className={styles.receiptCard}>
                    {/* Receipt Header */}
                    <div className={styles.receiptHeader}>
                      <div>
                        <div className={styles.receiptBrand}>Maya&apos;s Naturals</div>
                        <div className={styles.receiptOrderNum}>{order.name}</div>
                      </div>
                      <div className={styles.receiptMeta}>
                        <div className={styles.receiptDate}>{orderDate}</div>
                        <div className={styles.statusBadges}>
                          <span className={`${styles.badge} ${order.financialStatus === "PAID" ? styles.badgePaid : styles.badgePending}`}>
                            {order.financialStatus || "PENDING"}
                          </span>
                          <span className={`${styles.badge} ${order.fulfillmentStatus === "FULFILLED" ? styles.badgeFulfilled : styles.badgeUnfulfilled}`}>
                            {order.fulfillmentStatus || "UNFULFILLED"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Receipt Body */}
                    <div className={styles.receiptBody}>
                      <div className={styles.itemsHeader}>
                        <span>Product</span>
                        <span style={{ textAlign: "center" }}>Qty</span>
                        <span style={{ textAlign: "right" }}>Total</span>
                      </div>

                      {lineItemsData.map((item, idx) => {
                        const imageUrl = item.variant?.image?.url || "/products/Default Museli.png";
                        
                        return (
                          <div key={idx} className={styles.itemRow}>
                            <div className={styles.itemInfo}>
                              <Image 
                                src={imageUrl} 
                                alt={item.title} 
                                width={48} 
                                height={48} 
                                className={styles.itemImage}
                              />
                              <div>
                                <div className={styles.itemName}>{item.title}</div>
                                {item.variant?.title && item.variant.title !== "Default Title" && (
                                  <div className={styles.itemVariant}>{item.variant.title}</div>
                                )}
                              </div>
                            </div>
                            <div className={styles.itemQty}>{item.quantity}</div>
                            <div className={styles.itemTotal}>
                              {item.currencyCode} {item.calculatedLineTotal.toFixed(2)}
                            </div>
                          </div>
                        );
                      })}

                      <div className={styles.receiptSummary}>
                        <div className={styles.summaryRow}>
                          <span>Subtotal</span>
                          <strong>{order.totalPrice?.currencyCode || "INR"} {finalSubtotal.toFixed(2)}</strong>
                        </div>
                        
                        {discountTotal > 0 && (
                          <div className={styles.summaryRow} style={{ color: "var(--green-dark)" }}>
                            <span>Discount {discountCodes.length > 0 ? `(${discountCodes.join(", ")})` : ""}</span>
                            <strong>-{order.totalPrice?.currencyCode || "INR"} {discountTotal.toFixed(2)}</strong>
                          </div>
                        )}
                        
                        {(finalShipping > 0 || (finalSubtotal > 0 && finalShipping === 0)) && (
                          <div className={styles.summaryRow}>
                            <span>Shipping</span>
                            <strong>{finalShipping === 0 ? "FREE" : `${order.totalPrice?.currencyCode || "INR"} ${finalShipping.toFixed(2)}`}</strong>
                          </div>
                        )}
                        
                        <div className={styles.grandTotal}>
                          <span>Total</span>
                          <span>{order.totalPrice?.currencyCode || "INR"} {grandTotal.toFixed(2)}</span>
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                          <button 
                            className="receiptDownloadBtn"
                            onClick={() => handleDownloadPDF(order.id, order.name)}
                            disabled={downloadingId === order.id}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '8px 16px',
                              background: 'var(--yellow)',
                              border: '2px solid var(--ink)',
                              borderRadius: '999px',
                              fontWeight: 900,
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              boxShadow: '3px 3px 0 var(--ink)'
                            }}
                          >
                            {downloadingId === order.id ? 'Generating...' : '📄 Download PDF'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
