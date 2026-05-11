// src/models/Order.ts
import mongoose, { Schema } from "mongoose";

const OrderSchema = new Schema(
  {
    customerInfo: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      note: { type: String },
      paymentMethod: { type: String, default: "COD" },
    },
    items: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        imageUrl: { type: String },
        slug: { type: String },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "PENDING",
    },
  },
  { timestamps: true, collection: "orders" },
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
