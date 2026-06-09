import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Heart,
  Leaf,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";

import { getProductBySlug, getProductSlug, products } from "@/data/productData";
import s from "./detail.module.css";
import DetailAnimations from "./DetailAnimations";

export const dynamicParams = false;

const productCopy = {
  Muesli: {
    headline: "Big breakfast energy with a clean, crunchy finish.",
    texture: "Clustered oats, nuts, seeds and fruit in every spoonful.",
    ingredients: ["Whole oats", "Almonds", "Seeds", "Raisins", "Cocoa notes"],
    rituals: [
      "Cold milk",
      "Greek yogurt",
      "Smoothie bowl",
      "Straight from the jar",
    ],
    nutrition: [
      ["Protein", "9g"],
      ["Fibre", "8g"],
      ["Added sugar", "0g"],
      ["Servings", "10"],
    ],
  },
  Makhana: {
    headline: "A light roasted crunch with full-volume flavour.",
    texture: "Airy fox nuts roasted crisp and coated edge-to-edge.",
    ingredients: [
      "Roasted makhana",
      "Rice bran oil",
      "Spice blend",
      "Pink salt",
    ],
    rituals: ["Movie snack", "Tea break", "Office drawer", "Trail mix topper"],
    nutrition: [
      ["Protein", "5g"],
      ["Fibre", "4g"],
      ["Fried", "No"],
      ["Servings", "3"],
    ],
  },
};

const benefits = [
  { icon: Leaf, label: "No palm oil" },
  { icon: ShieldCheck, label: "Clean label" },
  { icon: Truck, label: "Fast dispatch" },
];

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: getProductSlug(product),
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: "Product not found | Maya" };
  }

  return {
    title: `${product.name} ${product.type} | Maya`,
    description: product.description,
  };
}

