"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import confetti from "canvas-confetti";
import { ArrowRight } from "lucide-react";
import "./milestone-trail.css";

// # Share anchor coordinates between the HTML nodes and the measured SVG path.
const colors = ["#f25c2a", "#f5a623", "#ffc833", "#a7bf45", "#75b843"];
function anchor(index, count, mobile) {
  const last = index === count - 1;
  return {
    x: mobile ? 8 : index === 0 || last ? 50 : index % 2 === 0 ? 55 : 45,
    y: count === 1 ? 45 : 8 + (index * 78) / (count - 1),
  };
}

// # Inline food illustrations preserve the chunky outline style without extra assets or packages.
function FoodIcon({ index }) {
  const drawings = [
    <g key="pot"><path d="M5 10h14v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4zM2 12h3m14 0h3M4 7h16M9 4V2m6 2V2" /></g>,
    <g key="jar"><rect x="6" y="6" width="12" height="15" rx="3" /><path d="M7 3h10v3H7zM9 11h6m-6 4h6" /></g>,
    <g key="leaf"><path d="M20 3C8 2 2 8 5 15c3 7 15 5 15-12ZM6 18l7-7m-2 4 3 3 6-6" /></g>,
    <g key="puff"><path d="M8 5c1-4 7-3 8 0 5-1 7 5 4 8 2 5-3 9-7 6-4 4-9 0-8-4C0 13 2 6 8 5Z" /><path d="m9 11 2 2 4-4" /></g>,
    <g key="bowl"><path d="M3 12h18a9 9 0 0 1-18 0Zm5 8h8M8 8c-3-2 3-3 0-5m5 5c-3-2 3-3 0-5m5 5c-3-2 3-3 0-5" /></g>,
  ];
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{drawings[index % drawings.length]}</svg>;
}

// # Separate placement, jump, and idle wrappers prevent competing transforms on the mascot.
function JarMascot() {
  return (
    <div className="os-trail-mascot" aria-hidden="true">
      <div className="os-trail-mascot-jump"><div className="os-trail-mascot-idle">
        <svg viewBox="0 0 48 52" fill="none">
          <g stroke="#29180e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m17 41-3 7h-5m22-7 3 7h5" />
            <rect x="10" y="11" width="28" height="31" rx="8" fill="#fffdf8" />
            <path d="M12 7h24v8H12z" fill="#f25c2a" />
            <path d="M11 24h26v12H11z" fill="#ffc833" />
            <path d="M19 30h.1m10-.1h.1M21 34q3 3 6 0" />
            <path d="m9 25-5 3m35-3 5 3" />
          </g>
        </svg>
      </div></div>
    </div>
  );
}

// # Decorative notes stay in the empty outer gutters, away from milestone copy.
function Doodle({ className, note, puff = false }) {
  return <div className={`os-trail-doodle ${className}`} aria-hidden="true">
    <div className="os-trail-doodle-drift">
      <svg viewBox="0 0 80 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {note ? <path d="M8 8q52-8 48 41m-9-9 9 10 9-10" /> : puff ? <path d="M30 19c-6-17 20-19 21-4 19-5 22 21 7 24 4 20-24 21-28 7-18 4-22-24 0-27ZM35 30h1m11 0h1m-11 9q5 5 9 0" /> : <path d="m35 7 6 17 17 6-17 6-6 17-6-17-17-6 17-6ZM65 3v12m-6-6h12M9 46q10-8 0-16m7 21q10-8 0-16" />}
      </svg>
      {note && <span>{note}</span>}
    </div>
  </div>;
}

