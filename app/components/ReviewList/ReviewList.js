"use client";

import { useEffect, useState } from "react";
import { Star, Image as ImageIcon, MessageSquare, X } from "lucide-react";
import Image from "next/image";
import styles from "./ReviewList.module.css";
import ReviewModal from "../ReviewModal/ReviewModal";
import AllReviewsDrawer from "./AllReviewsDrawer";

export default function ReviewList({ productHandle, productName, autoOpen = false }) {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(autoOpen);
  const [error, setError] = useState(null);
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [inlineFullscreenImage, setInlineFullscreenImage] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/reviews/${productHandle}`);
        const data = await res.json();
        if (data.reviews) {
          setReviews(data.reviews);
        }
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
        setError("Could not load reviews.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, [productHandle]);

  const handleReviewSuccess = (newReview) => {
    setReviews([newReview, ...reviews]);
  };

  const displayedReviews = reviews.slice(0, 3);

  return (
    <div className={styles.reviewContainer}>
      <div className={styles.header}>
        <h3>Customer Reviews</h3>
        <button className={styles.writeReviewBtn} onClick={() => setIsModalOpen(true)}>
          Write a Review
        </button>
      </div>

      {isLoading ? (
        <div className={styles.loading}>Loading reviews...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : reviews.length === 0 ? (
        <div className={styles.empty}>
          <p>No reviews yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <>
          <div className={styles.list}>
            {displayedReviews.map((review) => (
              <div key={review._id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.stars}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className={star <= review.rating ? styles.starFilled : styles.starEmpty}
                      />
                    ))}
                  </div>
                  <span className={styles.date}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h4 className={styles.title}>{review.title}</h4>
                <p className={styles.author}>
                  By {review.customerEmail.split("@")[0]}
                  {review.verifiedPurchase && <span className={styles.verified}>Verified Buyer</span>}
                </p>
                <p className={styles.description}>{review.description}</p>
                
                {review.images && review.images.length > 0 && (
                  <div className={styles.images}>
                    {review.images.map((img, idx) => (
                      <div 
                        key={idx} 
                        className={`${styles.imageWrapper} cursor-pointer hover:opacity-90 transition-opacity`}
                        onClick={() => setInlineFullscreenImage(img.url)}
                      >
                        <Image 
                          src={img.url} 
                          alt={`Review image ${idx + 1}`}
                          fill
                          className={styles.reviewImg}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {reviews.length > 3 && (
            <div className="mt-10 flex justify-center">
              <button 
                onClick={() => setIsDrawerOpen(true)}
                className="px-8 py-3 rounded-full font-bold text-gray-700 bg-white border-2 border-gray-200 hover:border-[#e8752a] hover:text-[#e8752a] transition-all flex items-center gap-2 shadow-sm"
              >
                <MessageSquare size={20} />
                Show All {reviews.length} Reviews
              </button>
            </div>
          )}
        </>
      )}

      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productHandle={productHandle}
        productName={productName}
        onSuccess={handleReviewSuccess}
      />
      
      <AllReviewsDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        reviews={reviews}
        productName={productName}
      />

      {inlineFullscreenImage && (
        <div 
          className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-pointer"
          onClick={() => setInlineFullscreenImage(null)}
        >
          <button className="absolute top-4 right-4 text-white hover:text-gray-300 p-2">
            <X size={32} />
          </button>
          <img 
            src={inlineFullscreenImage} 
            alt="Customer Fullscreen" 
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
