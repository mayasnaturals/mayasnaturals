import { AnimatePresence, motion } from "framer-motion";

import styles from "../../products/products.module.css";
import ProductCard from "./ProductCard";
import ComboCard from "./ComboCard";

export default function ProductGrid({ products, addedId, onAdd }) {
  return (
    <motion.div layout className={styles.productGrid}>
      <AnimatePresence mode="popLayout">
        <ComboCard key="combo-card-makhana" index={0} />
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            index={index + 1}
            onAdd={onAdd}
            isAdded={addedId === product.id}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
