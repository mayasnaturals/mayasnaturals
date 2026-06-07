"use client";

export default function MarqueeBanner({
  text = "FUEL YOUR MORNINGS",
  bgColor = "#E8752A",
  textColor = "#FFF8F0",
  speed = 25,
  tilt = 0,
  fontSize = "1rem",
}) {
  const repeatedText = Array(8).fill(text);

  return (
    <div
      className="marquee-banner"
      style={{
        backgroundColor: bgColor,
        color: textColor,
        padding: "0.8rem 0",
        transform: tilt ? `rotate(${tilt}deg) scale(1.05)` : undefined,
        transformOrigin: "center center",
        fontSize,
      }}
    >
      <div
        className="marquee-track"
        style={{ "--marquee-speed": `${speed}s` }}
      >
        {repeatedText.map((t, i) => (
          <span key={i} className="marquee-text">
            {t}
            <span className="dot" />
          </span>
        ))}
        {repeatedText.map((t, i) => (
          <span key={`dup-${i}`} className="marquee-text">
            {t}
            <span className="dot" />
          </span>
        ))}
      </div>
    </div>
  );
}
