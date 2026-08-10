import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const coupon = searchParams.get("coupon");

    if (!coupon || coupon.trim() === "") {
      return NextResponse.json({ orders: [], count: 0 });
    }

    // Connect to the database
    await dbConnect();

    // Determine if the current environment is using test keys
    const isTestEnv = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.startsWith("rzp_test") || false;

    // Query for orders that successfully used this exact coupon (case-insensitive)
    // We only care about Successful orders for influencer metrics.
    const query = {
      couponsUsed: { $regex: new RegExp(`^${coupon.trim()}$`, "i") },
      status: "Success",
    };

    if (isTestEnv) {
      // If we are in test mode, show explicit test orders AND older orders 
      // that were created before the isTestOrder flag was added (which were all tests).
      query.$or = [
        { isTestOrder: true },
        { isTestOrder: { $exists: false } }
      ];
    } else {
      // In production, strictly ONLY show explicit production orders.
      query.isTestOrder = false;
    }

    // Projection: Explicitly EXCLUDE sensitive data.
    // We only include what is absolutely necessary for transparency.
    const projection = {
      "customerData.email": 0,
      "customerData.phone": 0,
      shippingDetails: 0,
      razorpayDetails: 0,
      "orderDetails.shopifyOrderNumber": 0,
      "orderDetails.shopifyOrderId": 0,
      errorReason: 0,
      updatedAt: 0,
      __v: 0,
    };

    // Fetch the filtered orders, sorted by newest first
    const orders = await Order.find(query, projection).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: orders.length,
      orders: orders,
    });
  } catch (error) {
    console.error("Error fetching partner portal data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
