import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    customerData: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    shippingDetails: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    orderDetails: {
      items: [
        {
          title: String,
          variant: String,
          quantity: Number,
          unitPrice: Number,
          lineTotal: Number,
          imageUrl: String,
        },
      ],
      subtotal: { type: Number, required: true },
      discountAmount: { type: Number, default: 0 },
      shipping: { type: Number, default: 0 },
      total: { type: Number, required: true },
      shopifyOrderNumber: { type: Number },
      shopifyOrderId: { type: Number },
    },
    razorpayDetails: {
      orderId: { type: String },
      paymentId: { type: String },
      signature: { type: String },
    },
    status: {
      type: String,
      enum: ["Success", "Failed"],
      required: true,
    },
    couponsUsed: {
      type: [String],
      default: [],
    },
    errorReason: {
      type: String,
    },
    isTestOrder: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
