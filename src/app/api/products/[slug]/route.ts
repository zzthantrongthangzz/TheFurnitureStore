import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Product from "@/models/Product"; 

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI as string);
};

// CẬP NHẬT: Đổi kiểu params thành Promise
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> } 
) {
  try {
    await connectDB();
    
    // CẬP NHẬT: Phải await params trước khi dùng
    const resolvedParams = await params; 
    
    // Sử dụng resolvedParams.slug
    const product = await Product.findOne({ slug: resolvedParams.slug, isActive: true });
    
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}