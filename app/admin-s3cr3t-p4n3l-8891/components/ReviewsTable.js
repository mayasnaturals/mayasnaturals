"use client";

import { useEffect, useState } from "react";
import { Check, X, Trash2, Image as ImageIcon, Star, RefreshCw } from "lucide-react";

export default function ReviewsTable() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("pending"); // "pending" or "all"
  
  // Modal states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    
    try {
      const res = await fetch("/api/admin/reviews");
      const data = await res.json();
      if (data.reviews) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" })
      });
      if (res.ok) {
        setReviews(reviews.map(r => r._id === id ? { ...r, status: "approved" } : r));
      }
    } catch (err) {
      console.error("Approve failed", err);
    }
  };

  const handleDeleteRequest = (review) => {
    setReviewToDelete(review);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!reviewToDelete) return;
    try {
      const res = await fetch(`/api/admin/reviews/${reviewToDelete._id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setReviews(reviews.filter(r => r._id !== reviewToDelete._id));
      }
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setDeleteConfirmOpen(false);
      setReviewToDelete(null);
    }
  };

  const filteredReviews = reviews.filter(r => 
    activeTab === "pending" ? r.status === "pending" : true
  );
  
  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6 pt-4">
        <div className="flex">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "pending" 
                ? "border-indigo-600 text-indigo-600" 
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Pending Approval 
            {reviews.filter(r => r.status === "pending").length > 0 && (
              <span className="ml-2 bg-indigo-100 text-indigo-700 py-0.5 px-2 rounded-full text-xs">
                {reviews.filter(r => r.status === "pending").length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "all" 
                ? "border-indigo-600 text-indigo-600" 
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            All Reviews
          </button>
        </div>
        <button 
          onClick={() => fetchReviews(true)}
          disabled={isRefreshing || isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-semibold">Product</th>
              <th className="px-6 py-4 font-semibold">Customer</th>
              <th className="px-6 py-4 font-semibold">Rating</th>
              <th className="px-6 py-4 font-semibold w-1/3">Review</th>
              <th className="px-6 py-4 font-semibold">Images</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && !isRefreshing ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-400">Loading reviews...</td>
              </tr>
            ) : filteredReviews.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                  {activeTab === "pending" ? "No pending reviews to approve." : "No reviews found."}
                </td>
              </tr>
            ) : (
              filteredReviews.map((review) => (
                <tr key={review._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 line-clamp-2">{review.productName}</div>
                    <div className="text-xs text-gray-500 mt-1">{new Date(review.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 truncate max-w-[200px]" title={review.customerEmail}>
                    {review.customerEmail}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-amber-500">
                      <span className="font-bold mr-1">{review.rating}</span>
                      <Star size={14} className="fill-amber-500" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 mb-1">{review.title}</div>
                    <div className="text-gray-600 text-sm line-clamp-3">{review.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    {review.images && review.images.length > 0 ? (
                      <div className="flex gap-3">
                        {review.images.map((img, idx) => (
                          <div key={idx} className="flex flex-col items-center">
                            <div 
                              onClick={() => { setCurrentImage(img.url); setImageModalOpen(true); }}
                              className="w-12 h-12 rounded bg-gray-200 cursor-pointer overflow-hidden relative border border-gray-300 hover:border-indigo-500 transition-colors"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={img.url} alt="Review" className="w-full h-full object-cover" />
                            </div>
                            {img.size && (
                              <span className="text-[10px] text-gray-400 mt-1 whitespace-nowrap">
                                {formatBytes(img.size)}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">No images</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {review.status === "pending" && (
                        <button
                          onClick={() => handleApprove(review._id)}
                          className="flex items-center gap-1 bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                        >
                          <Check size={16} /> Approve
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteRequest(review)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          review.status === "pending"
                            ? "bg-red-50 text-red-700 hover:bg-red-100"
                            : "text-gray-500 hover:text-red-600 hover:bg-red-50"
                        }`}
                      >
                        {review.status === "pending" ? <X size={16} /> : <Trash2 size={16} />}
                        {review.status === "pending" ? "Reject" : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {reviewToDelete?.status === "pending" ? "Reject Review" : "Delete Review"}
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to permanently delete this review from {reviewToDelete?.customerEmail}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {imageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={() => setImageModalOpen(false)}>
          <div className="relative max-w-4xl max-h-screen">
            <button 
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
              onClick={() => setImageModalOpen(false)}
            >
              <X size={32} />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={currentImage} alt="Preview" className="max-w-full max-h-[85vh] object-contain rounded-md" />
          </div>
        </div>
      )}
    </div>
  );
}
