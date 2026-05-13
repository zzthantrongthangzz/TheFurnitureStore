// src/models/Product.ts
import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    discountPercent: { type: Number },
    soldQuantity: { type: Number, default: 0 }, // Trường quan trọng để cập nhật số lượng đã bán
    imageUrl: { type: String, required: true },
    gallery: [{ type: String }],
    category: { type: String, required: true },
    subCategory: { type: String },
    collectionName: { type: String },
    attributes: [
      {
        key: { type: String },
        value: { type: String },
      },
    ],
    variants: [
      {
        sku: { type: String },
        color: { type: String },
        size: { type: String },
        price: { type: Number },
        inStock: { type: Number },
        imageUrl: { type: String },
      },
    ],
    inStock: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, collection: "products" },
);

// Kiểm tra nếu model đã tồn tại thì dùng lại, nếu chưa thì tạo mới
export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
