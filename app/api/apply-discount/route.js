import { NextResponse } from "next/server";
import { applyDiscountToCart } from "@/lib/shopify";
import { getShopifyAdminToken } from "@/lib/shopify/adminAuth";

export async function POST(req) {
  try {
    const { cartId, code, email } = await req.json();

    if (!cartId || !code || !email) {
      return NextResponse.json(
        { error: "Cart ID, Discount Code, and Email are required." },
        { status: 400 }
      );
    }

    // 1. Fetch Admin Token to check order history
    const adminToken = await getShopifyAdminToken();
    if (!adminToken) {
      return NextResponse.json(
        { error: "Internal server error. Cannot verify discount code usage." },
        { status: 500 }
      );
    }

    // 2. Check past orders for this email
    const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    const ordersRes = await fetch(
      `https://${domain}/admin/api/2024-01/orders.json?email=${encodeURIComponent(
        email
      )}&status=any`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": adminToken,
        },
      }
    );

    if (!ordersRes.ok) {
      console.error("Failed to fetch past orders from Shopify Admin");
      return NextResponse.json(
        { error: "Failed to verify discount history." },
        { status: 500 }
      );
    }

    const ordersData = await ordersRes.json();
    
    // Check if the discount code was used in any of these orders
    const codeUsed = ordersData.orders?.some((order) => {
      return order.discount_codes?.some(
        (dc) => dc.code.toLowerCase() === code.toLowerCase()
      );
    });

    if (codeUsed) {
      return NextResponse.json(
        { error: "You have already used this discount code on a previous order." },
        { status: 400 }
      );
    }

    // 3. Apply the discount code to the cart via Storefront API
    const updatedCart = await applyDiscountToCart(cartId, [code]);

    // Check if Storefront API marked the code as not applicable
    const appliedCode = updatedCart.discountCodes?.find(
      (dc) => dc.code.toLowerCase() === code.toLowerCase()
    );

    if (appliedCode && !appliedCode.applicable) {
      // Remove it from the cart so it doesn't stay there as an invalid code
      await applyDiscountToCart(cartId, []);
      return NextResponse.json(
        { error: "This discount code is not applicable to your cart." },
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
