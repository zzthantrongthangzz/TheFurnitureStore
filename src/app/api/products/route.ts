import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import ProductModel from "@/models/Product";

export async function GET() {
  try {
    await connectToDatabase();
    const products = await ProductModel.find({}).lean();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi lấy dữ liệu" }, { status: 500 });
  }
}
