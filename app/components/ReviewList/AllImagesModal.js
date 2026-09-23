import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import styles from "./AllImagesModal.module.css";

export default function AllImagesModal({ isOpen, onClose, reviews, productName }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  // Extract all images from all reviews
  const allImages = reviews.reduce((acc, review) => {
    if (review.images && review.images.length > 0) {
      review.images.forEach(img => {
        acc.push({
          url: img.url,
          reviewId: review._id,
          customer: review.customerEmail?.split("@")[0] || "Guest",
          rating: review.rating,
          description: review.description
        });
      });
    }
    return acc;
  }, []);

  if (!isOpen) return null;

  const openFullScreen = (index) => {
    setSelectedImageIndex(index);
  };

  const closeFullScreen = () => {
    setSelectedImageIndex(null);
  };

  const prevImage = () => {
    setSelectedImageIndex(prev => (prev > 0 ? prev - 1 : prev));
  };

  const nextImage = () => {
    setSelectedImageIndex(prev => (prev < allImages.length - 1 ? prev + 1 : prev));
  };

  return (
    <>
      <div className={styles.backdrop}>
        <div className={styles.header}>
          <h2>Customer Images for {productName}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.content}>
          {allImages.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              <p>No customer images found for this product.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {allImages.map((img, idx) => (
                <div 
                  key={`${img.reviewId}-${idx}`} 
                  className={styles.imageWrapper}
                  onClick={() => openFullScreen(idx)}
                >
                  <Image 
                    src={img.url} 
                    alt={`Customer review image ${idx + 1}`}
                    fill
                    className={styles.galleryImage}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedImageIndex !== null && (
        <div className={styles.fullScreenView}>
          <div className={styles.fullScreenHeader}>
            <div className="text-white">
              <p className="font-semibold text-lg">{allImages[selectedImageIndex].customer}</p>
              <p className="text-sm opacity-80 line-clamp-1 max-w-md">{allImages[selectedImageIndex].description}</p>
            </div>
            <button className={styles.closeButton} onClick={closeFullScreen}>
              <X size={24} />
            </button>
          </div>
          
          <div className={styles.fullScreenImageContainer}>
            <div className="absolute left-4 z-10">
              <button 
                className={styles.navButton} 
                onClick={prevImage}
                disabled={selectedImageIndex === 0}
              >
                <ChevronLeft size={32} />
              </button>
            </div>
            
            <img 
              src={allImages[selectedImageIndex].url}
              alt="Customer Fullscreen"
              className={styles.fullScreenImg}
            />
            
            <div className="absolute right-4 z-10">
              <button 
                className={styles.navButton} 
                onClick={nextImage}
                disabled={selectedImageIndex === allImages.length - 1}
              >
                <ChevronRight size={32} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
