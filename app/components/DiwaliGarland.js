import { useId } from "react";
import styles from "./DiwaliGarland.module.css";

// # The cord starts at the header's top and dips below its bottom in the middle.
// # These attachment heights follow y = 2 + 632t(1-t), divided by the 160-unit
// # viewBox height. Separate lamps retain their proportions as the cord stretches.
const hangingDiyas = [
  { left: "8%", top: "30.32%", length: "20px", delay: "-1.2s" },
  { left: "22%", top: "69.03%", length: "28px", delay: "-3.4s" },
  { left: "36%", top: "92.26%", length: "22px", delay: "-0.7s" },
  { left: "50%", top: "100%", length: "32px", delay: "-2.6s" },
  { left: "64%", top: "92.26%", length: "22px", delay: "-4.1s" },
  { left: "78%", top: "69.03%", length: "28px", delay: "-1.9s" },
  { left: "92%", top: "30.32%", length: "20px", delay: "-3.1s" },
];

// # Original vector artwork: an earthen bowl, painted gold petals, an oil rim,
// # and a warm flame. Unique gradient IDs avoid collisions between repeated SVGs.
function Diya() {
  const id = useId();

  return (
    <svg viewBox="0 0 80 72" className={styles.diya} focusable="false">
      <defs>
        <linearGradient id={`${id}-clay`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bd392b" />
          <stop offset="55%" stopColor="#8e1926" />
          <stop offset="100%" stopColor="#510d22" />
        </linearGradient>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff8d6" />
          <stop offset="100%" stopColor="#ffc547" />
        </linearGradient>
        <linearGradient id={`${id}-fire`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#ec6b08" />
          <stop offset="55%" stopColor="#ffb512" />
          <stop offset="100%" stopColor="#fff4b4" />
        </linearGradient>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0%" stopColor="#ffc34d" stopOpacity="0.24" />
          <stop offset="100%" stopColor="#ffc34d" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="40" cy="26" r="26" fill={`url(#${id}-glow)`} />
      <g className={styles.flame}>
        <path
          d="M40 41C25 35 31 23 40 8c-1 12 16 21 7 30-2 2-4 3-7 3Z"
          fill={`url(#${id}-fire)`}
          stroke="#bf590b"
          strokeWidth="1.2"
        />
        <path
          d="M40 39c-6-3-4-9 1-15 0 6 6 10 2 14Z"
          fill="#fff8d7"
        />
      </g>

      <path
        d="M8 43Q40 50 72 43C68 59 56 68 40 68S12 59 8 43Z"
        fill={`url(#${id}-clay)`}
        stroke="#ffe5a0"
        strokeWidth="3"
      />
      <ellipse
        cx="40"
        cy="43"
        rx="32"
        ry="7"
        fill="#541526"
        stroke={`url(#${id}-gold)`}
        strokeWidth="3"
      />
      <ellipse cx="40" cy="43" rx="25" ry="3.5" fill="#ffbc35" />
      <path
        d="m40 43 1-6"
        stroke="#63311e"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* # Traditional painted scallops and dots stay readable at icon size. */}
      <g fill="none" stroke="#fff0ba" strokeWidth="1.8">
        <path d="M16 51q6 13 12 3 6 16 12 3 6 13 12-3 6 10 12-3" />
        <path d="M25 62q15 7 30 0" />
      </g>
      <g fill="#ffe6a0">
        <circle cx="22" cy="53" r="1.4" />
        <circle cx="34" cy="57" r="1.4" />
        <circle cx="46" cy="57" r="1.4" />
        <circle cx="58" cy="53" r="1.4" />
      </g>
    </svg>
  );
}

export default function DiwaliGarland() {
  return (
    // # Decorative only: the entire garland ignores clicks and screen readers.
    <div className={styles.garland} aria-hidden="true">
      <svg
        className={styles.cord}
        viewBox="0 0 1000 160"
        preserveAspectRatio="none"
        focusable="false"
      >
        <path
          d="M0 2Q500 318 1000 2"
          fill="none"
          stroke="#794015"
          strokeWidth="4"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M0 2Q500 318 1000 2"
          fill="none"
          stroke="#ffe6a5"
          strokeWidth="2"
          strokeDasharray="2 5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {hangingDiyas.map((diya, index) => (
        <div
          key={diya.left}
          className={`${styles.pendant} ${index % 2 === 0 ? styles.mobileHidden : ""}`}
          style={{
            left: diya.left,
            top: diya.top,
            "--thread-length": diya.length,
            "--sway-delay": diya.delay,
          }}
        >
          <span className={styles.thread} />
          <Diya />
        </div>
      ))}
    </div>
  );
}
