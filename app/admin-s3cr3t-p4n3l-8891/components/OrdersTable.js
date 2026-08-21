"use client";
import { useEffect, useState } from "react";
import { Loader2, ChevronDown, ChevronUp, Package, TrendingUp, ShoppingBag, CreditCard, Archive } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function OrdersTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  
  // New State
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [timeframe, setTimeframe] = useState("all");
  const [isArchivedTab, setIsArchivedTab] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const fetchOrders = () => {
    setLoading(true);
    fetch(`/api/admin/orders?timeframe=${timeframe}&archived=${isArchivedTab}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOrders(data.orders);
          setSelectedOrders([]); // Reset selection on data change
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, [timeframe, isArchivedTab]);

  // Derived Stats
  const totalSales = orders.reduce((acc, curr) => acc + (curr.orderDetails?.total || 0), 0);
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

  // Actions
    const toggleOrder = (id, e) => {
    e.stopPropagation();
    setSelectedOrders(prev => 
      prev.includes(id) ? prev.filter(o => o !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    const paginatedOrderIds = paginatedOrders.map(o => o._id);
    const allSelected = paginatedOrderIds.every(id => selectedOrders.includes(id));
    
    if (allSelected && paginatedOrderIds.length > 0) {
      setSelectedOrders(prev => prev.filter(id => !paginatedOrderIds.includes(id)));
    } else {
      const newSelections = paginatedOrderIds.filter(id => !selectedOrders.includes(id));
      setSelectedOrders(prev => [...prev, ...newSelections]);
    }
  };

  const handleBulkArchive = async () => {
    if (selectedOrders.length === 0) return;
    setIsActionLoading(true);
    try {
      const res = await fetch("/api/admin/orders/archive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderIds: selectedOrders, isArchived: !isArchivedTab })
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsActionLoading(false);
    }
  };

  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(orders.length / pageSize));
  
  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [timeframe, isArchivedTab]);

  const paginatedOrders = orders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (loading && orders.length === 0) return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;

  return (
    <div className="w-full flex flex-col p-4 md:p-6 gap-6">
      
      {/* Top Stats Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Sales", value: `₹${totalSales.toLocaleString()}`, color: "from-indigo-500 to-blue-500", icon: <TrendingUp className="w-6 h-6" /> },
          { label: "Orders", value: totalOrders.toLocaleString(), color: "from-emerald-500 to-teal-500", icon: <ShoppingBag className="w-6 h-6" /> },
          { label: "Avg Order Value", value: `₹${averageOrderValue.toLocaleString()}`, color: "from-amber-500 to-orange-500", icon: <CreditCard className="w-6 h-6" /> }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow"
          >
            <div className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br ${stat.color} opacity-[0.08] rounded-full blur-3xl group-hover:opacity-[0.15] transition-opacity`} />
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-gray-50 rounded-xl text-gray-700">
                {stat.icon}
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.label}</h3>
            <div className="text-3xl font-bold text-gray-900 tracking-tight">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm gap-4">
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button 
            onClick={() => setIsArchivedTab(false)} 
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${!isArchivedTab ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Active Orders
          </button>
          <button 
            onClick={() => setIsArchivedTab(true)} 
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${isArchivedTab ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Archived
          </button>
        </div>
        
        <select 
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="bg-gray-50 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer"
        >
          <option value="all">All Time</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
        </select>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative min-h-[400px] flex flex-col">
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex justify-center items-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        )}
        
        <div className="w-full overflow-x-auto flex-1">
          <div className="min-w-[1000px]">
            <div className="grid grid-cols-[auto_2fr_1.5fr_1fr_1fr_auto] gap-4 p-4 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/50">
              <div className="flex items-center justify-center pl-2">
                <input 
                  type="checkbox" 
                  checked={paginatedOrders.length > 0 && paginatedOrders.every(o => selectedOrders.includes(o._id))} 
                  onChange={toggleAll} 
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </div>
              <div>Order Info</div>
              <div>Customer</div>
              <div>Date</div>
              <div>Total</div>
              <div className="text-right pr-4">Action</div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {paginatedOrders.map((order) => (
                <div key={order._id} className="group">
                  <div 
                    className={`grid grid-cols-[auto_2fr_1.5fr_1fr_1fr_auto] gap-4 p-4 items-center hover:bg-gray-50 cursor-pointer transition-colors ${selectedOrders.includes(order._id) ? 'bg-indigo-50/30' : ''}`}
                    onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                  >
                    <div className="flex items-center justify-center pl-2">
                      <input 
                        type="checkbox" 
                        checked={selectedOrders.includes(order._id)} 
                        onChange={(e) => toggleOrder(order._id, e)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </div>
                    <div>
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
                      <div className="text-sm text-gray-700 font-medium">{order.customerData?.firstName} {order.customerData?.lastName}</div>
                      <div className="text-xs text-gray-500">{order.customerData?.email}</div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-sm font-medium text-indigo-600">
                      ₹{order.orderDetails?.total?.toLocaleString()}
                    </div>
                    <div className="text-right text-gray-400 group-hover:text-gray-600 transition-colors flex justify-end pr-4">
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
                        <div className="p-6 border-l-2 border-indigo-500 m-4 bg-white rounded-r-xl shadow-sm border border-gray-100 border-l-indigo-500 grid grid-cols-2 gap-8">
                          <div>
                            <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-4 flex items-center gap-2">
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
                            <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-4">Payment & Shipping</h3>
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
                                      <span key={c} className="px-2 py-1 bg-indigo-50 text-indigo-600 text-xs rounded border border-indigo-100 font-medium">
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
              {!loading && orders.length === 0 && (
                <div className="p-12 flex flex-col items-center justify-center text-gray-500">
                  <Archive className="w-12 h-12 text-gray-300 mb-4" />
                  <p className="text-lg font-medium">No orders found.</p>
                  <p className="text-sm">Try adjusting your timeframe or filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pagination Controls */}
        {!loading && orders.length > 0 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50/50">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium text-gray-900">{(currentPage - 1) * pageSize + 1}</span> to <span className="font-medium text-gray-900">{Math.min(currentPage * pageSize, orders.length)}</span> of <span className="font-medium text-gray-900">{orders.length}</span> results
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Logic to show pages around current page
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 flex justify-center items-center rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Bar */}
      <AnimatePresence>
        {selectedOrders.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-gray-900/95 backdrop-blur text-white px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-6 border border-gray-700"
          >
            <span className="font-medium text-sm">{selectedOrders.length} order{selectedOrders.length > 1 ? 's' : ''} selected</span>
            <div className="h-5 w-px bg-gray-700" />
            <button 
              onClick={handleBulkArchive}
              disabled={isActionLoading}
              className="flex items-center gap-2 text-sm font-medium hover:text-indigo-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Archive className="w-4 h-4" />}
              {isArchivedTab ? "Unarchive Selected" : "Archive Selected"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
