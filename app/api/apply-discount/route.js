import { NextResponse } from "next/server";
import { applyDiscountToCart, getCart } from "@/lib/shopify";

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

    // 2. Apply ALL existing codes + the new one
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
