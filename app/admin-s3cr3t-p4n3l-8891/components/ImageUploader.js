'use client';
import { useCallback, useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { ImagePlus, X, Loader2, Plus, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableImage({ id, url, index, onRemove, onReplace, isProcessing }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  const isFirst = index === 0;
  const fileInputRef = useRef(null);

  const handleReplaceClick = (e) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onReplace(url, file);
    }
    // Reset input so the same file can be selected again if needed
    e.target.value = '';
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative rounded-xl overflow-hidden group border border-gray-200 bg-white ${
        isFirst ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1 aspect-square'
      } ${isDragging ? 'shadow-2xl ring-2 ring-green-500 scale-105' : 'shadow-sm'}`}
    >
      <div 
        {...attributes} 
        {...listeners} 
        className={`w-full h-full cursor-grab active:cursor-grabbing relative ${isFirst ? 'min-h-[300px]' : ''} ${isProcessing ? 'opacity-50' : ''}`}
      >
        <Image src={url} alt={`Product Image ${index}`} fill className="object-cover pointer-events-none" />
      </div>

      {isProcessing ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-30">
          <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
        </div>
      ) : (
        <div className="absolute top-2 right-2 flex gap-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()} 
            onClick={handleReplaceClick}
            className="p-1.5 bg-white/90 backdrop-blur-sm text-gray-600 rounded-full hover:bg-gray-100 hover:text-gray-900 shadow-sm"
            title="Replace Image"
          >
            <RefreshCw size={16} />
          </button>
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()} 
            onClick={() => onRemove(url)}
            className="p-1.5 bg-white/90 backdrop-blur-sm text-red-500 rounded-full hover:bg-red-50 hover:text-red-600 shadow-sm"
            title="Delete Image"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Hidden file input for replacement */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/jpeg, image/png, image/webp, image/gif" 
        onChange={handleFileChange} 
      />
    </div>
  );
}

export default function ImageUploader({ images, setImages }) {
  const [uploading, setUploading] = useState(false);
  const [processingUrls, setProcessingUrls] = useState(new Set());

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, 
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Helper to upload a single file to Cloudinary
  const uploadToCloudinary = async (file) => {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signatureResponse = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paramsToSign: { timestamp } })
    });
    
    if (!signatureResponse.ok) throw new Error('Failed to get signature');
    const { signature, apiKey, cloudName } = await signatureResponse.json();
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', apiKey); 
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
    
    const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!uploadResponse.ok) {
       const err = await uploadResponse.json();
       throw new Error(err.error?.message || 'Failed to upload');
    }

    const uploadResult = await uploadResponse.json();
    return uploadResult.secure_url;
  };

  // Helper to delete an image from Cloudinary
  const deleteFromCloudinary = async (imageUrl) => {
    const res = await fetch('/api/admin/upload', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl })
    });
    if (!res.ok) throw new Error('Failed to delete image from Cloudinary');
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    setUploading(true);
    try {
      const uploadPromises = acceptedFiles.map(file => uploadToCloudinary(file));
      const newImages = await Promise.all(uploadPromises);
      setImages((prev) => [...prev, ...newImages]);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload images. " + error.message);
    } finally {
      setUploading(false);
    }
  }, [setImages]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': [],
      'image/gif': []
    },
  });

  const removeImage = async (urlToRemove) => {
    // Add to processing state
    setProcessingUrls(prev => new Set(prev).add(urlToRemove));
    
    try {
      // 1. Delete from Cloudinary
      await deleteFromCloudinary(urlToRemove);
      
      // 2. Remove from UI state
      setImages(prev => prev.filter(url => url !== urlToRemove));
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete image: ' + error.message);
    } finally {
      // Remove from processing state
      setProcessingUrls(prev => {
        const newSet = new Set(prev);
        newSet.delete(urlToRemove);
        return newSet;
      });
    }
  };

  const replaceImage = async (oldUrl, newFile) => {
    // Add to processing state
    setProcessingUrls(prev => new Set(prev).add(oldUrl));

    try {
      // 1. Upload new image
      const newUrl = await uploadToCloudinary(newFile);
      
      // 2. Replace URL in state (maintaining position)
      setImages(prev => prev.map(url => url === oldUrl ? newUrl : url));

      // 3. Delete old image from Cloudinary in background
      deleteFromCloudinary(oldUrl).catch(err => console.error('Failed to cleanup old image:', err));

    } catch (error) {
      console.error('Replace error:', error);
      alert('Failed to replace image: ' + error.message);
    } finally {
      // Remove from processing state
      setProcessingUrls(prev => {
        const newSet = new Set(prev);
        newSet.delete(oldUrl);
        return newSet;
      });
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="space-y-4">
      {images.length === 0 ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 ease-in-out
            ${isDragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-3">
            <div className="p-4 bg-white rounded-full shadow-sm">
              {uploading ? (
                <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
              ) : (
                <ImagePlus className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">
                {uploading ? 'Uploading...' : 'Click or drag images here'}
              </p>
              <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
            </div>
          </div>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-min">
            <SortableContext
              items={images}
              strategy={rectSortingStrategy}
            >
              {images.map((url, index) => (
                <SortableImage 
                  key={url} 
                  id={url} 
                  url={url} 
                  index={index} 
                  onRemove={removeImage} 
                  onReplace={replaceImage}
                  isProcessing={processingUrls.has(url)}
                />
              ))}
            </SortableContext>

            {/* Add More Images Tile */}
            <div
              {...getRootProps()}
              className={`col-span-1 aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors
                ${isDragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'}
              `}
            >
              <input {...getInputProps()} />
              {uploading ? (
                <Loader2 className="w-6 h-6 text-green-600 animate-spin" />
              ) : (
                <Plus className="w-8 h-8 text-gray-400" />
              )}
              <span className="text-xs text-gray-500 font-medium mt-2">Add</span>
            </div>
          </div>
        </DndContext>
      )}
    </div>
  );
}
