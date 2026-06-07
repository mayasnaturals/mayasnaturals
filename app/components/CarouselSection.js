"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const CAROUSEL_ITEMS = [
  { id: 1, title: "Wild Berry", subtitle: "Berry & Oat Crunch", color: "#E85D5D", emoji: "🍓" },
  { id: 2, title: "Citrus Orange", subtitle: "Zesty Morning Boost", color: "#E8752A", emoji: "🍊" },
  { id: 3, title: "Dark Chocolate", subtitle: "Rich Cocoa Delight", color: "#6B3A23", emoji: "🍫" },
  { id: 4, title: "Matcha Glow", subtitle: "Green Tea Vitality", color: "#5EAD5E", emoji: "🍵" },
];

export default function CarouselSection() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    const wrapper = wrapperRef.current;

    if (!section || !container || !wrapper) return;

    const amountToScroll = container.scrollWidth - wrapper.offsetWidth;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: `+=${amountToScroll + 1000}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      }
    });

    tl.to(container, {
      x: -amountToScroll,
      ease: "none",
    }, 0);

    return () => {
      ScrollTrigger.getAll().forEach(t => t.trigger === section ? t.kill() : null);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden flex flex-col justify-center"
      style={{ background: "#E8752A" }}
    >
      {/* Wavy top edge */}
      <div className="wave-divider wave-divider-top">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,60 C360,20 720,80 1080,30 C1260,10 1380,50 1440,20 L1440,0 L0,0 Z" fill="#FDF0E0" />
        </svg>
      </div>

      <div className="text-center mb-10 z-10 relative px-6">
        <h2 className="text-5xl md:text-7xl font-display font-black uppercase tracking-tighter"
          style={{ color: "#FFF8F0" }}>
          Explore the Range
        </h2>
        <p className="mt-3 text-lg font-body font-medium" style={{ color: "rgba(255,248,240,0.75)" }}>
          Swipe through our handcrafted flavors
        </p>
      </div>

      <div ref={wrapperRef} className="w-full overflow-hidden z-10 flex items-center h-[55vh]">
        <div
          ref={containerRef}
          className="flex gap-10 px-[50vw] items-center h-full will-change-transform"
          style={{ width: "max-content" }}
        >
          {CAROUSEL_ITEMS.map((item, i) => (
            <div
              key={item.id}
              className="carousel-item relative flex-shrink-0 flex flex-col items-center justify-center w-[280px] md:w-[380px]"
            >
              <motion.div
                className="w-full aspect-square rounded-[32px] shadow-xl relative overflow-hidden flex flex-col items-center justify-center group"
                style={{
                  backgroundColor: item.color,
                  boxShadow: "0 12px 40px rgba(42,26,16,0.2)",
                }}
                whileHover={{ scale: 1.05, rotate: i % 2 === 0 ? 2 : -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <span className="text-7xl mb-4 drop-shadow-lg">{item.emoji}</span>
                <div className="text-xl font-display font-black uppercase tracking-widest"
                  style={{ color: "rgba(255,248,240,0.9)" }}>
                  {item.title}
                </div>
              </motion.div>
              <div className="mt-6 text-center">
                <h3 className="text-2xl font-display font-black mb-1" style={{ color: "#FFF8F0" }}>
                  {item.title}
                </h3>
                <p className="font-body font-medium text-sm" style={{ color: "rgba(255,248,240,0.7)" }}>
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wavy bottom edge */}
      <div className="wave-divider wave-divider-bottom">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,30 C240,70 480,10 720,50 C960,80 1200,20 1440,40 L1440,80 L0,80 Z" fill="#FFF8F0" />
        </svg>
      </div>
    </section>
  );
}
