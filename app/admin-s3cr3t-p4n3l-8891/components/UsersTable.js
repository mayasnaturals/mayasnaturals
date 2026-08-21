"use client";
import { useEffect, useState } from "react";
import { Loader2, ChevronDown, ChevronUp, Mail, Phone, MapPin, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedUser, setExpandedUser] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetch("/api/admin/users")
      .then(res => res.json())
      .then(data => {
        if (data.success) setUsers(data.users);
        setLoading(false);
      });
  }, []);

  // Filter users based on search query
  const filteredUsers = users.filter(user => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
    const email = (user.email || '').toLowerCase();
    const phone = (user.phone || '').toLowerCase();
    
    return fullName.includes(query) || email.includes(query) || phone.includes(query);
  });

  // Reset page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (loading && users.length === 0) return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;

  return (
    <div className="w-full flex flex-col p-4 md:p-6 gap-6">
      
      {/* Search Bar */}
      <div className="flex items-center bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center flex-1 px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500 transition-all">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Search by name, email, or phone number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none focus:outline-none text-sm text-gray-900 placeholder-gray-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative min-h-[400px] flex flex-col">
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex justify-center items-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        )}

        <div className="w-full overflow-x-auto flex-1">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-5 gap-4 p-4 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/50">
              <div className="col-span-2">Customer</div>
              <div>Orders</div>
              <div>Total Spent</div>
              <div className="text-right pr-4">Action</div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {paginatedUsers.map((user) => (
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
                    <div className="text-right text-gray-400 group-hover:text-gray-600 transition-colors flex justify-end pr-4">
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
              {!loading && filteredUsers.length === 0 && (
                <div className="p-12 flex flex-col items-center justify-center text-gray-500">
                  <Search className="w-12 h-12 text-gray-300 mb-4" />
                  <p className="text-lg font-medium">No users found.</p>
                  <p className="text-sm">Try adjusting your search query.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pagination Controls */}
        {!loading && filteredUsers.length > 0 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50/50 mt-auto">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium text-gray-900">{(currentPage - 1) * pageSize + 1}</span> to <span className="font-medium text-gray-900">{Math.min(currentPage * pageSize, filteredUsers.length)}</span> of <span className="font-medium text-gray-900">{filteredUsers.length}</span> results
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
    </div>
  );
}
