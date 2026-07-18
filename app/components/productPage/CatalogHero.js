import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

import styles from "../../products/products.module.css";

const headingWords = ["Big", "flavour.", "Better", "snacking."];
const tickerItems = [
  "Plant-powered",
  "Small batch",
  "Big crunch",
  "No boring bites",
];

import Image from "next/image";

export default function CatalogHero() {
  return (
    <section className={styles.hero}>
      <Image
        src="/images/snack_hero_background.png"
        alt="Premium crunchy muesli and makhana background"
        fill
        priority
        style={{ objectFit: "cover", objectPosition: "center", zIndex: 0, }}
      />
      {/* <div className={styles.heroImageOverlay} /> */}
      <div className={styles.heroInner}>
        {/* <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={styles.heroKicker}
        >
          <Sparkles size={17} fill="currentColor" />
          The Maya snack shop
        </motion.div> */}
        {/* <h1 className={styles.heroTitle}>
          {headingWords.map((word, index) => (
            <motion.span
              key={word}
              initial={{ y: "110%", rotate: 2 }}
              animate={{ y: 0, rotate: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.12 + index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={index === 1 || index === 3 ? styles.accentWord : ""}
            >
              {word}
            </motion.span>
          ))}
        </h1> */}
        {/* <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.58 }}
        >
          Breakfast that wakes up before you do. Snacks that bring their own
          personality.
        </motion.p>
        <motion.a
          href="#shop-grid"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.7 }}
          className={styles.heroLink}
        >
          Shop all flavours <ArrowRight size={18} />
        </motion.a> */}
      </div>
      {/* <div className={styles.heroTicker}>
        <div>
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <span key={`${item}-${index}`}>
              {item}
              <i>•</i>
            </span>
          ))}
        </div>
      </div> */}
    </section>
  );
}
