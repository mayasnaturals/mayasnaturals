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

export const dynamicParams = false;

const productCopy = {
  Muesli: {
    headline: "Big breakfast energy with a clean, crunchy finish.",
    texture: "Clustered oats, nuts, seeds and fruit in every spoonful.",
    ingredients: ["Whole oats", "Almonds", "Seeds", "Raisins", "Cocoa notes"],
    rituals: ["Cold milk", "Greek yogurt", "Smoothie bowl", "Straight from the jar"],
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
    ingredients: ["Roasted makhana", "Rice bran oil", "Spice blend", "Pink salt"],
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
    return {
      title: "Product not found | Maya",
    };
  }

  return {
    title: `${product.name} ${product.type} | Maya`,
    description: product.description,
  };
}

export default async function ProductDetailsPage({ params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const copy = productCopy[product.type];
  const [dark, mid, light] = product.colors;
  const relatedProducts = products
    .filter((item) => item.id !== product.id && item.type === product.type)
    .slice(0, 3);

  return (
    <div
      className="min-h-screen bg-[#fff8eb] text-[#29180e]"
      style={{
        "--product-dark": dark,
        "--product-mid": mid,
        "--product-light": light,
      }}
    >
      <section className="relative overflow-hidden border-b-[3px] border-[#29180e] bg-[var(--product-mid)] px-5 pb-16 pt-32 text-[#fff9ed] sm:px-8 lg:px-12 lg:pb-20 lg:pt-36">
        <div className="absolute inset-0 bg-[radial-gradient(#29180e_1.2px,transparent_1.2px)] bg-[length:18px_18px] opacity-20" />

        <div className="relative mx-auto grid w-full max-w-[1320px] gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,0.85fr)] lg:items-center">
          <div className="min-w-0">
            <Link
              href="/products"
              className="mb-7 inline-flex items-center gap-2 rounded-full border-2 border-[#29180e] bg-[#fff8eb] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#29180e] shadow-[4px_4px_0_#29180e] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0_#29180e]"
            >
              <ArrowLeft size={16} strokeWidth={3} />
              Back to shop
            </Link>

            <div className="mb-5 flex flex-wrap gap-3">
              <span className="rounded-full border-2 border-[#29180e] bg-[#ffc833] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#29180e] shadow-[4px_4px_0_#29180e]">
                {product.badge}
              </span>
              <span className="rounded-full border-2 border-[#29180e] bg-[#fff8eb] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#29180e]">
                {product.type} / {product.weight}
              </span>
            </div>

            <h1 className="max-w-4xl font-display text-[clamp(3.2rem,8vw,7rem)] font-black uppercase leading-[0.9] tracking-normal [text-shadow:5px_5px_0_#29180e]">
              {product.name}
            </h1>

            <p className="mt-6 max-w-2xl text-base font-bold leading-8 text-[#fff9ed] sm:text-lg">
              {copy.headline} {product.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="rounded-2xl border-2 border-[#29180e] bg-[#fff8eb] px-5 py-4 text-[#29180e] shadow-[5px_5px_0_#29180e]">
                <p className="text-[0.65rem] font-black uppercase tracking-[0.16em] text-[#8a4d32]">
                  Price
                </p>
                <strong className="font-display text-4xl font-black">
                  Rs. {product.price}
                </strong>
              </div>

              <button className="inline-flex min-h-14 items-center gap-3 rounded-full border-2 border-[#29180e] bg-[#29180e] px-6 py-4 text-sm font-black uppercase tracking-[0.08em] text-[#fff9ed] shadow-[5px_5px_0_#ffc833] transition hover:translate-x-1 hover:translate-y-1 hover:bg-[#fff8eb] hover:text-[#29180e] hover:shadow-[3px_3px_0_#ffc833]">
                <ShoppingBag size={20} strokeWidth={3} />
                Add to bag
              </button>
            </div>
          </div>

          <div className="min-w-0">
            <div className="relative mx-auto max-w-[560px] rounded-[28px] border-[3px] border-[#29180e] bg-[#fff8eb] p-3 shadow-[12px_12px_0_#29180e]">
              <div className="absolute -left-3 top-5 z-10 rounded-full border-2 border-[#29180e] bg-[#ff4d2d] px-3 py-2 text-[0.65rem] font-black uppercase tracking-[0.1em] shadow-[3px_3px_0_#29180e] sm:-left-6">
                Crunch 10/10
              </div>
              <div className="relative aspect-square overflow-hidden rounded-[20px] bg-[var(--product-light)]">
                <Image
                  src={product.image}
                  alt={`${product.name} ${product.type} pack`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 560px"
                  className="object-contain p-2 saturate-[1.06] contrast-[1.02]"
                />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[dark, mid, light].map((color) => (
                  <div
                    key={color}
                    className="h-12 rounded-xl border-2 border-[#29180e]"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b-[3px] border-[#29180e] bg-[#ffc833] px-5 py-5 text-[#29180e] sm:px-8">
        <div className="mx-auto flex w-full max-w-[1320px] flex-wrap justify-center gap-3">
          {benefits.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#29180e] bg-[#fff8eb] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] shadow-[3px_3px_0_#29180e]"
            >
              <Icon size={16} strokeWidth={3} />
              {label}
            </span>
          ))}
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1320px] gap-6 px-5 py-16 sm:px-8 lg:grid-cols-3 lg:px-12 lg:py-20">
        <article className="rounded-[24px] border-[3px] border-[#29180e] bg-[#fffdf8] p-6 shadow-[7px_7px_0_#29180e]">
          <Sparkles className="mb-5 text-[#f25c2a]" size={30} strokeWidth={3} />
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#f25c2a]">
            Taste notes
          </p>
          <h2 className="mt-3 font-display text-4xl font-black uppercase leading-none tracking-normal">
            Built for cravings
          </h2>
          <p className="mt-5 text-sm font-semibold leading-7 text-[#715a4b]">
            {copy.texture} The finish is bold, tidy, and snackable.
          </p>
        </article>

        <article className="rounded-[24px] border-[3px] border-[#29180e] bg-[#f25c2a] p-6 text-[#fff9ed] shadow-[7px_7px_0_#29180e]">
          <Leaf className="mb-5" size={30} strokeWidth={3} />
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#ffc833]">
            Inside the pack
          </p>
          <h2 className="mt-3 font-display text-4xl font-black uppercase leading-none tracking-normal">
            Clean crunch
          </h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {copy.ingredients.map((item) => (
              <span
                key={item}
                className="rounded-full border-2 border-[#29180e] bg-[#fff8eb] px-3 py-2 text-xs font-black uppercase text-[#29180e] shadow-[3px_3px_0_#29180e]"
              >
                {item}
              </span>
            ))}
          </div>
        </article>

        <article className="rounded-[24px] border-[3px] border-[#29180e] bg-[#75b843] p-6 text-[#203313] shadow-[7px_7px_0_#29180e]">
          <Star className="mb-5" size={30} strokeWidth={3} />
          <p className="text-xs font-black uppercase tracking-[0.16em]">
            Best with
          </p>
          <h2 className="mt-3 font-display text-4xl font-black uppercase leading-none tracking-normal">
            Daily rituals
          </h2>
          <ul className="mt-5 grid gap-3">
            {copy.rituals.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 rounded-2xl border-2 border-[#29180e] bg-[#effbc8] px-4 py-3 text-sm font-black shadow-[3px_3px_0_#29180e]"
              >
                <BadgeCheck size={18} strokeWidth={3} />
                {item}
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="border-y-[3px] border-[#29180e] bg-[#29180e] px-5 py-16 text-[#fff9ed] sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1320px] gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#ffc833]">
              Serving facts
            </p>
            <h2 className="mt-3 font-display text-[clamp(3rem,5vw,5.4rem)] font-black uppercase leading-[0.92] tracking-normal">
              Clean, loud, ready.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {copy.nutrition.map(([label, value]) => (
              <div
                key={label}
                className="rounded-[22px] border-2 border-[#fff8eb] bg-[#fff8eb] p-5 text-[#29180e] shadow-[5px_5px_0_#ffc833]"
              >
                <p className="text-xs font-black uppercase tracking-[0.12em] text-[#8a4d32]">
                  {label}
                </p>
                <strong className="mt-2 block font-display text-4xl font-black">
                  {value}
                </strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1320px] gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_0.9fr] lg:px-12 lg:py-20">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#f25c2a]">
            Make it yours
          </p>
          <h2 className="mt-3 font-display text-[clamp(3rem,6vw,6rem)] font-black uppercase leading-[0.92] tracking-normal">
            One pack. Many moods.
          </h2>
        </div>

        <div className="rounded-[24px] border-[3px] border-[#29180e] bg-[#fffdf8] p-6 shadow-[7px_7px_0_#29180e]">
          <div className="flex items-center justify-between gap-4 border-b-2 border-[#eadbcc] pb-5">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.12em] text-[#8a4d32]">
                Quantity
              </p>
              <strong className="font-display text-3xl font-black">1 pack</strong>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="grid size-11 place-items-center rounded-full border-2 border-[#29180e] bg-[#fff8eb] shadow-[3px_3px_0_#29180e]"
                aria-label="Decrease quantity"
              >
                <Minus size={18} strokeWidth={3} />
              </button>
              <button
                className="grid size-11 place-items-center rounded-full border-2 border-[#29180e] bg-[#ffc833] shadow-[3px_3px_0_#29180e]"
                aria-label="Increase quantity"
              >
                <Plus size={18} strokeWidth={3} />
              </button>
            </div>
          </div>

          <p className="mt-5 flex items-start gap-3 rounded-2xl bg-[#fff0d4] p-4 text-sm font-bold leading-6 text-[#604435]">
            <Heart
              size={20}
              strokeWidth={3}
              className="mt-1 shrink-0 text-[#f25c2a]"
            />
            Store sealed in a cool, dry spot. Once opened, finish within 30 days
            for the best crunch.
          </p>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="border-t-[3px] border-[#29180e] bg-[#f25c2a] px-5 py-16 text-[#fff9ed] sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1320px]">
            <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#ffc833]">
                  Keep browsing
                </p>
                <h2 className="mt-3 font-display text-[clamp(3rem,5vw,5rem)] font-black uppercase leading-none tracking-normal">
                  More {product.type}
                </h2>
              </div>
              <Link
                href="/products"
                className="w-fit rounded-full border-2 border-[#29180e] bg-[#fff8eb] px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-[#29180e] shadow-[4px_4px_0_#29180e]"
              >
                Shop all
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {relatedProducts.map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${getProductSlug(item)}`}
                  className="group overflow-hidden rounded-[24px] border-[3px] border-[#29180e] bg-[#fff8eb] text-[#29180e] shadow-[7px_7px_0_#29180e] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0_#29180e]"
                >
                  <div
                    className="relative aspect-square"
                    style={{ backgroundColor: item.colors[2] }}
                  >
                    <Image
                      src={item.image}
                      alt={`${item.name} pack`}
                      fill
                      sizes="(max-width: 768px) 90vw, 33vw"
                      className="object-contain p-3 transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-[#f25c2a]">
                      {item.type} / {item.weight}
                    </p>
                    <h3 className="mt-2 font-display text-3xl font-black uppercase leading-none tracking-normal">
                      {item.name}
                    </h3>
                    <strong className="mt-4 block font-display text-2xl font-black">
                      Rs. {item.price}
                    </strong>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