export default async function ProductDetailsPage({ params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const copy = productCopy[product.type];
  const [dark, mid, light] = product.colors;
  const relatedProducts = products
    .filter((item) => item.id !== product.id && item.type === product.type)
    .slice(0, 3);

  return (
    <DetailAnimations>
      <div
        className={s.page}
        style={{
          "--product-dark": dark,
          "--product-mid": mid,
          "--product-light": light,
        }}
      >
        {/* ══════ HERO ══════ */}
        <section className={s.hero} data-anim="hero">
          <div className={s.heroTexture} />

          <div className={s.heroInner}>
            {/* Copy */}
            <div className={s.heroCopy}>
              <Link href="/products" className={s.backLink} data-anim="back">
                <ArrowLeft size={16} strokeWidth={3} />
                Back to shop
              </Link>

              <div className={s.badges}>
                <span className={s.badgePrimary} data-anim="badge">
                  {product.badge}
                </span>
                <span className={s.badgeSecondary} data-anim="badge">
                  {product.type} / {product.weight}
                </span>
              </div>

              <h1 className={s.heroTitle} data-anim="title">
                {product.name}
              </h1>

              <p className={s.heroDesc} data-anim="desc">
                {copy.headline} {product.description}
              </p>

              <div className={s.heroActions}>
                <div className={s.priceBox} data-anim="action">
                  <p className={s.priceLabel}>Price</p>
                  <strong className={s.priceValue}>
                    Rs.&nbsp;{product.price}
                  </strong>
                </div>
                <button className={s.addBtn} data-anim="action">
                  <ShoppingBag size={20} strokeWidth={3} />
                  Add to bag
                </button>
              </div>
            </div>

            {/* Image */}
            <div className={s.heroImageWrap}>
              <div className={s.imageCard} data-anim="image">
                <span className={s.crunchBadge} data-anim="crunch">
                  Crunch 10/10
                </span>
                <div className={s.imageFrame}>
                  <Image
                    src={product.image}
                    alt={`${product.name} ${product.type} pack`}
                    fill
                    priority
                    sizes="(max-width: 1024px) 85vw, 480px"
                    className={s.productImg}
                  />
                </div>
                <div className={s.colorStrip}>
                  {[dark, mid, light].map((c) => (
                    <div
                      key={c}
                      className={s.colorSwatch}
                      style={{ backgroundColor: c }}
                      data-anim="swatch"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════ BENEFITS STRIP ══════ */}
        <section className={s.benefits} data-anim="benefits">
          <div className={s.benefitsInner}>
            {benefits.map(({ icon: Icon, label }) => (
              <span key={label} className={s.benefitTag} data-anim="benefit">
                <Icon size={16} strokeWidth={3} />
                {label}
              </span>
            ))}
          </div>
        </section>

        {/* ══════ FEATURE CARDS ══════ */}
        <section className={s.features} data-anim="features">
          {/* Taste Notes */}
          <article
            className={`${s.featureCard} ${s.featureCardCream}`}
            data-anim="feature"
          >
            <Sparkles
              size={30}
              strokeWidth={3}
              className={s.featureIcon}
              style={{ color: "#f25c2a" }}
            />
            <p className={`${s.featureKicker} ${s.featureKickerOrange}`}>
              Taste notes
            </p>
            <h2 className={s.featureTitle}>Built for cravings</h2>
            <p className={s.featureDesc}>
              {copy.texture} The finish is bold, tidy, and snackable.
            </p>
          </article>

          {/* Inside the Pack */}
          <article
            className={`${s.featureCard} ${s.featureCardOrange}`}
            data-anim="feature"
          >
            <Leaf size={30} strokeWidth={3} className={s.featureIcon} />
            <p className={`${s.featureKicker} ${s.featureKickerYellow}`}>
              Inside the pack
            </p>
            <h2 className={s.featureTitle}>Clean crunch</h2>
            <div className={s.ingredientTags}>
              {copy.ingredients.map((item) => (
                <span key={item} className={s.ingredientTag}>
                  {item}
                </span>
              ))}
            </div>
          </article>

          {/* Daily Rituals */}
          <article
            className={`${s.featureCard} ${s.featureCardGreen}`}
            data-anim="feature"
          >
            <Star size={30} strokeWidth={3} className={s.featureIcon} />
            <p className={s.featureKicker}>Best with</p>
            <h2 className={s.featureTitle}>Daily rituals</h2>
            <ul className={s.ritualsList}>
              {copy.rituals.map((item) => (
                <li key={item} className={s.ritualItem}>
                  <BadgeCheck size={18} strokeWidth={3} />
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </section>

        {/* ══════ NUTRITION FACTS ══════ */}
        <section className={s.nutrition} data-anim="nutrition">
          <div className={s.nutritionInner}>
            <div data-anim="nutrition-text">
              <p className={s.nutritionKicker}>Serving facts</p>
              <h2 className={s.nutritionTitle}>Clean, loud, ready.</h2>
            </div>
            <div className={s.nutritionGrid}>
              {copy.nutrition.map(([label, value]) => (
                <div key={label} className={s.nutritionStat} data-anim="stat">
                  <p>{label}</p>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════ ONE PACK MANY MOODS ══════ */}
        <section className={s.onePack} data-anim="onepack">
          <div data-anim="onepack-text">
            <p className={s.onePackKicker}>Make it yours</p>
            <h2 className={s.onePackTitle}>One pack. Many moods.</h2>
          </div>

          <div className={s.qtyCard} data-anim="onepack-card">
            <div className={s.qtyRow}>
              <div>
                <p className={s.qtyLabel}>Quantity</p>
                <strong className={s.qtyValue}>1 pack</strong>
              </div>
              <div className={s.qtyBtns}>
                <button className={s.qtyBtn} aria-label="Decrease quantity">
                  <Minus size={18} strokeWidth={3} />
                </button>
                <button
                  className={`${s.qtyBtn} ${s.qtyBtnAccent}`}
                  aria-label="Increase quantity"
                >
                  <Plus size={18} strokeWidth={3} />
                </button>
              </div>
            </div>
            <p className={s.storeTip}>
              <Heart size={20} strokeWidth={3} className={s.storeTipIcon} />
              Store sealed in a cool, dry spot. Once opened, finish within 30
              days for the best crunch.
            </p>
          </div>
        </section>

        {/* ══════ RELATED PRODUCTS ══════ */}
        {relatedProducts.length > 0 && (
          <section className={s.related} data-anim="related">
            <div className={s.relatedInner}>
              <div className={s.relatedHeader}>
                <div>
                  <p className={s.relatedKicker}>Keep browsing</p>
                  <h2 className={s.relatedTitle}>More {product.type}</h2>
                </div>
                <Link href="/products" className={s.shopAllLink}>
                  Shop all
                </Link>
              </div>

              <div className={s.relatedGrid}>
                {relatedProducts.map((item) => (
                  <Link
                    key={item.id}
                    href={`/products/${getProductSlug(item)}`}
                    className={s.relatedCard}
                    data-anim="related-card"
                  >
                    <div
                      className={s.relatedCardImage}
                      style={{ backgroundColor: item.colors[2] }}
                    >
                      <Image
                        src={item.image}
                        alt={`${item.name} pack`}
                        fill
                        sizes="(max-width: 560px) 90vw, (max-width: 768px) 45vw, 33vw"
                        className={s.relatedCardImg}
                      />
                    </div>
                    <div className={s.relatedCardBody}>
                      <p className={s.relatedCardMeta}>
                        {item.type} / {item.weight}
                      </p>
                      <h3 className={s.relatedCardName}>{item.name}</h3>
                      <strong className={s.relatedCardPrice}>
                        Rs.&nbsp;{item.price}
                      </strong>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </DetailAnimations>
  );
}
