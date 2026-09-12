import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { productIds, isArchived } = body;

    if (!Array.isArray(productIds)) {
      return NextResponse.json({ success: false, error: 'Invalid productIds array' }, { status: 400 });
    }

    await Product.updateMany(
      { _id: { $in: productIds } },
      { $set: { status: isArchived ? 'archived' : 'active' } }
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error archiving products:', error);
    return NextResponse.json(
      { success: false, error: 'Server Error' },
      { status: 500 }
    );
  }
}
