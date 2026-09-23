import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    productHandle: {
      type: String,
      required: true,
      index: true,
    },
    productName: {
      type: String,
    },
    customerEmail: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    images: [
      {
        url: String,
        public_id: String,
        size: Number,
      },
    ],
    verifiedPurchase: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved", // Default to approved for now as requested
    },
  },
  { timestamps: true }
);

export default mongoose.models.Review || mongoose.model("Review", ReviewSchema);
