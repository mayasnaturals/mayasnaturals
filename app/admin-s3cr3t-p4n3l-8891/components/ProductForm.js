'use client';
import { useState, useEffect } from 'react';
import TipTapEditor from './TipTapEditor';
import ImageUploader from './ImageUploader';
import { Plus, Trash2, Save, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductForm({ initialData, onClose, onSaved }) {
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    status: initialData?.status || 'active',
  });
  
  const [images, setImages] = useState(initialData?.images || []);
  
  const [variants, setVariants] = useState(
    initialData?.variants?.length > 0 
      ? initialData.variants 
      : [{ size: '', price: '', stock: '' }]
  );

  const isEditing = !!initialData?._id;

  const handleAddVariant = () => {
    setVariants([...variants, { size: '', price: '', stock: '' }]);
  };

  const handleRemoveVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = {
      ...formData,
      images,
      variants: variants.map(v => ({
        ...v,
        price: Number(v.price),
        stock: Number(v.stock || 0)
      }))
    };

    try {
      const url = isEditing ? `/api/admin/products/${initialData._id}` : '/api/admin/products';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isEditing ? 'update' : 'save'} product`);
      }

      if (onSaved) onSaved();
      if (onClose) onClose();

    } catch (error) {
      console.error(error);
      alert(`Error ${isEditing ? 'updating' : 'saving'} product: ` + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#fafafa] w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden my-auto relative"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-white rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors shadow-sm z-10"
        >
          <X size={24} />
        </button>

        <div className="h-[85vh] overflow-y-auto custom-scrollbar p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                  {isEditing ? 'Edit Product' : 'Add New Product'}
                </h1>
                <p className="text-gray-500 mt-1">
                  {isEditing ? 'Update the details for this product' : 'Create a new product in your custom backend'}
                </p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-md active:scale-95 disabled:opacity-70"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {isEditing ? 'Update Product' : 'Save Product'}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Basic Info */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                  <h2 className="text-xl font-semibold mb-6">General Information</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Product Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Maya's Magic Muesli"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <TipTapEditor
                        value={formData.description}
                        onChange={(content) => setFormData({ ...formData, description: content })}
                      />
                    </div>
                  </div>
                </div>

                {/* Media */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                  <h2 className="text-xl font-semibold mb-6">Media</h2>
                  <ImageUploader images={images} setImages={setImages} />
                </div>

                {/* Variants */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Variants & Pricing</h2>
                    <button
                      type="button"
                      onClick={handleAddVariant}
                      className="text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 px-4 py-2 rounded-full flex items-center gap-2 transition-colors"
                    >
                      <Plus size={16} /> Add Variant
                    </button>
                  </div>

                  <div className="space-y-4">
                    <AnimatePresence>
                      {variants.map((variant, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' }}
                          className="flex items-start gap-4 p-4 border border-gray-100 rounded-2xl bg-gray-50/50"
                        >
                          <div className="flex-1 grid grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Size / Name</label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. 250g"
                                value={variant.size}
                                onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                                className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Price (₹)</label>
                              <input
                                type="number"
                                required
                                min="0"
                                placeholder="0.00"
                                value={variant.price}
                                onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                                className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Stock</label>
                              <input
                                type="number"
                                min="0"
                                placeholder="0"
                                value={variant.stock}
                                onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                                className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                              />
                            </div>
                          </div>
                          {variants.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveVariant(index)}
                              className="mt-6 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={20} />
                            </button>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Status */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                  <h2 className="text-lg font-semibold mb-4">Status</h2>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all appearance-none bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
