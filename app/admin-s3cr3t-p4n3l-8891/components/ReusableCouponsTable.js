"use client";

import { useState, useEffect } from "react";
import { Trash2, Plus, AlertTriangle } from "lucide-react";

export default function ReusableCouponsTable() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCode, setNewCode] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await fetch("/api/admin/reusable-coupons");
      const data = await res.json();
      if (data.success) {
        setCoupons(data.coupons);
      }
    } catch (err) {
      console.error("Failed to fetch reusable coupons:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    setAdding(true);
    setError("");
    try {
      const res = await fetch("/api/admin/reusable-coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: newCode }),
      });
      const data = await res.json();
      
      if (data.success) {
        setCoupons([data.coupon, ...coupons]);
        setNewCode("");
      } else {
        setError(data.error || "Failed to add coupon");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to remove this reusable coupon?")) return;
    
    try {
      const res = await fetch(`/api/admin/reusable-coupons?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setCoupons(coupons.filter(c => c._id !== id));
      } else {
        alert(data.error || "Failed to delete");
      }
    } catch (err) {
      alert("An error occurred");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading reusable coupons...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="text-yellow-800 font-semibold">Important: Reusable Coupons ONLY</h3>
          <p className="text-yellow-700 text-sm mt-1">
            This section is <b>strictly</b> for adding coupons that bypass the "Limit to one use per customer" rule. 
            Any coupon code added here can be used multiple times by the same customer account.
            If a coupon is meant to be used only once, do not add it here.
          </p>
        </div>
      </div>

      <form onSubmit={handleAdd} className="mb-8 flex gap-3">
        <input
          type="text"
          value={newCode}
          onChange={(e) => setNewCode(e.target.value.toUpperCase())}
          placeholder="ENTER COUPON CODE"
          className="flex-1 max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 uppercase"
        />
        <button
          type="submit"
          disabled={adding || !newCode.trim()}
          className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {adding ? "Adding..." : "Add Reusable Coupon"}
        </button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 px-4 text-sm font-semibold text-gray-600">Coupon Code</th>
              <th className="py-3 px-4 text-sm font-semibold text-gray-600">Added On</th>
              <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 ? (
              <tr>
                <td colSpan="3" className="py-8 text-center text-gray-500">
                  No reusable coupons found.
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => (
                <tr key={coupon._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 font-mono text-sm rounded border border-gray-200">
                      {coupon.code}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(coupon.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDelete(coupon._id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove from reusable list"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
