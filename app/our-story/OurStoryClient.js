"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import {
  ArrowRight,
  Heart,
  Leaf,
  Sparkles,
  Sun,
  Play,
  Mountain,
} from "lucide-react";
import "./our-story.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ──────────────────────────── data ──────────────────────────── */

const values = [
  {
    icon: Leaf,
    title: "Clean Label",
    desc: "No artificial flavours, no preservatives, no palm oil. Every ingredient earns its place.",
    bg: "#75b843",
    fg: "#203313",
    shadow: "#29180e",
  },
  {
    icon: Heart,
    title: "Made With Care",
    desc: "Small-batch roasted, hand-mixed and packed with real love in every jar.",
    bg: "#ffc833",
    fg: "#29180e",
    shadow: "#29180e",
  },
  {
    icon: Sun,
    title: "Sunshine Sourced",
    desc: "Ingredients picked at peak ripeness from farmers who respect the soil.",
    bg: "#f25c2a",
    fg: "#fff9ed",
    shadow: "#29180e",
  },
  {
    icon: Mountain,
    title: "Adventure Ready",
    desc: "From trail mornings to office desks — fuel that travels with your ambition.",
    bg: "#29180e",
    fg: "#fff9ed",
    shadow: "#ffc833",
  },
];

const reels = [
  { id: 1, label: "Farm to Pack" },
  { id: 2, label: "Morning Rituals" },
  { id: 3, label: "The Roast" },
  { id: 4, label: "Community" },
  { id: 5, label: "Behind the Scenes" },
];

const timelineEvents = [
  { year: "2022", title: "The Kitchen Experiment", desc: "It started with a bag of oats, a frying pan and an obsession with getting the crunch right." },
  { year: "2023", title: "First 100 Jars", desc: "Friends, family, and a few brave strangers — our first tasters became our loudest fans." },
  { year: "2024", title: "Going Clean Label", desc: "We ditched palm oil, cut added sugar to zero, and earned our clean-label certification." },
  { year: "2025", title: "Makhana Launch", desc: "Crunchy fox nuts in four bold flavours — our first non-muesli line hit shelves." },
  { year: "2026", title: "10,000+ Happy Bowls", desc: "Growing one crunchy morning at a time, from a kitchen to a community." },
];

/* ──────────────────────────── component ──────────────────────────── */

