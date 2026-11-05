"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Volume2, VolumeX } from "lucide-react";
import { createFireworkAudio } from "./diwaliFireworkAudio";
import styles from "./DiwaliFireworks.module.css";

const SESSION_KEY = "maya-diwali-fireworks-seen";
// # Fall back to once per page lifetime if the browser blocks session storage.
let hasPlayedWithoutStorage = false;

const ROCKETS = [
  { left: "17%", top: "24%", delay: 0, color: "#ffbd32" },
  { left: "82%", top: "38%", delay: 450, color: "#ff698f" },
  { left: "46%", top: "18%", delay: 1050, color: "#f5a623" },
  { left: "24%", top: "57%", delay: 1750, color: "#f88037" },
  { left: "73%", top: "65%", delay: 2300, color: "#e5a5ff" },
  { left: "89%", top: "18%", delay: 2750, color: "#ffdf78" },
  { left: "51%", top: "43%", delay: 3100, color: "#ff698f" },
  { left: "10%", top: "72%", delay: 3500, color: "#ffc34d" },
];

// # Shared timing drives the visuals, sound cues, and final completion callback.
const FLIGHT_MS = 1100;
const BURST_MS = 2100;

// # Fixed radial trajectories avoid random hydration differences. Alternating
// # distances make each burst resemble sparks rather than a solid circle.
const SPARKS = Array.from({ length: 44 }, (_, index) => {
  const angle = (index / 44) * Math.PI * 2;
  const distance = index % 2 === 0 ? 1 : 0.62;

  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    angle: `${(angle * 180) / Math.PI + 90}deg`,
  };
});

export default function DiwaliFireworks({ onComplete }) {
  const pathname = usePathname();
  const [isPlaying, setIsPlaying] = useState(false);
  const [rockets, setRockets] = useState(ROCKETS);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioRef = useRef(null);
  const isSpecialPage =
    pathname?.startsWith("/partner-portal") ||
    pathname?.startsWith("/admin-s3cr3t-p4n3l-8891");

  useEffect(() => {
    setIsPlaying(false);

    if (
      isSpecialPage ||
      hasPlayedWithoutStorage ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      onComplete();
      return;
    }

    // # Session storage survives refreshes and client navigation in this tab.
    // # Do not mark it until the delayed start actually runs: React development
    // # mode may mount, clean up, and remount the effect before that point.
    try {
      if (window.sessionStorage.getItem(SESSION_KEY)) {
        onComplete();
        return;
      }
    } catch {
      // # The in-memory guard above covers browsers with blocked storage.
    }

    const timers = [];
    // # Choose the launch count from the viewport before calculating completion.
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const visibleRockets = isMobile ? ROCKETS.slice(0, 5) : ROCKETS;
    // # Freeze the launch count for this playback so resizing cannot introduce
    // # extra rockets after its completion time has already been calculated.
    setRockets(visibleRockets);
    const duration = visibleRockets.at(-1).delay + FLIGHT_MS + BURST_MS + 200;
    const startTimer = window.setTimeout(() => {
      try {
        window.sessionStorage.setItem(SESSION_KEY, "true");
      } catch {
        // # The animation still works when privacy settings disable storage.
      }

      hasPlayedWithoutStorage = true;
      setIsPlaying(true);

      // # Timed cues read the current audio controller, allowing sound to be
      // # enabled midway through the celebration without restarting the show.
      visibleRockets.forEach((rocket) => {
        timers.push(
          window.setTimeout(() => audioRef.current?.playLaunch(), rocket.delay),
          window.setTimeout(
            () => audioRef.current?.playBurst(),
            rocket.delay + FLIGHT_MS,
          ),
        );
      });

      // # Remove all animated elements after the last burst has faded.
      timers.push(
        window.setTimeout(() => {
          setIsPlaying(false);
          audioRef.current?.close();
          audioRef.current = null;
          onComplete();
        }, duration),
      );
    }, 180);

    return () => {
      window.clearTimeout(startTimer);
      timers.forEach((timer) => window.clearTimeout(timer));
      audioRef.current?.close();
      audioRef.current = null;
    };
  }, [isSpecialPage, onComplete]);

  // # Browsers require a gesture to unlock audio. This small control provides
  // # that gesture and a mute option without interrupting the opening sequence.
  const toggleSound = async () => {
    try {
      if (!audioRef.current) audioRef.current = createFireworkAudio();
      const audio = audioRef.current;
      if (!audio) return;

      const enable = !soundEnabled;
      audio.setMuted(!enable);
      await audio.resume();
      // # The show may have finished while the browser was unlocking audio.
      if (audioRef.current !== audio) return;
      setSoundEnabled(enable);
    } catch {
      // # Unsupported or denied audio must never interrupt visuals or the popup.
      setSoundEnabled(false);
    }
  };

  if (!isPlaying || isSpecialPage) return null;

  return (
    <div className={styles.overlay}>
      {rockets.map((rocket) => (
        <div
          key={rocket.left}
          className={styles.firework}
          aria-hidden="true"
          style={{
            left: rocket.left,
            top: rocket.top,
            "--launch-delay": `${rocket.delay}ms`,
            "--burst-delay": `${rocket.delay + FLIGHT_MS}ms`,
            "--flight-duration": `${FLIGHT_MS}ms`,
            "--burst-duration": `${BURST_MS}ms`,
            "--spark-color": rocket.color,
          }}
        >
          <span className={styles.rocket} />
          <span className={styles.burstGlow} />
          {SPARKS.map((spark, sparkIndex) => (
            <span
              key={sparkIndex}
              className={styles.spark}
              style={{
                "--spark-x": spark.x,
                "--spark-y": spark.y,
                "--spark-angle": spark.angle,
              }}
            />
          ))}
        </div>
      ))}
      <button
        type="button"
        className={styles.soundToggle}
        onClick={toggleSound}
        aria-pressed={soundEnabled}
      >
        {soundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
        {soundEnabled ? "Mute fireworks" : "Enable sound"}
      </button>
    </div>
  );
}
