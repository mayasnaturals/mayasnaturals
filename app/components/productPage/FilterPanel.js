import { Check, Search, Sparkles, X } from "lucide-react";

import styles from "../../products/products.module.css";

const MAX_PRICE = 3000;

function FilterPanel({
    query,
    setQuery,
    selectedTypes,
    toggleType,
    maxPrice,
    setMaxPrice,
    clearFilters,
    activeFilterCount,
}) {
    return (
        <div className={styles.filterPanel}>
            <div className={styles.filterHeading}>
                <div>
                    <span className={styles.eyebrow}>Find your crunch</span>
                    <h2>Filters</h2>
                </div>
                {activeFilterCount > 0 && (
                    <button className={styles.clearButton} onClick={clearFilters}>
                        Clear all
                    </button>
                )}
            </div>

            <label className={styles.searchField}>
                <Search size={18} strokeWidth={2.5} />
                <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search snacks"
                />
                {query && (
                    <button
                        type="button"
                        aria-label="Clear search"
                        onClick={() => setQuery("")}
                    >
                        <X size={16} />
                    </button>
                )}
            </label>

            <div className={styles.filterGroup}>
                <span className={styles.filterLabel}>Type</span>
                <div className={styles.typeOptions}>
                    {["Muesli", "Makhana"].map((type) => {
                        const isSelected = selectedTypes.includes(type);
                        return (
                            <button
                                key={type}
                                className={`${styles.typeButton} ${isSelected ? styles.typeButtonActive : ""
                                    }`}
                                onClick={() => toggleType(type)}
                                aria-pressed={isSelected}
                            >
                                <span className={styles.checkbox}>
                                    {isSelected && <Check size={13} strokeWidth={3} />}
                                </span>
                                {type}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className={styles.filterGroup}>
                <div className={styles.priceHeading}>
                    <span className={styles.filterLabel}>Price</span>
                    <strong>Up to ₹{maxPrice}</strong>
                </div>
                <input
                    className={styles.priceRange}
                    type="range"
                    min="200"
                    max={MAX_PRICE}
                    step="25"
                    value={maxPrice}
                    onChange={(event) => setMaxPrice(Number(event.target.value))}
                    style={{ "--range-progress": `${((maxPrice - 200) / 2800) * 100}%` }}
                    aria-label={`Maximum price ₹${maxPrice}`}
                />
                <div className={styles.rangeLabels}>
                    <span>₹200</span>
                    <span>₹3000</span>
                </div>
            </div>

            <div className={styles.filterNote}>
                <Sparkles size={18} fill="currentColor" />
                <p>
                    <strong>Good food, loud mood.</strong>
                    Small-batch snacks made with ingredients you can pronounce.
                </p>
            </div>
        </div>
    );
}

export default FilterPanel;
