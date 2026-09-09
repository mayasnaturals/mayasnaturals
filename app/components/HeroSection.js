"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import styles from "./HeroSection.module.css";

const SLIDES = [
  {
    image: "/hero.png",
    badge: "Premium Craft Muesli",
    titleStart: "20-in-1",
    titleHighlight: "Super Muesli",
    description: "Packed with 20 real ingredients and rich in Omega 3.<br />Absolutely no added sugar or preservatives.<br />Fully customizable to make your perfect bowl."
  },
  {
    image: "/hero2.png",
    badge: "Limited Time Offer",
    titleStart: "High Protein",
    titleHighlight: "Chocolate Muesli",
    description: "Decadent dark chocolate paired with crunchy oats.<br />High protein, zero guilt.<br />A perfect start to your day."
  },
  {
    image: "/hero3.png",
    badge: "New Arrival",
    titleStart: "Makhana",
    titleHighlight: "Roasted",
    highlightFirst: true,
    description: "Airy fox nuts roasted crisp and coated edge-to-edge.<br />A light roasted crunch with full-volume flavour.<br />The ultimate healthy snack."
  }
];

export default function HeroSection() {
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const slide = SLIDES[currentIndex];

  return (
    <section ref={containerRef} className={styles.heroSection}>
      {/* Left side cream background to prevent image bleed */}
      <div className={styles.bgLeft}></div>

      {/* Right side cream background for split look */}
      <div className={styles.bgRight}>
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.image}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
            style={{ position: "absolute", inset: 0 }}
          >
            <Image
              src={slide.image}
              alt="Hero Background"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              priority
              sizes="(max-width: 1024px) 80vw, 50vw"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Horizontal Divider for Mobile */}
      <div className={styles.dividerHorizontal}>
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,0 L1440,0 L1440,80 C1200,0 960,80 720,0 C480,80 240,0 0,80 Z" fill="var(--cream)" />
        </svg>
      </div>

      {/* Vertical Divider for Desktop */}
      <div className={styles.dividerVertical}>
        <svg viewBox="0 0 100 1440" preserveAspectRatio="none">
          <path d="M0,0 L100,0 C30,120 70,240 50,360 C30,480 70,600 50,720 C30,840 70,960 50,1080 C30,1200 70,1320 100,1440 L0,1440 Z" fill="var(--cream)" />
        </svg>
      </div>

      {/* Background patterns/shapes for hard vibrant color feel */}
      <div className={styles.bgBlob1}></div>
      <div className={styles.bgBlob2}></div>

      <div className={styles.container}>
        {/* Left Content */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentIndex}
            className={styles.leftContent}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className={styles.badge}>
              <span className={styles.badgeDot}></span>
              {slide.badge}
            </div>

            <h1 className={styles.title}>
              {slide.highlightFirst ? (
                <>
                  <span className={styles.titleHighlight} style={{ marginTop: 0, marginBottom: '-0.1em' }}>
                    {slide.titleHighlight}
                  </span>
                  {slide.titleStart}
                </>
              ) : (
                <>
                  {slide.titleStart}
                  <br />
                  <span className={styles.titleHighlight}>{slide.titleHighlight}</span>
                </>
              )}
            </h1>

            <p className={styles.description} dangerouslySetInnerHTML={{ __html: slide.description }} />

            <div className={styles.actions}>
              <Link href="/products" className={styles.btnPrimary}>
                Discover Now
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/our-story" className={styles.btnSecondary}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Watch Our Story
              </Link>
            </div>
            
            {/* Slider Dots */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '2rem' }}>
              {SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: currentIndex === idx ? 'var(--brand-red)' : 'rgba(0,0,0,0.1)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Right Content - Empty as requested */}
        <div className={styles.rightContent}>
        </div>
      </div>

      {/* Wavy bottom paper edge */}
      <div className={styles.wavyBottom}>
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" fill="var(--cream)" />
        </svg>
      </div>
    </section>
  );
}
