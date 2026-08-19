import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ReusableCoupon from "@/models/ReusableCoupon";

export async function GET() {
  try {
    await dbConnect();
    const coupons = await ReusableCoupon.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, coupons });
  } catch (error) {
    console.error("Error fetching reusable coupons:", error);
    return NextResponse.json({ error: "Failed to fetch reusable coupons" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const { code } = await req.json();

    if (!code || typeof code !== "string" || code.trim() === "") {
      return NextResponse.json({ error: "A valid coupon code is required." }, { status: 400 });
    }

    const newCoupon = new ReusableCoupon({ code: code.trim().toUpperCase() });
    await newCoupon.save();

    return NextResponse.json({ success: true, coupon: newCoupon });
  } catch (error) {
    console.error("Error adding reusable coupon:", error);
    if (error.code === 11000) {
      return NextResponse.json({ error: "This coupon code already exists." }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to add reusable coupon" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "Coupon ID is required." }, { status: 400 });
    }

    await ReusableCoupon.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting reusable coupon:", error);
    return NextResponse.json({ error: "Failed to delete reusable coupon" }, { status: 500 });
  }
}
