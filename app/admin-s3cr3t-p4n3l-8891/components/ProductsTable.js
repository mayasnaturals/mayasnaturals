"use client";
import { useEffect, useState } from "react";
import { Loader2, Package, Tag, Archive, Edit, Trash2, Plus, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProductForm from "./ProductForm";

export default function ProductsTable() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Table State
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isArchivedTab, setIsArchivedTab] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const fetchProducts = () => {
    setLoading(true);
    fetch(`/api/admin/products?archived=${isArchivedTab}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProducts(data.products);
          setSelectedProducts([]); 
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, [isArchivedTab]);

  // Derived Stats
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'active').length;
  const draftProducts = products.filter(p => p.status === 'draft').length;

  // Actions
  const toggleProduct = (id, e) => {
    e.stopPropagation();
    setSelectedProducts(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    const paginatedProductIds = paginatedProducts.map(p => p._id);
    const allSelected = paginatedProductIds.every(id => selectedProducts.includes(id));
    
    if (allSelected && paginatedProductIds.length > 0) {
      setSelectedProducts(prev => prev.filter(id => !paginatedProductIds.includes(id)));
    } else {
      const newSelections = paginatedProductIds.filter(id => !selectedProducts.includes(id));
      setSelectedProducts(prev => [...prev, ...newSelections]);
    }
  };

  const handleBulkArchive = async () => {
    if (selectedProducts.length === 0) return;
    setIsActionLoading(true);
    try {
      const res = await fetch("/api/admin/products/archive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productIds: selectedProducts, isArchived: !isArchivedTab })
      });
      if (res.ok) {
        fetchProducts();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to permanently delete this product?")) return;
    
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchProducts();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product, e) => {
    e.stopPropagation();
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(products.length / pageSize));
  
  useEffect(() => {
    setCurrentPage(1);
  }, [isArchivedTab]);

  const paginatedProducts = products.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (loading && products.length === 0) return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;

  return (
    <div className="w-full flex flex-col p-4 md:p-6 gap-6 relative">
      
      {/* Top Stats Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Products", value: totalProducts, color: "from-indigo-500 to-blue-500", icon: <Package className="w-6 h-6" /> },
          { label: "Active", value: activeProducts, color: "from-emerald-500 to-teal-500", icon: <Tag className="w-6 h-6" /> },
          { label: "Drafts", value: draftProducts, color: "from-amber-500 to-orange-500", icon: <Archive className="w-6 h-6" /> }
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
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <div className="flex bg-gray-100 p-1 rounded-xl w-full sm:w-auto justify-center">
            <button 
              onClick={() => setIsArchivedTab(false)} 
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${!isArchivedTab ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Active Products
            </button>
            <button 
              onClick={() => setIsArchivedTab(true)} 
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${isArchivedTab ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Archived
            </button>
          </div>
          <button 
            onClick={() => {
              setIsActionLoading(true);
              fetch(`/api/admin/products?archived=${isArchivedTab}`, { cache: 'no-store' })
                .then(res => res.json())
                .then(data => {
                  if (data.success) {
                    setProducts(data.products);
                    setSelectedProducts([]); 
                  }
                  setIsActionLoading(false);
                })
                .catch(() => setIsActionLoading(false));
            }}
            disabled={isActionLoading || loading}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={isActionLoading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
        
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
        >
          <Plus size={18} />
          Add Product
        </button>
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
            <div className="grid grid-cols-[auto_2fr_1fr_1fr_1fr_auto] gap-4 p-4 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/50">
              <div className="flex items-center justify-center pl-2">
                <input 
                  type="checkbox" 
                  checked={paginatedProducts.length > 0 && paginatedProducts.every(p => selectedProducts.includes(p._id))} 
                  onChange={toggleAll} 
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </div>
              <div>Product Details</div>
              <div>Variants</div>
              <div>Status</div>
              <div>Created</div>
              <div className="text-right pr-4">Actions</div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {paginatedProducts.map((product) => (
                <div 
                  key={product._id}
                  className={`grid grid-cols-[auto_2fr_1fr_1fr_1fr_auto] gap-4 p-4 items-center hover:bg-gray-50 transition-colors ${selectedProducts.includes(product._id) ? 'bg-indigo-50/30' : ''}`}
                >
                  <div className="flex items-center justify-center pl-2">
                    <input 
                      type="checkbox" 
                      checked={selectedProducts.includes(product._id)} 
                      onChange={(e) => toggleProduct(product._id, e)}
                      className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    {product.images && product.images.length > 0 ? (
                      <img src={product.images[0]} alt={product.title} className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400">
                        <Package size={20} />
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-gray-900">{product.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5 line-clamp-1" dangerouslySetInnerHTML={{__html: product.description.substring(0, 50) + '...'}} />
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {product.variants?.length || 0} variant(s)
                  </div>
                  <div>
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                      product.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 
                      product.status === 'draft' ? 'bg-amber-100 text-amber-700' : 
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex justify-end gap-2 pr-4">
                    <button 
                      onClick={(e) => openEditModal(product, e)}
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit Product"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={(e) => handleDelete(product._id, e)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Permanently Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
              {!loading && products.length === 0 && (
                <div className="p-12 flex flex-col items-center justify-center text-gray-500">
                  <Archive className="w-12 h-12 text-gray-300 mb-4" />
                  <p className="text-lg font-medium">No products found.</p>
                  <p className="text-sm mt-1">Try adjusting your filters or add a new product.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pagination Controls */}
        {!loading && products.length > 0 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50/50">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium text-gray-900">{(currentPage - 1) * pageSize + 1}</span> to <span className="font-medium text-gray-900">{Math.min(currentPage * pageSize, products.length)}</span> of <span className="font-medium text-gray-900">{products.length}</span> results
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
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (currentPage <= 3) pageNum = i + 1;
                  else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = currentPage - 2 + i;
                  
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
        {selectedProducts.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-gray-900/95 backdrop-blur text-white px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-6 border border-gray-700"
          >
            <span className="font-medium text-sm">{selectedProducts.length} product{selectedProducts.length > 1 ? 's' : ''} selected</span>
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

      {/* Modals */}
      <AnimatePresence>
        {isModalOpen && (
          <ProductForm 
            initialData={editingProduct} 
            onClose={() => setIsModalOpen(false)} 
            onSaved={fetchProducts} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
