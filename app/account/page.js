"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCustomer } from "@/context/CustomerContext";
import { logout } from "@/app/actions/auth";
import styles from "./account.module.css";

export default function AccountPage() {
  const { customer, isLoading, refreshCustomer } = useCustomer();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!isLoading && !customer) {
      router.push("/login");
    }
  }, [customer, isLoading, router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    await refreshCustomer();
    router.push("/");
  };

  if (isLoading || !customer) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}>🍩</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        
        {/* Header */}
        <div className={styles.headerCard}>
          <div>
            <h1 className={styles.userName}>
              Hi, {customer.firstName || 'There'}!
            </h1>
            <p className={styles.userEmail}>{customer.email}</p>
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
        <div className={styles.ordersCard}>
          <h2 className={styles.ordersTitle}>Recent Orders</h2>
          
          {(!customer.orders?.edges || customer.orders.edges.length === 0) ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>📦</span>
              <p className={styles.emptyText}>You haven't placed any orders yet.</p>
              <button 
                onClick={() => router.push("/products")}
                className={styles.shopBtn}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className={styles.ordersList}>
              {customer.orders.edges.map((edge) => {
                const order = edge.node;
                return (
                  <div key={order.id} className={styles.orderRow}>
                    <div className={styles.orderMeta}>
                      <p className={styles.orderId}>Order #{order.orderNumber}</p>
                      <p className={styles.orderDate}>
                        {new Date(order.processedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={styles.orderItems}>
                      {order.lineItems.edges.map(e => `${e.node.quantity}x ${e.node.title}`).join(', ')}
                    </div>
                    <div className={styles.orderTotal}>
                      {order.totalPrice.currencyCode} {order.totalPrice.amount}
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

