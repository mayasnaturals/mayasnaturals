"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { products } from "@/data/productData";

export default function ContactTestPage() {
  const containerRef = useRef(null);

  // We want the wheel to be fully visible from the middle of the screen.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    damping: 15,
    stiffness: 100
  });

  // Rotate a full 360 degrees over the scroll duration
  const rotate = useTransform(smoothProgress, [0, 1], [0, 360]);

  return (
    <div className="min-h-[300vh] bg-[#FFF8F0] overflow-hidden text-[#2A1A10]">
      {/* Spacer to push the effect down so we can scroll to it */}
      <div className="h-[80vh] flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-block py-2 px-4 rounded-full bg-[#E85D5D] text-white text-sm font-black uppercase tracking-widest mb-6 border-2 border-[#2A1A10] shadow-[4px_4px_0_#2A1A10]">
            Interactive Showcase
          </span>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase font-display tracking-tight leading-[0.9] mb-8 text-[#2A1A10]">
            The Magic <br />
            <span className="text-[#E8752A] drop-shadow-[4px_4px_0_#2A1A10]">
              Circle
            </span>
          </h1>
          <p className="text-xl md:text-2xl font-bold text-[#8B7260] max-w-2xl mx-auto leading-relaxed">
            Scroll down to explore our dynamic full-circle product showcase.
          </p>
        </motion.div>
      </div>

      <div ref={containerRef} className="relative h-[250vh] w-full flex justify-center mt-[-10vh]">
        {/* The sticky container so the wheel stays in view while we scroll past it */}
        <div className="sticky top-0 w-full h-screen flex items-center justify-center">

          {/* Full Circle Background — generous margins from all edges */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[#F5A623]/15 flex items-center justify-center border-[6px] border-[#E8752A] border-dashed pointer-events-none" style={{ width: 'min(72vw, 90vh)', height: 'min(72vw, 90vh)' }}>
            {/* Concentric Decorative Circles */}
            <div className="absolute w-[80%] aspect-square rounded-[50%] border-[3px] border-[#E85D5D] opacity-30" />
            <div className="absolute w-[55%] aspect-square rounded-[50%] border-4 border-[#5EAD5E] opacity-20" />

            {/* Center Content of the Wheel */}
            <div className="absolute w-[40%] aspect-square rounded-[50%] bg-[#FFF8F0] shadow-[0_0_60px_rgba(232,117,42,0.3)] flex items-center justify-center text-center p-4 border-4 border-[#2A1A10] z-10">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-[#E85D5D] rounded-full mb-2 md:mb-3 border-[3px] border-[#2A1A10] shadow-[3px_3px_0_#2A1A10] flex items-center justify-center">
                  <span className="text-white text-xl md:text-2xl">💥</span>
                </div>
                <h2 className="font-display text-xl md:text-3xl lg:text-4xl font-black text-[#2A1A10] uppercase tracking-wide leading-none">
                  Our<br />Flavours
                </h2>
              </div>
            </div>
          </div>

          {/* The Rotating Wheel */}
          <motion.div
            style={{ rotate, width: 'min(72vw, 90vh)', height: 'min(72vw, 90vh)' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[50%] pointer-events-none"
          >
            {products.map((product, i) => {
              const angle = (i / products.length) * 360;

              return (
                <div
                  key={product.id}
                  className="absolute top-0 left-0 w-full h-full pointer-events-none flex items-start justify-center"
                  style={{ transform: `rotate(${angle}deg)` }}
                >
                  {/* Center card on the circle edge — pull up by half its height */}
                  <div className="mt-[-4rem] md:mt-[-5rem] pointer-events-auto">
                    <div className="w-32 h-40 sm:w-36 sm:h-48 md:w-44 md:h-56 lg:w-52 lg:h-[17rem] relative">
                      <ProductCard product={product} parentRotation={rotate} angle={angle} index={i} />
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Some content below to allow scrolling out */}
      <div className="h-[80vh] bg-[#2A1A10] relative flex items-center justify-center flex-col text-[#FFF8F0] mt-32 z-10">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#FFF8F0] to-transparent -translate-y-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-5xl md:text-7xl font-display font-black uppercase mb-6 text-[#F5A623] drop-shadow-[4px_4px_0_#E8752A]">
            Craving More?
          </h2>
          <a
            href="/products"
            className="inline-flex items-center justify-center px-10 py-5 bg-[#E85D5D] text-white font-display font-black text-xl uppercase tracking-widest rounded-full hover:bg-[#E8752A] transition-colors duration-300 border-4 border-white shadow-[6px_6px_0_rgba(255,255,255,0.2)]"
          >
            Shop Now
          </a>
        </motion.div>
      </div>
    </div>
  );
}

function ProductCard({ product, parentRotation, angle, index }) {
  // Counter-rotate the card so it stays upright
  const counterRotate = useTransform(parentRotation, r => -r - angle);

  // Pick a vibrant background color. If the product color isn't vibrant enough, fallback to a brand color.
  // We'll use the second color in the array which is usually medium brightness, but let's just make it pop.
  const cardBg = product.colors[1] || '#E8752A';

  return (
    <motion.div
      style={{ rotate: counterRotate }}
      initial={{ scale: 0.5, opacity: 0, filter: "blur(10px)" }}
      whileInView={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "200px" }}
      transition={{
        delay: (index % 4) * 0.1,
        type: "spring",
        stiffness: 150,
        damping: 15,
        mass: 1.2
      }}
      className="relative w-full h-full flex flex-col items-center justify-center cursor-pointer group"
    >
      {/* Fun Pop-Art Style Card */}
      <div
        className="w-full h-full rounded-2xl border-[3px] border-[#2A1A10] p-1.5 md:p-2 flex flex-col relative overflow-hidden transition-all duration-300 group-hover:-translate-y-2 group-hover:scale-105 shadow-[5px_5px_0_#2A1A10] group-hover:shadow-[8px_8px_0_#2A1A10]"
        style={{ backgroundColor: cardBg }}
      >

        {/* Image Section inside the card */}
        <div className="relative w-full aspect-square rounded-xl bg-white border-[3px] border-[#2A1A10] flex items-center justify-center mb-1.5 md:mb-2 overflow-hidden">
          <div className="absolute inset-0 bg-[#FFF8F0] opacity-50" />

          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 96px, 144px"
            className="object-contain p-1 drop-shadow-[0_5px_5px_rgba(42,26,16,0.15)] transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-[5deg]"
          />
        </div>

        {/* Details Section */}
        <div className="flex flex-col flex-1 items-center justify-center text-center px-0.5">
          <p className="font-display font-black text-white text-[10px] sm:text-xs md:text-sm leading-tight drop-shadow-[1px_1px_0_rgba(42,26,16,0.8)] line-clamp-2">
            {product.name}
          </p>
        </div>

      </div>
    </motion.div>
  );
}
