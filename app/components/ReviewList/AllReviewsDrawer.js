import { useState, useMemo } from "react";
import { X, Star, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import styles from "./AllReviewsDrawer.module.css";
import reviewStyles from "./ReviewList.module.css";
import AllImagesModal from "./AllImagesModal";

export default function AllReviewsDrawer({ isOpen, onClose, reviews, productName }) {
  const [sortBy, setSortBy] = useState("recent");
  const [isImagesModalOpen, setIsImagesModalOpen] = useState(false);
  const [inlineFullscreenImage, setInlineFullscreenImage] = useState(null);

  const sortedReviews = useMemo(() => {
    const sorted = [...reviews];
    switch (sortBy) {
      case "highest":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "lowest":
        sorted.sort((a, b) => a.rating - b.rating);
        break;
      case "recent":
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "relevance":
        // Relevance: Reviews with images first, then by rating, then by length of description
        sorted.sort((a, b) => {
          const aHasImage = a.images && a.images.length > 0 ? 1 : 0;
          const bHasImage = b.images && b.images.length > 0 ? 1 : 0;
          if (aHasImage !== bHasImage) return bHasImage - aHasImage;
          if (a.rating !== b.rating) return b.rating - a.rating;
          return (b.description?.length || 0) - (a.description?.length || 0);
        });
        break;
      default:
        break;
    }
    return sorted;
  }, [reviews, sortBy]);

  const hasImages = reviews.some(r => r.images && r.images.length > 0);

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.drawer}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>All Reviews</h2>
            <p className="text-sm text-gray-500">For {productName}</p>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.controls}>
          {hasImages ? (
            <button 
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 border border-gray-200 shadow-sm flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
              onClick={() => setIsImagesModalOpen(true)}
              style={{ background: '#fffdf8', border: '1px solid #d2bba0', color: '#4a3022', fontSize: '0.9rem', fontWeight: 600 }}
            >
              <ImageIcon size={16} />
              <span>Customer Images</span>
            </button>
          ) : (
            <span className="text-sm text-gray-500">{reviews.length} Reviews</span>
          )}
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="recent">Most Recent</option>
            <option value="relevance">Top Reviews (Relevance)</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </div>

        <div className={styles.content}>
          {sortedReviews.map((review) => (
            <div key={review._id} className={reviewStyles.card}>
              <div className={reviewStyles.cardHeader}>
                <div className={reviewStyles.stars}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={star <= review.rating ? reviewStyles.starFilled : reviewStyles.starEmpty}
                    />
                  ))}
                </div>
                <span className={reviewStyles.date}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h4 className={reviewStyles.title}>{review.title}</h4>
              <p className={reviewStyles.author}>
                By {review.customerEmail?.split("@")[0] || "Guest"}
                {review.verifiedPurchase && <span className={reviewStyles.verified}>Verified Buyer</span>}
              </p>
              <p className={reviewStyles.description}>{review.description}</p>
              
              {review.images && review.images.length > 0 && (
                <div className={reviewStyles.images}>
                  {review.images.map((img, idx) => (
                    <div 
                      key={idx} 
                      className={`${reviewStyles.imageWrapper} cursor-pointer hover:opacity-90 transition-opacity`}
                      onClick={() => setInlineFullscreenImage(img.url)}
                    >
                      <Image 
                        src={img.url} 
                        alt={`Review image ${idx + 1}`}
                        fill
                        className={reviewStyles.reviewImg}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <AllImagesModal
        isOpen={isImagesModalOpen}
        onClose={() => setIsImagesModalOpen(false)}
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
    </>
  );
}
