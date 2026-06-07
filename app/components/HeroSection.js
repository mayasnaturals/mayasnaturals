"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroCanvas from "./HeroCanvas";
import HeroOverlay from "./HeroOverlay";
import LoadingScreen from "./LoadingScreen";
import useImageSequence from "../hooks/useImageSequence";

gsap.registerPlugin(ScrollTrigger);

const INTRO_FRAMES = 60;

export default function HeroSection() {
  const { images, progress, isLoaded, preload, cleanup, totalFrames } = useImageSequence();
  const canvasRef = useRef(null);
  const heroRef = useRef(null);
  const scrollSpacerRef = useRef(null);
  const [loadingDone, setLoadingDone] = useState(false);
  const hasInitializedRef = useRef(false);
  const frameObjRef = useRef({ value: 0 });

  useEffect(() => {
    preload();
    return () => cleanup();
  }, [preload, cleanup]);

  const renderFrame = useCallback(
    (index) => {
      const clamped = Math.min(Math.max(Math.round(index), 0), totalFrames - 1);
      if (canvasRef.current) {
        canvasRef.current.renderFrame(clamped);
      }
    },
    [totalFrames]
  );

  const handleLoadingComplete = useCallback(() => {
    setLoadingDone(true);
  }, []);

  useEffect(() => {
    if (!loadingDone || hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    renderFrame(0);

    const timer = setTimeout(() => {
      initAnimations();
    }, 150);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingDone]);

  function initAnimations() {
    const heroEl = heroRef.current;
    const spacerEl = scrollSpacerRef.current;
    if (!heroEl || !spacerEl) return;

    const words = heroEl.querySelectorAll("[data-word]");
    const subtext = heroEl.querySelector("#hero-subtext");
    const btnPrimary = heroEl.querySelector("#cta-discover");
    const btnSecondary = heroEl.querySelector("#cta-watch");
    const shapes = heroEl.querySelectorAll(".floating-shape");
    const topbar = heroEl.querySelector("#hero-topbar");
    const tag = heroEl.querySelector("#hero-tag");
    const scrollIndicator = heroEl.querySelector("#hero-scroll-indicator");

    // =============================================
    // PHASE 1: Cinematic intro
    // =============================================
    const introTl = gsap.timeline({
      delay: 0.1,
      defaults: { ease: "power3.out" },
      onUpdate: () => {
        renderFrame(Math.round(frameObjRef.current.value));
      },
    });

    // Frame sequence autoplay
    introTl.to(
      frameObjRef.current,
      { value: INTRO_FRAMES, duration: 2.8, ease: "power2.inOut" },
      0
    );

    // Floating shapes emerge softly
    introTl.to(
      shapes,
      { opacity: 0.7, duration: 2, stagger: 0.2, ease: "power1.out" },
      0.2
    );

    // Top bar slides down
    if (topbar) {
      introTl.to(
        topbar,
        { opacity: 1, y: 0, duration: 0.8 },
        0.4
      );
    }

    // Tag badge pops in
    introTl.to(
      tag,
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.7)" },
      0.6
    );

    // Word-by-word headline reveal with blur + scale + upward
    introTl.to(
      words,
      {
        opacity: 1,
        y: "0%",
        filter: "blur(0px)",
        scale: 1,
        duration: 0.8,
        stagger: 0.09,
        ease: "power4.out",
      },
      0.7
    );

    // Supporting text
    introTl.to(
      subtext,
      { opacity: 1, y: 0, duration: 0.7 },
      1.8
    );

    // CTA buttons stagger in
    introTl.to(
      btnPrimary,
      { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.4)" },
      2.0
    );

    introTl.to(
      btnSecondary,
      { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.4)" },
      2.15
    );

    // Scroll indicator fades in last
    if (scrollIndicator) {
      introTl.to(
        scrollIndicator,
        { opacity: 1, duration: 0.8 },
        2.6
      );
    }

    // =============================================
    // PHASE 2: ScrollTrigger — cinematic scrub
    // =============================================
    ScrollTrigger.create({
      trigger: spacerEl,
      start: "top top",
      end: "bottom bottom",
      pin: heroEl,
      pinSpacing: false,
      anticipatePin: 1,
      scrub: 1,
      onUpdate: (self) => {
        const scrollFrame =
          INTRO_FRAMES +
          Math.round(self.progress * (totalFrames - 1 - INTRO_FRAMES));
        renderFrame(scrollFrame);
      },
    });

    // Text exit animation on scroll
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: spacerEl,
        start: "top top",
        end: "30% top",
        scrub: 0.8,
      },
    });

    // Tag slides up and fades
    scrollTl.to(tag, { y: -30, opacity: 0, ease: "none" }, 0);

    // Words parallax upward with staggered blur
    scrollTl.to(
      words,
      { y: -60, opacity: 0, filter: "blur(8px)", stagger: 0.015, ease: "none" },
      0
    );

    scrollTl.to(subtext, { y: -40, opacity: 0, ease: "none" }, 0);

    scrollTl.to(
      [btnPrimary, btnSecondary],
      { y: -30, opacity: 0, stagger: 0.02, ease: "none" },
      0.05
    );

    if (topbar) {
      scrollTl.to(topbar, { y: -30, opacity: 0, ease: "none" }, 0);
    }

    if (scrollIndicator) {
      scrollTl.to(scrollIndicator, { opacity: 0, ease: "none" }, 0);
    }

    // Shapes parallax at different depths
    shapes.forEach((shape, i) => {
      gsap.to(shape, {
        scrollTrigger: {
          trigger: spacerEl,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5,
        },
        y: -(40 + i * 25),
        rotation: (i % 2 === 0 ? 1 : -1) * (8 + i * 4),
        scale: 0.8,
        ease: "none",
      });
    });

    // Ambient floating animation on shapes
    shapes.forEach((shape, i) => {
      gsap.to(shape, {
        y: `+=${6 + i * 4}`,
        x: `+=${(i % 2 === 0 ? 1 : -1) * (3 + i * 2)}`,
        rotation: `+=${(i % 2 === 0 ? 1 : -1) * 3}`,
        duration: 4 + i * 0.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.5,
      });
    });
  }

  return (
    <>
      <LoadingScreen progress={progress} onComplete={handleLoadingComplete} />

      <div ref={scrollSpacerRef} className="scroll-spacer">
        <div ref={heroRef} className="hero-wrapper" id="hero-section">
          <HeroCanvas
            ref={canvasRef}
            images={images}
            totalFrames={totalFrames}
          />
          <HeroOverlay />
        </div>
      </div>
    </>
  );
}
