"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import Image from "next/image";

const PRODUCTS = [
  { name: "Peri Peri Makhana", color: "#dc3421", price: "Rs. 299", desc: "Spicy, tangy and aromatic", image: "/products/Peri Peri Makhana.png" },
  { name: "Cheese Makhana", color: "#efa900", price: "Rs. 349", desc: "Rich, creamy cheese seasoning", image: "/products/Cheese Makhana.png" },
  { name: "Mint Masala", color: "#73a65a", price: "Rs. 279", desc: "Fresh savoury crunch", image: "/products/Mint Makhana.jpeg" },
];

export default function CurvedTextSection({ products = [] }) {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, margin: "-20%" });
  const controls = useAnimation();

  // Map Shopify products or fallback to local static data
  const displayProducts = products?.length > 0 ? products.map(p => ({
    name: p.title,
    color: p.colorDark?.value || "#E8752A",
    price: p.priceRange?.minVariantPrice ? `Rs. ${parseInt(p.priceRange.minVariantPrice.amount)}` : "",
    image: p.images?.edges?.[0]?.node?.url || "/products/Default Museli.png"
  })) : PRODUCTS;

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

      <div className="relative z-10 pt-[180px] pb-20 px-5 md:pt-[220px] md:pb-32 md:px-6 mt-12">
        {/* Section Header */}
        <div className="text-center mb-20 md:mb-28">
          <motion.span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4 md:mb-6"
            style={{ background: "rgba(232,117,42,0.12)", color: "#E8752A" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Our Range
          </motion.span>
          <motion.h2
            className="text-4xl md:text-7xl lg:text-8xl font-display font-black uppercase tracking-tighter leading-none"
            style={{ color: "#2A1A10" }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Taste the Revolution
          </motion.h2>
        </div>

        {/* Product Cards in Arc Layout */}
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center md:items-end justify-center gap-6 md:gap-12 pb-4 md:pb-10 mt-12 mb-16">
          {displayProducts.map((product, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={controls}
              className={`product-card w-[260px] md:w-[320px] mx-auto ${i === 1 ? 'md:mb-[40px]' : ''}`}
            >
              <motion.div
                className="product-card-image relative overflow-hidden"
                style={{ backgroundColor: product.color }}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Image src={product.image} alt={product.name} fill priority style={{ objectFit: 'contain', padding: '1rem' }} sizes="(max-width: 768px) 100vw, 33vw" />
              </motion.div>
              <div className="product-card-body">
                <h3 className="product-card-name">{product.name}</h3>

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
