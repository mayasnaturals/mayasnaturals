"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STORY_IMAGES = [
  { src: "/products/Default Museli.png", bg: "#F5A623", text: "#2A1A10", kicker: "rgba(42,26,16,0.6)" },
  { src: "/products/Cocoa Almond Museli.png", bg: "#E8752A", text: "#2A1A10", kicker: "rgba(42,26,16,0.6)" },
  { src: "/products/Chocolate Museli.png", bg: "#4A2718", text: "#FFF8F0", kicker: "rgba(255,248,240,0.6)" },
  { src: "/products/Nutsseeds Museli.png", bg: "#5EAD5E", text: "#2A1A10", kicker: "rgba(42,26,16,0.6)" }
];

export default function StorytellingSection() {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const kickerRef = useRef(null);
  const productRef = useRef(null);
  const imgRefs = useRef([]);

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

    // Crossfade images and animate colors based on scroll
    const durationPerStep = 2 / (STORY_IMAGES.length - 1);
    STORY_IMAGES.forEach((item, i) => {
      if (i === 0) return;
      const startTime = (i - 1) * durationPerStep;
      
      tl.to(container, { backgroundColor: item.bg, ease: "none", duration: durationPerStep }, startTime);
      tl.to(textRef.current, { color: item.text, ease: "none", duration: durationPerStep }, startTime);
      tl.to(kickerRef.current, { color: item.kicker, ease: "none", duration: durationPerStep }, startTime);
      tl.to(imgRefs.current[i - 1], { opacity: 0, ease: "none", duration: durationPerStep }, startTime);
      tl.to(imgRefs.current[i], { opacity: 1, ease: "none", duration: durationPerStep }, startTime);
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) =>
        t.trigger === container ? t.kill() : null
      );
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen overflow-hidden flex mx-auto items-center py-10 justify-center"
      style={{ backgroundColor: STORY_IMAGES[0].bg }}
    >
      <div className="relative z-10 w-full h-full flex flex-col md:flex-row items-center justify-center max-w-[1400px] mx-auto px-5 md:px-16 gap-8 md:gap-20">
        {/* Story Text */}
        <div className="flex-1 text-center md:text-left">
          <p
            ref={kickerRef}
            className="text-sm font-body tracking-[0.25em] uppercase mb-6 font-bold"
            style={{ color: STORY_IMAGES[0].kicker }}
          >
            The Craft Process
          </p>
          <h2
            ref={textRef}
            className="text-2xl md:text-5xl lg:text-6xl font-display font-black leading-[1.1]"
            style={{ color: STORY_IMAGES[0].text }}
          >
            We handcraft every batch using only the most vibrant, sun-kissed
            ingredients sourced from passionate farmers who care about the earth
            as much as we do.
          </h2>
        </div>

        {/* Rotating Product Graphic */}
        <div className="flex-1 flex justify-center items-center mt-6 md:mt-0">
          <div
            ref={productRef}
            className="w-[220px] h-[250px] md:w-[500px] md:h-[550px] flex items-center justify-center relative group cursor-pointer"
          >
            <div 
              className="absolute inset-0 rounded-[50%] overflow-hidden transition-all duration-700 ease-out group-hover:scale-[1.05] group-hover:rotate-6"
              style={{
                backgroundColor: "#FFF8F0",
                boxShadow: "0 20px 60px rgba(42,26,16,0.15)",
              }}
            >
              {STORY_IMAGES.map((img, i) => (
                <div key={i} ref={el => imgRefs.current[i] = el} className="absolute inset-0" style={{ opacity: i === 0 ? 1 : 0 }}>
                  <Image src={img.src} alt={`Craft Muesli ${i}`} fill priority style={{ objectFit: 'cover' }} className="transition-transform duration-1000 group-hover:scale-110" sizes="(max-width: 768px) 100vw, 50vw" />
                </div>
              ))}
            </div>

            {/* Decorative orbiting dots */}
            <div
              className="absolute w-7 h-7 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm md:text-xl"
              style={{
                top: "-8px",
                background: "#E85D5D",
                boxShadow: "0 4px 12px rgba(232,93,93,0.3)",
              }}
            >
              🍓
            </div>
            <div
              className="absolute w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center text-base md:text-2xl"
              style={{
                bottom: "-8px",
                right: "10px",
                background: "#5EAD5E",
                boxShadow: "0 4px 12px rgba(94,173,94,0.3)",
              }}
            >
              🥝
            </div>
            <div
              className="absolute w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-lg"
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
