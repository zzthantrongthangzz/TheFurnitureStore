import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import ProductModel from "@/models/Product";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDatabase();
    const products = await ProductModel.find({}).lean();
    return NextResponse.json(products || []);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
