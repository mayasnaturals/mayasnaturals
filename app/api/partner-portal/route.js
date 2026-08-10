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

    // Query for orders that successfully used this exact coupon (case-insensitive)
    // We only care about Successful orders for influencer metrics.
    const query = {
      couponsUsed: { $regex: new RegExp(`^${coupon.trim()}$`, "i") },
      status: "Success",
    };

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
