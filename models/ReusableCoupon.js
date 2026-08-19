import mongoose from "mongoose";

const ReusableCouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
}, { timestamps: true });

export default mongoose.models.ReusableCoupon || mongoose.model("ReusableCoupon", ReusableCouponSchema);
