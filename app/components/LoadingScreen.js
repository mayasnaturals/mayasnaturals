"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function LoadingScreen({ progress, onComplete }) {
  const screenRef = useRef(null);
  const lettersRef = useRef([]);
  const taglineRef = useRef(null);
  const hasExitedRef = useRef(false);

  // Animate letters + tagline on mount
  useEffect(() => {
    const letters = lettersRef.current.filter(Boolean);
    if (letters.length === 0) return;

    gsap.set(letters, { opacity: 0, y: 40, scale: 0.8 });

    gsap.to(letters, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.5,
      stagger: 0.06,
      ease: "back.out(1.7)",
      delay: 0.2,
    });

    if (taglineRef.current) {
      gsap.set(taglineRef.current, { opacity: 0 });
      gsap.to(taglineRef.current, {
        opacity: 1,
        duration: 0.8,
        delay: 0.7,
        ease: "power2.out",
      });
    }
  }, []);

  // Exit animation
  useEffect(() => {
    if (progress >= 100 && !hasExitedRef.current && screenRef.current) {
      hasExitedRef.current = true;

      const tl = gsap.timeline({
        onComplete: () => {
          if (screenRef.current) {
            screenRef.current.style.display = "none";
          }
          if (onComplete) onComplete();
        },
      });

      // Letters scale up and fade
      const letters = lettersRef.current.filter(Boolean);
      tl.to(letters, {
        scale: 1.2,
        opacity: 0,
        y: -20,
        stagger: 0.03,
        duration: 0.4,
        ease: "power2.in",
      });

      // Screen fades
      tl.to(screenRef.current, {
        opacity: 0,
        duration: 0.6,
        ease: "power3.inOut",
      }, "-=0.2");
    }
  }, [progress, onComplete]);

  const word = "MÜSELI";

  return (
    <div className="loading-screen" ref={screenRef}>
      <div className="loading-brand-wrapper">
        <div className="loading-wordmark">
          {word.split("").map((letter, i) => (
            <span
              key={i}
              ref={(el) => {
                lettersRef.current[i] = el;
              }}
              style={{
                background: "var(--gradient-primary)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {letter}
            </span>
          ))}
        </div>
        <div className="loading-tagline" ref={taglineRef}>
          Fuel Your Mornings
        </div>
      </div>

      <div className="loading-progress-track">
        <div
          className="loading-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="loading-percent">{progress}% loaded</div>
    </div>
  );
}
