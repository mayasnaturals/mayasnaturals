import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET() {
  try {
    await dbConnect();
    
    // Aggregate unique users based on email
    const users = await Order.aggregate([
      {
        $group: {
          _id: "$customerData.email",
          firstName: { $first: "$customerData.firstName" },
          lastName: { $first: "$customerData.lastName" },
          phone: { $first: "$customerData.phone" },
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: "$orderDetails.total" },
          allCouponsUsed: { $push: "$couponsUsed" },
          latestAddress: { $first: "$shippingDetails" },
          createdAt: { $first: "$createdAt" }
        }
      },
      {
        $project: {
          email: "$_id",
          firstName: 1,
          lastName: 1,
          phone: 1,
          totalOrders: 1,
          totalSpent: 1,
          latestAddress: 1,
          createdAt: 1,
          // Flatten and unique the coupons used
          couponsUsed: {
            $reduce: {
              input: "$allCouponsUsed",
              initialValue: [],
              in: { $setUnion: ["$$value", "$$this"] }
            }
          }
        }
      },
      { $sort: { totalOrders: -1 } }
    ]);

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("Admin users fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
