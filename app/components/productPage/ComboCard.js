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
                <Image
                    src="/combo.png"
                    alt="Make Your Own Combo"
                    fill
                    style={{ objectFit: 'cover' }}
                />
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
                        Make your own combo
                    </Link>
                </h3>

                <p style={{ minHeight: '58px', marginTop: '10px', color: '#776153', fontSize: '0.78rem', lineHeight: 1.55 }}>
                    Mix and match your favorite flavors in packs of 2, 4, or 6. Get exactly what you crave!
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
