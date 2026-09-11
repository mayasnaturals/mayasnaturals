"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import s from "./detail.module.css";

export default function ImageGallery({ images, productName, productType }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }
    
    if (isRightSwipe) {
      setDirection(-1);
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };
  
  if (!images || images.length === 0) return null;

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  return (
    <>
      <div 
        className={s.imageFrame}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ position: 'relative', overflow: 'hidden' }}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            style={{ position: "absolute", inset: 0 }}
          >
            <Image
              src={images[currentIndex].url}
              alt={images[currentIndex].altText || `${productName} ${productType} pack`}
              fill
              priority
              sizes="(max-width: 1024px) 85vw, 480px"
              className={s.productImg}
            />
          </motion.div>
        </AnimatePresence>
      </div>
      {images.length > 1 && (
        <div className={s.thumbnailRow} data-anim="thumbnails">
          {images.map((img, i) => (
            <button 
              key={i} 
              className={`${s.thumbnailWrap} ${i === currentIndex ? s.thumbnailActive : ''}`}
              onClick={() => {
                if (i !== currentIndex) {
                  setDirection(i > currentIndex ? 1 : -1);
                  setCurrentIndex(i);
                }
              }}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={img.url}
                alt={img.altText || `Product image ${i+1}`}
                fill
                sizes="60px"
                className={s.thumbnailImg}
              />
            </button>
          ))}
        </div>
      )}
    </>
  );
}
