"use client";

import { useCallback, forwardRef, useImperativeHandle, useRef, useEffect } from "react";

const HeroCanvas = forwardRef(function HeroCanvas({ images, totalFrames }, ref) {
  const canvasRef = useRef(null);
  const currentFrameRef = useRef(0);
  const dimensionsRef = useRef({ w: 0, h: 0, dpr: 1 });

  useImperativeHandle(ref, () => ({
    renderFrame: (frameIndex) => {
      currentFrameRef.current = frameIndex;
      drawFrame(frameIndex);
    },
    getCanvas: () => canvasRef.current,
  }));

  const drawFrame = useCallback(
    (index) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;

      const frameImages = images.current;
      if (!frameImages || !frameImages[index]) return;

      const img = frameImages[index];
      const iw = img.naturalWidth || img.width;
      const ih = img.naturalHeight || img.height;
      if (!iw || !ih) return;

      // Use full canvas pixel dimensions (no ctx.scale — we draw in device pixels)
      const cw = canvas.width;
      const ch = canvas.height;

      // Cover-fit: scale image to cover the entire canvas
      const scale = Math.max(cw / iw, ch / ih);
      const sw = iw * scale;
      const sh = ih * scale;
      const sx = (cw - sw) / 2;
      const sy = (ch - sh) / 2;

      // Use high-quality image rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, sx, sy, sw, sh);
    },
    [images]
  );

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();

    // Set canvas buffer to match display size × DPR for crisp rendering
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    dimensionsRef.current = { w: rect.width, h: rect.height, dpr };

    // NO ctx.scale — we draw directly in device pixel coordinates
    // The CSS width/height (100%) handles display sizing

    drawFrame(currentFrameRef.current);
  }, [drawFrame]);

  useEffect(() => {
    resizeCanvas();

    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 100);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [resizeCanvas]);

  // Redraw when images become available
  useEffect(() => {
    if (images.current && images.current[0]) {
      resizeCanvas();
    }
  }, [images, resizeCanvas]);

  return (
    <canvas
      ref={canvasRef}
      className="hero-canvas"
      id="hero-canvas"
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
      }}
    />
  );
});

export default HeroCanvas;
