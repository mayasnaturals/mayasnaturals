import { Check, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "../../products/products.module.css";
import { getMrp } from "@/lib/utils";


function ProductCard({ product, index, onAdd, isAdded }) {
    const productHref = `/products/${product.handle}`;
    const cardStyle = {
        "--card-dark": product.colors[0],
        "--card-mid": product.colors[1],
        "--card-light": product.colors[2],
    };

    const mrp = getMrp(product.name, product.weight, product.price);
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
                <span className={styles.productBadge}>{product.badge}</span>
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

                <div className={styles.productBottom}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'baseline' }}>
                            {mrp && <del className={styles.productMrp}>₹{mrp}</del>}
                            <strong>₹{product.price}</strong>
                        </div>
                        <span>incl. taxes</span>
                    </div>
                    <button
                        className={`${styles.addButton} ${isAdded ? styles.addButtonDone : ""
                            }`}
                        onClick={() => onAdd(product.id)}
                        aria-label={`Add ${product.name} to bag`}
                    >
                        {isAdded ? <Check size={19} /> : <ShoppingBag size={19} />}
                        <span>{isAdded ? "Added" : "Quick add"}</span>
                    </button>
                </div>
            </div>
        </motion.article>
    );
}

export default ProductCard;
