import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET() {
  try {
    await dbConnect();
    const isTestEnv = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.startsWith("rzp_test") || false;

    const query = {};
    if (isTestEnv) {
      query.$or = [
        { isTestOrder: true },
        { isTestOrder: { $exists: false } }
      ];
    } else {
      query.isTestOrder = false;
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Admin orders fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
