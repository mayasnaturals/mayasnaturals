import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';

export async function GET(req, { params }) {
  const { handle } = await params;
  try {
    await dbConnect();
    const reviews = await Review.find({ productHandle: handle, status: 'approved' })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ reviews }, { status: 200 });
  } catch (error) {
    console.error('Fetch reviews error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
