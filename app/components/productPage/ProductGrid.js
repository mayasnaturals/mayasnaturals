import { AnimatePresence, motion } from "framer-motion";

import styles from "../../products/products.module.css";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products, addedId, onAdd }) {
  return (
    <motion.div layout className={styles.productGrid}>
      <AnimatePresence mode="popLayout">
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            index={index}
            onAdd={onAdd}
            isAdded={addedId === product.id}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
