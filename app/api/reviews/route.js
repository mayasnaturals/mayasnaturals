import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Review from '@/models/Review';
import { uploadReviewImage } from '@/lib/cloudinary';

export async function POST(req) {
  try {
    const formData = await req.formData();
    
    const email = formData.get('email');
    const productHandle = formData.get('productHandle');
    const productName = formData.get('productName');
    const rating = formData.get('rating');
    const title = formData.get('title');
    const description = formData.get('description');
    
    // Get all image files from FormData
    const images = formData.getAll('images');

    if (!email || !productHandle || !productName || !rating || !title || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (images.length > 3) {
      return NextResponse.json({ error: 'Maximum 3 images allowed' }, { status: 400 });
    }

    await dbConnect();

    // Verify if the user bought this product
    const escapedEmail = email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const hasBought = await Order.findOne({
      "customerData.email": { $regex: new RegExp(`^${escapedEmail}$`, 'i') },
      "orderDetails.items": {
        $elemMatch: {
          title: { $regex: new RegExp(productName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') }
        }
      }
    });

    if (!hasBought) {
      return NextResponse.json(
        { error: 'You can only review products you have purchased.' },
        { status: 403 }
      );
    }

    // Upload images to Cloudinary (up to 3)
    const uploadedImages = [];
    let partialFailures = 0;

    for (const imageFile of images) {
      if (imageFile instanceof File) {
        // Enforce arbitrary 15MB file limit to prevent abuse just in case (client compresses, but we guard)
        if (imageFile.size > 15 * 1024 * 1024) {
           return NextResponse.json({ error: 'Image file too large' }, { status: 400 });
        }
        
        try {
          // Convert File to base64 for Cloudinary upload
          const arrayBuffer = await imageFile.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const base64Img = `data:${imageFile.type};base64,${buffer.toString('base64')}`;
          
          const uploadResult = await uploadReviewImage(base64Img);
          uploadedImages.push(uploadResult);
        } catch (err) {
          console.error("Image upload failed:", err);
          partialFailures++;
        }
      }
    }

    // Create the review
    const newReview = await Review.create({
      productHandle,
      productName,
      customerEmail: email,
      rating: Number(rating),
      title,
      description,
      images: uploadedImages,
      verifiedPurchase: true,
      status: "pending"
    });

    return NextResponse.json({ 
      success: true, 
      review: newReview,
      message: partialFailures > 0 
        ? `Review submitted, but ${partialFailures} image(s) failed to upload.`
        : 'Review submitted successfully.'
    }, { status: 201 });

  } catch (error) {
    console.error('Submit review error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
