import { getProducts } from "@/lib/shopify";
import { products as mockProducts } from "@/data/productData";
import ProductCatalog from "./ProductCatalog";

export const metadata = {
  title: "Shop Maya | Muesli & Makhana",
  description:
    "Shop colorful craft muesli and crunchy makhana from Maya. Filter by type, price, and newest drops.",
};

export default async function ProductsPage() {
  const shopifyProducts = await getProducts(50);
  
  let formattedProducts = [];
  
  if (shopifyProducts && shopifyProducts.length > 0) {
    formattedProducts = shopifyProducts.map((p) => {
      const firstVariant = p.variants?.edges[0]?.node;
      return {
        id: firstVariant?.id || p.id,
        handle: p.handle,
        name: p.title,
        type: p.productType || "Product",
        price: parseFloat(p.priceRange?.minVariantPrice?.amount || 0),
        description: p.description,
        badge: p.tags?.find(t => t.startsWith('badge:'))?.replace('badge:', '') || null,
        newness: 5, // arbitrary newness for sorting
        image: p.images?.edges[0]?.node?.url || "/products/Default Museli.png",
        weight: firstVariant?.weight ? `${firstVariant.weight}${firstVariant.weightUnit.toLowerCase()}` : "400g",
        colors: ["#2A1A10", "#E8752A", "#FFF8F0"], // default fallback colors
      };
    });
  } else {
    // Fallback to mock data if Shopify env vars aren't set
    formattedProducts = mockProducts.map(p => ({
      ...p,
      id: `gid://shopify/ProductVariant/${p.id}`, // Mock variant ID for Cart
    }));
  }

  return <ProductCatalog initialProducts={formattedProducts} />;
}
