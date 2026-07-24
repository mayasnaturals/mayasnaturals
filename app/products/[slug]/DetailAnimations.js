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
        
        const back = hero.querySelector("[data-anim='back']");
        if (back) tl.from(back, { x: -30, opacity: 0, duration: 0.5, delay: 0.15 });

        const badges = hero.querySelectorAll("[data-anim='badge']");
        if (badges.length) tl.from(badges, { y: 16, opacity: 0, stagger: 0.08, duration: 0.4 }, "-=0.2");

        const title = hero.querySelector("[data-anim='title']");
        if (title) tl.from(title, { y: 50, opacity: 0, duration: 0.7 }, "-=0.25");

        const desc = hero.querySelector("[data-anim='desc']");
        if (desc) tl.from(desc, { y: 25, opacity: 0, duration: 0.5 }, "-=0.35");

        const actions = hero.querySelectorAll("[data-anim='action']");
        if (actions.length) tl.from(actions, { y: 20, opacity: 0, stagger: 0.1, duration: 0.45 }, "-=0.3");

        const visual = hero.querySelector("[data-anim='visual']");
        if (visual) tl.from(visual, { scale: 0.88, opacity: 0, rotate: 4, duration: 0.8, ease: "back.out(1.4)" }, "-=0.6");

        const swatches = hero.querySelectorAll("[data-anim='swatch']");
        if (swatches.length) tl.from(swatches, { scaleX: 0, opacity: 0, stagger: 0.06, duration: 0.35 }, "-=0.3");
      }

      /* ── Benefits strip ── */
      const benefitsBlock = el.querySelector("[data-anim='benefits']");
      const benefitTags = el.querySelectorAll("[data-anim='benefit']");
      if (benefitsBlock && benefitTags.length) {
        gsap.from(benefitTags, {
          scrollTrigger: { trigger: benefitsBlock, start: "top 92%" },
          y: 14, opacity: 0, stagger: 0.08, duration: 0.4, ease: "power2.out",
        });
      }

      /* ── Feature cards ── */
      const featuresBlock = el.querySelector("[data-anim='features']");
      const featuresCards = el.querySelectorAll("[data-anim='feature']");
      if (featuresBlock && featuresCards.length) {
        gsap.from(featuresCards, {
          scrollTrigger: { trigger: featuresBlock, start: "top 80%" },
          y: 20, opacity: 0, stagger: 0.1, duration: 0.5, ease: "power2.out",
          clearProps: "transform"
        });
      }

      /* ── Nutrition section ── */
      const nutritionSection = el.querySelector("[data-anim='nutrition']");
      if (nutritionSection) {
        const text = nutritionSection.querySelector("[data-anim='nutrition-text']");
        if (text) {
          gsap.from(text, { scrollTrigger: { trigger: nutritionSection, start: "top 75%" }, x: -50, opacity: 0, duration: 0.7, ease: "power3.out" });
        }
        const stats = nutritionSection.querySelectorAll("[data-anim='stat']");
        if (stats.length) {
          gsap.from(stats, { scrollTrigger: { trigger: nutritionSection, start: "top 75%" }, y: 40, opacity: 0, scale: 0.9, stagger: 0.1, duration: 0.55, ease: "back.out(1.6)" });
        }
      }

      /* ── One Pack section ── */
      const onePackSection = el.querySelector("[data-anim='onepack']");
      if (onePackSection) {
        const opText = onePackSection.querySelector("[data-anim='onepack-text']");
        if (opText) {
          gsap.from(opText, { scrollTrigger: { trigger: onePackSection, start: "top 78%" }, x: -40, opacity: 0, duration: 0.65, ease: "power3.out" });
        }
        const opCard = onePackSection.querySelector("[data-anim='onepack-card']");
        if (opCard) {
          gsap.from(opCard, { scrollTrigger: { trigger: onePackSection, start: "top 78%" }, y: 50, opacity: 0, rotate: -2, duration: 0.7, delay: 0.15, ease: "power3.out" });
        }
      }

      /* ── Related products ── */
      const relatedBlock = el.querySelector("[data-anim='related']");
      const relatedCards = el.querySelectorAll("[data-anim='related-card']");
      if (relatedBlock && relatedCards.length) {
        gsap.from(relatedCards, {
          scrollTrigger: { trigger: relatedBlock, start: "top 78%" },
          y: 70, opacity: 0, rotate: 1.5, stagger: 0.12, duration: 0.65, ease: "power3.out",
        });
      }
    }, el);

    return () => ctx.revert();
  }, []);

  return <div ref={wrapRef}>{children}</div>;
}
