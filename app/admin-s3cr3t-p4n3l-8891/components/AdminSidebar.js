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
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col z-20 h-full relative shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-sm text-white">M</div>
          Admin Panel
        </h2>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative overflow-hidden group ${
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
              <Icon className={`w-5 h-5 relative z-10 ${isActive ? "text-indigo-600" : ""}`} />
              <span className="font-medium relative z-10">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
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

