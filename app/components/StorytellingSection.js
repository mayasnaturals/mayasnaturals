"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function StorytellingSection() {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const productRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Split text into words for animation
    const textEl = textRef.current;
    const textContent = textEl.innerText;
    textEl.innerHTML = "";

    const words = textContent.split(" ");
    words.forEach((word) => {
      const span = document.createElement("span");
      span.innerText = word + " ";
      span.style.opacity = 0.15;
      span.style.transition = "opacity 0.1s ease";
      textEl.appendChild(span);
    });

    const spans = textEl.querySelectorAll("span");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "+=2500",
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      },
    });

    // Animate words opacity
    tl.to(
      spans,
      {
        opacity: 1,
        stagger: 0.1,
        ease: "none",
        duration: 2,
      },
      0
    );

    // Rotate and scale product
    tl.to(
      productRef.current,
      {
        rotate: 180,
        scale: 1.15,
        ease: "none",
        duration: 2,
      },
      0
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) =>
        t.trigger === container ? t.kill() : null
      );
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden flex mx-auto items-center pb-10 justify-center"
      style={{ background: "#F5A623" }}
    >
      <div className="relative z-10 w-full h-full flex flex-col md:flex-row items-center justify-center max-w-[1400px] mx-auto px-8 md:px-16 gap-12 md:gap-20">
        {/* Story Text */}
        <div className="flex-1 text-center md:text-left">
          <p
            className="text-sm font-body tracking-[0.25em] uppercase mb-6 font-bold"
            style={{ color: "rgba(42,26,16,0.5)" }}
          >
            The Craft Process
          </p>
          <h2
            ref={textRef}
            className="text-3xl md:text-5xl lg:text-6xl font-display font-black leading-[1.1]"
            style={{ color: "#2A1A10" }}
          >
            We handcraft every batch using only the most vibrant, sun-kissed
            ingredients sourced from passionate farmers who care about the earth
            as much as we do.
          </h2>
        </div>

        {/* Rotating Product Graphic */}
        <div className="flex-1 flex justify-center items-center">
          <div
            ref={productRef}
            className="w-[250px] h-[250px] md:w-[350px] md:h-[350px] rounded-full flex items-center justify-center relative"
            style={{
              background: "#FFF8F0",
              boxShadow: "0 20px 60px rgba(42,26,16,0.15)",
            }}
          >
            <span className="text-8xl drop-shadow-md">🥣</span>

            {/* Decorative orbiting dots */}
            <div
              className="absolute w-10 h-10 rounded-full flex items-center justify-center text-xl"
              style={{
                top: "-8px",
                background: "#E85D5D",
                boxShadow: "0 4px 12px rgba(232,93,93,0.3)",
              }}
            >
              🍓
            </div>
            <div
              className="absolute w-12 h-12 rounded-full flex items-center justify-center text-2xl"
              style={{
                bottom: "-8px",
                right: "20px",
                background: "#5EAD5E",
                boxShadow: "0 4px 12px rgba(94,173,94,0.3)",
              }}
            >
              🥝
            </div>
            <div
              className="absolute w-8 h-8 rounded-full flex items-center justify-center text-lg"
              style={{
                left: "-4px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "#E8752A",
                boxShadow: "0 4px 12px rgba(232,117,42,0.3)",
              }}
            >
              🥜
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
