"use client";

import SmoothScroller from "./components/SmoothScroller";
import HeroSection from "./components/HeroSection";

export default function Home() {
  return (
    <SmoothScroller>
      <main>
        <HeroSection />

        {/* After-Hero Section */}
        <section className="after-hero" id="after-hero">
          <div className="after-hero-tag">
            🌾 Crafted with Purpose
          </div>
          <h2 className="after-hero-title">
            Every Bowl Tells<br/>a <span>Story</span>
          </h2>
          <p className="after-hero-text">
            From farm-fresh oats to hand-picked berries, every ingredient is
            chosen to nourish your body and ignite your day. This is breakfast,
            reimagined.
          </p>
        </section>
      </main>
    </SmoothScroller>
  );
}
