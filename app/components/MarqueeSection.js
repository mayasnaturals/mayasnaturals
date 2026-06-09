"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function MarqueeSection() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  return (
    <section
      ref={containerRef}
      className="relative w-full py-40 md:py-48 overflow-hidden flex flex-col justify-center items-center"
      style={{ background: "#FFF8F0" }}
    >
      {/* Decorative Food Elements */}
      <motion.div
        className="absolute left-10 md:left-32 top-20 text-6xl opacity-80"
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, -100]) }}
      >
        🥣
      </motion.div>
      <motion.div
        className="absolute right-10 md:right-32 bottom-32 text-6xl opacity-80"
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, 100]) }}
      >
        🌾
      </motion.div>
      <motion.div
        className="absolute left-1/4 bottom-20 text-5xl opacity-60"
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, -80]), rotate: 15 }}
      >
        🍯
      </motion.div>
      <motion.div
        className="absolute right-1/4 top-32 text-5xl opacity-60"
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, 80]), rotate: -15 }}
      >
        🍫
      </motion.div>

      {/* Heading */}
      <div className="text-center z-10 relative px-6 max-w-4xl mx-auto">
        <motion.h2
          className="text-6xl md:text-8xl font-display font-black uppercase tracking-tighter leading-[0.9]"
          style={{ color: "#2A1A10" }}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Pure Joy in<br />
          <span style={{ color: "#E8752A" }}>Every Bite</span>
        </motion.h2>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="mt-10"
        >
          <p
            className="text-xl md:text-2xl font-body font-bold max-w-2xl mx-auto"
            style={{ color: "#6B3A23", lineHeight: "1.6" }}
          >
            No artificial anything. Just honest, delicious ingredients crafted for your daily adventure.
          </p>
        </motion.div>
      </div>

      {/* Wavy bottom - overlaps the NEXT section (Storytelling is #F5A623) */}
      <div className="wave-divider wave-divider-bottom" style={{ zIndex: 20 }}>
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,20 C240,60 480,0 720,40 C960,80 1200,10 1440,30 L1440,80 L0,80 Z" fill="#F5A623" />
        </svg>
      </div>
    </section>
  );
}
