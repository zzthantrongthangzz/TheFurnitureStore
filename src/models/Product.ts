import mongoose, { Schema, Document } from "mongoose";

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    discountPercent: { type: Number },
    tags: [{ type: String }],
    imageUrl: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String },
    collection: { type: String },
    colors: [{ type: String }],
    sizes: [{ type: String }],
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true, collection: "products" },
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
