import { NextResponse } from "next/server";
import { applyDiscountToCart, getCart } from "@/lib/shopify";

export async function POST(req) {
  try {
    const { cartId, code } = await req.json();

    if (!cartId) {
      return NextResponse.json({ error: "Cart ID is required." }, { status: 400 });
    }

    if (code) {
      // Remove a specific code — keep all others
      const cart = await getCart(cartId);
      const existingCodes = (cart?.discountCodes || [])
        .filter(dc => dc.applicable)
        .map(dc => dc.code)
        .filter(c => c.toLowerCase() !== code.toLowerCase());

      const updatedCart = await applyDiscountToCart(cartId, existingCodes);
      return NextResponse.json({ cart: updatedCart });
    } else {
      // No code specified — clear ALL discount codes
      const updatedCart = await applyDiscountToCart(cartId, []);
      return NextResponse.json({ cart: updatedCart });
    }
  } catch (error) {
    console.error("Error removing discount:", error);
    return NextResponse.json(
      { error: "Failed to remove discount code." },
      { status: 500 }
    );
  }
}
