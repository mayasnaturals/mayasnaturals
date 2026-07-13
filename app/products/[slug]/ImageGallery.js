"use client";

import { useState } from "react";
import Image from "next/image";
import s from "./detail.module.css";

export default function ImageGallery({ images, productName, productType }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  if (!images || images.length === 0) return null;

  return (
    <>
      <div className={s.imageFrame}>
        <Image
          src={images[currentIndex].url}
          alt={images[currentIndex].altText || `${productName} ${productType} pack`}
          fill
          priority
          sizes="(max-width: 1024px) 85vw, 480px"
          className={s.productImg}
        />
      </div>
      {images.length > 1 && (
        <div className={s.thumbnailRow} data-anim="thumbnails">
          {images.map((img, i) => (
            <button 
              key={i} 
              className={`${s.thumbnailWrap} ${i === currentIndex ? s.thumbnailActive : ''}`}
              onClick={() => setCurrentIndex(i)}
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
