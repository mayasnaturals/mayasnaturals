"use client";
import { useEffect, useState } from "react";
import { Loader2, ChevronDown, ChevronUp, Ticket, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CouponsTable() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCoupon, setExpandedCoupon] = useState(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("/api/admin/coupons")
      .then(res => res.json())
      .then(data => {
        if (data.success) setCoupons(data.coupons);
        setLoading(false);
      });
  }, []);

  const filteredCoupons = coupons.filter(c => 
    c.code?.toLowerCase().includes(filter.toLowerCase()) || 
    c.title?.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;

  return (
    <div className="w-full flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl shrink-0">
        <div className="relative w-48 md:w-64">
          <input 
            type="text" 
            placeholder="Search coupons..." 
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors shadow-sm"
          />
          <Ticket className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        <div className="text-sm text-gray-500 font-medium">
          <span className="hidden sm:inline">Showing </span>{filteredCoupons.length}
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="min-w-[700px] h-full flex flex-col">
          <div className="grid grid-cols-4 gap-4 p-4 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/30">
            <div className="col-span-2">Coupon Details</div>
            <div>Status</div>
            <div className="text-right">Total Uses</div>
          </div>
          
          <div className="divide-y divide-gray-100 flex-1 overflow-y-auto">
            {filteredCoupons.map((coupon) => (
              <div key={coupon.id} className="group">
                <div 
                  className="grid grid-cols-4 gap-4 p-4 items-center hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setExpandedCoupon(expandedCoupon === coupon.id ? null : coupon.id)}
                >
                  <div className="col-span-2">
                    <div className="font-bold text-gray-900 text-lg flex items-center gap-2 tracking-wide uppercase">
                      {coupon.code}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5 truncate pr-4">
                      {coupon.summary || "No description available"}
                    </div>
                  </div>
                  <div>
                    <span className={`text-xs px-2 py-1 rounded font-medium border ${
                      coupon.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
                      'bg-gray-100 text-gray-600 border-gray-200'
                    }`}>
                      {coupon.status || 'UNKNOWN'}
                    </span>
                  </div>
                  <div className="text-right flex items-center justify-end gap-3">
                    <span className="font-bold text-emerald-600 text-lg bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-lg">
                      {coupon.usageCount}
                    </span>
                    {expandedCoupon === coupon.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </div>
                </div>

                <AnimatePresence>
                  {expandedCoupon === coupon.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-gray-50/80"
                    >
                      <div className="p-6 border-l-2 border-emerald-500 m-4 bg-white rounded-r-xl shadow-sm border border-gray-100 border-l-emerald-500">
                        <h3 className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <Users className="w-4 h-4" /> Users who redeemed this
                        </h3>
                        
                        {coupon.usedBy && coupon.usedBy.length > 0 ? (
                          <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                            <div className="grid grid-cols-3 gap-4 p-3 bg-gray-100/50 text-xs font-semibold text-gray-500 uppercase border-b border-gray-200">
                              <div>Name</div>
                              <div>Email</div>
                              <div>Date</div>
                            </div>
                            <div className="divide-y divide-gray-200 max-h-64 overflow-y-auto custom-scrollbar">
                              {coupon.usedBy.map((user, idx) => (
                                <div key={idx} className="grid grid-cols-3 gap-4 p-3 text-sm hover:bg-gray-100 transition-colors bg-white">
                                  <div className="text-gray-900 font-medium">{user.name}</div>
                                  <div className="text-gray-600 truncate pr-2">{user.email}</div>
                                  <div className="text-gray-500">{new Date(user.date).toLocaleDateString()}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 italic p-4 bg-gray-50 rounded-lg border border-gray-200">
                            This coupon hasn't been redeemed yet.
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
            {filteredCoupons.length === 0 && (
              <div className="p-8 text-center text-gray-500">No coupons matched your search.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


