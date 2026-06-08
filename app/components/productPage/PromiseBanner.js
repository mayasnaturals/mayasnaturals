import styles from "../../products/products.module.css";

export default function PromiseBanner() {
  return (
    <section className={styles.promiseBanner}>
      <p>Nothing hidden. Nothing beige.</p>
      <h2>Real ingredients, made ridiculously snackable.</h2>
      <div>
        <span>No palm oil</span>
        <span>Whole grains</span>
        <span>Made in India</span>
      </div>
    </section>
  );
}
