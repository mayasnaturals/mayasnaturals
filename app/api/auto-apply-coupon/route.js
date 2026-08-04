import { NextResponse } from "next/server";
import { applyDiscountToCart, getCart } from "@/lib/shopify";
import { getShopifyAdminToken } from "@/lib/shopify/adminAuth";
import { AUTO_APPLY_COUPON } from "@/config/coupons";

// Simple in-memory rate limiter (Warning: resets on serverless function cold starts, but good enough for basic deterrence)
const rateLimitMap = new Map();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute

export async function POST(req) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    
    // Rate Limiting Logic
    if (rateLimitMap.has(ip)) {
      const data = rateLimitMap.get(ip);
      if (now - data.startTime < RATE_LIMIT_WINDOW_MS) {
        if (data.count >= RATE_LIMIT_MAX) {
          return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
        }
        data.count++;
      } else {
        rateLimitMap.set(ip, { count: 1, startTime: now });
      }
    } else {
      rateLimitMap.set(ip, { count: 1, startTime: now });
    }

    const { cartId, email } = await req.json();

    if (!cartId || !email) {
      return NextResponse.json({ error: "Cart ID and Email are required." }, { status: 400 });
    }

    if (!AUTO_APPLY_COUPON) {
      return NextResponse.json({ success: true, applied: false });
    }

    // 1. Fetch existing cart
    const cart = await getCart(cartId);
    if (!cart) {
      return NextResponse.json({ error: "Cart not found." }, { status: 404 });
    }

    const existingCodes = (cart.discountCodes || [])
      .filter(dc => dc.applicable)
      .map(dc => dc.code);

    // If already applied, silently ignore
    if (existingCodes.some(c => c.toLowerCase() === AUTO_APPLY_COUPON.toLowerCase())) {
      return NextResponse.json({ success: true, applied: false });
    }

    // If they already maxed out their coupons, silently ignore
    if (existingCodes.length >= 2) {
      return NextResponse.json({ success: true, applied: false });
    }

    // 2. Check Shopify Admin API for previous usage
    const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    const adminToken = await getShopifyAdminToken();
    
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
            dc.code.toLowerCase().includes(AUTO_APPLY_COUPON.toLowerCase())
          )
        );

        if (hasUsedBefore) {
          // They used it before, silently ignore and don't apply
          return NextResponse.json({ success: true, applied: false });
        }
      }
    }

    // 3. Apply the auto coupon since it wasn't used before
    const allCodes = [...existingCodes, AUTO_APPLY_COUPON];
    const updatedCart = await applyDiscountToCart(cartId, allCodes);

    const appliedCode = updatedCart.discountCodes?.find(
      (dc) => dc.code.toLowerCase() === AUTO_APPLY_COUPON.toLowerCase()
    );

    if (appliedCode && !appliedCode.applicable) {
      // Revert silently if Storefront API rejects it
      await applyDiscountToCart(cartId, existingCodes);
      return NextResponse.json({ success: true, applied: false });
    }

    return NextResponse.json({ success: true, applied: true, cart: updatedCart });
  } catch (error) {
    console.error("Error auto-applying discount:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
