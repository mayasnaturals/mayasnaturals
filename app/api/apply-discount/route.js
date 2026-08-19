import { NextResponse } from "next/server";
import { applyDiscountToCart, getCart } from "@/lib/shopify";
import dbConnect from "@/lib/mongodb";
import ReusableCoupon from "@/models/ReusableCoupon";
export async function POST(req) {
  try {
    const { cartId, code, email } = await req.json();

    if (!cartId || !code || !email) {
      return NextResponse.json(
        { error: "Cart ID, Discount Code, and Email are required." },
        { status: 400 }
      );
    }

    // 1. Fetch existing cart to get currently applied codes
    const cart = await getCart(cartId);
    if (!cart) {
      return NextResponse.json({ error: "Cart not found." }, { status: 404 });
    }

    // Check if this code is already applied
    const existingCodes = (cart.discountCodes || [])
      .filter(dc => dc.applicable)
      .map(dc => dc.code);

    if (existingCodes.some(c => c.toLowerCase() === code.toLowerCase())) {
      return NextResponse.json(
        { error: "This discount code is already applied." },
        { status: 400 }
      );
    }

    if (existingCodes.length >= 2) {
      return NextResponse.json(
        { error: "You can only apply a maximum of 2 discount codes." },
        { status: 400 }
      );
    }

    // 2. Check Shopify Admin API for previous usage (to enforce 1-per-customer for manual entries)
    const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    let adminToken;
    try {
      const { getShopifyAdminToken } = await import("@/lib/shopify/adminAuth");
      adminToken = await getShopifyAdminToken();
    } catch (e) {
      console.warn("Could not load admin token:", e);
    }

    if (adminToken) {
      const shopifyRes = await fetch(
        `https://${domain}/admin/api/2024-01/orders.json?email=${encodeURIComponent(email)}&status=any&fields=discount_codes`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": adminToken,
          },
        }
      );

      if (shopifyRes.ok) {
        const data = await shopifyRes.json();
        const orders = data.orders || [];
        
        // Check if any previous order used this exact coupon (handling custom + strings)
        const hasUsedBefore = orders.some(order => 
          order.discount_codes?.some(dc => 
            dc.code.toLowerCase().includes(code.toLowerCase())
          )
        );

        // Fetch reusable coupons from DB
        await dbConnect();
        const reusableCoupons = await ReusableCoupon.find({}, { code: 1, _id: 0 });
        const reusableCodes = reusableCoupons.map(rc => rc.code.toLowerCase());

        const isReusable = reusableCodes.includes(code.toLowerCase());
        if (hasUsedBefore && !isReusable) {
          return NextResponse.json(
            { error: `You have already used the discount code "${code}" on a previous order.` },
            { status: 400 }
          );
        }
      }
    }

    // 3. Apply ALL existing codes + the new one
    const allCodes = [...existingCodes, code];
    const updatedCart = await applyDiscountToCart(cartId, allCodes);

    // Check if Storefront API marked the NEW code as not applicable
    const appliedCode = updatedCart.discountCodes?.find(
      (dc) => dc.code.toLowerCase() === code.toLowerCase()
    );

    if (appliedCode && !appliedCode.applicable) {
      // Revert: re-apply only the previously valid codes
      await applyDiscountToCart(cartId, existingCodes);
      return NextResponse.json(
        { error: "This discount code is not valid or not applicable to your cart." },
        { status: 400 }
      );
    }

    return NextResponse.json({ cart: updatedCart });
  } catch (error) {
    console.error("Error applying discount:", error);
    return NextResponse.json(
      { error: error.message || "Failed to apply discount code." },
      { status: 500 }
    );
  }
}
