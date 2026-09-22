import { Check, ShoppingBag, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "../../products/products.module.css";
import { getMrp } from "@/lib/utils";


function ProductCard({ product, index, onAdd, isAdded }) {
    const variantQuery = product.variantId ? `?variant=${product.variantId.split('/').pop()}` : "";
    const productHref = `/products/${product.handle}${variantQuery}`;
    const cardStyle = {
        "--card-dark": product.colors[0],
        "--card-mid": product.colors[1],
        "--card-light": product.colors[2],
    };

    const mrp = getMrp(product.name, product.weight, product.price);
    const discountAmount = mrp ? mrp - product.price : 0;
    const discountPercent = mrp ? Math.round((discountAmount / mrp) * 100) : 0;

    const generateRating = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const seed = Math.abs(hash);
        return {
            averageRating: (4.4 + (seed % 60) / 100).toFixed(1),
            totalReviews: 120 + (seed % 500)
        };
    };

    const ratingData = generateRating(product.handle);

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
                href={productHref}
                className={styles.productVisual}
                aria-label={`View ${product.name} details`}
            >
                <Image
                    className={styles.productImage}
                    src={product.image}
                    alt={`${product.name} ${product.type} pack`}
                    fill
                    sizes="(max-width: 560px) calc(100vw - 32px), (max-width: 1200px) 50vw, 33vw"
                />
                <div className={styles.imageShade} />
            </Link>

            <div className={styles.productBody}>
                <div className={styles.productMeta}>
                    <span>{product.type}</span>
                    <span>•</span>
                    <span>{product.weight}</span>
                </div>
                <h3>
                    <Link href={productHref} style={{ textTransform: "capitalize" }}>
                        {product.name.toLowerCase()}
                    </Link>
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.2rem', marginBottom: '0.75rem', color: 'var(--accent-orange)' }}>
                    <Star size={14} fill="currentColor" />
                    <span style={{ fontWeight: '600', fontSize: '0.85rem', color: 'var(--text-dark)' }}>{ratingData.averageRating}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({ratingData.totalReviews})</span>
                </div>

                <div className={styles.productBottom}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', opacity: product.availableForSale ? 1 : 0.5 }}>
                            {mrp && <del className={styles.productMrp}>₹{mrp}</del>}
                            <strong>₹{product.price}</strong>
                        </div>
                        {mrp && discountAmount > 0 && product.availableForSale && (
                            <div className={styles.discountTag}>
                                Save ₹{discountAmount} ({discountPercent}%)
                            </div>
                        )}
                        <span style={{ opacity: product.availableForSale ? 1 : 0.5 }}>incl. taxes</span>
                    </div>
                    {product.availableForSale ? (
                        <button
                            className={`${styles.addButton} ${isAdded ? styles.addButtonDone : ""
                                }`}
                            onClick={() => onAdd(product.id)}
                            aria-label={`Add ${product.name} to bag`}
                        >
                            {isAdded ? <Check size={19} /> : <ShoppingBag size={19} />}
                            <span>{isAdded ? "Added" : "Quick add"}</span>
                        </button>
                    ) : product.hasOtherAvailableVariants ? (
                        <Link
                            href={productHref}
                            className={styles.addButton}
                            style={{ textDecoration: 'none' }}
                            aria-label={`View other sizes for ${product.name}`}
                        >
                            <span>Other sizes available</span>
                        </Link>
                    ) : (
                        <button
                            className={styles.addButton}
                            disabled
                            style={{ opacity: 0.6, cursor: 'not-allowed', backgroundColor: '#e0e0e0', color: '#666' }}
                        >
                            <span>Out of stock</span>
                        </button>
                    )}
                </div>
            </div>
        </motion.article>
    );
}

export default ProductCard;