export default function OurStoryClient() {
  const heroRef = useRef(null);
  const originRef = useRef(null);
  const originTextRef = useRef(null);
  const valuesRef = useRef(null);
  const reelsRef = useRef(null);
  const timelineRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ── Hero entrance ── */
      const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
      heroTl
        .from(".os-hero-kicker", { y: 30, opacity: 0, duration: 0.7, delay: 0.2 })
        .from(".os-hero-word", { y: "110%", opacity: 0, rotateX: 40, stagger: 0.08, duration: 0.7 }, "-=0.4")
        .from(".os-hero-sub", { y: 20, opacity: 0, duration: 0.6 }, "-=0.3")
        .from(".os-hero-scroll", { opacity: 0, duration: 0.5 }, "-=0.2");

      /* ── Origin: pinned text reveal ── */
      const originEl = originRef.current;
      const textEl = originTextRef.current;
      if (originEl && textEl) {
        const rawText = textEl.innerText;
        textEl.innerHTML = "";
        rawText.split(" ").forEach((word) => {
          const s = document.createElement("span");
          s.innerText = word + " ";
          s.style.opacity = "0.12";
          s.style.display = "inline";
          s.style.transition = "opacity 0.08s ease";
          textEl.appendChild(s);
        });

        const spans = textEl.querySelectorAll("span");

        gsap.timeline({
          scrollTrigger: {
            trigger: originEl,
            start: "top top",
            end: "+=2200",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        }).to(spans, { opacity: 1, stagger: 0.08, ease: "none", duration: 2 }, 0);
      }

      /* ── Values cards stagger ── */
      gsap.from(".os-value-card", {
        scrollTrigger: {
          trigger: valuesRef.current,
          start: "top 80%",
          end: "top 30%",
          scrub: 1,
        },
        y: 80,
        opacity: 0,
        rotate: 3,
        stagger: 0.12,
        ease: "power2.out",
      });

      /* ── Timeline events stagger ── */
      gsap.from(".os-timeline-event", {
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top 75%",
          end: "bottom 60%",
          scrub: 1,
        },
        x: -60,
        opacity: 0,
        stagger: 0.15,
        ease: "power2.out",
      });

      /* ── Reels entrance ── */
      gsap.from(".os-reel-card", {
        scrollTrigger: {
          trigger: reelsRef.current,
          start: "top 80%",
          end: "top 35%",
          scrub: 1,
        },
        y: 100,
        opacity: 0,
        rotate: -4,
        stagger: 0.1,
        ease: "power2.out",
      });

      /* ── CTA text reveal ── */
      gsap.from(".os-cta-content", {
        scrollTrigger: {
          trigger: ctaRef.current,
          start: "top 80%",
        },
        y: 60,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="os-page">
      {/* ══════════════ HERO ══════════════ */}
      <section ref={heroRef} className="os-hero">
        <div className="os-hero-texture" />
        <div className="os-hero-inner">
          <p className="os-hero-kicker">
            <Sparkles size={14} strokeWidth={3} />
            The Maya Story
          </p>
          <h1 className="os-hero-title">
            {"Born from".split(" ").map((w, i) => (
              <span key={i} className="os-hero-word-wrap">
                <span className="os-hero-word">{w}</span>
              </span>
            ))}
            <br />
            {"crunch &".split(" ").map((w, i) => (
              <span key={`b${i}`} className="os-hero-word-wrap">
                <span className="os-hero-word os-hero-word--accent">{w}</span>
              </span>
            ))}
            <br />
            {"curiosity.".split(" ").map((w, i) => (
              <span key={`c${i}`} className="os-hero-word-wrap">
                <span className="os-hero-word">{w}</span>
              </span>
            ))}
          </h1>
          <p className="os-hero-sub">
            A craft muesli brand that started with one question — why does
            breakfast have to be boring?
          </p>
          <div className="os-hero-scroll">
            <div className="os-scroll-line" />
            <span className="os-scroll-label">Scroll to explore</span>
          </div>
        </div>
      </section>

      {/* ══════════════ ORIGIN — pinned text reveal ══════════════ */}
      <section ref={originRef} className="os-origin">
        <div className="wave-divider wave-divider-top">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
            <path d="M0,50 C360,10 720,70 1080,30 C1260,10 1380,60 1440,40 L1440,0 L0,0 Z" fill="#29180e" />
          </svg>
        </div>
        <div className="os-origin-inner">
          <p className="os-origin-kicker">The Beginning</p>
          <h2 ref={originTextRef} className="os-origin-text">
            We started Maya in a small kitchen with a simple belief: breakfast
            should be exciting, clean and packed with ingredients you can
            actually pronounce. No palm oil. No added sugar. No shortcuts.
            Just honest crunch made by people who care about what goes
            into every single bowl.
          </h2>
        </div>
      </section>

      {/* ══════════════ TIMELINE ══════════════ */}
      <section ref={timelineRef} className="os-timeline">
        <div className="wave-divider wave-divider-top">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
            <path d="M0,60 C240,20 480,70 720,30 C960,0 1200,50 1440,20 L1440,0 L0,0 Z" fill="#ffc833" />
          </svg>
        </div>
        <div className="os-timeline-inner">
          <div className="os-timeline-header">
            <p className="os-section-kicker">Our Journey</p>
            <h2 className="os-section-title">Milestones that matter.</h2>
          </div>
          <div className="os-timeline-track">
            <div className="os-timeline-line" />
            {timelineEvents.map((ev, i) => (
              <div key={ev.year} className="os-timeline-event">
                <div className="os-timeline-dot">
                  <span>{ev.year}</span>
                </div>
                <div className="os-timeline-card">
                  <h3>{ev.title}</h3>
                  <p>{ev.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ VALUES ══════════════ */}
      <section ref={valuesRef} className="os-values">
        <div className="wave-divider wave-divider-top">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
            <path d="M0,30 C240,70 480,10 720,50 C960,80 1200,20 1440,40 L1440,0 L0,0 Z" fill="#fff8eb" />
          </svg>
        </div>
        <div className="os-values-inner">
          <div className="os-values-header">
            <p className="os-section-kicker" style={{ color: "#ffc833" }}>
              What we stand for
            </p>
            <h2 className="os-section-title" style={{ color: "#fff9ed" }}>
              Principles, not marketing.
            </h2>
          </div>
          <div className="os-values-grid">
            {values.map((v) => (
              <article
                key={v.title}
                className="os-value-card"
                style={{
                  background: v.bg,
                  color: v.fg,
                  "--card-shadow": v.shadow,
                }}
              >
                <v.icon size={28} strokeWidth={3} className="os-value-icon" />
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ REELS ══════════════ */}
      <section ref={reelsRef} className="os-reels">
        <div className="wave-divider wave-divider-top">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
            <path d="M0,40 C360,90 720,20 1080,60 C1260,80 1380,40 1440,20 L1440,0 L0,0 Z" fill="#29180e" />
          </svg>
        </div>
        <div className="os-reels-inner">
          <div className="os-reels-header">
            <div>
              <p className="os-section-kicker">Watch Us</p>
              <h2 className="os-section-title">Behind every crunch.</h2>
            </div>
            <p className="os-reels-sub">
              Short stories from our kitchen, farms and the community that fuels
              us. New reels dropping soon.
            </p>
          </div>
          <div className="os-reels-scroll">
            <div className="os-reels-track">
              {reels.map((reel) => (
                <div key={reel.id} className="os-reel-card">
                  <div className="os-reel-placeholder">
                    {/* Video will be placed here — 9:16 */}
                    <div className="os-reel-overlay">
                      <div className="os-reel-play">
                        <Play size={28} strokeWidth={3} fill="currentColor" />
                      </div>
                      <span className="os-reel-coming">Coming Soon</span>
                    </div>
                    <div className="os-reel-grain" />
                  </div>
                  <p className="os-reel-label">{reel.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ CTA ══════════════ */}
      <section ref={ctaRef} className="os-cta">
        <div className="wave-divider wave-divider-top">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
            <path d="M0,50 C360,10 720,70 1080,30 C1260,10 1380,60 1440,40 L1440,0 L0,0 Z" fill="#fff8eb" />
          </svg>
        </div>
        <div className="os-cta-content">
          <p className="os-cta-kicker">
            <Sparkles size={14} strokeWidth={3} />
            Ready for better mornings?
          </p>
          <h2 className="os-cta-title">
            Taste the <span>revolution.</span>
          </h2>
          <p className="os-cta-body">
            Join thousands who swapped boring breakfasts for bold, clean crunch.
          </p>
          <Link href="/products" className="os-cta-btn">
            <span>Shop Now</span>
            <ArrowRight size={20} strokeWidth={3} />
          </Link>
        </div>
      </section>
    </div>
  );
}
