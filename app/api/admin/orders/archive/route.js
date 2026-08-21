import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(req) {
  try {
    await dbConnect();
    const { orderIds, isArchived } = await req.json();

    if (!Array.isArray(orderIds) || typeof isArchived !== "boolean") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    if (orderIds.length === 0) {
      return NextResponse.json({ success: true, count: 0 });
    }

    const result = await Order.updateMany(
      { _id: { $in: orderIds } },
      { $set: { isArchived } }
    );

    return NextResponse.json({
      success: true,
      count: result.modifiedCount,
    });
  } catch (error) {
    console.error("Admin archive error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
