"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";

import CatalogHero from "../components/productPage/CatalogHero";
import EmptyState from "../components/productPage/EmptyState";
import FilterDrawer from "../components/productPage/FilterDrawer";
import FilterPanel from "../components/productPage/FilterPanel";
import ProductGrid from "../components/productPage/ProductGrid";
import PromiseBanner from "../components/productPage/PromiseBanner";
import SortSelect from "../components/productPage/SortSelect";
import styles from "./products.module.css";
import { useCart } from "@/context/CartContext";

const MAX_PRICE = 3000;

export default function ProductCatalog({ initialProducts }) {
  const [query, setQuery] = useState("");
  const { addToCart } = useCart();
  const [sortBy, setSortBy] = useState("relevance");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    document.body.style.overflow = isFilterOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFilterOpen]);

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = initialProducts.filter((product) => {
      const matchesQuery =
        !normalizedQuery ||
        `${product.name} ${product.type} ${product.description}`
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesType =
        selectedTypes.length === 0 || selectedTypes.includes(product.type);

      return matchesQuery && matchesType && product.price <= maxPrice;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "new") return b.newness - a.newness;
      if (sortBy === "high") return b.price - a.price;
      if (sortBy === "low") return a.price - b.price;
      return a.id.localeCompare ? a.id.localeCompare(b.id) : a.id - b.id;
    });
  }, [maxPrice, query, selectedTypes, sortBy, initialProducts]);

  const activeFilterCount =
    selectedTypes.length + (query ? 1 : 0) + (maxPrice < MAX_PRICE ? 1 : 0);

  const toggleType = (type) => {
    setSelectedTypes((current) =>
      current.includes(type)
        ? current.filter((item) => item !== type)
        : [...current, type],
    );
  };

  const clearFilters = () => {
    setQuery("");
    setSelectedTypes([]);
    setMaxPrice(MAX_PRICE);
  };

  const handleAdd = async (id) => {
    setAddedId(id);
    await addToCart(id, 1);
    window.setTimeout(() => setAddedId(null), 1600);
  };

  const filterProps = {
    query,
    setQuery,
    selectedTypes,
    toggleType,
    maxPrice,
    setMaxPrice,
    clearFilters,
    activeFilterCount,
  };

  return (
    <div className={styles.page}>
      <CatalogHero />

      <section className={styles.shopSection} id="shop-grid">
        <div className={styles.shopHeader}>
          <div>
            <span className={styles.eyebrow}>Pick your favourite</span>
            <h2>All the good stuff</h2>
          </div>
          <p>
            Crunchy, colourful and built for real life, from slow breakfasts to
            4 PM emergencies.
          </p>
        </div>

        <div className={styles.mobileTools}>
          <button onClick={() => setIsFilterOpen(true)}>
            <SlidersHorizontal size={19} />
            Filters
            {activeFilterCount > 0 && <span>{activeFilterCount}</span>}
          </button>
          <SortSelect sortBy={sortBy} setSortBy={setSortBy} />
        </div>

        <div className={styles.catalogLayout}>
          <aside className={styles.desktopFilters}>
            <FilterPanel {...filterProps} />
          </aside>

          <div className={styles.results}>
            <div className={styles.resultsBar}>
              <p>
                <strong>{visibleProducts.length}</strong>{" "}
                {visibleProducts.length === 1 ? "product" : "products"}
              </p>
              <SortSelect
                sortBy={sortBy}
                setSortBy={setSortBy}
                showLabel
              />
            </div>

            <ProductGrid
              products={visibleProducts}
              addedId={addedId}
              onAdd={handleAdd}
            />

            {visibleProducts.length === 0 && (
              <EmptyState clearFilters={clearFilters} />
            )}
          </div>
        </div>
      </section>

      <PromiseBanner />

      <AnimatePresence>
        {isFilterOpen && (
          <FilterDrawer
            closeDrawer={() => setIsFilterOpen(false)}
            filterProps={filterProps}
            productCount={visibleProducts.length}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
