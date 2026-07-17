import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getCart } from "@/lib/shopify";

export async function POST(req) {
  try {
    const { cartId } = await req.json();

    if (!cartId) {
      return NextResponse.json({ error: "Cart ID is required" }, { status: 400 });
    }

    const cart = await getCart(cartId);

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    const subtotal = parseFloat(cart.cost.subtotalAmount.amount);
    
    if (subtotal === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Shipping logic
    const shipping = subtotal > 0 && subtotal < 500 ? 49 : 0;
    const total = subtotal + shipping;

    // Amount in paise (multiply by 100)
    const amountInPaise = Math.round(total * 100);

    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: {
        cartId: cartId,
      },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { error: error?.error?.description || error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
