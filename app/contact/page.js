import { getProducts } from "@/lib/shopify";
import ContactWheel from "./ContactWheel";

export const metadata = {
  title: "Interactive Showcase | Maya",
  description: "Explore our dynamic full-circle product showcase.",
};

export default async function ContactPage() {
  const shopifyProducts = await getProducts(50);
  
  const formattedProducts = (shopifyProducts || []).map((p) => {
    const firstVariant = p.variants?.edges[0]?.node;
    return {
      id: firstVariant?.id || p.id,
      handle: p.handle,
      name: p.title,
      type: p.productType || "Product",
      price: parseFloat(p.priceRange?.minVariantPrice?.amount || 0),
      description: p.description,
      badge: p.badge?.value || null,
      newness: parseInt(p.newness?.value) || 5,
      image: p.images?.edges[0]?.node?.url || "/products/Default Museli.png",
      weight: firstVariant?.weight ? `${firstVariant.weight}${firstVariant.weightUnit.toLowerCase()}` : "400g",
      colors: [
        p.colorDark?.value || "#2A1A10", 
        p.colorMid?.value || "#E8752A", 
        p.colorLight?.value || "#FFF8F0"
      ],
    };
  });

  return <ContactWheel products={formattedProducts} />;
}
