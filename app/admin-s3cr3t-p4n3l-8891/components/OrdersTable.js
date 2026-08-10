"use client";
import { useEffect, useState } from "react";
import { Loader2, ChevronDown, ChevronUp, ExternalLink, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function OrdersTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then(res => res.json())
      .then(data => {
        if (data.success) setOrders(data.orders);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;

  return (
    <div className="w-full">
      <div className="grid grid-cols-6 gap-4 p-4 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/50 rounded-t-2xl">
        <div className="col-span-2">Order Info</div>
        <div>Customer</div>
        <div>Date</div>
        <div>Total</div>
        <div className="text-right">Action</div>
      </div>
      
      <div className="divide-y divide-gray-100">
        {orders.map((order) => (
          <div key={order._id} className="group">
            <div 
              className="grid grid-cols-6 gap-4 p-4 items-center hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
            >
              <div className="col-span-2">
                <div className="font-medium text-gray-900 flex items-center gap-2">
                  #{order.orderDetails?.shopifyOrderNumber || order._id.slice(-6)}
                  {order.isTestOrder && <span className="text-[10px] bg-amber-50 text-amber-600 border border-amber-200 px-1.5 py-0.5 rounded uppercase font-bold">TEST</span>}
                </div>
                <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${order.status === 'Success' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  {order.status}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-700">{order.customerData?.firstName}</div>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()}
              </div>
              <div className="text-sm font-medium text-indigo-600">
                ₹{order.orderDetails?.total?.toLocaleString()}
              </div>
              <div className="text-right text-gray-400 group-hover:text-gray-600 transition-colors flex justify-end">
                {expandedOrder === order._id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </div>

            <AnimatePresence>
              {expandedOrder === order._id && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-gray-50/80"
                >
                  <div className="p-6 border-l-2 border-rose-500 m-4 bg-white rounded-r-xl shadow-sm border border-gray-100 border-l-rose-500 grid grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-sm font-semibold text-rose-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Package className="w-4 h-4" /> Items Ordered
                      </h3>
                      <div className="space-y-3">
                        {order.orderDetails?.items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg border border-gray-100">
                            <div className="flex items-center gap-3">
                              {item.imageUrl ? (
                                <img src={item.imageUrl} alt={item.title} className="w-10 h-10 object-cover rounded-md border border-gray-200" />
                              ) : (
                                <div className="w-10 h-10 bg-gray-200 rounded-md border border-gray-300 flex justify-center items-center text-xs text-gray-500">Img</div>
                              )}
                              <div>
                                <div className="text-sm text-gray-900 font-medium line-clamp-1">{item.title}</div>
                                <div className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.unitPrice}</div>
                              </div>
                            </div>
                            <div className="text-sm font-medium text-gray-700 pr-2">₹{item.lineTotal}</div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-200 space-y-1 text-sm">
                        <div className="flex justify-between text-gray-500"><span>Subtotal:</span> <span>₹{order.orderDetails?.subtotal}</span></div>
                        <div className="flex justify-between text-gray-500"><span>Shipping:</span> <span>₹{order.orderDetails?.shipping}</span></div>
                        <div className="flex justify-between text-emerald-600 font-medium"><span>Discount:</span> <span>-₹{order.orderDetails?.discountAmount}</span></div>
                        <div className="flex justify-between font-bold text-gray-900 pt-2"><span>Total:</span> <span>₹{order.orderDetails?.total}</span></div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-semibold text-rose-600 uppercase tracking-wider mb-4">Payment & Shipping</h3>
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Razorpay ID</div>
                          <div className="text-sm font-mono text-gray-700">{order.razorpayDetails?.paymentId || "N/A"}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Shipping Address</div>
                          <div className="text-sm text-gray-700 leading-relaxed">
                            {order.customerData?.firstName} {order.customerData?.lastName}<br/>
                            {order.shippingDetails?.address}<br/>
                            {order.shippingDetails?.city}, {order.shippingDetails?.state} - {order.shippingDetails?.pincode}<br/>
                            Phone: {order.customerData?.phone}
                          </div>
                        </div>
                        {order.couponsUsed && order.couponsUsed.length > 0 && (
                          <div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Applied Coupons</div>
                            <div className="flex gap-2">
                              {order.couponsUsed.map(c => (
                                <span key={c} className="px-2 py-1 bg-rose-50 text-rose-600 text-xs rounded border border-rose-100 font-medium">
                                  {c}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="p-8 text-center text-gray-500">No orders found.</div>
        )}
      </div>
    </div>
  );
}

