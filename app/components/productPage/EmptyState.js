import { motion } from "framer-motion";

import styles from "../../products/products.module.css";

export default function EmptyState({ clearFilters }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.emptyState}
    >
      <span>0 bites found</span>
      <h3>That filter combo is a little too exclusive.</h3>
      <p>Clear the filters and let the full snack shelf back in.</p>
      <button onClick={clearFilters}>Clear filters</button>
    </motion.div>
  );
}
