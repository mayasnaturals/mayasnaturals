"use client";

import { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import UsersTable from "../components/UsersTable";
import OrdersTable from "../components/OrdersTable";
import CouponsTable from "../components/CouponsTable";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("orders");

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden font-sans">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 flex flex-col relative h-full overflow-hidden">
        {/* Background gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-[-200px] w-[500px] h-[500px] bg-rose-100/30 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="flex-1 overflow-y-auto p-8 z-10">
          <header className="mb-8 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 capitalize tracking-tight">
                {activeTab} Overview
              </h1>
              <p className="text-gray-500 mt-1">Manage your store {activeTab} data efficiently.</p>
            </div>
          </header>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm min-h-[500px]">
            {activeTab === "users" && <UsersTable />}
            {activeTab === "orders" && <OrdersTable />}
            {activeTab === "coupons" && <CouponsTable />}
          </div>
        </div>
      </main>
    </div>
  );
}

