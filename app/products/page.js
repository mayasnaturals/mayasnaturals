import { getProducts } from "@/lib/shopify";
import ProductCatalog from "./ProductCatalog";

export const metadata = {
  title: "Shop Maya | Muesli & Makhana",
  description:
    "Shop colorful craft muesli and crunchy makhana from Maya. Filter by type, price, and newest drops.",
};

export default async function ProductsPage() {
  const shopifyProducts = await getProducts(50);
  
  const formattedProducts = (shopifyProducts || []).map((p) => {
    const variants = p.variants?.edges?.map(e => e.node) || [];
    let minWeightVariant = variants[0];
    
    if (variants.length > 0) {
      minWeightVariant = variants.reduce((minVar, currentVar) => {
        const minVal = parseFloat(minVar.weight || 0);
        const currentVal = parseFloat(currentVar.weight || 0);
        if (minVal === 0 && currentVal > 0) return currentVar;
        if (currentVal > 0 && currentVal < minVal) return currentVar;
        return minVar;
      }, variants[0]);
    }
    
    const price = minWeightVariant?.price?.amount 
      ? parseFloat(minWeightVariant.price.amount) 
      : parseFloat(p.priceRange?.minVariantPrice?.amount || 0);
      
    let weightStr = "400g";
    if (minWeightVariant?.weight && minWeightVariant?.weightUnit) {
      weightStr = `${minWeightVariant.weight}${minWeightVariant.weightUnit.toLowerCase()}`;
    } else if (minWeightVariant?.title && minWeightVariant.title !== 'Default Title') {
      weightStr = minWeightVariant.title;
    }

    let productType = p.productType;
    if (!productType || productType.toLowerCase() === 'product') {
       if (p.title.toLowerCase().includes('makhana')) productType = 'Makhana';
       else if (p.title.toLowerCase().includes('museli') || p.title.toLowerCase().includes('muesli')) productType = 'Muesli';
       else productType = 'Snack';
    } else {
       if (productType.toLowerCase().includes('museli')) productType = 'Muesli';
    }

    return {
      id: minWeightVariant?.id || p.id,
      handle: p.handle,
      name: p.title,
      type: productType,
      price: price,
      description: p.description,
      badge: p.badge?.value || null,
      newness: parseInt(p.newness?.value) || 5,
      image: p.images?.edges[0]?.node?.url || "/products/Default Museli.png",
      weight: weightStr,
      colors: [
        p.colorDark?.value || "#2A1A10", 
        p.colorMid?.value || "#E8752A", 
        p.colorLight?.value || "#FFF8F0"
      ],
    };
  });

  return <ProductCatalog initialProducts={formattedProducts} />;
}
