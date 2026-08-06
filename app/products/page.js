import { getProducts } from "@/lib/shopify";
import ProductCatalog from "./ProductCatalog";

export const metadata = {
  title: "Shop Maya | Muesli & Makhana",
  description:
    "Shop colorful craft muesli and crunchy makhana from Maya. Filter by type, price, and newest drops.",
};

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const shopifyProducts = await getProducts(50);
  
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
        id: variant?.id || p.id,
        variantId: variant?.id,
        handle: p.handle,
        name: p.title,
        type: productType,
        price: price,
        availableForSale: variant?.availableForSale !== undefined ? variant.availableForSale : true,
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
  });

  const groupedProducts = {};
  formattedProducts.forEach(p => {
    if (!groupedProducts[p.handle]) groupedProducts[p.handle] = [];
    groupedProducts[p.handle].push(p);
  });

  const finalProducts = [];
  for (const [handle, variants] of Object.entries(groupedProducts)) {
    variants.sort((a, b) => {
       const weightA = parseInt(a.weight) || a.price || 0;
       const weightB = parseInt(b.weight) || b.price || 0;
       return weightA - weightB;
    });

    const anyAvailable = variants.some(v => v.availableForSale);

    const processedVariants = variants.map(v => ({
       ...v,
       hasOtherAvailableVariants: anyAvailable && !v.availableForSale
    }));

    const title = processedVariants[0].name.toLowerCase();
    const type = processedVariants[0].type.toLowerCase();

    if (title.includes('makhana') || type === 'makhana') {
      finalProducts.push(processedVariants[0]);
    } else if (title.includes('super')) {
      finalProducts.push(processedVariants[0]);
    } else if (title.includes('choc')) {
      finalProducts.push(processedVariants.length > 1 ? processedVariants[1] : processedVariants[0]);
    }
  }

  return <ProductCatalog initialProducts={finalProducts} />;
}
