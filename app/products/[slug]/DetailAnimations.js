"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function DetailAnimations({ children }) {
  const wrapRef = useRef(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      /* ── Hero entrance ── */
      const hero = el.querySelector("[data-anim='hero']");
      if (hero) {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.from(hero.querySelector("[data-anim='back']"), {
          x: -30,
          opacity: 0,
          duration: 0.5,
          delay: 0.15,
        })
          .from(
            hero.querySelectorAll("[data-anim='badge']"),
            { y: 16, opacity: 0, stagger: 0.08, duration: 0.4 },
            "-=0.2"
          )
          .from(
            hero.querySelector("[data-anim='title']"),
            { y: 50, opacity: 0, duration: 0.7 },
            "-=0.25"
          )
          .from(
            hero.querySelector("[data-anim='desc']"),
            { y: 25, opacity: 0, duration: 0.5 },
            "-=0.35"
          )
          .from(
            hero.querySelectorAll("[data-anim='action']"),
            { y: 20, opacity: 0, stagger: 0.1, duration: 0.45 },
            "-=0.3"
          )
          .from(
            hero.querySelector("[data-anim='image']"),
            {
              scale: 0.88,
              opacity: 0,
              rotate: 4,
              duration: 0.8,
              ease: "back.out(1.4)",
            },
            "-=0.6"
          )
          .from(
            hero.querySelector("[data-anim='crunch']"),
            {
              x: -40,
              opacity: 0,
              duration: 0.5,
              ease: "back.out(2)",
            },
            "-=0.3"
          )
          .from(
            hero.querySelectorAll("[data-anim='swatch']"),
            { scaleX: 0, opacity: 0, stagger: 0.06, duration: 0.35 },
            "-=0.3"
          );
      }

      /* ── Benefits strip ── */
      gsap.from(el.querySelectorAll("[data-anim='benefit']"), {
        scrollTrigger: {
          trigger: el.querySelector("[data-anim='benefits']"),
          start: "top 92%",
        },
        y: 14,
        opacity: 0,
        stagger: 0.08,
        duration: 0.4,
        ease: "power2.out",
      });

      /* ── Feature cards ── */
      gsap.from(el.querySelectorAll("[data-anim='feature']"), {
        scrollTrigger: {
          trigger: el.querySelector("[data-anim='features']"),
          start: "top 80%",
        },
        y: 60,
        opacity: 0,
        rotate: 2,
        stagger: 0.12,
        duration: 0.65,
        ease: "power3.out",
      });

      /* ── Nutrition section ── */
      const nutritionSection = el.querySelector("[data-anim='nutrition']");
      if (nutritionSection) {
        gsap.from(nutritionSection.querySelector("[data-anim='nutrition-text']"), {
          scrollTrigger: {
            trigger: nutritionSection,
            start: "top 75%",
          },
          x: -50,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
        });

        gsap.from(nutritionSection.querySelectorAll("[data-anim='stat']"), {
          scrollTrigger: {
            trigger: nutritionSection,
            start: "top 75%",
          },
          y: 40,
          opacity: 0,
          scale: 0.9,
          stagger: 0.1,
          duration: 0.55,
          ease: "back.out(1.6)",
        });
      }

      /* ── One Pack section ── */
      const onePackSection = el.querySelector("[data-anim='onepack']");
      if (onePackSection) {
        gsap.from(onePackSection.querySelector("[data-anim='onepack-text']"), {
          scrollTrigger: {
            trigger: onePackSection,
            start: "top 78%",
          },
          x: -40,
          opacity: 0,
          duration: 0.65,
          ease: "power3.out",
        });

        gsap.from(onePackSection.querySelector("[data-anim='onepack-card']"), {
          scrollTrigger: {
            trigger: onePackSection,
            start: "top 78%",
          },
          y: 50,
          opacity: 0,
          rotate: -2,
          duration: 0.7,
          delay: 0.15,
          ease: "power3.out",
        });
      }

      /* ── Related products ── */
      gsap.from(el.querySelectorAll("[data-anim='related-card']"), {
        scrollTrigger: {
          trigger: el.querySelector("[data-anim='related']"),
          start: "top 78%",
        },
        y: 70,
        opacity: 0,
        rotate: 1.5,
        stagger: 0.12,
        duration: 0.65,
        ease: "power3.out",
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return <div ref={wrapRef}>{children}</div>;
}
