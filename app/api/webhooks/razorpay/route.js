import { NextResponse } from "next/server";
import crypto from "crypto";
import { processOrder } from "@/lib/orders";

export async function POST(req) {
  try {
    const bodyText = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret) {
      console.error("RAZORPAY_WEBHOOK_SECRET is not configured.");
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
    }

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Verify Webhook Signature
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(bodyText)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(bodyText);

    // We only care about order.paid or payment.captured
    if (event.event === "order.paid" || event.event === "payment.captured") {
      const paymentEntity = event.payload.payment?.entity;
      const orderEntity = event.payload.order?.entity;

      const razorpay_payment_id = paymentEntity?.id;
      const razorpay_order_id = paymentEntity?.order_id || orderEntity?.id;
      
      // Extract cartId and customerData from the notes we saved during create-order
      const notes = orderEntity?.notes || paymentEntity?.notes || {};
      const cartId = notes.cartId;

      if (!cartId) {
        console.warn(`Webhook received for order ${razorpay_order_id} but no cartId found in notes.`);
        return NextResponse.json({ success: true, message: "Ignored: No cartId in notes" });
      }

      const customerData = {
        firstName: notes.firstName || "",
        lastName: notes.lastName || "",
        email: notes.email || "",
        phone: notes.phone || "",
        address: notes.address || "",
        city: notes.city || "",
        state: notes.state || "",
        pincode: notes.pincode || "",
      };

      // Since this is a webhook, we don't have the frontend's payment signature.
      // But we know it's authentic because we verified the webhook signature.
      // We pass a dummy or empty signature to processOrder, or we can just pass the webhook signature.
      // We'll pass the webhook signature as the signature for tracking purposes.
      const razorpay_signature = signature;

      await processOrder({
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        cartId,
        customerData,
      });

      console.log(`Webhook successfully processed order ${razorpay_order_id}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing Razorpay webhook:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
