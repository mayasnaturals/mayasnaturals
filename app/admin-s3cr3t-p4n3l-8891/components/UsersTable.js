"use client";
import { useEffect, useState } from "react";
import { Loader2, ChevronDown, ChevronUp, Mail, Phone, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedUser, setExpandedUser] = useState(null);

  useEffect(() => {
    fetch("/api/admin/users")
      .then(res => res.json())
      .then(data => {
        if (data.success) setUsers(data.users);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;

  return (
    <div className="w-full">
      <div className="grid grid-cols-5 gap-4 p-4 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/50 rounded-t-2xl">
        <div className="col-span-2">Customer</div>
        <div>Orders</div>
        <div>Total Spent</div>
        <div className="text-right">Action</div>
      </div>
      
      <div className="divide-y divide-gray-100">
        {users.map((user) => (
          <div key={user.email} className="group">
            <div 
              className="grid grid-cols-5 gap-4 p-4 items-center hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => setExpandedUser(expandedUser === user.email ? null : user.email)}
            >
              <div className="col-span-2">
                <div className="font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                <div className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                  <Mail className="w-3 h-3" /> {user.email}
                </div>
              </div>
              <div className="text-gray-700">
                <span className="inline-flex items-center justify-center bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-lg text-sm font-medium">
                  {user.totalOrders}
                </span>
              </div>
              <div className="text-gray-900 font-medium">₹{user.totalSpent?.toLocaleString()}</div>
              <div className="text-right text-gray-400 group-hover:text-gray-600 transition-colors flex justify-end">
                {expandedUser === user.email ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </div>

            <AnimatePresence>
              {expandedUser === user.email && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-gray-50/80"
                >
                  <div className="p-6 border-l-2 border-indigo-500 m-4 bg-white rounded-r-xl shadow-sm border border-gray-100 border-l-indigo-500">
                    <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-4">Customer Details</h3>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 text-sm">
                          <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                          <span className="text-gray-700">{user.phone}</span>
                        </div>
                        {user.latestAddress && (
                          <div className="flex items-start gap-3 text-sm">
                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                            <span className="text-gray-700">
                              {user.latestAddress.address}, {user.latestAddress.city}, <br />
                              {user.latestAddress.state} - {user.latestAddress.pincode}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm text-gray-500 mb-2 font-medium">Lifetime Coupons Used</h4>
                        {user.couponsUsed && user.couponsUsed.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {user.couponsUsed.map(c => (
                              <span key={c} className="px-2 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs rounded-md font-medium uppercase">
                                {c}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500 italic">No coupons used</span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
        {users.length === 0 && (
          <div className="p-8 text-center text-gray-500">No users found.</div>
        )}
      </div>
    </div>
  );
}

