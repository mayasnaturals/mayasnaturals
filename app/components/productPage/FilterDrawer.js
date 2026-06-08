import { motion } from "framer-motion";
import { X } from "lucide-react";

import styles from "../../products/products.module.css";
import FilterPanel from "./FilterPanel";

export default function FilterDrawer({
  closeDrawer,
  filterProps,
  productCount,
}) {
  return (
    <>
      <motion.button
        className={styles.drawerBackdrop}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeDrawer}
        aria-label="Close filters"
      />
      <motion.aside
        className={styles.filterDrawer}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 260 }}
      >
        <div className={styles.drawerHandle} />
        <button
          className={styles.drawerClose}
          onClick={closeDrawer}
          aria-label="Close filters"
        >
          <X size={22} />
        </button>
        <FilterPanel {...filterProps} />
        <button className={styles.showResultsButton} onClick={closeDrawer}>
          Show {productCount} {productCount === 1 ? "product" : "products"}
        </button>
      </motion.aside>
    </>
  );
}
