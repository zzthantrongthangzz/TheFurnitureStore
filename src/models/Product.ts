import mongoose, { Schema, Document } from "mongoose";

const AttributeSchema = new Schema(
  {
    key: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

const VariantSchema = new Schema({
  sku: { type: String },
  color: { type: String },
  size: { type: String },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  inStock: { type: Number, default: 0 },
  imageUrl: { type: String },
});

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    discountPercent: { type: Number },
    tags: [{ type: String }],
    imageUrl: { type: String, required: true },
    gallery: [{ type: String }],
    category: { type: String, required: true },
    subCategory: { type: String },
    collectionName: { type: String },
    attributes: [AttributeSchema],
    variants: [VariantSchema],
    inStock: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, collection: "products" }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);