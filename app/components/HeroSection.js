"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Subtle entrance animation for left content
      gsap.from(`.${styles.leftContent} > *`, {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out"
      });

      // Cards staggered animation
      gsap.from(`.${styles.card}`, {
        x: 100,
        opacity: 0,
        rotation: 15,
        stagger: 0.15,
        duration: 1,
        ease: "back.out(1.2)",
        delay: 0.3
      });
      
      // Floating animation for cards
      gsap.to(`.${styles.card}`, {
        y: "-=15",
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        stagger: 0.2,
        delay: 1.5
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className={styles.heroSection}>
      {/* Right side cream background for split look */}
      <div className={styles.bgRight}></div>

      {/* Horizontal Divider for Mobile */}
      <div className={styles.dividerHorizontal}>
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,80 C240,0 480,80 720,0 C960,80 1200,0 1440,80 L1440,80 L0,80 Z" fill="var(--warm-beige)" />
        </svg>
      </div>

      {/* Vertical Divider for Desktop */}
      <div className={styles.dividerVertical}>
        <svg viewBox="0 0 100 1440" preserveAspectRatio="none">
          <path d="M100,0 C30,120 70,240 50,360 C30,480 70,600 50,720 C30,840 70,960 50,1080 C30,1200 70,1320 100,1440 Z" fill="var(--warm-beige)" />
        </svg>
      </div>

      {/* Background patterns/shapes for hard vibrant color feel */}
      <div className={styles.bgBlob1}></div>
      <div className={styles.bgBlob2}></div>

      <div className={styles.container}>
        
        {/* Left Content */}
        <div className={styles.leftContent}>
          <div className={styles.badge}>
            <span className={styles.badgeDot}></span>
            Premium Craft Muesli
          </div>
          
          <h1 className={styles.title}>
            Coming Soon. <br />
            <span className={styles.titleHighlight}>Worth The Wait.</span>
          </h1>
          
          <p className={styles.description}>
            We&apos;re still building this website.<br /><br />
            A few things you&apos;re seeing here are placeholders, test products, and temporary content used during development. The real Maya&apos;s Naturals experience is on the way.
          </p>
          
          <div className={styles.actions}>
            <button className={styles.btnPrimary}>
              Discover Now
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <button className={styles.btnSecondary}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Watch Our Story
            </button>
          </div>
        </div>

        {/* Right Content - Staggered Cards */}
        <div className={styles.rightContent}>
          {/* Card 1 */}
          <div className={`${styles.card} ${styles.card1}`}>
            <div className={`${styles.cardImage} ${styles.card1Image}`}>
              <Image src="/products/Cocoa Almond Museli.png" alt="Cocoa & Almond" fill style={{ objectFit: 'contain', padding: '10px' }} sizes="(max-width: 768px) 100vw, 33vw" />
            </div>
            <div className={styles.cardTitle}>Cocoa & Almond</div>
            <div className={styles.cardPrice}>Rs. 499</div>
          </div>

          {/* Card 2 */}
          <div className={`${styles.card} ${styles.card2}`}>
            <div className={`${styles.cardImage} ${styles.card2Image}`}>
              <Image src="/products/Default Museli.png" alt="Classic Super Muesli" fill style={{ objectFit: 'contain', padding: '10px' }} sizes="(max-width: 768px) 100vw, 33vw" />
            </div>
            <div className={styles.cardTitle}>Classic Super Muesli</div>
            <div className={styles.cardPrice}>Rs. 449</div>
          </div>

          {/* Card 3 */}
          <div className={`${styles.card} ${styles.card3}`}>
            <div className={`${styles.cardImage} ${styles.card3Image}`}>
              <Image src="/products/Chocolate Museli.png" alt="Chocolate Delight" fill style={{ objectFit: 'contain', padding: '10px' }} sizes="(max-width: 768px) 100vw, 33vw" />
            </div>
            <div className={styles.cardTitle}>Chocolate Delight</div>
            <div className={styles.cardPrice}>Rs. 525</div>
          </div>
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