export default function MilestoneTrail({ events }) {
  const containerRef = useRef(null);
  const celebratedRef = useRef(false);

  useEffect(() => {
    if (!events.length) return;
    gsap.registerPlugin(ScrollTrigger);
    const root = containerRef.current;
    const media = gsap.matchMedia();

    // # Rebuild only this timeline when its breakpoint or motion preference changes.
    media.add({ mobile: "(max-width: 767px)", desktop: "(min-width: 768px)", reduced: "(prefers-reduced-motion: reduce)" }, (context) => {
      const { mobile, reduced } = context.conditions;
      const svg = root.querySelector(".os-trail-svg");
      const path = root.querySelector(".os-trail-path");
      const track = root.querySelector(".os-trail-track");
      const mascot = root.querySelector(".os-trail-mascot");
      const jump = root.querySelector(".os-trail-mascot-jump");
      const nodes = [...root.querySelectorAll(".os-trail-node-container")];
      const counter = root.querySelector(".os-trail-counter");
      const progress = { value: 0 };
      let length = 0;
      let thresholds = [];
      let disposed = false;
      let refreshFrame;
      let burst;
      const canvas = root.querySelector(".os-trail-confetti");
      const reached = new Set();
      // # Reuse transform setters instead of allocating a GSAP tween on every scroll frame.
      gsap.set(mascot, { x: 0, y: 0, rotation: 0 });
      const setX = gsap.quickSetter(mascot, "x", "px");
      const setY = gsap.quickSetter(mascot, "y", "px");
      const setRotation = gsap.quickSetter(mascot, "rotation", "deg");

      // # Named context callbacks capture tweens created later by scroll events for cleanup.
      context.add("activate", (index, celebrate = true) => {
        const node = nodes[index];
        if (!reached.has(index)) {
          reached.add(index);
          node.classList.add("is-reached");
          gsap.to(node.querySelector(".os-trail-badge-fill"), { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)" });
          gsap.to(node.querySelector(".os-trail-card-reveal"), { x: 0, opacity: 1, rotation: 0, duration: 0.6, ease: "power3.out" });
          gsap.to(node.querySelector(".os-trail-shadow"), { opacity: 1, x: 6, y: 6, duration: 0.45 });
          gsap.fromTo(node.querySelector(".os-trail-ripple"), { scale: 0.7, opacity: 0.65 }, { scale: 2, opacity: 0, duration: 0.7 });
          if (celebrate) gsap.fromTo(jump, { y: 0, rotation: 0 }, { keyframes: [{ y: -25, rotation: 180, duration: 0.23 }, { y: 0, rotation: 360, duration: 0.3 }], overwrite: true });
        }

        // # A ref survives breakpoint rebuilds and Strict Mode replay, limiting the payoff to this visit.
        if (index === nodes.length - 1 && !celebratedRef.current && celebrate) {
          celebratedRef.current = true;
          const total = { value: 0 };
          gsap.to(total, { value: 10000, duration: 2, ease: "power2.out", onUpdate: () => {
            if (counter) counter.textContent = Math.round(total.value).toLocaleString("en-IN");
          } });
          const rect = node.querySelector(".os-trail-badge").getBoundingClientRect();
          if (rect.bottom > 0 && rect.top < window.innerHeight) {
            burst = confetti.create(canvas, { resize: true, disableForReducedMotion: true });
            burst({ particleCount: 85, spread: 75, startVelocity: 28, gravity: 0.9, ticks: 180, colors: ["#f25c2a", "#ffc833", "#75b843", "#fff8eb"], origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: (rect.top + rect.height / 2) / window.innerHeight } });
          }
        }
      });

      // # Measure in pixels so mascot rotation and path lengths survive non-square resizing.
      const measure = () => {
        const width = root.clientWidth;
        const height = root.clientHeight;
        const points = nodes.map((_, i) => {
          const point = anchor(i, nodes.length, mobile);
          return { x: width * point.x / 100, y: height * point.y / 100 };
        });
        let d = `M ${points[0].x} ${points[0].y}`;
        points.slice(1).forEach((point, i) => {
          const previous = points[i];
          const middle = (previous.y + point.y) / 2;
          d += mobile
            ? ` C ${previous.x + 30} ${middle - 20}, ${point.x - 15} ${middle + 20}, ${point.x} ${point.y}`
            : ` C ${previous.x} ${middle}, ${point.x} ${middle}, ${point.x} ${point.y}`;
        });
        svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
        path.setAttribute("d", d);
        track.setAttribute("d", d);
        length = path.getTotalLength();
        // # Binary-search the monotonic Y coordinate to activate nodes exactly as the stroke arrives.
        thresholds = points.map((point, i) => {
          if (i === 0) return 0;
          if (i === points.length - 1) return 1;
          let low = 0;
          let high = length;
          for (let j = 0; j < 24; j++) {
            const middle = (low + high) / 2;
            if (path.getPointAtLength(middle).y < point.y) low = middle;
            else high = middle;
          }
          return (low + high) / (2 * length);
        });
        path.style.strokeDasharray = reduced ? "none" : `${length} ${length}`;
      };

      context.add("sync", () => {
        const value = progress.value;
        path.style.strokeDashoffset = reduced ? "0" : `${length * (1 - value)}`;
        const point = path.getPointAtLength(value * length);
        const before = path.getPointAtLength(Math.max(0, value * length - 2));
        const after = path.getPointAtLength(Math.min(length, value * length + 2));
        const rotation = Math.atan2(after.y - before.y, after.x - before.x) * 180 / Math.PI - 90;
        setX(point.x);
        setY(point.y);
        setRotation(rotation);
        if (value > 0) nodes.forEach((_, i) => {
          if (value + 0.0001 >= thresholds[i]) context.activate(i);
        });
      });

      measure();
      if (!reduced) {
        root.classList.add("is-animated");
        nodes.forEach((node, i) => {
          gsap.set(node.querySelector(".os-trail-badge-fill"), { scale: 0, opacity: 0 });
          gsap.set(node.querySelector(".os-trail-card-reveal"), { x: mobile || i % 2 ? 60 : -60, opacity: 0, rotation: i % 2 ? 5 : -5 });
          gsap.set(node.querySelector(".os-trail-shadow"), { opacity: 0, x: 0, y: 0 });
        });
        context.sync();
        // # Explicit endpoints keep font and resize refreshes from recapturing a partial start value.
        gsap.fromTo(progress, { value: 0 }, { value: 1, ease: "none", onUpdate: context.sync, scrollTrigger: {
          trigger: root, start: "top 65%", end: "bottom 65%", scrub: 0.6, invalidateOnRefresh: true,
        } });
        gsap.to(root.querySelector(".os-trail-mascot-idle"), { y: -3, scaleX: 1.04, scaleY: 0.96, duration: 0.65, yoyo: true, repeat: -1, ease: "sine.inOut" });
        root.querySelectorAll(".os-trail-doodle").forEach((doodle) => {
          gsap.from(doodle, { opacity: 0, y: 12, duration: 0.8, scrollTrigger: { trigger: doodle, start: "top 90%", once: true } });
        });
      }

      // # Keyboard navigation reveals a focused card even before the scroll-driven line arrives.
      const focusHandlers = nodes.map((node, index) => {
        const handler = () => { if (!reduced) context.activate(index, false); };
        node.addEventListener("focusin", handler);
        return handler;
      });

      // # Coalesce geometry, font, and image updates; remove every observer and callback on cleanup.
      const refresh = () => {
        if (disposed) return;
        cancelAnimationFrame(refreshFrame);
        refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
      };
      const onRefresh = () => { measure(); if (!reduced) context.sync(); };
      ScrollTrigger.addEventListener("refreshInit", onRefresh);
      const observer = new ResizeObserver(refresh);
      observer.observe(root);
      document.fonts?.ready.then(refresh);
      window.addEventListener("load", refresh);
      const images = [...document.images].filter((image) => !image.complete);
      images.forEach((image) => image.addEventListener("load", refresh));
      refresh();

      return () => {
        disposed = true;
        cancelAnimationFrame(refreshFrame);
        observer.disconnect();
        ScrollTrigger.removeEventListener("refreshInit", onRefresh);
        window.removeEventListener("load", refresh);
        images.forEach((image) => image.removeEventListener("load", refresh));
        nodes.forEach((node, index) => node.removeEventListener("focusin", focusHandlers[index]));
        burst?.reset();
        root.classList.remove("is-animated");
        nodes.forEach((node) => node.classList.remove("is-reached"));
        if (counter) counter.textContent = "10,000";
        path.style.strokeDasharray = "none";
        path.style.strokeDashoffset = "0";
      };
    }, root);
    return () => media.revert();
  }, [events]);

  return (
    <div className="os-trail" ref={containerRef}>
      {/* # The pale track remains visible ahead of the single scroll-driven foreground stroke. */}
      <svg className="os-trail-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path className="os-trail-track" d="M50 8V86" />
        <path className="os-trail-path" d="M50 8V86" />
      </svg>
      <JarMascot />
      <Doodle className="doodle-one" note="this is where it got real" />
      <Doodle className="doodle-two" />
      <Doodle className="doodle-three" note="no turning back" />
      <Doodle className="doodle-four" puff />

      {/* # Chronological reading order stays stable; counter updates remain silent to screen readers. */}
      <ol className="os-trail-nodes" aria-label="Maya's milestones">
        {events.map((event, index) => {
          const desktop = anchor(index, events.length, false);
          const mobile = anchor(index, events.length, true);
          const last = index === events.length - 1;
          return <li key={event.year} className={`os-trail-node-container card-${index % 2 ? "right" : "left"}-desk ${last ? "is-final" : ""}`} style={{ "--x-desk": `${desktop.x}%`, "--y-desk": `${desktop.y}%`, "--x-mob": `${mobile.x}%`, "--y-mob": `${mobile.y}%`, "--node-color": colors[Math.min(index, colors.length - 1)], "--tilt": index % 2 ? "-1.5deg" : "1.5deg" }}>
            <div className="os-trail-badge" aria-hidden="true">
              <span className="os-trail-ripple" />
              <div className="os-trail-badge-fill"><FoodIcon index={index} /></div>
              <div className="os-trail-badge-outline"><FoodIcon index={index} /></div>
            </div>
            <div className="os-trail-card">
              <div className="os-trail-card-reveal">
                <div className="os-trail-card-content" tabIndex={0}>
                  <span className="os-trail-shadow" aria-hidden="true" />
                  <span className="os-trail-card-year">{event.year}</span>
                  <h3>{last && event.year === "2026" ? <><span className="sr-only">{event.title}</span><span aria-hidden="true"><span className="os-trail-counter">10,000</span>+ Happy Bowls</span></> : event.title}</h3>
                  <p>{event.desc}</p>
                </div>
                {last && <Link href="/products" className="os-trail-cta">Be bowl #10,001 <ArrowRight size={18} aria-hidden="true" /></Link>}
              </div>
            </div>
          </li>;
        })}
      </ol>
      <canvas className="os-trail-confetti" aria-hidden="true" />
    </div>
  );
}
