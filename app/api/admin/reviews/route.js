import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Review from "@/models/Review";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    
    // Fetch all reviews, sort by newest first
    const reviews = await Review.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    console.error("Admin reviews fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
