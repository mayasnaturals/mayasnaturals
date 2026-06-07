"use client";

import SmoothScroller from "./components/SmoothScroller";
import HeroSection from "./components/HeroSection";
import MarqueeBanner from "./components/MarqueeBanner";
import CurvedTextSection from "./components/CurvedTextSection";
import CarouselSection from "./components/CarouselSection";
import MarqueeSection from "./components/MarqueeSection";
import StorytellingSection from "./components/StorytellingSection";
import CTASection from "./components/CTASection";

export default function Home() {
  return (
    <SmoothScroller>
      <main className="overflow-hidden" style={{ background: "#FFF8F0" }}>
        {/* SECTION 1 — Hero with image sequence */}
        <HeroSection />

        {/* Marquee divider */}
        <MarqueeBanner
          text="HAVE YOU SNACKED TODAY? • PREMIUM CRAFT MUESLI • FUEL YOUR MORNINGS"
          bgColor="#2A1A10"
          textColor="#F5A623"
          speed={30}
          fontSize="0.85rem"
        />

        {/* SECTION 2 — Product Showcase */}
        <CurvedTextSection />

        {/* SECTION 3 — Flavor Carousel */}
        <CarouselSection />

        {/* SECTION 4 — Double Marquee */}
        <MarqueeSection />

        {/* SECTION 5 — Craft Story */}
        <StorytellingSection />

        {/* SECTION 6 — CTA */}
        <CTASection />
      </main>
    </SmoothScroller>
  );
}
