"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flag, Trophy, Star, Medal, Sparkles } from "lucide-react";
import "./milestone-trail.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function generateDesktopPath(numEvents) {
  if (numEvents < 2) return "";
  const startY = 5;
  const endY = 95;
  const step = (endY - startY) / (numEvents - 1);
  
  let d = `M 50 ${startY}`;
  
  for (let i = 1; i < numEvents; i++) {
    const prevY = startY + (i - 1) * step;
    const currY = startY + i * step;
    const midY = (prevY + currY) / 2;
    
    let currX = (i % 2 === 0) ? 55 : 45;
    if (i === numEvents - 1) currX = 50; // end at center
    
    let prevX = 50;
    if (i - 1 > 0 && i - 1 < numEvents - 1) {
      prevX = ((i - 1) % 2 === 0) ? 55 : 45;
    }
    
    d += ` C ${prevX} ${midY}, ${currX} ${midY}, ${currX} ${currY}`;
  }
  return d;
}

function generateMobilePath(numEvents) {
  if (numEvents < 2) return "";
  const startY = 2;
  const endY = 98;
  const step = (endY - startY) / (numEvents - 1);
  
  let d = `M 15 ${startY}`;
  
  for (let i = 1; i < numEvents; i++) {
    const prevY = startY + (i - 1) * step;
    const currY = startY + i * step;
    const midY = (prevY + currY) / 2;
    const waveX = 25; 
    
    d += ` C 15 ${midY - step * 0.1}, ${waveX} ${midY}, 15 ${currY}`;
  }
  return d;
}

export default function MilestoneTrail({ events }) {
  const containerRef = useRef(null);
  const deskPathRef = useRef(null);
  const mobPathRef = useRef(null);

  const getIcon = (index, isLast) => {
    if (index === 0) return <Flag size={20} strokeWidth={2.5} />;
    if (isLast) return <Sparkles size={20} strokeWidth={2.5} />;
    const icons = [
      <Star size={20} strokeWidth={2.5} />, 
      <Trophy size={20} strokeWidth={2.5} />, 
      <Medal size={20} strokeWidth={2.5} />
    ];
    return icons[(index - 1) % icons.length];
  };

  const getColors = (index) => {
    const palette = ["#f25c2a", "#ffc833", "#75b843", "#ffc833"];
    return palette[index % palette.length];
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate SVG paths
      const paths = [deskPathRef.current, mobPathRef.current];
      paths.forEach(path => {
        if (!path) return;
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        
        gsap.to(path, {
          strokeDashoffset: 0,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
            end: "bottom 85%",
            scrub: 1,
          }
        });
      });

      // Animate nodes popping in
      const nodes = gsap.utils.toArray(".os-trail-node-container");
      nodes.forEach((node, i) => {
        gsap.from(node, {
          scrollTrigger: {
            trigger: node,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          scale: 0,
          opacity: 0,
          duration: 0.6,
          ease: "back.out(1.6)",
          delay: 0.05
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="os-trail" ref={containerRef}>
      {/* SVG Background Layer */}
      <svg className="os-trail-svg" preserveAspectRatio="none" viewBox="0 0 100 100">
         <path 
           ref={deskPathRef}
           className="os-trail-path-desktop"
           d={generateDesktopPath(events.length)}
           fill="none" 
           stroke="#ffc833" 
           strokeWidth="0.8"
           strokeDasharray="1.5 1.5"
           strokeLinecap="round"
         />
         <path 
           ref={mobPathRef}
           className="os-trail-path-mobile"
           d={generateMobilePath(events.length)}
           fill="none" 
           stroke="#ffc833" 
           strokeWidth="1.2"
           strokeDasharray="1.5 1.5"
           strokeLinecap="round"
         />
      </svg>
      
      {/* HTML Nodes Layer */}
      <div className="os-trail-nodes">
        {events.map((ev, i) => {
          const numEvents = events.length;
          const isLast = i === numEvents - 1;
          
          const stepDesktop = 90 / (numEvents - 1);
          const yDesk = 5 + i * stepDesktop;
          
          // Nodes gently oscillate between 45% and 55%
          let xDesk = (i % 2 === 0) ? 55 : 45;
          if (i === 0 || isLast) xDesk = 50; 
          
          const stepMobile = 96 / (numEvents - 1);
          const yMob = 2 + i * stepMobile;
          const xMob = 15;
          
          // Cards alternate sides perfectly
          const cardPosDesk = (i % 2 === 0) ? 'left' : 'right';
          const cardPosMob = 'right';

          return (
            <div 
              key={i} 
              className={`os-trail-node-container card-${cardPosDesk}-desk card-${cardPosMob}-mob`}
              style={{
                '--x-desk': `${xDesk}%`,
                '--y-desk': `${yDesk}%`,
                '--x-mob': `${xMob}%`,
                '--y-mob': `${yMob}%`,
              }}
            >
              <div 
                className={`os-trail-badge ${isLast ? 'os-trail-badge-active' : ''}`}
                style={{ backgroundColor: getColors(i) }}
              >
                {getIcon(i, isLast)}
              </div>
              
              <div className="os-trail-card">
                 <div className="os-trail-card-stem"></div>
                 <div className="os-trail-card-content">
                   <span className="os-trail-card-year">{ev.year}</span>
                   <h3>{ev.title}</h3>
                 </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
