import { NextResponse } from "next/server";
import { applyDiscountToCart } from "@/lib/shopify";

export async function POST(req) {
  try {
    const { cartId } = await req.json();

    if (!cartId) {
      return NextResponse.json({ error: "Cart ID is required." }, { status: 400 });
    }

    // Applying an empty array clears all discount codes from the cart
    const updatedCart = await applyDiscountToCart(cartId, []);
    
    return NextResponse.json({ cart: updatedCart });
  } catch (error) {
    console.error("Error removing discount:", error);
    return NextResponse.json(
      { error: "Failed to remove discount code." },
      { status: 500 }
    );
  }
}
