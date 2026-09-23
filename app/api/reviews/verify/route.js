import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const productName = searchParams.get('productName');

    if (!email || !productName) {
      return NextResponse.json({ error: 'Missing email or product name' }, { status: 400 });
    }

    await dbConnect();

    const escapedEmail = email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    const hasBought = await Order.findOne({
      "customerData.email": { $regex: new RegExp(`^${escapedEmail}$`, 'i') },
      "orderDetails.items": {
        $elemMatch: {
          title: { $regex: new RegExp(productName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') }
        }
      }
    });

    if (hasBought) {
      return NextResponse.json({ verified: true }, { status: 200 });
    } else {
      return NextResponse.json({ verified: false }, { status: 200 });
    }

  } catch (error) {
    console.error('Verify purchase error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
