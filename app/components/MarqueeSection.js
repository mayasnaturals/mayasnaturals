"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function MarqueeSection() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const x1 = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["-30%", "0%"]);

  const row1 = "BREAKFAST REIMAGINED • FUEL YOUR ADVENTURE • HANDCRAFTED GOODNESS • ORGANIC INGREDIENTS • ";
  const row2 = "WARNING: MAY CAUSE AN IRRESISTIBLE URGE TO SNACK ALL THE TIME • PURE DELICIOUS JOY • ";

  return (
    <section
      ref={containerRef}
      className="relative w-full py-32 md:py-40 overflow-hidden"
      style={{ background: "#FFF8F0" }}
    >
      {/* Wavy top */}
      <div className="wave-divider wave-divider-top">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,50 C360,10 720,70 1080,30 C1260,10 1380,60 1440,40 L1440,0 L0,0 Z" fill="#FFF8F0" />
        </svg>
      </div>

      {/* Heading */}
      <div className="text-center mb-16 z-10 relative px-6">
        <motion.h2
          className="text-5xl md:text-7xl font-display font-black uppercase tracking-tighter"
          style={{ color: "#2A1A10" }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          Pure Joy in<br />Every Bite
        </motion.h2>
        <motion.p
          className="mt-4 text-lg font-body font-medium max-w-xl mx-auto"
          style={{ color: "#8B7260" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          No artificial anything. Just honest, delicious ingredients crafted for your daily adventure.
        </motion.p>
      </div>

      {/* Marquee Row 1 — tilted slightly */}
      {/* <div className="relative mb-6" style={{ transform: "rotate(-2deg)" }}>
        <div
          className="py-4 overflow-hidden"
          style={{ background: "#F5A623" }}
        >
          <motion.div
            className="flex whitespace-nowrap"
            style={{ x: x1 }}
          >
            <span
              className="font-display font-black text-xl md:text-3xl uppercase tracking-wide px-4"
              style={{ color: "#2A1A10" }}
            >
              {row1.repeat(6)}
            </span>
          </motion.div>
        </div>
      </div> */}

      {/* Marquee Row 2 — tilted opposite */}
      {/* <div className="relative" style={{ transform: "rotate(1.5deg)" }}>
        <div
          className="py-4 overflow-hidden"
          style={{ background: "#E85D5D" }}
        >
          <motion.div
            className="flex whitespace-nowrap"
            style={{ x: x2 }}
          >
            <span
              className="font-display font-black text-xl md:text-3xl uppercase tracking-wide px-4"
              style={{ color: "#FFF8F0" }}
            >
              {row2.repeat(6)}
            </span>
          </motion.div>
        </div>
      </div> */}

      {/* Wavy bottom */}
      <div className="wave-divider wave-divider-bottom">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,20 C240,60 480,0 720,40 C960,80 1200,10 1440,30 L1440,80 L0,80 Z" fill="#F5A623" />
        </svg>
      </div>
    </section>
  );
}
