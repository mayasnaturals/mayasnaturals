import { ArrowUpRight, ShoppingBag } from "lucide-react";
import styles from "./AmazonSection.module.css";

// # Keep this announcement server-rendered: the storefront only needs a standard external link.
export default function AmazonSection() {
  return (
    <section className={styles.section} aria-labelledby="amazon-heading">
      <div className={styles.panel}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>
            <span className={styles.dot} aria-hidden="true" />
            A new way to shop Maya&apos;s
          </p>
          <h2 id="amazon-heading" className={styles.heading}>
            Your favourites.
            <br />
            <span>Now on Amazon.</span>
          </h2>
          <p className={styles.description}>
            Same wholesome goodness, one more place to find it. Shop Maya&apos;s
            Naturals on Amazon and stock up on your favourites.
          </p>
        </div>

        {/* # Use the supplied seller storefront and announce that it opens in a new tab. */}
        <div className={styles.destination}>
          <div className={styles.bag} aria-hidden="true">
            <ShoppingBag size={36} strokeWidth={1.5} />
          </div>
          <span className={styles.store}>Meet us on amazon.in</span>
          <a
            className={styles.button}
            href="https://www.amazon.in/storefront?me=A2XGQBPOWJRE6W&ref_=ssf_share"
            target="_blank"
            rel="noopener noreferrer"
          >
            Shop on Amazon
            <ArrowUpRight size={22} strokeWidth={2.5} aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </div>
    </section>
  );
}
