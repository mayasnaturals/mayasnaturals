import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const archived = searchParams.get('archived') === 'true';
    const timeframe = searchParams.get('timeframe') || 'all';

    const isTestEnv = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.startsWith("rzp_test") || false;

    const query = {};
    if (archived) {
      query.isArchived = true;
    } else {
      query.isArchived = { $ne: true };
    }

    if (isTestEnv) {
      query.$or = [
        { isTestOrder: true },
        { isTestOrder: { $exists: false } }
      ];
    } else {
      query.isTestOrder = false;
    }

    if (timeframe !== 'all') {
      const now = new Date();
      let startDate;

      if (timeframe === 'month') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      } else if (timeframe === 'week') {
        const day = now.getDay();
        const diff = now.getDate() - day; // Sunday as start of week
        startDate = new Date(now.setDate(diff));
        startDate.setHours(0, 0, 0, 0);
      } else if (timeframe === 'quarter') {
        const quarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), quarter * 3, 1);
      }

      if (startDate) {
        query.createdAt = { $gte: startDate };
      }
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Admin orders fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
