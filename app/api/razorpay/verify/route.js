import { NextResponse } from "next/server";
import crypto from "crypto";
import { processOrder } from "@/lib/orders";

export async function POST(req) {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      cartId,
      customerData,
    } = await req.json();

    // 1. Verify Razorpay Signature
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      throw new Error("Razorpay secret not configured");
    }

    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // 2. Process Order via Shared Helper
    const result = await processOrder({
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      cartId,
      customerData,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in verification:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: error.message === "Cart not found" ? 404 : 500 }
    );
  }
}
