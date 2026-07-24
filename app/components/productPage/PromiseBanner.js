import styles from "../../products/products.module.css";

export default function PromiseBanner() {
  return (
    <section className={styles.promiseBanner}>
      <h2>
        Real ingredients, <br className="hidden md:block" />
        Real nutrition
      </h2>
      <div>
        <span>All Natural</span>
        <span>Super Tasty</span>
        <span>Made in India</span>
      </div>
    </section>
  );
}
