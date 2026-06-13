"use client";

import { motion } from "framer-motion";
import MarqueeBanner from "./MarqueeBanner";

export default function CTASection() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ background: "#2A1A10" }}
    >
      {/* Wavy top */}
      <div className="wave-divider wave-divider-top">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path
            d="M0,60 C240,20 480,70 720,30 C960,0 1200,50 1440,20 L1440,0 L0,0 Z"
            fill="#F5A623"
          />
        </svg>
      </div>

      {/* Decorative marquee strip above CTA */}
      {/* <div className="pt-20">
        <MarqueeBanner
          text="JOIN THE REVOLUTION • FUEL YOUR MORNINGS • CRAFT MUESLI"
          bgColor="#E8752A"
          textColor="#FFF8F0"
          speed={20}
          tilt={-1.5}
          fontSize="0.85rem"
        />
      </div> */}

      {/* Main CTA Content */}
      <div className="relative z-10 text-center max-w-[1100px] mx-auto px-5 md:px-6 py-20 md:py-36 flex flex-col items-center" style={{ justifyContent: "center", margin: "0 auto 30px auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="justify-center"

        >
          <h2
            className="text-4xl md:text-8xl lg:text-[9rem] font-display font-black uppercase tracking-tighter leading-[0.85] mb-6 md:mb-8"
            style={{ color: "#FFF8F0" }}
          >
            Join The
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #F5A623, #E8752A)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Revolution
            </span>
          </h2>
        </motion.div>

        <motion.p
          className="text-base md:text-xl font-body max-w-2xl mb-8 md:mb-12 font-medium px-2"
          style={{ color: "rgba(255,248,240,0.65)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Don't settle for boring mornings. Fuel your next adventure with the
          most vibrant, energizing muesli on the planet.
        </motion.p>

        <motion.button
          className="group relative rounded-full font-display font-black text-xl md:text-2xl uppercase tracking-widest overflow-hidden cursor-pointer mt-10"
          style={{
            background: "linear-gradient(135deg, #E8752A, #F5A623)",
            color: "#FFF8F0",
            border: "none",
            boxShadow: "0 8px 30px rgba(232,117,42,0.3)",
            padding: "14px 30px",
            marginTop: "20px",
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{
            type: "spring",
            bounce: 0.5,
            duration: 1,
            delay: 0.5,
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative z-10 flex items-center gap-4">
            Shop Now
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-300 group-hover:translate-x-2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
          <div
            className="absolute inset-0 transform scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100"
            style={{ background: "rgba(255,248,240,0.15)" }}
          />
        </motion.button>
      </div>
    </section >
  );
}
