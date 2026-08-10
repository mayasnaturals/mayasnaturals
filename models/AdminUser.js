import mongoose from "mongoose";

const AdminUserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Storing hashed password
}, { timestamps: true });

export default mongoose.models.AdminUser || mongoose.model("AdminUser", AdminUserSchema);
