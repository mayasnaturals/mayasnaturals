import { getProducts } from "@/lib/shopify";
import ComboBuilderClient from "./ComboBuilderClient";

export const metadata = {
  title: "Make Your Own Makhana Combo | Shop Maya",
  description: "Customize your own pack of our crunchy, flavorful makhanas.",
};

export default async function ComboBuilderPage() {
  const shopifyProducts = await getProducts(50);
  
  // Format and filter makhanas just like on the main products page
  const formattedProducts = (shopifyProducts || []).flatMap((p) => {
    let productType = p.productType;
    if (!productType || productType.toLowerCase() === 'product') {
       if (p.title.toLowerCase().includes('makhana')) productType = 'Makhana';
       else if (p.title.toLowerCase().includes('museli') || p.title.toLowerCase().includes('muesli')) productType = 'Muesli';
       else productType = 'Snack';
    } else {
       if (productType.toLowerCase().includes('museli')) productType = 'Muesli';
    }

    const variants = p.variants?.edges?.map(e => e.node) || [];
    
    return variants.map((variant) => {
      const price = variant?.price?.amount 
        ? parseFloat(variant.price.amount) 
        : parseFloat(p.priceRange?.minVariantPrice?.amount || 0);
        
      let weightStr = "400g";
      if (variant?.weight && variant?.weightUnit) {
        weightStr = `${variant.weight}${variant.weightUnit.toLowerCase()}`;
      } else if (variant?.title && variant.title !== 'Default Title') {
        weightStr = variant.title;
      }

      return {
        id: p.id,
        variantId: variant?.id,
        handle: p.handle,
        name: p.title,
        type: productType,
        price: price,
        description: p.description,
        badge: p.badge?.value || null,
        image: p.images?.edges[0]?.node?.url || "/products/Default Museli.png",
        weight: weightStr,
        colors: [
          p.colorDark?.value || "#2A1A10", 
          p.colorMid?.value || "#E8752A", 
          p.colorLight?.value || "#FFF8F0"
        ],
      };
    });
  });

  const groupedProducts = {};
  formattedProducts.forEach(p => {
    if (!groupedProducts[p.id]) groupedProducts[p.id] = { ...p, variants: [] };
    groupedProducts[p.id].variants.push({
      variantId: p.variantId,
      weight: p.weight,
      price: p.price
    });
  });

  const makhanaProducts = Object.values(groupedProducts).filter(p => 
    p.type.toLowerCase() === 'makhana' || p.name.toLowerCase().includes('makhana')
  );

  return <ComboBuilderClient initialProducts={makhanaProducts} />;
}
