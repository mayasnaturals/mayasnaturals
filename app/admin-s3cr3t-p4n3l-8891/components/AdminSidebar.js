"use client";
import { Users, ShoppingCart, Tag, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AdminSidebar({ activeTab, setActiveTab }) {
  const router = useRouter();

  const navItems = [
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "users", label: "Users", icon: Users },
    { id: "coupons", label: "Coupons", icon: Tag },
  ];

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin-s3cr3t-p4n3l-8891");
  };

  return (
    <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-200 flex flex-col z-20 md:h-full relative shadow-sm shrink-0">
      <div className="p-4 md:p-6 border-b border-gray-100 flex justify-between items-center md:block">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-sm text-white">M</div>
          <span className="hidden sm:inline">Admin Panel</span>
        </h2>
        
        <button 
          onClick={handleLogout}
          className="md:hidden flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all font-medium text-sm"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>

      <nav className="p-2 md:p-4 flex flex-row md:flex-col overflow-x-auto space-x-2 md:space-x-0 md:space-y-2 custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-shrink-0 flex items-center gap-2 md:gap-3 px-4 py-2.5 md:py-3 rounded-xl transition-all relative overflow-hidden group ${
                isActive ? "text-indigo-700 bg-indigo-50" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-indigo-100/50 border border-indigo-200/50 rounded-xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className={`w-4 h-4 md:w-5 md:h-5 relative z-10 ${isActive ? "text-indigo-600" : ""}`} />
              <span className="font-medium text-sm md:text-base relative z-10">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="hidden md:block p-4 border-t border-gray-100 mt-auto">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all font-medium"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

