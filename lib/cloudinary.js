import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a base64 image to Cloudinary in the "reviews" folder.
 * Enforces server-side compression/resizing (max width 1920px, auto quality, auto format).
 * 
 * @param {string} base64Image - The base64 string of the image
 * @returns {Promise<Object>} - The uploaded image details (url, public_id)
 */
export const uploadReviewImage = async (base64Image) => {
  try {
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: 'reviews',
      // Enforce limits and optimization via Cloudinary
      transformation: [
        { width: 1920, crop: 'limit' },
        { quality: 'auto', fetch_format: 'auto' }
      ]
    });
    
    return {
      url: result.secure_url,
      public_id: result.public_id,
      size: result.bytes,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

export default cloudinary;
