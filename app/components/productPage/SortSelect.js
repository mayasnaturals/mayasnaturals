import { ChevronDown } from "lucide-react";

import styles from "../../products/products.module.css";

const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "new", label: "New arrivals" },
  { value: "high", label: "Price: high to low" },
  { value: "low", label: "Price: low to high" },
];

export default function SortSelect({ sortBy, setSortBy, showLabel = false }) {
  return (
    <label className={styles.sortSelect}>
      {showLabel && <span>Sort by</span>}
      <select
        value={sortBy}
        onChange={(event) => setSortBy(event.target.value)}
        aria-label="Sort products"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown size={17} />
    </label>
  );
}
