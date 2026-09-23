"use client";

import { useState, useRef, useEffect } from "react";
import { Star, X, UploadCloud, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import imageCompression from "browser-image-compression";
import styles from "./ReviewModal.module.css";
import { useCustomer } from "@/context/CustomerContext";
import Image from "next/image";

export default function ReviewModal({ isOpen, onClose, productHandle, productName, onSuccess }) {
  const { customer, isLoading } = useCustomer();
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [images, setImages] = useState([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  // Verification states
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState("");
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef(null);
  const verifyTimeoutRef = useRef(null);

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setRating(0);
      setTitle("");
      setDescription("");
      setImages([]);
      setError("");
      setVerifyMessage("");
      setIsVerified(false);
      setIsVerifying(false);
      setIsCompressing(false);
      setIsSuccess(false);
      
      if (customer) {
        const custEmail = customer.emailAddress?.emailAddress || customer.email || "";
        setEmail(custEmail);
        if (custEmail) {
          verifyPurchase(custEmail);
        }
      } else {
        setEmail("");
      }
    }
  }, [isOpen, customer, productName]);

  // If customer loads later
  useEffect(() => {
    if (customer && isOpen && !isVerified && !isVerifying) {
      const custEmail = customer.emailAddress?.emailAddress || customer.email || "";
      if (custEmail && custEmail !== email) {
        setEmail(custEmail);
        verifyPurchase(custEmail);
      }
    }
  }, [customer, email, isOpen, isVerified, isVerifying, productName]);

  const verifyPurchase = async (emailToVerify) => {
    if (!emailToVerify || !emailToVerify.includes('@')) return;
    
    setIsVerifying(true);
    setVerifyMessage("");
    setIsVerified(false);
    
    try {
      const res = await fetch(`/api/reviews/verify?email=${encodeURIComponent(emailToVerify)}&productName=${encodeURIComponent(productName)}`);
      const data = await res.json();
      
      if (res.ok && data.verified) {
        setIsVerified(true);
        setVerifyMessage("Purchase verified!");
      } else {
        setIsVerified(false);
        setVerifyMessage("We couldn't find a purchase for this product with this email.");
      }
    } catch (err) {
      setIsVerified(false);
      setVerifyMessage("Failed to verify purchase. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsVerified(false);
    setVerifyMessage("");
    
    if (verifyTimeoutRef.current) {
      clearTimeout(verifyTimeoutRef.current);
    }
    
    // Auto verify after typing stops
    if (newEmail.includes('@') && newEmail.includes('.')) {
      verifyTimeoutRef.current = setTimeout(() => {
        verifyPurchase(newEmail);
      }, 1000);
    }
  };

  const handleEmailBlur = () => {
    if (email && !isVerified && !isVerifying) {
      if (verifyTimeoutRef.current) clearTimeout(verifyTimeoutRef.current);
      verifyPurchase(email);
    }
  };

  if (!isOpen) return null;

  const handleImageChange = async (e) => {
    let files = Array.from(e.target.files);
    if (!files.length) return;

    // Filter out placeholders
    const currentValidImages = images.filter(img => !img.isUploading);
    const availableSlots = 3 - currentValidImages.length;
    
    if (files.length > availableSlots) {
      files = files.slice(0, availableSlots);
      setError("Only 3 images are allowed. The first 3 were selected.");
    } else {
      setError("");
    }

    if (files.length === 0) return;

    // Show placeholders first
    const placeholders = files.map(() => ({ isUploading: true }));
    setImages([...currentValidImages, ...placeholders]);
    setIsCompressing(true);

    try {
      const processedImages = [];
      for (let file of files) {
        // Convert HEIC to JPEG if needed
        if (file.type === "image/heic" || file.type === "image/heif" || file.name.toLowerCase().endsWith(".heic")) {
          const heic2any = (await import("heic2any")).default;
          const convertedBlob = await heic2any({
            blob: file,
            toType: "image/jpeg",
            quality: 0.8,
          });
          const finalBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
          file = new File([finalBlob], file.name.replace(/\.heic$/i, ".jpg"), {
            type: "image/jpeg",
          });
        }

        const options = {
          maxSizeMB: 1, 
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          initialQuality: 0.8,
          alwaysKeepResolution: false
        };

        const compressedFile = await imageCompression(file, options);
        const previewUrl = URL.createObjectURL(compressedFile);
        
        processedImages.push({
          file: compressedFile,
          previewUrl,
          name: compressedFile.name
        });
      }
      
      setImages([...currentValidImages, ...processedImages]);
    } catch (err) {
      console.error("Error processing image:", err);
      setError("Failed to process one or more images. Please try different photos.");
      setImages(currentValidImages); // Remove placeholders on error
    } finally {
      setIsCompressing(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    if (!newImages[index].isUploading) {
      URL.revokeObjectURL(newImages[index].previewUrl);
    }
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isVerified) {
      setError("Please verify your purchase with a valid email first.");
      return;
    }
    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }
    if (!title.trim() || !description.trim()) {
      setError("Please provide a title and description.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("productHandle", productHandle);
      formData.append("productName", productName);
      formData.append("rating", rating);
      formData.append("title", title);
      formData.append("description", description);

      images.filter(img => !img.isUploading).forEach((img) => {
        formData.append("images", img.file);
      });

      const response = await fetch("/api/reviews", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit review.");
      }

      if (onSuccess) onSuccess(data.review);
      setIsSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Determine if fields should be disabled
  const isFormDisabled = !isVerified || isSubmitting;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <X size={24} />
        </button>

        {isSuccess ? (
          <div className={styles.successState}>
            <CheckCircle2 size={48} className={styles.successIcon} />
            <h3>Review Submitted!</h3>
            <p>Your review has been successfully submitted for approval. Once approved, it will be live on our site.</p>
            <button className={styles.submitBtn} onClick={onClose}>
              Close Window
            </button>
          </div>
        ) : (
          <>
            <div className={styles.header}>
              <h2>Write a Review</h2>
              <p>For {productName}</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              {error && (
                <div className={styles.errorAlert}>
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              {/* Star Rating */}
              <div className={styles.fieldGroup}>
                <label>Rating *</label>
                <div className={styles.starSelect}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={32}
                      className={star <= (hoverRating || rating) ? styles.starFilled : styles.starEmpty}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                    />
                  ))}
                </div>
              </div>

              {/* Email (Always show to allow verification if needed, or show verified state for logged in users) */}
              <div className={styles.fieldGroup}>
                <label htmlFor="email">Email * (to verify purchase)</label>
                <div className={styles.emailInputWrapper}>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={handleEmailBlur}
                    placeholder="you@example.com"
                    required
                    disabled={isVerifying || (customer && isVerified)}
                    className={`${styles.input} ${isVerified ? styles.inputVerified : ''}`}
                  />
                  {isVerifying && <Loader2 size={18} className={styles.inputSpinner} />}
                  {isVerified && <CheckCircle2 size={18} className={styles.inputCheck} />}
                </div>
                {verifyMessage && (
                  <p className={`${styles.verifyMessage} ${isVerified ? styles.verifySuccess : styles.verifyError}`}>
                    {verifyMessage}
                  </p>
                )}
              </div>

              {/* Title */}
              <div className={styles.fieldGroup}>
                <label htmlFor="title">Review Title *</label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Summarize your experience"
                  required
                  maxLength={100}
                  disabled={isFormDisabled}
                  className={styles.input}
                />
              </div>

              {/* Description */}
              <div className={styles.fieldGroup}>
                <label htmlFor="description">Review *</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What did you like or dislike? What should other shoppers know?"
                  required
                  maxLength={1000}
                  rows={4}
                  disabled={isFormDisabled}
                  className={styles.textarea}
                />
              </div>

              {/* Image Upload */}
              <div className={styles.fieldGroup}>
                <label>Add Photos (optional, max 3)</label>
                <div className={`${styles.imageUploadArea} ${isFormDisabled ? styles.disabledArea : ''}`}>
                  {images.length < 3 && (
                    <button
                      type="button"
                      className={styles.uploadBtn}
                      onClick={() => !isFormDisabled && !isCompressing && fileInputRef.current?.click()}
                      disabled={isFormDisabled || isCompressing}
                    >
                      <UploadCloud size={24} />
                      <span>Upload Image</span>
                    </button>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/jpeg, image/png, image/webp, image/heic, image/heif"
                    multiple
                    disabled={isFormDisabled}
                    className={styles.hiddenInput}
                  />
                  
                  {images.length > 0 && (
                    <div className={styles.imagePreviews}>
                      {images.map((img, idx) => (
                        <div key={idx} className={styles.imagePreviewWrapper}>
                          {img.isUploading ? (
                            <div className={`${styles.previewImage} ${styles.placeholder} w-full h-full flex items-center justify-center bg-gray-100`}>
                              <Loader2 className={styles.spinner} size={24} />
                            </div>
                          ) : (
                            <>
                              <Image
                                src={img.previewUrl}
                                alt={`Preview ${idx + 1}`}
                                fill
                                className={styles.previewImage}
                              />
                              <button
                                type="button"
                                className={styles.removeImageBtn}
                                onClick={() => removeImage(idx)}
                                disabled={isFormDisabled}
                              >
                                <X size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <p className={styles.helpText}>Photos from your phone will be automatically resized for fast uploading.</p>
              </div>

              {/* Submit */}
              <div className={styles.footer}>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={isFormDisabled}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className={styles.spinner} />
                      Submitting...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
