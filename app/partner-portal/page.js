"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";

export default function PartnerPortal() {
  const [couponCode, setCouponCode] = useState("");
  const [debouncedCoupon, setDebouncedCoupon] = useState("");
  const [orders, setOrders] = useState([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCoupon(couponCode.trim());
    }, 500);

    return () => clearTimeout(handler);
  }, [couponCode]);

  // Fetch logic
  useEffect(() => {
    if (!debouncedCoupon) {
      setOrders([]);
      setCount(0);
      return;
    }

    const fetchOrders = async () => {
      setIsLoading(true);
      setError("");

      try {
        const res = await fetch(`/api/partner-portal?coupon=${encodeURIComponent(debouncedCoupon)}`);
        const data = await res.json();

        if (res.ok) {
          setOrders(data.orders || []);
          setCount(data.count || 0);
        } else {
          setError(data.error || "Failed to fetch data.");
        }
      } catch (err) {
        setError("Network error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [debouncedCoupon]);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-gray-100">
      <div className="max-w-4xl mx-auto px-6 py-20">
        
        {/* Header section */}
        <div className="text-center mb-16">
          <h1 className="text-3xl font-light tracking-tight text-gray-900 mb-2">Partner Portal</h1>
          <p className="text-gray-500 text-sm">Enter your coupon code to view analytics securely.</p>
        </div>

        {/* Search Input */}
        <div className="relative max-w-md mx-auto mb-16">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all shadow-sm"
            placeholder="e.g. SUMMER24"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          />
          {isLoading && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <div className="animate-spin h-4 w-4 border-2 border-gray-900 border-t-transparent rounded-full" />
            </div>
          )}
        </div>

        {/* Error state */}
        {error && (
          <div className="text-center text-red-500 mb-12 text-sm">
            {error}
          </div>
        )}

        {/* Results section */}
        {debouncedCoupon && !isLoading && !error && (
          <div className="animate-in fade-in duration-500">
            {/* Stats Header */}
            <div className="flex flex-col items-center justify-center py-8 mb-12 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-2">Total Orders</span>
              <span className="text-6xl font-light tracking-tighter text-gray-900">{count}</span>
            </div>

            {/* List */}
            {count > 0 ? (
              <div className="space-y-6">
                {orders.map((order, idx) => (
                  <div key={order._id || idx} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-gray-50 gap-4">
                      <div className="flex items-center flex-wrap gap-2">
                        <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-md uppercase tracking-wider">
                          Success
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        {order.customerData && (
                          <>
                            <span className="text-gray-300 mx-1">•</span>
                            <span className="text-sm font-medium text-gray-700">
                              {order.customerData.firstName} {order.customerData.lastName}
                            </span>
                          </>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-medium text-gray-900">₹{order.orderDetails?.total}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {order.orderDetails?.items?.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center text-xs font-medium text-gray-500">
                              {item.quantity}x
                            </div>
                            <span className="text-gray-700">{item.title}</span>
                          </div>
                          <span className="text-gray-400">₹{item.lineTotal}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-50 flex flex-wrap gap-2">
                      {order.couponsUsed?.filter(c => c.toUpperCase() === debouncedCoupon.toUpperCase()).map(c => (
                        <span key={c} className="px-2 py-1 rounded text-xs font-medium bg-gray-900 text-white">
                          {c}
                        </span>
                      ))}
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-400">
                <p>No orders found for this coupon code.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
