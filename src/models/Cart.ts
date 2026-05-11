import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  slug: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String },
  quantity: { type: Number, required: true, min: 1, default: 1 },
});

const CartSchema = new mongoose.Schema(
  {
    // Liên kết giỏ hàng với email của user đang đăng nhập
    userEmail: { type: String, required: true, unique: true },
    items: [CartItemSchema],
  },
  { timestamps: true },
);

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);
