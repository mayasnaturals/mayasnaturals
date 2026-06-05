"use client";

import { useEffect, useRef } from "react";

export default function FloatingShapes() {
  const containerRef = useRef(null);

  const shapes = [
    {
      className: "shape-orange",
      size: "clamp(200px, 30vw, 450px)",
      top: "8%",
      left: "-8%",
    },
    {
      className: "shape-coral",
      size: "clamp(150px, 22vw, 350px)",
      top: "60%",
      right: "-5%",
    },
    {
      className: "shape-gold",
      size: "clamp(120px, 18vw, 280px)",
      bottom: "5%",
      left: "15%",
    },
    {
      className: "shape-violet",
      size: "clamp(180px, 25vw, 380px)",
      top: "15%",
      right: "10%",
    },
    {
      className: "shape-green",
      size: "clamp(100px, 15vw, 220px)",
      bottom: "20%",
      right: "25%",
    },
  ];

  return (
    <div className="floating-shapes-container" ref={containerRef}>
      {shapes.map((shape, i) => (
        <div
          key={i}
          className={`floating-shape ${shape.className}`}
          data-shape-index={i}
          style={{
            width: shape.size,
            height: shape.size,
            top: shape.top || "auto",
            bottom: shape.bottom || "auto",
            left: shape.left || "auto",
            right: shape.right || "auto",
          }}
        />
      ))}
    </div>
  );
}
