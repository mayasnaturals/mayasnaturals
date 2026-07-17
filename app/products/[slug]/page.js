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
  Sparkles,
  Star,
  Truck,
} from "lucide-react";

import { getProducts, getProduct } from "@/lib/shopify";
import s from "./detail.module.css";
import DetailAnimations from "./DetailAnimations";
import VariantSelector from "./VariantSelector";
import ImageGallery from "./ImageGallery";

export const dynamicParams = true;

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
  const shopifyProducts = await getProducts(50);
  return (shopifyProducts || []).map((product) => ({
    slug: product.handle,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const productRaw = await getProduct(slug);

  if (!productRaw) {
    return { title: "Product not found | Maya" };
  }

  return {
    title: `${productRaw.title} ${productRaw.productType || ""} | Maya`,
    description: productRaw.description,
  };
}

export default async function ProductDetailsPage({ params }) {
  const { slug } = await params;
  const productRaw = await getProduct(slug);

  if (!productRaw) notFound();

  const firstVariant = productRaw.variants?.edges[0]?.node;
  const variants = productRaw.variants?.edges.map(e => e.node) || [];
  const options = productRaw.options || [];

  function formatMetafieldValue(mf) {
    if (!mf) return null;

    // Check for references (list of metaobjects)
    if (mf.references?.edges?.length > 0) {
      return mf.references.edges.map(e => {
        const nameField = e.node.fields?.find(f => f.key === 'name' || f.key === 'label');
        return nameField ? nameField.value : (e.node.handle ? e.node.handle.replace(/-/g, " ") : "Unknown");
      }).join(", ");
    }

    // Check for single reference (single metaobject)
    if (mf.reference?.fields) {
      const nameField = mf.reference.fields.find(f => f.key === 'name' || f.key === 'label');
      return nameField ? nameField.value : (mf.reference.handle ? mf.reference.handle.replace(/-/g, " ") : "Unknown");
    }

    // Fallback to parsing JSON array or raw string
    try {
      const parsed = JSON.parse(mf.value);
      if (Array.isArray(parsed)) {
        const clean = parsed.filter(p => typeof p === 'string' && !p.includes("gid://"));
        return clean.length > 0 ? clean.join(", ") : null;
      }
      return typeof parsed === 'string' && parsed.includes("gid://") ? null : parsed;
    } catch {
      return mf.value && typeof mf.value === 'string' && mf.value.includes("gid://") ? null : mf.value;
    }
  }

  const rawMetafields = [
    { key: "Allergen Information", value: formatMetafieldValue(productRaw.allergenCustom || productRaw.allergenShopify || productRaw.allergenShopify2) },
    { key: "Dietary Preferences", value: formatMetafieldValue(productRaw.dietaryCustom || productRaw.dietaryShopify || productRaw.dietaryShopify2) },
    { key: "Flavor", value: formatMetafieldValue(productRaw.flavorCustom || productRaw.flavorShopify || productRaw.flavorShopify2) },
    { key: "Form", value: formatMetafieldValue(productRaw.formCustom || productRaw.formShopify || productRaw.formShopify2) },
  ];
  const metafields = rawMetafields.filter(mf => mf.value);
  const allImages = productRaw.images?.edges.map(e => e.node) || [];

  const product = {
    id: firstVariant?.id || productRaw.id,
    handle: productRaw.handle,
    name: productRaw.title,
    type: productRaw.productType || "Product",
    price: parseFloat(productRaw.priceRange?.minVariantPrice?.amount || 0),
    description: productRaw.description,
    badge: productRaw.badge?.value || null,
    newness: parseInt(productRaw.newness?.value) || 5,
    image: allImages[0]?.url || "/products/Default Museli.png",
    weight: firstVariant?.weight ? `${firstVariant.weight}${firstVariant.weightUnit.toLowerCase()}` : "400g",
    colors: [
      productRaw.colorDark?.value || "#2A1A10",
      productRaw.colorMid?.value || "#E8752A",
      productRaw.colorLight?.value || "#FFF8F0"
    ],
  };

  const copy = productCopy[product.type] || productCopy["Muesli"];
  const [dark, mid, light] = product.colors;

  const allProducts = await getProducts(50);
  const relatedProducts = (allProducts || [])
    .filter((item) => item.id !== productRaw.id && item.productType === productRaw.productType)
    .map(p => {
      const v = p.variants?.edges[0]?.node;
      return {
        id: v?.id || p.id,
        handle: p.handle,
        name: p.title,
        type: p.productType || "Product",
        price: parseFloat(p.priceRange?.minVariantPrice?.amount || 0),
        image: p.images?.edges[0]?.node?.url || "/products/Default Museli.png",
        weight: v?.weight ? `${v.weight}${v.weightUnit.toLowerCase()}` : "400g",
        colors: [
          p.colorDark?.value || "#2A1A10",
          p.colorMid?.value || "#E8752A",
          p.colorLight?.value || "#FFF8F0"
        ],
      };
    })
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
                {product.badge && (
                  <span className={s.badgePrimary} data-anim="badge">
                    {product.badge}
                  </span>
                )}
                <span className={s.badgeSecondary} data-anim="badge">
                  {product.type}
                </span>
              </div>

              <h1 className={s.heroTitle} data-anim="title">
                {product.name}
              </h1>

              <div className={s.heroDesc} data-anim="desc">
                <p><strong>{copy.headline}</strong></p>
                {product.description && product.description.includes("*") ? (
                  <>
                    <p>{product.description.split("*")[0].trim()}</p>
                    <ul className={s.descList}>
                      {product.description.split("*").slice(1).map((point, idx) => (
                        <li key={idx}>{point.trim()}</li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p>{product.description}</p>
                )}
              </div>

              <VariantSelector
                options={options}
                variants={variants}
                initialVariant={firstVariant}
              />
            </div>

            {/* Image */}
            <div className={s.heroVisual} data-anim="visual">
              <div className={s.imageBlock}>
                <ImageGallery
                  images={allImages}
                  productName={product.name}
                  productType={product.type}
                />

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

        {/* ══════ CLEAN CRUNCH ══════ */}
        <section className={s.cleanCrunch} data-anim="features">
          <div className={s.cleanCrunchInner}>
            <h2 className={s.cleanCrunchTitle}>Inside the pack:</h2>
            <div className={s.ingredientTags}>
              {copy.ingredients.map((item) => (
                <span key={item} className={s.ingredientTag} data-anim="feature">
                  {item}
                </span>
              ))}
            </div>
          </div>
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
                    href={`/products/${item.handle}`}
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
