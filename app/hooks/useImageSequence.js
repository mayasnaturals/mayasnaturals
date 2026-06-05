"use client";

import { useRef, useState, useCallback } from "react";

const TOTAL_FRAMES = 300;
const CONCURRENT_LOADS = 20;

function getFramePath(index) {
  const num = String(index + 1).padStart(3, "0");
  return `/frames/ezgif-frame-${num}.jpg`;
}

export default function useImageSequence() {
  const imagesRef = useRef([]);
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const loadingRef = useRef(false);
  const abortRef = useRef(false);

  const preload = useCallback(() => {
    // If already loading or loaded, return early
    if (loadingRef.current) return Promise.resolve(imagesRef.current);
    loadingRef.current = true;
    abortRef.current = false;

    const images = new Array(TOTAL_FRAMES);
    imagesRef.current = images;
    let loadedCount = 0;
    let nextIndex = 0;

    return new Promise((resolve) => {
      function onFrameComplete(idx, img) {
        if (abortRef.current) return;

        if (img) images[idx] = img;
        loadedCount++;

        const pct = Math.round((loadedCount / TOTAL_FRAMES) * 100);
        setProgress(pct);

        if (loadedCount >= TOTAL_FRAMES) {
          setIsLoaded(true);
          resolve(images);
          return;
        }

        // Load next in queue
        if (nextIndex < TOTAL_FRAMES) {
          loadFrame(nextIndex++);
        }
      }

      function loadFrame(idx) {
        if (abortRef.current) return;

        const img = new Image();
        img.onload = function () {
          onFrameComplete(idx, img);
        };
        img.onerror = function () {
          onFrameComplete(idx, null);
        };
        img.src = getFramePath(idx);
      }

      // Start initial batch
      const batchSize = Math.min(CONCURRENT_LOADS, TOTAL_FRAMES);
      for (let i = 0; i < batchSize; i++) {
        loadFrame(nextIndex++);
      }
    });
  }, []);

  // Allow cleanup/reset for strict mode
  const cleanup = useCallback(() => {
    abortRef.current = true;
    loadingRef.current = false;
  }, []);

  return {
    images: imagesRef,
    progress,
    isLoaded,
    preload,
    cleanup,
    totalFrames: TOTAL_FRAMES,
  };
}
