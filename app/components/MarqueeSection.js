"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { GiFruitBowl, GiWheat, GiHoneyJar, GiChocolateBar } from "react-icons/gi";

export default function MarqueeSection() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  return (
    <section
      ref={containerRef}
      className="relative w-full pt-32 pb-36 mt-10 md:mt-20 md:py-40 lg:py-48 overflow-hidden flex flex-col justify-center items-center"
      style={{ background: "#FFF8F0" }}
    >
      {/* Decorative Food Icons */}
      <motion.div
        className="absolute left-6 md:left-32 top-10 md:top-20 opacity-80"
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, -100]) }}
      >
        <GiFruitBowl className="w-10 h-10 md:w-16 md:h-16" color="#5EAD5E" />
      </motion.div>
      <motion.div
        className="absolute right-6 md:right-32 bottom-12 md:bottom-24 opacity-80"
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, 100]) }}
      >
        <GiWheat className="w-10 h-10 md:w-16 md:h-16" color="#F5B323" />
      </motion.div>
      <motion.div
        className="absolute left-10 md:left-1/4 bottom-16 md:bottom-20 opacity-60"
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, -80]), rotate: 15 }}
      >
        <GiHoneyJar className="w-12 h-12 md:w-20 md:h-20" color="#E8752A" />
      </motion.div>
      <motion.div
        className="absolute right-10 md:right-1/4 top-12 md:top-24 opacity-60"
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, 80]), rotate: -15 }}
      >
        <GiChocolateBar className="w-10 h-10 md:w-16 md:h-16" color="#6B3A23" />
      </motion.div>

      {/* Heading */}
      <div className="text-center z-10 relative px-5 md:px-6 max-w-4xl mx-auto">
        <motion.h2
          className="text-4xl md:text-6xl lg:text-8xl font-display font-black uppercase tracking-tighter leading-[0.9]"
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
          className="mt-6 md:mt-8"
        >
          <p
            className="text-base md:text-xl lg:text-2xl font-body font-bold max-w-2xl mx-auto"
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
