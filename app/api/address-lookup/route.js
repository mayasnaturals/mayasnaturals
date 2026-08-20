import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    let phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
    }

    // Remove all white spaces and trim
    phone = phone.replace(/\s+/g, "").trim();

    if (phone.length < 10) {
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
    }

    await dbConnect();

    // Find the most recent successful order matching the last 10 digits
    const order = await Order.findOne({ 
      "customerData.phone": { $regex: phone.slice(-10) + "$", $options: "i" },
      status: "Success"
    }).sort({ createdAt: -1 });

    if (!order) {
      return NextResponse.json({ found: false });
    }

    return NextResponse.json({
      found: true,
      data: {
        firstName: order.customerData.firstName,
        lastName: order.customerData.lastName,
        address: order.shippingDetails.address,
        city: order.shippingDetails.city,
        state: order.shippingDetails.state,
        pincode: order.shippingDetails.pincode,
      }
    });

  } catch (error) {
    console.error("Address lookup error:", error);
    return NextResponse.json({ error: "Failed to lookup address" }, { status: 500 });
  }
}
