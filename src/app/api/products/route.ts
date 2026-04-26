import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import ProductModel from "@/models/Product";

export async function GET() {
  try {
    await connectToDatabase();
    const products = await ProductModel.find({}).lean();
    // Đảm bảo luôn trả về mảng
    return NextResponse.json(products || []);
  } catch (error) {
    console.error("API Error:", error);
    // Trả về mảng rỗng để Frontend .map() không bị lỗi,
    // kèm theo header status 500 để vẫn biết là có lỗi.
    return NextResponse.json([], { status: 500 });
  }
}
