import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "../../products/products.module.css";

function ComboCard({ index }) {
    const cardStyle = {
        "--card-dark": "#3c2a21",
        "--card-mid": "#ffc833", // vibrant yellow
        "--card-light": "#fff9ed",
    };

    return (
        <motion.article
            layout
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.42, delay: Math.min(index * 0.045, 0.2) }}
            className={styles.productCard}
            style={cardStyle}
        >
            <Link
                href="/products/combo-builder"
                className={styles.productVisual}
                aria-label="Build your own Makhana combo"
            >
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--card-mid)', color: 'var(--card-dark)', padding: '20px', textAlign: 'center' }}>
                     <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1 }}>Make Your Own</h2>
                     <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 900, textTransform: 'uppercase', color: '#fff' }}>Combo</h3>
                     <div style={{ marginTop: '20px' }}>
                         <Image src="/products/Makhana - Peri Peri.png" width={100} height={100} alt="Makhana" style={{ filter: 'drop-shadow(4px 4px 0px rgba(0,0,0,0.2))', transform: 'rotate(-10deg) translateX(10px)' }} />
                     </div>
                </div>
                <div className={styles.imageShade} />
                <span className={styles.productBadge}>Fun</span>
            </Link>

            <div className={styles.productBody}>
                <div className={styles.productMeta}>
                    <span>Makhana</span>
                    <span>•</span>
                    <span>Custom</span>
                </div>
                <h3>
                    <Link href="/products/combo-builder" style={{ textTransform: "capitalize" }}>
                        Pick your favorites
                    </Link>
                </h3>

                <p style={{ minHeight: '58px', marginTop: '10px', color: '#776153', fontSize: '0.78rem', lineHeight: 1.55 }}>
                    Mix and match your favorite flavors in packs of 2, 4, 6 or 8. Get exactly what you crave!
                </p>

                <div className={styles.productBottom}>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--card-dark)' }}>Build yours now</span>
                    </div>
                    <Link
                        href="/products/combo-builder"
                        className={styles.addButton}
                        style={{ textDecoration: 'none' }}
                        aria-label={`Go to combo builder`}
                    >
                        <ArrowRight size={19} />
                    </Link>
                </div>
            </div>
        </motion.article>
    );
}

export default ComboCard;
