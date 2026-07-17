"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CarouselSection({ products = [] }) {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);

  const displayProducts = products?.length > 0 ? products.map(p => ({
    id: p.id,
    title: p.title,
    price: p.priceRange?.minVariantPrice ? `Rs. ${parseInt(p.priceRange.minVariantPrice.amount)}` : "",
    color: p.colorDark?.value || "#604032",
    image: p.images?.edges?.[0]?.node?.url || "/products/Chocolate Museli.png"
  })) : [];

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    const wrapper = wrapperRef.current;

    if (!section || !container || !wrapper) return;

    let mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      // Desktop: Horizontal Scroll
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
        tl.kill();
        ScrollTrigger.getAll().forEach(t => t.trigger === section ? t.kill() : null);
      };
    });

    return () => mm.revert();
  }, [displayProducts]);

  if (!displayProducts || displayProducts.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-auto md:h-screen overflow-hidden flex flex-col justify-center pt-28 pb-28 md:pt-0 md:pb-0"
      style={{ background: "#E8752A" }}
    >
      {/* Wavy top edge */}
      <div className="wave-divider wave-divider-top  md:block">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,60 C360,20 720,80 1080,30 C1260,10 1380,50 1440,20 L1440,0 L0,0 Z" fill="#FDF0E0" />
        </svg>
      </div>

      <div className="text-center mb-6 z-10 relative px-5">
        <h2 className="text-3xl md:text-5xl lg:text-7xl font-display font-black uppercase tracking-tighter"
          style={{ color: "#FFF8F0" }}>
          Explore the Range
        </h2>
      </div>

      <div ref={wrapperRef} className="w-full z-10 flex items-center md:h-[55vh]">
        <div
          ref={containerRef}
          className="flex flex-col md:flex-row gap-8 md:gap-10 px-5 md:px-[50vw] items-center w-full md:w-max md:h-full md:will-change-transform mx-auto md:mx-0"
        >
          {displayProducts.map((item, i) => (
            <div
              key={item.id}
              className="carousel-item relative flex-shrink-0 flex flex-col items-center justify-center w-[260px] md:w-[380px] gap-7"
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
                <div className="relative w-[92%] h-[92%] rounded-[24px] overflow-hidden group-hover:scale-[1.03] transition-transform duration-500">
                  <Image src={item.image} alt={item.title} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
              </motion.div>
              <div className="mt-4 md:mt-6 text-center">
                <h3 className="text-xl md:text-2xl font-display font-black mb-1" style={{ color: "#FFF8F0" }}>
                  {item.title}
                </h3>
                <p className="font-body font-bold text-lg md:text-xl" style={{ color: "rgba(255,248,240,0.9)" }}>
                  {item.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wavy bottom edge */}
      <div className="wave-divider wave-divider-bottom md:block">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,30 C240,70 480,10 720,50 C960,80 1200,20 1440,40 L1440,80 L0,80 Z" fill="#FFF8F0" />
        </svg>
      </div>
    </section>
  );
}
