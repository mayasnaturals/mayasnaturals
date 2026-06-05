"use client";

import FloatingShapes from "./FloatingShapes";

export default function HeroOverlay() {
  return (
    <>
      {/* Layer 5 — Floating shapes behind text */}
      <FloatingShapes />

      {/* Gradient vignette overlay for text contrast */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, rgba(5,5,5,0.65) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Bottom gradient for text legibility */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "50%",
          zIndex: 1,
          background:
            "linear-gradient(to top, rgba(5,5,5,0.85) 0%, rgba(5,5,5,0.4) 40%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Top bar with brand name */}
      <div className="hero-topbar" id="hero-topbar">
        <div className="hero-brand">MÜSELI</div>
        <nav className="hero-nav">
          <span className="hero-nav-link">Products</span>
          <span className="hero-nav-link">Story</span>
          <span className="hero-nav-link">Shop</span>
        </nav>
      </div>

      {/* Layer 2-4 — Text + CTA overlay */}
      <div className="hero-overlay" id="hero-overlay">
        {/* Small tagline above headline */}
        <div className="hero-tag" id="hero-tag">
          <span className="hero-tag-dot"></span>
          <span>Premium Craft Muesli</span>
        </div>

        {/* Layer 2 — Headlines */}
        <h1 className="hero-headline" id="hero-headline">
          <span className="hero-headline-line">
            <span className="hero-word" data-word>Fuel</span>
            <span className="hero-word" data-word>Your</span>
            <span className="hero-word hero-word--accent" data-word>Mornings.</span>
          </span>
          <span className="hero-headline-line">
            <span className="hero-word" data-word>The</span>
            <span className="hero-word hero-word--brand" data-word>Müseli</span>
            <span className="hero-word hero-word--accent2" data-word>Revolution.</span>
          </span>
        </h1>

        {/* Layer 3 — Supporting text */}
        <p className="hero-subtext" id="hero-subtext">
          Wholesome grains, sun-kissed fruits, and premium nuts — crafted
          for those who start each day with <strong>intention</strong> and <strong>energy</strong>.
        </p>

        {/* Layer 4 — CTA buttons */}
        <div className="hero-cta-group" id="hero-cta-group">
          <button className="btn-primary" id="cta-discover">
            <span className="btn-primary-text">Discover Now</span>
            <span className="btn-primary-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </button>
          <button className="btn-secondary" id="cta-watch">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Watch Our Story
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="hero-scroll-indicator" id="hero-scroll-indicator">
          <div className="scroll-line"></div>
          <span className="scroll-text">Scroll to explore</span>
        </div>
      </div>
    </>
  );
}
