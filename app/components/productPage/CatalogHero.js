"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

import styles from "../../products/products.module.css";

const headingWords = ["Big", "flavour.", "Better", "snacking."];
const tickerItems = [
  "Plant-powered",
  "Small batch",
  "Big crunch",
  "No boring bites",
];

const images = [
  "/images/product_banner_2.png",
  "/images/product_banner_3.png",
  "/images/product_banner_4.png",
];

export default function CatalogHero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className={styles.hero}>
      {/* Spacer image to maintain correct height on mobile */}
      <img
        src={images[0]}
        alt=""
        className={styles.heroImage}
        style={{ opacity: 0, pointerEvents: "none", visibility: "hidden" }}
      />
      
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={(e, { offset }) => {
          if (offset.x < -50) {
            // Swiped left
            setCurrentIndex((prev) => (prev + 1) % images.length);
          } else if (offset.x > 50) {
            // Swiped right
            setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
          }
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
          cursor: "grab",
        }}
        whileTap={{ cursor: "grabbing" }}
      >
        {images.map((src, index) => (
          <img
            key={src}
            src={src}
            alt={`Banner ${index + 1}`}
            className={styles.heroImage}
            style={{
              opacity: currentIndex === index ? 1 : 0,
              transition: "opacity 1s ease-in-out",
              position: "absolute",
              top: 0,
              left: 0,
              pointerEvents: "none",
            }}
          />
        ))}
      </motion.div>
      
      {/* <div className={styles.heroImageOverlay} /> */}
      <div className={styles.heroInner}>
        {/* <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={styles.heroKicker}
        >
          <Sparkles size={17} fill="currentColor" />
          The Maya snack shop
        </motion.div> */}
        {/* <h1 className={styles.heroTitle}>
          {headingWords.map((word, index) => (
            <motion.span
              key={word}
              initial={{ y: "110%", rotate: 2 }}
              animate={{ y: 0, rotate: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.12 + index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={index === 1 || index === 3 ? styles.accentWord : ""}
            >
              {word}
            </motion.span>
          ))}
        </h1> */}
        {/* <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.58 }}
        >
          Breakfast that wakes up before you do. Snacks that bring their own
          personality.
        </motion.p>
        <motion.a
          href="#shop-grid"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.7 }}
          className={styles.heroLink}
        >
          Shop all flavours <ArrowRight size={18} />
        </motion.a> */}
      </div>
      {/* <div className={styles.heroTicker}>
        <div>
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <span key={`${item}-${index}`}>
              {item}
              <i>•</i>
            </span>
          ))}
        </div>
      </div> */}
    </section>
  );
}
