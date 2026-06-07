"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

const PRODUCTS = [
  { name: "Wild Berry Crunch", color: "#E85D5D", price: "₹499", desc: "Bursting with sun-dried berries & toasted oats" },
  { name: "Tropical Gold", color: "#F5A623", price: "₹549", desc: "Mango, pineapple & coconut paradise" },
  { name: "Dark Choco Bliss", color: "#6B3A23", price: "₹599", desc: "Rich cocoa nibs with roasted almonds" },
];

export default function CurvedTextSection() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, margin: "-20%" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [isInView, controls]);

  const cardVariants = {
    hidden: { opacity: 0, y: 60, rotate: 0 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      rotate: i === 0 ? -4 : i === 2 ? 4 : 0,
      transition: {
        delay: i * 0.15,
        duration: 0.8,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };

  return (
    <section ref={containerRef} className="relative w-full overflow-hidden" style={{ background: "#FDF0E0" }}>
      {/* Wavy top divider */}
      <div className="wave-divider wave-divider-top">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,20 1440,40 L1440,0 L0,0 Z" fill="#FFF8F0" />
        </svg>
      </div>

      <div className="pt-28 pb-32 px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6"
            style={{ background: "rgba(232,117,42,0.12)", color: "#E8752A" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Our Range
          </motion.span>
          <motion.h2
            className="text-5xl md:text-7xl lg:text-8xl font-display font-black uppercase tracking-tighter leading-none"
            style={{ color: "#2A1A10" }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Taste the<br />Revolution
          </motion.h2>
        </div>

        {/* Product Cards in Arc Layout */}
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-end justify-center gap-8 md:gap-12 pb-10">
          {PRODUCTS.map((product, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={controls}
              className="product-card w-full md:w-[320px]"
              style={{
                marginBottom: i === 1 ? "40px" : "0",
              }}
            >
              <motion.div
                className="product-card-image"
                style={{ backgroundColor: product.color }}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <span style={{ fontSize: "3rem", opacity: 0.3 }}>🥣</span>
              </motion.div>
              <div className="product-card-body">
                <h3 className="product-card-name">{product.name}</h3>
                <p className="product-card-desc">{product.desc}</p>
                <div className="product-card-price">{product.price}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Wavy bottom divider */}
      {/* <div className="wave-divider wave-divider-bottom mt-10">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,20 C240,60 480,0 720,40 C960,80 1200,10 1440,30 L1440,80 L0,80 Z" fill="#E8752A" />
        </svg>
      </div> */}
    </section>
  );
}
